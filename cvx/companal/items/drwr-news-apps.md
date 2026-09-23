# News-Aggregator App Industry Deep Dive — Combined Deliverables (2026-09-23)

Concatenation of the 11 program deliverables in reading order (00→10). Each section is the complete, current file; per-section provenance, conflict registries, and source lists are preserved inline. Generated 2026-09-23.


---

# ═══ FILE: 00-executive-summary.md ═══

# 00 — Executive Summaries: US, EU, Asia (News-Aggregator App Industry, September 2026)

**Date:** 2026-09-23 · **Program:** news-aggregator-industry-deep-dive · **This file:** the three market summaries that open the deliverable set (01 leaders · 02 forecast/TAM · 03 gaps · 04 SWOT · 05 concept · 06 GTM/monetization · 07 release · 08 link-in-bio · 09 architecture · 10 deployment).
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
4. Every scale number in this market is self-reported or stale; build your own instrumented truth and say so loudly — it's a trust differentiator nobody in the leader set can credibly copy (see 08 §10.2 for the identical pattern in link-in-bio).

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

# ═══ FILE: 08-link-in-bio-competitive-analysis.md ═══

# 08 — Top-20 Link-in-Bio Platforms: Competitive Analysis + Tech-Stack Matrix (2026)

**Report date:** 2026-09-23
**Scope:** The global "link in bio" / creator micro-page SaaS category — 20 live platforms profiled, plus the 2024–2026 consolidation deaths & watchlist.
**Audience lens:** all consumer-facing categories **and** five developer/DevSecOps-lens categories (developer surface, data ownership & portability, security & compliance, reliability signals, internationalization) tracked as first-class matrix rows.
**Provenance & freshness note:** this deliverable is the program-integrated edition of a same-day standalone research run (2026-09-23, `independent_research/2026-09-23-0001_link-in-bio/`). All facts were captured **on this date** from primary pages (official pricing/homepage/help-center fetches) and third-party sources (Sacra, GetLatka, TechCrunch, Tubefilter, Product Hunt, review platforms), archived as raw dumps in `independent_research/scratch/research-link-in-bio-saas-2026-09/scratch/pages/`. A same-day user-count + app-store refresh **was executed 2026-09-23** (US App Store / Google Play plus GB and IN storefront reads, live company homepages, and Semrush traffic lookups) and is folded into §6, matrix rows G1/G2/O1/P1, and footnotes 95–98; two Play-store lookalike misattributions it caught (a `com.getstan` package ≠ Stan; an "app.biolink" listing ≠ bio.link) are struck throughout. Everything below was written from captured sources only; model-memory items are labeled **[GK]** or **[memory]** and are never load-bearing.

**Conflict policy:** where sources disagree, both figures are shown with attribution and never averaged. Unknowns are the literal symbol ❓ with a note of what was checked. A QC pass re-verified every load-bearing numeric claim against the raw dumps before writing.

---

## 1. Market Framing

The link-in-bio market is the creator economy's smallest-looking, most contested front door: a single URL placed in a social profile that routes an audience to links, content, and — increasingly — checkout. What began in 2016–2019 as free utility SaaS (Linktree, Campsite, Lnk.Bio, Milkshake) has bifurcated into three monetization archetypes: **freemium link hubs** ($0–$35/mo subscriptions), **creator storefronts** (subscription plus a 0–9% take rate on sales), and **commerce marketplaces** (pure take rate plus a payments stack). As of 2026 the leader Linktree (70M+ registered users — first-party, not MAU) is pressured from three directions at once: its Nov 2025 price hikes (46–67%) opened a value band competitors are flooding; the fastest-growing player Whop ($142M annualized revenue Oct 2025, $1.6B valuation Feb 2026) monetizes payments rather than pages; and the platform substrate itself is testing away the category (Instagram clickable caption links for Meta Verified users, Mar 2026). A consolidation wave — Linktree's acquire-and-kill roll-up (Bento, Koji, Fingertip), Shopify killing Linkpop, Tap Bio dying Oct 31 2026, Snipfeed absorbed into Planoly — has removed at least five products since 2024 and made **data ownership, portability, and vendor-lifetime risk** a live purchase criterion for the first time.

## 2. Methodology

**Roster construction:** the 20-platform roster was cross-checked against the Product Hunt "link in bio" category (191 products, updated 2026-09-18) and 3+ 2026 alternatives roundups. **No tool appearing in 2+ 2026 roundups was excluded**; single-roundup/PH-tail entrants (Hopp by Wix, Paage, The Leap by Thinkific, own.page, Taap.it, Zaap, YourChamp, Linkrr, Taginbio, hoo.be, Podmu, Canva, Dub, OpenBento) are recorded in the watchlist. Known-dead tools are in the deaths table, not the roster. Some 2026 roundups still list Koji as live — treat any such roundup as unrefreshed.

**Classification defense (2026-current):** about.me, Squarespace Bio Sites, and Later Linkin.bio are **indirect** — in 2026 each is positioned as a feature of a broader product (identity page / website builder / social suite), verified against each fetched 2026 marketing page. Whop stays **direct** despite marketplace-first positioning because its storefront pages are sold and used as the bio-link destination by its 183k+–211k+ sellers (both reads kept, §6). Every other entry sells a standalone bio-page product as its primary 2026 offer.

**Stale-knowledge / recency defense:** every direct competitor's classification is backed by its 2026 product/pricing page fetch (dated in each profile); the two liveness anomalies found are flagged, not papered over: `squarespace.com/bio-sites` 404'd ("Moved") and `linkinbio.later.com` failed DNS at the 2026-09-23 fetch.

**Limitations:** no Comscore/app-store-analytics paid data; no BuiltWith/Wappalyzer scan succeeded (himalayas.app blocked) so tech-stack signals come from job postings, careers pages, Sacra, and DOM/URL-structure inference, each confidence-marked. JS-gated pricing pages (Lnk.Bio, lit.link+, SlashPage Pro/Max, Syft-style) could not be read and are ❓, never guessed.

## 3. Market Overview

### 3.1 The three archetypes

| Archetype | What the customer gets | Revenue model | Roster members |
|---|---|---|---|
| **Link hub (utility SaaS)** | Hosted micro-page of links/blocks under a social profile | Freemium sub $0–$35/mo; some payment pass-through | Linktree, Milkshake, Shorby, bio.link, Lnk.Bio, Campsite.bio, Liinks, Taplink, Solo.to, SlashPage, lit.link, about.me, Squarespace Bio Sites, Later Linkin.bio |
| **Creator storefront (commerce SaaS)** | Page + native checkout: products, courses, bookings, email | Subscription + take rate (0–12% by tier) or 0%-fee subscription | Stan, Beacons, Komi, SuperProfile, Milkshake (partial) |
| **Marketplace (commerce network)** | Storefronts + demand side (discovery feed, brand deals) + payments stack | Take rate on GMV + payments fees + financial services; no seller sub | Whop, Wishlink (brand-commission affiliate) |

### 3.2 Market size (conflicting — never averaged)

Report-mill estimates spread from **$0.4B (2025, marketintelo)** through **$1.12B (2024, growthmarketreports)**, **$1.2B→$3.2B at 14.4% CAGR (strategymrc)**, **$1.62B→$4.24B by 2033 at 13.2% (linkship)**, to **$1.8B→$6.4B at 15.2% (dataintelo)** — a directional band of ~$0.4–1.8B (2024/25) growing ~13–15%/yr, all low-confidence. Bottom-up sanity check from this run's verified revenue: Linktree $42–55.5M + Stan ~$22–40M + sub-$10M tail puts **core link-in-bio SaaS at roughly $250–400M/yr**, with creator-commerce layering $200M+ on top (Whop alone $142M annualized — but Whop is a marketplace whose GMV is mostly not link-page SaaS). The creator-economy headline ($480B, ylink.pro) is rejected as a category TAM.

### 3.3 The consolidation wave

At least five products died or were absorbed since 2024 — detailed in §4.1. The strategic consequence: **vendor-lifetime risk is now a demonstrated, purchasable-against criterion** (Bento users had a finite export window, then permanent data deletion, Feb 13 2026), yet almost nobody in the roster sells against it (see observation 10.5).

### 3.4 Regional structure

Asia is regional-player territory: lit.link (Japan), SlashPage (Korea), Taplink (RU/CIS), SuperProfile/Wishlink (India). No native Korean or Chinese link-in-bio player appears in Western sources (China structurally separate: WeChat/Douyin mini-programs; Xiaohongshu link restrictions). Recurring Asia pain point: **payments** — Stripe-centric platforms leave Asian creators without local-currency checkout. In the EU, GDPR/data-residency posture is an active vendor-marketing theme (linke.ro, alllinks.cc) that none of the US leaders answer.

## 4. Competitor Roster (20 platforms)

