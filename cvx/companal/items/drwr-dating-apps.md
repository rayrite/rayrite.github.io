# COMBINED MARKDOWN - 2026-09-23-dating-apps

_Generated 2026-09-23 13:12:36 | 7 files | folder: D:\stuff\ai-misc\_bsh2026\vscode_project01\46-wide_research_test\independent_research\2026-09-23-dating-apps_

## Contents

1. 00-executive-summary.md
2. 01-market-analysis.md
3. 02-gap-blueocean-swot.md
4. 03-new-app-concept.md
5. 04-competitive-analysis.md
6. 05-tech-stack-matrix.md
7. 06-architecture-deployment.md

---

<!-- ====================================================================== -->
<!-- FILE: 00-executive-summary.md -->
<!-- ====================================================================== -->

# 00 — Executive Summary: Dating App Industry Deep Dive (Sep 2026)

Compiled 2026-09-23 from a 56-file, ~950KB corpus fetched live 2026-09-23 (09:04–09:56 UTC). Backbone: `01-master-facts-digest.md` + `verification-pass.md`. Every load-bearing fact below carries an inline corpus citation; conflicts are stated with both values, never averaged. Quarantined corrupted/stale captures (tinder-monolith2.md, tinder-monolith3.md, feeld-home.md, play-home.md) and 404 nav-only captures (businessofapps-grindr.md, businessofapps-revenue.md) are not cited anywhere in this document.

---

## 1. Thesis

The dating app industry in September 2026 is a **maturing duopoly market in structural revenue decline, mid-flight regulatory transition, and a wide-open product-quality and trust gap** — a combination that historically precedes share rotation toward new entrants, even as it raises the cost of entry.

1. **The growth era is over.** Global dating app revenue 2025 was **$6.07B — the first-ever annual decline** on record (Business of Apps, updated Jun 11 2026) [src: businessofapps-market.md]. This is not one weak app dragging an average: Tinder is declining (-5.2%), Bumble is in visible distress (-9.6% FY25, -14.7% in Q2'26), and Match Group's established-brands bucket fell -17% in Q2'26 [src: businessofapps-bumble.md, bmbl-q2.md, s-mtch-q2.json]. The only large growers are Hinge (+25% FY25, +22% Q2'26) and Grindr (+33–38% quarters) — both inside or adjacent to the incumbent structure, not outside it.
2. **It remains a duopoly in revenue concentration.** Match Group alone is **$3.3B of the $6.07B (~54%)** per BoA — conflict carried: FY2025 10-K revenue is **$3.49B (~57.5%)** [src: businessofapps-market.md, wiki-match.md]; add Bumble (~$782M, ~13%) and two companies control roughly two-thirds of global category revenue. Network effects and paid acquisition scale still protect the top of the market.
3. **Regulation has become a first-order product force, not a legal footnote.** UK Online Safety Act age verification became mandatory Jul 25 2025 (with documented circumvention: VPN download spikes, photo-based Persona checks bypassed with game-character images); the US TAKE IT DOWN Act criminalizes non-consensual intimate imagery with platform takedown duties; Australia announced a dating-app duty-of-care proposal ~Sep 22 2026; the EU DSA applies to major platforms [src: wiki-osa.md, wiki-takeitdown.md, gdi-home.md, wiki-grindr.md]. Compliance cost is now a moat incumbents have already paid and a tax late entrants must budget for.
4. **The trust/quality gap is the industry's biggest unpriced liability — and a new entrant's clearest wedge.** Trustpilot scores of Tinder **1.1**, Bumble **1.3**, Match **1.0** (all "Bad") [src: tp-tinder.md, tp-bumble.md, tp-match.md]; a widely headlined Australian study finding **99% of women report abuse on dating platforms** [src: gdi-home.md — headline only, study itself unfetched ❓]; Grindr's **£26M settlement (Sep 2026)** for sharing HIV status and sensitive data with third-party analytics [src: wiki-grindr.md]. No major incumbent's brand is built on safety-first product mechanics; the category leader position for "the dating app that doesn't feel hostile" is vacant.
5. **For a founder-developer, the strategic read:** this is not a market to attack head-on with a generic swipe app — the TAM math (§6) and the duopoly's acquisition scale make that near-suicidal. It *is* a market where a niche-first, trust-first, compliance-native product with modern monetization mechanics (weekly subs, a-la-carte, premium AI — all proven by Grindr and Tinder Select) can take a defensible single-digit-million-payer slice while the giants are distracted by turnaround management, impairments, and regulatory load.

---

## 2. The Numbers That Matter

**Market level** [src: businessofapps-market.md]:
- Global dating app revenue 2025: **$6.07B, first-ever annual decline** (BoA, updated Jun 11 2026).
- Worldwide users: **350M+**; paying users: **~23M** → payer penetration ~6.6%. The paying pool is finite, small relative to usage, and currently shrinking at the two largest payer bases (Tinder subscribers 10.9M in 2022 → 8.9M in 2025; Bumble payers 3.8M → 3.2M YoY per Q2'26 IR).
- Match Group share: **$3.3B (~54%)** BoA vs **$3.49B (~57.5%)** FY25 10-K — both carried.
- 2025 downloads: Tinder most-downloaded, then Bumble. Tinder #1 US by share; Hinge #3 US but fastest-growing.
- BoA top-apps roster: Tinder, Bumble, Hinge, Badoo, Happn, Grindr, Tantan, Plenty of Fish, Match, Raya; niche apps "such as Pure, Feeld and Boo mix casual with niche interests."

**Table 1 — Per-app financial snapshot (FY2025 unless noted; tickers live Sep 23 2026 via gdi-home.md)**

| App / entity | FY2025 revenue | Latest trend | Payers / subs | Users | Key signal |
|---|---|---|---|---|---|
| Tinder (MTCH) | **$1,840M, -5.2%** (peak $1,941M in 2024; $1,918M in 2023) | Q2'26 $457M, -1% [src: s-mtch-q2.json] | Subs 10.9M (2022) → **8.9M (2025)** | 60M MAU vs 75M MAU (**conflict — carry both**); 400M+ lifetime downloads; 190 countries | 57% of Match Group revenue (2023); ~40% of revenue US, ~10% UK; Google Play last update Sep 21 2026 (actively shipping) |
| Bumble (BMBL $2.85) | **$782M, -9.6%** (peak $866M 2024) | Q2'26 app revenue **$171.7M, -14.7%**; net loss $127.9M incl. **$169.3M impairment** (Q2'25: -$367.0M incl. $404.9M impairment — two consecutive impairment quarters) | BoA FY25: 2.4M; live IR Q2'26: **3.2M, -16.4%** (IR authoritative in conflict) | 42M (2024) → **35M (2025)** | Net income 2025 **-$906M (worst ever)**; valuation $13B (2021) → $1.8B (2024) → **$0.7B (2025)**; ARPPU $21.96 +1.2% |
| Hinge (MTCH, 100%-owned) | **$689M, +25%** — only major grower | Q2'26 **$204M, +22%**; payers 1.7M → 2.0M | 1.06M (2022) → 1.53M (2024) → **1.95M (2025)** | 30M (2025) | **#1 in UK, Ireland, Sweden, Norway, Denmark**; #3 US (22% share); ~70% of revenue US, ~15% UK |
| Grindr (GRND $15.89) | **$440M (FY25, 10-K via wiki)** | Q1'26 $130M **+38%**; Q2'26 **+33%**; FY26 guidance **≥$535M, later ~$540M** | Payers +16% (~1.4M milestone, s-grnd.json); "8.4% penetration" | 13.5M MAU (Sep 2023 figure, wiki-grindr.md) vs 8M users (FY25 10-K basis, digest §6) — both carried | **ARPPU $26.51, +12%** ($25.51 CNBC variant — conflict carried, see 04/05) — highest captured ARPPU, attributed partly to AI monetization; £26M UK data settlement Sep 2026 |
| Match Group corporate (MTCH $43.16) | ~$3.3B (BoA) vs **$3.49B (FY25 10-K)** — both carried | Q2'26 revenue **$853M, -1%**; **EPS $0.92 miss**; Adj EBITDA $331M (39% margin); E&E segment (Match/PoF/OkCupid/Meetic) **-17%** | — | — | CEO **Spencer Rascoff** (turnaround mode); Japan = #2 market after US; Jan 28 2026 cyberattack |

Sources: [businessofapps-tinder.md, businessofapps-bumble.md, businessofapps-hinge.md, wiki-grindr.md, s-grnd.json, s-mtch-q2.json, bmbl-q2.md, gdi-home.md, wiki-match.md, gp-tinder.md]

**Demographic and engagement structure that shapes any product entry** [src: businessofapps-tinder.md]:
- Tinder US user base: 35% aged 18–24, 25% aged 25–34 (60% under 35); **75% male / 25% female implied (App Ape text) vs 73/27 (BoA table — internal BoA variance, carry both)**; household income mode $60–80k (30%).
- Civic Science penetration (% overall / 18–24 / 25–34 / 35+): Tinder 30/40/25/12; Bumble 22/25/22/14; Hinge 15/20/19/7; Match.com 10/3/6/15; PoF 6/5/3/12; eHarmony 4/3/4/10 → Tinder and Hinge own under-35; **Match.com and eHarmony still win 35+** — the older demographic is structurally underserved by swipe-native products.
- Gender supply imbalance (3:1 male on Tinder; worse skew in India per BoA) is the category's core marketplace-design failure and the hardest problem a new entrant must solve.
- Pricing ladder captured across the corpus: Tinder Plus $24.99 / Gold $39.99 / Platinum $49.99 / **Select ~$499/mo invite-only**; Bumble Boost $15.99 / Premium+ $39.99; Hinge+ $29.99 / HingeX $49.99 (free tier = 8 likes/day); Grindr XTRA $22.99/mo **or $14.99/week** / Unlimited $44.99 / Boost $11.99 one-time [src: s-tinder-price.json, tinder-plans.md, s-hinge-price.json, s-grindr-price.json, grindr-unlimited.md]. Dynamic/A-B price testing is documented at Tinder ("charge you whatever they think you'll pay") and Hinge ("differs based on your age, region, device").

---

## 3. The Five Storylines

### 3.1 Bumble distress — a founder-case-study in identity collapse
The women-message-first brand was the differentiation; 2026 is the year Bumble surrendered it. Revenue peaked at $866M (2024), fell to **$782M (-9.6%) in 2025** [src: businessofapps-bumble.md], and the decline **accelerated** to -14.7% YoY in Q2'26 with Bumble App revenue of $171.7M [src: bmbl-q2.md]. Net losses: -$768M (2024), **-$906M (2025)** — with two consecutive impairment quarters (Q2'25 -$367.0M net incl. $404.9M impairment; Q2'26 -$127.9M net incl. $169.3M impairment) that formally write down the value of the business. Users fell 42M → 35M in one year; payers fell 16.4% YoY to 3.2M; ARPPU inched up +1.2% to $21.96 — a classic "milk the remaining base" pattern. Valuation collapsed $13B (2021 IPO) → $1.8B (2024) → **$0.7B (2025)**; BMBL traded at **$2.85** on Sep 23 2026 [src: gdi-home.md]. In **Aug 2026 Bumble retired women-message-first entirely — men can now initiate — and extended the match window 24h → 72h** ("Bumble Unveils an Evolution to its Signature Chat Experience," Aug 11 2026 press release; PDF contents unfetched ❓) [src: wiki-bumble.md, bmbl-press.md]. CFO Kevin Cook frames results as "higher end or above our guidance ranges... deliberately investing across product, technology, and brand"; Q3'26 guide is app revenue $167–173M, Adj EBITDA $56–60M [src: bmbl-q2.md]. The strategic lesson for a founder: a values-based positioning abandoned under revenue pressure destroys the only moat it created — the positioning hole Bumble vacated (women's safety-first dating) is now open, and the buyer of that hole is not Bumble.

### 3.2 Hinge ascent — the "designed to be deleted" counterprogram works
Hinge is the sole large-scale grower: revenue **$689M in 2025, +25%**, up from $90M in 2020 and $2M in 2017; payers 1.95M (+420k YoY) [src: businessofapps-hinge.md]; Q2'26 **$204M +22% with payers 1.7M → 2.0M** [src: s-mtch-q2.json]. It is now the **#1 dating app in the UK, Ireland, Sweden, Norway, and Denmark**, #3 in the US with 22% share, and ~70% of its revenue is US / ~15% UK [src: businessofapps-hinge.md]. Monetization is aggressive and holding: Hinge+ $29.99/mo, HingeX $49.99/mo, 8 likes/day free tier, documented dynamic pricing (April 2026 tier-quota table captured) [src: s-hinge-price.json]. Voice notes on prompt answers are "one of the most popular features" (BoA). Leadership: CEO Jackie Jantos, CFO Bill Archer, CTO Ben Celebicic; Match took 50% in 2018 and 100% in 2019 — so Hinge's growth accrues to Match Group, not to an independent rival. Lesson: relationship-intent framing + higher price points + slower, quality-gated interactions beats swipe volume in the under-35 demo it targets — and it validates that users will pay $30–50/mo for perceived quality.

### 3.3 Grindr — the AI-monetization counterexample to the decline narrative
While Tinder and Bumble shrink, Grindr grew Q1'26 revenue **+38% ($130M)** and Q2'26 **+33%**, with FY26 guidance of **≥$535M, later raised to ~$540M** vs $440M FY25 (Form 10-K) — roughly +22% implied [src: s-grnd.json, wiki-grindr.md]. The engine: **ARPPU $26.51 (+12%)** ($25.51 CNBC variant carried — see 04/05), payers +16%, and deliberate premium-AI monetization — the **gAI** feature suite (six AI features, tested 2025, premium-tier intent) and a new **"Edge" premium tier** in 2026 [src: wiki-grindr.md, s-grnd.json — FY26 guidance and Edge are single-source]. Monetization mechanics are the most experimental in the category: XTRA at $22.99/mo **or $14.99/week** (weekly subs work), Unlimited $44.99/mo, a-la-carte Boosts $11.99 [src: s-grindr-price.json, grindr-unlimited.md]. Grindr also demonstrates the compliance cost curve: UK age verification since Jul 2025 (OSA), no US age verification (Section 230 posture), and the **Sep 2026 £26M High Court settlement** (April 2024 suit, ~12,000 UK users, covert tracking + HIV-status sharing with third-party analytics) [src: wiki-grindr.md]. Lesson: a dense, loyal niche with a willingness to pay, monetized via AI + weekly + a-la-carte, outgrows the general-purpose swipe market — niche density beats audience breadth.

### 3.4 Match Group consolidation under Rascoff — portfolio pruning as turnaround
Match Group's Q2'26: revenue **$853M (-1%)**, **EPS $0.92 — a miss**, Adj EBITDA $331M (39% margin); Tinder $457M (-1%), Hinge $204M (+22%), established brands **-17%** [src: s-mtch-q2.json]. **CEO Spencer Rascoff** is running a public turnaround strategy (GDI, Sep 2026; BoA pages still listing Bernard Kim are stale — Rascoff confirmed by two sources) [src: gdi-home.md, tinder-eng.md]. Portfolio moves in 18 months: **Archer shut down June 2026** (launched Jun 2023 for gay/bi/queer men — two-source confirmed), **$100M minority stake in Sniffies (Apr 2026)** — single source — and Kippo's metaverse pivot (single source) [src: s-league.json, wiki-match.md, s-deaths.json]. (The League, by contrast, was acquired **Jul 2022** per wiki-match — the digest's "2025-26" acquisition dating is corrected to Jul 2022 in 04 §6.6 and carried in 01 §6; acquisition confirmed via internal email (TechCrunch); full sunset date ❓.) **Japan is Match's #2 market after the US**, anchored by Pairs, which **geo-blocks all non-Japan IPs** (directly observed) — a walled-garden regional strategy [src: wiki-match.md, pairs-home2.md]. A Jan 28 2026 cyberattack hit "a limited amount of user data" [src: wiki-match.md]. Lesson for a founder: Match under Rascoff is an active acquirer and shutterer — exit paths include acquisition (The League), minority investment (Sniffies at $100M), or being out-competed by an Archer-style internal attempt that fails; note that Match's own attempt at the queer-men niche failed in 3 years while Grindr and Sniffies succeeded — incumbency does not transfer across niches.

### 3.5 Regulation-as-moat — compliance became a competitive weapon in 18 months
- **UK OSA 2023**: duty-of-care regime, fines up to £18M or 10% of global turnover; **Ofcom age-verification deadline Jul 25 2025**. Documented reality: VPN download spike (circumvention), **photo-based Persona age verification bypassed with Death Stranding game-character images**; Ofcom example fines of £50k; Wikimedia refused identity checks on data-minimisation grounds; s.212 repealed DEA 2017 Part 3. Grindr complied Jul 2025 [src: wiki-osa.md, wiki-grindr.md].
- **US TAKE IT DOWN Act**: Cruz bill (June 2024 origin, Aledo TX HS deepfake incident); criminalizes NCII and imposes platform takedown duty; signed May 2025 (exact-status detail rests in the 32KB captured file) [src: wiki-takeitdown.md].
- **Australia**: duty-of-care proposal for dating apps announced ~Sep 22 2026, the same week as the 99%-women-abuse study headline [src: gdi-home.md — both headline-only ❓].
- **EU DSA**: obligations on majors (VLOP status for some); dating-specific VAPP detail not captured this run ❓.
- **US Section 230**: the reason Grindr age-verifies in the UK but not the US — regulatory asymmetry by geography, which any launch plan must map market-by-market [src: wiki-grindr.md].
Thesis: age-assurance infrastructure, NCII takedown workflows, and duty-of-care evidence trails are now table stakes in the UK/EU/AU and a differentiator in trust marketing everywhere. Incumbents have already paid this cost; a new entrant must build it from day one — cheaply, because modern age-assurance and content-moderation APIs exist, and advantageously, because none of the incumbents markets compliance as a feature.

---

## 4. DevSecOps Headlines — the security and compliance ledger

The corpus reads as a continuous incident-and-liability record. For a DevSecOps-engineer founder, this is simultaneously the industry's shame list and the requirements doc for a defensible product.

**Table 2 — Incident, breach, and liability register**

| Date | Event | Entity | Consequence / lesson | Source |
|---|---|---|---|---|
| Jan 2026 (Match: Jan 28) | Cyberattack campaign — Match, Bumble, Panera Bread, CrunchBase hit in same operation (Bloomberg via Wikipedia); Match: "limited amount of user data" | Match Group, Bumble | Both category leaders breached in one month — campaign-style, multi-company targeting; disclosure language minimal | wiki-match.md, wiki-bumble.md |
| Sep 2026 | **£26M settlement**, April 2024 High Court suit, ~12,000 UK users: covert tracking technology; HIV status + sensitive data shared with third-party analytics | Grindr | Largest quantified dating-app privacy payout in corpus; sensitive-category data flows to analytics vendors = existential legal risk, not a fine | wiki-grindr.md |
| Jul 25 2025 | UK OSA age-verification deadline; enforcement begins | All UK-facing apps | VPN circumvention spike; Persona photo-age-check bypassed with game-character images → age assurance is adversarial, needs defense-in-depth + monitoring, not one vendor | wiki-osa.md, wiki-grindr.md |
| 2024–2025 | US TAKE IT DOWN Act: NCII criminalization + platform takedown duty (signed May 2025) | All US-facing platforms | Takedown SLA workflows and abuse-report pipelines become statutory, not optional | wiki-takeitdown.md |
| Sep 2026 | Australia dating-app duty-of-care proposal + "99% of women report abuse" study | Category-wide | Duty-of-care regimes are spreading UK→AU; expect evidence-trail requirements | gdi-home.md |
| 2020 | Account-takeover vulnerability: password-reset via email-only | Grindr | Historical; shows the base rate of auth design failures in the category | wiki-grindr.md |
| Ongoing | Tinder engineering publishes security research on **GitHub Actions + AWS OIDC misconfigurations**; monolith decomposition program; in-house Java Elasticsearch scoring plugin; unified API style guide | Tinder | The engineering leader still finds cloud-identity misconfigs internally — CI/CD and identity hygiene is a permanent posture, not a project | tinder-eng.md |
| Ongoing (product AI) | Bumble Private Detector (AI nude-image blur, open-sourced 2019), Deception Detector (fake-profile/scam blocking), "wingman" AI flirting chatbot in development; AI-generated fake profiles prohibited | Bumble | Safety-AI is becoming product surface; open-sourcing safety models is both goodwill and a standard-setting move | wiki-bumble.md |

Security-and-privacy architecture implications (previewed for deliverables 02/03, carried into 05/06): data minimization is the cheapest legal defense (the Grindr settlement is the counter-example — sensitive data flowing to third-party analytics); age assurance must be treated as adversarial infrastructure (Persona + behavioral signals + audit trail, not a single vendor); NCII takedown requires content-hash and response-SLA plumbing from launch; and breach disclosure posture matters in trust marketing. Deployment baseline for staged plans (0/10k/1M DAU) is already grounded in the LiquidWeb Managed VPS corpus (AlmaLinux 9.8, cPanel/WHM, 2 vCPU/2GB RAM, 10TB transfer, 50GB storage, root SSH, Softaculous — 12 docs, lw-*.md) — see deliverable 06 for the staged architecture (05 for the layer-by-layer stack). Downstream deliverables: 02 quantifies the trust gap (Tawkify's 4.6 trust ceiling vs the 1.0–1.3 incumbent field — honesty economics is documented demand incumbents cannot copy without cannibalizing their paywalls), 04 scores the incumbent field (top-20 roster, per-competitor profiles, composite feature/price/trust matrices, consolidation-and-deaths register), 05 recommends the entrant stack layer-by-layer (React Native/Expo client, TypeScript API services, Postgres-first data layer, E2E chat, buy-not-build payments and age assurance, Private Detector OSS reuse, staged LiquidWeb deployment), and 06 stages the 0→10k→1M DAU plan on that VPS baseline (single VPS → split tiers → cloud/K8s with the VPS demoted to backstop).

---

## 5. Top-5 Opportunities for a New Entrant (preview of 02/03 conclusions; competitive matrix in 04, tech stack in 05, staged deployment in 06)

1. **Trust-and-safety-first positioning in the slot Bumble vacated.** 99%-abuse headlines (❓ study itself unfetched), Trustpilot floors of 1.0–1.3 across every major incumbent, and Bumble's Aug 2026 abandonment of women-first mechanics leave the "safe, verified, respectful" brand position genuinely open. Product surface: verified-only matching, in-app safety tooling (Private Detector is open-source — reuse it), abuse-response SLAs marketed as a feature, balanced-gender marketplace design (Tinder's 75%-male base is the cautionary tale) [src: tp-tinder.md, tp-bumble.md, tp-match.md, gdi-home.md, wiki-bumble.md, businessofapps-tinder.md].
2. **Dense niches over broad swipe.** Grindr's +33–38% quarters and Sniffies' $100M valuation signal prove niche density monetizes better than breadth; BoA already maps the niche layer (Pure, Feeld, Boo). Candidate verticals evidenced by gaps in the corpus data: 35+ singles (Civic Science shows Tinder loses that cohort to legacy Match/eHarmony, whose parent segment is declining -17%), faith- and community-specific apps (Muzz captured at 24.6KB home page), and geographies like India (TrulyMadly; Bumble's 1M-users-in-4-months India launch proves fast regional adoption is possible) [src: wiki-grindr.md, wiki-match.md, businessofapps-market.md, muzz-home.md, trulymadly-home.md, wiki-bumble.md].
3. **AI-native product, priced like Grindr's gAI — not bolted on like everyone else's.** Grindr's ARPPU $26.51 (+12%) with premium AI tiers and "Edge" is the proof that users pay for AI features; Bumble's in-development "wingman" chatbot shows incumbents treat AI as a feature, not a product. An AI-native entrant (matching concierge, conversation safety, profile authenticity scoring) faces an incumbent set whose AI is retrofitted [src: s-grnd.json, wiki-grindr.md, wiki-bumble.md]. Caveat: the AI-native startup landscape itself is a documented ❓ — we could not capture it this run.
4. **Compliance-native architecture as a feature and a moat.** Build UK-OSA-grade age assurance, NCII takedown (TAKE IT DOWN), and duty-of-care evidence trails from day one, then market them. Incumbents pay compliance as cost and never advertise it; a new entrant can make "the dating app that verifies everyone and minimizes your data" the brand — directly answering the Grindr-HIV-settlement era of privacy expectations [src: wiki-osa.md, wiki-takeitdown.md, wiki-grindr.md].
5. **Monetization mechanics the incumbents proved but under-serve: weekly subs, a-la-carte, invite-only premium.** Grindr's $14.99/week works; Tinder Select at ~$499/mo proves an invite-only top tier has demand; HingeX at $49.99 proves $50/mo tolerance; dynamic pricing is documented at Tinder and Hinge. A new entrant can launch with weekly+monthly hybrid pricing and a-la-carte boosts without legacy subscription-engine baggage [src: s-grindr-price.json, s-tinder-price.json, tinder-plans.md, s-hinge-price.json].

Honorable mention (folded into #1/#2): Facebook Dating is "quietly gaining ground" per GDI (Sep 22 2026, headline-only ❓) — free distribution from a platform giant compresses the low end, which is one more reason a paid, niche, trust-first wedge beats a free mass-market clone.

---

## 6. Honest TAM Warning

Do **not** build a founder model on the $6.07B headline. The honest chain:

- The $6.07B is **declining** (first-ever drop, 2025) [src: businessofapps-market.md].
- **~54–57.5% belongs to Match Group** ($3.3B BoA vs $3.49B 10-K — both carried) and another ~13% to Bumble ($782M) — roughly two-thirds of the market is structurally unreachable to a new entrant on day one (Match's own Archer couldn't take share inside it and was shut in 3 years) [src: businessofapps-market.md, businessofapps-bumble.md, wiki-match.md].
- The addressable remainder (~$2B) is split across Grindr ($440M, growing, entrenched), Badoo/Happn legacy strength in Europe, and dozens of niche players — and the total global payer pool is only **~23M people (~6.6% of 350M users)**, currently shrinking at both Tinder (8.9M subs, down 2M from peak) and Bumble (3.2M payers, -16.4% YoY) [src: businessofapps-market.md, businessofapps-tinder.md, bmbl-q2.md].
- Realistic planning arithmetic for a niche entrant: capturing 0.5–1% of the world's dating payers (~115k–230k) at Grindr-like ARPPU ($26.51/mo would be optimistic; $10–20 blended more defensible) yields roughly a **$14M–$55M ARR** business at the optimistic end — a strong bootstrapped/indie outcome, not a venture-scale default. SOM in the low tens of millions of dollars is the honest planning number; anything above requires taking payers from incumbents in a declining-pool, zero-sum market with high CAC.
- Distribution reality: app-store take rates, paid-acquisition auctions the duopoly dominates, and regulatory load (UK age assurance, AU duty-of-care) all tax the new entrant hardest.
- Verdict from the prediction scorecard itself: "New-entrant TAM below headline ✅" — the research program predicted this and the evidence confirms it [digest §16.8]. Plan for a defensible $10–50M ARR niche outcome; treat anything larger as an exit (acquisition by Match, which is demonstrably buying — League, Sniffies) rather than a base case.

---

## 7. Prediction Scorecard — verdict table

Verdict legend: ✅ confirmed · ⚠️ partial · ❓ unconfirmed/no direct evidence.

| # | Prediction (from 00-scope.md) | Verdict | Evidence |
|---|---|---|---|
| 1 | Match remains leader but Tinder declining since 2023 | ✅ | Tinder revenue peaked 2023 ($1,918M) / 2024 ($1,941M), subs peaked 2022 (10.9M) → 8.9M; Q2'26 -1% [businessofapps-tinder.md, s-mtch-q2.json] |
| 2 | Bumble turnaround-or-distress | ✅✅ (distress confirmed) | -$906M net 2025; two impairment quarters; $0.7B valuation; BMBL $2.85; Q2'26 -14.7% [businessofapps-bumble.md, bmbl-q2.md, gdi-home.md] |
| 3 | ≥3 shutdowns/pivots post-2023 | ✅ | Archer shut Jun 2026; League absorbed; Kippo pivot (single-source); + Sniffies $100M stake as consolidation [wiki-match.md, s-league.json, s-deaths.json] |
| 4 | Monetization → weekly subs + AI + a-la-carte + price rises | ✅ | Grindr $14.99/wk; gAI + Edge premium AI tiers; Tinder Select ~$499; documented dynamic pricing at Tinder + Hinge [s-grindr-price.json, wiki-grindr.md, s-grnd.json, s-tinder-price.json, tinder-plans.md, s-hinge-price.json] |
| 5 | Gen Z fatigue real and measurable | ⚠️ PARTIAL | Indirect only: user declines, penetration table, Trustpilot verbatims, GDI headlines; no direct fatigue study captured ❓ [businessofapps-tinder.md, tp-tinder.md, gdi-home.md] |
| 6 | Regulation as moat | ✅ | OSA deadline + Persona bypass + VPN spike; TAKE IT DOWN; Australia duty-of-care; Grindr £26M; DSA [wiki-osa.md, wiki-takeitdown.md, gdi-home.md, wiki-grindr.md] |
| 7 | Asia regionally fragmented | ✅ | Japan = Match #2 market; Pairs geo-blocks all non-Japan IPs (observed); China Tantan (status ❓); India multi-player [wiki-match.md, pairs-home2.md, businessofapps-market.md] |
| 8 | New-entrant TAM below headline | ✅ | $6.07B declining; ~two-thirds held by MTCH+BMBL; 23M total payers; see §6 [businessofapps-market.md, businessofapps-bumble.md] |

Score: 7 confirmed, 1 partial (Gen Z fatigue — real but unquantified in corpus), 0 refuted.

---

## 8. What We Could NOT Verify (❓ register)

Honest limits of this run — none of the following should be quoted as fact in downstream decks:

1. **AI-native startup landscape** — no captured evidence (discovery engine died mid-run: tavily keyless 429-stormed after ~6 successes; SERPs blocked). Incumbent AI evidence only (Grindr gAI, Bumble wingman). Checked: gdi-home.md headlines, corpus-wide.
2. **Feeld Majestic pricing** — page fetched (feeld-majestic.md) but prices are JS/app-gated. Checked: feeld-majestic.md, feeld-membership.md, feeld-home2.md.
3. **CMB / Muzz / Raya / Inner Circle pricing** — SPA captures without static prices (cmb-home.md 17KB, muzz-home.md 24.6KB contain no price data).
4. **Tantan current status** — BoA roster mentions it; MOMO (Hello Group) still trades at $4.99 (Sep 23 2026) but no operating-status source captured.
5. **EU VAPP / DSA dating-specific obligations** — no dedicated source this run.
6. **The League sunset date** — acquisition confirmed via internal email (TechCrunch), sunset date absent.
7. **Gen Z fatigue quantitative study** — none captured; fatigue is inferred indirectly (declines, reviews, headlines).
8. **Bumble Chat-XP press release contents** — Aug 11 2026 title + date verified in bmbl-press.md index; PDF never fetched.
9. **"99% of women report abuse" study** — GDI headline only; the Australian study itself was not fetched.
10. **Facebook Dating "quietly gains ground"** — GDI headline only, no metrics.
11. **Sniffies $100M investment** — single source (wiki-match.md, Apr 2026).
12. **Grindr FY26 ≥$535M guidance (later ~$540M) + "Edge" tier** — single source (s-grnd.json search-result framing).
13. **Kippo metaverse pivot** — single source (s-deaths.json).
14. **Tinder engineering deep-dive** — monolith-decomposition, Elasticsearch-plugin, and ML posts exist but only as blog-listing titles/summaries (deep renders failed); cite as listing evidence only (tinder-eng.md).
15. **Match Feb 2026 full brand list** — Wikipedia portfolio table did not survive text extraction; portfolio reconstructed from context.
16. **Conflicts carried (both values, never averaged):** Tinder MAU 60M vs 75M (BoA internal); Tinder gender 75/25 vs 73/27 (BoA text vs table); Hinge launch Feb 2013 vs "2012" (BoA prose); Bumble payer series BoA-annual (2.4M FY25) vs IR-quarterly (3.2M Q2'26 — IR treated as authoritative); MTCH Q2'26 EPS $0.92/miss (Zacks framing) vs $0.70-vs-$0.97-est (Perplexity framing — different EPS definitions); Match revenue $3.3B (BoA) vs $3.49B (FY25 10-K); Grindr ARPPU $26.51 vs $25.51 (CNBC variant, s-grnd.json); Grindr users 13.5M MAU (Sep 2023, wiki) vs 8M (FY25 10-K basis, digest §6); Match CEO Rascoff (current, 2 sources) vs stale Bernard Kim listings on BoA; Grindr $440M FY25 (10-K) vs ≥$535M FY26 guidance, later ~$540M (consistent trajectory, different source classes).

---

## Sources (corpus files used in this document)

businessofapps-market.md, businessofapps-tinder.md, businessofapps-bumble.md, businessofapps-hinge.md, wiki-match.md, wiki-bumble.md, wiki-grindr.md, wiki-osa.md, wiki-takeitdown.md, bmbl-q2.md, bmbl-press.md, s-mtch-q2.json, s-grnd.json, s-league.json, s-deaths.json, s-tinder-price.json, s-hinge-price.json, s-grindr-price.json, tinder-plans.md, tinder-eng.md, grindr-unlimited.md, tp-tinder.md, tp-bumble.md, tp-match.md, gdi-home.md, gp-tinder.md, as-tinder.md, as-bumble.md, as-hinge.md, as-grindr.md, pairs-home2.md, muzz-home.md, trulymadly-home.md, feeld-majestic.md, feeld-membership.md, feeld-home2.md, cmb-home.md, happn-home.md, pure-home.md, bumble-eng.md, mtch-press.md, bumble-boost.md, plus backbone notes 01-master-facts-digest.md and verification-pass.md. (Quarantined/404 and NOT used: tinder-monolith2.md, tinder-monolith3.md, feeld-home.md, play-home.md, businessofapps-grindr.md, businessofapps-revenue.md.)

*Series: 01-market-analysis (market landscape + TAM ladder), 02-gap-blueocean-swot (gaps + strategy), 03-new-app-concept (founder playbook), 04-competitive-analysis (competitive matrix), 05-tech-stack-matrix (stack + build-vs-buy), 06-architecture-deployment (staged LiquidWeb deployment).*


---

<!-- ====================================================================== -->
<!-- FILE: 01-market-analysis.md -->
<!-- ====================================================================== -->

# Deliverable 01 — Market Analysis: Dating App Industry (US / EU / Asia + Forecast + TAM/SAM/SOM/TOM)

**Research program:** Dating App Industry Deep Dive, compiled 2026-09-23 (all corpus fetches live 2026-09-23 09:04–09:56 UTC)
**Writer basis:** Master facts digest (`notes/01-master-facts-digest.md`) + verification pass (`notes/verification-pass.md`) + the 17 spec-listed corpus files. Every number below is attributable to a corpus file cited inline. No network access was used by this writer; analysis is corpus-only.
**Audience lens:** a full-stack multiplatform developer + DevSecOps engineer evaluating this industry as a prospective founder. Every section closes with a "Founder lens (dev + DevSecOps)" reading of the data.

## Symbol legend

| Symbol | Meaning |
|---|---|
| ✅ | Confirmed by ≥2 independent corpus sources, or directly observed |
| 🟡 | Partial / paywalled / beta / single-source but plausible |
| ❌ | Absent from corpus (checked, not found) |
| ➖ | Not applicable |
| ❓ | Unconfirmed; corpus checked, nothing found — never guessed |

**Method note (integrity):** Where sources disagree, BOTH values are shown with sources; nothing is averaged or silently picked. Quarantined files (`tinder-monolith2.md`, `tinder-monolith3.md`, `feeld-home.md`, `businessofapps-grindr.md`, `businessofapps-revenue.md`) are never cited. One additional corrupted capture was detected during this write-up: `cmb-home.md` carries a Coffee Meets Bagel URL header but its body is a stale-tab Google SERP for LiquidWeb cPanel docs — same fetch-driver failure mode as the quarantined monolith files — so it is NOT cited as Coffee Meets Bagel evidence; CMB coverage here relies on the GDI podcast headline only [src: gdi-home.md].

---

## 1. Global market size & trajectory — the first-ever decline

### 1.1 Headline metrics (2025)

| Metric | Value | Basis / Source |
|---|---|---|
| Global dating app revenue, 2025 | **$6.07B — first-ever annual decline** (BoA, page updated Jun 11 2026) | [src: businessofapps-market.md] |
| Match Group share of that revenue | **$3.3B ≈ 54.4%** (BoA) — CONFLICT: FY2025 10-K revenue is **$3.49B ≈ 57.5%**; both carried, see §10 | [src: businessofapps-market.md], [src: wiki-match.md] |
| Worldwide users | **350M+** | [src: businessofapps-market.md] |
| Paying users | **~23M** → payer penetration ≈ 23/350 = **6.6%** | [src: businessofapps-market.md] |
| Implied blended annual spend per payer | $6.07B / 23M ≈ **$264/yr ≈ $22/mo** (arithmetic; consistent with live ARPPU/RPP data in §1.4) | derived |
| Most-downloaded app 2025 | Tinder, then Bumble | [src: businessofapps-market.md] |
| BoA top-apps roster | Tinder, Bumble, Hinge, Badoo, Happn, Grindr, Tantan, Plenty of Fish, Match, Raya; niche: "Pure, Feeld and Boo mix casual with niche interests" | [src: businessofapps-market.md] |
| Badoo geographic center of gravity | "frontrunner" in Europe and South America | [src: businessofapps-market.md] |
| BoA premium report scope | 111 charts, 1,488 data points, 22 apps | [src: businessofapps-market.md] |

The 2025 decline is the structural fact everything else hangs off: the category that grew for a decade — Tinder from $47M (2015) to $1.94B (2024) — has stopped growing at the top, while growth has concentrated in one generalist (Hinge), one mono-demographic incumbent (Grindr), and AI-monetization experiments. The global revenue series for years BEFORE 2025 is ❓ not captured in this corpus (BoA market page gives the 2025 figure and decline framing only) — so all multi-year series below are per-app, and the forecast in §7 builds scenarios bottom-up from those app series rather than extrapolating a global series.

### 1.2 Tinder — full revenue & subscriber series [src: businessofapps-tinder.md]

| Year | Revenue ($M) | YoY | Direct subscribers (M, Q2 basis) |
|---|---|---|---|
| 2015 | 47 | ➖ | 0.3 |
| 2016 | 169 | +259.6% | 1.1 |
| 2017 | 403 | +138.5% | 2.0 |
| 2018 | 805 | +99.8% | 3.7 |
| 2019 | 1,150 | +42.9% | 7.0 |
| 2020 | 1,410 | +22.6% | 8.2 |
| 2021 | 1,650 | +17.0% | 9.6 |
| 2022 | 1,794 | +8.7% | **10.9 (peak)** |
| 2023 | 1,918 | +6.9% | 10.4 |
| 2024 | **1,941 (peak $)** | +1.2% | 9.6 |
| 2025 | **1,840** | **-5.2% — first decline** | **8.9** |

Reading: subscribers peaked in 2022 (10.9M), revenue dollars peaked in 2024 ($1,941M) — the 2023–24 gap is price/ARPPU masking sub losses (the exact playbook: fewer payers paying more). Q2 2026 confirms the slide continuing but narrowing: revenue $457.5M -1% (-2% FX-neutral), payers 8.5M -5%, RPP $17.90 +4%, DAU -4% improving to -2.5% by July 2026; Tinder UX tests carried a $30–40M FY-negative P&L drag (down from $60M planned) [src: s-mtch-q2.json].

Other captured Tinder scale markers: 60M MAU (key-stats table) vs "75M MAU, 7.8M US" (FAQ) — **conflict, both carried** [src: businessofapps-tinder.md]; 400M+ lifetime downloads; 190 countries; 1.5M dates/week (company claim); active users log in ~4×/day (SurveyMonkey Intelligence, dated); Tinder was 57% of Match Group revenue in 2023.

### 1.3 Bumble Inc. — revenue, profitability, users, valuation series [src: businessofapps-bumble.md], [src: bmbl-q2.md], [src: wiki-bumble.md]

| Year | Revenue ($M) | YoY | Net income ($M) | Users (M) | Payers (M) | Valuation ($B) |
|---|---|---|---|---|---|---|
| 2015 | ➖ | ➖ | ➖ | 1 | ➖ | ➖ |
| 2016 | 10 | ➖ | ➖ | 8 | ➖ | ➖ |
| 2017 | 100 | +900% | ➖ | 12 | 0.2 | 1.0 |
| 2018 | 190 | +90% | ➖ | 17 | 0.4 | 1.5 |
| 2019 | 240 | +26.3% | ➖ | 22 | 0.8 | 3.0 |
| 2020 | 337 | +40.4% | -110 | 26 | 1.2 | 8.0 |
| 2021 | 532 | +57.9% | **+286 (only profitable year)** | 28 | 1.5 | 13.0 (IPO-era peak) |
| 2022 | 694 | +30.5% | -80 | 30 | 2.08 | 6.0 |
| 2023 | 844 | +21.6% | -1.9 | 38 | 2.4 | 5.7 |
| 2024 | **866 (peak)** | +2.6% | -768 | **42 (peak)** | 2.8 | 1.8 |
| 2025 | **782** | **-9.6%** | **-906 (worst)** | 35 | 2.4 | **0.7** |

Valuation collapse arithmetic: $13B (2021) → $0.7B (2025) = **-94.6% in four years**; live ticker BMBL $2.85 (Sep 23 2026) vs IPO-era pricing confirms no recovery [src: gdi-home.md]. Note the BoA payer series is annotated "values taken from Q2" — annual figures are Q2-basis; live IR quarterly payer counts supersede when in conflict (digest §15 rule 6): Q2 2026 IR shows Bumble App payers 2,077.1k and Badoo+Other 1,080.1k = 3,157.2k total — different scope (includes Badoo) and date, both bases carried [src: bmbl-q2.md].

Q2 2026 (primary IR, fetched live from ir.bumble.com) [src: bmbl-q2.md]:
- Total revenue $210.5M **-15.2%** (vs $248.2M); Bumble App $171.7M **-14.7%**; Badoo+Other $38.8M **-17.1%**
- Total payers 3,157.2k **-16.4%** (vs 3,777.2k) → **620k payers lost in 12 months**
- ARPPU: Bumble App $27.55 (+2.6% vs $26.85), Badoo $11.21, total $21.96 +1.2% — monetizing the remainder harder
- Net loss $127.9M including a **$169.3M impairment** (Q2'25 comparison: -$367.0M including $404.9M impairment — two consecutive impairment quarters); H1'26 net loss $75.3M vs H1'25 -$347.2M
- Adjusted EBITDA $72.9M (34.6% margin vs 38.1%); cash $154.0M vs debt $451.0M; April 2026 refinancing: $456.0M term loan in, $589.1M repaid, $7.0M issuance costs
- Goodwill written down $732.7M → $603.5M; intangibles $311.7M; total equity $616.6M
- Q3'26 guide: total $205–213M, Bumble App $167–173M, Adj EBITDA $56–60M
- Strategy quotes: Wolfe Herd — "completing our platform migration, transforming our matching algorithms… the reimagined Bumble"; CFO Cook — results at "higher end or above our guidance ranges… deliberately investing across product, technology, and brand"
- Portfolio surgery: Fruitz and Official discontinued (restructuring costs in the non-GAAP tables); BFF relaunched Sep 2025 and excluded from metrics

Product-era markers: launch Dec 2014 on Badoo's London infrastructure [src: wiki-bumble.md]; Aug 2026 the women-first rule was fully retired (men permitted to initiate) and the match window extended 24h → 72h [src: wiki-bumble.md]; Aug 2024 user base was 61% men / 37% women.

### 1.4 Hinge — the only major grower [src: businessofapps-hinge.md], [src: s-mtch-q2.json]

| Year | Revenue ($M) | YoY | Users (M) | Payers (M) |
|---|---|---|---|---|
| 2015 | ➖ | ➖ | 0.5 | ➖ |
| 2017 | 2 | ➖ | 2.4 | ➖ |
| 2018 | 8 | +300% | 4 | 0.1 |
| 2019 | 31 | +287.5% | 8 | 0.2 |
| 2020 | 90 | +190.3% | 13 | 0.5 |
| 2021 | 197 | +118.9% | 16 | 0.8 |
| 2022 | 284 | +44.2% | 20 | 1.06 |
| 2023 | 396 | +39.4% | 25 | 1.44 |
| 2024 | 550 | +38.9% | 28 | 1.53 |
| 2025 | **689** | **+25.3% (+420k payers added)** | 30 | **1.95** |

Q2 2026 [src: s-mtch-q2.json]: revenue **$204M +22%** (+20% FX-neutral); payers 2.0M +17%; RPP $33.11 +4% (highest RPP of any reported brand — the "designed to be deleted" premium holds); segment operating income $63.1M +62% (31% margin), EBITDA $79M +48% (39%); MAU +13%; entered 6 new European + 4 LatAm countries in the quarter; Match reaffirmed the **$1B revenue target for 2027** (arithmetic check: $689M × 1.25 = $861M in 2026, then $861M × 1.16 = $999.8M ≈ $1.0B — the target requires ~25% then ~16% growth).

Ownership: Match invested 2017 → 50% Jun 2018 → 100% Feb 2019. Leadership per BoA: CEO Jackie Jantos, CFO Bill Archer, CTO Ben Celebicic. Launch date conflict (Feb 2013 vs "2012") carried in §10. Voice notes on prompt answers are "one of the most popular features" [src: businessofapps-hinge.md].

### 1.5 Grindr and Match Group corporate — the other two majors

**Grindr** [src: wiki-grindr.md], digest §6 [src: s-grnd.json via digest]:
- FY2025 (Form 10-K): revenue **$440M**, net income **$94.8M**; users **8M (10-K basis, digest §6)** vs ~13.5M MAU (Sep 2023 wiki figure) — both carried (§10 C11) — profitable, unlike Bumble
- 2026: Q1 $130M +38%, Q2 +33% ($138.1M), FY26 guidance **≥$535M, later ~$540M** = +21.6% implied vs FY25 (single source, search-result framing — 🟡); ARPPU $26.51 +12% ($25.51 CNBC variant — conflict, see §10 C10); payers +16% (~1.4M milestone); "Edge" premium tier; gAI six-feature AI bundle tested 2025 for a premium tier
- Corporate history: founded Mar 25 2009; Kunlun bought 60% for $93M (Jan 2016) + remainder $152M (Jan 2018); CFIUS forced sale → San Vicente Acquisition $608.5M (Mar 2020); SPAC listing NYSE Nov 2022
- Regulatory/security ledger (DevSecOps case-study material): €10M Norwegian GDPR fine (data to 135 advertisers incl. HIV-status signals); Sep 2026 **£26M High Court settlement** (12,000 UK users, covert tracking + HIV-status sharing via analytics); trilateration location attacks 2014 (Egypt entrapment) and 2016 (Kyoto University colluding-trilateration); 2020 account-takeover-via-email password-reset flaw; banned/delisted in 13+ jurisdictions (China, Iran, UAE, Saudi Arabia…); UK age verification Jul 2025 (OSA) — CEO Arison says it cost ~7% of UK MAUs; **no US age verification** (Section 230)

**Match Group corporate** [src: wiki-match.md], [src: s-mtch-q2.json]:
- FY2025 (10-K, filed Feb 26 2026): revenue **$3.49B**, operating income $873M, net income $613M, total assets $4.46B, total equity **-$254M**, 2,200 employees
- Q2 2026: revenue $853.1M **-1%** (missed $856M consensus by 0.34%); Adjusted EBITDA $331M, 39% margin (+14%); total payers 13.3M -6%; total RPP $21.13 +6%; cost of revenue improved 24% vs 28% prior year; G&A -22%; EPS conflict carried in §10 ($0.92 Zacks-framing vs $0.70-vs-$0.97-est Perplexity framing); stock fell -7.49% post-earnings to $43.20
- Segments Q2'26: Tinder $457.5M -1%; Hinge $204M +22%; **E&E (Emerging & Established: Match, PoF, OkCupid, Meetic, Azar…) $179M -17%** (Azar redesign drag); indirect revenue $13M -28%
- Q3'26 guide: $885–895M (-2 to -3%), EBITDA $330–335M
- Portfolio: ~43 brands (Feb 2026 list: Tinder, Hinge, Match.com, Meetic, OkCupid, PoF, Azar, Her, Pairs, Match Japan, BLK, Chispa, Stir, Upward, Salams, Yuzu, The League, Sniffies minority…); Archer shut Jun 2026 (<3 years after Jun 2023 launch); Sniffies $100M minority stake Apr 2026 with acquisition option; HER acquired May 2025; Hyperconnect $1.73B (Feb 2021, largest ever); Russia exit by Jun 30 2023; Jan 28 2026 cyberattack ("limited" data); FTC suit (2019) settled 2025; Dec 2025 Denver rape-survivors lawsuit; World (Sam Altman) biometric partnership May 2025, Japan pilot; CEO Spencer Rascoff (named Feb 4 2025; 13% workforce cut May 2025)

### 1.6 Market structure summary

| Player (2025) | Revenue | Share of $6.07B | Trajectory (latest) |
|---|---|---|---|
| Match Group (all brands) | $3.49B (10-K) / $3.3B (BoA) — conflict | 57.5% / 54.4% | -1% Q2'26; Hinge growing, Tinder/E&E shrinking |
| Bumble Inc. (Bumble + Badoo) | $782M | 12.9% | -15.2% Q2'26, impairments, refinancing |
| Grindr | $440M | 7.2% | +38%/+33% Q1/Q2'26; FY26 ≥$535M guide (later ~$540M) |
| Everyone else (Happn, Feeld, Raya, Pure, Boo, eHarmony, TrulyMadly, Muzz, CMB, matrimony, LOVLQ remnant…) | ~$1.36B residual (arithmetic: 6.07 − 3.49 − 0.782 − 0.44) | ~22.4% | Fragmented; Happn claims 180M users worldwide [src: happn-home.md]; Muzz claims 20M users, 1M+ marriages [src: muzz-home.md] |

**Founder lens (dev + DevSecOps):** The growth pattern is unmistakable: revenue follows ARPPU engineering (Tinder RPP +4% on -5% payers; Bumble total ARPPU +1.2% on -16.4% payers; Grindr ARPPU +12% attributed partly to AI monetization). Every incumbent is converging on: tier proliferation + weekly subs + AI premium tiers + dynamic pricing. For a builder, that is both the competitive bar AND the attack surface — the payers leaving incumbents (620k from Bumble alone in 12 months; ~850k from Match) are a measurable acquisition pool worth ~$22/mo blended. On the DevSecOps side, the corpus's incident ledger (Grindr £26M settlement, Jan 2026 Match/Bumble breaches, trilateration classes at Grindr 2014/2016 and Bumble 2021/2024) shows privacy-by-design is not table stakes in this category — it is an unclaimed differentiator with legal billings attached.

Sources: businessofapps-market.md, businessofapps-tinder.md, businessofapps-bumble.md, businessofapps-hinge.md, bmbl-q2.md, s-mtch-q2.json, wiki-match.md, wiki-bumble.md, wiki-grindr.md, happn-home.md, muzz-home.md, gdi-home.md, notes/01-master-facts-digest.md (§2–§7).

---

## 2. United States market

### 2.1 Shares and rank

| Claim | Value | Status | Source |
|---|---|---|---|
| Tinder US rank | #1 by share | ✅ | businessofapps-market.md |
| Bumble US rank | #2 | ✅ | businessofapps-market.md (downloads order) + wiki-bumble.md ("one of the most popular dating applications in the United States") |
| Hinge US rank | **#3, with 22% share — fastest-growing** | ✅ | businessofapps-hinge.md |
| Hinge user geography | ~50% of users US; revenue ~70% US / ~15% UK | ✅ | businessofapps-hinge.md |
| Tinder revenue by country | US ~40%, UK ~10% (Sensor Tower) | ✅ | businessofapps-tinder.md |
| Tinder US MAU | 7.8M (FAQ figure; pairs with the 75M global FAQ variant) | 🟡 single-source within BoA | businessofapps-tinder.md |
| Facebook Dating | "Quietly Gains Ground on Dating Apps" (GDI headline, Sep 22 2026) | 🟡 headline only — no quantitative share data captured ❓ | gdi-home.md |
| Free-tier US age verification | ❌ none federally (Section 230 regime); state-level ❓ not captured | ✅ regime; ❓ state patchwork | wiki-grindr.md |

### 2.2 User penetration by app and age (Civic Science, % of US adults) [src: businessofapps-tinder.md]

| App | Overall | 18–24 | 25–34 | 35+ | Reading |
|---|---|---|---|---|---|
| Tinder | **30** | 40 | 25 | 12 | Strongest <35; the 35+ collapse is the story |
| Bumble | 22 | 25 | 22 | 14 | Flatter age curve than Tinder |
| Hinge | 15 | 20 | 19 | 7 | Youngest skew of the big three |
| Match.com | 10 | 3 | 6 | **15** | Inverts the pattern — 35+ is its base |
| Plenty of Fish | 6 | 5 | 3 | 12 | Legacy 35+ tail |
| eHarmony | 4 | 3 | 4 | 10 | Marriage-intent 35+ niche |

Structural read: the US market is now two markets. Under-35 is saturated and fatiguing (Tinder 40% penetration of 18–24s yet declining payers); 35+ is genuinely under-penetrated by swipe apps and defended by legacy brands (Match 15%, eHarmony 10% of 35+). GDI ran this exact thesis on Sep 21 2026: "Dating Apps Keep Chasing Gen Z. What About 40+?" [src: gdi-home.md] — a headline-level corroboration, no quantified study captured 🟡.

### 2.3 Tinder US demographics (the deepest captured demo set) [src: businessofapps-tinder.md]

| Dimension | Value | Note |
|---|---|---|
| Age | 35% 18–24, 25% 25–34, 20% 35–44, 8% 45–54, 10% 55+ | 60% under 35 |
| Gender | **75% male / 25% female (App Ape prose; F implied) vs 73M/27F (BoA table)** — internal BoA conflict, both carried (§10) | Either way: ~3:1 male skew in the US |
| Household income | modal bracket $60–80k at 30% | Mid-market, not premium |
| Engagement | ~4 logins/day (dated), 1.5M dates/week claim | Habitual-use product |
| India vs Europe gender | "male-female skew worse in India… Europe approximately 50/50" | Geography moves the skew (see §4) |

**Founder lens (dev + DevSecOps):** The Civic Science table is effectively a segmentation map for market entry. Two open lanes in the data: (1) the 35+/40+ segment — highest willingness-to-pay legacy brands, lowest swipe-app penetration, and Match's E&E segment (the 35+ portfolio home) is the worst performer at -17% Q2'26, meaning the incumbent defender is weakening; (2) the female-usage gap — a 3:1 male skew is a product-design failure mode (and Bumble's just-retired women-first experiment, Aug 2026, leaves that positioning genuinely vacant mid-flight). DevSecOps note: a US launch still means no age-verification mandate, but the TAKE IT DOWN Act (signed May 2025) + FTC precedent (Match's settled 2019 fake-profile suit) define the US trust floor.

Sources: businessofapps-tinder.md, businessofapps-hinge.md, businessofapps-market.md, wiki-bumble.md, wiki-grindr.md, wiki-match.md, gdi-home.md.

---

## 3. Europe market

### 3.1 Country-brand leadership

| Market | Leader / fact | Status | Source |
|---|---|---|---|
| UK | **Hinge #1** (also Ireland, Sweden, Norway, Denmark) | ✅ | businessofapps-hinge.md |
| UK revenue weight | ~10% of Tinder revenue; ~15% of Hinge revenue | ✅ | businessofapps-tinder.md, businessofapps-hinge.md |
| France | **Meetic** (Match Group brand, market-specific) | ✅ brand status; market share ❓ | wiki-match.md brand list |
| Continental legacy | **Badoo** "frontrunner" in Europe (and South America) | ✅ framing; current share ❓ (Badoo now inside Bumble Inc., Badoo+Other revenue -17.1% Q2'26) | businessofapps-market.md, bmbl-q2.md |
| Expansion vector | Hinge entered 6 new European countries in Q2'26 alone | ✅ | s-mtch-q2.json |
| Happn | Paris-origin ("Cross paths, date local", +180M users worldwide, "Open 24/7 since 2014") — European-born counter-position to swipe | ✅ claims captured; revenue ❓ | happn-home.md |
| Muslim Europe | Muzz (20M Muslims, chaperone/Wali feature, screenshot blocking) serves European diaspora | ✅ claims | muzz-home.md |

### 3.2 Regulatory overlay — Europe is the world's compliance laboratory

| Regime | What it does | Dating-app evidence in corpus | Source |
|---|---|---|---|
| **UK Online Safety Act 2023** | Duty of care; fines up to £18M or 10% global turnover; **Ofcom age-verification deadline Jul 25 2025** | Grindr complied Jul 2025 (and lost ~7% UK MAU to verification friction, per CEO Arison); VPN download spike documented as circumvention; Persona photo-based age verification bypassed with Death Stranding game-character images | wiki-grindr.md, wiki-osa.md via digest §11 |
| **EU DSA** | Platform obligations on majors (VLOP for some) | Applies to the majors; dating-specific VAPP detail ❓ not captured this run | digest §11 |
| **GDPR** | Privacy enforcement with teeth | Grindr €10M Norwegian fine (135 advertisers, HIV-status-adjacent data); Sep 2026 £26M UK High Court settlement (12,000 users) | wiki-grindr.md |
| EU product consequence | Verification/trust features ship in EU/UK first | Bumble ID-verification option 2025; Muzz selfie+SMS+location verification; TrulyMadly manual moderation | wiki-bumble.md, muzz-home.md, trulymadly-home.md |

**Founder lens (dev + DevSecOps):** Europe rewards compliance capability as product. The corpus shows three concrete proof points that UK OSA enforcement reshaped product roadmaps (Grindr's July 2025 verification, Arison's app-store-based-verification lobbying), that GDPR fines are now nine-figure-adjacent at category scale (Grindr €10M + £26M), and that Hinge is actively harvesting a pan-European growth lane the US brands neglected. For a DevSecOps founder: building age-verification, moderation, and data-minimization infrastructure FIRST is cheaper than retrofitting it (Grindr's €10M + £26M ≈ $40M+ in penalties exceeds the plausible seed-to-Series-B budget of a startup that does it right from day one). The ❓ on EU VAPP specifics is a real gap to close before a EU launch decision.

Sources: businessofapps-hinge.md, businessofapps-market.md, bmbl-q2.md, s-mtch-q2.json, wiki-grindr.md, wiki-bumble.md, happn-home.md, muzz-home.md, notes/01-master-facts-digest.md (§11, §12).

---

## 4. Asia market — regionally fragmented, walled, and skew-distinct

| Market | Facts captured | Status | Sources |
|---|---|---|---|
| **Japan** | **Match Group's #2 market after the US**; portfolio includes Pairs (Eureka, Inc.), Match Japan, Azar (Hyperconnect); WSJ-cited formula: "Match's Winning Formula for Online Dating in Japan Gives Women Control, Makes Men Pay"; World (Sam Altman) biometric verification piloted in Japan May 2025; Pairs **geo-blocks all non-Japan IPs** — directly observed this run | ✅ #2-market claim (wiki-match.md); ✅ geo-wall (pairs-home2.md, direct observation) | wiki-match.md, pairs-home2.md |
| **China** | Tantan was "first [Chinese dating app] to break through to general audiences" (BoA roster); Tantan's parent Hello Group still trades (MOMO $4.99 live, Sep 23 2026); current Tantan operating status ❓ not captured; Grindr is banned/delisted in China (CFIUS-origin ownership history) | 🟡 legacy claim; ❓ current status | businessofapps-market.md, gdi-home.md, wiki-grindr.md |
| **India** | Bumble launched Dec 2018 → **1M+ users in first 4 months** (Priyanka Chopra investor); TrulyMadly positions as "India's Most Trusted Free Online Matchmaking App" — 10M+ downloads, 4.0★/80k reviews, "ChowkAIdar 1.0" manual profile moderation, screenshot-blocking, compatibility quiz (Crescere Technologies Pvt. Ltd.); Tinder's male-female skew is **worse in India** than US (vs ~50/50 Europe) | ✅ Bumble India launch; ✅ TrulyMadly positioning captured | wiki-bumble.md, trulymadly-home.md, businessofapps-tinder.md |
| Asia-wide (Grindr) | Restricted/banned across Indonesia, Malaysia, Pakistan, Turkey, Jordan, Lebanon, Qatar (partial); full bans: China, Iran, Saudi, UAE, +9 others | ✅ | wiki-grindr.md |

Structural read (digest §16 prediction 7 — verified ✅): Asia is not one market. Japan is a monetization model (women free / men pay — the Pairs/Match Japan formula) hidden behind a hard geo-wall that also functions as a data-localization trust posture; China is effectively closed to Western apps (and its own champion's status is unquantified in this corpus); India is open, high-growth, structurally gender-skewed, and trust-first positioning (TrulyMadly's entire homepage is moderation and women's-safety features) is the local winning frame.

**Founder lens (dev + DevSecOps):** The Pairs geo-wall is the single most instructive artifact in the corpus for a builder: a global-scale dating product that concludes its trust model REQUIRES blocking all foreign IPs. That is the strongest possible signal that dating-market trust is geographic and regulatory, not global-network-effects, driven. India is the highest-upside open market in the corpus (1M users in 4 months for a 2018 entrant proves receptiveness), but the gender-skew data means a copy of US swipe mechanics will import US problems at worse ratios — TrulyMadly's moderation-first design (manual profile checks, screenshot bans) is the local answer and a template. DevSecOps: dating-app infrastructure for Asia means geo-fencing, data-residency, and censorship-resilience as first-class architecture concerns, not afterthoughts.

Sources: wiki-match.md, pairs-home2.md, wiki-grindr.md, wiki-bumble.md, trulymadly-home.md, businessofapps-tinder.md, businessofapps-market.md, gdi-home.md.

---

## 5. Other regions — Australia, LatAm, and the rest

| Region | Facts captured | Status | Sources |
|---|---|---|---|
| **Australia** | **Duty-of-care proposal for dating apps announced ~Sep 22 2026** (GDI featured story); same week, "**99% of Women Report Abuse on Dating Platforms, Australian Study Finds**" (study itself unfetched — headline only 🟡); Grindr precedent shows duty-of-care regimes arrive with compliance costs and user-attrition side effects | 🟡 proposal stage; 🟡 study headline | gdi-home.md, wiki-grindr.md |
| **Latin America** | Badoo legacy strength ("frontrunner" in South America); **Hinge entered 4 new LatAm countries in Q2'26**; Chispa (Match's US-Latino brand) in portfolio | 🟡 directional only — regional revenue/share data ❓ not captured | businessofapps-market.md, s-mtch-q2.json, wiki-match.md |
| MENA / Muslim world | Muzz (20M users, 950 couples/day claim, Wali chaperone feature); Match's Harmonica acquisition (Egypt, 2019); Salams in Feb 2026 brand list; Grindr severely restricted across the region | ✅ | muzz-home.md, wiki-match.md, wiki-grindr.md |
| Russia | Match exited by Jun 30 2023 (post-invasion) | ✅ | wiki-match.md |
| Africa | ❓ no market data captured (Harmonica acquisition is the only Africa datapoint) | ❓ | wiki-match.md |

**Founder lens (dev + DevSecOps):** Australia is the leading indicator to watch: if a duty-of-care regime lands there in 2027, it will be the English-speaking world's template after the UK OSA, and it converts trust infrastructure from cost-center to license-to-operate. LatAm is the corpus's honest blind spot ❓ — flagged, not guessed.

Sources: gdi-home.md, businessofapps-market.md, s-mtch-q2.json, wiki-match.md, muzz-home.md, wiki-grindr.md.

---

## 6. Live market tickers — Sep 23, 2026 (GDI homepage, fetched 09:39 UTC)

| Ticker | Company | Price | Day move | Founder reading |
|---|---|---|---|---|
| NASDAQ: MTCH | Match Group | **$43.16** | -0.09% | Post -7.49% earnings drop ($43.20); market cap far below the $30B at 2020 IAC spin-off [src: wiki-match.md] |
| NASDAQ: BMBL | Bumble Inc. | **$2.85** | +2.15% | Penny-stock territory vs $13B 2021 valuation; $451M debt vs $154M cash |
| NYSE: GRND | Grindr | **$15.89** | +3.18% | Only major in an uptrend (+38%/+33% recent quarters) |
| MEET | Meet Group (parent context: ParshipMeet/Harmonic — corpus context thin) | $6.29 | 0.00% | 🟡 ticker live; fundamentals ❓ not captured |
| MOMO | Hello Group (Tantan/MOMO, China) | $4.99 | +2.25% | Confirms Hello Group still trading; Tantan status ❓ |
| LOVLQ | Spark Networks (Zoosk etc., OTC) | **$0.00** | 0.00% | Zeroed quote — delisting/terminal state consistent with consolidation register (Archer shutdown, League absorption, Fruitz/Official discontinued) |

Consolidation context around these quotes: Match shut Archer Jun 2026, took a Sniffies minority stake Apr 2026 ($100M), absorbed The League (Jul 2022), acquired HER (May 2025); Bumble discontinued Fruitz and Official (Q2'26 restructuring); Kippo pivoted to "metaverse" (single source 🟡). The public-market tail (LOVLQ $0.00) and the M&A register together say: the long tail is being harvested, not funded.

Sources: gdi-home.md, wiki-match.md, bmbl-q2.md, notes/01-master-facts-digest.md (§8).

---

## 7. Forecast 2026–2028 — bear / base / bull (arithmetic shown)

**Method disclosure:** The corpus contains NO pre-2025 global revenue series (❓), so these scenarios are built bottom-up from captured per-app trajectories (§1.2–1.5) plus live Q2'26 segment data and company guidance. Every growth-rate assumption below is anchored to a captured number; the scenario arithmetic is fully shown so any assumption can be swapped.

### 7.1 Captured growth inputs (all from corpus)

| Driver | Latest captured rate | Source |
|---|---|---|
| Tinder FY2025 | -5.2% | businessofapps-tinder.md |
| Tinder Q2'26 | -1% (DAU decline narrowing -4% → -2.5% by Jul) | s-mtch-q2.json |
| Match Q3'26 guide | -2 to -3% | s-mtch-q2.json |
| E&E segment Q2'26 | -17% | s-mtch-q2.json |
| Hinge FY2025 | +25.3%; Q2'26 +22%; $1B 2027 target reaffirmed | businessofapps-hinge.md, s-mtch-q2.json |
| Bumble Inc FY2025 | -9.6%; Q2'26 -15.2%; Q3'26 guide implies continued mid-teens decline | businessofapps-bumble.md, bmbl-q2.md |
| Grindr FY26 guide | ≥$535M (later ~$540M) = +21.6% vs $440M FY25 | wiki-grindr.md, s-grnd.json via digest |
| Residual market (~$1.36B, §1.6) | No series captured ❓ — assumed flat to ±5% (stated assumption) | derived |

### 7.2 Scenario table (global revenue, $B; build = Match + Bumble Inc + Grindr + residual)

| Scenario | 2026 build (arithmetic) | 2026 | 2027 build | 2027 | 2028 build | 2028 |
|---|---|---|---|---|---|---|
| **Bear** — Tinder -5%/yr, Hinge decays to +8%, E&E -12%, Bumble -14% then -10%, Grindr fades to +2%, residual -3%/yr | Match 3.49×0.96=3.35; Bumble 0.782×0.84=0.66; Grindr 0.535; residual 1.36×0.96=1.31 | **5.86 (-3.5%)** | 3.35×0.955=3.20; 0.66×0.90=0.59; 0.535×1.05=0.56; 1.31×0.97=1.27 | **5.62 (-4.1%)** | 3.20×0.95=3.04; 0.59×0.92=0.54; 0.56×1.02=0.57; 1.27×0.97=1.23 | **5.38 (-4.3%)** |
| **Base** — Tinder -1.5% avg, Hinge +24%→+16% (hits $1B 2027), E&E -10% flattening, Bumble -13%→-5%, Grindr +21.6%→+12%→+8%, residual -1%/yr | Match 3.49×0.985=3.44; Bumble 0.782×0.87=0.68; Grindr 0.535; residual 1.35 | **6.01 (-1.0%)** | Match ≈3.47 (Hinge +$140M offsets); Bumble 0.68×0.95=0.65; Grindr 0.535×1.12=0.60; residual 1.33 | **6.05 (+0.7%)** | Match ≈3.53; Bumble 0.65×0.97=0.63; Grindr 0.60×1.08=0.65; residual 1.32 | **6.13 (+1.3%)** |
| **Bull** — AI tiers (gAI/Edge/Select/wingman) lift ARPPU category-wide, Tinder returns +2%, Hinge +25% sustained past $1B, Bumble pivot lands 2027 (+3%), Grindr +20%/yr holds, residual +3%/yr | Match 3.49×1.02=3.56; Bumble 0.782×0.88=0.69; Grindr 0.54; residual 1.40 | **6.19 (+2.0%)** | 3.56×1.045=3.72; 0.69×1.03=0.71; 0.54×1.20=0.65; 1.44 | **6.52 (+5.3%)** | 3.72×1.05=3.91; 0.71×1.08=0.77; 0.65×1.18=0.77; 1.48 | **6.93 (+6.3%)** |

### 7.3 Probability-weighted statements (qualitative, corpus-anchored)

- The **base case is a stagnant ~$6.0–6.1B market through 2028**: Match's internal mix shift (Hinge up, Tinder/E&E down) nets to roughly flat, and Grindr's +20% is real but only ~7% of the pool. This is consistent with BoA's own framing of 2025 as a slump, not a collapse.
- The **bear case is well-evidenced**: it is essentially "2025 repeats three more times" — every captured trend (payer -5% to -16% across majors, Gen Z fatigue signals, Trustpilot 1.0–1.3 ratings, 99%-abuse headline) points down if ARPPU extraction stalls.
- The **bull case hinges entirely on AI monetization**, which the corpus shows only in fragments: Grindr ARPPU +12% "AI spend paying off", gAI six features, Tinder Select $499/mo, Bumble "wingman" in development. No corpus source quantifies AI tier attach rates ❓ — so the bull case is directionally supported but unquantified.
- Payer-pool arithmetic for any entrant math: at ~23M global payers and blended ~$22/mo, every 100k payers captured ≈ **$26.4M ARR** (100,000 × $22 × 12).

**Founder lens (dev + DevSecOps):** In all three scenarios the growth pocket is the same: premium-ARPPU products (Hinge $33.11 RPP proves the ceiling) and trust-differentiated niches (Grindr's 17-year monopoly proves the niche ceiling at $535M+). The declining tail (Bumble App, E&E brands) is where ~1.5M+ departing payers/yr become addressable. Forecast risk factors a builder should monitor as leading indicators: MTCH Q3'26 print vs $885–895M guide, BMBL Q3 vs $205–213M guide, whether Hinge holds +20% through the 10 new-country expansion, and any first quantified AI-tier attach disclosure.

Sources: businessofapps-tinder.md, businessofapps-bumble.md, businessofapps-hinge.md, bmbl-q2.md, s-mtch-q2.json, wiki-match.md, wiki-grindr.md, notes/01-master-facts-digest.md (§2, §6, §16).

---

## 8. TAM / SAM / SOM / TOM for a NEW ENTRANT — the honest ladder

The digest's prediction 8 requires this deliverable to build a defensible funnel from the $6.07B headline down to what a new entrant can actually win — and to conclude honestly that the niche-entrant TAM is far below the headline.

### 8.1 The ladder (every step's assumption stated)

| Layer | Value | Derivation & assumptions (all swappable) |
|---|---|---|
| **Headline TAM** | **$6.07B** (2025 global dating-app revenue) | BoA figure. This is the incumbent revenue pool — NOT new-entrant opportunity. It is also declining (-2025) and 54–58% locked inside one company (Match). [src: businessofapps-market.md, wiki-match.md] |
| TAM realism adjustment #1 — geography | **~$4.7B** West-reachable | Subtract walled/closed markets: Japan's Pairs ecosystem geo-walled [pairs-home2.md], China closed [wiki-grindr.md], Russia exited [wiki-match.md]. Stated assumption: these carve-outs ≈ 20–25% of the pool. ❓ exact regional splits not captured. |
| **SAM #1 — launch geography (US-first, English)** | **~$2.4B** | US ≈ 40% of spend (Tinder's US revenue share, the only captured country split) [businessofapps-tinder.md]. Assumption: US share of global spend holds. |
| **SAM #2 — segment filter (worked example: trust-first, 28–45, relationship-intent)** | **~$240–360M/yr** | Civic Science: the 35+ bracket is where swipe apps under-serve (Tinder 12% vs Match 15% / eHarmony 10%) and where legacy defenders are shrinking (E&E -17%). Assumption: 10–15% of US spend sits in a trust-first, intent-serious segment reachable by a new brand. This is an assumption, not a captured market-size figure. |
| **SOM — 3-year obtainable** | **$2.6M–$26M ARR** | Conservative: 10k–30k payers × $180/yr ($15/mo) = $1.8M–$5.4M. Strong: 100k payers × $264/yr (market-blend $22/mo) = **$26.4M** — see §7.3 payer math. For scale: that is ~0.4–1.2% of the SAM #2 pool. |
| **TOM — 5–10 yr ceiling** | **$50M–$500M revenue class** | Floor evidence: the niche cohort (Feeld, Muzz at 20M users, TrulyMadly at 10M+ downloads, Happn at 180M users) — none has captured financials in corpus ❓, but none is a $1B player in any captured roster. Ceiling evidence: Grindr — a demographic-monopoly niche product — reached $440M→$535M+ with 21% margins and $94.8M net income [wiki-grindr.md]; Sniffies drew a $100M Match minority stake (valuation implied above $100M; stake % ❓) [wiki-match.md]. |

### 8.2 Why the headline number lies to a founder — three structural discounts

1. **Ownership concentration:** Match Group already owns 54.4–57.5% (both figures carried) of the headline number; Bumble Inc owns another ~13%. A new entrant competes for the ~22% residual plus whatever it can take from shrinking incumbents — not for $6.07B.
2. **The market is not growing (base case):** §7 base case is flat ~$6.0–6.1B through 2028. A new entrant's growth must be share-shift, and the share available to shift is measurably flowing out of Bumble App (-14.7%) and Match E&E (-17%) — roughly 1.5M+ departing payers per year at ~$22/mo blended.
3. **Niche arithmetic is unforgiving:** even the best captured niche outcome (Grindr) required ~17 years and category monopoly among gay men to reach $440M. A differentiated-but-not-monopoly niche realistic ceiling is the $50–200M class (Feeld/Muzz/Sniffies cohort), and a 3-year SOM in the single-digit-to-tens of millions ARR.

### 8.3 Honest conclusion (digest §16 prediction 8 — verdict ✅)

**The effective TAM for a niche new entrant is one to two orders of magnitude below the $6.07B headline: a realistic SAM of ~$240–360M (US trust-first segment), a 3-year SOM of $2.6M–$26M ARR, and a 5–10 year TOM ceiling of $50M–$500M revenue.** Founders quoting "$6B TAM" for a dating-app pitch are quoting the incumbents' revenue, not their own opportunity. The one scenario that beats this ladder is category re-definition (AI-native matching, or a verified-identity trust layer) — which the corpus flags as active incumbent strategy (gAI, Edge, wingman, World partnership), meaning an entrant's window there is real but contested and unquantified ❓.

**Founder lens (dev + DevSecOps):** The ladder says: budget for a $5–25M ARR business, price at $15–30/mo (the captured ARPPU band: Badoo $11.21 floor, Hinge $33.11 ceiling), target the 1.5M/yr departing-payer flow, and treat the compliance stack (age verification à la OSA, GDPR-grade data minimization, moderation-first UX à la TrulyMadly/Muzz) as the product moat the incumbents are legally forced to buy and culturally bad at shipping.

Sources: businessofapps-market.md, businessofapps-tinder.md, bmbl-q2.md, s-mtch-q2.json, wiki-match.md, wiki-grindr.md, wiki-bumble.md, muzz-home.md, trulymadly-home.md, happn-home.md, pairs-home2.md, gdi-home.md, notes/01-master-facts-digest.md (§2, §16).

---

## 9. Prediction scorecard — verdicts on market claims (digest §16)

| # | Claim (from scope) | Verdict | Evidence |
|---|---|---|---|
| 1 | Match Group leads but Tinder declining since 2023 | **✅ CONFIRMED** | Tinder subs peaked 2022 (10.9M), revenue peaked 2024 ($1,941M), 2025 -5.2% to $1,840M, 8.9M subs; Q2'26 payers 8.5M -5% [businessofapps-tinder.md, s-mtch-q2.json] |
| 2 | Bumble in distress/turnaround | **✅ CONFIRMED (severe)** | Revenue -9.6% FY25 → -15.2% Q2'26; net loss -$906M FY25; two consecutive impairment quarters ($404.9M, $169.3M); valuation $13B → $0.7B; BMBL $2.85; women-first rule retired Aug 2026 [businessofapps-bumble.md, bmbl-q2.md, wiki-bumble.md, gdi-home.md] |
| 3 | ≥3 shutdowns/pivots post-2023 | ✅ (consolidation register) | Archer shut Jun 2026; The League absorbed; Fruitz/Official discontinued; Kippo pivot (single source 🟡); Sniffies stake as counter-signal [wiki-match.md, bmbl-q2.md, s-deaths.json via digest] |
| 4 | Monetization shifting to weekly subs / AI / a-la-carte / price rises | **✅ CONFIRMED** | Grindr $14.99/week; gAI + Edge AI tiers; Tinder Select ~$499/mo; ARPPU up everywhere payers fall (Tinder RPP +4%, Bumble +1.2%, Grindr +12%) [s-grindr-price.json via digest, s-mtch-q2.json, bmbl-q2.md] |
| 5 | Gen Z fatigue real and measurable | **🟡 PARTIAL — indirect only** | Supporting: payer declines, Civic Science young-skew saturation, Trustpilot 1.0–1.3, GDI "chasing Gen Z" op-ed Sep 21 2026. Direct quantitative fatigue study ❓ NOT captured [businessofapps-tinder.md, gdi-home.md] |
| 6 | Regulation becoming a moat | **✅ CONFIRMED** | UK OSA deadline Jul 25 2025 + Grindr compliance + 7% UK MAU loss + Persona bypass + VPN spike; TAKE IT DOWN Act signed May 2025; Australia duty-of-care proposal Sep 22 2026; Grindr £26M settlement [wiki-grindr.md, wiki-osa.md via digest, gdi-home.md] |
| 7 | Asia regionally fragmented | **✅ CONFIRMED** | Japan: Match #2 market + Pairs geo-wall (directly observed); China: closed/banned + Tantan status ❓; India: open, gender-skewed, trust-first local leader [wiki-match.md, pairs-home2.md, wiki-grindr.md, trulymadly-home.md] |
| 8 | New-entrant TAM far below headline | **✅ CONFIRMED & QUANTIFIED (§8)** | Ladder: $6.07B headline → ~$2.4B US SAM → ~$240–360M segment SAM → $2.6–26M 3-yr SOM → $50–500M TOM ceiling |

---

## 10. Conflicts register — BOTH values carried everywhere, never averaged

| # | Conflict | Value A (source) | Value B (source) | Handling |
|---|---|---|---|---|
| C1 | Tinder MAU | 60M (BoA key-stats table) | 75M + 7.8M US (BoA FAQ) | Both shown; BoA-internal variance |
| C2 | Tinder US gender split | 75% M / 25% F (App Ape text) | 73% M / 27% F (BoA table) | Both shown; either way ~3:1 |
| C3 | Match Group 2025 revenue | $3.3B (BoA, ≈54.4% of market) | $3.49B (FY2025 10-K via wiki-match.md, ≈57.5%) | Both shown; 10-K is the SEC filing, BoA is the aggregator — never averaged |
| C4 | MTCH Q2'26 EPS | $0.92, missed Zacks consensus by 5.15% (Zacks/Yahoo framing) | $0.70 vs $0.97 estimate, -27.84% (Perplexity framing) | Different EPS definitions (likely GAAP vs adjusted); both carried with attribution |
| C5 | Hinge launch | Feb 2013 (BoA overview) | "Launched in 2012" (BoA prose) | Both carried |
| C6 | Match CEO | Spencer Rascoff (current; named Feb 4 2025; 2 sources) | Bernard Kim (BoA stale listing) | Rascoff wins on sourcing; Kim flagged stale, not a true conflict |
| C7 | Bumble payer basis | BoA annual 2.4M (2025, "values taken from Q2") | IR quarterly: Bumble App 2,077.1k + Badoo 1,080.1k = 3,157.2k total (Q2'26) | Different scopes/dates; IR quarterly authoritative per digest §15.6 |
| C8 | Grindr trajectory | FY25 $440M (Form 10-K via wiki) | FY26 ≥$535M guidance (search-result framing, single source) | Consistent (guide = +21.6%); source-quality difference noted |
| C9 | CMB evidence base | cmb-home.md captured (17KB) | Content is a corrupted stale-tab Google SERP for LiquidWeb docs | Detected this run; file NOT used as CMB evidence; CMB covered via GDI podcast headline only |
| C10 | Grindr ARPPU | $26.51 +12% (powerdrill framing) | $25.51 +12% (CNBC); 05 §6 also carries $24.25 (koalagains) | Both shown [src: s-grnd.json]; single search-results source family — variance flagged, never averaged |
| C11 | Grindr user count | ~13.5M MAU (Sep 2023 figure, wiki page text) | 8M users (FY25 10-K basis, digest §6; not present in wiki page text) | Different metrics/dates, both carried — same treatment as 04 §4.4 [src: wiki-grindr.md, digest §6] |

---

## 11. Unknowns register (❓ — checked, not found; never guessed)

| Item | What was checked | Status |
|---|---|---|
| Global dating-app revenue series pre-2025 | businessofapps-market.md (gives 2025 + decline framing only); businessofapps-revenue.md is a 404 quarantine | ❓ |
| LatAm market size / shares | businessofapps-market.md (Badoo "frontrunner" line only), s-mtch-q2.json (Hinge 4-country entry), wiki-match.md (Chispa) | ❓ directional only |
| EU VAPP / DSA dating-specific obligations | digest §11 flags; no dedicated corpus file | ❓ |
| Tantan current operating status | MOMO ticker live ($4.99); BoA legacy claim; nothing current | ❓ |
| Feeld Majestic / CMB / Muzz Gold / Raya / Inner Circle pricing | feeld-majestic.md JS-gated; muzz-home.md names Muzz Gold, no price; cmb-home.md corrupted (C9); others SPA-gated | ❓ |
| Gen Z fatigue direct quantitative study | GDI headlines + Trustpilot + user declines only | ❓ |
| AI-tier attach rates / AI revenue quantification | gAI/Edge/Select/wingman named; no attach or revenue figures | ❓ |
| The League sunset date | Consolidation register (s-league.json); date not captured | ❓ |
| Match Feb 2026 brand-table extraction | Digest §15.8 said the table didn't survive extraction; QC re-check of wiki-match.md found the flattened 44-line brand list IS present (incl. Sniffies "(minority stake)") — §1.5 portfolio reconciles with it | ✅ (QC-corrected vs digest §15.8) |
| Sniffies stake % / implied valuation | wiki-match.md ($100M minority + option) | ❓ |
| Happn / TrulyMadly / Muzz / Feeld revenue | Homepages captured (claims only: 180M users / 10M+ downloads / 20M users / ➖) | ❓ |

---

## 12. Synthesis for the founder (both lenses, ten lines)

1. **Market state:** $6.07B, first-ever decline (2025), base-case flat through 2028 — a share-shift market, not a rising tide.
2. **Winner pattern:** ARPPU + trust > user growth. Hinge ($33.11 RPP, +22%) and Grindr (ARPPU +12%, 21% margins) win on monetized trust/intent; Tinder and Bumble monetize harder while shrinking.
3. **Open lanes in the data:** 35+/40+ (Civic Science inversion + E&E -17%); the vacated women-first position (Bumble retired it Aug 2026); departing-payer flow (~1.5M/yr, ~$22/mo).
4. **Honest ceiling:** $50–500M TOM; $2.6–26M 3-yr SOM. Plan the business, not the headline.
5. **Engineering reality check:** incumbents carry real technical debt — Bumble's 2005-era Badoo stack forcing "Bumble 2.0" full rewrite; Tinder mid-monolith-decomposition; a greenfield stack is a genuine 2–3 year advantage window.
6. **DevSecOps is the moat:** OSA age verification, DSA/GDPR exposure (Grindr €10M + £26M), trilateration vuln classes (Grindr 2014/2016, Bumble 2021/2024), Jan 2026 Match/Bumble breaches — privacy-by-design and verification-first are unclaimed differentiators with legal billings attached.
7. **Geography is strategy:** US = ARPPU pool; UK/EU = compliance laboratory + Hinge's open lane; Japan = walled proof that trust models can be geo-exclusive; India = volume + moderation-first design mandate; LatAm ❓ blind spot.
8. **Watch-list (leading indicators):** MTCH Q3'26 vs $885–895M guide; BMBL Q3 vs $205–213M; Hinge hold-rate through 10 new countries; first AI-tier attach disclosure; Australia duty-of-care outcome.
9. **Consolidation posture:** the tail is being harvested (LOVLQ $0.00, Archer shut, League absorbed) — acquisition by Match (Sniffies pattern) is a legitimate exit path for a niche winner.
10. **Every number above** is corpus-attributed, conflicts are carried dual-value, and unknowns are flagged — the analytic frame is designed so any single assumption can be swapped as new data lands.

---

## Sources (corpus files used in this deliverable)

**Backbone notes:** 01-master-facts-digest.md; verification-pass.md.

**Corpus pages cited directly:** businessofapps-market.md, businessofapps-tinder.md, businessofapps-bumble.md, businessofapps-hinge.md, bmbl-q2.md, s-mtch-q2.json, wiki-match.md, wiki-bumble.md, wiki-grindr.md, happn-home.md, muzz-home.md, trulymadly-home.md, pairs-home2.md, gdi-home.md.

**Cited via the master digest:** s-grnd.json (§1.5, §6, §7.1, C8, C10), s-grindr-price.json (§9 row 4), s-deaths.json (§9 row 3), wiki-osa.md (§3.2, §9 row 6).

**Referenced but not used as evidence:** cmb-home.md (corrupted stale-tab capture detected this run — see §10 C9; CMB covered via the GDI podcast headline only).

**Quarantined (never cited):** tinder-monolith2.md, tinder-monolith3.md, feeld-home.md, businessofapps-grindr.md, businessofapps-revenue.md.


---

<!-- ====================================================================== -->
<!-- FILE: 02-gap-blueocean-swot.md -->
<!-- ====================================================================== -->

# 02 — Gap Analysis, Blue Ocean Canvas & Founder SWOT
## Dating App Industry Deep Research — compiled 2026-09-23

Deliverable 2 of the dating-app-industry research program. Grounded exclusively in the 56-file local corpus (fetched live 2026-09-23 09:04–09:56 UTC) plus the master facts digest (`scratch/notes/01-master-facts-digest.md`) and verification pass (`scratch/notes/verification-pass.md`). Quarantined files (tinder-monolith2.md, tinder-monolith3.md, feeld-home.md, businessofapps-grindr.md, businessofapps-revenue.md) are not cited anywhere in this document.

**Evidence standard used throughout:**

| Tag | Meaning |
|---|---|
| [doc] | Documented fact — directly traceable to a corpus file (cited inline) |
| [doc-verbatim] | Verbatim user/stakeholder quote captured in corpus, quoted exactly |
| [inference] | Analyst inference — reasoning built on documented evidence but NOT itself documented; always flagged |
| ❓ | Unknown — checked for, not found in corpus; never guessed |

**Symbol legend (feature/positioning matrices):** ✅ confirmed present · ❌ absent · 🟡 partial / paywalled / beta / jurisdiction-limited (footnoted) · ➖ not applicable · ❓ unconfirmed in corpus.

**Reader:** full-stack multiplatform developer + DevSecOps engineer evaluating entry as a founder. Product-market analysis is filtered through a build/security lens where it changes the recommendation.

---

## 1. Executive read (mentor summary)

The corpus describes a market at an inflection point, not a growth point. Global dating-app revenue posted its **first-ever annual decline in 2025 ($6.07B)** [doc — businessofapps-market.md], Match Group holds ~54% of it ($3.3B BoA; the FY2025 10-K says $3.49B ≈ 57.5% — both values carried per program rules) [doc — businessofapps-market.md, wiki-match.md], and every signal of user sentiment captured in this corpus is abnormally bad: Trustpilot 1.1 (Tinder), 1.3 (Bumble), 1.0 (Match) — all "Bad," with 87–91% one-star distributions [doc — tp-tinder.md, tp-bumble.md, tp-match.md]. The single highest-rated dating brand visible in the corpus is **Tawkify at 4.6 (8K reviews)** — a human-matchmaking service [doc — tp-match.md sidebar]. That contrast is the thesis of this document in one data point: **the incumbents' pain is concentrated exactly where a quality-first entrant's value proposition would live — trust, verification, support, and outcome alignment — and the market has already shown it will rate a service highly when humans and outcomes, not engagement metrics, are the product.**

The gaps with the strongest documented evidence are: (1) universal verification (a Match user literally asks "Match could insist on photo verification for every profile… but they don't, so you have to ask yourself why" [doc-verbatim — tp-match.md, KJM]); (2) the post-match experience (matches decay into silence; a Bumble user describes abandoning the app over it [doc-verbatim — tp-bumble.md, Sheryll Pettibone]); (3) honesty economics (pervasive, specifically-articulated suspicion that paying makes outcomes *worse* [doc — tp-bumble.md Tonya G; tp-tinder.md toby maddox]); and (4) demographics the majors chase least — 40+ [doc — gdi-home.md headline "Dating Apps Keep Chasing Gen Z. What About 40+", Sep 21 2026].

Regulation (UK OSA, US TAKE IT DOWN Act, Australia's proposed duty of care) is a double-edged sword the corpus documents on both edges: it raises fixed compliance costs (a real barrier — small forums shut over OSA compliance cost [doc — wiki-osa.md]) while simultaneously creating compliance-native product surfaces (age assurance, NCII takedown SLAs, cyberflashing response) that a DevSecOps-strong entrant can build as *features* rather than as legal-department afterthoughts [inference].

Where NOT to enter: the casual-swipe scale game (Tinder's 60M/75M MAU + in-house Elasticsearch/ML stack is an unassailable scale moat in a *declining* pool), and "women-first" as a positioning wedge — Bumble just abandoned it (Aug 2026) from a position of distress, which poisons the territory for a decade [doc + inference — wiki-bumble.md via digest §4].

**Conflicts carried (never averaged, per program rules):** Tinder MAU 60M vs 75M; Tinder gender split 75/25 vs 73/27; Hinge launch 2012 vs Feb 2013; Match revenue $3.3B (BoA) vs $3.49B (FY25 10-K); Grindr FY25 $440M (10-K) vs FY26 ≥$535M guidance (different sources, consistent trajectory). Full register in §8.

---

## 2. Pain-Point Ledger — every documented user pain, with evidence

This ledger consolidates every distinct, corpus-documented pain point. Primary mine: Trustpilot captures for Tinder (5,103 reviews, 1.1, 89% 1-star, 642 reviews in last 12 months, *unclaimed profile*), Bumble (2,604 reviews, 1.3, 87% 1-star, 437 in last 12 months, claimed but "Hasn't replied to negative reviews"), and Match.dk (1,336 reviews, 1.0, 91% 1-star, 50 in last 12 months) [doc — tp-tinder.md, tp-bumble.md, tp-match.md]. Trustpilot's own caveat applies: "This company hasn't invited customers recently, so reviews may not be representative" [doc — all three files] — sentiment is self-selected toward the aggrieved; the *content patterns*, cross-validated across three independent brand pages and corroborated by financial declines and regulatory events, are the signal, not any single rating.

### 2.1 Master ledger table

| # | Pain cluster | Specific pain | Evidence (verbatim or tight paraphrase) | Where documented | Apps implicated | Status |
|---|---|---|---|---|---|---|
| P1 | Fake profiles & bots | Fake/spam profiles platform-wide | "Customers frequently complain about encountering numerous fake profiles and spam bots across the entire platform" (Trustpilot AI summary of 275 recent reviews) | tp-tinder.md | Tinder | [doc] |
| P1 | Fake profiles & bots | Template-fake photo patterns (hotel rooms, driver-seat selfies) | "Pictures taken in a neutral room, usually a Hotel… Pictures from a car driving seat… Overly professional pictures" — reviewer Rob, Sep 14 2026 | tp-tinder.md | Tinder | [doc-verbatim] |
| P1 | Fake profiles & bots | Attractive fakes appear exactly when free likes run out | "When you start to get to the end of your free likes, Stunning women start to appear local to you. When your likes refresh, these women do not appear." — Rob | tp-tinder.md | Tinder | [doc-verbatim] |
| P1 | Fake profiles & bots | Scammers active, real users inactive | "It's full of scammers who are very active and there are just a very few real women who are very inactive." — Lucius Allen | tp-tinder.md | Tinder | [doc-verbatim] |
| P1 | Fake profiles & bots | Fake women as inventory | "I've figured out that most of the women on Bumble are actually fake." — chris jude; "Putting fake profiles of beautiful women isn't going to be successful" — ashley moore (Tinder) | tp-bumble.md, tp-tinder.md | Bumble, Tinder | [doc-verbatim] |
| P1 | Fake profiles & bots | AI chatbots with no memory posing as matches | "they send generic messages, and then after you respond, the next day they ask the same question. So clearly AI with no long-term memory." — Scott Scott | tp-match.md | Match | [doc-verbatim] |
| P1 | Fake profiles & bots | Stolen photos used by scammers | "Found a friend's photos being used by a scammer." — KJM | tp-match.md | Match | [doc-verbatim] |
| P1 | Fake profiles & bots | "99% fake" perception | "99% are fake account using fake pictures of nice looking people and AI chats." — Lori Andert | tp-match.md | Match | [doc-verbatim] |
| P1 | Fake profiles & bots | Romance-scam money funnel, platform-matched | "they want you to leave the site and communicate with them directly. Next they give you a sob story to get you to start hemorrhaging money… The so called expert matching people even matched me up and encouraged me to communicate with a scammer!!!" — M H | tp-match.md | Match | [doc-verbatim] |
| P1 | Fake profiles & bots | Fake profiles as physical-danger vector | Fake profiles on Grindr used by predators and police to "entrap, extort money from, or physically torture LGBTQ people in Egypt, Iraq, Jordan, Lebanon, and Tunisia" (HRW 2023) | wiki-grindr.md | Grindr | [doc] |
| P2 | Billing, refunds & subscription traps | Paid tier removes core ability to communicate | "I paid £9.99 for a week. I can't talk to anyone and can't even see who likes me." — jim Berry; "can't even talk to someone without paying 18.99 wtf" — Alexander Martinez | tp-tinder.md | Tinder | [doc-verbatim] |
| P2 | Billing | Charged immediately after cancellation | "I had canceled my subscription and was charged the very next day $119.00… I received an auto generated message saying match does not offer refunds" — Thomas Stclair | tp-match.md | Match | [doc-verbatim] |
| P2 | Billing | Hidden auto-renewal | "My subscription auto renewed despite in not appearing in the Play store. The app doesn't tell you this (apparently it's in the T&C's…)." — Chris Parkin | tp-bumble.md | Bumble | [doc-verbatim] |
| P2 | Billing | Post-cancel re-billing, bot-only support, no refunds | "I went to cancel but they had already billed me an additional $32.99 for another week… don't even have a LIVE agent to speak with, just a bot. And they don't offer refunds." — Shaun Tucker | tp-bumble.md | Bumble | [doc-verbatim] |
| P2 | Billing | No refund, no proration, no reason | "they don't even prorate the days you used the app. They don't even give a reason why they deactivate your account." — jing na | tp-bumble.md | Bumble | [doc-verbatim] |
| P2 | Billing | Lifetime subscription not honored; email support removed | "they have removed all standard communications paths via email to be replaced with an AI bot which does not store requests… Have to file a smalls claims court proceedings against them to get a refund." — Caitriona | tp-bumble.md | Bumble | [doc-verbatim] |
| P2 | Billing | Statutory-rights collision (UK Consumer Rights Act) | "Breach of Consumer Rights Act… Google play and Tinder are ripping people off not allowing what by BRITISH law you are allowed… I will be opening a claim with my bank as I have video evience." — Flavour Tasters | tp-tinder.md | Tinder | [doc-verbatim] |
| P2 | Billing | Escalation to Trading Standards with transaction IDs | "Match support keeps sending automated loops claiming they 'cannot find my profile,' despite me providing valid Google Play transaction IDs… Escalating to UK consumer protection / Trading Standards." — Ben Artistic | tp-match.md | Match | [doc-verbatim] |
| P2 | Billing | Perpetual upsell inside a paid product | "the website keeps sending you 'premium' matches for extra costs… only available to 'superlike' under 'highlights' sent weekly, which eventually expire lol." — Anna Slupik; "They advertise virtually the entire time… It costs a LOT in comparison, because they charge per quarter or per year." — Phil Cheney | tp-match.md | Match | [doc-verbatim] |
| P3 | No matches / dead conversations / algorithm distrust | Algorithm accused of suppressing matches by design | "Tinders algorithm is designed for you not to get a match. Actually disgusting company that profits off lonely men… trapped inside tinders Ponzi scheme." — toby maddox | tp-tinder.md | Tinder | [doc-verbatim] |
| P3 | Algorithm distrust | Paying makes visibility WORSE (perception) | "when you dont pay you get matches, once you pay matches become nil" — Pema; "after paying for the Premium version, within a couple days suddenly now I get ZERO likes, as if my profile has been buried at the bottom of the algorithm" — Tonya G | tp-bumble.md | Bumble | [doc-verbatim] |
| P3 | Algorithm distrust | Structural conflict of interest stated by user | "It's obviously a conflict of interest for them to actually match you effectively." — Annie S | tp-match.md | Match | [doc-verbatim] |
| P3 | Dead conversations | Matches that never message | "I get plenty of matches, no communication." — Stuart Clarke; "2 x messages which for me were not suitable… not a message returned from any of them!!!" — Adrian Evans | tp-tinder.md, tp-bumble.md | Tinder, Bumble | [doc-verbatim] |
| P3 | Dead conversations | Volume swiping with zero yield | "I've liked literally every woman on the site, yet I get no matches." — Daniel Boustead | tp-match.md | Match | [doc-verbatim] |
| P3 | Dead conversations | One-message ghosts | "they send one message, then literally dissapear before I can even respond." — Scott Scott | tp-match.md | Match | [doc-verbatim] |
| P3 | Thin inventory illusion | Deck exhaustion, then mis-selling loop | "run out of profiles after about 10 swipes! Out of all over the uk and Ireland 10 swipes!?… as soon as I cancel the subscription… bumble missells the same script on repeat!" — Consumer GB | tp-bumble.md | Bumble | [doc-verbatim] |
| P3 | Location abuse | Distance filters ignored | "Set my range to 29km yet I'm constantly getting swiped right daily by woman in Kenya!" — Johnathan West (Tinder); "I kept getting likes from people 1000s of miles away. Why?" — Annie S (Match) | tp-tinder.md, tp-match.md | Tinder, Match | [doc-verbatim] |
| P3 | Location abuse | Passport-mode location fights the user | "set my Location to Thailand.. and they keep changing it to another town.. Then they show matches 8,000 miles away" — Max | tp-tinder.md | Tinder | [doc-verbatim] |
| P4 | Abuse, harassment & women's safety | 99% of women report abuse (Australian study) | GDI headline, Sep 22 2026: "99% of Women Report Abuse on Dating Platforms, Australian Study Finds" — headline only; study itself not fetched ❓ | gdi-home.md | industry-wide | [doc] (headline) |
| P4 | Women's safety | Stalking-feel on-platform | "they allow men to leave me creepy I mean really creepy comments on my page. It was like low key being stalked… ladies girls you were warned." — Sarah Carlton | tp-bumble.md | Bumble | [doc-verbatim] |
| P4 | Women's safety | Safety complaints ignored by support | "support said that they are aware of the problem. That's all. There's a problem. They are aware of it. And tough." — Sean Sweeney | tp-bumble.md | Bumble | [doc-verbatim] |
| P4 | Abuse | Cyberflashing criminalized, platforms must respond | OSA added cyberflashing offence to Sexual Offences Act 2003; first conviction March 2024 | wiki-osa.md | UK-relevant industry | [doc] |
| P4 | Abuse | Violent ambush via fake profiles | "The use of fake profiles on Grindr by homophobic predators to entrap and assault LGBTQ people is common in various countries." | wiki-grindr.md | Grindr | [doc] |
| P5 | Opaque bans, moderation & appeal | Lifetime bans for nothing, no appeal | "anybody reports you for absolutely nothing permanent lifetime ban and now you absolutely cannot get around it with the video selfie." — Aren | tp-tinder.md | Tinder | [doc-verbatim] |
| P5 | Opaque bans | Banned for private consensual chat | "I got My Tinder account closed down with the explanation i had sexuel business kind" after "sexuel chat… totally innocent" between two adults — Christian B Andersen | tp-tinder.md | Tinder | [doc-verbatim] |
| P5 | Opaque bans | Guilt-by-encounter with sex workers | "My account was blocked because I supposedly bought or sold sexual services. I appealed the decision (you cannot even explain yourself - it's a dictatorship, you just click a button)." — Mo; also documents sex workers "perfectly allowed by the company to thrive" (SE Asia) | tp-bumble.md | Bumble | [doc-verbatim] |
| P5 | Opaque bans | Ban after paying, no explanation | "blocked without any explanation… shortly after paying" — Hamid.shadman; "banned after 2 days… Reason wasn't given. Just banned." — Phyllis Jenks | tp-match.md | Match | [doc-verbatim] |
| P5 | Opaque bans | Support stonewalls ban inquiries | "We consider this matter closed and will not respond to further replies." (Match support, to a password-recovery request misread as a ban appeal) — AC | tp-match.md | Match | [doc-verbatim] |
| P5 | Opaque bans | 10+ emails, zero follow-up on ban | "I have sent over 10 emails to them to try and fix my account. Their customer service sucks." — Cheryl R | tp-match.md | Match | [doc-verbatim] |
| P6 | Support is an AI loop | Bot circles, closed tickets, month-long waits | "an AI bot that goes round in circles, then 3 weeks to get a reply… then when you reply, it says the issue is closed and you have to start all over again??" — RB; "robotic answers which is very stupid and shows they have not read your complaint" — Greg (Match) | tp-bumble.md, tp-match.md | Bumble, Match | [doc-verbatim] |
| P6 | Support | Support vanishes after ID submission | "As soon as they asked for my ID, I sent it immediately. After that, they simply disappeared. It has now been months." — Paul S | tp-bumble.md | Bumble | [doc-verbatim] |
| P6 | Support | Zero human support even for payers | "zero customer service even if you pay for Tinder Gold" — Johnathan West; "No customer service phone usless automated service" — Joseph Vucak (Match) | tp-tinder.md, tp-match.md | Tinder, Match | [doc-verbatim] |
| P7 | Broken verification & data hostage | Face verification fails, locks out paying lifetime user | "The technology is so poor and does not recognise me. I am now locked out of an app that I have paid for as a life time subscriber." — Ian Williams | tp-bumble.md | Bumble | [doc-verbatim] |
| P7 | Verification loops | Verification "pending" blocks paid features | "asked to verify myself which i did… my vertification is still pending" blocking paid messaging — J (AU) | tp-tinder.md | Tinder | [doc-verbatim] |
| P7 | Verification loops | Endless re-verify demands that fix nothing | "I keep getting repeatedly asked to 'verify' my profile with no explanation of why, and it doesn't fix anything." — ee ee | tp-tinder.md | Tinder | [doc-verbatim] |
| P7 | Data hostage / GDPR erasure blocked | Cannot delete account without surrendering biometric data | "They flagged my account, so i cannot access it unless i give them my biodata. The issue is, i cannot even delete my account unless i do so… All i want is to delete my account!" — Rasmus; "Under GDPR I have the right to have my data erased, and blocking that with a technical bug isn't a valid excuse." — ee ee | tp-tinder.md | Tinder | [doc-verbatim] |
| P8 | Privacy violations (documented events, not just complaints) | HIV-status data sharing; £26M settlement | Sep 2026: Grindr agreed £26M settlement of April 2024 High Court suit — "covert tracking technology" and sharing HIV status + sensitive data with third-party analytics, for 12,000 UK users | wiki-grindr.md | Grindr | [doc] |
| P8 | Privacy | €10M GDPR fine, 135 advertisers | Norwegian DPA fined Grindr €10M (Jan 2021) after Norwegian Consumer Council found data sent to at least 135 advertisers, capable of revealing sexual orientation | wiki-grindr.md | Grindr | [doc] |
| P8 | Privacy | Account takeover via password-reset | Oct 2020: anyone could take over a Grindr account using only the email address | wiki-grindr.md | Grindr | [doc] |
| P8 | Privacy | Location trilateration | 2014 trilateration attack pinpointed near-exact locations (2M+ detections in days; Egypt allegedly used it to arrest gay men); 2016 Kyoto University "colluding-trilateration" bypass of distance-hiding | wiki-grindr.md | Grindr | [doc] |
| P8 | Security | Jan 2026 cyberattacks on two majors | Match (Jan 28, 2026, "limited amount of user data") and Bumble hit in the same campaign (with Panera Bread, CrunchBase, per Bloomberg) | wiki-match.md, wiki-bumble.md via digest §7, §4 | Match, Bumble | [doc] |
| P9 | Minor safety | Adolescents on adult apps; no US age check | "Research has estimated that around half of sexually active gay and bisexual adolescents use applications like Grindr. Grindr does not verify users' ages in the United States" (Section 230) | wiki-grindr.md | Grindr (and industry) | [doc] |
| P10 | App quality & UX debt | Chat glitches; restarts to read messages | "Messages notifications come through but the app need restarted 2/3 and sometimes 4 times before you can message back" — Consumer GB; "constant app freezes, broken layouts" (TP AI summary) | tp-bumble.md | Bumble | [doc-verbatim] |
| P10 | App quality | Signup/site crashes | "cannot sign up. The site keeps crashing, and repeating itself." — alastair | tp-tinder.md | Tinder | [doc-verbatim] |
| P10 | UX hostility | Accidental right-swipes, no undo at paid tier | "it was too easy to accidentally swipe right or left. If you accidentally went left there was an undo function, but if you accidentally swiped right there wasn't." — Annie S | tp-match.md | Match | [doc-verbatim] |
| P10 | UX hostility | No text copy for translation | "you cannot Copy text from a profile.. in order to paste it through a translator.. yet another example of BAD usability." — Max | tp-tinder.md | Tinder | [doc-verbatim] |
| P10 | Nagging notifications | Harassing profile-completion prompts | "Tick every box on the bumble profile to do list and it still sends harassing messages telling you to complete your profile even though there is nothing left to complete!!?" — Consumer GB | tp-bumble.md | Bumble | [doc-verbatim] |
| P11 | Intent mismatch & integrity | Married people posing as single | "Last date, she says she's single but still married and still lives at home with him" — Stuart Clarke; "I saw too many men on there I knew from my friends who were cheaters" — Sarah Carlton | tp-tinder.md, tp-bumble.md | Tinder, Bumble | [doc-verbatim] |
| P11 | Intent mismatch | Match-removal notices reveal bad-actor density | "5 or 6 times in 3 months I got a notice that someone I had matched with had been removed from the site. This seemed like an alarmingly high percentage of bad actors in my matches." — Annie S | tp-match.md | Match | [doc-verbatim] |
| P11 | Aggressive re-acquisition | 2 years of badgering lapsed non-member | "They harrassed me for 2 years because I didn't want to join. 2 YEARS. ENDLESS EMAILS ENDLESS BADGERING ENDLESS BULLYING" — Lise Longmire | tp-match.md | Match | [doc-verbatim] |
| P12 | Post-pivot product regression | Bumble Aug 2026 chat changes confuse users | "The new bumble is shocking. It only let's you send one opening message, but it's anew feature. So on my best match I've just said 'hey' went to say more and it wouldn't let me. USELESS" — Ryan Abrahams (Sep 21 2026) | tp-bumble.md | Bumble | [doc-verbatim] |
| P13 | Fatigue proxies | Industry press names fatigue explicitly | GDI podcast (Feb 26 2026): "Brittnee Barnes of Vybes on Fixing Dating App Fatigue"; GDI article (Sep 21 2026): "Dating Apps Keep Chasing Gen Z. What About 40+?"; CMB podcast (Jun 25 2026): "Why Intentional Dating Is Making a Comeback" | gdi-home.md | industry | [doc] (headlines) |

### 2.2 Fatigue: what is and is not proven

Direct quantitative fatigue studies were **not captured** ❓ [verification-pass.md, "Gaps honestly marked ❓"]. The fatigue thesis rests on indirect but mutually reinforcing evidence:

| Proxy | Evidence | Status |
|---|---|---|
| First-ever market revenue decline | $6.07B in 2025, down from prior peak [businessofapps-market.md] | [doc] |
| Tinder subscriber slide | 10.9M (2022) → 10.4M (2023) → 9.6M (2024) → 8.9M (2025) [digest §3, businessofapps-tinder.md] | [doc] |
| Bumble user bleed | 42M (2024) → 35M (2025); payers 2.8M → 2.4M (BoA, Q2 basis); Q2'26 IR: payers 3.2M, −16.4% YoY [digest §4, bmbl-q2.md] | [doc] |
| Trade-press naming | "Fixing Dating App Fatigue" (Feb 2026), "What About 40+?" (Sep 2026) [gdi-home.md] | [doc] |
| Review-volume decline | Match Trustpilot: only 50 reviews in last 12 months vs 1,336 lifetime — engagement with the brand's review page itself collapsing [tp-match.md] | [doc] + [inference] that this signals disengagement rather than satisfaction |
| Ex-users wishing failure on brands | "seeing your stock completely rug pull your investors is absolutely beautiful to see… Tinder to ZERO" — toby maddox [tp-tinder.md] | [doc-verbatim] |

### 2.3 Meta-observation: the review layer is itself contaminated

The same reviewer ("Lucius Allen, US, 8 reviews") appears on BOTH the Tinder and Bumble Trustpilot pages within days (Sep 18 and Sep 21 2026), each time praising a third-party site ("SttDate.com") over the reviewed app [doc — tp-tinder.md, tp-bumble.md]; another Bumble review promotes "BridesUA.com" for "offline events and video calls" [doc — tp-bumble.md, Sheryll Pettibone]. This is documented. The inference [inference] is that dating-app review surfaces are being farmed by competitor affiliate/astroturf operations — which matters twice for an entrant: (1) your Trustpilot/App Store surfaces will be attacked from day one, and moderation of them is a real cost line; (2) some fraction of "fake profiles" complaints on any given app are seeded by competitors, so pain-point sizing from reviews alone overstates any single app's defect rate — but the cross-brand consistency of the pattern (P1 appears verbatim on all three pages) means the underlying problem is real [inference].

**Sources (§2):** tp-tinder.md; tp-bumble.md; tp-match.md; gdi-home.md; wiki-grindr.md; wiki-osa.md; wiki-match.md (via digest §7); wiki-bumble.md (via digest §4); businessofapps-market.md; businessofapps-tinder.md (via digest §3); bmbl-q2.md (via digest §4); 01-master-facts-digest.md; verification-pass.md.

---

## 3. Gap Analysis — what no major app delivers

Each gap below is grounded in captured evidence and graded: **Evidence strength** = how directly the corpus documents the unmet need; **Competition** = whether any captured player addresses it. Speculative demand (as opposed to documented pain) is marked [inference].

### 3.1 Gap 1 — Safety-first verification as the default, not an option

| Dimension | Finding | Evidence | Status |
|---|---|---|---|
| What users say | A user independently specifies the product: "Match could insist on photo verification for every profile, which would help cut down the number of fake profiles, but they don't, so you have to ask yourself why.." — KJM [tp-match.md] | Users articulate verification as the fix and note its absence is a choice | [doc-verbatim] |
| Incumbent state — Tinder | Video-selfie verification exists but is used as a ban-enforcement wall ("you absolutely cannot get around it with the video selfie" — Aren) and as a broken loop ("repeatedly asked to 'verify'… doesn't fix anything" — ee ee; "verification is still pending" blocking paid messaging — J AU) [tp-tinder.md] | Verification deployed against users, not for them | [doc] |
| Incumbent state — Bumble | Face verification exists and misfires: lifetime subscriber "locked out" because "The technology is so poor and does not recognise me" — Ian Williams [tp-bumble.md] | Exists, broken, no human fallback | [doc] |
| Incumbent state — Grindr | Age verification UK-only (Jul 2025, OSA compliance); none in US (Section 230); CEO Arison: UK rules "led around 7% of the app's UK monthly active users to stop using the service" and he wants app stores to verify instead [wiki-grindr.md] | Verification done only where legally forced; incumbents actively resist it | [doc] |
| Incumbent state — Hinge | No verification feature evidence captured ❓ [corpus review; s-hinge-price.json tier table contains no verification row] | Unknown, likely none marketed | ❓ |
| Regulatory forcing function | UK OSA age-verification deadline Jul 25 2025 — Tinder, Bumble, Feeld, Grindr, Hinge all complied UK-only [wiki-osa.md]; Ofcom fines for weak age checks: Itai Tech £50k, AVS Group £1M [wiki-osa.md] | The law already requires the infrastructure incumbents have built but not generalized | [doc] |
| Gap verdict | No major app makes verified-real the entry condition for everyone; verification UX is punitive where it exists; nobody markets a verified-only pool | Verified-only mainstream pool is an open positioning | [inference] from [doc] pain |

**Founder/dev note:** the Persona-bypass incident (photo-based age verification defeated with Death Stranding game-character images [wiki-osa.md]) is a public adversarial test case: any entrant claiming verification must assume liveness+document checks, not single-shot photo AI, and must budget red-teaming. The Grindr 7% UK MAU loss figure [wiki-grindr.md] is the honest cost estimate for mandatory verification friction — design for it (progressive verification, verified-first sorting) rather than denying it [inference].

### 3.2 Gap 2 — The post-match experience (match → conversation → date)

| Dimension | Finding | Evidence | Status |
|---|---|---|---|
| Where value dies | "getting a match was only the first part. You talk for few days, maybe everything looks good, and then suddenly no more replies. After doing this many times I stopped seeing much point in another new match." — Sheryll Pettibone [tp-bumble.md] | Users name the exact moment of churn: post-match silence | [doc-verbatim] |
| Cross-brand pattern | "I get plenty of matches, no communication" [tp-tinder.md]; "they send one message, then literally dissapear" [tp-match.md]; "Lots of ppl fishing but zero follow up conversations" [tp-bumble.md] | Same failure on three platforms | [doc-verbatim] |
| Users leaving for offline/video hybrids | Bumble reviewer cites competitor's "offline events and video calls, so you can actually see the person and maybe meet" as why she switched [tp-bumble.md, Sheryll Pettibone] | Demand for IRL facilitation is documented in the wild | [doc] |
| Incumbent motion | Bumble's Aug 2026 pivot extends match window 24h→72h and (per press title) "an Evolution to its Signature Chat Experience" [wiki-bumble.md via digest §4; bmbl-press.md] — but first user reactions are negative ("It only let's you send one opening message… USELESS" — Ryan Abrahams [tp-bumble.md]) | Incumbents are poking at this gap awkwardly from distress, not strength | [doc] |
| Trade-press validation | GDI podcast "Fixing Dating App Fatigue" (Vybes, Feb 2026); CMB "Intentional Dating Is Making a Comeback" (Jun 2026); Surf Dating billed as "the Zillow for dating" (Jul 2026) [gdi-home.md] | Ecosystem actively searching for post-swipe formats | [doc] (headlines) |
| Gap verdict | No major delivers conversation coaching, date logistics, video-first pre-meets, or feedback loops after match; apps monetize UP TO the match and abandon the user after it | Post-match tooling is structurally absent because engagement metrics end at the match | [inference] from [doc] |

### 3.3 Gap 3 — Honesty economics (incentive-aligned monetization)

| Dimension | Finding | Evidence | Status |
|---|---|---|---|
| Documented extractive mechanics | Tinder dynamic pricing: "charge you whatever they think you'll pay" [tinder-plans.md via digest §9]; Hinge pricing "differs based on your age, region, device" [s-hinge-price.json via digest §5]; Tinder Select ~$499/mo invite-only [s-tinder-price.json via digest §9] | Price discrimination is documented, not alleged | [doc] |
| Perceived punishment for paying | Tonya G: 200+ likes free → "ZERO likes" after paying, then upsold to "PremiumPLUS" [tp-bumble.md]; Pema: "once you pay matches become nil" [tp-bumble.md] | Users experience paywalls as visibility taxes | [doc-verbatim] |
| Users name the conflict of interest | "It's obviously a conflict of interest for them to actually match you effectively." — Annie S [tp-match.md]; "Ponzi scheme… profits off lonely men" — toby maddox [tp-tinder.md] | The incentive critique is mainstream, not fringe | [doc-verbatim] |
| Financial corroboration | Bumble ARPPU +1.2% while payers −16.4% (Q2'26) [bmbl-q2.md via digest §4] — extraction rising as base shrinks | Monetization math currently favors depth-over-breadth on a declining base | [doc] + [inference] on interpretation |
| The proof it can be rated differently | Tawkify (human matchmaking) at 4.6/8K reviews [tp-match.md sidebar] — the only 4+ rating visible in the corpus | Pay-for-outcome models earn trust ratings incumbents cannot buy | [doc] |
| Fringe experiments already exist | Keeper: LLM matchmaking, women matched free, men sign a "$50,000 marriage bounty" contract [wiki-compare.md]; Duolicious: open-source, "Duolicious Gold" cosmetic-only subscription, 15,000 active [wiki-compare.md] | Outcome-aligned and non-extractive models exist but tiny/unproven at scale | [doc] |
| Gap verdict | No major offers outcome-aligned pricing (success fees, refunds on demonstrated non-delivery, published match rules); tier proliferation (Tinder 3+Select, Grindr weekly $14.99, AI tiers gAI/Edge) moves the opposite direction | Honesty economics is structurally unavailable to incumbents whose revenue lines depend on engagement | [inference] from [doc] |

### 3.4 Gap 4 — Demographics the majors underserve: 40+ / divorced / serious-intent

| Dimension | Finding | Evidence | Status |
|---|---|---|---|
| Trade press says it outright | GDI (Sep 21 2026): "Dating Apps Keep Chasing Gen Z. What About 40+?" [gdi-home.md] | Industry organ flags the miss | [doc] (headline) |
| Penetration data | Civic Science via BoA: Tinder 30% overall but 12% among 35+; Bumble 22% but 14% 35+; Hinge 15% but 7% 35+ — while Match.com is 10% overall/15% 35+ and eHarmony 4% overall/10% 35+ [digest §3] | The swipe apps structurally lose 35+; the legacy "serious" brands hold them | [doc] |
| But the legacy 40+ players are dying | Match E&E segment (Match/PoF/OkCupid/Meetic) revenue −17% YoY in Q2'26 ($179M) [s-mtch-q2.json via digest §7]; Match Trustpilot 1.0 [tp-match.md] | The audience is served by decaying, hated products — demand unserved, not absent | [doc] + [inference] |
| Older-user friction documented | Cheryl R, 55: profile effort then unexplained "potential ban," 10+ unanswered emails [tp-match.md] | 40+ UX and support needs unmet | [doc-verbatim] |
| Counter-signal | Hinge — the growth story (+25% 2025, $689M) — wins with *relationship-serious* framing, not 40+ specifically; ~50% of users US, strongest UK/IE/Nordics [digest §5] | "Serious intent" is the monetizable core; age is one segment expression of it | [doc] + [inference] |
| Gap verdict | A verified, honest, human-supported product for 40+ serious daters is open: incumbents either chase Gen Z (Tinder/Bumble) or rot (Match/eHarmony segment) | The 40+ wedge is evidence-backed | [inference] from [doc] |

### 3.5 Gap 5 — Women's-safety-first product (positioning vacuum, Aug 2026)

Bumble retired women-message-first in Aug 2026 (men may initiate; window 24h→72h) [wiki-bumble.md via digest §4] — while its own Trustpilot company blurb still claims "Women make the first move" [tp-bumble.md, "Written by the company"] — leaving the safety-positioned mainstream slot vacant exactly as the Australian 99%-abuse study headlines [gdi-home.md] and Australia proposes a dating-app duty of care [gdi-home.md]. Bumble's Private Detector (AI nude-image blur, open-sourced 2019) and Deception Detector prove the tech is buildable and were not enough to save the brand from 1.3 Trustpilot and 87% 1-star [wiki-bumble.md via digest §4; tp-bumble.md]. Meanwhile a fringe player (Chyrpe, "female-led relationships," 1M downloads) exists but is kink-positioned, not mainstream [wiki-compare.md]. **Caution for founders:** §7.2 explains why re-occupying "women-first" *as Bumble framed it* is a red ocean; the open space is *safety-verified-by-default for everyone* (which disproportionately benefits women, per the 99% headline) rather than a gendered-mechanics gimmick [inference].

### 3.6 Gap 6 — Privacy-as-product

Corpus documents the ceiling of privacy failure: Grindr's £26M settlement (HIV-status sharing, covert tracking, 12,000 UK users) [wiki-grindr.md], €10M Norwegian GDPR fine (135 advertisers) [wiki-grindr.md], Jan 2026 breaches at Match and Bumble [digest §4, §7], Tinder "holding my data hostage" (account deletion gated on biometric surrender) [tp-tinder.md, Rasmus]. No captured player markets data-minimization as a consumer feature; the only prominent data-minimization stance in the corpus is Wikimedia *refusing* identity checks on privacy grounds [wiki-osa.md]. An entrant that architecturally cannot do what Grindr did (sensitive attributes never leave a segregated store; no third-party ad SDKs; published data-flow diagrams; one-tap true deletion) converts a compliance burden into the brand [inference; architecture grounded in the DevSecOps lens — see §6.4].

### 3.7 Gap 7 — Integrity screening (married/cheaters, scam funnels, intent honesty)

Documented pains P11: married people on Tinder/Bumble [tp-tinder.md Stuart Clarke; tp-bumble.md Sarah Carlton]; Match's own recommendation engine pushing a user toward a scammer [tp-match.md M H]; sex-worker/spam gray zones Bumble's labels accidentally blessed ("something casual," "open to see where things go" — Mo's account) [tp-bumble.md]. No major screens for status honesty or runs scam-pattern detection on behalf of users *before* money-requests happen. Bumble's Deception Detector is the nearest incumbent artifact [wiki-bumble.md via digest §4]. Gap verdict: intent-and-integrity verification (cross-checks, report-fed scoring, money-request detection with interstitial warnings) is undelivered at scale [inference from doc].

### 3.8 Gap inventory summary

| Gap | Evidence strength | Nearest competitor motion | Open for entrant? |
|---|---|---|---|
| 1. Universal safety-first verification | Very strong (user-specified; broken incumbent UX; regulatory forcing) | Grindr UK-only age checks; Bumble broken face verify | Yes — as default pool condition |
| 2. Post-match experience | Strong (churn moment named by users; incumbents pivoting badly) | Bumble 72h window; voice notes on Hinge prompts | Yes — conversation→date tooling |
| 3. Honesty economics | Strong (documented dynamic pricing + pervasive conflict-of-interest perception) | Tawkify/Keeper fringe; none among majors | Yes — but hard revenue surgery |
| 4. 40+/serious demo | Strong (GDI headline + penetration table + E&E −17%) | Match/eHarmony decaying incumbents | Yes — cleanest demographic wedge |
| 5. Women-safety-first positioning | Moderate-strong (99% headline ❓study unfetched; Bumble vacuum Aug 2026) | Chyrpe fringe; Bumble retreat | Conditionally — as safety-for-all, not gendered mechanics |
| 6. Privacy-as-product | Strong events, unproven demand as purchase driver | None | Yes, as trust architecture, not slogan |
| 7. Integrity screening | Moderate (patterned complaints) | Bumble Deception Detector (partial) | Yes — as trust feature set |

**Sources (§3):** tp-match.md; tp-tinder.md; tp-bumble.md; wiki-grindr.md; wiki-osa.md; wiki-compare.md; gdi-home.md; digest §3–§5, §7, §9 (businessofapps-tinder.md, s-hinge-price.json, s-tinder-price.json, tinder-plans.md, bmbl-q2.md, s-mtch-q2.json, wiki-bumble.md, bmbl-press.md); verification-pass.md.

---

## 4. Blue Ocean Canvas — ERRC grid for a quality-first entrant

Framework: Kim & Mauborgne Eliminate–Reduce–Raise–Create applied against the factors the industry currently competes on (the "red ocean" factor set is itself documented: tier proliferation, weekly subs, AI-premium tiers, dynamic pricing, a-la-carte boosts [digest §9]). The entrant hypothesized here = **verified-only, honesty-priced, post-match-complete service for serious daters** (the composite of §3 gaps).

### 4.1 ERRC grid

| Action | Factor | Why (evidence) | Status |
|---|---|---|---|
| **ELIMINATE** | Likes-economy paywall (pay to see who likes you / to speak) | Top complaint cluster P2: "can't talk to anyone… paid £9.99 for a week" [tp-tinder.md]; Bumble TP summary: "relies excessively on paid features… frustrating scheme to generate money" [tp-bumble.md] | [doc] pain → [inference] strategy |
| **ELIMINATE** | Unverified accounts in the visible pool | "Match could insist on photo verification… but they don't" [tp-match.md KJM]; fake-profile cluster P1 across all three brands | [doc] → [inference] |
| **ELIMINATE** | Dynamic/experimental pricing | Documented at Tinder ("charge you whatever they think you'll pay") and Hinge ("differs based on your age, region, device") [digest §9]; users read it as scam evidence (P3) | [doc] → [inference] |
| **ELIMINATE** | Dormant/inventory profiles served as product | "Most of the accounts are dormant" [tp-bumble.md Lucius Allen]; "Inactive users: Most profiles haven't been logged into for a long time" [tp-match.md KJM]; deck-exhaustion complaints [tp-bumble.md Consumer GB] | [doc] → [inference] |
| **ELIMINATE** | Ad-network data sharing on sensitive attributes | Grindr £26M/€10M precedents [wiki-grindr.md]; structural privacy distrust | [doc] → [inference] |
| **REDUCE** | Tier proliferation (3–4 tiers + invite-only + weekly + boosts) | Tinder Plus/Gold/Platinum/Select $499; Grindr XTRA $22.99/mo or $14.99/wk + Unlimited $44.99 + Boost $11.99 + Edge + gAI [digest §9] — complexity itself is a complaint driver (P2 upsell fatigue) | [doc] → [inference] |
| **REDUCE** | Scale-chasing as goal (MAU maximization) | First-ever market decline shows scale ≠ revenue in 2025 [businessofapps-market.md]; Tinder MAU 60M or 75M (conflict carried) still lost subs [digest §3] | [doc] → [inference] |
| **REDUCE** | Gamified engagement loops (streaks, like-deck end-cards, notification spam) | "harassing messages telling you to complete your profile" [tp-bumble.md]; "ENDLESS EMAILS ENDLESS BADGERING" [tp-match.md] | [doc] → [inference] |
| **REDUCE** | Swipe volume as core mechanic | Fatigue proxies §2.2; "Zillow for dating" / intentional-dating framing in trade press [gdi-home.md] | [doc] → [inference] |
| **RAISE** | Verification quality (liveness + document, human fallback) | Incumbent verification either broken (Bumble face verify [tp-bumble.md Ian Williams]) or punitive (Tinder video-selfie ban-wall [tp-tinder.md Aren]) | [doc] → [inference] |
| **RAISE** | Human support with SLA | AI-loop support is the single most cross-brand complaint (P6) [tp-tinder.md, tp-bumble.md, tp-match.md]; Tawkify's 4.6 correlates with human-in-loop [tp-match.md] | [doc] → [inference] |
| **RAISE** | Refund fairness / cancellation clarity | P2 ledger rows; UK Consumer Rights Act invocations [tp-tinder.md Flavour Tasters]; Trading Standards escalation [tp-match.md Ben Artistic] | [doc] → [inference] |
| **RAISE** | Women's-safety tooling beyond gesture | 99%-abuse headline [gdi-home.md]; stalking-feel review [tp-bumble.md Sarah Carlton]; Private Detector exists but didn't move trust [digest §4] | [doc] → [inference] |
| **RAISE** | Transparency (published match rules, visible profile status, appeal rights) | "Dictatorship" appeal UX [tp-bumble.md Mo]; "conflict of interest" [tp-match.md Annie S]; opaque bans cluster P5 | [doc] → [inference] |
| **CREATE** | Outcome-aligned pricing (e.g., success-fee or renewal-forgiveness on relationship exit) | Tawkify 4.6 [tp-match.md]; Keeper $50k marriage bounty exists as fringe proof-of-interest [wiki-compare.md]; no major offers it [digest §9] | [doc] fringe + [inference] mainstream fit |
| **CREATE** | Post-match product: conversation support → verified video pre-meet → date logistics → feedback loop | Gap 2 evidence; competitor hybrid demand ("offline events and video calls" [tp-bumble.md]) | [doc] → [inference] |
| **CREATE** | Verified-only pool as the brand (badge economy: ID, selfie-liveness, status-attested) | Gap 1 evidence; regulatory age-assurance normalizes ID checks (UK apps list [wiki-osa.md]) | [doc] → [inference] |
| **CREATE** | Duty-of-care-native safety architecture (auditable moderation, NCII response SLA, cyberflashing interstitials, police-liaison pathway) | OSA duties + Ofcom fines [wiki-osa.md]; TAKE IT DOWN 48h duty [wiki-takeitdown.md]; Australia proposal [gdi-home.md] | [doc] → [inference] |
| **CREATE** | Graceful exit ("success = you leave") with data auto-expiry | "Designed to be deleted" is Hinge's slogan but its Q2'26 growth monetizes retention [s-mtch-q2.json via digest §7]; no one prices the exit | [doc] tension + [inference] |

### 4.2 Factor table — current state vs proposed entrant

Legend: ✅ confirmed present · ❌ absent · 🟡 partial/paywalled/beta/jurisdiction-limited · ➖ n/a · ❓ unconfirmed in corpus. "Entrant" column = the §4.1 proposal.

| Factor | Tinder | Bumble | Hinge | Grindr | Entrant (proposed) |
|---|---|---|---|---|---|
| Swipe/feed core mechanic | ✅ | ✅ | ✅ (prompts+swipe) | ❌ (geosocial grid) | 🟡 limited daily introductions [inference] |
| Universal profile verification (all members) | ❌ (optional video selfie; used punitively per reviews) | ❌ (optional; face-verify failures documented) | ❓ no evidence captured | ❌ (UK age-check only) | ✅ verified-only pool |
| Age assurance | 🟡 UK-only (OSA list) | 🟡 UK-only | 🟡 UK-only | 🟡 UK-only (Jul 2025, mandatory) | ✅ global by design |
| Free core messaging | ❌ (paywalled; documented complaints) | ❌ (likes behind paywall) | 🟡 (free = 8 likes/day) | ✅ (free chat documented) | ✅ core comms free |
| Tier count | 4 (Plus/Gold/Platinum/Select) | 2 (Boost/Premium+) | 2 (Hinge+/HingeX) | 3+ (XTRA/Unlimited/Edge) | 1 [inference] |
| Price span (monthly, captured) | $24.99–$499 | $15.99–$39.99 | $29.99–$49.99 | $14.99/wk–$44.99/mo | single honest price [inference] |
| Dynamic/A-B pricing | ✅ documented | ❓ not captured | ✅ documented (age/region/device) | ❓ not captured | ❌ eliminated |
| Weekly subscription | 🟡 (£9.99/wk documented via user review) | ❓ not captured | ❓ not captured | ✅ $14.99/wk | ❌ |
| Premium AI tier | 🟡 (ML recs; Select umbrella) | 🟡 (Private Detector shipped; wingman in dev) | ❓ | ✅ gAI six features + Edge | 🟡 safety-AI free, not paywalled [inference] |
| Reachable human support | ❌ | ❌ | ❓ | ❓ | ✅ SLA'd [inference] |
| Post-match/date facilitation | ❌ | 🟡 72h window + chat pivot (Aug 2026; rocky rollout) | 🟡 voice notes on prompts | ➖ (explicit casual framing) | ✅ full pipeline [inference] |
| Women's-safety-specific tooling | ❓ | ✅ Private Detector (2019, open-sourced) | ❓ | ❌ (documented safety failures instead) | ✅ raised [inference] |
| Intent/integrity screening (status honesty, scam-pattern) | ❌ | 🟡 Deception Detector (fake-profile/scam blocking) | ❓ | ❌ | ✅ [inference] |
| Data-minimization posture | ❌ (Jan 2026 breach; ad economy) | ❌ (Jan 2026 breach) | ❓ | ❌ (£26M, €10M precedents) | ✅ architectural [inference] |
| Outcome-aligned pricing | ❌ | ❌ | ❌ | ❌ | ✅ [inference] |
| Published match/allocation rules | ❌ | ❌ | ❌ | ❌ | ✅ [inference] |

Cell evidence anchors: pricing rows [digest §9: s-tinder-price.json, tinder-plans.md, s-hinge-price.json, s-grindr-price.json, grindr-unlimited.md]; verification rows [tp-tinder.md Aren/ee ee/J AU; tp-bumble.md Ian Williams; wiki-grindr.md]; OSA UK list [wiki-osa.md: Tinder, Bumble, Feeld, Grindr, Hinge named]; free messaging [tp-tinder.md jim Berry; tp-bumble.md James Walker; s-hinge-price.json via digest §5; wiki-compare.md Grindr row]; AI tiers [wiki-grindr.md gAI; wiki-bumble.md via digest §4]; Bumble pivot [wiki-bumble.md via digest §4; tp-bumble.md Ryan Abrahams].

### 4.3 What makes this blue rather than just different

[inference] The incumbent factor set (scale, tiers, engagement, dynamic price) is *mutually reinforcing around engagement extraction*, and the corpus shows each factor now generates documented user hostility (P2, P3) and regulatory attention (§6). A canvas that removes the hostile factors cannot be matched by incumbents without revenue cannibalization: Tinder cannot end the likes-paywall (57% of Match revenue was Tinder in 2023 [digest §3]); Bumble cannot refund-fair its way out while running impairments ($404.9M Q2'25, $169.3M Q2'26 [bmbl-q2.md via digest §4]). The entrant's cost of honesty is low because it has nothing to cannibalize; the incumbents' cost of imitating honesty is a repricing of their whole P&L. That asymmetry — not any single feature — is the moat claim, and it is also the bet's central risk (§5 W4, T3).

**Sources (§4):** as anchored inline per row; digest §3–§5, §9; tp-tinder.md; tp-bumble.md; tp-match.md; wiki-grindr.md; wiki-osa.md; wiki-compare.md; bmbl-q2.md via digest; gdi-home.md.

---

## 5. Mentor SWOT — hypothetical quality-first new entrant

Position under test: **verified-only, honesty-priced, post-match-complete dating service, initially for a serious-intent demographic (40+ or similar), launched in a compliance-forward market (UK/AU first).** Strengths/Weaknesses = internal to the entrant as a startup; Opportunities/Threats = external, evidenced by market conditions.

### 5.1 Strengths (internal)

| # | Strength | Why it holds | Evidence anchor | Status |
|---|---|---|---|---|
| S1 | Clean-room trust architecture — no legacy engagement metrics to protect | Incumbents cannot copy honesty features without cannibalizing paywall revenue (Tinder = 57% of Match revenue in 2023) | digest §3; §4.3 reasoning | [doc] + [inference] |
| S2 | Verification-density feasibility at small scale | A verified-only pool needs thousands, not millions, of right users; incumbents need 60–75M (conflict carried) to function at all | digest §3 MAU conflict; §3.1 | [inference] |
| S3 | DevSecOps-native security posture from day one | The corpus is a catalog of incumbent security failure modes to design against: password-reset takeover (Grindr 2020), trilateration, third-party data leakage (£26M), breaches (Match/Bumble Jan 2026) | wiki-grindr.md; digest §4, §7, §13 | [doc] failures + [inference] advantage |
| S4 | Regulatory head start — build to OSA/TAKE IT DOWN spec as product | Incumbents bolt compliance on per-jurisdiction (UK-only age checks); entrant can be compliance-native and market it | wiki-osa.md; wiki-takeitdown.md; §6 | [doc] + [inference] |
| S5 | Cost-structure discipline: modest infra baseline is sufficient for a niche launch | LiquidWeb Managed VPS baseline (AlmaLinux 9.8, cPanel/WHM, 2 vCPU/2GB, 10TB transfer, root SSH) documented as an adequate staging substrate for staged growth planning | digest §14 (lw-*.md ×12) | [doc] baseline + [inference] fit |
| S6 | Human-support SLA as a cost-justified differentiator at small N | Support is the loudest cross-brand pain (P6); at entrant scale, human support is affordable and is the visible proof of the brand promise | tp-bumble.md RB/Paul S; tp-match.md Joseph Vucak; Tawkify 4.6 contrast [tp-match.md] | [doc] pain + [inference] affordance |
| S7 | No review-history debt | All majors sit at 1.0–1.3 with 87–91% 1-star; a new brand starts unpoisoned (but see W6) | tp-*.md ratings | [doc] |

### 5.2 Weaknesses (internal)

| # | Weakness | Why it bites | Evidence anchor | Status |
|---|---|---|---|---|
| W1 | Two-sided cold start; density is the product in dating | Every documented pain (dead conversations, deck exhaustion) worsens with thin supply; incumbents' moat is the network itself | tp-bumble.md Consumer GB (10 swipes UK+IE); digest §3 Tinder MAU | [doc] mechanics + [inference] |
| W2 | Verification friction suppresses funnel — the honest number is ~7% | Grindr CEO: UK age verification "led around 7% of the app's UK monthly active users to stop using the service" — and that is for age-only, one jurisdiction; identity-grade verification will lose more | wiki-grindr.md | [doc] |
| W3 | Outcome-aligned pricing is unproven revenue math at mainstream scale | Keeper (marriage bounty) and Tawkify exist only at fringe scale; no captured evidence a mass audience converts to success-fee models | wiki-compare.md; tp-match.md sidebar | [doc] fringe + ❓ mainstream |
| W4 | Honesty caps ARPPU while costs (moderation, support, verification vendors) rise | Incumbent unit economics run the other way (Grindr ARPPU $26.51 +12%, $25.51 CNBC variant carried — see 04 §4.4; Bumble ARPPU +1.2% on shrinking payers); entrant deliberately refuses those levers | digest §6, §4 | [doc] incumbents' math + [inference] entrant tension |
| W5 | Brand-trust bootstrap in a category users are trained to distrust | "Dating apps are a scam" is a verbatim review title; the entrant inherits the category's 1.x Trustpilot baseline in buyers' minds | tp-tinder.md toby maddox | [doc-verbatim] |
| W6 | Review-surface astroturf exposure from day one | Documented competitor-seeding of Trustpilot reviews (same reviewer promoting SttDate.com on two brands' pages) | tp-tinder.md, tp-bumble.md Lucius Allen | [doc] + [inference] risk |
| W7 | Moderation at honesty-grade requires humans and process, which scales poorly | Incumbents demonstrably failed cheap moderation (P5 opaque bans; "dictatorship" appeals); doing it right is a headcount business | tp-bumble.md Mo; tp-match.md AC | [doc] failure precedent + [inference] cost |
| W8 | Founder-lens risk: security-first culture can over-rotate into friction-first UX | Persona bypassed by game-character photos shows adversaries adapt; every defense added is onboarding drop-off (W2 compounding) | wiki-osa.md | [doc] + [inference] |

### 5.3 Opportunities (external, from market evidence)

| # | Opportunity | Evidence | Source | Status |
|---|---|---|---|---|
| O1 | Women-first positioning vacuum after Bumble's Aug 2026 retreat — occupiable as safety-for-all rather than gendered mechanics | Men may initiate + 72h window (Aug 2026); 99%-abuse headline same quarter | wiki-bumble.md; gdi-home.md (via digest §4) | [doc] + [inference] framing |
| O2 | Distressed #2 (Bumble) means less competitive response capacity from the natural fast-follower | BMBL $2.85; $0.7B valuation vs $13B IPO-era; two impairment quarters; Q2'26 rev −14.7%, payers −16.4% | digest §4; bmbl-q2.md | [doc] |
| O3 | Match Group retrenchment abandons segments and brands | Archer shut Jun 2026; League absorbed; E&E −17% — the "serious/legacy" shelf is being hollowed | digest §7; wiki-match.md; s-league.json | [doc] |
| O4 | Regulation raises incumbent costs faster than entrant costs (compliance-native) | OSA fines to £18M/10%; Ofcom enforcement examples (£50k Itai, £1M AVS); TAKE IT DOWN reporting duty live May 19 2026; Australia duty-of-care proposal | wiki-osa.md; wiki-takeitdown.md; gdi-home.md | [doc] + [inference] asymmetry |
| O5 | 40+ demographic actively name-checked as underserved | GDI headline Sep 21 2026; penetration collapse 35+ for swipe apps; legacy 40+ brands at 1.0–1.7 Trustpilot | gdi-home.md; digest §3; tp-match.md; tp-tinder.md sidebar (PoF 1.7) | [doc] |
| O6 | Trust premium is provable: users rate human/outcome models 4.6 | Tawkify 4.6 (8K) vs category 1.0–1.3 | tp-match.md sidebar | [doc] |
| O7 | Willingness to pay for serious-intent positioning is intact | Hinge +25% 2025 ($689M), payers 1.95M, Q2'26 +22% — in a declining market | digest §5; s-mtch-q2.json | [doc] |
| O8 | Free-tier vacuum at quality end (Facebook Dating gains "quietly") | GDI headline: "Facebook Dating Quietly Gains Ground on Dating Apps"; wiki-compare: Facebook Dating = "all features free" | gdi-home.md; wiki-compare.md | [doc] (headline) |
| O9 | Niche-format experimentation is culturally legitimized by the trade press itself | GDI platformizes fringe formats: intentional dating (CMB), surf dating "Zillow for dating," non-monogamy (Sister Wives), fatigue-fixing (Vybes) | gdi-home.md | [doc] |
| O10 | M&A optionality: Match is buying gay-casual ($100M Sniffies) and consolidating; acquirers exist for differentiated assets | $100M Sniffies stake; League absorbed; E&E retrenchment | digest §7, §8 | [doc] |

### 5.4 Threats (external)

| # | Threat | Evidence | Source | Status |
|---|---|---|---|---|
| T1 | Incumbent network effects are overwhelming in the mass market | Tinder 60M or 75M MAU (conflict carried), 400M+ lifetime downloads, 190 countries; most-downloaded 2025 | digest §3; businessofapps-market.md | [doc] |
| T2 | Meta's free entry resets price expectations at the low end | Facebook Dating "quietly gains ground" (headline, Sep 22 2026) — and it is all-features-free per comparison table | gdi-home.md; wiki-compare.md | [doc] (headline) + ❓ magnitude |
| T3 | Fast-follow imitation by Match (the Hinge playbook: buy or copy what works) | Match acquired Hinge fully by 2019 after it grew; absorbed League; invested $100M in Sniffies — the group demonstrably buys threats | digest §5, §7 | [doc] pattern + [inference] threat |
| T4 | Regulatory burden itself — fines and duties land on you too, and verification mandates can be bypassed (arms race) | Persona defeated by game-character images; VPN download spike post-deadline; OSA fines up to £18M/10%; TAKE IT DOWN 48h duty with FTC enforcement | wiki-osa.md; wiki-takeitdown.md | [doc] |
| T5 | AI-fraud flood raises the cost of "verified" faster than verification improves | Users already report AI chatbot matches with no long-term memory (Match, Scott Scott); TAKE IT DOWN exists because deepfake NCII is industrial | tp-match.md; wiki-takeitdown.md | [doc] |
| T6 | Market-level payer fatigue | First-ever revenue decline; ~23M payers on 350M users | businessofapps-market.md | [doc] |
| T7 | Incumbents still shipping: this is not a static target | Tinder Google Play last update Sep 21 2026; Grindr +33–38% quarters with AI monetization "paying off" | digest §3, §6 | [doc] |
| T8 | App-store platform risk (verification mandates, fees, policy shifts) | Grindr CEO lobbies for app-store-based age verification — if realized, stores gatekeep your verification layer | wiki-grindr.md | [doc] stance + [inference] risk |
| T9 | One catastrophic safety event = existential for a small safety-branded player | Incumbents survived Grindr-killer-level events and £26M settlements; an entrant whose entire brand is safety cannot survive one | wiki-grindr.md (Stephen Port reference, £26M) | [doc] precedent + [inference] asymmetry |
| T10 | Sentiment contagion: category-level "dating apps are a scam" belief suppresses trial for good products too | toby maddox review title; 87–91% 1-star norms | tp-tinder.md; tp-*.md | [doc] |

### 5.5 Mentor synthesis

[inference, stated as such] The SWOT reduces to one structural bet: **the entrant's strengths and opportunities are all real but slow-compounding (trust, support, regulation), while its threats are fast (network effects, imitation, platform risk, one bad event).** Therefore: (1) pick the beachhead where slow-compounding wins — a dense metro, one demographic (40+ serious-intent), one compliance-forward jurisdiction (UK or AU) — never the mass market; (2) treat verification UX, not verification strength, as the core engineering problem (the 7% drop-off [wiki-grindr.md] is the benchmark to beat); (3) instrument trust as a metric (response SLAs, refund rates, verified-density %, match→date conversion) because the corpus shows incumbents measure engagement and are blindsided by sentiment; (4) pre-commit the incident-response and takedown runbooks (OSA/TAKE IT DOWN) before launch — for a safety brand, the first incident IS the brand test; (5) assume Tawkify's 4.6 [tp-match.md] is the achievable ceiling evidence, and price for the fact that honesty caps ARPPU (W4).

**Sources (§5):** digest §3–§7, §9, §13, §14; tp-tinder.md; tp-bumble.md; tp-match.md; wiki-grindr.md; wiki-osa.md; wiki-takeitdown.md; wiki-compare.md; wiki-match.md; wiki-bumble.md; bmbl-q2.md; s-mtch-q2.json; s-league.json; businessofapps-market.md; gdi-home.md.

---

## 6. Regulation-as-Moat — barrier AND wedge

### 6.1 The regulatory stack captured in corpus

| Regime | Core demands on dating platforms | Penalties | Dating-relevant events | Source |
|---|---|---|---|---|
| UK Online Safety Act 2023 (royal assent Oct 26 2023) | Duty of care for user-to-user services: illegal-content risk assessments, children's protection, age verification/estimation where children likely; reporting/redress; record-keeping | Fines up to £18M or 10% of global turnover, whichever higher; Ofcom service-restriction/access-blocking orders | Ofcom age-verification deadline Jul 25 2025 — Tinder, Bumble, Feeld, Grindr, Hinge, Reddit (Persona), X, Spotify, Bluesky, Discord all complied; Grindr UK age checks from Jul 2025 | wiki-osa.md; wiki-grindr.md |
| UK OSA new offences | Cyberflashing; intimate-image sharing/threats; false communications; threat messages; epilepsy-trolling; encouraging self-harm | Criminal | First cyberflashing conviction Mar 2024 | wiki-osa.md |
| US TAKE IT DOWN Act (signed May 19 2025) | Criminalizes NCII publication (up to 2 years, harsher for minors); covered platforms must remove NCII at victim request within 48 hours and delete copies; FTC enforcement; services had 1 year to build reporting (enforcement vs services from May 19 2026) | Criminal + FTC | First conviction Apr 2026 (Ohio, AI NCII), 15-year sentence Sep 2026 | wiki-takeitdown.md |
| US DEFIANCE Act | Civil damages for NCII victims | Civil | Passed Senate by unanimous consent Jan 2026 (House pending ❓) | wiki-takeitdown.md |
| Australia duty-of-care proposal (announced ~Sep 22 2026) | Proposed duty of care for dating apps (details not fetched ❓) | ❓ | Announced same week as 99%-abuse study headlines | gdi-home.md |
| EU DSA / GDPR precedents | Platform obligations (majors); GDPR data-protection enforcement | GDPR fines (€10M Grindr, Norway) | Detailed dating-specific DSA/VAPP obligations not captured ❓ | wiki-grindr.md; verification-pass.md |
| US Section 230 | No US age-verification mandate | n/a | Why Grindr verifies UK but not US | wiki-grindr.md |

### 6.2 As BARRIER (why this moat deters entrants generally)

| Barrier mechanism | Documented evidence | Impact on a generic entrant |
|---|---|---|
| Fixed compliance cost kills small players before they start | Non-commercial forums (London Fixed Gear, Microcosm) shut citing OSA compliance cost; Gab and Civit.ai geo-blocked UK instead [wiki-osa.md] | [doc] |
| Age-assurance vendor stack + adversarial arms race | Persona photo-verification bypassed with Death Stranding images; VPN downloads spiked post-deadline (circumvention); 500k+ signature repeal petition [wiki-osa.md] | [doc] |
| Enforcement is live and escalating | Ofcom: 4chan £20k (Aug 2025) accruing £100/day, Itai Tech £50k+£5k (Nov 2025), AVS Group £1M+£50k (Dec 2025), 4chan £520k (Mar 2026) [wiki-osa.md] | [doc] |
| Verification friction is a real user cost | Grindr: ~7% UK MAU loss attributable to age verification [wiki-grindr.md] | [doc] |
| Takedown infrastructure (48h NCII SLA, hash-matching, appeals) is now table stakes in the US | TAKE IT DOWN services deadline May 19 2026 [wiki-takeitdown.md] | [doc] |
| Privacy-law exposure for exactly the data dating apps need | Grindr €10M (135 advertisers) and £26M (HIV-status sharing) [wiki-grindr.md] | [doc] |

### 6.3 As WEDGE (why a compliance-native, DevSecOps-strong entrant converts the same laws into advantage)

| Wedge mechanism | Logic | Grounding | Status |
|---|---|---|---|
| Incumbents comply per-jurisdiction; entrant is compliance-native everywhere | UK-only age checks [wiki-osa.md app list] create inconsistent UX; a single verified-identity architecture serves OSA, future AU duty-of-care, and platform trust at once | wiki-osa.md; gdi-home.md | [doc] inconsistency + [inference] advantage |
| Regulation has already trained UK users to accept verification | Months of mandatory age checks on every major app (Jul 2025 onward) normalize ID flows — lowering the entrant's W2 friction in exactly the launch jurisdictions where it's hardest | wiki-osa.md | [doc] + [inference] |
| Duty-of-care specs double as the product spec | Illegal-content risk assessment, children's risk assessment, reporting/redress duties, record-keeping [wiki-osa.md] are literally a safety-first product backlog | wiki-osa.md | [doc] → [inference] |
| NCII/cyberflashing response as a marketed feature, not a legal cost | 48h takedown duty + cyberflashing offence give a safety-branded app consumer-visible SLAs to advertise ("we remove in hours, we testify, we support") | wiki-takeitdown.md; wiki-osa.md | [doc] duty + [inference] marketing |
| Australia as second market pre-announced | Duty-of-care proposal + 99% abuse study create a second Anglophone market where safety positioning is policy-aligned | gdi-home.md | [doc] (headline) |
| Data-minimization as competitive contrast | Wikimedia's refusal stance shows data-minimization is a defensible public position; Grindr's £26M shows the cost of its opposite | wiki-osa.md; wiki-grindr.md | [doc] + [inference] |

### 6.4 DevSecOps implementation notes (builder lens)

[inference throughout, anchored on documented constraints — included because the reader builds and secures software]:

1. **Age/identity assurance:** buy a vendor (Persona-class) but assume bypass (game-character images defeated photo AI [wiki-osa.md]) — require document+liveness for the verified tier; treat the vendor as an adversarial surface with periodic red-team certification. Budget the 7% UK drop-off [wiki-grindr.md] into funnel math.
2. **Sensitive-attribute segregation:** the £26M settlement arose from HIV-status + analytics commingling [wiki-grindr.md] — architect sensitive fields in a separate encrypted store with no SDK/ad-network egress path; make "no third-party ad SDKs" a stated invariant so it can be audited.
3. **NCII response pipeline from day one:** hash-list matching, 48h SLA tooling with audit trail (US duty [wiki-takeitdown.md]), victim status page, good-faith abuse-resistance (EFF-documented DMCA-style abuse risk [wiki-takeitdown.md] — build counter-notice flows).
4. **Ofcom-grade record-keeping:** risk assessments, moderation logs, complaints records are statutory [wiki-osa.md] — design as append-only logs (this is cheap if built in; ruinous if retrofitted, per the forums that closed).
5. **GDPR erasure as a first-class flow:** Tinder users document deletion being blocked [tp-tinder.md Rasmus, ee ee] — one-tap true deletion, published retention table, erasure SLA. Cheap differentiator; incumbents demonstrably fumble it.
6. **Incident-response runbook as brand asset:** Jan 2026 breaches hit two majors in one campaign [digest §4, §7]; Grindr's 2020 password-reset flaw [wiki-grindr.md] is the canonical cheap-fix example. For a safety brand, publish the IR policy pre-launch.
7. **Hosting baseline:** staged growth plans can start on the documented LiquidWeb Managed VPS baseline (AlmaLinux 9.8, cPanel/WHM, 2vCPU/2GB, 10TB, 50GB, root SSH, Softaculous [digest §14, lw-*.md]) with the caveat that age-assurance vendor callbacks, moderation queues, and append-only audit stores raise the floor quickly — the baseline is for the 0→10k DAU stage, not the compliance surface, which should be architected before first user [inference].

**Sources (§6):** wiki-osa.md; wiki-takeitdown.md; wiki-grindr.md; gdi-home.md; tp-tinder.md; digest §4, §7, §14; verification-pass.md.

---

## 7. Where NOT to compete (red oceans)

### 7.1 The casual-swipe scale game (mass-market swipe feed)

| Reason | Evidence | Source | Status |
|---|---|---|---|
| Structural moat: network density + 13 years of engineering | Tinder 60M or 75M MAU (conflict carried), 400M+ lifetime downloads, 190 countries, 1.5M dates/week claim; engineering stack: monolith-decomposition program, in-house Java Elasticsearch scoring plugin, dedicated ML team, recommendation embeddings research, unified API style guide | digest §3, §13 | [doc] |
| The pool is shrinking — you would fight for share in decline | First-ever market revenue decline ($6.07B, 2025); Tinder subs down four straight years (10.9M→8.9M); Bumble users 42M→35M | businessofapps-market.md; digest §3, §4 | [doc] |
| The low end is being reset to free by Meta | Facebook Dating quietly gaining; all-features-free per comparison table | gdi-home.md; wiki-compare.md | [doc] (headline) |
| Casual-gay vertical is consolidating under capital | Match shut Archer (Jun 2026) but took a $100M minority stake in Sniffies (Apr 2026); Grindr (+33–38% quarters, ARPPU $26.51, gAI premium) dominates gay casual | digest §6, §7 | [doc] |
| Winner's paradox: even the winner is shrinking | Tinder revenue −5.2% in 2025; the swipe category's leader is declining in both subs and revenue | digest §3 | [doc] |

Mentor verdict [inference]: entering swipe-at-scale in 2026 means out-spending Tinder's ML stack and Grindr's ARPPU machine for a share of a declining pool while Meta undercuts at free. Do not.

### 7.2 "Women-first" positioning as Bumble framed it

| Reason | Evidence | Source | Status |
|---|---|---|---|
| The owner of the category just abandoned it — from weakness, not strength | Aug 2026: men permitted to initiate; women-message-first "fully retired"; window 24h→72h; Bumble's own Trustpilot blurb still says "Women make the first move" — brand incoherence at the pivot | wiki-bumble.md; tp-bumble.md (via digest §4) | [doc] |
| The retreat followed financial distress, so the market will read re-occupation as Bumble's failed idea | BMBL $2.85; $13B→$0.7B valuation; −$906M net income 2025; two impairment quarters; Q2'26 −14.7% | digest §4; bmbl-q2.md | [doc] |
| Users already called the concept exhausted | "The whole concept is outdated anyway, doesn't work." — Chris Parkin | tp-bumble.md | [doc-verbatim] |
| But the underlying need (women's safety) is MORE alive than ever — the distinction matters | 99%-abuse headline; Australia duty-of-care; stalking-feel reviews | gdi-home.md; tp-bumble.md | [doc] |
| Nuance | It is unproven whether the positioning failed or Bumble's execution did; either way, a new entrant reusing the framing inherits a decade of Bumble's muscle memory and resentments, while a safety-verified-for-everyone framing occupies the same need without the gendered-mechanics baggage | — | [inference] |

Mentor verdict [inference]: do not fight for "women-first mechanics"; do compete hard on "safest pool," which serves the same user with different, defensible mechanics (see §3.5, §6.3).

### 7.3 Other explicit no-go zones

| Zone | Why not | Evidence | Status |
|---|---|---|---|
| Invite-only exclusivity | Raya already owns the niche (top-apps roster) and it does not monetize at scale; The League got absorbed by Match | businessofapps-market.md roster; digest §7 | [doc] |
| Generic AI-wingman chatbots as the product | Incumbents already ship AI tiers (Grindr gAI six features, Edge; Bumble wingman in dev; Tinder ML/Select) with data advantages an entrant lacks | digest §4, §6, §9 | [doc] |
| Engagement-max casual discovery (feed-first, retention-loop products) | That is the incumbent playbook with the documented sentiment outcome (1.0–1.3 Trustpilot) and the fatigue evidence; also the exact target of duty-of-care regulation | tp-*.md; gdi-home.md; wiki-osa.md | [doc] + [inference] |
| Multi-segment launch (casual + serious + niche at once) | Portfolio logic belongs to Match (12+ brands, still −1% Q2'26); entrants win one segment first — Hinge won "designed to be deleted" serious-youth and is the only grower | digest §2, §5, §7 | [doc] + [inference] |
| Head-on price war vs Facebook Dating (free) | Free all-features competitor rising; compete on verified trust, not price | gdi-home.md; wiki-compare.md | [doc] (headline) + [inference] |

**Sources (§7):** digest §2–§7, §9, §13; businessofapps-market.md; gdi-home.md; wiki-compare.md; wiki-bumble.md via digest; bmbl-q2.md; tp-bumble.md; tp-*.md.

---

## 8. Conflicts & unknowns carried (program register applied to this deliverable)

**Conflicts — both values stated wherever used, never averaged:**

| # | Conflict | Values | Where it appears in this document |
|---|---|---|---|
| C1 | Tinder MAU | 60M (key stats) vs 75M (FAQ) | §5.4 T1, §7.1 |
| C2 | Tinder gender split | 75% male / 25% female (App Ape prose) vs 73/27 (BoA table) | Not load-bearing; not used elsewhere in this document |
| C3 | Hinge launch | Feb 2013 (overview) vs 2012 (prose) | Not load-bearing; noted |
| C4 | Grindr trajectory | FY25 $440M (10-K via wiki) vs FY26 guidance ≥$535M, later ~$540M (search result s-grnd.json) | §5.4 T7 (different sources, consistent direction) |
| C5 | Match CEO | Spencer Rascoff (current, 2 sources) vs Bernard Kim (stale BoA listing) | Not load-bearing; Rascoff used |
| C6 | Match Group 2025 revenue | $3.3B ≈ 54.4% (BoA) vs $3.49B ≈ 57.5% (FY2025 10-K via wiki-match.md) | Both stated (§1); 10-K is the SEC filing, BoA the aggregator — never averaged (per 01 §10 C3) |

**Unknowns (❓) — checked for, not in corpus — that bound this analysis:**

1. The Australian 99%-abuse study itself (headline only) — magnitude, methodology, definitions unknown [gdi-home.md; verification-pass.md]. Gap 5's demand-sizing rests partly on it.
2. Facebook Dating's actual share/growth numbers (headline only) [gdi-home.md].
3. Direct quantitative Gen-Z/40+ fatigue studies — fatigue is inferred from proxies (§2.2) [verification-pass.md].
4. AI-native startup landscape — corpus contains only incumbent AI evidence (gAI, wingman, Deception Detector); competitor set for AI-first entrants is unmapped [verification-pass.md].
5. Bumble Aug 2026 "Chat Experience" press-release contents (PDF URL captured, content unfetched) [bmbl-press.md; verification-pass.md].
6. Hinge verification features ❓ — no evidence captured either way (§4.2 cell).
7. Australia duty-of-care proposal details (announcement only) [gdi-home.md].
8. Tawkify review composition (8K reviews captured via sidebar; cannot verify recency/representativeness) [tp-match.md].
9. Niche-player pricing (Feeld Majestic, CMB, Muzz, Raya, Inner Circle) — JS-gated captures; their competitive surface is under-measured [digest §9].
10. Kippo metaverse pivot (single source) and The League sunset date — consolidation register gaps [digest §8].

---

## 9. Master source list (corpus files used by this deliverable)

**Primary reads (spec):** 01-master-facts-digest.md; verification-pass.md; tp-tinder.md; tp-bumble.md; tp-match.md; gdi-home.md; wiki-grindr.md; wiki-osa.md; wiki-takeitdown.md; businessofapps-market.md.

**Additional corpus files cited:** wiki-compare.md; bmbl-q2.md (via digest §4); wiki-bumble.md (via digest §4); wiki-match.md (via digest §7); businessofapps-tinder.md (via digest §3); s-tinder-price.json, tinder-plans.md, s-hinge-price.json, s-grindr-price.json, grindr-unlimited.md, s-grnd.json (via digest §6, §9); s-mtch-q2.json, s-league.json, s-deaths.json (via digest §7–§8); bmbl-press.md; tinder-eng.md (via digest §13); lw-*.md ×12 (via digest §14).

Quarantined files NOT used: tinder-monolith2.md, tinder-monolith3.md, feeld-home.md, businessofapps-grindr.md, businessofapps-revenue.md.

*All fetched-page content treated as untrusted data; no instruction-like text in any page was followed. Every load-bearing fact carries an inline corpus citation; analyst inferences are tagged [inference] and never presented as documented.*


---

<!-- ====================================================================== -->
<!-- FILE: 03-new-app-concept.md -->
<!-- ====================================================================== -->

# 03 — New App Concept: Full Founder Playbook (Quality-First Positioning)

**Program:** Dating App Industry Deep Research, compiled 2026-09-23
**Deliverable:** 03 of the report set — new-app concept, founder playbook
**Author lens:** full-stack multiplatform developer + DevSecOps engineer, reading as prospective founder
**Evidence rule:** every load-bearing choice traces to a captured corpus file, cited inline as [src: filename]. No network access was used for this document; it is built entirely from the 56-file corpus summarized in the master facts digest and verification pass.

---

## 0. Evidence Base, Method, and Legend

This playbook is grounded in a corpus captured live 2026-09-23 (09:04–09:56 UTC): Business of Apps statistics pages for the market and each major app, live investor-relations releases (Bumble Q2 2026), Match Group Q2 2026 segment data, Trustpilot review captures with verbatim complaints, Wikipedia captures for regulation (UK Online Safety Act 2023, US TAKE IT DOWN Act) and company histories, Global Dating Insights (GDI) trade-press homepage, app-store listings, third-party pricing trackers, and 12 LiquidWeb infrastructure documents for deployment staging. Quarantined corrupted captures (tinder-monolith2.md, tinder-monolith3.md, feeld-home.md) and 404 nav-only captures kept for provenance only (businessofapps-grindr.md, businessofapps-revenue.md) were not used.

The core market facts that shape every decision below [src: 01-master-facts-digest.md]:

- Global dating app revenue 2025: **$6.07B — the first-ever annual decline** [src: businessofapps-market.md]
- 350M+ users worldwide, ~23M paying (~6.6% payer penetration) [src: businessofapps-market.md]
- Match Group holds $3.3B (~54%) of the market per BoA vs $3.49B (~57.5%) per FY25 10-K — both carried [src: businessofapps-market.md, wiki-match.md]
- Tinder revenue fell to $1.84B in 2025 (-5.2%); subscribers slid from a 10.9M peak (2022) to 8.9M (2025) [src: businessofapps-tinder.md]
- Bumble is in visible distress: $782M revenue 2025 (-9.6%), **-$906M net income 2025**, two consecutive impairment quarters ($404.9M Q2'25, $169.3M Q2'26), valuation collapsed $13B (2021) → $0.7B (2025), BMBL at $2.85 on 2026-09-23 [src: businessofapps-bumble.md, bmbl-q2.md, gdi-home.md]
- Hinge is the only major grower: $689M 2025 (+25%), payers 1.06M (2022) → 1.95M (2025) [src: businessofapps-hinge.md]
- Trustpilot: Tinder 1.1, Hinge 1.2, Bumble 1.3, Match (DK profile) 1.0 — all "Bad" [src: tp-tinder.md, tp-bumble.md, tp-match.md]
- GDI, Sep 22 2026: "99% of Women Report Abuse on Dating Platforms, Australian Study Finds" (headline; study itself not captured — single-source flag) [src: gdi-home.md]
- Regulation is now a hard product constraint, not an afterthought: UK OSA age-verification deadline hit dating apps Jul 25 2025; US TAKE IT DOWN Act platform duties effective May 19 2026; Australia proposed a dating-app duty of care Sep 22 2026 [src: wiki-osa.md, wiki-takeitdown.md, gdi-home.md]

**Symbols used in feature and risk matrices:**

| Symbol | Meaning |
|---|---|
| ✅ | Confirmed present (documented in corpus) |
| ❌ | Absent (not documented) |
| 🟡 | Partial, paywalled, or beta (footnote gives the condition) |
| ➖ | Not applicable to that app's model |
| ❓ | Unconfirmed in corpus — flagged, never fabricated |
| **Bold** | Working-name candidate, placeholder, or template variable |

Sources for this section: 01-master-facts-digest.md, verification-pass.md, businessofapps-market.md, businessofapps-tinder.md, businessofapps-bumble.md, businessofapps-hinge.md, bmbl-q2.md, gdi-home.md, tp-tinder.md, tp-bumble.md, tp-match.md, wiki-osa.md, wiki-takeitdown.md.

---

## 1. Concept

### 1.1 The strategic read (why quality-first is the open lane)

Three documented forces converge on the same product posture:

1. **Trust crisis at the incumbents.** Every major app rates between 1.0 and 1.3 on Trustpilot, with 87–91% one-star distributions [src: tp-tinder.md, tp-bumble.md, tp-match.md]. The verbatim complaints cluster into five repeating buckets: fake profiles and bots, pay-to-see-likes resentment, dead conversations with inactive users, subscription billing traps, and support black holes. A 4.6-rated outlier exists — Tawkify, a human matchmaking service (8K reviews) [src: tp-match.md cross-list] — proving users will reward quality when they experience it.
2. **The growth story moved to intent and quality positioning.** Hinge, the one major app growing (+25% 2025, +22% Q2'26), is the one marketed on seriousness and outcomes ("designed to be deleted" positioning; voice notes and We Met feedback as flagship features) [src: businessofapps-hinge.md, s-mtch-q2.json]. Tinder is bolting on social features (Double Date, Music Mode, Astrology Mode) to fight fatigue [src: tinder-plans.md]. Bumble abandoned its founding differentiation in Aug 2026 when it retired women-message-first and stretched the match window to 72h [src: wiki-bumble.md] — leaving the "safety-first for women" brand position ambiguously held exactly when an Australian study reports 99% of women experiencing abuse on dating platforms [src: gdi-home.md].
3. **Compliance is now a moat an incumbent cannot easily copy.** The UK OSA already forced every major dating app to deploy age verification by Jul 25 2025 [src: wiki-osa.md]. The TAKE IT DOWN Act imposes a 48-hour NCII takedown duty enforceable by the FTC since May 19 2026 [src: wiki-takeitdown.md]. Australia is moving toward a statutory duty of care [src: gdi-home.md]. Incumbents carry legacy architectures and documented privacy failures (Grindr £26M settlement for sharing HIV status with analytics vendors, Sep 2026; Match and Bumble both hit in a Jan 2026 cyberattack campaign) [src: wiki-grindr.md, wiki-match.md, wiki-bumble.md]. A new app built safety-first from row zero can turn regulatory duty into brand promise at near-zero marginal positioning cost.

### 1.2 Name options (3)

All three names are working candidates. Trademark and app-store name-availability screening is ❓ not performed (no network access) — a pre-commit gate is listed in the roadmap. No candidate name appears in the corpus as an existing dating product.

| # | Name | Rationale (evidence-traced) | Risks |
|---|---|---|---|
| 1 | **Vouch** | Encodes the core mechanic (profiles are vouched human-verified; friends can vouch) and doubles as the invite verb for viral loops. Directly answers the #1 Trustpilot complaint bucket — fake profiles [src: tp-tinder.md, tp-bumble.md, tp-match.md]. | Generic-word trademark difficulty; "vouching" raises liability expectations if a vouched user misbehaves — needs careful ToS language. ❓ mark: legal screening pending. |
| 2 | **Candor** | Encodes the transparency pillar: visible likes for everyone, published matching rules, flat pricing. Contrasts with documented dynamic-pricing resentment ("they literally charged older people more" — $60.5M age-discrimination lawsuit mentioned in captured pricing coverage) [src: s-tinder-price.json] and algorithm-distrust verbatims ("the whole experience seems like it's on an algorithm") [src: tp-tinder.md]. | Softer safety connotation; reads intent-first rather than safety-first. ❓ mark: legal screening pending. |
| 3 | **Slowburn** | Anti-swipe-fatigue identity. Tinder's own 2026 homepage copy romanticizes "a slow burn that turns into something real" [src: tinder-plans.md] — incumbent-validated language for the outcome users say they want; Coffee Meets Bagel's Quincy Yang is publicly arguing "intentional dating is making a comeback" [src: gdi-home.md]. | Emotional rather than functional; harder to trademark as descriptive-adjacent; risks reading as casual/romance-novel rather than safety. ❓ mark: legal screening pending. |

Recommendation: **Vouch** as primary (function + loop in one syllable), Slowburn as campaign line rather than brand. Decision gate: trademark clearance + app-store search confusion test, both ❓ before commit.

### 1.3 One-line UVP

> **Every profile is a verified human. Every like is visible. The only thing you can buy is convenience — never attention.**

(Three clauses, each aimed at one documented pain: fake profiles [src: tp-tinder.md], pay-to-see-likes resentment [src: tp-bumble.md — "you have to pay just to see those who have 'liked'"], and pay-to-be-seen resentment [src: tp-bumble.md — the Premium+ "buried profile" complaint].)

### 1.4 Positioning statement (classic template)

**For** safety-conscious relationship-seekers (25–45, skewing female) **who** are exhausted by fake profiles, paywalled attention, dead chats, and abuse — and are quitting or downgrading the incumbents because of it — **Vouch** is a verified-first dating app **that** guarantees human-only profiles through mandatory verification, shows everyone who liked them for free, publishes its matching rules, and answers every support request with a human within 48 hours. **Unlike** Tinder (Trustpilot 1.1; subscribers down from 10.9M to 8.9M), Bumble (1.3; revenue -9.6%, net loss $906M, women-first mechanic retired Aug 2026), and Match (1.0 on the captured profile), **which** monetize scarcity and engagement while their trust metrics decay, Vouch monetizes density and outcomes — and its compliance posture (OSA-aligned age verification, TAKE IT DOWN-ready NCII handling, data minimization after the Grindr £26M precedent) is the moat, not the tax.

### 1.5 Why now (the four-part opening)

| Force | Evidence | Consequence for a new entrant |
|---|---|---|
| First-ever market decline ($6.07B, 2025) | [src: businessofapps-market.md] | Incumbents are in cost-cutting and turnaround mode (Match: CEO Rascoff's "turnaround strategy"; Bumble: two impairment quarters) — they will optimize ARPPU, not rebuild trust architecture. PR and hiring markets for a trust-positioned challenger are cheapest in years. |
| Trust collapse, quantified | Trustpilot 1.0–1.3 across majors [src: tp-tinder.md, tp-bumble.md, tp-match.md]; 99%-women-abuse study headline [src: gdi-home.md]; Grindr £26M privacy settlement [src: wiki-grindr.md] | The single largest unaddressed differentiator is credibility itself. No captured major-app messaging owns "verified humans only" as a brand pillar (niche incumbent Feeld does market biometric identity verification — "Real people, real profiles" [src: feeld-home2.md] — so the lane is open among majors, not untouched). |
| Regulation raised the floor | UK OSA age checks live Jul 25 2025 (fines to £18M or 10% of turnover); TAKE IT DOWN duties since May 19 2026; Australia duty-of-care proposal Sep 22 2026 [src: wiki-osa.md, wiki-takeitdown.md, gdi-home.md] | Compliance cost is now mandatory for everyone — but a greenfield build amortizes it across architecture instead of retrofit. Compliance-as-moat thesis is explicitly supported in the research digest [src: 01-master-facts-digest.md §11]. |
| Exit/climate signal | Match paid $100M for a minority Sniffies stake (Apr 2026), absorbed The League, shut Archer (Jun 2026) [src: wiki-match.md, s-league.json]; Facebook Dating "quietly gains ground" [src: gdi-home.md] | Strategics are buying differentiated, community-density assets rather than building. A niche-density winner has a plausible acquirer landscape;❓ note: Sniffies figure is single-source. |

Sources: 01-master-facts-digest.md, businessofapps-market.md, businessofapps-tinder.md, businessofapps-bumble.md, bmbl-q2.md, gdi-home.md, s-league.json, tinder-plans.md, tp-bumble.md, tp-tinder.md, tp-match.md, wiki-bumble.md, wiki-grindr.md, wiki-match.md, wiki-osa.md, wiki-takeitdown.md, s-tinder-price.json.

---

## 2. Ideal Customer Profile (ICP)

### 2.1 Demographic grounding from captured data

The corpus gives unusually specific demographic anchors for Tinder (US): 35% of users are 18–24, 25% are 25–34 (60% under 35); gender split 75% male (text; ~25% female implied) vs 73/27 (BoA table) — internal BoA conflict, both carried; modal household income $60–80k (30% of users); and a Civic Science penetration table showing Tinder strongest under 35 (40% at 18–24, 25% at 25–34) while losing 35+ to Match.com (15%) and eHarmony (10%) [src: businessofapps-tinder.md]. Hinge penetration: 20% at 18–24, 19% at 25–34, 7% at 35+; Hinge is #1 in the UK, Ireland, Sweden, Norway, Denmark, with ~50% of users in the US [src: businessofapps-tinder.md, businessofapps-hinge.md]. Bumble penetration: 25% at 18–24, 22% at 25–34, 14% at 35+ [src: businessofapps-tinder.md]. GDI ran an explicit editorial on Sep 21 2026: "Dating Apps Keep Chasing Gen Z. What About 40+?" [src: gdi-home.md] — the 35+ intent segment is both large (per the penetration table) and under-served by swipe apps.

### 2.2 Primary persona — "Maya," 29, the burned-out serious dater

| Attribute | Detail | Evidence trace |
|---|---|---|
| Age | 27–34 core (secondary band 25–39) | Hinge's growth cohort (19–20% penetration 25–34) and Tinder's 25–34 = 25% [src: businessofapps-tinder.md]; Hinge is the only grower, so intent-seekers are consolidating there — we intercept the overflow |
| Gender | Female by design (60%+ of launch cohort target) | Documented 75/25 male skew is the engagement-killing imbalance [src: businessofapps-tinder.md]; Europe is closer to 50/50 → launch geography lever; Bumble's Aug 2026 retreat from women-first leaves the safety-for-women position open [src: wiki-bumble.md] |
| Income | $60–80k household mode (30% of Tinder users) — proven willingness to pay exists (23M payers industry-wide) but resentment is high | [src: businessofapps-tinder.md, businessofapps-market.md] |
| Behavior | Has 2–3 incumbent apps installed; swipes in bursts; abandoned Bumble after the Aug 2026 chat changes (inferred from captured pivot coverage and complaint verbatims about the one-opening-message limit) | [src: wiki-bumble.md, tp-bumble.md] |
| Pains (verbatim-grounded) | Fake profiles; creepy/abusive messages; paying to see likes then matches vanish; matches who never reply | [src: tp-tinder.md, tp-bumble.md, gdi-home.md] |
| Job-to-be-done | "Get me on real dates with real people, safely, without feeling farmed for subscription money" | Synthesis of the five Trustpilot complaint buckets [src: tp-*.md] |

### 2.3 Secondary persona — "Daniel," 41, post-divorce re-entry

| Attribute | Detail | Evidence trace |
|---|---|---|
| Age | 38–52 | 35+ users already prefer Match.com (15% penetration) and eHarmony (10%) over Tinder (12%) [src: businessofapps-tinder.md]; GDI editorial validates the segment gap [src: gdi-home.md]; Tawkify's 4.6 Trustpilot (8K reviews) shows this cohort rewards high-touch quality [src: tp-match.md cross-list] |
| Gender | Male and female both; male-heavy skew expected (mirrors 75/25 industry skew — treat as a design constraint, not a surprise) | [src: businessofapps-tinder.md] |
| Income | Higher than primary persona (established households); eHarmony/Match cohort demonstrably pays for seriousness | [src: businessofapps-tinder.md penetration table] |
| Pains | Overwhelmed by swipe volume mechanics; distrusts "free" apps; worried about professionalism/discretion (Grindr's Unlimited marketing literally sells discretion to busy professionals) | [src: grindr-unlimited.md] |
| Job-to-be-done | "Introduce me to age-appropriate, relationship-minded people with structure and accountability" | Grounded in CMB "intentional dating comeback" positioning [src: gdi-home.md] |

### 2.4 Anti-persona (explicitly not served at launch)

Casual/anonymous-seeking users who need incognito-first or explicit-content-tolerant products. Feeld (14M+ open-minded community, couples linking, screenshot-proof chat) and Pure occupy this lane with dedicated architecture [src: feeld-home2.md, pure-home.md]; serving it well requires different moderation posture and would dilute the safety-first brand. Also excluded: under-25 campus-casual users (Tinder's strongest cohort at 40% penetration 18–24 [src: businessofapps-tinder.md]) — they are best reached later once density exists.

Sources: businessofapps-tinder.md, businessofapps-hinge.md, businessofapps-bumble.md, businessofapps-market.md, gdi-home.md, grindr-unlimited.md, feeld-home2.md, pure-home.md, tp-bumble.md, tp-match.md, tp-tinder.md, wiki-bumble.md.

---

## 3. Feature Set

### 3.1 Core loop (design)

**Verify → Browse a small daily slate → Match with visible mutual intent → Chat with safety rails → Propose a real date (structured) → Post-date feedback (feeds quality score).**

Loop properties, each anti-thesis to a documented incumbent pain:

- **Verify** (one-time, hard gate): liveness + document hybrid via an age-assurance vendor. Precedents: all major dating apps deployed UK age checks by Jul 25 2025 under OSA [src: wiki-osa.md]; Persona-style photo checks were bypassed with game-character images [src: wiki-osa.md] — therefore a selfie-plus-document hybrid, not photo-only, is the floor. Bumble's Deception Detector (AI fake-profile blocking) proves the anti-fake stack is buildable [src: wiki-bumble.md].
- **Small daily slate** (quality over volume): bounded daily introductions, Hinge-style (free Hinge = 8 likes/day [src: s-hinge-price.json]); CMB's "intentional dating" thesis is gaining trade-press traction [src: gdi-home.md].
- **Visible likes for everyone, free**: kills the single most monetized-and-resented paywall (Tinder Gold's "See Who Likes You" [src: s-tinder-price.json]; Bumble complaint "you have to pay just to see those who have 'liked'" [src: tp-bumble.md]). Note: Tinder's own pressroom confirms it is testing See Who Likes You and Passport as a-la-carte purchases [src: s-tinder-price.json] — incumbents sense the resentment too; speed matters.
- **Safety-railed chat**: AI nude-image blur (Bumble Private Detector precedent, open-sourced 2019 [src: wiki-bumble.md]), pre-send friction nudges (Tinder's "Are You Sure?" and "Does This Bother You?" [src: tinder-plans.md]), one-tap block/report/unmatch (Tinder parity [src: tinder-plans.md]), and NCII handling with the 48-hour takedown-and-delete SLA that US law already requires [src: wiki-takeitdown.md].
- **Structured date proposal**: match → pick from a shortlist of public-venue date ideas with time slots; echoes Tinder's Share My Date safety feature [src: tinder-plans.md] and Hinge's We Met feedback loop [src: businessofapps-hinge.md]. Success metric borrows Tinder's own claim unit ("1.5M users/week go on dates" — a Tinder claim, labeled as such) [src: businessofapps-tinder.md].
- **Post-date feedback**: feeds a profile-quality signal (reliability, intent accuracy) — the honest version of Hinge's We Met [src: businessofapps-hinge.md].

### 3.2 Pain → feature map (every differentiator traces to a captured complaint)

| # | Documented pain (verbatim or evidence) | Feature answer | Evidence source |
|---|---|---|---|
| 1 | Fake profiles / bots ("numerous fake profiles and spam bots across the entire platform" — Trustpilot AI summary) | Mandatory human verification at signup; verified badge; AI anomaly detection modeled on Bumble Deception Detector | [src: tp-tinder.md, wiki-bumble.md] |
| 2 | Pay-to-see-likes resentment ("you have to pay just to see those who have 'liked'") | See Who Likes You free for all, forever — written into the pricing charter | [src: tp-bumble.md, s-tinder-price.json] |
| 3 | Pay-to-be-seen resentment (post-payment engagement collapse: "after paying... suddenly now I get ZERO likes") | No boosts or priority visibility sold in any tier at launch; charter clause: attention is never for sale | [src: tp-bumble.md] |
| 4 | Dead conversations / inactive users ("most of the accounts are dormant"; "zero follow up conversations") | Activity-honesty features: profiles marked inactive after 14 days idle and removed from slates; reply-rate expectations surfaced on profiles | [src: tp-bumble.md, tp-match.md] |
| 5 | Support black hole ("an AI bot that goes round in circles, then 3 weeks to get a reply"; small-claims threats) | 48-hour human-response SLA on every support ticket, published and measured; ban appeals reviewed by a human with written reason | [src: tp-bumble.md, tp-tinder.md, tp-match.md] |
| 6 | Billing traps ("auto renewed despite in not appearing in the Play store" — quote verbatim, sic) | No annual-only plans at launch; weekly/monthly cancel-anywhere; renewal reminders 72h before charge | [src: tp-bumble.md, tp-tinder.md] |
| 7 | Bans without recourse ("permanent ban for basically doing nothing") | Transparent moderation: reason codes, evidence summary, human appeal path | [src: tp-tinder.md] |
| 8 | Abuse of women (99% study headline; "creepy comments... like low key being stalked") | Women-first safety pack: vouch-required first messages from unmatched users impossible (no cold DMs), AI creep-message interception with Private Detector precedent, easy evidence export for police reports | [src: gdi-home.md, tp-bumble.md, wiki-bumble.md] |
| 9 | NCII / image abuse (OSA cyberflashing offense; TAKE IT DOWN 48h duty) | Expiring, screenshot-resistant images (Grindr Expiring Photos and Feeld screenshot-block precedents); NCII report flow with statutory 48h takedown + hash-based copy deletion | [src: wiki-osa.md, wiki-takeitdown.md, grindr-unlimited.md, feeld-home2.md] |
| 10 | Privacy fear after Grindr HIV-data settlement (£26M) | Sensitive-attribute data minimization: zero third-party analytics on orientation/health fields; on-device where possible; public data-map page | [src: wiki-grindr.md] |
| 11 | Algorithm distrust ("the whole experience seems like it's on an algorithm") | Published matching rules ("the Vouch Ledger"): plain-language spec of what the ranker optimizes; no engagement-maximizing dark patterns | [src: tp-tinder.md] |
| 12 | Swipe fatigue / Gen Z fatigue (indirect evidence; GDI fatigue podcast exists) | Slow slate (bounded intros), Double Date mode (Tinder's own Double Date validates the demand) [src: tinder-plans.md], optional friend-vouch tags | [src: gdi-home.md, tinder-plans.md] |

### 3.3 Feature matrix vs captured incumbents

Legend: ✅ confirmed present in corpus · 🟡 partial/paywalled/beta · ❌ not documented · ➖ not applicable · ❓ unconfirmed.

| Feature | Vouch (planned) | Tinder | Bumble | Hinge | Grindr | Feeld |
|---|---|---|---|---|---|---|
| Mandatory human verification for all | ✅ (design) | 🟡 (Photo Verification + Face Check, select markets) | 🟡 (verification exists; Deception Detector AI) | 🟡 | 🟡 (UK age verify since Jul 2025) | 🟡 (UK age checks) |
| See who likes you — free | ✅ (design) | ❌ (Gold $39.99/mo) | ❌ (paid tier) | ❌ (Hinge+ $29.99/mo) | 🟡 (XTRA features) | ❌ (Majestic) |
| Age verification (regulatory) | ✅ (design, all markets) | ✅ (UK) | ✅ (UK) | ✅ (UK) | ✅ (UK, since Jul 2025) | ✅ (UK) |
| AI nude-image blur | ✅ (design) | ❓ | ✅ (Private Detector, open-sourced) | ❓ | ❓ | ❓ |
| AI fake-profile blocking | ✅ (design) | ❓ | ✅ (Deception Detector) | ❓ | 🟡 (gAI suite, premium) | ❓ |
| Chat pre-send abuse nudges | ✅ (design) | ✅ ("Are You Sure?", "Does This Bother You?") | ❓ | ❓ | ❓ | ❓ |
| Structured date proposals | ✅ (design) | 🟡 (Share My Date safety feature, not a loop) | ❓ | 🟡 (We Met feedback) | ➖ | ➖ |
| Post-date feedback loop | ✅ (design) | ❓ | ❓ | ✅ (We Met) | ❓ | ❓ |
| Expiring / screenshot-proof images | ✅ (design) | ❌ | ❌ | ❌ | ✅ (Expiring Photos, Unlimited tier) | ✅ (chat images can't be screenshotted) |
| Published matching rules | ✅ (design) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Weekly subscription option | 🟡 (later phase) | 🟡 (Plus weekly $12.99 captured) | ❓ | ❓ | ✅ ($14.99/wk XTRA) | ❓ |
| Human support SLA (48h) | ✅ (design) | ❌ (documented non-response) | ❌ (documented bot loops) | ❓ | ❓ | ❓ |
| Double Date / group mode | 🟡 (V2) | ✅ (Double Date) | ❓ | ❓ | ➖ | ➖ |
| Voice prompts on profiles | 🟡 (V1) | ❓ | 🟡 (voice/video calls documented Jun 2019; profile voice notes not captured) | ✅ ("one of most popular features") | ❓ | ❓ |

Pricing cells for context: Tinder Gold $39.99/mo and Hinge+ $29.99/mo [src: s-tinder-price.json, s-hinge-price.json]; Grindr XTRA weekly $14.99 [src: s-grindr-price.json]; Feeld Majestic pricing ❓ (JS-gated in capture) [src: feeld-majestic.md].

### 3.4 AI scope — realistic and precedent-grounded

What AI we build, and what we refuse:

| AI capability | Precedent in corpus | Our scope | Explicitly out of scope |
|---|---|---|---|
| Recommendation embeddings | Tinder's in-house Elasticsearch Java scoring plugin and recommendation-embeddings research [src: tinder-eng.md] | Embedding-based compatibility ranking over verified profiles; rules published in the Vouch Ledger | Engagement-time-maximizing objectives (the anti-pattern users accuse incumbents of) [src: tp-tinder.md] |
| Deception/fake detection | Bumble Deception Detector [src: wiki-bumble.md]; Grindr gAI premium suite (six AI features, tested 2025) [src: wiki-grindr.md] | Verification-fraud detection (stolen selfies, recycled photo sets — directly answers the "stay at the same hotel" photo-set verbatim) [src: tp-tinder.md] | — |
| Nude/NCII detection | Bumble Private Detector (open-sourced) [src: wiki-bumble.md]; TAKE IT DOWN copy-deletion duty [src: wiki-takeitdown.md] | Inbound image classification + hash-list takedown within the statutory 48h | Weakening E2E protections to scan (contested legally — ECHR ruling noted in OSA capture) [src: wiki-osa.md] |
| Profile coach | Grindr gAI premium intent; Bumble "wingman" chatbot in development [src: wiki-grindr.md, wiki-bumble.md] | V2+: opt-in profile/photo coaching and icebreaker suggestions, premium tier | Generative chatbots pretending to be users — Match complaint verbatim mocks AI chats "with no long-term memory"; Bumble prohibits AI-generated fake profiles [src: tp-match.md, wiki-bumble.md] |
| Safety triage | — | ML-assisted report routing to human moderators (SLA keeper) | Fully automated bans (documented pain) [src: tp-tinder.md] |

Sources: businessofapps-hinge.md, businessofapps-tinder.md, feeld-home2.md, feeld-majestic.md, gdi-home.md, grindr-unlimited.md, s-grindr-price.json, s-hinge-price.json, s-tinder-price.json, tinder-eng.md, tinder-plans.md, tp-bumble.md, tp-match.md, tp-tinder.md, wiki-bumble.md, wiki-grindr.md, wiki-osa.md, wiki-takeitdown.md.

---

## 4. Early-Adopter Venues (seeding plan)

Density-first seeding requires specific, reachable communities. Regional choices follow captured geography: Hinge is #1 in UK, Ireland, Sweden, Norway, Denmark [src: businessofapps-hinge.md]; Tinder earns ~40% of revenue in the US and ~10% in the UK [src: businessofapps-tinder.md]; Japan is walled (Pairs geo-blocks all non-Japan IPs [src: pairs-home2.md]) and is excluded at launch. Items marked "(inferred)" are reasoned from captured evidence rather than directly documented as venues.

| # | Venue / community | Why this ground (evidence) | Mark |
|---|---|---|---|
| 1 | London, UK — launch city | Hinge's #1 market (intent-app receptivity); UK dating apps already normalized age verification since Jul 2025 [src: wiki-osa.md]; the loudest captured complaints are GB-postcoded (billing/refund, Consumer Rights Act invocations) [src: tp-tinder.md, tp-bumble.md]; OSA enforcement climate rewards compliance-forward entrants | Evidence-grounded |
| 2 | UK second cities (Manchester, Edinburgh, Bristol, Leeds) | GB complaint density across regions in captured reviews; avoids London's incumbent ad-saturation | Inferred |
| 3 | New York City | Explicitly named in captured pricing copy as a "competitive market" where visibility products sell [src: s-tinder-price.json]; densest US dating market; US = 40% of Tinder revenue | Evidence-grounded |
| 4 | Los Angeles / SF Bay Area | Named alongside NYC in the same capture [src: s-tinder-price.json]; media industry amplifies narrative launches | Inferred |
| 5 | Stockholm, Copenhagen, Oslo | Hinge #1 in Sweden, Norway, Denmark — proven intent-dating demand with less incumbent siege; English-fluent product acceptable at MVP | Evidence-grounded receptivity, inferred demand for ours |
| 6 | Dublin, Ireland | Hinge #1 in Ireland; English-speaking EU market for DSA-aligned expansion | Evidence-grounded receptivity |
| 7 | Sydney / Melbourne, Australia | Duty-of-care proposal + 99%-abuse study broke the same week (Sep 22 2026) — safety-first product enters a boiling national conversation [src: gdi-home.md] | Evidence-grounded timing |
| 8 | Divorce/re-start communities and 40+ single-parent groups | GDI editorial "What About 40+?" names the gap; 35+ penetration already skews to Match/eHarmony [src: gdi-home.md, businessofapps-tinder.md] | Inferred |
| 9 | Run clubs, hiking groups, rec-sports leagues in launch city | IRL-first Gen Z/young-millennial trend is the fatigue antidote; our structured date loop extends what these groups already do | Inferred |
| 10 | University alumni networks (25–34 band) | Tinder's own origin: trialed in US college campuses first [src: businessofapps-tinder.md] — the campus→alumni seeding pattern is incumbent-validated | Precedent-grounded |
| 11 | Matchmaking-service overflow / Tawkify-priced-out users | Tawkify's 4.6 rating (8K reviews) proves appetite for curated, human-touch matching [src: tp-match.md]; its price point ❓ (not captured) is presumably premium — we capture the priced-out middle | Inferred |
| 12 | Ex-Bumble power users post-Aug-2026 pivot | Women-message-first retirement + one-opening-message complaints [src: wiki-bumble.md, tp-bumble.md] created a homeless cohort exactly matching our persona | Inferred |
| 13 | Feeld-style community events model (singles events with community partners) | Feeld runs events with community partners successfully [src: feeld-home2.md] — we copy the mechanic with a mainstream-safety flavor in the launch city | Model-precedent |
| 14 | Trade-press ecosystem (GDI/Courtland Brooks) | GDI runs podcasts featuring small founders (Surf Dating, Vybes, Sister Wives, CMB) — a documented channel where niche newcomers get coverage; 30,000 monthly trade readers [src: gdi-home.md] | Evidence-grounded |

Cold-start sequencing within each city: seed women first (60/40 target), via venues 8–13; open to men once female-slate density clears threshold (KPI in §10). This is the direct counter to the documented 75/25 skew [src: businessofapps-tinder.md], and the Pairs "women control, men pay" formula cited in the Match Japan article is the captured proof that gender-asymmetric mechanics can anchor a market [src: wiki-match.md].

Sources: businessofapps-hinge.md, businessofapps-tinder.md, feeld-home2.md, gdi-home.md, pairs-home2.md, s-tinder-price.json, tp-bumble.md, tp-tinder.md, tp-match.md, wiki-bumble.md, wiki-match.md, wiki-osa.md.

---

## 5. Landing Page

### 5.1 Three hero versions (A/B/C test at waitlist launch)

**Hero A — "The Fakes" (trust angle; primary)**

- Headline: **Every profile verified. Every like visible. Every human real.**
- Subhead: Vouch is the dating app where verification isn't a badge — it's the door. No bots, no hidden likes, no paying to be seen. Just verified people who actually show up.
- CTA button: Get early access — join your city's list
- Secondary link: Read our transparency charter

**Hero B — "The Bill" (anti-paywall angle)**

- Headline: **You've paid enough for attention.**
- Subhead: On the big apps, seeing who likes you costs $40 a month and being seen costs more. On Vouch, likes are visible for free — forever — and the only thing you can buy is convenience.
- CTA button: Join the waitlist — free means free
- Secondary link: See our full pricing page (one price, published, no dark patterns)

**Hero C — "The Date" (outcome angle)**

- Headline: **Fewer swipes. Better humans. Actual dates.**
- Subhead: A small daily slate of verified people. Structured date proposals instead of dead-end chats. Feedback that makes the next date better. Dating that ends with a calendar invite, not a subscription.
- CTA button: Get my first slate
- Secondary link: How the date loop works (60-second tour)

### 5.2 Social-proof strip (honest pre-launch construction)

No fake user counts. Strip uses verifiable commitments plus market framing drawn from captured stats:

1. **Trust commitments row:** "Age-verified (OSA-aligned) · NCII takedown within 48 hours (TAKE IT DOWN-ready) · Human support reply within 48 hours · Zero sale of sensitive data"
2. **Waitlist momentum row:** live counters — "X verified humans on [city]'s list" (real number, starts small and honest) + "Y% women" (gender-balance transparency doubles as proof of the 60/40 promise)
3. **Market-frame row (cites public data):** "The big three rate 1.0–1.3 on Trustpilot. We built Vouch because we read the reviews too." (The Trustpilot ratings for Tinder, Bumble, and Match are publicly checkable [src: tp-tinder.md, tp-bumble.md, tp-match.md].)
4. **Press row:** placeholder for GDI/coverage logos — GDI demonstrably covers newcomer founders [src: gdi-home.md]

### 5.3 Conversion architecture notes (below the fold)

- City-selector that routes waitlist signups into density buckets (powers the §7 sequencing).
- "Why we exist" section quoting the five complaint buckets in users' own words (paraphrased from captured reviews — licensing note: paraphrase, don't lift verbatim text into marketing).
- Email + optional LinkedIn/instant-message handle capture; referral mechanic: move up your city's launch queue by vouching friends (name-mechanic alignment).

Sources: s-tinder-price.json, tp-bumble.md, tp-tinder.md, tp-match.md, wiki-osa.md, wiki-takeitdown.md, gdi-home.md.

---

## 6. Press Kit

### 6.1 Boilerplate (about section, ~90 words)

> **[Company]** builds **Vouch**, the dating app where every profile is a verified human and every like is visible — free. Founded in [year] by [founder names], [Company] answers a market in trust decline: industry revenue fell for the first time on record in 2025 while the major apps rate between 1.0 and 1.3 on Trustpilot. Vouch's transparency charter publishes its matching rules, prices, and safety SLAs — 48-hour human support, 48-hour NCII takedown, age verification aligned with the UK Online Safety Act. [Company] is headquartered in [city]. Online at [domain].

### 6.2 Press release template 1 — Launch

> **FOR IMMEDIATE RELEASE**
>
> **Vouch launches in [city]: the dating app that verifies every human and shows every like — free**
>
> [CITY], [DATE] — [Company] today launched Vouch, a verified-first dating app, in [city] — the first market in a city-by-city rollout. Unlike incumbent apps, Vouch requires human verification for every profile, shows every member who liked them at no cost, and sells no visibility boosts of any kind.
>
> "The industry's own numbers tell the story," said [Founder], [title]. "Revenue fell for the first time ever last year, and the big apps sit at one star on review sites. People aren't done with dating apps — they're done with being farmed. We built the app we'd trust with our own sisters and brothers."
>
> Vouch launches with [N] verified members in [city], [N]% of them women, and a published transparency charter covering matching rules, moderation, and pricing. Safety features include [age assurance aligned with the UK Online Safety Act], [AI-assisted detection of fake profiles and non-consensual imagery], and a 48-hour human-response guarantee on every support ticket.
>
> Vouch is available on iOS and Android in [city]. Waitlists are open at [domain] for [next cities].
>
> **About [Company]** [boilerplate]
> **Media contact:** [name], [email], [phone]

### 6.3 Press release template 2 — Funding

> **FOR IMMEDIATE RELEASE**
>
> **[Company] raises $[X]M [seed/Series A] to make verified dating the industry standard**
>
> [CITY], [DATE] — [Company], maker of verified-first dating app Vouch, today announced $[X]M in [round] funding led by [lead investor], with participation from [others]. The capital funds expansion from [N] to [N] cities and the buildout of the company's safety and verification infrastructure.
>
> "Dating is a $6 billion market in trust decline — every major app rates around one star while regulators in the UK, US, and Australia raise the bar for safety," said [Investor], [title] at [fund]. "This team is the first we've seen treating verification and transparency as the product, not the compliance department."
>
> Since launch, Vouch has verified [N] members, facilitated [N] confirmed dates, and maintained a [N]% human-response rate within 48 hours. The company publishes its safety and matching metrics quarterly at [domain]/ledger.
>
> **About [Company]** [boilerplate]
> **Media contact:** [name], [email], [phone]

### 6.4 Founder-bio template

> **[Name]** is the founder and [CEO/CTO] of [Company]. [He/She/They] spent [N] years as a [full-stack engineer / DevSecOps engineer] building [domain] systems at [companies], where [he/she/they] led [relevant: security program, platform rebuild, trust and safety tooling]. [Name] founded [Company] after [origin story — e.g., documenting the review-record of incumbent apps and finding a market of 350M users served by products rated one star]. [Name] holds [credentials] from [institution], and writes about verification, safety-by-design, and transparent algorithms at [domain]/blog.

### 6.5 Press FAQ (10 questions with answers)

1. **Why launch a dating app when industry revenue just fell for the first time?** The $6.07B decline [src: businessofapps-market.md] is a trust correction, not a demand collapse — 350M people still use these products. Declining incumbent revenue (Tinder -5.2%, Bumble -9.6%) coexists with Hinge growing +25% by selling seriousness [src: businessofapps-hinge.md]. Quality-first is the growing segment of a shrinking-numerator market.
2. **How do you verify everyone?** Hybrid age assurance: liveness selfie plus document check through an accredited provider — the same class of infrastructure all major dating apps deployed for the UK's Jul 25 2025 deadline [src: wiki-osa.md] — extended from an age check to a full human-uniqueness check, plus AI anomaly detection on photos (Bumble's Deception Detector proves feasibility) [src: wiki-bumble.md].
3. **Can verification be bypassed?** Photo-only checks have been bypassed (documented Persona/game-character incident) [src: wiki-osa.md]; that's why we require the document hybrid and continuous re-verification on fraud signals. We publish our bypass-incident rate in the Ledger.
4. **What happens to my ID data?** Minimization by design: vendor-side verification returns a pass/fail plus age band; we do not store document images. Sensitive attributes never go to third-party analytics — the explicit anti-Grindr-settlement stance [src: wiki-grindr.md].
5. **What do you do about non-consensual intimate images?** Statutory duty is a 48-hour takedown-and-delete upon victim notice under the TAKE IT DOWN Act (enforceable since May 19 2026) [src: wiki-takeitdown.md]; we treat it as a maximum, deploy AI detection (Private Detector precedent) [src: wiki-bumble.md], and offer expiring screenshot-resistant images [src: grindr-unlimited.md, feeld-home2.md].
6. **Is this only for women?** No — but women get the safety pack first (no cold DMs, creep-message interception, evidence export), because the documented abuse statistic (99% of women, per the Australian study headline [src: gdi-home.md]) and the 75/25 gender skew [src: businessofapps-tinder.md] make women the constraint on every dating market's quality.
7. **How do you make money if likes are free?** A single published subscription for convenience features (advanced filters, travel mode, later an opt-in AI coach) — never visibility. Full rationale in §8. Precedent that convenience monetization works: 23M people already pay across the industry [src: businessofapps-market.md].
8. **Are you using AI to chat for users?** Never. AI-generated pseudo-users are the documented enemy (Bumble prohibits them; users mock AI chats "with no long-term memory") [src: wiki-bumble.md, tp-match.md]. AI runs verification, safety, and optional coaching — off-stage.
9. **What about the UK Online Safety Act specifically?** We are OSA-native: age verification on day one, illegal-content risk assessments, reporting and redress flows, record-keeping — the duties list is public and we built the product down it [src: wiki-osa.md]. Fines for failure reach £18M or 10% of turnover; we prefer the architecture.
10. **What happens when Match Group copies you?** They might — Tinder ships actively (last captured update Sep 21 2026) [src: gp-tinder.md]. But copying "visible likes for free" cannibalizes their Gold-tier revenue ($39.99/mo [src: s-tinder-price.json]) and copying verification retrofits 60M+ MAU onto a rebuilt trust architecture. Incumbents optimizing a declining funnel rarely choose self-cannibalization; if they do, the market gets what it needs anyway.

Sources: businessofapps-hinge.md, businessofapps-market.md, businessofapps-tinder.md, feeld-home2.md, gp-tinder.md, gdi-home.md, grindr-unlimited.md, s-tinder-price.json, tp-match.md, wiki-bumble.md, wiki-grindr.md, wiki-osa.md, wiki-takeitdown.md.

---

## 7. Go-To-Market Plan

### 7.1 Phased plan

**Phase 0 — Pre-launch waitlist (months 0–3).** Landing page with the three heroes; city-vote mechanic; referral-vouch queue-jumping. Target: 25,000 verified-intent signups concentrated in London before a single profile goes live (density math in §10; the number is a planning target, not a captured benchmark — flagged as founder assumption). Simultaneously: press-kit seeding via GDI-ecosystem outreach (documented newcomer-coverage channel [src: gdi-home.md]) and founder-led content on verification/safety engineering (DevSecOps credibility as marketing).

**Phase 1 — Single-city density (months 4–9).** London launch (rationale §4). Hard density tactics: women-first invitations through venues 8–13 (60/40 cap enforced in invitation waves); neighborhood-level saturation goal before suburban spread (network effects are hyper-local — a dating app's unit of value is "verified people within dating distance"). Weekly real-world anchor events with community partners (Feeld's events model, mainstream flavor [src: feeld-home2.md]). Local PR on the trust narrative. Exit criteria: match-rate and date-confirmation KPIs in §10 green for 8 consecutive weeks.

**Phase 2 — City-by-city wave (months 10–18).** Sequence by regulation alignment and captured receptivity: NYC (US = 40% of incumbent revenue pool [src: businessofapps-tinder.md]); then Nordics capitals + Dublin (Hinge-primed intent markets [src: businessofapps-hinge.md]); then Sydney/Melbourne timed to the Australian duty-of-care conversation [src: gdi-home.md]. Each city repeats the Phase-1 playbook with a local community partner; expansion capital gate: CAC payback under 6 months from subscription revenue (internal gate).

**Phase 3 — Scale (months 19–36).** English-speaking EU + second US wave; a-la-carte convenience items and premium AI tier (monetization §8); Double Date and group modes against Tinder's validated demand [src: tinder-plans.md]; evaluate partnership or white-label of the verification stack itself (compliance-as-a-product line — the corpus shows every dating app now needs OSA-grade age assurance [src: wiki-osa.md]).

### 7.2 Channel table

| Channel | Phase | Evidence it works | Primary KPI | Est. cost posture |
|---|---|---|---|---|
| Founder content (verification/safety engineering) | 0–3 | DevSecOps credibility angle; Tinder's own eng blog publishes security research — appetite exists for the genre [src: tinder-eng.md] | Waitlist signups per post | Time only |
| Trade press (GDI, Courtland Brooks ecosystem) | 0–3 | GDI features small founders monthly (Surf Dating, Vybes, Sister Wives podcasts) [src: gdi-home.md] | Coverage count, referral traffic | Free/earned |
| Community partners (run clubs, alumni, parent groups) | 1–2 | Feeld's community-partner events model [src: feeld-home2.md] | Verified female signups per event | Revenue-share/events |
| Referral-vouch loop | 1–3 | Name-mechanic; Tinder's campus origin shows viral seeding precedents [src: businessofapps-tinder.md] | K-factor, queue conversion | Product-led |
| Local PR (city launch narrative: one-star incumbents) | 1–2 | Publicly checkable Trustpilot ratings 1.0–1.3 make the story journalist-proof [src: tp-tinder.md, tp-bumble.md, tp-match.md] | Earned mentions, signup spikes | PR retainer |
| Paid social (women-targeted, trust message) | 2–3 | Deliberately deferred until retention is proven — Bumble's ad-spend-into-decline pattern is the captured cautionary tale (investing "across product, technology, and brand" while revenue fell 14.7%) [src: bmbl-q2.md] | CAC, D30 retention of paid cohorts | Performance budget |
| App-store optimization | 1–3 | Grindr's captured ranking (#3 Top Grossing iPhone US [src: s-grindr-price.json]) shows category economics; differentiate on "verified" keyword whitespace | Store impressions → installs | Time/ASO tools |
| Events (own singles events with structure) | 1–3 | Structured-date brand promise made tangible; Feeld precedent [src: feeld-home2.md] | Event→app conversion, date confirmations | Per-event budget |

Sources: bmbl-q2.md, businessofapps-hinge.md, businessofapps-tinder.md, feeld-home2.md, gdi-home.md, s-grindr-price.json, tinder-eng.md, tp-bumble.md, tp-match.md, tp-tinder.md.

---

## 8. Monetization

### 8.1 Captured price anchors (the competitive price map)

| App | Free tier | Entry paid | Mid | Top / notable | Source |
|---|---|---|---|---|---|
| Tinder | ~100 likes/day (limits) | Plus $24.99/mo (weekly $12.99 captured) | Gold $39.99/mo | Platinum $49.99/mo; Select ~$499/mo invite-only; dynamic pricing documented ($60.5M age-discrimination suit referenced) | s-tinder-price.json |
| Bumble | 25 likes/day | Boost $15.99/mo | — | Premium+ $39.99/mo | s-hinge-price.json (cross-captured) |
| Hinge | 8 likes/day | Hinge+ $29.99/mo | — | HingeX $49.99/mo (one tracker shows $59.99 — variance carried); India Hinge+ ≈ $5.20/mo shows PPP spread | s-hinge-price.json |
| Grindr | Grid + chat | XTRA $22.99/mo or $14.99/week; Day Pass $9.99 | — | Unlimited $44.99/mo or $27.99/week; Boost $11.99 one-time | s-grindr-price.json, grindr-unlimited.md |
| Feeld | Core app free | Majestic (price ❓ JS-gated in capture) | — | — | feeld-majestic.md |
| Industry | 6.6% payer penetration; ARPPU benchmarks: Bumble $21.96, Grindr $26.51 (+12%, partly AI-monetization attributed; $25.51 CNBC variant — conflict carried, see 04/05) | — | — | — | businessofapps-market.md, bmbl-q2.md, s-grnd.json |

### 8.2 Option A — Incumbent-clone freemium (likes-economy + boosts)

Design: free tier with stingy daily likes; $19.99–29.99/mo tier unlocking unlimited likes + See Who Likes You; a-la-carte boosts ($11.99 anchor [src: s-grindr-price.json]); top tier ~$49.99.

| Pros | Cons |
|---|---|
| Proven: 23M payers industry-wide; 6.6% penetration is a known conversion baseline [src: businessofapps-market.md] | Directly replicates the most resented mechanics — the exact complaints we're built against (pay-to-see-likes, pay-to-be-seen) [src: tp-bumble.md] |
| Boosts create high-margin a-la-carte revenue (Grindr Boost $11.99 precedent) [src: s-grindr-price.json] | Selling visibility contradicts the charter; brand death on contact |
| Easy price anchoring between Boost $15.99 and Hinge+ $29.99 [src: s-hinge-price.json] | Requires engineered scarcity — the anti-thesis of quality-first positioning |

### 8.3 Option B — Grindr-style burst monetization (weekly + day pass)

Design: no monthly commitment; $9.99–14.99/week; $9.99 day passes for travel/big-weekend mode (Grindr Day Pass $9.99 captured [src: s-grindr-price.json]).

| Pros | Cons |
|---|---|
| Matches bursty dating behavior; low commitment reduces refund rage (a top complaint bucket) [src: tp-bumble.md, tp-tinder.md] | Grindr's own users revolt at annualized cost ($519.48/yr complaint, $57.99 CAD/mo complaints captured) [src: s-grindr-price.json] |
| Grindr's weekly SKU predates its ARPPU climb to $26.51 (+12%) — the model monetizes intensity [src: s-grindr-price.json, s-grnd.json] | Weekly billing friction; churn-prone; poor LTV for slow daters (our 40+ persona) |
| Great travel-mode SKU (day pass aligns with a Passport-style feature) | Perceived as hookup-economy pricing; brand mismatch with serious-dating persona |

### 8.4 Option C — Transparent flat-subscription (quality-first) — RECOMMENDED

Design: one published price, everyone, always (target $24.99/mo, anchored between Bumble Boost $15.99 and Hinge+ $29.99 [src: s-hinge-price.json]); regional PPP pricing from day one (Hinge India ≈ $5.20/mo proves the spread is expected [src: s-hinge-price.json]); no dynamic pricing ever (anti-Tinder differentiator: "charge you whatever they think you'll pay" is the captured characterization [src: s-tinder-price.json]); free tier keeps visible likes and core matching forever; subscription buys convenience only (advanced filters, travel mode, incognito browsing, later the opt-in AI coach — mirroring how Grindr's gAI/Edge premium-AI tiers lifted ARPPU [src: s-grnd.json]); optional gender-asymmetric pricing studied at launch (women free/preferential, men pay) following the captured Pairs Japan formula "women control, makes men pay" [src: wiki-match.md]. Optional weekly pass added in V2 for travelers (Option B's best SKU without the default).

| Pros | Cons |
|---|---|
| The pricing IS the marketing: one price, published, no dark patterns — a claim no captured incumbent can make (Tinder/Hinge dynamic pricing documented) [src: s-tinder-price.json, s-hinge-price.json] | Lower short-term ARPU than likes-economy; conversion must come from brand trust (slower) |
| Kills the billing-trap complaint bucket by construction (no annual lock-ins at launch, renewal reminders) [src: tp-bumble.md] | Single tier limits price discrimination upside; PPP table adds ops complexity |
| Asymmetric variant directly attacks the 75/25 skew — the documented market-quality constraint [src: businessofapps-tinder.md, wiki-match.md] | Free-visible-likes forecloses the industry's biggest single paywall SKU — must be replaced by filter/travel/AI convenience value |
| Premium AI tier (V2+) rides the captured ARPPU-lift precedent (Grindr ARPPU $26.51 +12% with AI framing) [src: s-grnd.json] | ❓ willingness-to-pay for "convenience-only" subscription unproven in corpus — the plan's biggest monetization bet, gated by Phase-1 cohort testing |

**Recommendation: Option C as the spine**, with Option B's weekly/day-pass as a V2 travel SKU and a strictly bounded a-la-carte menu (event tickets, not visibility). Option A is rejected on brand-coherence grounds despite being the revenue-proven default.

Sources: bmbl-q2.md, businessofapps-market.md, businessofapps-tinder.md, feeld-majestic.md, grindr-unlimited.md, s-grindr-price.json, s-grnd.json, s-hinge-price.json, s-tinder-price.json, tp-bumble.md, tp-tinder.md, wiki-match.md.

---

## 9. Roadmap: MVP → V1 → V2 → V3 (with impact-effort matrices)

Infrastructure staging follows the deployment baseline captured in the corpus: LiquidWeb Managed VPS (AlmaLinux 9.8, cPanel/WHM, 2vCPU/2GB RAM, 10TB transfer, 50GB storage, root SSH, Softaculous) [src: 01-master-facts-digest.md §14; lw-vps-infra.md, lw-cpanel-start.md]. Stage gates: MVP on the single managed VPS (adequate for waitlist + launch city); V1 adds managed remote database separation [src: lw-remote-db.md], CDN edge [src: lw-cdn.md], and server caching [src: lw-caching.md]; V2 adds firewall hardening tiers [src: lw-firewall.md], Acronis backup regime [src: lw-acronis.md], cron-based ops [src: lw-cron.md]; V3 evaluates dedicated metal [src: lw-dedicated.md, lw-cloud-vps.md] with support-level planning [src: lw-support-levels.md] and domain architecture [src: lw-add-domain.md]. (Companion architecture deliverable owns the deep infra design; this roadmap stages against those docs deliberately.)

### 9.1 MVP (months 0–4) — one city, verified humans, visible likes

Scope: verification gate (vendor hybrid), profiles with voice prompt, bounded daily slate, mutual-match chat with safety rails (block/report/nude-blur), see-who-likes free, structured date proposal v0, support inbox with the 48h SLA (human-in-loop), waitlist funnel.

| Feature | Impact | Effort | Quadrant |
|---|---|---|---|
| Verification gate (liveness + document) | High | High | Big Bet (do first anyway — it's the product) |
| See-who-likes (free) | High | Low | Quick Win |
| Bounded daily slate | High | Low | Quick Win |
| Nude-blur via open-source model (Private Detector precedent) | High | Low | Quick Win (open-sourced starting point) |
| Voice prompts | Medium | Low | Quick Win |
| Structured date proposal v0 | High | Medium | Big Bet |
| 48h human support SLA tooling | Medium | Low | Quick Win |
| Published matching rules (Ledger) | Medium | Low | Quick Win (writing, not code) |
| AI coach | Low | High | Deprioritize (V2+) |
| Double Date mode | Low | High | Deprioritize (V3) |
| Incognito browsing | Low | Medium | Deprioritize (V1 convenience tier) |
| Custom in-house ranking ML | Low | High | Deprioritize (start with transparent rules + simple scoring) |

### 9.2 V1 (months 5–9) — safety suite complete, convenience tier, density tooling

Scope: AI fake-profile anomaly detection (Deception Detector-class), NCII hash-takedown flow (statutory-ready), creep-message interception nudges, ban-reason codes + human appeals, activity-honesty markers, subscription tier launch ($24.99 flat + PPP), moderation dashboard, city-density analytics.

| Feature | Impact | Effort | Quadrant |
|---|---|---|---|
| AI fake-profile anomaly detection | High | Medium | Big Bet |
| NCII 48h takedown + hash registry | High | Medium | Big Bet (also legal necessity) |
| Flat subscription + PPP pricing | High | Medium | Big Bet |
| Ban reason codes + appeals | Medium | Low | Quick Win |
| Activity-honesty markers (14-day idle) | Medium | Low | Quick Win |
| Creep-message interception nudges | Medium | Low | Quick Win (Tinder's Are You Sure? pattern) |
| Remote DB + CDN split (infra) | Medium | Medium | Big Bet (stability enabler) |
| Travel mode | Medium | Low | Quick Win (subscription value) |
| Own singles events tooling | Medium | Medium | Fill-in |
| Widget/story features | Low | Low | Fill-in |
| Custom ranking ML | Low | High | Deprioritize |
| Video chat in-app | Low | High | Deprioritize (third-party dates happen off-app anyway) |

### 9.3 V2 (months 10–18) — multi-city, weekly pass, community modes

Scope: city-by-city rollout platform (localized onboarding waves, gender-cap invitation logic), weekly pass + day pass SKUs, Double Date mode, friend-vouch tags, in-app event ticketing, premium AI profile coach (opt-in, clearly labeled), post-date feedback quality loop at scale, public quarterly Ledger metrics.

| Feature | Impact | Effort | Quadrant |
|---|---|---|---|
| City rollout platform with gender-cap waves | High | Medium | Big Bet |
| Weekly/day pass SKUs | High | Low | Quick Win (Grindr price anchors captured) |
| Double Date mode | Medium | Medium | Big Bet (Tinder-validated demand) |
| Friend-vouch tags | Medium | Low | Quick Win (brand mechanic) |
| Event ticketing | Medium | Medium | Fill-in |
| Premium AI coach | Medium | High | Big Bet (ARPPU precedent: Grindr AI framing) |
| Expiring screenshot-proof images | Medium | Medium | Big Bet (Grindr/Feeld precedents) |
| More profile prompts/themes | Low | Low | Fill-in |
| Web client | Medium | High | Deprecate-or-defer (Grindr web exists as precedent but costly) |
| Algorithm overhaul | Low | High | Deprioritize |

### 9.4 V3 (months 19–36) — scale, compliance-as-product, adjacent segments

Scope: 40+ dedicated mode (anti-persona graduation — GDI's documented editorial gap), verification stack API for other trust-requiring communities (second product line), Australia duty-of-care compliance program (if legislated), EU DSA alignment expansion, evaluation of dedicated infra, selective international PPP markets (India-scale decisions informed by Bumble's 1M-in-4-months India launch and worse male-female skew caution [src: wiki-bumble.md, businessofapps-tinder.md]).

| Feature | Impact | Effort | Quadrant |
|---|---|---|---|
| 40+ mode | High | Medium | Big Bet (documented underserved segment) |
| Verification-as-a-product (B2B API) | High | High | Big Bet |
| AU duty-of-care program | High | Medium | Big Bet (timing gift: proposal Sep 22 2026) |
| EU DSA expansion | Medium | Medium | Big Bet |
| Dedicated infra migration | Medium | High | Fill-in (only at load) |
| Advanced analytics for members | Low | Low | Fill-in |
| Zodiac/interest modes | Low | Low | Fill-in (Tinder Astrology Mode proves the genre) |
| Metaverse/social-VR experiments | Low | High | Deprioritize (Kippo's metaverse pivot is the captured cautionary tale, single-source) [src: s-deaths.json] |

Sources: 01-master-facts-digest.md §14, businessofapps-tinder.md, gdi-home.md, s-deaths.json, s-grindr-price.json, s-grnd.json, tinder-plans.md, wiki-bumble.md, wiki-grindr.md, wiki-osa.md, lw-*.md (12 files).

---

## 10. KPI Tree

North star: **Confirmed real-world dates per active member per week** — the outcome unit the industry itself brags in (Tinder's claim: 1.5M dates/week — a company claim, labeled as such [src: businessofapps-tinder.md]) and the metric that collapses if fakes, dead chats, or imbalance creep in.

| Level | Metric | Definition / target logic | Captured benchmark or basis |
|---|---|---|---|
| L0 (North star) | Confirmed dates / active member / week | Post-date feedback confirmations ÷ weekly actives | Tinder's 1.5M/week claim as the reference scale [src: businessofapps-tinder.md] |
| L1 | Verified MAU per city | Density above match-quality threshold; launch gate 25k waitlist (planning assumption) | Industry: 350M users, ~6.6% pay [src: businessofapps-market.md] |
| L1 | Female share of city cohort | Target ≥ 55–60% at launch; guardrail against the documented 75/25 skew | [src: businessofapps-tinder.md] |
| L1 | Match → chat → date conversion | Funnel integrity; structured proposals lift chat→date vs industry dead-chat complaints | [src: tp-bumble.md, tp-match.md] |
| L1 | W4 retention of verified cohort | Quality proxy; no direct captured incumbent benchmark ❓ — set internally, publish in Ledger | — |
| L2 | Verification pass rate and bypass incidents | Trust floor; publish incident count (Persona-bypass precedent shows why) | [src: wiki-osa.md] |
| L2 | Fake-profile reports per 1k MAU | Target order-of-magnitude below incumbent complaint density | Complaint prevalence in tp captures [src: tp-tinder.md] |
| L2 | Support first-human-response ≤ 48h | SLA adherence ≥ 95%; the anti-thesis of captured "3 weeks to get a reply" | [src: tp-bumble.md] |
| L2 | NCII takedown ≤ 48h compliance | 100% — statutory | [src: wiki-takeitdown.md] |
| L2 | Moderation appeal overturn rate | Human-appeal quality signal; ban-recourse pain | [src: tp-tinder.md] |
| L2 | Payer conversion | Beat industry 6.6% within 12 months of tier launch | [src: businessofapps-market.md] |
| L2 | ARPPU | Benchmark corridor: Bumble $21.96, Grindr $26.51 ($25.51 variant carried) | [src: bmbl-q2.md, s-grnd.json] |
| L3 | K-factor (referral-vouch) | Waitlist growth engine; campus-origin precedent | [src: businessofapps-tinder.md] |
| L3 | CAC payback | < 6 months from subscription revenue before Phase-2 paid channels | Internal gate |
| L3 | Event → member conversion | Community-channel efficiency | Feeld events model [src: feeld-home2.md] |
| L3 | Store rating delta vs incumbents | Target ≥ 4.0 within 12 months vs captured 1.0–1.3 field | [src: tp-tinder.md, tp-bumble.md, tp-match.md] |

Guardrail metrics (never trade for growth): bypass incidents, female-share floor, SLA adherence, complaint-bucket mix (billing/fakes/support shares must trend to zero).

Sources: bmbl-q2.md, businessofapps-market.md, businessofapps-tinder.md, feeld-home2.md, s-grnd.json, tp-bumble.md, tp-match.md, tp-tinder.md, wiki-osa.md, wiki-takeitdown.md.

---

## 11. Risks and Mitigations

| # | Risk | Severity | Likelihood | Evidence | Mitigation |
|---|---|---|---|---|---|
| 1 | Network cold-start / density failure in launch city | Critical | High | Dating markets die thin; incumbents' scale is the moat (Tinder 60M MAU per key-stats vs 75M per FAQ — conflict carried; either way orders of magnitude ahead) [src: businessofapps-tinder.md] | Single-city discipline; women-first waves with 60/40 cap; waitlist gate before launch; event-density anchoring; city exit criteria |
| 2 | Gender imbalance death spiral (mirror of 75/25) | Critical | High | [src: businessofapps-tinder.md]; India skew documented worse | Invitation quotas; asymmetric pricing option (Pairs formula [src: wiki-match.md]); women-safety pack as acquisition message |
| 3 | Regulatory breach (OSA fines to £18M or 10% turnover; TAKE IT DOWN FTC enforcement; AU duty-of-care incoming) | Critical | Medium | [src: wiki-osa.md, wiki-takeitdown.md, gdi-home.md]; Ofcom fines observed: £20k→£520k (4chan), £50k (Itai), £1M (AVS Group) [src: wiki-osa.md] | OSA-native architecture from MVP (§9); compliance calendar owned by founder (DevSecOps lens); NCII flow built to statute, tested quarterly; legal review gate before each market entry |
| 4 | Age-verification circumvention (VPN spike documented; Persona bypassed with game images) | High | Medium | [src: wiki-osa.md] | Document hybrid (not photo-only); continuous re-verification; bypass-rate published; vendor redundancy |
| 5 | Security breach (Jan 2026 campaign hit Match and Bumble; Grindr 2020 account-takeover vuln; £26M settlement) | High | Medium | [src: wiki-match.md, wiki-bumble.md, wiki-grindr.md] | DevSecOps program from day one: secrets/OIDC hygiene (Tinder's own published research on GitHub Actions and AWS OIDC misconfigs is the checklist) [src: tinder-eng.md]; Acronis-backed restore drills [src: lw-acronis.md]; firewall tiers [src: lw-firewall.md]; breach-response playbook rehearsed pre-launch; sensitive-data minimization (the Grindr settlement's direct lesson) |
| 6 | Incumbent fast-copy (Tinder ships actively — Sep 21 2026 update captured) | Medium | Medium | [src: gp-tinder.md]; Tinder already testing a-la-carte See Who Likes You [src: s-tinder-price.json] | Speed + brand depth: the charter (published rules, SLAs, no-visibility-sale) is a commitment incumbents' P&L resists making; community density is not copyable by feature parity |
| 7 | Monetization underperformance (free-visible-likes forecloses biggest SKU; convenience-tier WTP ❓ unproven) | High | Medium | §8 analysis; [src: s-tinder-price.json] | Phase-1 cohort price testing before scale; weekly/day-pass fallback SKUs; premium AI tier on Grindr's ARPPU precedent [src: s-grnd.json]; B2B verification line as second revenue engine (V3) |
| 8 | Verification vendor cost/fragility at scale | Medium | Medium | OSA drove all majors to vendors [src: wiki-osa.md] | Dual-vendor strategy; per-verification unit economics in KPI tree; negotiate volume tiers at city scale |
| 9 | Moderation legal exposure (over-blocking = ban-appeal rage; under-blocking = OSA/TAKE IT DOWN exposure) | High | Medium | Ban-pain verbatims [src: tp-tinder.md]; statutory duties [src: wiki-takeitdown.md] | Human appeals with reason codes (product feature, not cost center); published moderation transparency reports; cyberflashing/NCII playbooks rehearsed with counsel |
| 10 | Privacy backlash (Grindr settlement as category stain) | High | Low | [src: wiki-grindr.md] | Public data-map page; zero third-party analytics on sensitive fields; on-device processing where feasible; annual third-party audit published |
| 11 | App-store policy / IAP dependency (all captured pricing flows through store IAP) | Medium | Medium | Store price lists captured for Tinder/Grindr [src: s-tinder-price.json, s-grindr-price.json]; commission rates not captured ❓ | Web-first waitlist (store-independent relationship); price parity policy; monitor policy shifts; diversify to web subscription where policy allows |
| 12 | Market shrinks further (second consecutive decline) | Medium | Medium | $6.07B 2025 first decline [src: businessofapps-market.md] | Position as trust-segment consolidator (Hinge proved grow-in-decline at +25% [src: businessofapps-hinge.md]); lean cost base on staged VPS infrastructure [src: lw-vps-infra.md]; B2B verification revenue diversification |
| 13 | Brand-name/legal collision on chosen name | Low | Medium | ❓ no trademark screening possible in corpus | Roadmap gate: clearance before public commitment (§1.2); two fallback names held |
| 14 | Founder-key-person / solo-founder execution risk | Medium | High | — (structural, not corpus) | Advisory bench from DevSecOps and trust-and-safety networks; GDI-ecosystem visibility for hiring [src: gdi-home.md] |
| 15 | AI misuse by users (AI-drafted personas, AI chats) | Medium | Medium | Match verbatim: chats "clearly AI with no long-term memory" [src: tp-match.md]; Bumble prohibits AI fake profiles [src: wiki-bumble.md] | Voice-prompt liveness signals; AI-text detection on first messages; ToS prohibition with reason-code enforcement; never ship generative user-simulating AI |

Sources: bmbl-q2.md, businessofapps-hinge.md, businessofapps-market.md, businessofapps-tinder.md, gdi-home.md, gp-tinder.md, s-grindr-price.json, s-grnd.json, s-tinder-price.json, tinder-eng.md, tp-bumble.md, tp-match.md, tp-tinder.md, wiki-bumble.md, wiki-grindr.md, wiki-match.md, wiki-osa.md, wiki-takeitdown.md, lw-acronis.md, lw-firewall.md, lw-vps-infra.md. (bmbl-q2.md is cited for the Bumble distress figures in §1 and the §7.2 channel table.)

---

## Appendix A — Conflicts carried into this document (never averaged)

1. Tinder MAU: 60M (key stats) vs 75M (FAQ, 7.8M US) — both carried wherever scale matters [src: businessofapps-tinder.md].
2. Tinder gender split: 75% male in BoA text (25% female implied) vs 73/27 (table) — carried as "75/25 vs 73/27" [src: businessofapps-tinder.md].
3. HingeX price: $49.99/mo (SwipeStats, VIDA tables) vs $59.99 (GetMatches prose) — anchored at $49.99 with variance noted; dynamic pricing is the documented explanation [src: s-hinge-price.json].
4. Bumble payers: BoA series 2.4M (2025, "values taken from Q2" basis) vs live IR Q2'26 3.2M (-16.4% YoY) — IR treated as authoritative for current-state, BoA for trend [src: businessofapps-bumble.md, bmbl-q2.md].
5. Grindr revenue: FY25 $440M (10-K via wiki) vs FY26 guidance ≥$535M (later ~$540M) — trajectory, not conflict; source difference noted [src: wiki-grindr.md, s-grnd.json].
6. Match CEO: Spencer Rascoff (current, 2 sources) vs Bernard Kim (stale BoA listing) — Rascoff used throughout [src: gdi-home.md, tinder-eng.md].
7. Hinge launch: Feb 2013 (overview) vs 2012 (prose) — not load-bearing here; carried per digest [src: businessofapps-hinge.md].
8. Trustpilot "Match 1.0": the captured page is the Match.dk profile (1.0, 1,336 reviews; Match.com IE cross-listed at 1.2) — cited with that nuance [src: tp-match.md].

## Appendix B — ❓ Unknowns register (what was checked, what remains open)

1. Feeld Majestic price — page fetched, price JS-gated; checked feeld-majestic.md, feeld-home2.md [src: feeld-majestic.md].
2. CMB / Muzz / Raya / Inner Circle pricing — SPA captures without static prices; checked cmb-home.md, muzz-home.md.
3. AI-native startup competitive landscape — tavily discovery died early in the research run; no captured evidence of a verified-first AI-native entrant; the "whitespace" claim in §1 is therefore a hypothesis, not a verified fact.
4. Facebook Dating scale — headline only ("quietly gains ground") [src: gdi-home.md]; no quantitative capture.
5. 99%-women-abuse study details — headline only; study methodology unfetched [src: gdi-home.md].
6. Gen Z fatigue quantitative study — indirect evidence only (user declines, penetration table, complaint volumes); digest scores this PARTIAL.
7. Tawkify pricing (used in persona reasoning) — rating captured, price ❓.
8. App-store commission economics — store IAP observed in price lists; rates not in corpus.
9. Tinder dates/week (1.5M) — company claim, used only as a reference unit, labeled as claim.
10. Trademark availability of all three names — ❓ requires legal screening (roadmap gate).
11. Sniffies $100M stake, Kippo metaverse pivot — single-source items, flagged where cited [src: wiki-match.md, s-deaths.json].
12. Bumble Aug 2026 press-release body — title/date verified in index capture; PDF content unfetched [src: bmbl-press.md].

---

### Master source list for this deliverable (corpus filenames)

businessofapps-market.md, businessofapps-tinder.md, businessofapps-bumble.md, businessofapps-hinge.md, bmbl-q2.md, bmbl-press.md, s-mtch-q2.json, s-grnd.json, s-league.json, s-deaths.json, s-tinder-price.json, s-hinge-price.json, s-grindr-price.json, tinder-plans.md, tinder-eng.md, gp-tinder.md, grindr-unlimited.md, feeld-majestic.md, feeld-home2.md, pure-home.md, cmb-home.md, muzz-home.md, pairs-home2.md, tp-tinder.md, tp-bumble.md, tp-match.md, gdi-home.md, wiki-osa.md, wiki-takeitdown.md, wiki-match.md, wiki-bumble.md, wiki-grindr.md, 01-master-facts-digest.md, verification-pass.md, lw-vps-infra.md, lw-cpanel-start.md, lw-remote-db.md, lw-cdn.md, lw-caching.md, lw-firewall.md, lw-acronis.md, lw-cron.md, lw-dedicated.md, lw-cloud-vps.md, lw-support-levels.md, lw-add-domain.md.


---

<!-- ====================================================================== -->
<!-- FILE: 04-competitive-analysis.md -->
<!-- ====================================================================== -->

# 04 — Top-20 Competitive Analysis: Dating App Industry

**Compiled:** 2026-09-23 (all underlying fetches live 2026-09-23 09:04–09:56 UTC)
**Deliverable:** rdw-app-competitve-analysis structure — roster, profiles, composite feature matrix, strategic observations
**Reader framing (target):** a prospective founder who is a full-stack multiplatform developer + DevSecOps engineer, evaluating entry into dating apps with a **quality-first positioning** (trust, safety, verification, honest monetization). Every finding below is filtered through two lenses: (a) consumer/product competitive reality, and (b) engineering/security/compliance posture — because for this reader the second lens is the differentiation strategy.

**Bottom line up front:** the industry recorded its **first-ever annual revenue decline in 2025 ($6.07B)** [src: businessofapps-market.md], the #1 player's flagship (Tinder) has shed subscribers for three straight years, the #2 independent (Bumble) is taking consecutive nine-figure impairments, legacy brands are bleeding -17% YoY, and incumbents carry a documented history of privacy fines, breach campaigns, and 1.0–1.3/5 Trustpilot scores. Meanwhile the only large grower (Hinge, +22% YoY) wins precisely on "quality-first" attributes (verification, intent prompts, date-feedback loops). A two-thirds-of-singles-off-apps market (Sep 2026 Harris Poll) is both the threat and the opening. Details, conflicts, and ❓ flags below — nothing averaged, nothing guessed.

---

## 1. Methodology

- **Corpus-based desk research, zero network access.** This analysis was produced exclusively from a 56-file (~950KB) local corpus fetched live 2026-09-23 09:04–09:56 UTC into `independent_research/scratch/research-dating-app-industry-2026-09/scratch/pages/`, against backbone notes `01-master-facts-digest.md` and `verification-pass.md` (both read in full). No web searches or fetches were performed for this deliverable.
- **Source-quality tiering used throughout:** (1) primary IR/SEC-grade (Bumble Q2'26 release, Match Q2'26 summaries of the shareholder letter, Grindr 10-K figures relayed via Wikipedia infobox citing the Form 10-K filed 2026-03-02); (2) app-store/vendor-owned pages (Apple App Store, Google Play, feeld.co, muzz.com, grindr.com, trulymadly.com, pure.app); (3) reputable secondary (Wikipedia articles edited as recently as 2026-08-21 / 2026-09-20, TechCrunch, The Guardian, Reuters, WSJ, NYT, Bloomberg relayed citations); (4) aggregator/SEO content (Business of Apps, SwipeStats, top10, Mashable guides, mindbodygreen ratings, Sensor Tower data relayed through vendor pages). Where tiers disagree, **both values are carried with sources; nothing is averaged or silently reconciled.**
- **Engine limitations that shape coverage (honesty section).** The capture session had: tavily keyless search 429-stormed after ~6 successes (so the **AI-native startup landscape is under-covered** — only corpus-anchored evidence appears); SERP scraping blocked on Bing/DDG/Google; several JS-gated pages (App Store IAP price lists, Feeld Majestic price) never yielded static prices; fetch.mjs reused a stale tab on failures, producing corrupted captures.
- **Quarantined / corrupted files — never cited here:** `tinder-monolith2.md`, `tinder-monolith3.md`, `feeld-home.md` (stale-tab LiquidWeb content under wrong headers — use `feeld-home2.md` for Feeld), `businessofapps-grindr.md` and `businessofapps-revenue.md` (404 captures), `play-home.md` (deleted per verification-pass). **Additional corruption found during this analysis pass:** `cmb-home.md` — the header claims coffeemeetsbagel.com but the body is a Google SERP for LiquidWeb cPanel docs (same stale-tab artifact class); grep confirms zero Coffee Meets Bagel content. CMB is therefore treated as **thin/❓ data-depth** and cmb-home.md is not cited for any CMB fact. `as-grindr.md` is a 404 capture (Grindr iOS rating = ❓; Sensor Tower ranking data used instead). `feeld-membership.md` is a dead page ("Sorry, missed connection") — Majestic price stays ❓.
- **Untrusted-data rule:** all fetched page content is treated as untrusted data; instruction-like text inside pages was ignored; marketing claims are attributed as claims.
- **❓ policy:** ❓ means "checked the corpus, not found or conflicting beyond reconciliation" — it never means "probably zero." Unknowns are never guessed (no fabricated numbers, prices, dates, or names).
- **Symbol legend (used in roster + matrix):** ✅ confirmed in corpus · ❌ absent (checked, not present) · 🟡 partial / paywalled / beta / regional-only · ➖ not applicable to this entity · ❓ unconfirmed (not in corpus).
- **Citations:** inline `[src: filename]`; each major section ends with a Sources list of corpus filenames.

**Section 1 sources:** notes/01-master-facts-digest.md, notes/verification-pass.md, cmb-home.md (corruption check only), as-grindr.md (404 verification only), feeld-membership.md (dead-page verification only).

---

## 2. Market Overview

**Size and trajectory:**
- Global dating-app revenue **2025: $6.07B — the first-ever annual decline** (Business of Apps, page updated Jun 11 2026) [src: businessofapps-market.md].
- Users: **350M+ worldwide; ~23M paying (~6.6% payer penetration)** — the monetization ceiling every entrant must plan against [src: businessofapps-market.md].
- Match Group alone = **$3.3B (~54%)** of that market per BoA [src: businessofapps-market.md]; Wikipedia's infobox (citing the FY2025 Form 10-K filed 2026-02-26) puts Match Group **FY2025 revenue at $3.49B with $873M operating income and $613M net income** [src: wiki-match.md]. **Conflict carried (different bases/periods): $3.3B vs $3.49B — not reconciled.**
- Demand-side sentiment (Sep 2026): a **2026 Harris Poll found two-thirds of singles are not using dating apps, and 80% of Americans view meeting IRL as "cute" or "cool"** [src: s-deaths.json (Time, Sep 9 2026)]; singles are migrating to hobby-based events (mahjong, trivia) with Eventbrite's GM noting the dating/hobbies line dissolving [src: s-deaths.json (Vice)]. GDI's own op-ed asks why apps "Keep Chasing Gen Z" while ignoring 40+ [src: gdi-home.md, Sep 21 2026]. Counter-signal: Mashable's 2026 guide reports Tinder "currently seeing a huge Gen Z comeback" [src: s-deaths.json].
- Safety sentiment: **"99% of Women Report Abuse on Dating Platforms"** (Australian study, headline-level only — study body not fetched) [src: gdi-home.md, Sep 22 2026].

**Competitive concentration (live tickers, GDI homepage, Sep 23 2026)** [src: gdi-home.md]:

| Ticker | Company | Price (USD) | Day move |
|---|---|---|---|
| MTCH | Match Group | $43.16 | -0.09% |
| BMBL | Bumble Inc. | $2.85 | +2.15% |
| GRND | Grindr Inc. | $15.89 | +3.18% |
| MEET | Meet Group (parent of Tagged/Hi5 lineage per GDI listing) | $6.29 | 0.00% |
| MOMO | Hello Group (Tantan parent) | $4.99 | +2.25% |
| LOVLQ | Love Group (OTC) | $0.00 | 0.00% |

**Segment reality, Q2 2026:** Match Group revenue $853.1M (-1% YoY), total payers 13.3M (-6%), RPP $21.13 (+6%), Adj EBITDA $331M (39% margin); Tinder $457.5M (-1%), Hinge $203.5M (+22%; rounded to $204M in the same corpus prose — 00/01/05 carry $204M, same figure), Emerging & Established (Match/PoF/OkCupid/Meetic/Azar et al.) $179M (**-17%**) [src: s-mtch-q2.json]. Bumble App revenue $171.7M (**-14.7%**), net loss $127.9M including a $169.3M impairment [src: bmbl-q2.md]. Grindr the outlier: Q2'26 revenue $138M **+33%**, net income $18M, raised FY26 guidance to ~$540M [src: s-grnd.json].

**Structural read for a new entrant:** this is a **zero-sum, consolidating, declining-topline market** where growth exists only in (a) one quality-positioned brand (Hinge), (b) one monetization-optimized niche monopoly (Grindr), and (c) price/ARPPU extraction rather than user growth. The honest TAM for a quality-first niche entrant is a small fraction of the $6.07B headline (see Strategic Observations §6.5).

**Section 2 sources:** businessofapps-market.md, wiki-match.md, gdi-home.md, s-deaths.json, s-mtch-q2.json, bmbl-q2.md, s-grnd.json.

---

## 3. Competitor Roster (Top 20)

Selection: the 20 entities mandated for this deliverable, spanning the mass-market majors, the legacy web brands, regional champions, and the niche/quality-first fringe a new entrant actually competes against for mindshare. "Data-depth" grades how much captured evidence exists per entity in the corpus.

| # | Name | Owner / vendor | Type | Status (2026) | One-line positioning | Data-depth |
|---|---|---|---|---|---|---|
| 1 | Tinder | Match Group (Nasdaq: MTCH) | Mass-market flagship | Declining (rev -5.2% 2025, payers 8.5M -5% Q2'26; DAU decline narrowing) | The default mass-market swipe app, monetized to the hilt, mid-turnaround | Deep |
| 2 | Bumble | Bumble Inc. (Nasdaq: BMBL) | Mass-market | Distressed (rev -14.7% Q2'26, impairments, $0.7B valuation, women-first rule retired Aug 2026) | Women-first app turned "anyone can message first" generalist, rebuilding stack | Deep |
| 3 | Hinge | Match Group | Mass-market, quality-positioned | Growing (+22% Q2'26, only large grower) | "Designed to be deleted" — intent-first relationship app | Deep |
| 4 | Grindr | Grindr Inc. (NYSE: GRND) | Niche monopoly (gay/bi/queer men) | Growing (+33% Q2'26, ARPPU machine, AI-native pivot) | Geosocial grid for gay/bi/queer men; highest monetization intensity in the field | Deep |
| 5 | Match (match.com) | Match Group | Legacy web flagship | Declining (inside E&E segment -17% YoY) | The original serious-dating website brand, 30+ years old | Deep (segment-level) |
| 6 | OkCupid | Match Group | Legacy question-based | Declining (E&E; US brand) | Question-based matching, free-messaging heritage | Medium |
| 7 | Plenty of Fish | Match Group | Legacy freemium | Declining (E&E) | Free-messaging legacy site strong in US/CA/UK/BR | Medium |
| 8 | Meetic | Match Group | Legacy regional (Europe/France) | Declining (E&E) | European (esp. French) serious-dating leader | Thin |
| 9 | Badoo | Bumble Inc. | Legacy mass-market intl. | Declining/absorbed (runs on shared Badoo stack; store copy demotes it to sister brand) | High-volume international mass-market network, 44 languages | Medium |
| 10 | Happn | ❓ owner not stated on captured page (independent per prior coverage) | Regional/niche (proximity) | Stable ❓ (claims +180M users; no financials captured) | "Cross paths, date local" — real-world proximity matching | Medium |
| 11 | Feeld | Feeld Ltd (CEO Ana Kirova) | Niche (open-minded/ENM) | Growing ❓ (14M+ registered; no financials) | "For the curious" — desire-tags, couples, kink-positive, anti-paywall ethos | Medium (rich product detail) |
| 12 | Pure | Online Classifieds AG, Switzerland (© 2026 site) — Wikipedia still lists "Misterico Limited" (older) — **conflict carried** | Niche (casual/anonymous) | Active, multi-store distribution | Open-minded/anonymous casual dating with self-destructing chats | Medium |
| 13 | Coffee Meets Bagel | ❓ (capture corrupted; independent historically) | Niche (curated/intentional) | Active (GDI podcast Jun 25 2026: "intentional dating is making a comeback") | Daily curated matches for intentional daters | Thin (capture corrupted) |
| 14 | Muzz | Muzz (founder Shahzad Younas per Wikipedia row; site © 2026 Muzz) | Niche (Muslim marriage) | Active/growing claim (20M Muslims, 1M+ successes claims) | Muslim marriage app: chaperone feature, screenshot bans, strong verification | Medium |
| 15 | Raya | Raya App, Inc. | Niche (invite-only luxury) | Active | "Soho House of dating apps" — vetted creatives membership club | Thin |
| 16 | Tantan | Hello Group (MOMO ticker live on GDI = parent still trading; Tantan-specific status ❓) | Regional (China) | ❓ Uncertain (BoA still lists it top-10 by history; no 2026 status captured) | "Chinese Tinder" mass-market swipe | Thin |
| 17 | Pairs | Match Group (via Match Japan; brand in Feb 2026 Match list) | Regional (Japan) | Active (geo-blocks all non-Japan IPs — observed directly) | Japan's dominant serious-dating app; "women control, men pay" formula | Thin (but notable behavior) |
| 18 | TrulyMadly | Crescere Technologies Pvt. Ltd (© 2022 site) | Regional (India) | Active (10M+ downloads, celebrity campaigns) | "India's Most Trusted" matchmaking — trust-first positioning in India | Medium |
| 19 | Sniffies | Independent founder-led (Match Group $100M minority stake Apr 2026 + option to acquire) | Niche (gay cruising, browser-first) | Active / being consolidated toward Match | Browser-based map/grid cruising app; now Match's primary queer-male asset after Archer shutdown | Medium |
| 20 | Facebook Dating | Meta Platforms | Conglomerate-embedded free product | Quietly gaining (GDI headline, Sep 22 2026 — headline only) | Free dating bolted onto the world's largest social graph | Thin |

Notes on statuses: "Declining" statuses for OkCupid/PoF/Meetic/Match derive from Match Group's E&E segment reporting (-17% YoY, "primarily due to the Azar app redesign") — segment-level attribution to individual legacy brands is not broken out ❓ [src: s-mtch-q2.json]. The League (acquired by Match July 2022, still listed in Match's Feb 2026 brand list) is covered in the Deaths/Consolidation Register (§6.6) rather than the roster.

**Section 3 sources:** s-mtch-q2.json, bmbl-q2.md, s-grnd.json, wiki-match.md, wiki-compare.md, as-bumble.md, happn-home.md, feeld-home2.md, pure-home.md, gdi-home.md, muzz-home.md, trulymadly-home.md, s-league.json, s-deaths.json, businessofapps-market.md, notes/01-master-facts-digest.md.

---

## 4. Per-Competitor Profiles

### 4.1 TINDER (deep profile) — the declining giant mid-turnaround

**Corporate/ownership:** Tinder LLC, wholly owned by Match Group (founded 2012 inside IAC's Hatch Labs; Match IPO'd Nov 19 2015) [src: wiki-match.md]. App Store publisher "Tinder LLC" [src: as-tinder.md]. Tinder was 57% of Match Group revenue (2023) [src: notes/01-master-facts-digest.md]. CEO Faye Iosotaluno (per BoA) [src: businessofapps-tinder.md]; Match Group CEO Spencer Rascoff (Feb 4 2025–; BoA pages still listing Bernard Kim are **stale — conflict carried, Rascoff wins on 2+ sources**) [src: wiki-match.md, gdi-home.md, tinder-eng.md].

**Financial/engagement series (all captured values):**

| Metric | Series (source basis) | Source |
|---|---|---|
| Revenue $M | 2015: 47 → 2019: 1150 → 2021: 1650 → 2022: 1794 → 2023: 1918 → 2024: 1941 → **2025: 1840 (-5.2%, first decline)** | businessofapps-tinder.md |
| Subscribers M (Q2 basis) | 2022: 10.9 (peak) → 2023: 10.4 → 2024: 9.6 → 2025: 8.9 | businessofapps-tinder.md |
| Q2'26 segment | Direct revenue $457.5M (-1%; -2% FX-neutral); payers 8.5M (-5%); RPP $17.90 (+4%); op income $210.9M (-3%, 45% margin); Adj EBITDA $233M (-5%, 50% margin) | s-mtch-q2.json |
| DAU trend | declines narrowed to -4% in Q2'26, -2.5% in July — "turnaround gains momentum" per PR | s-mtch-q2.json |
| MAU | **CONFLICT: 60M (BoA key-stats) vs 75M (BoA FAQ; Wikipedia separately: "75,000,000 active users as of 2021") — carry both** | businessofapps-tinder.md, wiki-compare.md |
| Downloads | 400M+ lifetime; 190 countries; Google Play shows 500M+ | businessofapps-tinder.md, gp-tinder.md |
| Usage intensity | 1.5M users/week go on dates (Tinder claim); active users log in ~4×/day (SurveyMonkey Intelligence, dated) | businessofapps-tinder.md |
| Demographics (US) | 35% aged 18-24, 25% aged 25-34 (60% under 35); **gender 75% male / 25% female vs 73/27 in BoA's own table — CONFLICT, carry both**; HH income mode $60-80k (30%) | businessofapps-tinder.md |
| Penetration (Civic Science, % overall / 18-24 / 25-34 / 35+) | Tinder 30 / 40 / 25 / 12 — strongest under 35, loses 35+ to Match (10/3/6/15) and eHarmony (4/3/4/10) | businessofapps-tinder.md |
| Revenue by country | US ~40%, UK ~10% (Sensor Tower) | businessofapps-tinder.md |

**Product mechanics:** swipe match engine with ML ranking (see Engineering below); Plus/Gold/Platinum/Select tier stack; features captured on stores: Double Date, Astrology Mode, Passport Mode, Incognito, Unlimited Rewinds, Face Check verification, share-meeting-safety [src: gp-tinder.md, as-tinder.md]. Free tier = limited likes + ads; Plus = unlimited likes, Rewinds, Passport, no ads, Incognito; Gold adds See Who Likes You, Top Picks, 5 weekly Super Likes, 1 monthly Boost; Platinum adds message-before-match and priority likes [src: s-tinder-price.json].

**Pricing (captured values, all carried):**

| Tier | SwipeStats (Mar 2026) | G2A range | GamsGo gray-market | Notes |
|---|---|---|---|---|
| Plus | $12.99/wk; $24.99/mo; $16.66/mo 6-mo | $15-30 | $11.99 | **CONFLICT: LowerMySubs lists $15.99/mo — carried** |
| Gold | $18.99/wk; $39.99/mo; $23.33/mo 6-mo | $25-45 | $19.99 | "Sweet spot" per SwipeStats |
| Platinum | $24.99/wk; $49.99/mo; $29.99/mo 6-mo | $30-55 | $27.99 | — |
| Select | ~$499/mo, invite-only | ~$499 | — | "Vanity purchase" per SwipeStats |

Sources: s-tinder-price.json, s-hinge-price.json (LowerMySubs cross-capture), tinder-plans.md. **Dynamic pricing is explicitly documented** ("charge you whatever they think you'll pay") and Tinder faces a **$60.5M age-discrimination lawsuit in California** over pricing; age-based discounts were discontinued then eliminated in all markets by end of Q2 (year of snippet unspecified ❓) [src: s-tinder-price.json]. Pressroom confirmed testing **a-la-carte purchases of See Who Likes You and Passport** (unbundling) [src: s-tinder-price.json].

**Store presence & reputation:**

| Channel | Value | Source |
|---|---|---|
| Apple App Store (US) | 4.2★, 1.8M ratings, Editors' Choice, #8 Lifestyle, v17.36.0 (updated ~16h pre-capture), 450.8MB, iOS 16+, 18+ | as-tinder.md |
| Google Play | 3.9★, 9.2M reviews, 500M+ downloads, "#1 top grossing dating", Mature 17+, updated **Sep 21 2026** (actively shipping), contains ads | gp-tinder.md |
| Trustpilot | **1.1 "Bad"**, 5,103 reviews, 89% 1-star, unclaimed profile | tp-tinder.md |
| mindbodygreen 2026 score | 3.8 | s-deaths.json |

Trustpilot complaint themes (verbatim corpus): fake profiles/bots, paid visibility not delivering, permanent bans (incl. facial-recognition gripes), "data hostage" account deletion, £9.99/week value complaints [src: tp-tinder.md]. Google Play review themes: $30/mo Premium, broken 3D photo verification, AI-only support, "$13 per week just to see who liked you," filters that don't work [src: gp-tinder.md]. Privacy labels: iOS tracks via Identifiers; linked data includes **Contacts, Sensitive Info, Diagnostics** [src: as-tinder.md]; Google Play data-safety: shares Location + Personal info + 4 others with third parties; encrypted in transit; deletable [src: gp-tinder.md].

**Security/privacy posture:** Match-level: Safety Advisory Council (2018, incl. Tarana Burke, RAINN); Noonlight partnership (Jan 2020: emergency assistance, location tracking, photo verification) [src: wiki-match.md]. **Tinder achieved ISO/IEC 27701:2019 privacy certification** ("setting new privacy standards for dating apps") [src: tinder-eng.md]. Published security research on **GitHub Actions + AWS OIDC misconfigurations** and **URLScan sensitive-link indexing** [src: tinder-eng.md]. Parent-company incidents land on the brand: **Jan 28 2026 cyberattack** ("limited amount of user data") as part of a campaign that also hit Bumble, Panera, CrunchBase (Bloomberg) [src: wiki-match.md, wiki-bumble.md]; FTC suit (2019, fake love-interest ads / cancellation dark patterns) **settled out of court 2025** [src: wiki-match.md]; Dec 2025 lawsuit by six Denver assault survivors accuses Match's Hinge and Tinder of "accommodating rapists" [src: wiki-match.md].

**Engineering/platform maturity (strongest public evidence in the industry):** monolith decomposition program; in-house **Elasticsearch scoring plugin written in Java** ("crucial in-house technology... complex, observable, efficient and testable"), ES8 migration; **unified Protobuf API style guide** (Parts 1-2, governed data models); Obsidian design system; Ignis dev-loop latency tooling; ML team fighting abuse via sequence models; **VLM-based photo ranking via pairwise comparisons**; on-device AI photo selection; Smart Photo hybrid ordering model; recommendation-embeddings research (AI Day); **Merlin — a harness around AI coding agents** (planning, verification, escalation); **Xcode 26 migration executed with Cursor**; a hackathon-born **AI agent that writes unit tests deployed into CI**; open-source contributions; Gen Z "Z Team" (Blind Date feature); tech.gotinder.com migrated to lifeattinder.com/blog [src: tinder-eng.md]. CTO Tom Jacques [src: tinder-eng.md]. This is a mature, AI-forward platform org — the engineering bar a new entrant is measured against.

**Monetization model summary:** freemium + 4-tier subs + weekly subs + a-la-carte (Boost, Super Like, Rose-equivalents) + invite-only luxury tier + programmatic ads on free tier + dynamic/A-B pricing + gray-market leakage (GamsGo recharges at ~50-60% of list).

### 4.2 BUMBLE (deep profile) — distressed incumbent rebuilding everything at once

**Corporate:** Bumble Inc. (Nasdaq: BMBL, $2.85 on Sep 23 2026). HQ Austin; ~150 countries. Founded by Whitney Wolfe Herd (ex-Tinder) with Andrey Andreev (Badoo), launched **December 2014**, initially on Badoo's London infrastructure [src: wiki-bumble.md]. Ownership history: Blackstone acquired holding co (Bumble+Badoo) 2019 for $3B; IPO Feb 2021 (~$13B peak valuation); **2025 valuation ~$0.7B** (BoA/Bloomberg et al.) [src: notes/01-master-facts-digest.md]. Match tried to buy Bumble in 2017 — **CONFLICT: $450M offer (TechCrunch via wiki-match) vs wiki-bumble/digest "$500M-$1B offers 2016-18" — carry both**; Match sued Bumble Mar 2018 (patents/trade secrets), settled Jun 2020 [src: wiki-match.md, wiki-bumble.md]. CEO history: Wolfe Herd → Lidiane Jones (ex-Slack, Jan 2024) → **Wolfe Herd returned as CEO March 2025**; CFO Kevin Cook; CTO Vivek Sagi (BoA listing) [src: wiki-bumble.md, bmbl-q2.md, notes/01-master-facts-digest.md]. Bumble Inc. is parent of Bumble, Badoo, and BFF [src: as-bumble.md].

**Financial/engagement (all captured values):**

| Metric | Value | Source |
|---|---|---|
| Revenue $M | 2016: 10 → 2019: 240 → 2021: 532 → 2023: 844 → 2024: 866 → **2025: 782 (-9.6%)** | businessofapps-bumble.md |
| Net income $M | 2020: -110, 2021: +286 (only profit), 2022: -80, 2023: -1.9, 2024: -768, **2025: -906 (worst)** | businessofapps-bumble.md |
| Users | 2024: 42M → 2025: 35M (-7M) | businessofapps-bumble.md |
| Payers | **CONFLICT of scope: 2.4M (2025, Bumble app per BoA/10-K) vs Q2'26 IR "total paying users 3.2M, -16.4% YoY (vs 3.8M)" — carry both; IR quarterly is authoritative on its own basis** | businessofapps-bumble.md, bmbl-q2.md |
| Q2'26 (primary IR) | App revenue $171.7M (-14.7%); ARPPU $21.96 (+1.2%); net loss $127.9M incl $169.3M impairment (Q2'25: -$367.0M incl $404.9M — two consecutive impairment quarters); Adj EBITDA $72.9M (34.6% margin); Q3'26 guide $167-173M rev / $56-60M EBITDA | bmbl-q2.md |
| Downloads | 100M+ cumulative by Jul 2020 | wiki-bumble.md |
| Activity (dated) | Mar 2017: 800M matches, 10B swipes/month, #2 Lifestyle app | wiki-bumble.md |
| Gender split | Aug 2024: 61% men / 37% women | wiki-bumble.md |
| India | Launched Dec 2018; 1M+ users in first 4 months; Priyanka Chopra investor | wiki-bumble.md |

**The Aug 2026 pivot (brand-defining):** Bumble **retired women-message-first** — men can now initiate; match window extended **24h → 72h**; press release "Bumble Unveils an Evolution to its Signature Chat Experience" (Aug 11 2026; PDF captured, contents not fetched ❓) [src: wiki-bumble.md, bmbl-press.md, notes/01-master-facts-digest.md]. **Transitional-copy conflict observed live:** the App Store description still says "women send the first chat, match has 24 hours to reply" while the same store page's event banner announces "Now, anyone can message first" [src: as-bumble.md]. Context: the first-move rule had already been softened in 2024 (women could set opening questions; CNN/Guardian coverage), and The Observer (Dec 2025) framed the full retreat as the product of men's-rights-activist litigation pressure (2018 Unruh Act suit settled 2021; Alfred Rava suit pending 2024, motion to dismiss filed) [src: wiki-bumble.md].

**Product/AI:** Private Detector (AI nude-image blur, launched Apr 2019, **open-sourced Oct 2022**); **Deception Detector** (ML fake-profile blocker, Feb 2024, blocks up to 95% of identified spam/scam accounts); **"wingman" flirting chatbot in development** (Aug 2024); AI-generated fake profiles prohibited and reportable; photo verification since Sep 2016 (first US dating app); **ID Verified option added 2025**; BFF friend-matching (Mar 2016; relaunched as standalone app Sep 2025, "Great Friendaissance"); Bizz networking (2017); Snooze mode; Incognito; Travel Mode; Advanced Filters event; "Really Into You" tab (time-on-profile, intentional likes); Share Date; Safety Center [src: wiki-bumble.md, as-bumble.md]. Advocacy engine: #CyberFlashingIsFlashing UK campaign (pro-OSA), Texas HB 2789, Virginia SB 493, CONSENT Act backing, Bloom trauma-support courses (2022) [src: wiki-bumble.md].

**Pricing (captured):** Boost $15.99/mo, Premium+ $39.99/mo (LowerMySubs cross-capture; bumble-boost.md itself is a 418B minimal page) [src: s-hinge-price.json, notes/01-master-facts-digest.md]. Historical paid features since Aug 2016 (Beeline/Rematch/Extend) [src: wiki-bumble.md].

**Store presence & reputation:** App Store 4.3★, 1.8M ratings, Editors' Choice, #20 Lifestyle, v5.480.0 [src: as-bumble.md]; Trustpilot **1.3 "Bad"** (2,604 reviews, 87% 1-star, claimed profile, "Hasn't replied to negative reviews") [src: tp-bumble.md]; mindbodygreen 4.3 [src: s-deaths.json]. Trustpilot themes: pay-to-see-likes, matches vanish, AI-bot support loops (3 weeks, closed tickets), lifetime-subscription service denial with small-claims threat, hidden auto-renewal, Premium+ upsell ("200+ likes" pre-pay → zero post-pay), $32.99 extra week billed, no refunds/prorate [src: tp-bumble.md]. Privacy labels: tracks Location, Contact Info, Identifiers, Usage Data; collects Health & Fitness among others [src: as-bumble.md].

**Security posture:** June 2021 trilateration vulnerability found by Robert Heaton — **fixed in 3 days, $2,000 bug bounty**; Aug 2024 KU Leuven research found trilateration vulnerabilities across dating apps incl. Bumble (Futurism: "Bumble and Hinge Let Creeps See Your Exact Location") [src: wiki-bumble.md]. **Jan 2026 cyberattack** (same campaign as Match/Panera/CrunchBase) — company states intruders did **not** access member database, accounts, DMs, or profiles [src: wiki-bumble.md]. **$22.5M auto-renewal class-action settlement (2020)** [src: wiki-bumble.md]. Bureau of Investigative Journalism (2023): content moderators suffered anxiety/depression/PTSD amid productivity targets and understaffing (Wired covered Bumble, Grindr, Hinge moderators together) [src: wiki-bumble.md].

**Engineering (DevSecOps lens — the cautionary tale):** The Observer (Dec 2025): Bumble **runs on a legacy technology stack first built in 2005** (Badoo partnership), including an **in-house payment system and physical servers maintained by employees**; Wolfe Herd ordered a from-scratch rewrite ("**Bumble 2.0**") [src: wiki-bumble.md]. Public engineering surface is thin: Medium "Bumble Tech" blog with topic channels Android/iOS/JavaScript/PHP/QA/Data Science/MLOps, 3.6K followers — confirms shared PHP-era Badoo lineage [src: bumble-eng.md]. A 21-year-old inherited monolith + payments stack + rewrite-in-flight during a demand crisis is the single biggest counter-example to "move fast and clone swipe" in this corpus.

### 4.3 HINGE (deep profile) — the only large grower, and the quality-first template

**Corporate:** Hinge, Inc.; 100% Match Group (51% Jun 2018, fully Feb 2019). Launch **CONFLICT: Feb 2013 (BoA overview) vs "launched 2012" (BoA prose) — carry both** [src: businessofapps-hinge.md, notes/01-master-facts-digest.md]. CEO Jackie Jantos, CFO Bill Archer, CTO Ben Celebicic [src: notes/01-master-facts-digest.md]. ~2,700+ Match staff worldwide (older DatingSitesReviews figure) vs **2,200 employees (2025, Wikipedia/10-K)** — **conflict carried** [src: s-league.json, wiki-match.md].

**Financial/engagement (all captured values):**

| Metric | Value | Source |
|---|---|---|
| Revenue $M | 2017: 2 → 2020: 90 → 2022: 284 → 2023: 396 → 2024: 550 → **2025: 689 (+25%)** — only major grower | businessofapps-hinge.md |
| Payers M | 2022: 1.06 → 2024: 1.53 → 2025: 1.95 (+420k) | businessofapps-hinge.md |
| Q2'26 segment | $203.5M (+22%; +20% FXN); payers 1.7M → 2.0M (+17%); RPP $33.11 (+4%) — highest RPP among majors; op income $63.1M (+62%, 31% margin); Adj EBITDA $79.4M (+48%, 39% margin); **global MAU +13% YoY**; entered 6 new European + 4 LatAm countries in Q2'26; on track for $1B revenue 2027 | s-mtch-q2.json |
| Users | 30M (2025, BoA) vs stale wiki-compare row "20M use Hinge, 800,000 pay" (BoA 2022) — **conflict carried (dated)** | businessofapps-hinge.md, wiki-compare.md |
| Geography | #1 in UK, Ireland, Sweden, Norway, Denmark; #3 US with 22% share; ~50% of users US; revenue ~70% US / ~15% UK | businessofapps-hinge.md |

**Product (the quality playbook in detail):** "designed to be deleted"; prompt-driven profiles (religion, height, politics, intentions, relationship type); Convo Starters; **Selfie Verification**; **post-date feedback loop** ("We ask how your dates are going" — TechCrunch dubbed it "the first dating app to actually measure real-world success"); voice notes on prompts = one of most popular features; "Friend's Take" launched mid-July 2026 (friends/family inside the dating experience) [src: as-hinge.md, s-mtch-q2.json, notes/01-master-facts-digest.md]. Mashable 2026: best overall app, with mandatory "Face Check" video selfies [src: s-deaths.json].

**Pricing (conflict-rich, all carried):**

| Item | Values captured | Sources |
|---|---|---|
| Hinge+ 1mo | **$29.99 (SwipeStats Mar 2026; GetMatches Apr 2026) vs $32.99 (VIDA) vs $16.99 (LowerMySubs) — dynamic pricing by age/region/device documented as the cause** | s-hinge-price.json |
| Hinge+ multi-month | 3mo $59.99 ($19.99/mo); 6mo $89.99 ($15.00/mo); VIDA: $64.99 3mo, $99.99 6mo | s-hinge-price.json |
| HingeX 1mo | **$49.99 (SwipeStats; GetMatches) — same GetMatches table also says "$59.99/month—double the price" (internal inconsistency, carried); India: ₹749 (~$7.81)** | s-hinge-price.json |
| HingeX multi-month | 3mo $99.99 ($33.33/mo); 6mo $149.99 ($25.00/mo) | s-hinge-price.json |
| Free tier quotas | **8 likes/day** (reset 4am local), basic filters, limited Standouts, We Met feedback | s-hinge-price.json |
| Tier extras | Hinge+ = unlimited likes, advanced filters (height, religion, politics, family plans, drinking, smoking), See Who Liked You, no ads; HingeX adds Skip the Line, Priority Likes, Enhanced Recommendations, 2 free Roses/week, exclusive Standouts | s-hinge-price.json |
| Regional ladder | India Hinge+ ₹499 (~$5.20, **-69% vs US**); Mexico/Brazil price drops | s-hinge-price.json |

**Store presence & reputation:** App Store 4.4★, 1.1M ratings, Editors' Choice, #4 Lifestyle, v10.5.0 [src: as-hinge.md]; Trustpilot **1.2** (~1K reviews, cross-listed on Tinder's page) [src: tp-tinder.md]; mindbodygreen **4.5** (highest of mass-market) [src: s-deaths.json]. Privacy labels: Sensitive Info linked [src: as-hinge.md]. Even the category winner is not loved on Trustpilot — reputational headroom is real.

**Security/compliance:** Selfie Verification (above); implicated in KU Leuven trilateration research (2024, with Bumble) [src: wiki-bumble.md]; named with Tinder in the Dec 2025 "accommodating rapists" lawsuit [src: wiki-match.md]; moderator welfare issues per Wired 2023 [src: wiki-bumble.md]. Engineering stack: **❓ no public stack detail in corpus** (proprietary; sits on Match Group infrastructure).

### 4.4 GRINDR (deep profile) — the niche monopoly printing money, carrying the industry's worst privacy record

**Corporate:** Grindr Inc. (NYSE: GRND, $15.89). Founded Mar 25 2009 by Joel Simkhai (LA); HQ West Hollywood; Chairman James Lu, **CEO George Arison**. Ownership chain: 60% to Kunlun for $93M (Jan 2016) → 100% ($152M remainder, Jan 2018) → **CFIUS-forced divestiture to San Vicente Acquisition LLC for $608.5M (Mar 2020)** → SPAC listing Nov 2022 [src: wiki-grindr.md]. FY2025 (10-K filed Mar 2 2026): **revenue $440M, net income $94.8M** [src: wiki-grindr.md]. Products: Grindr, Gaymoji, Bloop, Grindr for Equality [src: wiki-grindr.md].

**Financial/engagement (all captured values):**

| Metric | Value | Source |
|---|---|---|
| MAU | 13.5M (Sep 2023 — in wiki-grindr.md page text) vs **8M users (FY25 10-K basis — carried in digest §6; not present in the wiki page text)** vs 3.6M DAU (2018) — different metrics/dates, all carried | wiki-grindr.md; 01-master-facts-digest.md §6 |
| Q1'26 | Revenue $130M +38%; NI $27M (21% margin); Adj EBITDA $58M (45%); driven by late-2025 price increases with lower-than-expected churn | s-grnd.json |
| Q2'26 | Revenue $138M +33%; NI $18M (13% margin); Adj EBITDA $58M (42%); payers 1.4M (+16%); **ARPPU CONFLICT: $26.51 (powerdrill) vs $25.51 (CNBC) — carry both**; Madonna partnership | s-grnd.json |
| FY26 guidance | Raised to **~$540M revenue / ~$232M Adj EBITDA** (earlier ≥$535M/≥$227M); consistent with 10-K $440M base — source difference noted, not a conflict | s-grnd.json, wiki-grindr.md |
| FY25 aggregates | Direct revenue $366.30M +25.92% (koalagains basis); avg payers 1.26M +16.91%; ARPPU $24.25 +7.63%; **paying penetration 8.40%** (vs industry ~6.6%); ARPPU climb $18.20 (Q1'24) → $26.51 (Q2'26); revenue-per-employee "higher than almost all Big Tech" | s-grnd.json |
| Headwinds | Age-assurance rules + repressive policies in Malaysia/Indonesia ≈ **400,000-user headwind**; UK age verification cost ~7% of UK MAU | s-grnd.json, wiki-grindr.md |

**Strategy:** Arison is "**terraforming Grindr into an AI-native organization... unlocking significant operating leverage**" — total engineering output ~**2.5× from Jul 2025 to Apr 2026 with roughly same team size**; ads rebalanced to high-value direct campaigns + rewarded video; **"Edge" next-gen premium tier positioned as the primary 2027 growth driver targeting 0.5-1% of total MAU**; gAI ("gay-eye") tested 2025 with **six AI features intended for a premium tier** [src: s-grnd.json, wiki-grindr.md].

**Pricing (conflicts carried):**

| Tier | Sensor Tower live (Sep 2026) | top10 (undated) | Mashable | Notes |
|---|---|---|---|---|
| XTRA | $22.99/mo; **$14.99/wk** | $19.99/mo; $39.99/3mo; $99.99/yr | $14.99 1wk; $22.99 1mo; $49.99 3mo; $149.99 12mo | **$19.99 vs $22.99 conflict carried** |
| Unlimited | $44.99/mo; $27.99/wk; **$9.99 Day Pass** | $39.99/mo; $79.99/3mo; $239.99/yr | day pass $9.99 | launch price was $50/mo (Out, Jul 2019) — historical note |
| Boost | $11.99 one-time | — | — | a-la-carte |
| Complaint | uservoice: Unlimited $519.48/yr; $57.99 CAD/mo (up from 49.99 CAD) | — | — | price-rise anger documented |

Sources: s-grindr-price.json, wiki-grindr.md. Unlimited features: Viewed Me, Unsend, Incognito, Typing Status, Unlimited Profiles, Expiring Photos (10-second view), Chat Translate, Grindr on the Web; footer exposes Consumer Health Data Privacy Policy, Patents, an "Israel Settlement Agreement" page, Grindr For Equality, shop.grindr.com [src: grindr-unlimited.md].

**Distribution/censorship map (unique in the roster):** banned/sanctioned (app absent): Afghanistan, China, Crimea, Cuba, Iran, Libya, Maldives, Morocco, Syria, North Korea, Saudi Arabia, Sudan, UAE; partially restricted: Indonesia, Jordan, Malaysia, Lebanon, Qatar, Turkey, Pakistan; Dec 2019 at-risk-country security features (auto-disable distance) [src: wiki-grindr.md]. US rankings: **#3 Top Grossing iPhone**, #34 Top Free iPhone; app v26.16.1 updated 2026/09/10; released 2009/06/25; IAP range $9.99-$44.99 [src: s-grindr-price.json]. iOS rating ❓ (as-grindr.md was a 404 capture); mindbodygreen 4.6 [src: s-deaths.json].

**Security/privacy record (the industry's case study):** 2014 trilateration attack (2M+ detections in days; alleged Egyptian arrests); 2016 Kyoto University colluding-trilateration; **2018 SINTEF discovery: HIV status and testing dates shared via ad bundles**; Jan 2020 Norwegian Consumer Council complaint → **€10M GDPR fine (Jan 2021)** (data to at least 135 advertisers); WSJ May 2022: location data sold through ad networks 2017-2020; **Oct 2020 account-takeover via password-reset (found by Wassime Bouimadaghene & Troy Hunt)**; **April 2024 High Court lawsuit → Sep 2026 £26M settlement for 12,000 UK users** (covert tracking tech + HIV-status sharing) — the largest quantified dating-app privacy payout in this corpus [src: wiki-grindr.md]. Minors: ~half of sexually active gay/bi adolescents use apps like Grindr (research); no US age verification (Section 230); **UK age verification since Jul 2025 (OSA)**; Arison lobbied unsuccessfully for app-store-based verification, arguing stores already hold age data [src: wiki-grindr.md]. Ethnicity filter removed Jun 2020 (BLM complaints); HIV-test reminders added Mar 2018 [src: wiki-grindr.md]. Labor: Aug 2023 return-to-office ultimatum → 46% of 178 workers quit/terminated; CWA unfair-labor suits at NLRB [src: wiki-grindr.md]. Content: Into magazine (2017-19), Bridesman series, "Who's The Asshole?" podcast, "Host or Travel" travel series, G4E human-rights program ($100K MENA grants 2019) [src: wiki-grindr.md].

### 4.5 MATCH (match.com) + Match Group corporate (deep profile) — the legacy flagship inside a conglomerate

**Corporate:** Match Group, Inc. (Nasdaq: MTCH; S&P 600). Founded Feb 2009 (IAC conglomerate); spun off from IAC Jul 2020 (then ~$30B market cap); HQ Dallas; Chairman Thomas J. McInerney, **CEO Spencer Rascoff (since Feb 4 2025; predecessor Bernard Kim May 2022-Feb 2025; earlier Shar Dubey 2020-22, Mandy Ginsberg 2018-20)**; Rascoff cut the workforce 13% in May 2025 "amid weak demand from younger users" [src: wiki-match.md]. FY2025: revenue $3.49B, op income $873M, net income $613M, total assets $4.46B, **total equity -$254M**, 2,200 employees [src: wiki-match.md]. **BoA's "$3.3B ~54% of market" vs 10-K $3.49B — conflict of basis, carried** [src: businessofapps-market.md, wiki-match.md].

**Match.com the product:** legacy web flagship (1995-era brand; wiki defunct-list shows its cohort died: Matchmaker.com 1986, Yahoo Personals etc.); 96M registered / 1.377M active (2009/2010 — dated) [src: wiki-compare.md]; paid-gated messaging (not free) [src: wiki-compare.md]; Trustpilot **1.0 "Bad"** (1,336 reviews on the Danish Match.dk listing, 91% 1-star, claimed Feb 2015) with complaints: $119 charged day after cancel, no refunds, automated support loops, "AI with no long-term memory" fake profiles, inactive profiles, unexplained bans, ignored Google Play transaction IDs, Trading Standards escalations [src: tp-match.md]. Civic Science penetration skews 35+ (10/3/6/15) — the legacy audience [src: businessofapps-tinder.md]. Match Japan = #2 market after US; Pairs walled garden (below) [src: wiki-match.md, pairs-home2.md].

**Q2'26 corporate detail (shareholder-letter basis):** revenue $853.1M (-1%); **EPS CONFLICT: $0.92 missing Zacks consensus by 5.15% vs Perplexity-basis adj EPS $0.70 vs $0.97 est (-27.84%) — different adjustment bases, carry both**; stock -7.49% next day (down 11-12% after hours per Barron's); total payers 13.3M (-6%); RPP $21.13 (+6%); Adj EBITDA $331M +14% (39% margin); Q3'26 guide $885-895M (-2 to -3%) / EBITDA $330-335M; SBC $230-240M FY; indirect revenue $13M (-28%); cost of revenue $204.3M (24% of rev); S&M $158.3M (19%); G&A $106.5M (12%, -22%) [src: s-mtch-q2.json]. E&E segment $179M **-17%** "primarily due to the Azar app redesign" [src: s-mtch-q2.json]. WSJ: "sluggish Tinder offset Hinge strength" [src: s-mtch-q2.json].

**Portfolio (as of Feb 2026 brand list):** Tinder, Hinge, Match.com, OkCupid, Plenty of Fish, Meetic (infobox brands row; the matchgroup.com US-brands-derived list also includes), Pairs, Match Japan, The League, Her, Azar, BLK, Chispa, Stir, Upward, Salams, Harmonica (acquired 2019), Ourtime/People Media constellation (~24 "People Meet" niches), Yuzu, Delightful, plus **Sniffies (minority stake)** [src: wiki-match.md]. M&A timeline: People Media $80M (2009); Singlesnet (2010); **OkCupid $50M (2011)**; PoF $575M (2015); **Hyperconnect $1.73B (Feb 2021 — largest ever, Korea, Azar)**; Hinge (2018-19); The League (Jul 2022, undisclosed); **Her (May 2025, queer women)**; **Sniffies $100M minority + option (Apr 2026)** [src: wiki-match.md].

**Legal/compliance register:** FTC suit (2019) settled 2025; Sean Rad $2B valuation suit (2018) & Blatt countersuit; **Muzmatch trademark suit (Feb 2021, won London Apr 2022)** — the direct-competitor suppression move relevant to Muzz below; EARN IT Act support (2020 — privacy-criticized); **Coalition for App Fairness co-founder with Spotify/Epic (Sep 2020)** fighting 30% app-store taxes; Noonlight safety partnership (2020); **World (Sam Altman biometrics) partnership May 2025, piloting in Japan**; Russia exit by Jun 30 2023 (Tinder was Russia's most popular app in 2022); **Jan 28 2026 cyberattack ("limited" data)**; **Dec 2025 "accommodating rapists" lawsuit** (six Denver survivors, Stephen Matthews case; Hinge & Tinder named) [src: wiki-match.md, s-league.json].

**Engineering:** Tinder's org (§4.1) is the group's public engineering face; Rascoff writes on the Tinder eng blog himself [src: tinder-eng.md].

### 4.6 OkCupid (compact)

Match Group since Feb 2011 ($50M) — "the first free, advertising-based product added to the Match Group portfolio" [src: wiki-match.md]. Question-based matching; **30M+ active (2013, dated)**; free to join/search/message; **phone verification required to register or access an account**; paid "A-List" tier for non-essentials (sponsored profile promotion etc.) [src: wiki-compare.md]. Trustpilot **1.2** (875 reviews, cross-listed) [src: tp-bumble.md]. US-centric; sits in the -17% E&E segment [src: s-mtch-q2.json]. Data-depth: medium. Status: declining/legacy harvest. A cautionary note for product people: OkCupid's question-matching was the pre-AI "compatibility algorithm" — its decline while prompt-based Hinge rose shows framing beats machinery.

### 4.7 Plenty of Fish (compact)

Match Group since Jul 2015 ($575M all-cash) [src: wiki-match.md]. **100M registered (2015, dated)**; mostly US/CA/UK/BR; free messaging; paid unlocks read-receipts/viewed-profile data [src: wiki-compare.md]. Trustpilot **1.7** (53K reviews — the largest review volume captured, cross-listed) [src: tp-tinder.md]. Free-messaging model = highest bot/scam surface in the legacy set (consistent with complaint volumes). E&E segment decline applies. Data-depth: medium. Status: declining/legacy.

### 4.8 Meetic (compact)

Match Group; European (esp. France) serious-dating leader [src: wiki-compare.md, wiki-match.md]. Trustpilot **Meetic 1.4 (11K reviews)** and **Meetic.it 1.6 (2K)** (cross-listed) [src: tp-tinder.md]. No product/financial detail captured beyond segment membership — data-depth: thin. Status: declining/legacy (E&E). Its 11K-review 1.4 score shows European legacy trust erosion mirrors the US.

### 4.9 Badoo (compact)

Bumble Inc. (Bumble's sister brand via the 2019 Blackstone deal) — "Bumble Inc. is the parent company of Bumble, Badoo, and BFF" [src: as-bumble.md]. **500M registered (Feb 2021 — largest registered base captured), 44 languages, 12 mobile platforms**; free tier; paid buys prominence, higher limits, invisibility [src: wiki-compare.md]. Trustpilot **2.9 (15K reviews)** — mediocre, not hated (cross-listed) [src: tp-tinder.md]. Wikipedia history: Andrey Andreev's Badoo HQ culture scandals (2019 Forbes investigation: "Sex, Drugs, Misogyny And Sleaze At The HQ Of Bumble's Owner") shadow the lineage [src: wiki-bumble.md refs]. Strategically: Badoo is the volume engine whose 2005-era stack is Bumble's inherited debt [src: wiki-bumble.md]. Data-depth: medium. Status: declining/absorbed (infrastructure provider more than growth brand).

### 4.10 Happn (compact)

"Cross paths, date local"; "Open 24/7 since 2014"; **claims +180M users worldwide (own site, © 2025)** vs **50M registered (2019, Wikipedia)** — 3.6× gap between claim and dated third-party figure; **conflict carried** [src: happn-home.md, wiki-compare.md]. Trust charter + Safety Center links; Didodi consent (EU cookie CMP) observed — EU-compliance-aware [src: happn-home.md]. Owner ❓ (not stated on captured page; wiki-compare owner cell empty). Free messaging per wiki row [src: wiki-compare.md]. Proximity matching (crossing paths) = the location-privacy-sensitive design; no captured incidents for happn specifically. Data-depth: medium. Status: stable ❓.

### 4.11 Feeld (compact-plus — the closest existing analogue to a quality-first niche entrant)

Feeld Ltd; CEO & co-founder Ana Kirova; founded "over a decade ago" on a personal origin story (the love letter); "for the curious / open-minded" [src: feeld-home2.md]. **14M+ registered accounts (Sensor Tower, Feb 2026 — cited on their own page)** [src: feeld-home2.md]. No revenue/payer data captured ❓ — private company.

**Product:** desire tags (Kink, ENM, GGG, Roleplay, Celibate...); longform bios; **hidden bios** (public + private self); **"Always ad-free"**; **link profiles with up to 5 partners** (couple/group dating first-class); group chats; LOOKING FOR taxonomy incl. couple types; **"never rank profiles" / "people don't belong behind paywalls"** — an explicit anti-algorithm, anti-paywall product philosophy [src: feeld-home2.md]. **Safety stack (best-in-corpus consumer privacy design):** biometric identity verification; **screenshot protection for chat images**; consent-driven nudity detection (blur by default, tap to unblur); 24/7 global safety team; Incognito; photo timers; one-view videos [src: feeld-home2.md]. **Monetization:** free core + **Majestic** membership (See Who Likes You, Go Incognito, advanced finding, Unlimited Likes + Pings) — **price ❓ (JS-gated; the dedicated FAQ literally asks "How much does Feeld Majestic cost?" without a static answer)**; add-ons Pings and Uplift; red 'M' badge for members [src: feeld-majestic.md, feeld-home2.md]. **Community/IRL:** real events calendar (London: Kinky Trivia Sep 30, Pitch Your Mate Oct 2, FLINTASY Oct 3, Feeld Social Soho Oct 6, Sir 30+ Dec 4, Coven X Feeld Dec 31 2026) — the IRL-strategy exemplar; Feeld X Kesha collab; State of Dating vols 3-4 research; magazine [src: feeld-home2.md]. Trust ratings ❓ (none captured). Data-depth: medium (rich product, zero financials).

### 4.12 Pure (compact)

"Open-Minded Dating App"; **© 2026 Online Classifieds AG, Switzerland** — vs Wikipedia owner "Misterico Limited" (older listing): **ownership evolution conflict carried** [src: pure-home.md, wiki-compare.md]. **500K registered (2021, dated)**; mostly US/CA/UK; "time-limited" messaging (self-destructing chats; matches expire); free messaging per wiki row [src: wiki-compare.md]. Mashable 2026: reviewers' favorite for "saucy, anonymous phone conversations" [src: s-deaths.json]. **Distribution (DevSecOps-notable):** App Store, Google Play, **AppGallery, RuStore** — multi-store incl. Russian stores, an unusual geopolitical posture; 10 language subdomains [src: pure-home.md]. **Compliance surface:** dedicated **Consumer Health Data Privacy Policy** and **"Do Not Sell or Share My Personal Information"** (US state-law compliance, e.g. WACA/CCPA lineage) + Recommendation Policy; city guides; sister app QURLI; Pure Queen sub-brand [src: pure-home.md]. Data-depth: medium. Status: active niche.

### 4.13 Coffee Meets Bagel (compact — honest thin marker)

**Capture corrupted** (see Methodology) — treat all specifics as ❓. What the corpus does support: daily curated matches based on Facebook connections; free tier; **"Beans" in-app currency** unlocks extras (matching outside curated list); premium enables activity reports, read receipts, extra beans; **premium launched $35/mo (Mar 2017, VentureBeat via wiki ref)** [src: wiki-compare.md]. Liveness proof: GDI podcast Jun 25 2026 — CMB's Quincy Yang on "Why Intentional Dating Is Making a Comeback" — company active and trade-press-visible in 2026 [src: gdi-home.md]; a dating-sites-review site nav cross-lists it as "a female friendly dating service" [src: s-league.json]. Ratings/financials/status-beyond-active: ❓. Data-depth: thin. Strategic note: CMB's slow-dating thesis is the direct conceptual competitor to a quality-first entrant — and its low profile suggests under-execution, not invalidation.

### 4.14 Muzz (compact-plus)

Muslim-focused dating/marriage app; founder **Shahzad Younas** (Wikipedia owner cell); site © 2026 Muzz [src: wiki-compare.md, muzz-home.md]. **Claims: 20 million Muslims, 1M+ successes, 950+ couples/day** (marketing claims, attributed) [src: muzz-home.md]. Free: chat, match, video calling without phone number, search filters; premium **Muzz Gold** (price ❓ JS/SPA-gated) [src: muzz-home.md, wiki-compare.md]. **Safety/verification stack (strongest captured among niche apps):** Selfie Verification + SMS confirmation + location checks; photo hiding + nickname anonymity; **blocks screenshots AND screen recording**; **Chaperone (Wali) available inside conversations** — culturally-specific safety UX; in-person singles events (e.g., Toronto; 400K+ Muslims in GTA per their blog) [src: muzz-home.md]. Voice & video profiles; SEO arms (Shia/Sunni/Arab/matrimony pages) [src: muzz-home.md]. **Engineering signal:** dedicated engineering subdomain (engineering.muzz.com) — rare among niche apps [src: muzz-home.md]. Competitive context: Match Group sued "Muzmatch" as a "Tinder clone" (Feb 2021) and won in London (Apr 2022) — the incumbent's trademark pressure on this niche is documented; Match's own Muslim-market assets include Harmonica (Egypt, 2019) and Salams (Feb 2026 brand list) [src: wiki-match.md, wiki-compare.md]. Data-depth: medium. Status: active/growing (claims).

### 4.15 Raya (compact)

"Exclusive, membership-based dating and networking app for creatives and public figures"; owner Raya App, Inc.; not free; messaging after match only [src: wiki-compare.md]. Mashable 2026: "**Soho House of dating apps**... exclusive, expensive... application... vetting from a few days to a few years" [src: s-deaths.json]. Pricing ❓ (never captured; invite/application model). Data-depth: thin. Status: active. Proof that curation-as-luxury sustains a small high-ARPPU business at the top of the market Tinder's $499 Select imitates.

### 4.16 Tantan (compact — honest thin marker)

China's mass-market swipe app ("first to break through to general audiences" per BoA's top-apps history) [src: businessofapps-market.md]. Owner Hello Group (MOMO); **MOMO ticker live at $4.99 (+2.25%) on GDI Sep 23 2026 = parent still trading, but Tantan-specific 2026 status ❓** (no direct capture) [src: gdi-home.md, notes/01-master-facts-digest.md]. Data-depth: thin. Status: ❓ uncertain — China regulatory environment for dating apps sits outside this corpus.

### 4.17 Pairs (compact)

Japan; Match Group (via Match Japan; listed in Feb 2026 brand portfolio) [src: wiki-match.md]. **Directly observed: geo-blocks all non-Japan IPs** — a deliberate walled-garden distribution posture [src: pairs-home2.md]. Japan is **Match's #2 market after the US**; WSJ profiled the formula: "Match's Winning Formula for Online Dating in Japan Gives Women Control, Makes Men Pay" [src: wiki-match.md]. Product detail beyond that ❓. Data-depth: thin but strategically instructive (regional walls work where trust dynamics differ).

### 4.18 TrulyMadly (compact-plus)

"India's Most Trusted Free Online Matchmaking App"; owner **Crescere Technologies Pvt. Ltd. (© 2022 site)** [src: trulymadly-home.md]. **4.0★, 80T (80,000) reviews, 10M+ downloads, 20MB app size, rated 18+** (own-site badge — Google Play figures) [src: trulymadly-home.md]. **Trust-first product stack (the India-market quality playbook):** "No Fake Profiles" — **manually moderates all profiles after the "ChowkAIdar1.0" check**; "Safety For Women" — **blocks screenshots and picture downloads**; Compatibility Quiz; Forever Stories (marriage testimonials); celebrity campaigns (Disha Patani, Sidharth Malhotra, Tanmay Bhat et al.) [src: trulymadly-home.md]. **Trust/compliance pages:** Hiring Scam Public Notice, Child Safety, **Report Vulnerability (a public VRP page — rare)**; Safety guidelines [src: trulymadly-home.md]. Coverage: India + diaspora (US, Canada, Australia, Germany, Gulf states, Singapore, Indonesia, Bangladesh, Nepal) [src: trulymadly-home.md]. Monetization detail ❓ (no prices captured). Data-depth: medium. Status: active, positioned exactly where a quality-first entrant would sit in India.

### 4.19 Sniffies (compact)

**Browser-based** (no app store) dating/hookup app for gay/bi men; free messaging; map/grid cruising UX [src: wiki-compare.md]. **Apr 2026: Match Group $100M minority investment with an option to acquire remaining equity; Sniffies stays founder-led and independent** (single-source flag retained from verification pass) [src: wiki-match.md]. Community reaction documented: WIRED (Apr 28 2026) — users worry about a "**'Straightification' of the Gay Hookup App**"; Out (Apr 27 2026) covered its cruising-easier update [src: wiki-match.md]. After Archer's shutdown, GDI reports Sniffies becomes "the primary queer app under the Match Group umbrella" for that audience [src: s-league.json]. Data-depth: medium (deal + positioning; no financials). Status: active / consolidating toward Match.

### 4.20 Facebook Dating (compact)

Meta Platforms; embedded in the main Facebook app; **free — and uniquely "all features free"** per the Wikipedia comparison row; free messaging [src: wiki-compare.md]. Sep 22 2026 GDI headline: "**Facebook Dating Quietly Gains Ground on Dating Apps**" (headline-level only — no figures captured; flagged single-source/headline) [src: gdi-home.md]. Zero-price + existing social graph + no incremental app install = the structural free-tier threat every paid incumbent fears; monetization intent ❓. Data-depth: thin. Status: quietly gaining (headline evidence only).

**Section 4 sources:** businessofapps-tinder.md, as-tinder.md, gp-tinder.md, tp-tinder.md, s-tinder-price.json, tinder-plans.md, tinder-eng.md, businessofapps-bumble.md, wiki-bumble.md, bmbl-q2.md, bmbl-press.md, as-bumble.md, tp-bumble.md, bumble-boost.md, bumble-eng.md, s-hinge-price.json, businessofapps-hinge.md, as-hinge.md, s-mtch-q2.json, wiki-match.md, wiki-compare.md, wiki-grindr.md, s-grnd.json, s-grindr-price.json, grindr-unlimited.md, tp-match.md, businessofapps-market.md, happn-home.md, feeld-home2.md, feeld-majestic.md, pure-home.md, muzz-home.md, trulymadly-home.md, s-league.json, s-deaths.json, gdi-home.md, pairs-home2.md, notes/01-master-facts-digest.md, notes/verification-pass.md.

---

## 5. Composite Feature Matrix

**Columns = the 8 best-documented competitors in the corpus** (Tinder, Bumble, Hinge, Grindr, Feeld, Muzz, Pure, TrulyMadly). The other 12 roster entities are ❓-heavy for feature-level claims and are excluded from columns rather than guessed at (their captured facts live in §4 profiles). Cells cite only captured evidence; symbols per §1 Legend. Pricing cells carry conflicts inline where they exist.

**Legend:** ✅ confirmed · ❌ absent (checked, not present) · 🟡 partial/regional/beta/paywalled · ➖ not applicable · ❓ unconfirmed (not in corpus). "LS" = LowerMySubs cross-capture; "ST" = Sensor Tower.

### 5.1 Core Matching Mechanics

| Sub-feature | Tinder | Bumble | Hinge | Grindr | Feeld | Muzz | Pure | TrulyMadly |
|---|---|---|---|---|---|---|---|---|
| Primary paradigm | Swipe + ML ranking (VLM photo rank, recs embeddings) | Swipe; women-first retired Aug 2026; anyone messages first | Prompt-profiles, discoverable, intent-first | Geo-grid cascade sorted by distance | Desire-tags, longform bios, couple profiles | Swipe + search filters (matrimony intent) | Time-limited anonymous ads, self-destructing chat | Compatibility Quiz + curated matchmaking |
| Free likes/day quota | ~100 (LS) | 25 (LS) | 8 (reset 4am local) | ➖ (grid browse model) | 🟡 "no paywalls" ethos; unlimited likes only in Majestic | 🟡 free chat+match; quota ❓ | ❓ | ❓ |
| Match/expiry window | ❓ none captured | 72h (was 24h; Aug 2026) | ❓ | ➖ real-time grid | ➖ | ❓ | Chats self-destruct (time-limited) | ❓ |
| Couples/group profiles | ❌ | ❌ | 🟡 relationship-type field | ➖ | ✅ link up to 5 partners + group chats | ➖ | 🟡 open-minded positioning | ➖ |
| Free messaging (pre-match) | ❌ (Platinum unlocks message-before-match) | ❌ after match | ❌ | ✅ chat from grid | ✅ | ✅ | 🟡 time-limited | ❓ |

### 5.2 Safety & Verification

| Sub-feature | Tinder | Bumble | Hinge | Grindr | Feeld | Muzz | Pure | TrulyMadly |
|---|---|---|---|---|---|---|---|---|
| Selfie/biometric verification | ✅ Face Check (GP; video selfies per Mashable) | ✅ photo verify since 2016 (first US) + ID Verified 2025 | ✅ Selfie Verification | ❌ (no identity verify; UK age-verify only) | ✅ biometric identity verification | ✅ Selfie + SMS + location checks | ❓ | ✅ manual moderation of ALL profiles (ChowkAIdar1.0) |
| Age verification | 🟡 UK only via OSA ecosystem (Persona-class) | 🟡 UK (OSA applies) | 🟡 UK (OSA applies) | ✅ UK Jul 2025 (cost ~7% UK MAU) | ❓ | ❓ | ❓ | ❓ (18+ store rating only) |
| Screenshot blocking | ❌ | ❌ | ❌ | ❌ | ✅ chat images | ✅ screenshots AND screen recording | ❓ | ✅ screenshots + picture downloads |
| Nude-image handling | 🟡 (parent-level tooling ❓) | ✅ Private Detector (AI blur, open-sourced) | ❓ | ❓ | ✅ consent-driven nudity blur | ➖ | ❓ | ➖ |
| Safety ops/features | ✅ Noonlight (Match), share-meeting-safety | ✅ Safety Center, Share Date, Snooze | ✅ date feedback + Friend's Take | ✅ Dec 2019 at-risk-country features | ✅ 24/7 global safety team | ✅ Chaperone (Wali) in-chat | ❓ | ✅ Safety guidelines page, women-safety core |
| Third-party safety partnership | ✅ Noonlight, RAINN council (Match) | ✅ ADL, NDVH, RAINN donations | 🟡 via Match (Noonlight) | ✅ G4E program | ❓ | ❓ | ❓ | ❓ |

### 5.3 AI Features (2026 state)

| Sub-feature | Tinder | Bumble | Hinge | Grindr | Feeld | Muzz | Pure | TrulyMadly |
|---|---|---|---|---|---|---|---|---|
| AI photo ranking/selection | ✅ VLM pairwise ranking; on-device selection; Smart Photo hybrid | ❓ | ❓ | 🟡 gAI suite (6 features tested 2025, premium intent) | ❌ pledge: "never rank profiles" | ❓ | ❓ | ❓ |
| AI moderation/abuse | ✅ ML abuse team (sequence models) | ✅ Deception Detector (95% auto-block of spam/scam) + Private Detector | 🟡 (via Match tooling ❓) | 🟡 (AI+human moderation on Archer was Match's; Grindr-specific ❓) | 🟡 nudity-detection blur | ❓ | ❓ | ✅ ChowkAIdar1.0 profile check + manual review |
| AI assistant/chatbot | ❓ | ✅ "wingman" chatbot in development | ❓ | 🟡 gAI premium features | ❌ (philosophy opposed) | ❓ | ❓ | ❓ |
| AI in engineering org | ✅ Merlin agent harness; Cursor (Xcode 26); CI test-writing agent | 🟡 Bumble 2.0 rewrite underway | ❓ | ✅ "AI-native org", ~2.5× output same headcount | ❓ | ❓ (eng blog exists) | ❓ | ❓ |
| LLM-based matching (external benchmark) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ — (outside columns: Keeper's "marriage-bounty" LLM matchmaking raised $4M Dec 2025 [src: wiki-compare.md]) |

### 5.4 Monetization & Pricing Tiers

| Sub-feature | Tinder | Bumble | Hinge | Grindr | Feeld | Muzz | Pure | TrulyMadly |
|---|---|---|---|---|---|---|---|---|
| Tier ladder | Plus/Gold/Platinum/Select | Boost/Premium/Premium+ | Hinge+/HingeX | XTRA/Unlimited (+Edge 2027) | Free/Majestic (+Pings, Uplift add-ons) | Free/Muzz Gold | ❓ | ❓ |
| Entry paid price/mo | $24.99 (vs LS $15.99 — conflict) | $15.99 (Boost, LS) | $29.99 (vs $32.99 VIDA, $16.99 LS — conflict; dynamic pricing documented) | $22.99 ST (vs $19.99 top10 — conflict) | ❓ JS-gated | ❓ | ❓ | ❓ |
| Top tier price | Select ~$499/mo invite-only | Premium+ $39.99 (LS) | HingeX $49.99 (same table also says $59.99 — internal conflict) | Unlimited $44.99/mo ST | Majestic ❓ | Gold ❓ | ❓ | ❓ |
| Weekly sub / day pass | ✅ Plus $12.99/wk | ❓ | ❓ | ✅ XTRA $14.99/wk; Unlimited $27.99/wk; $9.99 Day Pass | ❓ | ❓ | ❓ | ❓ |
| A-la-carte purchases | ✅ Boost, Super Like; testing unbundled See Who Likes You + Passport | ✅ SuperSwipe/Note (Really Into You tab) | ✅ Roses (2/wk in HingeX), Standouts | ✅ Boost $11.99 | ✅ Pings, Uplift | ❓ | ❓ | ❓ |
| Dynamic/age/region pricing | ✅ documented + $60.5M age-pricing suit | ❓ | ✅ documented (age/region/device); India ₹499 (-69%) | 🟡 late-2025 price rises, low churn | ❓ | ❓ | ❓ | ❓ |
| Ads on free tier | ✅ (GP "contains ads") | ❓ | ✅ (Hinge+ sells "no ads") | ✅ programmatic + rewarded video (dual-engine) | ❌ "Always ad-free" | ❓ | ❓ | ❓ |
| Payer penetration (captured basis) | ~8.5M payers / 60-75M MAU ≈ 11-14% | ~3.2M total / 35M users ≈ 9% (bases conflict §4.2) | 2.0M / 30M ≈ 7% | 8.40% (FY25 stated) | ❓ | ❓ | ❓ | ❓ |

### 5.5 Regional Footprint

| Sub-feature | Tinder | Bumble | Hinge | Grindr | Feeld | Muzz | Pure | TrulyMadly |
|---|---|---|---|---|---|---|---|---|
| Core revenue markets | US ~40%, UK ~10% | 150 countries; US-centric | ~70% US / 15% UK rev; #1 UK/IE/SE/NO/DK | US #3 Top Grossing iPhone; global gay diaspora | Global; London-event-centric | Global Muslim diaspora (GTA Toronto focus) | US/CA/UK core + 10 languages | India + 13 diaspora countries |
| 2026 expansion moves | ➖ | ❓ | +6 EU +4 LatAm countries in Q2'26 | ➖ | IRL events expansion | in-person events (Toronto+) | ❓ | ❓ |
| Government blocks/censorship | ➖ (Russia exit Jun 2023 via Match) | ➖ (left Russia earlier) | ➖ | Banned: CN, IR, SA, AE, CU, KP, SY, LY, MV, MA, SD, AF, Crimea; restricted: ID, JO, MY, LB, QA, TR, PK | ➖ | ➖ | 🟡 RuStore/AppGallery distribution (RU reach) | ➖ |
| Geo-fencing posture | 🟡 Passport (paid location change) | 🟡 Travel Mode | ➖ | 🟡 distance display toggle | ➖ | ➖ | ➖ | ➖ |

### 5.6 Demographic Focus

| Sub-feature | Tinder | Bumble | Hinge | Grindr | Feeld | Muzz | Pure | TrulyMadly |
|---|---|---|---|---|---|---|---|---|
| Primary age band | 18-34 (35% are 18-24; 60% <35) | similar mass-market | 25-40 relationship-seekers | all adult gay/bi/queer men (incl. minors-risk documented) | 20s-40s "curious" | marriage-minded Muslims | 25-40 casual | 22-35 serious/marriage |
| Gender skew | 75/25 vs 73/27 male (conflict carried) | 61M/37F (Aug 2024) | ❓ | ➖ (all-male core by design) | 🟡 queer-heavy mix | ❓ | ❓ | ❓ (India skew worse per BoA, Tinder) |
| Orientation/identity coverage | ✅ broad + Astrology/Double Date experiments | ✅ broad incl. nonbinary messaging fix 2022 | ✅ relationship-type field | ➖ gay/bi/queer men focus | ✅ strongest queer/ENM taxonomy | ➖ hetero matrimony focus | 🟡 open-minded framing | ➖ hetero matrimony focus |
| Community-adjacent brands/IRL | ❓ | ✅ BFF standalone + events positioning | ✅ Friend's Take | ✅ Into/Bridesman/podcast/G4E | ✅ events calendar + Kesha + magazine | ✅ singles events | ✅ city guides, Pure Queen | ✅ celebrity collabs, Forever Stories |

### 5.7 Trust & Reputation

| Channel | Tinder | Bumble | Hinge | Grindr | Feeld | Muzz | Pure | TrulyMadly |
|---|---|---|---|---|---|---|---|---|
| Apple App Store (US) | 4.2★ (1.8M) | 4.3★ (1.8M) | 4.4★ (1.1M) | ❓ (404 capture) | ❓ | ❓ | ❓ | 🟡 4.0★ (80K, own-site badge) |
| Google Play | 3.9★ (9.2M) | ❓ | ❓ | 🟡 rankings only (#3 grossing) | ❓ | ❓ | ❓ | 🟡 10M+ downloads badge |
| Trustpilot | 1.1 (5.1K) | 1.3 (2.6K) | 1.2 (~1K) | ❓ | ❓ | ❓ | ❓ | ❓ |
| Third-party 2026 score | mindbodygreen 3.8 | mindbodygreen 4.3 | mindbodygreen 4.5 | mindbodygreen 4.6 | ❓ | ❓ | Mashable category favorite | ❓ |
| Support reputation (verbatim corpus) | AI-only support complaints | AI-bot loops 3 weeks, closed tickets | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |

### 5.8 Engineering / Platform Maturity

| Signal | Tinder | Bumble | Hinge | Grindr | Feeld | Muzz | Pure | TrulyMadly |
|---|---|---|---|---|---|---|---|---|
| Public eng content | ✅ rich blog (monolith decomposition, ES8 Java plugin, Protobuf style guide, Obsidian, Ignis, Merlin, OSS) | 🟡 Medium blog (PHP/JS/MLOps topics) | ❓ none captured | ✅ AI-native claims, 2.5× output, Web app | ❓ | ✅ engineering.muzz.com | ❓ | ❓ |
| Architecture era | ✅ modernization program (decomposed monolith, governed APIs) | ❌ 2005-era inherited stack; in-house payments; physical servers; Bumble 2.0 rewrite ordered | ❓ (Match infra) | ✅ rebuild-forward | ❓ | ❓ | ❓ | 🟡 20MB lightweight app |
| Release cadence evidence | v17.36.0 ~16h pre-capture; GP updated Sep 21 2026 | v5.480.0 2d pre-capture | v10.5.0 1d pre-capture | v26.16.1 updated 2026/09/10 | ❓ | ❓ | ❓ | ❓ |
| Design system/tooling | ✅ Obsidian, API style guide, CI AI agents | 🟡 (rewrite pending) | ❓ | ❓ | ❓ | ❓ | ❓ | ❓ |

### 5.9 Security & Privacy Posture

| Signal | Tinder | Bumble | Hinge | Grindr | Feeld | Muzz | Pure | TrulyMadly |
|---|---|---|---|---|---|---|---|---|
| Documented incidents | 🟡 Jan 2026 parent breach ("limited data") | 🟡 Jan 2026 breach (no member DB accessed per co.); 2021 trilateration ($2K bounty); 2024 KU Leuven | 🟡 2024 KU Leuven trilateration; Dec 2025 lawsuit | ❌ worst-in-class record: 2014/2016 trilateration, 2018 HIV-data sharing, €10M GDPR fine 2021, 2020 ATO vuln, 2022 ad-network location sales, £26M settlement 2026 | ✅ none captured | ✅ none captured | ✅ none captured | ✅ none captured |
| Privacy-label posture (stores) | 🟡 shares Location+Personal+4 others; tracks identifiers; contacts+sensitive linked | 🟡 tracks location/contact/identifiers/usage; health & fitness collected | 🟡 sensitive info linked | 🟡 Consumer Health Data Privacy Policy page exists | ✅ anti-screenshot, photo timers, one-view videos, incognito | ✅ photo hiding, nicknames | ✅ US "Do Not Sell or Share" + Consumer Health Data Policy | ✅ screenshot/download bans; public Report Vulnerability page |
| Certification/security research | ✅ ISO/IEC 27701:2019; published GitHub Actions + AWS OIDC research | 🟡 open-sourced Private Detector | ❓ | ❓ | ❓ | ❓ | ❓ | ✅ public VRP page |
| Regulatory payouts | 🟡 parent FTC settlement 2025 | ❌ $22.5M auto-renewal settlement 2020 | 🟡 (via Match) | ❌ €10M GDPR + £26M UK settlement | ✅ none | ✅ none | ✅ none | ✅ none |

### 5.10 Compliance Posture

| Regime | Tinder | Bumble | Hinge | Grindr | Feeld | Muzz | Pure | TrulyMadly |
|---|---|---|---|---|---|---|---|---|
| UK Online Safety Act (Jul 25 2025 age-verify deadline) | 🟡 compliance via ecosystem (Persona-class; bypassed by game-character photos per corpus) | ✅ public advocate (#CyberFlashingIsFlashing pro-OSA campaign) | 🟡 assumed via Match ❓ | ✅ verified Jul 2025; lost ~7% UK MAU; lobbied for app-store model | ❓ | ❓ | ❓ | ➖ (India regime) |
| GDPR / EU DSA | ✅ ISO 27701 cert signal | 🟡 EU user base | 🟡 EU expansion | ❌ fined €10M (2021) | 🟡 UK/EU terms split observed | ❓ | 🟡 Swiss entity; EU presence | ➖ |
| US federal/state | 🟡 TAKE IT DOWN context; $60.5M age-pricing suit; parent FTC settled 2025 | ✅ CONSENT Act backer; TX/VA cyberflashing laws | 🟡 Dec 2025 suit | 🟡 Section 230 stance (no US age verify) | ❓ | ❓ | ✅ US state CHD + DNS/Share compliance | ➖ |
| Regional overlays | 🟡 Russia exit 2023 (via Match) | 🟡 left Russia earlier | ➖ | 🟡 Malaysia/Indonesia repression ≈400K user headwind | ➖ | ➖ | 🟡 RuStore distribution | ✅ India: Child Safety page, Hiring-Scam notice, DPDP-era posture ❓ |

**Section 5 sources:** as-tinder.md, gp-tinder.md, tp-tinder.md, s-tinder-price.json, s-hinge-price.json, tinder-eng.md, as-bumble.md, tp-bumble.md, wiki-bumble.md, bmbl-q2.md, as-hinge.md, s-mtch-q2.json, wiki-grindr.md, s-grnd.json, s-grindr-price.json, grindr-unlimited.md, feeld-home2.md, feeld-majestic.md, muzz-home.md, pure-home.md, trulymadly-home.md, wiki-compare.md, wiki-match.md, s-deaths.json, gdi-home.md, wiki-osa.md (via digest §11), notes/01-master-facts-digest.md.

---

## 6. Strategic Observations

### 6.1 Consumer-lens white space (where a quality-first entrant wins)

1. **Trust is the vacuum.** Trustpilot 1.0–1.3 across Tinder, Bumble, Hinge, Match, OkCupid (1.2), Meetic (1.4), PoF (1.7) — versus mindbodygreen scores of 4.3–4.6 for the same products. Users rate the *concept* fine and the *execution* (billing traps, fake profiles, AI support loops, bans) terribly. Verbatim corpus complaints are a ready-made requirements document: honest cancellation, refunds/prorate, human support escalation, fake-profile SLAs, transparent pricing.
2. **Women's safety is quantified and unowned.** "99% of Women Report Abuse on Dating Platforms" (Australia, Sep 2026) + Australia's proposed statutory duty of care (Sep 22 2026) + Bumble's retreat from women-first under litigation pressure = the largest unmet positioning in the market. Bumble's own pivot shows a *rules-based* approach (women must message) failed legally and commercially; a *safety-infrastructure* approach (verification, screenshot protection, chaperone-style controls — see Muzz/Feeld/TrulyMadly primitives) is the durable version.
3. **The 40+ market is openly conceded.** GDI (Sep 21 2026): apps keep chasing Gen Z — "What About 40+?" while Civic Science shows Tinder collapsing from 40% (18-24) to 12% (35+) penetration and Match/eHarmony holding the olds with 1.0/2.9-star products. An aging singles population with money and no quality product is classic entry geometry.
4. **Intentional/slow dating has mindshare but weak execution.** Hinge monetized intent; CMB is alive but quiet (one Jun 2026 podcast); the "daily curated" model is under-attacked. Hinge's 8 likes/day free quota is the proven friction point.
5. **IRL hybrid is the emerging format, not a fad.** Feeld's full events calendar, Hinge's Friend's Take, Bumble's BFF standalone, Vice's hobby-event migration, Time/Harris "80% find IRL meeting cool" — the winning 2027 product likely brokers online-to-offline with safety rails (Share Date-style check-ins exist at Bumble/Tinder).
6. **Queer women: consolidation just proved the category.** Match bought HER (May 2025) *and* shut Archer (Jun 2026) *and* bought into Sniffies ($100M, Apr 2026) — the incumbent is buying niches it cannot build. Every niche Match validates by acquisition is a niche a well-built independent can either win first or exit to Match.
7. **The free shadow:** Facebook Dating (all-features-free, social-graph-powered) is "quietly gaining" — a quality entrant must be meaningfully better than free, which argues for deep vertical focus, not generic swipe.

### 6.2 DevSecOps-lens observations (the builder's unfair advantages)

1. **Compliance is the moat — build it as product.** UK OSA age-verify (Jul 25 2025) with £18M/10% fine exposure, the US TAKE IT DOWN Act (signed May 2025, NCII takedown duty), Australia's incoming duty-of-care, EU DSA, GDPR (Grindr's €10M is the tuition others paid). Corpus proof of the cat-and-mouse: Persona photo-based age verification was bypassed with *Death Stranding game-character images*, and VPN downloads spiked post-deadline. A founder who ships verifiable-age, consent-preserving moderation infrastructure on day one holds an asset incumbents assembled painfully over 2025-2026 (Grindr: World-biometrics partnership is Match's Japan pilot; Feeld: biometric verification; Bumble: ID Verified). Note also the federated-identity fight: Grindr's CEO argues app stores should own age checks — aligning with either Apple/Google-age-assertion or World-style credentials early is a strategic choice, not a detail.
2. **The vulnerability class is known and still open: location trilateration.** Grindr 2014 (2M detections), Kyoto 2016 colluding-trilateration, Bumble 2021 (fixed in 3 days, $2,000 bounty — a model of fast response), Bumble+Hinge KU Leuven 2024. Any geo-dating MVP must design distance-bucketing/server-side fuzzing from the first sprint; publishing the design is itself marketing to this corpus's audience.
3. **The incident record is the differentiation narrative.** Jan 2026 campaign hit Match+Bumble simultaneously; Grindr's £26M/€10M history; Bumble's $22.5M auto-renewal settlement; Match's FTC settlement (2025). A startup with a public security posture (transparent VRP like TrulyMadly's page, ISO 27701-style certification like Tinder's, open-sourced safety ML like Bumble's Private Detector) converts incumbents' liabilities into its own top-of-funnel.
4. **Legacy stacks are stranding competitors.** Bumble's 2005-era inherited stack, in-house payments, and physical servers — mid-rewrite during a demand crisis — is the cautionary tale; Grindr's "AI-native terraforming" (2.5× output, same team) and Tinder's Merlin/Cursor/CI-agent toolchain define the 2026 productivity frontier. A greenfield entrant starts cloud-native and AI-augmented by default: that is now table stakes to *keep up*, not a moat.
5. **Platform-risk economics are existential, and incumbents already fought it.** Match co-founded the Coalition for App Fairness (with Spotify/Epic) over the 30% tax; Tinder's store pages show the quid pro quo (ads + IAP + subscription simultaneously); Pure ships to four stores including RuStore — an object lesson in both hedging distribution and the reputational cost of *which* stores you add. Web-first distribution (Sniffies' browser-first model dodges app-store review and the 30% cut entirely, at CSS-sanctions/edge risk) is a live strategic axis a founder must choose deliberately.
6. **Moderation is a human-rights and capacity problem, not a filter.** Bureau of Investigative Journalism 2023: moderators at Bumble/Grindr/Hinge suffering PTSD amid understaffing; Wired coverage same year; HRW 2023 documented state-actor entrapment on Grindr in five countries. Designing moderator tooling and welfare (and advertising it) is both ethically necessary and a hiring/trust advantage.
7. **Privacy-UX micro-features are cheap, visible wins** the niche leaders already ship and the majors mostly don't: screenshot blocking (Feeld chat images; Muzz screenshots+recording; TrulyMadly screenshots+downloads), photo timers/one-view videos (Feeld), incognito (Tinder Plus, Feeld Majestic, Grindr Unlimited), hidden bios (Feeld). None require ML; all generate word-of-mouth in safety-conscious communities.

### 6.3 Monetization realism for the business plan

- **Payer penetration caps near 6.6% industry-wide** (Grindr's 8.4% is the captured best-case; Tinder ~11-14% on conflicting MAU bases). Plan free-tier value accordingly.
- **ARPPU ladder (Q2'26):** Tinder $17.90 → Bumble $21.96 → Match group RPP $21.13 → Grindr $25.51/$26.51 (conflict) → **Hinge $33.11** — the quality positioning out-earns the volume positioning per payer. That is the entire business case for quality-first.
- **The frontier tactics to copy or reject:** weekly subs + $9.99 day passes (Grindr — casual-friendly), invite-only luxury (Tinder Select ~$499, Raya — scarcity pricing), a-la-carte unbundling (Tinder testing standalone See Who Likes You), AI-premium tiers (Grindr gAI/Edge). **The tactics that generate the 1.1-star Trustpilots and the $22.5M settlements:** hidden auto-renewal, dynamic "charge whatever they think you'll pay" pricing, pay-to-see-likes, gray-market leakage (GamsGo recharges at 50-60% of list — a signal of price-sensitivity ceilings).
- **Regional price ladders are real** (Hinge India ₹499 ≈ -69%) — a global niche entrant needs price-partition integrity from day one or imports the gray market.

### 6.4 What the conflicts register tells a founder about data hygiene in this industry

Even the industry's own trackers disagree with themselves (Tinder 60M vs 75M MAU; 75/25 vs 73/27 gender; Grindr ARPPU $26.51 vs $25.51 same quarter; Bumble 2.4M vs 3.2M payers on different scopes). Any business plan citing dating-market numbers should carry ranges with sources and dates — as this report does — because the canonical numbers do not exist.

### 6.5 Honest TAM for a quality-first entrant (prediction-scorecard obligation)

Headline $6.07B is declining and ~54% belongs to Match. The addressable slice for a new quality-first niche product is realistically: (a) disaffected payers leaking from Tinder (10.9M→8.5M subs) and Bumble (3.8M→3.2M payers); (b) the two-thirds of singles currently off-apps (Harris, Sep 2026) who are IRL-oriented — reachable only via hybrid formats; (c) the 40+ cohort. A realistic SOM is thousands-to-low-tens-of-thousands of paying users at Hinge-like ARPPU ($33) before network effects matter — i.e., a $5-40M revenue business at scale, not a $1B one, unless the IRL-hybrid or AI-native format genuinely expands the market. Plan for the former; position for the latter.

### 6.6 Consolidation & Deaths Register (post-2023 restructuring of the field)

| Event | Date | Status / evidence | Sources |
|---|---|---|---|
| Match acquires The League (members-only, admissions-based; founded 2014 by Amanda Bradford) | Jul 12 2022 (undisclosed sum) | Confirmed (internal email via TechCrunch); still listed in Match's Feb 2026 brand list; still reviewed as active in 2026 guides (mindbodygreen 4.1, matches expire 21 days, LinkedIn verification) — full sunset date ❓ (digest's "2025-26" acquisition dating corrected here to 2022) | wiki-match.md, s-league.json, s-deaths.json |
| Match shuts Archer (gay/bi/queer men, launched Jun 2023, verified face pics, AI+human moderation) | Ceases operations Jun 17 2026 | 2-source confirmed (wiki-match.md, s-league.json); rationale: consolidate queer portfolio around Sniffies; "Grindr remains the dominant platform"; Archer users were 6× more likely seeking a husband than a hookup (2025 "Naked Truth" report) | wiki-match.md, s-league.json |
| Match $100M minority stake in Sniffies + option to acquire | Apr 2026 | Confirmed (wiki-match); founder-led independence maintained; WIRED: user fears of "straightification"; becomes Match's primary queer-male asset post-Archer | wiki-match.md, s-league.json |
| Match acquires HER (queer women) | May 2025 | Confirmed (wiki-match citing Bloomberg; Mashable quotes Rascoff: "my No.1 pick for queer women") | wiki-match.md, s-deaths.json |
| Kippo pivots gamer dating → metaverse (Kippo 2.0, Covalent Inc) | ~2021-2025 ❓ | Single-source flag retained (s-deaths.json) | s-deaths.json |
| Match exits Russia (Tinder was #1 there in 2022) | By Jun 30 2023 | Confirmed (wiki-match; Bumble left earlier) | wiki-match.md |
| Bumble impairment regime ($404.9M then $169.3M) | Q2'25, Q2'26 | Confirmed (primary IR) | bmbl-q2.md |
| Match–Muzmatch trademark war (suit Feb 2021) | Won by Match Apr 2022 (London) | Confirmed — incumbent pressure on the Muslim niche; Muzz operates independently today | wiki-match.md |
| Legacy defunct set (context) | various | Wikipedia defunct lists: Blendr, Clover, Huggle, Lumen, S'More, Righter, Chemistry.com, Yahoo Personals, Matchmaker.com et al. | wiki-compare.md, wiki-match.md |
| Facebook Dating "quietly gains" | Sep 22 2026 | Headline-only single source | gdi-home.md |

**Pattern read:** Match is running a buy-the-niche, kill-the-overlap portfolio strategy (buy HER + buy Sniffies + kill Archer + keep League optionality). For a founder: niches are acquirable (good exit liquidity — Match is a proven buyer at $50M-$1.73B scales), but building the *second* app in a niche Match already owns is structurally doomed (Archer's 3-year life is the evidence).

---

## 7. Sources

**Backbone notes (read in full, frame all citation discipline):** `notes/01-master-facts-digest.md`, `notes/verification-pass.md` (both under `independent_research/scratch/research-dating-app-industry-2026-09/scratch/notes/`).

**Corpus files cited in this deliverable** (all under `.../scratch/research-dating-app-industry-2026-09/scratch/pages/`):

- **Market & financial:** businessofapps-market.md, businessofapps-tinder.md, businessofapps-bumble.md, businessofapps-hinge.md, s-mtch-q2.json, bmbl-q2.md, bmbl-press.md, s-grnd.json, gdi-home.md (live tickers Sep 23 2026)
- **App stores & review platforms:** as-tinder.md, gp-tinder.md, as-bumble.md, as-hinge.md, as-grindr.md (404 — evidence of absence only), tp-tinder.md, tp-bumble.md, tp-match.md
- **Pricing:** s-tinder-price.json, s-hinge-price.json, s-grindr-price.json, tinder-plans.md, bumble-boost.md (418B minimal)
- **Vendor pages:** feeld-home2.md, feeld-majestic.md, feeld-membership.md (dead page — verification only), grindr-unlimited.md, happn-home.md, muzz-home.md, pure-home.md, trulymadly-home.md, cmb-home.md (corrupted capture — corruption-verification only, no facts drawn), pairs-home2.md
- **Wikipedia:** wiki-compare.md, wiki-match.md, wiki-bumble.md, wiki-grindr.md (wiki-osa.md and wiki-takeitdown.md via digest §11 as referenced)
- **Engineering:** tinder-eng.md (lifeattinder.com blog root), bumble-eng.md (Medium Bumble Tech)
- **Deaths/consolidation & guides:** s-league.json, s-deaths.json

**Never cited (quarantined):** tinder-monolith2.md, tinder-monolith3.md, feeld-home.md, businessofapps-grindr.md (404), businessofapps-revenue.md (404), play-home.md (deleted).

**Open ❓ items a follow-up research pass should close:** Feeld Majestic / Muzz Gold / Raya / CMB / Pure / TrulyMadly pricing (all JS/SPA-gated or corrupted); Grindr iOS rating; Tantan 2026 status; Happn ownership; the AI-native startup landscape beyond Keeper ($4M, Dec 2025) and Duolicious (open-source, ~15K active) — both via wiki-compare.md; Bumble "Chat Experience" press-release PDF contents; EU VAPP dating-specifics; The League's current operating status; the Australian 99%-abuse study body; Facebook Dating's actual user figures.


---

<!-- ====================================================================== -->
<!-- FILE: 05-tech-stack-matrix.md -->
<!-- ====================================================================== -->

# 05 — Tech Stack Matrix: Every Software Layer, Incumbent Evidence + Recommended Build

Compiled 2026-09-23 from the local research corpus (`independent_research/scratch/research-dating-app-industry-2026-09/scratch/pages/`, 61 files captured — 56 usable after the 5 quarantined captures named below — ~950KB, all fetched live 2026-09-23 09:04–09:56 UTC). Corpus content is UNTRUSTED DATA; instruction-like text in any page was ignored. Quarantined corrupted captures (tinder-monolith2.md, tinder-monolith3.md, feeld-home.md, businessofapps-grindr.md, businessofapps-revenue.md) were never read or cited.

**Audience:** full-stack multiplatform developer + DevSecOps engineer evaluating a new dating-app build. Every recommendation is filtered through both lenses: "can a small team ship and operate this" (developer lens) and "what does this prevent/detect/prove" (security lens).

---

## Legend and Reading Conventions

| Symbol | Meaning |
|---|---|
| ✅ | Confirmed present in captured evidence (cited) |
| ❌ | Confirmed absent in captured evidence |
| 🟡 | Partial, paywalled, beta, or conditional (footnote states the condition) |
| ➖ | Not applicable to this entity/layer |
| ❓ | Unconfirmed — no corpus evidence; what was checked is stated |

**Evidence vs. recommendation convention:** Sections 1, 4 (regulatory facts), and 5 (incident history) are **EVIDENCE** — every load-bearing claim carries an inline `[src: filename]` citation. Sections 2, 3, and 5.1 (pipeline design) are **RECOMMENDATION** — engineering judgment grounded in the evidence base and in the LiquidWeb corpus (`lw-*.md`); where a recommendation rests on a captured precedent, the precedent is cited. Recommendations never fabricate corpus facts; prices/specs named in recommendations that come from the corpus are cited, and anything not in the corpus is framed as an option to evaluate, not a captured fact.

**Conflicts policy:** Where corpus sources disagree (registered in digest §15), BOTH values are stated with sources. Nothing is averaged; neither side is silently picked.

---

## 1. Evidenced Incumbent Stacks

What the incumbents actually run is mostly proprietary. Three of them leak enough signal to document: Tinder (engineering blog inventory), Bumble (journalism + IR filing + Medium publication tags), Grindr (journalism + investor materials). Hinge, Feeld, CMB, Muzz, Raya, and the rest disclose essentially nothing about their stacks — ❓ throughout.

### 1.1 Tinder — the deepest public engineering signal

Evidence status: blog-listing summaries only. The engineering blog root (tech.gotinder.com → lifeattinder.com/blog) was captured as an inventory of post titles and summaries; deep renders of individual posts failed this session, so specifics below are **title/summary-level evidence** — the topic is confirmed to exist at Tinder, implementation detail is not captured [src: tinder-eng.md; digest §1, §15.8].

| Evidence item (title/summary level) | What it proves about Tinder's stack | Layer | Status |
|---|---|---|---|
| Monolith decomposition program | Tinder started as a monolith and has an ongoing decomposition effort — the canonical scaling story for this product category | Backend architecture | ✅ [src: tinder-eng.md] |
| In-house Elasticsearch scoring plugin written in Java | Matching relevance runs through a customized Elasticsearch, with scoring logic owned in-house; summary language: scoring algorithms that are "complex, observable, efficient and testable" | Search/recommendation | ✅ [src: tinder-eng.md] |
| Elasticsearch 8 migration post | Active ES version management (relevance infra treated as living system) | Search/recommendation | ✅ [src: tinder-eng.md] |
| Dedicated ML team posts (abuse detection, stream sequencing) | Standing ML org for integrity + feed ordering, not just ad-hoc models | ML/AI | ✅ [src: tinder-eng.md] |
| Recommendation embeddings research (AI Day project, Recommendations × Consumer Research) | Embedding-based retrieval/ranking explored with consumer-research validation | ML/AI | ✅ [src: tinder-eng.md] |
| VLM pairwise photo ranking | Vision-language models used to rank profile photos | ML/AI | ✅ [src: tinder-eng.md] |
| On-device AI photo selection | On-device inference shipped for a user-facing feature (privacy + latency tradeoff accepted) | Client ML | ✅ [src: tinder-eng.md] |
| LLM feature hardening post ("When Your Model Hates Helicopters") | LLM features shipped and hardened against prompt/output failure; hybrid Smart Photo system referenced | ML/AI | ✅ [src: tinder-eng.md] |
| Unified API style guide (Parts 1 & 2), Protobuf-governed | API governance: fragmented data models consolidated under a versioned style guide with Protobuf as the contract format | API layer | ✅ [src: tinder-eng.md] |
| GitHub Actions + AWS OIDC misconfiguration research | Security team researches CI/CD supply-chain risk — evidence the pipeline is GHA-based and cloud is AWS-flavored | CI/CD + Cloud | ✅ [src: tinder-eng.md] |
| URLScan mitigation post (sensitive-link handling) | Link-scanning/SSRF-class mitigations documented publicly | App sec | ✅ [src: tinder-eng.md] |
| ISO/IEC 27701:2019 certification post | Privacy information management certification pursued and publicized | Compliance | ✅ [src: tinder-eng.md] |
| AI unit-test agent in CI ("Undercover Agent") | LLM agents embedded in the build pipeline to author unit tests | CI/CD + AI | ✅ [src: tinder-eng.md] |
| Merlin harness around AI coding agents | Guardrails/evaluation harness around AI coding tools — AI-assisted development is institutionalized | Dev tooling | ✅ [src: tinder-eng.md] |
| Cursor + Xcode 26 migration post | Commercial AI coding tools in active use across the iOS org | Dev tooling | ✅ [src: tinder-eng.md] |
| Ignis dev-loop tool | Internal developer-experience tooling investment | Dev tooling | ✅ [src: tinder-eng.md] |
| Obsidian design system | Cross-platform design system investment | Client/UI | ✅ [src: tinder-eng.md] |
| Emerge tooling: localization size −95% | Binary-size/app-performance instrumentation in the release process | Release eng | ✅ [src: tinder-eng.md] |
| Open-source contributions program | Public repos exist — secondary stack signal for any prospective competitor to mine | Cross | ✅ [src: tinder-eng.md] |
| CTO Tom Jacques (talk listing) | Engineering leadership is public-facing | Org | ✅ [src: tinder-eng.md] |

Operational liveness signals: Google Play listing shows Tinder actively shipping (last update Sep 21, 2026, ~9.2M reviews visible, "Contains ads — In-app purchases") [src: gp-tinder.md]; App Store capture shows ratings/adjacency but the IAP price list is JS-gated in the capture [src: as-tinder.md].

Developer-lens takeaway: Tinder's public trajectory is the industry's reference architecture — monolith → decomposed services, relational core + customized search/relevance layer, standing ML org for matching AND abuse, contract-first APIs (Protobuf), GHA-based CI with an in-house security research arm, and now AI-assisted development treated as infrastructure (test-agent in CI, harness around coding agents). DevSecOps-lens takeaway: the two security posts that exist are exactly the two things a new entrant gets wrong first — CI/CD identity (OIDC) and outbound-link handling.

### 1.2 Bumble — legacy stack in active replacement

Bumble is the industry's cautionary tale and its most instructive rewrite case.

| Evidence item | Detail | Layer | Status |
|---|---|---|---|
| Legacy stack dates to 2005 (Badoo partnership) | The Observer (Dec 18, 2025) reported Bumble relies on a legacy technology stack first built in 2005 due to the Badoo partnership; includes an **in-house payment system** and **physical servers** maintained by Bumble employees | Backend, payments, infra | ✅ [src: wiki-bumble.md] |
| "Bumble 2.0" full rewrite ordered | Upon Whitney Wolfe Herd's return as CEO she ordered a rebuild — the app to be rewritten from scratch | Backend + client | ✅ [src: wiki-bumble.md] |
| Q2 2026: platform migration completing | Wolfe Herd (Q2'26 IR release): "we are **completing our platform migration**, transforming our matching algorithms, giving members new ways to start a conversation... all converging into the reimagined Bumble" | Backend + matching | ✅ [src: bmbl-q2.md] |
| CFO on deliberate tech investment | Kevin Cook: results at "higher end or above our guidance ranges... deliberately investing across product, technology, and brand" | Org/budget | ✅ [src: bmbl-q2.md] |
| Medium engineering publication tags | Publication describes itself as "the tech team behind Bumble and Badoo"; captured tags: Android, iOS, JavaScript, PHP, QA, Data Science, MLOps; 3.6K followers; Lever jobs link | Client, backend (PHP signal), ML | 🟡 thin capture (3.4KB root only; tag-level signal, no post bodies) [src: bumble-eng.md] |
| Private Detector (2019) | AI image classifier detects and blurs nude images automatically; user chooses view/block/report. **Open-sourced October 2022** — the only incumbent moderation model a competitor can directly reuse | Moderation ML | ✅ [src: wiki-bumble.md] |
| Deception Detector (Feb 2024) | ML model flags fake/spam profiles; Bumble's testing: blocked **up to 95%** of identified spam/scam accounts automatically | Trust & safety ML | ✅ [src: wiki-bumble.md] |
| "Wingman" AI chatbot | In development as of Aug 2024 to help users flirt/converse | LLM feature | 🟡 in development [src: wiki-bumble.md] |
| AI-generated profiles prohibited | Policy + report mechanism for AI fake profiles | Policy/moderation | ✅ [src: wiki-bumble.md] |
| Photo verification (Sep 2016) | Pose-selfie reviewed by a real human; first US dating app with photo verification; ID-verification option added 2025 | Identity | ✅ [src: wiki-bumble.md] |
| In-app voice + video calls (Jun 2019) | Realtime media in-app (no phone-number exchange); +84% video calls during COVID | Realtime | ✅ [src: wiki-bumble.md] |
| Third-party AI licensing risk factor | 10-K-style risk factor: "challenges with properly managing the use of artificial intelligence, including **risks from utilizing AI technology licensed from third parties**" | Governance | ✅ [src: bmbl-q2.md] |
| Jan 2026 cyberattack | Part of the Match/Panera/CrunchBase campaign (Bloomberg); Bumble states intruders did NOT reach member database, accounts, DMs, or profiles | Security incident | ✅ [src: wiki-bumble.md] |
| Badoo lineage | Bumble Inc. also owns Badoo — 500M registered, web + 12 platforms per comparison table — the shared 2005-era platform explains the legacy burden | Corporate/infra | ✅ [src: wiki-compare.md, wiki-bumble.md] |

The PHP + JavaScript Medium tags are the only captured language-level signal for the Badoo-family backend [src: bumble-eng.md]; treat as 🟡 tag-level evidence, not confirmed current state — especially given the in-flight "Bumble 2.0" rewrite. What Bumble 2.0's target stack IS: ❓ not disclosed in any captured source (checked: wiki-bumble.md, bmbl-q2.md, bumble-eng.md).

Founder takeaway (both lenses): the 2005-era stack — in-house payments on physical servers — is what a 20-year head start buys you as *debt*. Bumble is spending two consecutive impairment-heavy quarters' worth of organizational energy ($169.3M Q2'26 impairment; $404.9M Q2'25 [src: bmbl-q2.md]) on the migration. A new entrant's entire architectural advantage is starting after this lesson: buy payments (never build), rent infrastructure (never rack), and keep the rewrite reflex unnecessary by decomposing from day one.

### 1.3 Grindr — the "AI-native organization" bet

Grindr is the smallest of the majors by users but the most aggressive AI-adopter, and it monetizes that stack directly.

| Evidence item | Detail | Layer | Status |
|---|---|---|---|
| "Terraforming Grindr into an AI-native organization" | CEO George Arison's framing in Q2'26 investor materials | Strategy | ✅ [src: s-grnd.json] |
| Engineering output ~2.5× | Engineering output roughly 2.5× from Jul 2025 to Apr 2026 at constant team size (CNBC-reported); churn from AI features "lower than expected" | Dev productivity/AI | ✅ [src: s-grnd.json] |
| gAI ("gay-eye") | Tested 2025: **six AI features** intended for a premium version | ML/AI product | ✅ [src: wiki-grindr.md] |
| Edge premium tier | New premium tier targeting 0.5–1% of MAU; called the primary 2027 growth driver in Q1'26 materials | Monetization | 🟡 single-source family (s-grnd.json search results; investor-materials-derived) |
| FY2025 fundamentals | Revenue $440M, net income $94.8M (Form 10-K); users: ~13.5M MAU (Sep 2023 figure, wiki) vs 8M users (FY25 10-K basis) — both carried | Scale | ✅ [src: wiki-grindr.md, digest §6] |
| FY2026 trajectory | Q1'26 $130M +38%; Q2'26 $138M +33% (NI $18M, EBITDA $58M/42% margin); FY26 guidance ≥$535M, later ~$540M/EBITDA ~$232M; payers 1.4M +16%; direct revenue $366.30M +25.92%; 8.40% payer penetration; revenue/employee above big-tech benchmarks | Scale/monetization | ✅ [src: s-grnd.json] — note: consistent with, but a different source than, the 10-K FY25 figure (conflict #7 below) |
| ARPPU conflict | $26.51 +12% (powerdrill) vs $25.51 +12% (CNBC) vs $24.25 +7.63% (koalagains) — three values from the same search-results corpus; carried, not averaged | Metrics | CONFLICT [src: s-grnd.json] |
| Age-verification integration | UK age verification introduced Jul 2025 (OSA); no US verification (Section 230); Arison advocates app-store-based verification; ~7% UK MAU lost to the requirement; ~400k user headwind from age-assurance + Malaysia/Indonesia repression combined | Identity/compliance | ✅ [src: wiki-grindr.md, s-grnd.json] |
| User headwind | ~400k users from age-assurance requirements + Malaysia/Indonesia market pressure | Compliance cost | ✅ [src: s-grnd.json] |
| Security incident history | 2020 password-reset account takeover (email-only); €10M Norway GDPR fine (data to ≥135 advertisers; Jan 2020 Norwegian Consumer Council report, fine imposed on DPA review — fine date not captured); £26M UK High Court settlement Sep 2026 (12,000 users; covert tracking + HIV-status sharing with third-party analytics); 2014/2016 trilateration location attacks; user location data sold via ad networks 2017–2020 | Security | ✅ [src: wiki-grindr.md] |
| At-risk-country protections (Dec 2019) | Auto-disable distance feature + security features in countries where LGBTQ users are at risk | Safety features | ✅ [src: wiki-grindr.md] |
| Grindr Web | Desktop web client: free Nov 2019 → relaunched May 2023 limited to XTRA and Unlimited subscribers | Client platforms | ✅ [src: wiki-grindr.md] |
| Patents page exists | grindr.com footer lists a Patents page — IP-protected matching/delivery mechanics | IP | ✅ [src: grindr-unlimited.md] |

Developer-lens takeaway: Grindr is the proof that AI-assisted engineering is a headcount multiplier at incumbent scale — 2.5× output at constant team size is the number a founder should quote to investors [src: s-grnd.json]. DevSecOps-lens takeaway: Grindr's regulatory bill — €10M + £26M — is the quantified cost of treating data-flow hygiene and third-party SDK egress as an afterthought (see threat model, §5.2).

### 1.4 Match Group corporate, Hinge, and the rest

| Entity | Captured stack signal | Status |
|---|---|---|
| Match Group corporate | Q2'26 revenue $853M −1%, EPS $0.92 miss, Adj EBITDA $331M/39% margin; Tinder $457M −1%, Hinge $204M +22%, E&E $179M −17% [src: s-mtch-q2.json]. Jan 28, 2026 cyberattack — "limited amount of user data" affected [src: wiki-match.md]. CEO Spencer Rascoff (2 sources; BoA's Bernard Kim listing is stale) [src: tinder-eng.md, gdi-home.md per digest §7]. | ✅ financials/incident; stack ❓ |
| Hinge | Fastest-growing major ($689M 2025 +25%; payers 1.95M; Q2'26 $204M +22%) [src: businessofapps-hinge.md, s-mtch-q2.json]. Zero public stack disclosure in corpus (checked: businessofapps-hinge.md, as-hinge.md, s-hinge-price.json — all product/pricing captures). CTO Ben Celebicic named [src: businessofapps-hinge.md]. | ❓ stack |
| Archer (Match, shut Jun 2026) | "Uses AI and human moderation to verify profiles" — the one captured Match-portfolio moderation-architecture statement; grid-style layout [src: wiki-match.md]. Shut down June 2026, <3 years after Jun 2023 launch — an architecture that didn't save the product [src: wiki-match.md]. | ✅ (historical) |
| Feeld | Majestic membership exists, price JS-gated ❓; use feeld-home2.md not quarantined feeld-home.md [src: feeld-majestic.md, digest §9]. Stack ❓. | ❓ |
| OkCupid | Phone verification required (comparison-table evidence) [src: wiki-compare.md]. Stack ❓. | ✅ that one control; ❓ stack |
| Coffee Meets Bagel | "Beans" virtual-currency monetization; ~$35/mo 2017-era figure in comparison table; current pricing ❓ SPA-gated [src: wiki-compare.md, digest §9]. Stack ❓. | 🟡 |
| Badoo | 500M registered; web + 12 platforms [src: wiki-compare.md]. Shares the 2005 Badoo-family legacy stack burden (see §1.2). | 🟡 |
| Sniffies | Browser-based (no native app) — the notable web-only delivery model; Match took a $100M minority stake Apr 2026 [src: wiki-compare.md, wiki-match.md]. Stack ❓. | ✅ delivery model |
| Duolicious | **Open-source, AGPLv3**, ~15k active users — the only fully inspectable dating-app codebase in the corpus; a free architectural reference for any entrant [src: wiki-compare.md]. | ✅ |
| Keeper | LLM-based matchmaking positioning; 1.6M users — the captured AI-native startup exemplar (funding/raise amount not captured ❓) [src: wiki-compare.md]. | ✅ |
| Grindr + Adam4Adam | STD-notification features (2018) — health-integration precedent [src: wiki-compare.md]. | ✅ |

### 1.5 Cross-incumbent capability matrix (captured evidence only)

| Capability | Tinder | Bumble | Grindr | Hinge | Feeld |
|---|---|---|---|---|---|
| Custom search/recommendation infra | ✅ ES + Java plugin [src: tinder-eng.md] | 🟡 "transforming our matching algorithms" (in progress) [src: bmbl-q2.md] | ❓ | ❓ | ❓ |
| Standing ML team / published ML work | ✅ [src: tinder-eng.md] | ✅ Private/Deception Detector + MLOps tag [src: wiki-bumble.md, bumble-eng.md] | ✅ gAI six features [src: wiki-grindr.md] | ❓ | ❓ |
| Open-sourced AI/moderation code | ❌ (OSS contributions exist generally, none cited as AI models) [src: tinder-eng.md] | ✅ Private Detector (Oct 2022) [src: wiki-bumble.md] | ❌ | ❓ | ❓ |
| LLM chat features | 🟡 LLM hardening research post [src: tinder-eng.md] | 🟡 wingman in dev [src: wiki-bumble.md] | ✅ gAI premium [src: wiki-grindr.md] | ❓ | ❓ |
| AI-premium monetization tier | 🟡 Select ~$499/mo invite-only (not AI-branded) [src: s-tinder-price.json] | ❌ (none captured) | ✅ gAI + Edge [src: wiki-grindr.md, s-grnd.json] | ❌ | ❓ |
| Photo verification | ✅ Photo Verification + Face Check (select markets) [src: tinder-plans.md] | ✅ since 2016, human-reviewed; ID-verify 2025 [src: wiki-bumble.md] | 🟡 UK age verification (compliance, not profile photo verification) [src: wiki-grindr.md] | ❓ | ❓ |
| In-app voice/video | ❓ (not captured) | ✅ Jun 2019 [src: wiki-bumble.md] | ✅ (video call in profile-view description) [src: wiki-grindr.md] | ❓ | ❓ |
| Desktop/web client | ❓ (not captured) | ❓ (not captured) | ✅ Grindr Web (XTRA/Unlimited-gated) [src: wiki-grindr.md]; Badoo web ✅ [src: wiki-compare.md] | ❌/❓ | ❓ |
| Published API style guide | ✅ Protobuf-governed, 2 parts [src: tinder-eng.md] | ❌ | ❌ | ❓ | ❓ |
| CI/CD security research | ✅ GHA + AWS OIDC [src: tinder-eng.md] | ❌ | ❌ | ❓ | ❓ |
| Privacy certification | ✅ ISO/IEC 27701:2019 [src: tinder-eng.md] | ❓ | ❓ | ❓ | ❓ |
| Known location-privacy incident | ❓ (none captured) | ✅ Heaton 2021 trilateration ($2,000 bounty, fixed in 3 days); KU Leuven 2024 [src: wiki-bumble.md] | ✅ 2014 + 2016 trilateration [src: wiki-grindr.md] | ✅ KU Leuven 2024 study included Hinge [src: wiki-bumble.md] | ❓ |

Sources: tinder-eng.md, bumble-eng.md, wiki-bumble.md, wiki-grindr.md, wiki-compare.md, wiki-match.md, bmbl-q2.md, s-grnd.json, s-mtch-q2.json, tinder-plans.md, s-tinder-price.json, businessofapps-hinge.md, feeld-majestic.md, grindr-unlimited.md, gp-tinder.md, as-tinder.md.

---

## 2. Recommended Stack for a New Entrant (Layer by Layer)

RECOMMENDATION section. Each layer gives an options table (choice / pros / cons / cost shape / verdict), grounded where possible in captured incumbent evidence (cited) and the LiquidWeb corpus (cited). Pricing philosophy follows the captured industry pattern: 3–4 subscription tiers + weekly options + a-la-carte boosts + top invite-only tier, with dynamic pricing experiments documented at Tinder and Hinge [src: s-tinder-price.json, s-hinge-price.json].

The workload that drives every layer choice below is the **swipe+match loop**: read-heavy profile-deck serving (geospatially scoped, personalized ranking), write-light swipes, sparse but hard-latency match events, then long-lived chat sessions. This is a different shape from a CRUD SaaS: the hot path is ranked retrieval over a filtered user population, which is why the data layer (2.3) and ML layer (2.5) dominate the architecture.

### 2.1 Client layer

| Option | Pros | Cons | Cost shape | Verdict |
|---|---|---|---|---|
| Native Swift + Kotlin | Best perf for gesture-heavy swipe UI; direct access to on-device ML (Tinder ships on-device AI photo selection — precedent that native clients host models [src: tinder-eng.md]); platform APIs (push, IAP, biometrics) first-class | Two codebases, two release trains; slower iteration | 2 mobile engineers min | Best final quality; only if team ≥4 mobile devs |
| React Native (Expo) | One codebase; OTA-style iteration; matches "full-stack multiplatform" founder profile; Emerge-class size problems manageable | Bridge/perf risk in 60fps swipe decks + chat; native modules still needed for camera/ML | 1–2 engineers ship both platforms | **Recommended default** for 0→100k users |
| Flutter | Excellent scroll perf; consistent UI; strong single-codebase story | Dart talent pool smaller; some dating-specific SDKs (e.g., specific moderation/verification SDKs) need bridges | 1–2 engineers | Strong second choice; pick by team familiarity |
| Web-first (PWA) | Sniffies proves browser-only delivery is viable in this market [src: wiki-compare.md]; evades app-store commission on web checkout (see §2.7, §4.1); no review-gate latency | No app-store distribution/ASO; push + payments friction on iOS web; swipe-deck UX ceiling | Cheapest | Recommended as **companion** web client from day one (checkout + safety-center + SEO), not the primary client |
| Desktop client | Grindr Web precedent: gated to top tier [src: wiki-grindr.md] | Niche | Small | Defer; ship as premium web feature post-PMF |

Client-side constants regardless of framework: (1) a design system from day one — Tinder's Obsidian system exists because retrofitting consistency is expensive [src: tinder-eng.md]; (2) localization hooks from day one — Tinder's −95% localization-size win shows how badly this decays if ignored [src: tinder-eng.md]; (3) binary-size/perf budget in CI (Emerge-class tooling precedent [src: tinder-eng.md]).

### 2.2 API layer

| Option | Pros | Cons | Cost shape | Verdict |
|---|---|---|---|---|
| Node.js/TypeScript (NestJS/Fastify) | Shares language with RN client; huge ecosystem; fast iteration | CPU-bound ranking must live elsewhere (search layer anyway); PHP/JS is the Badoo-family legacy signal — fine at small scale, but keep the core typed and tested [src: bumble-eng.md] | Cheap dev velocity | **Recommended** for product/API tier |
| Go | Great concurrency for fan-out (notification storms, deck assembly); single static deploys fit small VPS footprints [src: lw-cloud-vps.md context] | Second language for the team | Cheap infra | Recommended for hot-path services at 10k+ DAU |
| Java/Kotlin (JVM) | Direct lineage to Tinder's ES scoring plugin in Java — the relevance-tier language of record in this industry [src: tinder-eng.md] | Heavier ops for a small team | Moderate | Adopt only for the search/scoring tier if custom ES plugins are built (post-100k DAU) |
| PHP/Laravel | Badoo-family heritage [src: bumble-eng.md]; fast CRUD | The exact stack Bumble is spending "Bumble 2.0" escaping [src: wiki-bumble.md] | Cheap | Not recommended as core; the captured industry lesson is against it |
| Python (FastAPI) | Natural ML-adjacency (serving, feature plumbing) | Weaker for high-concurrency API tier | Cheap | Recommended for ML-serving tier only, not the main API |

Recommended composite: TypeScript API tier (product) + Go hot-path services (deck/match) + Python ML-serving — three languages, but each at its natural layer; contract-first with Protobuf schemas from day one, copying Tinder's unified-API-governance lesson (their style guide exists because model fragmentation hurt them) [src: tinder-eng.md].

### 2.3 Data layer (the swipe+match core)

| Component | Recommended choice | Why (evidence-tied) | Cost shape |
|---|---|---|---|
| Primary OLTP DB | PostgreSQL (managed or self-hosted on LW with remote access IP-whitelisted and disabled by default — the LW docs explicitly treat remote DB access as a risk to whitelist per-IP, firewall-gate on 3306-class ports) | Relational fit for users/matches/subscriptions; LW corpus shows remote-DB hardening workflow (cPanel/Plesk whitelisting) [src: lw-remote-db.md] | Cheap at 0–10k DAU |
| Cache/session | Redis (LW corpus covers memcached as the cache concept baseline; Redis is the superset choice for rate-limits + sessions + pub/sub) [src: lw-caching.md] | Swipe counters, like quotas (Hinge's 8 likes/day free quota is a captured industry mechanic [src: s-hinge-price.json]) need atomic counters | Cheap |
| Search/recommendation | OpenSearch/Elasticsearch from ~10k DAU; the industry answer to deck ranking is customized ES — Tinder owns a Java scoring plugin in-house precisely because off-the-shelf relevance was insufficient [src: tinder-eng.md] | Ranked retrieval over filtered populations; only layer where you should plan to own custom scoring eventually | Moderate; the first "real" infra line item |
| Geospatial | PostGIS for proximity at small scale; grid-tile pre-bucketing at scale. Grindr's cascade (browse profiles sorted by distance [src: wiki-grindr.md]) defines the geosocial pattern; **never expose raw distance** — see trilateration threat (§5.2, Grindr 2014/2016 [src: wiki-grindr.md]; Bumble 2021 [src: wiki-bumble.md]) | Location is both the product and the #1 privacy attack surface | Included in Postgres until scale |
| Blob/photo storage | Object storage + CDN in front (LW CDN docs: edge PoPs cache static content, slash origin load [src: lw-cdn.md]; Nexcess CDN and Cloudflare both documented options there) | Photos dominate bytes; profile-photo ranking (Tinder VLM precedent [src: tinder-eng.md]) wants predictable fetch latency | Scales linearly with users |
| Analytics DB | Columnar (ClickHouse-class) post-10k DAU | Funnel/AB analysis at scale; defer at start | Moderate |

Postgres-first is the deliberate bet: at 0–10k DAU a single well-tuned Postgres + Redis serves the entire loop; the captured incumbents' complexity (Tinder's decomposition, Bumble's rewrite) is a consequence of scale accumulated on early-2000s foundations, not a starting requirement [src: tinder-eng.md, wiki-bumble.md].

### 2.4 Realtime chat layer

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| WebSockets over Node/Go service + Redis pub/sub | Simple; matches stack; Bumble's in-app voice+video since 2019 shows chat+media is table stakes [src: wiki-bumble.md] | You own delivery/Presence/reconnect | **Recommended 0→100k** |
| Managed realtime (Pusher/Ably-class) | Zero ops | Cost scales per-message; sensitive-message routing through third party (Grindr's €10M fine is the cautionary tale on third-party data flows [src: wiki-grindr.md]) | Acceptable at start; exit-plan by 10k DAU |
| MQTT | Battery-friendly mobile push model | More infra to own | Defer |
| E2E-encrypted chat | Regulatory tension is now live: TAKE IT DOWN criticism notes 48h-takedown may pressure providers to break E2E [src: wiki-takeitdown.md]; OSA/Ofcom E2E clash documented [src: wiki-osa.md] | Complexity + moderation blind spots | **Recommended (Signal-class, per-conversation)** for DMs — both a safety differentiator and a defense against the data-exfil class of incident (§5.2); accept the moderation tradeoff knowingly and document the good-faith position |

Presence + typing indicators + read receipts are captured premium features (Grindr Unlimited: typing status, Viewed Me [src: grindr-unlimited.md]) — design the event model to gate them by subscription tier from day one.

### 2.5 ML/AI layer

Three distinct ML workloads — do not conflate them:

| Workload | Build vs buy | Evidence anchor | Staged plan |
|---|---|---|---|
| Matching/ranking | BUY infrastructure (OpenSearch ranking functions) → BUILD features → BUILD embeddings only post-PMF | Tinder: in-house ES Java scoring plugin + recommendation-embeddings research + dedicated ML team [src: tinder-eng.md]; Bumble: "transforming our matching algorithms" mid-migration [src: bmbl-q2.md] | 0 DAU: recency+proximity+activity heuristics; 10k: learned feature weights; 100k+: embedding retrieval |
| Moderation classifiers (nude imagery, scam profiles) | BUY-to-start: **Private Detector is open source (Oct 2022)** — deploy it rather than training an NSFW classifier [src: wiki-bumble.md]; Deception Detector's 95% auto-block rate is the performance benchmark to beat/buy [src: wiki-bumble.md] | Both are captured Bumble systems; the open-source one is directly reusable | Day one: Private Detector OSS + keyword rules + human review queue; later: custom scam classifier |
| LLM features (chat assist, profile writing, photo feedback) | BUY API (foundation-model license) with strict vendor-risk governance | Bumble's own risk factor names "risks from utilizing AI technology licensed from third parties" [src: bmbl-q2.md]; Tinder's "When Your Model Hates Helicopters" documents LLM-hardening cost [src: tinder-eng.md]; Grindr monetizes six AI features as gAI [src: wiki-grindr.md]; Keeper is LLM-matchmaking-native [src: wiki-compare.md] | Start: none or one well-guarded feature behind eval harness (Merlin-harness precedent [src: tinder-eng.md]); monetize later as premium tier (gAI/Edge precedent [src: wiki-grindr.md, s-grnd.json]) |

Prompt-injection and output-filtering budgets belong in the LLM feature plan from day one — Tinder needed a public hardening post to institutionalize this [src: tinder-eng.md]. On-device inference for photo selection is the privacy-friendly pattern worth copying at scale [src: tinder-eng.md].

Human moderation is not optional at any stage: Bumble's 2023 Bureau of Investigative Journalism finding (moderator PTSD/anxiety, understaffing, productivity targets [src: wiki-bumble.md]) plus the captured 99%-of-women-report-abuse headline [src: gdi-home.md] mean the queue, the reviewer-welfare tooling, and the appeal flow are product infrastructure, not afterthoughts.

### 2.6 Push notifications

| Option | Verdict |
|---|---|
| FCM (Android) + APNs (iOS) direct | **Recommended** — free tiers, no per-send vendor tax; match notifications are the retention heartbeat (captured behavior: Tinder users log in ~4×/day, dated SurveyMonkey figure [src: businessofapps-tinder.md]) |
| OneSignal-class vendor | Fine at 0→10k for speed; egress review required — every third-party SDK is a data-flow to govern (Grindr's 135-advertiser fine is the extreme case [src: wiki-grindr.md]) |
| Scheduled digests via cron | LW corpus documents cron job scheduling directly (cron.daily/hourly/weekly dirs, crontab workflow) for digest batch jobs [src: lw-cron.md] |

### 2.7 Payments layer

**Never build in-house payments.** This is the single clearest captured lesson: Bumble's 2005-era stack carries an *in-house payment system on physical servers* [src: wiki-bumble.md] — and Bumble separately paid **$22.5M (2020)** settling auto-renewal/consent claims [src: wiki-bumble.md]. Buying doesn't remove the compliance burden; it removes the plumbing burden.

| Channel | Mechanics (captured) | Verdict |
|---|---|---|
| Apple IAP / Google Play Billing | Mandatory for in-app digital purchases; Tinder's Play listing text is the canonical auto-renewal disclosure pattern: charged to Google Play account, renewal within 24h before period end, cancel anytime in settings, no mid-period cancellation [src: gp-tinder.md] | **Required** for in-app subs; implement receipt validation server-side (the $22.5M settlement class is what sloppy renewal/consent flows cost) |
| Web checkout (Stripe-class) | The end-run: subscription purchased on the web client (§2.1) avoids store commission; both stores permit external-link/web purchase mechanics for digital goods subject to evolving rules — verify current policy at build time (❓ store-policy specifics not captured in corpus beyond listings) | **Recommended day one** via the PWA/web client; Sniffies' browser-only model is the extreme version of this economics [src: wiki-compare.md] |
| Virtual currency | CMB "Beans" precedent [src: wiki-compare.md] | Defer; adds regulatory/accounting complexity |
| One-time IAP consumables | Captured industry pattern: a-la-carte Boosts (Grindr $11.99 [src: s-grindr-price.json]; Bumble Boost $15.99/mo [src: s-hinge-price.json cross-capture]; Tinder a-la-carte testing of See Who Likes You/Passport [src: s-tinder-price.json]) | **Recommended** — boost consumables are captured revenue at every major |

Tier-ladder design (captured norms to replicate): 2–3 paid tiers (Hinge+ $29.99 / HingeX $49.99 [src: s-hinge-price.json]; Grindr XTRA $22.99/mo / Unlimited $44.99/mo [src: s-grindr-price.json]; Tinder Plus/Gold/Platinum $24.99/$39.99/$49.99 [src: s-tinder-price.json]) + **weekly** options where churn is high (Grindr $14.99/wk XTRA, $27.99/wk Unlimited, $9.99 Day Pass [src: s-grindr-price.json]; Tinder weekly $12.99–$24.99 [src: s-tinder-price.json]) + invite-only top tier (Tinder Select ~$499/mo [src: s-tinder-price.json]) + AI-premium tier once AI features exist (gAI, Edge [src: wiki-grindr.md, s-grnd.json]). Caution on dynamic pricing: it is documented industry practice (Tinder "charge you whatever they think you'll pay" [src: s-tinder-price.json]; Hinge pricing "differs based on your age, region, device" [src: s-hinge-price.json]) AND litigation exposure (Tinder's $60.5M California age-discrimination suit over age-based pricing; Tinder publicly committed to eliminating age-based pricing by end of Q2 [src: s-tinder-price.json]). Use cohort/device/region experiments; do NOT price on protected attributes.

### 2.8 Analytics & experimentation

| Need | Recommendation | Evidence anchor |
|---|---|---|
| Product analytics | Self-hosted (PostHog-class) at start — keeps sensitive event data in-house (data-minimization as posture; Wikimedia's OSA-adjacent identity-check rejection on data-minimisation grounds is the captured norm argument [src: wiki-osa.md]) | Grindr ad-SDK data-sale history is the counterexample [src: wiki-grindr.md] |
| A/B experimentation | In-house flag system → platform later | Dynamic pricing + tier testing is captured norm at Tinder/Hinge [src: s-tinder-price.json, s-hinge-price.json] |
| Attribution/ASO | Store consoles + a web funnel | Tinder remains most-downloaded 2025 [src: businessofapps-market.md] — distribution is the battleground |

### 2.9 Observability

| Component | Recommendation | Grounding |
|---|---|---|
| Metrics/logs/traces | OpenTelemetry everywhere; Grafana+Prometheus/Loki stack self-hosted on LW | LW portal ships built-in server monitoring dashboards (monitoring tab, bandwidth/CPU/storage visibility) [src: lw-vps-infra.md] — start there, add app-level telemetry immediately |
| Uptime/alerting | LW monitoring services with a dedicated alert-response team for fully-managed servers is a documented LW support scope [src: lw-support-levels.md]; layer external synthetic checks for the API | Cheap |
| Error tracking | Sentry-class self-host or SaaS | — |
| SLOs | Match-notification latency (business-critical event), deck-assembly p95, chat-delivery p95 | The swipe+match loop defines them |

### 2.10 Security tooling (DevSecOps lens)

| Control area | Recommendation | Captured precedent mapping |
|---|---|---|
| Identity/age assurance vendor | Persona-class photo-based estimation + document fallback; KWS and Persona both captured as industry choices (Reddit uses Persona; Bluesky uses KWS [src: wiki-osa.md]) | Persona photo-estimation was bypassed with game-character images [src: wiki-osa.md] — so: estimation for UX, document/ID for high-assurance; Grindr's UK rollout lost ~7% UK MAU [src: wiki-grindr.md] — budget the churn |
| Secrets management | Vault-class or LW-credentials + env-sealed secrets; NO secrets in CI env vars past branches | Tinder's GHA+AWS OIDC research is the CI-identity cautionary corpus [src: tinder-eng.md] |
| SAST/DAST/dependency scanning | Semgrep + OWASP ZAP + OSV/SBOM in CI | — |
| Privacy certification | ISO/IEC 27701:2019 as the target badge | Tinder holds it and publicizes it [src: tinder-eng.md] — trust signals sell in this market |
| WAF/DDoS | LW Cloud Firewall + CSF dual layer (LW docs recommend BOTH software CSF and Cloud firewall; default-closed ports; presets for fleet consistency; change SSH port against mass attacks [src: lw-firewall.md]); CSF-based DDoS mitigation documented in LW corpus [digest §14] | — |
| Backups | Acronis Cyber Backups: off-server, file-level/full/app-aware, ransomware protection, bare-metal restore, encryption option, self-service restore portal [src: lw-acronis.md] | The Jan 2026 Match/Bumble campaign [src: wiki-match.md, wiki-bumble.md] makes tested restores mandatory |
| Data-subject rights tooling | Export/delete endpoints from day one; CCPA "Do Not Sell/Share" link (Grindr footer precedent [src: grindr-unlimited.md]); consumer-health-data policy pages (Tinder + Grindr footers [src: tinder-plans.md, grindr-unlimited.md]) | Grindr's GDPR/£26M history is what unmanaged data flows cost [src: wiki-grindr.md] |

### 2.11 Staged infrastructure plan (grounded in LiquidWeb corpus)

Baseline from digest §14: LiquidWeb Managed VPS — AlmaLinux 9.8, cPanel/WHM, 2 vCPU/2GB RAM, 10TB transfer, 50GB storage, root SSH, Softaculous [src: digest §14, lw-vps-infra.md, lw-cpanel-start.md].

| Stage | Footprint | LiquidWeb grounding |
|---|---|---|
| 0 DAU (launch) | 1 Managed VPS: app + Postgres + Redis + web tier; Cloud Firewall on (default-closed ports, preset rules); Acronis backups enabled with encryption; remote DB access OFF (default) or IP-whitelisted per LW hardening guidance | Single-server start [src: lw-vps-infra.md]; firewall workflow [src: lw-firewall.md]; remote-DB default-deny [src: lw-remote-db.md]; Acronis encryption [src: lw-acronis.md]; cPanel/WHM + Softaculous for admin speed [src: lw-cpanel-start.md, digest §14] |
| ~10k DAU | 2–3 VPS split: app tier + DB tier on Cloud Private Networking (internal traffic off public interfaces); Block Storage attached for photos; CDN in front of static/photos; clone-to-image workflow for staging [src: lw-cloud-vps.md]; cron-driven digests/jobs [src: lw-cron.md]; caching layer per LW caching/memcached docs [src: lw-caching.md] | Private networking between servers [src: lw-cloud-vps.md, lw-vps-infra.md]; block storage attach [src: lw-vps-infra.md]; staging via images [src: lw-cloud-vps.md]; CDN PoP caching [src: lw-cdn.md] |
| ~1M DAU | Hybrid: dedicated/bare-metal for DB hot path (Nexcess/LW dedicated line: bare metal for critical business applications, IPMI-via-VPN console, hardware-firewall AnyConnect option [src: lw-dedicated.md]) + elastic cloud tier; Terraform IaC (documented LW capability) [src: lw-cloud-vps.md]; bandwidth management/IP pools for egress control [src: lw-vps-infra.md]; GPU hosting option exists in LW catalog for in-house model inference [digest §14 site-nav] | Terraform IaC [src: lw-cloud-vps.md]; dedicated rationale [src: lw-dedicated.md]; GPU option [digest §14] |
| Support model shift | Start fully-managed (LW handles panel, backups, monitoring alerts, hardware/network — documented scope [src: lw-support-levels.md]); move hot tiers to self-managed as the platform team grows (self-managed scope: power/network/hardware only [src: lw-support-levels.md]) | [src: lw-support-levels.md] |

Note honestly: whether 1 VPS survives launch-day load for a consumer app is a risk to load-test, not a promise — the LW corpus documents capability, not capacity guarantees for this workload.

---

## 3. Build vs Buy Matrix

| Layer | Build | Buy | Verdict for new entrant | Anchor |
|---|---|---|---|---|
| Client framework | — | RN/Flutter/native | BUY (framework), BUILD (product) | — |
| API framework | — | NestJS/Fastify/Go kits | BUY framework, BUILD services | — |
| Payments plumbing | Bumble's 2005 in-house payment system is the captured failure mode | Store IAP + Stripe-class web | **BUY, always** | [src: wiki-bumble.md] |
| Receipt/renewal compliance logic | BUILD (thin, audited) | — | Build the validation service; copy the captured disclosure pattern | [src: gp-tinder.md] |
| Search/relevance | Tinder built a Java ES plugin in-house — only at scale | Managed OpenSearch first | BUY infra → BUILD scoring later | [src: tinder-eng.md] |
| Matching ML | BUILD (differentiator) post-PMF | Heuristics first | Sequenced build | [src: tinder-eng.md, bmbl-q2.md] |
| Nude-image classifier | BUILD from Bumble's OSS | — | **Deploy Private Detector OSS (free, proven)** | [src: wiki-bumble.md] |
| Scam/fake classifier | BUILD later; 95% auto-block is the benchmark | Vendor moderation suites exist | Buy time with rules + OSS; benchmark vs Deception Detector | [src: wiki-bumble.md] |
| LLM features | Harness/evals BUILD (Merlin precedent) | Foundation-model API BUY | Buy model, build guardrails | [src: tinder-eng.md, bmbl-q2.md] |
| Chat transport | BUILD (WS service) — core to product | Managed realtime early | Buy at 0, build by 10k | [src: wiki-bumble.md] |
| Age/identity verification | — | Persona/KWS-class vendor | **BUY** (Persona bypassed by game art — layer estimation + document checks) | [src: wiki-osa.md] |
| Photo verification (profile liveness) | Bumble used human review at start (2016) | Vendor liveness SDK | BUY vendor, keep human fallback | [src: wiki-bumble.md] |
| Push | FCM/APNs direct (free) | OneSignal early | Either; egress-govern any SDK | — |
| Observability | Self-hosted Grafana stack | LW built-in monitoring first | Buy LW tier → build app telemetry | [src: lw-vps-infra.md, lw-support-levels.md] |
| Backups/DR | — | Acronis via LW | **BUY** (ransomware-aware, off-server, encrypted) | [src: lw-acronis.md] |
| Moderation queue tooling | BUILD (product-specific) | — | Build minimal queue + welfare tooling early | [src: wiki-bumble.md BIJ finding] |
| Whole-app reference code | — | Duolicious (AGPLv3) is inspectable | Read it as free architecture reference (license obligations if reused!) | [src: wiki-compare.md] |

---

## 4. App-Store-Policy and Regulatory Constraints (EVIDENCE)

### 4.1 Store rules and billing

- In-app digital purchases must use store IAP; Tinder's Google Play listing carries the standard auto-renewal disclosure (charge at renewal within 24h before period end; cancellation via store settings; no mid-period cancellation) — the compliance template to replicate [src: gp-tinder.md].
- Store-listing metadata observed: Tinder Play listing "Contains ads — In-app purchases", 9.2M reviews, actively updated Sep 21 2026 [src: gp-tinder.md]; Grindr listing 18+ rating, version 26.16.1 updated 2026/09/10, #3 Top Grossing iPhone, IAP table visible (XTRA Monthly $22.99 / Weekly $14.99; Unlimited Monthly $44.99 / Weekly $27.99 / Day Pass $9.99; Boost $11.99) [src: s-grindr-price.json].
- Web checkout end-run: a web client selling subscriptions outside the stores is the captured economics play (Sniffies browser-only [src: wiki-compare.md]; Grindr Web exists as premium desktop [src: wiki-grindr.md]); exact current external-purchase rules per store are ❓ not captured in corpus — verify at build time.
- Age gating at distribution: Grindr CEO Arison argues app stores should own age verification (stores already hold the data); UK's per-app mandate cost Grindr ~7% of UK MAU [src: wiki-grindr.md]. If store-level age assurance ever lands, per-app burden drops — watch this space.

### 4.2 Age assurance (UK OSA and the export question)

- UK Online Safety Act 2023: duty of care; fines up to £18M or 10% of global turnover; **Jul 25, 2025** was Ofcom's age-verification enforcement deadline for services with primary-priority content; dating apps (captured list includes Tinder, Bumble, Feeld, Grindr, Hinge) implemented checks; Grindr complied Jul 2025 [src: wiki-osa.md, wiki-grindr.md].
- Vendor precedents captured: Reddit uses Persona; Bluesky uses Kids Web Services (KWS) [src: wiki-osa.md].
- Circumvention is documented: VPN download spike around the deadline; Persona photo-based estimation bypassed using Death Stranding game-character images [src: wiki-osa.md] — plan for estimation+document tiering and repeat-offender handling.
- Cost is real: Grindr ~7% UK MAU loss [src: wiki-grindr.md]; combined age-assurance + Malaysia/Indonesia pressures = ~400k user headwind [src: s-grnd.json].
- Ofcom enforcement scale (captured fines): 4chan £20k + £100/day escalation (Aug 2025), then a further £520k fine (Mar 2026); Itai Tech £50k + £5k flat (non-response to information requests); AVS Group £1M + £50k flat (non-response to information requests) [src: wiki-osa.md]. Cyberflashing is now a UK offence; E2E-encryption duties are in active clash with Ofcom [src: wiki-osa.md].
- US: no federal age verification (Section 230 rationale for Grindr's no-US-check stance) [src: wiki-grindr.md].

### 4.3 US TAKE IT DOWN Act — the 48-hour SLA you must build for

- Pub. L. 119-12, signed May 19, 2025: covered platforms must remove NCII (real or AI-deepfake) within **48 hours of a victim's request** and delete copies; FTC enforcement; criminal exposure up to 2 years (harsher for minors) [src: wiki-takeitdown.md].
- **Platform obligations effective May 19, 2026** (one-year runway) — reporting/takedown systems must exist NOW for any covered service [src: wiki-takeitdown.md].
- Enforcement is live: first conviction April 2026 (Ohio man, AI NCII); 15-year sentence September 2026 [src: wiki-takeitdown.md].
- Design tension to decide consciously: critics note takedown duties may extend to non-public E2E content and pressure breaking E2E; DMCA-style bad-faith abuse is anticipated (law relies on "good faith" requestors, no challenge mechanism specified) [src: wiki-takeitdown.md]. Related: DEFIANCE Act (civil damages for victims) passed the Senate Jan 2026; SHIELD Act pending [src: wiki-takeitdown.md].
- Build implication: NCII report intake → hash-matching (perceptual hashes) → 48h SLA clock with audit trail → copy-purge pipeline including backups (Acronis restore points must support selective purge — verify retention interplay [src: lw-acronis.md]).

### 4.4 GDPR / DSA / data-protection posture

- Grindr's €10M Norway GDPR fine (data shared with ≥135 advertisers; location data implying sexual orientation) and the £26M UK settlement (12,000 users; HIV-status sharing; covert tracking) are the sector's defining precedents [src: wiki-grindr.md].
- EU DSA applies to major platforms (VLOP status for some); **dating-app-specific VAPP/DSA obligations ❓ not captured this run** (checked: no dedicated corpus source) — treat as open compliance research item.
- US state-level: CCPA "Do Not Sell/Share" links and Consumer Health Data Privacy policy pages are captured incumbent practice (Grindr, Tinder footers) [src: grindr-unlimited.md, tinder-plans.md]; Colorado safety-policy disclosure captured (Tinder footer) [src: tinder-plans.md].
- Australia: duty-of-care proposal for dating apps announced ~Sep 22, 2026 — regulatory direction of travel [src: gdi-home.md].

### 4.5 Safety-feature floor (captured incumbent norms)

From Tinder's safety page: Face Check (select markets), Photo Verification, Share My Date, "Are You Sure?" and "Does This Bother You?" interstitials, block/unmatch/report [src: tinder-plans.md]; Bumble date-sharing with a contact [src: wiki-bumble.md]; Grindr at-risk-country auto-disable of distance [src: wiki-grindr.md]. A new entrant ships these or ships with a trust deficit on day one.

---

## 5. DevSecOps Pipeline Design and Threat Model

### 5.1 Pipeline design (RECOMMENDATION, precedents cited)

Stage plan for a small team:

1. **Trunk-based dev, PR gates**: lint + typecheck + unit tests; **AI-authored unit-test agent in CI** is the captured incumbent pattern (Tinder "Undercover Agent" [src: tinder-eng.md]) — adopt a lightweight version (agent generates tests for uncovered diffs; humans review).
2. **SAST + secret scanning + SBOM/dependency scan** on every PR (Semgrep/gitleaks/OSV-class; the Grindr 2020 email-only password-reset takeover [src: wiki-grindr.md] is what weak auth-change flows cost — auth flows get dedicated test suites).
3. **Contract tests on Protobuf schemas** — schema-first governance per Tinder's unified-API lesson [src: tinder-eng.md].
4. **Staging via server images**: LW image/clone workflow promotes identical environments [src: lw-cloud-vps.md, lw-vps-infra.md].
5. **Progressive delivery**: staged rollout percentages on both stores; binary-size/perf budget checks pre-release (Emerge precedent [src: tinder-eng.md]).
6. **CI identity**: OIDC-federation to deploy targets, no long-lived cloud keys — the exact class Tinder security researched (GHA + AWS OIDC misconfigs) [src: tinder-eng.md].
7. **Deploy gates**: migration dry-run + auto-backup snapshot (Acronis pre-deploy restore point [src: lw-acronis.md]).
8. **Post-deploy**: error-rate + match-latency SLO watch; rollback = re-image/previous artifact.
9. **AI-coding-agent harness**: if agents write code (the 2.5× output lever Grindr reports [src: s-grnd.json]), wrap them in an eval/guardrail harness (Tinder's Merlin precedent [src: tinder-eng.md]) and hold agent-written code to identical review gates.
10. **Response runbooks + disclosure policy**: the Jan 2026 Match/Bumble campaign showed same-week public statements are expected (Bumble's precise "no member DB/DMs/profiles accessed" statement is the template [src: wiki-bumble.md]) — that statement quality requires pre-built forensic telemetry.

### 5.2 Threat model: every captured incident mapped to a control

| Incident (evidence) | Threat class | Required control (recommendation) |
|---|---|---|
| Grindr 2020: account takeover via password-reset flow requiring only an email address [src: wiki-grindr.md] | Auth-flow logic flaw / ATO | Auth-change flows get dedicated abuse-case test suites; rate-limit + notify on reset; session invalidation on credential events |
| Grindr 2014/2016: trilateration from relative distances, even with distance hidden (Kyoto colluding-trilateration) [src: wiki-grindr.md]; Bumble 2021 Heaton trilateration (fixed in 3 days, $2,000 bounty [src: wiki-bumble.md]); KU Leuven 2024 multi-app study incl. Bumble + Hinge [src: wiki-bumble.md] | Location inference from proximity APIs | Never return precise distance; coarse distance buckets; server-side grid randomization; rate-limit profile-query fan-out (the attack needs many vantage queries); bug-bounty program from launch |
| Grindr data to ≥135 advertisers → €10M GDPR fine (2021); ad-network location-data sale 2017–2020; HIV-status sharing → £26M settlement (2026) [src: wiki-grindr.md] | Third-party SDK/data-flow exfiltration | SDK allowlist + data-flow inventory; sensitive fields (health, orientation-inferable signals) NEVER leave first-party systems; per-vendor DPIA; CCPA/UK data-sharing opt-out links (Grindr footer precedent [src: grindr-unlimited.md]) |
| Match Jan 28 2026 cyberattack ("limited amount of user data") + Bumble same campaign (no member DB/DMs/profiles accessed) [src: wiki-match.md, wiki-bumble.md] | Third-party/vendor campaign | Egress filtering; least-privilege segmentation (LW Cloud Private Networking keeps tiers off public interfaces [src: lw-cloud-vps.md]); immutable off-server backups with restore drills [src: lw-acronis.md]; pre-drafted disclosure statements |
| Bumble $22.5M auto-renewal settlement (2020) [src: wiki-bumble.md] | Billing/compliance abuse | Server-side receipt validation; renewal reminders + clear cancellation; store-disclosure parity [src: gp-tinder.md]; refund SLA tooling |
| Bumble moderator welfare crisis (BIJ 2023: PTSD, understaffing, targets) [src: wiki-bumble.md] | Human-ops failure (trust & safety) | Moderator tooling with wellness rotation, exposure limits, appeal flows; staff for peak queue, not average |
| Persona age-estimation bypassed with game-character images; VPN circumvention [src: wiki-osa.md] | Age-assurance evasion | Layered: estimation (UX) + document fallback (high assurance) + anomaly flags (repeated estimations, new-device clusters); accept documented ~7% MAU churn cost as budgeted compliance cost [src: wiki-grindr.md] |
| TAKE IT DOWN obligations effective May 19, 2026: 48h NCII takedown + copy deletion [src: wiki-takeitdown.md] | Regulatory SLA + CSAM/NCII handling | Perceptual-hash matching on upload + in-chat image scan (Private Detector OSS as the nude-detection component [src: wiki-bumble.md]); NCII report SLA with audit clock; backup-purge interplay documented [src: lw-acronis.md]; NCMEC-reporting workflow for minors' imagery |
| 2012 Grindr profile-photo swap hack (explicit images pushed to other users' profiles) [src: wiki-grindr.md] | Authorization (IDOR-class) on media objects | Object-level authz tests on every media endpoint; signed upload URLs; content-type sniffing |
| Fake profiles/entrapment (HRW 2023: police entrapment via fake profiles in Egypt/Iraq/Jordan/Lebanon/Tunisia) [src: wiki-grindr.md] | Sybil/impersonation → physical harm | Device+fingerprint velocity limits; photo verification tiering (Bumble 2016 precedent [src: wiki-bumble.md]); at-risk-region safety modes (Grindr Dec 2019 auto-disable distance precedent [src: wiki-grindr.md]) |

### 5.3 Security budget framing (both lenses)

Grindr's aggregate captured regulatory cost — €10M + £26M = roughly $40M+ across a decade of data-governance failures [src: wiki-grindr.md] — exceeds the plausible lifetime security-engineering budget of a new entrant by orders of magnitude. The DevSecOps case for day-one data-flow governance, layered age assurance, E2E chat, and a 48h-NCII pipeline is not best practice theater; it is the cheapest insurance in this market segment. Conversely the Tinder evidence shows security investment compounding into marketable trust assets (ISO 27701 certification, published CI/CD research) [src: tinder-eng.md].

---

## 6. Conflicts and Unknowns Carried Forward

Conflicts (both values retained, never averaged):

1. Tinder MAU: 60M vs 75M (BoA internal variance) [digest §15.1].
2. Tinder US gender split: 75/25 vs 73/27 (BoA tables) [digest §15.2].
3. Grindr ARPPU: $26.51 (powerdrill) vs $25.51 (CNBC) vs $24.25 (koalagains) [src: s-grnd.json].
4. Hinge+ price: $29.99 vs $16.99 (lowermysubs) vs $32.99 (vidaselect); HingeX: $49.99 vs $59.99 (getmatches.ai) [src: s-hinge-price.json].
5. Grindr XTRA monthly: $22.99 (Sensor Tower) vs $19.99 (top10.com) [src: s-grindr-price.json].
6. Hinge launch: Feb 2013 vs 2012 [digest §15.5].
7. Grindr revenue trajectory: FY25 $440M (10-K via wiki) vs FY26 guidance ≥$535M/~$540M (investor materials) — consistent trajectory, different sources [src: wiki-grindr.md, s-grnd.json].
8. Bumble payer series: BoA (Q2-basis) vs IR-quarterly authoritative when conflicting [digest §15.6].
9. Grindr user count: ~13.5M MAU (Sep 2023, wiki page text) vs 8M users (FY25 10-K basis) — different metrics/dates, both carried [src: wiki-grindr.md, digest §6].

Unknowns (❓ — checked, not found in corpus): Hinge/Feeld/CMB/Muzz/Raya tech stacks; Bumble 2.0 target stack; Tinder engineering post bodies (titles/summaries only — implementation detail unverified); Feeld Majestic price (JS-gated); EU VAPP dating-specific obligations; current store external-checkout policy specifics; The League sunset date; exact costs/prices of Persona/KWS-class verification; LiquidWeb price sheet beyond digest §14 baseline specs.

---

## Master Source List (corpus files cited in this deliverable)

backbone: notes/01-master-facts-digest.md, notes/verification-pass.md

pages/: tinder-eng.md, bumble-eng.md, wiki-grindr.md, wiki-bumble.md, wiki-match.md, wiki-compare.md, wiki-osa.md, wiki-takeitdown.md, bmbl-q2.md, s-grnd.json, s-mtch-q2.json, s-tinder-price.json, s-hinge-price.json, s-grindr-price.json, businessofapps-market.md, businessofapps-tinder.md, businessofapps-hinge.md, tinder-plans.md, grindr-unlimited.md, feeld-majestic.md, gp-tinder.md, as-tinder.md, as-hinge.md, gdi-home.md, lw-vps-infra.md, lw-cloud-vps.md, lw-support-levels.md, lw-remote-db.md, lw-cdn.md, lw-firewall.md, lw-caching.md, lw-acronis.md, lw-cron.md, lw-dedicated.md, lw-cpanel-start.md, lw-add-domain.md

Quarantined and never cited: tinder-monolith2.md, tinder-monolith3.md, feeld-home.md, businessofapps-grindr.md, businessofapps-revenue.md, as-grindr.md (App Store URL returned a 404 page — capture holds no listing data).


---

<!-- ====================================================================== -->
<!-- FILE: 06-architecture-deployment.md -->
<!-- ====================================================================== -->

# 06 — Architecture + Staged Deployment Plan (Dating App), Grounded in LiquidWeb Docs

Compiled 2026-09-23 as part of the dating-app-industry deep research program. Audience: full-stack multiplatform developer + DevSecOps engineer reading as a prospective founder. Every LiquidWeb platform claim is cited to its captured doc (`[src: lw-*.md]`); every industry fact is cited to its corpus file. Capacity/concurrency arithmetic is **derived engineering estimate** built on explicitly stated assumptions — it is not a corpus fact and is labeled as such. Hosting prices are NOT present in the captured LiquidWeb corpus and are marked ❓ rather than invented.

**Legend** — ✅ confirmed present / fits · ❌ absent / does not fit · 🟡 partial, strained, paywalled, or conditional · ➖ not applicable · ❓ unconfirmed or not captured in corpus.

**Conflicts carried (never averaged, per digest §15):** Tinder MAU 60M [src: businessofapps-tinder.md key stats] vs 75M (7.8M US) [src: businessofapps-tinder.md FAQ] — both carried; Tinder US gender split 75% male / 25% female implied (App Ape text) vs 73/27 (BoA table) [src: businessofapps-tinder.md] — both carried. These matter below only as incumbent-scale calibration (what 1M DAU means relative to Tinder's 60M-or-75M), not as inputs to arithmetic.

---

## 1. SYSTEM ARCHITECTURE

The reference architecture below is the *target-state model* that all three stages deploy onto. It is shaped by (a) what incumbents' engineering orgs have publicly revealed, and (b) the compliance surface a dating app must survive in 2026.

Grounding from the corpus:
- Tinder runs a **monolith decomposition program**, an **in-house Elasticsearch scoring plugin written in Java** ("crucial in-house technology... complex, observable, efficient and testable scoring algorithms"), a **dedicated ML team**, **recommendation embeddings** research, and a **unified API style guide** consolidating fragmented data models [src: tinder-eng.md — blog-listing-level evidence per digest §15.8; deep renders failed]. Lesson: even the market leader treats search/scoring as core IP and decomposes the monolith *after* scale, not before.
- Bumble's AI surface: **Private Detector** (2019, AI nude-image blur, open-sourced), **Deception Detector** (AI fake-profile/scam blocking), and a **"wingman" flirting chatbot in development**; AI-generated fake profiles prohibited [src: wiki-bumble.md]. Lesson: moderation AI is table stakes from day one, not a later add-on.
- Grindr monetizes AI directly: **gAI** (tested 2025, six AI features, premium-tier intent) [src: wiki-grindr.md], ARPPU **$26.51 +12%** with search-result framing "AI spend paying off," an **"Edge" premium tier**, FY26 guidance **≥$535M, later ~$540M** vs FY25 **$440M** (10-K) [src: s-grnd.json, wiki-grindr.md — note source difference per digest §15.4].
- Why moderation/verification is architecture, not a feature: **99% of women report abuse on dating platforms** (Australian study, headline-level) [src: gdi-home.md]; Trustpilot **Tinder 1.1 / Bumble 1.3 / Match 1.0** with fake-profile and billing complaints verbatim in corpus [src: tp-tinder.md, tp-bumble.md, tp-match.md].

### 1.1 Component diagram (target state)

```
                            ┌──────────────────────────────┐
                            │      CLIENTS (iOS/Android/   │
                            │       Web)  +  Admin Console │
                            └──────────────┬───────────────┘
                                           │ HTTPS / WSS
                            ┌──────────────▼───────────────┐
                            │   EDGE: CDN PoPs (static,    │
                            │   image derivatives, TLS     │
                            │   termination option)        │
                            │   + geo/region signals       │
                            └──────────────┬───────────────┘
                                           │
        ┌──────────────────────────────────▼──────────────────────────────────┐
        │                        API GATEWAY / LB (nginx)                     │
        │  auth · rate-limit · region gate (UK age-verify route) · audit-log  │
        └──┬────────────┬─────────────┬──────────────┬───────────────┬────────┘
           │            │             │              │               │
   ┌───────▼──────┐ ┌───▼─────┐ ┌─────▼──────┐ ┌─────▼──────┐ ┌──────▼───────┐
   │ AUTH /       │ │ PROFILE │ │ MATCH /    │ │ CHAT       │ │ MODERATION / │
   │ VERIFICATION │ │ SVC     │ │ RECO SCOR. │ │ SVC (WS +  │ │ TRUST&SAFETY │
   │ (incl. age-  │ │(photos, │ │ (candidate ││ REST hist.)│ │ SVC (queues, │
   │  assurance   │ │ prompts,│ │ generation,││            │ │ image/text   │
   │  broker)     │ │ filters)│ │ ranking)   ││            │ │ classifiers, │
   └───────┬──────┘ └───┬─────┘ └─────┬──────┘ └─────┬──────┘ │ NCII hashes) │
           │            │             │              │        └──────┬───────┘
           │            │        ┌────▼─────┐        │               │
           │            │        │ ML/INF.  │        │               │
           │            │        │ embeddings│       │               │
           │            │        │ scoring   │        │               │
           │            │        │ (offline→ │        │               │
           │            │        │  online)  │        │               │
           │            │        └────┬─────┘        │               │
   ┌───────▼────────────▼─────────────▼──────────────▼───────────────▼───────┐
   │                    DATA LAYER                                            │
   │  OLTP DB (MariaDB/Postgres) · Redis (cache+queue+presence) ·            │
   │  Object storage (photo originals) · Search index (later: ES-class) ·    │
   │  Append-only audit log (WORM) · Analytics event stream                  │
   └─────────────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │ EXTERNAL: age-     │
                    │ assurance vendor,  │
                    │ push, email, maps, │
                    │ payment/IAP, hosted│
                    │ ML APIs            │
                    └────────────────────┘
```

At Stage 0 every box above the data layer is a process on one VPS and the data layer is MariaDB + Redis + a derivatives directory; the shape is preserved so later stages are moves, not rewrites. At Stage 2 the boxes become deployments/pods. Tinder's own trajectory validates starting modular-but-deployed-monolithic and decomposing under load [src: tinder-eng.md].

### 1.2 Core-loop data flow: signup/verification → profile → match → chat

1. **Signup/verification.** Client → gateway → Auth SVC. Email/OAuth proof → account row (argon2id credentials, no plaintext). **Region resolution at first session** (geo-IP + account country): UK-likely sessions are branched to the age-assurance broker before any user-to-user feature unlocks — this is the routing the UK Online Safety Act's 25 July 2025 Ofcom deadline forces; Tinder, Bumble, Feeld, Grindr, Hinge and Reddit (via Persona) all introduced age verification for UK users against that deadline [src: wiki-osa.md; wiki-grindr.md]. Store only a verification *token/flag + method + timestamp*, never the ID document (data minimization; see §6).
2. **Profile.** Photos upload → gateway → Profile SVC → write to object storage → enqueue derivative-generation job (thumbs, blur variants) → moderation queue pre- or post-publication (see §1.4). Prompts/prefs → OLTP. A stale-flag `profile_v1` keeps the profile invisible to matching until moderation clears.
3. **Match.** Match SVC pulls a candidate set (Stage 0: SQL geo/pref query; Stage 1+: precomputed candidate lists refreshed by cron; Stage 2: embeddings + learned ranking in the pattern of Tinder's in-house Elasticsearch Java scoring plugin and recommendation-embeddings research [src: tinder-eng.md]). Each like/nope is an append-only event + counter update; mutual like writes a `match` row and emits a chat-room creation event.
4. **Chat.** Match row → room ID → client opens WSS to Chat SVC (Stage 0: single Node process). Messages: persist-then-fan-out, in-order per room, delivery receipts; 24h/72h match-window expiry jobs — note the industry just moved this way: Bumble extended its match window 24h→72h and retired women-message-first in Aug 2026 [src: wiki-bumble.md; bmbl-press.md title-only, PDF not fetched], so make the window a config value, not a constant.
5. **Post-loop signals.** Every event (impression, like, message-sent, report) lands in the analytics stream — with sensitive attributes stripped at the gateway (the Grindr £26M lesson, §5.3/§6.5).

### 1.3 Realtime chat design

- **Transport:** WebSocket (WSS) with HTTP long-poll fallback; one Chat SVC process owns socket sessions at Stage 0; Redis pub/sub becomes the cross-process fan-out at Stage 1 the day a second chat worker appears.
- **Delivery model:** write to OLTP first (message row, monotonic per-room seq), then publish; client acks by seq; reconnect replays from `last_seen_seq`. Presence in Redis with TTL heartbeats; typing indicators never persisted.
- **Ordering & idempotency:** client-generated UUID per message; DB unique key dedupes retries on flaky mobile networks.
- **Backpressure:** per-socket outbound queue cap (drop typing/presence first, never message payloads); slow-consumer disconnect policy.
- **Push bridge:** APNs/FCM on offline delivery; deep-link back into the room.
- **Windows:** match-expiry and read-state are cron-swept (see §2.8) — Bumble's 72h pivot shows this is product-tunable [src: wiki-bumble.md].
- **Capacity reality (derived, assumptions stated):** one Node WS process comfortably holds 2k–30k idle-ish sockets; Stage 0 peak concurrency is ~500–800 sockets (see §2.3 arithmetic), so the single-process design is not the Stage 0 bottleneck — the shared 2 vCPU and DB are.

### 1.4 Moderation pipeline

Two-speed design, mirroring Bumble's shipped products (Private Detector for images, Deception Detector for fake profiles/scams [src: wiki-bumble.md]):

```
 ingest ──► SYNC GATE (ms) ──► publish/blur/block decision
              │  vendor nude/CSAM classifier API (Private-Detector-pattern)
              │  banned-image hash set (NCII hashes — TAKE IT DOWN surface)
              ▼
         ASYNC QUEUE (Redis) ──► workers:
              │  text classifiers (scam/spam/contacts-in-bio)
              │  face-recrawl dedupe (fake-profile detection, Deception-Detector-pattern)
              │  new-account velocity & device fingerprint rules
              ▼
         HUMAN REVIEW QUEUE (admin console) ──► actions: warn/blur/remove/ban
              ▲
         USER REPORTS (in-app, one tap; 99%-of-women abuse stat = the demand signal
              [src: gdi-home.md])   +   appeals flow (Trustpilot 1.0–1.3 complaints are
              full of banned-account grievances [src: tp-*.md] — appeals are retention)
```

Stage 0 executes the sync gate as an external hosted classifier API call and the async arm as a cron-supervised worker on the VPS (§2.3 shows why local ML does not fit). Every action writes to the append-only audit log (§6.4).

### 1.5 ML-inference path

| Phase | Stage 0 (VPS) | Stage 1 (split) | Stage 2 (cloud/K8s) | Industry anchor |
|---|---|---|---|---|
| Nude/abuse image classification | External API, sync gate | External API + local cache of verdicts | Autoscaled GPU/CPU inference or vendor | Bumble Private Detector (open-sourced) [src: wiki-bumble.md] |
| Fake-profile/scam text+behavior | Rules + external API | Local lightweight model (second box) | Online model w/ feature store | Bumble Deception Detector [src: wiki-bumble.md] |
| Match ranking | SQL recency+geo+prefs score | Nightly batch candidate lists (cron) | Embeddings + learned scorer behind ranking SVC | Tinder ES Java scoring plugin, ML team, embeddings research [src: tinder-eng.md] |
| Recommendation embeddings | ➖ none | 🟡 optional nightly batch (ONNX CPU on second box) | ✅ feature store + online ANN index (ES-class) | Tinder recommendations program [src: tinder-eng.md] |
| Gen-AI premium features (flirt-assist, profile coach) | 🟡 external LLM API, paywalled tier | 🟡 external LLM API | 🟡 vendor or self-hosted | Grindr gAI six features, premium intent [src: wiki-grindr.md]; Grindr Edge tier + ARPPU +12% [src: s-grnd.json]; Bumble wingman in dev [src: wiki-bumble.md] |

Rule: **inference is never on the app VPS at Stage 0** (§2.3 RAM arithmetic). The monetization evidence — Grindr ARPPU $26.51 +12% with "AI spend paying off" framing and an Edge premium tier [src: s-grnd.json], weekly $14.99 subs [src: s-grindr-price.json] — justifies AI features early, but as API consumers, not self-hosted models, until Stage 1's second box exists.

---

## 2. STAGE 0 (0–10k DAU) — Everything on the LiquidWeb Managed VPS

### 2.1 The baseline, as documented

Baseline (per digest §14, corpus): **LiquidWeb Managed VPS — AlmaLinux 9.8, cPanel/WHM, 2 vCPU / 2 GB RAM, 10 TB transfer, 50 GB storage, root SSH, Softaculous.**

What the captured docs actually establish about this box:

| Capability | What the docs say | Source |
|---|---|---|
| Control plane | cPanel four core areas: File Manager, subdomains, email accounts, Softaculous installs; `public_html` is web root; disk-usage viewer | [src: lw-cpanel-start.md] |
| App installers | Softaculous one-click installs (WordPress, Magento, Joomla pattern); LW fully-managed support will install Softaculous CMS options for you | [src: lw-cpanel-start.md, lw-support-levels.md] |
| App runtimes | A cPanel path for Python web applications on CloudLinux is documented in the doc family; HTTP/2 on Apache documented | [src: lw-cpanel-start.md doc-family links] |
| Licensing | cPanel now tier-priced; raising domain count may require a license-tier bump | [src: lw-cpanel-start.md] |
| Two firewalls | Every LW server has ≥1 software firewall; Linux ships **CSF (ConfigServer Security & Firewall)**; Cloud VPS adds a **Cloud Firewall filtering before CSF**; LW recommends using both | [src: lw-firewall.md] |
| Backups | **Acronis Cyber Backups**: managed off-server, file-level + full-server + application-aware, ransomware-protection features, bare-metal restore, self-service restore portal, encryption option, quota alerts, custom plans for more frequent backups of specific folders, cPanel plugin, DB-restore procedure; Acronis is included for VPS servers | [src: lw-acronis.md] |
| Remote DB | Off by default (explicitly a security-risk stance); enabling = cPanel Remote MySQL IP whitelist + firewall rule for port 3306 | [src: lw-remote-db.md] |
| Scale levers | Cloud VPS resize; cloning-as-resize path; server images for staging/dev; block storage attach; IP pools; bandwidth quota monitoring/raise | [src: lw-cloud-vps.md] |
| Private networking | Cloud Private Network for secure internal traffic between Liquid Web servers (saves bandwidth) | [src: lw-cloud-vps.md] |
| IaC | A Terraform setup article exists for the platform | [src: lw-cloud-vps.md] |
| Ops visibility | Portal server view: Monitoring/Networking/Backups & Images/Activity/Console tabs; details block (location, OS, CPU, storage, memory, bandwidth); three-dot menu: Support Access, Panel logins, **Unblock IPs**, hostname edit, clone/resize/reimage/shutdown/destroy; scheduled tasks (reboots/resizes); block storage; credentials-on-file block | [src: lw-vps-infra.md] |
| Support boundary | Fully managed = 24/7 chat/email; backups/restores (panel, Cloud, Acronis, Server Images); CMS install; panel config/troubleshooting; emergency disk cleanup; hardware monitoring; network; DDoS volumetric mitigation **up to 2 Gbps included** (more as addon); Layer 4 protection included, Layer 7 addon; SSL ordering/install + TLS config; key-service troubleshooting (Apache, MySQL/MariaDB, SMTP, FTP). **Not covered:** third-party software beyond the panel, developer tasks, customizing cron jobs, code/DB/website performance optimization, extensive server tuning | [src: lw-support-levels.md] |
| Monitoring assist | Fully managed servers with monitoring enabled get "a team dedicated to addressing service alerts" | [src: lw-support-levels.md] |

That support boundary is the single most important Stage 0 planning fact for a founder-engineer: **LiquidWeb keeps the platform (panel, web/db/mail services, hardware, network, backups) alive; everything you build on top — your Node/Python app, your custom crons, your query performance — is explicitly yours** [src: lw-support-levels.md]. Staff accordingly (i.e., you are the on-call for the app; LW is the on-call for the box).

### 2.2 Service layout on the box

Domain topology follows the documented cPanel model: in WHM you create a cPanel user account per main domain, and subdomains/addon domains live inside that account [src: lw-add-domain.md]; every subdomain needs its own A record [src: lw-cpanel-start.md].

```
WHM (root)
 └─ cPanel account: app.example.com        (one owner, per lw-add-domain model)
     ├─ api.example.com      → nginx vhost → Node API (Passenger/app-manager or
     │                          systemd + reverse proxy; Python-via-cPanel path
     │                          documented in doc family [lw-cpanel-start])
     ├─ chat.example.com     → same Node runtime, WS upgrade handled by nginx
     ├─ admin.example.com    → admin console static SPA + IP allowlist
     ├─ img.example.com      → photo derivatives dir (CDN origin) [lw-cdn]
     ├─ status.example.com   → status page + blackbox prober output
     └─ staging.example.com  → staging vhost (or separate cPanel account if you
                               want hard isolation; addon→account conversion is
                               a documented operation [lw-add-domain])
 MariaDB (local, cPanel-managed) · Redis (systemd, no panel) · nginx in front
 Mail: DISABLED locally → transactional provider (frees RAM + shrinks attack
       surface; cPanel's own docs point to hosted email as an alternative
       [lw-cpanel-start])
```

Notes:
- Keeping app + staging in **separate cPanel accounts** isolates filesystem/quota and matches the documented "convert addon domain to a separate cPanel account" path [src: lw-add-domain.md].
- The cPanel tiered-licensing note means the *domain count* has a cost/step dimension — consolidate on subdomains under one main domain where possible [src: lw-cpanel-start.md, lw-add-domain.md].
- A Cloud VPS **server image** is documented for replicating live→staging/dev [src: lw-cloud-vps.md] — use it as your staging refresh mechanism.

### 2.3 Capacity arithmetic (derived estimates; assumptions stated)

**Assumption set A (usage):** 10k DAU; ~4 sessions/user/day (calibration: Tinder active users log in ~4×/day, SurveyMonkey Intelligence, dated [src: businessofapps-tinder.md]); ~90 API calls/session (swipe-heavy); peak-hour concurrency 5–8% of DAU; 1.5 MB/day delivered per DAU with CDN; 8 photos/user × 3 derivative sizes × ~60 KB ≈ 1.4 MB/user derivative set; originals offboxed.

**RAM budget — 2048 MB total:**

| Component | Config assumption | Est. RSS | Verdict |
|---|---|---|---|
| AlmaLinux 9.8 base + kernel + systemd | minimal server profile | ~200 MB | ✅ |
| cPanel/WHM stack (cpsrvd, tailwatchd, queueprocd; mail offloaded) | mail services disabled | ~450–550 MB | ✅ (biggest fixed cost; do not fight it) |
| MariaDB | innodb_buffer_pool 256 MB, ~60 conns, tuned temp | ~400–450 MB | ✅ tuned; 🟡 default |
| Redis | maxmemory 96 MB + overhead (cache, queues, presence) | ~150 MB | ✅ small; 🟡 if queues back up |
| Node API | 2 workers × ~110 MB | ~230 MB | ✅ at 10k DAU |
| Node chat (WS) | 1 process, ~700 peak sockets × ~12 KB + base | ~130 MB | ✅ |
| nginx | reverse proxy + static | ~50 MB | ✅ |
| Moderation/derivative workers (bursty) | nice/ionice'd | ~120 MB | 🟡 bursts |
| Headroom (updates, spikes, page cache) | — | ~130–200 MB | 🟡 thin |
| **Total** | | **~1,860–2,080 MB** | 🟡 fits, no slack (top-of-range exceeds 2,048 — tune MariaDB/cPanel down or shed a worker before that point) |

**Conclusions from the table:** the box *fits* a tuned monolith-plus-Redis at 10k DAU **only with local mail disabled and MariaDB tuned**. What does **not** fit, ever, on this box: ❌ Elasticsearch-class search (realistic JVM heap alone ≥ 1–2 GB); ❌ local ML model serving (Python + torch/onnxruntime + weights ≈ 500 MB–2+ GB); ❌ a second app tier; ❌ meaningful image-processing parallelism (2 vCPU shared with everything).

**Concurrency / throughput (derived from set A):**

| Metric | Derivation | Value | vs box |
|---|---|---|---|
| Peak concurrent users | 10k × 5–8% | 500–800 CCU | ✅ (WS process holds 2k–30k sockets) |
| API rate, avg | 10k × 4 × 90 = 3.6M req/day ÷ 86,400 | ~42 req/s | ✅ |
| API rate, peak | 5× avg | ~210 req/s | ✅ CPU-side (2 vCPU Node ≈ low-thousands simple JSON req/s) — DB is the governor |
| DB writes peak | swipes+likes+messages ≈ 200–400 TPS burst | ✅ | MariaDB on NVMe with indexes; 🟡 if match-recompute batch collides with peak |
| Storage | DB+indexes ~2–5 GB/mo with event partitioning + 90-day prune; derivatives ~14 GB at 10k active originals-offboxed | fits in 50 GB 🟡 | watch with cPanel Disk Usage tool [src: lw-cpanel-start.md] |
| Transfer | 10k × 1.5 MB/day ≈ 450 GB/mo with CDN | ✅ inside 10 TB | without CDN 3–5× → 🟡 strains late-stage — the exact origin-load argument the CDN doc makes [src: lw-cdn.md] |

### 2.4 What fits / strains / never fits

| Concern | 0–10k DAU verdict | Notes |
|---|---|---|
| Monolith API + MariaDB + Redis + 1 WS process | ✅ | tuned, mail offloaded |
| Nightly match-recompute batch | ✅ | 02:00–04:00 window via cron [src: lw-cron.md] |
| Image derivative generation | 🟡 | queued, niced, off-peak; CPU contention with chat peak |
| Moderation sync gate | ✅ | as external API call |
| Local ML/ONNX serving | ❌ | RAM; move to second box or API |
| Elasticsearch-class search | ❌ | Stage 1+; SQL + Redis sets until then |
| HA / zero-downtime deploys | ❌ | single box — maintenance windows; mitigate with reload-style restarts + graceful WS drain |
| Local email | ❌ (policy) | offload to transactional provider; cPanel docs themselves point at hosted email options [src: lw-cpanel-start.md] |

### 2.5 Backups — Acronis (lw-acronis)

- Enable **Acronis Cyber Backups** as the off-server layer: managed, protects against hardware failure, cyberattacks, accidental deletion; file-level, full-server, and application-aware backup types; ransomware-protection features; bare-metal restore [src: lw-acronis.md].
- **Turn on Acronis encryption** [src: lw-acronis.md] — dating data at rest in backups is in-scope for GDPR/DSA (§6).
- Use a **custom plan for more frequent backups of specific folders** [src: lw-acronis.md]: e.g., hourly `/var/lib/mysql` snapshot-class plan + daily full-server, and rehearse the documented **database-restore-from-Acronis** procedure quarterly [src: lw-acronis.md].
- **Quota alerts** are documented — route them somewhere a human reads; a full backup quota is a silent compliance failure [src: lw-acronis.md].
- Acronis is stated as **included for VPS servers**, with a cPanel plugin for access [src: lw-acronis.md]; backup retention figures/price tiers ❓ not captured.
- Layer 3: `pg_dump`-equivalent nightly logical dumps kept off-box (object storage — the LW doc family links object-storage docs [src: lw-dedicated.md link index]) so a bad migration is recoverable independently of the image layer.

### 2.6 Firewall posture (lw-firewall + lw-remote-db)

- **Two layers, both on:** CSF (software, on-box — Linux servers "likely have CSF") + the **Cloud Firewall** that filters *before* CSF; LiquidWeb explicitly recommends using both [src: lw-firewall.md].
- Cloud Firewall via portal: My Servers → server → Networking → Firewall → Enable. Use **Advanced mode** (deny-all, explicit rules) rather than Basic click-to-open — you are running an API, not a brochure site; rules as code via the **Preset** template feature so staging/DR boxes inherit the same rule set [src: lw-firewall.md].
- Expose: 443 (and 80→redirect) only, plus your moved SSH port. **Change the SSH port** — LW links this against "mass attacks" [src: lw-firewall.md]; keys-only (§5.1).
- Port 3306 (MySQL): closed. The day you need the remote-DB lever, the doc's exact procedure is cPanel Remote MySQL IP whitelist **plus** firewall allow for those IPs on 3306 [src: lw-remote-db.md].
- WHM/cPanel ports: bind to localhost behind SSH tunnel or IP-allowlist in Advanced mode (derived practice; panel ports are documented as panel-manageable [src: lw-firewall.md]).
- **Unblock IPs** lives in the portal three-dot menu [src: lw-vps-infra.md] — expect to use it when CSF blocks your own admin/CI IP; document the runbook now.
- DDoS: fully-managed includes **volumetric mitigation up to 2 Gbps**, L4 included, L7 as addon [src: lw-support-levels.md] — put the CDN (§2.7) in front so origin IP is not directly enumerable.

### 2.7 Caching + CDN (lw-caching, lw-cdn)

- Caching doc frames the win exactly as this app needs: cached copies mean the server doesn't "retrieve and assemble the data from scratch," cutting load [src: lw-caching.md]. Apply at three layers: (1) CDN edge for derivatives/static [src: lw-cdn.md]; (2) **memcached** — the doc family's named acceleration system [src: lw-caching.md] — or Redis-as-cache for profile cards and candidate decks (we already run Redis; memcached is the documented alternative if you want cache isolation from queue semantics); (3) MariaDB query cache off, rely on buffer pool.
- CDN: edge PoPs cache static content (images/CSS/JS), users hit nearby edge, **origin load drops** — the doc's own Michigan-origin→Japan-user example [src: lw-cdn.md]. Doc family covers **Nexcess CDN** (configure, monitor usage, purge edge cache) and **Cloudflare CDN** articles [src: lw-cdn.md]. Dating-app specifics: long-lived immutable URLs for photo derivatives (content-hash names), short TTL on profile JSON, immediate-purge on moderation takedowns (a blur/remove must clear the edge — use the documented purge [src: lw-cdn.md]).
- 10 TB transfer budget holds at this stage **only with** the CDN absorbing derivative traffic (§2.3 arithmetic).

### 2.8 Cron jobs (lw-cron)

Syntax rules per the doc: edit via `crontab -a` (never edit the spool file directly — changes won't be picked up by the daemon); `/etc/cron.{hourly,daily,weekly,monthly}` scripts run **as root** — use per-user crontabs for app jobs; full paths (`/home/user/...` not `~/`); executable bits required; and the classic warning — `crontab -r` deletes everything, no prompt [src: lw-cron.md].

Stage 0 crontab (app user unless noted; derived, mechanism per lw-cron):

| Schedule | Job | Purpose |
|---|---|---|
| `*/5 * * * *` | moderation queue watchdog + worker supervisor restart | keeps async moderation alive |
| `*/10 * * * *` | match-window expiry sweep (24h/72h configurable, Bumble moved 24→72h [src: wiki-bumble.md]) | expire stale matches, notify |
| `15 * * * *` | GDPR/DSA retention sweep — hard-purge soft-deleted rows past window (§6.2) | compliance automation |
| `30 * * * *` | NCII hash-sync + report-triage escalation check (§6.3) | TAKE IT DOWN readiness |
| `0 13 * * *` | vendor-statement recon (age-assurance attestations) | OSA evidence file (§6.1) |
| `15 2 * * *` | nightly match-recompute batch (candidate decks, pref scores) | §1.5 |
| `30 2 * * *` | logical DB dump → off-box copy | restore-path independence |
| `45 2 * * *` | derivative orphan cleanup + disk-usage report | storage guardrail |
| `0 3 * * 0` | dependency audit (npm/os), cert expiry check, restore drill pick | §5 hygiene |
| root `/etc/cron.weekly/` | log rotation, Acronis result verification | [src: lw-cron.md pattern] |

Remember: **LW fully-managed support explicitly does not customize your cron jobs** — these are entirely yours to own [src: lw-support-levels.md].

### 2.9 The remote-DB lever (lw-remote-db) — when to pull it

The doc's framing is a security default: remote DB access is off because a weak DB password + open 3306 = compromised site; enabling means cPanel Remote MySQL host whitelist + firewall port 3306 allow for exactly those IPs [src: lw-remote-db.md]. Pull this lever in exactly two Stage 0 situations:

1. **Staging/dev box needs production-shaped data access** — whitelist the staging IP only, tunnel over the Cloud Private Network where both ends are LW servers [src: lw-cloud-vps.md].
2. **Split-brain rehearsal for Stage 1** — run the app tier on the VPS against a DB on a second LW server for a week *before* the real cutover (§3.4), proving connection pooling, latency, and failover behavior.

Never: open 3306 to the world; the doc's weak-password warning is the floor, not the ceiling [src: lw-remote-db.md].

### 2.10 CDN in front (lw-cdn) — already covered in §2.7, decision summary

Pull the CDN lever at ~2–3k DAU (when derivative traffic starts mattering), not at 10k — the origin-offload and the DDoS-hiding of the origin IP are both cheap wins, and the purge primitive is required by the moderation takedown flow anyway [src: lw-cdn.md, lw-support-levels.md].

### 2.11 Stage 0 recommendation table (one row per concern, doc-anchored)

| Concern | Recommendation | Anchor |
|---|---|---|
| Box | Managed VPS baseline, mail offloaded, MariaDB tuned | [src: lw-cpanel-start.md, lw-support-levels.md] |
| Domains | One main-domain cPanel account + subdomains; staging separate account when isolation needed | [src: lw-add-domain.md] |
| Backups | Acronis encrypted, custom frequent plan for DB dir, restore drills | [src: lw-acronis.md] |
| Firewall | Cloud Firewall (Advanced, presets) + CSF, 443-only, moved SSH port | [src: lw-firewall.md] |
| Caching/CDN | CDN at ~2–3k DAU; Redis/memcached layer | [src: lw-caching.md, lw-cdn.md] |
| Cron | Table in §2.8, `crontab -a`, per-user, full paths | [src: lw-cron.md] |
| Remote DB | Off; whitelist-only for staging or migration rehearsal | [src: lw-remote-db.md] |
| Staging | Cloud VPS image of live server | [src: lw-cloud-vps.md] |
| Ops visibility | Portal Monitoring/Activity tabs + own app monitoring | [src: lw-vps-infra.md] |
| Support boundary | Platform = LW; app/crons/perf = you | [src: lw-support-levels.md] |

---

## 3. STAGE 1 (10k–1M DAU) — The Migration Decision Tree

### 3.1 Decision tree

```
 TRIGGER (any): peak CCU > ~1.5k sustained · p95 API > 400ms at peak ·
                DB CPU > 70% at peak · storage > 70% of 50GB ·
                moderation queue depth chronically > SLA
      │
      ├─ Q1: Is it the DB? (slow queries, buffer-pool pressure, replication want)
      │     YES → move DB to its own LW server first (Cloud Private Network
      │            back to app box [lw-cloud-vps]) ── the remote-DB whitelist
      │            procedure is the cutover primitive [lw-remote-db]
      │            └─ still tight? → dedicated for DB (bare metal reliability/
      │               performance/security case [lw-dedicated])
      │
      ├─ Q2: Is it media/CPU (derivative storms, moderation batch)?
      │     YES → second VPS for workers+media origin; block storage attach
      │            if needed [lw-cloud-vps]; GPU docs category exists in the
      │            LW doc nav if you go local-ML [lw-support-levels.md nav; ❓ specs]
      │
      ├─ Q3: Is it web/WS tier? (CCU growth)
      │     YES → try vertical resize first (documented path [lw-cloud-vps]);
      │            cloning-as-resize when plain resize unsuitable [lw-cloud-vps];
      │            else split chat onto own box (Redis pub/sub fan-out, §1.3)
      │
      ├─ Q4: Is it multi-region/compliance? (UK gate + geo-fencing like Pairs'
      │            Japan IP wall [pairs-home2.md])
      │     YES → CDN/edge first [lw-cdn]; full multi-region = Stage 2 exit
      │
      └─ Q5: >1 path saturated + team still ≤4 engineers + K8s skills present?
            YES → begin managed-cloud exit (Stage 2) instead of stacking VPSes
            NO  → continue VPS ladder (cheapest per unit until orchestration
                  needs dominate)
```

The ladder logic: VPSes stay the cheapest incremental step and every needed primitive (private network, block storage, images, resize, presets) is documented [src: lw-cloud-vps.md, lw-firewall.md]; **dedicated** enters when single-tenant bare-metal reliability/performance/security is worth it — the docs position dedicated for "critical business applications" with how-tos for IP adds, IPMI-via-VPN, console, and hardware-firewall VPN (AnyConnect) [src: lw-dedicated.md]; **managed-cloud exit** enters when you need autoscaling/multi-region orchestration that a handful of VPSes cannot express.

### 3.2 What moves first — order and rationale

1. **Database** (biggest blast-radius reduction; every other service survives an app-tier restart, not a DB loss). Own LW server, on Cloud Private Network with the app box [src: lw-cloud-vps.md], reached via the documented whitelist+3306 procedure [src: lw-remote-db.md]; Acronis on the new box with the DB-restore runbook [src: lw-acronis.md].
2. **Media + worker plane** (CPU contention is what visibly degrades chat p95 at this stage — §2.3). Second VPS: derivative workers, moderation workers, img origin; block storage for originals if object storage not used [src: lw-cloud-vps.md]; CDN origin flipped to it [src: lw-cdn.md].
3. **Realtime chat** (only when CCU > ~3–5k or WS process CPU saturates): own box, Redis pub/sub between API and chat, session-tokens scoped for chat subdomain.
4. **Search/ranking** (ES-class index, local ML) — first workload that genuinely wants dedicated or 8 GB+ VPS with GPU docs category as an option [src: lw-dedicated.md, lw-support-levels.md nav ❓].

### 3.3 Zero-downtime migration runbooks

**Runbook A — DB move (VPS → second LW server):**
1. Provision target (same region; Cloud Private Network to app box) [src: lw-cloud-vps.md].
2. Primary-replica replication from old→new; verify lag < 1s sustained 24h.
3. App: dual-read window (reads from replica) → drain writes during low trough (feature-freeze deploy flag) → promote replica → switch write DSN via env/secret reload (no restart).
4. Keep old DB read-only 48h as hot fallback; whitelist dance per [src: lw-remote-db.md]; Acronis restore test on target before cutover [src: lw-acronis.md].
5. Rollback = repoint DSN to old primary (kept read-only), replay the delta if reverse-replicated.
- Downtime: seconds-to-minutes of write unavailability, invisible if the app queues outbound writes (messages already tolerate this — §1.3 seq-replay).

**Runbook B — media/origin move:**
1. rsync originals+derivatives to new origin; run both origins.
2. Flip CDN origin (or DNS for img subdomain with TTL pre-lowered to 60s) — the doc family documents edge-cache purge for exactly this [src: lw-cdn.md].
3. Purge stale edge entries; watch 404s at edge for 48h; decommission old origin dir last.

**Runbook C — realtime chat move:**
1. Stand new chat box; both subscribed to same Redis pub/sub namespaces.
2. Clients version-gated: new clients connect to `chat2.`; old sockets drain naturally (mobile reconnect cycles do the migration for you — seq-replay makes this safe, §1.3).
3. Reconnect-storm guard: jittered backoff enforced server-side (5–30s) — a chat migration is a self-inflicted thundering herd without it.
4. Only then move Redis itself (same primary/replica pattern as Runbook A).

**Resize note (the non-zero-downtime lever):** documented resize — or clone-to-resize when resize isn't suitable — is a maintenance-window operation, not a live one [src: lw-cloud-vps.md]; schedule via portal Scheduled Tasks [src: lw-vps-infra.md] and spend error budget consciously (§8).

### 3.4 Stage 1 cost ladder (structural — prices ❓ not captured)

| Rung | Topology | What it buys | Cost direction | ❓ |
|---|---|---|---|---|
| 1 | Baseline VPS (Stage 0) | everything-small | reference | price ❓ not in corpus |
| 2 | VPS resize up | 2× RAM/CPU headroom in one op | one step up | price ❓ |
| 3 | +2nd VPS (DB) | blast-radius + DB headroom | +1 box + private net (documented, priced ❓) | |
| 4 | +3rd VPS (workers/media) | CPU contention gone | +1 box + block storage maybe | |
| 5 | Dedicated for DB or search/ML | bare-metal single-tenant, IPMI-via-VPN, hardware-firewall option [src: lw-dedicated.md] | step change | price ❓ |
| 6 | Ladder total (3–5 boxes) | near 1M DAU possible, ops on you | ~4–5 units | |
| 7 | Managed-cloud/K8s exit | autoscale, multi-region, managed PG/Redis, HPA | opex step + platform-engineering tax | price ❓ |

Budget anchor from corpus revenue math (why the ladder matters): at Bumble's Q2'26 ARPPU of **$21.96** [src: bmbl-q2.md], 500 paying users ≈ $11k/mo revenue — the difference between rung 1 and rung 6 must stay well inside that at mid-Stage-1, or the unit economics that killed lighter competitors (Bumble: -$906M net 2025, two impairment quarters [src: businessofapps-bumble.md, bmbl-q2.md]) will find you too.

---

## 4. STAGE 2 (≥1M DAU) — Cloud/K8s Target State, VPS Demoted to Edge/Backup Roles

```
 multi-region cloud (K8s or managed PaaS):
   edge/CDN (global PoPs, TLS, WAF-class L7 [L7 is addon-class at LW too, 
            lw-support-levels]) 
     → region routers (US-first: US ≈40% of Tinder revenue; UK ≈10% 
            [src: businessofapps-tinder.md, Sensor Tower]; UK region carries the 
            OSA gate; JP only if you accept a Pairs-style walled garden — 
            Pairs geo-blocks all non-Japan IPs [src: pairs-home2.md])
     → API deployments (HPA), chat statefulsets w/ sticky sessions + seq store,
       ranking SVC w/ feature store + ANN index (Tinder-pattern [tinder-eng]),
       moderation workers on GPU node-pool or vendor,
   managed Postgres (HA) + managed Redis + object storage w/ lifecycle rules,
   event stream → lake → batch/online features,
   WORM audit archive (§6.4), immutable infra via IaC (Terraform pattern already
   documented at LW for the VPS era [src: lw-cloud-vps.md] — carry the habit).

 VPS (the original LiquidWeb box) — KEEP IT, demoted:
   ✅ off-site backup target of last resort (Acronis off-server copies 
      [lw-acronis] + nightly logical dumps, reverse of the usual direction)
   ✅ DR warm-standby for marketing/status/ops pages when cloud has a bad day
   ✅ blackbox prober + synthetic checks watching the cloud from outside it
   ✅ internal tools / admin console behind Cloud Firewall Advanced + presets
      [lw-firewall] and Cloud Private Network to any remaining LW workloads
      [lw-cloud-vps]
   ✅ cost-cap: fixed-price box as circuit-breaker against cloud bill shocks
      (a real risk at ARPPU $21.96 [bmbl-q2] economics)
```

Do not carry the VPS into the request path at 1M DAU — 10 TB transfer and 2 vCPU make it a liability there [digest §14 baseline] — but as an *out-of-band* observer and last-resort restore point it is exactly the kind of cheap, independent, differently-failing system a small SRE team wants.

---

## 5. DEVSECOPS RUNBOOK

### 5.1 Hardening checklist — the cPanel box

| # | Item | Practice | Anchor / note |
|---|---|---|---|
| 1 | SSH keys | keys-only, no root password login, per-human keys, hardware-token 2FA where supported | root SSH is in baseline [digest §14]; port-move per [src: lw-firewall.md] |
| 2 | SSH port | move off 22 — LW links this vs "mass attacks" | [src: lw-firewall.md] |
| 3 | Firewalls | Cloud Firewall Advanced (deny-all, explicit, **Preset**-templated) + CSF both enabled | [src: lw-firewall.md] |
| 4 | Exposed surface | 443 + moved-SSH only; WHM/cPanel behind tunnel/IP-allowlist; 3306 closed until §2.9 lever | [src: lw-firewall.md, lw-remote-db.md] |
| 5 | fail2ban-equivalent | CSF's login-failure blocking (CSF is the shipped software firewall) + app-level rate limiting at nginx | CSF named in [src: lw-firewall.md]; app-level = derived |
| 6 | TLS | AutoSSL/LW-ordered certs — SSL ordering/install + TLS config is documented managed-support scope; HSTS after CDN purge-check; TLS1.2+ floor | [src: lw-support-levels.md] |
| 7 | Secrets | env files 0600 under `/home/app`, never in repo; no secrets in cron command lines (wrapper scripts); rotate DB creds on any team change | cron full-path pattern [src: lw-cron.md] |
| 8 | Updates | panel/OS via WHM update path (doc family: "Update WHM/cPanel" [src: lw-cpanel-start.md]); `dnf update` cadence weekly + reboots in window; dependency audit weekly (§2.8) | |
| 9 | DDoS posture | 2 Gbps volumetric included; L7 addon when attacked; CDN hides origin | [src: lw-support-levels.md, lw-cdn.md] |
| 10 | Credentials hygiene | portal keeps server credentials on file — keep the record updated when rotating, or support friction at 3am | [src: lw-vps-infra.md] |
| 11 | Backups | Acronis encrypted + custom frequent DB-folder plan + off-box logical dumps; quarterly restore drill | [src: lw-acronis.md] |
| 12 | Mail | disabled locally; transactional provider with SPF/DKIM/DMARC (MX/DNS management per [src: lw-cpanel-start.md]) | |
| 13 | Audit surface | every admin action logged (§6.4); portal Activity tab cross-check | [src: lw-vps-infra.md] |
| 14 | Supply chain | Softaculous used only for utilities, never for anything in the request path; lock app deps via lockfile + lockfile-audit in CI | Softaculous scope [src: lw-cpanel-start.md]; derived policy |

### 5.2 Update cadence (table)

| Layer | Cadence | Channel |
|---|---|---|
| AlmaLinux 9.8 packages | weekly + urgent | dnf, windowed reboot |
| cPanel/WHM | LTS release track, monthly | WHM updater [src: lw-cpanel-start.md doc family] |
| App deps | weekly lockfile audit, monthly bump | CI |
| nginx/Node/Redis | monthly, security-ASAP | dnf/npm |
| Certs | auto-renew, alert at 21d | AutoSSL [src: lw-support-levels.md] |
| Runbooks/restore drills | quarterly | [src: lw-acronis.md DB-restore] |

### 5.3 Incident response — captured incidents as the threat model

The corpus contains a ready-made dating-app threat lab; each row is a real incident, its anchor, and the controls this architecture deploys.

| Scenario | Real-world anchor (corpus) | Detection | Containment / fix |
|---|---|---|---|
| Mass credential attack / breach campaign hits vendor ecosystem | Match cyberattack **Jan 28, 2026** ("limited amount of user data"); Bumble hit in same campaign (with Panera, CrunchBase) [src: wiki-match.md, wiki-bumble.md] | anomalous login velocity, new-ASN spikes, reset-request storms | 2FA enforcement, argon2id, breached-password screening, session mass-invalidation playbook, breach-notification comms template (pre-drafted) |
| Account takeover via weak reset flow | Grindr **Oct 2020**: password-reset flaw — anyone could take over an account with only the email address [src: wiki-grindr.md] | reset-success from new device/geo within minutes of request | single-use short-TTL reset tokens, no account-existence enumeration, reset-notify to all sessions, step-up on recovery |
| Sensitive-attribute leakage to third-party analytics | Grindr **Apr 2024** High Court suit → **Sep 2026 £26M settlement**: "covert tracking technology," HIV status + sensitive data shared with third-party analytics; 12,000 UK users [src: wiki-grindr.md] | quarterly data-egress inventory; per-vendor field allowlist; DLP-ish logging of SDK network calls | strip sensitive fields at gateway before analytics (§1.2 step 5), SDK allowlist, DPAs per vendor, server-side tagging only, contract review gate |
| Age-verification circumvention by minors | **Persona photo-based verification bypassed with Death Stranding game-character images**; VPN-download spike around the UK deadline [src: wiki-osa.md] | verifier-failure analytics, VPN/geo-IP anomaly flags, in-app reports | method selection above photo-estimation for UK, liveness, re-verify triggers on anomaly, document the residual risk (Ofcom fine ladder proves enforcement is real: 4chan £20k +£100/day Aug 2025 → £520k Mar 2026; Itai Tech £50k+£5k Nov 2025; AVS Group £1M Dec 2025 [src: wiki-osa.md]) |
| NCII posted on-platform | TAKE IT DOWN Act: **signed May 19, 2025** (statute effective date per infobox); **enforcement against online services effective May 19, 2026** (one year after passage); "require covered platforms to remove nonconsensual intimate visual deceptions" [src: wiki-takeitdown.md]; CNN piece on the takedown deadline dated 2026-05-19 captured as link [src: wiki-takeitdown.md] | hash-match at upload (sync gate §1.4), victim/report channel | takedown workflow §6.3; hash list refresh cadence; statutory response window: 48-hour victim-request removal captured only in **as-introduced** bill text [src: wiki-takeitdown.md]; enacted-statute window ❓ — verify text before shipping the SLA |
| Abuse-at-scale trust collapse | 99% of women report abuse (AU study, headline) [src: gdi-home.md]; Trustpilot Tinder 1.1 / Bumble 1.3 / Match 1.0 [src: tp-*.md] | report-rate-per-match as a first-class KPI | moderation pipeline §1.4 + appeals; treat report-rate as an SLO (§8), not a support metric |

**IR process (small-team version):** declare (anyone) → mitigate (rollback deploy flag > hotfix > restore [src: lw-acronis.md]) → preserve (snapshot via images [src: lw-cloud-vps.md] + log pull before cleanup) → notify (users/regulators per §6 clocks) → blameless postmortem within 72h → feed controls back into this table. LW's managed layer covers platform-side investigation (hardware/network/key services) [src: lw-support-levels.md]; everything app-side is on you.

---

## 6. COMPLIANCE DEPLOYMENT REQUIREMENTS

### 6.1 UK age-verification gate routing (OSA)

- Obligation: Ofcom deadline **25 July 2025**; Tinder, Bumble, Feeld, Grindr, Hinge, Reddit (Persona) among services that introduced age verification; fines up to £18M/10% global turnover (digest; statute detail in [src: wiki-osa.md]); Grindr's UK verification went live July 2025 [src: wiki-grindr.md]. Enforcement is active and escalating (£20k→£50k→£520k→£1M ladder, 2025–2026 [src: wiki-osa.md]).
- **Routing design (this architecture):** region resolved at gateway (account country + geo-IP at session start) → UK sessions blocked from user-to-user features until `age_verified=true` → broker call to an external age-assurance vendor (Persona-class — Reddit used Persona for UK verification [src: wiki-osa.md]) → store token/method/timestamp only, never documents. Non-UK sessions skip (Grindr verifies in UK but not US, citing Section 230 [src: wiki-grindr.md]).
- **Circumvention controls:** photo-estimation alone demonstrably bypassable (game-character images defeated Persona [src: wiki-osa.md]); VPN spike at the deadline is documented user behavior [src: wiki-osa.md] — so: geo-IP anomaly → step-up method; velocity limits on verification attempts; periodic re-verification for high-risk cohorts. Counterweight: Wikimedia rejected identity checks on data-minimization grounds [src: wiki-osa.md] — offer method choice where the statute allows, collect the minimum.
- Watch Australia: duty-of-care proposal announced ~Sep 22 2026 [src: gdi-home.md] — build the gate as region-rules config, not UK-only code.

### 6.2 GDPR/DSA data retention + deletion automation

- **Erasure pipeline:** user request or auto-trigger → soft-delete (reversible 7d) → cron hard-purge across OLTP rows, Redis keys, derivatives, object originals, search docs, then **backup-tier note**: Acronis restores can resurrect deleted data until rotation expiry — encrypt backups [src: lw-acronis.md] and disclose backup-retention in the privacy policy (standard DPAs accept this with documented rotation).
- Retention defaults (derived policy, clocks per GDPR/DSA; specific dating-app DSA guidance ❓ not captured — digest §15.7): audit logs 12m; moderation evidence 24m (disputes); account data 30d post-deletion; analytics events pseudonymized 14m.
- The hourly retention sweep and the 90-day event partitioning in §2.3/§2.8 are the enforcement mechanism — compliance that is not a cron job is a press release.

### 6.3 TAKE IT DOWN takedown workflow

Statute: signed into law **May 19, 2025** (statute effective date per infobox); enforcement against online services came into effect **May 19, 2026**, one year after passage [src: wiki-takeitdown.md]; long title requires covered platforms to remove nonconsensual intimate visual deceptions [src: wiki-takeitdown.md]; a CNN piece on the removal deadline dated 2026-05-19 is captured as a link [src: wiki-takeitdown.md]. A 48-hour victim-request removal window appears in the corpus only in as-introduced bill text ("remove such images at the request from the victim within 48 hours" [src: wiki-takeitdown.md]); the enacted statute's exact window ❓ — verify before committing an SLA number.

Workflow: victim/notice intake (in-app + email + legal channel) → hash-extract from reported media → sync-gate hash-set update (blocks re-upload) → takedown of all copies (API + **CDN edge purge** — the documented purge capability [src: lw-cdn.md] is what makes takedown actually complete) → notify reporter → evidence pack to audit log (§6.4) → 14d re-crawl check. Response-time SLO: aggressive internal target (hours) regardless of the ❓ statutory floor; the Grindr £26M settlement [src: wiki-grindr.md] prices what sensitive-media mishandling costs.

### 6.4 Audit logs

- Append-only, WORM-minded: auth events, moderation actions, takedown notices + actions, data-exports/erasures, admin/panel actions, age-verification outcomes (method+result, no payload).
- Integrity: daily hash-chain anchor written off-box (object storage); retention 12m+; exportable as the evidence pack for Ofcom/DSA/GDPR requests — the Ofcom fine ladder includes £5k for *not responding to information requests* [src: wiki-osa.md], so the ability to produce logs quickly is itself a control.
- Access: least-privilege views in admin console; portal-side Activity tab as secondary record of infrastructure actions [src: lw-vps-infra.md].

### 6.5 The Grindr lesson, encoded as architecture

The £26M settlement (HIV status + covert tracking shared with third-party analytics, 12,000 UK users [src: wiki-grindr.md]) becomes three deployable rules: (1) an **egress allowlist** — no analytics/SDK egress except through the gateway's field-stripping layer (§1.2 step 5); (2) sensitive attributes (health, orientation inferences, exact location) never leave the trust boundary in raw form — coarsen or drop; (3) every third-party data flow has a DPA + a documented purpose, reviewable in one page (the audit log records which vendors saw what fields).

---

## 7. COST TABLES PER STAGE

### 7.1 Hosting ladder — structural (LiquidWeb prices ❓ not captured in corpus; never invented)

| Stage | Topology | Units | Add-ons invoked (documented) | Open ❓ |
|---|---|---|---|---|
| 0 | 1 Managed VPS baseline | 1 box | Acronis (VPS-included tier [lw-acronis]), Cloud Firewall [lw-firewall], CDN [lw-cdn], cPanel tier license as domains grow [lw-cpanel-start] | all $ figures |
| 0→1 | resize up | 1 box (bigger) | resize/clone-to-resize [lw-cloud-vps] | price step |
| 1a | +DB VPS | 2 boxes | Cloud Private Network [lw-cloud-vps], Remote-MySQL whitelist [lw-remote-db], block storage if needed | prices |
| 1b | +workers/media VPS | 3 boxes | block storage [lw-cloud-vps], GPU-docs category if local ML [lw-support-levels nav; specs ❓] | prices |
| 1c | dedicated (DB or ML/search) | 3–4 units | IPMI-via-VPN, hardware firewall VPN [lw-dedicated] | prices |
| 2 | cloud/K8s + demoted VPS | cloud spend + 1 VPS | L7 DDoS addon-equivalents at cloud; VPS as backstop (§4) | all cloud prices |

### 7.2 Revenue-grounded budget discipline (corpus anchors)

| Anchor | Value | Use |
|---|---|---|
| Bumble ARPPU (Q2'26) | $21.96 [src: bmbl-q2.md] | infra-per-payer ceiling math |
| Grindr ARPPU | $26.51, +12% ($25.51 CNBC variant — conflict carried, see 04/05) [src: s-grnd.json] | best-case monetization reference |
| Grindr weekly sub | $14.99/wk XTRA [src: s-grindr-price.json] | weekly-billing upside |
| Hinge+ / HingeX | $29.99 / $49.99/mo [src: s-hinge-price.json] | tier ceiling reference |
| Tinder Select | ~$499/mo invite-only [src: tinder-plans.md] | top-tier ceiling |
| Market context | $6.07B 2025, first-ever decline; 23M payers of 350M users [src: businessofapps-market.md] | why capital efficiency is existential — incumbents are impairing (Bumble $404.9M→$169.3M consecutive quarters [src: bmbl-q2.md]) |

Reading: at $21.96 ARPPU, every 100 paying users fund roughly "one VPS-rung" per month **only if** rung prices stay in the low-tens-of-dollars-per-unit range (❓ unverified — fill from LW pricing before budget lock). The structural point survives the ❓: the VPS ladder scales in small steps aligned to payer growth; cloud jumps do not.

### 7.3 Compliance cost drivers

Documented/derived: age-assurance vendor per-verification fees (❓ pricing not captured); Acronis storage-tier overage (quota alerts documented [src: lw-acronis.md]); DDoS L7 addon (❓ price); Ofcom-scale fines as the *cost of getting §6 wrong*: £18M/10%-class statutory maxima with observed enforcement £20k→£1M in year one [src: wiki-osa.md]; litigation-class: Grindr £26M settlement [src: wiki-grindr.md].

---

## 8. SRE BASICS — SLOs, On-Call, Error Budgets for a Small Team

### 8.1 SLOs per stage

| SLI | Stage 0 target | Stage 1 | Stage 2 | Rationale |
|---|---|---|---|---|
| API availability | 99.5% (3.65h/mo budget) | 99.9% (43.2 min/mo) | 99.95% (21.6 min/mo) | single box cannot honestly promise 99.9 — resize/reimage are windowed ops [src: lw-cloud-vps.md, lw-vps-infra.md] |
| API p95 latency | < 400ms | < 300ms | < 250ms | swipe UX |
| Chat delivery p95 (send→delivered, both online) | < 500ms | < 300ms | < 200ms | core-loop feel |
| Match-recompute freshness | < 24h | < 6h | < 15min online | §1.5 |
| Moderation sync-gate p95 | < 1.5s | < 1s | < 700ms | upload UX |
| Report→first-human-action p50 | < 12h | < 4h | < 1h | abuse-stat reality [src: gdi-home.md]; effectively an OSA-adjacent duty-of-care signal (AU proposal [src: gdi-home.md]) |
| Takedown completion | < 24h internal (statutory floor ❓) | < 12h | < 4h + hash-block | §6.3 |
| Backup restore success (quarterly drill) | 100% attempted | 100% | 100% + timed RTO | [src: lw-acronis.md] |

### 8.2 Error budgets & policy

- 99.5% = 3.65h/mo at Stage 0: planned maintenance (WHM/OS updates, windowed reboots, resize ops [src: lw-cloud-vps.md, lw-vps-infra.md]) consumes real budget — schedule via portal Scheduled Tasks [src: lw-vps-infra.md] and batch changes into the same window.
- Policy: budget > 50% consumed → feature freeze for reliability work; budget exhausted → monthly release goes out as fixes-only. Write the policy down before the first bad month, not after.
- Chat/API burn-rate alerting (2%/1h, 5%/6h thresholds) paged to on-call.

### 8.3 On-call (founder-scale)

- Stage 0: **down-only paging** to one phone; LW's managed layer already provides a service-alert team for fully-managed servers with monitoring enabled [src: lw-support-levels.md] — LW pages you for platform death, your blackbox prober (on the status subdomain, §2.2) pages you for app death; the portal Monitoring tab gives LW-side performance graphs [src: lw-vps-infra.md].
- Stage 1: 2 humans, weekly rotation, 30-min ack SLO for pages; runbook-per-alert (each §3 runbook + §5 IR table row = one runbook).
- Stage 2: follow-the-sun unrealistic at this size — keep 2–3 person rotation, buy managed-cloud support tiers, keep the demoted VPS prober independent of the cloud (§4).
- Every page links a runbook; every incident updates one. The corpus's own incident set (§5.3) is the initial runbook backlog.

---

## 9. Sources

**Backbone:** 01-master-facts-digest.md; verification-pass.md (scratch/notes/).

**LiquidWeb corpus (every LW claim above):** lw-cpanel-start.md · lw-support-levels.md · lw-cloud-vps.md · lw-acronis.md · lw-remote-db.md · lw-vps-infra.md · lw-cron.md · lw-cdn.md · lw-firewall.md · lw-caching.md · lw-add-domain.md · lw-dedicated.md (scratch/pages/).

**Industry corpus cited:** businessofapps-market.md · businessofapps-tinder.md · businessofapps-bumble.md · bmbl-q2.md · bmbl-press.md · wiki-bumble.md · wiki-grindr.md · s-grnd.json · s-grindr-price.json · s-hinge-price.json · wiki-match.md · tinder-eng.md · tinder-plans.md · gdi-home.md · tp-tinder.md · tp-bumble.md · tp-match.md · wiki-osa.md · wiki-takeitdown.md · pairs-home2.md.

**Quarantine respected:** tinder-monolith2.md, tinder-monolith3.md, feeld-home.md, businessofapps-grindr.md, businessofapps-revenue.md — not cited.

**Open ❓ register for this deliverable:** all LiquidWeb/cloud dollar prices; GPU-hosting specs (nav-level evidence only); exact TAKE IT DOWN statutory response window (48h figure captured only for the as-introduced bill; enacted-statute wording unverified); EU VAPP/DSA dating-specific obligations; age-assurance vendor pricing; CDN geo-execution capability detail (concept documented, provider specifics beyond captured titles); Feeld/CMB/Muzz pricing irrelevant here but likewise uncaptured.

