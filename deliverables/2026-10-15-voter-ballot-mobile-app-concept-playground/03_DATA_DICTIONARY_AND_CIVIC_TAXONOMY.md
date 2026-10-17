# VoterLens: Michigan 2026 — Data Dictionary & Civic Taxonomy
## Complete Schema & Data Model Specification for Election Entities
**Publication Date:** October 15, 2026  
**Deliverable Subfolder:** `deliverables/2026-10-15-voter-ballot-mobile-app-concept-playground/`  
**Associated Screen Graph:** [`voterlens-screen-graph.json`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-15-voter-ballot-mobile-app-concept-playground/voterlens-screen-graph.json)  

---

## 1. Overview & Data Architecture Principles

VoterLens relies on a structured, relational data taxonomy that balances real-time campaign agility with strict non-partisan neutrality and evidentiary traceability. Every candidate stance, financial figure, soundbite, and district polling metric is anchored to authoritative public records:
- **Statutory Authority:** Michigan Qualified Voter File (QVF), Bureau of Elections certified candidate rosters.
- **Financial Disclosures:** Federal Election Commission (FEC) Q3 2026 quarterly filings, Form 278 personal disclosures, and IRS Section 527 / Super PAC independent expenditure registries.
- **Journalistic & Public Records:** WOOD-TV8 televised debate transcripts, certified polling crosstabs (Marist, Mitchell Research, Emerson College), court filings (Michigan Court of Claims), and official campaign press publications.

---

## 2. Entity Schemas & Data Dictionaries

### 2.1 Entity 1: `Candidate` (Major & Minor Party Nominees)

| Field Name | Type | Data Source | Req / Opt | Formatting Notes | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `candidate_id` | String | Internal UUID / Slug | Req | Lowercase kebab-case (e.g. `elsayed`, `rogers`, `marsh`) | Unique identifier within system. |
| `full_name` | String | Certified Ballot Filing | Req | Formal name with credentials (e.g. `Dr. Abdul El-Sayed`, `Mike Rogers`) | Candidate name as it appears on ballot. |
| `party_affiliation` | Enum | MI Bureau of Elections | Req | `Democratic` \| `Republican` \| `Green` \| `Libertarian` \| `USTaxpayers` | Official political party nomination. |
| `ballot_designation` | String | MI Election Law Act 116 | Opt | 1–3 word occupational title | Certified ballot designation if requested. |
| `date_of_birth` | Date | Public Records | Req | `YYYY-MM-DD` | Candidate birthdate for age calculation. |
| `residence_jurisdiction` | String | QVF Voter Registration | Req | City / Township and County | Legal residence in Michigan. |
| `education_summary` | String | Academic Registrars | Req | Degrees, institutions, honors | Academic and professional credentials. |
| `career_archetype` | String | Dossier Synthesis | Req | 1-line professional summary | Archetype classification (e.g. Physician/Epidemiologist vs. FBI/Congressman). |
| `fec_total_raised` | Currency | FEC Q3 2026 Reports | Req | USD integer string formatted (e.g. `$14,510,000`) | Gross cycle fundraising receipts. |
| `fec_cash_on_hand` | Currency | FEC Q3 2026 Reports | Req | USD integer string formatted (e.g. `$2,550,368`) | Available campaign cash heading into November. |
| `small_dollar_pct` | Percentage | OpenSecrets / FEC | Req | Float formatted with `%` (e.g. `58%`) | Percentage of contributions <=$200. |
| `super_pac_backing` | String Array | FEC Independent Exp | Req | Comma-separated list of major PACs | Outside groups running supportive media campaigns. |
| `signature_quote` | String | Debate / Speech | Req | Max 280 characters | Core thematic quote encapsulating campaign message. |

---

### 2.2 Entity 2: `PolicyStance` (18-Point Decision Matrix Domain)

| Field Name | Type | Data Source | Req / Opt | Formatting Notes | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `domain_id` | String | Policy Taxonomy | Req | Lowercase kebab (e.g. `auto-ev-mandates`, `healthcare`) | Canonical identifier for the policy issue. |
| `domain_title` | String | Editorial Standard | Req | Title case (e.g. `1. Automotive & EV Mandates`) | User-facing display title in decision matrix. |
| `candidate_id` | String | Candidate FK | Req | References `Candidate.candidate_id` | Foreign key linking stance to nominee. |
| `stance_summary` | String | Campaign White Papers | Req | 2–3 sentences, plain language | Sourced synthesis of candidate's proposed federal policy. |
| `primary_citation` | String | Legislation / Book / Filings | Req | Markdown link with formal citation | Footnote reference to bill number, book title, or transcript. |
| `neutral_contrast_note` | String | Non-Partisan Dossier | Req | 1 sentence, objective | Editorial synthesis framing the central philosophical voter choice. |
| `radar_axis_weight` | Float | Alignment Model | Opt | Float 0.0 to 1.0 | Weight assigned to this domain in the 5-axis civic radar. |

---

### 2.3 Entity 3: `CampaignSoundbite` (Verified Audio & Media Catalog)

