# Deliverable I: Monitoring Plan and Change Tracking Protocols
## Automated Detection, Ingestion Cadences, and Operational Fallback Architecture

**Document Identifier:** `CIVIC-DOC-08-MONITORING-PLAN`  
**Research Execution Date:** October 17, 2026  
**Cycle Scope:** 2026 Midterm Cycle and Volatile Electoral Operations  

---

## 1. Operational Monitoring Philosophy

Civic data ecosystems exhibit extreme volatility shifts. During non-election periods, voter registration rules and district boundaries remain static for months; conversely, during early voting windows and post-election canvassing, court injunctions, polling site relocations, and ballot tabulation tallies shift hourly.

To maintain absolute data integrity without overloading government endpoints or triggering rate limits, this monitoring plan enforces:
1. **Volatility-Proportional Ingestion:** Adjusting polling cadences based on calendar proximity to statutory deadlines and election dates.
2. **Lightweight Conditional Invalidation:** Utilizing HTTP `ETag` and `If-Modified-Since` headers to avoid downloading unchanged payloads.
3. **Immutable Versioned Audit Ledgers:** Maintaining point-in-time snapshots of every ingested record to track statutory amendments, candidate withdrawals, and judicial reversals.
4. **Automated Human-in-the-Loop Triage:** Escalating breaking changes (e.g., polling place closures or candidate ballot disqualifications) for immediate editorial verification before downstream syndication.

---

## 2. Master Civic Source Monitoring and Change Detection Matrix

The table below establishes the operational monitoring parameters across all core civic data surfaces:

| Monitored Source | Content Domain | Volatility Rating | Detection Method | Recommended Cadence | Duplicate Suppression Key | Alert Severity | Staleness Threshold | Fallback Source |
|---|---|---|---|---|---|---|---|---|
| **Congress.gov API** | Federal Bills & Roll Calls | High (In Session) | Polling `/v3/bill` (updateDate) | Hourly (Session) / Daily (Recess) | `bill_type + number + congress` | `P3_Medium` | 24 Hours | GPO GovInfo API |
| **OpenFEC REST API** | Candidate & PAC Finance | High (Quarterly Deadline)| Nightly Bulk CSV / API Polling | Daily / Hourly on Filing Days | `committee_id + sub_id` | `P3_Medium` | 48 Hours | OpenSecrets Bulk Data |
| **Federal Register API**| Executive Orders & Rules | Medium (Daily) | Polling `/documents.json` | Daily at 09:00 & 16:00 ET | `document_number` | `P2_High` | 24 Hours | GovInfo Fed Register |
| **CourtListener API** | Federal & State Dockets | High (Litigation) | Webhooks / REST Docket Alerts | Hourly for Tracked Dockets | `court_id + docket_number` | `P1_Critical` | 12 Hours | PACER Direct Search |
| **Google Civic API** | Polling Sites & Ballots | Extreme (Elections) | Polling `voterinfo` endpoint | Every 6 Hours (Peak: Hourly) | `election_id + address_hash` | `P1_Critical` | 6 Hours | State SOS VIP Feeds |
| **State VIP Feeds** | Official Polling Places | Extreme (Elections) | XML Feed Hash Comparison | Every 4 Hours (Peak: Hourly) | `state_id + precinct_id + site_id`| `P1_Critical` | 4 Hours | County Clerk Web Portals |
| **LegiScan Push API** | State Legislation | High (In Session) | Automated Push Webhooks | Real-Time (15m–4h streaming) | `bill_id + change_hash` | `P2_High` | 8 Hours | Open States REST v3 |
| **Open States v3** | State Legislative Bills | Medium (In Session) | Polling `/bills` (updated_since) | Daily / Twice Daily | `ocd-bill/{uuid}` | `P3_Medium` | 24 Hours | State LIS Portals |
| **Ballotpedia API** | Candidates & Measures | High (Filing Windows) | Polling `/elections_by_point` | Daily during filing windows | `election_id + candidate_id` | `P2_High` | 24 Hours | State Candidate Lists |
| **Maricopa / BeBallot**| County Polling & Curing | Extreme (Elections) | HTML Head / Scraper Hashes | Hourly during voting window | `precinct_id + center_id` | `P1_Critical` | 2 Hours | AZ SOS Voting Hub |
| **Wayne / Detroit Clerk**| Municipal Precincts | High (Elections) | Web Polling / Document Hashes | Daily / Twice Daily | `ward_id + precinct_number` | `P1_Critical` | 12 Hours | MI SOS MVIC Portal |
| **County Court Dockets**| Local Criminal / Civil | Medium (Continuous) | Web Lookup / Account RSS | Daily at 18:00 Local | `county_id + case_number` | `P2_High` | 24 Hours | State Judicial Portal |

