### Category 8: News & Public Sentiment

#### Narrative: Media Analytics, Fact-Checking & Sentiment Landscape

Integrating news and public sentiment into a civic mobile application requires navigating strict legal, financial, and technical boundaries. Crucially, copyright law and commercial terms of service prohibit republishing full article text without expensive publisher syndication agreements. Therefore, a modern civic mobile app must adopt a **metadata-and-analytics architecture**: ingesting article headlines, timestamps, source domains, publication volume trends, and outbound deep links to primary publisher web pages.

For high-volume macro-level news analytics, the open-source **GDELT Project** (Global Database of Events, Language, and Tone) is unmatched, monitoring global broadcast, print, and online news in over 100 languages updated every 15 minutes at zero cost. For commercial headline search, developer APIs like **NewsAPI** provide convenient REST endpoints, though their free tier is strictly limited to non-commercial localhost development. For factual integrity, the **Google Fact Check Tools API** indexes Schema.org `ClaimReview` markup from authoritative fact-checkers like PolitiFact, FactCheck.org, and Snopes. Finally, for social sentiment, the drastic monetization of the X (Twitter) API v2 has made the **Reddit Public JSON API** the premier zero-cost alternative for observing organic civic conversations.

| DATA POINT | DESCRIPTION | PRIMARY SOURCE | SOURCE URL | API AVAILABLE | API TYPE | AUTH REQUIRED | UPDATE FREQUENCY | COST | NOTES |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- | :--- | :--- |
| Global News Volume by Keyword | Timeline of news volume and coverage intensity for specific political topics, bills, or candidates. | GDELT Project 2.0 (DOC API) | https://api.gdeltproject.org/api/v2/doc/doc | Yes | REST / JSON | None | Every 15 Minutes | Free | Modes: `TimelineVol` (volume over time) and `ArtList` (article list). 100% free open data. |
| News Tone & Sentiment Analysis | Average emotional tone score (positive to negative valence) across thousands of articles covering an issue. | GDELT Project 2.0 (DOC API) | https://api.gdeltproject.org/api/v2/doc/doc | Yes | REST / JSON | None | Every 15 Minutes | Free | Mode: `ToneChart`. Measures emotional polarity and tone variance across publishers. |
| Political News Headlines & Links | Top breaking headlines, descriptions, source publisher names, and canonical outbound URLs. | NewsAPI.org | https://newsapi.org/v2/top-headlines | Yes | REST / JSON | NewsAPI Key | Continuous (15-min to hourly sync) | Free (Dev) / $449+ (Comm) | Free tier limited to 100 req/day and 24-hr delay; paid tier unlocks live commercial feeds. |
| Fact-Check Ratings (ClaimReview) | Verified fact-checks on viral political claims, speaker identity, truth rating, and debunks. | Google Fact Check Tools API / PolitiFact | https://developers.google.com/fact-check/tools/api | Yes | REST / JSON & RSS | Google Cloud Key (Tools API) / None | Continuous | Free | Indexes Schema.org `ClaimReview` records from PolitiFact, Snopes, FactCheck.org, Washington Post. |
| Public Opinion & Polling Trends | Scientific public opinion surveys on institutional trust, democracy, economic sentiment, and policy. | Pew Research Center | https://www.pewresearch.org/datasets/ | Partial | Bulk CSV / SPSS Download | Free Registration | Monthly / Survey-dependent | Free | Nonpartisan demographic survey datasets available for download; no live REST API. |
| Media Attention Index | Longitudinal tracker of news attention across national and regional media ecosystems. | MediaCloud API v4 | https://mediacloud.org | Yes | REST / JSON | Free API Token | Daily / Weekly sync | Free (Academic) | Academic consortium platform for analyzing news media coverage bias and framing. |
| Social Media Political Discussion | Community sentiment, upvoted threads, and citizen commentary on current political topics. | Reddit Public JSON API | https://www.reddit.com/r/politics/hot.json | Yes | REST / JSON | None (Polite Client) / OAuth | Real-Time | Free | Append `.json` to subreddit URLs. Free rate limit of 100 requests/min with registered User-Agent. |


#### Datasheets: News & Public Sentiment Sources