| # | Platform | HQ / Region | Type | URL | One-line positioning (2026) | Status |
|---|---|---|---|---|---|---|
| 1 | Linktree | Melbourne, AU | Direct | linktr.ee | Category creator; "everything you are, in one simple link" — links, commerce, sponsored placements | Alive (leader) |
| 2 | Whop | New York, US | Direct (marketplace) | whop.com | Commerce marketplace for "internet entrepreneurs" — storefronts, Discover feed, payments network | Alive (fastest-growing) |
| 3 | Stan | Los Angeles, US | Direct (storefront) | stan.store | All-in-one creator storefront, 0% transaction fees, live in under 10 minutes | Alive (profitable) |
| 4 | Beacons | US (Beacons AI Inc.) | Direct (storefront) | beacons.ai | AI-teammate ("Beam") + storefront/media kit for multi-SKU creators | Alive |
| 5 | Komi | ❓ | Direct (storefront/media-kit) | komi.io | Free mini-site + brand-deal access; email CRM on Pro | Alive |
| 6 | Milkshake | ❓ (AU-made per [memory]) | Direct | milkshake.app | Card-style mobile-first swipable site builder; 5M+ downloads | Alive |
| 7 | Shorby | ❓ | Direct | shorby.com | Marketer smart pages: messenger buttons, retargeting pixels, dynamic feeds | Alive |
| 8 | bio.link | ❓ | Direct | bio.link | One cheap Pro plan with an AI chat assistant on your page; 3M+ creators | Alive |
| 9 | Lnk.Bio | ❓ | Direct | lnk.bio | Minimalist ultra-cheap link hub incl. a lifetime plan (price ❓) | Alive |
| 10 | Campsite.bio | US per [memory] | Direct | campsite.bio | Agency/brand-grade link hub: seats, org tiers, deep analytics; 250k+ users | Alive |
| 11 | Liinks | ❓ | Direct | liinks.co | Bento-style visual link pages; "you're the customer, not the product" | Alive |
| 12 | Taplink | RU/CIS origin | Direct | taplink.at | Micro-landing pages with CRM, payments, AI page generation | Alive |
| 13 | Solo.to | ❓ | Direct | solo.to | Bare-bones bio page from $1/mo; 2FA even on free tier | Alive |
| 14 | SlashPage | South Korea | Direct | slashpage.com | Korean multi-block pages with an "allow LLMs to index" SEO toggle | Alive |
| 15 | SuperProfile | India (by Cosmofeed) | Direct (storefront) | superprofile.bio | India "complete creator toolkit": courses, bookings, AutoDM, WhatsApp | Alive |
| 16 | Wishlink | Gurugram, India (Creatormon Pvt Ltd) | Direct (marketplace) | wishlink.com | Brand-affiliate shops for Indian creators; 250+ brands, 100k+ creators | Alive |
| 17 | lit.link | Japan (TieUps Inc. per primary © 2020; digest says GMO Pepabo — CONFLICT) | Direct | lit.link | Japan's default creator/fandom (推し活) bio page | Alive |
| 18 | about.me | US per [memory] | Indirect (identity page) | about.me | Original personal profile page, pivoting upmarket with Virtual Twin AI + CRM | Alive |
| 19 | Squarespace Bio Sites | US (Squarespace) | Indirect (website-platform feature) | bio.site | Bio page inside the full Squarespace ecosystem | Alive; /bio-sites 404 at fetch |
| 20 | Later Linkin.bio | Canada per [memory] | Indirect (social-suite feature) | linkinbio.later.com | IG-grid-linked pages bundled with the Later suite | Company alive; subdomain DNS failed at fetch |

### 4.1 Deaths & watchlist

