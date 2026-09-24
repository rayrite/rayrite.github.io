# News-Aggregator App Industry Deep Dive — Combined Deliverables (2026-09-23)

Concatenation of the 11 program deliverables in reading order (00→10). Each section is the complete, current file; per-section provenance, conflict registries, and source lists are preserved inline. Generated 2026-09-23.


---

# ═══ FILE: 00-executive-summary.md ═══

# 00 — Executive Summaries: US, EU, Asia (News-Aggregator App Industry, September 2026)

**Date:** 2026-09-23 · **Program:** news-aggregator-industry-deep-dive · **This file:** the three market summaries that open the deliverable set (01 leaders · 02 forecast/TAM · 03 gaps · 04 SWOT · 05 concept · 06 GTM/monetization · 07 release · 08 news-apps compete · 09 architecture · 10 deployment).
**Method:** every figure traces to the session's primary-source captures (digests in `independent_research/scratch/research-news-aggregator-2026-09/scratch/notes/`, fetched 2026-09-23). Conflicts are shown side-by-side with attribution and **never averaged**. ❓ marks a checked-and-unfound gap. Confidence: **HIGH** = company-primary/top-tier · **MED** = reputable estimate · **LOW** = self-reported/stale/snippet-only.

---

## 0. The Global Backdrop All Three Markets Share (DNR 2026: 48 markets, ~97,500 respondents, published 2026-06-16)

| Indicator | 2026 value | Trend | Confidence |
|---|---|---|---|
| Social/video networks as news source | **54% — #1 for the first time ever**, ahead of news sites/apps (51%) and TV (52%) | sites/apps down 12pp since 2020 | HIGH |
| Third-party sources incl. AI chatbots (combined) | 56% | — | HIGH |
| Social/video as **main** news source | 30% (12% use *only* social/video; 52% of 18–24s) | from 22% five years ago | HIGH |
| Trust in news | **37% — lowest since 2015**, falling in 29/48 markets | −3pp YoY | HIGH |
| Selective news avoidance | 42% (was 29% in 2017) | flat YoY | HIGH |
| AI chatbots for weekly news | 10% (16% under-35; only 1% call AI their main source) | from 7% in 2025 | HIGH |
| Trust in AI chatbot answers | 20% global (44% among users; UK low 6%) | — | HIGH |
| Click-through to sources (always/often) | AI users 42% ≈ search users 44% > social 36%; **full sample: AI 4%** | — | HIGH |
| Google organic-search referrals (Chartbeat, 2,500+ publishers) | **−33% global / −38% US** (Nov 2024→Nov 2025); publishers expect −43% over 3 yrs | — | HIGH |
| Interest in news | "Extremely/very interested" −13pp since 2021 → ~46%; news lovers 29%→22% | — | HIGH |

**The one-sentence global story:** news aggregation in 2026 is a three-cornered squeeze — social feeds won the audience, AI answer-engines are eating the referral click, and trust/avoidance sit at decade worsts — and the only aggregators still growing are the ones embedded in something people already open (a phone swipe, a messenger, a portal).

---

## 1. United States — "Platform Tabs Won; Every Standalone App Is Single-Digit"

### 1.1 If you read nothing else
The US aggregator market is a **distribution oligopoly wearing an app-store costume**. The weekly gateway ladder (DNR 2026, Graph 12) is: **Google Discover 22% (+6pp) > Google News 12% (−6pp) > Apple News 10% (−4pp) > NewsBreak 8% > Ground News 3% = SmartNews 3% (−3pp) > Snapchat Discover 2%**. The top three surfaces are pre-installed defaults; the best standalone app by reach (NewsBreak) is single-digit and its 40M MAU claim is self-reported. Meanwhile the money story (Apple Services records) and the engagement story (reach shrinking) point in opposite directions, and the AI-referral collapse is re-pricing every traffic-dependent business model in the chain.

### 1.2 At a glance

| Indicator | Value | Source/confidence |
|---|---|---|
| Any online news access | 77% of adults | DNR HIGH |
| Social media used for news (any platform) | ~56% | DNR MED (chart read) |
| Trust in news | **25% (−5pp, 7th lowest of 48)**; right-leaning Americans 15% | DNR HIGH |
| News avoidance | 45% (+3pp) | DNR HIGH |
| Paying for online news | **16% (−4pp) per Mar-2026 repoll vs 13% original fieldwork — both kept, report itself flags caution** | DNR HIGH (with caveat) |
| AI chatbots for news | 6% (−1pp — **no YoY growth in the US**) | DNR HIGH |
| Gateway mix (35+ / under-35) | Direct 25/15 · social 30/**43** · search 23/22 · aggregators 8/8 | DNR HIGH |
| Top online news brands | Fox News online 17% > **Yahoo! News 16% (#2)** > MSN News 8% | DNR HIGH |
| Top-50 US news sites YoY (Aug 2026) | **41 of 50 down**; Newsweek −72%, Daily Mail −45%, BI −42%; Substack +27–29% (~94–96M visits, #7) | Press Gazette/Similarweb MED-HIGH |
| US digital ad context | (global: $1.06T 2026F, +5.0–5.1%) | Dentsu HIGH |

### 1.3 Market structure
- **The leaders are default surfaces, not chosen apps.** Google Discover (the Android swipe-left feed) now has nearly 2× the weekly reach of the dedicated Google News app (22% vs 12%, and they're trading places — Discover +6pp, GNews −6pp). Apple News is the iOS default and claims #1 news app in US/CA/AU (self-claimed, Jan 2026). No standalone US app exceeds 8%.
- **Apple's paradox:** Services revenue set records four straight quarters — Q4 FY25 $28.8B (+15%), Q1 FY26 ~$30.0B (+14%), Q2 FY26 $30.98B (+16%), Q3 FY26 $30.7B (+12.1%); GM 76.7%; 2.5B active devices — but News-specific revenue is undisclosed, the **US News+ subscriber count does not exist publicly** (last estimate ~1M, 2020), and US weekly reach *fell* 4pp. The only rigorous News+ number anywhere: **UK ~1.7M subs, >£100M/yr, ~50% to publishers** (Enders, Jan 2026).
- **Yahoo! News is the #2 online brand (16%) on the largest news-categorized web property** (yahoo.com ~3.5B visits/mo) — but the dedicated Yahoo News site fell −27% (Mar 2025) and −16.8% (Nov 2025) YoY while Yahoo Finance grew +3–7%. MSN visits slid −28% YoY (~145–149M early 2026) and is **least-trusted in the UK list (21%)**; Copilot MAU 320M (+148%) is Microsoft's actual news-adjacent growth engine.
- **The AI-answer layer is now the story:** zero-click news searches rose 56%→69% (May 2024→May 2025); AIO CTR damage **range, never averaged**: −30% **click-through** (BrightEdge, May 2025 — a CTR decline, not total clicks; impressions were +49%) · −34.5% top-page organic (Ahrefs Apr 2025) · −39.8% (randomized field experiment) · −42% (SEL Mar 2026) · **−58% position-1 CTR (Ahrefs Feb 2026: 0.0157 vs 0.0373 counterfactual, 300k keywords)** · trough **−61%** organic on informational AIO queries (Seer, Sept 2025) with a partial rebound by Feb 2026 (1.3%→2.4%, Seer Apr 2026) — trough and rebound carried side-by-side; **conflation guard: BrightEdge's Feb-2026 "58%" is AIO *incidence* (~31%→~48% of queries), never merge it with CTR damage**; only ~19% of users click citations (Semrush); Google Web Search's share of Google-referrals to publishers collapsed 51%→27% (2023→Q4 2025) with **Discover now ~68%**; in US test markets 51% of Discover positions were AI summaries/YouTube. AIO MAU: 2.5B; AI Mode: 1B+ (queries doubling quarterly).
- **Consumer behavior (Pew):** 86% get news from digital devices at least sometimes (56% often); Facebook 38% / YouTube 35% / TikTok 20% of adults (TikTok 3%→20% in five years; 43% of youngest adults); under-30s following news all/most of the time: **15% vs 62% of 65+**; news influencers: 21% of adults, 38% of under-30s.

### 1.4 The standalone-app field (detail in 01)
| App | US position | The number that matters |
|---|---|---|
| NewsBreak | Strongest standalone reach (8% — re-attributed: strongest *standalone* app, still behind the pre-installed tabs) | **40M MAR verified verbatim as self-reported** (PRNewswire 2026-05-06; no independent MAU exists anywhere — the absence is the finding); proxies: 32.2M US visits Aug-2025 +25% YoY; $115M Series C (Jan 2021) → $1.1B val, no re-rating since; local-news + SMB ads strategy |
| Ground News | 3% weekly; **#2 Magazines & Newspapers, 4.7★/48K** | Built on ~$1.01M lifetime outside capital; Vantage $99.99/yr; YouTube's most-sponsored brand (1,863 integrations); web visits **decomposed (2026-09-23)**: ~36% same-period tracker spread (Similarweb vs Semrush) + a real Semrush-series decline 5.13M→4.46M→4.09M (Jun-25→Aug-26 ≈ −20%/14mo) — not a halving |
| SmartNews | 3% (−3pp) | MAU CONFLICT 20–30M (company) vs ~5M (Sensor Tower); first full-year US op profit FY2025 (COO Nin Gi, Toyo Keizai 2026-06-16, MED-HIGH; consolidated already profitable since FY12/2023 — the milestone is US-segment-specific); **TSE IPO Oct-2026 target effectively lapsed** — no filing/approval by 2026-09-23, absent from TSE's approved October cohort |
| Flipboard | Not in DNR ladder | "145M MAU" = CEO Mike McCue statement reported by Digiday **2018-08-27**, never refreshed since (about.flipboard.com states no figure); pre-2018 100M "remains the strongest durable user metric" (Expanded Ramblings 2026-03-08); 2026 third parties still recycle it — stale, LOW; pivoting to fediverse (Surf) |
| Syft | Tiny US footprint | iOS US 4.6★ from **66 ratings**; Play 100K+ downloads; 3.0 redesign triggered churn-to-Inoreader backlash; "#1 news app" ad claim NOT VERIFIED |
| Particle | Credible AI-native | $15.3M raised; zero user numbers disclosed |

### 1.5 The calm-tech countercurrent (the niche that monetizes at $36–100/yr)
The RSS renaissance is real but small: **Folo** (RSSNext, AGPL, 39,009 GitHub stars — one of the most-starred OSS readers ever; Free 150 feeds → Pro $999.99/yr), **Feedly** (now an enterprise threat-intel business first: $1,600–3,200/mo tiers; consumer Pro+ $8.25–12.99/mo; 14M+ users secondary vs 15M+ self-claim — CONFLICT), **NewsBlur** ($36/yr premium; ships MCP server + CLI), **NetNewsWire 7** (free OSS), Inoreader Pro $90/yr. Signal: algorithm fatigue + AI readers making big feed sets manageable; "RSS downloads +30% YoY" is weakly sourced (LOW). Counterpoint: new Outlook dropped RSS support entirely. **This is the proven willingness-to-pay band for calm reading — and its ceiling.**

### 1.6 US takeaways for a founder
1. Don't compete for gateway share — the ladder is locked by pre-installation. Compete for a *segment's* loyalty (Ground News proved ~$1M capital can buy a 3%-reach, top-2-category app via YouTube sponsorship flywheel).
2. The AI answer layer is commoditizing *summaries*; the un-occupied positions are provenance (where did this come from), calm (anti-feed), and ownership (local-first/export) — see 03/05.
3. Payment behavior is soft (16%/13% pay, falling in the repoll) — price at the RSS band ($36–100/yr), not the newspaper band.
4. Every scale number in this market is self-reported or stale; build your own instrumented truth and say so loudly — it's a trust differentiator nobody in the leader set can credibly copy (see 08 Obs. 4 for the identical pattern across the news-app leader set).

---

## 2. European Union / Europe — "Regulation Is the Product Roadmap"

### 2.1 If you read nothing else
Europe is simultaneously the **last stronghold of publisher-owned news consumption** and the world's most aggressive laboratory for re-regulating aggregators. Of the 18 DNR markets where news sites/apps still beat social/video, **14 are European** (the other 4 are Asian). Apple News is **absent from every mainland-EU country** (US/UK/CA/AU only), so the aggregator layer is Google (News + Discover, now AIO/AI Mode), residual portals (t-online 17%, Web.de 12%, GMX 7% in Germany; Yahoo! FR 8%), MSN (still #4 news app in Italy; a top revenue source for UK publishers like Hello!/Daily Star despite no-notice removals), and small domestic independents (NewsNow 11M uniques/70M article views to publishers — company-claimed; upday relaunched as an AI "trend news generator" after Axel Springer ended the Samsung partnership, current MAU ❓). And in 2025–26 the EU turned the aggregator-publisher relationship into an enforcement arena: **€890M DMA fine on Google (Jul 2026), an EPC Article 102 complaint over AI Overviews (Feb 2026), a formal antitrust probe into Google's AI content use (Dec 2025), and an AI opt-out rollout regulators are actively interrogating.**

### 2.2 At a glance (the big five EU markets)

| Indicator | Germany | France | UK | (EU-wide context) | Confidence |
|---|---|---|---|---|---|
| Trust in news | 46% (+1) | 29% (0) | 30% (−5) | 37% global, lowest since 2015 | HIGH |
| News avoidance | 40% (+3) | 37% (+1) | **50% (+4)** | 42% global; BG/HR/GR/TR ≥60% | HIGH |
| Paying for online news | 11% (−2) | 12% (+1) | 10% | 17% pay-basket; NO 40% / SE 32% outliers | HIGH |
| AI chatbots for news | 5% (+1) | 5% (+1) | **4% — lowest of 48** (answer-trust 6%) | 10% global; Spain doubled; no growth US/UK/FR/DE | HIGH |
| Top aggregator surfaces | t-online 17% · Web.de 12% · GMX 7% (vs ARD online 20%) | Yahoo! News 8% (Brut 12%, HugoDécrypte 10%) | Discover 18% (+3) · GNews 9 · Apple News 5 (−4) · NewsBreak 2 · Ground 1 · SmartNews 1 | AIO live in every DNR market **except France** (hard news mostly excluded) | HIGH |
| Gateway ladder (UK) | — | — | Discover 18 > GNews 9 > Apple 5 > NewsBreak 2 > Ground 1 = SmartNews 1 | — | HIGH |
| Digital subscriptions | 2.77M (+8.5%); Bild 253k, FAZ 139k, SZ 105k | Le Monde >600k; Le Figaro 315k; Mediapart ~260k | BBC News 48% offline / 45% online weekly reach | — | HIGH |

### 2.3 Market structure
- **Europe's "stronghold" is eroding from inside:** Germany's reformed PSB treaty (Dec 2025) forces ARD/ZDF channel cuts and limits text-based online news (Tagesschau24 closes end-2026); RTL Germany cuts 600 jobs (230 at RTL News). Germany social-as-main-source rose to 18% (+4pp). Nordics: Norway/Denmark posted the biggest avoidance jumps (+9pp/+7pp — Greenland crisis, royal-scandal saturation).
- **France is the AI-copyright crucible:** PSB seen as net-negative socially (31% vs 22%); publishers suing Microsoft and LinkedIn for payment; AIO/AI Mode launched in France only 22 Jul 2026 per one tier-3 source (LOW — flagged), ~2 years after the US, with Art 15 friction blamed; DNR footnote confirms AIO absent from France as of Mar 2026.
- **The licensing wave is Europe's other aggregator economy:** Axel Springer–OpenAI (~$13M/yr × 3 per one tracker vs "tens of millions of euros" contemporaneous — unconfirmed, both kept); Le Monde + PRISA–OpenAI (Mar 2024); FT–OpenAI (Apr 2024); **Perplexity's** Le Monde deal embeds Sonar on Le Monde's own site (May 2025) plus Der Spiegel and PRISA deals; Meta AI partnering with Le Monde and Le Figaro (single-source sentence); ProRata.ai with FT and Springer. Google's side: Art 15 → Extended News Preview licences now cover **5,000+ European publications (>70% of snippets shown)**; France's 2021 Google-APIG framework was $76M/3yr across 121 publications; News Showcase committed $1B globally (1,700+ deals by the Spain launch; 2026 EU deal count ❓).
- **The ad pool aggregators monetize against:** European digital advertising hit **€131B in 2025 (+10.5%)** with retail media €13.3B (+16.7%, >10% of spend) and standard display shrinking −0.8% (IAB Europe AdEx). Constraint: behavioural targeting = 66% of EU digital ads and 90% of growth (IAB, undated page — LOW-MED), i.e. **consent regimes are the binding constraint on EU aggregator personalization** versus US peers.

### 2.4 The regulatory stack (what a EU-facing product must actually track)

| Instrument | Event | Date | Status |
|---|---|---|---|
| **DMA** | Commission fines Google **€890M** (€460M Search self-preferencing + €430M Play steering); EPC readout: non-discrimination principles to extend to AIO/AI Mode (Google itself proposed applying them) | 2026-07-23 | Active; Google cumulative EU fines >€10B over ~2 decades |
| **Art 102 TFEU complaint** | European Publishers Council v. Google over AI Overviews/AI Mode: unauthorised use, no effective opt-out, no fair remuneration, answer-engine substitution | 2026-02-10 | Pending |
| **Antitrust probe** | Formal investigation: Google's use of web-publisher and YouTube content for AI | opened 2025-12-09 | Pending |
| **Google AI opt-out** | Announced 2026-06-03 (same day UK CMA ordered Google to let publishers opt out of AI features); global rollout completed 2026-08-31; EU regulator questionnaire to publishers (replies due 2026-08-28) | 2026-06→09 | Under scrutiny |
| **AI Act** | GPAI obligations 2025-08-02; **Art 50 transparency (AI-interaction disclosure, machine-readable gen-output marking, deepfake/public-interest labels) effective 2026-08-02** with guidelines adopted 2026-07-20; Digital Omnibus defers some Annex III + Art 50(2) duties to 2026-12-02 | 2026 | In force (partially deferred) |
| **DSA** | Google Search = designated VLOSE (>45M EU MAU), annual systemic-risk assessments (Google's filed 2025-08-28); the main lever on aggregation-era misinformation risk | ongoing | Active |
| **Copyright Directive Art 15** | Neighbouring rights → ENP licences 5,000+ pubs; France first-mover template ($76M/3yr) | 2021→2026 | Mature, extending to AI questions |

### 2.5 EU takeaways for a founder
1. **Europe is the one market where publisher-friendliness is a regulatory requirement, not a virtue signal** — a provenance-native, opt-out-respecting, license-honoring aggregator is not just differentiated here, it's the compliant default. Build to Art 50 transparency and DSA risk-assessment norms from day one and the EU is an open flank while Google fights enforcement.
2. **No incumbent owns a EU-wide branded destination** — the portal era's local champions (t-online, Web.de) are national and aging; Apple is absent; Google is legally besieged. There is no #1 EU consumer news app to dislodge.
3. **Consumer willingness-to-pay is structurally lower than the US** (10–12% in the big three vs US 13–16%) and trust in AI answers is lowest-in-world (UK 6%) — skepticism to *answer machines* is high while trust in *news* holds better than the US in Germany (46%). Provenance framing plays *better* here than anywhere.
4. The UK is a separate market in practice: highest avoidance (50%), lowest AI-chatbot use (4%), Apple News present but falling (−4pp), NewsNow proving an independent headline-aggregator can hold 11M uniques on outbound-links value.

---

## 3. Asia — "The Only Region Where Aggregators Still Win"

### 3.1 If you read nothing else
Asia is the global exception: the only 4 of 48 DNR markets where news websites/apps beat social/video are **all in Asia (Japan, South Korea, Singapore, Taiwan)** — and DNR attributes this to **aggregators, not publishers**: super-app/portal tabs (Yahoo! News 57% weekly reach in Japan; Naver 56% in Korea) that own distribution the way social feeds do in the West. East Asia is also the only place aggregators directly monetize readers at scale (**34% of Japanese news-payers pay an aggregator; ~half of payers in South Korea and Hong Kong**, vs 18% across the 20-market basket). And the region's AI layer is *ahead* of the West in monetization: Naver put **ads on AI Briefing in June 2026** — before any Western peer. The strategic story to watch: the portal moat itself is eroding (Korean portal news usage 66.5%, down from 79.2% peak; 54.5% of Koreans 10–59 used ChatGPT for search in the past 3 months).

### 3.2 At a glance

| Indicator | Japan | South Korea | India | China | Confidence |
|---|---|---|---|---|---|
| Weekly online reach, #1 aggregator | **Yahoo! News 57%** (LINE NEWS 18%; NHK online 13% is top publisher) | **Naver 56%** (Daum 20%) | Dailyhunt absent from DNR English-online brand list (NDTV 29, BBC 26, India.com 24) | Toutiao #1 but all figures unofficial | HIGH (JP/KR) |
| Trust in news | 41% (+2) | 30% (−1) | 39% (−4) | not surveyed | HIGH |
| News avoidance | **12% — lowest of any major market** (+1) | 29% (−2) | **52%** (+2) | not surveyed | HIGH |
| Paying for online news | 9% (−1); **34% of payers pay an aggregator (highest)** | 19%; ~half of payers pay aggregators | (panel shows sharing 47% instead of pay) | n/a | HIGH |
| AI chatbots for news | 9% (+4) | **14% (+7, highest of 48)**; 56% of its AI users click through (highest) | n/a this pass | n/a | HIGH |
| Any online news access | 62% (lowest of the seven) | 82% (highest) | 80% | n/a | MED-HIGH |

### 3.3 Japan — the aggregator home-turf
- **Structure:** Google, Yahoo! JAPAN and LINE each exceed **80M monthly users (60%+ of population, Nielsen 2025)**; LINE app passed **100M domestic MAU (Dec 2025)**; Yahoo! JAPAN has 54M logged-in IDs; **LINE NEWS: 77M monthly users / 15.4B monthly page views** (Dec 2025 ad guide) — roughly 60% of the population inside a messenger tab. TVer (broadcaster streamer) draws 44M monthly users.
- **Standalone apps are tier two:** SmartNews claims 2,000–3,000万 (20–30M) MAU in ad materials vs **~5M worldwide per Sensor Tower 2023 — CONFLICT never averaged**; Gunosy (TSE 6047) FY3/2026 revenue ¥6,441M (+5.6%), recurring profit ¥354M (+8.9%); NewsPicks slid ~196k→~187k paid subs (analyst est.), Premium ¥1,850/mo; Nikkei group holds 3.7M digital subs (world #3 after NYT and Dow Jones) — the premium end.
- **Money:** internet ad spend **¥4,045.9B in 2025 (+10.8%), >50% of all Japanese ad spend for the first time** (Dentsu headline basis; media-spend basis 媒体費 ¥3.31T — different definition, both kept); in-app ad market $9.21B (2025) → $10.50B (2026F, IMARC); SmartNews+ crossed 100k cumulative subs (¥1,480/mo ≈ ¥1.8B/yr run-rate).
- **Behavior quirk:** Japan's online-news total (62%) is the lowest of the seven focus markets — yet sites/apps still beat social *because* of Yahoo!/LINE aggregation. SmartNews partnered with UUUM to convert hobby videos into text articles; anonymous creators' videos took 55% of election-video views (Nikkei).

### 3.4 South Korea — the portal that became an answer engine
- **Naver is the market:** 56% weekly news reach; **92.1% share within portal news usage** (Daum marginal, spun off Dec 2025, Portal Biz −11%); 62.86% Korean search share (Google 29.55%). **AI Briefing: 30M monthly uniques, ads live since 2026-06-15** (first-mover monetization of AI answers), coverage doubling per Feb 2026 earnings call; ~70% of its citations are Naver's own UGC (publishers see little referral upside); CTR +8% and dwell +20% where Briefing shows; ₩20B creator fund.
- **The fight:** Korea Newspaper Association KFTC complaint over HyperCLOVA X training (Apr 2025); broadcast/newspaper associations preparing copyright suits over Cue:/AI Briefing (Oct 2025); Naver summoned to National Assembly audit; News Partnership Committee relaunched Feb 2026.
- **Erosion under the moat:** portal news weekly usage 66.5% (peak 79.2% in 2021) with a clear 20s–40s exodus; **short-form news doubled 11.1%→22.9% in one year**; SNS news 8.1% (10-year low); KakaoTalk 48.9M MAU (94.7% of population) but Kakao is not a news challenger.

### 3.5 China — closed, huge, unverifiable
Toutiao remains #1 comprehensive news app with **no official disclosure — and the conflicting figures resolve as eras, not contemporaneous rivals (verified 2026-09-23)**: current best estimate **QuestMobile 2025Q2 average MAU ~391M** (vs Douyin 904M; per 21财经 2025-09-25); "MAU 260M" = the June-2019 datapoint; "DAU ~130M" ≈ stale rounding of the 2017–2019 ~120M DAU plateau (official 2019 report) — retired as a current figure; "DAU >200M" claims are **unsupported by any source found — dropped as wrong**; a 网易号 analysis (2026-08-08; self-media grade, carry with caution) reports DAU fell below ~50M by 2025Q3 with 2024 ad revenue RMB 8.6B. WeChat >1.4B global MAU with Channels prioritizing knowledge/current-affairs; Tencent News shipped "Fact Check AI" (2025), current users ❓. Regulatory frame: CAC algorithm-registration regime (Order No. 9) mandates personalization opt-outs; registration takes 2–4 months and covers foreign firms serving Chinese users. **For a Western founder: not an enterable market; relevant only as proof that regulated algorithmic aggregation operates at 100M+ DAU scale.**

### 3.6 India — the vernacular volume play
- **VerSe Innovation (Dailyhunt + Josh) is the scale story:** FY25 operating revenue **Rs 1,930 crore (+88% YoY)**, total Rs 2,071 crore (+64%), EBITDA burn cut 20% to Rs 738 crore, group profitability targeted H2 FY26; 350M+ users *claimed* (unverified); ~$1.9B raised (Josh at $5B, Apr 2022); IPO ~2–3 years out. Josh: 23M users in first 45 days post-TikTok-ban, ~4.2B daily video plays (2026 claim). Inshorts Group: 92M+ reach; **Public App 80M users, 15B monthly views, 700+ districts, 12 languages** — the strongest vernacular local-news aggregator.
- **Context:** 1.02B internet users (Sep 2025), 750M smartphones, 500M social users; **TV still 44% news usage**; YouTube/WhatsApp/Instagram/Facebook are the top news platforms; India is the exception in Asia — **no super-app owns news distribution**, so standalone vernacular aggregators compete directly with platform feeds. DNR's India panel is English-speaking online-only (under-measures vernacular reach — Dailyhunt's absence from its brand list is a sampling artifact, not evidence of irrelevance). Avoidance 52%, trust −4pp to 39%.

### 3.7 Southeast Asia (brief)
LINE's super-app model exports: Thailand 54–56M users (78.2% of population) with **LINE TODAY TH at 40M monthly users / 1.4B PV**; LINE Premium TH at 169 baht/mo with **3M+ paying subscribers (Aug 2026)** — super-app news monetizing directly; Taiwan 22M LINE MAU (92–94% of internet users). No credible SEA-native standalone aggregator surfaced (Vero et al. produced nothing verifiable — gap noted).

### 3.8 Asia takeaways for a founder
1. **East Asia proves readers will pay aggregators directly** (34% JP / ~half KR-HK of payers) — but via super-app bundles, not standalone subscriptions. The lesson is bundling-into-something-daily, not pricing.
2. **Korea is the preview of the West's AI fight** (monetized AI answers, publisher lawsuits, ~70% self-citation) and of its erosion (short-form news doubling in a year). Watch Naver to see Google's 2027.
3. **India is the volume expansion market** (1B+ users, vernacular gap, VerSe +88% growth) but monetization per user is thin and the field is ad-funded; not a beachhead for a calm-tech paid product.
4. Japan's 12% avoidance and 41% trust are the *best consumer sentiment in any major market* — the calm-reading thesis is native there, but distribution without a Yahoo/LINE-style partner is the unsolved problem for foreign entrants.

---

## 4. Cross-Market Synthesis (the bridge into 01–10)

| Question | US answer | EU answer | Asia answer | Program consequence |
|---|---|---|---|---|
| Who owns distribution? | Pre-installed platform tabs | Google + national portals; Apple absent | Super-apps/portals (JP/KR), platform feeds (IN) | Never fight for gateway share; win a segment (01 §9) |
| Is AI eating the referral? | Yes, worst case (−30…−58% CTR; 69% zero-click) | Yes + regulator response (DMA/Art 102/AI Act) | Yes + already monetized (Naver AI ads Jun 2026) | "AI that sends you to the source" is the open position (05) |
| Will readers pay? | 13–16%, softening; RSS band $36–100/yr | 10–12%; skepticism to AI highest | 9% JP but 34% of payers pay aggregators | Price at tool-band, bundle for volume (06) |
| Where is trust lowest/highest? | US 25% (7th lowest) | DE 46% best big market; UK AI-trust 6% | JP 41% best sentiment overall | Provenance/calm positioning maps to the weakness (03/04) |
| What's the regulatory air? | Light | Heavy — and the world's template | Heavy (CN) / mixed (JP/KR/IN) | Build to EU Art 50/DSA norms; it's the strictest common denominator (09/10) |
| What does the calm niche pay today? | Folo/Feedly/NewsBlur $36–100/yr | Same players; Feedly's enterprise pivot | NewsPicks ¥1,850/mo; Nikkei 3.7M subs | Validated ceiling for reader revenue; monetize via adjacent value (06) |

**Bottom line for the program:** every structural fact above points the same direction — the mass-market aggregation game is locked up by defaults and being re-priced by AI answers, while the paying, trusting, growing niches want exactly what the leaders structurally can't offer (provenance, calm, ownership, export). Deliverables 03 and 05 quantify that gap and name the product; 02 sizes it; 07–10 make it buildable and deployable.

---

## 5. Sources (primary set — full provenance in the digests)

**Global/DNR 2026** (all country tables, gateway ladders, trust/avoidance/pay, AI-chatbot and click-through data): Reuters Institute Digital News Report 2026 — final PDF and executive summary (reutersinstitute.politics.ox.ac.uk, 2026-06-16); extraction notes and caveats in `digest-round2-dnr-2026-tables.md` (US pay-repoll caveat, chart-read confidence flags, India-sample caveat).
**US:** Apple Newsroom quarterly results (FY25 Q4–FY26 Q3); Enders Analysis UK News+ report via Nieman Lab (2026-01); goodereader 125M claim (LOW-MED); Pew Research Center News Platform + Social Media fact sheets (2025) and Pew-Knight young-adults study (2025-12-03); Press Gazette/Similarweb top-50 US tables (2025-04→2026-09-09); Chartbeat via DNR; NewzDash via Search Engine Roundtable (2025-12-23); Digiday/Similarweb zero-click (2025-07); Ahrefs/BrightEdge/PPC-Land/SEL/Semrush CTR studies (2025-04→2026-03) + Seer Interactive trough/rebound pair (2025-09→2026-04) + BusinessWire Ahrefs re-issue (2026-05-19); Google I/O 2026 + SEJ AI Mode data (2026-05); MSN Partner Hub; NewsBreak PRNewswire SPOTLIGHTS verbatim-40M (2026-05-06) + Press Gazette/Similarweb top-50 (2026-09-09) + TechCrunch/Francisco Partners Series C (2021-01-07) + Multiples.vc + Revenue Memo no-re-rating (2026-08-25); Ground News CJR (2025-09-08) + Semrush 3-point series (Jun-2025→Aug-2026, page updated 2026-09-18); Flipboard Digiday 145M origin (2018-08-27) + Expanded Ramblings (2026-03-08); Syft/Folo/Feedly/NewsBlur/NetNewsWire store-and-pricing captures (2026-09-23) — `digest-round2-us-market-leaders.md`, `digest-round2-syft-rss-deep.md`.
**EU:** European Commission DMA decision (2026-07-23); EPC complaint (2026-02-10) and readout; Reuters antitrust/opt-out reporting (2026-09-02); EC AI-Act Art 50 guidelines page + Cooley/Morgan Lewis/Paul Weiss alerts; Google DSA risk-assessment PDF (2025-08-28); Google ENP 5,000+ publications (Connal LinkedIn, 2025-08 approx); Reuters Google-APIG France (2021-02-13); Google News Showcase Spain blog; OpenAI/Le Monde/PRISA and Perplexity/Le Monde announcements; IAB Europe AdEx via Digiday; Apple HT208435 availability (2026-09-15); DNR Germany/France/UK country pages; Press Gazette NewsNow profile; Wikipedia upday (2026 revision); 42matters Italy rankings — `digest-eu-market.md`.
**Asia:** LY Corporation releases and media/product guides (LINE 100M 2026-01-29; LINE NEWS 77M/15.4B PV 2025-12-20; Yahoo! JAPAN 54M IDs 2025-03); Nielsen Japan Tops of 2025 (2026-01-15); Dentsu Japan ad spend (2026-03-05) + krows-digital media-spend basis; kitaishihon Gunosy FY3/2026; note.com NewsPicks analyst estimates; Nikkei Asia 1M announcement; SmartNews press (SmartNews+ 100k 2025-07; AI Matome 2025-07-23); TechCrunch SmartNews decline analysis (2024-01-08); Bloomberg TSE-IPO reporting (2026-03-24/25 EN+JP; earliest attribution Toyo Keizai Shikiho 2025-07-25) + Toyo Keizai US-profit interview, COO Nin Gi (2026-06-16) + JPX October-2026 approved-cohort snapshots (Google-indexed, crawled 2026-09-18); 21财经/QuestMobile Toutiao 2025Q2 MAU ~391M (2025-09-25) + 网易号 era analysis (2026-08-08, self-media grade); KPF survey via Journalists Association (2026) and MediaToday (Naver 92.1%); Naver Ad Center AI Briefing 30M + ad launch (2026-06-15); Newsis AI Briefing citations (2026-05-28); ChosunBiz coverage-doubling earnings call (2026-02-06); Yonhap publisher-suit reporting (2025-10-10); InterAd/OpenSurvey Korean search shares; DataReportal Digital 2025 South Korea; 10100.com Toutiao compilations (unofficial); Pertama Partners China algorithm regulation; Entrackr VerSe FY25; Google Cloud Dailyhunt case study; valueforstartups Josh report; MediaBrief Public App; Reuters India market story (2026-01-29); PRNewswire LINE TODAY Thailand; Thai Enquirer recap (2026-08-06) — `digest-asia-market.md`, `digest-round2-dnr-2026-tables.md`.

*Conflicts carried, never averaged: SmartNews MAU (20–30M company vs ~5M Sensor Tower); SmartNews revenue ($104.5M vs $163.8M vs ¥20–30B analyst); Feedly 14M vs 15M+; US pay 16% repoll vs 13% fieldwork; Axel Springer–OpenAI ~$13M/yr vs "tens of millions"; Japan ad-spend ¥4.0459T headline vs ¥3.31T media-fee basis; Ground News visits (decomposed 2026-09-23: ~36% same-period tracker spread between Similarweb and Semrush + a real Semrush-series decline 5.13M→4.09M ≈ −20%/14mo — not a halving); Toutiao resolved as eras (QuestMobile 2025Q2 MAU ~391M is the current best estimate; DAU >200M claims dropped as unsupported). Scale numbers carried as claims, never facts: NewsBreak 40M MAR (self-reported verbatim; no independent MAU exists), Flipboard 145M (2018-08-27 vintage, never refreshed), SmartNews 20–30M (ad materials). ❓ items: Apple US News+ subs; MSN MAU; upday current MAU; 2026 Showcase EU deal count; Toutiao official anything; NewsBreak independent MAU.*

---

# ═══ FILE: 01-market-leaders.md ═══

# 01 — Market Leaders as of September 2026

**Date:** 2026-09-23 · **Scope:** the companies and products that actually govern news-aggregation attention in the US, EU and Asia, as of this date. For each leader: short bio → financial snapshot (with YoY) → engagement snapshot → market-share snapshot → UVP → ICP.
**Method:** all figures from the session's primary-source captures (digests in `scratch/notes/`, fetched 2026-09-23 unless noted). Conflicts are shown side-by-side, never averaged. Where a company discloses nothing, the gap is stated — the single biggest pattern in this file is how much of this industry's "market share" is self-reported, stale, or contested.

**Confidence key:** **HIGH** = company-primary or top-tier financial reporting · **MED** = reputable third-party estimate · **LOW** = weak/self-reported/stale · **CONFLICT** = sources disagree, both kept.

---

## 0. The Shape of Leadership in 2026 (read this first)

| Rank logic | Who leads | Why it matters |
|---|---|---|
| The leaders are mostly **platform tabs, not apps** | Google Discover/News/AIO, Apple News (iOS default), Yahoo! JAPAN, LINE NEWS, Naver | DNR 2026: aggregators are the main gateway for only ~8% globally — but platform-embedded aggregation (Discover 22% US weekly reach) dwarfs every standalone app (best: Apple News 10%) |
| Distribution beats product | Every US/EU standalone app has single-digit weekly reach | SmartNews 3%, Ground News 3%, NewsBreak 8% (US, DNR Graph 12); the top four US gateways are all pre-installed or default surfaces |
| The AI platforms are now news intermediaries | Google AIO (2.5B MAU), AI Mode (1B+), Copilot (320M) | They answer the news query without a click (69% zero-click news searches) — they compete for the same minutes while monetizing the answer itself |
| Asia is the exception where **aggregators still win** | Japan (Yahoo! News 57%), Korea (Naver 56%) | The only 4 of 48 DNR markets where news sites/apps beat social — because super-app/portal aggregation, not social feeds, owns distribution |
| Revenue and share are inversely visible | Apple/Google disclose nothing per-product; SmartNews/Ground/Yahoo JP disclose selectively | Apple News+ has NO US subscriber count; SmartNews MAU estimates span 5M–30M; Flipboard's "145M MAU" is a 2018 CEO statement never refreshed |

---

## 1. Apple News — the default that became #1

### 1.1 Bio
News launched with iOS 9 (2015) as a curated+algorithmic feed inside the OS; the paid **Apple News+** tier (2019) bundles magazines and newspapers. News lives inside Apple's **Services** segment (with iCloud, App Store, TV+, etc.) and is available in only **US, UK, Canada, Australia** — zero mainland-EU countries (Apple support, checked 2026-09-15). In January 2026 Apple itself claimed 2025 was record-breaking for Services and that **Apple News is the #1 news app in the US, Canada and Australia and #2 in the UK** (self-claimed rank, HIGH as a claim, unverifiable independently).

### 1.2 Financial snapshot (segment-level; News itself undisclosed)
| Metric | Figure | YoY | Confidence |
|---|---|---|---|
| Services revenue Q4 FY2025 (Sep-2025 qtr) | $28.8B | +15% | HIGH (Apple) |
| Services revenue Q1 FY2026 (Dec qtr) | ~$30.0B (record at the time) | +14% | HIGH (Apple) |
| Services revenue Q2 FY2026 (Mar-2026 qtr) | $30.98B (all-time record) | +16% | HIGH (Apple) |
| Services revenue Q3 FY2026 (Jun-2026 qtr) | $30.7B (June-qtr record) | +12.1% | HIGH (Apple) |
| Trailing-4-qtr Services (computed) | ≈ $120.5B | ≈ +14–15% | computed from above |
| Services gross margin | 76.7% (vs 38.7% products) | — | HIGH (earnings call) |
| Apple News+ **UK** subs (only rigorous count anywhere) | ~1.7M (mostly Apple One bundles) | — | MED-HIGH (Enders Analysis, Jan 2026) |
| UK News+ annual revenue / publisher split | >£100M (~$136M)/yr; ~50% shared with publishers by engagement | — | MED-HIGH (Enders) |
| Apple's take | 50% of News+ fees; free tier: publishers keep 100% of ads they sell | — | HIGH (terms reported) |
| News+ US subscriber count | **Not disclosed** (last press-era estimate ~1M, 2020) | — | gap |
| Installed base (the distribution engine) | 2.5B+ active devices | all-time high | HIGH |

Apple never breaks News revenue out of Services; the UK Enders figure is the only hard News+ number that exists in 2026.

### 1.3 Engagement snapshot
- **~125M monthly reach** (Apple-linked claim, 2025 vintage, LOW-MED confidence — the figure traces partly to 2021 reporting; treat as the ceiling of plausible).
- DNR 2026 US weekly gateway use: **10% (-4pp YoY)**; UK 5% (-4pp). Reach is slipping even as Services revenue grows — bundle economics mask engagement drift.

### 1.4 Market-share snapshot
- **#1 news app US/CA/AU, #2 UK** (self-claimed, Jan 2026).
- US weekly-reach ladder (DNR 2026): Discover 22% > Google News 12% > **Apple News 10%** > NewsBreak 8% > Ground News 3% = SmartNews 3%.

### 1.5 UVP
"The news is already on your iPhone." Zero-setup curation from 3,000+ publications (600+ in News+), human-edited top stories plus personalization, privacy-clean (no cross-app tracking story), and one subscription that quietly includes a news bundle if you already pay for Apple One.

### 1.6 ICP
- **Primary:** mainstream iOS owners who never chose a news app — skew 30-60, higher income, Apple One households.
- **Secondary:** magazine/power readers (News+ Food: 100K recipes / 60 pubs) and UK quality-news readers (Times/Telegraph "safe brand" effect per Enders).
- **Not the ICP:** Android users, EU mainland (product absent), under-25s (social-native, per DNR 52% main-source stat).

---

## 2. Google — Discover / News / AI Overviews / AI Mode (the ambient aggregator)

### 2.1 Bio
Google News (born 2002, rebuilt 2018) became the smaller sibling of **Discover** (2018, the swipe-left feed, no query needed) and now of **AI Overviews** (2024-25, generated answers in Search) and **AI Mode** (2025, full conversational search). By March 2026 AIO had rolled out in every DNR-surveyed market except France (hard-news queries mostly excluded in favor of a Top Stories carousel, per Google docs cited in DNR footnote). Google is the only "aggregator" whose referral behavior is a live industry crisis: the EU fined it €890M under the DMA (Jul 2026), the EPC filed an Article 102 complaint over AIO/AI Mode (Feb 2026), and the Commission opened a formal antitrust probe into its AI content use (Dec 2025).

### 2.2 Financial snapshot
News products are not separately disclosed — they are demand-features of the ads machine. Scale proxies instead:
| Metric | Figure | YoY | Confidence |
|---|---|---|---|
| AI Overviews MAU | 2.5B (I/O 2026) | from 1.5B (Q1 2025) → 2B+ (Q2 2025) | HIGH (Google) |
| AI Mode MAU | 1B+ one year post-launch; queries 2x+ per quarter; avg query 3x longer | — | HIGH (Google via SEJ) |
| Gemini app MAU | 1B (Aug 2026) | — | HIGH |
| Organic-search referrals to 2,500+ publishers (Chartbeat, in DNR) | **−33% global / −38% US** (Nov 2024→Nov 2025); publishers expect −43% over 3 yrs | — | HIGH |
| News-share of Google referrals (NewzDash, 400+ pubs) | Web Search share 51% (2023) → **27%** (Q4 2025); Discover ≈ **68%** | — | MED |
| Zero-click news searches (Similarweb) | 56% (May 2024) → **69%** (May 2025) | +13pp | MED-HIGH |

### 2.3 Engagement snapshot
- **AIO CTR damage — keep the range, never average:** −30% **CTR/click-through** (BrightEdge, May 2025 — "nearly 30% reduction" in click-throughs since the May-2024 AIO launch, with impressions +49%; a CTR decline, NOT a total-clicks decline; press release 2025-05-14) · −34.5% top-page organic (Ahrefs Apr 2025) · −39.8% (randomized field experiment, 1,065 US participants) · −42% (Search Engine Land Mar 2026) · **−58% top-page CTR** (Ahrefs, published 2026-02-04 on Dec-2025 GSC data — position-1 average CTR 0.0157 vs 0.0373 counterfactual, 300k keywords, Dec-2023 vs Dec-2025; re-issued unchanged via BusinessWire 2026-05-19) · depth extends to **−61%** in Seer Interactive's Sept-2025 reading (informational AIO-query organic CTR 1.76%→0.61%), with a partial rebound in Seer's Apr-2026 update (AIO-SERP organic CTR trough 1.3% Dec-2025 → 2.4% Feb-2026; AIO-cited ~37% below no-AIO) — carry both side-by-side, never average; only ~19% of users click citations (Semrush). **Conflation guard:** BrightEdge's own Feb-2026 "58%" stat is AIO *incidence* growth (~31%→~48% of queries), not CTR damage — never merge the two metrics.
- Discover positions in US test markets: 51% were AI summaries/YouTube (NewzDash). Reach plc: Discover traffic −46% in H2 2025 — even the "winner" surface is compressing.

### 2.4 Market-share snapshot
- US weekly gateway use (DNR 2026): **Discover 22% (+6pp) · Google News 12% (−6pp)** — passive feed now ~2× the dedicated app. UK: Discover 18% (+3pp), GNews 9%.
- Germany/France portals are local (t-online 17%, Web.de 12%, GMX 7%; Yahoo! FR 8%) — Google's EU share flows through Search/Discover rather than a branded destination.

### 2.5 UVP
"News finds you." Zero-effort, prediction-based feeding tied to the world's default search box — and now the AI layer that answers the question before you click. For users: infinite free breadth. For publishers: the traffic source everyone depends on and nobody trusts.

### 2.6 ICP
- **Users:** literally everyone (Android/Chrome defaults); strongest with 35+ mainstream users who won't install an app; under-35s skip it for TikTok/YouTube (DNR: social 43% main gateway U35).
- **Publishers (B2B side):** any outlet needing top-of-funnel discovery — now negotiating AIO citation and EU neighbouring-rights payments instead.

---

## 3. Yahoo (incl. Artifact tech) & Microsoft MSN/Copilot — the legacy portals

### 3.1 Yahoo News — bio
Yahoo News is the residual giant of portal-era aggregation: the **#2 US online news brand at 16% weekly reach** (DNR 2026, behind Fox News online 17%) running on the largest news-categorized web property (**yahoo.com ~3.5B visits/mo, #1-2 in category**, Similarweb mid-2026). Its 2024 acquisition of **Artifact** (Instagram founders' AI news app, shut for lack of market) supplied the AI personalization now embedded in the relaunched Yahoo News app (Key Takeaways, clickbait flagging, topic summaries). Trust split US: 31% trust / 37% neither / 32% don't-trust.

### 3.2 Yahoo — financial/engagement/share snapshot
| Metric | Figure | YoY | Confidence |
|---|---|---|---|
| yahoo.com monthly visits | ~3.5B (#1-2 News & Media category; #16 globally) | — | MED (Similarweb) |
| Yahoo News US site visits | 73.3M (Mar 2025) → 82.8M (Nov 2025) | **−27% → −16.8%** | MED-HIGH (Press Gazette/Similarweb) |
| Yahoo Finance visits | 133-158M/mo | **+3-7%** (the growing sibling) | MED |
| DNR US weekly brand reach | 16% (#2 online) | — | HIGH (DNR) |
| France: Yahoo! News weekly reach | 8% | — | HIGH (DNR) |

No stand-alone P&L is public (Yahoo is inside Apollo-owned Yahoo Inc.); direction: the **brand-portal is shrinking while its finance vertical grows**.

### 3.3 Microsoft MSN/Copilot — snapshot
| Metric | Figure | YoY | Confidence |
|---|---|---|---|
| MSN US site visits | 196-201M (early 2025) → 144M (Oct 2025) → ~145-149M (early 2026) | **−28% YoY** (multi-year slide) | MED-HIGH (Press Gazette/Similarweb) |
| MSN/Microsoft Start users | "millions daily" — no MAU disclosed | — | gap |
| Microsoft Advertising combined surfaces | 1.2B+ monthly users | — | LOW-MED (self-claim) |
| Copilot MAU | 320M | **+148%** (Q4 2025) | MED-HIGH |
| UK MSN weekly reach / trust | 5%; trust 21% — **least-trusted brand in the UK list** (with The Sun 15%) | — | HIGH (DNR) |
| Strategy 2025-26 | "Publisher Content Marketplace" to compensate publishers whose content AI/Copilot uses; ads in Windows 11/10 Start menu | — | MED (Axios via Thurrott) |

### 3.4 UVP / ICP (portals)
- **Yahoo UVP:** the default homepage habit that never died, now with Artifact-grade AI summaries; Yahoo Finance for markets. **ICP:** 40+ browser-default users, finance-first readers; Yahoo Japan is a different company/market (see §5).
- **Microsoft UVP:** Windows-injected reach plus an AI assistant (Copilot) that summarizes the news. **ICP:** enterprise/M365-entrenched users; publishers get revenue but complain about summary-without-click and removals without notice.

---

## 4. SmartNews — the survivor heading to a Tokyo IPO

### 4.1 Bio
Founded 2012 in Tokyo by Ken Suzuki and Kaisei Hamamoto (CEO since Nov 2023; Shibuya HQ, US ops from 2014). Algorithmic "news beyond the filter" app: 3,000+ publisher partners, 400k+ articles/day in Japan, >75% read via SmartView quick-read mode. Arc: 2021 US-expansion hype (Series F) → Jan 2023 retrenchment (40% cut of US/China staff, ~120 people; China exit) → Japan-first re-monetization (SmartNews+ subscription, AI Matome summaries, self-serve ads) → **first full-year US operating profit in FY2025** (Toyo Keizai interview with COO Nin Gi 任宜, published **2026-06-16** — the "Aug 2026" date in the original draft was the Wayback snapshot timestamp, 2026-08-22, not publication; free digest syndicated via NTT docomo's d-menu News; a NewsPicks comment dated 2026-06-15 reads as the company's own acknowledgment; consolidated results were already profitable from FY12/2023 — the FY2025 milestone is US-segment-specific) → **TSE IPO: the October target has effectively lapsed without public progress**. Bloomberg reported (2026-03-24/25, EN and JP editions; earliest attribution Toyo Keizai Shikiho 2025-07-25) a TSE listing targeted as soon as **October 2026** below the 2021 ~$2B peak, with Mitsubishi UFJ Morgan Stanley Securities and Nomura as lead managers; as of 2026-09-23 **no securities registration filing, no TSE listing approval, and no postponement or withdrawal has been announced** — SmartNews is absent from TSE's approved October 2026 new-listing slate (approvals issued 2026-09-01 and 2026-09-08; JPX data via Google-indexed snapshots crawled 2026-09-18 — absence carries high, not absolute, confidence), a Toyo Keizai piece (2026-06-16) had already described the IPO speculation as "smoldering" (くすぶる) with no visible progress, and a late-October listing would require approval within ~a week, which no source anticipates.

### 4.2 Financial snapshot
| Metric | Figure | YoY | Confidence |
|---|---|---|---|
| Total funding | $410M-$479M across trackers (Series F: $230M @ $2B post, Sep 2021; +$69.3M SMBC venture debt Jan 2024 — no equity round since) | — | MED (trackers) |
| Revenue (all third-party) | GetLatka $104.5M ARR 2025 vs $163.8M (ZoomInfo/RocketReach/GetLatka-team-page 2024) vs ¥20-30B ad revenue analyst est. (~$130-200M) | CONFLICT — kept open | LOW-MED |
| Business mix | Ads ≈ 85-90%; SmartNews+ ≈ 5-10% | — | MED (analyst) |
| SmartNews+ | ¥1,480/mo; **100,000+ cumulative subscribers** (Jul 2025) ≈ ¥1.8B/yr (~$10M) run-rate | — | HIGH (company) |
| US business | First quarterly op profit Q3 2025 (Jul–Sep); **first full-year US op profit FY2025** (fiscal year ends December, so FY2025 = calendar 2025); consolidated results already profitable since FY12/2023 — the milestone is US-segment-specific | — | **MED-HIGH** (Toyo Keizai 2026-06-16, COO Nin Gi — free digest verified via d-menu/NTT docomo syndication; company acknowledgment visible on NewsPicks 2026-06-15) |
| Implied valuation (secondary/analyst) | ~¥203B (Oct 2023) → ~¥213B (Dec 2024) ≈ $1.3-1.4B | below $2B peak | LOW-MED |
| Headcount | Revelio 1,225 (2026, −2.5%) vs LeadIQ ~500 vs RocketReach 488 | CONFLICT | LOW-MED |

### 4.3 Engagement snapshot
| Metric | Figure | Confidence |
|---|---|---|
| Worldwide MAU | company/ad-materials 20-30M vs Sensor Tower ~5M (2023, after −28-30% YoY) | **CONFLICT** — never averaged |
| Japan MAU | ~15-20M, plateauing (analyst) | MED |
| US MAU | peaked ~10M; downloads halved 2022→2024 | MED |
| Cumulative downloads JP+US | 50M+ (Wikipedia) / ~45M installs since 2020 (Appfigures) | MED |
| Peak US engagement | highest monthly time-spent among US news apps (App Annie, Jul 2021) — historic | HIGH (dated) |
| DNR gateway share | US 3% (−3pp YoY); UK 1% | HIGH (DNR) |

### 4.4 Market-share snapshot
Standalone-app #1-2 in Japan (Yahoo! News app and LINE NEWS are the super-app rivals); marginal in the US (3% weekly gateway use, falling); effectively absent in EU.

### 4.5 UVP
"Effortless breadth with a speed habit." Very fast load, SmartView instant-read, algorithmic topical channels tuned over a decade on Japanese commute behavior — plus now an AI summary layer (AI Matome) and a cheap premium bundle of 50+ paywalled Japanese business outlets.

### 4.6 ICP
- **Primary (Japan):** 30-60 commuters, mass-market, ad-monetized; SmartNews+ upsell to business readers (Asahi/Nikkei-adjacent business titles).
- **US:** adults 35+ (company markets "$10T spending power" to advertisers); value-seeking readers who want one app instead of five.
- **Investor ICP (2026):** TSE Growth buyers pricing a profitable-Japan + turnaround-US story at ~¥200B.

---

## 5. Asia's Super-Aggregators (where aggregation still wins)

### 5.1 Yahoo! JAPAN + LINE NEWS (LY Corporation) — Japan
| Dimension | Data | Confidence |
|---|---|---|
| Bio | Yahoo! JAPAN (portal) + LINE (messenger) merged under LY Corp (A/SoftBank lineage); news is a tab in both | HIGH |
| Reach | Yahoo! News **57% weekly online news reach** (#1 brand, ahead of every publisher: NHK online 13%); LINE NEWS 18% | HIGH (DNR 2026) |
| Scale | LINE Japan MAU **100M** (Dec 2025); LINE NEWS **77M monthly users / 15.4B monthly PV** (Dec 2025 ad guide); Yahoo! JAPAN 54M logged-in IDs (Mar 2025); all three of Google/Yahoo Japan/LINE >80M monthly users each (Nielsen) | HIGH |
| Monetization | Yahoo! News trust 46/39/14 (trust/neither/distrust); Japan internet ad spend ¥4,045.9B +10.8% (2025, >50% of all ad spend first time); **34% of Japanese news-payers pay an aggregator** (highest in survey) | HIGH |
| Share | Aggregators beat social in Japan (1 of only 4 such markets) | HIGH |
| UVP | "The internet is the portal." News, search, commerce, messaging in one default environment; LINE NEWS pushes into the chat app 60%+ of the country opens daily | — |
| ICP | Mass-market all ages; advertisers buying 15B PV/mo of feed inventory | — |

### 5.2 Naver — South Korea
| Dimension | Data | Confidence |
|---|---|---|
| Bio | Portal-search-aggregator hybrid; "combine search with news aggregation within a single environment" (DNR); relaunched News Partnership Committee Feb 2026; **AI Briefing** (gen-AI answers atop search/news) live since Mar 2025 | HIGH |
| Reach | Naver news portal **56% weekly online news reach** (#1); Daum 20% (and Daum's Portal Biz revenue −11%, spun off Dec 2025); Naver = **92.1% share within portal news usage** | HIGH (DNR) / MED (KPF) |
| Scale | AI Briefing **30M monthly unique users**; first AI ads ON AI Briefing Jun 2026 (monetizing answers before any Western peer); ~70% of AI Briefing citations are Naver's own UGC | HIGH (Naver official) / MED |
| Conflict | Publishers: KFTC complaint (Apr 2025) over HyperCLOVA X training; planned copyright suits (Oct 2025) over Cue:/AI Briefing summarization | HIGH |
| Share | Portals 66.5% weekly usage (down from 79.2% peak 2021); short-form news doubled 11.1%→22.9% (2024→25); **SK = highest AI-chatbot news use (14%, +7pp)** and 56% of its AI users click through | HIGH |
| UVP | The Korean web's front door, now an answer engine that keeps users (CTR +8%, dwell +20% where Briefing shows) and pays a ₩20B creator fund | — |
| ICP | All Korean-language news consumers; advertisers on the only portal that matters | — |

### 5.3 Toutiao (ByteDance) — China
**No official ByteDance/Douyin-group disclosure of Toutiao DAU/MAU exists for 2025-2026** (Toutiao has been folded into the Douyin group strategy per 21财经; the CAC penalty of 2025-09-23 — 约谈/责令限期改正/警告 over content-management and hot-search failures — contains no user figures). Best current third-party estimate: **QuestMobile 2025Q2 average MAU ~391M** (3.91亿, vs Douyin 904M), per 21财经 (2025-09-25). A 网易号 analysis (2026-08-08; self-media grade — carry with caution) reports DAU fell below ~50M by 2025Q3 from a peak of ~120M (1.2亿, reached in Toutiao's 7th year ~2019, when MAU was 260M per the June-2019 datapoint) and 2024 ad revenue of RMB 8.6B (<1/10 of Douyin). **The earlier conflicting variants resolve as eras, not contemporaneous rivals:** "DAU ~130M" ≈ stale rounding of the 2017–2019 120M plateau (official《2019今日头条内容价值报告》: DAU 近1.2亿) — retired as a current figure; "MAU 260M" = the June-2019 datapoint; "MAU ~410M" = unverified, no 2025-26 source found (nearest is QuestMobile's 391M); "DAU >200M" = unsupported by any source found — **explicitly marked wrong and dropped**. Still #1 comprehensive news app in China; CAC algorithm-registration regime (Order No. 9) mandates personalization opt-outs. UVP: the original recommendation-feed news app whose machine won short-video (Douyin) as its own successor. ICP: Chinese mass market, fully regulated.

### 5.4 VerSe Innovation (Dailyhunt + Josh) — India
FY25 (ended Mar 2025): operating revenue **Rs 1,930 crore +88% YoY**; total Rs 2,071 crore (+64%); EBITDA burn cut 20% to Rs 738 crore; group-profitability targeted H2 FY26; claims 350M+ users (company-sourced, unverified); ~$1.9B raised (Josh round at $5B, Apr 2022); IPO target ~2-3 years out. **Notably absent from DNR 2026's India brand list** (English-speaking online sample — vernacular reach under-measured). UVP: vernacular (14-16 languages) news+short-video for Bharat, not metro-English India. ICP: tier-2/3 Android users; advertisers seeking non-English reach.

---

## 6. Ground News — the bias-comparison insurgent

### 6.1 Bio
Operated by **Snapwise Inc.**, Kitchener-Waterloo, Canada. Founded 2017 out of University of Waterloo's Velocity incubator (Wikipedia says Apr 2018 — both dates kept) by siblings **Harleen Kaur (CEO, ex-NASA New Horizons engineer) and Sukh Singh (CTO)** — not "2016 Toronto by Harpaul Sambhi" (unsupported by any current source; that tasking claim was discarded). ~18 staff ("media outsiders") per own site (LinkedIn band 51-200; Datanyze 29). Clusters ~60,000 articles/day from 50,000+ sources via NLP; rates each outlet Left/Center/Right (average of AllSides, Ad Fontes, MBFC — at publication level) and surfaces "Blindspot" stories under-covered by one side.

### 6.2 Financial snapshot
| Metric | Figure | Confidence |
|---|---|---|
| Total funding | **~$1.01M** (PitchBook, unconfirmed): Techstars 2018 (~$20k) + 2019 angel round; no VC series, no 2024-26 raise found | MED-HIGH (negatively: absence across PitchBook/Crunchbase free tiers) |
| Named individual investors | Marc Merrill (Riot Games), J. Joe Ricketts (TD Ameritrade), Tom Curley (ex-AP), Ashley Merrill, Craig Miller (ex-Shopify CPO) + funds NaHCO3, 37 Angels, Right Side Capital | HIGH (own About page) |
| Revenue | never disclosed; Datanyze low-confidence estimate $3.1M/yr | LOW |
| Pricing (web) | single plan **Vantage $99.99/yr** ($8.33/mo annual-only); affiliate $59.99/yr; mobile-only tiers Pro from $0.99/mo, Premium from $3.99/mo ($29.99-39.99/yr list; StackSocial $19.99) | HIGH (pricing pages/verified Aug 2026) |
| Group subs | 2-9 users 40% off; 10+ 50% off | MED |

The remarkable fact: a top-5 US standalone news app on ~$1M of lifetime outside capital.

### 6.3 Engagement snapshot
| Metric | Figure | Confidence |
|---|---|---|
| Web visits | Third-party estimates, side-by-side (never averaged): (a) Similarweb via CJR ("The Business of Balance", pub. 2025-09-08): just under **8M visits in Jul 2025**; (b) Semrush (page updated 2026-09-18): **4.09M in Aug 2026** (2.34 pages/visit, 07:29 session, 65.6% bounce). **Decomposition (2026-09-23 verify pass):** the two trackers already differed ~36% in the same mid-2025 period (Semrush showed 5.13M for Jun 2025, per its page archived 2025-07-19) — most of the 8M-vs-4.09M spread is a tracker-definition artifact, not a halving; within Semrush's self-consistent series the decline is real but moderate: 5.13M (Jun 2025) → 4.46M (Jul 2026) → 4.09M (Aug 2026) ≈ −20%/14mo, −8% MoM into Aug 2026. Similarweb's current absolute figure is not freely retrievable (live page CloudFront-403 bot-walled 2026-09-23; rank-only: #157 News & Media Publishers, #11,252 global). Never cite Semrush's 401.49K (organic-search-only subset) as total | DECOMPOSED (both sides verified as attributed) |
| Geo split | US 61.3%, UK 7.4%, CA 4.6%, DE 2.7%, SE 2.4% | MED (Semrush) |
| App Store US | **4.7★ from 48K ratings; #2 Magazines & Newspapers**; peaked #1 free news app spring 2025 | HIGH |
| Google Play | 1M+ downloads (third-party) | MED |
| Growth engine | **YouTube's most-sponsored brand** (Axios/Gospel Stats Oct 2025: 1,863 integrations, 664M views in sample) | HIGH |
| Trustpilot | 4.0-4.5 "Great"; 77% 5★ / 14% 1★; complaints: price, support, navigation | MED-HIGH |

### 6.4 Market-share snapshot
US weekly gateway use **3%** (DNR 2026); UK 1%. Traffic plateau-to-decline post-2025 peak: a real Semrush-series downtrend ≈ −20%/14mo (5.13M→4.09M) sitting atop a ~36% tracker-definition spread (§6.3 decomposition) — the "halving" reading is retired.

### 6.5 UVP
"See the whole story." Every story as a comparison of how Left/Center/Right covered it, plus ownership data and Blindspot nudges — media-literacy tooling sold as a subscription.

### 6.6 ICP
- **Primary:** politically self-aware US readers (survey: evenly distributed self-reported ideology), podcast/YouTube-news audiences (the sponsorship flywheel targets siloed communities deliberately), paying ~$100/yr for epistemics.
- **Critics' caveat (kept for balance):** outlet-level US-centric left/right labels called crude/false-equivalence (Literate Machine essay, Aug 2026; Reddit threads); AllSides says ratings used without formal permission/compensation (CJR) — a methodology-and-rights risk that a competitor could exploit.

---

## 7. The Challenger Set (shorter profiles)

### 7.1 NewsBreak — local-news aggregator (US)
Founded 2015 (ex-一点资讯 lineage); **$115M Series C led by Francisco Partners announced 2021-01-07** — "one of the first new unicorns of 2021" per TechCrunch and Francisco Partners; $1.1B per the Multiples.vc tracker; **no new round or valuation update announced in 2025–2026** (Revenue Memo 2026-08-25: no newer valuation officially confirmed). **40M monthly active readers — verified verbatim as self-reported** (PRNewswire 2026-05-06 SPOTLIGHTS release: "the 40 million monthly active NewsBreak readers across the U.S."; still on the Greenhouse careers page as of 2026-09-23); **no independent MAU figure exists anywhere — the absence is the finding** (no Sensor Tower/data.ai estimates published; Similarweb/HypeStat direct fetches blocked), though independent proxies are directionally consistent: DNR 2026 (Jun-2026 survey) puts NewsBreak at **8% US weekly gateway use** — the strongest standalone news app, ahead of Ground News and SmartNews (3% each), behind Google Discover (22%), Google News (12%), Apple News (10%) — and Similarweb via Press Gazette put newsbreak.com at **32.2M US visits in Aug-2025, +25% YoY** (first entered the US top-50 at #50 in Aug-2024 with 25.7M). GetLatka tracker estimate ~$100M ARR 2025 (LOW). Strategy: local news + SMB ad programs (SPOTLIGHTS, May 2026). UVP: "local first" — hyperlocal feeds where Google/Meta abandoned the beat. ICP: suburban/rural US readers 35+ and local advertisers. Confidence ceiling: scale rides the PR boilerplate; the survey/traffic proxies corroborate only "tens of millions," not 40M specifically.

### 7.2 Flipboard — the magazine that refuses to die
Independent, free, active in 2026. **"145M MAU" is a 2018-08-27 Digiday report of CEO Mike McCue's statement** (100M→145M after the Jan-2018 ad campaign) **and has never been refreshed**: about.flipboard.com states no current figure, advertise.flipboard.com does not resolve, and Expanded Ramblings (updated 2026-03-08) confirms the company "does not frequently publish official updated MAU totals" — the pre-2018 **100M baseline "remains the strongest durable user metric."** 2026 third parties still recycle it (Readless 2026-06-12 "company-reported 145M"; Google AI Overview "100M–145M") — treat as stale/unverified (LOW), never as a 2026 number. Pivot: fediverse — ActivityPub integration since Dec 2023, Bluesky connections, **Surf** reader for RSS+AT Protocol+ActivityPub (Dec 2024; "social websites" milestone with The Verge/WIRED/404 Media, Apr 2026). UVP: beautiful magazine-format curation now federated across the open social web. ICP: design-conscious readers 30-60; publishers wanting a poster-quality surface; fediverse early adopters (Surf).

### 7.3 Syft — the cautionary exemplar (brief's "#1 news app" claim NOT VERIFIED)
Built by **Orion Arm Pte. Ltd.** (Singapore; also Toki AI calendar; founded by Raymond Wang, ex-Ele.me co-founder); $11M raised Jun 2025 at $100M val (for Toki, not Syft specifically). Live since Sep 2025 (iOS reviews). Type-any-topic AI channels, daily 3-story brief, multilingual coverage, "no ads" claim. **Actual traction:** iOS US 4.6★ from just **66 ratings** (FR 4.6★/241 — its strongest market, chart #102 News); Play 4.1★/3.02K reviews/**100K+ downloads**; third-party estimate 75k+ iOS downloads, **outside US top-30 free news apps**; written-review average only 3.5. **Syft 3.0 redesign (mid-2026) triggered churn-to-Inoreader backlash** (merged topics into generic feed, removed daily summaries/morning email, paywalled category limits). Freemium IAP, price points undisclosed (JS-gated pricing page). Its June 2026 ad claimed "#1 news app in some major countries" — **no chart data corroborates**. Lesson for 03/05: AI-native branding ≠ retention; redesigns that break the calm promise kill trust fast.

### 7.4 Particle — the credible AI-native
Ex-Twitter (Sara Beykpour, Marcel Molina), founded 2023; **$15.3M raised** ($4.4M seed Kindred/Adverb + $10.9M Series A Lightspeed + Axel Springer, Jun 2024, with Reuters newswire partnership). iOS Nov 2024 → web May 2025 → Android Feb 2026; Feb 2026: podcast-clip mining, entity pages. "Best AI news app 2026" in roundups; **no user numbers ever disclosed**. UVP: AI summaries with multi-perspective story pages + primary-source links + story Q&A. ICP: news-power-users who pay for tooling; publisher-friendly posture (Reuters, Springer).

### 7.5 Folo & Feedly — the RSS renaissance (the quiet countercurrent)
- **Folo** (ex-FOLLOW.APP, by RSSNext/RSSHub creators, AGPL-3.0): **39,009 GitHub stars**, 2,131 forks, daily commits — one of the most-starred OSS readers ever. Pricing: Free 150 feeds/3 AI summaries per day → Basic $49.99/yr (1K feeds) → Plus $99.99/yr (2.5K, unlimited AI) → Pro $999.99/yr (25K). 1,543 official sources. UVP: open, AI-native, self-hostable RSS+social reader. ICP: developers/power users fleeing algorithms.
- **Feedly**: homepage now leads with **Threat Intelligence** (enterprise pivot; $1,600-3,200/mo tiers); consumer Pro $6/mo-annual, Pro+ $8.25-12.99/mo (only AI tier); 14M+ users (secondary) vs historic 15M+ self-claim — CONFLICT kept. UVP: the professional intelligence reader. ICP: security/market-intel teams; RSS veterans.
- Context: RSS-reader market ~$300M (2024, +6.3%/yr, vendor est.); "RSS downloads +30% YoY 2026" (weakly sourced, LOW); NewsBlur ships MCP server + CLI on a $36/yr plan; NetNewsWire 7 alive; WordPress Reader became an RSS+ActivityPub+Bluesky aggregator (May 2026). The calm/local-first niche is real but monetizes at $36-100/yr price points.

---

## 8. Technology-Stack Matrix — the leaders through a dev + DevSecOps lens (verified 2026-09-23, confidence per cell)

*Gapfill section added in the 2026-09-23 verification pass. Sources: live job postings (Workable/Greenhouse/Ashby/LSVP board), company GitHub orgs, engineering publications, and vendor bounty pages, all retrieved 2026-09-23. The three sparse cells (Ground News backend, Particle backend, Apple internal data stores) reflect genuine non-disclosure, not research gaps — marked, never guessed.*

### 8.1 Apple News
- **Frontend/mobile:** native Apple app across iOS/iPadOS/macOS/visionOS [high].
- **Backend:** internal; public evidence limited to 2026 job postings — Technical Operations Engineer (Apple News Operations, internal tools/automation, Culver City, ~2026-09-18) and Sr. DevOps Engineer, Info Apps ("infrastructure backbone for Apple News, Stocks, Weather, Creator Studio", 2026-09-11; a mirror titles an Info Apps identity-security role Golang/Swift) [medium].
- **Data stores / cloud:** not disclosed; runs on Apple internal infrastructure [sparse by design].
- **ML/personalization:** dedicated Sr./Staff ML Engineer postings for News (and News+Books, 2026-07-29) — "systems that power intelligent features for millions" [medium].
- **DevSecOps:** Apple Security Bounty up to $2M (>$5M with bonuses); categories incl. remote, wireless-proximity, physical, sandbox escape [high]. **No public engineering blog** [confirmed absence].

### 8.2 Google News / Discover
- **Frontend/mobile:** surfaces inside the Google app / Search properties.
- **Ranking stack:** BERT in Search (2019-10-25) → MUM on T5, 75 languages, multimodal (2021-05-18) → Gemini-era AI integration ("How AI powers great search results", 2022-02-03); Google's own ranking-systems guide notes **MUM is not used for general ranking** [medium-high].
- **Discover personalization:** intent inferred from user/app context without a query [medium-low].
- **Infra/data stores:** Google-internal (Borg/Spanner-class is Google-wide, not News-specific) — no News-specific disclosures [sparse — not guessed].
- **DevSecOps:** VRP at bughunters.google.com; AI VRP (2025-10-06) base ~$20K, max $30K with bonuses; >$430K paid in AI-product rewards to date [medium-high].

### 8.3 SmartNews
- **Frontend/web:** TypeScript + Next.js/React (live Workable posting, Shibuya); iOS + Android native apps; in-app WebView article experience [high].
- **Backend:** Java (JJUG talks, jpa-entity-generator) and Go (yoya-thumber thumbnail proxy, infra tooling) plus Python/Ruby; web backends deployed on Knative/Kubernetes [high].
- **Data:** Kafka → Flink + Apache Iceberg v2 real-time lakehouse (MySQL CDC dimension joins), Spark batch, Airflow orchestration, Hive + Presto query, S3 storage [high — dated 2023, SmartNews Medium].
- **Infra/cloud:** AWS (CloudWatch/ELB/Route53 tooling, S3) + Kubernetes/Knative; observability via Grafana Mimir + Honeycomb Refinery forks [medium-high — org-fork-inferred].
- **ML:** in-house MLOps platform ("data generation to model deployment"), MLRun fork, rsdiv multi-objective reranking library, ads ranking/bidding/auction systems; TARS test-automation (2026-03-18) [medium].
- **DevSecOps:** Akamai ETP as corporate security control (2019, dated); GitHub org "security-normal" topic; HackerOne response policy, security@smartnews.com [medium-low].

### 8.4 NewsBreak
- **Frontend/mobile:** Android Kotlin + Jetpack Compose across an app matrix (flagship/Lite/short-drama/local); bonus skills KMP/Flutter/RN; an in-house agentic "auto-dev bot" lands reviewed PRs daily — most merged client PRs start from an agent [high]. iOS specifics: not disclosed [sparse].
- **Backend:** strong Java on Kubernetes with CI/CD, high-QPS recommendation-serving; self-described AI-native backend where production AI agents already diagnose live incidents, analyze metrics, triage user feedback [high — live posting].
- **Data:** Kafka backbone of mobile user events, Spark (billions of rows/day), Airflow, Hadoop, Presto/Trino, Flink; preferably AWS S3/EMR/Glue/Redshift [high — live posting].
- **ML:** recsys + adtech serving 40M claimed MAU; AIOps agents in production [high per postings].
- **Conflict:** "Rust for low-latency adtech microservices" appears only in a Google AI Overview (LinkedIn-derived) — carried as unverified/LOW against the verified Java-centric postings [conflict, not averaged].

### 8.5 Ground News
- **Frontend/web:** Next.js/React/TypeScript (live Ashby "Staff Engineer, Web" posting); owns the web A/B experimentation program; PostHog/Amplitude/Segment funnel instrumentation; marketing stack Unbounce→Framer; Flightcontrol safe-rollouts on revenue-critical surfaces; CWV/SEO/accessibility focus; products = mobile app + web app + browser extension [high].
- **Mobile:** native apps exist; platform split undisclosed in postings [sparse].
- **Backend/data stores:** not publicly disclosed [sparse — explicitly noted, not guessed].
- **ML:** none claimed — positioning is explicitly anti-algorithm (human comparison tools, bias ratings) [high as a product stance].
- **DevSecOps:** no public incentivized bounty found; do NOT attribute the Ashby ATS footer's "Vulnerability Disclosure" link to Ground News [medium-low].
- **Org:** small team (2 open roles 2026-09-23), remote-first Canada/US, HQ Kitchener ON.

### 8.6 Particle
- **Frontend/web:** TypeScript + React, GraphQL, Plotly data visualization; LLM tooling built by the same web team (sole public eng role, "Web & LLM Tools Engineer", $150–175k, posted 30+ days) [high for skills].
- **Mobile:** consumer app exists; stack undisclosed [sparse].
- **Backend/infra/data stores:** undisclosed [sparse].
- **ML/personalization:** AI-native summarization product built on LLMs; founders ex-Twitter; Series A (Lightspeed + Axel Springer), ~10-100 staff [medium].
- **DevSecOps:** nothing public found [sparse].

### 8.7 Flipboard
- **Frontend/mobile:** historically iOS (Objective-C; FLAnimatedImage) + Android (Java; bottomsheet) + React web (react-canvas, 13.2k stars) + a React Native YouTube-iframe fork [high — dated GitHub facts]; current flagship plus Surf.
- **Backend/data:** Python/Java/Node lineage; Airflow, Marquez data-lineage, PyBase (HBase client) forks, custom haproxy-2.6 [medium — fork-inferred].
- **Open-social stack (the current differentiator):** Surf (announced 2024-12-18) federates ActivityPub + AT Protocol (Bluesky PDS/atproto, TypeScript) + RSS; official Surf SDKs in Python/TypeScript/Go/Java; search spanning billions of posts across protocols (The Verge, 2026-04-02) [high for protocols/SDKs, medium for prod inference].
- **ML:** historical Domain Ranker trust classifier, LDA story clustering, CNN image upscaling; engineering blog dormant since 2017-05-30 [high facts, dated].
- **DevSecOps:** HackerOne response policy covering "Flipboard and Surf", security@flipboard.com [medium-low].

*Method note: company non-disclosure is itself a finding — the two US insurgents whose stacks are least visible (Ground, Particle) are also the two with no public security bounty; contrast Apple ($2M+) and Google ($30K AI VRP). For the founder, the practical takeaways are (a) TypeScript-everywhere is now table stakes at challenger scale (SmartNews web, Ground, Particle all TS+React), (b) the Kafka→Flink/Iceberg→Presto lakehouse pattern is the incumbent answer to "how do you pipeline 400k articles/day" — exactly the shape 09's pipeline redesigns for one operator, and (c) agentic CI (NewsBreak's auto-dev bot) is the 2026 frontier signal for solo-dev leverage.*

---

## 9. Leader Comparison Matrix (September 2026)

| | Apple News | Google Discover/AIO | Yahoo! JAPAN+LINE | Naver | SmartNews | Ground News | NewsBreak | MSN/Copilot |
|---|---|---|---|---|---|---|---|---|
| Weekly reach, home market | 10% US (−4pp) | Discover 22% US (+6pp) | 57% JP / 18% (LINE) | 56% KR | ~3% US; JP #1-2 app | 3% US | 8% US | 8% US (MSN, DNR); 5% UK |
| Scale claimed/est. | ~125M/mo reach (LOW-MED) | AIO 2.5B; AI Mode 1B+ | LINE NEWS 77M/mo | AI Briefing 30M MUV | MAU 20-30M co. vs ~5M tracker (CONFLICT) | Semrush 5.13M→4.09M visits (Jun-25→Aug-26); Similarweb reads ~36% above | 40M MAR (self, verbatim PR); 32.2M US visits Aug-25 | Copilot 320M |
| Financials | Services $30.7B qtr +12.1% (News slice hidden) | hidden in Search ads | LY Corp; JP ad market ¥4.05T +10.8% | KRX-listed; AI ads since Jun 2026 | ~$100-164M rev est.; IPO Oct-2026 target lapsed (no filing by 2026-09-23) | ~$1.01M raised; rev hidden | ~$100M ARR est. (LOW); $115M Series C 2021 → $1.1B val (no re-rating since) | inside Microsoft |
| Business model | 50% of News+ subs; free-tier ads to publishers | search ads on answers | portal+feed ads; 34% of JP payers pay aggregators | search+feed ads; ₩20B creator fund | 85-90% ads; SmartNews+ ¥1.8B RR | subs $100/yr web; mobile $1-4/mo | local ads + SMB programs | ads in Start/Copilot; publisher marketplace |
| Momentum 2026 | Services record but US reach −4pp | referrals −33/−38%; EU fines/complaints | stable-dominant | AI Briefing monetizing; publisher legal fight | US FY2025 first op profit (COO Nin Gi, 2026-06-16); IPO target lapsed | plateau post-peak; YouTube engine | traffic +25% YoY Aug-2025 (later trend undisclosed); self-reported scale | MSN visits −28% YoY |
| Biggest known unknown | US News+ subs | per-query AIO damage by vertical | LY Corp segment P&L | publisher-suit outcome | real MAU | subscriber count | real MAU/DAU | MSN MAU |

---

## 10. What "Leader" Means in This Market — three takeaways for the founder

1. **The leaders' moat is distribution, and it's pre-installed.** Apple News (iOS default), Discover (Android default), LINE NEWS (the messenger), Naver (the portal), MSN (Windows). No standalone app in the US exceeds 8% weekly reach; the winning strategy for a new entrant is not to out-app them but to out-position them on the axis they structurally can't occupy (provenance, calm, ownership — see 03/05).
2. **Every leader is now an AI-answer company.** Google AIO/AI Mode, Naver AI Briefing (already ad-monetized), Copilot, SmartNews AI Matome, Yahoo/Artifact, Particle. The differentiating question in 2026 is not "AI summaries?" (table stakes) but "AI that sends you to the source" vs "AI that ends the session" — DNR's 42%-of-AI-users-click-through vs 4% full-sample split is the whole strategic map.
3. **Financial opacity is the norm; treat every scale number in this file as a confidence-bracketed claim.** The verifiable financial truths are: Apple Services records, VerSe's +88% FY25, Gunosy's ¥6.4B (+5.6%), and the UK Enders Apple News+ estimate. Everything else — SmartNews MAU, NewsBreak 40M, Flipboard 145M, Syft "#1" — is self-reported, stale, or third-party guessed, and the deliverables in this project only build on the bracketed versions.

---

## 11. Sources (primary set)

Apple: newsroom.apple.com Q1/Q2/Q3-FY2026 results; apple.com/newsroom 2026-01 record-year claim; Enders Analysis "The Big Apple's Uneven Bites" (2026-01, via Nieman Lab); pressgazette.co.uk News+ terms; goodereader 125M claim; support.apple.com HT208435 availability. Google: blog.google I/O-2026 Search; searchenginejournal AI Mode data (2026-05-19); Reuters Institute DNR 2026 exec summary + country pages (reutersinstitute.politics.ox.ac.uk, 2026-06-16); Chartbeat via DNR; NewzDash via seroundtable (2025-12-23); digiday/Similarweb zero-click (2025-07); Ahrefs/BrightEdge/PPC-Land/SEL CTR studies (2025-04→2026-03). Yahoo/Microsoft: similarweb.com most-visited (2026); pressgazette US monthly traffic tables (2025-2026, incl. 2026-09-09 Aug-2026 data); msn.com/partnerhub; thurrott/Axios publisher marketplace; yahooinc.com Artifact press (2024). SmartNews: PRNewswire Series F (2021-09-15); TechCrunch layoffs (2023-01-12) and decline analysis (2024-01-08); Bloomberg IPO reporting (2026-03-24/25, EN+JP editions; earliest attribution Toyo Keizai Shikiho 2025-07-25); JPX October-2026 approved-new-listing cohort (Google-indexed snapshots crawled 2026-09-18); Toyo Keizai US-profit interview (2026-06-16, COO Nin Gi 任宜, toyokeizai.net/articles/-/948215; free digest via d-menu syndication topics.smt.docomo.ne.jp; NewsPicks company comment 2026-06-15); about.smartnews.com (leadership, SmartNews+ 100k 2025-07-23, AI Matome, self-serve ads); getlatka/cbinsights/revelio trackers; ipokabu secondary valuations. Asia: lycorp.co.jp LINE 100M (2026-01-29); lycbiz.com LINE NEWS product guide (77M/15.4B PV, 2025-12-20) and LY media guide; netratings.co.jp Nielsen Tops of 2025 (2026-01-15); dentsu.co.jp ad-spend (2026-03-05); journalist.or.kr / mediatoday.co.kr KPF survey; ads.naver.com AI Briefing 30M + ad launch (2026-06-15); newsis.com AI Briefing citations (2026-05-28); yna.co.kr publisher suits; kitaishihon.com Gunosy FY3/2026; entrackr.com VerSe FY25; cloud.google.com Dailyhunt; 21jingji.com QuestMobile 2025Q2 Toutiao MAU ~391M (2025-09-25) + news.qq.com mirror (2025-09-24); 163.com 网易号 Toutiao analysis (2026-08-08, self-media grade); cyzone.cn official《2019今日头条内容价值报告》coverage; wallstreetcn.com DAU-plateau reporting (2020-05); baike.baidu.com June-2019 datapoint. Ground News: ground.news about/subscribe/rating-system; cjr.org business-of-balance (2025-09-08); semrush.com ground.news overview+competitors pages (Jun-2025 via Wayback 2025-07-19 = 5.13M; Jul-2026 = 4.46M; Aug-2026 = 4.09M; updated 2026-09-18); similarweb.com ground.news (Aug-2026 rank-only: #157 category / #11,252 global; live page bot-walled); revenuememo.com ownership (2026-08-18); apps.apple.com US listing; semrush.com overview; en.wikipedia.org Ground_News + Axios/Gospel Stats; trustpilot.com; stationx.net/zapier/inspiretothrive pricing. Challengers: prnewswire NewsBreak SPOTLIGHTS (2026-05-06 — verbatim "40 million monthly active" claim); job-boards.greenhouse.io/newsbreak (careers page, 40M+ boilerplate live 2026-09-23); techcrunch.com + franciscopartners.com $115M Series C (2021-01-07); multiples.vc ($1.1B, 2021 vintage); revenuememo.com no-re-rating check (2026-08-25); pressgazette.co.uk US top-50 tables (2026-09-09 edition: 32.2M Aug-2025 US visits, +25% YoY; Aug-2024 entry at #50/25.7M); getlatka NewsBreak; digiday.com 145M-origin interview, CEO Mike McCue (2018-08-27); expandedramblings.com Flipboard statistics (2026-03-08); readless.app Flipboard 2026 recycling (2026-06-12); en.wikipedia.org Flipboard/Surf; apps.apple.com + play.google.com + mwm.ai + appbrain (Syft); techinasia/dealroom Orion Arm; techcrunch Particle (2024-02-29, 2024-06-11, 2026-02-23); follow.is/pricing + api.github.com RSSNext/folo; feedly.com + readless.app Feedly; inoreader.com/pricing; newsblur.com/pricing; netnewswire.com. **Tech-stack matrix (§8):** apply.workable.com/j/4A137C14CC (SmartNews Web Frontend Engineer, live); job-boards.greenhouse.io/newsbreak/jobs/4700557006 (Backend–AI Platform), /4692231006 (Data Infra), /4700550006 (Android–AI-Native Client); jobs.ashbyhq.com/groundnews/ebd713ad (Staff Engineer, Web); jobs.lsvp.com/jobs/particle-news (Web & LLM Tools Engineer); jobs.apple.com Technical-Operations-Engineer-Apple-News + Sr-DevOps-Engineer-Info-Apps + ML-Engineer-News postings (2026-07-29→09-18, snippet-level via mirrors); github.com/smartnews + github.com/flipboard (org repos/topics, fetched 2026-09-23); medium.com/smartnews-inc Flink+Iceberg lakehouse post (2023-04-18); blog.google BERT (2019-10-25) + MUM/T5 (2021-05-18) + AI-powers-search (2022-02-03); security.apple.com/bounty/; bughunters.google.com AI VRP announcement (2025-10-06).

*Every figure above carries its digest-level provenance in `independent_research/scratch/research-news-aggregator-2026-09/scratch/notes/` (digest-round2-us-market-leaders, digest-round2-dnr-2026-tables, digest-round2-syft-rss-deep, digest-smartnews, digest-ground-news, digest-ai-native-apps-syft, digest-asia-market, digest-eu-market, digest-underserved-competitive).*

---

# ═══ FILE: 02-market-forecast-tam-sam-som.md ═══

# 02 — Market Forecast (2026–2029) and TAM / SAM / SOM / TOM for a New Entrant

**Date:** 2026-09-23
**Companion files:** 00-executive-summary, 01-market-leaders, 03-gap-analysis-blue-ocean, 09-architecture-plan, 10-deployment-plans.
**Method note:** every figure carries its source and confidence label. Where reputable sources disagree, **both figures are shown, never averaged**. Report-mill market sizings are treated as directional context, not ground truth — the definitional chaos documented in §1 is itself a finding.

---

## 1. How Big Is This Market? (The Honest Answer: Nobody Agrees)

### 1.1 The "news aggregator market" sizing spread, 2025–2026

Six reachable estimates of "the news aggregator market" span **~7× from lowest to highest**, across at least three incompatible definitions (app-store consumer spend vs. aggregator platform revenue vs. total news-application revenue):

| Source (report mill) | Scope claimed | Base year value | Forecast value | CAGR | Confidence |
|---|---|---|---|---|---|
| MarketResearchIntellect (6th ed. 2026) | News aggregator (web/mobile/social/RSS) | $2.73B (2025); ~$3.0B (2026) | $6.65B (2035) | 9.3% | Low — same mill's alternate crawl shows $2.5B (2024) → $5.1B (2033), numbers churn between editions |
| Future Market Report | News aggregator | $10.70B (2025) | $25.50B (2033) | 11.47% | Low — 4,930-page report, methodology undisclosed |
| Business Research Insights (#123946) | News aggregator | $16.18B (2026) | $35.43B (2035) | 9.1% | Low |
| Growth Market Reports | AI-driven news aggregation | $6.3B (2025) | $27.7B (2034) — headline on same page says $26.28B | 17.2% | Low — internally inconsistent page |
| Grand View Research | News & magazines **apps** | $1.18B (2021) | ~$2.46B (2028) | 11.0% | Medium — stale (2021 base) but internally consistent; NA ~35% share, APAC fastest (13.3%) |
| SkyQuest | News and magazines app | $2.13B (2024) / $2.37B (2025) | $5.49B (2033) | 11.1% | Low-medium |
| BRI (#101333) | News **application** (broadest) | $26.23B (2026) | $113.66B (2035) | 17.7% | Low — a fourth, much broader definition |

**Meta-finding (high confidence, as a finding about the data):** the ~$2.4B–$16.2B spread on "global news-aggregator market 2025/26" across six mills is the core caveat for any TAM exercise. IMARC and The Business Research Company do not even carry a standalone "news aggregator" report (nearest TBRC label: "News Syndicates") — a coverage gap among the major mills themselves.

**Practical consequence for a founder:** do not anchor strategy to any single mill number. Anchor instead to (a) observable revenue at real companies (SmartNews ~$100–200M/yr estimates; Ground News ~$3.1M low-confidence Datanyze estimate; Gunosy ¥6.44B ≈ $43M FY3/2026 actuals; NewsBreak ~$100M ARR tracker estimate), and (b) the monetization pools the category draws from (§1.2).

### 1.2 The pools aggregators actually monetize against (higher-confidence anchors)

| Monetization pool | Latest figure | Source | Date |
|---|---|---|---|
| US digital ad revenue | **$294.6B** (+13.9% YoY, no cyclical events) | IAB/PwC FY2025 | 2026-04-16 |
| US digital ad spend growth forecast 2026 | +12.3% YoY | IAB | 2026 |
| European digital advertising | **€131B** (+10.5%); retail media €13.3B (+16.7%) | IAB Europe AdEx 2025 | 2026 |
| Japan internet ad spend | **¥4,045.9B** (+10.8%, first time >50% of all ad spend; total ad market >¥8T) | Dentsu | 2026-03-05 |
| Japan internet ad *media* spend (narrower basis) | ¥3.31T (2025) → ¥3.58T (2026F) | Dentsu via krows-digital | 2026 |
| Japan in-app advertising | $9.21B (2025) → $10.50B (2026), 14.16% CAGR to 2034 | IMARC | 2026 |
| Global total advertising 2026 | $1.06T–$1.30T (Dentsu $1.06T +5.0–5.1%; WARC $1.30T +9.1%; WPP $1.3T; Statista $1.26T); digital ≈69–74% of total | Dentsu / WARC / WPP / DataReportal | 2025-12 – 2026-06 |
| Global E&M revenue 2030F | $4.2T (CAGR 3.4%); advertising ~$1.4T | PwC GEMO 2026–30 | 2026-06-22 |
| APAC 2026 | Fastest region (+5.9%); ~$198B digital (secondary source) | Dentsu | 2025-12 |
| US newspaper ad spend 2026E | $10.16B, −1.2% CAGR 2025–30 (snippet-only) | eMarketer via MarketingCharts | 2026 |
| News subscription service market | $23.99B (2026) → $62.87B (2035), 11.3% CAGR | BRI #124045 | 2026 — low confidence |
| Digital newspapers & magazines | $32.53B (2025) → $49.19B (2032), 6.08% CAGR | 360iResearch | 2026 — low confidence |
| RSS reader niche | ~$300M (2024), +6.3%/yr — single vendor-sourced figure via a competitor blog | Verified Market Reports via Readless | 2024 — low confidence |
| Content/recommendation engines (tech supply side) | $6.15B → $32.79B (2025–31, 32.2% Mordor); $9.3B → $33.2B (2026–30, 36.3% GVR) | Mordor / GVR | 2025–2026 |

### 1.3 Demand-side structure (Reuters Institute DNR 2026, 48 markets, ~100k respondents — the highest-quality dataset in this file)

| Indicator | DNR 2026 value | Trend |
|---|---|---|
| Social/video networks as news source | **54% — first time the #1 source**, overtaking TV (52%) and news sites/apps (51%) | TV −13pp, sites/apps −12pp since 2020 |
| 18–24s whose main news source is social/video/AI | **52%** (44% of 25–34s) — 32pp ahead of next source | News sites/apps no longer lead for ANY age group |
| Trust in news | **37% — lowest since 2015**; fell in 29/48 markets (US 25%, France 29%, Germany 46%) | −3pp YoY |
| News avoidance (sometimes/often) | **42%** flat YoY (29% in 2017); 60%+ in BG/HR/GR/TR | Interest in news down 13pp since 2021 (59%→46%) |
| Paying for online news (20-country basket) | **17%** (18% in 2025); Norway 40%, Sweden 32%, US 16% (repoll; 13% original fieldwork) | 10–20% looks like the ceiling in most markets |
| Paying relationship with **aggregators** | Japan: **34% of news payers** pay an aggregator; South Korea & Hong Kong: ~half of payers | East Asia is where aggregator subscription is normal |
| Weekly AI-chatbot use for news | **10%** (7% in 2025); 16% under-35s; UK lowest 4%; no growth in US/UK/FR/DE | Only 1% call AI their main source; trust 20% (44% users / 17% non-users) |
| Click-through from AI chatbots to sources | **4%** always/often (search 19%, social 17%); 42% among chatbot users | The referral-starvation number |
| Google organic search traffic to 2,500+ publisher sites | **−33% global / −38% US** (Nov 2024–Nov 2025, Chartbeat) | Publishers expect −43% over 3 years; Reach plc Discover −46% H2 2025 |
| Creator news | 27% get news from news-focused creators; 46% from any creators | Rated more entertaining, less trustworthy |

Pew corroboration (Aug 2025 survey): 86% of US adults get news from digital devices at least sometimes (56% often); preferred digital pathway: news websites/apps 21%, social 14%, search 10%, podcasts 6%, newsletters 3%, AI chatbots <1% (news-app preference down from 26% in Pew's 2021 survey).

---

## 2. Market Forecast — Next 1–3 Years (2027 / 2028 / 2029)

### 2.1 The five structural forces

**Force 1 — The AI answer layer is eating the referral economy (high confidence, magnitude contested).**
Publisher traffic damage from Google AI Overviews / AI Mode ranges by method and outlet from a **median −10% (Kint premium publishers)** and −25% (Digiday-cited) to **−30% Mashable, −62% Wired, −85%+ Verge/HowToGeek/ZDNet, −97% Digital Trends** (8.5M → 264,861 monthly clicks, Mar 2024–Jan 2026). Ahrefs (Feb 2026): −58% CTR for top-ranking pages when an AI Overview appears. Post-Google I/O 2026, ~60% of queries are zero-click (TNW). Chartbeat: ChatGPT referrals +200% YoY but still <1% of referrals. **Forecast:** by end-2027, publisher dependence on owned surfaces (apps, newsletters, direct) intensifies; "aggregation with attribution traffic" becomes a sales pitch aggregators must answer for. Both ends of the damage range are reported; the truth is query-class-dependent (hard-news queries remain mostly excluded from AI Overviews per DNR).

**Force 2 — Regulators are reshaping the aggregator–publisher relationship (high confidence).**
Timeline already in motion: EU Commission fined Google **€890M under the DMA** (2026-07-23: €460M Search self-preferencing + €430M Play steering), with Google itself proposing to apply the decision's non-discrimination principles to AI Overviews/AI Mode (per EPC readout); EPC filed an Article 102 antitrust complaint over AI Overviews (2026-02-10); a formal EC antitrust investigation into Google's AI use of publisher content opened 2025-12-09; EU regulators polled publishers (July 2026) on Google's AI opt-out (global rollout completed 2026-08-31); UK CMA ordered Google to let publishers opt out of AI features (2026-06-03). EU AI Act Article 50 transparency obligations took effect 2026-08-02 (AI-interaction disclosure, machine-readable marking of generative output, deepfake/public-interest labels), with Commission guidelines adopted 2026-07-20; Digital Omnibus deferred some Annex III high-risk duties to 2026-12-02. NYT v. OpenAI/Microsoft (SDNY) sits at summary-judgment cross-motions with DOJ backing fair use — the single biggest legal wildcard for AI summarization economics. China's algorithm-registration regime (CAC Order No. 9) already mandates filing + personalization opt-outs.
**Forecast:** by 2028, "licensed-content AI summaries with visible provenance" stops being differentiator and becomes compliance baseline in the EU; per-answer/per-summary micropayment plumbing (Perplexity's $42.5M rev-share program — verified partner trajectory: 6 named launch partners Jul 2024 → ~21 named after the Dec-2024 expansion → "~20–30 major media" per 2026 trade coverage; the oft-cited "2,400+ partners by Q1 2026" traces to a single low-authority, undated tertiary page and is **not verified** — a conflicting "300+" figure also circulates; Comet Plus launched with exactly 7 publishers, paid from 80% of the initial $42.5M pool) matures into a standard licensing grid an indie aggregator can buy into.

**Force 3 — Social platforms won; attention is the scarcity (high confidence).**
Social/video (54%) > TV (52%) > sites/apps (51%); 52% of 18–24s main-source via social/video/AI. Facebook news usage reversed its decline (43% weekly). Reddit at 130.3M DAU (Q2 2026) is the de-facto community news aggregator. Creator news (27%) absorbs vertical attention. **Forecast:** standalone aggregator apps' TAM shrinks at the young end unless they recruit from social-native behavior (swipe, video, creator voices) — Syft's swipe UI and Bluesky custom feeds ("the defining growth mechanic in 2026", now copied by YouTube per Tubefilter 2026-08-26) point at the absorption pattern.

**Force 4 — Trust/avoidance is the demand-side ceiling (high confidence).**
42% avoidance, 37% trust (record lows), 62% worried about fake news online (+4pp), Gallup US media trust 28%. Doomscrolling harms documented across 2023–2025 peer-reviewed work. **Forecast:** "calm news" productization (chronological, event-clustered, bounded sessions — 1440 at 4.6M subs / $101M valuation; Wisp/Particle/Slow News Co category) grows from niche to recognized category by 2028. This is the wedge a new entrant can own (see 03-gap-analysis).

**Force 5 — Asia consolidates around super-apps + AI answers; the West around bundles (high confidence).**
Japan: LINE NEWS 77M monthly users / 15.4B PV (Dec 2025), Yahoo! JAPAN 54M logged-in IDs, SmartNews ~20M (company claim) profitable in Japan since FY12/2023 with first full-year US operating profit FY2025 (Toyo Keizai 2026-06-16) — its sub-$2B Tokyo IPO **targeted for Oct 2026 (Bloomberg 2026-03-24/25) has effectively lapsed**: no securities filing, no TSE approval, no postponement announced as of 2026-09-23, and SmartNews is absent from TSE's approved October-2026 new-listing cohort. Korea: portal news usage fell to 66.5% (peak 79.2% in 2021) while short-form news doubled (11.1%→22.9%); Naver AI Briefing hit 30M MUV with ads on it since 2026-06-15 — the first monetized gen-AI answer layer at national scale; Naver cites ~70% self-UGC in Briefing citations. China: Toutiao has no official disclosure — current best estimate **QuestMobile 2025Q2 average MAU ~391M** (per 21财经 2025-09-25); the older "DAU ~130M / MAU 260–410M" figures resolve as eras (the 2017–19 ~120M-DAU plateau and a June-2019 datapoint respectively), and "DAU >200M" claims are unsupported — dropped. India: VerSe (Dailyhunt+Josh) revenue +88% FY25 (Rs 1,930 crore operating), targeting profitability H2 FY26, IPO in ~2–3 years. **Forecast:** by 2029 no standalone news app cracks the Japan/Korea super-app duopoly; India remains the only large open field (no super-app owns news distribution), and vernacular/local (Public App 80M users, 15B monthly views) is the growth surface there.

### 2.2 Year-by-year outlook (analyst synthesis, all labeled as inference from cited forces)

| Year | Base case | What would falsify it |
|---|---|---|
| **2027** | AI-chatbot news use crosses ~12–15% globally (from 10%); first EU enforcement of AI Act Art. 50 against a major summarizer; SmartNews's lapsed TSE listing (October target passed without a filing as of 2026-09-23) either revives on a 2027 timetable or is formally abandoned — still a binary sentiment event for the aggregator category; Apple News+ remains US/UK/CA/AU-only; Google's EU AI-news compensation framework (post-DMA) materializes as extended ENP-style deals | Chatbot news use stalls under 11% (UK-style saturation spreads); DMA principles not applied to AI surfaces in practice |
| **2028** | Publisher referral traffic from search down cumulative −50%+ from 2024 baseline (publishers already expect −43% by ~2028–29); licensed-AI-summary grid becomes purchasable by independents; "calm news" apps reach combined ~15–20M MAU (from ~10M core across 1440/others); at least one AI-native news app (Particle-class) reaches profitability or is acquired | Referral declines plateau; NYT v. OpenAI settles with a licensing-only outcome that locks independents out |
| **2029** | Aggregator category bifurcates: (a) super-app/bundle tabs monetizing attention at scale, (b) small trust/vertical/calm specialists monetizing subscriptions at $5–15/mo; middle (generic ad-funded standalone aggregators) hollows out — the SmartNews 2023–2026 arc (US retreat → Japan refocus → IPO below peak valuation) is the template | A new distribution surface (wearables? agentic news butlers?) reopens the middle |

### 2.3 Scope-file prediction scorecard (from 00-scope.md, restated)

| Prediction made before research | Verdict after research |
|---|---|
| US leaders = Apple News + Google | **Partially confirmed** — Google/MSN/Yahoo hold the reach; Apple News is the subscription surface; Pew: only 21% prefer news websites/apps; Google News/Discover is the structural leader (pending gap-fill agent confirmation) |
| EU = Google News/MSN + national brands | **Confirmed** — Google dominant intermediary; MSN #4 app in Italy; NewsNow 11M uniques UK; PSB brands lead DE/FR/Nordics |
| Asia = algorithmic/super-app | **Confirmed** — LINE NEWS 77M, Yahoo! News, Naver 92.1% portal share, Toutiao, WeChat; standalone apps second-tier |
| SmartNews Japan-refocus | **Confirmed** — 2023 US/China retrenchment, CEO transition, SmartNews+ 100k subs, TSE IPO Oct-2026 target effectively lapsed (no filing by 2026-09-23) |
| Ground News category-of-one | **Confirmed with nuance** — bias-comparison is its own niche (AllSides/NewsGuard adjacent but different products); 8M→4M visits trajectory contested |
| AI-native graveyard (Artifact-class failures) | **Partially confirmed** — Artifact dead (acquired by Yahoo), Otherweb quiet, throwaway-AI-app trend flagged by Nieman; BUT Particle alive-and-shipping (Android Feb 2026, Webby nominee) and Syft iterating — the graveyard has survivors pairing AI with publisher partnerships |
| Complaint clusters: ads/notifications/trust | **Confirmed** — SmartNews ad/notification reviews, Apple News+ ad confusion, Ground pricing fragmentation, notification fatigue 43% |
| VPS thresholds (deployment) | Addressed in 10-deployment-plans |

---

## 3. TAM / SAM / SOM / TOM for a New Startup

**Definitions used (stated so the math is auditable):**
- **TAM** — total annual spend capturable by news-aggregation products worldwide (ads + subscriptions + licensing), bounded by the observable pools in §1.2.
- **SAM** — the portion reachable by a realistic independent, English-first, multilingual-capable mobile+web news app in US/UK/CA/AU + EU English-speaking diaspora.
- **SOM** — 3-year obtainable revenue for that startup under the release strategy in 07.
- **TOM** — 10-year target share under blue-ocean execution (03-gap-analysis).

### 3.1 TAM — three defensible framings

| Framing | Anchor math | TAM estimate | Confidence |
|---|---|---|---|
| **A. Company-revenue anchored (recommended)** | Sum observable aggregator-class revenue: SmartNews ~$104.5–163.8M (tracker range) + Gunosy ¥6.44B (~$43M actuals) + NewsBreak ~$100M (tracker) + Flipboard (undisclosed; ad-funded) + Ground News ~$3.1M (Datanyze, low conf.) + Apple News+ share of Services (undisclosed) + Google News (indirect/ads) + LINE NEWS / Yahoo! News / Naver News (embedded, undisclosed) | **~$1.5–3B/yr observable standalone-aggregator revenue; $5–8B/yr including platform-embedded news surfaces** | Medium — bottom-up from real companies, but the largest players (Apple/Google/LY Corp/Naver) don't disclose news-line revenue |
| **B. Report-mill consensus** | Median of the six mills in §1.1 | **~$6–10B (2026), growing 9–12%/yr; AI-driven sub-segment ~17%/yr** | Low — definitional chaos documented above |
| **C. Monetization-pool share** | News-adjacent share of digital ad pools: US digital ads $294.6B × ~2–4% news-context share ≈ $6–12B (US) + EU €131B × similar ≈ €3–6B + Japan ¥4.05T × news-app share ≈ ¥150–300B + subscription pool (17% of news users paying, $10–12 ARPU) | **~$15–25B/yr global news-distribution monetization** | Medium-low — the news-context share is inferred, not measured |

**Working TAM for this project: $8–15B/yr global, growing ~8–12%/yr nominal** (blend of A and C, with B as sanity bounds). The AI-native sub-segment is the fastest-growing slice (~17%/yr per GMR — low confidence, single mill).

### 3.2 SAM — serviceable addressable market

Filters applied:
1. **Geography:** US + UK + CA + AU (the Apple News+ footprint — English-first, high iPhone share, proven subscription willingness: US 16%, ~17% basket paying) + EU English-reading diaspora + global English RSS/power-user niche (Feedly 14–15M registered is the reference population).
2. **Product-reachable:** users who will install a third-party news app (Pew: 21% of US adults *prefer* news websites/apps ≈ 55M US adults; DNR UK/AU equivalents) and either accept ads or pay $3–12/mo.
3. **Excluded:** China (regulatory), Korea/Japan super-app interiors, India vernacular (separate SAM; viable v2 expansion per 07).

| SAM component | Population / basis | Annual value |
|---|---|---|
| US news-app-preferring adults | 21% of ~260M adults ≈ 55M; × realistic ARPU mix (90% free-ad-supported ~$2–4/yr ad ARPU + 10% paying ~$8/mo) | **~$700M–1.1B/yr** |
| UK+CA+AU equivalents | ~40M news-app-preferrers combined; same mix | ~$400–600M/yr |
| English RSS/power-users worldwide | ~50M RSS users (vendor est.); 5–10% convert to a paid super-reader at $50–100/yr | ~$150–400M/yr |
| **SAM total** | | **~$1.2–2.1B/yr** |

### 3.3 SOM — 3-year obtainable (matches release strategy 07: MVP→V3 by end of year 3)

Bottom-up, deliberately conservative, benchmarked against observed comparables:

| Lever | Assumption (source-benchmarked) | Revenue |
|---|---|---|
| Paying subscribers | 25k–60k by month 36 (Ground News-scale trajectory: ~$3.1M revenue at ~18–30 staff after ~8 years is the pessimistic anchor; Particle-class AI apps have undisclosed but modest bases; 1440 hit 4.6M subs in ~7 yrs as a newsletter — apps convert slower) at **$4.99–8.33/mo** (positioned between Ground Pro $0.99 and Vantage $8.33) | $1.5M–6.0M ARR |
| Free-tier ad/affiliate revenue | 150k–400k MAU free tier × $1.5–4/yr ad+affiliate ARPU (news-app display $1–25 CPM open-web; in-feed brand CPMs not separately published — gap) | $0.2M–1.6M/yr |
| B2B/API (optional V3) | Provenance/bias data API for researchers + education (Ground Education via LibraryUp is the comparable) | $0–0.3M/yr |
| **SOM total (month 36 run-rate)** | | **≈ $2M–8M ARR** |

Sanity anchors: Gunosy does ¥6.44B (~$43M) with a Japan-only tab-app portfolio after a decade; Ground News ~$3.1M (low confidence) after 8 years; SmartNews took ~6 years to its first ~$100M-scale year. A $2–8M SOM by year 3 is aggressive-but-defensible for a quality-first brand; anything above $15M by year 3 would require a paid-acquisition engine that contradicts the craftsmanship brand positioning.

### 3.4 TOM — 10-year target

If the blue-ocean thesis (calm/provenance/ownership — see 03) becomes a recognized category the way "bias comparison" did for Ground News: **0.5–1.5% of the ~$8–15B TAM ≈ $40–150M/yr**, i.e., Feedly-Enterprise-scale ($1,600+/mo enterprise tiers, 14–15M registered users) or Gunosy-scale — the realistic ceiling for an independent that stays independent. The Artifact lesson caps the ambition: even a beloved product from Instagram's founders concluded "the market opportunity isn't big enough" for curation-only; the TOM must include a monetization moat (B2B data/API, licensing-grade provenance infrastructure), not just a better reader.

---

## 4. What Would Change These Numbers (Monitoring Triggers)

| Signal to watch | Where it changes this file's math | Cadence |
|---|---|---|
| DNR 2027 chatbot-news-use figure (>13% = Force 1 accelerating) | SAM shrinks as answer-engines absorb sessions | Annual (June) |
| SmartNews TSE filing/IPO outcome (Oct-2026 target lapsed as of 2026-09-23 — no filing, no approval, absent from TSE's approved cohort; watch for a 2027 timetable or formal withdrawal) | First public P&L of a pure aggregator — recalibrates TAM framing A directly | Event-driven |
| NYT v. OpenAI summary judgment | Licensing-grid costs for SOM; if fair use wins broadly, licensing gets cheaper; if publishers win, provenance-native aggregators gain moat | Event-driven |
| Apple News+ country expansion beyond US/UK/CA/AU (currently zero mainland-EU availability, per Apple support page 2026-09-15) | Would compress EU SAM | Event-driven |
| Google EU AI compensation framework post-DMA | Cost side of licensed summaries | Event-driven |
| Pew news-platform fact sheet refresh (21% apps-preference) | SAM population | Annual |
| Ground News subscriber disclosure (currently refused) | SOM pessimistic anchor | Event-driven |

---

## 5. Sources (load-bearing only)

1. Reuters Institute Digital News Report 2026 — executive summary + AI-chatbots chapter + Germany/France/Japan/Korea chapters. https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2026/dnr-executive-summary (2026-06-16)
2. Pew Research Center — News Platform Fact Sheet (Aug 2025 fieldwork). https://www.pewresearch.org/journalism/fact-sheet/news-platform-fact-sheet
3. IAB/PwC — US digital ad revenue FY2025 ($294.6B). https://www.iab.com/news/digital-ad-revenue-climbs-to-nearly-300b-as-iab-celebrates-30-year-anniversary/ (2026-04-16)
4. IAB Europe AdEx 2025 (€131B) via Digiday. https://digiday.com/media-buying/whats-really-driving-europes-e131-billion-ad-boom (2026)
5. Dentsu — Japan ad spend 2025 (¥4,045.9B) and global 2026 forecast ($1.06T). https://www.dentsu.co.jp/en/news/release/2026/0305-011006.html (2026-03-05); https://www.dentsu.com/news-releases/global-ad-spend-set-to-surpass-one-trillion-for-the-first-time-in-2026-... (2025-12)
6. Chartbeat via Axios — search referral declines (−60/−47/−22% by publisher size). https://www.axios.com/2026/03/17/chartbeat-search-traffic-ai-chatbots (2026-03-17)
7. European Commission — DMA fine on Google €890M. https://digital-markets-act.ec.europa.eu/commission-fines-google-eur890-million-breaches-digital-markets-act-2026-07-23_en (2026-07-23)
8. EPC — Article 102 complaint (2026-02-10) and readout of DMA decision. https://www.epceurope.eu/
9. Reuters — EU regulators quiz publishers on Google AI opt-out. https://www.reuters.com/legal/litigation/eu-antitrust-regulators-quiz-publishers-googles-ai-search-opt-out-2026-09-01 (2026-09-02)
10. Media Copilot — Digital Trends −97% Google clicks. https://mediacopilot.ai/google-ai-overviews-news-traffic (2026); SEJ/Kint −10% median; Ahrefs −58% CTR via TNW (2026-02); TNW zero-click ~60% (2026)
11. Company/market files: kitaishihon.com Gunosy FY3/2026 (2026-07); GetLatka SmartNews (2025); Datanyze Ground News (2026-09, low confidence); Entrackr VerSe FY25 (2025); LY Corp media guides (LINE NEWS 77M, 2025-12-20); Naver Ad Center AI Briefing 30M MUV (2026-06-15); Newsis Naver ~70% self-citation (2026-05-28); KPF survey via journalist.or.kr (2026).
12. Report mills as listed in §1.1 (all low confidence, kept for definitional documentation).
13. Comparables for SOM: StationX Ground News pricing review (2026-08-03); SmartNews Q3-2025 press deck (SmartNews+ 100k); 1440 PRNewswire (2026-01) + Adweek valuation (2026-06-03); Readless Feedly/Inoreader/NewsBlur comparison (2026); Feedly stats via Expanded Ramblings.
14. Apple — Media Services availability (News+ = US/UK/CA/AU only). https://support.apple.com/en-us/HT208435 (2026-09-15)
15. Bloomberg — SmartNews Oct-2026 TSE listing target (EN+JP editions, 2026-03-24/25; earliest attribution Toyo Keizai Shikiho 2025-07-25; status as of 2026-09-23: **target effectively lapsed** — no filing, no TSE approval, absent from the approved October-2026 cohort per JPX Google-indexed snapshots crawled 2026-09-18). https://www.bloomberg.com/news/articles/2026-03-25/japan-based-smartnews-is-said-to-eye-october-listing-in-tokyo · Toyo Keizai US-profit interview, COO Nin Gi (2026-06-16) · 21财经/QuestMobile Toutiao 2025Q2 MAU ~391M (2025-09-25) · Perplexity partner trajectory: Perplexity blog + Nieman Lab (2024-07-30), Perplexity blog + Reuters (2024-12-05), Digiday trade coverage (2026), Press Gazette on Comet Plus's 7 publishers / 80% of the $42.5M pool (2025).

*Conflicts carried, not averaged:* SmartNews revenue ($104.5M vs $163.8M tracker estimates vs ¥20–30B ad-revenue analyst range); Perplexity partner count (verified 6 → ~21 → ~20–30 trajectory vs the unverified single-tertiary "2,400+" claim and a conflicting "300+"); Ground News traffic (decomposed 2026-09-23: ~36% same-period Similarweb-vs-Semrush tracker spread + a real Semrush-series decline 5.13M→4.09M ≈ −20%/14mo — not a halving); mill sizings (§1.1); paying-for-news US (16% repoll vs 13% original). Toutiao figures resolved as eras (QuestMobile 2025Q2 MAU ~391M is the current best estimate; "DAU >200M" dropped as unsupported).

---

# ═══ FILE: 03-gap-analysis-blue-ocean.md ═══

# 03 — Gap Analysis: Pain Points, Complaints, Underserved Niches, and Blue-Ocean Opportunities

**Date:** 2026-09-23
**Scope:** demand-side pain (users), supply-side pain (publishers), product-complaint clusters per competitor, underserved niches/communities, and the blue-ocean spaces a new entrant can plausibly own. Evidence grades: 🔴 documented by multiple independent sources · 🟡 single-source or anecdotal · ⚪ inference from adjacent data (labeled as such).

---

## 1. Demand-Side Pain (The User's Problems)

### 1.1 The macro pains (all 🔴 — DNR 2026 + Pew + Gallup cross-corroborated)

| # | Pain | Evidence | Who feels it most | Who is failing to solve it |
|---|---|---|---|---|
| P1 | **News avoidance** — 42% sometimes/often avoid news (29% in 2017); interest in news down 13pp since 2021 (59%→46%) | DNR 2026 (48 markets) | Under-35s, women, Southern Europe (60%+ in BG/HR/GR/TR) | Everyone — the entire industry's demand problem |
| P2 | **Trust collapse** — 37% average trust (lowest since 2015); US 25%, France 29%; Gallup US mass-media trust 28% (new low) | DNR 2026; Gallup 2025 | Politically heterogeneous users everywhere | Aggregators rank *below* the publishers they aggregate (aggregators trusted 31% vs publishers 40% in DNR 2024 comparisons); bias-raters (Ground/AllSides) criticized for false equivalence |
| P3 | **Fake-news anxiety** — 62% worried about what's real online (+4pp YoY) | DNR 2026 | All demos; worst in low-trust markets | Nobody productizes verification for consumers; C2PA/NewsGuard remain B2B or invisible |
| P4 | **Overwhelm/doomscroll fatigue** — documented mental-health harms across 2023–2025 peer-reviewed literature; "calm news" language entering product marketing | Academic corpus (multiple studies); Nieman Lab 2025 trend pieces | Anxiety-prone users, caregivers, anyone post-2020 | Most feeds optimized for engagement = the *opposite*; only early movers (1440, Wisp, Particle, Slow News Co) |
| P5 | **Notification fatigue** — 43% of users have disabled news alerts | DNR 2026 (via notification chapter) | Everyone with a news app installed | SmartNews's #1 complaint cluster (below) — high-frequency breaking-alert spam |
| P6 | **AI-slop / unattributable answers** — 20% trust AI chatbot news (vs 37% news overall); 4% click through; users can't trace claims to sources | DNR 2026 AI chapter | Chatbot users (10% weekly, 16% U35) | Chatbots by design; aggregators haven't built the "traceable AI" counter-position |

### 1.2 Competitor-specific complaint clusters (from app-store reviews, Reddit, Trustpilot)

| Product | Complaint cluster | Evidence | Grade |
|---|---|---|---|
| **Apple News+** | Paying $12.99/mo and *still seeing ads* — magazine-style issues carry advertising; r/ios thread with 389 upvotes on this single theme | Reddit r/ios; MacRumors forums | 🔴 |
| | No RSS/newsletter ingestion; following is outlet-driven not topic-driven; poor search | Reddit megathreads | 🟡 |
| | Available in only 4 countries — mainland-EU iPhone users locked out entirely | Apple support page 2026-09-15 | 🔴 |
| **SmartNews** | "Uncontrolled ads" — interstitial/native ad load complaint cluster; **no ad-free paid tier offered** (SmartNews+ is Japan-only and paywall-content, not ad-removal) | Google Play reviews; Reddit r/smartnews | 🔴 |
| | Excessive notifications; personalization doesn't stick; US content mix degraded post-2023 retrenchment | App-store reviews; TechCrunch coverage of decline | 🔴 |
| | No RSS or newsletter ingestion | Reddit feature-request threads | 🟡 |
| **Google News** | Black-box personalization; Full Coverage useful but buried; no user-visible controls over ranking; "for you" mix includes low-quality sources | Reddit r/googlenews; HN threads | 🟡 |
| **Ground News** | Pricing fragmentation (web Vantage $99.99/yr vs app Pro $0.99/mo vs Premium $3.99/mo — different tiers, confusing); free tier limits (6 Blindspot stories/day); outlet-level bias labels too crude for article-level reality | StationX review; r/changemyview "Ground News has No Value"; r/AskALiberal threads | 🔴 |
| | Trustpilot 14% 1-star themes: overpriced, support, slow pages | Trustpilot distribution | 🔴 |
| | Methodology economics: uses AllSides/MBFC ratings without permission or compensation (per CJR) | CJR 2025-09-14 | 🔴 |
| **NewsBreak** | AI-generated erroneous stories (40+ documented since 2021, incl. a fictitious Christmas-Eve shooting), 10 fictitious bylines, broken AI-content toggle | Reuters Institute investigation (Toby McIntosh, 2024); Wired follow-ups | 🔴 |
| | Notification spam complaints | Play reviews | 🟡 |
| **Flipboard** | Stagnation perception; no meaningful product change since ~2020; 145M MAU figure unchanged since 2018 (staleness itself a signal) | Digiday citing stale figure; app reviews | 🟡 |
| **Feedly/Inoreader** (RSS incumbents) | Price walls for basic power features (Feedly Pro+ $12.99/mo); AI features bolted on, not core; privacy: ~80% of RSS readers investigated in 2025 phoned home with user data | Readless comparison 2026; RSS privacy investigation 2025 | 🔴 (pricing) / 🟡 (privacy stat) |
| **Yahoo/MSN** | Portal-era UX; low editorial quality mix; MSN's AI-editing incidents (2023-24) linger in reputation | press coverage | 🟡 |

### 1.3 The pattern across clusters (synthesis, ⚪ but grounded in the above)

Five recurring failure modes account for nearly every complaint:
1. **Ad-load punishment of engaged users** (Apple News+, SmartNews, NewsBreak) — monetization hostile to the heaviest users.
2. **Notification as engagement heroin** (SmartNews, NewsBreak) — alerts tuned for re-opening, not for user value; 43% responded by switching alerts off entirely.
3. **Opaque personalization** (Google News, SmartNews) — users cannot see, understand, or reset why they see what they see.
4. **Paywall ladders designed for confusion** (Ground News three-tier app/web split; Feedly feature ratchet) — pricing hostility toward the curious middle.
5. **Provenance invisible by design** (NewsBreak's AI stories; MSN AI edits; chatbot answers) — the single user need (is this real, who wrote it, why am I seeing it) has no consumer-grade answer.

---

## 2. Supply-Side Pain (The Publisher's Problems — relevant because aggregators live or die on publisher tolerance)

| # | Pain | Evidence | Implication for an aggregator entrant |
|---|---|---|---|
| S1 | Referral starvation: Google search traffic −33% global / −38% US (Nov 2024–Nov 2025); small publishers −60%; Digital Trends −97% post-AI-Overviews | Chartbeat via Axios 2026-03-17; Media Copilot | Publishers are desperate for **sending traffic**, not just exposure — an aggregator that credits and links out is now structurally attractive in a way it wasn't in 2020 |
| S2 | Ad-revenue concentration: platforms capture the majority of news-adjacent digital ad value | INMA/eMarketer structural reporting | Revenue-share or affiliate economics can be pitched as solidarity positioning |
| S3 | Licensing chaos: OpenAI deals range >$250M/5yr (News Corp) to ~$10M/yr (Axel Springer per Nieman estimate) with no public grid; Perplexity's $42.5M rev-share program covers 2,400+ partners (single tertiary source) | NYT, Semafor, Nieman, PRNewswire | A transparent, published licensing/rev-share schedule would be *newsworthy* differentiation |
| S4 | News deserts: 213 US counties with no local news outlet, 1,524 single-source counties, ~50M Americans underserved; ~136 closures/yr | Medill State of Local News 2025 | Local aggregation = underserved AND mission-legible |
| S5 | AI-scraping without consent is the publishers' #1 grievance (EPC Art. 102 complaint; EC investigation; Google opt-out rollout completed 2026-08-31) | EPC; Reuters | An opt-in-first, robots-respecting, provenance-forward crawler is cheap compliance and good politics |

---

## 3. Underserved Niches and Communities (ranked by evidence strength)

### Tier 1 — strong, multi-source evidence of underservice

**3.1 Local-news deserts (US)**
- Medill 2025: 213 desert counties (up from 208), 1,524 single-source counties, ~50M Americans in news-poor areas; ~1,300+ papers lost 2005–2024 with ~136 closures/yr.
- Existing attempts: NewsBreak claims local focus (but AI-quality scandal), Apple News local channels limited to ~400 metro areas (Apple marketing), Ground News has no local product.
- **Gap:** no quality-first, human-checkable local aggregator with state/county-level topic control, C2PA-verified local sources, and a "what actually changed in my county this week" digest format.

**3.2 Spanish-language US users**
- 71.5M Hispanics in US (2024 Census); ~87% of Hispanic adults get news digitally; 74% use search for news; Spanish-dominant users rely on WhatsApp forwards and Latin-American outlets.
- **Gap:** no dominant Spanish-language US aggregator combining US-local + Latin-American sources with cross-border story clustering. (⚪ inference: the absence is documented, demand-side numbers exist, product attempts are invisible.)

**3.3 The RSS/power-reader diaspora**
- Pocket died 2025-07-08 (Mozilla shutdown), expelling its user base; Feedly at 14–15M registered with Pro+ at $12.99/mo; Inoreader free tier capped at 150 feeds; NewsBlur alive but visually dated; NetNewsWire Mac-only-credible; Flipboard Surf (RSS + AT Protocol + ActivityPub, Dec 2024) is the only BigCo attempt and is buried inside Flipboard.
- HN threads on Pocket's death show a articulate, paying, underserved cohort explicitly asking for: open formats, export, privacy, no AI-slop, one-time or low pricing.
- ~80% of RSS readers phoned home with user data (2025 investigation) — privacy positioning is *open* in this niche.
- **Gap:** a modern, privacy-first, multi-protocol (RSS/Atom/JSON Feed/ActivityPub/Bluesky feeds/newsletters-in) reader with OPTIONAL AI clustering — the "own your feed" product.

### Tier 2 — solid single-cluster evidence

**3.4 Older adults (65+)**
- 79% of 50+ get news via web browsing (AARP/National Poll on Healthy Aging); app roundups never target seniors; UI accessibility (text sizing, contrast, single-column) is not a priority anywhere in the category.
- Demographic logic: aging US/EU/Japan populations; highest news loyalty; lowest churn; ad-blind but subscription-receptive (⚪ product inference, demand data solid).

**3.5 "Calm news" seekers / recovering doomscrollers**
- DNR avoidance 42%; peer-reviewed doomscrolling harms; category language ("calm", "slow", "mindful") already circulating: Wisp (session-capped), 1440 (4.6M subs, 65%+ open rate as a *newsletter*), Slow News Co, Particle's positioning.
- **Gap:** no *app* has made calm the organizing principle (bounded sessions, end-of-feed, event-based rather than stream-based, weekly review mode). The newsletter format won on this so far; an app could own the mobile side.

**3.6 Diaspora / bilingual readers**
- DNR documents multi-country news repertoires for diaspora communities; Korean/Japanese/Indian diaspora in US read home-country + US sources; machine translation now makes cross-language clustering trivial (SmartNews added ES/ZH in-app translation July 2026 — validating the demand).
- **Gap:** no first-class bilingual story-clustering product for, e.g., Indian diaspora (EN+HI/Tamil/Telugu), Korean-American (EN+KO), Turkish-German (DE+TR).

### Tier 3 — plausible, weaker evidence (flagged as such)

**3.7 Accessibility-first news (screen-reader/native VoiceOver excellence)** — no aggregator markets accessibility; unmeasured demand (⚪).
**3.8 Newsletter-power users** — beehiiv's 255M+ readers / Substack's ~50M active subscriptions show newsletter consumption is huge, but no app treats newsletters as a first-class ingest format alongside RSS (Readwise Reader is adjacent but reading-focused, $9.99/mo) (🟡).
**3.9 Researchers/analysts/journalists as consumer-pro users** — Ground's Vantage tier gestures at this (ownership data, bias dashboards) but is US-politics-only; a global version with source-tracking exports is open (🟡).
**3.10 Classroom/civic-education use** — Ground Education via LibraryUp exists (schools get Pro free); no one has built the civic-ed product properly (🟡).

---

## 4. Blue-Ocean Opportunities (with justification)

A "blue ocean" here = a value proposition where current competitors' business models *prevent* them from following, not merely a feature they forgot. Ranked by defensibility.

### BO1 — "Verifiable news": provenance-native aggregation
**The offer:** every cluster, summary, and recommendation carries visible provenance — source list, original-language links, C2PA content-credential passthrough, correction-tracking per outlet, and an "why am I seeing this" panel that shows the ranking inputs in plain language.
**Why it's blue:** the incumbents' monetization depends on engagement opacity (Google) or ad load (SmartNews/NewsBreak); NewsBreak's AI-scandal and the chatbots' 4% click-through created consumer hunger for traceability; C2PA adoption exists among *publishers* (Reuters, AP, Bloomberg) but **no aggregator has joined** (C2PA adopter lists checked 2026-09). EU AI Act Art. 50 (in force 2026-08-02) makes transparency a compliance asset in Europe. Ground News's provenance-adjacent play (bias ratings) is US-politics-only and built on contested third-party ratings.
**Kill risk:** provenance is copyable in feature terms (the moat is the *brand promise*, like "DuckDuckGo = privacy").

### BO2 — "Own your feed": local-first, privacy-first, export-everything reader
**The offer:** the anti-cloud app — local storage, user-owned OPML/JSON export of everything, optional account, no tracking pixels proxied, feeds not ads. Multi-protocol ingest: RSS/Atom/JSON Feed, newsletters via dedicated address, ActivityPub/Bluesky custom feeds, YouTube channels, podcasts.
**Why it's blue:** Feedly/Inoreader need SaaS revenue → cloud lock-in; Google needs surveillance; the Pocket shutdown (2025) + RSS privacy scandal (~80% phoned home) created a documented trust vacuum; Flipboard Surf validates protocol openness but inside an ad-funded shell. A $0-data-leaving architecture is *structural* differentiation for the power-reader niche (Tier 1 above).
**Kill risk:** niche size — RSS market ~$300M/yr (low-confidence vendor figure). This is a wedge, not the whole company; must ladder into BO1/BO4.

### BO3 — "Local first": county-level news service for the 50M underserved
**The offer:** US counties as first-class objects — follow your county, get a verified weekly digest + breaking alerts only when verified; C2PA-verified local sources; volunteer-correspondent program with editorial review (patch the desert, don't just link it).
**Why it's blue:** NewsBreak poisoned the local-AI well (fictitious stories); Apple's local channels are metro-only and static; Medill documents 50M underserved Americans; mission-legibility attracts press, grants (Press Forward's $500M+ philanthropic local-news pool — 🟡 size figure), and civic partnerships. No ad-load conflict: subscription/civic sponsorship monetization.
**Kill risk:** unit economics per county; content acquisition cost; verification labor. Start with the 1,524 single-source counties (there IS a source to aggregate; product starts as aggregation, not original reporting).

### BO4 — "Calm by design": the bounded news app
**The offer:** event-based clusters (not streams), a hard stop ("You're caught up"), daily/weekly review modes, no infinite scroll, notification budget the *user* sets (default 2/day), a morning-brief ritual format.
**Why it's blue:** every ad-funded incumbent's revenue = attention time, so they cannot ship "you're caught up, go live your life" without cutting their own throats. 42% avoidance + doomscrolling literature + 1440's 4.6M-sub success in *newsletter* form proves demand; the mobile-app version is unowned. Pairs naturally with BO1 (calm + verifiable) as a single brand.
**Kill risk:** calm users generate fewer ad impressions — subscription-first is mandatory; churn risk if "calm" reads as "thin" (must be dense, not sparse: the anti-Twitter density play).

### BO5 — Bilingual diaspora clustering (EN + one heritage language per market)
**The offer:** story clusters that span languages — the same event's EN/KO coverage side-by-side, machine-translated, provenance kept, bias/rating data where available.
**Why it's blue:** SmartNews validated translation demand (Jul 2026 ES/ZH); nobody does *cross-language clustering* as identity; diaspora communities are large, affluent, digitally native, and currently juggle 2–3 apps. 🟡 evidence tier but low build cost on top of BO1 infrastructure.

### Anti-portfolios (looked at, rejected — documented for honesty)
- **Bias-comparison (Ground's lane):** contested methodology, US-only frame, CJR-documented licensing ethics problem; a second mover inherits the criticism without the YouTube-sponsor growth engine.
- **General AI summaries (Artifact lane):** "market opportunity isn't big enough" — the founders' own autopsy; chatbots at 4% click-through commoditize summarization faster than an app can defend it.
- **Social/viral news (TikTok-clone):** capital-intensive, trust-destructive, and the one thing the platforms themselves will always do better.

---

## 5. Complaint-to-Feature Translation Matrix (what the new app must NOT do)

| Documented failure (§1) | Design law for the new product |
|---|---|
| Ads despite payment (Apple News+) | Paid tier = zero ads, ever; no "sponsored content" in paid surfaces |
| No ad-free option at all (SmartNews) | Ad-free available from day one at accessible price |
| Notification spam (SmartNews, NewsBreak; 43% disable) | User-set notification budget (default 2/day); alerts only for verified, user-elected topics |
| Opaque ranking (Google News) | "Why this story" panel: ranked-by inputs shown; reset-able interest model |
| Confusing tier ladders (Ground) | Two tiers max, one price each, feature table published |
| AI slop / fictitious stories (NewsBreak) | No publish-without-human-check pipeline for local/breaking; AI used for clustering/translation with visible provenance, never for bylined claims |
| Lock-in (Feedly/Pocket death) | Full export (OPML + JSON) always; local-first storage; documented shutdown plan |
| Privacy leakage (~80% of RSS readers) | No third-party pixels proxied; zero-telemetry option; publish a data-map |
| Doomscroll design | Session boundary UI; "caught up" state; evening wind-down default |

---

## 6. Sources (load-bearing)

1. Reuters Institute Digital News Report 2026 — avoidance/trust/AI chapters. https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2026/dnr-executive-summary (2026-06-16)
2. Gallup — trust in mass media 28%. https://news.gallup.com/poll/651977/americans-trust-media-remains-trend-low.aspx (2025)
3. Pew Research Center — News Platform Fact Sheet. https://www.pewresearch.org/journalism/fact-sheet/news-platform-fact-sheet (2025 fieldwork)
4. CJR — "The business of balance: Ground News…" https://www.cjr.org/analysis/the-business-of-balance-ground-news.php (2025-09-14)
5. Reuters Institute / Toby McIntosh — NewsBreak AI errors investigation. https://reutersinstitute.politics.ox.ac.uk/news-ai-machine-generated-falsehoods-newsbreak (2024)
6. Medill Local News Initiative — State of Local News 2025 (213 desert counties, 1,524 single-source, ~50M underserved). https://localnewsinitiative.northwestern.edu/ (2025)
7. Chartbeat via Axios — referral declines. https://www.axios.com/2026/03/17/chartbeat-search-traffic-ai-chatbots (2026-03-17)
8. Mozilla — Pocket shutdown FAQ. https://support.mozilla.org/en-US/kb/pocket-shutdown-faq (2025); Readless — RSS reader comparison + privacy investigation recap. https://readless.io/blog/feedly-vs-inoreader-vs-newsblur (2026)
9. StationX — Ground News pricing review (tier fragmentation). https://app.stationx.net/articles/ground-news-review (2026-08-03)
10. SmartNews newsroom (SmartNews+ Japan-only; translation features). https://about.smartnews.com/en/news (2025–2026); app-store/Reddit complaint threads as cited in scratch notes.
11. Apple — News+ availability (4 countries). https://support.apple.com/en-us/HT208435 (2026-09-15)
12. Nieman Lab — "throwaway news apps" trend piece (Dec 2025); Digiday — Flipboard 145M figure staleness.
13. EPC — Article 102 complaint (2026-02-10). https://www.epceurope.eu/
14. C2PA — adopter lists (aggregators absent, checked 2026-09). https://c2pa.org/
15. 1440 Media — subscriber/valuation reporting via Adweek (2026-06-03) and PRNewswire (2026-01).

---

# ═══ FILE: 04-swot-mentor.md ═══

# 04 — SWOT Analysis: A Mentor's Briefing for a Founder Entering News Aggregation

**Date:** 2026-09-23
**Voice:** written as I'd deliver it to a founder I'm backing — direct, opinionated where warranted, every claim sourced in the other files. The SWOT object is *your venture* (an independent, quality-first news-aggregation startup entering in late 2026), not the industry in the abstract. Cross-references: 02 (market/forecast), 03 (gaps/blue ocean), 05 (concept), 07 (release strategy).

---

## The Position You're Walking Into

Read the room first. You're entering a category where (a) social platforms just became the #1 news source for the first time ever (54%, DNR 2026), (b) trust is at a decade low (37%; US 25%), (c) the best-funded AI-native entrant of the last cycle concluded "the market opportunity isn't big enough" and shut down (Artifact, Jan 2024), and (d) the largest pure-play aggregator is about to IPO *below* its 2021 valuation (SmartNews, ~$1.3–1.4B secondary marks vs $2B peak). Anyone who tells you this is a growth category hasn't read the data. Anyone who tells you it's dead should explain why 1440 hit a $101M valuation on a newsletter in the same market, and why the failure mode of every incumbent is *self-inflicted* (ads, spam, slop, lock-in) rather than demand exhaustion. The demand didn't die; the products abused it. That's your opening.

---

## S — Strengths (what a small, independent, quality-first entrant actually has)

| # | Strength | Why it's real (evidence) | How to weaponize it |
|---|---|---|---|
| S1 | **No legacy revenue to protect** | Every incumbent's worst features are monetization artifacts: Apple News+ shows ads to paying subscribers (389-upvote r/ios thread); SmartNews has no ad-free tier; Google can't show its ranking inputs; NewsBreak's AI slop was a cost decision | Ship the design laws in 03 §5 — "paid = zero ads, ever", "notification budget you set", "why this story" panel. These are *impossible* for incumbents, not merely forgotten |
| S2 | **Craftsmanship brand fits the moment** | Trust 37% record low; avoidance 42%; users explicitly hungry for calm/verifiable alternatives (1440's 4.6M subs; calm-news category forming) | Quality-first, anti-engagement-hacking positioning is credible from a new brand and preposterous from Google/SmartNews — asymmetric marketing |
| S3 | **The tooling cost collapsed** | Cloudflare Workers+D1+R2 at $5/mo with zero egress; push (FCM/APNs) free; open-weights summarization at ~$0.0004/article (Together/Groq); total fixed infra <$10/mo at MVP scale (10-deployment-plans) | A category that took SmartNews $410–479M of capital to enter in 2013–2021 is enterable at 4–5 orders of magnitude less in 2026. Your burn is a rounding error; theirs isn't |
| S4 | **Publishers are desperate for allies** | Search referrals −33% to −38% (Chartbeat); small pubs −60%; Digital Trends −97%; publishers expect −43% more by ~2028 | An aggregator that credits visibly, links out, respects opt-outs (post-2026-08-31 Google opt-out norms), and publishes a licensing schedule gets publisher goodwill the platforms burned — early exclusive partnerships are gettable at good-will prices |
| S5 | **Regulation tailwind in the EU** | DMA fine €890M (2026-07-23); EPC Art. 102 complaint; AI Act Art. 50 transparency in force 2026-08-02 | Build provenance-first from day one and the compliance work competitors fear becomes your marketing. EU = beachhead where the legal environment punishes your biggest would-be competitors |
| S6 | **Founder is a full-stack dev + DevSecOps engineer** | (User profile — this is you) | Self-hosted local-first architecture (BO2 in 03) is a *build* advantage others would need to hire for; security posture (zero-telemetry, data-map) is native to you, performative for others |

---

## W — Weaknesses (yours, be honest about them)

| # | Weakness | Evidence it will bite | Mitigation |
|---|---|---|---|
| W1 | **Zero brand, zero trust inventory** | Trust is the product you're selling and you start with none; 37% is the *incumbents'* number — yours starts lower | Borrowed credibility: C2PA membership, publisher partnerships with visible logos, open methodology docs, third-party audits. Publish your data-map before launch |
| W2 | **Cold-start content and curation** | Ground News processes 60k articles/day from 50k sources; SmartNews 400k/day in Japan — you start at zero sources, zero clustering history, zero ratings data | Don't compete on breadth initially: county/topic-vertical depth (BO3) or protocol ingestion (BO2) where your curation is *human-checked* and incumbents' isn't |
| W3 | **Solo/small-team verification labor** | The calm/provenance promise is labor-backed (human-check before publish); NewsBreak's failure was precisely under-investing here | Constrain the surface: bounded topics, weekly-digest cadence — quality at low volume beats slop at scale; grow curation headcount only with revenue (07 gates this) |
| W4 | **No growth engine** | Ground News bought awareness with 1,863 YouTube integrations (most-sponsored brand, 664M views); you have no such budget | Community-first GTM (06): HN/Reddit/RSSI communities, the Pocket-diaspora, local-news Twitter; partnership/press around the mission angle. Slow by design — but see T4 |
| W5 | **Subscription-only ceiling in a 17%-payer market** | 10–20% paying appears to be the ceiling in most markets (DNR); churn ~4–5.8%/mo; free alternatives cited by 36% of churners | Price accessibly ($4.99–8.33 band), annual-first, group/education tiers; keep B2B option (provenance API) alive from V2 (02 §3.3) |
| W6 | **Single-region cloud/ops risk appetite** | Solo DevSecOps on a cPanel VPS + edge workers — bus factor 1 | Boring, documented, IaC-everything deployment (09/10); staged SLAs only when revenue justifies team |
| W7 | **Category fatigue among press and users** | "Throwaway news apps" (Nieman, Dec 2025); AI-app churn culture | Position as *infrastructure* ("the news layer you own"), not another AI news app; durability signals (export-everything, published shutdown plan) |

---

## O — Opportunities (the openings, ranked)

| # | Opportunity | Size/shape (evidence) | Why you and not them |
|---|---|---|---|
| O1 | **Provenance-native aggregation (BO1)** | AI-chatbot trust 20%, click-through 4% — traceability hunger is documented; no aggregator in C2PA (adopters checked 2026-09); EU Art. 50 makes it compliance | Incumbents' opacity is load-bearing for their ad/engagement models |
| O2 | **Pocket's abandoned RSS/power cohort (BO2)** | Pocket shutdown 2025-07-08; ~80% of RSS readers phoned home (2025 investigation); Feedly Pro+ at $12.99/mo leaves a price/ethics gap | Cloud SaaS can't do local-first; Google won't do no-tracking |
| O3 | **Local news deserts (BO3)** | 213 desert counties, 1,524 single-source, ~50M underserved Americans (Medill 2025); Press Forward's philanthropic pool | NewsBreak torched its local-AI credibility; Apple local is metro-static; mission-legibility earns free press |
| O4 | **Calm-news app category formation (BO4)** | 42% avoidance; doomscroll harm literature; 1440 proved the newsletter version at 4.6M subs; no app owns the mobile version | Ad-funded players structurally cannot ship "you're caught up" |
| O5 | **Bilingual diaspora clustering (BO5)** | SmartNews validated translation demand (Jul 2026 ES/ZH); diaspora juggle 2–3 apps (DNR repertoire data) | Cheap on O1's infrastructure; nobody does cross-language clusters as identity |
| O6 | **Licensing-grid vacuum** | OpenAI deals span $10M–$50M+/yr with zero public structure; Perplexity's $42.5M program is the only systematic one (single source) | A published, principled rev-share/terms schedule is press coverage *and* supply security |
| O7 | **Apple's EU absence** | News+ exists in exactly 4 countries, none in mainland EU (Apple support page 2026-09-15) | EU iPhone users have no premium-bundle news surface; EU-first launch exploits the gap |
| O8 | **Cheap AI plumbing** | Open-weights summarization ~$0.0004/article; Gemini Flash-Lite $0.30/$2.50 per 1M; vector search < $1/mo at MVP (Cloudflare Vectorize) | Let AI do clustering/translation (with provenance) while *humans* do verification — the exact division NewsBreak got backwards |

---

## T — Threats (what can kill you, ordered by likelihood × impact)

| # | Threat | Likelihood | Impact | Evidence | Survival move |
|---|---|---|---|---|---|
| T1 | **Platform AI absorbs the whole job** — Google/chats answer "what happened" with zero install | High | Existential if your core value is summaries | Chatbot news use 10%→? ; zero-click ~60% post-I/O 2026; 4% click-through starves your publisher-value story too | Don't sell *summaries*; sell **ownership, verification, calm, community** — things an answer engine structurally isn't. 05's concept is built on this line |
| T2 | **Attention economics simply win** — the category's demand migrates to social/creators faster than quality products can recruit it | Medium-high | Severe | Social 54% and rising; 52% of 18–24s; creator news 27% | Target 30+ / power-readers first (they still prefer apps, Pew 21%); meet youth via protocol-native surfaces (Bluesky/ActivityPub feeds), not another feed app |
| T3 | **Publisher licensing turns hostile or expensive** | Medium | High | EPC posture hardening; Google opt-out regime; NYT v. OpenAI could set an expensive precedent | Opt-in-first crawling, respect machine-readable prefs from day 1 (S4 is your armor); keep direct deals cheap and goodwill-based while small |
| T4 | **Discovery chokepoints** — app-store featuring is bought, search is dying, you have no growth budget | High (certain, ongoing) | Moderate | Ground News's YouTube-sponsor engine cost real money for years | Community GTM + mission press + partnership distribution (06); treat SEO as dead on arrival; measure CAC honestly by channel |
| T5 | **A well-funded fast-follower** copies the provenance/calm positioning | Medium | Medium | Playbooks are visible; Particle has $15.3M and similar instincts; Flipboard Surf has protocol reach | Speed on trust inventory: audits, C2PA seat, publisher logos, methodology docs — brand equity that doesn't copy |
| T6 | **Regulatory whiplash** — AI Act interpretation shifts, DMA remedies reshape Google referrals unpredictably | Low-medium | Medium | Art. 50 guidelines adopted 2026-07-20; Digital Omnibus deferrals to 2026-12-02 | Compliance-forward posture (O5/S5) means tail risk mostly hits competitors |
| T7 | **You** — solo-founder burnout, verification labor scaling with success, cPanel-era ops debt | Medium | High | W3/W6 | 07's release gates tie scope to revenue; automation-first ops (09); the deployment stages in 10 keep infra boring |
| T8 | **Apple/Google platform policy shifts** (tracking bans, review rejections, default placement) | Low-medium | Medium | Historical precedent (Pocket's Mozilla death shows platform dependency cuts both ways) | Local-first + web-first + export-first reduces any single gatekeeper's leverage |

---

## The Mentor's Synthesis (read this part twice)

1. **You are not entering the news business; you're entering the trust-and-attention-repair business.** Every number in 02 says raw attention is being consumed by social/AI; every complaint cluster in 03 says the remaining news-app demand is being *punished* by its suppliers. The viable independent position is small-but-beloved: 25–60k paying users at $5–8/mo (SOM in 02 §3.3) — Ground-News-scale economics with none of their methodology baggage.

2. **Sequence the blue oceans: BO2 → BO1 → BO4 → BO3.** Start where acquisition is free (the RSS/Pocket diaspora congregates in public: HN, r/rss, r/selfhosted); let their OPML import be your onboarding; build provenance infrastructure for them (they're the auditors); launch calm UX as the mass-market expression of the same engine; expand to local (county) once curation labor can be funded. Do not start with local — the verification labor kills solo founders (W3).

3. **Spend your non-existent marketing budget on receipts.** Audits, published data-maps, C2PA, open methodology, published licensing terms. In a 37%-trust market, *verifiable claims about yourself* are the cheapest user acquisition there is.

4. **Have the Artifact talk with yourself now.** Write down, in advance, what "the market opportunity isn't big enough" would look like for you at month 18 (e.g., <8k paying subs despite two press cycles and a Product-of-the-Day), and what you'd do: pivot the engine to B2B provenance infrastructure, sell, or persist. Pre-decide. Founders who don't pre-decide rationalize instead.

5. **The endgame moat isn't the app; it's the provenance dataset.** Every cluster you verify, every correction you track, every source you rate compounds into an asset (TOM in 02 §3.4) that chatbots will eventually need licensed. Build everything — schemas, exports, audits — as if that dataset is the product and the app is the demo.

---

*Cross-file references:* market math and TAM/SAM/SOM/TOM in 02; complaint evidence and blue-ocean justifications in 03; the concrete product shaped by this SWOT in 05; GTM and monetization trade-offs in 06; the quality-gated release ladder in 07; architecture in 09; deployment stages in 10.

---

# ═══ FILE: 05-new-app-concept.md ═══

# 05 — New App Concept: "PLUMB" — The Verifiable News Instrument

**Date:** 2026-09-23
**Inputs:** gap analysis (03), SWOT mentorship (04), market sizing (02). This file is the product brief: name, feature set, UVP, ICP, early-adopter hunting grounds, and the landing-page concept with five hero-section variants + the philosophy behind each.

---

## 1. The Concept in One Paragraph

A **provenance-native, calm-by-design news aggregator** that the user *owns*: multi-protocol ingest (RSS/Atom/JSON Feed/newsletters/ActivityPub/Bluesky), AI-assisted clustering and translation with human-checkable source chains, a hard-stop reading experience ("You're caught up"), a user-set notification budget, local-first storage with permanent export, and zero behavioral tracking. It monetizes with two honest tiers (free with no ad-tech; Pro at $4.99/mo) plus, later, a B2B provenance-data API. It is positioned not as "another news app" but as an *instrument* — the plumb line of the feed economy: the tool that tells you what's true-vertical in your news day. Brand identity = quality craftsmanship: boring reliability, visible joinery, no dark patterns, published methodologies, shutdown plan on day one.

**Name decision (working title Plumb; alternates with reasoning):**

| Candidate | Read | Risk |
|---|---|---|
| **Plumb** (working title) | A plumb line is the craftsman's instrument for true vertical; short, tool-like, artisanal | Domain collision risk (plumb.com taken; plumb.app / plumbline.app likely available — verify at build time) |
| Slackwater | The calm eddy in a fast river — where sediment settles | "Slack" collision; precious |
| Second Source | Journalism's two-source rule made into a product name | Generic-phrase SEO weakness |
| Corrob | Corroboration, truncated like a tool | Sounds like a fintech |
| Masthead | Publishing heritage | Crowded namespace (multiple existing products) |

**Panel verdict (2026-09-23, Q2):** keep Plumb — single Latin-script wordmark globally, no per-market forking, no rename; localize the metaphor's *story layer*, not the name. DE at EU entry: **das Lot / die Wasserwaage** + Handwerk framing (das Lot fällen is a living idiom for strict measurement; Hero B becomes *Alles gelesen.*). JP deferred until a distribution partner exists: **墨壺** (sumitsubo, the carpenter's ink-line pot — epistemically identical to the plumb line: a string-based truth instrument that cannot flatter you) + **継手** (tsugite joinery); never the literal 下げ振り (sagefuri, a cold surveyor's term); category frame transposes to 「ニュースアプリではなく、道具。」. Logo glyph = one line under tension, readable as plumb line (EN/DE) and ink-line (JP). Secure plumb.app AND plumbline.app at build time; trademark knockout in classes 9/42 before public launch; own the category phrase "the news instrument." All four alternates rejected on brand grounds.

---

## 2. Full Feature Set (v1 spec — everything below is buildable on the 09 architecture)

### 2.1 Ingestion — "everything you read, in one place"

| Feature | Detail | Priority |
|---|---|---|
| RSS 2.0 / Atom / JSON Feed | Full-text when offered; conditional-GET polling (304-aware); per-feed cadence user-settable 15min–daily (free tier defaults to learned per-feed publish-rate cadence, 1–12h; 15-minute priority sync is a Pro feature) | MVP |
| Newsletter ingestion | Unique per-user email address (`you@in.plumb.app`); HTML→clean text; sender auto-becomes a feed | V1 |
| Bluesky custom feeds + lists | AT Protocol firehose subscription for followed feeds/lists (the mechanic DNR-era power users adopted; Flipboard Surf validated) | V1 |
| ActivityPub (Mastodon etc.) | Follow any account or hashtag as a feed | V2 |
| YouTube channels / podcasts | Media-rss + episode listing inline, playable, offline | V2 |
| Reddit communities / HN | As feeds with comment-count metadata | V1 |
| OPML/JSON import | One-click from Feedly/Inoreader/Pocket export (Pocket died 2025-07-08 — its refugees are the wedge cohort); auto-detect duplicates | MVP |
| Web-page watcher | CSS-selector page watch (Calendly-style change detection) for sites without feeds | V2 |
| Publisher opt-in posture | robots.txt + machine-readable AI-prefs respected; opt-in list for licensed summarization; visible "how we crawl" doc | MVP (policy, not just code) |

### 2.2 The core reading experience — "calm by design"

| Feature | Detail | Priority |
|---|---|---|
| Event clusters, not streams | NLP clustering (open-weights embeddings) groups coverage; one card per event, expandable to all sources | MVP |
| "You're caught up" | Hard stop at end of unread; no infinite scroll; optional "read older" is a deliberate click | MVP |
| Session budget | Optional daily cap (default: none, suggestion UI at 20 min); evening wind-down theme after 21:00 local | V1 |
| Today / This Week review | Two temporal surfaces: a 90-second morning brief and a Sunday weekly review (the 1440-validated digest format as an app) | MVP (Today), V1 (Weekly) |
| Chronological toggle | "Just the list, newest first" — always available; algorithmic order is never mandatory | MVP |
| Reading view | Typography-first (variable font, 4 presets), AMOLED mode, no sticky bars | MVP |
| Save/read-later | Local-first with sync optional; offline packs | V1 |
| Full-text search | Client-side index (local-first); server-side for Pro — **reconciliation flag (panel):** server-side user data = ciphertext + billing only (09 §4), so saved searches and any server-side search index live inside the CRDT ciphertext, or the feature redefines its data handling before V1 | V1 |
| Keyboard-first | j/k, o, s, ? — the power-reader contract | MVP |

### 2.3 Provenance — the differentiator ("the joinery is visible")

| Feature | Detail | Priority |
|---|---|---|
| Source chain per cluster | Every event card lists: all covering outlets, original-language links, first-reporter, wire dependency (AP/Reuters/AFP markers) | MVP |
| "Why am I seeing this" | Plain-language panel: which of your feeds/interests matched; one-click "less like this" (works, locally) | MVP |
| C2PA passthrough + signing | Verify publisher content credentials where present; sign our own summary cards with c2pa-js so shares carry credentials | V1 (membership applied for) |
| Correction tracker | Per-outlet record of corrections/retractions on covered stories (public page: "Our sources' correction history") | V1, public V2 |
| Ownership & funding panel | Who owns this outlet (GDELT/OpenSecrets-style public data); flags state/political affiliation — *global*, not US-only (answers Ground's US-parochialism) | V2 |
| Bias done honestly | No single "bias score"; show multiple raters side-by-side when they exist + link methodologies; rate *coverage of this event*, not just outlet | V2 (methodology published first) |
| Translation layer | Per-article machine translation with original-language provenance preserved and linked (SmartNews validated demand Jul 2026) | V1 |
| AI disclosure standard | Every AI-touched element (cluster title, translation, brief) labeled with model + prompt-version; a public AI-use register | MVP (register) / V1 (per-element labels) |

### 2.4 Ownership, privacy, trust infrastructure

| Feature | Detail | Priority |
|---|---|---|
| Local-first storage | On-device database (SQLite/CRDT); account optional; multi-device sync via end-to-end-encrypted relay (server sees ciphertext) — **panel verdict: sync stays at V1.** Add a build-week-2 E2E key-management/recovery spike alongside the Automerge-vs-Yjs spike, with a pre-decided recovery-key fallback. Named degraded-but-honest variant: **Cloud-Bundle Sync** — client-encrypted Automerge bundles exchanged via the user's own cloud drive (iCloud/Dropbox) or manual file handoff; if the relay is not G0-grade at the V1 gate, GA ships with Cloud-Bundle Sync and relay GA re-gates to a bounded 90-day post-V1 milestone. V1 scope cut order is pre-decided: sync is the last feature cut. No plaintext-to-server sync variant at any version | V1 (local MVP, sync V1) |
| Export everything, always | OPML + full JSON (feeds, reads, saves, annotations); no support ticket, one button | MVP |
| Zero behavioral tracking | No third-party pixels proxied through reader; telemetry = optional, local, shown before any send; publish the data-map | MVP |
| Shutdown plan | Public, binding: 90-day notice, full export, escrowed source release for client | MVP (it's a document) |
| Published methodology | Clustering, ranking inputs, translation stack, crawler behavior — all public docs, version-controlled | MVP |
| Security posture | (DevSecOps founder) CSP + SBOM + signed releases + public threat model; bug bounty from V1 | MVP posture, bounty V1 |

### 2.5 Notifications — "a budget, not a firehose"

| Feature | Detail | Priority |
|---|---|---|
| Notification budget | User sets max/day (default **2**); budget display in settings; "spend" preview before enabling a topic | MVP |
| Verified-only breaking | Breaking alerts fire only on multi-source corroboration (≥3 outlets or 1 wire) — the anti-NewsBreak rule | MVP |
| Topic-gated alerts | Alerts per followed topic, never per outlet | MVP |
| Digest windows | Morning brief push at user-chosen time; nothing else between | MVP |

### 2.6 Monetization surfaces (detailed trade-offs in 06)

| Tier | Price | What's in |
|---|---|---|
| Free | $0 | Unlimited feeds (yes, unlimited — the Inoreader 150-feed cap is a documented resentment), clustering, 1 sync device, Today brief |
| **Pro** | $4.99/mo or $39/yr (annual-first) | E2E sync, unlimited devices, weekly review builder, translation, correction tracker, saved searches, web app, API token |
| Team/Edu (V2+, restructured per §8.2) | Education: **free for classrooms** (capped pilot program) · Newsrooms/teams: **~$999/yr annual-only site license** (≤25 seats ≈ $3.33/user/mo; per-seat only at $4/user/mo with a 25-seat floor; no billed account under ~$50/mo) | Shared feeds + annotations; teacher-as-admin classrooms (support scales per account, not per seat); paid Team GA gated behind G3 |
| B2B Provenance API (V3) | usage-based | Cluster/correction/ownership dataset licensing (the TOM asset from 04 §5) |

Explicitly **never**: ads, ad-tech, "sponsored" placements, data sales, engagement-optimized anything.

> **Free-tier "unlimited feeds" — the invisible guardrails (panel verdict, Q1, 2026-09-23).** Unlimited feeds is bounded by engineering guardrails documented in 10 — adaptive sync cadence (learned 1–12h publish-rate cadence free; 15-min priority sync is Pro), soft freshness demotion beyond ~250–500 feeds (tail drops to 2–4×/day freshness — the count stays unlimited, the copy stays true), ~5,000-feed hard abuse ceiling plus OPML-import throttling, 30–60d dormancy decay (no active clients → daily cadence), demand-gated enrichment (parse-only new-item detection; readability+embedding only when an active reader's surface needs the item), and per-host crawl politeness (concurrency 1, 2–5s spacing, conditional-GET everywhere, robots/AI-prefs honored). No count cap ships; the public claim stays unlimited. 10's staging adds a unique-feeds / requests-per-publisher / items-enriched axis with graduation triggers on feed load (not DAU alone); its Stage-0 inbound arithmetic is corrected there (600 feeds/hr × 250KB ≈ 108GB/mo, not 3.6TB/mo); and all arithmetic re-runs on Beta (G1) telemetry before "unlimited" appears in store copy.

---

## 3. UVP — three formulations (use by context)

1. **One-liner (product):** *Every source you trust, one calm feed, every claim traceable — and when you're caught up, it says so.*
2. **Positioning statement (internal):** For disillusioned power-readers burned by ad-loaded feeds, dying readers, and untraceable AI answers, Plumb is the news instrument that shows its joinery — provenance-first, calm by design, yours forever (exportable, local-first, no tracking) — because we sell software, not your attention.
3. **Category frame (press/brand):** *Not a news app. A news instrument.* The Dualit-toaster / Lie-Nielsen-plane positioning in a category full of disposable kettles. Craftsmanship = the brand identity the founder mandated.

**Why this survives the AI-answer threat (T1 in 04):** chatbots answer "what happened"; Plumb answers "what happened *to my information diet*, whom it came from, and what it cost me" — ownership, verification, and bounded ritual are not answer-engine substitutable.

---

## 4. ICP — Ideal Customer Profiles (with sizing anchors from 02)

### Primary: "The Burned Power-Reader"
- **Who:** 30–55, reads 20–100+ sources, has *paid* for Feedly/Inoreader/Pocket/Readwise; frequents HN, r/rss, r/selfhosted; skeptical of AI and ads; values export, privacy, keyboard UX. Pocket's shutdown (2025) and Feedly's Pro+ price ($12.99/mo) left them homeless or resentful.
- **Population anchor:** RSS niche ~50M global users (vendor est., low conf.); Feedly 14–15M registered. Convert 0.1–0.3% to paid within 36 months → 15–45k subs (inside SOM, 02 §3.3).
- **Job-to-be-done:** "Keep my whole reading world in one tool I trust and control, without renting my attention back."

### Secondary: "The Calm Seeker" (recovering doomscroller)
- **Who:** 25–60, post-2020 news-anxious; deleted Twitter/Facebook; wants to stay informed for work/civic life without the slot machine. Validates via 1440's 4.6M-sub newsletter cohort and 42% avoidance stat.
- **JTBD:** "Stay informed in ≤15 minutes a day without feeling manipulated."

### Tertiary: "The Analyst/ Educator / Newsroom prosumer"
- **Who:** researchers, journalists, librarians, civics teachers; need cross-source comparison, correction history, citations they can export. Ground Vantage's un-served non-US cousin.
- **JTBD:** "Assemble defensible, citable cross-source evidence quickly." (This profile seeds the V3 B2B API.)

### Explicitly NOT the ICP (v1): the engagement-native under-25 (served by TikTok/Reels; wrong product), the deal-hunter free-forever user (fine as free tier, never targeted), China/Korea/Japan super-app interiors (see 02 Force 5).

---

## 5. Where the Early Adopters Hang Out (the founder's hunting map)

**Tier A — congregated, reachable now, high intent:**

| Place | Who's there | Your move |
|---|---|---|
| **Hacker News** (news.ycombinator.com) | The Pocket-obituary threads ("Show HN" culture; the RSS-privacy thread was front page) | Show HN at MVP with the *export-first + local-first* angle; title the honest-engineering story, not "AI news app" |
| **r/rss, r/Pocket, r/selfhosted, r/privacy** | Power-readers, ex-Pocket users, homelabbers | Be a resident first (answer questions for weeks); the 2025 "~80% of RSS readers phone home" investigation is *their* trauma — publish your data-map before posting |
| **IndieWeb / Micro.blog community** (indieweb.org, micro.blog) | Protocol maximalists; ActivityPub implementers | Implement their building blocks (webactions, h-feed); they amplifiy implementations |
| **NetNewsWire & NewsBlur communities** (NNW Slack, NewsBlur forum) | OSS reader loyalists; NewsBlur's $36/yr cohort shows willingness-to-pay | Contribute code/courtesy, position as complement (sync service?) before competitor |
| **Follow.app community** (follow.app — the RSS+social reader, itself popular with this cohort) | Exactly your overlap users | Watch their feature gaps; recruit switchers via import tooling |

**Tier B — adjacent, mission-aligned:**

| Place | Move |
|---|---|
| **Product Hunt** | Launch V1 (not MVP — quality brand needs polish; PH's 2026 audience still rewards craft tools) |
| **r/privacyguides, PrivacyGuides forum** | The zero-telemetry + data-map pitch; get listed in their "News" recommendations if possible (huge endorsement for this cohort) |
| **Readwise Reader community / r/readwise** | Not a competitor pitch — the " Reader is for highlights, Plumb is for the feed" complementary framing; cross-recruit |
| **LION Publishers / Press Forward grantees / r/journalism, r/DataHoarder** | For the local-news (BO3) expansion and correction-tracker credibility; journalists become your evangelists for provenance tooling |
| **Local news deserts coverage circuit** (Nieman, Poynter, CJR commentariat) | When you ship county digests, pitch the Medill-desert angle — mission press is free press (O3) |

**Tier C — latent, activated by story:**

| Place | Move |
|---|---|
| **Calm-tech / digital-minimalism scene** (r/digitalminimalism, Center for Humane Technology alumni network, "slow web" newsletters) | The "You're caught up" hero + session-budget story; guest posts on calm-tech blogs |
| **University libraries / civics teachers** (LibraryUp-style programs) | Ground Education's free-for-schools precedent; pilot the Team tier with 2–3 classrooms |
| **Bluesky custom-feed culture** | Ship a great Bluesky-feed integration day one; the feed-builder community there is the 2026 growth mechanic (Tubefilter) — make Plumb the best *reader* for AT feeds |

**Non-places (don't burn time):** paid YouTube sponsorships (Ground's lane, expensive), SEO content marketing (search is dying and you have no moat there), app-store paid UA (CAC kills quality-first economics).

---

## 6. Landing Page Concept

### 6.1 Page architecture (single page, static, fast — practice what we preach)

Performance budget: ≤ 60KB critical path, zero third-party scripts, system-font fallback + one self-hosted variable font, static HTML (Astro), no cookie banner (no trackers to consent to — say so). The page itself is demo-trust: view-source is marketing.

Sections, in order:
1. **Hero** (variants below) + single CTA (email waitlist or direct download when MVP ships)
2. **The receipts strip** — data-map link, export policy, shutdown plan, AI-use register, plus "0 third-party requests on this page — view-source" (Hero E's strongest line, folded in permanently per panel): five plain links under the heading "Boring on purpose." For the EU press cycle, Hero E is re-typeset as a craft spec-sheet/colophon rather than a compliance checklist.
3. **How it works** — 3 panels: *Bring your feeds* (OPML animation) → *Read calm* (cluster card + "caught up" state) → *Trace everything* (provenance panel screenshot)
4. **The instrument metaphor block** — one paragraph + line drawing: plumb line, joinery, hand-tool language. (Brand anchor; this is what people screenshot.)
5. **Pricing** — two tiers, one table, no asterisks. Free vs Pro. Annual shown first.
6. **FAQ** — the six hard questions (What happens if you die? Do you train AI on my reads? Why not free+ads? How is this not Artifact? Which AI models? Can I self-host the client?)
7. **Footer** — methodology docs, security.txt, changelog, press kit link.

### 6.2 Hero-section variants (five, each with its philosophy)

---

#### Hero A — "The Anti-Feed" (manifesto-first)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   Your news app is a slot machine.                           │
│   This is an instrument.                                     │
│                                                              │
│   PLUMB — the verifiable news reader.                        │
│   Every source you trust. One calm feed. Every claim         │
│   traceable. When you're caught up, it says so.              │
│                                                              │
│   [ Import your feeds → ]        [ See how it works ]        │
│                                                              │
│   No ads. No tracking. No infinite scroll. Export everything.│
└──────────────────────────────────────────────────────────────┘
```

**Philosophy:** pattern-interrupt values marketing. Opens with the enemy (the engagement economy) and re-frames the product as a tool, not a feed. Converts the *ideologically* motivated — the r/privacy, calm-tech, burned-Pocket cohort — who share manifestos. Risk: polarizing; reads as another "we're so ethical" startup if the receipts strip doesn't immediately back it up. Use for launch week and HN/Reddit-linked traffic. **Panel ruling:** launch-window and break-glass campaign asset only — retire from the landing page after the MVP launch window; manifesto energy lives in the founder essay (06 P1) and press-kit founder lines; temporarily redeploy during engagement-economy scandals while the enemy is salient.

---

#### Hero B — "You're caught up." (the product as hero)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                    ( small plumb-line mark )                  │
│                                                              │
│              You ' r e   c a u g h t   u p .                 │
│                                                              │
│         When was the last time your news app said that?      │
│                                                              │
│         Plumb ends when your news ends. Bounded sessions,    │
│         corroboration-checked alerts (2 a day, you set it),   │
│         and a morning brief you can finish.                  │
│                                                              │
│              [ Start calm — free ]                           │
└──────────────────────────────────────────────────────────────┘
```

**Philosophy:** radical restraint *is* the demonstration. Massive whitespace, one sentence doing the selling. This hero works because its emptiness is evidence — no incumbent could publish this page without lying. Converts the Calm Seeker ICP; extremely screenshot-able (the phrase becomes the brand's "Talk to Penny"). Risk: undersells the power-reader features; pair with a dense "how it works" section immediately below. Use as the default hero after launch, once the manifesto crowd has arrived. **Panel ruling:** V1 steady-state default (3 of 4 hero-relevant judges; hostile-skeptic dissent for D recorded with its falsification test). The dense how-it-works pairing below is load-bearing and the pricing section (§5 of the page) must telegraph the Pro power-reader features B does not. Product-truth monitor: if fewer than ~30% of D7 sessions reach the caught-up state, fix the product first — B may never become the lie A was written to attack.

---

#### Hero C — "Show the joinery" (proof-first, dev-flavored)

```
┌──────────────────────────────────────────────────────────────┐
│  PLUMB ▮ news instrument                                     │
│                                                              │
│  ┌─ TODAY ────────────────────────────────────────────┐      │
│  │ ▸ Fed signals quarter-point cut          14 sources │      │
│  │   └ first: Reuters 09:41 · wire: AP · corrections: 0│      │
│  │ ▸ County budget hearing tonight           1 source  │      │
│  │   └ local · corroborators: 0 ⚠ unverified            │      │
│  │ ▸ Why you're seeing this ⟶ 3 feeds, 1 topic         │      │
│  └─────────────────────────────────────────────────────┘      │
│                                                              │
│  Every cluster carries its source chain, first reporter,      │
│  wire dependency, and correction count. The AI is labeled.    │
│  The ranking is explainable. The data is yours.              │
│                                                              │
│  [ Import OPML → ]   [ Read the methodology ]                │
└──────────────────────────────────────────────────────────────┘
```

**Philosophy:** show-don't-tell for the engineer/architect audience — a live-styled mini product surface as the hero itself. The "1 source ⚠ unverified" line is doing heavy lifting: it demonstrates that the product *admits uncertainty*, the single most trust-building pixel on the page. Converts HN/Show-HN and power-readers; pairs with the methodology link (the page practices provenance about itself). Risk: busier, less emotional; weaker for the Calm Seeker. **Panel ruling:** permanent challenger and the permanent hero for HN/technical referral traffic; the "1 source ⚠ unverified" pixel is the strongest trust element on any variant and survives all restylings. Ships only at MVP — a styled fake UI on a pre-product waitlist page would burn the trust being sold.

---

#### Hero D — "Bring your feeds. Keep your feeds." (utility-first)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   Drop your OPML here.                                       │
│                                                              │
│   ┌────────────────────────────────┐                         │
│   │   ⬇  subscriptions.opml        │   ← real dropzone      │
│   └────────────────────────────────┘                         │
│                                                              │
│   47 feeds found. 0 duplicates. Import takes 4 seconds.      │
│                                                              │
│   Plumb reads RSS, newsletters, Bluesky feeds, and podcasts. │
│   It stores locally, exports forever, and will never hold    │
│   your reading hostage. Pocket users: welcome home.          │
│                                                              │
│   [ Drop file ]  [ or paste a Feedly/Inoreader URL → ]       │
└──────────────────────────────────────────────────────────────┘
```

**Philosophy:** pure conversion utility. The hero *is the product's front door* — an actual working dropzone that parses OPML client-side and shows the count before asking for anything. "Pocket users: welcome home" targets the 2025 refugee cohort by name (that shutdown is the single highest-intent event in this niche's history). Converts immediately and demonstrates the no-signup-needed ethic (parsing happens in-browser). Risk: assumes the visitor already has feeds — cold for the Calm Seeker; the page below must carry them. **Panel ruling:** deploy at `/import` and campaign-specific landings (r/Pocket threads, Pocket-obituary HN threads, Feedly/Inoreader pricing gripes) — a 9+ converter on OPML-in-hand traffic, but never the cold-traffic root.

---

#### Hero E — "The receipts" (trust-inventory first)

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   PLUMB — a news app that can prove things about itself.     │
│                                                              │
│   ✔ Data-map: every byte we can see, drawn                  │
│   ✔ Export: OPML+JSON, one button, forever                  │
│   ✔ Shutdown plan: 90-day notice, escrowed client           │
│   ✔ AI register: which models, what for, versioned          │
│   ✔ C2PA: we sign what we show you                          │
│   ✔ 0 third-party requests on this page — view-source       │
│                                                              │
│   In a market at 37% trust, receipts beat promises.          │
│                                                              │
│   [ Get the app ]      [ Verify everything → ]               │
└──────────────────────────────────────────────────────────────┘
```

**Philosophy:** in the lowest-trust market on record (DNR 2026: 37%, US 25%), the trust inventory *is* the pitch. Every line is falsifiable by the visitor (view-source really does show zero third-party requests — that's the trick: the claim is checkable in ten seconds). This hero converts skeptics and press; it is also the natural hero for the EU launch (AI Act Art. 50 environment, O7 in 04). Risk: checklist-aesthetic can feel compliance-flavored; the "37%" line needs a footnote link to DNR to stay honest (we practice citation).

---

### 6.3 Hero routing (panel-revised 2026-09-23: source-aware routing replaces the phase-keyed rotation)

The original plan was phase-keyed (calendar/gate-keyed); the panel replaced its *mechanism* with **source-aware routing keyed to traffic origin** — Show HN threads and Pocket-refugee funnels are evergreen, not calendar events. The routing table governs.

| Traffic origin | Hero | Why |
|---|---|---|
| Unattributed / steady-state mixed | **B** (caught up) | The brand's emotional core; highest screenshot coefficient; converts the 42%-avoidance population |
| HN / dev-referral (in perpetuity) | **C** (joinery) | Show HN threads are evergreen funnels; the ⚠-unverified pixel is the strongest trust element on any variant |
| Pocket-refugee & price-gripe campaigns | **D** at a dedicated `/import` page — never the cold root | A 9+ converter on OPML-in-hand traffic; assumes feeds in hand, freezes out Calm Seekers |
| EU / press-cycle trust traffic | **E** (receipts) | Trust-inventory story aligns with Art. 50 coverage; re-typeset as a craft spec-sheet/colophon |
| Engagement-economy scandal cycles | **A** (break-glass campaign asset only) | A's condition for outperforming is a salient enemy |

Retired: **A leaves the landing page** at the end of the MVP launch window — manifesto energy lives in the founder essay (06 P1) and press-kit founder lines. Pre-launch exception: A primary on the waitlist (it recruits the founding cohort), B rotated in alongside once the founding cohort has landed, E's claims live on the page from day 0 via the receipts strip. No head-to-head root A/B of C vs D at MVP launch (two of three hero judges reject it — their traffic intents differ by channel, so the test measures referrer mix, not the hero).

*Original phase table (superseded in mechanism, affirmed in steady-state default):* pre-launch **A**; MVP launch **C or D**; V1 steady-state **B**; EU press cycle **E**.

**Measurement protocol (panel-mandated).** Every phase pre-declares its KPI — pre-launch: email CVR by referrer; MVP: OPML imports completed; steady-state: D7 retention and free→paid by hero cohort. Decision metric is activation-to-paid, never bounce rate. Experimentation = server-side first-party hash-split with aggregate-only counts, or channel-keyed URLs with no per-user persistence, disclosed in the data-map; no third-party scripts ever. Standing falsification test (the hostile-skeptic dissent, adopted as the kill-switch): if B loses to D by >20% on paid conversion in a clean 8–12-week test with >10k visitors per arm, the default flips to D.

---

## 7. What This Concept Deliberately Is Not (anti-scope, from 03 §4)

- Not a bias-score product (Ground's contested lane — we show raters, we don't flatten them into one number)
- Not an AI-summary product (chatbots commoditize summaries; AI is labeled plumbing, never the identity)
- Not a social network (no following people, no likes-for-algorithm; Bluesky/ActivityPub ingestion without building a graph)
- Not free-with-ads (structurally incompatible with every design law in 03 §5)
- Not a super-app (Japan/Korea lesson: that game belongs to LINE/Naver)

---

## 8. Open Questions for the Judge Panel (queued in scratch)

1. Is "unlimited feeds free" sustainable at scale (VPS/edge math in 10 says yes to ~50k users — verify)?
2. Does the instrument metaphor survive localization (plumb lines are culturally Western workshop objects)?
3. Hero A vs B as the long-term default — ideology vs emotion?
4. Local-first sync (CRDT relay) at V1 vs deferring to V2 — build-cost risk vs differentiation?
5. Team/Edu at $2/user/mo — too cheap to sustain support load?

### 8.1 Panel verdicts (judge panel, 2026-09-23 — 8 billed judges, 7 returned + synthesis chair; per-judge detail in scratch)

1. **Unlimited feeds — KEEP, behind invisible guardrails.** Doc 10's arithmetic repudiated as written (Stage-0 inbound overstated 33×; DAU-based staging mis-models polling load; 304-rate 65–85% fleet-realistic); six guardrails bound the claim (§2.6 footnote); telemetry gate before "unlimited" appears in store copy.
2. **Name/metaphor — KEEP "Plumb" globally; localize the metaphor's story layer.** DE-first (das Lot / die Wasserwaage + Handwerk; Hero B → *Alles gelesen.*), JP deferred to a distribution partner (sumitsubo + tsugite); plumb.app + plumbline.app at build time; TM knockout classes 9/42 (§1 verdict block).
3. **Hero default — B affirmed 3–1** (hostile-skeptic dissented for D, its falsification test adopted as the standing kill-switch: flip if B loses to D by >20% in a clean 8–12-week A/B with >10k visitors/arm). Phase-keyed rotation replaced by source-aware routing + measurement protocol (§6.3).
4. **CRDT sync — STAYS AT V1**, with a week-2 E2E key-recovery spike, the Cloud-Bundle Sync fallback named, cut order pre-decided (sync last), and G3 re-specified as sync-success ≥99.9% / unrecoverable-data-loss = 0 / key-recovery contacts per 1k (§2.4; 07 §0 G3).
5. **Team/Edu — chair interim ruling, SUPERSEDED by §8.2** (the assigned judge 429-failed mid-run; the re-run verdict landed after the panel and **kills the interim's $2/user/mo structure**). Interim, kept for the record: annual-only $2/user/mo per-seat with pooled transferable seats (min 5 = $120/yr floor), email-only 48h-SLA support, teacher-mediated classroom administration, grant-funded pilots under 06 P3; kill/reprice to $3–4 if support exceeded ~$1/user/mo over two pilots. Final ruling (§8.2): education = free-for-classrooms; newsrooms = ~$999/yr annual-only site license; paid Team GA behind G3. Decision is not load-bearing until the V2 gate.

**Residual risks the panel could not resolve** (full list in the synthesis output; highlights): no telemetry yet on feeds-per-user distribution, real 304 rates, or whale conversion — "unlimited" ships on unvalidated math until G1; the cost guardrails (demand-gated enrichment, dormancy decay) structurally starve the V3 B2B dataset corpus named as the TOM moat — renegotiation, not tuning, if B2B becomes primary; the experimentation-vs-zero-telemetry doctrine collision must be reconciled before any hero A/B; E2E key management (WebAuthn-PRF unevenness, Automerge-repo mobile maturity) judged from general knowledge, unverified by web research; "Plumb" trademark status in classes 9/42 unverified; Hero B carries a decay mechanism (V2 session-extending scope) — monitor D7 caught-up reach (~30% floor) as a standing metric; the plumb line is generational as much as cultural — its recruiting power decays on a ~decade horizon, absorbed by design (B/E convert; the plumb block serves the screenshot cohort).

### 8.2 Team/Edu pricing — final ruling (re-run judge verdict, 2026-09-23; supersedes the §8.1 item-5 chair interim)

The judge assigned to open question 5 429-failed mid-panel; the chair issued the interim carried in §8.1, and a re-run judge with the identical brief (support-load & ops-economics lens over 06/07) returned a **HIGH-confidence verdict**. Ruling:

1. **KILL $2/user/mo at a 5-seat minimum.** Support-insolvency arithmetic: the $10/mo minimum account buys ~12 minutes of founder time per month at a $50/h loaded rate. High-touch B2B SaaS support runs 22–43% of segment revenue *before* the education multiplier — classrooms realistically touch support at 2–3× the consumer rate, i.e. **87–130% of segment revenue** at $2/user/mo (1,000 seats × $2 = $2,000/mo, which does not cover the load it creates). And Ground News's own education precedent is a 40–50% discount off its consumer price — implying $2.50–3.00/user/mo — so $2 undercuts the very precedent 06 cited.
2. **Split the segment instead of pricing it once.** *Education* = **free for classrooms**: the 2–3 pilot classrooms extend into a capped program (≤10 sites), teacher-as-admin (support scales per account, not per seat), docs/community-only support, no invoicing/POs/procurement, funded from the education/grant line (06 P3 / M6). Free-for-schools wins the mission positioning outright (Ground Education precedent) and removes the refund/procurement risk entirely. *Newsrooms/teams* = **annual-only site license ≈ $999/yr per site** for up to 25 seats (≈ $3.33/user/mo equivalent), with the invariant floor **no billed account under ~$50/mo**; true per-seat pricing only at **$4/user/mo with a 25-seat floor, annual-only**.
3. **Timing:** free classroom pilots begin at V2 (07 §4 cross-references this); **paid Team/Newsroom GA waits for G3** (the V3 window) — a premature paid-edu line is the fastest known way to consume a solo founder's support capacity (W6).
4. **Flip conditions** (any two → revisit the pricing): pilot telemetry ≤30 min support/account/mo; a funded support contractor in place; ≥3 PO-free self-serve signups; G2 free→paid conversion ≥6%; a reseller/channel partner absorbing support; accounts exceeding 50 seats.

Applied consequences: the §2.6 tier-table row above is amended to this ruling, and 07 §4's V2 Team/Edu line carries the cross-reference. The panel's residual note stands, strengthened: the decision remains non-load-bearing until the V2 gate — and no paid Team ships before G3.

---

# ═══ FILE: 06-press-kit-gtm-monetization.md ═══

# 06 — Press Kit, Go-To-Market, and Monetization Strategy

**Date:** 2026-09-23 · **Product:** Plumb (concept, 05). Companion: 04 (SWOT), 07 (release strategy).

---

## Part 1 — Press Kit (messaging + ready-to-use assets outline)

### 1.1 The press kit's job
In a 37%-trust market (DNR 2026; US 25%), the press kit must do double duty: pitch the story *and* be evidence that the company practices what it pitches. Every claim in the kit links to a primary source. The kit itself ships as a static, offline-capable page (`/press`) + a zip — no tracking on the press kit (say so; journalists notice).

### 1.2 Boilerplate (the 40-word company description)

> Plumb is a provenance-native news reader: every source you trust in one calm feed, every claim traceable, every byte exportable. No ads, no tracking, no infinite scroll. Built by a solo engineer, funded by subscriptions, and designed to be shut down honestly. plumb.app

Variants: 20-word ("The news instrument: calm, traceable, yours.") and 100-word (adds the Pocket/Pocket-diaspora context + the receipts list).

### 1.3 Message house

| Level | Message |
|---|---|
| **Roof (the one thing)** | *You shouldn't have to choose between staying informed and staying sane, tracked, or tricked.* |
| Pillar 1 — Traceable | Every cluster shows its source chain: first reporter, wire dependency, correction count, AI-use labels, "why you're seeing this" |
| Pillar 2 — Calm | Bounded sessions, corroboration-gated alerts, a daily budget (default 2), "You're caught up" as a feature |
| Pillar 3 — Yours | Local-first, one-button export (OPML+JSON), zero telemetry by default, a published shutdown plan |
| **Foundation (receipts)** | Data-map · AI register · methodology docs · security.txt · C2PA signing · view-source-clean landing page |

### 1.4 The five story angles (pitch one per outlet type)

1. **The craftsman story (dev/indie press — TLDR, Indie Hackers, HN):** solo full-stack/DevSecOps engineer builds the anti-engagement news app; boring tech, visible joinery, published threat model. Hook: "he open-sourced his shutdown plan."
2. **The Pocket-refugee story (consumer tech press — Verge, Lifehacker, MacStories):** 2025's Pocket shutdown left millions of power-readers homeless; Feedly's Pro+ costs $155.88/yr; Plumb imports their OPML in four seconds and promises export forever. Hook: the dropzone hero (05 §6.2 D).
3. **The trust story (press-criticism press — CJR, Nieman, Poynter):** in the lowest-trust year on record, an aggregator that signs its cards with C2PA, tracks outlet corrections publicly, and refuses to publish AI-bylined claims. Hook: "the anti-NewsBreak."
4. **The local story (local-news ecosystem — LION, Medill-adjacent, Press Forward circuit):** county-level digests for the 1,524 single-source counties (Medill 2025) with human verification. Hook: "what if the local news app checked its own facts."
5. **The EU/regulation story (policy/tech press — Sifted, heise, EU tech policy outlets):** AI Act Art. 50 (in force 2026-08-02) demands disclosure; Plumb ships an AI-use register and per-element labels as product features, not compliance chores. Hook: "the news app that treats the AI Act as a spec."

### 1.5 Fact sheet (numbers the press can use — all sourced in this project)

| Fact | Figure | Source (link in kit) |
|---|---|---|
| Trust in news, global | 37% — lowest since 2015 (US 25%) | DNR 2026 |
| News avoidance | 42% | DNR 2026 |
| Users who disabled news alerts | 43% | DNR 2026 |
| AI-chatbot news trust / click-through | 20% / 4% | DNR 2026 |
| US adults preferring news websites/apps | 21% | Pew 2025 |
| Google search referral decline (publishers) | −33% global / −38% US | Chartbeat via Axios 2026-03 |
| US counties with ≤1 local news source | 1,524 (+213 with none; ~50M people underserved) | Medill 2025 |
| Pocket shutdown | 2025-07-08 | Mozilla |
| Plumb pricing | Free (no ads) / Pro $4.99/mo · $39/yr | company |

### 1.6 Assets checklist
Logo (SVG + PNG light/dark), the plumb-line mark animation (Lottie, 8KB), founder headshot + bio + "why I built this" 200 words, 3 product GIFs (OPML import; provenance panel; "caught up" state), screenshots (light/dark/mobile), the receipts strip graphic, boilerplate, fact sheet, FAQ link, press contact (plain mailto — no form), embargo policy, and the quotable founder lines: *"We sell software, not attention." / "The feed economy treats readers as inventory. We built the opposite." / "Every claim in this app can be traced — including ours."*

### 1.7 Press-kit QA rule
Nothing in the kit may be unverifiable: every number links out; every product claim matches a shipped feature (no vaporware in the kit — the 07 release gates keep this honest); the kit page itself passes the zero-third-party-request test it advertises.

---

## Part 2 — Go-To-Market Strategy

### 2.1 Doctrine (from the SWOT: W4, T4 — no budget, chokepointed discovery)

1. **Community-first, paid-last (never).** Ground News bought awareness with 1,863 YouTube integrations / 664M views (Axios via Wikipedia) — that lane is closed to us and misaligned with the brand. Our CAC channel is participation.
2. **The product is the press.** Export-everything, data-map, AI register, shutdown plan — each is simultaneously ethics, engineering, and newsworthy differentiation (angle 1/3 above).
3. **Recruit the homeless before the curious.** The Pocket diaspora and price-resentful Feedly users have *demonstrated* willingness to pay for readers. Convert them first (05 §5 Tier A), generalize later.
4. **Slow by design, public by default.** Build in the open (changelog, methodology repo). The craftsmanship brand mandates it; it also compounds trust inventory (T5 defense).
5. **Geography: English-first US/UK/CA/AU, EU press push at V1** (Apple's absence in mainland EU = O7; AI Act story = angle 5). No APAC until V3 (02 Force 5).

### 2.2 Phased GTM (matches 07's release ladder)

| Phase | Product state | GTM motion | Success metric (gate) |
|---|---|---|---|
| **P0 Pre-launch** (months 0–3) | Landing + waitlist (hero A/D) | Show-HN-adjacent teaser only after data-map + methodology docs are live; seed 20 hand-picked power-readers (5 HN, 5 r/rss, 5 Pocket-refugee bloggers, 5 journalists) with private beta | 1,000 waitlist emails; ≥5 external methodology links |
| **P1 MVP launch** (month 4–6) | MVP: RSS+OPML, clusters, Today brief, export, notification budget | **Show HN** + r/rss + r/selfhosted + r/Pocket same week; Product Hunt *only if* polish bar met; founder essay ("Why I built a news app in the year the news app died") on personal blog, syndicated to dev publications | 5k installs, D30 retention ≥25%, ≥100 unaffiliated OPML imports |
| **P2 V1 launch** (month 9–12) | Newsletters, Bluesky, sync, translation, search | Press cycle #1: angles 2+3 (consumer + press-criticism); launch the EU receipts story (angle 5) at a privacy/security conference (e.g., event talk) or via heise/Sifted exclusive; PH if skipped at P1 | 25k installs, 1k paying (4% conversion target), first press in ≥3 tier-1 outlets |
| **P3 V2** (year 2) | ActivityPub, corrections tracker public, ownership panel, Team/Edu | Press cycle #2: angle 4 (local deserts) when county digests pilot; classroom pilots via LibraryUp-style programs; conference talk circuit (calm-tech + journalism events) | 100k installs, 8k paying, 3 pilot classrooms/newsrooms |
| **P4 V3** (year 3) | Weekly-review builder, B2B API beta | Provenance-dataset story (angle 3 evolution): "the correction history of the internet's front page"; partnerships with research groups | 250k installs, 25k paying, 3 paying B2B API accounts |

### 2.3 Channel map (ordered by expected CAC efficiency)

| Channel | Motion | Why it fits | Cost |
|---|---|---|---|
| HN Show-thread residency | Launch + every changelog-worthy milestone | The Pocket obituary and RSS-privacy threads show this crowd's intensity; export-first/local-first is native HN language | $0 |
| Reddit residency (r/rss, r/selfhosted, r/privacy, r/Pocket) | Answer-first participation, launch posts, monthly changelog threads | Documented resentment of Feedly pricing + reader telemetry | $0 |
| Bluesky/ActivityPub presence + custom feed | Ship the best AT-Protocol reader feed; the community is the 2026 growth mechanic (Tubefilter) | Protocol-native distribution, zero ad spend | $0 |
| Founder essay / dev-publication syndication | 2–3 long-form essays year 1 (the anti-engagement manifesto; the local-first architecture post) | Angles 1; evergreen SEO for the brand name | $0 |
| Press cycles (angles 2–5) | 2 cycles year 1, 2 in year 2, timed to releases | Trust-market story is legible to journalists; the receipts make coverage easy to write | $0 (pitching) |
| Newsletter cross-promo | Swaps with calm-tech/dev newsletters (beehiiv ecosystem: 255M+ readers) | Audience overlap exact; beehiiv's 41% open rates beat any paid channel | ~$0–low swaps |
| App-store editorial pitch | Feature-request to Apple/Google editorial with the craftsmanship story | Slow-news/calmed apps occasionally featured; free if landed | $0 |
| Conference talks | 3–4/yr (dev-infra + journalism + calm-tech) | Founder credibility + press intros | travel only |
| **Never:** paid UA, YouTube sponsorships, SEO content farm | — | Misaligned with brand; CAC economics break quality-first P&L (04 W4) | — |

### 2.4 Retention & referral mechanics (product-side GTM)

- **The export promise as referral:** "loan" the app to a friend = share a curated feed bundle (OPML) — spreads via the artifact users already trade.
- **Provenance share cards:** every shared cluster carries the source-chain graphic + C2PA credential — each share is an ad with receipts.
- **Annual-first pricing with "pause, don't cancel"** (churn defense: the 36% who quit over free alternatives get a free-tier landing, not a cliff).
- **Public changelog + methodology repo stars** as community flywheel (the selfhosted crowd evangelizes tools they can audit).

---

## Part 3 — Monetization Strategy — Options with Pros/Cons

### 3.1 The decision frame
Constraints from research: paying-for-news ceiling 17% (DNR basket); churn ~4%/mo (INMA)–5.8% (RetentionCheck); churn drivers = free alternatives (36%) and intro-price expiry (28%); ARPU benchmarks $11–12/yr-aggregated-user (market-level), $50–100/yr power-reader; category trust at record lows punishes any perceived bait-and-switch. Brand law (05 §2.6): **no ads, no data sales, ever.**

### 3.2 Options considered

| # | Model | Mechanics | Pros | Cons | Verdict |
|---|---|---|---|---|---|
| M1 | **Two-tier subscription (chosen)** | Free (full reader, 1 device, no limits-games) + Pro $4.99/mo · $39/yr annual-first (sync, translation, corrections, search-server, API token); Team/Edu $2/user later | Matches Feedly/Inoreader WTP anchors *under* them; honest, explicable in one table; recurring revenue funds verification labor (04 W3); "no ads ever" is the differentiator that pays for itself in press | 17%-payer ceiling caps TAM slice (02 §3.2); needs ~25k payers for the $2M SOM floor — a multi-year grind | ✅ **Core model** |
| M2 | One-time "buyout" license (e.g., $79 lifetime) | Classic indie/mac-app model (NetNewsWire-free vs Things-$49 world) | Beloved by the r/selfhosted cohort; converts trust directly | No recurring revenue to fund ongoing feed-infra costs (polling is an opex, not a one-time deliverable); lifetime-liability vs a service business — the JangaFx/RapidSSL trap; undermines B2B arc | ⚠️ **Hybrid only:** cap at "Founder license" 1,000 units ($99) as a fundraising + loyalty device, never the main line |
| M3 | Free + ads/ad-tech | The SmartNews/Flipboard model | Zero-friction scale; $294.6B US ad pool adjacent | Structurally incompatible with every design law (03 §5); ad-load is the #1 documented complaint cluster (Apple News+ ads-despite-payment; SmartNews no-ad-free); destroys the calm/privacy brand on which the entire differentiation rests | ❌ Rejected (existential brand risk) |
| M4 | Freemium-with-limits (6 Blindspot-style) | Free tier rationed (e.g., 50 feeds, 7-day history) to force upgrades | Standard SaaS conversion machinery (Feedly/Inoreader do it) | The documented resentment driver in the niche (Inoreader's 150-feed cap; Ground's 6/day rationing complaints); contradicts "unlimited feeds free" trust play; conversion gained < trust lost for a craftsmanship brand | ❌ Rejected (trust > conversion) |
| M5 | B2B/API licensing (V3+) | Provenance dataset (clusters, corrections, ownership, corroboration scores) licensed to researchers, newsrooms, (eventually) AI-answer-engines needing citable grounding | The TOM moat (04 §5; 02 §3.4); Perplexity's $42.5M program and OpenAI's >$250M News Corp deal prove demand at the top of market; diversifies away from consumer ceiling | Requires years of accumulated dataset; AI-licensing market is legally unsettled (NYT v. OpenAI); brand risk if partners are engagement companies | ✅ **V3 phase-gate** (07) — start schema in V1, sell in V3 |
| M6 | Grants / philanthropy (local-news angle) | Press Forward-style funders, Knight, democracy-program grants for county digests + correction tracker | Non-dilutive; mission-legible (Medill desert stats are grant catnip); funds BO3 without taxing subscribers | Grant cycles are slow, reporting-heavy, and mission-drift-prone; dependence risk | ⚠️ **Opportunistic supplement** for the local (BO3) expansion only, never core |
| M7 | White-label / embeddable reader | License the reader+sync engine to publishers as their own app (media-branded) | Reuses the exact FOSS stack (09); publishers need owned surfaces as search dies (−33%) | Support load per client; brand dilution; slow enterprise cycles for a solo founder | ⚠️ **Defer to post-V3**, revisit if API (M5) gets pull |
| M8 | Donations/Patreon | Open-core with supporter tier | Community goodwill; works for NewsBlur ($36/yr survives) | Unpredictable; signals hobby not instrument; caps at NewsBlur-scale (~small) | ❌ Rejected as primary (NewsBlur proves it's survivable but not SOM-relevant) |

### 3.3 Pricing detail for M1 (the chosen model)

| Element | Decision | Rationale (benchmarks) |
|---|---|---|
| Pro monthly | **$4.99** | Between Ground app Pro $0.99/Premium $3.99 and Vantage $8.33/mo-equivalent; under Feedly Pro $6.99 and way under Pro+ $12.99 |
| Pro annual | **$39/yr** (35% discount, shown first) | Churn defense: intro-expiry is a documented 28% churn driver — anchor annual from day one |
| Free tier | Unlimited feeds, all core reading, 1 device | The trust wedge (M4 rejection); infra math supports it to ~50k users (10) |
| Founder license | $99 × 1,000 max | M2 hybrid: community capital + urgency, capped liability |
| Team/Edu | $2/user/mo (min 5) | Ground's group-discount precedent (40–50% off) recalibrated for classrooms/newsrooms |
| Price promise | Published, versioned; no dark lanes | The anti-Ground-fragmentation play (03 §1.2) |

### 3.4 Revenue model over time (ties to 02 §3.3 SOM)

| Horizon | Mix | Note |
|---|---|---|
| Year 1 | M1 subs only (1–2k paying ≈ $60–140k ARR) + optional Founder licenses ($50–100k one-time) | Grants (M6) pursued for county pilot |
| Year 2 | M1 (8k ≈ $480k ARR) + Team/Edu seed | Correction-tracker public page starts the M5 dataset accrual |
| Year 3 | M1 (25k ≈ $1.5M) + M5 API beta ($0.1–0.3M) | SOM path $2M+; B2B optionality proven or killed by V3 gate (07) |

---

## Sources (this file's load-bearing claims)

1. DNR 2026 — trust 37%/US 25%, avoidance 42%, alerts-off 43%, AI trust 20%/CTR 4%, paying 17%. https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2026/dnr-executive-summary
2. Pew 2025 — 21% prefer news websites/apps. https://www.pewresearch.org/journalism/fact-sheet/news-platform-fact-sheet
3. Axios via Wikipedia — Ground News 1,863 YouTube integrations / 664M views. https://en.wikipedia.org/wiki/Ground_News
4. Medill 2025 — 213/1,524 counties, ~50M underserved. https://localnewsinitiative.northwestern.edu/
5. Chartbeat via Axios — referral decline −33/−38%. https://www.axios.com/2026/03/17/chartbeat-search-traffic-ai-chatbots
6. Mozilla — Pocket shutdown. https://support.mozilla.org/en-US/kb/pocket-shutdown-faq
7. Readless 2026 — Feedly/Inoreader pricing + telemetry investigation recap. https://readless.io/blog/feedly-vs-inoreader-vs-newsblur
8. INMA / RetentionCheck — news churn ~4–5.8%/mo; churn-driver mix. (via scratch notes)
9. StationX — Ground tier fragmentation. https://app.stationx.net/articles/ground-news-review
10. beehiiv 2026 — 255M+ readers, 41% open. https://www.beehiiv.com/
11. NYT/Semafor/Nieman — OpenAI licensing range (>$250M News Corp; ~$10M Axel Springer). PRNewswire — Perplexity $42.5M program.
12. Tubefilter 2026-08-26 — Bluesky custom feeds as growth mechanic.

---

# ═══ FILE: 07-release-strategy.md ═══

# 07 — Release Strategy: MVP → Beta → V1 → V2 → V3 (quality-gated, PMF over time-to-market)

**Date:** 2026-09-23 · **Product:** Plumb (05). **Doctrine:** the brand is quality craftsmanship, so the release ladder is *gated by measured quality and PMF signals, not by calendar*. A version ships when its gate is met; a gate unmet stops the roadmap, not the standard. This is the anti-Artifact playbook: Artifact shipped beautifully and still died of "market opportunity isn't big enough" — our answer is to instrument the market answer at every gate and pre-decide the responses (04 §4).

**Stage ↔ GTM mapping** (keeps 06 consistent): MVP = internal milestone · **Beta = public beta** (06's "P1 MVP launch" is this stage) · V1 = GA press cycle 1 (06 P2) · V2 = year-2 expansion (06 P3) · V3 = year-3 B2B (06 P4).

---

## 0. The Gate System (read first — it governs everything below)

| Gate | Between | Metric thresholds (measured over ≥4 consecutive weeks) | If unmet |
|---|---|---|---|
| **G0 — Craft gate** | MVP → Beta | Zero known P0/P1 bugs; cold start <2s mid-tier Android; crash-free ≥99.5%; Lighthouse ≥95; export/import round-trips losslessly; security checklist (09 §7) complete | Fix, don't announce. No exceptions — the first Show HN is the brand's only virgin impression |
| **G1 — Traction gate** | Beta → V1 | ≥5k installs; D30 retention ≥25%; ≥100 unaffiliated OPML imports; NPS-style "would you be disappointed if this died" ≥40% "very" (the Sean Ellis PMF survey); ≥1 organically written external mention | Two options, pre-decided: (a) one 6-week fix cycle on the top-3 churn reasons, then re-measure; (b) if still unmet after cycle 2, freeze feature roadmap, pivot per 04 §4 point 4 (the written Artifact clause) |
| **G2 — Willingness gate** | V1 → V2 | ≥1k paying (≥4% of MAU); paywall-page→trial ≥8%; trial→paid ≥35%; churn ≤4.5%/mo; support load ≤2h/wk per 1k users | Re-price or re-scope Pro (06 §3.3 levers); do NOT add features to buy growth |
| **G3 — Scale-quality gate** | V2 → V3 | 99.9% API availability over 90 days; **sync success rate ≥99.9% and unrecoverable-data-loss incidents = 0 and key-recovery support contacts per 1k users trending down** (panel re-specification 2026-09-23: the original "sync conflict rate <0.1%" was vacuous for a CRDT — Automerge/Yjs merge conflicts by construction, so the metric measured nothing; what actually fails users is sync not completing and keys not being recoverable); infra cost ≤$0.08/MAU/mo (10-stage math); correction-tracker dataset ≥6 months deep; ≥3 unsolicited B2B inquiries | Harden infra and dataset; B2B waits — no exceptions (a premature B2B line kills a solo founder's support capacity, W6) |

Every gate's numbers are written into the dashboard before the stage begins; moving a threshold requires a public changelog entry (accountability is part of the brand).

---

## 1. MVP (internal milestone — months 0–3)

**Purpose:** prove the engine, not the product. One user: the founder + 20 hand-picked testers (05 §5 seeds).

### Scope (from 05 §2 priorities marked MVP)

- Ingestion: RSS/Atom/JSON Feed, conditional-GET polling, per-feed cadence
- OPML/JSON import (+ duplicate detection)
- Clustering: embeddings + agglomerative grouping; one card per event
- Today brief (90-second morning digest)
- "You're caught up" hard stop; chronological toggle
- Provenance v0: source list per cluster, "why am I seeing this" panel
- Notification budget (default 2/day), corroboration-gated breaking (≥3 outlets or 1 wire)
- Export everything (OPML+JSON one button); zero telemetry; local-first storage
- Public methodology doc v1 + crawler-behavior doc + AI-use register
- Receipts: data-map, shutdown plan (documents — cheap, load-bearing)

### Impact–Effort matrix (MVP candidate features)

| Feature | Impact (1–5) | Effort (1–5) | Verdict |
|---|---|---|---|
| RSS ingest + conditional GET | 5 | 2 | ✅ In |
| OPML import/export | 5 | 1 | ✅ In |
| Event clustering engine | 5 | 4 | ✅ In (the core IP; 09 architecture makes it decomposed) |
| "Why this story" panel | 4 | 2 | ✅ In (brand-defining, cheap) |
| Notification budget + corroboration gate | 4 | 2 | ✅ In |
| "Caught up" + chronological toggle | 4 | 1 | ✅ In |
| Today brief | 4 | 3 | ✅ In |
| Local-first storage | 5 | 3 | ✅ In (retrofitting later is a rewrite; do it now) |
| Methodology/receipts docs | 3 | 1 | ✅ In (marketing asset from day 0) |
| Keyboard shortcuts | 3 | 1 | ✅ In |
| Newsletter ingestion | 4 | 3 | ❌ Out — Beta (needs email infra + HTML cleaning edge cases) |
| Bluesky/AT feeds | 3 | 3 | ❌ Out — V1 |
| E2E sync | 4 | 5 | ❌ Out — V1 (CRDT design starts now, ships later) |
| Translation layer | 3 | 4 | ❌ Out — V1 (open-weights pipeline ready, UX not) |
| C2PA signing | 3 | 3 | ❌ Out — V1 (apply for membership NOW; lead time) |
| Web app | 3 | 4 | ❌ Out — V1 |
| Correction tracker | 3 | 4 | ❌ Out — V2 (start schema at V1) |
| Ownership/bias panels | 2 | 4 | ❌ Out — V2 |
| Team/Edu | 2 | 4 | ❌ Out — V2 |
| B2B API | 2 | 5 | ❌ Out — V3 |

**MVP exit criteria:** the 20 testers' real feeds run for 4 weeks; G0 metrics green; ≥15/20 testers still active in week 4.

---

## 2. Beta (public beta — months 4–6, gated by G0)

**Purpose:** the trust-market debut. Free, unlisted-ish, community-first (Show HN, r/rss, r/selfhosted, r/Pocket per 06 P1). Polish bar = the craftsmanship brand.

### Scope added

- Newsletter ingestion (per-user address, HTML→text, sender-as-feed)
- Web app (PWA, shareable cluster cards with source-chain graphic)
- Translation layer v1 (open-weights, provenance-preserved)
- C2PA signing of share cards (membership lead time resolved by now)
- E2E-encrypted sync design published; local-only sync via export/import file as stopgap
- Founder licenses ($99 × ≤1,000 — M2 hybrid from 06) go on sale: community capital + real-money validation
- Public changelog + roadmap (the "built in public" flywheel starts here)

### Impact–Effort matrix (Beta additions)

| Feature | Impact | Effort | Verdict |
|---|---|---|---|
| Newsletter ingestion | 4 | 3 | ✅ In (the Feedly-expat pull) |
| Web app / PWA | 4 | 4 | ✅ In (press demos need links; iOS reviewer needs something to see) |
| Translation | 3 | 4 | ✅ In (SmartNews-validated demand; cheap on open weights) |
| C2PA share cards | 4 | 3 | ✅ In (the press-criticism story needs an artifact to photograph) |
| Founder licenses | 4 | 1 | ✅ In (revenue + urgency + belief measurement) |
| Full-text search (client) | 3 | 2 | ✅ In |
| AT/Bluesky feeds | 3 | 3 | ⚠️ Stretch (in if Beta slips past month 6 anyway) |
| E2E sync | 4 | 5 | ❌ Out — V1 (design now, ship later) |
| Read-later/offline packs | 2 | 2 | ❌ Out — V1 |

**Beta exit:** G1 (5k installs · D30 ≥25% · PMF survey ≥40% · 100 unaffiliated imports). The two-cycle fix rule applies (§0).

---

## 3. V1 (GA — months 9–12, gated by G1)

**Purpose:** the first "real product" press cycle (06 P2: consumer + press-criticism + EU receipts angles) and the willingness-to-pay proof.

### Scope added

- E2E-encrypted multi-device sync (CRDT relay; server sees ciphertext — 09 §6) — **panel amendments (2026-09-23):** week-2 E2E key-management/recovery spike runs before any sync code (recovery-key fallback pre-decided); **Cloud-Bundle Sync** is the named degraded mode if the relay is not G0-grade at the V1 gate (client-encrypted bundles via the user's own cloud drive; relay GA re-gates to a 90-day post-V1 milestone); V1 scope cut order puts sync last
- Pro tier goes live: $4.99/mo · $39/yr (pricing from 06 §3.3)
- Bluesky custom feeds + lists; Reddit/HN as feeds
- Read-later with offline packs
- Weekly review (Sunday digest builder — the 1440-validated format)
- AI per-element labels (model + prompt-version on every AI-touched element)
- security.txt + public bug bounty (small, $100–$1,000 scope-limited)
- Saved searches + server-side search (Pro) — **panel reconciliation (2026-09-23):** 09 §4's law is server-side user data = ciphertext + billing only, so saved searches live inside the user's CRDT ciphertext, and any *server-side* search over user content would violate the data map — if server-side search ships, it must be over non-user corpus (public cluster index), never over personal reading state, or the feature redefines its data handling before V1

### Impact–Effort matrix (V1 additions)

| Feature | Impact | Effort | Verdict |
|---|---|---|---|
| E2E sync (CRDT relay) | 5 | 5 | ✅ In (the last structural differentiator; Deferred-cost accepted — it's THE Pro reason) |
| Pro paywall + billing | 5 | 2 | ✅ In (RevenueCat/Stripe; boring on purpose) |
| Weekly review builder | 4 | 3 | ✅ In (calm-seeker conversion surface) |
| Bluesky/Reddit/HN feeds | 3 | 3 | ✅ In |
| Read-later/offline | 3 | 2 | ✅ In |
| Per-element AI labels | 4 | 2 | ✅ In (Art. 50 story needs it visible) |
| Bug bounty + security.txt | 3 | 1 | ✅ In (DevSecOps brand, cheap) |
| Correction tracker (internal) | 3 | 3 | ⚠️ Schema-only — collection starts, UI at V2 |
| Ownership panel | 2 | 4 | ❌ Out — V2 |
| Team/Edu | 2 | 4 | ❌ Out — V2 |
| Podcasts/YouTube ingest | 2 | 3 | ❌ Out — V2 |

**V1 exit:** G2 (≥1k paying, ≥4% MAU conversion, churn ≤4.5%/mo).

---

## 4. V2 (year 2, gated by G2)

**Purpose:** breadth for the secondary/tertiary ICPs (analysts, educators, diaspora) and the local-news blue ocean pilot (BO3) — the mission press cycle (06 P3).

### Scope added

- Correction tracker **public** ("Our sources' correction history" — press-criticism gold)
- Ownership & funding panel (global, public-data based)
- Multi-rater bias display (side-by-side, methodology published first — the anti-Ground)
- ActivityPub ingestion; podcasts/YouTube channels
- Team/Edu per the final ruling (05 §8.2): **free-for-classrooms pilot program** (capped ≤10 sites, teacher-as-admin, docs/community-only support, funded from the education/grant line) — the $2/user/mo draft is killed; paid **newsroom site licenses (~$999/yr annual-only, ≤25 seats, no billed account under ~$50/mo)** wait for G3/V3
- County digest pilot (BO3): pick 5 single-source counties (of the 1,524), human-verified weekly local briefs; grant applications (M6) run in parallel
- Diaspora cluster packs v0 (EN+ES first — SmartNews-validated language pair)
- B2B dataset schema finalized; inbound inquiries logged (G3 input)

### Impact–Effort matrix (V2 additions)

| Feature | Impact | Effort | Verdict |
|---|---|---|---|
| Public correction tracker | 5 | 3 | ✅ In (unique asset, compounds; M5 accrual) |
| Ownership panel | 4 | 3 | ✅ In |
| County digest pilot ×5 | 4 | 4 | ✅ In (mission + press + BO3 test; capped at 5 to protect solo capacity) |
| Team/Edu + pilots | 3 | 3 | ✅ In |
| ActivityPub ingestion | 3 | 3 | ✅ In |
| Podcasts/YouTube | 3 | 3 | ✅ In |
| Multi-rater bias display | 3 | 2 | ✅ In (display only — we aggregate raters, we don't invent scores) |
| Diaspora packs | 3 | 3 | ⚠️ Stretch (EN+ES only if county pilot under-runs) |
| Web-page watcher (CSS selector) | 2 | 3 | ❌ Out — V3 |
| White-label reader (M7) | 2 | 5 | ❌ Out — post-V3 evaluation |

**V2 exit:** G3 (99.9% availability · sync success ≥99.9% / unrecoverable-data-loss = 0 / key-recovery contacts per 1k trending down — panel re-spec 2026-09-23 · $0.08/MAU infra · dataset ≥6mo · ≥3 B2B inquiries).

---

## 5. V3 (year 3, gated by G3)

**Purpose:** the monetization moat — B2B Provenance API (M5) — plus calm-UX maturity and the second-order products the dataset enables.

### Scope added

- **Provenance API (beta):** cluster/corroboration/correction/ownership endpoints; usage-based pricing; 3+ design-partner accounts (researchers/newsrooms first — NOT engagement companies, brand firewall)
- Weekly-review "editor" (user-assembled briefs shareable as public pages — the newsletter-killer surface)
- Web-page watcher (CSS-selector change detection)
- Diaspora expansion (EN+KO, EN+HI depending on V2 signal)
- Android/iOS widgets, watch complications (calm-glance surfaces)
- Self-hostable sync server (OSS release of the relay — the r/selfhosted dream; support-optional)

### Impact–Effort matrix (V3 additions)

| Feature | Impact | Effort | Verdict |
|---|---|---|---|
| Provenance API | 5 | 4 | ✅ In (the TOM asset; 02 §3.4 says the ceiling REQUIRES it) |
| Self-hostable sync relay (OSS) | 4 | 3 | ✅ In (trust flywheel; near-zero marginal support if OSS-clean) |
| Review-editor public pages | 4 | 3 | ✅ In (viral artifact + newsletter wedge) |
| Widgets/watch | 2 | 2 | ✅ In (calm-glance brand presence) |
| Web-page watcher | 2 | 3 | ✅ In |
| Diaspora expansion | 3 | 3 | ⚠️ Signal-gated |
| White-label (M7) | 2 | 5 | ❌ Evaluate post-V3 with team size |

**V3 exit → steady state:** the 04 §5 dataset-asset thesis is either proven (API revenue ≥$100k ARR) or the product remains a healthy $1.5–2M ARR subscription instrument — both are wins against the Artifact counterfactual; the difference is TOM ceiling.

---

## 6. Cross-Cutting Release Rules (all stages)

1. **Never ship a feature that violates a design law** (03 §5) — even a "small" ad experiment disqualifies the brand premise; the laws are the moat.
2. **Every stage ships docs with code:** methodology updates, changelog entries, AI-register versions. Undocumented = unshipped.
3. **Deprecation policy public from Beta:** 90-day notice, export-first, escrowed client — practiced on our own features before anyone needs it.
4. **Platform risk hedged by ordering:** web/PWA parity at Beta ensures no single app-store rejection can strand users (T8).
5. **The pre-written kill/pivot clause** (04 §4.4) is reviewed at every gate miss — month-18 checkpoint: <8k paying subs despite two press cycles + PH → execute the written decision (B2B pivot / sale / persist), no rationalizing.

---

## 7. Timeline Summary (indicative, gate-governed — dates slip, gates don't)

```
M0────M3────M6────────M9────M12──────────M24──────────M36
│ MVP  │ Beta │         │  V1 GA │   V2      │    V3     │
│ eng  │ Show │ polish  │ press  │ mission+  │ B2B API + │
│ gate │  HN  │ +G1     │  +G2   │ edu/local │ dataset   │
      G0     ↑waitlist→1k      →8k paying  →25k paying
```

| Milestone | Month (target) | Hard gate |
|---|---|---|
| MVP complete | 3 | G0 craft metrics |
| Public beta (Show HN week) | 4–6 | G0 |
| V1 GA + press cycle 1 | 9–12 | G1 traction |
| V2 + press cycle 2 | ~24 | G2 willingness |
| V3 + B2B beta | ~36 | G3 scale-quality |

*Sources for benchmark assumptions:* churn/PMF-method references (Sean Ellis survey convention; INMA ~4%/mo churn), retention benchmarks, and pricing anchors are sourced in 02/06; the gate thresholds themselves are the author's synthesis (⚪) — calibrate after Beta data arrives.

---

# ═══ FILE: 08-news-apps-competitive-analysis.md ═══

# 08 — News Aggregator Competitive Analysis: Plumb vs the 2026 Field

**Series:** News Aggregator Industry Deep Dive (2026-09-23) · **Document:** 08 of 11
**Target app:** **Plumb** — the concept app specified in [05-new-app-concept.md](05-new-app-concept.md) (v1 spec; not a shipped product)
**Research date:** 2026-09-24 (primary-source captures; series dated 2026-09-23)
**Replaces:** the erroneous link-in-bio competitive analysis previously filed as document 08 (archived to `independent_research/scratch/`)

**Market framing.** This report maps the 2026 consumer news-aggregator / news-reader competitive field against Plumb — a provenance-native, calm-by-design aggregator whose spec (05 §2.1–2.6) combines multi-protocol bring-your-own ingest, event clustering with source chains, a "You're caught up" hard stop, a default-2/day notification budget, verified-only breaking alerts (≥3 outlets or 1 wire), local-first SQLite/CRDT sync with E2E encryption, export-everything data ownership, zero behavioral tracking, a published shutdown plan, and honest AI (model + prompt labels, public AI register). The market it would enter is the "tool you control" stratum of news reading: paid and free readers competing for the burned power reader and the calm seeker, sitting underneath a platform-attention oligopoly (Google, Apple, MSN, Yahoo, X) and alongside an AI-native launch wave. Who buys: individuals (free tiers → $3–$15/mo personal subscriptions), teams (newsrooms, intelligence units), and — for the incumbents pivoting there — enterprises paying $1,600–$3,200/mo for intelligence tooling. The problem everyone in this stratum solves some slice of: *keep my whole reading world in one tool I trust and control, and stay informed calmly without manipulation.* Nobody solves the whole sentence; the matrix below shows exactly which slices each competitor leaves open.

Plumb's spec'd UVP, for cell-by-cell reference throughout: "Every source you trust, one calm feed, every claim traceable — and when you're caught up, it says so." Spec'd pricing: Free (unlimited feeds) / Pro $4.99/mo · $39/yr / Team ~$999/yr / B2B provenance-API access at v3.

---

## 1. Methodology

**Process.** Scope was pre-registered in the run's `00-scope.md` before any searching: direct = solves the same primary jobs-to-be-done for the same ICP (burned power reader / calm seeker); platform surfaces = indirect/structural (the distribution oligopoly documented in [01-market-map.md](01-market-map.md)). Eight parallel angle agents executed the sweep — (1) category-level recency sweep + roster cross-check, (2) Feedly + Readwise Reader, (3) Inoreader + NewsBlur + NetNewsWire, (4) Folo + OSS/indie reader cohort, (5) Ground News + AllSides, (6) SmartNews + NewsBreak + Flipboard, (7) AI-native field (Particle, Syft, Readless, Kagi News, Wisp + discovery), (8) indirect surfaces (Google, Apple, MSN, Yahoo, 1440, chatbots) — plus a ninth follow-up agent for roundup-gap products the cross-check surfaced (Feedbin, Kagi News, Current, Reeder, Inkl, Zetik, Newsreel). The lead then ran a deep-verification phase in a dedicated browser for every claim deferred by agents, read all angle notes in full, and wrote this report. Prior-run primary captures (2026-09-23, `research-news-aggregator-2026-09`) were updated, not redone.

**Recency sweep (skill §3).** Six date-stamped category queries ran before the roster locked ("news aggregator app 2026", "news reader app launched 2026", "new RSS reader 2026", "AI news app launched 2026", "news app designed to reduce doomscrolling 2026", "news aggregator startup 2026 funding"). Products appearing in 2+ contexts and not already on the candidate list were promoted to direct-competitor candidates and dived: **Current, Kagi News, Reeder, Zetik (ex-NewsBang)**; **Readwise Reader (3 roundup appearances), Feedbin (2), Inkl (2)** entered via the roundup cross-check; **Newsreel** entered via Forbes launch coverage (2026-05-15). One product appearing 2× was **excluded with justification**: FreshRSS (self-hosted server software; its consumer surface is entirely third-party clients — it defines the "own the whole pipe" end of the ownership spectrum and appears in §6 observations, but it is not a consumer-app competitor). Watchlist single-appearance items (Matter, Boring Report, Drooid, Jarayid, Quill, Techmeme, News360, the SEO-farm digest wave) are listed in §4.22 without profiles.

**Roster cross-check (skill §8).** Nine 2026 "best news/RSS apps" roundups were pulled and their tool lists tabulated (angle-01 §3): four independent (Zapier, Lifewire-via-Yahoo, MobileAppDaily, Computerworld) and five vendor-structured (readless ×3, daily.dev, Nutshell). Named by 2+ roundups and missing from our roster: **Readwise Reader (3×), Feedbin (2×), Inkl (2×)** — all three added and profiled. No other tool met the 2+ threshold without already being rostered. Google News (6×), Feedly (6×), Inoreader (5×), Apple News/SmartNews/Flipboard/NewsBlur (4×), Ground News (4×) confirmed the roster's core.

**Stale-knowledge check (skill §8).** Every "indirect" classification carries a 2026 product-page gap defense in §3.2 (e.g., Apple News: no RSS/OPML import anywhere in its 2026 documentation and no export path — a TidBITS 2026 thread documents a user losing ~4 years of saved stories; Google: no portable feed-list artifact exists, and 69% of news searches now end zero-click; 1440: zero source ownership — the reader's "feeds" are 1440's editorial choices). Where a defense could not be produced, the product was promoted or dropped — Newsreel is filed as direct-adjacent rather than indirect precisely because its Forbes framing contests the calm job even though its closed network does not contest the mechanics.

**Verification and conflicts.** Four pre-registered falsifiers were tested (verification pass on file in the run's scratch): (1) roster cross-check — fired, handled above; (2) indirect defenses — all present; (3) pricing conflicts vs the 2026-09-23 digests — five figures checked, all confirmed or corrected with the fresh page winning (Ground Vantage $99.99/yr ✓; Feedly Pro+ $12.99/mo ✓ via third-party consensus because feedly.com stopped publishing consumer pricing first-party — logged as a finding of absence; Inoreader Pro $89.99/yr ✓ exact; NewsBlur $36/yr ✓ but the ladder now extends to Archive $99/yr and Pro $29/mo; Folo Pro $999.99/yr ✓ real, not a placeholder); (4) "any 2025–26 calm/provenance launch with >100k verified users" — **none found** (Wisp 0 US ratings, Kagi News 93, Current 112 with no user numbers, Zetik 472, Newsreel 8, Boring Report 465), so [03-gap-analysis-blue-ocean.md](03-gap-analysis-blue-ocean.md)'s white-space claim survives with named-challenger caveats (§6 Obs. 1). Where sources disagree, both positions are carried side-by-side with dates — never averaged (e.g., SmartNews 20–30M company-claimed MAU vs Sensor Tower's ~5M; Flipboard's 145M MAU self-claim unchanged since 2018; Ground News traffic: Similarweb ~8M Jul-25 vs Semrush 4.09M Aug-26 = tracker spread plus real decline, with Semrush's own last three months flat at 3.89/4.46/4.09M).

**Tooling notes affecting confidence.** All external research ran through the project's research-toolkit (no built-in WebSearch/WebFetch; paywalls respected — the Forbes Newsreel article is cited from headline + snippets only). Three tooling incidents are on the record: (1) Tavily extract 401'd for the first agents of the run because the toolkit config is only found when the research folder's `driver/.env.sh` is sourced — fixed mid-run, with three agents' early fetches falling back to curl; (2) the DDG engine throttled all session, cascading searches to keyless Tavily with 429 backoffs — the main casualty is Reddit full-thread harvesting, covered by snippet-level evidence; (3) JS-walled pages (feedly.com pricing, Folo's live counters, Zetik's tier contents) were resolved by the lead's dedicated browser where load-bearing, or flagged 🟡/❓ where not. Store-rating data is US-centric unless noted. No page contained instructions addressed to an AI agent; fetched content was treated as data only.

---

## 2. Market overview

**The demand side is restructuring around the reader's distrust.** Reuters Institute's DNR 2026 marks the first year social/video networks (54%) overtook news organizations' own sites and apps (51%) as the most-used online news source globally; 30% of people now name social/video as their *main* source, and 52% of 18–24s name social/video/AI (DNR 2026). Trust keeps setting records in the wrong direction — 25% of Americans trust news most of the time, and only 20% globally trust AI-chatbot answers (DNR 2026). Google's answer layer is simultaneously absorbing the referral: zero-click news searches rose from 56% (May 2024) to 69% (May 2025, Similarweb via Digiday), AI Overviews serve 2.5B MAU (Google I/O 2026), and Chartbeat (via DNR 2026) measured Google organic-search traffic to 2,500+ publisher sites down 33% globally / 38% US over Nov 2024–Nov 2025. The result is a reader who is *served* by more news surfaces than ever and *equipped* by almost none of them — which is exactly the gap [03-gap-analysis-blue-ocean.md](03-gap-analysis-blue-ocean.md) documents as the program's opening (P1–P6 pains; failure modes: ad-load punishment, notification-as-engagement, opaque personalization, paywall-ladder confusion, provenance-invisible).

**The shelf says the same thing.** On the US App Store and Google Play "News" charts (Appfigures, Sep 2026), the top ranks are X at #1 on both stores, the White House app top-3 iOS, police-scanner alert app CrimeRadar top-5 on both, and Substack charting as a news app on both. The "News" shelf is being eaten by social platforms, alert utilities, and subscription-reading networks — while every product in this report's direct set lives below that strata. The platform oligopoly (documented fully in [01-market-map.md](01-market-map.md) and defended as indirect in §4.2) absorbs attention at billions-of-users scale (Apple News claims the #1 news app in the US/CA/AU; yahoo.com draws ~3.5B visits/month; MSN still reaches ~145–149M US visits/month even while declining ~28% YoY), but none of it is a tool the reader controls.

**The tool stratum, where Plumb would compete, splits into five live clusters:**

1. **Power-reader SaaS** — Feedly, Inoreader, NewsBlur, Folo, Readwise Reader, Feedbin. RSS-heritage, subscription-funded, feature-rich; this is where the burned power reader already pays. Its 2026 condition: the leaders are self-disrupting (Feedly has pivoted its roadmap energy to enterprise threat/market intelligence and stopped publishing consumer pricing first-party; Readwise has officially frozen Reader feature development "to focus on quality"; Inoreader removed its cheap Supporter tier; Folo's ladder now runs to a $999.99/yr consumer tier and its client ships engagement mechanics). The RSS niche itself is small and stable — ~$300M in 2024 growing ~6.3%/yr, ~50M users worldwide (vendor-sourced, low confidence) — but its users are the highest-willingness-to-pay readers in news.
2. **Trust-positioned aggregators** — Ground News ($99.99/yr Vantage gating ownership panels and factuality ratings), AllSides, inkl. These prove provenance features *monetize*; their gaps (US-frame single-label bias averaging, 2,276-outlet ownership coverage vs 50K sources, no export, no correction tracking) are Plumb's wedge depth.
3. **AI-native wave** — Particle, Syft, Zetik, Newsreel, plus 2025–26 launches Kagi News, Wisp, Current, Jarayid, Drooid. Venture- or solo-funded, cluster-and-summarize products monetizing maximalism (Particle) or agent-briefing (Zetik). AI disclosure is universally absent — no per-element labels, no public AI register anywhere in the field (§6 Obs. 9).
4. **Calm-by-design entrants** — Kagi News (one 5-minute edition/day, 12:00 UTC), Current (no unread counts, ever; content fades by type half-life), Reeder (unread counts removed in the 2024 rebuild), Readless ("no streaks, badges, or guilt UI"), Wisp ("starve the outrage machine"). The lane Plumb spec'd is being entered — but each entrant ships one calm mechanic without provenance depth or bring-your-own ingest (§6 Obs. 8).
5. **Free OSS / indie** — NetNewsWire, NewsBlur (self-host), FreshRSS, Miniflux, Reeder, Unread. The trust incumbents of exactly Plumb's Tier-A hunting ground; unbeatable on price, structurally limited on platforms (NNW is Apple-only), ingest breadth, or velocity of feature addition.

**Context that shapes the entry window.** Pocket's shutdown (2025-07-08) re-opened the read-it-later/refugee pipeline and boosted Matter, Instapaper, Raindrop and the indie alternatives (TechCrunch 2026-08-14); a 2025 VPN Tier Lists investigation found ~80% of popular RSS readers "phone home" with reading habits, IPs and feed subscriptions — poisoning the trust well precisely where Plumb's zero-tracking + shutdown-plan posture aims; and Feedbin publicly offered "6 months free to any Feedly customers switching" during Feedly's August 2026 weeklong slowdown — the incumbents are already poaching each other's refugees. Substack is the counter-trend on the open web (+27–29% YoY, ~94–96M visits, 7th-biggest US news site, Press Gazette/Similarweb Aug 2026), confirming that reader-funded, reader-owned surfaces can still grow against the platform tide.

## 3. Competitor roster

### 3.1 Direct competitors (13 profiled in §4.1–4.13; emerging cohort §4.14–4.21)

| # | Product | Vendor | URL | One-line positioning |
|---|---------|--------|-----|----------------------|
| 1 | Feedly | Feedly, Inc. (bootstrapped) | feedly.com | "AI platform for threat intelligence and market intelligence" — the former RSS leader, now an enterprise AI-intelligence vendor with a consumer reader attached |
| 2 | Inoreader | Innologica Ltd (Bulgaria) | inoreader.com | "The content reader for power users" — maximal power-tool RSS with Intelligence AI and BYOAI |
| 3 | NewsBlur | Samuel Clay (solo) | newsblur.com | "A personal news reader bringing people together" — open-source original-site reader with Intelligence Training and a rapid 2026 shipping cadence |
| 4 | NetNewsWire | Brent Simmons + community (Ranchero Software) | netnewswire.com | "The free, open-source RSS reader for Mac and iOS" — the trust baseline of Apple-only reading |
| 5 | Folo | RSSNext / Natural Selection Labs Pte Ltd (Singapore) | folo.is | "Follow everything in one place" — the Web3-adjacent open-source follow-everything reader |
| 6 | Readwise Reader | Readwise, Inc. (bootstrapped) | readwise.io/reader | "Read it later × read everything" — the burned power reader's paid read-it-all machine, now officially feature-frozen |
| 7 | Feedbin | Feedbin, Inc. (Ben Ubois, solo) | feedbin.com | "A nice place to read on the web" — typography-first reader and the ecosystem's sync backbone |
| 8 | Ground News | Snapwise Inc. (Kitchener, ON) | ground.news | "See the full picture of global events, not just one side" — bias/ownership metadata monetized at $99.99/yr |
| 9 | SmartNews | SmartNews, Inc. (Tokyo/SF) | smartnews.com | "Information that matters" — ad-funded algorithmic aggregation at claimed 20–30M MAU, IPO-track |
| 10 | NewsBreak | Particle Media Inc. (US; ex-Yidian) | newsbreak.com | "#1 local news app" — local-first ad-funded aggregation, 40M MAR self-claimed |
| 11 | Flipboard | Flipboard, Inc. | flipboard.com | "One place for all your news" — magazine-format aggregator pivoting to the fediverse |
| 12 | Particle | Mina Labs, Inc. | particle.news | "Your personalized news companion" — the Artifact-successor AI news app, highest-velocity shipper |
| 13 | Syft | Orion Arm Pte Ltd (Singapore) | syft.ai | "Your AI-native news agent" — cross-language topic-agent briefing with an aggressive IAP ladder |

**Emerging cohort (§4.14–4.21, compact profiles + compact matrix in §5.2):** Current (terrygodier.com/current), Kagi News (news.kagi.com), Reeder (reederapp.com), Inkl (inkl.com), Zetik (newsbang.ai), Newsreel (newsreel.co), Readless (readless.app), Wisp (wisp.news).

### 3.2 Indirect competitors (structural context; 2026 product-page gap defenses)

| Product | Vendor | Why indirect (2026 defense) |
|---------|--------|------------------------------|
| Google News / Discover / AI Mode | Google | No portable feed-list artifact exists anywhere in the 2026 surface — following is opaque personalization, not owned subscription lists; no OPML/RSS export path; 69% of news searches now end zero-click and AI Overviews serve 2.5B MAU. It absorbs attention; it does not solve "my sources, my tool." (angle-08 §2) |
| Apple News+ | Apple | No RSS/OPML import anywhere in 2026 documentation; closed $12.99/mo magazine bundle in 4 countries only; no export path — a TidBITS 2026 thread documents a user losing ~4 years of saved stories on a device issue. (angle-08 §1) |
| MSN / Copilot | Microsoft | Portal-style algorithmic feed absorbed into Copilot; US visits −28% YoY early 2026 (Similarweb via press); no BYO-source ingest, no export. (angle-08 §3) |
| Yahoo News + Scout | Yahoo | ~3.5B visits/mo portal reach with AI audio Morning Briefing (2026) — attention competitor, but no user-owned feeds, no provenance surface. (angle-08 §4) |
| X | X Corp. | The #1 "news app" on both US stores (Appfigures Sep 2026) — the default habit. Indirect by structure: follow-graph social platform, no feed ownership, no export, algorithmic timeline. (angle-01 §5) |
| 1440 + newsletter cohort | 1440 Media LLC | ~4.6M subs mid-2026, ~$27M rev, $101M valuation; solves "one calm email" but with zero source ownership — the "feeds" are 1440's editorial choices; cohort plateaus at 4–5M (theSkimm contracted from 7M peak; Morning Brew 4M+ stale since 2022) show the ceiling of not being a tool. (angle-08 §5) |
| AI chatbots (ChatGPT, Perplexity) | OpenAI et al. | 10% global weekly news use but flat in US/UK/FR/DE; only 20% trust chatbot answers; referrals <1%; Perplexity's publisher program (2,400+ partners) is an answer-engine, not a reader's tool. (angle-08 §6) |
| Hamilton AI | Hamilton AI Inc. | Publisher first-party AI Q&A embedded in outlets' own sites — evidence news orgs will build AI surfaces themselves (partner-risk for any aggregator's AI features), but no consumer reader product. (angle-01 §4.9) |

---

## 4. Per-competitor profiles (direct set)

### 4.1 Feedly — the leader that left the room

**Overview.** Feedly, Inc.; founded 2008 by Arthur Bodolec, Sébastien Vassaux, and Alexandre de Oliviera; bootstrapped, ~55–70 headcount (LinkedIn band vs Indeed postings). The 2013 Google-Reader-collapse beneficiary and longtime #1 name in RSS now self-describes as an "AI platform for threat intelligence and market intelligence" (feedly.com, 2026-09-24) — the homepage's only Pricing link points at `/threat-intelligence/pricing`, and consumer tier pricing is no longer published first-party (lead-browser verification, 2026-09-24; finding of absence). Consumer pricing therefore rests on third-party consensus (MED confidence): Free (100 feeds, 100 saved searches), Pro $6.99/mo · $72/yr (2,500 feeds, Leo AI, 3rd-party integrations), Pro+ $12.99/mo · $99/yr (unlimited feeds, newsletter-to-feed, annotations); Enterprise/Threat Intelligence from $1,600–$3,200/mo (feedly.com threat-intelligence pages via archive + third parties; readless ×2, SoftwareFinder 2026). 15M-user self-claim on About (2026) vs 14M claimed in 2018 press — the number barely moves while the product's center of gravity moves to enterprise.

**UVP.** "AI-driven market and threat intelligence for security and knowledge teams" (feedly.com, 2026-09-24) — the single thing Feedly now does better than anyone: enterprise-grade AI entity/tag intelligence over a big source universe. The consumer reader is retained but no longer marketed.

**Features by category** (categories 1–12 = the matrix's category set; sources inline):
1. *Ingest & protocols:* RSS/Atom/JSON Feed (JSON Feed verified via erat.org 2023, MED), Google News keyword feeds, newsletters-to-feed (Pro+), RSS-fuzzy-page scraping, 100–unlimited feed ladders (inoreader.com/pricing-tier comparison tables; readless.io/feedly-pricing 2026).
2. *Reading & calm:* clean magazine/theme views; boards & highlights for GTM workflow; **no calm architecture — no caught-up stop, no session bounds, unread-count inbox model is the product** (feedly.com product pages 2026-09).
3. *AI:* Leo the AI research assistant — prioritization, summarization, entity tracking, "less like this" feedback loops (feedly.com/ai; enterprise docs 2026); Censys integration for CTI (feedly.com blog 2026-09-17); **no model/prompt labels, no public AI register**.
4. *Provenance & trust:* none beyond source attribution; no bias ratings, no ownership panels, no correction tracking, no wire markers.
5. *Platforms & sync:* iOS, Android, web, desktop apps; account-cloud sync, no local-first, no E2E.
6. *Data ownership:* OPML export exists; API access tier-gated; no self-host; no published data-map.
7. *Extensibility:* the historic differentiator — IFTTT/Zapier/Slack/Teams integrations, API on paid tiers; enterprise API.
8. *Security:* SOC 2 Type 2 (announced 2026-07-02, feedly.com/blog); 2FA present (TOTP); history: June 2014 DDoS extortion attack, two waves, ransom refused, no data compromise claimed (Fast Company/The Hacker News 2014) — *the prior run's "2019 breach" was wrong; no 2019 incident exists.* **August 2026: weeklong consumer slowdown/outage + data-fetch failures, TechCrunch coverage 2026-08-17.**
9. *Monetization:* free 100 feeds; Pro/Pro+ as above; enterprise ladder $1.6k–$3.2k/mo — the consumer tiers are now the tail of the business.
10. *Notifications:* digests, saved-search alerts; no budget concept.
11. *Traction:* 15M users self-claimed (About, 2026) vs 14M (2018 press) — 🟡 self-reported, flat-by-increment; store ratings modest vs algorithmic apps (US iOS ~4.8★/…; count not load-bearing this run).
12. *Company & independence:* bootstrapped and independent — but the roadmap's center of mass is enterprise CTI/market-intel; consumer maintenance mode is the 2026 reality (Aug-2026 outage handling criticized; pricing pages pulled).

**Plumb-relevant gaps.** No calm architecture, no provenance layer, no AI disclosure, consumer features in maintenance mode, and the August 2026 outage handed every consumer power-user a switching reason — Feedbin publicly offered "6 months free to any Feedly customers switching" during it (feedbin.com, Aug 2026).

### 4.2 Inoreader — the power tool

**Overview.** Innologica Ltd, Plovdiv, Bulgaria; founded 2012 by Yordan Yordanov (CEO) and Ivo Janevski; ~20–40 staff. The "everything and the kitchen sink" reader: the broadest ingest matrix, the deepest rules/filters system, and — new in 2026 — BYOAI. Free tier: 150 feeds + 20 newsletters + 20 web pages, **with ads in the free web/app**. Pro $89.99/yr ($7.50/mo annual · $9.99 monthly): 2,500 feeds, Intelligence AI (1M tokens/mo), unlimited rules. Team tier for shared reading. The cheap $20/yr Supporter tier was removed from public pricing in 2026 (legacy renewals only) — a price-floor rise for exactly Plumb's ICP. (inoreader.com/pricing + features, 2026-09-24.)

**UVP.** "The content reader for power users who want to monitor everything" (inoreader.com) — nobody else matches its rules engine + monitoring breadth; it is the monitoring console to Feedly's intelligence platform.

**Features by category:**
1. *Ingest:* RSS/Atom/JSON Feed, Google News keywords, social feeds, newsletters, web-page monitoring (XPath-style), YouTube channels, podcast feeds — broadest in the established set; polling on free ≥1×/hr (inoreader.com; help.inoreader.com 2026).
2. *Reading:* list/magazine/card views, full-text search, rules & filters (the killer feature: auto-mark-read, tag, notify, star on complex predicates), reading statistics; classic unread inbox, **no calm mechanics**.
3. *AI:* Intelligence AI (summaries, Q&A over feeds, 1M tok/mo Pro); **BYOAI since 2026-04-14** (bring your own OpenAI/Anthropic/etc. key — the most reader-friendly AI-cost posture in the established set); no AI-disclosure labeling.
4. *Provenance:* none — no ratings, ownership, or corrections surfaces.
5. *Platforms:* web, iOS, Android, desktop apps (Windows/macOS/Linux via wrappers); cloud sync.
6. *Data ownership:* OPML in/out; API is **Pro-only**; no self-host.
7. *Extensibility:* API + webhooks + push services (Pro+ heritage); IFTTT/Zapier.
8. *Security:* **the posture leader of the established set — ISO 27001, ISO 9001, PCI DSS attested, passkeys/WebAuthn, 2FA** (inoreader.com/security + blog 2025–26); no public breach history found.
9. *Monetization:* free-with-ads / Pro $89.99 / Team; no lifetime options.
10. *Notifications:* rich — push, email digest, webhooks on rules; Smart Folders as monitoring alerts; **no budget concept; notifications are a power feature to maximize, not bound**.
11. *Traction:* no official MAU; ~"millions of registered users" marketing-adjacent claims only (🟡); changelog velocity extremely high (2026-09-21 release notes) — the fastest-shipping established consumer reader (inoreader.com/blog).
12. *Company:* independent, profitable-ish (bootstrapped, Bulgarian dev-cost base), no VC; consumer-focused roadmap still visibly active.

**Plumb-relevant gaps.** Zero provenance and zero calm — Inoreader optimizes the *monitoring* job, not the *informed-calmly* job; free tier carries ads; API paywalled. Its BYOAI and ISO/passkey posture are the bars Plumb should clear on AI-cost honesty and account security respectively.

### 4.3 NewsBlur — the solo shipping machine

**Overview.** Samuel Clay, solo founder-operator, San Francisco; founded 2010; open source (MIT) since inception — 7,627★ on GitHub (2026-09-24), self-hostable; freemium SaaS at newsblur.com. Free: 64 sites, 10 stories/feed in river. Premium $36/yr: 1,024 sites, unlimited river. **Premium Archive $99/yr: 4,096 sites + the 2026 feature wave.** Premium Pro $29/mo (launched 2026-04): 10,000 sites, 5–15 min fetch, priority support. (newsblur.com/pricing, 2026-09-24.) The prior run's "just $36/yr" framing is stale — the ladder now ends at $348/yr-equivalent.

**UVP.** "A personal news reader that brings people together" with per-feed machine-learning training — the original (and still only established) Intelligence Training model: thumbs-up/down per feed/tag/author/publisher trains the story classifier. (newsblur.com.)

**Features by category:**
1. *Ingest:* RSS/Atom, text/origimg extraction from original sites, hidden-gem feeds; 64→4,096 site ladders; no newsletter ingest or social protocols (ActivityPub/Mastodon) as first-class feeds.
2. *Reading:* the trained river + per-feed views; **story clustering shipped 2026-03-18 (Archive tier)**; Daily Briefing (AI, Archive); multiple themes; the strongest "read the original" ethic (original-text extraction).
3. *AI:* **Ask AI on Claude/GPT/Gemini/Grok (Archive tier, 2026)** + AI Daily Briefing + Web Feeds LLM extraction — the fastest AI shipping among the reader-natives; **no AI labeling/register disclosure**; model choice is exposed, which is partial honesty.
4. *Provenance:* source-level only; no ratings/ownership/corrections.
5. *Platforms:* web + iOS + Android; self-host (Docker); sync via account.
6. *Data ownership:* OPML in/out; **self-hostable — the only established-set consumer reader where the whole pipe can be yours**; MIT client+server.
7. *Extensibility:* **the 2026 bar-setter: an MCP server (HTTP/OAuth) + newsblur-cli v0.2.2** — agent-friendly reader operations nobody else ships; API long public.
8. *Security:* ❌ **2FA absent — GitHub issue #1647 "Add two-factor authentication" open since 2022-03-13, still unresolved (2026-09)**; no breach history; solo-operator bus factor is the structural risk.
9. *Monetization:* freemium ladder $0/$36/$99/$29-mo — consumer-first, no ads anywhere.
10. *Notifications:* per-feed push, iOS/Android; saved-search alerts; no budget concept.
11. *Traction:* no MAU disclosure; 25+ substantive blog posts Jan–Sep 2026 and visible release velocity = the busiest roadmap in the reader-native set (newsblur.com/blog).
12. *Company:* one person. Independence total; durability is the question (bus factor 1), though 16 years of continuous operation and OSS mitigates (community could fork).

**Plumb-relevant gaps.** Clustering + AI + MCP is the closest functional overlap with Plumb's spec in the established set — but it is Archive-tier-gated ($99/yr), carries no provenance layer, no calm architecture, no AI disclosure, and no 2FA. NewsBlur validates Plumb's feature set; it doesn't occupy it.

### 4.4 NetNewsWire — the free baseline

**Overview.** Brent Simmons (Ranchero Software) + community contributors; the open-source Mac+iOS RSS reader; MIT; 10,406★ at Ranchero-Software/NetNewsWire (2026-09-23 push; the old org path 404s — prior-run repo link corrected). Current: 7.1.4, 2026-09-20. Free forever; no paid tier; no ads; no telemetry. Mac (macOS 15+) and iOS (iOS 26+) only. (netnewswire.com; GitHub.)

**UVP.** "Free and open source, fast, and native" — the trust baseline: the reader you run when you want zero entities between you and your feeds. Simmons: "we don't want any private information" (netnewswire.com/privacy-ethos).

**Features by category:**
1. *Ingest:* RSS/Atom/JSON Feed; WebSub instant push; Twitter/Reddit script feeds via community extensions; OPML import.
2. *Reading:* strict chronological, absolutely; smart feeds; articles theme; **no AI, no notifications, no rules engine** — a deliberate minimalism ("boring tech" ethos).
3. *AI:* none, on principle.
4. *Provenance:* none (source-level trust by construction).
5. *Platforms:* Mac + iPhone/iPad; Apple-only; **iCloud sync (flaky per community reports) or Feedbin/NewsBlur/Inoreader/FreshRSS sync accounts**.
6. *Data ownership:* local-first SQLite under the user's control — the gold standard until export UX: **starred-items export requires digging into SQLite (community-documented gap)**; OPML out.
7. *Extensibility:* extensions system (macOS), open source, Feedbin-sync client ecosystem citizen.
8. *Security:* no accounts (iCloud path), no telemetry, OSS audit; no 2FA concept (❓ n/a).
9. *Monetization:* free; Simmons' blog documents the choice not to monetize.
10. *Notifications:* none (2026 apps still without push — a deliberate scope choice).
11. *Traction:* 10.4k GitHub stars, MacStories-famous, Apple-ecosystem niche leader; no user counts (❓ n/a — no telemetry).
12. *Company:* community project with one benevolent lead; 20+ year lineage (NetNewsWire roots 2002); zero shutdown-profit-motive.

**Plumb-relevant gaps.** NNW cannot be undercut on price or trust, and doesn't need to be: it is Apple-only, feature-minimal (no clusters, no notifications, no newsletters/social, no Android/web), and sync-dependent on third parties. Plumb's Tier-A hunt (03's "disillusioned power reader") will cross-shop NNW — the wedge is breadth + calm mechanics + provenance on top of the same trust posture, cross-platform.

### 4.5 Folo — the open-source follow-everything machine with Web3 gravity

**Overview.** Folo (ex-Follow.is), by RSSNext / Natural Selection Labs Pte Ltd, Singapore — the Web3/RSS3 parent (Sky9 + Mask Network 2021 round). AGPL-3.0 **client-only** (backend closed — issue #2178 open); 39,012★ on GitHub (plateaued); ~29.83M cumulative release-asset downloads with hard decay (v1.14.0 Sep 2026: ~3.1k direct downloads in 6 days vs 1.22M/release mid-2025); Play 10K+ installs; iOS 53 US ratings (4.09★); Discord 16,905 members. Pricing (embedded plans JSON, folo.is/pricing 2026-09-24): **Free $0 (150 subscriptions) / Basic $4.99-mo · $49.99-yr / Plus $9.99-mo · $99.99-yr / Pro $99.99-mo · $999.99-yr** — the $999.99/yr tier is real, not a placeholder (prior-run disbelief corrected). Landing page displays license "GPL-3.0"; the repo is AGPL-3.0 — their own marketing understates the copyleft.

**UVP.** "Follow everything in one place" — RSS, social platforms, podcasts, YouTube, images, with built-in AI and an engagement economy on top. The only open-source client with modern social-ingest breadth.

**Features by category:**
1. *Ingest:* the widest protocol sweep: RSS/Atom/JSON Feed + **built-in RSSHub routes (Twitter 24, YouTube 13, Mastodon 7, Bluesky 6, TikTok 5; reddit 0)** + newsletters (email-in) + more; list/entry/media view modes per feed.
2. *Reading:* view modes (social/article/picture/video/audio); **no unread-count removal or calm mechanics — engagement-oriented defaults**.
3. *AI:* integrated summarization/translation/rewriting with **BYOK (bring your own key) + MCP services + custom fetch-template integrations** — technically the most extensible AI surface; **no AI disclosure/labels**.
4. *Provenance:* **feed-claim system** (creators claim feeds, identity-verifiable) — the only provenance-adjacent feature in the direct set; no ratings/ownership/corrections.
5. *Platforms:* Windows/macOS/Linux desktop + web + iOS + Android; account sync.
6. *Data ownership:* OPML in/out; **telemetry (PostHog + Firebase) DEFAULT ON** — `sendAnonymousData: true` in defaults.ts (repo, 2026-09) with opt-out — the VPN-Tier-Lists "80% of RSS readers phone home" finding made concrete in the OSS-labeled cohort.
7. *Extensibility:* Actions (rule engine), integrations with custom templates, BYOK AI, **MCP services** — second only to NewsBlur.
8. *Security:* OSS client (auditable), closed backend (not auditable); no 2FA surface found; Web3 wallet integrations add attack surface.
9. *Monetization:* the 4-tier ladder above plus **Web3 monetization: Power points, tipping, RSS3 token withdrawal, Boosts ×10/×100 = "Feed Refresh Acceleration"** — engagement mechanics fused with payment.
10. *Notifications:* standard per-feed push; no budget.
11. *Traction:* star plateau + download decay + modest store counts = **a large window-shopper base that isn't converting to retained installs** (🟡 inference from decay curve; stated as read, not fact).
12. *Company:* VC-adjacent (Sky9/Mask), Singapore; OSS brand with closed backend and token economy — the trust posture Plumb's covenant contradicts point-by-point.

**Plumb-relevant gaps.** Folo proves appetite for modern multi-protocol ingest + extensible AI — and simultaneously demonstrates the trust ceiling of telemetry-default-on, engagement-token mechanics. The spec's §5 "follow.app community" row is stale (follow.app dead; this cohort is Folo's) — flagged for the spec's next revision.

### 4.6 Readwise Reader — the paid power reader, officially frozen

**Overview.** Readwise, Inc.; founders Daniel Doyon (CEO) + Tristan Homsi (CTO); bootstrapped, profitable, SF. Reader: the "read-it-later × read-everything" supersystem built on the Readwise highlighting backend. Pricing: **Full $9.99/mo (annual billing) · $12.99 monthly; no free tier; 30-day trial; "lock in your price for life" grandfathering** (readwise.io/pricing, 2026-09-24). In 2025–26 the company publicly deprioritized Reader: an official Reddit reply on r/readwise states they are "intentionally ignoring feature requests… to focus on quality and performance" — a documented feature-freeze admission. API v3 public.

**UVP.** "Every word you read, saved and searchable forever" — the only reader whose moat is longitudinal memory (highlights, annotations, spaced repetition) rather than feed processing.

**Features by category:**
1. *Ingest:* RSS, newsletters (email-in), EPUB/PDF/web-docs save-later, YouTube (with transcripts), podcasts (snips), Twitter/X lists — the save-everything pipeline (readwise.io/reader).
2. *Reading:* excellent typography modes, Ghostreader inline AI, highlight-anywhere, spaced-repetition resurfacing — **maximalist by design; zero calm mechanics** (the corpus is infinite by intent).
3. *AI:* Ghostreader (summary/Q&A/chat-with-doc, on GPT-4-class models — model not labeled per element); no disclosure register.
4. *Provenance:* none beyond source capture fidelity.
5. *Platforms:* web + iOS + Android; cloud sync; no desktop app; **no E2E**.
6. *Data ownership:* exports (highlights/docs, API v3) — genuinely good; **no 2FA** (official Reddit reply: optimizing "user experience over enterprise compliance" — lead-verified quote, r/readwise).
7. *Extensibility:* public API v3; webhooks; Obsidian/Notion/logseq export pipelines — strong.
8. *Security:* no 2FA, no E2E, no SOC 2/ISO published; no breach history found (🟡).
9. *Monetization:* single expensive tier, no free — **the highest personal-tier price among reader-natives**; "price for life" lock-in marketing.
10. *Notifications:* digests (daily review email) — engagement-positive, not bounded.
11. *Traction:* no user numbers published (🟡); large loyal base evidenced by subreddit/culture; freeze admission is the 2026 signal.
12. *Company:* independent, bootstrapped, profitable — durable, but the flagship product is in deliberate stasis while the founders chase quality/polish and the Readwise core.

**Plumb-relevant gaps.** The burned power reader's two paid homes (Feedly $99/yr+, Reader $120+/yr) are respectively pivoting away and freezing — at exactly Plumb's price band ($39–60/yr) and feature set. Reader's memory-moat (highlights, resurfacing) is the one thing Plumb's spec doesn't counter; its freeze is the switching window.

### 4.7 Feedbin — the backbone

**Overview.** Feedbin, Inc.; Ben Ubois, solo, bootstrapped since 2013 (launched the day before Google Reader's shutdown announcement); open source (self-hostable) since 2013-08-27. Single tier: **$7/mo · $70/yr, 30-day trial** — simple, famous, stable. No user numbers ever published (❓). (feedbin.com; feedbin.com/blog.)

**UVP.** "A nice place to read on the web" — typography-first, ad-free, subscriber-funded reading with the ecosystem's most-reimplemented API. The reader other readers sync through.

**Features by category:**
1. *Ingest:* RSS/Atom, **newsletters via per-newsletter unique addresses (privacy mechanism)**, podcasts (Airshow app), YouTube channels, Mastodon accounts; OPML import. (feedbin.com; feedbin.com/blog 2025–26.)
2. *Reading:* clean typography ("hand-picked fonts"), dark mode, full-content Pages (login-walled pages via extension); classic unread model — no calm mechanics.
3. *AI:* none shipped (a deliberate quiet).
4. *Provenance:* by construction (you see exactly your feeds; newsletter addresses reveal who sold you out — accidental provenance tooling).
5. *Platforms:* web + iOS (official) + Airshow (podcasts); **sync backbone for NetNewsWire, Reeder Classic, Unread, ReadKit, Enzo (visionOS)** (feedbin.com/apps).
6. *Data ownership:* **open source + self-hostable + OPML/API export — the ownership ceiling of the hosted set**.
7. *Extensibility:* **REST API v2 = the de-facto client standard** of the indie-reader ecosystem (api.feedbin.com; github.com/feedbin/feedbin-api).
8. *Security:* HTTPS-only API; minimal-permission browser extension; no 2FA surface found (❓); no breach history.
9. *Monetization:* one fair price, no ladder, no ads — the anti-Folo/Ground pricing posture.
10. *Notifications:* not surfaced this run (❓).
11. *Traction:* 13 years continuous + 6+ native third-party clients = durable niche; scale unknown by choice.
12. *Company:* one person (bus factor 1, again — but OSS + self-host mitigates); August 2026's "6 months free for Feedly refugees" promo shows active opportunism.

**Plumb-relevant gaps.** Feedbin is less a competitor than infrastructure Plumb's ICP respects — and a cautionary pricing ceiling: $70/yr with no AI and no provenance is the reference price for honest, minimal reading. Plumb's pitch against it: same covenant, plus clustering, provenance, calm mechanics, and AI with labels — at roughly half the annual price.

### 4.8 Ground News — provenance monetized, provenance contested

**Overview.** Snapwise Inc., Kitchener, Ontario; founded 2017–18 (About says 2017, Wikipedia 2018-04-27 — conflict carried); founders Harleen Kaur (CEO, ex-NASA New Horizons, ex-Rolls-Royce VP) and Sukh Singh (CTO); ~18 employees (About, Sept 2026) vs 29 (Datanyze) vs LinkedIn 51–200 band — conflict carried. Lifetime funding ~$1.01M per PitchBook via Revenue Memo (2026-08-18, unconfirmed), from 8 named individuals — including J. Joe Ricketts, which fuels a persistent "right-wing psy-op" narrative (Literate Machine essay, Aug 2026, ~671K video views). Scale claim: "over 50,000 different news sources," ~60,000 articles/day — self-reported. Web pricing (subscribe page, 2026-09-24): **Vantage $99.99/yr ($8.33/mo annual-only)**; affiliate price $59.99/yr teaches buyers never to pay list. Mobile IAPs: Vantage $9.99-mo/$99.99-yr; Premium $3.99-mo with Premium Yearly listed at **three simultaneous legacy price points ($29.99/$39.99/$49.99)**; Pro $0.99-mo/$9.99-yr.

**UVP.** "See the full picture of global events, not just one side" — per-story coverage comparison across the spectrum with bias/ownership/factuality metadata layered on (ground.news/subscribe).

**Features by category:**
1. *Ingest:* topics/interests/outlets, Local (set location), 5 regional editions; **no RSS/OPML, no newsletters, no user-added sources** — strictly their 50K corpus filtered (help.ground.news 866177).
2. *Reading:* story-cluster comparison view with Bias Bar; Bias Comparison Summary (L/C/R per story); Blindspot feed + weekly report (formula published); "In Focus"; Daily Digest; podcasts & opinions with AI summaries; **no chronological mode, no caught-up stop, offline explicitly unsupported** (help 335105/225473).
3. *AI:* AI-generated bias-comparison summaries with "human-in-the-loop" claimed; NLP clustering; **no model names, no prompt disclosure, no AI register** (help 3189505).
4. *Provenance:* the flagship — but structurally compromised: bias = **average of AllSides + Ad Fontes + MBFC "when available," publication-level, verbatim "in the context of the U.S. political system"**; factuality = Ad Fontes + MBFC average, paywalled; ownership = 8 hand-coded categories covering **2,276 outlets vs the 50K corpus**; no correction tracker, no "why am I seeing this," no wire markers. US 61.29% of traffic; party colors were US-default until the v4.32 Aug-2026 patch; no foreign-language filter exists (help admits). (rating-system page; Semrush Aug 2026.)
5. *Platforms:* web + iOS + Android + browser extension (Media Bias Checker on social links) + newsletters; no desktop app.
6. *Data ownership:* **no export anywhere**; data deletion via a form separate from cancellation; "no ads / no data selling" (privacy FAQ) **but Google Tag Manager + Sentry ship on the web app** — "no ad-tech" is the accurate claim, not "no analytics."
7. *Extensibility:* no public API; group subs (40–50% off), education, B2B data deals (Straight Arrow News "Media Miss").
8. *Security:* **no 2FA/passkey feature or help article found**; impersonation-scam warning exists (their brand is being spoofed).
9. *Monetization:* the provenance ladder itself: free (6 Blindspot/day) → Pro → Premium → Vantage ($99.99/yr gates ownership panel + bias dashboard).
10. *Notifications:* alerts + daily-update toggle + digest push (v4.31); **no budget concept.**
11. *Traction:* 4.7★/48,070 US App Store ratings; #2 Magazines & Newspapers; Semrush 4.09M visits Aug-2026 (−8.36% m/m; last three months 3.89/4.46/4.09M — a flat 4–4.5M band, **not the "halving" the prior run rejected**; the ~36–40% Similarweb-vs-Semrush gap is tracker spread + real decline, stated side-by-side); most-sponsored brand on YouTube (1,863 integrations, Axios/Gospel Stats Oct 2025); subscribers undisclosed.
12. *Company:* independent, small, mission-marketed — but CJR documents Ground using AllSides ratings without permission or pay (MBFC no agreement either): **the provenance of the provenance tool is contested**, and the rater-licensing gap it exposes is a live B2B opening for Plumb.

**Plumb-relevant gaps.** Ground is the incumbent proof that provenance features monetize — and the incumbent demonstration of provenance done shallowly: one averaged US-frame label, a 2,276-outlet ownership panel sold against a 50K-source corpus, no corrections, no export, no offline, no 2FA, no calm. Plumb's raters-side-by-side + global frame + correction tracking is the direct counter-design.

### 4.9 SmartNews — the engagement ratchet, gamified

**Overview.** SmartNews, Inc.; Tokyo (Shibuya) HQ, Palo Alto US office; founded 2012; CEO Kaisei Hamamoto (since Nov 2023); ~$410–479M raised including $69.3M SMBC venture debt (Jan 2024); last equity round Series F 2021 ($230M @ $2B — the prior run's "Series D" framing corrected); secondary-market value ~¥200–213B (~$1.3–1.4B); first US-segment quarterly operating profit Q3 2025, first full-year FY2025 (Toyo Keizai). **IPO: October-2026 TSE target reported by Bloomberg 2026-03-25 — still unfiled as of 2026-09-24 (EN+JP sweep); treat as lapsed/unconfirmed.** Free, ad-supported (~85–90% of revenue); Japan-only SmartNews+ ¥1,480/mo (100k cumulative subs, 2025-07-23); **US "Ads-Free Subscription Plan" live (terms dated 2024-10-15), price shown in-app only (❓ — App Store IAP list JS-walled)** with ad exceptions written in (third-party publisher ads, sponsored content still appear). Google Play: 50M+ downloads.

**UVP.** "We combine the best of quality journalism with expert curation to help you stay informed — and feel good while doing it" (Play listing, 2026-09-24) — plus US TikTok marketing: "news with no paywalls from over 4,500+ publishers."

**Features by category:**
1. *Ingest:* follow channels/topics/outlets; tab customization; **no user-added RSS** — RSS exists only as publisher-side SmartFormat ingestion (about.smartnews.com/publishers).
2. *Reading:* SmartView de-cluttered quick-read format (>75% of partners); algorithmic channel feeds; **no chronological mode documented anywhere**; complaints: back-out refreshes feed to top, blocked topics reappear (Play reviews 2026).
3. *AI:* AI Matome gen-AI summaries (Jul–Aug 2025), standalone NewsArc AI long-form app (2025-08-05), in-app ES/ZH translation (2026-07-16) — the spec's §2.3 translation-demand validation; **zero AI disclosure.**
4. *Provenance:* none — brand-level trust marketing (Trustmark Award 2026) instead of structural provenance.
5. *Platforms:* iOS/Android/web; US+JP (+ more) editions after the 2023 China exit.
6. *Data ownership:* no export surface.
7. *Extensibility:* none consumer-facing.
8. *Security:* ad-tech business (SmartNews Ads, 64 agency partners 2026); no 2FA surface found; no breach history found this run.
9. *Monetization:* ads-first; **SmartNews Rewards (US, 2026-03-25): points per article + daily reading missions redeemable for gift cards/charity — "first of its kind in the U.S." — then the daily goal was raised 30→75 articles/day and users revolted in reviews.** The literal gamification datapoint for Plumb's anti-position.
10. *Notifications:* breaking + per-topic + per-team pushes; complaints of notifications leading to nonexistent/mismatched stories; **no budget, no corroboration gate.**
11. *Traction:* company claims 20–30M MAU; Japan ~15–20M plateauing (NewsPicks analyst); **Sensor Tower ~5M worldwide MAU, −28–30% YoY (2023)** — conflict carried side-by-side; US weekly reach 3% (−3pp, DNR-derived carry; chart extraction failed twice); revenue conflicts $104.5M vs $163.8M (GetLatka variants) vs ¥20–30B.
12. *Company:* VC-heavy, IPO-aspirant, ad-fundamental — the structural opposite of Plumb's covenant, and the ads-every-2-3-articles / unclosable-countdown / phishing-quality-ad complaints (Play 2026) are the demand signal for Plumb's calm lane.

### 4.10 NewsBreak — the cautionary tale running at scale

**Overview.** Founded 2015 by Jeff Zheng (CEO); trade name **Particle Media**; HQ Mountain View with New York, Beijing and Shanghai offices; Yidian (Chinese news aggregator) early investor, divested 2019; **Harry Shum (ex-Microsoft AI & Research EVP) chairman since 2020**; $115M Series C (Jan 2021, Francisco Partners) in the ~$1B-valuation era; US-only availability. Free, ad-supported; **no consumer subscription tier found anywhere** — monetization is advertising (advertiser pitch: "Reach more than 40 million users") plus local-business products.

⚠ **Name-collision warning for any Plumb competitive intelligence:** NewsBreak's Play developer name is "Particle Media Inc." — unrelated to Particle (Mina Labs, §4.12). The two products occupy opposite ends of the trust spectrum and must never be conflated in sourcing.

**UVP.** "The nation's leading local news app... News by your zipcode... All in one place" (newsbreak.com/about, 2026-09-24) — local-first aggregation plus original content "powered by trusted local voices."

**Features by category:**
1. *Ingest:* zipcode/location feed + granular local topics; no RSS import; publisher syndication + contributor UGC + proprietary local content ops.
2. *Reading:* explicit behavioral personalization ("learns what you love... responds to your choices and reading habits"); no chronological mode; no export.
3. *AI:* **NBot agentic assistant (beta, 2025-05-29)** — "doesn't just inform, it enables action... learns what matters to each user and adapts in real time" across "10,000+ trusted content sources"; conversational neighborhood guide (crime maps, traffic, events), custom story tracking. *(Corrects the task brief's "Aria" — that's Opera's AI.)* Also: AI content generation at the center of the 2024 misinformation record.
4. *Provenance:* none structural — brand claims plus a homepage disclaimer added **after Reuters' inquiry** that content "may not always be error-free"; NewsGuard rates the property externally.
5. *Platforms:* iOS/Android/web; US-only.
6. *Data ownership:* no export; **CCPA "Don't Sell My Info" link implies data sale by default.**
7. *Extensibility:* none consumer-facing.
8. *Security:* standard; lawmaker scrutiny (Sen. Warner; Rep. Krishnamoorthi, House China committee) over Chinese origins and "opaque algorithms" (Reuters 2024-06-08).
9. *Monetization:* pure ad/local-SMB; store ratings 4.7★/773k (iOS), 4.2★/330k (Android) — enormous review bases.
10. *Notifications:* the marketing itself: "You're first to know when news breaks — timely alerts and push notifications" + "Stay alert, stay safe — immediate access to local crime and police alerts." **This is the firehose/crime-alert pattern Plumb's spec §2.5 names its "verified-only breaking (≥3 outlets or 1 wire)" rule against.**
11. *Traction:* **three simultaneous self-claims on one site — "50M readers" (consumer page) vs "40M+ users" (advertiser page) vs "45M+ locals" (Play ad)** — none third-party verified; Reuters 2024: "most downloaded US news app" (download-rank metric); 32.2M US web visits Aug-2025 (prior-run carry).
12. *Company:* the documented failure mode of unaudited AI in news: **Reuters 2024-06-05 — 40+ erroneous AI-generated stories 2021–2024, including the entirely-fabricated Bridgeton NJ Christmas-Eve shooting and a food-bank misinformation item that turned hungry people away**; NBC-documented contributor fake-crime stories linked to GoFundMe pages for nonexistent victims; Patch Media $1.75M copyright settlement (2022); Emmerich Newspapers settlement (2021). Plumb's honest-AI register is the direct structural answer to this record.

### 4.11 Flipboard (+ Surf) — the magazine pivoting to the open web

**Overview.** Flipboard, Inc.; founded 2010; Mike McCue co-founder/CEO throughout; independent. The "social magazine" — visually curated publisher magazines — now executing a three-year pivot to the open social web: Mastodon beta in-app (2023-02-28) → 1,000+ publisher magazines federated on ActivityPub with 20 new partners incl. Smithsonian, Bloomberg Green, The Intercept, Mashable (2024) → **Surf launched 2024-12-18** (invite-only open-social-web browser: ActivityPub/Mastodon/Pixelfed/PeerTube + Bluesky AT-Proto + Threads + RSS + YouTube + podcasts) → Starter Sets feed templates (2025-05-22) → "social websites" (2026-04-03). Surf still carries its BETA badge at 550,267,541 posts / 300,235 feeds (2026-09-24). Free; **no paid tier found for either product** (absence-of-evidence, MED confidence). Layoffs: 24 staff = 21% (Axios via Nieman, Oct 2022; some coverage dates Mar 2023 — ambiguity carried) with McCue's email citing "the bad economy and tough outlook for the digital ad business."

**UVP.** Flagship: the flip-through social magazine. Surf: **"algorithm-free feeds"** — "Instead of getting stuck in an algorithmically generated timeline... custom feeds" (TechCrunch 2025-05-22) — the nearest neighbor to Plumb's values among the mass trio.

**Features by category:**
1. *Ingest:* flagship = topics/publishers/smart magazines (arbitrary user RSS weak — dropped years ago; full OPML import not offered; 🟡/❓ help pages JS-walled); **Surf is RSS-native plus social protocols.**
2. *Reading:* magazine flip UI (the original calm-format design — complaints are about ads, not feed anxiety); Surf adds per-source topic filtering ("track what they have to say about tech").
3. *AI:* none marketed in 2026 captures — Surf's anti-algorithm positioning is explicitly non-AI.
4. *Provenance:* none at article level; protocol-level openness (federation, publish-to-Bluesky) is structurally provenance-adjacent.
5. *Platforms:* iOS/Android/web both products.
6. *Data ownership:* no OPML/export surface found this run (❓); federation reduces walled-garden capture structurally.
7. *Extensibility:* none consumer-facing (the fediverse pivot IS the extensibility story).
8. *Security:* standard; no 2FA surface captured.
9. *Monetization:* advertising — with a 2025–26 quality collapse in reviews: Amazon tie-up "every third or fourth flip... opens a new browser window"; Temu "suggestive... almost pornographic" ads with ignored reports; X-buttons that open the ad anyway.
10. *Notifications:* no push complaints surfaced; no budget feature documented (❓).
11. *Traction:* **the 145M MAU figure is Digiday 2018-08-27 — eight years stale; current MAU unknown** (Forbes McCue interview Oct 2025 unfetchable, snippets show no number); Surf counters are content-side only. The most-quoted number in the category is also the oldest.
12. *Company:* independent, mission-led, ad-fundamental — Surf's values-proximity with zero provenance/calm/monetization makes it the most likely acquirer-partner or lane-neighbor for Plumb's protocol posture.

### 4.12 Particle — the AI-native leader, maximalist by design

**Overview.** Mina Labs, Inc.; Sara Beykpour (CEO, ex-Twitter Sr Director PM — Twitter Blue/Video) and Marcel Molina (CTO, ex-Twitter eng, ex-Tesla); $4.4M seed (Kindred+Adverb, 2023) + $10.9M Series A (Lightspeed + Axel Springer, Jun 2024, with Reuters newswire partnership) = **$15.3M total; no new round found 2025–2026.** iOS Nov 2024 (Apple Editors' Choice) → web May 2025 → Android Feb 2026. **Particle+ $2.99/mo · $29.99/yr** (Custom Summaries, Voice Choice, Private Questions, crossword archive, icons); free tier "usable/generous" (Wisp's disclosed-conflict review).

**UVP.** "Your personalized news companion" — multi-perspective AI story cards (Overview/Media/Articles/Quotes/Questions tabs, Opposite Sides, political-spectrum chart of covering outlets, ELI5/5Ws summary styles, TTS, podcast-clip extraction) — the Artifact-successor with the field's best-funded execution.

**Features by category:**
1. *Ingest:* follow topics/people/places/entities/journalists/publishers + curated sections + live-event hubs; **no RSS import, no OPML, no user-chosen sources** — follow-graph + publisher APIs (Reuters, AFP, Fortune).
2. *Reading:* cluster cards with per-story multi-article view; **no chronological mode, no caught-up/calm concept** — third-party critique: "'Personalized' still tends toward engagement… Depth and calm are adjacent but not identical goals"; "can feel like managing a dashboard... configuring a cockpit" (Wisp review 2026-08).
3. *AI:* GPT-4o "among others" + proprietary processing + human editors (Nov-2024 press; **no public update since — the stack disclosure is frozen in 2024**); story-level Q&A chatbot with web-sourced evidence; multilingual summaries (19 languages); **AI disclosure: none — /faq, /methodology, /ai, /how-it-works, /publishers all 404**; robots.txt *welcomes* GPTBot/OAI-SearchBot/Applebot into /answers/ while excluding bing/ddg from /entity/ — deliberately feeding LLM answer engines.
4. *Provenance:* strongest-in-field commercial implementation: every summary cites sources, primary-source links (court docs, posts), author profiles; **no outlet-ownership panel, no correction tracker**; "unusually transparent with sources; you still have to care enough to check them" (Wisp).
5. *Platforms:* iOS (min iOS 18 — aggressive floor), Android, web.
6. *Data ownership:* **web app serves an ad-tech cookie banner — "personalized advertisements on other platforms... advertising, analytics and retargeting" — on the flagship web product**; no export feature anywhere.
7. *Extensibility:* none public.
8. *Security:* standard policy pages; no threat model/SBOM/bounty.
9. *Monetization:* $2.99/mo Particle+ — the cheapest meaningful AI subscription in the field; free tier generous.
10. *Notifications:* daily digest + instant "making news" alerts on followed entities — engagement-style push, no budget.
11. *Traction:* **zero user numbers anywhere — no MAU/DAU/revenue ever published; the absence IS the finding** ("the leading AI news app" publishes no traction); proxies: 4.76★/1,236 US iOS ratings, 4.4★/82 Play (vs Yahoo News's 68,543 US ratings — 55×); Editors' Choice.
12. *Company:* VC-backed ($15.3M), highest velocity in the AI-native field (releases 2026-09-15/17, podcast AI + Android Feb 2026, live-event surfaces), Reuters/Axel Springer partnerships — and ad-tech retargeting on web plus an all-404 methodology layer.

### 4.13 Syft — the agent ladder

**Overview.** Orion Arm Pte Ltd, Singapore (also Toki AI calendar); founders Raymond Wang (ex-Ele.me co-founder) + Haochuan Guo; **$11M raised at $100M valuation (Jun 2025, mostly non-VC) — for the Toki product; no Syft-specific round exists**; stated ambition 100M users across portfolio (low conf). **Canonical domain syft.ai** (the getsyft.com reference in materials circulating from the prior run is a GoDaddy for-sale page — $2,499 or $209/mo lease — not Syft property). iOS + Android + web. Free with IAP ladder: **Go $0.99/week · Plus $9.99/mo · $79.99/yr · Pro $19.99/mo · $159.99/yr** (tier contents JS-walled ❓; the AppBrain "$690/yr" figure is stale/misparsed — store IAPs win).

**UVP.** "Your AI-native news agent... reads the entire internet" — cross-language scan-and-summarize into a daily briefing ("24 hours summed in 2 minutes"), with dedup across sources ("Folded from 44 sources").

**Features by category:**
1. *Ingest:* type-any-topic AI channels; **filter/block/add own websites and RSS feeds — the only headline AI-native with explicit user RSS add-in** (freshness behavior undocumented); no OPML.
2. *Reading:* daily briefing (top-3), multilingual dedup ("No Duplicates, Just Key Takeaways"); **3.0 redesign backlash (mid-2026): merged topics into a generic feed, removed daily AI topic summaries + morning email, paywalled categories — users churned to Inoreader** (Play reviews); no calm mechanics beyond marketing language.
3. *AI:* core product — cross-language summarize/translate (~36-language site); **no Q&A, no AI disclosure of any kind.**
4. *Provenance:* source links per story; multi-source fold counts; no trust metadata.
5. *Platforms:* iOS + Android + web.
6. *Data ownership:* personalization preferences retained server-side long-run; **no export documented.**
7. *Extensibility:* none.
8. *Security:* standard ToS/privacy; nothing notable.
9. *Monetization:* the aggressive ladder above — $0.99/wk entry is the most extractive pricing shape in the field.
10. *Notifications:* daily briefing; morning email removed in 3.0.
11. *Traction:* iOS 4.61★/66 US ratings (flat since 2026-09-23 — near-zero iOS traction in the US; FR 241 ratings, #102 News France); Play 4.1★/1,743 US reviews, 100K+ downloads; mwm.ai ~75k+ iOS downloads estimate; "#1 news app in some major countries" still uncorroborated.
12. *Company:* Singapore holding-co pattern (portfolio bet, shared valuation); **velocity slowing — no release since 2026-07-17/31 (~2-month gap at research date)**; the 3.0 backlash is a live case study in AI-native products alienating their own power users.

### 4.14 Current — the river

Terry Godier (Jupiter Interactive Group LLC), side project; iOS/iPadOS/macOS one purchase, iCloud sync. **$9.99 one-time, no IAP.** "An RSS reader built on a simple idea: your feed should never make you feel behind" — no unread counts ("Not 'not yet'. Never."), no badges, no three-pane layout; content ages by type half-lives (**breaking ~3h bright, daily ~18h, essays ~3d, evergreen ~1wk**) then dims and fades. Voices: follow individual writers via author metadata — the developer also authored **"Byline," a spec adding author context to RSS/Atom/JSON feeds**, the closest shipped analogue to Plumb's provenance-native thesis. RSS + OPML in; no API; 4.4★/112 US ratings; no user numbers published (flagged). (TechCrunch 2026-02-19; App Store; terrygodier.com/current.) **Plumb read:** the purest calm mechanic in market — validates the design language; lacks provenance, AI, Android/web, and any team/business surface. The one-person one-time-purchase model is also the durability caution.

### 4.15 Kagi News (Kite) — the ritual

Kagi Inc. (the user-funded no-ads search company), launched 2025-09-30. Free apps (iOS/Android, no IAP); web requires Kagi account sign-in; no tier-gating documented. **One edition per day, hard-capped at 12:00 UTC** (~30-min rollout) — "a natural endpoint... turns news from an endless habit into a contained ritual"; complete news diet in 5 minutes; Mark-all-as-read; anti-personalization by design ("diversity over echo chambers"). AI distills "thousands of community-curated RSS feeds" into structured sections (Summary/Highlights/Key Quotes/Timeline/Context/Impact) **with every review citing its sources, and the source list itself public on GitHub** (kite-public, MIT frontend, 1,075★; full dataset published at kite.kagi.com/kite.json under CC BY-NC 4.0 — a de facto public API; third-party front-ends already exist). "Zero tracking, zero ads"; RSS fetches proxied so sources can't see readers; App Store privacy label: Data Not Collected. Traction: 4.55★/93 US iOS; no MAU. Gaps vs Plumb: no personal feeds, no provenance depth beyond citation, models unnamed. (blog.kagi.com 2025-09-30; help.kagi.com/kagi/news; github.com/kagisearch/kite-public.) **Plumb read:** the strongest live validation of the calm+honest lane — and its GitHub-sourced corpus + open dataset are exactly the surfaces Plumb's public-AI-register thesis pushes further.

### 4.16 Reeder — the rebuild

Silvio Rizzi, solo indie, 15-year franchise. New Reeder (2024 rebuild): free to use, **$1/mo · $10/yr** unlocks shared feeds, Mastodon/Bluesky timeline sync, >10 feeds; unified chronological timeline of RSS + YouTube + podcasts + Mastodon + Bluesky + Reddit ("not meant to replace full-featured clients"); **unread counts removed — "a thing of the past. Instead, your timeline position is synced"**; shared feeds = any tag becomes a public auto-updating JSON feed. Apple-only (iOS 17+/macOS 14+); **iCloud-exclusive sync — the new app does NOT sync via Feedbin/Inoreader (that's Reeder Classic, $4.99 one-time, still sold)**; "Reeder does not collect any data... nothing." 4.3★/875 US ratings (new) + 823 (Classic). (reederapp.com; TechCrunch 2024-09-23.) **Plumb read:** a beloved indie killed its own unread counts two years before Current shipped — the calm mechanic has an installed-base precedent; but Apple-only + no AI + no provenance leaves the intersection open.

### 4.17 Inkl — the bundle

Founded 2014 by Gautam Mishra (Sydney); $250k seed (North Base Media — Marcus Brauchli); evolved from pay-per-read "Spotify for news" to a closed curated bundle: "over 100 of the world's best news titles" (Economist, Bloomberg, FT, Foreign Policy, Reuters, Guardian variants) with no paywalls, no ads, no clickbait — "you are the customer." **$9.99/mo · $99.99/yr** (iOS IAPs; 7-day trial with explicitly no auto-charge). Human-curated; Good News feed (three positive stories every morning); Analysis feed; related-articles-under-every-story framing. **No BYO RSS** — closed corpus; no export (n/a); iOS/Android/web + institutional programs (Classroom/Libraries/Academy). 4.5★/723 US ratings over 12 years = modest but durable; no funding news since 2014. (apps.apple.com; TechCrunch 2014-12-12; LinkedIn.) **Plumb read:** proof readers pay $100/yr for curated trust without owning anything — and a publisher-licensing structure Plumb's B2B endgame could learn from.

### 4.18 Zetik (ex-NewsBang) — the watcher

Newsbang, Inc. (developer name unchanged through the rebrand); funding dark. "An AI agent that watches what you name — and briefs you only when something actually moves... No doomscrolling": you name topics/trackers; the agent assembles sources across newsrooms/podcasts/blogs/GitHub/research papers/newsletters; you can pin/connect your own; deduped multi-source folds ("Folded from 44 sources"); "a feed that takes feedback" (say "too much of X" and it adjusts). iOS + Android. Free + IAPs: **Plus $14.99/mo · Pro $149.99** (billing period unmarked ❓). 4.6★/472 US ratings — the strongest count of the new entrants. (apps.apple.com; newsbang.ai.) **Plumb read:** the inverted ingest model (agent picks sources, user names topics) is the genuine alternative to feed-ownership; briefs-only-when-something-moves is a real calm mechanic — but no provenance metadata, no export, no disclosure, and an unmarked $149.99 IAP shape straight out of the extractive playbook.

### 4.19 Newsreel — the human network

Jack Brewster (ex-WSJ/Forbes), Newsreel Inc.; Kickstarter 2024 ($54,839/217 backers) + $100k Glen Nelson Center; **chasing a $1M round per Forbes 2026-05-15 — no close announced as of 2026-09-24** (Forbes paywall respected; headline + snippets only). "For writers who want human readers. For readers who want news from humans" — rebuild the digital town square against AI slop: swipeable interactive stories from a vetted journalist/expert network, friends' takes, "track how your views evolve over time" (gamified rather than calm-mechanics); explicitly anti-AI-slop (DNR 2026 stats in its own marketing); **≥50% of revenue to writers, 0% platform fee** — humans-by-name IS the provenance model. Free + **Premium $5.99/mo · $49.99/yr**; institutional tiers. iOS only found; 4.5★/8 US ratings — very early. (apps.apple.com; newsreel.co/press; Kickstarter.) **Plumb read:** direct-adjacent — contests the trust job via humans rather than mechanics; its ≥50%-to-writers structure is a creator-economy flank Plumb's reader-side thesis doesn't cover.

### 4.20 Readless — the honest summarizer

One person, bootstrapped, California, begun mid-2025. No native app — forward newsletters to a personal @mail.readless.app address (+ Substack connect + RSS URLs) → AI summarizes → **cross-source dedup/merge ("same story across multiple sources merged into a single item with links back to every newsletter that covered it")** → scheduled email digest. **Pro $4.90/mo · Max $9/mo, monthly-only** (annual "planned, waitlist"). The closest-to-honest AI framing in the field — "Summaries don't invent details… If a number, name, or claim shows up in your digest, it came from a real source. Every digest item links back to the original" — but no model names, no prompt versioning. Calm-adjacent ethos: "no streaks, badges, or guilt UI." No traction numbers disclosed anywhere. (readless.app/about, /pricing.) **Plumb read:** the merge-with-links mechanic is precisely Plumb's cluster source-chain in email form; its "don't invent details" rule is the folk version of Plumb's AI register.

### 4.21 Wisp — the starver

Nikita Kolyadin, solo; iOS released 2026-04-07, v1.5 updated 2026-08-06; **0 US ratings**; free; Android per site. "Calm news app... Built to starve the outrage machine": event clustering → one neutral summary, chronological order, topics you choose, an end — explicitly anti-Particle: "No chatbot. No spectrum charts. No clips… you can finish and close." (iTunes lookup; wisp.news/blog.) **Plumb read:** zero traction, pure positioning proof — the calm lane is being entered by indies in 2026, none with provenance depth.

### 4.22 Watchlist (no profiles this run)

**Boring Report** — indie (Vasishta Kalinadhabhotla), free, 4.72★/465 US, LLM rewrites headlines to strip sensationalism; donation-funded; Android beta exists (lead-verified). Single mechanic, closed source list. **Drooid** (Veritometrics, India; iOS 2025-01-20, upd 2026-09-13, 58 US ratings) — multi-perspective AI aggregation, small. **Jarayid** (Arabic AI platform, iOS released 2026-09-10 — a literal this-month launch, 0 ratings). **Matter** (read-later, Pocket-shutdown beneficiary), **Quill, Techmeme, News360** — single roundup appearances, not dived. **The SEO-farm digest wave**: ~10 tiny AI-digest products (gobrief, SereneReader, Miniloop et al.) each publishing a "best news/RSS apps 2026" listicle starring themselves to farm comparison SEO — a contamination pattern this report's roundup cross-check had to filter for; no product substance found beyond their own blogs. **FreshRSS** (16,126★, v1.30.0 2026-09-09) and **Miniflux** ($15/yr hosted) — the self-host backbone, roster-context per methodology; **Unread** ($29.99/yr, MacStories-awarded indie reader) and **Stringer/Liferea/Fluent Reader** — OSS ecosystem health markers, covered in the prior run's platform notes.

## 5. Composite feature matrix

Column key: **PL** = Plumb (per spec 05) · **FLY** Feedly · **INO** Inoreader · **NBL** NewsBlur · **NNW** NetNewsWire · **FOL** Folo · **RWR** Readwise Reader · **FDB** Feedbin · **GRN** Ground News · **SMN** SmartNews · **NWK** NewsBreak · **FLP** Flipboard · **PTC** Particle · **SYF** Syft.

Plumb cells are **spec-based** (05 §2.1–2.6), not shipped-product claims: ✅ = committed at MVP; 🟡ⁿ = scheduled at V1/V2 per the spec's priority column (footnoted); the unshipped state itself is flagged in every traction cell. Competitor cells are evidence-based per §4 profiles. Full symbol semantics in the Legend (§5.15).

### 5.1 Ingest & protocols

| Sub-feature | PL | FLY | INO | NBL | NNW | FOL | RWR | FDB | GRN | SMN | NWK | FLP | PTC | SYF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RSS/Atom/JSON Feed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌¹ | ❌ | 🟡² | ❌ | 🟡³ |
| Newsletter ingestion | ✅ᵛ¹ | ✅ᵖ⁺ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡⁴ |
| Social protocols (Bluesky/AP/Mastodon) | ✅ᵛ¹ᐟ² | ❌ | ❓ | ❌ | 🟡⁵ | ✅⁶ | 🟡⁷ | ✅ | ❌ | ❌ | ❌ | ✅⁸ | ❌ | ❌ |
| Podcasts / YouTube | 🟡ᵛ² | 🟡 | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | 🟡 | ❌ | ❌ | ✅ | 🟡 | 🟡⁴ |
| OPML import | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Web-page monitoring | 🟡ᵛ² | 🟡 | ✅ | ❌ | ❌ | 🟡 | 🟡 | 🟡 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

¹ SmartNews RSS exists only as publisher-side SmartFormat ingestion. ² Flipboard flagship dropped arbitrary-RSS additions; Surf (its beta companion) is RSS-native. ³ Syft: user can add own sites/RSS to agent channels; no OPML. ⁴ podcasts/blogs/newsletters among agent-assembled sources, not user feed management. ⁵ NNW community script feeds (Twitter/Reddit). ⁶ Folo via built-in RSSHub routes (Twitter 24, YouTube 13, Mastodon 7, Bluesky 6, TikTok 5; reddit 0). ⁷ Readwise: X lists yes; other protocols unverified. ⁸ Surf: ActivityPub + AT-Proto + Threads + RSS + YouTube + podcasts.

### 5.2 Reading experience & calm design

| Sub-feature | PL | FLY | INO | NBL | NNW | FOL | RWR | FDB | GRN | SMN | NWK | FLP | PTC | SYF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Event/story clustering | ✅ | ❌ | ❌ | 🟡¹ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅² |
| Chronological mode always available | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ | ❌ | ❌ | 🟡 | ❌ | ❌ |
| "Caught up" hard stop / bounded session | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Typography-first reading view | ✅ | 🟡 | 🟡 | 🟡 | ✅ | 🟡 | ✅ | ✅ | 🟡 | ✅³ | 🟡 | ✅ | ✅ | 🟡 |
| Keyboard shortcuts (j/k contract) | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Offline reading | ✅⁴ | 🟡 | ✅ | 🟡 | ✅ | 🟡 | ✅ | 🟡 | ❌⁵ | ✅ | ❌ | 🟡 | ❌ | ❌ |

¹ NewsBlur clustering shipped 2026-03-18, gated to Premium Archive ($99/yr). ² Syft folds ("Folded from 44 sources") = dedup clusters. ³ SmartView de-cluttered format — validated demand, wrapped in countdown interstitials. ⁴ Plumb: local-first by construction; offline packs at V1. ⁵ Ground: "Offline browsing is not currently supported" (help 335105/225473).

### 5.3 AI features & disclosure

| Sub-feature | PL | FLY | INO | NBL | NNW | FOL | RWR | FDB | GRN | SMN | NWK | FLP | PTC | SYF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| AI summaries | ✅ | ✅ | ✅ | 🟡¹ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | 🟡 | ❌ | ✅ | ✅ |
| AI Q&A / chat | ❌² | ✅ | ✅ | 🟡¹ | ❌ | 🟡³ | ✅ | ❌ | ❌ | ❌ | 🟡⁴ | ❌ | ✅ | ❌ |
| Machine translation | ✅ᵛ¹ | ❌ | ❓ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅⁵ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Per-element AI labels (model+prompt) | ✅ᵛ¹ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Public AI register / methodology | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡⁶ | ❌ | ❌ | ❌ | ❌⁷ | ❌ |

¹ NewsBlur AI (Ask AI Claude/GPT/Gemini/Grok, Daily Briefing) gated to Archive tier. ² Plumb spec §7: deliberately not an AI-summary product; AI is labeled plumbing. ³ Folo BYOK enables chat-style use; not a shipped assistant. ⁴ NBot agentic beta. ⁵ Ground: subscriber-only per-article translate. ⁶ Ground publishes a bias-methodology page (not an AI register; AI use described qualitatively with "human-in-the-loop" claim). ⁷ Particle's /methodology, /ai, /faq all 404; AI stack known only from Nov-2024 press.

### 5.4 Provenance & trust

| Sub-feature | PL | FLY | INO | NBL | NNW | FOL | RWR | FDB | GRN | SMN | NWK | FLP | PTC | SYF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Multi-source comparison per story | ✅ | ❌ | ❌ | 🟡 | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | 🟡¹ |
| Bias ratings | 🟡ᵛ²² | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡³ | ❌ | ❌ | ❌ | ✅⁴ | ❌ |
| Outlet ownership/funding panel | 🟡ᵛ² | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡⁵ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Correction tracker | ✅ᵛ¹ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| "Why am I seeing this" panel | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| C2PA content credentials | 🟡ᵛ¹ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

¹ Syft: corroboration counts ("folded from 44 sources") without per-source trust metadata. ² Plumb V2: multiple raters shown side-by-side with linked methodologies, coverage-level, global frame — explicitly *not* a flattened score (spec §7 anti-scope). ³ Ground: 3 US raters averaged into one blended publication-level label, "in the context of the U.S. political system" (verbatim); factuality paywalled. ⁴ Particle: political-spectrum chart of covering outlets per story. ⁵ Ground: 8 ownership categories, 2,276 outlets vs 50K corpus, Vantage-gated.

### 5.5 Platforms & sync

| Sub-feature | PL | FLY | INO | NBL | NNW | FOL | RWR | FDB | GRN | SMN | NWK | FLP | PTC | SYF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| iOS | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Android | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | 🟡¹ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Web | 🟡ᵖʳᵒ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Desktop app | ❓ | 🟡 | ✅ | 🟡 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Local-first + E2E sync | ✅ᵛ¹ | ❌ | ❌ | ❌ | 🟡² | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

¹ Feedbin Android via third-party clients (ecosystem). ² NNW local-first with iCloud sync (flaky per community reports); no E2E relay. Plumb: local-first MVP; E2E-encrypted relay at V1 (server sees ciphertext only; Cloud-Bundle Sync fallback named).

### 5.6 Data ownership & privacy

| Sub-feature | PL | FLY | INO | NBL | NNW | FOL | RWR | FDB | GRN | SMN | NWK | FLP | PTC | SYF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Export (OPML/JSON, one button) | ✅ | ✅ | ✅ | ✅ | 🟡¹ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❓ | ❌ | ❌ |
| Zero behavioral tracking | ✅ | ❓ | ❌² | 🟡 | ✅ | ❌³ | ❓ | ✅ | ❌⁴ | ❌ | ❌⁵ | ❌ | ❌⁶ | ❌ |
| Account optional | ✅ | ❌ | ❌ | 🟡 | ✅ | ❌ | ❌ | ❌ | ❌ | 🟡 | ❓ | 🟡 | 🟡 | ❓ |
| OSS client / self-host | 🟡⁷ | ❌ | ❌ | ✅ | ✅ | 🟡⁸ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Published data-map | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

¹ NNW OPML yes; starred-items export requires SQLite digging. ² Inoreader free tier serves ads. ³ Folo telemetry (PostHog+Firebase) default-on. ⁴ Ground ships GTM+Sentry on web (no ad-tech, but not zero-analytics). ⁵ NewsBreak CCPA "Don't Sell My Info" link implies data sale default. ⁶ Particle web retargeting consent banner. ⁷ Plumb: escrowed client source release per shutdown plan. ⁸ Folo AGPL client; backend closed.

### 5.7 Extensibility & dev surface

| Sub-feature | PL | FLY | INO | NBL | NNW | FOL | RWR | FDB | GRN | SMN | NWK | FLP | PTC | SYF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Public API | ✅ᵖʳᵒ | 🟡¹ | 🟡¹ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Rules/automation engine | 🟡² | 🟡 | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | 🟡 |
| CLI / MCP agent tooling | ❓ | ❌ | ❌ | ✅³ | ❌ | ✅⁴ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

¹ API on paid tiers only. ² Plumb: local "less like this" at MVP; full rules engine not in v1 spec. ³ NewsBlur MCP server (HTTP/OAuth) + newsblur-cli v0.2.2 (2026). ⁴ Folo MCP services + BYOK + custom integration templates.

### 5.8 Security posture

| Sub-feature | PL | FLY | INO | NBL | NNW | FOL | RWR | FDB | GRN | SMN | NWK | FLP | PTC | SYF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2FA / passkeys | ❓⁵ | ✅ | ✅ | ❌⁶ | ➖⁷ | ❓ | ❌⁸ | ❓ | ❌ | ❓ | ❓ | ❓ | ❓ | ❓ |
| Clean breach history | ➖ | 🟡⁹ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SBOM / threat model / signed releases | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Third-party audit / certification | ➖ | ✅¹⁰ | ✅¹¹ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Bug bounty / responsible disclosure | 🟡ᵛ¹ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |

⁵ Plumb: account-optional local-first design reframes the question; 2FA not specified in v1 spec (open design item, spec §2.4 covers CSP/SBOM/signed/threat-model instead). ⁶ GitHub issue #1647 open since 2022-03-13. ⁷ NNW: no accounts exist. ⁸ Readwise: official "optimizing for user experience over enterprise compliance" (r/readwise). ⁹ June 2014 DDoS extortion, ransom refused, no data compromise (not a 2019 event — corrected). ¹⁰ SOC 2 Type 2 (2026-07-02). ¹¹ ISO 27001, ISO 9001, PCI DSS, passkeys.

### 5.9 Monetization & pricing (see also pricing reference below)

| Sub-feature | PL | FLY | INO | NBL | NNW | FOL | RWR | FDB | GRN | SMN | NWK | FLP | PTC | SYF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Meaningful free tier | ✅¹ | ✅ | 🟡² | ✅ | ✅ | ✅ | ❌ | ❌³ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ad-free option | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡⁴ | ❌ | ❌ | 🟡⁵ | ✅ |
| Team/enterprise tier | 🟡ᵛ² | ✅ | ✅ | ❌ | ➖ | ❌ | ❌ | ❌ | 🟡⁶ | ❌ | ❌ | ❌ | ❌ | ❌ |
| No ads ever (structural) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | 🟡⁵ | ✅ |

¹ Plumb Free: unlimited feeds (bounded by documented invisible guardrails, spec §2.6 panel footnote), clustering, 1 sync device, Today brief. ² Inoreader free carries ads. ³ Feedbin: 30-day trial only. ⁴ SmartNews US Ads-Free plan exists (terms 2024-10-15) with written exceptions; price in-app only. ⁵ Particle: no in-app ads, but web serves ad-tech/retargeting consent. ⁶ Ground group subscriptions (40–50% off).

### 5.10 Notifications & alerts

| Sub-feature | PL | FLY | INO | NBL | NNW | FOL | RWR | FDB | GRN | SMN | NWK | FLP | PTC | SYF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Digest / brief format | ✅¹ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❓ | ✅ | ✅ | 🟡 | ❓ | ✅ | ✅ |
| Breaking alerts | ✅ᵛᵉʳ | 🟡 | ✅ | ✅ | ❌ | ❓ | ❌ | ❓ | ✅ | ✅ | ✅ | ❓ | ✅ | ✅ |
| User-set notification budget | ✅² | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌³ | ❌⁴ | ❌ | ❌ | ❌ |
| Corroboration-gated breaking | ✅⁵ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌⁶ | ❌⁷ | ❌ | ❌ | ❌ |

¹ Plumb: 90-second Today brief (MVP) + Sunday weekly review (V1); morning-brief push in user-chosen digest window. ² Default 2/day, "spend" preview before enabling a topic. ³ SmartNews Rewards (2026-03-25) pushes the opposite direction — daily reading missions, goal raised 30→75 articles/day. ⁴ NewsBreak's marketing is the firehose itself ("first to know"; crime/police alerts). ⁵ Verified-only breaking: ≥3 outlets or 1 wire — "the anti-NewsBreak rule" (spec §2.5). ⁶ Mismatched-story push complaints (Play 2026). ⁷ Contributor fake-crime alerts documented by NBC.

### 5.11 Traction & scale (inline flags; no symbol semantics — self-reported ⚑ / stale ⌛ / tracker-conflict ⚔)

| Row | PL | FLY | INO | NBL | NNW | FOL | RWR | FDB | GRN | SMN | NWK | FLP | PTC | SYF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| User scale | ➖ unshipped | 15M ⌛⚑ | n/a ⚑ | n/a | n/a | ~n/a ⚔ | n/a ⚑ | n/a | "millions" ⚑ | 20–30M ⚑ vs ~5M ⚔ | 40/45/50M ⌛⚑ | 145M ⌛ (2018) | none published | ~n/a ⚑ |
| Store ratings (US) | ➖ | modest | modest | modest | modest | iOS 53 | small | n/a | 48.1k @4.7 | large | 773k @4.7 | large | 1.2k @4.76 | iOS 66 / Play 1.7k |
| Funding | spec: boot | boot | boot | none | none | Sky9+Mask | boot | none | ~$1.01M | ~$410–479M | $115M Series C | VC-era legacy | $15.3M | $11M (sibling) |
| Shipping velocity (2026) | spec | low (consumer) | ✅ very high | ✅ very high | ✅ steady | 🟡 decay | ❄ frozen | ✅ steady | ✅ high | 🟡 | ✅ | 🟡 | ✅ highest | 🟡 slowing |

### 5.12 Company & independence

| Sub-feature | PL | FLY | INO | NBL | NNW | FOL | RWR | FDB | GRN | SMN | NWK | FLP | PTC | SYF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Founder-controlled / bootstrapped | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | 🟡¹ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Durability signals | ✅² | 🟡³ | ✅ | 🟡⁴ | ✅⁵ | 🟡⁶ | 🟡⁷ | ✅⁸ | ✅ | 🟡⁹ | 🟡¹⁰ | 🟡¹¹ | ✅ | 🟡¹² |
| No-ads business model | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | 🟡 | ✅ |

¹ Ground: independent but individual-investor optics contested (Ricketts). ² Plumb: published binding shutdown plan day one (90-day notice, full export, escrowed client). ³ Feedly: consumer maintenance mode + Aug-2026 outage. ⁴ NewsBlur: bus factor 1 (OSS mitigates). ⁵ NNW: 20+ year lineage, community. ⁶ Folo: download decay, star plateau. ⁷ Readwise: official feature freeze. ⁸ Feedbin: 13 years + self-host option. ⁹ SmartNews: IPO target lapsed/unfiled. ¹⁰ NewsBreak: lawmaker scrutiny + misinformation record. ¹¹ Flipboard: 21% layoffs, 8-year-stale scale claim. ¹² Syft: ~2-month release gap + 3.0 backlash.

### 5.13 Emerging-cohort compact matrix (category-level)

| Category | Current | Kagi News | Reeder | Inkl | Zetik | Newsreel | Readless | Wisp |
|---|---|---|---|---|---|---|---|---|
| Ingest breadth | ✅ RSS+OPML | ❌ no BYO | ✅ RSS+YT+pods+social | ❌ closed bundle | 🟡 agent-picked + pin | ❌ closed network | ✅ newsletters+RSS | 🟡 topics |
| Calm mechanics | ✅ river, half-lives, no counts | ✅ 1/day, 5-min diet | ✅ counts removed | 🟡 editor pacing | 🟡 briefs-on-movement | ❌ gamified | 🟡 digest schedules | ✅ clustering + end |
| AI features | ❌ | ✅ distill+translate | ❌ | ❌ human | ✅ agent+dedup | ❌ anti-AI | ✅ summaries | ✅ neutral summaries |
| AI disclosure | ❌ | 🟡 cites sources | n/a | n/a | ❌ | n/a | 🟡 "don't invent" rule | ❌ |
| Provenance | 🟡 Voices+Byline spec | ✅ cited + open corpus | 🟡 JSON feeds out | ✅ named brands | 🟡 fold counts | ✅ named journalists | ✅ links to all sources | 🟡 |
| Platforms | 🟡 Apple-only | ✅ web+iOS+Android | 🟡 Apple-only | ✅ iOS+Android+web | ✅ iOS+Android | 🟡 iOS only | ❌ web/email | 🟡 iOS (+Android site) |
| Data ownership | 🟡 iCloud; export ❓ | ✅ OSS + open dataset | 🟡 iCloud store | ❌ closed | ❌ no export | ❌ closed | 🟡 no export feature | ❓ |
| Extensibility | ❌ | ✅ GitHub + kite.json | 🟡 JSON feeds out | ❌ | ❌ | ❌ | ❌ | ❌ |
| Zero tracking | ❓ | ✅ proxied fetches | ✅ collects nothing | 🟡 | ❓ | ❓ | 🟡 pledge | ❓ |
| Notifications | ✅ none by design | ✅ 1/day cadence | ❌ none marketed | 🟡 morning digest | ✅ agent-initiated | 🟡 social hooks | ✅ digest-schedule only | 🟡 |
| Traction (US iOS ratings) | 112 | 93 | 875 (+823 Classic) | 723 | 472 | 8 | none published | 0 |
| Pricing | $9.99 once | free | $1/mo·$10/yr (+$4.99 Classic) | $9.99/mo·$99.99/yr | Plus $14.99/mo·Pro $149.99 | $5.99/mo·$49.99/yr | $4.90/$9 monthly-only | free |

### 5.14 Pricing reference (personal tiers, exact where first-party)

| Product | Free tier | Paid (personal) | Annual equivalent | Source tier |
|---|---|---|---|---|
| **Plumb (spec)** | Unlimited feeds | **$4.99/mo · $39/yr** | $39 | ~$999/yr site ≤25 seats (V2) |
| Feedly | 100 feeds | Pro $6.99/mo · Pro+ $12.99/mo | $72 / $99 | Enterprise $1,600–3,200/mo |
| Inoreader | 150+20+20 w/ ads | Pro $9.99/mo ($7.50 annual-billing) | **$89.99** | Team |
| NewsBlur | 64 sites | Premium $36/yr · Archive $99/yr · Pro $29/mo | $36–$99 ($348 Pro) | — |
| NetNewsWire | everything | — | — | — |
| Folo | 150 subs | Basic $4.99/mo · Plus $9.99/mo · Pro $99.99/mo | $49.99 / $99.99 / $999.99 | — |
| Readwise Reader | none (30-day trial) | $12.99/mo monthly · $9.99/mo annual-billing | ~$119.88 | — |
| Feedbin | none (30-day trial) | $7/mo | **$70** | — |
| Ground News | 6 Blindspot/day | Premium $3.99/mo · Vantage $9.99/mo | Vantage **$99.99** annual-only (web) | Group subs 40–50% off |
| SmartNews | full product (ads) | US Ads-Free plan (price in-app ❓) · JP SmartNews+ ¥1,480/mo | ❓ | — |
| NewsBreak | full product (ads) | — | — | — |
| Flipboard | full product (ads) | — | — | — |
| Particle | generous free | **$2.99/mo · $29.99/yr** | $29.99 | — |
| Syft | free | Go $0.99/wk · Plus $9.99/mo · Pro $19.99/mo | $79.99 / $159.99 | — |

### 5.15 Legend

- **✅** — feature confirmed present in current public docs / product page / listing (captured 2026-09-23/24).
- **🟡** — partial, limited, behind a paywall, in beta, or (Plumb column only) scheduled at V1/V2 in the spec's priority column. The condition is footnoted at the table.
- **❌** — feature absent or explicitly not offered.
- **➖** — not applicable (e.g., breach history for an unshipped concept; team tier for a free OSS project).
- **❓** — could not be confirmed from public sources this run; further research needed.
- **Plumb column:** every cell is **per spec (05)**, not a shipped claim. ✅ = MVP commitment; 🟡ᵛ¹/ᵛ² = V1/V2 roadmap item; ➖ = unshipped. Plumb platform cells reflect the spec's store-distribution targets and 09's architecture; anything not in the spec is ❓, never inferred.
- **Traction row flags (§5.11):** ⚑ self-reported by the company · ⌛ stale (figure unchanged for years) · ⚔ tracker conflict carried side-by-side.
- **Emerging compact matrix (§5.13)** uses the same symbol semantics at category level.

## 6. Strategic observations

Numbered observations, each tied to the profiles (§4) and matrix (§5) evidence that supports it. No assertion below rests on vibes; where a claim is single-source or self-reported it says so.

**1. The Plumb wedge is real, and 2026's entrants have validated its parts without occupying their intersection.** Across the 13-competitor main matrix, three rows are ✅ for Plumb and ❌ for *every* established player: a "caught up" hard stop (§5.2), per-element AI labels (§5.3), and a "why am I seeing this" panel (§5.4). The calm lane now has live occupants — Reeder removed unread counts in its 2024 rebuild (§4.16; TechCrunch 2024-09-23), Current ships half-life decay (§4.14; TechCrunch 2026-02-19), Kagi News hard-caps at one edition/day (§4.15; blog.kagi.com 2025-09-30), Wisp markets "an end" (§4.21) — but each is partial: Apple-only, no provenance, no AI honesty, and traction under 500 US ratings apiece (verification-pass falsifier verdict #4). Nobody combines calm mechanics + provenance depth + honest-AI labeling + export-everything. That intersection remains Plumb's alone to claim, with a speed caveat: the lane is being probed in real time.

**2. The paid power-reader segment is self-disrupting in real time — a switching window Plumb's spec anticipated.** Feedly has removed consumer pricing from its first-party site entirely (only enterprise TI pricing is published; $6.99/$12.99 tiers carry third-party-consensus confidence — §4.1, verification-pass) while an Aug-2026 outage (TechCrunch 2026-08-17) shook reliability perceptions. Readwise Reader is in an officially admitted feature freeze ("intentionally ignoring feature requests" — r/readwise, §4.6). Inoreader gates its API and intelligence rules behind Pro (§4.2). Folo fused its reader to an engagement-token economy with telemetry default-on (§4.5). Each is a documented irritant at exactly Plumb's price band ($39–60/yr vs Feedly $99+/yr, Reader ~$120/yr), and Feedbin's Aug-2026 "6 months free for Feedly refugees" promo (§4.7) proves the window is already being arbitraged — by infrastructure, not by a full-stack alternative.

**3. Provenance demonstrably monetizes — and its incumbent implementations are shallow enough to counter-design against.** Ground News gates its ownership panel and bias dashboard behind Vantage at $99.99/yr (§4.8, ground.news/subscribe 2026-09-24); Feedly converted provenance-flavored features into $1,600–3,200/mo enterprise threat-intelligence seats (§4.1). But Ground's implementation averages three US raters into one publication-level label "in the context of the U.S. political system" (verbatim, rating-system page), covers ownership for 2,276 outlets against a claimed 50K corpus, and — per CJR — uses AllSides ratings without license or pay. The rater-licensing gap CJR documents is itself the opening for Plumb's B2B Provenance API (spec §2.6, V3): the field's provenance metadata supply chain is unresolved, and a provenance-native client would enter with clean structural answers (multiple raters side-by-side, global frame, correction tracking — spec §2.3) rather than a blended score.

**4. Self-reported and stale scale numbers are the category's standard currency.** This is the identical pattern found across the series' leader documents (03 §1.3, 04 W4, 00 §1.4), reproduced here in the news-app set: Feedly's "15M users" (§4.1) is arithmetically indistinguishable from its 2018-era 14M self-claim; Flipboard's ubiquitously-quoted 145M MAU is a Digiday figure from 2018-08-27, eight years stale, with no current number anywhere (§4.11); NewsBreak publishes three different user counts simultaneously on one property — 50M "readers," 40M+ "users," 45M+ "locals" (§4.10, newsbreak.com + Play listing 2026-09-24); SmartNews claims 20–30M MAU while Sensor Tower's last public estimate was ~5M worldwide (conflict carried side-by-side, §4.9); Particle, "the leading AI news app," has never published a user number at all — the absence is the finding (§4.12); Ground says "millions" with no denominator (§4.8); Syft's "#1 news app in some major countries" remains uncorroborated (§4.13). Consequence for Plumb: **store-rating counts are the only cross-comparable traction metric in the field** (§5.11 uses them), and any Plumb go-to-market that publishes verifiable, dated, auditable numbers — even small ones — instantly differentiates in a market where nobody else does.

**5. Free-tier feed caps are the category's ratchet — and Plumb's free tier is engineered against exactly this switching moment.** Every meaningful freemium reader caps the core asset: Feedly 100 feeds, Inoreader 150+20+20 (with ads), NewsBlur 64 sites, Folo 150 subscriptions, Reeder >10 feeds behind the paid unlock (§4.1–4.5, §4.16). The caps are where power readers live before they pay — and where they churn when the paid tier disappoints (observation 2). Plumb's spec answers with unlimited free feeds bounded by documented invisible guardrails (learned sync cadence, ~5,000-feed abuse ceiling, dormancy decay — spec §2.6): the cap is replaced by an honest, published physics. The structural risk is inverted: Plumb's free tier must stay genuinely usable, because its entire wedge claim is honesty about limits the others hide.

**6. The pricing middle is open: cheap products without Plumb's depth, deep products at 2–3× Plumb's price.** Below Plumb's $39/yr: Particle at $29.99/yr (no provenance panel, no calm mechanics, ad-tech on web — §4.12), Reeder at $10/yr (Apple-only, no AI — §4.16), Readless at ~$4.90/mo monthly-only (§4.20). At or above: Feedbin $70/yr with no AI and no clustering (§4.7), Inoreader $89.99/yr (§4.2), Feedly Pro+ $99/yr (§4.1), Readwise ~$119.88/yr frozen (§4.6), Ground Vantage $99.99/yr annual-only (§4.8). Plumb's $4.99/mo·$39/yr lands in the vacated middle with the strongest feature claim at that price. Two integrity data-points bracket it: Ground's $59.99 affiliate price teaches buyers never to trust list price (§4.8), and NewsBlur's Premium Yearly row simultaneously displays $29.99/$39.99/$49.99 legacy price points (§4.3) — pricing hygiene itself is a trust surface in this category, which Plumb's single-price annual-first design (spec §2.6) treats as part of the covenant.

**7. The 2026 power-user bar has moved to agentic surfaces — Plumb's spec only half-clears it.** NewsBlur ships an MCP server plus newsblur-cli v0.2.2 (§4.3); Folo ships MCP services, BYOK AI, and a custom-integration template system (§4.5); Readwise and Feedbin maintain public APIs that anchor whole client ecosystems (§4.6–4.7); Kagi News's kite.json dataset is already a de facto public API with third-party frontends (§4.15). Plumb's spec commits to a Pro API token and a V3 B2B Provenance API (spec §2.6) — table stakes, but no MCP surface is specified. Given NewsBlur and Folo shipped MCP in 2026 and Plumb's ICP is exactly the population that uses it, an MCP server should enter the spec's V1/V2 conversation; it is currently the one power-user surface where the spec trails the market's demonstrated bar rather than leading it.

**8. Security posture is the category's least-finished surface — and the one where Plumb's DevSecOps-first spec is uncontested.** Across 13 competitors: 2FA absent at NewsBlur (GitHub issue #1647, open since 2022-03-13), Readwise (officially deprioritized, r/readwise), and Ground (no feature or help article found); third-party certification exists at exactly two vendors (Feedly SOC 2 Type 2, 2026-07-02; Inoreader ISO 27001/9001 + PCI DSS + passkeys); not one ships an SBOM, a public threat model, or signed release artifacts (§5.8 — the all-❌ row). Inoreader's certification pair proves the bar is achievable at small-company scale. Plumb's spec commits CSP + SBOM + signed releases + a public threat model at MVP with a bug bounty at V1 (spec §2.4) — the only such posture in the field, and cheap to maintain relative to its differentiation value for the reader ICP that 03 identified as security-adjacent professionals.

**9. Calm mechanics crossed from thesis to shipping between 2024 and 2026 — the lane's occupants are proof-of-demand, not occupiers.** Reeder (installed base, 15-year franchise) removed unread counts in its 2024 rebuild; Current ($9.99 once) ships type-proportional half-lives; Kagi News (a funded company's product) hard-caps at one edition per day with a 5-minute complete diet; Wisp markets explicitly anti-Particle positioning (§4.14–4.16, §4.21). Each validates a component of Plumb's §2.2 architecture. Each is also partial: Apple-only (Current, Reeder), no personal feeds (Kagi), no provenance (all), no AI-honesty layer (all), and traction below 500 US ratings each — versus 773k ratings for NewsBreak and 48.1k for Ground. The demand signal is real but unserved at scale; the window between "validated" and "occupied" is where Plumb must land, and it is measured in quarters, not years.

**10. AI disclosure is universally absent — Plumb's public register would be first and uncontested.** No player in the 21-product field publishes model names with prompt versions, or any AI register: Particle's /methodology, /ai, and /faq all return 404 while its robots.txt welcomes GPTBot into /answers/ (§4.12 — disclosure-free by design while feeding answer engines); SmartNews ships AI summaries and a standalone AI app with zero disclosure (§4.9); Ground claims "human-in-the-loop" with no register (§4.8); NewsBlur and Folo expose model *choice* without labels (§4.3, §4.5); Readwise labels nothing per element (§4.6). The nearest approximations are Readless's "summaries don't invent details" rule and Kagi's source-citing distills (§4.15, §4.20) — folk honesty without published mechanics. Plumb's MVP commitment to a public AI register plus per-element model+prompt labels (spec §2.3) has no competitor within one product generation.

**11. Engagement mechanics are actively poisoning trust in the scaled players — and all of 03's named failure modes are confirmed live in 2026 captures.** SmartNews Rewards launched points-per-article reading missions in 2026-03 and then raised the daily goal from 30 to 75 articles/day, triggering user revolt (§4.9; announcement 2026-03-25 + Play reviews). Folo ships telemetry default-on (PostHog + Firebase, defaults.ts) inside an OSS-labeled client, fused with Power/tipping/Boost token mechanics (§4.5). NewsBreak's marketing is the firehose itself — "stay alert, stay safe — immediate access to local crime and police alerts" — on top of the Reuters-documented 2021–2024 record of 40+ erroneous AI stories including a fabricated shooting (§4.10; Reuters 2024-06-05). Flipboard's 2025–26 reviews describe ad-quality collapse (Amazon auto-opening tabs, Temu ad complaints, §4.11). Ad-load ratchets, firehose notifications, opaque personalization, and provenance-invisible AI — the anti-patterns 03 §2 catalogued are not historical; they are the current operating model of the category's largest players, which is precisely the demand condition Plumb's §2.5 verified-only breaking rule ("the anti-NewsBreak rule") is designed against.

**12. Data ownership is claimed more than practiced — the honest minority is small enough to join, and differentiated by publishing.** No export surface at all: Ground, SmartNews, NewsBreak, Particle, Syft (§4.8–4.13). Data-sale defaults: NewsBreak's CCPA "Don't Sell My Info" link implies sale by default; Particle's web app serves an ad-tech/retargeting consent banner (§4.10, §4.12). Behavioral telemetry: Folo default-on (§4.5). The honest minority — Feedbin (OSS + self-host + API export), NetNewsWire (local SQLite, no telemetry), NewsBlur (self-hostable) — proves the posture is viable but none of them publish a data-map or bind themselves to a shutdown plan. Plumb's export-everything-one-button at MVP, published data-map, zero-behavioral-tracking covenant, and 90-day escrowed shutdown plan (spec §2.4) extend the honest minority's posture with *published, auditable commitments* — the difference between being trustworthy and being verifiably trustworthy, which is the entire brand thesis.

## 7. Sources

Consolidated from the angle notes (§1 methodology; full capture logs in `scratch/notes/angle-01…09` and page captures in `scratch/pages/`). Grouped by subject; the §4 profile in which each is cited appears in parentheses. Where a JS wall, paywall, or robots directive limited capture, the limitation is noted in §1 and the profile.

### 7.1 Target spec + series context

- Plumb spec: `independent_research/2026-09-23-news-aggregator-industry-deep-dive/05-new-app-concept.md` (§2.1–2.6, §5, §7 — matrix Plumb column source)
- Series: 00-executive-summary, 03 (white-space + failure modes), 04 (leader-set weaknesses), 07 (release plan), 09 (architecture) — same folder
- Reuters Institute Digital News Report 2026 (market stats; DNR-derived US reach carry, §4.9)
- VPN Tier Lists RSS-reader privacy audit (80% phone-home finding, §2 market overview)
- Appfigures / press coverage of the Pocket shutdown (2025) and Substack counter-trend (§2)

### 7.2 Feedly (§4.1)

- feedly.com homepage + /threat-intelligence/pricing (lead-browser capture, 2026-09; consumer pricing absent first-party — `scratch/pages/lead-feedly-*.md`)
- Feedly blog: SOC 2 Type 2 announcement (2026-07-02); Aug-2026 incident postmortem coverage via TechCrunch (2026-08-17)
- June 2014 DDoS extortion: Fast Company; The Hacker News (correction of the prior run's "2019 breach")
- Third-party pricing consensus: readless.app (×2), SoftwareFinder (MED confidence, per verification-pass)
- erat.org/feedly-json-feed (JSON Feed support, 2023)

### 7.3 Inoreader (§4.2)

- inoreader.com/pricing, /blog (BYOAI, 2026-04-14), changelog (fastest velocity in set)
- Certification pages: ISO 27001, ISO 9001, PCI DSS; passkey support docs
- Innologica/Bulgaria company background; Supporter-tier removal (2026 pricing page)

### 7.4 NewsBlur (§4.3)

- newsblur.com/pricing (2026-09-24), newsblur.com/blog (clustering 2026-03-18; 2026 feature wave)
- github.com/samuelclay/NewsBlur — 7,627★; issue #1647 (2FA, open since 2022-03-13); MCP server + newsblur-cli v0.2.2 releases

### 7.5 NetNewsWire (§4.4)

- netnewswire.com (+ /privacy-ethos); github.com/Ranchero-Software/NetNewsWire (10,406★; 7.1.4, 2026-09-20)
- MacStories coverage; community starred-export SQLite documentation

### 7.6 Folo (§4.5)

- folo.is/pricing embedded plans JSON (2026-09-24 — 4-tier ladder incl. $999.99/yr Pro)
- github.com/RSSNext/Folo — 39,012★; issue #2178 (AGPL client-only); defaults.ts telemetry flags
- Discord community count (16,905); Play/iOS listings; release-asset download series (~29.83M cumulative, decay curve per verification-pass)

### 7.7 Readwise Reader (§4.6)

- readwise.io/pricing (2026-09-24), readwise.io/reader
- r/readwise official replies (feature-freeze admission; 2FA stance — lead-verified)
- API v3 docs; Obsidian/Notion export pipeline docs

### 7.8 Feedbin (§4.7)

- feedbin.com, feedbin.com/blog (Airshow 3.0, 2026-07-13; Feedly-refugee promo, Aug 2026), feedbin.com/apps
- api.feedbin.com / github.com/feedbin/feedbin-api (REST v2 client standard)
- OSS + self-host docs (since 2013-08-27)

### 7.9 Ground News (§4.8)

- ground.news/subscribe (2026-09-24), /rating-system, help.ground.news (articles 866177, 335105/225473, 3189505)
- Semrush Aug-2026 (4.09M visits; 3-month series 3.89/4.46/4.09M — tracker spread stated side-by-side vs Similarweb)
- CJR (AllSides ratings used without permission/pay); Revenue Memo → PitchBook (~$1.01M lifetime, 2026-08-18, unconfirmed)
- Axios/Gospel Params sponsored-brand analysis (Oct 2025); Literate Machine essay (Aug 2026, contested framing — carried as narrative, not fact)
- US App Store listing (4.7★/48,070); About/Wikipedia founding-date conflict (2017 vs 2018-04-27)

### 7.10 SmartNews (§4.9)

- about.smartnews.com/publishers (SmartFormat); Google Play listing (2026-09-24)
- SmartNews blog/announcements: SmartNews+ ¥1,480 (2025-07-23), Rewards US (2026-03-25), ES/ZH translation (2026-07-16), NewsArc (2025-08-05), AI Matome (Jul–Aug 2025)
- US Ads-Free terms (2024-10-15 — price in-app only, JS-walled)
- Bloomberg IPO report (2026-03-25, unfiled as of 2026-09-24); Toyo Keizai profitability reporting
- Sensor Tower ~5M MAU (2023) vs company 20–30M claim — carried side-by-side; NewsPicks analyst; GetLatka revenue variants (conflict logged)

### 7.11 NewsBreak (§4.10)

- newsbreak.com/about + /advertisers (2026-09-24 — the three simultaneous user-count claims)
- Reuters: erroneous AI stories (2024-06-05); lawmaker scrutiny (2024-06-08)
- NBC News: contributor fake-crime GoFundMe scams; Patch Media $1.75M settlement (2022); Emmerich Newspapers settlement (2021)
- NBot announcement (2025-05-29); iOS/Play listings (4.7★/773k; 4.2★/330k); CCPA "Don't Sell My Info" link
- 32.2M US visits Aug-2025 (prior-run digest, flagged "carried")

### 7.12 Flipboard + Surf (§4.11)

- flipboard.com; Surf app (BETA counters: 550,267,541 posts / 300,235 feeds, 2026-09-24)
- Flipboard blog: Mastodon beta (2023-02-28); 2024 ActivityPub federation announcements; social websites (2026-04-03)
- TechCrunch Surf/Starter Sets (2025-05-22); Digiday (2018-08-27 — the 145M MAU source, flagged stale)
- Axios via Nieman Lab (24 staff / 21% layoffs, Oct-2022 dating ambiguity carried); Play/App Store reviews 2025–26 (ad quality)

### 7.13 Particle (§4.12)

- particle.news (+ robots.txt capture 2026-09; /methodology, /ai, /faq, /publishers — 404s; web ad-tech consent banner)
- Launch/funding press (Nov 2024): $10.9M Series A — Lightspeed + Axel Springer, Reuters partnership; $4.4M seed 2023
- US App Store (4.76★/1,236) vs Yahoo News 68,543 (the 55× comparison); Play (4.4★/82)
- Wisp review (2026-08, disclosed conflict) — "managing a dashboard" critique

### 7.14 Syft (§4.13)

- syft.ai (canonical domain; getsyft.com is a GoDaddy for-sale page — verification-pass correction)
- App Store / Play listings (IAP ladder: $0.99/wk · $9.99/mo · $79.99/yr · $19.99/mo · $159.99/yr)
- Funding press (Jun 2025): $11M @ $100M — Toki product, not Syft; Orion Arm Pte Ltd registry context
- Play reviews 2026 (3.0 backlash, churn-to-Inoreader); mwm.ai download estimate; AppBrain (stale figure, superseded)

### 7.15 Emerging cohort (§4.14–4.22)

- Current: terrygodier.com/current; App Store; TechCrunch (2026-02-19); Byline author-metadata spec
- Kagi News: blog.kagi.com (2025-09-30 launch); help.kagi.com/kagi/news; github.com/kagisearch/kite-public (MIT, 1,075★); kite.kagi.com/kite.json (CC BY-NC 4.0); App privacy label (Data Not Collected)
- Reeder: reederapp.com; TechCrunch (2024-09-23); App Store (new + Classic)
- Inkl: App Store; TechCrunch (2014-12-12); LinkedIn (Mishra/North Base Media $250k seed)
- Zetik: App Store (IAPs — store beats AppBrain per verification-pass); newsbang.ai
- Newsreel: App Store; newsreel.co/press; Kickstarter ($54,839/217); Forbes (2026-05-15 — paywall respected, snippets only)
- Readless: readless.app/about, /pricing
- Wisp: iTunes lookup API; wisp.news/blog (2026-04-07 release)
- Watchlist: boringreport.org + App Store (4.72★/465; Android beta lead-verified); Play (Drooid); Jarayid (2026-09-10 release); FreshRSS GitHub (16,126★, v1.30.0 2026-09-09); Miniflux ($15/yr hosted); Unread/Stringer/Liferea (ecosystem context)

### 7.16 Indirect competitors (§3.2 defenses)

- Google News/Discover/AI Mode, Apple News+, MSN/Copilot, Yahoo News + Scout: 2026 product-page gaps per angle-08 notes
- 1440 Media + newsletter cohort: subscriber-count claims and 2026 positioning (§3.2)
- AI chatbots as news interfaces: 2026 usage surveys (angle-07/08 notes)
- Hamilton AI (publisher first-party AI): product page (2026)

# ═══ FILE: 09-architecture-plan.md ═══

# 09 — Software Architecture Plan: FOSS Micro-Library Composition for "Plumb"

**Date:** 2026-09-23 · **Product:** Plumb (05) · **Founder profile:** solo full-stack + DevSecOps engineer.
**Design constraints (from the concept):** local-first storage, E2E-encrypted optional sync, provenance/C2PA, multi-protocol ingest, bounded compute budget (<$10/mo at MVP — 10), self-hostable relay, boring craftsmanship tech. **Composition principle:** small, single-purpose, FOSS libraries glued by our own thin code — no monolith frameworks, no vendor SDKs deeper than a wrapper. Every dependency must be *replaceable behind an interface* (the exit-door test: swap cost < 1 week).

---

## 1. System Overview

```
                        ┌─────────────────────────────────────────────┐
                        │              CLIENTS (local-first)          │
                        │  Expo/React-Native app (iOS, Android)       │
                        │  PWA (web) · shareable public cluster pages │
                        │  SQLite (CRDT doc store) · FTS5 index        │
                        └───────────────┬─────────────────────────────┘
                                        │ HTTPS (JSON) + E2E sync (Automerge)
                                        ▼
        ┌────────────────────── EDGE / API TIER (Cloudflare Workers or VPS) ─────────────┐
        │  Hono router → auth (passkeys/WebAuthn) → feed-subscription API · cluster API  │
        │  Push gateway (FCM via firebase-admin · APNs via node-apn)                     │
        │  Sync relay (Automerge-repo / y-websocket pattern; ciphertext-only)             │
        │  Inbound email worker (newsletter ingest)                                       │
        └──────┬─────────────────────┬───────────────────────┬──────────────────────────┘
               │ queue (Queues/BullMQ)│                      │ object store (R2/S3/LW-OS)
               ▼                     ▼                      ▼
        ┌──────────────────────────────────────────────────────────────┐
        │                  INGEST & ENRICHMENT PIPELINE                │
        │  poller (conditional-GET) → parse (rss-parser/fast-xml)       │
        │  → readability extract (@mozilla/readability → Turndown)      │
        │  → language detect (franc) → translate (optional)             │
        │  → embed (ONNX MiniLM local · or hosted open-weights)         │
        │  → cluster (HDBSCAN-ish incremental grouping)                 │
        │  → corroboration scorer · provenance extractor (C2PA c2pa-js) │
        │  → alert evaluator (budget + ≥3-source gate)                  │
        └──────┬───────────────────────────────────────────────────────┘
               ▼
        ┌──────────────────────────────────────────────────────────────┐
        │  STORES: D1/libSQL or Postgres+pgvector (metadata, clusters)  │
        │  R2/S3-compatible (raw payloads, images) · Valkey (queues,    │
        │  rate-limits, dedupe bloom) · Iceberg/Parquet cold (V3 B2B)   │
        └──────────────────────────────────────────────────────────────┘
```

**Two deploy targets, one codebase:** (A) Cloudflare edge (Workers+D1+R2+Queues — the $5/mo MVP path) and (B) the LiquidWeb VPS via Docker/Podman compose (Node + libSQL/Postgres + Valkey + MinIO-compatible S3 target = LiquidWeb Object Storage). All storage/queue accesses sit behind `StorageAdapter` / `QueueAdapter` interfaces (§8). This is what makes the 0→10k→1M staging in 10 a re-config, not a re-write.

---

## 2. Layer-by-Layer Stack (FOSS micro-libraries, with alternatives)

### 2.1 Client

| Concern | Choice | Alternatives considered | Why |
|---|---|---|---|
| App framework | **Expo (React Native) + EAS** | Flutter; Kotlin Multiplatform; Capacitor-only | TS everywhere (one language across client/server/pipeline — solo-dev leverage); OTA updates (craft-gate hotfixes); KMP lacks the JS/TS ecosystem for CRDT+C2PA libs; Capacitor-only weakens native push/notifications budget UX |
| Local store | **SQLite via `@op-sqlite`/`expo-sqlite`** + **Automerge** docs | WatermelonDB; Realm; PouchDB | SQLite = the local-first substrate (FTS5, mature); Automerge gives CRDT merge semantics for sync without server conflict logic |
| Query/state | **TanStack Query + Zustand** | Redux Toolkit; MobX | Boring, small, composable |
| UI kit | **Tamagui** (or StyleSheet primitives) | NativeWind; RN Paper | Theming + performance + no framework lock |
| Reading view | Custom (typography module) | react-native-render-html | Rendering fidelity is the product; own it |
| FTS | **SQLite FTS5** (client) | Lunr; MiniSearch; Typesense server | Local search must work offline; FTS5 is in the substrate |
| Web app | **Vite + React (PWA)** via `vite-plugin-pwa` | Next.js/Astro app | Astro reserved for marketing (static); app PWA needs SPA-ish interactivity; no framework server needed |
| Marketing site | **Astro** (static, zero-JS islands) | Next; Eleventy | 60KB budget hero (05 §6.1); view-source-clean |
| CRDT sync client | **Automerge-repo** (`@automerge/automerge-repo`) network+indexeddb adapters | Yjs + y-websocket; Electric SQL; PowerSync | Automerge-repo ships the exact repo/sync pattern; Yjs equal-first choice (Yjs swifter, Automerge doc-model cleaner) — decided by spike at MVP week 2 |
| Crypto (E2E) | WebCrypto + `libsodium.js` (tweetnacl alt) | — | Standard primitives only; keys never leave device |
| C2PA client | **c2pa-js** (C2PA's own FOSS tooling) | — | Verify publisher manifests; sign share cards |
| Push client | `react-native-push-notification` (or Expo Notifications) | — | Budget UX (user-set caps enforced client+server) |

### 2.2 API / edge tier

| Concern | Choice | Alternatives | Why |
|---|---|---|---|
| Router/runtime | **Hono** (runs on Workers *and* Node/Bun) | Fastify; Express; Elysia | Same code on edge and VPS — the dual-target keystone; 12kB, middleware micro-composable |
| Validation | **Zod** (+ `@hono/zod-validator`) | TypeBox; Valibot | Schema reuse client/server; Zod is lingua franca |
| Auth | **WebAuthn/passkeys** via `@simplewebauthn/server` + OAuth (Apple/Google) minimal | Magic links (SES); password+Argon2 | Passkey = craftsmanship + security posture; email fallback kept for Team/Edu contexts |
| Rate limiting | `hono-rate-limiter` + Valkey token bucket | — | Protects poller and API |
| Push gateway | `firebase-admin` (FCM) + `@parse/node-apn` (APNs) | — | Both free (10 §LLM/push costs); APNs lib is the maintained FOSS one |
| Sync relay | **Automerge-repo sync server** (WebSocket) behind `uWebSockets.js` or Workers Durable Objects | y-websocket; Phoenix channels | Ciphertext-only relay (server never sees plaintext docs); DO variant for edge target |
| Email ingest | Cloudflare **Email Workers** (edge) or **Postal** (self-hosted on VPS) | Mailgun; SES inbound | FOSS self-host path + edge path both covered |
| Secret handling | SOPS + age; Workers secrets / Doppler-alt | Vault (overkill) | DevSecOps-practical |

### 2.3 Ingest & enrichment pipeline (the heart)

| Stage | Choice | Alternatives | Why |
|---|---|---|---|
| HTTP fetch | `got` (Node) / `undici` with conditional-GET (ETag/If-Modified-Since) | axios; node-fetch | 304-aware polling = the RSS politeness + bandwidth law (operator norm: hourly convention, one shop polled ~3M feeds/day adaptively) |
| Feed parse | **`rss-parser`** + **`fast-xml-parser`** for Atom/edge cases | feedparser (C); rss2json | Pure-JS, tolerant of broken feeds (the real-world requirement) |
| JSON Feed / OPML | `@rss3/...`? no — **`opml-lang`** + hand-rolled JSON-Feed (spec is tiny) | — | Micro-format parsers are 100-liners; own them |
| HTML→text | **`@mozilla/readability`** (jsdom context) + **Turndown** → Markdown | Mercury (unmaintained); trafilatura (Py) | Readability = battle-tested FOSS; Markdown as canonical body format (provenance-preserving, diffable, exportable) |
| Robots/prefs respect | `robots-parser` + AI-prefs (e.g., llms.txt-style) checker | — | Supply-side law (03 S5) — compliance as code |
| Language detect | **`franc`** | cld3 (Py) | 60-line-usage FOSS, 82+ languages |
| Translate (optional) | Hosted open-weights (Together/Groq ~$0.09–0.15/1M in) or **Argos Translate** (offline, FOSS) | LibreTranslate (self-host FOSS) | Original-language link ALWAYS preserved (05 §2.3) |
| Embeddings | **`@xenova/transformers`** (ONNX MiniLM-L6, runs on VPS CPU or Workers AI) | OpenAI/Gemini embeddings; fastembed | Open-weights, local-capable, ~384-dim vectors; swap-behind-interface for hosted |
| Incremental clustering | Custom: ANN over embeddings (**`hnswlib-node`**) + time-boxed agglomerative merge + cosine re-score | DBSCAN batch; topic models | News clusters are ephemeral: cluster-within-48h-window keeps the index small and the math honest |
| Corroboration scorer | Custom (source-count, wire-marker, outlet-independence graph) | — | The ≥3-source alert gate lives here |
| Dedupe | Valkey bloom filter (`rebloom`) + content-hash (simhash via `simhash-js`) | full NLP dedupe | Cheap, stateful, correct-enough |
| C2PA verify | **`c2pa-js`** on fetched images/articles where manifests exist | — | Provenance pillar (BO1) |
| Scheduling | Cron: Workers Cron Triggers / **`node-cron`**+systemd timers (VPS) | BullMQ repeatables | OS-level cron = boring and inspectable |

### 2.4 Stores

| Concern | Choice (edge path) | Choice (VPS path) | Why |
|---|---|---|---|
| Relational + FTS + vectors | **Cloudflare D1** (SQLite) + **Vectorize** | **Postgres + pgvector + FTS5→tsvector** (or libSQL server) | SQLite-family end-to-end symmetry with clients; pgvector benchmark ~$50/mo @1M vectors (10) if VPS+RDS; on-VPS Postgres is $0 incremental |
| Object store | **R2** ($0.015/GB, free egress) | **LiquidWeb Object Storage** ($0.08/GB, S3-compatible, endpoint objects.liquidweb.services) — or MinIO on VPS | Raw article payloads/images; both S3-API so adapter is trivial |
| Queue | **Cloudflare Queues** (1M ops incl.) | **Valkey + BullMQ** | Valkey = the FOSS Redis lineage (post-license-change choice) |
| Cache/ratelimit | KV / DO | Valkey | — |
| Cold/analytical (V3) | — | **DuckDB** over Parquet on object storage | The B2B dataset's query engine; single-binary, devastatingly effective at this scale |

### 2.5 Observability & ops (the DevSecOps flourish)

| Concern | Choice | Notes |
|---|---|---|
| Metrics/traces | **OpenTelemetry** SDK → Grafana LGTM stack (self-host on VPS) *or* Axiom/Cloudflare Workers analytics early | OTel = portable by definition |
| Logs | `pino` → Loki (VPS) / Workers logs | Structured from day 1 |
| Uptime | **Uptime Kuma** (FOSS) watching the public endpoints | Status page = public trust surface |
| Error tracking | **GlitchTip** (FOSS Sentry-compatible) self-host; Sentry SaaS acceptable later | Client crash reports opt-in only |
| Analytics (product) | **Umami** or **Plausible** self-host; **session-less, cookie-less** | Practices the zero-telemetry law; numbers published quarterly in transparency report |
| CI/CD | GitHub Actions → EAS (mobile) / Wrangler (edge) / Docker compose push (VPS) | Signed artifacts: cosign |
| SBOM + scan | **Syft** (SBOM) + **Grype**/Trivy in CI; `npm audit` gates | SBOM published per release (receipts!) |
| Fuzzing the parsers | `fast-check` property tests on feed-parsing edge cases | The pipeline's front door is the internet's worst XML |
| Threat model | STRIDE one-pager per tier, public (docs/repo) | Marketing *and* engineering |

---

## 3. Data Model (core entities — abbreviated)

```
Feed(id, url, protocol[rss|atom|json|at|ap|newsletter|yt|pod], cadence, etag, last_modified, health)
Item(id, feed_id, url_hash, title, lang, body_md, published_at, c2pa_manifest?, fetch_meta)
Cluster(id, window_start, embedding_centroid, title_ai?, ai_labels[], corrobor_score, item_ids[])
Source(outlet_id, name, ownership, funding, raters_json, corrections[] )   // V2 panels
AlertPolicy(user_id, topic_id, budget_share) · UserState(doc: Automerge CRDT)
ExportBundle(opml + reads+saves+annotations as JSON, generated client-side)  // the one-button law
```
Canonical formats: Markdown bodies, ISO-8601 UTC timestamps, hashes (SHA-256) for dedupe, embedding vectors stored with **model+version tags** (provenance applies to our own ML — the AI register is a column, not a doc afterthought).

---

## 4. The Sync Design (the hardest part, designed early)

- **Documents:** each user's state (subscriptions, read/saved/annotations, notification prefs, UI prefs) is one **Automerge document** per device-group, encrypted client-side (libsodium sealed box to the user's key, keys derived from passkey-attested local secret — server stores ciphertext + opaque version vectors only).
- **Relay:** Automerge-repo WebSocket sync server (edge: Durable Objects per-user, ~100KB docs — inside DO free-ish envelope; VPS: `uWebSockets.js` + systemd). Conflict-free by construction; offline-first by construction.
- **Server-side user data = none beyond ciphertext + billing.** Data-map stays a one-page diagram forever.
- **Why not Electric SQL/PowerSync:** heavier, vendor-coupled; exit-door test fails. Automerge is a library, not a platform.
- **Cloud-Bundle Sync (named fallback — panel amendment 2026-09-23):** if the relay is not G0-grade at the V1 gate, GA ships with client-encrypted Automerge bundle exchange via the user's own cloud drive (iCloud/Dropbox) or manual file handoff — degraded cadence, identical privacy posture (server still sees nothing) — and relay GA re-gates to a bounded 90-day post-V1 milestone. Also pre-decided by the same ruling: V1 scope cut order puts sync last.

---

## 5. Capacity & Cost Sanity (ties to 10)

| Workload | MVP (≤5k users) | 10k DAU | 1M DAU |
|---|---|---|---|
| Polling 5k feeds hourly with 304s | ~120k req/day ≈ 3.6M/mo — **inside Workers Paid's 10M incl.** | 50k feeds → 36M/mo → ~$8/mo overage | 500k feeds → 360M/mo → edge poller on VPS+Bandwidth (ingress free on LW) + regional shards |
| Embeddings | 10k articles/day × MiniLM CPU on VPS ≈ minutes of CPU | same, batched nightly | hosted open-weights bursts; ~$0.0004/article class |
| Storage | D1 GB-scale ≈ $0 | libSQL/Postgres on VPS 50GB | R2/S3 ~TB-class, $15–800/mo band |
| Push | $0 (FCM) + APNs $0 (dev acct $99/yr) | same | same (FCM scales free) |
| Total fixed | **≈$5/mo + $99/yr Apple** | ~$25–45/mo | see 10 stage-3 |

---

## 6. Security Architecture (DevSecOps founder lens)

1. **Perimeter:** Cloudflare proxy (free tier) in front of VPS path; mTLS between poller and stores; CSP strict-dynamic + frame-ancestors 'none' on app domains; HSTS preload.
2. **AuthN/Z:** passkeys (WebAuthn L3) — no passwords to leak; per-device tokens; least-privilege service tokens for pipeline stages (poller can write items, not read users).
3. **Supply chain:** lockfile + pinned digests; Renovate bot; Syft SBOM per release; Grype CI gate (fail on high, ticket on medium); `npm provenance` attestations; cosign-signed container images.
4. **Input hardening:** all external content (feeds, HTML, email) treated hostile: jsdom sandbox (no scripts, no requests), size caps, timeout budgets, EXIF/geodata stripped from cached images (privacy of *sources* too), SSRF guard on user-added feed URLs (deny RFC1918/metadata IPs — the classic reader CVE class).
5. **E2E posture:** server breach yields ciphertext + feed URLs, not reading histories (design goal, threat-modeled).
6. **Public artifacts:** security.txt, disclosure policy, per-release SBOM + threat-model repo — receipts as security marketing (05/06).
7. **Backups:** VPS path — Acronis (LW's managed, from $7/mo) + logical dumps to Object Storage (S3 API); edge path — D1 exports + R2 versioning. Restore drills quarterly (documented).

---

## 7. What's Deliberately NOT in the Stack (rejections with reasons)

| Rejected | Reason |
|---|---|
| Kubernetes (any flavor) | Solo operator + no LW managed-K8s (docs confirm support-matrix wording only); compose/systemd is inspectable at our scale; revisit >1M DAU (10 stage 3 evaluates ECS/EKS *then*) |
| Firebase (beyond FCM) | Vendor gravity; local-first contradicts it |
| Mongo/Dynamo | Relational+FTS is the right shape; D1/pg both cover it |
| Elasticsearch/OpenSearch | Ops weight; FTS5/pg-tsvector + recency ranking suffices to 10k DAU; Meilisearch the escape hatch if ranking demands it |
| LangChain et al. | The pipeline is 8 small steps; a framework here is dependency without leverage (the micro-library thesis) |
| GraphQL | One client, one team — REST+Zod is boring and cacheable |
| TailwindNative/SwiftUI/KMP dual-native | Team of one; TS everywhere wins the throughput argument |

---

## 8. Adapter Interfaces (the portability contract)

```ts
interface StorageAdapter { items; clusters; feeds; sources; /* D1 | libSQL | Postgres behind this */ }
interface ObjectStore { put/get/sign (R2 | LW-OS | MinIO) }
interface QueueAdapter { enqueue; consume (CF Queues | BullMQ) }
interface Embedder { embed(texts[]): Vec[] /* ONNX local | hosted open-weights */ }
interface PushGateway { send(device, payload) /* FCM | APNs */ }
interface MailInbound { parse(raw): NewsletterIn /* Email Worker | Postal */ }
```
Rule: **no `import` of a vendor SDK outside its adapter module** — CI-enforced by an import-linter rule (craftsmanship as a lint config).

---

## 9. Build Sequence (matches 07's ladder)

1. **Weeks 1–2:** spike — Automerge-repo vs Yjs sync decision; op-sqlite + FTS5 skeleton; rss-parser → SQLite poller running on the VPS (prove the LW path before the edge path). **Plus an E2E key-management/recovery spike (panel amendment 2026-09-23):** WebAuthn gives assertions, not derivable secrets, and PRF-extension support is uneven across authenticators — pre-decide the explicit recovery-key fallback *here*, not at V1.
2. **Weeks 3–6:** MVP scope (07 §1) — clustering v0 (MiniLM + hnswlib), Today brief, notification budget, export/import.
3. **Beta:** newsletter ingest + PWA + C2PA cards + Founder-license billing.
4. **V1:** sync relay GA, Pro paywall, translation, per-element AI labels.
5. **V2/V3:** corrections/ownership panels (dataset accrual), county pilot tooling (verification workflow UI), DuckDB/Parquet export layer for the B2B API.

---

## 10. Risks & Unknowns (engineering-grade honesty)

| Risk | Mitigation |
|---|---|
| Automerge doc growth over years of reading history | Document-splitting strategy (monthly doc rotation + summary docs) — spike at week 2 |
| Workers CPU limits vs ONNX embeddings | Embedder adapter → hosted open-weights fallback ($0.0004/article band) |
| jsdom memory on pathological pages | Size caps + `undici` timeouts + worker recycling (BullMQ concurrency 1 per queue lane) |
| c2pa-js maturity on non-image assets | Images first ( manifests most common there); articles via publisher RSS `<c2pa:manifest>` if/when |
| Apple review friction on "external purchase" language | Annual-first via web checkout (RevenueCat present but web-primary) |
| LW Object Storage 15TB ceiling (10) | R2 fallback behind the same adapter; cold tier compaction (Parquet) |
| E2E key recovery = support trap (users lose devices + passkeys; WebAuthn-PRF uneven) — panel-flagged 2026-09-23 | Week-2 spike (§9); explicit recovery-key fallback pre-decided; Cloud-Bundle Sync as degraded mode (§4); key-recovery contacts per 1k users tracked as a G3 metric (07 §0) |
| Mobile WebSocket lifecycle (Automerge-repo maturity on iOS/Android backgrounding) | Real-device spike at week 2; reconnect/backoff budget in the sync client; app-foreground catch-up sync as the honest fallback |
| Relay SLO/ops burden for a solo founder (24/7 WebSocket fleet) | DO-per-user on the edge path; VPS path documented but optional; relay GA behind G0-grade measurement with the Cloud-Bundle Sync 90-day window as buffer |

---

*Cost figures cited here are sourced in 10 (deployment plans); product laws are 03 §5; feature priorities per stage are 07. Library choices are current as of 2026-09 and each names its alternative — re-verify health/activity at build time (the exit-door test makes staleness a swap, not a crisis).*

---

# ═══ FILE: 10-deployment-plans.md ═══

# 10 — Deployment Plans: 0 DAU → 10,000 DAU → 1,000,000 DAU+

**Date:** 2026-09-23 · **Product:** Plumb (05), architecture per 09.
**Starting point (the founder's existing server):** Liquid Web Managed VPS — AlmaLinux 9.8 (Olive Jaguar) 64-bit, cPanel Fully Managed (license tier **Admin 5** = max 5 cPanel accounts), **2 vCPU / 2 GB RAM / 50 GB disk / 10 TB/mo outgoing bandwidth**, root SSH, WHM, Softaculous.
**Grounding rule honored:** every Liquid Web capability claim below cites liquidweb.com help-docs/tariff/pricing pages — all re-verified **live** on 2026-09-23 (the tariff's $0.25/GB overage and the VPS ladders were re-fetched, not Wayback-only). Cloud/PaaS figures cite the vendor pages captured in the deploy-costs digest (scratch notes, 2026-09-23).

---

## 0. The Physics of the Existing Server (what the docs actually say)

| Constraint | Documented behavior | Source (live 2026-09-23) |
|---|---|---|
| Bandwidth metering | **Only outgoing counted; incoming free** ("Incoming data transfer will not be counted" / "unlimited inbound bandwidth") | Tariff + Cloud VPS bandwidth help-doc (dateModified 2026-02-27) |
| Overage | **Billed at $0.25/GB (~$250/TB), not throttled** — worst case if you blew all 10TB: ~$2,500 | Tariff, verified verbatim live |
| Your spec vs current lineup | 2c/2GB/**50GB**/10TB matches **no** 2026 tier — it's legacy/grandfathered. Nearest Managed VPS today: 2c/2GB/40GB = **$14.75 intro → $59/mo list**; upgrades bill at **list** (intros are new-accounts-only) | /pricing hub, live |
| Upgrade path | Self-service **Resize** (CPU/RAM/storage, reboot to finish) documented for Cloud VPS/Cloud Dedicated/Cloud Metal; Managed VPS moves via the pricing ladder | Resize help-doc (page modified 2025-07-02) |
| Support scope | Fully Managed covers panel ops, backups *assistance*, SSL, key-service troubleshooting — **not** your app code, workers, or custom cron | Management-levels help-doc (dateModified 2026-02-05) |
| Node.js | Stock AlmaLinux lacks CloudLinux → use cPanel **Passenger Application Manager**; raise WHM Tweak Settings "Max cPanel process memory" 768MB → **≥1024MB** for npm installs | LW blog: Configure/Deploy Node.js (Passenger route) |
| DDoS | **2 Gbps L4 volumetric included**; L7/bigger = paid add-on | Management-levels help-doc |
| Backups | Acronis from **$7/mo** (quota adjustable, LW- or Acronis-hosted) | Acronis for Cloud VPS help-doc + storage add-ons page |
| Object storage | S3-compatible **$0.08/GB/mo**, 5GB min–15TB max, endpoint `objects.liquidweb.services`, 3-copy | Cloud storage add-ons page, live |
| Block storage | $0.10/GB/mo (5GB–15TB) for disk growth without full resize | same |
| cPanel licenses | Admin 5 = $28/mo via LW (your tier); Pro 30 = $35; Plus 50 = $43 | cPanel/WHM add-ons page, live |
| Load balancers | Cloud LB 1Gbps/10k sessions (2–10 servers); Dedicated 10Gbps/100k+ — **quote-based** | LB add-ons page, live |
| Kubernetes | **No managed K8s product** — "supported" only in the sense that they'll help you run it yourself | Container-hosting page, live |
| Email | No documented numeric hourly cap anywhere in LW docs (critical gap); caps live in cPanel Tweak Settings ("Max hourly email per domain") — untested on this box; AUP requires closed-loop opt-in + CAN-SPAM | Tariff/AUP + help-docs survey |
| Cloud Sites | Marketing pages now 404 (docs alive) — do not build on it | live check |
| Ops reality | cPanel coexists fine with root-level systemd services; the panel's own stack (MariaDB/dovecot/exim if enabled) eats RAM — trim it (below) | LW docs + standard AlmaLinux practice |

**The strategic read:** this box is an excellent **pipeline machine** (ingest is free, 10TB outbound is generous, root SSH means systemd/Docker/Podman all work) but a poor **public API server** at scale (2 vCPU, 2GB RAM, DDoS ceiling 2Gbps, $0.25/GB beyond 10TB). Every stage below therefore keeps the LW box on ingest/pipeline duty as long as possible and moves the reader-facing hot path to egress-free infrastructure early.

### 0.5 Panel corrections to this plan's arithmetic (judge panel Q1, 2026-09-23)

1. **Stage-0 inbound bandwidth was overstated 33× as written** (600 feeds/hr × 250KB = 108GB/mo, not 3.6TB/mo) — corrected in §1. The conclusion (ingress free under the tariff) stands; the error mattered because it inflated perceived headroom for the polling fleet.
2. **The fleet-realistic conditional-GET 304 rate is 65–85%**, not the drafted 85–90% (the upper bound is best-case single-operator behavior, not a mixed-feed fleet).
3. **DAU-based staging mis-models polling load.** The load-bearing variable is **unique feeds polled**, not users: a guardrails-bounded "unlimited feeds" tier (the six guardrails in 05 §2.6) means each stage's graduation triggers gain a unique-feed / requests-per-publisher-host / items-enriched axis alongside DAU (amended triggers below).
4. **Feeds-per-user distribution:** 15–60 feeds/user typical, with a power tail bounded by the guardrails (5,000-feed abuse ceiling, freshness-cadence decay beyond ~250–500 feeds, 30–60d dormancy decay).
5. **At 10k DAU the deduped unique-feed set lands ~150k–600k feeds** (15–60/user × 10k users, ×0.6–1.0 overlap factor) — this, not DAU, sizes the Stage-2 pipeline (§3 capacity math amended).
6. **Stage-3 sharding keys on publisher-host affinity, not feed-hash** (§4 amended): politeness budgets and rate limits are per-host; a feed-hash shard map can spread one publisher's requests across N shards and break the politeness contract.
7. **All arithmetic re-runs on Beta (G1) telemetry** before "unlimited feeds" appears in store copy — until then every number here is an assumption, stated inline.

---

## 1. Stage 0 — 0 → ~500 DAU ("The box you already own")

**Doctrine:** zero new fixed cost beyond ~$5–15/mo; the VPS does everything; Cloudflare free tier fronts the world.

### What runs where

| Workload | Placement | Notes |
|---|---|---|
| Marketing site + landing (05) | **Cloudflare Pages (free)** | Static Astro; 60KB budget; zero-JS islands |
| DNS + TLS + DDoS shield | **Cloudflare free proxy** in front of the VPS hostname | Offloads L7 junk before LW's 2Gbps L4 ceiling matters; hides origin IP |
| App API + sync relay + poller + embedder | **The Managed VPS** (systemd units; Node 22 LTS via Passenger or standalone systemd — root SSH allows both; keep cPanel for DNS/mail-legacy) | SQLite (WAL) as metadata+FTS store — *do not* run MariaDB for the app (RAM) |
| Queue/cache | **Valkey** (FOSS Redis) via systemd, `maxmemory 64mb` | BullMQ consumers in-process |
| Objects (article payloads, images) | **Cloudflare R2 free tier** (10GB) → $0.015/GB after | Cheaper than LW Object Storage ($0.08) and egress-free |
| Push | FCM (free) + APNs (free; Apple dev $99/yr) | — |
| Digest email | **AWS SES à la carte $0.10/1k** (sandbox-graduate first) | Do NOT rely on cPanel mail for digests — LW documents no hourly cap; SES is the deterministic path (09 §7) |
| Monitoring | Uptime Kuma (self-host, 50MB RAM) + LW's included managed monitoring/alerts | — |
| Backups | **Acronis add-on from $7/mo** (LW-managed) + nightly `sqlite3 .dump` → R2 (versioned) | Restore drill once, documented |
| Secrets | SOPS+age repo, deployed via systemd `EnvironmentFile` (0600) | — |

### RAM budget (2 GB total — the binding constraint)

| Resident | Budget |
|---|---|
| AlmaLinux 9.8 base + kernel | ~200 MB |
| cPanel/WHM stack (disable dovecot/exim/spamd if mail → SES; keep cpsrvd, named or move DNS→CF) | 450–650 MB |
| Poller (Node, BullMQ worker, concurrency 1–2) | 200 MB |
| API (Hono under uWebSockets, gzip/brotli on) | 120 MB |
| Sync relay (Automerge-repo WS) | 100 MB |
| Valkey | 80 MB (maxmemory 64mb) |
| Embedder (ONNX MiniLM, threads capped at 1) | 300 MB *spiky* — batched hourly, not resident |
| **Committed** | **~1.15–1.65 GB** → keep embedding batches behind a systemd memory-high limit; swap 1GB as shock absorber, alert on swap use |

Tweak list (one-time, from LW docs): WHM Tweak Settings → Max cPanel process memory → 1024MB (npm installs fail at the 768MB default per LW's own Node tutorial); disable unused cPanel services; SQLite not MariaDB; systemd `MemoryMax` on every app unit (DevSecOps hygiene).

### Capacity math (assumptions stated)

- Polling 5,000 feeds hourly with conditional GET: fleet-realistic 304 rates run **65–85%** (§0.5 panel correction — the drafted 85–90% is best-case, not fleet-realistic); effective fetch ≈ 600 full feeds/hr × 250KB ≈ 150MB/hr ≈ **108GB/mo incoming = $0** (tariff: incoming not counted). *Arithmetic corrected 2026-09-23 per §0.5: the original draft said "3.6TB/mo" — a 33× overstatement (150MB/hr × 720 hr = 108GB). Direction of the conclusion is unchanged — ingress is free either way; the error inflated perceived headroom for the polling fleet.* CPU: parsing + embedding ~10k new items/day ≈ ~25 min of 2-vCPU time per day batched. Comfortable.
- Serving 500 DAU × 30 API reads × 15KB (gzipped JSON) ≈ 7GB/mo outbound — **0.07%** of the 10TB bundle.
- R2: 10k articles/day × 12KB md + images 20% × 80KB ≈ ~110MB/day → free tier lasts ~3 months, then ~$1–2/mo.

### Stage-0 monthly bill (incremental)

| Item | $/mo |
|---|---|
| VPS (already owned — sunk) | 0 incremental |
| Cloudflare Pages + proxy + R2 ≤10GB + KV free tier | 0 |
| SES digest (500 DAU, 30% daily digest) ~4.5k/mo | ~$0.50 |
| Acronis backup add-on | $7 |
| **Total** | **≈ $7.50 + $99/yr Apple** |

### Graduate to Stage 1 when ANY of:
- DAU > 400 sustained, or p95 API latency > 300 ms at peak, or CPU steal/uptime > 60% sustained 4h/day
- Embedding batches overflow the RAM ceiling (swap-alerts > 2/week)
- First press cycle scheduled (expect 20–50× traffic spike — Cloudflare cache absorbs static, not API)
- You need Cloudflare Queues/DO/Vectorize (they're Workers-Paid features — $5)
- **Unique-feed axis (§0.5, panel-corrected): >25k unique feeds polled, or >3 requests/day sustained against any single publisher host** (politeness headroom exhausted — graduate the pipeline before you violate crawl contracts, independent of DAU)

---

## 2. Stage 1 — 500 → 10,000 DAU ("Edge front, VPS heart")

**Doctrine:** $5 of Cloudflare Workers Paid buys 10M API reads/mo + Queues + DO + Vectorize with **zero egress fees** — the reader-facing hot path moves to the edge; the VPS remains the ingest/embed/store engine (the thing it's structurally best at: free inbound, root, 10TB out).

### What runs where (changes bolded)

| Workload | Placement |
|---|---|
| **Public API (reads): feeds, clusters, briefs** | **Cloudflare Workers Paid ($5/mo incl. 10M req + 30M CPU-ms; $0.30/M req, $0.02/M CPU-ms after)** — Hono, same codebase as VPS (09 §1 dual-target) |
| **Sync relay** | **Durable Objects** (1M req + 400K GB-s included; per-user DO ≈ 100KB docs) — or stay on VPS WebSocket until DO economics beat ops simplicity |
| **Write path + poller + embedder + clustering** | Still the VPS; Workers **Queues** (1M ops incl.) ferry "fetch-cluster-publish" events edge→VPS via a thin authenticated webhook consumer |
| **Edge cache/KV** | KV (paid: 10M reads incl.) for cluster cards (TTL 60s) — API req to origin drops ~70% |
| Metadata DB | SQLite on VPS remains the source of truth; **D1** optional as a read-replica published by the pipeline (cron push; 25B row-reads included — effectively free at this scale) |
| Objects | R2 (≈ $5–15/mo at this scale; Class B reads 10M free) |
| Email | SES (10k DAU × 30% digest ≈ 90k/mo ≈ **$9**; digest HTML ≤ 40KB) |
| **VPS resize decision point** | If CPU binds first (likely: embedder + parser), **resize is NOT the LW answer for a legacy Managed VPS at list prices** (next Managed tier 4c/4GB = $99/mo list — poor value); instead either (a) move the pipeline to a **Cloud VPS 2c/4GB $17/mo** (self-serve resize family, 3TB out but pipeline egress is tiny; ingest still free), or (b) burst embeddings to **Workers AI / hosted open-weights** ($0.0004/article band — 300k articles/mo ≈ $120 worst case, so cap smartly: embed headlines+first-para only) |
| Push / DNS / TLS / monitoring / backups | Unchanged from Stage 0 |

### Capacity math @ 10k DAU

- API: 10k × 30 reads × 30d ≈ **9M req/mo — inside the $5 Workers inclusion**; +CPU-ms ≈ $1–3.
- VPS CPU: parse+embed 25k items/day ≈ 1–1.5 vCPU-hours/day — fine; the risk is RAM, handled above.
- Outbound from VPS: pipeline→edge publishes ≈ 30–60GB/mo — trivial vs 10TB.
- R2: ~250GB stored + ~15M Class B ≈ **$5–8/mo**.
- DO sync: 10k users × 20 syncs/day ≈ 6M req/mo ≈ **$1** overage.
- **Total: ≈ $25–45/mo** (Workers $5+overage, R2 ~$8, SES ~$9, Acronis $7, KV pennies) — the VPS remains sunk/already-paid, or $17 if migrated to Cloud VPS.

### Graduate to Stage 2 when ANY of:
- DAU > 8k sustained, or sync-conflict/latency complaints (DO doc sizes growing), or pipeline CPU saturated (>70% 4h/day) even after embedding offload
- DB > 30GB or FTS rebuilds > 15min (SQLite ceiling approaching)
- You're hiring/on-call and need managed Postgres PITR (point-in-time recovery) for the dataset asset (the V3 B2B thesis)
- Traffic spike resilience requirement: single-VPS pipeline = single region (US) — EU/Asia p95 degrades

---

## 3. Stage 2 — 10,000 → ~100,000 DAU ("Split plane")

**Doctrine:** separate the planes permanently — edge plane (Cloudflare: API, sync, cache) and pipeline plane (compute you can scale horizontally), with a managed DB between them. The LW box retires from production duty (it becomes staging/monitoring/overflow — or is cancelled; its 10TB/2vCPU no longer fits any critical path).

### What runs where

| Workload | Placement | Cost basis |
|---|---|---|
| Public API + sync (DO) + cache | Cloudflare Workers/DO/KV (unchanged, bigger) | ~$50–150/mo band at 100k DAU (30M req ≈ $9 + CPU-ms $20–60 + DO $10–40) |
| **Pipeline: poller/parser/embedder/clusterer** | **Two credible options, pick by profile:** (A) **LiquidWeb Cloud VPS 4c/8GB $45/mo or 6c/16GB $90/mo** — keeps your LW relationship, root-level control, ingest unmetered, 5–7TB out (ample for pipeline), resize self-serve; (B) **GCP Cloud Run** jobs — free tier 2M req + 180K vCPU-s/mo, then $0.000024/vCPU-s: a 2-vCPU always-on poller ≈ $125/mo, BUT scale-to-zero burst batches (the RSS shape: spiky hourly) typically land **$30–70/mo** | (A) = flat, predictable, no re-platform; (B) = elastic, hands-off. Founder-solo calculus favors (A) — boring wins (09 §7) — until >50k DAU |
| **Metadata + vectors DB** | **Postgres + pgvector, managed:** Neon Launch→Scale ($15→$69/mo, scale-to-zero, branching for staging) or Supabase Pro ($25/mo, 100k MAU incl. auth) — Supabase wins if you want auth+storage bundled; Neon wins on pure-Postgres cleanliness. Vectors at 5M × 384-dim ≈ 7.5GB → pgvector fine (no Qdrant needed until ~10M+, where Qdrant Cloud ~$65/mo benchmarks ahead) | $25–69/mo |
| Objects | R2 (500GB–2TB band ≈ **$10–35/mo**, still zero egress) | |
| Cold/analytical | DuckDB over Parquet in R2 (the B2B dataset staging per 09 §2.4) | ~$0 incremental |
| Email | SES: 100k DAU × 25% digest ≈ 750k/mo ≈ **$75–120** (à la carte $0.10/1k; 2026 Essentials plans would cost MORE at this volume: $0.16/1k) | |
| Push | FCM $0 / APNs $0 | |
| Observability | Grafana LGTM self-host on the retired LW VPS (it's perfect for this: always-on, root, already paid) + OTel | sunk |
| **AWS vs GCP at this stage** | AWS plays one role: SES (cheapest credible transactional/digest email; GCP has no SES equivalent — SendGrid/Mailgun 3–5×). GCP plays one role: optional Cloud Run bursts. Neither justifies a full landing yet | |

### Capacity math @ 100k DAU

- API: 100k × 30 × 30 ≈ 90M req/mo → $27 req + CPU-ms ~$40–80 + DO ~$30–60 ≈ **$100–170/mo edge total**
- Pipeline: 100–200k feeds polled (users bring feeds; dedupe overlap ~60%) — **panel-corrected band (§0.5): 15–60 feeds/user × 100k DAU after dedupe lands ~150k–600k unique feeds** — 4c/8GB handles ~50k feeds/hr with 304s (operator norm: one coordinated system polled ~3M/day); beyond → add second LW Cloud VPS ($45) or Cloud Run burst. The upper band (600k) is the sizing case, not the DAU count
- DB: ~150GB Postgres + 5M vectors ≈ Neon Scale ~$69–89
- R2: ~2TB + heavy image reads ≈ $35–60
- **Total: ≈ $250–450/mo** all-in. (The LW Managed VPS is now $0 of production value — keep as staging/monitoring or cancel.)

### Graduate to Stage 3 when ANY of:
- DAU > 80k sustained; or any single plane needs multi-region (EU p95 > 400ms; EU launch per 06 P2 makes this real)
- Pipeline feed-count > 250k (polling fleet territory) or embedding spend > $300/mo (self-host inference decision)
- Dataset/B2B API live with enterprise SLA asks (99.9%+, PITR, audit logs) — G3 gate (07)
- Team size > 3 (managed-everything economics flip)

---

## 4. Stage 3 — 1,000,000 DAU+ ("Cloud-native, edge-first")

**Doctrine:** at 1M DAU the architecture from 09 deploys *unchanged in shape* — the adapters finally pay off. Cloudflare remains the edge (egress-free is worth ~$30–60k/mo at this scale — see math); the pipeline and DB graduate to AWS/GCP managed services; the LW box is long retired from production (and is remembered fondly in the changelog).

### The egress math that decides everything (assumptions explicit)

1M DAU × 30 API reads × 15KB gz ≈ **450GB/day ≈ 13.5TB/mo JSON**, plus images/media ≈ **~100TB/mo** total egress.
- Served from Liquid Web VPS beyond 10TB: 90TB × $0.25/GB ≈ **$22,500+/mo** — physically impossible.
- S3 + CloudFront: ~100TB × $0.085/GB ≈ **$8,500/mo** (after 1TB always-free), plus request costs.
- **Cloudflare Workers + R2: $0 egress, ever** — you pay requests (~1B/mo × $0.30/M ≈ $300), CPU-ms (the real cost: ~$500–2,000/mo tuned), R2 ops+storage (~$200–400). **Total edge plane ≈ $1–3k/mo** for what would cost $8.5–22.5k elsewhere. This single fact drives the Stage-3 topology.

### Topology

| Plane | Service | Why this and not that |
|---|---|---|
| Edge API/sync/cache | Cloudflare Workers (unbound-class CPU), DO per-user sync, KV hot cards, **regional KV prefixes** | Egress-free + already the codebase |
| Static/media | R2 + Cache Rules (unlimited uncached egress: only storage $0.015/GB + ops) | vs S3+CloudFront: saves ~$8k/mo at 100TB |
| Pipeline poller fleet | **AWS ECS on Graviton (Fargate or EC2 ASG)** or **GKE Autopilot**: 10–20 × t4g.small-class workers ($12.26/mo on-demand each; Spot $0.009/hr ≈ $6.5) sharded **by publisher-host affinity, not feed-hash** (§0.5: politeness budgets are per-host — a feed-hash shard map spreads one publisher across N shards and breaks the crawl contract); **or** keep an LW footprint: 3–4 × Cloud VPS 6c/16GB $90 — viable and ~30% cheaper, but you now carry multi-node ops yourself | Container fleet finally justifies orchestration (09 deferred K8s to here deliberately) |
| Inference (embeddings/translation) | Self-host **vLLM on 1–2 GPU nodes** (g5/p4-class spot) or quantized CPU (Groq/Together hosted at 1M articles/day ≈ $400/day — too much; cap + sample instead) → self-host drops unit cost ~50–100× vs hosted open-weights at volume | The Stage-3 embedder adapter swap (09 §8) |
| OLTP + vectors | **Amazon Aurora Serverless v2 (PostgreSQL, pgvector)** or Neon Scale→Business; 1–5TB class, PITR, multi-AZ; pgvector at 50M×384d ≈ 75GB → still fine; Qdrant Cloud dedicated if recall becomes the product | RDS Aurora > self-Postgres at this SLA |
| Warehousing/B2B dataset | **DuckDB/ClickHouse on R2 Parquet** (query-in-place) + Athena/Spectrum only if partners demand SQL-as-a-service | Query-in-place ≈ $0 compute-you-control |
| Email | SES bulk tier (10–100M: $0.14–0.18/1k on 2026 plans — *cheaper than à la carte at volume*); 3M digests/mo ≈ **$420–540** | SES remains the email answer end-to-end |
| Push | FCM $0 / APNs $0 (forever — a lucky constant of the stack) | |
| Observability | OTel → Grafana Cloud or self-LGTM on 2 nodes; sampling at edge | |
| Security/DDoS | Cloudflare Magic-ish posture on free/pro plans + AWS WAF on the pipeline ingress; origin lockdown (only CF IPs reach pipeline LB) | DevSecOps posture continues: SBOMs, cosign, Grype gates unchanged |

### Capacity math @ 1M DAU (monthly, order-of-magnitude)

| Line | Estimate |
|---|---|
| Edge (Workers + DO + KV + CPU-ms) | $1,000–3,000 |
| R2 (storage ~10–20TB + ops) | $300–600 |
| Pipeline fleet (ECS Spot or 4×LW 6c/16GB) | $250–800 |
| Inference (1 GPU spot node or CPU fleet) | $400–1,500 |
| Aurora Serverless v2 (multi-AZ, ~2TB) | $600–1,200 |
| SES 3M emails | ~$500 |
| Observability/security/misc | $300–800 |
| **Total** | **≈ $3,500–8,500/mo** (≈ $0.004–0.009 per DAU/mo) — consistent with the G3 gate target ≤ $0.08/MAU (07 §0) |

**Where Liquid Web fits at Stage 3:** honestly nowhere in the critical path — but two honorable mentions: (a) a Cloud VPS as an out-of-band bastion/monitoring node (cheap, isolated from the blast radius), and (b) the brand story ("we started on one 2GB box") which is worth exactly one paragraph in the press kit (06).

---

## 5. Decision Summary — the whole ladder on one table

| | Stage 0 | Stage 1 | Stage 2 | Stage 3 |
|---|---|---|---|---|
| DAU | 0–500 | 500–10k | 10k–100k | 100k–1M+ |
| **Unique-feed axis (§0.5, panel-corrected)** | ≤5k unique feeds | 5k–600k at the top (guardrails bound the polled set) | 150k–600k unique feeds — the sizing case | multi-M feeds → fleet + host-affinity shards |
| Public API | VPS (CF-proxied) | **CF Workers $5** | CF Workers/DO | CF Workers/DO multi-region |
| Pipeline | VPS | VPS | LW Cloud VPS $45–90 *or* Cloud Run | ECS/GKE fleet + GPU inference |
| DB | SQLite (VPS) | SQLite (+D1 read replica opt.) | Neon/Supabase Postgres $25–69 | Aurora Serverless v2 |
| Objects | R2 free→$2 | R2 $5–15 | R2 $10–35 | R2 $300–600 |
| Email | SES ~$0.50 | SES ~$9 | SES ~$75–120 | SES ~$500 |
| LW VPS role | Everything | Ingest+pipeline | Staging/monitoring (or $17 Cloud VPS) | Retired (optional bastion) |
| **Incremental $/mo** | **~$7.50** | **~$25–45** | **~$250–450** | **~$3.5–8.5k** |
| Trigger to advance | DAU>400 · p95>300ms · spike event | DAU>8k · CPU>70% · DB>30GB · EU latency | DAU>80k · feeds>250k · SLA asks · team>3 | (steady state) |

## 6. Failure/rollback notes (each stage)

- **Stage 0→1 rollback:** edge is additive; repoint DNS to VPS origin (5 min, CF dashboard) — the VPS API build is the same code.
- **Stage 1→2 rollback:** pipeline is stateless behind Queues; Cloud VPS→old VPS is a restore-from-Acronis + replay-queue exercise (test quarterly per 09 §6.7).
- **Stage 2→3 rollback:** the 09 adapter interfaces mean Aurora↔Neon↔pgvector is a schema-compatible move back; the pipeline fleet is replaceable by LW boxes at any time (keep the compose files warm).
- **Data gravity warning:** the one irreversible-ish step is dataset scale (vectors/parquet) — but R2 is the object layer throughout, so even that moves by bucket-sync.

## 7. Sources

**Liquid Web (all live 2026-09-23 unless noted):** Tariff ($0.25/GB overage; incoming free; fee schedule) https://www.liquidweb.com/policies/liquid-web-tariff · Pricing hub (Managed VPS/Cloud VPS/dedicated ladders, intro-vs-list rule) https://www.liquidweb.com/pricing · Cloud VPS page https://www.liquidweb.com/vps-hosting/cloud-vps · Bandwidth help-doc https://www.liquidweb.com/help-docs/hosting-services/cloud-vps/managing-bandwidth-for-your-cloud-vps · Management levels https://www.liquidweb.com/help-docs/portal/support-center/management-and-support-levels · Node.js/Passenger + 768→1024MB tweak https://www.liquidweb.com/blog/configure-deploy-cloudlinuxs-node-js-selector · Acronis backups https://www.liquidweb.com/help-docs/hosting-services/acronis-cyber-backups/acronis-backups-for-cloud-vps · Storage add-ons (Object $0.08/GB, Block $0.10/GB, Acronis $7+) https://www.liquidweb.com/hosting-add-ons/cloud-storage-services · cPanel license ladder https://www.liquidweb.com/hosting-add-ons/cpanel-whm · Resize help-doc https://www.liquidweb.com/help-docs/hosting-services/cloud-vps/resize-a-cloud-server · Cron scheduling https://www.liquidweb.com/help-docs/server-administration/linux/scheduling-php-scripts-with-cron-jobs · Container hosting (no managed K8s) https://www.liquidweb.com/container-hosting · LB specs https://www.liquidweb.com/hosting-add-ons/load-balancer-solutions
**Cloud/PaaS (vendor pages, 2026-09-23):** Cloudflare Workers/KV/Queues/D1/DO/R2/Vectorize pricing https://developers.cloudflare.com/workers/platform/pricing/ + https://developers.cloudflare.com/r2/pricing/ · AWS SES (à la carte + 2026 plans, Wayback 2026-09-05 of aws.amazon.com/ses/pricing/) · EC2 t4g rates (economize.cloud, 2026-08) · GCP Cloud Run https://cloud.google.com/run/pricing · Supabase https://supabase.com/pricing · Neon https://neon.com/pricing · FCM free https://firebase.google.com/products/cloud-messaging · Apple Developer $99/yr https://developer.apple.com/programs/ · Vector-DB benchmarks (Spendark 2026) · RSS conditional-GET norms (HN 29815726).
*Assumptions are stated inline at each computation (reads/DAU/day, gzip sizes, feed sizes, 304 rates); re-run the arithmetic with real telemetry after Beta (07 G1).*
