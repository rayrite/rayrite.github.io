# COMBINED MARKDOWN - 2026-09-23-black-social-networks-deep-dive

_Generated 2026-09-23 15:45:30 | 8 files | folder: D:\stuff\ai-misc\_bsh2026\vscode_project01\46-wide_research_test\independent_research\2026-09-23-black-social-networks-deep-dive_

## Contents

1. 01-exec-summary-landscape.md
2. 02-platform-deep-profiles.md
3. 03-market-sizing-funding.md
4. 04-demand-pain-points.md
5. 05-competitive-analysis-matrix.md
6. 06-tech-architecture-devsecops.md
7. 07-patterns-strategy-graveyard.md
8. README.md

---

<!-- ====================================================================== -->
<!-- FILE: 01-exec-summary-landscape.md -->
<!-- ====================================================================== -->

# Executive Summary & Landscape — Black/African-American Social Networks (September 2026)

**Research date:** 2026-09-23 · **Deliverable 01 of 8** · Run per the deep-wide-research workflow: 6 parallel angle agents (cohort profiles, landscape sweep, demand/pain, money/market, tech/architecture, failure patterns) + lead verification pass on load-bearing conflicts + synthesis.

**Scope statement.** A deep dive on social networks that specifically cater to African Americans and/or have substantial African-American membership: the named cohort (**Spill, Fanbase, Spark, BlackPlanet, Blacksky**) plus the complete discovered landscape — live platforms, the graveyard, and the adjacencies. "Done" = company-level ground truth per live platform, full landscape enumeration and classification, demand-side and market/funding evidence, a competitive matrix through consumer + developer/DevSecOps lenses, tech/architecture notes, and pattern analysis.

**A note on "Spark":** no standalone Black-community social app named Spark exists on either app store as of 2026-09-23. The evidence-supported referent is **Fanbase Spark** — Fanbase's X/Threads-style microblogging feature announced Dec 13 2024, which most plausibly ships inside the forthcoming "Fanbase 1.5" rebuild (Fanbase's apps are currently off both stores). Spark is therefore profiled within Fanbase throughout (02 §1.3 lists every rejected candidate, including Spark Social, an unrelated AT Protocol client). *If a different Spark was meant, say so and it gets its own pass.*

---

## The one-paragraph read

Black Americans are the most platform-committed cohort in America — over-indexing TikTok by 16 points, Threads at 3× the white rate, the highest daily-use share on X (Pew 2025) — against a supply side that has never matched that demand: **no Black-focused social platform has more than 350K documented MAU or 750K cumulative downloads**; the entire live cohort has raised ≈$27–35M (vs $5.2B/yr peak VC to Black founders generally, of which consumer social is anecdote-scale); and 2024–26 saw the segment's oldest asset die (BlackPlanet's social network, sunset May 15 2026) and its best-funded one pulled from both app stores mid-rebuild (Fanbase "Version 1.5"). The demand is durable and the pain is documented — peer-reviewed classifier bias against AAVE, acknowledged shadowbanning, a 35% creator pay gap — but the supply side keeps breaking on **moderation economics, capital fragility, and distribution chokepoints**, not on culture or community. The segment's most consequential 2026 development is also its least consumer-visible: Blacksky — $0 VC, donation-funded, 350K documented feed MAU — has productized its entire open-source community infrastructure (Acorn) and its founder is standardizing permissioned community posts into the AT Protocol as a 2026 Mozilla Fellow.

## Headline findings

