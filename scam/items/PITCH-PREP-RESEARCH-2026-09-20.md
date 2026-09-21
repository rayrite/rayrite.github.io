# Pitch prep — independent research & my take on the pre-build Q&A

**Event:** Venture 313 Buildathon Showcase · **Tuesday, September 22, 2026, 5–9 PM** *(official schedule — every prep doc says "Monday"; see A.1 for the correction and the Monday 8 AM submission deadline)* · J-Hub (Jefferson Hub), 950 Selden St, Detroit
**Written:** 2026-09-20 (two days out) · **Scope:** the pitch deck, the speech, and the six questions in `pre_build_QA.md`, each answered with fresh independent research plus a reality-check against the app that actually got built (`zai-demo-app-2026-09/`)
**Method:** official event page + slide template PDF read directly; five parallel research threads (event rules/prizes, past winners, fraud-statistic verification, competitive landscape + name collision, Detroit anchors); every load-bearing number checked against primary sources before being recommended for the stage. Claims I could not verify are flagged, not smoothed over.
**Companions:** `pre_build_QA.md` (the transcript) · `venture313-deck-content.md` (prior draft) · `venture313-qa-prep.md` (30 Q&A) · `venture313-presentation-mastery.md` (delivery guide) · `../zai-demo-app-2026-09/docs/USER-JOURNEYS-2026-09-20.md` (what the product actually does)

---

## Executive summary

1. **Urgent schedule correction (A.1):** the official schedule puts the Showcase on **Tuesday, Sep 22, 5–9 PM** — not Monday — and **Monday, Sep 21, 8:00 AM is the submission deadline** (2025's package required a ≤5-minute demo video, a usable project link, a repo, and a deck PDF — confirm what 2026 owes **first thing Monday**; tonight's demo-backup recording likely doubles as that submission).
2. **The single most important content finding is not from the web — it's in your own folder.** The four prep docs describe the product you planned in the pre-build conversation ("ScamShield Marketplace": SvelteKit + Fastify + Claude, 10-second SAFE/CAUTION/HIGH RISK/SCAM ALERT verdicts, 30-pattern library, $7.99/mo, browser extension roadmap). **What you actually built is a different, arguably stronger product**: a staged deep-research assistant (FastAPI + z.ai GLM-5.3/5.3-flash) covering scams, recalls, and dark patterns, with a **57-technique scam catalog** (count re-verified against the catalog file: 13 families, §4 header matches), gated multi-stage verification, cited evidence, and the three independent indicators (verdict · confidence · ripeness). The judges score "what you built" above everything except pillar relevance. **Pitch the product that exists.** Section F has the full reconciliation table; Section H has the corrected slide copy.
3. **The template rewards several things you already have — and the pillar phrasing needs one precision fix (A.3).** Verified from the template PDF: "Build to a pillar or you are out"; "Product is worth more points than any other category (other than pillar relevance)"; the Market slide's early-signal examples literally include "a waitlist" — and your landing page ships with one. Your 71-check verify suite and live end-to-end test report are buildathon-grade "signal" most civic pitches can't show. On naming: "Safe, Just & Thriving Neighborhoods" is the Buildathon's own challenge category (spell it exactly — verified), but it's a *merge* of two Rise Higher priorities ("Safe and Just Communities" + "Thriving Neighborhoods"). Attribute it as "aligned with Mayor Sheffield's Rise Higher framework," never as a verbatim framework pillar — and use the framework's own vision line ("resources and support… before challenges become crises") as your Slide 5 closer.
4. **Two stories are still the right hook — and the built product made the mother's story *on-product*.** The pre-build advice said her real-estate/webinar impersonation scam was off-product for a marketplace listing checker. That is no longer true: the built `/check` surface explicitly vets emails, posts/ads, and stores for brand-impersonation patterns (F3 fake stores & ad funnels — T-0302 brand-impersonation clone, T-0401 off-platform payment pressure). Her story is now a story the product could have screened. Say so — it converts the hook from emotional appeal to product demo.
5. **Fact-check is in (Section C): two claims must change, two got stronger.** The $2.1B Problem-slide number and "eightfold since 2020" are **verified verbatim** against the FTC's own April 2026 release — but the caption must say "scams that *started on social media*," not "marketplace fraud." **Refuted:** "$4,500 average vehicle-fraud loss" (BBB's real figure: $12,600 median — a *stronger* number against Detroit's ~$40K median income) and "160M US Marketplace users" (no source exists; use the verified 77.4% / ~491M pair). **Stronger when scoped:** Meta's own policy excludes vehicles, local pickups, P2P payments, and orders over $2,000 from Purchase Protection — deliver it as the exclusion list (never blanket "zero protection"; shipped checkout items are covered) — and a new FTC stat welds the hook to the data: **Facebook alone accounted for more fraud losses than text and email combined.**
6. **The "ScamShield" name collides with T-Mobile's Scam Shield — verified in USPTO's own search as a LIVE registered trademark (serial 90056826, in exactly the software/telecom classes you'd file in; Singapore's national ScamShield app is a second collision).** Still not a reason to rename before Tuesday — renaming under time pressure costs more than it protects, and the differentiator one-liner handles it (D.3). Do plan a rename before any public consumer launch.
7. **The demo must be re-choreographed for the real app.** The scripted "paste → SCAM ALERT in 8 seconds" flow doesn't exist. What exists is better theater if staged correctly: a zero-search **smoke-test snap verdict** (seconds, live), then a **pre-completed staged job** showing gates, coverage map, and the three indicators moving. Section I has the 2:30 choreography and the backup ladder (local server → recorded video → offline simulation).

---

## Section A — The event, verified

Verified against the official event microsite (events.techtowndetroit.org/Venture313Buildathon), the TechTown event listing, the City of Detroit's Rise Higher release, and the 2025 Devpost. The 7-min/3-min/7-slide format in your event email is used as the authoritative 2026 format (public pages don't publish it; it was announced at the kickoff you attended).

### A.1 ⚠️ Scheduling correction — read this first

The official schedule (verbatim from the event microsite):

| Day | Date | What happens |
|---|---|---|
| 1 | Thu Sep 17, 5:30–8 PM | Kickoff, rules and judging criteria, team formation |
| 2 | Fri Sep 18, 5:30–10:30 PM | Learn Day: workshops and tooling setup |
| 3 | Sat Sep 19, 10 AM–7 PM | Build Day with expert office hours |
| 4 | Sun Sep 20 | Remote — build on your own schedule |
| 5 | **Mon Sep 21** | **8:00 AM submission deadline** · finalists notified · pitch prep |
| 6 | **Tue Sep 22, 5–9 PM** | **Showcase: team pitches, judging, awards, reception. Open to guests & the public** |

Every prep document in this folder says the pitch is **Monday**. The official schedule says the Showcase is **Tuesday, September 22, 5:00–9:00 PM** — and September 22, 2026 *is* a Tuesday. Re-check your finalist email for your exact call time, but plan on **Tuesday evening**, and treat **Monday 8:00 AM as a hard submission deadline** you may still owe something to. The 2025 edition's submission package (best-available precedent) required: a **demo video ≤5 minutes ("no slide-only videos")**, a **usable project link**, a public repo with README, and a Round-2 pitch deck PDF. If 2026 mirrors it, you need that video *tonight* — conveniently the same recording that serves as your on-stage backup (Section I). Confirm the actual 2026 requirements against your kickoff materials Monday morning, first thing.

*(One social-media promotion says "Top 5 teams pitch live" — snippet-only, not on an official page. If the showcase really is five finalists, the room is small, the stakes concentrated, and a human 7 minutes matters even more.)*

### A.2 Event facts (verified)

- **Name:** Venture 313 Buildathon & Showcase, Sep 17–22, 2026 — the opening act of Detroit Homecoming week.
- **Venue:** J-Hub (Jefferson Hub), 950 Selden St, Detroit, MI 48201 — "All in-person days take place at J-Hub."
- **Prizes (both official pages agree on the line items):** $25,000 1st · $15,000 2nd · $10,000 3rd · $2,500 People's Choice — "a mix of cash and product development grants through Venture 313 and its partners." ⚠️ Both pages say "$50,000 total" while the line items sum to **$52,500** — don't say "total $50K" and the breakdown in the same breath; say "more than $50,000" or cite the breakdown alone.
- **Organizers/partners:** TechTown Detroit, Invest Detroit Ventures, Detroit Development Fund, Gilbert Family Foundation, City of Detroit. Sponsors include Google. Venture 313 itself is a $10M capital continuum (grants → equity → debt).
- **Eligibility vibe:** "No prior software experience is required… whether you're a coder, a designer, a student, or someone who's never written a line of code, there's a seat for you." Tools taught: Claude Code, Lovable, ChatGPT, GitHub, Vercel. (Implication for you: much of the field is first-time builders with scaffolded apps — a tested, verified product stands out. Section B.3.)
- **2026 judging rubric:** not published — announced at the Day-1 kickoff (which you attended; your email's 7/3 format is that announcement's format). The 2025 rubric is the best available signal of judge temperament: **Solving a User Need 50% · Design & Usability 20% · Technical Prowess 20% · Market & Viability 10%**, with a 2025 pitch format of "6-minute VC-style pitch & demo" + Q&A at judges' discretion.

### A.3 The "Rise Higher" framework — what it actually is, and how to name your category

This is the finding that changes slide wording. Verified against the City of Detroit's own materials:

