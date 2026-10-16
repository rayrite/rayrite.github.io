## 4. WebSocket / Streaming Inventory & Real-Time Strategy

### Real-Time Delivery Landscape Overview

A critical question in civic mobile engineering is how to deliver 'live' and 'real-time' user experiences—such as a live national debt counter, breaking Supreme Court decisions, instant floor vote updates, or election night results—without exhausting battery life or exceeding API rate limits. The empirical reality across government and civic APIs is that **true WebSocket or Server-Sent Events (SSE) push streams are rare exceptions**, concentrated primarily in commercial election feeds and select legal/regulatory hubs. Most official government databases are structured around batch updates or REST polling.

The inventory table below evaluates all candidate sources across the nine categories for native push/streaming support, and documents the **maximum practical polling frequency** and **optimal mobile architecture** for sources that do not provide native streaming.

| SOURCE | CATEGORY | MECHANISM | ENDPOINT / HUB | AUTH MODEL | UPDATE CADENCE | COST | PRACTICAL POLLING ALTERNATIVE |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| CourtListener / Free Law Project | Judicial — Federal Courts | Webhooks (HTTP POST Push) | https://www.courtlistener.com/api/rest/v4/webhooks/ | API Token (Free) | Real-Time / Event-Driven | Free ($0) | Native Push supported! Configure webhook receiver on backend server. |
| Decision Desk HQ (DDHQ) | Electoral & Political Maps | WebSocket (WSS) & SSE Stream | wss://stream.decisiondeskhq.com/v1/results | Commercial Token | Sub-second on Election Nights | Commercial ($5,000+) | Fast polling via REST endpoint: `GET /v1/results` every 30-60 seconds. |
| Associated Press (AP Elections) | Electoral & Political Maps | Push Live JSON Stream / Socket | Enterprise Socket Connection | Enterprise B2B Auth | Real-Time on Election Nights | Enterprise ($15,000+) | Poll AP Elections REST API every 60 seconds. |
| GDELT Project 2.0 | News & Public Sentiment | Pull Streaming (15-min Batch File Sync) | http://data.gdeltproject.org/gdeltv2/lastupdate.txt | None (Open) | Every 15 Minutes (Fixed) | Free ($0) | Poll `lastupdate.txt` or DOC API every 15 minutes. |
| Bureau of the Fiscal Service (Debt/DTS) | National Fiscal Data | No Streaming (REST Polling Only) | https://api.fiscaldata.treasury.gov | None | Daily (~4:00 PM ET on Business Days) | Free ($0) | Poll once daily at 4:15 PM ET. Use client-side mathematical interpolation for 60Hz UI ticker. |
| Congress.gov API v3 | Congressional Activity | No Streaming (REST Polling Only) | https://api.congress.gov/v3/ | api.data.gov Key | Continuous during Session (15-60 min lag) | Free ($0) | Poll bill actions or member votes every 15-30 minutes during active legislative floor hours. |
| Clerk of the U.S. House | Congressional Activity | Fast Polling (Static XML File) | https://clerk.house.gov/evs/{YEAR}/ | None | Immediate upon vote conclusion | Free ($0) | Poll active roll-call vote XML URL every 60 seconds while House electronic voting is underway. |
| Federal Register API v1 | Executive Branch | Fast Polling (Public Inspection Feed) | https://www.federalregister.gov/api/v1/public-inspection-documents.json | None | Hourly / Ad-hoc during Business Day | Free ($0) | Poll Public Inspection JSON endpoint every 10-15 minutes for breaking Executive Orders. |
| Supreme Court of the US (SCOTUS) | Judicial — Federal Courts | Fast Polling (RSS Feed) | https://www.supremecourt.gov/rss/opinions.xml | None | Decision days at ~10:00 AM ET | Free ($0) | Poll opinions RSS feed every 60 seconds between 9:55 AM and 10:30 AM ET on designated decision calendar days. |
| FEC Open API v1 | Campaign Finance | No Streaming (Batch Polling Only) | https://api.open.fec.gov/v1/filings/ | api.data.gov Key | Nightly batch / Periodic e-filing sync | Free ($0) | Poll `/filings/?sort=-receipt_date` once every 2-4 hours; nightly sync for full itemized schedules. |
| City of Detroit Open Data (SODA) | Michigan / Detroit Local | No Streaming (SODA REST Polling) | https://data.detroitmi.gov/resource/ | None (App Token opt) | Daily / Ad-hoc pipeline syncs | Free ($0) | Poll 311 service requests or council districts on application launch or pull-to-refresh. |
| Reddit Public JSON API | News & Public Sentiment | Fast Polling (JSON GET) | https://www.reddit.com/r/politics/new.json | User-Agent Header | Real-Time continuous user posts | Free ($0) | Poll `/new.json` or `/hot.json` every 60-120 seconds. |


### Recommended Mobile Architecture: Hybrid Push & Polling Proxy

To deliver a seamless mobile experience for a solo 2-week MVP, engineers should avoid having individual mobile devices poll government APIs directly. Direct device-to-government polling rapidly exhausts rate limits, drains mobile device battery, and causes UI stuttering when government endpoints experience intermittent slowdowns.

#### The 3-Tier Production Architecture

1. **Backend Cache & Polling Daemon (Lightweight Server / Edge Worker):**
   - Deploy a lightweight serverless worker (e.g. Cloudflare Worker, Supabase Edge Function, or Node.js Fastify instance).
   - The worker executes scheduled cron jobs to poll government REST endpoints according to their natural publication cadence (e.g., Fiscal Data once daily at 4:15 PM ET; Congress.gov every 15 minutes during session; Federal Register Public Inspection every 10 minutes).
   - Incoming records are cached in a high-speed Redis / Supabase Postgres cache.
2. **Webhook Event Listener (CourtListener & Critical Alerts):**
   - Configure CourtListener webhooks to point to the backend worker. When a new federal docket entry or opinion is docketed, the webhook wakes the worker instantly.
3. **Push Notifications to Mobile Clients (FCM / APNs):**
   - The backend worker evaluates whether an update matches user subscription preferences (e.g. 'Breaking SCOTUS opinion' or 'New Bill introduced by my Representative').
   - The worker dispatches silent background pushes or high-priority notifications via Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNs).
4. **Client-Side Live Interpolation Engine:**
   - For the National Debt ticker, the mobile client retrieves the latest verified Treasury baseline from the backend cache on app launch, then runs a local 60Hz animation loop based on the 30-day velocity, eliminating any need for continuous network polling.
