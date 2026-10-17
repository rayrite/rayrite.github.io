### Category 5: Electoral & Political Maps

#### Narrative: Electoral Geography, Historical Records & Live Feeds

Building interactive political maps and election dashboards requires three distinct technical layers: **geographic boundaries** (spatial polygons for congressional districts, state legislative seats, and counties), **demographic overlays** (population statistics from the US Census Bureau), and **electoral returns** (historical and live voting results). For spatial boundary files, the **US Census Bureau's TIGER/Line** and **Cartographic Boundary Files** represent the authoritative national baseline for post-2020 redistricting lines, conveniently convertable into lightweight GeoJSON or TopoJSON for vector rendering in mobile frameworks (Mapbox GL, React Native Maps, Flutter Map).

For historical certified election data, academic repositories like the **MIT Election Data + Science Lab (MEDSL)** and volunteer initiatives like **OpenElections** provide clean, certified precinct- and county-level CSV datasets dating back decades at zero cost. Conversely, **live election-night results feeds** (e.g., Associated Press, Decision Desk HQ) are commercial B2B syndication services with significant price tags ($5,000 to $50,000+). For a solo bootstrapped 2-week MVP, an app must rely on open historical datasets and free official Secretary of State certification portals, leaving commercial live streams for v2 post-funding.

| DATA POINT | DESCRIPTION | PRIMARY SOURCE | SOURCE URL | API AVAILABLE | API TYPE | AUTH REQUIRED | UPDATE FREQUENCY | COST | NOTES |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| Congressional District Boundaries | GeoJSON / Shapefile polygons for all 435 US House districts (118th/119th Congress, post-2020 census). | US Census Bureau (TIGER/Line) | https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html | Yes | REST API & Bulk GeoJSON/Shapefile | None | Decennial / Post-Redistricting | Free | Cartographic Boundary files (1:500,000 resolution) are optimized for smooth mobile rendering. |
| Address-to-District Geocoder | Resolves any street address to latitude/longitude, state, county, census tract, and congressional district. | US Census Geocoder REST API | https://geocoding.geo.census.gov/geocoder/ | Yes | REST / JSON | None | Continuous (Updated quarterly) | Free | Authoritative federal geocoder. Handles 10,000 batch addresses or single-line lookup. |
| County-Level Presidential Results (1976-2024) | Historical certified county-by-county vote totals for presidential general elections. | MIT Election Data + Science Lab (MEDSL) | https://electionlab.mit.edu/data | Yes | Bulk Download (Dataverse CSV) | None | Quadrennial post-certification | Free | Harvard Dataverse hosted; CC-BY-4.0 license; includes FIPS codes for easy map joining. |
| Historical Congressional & Senate Results | State-by-state certified vote counts, candidate totals, and party shares from 1976 to present. | MIT Election Data + Science Lab (MEDSL) | https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/IG0UN2 | Yes | Bulk CSV Download | None | Biennial post-certification | Free | Standard benchmark for historical electoral swing and margin analysis. |
| Precinct-Level Certified Election Returns | Granular precinct-by-precinct vote counts for federal, state, and local offices across states. | OpenElections Project | https://openelections.net | Yes | GitHub Bulk CSV | None | Continuous as state data is parsed | Free | Open-source data project; covers Michigan general elections with certified precinct breakdowns. |
| Partisan Voter Index (PVI) & Race Ratings | Partisan lean metrics (e.g. R+4, D+8) and competitiveness ratings (Solid, Likely, Lean, Toss-up). | Cook Political Report / Sabato's Crystal Ball | https://centerforpolitics.org/crystalball/ / https://www.cookpolitical.com | Partial | Web / Academic RSS / Paid API | None (Sabato) / Paid (Cook) | Weekly during election season | Free (Sabato) / $350+ (Cook) | Sabato's Crystal Ball provides free academic race ratings; Cook requires commercial licensing. |
| Live Election-Night Vote Returns | Sub-minute precinct reporting percentages, county vote counts, and statistical race call projections. | Decision Desk HQ / Associated Press | https://decisiondeskhq.com / https://api.ap.org | Yes | REST & WebSocket | Commercial Enterprise Key | Real-Time on Election Night | Commercial ($5K - $50K+) | AP is the gold standard media wire; DDHQ is the modern tech alternative. Prohibitive for MVP. |
| Demographic & Socioeconomic Overlays | Voting-age population, median household income, educational attainment, and racial demographics by district. | US Census Bureau American Community Survey (ACS) | https://api.census.gov/data/ | Yes | REST / JSON | Free Census API Key | Annual (ACS 1-Year & 5-Year) | Free | Enables demographic context popups when tapping on a district map. |