- Rise Higher is **Mayor Mary Sheffield's resident-driven transition framework**: a survey of **9,190 responses across all 39 Detroit zip codes** (Jan 9–Mar 7, 2026), released June 15, 2026. Publisher: City of Detroit / Office of the Mayor. (risehigherdetroit.com + detroitmi.gov)
- The official term is **six priorities** — the phrase "Impact Pillars" is the template's shorthand, not the City's.
- The six priorities, verbatim: **Thriving Neighborhoods · Safe and Just Communities · Reliable Transportation and Sustainable Infrastructure · Equitable Economic and Workforce Development · Robust Education and Youth Opportunities · Open and Accessible Government.**
- **"Safe, Just & Thriving Neighborhoods" is not a verbatim framework priority.** It is a Buildathon challenge category that **merges two Rise Higher priorities** — "Thriving Neighborhoods" + "Safe and Just Communities." (Confirmed verbatim on the event microsite's category list — with exactly that spelling: comma after "Safe," ampersand, no "and.")

**How to use this without stepping on it:**

1. **On the slides, claim the category name verbatim** — "Safe, Just & Thriving Neighborhoods" — because that is the track judges score ("Adherence to your chosen pillar is a major judging criterion," per the event's official curriculum repo). Spelling verified; your Slide 1 box is already exact.
2. **In speech or Q&A, attribute honestly:** "the Buildathon's Safe, Just & Thriving Neighborhoods track — which maps to two of the six priorities in Mayor Sheffield's Rise Higher framework: Safe and Just Communities, and Thriving Neighborhoods." Sitting squarely inside *two* city priorities is a strength — say it as one.
3. **A gift for the pitch — the framework's own vision line** for Safe and Just Communities: *"Every Detroiter will have access to the resources and support they need before challenges become crises."* That is ScamShield's thesis, nearly verbatim: the check before the payment is the resource before the crisis. One sentence on Slide 5: "Rise Higher's own vision for safe and just communities — resources before challenges become crises. ScamShield is that, for fraud." Borrowing the city's own words is the strongest pillar-fit move available.
4. Don't conflate adjacent things if a judge name-drops them: the framework's six priorities are distinct from Sheffield's campaign "7 Pillars for Detroit's Way Forward" (Nov 2025) and from the Neighborhood Anchor Plan's three pillars (Stabilize, Strengthen, Grow).

### A.4 Gaps (flagged, not smoothed)

- Category count: the event microsite lists **5** challenge categories; the TechTown listing adds a 6th ("Future of Detroit: Physical AI, cross-border opportunity, the waterfront, sport, entertainment & media"). Unresolved which is final — irrelevant to you either way.
- "Third annual"? The official curriculum repo (Atomic Object) calls 2026 the "third annual" Buildathon, but no 2024 edition exists anywhere in the Devpost/TechTown/press record — Section B's finding stands (2025 was the first under this branding). Don't say "second annual" or "third annual" on stage; say "last year's winner" (verified) and stop there.
- 2026 judges' names: not published anywhere. 2025's panel (GM Ventures, Gilbert Family Foundation, Michigan Central, Just Air) suggests venture + civic + mobility backgrounds — expect user-need and viability questions more than deep-technical ones.
- Press coverage of either edition is thin — no Crain's/Model D/Detroit News feature found. The record is Devpost + organizer social + first-party sites.

**Sources:** events.techtowndetroit.org/Venture313Buildathon (schedule, venue, categories, prizes, eligibility — fetched 2026-09-20) · techtowndetroit.org/event/venture-313-buildathon-showcase (corroborating listing + 6th category) · risehigherdetroit.com + detroitmi.gov press release June 15, 2026 (framework, six priorities, vision line, survey size) · v313detroitbuildathon2025.devpost.com (2025 format + rubric + submission rules) · github.com/atomicobject/313Buildathon-Curriculum ("adherence to your chosen pillar is a major judging criterion"; the "third annual" outlier) · venture313.com / build313.ai (capital continuum, sponsors).

---

## Section B — Past winners: what actually won

**Headline: there is exactly one past edition — and its winner validates your whole strategy.** The Venture313 Buildathon **debuted in September 2025**; no 2024 or earlier edition exists (checked across Devpost, TechTown's site, and press). So "last year" = 2025, and your mastery-guide Q44 benchmark is **verified**: **Sha-Tera Mullen won 1st place in 2025, effectively solo, with 313SafeBeds** — a real-time Detroit emergency-shelter bed-availability platform. She was the sole listed team member on the official Devpost entry and describes herself as a self-taught builder turning lived experience (her own homelessness) into tech for social impact.

### B.1 The 2025 edition in brief

- **Format:** 7-day hybrid hackathon, Sept 19–25, 2025, during Mobility Tech Week (kickoff at TechTown; finale Sept 25). 92 registered participants.
- **Prize pool:** $17,500 — 1st $10,000 in TechTown Business Grants · 2nd $5,000 · 3rd $2,000 · Viewers Choice $500. (Do not confuse with this year's $50,000 pool — some aggregator pages blur them.)
- **2025 judging weights:** **Solving a User Need 50%** · Design & Usability 20% · Technical Prowess 20% · Market & Viability 10%. Panel: Stefon Crawford (GM Ventures), Brandi Brown (Gilbert Family Foundation), Myka Burley (Michigan Central), Derrick Kennedy (Just Air).
- **Results (organizer-official Instagram, corroborated by Devpost ribbons):** 1st — 313SafeBeds (Mullen) · 2nd — First Responder Drone Dispatcher with AI (Doshi/Jain) · 3rd — Pulse Drone Network (Shoyobo/Barksdale) · People's Choice — FODALO (affordable food delivery, 5-person team).

### B.2 Why they won — and the pattern that matters for you

*(analysis, labeled as such)*

Judging was half "Solving a User Need," and the results show it. 313SafeBeds nailed the top-weighted criterion three ways: a lived-experience founder, a **working product with real shelter data demoed live**, and a direct answer to a documented Detroit crisis (Detroit Free Press, Feb 2025: families waited an average of 130 days for shelter). She was also the **only solo builder among the four winners** — stage-ready and credible alone. Second and third place both hit public-safety/first-response themes; the audience-voted pick hit cost-of-living. The formula that beat bigger teams: **user need + Detroit impact + a working demo**, with technical prowess only 20% of the score.

That is your exact lane: a live product, a Detroit household-wealth crisis, a founder with lived experience, and (unlike any 2025 entrant could show) an automated 71-check verification suite.

### B.3 The aftermath — one cautionary, one encouraging

- **Cautionary:** of the four 2025 winners, **only the 1st-place, lived-experience founder converted the win into a running venture.** No public trace of the drone projects or FODALO post-Devpost was found. Winning isn't the goal; the week after is. (313SafeBeds' trajectory is the model: still operating, now tri-county, second prize at Detroit Development Fund's "Tech the Halls" Dec 2025, scaling toward statewide.)
- **Encouraging:** the 2026 field is *not* hardened competitors — "no experience required" is official, and the taught tools (Claude Code, Lovable, ChatGPT, GitHub, Vercel) suggest many entrants are first-time builders with scaffolded apps. A verified, tested, eight-surface product with a real research agent inside it stands out in that room.

### B.4 What this changes in your materials

1. **Q44 stays as drafted** — the benchmark line "Sha-Tera Mullen won last year solo" is verified true (2025, 1st place, solo entry). One caveat to hold in reserve: her About page now references a "313SafeBeds team," so say "won solo," not "runs it solo today."
2. **The prize IS on the table:** the 2026 edition carries **$25K / $15K / $10K + $2,500 People's Choice in cash + product-development grants** — see Section A for the "$50,000 total vs. $52,500 line items" inconsistency (say "more than $50,000"; never both numbers in one breath). This changes Slide 6's framing (Section H): the ask from the *room* is users and a partner intro; the ask of the *judges* is the build itself, which is what the money rewards.
3. **Weight your rehearsal where the 2025 judges weighted their scores:** user need and working product. The hook (need) and the demo (product) are exactly the two moments to over-prepare — which the time budget already does.
4. **People's Choice is decided by the room** — a crisp, human 7 minutes with a "her daughter is in this room" moment is precisely the kind of pitch that wins audience votes. Worth 30 seconds of thought on the closing line.

**Sources:** v313detroitbuildathon2025.devpost.com (official hackathon platform: format, prizes, criteria, gallery) · @venture313 Instagram, Sept 26, 2025 (organizer-official placements, corroborated by TechTown social) · 313safebeds.com + /about (first-party, accessed 2026-09-20) · techtowndetroit.org 2025 Impact Report · gilbertfamilyfoundation.org (Venture 313 launch, Sept 2022) · Detroit Free Press Feb 20, 2025 (shelter wait times). Press-coverage gap noted honestly: no Crain's/Model D/Axios coverage of the 2025 winners was found — the record is Devpost + organizer social + the winner's own site.

---

## Section C — Fact-check: every load-bearing number in the pitch

All nine load-bearing claims checked 2026-09-20 against primary sources — FTC's April 27, 2026 press release and data spotlight, the FTC Consumer Sentinel Data Book (PDF parsed locally), the FTC's March 25, 2026 JEC testimony (PDF parsed locally), both IC3 annual reports (PDFs parsed locally), **Meta's Purchase Protection page captured verbatim**, BBB's Oct 2024 study, and Cox Automotive. The two refutations have drop-in replacements; one claim is true *when scoped*. The verbatim-extracted primary texts (`databook2024.txt`, `jec2026.txt`, `ic32024.txt`, `ic32025.txt`) are saved in this session's `tool-results/` folder if you want exact re-quotes.

### C.1 The verdict table

| # | Claim (as drafted) | Verdict | What's actually true | Safe on-stage phrasing |
|---|---|---|---|---|
| 1 | "$2.1 billion in 2025 social-media **marketplace** fraud losses" | ✅ number VERIFIED · ⚠️ caption wrong | FTC: **$2.1B reported losses to scams that started on social media, 2025** — the breakout is by *origin platform*, no marketplace split. Full series: $261M (2020) → $789M → $1.2B → $1.5B → $1.9B (2024) → $2.1B. Social media was the **costliest contact method** of 2025; **Facebook was the #1 platform — Facebook losses alone exceeded text and email combined**; shopping scams most-reported type (40%+ of loss reports began with an ad), investment scams largest by dollars ($1.1B) | "Americans reported losing $2.1 billion last year to scams that started on social media — the costliest way scammers reach us, per the FTC's own data released this April. And those are just the losses people reported." |
| 2 | "An eightfold increase since 2020" | ✅ VERIFIED verbatim | The FTC spotlight's own headline: "eight times higher than in 2020." $261M → $2.1B = 8.05×. ⚠️ Only works with the **2020 anchor** (vs 2024 it's 7.3×) — keep "since 2020" in the sentence | "The FTC says reported losses to social-media scams are eight times higher than in 2020" |
| 3 | "$4,500 average vehicle-fraud loss" | ❌ REFUTED | $4,500 traces to a misremembered BBB Risk Report median from an *unrelated* category. Real figure: **$12,600 median loss** in vehicle sale/escrow scams (BBB Institute, Oct 2024 — Scam Tracker 2021–2023, ~209 reports: small sample, attribute to "BBB investigators"). No mean-based primary figure exists | "When a fake-listing car scam hits, it hits hard: BBB's investigators found a median loss of $12,600 per victim" |
| 4 | "40,000+ vehicle fraud complaints to FTC/FBI in 2024" | ⚠️ MIXED — real counts, wrong number | FTC Sentinel 2024: **Used Auto Sales 53,650** · New Auto Sales 51,846 (≈105,500 combined) · **Auto-Related 197,015** (rank 4 of all categories). These are *consumer complaints* (incl. lemon/dealer disputes), not adjudicated fraud. BBB logged only ~700 virtual-vehicle scam reports 2021–2023 — because almost nobody reports (#7). IC3 has no vehicle category at all | "The FTC logged more than 53,000 used-vehicle-sale consumer complaints last year — over 105,000 counting new-car sales, nearly 200,000 auto-related in total" |
| 5 | "5 million US buyers purchase used vehicles through online platforms annually" | ❌ NO SOURCE FOUND | Cox Automotive / CarMax 10-K: **~38M** US used sales in 2024 (~20M dealer retail, **~17–18M private-party**). Cox Car Buyer Journey (Jan 2026): 91% do some/all steps online, only **7% buy entirely online**. Meta newsroom (Nov 2025): vehicles are a **top-five Marketplace search for young adults** | "About 38 million used vehicles change hands in America every year — roughly 17 to 18 million of them private-party deals, the kind done through Marketplace and Craigslist, where no dealer regulator is watching" |
| 6 | "Facebook Marketplace offers effectively zero buyer protection" | ⚠️ TRUE WHEN SCOPED — blanket version overstated | Shipped items paid via Facebook checkout **are** covered. Meta's own page excludes: **vehicles and rentals · local pickups (the dominant Marketplace mode) · P2P payments (Venmo/PayPal/Messenger — Zelle isn't even offered) · orders over $2,000**. For the transactions ScamShield covers, there is no Meta safety net | "Meta's policy blacklists vehicles, local pickups, and peer-to-peer payments from Purchase Protection — which describes essentially every used-car transaction on the platform. For the deals people actually do on Marketplace, there is no Meta safety net" |
| 7 | "Only 4.8% of fraud victims report" | ✅ VERIFIED | 4.8% complained to a BBB **or** government entity (mass-market fraud overall) — Anderson, May 2021, SSRN 3852323, cited verbatim by the FTC in its Mar 2026 JEC testimony and Apr 2026 spotlight. 1/0.048 ≈ 21×; the FTC's own adjusted estimate: 2024 true losses **up to $195.9B** vs $12.5B reported (~16×) — *Protecting Older Consumers* (Dec 2025). Defensible range: **15–20×** | "Research the FTC itself cites finds only 4.8% of fraud victims ever complain to the BBB or any government agency. The FTC's own estimate puts real 2024 losses at up to $196 billion versus $12.5 billion reported" |
| 8 | "160M US Facebook Marketplace users" | ❌ REFUTED | No US count exists in any Meta disclosure (10-Ks report DAU/MAU only). Last official global figure: **1B+ monthly** (2021, still the benchmark). Only US-flavored official datum: **1 in 4 US/Canada young-adult daily users visit Marketplace daily** (Meta newsroom, Nov 13, 2025) | "More than a billion people use Facebook Marketplace every month — Meta's own last official count — and a quarter of Facebook's young-adult daily users in the US and Canada check it every single day." Never attach a US user count |
| 9 | Pig-butchering context (founder story) | ✅ VERIFIED | FTC totals: $12.5B (2024, 2.6M reports, $497 median) → **$15.9B (2025, 3M reports)**; 2025 investment scams >$7.9B ≈ half of all reported losses. IC3: $16.6B (2024, 859,532 complaints) → **$20.9B (2025, 1,008,597)**; crypto investment fraud — IC3's own "pig butchering" category — **$5.8B → $7.2B**, the single largest US loss source in 2025; Americans 60+ lost ~$7.7B (+37%). ~60% of 2025 romance-loss reports started on social media | "The single biggest driver is crypto 'pig butchering' investment scams — $5.8 billion in 2024, $7.2 billion in 2025, in the FBI's own count" |

### C.2 The two numbers that must change (drop-in replacements)

- **$4,500 → $12,600 (BBB Institute, Oct 2024).** The median loss in fraudulent vehicle sale and escrow scams — the exact scam family ScamShield targets. Caveat to carry: small sample (Scam Tracker 2021–2023, ~209 reports), so attribute it as "BBB's investigators found" rather than as a census. Still a *stronger* number for the argument: against Detroit's ~$40,000 median household income (E.1), a median vehicle scam costs **nearly a third of a year's income**. The old sentence was "catastrophic"; the new one is arithmetic.
- **160M users → verified usage figures only.** No US count exists in any Meta disclosure. Options, all sourced: **1B+ monthly users worldwide** (Meta's last official figure) · **1 in 4 US/Canada young-adult daily users visit Marketplace daily** (Meta newsroom, Nov 2025) · E.1's pair (77.4% of recent Facebook shoppers bought via Marketplace; ~491M log in to shop it) — or no number; the Thriving block's money-circulates-locally argument doesn't need a user count.

### C.3 Three findings that got STRONGER under verification

- **The Meta exclusion list (scoped).** Captured verbatim from Meta's own help page: Purchase Protection excludes vehicles and rentals, local pickups, peer-to-peer payments, and orders over $2,000. Read that list aloud on stage — every exclusion is a line item of the typical Detroit Marketplace car deal. One discipline: **say it as the exclusion list, never as blanket "zero protection"** (shipped checkout purchases are covered; the scoped version is airtight, the blanket is refutable). Zelle isn't even an offered payment — worth a beat of silence.
- **The platform-concentration stat — new, and it's your Slide 2 second line.** In the FTC's 2025 data, **Facebook was the #1 fraud-loss platform — losses on Facebook alone exceeded text and email combined.** One sentence, FTC-sourced, and it lands the hook story ("a message on Facebook") directly onto the worst platform in the federal count.
- **The underreporting multiplier.** The 4.8% reporting rate (Anderson 2021) is the number the FTC itself cites — twice in 2026 (JEC testimony and the April spotlight). The FTC's own adjusted estimate: 2024 true losses up to **$195.9B** vs $12.5B reported (~16×); the survey math implies ~21×. Say the range: **"15 to 20 times."** If a judge says "$2.1B sounds small," the answer is one sentence: *that's what got reported*.

### C.4 The verified numbers bank (for Q&A)

- FTC total reported fraud losses: **$12.5B (2024 · 2.6M reports · $497 median) → $15.9B (2025 · 3M reports)**. 2025 investment scams >$7.9B ≈ half of all reported losses.
- IC3 internet-crime losses: **$16.6B (2024 · 859,532 complaints) → $20.9B (2025 · 1,008,597)** — cyber-enabled fraud is 85% of the 2025 total.
- IC3 crypto investment fraud — IC3's own "pig butchering" category: **$5.8B (2024) → $7.2B (2025)**, the single largest US loss source in 2025. Operation Level Up (2024): of 4,323 pig-butchering victims the FBI notified, **76% didn't know they were being scammed**.
- Social-media-origin scam losses: **$261M (2020) → $789M → $1.2B → $1.5B → $1.9B (2024) → $2.1B (2025)**. Facebook #1 platform; shopping most-reported type; investment largest by dollars.
- Romance scams: **~$1.16B (2025)**, ~60% of romance-loss reports starting on social media — the founder-story lane, now sourced.
- FTC auto complaints 2024: **Used Auto Sales 53,650 · +New Auto Sales ≈ 105,500 · Auto-Related 197,015** — "consumer complaints," not adjudicated fraud.
- Cox: **~38M** used sales/yr · **~17–18M private-party** · 91% shop some/all steps online · 7% buy entirely online. Meta: vehicles are a **top-five Marketplace search for young adults**.
- Michigan (E.4): 53,351 fraud reports · $204M losses · **$350 median** (2024 Sentinel).

### C.5 What changes in the deck

1. **Slide 2 big number: $2.1B — keep it, fix the caption:** "reported losses to scams that started on social media, 2025 (FTC)." Never "marketplace fraud" — the FTC's split is by origin platform. Keep "eightfold since 2020" (it's the FTC's own headline; keep the 2020 anchor in the sentence or the math breaks).
2. **Slide 2 supporting lines:** replace "offers effectively zero buyer protection" with the exclusion-list version (C.3), and consider adding the concentration stat — "Facebook alone accounted for more losses than text and email combined (FTC, 2025)" — which welds the hook story to the federal count.
3. **Everywhere $4,500 appears** (Slide 5 anchors, JUST block, Q&A answers): swap to **$12,600 median, "BBB investigators," Oct 2024** and recompute the income ratio — nearly a third of Detroit's median annual income.
4. **Slide 5 Thriving block:** drop 160M; use "a billion people use Marketplace monthly — and a quarter of young-adult daily users in the US and Canada check it every day" or E.1's pair.
5. **Slide 6 SIZE column:** "53,650 used-vehicle-sale consumer complaints to the FTC in 2024 · ~38M US used-vehicle sales a year, roughly half private-party (Cox)" — drop the 5M-buyers claim. Say "consumer complaints," never "fraud complaints."

**Sources:** ftc.gov/news-events/news/press-releases/2026/04/new-ftc-data-show-people-have-lost-billions-social-media-scams + companion data spotlight (both Apr 27, 2026; corroborated by TechCrunch same day) · ftc.gov Consumer Sentinel Network Data Book 2024 (PDF, parsed) · ftc.gov JEC testimony "The Rising Scam Economy," Mar 25, 2026 (PDF, parsed) · ftc.gov *Protecting Older Consumers 2024–2025*, Dec 1, 2025 (the $195.9B estimate) · Anderson, "To Whom Do Victims of Mass-Market Consumer Fraud Complain?", SSRN 3852323 (May 2021) · ic3.gov Annual Reports 2024 & 2025 (PDFs, parsed) · facebook.com/help/228307904608701 + facebook.com/policies/purchase_protection (captured verbatim) · bbb.org/article/news-releases/30069 (Oct 15, 2024) · Cox Automotive / CarMax FY25 10-K / Cox Car Buyer Journey 16th ed. (Jan 13, 2026 — PR URL via coxautoinc.com) · about.fb.com/news/2025/11/facebook-marketplace-gets-a-glow-up (Nov 13, 2025). All accessed 2026-09-20. Known URL gaps: the FTC 2025 Data Book landing page and the Cox PR Newswire link weren't captured — the figures ride on the FTC testimony PDF and multiple independent reports; grab the Cox URL from coxautoinc.com before printing footnotes.

---

## Section D — Competitive gap & the name

### D.1 The landscape (verified 2026-09-20)

**Free big-brand checkers — the "why not just ask a chatbot" space is crowded:**

| Tool | What it does | What it doesn't do |
|---|---|---|
| Bitdefender Scamio | Free AI chatbot; paste texts/emails/links/QR/images → assessment | No citations, no marketplace specialization, no indicators |
| Norton Genie (Gen Digital) | Free AI scam detector for texts/emails/links/posts (since Jul 2023) | Assessment only — no sources, no listing-level verdicts |
| F-Secure checker suite | Free single-input tools (link / shopping-store / SMS checkers) | Domain-level, one input per tool |
| McAfee + Anthropic | Markets a Claude-powered "Is This a Scam?" check (links, messages, screenshots) | Same shape: verdict without an evidence trail |
| ScamAdviser (~4.5M users/mo) | Algorithmic domain trust score from ~40 sources | Domains only — not listings, messages, or evidence |
| Google (on-device) | Chrome/Messages/Phone AI scam detection (2025) | Passive in-flow, not on-demand paste-and-check |

**Platform-side:** eBay and Facebook run in-platform AI listing review (which scammers game); OfferUp ships an in-app Scam Detector for pasted messages — all post-hoc or locked inside one platform.

**Funded startup:** Scamnetic (Tampa) — ~$16M raised including a $13M Series A (2025), patent-pending detection, enterprise-embed focus, and a live USPTO filing for "SCAM INTERVENTION." The space is being invested in.

**The close comparables — the reason the literal gap claim dies:**

- **Starling Bank "Scam Intelligence" (UK, Oct 27, 2025)** — the strongest counterexample: customers upload screenshots of marketplace listings and seller messages from Facebook Marketplace, eBay, Vinted, Etsy and get an instant pre-purchase fraud assessment, built on Gemini. **But:** UK-only, Starling-customers-only, bank-embedded, no cited evidence, no confidence/ripeness split. (Multi-source: Starling's launch page + The Guardian + Yahoo Finance UK.)
- **Scamanot.com "Marketplace Seller Investigator"** — paste a FB Marketplace/Craigslist deal → three-level verdict with red-flag explanations; $9/mo tier; "Powered by Claude AI"; no citations. (Single-source; traction unproven.)
- **CarBluff** (iOS, Aug 2026) — used-car listing → 0–100 score + NHTSA recall check (overlaps your recall surface); cars only. **DealFlipAI** — FB Marketplace deal scanner, $14.99–49/mo, explicitly "does not verify sellers." **isthisascam.to** — paste scanner over threat databases + Claude analysis; not marketplace-specific. (All single-source, tiny/new.)

### D.2 The gap claim — verdict and the rewording it forces

**"No cross-platform, pre-purchase AI fraud verdict tool exists" is FALSE as a literal statement.** Starling ships it in the UK; Scamanot/CarBluff/DealFlip do pieces of it in the US. If a judge knows Starling (or Googles you mid-pitch), the literal claim burns credibility.

**It remains true — and is actually stronger — for the specific combination you deliver:** a **standalone** (not bank/carrier/platform-embedded), **US-available**, **cross-platform** tool returning a **cited-evidence** verdict with **separate confidence and ripeness indicators**. Nothing found does that; no competitor uses anything comparable to ripeness at all.

**Reworded lines for the deck (replace the current ones):**

- Slide 2: *"Free checkers look at links. Platforms protect their own. A UK bank ships listing checks — for its own customers, inside its app. Nobody has built the standalone, US version: a cross-platform check that returns a cited verdict before the money moves. Until now."*
- Slide 3 bottom line: *"Existing tools return an assessment. ScamShield returns an audit trail — cited sources, coverage map, confidence and ripeness — before the money moves."*

**And the strategic upside — use the competition as validation, not threat:** in Q&A, "doesn't Bitdefender/McAfee/Norton already do this?" answers itself ("they give you an answer; we give you an audit trail"), and Starling is your *market proof*: one of the UK's most aggressive anti-scam banks decided this exact capability was worth shipping in October 2025. Banks validate; they don't serve non-customers, the US market, or anyone who wants evidence. That's the wedge.

### D.3 The name — more serious than the prep docs assumed, still not a Tuesday problem

Verified in USPTO's official search (2026-09-20):

- **"SCAMSHIELD" (one word) is a LIVE, REGISTERED T-Mobile USA trademark** — serial 90056826, classes IC 009 (downloadable screening/blocking software) + IC 038 (telecom). Those are exactly the classes a consumer scam-check app files in.
- The two-word **"SCAM SHIELD"** is separately registered (apparel/awareness, serial 99280890).
- **Singapore's national ScamShield app** (Police Force + National Crime Prevention Council) is a second, government-grade collision for any global ambition.
- T-Mobile's Scam Shield blocked 19.8B calls in 2023 and is heavily advertised — **judges will know the name. Expect "how is this different from T-Mobile's Scam Shield?"** Have the one-liner ready: *"T-Mobile's Scam Shield blocks calls and texts at the network level. ScamShield researches the deal in front of you — marketplace listings, sellers, emails — and returns a cited verdict before money moves. Different problem, different layer."*

**Recommendation stands, now with verified reasoning:** keep the name for Tuesday (a local demo has negligible legal exposure; renaming under time pressure costs more than it protects), and **plan to rename before any public consumer launch** — the live registration blocks or complicates your own filing and invites a cease-and-desist, and app-store/search discoverability is dominated by T-Mobile and Singapore. For Tuesday, keep the differentiation *verbal* (the Q&A one-liner above); don't print "not affiliated with T-Mobile" on a slide — it reads as defensive. If any press or public artifact follows the pitch, add the disclaimer there.

### D.4 Gaps, flagged

Single-source items (existence real, traction unproven): Scamanot, DealFlipAI, isthisascam.to, CarBluff. T-Mobile's USPTO registration *number* wasn't captured (serial, owner, classes, and LIVE status were confirmed in the official search UI; the detail page wouldn't render) — treat as effectively single-verified. "No competitor uses ripeness" is absence of evidence, not proof — but nothing found even gestures at cost-of-more-research as a user-facing signal, which keeps it a fair differentiator claim on stage.

**Sources:** scamadviser.com · bitdefender.com/consumer/scamio · f-secure.com (checker suite) · us.norton.com (Genie) · mcafee.com (Claude integration page; ZDNET Jan 6 2025; CNET May 14 2025) · blog.google (May 8 & Sep 18, 2025) · bbb.org/scamtracker · scamnetic.com + USPTO tmsearch (serial 99065303) · starlingbank.com/news/scam-intelligence-launch + The Guardian + Yahoo Finance UK (all Oct 27, 2025) · scamanot.com · dealflip.ai · isthisascam.to · apps.apple.com (CarBluff, id 6796525289) · t-mobile.com/scamshield + T-Mobile launch press (Jul 16, 2020) · tmsearch.uspto.gov (SCAMSHIELD serial 90056826; SCAM SHIELD serial 99280890) · scamshield.gov.sg + ncpc.org.sg. All accessed 2026-09-20.

---

## Section E — Detroit anchors

All verified 2026-09-20 against Census/ACS, the Michigan AG's own pages, and dated local press.

### E.1 The numbers that ground "hits harder here" (two corrections)

- **Median household income: about $40,000** — $39,938 (ACS 2020–2024 five-year) or $39,209 (2024 one-year, ±$2,683). The prep docs' "$35K" is stale; the safe phrasing is *"about $40,000 — roughly half the state median"* (Michigan $69,183 · US $77,719). Against the BBB's **$12,600 median vehicle-scam loss** (Section C.3), one scam costs **nearly a third** of a median Detroit household's *annual* income — that's the sentence, with honest numbers on both sides.
- **Nearly a third of Detroit households — 30.9% (82,754 of 268,048) — had no vehicle available in 2024**, including a majority of renter households. If any prep line says "1 in 4," update it. For a household that owns one vehicle, that vehicle *is* the commute (two-thirds of Detroit workers drive alone); losing it to fraud isn't a bad purchase, it's a job at risk. This is the strongest "vehicle fraud hurts differently here" argument — and it's Census-verified.
- Marketplace context: 77.4% of recent Facebook shoppers bought via Marketplace; ~491M people log into Facebook specifically to shop it (Capital One Shopping research, Sep 2026); 1.1B Marketplace users per CNBC (Mar 2025 — re-locate the URL before print). No Detroit-specific Marketplace usage stat exists — don't imply one.

### E.2 The Michigan AG anchor — ask phrasing confirmed, and a gift

- The unit is the **Consumer Protection Team** (the AG's own materials: "reviews every single complaint"; the page also says "Division" in places — "Consumer Protection Team" is the safer spoken name). Your drafted ask — "an introduction to the Michigan AG's Consumer Protection Team" — uses the right name.
- Scale: ~10,000 written complaints + 20,000+ calls per year; ~$1.9M recouped for consumers in 2024. Complaints are filed at michigan.gov/ag/consumer-protection (online portal) and become public record.
- **The gift: on Oct 15, 2025, AG Nessel reissued a consumer alert after Michigan marketplace sellers were defrauded with prop money (motion-picture currency) in in-person sales — explicitly including Facebook Marketplace.** The AG is *already fighting C2C marketplace fraud*; ScamShield routes reports to a team already engaged. One line for Slide 5 or the ask: *"The Attorney General's consumer team is already warning Michigan sellers about marketplace fraud — ScamShield is the tool that catches it before the meetup."*
- Routing nuance for Q&A: fraud by licensed used-car **dealers** → Secretary of State's Regulatory Monitoring Division; **private-sale / C2C marketplace fraud** → AG Consumer Protection. Your product targets the latter — say so if a judge probes "isn't that the SOS's job?"

### E.3 Citable local cases (with an honesty guardrail)

- **Livonia, sentenced Apr 21, 2026:** a 19-year-old stole $1,300 during a Facebook Marketplace phone sale *in the parking lot of the Livonia police station* — charged Feb 2026, sentenced to probation + community service. The pitch-perfect case: **even a police-station safe-exchange zone didn't prevent it — because the risk isn't the location, it's the counterparty.** That's your SAFE-block sentence: screen the counterparty, not just the parking lot. (ClickOnDetroit, Apr 21, 2026.)
- **The Brogdon case (conviction Apr 2026, life sentence May 2026):** a 29-year-old Detroit man murdered a seller during a July 2024 Facebook Marketplace sale of Corvette seats — use only with the geography-honest phrasing: the sale and killing were in **Fenton Township** (Genesee County, ~60 miles out); the *perpetrator* was a Detroiter. Say "a Detroit man was convicted this year of murdering a seller during a Marketplace sale," never "in Detroit." If that nuance feels too fine to manage on stage, use the Livonia case alone — it's cleaner and metro-local.
- Unverified-but-surfaced (check before citing): Redford Township attempted armed robbery from a Marketplace meetup (Mar 2025); a Jan 2025 arrest for multiple armed robberies including a Marketplace meetup; 2023 Wayne County charges in a $38K gunpoint Marketplace robbery.

### E.4 Michigan fraud numbers (basis-labeled — pick one basis and say it)

- **2024, FTC Sentinel, fraud-only basis: 53,351 fraud reports · $204,033,291 reported losses · $350 median loss** (Michigan Legal News, Mar 13, 2025, citing the FTC Data Book). AARP Michigan confirms the $204M figure.
- The same year shows **117,326** reports if you count *all* FTC report categories — if you quote a count, label the basis ("53,000 fraud reports" is the fraud-only number; don't mix).
- 2025 press coverage puts Michigan's losses around $241.7M (Patch, URL not retained — re-verify before print). Statewide basis: attribute to **"Michigan,"** not "Detroit" — no Detroit-MSA-specific Sentinel number is quotable outside the FTC's interactive appendix.

### E.5 AARP & the elder-fraud infrastructure (for the older-buyers Q&A)

AARP Michigan's fraud page (updated May 2026) carries the $204M figure and runs the **Fraud Watch Network Helpline (877-908-3360)** — a natural future partner named in your prep docs. The AG's **Elder Abuse Task Force** (55+ organizations since 2019) produced the Financial Exploitation Prevention Act requiring financial institutions to flag fraud — evidence the state's elder-fraud machinery is real and receptive. AARP held a free shred day in Detroit June 13, 2026 — the org is active in the city.

### E.6 What changes in the deck

1. Replace "$35K median income" with **"about $40,000 — roughly half the state median"** (Slide 5 JUST block + any Q&A usage).
2. Replace any "1 in 4 households without a car" with **"nearly a third"** (30.9%, ACS 2024) — and consider making that the *lead* statistic of the vehicle-fraud-hurts-differently argument, since it's the most Detroit-specific verified number you own.
3. Slide 5 anchors: AG Consumer Protection Team (name confirmed) + the Oct 2025 prop-money alert + the Livonia safe-exchange case.
4. If Slide 2 or 6 uses a Michigan fraud number, use the basis-labeled 2024 set (53,351 reports / $204M / $350 median) — the $350 median is a quietly devastating number next to the BBB's $12,600 median vehicle-scam loss (Section C).

**Sources:** census.gov QuickFacts (Detroit, vintage 2020–2024) · Census Reporter (ACS 2024 1-year: B19013 income, B25044 vehicles, B08301 commuting) · datausa.io (state/US income context) · fhwa.dot.gov MV-1 (Michigan registrations) · coxautoinc.com/market-insights (used-vehicle sales) · capitaloneshopping.com research (Marketplace stats, Sep 2026) · michigan.gov/ag/consumer-protection + AG press releases (Mar 3, 2025 complaints; Oct 15, 2025 prop-money alert; May 14, 2026 settlement) · michigan.gov/sos (dealer-fraud routing) · ClickOnDetroit (Apr 21, 2026, Livonia) · CBS News Detroit (Apr 24, 2026, Brogdon conviction) · Michigan Legal News (Mar 13, 2025, Sentinel 2024) · aarp.org/states/michigan/fraud (May 2026) · michigan.gov/ag elder-abuse task-force page.

---

## Section F — Product reality reconciliation (the prep docs vs what you built)

This is the section to read twice. The pitch materials were written **before** the build, describing the planned product. The demo on Tuesday must match the product that exists. Judges will see the app.

### F.1 Claim-by-claim reconciliation

| Deck / Q&A claim (pre-build) | What the built app actually does | Action for the deck |
|---|---|---|
| Name: "ScamShield Marketplace" | The product is **ScamShield** — marketplace/store checks are one surface of a broader scam / recall / dark-pattern research assistant | Drop "Marketplace" from the title; "Marketplace" undersells what shipped and invites "is it FB-only?" questions |
| "Paste a listing. In under ten seconds… verdict: Safe, Caution, High Risk, or Scam Alert" | Two real paths: **smoke-test snap verdict** (zero searches, seconds, for decisive tells) and **staged research** (gated stages, minutes, cited evidence) | Sell the two-tier design *as the design*: "instant tells in seconds; when seconds can't decide, staged research with cited evidence — and you decide if the next stage is worth running" |
| Verdict pills SAFE · CAUTION · HIGH RISK · SCAM ALERT | 🟢 no adverse findings · 🟡 caution · 🟠 multiple red flags · 🔴 scam pattern match — **plus confidence and ripeness as separate indicators** | Update Slide 3 pills; add the three-indicator line — it's your most differentiated UI and no competitor shows it |
| "30 documented scam patterns" | **57 documented scam techniques in 13 families** with stable IDs (T-0401 off-platform payment pressure…) in the check-v2 technique catalog, + 2 research wikis | Say 57. Bigger, verifiable, and mapped to IDs in the UI |
| "Claude Sonnet" / "Gemini Vision" / "SvelteKit + Fastify" | **z.ai GLM-5.3-flash** (vision intake) + **GLM-5.3** (staged reasoning, forced thinking) on a **FastAPI** backend; vanilla-JS front end; one JSON design language themes everything | Never put a vendor name on a slide you can't show. "Fast two-model pipeline: a vision model reads screenshots, a reasoning model runs staged web-grounded research" — true, vendor-agnostic, defensible in Q&A |
| "eBay has Money Back Guarantee; Facebook Marketplace has nothing" | Still the sharpest framing line — and now *documentable from Meta's own help page* (Purchase Protection excludes vehicles, local pickups, P2P payments, >$2,000 orders — Section C.3) | Keep — and cite Meta's exclusion list when you say it |
| "5 free checks, $7.99/mo, B2B API" | Not built; the app ships a **waitlist**. Pricing is intent, not feature | Move pricing to "sustainability model under evaluation"; the waitlist IS the template's "early signal" — lead with it |
| "50 real listings QA'd, <5% false-positive target" | What exists: **71-check verify suite** (50/50 non-credit checks pass against a live server), smoke-test ALL PASS, a live z.ai end-to-end test report (38/38 effective), Range-verified video streaming | Replace the false-positive claim with the real QA story: "the app ships with an automated 71-check verification suite" — honest and unusually strong for a buildathon |
| "Images never stored, buffer nulled" | **Not true of the built app.** `/check` jobs persist uploaded images in the server-side job record so multi-stage jobs can resume across gates; the API strips raw images from all responses (jobs.py: `public_view`) | Do not claim "never stored" on stage. Honest answer: "images persist server-side in the job record so a gated investigation can resume; they are never returned by the API or shown to anyone else" |
| "Browser extension next (Chrome+Firefox badge)" | Not built (and the Q&A file's HiQ-based legality answer is dated — extension law moved after 2022) | Keep as roadmap but soften: "next: meet buyers where they browse" without a legal-defense commitment |
| "VIN check integration; rental category Phase 2" | Not built. The **recall** surface (FDA/FSIS/CPSC/NHTSA routing) *is* built and NHTSA is the vehicle-recall agency — a neat bridge | Reframe roadmap: "vehicle history (VIN/NHTSA) layer" rides the routing that already exists |
| "Pattern library lookup fallback if the model API is down" | The app has an honest **demo mode** (no API key → clearly-labeled canned replies) — a graceful degradation you can *show* | Use as the ops-risk answer (replaces Q23's old answer) |

### F.2 What the built product has that the pre-build pitch never claimed

These are the upgrades — none of them are in the current deck:

- **Three independent indicators** (verdict · confidence · ripeness), stated as a contract in every research surface. The independence is the point: a 🔴 verdict with Medium confidence and 🟢 ripeness means *act now, verifying will pay* — a state a single score hides. This is your strongest "different from what exists" answer on the Solution slide, and the template explicitly asks "Is it different from what already exists?"
- **Gates.** Every stage ends with a plan and a decision — the user, not the agent, decides whether more research is worth running. That's a cost-discipline and trust story no chatbot demo in the room will match.
- **Coverage map + honesty rules.** "No adverse record found" is always paired with what was checked; absence is never sold as safety; gray zones (dropship delays ≠ fraud) are honored. For a *justice-pillar* pitch, due-process engineering is a feature — see Q3 below.
- **Recall checks with federal-agency routing** (FDA/FSIS/CPSC/NHTSA/CDC layers). A household-safety feature beyond marketplace fraud — widens the "Safe" pillar argument to food and product recalls.
- **Learning center wikis + theme editor + app library + video hosting** — an eight-surface product, solo-built, all verified by an automated suite.
- **A waitlist with count-only API** (addresses never leave the server) — privacy posture you can state factually.

### F.3 Naming decision (recommendation)

Keep **ScamShield** for the Tuesday showcase. Reasons: (1) two days is no time to re-brand slides, demo, and muscle memory; (2) the collision is in a different lane — T-Mobile's mark covers network-level call/text blocking, not consumer research tools — but it IS a live registration in exactly the software/telecom classes you'd file in (D.3: serial 90056826, IC 009 + 038), with Singapore's national ScamShield app as a second collision; (3) your Q9 answer already handles it honestly. Posture sentence for Q&A: "the name is pre-trademark-search; if the product goes to market, it goes under whatever name clears — the product doesn't depend on the name." **Plan the rename before any public consumer launch** — app-store and search discoverability is dominated by T-Mobile and Singapore regardless of legal risk.

---

## Section G — My take on each question in `pre_build_QA.md`

Six questions were asked before the build. Here is my independent take on each, informed by fresh research and by the product that now exists.

### Q1 — Using the staff member's mother's story as the "her daughter is in this room" hook

**Prior advice (one line):** yes, use it; keep her story (on-product) and the founder's pig-butchering story (credibility) in separate lanes; rehearse the 3-second pause; confirm consent the morning of.

**My take:** Keep the hook — it is structurally sound and the strongest opening available — with three updates:

1. **The lane separation is now obsolete, and that's an upgrade.** The pre-build answer warned the mother's story wasn't a marketplace-listing scam, so don't imply the product would have caught it. The built `/check` skill's subject list is literally: product listing, website/store, social post/ad, **suspicious email**, online seller — with an impersonation check line (C8) and brand-impersonation technique families. A Facebook message impersonating a real-estate company to sell webinar access is squarely in scope; the smoke test's decisive-tell list (sender-identity failure, brand-clone domains, payment-first funnels) is built for exactly that material. You can now say, honestly: *"That message is the kind of thing ScamShield screens — paste it, and the impersonation tells surface in seconds."* One sentence, and the hook stops being only emotional.
2. **Keep the two-victim structure and the restraint notes.** Research on fraud prevalence supports the pattern you're asserting: social platforms are the leading contact method for reported fraud, shopping/marketplace schemes are the most-reported fraud type, and investment/romance "pig-butchering" schemes are the highest-loss category (verified figures in Section C). "Same platform, two lanes, both documented at national scale" is statistically true, not anecdotal.
3. **Two ethic guardrails to keep non-negotiable** (they were right in the prior advice): consent re-confirmed the morning of with the exact language you'll use; and never name the impersonated real company (the scammer misused *their* identity too — fairness cuts both ways). If either wobbles, fall back to the compressed version that says "a family connected to this room."

The delivery mechanics (slower than comfortable, drop your voice on the reveal, don't look at her, one number only, beat → straight to the screen) are consistent with everything credible on pitch delivery; keep them as written in `venture313-presentation-mastery.md`.

### Q2 — Template pointers & best practices (7 min, 7 slides, live demo)

**Prior advice:** time budget 20/90/60/150/50/30 = 6:40 with buffer; slide-by-slide pointers; solo framing as the flex; demo guidance.

**My take:** The time budget is right and matches the template's weightings — my updates are about *fidelity to the built product* and *what the template actually rewards* (now read directly from the PDF):

- The template's first page says, verbatim: **"Build to a pillar or you are out"**, **"Product -vs- Everything / Detroit -vs- Everybody"**, and **"Product is worth more points than any other category (other than pillar relevance). Show us what you built."** The prior advice treated the demo as the second-highest-scored moment — the PDF confirms it, in stronger words. Protect the 2:30.
- The title slide's pillar field says **"Claim one, or three. Judges score how squarely you sit inside at least 1."** Your single-pillar claim is fine and arguably stronger than triple-claiming — but know the template permits the alternative, and be ready if a judge asks "why not also the economic pillar?" (Answer: "one pillar, all the way through" — decisiveness scores.)
- The Problem slide asks for "one striking number," a *specific group of Detroiters*, and "why it is still unsolved." Your number needs the Section C treatment; your specific group is "Detroit households buying and selling on Facebook Marketplace" (and, now that recalls are in the product, "families checking whether what's in their fridge was recalled"); "why unsolved" = platform incentives — the prior framing line ("they have the resources, they don't have the incentive") remains your best answer.
- The Solution slide's judge criteria — elegant / repeatable / scalable / behavior-building / different-from-existing — map one-to-one onto the built app's staged design: one input surface; same gated contract every time; more users ≠ more manual work (agents do the research); the habit is "check before you pay"; different = three independent indicators + evidence citations. Say "different" in exactly those terms.
- The Demo slide instructions ("one complete task end to end, start from a prepared state, recorded backup ready, name rough edges as next steps") — the built app satisfies all four *if* you choreograph to its real timing. Section I.
- The Market slide says **"One real signal outweighs a large market estimate"** and lists example signals: "A waitlist, a letter of interest, a partner who said yes, five people who used it this week." **You have a waitlist, live product, and a 71-check verification suite.** This is where solo-build credibility converts to points.
- Solo framing: the prior "that's the flex" advice is **now research-verified** — the 2025 inaugural Buildathon was won by a solo builder (Sha-Tera Mullen, 313SafeBeds; Section B), so solo winning has literally already happened at this event. One wording caution: say "built solo in eight weeks" only if the timeline is accurate under questioning — have the honest version ready (e.g., "the concept and research predate the buildathon; the app itself is an eight-week build").

### Q3 — Claiming the "Safe, Just & Thriving Neighborhoods" pillar

**Prior advice:** the three-word argument (Safe = physical safety / meetup robberies; Just = the protection gap falls hardest on those who can't absorb the loss; Thriving = money kept in the household circulates in the neighborhood); seed pillar language three times; lead with "Just" as the differentiator.

**My take:** The three-word structure is the right move. The category name is now verified exactly — "Safe, Just & Thriving Neighborhoods" on the event microsite — with one precision from A.3: it's the Buildathon's merge of two *separate* Rise Higher priorities ("Safe and Just Communities" + "Thriving Neighborhoods"), so claim the category verbatim on slides and attribute the city framework with "aligned with," never as a quoted pillar name. Four additions from independent research and the product:

1. **"Just" now has an architectural argument, not just a rhetorical one.** The built product practices due process: verdict language is evidence-linked ("domain registered 3 weeks ago — WHOIS," never "run by criminals"); gray zones are honored (dropship delays ≠ fraud); absence of findings is never sold as "verified safe"; contradictions are surfaced, not silently resolved; the user can see *what was checked* (coverage map) and *how much more digging would pay* (ripeness). For a product whose "Just" claim is that platforms treat vulnerable users unfairly, the product *itself* refusing to issue unsubstantiated accusations is the argument nobody else in the room can make. One line for Slide 5: *"A tool that fights fraud without defamation — every verdict is evidence-linked, and 'no record found' is never sold as 'safe.'"* (This also honors the standing fairness mandate for the whole project.)
2. **"Safe" needs verified local texture.** The meetup-robbery argument is real but should ride on citable cases — Section E collects Detroit-area examples. Pair it with the recall surface, which is the *other* physical-safety story: the same app routes food/product/vehicle recall checks to FDA/FSIS/CPSC/NHTSA records. "Safe neighborhoods" now includes "the smoked salmon in your fridge" — that's a household-safety sentence no fraud-only pitch can say.
3. **Keep "Thriving" simple** — money that stays in a Detroit household circulates in Detroit neighborhoods — and let Slide 5's three-block layout do the work. The prior closing argument ("Safe neighborhoods are ones where you don't get robbed arranging to buy a car…") is strong; keep it, add the recall clause.
4. **The framework's own words are your best Slide 5 line.** Rise Higher's vision for Safe and Just Communities, verbatim: *"Every Detroiter will have access to the resources and support they need before challenges become crises."* That is ScamShield's thesis in the city's own words — the check before the payment is the resource before the crisis. It also grounds the pillar claim in something the judges' civic world recognizes: a resident-driven survey with 9,190 responses across all 39 Detroit zip codes (released June 15, 2026). One sentence, quoted, attributed.

### Q4 — "It's ONE pillar" (the user's correction)

**Prior advice:** acknowledged; final draft seeded the pillar three times.

**My take:** The correction was right and it matters for scoring: the template says judges score "how squarely you sit inside at least 1" pillar — depth beats breadth. Speak to the three words *because they are the category's own name* (the template's "Claim one, or three" refers to claiming multiple *categories*, not words within one). Practical implication for the deck: name the category exactly as the program writes it on Slides 1 and 5 — spelling now verified against the event microsite: **"Safe, Just & Thriving Neighborhoods"** (comma after "Safe," ampersand, exactly that) — and don't claim a second category even in passing. One nuance from A.3 to hold for Q&A: if a judge invokes the *city* framework, the honest mapping is "two of the six Rise Higher priorities — Safe and Just Communities, and Thriving Neighborhoods."

### Q5 — The 30-question judge role-play

**Prior advice:** 30 questions across 7 archetypes + rapid-fire; top three to practice: false-positive rate, behavior-change paradox, pillar stretch.

**My take:** The question set is well-chosen — the three flagged as highest-leverage are genuinely the ones most likely to be asked. But **a third of the drafted answers describe the product that wasn't built**, and an answer that mismatches the visible demo is worse than a weaker honest one. Specific rewrites needed before Monday (full replacement answers in the table below):

| # | Old answer says | Problem | Honest 2026 answer (short form) |
|---|---|---|---|
| Q1 | "<5% false positives, tested on 50 listings" | That QA set isn't what exists | "I don't lead with a single accuracy number — I lead with the design that keeps verdicts honest: every flag is evidence-linked to a technique ID, gray zones don't score as fraud, and 'no adverse findings' always ships with what *was* checked. The buildathon build ships with an automated 71-check verification suite; measured false-positive rate is a post-beta metric with a target under 5%." |
| Q2 | Claude + evidence-field requirement | Vendor mismatch | Same substance, model-agnostic: "the reasoning model must cite the specific text or signal that fired each flag; no evidence string, no flag" — that's the check-v2 contract, and it's true of the built system |
| Q5 | "under ten seconds end-to-end" | Only the smoke test is seconds-fast | "Decisive tells return in seconds — that's the zero-search smoke test. Anything needing real evidence takes staged research, minutes, with citations — and you gate each stage. Speed where speed is safe; depth where depth pays." |
| Q7 | HiQ v. LinkedIn precedent for the extension | Dated precedent; extension not built | "The MVP can't scrape — it's paste and screenshots only, by design. Any future browser layer gets a legal review before it ships." |
| Q8 | "Images never stored" | False for the built app (F.1) | "Images live in the server-side job record so a gated investigation can resume; they never appear in API responses, and chat stores text only. Server is a private volume." |
| Q14–16 | $7.99/mo, 5 free checks, 150K users/$1.4M ARR | Not built; projections invite attack | "Pricing model under evaluation — per-check and subscription both fit the usage pattern. What's live today is a waitlist and a working product; revenue design starts with the beta cohort." Keep the kill-criteria *thinking* (it's good) but attach it to beta metrics, not ARR projections. |
| Q23 | Pattern-library fallback if Claude API down | Wrong mechanism; better one exists | "The app degrades honestly: if the AI backend is unreachable it runs in clearly-labeled demo mode rather than pretending to research. For a trust product, honest degradation *is* the graceful path." |
| Q27 | "No formal user research" | Still true — keep | Add: "plus a waitlist and one confirmed Detroit victim story from inside this building" |
| Q33 | Mother's story "not directly in scope" | Now false — see F.1 | "That exact scam type — brand impersonation with a pay-first funnel — is in the check catalog. Her mother's message would have hit the smoke test." |
| Q34 | "Claude Sonnet over GPT-4…" | Vendor mismatch | "A two-model pipeline: a fast vision model transcribes screenshots; a reasoning model runs staged, web-grounded analysis. The model layer is pluggable — the product is the *process*: gates, evidence citations, and the three indicators." |
| Q35 | Multilingual via Claude | Soften | "Multilingual input works; output is English today — an honest gap for Detroit's Arabic- and Spanish-speaking communities, on the roadmap." |
| Q44 | "Sha-Tera Mullen built 313SafeBeds" | **Verified true** (Section B: 2025, 1st place, sole listed builder) — keep | Keep as drafted, with one guardrail: say she *won* solo (2025), not that she runs it solo today — her site now references a team. |

**Three questions the set misses that 2026 judges may ask** (because everyone has seen a chatbot demo by now):

1. **"Why not just paste the listing into ChatGPT — or use McAfee's or Bitdefender's free AI checker?"** — the most dangerous question in the room, and it now has named competitors (D.1). Your answer: generic chatbots answer from a single pass, show no sources, never tell you what they *didn't* check, and can't say what another minute of research would be worth — and the free big-brand checkers (Bitdefender Scamio, Norton Genie, McAfee's Claude-powered check) return the same shape: an assessment with no evidence trail. ScamShield is web-grounded, cites every finding, shows a coverage map, separates verdict from confidence from ripeness, and gates spending. *"ChatGPT gives you an answer. ScamShield gives you an audit trail."* (If Starling Bank comes up: a UK bank shipping this exact capability in Oct 2025 is market validation — banks serve their own customers; nobody serves US consumers a standalone, cited version.)
2. **"What's ripeness and why is it a feature?"** — "the gate's price tag: whether one more research stage would pay. No consumer research tool shows its own diminishing returns. It's how the tool earns trust instead of burning credits."
3. **"Where does the scam knowledge come from?"** — "a 57-technique catalog compiled from FTC/IC3/BBB documentation and source research, with stable IDs — findings cite the technique they match. It's in the Learning Center on the site if you want to read it."

### Q6 — More questions + delivery, body language, cadence, pausing, nervousness

**Prior advice:** 14 more questions; PAUSE-ANCHOR-SUPPORT-STOP framework; posture/hands/eye-contact mechanics; slow down 20%; three pause types; anxiety-as-excitement reframe; box breathing; record yourself once; never announce nervousness.

**My take:** This guide is sound and unusually free of gimmicks — the reframe (Brooks' "I am excited" research), box breathing, and "record once, fix one thing, three more run-throughs" are all consistent with the evidence-based consensus on performance anxiety. My additions, in priority order for the 48 hours you have:

1. **The highest-leverage rehearsal is the DEMO narration, not the hook.** The hook is memorized prose; the demo is you talking over a live system with timing you don't fully control. Practice narrating the real /check flow (Section I) five times, including the failure line ("the venue connection just failed the live call — recorded backup") and the demo-mode fallback line.
2. **Rehearse the Q&A reset sentence.** When a question rattles you: pause one breath → "The direct answer is X. The context is Y." Stop. That's PAUSE-ANCHOR-SUPPORT-STOP compressed — one sentence to reach for instead of four.
3. **Timebox Q&A explicitly: 3 minutes ≈ 4 answers at 40 seconds.** Say "four" in your head when you sit down; if the first answer eats 90 seconds, the next two get 30 each — decide that *now*, not on stage.
4. **The pause math is right; add one physical cue.** After "her daughter is in this room right now," plant both feet and count a silent "one-two-three" while scanning the back wall — the prior guide's note that it feels like ten seconds to you and one to the room is accurate; trust it.
5. **Sleep beats rehearsal after midnight** — keep that rule; Sunday's remaining hours are best spent on the demo choreography and the fact-check corrections, not more polish of prose you already know.

---

## Section H — Updated slide content (deltas from `venture313-deck-content.md`)

Only the changes; everything not listed stays as drafted. ON SCREEN text is exact; SAY lines are calibrated to the same time budget (6:40 + buffer).

### Slide 1 — Title / Team / Pillar *(0:20)*

**ON SCREEN — headline/subtitle:**
> **ScamShield**
> Deep-research scam checks for Detroit buyers and families — before you send a dollar.

**IMPACT PILLAR box:**
> **Safe, Just & Thriving Neighborhoods** *(spelling verified against the event microsite)*
> Fraud protection platforms don't provide — built for the households that can least afford the loss.

**TEAM box:**
> [Your name] — Founder & Full-Stack Engineer · Coolyvision Inc. · Detroit
> Built solo · 8 weeks · live product, automated 71-check verification suite

*(No vendor stack on the slide. If asked in Q&A: "FastAPI backend; two-model AI pipeline — vision intake plus staged reasoning — on a pluggable model layer.")*

**SAY (unchanged shape):**
> "ScamShield. Deep-research scam checks for Detroit buyers and families — before you send a dollar. Pillar: Safe, Just, and Thriving Neighborhoods. Built solo in eight weeks, verified by an automated test suite, live today. Let me show you why it exists."

### Slide 2 — Problem *(1:30)*

Keep the compressed hook structure; corrections:
- **The big number: $2.1 billion — VERIFIED (FTC, Apr 27, 2026 spotlight), caption fixed.** On screen: *"**$2.1B** — reported losses to scams that started on social media, 2025 (FTC)."* Never "marketplace fraud" — the FTC's breakout is by origin platform. Keep "eightfold since 2020" (verbatim-verified: $261M → $2.1B). And upgrade the buyer-protection line to the documentable version: *"Meta's own Purchase Protection excludes vehicles, local pickups, peer-to-peer payments, and orders over $2,000 — the exclusions are the Detroit car deal"* (C.3 — scope it exactly as this exclusion list; the blanket "zero protection" is refutable since shipped checkout items are covered). Optional second line, new from C: *"Facebook alone accounted for more losses than text and email combined"*.
- **Replace "Nobody has built a tool that checks a specific listing…" — the literal claim is false (Section D.2: Starling ships it in the UK; small US tools do pieces of it).** Use the verified line instead: *"Free checkers look at links. Platforms protect their own. A UK bank ships listing checks — for its own customers, inside its app. Nobody has built the standalone, US version: a cross-platform check that returns a cited verdict before the money moves. Until now."*
- Add one clause connecting her story to the product (per F.1): after "the scammer had stolen the company's identity," when you pivot: *"That message is exactly what ScamShield screens."*

### Slide 3 — Solution *(1:00)*

**ON SCREEN — three steps:**
```
1. Paste the listing, message, or email — add screenshots
2. AI smoke test → instant tells; staged web research → cited evidence
3. Verdict + confidence + ripeness — three independent indicators
```

**Verdict row (replace the four pills):**
> 🟢 no adverse findings · 🟡 caution · 🟠 multiple red flags · 🔴 scam pattern match
> *Every finding cites its source. Every verdict shows what was — and wasn't — checked.*

**Bottom line (replace — per D.2):**
> Existing tools return an assessment. ScamShield returns an audit trail — cited sources, coverage map, confidence and ripeness — before the money moves.

**SAY — the habit + difference (template's two Solution criteria):**
> "Paste it in. If the material itself carries a decisive tell — a brand-clone domain, a pay-first refund — the smoke test flags it in seconds, no searching. When seconds can't decide, staged research agents sweep advisories, complaint boards, domain records, and community reports — and every stage ends with a plan you approve. You always see three separate indicators: what the record shows, how solid the evidence is, and whether one more stage is worth running. The habit is simple: check before you pay. And the difference from asking a chatbot: every finding has a source and a date, and 'no record found' is never sold as 'safe.'"

### Slide 4 — Product Demo & Roadmap *(2:30 — see Section I)*

**WHAT'S BUILT panel (replace):**
> ✅ Staged scam checks: listings, stores, emails, posts, sellers — paste + up to 5 screenshots
> ✅ Zero-search smoke test — snap verdicts on decisive tells
> ✅ 57-technique scam catalog with stable IDs, cited in every finding
> ✅ Recall checks routed to FDA / FSIS / CPSC / NHTSA + CDC layers
> ✅ Three independent indicators: verdict · confidence · ripeness
> ✅ Coverage map — what was checked, line by line
> ✅ Cited sources with access dates on every finding
> ✅ Learning center (dark patterns + seller-scam wikis) · waitlist live
> ✅ Automated verification: 71-check suite, all passing

**WHAT'S NEXT panel (replace):**
> → Vehicle history layer (VIN / NHTSA) for the auto beachhead
> → Browser layer: meet buyers where they browse (legal review first)
> → Rental & real-estate category — the scam type from Slide 2
> → Community reporting to grow the technique catalog
> → Beta cohort: 100 Detroit households

### Slide 5 — Impact to Detroit *(0:50)*

Keep the three-block layout and the closing argument; two edits:
- **SAFE block** — add the recall clause: "Flags dangerous seller behavior before any meetup — and routes recall checks (food, products, vehicles) to the federal record."
- **JUST block** — add the due-process clause: "…and the tool practices the justice it argues for: every verdict is evidence-linked; gray zones aren't fraud; 'no record found' is never 'safe.'" *(Fairness mandate, made visible.)*
- **CLOSING LINE (new)** — end the slide inside the city's own words: Rise Higher's Safe and Just Communities vision — *"Every Detroiter will have access to the resources and support they need before challenges become crises"* (resident survey, 9,190 responses, all 39 zip codes, June 2026) — then land it: *"ScamShield is that, for fraud: the check before the payment is the resource before the crisis."*
- **Local anchors (all verified — Section E):** name the **Michigan AG's Consumer Protection Team**, which reissued a consumer alert on marketplace prop-money fraud in Oct 2025 — plus the **Livonia case**: a Marketplace robbery committed *in a police-station parking lot* (sentenced Apr 2026). One line: *"Even a police-station safe-exchange zone didn't stop it — because the risk isn't the location, it's the counterparty. Screen the counterparty."* If you cite income on this slide: **"about $40,000 — roughly half the state median"** (the $35K in the old draft is stale).

### Slide 6 — Market / Opportunity *(0:30)*

**SIGNAL box (replace — this is now your strongest slide):**
> The product is live. 57 techniques loaded.
> Automated 71-check verification suite — all passing.
> Waitlist open. A Detroit family connected to this room
> confirmed the pain. That's the signal.

**SIZE column (verified replacements — C.1):**
> Nearly 54,000 used-car-sale complaints to the FTC in 2024.
> ~38M US used-vehicle sales a year — roughly half private-party (Cox).

*(Drop the "5M online buyers" and "40K complaints" figures — first has no source, second is the wrong basis.)*

**SUSTAINABILITY column:**
> Free beta now. Per-check and subscription models
> under evaluation with the beta cohort.

**THE ASK — two different asks, don't blur them:**
- *Of the judges:* the build itself. The 2026 pool is **more than $50,000 in cash + product-development grants ($25K 1st · $15K · $10K · $2,500 People's Choice)** — awarded for exactly what you're showing: user need + working product + Detroit impact (2025 weights: 50/20/20/10; Sections A/B). You don't ask for this; you demonstrate for it. *(Official pages say "$50,000 total" while the line items sum to $52,500 — "more than $50,000" is the safe on-stage phrasing.)*
- *Of the room (the closing slide's ask):* my recommendation stays **B** —
> "I'm looking for two things: 100 Detroit households to beta-test ScamShield free — check anything before you pay — and an introduction to the Michigan Attorney General's Consumer Protection Team." *(name verified — E.2; and the team is already fighting marketplace fraud: the Oct 2025 prop-money consumer alert)*
> Fallback A (users only) if the AG intro feels presumptuous in the room; skip projections entirely.

---

## Section I — Demo choreography for the real app (2:30)

The scripted "paste → SCAM ALERT in 8 seconds" flow does not exist in the built product. This choreography shows the real product at its best inside 2:30, with a backup ladder. **Run the server locally on the laptop** (no venue-Wi-Fi dependency except the z.ai API call itself).

**Prepared state (before you walk on):**
- Local server running, `app/.env` in place (LIVE mode), browser open to `/check` with the sample suspicious message already pasted into the input (a real-estate/webinar impersonation message — echoing the hook story; anonymized company).
- A **pre-completed job** open in a second tab (run it Sunday night): the same subject through triage + one verify stage, so gates, coverage map, and final indicators are already rendered.
- Recorded screen capture of the full flow on a second device, cued.
- The offline simulation (`docs/mockups/recall-check-simulation.html`) bookmarked — last-resort backup that needs no network at all.

**The 2:30:**

| t | Action | Narration |
|---|---|---|
| 0:00–0:20 | Show the prepared `/check` input. | "Here's a message like the one that started this pitch — a real-estate brand offering webinar access. Looks legitimate. Company name is real. I hit Check." |
| 0:20–0:50 | Submit → **smoke test** fires: snap verdict, tells with technique IDs. | "Seconds, zero searches — the smoke test caught it: the sender domain isn't the company's, and there's a pay-first refund. Those are documented techniques — T-0302, brand-impersonation clone; T-0401, off-platform payment pressure. Verdict's red, confidence is high, and it tells you what to do right now: don't pay, report it." |
| 0:50–1:10 | Click through to the staged path / switch to the **pre-completed job tab**. | "When seconds can't decide, it goes staged. Here's a completed investigation…" |
| 1:10–1:50 | Walk the job: findings with cited sources → coverage map → **three indicators**. | "Every finding cites its source and date. The coverage map shows what was checked, line by line — this verdict is only worth its coverage. And these three indicators are separate on purpose: the verdict says what the record shows; confidence says how solid the evidence is; ripeness says whether one more stage would pay. A red verdict with medium confidence and green ripeness means: act now — verifying will pay. No single score can tell you that." |
| 1:50–2:10 | Show one gate. | "Between stages, it stops. It proposes the next plan — I decide whether it's worth running. The tool doesn't burn research credits without my say-so." |
| 2:10–2:30 | Gesture at roadmap panel. | "That's what's built and verified by an automated 71-check suite. Next: the vehicle-history layer, the browser layer, the rental category — the scam from slide two. This is a working product, not a mockup." |

**Backup ladder (in order, no apologies):**
1. Live server + z.ai API works → full flow above.
2. z.ai unreachable → **demo mode** (hold `.env` aside, boot server): clearly-labeled canned replies; narrate honestly: "the live AI backend isn't reachable from here — this is demo mode, same UI, canned output, honestly labeled."
3. Local server dead → recorded capture on the second device ("recorded backup — same flow").
4. Nothing works → the offline simulation, framed as what it is: "a click-through of the exact journey — same indicators, same gates."

*(To relaunch the local server: `cd zai-demo-app-2026-09/app && .venv/Scripts/python -m uvicorn main:app --host 127.0.0.1 --port 8000` — it is currently stopped. For demo mode: move `app/.env` aside before boot, restore immediately after.)*

---

## Section J — Speech timing & the 48-hour plan

| Slide | Time | Key moment |
|---|---|---|
| 1 — Title | 0:20 | "Built solo · verified · live today" |
| 2 — Problem | 1:30 | The story → **3-second pause** → one verified number |
| 3 — Solution | 1:00 | Smoke test vs staged research; three indicators; "audit trail, not an answer" |
| 4 — Demo | 2:30 | Snap verdict → pre-completed job → gates → "71-check suite" |
| 5 — Detroit | 0:50 | "One pillar. All the way through." |
| 6 — Market | 0:30 | Signal box → the ask → URL → stop |
| **Total** | **6:40** | 20 seconds of buffer |

**Tonight (Sun Sep 20):** run one complete job on `/check` for the pre-completed tab · **record the ≤5-minute demo video** (it's your on-stage backup *and* likely your 8 AM Monday submission requirement — A.1; 2025 rule was "no slide-only videos," so show the product) · apply the Section C number swaps ($2.1B caption fix; $4,500 → $12,600; drop 160M and 5M; "nearly 54,000 complaints") · update the deck per Section H.
**Monday (Sep 21 — submission + pitch-prep day):** **submit before 8:00 AM** (deck PDF, demo video, usable project link, repo per your kickoff materials — confirm the exact list first thing) · finalists notified during the day · confirm consent with the staff member (exact language — do it Monday if you'll see her at pitch prep, otherwise Tuesday morning) · confirm the name for the team slide · one full timed run-through of all seven minutes.
**Tuesday (Sep 22 — showcase, 5–9 PM at J-Hub, 950 Selden St):** boot the local server and walk the demo choreography once before leaving · carry the second device with the recorded backup cued · arrive early enough to connect to the venue display · box breathing ×4 before walking up.
**Mantra (from the mastery guide — still the right one):** "I built this. I know it better than anyone in this room."

---

## Section K — Open decisions only you can make

1. **URGENT — what exactly is due Monday 8:00 AM?** (A.1) Pull out your kickoff materials tonight and confirm the 2026 submission list (2025 precedent: ≤5-min demo video, usable project link, public repo + README, deck PDF). Submit early, not at 7:55. Everything else on this list is Tuesday-quality; this one is tomorrow-morning-real.
2. **The ask** — settled: more than $50K in prizes is real (Sections A/B), so the closing ask targets the *room* (users + partner intro), not the judges. Recommendation B stands.
3. **Your real name** on the team slide.
4. **Product URL on the closing slide** — a deployed Railway URL (deploy guide is doc-verified and ready) or a local-only demo with "beta waitlist live at [url]". Note the same URL likely satisfies the submission's "usable project link" — deploying Sunday night serves submission, slide, and demo at once. Don't print a URL that 404s in front of judges.
5. **Consent confirmation** with the staff member — Monday at pitch prep if she's there, otherwise Tuesday morning-of; exact language; non-negotiable.
6. **Whether to keep "Marketplace" anywhere in the product name** (my recommendation: drop it — Section F.3).

---

## Sources

Every section carries inline attribution; this is the consolidated index. All web sources accessed **2026-09-20**.

**Event & framework (A):** events.techtowndetroit.org/Venture313Buildathon (schedule, venue, categories, prizes) · techtowndetroit.org event listing · risehigherdetroit.com + detroitmi.gov press release (Jun 15, 2026) · v313detroitbuildathon2025.devpost.com · github.com/atomicobject/313Buildathon-Curriculum · venture313.com / build313.ai
**Past winners (B):** v313detroitbuildathon2025.devpost.com · @venture313 Instagram (Sep 26, 2025) · 313safebeds.com (+ /about) · TechTown Detroit 2025 Impact Report · gilbertfamilyfoundation.org · Detroit Free Press (Feb 20, 2025)
**Fraud statistics (C):** FTC press release + data spotlight (Apr 27, 2026) · FTC Consumer Sentinel Data Book 2024 · FTC Joint Economic Committee testimony (Mar 25, 2026) · Anderson, SSRN 3852323 (May 2021) · FBI IC3 Annual Internet Crime Reports 2024 & 2025 · facebook.com/help/228307904608701 (Purchase Protection exclusions) · BBB vehicle-scam study (Oct 2024) · Cox Automotive market insights
**Competition & name (D):** scamadviser.com · bitdefender.com/consumer/scamio · f-secure.com · us.norton.com (Genie) · mcafee.com + ZDNET (Jan 6, 2025) + CNET (May 14, 2025) · blog.google (May 8 & Sep 18, 2025) · scamnetic.com + USPTO tmsearch (serial 99065303) · starlingbank.com + The Guardian + Yahoo Finance UK (Oct 27, 2025) · scamanot.com · dealflip.ai · isthisascam.to · apps.apple.com (CarBluff, id 6796525289) · t-mobile.com/scamshield + T-Mobile launch press (Jul 16, 2020) · tmsearch.uspto.gov (SCAMSHIELD serial 90056826; SCAM SHIELD serial 99280890) · scamshield.gov.sg + ncpc.org.sg
**Detroit anchors (E):** census.gov QuickFacts · Census Reporter (ACS 2024 1-year: B19013, B25044, B08301) · datausa.io · fhwa.dot.gov MV-1 (2024) · coxautoinc.com/market-insights · capitaloneshopping.com research (Sep 2026) · michigan.gov/ag/consumer-protection + AG press releases (Mar 3, 2025; Oct 15, 2025; May 14, 2026) · michigan.gov/sos · ClickOnDetroit (Apr 21, 2026) · CBS News Detroit (Apr 24, 2026) · Michigan Legal News (Mar 13, 2025) · aarp.org/states/michigan/fraud (May 2026)
**Product facts (F, I):** verified locally against the repo — `zai-demo-app-2026-09/app/content/skills/rdw-scamshield-check-v2/technique-catalog.md` (§4: 13 families / 57 techniques), `app/jobs.py` (image persistence + `public_view`), `features.json`, the 71-check verify suite, `docs/TEST-REPORT-LIVE-2026-09-20.md`, `docs/USER-JOURNEYS-2026-09-20.md`