| Tool | Vendor / fate | What happened | Date |
|---|---|---|---|
| **Bento** | Linktree (acq. Jun 2023) | Site/app/all user pages offline; **data permanently deleted**; links redirect to Linktree; migration offer = Pro discount; Bento features shipped into Linktree | **Dead Feb 13, 2026** |
| **Koji** | Linktree (acq. from GoMeta Dec 14 2023; ~$40M raised) | Sunset; 3 months Linktree Pro offered; no confirmed data-migration tooling | **Dead Jan 31, 2024** |
| **Linkpop** | Shopify | Shut down; migration to Shopify surfaces | **Dead Jul 7, 2025** |
| **Tap Bio** | Independent | Card-swipe pages; "continues until Oct 31 2026"; migrating to Link in Profile (codes TB50M/TB50Y); Free (2 cards)/Silver ~$3/Gold ~$8 per most sources (Taplink's blog claims $5/$12 — conflict) | **Dying Oct 31, 2026** |
| **Fingertip** | Linktree (acq. 2025) | Sunset; users migrated to Linktree; founders joined to build "LinkApps ecosystem" | **Dead May 1, 2026** |
| **Snipfeed** | Planoly (acq. Jan 24, 2025) | Reborn as "Planoly Creator Store" (Shopify, Printful, PayPal, Stripe, Zoom) | Absorbed Jan 2025 |
| **Carrd** (indirect honorable mention) | Independent | Closest low-cost substitute: free (3 sites), Pro from **$19/yr**, custom domains (Let's Encrypt), forms (Mailchimp/Kit/ActiveCampaign/EmailOctopus), embeds (Stripe/PayPal/Gumroad/Typeform), analytics (GA/Plausible/Matomo) | Alive; permanently relevant on price |
| Watchlist | Hopp by Wix, Paage, The Leap, own.page, Taap.it, Zaap, YourChamp, Linkrr, Taginbio, hoo.be (1.5M+ claim), Podmu, Canva, Dub, OpenBento | Single-roundup/PH-tail entrants; none displaced a roster entry on traction or breadth | Monitored |

## 5. Full Pricing Ladder — all tiers with quotas/limits (2026-09-23 fetches)

Annual-billed per-month prices where offered. Every cell below is from the platform's own pricing page or help center unless marked.

| Platform | Tier | Price | Key quotas / usage limits |
|---|---|---|---|
| **Linktree** | Free | $0 | Unlimited basic links; sell products/courses/brand offers; Linktree branding; restricted themes/analytics |
| | Starter | $8/mo · $6 annual | Personalized page, basic analytics; **9% seller fee** on digital products |
| | Pro | $15/mo · $12 annual | Branding removal; custom themes/fonts/layouts; advanced analytics; mailing-list integrations |
| | Premium | $35/mo · $30 annual | **0% selling fees**; affiliate shop (keep 100%); dynamic links + smart routing; advanced analytics **and data export**; social scheduling; unlimited IG auto-replies |
| | Agency/Enterprise | Custom | Team seats, **SSO**, dedicated support |
| **Whop** | Seller | $0 subscription | No SaaS fee — fee stack instead: **3% base** on direct sales; **0% Discover** marketplace fee (was 30%); cards 2.7%+$0.30 domestic / +1.5% intl / +1% FX; **+0.8% orchestration** (claims 6–10% declined-payment recovery); **BNPL 15%** (10 partners, limits to $42,750, terms to 5 yrs); fraud screening **$0.07/txn**; disputes **$15–29**; payouts $2.50 next-day ACH or 5%+$1 instant crypto/Venmo |
| **Stan** | Creator | $29/mo · $300/yr | Unlimited products and customers; **0% transaction fees** |
| | Creator Pro | $99/mo · $948/yr | Same 0% fees; higher-tier features. No free plan |
| **Beacons** | Free | $0 | Unlimited links, media kit, **9% seller fee**, 5 email automations, 50 email sends |
| | Creator | $10/mo · ~$8.33 annual | Custom domain (1st yr free), advanced SEO, AI text+image, 500 sends |
| | Creator Plus | $30/mo · ~$25 annual | **0% transaction fee**, BNPL for buyers, unlimited emails, memberships |
| | Creator Max | $90/mo · ~$75 annual | Google Workspace, NFC Card, white-glove support |
| **Komi** | Starter | $0 | Custom mini-site; unlimited affiliate links; brand-deal access; **unlimited fan contacts**; unlimited team members |
| | Pro | $16/mo annual (~$20 monthly) | **0% fee** on digital sales; unlimited email campaigns; Meta Pixel; custom domain; priority support. 14-day trial |
| **Milkshake** | Free | $0 | Unlimited links & Cards; sell via Stripe (platform fee % ❓); 30 days insights |
| | Lite | $2.99/mo | Removes branding only |
| | Pro | $6.99/mo · $5 annual | 365-day insights **+ export**; contact-form Card; mailing list (Sheets+Mailchimp); Meta pixel; SEO tools; "lower fees when you sell" (% ❓) |
| | Pro+ | $10/mo qtrly ($29.99/3mo) · ~$8.33 annual | + custom domain; further-reduced sell fees (% ❓) |
| **Shorby** | Rocket | $15/mo · $12 annual | **5 smart pages, 10 links/page cap, no custom domain**; 1 retargeting pixel |
| | Pro | $29/mo · $24 annual ($25 per mobilo — minor conflict) | 50 pages; 5 dynamic feeds; **7 pixels**; GA; custom domain; scheduled blocks |
| | Agency | $99/mo · $82 annual | 250 pages; **10 team members**; 1M tracked clicks; white label. No permanent free tier (5-day trial); **Stripe only** |
| **bio.link** | Free | $0 | Core page |
| | Pro | $7.49/mo (yearly saves 50%) | Unlimited sites & visitors; **AI chat assistant**; custom domain; white-label; posts + email list; QR codes; real-time stats; 15+ themes. 7-day trial |
| **Lnk.Bio** | Free + Premium | ❓ (JS-gated) | "One of the most affordable" incl. a **lifetime plan** per third party (sublyna 2026); no built-in monetization per hoo.be comparison |
| **Campsite.bio** | Free | $0 | Core links |
| | Pro | $7/mo | Unlimited links; archive/restore; bulk management; lock links; 4,000+ icons; analytics (views/clicks/referral/geo); opt-in forms, pixels; custom domain |
| | Add-ons | +$1.50/profile/mo · +$1.50/collaborator | Linear per-seat expansion |
| | Org Pro / Org Pro+ | ❓ | Universal links, member management |
| **Liinks** | Build | $0 | Build free; **publishing requires paid** (14-day trial at go-live) |
| | Starter | $5/mo · $48/yr | Links, images, videos, music embeds, forms, text blocks, folders, social icons; analytics |
| | Pro | $12/mo · $120/yr | + custom domain; **priced per pack of 5 profiles** |
| **Taplink** | Free | $0 | Social/call/SMS/email buttons; text; services; FAQ; map; free themes; QR; view stats |
| | Pro | $4/mo (annual billing) | Images, music, video; price lists; image backgrounds; page analytics |
| | Business | $8/mo (annual billing) | Request/order forms; countdown; custom domain; payment acceptance; CRM; subpages. Monthly prices ❓ |
| **Solo.to** | Beginner | $0 | Dividers, background, basic analytics (**1-month window**), **2FA** |
| | Personal | **$1/mo annual-only** | 50 links; action social buttons; link SEO; background video; scheduled links; cloning; analytics 6 months |
| | Entrepreneur | $5/mo ($6 monthly) | **2 pages**; embeds; custom link images; 100 links+embeds |
| | Professional | $10/mo ($15 monthly) | **5 pages**; analytics 12 months |
| **SlashPage** | Free / Pro / Max | Free / ❓ / ❓ | Pro: custom domain, multilingual translation; GA/Pixel/Sheets on Pro+; LinkedIn Insight "coming soon" |
| **SuperProfile** | Starter | Free | **10% platform fee** on every sale |
| | Premium | ₹11,999/yr | **5% fee** |
| | Pro | ₹49,999/yr | Custom fee; growth manager; branding removal; email + WhatsApp marketing. **Gateway charges extra on all tiers**. Conflict: creatorflow (Feb 2026) describes "$29/mo per Instagram account" — both stated |
| **Wishlink** | Creators | Free | No subscription; brand-side commissions; monthly payouts on brand-confirmed sales |
| **lit.link** | Basic / lit.link+ | Free / ❓ (JS-gated) | Plus: original share image; rich-text links; live video background; opening cover video; extra fonts/backgrounds |
| **about.me** | Free | $0 | Page + yourname link + email signature |
| | Standard | $5/mo ($60/yr) | **Virtual Twin AI**, CRM lead capture, appointment scheduling |
| | Pro | $7.50/mo ($90/yr) | Custom domain; Google Calendar bookings; testimonials/portfolio/video; GA stats + visitor details |
| **Squarespace Bio Sites** | ❓ | $4.99/mo start per creator-hero (Aug 2026) vs "no subscription, 8% per sale" per Stan's table vs free+paid per earlier digest — **all three stated**; primary page 404 at fetch |
| **Later Linkin.bio** | ❓ | Later suite entry ~$18/mo per third-party table (suite pricing, not bio-page pricing) |

**The ladder end-to-end (annual-billed):** $0 free tiers (15 of 20) → **$1** Solo.to → **$2.99** Milkshake Lite → **$4** Taplink Pro → **$5** Liinks/about.me → **$6** Linktree Starter → **$7** Campsite → **$7.49** bio.link → **$8** Taplink Business/Beacons Creator → **$12–15** Linktree Pro/Shorby → **$16** Komi → **$29** Stan/Shorby-Pro-monthly/Beacons Plus → **$35** Linktree Premium → **$90–99** Beacons Max/Shorby Agency/Stan Pro → custom enterprise (Linktree only). Two structural facts: (a) **Linktree's Nov 2025 hike (46–67%) abandoned the $5–12 value band**, now owned by Campsite, Liinks, bio.link, Solo.to, Taplink, Milkshake; (b) **Stan inverted the ladder** ($29 floor, 0% fees) and **Whop deleted it** (no subscription) — the subscription middle is squeezed from both ends.

## 6. Market Data — users/MAU, revenue, app-store rankings (per platform)

| Platform | Users / scale | Revenue (conflicts kept) | Funding / valuation | App-store & review signal |
|---|---|---|---|---|
| **Linktree** | **70M+ registered users — first-party, live on linktr.ee 2026-09-23 (registered accounts, NOT MAU; first-party since ≥ Apr 2025 per TechCrunch; 50M+ milestone May 2024)**; 1.2B monthly unique visitors (getlatka); 1B+ clicks/week; 240M commerce clicks/mo; ~$300M/mo commerce sales (~$6B annual GMV, company-cited); **GB App Store #67 Social Networking**; Semrush **290.96M visits/mo (Aug 2026)** | **$55.5M 2024, +50% YoY** (Sacra; $37M 2023) vs **$42M ARR 2024** (getlatka) — CONFLICT; losses narrowed to ~$19M (AFR Jan 2026); 308 employees | $110M Series C Mar 2022 @ **$1.3B**; total raised $165.7M ($10.7M A 2020, $45M B 2021, $110M C 2022) | **iOS US 4.82★/61,369 ( refreshed 2026-09-23; #81 Social Networking per original capture) · Google Play 4.6★/62,160, 1M+ downloads (updated 2026-09-16)**; Trustpilot ~4/5 "Great" (a "3.9/7,000 reviews" figure also circulates); Capterra 4.4 |
| **Whop** | **18.4M+ users; 183,628 sellers** (original-run capture) **vs 20–21M users; 211K+ sellers** (Sacra, Feb-2026 refresh) — both kept; 258 sellers $1M+; 4M+ monthly Discover visitors; ~$100M/month GMV; **$4.6B+ paid out (homepage, live 2026-09-23) vs $2.67B cumulative lifetime GMV (Sacra, Feb 2026)** — different metrics, never merged; creator payouts ~$3B/yr; avg creator earns $8,413/mo | **$142M annualized Oct 2025** (from $56M end-2024; "250%" headline vs ~153% arithmetic — both stated); ~$60.2M platform MRR end-2025 (Sacra est.); effective take ~4.0% (2022) → ~5.5% (early 2025) | Tether-led **$200M @ $1.6B (Feb 2026)**; >$50M Series B (Bain Capital Ventures, Jul 2024) @ $800M; $17M Series A (Insight, Thiel, Mateen, The Chainsmokers, O'Leary); total $218M; **~20 engineers ≈ $7.1M revenue/engineer** | **iOS US 4.82★/57,754 · Play 4.7★/137,591, 1M+ downloads (2026-09-23)**; Sacra: "surpassed Stan in scale, 10× faster growth"; 30k+ affiliates at 30% recurring |
| **Stan** | **No creator count published** (stan.store is JS-rendered, no figure, 2026-09-23); the third-party "80,000+ active creators" read is carried unverified; **$600M+ cumulative creator earnings (company, 2026-09-23) vs $100M+ total creator sales volume (original-run capture)** — different metric/vintage, both kept; 50%+ of GMV from $4–30 digital downloads; 171 employees (getlatka) | **$40M ARR Apr 2026** (Sacra; $35M end-2025; $1.7M 2022 → $14.7M 2023 → ~$28–30M 2024) vs **$21.9M 2025-est** (getlatka) — CONFLICT; profitable ~40% EBITDA | $5M Forerunner seed (2022) as sole institutional round (Sacra) vs a 2025-09-15 raise signal + Gary Vaynerchuk strategic (Pulse2) — conflicts kept | **iOS-only** — US 4.87★/12,667 (publisher FindCommunity Inc.) · GB 4.8★/1.9K (IAP £24.99/£79.99); **no official Android app** (the Play package `com.getstan` is an unrelated Singapore lookalike — fn 95); no custom domain (linke.ro 2026) |
| **Beacons** | **10M+ creators — now first-party current (beacons.ai live 2026-09-23)**; older third-party reads persist as the spread: 7M+ (fahimai, since ≥ Aug 2024) and 4–6M (inflowave) — 10M+ carried as the current claim, never averaged; Semrush 37.64M visits/mo; "billions of page views per day" (implausible: ~25–50× Linktree's measured 1.2B/mo visitors — flagged, not fact) | ~$11M (builtbyfoundry, undated, low conf.) | ~$29.8M raised (YC, a16z) vs $50M Series B led by Spark (inflowave) — CONFLICT | iOS US **3.21★/97** · Play **3.59★/1,584, 500K+ downloads** (2026-09-23 — near-zero US iOS rating volume, corroborating the trust problem); **Trustpilot 1.8–1.9/5 — worst in roster** (billing/support) |
| **Milkshake** | **5M+ (milkshake.app live 2026-09-23)**; the developer is now listed as **Codelbee Pty Ltd** — ownership changed hands since the AU-origin story [memory] | ❓ | ❓ | **iOS 4.89★/14,720 · Play 4.65★/29,338, 1M+ downloads (2026-09-23)** — best consumer rating in roster (an earlier "4.9★/70K+ reviews" read was also captured); no desktop editor (review-verified) |
| **bio.link** | **3M+ creators (homepage live 2026-09-23; older footer: +1.5M)** | ❓ | ❓ | **No official app on either storefront (2026-09-23)**; the Google Play listing "app.biolink" (Publishrr Inc., 4.2★/2,081, 1M+) is an **unrelated lookalike** — attribution struck (fn 96) |
| **Campsite.bio** | 250k+ creators/agencies/brands (Orangetheory, Dell, Georgetown) | ❓ | ❓ | ❓ |
| **Taplink** | ❓ | ❓ | ❓ | **Product Hunt 5.0★ across 316 reviews** — strongest PH signal in roster |
| **SuperProfile** | ~50k creators (Feb 2026); promo reels 299K–712K views | ❓ | Cosmofeed; founded 2021 (creatorflow) vs 2020 (digest) — conflict | Influencer-led distribution (#GoSelfMade) |
| **Wishlink** | **100k+ creators; 250+ brands; 15,000+ community** (original-run capture) **vs 40K+ MAU creators; 300K+ pieces/mo; 6M+ orders; Rs 350Cr+ monthly GMV** (company claims, 2026-09-23 refresh) — CONFLICT kept; Meta Business Partner | ❓ (brand-side economics; the Rs 350Cr+/mo GMV claim sits here when re-verified) | Creatormon Pvt Ltd (CIN U74994HR2022PTC100843); **$17.5M Series B led by Vertex Ventures SEA & India (2026-02-24, via indianstartupnews.com — Vertex's own press page 404s on recheck)** | **iOS IN 4.7★/2,214 · Play 1M+ downloads, rating count not exposed (2026-09-23)** vs original capture "Play 4.8★ / App Store 4.6★" — both kept |
| **Komi / Shorby / Lnk.Bio / Liinks / Solo.to / SlashPage / lit.link / about.me / Bio Sites / Linkin.bio** | ❓ or [memory] only — no current traction figures in fetched sources | ❓ | Squarespace: public-company scale, platform-level trust pages | lit.link: **4M registered users** (JP; claim-asset vintage 2025-10 — carried with caution, fn 97); Western-source gap documented |

## 7. Monetization Strategy (per archetype, with exemplars)

1. **Flat subscription + 0% fees** (Stan $29/$99; Komi Pro; Beacons paid tiers) — win on simplicity. Stan's ceiling exposed: single-tier NDR limit, gross churn catching acquisition, **ARPC declining $491 → $437** — hence the Stanley AI upsell motion.
2. **Cheap subscription + declining take rate** (Linktree 9%→0%; Milkshake declining Stripe fees; SuperProfile 10%→5%→custom) — win on upgrade economics. Beacons fee-ladder break-evens: Plus beats Free at ~$333/mo of sales, beats Creator at ~$222/mo.
3. **No subscription, pure take rate + financial services** (Whop 3%+payments stack; Wishlink brand-side commissions) — win on GMV scale. Whop's economics show the marketplace model out-earning every subscription player except Linktree itself.
4. **Linktree runs all three at once**: subscriptions + commerce fees + **Sponsored Links** ads (Hulu, Sam's Club, Harry's; US-only) + Shops/Rewards/wallet/"Earn" + Kajabi-delivered courses — the only triple-model operator in the roster.
5. **Adjacencies as monetization**: lit.link sells Gen-Z ad inventory (TieUps ad network); Whop Treasury pays **6% APY on USDT0** (Mar 2026, MoonPay deposits) and productizes payments as the **Whop Payments Network for 27,000+ external businesses**; Squarespace uses Bio Sites as a funnel into full-site plans; Later bundles Linkin.bio into suite subscriptions.

## 8. Composite Feature Matrix (16 categories × 20 platforms)

Column key: **LT** Linktree · **WH** Whop · **ST** Stan · **BE** Beacons · **KO** Komi · **MK** Milkshake · **SB** Shorby · **BL** bio.link · **LB** Lnk.Bio · **CB** Campsite.bio · **LI** Liinks · **TL** Taplink · **SO** Solo.to · **SP** SlashPage · **SU** SuperProfile · **WI** Wishlink · **LL** lit.link · **AM** about.me · **BS** Squarespace Bio Sites · **LR** Later Linkin.bio.
Categories: **A** Pricing & plans · **B** Core page building · **C** Analytics · **D** Commerce · **E** Audience tools · **F** AI features · **G** Mobile apps · **H** Integrations & embeds · **I** Developer surface (dev lens) · **J** Data ownership & portability (dev lens) · **K** Security & compliance (DevSecOps lens) · **L** Reliability signals (DevSecOps lens) · **M** Internationalization · **N** Business model · **O** Market traction · **P** Sentiment & engagement.

| Sub-feature | LT | WH | ST | BE | KO | MK | SB | BL | LB | CB | LI | TL | SO | SP | SU | WI | LL | AM | BS | LR |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **A. Pricing & plans** | | | | | | | | | | | | | | | | | | | | |
| A1. Permanent free tier | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | 🟡¹ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡² | ❓ |
| A2. Entry paid ≤ $8/mo | ✅³ | ➖ | ❌ | ✅⁴ | ❌ | ✅ | ❌ | ✅ | ❓ | ✅ | ✅ | ✅⁵ | ✅⁶ | ❓ | ❓⁷ | ➖ | ❓ | ✅ | ✅⁸ | ❓ |
| A3. Annual billing discount | ✅ | ➖ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❓ | ❓ | ✅ | 🟡⁹ | ✅ | ❓ | 🟡¹⁰ | ➖ | ❓ | ✅ | ❓ | ❓ |
| A4. Four-plus plan tiers (incl. free) | ✅ | ➖ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❓ | 🟡¹¹ | ❌ | ❌ | ✅ | ❌ | 🟡¹² | ➖ | ❓ | ❌ | ❓ | ❓ |
| **B. Core page building** | | | | | | | | | | | | | | | | | | | | |
| B1. Rich blocks beyond plain links | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡¹³ | ✅ | ✅ | ✅ | 🟡¹⁴ | ✅ | ✅ | 🟡¹⁵ | ✅ | 🟡¹⁶ | ✅ | ✅ |
| B2. Themes & branding customization | ✅ | ❓ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❓ | ❓ | ✅ | ✅ | ✅ | ✅ | 🟡¹⁷ | ✅ | ✅ | ✅ | ✅ | ❓ |
| B3. Custom CSS or code-level control | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| B4. Custom domain | ✅¹⁹ | ❓ | ❌²⁰ | ✅ | ✅ | ✅²¹ | ✅ | ✅ | ❓ | ✅ | ✅ | ✅ | ❓ | ✅ | ❓ | ❓ | ❓ | ✅ | ✅ | ❓ |
| B5. Remove platform branding | ✅ | ❓ | ❓ | ✅²² | ✅ | ✅ | 🟡²³ | ✅ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ➖ | ❓ | ✅ | ❓ | ❓ |
| **C. Analytics** | | | | | | | | | | | | | | | | | | | | |
| C1. Basic views/clicks included | ✅ | ❓ | ❓ | ✅ | ✅ | 🟡²⁴ | ✅ | ✅ | ❓ | ✅ | ✅ | ✅ | 🟡²⁵ | 🟡²⁶ | ❓ | ✅ | ❓ | ✅ | ✅ | ❓ |
| C2. Geo or traffic-source breakdown | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | 🟡²⁷ | ❓ | ❓ | ✅ | 🟡²⁸ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| C3. Tracking pixels or GA | ❓ | ❓ | ❓ | ❓ | ✅ | ✅ | ✅ | ❓ | ❓ | ✅ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ |
| C4. Commerce or conversion tracking | ✅ | ❓ | ❓ | 🟡²⁹ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ | ❓ | ❓ |
| C5. Analytics data export | ✅ | ❓ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | 🟡³⁰ | ❓ | ❓ | ❓ | 🟡³⁰ | ❓ | ❓ |
| **D. Commerce** | | | | | | | | | | | | | | | | | | | | |
| D1. Sell digital products natively | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❓ | ❌ | ❌ | ❓ | ❓ | ✅ | ❓ | ❓ | ✅ | 🟡³¹ | 🟡³² | ❌ | ✅ | 🟡³³ |
| D2. Native courses | ✅ | ✅ | ✅ | ✅ | ❓ | ❌ | ❌ | ❌ | ❌ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ❌ | ❓ | ❌ | ❓ | ❌ |
| D3. Appointments or bookings | ✅ | ❓ | ✅ | ✅ | ❓ | ❌ | ❌ | ❓ | ❌ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ❌ | ❓ | ✅ | 🟡³⁴ | ❓ |
| D4. Tips or donations | ✅ | ❓ | ❓ | ❓ | ✅ | ❌ | ❌ | ❓ | ❌ | ❓ | ❓ | ✅ | ❓ | ❓ | ❓ | ❌ | ❓ | ❌ | 🟡³⁵ | ❓ |
| D5. Documented take rate on sales | ✅ | ✅ | ✅ | ✅ | ✅ | 🟡⁹⁴ | ➖ | ➖ | ➖ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ✅³⁶ | ❓ | ➖ | ✅ | ➖ |
| **E. Audience tools** | | | | | | | | | | | | | | | | | | | | |
| E1. Email capture | ✅ | ❓ | ✅ | ✅ | ✅ | ✅ | ❓ | ✅ | ❓ | ✅ | ✅ | ✅ | ❓ | ❓ | ✅ | ❓ | ❓ | ✅ | ✅ | ❓ |
| E2. Broadcast email campaigns | ❓ | ❓ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ | ❓ | ✅ | ❓ |
| E3. DM, SMS or WhatsApp automation | 🟡³⁷ | ❓ | ❓ | ✅ | ❓ | ❌ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ✅ | ❓ | ❌ | ✅ | ❓ |
| E4. CRM or lead management | ❓ | ❓ | ❓ | ❓ | ✅ | ❌ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ |
| **F. AI features** | | | | | | | | | | | | | | | | | | | | |
| F1. Creator-side AI generation | ✅ | ❓ | ✅ | ✅ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ✅ | ❓ |
| F2. Visitor-facing AI assistant | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ |
| F3. AI page builder or auto-generation | ✅ | ❓ | ❓ | 🟡³⁸ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ❓ |
| **G. Mobile apps** | | | | | | | | | | | | | | | | | | | | |
| G1. iOS app | ✅ | ✅ | ✅⁹⁵ | ✅ | ❓ | ✅ | ❓ | ❌⁹⁶ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ | ❓ | ❓ |
| G2. Android app | ✅ | ✅ | ❌⁹⁵ | ✅ | ❓ | ✅ | ❓ | ❌⁹⁶ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ | ❓ | ❓ |
| G3. Mobile editor parity | ❓ | ❓ | ❓ | ❓ | ❓ | ❌³⁹ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅⁴⁰ | ❓ | ❓ | ❓ |
| **H. Integrations & embeds** | | | | | | | | | | | | | | | | | | | | |
| H1. Social or media embeds | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❓ | ❓ | ✅ | ✅ | ✅ | ❓ | ❓ | 🟡⁴¹ | ✅ | ✅ | ✅ | ✅ |
| H2. Multiple payment providers | ✅ | ✅ | 🟡⁴² | ✅ | ❓ | 🟡⁴³ | 🟡⁴³ | ❓ | ❓ | ❓ | ❓ | 🟡⁴⁴ | ❓ | ❓ | 🟡⁴⁵ | ❓ | ❓ | ❓ | ✅ | ❓ |
| H3. Ecommerce platform integrations | ✅ | ✅ | ❓ | ❓ | ✅⁴⁶ | ❌ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅⁴⁷ | ❓ | ❌ | ✅ | ❓ |
| **I. Developer surface (dev lens)** | | | | | | | | | | | | | | | | | | | | |
| I1. Public API | ❓ | ✅ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓⁴⁸ | ❓ |
| I2. Webhooks | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| I3. Third-party app or extension platform | ❓ | ✅ | ❌ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅⁵⁰ | ✅⁵¹ | ❓ | ❓ | ❓ | ❓ | ❌ | ✅⁵² | ❓ |
| I4. CLI, git or IaC deployment | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| I5. Self-host or open-source core | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **J. Data ownership & portability (dev lens)** | | | | | | | | | | | | | | | | | | | | |
| J1. Page or content export | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | 🟡⁵⁵ | ❓ | ❓ | ❓ | ❓ | 🟡⁵⁶ | ❓ |
| J2. Analytics export | ✅ | ❓ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅⁵⁷ | ❓ | ❓ | ❓ | ✅⁵⁷ | ❓ | ❓ |
| J3. Migration or no-lock-in pledge | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | 🟡⁵⁸ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| **K. Security & compliance (DevSecOps lens)** | | | | | | | | | | | | | | | | | | | | |
| K1. 2FA or MFA for accounts | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ | 🟡⁵⁹ | ❓ | ❓ | ❓ | ❓ |
| K2. Team seats or multi-seat workflows | ✅ | ❓ | ❓ | ✅ | ✅ | ❌ | ✅ | ❓ | 🟡⁶⁰ | ✅ | ✅ | ❓ | ❓ | ❓ | ❓ | ➖ | ❓ | ❓ | ✅ | 🟡⁶¹ |
| K3. SSO or SAML | ✅⁶² | ❓⁶³ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| K4. GDPR/DPA posture published | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| K5. SOC 2 or ISO 27001 attestation | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| K6. Bug bounty or coordinated disclosure | ❓ | ✅ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| **L. Reliability signals (DevSecOps lens)** | | | | | | | | | | | | | | | | | | | | |
| L1. Public status page | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| L2. SLA published | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| L3. Public scale or uptime claims | ✅ | ✅ | ✅ | 🟡⁶⁷ | ❓ | ✅ | ❓ | ✅ | ❓ | ✅⁶⁸ | ❓ | ✅⁶⁹ | ❓ | ❓ | ✅⁷⁰ | ✅ | ❓ | ❓ | ❓ | ❓ |
| **M. Internationalization** | | | | | | | | | | | | | | | | | | | | |
| M1. Non-English UI or market focus | ✅⁷¹ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ❓ | ✅ | ✅ | ✅ | ✅ | ❓ | ✅⁷² | ❓ |
| M2. Local payment methods (beyond Stripe US/EU) | ❓ | ✅ | ❓ | ❓ | ❓ | 🟡⁷³ | 🟡⁷³ | ❓ | ❓ | ❓ | ❓ | 🟡⁷⁴ | ❓ | ❓ | ✅ | ✅⁷⁵ | ❓ | ❓ | ❓ | ❓ |
| M3. Data-residency choice | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| **N. Business model** | | | | | | | | | | | | | | | | | | | | |
| N1. Subscription SaaS | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| N2. Take rate or per-sale fee | ✅ | ✅ | ✅⁷⁷ | ✅ | ✅⁷⁷ | 🟡⁹⁴ | ➖ | ➖ | ➖ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ✅ | ❓ | ➖ | ✅ | ➖ |
| N3. Ads or sponsored placements | ✅ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❌⁷⁸ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ | ❓ |
| N4. Marketplace or brand-discovery network | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❓ | ❌ | ❌ | ❌ | ❌ | ❌ | ❓ | ✅ | ❓ | ❌ | ❓ | ❓ |
| **O. Market traction** | | | | | | | | | | | | | | | | | | | | |
| O1. 1M-plus users or equivalent scale | ✅ | ✅ | ❌⁷⁹ | ✅⁸⁰ | ❓ | ✅⁸¹ | ❓ | ✅ | ❓ | ❌⁸² | ❓ | ❓ | ❓ | ❓ | ❌⁸³ | ❌⁸² | ✅⁹⁷ | ❓ | ❓ | ❓ | ❓ |
| O2. $10M-plus raised or $100M-plus valuation | ✅ | ✅ | ❌⁸⁴ | ✅⁸⁵ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ | ❓ |
| O3. $10M-plus annual revenue | ✅⁸⁶ | ✅ | ✅⁸⁷ | 🟡⁸⁸ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| **P. Sentiment & engagement** | | | | | | | | | | | | | | | | | | | | |
| P1. App-store or storefront rating 4.5-plus | ✅ | ✅⁹⁸ | ✅⁹⁵ | ❌⁹⁸ | ❓ | ✅ | ❓ | ❓ | ❓ | ❓ | ❓ | ✅⁸⁹ | ❓ | ❓ | ❓ | ✅ | ❓ | ❓ | ❓ | ❓ |
| P2. Review-platform coverage | ✅⁹⁰ | ❓ | ❓ | ✅⁹¹ | ❓ | ❓ | ✅⁹² | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |
| P3. Public engagement metrics | ✅ | ✅ | ✅ | ✅⁹³ | ❓ | ✅ | ❓ | ✅ | ❓ | ✅ | ❓ | ✅ | ❓ | ❓ | ✅ | ✅ | ❓ | ❓ | ❓ | ❓ |

### 8.1 Legend

| Symbol | Meaning |
|---|---|
| ✅ | Feature confirmed present in current (2026) public docs / pricing page / product page captured this run |
| ❌ | Absent or explicitly not offered |
| 🟡 | Partial, limited, paywalled, in beta, or conditional — numbered footnote states the condition |
| ➖ | Not applicable to this platform's model |
| ❓ | Could not confirm from captured public sources; the relevant page was checked and did not answer it. Never inferred |

### 8.2 Footnotes

1. **Liinks**: building free, publishing requires paid (14-day trial at go-live).
2. **Bio Sites**: free tier per digest, but /bio-sites 404'd at fetch; third-party pricing conflicts.
3. **Linktree**: $6/mo annual-billed Starter after Nov 2025 hike.
4. **Beacons**: $10 monthly / ~$8.33 annual Creator.
5. **Taplink**: $4/mo Pro quoted with annual billing.
6. **Solo.to**: $1/mo Personal, annual-only.
7. **SuperProfile**: ₹ annual plans vs $29/mo-per-IG-account claim (creatorflow) — conflict; USD conversion ❓.
8. **Bio Sites**: $4.99/mo per creator-hero (Aug 2026); Stan's table: no subscription + 8%/sale.
9. **Taplink**: annual discounts published; monthly prices ❓.
10. **SuperProfile**: annual-only pricing published.
11. **Campsite**: Pro plus two Org tiers.
12. **SuperProfile**: two paid tiers.
13. **Lnk.Bio**: lightweight unlimited links; block depth ❓; no built-in monetization per hoo.be.
14. **Solo.to**: embeds only on Entrepreneur+.
15. **Wishlink**: shop-centric product cards from brand catalogs, not arbitrary blocks.
16. **about.me**: portfolio/testimonial/video blocks.
17. **SuperProfile**: branding removal on Pro only.
19. **Linktree**: custom domain on paid tiers per third-party tables; not itemized on current pricing extract.
20. **Stan**: no custom domain (linke.ro, 2026).
21. **Milkshake**: custom domain on Pro+ only.
22. **Beacons**: branding removal begins at Creator, full at Creator Plus.
23. **Shorby**: white-label only on Agency.
24. **Milkshake**: free keeps 30 days of insights; 365 on Pro.
25. **Solo.to**: analytics window 30d free / 6mo Personal / 12mo Professional.
26. **SlashPage**: via GA on Pro+; native analytics ❓.
27. **Shorby**: geo/UTM via external GA on Pro, not native.
28. **Liinks**: traffic-source breakdown confirmed; geo/device ❓.
29. **Beacons**: "Faster Analytics" + Beam trend discovery; classic funnels ❓.
30. **SlashPage / about.me**: export via Google Sheets (Pro+) / GA (Pro) rather than native.
31. **Wishlink**: affiliate brand catalogs only, not creators' own products.
32. **lit.link**: "shops" block referenced; depth and fees ❓.
33. **Later**: grid routes to external commerce; native checkout ❓.
34. **Bio Sites**: Squarespace suite includes scheduling; Bio Sites-specific availability ❓.
35. **Bio Sites**: suite donations; Bio Sites-specific ❓.
36. **Wishlink**: commissions paid by brands; no creator-facing take rate.
37. **Linktree**: phone/email capture + IG auto-replies on Premium; SMS broadcast ❓.
38. **Beacons**: Beam link-in-bio generation "coming soon."
39. **Milkshake**: no desktop editor — mobile-app-first (review-verified).
40. **lit.link**: mobile-first editing is the advertised path; desktop parity ❓.
41. **Wishlink**: IG/YouTube commerce linking; arbitrary media embeds ❓.
42. **Stan**: built-in payment processing; processor unnamed.
43. **Milkshake, Shorby**: Stripe only.
44. **Taplink**: payments on Business tier; provider ❓.
45. **SuperProfile**: gateway charges extra; provider ❓.
46. **Komi**: Shopify among supported integrations.
47. **Wishlink**: 250+ brand catalogs integrated.
48. **Squarespace**: platform-level APIs exist; Bio Sites-specific API ❓.
50. **Taplink**: extensions/add-on ecosystem referenced in its marketing.
51. **Solo.to**: Extensions page referenced in pricing docs.
52. **Squarespace**: Extensions marketplace at suite level.
55. **SlashPage**: Google Sheets sync only.
56. **Squarespace**: site export exists at platform level; Bio Sites export ❓.
57. **SlashPage / about.me**: analytics export via GA integration.
58. **Liinks**: "you're the customer, not the product" is an ads/privacy pledge, not a portability pledge. Counterpoint: Bento permanently deleted all user data at its Feb 13 2026 shutdown.
59. **Wishlink**: OTP phone verification at signup; account-level 2FA ❓.
60. **Lnk.Bio**: Agency/Multi-Accounts product in nav.
61. **Later**: team features exist in the suite; Linkin.bio-specific ❓.
62. **Linktree**: SSO on Agency/Enterprise.
63. **Whop**: enterprise offering exists (network.whop.com); SSO ❓.
67. **Beacons**: "billions of page views per day" claim — unverified, flagged implausible.
68. **Campsite**: 250k+ creators claim.
69. **Taplink**: 5.0★ across 316 Product Hunt reviews.
70. **SuperProfile**: 50k+ creators; promo reels 299K–712K views.
71. **Linktree**: App Store listing shows English + 13 more languages.
72. **Squarespace**: geo-localized marketing (German pricing observed).
73. **Milkshake, Shorby**: Stripe only — USD/EUR/GBP-centric rails.
74. **Taplink**: payments accepted; local-currency rails ❓.
75. **Wishlink**: India-first brand-commission payouts.
77. **Stan and Komi**: 0% documented (Stan: no take rate at all; Komi: 0% on Pro).
78. **Liinks**: explicit no-ads / no-data-selling pledge.
79. **Stan**: no creator count published (2026-09-23 homepage check — JS-rendered, no figure); the third-party "80k active creators" read and the company's "$600M+ cumulative creator earnings" do not establish 1M+ users — below 1M on every read.
80. **Beacons**: 10M+ is now the current first-party claim (beacons.ai live 2026-09-23); 7M+ (third-party since ≥ Aug 2024) and 4–6M persist as older reads — spread carried, never averaged.
81. **Milkshake**: 5M+ per live milkshake.app (2026-09-23; the page does not disambiguate downloads vs registered users); iOS 4.89★/14,720 · Play 4.65★/29,338 (1M+).
82. **Campsite** (250k+) and **Wishlink** (100k+): below 1M.
83. **SuperProfile**: 50k+ — below 1M.
84. **Stan**: $5M seed sole disclosed institutional round — profitable instead; 2025-09-15 raise signal conflicts.
85. **Beacons**: ~$29.8M raised per digest vs $50M Series B (Spark) claim — conflict carried.
86. **Linktree**: $55.5M 2024 (Sacra) vs $42M ARR 2024 (getlatka) — conflict carried.
87. **Stan**: $40M ARR Apr 2026 (Sacra) vs $21.9M 2025-est (getlatka) — conflict carried.
88. **Beacons**: ~$11M revenue claim, undated, low confidence.
89. **Taplink**: Product Hunt 5.0★ (316 reviews) as the store proxy.
90. **Linktree**: Trustpilot ~4/5 "Great"; a "3.9 across 7,000 reviews" figure also circulates.
91. **Beacons**: Trustpilot 1.8–1.9 — worst in roster.
92. **Shorby**: AppSumo lifetime-deal complaints documented.
93. **Beacons**: "billions of page views per day" company claim (same caveat as 67).
94. **Milkshake**: Stripe selling documented on free tier and "lower fees when you sell" on Pro/Pro+, but the fee % is not stated on the captured pricing page (❓).
95. **Stan (G1/G2/P1)**: iOS-only — US App Store 4.87★/12,667 (publisher FindCommunity Inc.) and GB 4.8★/1.9K (IAP £24.99/£79.99); **no official Android app exists** — the Google Play package `com.getstan` ("STAN: Live Clubs & Communities", GETSTAN TECHNOLOGIES, Singapore) is an unrelated lookalike; any attribution of it to Stan was struck in the 2026-09-23 refresh.
96. **bio.link (G1/G2)**: no official app on either storefront; the Google Play listing "app.biolink" (Publishrr Inc., 4.2★/2,081, 1M+) is an unrelated lookalike — attribution struck 2026-09-23.
97. **lit.link (O1)**: 4M registered users (Japan; the claim asset dates to 2025-10 — older marketing material, carried with caution).
98. **Store-rating refresh 2026-09-23**: Whop iOS US 4.82★/57,754 · Play 4.7★/137,591 (1M+); Beacons iOS US 3.21★/97 · Play 3.59★/1,584 (500K+) — below the 4.5 bar on both storefronts.

### 8.3 Category-wide notes (findings, not data gaps)

- **B3 (custom CSS), I2 (webhooks), K4 (GDPR/DPA), K5 (SOC 2/ISO), L1/L2 (status page, SLA), M3 (data residency): no platform among the 20 documents these on any page fetched.** Rows are ❓ because absence of marketing is not proof of absence — except **I4 (CLI/git/IaC) and I5 (self-host), which are ❌**: a SaaS page product definitionally offers neither, verified across every fetched pricing/docs page.
- The uniform ❓ band across I/K/L/M **is the headline finding for a developer/DevSecOps reader: this market does not market to builders.** Only Whop ships API + app platform + bug bounty; only Solo.to advertises 2FA; only Linktree ships SSO.

## 9. Tech-Stack Matrix (the "tech stack" matrix for compared tech SaaS)

Signal classes: company-primary pages (HIGH) · job-posting-derived and Sacra/getlatka (MED) · URL/DOM-structure inference (MED, labeled) · ❓ checked-not-found · [GK] model memory, framing only. No BuiltWith/Wappalyzer scan succeeded (himalayas.app blocked), so stack truth rests on the first three classes.

### 9.1 Consolidated cross-company matrix

| Layer | Linktree | Beacons | Whop | Stan | Squarespace Bio Sites | about.me | lit.link |
|---|---|---|---|---|---|---|---|
| Frontend (web) | React + TypeScript (MED) | React (MED) | ❓ [GK: Next.js] | Mobile-first storefront, framework ❓ | Squarespace renderer (HIGH) | Own renderer (HIGH) | Block editor, framework ❓ (HIGH behavior) |
| Frontend (mobile) | Native iOS (US 4.82★/61,369) + Android (Play 4.6★/62,160, 1M+) (HIGH, refreshed 2026-09-23) | iOS + Android (US 3.21★/97 · Play 3.59★/1,584 — HIGH, 2026-09-23) | iOS + Android (US 4.82★/57,754 · Play 4.7★/137,591 — HIGH, 2026-09-23) | iOS-only native (US 4.87★/12,667); **no Android app** (HIGH, 2026-09-23) | Squarespace app suite [GK] | ❓ | Mobile-web-first, app ❓ |
| Backend | Node.js/TS + **legacy PHP monolith** being displaced (MED) | ❓ | ❓ + public API + CLI (MED) | ❓ (bundled payment/hosting/scheduling/funnels as services) | Squarespace platform (HIGH) | ❓ | ❓ |
| API | GraphQL + REST (MED) | ❓ | **Public developer API, docs.whop.com** (HIGH) | ❓ | Platform APIs [GK] | ❓ | ❓ |
| Data (OLTP) | PostgreSQL (MED) | ❓ | ❓ | ❓ | Platform (HIGH) | ❓ | ❓ |
| Data (warehouse) | Snowflake (MED) | ❓ | Analytics Engineer role exists, stack ❓ | ❓ | ➖ | ➖ | ➖ |
| Search | Elasticsearch (MED) | ❓ | Discover search ❓ | ❓ | ➖ | ➖ | ➖ |
| Infra & deploy | **AWS S3, EventBridge, SQS, Lambda, ECS, CDK** (MED) | **Cloudflare edge observed directly** (careers page served a CF challenge, 2026-09-23); origin ❓ | ❓ cloud; Brooklyn + Palo Alto org | ❓ | Platform (HIGH) | ❓ | Operator CONFLICT: TieUps Inc. (fresh footer © 2020) vs GMO Pepabo (digest) |
| Observability | ❓ | ❓ | ❓ | ❓ | ➖ | ➖ | ❓ |
| Analytics | Snowflake + tiered product analytics (MED) | Beam "Faster Analytics" (HIGH) | Strategic-finance analytics fn (HIGH existence) | In-product, tooling ❓ | Squarespace Analytics + **AI Visibility** (HIGH) | Google Analytics on Pro (HIGH) | ➖ |
| Payments | Shops, wallet, Sponsored Links; PSP ❓ | 9% free / 0% Creator Plus; BNPL; PSP ❓ | **Proprietary multi-PSP smart routing: Stripe + PayPal + Coinbase Commerce + MoonPay + Tether; 135+ currencies; 100+ methods; 195+ countries; local acquiring US/EU/CA/AU/UK; +0.8% orchestration; 10 BNPL partners; Whop Payments Network for 27k+ external businesses** (HIGH, Sacra) | 0% tx fee model; PSP ❓ | Squarespace Payments [GK: Stripe] | ➖ | In-page shops; PSP ❓ |
| Email / comms | Email+phone capture; ESP ❓ | Newsletters, **Auto-DMs**, automations (HIGH) | Discord as community substrate (MED) | Built-in email automation (MED) | Email + SMS Campaigns (HIGH) | Email-signature product (HIGH) | ➖ |
| AI | AI design tools + Canva deepening (MED) | **Beam AI teammate** — strategy, growth analysis, brand-deal negotiation (HIGH) | **Claude for internal eng/ops** (Sacra); customer AI ❓ | **Stanley agent** — autonomous posting to LinkedIn/IG (HIGH) | AI Website Builder, Design Intelligence, AI Visibility (HIGH) | **Virtual Twin AI** (HIGH) | ➖ |
| Security surface | ❓ WAF/bounty | Cloudflare bot challenge (HIGH) | **Bug bounty** — only formal program in category (HIGH) | ❓ | Platform security ❓ detail | ❓ | ❓ |
| Design tooling | Storybook (MED) | ❓ | ❓ | ❓ | Templates (HIGH) | ➖ | Preset library (HIGH) |
| Support/recruiting fingerprint | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ | **Zendesk** (help.lit.link/hc/ja path — inference); **Wantedly** recruiting |

### 9.2 Secondary-tier stack signals

| Company | Signal | Confidence |
|---|---|---|
| **bio.link** | AI assistant trained on your content; testimonial ties it to **Buy Me a Coffee** ("this service was linked with buymeacoffee") ⇒ [GK] BMC-team ownership | HIGH (features) / GK (ownership) |
| **Wishlink** | **Engineering blog exists at engineering.wishlink.com** (contents unfetched ❓); monthly bank payouts | HIGH (existence) |
| **SuperProfile/Cosmofeed** | Gateway charges extra on all plans (unnamed PSP ⇒ Razorpay/Cashfree-style Indian gateway ❓); WhatsApp marketing; AutoDM; UPI-native market context (competitor Playto markets "0% on UPI") | HIGH (fees) / ❓ (gateway) |
| **Carrd** | Integration map: payments Stripe/PayPal/Gumroad; forms Mailchimp/Kit/ActiveCampaign/EmailOctopus; analytics GA/Plausible/Matomo; **Let's Encrypt** TLS on custom domains | HIGH (own site) |
| **SlashPage** | **"Allow search engines and LLMs to index this site" toggle** — LLM-crawler policy as a user-facing control | HIGH |

### 9.3 What the stacks reveal

1. **AWS + TypeScript + React convergence.** Where anything is visible (Linktree; [GK] Whop/Beacons), the pattern is the 2020s default: TS end-to-end, React front, Node services, PostgreSQL, AWS. Linktree's specific mix — Lambda + ECS + EventBridge + SQS + CDK, Snowflake + Elasticsearch on top of PostgreSQL — is the textbook event-driven shape for a page product: enormous read volume, tiny payloads, every click an event. **No moat in framework choice; the moat is elsewhere.**
2. **The PHP-legacy shadow.** Linktree — $1.3B valuation, 70M users — still carries a legacy PHP monolith alongside Node/GraphQL a decade after shipping fast on PHP. The lesson: the embarrassing first version persists; plan the strangler-pattern seam early (which is exactly what event-bus architecture buys you).
3. **Payments as the moat.** The category default is the "Stripe Connect wrapper"; Whop built proprietary multi-PSP smart routing, local acquiring in five regions, crypto rails, BNPL across ten partners, decline-recovery orchestration — then productized it as the Whop Payments Network for 27k+ external businesses. In creator commerce, **payment acceptance quality** (decline recovery, local methods, payout speed, high-risk-vertical tolerance) is durable in a way page-rendering never can be. Every ambitious link-in-bio company converges on fintech; Whop got there first and deepest.
4. **Lean-stack economics.** Whop: ~20 engineers at $142M ⇒ **≈$7.1M revenue/engineer** (computed). Stan: 171 employees at $40M ⇒ ≈$234k/employee. Linktree: 308 at $42–55.5M ⇒ ≈$136–180k/employee. Lean is the winning configuration at category scale, with Claude-assisted internal ops as a stated Whop accelerant.
5. **VPS feasibility argument (bridging to deliverable 10).** A bio page is a cached, mostly-static payload: the user's 2vCPU/2GB/10TB baseline is bandwidth-bound long before CPU-bound. Rough arithmetic: 10TB/mo ÷ ~50KB/view ≈ **~200M page views/month ceiling before CDN offload** — the LW CDN doc's model (CDN pulls from origin; users never hit origin) is exactly the promotion path. At 0→10k DAU a single VPS with origin caching is comfortably sufficient; first promotion trigger is bandwidth, second is click-event write throughput — which is where the queue-in-front-of-analytics-writes pattern (Linktree's SQS/EventBridge shape) becomes the thing to copy.
6. **Category-wide blind spots the matrix exposes:** observability ❓ across the board; security signaling near-absent (one bug bounty in 20); **AI now table stakes** — every major survivor ships a named AI feature (Beam, Stanley, Virtual Twin, Linktree design AI, Design Intelligence, bio.link assistant), so differentiation has shifted from "has AI" to "AI does what"; **LLM discoverability emerging as a new layer** (Squarespace "AI Visibility," SlashPage's LLM-index toggle) — an analytics layer nobody else measures yet.

### 9.4 Open-source inventory relevant to this category

| Project | Stack | What it is | Source class |
|---|---|---|---|
| **linkpage** (rhnvrm) | Go; single self-contained self-hostable binary [GK] | Minimal one-page link-in-bio you own — the "smallest viable competitor" | [GK] |
| **lynk** (chroline) | Next.js + MDX + next-seo [GK] | Dev-flavored bio page authored in MDX in a repo — git-based editing, Vercel-deployable | [GK] |
| **Dub** (dub.co) | [GK] OSS link management/attribution, TS/Next.js | Observed in PH link-in-bio category this run; OSS status from general knowledge | Presence HIGH / OSS [GK] |
| **LittleLink family** (LittleLink static generator; LittleLink-Custom PHP fork; LinkStack PHP) | Static HTML/CSS; PHP | The canonical self-hosted alternatives family (medevel list roster not re-fetched) | [GK] |
| **Carrd** (commercial) | Closed; integration surface is the published map | Not OSS, but the cleanest map of which third-party services a one-page product needs | HIGH |

Takeaway (feeds deliverable 09): the OSS floor for this category is very low — a static page generator is technically sufficient — which is why competition happens in commerce, payments, and audience tooling, the layers OSS conspicuously does not provide.

## 10. Strategic Observations

**10.1 The developer surface is a near-total white space.** Exactly one of 20 platforms documents a public API (Whop); it is also the only one with a third-party App Store/SDK and a bug bounty. Zero document webhooks, CLI/git/IaC, or self-hosting. For a developer-founder entrant this is the clearest unoccupied position in the market: a headless/API-first bio-page with real export and an OSS escape hatch. The demand signal exists — OpenBento (open-source Bento clone) and Bopbee (OpenBento hosting) appeared in 2026 Bento-migration roundups precisely because Bento's design-minded, developer-adjacent users had nowhere sanctioned to go when Linktree deleted the product.

**10.2 Security and reliability posture is undocumented market-wide — a DevSecOps-differentiation opening.** Only Solo.to advertises 2FA (free tier), only Linktree offers SSO (Enterprise), only Whop runs a bug bounty; not one of the 20 publishes SOC 2/ISO 27001, a DPA, a status page, or an SLA in any fetched material. EU vendors already sell against the GDPR/data-residency vacuum (linke.ro, alllinks.cc). **A newcomer that publishes SOC 2, a DPA, EU hosting, and a public status page would be first in the category on every one of those axes simultaneously.**

**10.3 Over-indexing: AI and email capture are table stakes; reliability and portability are not.** Every 2026-current release cycle ships AI; 12/20 capture email. Nobody ships uptime transparency or credible export. Parity zone: page-building + analytics-lite + email. Differentiation zone: empty.

**10.4 The pricing-band war.** Linktree's Nov 2025 hike (46–67%) abandoned the $5–12 band now owned by six cheaper rivals; Stan inverted the ladder and Whop deleted it. The subscription middle is squeezed from both ends — flat-fee simplicity below, GMV economics above.

**10.5 Consolidation made vendor-lifetime risk a purchase criterion — and nobody sells against it.** Six demonstrable data-loss/sunset events in three years (Bento, Koji, Linkpop, Tap Bio, Fingertip, Snipfeed-absorption), yet the closest thing to an ownership pledge in the roster is Liinks' ads/privacy line. **A "your page, your data" positioning (one-click full export, documented deletion policy, open schema) is unclaimed.**

**10.6 Business models bifurcated into three clean strategies** (§7): flat-subscription-0%-fee vs cheap-sub-declining-take vs no-sub-pure-take+fintech. Linktree alone runs all three plus ads.

**10.7 Platform risk is existential and favors audience-ownership features.** Instagram testing clickable caption links for Meta Verified users (Mar 2026) attacks the core routing value. Most defensible: products that own the audience relationship (Stan email, Beacons email/DM, Komi CRM, SuperProfile WhatsApp) vs pure link routers (Shorby, Lnk.Bio, Solo.to, Campsite).

**10.8 Reputation gaps are wide open.** Beacons 1.8–1.9 Trustpilot; Shorby AppSumo resentment; Linktree hike backlash + inability to process Apple/Google subscription refunds; Stan ARPC declining ($491→$437) with churn catching acquisition. Support quality and billing transparency are differentiators no player currently markets.

**10.9 Regional moats are language and payments, not features.** lit.link/SlashPage/Taplink/SuperProfile/Wishlink hold their markets on localization + local money movement — the same lever Whop industrialized globally (135+ currencies). The Asia Stripe gap is the most-cited unmet creator pain in the region.

**10.10 The matrix's biggest single-cell finding.** Whop is the only ✅ in I1 (public API) and K6 (bug bounty); Solo.to the only ✅ in K1 (2FA); Linktree the only ✅ in K3 (SSO). Three different companies each hold a unique compliance/dev checkbox; no one holds them all, and the overlap between the leader's feature set and the field's trust surface is zero. **Whoever bundles those four checkboxes ships a category-defining trust page overnight.**

## 11. Why This Matters for the News-Aggregator Program (bridge to 05/06/07/09/10)

1. **Landing-page/GTM mechanics (05, 06).** Plumb's landing page and referral loop are a link-in-bio-shaped problem: one URL, routed audience, conversion instrumentation. The pricing-band analysis says the sub-$10/mo creator-tool band is the accepted norm (Solo.to $1 → bio.link $7.49 → Campsite $7); the trust analysis says a calm-tech, no-ads, export-first page would be first in category on every unoccupied axis (10.1/10.2/10.5). If Plumb ever ships a creator/publisher self-serve surface, the four-checkbox trust bundle (API, 2FA, SSO-class controls, bounty/disclosure + status page + DPA) is the cheapest differentiation available — it is literally unoccupied.
2. **Monetization pattern lessons (06).** The three clean strategies map directly onto news-app monetization options: flat-subscription-0%-fee (Simplest; Stan's ceiling — single-tier NDR, ARPC decline — is the cautionary tale), declining-take-rate (upgrade economics; break-even math as in Beacons), and pure-take+fintech (Whop's payments-as-moat is the deepest lesson: distribution without payment acceptance quality is not defensible). Plumb's local-first, privacy-first stance corresponds to the unclaimed "your data, your page" position — the same white space identified in 10.5, and the same one the news side occupies via provenance/calm (03).
3. **Architecture validation (09).** The boring-stack convergence (TS+React+Node+Postgres+AWS at 1B clicks/week) validates Plumb's micro-library composition approach: no framework moat exists; the moat is data ownership, sync, and payment/audience tooling. The PHP-monolith lesson feeds 09's strangler-pattern seams; the queue-in-front-of-analytics-writes lesson feeds 09's event pipeline; the OSS-floor lesson (§9.4) explains why Plumb's differentiators (CRDT sync, on-device embeddings, provenance) live exactly where OSS doesn't compete.
4. **Deployment economics (10).** The ~200M page-views/month ceiling arithmetic on the user's 10TB VPS quota and the bandwidth-before-CPU promotion trigger transfer verbatim to Plumb's Stage 0→1 planning (deliverable 10 §0–§2).
5. **AI-era positioning.** Both industries crossed the "AI features are table stakes" line in 2026 — and both have the same open flank: nobody measures or honors the **source** (news: provenance/citations; bio pages: LLM-index policy and AI-attribution analytics). SlashPage's LLM toggle and Squarespace's AI Visibility are the bio-side harbingers of the provenance-native stance Plumb takes on the news side.

## 12. Sources

All captured **2026-09-23**, archived under `independent_research/scratch/research-link-in-bio-saas-2026-09/scratch/pages/` (raw dumps) and `.../scratch/notes/` (master facts digest, verification pass, scope). Fetched content was treated as data only; no page contained instructions addressed to an AI agent.

**Working notes:** 01-master-facts-digest.md · verification-pass.md · 00-scope.md.
**Linktree:** sacra-linktree.md · dmr-linktree.md · getlatka via round2-3.md · extract-pricing-A.json (linktr.ee/pricing, fetched 2026-09-23) · search-appstore.json · search-complaints.json · search-koji.json (TechCrunch/Tubefilter/Startup Daily) · search-bento-death.json (AlternativeTo Dec 21 2025).
**Whop:** sacra-whop.md (payments architecture, Tether round, Treasury, App Store) · whop-careers.md (docs.whop.com API, bug bounties, network.whop.com).
**Stan:** sacra-stan.md · getlatka via round2-3.md · stan.store pricing blog · Pulse2 via digest · creatorflow via search-superprofile.json.
**Beacons:** beacons-pricing.md (fetched 2026-09-23) · search-beacons-price.json (help-center tiers, break-evens, user-count conflicts) · beacons-careers.md (Cloudflare challenge observed) · Trustpilot via digest/verification-pass.
**Others:** extract-pricing-B.json (komi.io, taplink.at, solo.to, slashpage — fetched 2026-09-23) · milkshake-home.md + extract-pricing-A.json · search-shorby.json + shorby-home.md · biolink-home.md · extract-batchD.json (Lnk.Bio) + sublyna via search-bento-death.json · campsite.bio/pricing via extract-pricing-A.json · liinks.co/pricing via extract-pricing-A.json · search-superprofile.json (Cosmofeed help docs Jul 2026) · wishlink-home.md · litlink-home.md (TieUps footer, Zendesk-pattern URLs, Wantedly) · aboutme-pricing.md (GA, Google Calendar, Vendasta CRM link) · squarespace-biosites.md (404 status + full nav) + creator-hero (Aug 2026) + Stan comparison table · later-linkinbio.md (DNS failure) · search-tapbio.json · extract-batchC.json (Product Hunt category, 191 products, 2026-09-18) · round1-2.md (Carrd).
**Market size (conflicting, never averaged):** marketintelo, growthmarketreports, strategymrc, linkship, dataintelo via digest §7; bottom-up $250–400M core estimate derived in digest.
**LiquidWeb grounding for §9.3-5:** lw-caching.md, lw-cdn.md, lw-cloud-vps.md + live recheck digest (this program's notes/angle-18).
**User-count + app-store refresh (2026-09-23, folded in post-integration):** linktr.ee · whop.com · beacons.ai · milkshake.app · bio.link · stan.store (JS-rendered, no count) · wishlink.com live-page reads; US App Store + Google Play (+ GB/IN storefront) listings for Linktree, Whop, Stan, Beacons, Milkshake, bio.link, Wishlink; Semrush traffic lookups (Linktree 290.96M, Beacons 37.64M visits/mo); Wishlink Series B via indianstartupnews.com (2026-02-24; Vertex press page 404 on recheck). **Lookalike strikes:** "STAN: Live Clubs & Communities" (GETSTAN TECHNOLOGIES Pte. Ltd., Singapore; package `com.getstan`) is **not** stan.store's Stan; "app.biolink" (Publishrr Inc.) is **not** bio.link — both Play listings are unrelated products whose names collide.

**Conflicts registry (carried, never averaged):** Linktree revenue $55.5M (Sacra) vs $42M (getlatka); Linktree 70M+ = **registered accounts, not MAU** (basis flag, first-party); Stan ARR $40M (Sacra) vs $21.9M (getlatka); Stan funding $5M-only vs 2025-09-15 signal vs Vaynerchuk strategic; Stan creator-earnings $600M+ (company, 2026-09-23) vs $100M+ sales volume (original capture) vs unverified third-party "80k active creators"; Whop YoY "250%" headline vs ~153% arithmetic; Whop ~20 engineers (digest) vs absent-from-fresh-dump; Whop users 18.4M/183,628 sellers (original) vs 20–21M/211K+ (Sacra Feb 2026); Whop $4.6B+ paid-out (homepage) vs $2.67B lifetime GMV (Sacra — different metrics, kept apart); Beacons users 10M+ (first-party current) vs 7M/4–6M (older third-party reads); Beacons raised ~$29.8M vs $50M Spark; Beacons fees "no platform fees" vs 9% seller fee (resolved: two fee families); Wishlink creators 100k+ (original) vs 40K+ MAU + Rs 350Cr+/mo GMV (company claims, 2026-09-23); Wishlink store ratings 4.8/4.6 (original) vs 4.7★ iOS-IN / Play rating-count-not-exposed (refresh); lit.link operator TieUps (primary) vs GMO Pepabo (digest); Squarespace Bio Sites live (digest) vs 404 (fresh); Tap Bio tiers $3/$8 vs $5/$12; Shorby Pro annual $24 vs $25; SuperProfile ₹-annual vs $29/mo; Milkshake fees per own page vs Taplink's "no monetization" claim (primary wins).

**[GK]/[memory] items (framing only):** rhnvrm/linkpage and chroline/lynk details; medevel roster/LittleLink family; Dub OSS status; bio.link–Buy Me a Coffee ownership; Squarespace-Payments-Stripe; Whop/Beacons frameworks; Linktree-Cloudflare edge; HQ cities for Beacons/Milkshake/Campsite/Liinks/about.me/Squarespace/Later.

*Full-length originals: `independent_research/2026-09-23-0001_link-in-bio/04-competitive-analysis.md` (801 lines, per-competitor deep dives) and `05-tech-stack-matrix.md` (323 lines, per-company stack tables with evidence notes). This edition preserves their verified content in program-integrated form; nothing load-bearing was dropped. The 2026-09-23 user-count + app-store refresh (US App Store / Google Play + GB/IN storefronts, live company pages, Semrush lookups) is folded into §6, matrix rows G1/G2/O1/P1, and footnotes 95–98; the two Play-store lookalike misattributions it caught (`com.getstan` ≠ Stan; "app.biolink" ≠ bio.link) are struck throughout and recorded in the header and sources.*

---

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