1. **The verified scale ceiling is tiny and provable only once.** Exactly one documented MAU figure exists in the whole segment — Blacksky's **350K feed MAU (Mar 2025, triple-sourced)**. Everything else is downloads (Spill 750K cumulative), registrations (Fanbase "1.4M" self-reported; Byio "1.5M" company PR, unverified), or era-stamped history (BlackPlanet 18M members 2007–08). The median user never left the majors — what left X after 2022 was *organized cultural infrastructure*, and it landed in layers: cultural energy → TikTok/Threads; community organization → Blacksky inside a 2%-Black Bluesky; Black-owned standalone apps → ≤100K-download scale (04 §3).
2. **Fanbase is the segment's capital case study.** $16,963,858 final Reg A+ close (Jan 21 2026) at a $160.03M pre-money — **~1,500× its audited FY2024 revenue of $106,651** (net loss −$3.09M) — on top of ≈$4.5M prior RegCF; then off both stores for the "1.5" rebuild. Community capital works as formation (34% of new Reg CF deals have minority founders) but has not yet bought product-market revenue (03 §5–6).
3. **Equity crowdfunding is the segment's actual capital market.** ≈75%+ of the cohort's ~$27–35M is community-financed; Black consumer-social VC is anecdote-scale (Spill's ≈$6M is the flagship raise), and race-conscious private-capital workarounds are under active legal pressure (Fearless Fund settled Sep 2024; DOJ–PayPal $30M, May 2026) (03 §3, §5).
4. **Moderation economics is the binding constraint.** The documented best case: 6 donation-funded moderators absorbing ~500 reports/day at 872.5K feed subscribers (WIRED, Jan 2025) — an inherited above-baseline harassment load (peer-reviewed: AAVE tweets up to 2× more likely flagged offensive; harassment-driven Black-user attrition at Instagram acknowledged) met with below-baseline budgets. Churn on the niche platforms' own review corpora is product quality, feed cold-start, and monetization confusion — never "the community failed" (04 §5–6).
5. **One architecture is public; the rest are opaque.** Blacksky published everything — Rust firehose consumer replacing a TS path that would take 6.5 years to backfill 18.5B records, Postgres-17 AppView, community-only posts via custom lexicon, subscribable culture-specific labeler (digital blackface, misogynoir), wellbeing-instrumented Ozone fork. Spill's stack is legible at the perimeter (Nuxt/Vercel/Sanity/Braze; live-audio vendor undisclosed), Fanbase's 1.5 is a teaser, BlackPlanet-2026 is a Ghost news site (06).
6. **The 2024–26 landscape churned hard both ways.** Deaths/sunsets: BlackPlanet social, TruSo, blackEX, MELD, SoulSwipe; acquisitions: The Root (Watering Hole Media, Oct 2 2025); launches: Byio, BlackShares, Upfront, Troodie, blackEX (dead within 14 months), DiasporaHub, Afrosmeet, Ruut, Pay Black Creators, Black Nile (02 §4).
7. **Ad monetization is not structurally dead — one counterexample.** Spill ran ads/partnerships "since day one" and is the segment's most actively shipped consumer app (iOS v2.3.6, Sep 19 2026). But the documented ad-market mechanism against the cohort (keyword blocklists stripping 15–37% of Black-publisher traffic; AAVE misclassification suppressing reach *and* monetization simultaneously) explains why the rest of the segment is subscription/donation-first (03 §4).

## Pre-registered prediction scorecard (from 00-scope.md, written before research)

| # | Prediction | Verdict |
|---|---|---|
| 1 | No platform >5M MAU; named cohort all <1M MAU | **HELD** (on MAU basis — the only documented MAU is 350K; caveat: registration claims can't be falsified, only basis-flagged) |
| 2 | Fanbase = largest-claimed/unverifiable; BlackPlanet stays dead | **HELD** (1.4M self-reported unverifiable; BlackPlanet news-only after May 15 2026) |
| 3 | ≥2 sunsets/acquisitions + ≥3 launches 2024–26 | **HELD** (5 dead + 1 acquisition; 10+ launches) |
| 4 | Combined cohort capital < $100M, crowdfunding-dominant | **HELD** (≈$27–35M, ~75%+ community capital) |
| 5 | Survivors all monetize subs/payments, not ads | **PARTIALLY FAILS** — Spill is ad/partnership-funded; the prior was wrong in exactly one case, which is informative rather than noise |

## Deliverables map

| File | Contents |
|---|---|
| `01-exec-summary-landscape.md` | This file — headline findings, prediction scorecard, landscape overview |
| `02-platform-deep-profiles.md` | Ground-truth profiles: named cohort (Spill, Fanbase+Spark disambiguation, BlackPlanet, Blacksky), discovered true-social roster, adjacents, 2024–26 timeline |
| `03-market-sizing-funding.md` | Spending-power series, creator pay gap, VC desert, Reg CF rail + Fanbase case, monetization benchmarks, cohort capitalization, derived TAM/SAM/SOM |
| `04-demand-pain-points.md` | Pew 2025 usage-by-race tables, Black Twitter documentation, diaspora timeline, tiered pain-point evidence, complaint corpora, moderation economics |
| `05-competitive-analysis-matrix.md` | Skill-conformant competitive analysis: roster with 2026 defenses, per-competitor profiles, category-block matrix (consumer + dev/DevSecOps), strategic observations |
| `06-tech-architecture-devsecops.md` | Observable stacks, Blacksky architecture deep dive, AT Protocol vs standalone trade-offs, AAVE/classifier bias as an architecture requirement, threat model, store gatekeeping |
| `07-patterns-strategy-graveyard.md` | Failure mechanics and survivor patterns (from the patterns agent) |
| `README.md` | Run metadata, verification outcomes, known gaps, reproducibility |

## Landscape at a glance (2026-09-23)

- **Live, shipping:** Spill (iOS+Play+web), Blacksky (iOS+Play+web+protocol infra), WeKinFolk (web), Circl, BlackShares, MelaninPeople (stagnant), Movespot, GoodFeed, Frequency People.
- **Live company, product in transition:** Fanbase (off-store for V1.5; Spark inside it).
- **Sunset/pivoted:** BlackPlanet (news platform, Urban One), TruSo, blackEX, MELD, SoulSwipe, AsianAvenue/MiGente (historic Community Connect siblings), AOL BlackVoices.
- **Adjacent and healthy (indirect competition):** BLK + BlackPeopleMeet (Match), eatOkra/OBWS/Naspora, The Shade Room/TheGrio/The Root, Gathering Spot, HBCUConnect/Black In HR.

## Known gaps carried into the record

Black Twitter's "~5M" sizing primary · Spill waitlist/M AU · Fanbase cumulative lifetime raise, burn rate (three conflicting figures retained), 1.5 stack and store relaunch · Byio's 1.5M registrations (company PR only) · Spill live-audio vendor · commercial moderation-API pricing at subscale · Play data-safety labels (bot-walled) · transparency reports/warrant canaries (none in the segment) · Pew 2023→2025 mode break (deltas directional). Full GAP lists per file; verification-pass outcomes in README.


---

<!-- ====================================================================== -->
<!-- FILE: 02-platform-deep-profiles.md -->
<!-- ====================================================================== -->

# Platform Deep Profiles — Black/African-American Social Networks (Named Cohort + Discovered Landscape)

**Research date:** 2026-09-23 · **Deliverable 02 of 08** · **Companions:** `01-exec-summary-landscape.md` (overview), `05-competitive-analysis-matrix.md` (competitive surface), `06-tech-architecture-devsecops.md` (stacks)

**Method.** Every named-cohort claim was checked against primary sources on 2026-09-23: SEC EDGAR filings (Fanbase CIK 1826213), Wefunder/StartEngine campaign records (via Kingscrowd where bot-walled), live app-store listings (iTunes Search/Lookup API, Google Play web), company sites, founder posts, and dated press. **Basis flags are mandatory:** *registered users ≠ MAU ≠ downloads ≠ feed subscribers.* Where figures conflict they are listed side by side, never averaged. Full per-source URL lists live in the agent digests (`independent_research/scratch/research-black-social-nets-2026-09/scratch/notes/`); key sources are cited inline by publisher + date.

---

## 1. The named cohort — five entries, four live social products

### 1.1 Spill (Real Spill Corporation / "Spill Corp") — LIVE, shipping

| Dimension | Ground truth (2026-09-23) |
|---|---|
| Founded | 2022–23 by **Alphonzo "Phonz" Terrell** (ex-Twitter global head of social & editorial, laid off Nov 2022) + **DeVaris Brown** (ex-Twitter PM); Sherman Oaks, CA; ~6 employees per Wefunder filing |
| Product | Culture-first social app positioned as the Black Twitter successor; invite-only iOS beta **Jun 2023** (first release 2023-06-11); **Tea Parties** = live audio/video rooms (first one hosted by Kerry Washington) |
| Funding | **$2.75M pre-seed (Feb 2023**, MaC Venture Capital + Kapor Center + Sunset Ventures) → **$2M extension (Nov 2023**, Collide Capital; Kerry Washington among backers; ">$5M as of Oct 2024") → **RegD preferred round (Mar 2025**, MaC/Collide/Kapor; amount undisclosed in filings) → **Wefunder RegCF SAFE (Feb 2025–Mar 2026): $410,239 raised, $20M valuation cap.** **Total ≈ $6M per ForbesBLK (Mar 30 2026).** *Correction: the circulating "seed led by Cosmos" claim is wrong — Cosmos is an unrelated app.* |
| Scale | **500K+ downloads** (company claim, Mar 2025) → **750,000 downloads** (ForbesBLK, Mar 30 2026) — cumulative downloads across stores; Google Play band "50K+" (Android only). **MAU never disclosed.** FY2024 revenue **$235.6K** (Wefunder filing via Kingscrowd). "$1M annualized revenue" = **projection only** (AfroTech, Apr 2025), not a filed figure |
| Live status | **iOS v2.3.6 updated 2026-09-19** (1,635 ratings, 4.55★); Play active; spill.com up; Instagram active through Jul 2026 |
| Monetization | Ads/paid partnerships "since day one" + blockchain-based viral-content rewards for creators + community equity (Wefunder) — a hybrid, **not** pure subscription (the one counterexample to the niche's subs-only pattern) |
| Notable | Terrell sold his house to fund the build (ForbesBLK Mar 30 2026); the launch-period moderation pitch was an AI model "with Black dialects in its DNA," explicitly citing AAVE-misflagging research (TechCrunch, Jan 30 2023) |

### 1.2 Fanbase (Fanbase Social Media, Inc.) — LIVE as a company; apps deliberately OFF-STORE mid-rebuild

| Dimension | Ground truth (2026-09-23) |
|---|---|
| Founded | **2018, Atlanta, by Isaac Hayes III** (producer/songwriter, son of Isaac Hayes Jr.); ~8 key employees (Feb 2024 materials) |
| Product | Subscription-first social app: creator subscriptions (packs of 1/3/5), "Love" tipping (1¢ each, **50/50 split, paid monthly per SEC filing**), audio/video rooms. **Fanbase Spark** = in-app X/Threads-style microblogging feature for "citizen journalism and cultural conversations," announced **Dec 13 2024** (see §1.3) |
| Funding (SEC-primary) | RegCF campaigns Oct 2020 / Dec 2021 / Sep 2022 (**$4.5M by Nov 2022**) → **Reg A+ offerings qualified Feb 26 2024 and Mar 4 2025** → **final campaign closed Jan 21 2026: $16,963,858 invested of $17.595M max**, common stock at $6.65/share, **$160.03M pre-money** (Kingscrowd from EDGAR). Record claims: 2024 $10M milestone — "first Black man to raise $10M seed via StartEngine/RegCF." **Cumulative all-time total unpublished** — "~$17M" refers to the final campaign alone; adding prior RegCF puts lifetime ≈ $21M+ |
| Audited FY2024 (Form 1-K) | **Revenue $106,651** · net loss **−$3.09M** · cash $922K · **60,791 users have ever earned revenue** · MAU up but creator count down. Burn-rate figures conflict by source and date: $135K/mo (2024 Reg A+ materials) vs ~$460K/mo (per 1-K reading) vs ~$257K/mo implied by the net loss — **retained side by side, unresolved** |
| Scale claims | **570K users (Feb 2024**, StartEngine materials) vs **"1.4M users" (Hayes IG, Jun 14 2026, self-reported registered)** — bases conflict; paying-subscriber count never disclosed |
| Live status | **ABSENT from both app stores**: `com.fanbase.app` on iOS and Play now serves an **unrelated Edinburgh UK sports-ticketing app** ("Fanbase Technology Limited", release date 2022-03-09 preserved — consistent with an app-record transfer). fanbase.app is a waitlist teaser: *"a new Fanbase is coming — Version 1.5… rebuilt from the ground up"* (© 2026 Fanbase Social Media, Inc.; founder X post Sep 7 2026). Play listing was still alive **Aug 8 2026** (Wayback). "Deliberate pull for V1.5" is single-sourced (AI-overview of Hayes statements) — flagged, but the teaser + timing corroborate the direction |
| Historical pricing | IAP range $2.99–$99.99 (prior listing era) — **currently unverifiable, listing gone** |
| The money quote | **$16–17M crowdfunded against $106,651 FY2024 revenue and a ~$3M/yr loss** — the starkest capital-vs-revenue gap in the niche (analysis in 03 §5) |

### 1.3 Spark — disambiguation (the user's fifth name)

**No standalone Black-community social app named "Spark" exists on the App Store (checked 2026-09-23).** The evidence-supported referent:

- **Primary: Fanbase Spark** — Fanbase's companion microblogging product (§1.2), announced Dec 13 2024 for 2025, described as an X/Threads competitor for citizen journalism and cultural conversations. Rollout status ("began mid-2026") is **unconfirmable while Fanbase is off-store for the V1.5 rebuild** — the strongest signal that Spark ships inside Fanbase 1.5 rather than as a standalone app.
- Rejected candidates (checked, not Black-community products): spark.love (social discovery), **Spark Social** — an AT Protocol client by Joe Basser (adjacent to Blacksky's ecosystem but not a Black-community product), sparkbusiness.global.
- Handling in this report: Spark is profiled as **Fanbase's microblogging wedge (§1.2)**, not as a fifth standalone platform. If the user meant a different Spark, the standalone section above lists every candidate examined.

### 1.4 BlackPlanet — social network SUNSET; news platform LIVE

| Dimension | Ground truth |
|---|---|
| Golden era | Launched **Sep 1 1999** by **Omar Wasow** with Community Connect (Benjamin Sun), NYC. **18M members / 6M monthly uniques by 2007–08** — the largest Black web community of the pre-Facebook era |
| Sale | **Apr 2008: sold to Radio One (now Urban One) for $38M**; declined post-2011 as Facebook absorbed the graph |
| Social sunset | **May 15 2026** — the social network was sunset (prior-run verification); pivot date to news is undocumented (site still social-flavored through 2025, news-mode by Sep 2026) |
| Today (2026-09-23) | Web-only **Black news aggregation platform** under Urban One/Interactive One: "180,000+ daily readers" / 200K+ readers / 200+ contributors — **all self-reported homepage claims, unverified**; free daily newsletter, advertising, contributor rev-share. **No official app** (only third-party squatters + a 2016 Urban One radio app) |
| Historic stack | Wasow's "home-grown software" is the only documented stack claim — no language/DB on record (GAP; see 06 §5) |

### 1.5 Blacksky (Blacksky Algorithms) — LIVE, growing, donation-funded, federated

| Dimension | Ground truth (2026-09-23) |
|---|---|
| Founded | **Rudy Fraser** (Queens, NY technologist/organizer; Harvard Berkman Klein affiliate Jan 2025; **2026 Mozilla Fellow**). Started 2021 as a Bluesky custom feed; launched 2023; core team ~5 (Fraser CEO; Dr. KáLyn Coghill Community; JD Lauwerends T&S; Marisa Rando Product; Rishi Balakrishnan Founding Eng) + moderators |
| Product | Black community on the AT Protocol: Blacksky feeds inside Bluesky → **standalone mobile public beta Jul 29 2026** (TestFlight + Play) → **iOS App Store release "Blacksky Community" Sep 17 2026** (v1.130.1, seller Rishi Balakrishnan, 17+). Permissioned community-only posts (first on AT Protocol), People's Assembly governance (self-hosted Polis), blacksky.cash mutual-aid payments, Acorn (turnkey community-platform product) |
| Funding | **$0 VC.** Open Collective donations: **$6,021/mo of $7,500 goal (80%), 1,249 contributors** (min $7/mo). "Scaled 0→2M users with $0 spent" (Fraser, Aug 2025) |
| Scale (basis-flagged) | 23K users in first 3 months (2023) → 1M feed views in a day (Nov 6 2024, day after election + Tyson–Paul fight Nov 15 2024 stress test) → **872,500+ feed subscribers, 6 donation-funded moderators, ~500 reports/day (Jan 2025, WIRED)** → **350,000 monthly active users of the feeds (Mar 2025** — triple-sourced: Tech Policy Press podcast Mar 3 2025; Open Rights Group PDF Nov 2025; Blacksky blog Aug 2026) → 2M users (Aug 2025, Fraser) → **"3M+ community members" (Aug 7 2026, self-reported — cumulative/community basis, not MAU)**. iOS store copy's "40 million users" refers to the **AT Protocol network**, not Blacksky — flagged as misleading |
| Live status | Blog active through Sep 21 2026; apps live; atproto.africa full-network relay + moderation-label replay relay in production |
| Monetization | Donations (Open Collective) + platform services (Acorn) — no ads, no consumer subscription as of 2026-09 |
| Notable | The only platform in the cohort with a **public, composable, open-source architecture** (see 06 §2) and the only one whose moderation economics are documented (donation-funded mods at ~500 reports/day — the niche's binding constraint, analysis in 04 §6) |

### 1.6 Cohort comparison table

| Platform | Founded | Total raised | Best scale figure [basis] | Revenue (latest filed/claimed) | Live 2026-09-23 | Monetization |
|---|---|---|---|---|---|---|
| Spill | 2022 | ≈$6M [2° ForbesBLK 2026-03] | 750K downloads [cumulative] | $235.6K FY2024 [P: Wefunder filing] | ✅ iOS+Play+web | Ads/partnerships + crypto rewards + community equity |
| Fanbase | 2018 | ≈$21M+ lifetime [P: EDGAR; cumulative unpublished] | 1.4M registered [self-reported 2026-06] | $106.7K FY2024 [P: 1-K] | 🟡 company live; apps off-store for V1.5 | Subscriptions + Love tips (50/50) |
| Spark (Fanbase) | announced 2024-12 | (within Fanbase) | n/a — unconfirmable mid-rebuild | n/a | 🟡 ships inside Fanbase 1.5 | (inherits Fanbase rails) |
| BlackPlanet | 1999 | $38M exit 2008 | 18M members [2007-08 peak] | n/d (news platform; 180K+ daily readers claimed) | 🟡 news platform only; social sunset 2026-05-15 | News advertising + newsletter |
| Blacksky | 2021 | $0 VC; ~$72K/yr donations | 350K feed MAU [2026-03-03, triple-sourced]; 3M+ members claimed [cumulative] | n/d (donation-funded) | ✅ iOS+Play+web+protocol infra | Donations + Acorn platform services |

---

## 2. Discovered true social networks / community platforms (beyond the named cohort)

All liveness checks 2026-09-23 via iTunes Search/Lookup API + domain checks (Agent B digest for per-platform sources).

| Platform | Founder / owner | Status | Category | One killer fact [source] |
|---|---|---|---|---|
| **WeKinFolk** | Ernest L. Manning Jr. (f. 2020, self-funded) | LIVE — web-first; iOS app stale since 2020 | True social | Full social suite (timeline/groups/monetization/market); **50K+ members claimed** [BlackNews.com Nov 2025] |
| **Byio ("By Invite Only")** | R.M. Easterly, Detroit | GROWING — launched Sep 9 2025; community rollout Jan 2026 | True social | Invite-only Black-women-owned "AI super app"; **claims 1.5M verified registrations by Aug 2026 — company PR only, single-source, no public URL** |
| **Circl** | Martial Liboutet | LIVE/small | True social | Afro-diaspora creator monetization with payouts to US/France/Nigeria/Kenya/SA/Cameroon; iOS updated Sep 12 2026 |
| **BlackShares** | Vince Martin, Upsides Network LLC (Atlanta) | LIVE/small | Social + professional hybrid | "Drop-in replacement for BlueSky and LinkedIn" with rev-share dividends + Black-founder fund; announced Mar 21 2025 |
| **MelaninPeople** | Adeyinka Adegoke | STAGNANT-leaning-live | True social | Global Black/brown socio-business network + marketplace; iOS last updated Jul 2024 (36 ratings) |
| **Movespot** | Movespot Inc. | LIVE/small | True social + IRL | Virtual + in-person meetups; iOS updated Nov 2025 (293 ratings) |
| **GoodFeed** | founder unknown (GAP) | LIVE | Social/media hybrid | Black-owned community platform (NewsOne); self-described women-creator platform |
| **Frequency People** | SpokeHub Inc. | Maintained, minuscule | Social | iOS updated Aug 2026 — 7 ratings |
| **TruSo** | Matthew Newman | **DEAD** — launched Juneteenth 2022; jointruso.com is a domain-for-sale parking page; no app in either store (verified 2026-09-23) | Professional social | The cautionary case: VC-backed "Black LinkedIn" that vanished without a documented sunset |
| **blackEX** | Dedric & Joyce Thomas | **DEAD/STALLED** — soft-launched Jul 2025, site unreachable Sep 2026 | Social/exchange | Died within 14 months of launch |
| **BEAN** | attribution single-source | UNCERTAIN | Professional | LinkedIn-style Black professional net on 2025 roundups; name-conflicted (Black Economic Advancement vs Employee & Ally Network); no app found |

---

## 3. Adjacent landscape (classified, enumerated)

**Professional (2):** The Black In HR (live — iOS updated 2026-09-23); HBCUConnect (live, IG 30.8K, posting Sep 2026); HBC Talk (small live forum). *(Black Rise: App Store ID reused by an unrelated app — availability uncertain.)*

**Marketplace / directory (3):** Official Black Wall Street (live, active drops); **WeBuyBlack → rebranded Naspora** (~late 2025; 301 confirmed); eatOkra (live/growing — 24K+ Black-owned restaurants US/UK/CA; iOS updated Aug 2026); Blapp — Jon Laster (live, updated Sep 2026); Troodie (live/small, launched Aug 2024); Local Black "Pay Black Creators" (launched Mar 5 2026, Pittsburgh); Sould App (live).

**Dating (4):** **BLK** (Match Group/Affinity Apps — dominant: 554K iOS ratings, updated Sep 16 2026, 5M+ downloads 2025); **BlackPeopleMeet** (Match Group — the two-decade paid-niche proof point); BlackGentry (live/growing — 27K ratings, updated Sep 22 2026); Upfront ("healing-first" AI dating for Black professionals, launched mid-Jul 2025 — no iOS found, flagged); SoulSingles (live/small). **Presumed inactive:** MELD, SoulSwipe (absent from stores and 2025–26 coverage). Diaspora-flagged: AfroIntroductions (Cupid Media), Ruut (Jun 2026), Afrosmeet (Feb 2026).

**Media-with-community (5):** **The Shade Room** (live — 28–29M followers, famously turned down $100M); WorldStarHipHop (live, IG posting Sep 2026, Worldstar LLC); TheGrio (live — still Byron Allen's Allen Media Group); **The Root — acquired Oct 2 2025 by Ashley Allison's Watering Hole Media from G/O Media** ("returned to Black ownership"; price undisclosed); Blavity/AfroTech (live; ~$9.4–12M lifetime raised; no new events); Baller Alert (live/expanding — Creator Network, REVOLT show); GlobalGrind (live under iOne Digital, bought from Russell Simmons 2011; evergreen-content mode).

**IRL clubs with apps (6):** The Gathering Spot — acquired by Greenwood (fintech) May 2022; founders Ryan Wilson & TK Petersen bought back majority by late 2023 (single-source); now independent (Atlanta + DC clubs; **LA closed Mar 2026**; app updated May 2026).

**Graveyard (historic):** Community Connect trio — AsianAvenue (1997), MiGente, BlackPlanet (both now redirect); AOL BlackVoices (Tribune → AOL; community dead); TruSo; blackEX; SoulSwipe; MELD; Black Trade Circle.

---

## 4. 2024–2026 event timeline (launches, deaths, acquisitions)

| Date | Event |
|---|---|
| Aug 2024 | Troodie launches (marketplace) |
| Jul 2024 | MelaninPeople's last iOS update (stagnation begins) |
| Mar 2025 | BlackShares announced (Mar 21) |
| Apr 2025 | DiasporaHub unveiled (diaspora-focused) |
| Jul 2025 | Upfront dating launches; blackEX soft-launches (dead by Sep 2026) |
| Sep 9 2025 | **Byio launches** (invite-only "AI super app") |
| Oct 2 2025 | **The Root acquired** by Watering Hole Media |
| Late 2025 | WeBuyBlack rebrands to Naspora |
| Nov 2025 | WeKinFolk 50K-members claim (BlackNews.com) |
| Jan 2026 | Byio community rollout; **Fanbase final crowdfunding campaign closes (Jan 21, $16.96M)** |
| Feb 2026 | Afrosmeet launches (dating) |
| Mar 2026 | Black Nile (Mar); **Gathering Spot LA closure**; Local Black "Pay Black Creators" (Mar 5) |
| Jun 2026 | Ruut launches (dating) |
| Aug 2026 | Byio 1.5M-registration claim; Fanbase Play listing last alive (Aug 8, Wayback) |
| Sep 2026 | Fanbase absent from both stores (V1.5 rebuild); Blacksky iOS release (Sep 17); Spill iOS v2.3.6 (Sep 19); The Black In HR active dev |

---

## 5. Key sources (per-claim detail in agent digests A + B)

- **SEC EDGAR:** Fanbase Form C/1-K/Reg A+ filings, CIK 1826213 (2020–2026).
- **Crowdfunding records:** Kingscrowd deal pages (Wefunder Spill SAFE $410,239 / $20M cap; Fanbase Reg A+ close $16,963,858 / $160.03M pre, Jan 21 2026); StartEngine campaign materials (570K users, Feb 2024).
- **Dated press:** TechCrunch (Spill pre-seed Jan 30 2023; invite beta Jun 2023; Bluesky Nov 15 2024); **ForbesBLK — A. Jackson-Jolley, Mar 30 2026** (Spill: house sale, 750K downloads, $6M raised, white paper); WIRED (Jan 2025: Blacksky 872.5K subscribers, 6 mods, ~500 reports/day); **Tech Policy Press podcast (Mar 3 2025): 350K feed MAU**; NBC (Nov 2024: 1M feed views/day); AfroTech (Apr 2025: $1M annualized projection); BlackNews.com (Nov 2025: WeKinFolk).
- **Live checks 2026-09-23:** iTunes Search/Lookup API (US) for every roster app; Google Play web listings; company domains (fanbase.app teaser, spill.com, blackskyweb.xyz, jointruso.com parking); Open Collective (Blacksky $6,021/mo, 1,249 contributors); Wayback Machine (Fanbase Play Aug 8 2026; BlackPlanet 1999–2026 arc; Pew 2023 fact sheet).
- **Agent digests:** `scratch/notes/agent-A-cohort-profiles.md`, `agent-B-landscape-sweep.md` (full URL lists, fetch logs, basis notes).


---

<!-- ====================================================================== -->
<!-- FILE: 03-market-sizing-funding.md -->
<!-- ====================================================================== -->

# Market Sizing & Funding — The Black Social-Network Niche

**Research date:** 2026-09-23 · **Deliverable 03 of 08** · **Companions:** `02-platform-deep-profiles.md` (who raised what), `04-demand-pain-points.md` (the demand side), `07-patterns-strategy-graveyard.md` (what the money pattern means)

**Method.** Anchor numbers are presented in **methodology-banded series, never averaged**: income-based "buying power" constructs, actual-spend survey bases, and VC-market shares measure different things and are kept separate. SEC EDGAR filings and PDF reports were fetched as primaries. Full source URL lists: `scratch/notes/agent-D-money-market.md`.

---

## 1. Black consumer spending power — the anchor series

| Source | Figure | Year | Basis |
|---|---|---|---|
| Selig Center (UGA), Multicultural Economy | $320B (1990) → $609B (2000) → $961B (2010) → $1.3T (2018) → **$1.6T = 9% of US total (2020)** | 1990–2020 | Total income after taxes, modeled from Census/BEA data. **No public edition found post-2021 (GAP)** |
| Nielsen, Diverse Intelligence Series | **"$2T in buying power"**; "on pace to spend >$2T by 2026" | Jan 29 2025 | Derivation unpublished (GAP); same report: Black adults 32 hrs/wk on apps/web (2 hrs above US avg), 46h13m/wk TV, YouTube reaches 63% |
| McKinsey, "Economic State of Black America" | **Actual household spending $835B (2019)** = 9.9% of US expenditures vs 13.4% population share | 2021 report, BLS Consumer Expenditure Survey basis | Explicit footnote: >$1.3T buying-power figures are **pretax-income constructs**; McKinsey's number is actual spend |
| McKinsey (same) | **$300B/yr unrealized consumption**; **$260B of current spending where Black consumers are dissatisfied and would pay up to 20% more** | 2021 | Product-gap analysis |
| Counterweight (wealth, not income) | Black wealth $5.39T = 3.4% of US total (Q3 2024); $313B in stocks vs $41T white | Q3 2024 / Feb 2025 (Axios) | Federal Reserve household data |

**Defensible band: $835B actual spend ↔ $1.6–2.0T income-based buying power.** Any pitch deck using a single number from this range should name its basis.

## 2. Creator economy and the Black creator pay gap

- **Category TAM:** $250B (2023) → ~$480B by 2027 (Goldman Sachs, Apr 2023); only ~4% of creators earn >$100K.
- **The pay gap (MSL × Influencer League, "Time to Face the Influencer Pay Gap," Dec 6 2021, PR fetched):** white–Black creator pay gap **35%** (white–BIPOC 29%); **77% of Black creators sit in the lowest-pay tiers** (avg $27,727.90/yr) vs 41% of white (macro-tier avg $108,713.54); 92% say pay transparency is the fix. Follow-ups: year-one brand-deal rates 46% BIPOC vs 73% white (Jul 2023); UK replication gap 34% (SevenSix, 2024).
- **Counterweight:** Black lifestyle creators deliver **10.5× more media value** than benchmarks (Nielsen × Realeyes) — the undervaluation is against output, not demand.

## 3. VC funding for Black founders — peak to trough (Crunchbase series)

| Year | $ to Black-founded startups | % of total VC |
|---|---|---|
| 2021 (peak) | **$5.2B** | 1.5% |
| 2022 | ~$2.2B | ~1% |
| 2023 | **$661M** (−71% YoY) | 0.48% |
| 2024 | ~$730M | 0.4% |
| 2025 | **$942M** | **0.32%** (dollars up, share down in the AI boom) |
| 2026 YTD (May) | $643M / 34 deals (one outlier: SambaNova $350M) | — |

Pre-2021 range: 0.8–1.3%. **Black consumer-social VC is anecdote-scale:** Spill ≈ $6M total is the category's flagship raise; Google for Startups Black Founders Fund (> $40M non-dilutive since 2020) and accelerators are the other rails.

**Legal chokepoints on race-conscious capital:** AAER v. Fearless Fund **settled Sep 11 2024** (the Black-women grant program permanently closed); **DOJ v. PayPal settled May 2026 for $30M**, dismantling its $530M minority-business program. The VC desert's private workarounds are under active legal pressure — which pushes founders toward the rail in §5.

## 4. Monetization benchmarks for identity-niche social

**Paid-conversion references (majors):** Snapchat+ 25M subs ≈ 2.7% of 932M MAU ($1B direct ARR, Feb 2026); Telegram Premium 15M ≈ 1.5% of ~1B; Discord Nitro ~7.3M ≈ 2.9–3.7% of ~200M MAU (est.). **Identity-niche paywall proof: BlackPeopleMeet at $16.75–20.64/mo (1-mo) and $8.33–12.99/mo (multi-month)** — two decades of Black consumers paying directly for an identity-focused product.

**The ad-market reality for this cohort (why subs, not ads):**

- BLM/George Floyd content saw **−57% monetization** from keyword blocklists (Jun 2020); Black-owned publishers still hit (Digiday, Nov 7 2023); corroborating figures: CHEQ 18% traffic loss, AdExchanger 54% for news generally (IAS/Reuters).
- **AAVE is systematically misclassified as toxic** by commercial classifiers (Sap et al., ACL 2019; ACM 2025 follow-up) — an ad-monetized Black-audience platform inherits structural undermonetization *and* over-moderation simultaneously. This is the documented mechanism behind the niche's subscription-first pattern (and Fanbase's explicit ad-free positioning).
- Generic subscale benchmarks: ad fill 60–90%, mobile eCPM $5–7.50 — but **no fill-rate data exists for <1M-MAU identity apps (GAP)**.

**Payments chokepoints:** FTC letters to PayPal/Stripe/Visa/MC re "financial deplatforming" (2025); PayPal's 180-day fund-freeze policy is the standing creator risk. **No adjudicated race-specific processor termination found (GAP — anecdotal only).**

## 5. The alternative rail: equity crowdfunding — and the Fanbase case

**Reg CF market (Kingscrowd/DealMaker series):** 2021 peak ~$500M → 2023 $423M → 2024 **$343.6M** → 2025 **$378.3M** (CF + A+ combined $924.8M, +58%); Q1 2026 $87.8M (−28%). Reg CF cap raised $1.07M → $5M (2021); Reg A+ to $75M.

**The killer structural stat: 34% of new Reg CF deals had a minority founder; minority-founded companies raised 27% of Reg CF capital (2024) — versus ~0.3–1% of VC.** Equity crowdfunding is where Black consumer-social capital formation actually happens.

**Fanbase as the case study (SEC-primary):**

| Metric | Value | Source |
|---|---|---|
| Final Reg A+ close (Jan 21 2026) | **$16,963,858 of $17.595M max; $160.03M pre-money** | EDGAR via Kingscrowd |
| Milestone | 2024: first Black founder to $10M via StartEngine/RegCF | StartEngine |
| FY2024 revenue | **$106,651** | Form 1-K (audited) |
| FY2024 net loss | **−$3.09M** (cash $922K) | Form 1-K |
| Implied valuation multiple | **~1,500× revenue** at $160M pre vs $106.7K FY2024 | computed |
| Prior revenue series | $13.8K → $161.7K → $134.9K → $103.3K → $106.7K (FY20–24) | 1-K |

Other Black-owned crowdfunding wins for context: Black and Mobile ($1M, Wefunder), Health in Her HUE ($3M), CxffeeBlack (~$300K).

**Reg CF mechanics worth stating for builders:** $5M/12mo cap (Reg CF), $75M (Reg A+); investor-heavy caps create cap-table sprawl (Fanbase: tens of thousands of shareholders); shares are illiquid (no secondary market); the rail trades dilution-heavy, high-cost capital for community alignment and marketing side-effects — every campaign is also a user-acquisition event.

## 6. Cohort capitalization summary (ties to prediction 4)

| Platform | VC | Crowdfunding | Total |
|---|---|---|---|
| Fanbase | $0 | **≈$21M+ lifetime** (final campaign $16.96M + prior RegCF ~$4.5M; cumulative unpublished) | ≈$21M+ |
| Spill | ≈$4.75M pre-seed + RegD 2025 (undisclosed) | $410K Wefunder | **≈$6M** [ForbesBLK Mar 30 2026] |
| Blacksky | $0 | ~$72K/yr donations (Open Collective, 1,249 contributors) | ~$0 raised capital |
| WeKinFolk | self-funded | — | ~$0 |
| Byio | none found | — | ~$0 |

**Combined ≈ $27–35M since 2020 — an order of magnitude under the <$100M pre-registered ceiling, with crowdfunding ≈ 75%+ of the total.** The niche's capital formation is community-financed, not VC-financed. (Prediction 4: confirmed.)

## 7. Market-sizing read for the niche (derived, basis-labeled)

- **TAM (attention):** Black US adults' social-media hours — 32 hrs/wk apps/web (Nielsen Jan 2025) across ~34M Black adults (Census) ≈ 56B hrs/yr of addressed attention, monetized today almost entirely by non-Black-owned platforms.
- **SAM (direct-spend):** the identity-niche paywall segment — BlackPeopleMeet pricing × dating-scale willingness-to-pay, plus creator-economy direct payments (subs/tips) where the 35% pay gap is the arbitrage.
- **SOM (realistic 3-yr for a new entrant):** the cohort's demonstrated ceiling — 350K MAU (Blacksky's documented best) × $1–3/user/yr direct-monetization (Discord-class) ≈ **$0.4–1M ARR at survival scale**; Fanbase's audited numbers show what exceeding that without product-market discipline looks like ($106.7K revenue against $21M raised).
- These are **computed from the anchors above**, not third-party estimates — labeled [computed] wherever used downstream.

## 8. Key sources

Selig Center Multicultural Economy (UGA, through 2021 edition) · Nielsen Diverse Intelligence Series (Jan 29 2025) · McKinsey "Economic State of Black America" (2021, PDF) · Goldman Sachs creator-economy report (Apr 2023) · MSL × Influencer League pay-gap study (Dec 6 2021) + SevenSix (2024) · Crunchbase Black-founder funding series (2021–2026) · AAER v. Fearless Fund settlement (Sep 11 2024) · DOJ v. PayPal settlement (May 2026) · Kingscrowd/DealMaker Reg CF market reports (2023–Q1 2026) · SEC EDGAR Fanbase filings (CIK 1826213, Form 1-K FY2024) · Digiday (Nov 7 2023), CHEQ, IAS/Reuters blocklist studies · Sap et al. ACL 2019 + ACM 2025 · Snapchat Q4 2025 investor data · BlackPeopleMeet pricing page. Full URLs: `scratch/notes/agent-D-money-market.md`.


---

<!-- ====================================================================== -->
<!-- FILE: 04-demand-pain-points.md -->
<!-- ====================================================================== -->

# Demand Side & Pain Points — Where African-American Users Are, Why They Leave, What They Complain About

**Research date:** 2026-09-23 · **Deliverable 04 of 08** · **Companions:** `03-market-sizing-funding.md` (the money side), `02-platform-deep-profiles.md` (the platforms), `07-patterns-strategy-graveyard.md` (strategy)

**Method.** Survey data is quoted with sample size, fielding window, and mode; platform-acknowledged and peer-reviewed evidence is separated from press-only evidence; complaint themes were extracted from verbatim app-store review corpora (Spill live, Fanbase Wayback'd). Full source list and verbatim corpora: `scratch/notes/agent-C-demand-pain.md`.

---

## 1. Where Black Americans actually are (Pew, 2025)

**Ever-use by race, 2025** — Pew NPORS, N=5,022, fielded Feb 5–Jun 18 2025, "Americans' Social Media Use 2025" (published Nov 20 2025); Black n=512, MoE ±6.0pp; single-race non-Hispanic groups:

| Platform | Black | White | Hispanic | Asian | All US adults |
|---|---|---|---|---|---|
| YouTube | 85 | 82 | 88 | 92 | 84 |
| Facebook | 74 | 70 | 74 | 62 | 71 |
| Instagram | **54** | 45 | 62 | 58 | 50 |
| TikTok | **53** | 28 | 57 | 31 | 37 |
| WhatsApp | **37** | 23 | 56 | 54 | 32 |
| Snapchat | 29 | 24 | 31 | 19 | 25 |
| X | **26** | 18 | 23 | 32 | 21 |
| Reddit | **18** | 27 | 22 | 44 | 26 |
| Threads | **18** | 6 | 10 | 12 | 8 |
| Bluesky | **2** | 4 | 4 | 3 | 4 |
| Truth Social | 2 | 4 | 2 | 6 | 3 |

**Daily use by race, 2025** (Pew ATP Wave 164, Feb 24–Mar 2 2025; row assignment triple-verified):

| Platform | Black | White | Hispanic | Asian | All |
|---|---|---|---|---|---|
| Facebook | 44 | 54 | 55 | 48 | 52 |
| YouTube | **56** | 41 | 61 | 70 | 48 |
| TikTok | **31** | 19 | 38 | 17 | 24 |
| X | **13** | 9 | 12 | 10 | 10 |

**Trend 2023→2025 (Black ever-use; 2023 via Wayback'd Jan 2024 fact sheet; ATP→NPORS mode break makes deltas directional only):** TikTok 39→53, Facebook 64→74, Instagram 46→54, X 23→26 (**up, not down**), WhatsApp 31→37.

**The five headline reads:**

1. **Black over-index +16pp on TikTok** — the largest gap of any major platform.
2. **Threads at 3× the white rate (18% vs 6%)** — the standout new-platform finding; Meta's text feed absorbed disproportionate Black adoption.
3. **Bluesky under-indexes at 2%** — the Black diaspora did **not** land on Bluesky as a population; Blacksky is a concentrated community inside an otherwise very white platform.
4. **Black users are the most daily-committed cohort on TikTok (31%) and X (13%)** — the highest advertiser-value hours sit on the platforms most exposed to documented moderation failure (§3).
5. **No aggregate Black exit from X** — the "everyone left" narrative is folklore; what left was organized cultural infrastructure, not the median user.

## 2. Black Twitter — the documented phenomenon and its sizing attempts

- Academic canon (cited, full bibliographic verification pending — GAP flagged): **Meredith Clark** (*We Tried to Tell Y'all*, ~2024), **Sarah Florini**, **André Brock Jr.** (Critical Technocultural Discourse Analysis).
- Sizing: the "~5M / Networked Insights" primary was **not found (GAP)**. Defensible anchors: Pew 26% ever-use ≈ 9M US Black adults on X (computed from Census base); secondary syntheses implying 12–17M US Black users; a 5.6M-user academic hashtag dataset (all secondary).
- Cultural-economics anchors: Verzuz 1M+ concurrent viewers (Jeezy–Gucci peak 9.1M); #OscarsSoWhite (Reckon, Dec 2024).

## 3. The diaspora timeline (2022–2026, verified events)

| Date | Event |
|---|---|
| Oct 2022 | Musk acquisition; Black-Twitter-adjacent staff laid off (incl. Terrell, global head of social/editorial) |
| Dec 2022–Jan 2023 | Spill revealed; **60,000 handle reservations**; $2.75M pre-seed (TechCrunch, Jan 30 2023) with an AI moderation model "with Black dialects in its DNA" |
| May 23 2023 | Blacksky launches on Bluesky (Fraser = user #51,921; first version drew 1,000 users — WIRED, Jan 2025) |
| Jun 15 2023 | Spill invite-only iOS beta. *(The "~100K waitlist" claim is unverifiable — GAP; the verifiable sibling is 60K reservations)* |
| Feb 2024 | Bluesky opens publicly; 2.89M → ~26M during 2024 |
| Nov 2024 | Post-election X exodus: Bluesky **+2M** (TechCrunch, Nov 15 2024); Graber "about a million users a day for several days" (NPR, Nov 19); **Nov 15 2024: Blacksky's 1M-feed-views-in-a-day stress test during Tyson–Paul** |
| Jan 2025 | Blacksky at **872,500+ subscribers, 6 donation-funded moderators, ~500 reports/day** (WIRED); Bluesky 2024 moderation report: 17× report increase, ~100 moderators |
| Feb 2025 | Bluesky 30M users; Threads 275M MAU (TechCrunch, Sep 23 2025) |
| 2024–Jul 2025 | Fanbase crowdfunding $10M record → $12.7M of $17M (Hayes X post, Jul 20 2025 — series doesn't reconcile cleanly; conflict retained) |
| Aug–Sep 2026 | **Fanbase pulled from Google Play and App Store** (Play alive Aug 8 2026 per Wayback; gone by Sep 23); placeholder site for "Version 1.5"; **Spark** (X/Threads-like microblogging) is the companion product. Spill still live (4.0★, 50K+ Play downloads) |

**Settlement read (layered, not monolithic):** cultural energy → TikTok/Threads; organized community infrastructure → Blacksky (inside a 2%-Black Bluesky); Black-owned standalone apps stayed ≤100K-download scale and fragile (Fanbase's store disappearance being the extreme case).

## 4. Documented pain points — ranked by evidence strength

**Tier 1 — platform-acknowledged or peer-reviewed:**

| Pain point | Evidence | Source + date |
|---|---|---|
| AAVE/classifier bias | AAVE tweets up to **2× more likely labeled offensive**; benign AAE misclassified up to 46%; annotator bias as root cause | **Sap et al., ACL 2019 (peer-reviewed)** |
| Image-cropping racial bias | Saliency algorithm disparity acknowledged by the platform itself | **Twitter engineering blog, May 2021** |
| Race-blind hate-speech ranking | "Race-blind" enforcement documented as harming Black users; Black monthly users fell 2.7% in a month (17.3M adults); audit verdict: "too reactive and piecemeal," "significant setbacks for civil rights" | **USA Today Dec 3 2020 + WaPo Nov 21 2021 + 2020 Facebook Civil Rights Audit** |
| Algorithmic reach suppression | Shadowbanning acknowledged: "filtering people without transparency, and limiting their reach as a result" | **Mosseri (Instagram), Jun 22 2020** |
| X hate-speech regression | ~50% higher weekly hate rates post-acquisition; likes on hate doubled; no bot reduction; Community Notes cut engagement 44–46% but target misinfo, not harassment | **PLOS ONE, Feb 2025 (peer-reviewed)** |

**Tier 2 — strong press evidence:** TikTok Black-creator strike (Jul 2021, BBC/NBC); brand-safety keyword blocklists stripping **15–37% of traffic** from Black-owned publishers (Digiday Nov 7 2023; CHEQ 18%; AdExchanger 54% for news).

**Tier 3 — real but unpinned this run (GAPs):** TikTok Creator Fund lawsuits/settlements; the "n-word in bio" moderation disparity; X's Jan 2025 policy loosening; #BrandDisrespect.

## 5. Complaint themes on the niche platforms themselves (verbatim store-review corpora)

| Platform | Corpus | Negative themes | Positive themes |
|---|---|---|---|
| Spill | Google Play, live 2026-09-23, 4.0★, 50K+ downloads | Crashes/instability; **empty/slow feeds, weak discovery (cold-start)**; onboarding/invite friction; feature gaps vs X | Community warmth; "a cultural home" |
| Fanbase | Wayback'd Play, Aug 8 2026, 4.7★, 3.28K reviews, 100K+ downloads (now removed) | Bugs/crashes; **subscription/"Love" tipping confusion** (1¢ per Love, 50/50 split); spam/scam accounts; slow support; 2026's ultimate churn event — total store disappearance | Creator monetization when it works |
| Blacksky | press + community discourse (WIRED Jan 2025; X/Bluesky) | **Scale-vs-governance stress** (6 donation-funded mods at ~500 reports/day); intra-community legitimacy pushback ("I'm supposed to believe that you'll actually gatekeep blacksky?"); infrastructure fragility at cultural-event spikes; inherited Bluesky platform risk | Community ownership; moderation posture |

**Structural pattern: no corpus complains that the culture or community failed.** Churn drivers are product quality, network size, monetization opacity, under-resourced moderation, and existential interruption (store pulls, funding gaps). The demand is durable; the supply side keeps breaking.

## 6. The moderation-economics constraint (the niche's binding limit)

Blacksky's documented ratios make this concrete: **872.5K subscribers : 6 donation-funded moderators : ~500 reports/day** (Jan 2025) ≈ **80+ reports per moderator per day**, sustained by donations, while Bluesky proper ran ~100 moderators against a 17× report increase. Every cohort platform inherits an above-baseline harassment load (Tier-1 evidence above) with below-baseline moderation budgets. This — not features — is the niche's structural cost curve (analysis and builder mitigations in 06 §7).

## 7. Cultural-economic anchors (cross-ref 03 §2)

35% white–Black creator pay gap; 77% of Black creators in lowest-pay tiers (MSL × Influencer League, Dec 2021); 10.5× media-value multiple (Nielsen × Realeyes); Fanbase's $16.96M community raise and Blacksky's 1,249 recurring donors as demand-side proof-of-capital; Verzuz-scale concurrent cultural events as proof-of-attention.

## 8. Open GAPs (flagged, not filled)

Black Twitter "~5M" primary source; Spill's ~100K waitlist; TikTok Creator Fund settlement documents; the "n-word in bio" study; X Jan 2025 policy change documentation; Community Notes 44–46% original paper; Zefr race-specific findings; Florini/Brock/Clark full citations; Pew 2023→2025 mode break (deltas directional only).

## 9. Key sources

Pew Research Center NPORS "Americans' Social Media Use 2025" (N=5,022, Nov 20 2025) + ATP Wave 164 (Feb–Mar 2025) + Wayback'd Jan 2024 fact sheet · Sap et al. ACL 2019 · Twitter engineering blog May 2021 · USA Today Dec 3 2020 · WaPo Nov 21 2021 · Facebook Civil Rights Audit 2020 · Mosseri Jun 22 2020 · PLOS ONE Feb 2025 · BBC/NBC Jul 2021 · Digiday Nov 7 2023 · TechCrunch Jan 30 2023 / Nov 15 2024 / Sep 23 2025 · WIRED Jan 2025 · NPR Nov 19 2024 · NBC Nov 2024 · Guardian Nov 11 2024 · Wayback Machine (Fanbase Play Aug 8 2026) · app-store review corpora (live fetches 2026-09-23). Full URLs: `scratch/notes/agent-C-demand-pain.md`.


---

<!-- ====================================================================== -->
<!-- FILE: 05-competitive-analysis-matrix.md -->
<!-- ====================================================================== -->

# Competitive Analysis — Black/African-American Social Networks (US, September 2026)

**Deliverable 05 of 08** · **Research date:** 2026-09-23 · Built to the `rdw-app-competitve-analysis` contract.

**Target of analysis:** the live competitive set of social networks that specifically cater to African Americans and/or have substantial African-American membership — the named cohort from the request (**Spill, Fanbase (incl. its Spark microblogging feature), BlackPlanet, Blacksky**) plus every discovered live true-social competitor. BlackPlanet is carried as a **sunset/legacy reference** (its social network shut May 15 2026; the asset now runs as a news platform) rather than a live competitor — the classification defense is in §4.

**Market framing (1 paragraph).** This is an identity-niche segment of consumer social: culture-first community platforms whose differentiation is (a) ownership and governance by the community they serve, (b) monetization designed to route money to Black creators rather than extract attention for ad inventory, and (c) moderation built for a documented above-baseline harassment load and documented classifier bias against African-American English. Demand-side, Black Americans over-index on every major platform (TikTok +16pp, Threads 3×, X highest daily-commitment cohort — Pew 2025) while the supply side — the platforms serving them as a primary audience — has a combined ≈$27–35M capitalization, no member above ~750K downloads / 350K documented MAU, and a 2024–26 casualty list that includes the segment's oldest asset (BlackPlanet's social product) and its best-funded one mid-rebuild (Fanbase off-store for "Version 1.5").

---

## 1. Header

- **Report:** Black/African-American social-network competitive analysis
- **Date of research:** 2026-09-23 (all liveness checks, store lookups, and page fetches executed this date)
- **Scope:** US market, live platforms; the named cohort (Spill, Fanbase/Spark, BlackPlanet, Blacksky) plus discovered true-social platforms; adjacents (dating, marketplace/directory, media-with-community, professional, IRL) classified indirect
- **Companion deliverables:** `02-platform-deep-profiles.md` (ground-truth company profiles), `06-tech-architecture-devsecops.md` (stacks — the dev deep-dive behind the dev/DevSecOps matrix categories here), `03-market-sizing-funding.md`, `04-demand-pain-points.md`

## 2. Methodology

- **Sources:** live App Store / iTunes Search+Lookup API lookups (US storefront, 2026-09-23), Google Play web listings, company domains and raw-HTML stack forensics, GitHub API org listings, SEC EDGAR (Fanbase CIK 1826213), Kingscrowd/Wefunder/StartEngine campaign records, Open Collective, Wayback Machine (BlackPlanet arc; Fanbase Play listing Aug 8 2026), dated press (TechCrunch, ForbesBLK, WIRED, Tech Policy Press, NBC, AfroTech, BlackNews.com…), Pew NPORS/ATP survey data. Full per-claim URL lists live in the agent digests (`scratch/notes/agent-{A,B,C,D,E}*.md`); sources are cited inline by publisher + date here.
- **Recency sweep:** category-level dated queries were run by the sweep agent (Agent B) across 2024–2026 ("Black social media app launched 2026," "Black Twitter alternative 2025/2026," "new Black-owned social platforms 2026," per-platform `<name> 2026` checks) — this is what surfaced Byio (Sep 2025), BlackShares (Mar 2025), Upfront (Jul 2025), blackEX (Jul 2025, dead by Sep 2026), Troodie (Aug 2024), Ruut/Afrosmeet/DiasporaHub (2026), and the WeBuyBlack→Naspora rebrand. Platforms appearing in 2+ sweeps or with independent coverage were added as direct candidates; single-source items (e.g., BEAN, GoodFeed's founder) are carried as watchlist/❓ only.
- **Roster cross-check:** the v2 industry run's top-20 social matrix and this run's sweep each independently enumerate the substitute set (X, Threads, TikTok, Instagram, Bluesky, Discord…); no third direct Black-community social app beyond those profiled appears in 2025–26 roundups. Items named in roundups but excluded: **The Shade Room / TheGrio / The Root** (no member-to-member social graph — media with comment sections; classified indirect), **BLK / BlackPeopleMeet** (dating, not social networking; indirect), **eatOkra / OBWS / Naspora** (marketplace/directory; indirect), **The Gathering Spot** (IRL club with member app; indirect), **TruSo / blackEX / MELD / SoulSwipe** (dead or unconfirmable — excluded from the live matrix, documented in 02 §2).
- **Limitations:** Fanbase is mid-rebuild and absent from both stores — its cells reflect the last verifiable listing era (through Aug 8 2026) plus first-party 1.5 teaser claims, all marked. Byio's 1.5M-registration figure is company PR only. Google Play pages were bot-walled for some checks (noted per-cell ❓ where it matters). No MAU is published by any direct competitor; all scale cells are basis-flagged (downloads ≠ registrations ≠ feed subscribers ≠ MAU). Stack claims come from observable evidence only (HTML markers, DNS, store metadata, public code) — see 06 for the evidence trail.
- **$0 paid research spend;** all data from keyed search engines, direct fetches, and public APIs. Fallback items (built-in search) are marked "(fallback)" in the digests.

## 3. Market overview

- **Demand:** ~34M US Black adults, the most daily-committed cohort on TikTok (31%) and X (13%); 32 hrs/wk apps/web (Nielsen Jan 2025); $835B actual annual spend (McKinsey) against a documented 35% creator pay gap — the arbitrage the whole segment is built on (04 §1, §7).
- **Supply:** 8 live direct competitors (below), none above 350K documented MAU / 750K cumulative downloads; combined capitalization ≈$27–35M, ~75%+ community-financed (03 §6). The segment's binding constraint is not acquisition but **moderation economics** (6 donation-funded moderators absorbing ~500 reports/day at the segment's documented best — Blacksky, Jan 2025, WIRED) and **capital fragility** (Fanbase: $21M+ raised, $106.7K FY2024 revenue, apps off-store).
- **Structure:** one open-protocol infrastructure play (Blacksky — the only public, reproducible architecture, now productized as Acorn and being standardized into AT Protocol via Fraser's Mozilla fellowship), two VC/crowdfunded standalone apps (Spill, Fanbase), and a long tail of micro-platforms (WeKinFolk, Circl, BlackShares, MelaninPeople, Movespot) at ≤50K-member scale. The substitute set — the majors — is where the attention actually sits; every direct competitor is fighting for the *organized cultural layer*, not the median user's minutes (04 §3 settlement read).

## 4. Competitor roster

| # | Platform | Vendor / owner | Type | URL | One-line positioning (2026) |
|---|---|---|---|---|---|
| 1 | **Spill** | Real Spill Corporation (Terrell/Brown, ex-Twitter) | **Direct** | spill.com | "The Black Twitter successor" — culture-first social app with Tea Party live rooms; 750K downloads; ads + crypto rewards + community equity |
| 2 | **Fanbase (+ Spark)** | Fanbase Social Media, Inc. (Isaac Hayes III, Atlanta) | **Direct** (off-store mid-rebuild) | fanbase.app | Subscription-first "ownership" social app; Love tipping 50/50; Spark = X/Threads-style microblog inside the platform; V1.5 teaser live |
| 3 | **Blacksky** | Blacksky Algorithms (Rudy Fraser) | **Direct** | blackskyweb.xyz | The Black community on the AT Protocol — portable identity, community-defined moderation labels, donation-funded; 350K feed MAU; iOS app Sep 17 2026 |
| 4 | **WeKinFolk** | Ernest L. Manning Jr. (self-funded, 2020) | **Direct** | wekinfolk.com | "For us, by us" full-suite social network (timeline/groups/monetization/marketplace); 50K+ members claimed |
| 5 | **Byio** | R.M. Easterly (Detroit; Black-woman-owned) | **Direct** | byio.app | Invite-only "AI super app" for Black professionals/community; launched Sep 9 2025; claims 1.5M registrations (company PR) |
| 6 | **Circl** | Martial Liboutet | **Direct** | circl.app | Afro-diaspora creator-monetization social app with cross-border payouts (US/France/Nigeria/Kenya/SA/Cameroon) |
| 7 | **BlackShares** | Vince Martin / Upsides Network LLC (Atlanta) | **Direct** | blackshares.app | "Drop-in replacement for BlueSky and LinkedIn" — social + professional hybrid with rev-share dividends and a Black-founder fund (announced Mar 21 2025) |
| 8 | **MelaninPeople** | Adeyinka Adegoke | **Direct** (stagnant-leaning-live) | melaninpeople.com | Global Black/brown socio-business network + marketplace; iOS last updated Jul 2024 |
| 9 | BLK + BlackPeopleMeet | Match Group / Affinity Apps | Indirect | blkapp.com / blackpeoplemeet.com | Identity dating at scale (BLK 5M+ downloads, 554K iOS ratings; BPM two decades of paid proof at $16.75–20.64/mo) — substitutes for the *meeting* job-to-be-done, no general social graph |
| 10 | eatOkra / Official Black Wall Street / Naspora (ex-WeBuyBlack) | independents | Indirect | eatrokra.com / officialblackwallstreet.com | Black-economy marketplaces/directories — substitute for the *economic-empowerment* job-to-be-done; no social feed |
| 11 | The Shade Room / TheGrio / The Root | TSR / Allen Media / Watering Hole Media (acq. Oct 2 2025) | Indirect | theshaderoom.com / thegrio.com / theroot.com | Media-with-community at real scale (TSR 28–29M followers) — substitutes for the *culture-feed* job-to-be-done; comment sections, not member graphs |
| 12 | The Gathering Spot | Wilson/Petersen (member clubs Atlanta + DC) | Indirect | thegatheringspot.com | IRL professional club with member app — substitutes for the *belonging/networking* job-to-be-done offline-first |
| 13 | X / Threads / TikTok / Instagram / Bluesky(-bare) | majors | Indirect (substitutes) | — | Where the cohort actually spends hours (Pew 2025) — the incumbent default every direct competitor is differentiated against |

**Classification defenses (2026 product-page basis).** *BlackPlanet — removed from the live set:* its social network was sunset May 15 2026; the live blackplanet.com is a Ghost-CMS news aggregator ("The news platform built for Black America," 180K+ daily readers claimed) with no member-to-member social features on the 2026-09-23 page — retained as the legacy/precedent case throughout the report (02 §1.4). *Dating/marketplace/media/IRL — indirect:* 2026 pages show no public member feed + follow graph + posting surface as the primary product (BLK's 2026 page is matching-first; eatOkra is a directory; TSR is publisher-first; Gathering Spot is membership-club-first). *Bluesky itself — indirect, with a twist:* the bare platform under-indexes Black users at 2% (Pew 2025), but via Blacksky it is also the substrate of direct competitor #3 — the segment's structural irony, not a classification error. *Fanbase retained as direct despite off-store status:* the company is live, first-party ships a V1.5 teaser (2026-09-23 fetch), and its 2025-era product (Play listing alive Aug 8 2026, Wayback) was a full social network — the strongest 2026-page evidence available for a mid-rebuild competitor.

## 5. Per-competitor profiles (direct set)

### 5.1 Spill — the polished consumer product

**Overview.** Founded 2022–23 by two laid-off Twitter execs (Terrell: global head of social & editorial; Brown: PM), Sherman Oaks CA, ~6 employees (Wefunder filing). iOS first release Jun 11 2023; **v2.3.6 shipped 2026-09-19** (4.55★, 1,635 ratings) — the most actively shipped consumer app in the segment. ~$6M total raised (ForbesBLK, Mar 30 2026). 750K cumulative downloads (same source); FY2024 revenue $235.6K (Wefunder filing via Kingscrowd).

**UVP.** The only ex-Twitter-founder-team attempt at the Black Twitter succession, executed as a consumer-polished app: trending ("What's Tea"), live Tea Party rooms (first one hosted by Kerry Washington), and daily games (What's The Word, Spades) — culture as product surface, monetized with ads/partnerships "since day one" plus blockchain-based viral-content rewards (ForbesBLK Mar 30 2026; TechCrunch Jan 30 2023).

**Features by category (each block cited):**
- *Content & community:* What's Tea trending; Groups; Tea Parties (live audio/video/chat watch-together with near-realtime comments, live DJ sets); daily games — App Store listing, fetched 2026-09-23 (iTunes API + page).
- *Monetization:* ads/paid partnerships from launch; creator crypto rewards for viral content; community equity via Wefunder SAFE ($410,239 raised, $20M cap) — ForbesBLK Mar 30 2026; Wefunder/Kingscrowd records.
- *Safety positioning:* launch moderation pitch = AI model "with Black dialects in its DNA," explicitly citing AAVE-misflagging research — TechCrunch, Jan 30 2023.
- *Stack (dev lens):* Nuxt marketing site on Vercel/Cloudflare; Sanity CMS; Braze engagement; live-audio vendor undisclosed (GAP — see 06 §2).

### 5.2 Fanbase (+ Spark) — the crowdfunded ownership bet, mid-rebuild

**Overview.** Atlanta, 2018, Isaac Hayes III. The segment's capital case study: $16,963,858 final Reg A+ close Jan 21 2026 at $160.03M pre-money; ≈$21M+ lifetime crowdfunded; audited FY2024 revenue **$106,651** against a −$3.09M net loss (SEC Form 1-K) — ~1,500× revenue multiple at the close [computed]. Apps removed from both stores for the "Version 1.5" rebuild (teaser live 2026-09-23; Play listing last alive Aug 8 2026 per Wayback). **Spark** (announced Dec 13 2024) is Fanbase's X/Threads-style microblogging feature for citizen journalism — the likely primary referent of the user's "Spark," profiled here rather than as a standalone app (full disambiguation: 02 §1.3).

**UVP.** "Ownership": subscription-first social where creators keep their audience on paid rails (subscription packs, Love tips at 1¢ with a 50/50 split, paid monthly per SEC filing) and the community itself owns equity — tens of thousands of shareholders from the crowdfunding campaigns (SEC EDGAR; StartEngine materials).

**Features by category:**
- *Monetization:* creator subscriptions (1/3/5 packs); Love tipping; audio/video rooms; historical IAP range $2.99–$99.99; "first in-app-purchase subscription social media app" positioning (KBLA Dec 17 2025, fallback) — SEC filings + prior listing.
- *Content (Spark):* microblogging feed for cultural conversation/citizen journalism (announced Dec 13 2024); rollout unconfirmable mid-rebuild (GAP).
- *Scale claims:* 570K users Feb 2024 (StartEngine) vs "1.4M" Jun 14 2026 (founder IG, self-reported registered) — bases conflict, retained side by side; 60,791 users have ever earned revenue (Form 1-K).
- *Stack (dev lens):* Route53 + Fastly edge; IAP payment rails; everything else undisclosed pending 1.5 (06 §3).

### 5.3 Blacksky — the open-protocol infrastructure play

**Overview.** Rudy Fraser, Queens NY; started 2021 as a Bluesky custom feed, launched May 23 2023; **$0 VC**, ~$72K/yr Open Collective donations (1,249 contributors, $6,021/mo of $7,500 goal); core team ~5. **350,000 feed MAU (Mar 2025, triple-sourced: Tech Policy Press; Open Rights Group; Blacksky's own blog)** — the segment's only documented MAU; 872.5K feed subscribers and 6 donation-funded moderators at ~500 reports/day (WIRED, Jan 2025); "3M+ community members" self-reported Aug 2026 (cumulative basis). Standalone iOS app released Sep 17 2026. Fraser is a 2026 Mozilla Fellow, standardizing permissioned posts into AT Protocol.

**UVP.** The only platform in the segment whose answer to "what if they deplatform us / the algorithm misjudges us / the moderators burn out" is **architecture**: portable DID identity, community-only posts off the public relay, community-voted label taxonomy (digital blackface, misogynoir, anti-Black harassment — first mover), wellbeing-instrumented moderation tooling, and a fully public codebase (github.com/blacksky-algorithms) — now productized as **Acorn**, a turnkey community platform for others (acorn.blacksky.community, fetched 2026-09-23).

**Features by category:**
- *Protocol/architecture:* own PDS + full-network Rust relay (atproto.africa) + complete AppView with private-content support; permissioned community posts via custom lexicon `community.blacksky.feed.*`; CAR-file export + migration tool + satnav explorer — docs.blacksky.community + repo READMEs (2026-09-23).
- *Moderation:* subscribable labeler default-on and non-disableable in-app; Ozone-fork console with moderator session check-ins/workload self-selection/co-review tagging; SAFEskies feed console (MIT); Polis People's Assembly governance; appeal flows + peer-moderator code of conduct — blackskyweb.xyz safety posts (2026); repo READMEs.
- *Monetization:* donations; Stripe in-app (client deps); blacksky.cash P2P/susu group payments (coming; processor undisclosed — GAP); Acorn platform services.
- *Client:* React Native/TS fork of the official Bluesky client (v1.130.x), Expo, GrowthBook, Lingui — package.json (fetched).
- *Sovereignty:* "Blacksky data is only for Blacksky"; no gen-AI training on community data; DMs reviewed only on report/investigation/legal process; no transparency report or warrant canary (GAP vs major norms) — privacy policy (fetched 2026-09-23).

### 5.4 WeKinFolk — the self-funded full suite

Founded 2020 by Ernest L. Manning Jr., self-funded. Web-first full social suite (timeline, groups, monetization, marketplace); **50K+ members claimed** (BlackNews.com, Nov 2025 — sole substantive coverage; single-source). iOS app stale since 2020; liveness = web. The segment's baseline "for us by us" full-stack attempt with no external capital.

### 5.5 Byio — the invite-only 2025 entrant with the unverifiable number

Black-woman-owned (R.M. Easterly, Detroit), launched **Sep 9 2025**, community rollout Jan 2026. Positioned as an invite-only ("By Invite Only") AI super app for the Black community. **Claims 1.5M verified registrations by Aug 2026 — company PR only, single-source, no public URL** (the single largest unverified number in the segment; flagged ❓ everywhere it appears). If even 10% were active it would be the segment leader; nothing independent corroborates it.

### 5.6 Circl — the diaspora monetizer

Afro-diaspora creator social app (Martial Liboutet); differentiated by **cross-border payouts** (US, France, Nigeria, Kenya, South Africa, Cameroon) — the only direct competitor whose 2026 positioning is explicitly transnational rather than US-African-American; iOS updated Sep 12 2026 (iTunes API).

### 5.7 BlackShares — the equity-social hybrid

Vince Martin / Upsides Network LLC (Atlanta), announced Mar 21 2025. "Drop-in replacement for BlueSky and LinkedIn": social + professional graph, **rev-share dividends to members** and a Black-founder fund — the most aggressive ownership-economics proposition after Fanbase. Scale: small/early; traction unverified.

### 5.8 MelaninPeople — the stagnant globalist

Global Black/brown socio-business network + marketplace (Adegoke). iOS last updated **Jul 2024** (36 ratings) — carried as live-but-stagnant; a watchlist item for the graveyard if the pattern (02 §4) holds.

## 6. Composite feature matrix

Apps-as-rows, grouped by category block (columns). Cell symbols are defined in the Legend below every table set. Scale cells carry basis flags: [d]=downloads, [r]=registered (self-reported), [s]=feed subscribers, [MAU]=documented monthly actives.

### 6.1 Content & community

| Platform | Public feed/posts | Photo/video posts | Groups/communities | Trending/discovery | Culture-specific surfaces |
|---|---|---|---|---|---|
| Spill | ✅ | ✅ | ✅ Groups | ✅ What's Tea | ✅ Tea Parties, Spades/word games |
| Fanbase (2025-era + 1.5 teaser) | ✅ (Spark adds microblog) | ✅ | ✅ | 🟡 (Spark-era unconfirmable mid-rebuild) | 🟡 audio/video rooms; "citizen journalism" positioning |
| Blacksky | ✅ | ✅ | ✅ community-only posts | ✅ Blacksky Trending (default feed) | ✅ susus/mutual-aid surfaces; Black cultural label taxonomy |
| WeKinFolk | ✅ | ✅ | ✅ | ❓ | ✅ marketplace + monetization suite |
| Byio | ✅ | ❓ | ❓ invite-gated | ❓ | 🟡 "AI super app" positioning |
| Circl | ✅ | ✅ | 🟡 | ❓ | ✅ diaspora-first |
| BlackShares | ✅ | ❓ | 🟡 professional circles | ❓ | 🟡 equity framing |
| MelaninPeople | ✅ | ✅ | 🟡 | ❓ | ✅ socio-business + marketplace |

### 6.2 Live & rich media

| Platform | Live audio rooms | Live video | In-app games/entertainment | DMs/chat |
|---|---|---|---|---|
| Spill | ✅ Tea Parties | ✅ | ✅ daily games | ✅ |
| Fanbase | ✅ | ✅ | ❌ | ✅ |
| Blacksky | ❌ | 🟡 rsky-video upload + transcoding (Bunny CDN); no native live rooms | ❌ | ✅ |
| WeKinFolk | ❓ | ❓ | ❌ | ❓ |
| Byio | ❓ | ❓ | ❓ | ❓ |
| Circl | ❓ | ❓ | ❌ | ❓ |
| BlackShares | ❓ | ❓ | ❌ | ❓ |
| MelaninPeople | ❌ | ❓ | ❌ | ✅ |

### 6.3 Creator monetization

| Platform | Consumer subscriptions | Tipping/gifting | Ads/rev-share | Community equity/ownership |
|---|---|---|---|---|
| Spill | ❌ (not the model) | 🟡 crypto rewards for viral content | ✅ ads/partnerships "since day one" | ✅ Wefunder SAFE |
| Fanbase | ✅ core product (packs; IAP $2.99–$99.99 era) | ✅ Love 1¢, 50/50 | ❌ ad-free positioning | ✅ tens of thousands of shareholders |
| Blacksky | 🟡 Stripe in client; donations | 🟡 blacksky.cash P2P/susus (coming) | ❌ | ✅ Open Collective 1,249 donors; Acorn |
| WeKinFolk | 🟡 "monetization" suite (detail ❓) | ❓ | ❓ | 🟡 self-funded by a Black founder |
| Byio | ❓ | ❓ | ❓ | ❓ |
| Circl | ✅ creator monetization core | ❓ | ❌ | ❌ |
| BlackShares | 🟡 | ❓ | ✅ rev-share dividends (announced) | ✅ dividends + founder fund (announced) |
| MelaninPeople | 🟡 marketplace selling | ❓ | ❓ | ❌ |

### 6.4 Trust & safety (the differentiating block)

| Platform | Store-minimum T&S (report+block) | Culture-specific label taxonomy | AAVE-aware moderation stance | Moderator tooling/wellbeing | Community governance of policy |
|---|---|---|---|---|---|
| Spill | ✅ | ❓ | ✅ "Black dialects in its DNA" launch pitch (TechCrunch 2023) | ❓ | ❌ |
| Fanbase | ✅ (2025-era) | ❌ | ❓ | ❓ | 🟡 shareholder community |
| Blacksky | ✅ + subscribable default-on labeler | ✅ digital blackface, misogynoir, anti-Black harassment, ableism, fatphobia — first mover | ✅ (built against the Sap 2019/Lee 2024 evidence; community-voted taxonomy) | ✅ Ozone fork with session check-ins, workload self-selection, co-review; SAFEskies audit logs | ✅ Polis People's Assembly |
| WeKinFolk | ❓ | ❌ | ❓ | ❓ | ❌ |
| Byio | ❓ | ❓ | ❓ (AI-heavy positioning) | ❓ | ❓ |
| Circl | ❓ | ❌ | ❓ | ❓ | ❌ |
| BlackShares | ❓ | ❌ | ❓ | ❓ | 🟡 |
| MelaninPeople | ✅ store-era minimums | ❌ | ❓ | ❓ | ❌ |

### 6.5 Privacy & data sovereignty

| Platform | Data export/portability | Account/identity migration | No-third-party-data pledge | LE/transparency posture |
|---|---|---|---|---|
| Spill | ❌ none documented | ❌ | ❓ | ❓ no transparency report |
| Fanbase | ❌ none documented | ❌ | ❓ | ❓ |
| Blacksky | ✅ CAR-file export + satnav explorer + migration tool | ✅ PDS-to-PDS, protocol-native | ✅ "only for Blacksky," no gen-AI training | 🟡 court-order compliance + notification attempt; **no transparency report, no warrant canary** |
| WeKinFolk–MelaninPeople | ❌–❓ | ❌ | ❓ | ❓ none publish anything |

### 6.6 Availability & distribution (2026-09-23)

| Platform | iOS | Android | Web | Open protocol/federation |
|---|---|---|---|---|
| Spill | ✅ v2.3.6 (2026-09-19) | ✅ | ✅ | ❌ |
| Fanbase | ❌ off-store (V1.5) | ❌ off-store (V1.5) | 🟡 teaser | ❌ |
| Blacksky | ✅ v1.130.1 (2026-09-17) | ✅ (public beta Jul 29 2026) | ✅ | ✅ AT Protocol; own relay + AppView |
| WeKinFolk | ❌ stale 2020 | ❓ | ✅ | ❌ |
| Byio | ❓ (app presence unverified this run) | ❓ | 🟡 invite flow | ❌ |
| Circl | ✅ (upd. Sep 12 2026) | ❓ | 🟡 | ❌ |
| BlackShares | ❓ | ❓ | ✅ | 🟡 "replacement for BlueSky" framing; no federation evidence |
| MelaninPeople | 🟡 stale Jul 2024 | ❓ | ✅ | ❌ |

### 6.7 Scale & traction (basis-flagged — never compare across bases)

| Platform | Best scale figure [basis] | Store rating | MAU |
|---|---|---|---|
| Spill | 750K [d, cumulative] + Play band 50K+ | 4.55★ iOS (1,635) | ❓ |
| Fanbase | 1.4M [r, self-reported 2026-06] vs 570K [2024-02 materials] | 4.7★ (last-live Play era) | ❓ |
| Blacksky | 350K [MAU, feeds, triple-sourced Mar 2025]; 872.5K [s]; 3M+ [r, claimed cumulative] | 0 ratings yet (Sep 17 2026 release) | ✅ the segment's only documented figure |
| WeKinFolk | 50K+ members [claimed, single-source] | — | ❓ |
| Byio | 1.5M [r, company PR only, ❓] | ❓ | ❓ |
| Circl–MelaninPeople | small (Circl: 4 ratings era; MelaninPeople 36 ratings) | — | ❓ |

### 6.8 Ownership, funding & business model

| Platform | VC | Community capital | Open source | Business model |
|---|---|---|---|---|
| Spill | ≈$4.75M + RegD | $410K Wefunder | ❌ | Ads + partnerships + crypto rewards |
| Fanbase | $0 | ≈$21M+ lifetime (RegCF+RegA+) | ❌ | Subscriptions + tips (IAP rails) |
| Blacksky | $0 | ~$72K/yr donations | ✅ entire backend (13 public repos) | Donations + Acorn services + (coming) payments |
| WeKinFolk | $0 | self-funded | ❌ | 🟡 monetization suite (detail ❓) |
| Byio–MelaninPeople | ❓/$0 found | ❓ | ❌ | ❓ / marketplace |

### 6.9 Architecture & DevSecOps posture (dev lens — evidence trail in 06)

| Platform | Inspectable backend | Own infra (relay/AppView) | Documented protocol/API extension | Client stack | Privacy-label disclosure | Auth/audit logging |
|---|---|---|---|---|---|---|
| Spill | ❌ | ❌ | ❌ | iOS/Android; web = Nuxt on Vercel; Braze/Sanity perimeter | 🟡 iOS labels: **Linked = Location, Contact Info, Contacts, User Content, Sensitive Info** | ❓ |
| Fanbase | ❌ | ❌ | ❌ | iOS/Android (off-store); Fastly/Route53 edge; IAP rails | ❓ (listing gone) | ❓ |
| Blacksky | ✅ 13 public repos | ✅ full-network Rust relay + complete AppView | ✅ `community.blacksky.feed.*` lexicon (first permissioned posts on AT Protocol) | RN/TS fork of Bluesky client; Expo; GrowthBook | ✅ iOS labels published | ✅ DID/OAuth + SAFEskies audit logs + Ozone fork |
| WeKinFolk–MelaninPeople | ❌ | ❌ | ❌ | web-first / stale iOS | ❓ | ❓ |

### Legend

- `✅` — confirmed present from current public evidence (live store listing, first-party page, public code, or dated primary document; fetched 2026-09-23).
- `❌` — absent or explicitly not offered per current evidence.
- `🟡` — partial / limited / announced-but-unshipped / behind conditions; condition stated in the cell or its section.
- `➖` — not applicable (used where a category cannot apply to a platform's form factor; appears in category-level tables).
- `❓` — could not be confirmed from public sources this run; treated as unknown, not absent (see GAPs in §2 and 06 §9).

## 7. Strategic observations (each tied to matrix rows)

1. **Blacksky wins every differentiating block and loses the consumer-polish blocks — that is the segment's core trade.** It is the only ✅ across 6.4 (T&S), 6.5 (sovereignty), and 6.9 (inspectable architecture) while lacking the live-audio/games surfaces (6.2) where Spill differentiates. No platform currently holds both halves: consumer media richness + protocol-grade ownership (gap = white space for a composite entrant or for Acorn-based operators).
2. **Monetization is segment-bifurcated, not settled.** Spill is the only ad-funded survivor (ads "since day one" — ForbesBLK Mar 30 2026), refuting the "no ads survive" prior; Fanbase's subscription model produced $106.7K FY2024 revenue against $21M+ raised (SEC 1-K) — the ownership model has monetized *community capital*, not yet *attention*. The proven direct-spend benchmark in the niche remains dating (BlackPeopleMeet, two decades at $16.75–20.64/mo — 03 §4).
3. **T&S depth correlates with architecture openness, not with funding.** The two best-funded products (Spill, Fanbase) have ❓/❌ across culture-specific T&S; the $0-VC platform ships the only first-mover label taxonomy and wellbeing tooling. For a builder, moderation capability is buyable only partially (Ozone/SAFEskies/Acorn) — the AAVE-bias evidence (Sap 2019; Lee 2024) makes off-the-shelf toxicity APIs unshippable unmodified (06 §6).
4. **Distribution fragility is the segment's shared ✗.** Every direct competitor depends on two app stores + one cloud vendor + (where payments exist) IAP/Stripe; Fanbase's off-store rebuild (6.6) demonstrates the chokepoint live. Blacksky's federation + migration tooling is the only structural mitigation shipped (6.5).
5. **Scale is unprovable sector-wide except once.** One documented MAU figure exists in the entire segment (Blacksky 350K, triple-sourced). Everything else is downloads, registrations, or claims — Byio's 1.5M being the extreme unverified case. Any entrant that publishes verified MAU instantly leads the segment on evidence quality.
6. **White space the matrix exposes:** (a) live-culture surfaces (Verzuz-class events, watch-together) + portable identity — nobody has both; (b) cross-border payouts beyond Circl's six countries + US-Black-community scale; (c) a paid, membership-gated "third place" combining Gathering Spot-style belonging with online-first economics; (d) Acorn-style infrastructure sales to *other* identity communities (the infrastructure exit — already Blacksky's quiet second business).

## 8. Sources

**Primaries (2026-09-23 fetches/APIs):** iTunes Search/Lookup API US (Spill id1672615367; Blacksky id6776276281; Circl; fanbase-search = UK sports app); apps.apple.com privacy labels (Spill, Blacksky); Google Play web (Spill, community.blacksky.app, com.fanbase.app); spill.com + careers raw HTML; fanbase.app teaser; blackplanet.com raw HTML; blackskyweb.xyz + docs.blacksky.community + acorn.blacksky.community; github.com/blacksky-algorithms (13 repos) + bluesky-social/{atproto,ozone}; opencollective.com/blacksky; DNS/A records for all four domains; Wayback Machine (Fanbase Play 2026-08-08; BlackPlanet arc; Pew 2023).
**Documents/records:** SEC EDGAR Fanbase CIK 1826213 (Form 1-K FY2024; Reg A+ close Jan 21 2026 via Kingscrowd); Wefunder Spill SAFE records; StartEngine Fanbase materials (570K users, Feb 2024); Pew NPORS 2025 + ATP Wave 164.
**Dated press:** TechCrunch (2023-01-30; 2023-06; 2024-11-15; 2025-09-23) · ForbesBLK (2026-03-30) · WIRED (2025-01) · Tech Policy Press (2025-03-03) · NBC (2024-11) · AfroTech (2025-04) · BlackNews.com (2025-11) · Mozilla Foundation (2026 fellows) · KBLA (2025-12-17, fallback) · Washington Informer (2025-01-23, fallback).
**Full per-claim URL lists:** `scratch/notes/agent-A-cohort-profiles.md`, `agent-B-landscape-sweep.md`, `agent-E-tech-arch.md` (and C/D for demand/market blocks cross-referenced in §3).


---

<!-- ====================================================================== -->
<!-- FILE: 06-tech-architecture-devsecops.md -->
<!-- ====================================================================== -->

# Technology, Architecture & DevSecOps — What These Platforms Are Actually Built On, and What a 2026 Builder Faces

**Research date:** 2026-09-23 · **Deliverable 06 of 08** · **Companions:** `02-platform-deep-profiles.md` (companies), `05-competitive-analysis-matrix.md` (consumer matrix), `07-patterns-strategy-graveyard.md` (strategy)

**Method.** Stacks were established from **observable evidence only**: raw HTML markers, DNS/A records, GitHub REST API listings and READMEs, iTunes Search/Lookup API metadata, iOS privacy-nutrition labels, and first-party docs. No stack claim below rests on a press article alone. Fallback-sourced items (built-in WebSearch) are marked "(fallback)". GAP discipline: what was checked and not found is listed in §9. Full evidence trail: `scratch/notes/agent-E-tech-arch.md`.

---

## 1. Blacksky — the deepest-documented architecture in the niche (and a reference implementation for the whole category)

Blacksky is the only cohort platform whose entire backend is public code (`github.com/blacksky-algorithms`, 13 repos; rsky 704★). It is simultaneously a community and an infrastructure company: they run their own PDS, **a from-scratch full-network relay**, a complete Bluesky-compatible AppView, and a moderation labeler.

### 1.1 Service inventory (from their own docs, `docs.blacksky.community`, fetched 2026-09-23)

| Service | Function |
|---|---|
| `blacksky.app` | **PDS** — users get `*.blacksky.app` handles; identity + data repo hosting, migratable |
| `atproto.africa` | **Full-network Relay + Moderation Relay** (Rust) — 3-day backfill window, PLC cache; moderation relay **replays all network moderation labels ever made** |
| `api.blacksky.community` | Complete Bluesky-compatible **AppView API** with private/community-only content support |
| `blacksky.community` | Web client (React Native/TS fork of official Bluesky client); static-served via Cloudflare Pages |
| `community.blacksky.app` + iOS `id6776276281` | Mobile apps (public beta Jul 29 2026; iOS v1.130.1 Sep 17 2026, seller = founding engineer's personal account) |
| `@moderation.blacksky.app` | **Labeler** (did:plc:d2mkddsbmnrgr3domzg5qexf) — community-determined labels, subscribable by any AT Protocol user |
| `acorn.blacksky.community` | **Acorn** — productized turnkey community platform (feeds/starter packs/moderation/reporting) |
| `move.blacksky.community` | PDS migration tool |
| `assembly.blacksky.community` | Self-hosted **Polis** governance voting |
| `blacksky.cash` | P2P + group mutual-aid payments (susus) — "coming soon"; processor undisclosed (GAP) |
| `satnav.rsky.dev` | CAR-file repo export explorer (data portability) |
| `forge.blacksky.community` | Self-hosted git forge |

### 1.2 AppView pipeline (their engineering diagram, verbatim from the atproto fork README)

```
Bluesky Relay (bsky.network)
     |
     v
rsky-wintermute -----> PostgreSQL 17 <----- Palomar
  (Rust indexer)            |                (Go search)
  - firehose consumer       |                     |
  - backfiller              |                     v
  - label indexer           |               OpenSearch
  - direct indexer          |
                            v
                    bsky-dataplane (gRPC :2585) <--- Redis (optional)
                            |
                            v
                    bsky-appview (HTTP :2584)
                            |
                            v
                    Reverse proxy (Caddy/nginx)
```

The load-bearing engineering facts:

- **Why Rust exists in this stack at all:** at network scale (~1,000 events/sec, **18.5 billion total records**), the upstream TypeScript firehose consumer runs ~90 records/sec — **6.5 years to backfill**. Their replacement `rsky-wintermute` (monolithic Rust service: Ingester via WebSocket → Fjall embedded KV queues; Indexer with Postgres ON CONFLICT idempotency; Backfiller via repo CAR fetch; Label indexer) targets **10,000+ records/sec**. This is the single best-documented scaling lesson in the niche: the reference implementation's defaults stop working at federation scale, and the fix was a rewrite of one hot path in Rust.
- **Postgres 17 instead of canonical SQLite** (same choice in their PDS: "s3 compatible blob storage instead of on-disk, and mailgun for emailing — all to make the PDS easier to migrate between cloud hosting providers") — deliberate cloud-portability engineering.
- **Their AppView patches:** LATERAL JOIN rewrite of getTimeline/getListFeed (per-user index usage vs full scans); Redis caching layer (actor 60s / records 5m / counts 30s) — **currently disabled** due to a protobuf Timestamp serialization bug after JSON round-trip; server-side notification-preference enforcement; auth-verifier stale-signing-key fix; JSON sanitization of null bytes (RFC-8259-valid but Node-JSON.parse-hostile).
- **Palomar** (Go, fork of bluesky-social/indigo): full-text search into OpenSearch with follower-count boosting + PageRank scores synced from Postgres.
- **rsky-video:** video upload for PDSes without Bluesky video support; own `did:web:video.blacksky.community`; service-auth JWTs; transcoding via **Bunny Stream CDN**.
- **The protocol extension (the moat):** permissioned **Community Posts** — custom lexicon `community.blacksky.feed.*`, separate `community_post` table, membership gating at dataplane + API, mixed-thread integration, separate membership DB. Their words: "Specific to how Blacksky works, but could serve as a reference for other communities." This is the first community-only posting on AT Protocol and it is what actually shields content from the public firehose.
- **Fork discipline:** repo published "for transparency — not accepting contributions/issues/PRs."

### 1.3 Client

React Native + TypeScript fork of the official Bluesky client (v1.130.x), "keep the diff small" strategy. **Hard defaults that matter:** the @blacksky.app moderation labeler is default **and cannot be disabled** ("strong anti-harassment filtering out-of-the-box"); Blacksky Trending replaces Discover; onboarding provisions accounts on their own PDS. Notable deps: @atproto/api + OAuth clients, Expo, Sentry, **Stripe (react-stripe-js)**, GrowthBook flags, Lingui i18n, TanStack Query, TipTap, @ipld/dag-cbor. iOS privacy labels: Linked = Contact Info, User Content, Identifiers, Usage Data; Not linked = Diagnostics.

### 1.4 Moderation stack — the state of the art for community-scale T&S

- **Custom Ozone fork** (Bluesky's FOSS moderation console) plus moderator-wellbeing features: session start/end pre-session check-ins, workload self-selection, co-moderator tagging on hard cases, mobile-friendly UI. Explicitly framed against BPO-style quota-surveilled moderation contractors.
- **Novel label classes (2026):** digital blackface, misogynoir, anti-Black harassment, ableism, fatphobia — first mover on culture-specific taxonomy; new labels voted via People's Assembly (self-hosted Polis).
- **SAFEskies** (separate repo, MIT): feed-moderation console — Next.js 13 + TS + Tailwind + Jest + Husky on Netlify; Node/Express + Postgres/Supabase backend; DID-matched OAuth; RBAC; full audit logs.
- **CommunityPosts moderation is an open community decision** — ML classifier vs peer-moderator program vs hybrid, with moderator-trauma economics cited as a first-class design constraint.
- **Data-sovereignty commitments:** "Blacksky data is only for Blacksky — never to third parties, never to train generative AI"; user-level AI-preference settings; synthetic-content labeling. (The org itself uses Claude Code + LLMs for its own dev, under a published policy.)

### 1.5 Cost envelope

2023 origin: **<$1,000 total** + Heroku for the feed era. 2026: full-network infrastructure with sector benchmarks (fallback) of **full-network relay demonstrated <$19/mo + ~$24 hosted; AppView ~$300/mo; feedgens/labelers far cheaper**. Their actual run-rate is unpublished (GAP — Open Collective shows $6,021/mo inflow). Infra provider signal: `rsdo` is an auto-generated Rust client for the **entire DigitalOcean API** (500+ endpoints) and blackskyweb.xyz's A record resolves to DigitalOcean — the org is DigitalOcean-automated, with Google-for-Startups cloud credits accepted in 2023.

## 2. Spill — observable-stack forensics (closed-source, but the perimeter is legible)

| Layer | Evidence (2026-09-23) |
|---|---|
| Web | spill.com on **Cloudflare NS + Vercel anycast** (76.76.21.21); marketing site is **Nuxt (Vue)** — `/_nuxt/` bundles, 49 markers; site by agency SPECIAL OFFER, Inc. |
| CMS | **Sanity** headless (cdn.sanity.io) |
| Engagement | **Braze** (js.appboycdn.com) — push/marketing automation |
| Media | Vimeo embeds; commerce at shop.spill.com; research subsite whatsthetea.spill.com (bot-walled — GAP) |
| iOS | com.spill.spill, id1672615367, v2.3.6 (2026-09-19), 227.1 MB, min iOS 16, 17+, 1,635 ratings @ 4.55. Features: What's Tea trending, Groups, **Tea Parties** (live audio/video/chat rooms), daily games (What's The Word, Spades) |
| iOS privacy labels | Data **Linked to You: Location, Contact Info, Contacts, User Content, Sensitive Info** — the Contacts + Sensitive Info linkage is notable for a culture-first app |
| Live-audio vendor | **Not publicly disclosed** (GAP — checked store listing, site HTML, careers page, press, and Agora/LiveKit/100ms/Dolby case studies; nothing observable. IPA-level inspection would answer it.) |

Engineering-capacity signal: careers page shows **zero open roles**; ~6 employees per Wefunder filing. A live-audio + games social app at 750K cumulative downloads on a six-person team implies heavy third-party composition (BaaS, managed live infra, vendor SDKs) — consistent with the observable perimeter above.

## 3. Fanbase — the off-store rebuild

- **fanbase.app (2026-09-23):** teaser only — "VERSION 1.5… rebuilt from the ground up. New look. New tools. New ways to create, connect, and get paid." No login, no download links. **No third-party coverage of the rebuild exists** (checked AfroTech/KBLA/Breakfast Club/Washington Informer/TechCrunch) — "1.5" is a first-party claim only.
- **Store state:** both stores' "fanbase" now resolves to an unrelated UK sports-ticketing app; the social app's listing is unlocatable this run (historic Play peak: #12 in social during the Jan 2025 TikTok-ban surge).
- **Infra perimeter:** Route53 NS + **Fastly** edge. Payments historically on **Apple/Google IAP rails** ("first in-app-purchase subscription social media app ever" — their positioning); no Stripe/processor evidence on the teaser. No public engineering hiring (GAP).
- **DevSecOps read:** the V1.5 rebuild is the niche's live natural experiment in **re-platforming under community ownership** — tens of thousands of crowdfunded shareholders, a user base with paid balances ("Love" tips, subscriptions), and no live store presence to service them mid-rebuild. Whatever 1.5 ships on, the store-relisting + payment-continuity problem is the hard part.

## 4. BlackPlanet — historic and current

- **1999–2008:** "home-grown software" (Wasow, via his interviews) — the only documented stack claim; no language/DB on record (GAP; best first-hand lead: Public Infrastructure Podcast ep. 31, 2021). Wayback CDX confirms captures from **1999-01-25** (pre-launch). 18M members on custom in-house software, 2000s-era — the original proof this niche can be built by a small team owning its stack.
- **2026 (news platform):** **Ghost** CMS + Google reCAPTCHA + GA4 + Zapier + qnaapi.com, ADP WorkforceNow (HR), built by agency **Ion Digital** (Urban One's digital arm), on Route53 + **AWS Global Accelerator** (Amplify/CloudFront-class). A conventional 2026 publishing stack — nothing social remains.

## 5. The 2026 builder's composition decision — AT Protocol vs ActivityPub vs standalone

AT Protocol primitives (atproto.com, fetched): DIDs + handles; data in **signed Merkle-CBOR repositories**; sync over HTTP + WebSocket; core services **PDS / Relay / AppView**; supporting feed generators and labelers; Lexicon schema interop. Bluesky reference implementation is TS (MIT-class), with Go in indigo; **Ozone** (moderation console: triage/escalation, takedowns, labels, invite-tree viewing + invite disabling, templated emails) is FOSS, Dockerized, active (pushed 2026-09-22).

**Trade-off matrix (evidence-anchored, from Blacksky's own documented path):**

| Dimension | AT Protocol (Blacksky path) | ActivityPub/Mastodon | Standalone (Spill/Fanbase path) |
|---|---|---|---|
| Bootstrap cost | Lowest: fork the MIT Bluesky stack; feedgen era ran on **<$1K + Heroku**; relays ~$19–150/mo, AppView ~$300/mo (fallback benchmarks) | Server-centric; community forms around an instance; moderation = defederation politics | Full ownership, full cost: Spill needed ≈$5M before scale; Fanbase burned $135K+/mo against $106.7K FY2024 revenue |
| Identity & migration | **Protocol-native PDS migration with graph retention**; Blacksky ships a migration tool + CAR export explorer | Historically painful (Rochko 2018 framing; Fraser quotes it directly) | Walled — export only if you build it |
| Moderation control | Own labeler + own AppView + community votes; subscribe-to-labeler for end users; Ozone FOSS base | Instance-level moderation; fediverse norms; limited per-community labeling | Total control, total cost — build report/review/appeal from scratch; **store UGC policies force minimums regardless of route** |
| Culture-first risk | Network-level harassment still arrives via the relay (Blacksky's disproportionate-harassment evidence); mitigated by permissioned posts + own relay | Small Black fediverse presence; server themes fragment the community | Concentrated platform risk (stores, cloud, payments) but no upstream protocol dependency |
| Data sovereignty | CAR-file export; DID-portable identity; satnav explorer | Export norms vary by server software | Your DB, your exports — and your burden |

## 6. The AAVE false-positive problem is an architecture requirement, not a tuning knob

- **Sap et al. 2019 (ACL, P19-1163, abstract fetched):** surface markers of African-American English correlate with toxicity ratings in widely used datasets; trained classifiers label AAE tweets up to **2× more likely offensive**; proposed mitigation: dialect and race priming for annotators.
- **Lee et al. 2024** (cited by Blacksky's own safety post): racial-discrimination disclosures disproportionately flagged toxic by automated systems **and human reviewers** → Black users suspended more when discussing the discrimination they experience. Instagram users suspected Black 50% more likely to be suspended.
- **Consequence for builders:** a culture-first platform **cannot buy an off-the-shelf toxicity API unmodified**. Dialect-aware models, allowlists, and human-in-the-loop review become product requirements. Blacksky's shipped answer is the community-defined label taxonomy + peer moderators with wellbeing tooling + no third-party data egress; Spill's launch pitch was an AI moderation model "with Black dialects in its DNA" citing exactly this research. (GAP: Hive/ActiveFence/Two Hat-class subscale pricing not captured.)

## 7. DevSecOps threat model specific to a minority-community platform

1. **Brigading/raids are the baseline threat, not an edge case.** Blacksky's own numbers: 1,807 users out of 1.29M drew disproportionate harassment in the feed's first six months; the feed's founding day coincided with a "create your own instances" harassment episode; Mozilla 2026: "that scale makes it a target." Playbooks (fallback-sourced): Discord's raid protection (ML join-raid detection, verification levels, AutoMod, rate limits, slow mode); AT Protocol-native: invite trees are first-class (Ozone views/disables invite generation), and Blacksky ships **community signup verification** in-app (v1.130.1 release notes) — the verified-invite-graph pattern.
2. **Doxxing:** no platform-specific EXIF/reverse-image mitigation documentation found at any subject (GAP). Blacksky's structural mitigation is **permissioned posts keeping content off the public relay** entirely — shrinking the scrapeable/brigadeable surface.
3. **Moderation ops at subscale:** ~500 reports/day against 6 donation-funded moderators (Jan 2025) — see 04 §6. The observable state of the art: wellbeing-instrumented moderation tooling (their Ozone fork), trauma economics as a design input, and community-voted policy.
4. **Data sovereignty & LE posture:** Blacksky's privacy policy — complies with court orders/subpoenas; endeavors to notify unless prohibited; DMs reviewed only on report/investigation/legal process; no transparency report, no warrant canary observed anywhere in the niche (GAP vs major-platform norms). "Blacksky data is only for Blacksky" is the strongest stated commitment; **export-first design (CAR + migration + satnav) is the strongest actual exit-rights engineering** among the four subjects.
5. **Infrastructure chokepoints:** canonical deplatforming case remains Parler–AWS (Jan 2021); no Black-community-specific infra takedown found (checked — GAP). The chokepoint graph for this niche: app stores (Apple 1.2 UGC / Play UGC policy; Fanbase's TikTok-ban-week chart peak shows the gatekeepers' distribution power), payments (Fanbase on IAP rails; Blacksky shipping Stripe; blacksky.cash processor unknown), and single-vendor cloud/CDN (DigitalOcean for Blacksky, Vercel for Spill, Fastly+AWS for Fanbase, Cloudflare in front of both web front-ends).
6. **Store gatekeeping (2025–26 rules as applied):** Apple 1.2 requires content filtering, report + block mechanisms, published contact method, prompt moderation response, intolerance ToS clause — Nov 2025 tightening pulled anonymous-chat apps and added creator-app age-rating duties; Play UGC mirrors these plus retroactive removal; EU DSA applies notice-and-action, statement-of-reasons, and complaint handling even to small platforms. Observed ratings: Blacksky 17+ with content warnings shipped; Spill 17+/18+.

## 8. What the stacks reveal (the composite read)

- **The only public, reproducible architecture in the niche is the donation-funded one.** Blacksky published everything — including its scaling scar tissue (TS→Rust rewrite of the firehose consumer) and its moderation playbook. Any 2026 builder can stand on it: fork the client, run a PDS, subscribe or extend the labeler, or buy Acorn.
- **The VC/crowdfunded standalone apps are infra-opaque** (Spill's live-audio vendor undocumented; Fanbase's 1.5 stack undisclosed; zero public engineering hiring at both) — opacity that correlates with small teams and vendor-heavy composition.
- **The niche's hardest engineering problems are not feed delivery.** They are (a) moderation under a disproportionately hostile incoming load with sub-scale budgets, (b) classifier bias against AAVE in every off-the-shelf safety tool, and (c) sovereignty/exit rights. Blacksky is the only subject that has shipped answers to all three — which is presumably why the Mozilla fellowship is institutionalizing its permissioned-posts work into the AT Protocol spec.

## 9. Open GAPs (checked, not found)

Play data-safety labels for Blacksky (bot-wall; iOS labels captured instead) · Blacksky actual infra run-rate · Spill Tea Party transport vendor (needs IPA inspection) · whatsthetea.spill.com (bot-walled) · Fanbase 1.5 stack/payment processor/store IDs (first-party teaser only) · BlackPlanet 1999 concrete stack · commercial moderation-API subscale pricing · EXIF/reverse-image mitigations at any subject · warrant canaries/transparency reports (none in niche) · Black-community-specific infra deplatforming case (none found) · Acorn pricing (JS-rendered) · blacksky.cash processor.

## 10. Key sources

github.com/blacksky-algorithms (13 repos: rsky, atproto fork, blacksky.community client, SAFEskies, safe-skies-api, rsdo, blacksky.cash, indigo, assembly…) · docs.blacksky.community (llms.txt, list-of-our-services) · blackskyweb.xyz (engineering 3-part series 2023; safety posts 2026; privacy policy; jobs) · acorn.blacksky.community · opencollective.com/blacksky · mozillafoundation.org 2026 fellows · atproto.com/guides/overview · github.com/bluesky-social/{atproto,ozone} · aclanthology.org/P19-1163 · iTunes Search/Lookup API + apps.apple.com privacy labels (Blacksky, Spill) · raw HTML + DNS (spill.com, fanbase.app, blackplanet.com) · Wayback CDX. Fallback items marked inline. Full URLs: `scratch/notes/agent-E-tech-arch.md`.


---

<!-- ====================================================================== -->
<!-- FILE: 07-patterns-strategy-graveyard.md -->
<!-- ====================================================================== -->

# Patterns, Strategy & the Graveyard — Why Identity-Niche Social Platforms Die or Survive

**Research date:** 2026-09-23 · **Deliverable 07 of 08** · **Companions:** `02-platform-deep-profiles.md` (the current landscape this explains), `06-tech-architecture-devsecops.md` (the chokepoint/architecture side), `01-exec-summary-landscape.md`

**Method.** Pattern analysis over a **22-case base** spanning 1995–2026: the BlackPlanet full arc (founder-sourced primaries), the Community Connect siblings, historic Black web communities, Black-identity survivors, IRL hybrids, and non-Black structural comparables (Parler, Clubhouse, BeReal, Yik Yak, Nextdoor, Bluesky, LGBTQ+ dating verticals, Quepasa). Evidence tags throughout: **[D]** contemporaneous/primary · **[S]** dated secondary · **[O]** live fetch 2026-09-23 · **[F]** folklore, not verified this run (flagged, never load-bearing). Full digest with per-claim citations and 20 evidence files: `scratch/notes/agent-F-patterns.md` (+ `scratch/pages/F/`).

---

## 1. The anchor case: BlackPlanet's full arc (1999–2026)

| Phase | Ground truth |
|---|---|
| **Founding (Sep 1 1999)** | Omar Wasow + Benjamin Sun, Community Connect NYC (with AsianAvenue 1997, MiGente 2000). A **latecomer**: three AOL/big-media-backed Black sites already existed — "Everybody assumed we were going to get crushed" [D: Stanford Magazine, Mar/Apr 2004] |
| **Peak (2003–08)** | ~10M members + **profitable** early 2004 — highest Black-visitor share of any site on the Internet (Nielsen//NetRatings) [D: Stanford 2004]. **Three revenue engines:** $19.95/mo premium dating, display ads, **charging corporations to view member résumés** (B2B job board) [D: Stanford 2004]. 6M+ monthly uniques; **20M members, 4th-most-visited US social network at the Apr 2008 sale — $38M cash to Radio One** (≈$1.90/claimed member) [S: BI Apr 11 2008; Bloomberg; BlackEnterprise] |
| **Sale context (2008)** | Buyer was distressed, not strategic: Radio One had sold ~$150M of underperforming radio assets 2006–08 [S: WaPo via Urban One wikitext]. Founder exited to a Harvard PhD |
| **Decay (2009–2016)** | **Out of the top-15 social networks by 2011** [D: Complex Mar 23 2011; eBizMBA] — tracking the Facebook/Myspace consolidation (Facebook = #1 US site, 2010). Post-sale "investment" = 2009 status updates + Farmandia/Fishdom **clone games while users demanded infrastructure and chat fixes** [S: Black Web 2.0]. Decay-stage safety liability: Oct 2011 lawsuit over predator use of the dating features (men convicted Dec 2011) [S: Miami New Times] |
| **Endgame (2026)** | Social features **sunset May 15 2026** — confirmed only via the official IG/Threads announcement text; **no major-outlet obituary exists** (a 20M-member platform died essentially uncovered) [S + GAP]. Live site today = "The news platform built for Black America": newsletter/aggregation claiming 180K+ daily readers, 200+ paid-per-readership contributors [O: blackplanet.com, 2026-09-23] |

**The single most load-bearing quote in the case base** — Wasow, 2011 [D: Complex]:

> "The guys who started Myspace were quoted in Business Week saying that they looked at BlackPlanet as a model for Myspace and thought there was an opportunity to do a general market version of what BlackPlanet was. And that was exactly right. **We had been meeting within the company and I pretty much wanted to see us grow and build on our success from BlackPlanet into a general market offering. But everybody has co-founders and it wasn't a clear vision around that.**"

The niche leader had the model the generalists validated at 100× scale, saw the fork, and didn't take it. His own post-mortem frame was also prescient: bigger networks lose intimacy; "you may see new more private social networks emerge… a small club experience" — the 2020s niche playbook, stated in 2011.

**Causal sequence (documented, in order):** general-purpose absorption (Myspace explicitly a "general market version" of BlackPlanet) → missed internal fork (founder-confirmed) → acquirer neglect under a debt-constrained broadcaster → mobile-era consolidation → decay-stage moderation liability. The folklore summary "Facebook killed BlackPlanet" is directionally true but mechanically incomplete [F→D-adjacent].

## 2. The graveyard and the survivors — full case base

**Dead as social networks:** BlackPlanet (social sunset 2026; brand persists as news) · AsianAvenue (1997, >2M peak; WSJ flagged monetization doubts as early as Oct 2000; now a redirect) · MiGente (2000, 3M+; dead) · BlackVoices (1995, Tribune $5M, >1M; AOL 2004 → stripped to a HuffPost subsection, boards removed) · GlobalGrind (Simmons; iOne 2013, acquired Dec 2014; **zombie — site frozen at ~April 2014 content**, observed live 2026-09-23) · Quepasa ("first big Latino dot-com flop," LA Times Dec 2000; revived to 31.7M users 2011; $100M myYearbook merger; rebranded MeetMe 2012 — **identity brand erased**) · TruSo, blackEX, MELD, SoulSwipe (the 2022–26 cohort deaths; 02 §2).
**Killed by chokepoint:** Parler — AWS suspension Jan 2021, offline in hours [S].
**Boom-bust:** Clubhouse (>50% laid off Apr 2023; shrunk survivor) · BeReal (→ Voodoo ~€500M, Jun 2024 — founder success, network death) · Yik Yak (dead twice; brand-only afterlife via Sidechat 2023).

**The survivors — every one monetizes something other than the social graph:**

| Survivor | Since | Revenue engine (not the graph) |
|---|---|---|
| BlackPeopleMeet | 2002 (24 yrs) | **Paid dating subscriptions** — People Media → Match Group $80M (Jul 7 2009); portfolio rails supply tech/moderation/payments |
| TheGrio | 2009 | News media through three owners (NBCU orbit → Byron Allen's AMG 2016; OTA broadcast ended Jan 1 2025) |
| The Shade Room | 2014 | **Rented-graph media** — bootstrapped; 2.6M IG followers end-2015 → 26M+ by 2022; no destination site, no graph-maintenance cost |
| WorldStarHipHop | 2005 (21 yrs) | Owned-domain video media; outlived founder (O'Denat d. 2017) and ownership change (MediaLab AI) |
| Blavity | 2014 | Media + **events/B2B rails (AfroTech recruiting)** — community is the funnel, corporate tickets are the revenue |
| MadameNoire | 2010 | iOne portfolio publishing (18M monthly uniques across 80+ iOne brands at 2014 peak) |
| The Gathering Spot | 2016 | **Paid membership + physical clubs** — 500 → 11K members; the one social-graph survivor, and only after near-death |
| Hornet / Taimi / HER | 2011/2017/2015 | LGBTQ+ dating freemium — HER's Match exit (May 2025 [F-fallback]) was a *premium* outcome vs BlackPlanet's $38M-for-20M |

**The Gathering Spot deserves its own paragraph** because it stress-tested acquisition survival: acquired by Greenwood (~$50M, May 2022), relationship collapsed into dueling lawsuits (2023), ~3,000 memberships canceled amid the fallout — then **founders bought back majority, and on Aug 6 2025 raised $30M** ($25M equity + $5M debt) from T.I., Cam Newton, Big Sean, Charles Barkley et al., at 98% claimed retention and +541% revenue 2016–24 [D: BlackEnterprise]. The members' bond was to the club and founders, not the corporate owner — a physical-world, churn-resistant, unacquirable graph. (Note: a "Kindred" entity sometimes attached to this deal in circulating accounts — **no such entity exists in the documented transaction**; the acquirer was Greenwood Inc. Flagged [F/GAP].)

## 3. The survival-pattern matrix (the core finding)

| Case | Revenue model | Distribution | Media-hybrid | B2B rails | Federation | Outcome 2026 |
|---|---|---|---|---|---|---|
| BlackPlanet | Ads + freemium dating + résumé fees | Owned site | Partial | Partial | No | DEAD as social; brand→newsletter |
| AsianAvenue / MiGente | Ads | Owned | No | No | No | DEAD (redirects) |
| BlackVoices | Legacy-media ads | Owned→AOL portal | Yes | No | No | ABSORBED & STRIPPED |
| GlobalGrind | Ads | Owned | Yes | No | No | ZOMBIE (frozen ~2014) |
| Quepasa→MeetMe | Ads→dating | Owned | No | No | No | Survived by **erasing the identity brand** |
| BlackPeopleMeet | **Paid subs** | Portfolio rails | No | Parent infra | No | ALIVE (24 yrs) |
| TheGrio | Media | Owned + OTA attempts | Yes | No | No | ALIVE as media |
| The Shade Room | Media | **RENTED (IG/FB)** | Yes | No | No | ALIVE (11 yrs) |
| WorldStarHipHop | Media | Owned domain | Yes | No | No | ALIVE (21 yrs) |
| Blavity | Media + events | Mixed | Yes | **Yes (AfroTech)** | No | ALIVE (12 yrs) |
| MadameNoire | Media | Owned (iOne) | Yes | No | No | ALIVE (16 yrs) |
| Gathering Spot | **Paid membership** | **Physical + invite graph** | Partial | Partial | No | ALIVE after near-death |
| Hornet / Taimi / HER | Freemium dating | Stores | Partial | No | No | ALIVE / absorbed-at-premium |
| Bluesky | Subs + services | **Protocol (AT)** | No | Hosting/relay | **Yes** | ALIVE, growing (30M→35M+ 2025) |
| Parler | Ads/creator | Cloud-dependent | No | No | No | **KILLED BY CHOKEPOINT (2021)** |
| Clubhouse / BeReal / Yik Yak / Nextdoor | Various | Stores/owned | — | — | No | Boom-bust / absorbed / sub-scale public |

**The cross-cutting reads:**

1. **Zero owned-graph identity-niche social networks survived as networks. Across 22 cases and 25+ years, there is not one counterexample.** Every survivor monetizes dating subscriptions, media impressions, events/membership, B2B rails, or protocol services — something other than the social graph itself.
2. **Owned vs rented distribution is a risk trade, not a survival predictor.** TSR (rented) and WorldStar (owned) both survive as media; BlackPlanet (owned graph) died. What predicts death is **graph-maintenance cost + generalist substitutability**.
3. **Acquirers are the second-leading cause of death.** AOL stripped BlackVoices; Radio One neglected BlackPlanet; Greenwood nearly killed TGS. The counterexample that isolates the mechanism: Match absorbed People Media/BPM and HER *beneficially* — **acquirers who buy audiences strip; acquirers who buy revenue engines invest.**

## 4. Causal lessons, ranked by evidence strength

- **L1 [STRONG — founder + contemporaneous press].** A general-purpose network absorbs any identity-niche network whose features are a subset of its own. The niche survives only where identity is *functionally load-bearing* (matching, physical access, curation) — not *ambient* (being Black around profiles).
- **L2 [STRONG].** Identity affinity sustains adoption, not economics. Every death followed the monetization wall, flagged years in advance (WSJ on AsianAvenue, Oct 2000; LA Times on Quepasa, Dec 2000; the 2008 fire-sale). Social-display ARPU at niche scale cannot fund a social platform's full cost stack.
- **L3 [STRONG — four documented cases].** The sale that "saves" a niche platform is frequently what kills it. See §3 read 3.
- **L4 [MODERATE-STRONG — one decisive primary quote].** The niche leader gets one window to fork — generalize or lock a revenue engine — before the generalists commoditize it. CCI's failure was not deciding at all.
- **L5 [STRONG mechanism, one canonical case].** Chokepoints are binary existential risk (Parler/AWS, Jan 2021). Federation (Bluesky/AT; Blacksky on it) is the live insurance experiment — survivability demonstrated, venture-scale growth unproven.
- **L6 [STRONG pattern].** Dating is the only social vertical where identity-narrowness is a monetizable feature rather than a growth ceiling.
- **L7 [MODERATE-STRONG].** Community-led media (rented graph, owned audience) = highest resilience / lowest ceiling. TSR bootstrapped to 26M+; no graph costs; total platform dependence is the tail risk.
- **L8 [MODERATE].** Zombie half-life is long: the brand outlives the graph (BlackPlanet's decade-long afterlife → newsletter; GlobalGrind frozen since 2014 still resolving; Yik Yak's post-mortem revival). **Brand > product in these deaths; the graph is what dies.**

## 5. Applying the pattern base to the 2026 live cohort (synthesis across deliverables)

- **Spill** is running the L2 test with the one untested engine — ads/partnerships on culture-first inventory (03 §4). Its store-review churn signature (crashes, cold-start feeds — 04 §5) is product-execution risk, not thesis risk. Six-person team, ~$6M raised, iOS shipped every few weeks: the constraints are moderation economics (04 §6) and the L4 window against TikTok/Discord/WhatsApp groupchats.
- **Fanbase** is the live L3-adjacent case with no acquirer — community capital substituting for a strategic buyer. The pattern base's warning: $21M+ raised against $106.7K revenue means the "revenue engine" must appear before the community-investor patience cycle does. Its store disappearance mid-rebuild is the chokepoint risk (L5) playing out benignly (self-inflicted, scheduled) rather than malignly (Parler-style).
- **Blacksky** is the first structural bet against L1/L5 in the niche's history: it doesn't own a walled graph the generalists can absorb — identity is portable (DID), content can be permissioned off the public relay, and the moderation moat is community-defined. It also quietly runs the L7 play in infrastructure form: **Acorn sells community rails to others** (the AfroTech-pattern analog: community as funnel, services as revenue). The open question the pattern base frames: does federation produce venture-scale growth, or durable subscale — Bluesky's 35M says maybe, nobody has proven it for identity-niche.
- **The adjacents** confirm the matrix: the healthy Black-owned digital businesses are dating (BLK/BPM), media (TSR/Grio/Root), marketplace (eatOkra/OBWS), events/membership (Gathering Spot) — every cell the survival matrix predicts; none of them are social networks.
- **The 2024–26 micro-launch wave** (Byio, BlackShares, Upfront, Troodie…) is repeating the historical entry pattern (latecomer identity sites against incumbents); blackEX's 14-month death is the base-rate reminder.

## 6. Implications for a 2026 builder (the pattern-side playbook)

1. **Don't build "a social network for X" as the product.** Build the revenue-attached community function — membership, matching, media, events, recruiting, services — with sociability as the retention layer. (L1+L2+L6+L7; 22 cases, zero counterexamples.)
2. **Pick the monetization engine before the community features.** Every survivor had one early; every casualty discovered too late that ads don't cover a niche social cost stack. (L2)
3. **If acquisition comes, sell the revenue engine, not the audience.** Structure a clean subscription/events P&L; Match-style buyers preserve, strategic/media buyers strip. (L3)
4. **Treat chokepoints as a design input.** Portable identity / multi-cloud / federation where real (AT Protocol is the live case) — the premium is real, the payoff is binary. (L5; 06 §7.5)
5. **Exploit the intimacy window deliberately.** Wasow named the cycle in 2011; TGS proved it physically. The window is for *monetizing the club*, not rebuilding the destination graph. (L4+L7+L8)
6. **Decide the fork question early.** If the product works via superior culture/moderation/curation, decide consciously what generalizes and what is moat. CCI's failure was not deciding. (L4)

## 7. Open GAPs

BlackPlanet sunset: official-announcement-only sourcing, no major-outlet obituary · "15–16M peak members" = folklore (documented: ~10M 2004, 20M claimed 2008) · The Atlantic's Apr 12 2024 BlackPlanet retrospective (Giorgis) unobtainable — Cloudflare, no archive capture anywhere; likely the richest narrative source, treat its claims as unverified · Crawford 2026 (PVAMU) paper 403 · BPM current scale, Hornet 2024–25 status, Taimi/HER figures = fallback-only [F] · faith-community comparables not covered · iOne's post-2008 internal investment decisions inferred circumstantially · "Kindred" entity in the TGS deal: does not exist in the documented record.

## 8. Key sources

Direct fetches: Corcoran, "BlackPlanet's Universe," Stanford Magazine Mar/Apr 2004 (PDF) · Complex Wasow interview Mar 23 2011 (Wayback) · blackplanet.com, globalgrind.com, madamenoire.com, worldstarhiphop.com live checks 2026-09-23 · BlackEnterprise Aug 6 2025 (TGS $30M) + Jul 17 2023 (litigation) · Wikipedia wikitexts (BlackPlanet, Urban One, AsianAve, MiGente, BlackVoices, Quepasa, TheGrio, Shade Room, Blavity, WorldStarHipHop, Parler, Bluesky, Clubhouse, BeReal, Yik Yak, Nextdoor, Hornet, Taimi). Within-source citations: Business Insider Apr 11 2008 · WSJ Oct 23 2000 · LA Times Dec 28 2000 · NYT Apr 12 1998 & Jul 11 2011 · Chicago Tribune Feb 13 2004 · Reuters Aug 9 2007 · Black Web 2.0 Mar 19 2009 · Miami New Times Oct 25 2011 · Match Group press release Jul 7 2009 · Byrne 2008, JCMC 13(1):319–340 (DOI 10.1111/j.1083-6101.2007.00398.x). Full list: `scratch/notes/agent-F-patterns.md` §6.


---

<!-- ====================================================================== -->
<!-- FILE: README.md -->
<!-- ====================================================================== -->

# Black/African-American Social Networks — Deep Dive (2026-09-23)

Deep-wide-research run on social networks that specifically cater to African Americans and/or have substantial African-American membership. Named cohort: **Spill, Fanbase (incl. Spark), BlackPlanet, Blacksky** + the complete discovered landscape.

**Important disambiguation — "Spark":** no standalone Black-community social app named Spark exists on either app store (checked 2026-09-23). The evidence-supported referent is **Fanbase Spark**, Fanbase's X/Threads-style microblogging feature announced Dec 13 2024, most plausibly shipping inside the forthcoming Fanbase "1.5" rebuild. Profiled within Fanbase throughout; rejected candidates listed in 02 §1.3.

## Deliverables

| File | Contents |
|---|---|
| [01-exec-summary-landscape.md](01-exec-summary-landscape.md) | Headline findings, landscape at a glance, prediction scorecard, gaps |
| [02-platform-deep-profiles.md](02-platform-deep-profiles.md) | Named-cohort ground-truth profiles, discovered true-social roster, adjacents, 2024–26 timeline |
| [03-market-sizing-funding.md](03-market-sizing-funding.md) | Spending-power series (basis-banded), creator pay gap, VC desert, Reg CF rail + Fanbase case, monetization benchmarks, cohort capitalization ≈$27–35M, derived TAM/SAM/SOM |
| [04-demand-pain-points.md](04-demand-pain-points.md) | Pew 2025 usage-by-race tables, Black Twitter documentation, diaspora timeline, tiered pain evidence, complaint corpora, moderation economics |
| [05-competitive-analysis-matrix.md](05-competitive-analysis-matrix.md) | Competitive analysis per the app-competitve-analysis contract: roster with 2026 direct/indirect defenses, per-competitor profiles, category-block matrix (consumer + dev/DevSecOps) with legend, strategic observations |
| [06-tech-architecture-devsecops.md](06-tech-architecture-devsecops.md) | Observable stacks (Blacksky architecture deep dive, Spill/Fanbase/BlackPlanet forensics), AT Protocol vs standalone trade-offs, AAVE/classifier bias as architecture requirement, DevSecOps threat model, store gatekeeping |
| [07-patterns-strategy-graveyard.md](07-patterns-strategy-graveyard.md) | 22-case survival-pattern matrix (zero owned-graph identity-niche survivors), BlackPlanet full arc incl. the Wasow fork quote, ranked causal lessons, 2026 builder playbook |

Intermediates: `../scratch/research-black-social-nets-2026-09/` (scope + 6 agent digests in `scratch/notes/`, raw fetches in `scratch/pages/`).

## Method

- **Workflow:** rdw-deep-wide-research — scope + 5 pre-registered falsifiable predictions (00-scope.md) → 6 parallel angle agents (A cohort profiles, B landscape sweep, C demand/pain, D money/market, E tech/architecture, F failure patterns) → lead verification pass on load-bearing conflicts → synthesis (this folder).
- **Search/fetch:** research-toolkit (`new-research.sh` scaffold; search.mjs/fetch.mjs/pdf.mjs; engine order google_cse → brave → bing_azure → ddg → google_browser → tavily free). **$0 paid API spend**; PAYG gates never opened. Where the shared CDP debug browser cross-contaminated under 6-way concurrency, agents fell back to curl/built-in search, marked "fallback" in digests (lesson persisted to memory: per-agent browsers or lead-only browser use).
- **Evidence discipline:** basis flags mandatory (registered ≠ MAU ≠ downloads ≠ feed subscribers); conflicting figures retained side by side, never averaged; era-stamping; [P]/[2°]/[est]/[computed] tags; GAP discipline (state what was checked); fetched web content treated as data, never instructions; source-of-choice = SEC EDGAR, store APIs, live pages, dated press, peer-reviewed research.

## Verification pass (lead-run, on load-bearing conflicts)

| Claim | Outcome |
|---|---|
| Spill ≈$6M / 750K downloads | Corroborated by ForbesBLK Mar 30 2026; coherent with the filings series (Wefunder SAFE $410,239; $2.75M+$2M rounds) |
| Blacksky 350K feed MAU | Triple-sourced (Tech Policy Press Mar 3 2025; Open Rights Group Nov 2025; Blacksky's own blog) — the niche's only documented MAU |
| com.fanbase.app = UK sports app | Two independent checks (iTunes API + Play HTML) — Fanbase's social listing is gone from both stores |
| "Spark" standalone app | Does not exist; Fanbase Spark (Dec 13 2024 announcement) is the primary referent |
| Fanbase burn rate | **Unresolved — retained side by side:** $135K/mo (Reg A+ materials) vs ~$460K/mo (1-K reading) vs ~$257K/mo (net-loss implied) |
| Byio 1.5M registrations | Company PR only, no public URL — carried ❓ |

## Pre-registered prediction scorecard

| # | Prediction | Verdict |
|---|---|---|
| 1 | No platform >5M MAU; cohort <1M MAU | **HELD** (only documented MAU in the niche: 350K) |
| 2 | Fanbase largest-claimed/unverifiable; BlackPlanet stays dead | **HELD** |
| 3 | ≥2 sunsets/acquisitions + ≥3 launches 2024–26 | **HELD** (5 dead + 1 acquisition; 10+ launches) |
| 4 | Cohort capital < $100M, crowdfunding-dominant | **HELD** (≈$27–35M, ~75%+ community capital) |
| 5 | Survivors monetize subs/payments, not ads | **PARTIALLY FAILS** — Spill is ad/partnership-funded (the informative exception; 07 L2 test in progress) |

## Table QC

`table_qc_folder.py` on final deliverables: **8 files, 37 tables, 306 rows, 0 structural issues** (final run 2026-09-23, after 07/README).

## Known gaps (consolidated)

Black Twitter "~5M" sizing primary · Spill MAU/waitlist + live-audio vendor (needs IPA inspection) · Fanbase: cumulative lifetime raise, burn (3 conflicting figures), 1.5 stack/store relaunch, paying-subscriber count · Byio registrations · BlackPlanet: May 15 2026 sunset sourced only from official social announcement (no press obituary); The Atlantic Apr 2024 retrospective unobtainable; 1999 stack undocumented · Blacksky Play data-safety labels + infra run-rate + blacksky.cash processor · commercial moderation-API subscale pricing · transparency reports/warrant canaries (none in niche) · BPM/Hornet/Taimi/HER current figures fallback-only · Pew 2023→2025 mode break (deltas directional) · faith-community comparables not covered.

## Reproducibility

Run dir `independent_research/scratch/research-black-social-nets-2026-09/` contains the driver scripts, search logs, and all fetched pages (A–F). Re-run `driver/search.mjs` queries are logged in `scratch/pages/search-*.md`; every digest cites its fetches. Total paid spend: **$0** (tavily free allowance only, ~578/1500 used at last observation).