##### 1. The GDELT Project (GDELT 2.0 DOC API)
- **Source Name & URL:** The GDELT Project | [gdeltproject.org](https://www.gdeltproject.org) | API Docs: [blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/](https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/)
- **Data Provided:** Real-time global monitoring of news media: keyword article lists (`ArtList`), news volume timeline (`TimelineVol`), emotional tone chart (`ToneChart`), and geographic heatmaps (`TimelineSourceCountry`).
- **Access Method:** RESTful HTTP GET API.
- **Authentication:** None required. 100% open public API.
- **Update Frequency:** Real-Time / Every 15 minutes, 24/7/365.
- **Rate Limits:** Polite client rate limits (~1 query every 5 seconds per IP).
- **Cost:** Free ($0). Supported by Google Cloud.
- **Data Format:** JSON (default), CSV, HTML, RSS.
- **Documentation Quality:** Good. Complete query parameter guides.
- **Recommended For:** The premier zero-cost engine for tracking news volume trends and sentiment charts around politicians, bills, and government agencies.
- **Example API Endpoints (RQ-42):**
  - *Recent Articles mentioning 'Michigan Senate':* `https://api.gdeltproject.org/api/v2/doc/doc?query="Michigan+Senate"&mode=ArtList&maxrecords=10&format=json`
  - *News Volume Over Time (Past 3 Months):* `https://api.gdeltproject.org/api/v2/doc/doc?query="National+Debt"&mode=TimelineVol&timespan=3m&format=json`
  - *Sentiment Tone Distribution:* `https://api.gdeltproject.org/api/v2/doc/doc?query="Supreme+Court"&mode=ToneChart&timespan=1m&format=json`
- **Verify-Before-Integration:** Ensure URL encoding on complex Boolean queries.

##### 2. NewsAPI.org
- **Source Name & URL:** NewsAPI.org | [newsapi.org](https://newsapi.org)
- **Data Provided:** Breaking news headlines (`/v2/top-headlines`) and historical article search (`/v2/everything`): title, author, source domain name, description, publishing timestamp, and outbound URL.
- **Access Method:** RESTful HTTP GET API.
- **Authentication:** API Key passed via `X-Api-Key` header or `apiKey=` query param.
- **Update Frequency:** Live continuous indexing.
- **Rate Limits & Pricing Tiers (RQ-43):**
  - *Developer Free Tier:* 100 requests per day, 24-hour article delay, strictly localhost/development use. Not permitted for production mobile app distribution.
  - *Commercial Business Tier:* $449/month (250,000 requests/month, live real-time feeds, full commercial mobile app license).
- **Licensing Restrictions:** Headlines, descriptions, and thumbnails only; direct full-text scraping prohibited.
- **Data Format:** JSON.
- **Documentation Quality:** Excellent.
- **Recommended For:** Fast prototyping in MVP dev builds; requires commercial upgrade for App Store release.
- **Example API Endpoint:** `https://newsapi.org/v2/top-headlines?country=us&category=general&q=congress&apiKey={KEY}`
- **Verify-Before-Integration:** Check budget constraint ($449/mo) prior to production mobile deployment.

##### 3. Google Fact Check Tools API (ClaimReview Engine)
- **Source Name & URL:** Google Developers | [developers.google.com/fact-check/tools/api](https://developers.google.com/fact-check/tools/api)
- **Data Provided:** Structured fact-checks tagged with Schema.org `ClaimReview`: textual claim, claim claimant (e.g. politician name), review publisher (PolitiFact, Snopes, FactCheck.org, Lead Stories), review rating (e.g. 'False', 'Pants on Fire', 'Misleading'), and direct link to fact-check article.
- **Access Method:** RESTful HTTP GET API.
- **Authentication:** Google Cloud API Key.
- **Update Frequency:** Continuous as participating fact-checkers publish stories.
- **Rate Limits:** 10,000 requests per day free default quota.
- **Cost:** Free ($0).
- **Data Format:** JSON.
- **Documentation Quality:** Excellent.
- **Recommended For:** Building an in-app 'Civic Fact-Check' feed where users can search any candidate or controversial policy and view verified rulings.
- **Example API Endpoint (RQ-46):** `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=social+security&key={YOUR_GOOGLE_KEY}`
- **Verify-Before-Integration:** None. Highly reliable Google Cloud service.

##### 4. PolitiFact (Poynter Institute)
- **Source Name & URL:** PolitiFact | [politifact.com](https://www.politifact.com)
- **Data Provided:** Truth-O-Meter ratings (True, Mostly True, Half True, Mostly False, False, Pants on Fire), statement speaker, context, and detailed journalistic analysis.
- **Access Method:** RSS 2.0 feeds and ClaimReview JSON-LD markup on story pages.
- **Authentication:** None.
- **Update Frequency:** Daily.
- **Rate Limits:** Standard web traffic.
- **Cost:** Free ($0 / Public RSS).
- **Data Format:** RSS (XML).
- **Documentation Quality:** Fair.
- **Recommended For:** Real-time push alerts for high-profile political fact-checks.
- **Example RSS Feed:** `https://www.politifact.com/rss/factchecks/`
- **Verify-Before-Integration:** None.

##### 5. MediaCloud API (Version 4)
- **Source Name & URL:** Media Cloud Consortium (UMass Amherst & Northeastern) | [mediacloud.org](https://mediacloud.org)
- **Data Provided:** Longitudinal news research engine: searchable archive of over 2 billion articles from 60,000+ sources, tracking media attention trends, topic framing, and source diversity.
- **Access Method:** RESTful HTTP GET API.
- **Authentication:** Media Cloud API Key (free academic/civic registration).
- **Update Frequency:** Daily batch ingestion.
- **Rate Limits:** Modest academic limits (~30 req/min).
- **Cost:** Free ($0).
- **Data Format:** JSON.
- **Documentation Quality:** Good developer documentation at `directory.mediacloud.org`.
- **Recommended For:** Academic comparisons of media coverage across liberal vs. conservative news ecosystems.
- **Verify-Before-Integration:** Apply for API token in advance.

##### 6. Reddit Public JSON API (Social Discussion & Sentiment)
- **Source Name & URL:** Reddit Inc. | [reddit.com/dev/api](https://www.reddit.com/dev/api)
- **Data Provided:** Top, hot, and new community discussions in civic and political subreddits (`r/politics`, `r/Michigan`, `r/Detroit`, `r/neutralpolitics`): post titles, score, upvote ratio, comment counts, author, and top comment threads.
- **Access Method:** RESTful HTTP GET by simply appending `.json` to standard Reddit URLs.
- **Authentication:** None required for public reading, but requires a descriptive `User-Agent` header (e.g. `User-Agent: mobile:us.gov.civicapp:v1.0.0 (by /u/YourUsername)`).
- **Update Frequency:** Real-Time / Sub-second.
- **Rate Limits:** 100 requests per minute with authenticated OAuth; ~30-60 requests per minute unauthenticated with custom User-Agent.
- **Cost:** Free ($0).
- **Data Format:** JSON.
- **Documentation Quality:** Excellent community documentation.
- **Recommended For:** Populating a 'Public Civic Discussions' community sentiment tab for federal and local Detroit issues.
- **Example API Endpoints (RQ-48):**
  - *Hot Political Discussions:* `https://www.reddit.com/r/politics/hot.json?limit=10`
  - *Detroit Civic Discussions:* `https://www.reddit.com/r/Detroit/hot.json?limit=10`
- **Verify-Before-Integration:** Ensure custom User-Agent header is set; Reddit rejects generic client User-Agents (e.g. Python-requests, default curl) with HTTP 429.

##### 7. Aylien News API & Event Registry (Commercial High-End NLP)
- **Source Name & URL:** Aylien (Quantexa) | [aylien.com](https://aylien.com) and Event Registry | [eventregistry.org](https://eventregistry.org)
- **Data Provided:** Enterprise-grade media intelligence: multi-lingual natural language entity resolution, automated event clustering, sentiment scoring, and concept tagging.
- **Access Method:** RESTful JSON API.
- **Authentication:** Commercial API Key.
- **Update Frequency:** Real-Time continuous streaming.
- **Rate Limits:** Enterprise SLA.
- **Cost:** Commercial ($199/month to $2,500+/month). Free trials available.
- **Data Format:** JSON.
- **Documentation Quality:** Outstanding.
- **Recommended For:** Enterprise v2 roadmap if custom entity extraction is required. Excluded from 2-week $0 MVP.
- **Verify-Before-Integration:** Enterprise contract required.