---

## 3. Detailed Change Detection and Ingestion Protocols

### 1. Polling Place and Vote Center Emergency Relocations
* **Operational Risk:** Polling locations frequently relocate within 72 hours of Election Day due to emergency facility unavailability (e.g., water main breaks, power outages, local zoning conflicts). Directing voters to an abandoned polling location results in severe disenfranchisement.
* **Monitoring Strategy:** During the 14 days preceding Election Day, the ingestion engine executes automated differential scans across official county election boards and state VIP XML feeds every 4 hours.
* **Triage Protocol:** Any changed geographic coordinate or physical street address for an existing precinct ID triggers an immediate **`P1_Critical`** system alert, invalidates all edge-cached voter responses within that precinct boundary, and dispatches an automated notification to human editorial staff for verification.

### 2. Candidate Ballot Access Invalidation, Disqualification, or Death
* **Operational Risk:** Candidates are disqualified by court order or withdraw after the ballot printing deadline; in some jurisdictions, votes for disqualified candidates are voided, while in others, replacement nominees are appointed.
* **Monitoring Strategy:** Monitor state election board certified candidate lists and local court emergency injunction dockets daily during filing and challenge windows.
* **Triage Protocol:** Trigger an automated **`P1_Critical`** notification. Update the candidate's operational status to `Disqualified / Challenged`, publish the legal citation supporting the change, and suppress automated endorsement linking until formal administrative certification is recorded.

### 3. Judicial Injunctions and Voting Rule Invalidation
* **Operational Risk:** Federal or state supreme court emergency stays alter voting procedures (e.g., mail ballot arrival deadlines, signature curing timelines, provisional ballot rules) days before voting ends.
* **Monitoring Strategy:** Subscribe to real-time CourtListener case alerts for all active redistricting, voting rights, and ballot access litigation across federal circuit courts and state supreme courts.
* **Triage Protocol:** Immediate human-in-the-loop review. Legal analysis must determine whether an order is an administrative stay, an injunction pending appeal, or a final decision on the merits before public guidance text is updated.

---

## 4. Resilience, Backoff, and Failover Architecture

1. **Exponential Retry with Jitter:**
   * When an authoritative API returns HTTP `429 (Too Many Requests)` or `503 (Service Unavailable)`, the worker client implements exponential backoff with randomized jitter:
     $$	ext{WaitTime} = \min(2^{	ext{retry}} 	imes 1000	ext{ms} + 	ext{rand}(0, 500	ext{ms}), 60000	ext{ms})$$
   * Consecutive failures exceeding 5 attempts automatically downgrade the endpoint health score and divert traffic to the secondary fallback provider.
2. **Duplicate Suppression and Idempotent Ingestion:**
   * To prevent duplicate database writes during rapid polling, incoming records generate a SHA-256 fingerprint from immutable business keys (e.g., `SHA256(jurisdiction_id + bill_number + last_action_timestamp)`).
   * If the fingerprint matches the active database entry, the transaction commits a timestamp heartbeat without rewriting downstream entities.
3. **Data Tombstoning and Soft Deletions:**
   * Government records are never hard-deleted from production storage.
   * If a record disappears from an upstream agency feed, the system flags the entity as `tombstoned: true`, records the `tombstone_timestamp`, and preserves historical auditability while removing the item from active user-facing search indices.