| Field Name | Type | Data Source | Req / Opt | Formatting Notes | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `soundbite_id` | String | Audio Docket | Req | `sb_{topic}_{candidate}` | Unique identifier for the audio moment. |
| `candidate_id` | String | Candidate FK | Req | References `Candidate.candidate_id` | Candidate delivering the statement. |
| `topic_category` | String | Policy Taxonomy | Req | Standard issue label | Issue domain being addressed. |
| `event_context` | String | Broadcaster / Venue | Req | e.g. `Televised Debate (WOOD-TV8)` | Physical or broadcast setting where quote was delivered. |
| `audio_duration_sec` | Integer | Media Asset | Req | Integer seconds (e.g. `24`) | Duration of audio clip. |
| `verbatim_transcript` | String | Court / Broadcast Stenography | Req | Unedited verbatim quote text | Exact words spoken by candidate without ellipses alterations. |
| `fact_check_verdict` | Enum | Sourced Dossier | Req | `Verified` \| `Context Needed` \| `Misleading` | Non-partisan factual context rating. |
| `fact_check_summary` | String | Empirical Research | Req | Max 250 characters | Sourced factual baseline explaining the verdict. |

---

### 2.4 Entity 4: `UpcomingTrailEvent` (Campaign Schedule Docket)

| Field Name | Type | Data Source | Req / Opt | Formatting Notes | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `event_id` | String | Campaign Schedule | Req | Unique event slug | Identifier for tour stop. |
| `event_date` | Date | Public Itinerary | Req | `YYYY-MM-DD` | Date of campaign appearance. |
| `candidate_id` | String | Candidate FK | Req | References `Candidate.candidate_id` | Candidate appearing (or `Both` for debates). |
| `event_type` | Enum | Campaign Schedule | Req | `Rally` \| `Roundtable` \| `TownHall` \| `Debate` | Classification of public event format. |
| `city` | String | Venue Location | Req | Michigan municipality | City or township hosting the event. |
| `venue_name` | String | Public Itinerary | Req | Facility name | Specific hall, campus, arena, or park. |
| `featured_surrogates` | String | Campaign Press | Opt | Comma-separated names | High-profile guests appearing alongside candidate. |
| `strategic_objective` | String | Political Intelligence | Req | 1 sentence | Strategic electoral purpose of the appearance. |

---

### 2.5 Entity 5: `DistrictSentiment` (Congressional District Crosstabs)

| Field Name | Type | Data Source | Req / Opt | Formatting Notes | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `district_code` | String | U.S. Census / MI SOS | Req | `MI-01` through `MI-13` | Congressional district designation. |
| `geographic_name` | String | Regional Taxonomy | Req | Primary counties / cities included | Descriptive geography (e.g. `Oakland Suburbs`). |
| `trump_net_favorability` | Integer | Certified Polling Crosstabs | Req | Signed percentage (e.g. `-15%`, `+24%`) | Net favorable minus unfavorable rating for Donald Trump. |
| `elsayed_polling_pct` | Float | Certified Polling Crosstabs | Req | Percentage (e.g. `54%`) | Projected El-Sayed vote share in district. |
| `rogers_polling_pct` | Float | Certified Polling Crosstabs | Req | Percentage (e.g. `43%`) | Projected Rogers vote share in district. |
| `projected_net_margin` | String | Polling Synthesis | Req | e.g. `El-Sayed +11%` | Net margin separating the major-party candidates. |
| `key_issue_driver` | String | Dossier Regional Analysis | Req | 1 sentence | Primary local economic or cultural flashpoint driving votes. |

---

### 2.6 Entity 6: `VoterActionPlan` (User Local Ballot Plan)

| Field Name | Type | Data Source | Req / Opt | Formatting Notes | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `plan_id` | UUID | Client Local Storage | Req | Standard UUIDv4 | Unique client-side token. |
| `precinct_zip` | String | User Input | Req | 5-digit string | Selected Michigan ZIP code. |
| `selected_senate_candidate` | String | User Selection | Req | References `Candidate.candidate_id` | Voter's selected choice for U.S. Senate. |
| `ballot_status` | Enum | Client State | Req | `Incomplete` \| `ReadyForExport` | Progress state of voting plan. |
| `offline_pass_token` | String | Encrypted Hash | Opt | Base64 encoded hash | Cryptographically signed offline representation of voter plan. |
| `created_timestamp` | DateTime | Device System Clock | Req | ISO-8601 string | Timestamp when plan was assembled. |

---

## 3. Data Integrity & Non-Partisan Verification Standards

To safeguard public trust, all data ingested into VoterLens adheres to three non-negotiable architectural constraints:
1. **Zero Anonymous Sourcing:** Every policy claim must cite a public, verifiable document (public law, congressional record, published book, FEC filing, or video recording of record).
2. **Synchronized Dual-Candidate Balance:** Whenever a controversy or vulnerability is presented for one candidate (e.g., Mike Rogers' Florida residency and spousal defense contracting), an equivalent scrutinized vulnerability must be presented for the opposing candidate (e.g., Abdul El-Sayed's 2018 New York residency challenge and healthcare system disruption claims).
3. **Local Offline Persistence:** Voter selection choices and offline booth passes are stored **exclusively within client local storage** (IndexedDB / LocalStorage) and are never transmitted to external analytics servers, ensuring total privacy of the vote.
