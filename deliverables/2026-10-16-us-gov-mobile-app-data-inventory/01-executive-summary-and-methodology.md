# US Government Data Mobile App — Data Source Inventory

## 0. Metadata

- **Prepared Date:** 2026-10-16
- **App Context:** Live US government data mobile app; production-ready inventory for a solo bootstrapped developer targeting a 2-week MVP.
- **Geographic & Jurisdictional Scope:** Federal (National US), State (Michigan statewide), and Local (City of Detroit and Wayne County).
- **Target Technical Stack (Default CQ-01):** Cross-platform mobile (React Native / Flutter) consuming REST/JSON APIs and SODA endpoints.
- **Operating Budget (Default CQ-02):** $0 / Free-tier only for MVP; commercial feeds documented with pricing for v2 scale.
- **Electoral Focus (Default CQ-03):** General-purpose year-round civic tracking with election-night readiness for scheduled federal and state elections.
- **Fiscal Ticker Model (Default CQ-04):** Authoritative Daily Treasury Statement (DTS) and Debt to the Penny daily values, augmented by a client-side modeled per-second interpolation with explicit methodology disclosure.
- **News Redistribution Posture (Default CQ-05):** Strictly metadata, headlines, snippets, publication counts, and outbound canonical links; zero full-text scraping or redistribution.
- **Court Records Depth (Default CQ-08):** Supreme Court of the United States (SCOTUS) primary; federal circuit and district courts via CourtListener/RECAP; PACER retained as optional paid reference.
- **Historical Depth (Default CQ-09):** Most recent completed federal cycle (2024) and current 119th Congress cycle (2025-2026); 20+ years historical fiscal data; 30+ years election data.
- **Verification Standards:** Every cited URL, endpoint, rate limit, and pricing tier has been verified as of 2026-10-16. Any endpoint with external dependency volatility is flagged with `[Verify-Before-Integration]`.

| PARAMETER | SPECIFICATION | STATUS / ASSUMPTION |
| :--- | :--- | :--- |
| Report Standard | Production-Ready Civic Tech Data Dictionary & Architecture | Final Sourced Delivery |
| Target Audience | Solo Full-Stack Mobile Developer (2-Week MVP) & Civic Tech Teams | Production Engineering |
| Primary Data Spine | Official US Government (.gov) REST APIs & Official GPO Repositories | Authoritative Primary |
| Local Data Spine | data.detroitmi.gov SODA API, Michigan SOS, Michigan Legislature | State & Municipal Open Data |
| Streaming Stance | Hybrid: Polling + Webhooks (CourtListener) + Client Interpolation | Mobile-Optimized Architecture |
| Authentication Model | api.data.gov unified key + Free registration tokens (CourtListener, Census) | Zero-Cost Secure Auth |


## 1. Executive Summary

This research report compiles an exhaustive, production-ready data source inventory designed to power a mobile application delivering live United States government and civic data. Across nine distinct categories—National Fiscal Data, Congressional Activity, Executive Branch Actions, Judicial / Federal Courts, Electoral & Political Maps, Voter & Ballot Information, Campaign Finance, News & Public Sentiment, and Michigan / Detroit Local Data—we have inventoried **58 individual sources** and documented **64 core civic data points**.

### Key Strategic Findings

1. **The Modern Federal API Spine (`api.data.gov`):** The modern federal open-data ecosystem has consolidated significantly around unified API infrastructure. A single free API key from `api.data.gov` unlocks the **Congress.gov API v3**, **GovInfo.gov API**, **FEC Open API v1**, and **Regulations.gov API v4**, drastically minimizing authentication overhead for a 2-week MVP.

2. **Zero-Key Authoritative Government Endpoints:** Crucial high-volume federal datasets require **zero API keys** and enforce minimal friction. The **Bureau of the Fiscal Service** (`fiscaldata.treasury.gov`), the **Federal Register API** (`federalregister.gov/api/v1`), and the **USASpending.gov API** (`api.usaspending.gov`) allow instantaneous REST/JSON access with generous rate limits (1,000 to 10,000 requests/hour).

3. **The 'Live National Debt' Reality:** There is **no official sub-second streaming API** provided by the US Department of the Treasury. The official 'Debt to the Penny' and Daily Treasury Statement (DTS) datasets update once per business day (typically by 4:00 PM ET). Real-time ticking debt counters (such as US Debt Clock) are mathematical interpolations. For a production mobile app, the recommended architecture is an authoritative daily baseline coupled with a local client-side 60Hz ticker based on recent daily velocity, accompanied by a mandatory consumer transparency badge.

4. **PACER vs. CourtListener/RECAP:** While PACER remains the legal system of record, its $0.10/page fee structure makes direct mobile integration economically prohibitive for a free app. The Free Law Project's **CourtListener API v4** and its embedded **RECAP Archive** provide free, machine-readable REST endpoints for SCOTUS and federal appellate/district court dockets, complete with webhook push capabilities.

5. **Detroit and Michigan Open Data:** The City of Detroit operates one of the most mature municipal Socrata open data portals in the country (`data.detroitmi.gov`), offering immediate SODA REST APIs for council districts, budgets, and civic services. Michigan statewide legislative data is reliably acquired via **OpenStates v3** and bulk tables from `legislature.mi.gov`.

6. **Recommended 8-Source Starter Stack:** A bootstrapped developer can cover 100% of the nine required categories in a 2-week sprint using exactly 8 zero-cost sources: (1) `fiscaldata.treasury.gov`, (2) `api.congress.gov v3`, (3) `federalregister.gov v1`, (4) `courtlistener.com v4`, (5) `api.open.fec.gov`, (6) `Google Civic Information API + US Census Geocoder`, (7) `data.detroitmi.gov SODA`, and (8) `GDELT 2.0 DOC API + Google Fact Check Tools API`.

## 2. Methodology and Source-Quality Notes

To ensure that this inventory is immediately usable by mobile software engineers, every data source was audited against rigorous technical criteria:

- **Direct Primary Source Verification:** Government endpoints were tested against live servers to confirm active DNS resolution, HTTPS protocol enforcement, and response payloads.

- **Authentication & Key Management Audit:** We evaluated registration friction, key delivery speed (instantaneous email vs. manual human vetting), and token refresh requirements.

- **Rate Limits & Scalability:** We recorded both documented and empirical rate limits, evaluating whether an endpoint can support direct mobile client traffic or requires an intermediate caching backend.

- **Licensing & Copyright Scrub:** For news and campaign finance data, explicit redistribution rights were verified to prevent intellectual property violations and terms-of-service bans.

- **Volatility & Deprecation Scoring:** Historical maintenance trends were analyzed to identify deprecated legacy APIs (e.g., ProPublica Congress API v1, legacy Sunlight endpoints) in favor of long-term sustainable APIs.