#### Datasheets: Electoral & Political Maps Sources

##### 1. US Census Bureau (TIGER/Line, Cartographic Boundaries & Geocoder)
- **Source Name & URL:** US Census Bureau | [census.gov/geographies](https://www.census.gov/geographies.html) and [geocoding.geo.census.gov](https://geocoding.geo.census.gov)
- **Data Provided:** Post-2020 118th/119th Congressional District boundaries, State Legislative Districts (House/Senate), County boundaries, Census Tracts, and real-time street address to legislative district geocoding.
- **Access Method:** RESTful HTTP GET API (Geocoder) and bulk spatial downloads (Shapefiles, GeoJSON).
- **Authentication:** None required for Geocoder and boundary files. (Free key for ACS demographic data).
- **Update Frequency:** Annual boundary updates; quarterly geocoding address database refreshes.
- **Rate Limits:** Geocoder supports up to 1,000 single queries per minute or 10,000 records in batch upload mode.
- **Cost:** Free ($0).
- **Data Format:** GeoJSON, TopoJSON, Shapefile, JSON.
- **Documentation Quality:** Excellent.
- **Recommended For:** The core spatial engine for the mobile app: geolocating a user to their exact congressional district and rendering district polygon maps.
- **Example API Endpoints:**
  - *Address to District Geocoder:* `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=100+Woodward+Ave+Detroit+MI&benchmark=Public_AR_Current&vintage=Current_Current&layers=54&format=json` (Layer 54 targets 119th Congressional Districts).
- **Verify-Before-Integration:** None. Authoritative federal geodetic baseline.

##### 2. MIT Election Data + Science Lab (MEDSL)
- **Source Name & URL:** MIT Department of Political Science | [electionlab.mit.edu](https://electionlab.mit.edu) | [dataverse.harvard.edu/dataverse/medsl](https://dataverse.harvard.edu/dataverse/medsl)
- **Data Provided:** Comprehensive, scientifically verified historical general election returns: County-level Presidential returns (1976-2024), US Senate elections (1976-2024), US House elections (1976-2024), and state election statistics.
- **Access Method:** Direct CSV download from Harvard Dataverse via stable DOI links.
- **Authentication:** None.
- **Update Frequency:** Post-election quadrennial and biennial releases following official state certification.
- **Rate Limits:** Standard web file downloads.
- **Cost:** Free ($0 / Open Access / CC-BY-4.0).
- **Data Format:** CSV, RData, Tab-delimited.
- **Documentation Quality:** Excellent. Standard academic codebooks with exact variable descriptions.
- **Recommended For:** Populating historical trend charts, historical county election result maps, and baseline partisan swing calculations.
- **Example Download URL:** `https://dataverse.harvard.edu/api/access/datafile/:persistentId?persistentId=doi:10.7910/DVN/VOQCHQ/PEJYYG` (US President 1976-2020/2024 county returns).
- **Verify-Before-Integration:** Confirm DOI link for the latest completed election cycle release.

##### 3. OpenElections Project
- **Source Name & URL:** OpenElections Project | [openelections.net](https://openelections.net) | [github.com/openelections](https://github.com/openelections)
- **Data Provided:** Certified precinct-level election results across US states, including primary and general elections for federal, statewide, and state legislative offices.
- **Access Method:** GitHub repository file access (HTTP GET or Git).
- **Authentication:** None.
- **Update Frequency:** Maintained continuously by civic data contributors.
- **Rate Limits:** Standard GitHub raw content limits.
- **Cost:** Free ($0 / Creative Commons).
- **Data Format:** Clean CSV files structured by state, county, and precinct.
- **Documentation Quality:** Good. State-by-state metadata READMEs.
- **Recommended For:** Granular precinct-level historical maps for Michigan and Wayne County.
- **Example Download URL:** `https://raw.githubusercontent.com/openelections/openelections-data-mi/master/2024/20241105__mi__general__precinct.csv`
- **Verify-Before-Integration:** `[Verify-Before-Integration]` Check precinct completeness for specific rural counties.

##### 4. Dave Leip's Atlas of U.S. Presidential Elections
- **Source Name & URL:** Dave Leip's Atlas | [uselectionatlas.org](https://uselectionatlas.org)
- **Data Provided:** Highly regarded commercial election archive: county, town, and precinct returns for Presidential, Senate, and Gubernatorial races from 1789 to present.
- **Access Method:** Web interface browsing; commercial raw data export licenses.
- **Authentication:** Login required for bulk data.
- **Update Frequency:** Rapid post-election collection.
- **Rate Limits:** Standard web.
- **Cost:** Commercial paid data licenses ($100 to $2,500+ depending on state and race depth). Free web visualizer.
- **Data Format:** CSV, Excel, DBF.
- **Documentation Quality:** High accuracy; commercial terms.
- **Recommended For:** Verification benchmark. For a free mobile MVP, MEDSL and OpenElections provide free substitutes.
- **Verify-Before-Integration:** Commercial pricing quote required if purchasing machine-readable files.

##### 5. Associated Press (AP Elections API)
- **Source Name & URL:** The Associated Press | [ap.org/solutions/elections-services/](https://www.ap.org/solutions/elections-services/)
- **Data Provided:** Industry benchmark real-time election night vote counts, precinct reporting counts, delegate counts, statistical voter surveys (AP VoteCast), and authoritative race winner projections/calls.
- **Access Method:** RESTful JSON API and push streaming.
- **Authentication:** Enterprise API Key.
- **Update Frequency:** Real-Time / Sub-minute on election nights.
- **Rate Limits:** Contract-specific SLA.
- **Cost:** Enterprise Commercial License ($15,000 to $100,000+ per election cycle). Strictly B2B.
- **Data Format:** JSON, XML.
- **Documentation Quality:** Comprehensive enterprise documentation.
- **Recommended For:** Enterprise news organizations and venture-funded apps. **Excluded from 2-week bootstrapped MVP due to cost**.
- **Verify-Before-Integration:** Enterprise contract required.

##### 6. Decision Desk HQ (DDHQ API)
- **Source Name & URL:** Decision Desk HQ | [decisiondeskhq.com](https://decisiondeskhq.com)
- **Data Provided:** Real-time fast election night returns, race projections, historical results, and precinct vote tallies for federal and state races.
- **Access Method:** Modern RESTful JSON API and WebSocket live stream.
- **Authentication:** API Key.
- **Update Frequency:** Sub-minute live stream on election night.
- **Rate Limits:** Tier-based.
- **Cost:** Commercial ($5,000 - $25,000+ depending on tier). Offers startup/trial tiers upon application.
- **Data Format:** JSON.
- **Documentation Quality:** Excellent developer docs at `docs.decisiondeskhq.com`.
- **Recommended For:** The leading modern alternative to AP Elections when transitioning from MVP to a funded production version.
- **Verify-Before-Integration:** Pricing quote required before integration.

##### 7. Sabato's Crystal Ball & FiveThirtyEight Archive Repositories
- **Source Name & URL:** UVA Center for Politics (Crystal Ball) | [centerforpolitics.org/crystalball](https://centerforpolitics.org/crystalball/) and Nate Silver / 538 GitHub Archive | [github.com/fivethirtyeight/data](https://github.com/fivethirtyeight/data)
- **Data Provided:** Nonpartisan electoral ratings (Safe/Likely/Lean/Toss-up) for US House, Senate, and Governor races; historical polling aggregates and model baselines.
- **Access Method:** Web RSS, public CSV downloads on GitHub.
- **Authentication:** None.
- **Update Frequency:** Weekly / Bi-weekly during election campaigns.
- **Rate Limits:** Standard web traffic.
- **Cost:** Free ($0 / Academic Fair Use).
- **Data Format:** HTML, CSV, RSS.
- **Documentation Quality:** Good.
- **Recommended For:** Supplying nonpartisan race ratings for congressional district cards.
- **Note on FiveThirtyEight (RQ-28):** Following ABC News's restructuring of FiveThirtyEight and Nate Silver's departure to *Silver Bulletin* (Substack), historical 538 datasets remain archived at `github.com/fivethirtyeight/data`. For live polling aggregates, use academic aggregators or RealClearPolitics fair-use averages.