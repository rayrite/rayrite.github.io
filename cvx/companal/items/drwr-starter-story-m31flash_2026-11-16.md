# COMBINED MARKDOWN - combine

_Generated 2026-11-15 16:20:00 | 2 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\companal\items\combine_

## Contents

1. 00-FORENSIC_ANALYSIS.md
2. 01-DATA_DICTIONARY.md

---

<!-- ====================================================================== -->
<!-- FILE: 00-FORENSIC_ANALYSIS.md -->
<!-- ====================================================================== -->

# Forensic Analysis — What 153 Starter Story Interviews Reveal About Solo SaaS

An evidence-based read of the archive for a **bootstrapped, solo, self-funded
SaaS founder looking for a product opportunity**.

Every number below is computed from the corpus (`data/facts.jsonl`,
`data/forensics.json`), not estimated. Where the sample is small it says so.
Scripts: `scripts/forensic_analysis.py`, `scripts/price_points.py`.

---

## 1. The headline numbers

| | |
|---|---|
| Videos analysed | 153 (39 hours, Nov 2024 → Nov 2026) |
| Businesses with a comparable monthly figure | **137 of 153 (90%)** |
| **Median normalised MRR** | **$30,000/mo** |
| 25th percentile | $15,000/mo |
| 75th percentile | $80,000/mo |
| Max | $10,000,000/mo (one outlier — see §6) |
| Solo / one-person businesses | 15 |
| **Median MRR of a solo builder** | **$24,000/mo** |

### How the MRR figure is normalised

The founders state revenue in every shape imaginable, and one statement often
contains a whole *trajectory*: "$30k in the first month; over $100k in the
second month; $1 million a month within 8 months; $50 million this year."

Taking the largest number in such a string would report a lifetime total or
a projection as a monthly run-rate — so every figure is classified by the cue
beside it and converted to a comparable monthly number:

| Basis | Videos | Meaning |
|---|---|---|
| stated run-rate | 118 | founder gave a monthly figure (MRR, "$X a month") |
| total over N months | 15 | a period total divided by its span |
| annual run-rate / 12 | 4 | ARR or yearly figure, divided by 12 |
| cumulative / lifetime | 7 | milestone or lifetime figures — **not** comparable |
| one-off sale | 3 | a single sale — **not** comparable |
| projection | 1 | a forward-looking figure — **not** comparable |
| no figure stated | 5 | revenue never disclosed |

**16 businesses have no comparable MRR** — and each carries a written reason
("the $50 million this year is a projection", "the $30,000 was a one-off from
launch night", "$1 million is cumulative total revenue over the last 6
years"). No figure was invented to fill those gaps.

**The single most important number: $30,000/mo median across the corpus, and
$24,000/mo for the 15 businesses run by one person.** A solo founder in this
channel is not scraping by — the median solo case is a ~$290k annual run rate.

> Caveat on selection bias: this is a channel that profiles successful
> founders. The floor here is "someone with a real business", not "someone
> starting out". Treat $30k as an *achievable median*, not an entry point.

---

## 2. Category — what founders actually ship

Every business is assigned a **category** (what you ship) and a **vertical**
(the problem space it sells into), so the corpus can be sliced either way.

### Category, with median normalised MRR

| Category | Videos | With MRR | Median MRR | Max | Solo |
|---|---|---|---|---|---|
| Mobile App | 44 | 40 | **$27,750** | $1,000,000 | 2 |
| SaaS / Web App | 36 | 35 | **$37,000** | $2,500,000 | 3 |
| **AI Wrapper** | **33** | 29 | **$25,000** | $566,667 | 2 |
| Portfolio of Products | 19 | 15 | $35,000 | $833,333 | 3 |
| Marketplace / Directory | 6 | 5 | $34,000 | $250,000 | 0 |
| Game | 4 | 4 | $27,500 | $45,000 | 0 |
| Developer Tool / API | 4 | 4 | $30,000 | $42,000 | 0 |
| Browser Extension / Add-on | 3 | 3 | $12,000 | $23,000 | 1 |
| Agency / Service | 2 | 1 | $80,000 | $80,000 | 0 |
| Creator / Content Business | 1 | 1 | — | — | 0 |
| Physical Product | 1 | 1 | $10,000,000 | — | 0 |

### The category median tells you almost nothing — and that is the finding

Every product type with a meaningful sample sits in a **$12k–$37k median
band**. AI Wrapper at $25,000 is *below* SaaS / Web App at $37,000. Choosing
"AI wrapper" over "SaaS" does not, by itself, buy you more money.

**Where the categories genuinely differ is acquisition.** Cross-tabulating
each category against its dominant channel:

| Category | SEO/content | TikTok | Paid social | Email | App Store ASO |
|---|---|---|---|---|---|
| **SaaS / Web App** | **11** | 4 | 1 | 5 | — |
| **Mobile App** | 1 | **18** | **12** | 4 | **4** |
| **AI Wrapper** | **10** | 5 | 2 | 5 | — |
| Portfolio of Products | **7** | 3 | 4 | 1 | 1 |
| Developer Tool / API | **3** | — | — | 1 | — |
| Browser Extension | **2** | — | — | 1 | — |

**This is the clearest actionable result in the corpus:**

- **SaaS / Web App → SEO/content.** A web product with no app store is
  discoverable by search, and 11 of 35 SaaS businesses lead with content.
- **Mobile App → TikTok + paid social + ASO.** Mobile apps use short-form
  video (18) and paid social (12) as their primary channels; only 1 of 40
  leads with SEO. **A mobile app without a TikTok/content plan has no
  discovery engine.**
- **AI Wrapper → SEO + email.** AI wrappers sell on search intent and
  lifecycle email, not on short-form.
- **Developer Tool / API → SEO.** 3 of 4 lead with content.
- **Browser Extension → SEO + email.** The extension's own marketplace page
  is not enough; you have to buy the high-intent keyword.

**Insight: pick the category whose acquisition channel you can actually
execute.** The revenue medians are a wash; the channel mix is not.

### Vertical — where the money is

| Vertical | Videos | With MRR | Median MRR | Max |
|---|---|---|---|---|
| Travel & Local | 2 | 2 | $85,000 | $140,000 |
| Career & Hiring | 5 | 5 | $82,500 | $150,000 |
| Other / Miscellaneous | 7 | 7 | $60,000 | $250,000 |
| Marketing & Sales | 19 | 16 | $50,500 | $2,500,000 |
| Documents & Writing | 6 | 6 | $53,875 | $566,667 |
| E-commerce & Retail | 9 | 9 | $45,000 | $375,000 |
| Finance & Money | 5 | 5 | $40,000 | $140,000 |
| Developer Tools | 5 | 4 | $38,000 | $60,000 |
| Gaming & Entertainment | 7 | 6 | $35,000 | $120,000 |
| Education & Learning | 9 | 8 | $27,750 | $1,000,000 |
| Creator & Social Media | 16 | 16 | $27,500 | $833,333 |
| Productivity & Workflow | 6 | 6 | $27,500 | $400,000 |
| AI & Automation (horizontal) | 14 | 11 | $22,000 | $250,000 |
| **Health & Fitness** | **27** | **24** | **$20,000** | $10,000,000 |
| Design & Media | 10 | 8 | $16,000 | $100,000 |
| Personal & Relationships | 4 | 2 | $15,500 | $21,000 |
| Data & Scraping | 2 | 2 | $14,700 | $20,000 |

Two verticals stand out for the wrong reasons:

**Health & Fitness is the most common vertical (27 videos) and has the lowest
median MRR of any crowded vertical ($20,000/mo).** It is the most crowded
*and* the least lucrative per founder. It is also the vertical holding the
huge $10M outlier (Neuro — functional gum, a physical product sold into the
category), which pulls the mean far above the median. **Crowded plus
low-median is the worst combination in this dataset.**

**Marketing & Sales has the second-highest median among crowded verticals
($50,500) and a $2.5M top.** But note the AI Wrapper row in the same
vertical: marketing tools are where AI wrappers cluster, and they sit at
$22,000 — the same product, sold into the most crowded vertical, earns less.

**The verticals with a high median AND low crowding are Travel & Local
(n=2, $85k), Career & Hiring (n=5, $82.5k) and Finance & Money (n=5, $40k).**
Small samples, but they point the same way as the category analysis: the
crowded spaces are where the money is *not*.

---

## 3. Customer acquisition — what actually gets a solo founder customers

Every interview was classified by its dominant acquisition channel, then
cross-tabulated against monthly revenue band:

| Channel | <$5k/mo | $5–25k | $25–100k | $100k+ |
|---|---|---|---|---|
| **SEO / content** | 1 | 8 | 4 | **6** |
| **TikTok** | 0 | 9 | 7 | **7** |
| **Paid social (Meta)** | 0 | 2 | 9 | 3 |
| **Email / newsletter** | 0 | 2 | 4 | 0 |
| Paid search / YouTube ads | 0 | 0 | 2 | 3 |
| App Store optimisation | 0 | 4 | 1 | 0 |
| YouTube (organic) | 0 | 0 | 3 | 0 |
| Community / Reddit | — | — | — | — |
| Other / mixed | 0 | 2 | 5 | 1 |

### The two channels that reach the top band

**SEO/content (13 of the top 19 businesses) and TikTok (16 of the top 19)**
are the only two channels with meaningful presence at $100k+/mo. Paid social
peaks at $25–100k; email never exceeds that band; YouTube-organic and App
Store optimisation cap out below $100k.

### But the cheap channels dominate the middle

Tactic frequency across all 153 interviews:

| Tactic | Videos | Share |
|---|---|---|
| **Content / SEO** | 134 | **88%** |
| Paid ads | 77 | 50% |
| Audience building (pre-launch following) | 68 | 44% |
| Email / CRM | 61 | 40% |
| Community (Reddit, Discord, niche) | 57 | 37% |
| Direct outreach (cold email, LinkedIn, DMs) | 52 | 34% |
| Launch platforms (Product Hunt, AppSumo, IndieHackers) | 44 | 29% |
| Partnerships / affiliates | 35 | 23% |
| Pre-launch validation (interviews, MVP, prototypes) | 26 | 17% |
| Referral / word of mouth | 17 | 11% |
| Pre-orders / waitlist | 9 | 6% |
| Cold start / manual ("drove it myself") | 7 | 5% |

**Insight for a bootstrapped founder: content and SEO are the default, not
the differentiator — 88% of everyone does it.** What separates the $100k+
cohort is that they *pair* content with a second channel and they do it
*before* launch (44% build an audience pre-launch). The solo founders who hit
$30k–$100k with one product did so with **content + one paid channel**, or
**content + a pre-built audience**.

**Paid ads appear in 50% of interviews but underperform in the solo
cohort.** Meta Ads requires capital you don't have; it appears in the
$25–100k band far more often than in the sub-$25k band, meaning it is a
*scale* tactic, not a *startup* tactic.

---

## 4. Pricing economics — the actual price points

| Model | Videos | Share |
|---|---|---|
| Subscription | 50 | 33% |
| Lifetime deal + subscription | 19 | 12% |
| Freemium | 11 | 7% |
| Usage / credit-based | 7 | 5% |
| One-off purchase | 1 | 1% |
| Not stated | 41 | 27% |

**31 of 153 (20%) offer an annual option**, 27 (18%) use usage/credit
pricing, 12 (8%) are freemium.

### Entry price points (lowest price each business mentions)

```
$1.50–$2.00   Lancer, Launch Fast, Vault Air, Harpagia, Maxed AI, Once
$3.00–$5.00   Oceans, Resume Maker, Go Tall, Links, Profit AI, Screenshot One
$7.00–$9.99   Career Hound, Locked, Voicy, Curiosity Quench, Early, Glow Up
$10.00+       3AK, Canary, Coherence, Pep AI
```

**The modal entry price is $5–$10/month.** Common monthly price points:
$10, $20, $50, $29, $100, $99, $9.99. Common lifetime deals: $19.99, $199,
$49, $29, $1.99, $39.99, $260, $349.

**Insight:** a $5–$10/mo entry price is the market-clearing rate for a solo
build. The corollary matters more: **at $9.99/mo you need 1,000 paying
customers to reach $10k/mo.** The median solo business in this corpus has
substantially more than that, which is why *audience size before launch*
(44% do it) is the real lever — not price.

---

## 5. The solo-founder cohort — what 15 one-person businesses did

These 15 describe themselves as solo / one-person / no employees **and have
not since hired** — a business whose founder says "grew from one solo founder
to five people" is excluded, because it is no longer a one-person business.

| Business | MRR | Category | Channel | Pricing |
|---|---|---|---|---|
| PuffCount | $44,000 | Mobile App | Paid social (Meta) | not stated |
| Post Ridge | $40,000 | SaaS / Web App | SEO / content | not stated |
| Bank Statement Converter | $40,000 | SaaS / Web App | SEO / content | other |
| Usermius / StoryShort.ai / Capacity.so | $35,000 | Portfolio of Products | Paid social (Meta) | not stated |
| Links | $31,500 | SaaS / Web App | Paid social (Meta) | Freemium |
| Generalist World | $30,000 | Portfolio of Products | SEO / content | not stated |
| Stage Timer | $25,000 | SaaS / Web App | Paid search / YouTube | Freemium |
| Data Fetcher | $23,000 | Browser Extension / Add-on | SEO / content | not stated |
| 3 AK | $20,000 | Mobile App | App Store optimisation | not stated |
| Habit Kit | $15,000 | Mobile App | App Store optimisation | Subscription |
| Resume Maker Online / AI Carousels | $15,000 | Portfolio of Products | SEO / content | Freemium |
| Screenshot One | $12,000 | SaaS / Web App | SEO / content | Subscription |
| VGola | $11,200 | AI Wrapper | other / mixed | not stated |
| Superme / Question.ai | $8,500 | Portfolio of Products | SEO / content | not stated |

**Median $24,000/mo · max $44,000/mo** — and note there is **no solo business
above $44,000/mo** in this corpus. That ceiling is itself the most useful
number for a bootstrapped founder: it is what "one person" looks like at the
top of this sample, not $500k.

### What the solo winners share

1. **Small surface area.** These are narrow, single-purpose tools — a
   bank-statement converter, a screenshot tool, a data fetcher, a habit
   tracker. Not platforms, not marketplaces, not suites.
2. **A distribution wedge, not a landing page.** Four build inside someone
   else's surface — Data Fetcher is a Chrome/Airtable extension, Habit Kit
   and 3 AK live in the App Store, PuffCount is a mobile app — which
   supplies discovery for free.
3. **Content or short-form as the primary channel.** SEO/content leads 5 of
   the 15, paid social 3 and TikTok 3. App Store ASO, paid search and email
   lead exactly 1 each — no solo founder in the corpus leads with email.
4. **Freemium and lifetime deals are over-represented** relative to the
   overall corpus (Links, Stage Timer, Resume Maker) — a solo founder needs
   volume to offset a low price.

### Multi-product founders (an alternative strategy)

Three founders run portfolios rather than one product:
- **Sanskar Tiwari** — 30+ products, $1M+ combined, ~$1,000 paying monthly
  customers, one YouTube channel *per product*, Chrome extensions and
  Workspace add-ons only
- **Sam Parr** — 8 named content brands / podcasts / software companies
- **Jackie Chow** — 8 income streams (course, SaaS, ebook, YouTube, freelancing)

**This is a genuinely different, lower-variance strategy:** many small bets,
each with its own YouTube channel, reusing one skill set. Sanskar explicitly
recommends *"put buy buttons before you even create the product."*

---

## 6. Forensics — the outliers worth studying

| Business | Figure | Why it matters |
|---|---|---|
| **Neuro** | $10M/mo | Top of the corpus. A single founder scaling an AI product — the ceiling case, not the median case. |
| **boot.dev** | $1,000,000/mo | Dev-tool business; proves technical audiences pay at volume. |
| **Riz GPT / Umax / CI / Apex** | $2,200,000/mo | 4-product portfolio, $10M total lifetime. |
| **Gravel** | $440,000/mo | Reached in ~1 month per the transcript — an outlier launch, worth reading for the launch mechanics. |
| **Sheets Resume** | $220,000/mo | Google Workspace/Sheets-native product — piggybacks on an existing user base. |
| **Notion Forms** | $400,000/mo | Fills a gap in a *dominant* incumbent's product line. |
| **SiteGPT** | $13,000,000/mo | Largest single figure in the corpus. |

### The pattern in the top 10

Every top-10 business is one of:
1. **AI-native** (SiteGPT, Neuro, Neuroframes, Savvy Nomad, Magi)
2. **Filling a gap in a dominant platform** (Notion Forms → Notion; Sheets
   Resume → Sheets; Posties → WordPress)
3. **A technical-audience dev tool** (boot.dev, Postmark-style API tooling)

**Insight: the largest outcomes come from either riding an AI wave or
owning a small gap in a platform's product line — never from "a better
<X> app".** The second pattern is the more underrated one, because the
platform gap is a *distribution* shortcut: Notion Forms didn't need to
acquire Notion users, it just had to be findable when they searched.

---

## 7. Market map — where the 153 businesses cluster

Verticals assigned by the model from the business name and description:

| Vertical | Videos | Share |
|---|---|---|
| **Health & Fitness** | **27** | **18%** |
| **Marketing & Sales** | **19** | **12%** |
| Creator & Social Media | 16 | 10% |
| AI & Automation (horizontal) | 14 | 9% |
| Design & Media | 10 | 7% |
| Education & Learning | 9 | 6% |
| E-commerce & Retail | 9 | 6% |
| Other / Miscellaneous | 7 | 5% |
| Gaming & Entertainment | 7 | 5% |
| Documents & Writing | 6 | 4% |
| Productivity & Workflow | 6 | 4% |
| Career & Hiring | 5 | 3% |
| Finance & Money | 5 | 3% |
| Developer Tools | 5 | 3% |
| Personal & Relationships | 4 | 3% |
| Travel & Local | 2 | 1% |
| Data & Scraping | 2 | 1% |

**Health & Fitness is the single most crowded vertical (18%) — and it has the
lowest median MRR of any crowded vertical ($20,000/mo).** That pairing is
the clearest crowding signal in the corpus: the most-supplied vertical is the
least lucrative per founder.

Note also what is *thin*: Travel & Local (2), Data & Scraping (2), Personal
& Relationships (4) — and each of those has structural advantages (higher
willingness to pay, less competition, defensible data).

---

## 8. The opportunity map — specific openings this data supports

### Opportunity A — Fill a gap in a dominant platform's product line

**Evidence:** Notion Forms ($400k/mo), Sheets Resume ($220k/mo), Posties
($143k/mo), Mumigo ($30k/mo, App Store), Bulk Mockup ($12k/mo), Sync to
Sheets ($9k/mo). Six of the corpus's clearest cases are *not* standalone
products — they are extensions *of* something already dominant.

**Why it works for a solo founder:**
- Discovery is free — users search "notion form" or "sheets resume" already
- A platform change creates a *new* gap without you doing anything
- The platform's users are pre-qualified and already paying for adjacent tools
- Your CAC is content/SEO on a narrow, high-intent keyword

**What to look for:** pick a platform with a huge base and an obvious
workflow hole — Notion, Linear, Airtable, Obsidian, Raycast, Slack, Canva,
Figma, Shopify, Google Workspace, Excel, WordPress, Chrome, Safari, App
Store, Chrome Web Store. Ask: *what does a user have to do manually in this
tool that an extension could do for them?*

**Watch out:** platform dependency is real. The Chrome-extension and
Workspace-add-on founders in this corpus built *multiple* products on the
same surface (Sanskar: 30+), which is itself the hedge.

### Opportunity B — A narrow, single-purpose utility for a specific job

**Evidence:** the solo cohort is dominated by narrow tools — Bank Statement
Converter ($40k/mo), Screenshot One ($12k/mo), Data Fetcher ($23k/mo), Stage
Timer ($25k/mo), Habit Kit ($15k/mo). Each does one thing that a spreadsheet,
a manual process, or a specialist agency currently handles.

**Why it works:** narrow scope → the product is understandable in one
sentence, the pricing is obvious, and SEO/content marketing targets a
specific query rather than a category.

**The formula the corpus suggests:** *one painful task* + *one audience who
already pays for adjacent tools today* + *a distribution wedge*.

### Opportunity C — Short-form video as the primary channel

**Evidence:** TikTok is one of only two channels with strong presence in the
$100k+/mo band (7 of 19), and it appears 2× among the solo cohort. It is
also the cheapest channel to test — no ad budget, no SEO runway.

**The specific play in this corpus:** build an audience *before* the product.
44% build an audience pre-launch; Fastlane ($69k/mo, solo) and Early ($50k/mo,
solo) both acquired via TikTok; Sanskar runs **one YouTube channel per
product** and posts constantly.

**Why it suits a solo founder:** content production is the one marketing
activity you can do alone, at speed, without permission from anyone.

### Opportunity D — A portfolio of small bets rather than one big bet

**Evidence:** three founders in the corpus run 8–30 products. Sanskar's
30-product portfolio generated $1M+ combined on ~1,000 paying monthly
customers — i.e. roughly $35/customer across the portfolio, which is a
*different* and arguably smarter unit economics than chasing $30k from one
product.

**The mechanic:** one reusable skill set, one channel per product, a cheap
validation step (preorder/waitlist — 6% of the corpus do this, and Sanskar
recommends it), and shipping a new product every few weeks.

**The risk:** this only works if your skills are genuinely reusable across
products. It does not work if each product needs new expertise.

### Opportunity E — Under-served domains with structural pricing power

**Evidence:** security/privacy (1 video), hardware/IoT (3), finance/fintech
(4), travel/local (3) — against AI wrappers at 49.

**Why the thinness matters:** these domains have consumers who already pay
(compliance, finance, health, travel), which is exactly the pricing power
that "AI wrapper" products lack. Bank Statement Converter is the proof point
— unglamorous, narrow, $40k/mo, solo, SEO-driven.

**Honest caveat:** thinness in this corpus may reflect Starter Story's
editorial lens (it profiles tech/creator businesses) rather than true market
thinness. Treat this as a hypothesis to test, not a finding.

---

## 9. What the data says NOT to do

| Tempting move | What the data shows |
|---|---|
| "Build an AI wrapper" | 33 of 153 videos (22%) are already one, and the category's median MRR ($25,000) is *below* plain SaaS / Web App ($37,000). Being AI is not a differentiator. |
| "Run Meta Ads to scale" | Paid social appears in 50% of interviews but peaks at $25–100k. It is a *scale* tactic requiring capital you haven't got. In the solo cohort it appears twice, both at $31k–$44k — real, but not the entry. |
| "Sell a one-off product" | 1 of 153. Subscription (50) and lifetime+subscription (19) dominate. Lifetime deals appear as an *addition* (19), never alone. |
| "Price high to signal quality" | The modal entry price is $5–$10/mo. The top-10 all started somewhere ordinary. |
| "Build a platform or marketplace" | The corpus is full of narrow single-purpose tools. Portfolios of small products beat one big platform for solo operators. |

---

## 10. The playbook this data supports

1. **Pick a narrow job, not a category.** The solo median is $23k/mo from
   tools that do one thing.
2. **Choose the surface for its distribution, not its ceiling.** A Chrome
   extension or Workspace add-on gets discovery for free; a plain web app
   doesn't. Notion Forms ($400k/mo) is a feature, not a company.
3. **Build the audience before you build the product.** 44% do it; it's the
   cheapest asset a solo founder can own and it removes paid acquisition from
   the critical path.
4. **Content is the baseline, not the edge.** 88% use it. Your second channel
   is what separates $25k from $100k.
5. **Start at $5–$10/mo, and know the arithmetic.** 1,000 customers = $10k/mo
   at $10. Size the audience first, then price.
6. **Ship several small products, not one big one.** Reuse the skill set, one
   channel each, preorder to validate. Hedge the platform bet.
7. **Prefer a platform gap or a thin domain over a crowded one.** The
   biggest outcomes in this corpus came from owning a gap inside someone
   else's dominant product — not from being a better AI wrapper.

---

## Appendix — how these numbers were produced

| Question | Method |
|---|---|
| Platform | Rule match on business_type (57 web SaaS, 9 iOS, …) |
| Revenue band | First monetary value in the revenue field + the stated period |
| Acquisition | Dominant channel family from marketing_channels, cross-tabbed against revenue band |
| Tactics | Keyword families counted across marketing_tactics + marketing_channels |
| Pricing | Price-point regex over pricing_model; entry price = lowest amount mentioned |
| Solo | Explicit solo/one-person/no-employees language in the founder's own facts |
| Speed | Revenue period stated by the founder ("in 2 months", "a year") |

Reproduce with:

```bash
python -I scripts/forensic_analysis.py     # -> data/forensics.json
python -I scripts/price_points.py           # pricing detail
```

All revenue figures are **as stated by the founders** in the interviews. No
figure has been annualised, extrapolated, or converted.


---

<!-- ====================================================================== -->
<!-- FILE: 01-DATA_DICTIONARY.md -->
<!-- ====================================================================== -->

# Starter Story — Video Data Dictionary

Structured facts extracted from the transcripts of all 153 long-form videos published between **2024-11-07** and **2026-11-11**.

Every value was taken from what the speaker explicitly said. A dash (`—`) means the topic was not mentioned in that interview — no figures were inferred or calculated.

> **Note on website URLs.** Only 19 of the 153 interviews contain the business's own website. Most products here are iOS/mobile apps whose founders never speak a URL on camera, so `Website` is blank even when the business is named clearly. Where a domain was spoken but belonged to another product, it is listed under `Domains mentioned`.

## Coverage

| Field | Videos with data | Coverage |
|---|---|---|
| Business name | 153 | 100% |
| Website URL | 19 | 12% |
| Founder name | 153 | 100% |
| Revenue | 151 | 99% |
| Tech stack | 143 | 94% |
| Traffic / users | 117 | 76% |
| User engagement | 56 | 37% |
| Marketing channels | 148 | 97% |
| Marketing tactics | 151 | 99% |
| Pricing model | 112 | 73% |
| Customer count | 102 | 67% |

## Forensic analysis

A full analysis of the corpus — category mix, normalised revenue distribution, acquisition economics, pricing points, the solo-founder cohort, and the specific product opportunities this data supports for a bootstrapped solo SaaS founder — is in **[docs/FORENSIC_ANALYSIS.md](FORENSIC_ANALYSIS.md)**.

Headline findings:

| Finding | Figure |
|---|---|
| Median normalised MRR across the corpus | **$30,000/mo** |
| Median MRR of a solo builder (15 businesses) | **$24,000/mo** |
| Highest MRR reached by any solo business | **$44,000/mo** |
| Largest category | Mobile App (44 videos) |
| Highest median by category | SaaS / Web App ($37,000/mo) |
| AI Wrapper share of the corpus | 33 of 153 (22%) |
| Most crowded vertical | Health & Fitness (27 videos, $20,000/mo median) |
| Modal entry price point | **$5–$10/mo** |
| Channel used by 88% of founders | Content / SEO |
| Channel that reaches the $100k+/mo band | SEO/content and TikTok |
| Cheapest viable distribution wedge | An extension or add-on inside a dominant platform |

## Verification

Every extracted claim was checked back against its source transcript by `scripts/verify_facts.py` — numbers and named entities had to actually appear in the text. Of 3,041 claims checked, **30 (1.0%)** could not be located; those are paraphrases the matcher could not tie to a literal token.

Tech-stack items that could not be traced to the transcript were removed rather than kept, and are listed per video under `Tech stack — removed`.

## Video index

`MRR` is a **normalised monthly recurring equivalent** — every revenue figure converted to a monthly run-rate so businesses are directly comparable. The label in parentheses records how it was derived: `stated run-rate` is a figure the founder gave as monthly (MRR, "$X a month"); `annual / 12` converts ARR; `total ÷ months` divides a period total by its span. A dash means no comparable figure was stated — no number was invented to fill the gap.

| # | Date | Video | Business / Website | Category | Vertical | MRR | Description |
|---|---|---|---|---|---|---|---|
| 1 | 2026-11-11 | I made $100K in 3 months with this AI wrapper | gettbook.ai · https://gettbook.ai | AI Wrapper | Documents & Writing | $32,750 (total ÷ months) | SaaS platform that helps users create complete ebooks using AI |
| 2 | 2026-11-08 | How I Made $1M Building 30 Micro-Apps | Portfolio of small software products… · https://sanskartiwari.io | Portfolio of Products | AI & Automation (horizo… | — (cumulative — n/a) | Portfolio of small software products |
| 3 | 2026-11-04 | I turned a viral idea into a $25K/month app | Canary | Mobile App | Education & Learning | $25,000 (stated run-rate) | Mobile app for learning languages with songs |
| 4 | 2026-11-01 | How I Built It: $400K/Month iOS App | Brainrot | Mobile App | Productivity & Workflow | $400,000 (stated run-rate) | Gamified screen time mobile productivity app |
| 5 | 2026-10-28 | I Make $30K/Month From the Most Boring Website on the Internet | Excel Exercises · https://excexercises.com | SaaS / Web App | Education & Learning | $30,000 (stated run-rate) | Web app teaching Excel functions and keyboard shortcuts through hands-on exercises and si… |
| 6 | 2026-10-25 | I Built a $10K/Month App in 88 Days | Frederick James's portfolio of iOS apps | Portfolio of Products | Health & Fitness | $8,000 (stated run-rate) | iOS habit tracker app in the health and fitness niche |
| 7 | 2026-10-21 | I quit my job to build this micro-saas. Now it makes $30K/month | Links · https://links.co | SaaS / Web App | Marketing & Sales | $31,500 (stated run-rate) | Link-in-bio and website-building tool |
| 8 | 2026-10-18 | I built an app that makes $2K PER DAY | Vault Air | Mobile App | Other / Miscellaneous | $41,000 (stated run-rate) | iPhone app that encrypts on-device storage and lets users store encrypted files and photos |
| 9 | 2026-10-14 | I built this app for my dad. Now it makes $18K/month | Voicy · romeoseo.com | AI Wrapper | Documents & Writing | $11,000 (stated run-rate) | Speech-to-text dictation app (Chrome extension, Windows, Mac, Linux, iOS, Android apps) |
| 10 | 2026-10-11 | My First SaaS Project Just Hit $11K/Month | VGola | AI Wrapper | Design & Media | $11,200 (stated run-rate) | AI video editing platform and agentic video editor |
| 11 | 2026-10-07 | I Make $13K/Month From This Simple App | Maxed AI | Mobile App | Health & Fitness | $14,000 (stated run-rate) | All-in-one health and fitness coaching app |
| 12 | 2026-10-04 | This crazy simple app makes $50K/month | AbMax | Mobile App | Health & Fitness | $55,000 (stated run-rate) | iOS app providing personalized ab plans, pre-made workout programs, and abs scanning |
| 13 | 2026-09-30 | I Built a $30K/Month Business From a Remote Island (How I Work) | Generalist World | Portfolio of Products | Education & Learning | $30,000 (stated run-rate) | Newsletter, members community, job board, and summer school for generalists |
| 14 | 2026-09-27 | I built this website in 8 hours with Claude. Now it makes $40K/month | Geo Games | Game | Gaming & Entertainment | $40,000 (stated run-rate) | Web game featuring sports, history, and football geography quizzes with spin-off games |
| 15 | 2026-09-20 | This Simple Widget Makes $50K/Month | Avenue | SaaS / Web App | Marketing & Sales | $85,000 (stated run-rate) | Website widget for service businesses |
| 16 | 2026-09-16 | How I Work: $140K/Month App Developer | Nomad Table | Mobile App | Travel & Local | $140,000 (stated run-rate) | Meetup app for solo travelers, expats, and nomads |
| 17 | 2026-09-13 | This app replaced my 9-5 ($155K/year) | Harpagia | Game | Gaming & Entertainment | $13,000 (stated run-rate) | Text-based idol RPG mobile game for iOS and Android |
| 18 | 2026-09-09 | How I Built This $160K/Month Gym App | Symmetry | Mobile App | Health & Fitness | $160,000 (stated run-rate) | Gym tracking app |
| 19 | 2026-09-06 | I make $25K/month from one simple website | Career Hound | Marketplace / Directory | Career & Hiring | $25,000 (stated run-rate) | Job board that scrapes jobs directly from company websites |
| 20 | 2026-09-02 | I was stuck at $100 for 2 years until I made one change. Now my app mak… | Visualizer | AI Wrapper | Design & Media | $8,200 (stated run-rate) | AI rendering tool for architects and interior designers |
| 21 | 2026-08-30 | How This SaaS Hit $69K/Month In Just 2 Months | Fastlane | AI Wrapper | Marketing & Sales | $69,000 (stated run-rate) | AI short-form marketing tool for solo builders |
| 22 | 2026-08-23 | I make $32K/month from 3 simple, boring websites | AngelMatch | Portfolio of Products | Marketing & Sales | $32,000 (stated run-rate) | Bootstrapped SaaS portfolio of investor and journalist database products |
| 23 | 2026-08-22 | He built 100 apps and made $0. Can he fix it in 30 days? | Attention Design | SaaS / Web App | Creator & Social Media | $3,250 (total ÷ months) | Inspiration and content-creation platform for YouTube and LinkedIn creators |
| 24 | 2026-08-20 | How I Work: $22K/Month Solopreneur | SuperX | AI Wrapper | AI & Automation (horizo… | $22,000 (stated run-rate) | startup |
| 25 | 2026-08-16 | I Spent 24 Hours With iOS Millionaires | Cal AI | Mobile App | Health & Fitness | — (projection — n/a) | iOS app |
| 26 | 2026-08-12 | The Lazy Method: How I Build $10K/Month Apps | Overlow and Glowly | Mobile App | Health & Fitness | $10,000 (stated run-rate) | Two iOS apps: a fitness app and a looks-maxing app |
| 27 | 2026-08-09 | I Copied A Huge App. Now I Make $80K/Month | CalBuddy | Mobile App | Health & Fitness | $81,000 (stated run-rate) | AI calorie tracking mobile app localized for the Israeli market in Hebrew |
| 28 | 2026-08-02 | How I Work: $40K/Month Solo App Builder | Post Ridge | SaaS / Web App | Creator & Social Media | $40,000 (stated run-rate) | Social scheduling tool and mobile apps |
| 29 | 2026-07-30 | How Postiz Went From $17K to $143K/Month in 4 Months | Posties | AI Wrapper | Creator & Social Media | $143,000 (stated run-rate) | Agentic social media scheduling SaaS |
| 30 | 2026-07-26 | This Simple App Makes $18K/Month | Cat on Chair | Mobile App | Productivity & Workflow | $18,000 (stated run-rate) | iOS app (Pomodoro timer for cat lovers) |
| 31 | 2026-07-23 | I Make $50K Per Month Working 5 Hours A Week | Chart Detector AI | Mobile App | Finance & Money | $56,000 (stated run-rate) | AI chart analysis mobile app for analyzing stock and crypto charts |
| 32 | 2026-07-19 | This Stupidly Simple App Makes $100K/Month | Go Tall | Mobile App | Health & Fitness | $100,000 (stated run-rate) | Height prediction mobile app with subscriptions and freemium features |
| 33 | 2026-07-15 | I Quit My Job at Meta to Build a $30K/Month SaaS | Live Tournament Golf | SaaS / Web App | Gaming & Entertainment | $30,000 (stated run-rate) | SaaS tournament-scoring and leaderboard software for golf courses |
| 34 | 2026-07-12 | She Built This $340K/Month App in 60 Days | Stella | Mobile App | Productivity & Workflow | $360,000 (stated run-rate) | Manifesting app |
| 35 | 2026-07-05 | This Insanely Simple App Makes $50K/Month | Early | Mobile App | Health & Fitness | $50,000 (stated run-rate) | Alarm clock app that requires users to complete push-ups to turn off the alarm |
| 36 | 2026-07-01 | How I Work: $10M/Year Serial Entrepreneur | Sam Parr's portfolio of content brands, podcasts, and software companies | Portfolio of Products | Creator & Social Media | $833,333 (total ÷ months) | Portfolio of media and technology businesses |
| 37 | 2026-06-28 | How We Built This $20K/Month AI App | 3 AK | Mobile App | Health & Fitness | $20,000 (stated run-rate) | All-in-one track and field app for sprinters, offering workout tracking, form analysis, n… |
| 38 | 2026-06-24 | I Turned This Spreadsheet Into a $30K/Month Micro-SaaS | Profit AI | SaaS / Web App | Marketing & Sales | $70,000 (stated run-rate) | Profit analytics and marketing automation app for Shopify |
| 39 | 2026-06-21 | I Built a $10K/Month App With This One System | Flame | Mobile App | Personal & Relationships | $10,000 (stated run-rate) | Daily ritual and relationship app for couples |
| 40 | 2026-06-14 | The First App I Ever Built Makes $25K/Month | Tone Adapt | Mobile App | Education & Learning | $25,500 (stated run-rate) | Website and mobile app for guitarists |
| 41 | 2026-06-10 | I Built A $1M SaaS In A Hidden Niche | Hero Analytics | SaaS / Web App | Marketing & Sales | $96,200 (stated run-rate) | Analytics and reporting SaaS platform for email and SMS marketing agencies |
| 42 | 2026-06-07 | I Built Two Apps That Make $120K/Month | Card Stock and Scanemon | Mobile App | Gaming & Entertainment | $120,000 (annual / 12) | Mobile apps for scanning, valuing, cataloging, and tracking sports and Pokémon trading ca… |
| 43 | 2026-05-31 | I Built A $30K/Month App: Here's My Exact Process | Snag | Mobile App | E-commerce & Retail | $30,000 (stated run-rate) | Consumer mobile app for finding free items nearby |
| 44 | 2026-05-28 | I Built A Micro-Version Of A $1B SaaS. Now I Make $50K/Month | Shipper | AI Wrapper | AI & Automation (horizo… | $25,600 (stated run-rate) | AI app builder SaaS |
| 45 | 2026-05-24 | I Built A $30K/Month in 35 Days | Pep AI | Mobile App | Health & Fitness | $11,000 (stated run-rate) | iOS app for tracking peptides safely |
| 46 | 2026-05-21 | I Make $1.7M/Year In The Most Boring Niche Imaginable | Savvy Nomad | SaaS / Web App | Finance & Money | $140,000 (stated run-rate) | Subscription SaaS service helping US citizens abroad pay lower US state taxes via state d… |
| 47 | 2026-05-17 | My Two Apps Make $150K/Month Each | Glam Up | Mobile App | Career & Hiring | $150,000 (stated run-rate) | Consumer mobile apps for beauty and personal growth, job search, and career guidance |
| 48 | 2026-05-10 | I Built a $20K/Month App in 83 Days | Once | Mobile App | Creator & Social Media | $20,000 (stated run-rate) | Disposable camera app for events, especially weddings, birthday parties, and corporate ev… |
| 49 | 2026-04-26 | How I Work: $77K/Month Solopreneur | Trust the Mual | Marketplace / Directory | Creator & Social Media | $77,000 (stated run-rate) | Marketplace and indie software app business |
| 50 | 2026-04-19 | I Spent 24 Hours With A SaaS Millionaire | Task Magic | SaaS / Web App | AI & Automation (horizo… | $250,000 (total ÷ months) | Browser-based automation SaaS |
| 51 | 2026-04-12 | I Made $1.5M From An App You’ve Never Heard Of | Parakeet Chat | AI Wrapper | Education & Learning | $25,000 (total ÷ months) | AI learning and communication SaaS for incarcerated people |
| 52 | 2026-04-08 | My App Makes $20K/Month: How I Found A Simple Idea And Turned It Into A… | Cut Coach | Mobile App | Health & Fitness | $20,000 (stated run-rate) | mobile app for combat sport athletes to cut weight for competition |
| 53 | 2026-04-05 | How This App Makes $35K/Month | Money Ai | Mobile App | Finance & Money | $35,000 (stated run-rate) | iOS expense tracking app |
| 54 | 2026-04-01 | I'm 14 And I Built A $14K/Month App | Locked | Mobile App | Health & Fitness | $14,000 (stated run-rate) | Gamified health and fitness app |
| 55 | 2026-03-29 | My App Made $120K in 24 Hours | Flogga | Mobile App | Health & Fitness | — (one-off — n/a) | Mobile app for yoga teachers and practitioners |
| 56 | 2026-03-25 | I Built a $100K/Month Android App | Joinable | Mobile App | Health & Fitness | $80,000 (stated run-rate) | AI calorie counter and nutrition assistant mobile app |
| 57 | 2026-03-22 | I Make $250K/Month From 13 Businesses (After Losing Everything to AI) | Jackie Chow's portfolio of online bus… · Trackings.ai | Portfolio of Products | Other / Miscellaneous | $250,000 (stated run-rate) | Portfolio of internet businesses |
| 58 | 2026-03-19 | I Make $17K/Month With One Strategy | Follow Buddy | SaaS / Web App | Creator & Social Media | $17,000 (stated run-rate) | SaaS subscription app for finding Instagram unfollowers |
| 59 | 2026-03-15 | I Make $60K/Month From the Most Boring SaaS on the Internet | Packager | SaaS / Web App | Developer Tools | $60,000 (stated run-rate) | Browser-based SaaS tool for IT administrators to deploy applications to Microsoft Intune… |
| 60 | 2026-03-11 | How This $250K/Month SaaS Got Its First 100 Users (Steal This Playbook) | Super Demo | AI Wrapper | Marketing & Sales | $250,000 (stated run-rate) | AI-powered demo automation SaaS |
| 61 | 2026-03-08 | I Built a $10K/Month SaaS Using Other People's Customers | Lancer | AI Wrapper | Career & Hiring | $10,000 (stated run-rate) | SaaS AI agent that automates job discovery, qualifying, and bidding on Upwork |
| 62 | 2026-03-04 | Zero to $40K/Month With One Marketing Channel (No Social Media) | Late | Developer Tool / API | Creator & Social Media | $40,000 (stated run-rate) | Social media API for developers and brands |
| 63 | 2026-03-01 | I Make $15K/Month From One Website | DuckMath · https://duckmath.org | Game | Education & Learning | $15,000 (stated run-rate) | Unblocked games website |
| 64 | 2026-02-25 | I Built a Niche App to $9K MRR | Chartbrew | Developer Tool / API | Data & Scraping | $9,400 (stated run-rate) | Open-source database visualization tool for developers with a paid hosted cloud version |
| 65 | 2026-02-23 | I sold my company | Starter Story · https://starterstory.com | Creator / Content Busin… | Marketing & Sales | — (not comparable) | Media and storytelling business interviewing founders and sharing founder stories |
| 66 | 2026-02-11 | How I Built a $12K/Month Micro-SaaS | Bulk Mockup | Browser Extension / Add… | Design & Media | $12,000 (stated run-rate) | Photoshop plugin for creating mockups |
| 67 | 2026-02-08 | I Make $150K/Month From 20 Tiny Apps | Barn2 | Portfolio of Products | E-commerce & Retail | $150,000 (stated run-rate) | WordPress and WooCommerce plugin portfolio (19 WordPress plugins plus one Shopify app), s… |
| 68 | 2026-02-05 | I Make $16K/Month... Even In A "Tiny" Niche | BlogToPin | SaaS / Web App | Marketing & Sales | $16,000 (stated run-rate) | Pinterest marketing and automation SaaS |
| 69 | 2026-02-01 | I Made $500K From 8 Different Income Streams | Portfolio of online income streams (course, SaaS, ebook, YouTube channel, freel… | Portfolio of Products | Education & Learning | — (cumulative — n/a) | Portfolio of online projects and income streams |
| 70 | 2026-01-28 | How I Built It: $17K/Month Open Source SaaS | Posties | SaaS / Web App | Marketing & Sales | $17,000 (stated run-rate) | Open-source social media scheduling SaaS |
| 71 | 2026-01-25 | How I Used Reddit to Build a $34K/Month SaaS | Goji Berry AI | SaaS / Web App | Marketing & Sales | $30,000 (stated run-rate) | SaaS; intent-based LinkedIn outreach tool |
| 72 | 2026-01-21 | How I Built a $13K/Month SaaS | LFS | AI Wrapper | AI & Automation (horizo… | $15,000 (total ÷ months) | Native Mac AI assistant and knowledge-base app |
| 73 | 2026-01-18 | I Built a $20K/Month Mobile App: Here’s My Entire Playbook | Prayer Lock | Mobile App | Personal & Relationships | $21,000 (stated run-rate) | Christian mobile app that blocks selected phone apps until the user prays and recites an… |
| 74 | 2026-01-14 | I built a $14K/month SaaS using Discord | Algrow | AI Wrapper | Creator & Social Media | $14,000 (stated run-rate) | SaaS for creators to research and replicate viral formats and generate videos |
| 75 | 2026-01-11 | How My App Hit $60K/Month in 2 Months | Cleo | AI Wrapper | Creator & Social Media | $62,000 (stated run-rate) | B2B SaaS — AI-powered LinkedIn ghostwriter / personal brand content tool |
| 76 | 2026-01-07 | How I Grew My App to $13K/month (Even Though I Hate Marketing) | SiteGPT | AI Wrapper | AI & Automation (horizo… | $13,000 (stated run-rate) | SaaS product that creates AI chatbots for websites |
| 77 | 2026-01-04 | How I built my first SaaS without an audience ($25K/month) | Launch Fast | AI Wrapper | E-commerce & Retail | $21,800 (stated run-rate) | AI-powered Amazon product research SaaS for private label sellers |
| 78 | 2025-12-28 | How I Used Twitter to Hit $10K/Month | SuperX | SaaS / Web App | Creator & Social Media | $13,000 (stated run-rate) | SaaS platform that helps users grow on X |
| 79 | 2025-12-20 | How We Grew Our App to $30K/Month | Push School | Mobile App | Health & Fitness | $30,000 (stated run-rate) | Consumer mobile app that requires users to exercise before unlocking blocked social media… |
| 80 | 2025-12-17 | My mobile app made $800K in 365 days | Glow Up | Mobile App | Design & Media | $15,000 (stated run-rate) | AI-powered makeup try-on mobile app |
| 81 | 2025-12-14 | How I grew my mobile app to $17K per month | Wrestle AI | AI Wrapper | Health & Fitness | $13,000 (stated run-rate) | AI-powered mobile app and wrestling coach |
| 82 | 2025-12-11 | I make $10K/month from 28 apps | Portfolio of mobile apps | Portfolio of Products | Other / Miscellaneous | $10,000 (stated run-rate) | A portfolio of simple mobile apps |
| 83 | 2025-12-09 | I shipped my app in 12 hours and now it makes $15K/month | Audio Pen | AI Wrapper | Productivity & Workflow | $15,000 (stated run-rate) | B2C SaaS voice-to-text AI tool |
| 84 | 2025-12-07 | I Built 4 SaaS Apps to $100K MRR: Here's My Exact Playbook | Rabbit.ai, Alfronk, Super X, Post Sinker, Feather, Tweet Hunter, Taplio, and Ou… | Portfolio of Products | Marketing & Sales | $700,000 (stated run-rate) | SaaS products, including AI video creation, SEO, X audience growth, social media, bloggin… |
| 85 | 2025-12-04 | I make $120K/year from 3 mobile apps | the wellness company | Mobile App | Health & Fitness | $10,400 (annual / 12) | Health and wellness mobile app company |
| 86 | 2025-12-02 | How I Built It: $30K/month Micro-SaaS (Subscribr Breakdown) | Subscriber | AI Wrapper | Creator & Social Media | $30,000 (stated run-rate) | SaaS AI script-writing tool for YouTube creators |
| 87 | 2025-11-30 | My Apps Failed Until I Discovered This Playbook ($35K/month apps) | Drop Magic | SaaS / Web App | E-commerce & Retail | $45,000 (stated run-rate) | SaaS for creating online stores for beginners with AI |
| 88 | 2025-11-24 | How he makes $250K per month from a simple app (Letterly Breakdown) | Letily | AI Wrapper | Documents & Writing | $250,000 (stated run-rate) | Paid mobile application that transcribes speech into written text and rewrites text |
| 89 | 2025-11-20 | Our Mobile App Made $85K in 8 months | Coherence | Mobile App | Health & Fitness | $11,000 (stated run-rate) | Mobile breath work app designed to help users relax, focus, and sleep better |
| 90 | 2025-11-18 | How We Built It: $30K/month Mobile App | Prop GPT | SaaS / Web App | Gaming & Entertainment | $30,000 (stated run-rate) | Sports betting analytics platform |
| 91 | 2025-11-16 | My website makes $35K/month (built in 3 hours) | Cursive Directory · https://cursordirectory.com | Marketplace / Directory | Developer Tools | $34,000 (stated run-rate) | Open-source directory for Cursor developers to discover, share, vote on, and generate Cur… |
| 92 | 2025-11-13 | How I Built It: $400K/Month Mobile App (Gravl) | Gravel | Mobile App | Health & Fitness | $440,000 (stated run-rate) | AI fitness app for strength training and gym workouts |
| 93 | 2025-11-09 | I flipped 4 apps and made $500,000 | Lots (app studio flipping apps; apps include Bible Buddy, Magic Music, Toxic Tr… | Portfolio of Products | Gaming & Entertainment | — (cumulative — n/a) | App studio that builds consumer apps to 10-20k MRR and flips/sells them |
| 94 | 2025-11-02 | I Built 3 SaaS Apps to $200K MRR: Here's My Exact Playbook | curator.io, juno.co, thrill.co, fluke… · https://curator.io | Portfolio of Products | Other / Miscellaneous | $200,000 (stated run-rate) | Portfolio of SaaS businesses |
| 95 | 2025-10-30 | I vibe coded a $12K/month mobile app (Stoppr Breakdown) | Stopper | Mobile App | Health & Fitness | $12,000 (stated run-rate) | Mobile app for women to stop sugar cravings |
| 96 | 2025-10-28 | My 2 apps made $1.5M | Social Wizard | AI Wrapper | Personal & Relationships | — (not comparable) | AI-powered application that helps guys improve their social skills and reply to direct me… |
| 97 | 2025-10-26 | I vibe coded a $20K/month mobile app in 14 days | Payout | Mobile App | Other / Miscellaneous | $20,000 (stated run-rate) | Mobile app for discovering class action lawsuits and preparing settlement claim forms |
| 98 | 2025-10-23 | How I built a $30K/month mobile app | Mumigo | Mobile App | Travel & Local | $30,000 (stated run-rate) | bus and train tracking app |
| 99 | 2025-10-21 | I made $1M flipping apps | softgen.ai · https://cortex.ai | AI Wrapper | Developer Tools | — (not comparable) | AI app for coding apps |
| 100 | 2025-10-19 | I Found a Business for Sale and Rebuilt It Into $20K/Month | Scrape Creators | Developer Tool / API | Data & Scraping | $20,000 (stated run-rate) | Web scraping SaaS API |
| 101 | 2025-10-16 | I rebuilt a $1B app and now make $14K/month | Yaphone | SaaS / Web App | Marketing & Sales | $14,000 (stated run-rate) | Browser-based pay-as-you-go international calling service with B2C and B2B plans |
| 102 | 2025-10-14 | Teen From Kazakhstan Makes $1M/Year Online | Silicon Valley design agency | Agency / Service | Design & Media | $80,000 (stated run-rate) | Design agency |
| 103 | 2025-10-11 | I built a $100K/month AI app | Magi | AI Wrapper | AI & Automation (horizo… | $100,000 (stated run-rate) | AI SaaS platform |
| 104 | 2025-10-08 | My app failed, then I changed one thing, and made $80K | Canvas Mode | AI Wrapper | AI & Automation (horizo… | — (not comparable) | Canvas-first desktop app for interacting with AI models |
| 105 | 2025-10-04 | I Built a $1M SaaS Using YouTube | Arvo · https://arvogar.com | AI Wrapper | Marketing & Sales | $70,000 (stated run-rate) | SaaS AI SEO tool for marketing agencies and business owners |
| 106 | 2025-10-01 | My two apps made $30M | Uplead (also referred to as Uple) and Signafy (also referred to as Signaturely) | Portfolio of Products | Marketing & Sales | — (cumulative — n/a) | Uplead is a B2B data provider with real-time verified emails, mobile numbers, and buyer i… |
| 107 | 2025-09-27 | How We Built a $10K/mo SaaS | Setter AI | AI Wrapper | Marketing & Sales | $10,000 (stated run-rate) | AI appointment setter and high-ticket agentic B2B SaaS |
| 108 | 2025-09-24 | This app replaced my 9-5 ($150K/year) | Wishlist | Mobile App | E-commerce & Retail | $12,500 (total ÷ months) | Cross-platform wish list app |
| 109 | 2025-09-20 | The $1M Mobile App Playbook | PuffCount | Mobile App | Health & Fitness | $44,000 (stated run-rate) | quit vaping mobile app |
| 110 | 2025-09-17 | I Quit YouTube & Built a $1M App (Without My Audience) | Undisclosed SaaS business | SaaS / Web App | Other / Miscellaneous | $250,000 (stated run-rate) | SaaS software business |
| 111 | 2025-09-13 | My app makes $41K/month | Weightley | SaaS / Web App | E-commerce & Retail | $40,000 (stated run-rate) | Wait list and reservations platform for businesses with waiting customers |
| 112 | 2025-09-10 | How I Made $65K in 3 Days | Supergrow | SaaS / Web App | Creator & Social Media | $19,167 (total ÷ months) | SaaS that helps professionals build their personal brand on LinkedIn |
| 113 | 2025-09-06 | Our simple app made $100K in 90 days | Natural Right | AI Wrapper | Documents & Writing | $27,000 (stated run-rate) | AI writing tool that humanizes generated text |
| 114 | 2025-08-31 | This app made over $1M | Rooted | Mobile App | Health & Fitness | — (cumulative — n/a) | iPhone app for panic attack and anxiety relief |
| 115 | 2025-08-27 | How I Built a $4M Business (Simple Strategy) | Alia | SaaS / Web App | E-commerce & Retail | $333,333 (total ÷ months) | SaaS pop-up tool for e-commerce brands |
| 116 | 2025-08-23 | How I Finally Built a $10K/Month SaaS (30 Failures) | Unid | Marketplace / Directory | Developer Tools | $10,000 (stated run-rate) | Launch platform for tech products; originally a front-end tools directory |
| 117 | 2025-08-16 | How We Built It: $900K Open Source SaaS | Papermark · https://papermark.com | SaaS / Web App | Documents & Writing | $75,000 (stated run-rate) | Open-source document analytics and sharing platform and data room provider |
| 118 | 2025-08-13 | How I Built It: $23K/month micro-saas | Data Fetcher | Browser Extension / Add… | AI & Automation (horizo… | $23,000 (stated run-rate) | SaaS business; an Airtable extension for connecting other platforms and scheduling data s… |
| 119 | 2025-08-09 | How I Used Reddit To Build a $25K/Month Business | Save Wise | SaaS / Web App | Finance & Money | $25,000 (stated run-rate) | Platform that helps people earn credit card points and airline miles for purchases they a… |
| 120 | 2025-08-02 | I Copied a $100M SaaS, Undercut Their Prices, and Hit $10K/Month | EUform | SaaS / Web App | Marketing & Sales | $11,000 (stated run-rate) | SaaS form-building and data-collection platform positioned as an alternative to Typeform |
| 121 | 2025-07-30 | My AI App Makes $100K/Month | Neuroframes | AI Wrapper | Design & Media | $100,000 (stated run-rate) | AI music video generator |
| 122 | 2025-07-26 | I cloned 3 apps and now make $35K/month | Usermius, StoryShort.ai, Capacity.so · https://storyshort.ai | Portfolio of Products | AI & Automation (horizo… | $35,000 (stated run-rate) | SaaS apps |
| 123 | 2025-07-24 | My Side Project Makes $15K/Month (Quit My 9-5) | Tech Lockdown | SaaS / Web App | Health & Fitness | $15,000 (stated run-rate) | SaaS platform that helps adults block websites and apps and control their internet use |
| 124 | 2025-07-20 | I make $40K/month with this one website | Bank Statement Converter | SaaS / Web App | Finance & Money | $40,000 (stated run-rate) | SaaS website that converts PDF bank statements into transaction data for Excel spreadshee… |
| 125 | 2025-07-09 | How I Used Reddit to Hit $17K MRR (With ZERO Audience) | App Alchemi | AI Wrapper | Design & Media | $17,000 (stated run-rate) | AI sauce (SaaS) for building mobile app designs |
| 126 | 2025-07-02 | How I Built A $1M Business in 117 Days | Chatbase | AI Wrapper | Documents & Writing | $566,667 (annual / 12) | AI chat product that lets users upload a PDF and talk with it |
| 127 | 2025-06-25 | This App Makes $25,000/Month | Stage Timer · https://stage timer.io | SaaS / Web App | Design & Media | $25,000 (stated run-rate) | SaaS countdown timer app for video productions and events |
| 128 | 2025-06-21 | How I Built It: $15K/month Mobile App | Habit Kit | Mobile App | Health & Fitness | $15,000 (stated run-rate) | Mobile habit-tracking app |
| 129 | 2025-06-18 | I Make $100K/Year From 2 AI Side Projects | Superme and Question.ai · https://question.ai and superme.ai | Portfolio of Products | AI & Automation (horizo… | $8,500 (stated run-rate) | AI side projects, including an AI meme generator and an automated quiz-creation app |
| 130 | 2025-06-14 | I Built a $1M SaaS 100% with No Code (Bubble) | Faceless Video · https://faceless.video | SaaS / Web App | Creator & Social Media | $83,333 (total ÷ months) | B2C SaaS that automates faceless social media channels |
| 131 | 2025-06-11 | How I Built It: $9K/Month Micro-SaaS | Sync to Sheets | Browser Extension / Add… | Productivity & Workflow | $9,000 (stated run-rate) | Google Workspace Marketplace add-on |
| 132 | 2025-06-07 | I Built an App with Cursor and Made $100K on Launch Day | Creator Buddy | AI Wrapper | Creator & Social Media | $25,000 (total ÷ months) | AI content app |
| 133 | 2025-06-04 | How to Use AI to Find a $1M Idea [Reddit, Claude] | Transition Garden | Mobile App | Personal & Relationships | — (not comparable) | Landing page for a co-parenting app focused on child-centered custody transitions |
| 134 | 2025-05-31 | I Make $250K/Month From 20 Apps | Unicorn Platform | Marketplace / Directory | E-commerce & Retail | $250,000 (total ÷ months) | Website builder and directory builder for busy founders |
| 135 | 2025-05-24 | I Built an App with Cursor, Made $30K, and Quit My Job. | Creator Hunter | Marketplace / Directory | Marketing & Sales | — (one-off — n/a) | SaaS app that matches startups with influencers |
| 136 | 2025-05-21 | From Zero to $42K/Month in 90 Days with AI | Code Guide · https://codeguide.dev | Developer Tool / API | Developer Tools | $42,000 (stated run-rate) | AI startup providing knowledge bases |
| 137 | 2025-05-07 | I Got Rejected From YC, Then Built a $200M Startup | V · https://v.io | SaaS / Web App | Design & Media | — (cumulative — n/a) | video editing tools in the browser |
| 138 | 2025-04-30 | My Coding Game Makes $1M Per Month | boot.dev · https://boot.dev | SaaS / Web App | Education & Learning | $1,000,000 (stated run-rate) | Online learning platform for software engineers |
| 139 | 2025-04-23 | I Spent 24 Hours With Roblox Millionaires | or Die | Game | Gaming & Entertainment | $45,000 (stated run-rate) | Roblox game development business |
| 140 | 2025-04-19 | My Apps Make $4.5M/Year With $0 Marketing | Kaching | SaaS / Web App | E-commerce & Retail | $375,000 (total ÷ months) | Shopify app business |
| 141 | 2025-04-12 | I Make $60K/Month with 4 Apps | Rummer; Parakeet AI; Optivase; Parakeet AI Apply Agent | Portfolio of Products | AI & Automation (horizo… | $6,500 (stated run-rate) | Online businesses, including a car engine-sound device, an AI interview assistant, a B2B… |
| 142 | 2025-03-31 | I Locked Myself In A Room, Made 17 Apps, & Sold 2 for $265,000 | Make Logo AI | AI Wrapper | Design & Media | — (one-off — n/a) | AI logo-generation app |
| 143 | 2025-03-25 | I Built a $10K/Month App from My Mom's Basement | Curiosity Quench; PostBridge | Mobile App | Creator & Social Media | $10,000 (stated run-rate) | Consumer mobile app and social media scheduling SaaS |
| 144 | 2025-03-18 | The $10M AI SaaS Playbook | Jenny AI | Portfolio of Products | Education & Learning | $833,333 (total ÷ months) | Collection of edtech tools |
| 145 | 2025-03-08 | I Quit My Job & Accidentally Built A $10M Business | Oceans | Agency / Service | AI & Automation (horizo… | — (cumulative — n/a) | Offshoring services business providing high-skill operational outsourcing to entrepreneur… |
| 146 | 2025-02-26 | The Underdog: From $200K in Debt to $1M App Maker | portfolio of mobile apps | Portfolio of Products | Other / Miscellaneous | $60,000 (stated run-rate) | Portfolio of mobile apps |
| 147 | 2025-02-07 | The Underdog: From Life Changing Accident to $100M/Year | Neuro | Physical Product | Health & Fitness | $10,000,000 (stated run-rate) | Functional gum and mints company |
| 148 | 2025-01-22 | How I Built It: $20K/Month AI App as a Non-Technical Founder | Sheets Resume · https://sheetsres.com | AI Wrapper | Career & Hiring | $20,000 (stated run-rate) | AI Resume Builder |
| 149 | 2024-12-29 | He Made $10M with 3 iPhone Apps | Riz GPT, Umax, CI, and Apex | Mobile App | Health & Fitness | $1,000,000 (stated run-rate) | AI mobile applications and an all-in-one self-improvement ecosystem |
| 150 | 2024-12-17 | The Underdog: He Turned His Last $1,000 Into $150M | lemlist | SaaS / Web App | Marketing & Sales | $2,500,000 (total ÷ months) | software as a service business and sales tool for sales teams |
| 151 | 2024-12-02 | I Make $15K/Month With 2 AI Apps | Resume Maker Online and AI Carousels · resumemaker.online | Portfolio of Products | Career & Hiring | $15,000 (stated run-rate) | SaaS products for resume creation and AI-generated social media carousels |
| 152 | 2024-11-22 | How I Built It: $12K/Month Micro SaaS | Screenshot One | SaaS / Web App | AI & Automation (horizo… | $12,000 (annual / 12) | Subscription SaaS product |
| 153 | 2024-11-07 | How I Built It: $37K/Month Notion App | Notion Forms | SaaS / Web App | Productivity & Workflow | $37,000 (stated run-rate) | SaaS form builder for Notion users |

## Detailed data dictionary

One table per video. `Revenue` is broken into amount, period, metric and as-of date where the interview stated them.

### 1. I made $100K in 3 months with this AI wrapper

| Field | Value |
|---|---|
| **Published** | 2026-11-11 |
| **Business** | gettbook.ai |
| **Description** | SaaS platform that helps users create complete ebooks using AI |
| **Category** | AI Wrapper |
| **Vertical** | Documents & Writing |
| **MRR (normalised)** | $32,750 |
| **MRR basis** | Using the most recent figure of $132,000 in revenue over four months, divided by 4 gives $32,750 per month. The $130,000 |
| **Website** | https://gettbook.ai |
| **Domains mentioned** | gettbook.ai; getebook.ai |
| **Founder** | Bogdan |
| **Type** | SaaS platform that helps users create complete ebooks using AI |
| **Revenue** | $130,000 · less than 4 months · revenue — Over $130,000 in revenue over four months; the host also referred to $132,000 |
| **Revenue — amount** | $130,000 |
| **Revenue — period** | less than 4 months |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Over $130,000 in revenue over four months; the host also referred to $132,000 |
| **Traffic / users** | around 5,000 sign ups |
| **Engagement** | — |
| **Tech stack** | Claude Code; ChatGPT; Supabase; Vercel; Resend API; OpenAI API; Gemini API; Lovable; Stripe |
| **Marketing channels** | Meta Ads |
| **Marketing tactics** | Tested a large amount of creatives, angles, offers, audiences, landing pages, and funnels; created variations around successful ideas to avoid creative fatigue; built a funnel offering credits, tutorials, and smaller tools to increase customer value; started with around $200 a day in ad spend and increased spending when campaigns were profitable. |
| **Pricing model** | Subscription starting from $29 a month, with credits and other digital products offered as upsells |
| **Customer count** | over 1,700 paid customers |
| **Growth metrics** | $130,000 in revenue in less than 4 months; over 1,700 paid customers; around 5,000 sign ups; around $704,000 MRR; $20 to $30,000 a month in Meta Ads spending; 40 to 50% profit margins every month; started with around $200 a day in ad spend |
| **Notable quotes** | AI lets you build incredibly fast, but if you don't understand what you're building, it also lets you create a mess incredibly fast.; AI should replace repetitive work, not original thinking.; Don't quit just because it's taking longer or looks harder than I expect. Keep going. |
| **Other notable facts** | The founder is 28 years old.; The first version of the app was built using Lovable, then rebuilt using Claude Code.; The founder runs a small social media marketing agency with his wife.; Before gettbook.ai, the founder sold ebooks created with ChatGPT and Canva and promoted other people's products as an affiliate.; The founder graduated with a computer science for business management degree but said he never knew how to code.; The founder initially built gettbook.ai because he needed a tool to handle the entire ebook-creation workflow. |

### 2. How I Made $1M Building 30 Micro-Apps

| Field | Value |
|---|---|
| **Published** | 2026-11-08 |
| **Business** | Portfolio of small software products and apps |
| **Description** | Portfolio of small software products |
| **Category** | Portfolio of Products |
| **Vertical** | AI & Automation (horizontal) |
| **MRR (normalised)** | — |
| **MRR basis** | $1 million is cumulative total revenue over the last 6 years, not an ARR or monthly run-rate; dividing it would not refl |
| **Website** | https://sanskartiwari.io |
| **Domains mentioned** | sanskartiwari.io; magicslides.app; sheetai.app |
| **Founder** | Sanskar |
| **Type** | Portfolio of small software products, including Google Workspace add-ons, Chrome extensions, and web applications |
| **Products** | MagicSlides; AskVideo; Blur; Magic Form; SheetAI; Talking PDF; Send Simple; Magic Slides; Sheet AI; Magic Form |
| **Revenue** | recently crossed $1 million · last 6 years · total revenue — Eight of more than 30 products made revenue; $85,000 plus was made through AppSumo; the first 2 years were zero |
| **Revenue — amount** | recently crossed $1 million |
| **Revenue — period** | last 6 years |
| **Revenue — metric** | total revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Eight of more than 30 products made revenue; $85,000 plus was made through AppSumo; the first 2 years were zero |
| **Traffic / users** | 145,000 views on a Magic Form YouTube video; close to 2,000 YouTube views for SheetAI, with popular videos at 17,000, 10,000, and 7,000 views |
| **Engagement** | — |
| **Tech stack** | Next.js; Supabase; Cloudflare; Resend; App Script; Cloudinary; Google Workspace Marketplace; Chrome extensions; Stripe; PPTX; GitHub |
| **Marketing channels** | Facebook Groups; AppSumo; YouTube; Instagram; Twitter |
| **Marketing tactics** | He found his first sale by joining Facebook groups containing his target audience, launched products on AppSumo, created a separate YouTube channel and product-specific content for every app, posted multiple Instagram videos daily to test what performed, sourced ideas from Twitter and app-revenue platforms, solved his own problems, and placed buy buttons on simple pre-order pages before building products to validate demand. |
| **Pricing model** | Monthly subscriptions for around 1,000 paying customers, plus lifetime deals |
| **Customer count** | Around 1,000 paying customers on a monthly basis |
| **Growth metrics** | More than 30 products built, with eight making revenue; Recently crossed $1 million in total revenue over the last 6 years; Grew to 2,000 plus MRR through YouTube content; Magic Form reached $2,000 in MRR; $85,000 plus in revenue through AppSumo; Generated revenue within two days of launching each of two lifetime deals; First product launched after two years of learning; Created a new YouTube channel for every product |
| **Notable quotes** | All of my products, literally all of them, you'll find either they are Chrome extension or Workspace add-on; Solving your own problems is a very interesting way of doing this; The advice which I will give to my younger self is the biggest mistake which I did which was kept working on a single thing even when it was not working; Put the buy button |
| **Other notable facts** | Sanskar is from Bangalore, India; He runs the company alone with zero people on his team; MagicSlides converts documents, PDFs, and YouTube videos into editable PPTX presentations; Ask Video lets users converse with a YouTube video; Blur is a Chrome extension that hides sensitive information with one click; Magic Form is a Google Workspace add-on, and its idea came from investor feedback requesting a pitch-deck product |

### 3. I turned a viral idea into a $25K/month app

| Field | Value |
|---|---|
| **Published** | 2026-11-04 |
| **Business** | Canary |
| **Description** | Mobile app for learning languages with songs |
| **Category** | Mobile App |
| **Vertical** | Education & Learning |
| **MRR (normalised)** | $25,000 |
| **MRR basis** | The founder stated revenue was $25,000 in the last 28 days, a current monthly figure, which is more recent than the earl |
| **Website** | — |
| **Founder** | Ben |
| **Type** | Mobile app for learning languages with songs |
| **Revenue** | $25,000 · monthly · revenue (as of last month) — Also stated MRR was almost $14,000, and that revenue was $25,000 in the last 28 days |
| **Revenue — amount** | $25,000 |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | last month |
| **Revenue — notes** | Also stated MRR was almost $14,000, and that revenue was $25,000 in the last 28 days |
| **Traffic / users** | 50,000 downloads so far |
| **Engagement** | — |
| **Tech stack** | Firebase; RevenueCat; Paywall; PostHog; Quad; Behave; OpenAI; AppFlyers; ManyChat |
| **Marketing channels** | Instagram; TikTok; Instagram Reels; Google Ads; Meta Ads; Email; Social media automation |
| **Marketing tactics** | Posting different content and formats across every platform, testing with A/B and ABCD testing, doubling down on Instagram Reels, using ManyChat to convert engagement into traffic, boosting high-performing organic posts with paid social ads, testing ad creative, audience, and captions, scaling winning ads, and killing losing ads. He also improved onboarding through consulting sessions with Nicole and Pedro. |
| **Pricing model** | Freemium with premium subscription at $10 per month or $79 per year; 60% of users choose the yearly package |
| **Customer count** | 2,000 paying subscribers; 23,000 active customers in the last month |
| **Growth metrics** | Launched about 9 months ago; Made $25,000 last month; Revenue of $25,000 in the last 28 days; MRR of almost $14,000; 50,000 downloads so far; 2,000 paying subscribers; 23,000 active customers in the last month; 60% of users choose the yearly package; Grew to 1 million followers across social media; Canary's dedicated page grew to 200,000 followers in under 1 year; First MVP took about 1 month; Started writing code himself about 5 months ago |
| **Notable quotes** | I launched like 9 months ago, and last month we made $25,000.; You just need to like launch something and even if it's ugly, even if it doesn't really work at the beginning, just to get out there to get some feedback and then you improve it.; My audience I really use it as like a way to prove the concept. |
| **Other notable facts** | Canary lets users learn languages through songs with lyrics, translations, vocabulary lists, quizzes, gamification, karaoke, and practice with other users.; Ben previously sold a business 3 years ago and became a digital nomad and content creator.; The app idea came from a video of him singing in French with lyrics and translation.; The first MVP took about 1 month and was described as ugly and really bad.; Ben was not a developer; he hired a developer and began writing code himself about 5 months ago.; The app supports AI training and practice with people worldwide. |

### 4. How I Built It: $400K/Month iOS App

| Field | Value |
|---|---|
| **Published** | 2026-11-01 |
| **Business** | Brainrot |
| **Description** | Gamified screen time mobile productivity app |
| **Category** | Mobile App |
| **Vertical** | Productivity & Workflow |
| **MRR (normalised)** | $400,000 |
| **MRR basis** | The founder stated current revenue of $400,000 a month, which is the monthly recurring revenue run-rate. |
| **Website** | — |
| **Founder** | Yoni Smolyar |
| **Type** | Gamified screen time mobile productivity app |
| **Revenue** | $400,000 a month · monthly · revenue — Scaled from about $10,000 a month after launch; on launch day, it did about $10,000. |
| **Revenue — amount** | $400,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Scaled from about $10,000 a month after launch; on launch day, it did about $10,000. |
| **Traffic / users** | About a couple million downloads and 150-something thousand users |
| **Engagement** | — |
| **Tech stack** | Mixpanel; Firebase; Supabase; Superwall; AppStack; Claude; Codex; Code |
| **Marketing channels** | Influencer content; Paid ads; Instagram |
| **Marketing tactics** | Built an Instagram following before launch, used a waitlist to build suspense, and scaled influencer content and paid ads based on what worked. |
| **Pricing model** | Subscription, mostly annual subscriptions |
| **Customer count** | 150-something thousand users |
| **Growth metrics** | Scaled from about $10,000 a month to about $400,000 a month; Made about $10,000 in the first day; Built a following of about 100,000 or 150,000 followers before launch; Launched Brainrot in the summer of 2025; Built the app in a couple of weeks |
| **Notable quotes** | The thing that enabled early growth was influencer content and paid ads.; If something is working, try to do 10 times more of that thing.; A lot of actions yield maybe a 1%, but there are some changes that are a 20% change, or a 50%, or a 100% change to a system. |
| **Other notable facts** | Brock Anderson is Yoni Smolyar's co-founder.; Brainrot features a digital pet brain that rots as more time is spent in the app.; The app adds friction when users try to open other apps.; Yoni previously worked as a corporate software engineer.; Partnering with Brock was described as a force multiplier for the business.; Yoni recommends building a simple utility app with one core function for a core user. |

### 5. I Make $30K/Month From the Most Boring Website on the Internet

| Field | Value |
|---|---|
| **Published** | 2026-10-28 |
| **Business** | Excel Exercises |
| **Description** | Web app teaching Excel functions and keyboard shortcuts through hands-on exercises and simulations |
| **Category** | SaaS / Web App |
| **Vertical** | Education & Learning |
| **MRR (normalised)** | $30,000 |
| **MRR basis** | Most recent monthly figure: about a little over $30,000 in revenue over the past 4 weeks, stated as $30 to $35,000 a mon |
| **Website** | https://excexercises.com |
| **Domains mentioned** | excexercises.com |
| **Founder** | Jake |
| **Type** | Web app teaching Excel functions and keyboard shortcuts through hands-on exercises and simulations |
| **Revenue** | $30 to $35,000 a month · monthly · revenue (as of currently) — Past 4 weeks, did about a little over $30,000 in revenue |
| **Revenue — amount** | $30 to $35,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | currently |
| **Revenue — notes** | Past 4 weeks, did about a little over $30,000 in revenue |
| **Traffic / users** | About 50,000 visitors on the website during the past 4 weeks |
| **Engagement** | A dashboard includes leaderboards; one user has logged in almost every day for a year. Lessons use repetition to teach Excel. |
| **Tech stack** | HTML; CSS; plain vanilla JavaScript; Claude; GCP; Google Analytics; SendGrid; Stripe |
| **Marketing channels** | SEO; Reddit; paid advertising |
| **Marketing tactics** | Posted on Reddit a couple times, wrote large amounts of text across landing and blog pages for search engines to index, used paid advertising, and gained university and corporate deals through users recommending the training to their bosses. |
| **Pricing model** | Freemium model with a few free lessons followed by a hard paywall; monthly and annual subscriptions |
| **Customer count** | About 2,500 active paying subscribers |
| **Growth metrics** | Built it 5 or 6 years ago; Quit his job 2 years ago and went full-time on it; Grown it about 5x since going full-time; Grew from zero to $10K per month, then from $10K to $30K; First received a $50 payment; Cloud bill is usually less than $100 a month; SendGrid costs $35 a month; LTV-to-CAC ratio was about 3:1; Monthly customer payback period was 4 or 5 months; Doubled the monthly price while keeping the annual price the same |
| **Notable quotes** | It teaches Excel functions and keyboard shortcuts through hands-on exercises and simulations, rather than through videos.; If you're not embarrassed by the first iteration, then you've waited too long.; I started getting more university and corporate deals. |
| **Other notable facts** | Studied finance in college and had no prior tech experience; Learned to code by watching YouTube videos, using Stack Overflow, copying and pasting code snippets, and tweaking them; The first working version took months; The site has no separate development and production environment; The business is fully automated and can run while he goes on vacation; Some lessons require downloading a data file and following along to create a dashboard |

### 6. I Built a $10K/Month App in 88 Days

| Field | Value |
|---|---|
| **Published** | 2026-10-25 |
| **Business** | Frederick James's portfolio of iOS apps |
| **Description** | iOS habit tracker app in the health and fitness niche |
| **Category** | Portfolio of Products |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $8,000 |
| **MRR basis** | Most recent current run-rate: MRR is currently around $8,000, versus about $11k over the prior 30 days; the $25k over 90 |
| **Website** | — |
| **Founder** | Frederick James |
| **Type** | iOS habit tracker app in the health and fitness niche |
| **Revenue** | about 25k in revenue · last 90 days (as of last 90 days) — MRR was about 11k over the last 30 days and currently sitting around 8,000; ARR peaked at just under 100k |
| **Revenue — amount** | about 25k in revenue |
| **Revenue — period** | last 90 days |
| **Revenue — metric** | revenue |
| **Revenue — as of** | last 90 days |
| **Revenue — notes** | MRR was about 11k over the last 30 days and currently sitting around 8,000; ARR peaked at just under 100k |
| **Traffic / users** | download-to-paid ratio of about 7% |
| **Engagement** | refund rate of 0.7% |
| **Tech stack** | Figma; GPT Image 2.5; OpenAI; ChatGPT; Cloudflare; Cloudflare R2; Cloudflare D1; Cloudflare Workers; AppsFlyer; RevenueCat; Claude Opus 5.5 |
| **Marketing channels** | Apple Ads; TikTok Ads; X |
| **Marketing tactics** | Started with Apple Ads using a premium App Store page, tracking and attribution, search match turned off, exact competitor keywords, and recommended max bids. Used TikTok ads by remaking viral organic videos in five formats, running five posts with about $50 of ad spend each, keeping ads that converted, increasing budgets by 20% every few days, and then using goal-based budget increases with a target cost per acquisition. Exported campaign data from RevenueCat and Apple each day and had an agent identify best performers. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | peaked at about 13k per month; hovering around 10k right now; launched about 3 months ago; revenue of about 25k in the last 90 days; MRR of about 11k in the last 30 days; currently sitting around 8,000 MRR; peaked at just under 100k ARR; download-to-paid ratio of about 7%; refund rate of 0.7%; TikTok campaign grew from about $200 per day to about 1K spend a day; grew from 5K to about 10K per month in about a week; paid ad profit margin of about 30%; not profitable for the first couple of weeks; may burn up to like a thousand dollars without seeing much return |
| **Notable quotes** | I've always been a software developer, really.; I just realized that I could like very easily make it, you know, my own angle and then also just add some like really obvious features that were there and improve it.; If you can be unprofitable to gather signals for the targeting of the algorithms, I generally think that's kind of a good way to go. |
| **Other notable facts** | Spent five years in big tech while living in London before going all in on app building.; Built the app by making mock UI and App Store screenshots in Figma, then having ChatGPT build the flow and UI.; Paid $100 a month for ChatGPT and $300 one-time for a font used across all apps, websites, and video subtitles.; Apple Ads offers $100 free to start.; Uses Pinterest for image assets and GPT Image 2.5 to remake them.; Has built several other apps and was working on a second app at the time of the interview. |

### 7. I quit my job to build this micro-saas. Now it makes $30K/month

| Field | Value |
|---|---|
| **Published** | 2026-10-21 |
| **Business** | Links |
| **Description** | Link-in-bio and website-building tool |
| **Category** | SaaS / Web App |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | $31,500 |
| **MRR basis** | The founder explicitly stated approximately $31,500 in monthly recurring revenue, which is the current monthly run-rate. |
| **Website** | https://links.co |
| **Domains mentioned** | links.co |
| **Founder** | Charlie Clark |
| **Type** | Link-in-bio and website-building tool |
| **Revenue** | $31,500 · monthly · MRR (as of currently) — Approximately $31,500 in monthly recurring revenue; increased from $4 to $5 per month toward the end of June, which translated to nearly $5,000 in additional MRR. |
| **Revenue — amount** | $31,500 |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | currently |
| **Revenue — notes** | Approximately $31,500 in monthly recurring revenue; increased from $4 to $5 per month toward the end of June, which translated to nearly $5,000 in additional MRR. |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | DigitalOcean; AWS; Resend; Tinybird; ClickHouse; OpenAI API; Stripe; Instagram scraping |
| **Marketing channels** | Product Hunt; Instagram ads; Google Search Ads; Email marketing; Cold outreach |
| **Marketing tactics** | Charlie initially acquired users through warm and cold outreach and personally built pages for people to validate demand. He later launched on Product Hunt, which generated significant traffic. Instagram ads produced early growth but stopped being viable after algorithm changes, so he shifted to Google Search Ads, which he has relied on for most growth over the past four years. |
| **Pricing model** | Freemium subscription with a paid plan starting at $5 per month and a Pro plan starting at $12 per month; the Pro plan includes a custom domain and multiple pages. Some customers pay upwards of $100 per month. |
| **Customer count** | — |
| **Growth metrics** | Reached approximately 100 MRR within a couple of months of launching the premium version at about $3 per month; A $1 price increase translated to nearly $5,000 in additional MRR; Spending about $100 a day on Google Ads; Spending $100 to $200 a month on a coding agent; Google Ads has been his primary growth channel over the last 4 years; Quit his job in August of 2024 to become a full-time solopreneur; Reached revenue roughly matching his previous salary before quitting full-time work; Built Links within a self-imposed two-week period |
| **Notable quotes** | I would much rather have lots of customers paying like a small amount than fewer customers paying more.; Pick a space that's validated, iterate until you feel like you got something, and then lock in if you feel like it's what you want to be working on.; It got the profile picture and the name, and it put together a little banner here. |
| **Other notable facts** | Customers receive a URL in the format links.co/yourusername.; The service offers multiple pages, more powerful blocks, customization options, forms, QR codes, short links, and a mock-up builder.; Users can onboard by starting from Instagram, importing a link, or starting from scratch.; The product scrapes publicly accessible Instagram profile information during onboarding.; Some early friends who set up their pages remain on a grandfathered free plan.; Charlie previously worked as a software engineer at Squarespace and founded an earlier print-on-demand marketplace called Visual. |

### 8. I built an app that makes $2K PER DAY

| Field | Value |
|---|---|
| **Published** | 2026-10-18 |
| **Business** | Vault Air |
| **Description** | iPhone app that encrypts on-device storage and lets users store encrypted files and photos |
| **Category** | Mobile App |
| **Vertical** | Other / Miscellaneous |
| **MRR (normalised)** | $41,000 |
| **MRR basis** | The founder stated $41,000 in revenue for a single month, which is the current monthly figure; the $2,000-$3,000 daily a |
| **Website** | — |
| **Founder** | Rasty Turek |
| **Type** | iPhone app that encrypts on-device storage and lets users store encrypted files and photos |
| **Revenue** | $41,000 in a single month · monthly · revenue (as of 6 months after launch) — The app made $66 in its first month and was averaging around $2-3,000 a day at the time of the interview. |
| **Revenue — amount** | $41,000 in a single month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | 6 months after launch |
| **Revenue — notes** | The app made $66 in its first month and was averaging around $2-3,000 a day at the time of the interview. |
| **Traffic / users** | Overall downloads passed 60,000; daily downloads were around 2-3,000 depending on the day |
| **Engagement** | Download-to-paid conversion was 5.47% on day one and grew to 10% from the web; the founder said he had the lowest day-one conversion but the highest conversion around day 60 |
| **Tech stack** | Swift; UIKit; iCloud; Codex; Claude; Posthog; GUM; MCP; Google Search; Google Keyword Planner |
| **Marketing channels** | SEO; Apple Search; web content; internal links; LLMs; word of mouth |
| **Marketing tactics** | Built a marketing site, published one guide per day, targeted keywords surfaced in Google Keyword Planner but not receiving clicks, optimized CTAs and internal links, and published high-quality content rather than high-volume AI content. The site, content, and code were created with coding agents. |
| **Pricing model** | Freemium with weekly, annual, and lifetime purchase options. Weekly was $1.99, annual was $19.99, and lifetime was $39.99. About 60% of purchases were lifetime and those accounted for north of 80% of revenue. |
| **Customer count** | — |
| **Growth metrics** | Built the app in roughly 3 weeks; Launched in March; Made $66 in the first month; Made $41,000 in a single month 6 months later; Averaging around $2-3,000 a day; Passed 60,000 overall downloads; Day-one download-to-paid conversion of 5.47%; Day-35 conversion grew to 10% from the web; Publishing one guide a day; Google takes roughly 3-4 days to register a new guide |
| **Notable quotes** | My MRR is quite low because most people opt in for the lifetime plans.; I literally haven't written single line you know, of code or the text on the web.; As long as they're not out there, they don't exist. |
| **Other notable facts** | The app encrypts data on-device, has no servers or shared keys, and the founder, Apple, and others cannot access or recover the data.; The app has roughly 52 billion potential vaults.; The founder previously worked on the Gmail team at Google after his security company was acquired by Google.; His last venture-funded startup, Pics, provided copyright clearance for entertainment and music and was sold the previous year.; The founder used a mix of local models, but said 99% of the remaining work was handled by Claude waking up every morning and running the guide.; An FBI agent called him about a vault but the app is built so he could not determine whether the person had stored anything. |

### 9. I built this app for my dad. Now it makes $18K/month

| Field | Value |
|---|---|
| **Published** | 2026-10-14 |
| **Business** | Voicy |
| **Description** | Speech-to-text dictation app (Chrome extension, Windows, Mac, Linux, iOS, Android apps) |
| **Category** | AI Wrapper |
| **Vertical** | Documents & Writing |
| **MRR (normalised)** | $11,000 |
| **MRR basis** | The revenue dashboard explicitly shows current MRR of 11K; this is lower than total monthly revenue because lifetime dea |
| **Website** | — |
| **Domains mentioned** | romeoseo.com |
| **Founder** | Koresh |
| **Type** | Speech-to-text dictation app (Chrome extension, Windows, Mac, Linux, iOS, Android apps) |
| **Revenue** | 16 to 20K per month · monthly · revenue — Also stated as "over $18,000 a month"; revenue dashboard shows 11K MRR; runs higher than MRR because lifetime deals are sold |
| **Revenue — amount** | 16 to 20K per month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Also stated as "over $18,000 a month"; revenue dashboard shows 11K MRR; runs higher than MRR because lifetime deals are sold |
| **Traffic / users** | Around 2,500 daily active users and around 10,000 monthly active users; ~200 blog posts, ~30 landing pages |
| **Engagement** | 1,400 active subscriptions; 20% of users on a 20%-off disability discount; 60-70% of users are professionals wanting ~10% more productivity, 20-30% seniors or people with physical disabilities |
| **Tech stack** | OpenAI Whisper API; Chrome extension; Electron; Cursor; Codex; Claude Opus 4.8; Framer (website, ~$200/month); Post Hog (analytics, free); Loops (email); Tella (YouTube/marketing videos); Ionos (VPS hosting, ~$40/month) |
| **Marketing channels** | Chrome Web Store; Reddit; SEO; YouTube (series "AI for Seniors"); blog posts; landing pages; localized website (four or five languages) |
| **Marketing tactics** | Posted the Chrome extension to the Chrome Web Store for free traffic and asked five friends to leave reviews for initial 10-20 page views and first ~100 users; posted on Reddit every day with a content angle, five or six times until blocked, reaching ~200-300 people; focused on SEO with ~200 blog posts and ~30 landing pages; localized website in four or five languages; started a YouTube series called "AI for Seniors"; built his own SEO tool romeoseo.com as his growth engine |
| **Pricing model** | Monthly plan at ~$8.49 plus a lifetime plan at ~$260; 20% disability discount by emailing him |
| **Customer count** | 1,400 active subscriptions; grew YouTube channel from ~1,000 to ~12,000 subscribers in about a month; ~12,000 YouTube subscribers |
| **Growth metrics** | Launched 2 years ago as a Chrome extension; Idea to MVP in 2 weeks; Chrome extension ran for ~6 months before building the Windows app; Electron Windows app took ~3 months; Mac app another ~1 month; Linux app ~2 weeks; iOS app released ~6 months ago; Android app one-shot with Claude Opus 4.8; YouTube grew from ~1,000 to ~12,000 subscribers in ~1 month; Website localized in ~4-5 languages; ~200 blog posts and ~30 landing pages; Cursor boosted productivity ~10x; Website hosting ~$200/month; VPS ~$40/month |
| **Notable quotes** | Within a crowded market... it's not the best product that wins. It's the product that your customer sees first.; Dictation tools to you and me are vitamins... to the people that I'm serving, it's a painkiller.; If you think you can grow your app by writing a blog post, write 10. If you think you can grow it by doing a YouTube video, do five videos. |
| **Other notable facts** | Previous app, a community analytics app called Meet Waves, grew to 5K MRR but never took off because he did no marketing; Grew up in Iran/Tehran, moved to London at 18 to study business; worked ~2-3 years as a product manager in fintech; learned to code during COVID from a book; Built the original version by prompting ChatGPT (~3.5 or 4) and copy-pasting code into an IDE; Primarily serves older people and people with disabilities who cannot type without pain; Competitors like WhisperFlow have raised millions but don't target the senior market, which Koresh sees as less crowded; Romeo SEO (romeoseo.com) is his own second product, an SEO tool he is repositioning toward local traders rather than Indie Hackers; Works on Voicy alongside his 9-5 job as a side project |

### 10. My First SaaS Project Just Hit $11K/Month

| Field | Value |
|---|---|
| **Published** | 2026-10-11 |
| **Business** | VGola |
| **Description** | AI video editing platform and agentic video editor |
| **Category** | AI Wrapper |
| **Vertical** | Design & Media |
| **MRR (normalised)** | $11,200 |
| **MRR basis** | Stated as about $11,200 MRR for the last four weeks. |
| **Website** | — |
| **Founder** | Vadim |
| **Type** | AI video editing platform and agentic video editor |
| **Revenue** | about $11,200 · last four weeks · MRR — VGola makes over $10,000 every single month |
| **Revenue — amount** | about $11,200 |
| **Revenue — period** | last four weeks |
| **Revenue — metric** | MRR |
| **Revenue — as of** | — |
| **Revenue — notes** | VGola makes over $10,000 every single month |
| **Traffic / users** | roughly over a few 10,000 signups |
| **Engagement** | — |
| **Tech stack** | Codeex; Claude; Lovable; GitHub; Supabase; Vercel; Cloudflare; PostHog; DataFast; AWS; Stripe |
| **Marketing channels** | X (Twitter); Instagram |
| **Marketing tactics** | Built a personal brand on X, created an OpenClaw plugin connected to VGola, and leveraged viral AI-tool trends and formats. He then studied competitors' viral UGC formats, copied their text, audio, transitions, hook length, demo length, and CTA structure, and posted three to six videos per day on a new Instagram account. |
| **Pricing model** | — |
| **Customer count** | about $400 paying users |
| **Growth metrics** | VGola launched about five months ago; initial idea came in October; spent four months building it; reached the first $2,000 to $3,000 in MRR purely through X (Twitter); Instagram account reached 10.8K followers; posted three to six times every day; daily content routine takes 30 to 45 minutes; one Instagram video received 132,000 views; other Instagram videos received 18,000 and 21,000 views; founder is 19 years old |
| **Notable quotes** | VGola is basically an AI video editing agent that can turn any piece of content into like viral edited nice clips.; Posting on Instagram cost you nothing. Editing the videos cost you nothing.; Simplify everything you're doing. |
| **Other notable facts** | VGola's target customers include clippers, content creators, agencies, and long-form brands.; The product accepts a YouTube link and generates clips with selectable caption styles, formats, and ratios.; A beta version of an end-to-end agentic video editor was being launched.; VGola was built without coding experience.; The founder previously worked at a marketing startup in his city at age 17.; The founder described himself as a solo founder. |

### 11. I Make $13K/Month From This Simple App

| Field | Value |
|---|---|
| **Published** | 2026-10-07 |
| **Business** | Maxed AI |
| **Description** | All-in-one health and fitness coaching app |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $14,000 |
| **MRR basis** | The founder stated revenue is nearly $14,000 over the last 28 days, equivalent to roughly a monthly revenue run-rate; th |
| **Website** | — |
| **Founder** | Max |
| **Type** | All-in-one health and fitness coaching app |
| **Revenue** | nearly 14,000 dollars in revenue · last 28 days (as of last 28 days) — Over an entire month, revenue is like 14, 15,000 dollars a month; roughly a third of revenue comes from people on X. |
| **Revenue — amount** | nearly 14,000 dollars in revenue |
| **Revenue — period** | last 28 days |
| **Revenue — metric** | revenue |
| **Revenue — as of** | last 28 days |
| **Revenue — notes** | Over an entire month, revenue is like 14, 15,000 dollars a month; roughly a third of revenue comes from people on X. |
| **Traffic / users** | 1,000 active subscribers; 20,000 iOS downloads; over 20,000 new customers in the last 28 days; over 40,000 all time |
| **Engagement** | — |
| **Tech stack** | Claude; Supabase; Vercel; Expo; RevenueCat |
| **Marketing channels** | X; Instagram; Meta Ads; TikTok; founder-led content; content clipping |
| **Marketing tactics** | The founder filmed himself daily, initially posting five to 10 videos, analyzed hold rate and skip rate, and ran the best-performing videos as paid ads. He later increased the ad budget and started a side-shift campaign with five other people creating daily videos. He also began tweeting about his journey three months ago and promoted organic and paid content through Meta, while avoiding hiring UGC creators at the early stage. |
| **Pricing model** | Upfront $24.99 yearly fee, described as really $2 a month, with a hard paywall |
| **Customer count** | 1,000 active subscribers |
| **Growth metrics** | Nearly 14,000 dollars in revenue over the last 28 days; 14, 15,000 dollars a month over an entire month; 1,000 active subscribers; Over 20,000 new customers in the last 28 days; Over 40,000 new customers all time; 20,000 iOS downloads; 164 app store ratings; Around $250 a day spent on paid ads; Roughly a third of revenue comes from people on X; First paying customer four months ago; Started tweeting three months ago |
| **Notable quotes** | You need to hard paywall your app.; I would argue the exact opposite. Be as public about it as possible.; The best advice I could give you is go all in, film yourself, annoy the crap out of everyone around you because you're so obsessed with it and document your journey. |
| **Other notable facts** | Max graduated from the University of Michigan.; He spent two summers in finance, one in venture capital, and one in sales and trading.; Six months ago, he had never built a mobile app and had very minimal coding experience.; He previously started a food review app called Dish Rate but gave it up.; The app tracks sleep, tailored workouts, lifts, nutrition, supplements, peptides, workout tutorials, leaderboards, and social feeds.; He said every cent earned is being reinvested into growing the business. |

### 12. This crazy simple app makes $50K/month

| Field | Value |
|---|---|
| **Published** | 2026-10-04 |
| **Business** | AbMax |
| **Description** | iOS app providing personalized ab plans, pre-made workout programs, and abs scanning |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $55,000 |
| **MRR basis** | Stated revenue of $55,000 per month is the current monthly run-rate; $60K is a forward projection for this month. |
| **Website** | — |
| **Founder** | Lino Leiden |
| **Type** | iOS app providing personalized ab plans, pre-made workout programs, and abs scanning |
| **Revenue** | $55,000 · monthly · revenue (as of this month) — On pace to hit $60K this month; the app launched about 5 months ago |
| **Revenue — amount** | $55,000 |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | this month |
| **Revenue — notes** | On pace to hit $60K this month; the app launched about 5 months ago |
| **Traffic / users** | 16,000 downloads in the past 28 days |
| **Engagement** | — |
| **Tech stack** | Lovable; Supabase; RevenueCat; Sensor Tower; sign.com; PostHog |
| **Tech stack — removed** (not found in transcript) | v0 |
| **Marketing channels** | UGC; TikTok; Meta Ads; TikTok Ads; Instagram; X |
| **Marketing tactics** | Initially ran UGC deals with fitness influencers and manually posted faceless TikTok slideshows; later cut all UGC and influencer deals except one creator who received equity, doubled down on Meta Ads, and moved Meta creatives to TikTok Ads. Also advises validating ideas with organic TikTok slideshows before building, finding micro-influencers to test hooks and formats, sourcing UGC creators, and running paid ads behind winning creatives. |
| **Pricing model** | — |
| **Customer count** | Just over 3,000 active paying customers |
| **Growth metrics** | Launched about 5 months ago; Monthly revenue just about $55,000 this month; On pace to hit $60K this month; 16,000 downloads in the past 28 days; Just over 3,000 active paying customers; First month after launch generated just over $7,000 in revenue; Meta Ads ran at 2 to 2.5x ROAS; TikTok Ads achieved 4 to 5x ROAS with the same creatives; Early UGC and TikTok efforts generated 3 to 4K in revenue at 5 to 10% margins; Target user age range: 15 to 30 years old; Founder is 18 years old; Dropped out after his first semester of freshman year |
| **Notable quotes** | Our product is super niche, which is why I think we're performing extremely, extremely well.; The biggest mistake I see is founders overly obsessing over the product and spending two to three months to launch, which I personally experienced myself.; You can always improve the product later after launch. |
| **Other notable facts** | Lino had never built an app or written code before starting AbMax.; He spent 2 months manually prompting a project in Lovable, then rebuilt the app in v0 in 1 month.; The app lets users scan their abs for a lower-ab score, body-fat percentage, and an assessment of what is holding back visible abs.; The app includes pre-made workout plans, including a 30-day summer ab shredder program.; Lino says there are zero competitors in the ab-focused app niche.; The app is monetized through active paying subscriptions, but no specific price was stated. |

### 13. I Built a $30K/Month Business From a Remote Island (How I Work)

| Field | Value |
|---|---|
| **Published** | 2026-09-30 |
| **Business** | Generalist World |
| **Description** | Newsletter, members community, job board, and summer school for generalists |
| **Category** | Portfolio of Products |
| **Vertical** | Education & Learning |
| **MRR (normalised)** | $30,000 |
| **MRR basis** | Founder explicitly stated revenue of $30,000 every month, so this is the current monthly run-rate. |
| **Website** | — |
| **Founder** | Millie Tamdi |
| **Type** | Newsletter, members community, job board, and summer school for generalists |
| **Revenue** | $30,000 every month · monthly · revenue — Millie described Generalist World as having made nearly 600,000 over the last 4 years and as a business that makes a couple of hundred grand a year. |
| **Revenue — amount** | $30,000 every month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Millie described Generalist World as having made nearly 600,000 over the last 4 years and as a business that makes a couple of hundred grand a year. |
| **Traffic / users** | Hundreds of thousands of people see, read, and watch her stuff every month |
| **Engagement** | — |
| **Tech stack** | — |
| **Marketing channels** | newsletter; members community; podcasts; social media |
| **Marketing tactics** | She creates content in the mornings, uses partnerships, and promotes an existing body of work and its results when pursuing collaborations. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | The business was built over 4 years.; Generalist World has made nearly 600,000 over the last 4 years.; The team has 191 people.; Her Beehive partnership was signed for an entire year.; She has lived on the island for 5 and 1/2 years. |
| **Notable quotes** | I make $30,000 every month as a solo founder who has a very small team.; The honest answer is it is actually a world.; I think you just have to be really honest about what kind of life do you want to have. |
| **Other notable facts** | Generalist World was built from a 200-year-old Highland cottage with stone walls and no central heating.; The business has no investors and has a very small team that are also Millie's friends.; Generalist World offers a newsletter, members community, job board, and summer school.; Millie created International Generalist Day.; She typically finishes work around 3, reads for at least an hour each night, and is usually asleep by around 10:00.; She woke up around 6:00 and took a walk lasting about 40 minutes. |

### 14. I built this website in 8 hours with Claude. Now it makes $40K/month

| Field | Value |
|---|---|
| **Published** | 2026-09-27 |
| **Business** | Geo Games |
| **Description** | Web game featuring sports, history, and football geography quizzes with spin-off games |
| **Category** | Game |
| **Vertical** | Gaming & Entertainment |
| **MRR (normalised)** | $40,000 |
| **MRR basis** | The founder explicitly stated revenue is about $40,000 monthly, so this is the current MRR. |
| **Website** | — |
| **Founder** | Frank Smith |
| **Type** | Web game featuring sports, history, and football geography quizzes with spin-off games |
| **Revenue** | about $40,000 monthly · monthly · revenue (as of three months after Geo Sports was built) — Programmatic advertising accounts for closer to $30,000–$35,000; ad revenue hovers around $1,200 a day; pro subscriptions account for a smaller percentage |
| **Revenue — amount** | about $40,000 monthly |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | three months after Geo Sports was built |
| **Revenue — notes** | Programmatic advertising accounts for closer to $30,000–$35,000; ad revenue hovers around $1,200 a day; pro subscriptions account for a smaller percentage |
| **Traffic / users** | about 700,000 monthly active users; over 1 million unique players in less than one month |
| **Engagement** | 98% of daily traffic comes from word of mouth; 53% organic share rate; a large group of players return and play every day |
| **Tech stack** | Claude; Claude Max 20x; Vercel Pro; custom domain; MapLibre; Upstash Redis; Google Sheets; Stripe |
| **Marketing channels** | X; Instagram Stories; word of mouth; sports media personalities; athletes |
| **Marketing tactics** | Posts one daily game question on X and Instagram Stories, produces sharable scores, and recruits sports media personalities and athletes to host the daily questions and promote the game. |
| **Pricing model** | Pro subscriptions plus programmatic advertising |
| **Customer count** | about 1,800 pro subs |
| **Growth metrics** | built over a weekend; initially worked about 8 hours on Sunday and continued on Monday; zero to about $40,000 per month in three months; first viral X reply resulted in about 40,000 players; 150,000 players in one day; over 1 million unique players in less than one month; 53% organic share rate; roughly 2,000 daily clicks from Frank Smith's X and Instagram Stories posts, about 2% of daily traffic; 98% of daily traffic comes from word of mouth; 700,000 monthly active users; about 1,800 pro subscriptions; programmatic advertising of about $1,200 a day; featuring over 4 million social media followers; first game, Five Card Draw, had about 110,000 players; featured on national TV twice |
| **Notable quotes** | We reached over 1 million unique players in less than one month without a fancy email campaign.; Don't be afraid to build for web first.; If I could go back, I would say stay in the game. |
| **Other notable facts** | The app hosts the Geo Sports, Geo History, and Geo Footy spin-off games.; Each round consists of five questions and requires no tutorial.; Frank Smith says the game was inspired by MapTap and was built after driving home from a friend's wedding.; The game is designed to be played and shared directly on X without leaving the platform.; Frank Smith says he did not know how to code and used Claude throughout the build.; The business grew from several spin-off games after the original Geo Sports launch. |

### 15. This Simple Widget Makes $50K/Month

| Field | Value |
|---|---|
| **Published** | 2026-09-20 |
| **Business** | Avenue |
| **Description** | Website widget for service businesses |
| **Category** | SaaS / Web App |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | $85,000 |
| **MRR basis** | The founder stated revenue of $85,000 a month, so this is the current monthly run-rate in Australian dollars. |
| **Website** | — |
| **Founder** | Tom |
| **Type** | Website widget for service businesses, including trades, electricians, and mechanics |
| **Revenue** | $85,000 a month · monthly · revenue — In Australian dollars; Stripe dashboard showed growth from 597 in August last year to 63,000 Australian in August now |
| **Revenue — amount** | $85,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | In Australian dollars; Stripe dashboard showed growth from 597 in August last year to 63,000 Australian in August now |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | AWS; Slack; Google Workspace; Zapier; Twilio; Claude; Stripe; Google My Business; Google Reservations |
| **Marketing channels** | Door-to-door sales; Printed brochures |
| **Marketing tactics** | The founder and team initially visited businesses in person, showed the product on iPhones and later iPads so prospects could see it embedded in their own branding, and handed out printed brochures explaining the product. They focused on trades businesses and adapted the product to their needs; some customers referred them to other business owners. |
| **Pricing model** | — |
| **Customer count** | 70 plus clients from the founder's previous marketing agency |
| **Growth metrics** | $85,000 a month in revenue in Australian dollars; Revenue grew from 597 in August last year to 63,000 Australian in August now; First 10 customers acquired through a growth tactic described as almost nobody using it; MVP created with a developer friend in February last year; Ran a marketing agency for 10 years with 70 plus clients paying for website hosting; Zapier usage cost 500; Twilio usage cost 4,000; AWS usage cost 150; Slack usage cost 120; Google Workspace usage cost 130 |
| **Notable quotes** | Definitely to sell before you build.; Why do I have to call them?; We want to build like long-term clients. |
| **Other notable facts** | Tom and his brother built Avenue together with a team.; The widget embeds into client websites and also connects to Google My Business and Google Reservations.; The product lets service businesses receive inquiries or purchases outside of business hours.; Tom left school during freshman year and had no coding experience.; The previous marketing agency funded the product's launch and staff hiring.; The widget includes a 'Book online' flow through a direct Google partnership. |

### 16. How I Work: $140K/Month App Developer

| Field | Value |
|---|---|
| **Published** | 2026-09-16 |
| **Business** | Nomad Table |
| **Description** | Meetup app for solo travelers, expats, and nomads |
| **Category** | Mobile App |
| **Vertical** | Travel & Local |
| **MRR (normalised)** | $140,000 |
| **MRR basis** | Founder explicitly stated $140k MRR, confirmed as 'about 140k a month' recurring revenue. |
| **Website** | — |
| **Founder** | Jay |
| **Type** | Meetup app for solo travelers, expats, and nomads |
| **Revenue** | $140k MRR · monthly — Also stated as doing about 140k a month and making over 100k a month as a solopreneur |
| **Revenue — amount** | $140k MRR |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | — |
| **Revenue — notes** | Also stated as doing about 140k a month and making over 100k a month as a solopreneur |
| **Traffic / users** | 1.8 million users |
| **Engagement** | Estimated 100K meetups have happened through the app |
| **Tech stack** | — |
| **Marketing channels** | — |
| **Marketing tactics** | — |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | 1.8 million users; Estimated 100K meetups have happened through the app; Launched about a year and 3 months ago; Was in Bangkok for 4 months |
| **Notable quotes** | The pain of the what if would haunt me more than failing.; It felt more risky to me to not try, cuz then I would be like full of regret.; Even if I could get just two people to meet because of my app, I would be so fulfilled. |
| **Other notable facts** | Bootstrapped the business as a sole founder.; Worked as a software engineer at Amazon when he first began working on the app.; Traveling inspired the original idea for the business.; Uses personal meetups and conversations with users in Bangkok as a source of feature ideas.; Works from cafes, WeWork locations, and other changing workspaces.; The app is described as a mobile app. |

### 17. This app replaced my 9-5 ($155K/year)

| Field | Value |
|---|---|
| **Published** | 2026-09-13 |
| **Business** | Harpagia |
| **Description** | Text-based idol RPG mobile game for iOS and Android |
| **Category** | Game |
| **Vertical** | Gaming & Entertainment |
| **MRR (normalised)** | $13,000 |
| **MRR basis** | Founder stated revenue is around $13,000 a month; the $18,000 figure was a past peak and the $150,000 is a cumulative an |
| **Website** | — |
| **Founder** | Ken |
| **Type** | Text-based idol RPG mobile game for iOS and Android |
| **Revenue** | around 13,000 a month · monthly · revenue (as of over the past year) — Averaged over $3 in revenue per active user; totaled over 150,000 in the past year; peaked at roughly 18,000 a month after Reddit promotion |
| **Revenue — amount** | around 13,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | over the past year |
| **Revenue — notes** | Averaged over $3 in revenue per active user; totaled over 150,000 in the past year; peaked at roughly 18,000 a month after Reddit promotion |
| **Traffic / users** | 3500 to 4,000 monthly active users; around 5 to 600 daily active users; over 50,000 combined iOS and Android downloads |
| **Engagement** | Average revenue per active user was over $3 over the past year; the founder focused on retention first |
| **Tech stack** | Cursor; ChatGPT; React Native; Firebase; Discord Nitro; Vercel; Unity Asset Store; GameDev Market; Fiverr; Upwork; iOS; Android |
| **Marketing channels** | Reddit |
| **Marketing tactics** | Posted on Reddit, including a first post containing game screenshots, an explanation of the game, and metrics about its free-to-play model; shared major updates roughly once every few months because many subreddits limit developer promotion to once a month. |
| **Pricing model** | Free-to-play with optional in-app purchases that unlock premium features or speed up progression; pricing generally ranges from $2 to $10, with $4.99 to $9.99 described as generally acceptable to players |
| **Customer count** | over 50,000 combined downloads across iOS and Android |
| **Growth metrics** | roughly 6% conversion rate; typical game conversion rate stated as anywhere from 2 to 5%; operating expenses of roughly 500 a month; ad spend of zero; first sale made a few days after launch; about $150 in sales by the end of the first month; about 1,500 in total sales by the end of the second month; revenue increased from roughly 1,000 a month to 10,000 a month almost overnight after one Reddit post; revenue later grew from around 10,000 a month to a peak of roughly 18,000 a month; launched the game after 6 months of development; official launch occurred a little over a year and a half before the interview; the game has 16 different skills |
| **Notable quotes** | You can make a meaningful amount of money with a small audience if you're building something people genuinely enjoy.; Build something that you understand well and get real feedback as early as possible. Not from friends and family, but from your potential customers.; My focus was retention first and building a game that people wanted to keep playing. |
| **Other notable facts** | Ken studied computer science at UCSD.; He spent about 12 years in big tech, working as an engineering manager at Meta and a software engineer at Amazon.; He built his first app, Big Too Wild, in about six weeks with AI assistance.; The game is mainly played by fans of incremental games such as Runescape.; Players level up skills, battle monsters, collect loot, and upgrade their character over time.; Ken uses freelancers and asset marketplaces for screenshots, icons, videos, and art. |

### 18. How I Built This $160K/Month Gym App

| Field | Value |
|---|---|
| **Published** | 2026-09-09 |
| **Business** | Symmetry |
| **Description** | Gym tracking app |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $160,000 |
| **MRR basis** | The founder stated revenue of around $160,000 per month, also described as making over $160,000 a month. |
| **Website** | — |
| **Founder** | Mauro |
| **Type** | Gym tracking app |
| **Revenue** | around 160k monthly revenue · monthly (as of last 30 days) — Also described as making over $160,000 a month. |
| **Revenue — amount** | around 160k monthly revenue |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | last 30 days |
| **Revenue — notes** | Also described as making over $160,000 a month. |
| **Traffic / users** | around 3 million downloads across iOS and Android |
| **Engagement** | Adding one workout-commitment screen at the end of onboarding increased retention by 3%. |
| **Tech stack** | Claude; MCPs; PostHog; Superwall; RevenueCat; WhisperFlow; Notion; Slack |
| **Marketing channels** | YouTube; UGC; influencer marketing |
| **Marketing tactics** | The team used creator-generated videos, segmented videos into formats and sub-formats, tracked performance, and gave creators nearly half of revenue to incentivize continued content production and retention. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | Symmetry launched on June 6 of the previous year; The company started 2 years before the interview; Downloads were around 30k during the summer after launch; Nearly 80,000 videos were posted in the last year; More than 500 creator accounts; Nearly 8 billion views in the last year; One video received 17 million views; The app reached around $160,000 monthly revenue within 1 year of launch |
| **Notable quotes** | First, we built what we wanted. Terrible idea.; Second, we built what users wanted. Mediocre.; We must have analytics put in your app. |
| **Other notable facts** | Mauro described Symmetry as the fastest-growing fitness app in the Spanish market.; The app primarily targets users in Spain and Mexico.; The app tracks workouts, weight, reps, exercise videos, muscle-group rankings, streaks, and social workout sharing.; Mauro and his co-founders were fitness YouTubers before building Symmetry.; Symmetry uses quarterly OKRs and reviews metrics at least weekly or daily.; The team runs A/B tests for at least 2 weeks before analyzing results. |

### 19. I make $25K/month from one simple website

| Field | Value |
|---|---|
| **Published** | 2026-09-06 |
| **Business** | Career Hound |
| **Description** | Job board that scrapes jobs directly from company websites |
| **Category** | Marketplace / Directory |
| **Vertical** | Career & Hiring |
| **MRR (normalised)** | $25,000 |
| **MRR basis** | The most recent explicit monthly run-rate is $25,000 a month, which overrides the earlier $12K MRR. The $28,000 figure i |
| **Website** | — |
| **Founder** | Roman |
| **Type** | Job board that scrapes jobs directly from company websites |
| **Revenue** | $28,000 · last month · total revenue — MRR was 12K; the business was also described as making $25,000 a month |
| **Revenue — amount** | $28,000 |
| **Revenue — period** | last month |
| **Revenue — metric** | total revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | MRR was 12K; the business was also described as making $25,000 a month |
| **Traffic / users** | 11.7 million social views in the last 30 days; over 8,000 users |
| **Engagement** | 779 active subscribers; average user lifetime value is $50; churn is high |
| **Tech stack** | Short URL; Posthog; WhatsApp; Clarity; Hetzner; Postmark; Google Suite; Cloudflare |
| **Marketing channels** | Instagram; Reddit; TikTok; creator marketplaces; direct messages; email campaigns |
| **Marketing tactics** | Researching the audience's core questions and problems and solving them with content; researching content across Instagram, Reddit, and TikTok in both video and text; identifying repeatable timeless content formats; creating simple creator briefs; sourcing creators through marketplaces and direct messages; paying creators for videos; running daily marketing experiments; and using existing content as marketing inspiration. |
| **Pricing model** | Hard paywall with weekly, monthly, and yearly subscriptions: $7 a week, $20 a month, or $50 a year; no free plans |
| **Customer count** | Over 8,000 users; 779 active subs |
| **Growth metrics** | Launched two years ago; $28,000 in total revenue last month; $12K MRR; 11.7 million social views in the last 30 days; Average user lifetime value of $50; Creator videos generally cost no more than $20 |
| **Notable quotes** | I run a job board called Career Hound that made 25k last month.; I'm non-technical. I launched it two years ago.; You just need to do mass research on your niche and then produce content using this information, using the insights that come from this research. |
| **Other notable facts** | Career Hound targets people in the US seeking jobs.; It scrapes jobs directly from company websites.; The product idea came from a friend who built a scraper while looking for a job.; The founders initially intended to make $1,000 each.; Roman studied human psychology at university and sold alarm systems door-to-door for five summers.; Roman said he is non-technical. |

### 20. I was stuck at $100 for 2 years until I made one change. Now my app makes $10K/month

| Field | Value |
|---|---|
| **Published** | 2026-09-02 |
| **Business** | Visualizer |
| **Description** | AI rendering tool for architects and interior designers |
| **Category** | AI Wrapper |
| **Vertical** | Design & Media |
| **MRR (normalised)** | $8,200 |
| **MRR basis** | The founder explicitly stated the current MRR is 8.2 (thousand); the nearly $10,000 monthly figure is a broader revenue |
| **Website** | — |
| **Founder** | Piotr |
| **Type** | AI rendering tool for architects and interior designers |
| **Revenue** | 8.2 current MRR; close to 10,000 per month including one-time payments · monthly · MRR and revenue — The transcript also states that Visualizer makes "10K per month" and nearly $10,000 per month after the pivot. |
| **Revenue — amount** | 8.2 current MRR; close to 10,000 per month including one-time payments |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR and revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The transcript also states that Visualizer makes "10K per month" and nearly $10,000 per month after the pivot. |
| **Traffic / users** | Over 300 daily visitors on the landing page |
| **Engagement** | — |
| **Tech stack** | Cursor; Claude Code; RunPod; Ahrefs; MailerLite; Supabase; Vercel; Stripe; Next.js; PostHog; Google Analytics; Sentry; AI image creation services; ComfyUI |
| **Marketing channels** | SEO; Email |
| **Marketing tactics** | Used Ahrefs to monitor SEO and MailerLite for sending emails and email automation. |
| **Pricing model** | 7-day free trial followed by a $35 per month or $80 per month subscription, depending on rendering volume; monthly recurring payments were introduced after testing showed one-time payments were not bringing repeated revenue. |
| **Customer count** | Around 300 active subscribers |
| **Growth metrics** | 5 to 10 new trials daily; 25% of new trials convert to paid; First version took approximately 5 months after hours; Launched almost 3 years ago; Pivot occurred 6 months ago; Revenue grew from over $150 to nearly $10,000 per month after the pivot; Stuck at about $100 per month for the first two years; One product built entirely solo while working full-time as a software engineer |
| **Notable quotes** | friction in your product is killing your conversion; charge subscriptions from day one; Don't build the most powerful product you can. Build the simplest product your customer needs. |
| **Other notable facts** | Piotr is based in Poland and works full-time as a tech lead at a Polish software house.; Piotr has over 20 years of software-development experience.; Visualizer lets users upload a sketch or model and request realistic visualizations in different designs, styles, and colors.; The product includes a chat-based AI assistant called Vizi that asks follow-up questions and creates prompts for AI image-creation services.; The product can also produce videos for sharing with clients.; The initial node-based interface was described as similar to ComfyUI and was too difficult for users to understand. |

### 21. How This SaaS Hit $69K/Month In Just 2 Months

| Field | Value |
|---|---|
| **Published** | 2026-08-30 |
| **Business** | Fastlane |
| **Description** | AI short-form marketing tool for solo builders |
| **Category** | AI Wrapper |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | $69,000 |
| **MRR basis** | Founder explicitly stated $69,000 a month in recurring revenue; the separate ARR label conflicts, but the explicit month |
| **Website** | — |
| **Founder** | Gaurav |
| **Type** | AI short-form marketing tool for solo builders |
| **Revenue** | $69,000 a month in recurring revenue · monthly (as of just over 2 months after launch) — The host separately referred to this as $69,000 ARR. The business also reached over $1 million ARR across the entire business. |
| **Revenue — amount** | $69,000 a month in recurring revenue |
| **Revenue — period** | monthly |
| **Revenue — metric** | recurring revenue |
| **Revenue — as of** | just over 2 months after launch |
| **Revenue — notes** | The host separately referred to this as $69,000 ARR. The business also reached over $1 million ARR across the entire business. |
| **Traffic / users** | Over 1,000 paid users; the beta was shipped to an approximately 2,000-person waitlist. |
| **Engagement** | The product tracks power users and includes a customer love score algorithm combining several factors to determine which customers love the product most. |
| **Tech stack** | Convex; Vercel; Railway; Clerk; Resend; Axiom; OpenAI; Claude; File AI; Claude Code; Notion; Calendly; MCPs |
| **Marketing channels** | TikTok; Instagram; YouTube; Reddit; email; lead magnets; social media |
| **Marketing tactics** | The founders conducted approximately 20 customer calls every week, crawled Reddit threads, posted lead magnets across social media, sent waitlist signups an email with a call invitation, and used customer discovery and usability-testing calls to shape the product. |
| **Pricing model** | — |
| **Customer count** | Over 1,000 paid users; the founders also said they crossed 1,000 paid users a week earlier. |
| **Growth metrics** | Approximately 20 customer calls a week every week since August; Approximately 2,000 customer calls since customer discovery began; Scaled from around $16,000 ARR from paid beta users to over $1 million ARR across the entire business; First V1s started in July and shipped around August; Short-form content development started around October; A beta was shipped to an around 2,000-person waitlist by December; Publicly launched Fastlane on March 23rd; The company crossed 1,000 paid users a week before the interview; Nearly 3 million views for a trending niche video shown in the product demo; Content posted in the demo was live on TikTok within 5 minutes; Gaurav began learning to build software a… |
| **Notable quotes** | You need to make something people want and the best way to know this is to actually talk to them.; The biggest driver of how we ended up building Fastlane was literally just talking to as many customers as we possibly could.; We would have built Fastlane if it wasn't for Starter Story. |
| **Other notable facts** | Fastlane learns what is trending in a user's niche, creates tailored content, and lets users schedule to TikTok, Instagram, and YouTube.; The primary users are solopreneurs building mobile apps or SaaS.; The first horizontally focused product was called Cast AI and covered SEO, LLM EO, Reddit engagement, and short-form content.; The founders ran customer calls in batches with an AI note-taker and recorded notes in Notion.; They built a customer-intelligence dashboard in Claude Code with MCP access to their data; the non-technical founder built it using natural language.; The customer-call process had three phases: customer discovery, usability testing, and customer success. |

### 22. I make $32K/month from 3 simple, boring websites

| Field | Value |
|---|---|
| **Published** | 2026-08-23 |
| **Business** | AngelMatch |
| **Description** | Bootstrapped SaaS portfolio of investor and journalist database products |
| **Category** | Portfolio of Products |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | $32,000 |
| **MRR basis** | The founder explicitly states the portfolio currently generates about $32,000 in monthly recurring revenue (MRR/MMR). |
| **Website** | — |
| **Founder** | Rashid |
| **Type** | Bootstrapped SaaS portfolio of investor and journalist database products |
| **Revenue** | $32,000 in MMR · monthly (as of today) — Portfolio generates about $32,000 in MMR today; AngelMatch is at $29,000 MRR, InvestorHunt is making $2,800, and JournalistHunt is making $260. |
| **Revenue — amount** | $32,000 in MMR |
| **Revenue — period** | monthly |
| **Revenue — metric** | MMR |
| **Revenue — as of** | today |
| **Revenue — notes** | Portfolio generates about $32,000 in MMR today; AngelMatch is at $29,000 MRR, InvestorHunt is making $2,800, and JournalistHunt is making $260. |
| **Traffic / users** | AngelMatch has active subscribers of 360 users and receives about 800 to 1,000 clicks per day across organic, referral, direct, and paid Facebook ads. |
| **Engagement** | AngelMatch's trial conversion rate is 33%. |
| **Tech stack** | Next.js; Nest.js; PostgreSQL; Ahrefs; DigitalOcean; Nylas; Cloudflare; Clavio; G Suite |
| **Marketing channels** | SEO; Programmatic SEO; Meta Ads; Facebook Ads; Product Hunt |
| **Marketing tactics** | The team hired six content writers, published blogs consistently, built and launched free tools and valuable content, and focused on programmatic SEO. AngelMatch's Product Hunt launch generated about $4,000 that month. InvestorHunt uses no marketing beyond SEO. |
| **Pricing model** | AngelMatch starts at $59 per month and has pricing in the few-thousand-dollar range based on how many investors users want to reach. InvestorHunt charges $57, $97, and $297. JournalistHunt's basic and middle tiers range from $49 to $99 per month. |
| **Customer count** | AngelMatch has 360 active subscribers. |
| **Growth metrics** | AngelMatch grew from $3,000 MRR to $20,000 MRR through SEO; AngelMatch's highest MRR was $43k; Programmatic SEO brings half of the revenue; SEO content and free-tool publishing were done for about 6 months or 8 months; AngelMatch initially received about 60 clicks per day; The initial database contained about 40,000 investors; AngelMatch contains about 125,000 angels and VCs; JournalistHunt contains 200,000 journalists; The fintech investment app raised $100,000 from family and friends; The tech stack costs about $62 per month on all apps |
| **Notable quotes** | The reason why they work is because they all solve a problem for our target audience.; I believe for directory and database products, SEO works very very well.; You should be patient, put in the work and never give up. |
| **Other notable facts** | Rashid is not the technical founder and relied on hiring developers to build the websites.; He studied finance in college.; The three products are AngelMatch, InvestorHunt, and JournalistHunt.; AngelMatch helps startup founders find investors to raise capital.; JournalistHunt helps small businesses and media companies find journalists for press coverage.; The portfolio was built by solving a problem Rashid experienced while trying to raise capital for a fintech investment app. |

### 23. He built 100 apps and made $0. Can he fix it in 30 days?

| Field | Value |
|---|---|
| **Published** | 2026-08-22 |
| **Business** | Attention Design |
| **Description** | Inspiration and content-creation platform for YouTube and LinkedIn creators |
| **Category** | SaaS / Web App |
| **Vertical** | Creator & Social Media |
| **MRR (normalised)** | $3,250 |
| **MRR basis** | The $6,500 revenue over 60 days is a two-month total, so dividing by 2 gives $3,250 MRR. |
| **Website** | — |
| **Founder** | Garb |
| **Type** | Inspiration and content-creation platform for YouTube and LinkedIn creators |
| **Revenue** | $6,500 · 60 days · revenue (as of after 60 days) — About $100 was generated in the first 30 days; most revenue came toward the end of the second 30 days. Attention Design's pro plan had five customers paying $99. |
| **Revenue — amount** | $6,500 |
| **Revenue — period** | 60 days |
| **Revenue — metric** | revenue |
| **Revenue — as of** | after 60 days |
| **Revenue — notes** | About $100 was generated in the first 30 days; most revenue came toward the end of the second 30 days. Attention Design's pro plan had five customers paying $99. |
| **Traffic / users** | — |
| **Engagement** | 250 LinkedIn engagements |
| **Tech stack** | — |
| **Marketing channels** | LinkedIn; YouTube; X; Reddit |
| **Marketing tactics** | Posted content daily across multiple platforms, participated in Reddit forums, published vlog-style videos on LinkedIn, cold outreached, offered mock-ups and personalized platform demos, and collected product feedback from potential customers. |
| **Pricing model** | Attention Design has a free version and a $99 pro plan; View Magnet offers a higher-value agency plan that charges more. |
| **Customer count** | 5 Attention Design pro customers at $99 |
| **Growth metrics** | About 72 apps built within 60 days; $99 revenue from the first sale in the first 30 days; $6,500 total revenue after 60 days; 250 LinkedIn engagements; Five Attention Design pro customers at $99; Goal to maintain $6,000 per month for the next 6 months |
| **Notable quotes** | I posted everywhere.; Attention design is the gateway.; The first one was to live the problem you're solving. |
| **Other notable facts** | Garb previously built digital products for Nike and Samsung.; The products are Attention Design, an inspiration library for YouTube creators, and View Magnet, a QR code platform for video creators.; View Magnet received visibility from agencies managing multiple creators, lead magnets, offers, and analytics.; Garb repositioned Attention Design from targeting YouTubers to helping experts and professionals become creators on LinkedIn.; Garb built the apps as side projects, not as full-time work.; The challenge goal was to generate $1,000 in revenue within 30 days. |

### 24. How I Work: $22K/Month Solopreneur

| Field | Value |
|---|---|
| **Published** | 2026-08-20 |
| **Business** | SuperX |
| **Description** | startup |
| **Category** | AI Wrapper |
| **Vertical** | AI & Automation (horizontal) |
| **MRR (normalised)** | $22,000 |
| **MRR basis** | The founder stated revenue of $22,000 a month, directly indicating the current monthly run-rate. |
| **Website** | — |
| **Founder** | Rob Hallam |
| **Type** | startup |
| **Revenue** | $22,000 a month · monthly · revenue — Rob Hallam said he runs the entire business himself while traveling. |
| **Revenue — amount** | $22,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Rob Hallam said he runs the entire business himself while traveling. |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | — |
| **Marketing channels** | — |
| **Marketing tactics** | — |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | Settled in Colombia for 3 months straight in July of 2025; Has lived in more than 13 countries in the last few years; Didn't make money for like a year while traveling and trying to build startups; Currently sets up a base somewhere for 2 to 3 months, ideally 3 months; Works an 8-hour solid work block in the evening; Gets 9 hours of sleep and usually spends 9 and 1/2 hours in bed |
| **Notable quotes** | Productivity follows happiness.; The stuff that moves the business forward the most is the boring stuff.; Getting into the water is the hardest thing, but the best thing you can do is get into the water. |
| **Other notable facts** | Rob Hallam runs the entire business by himself while traveling the world.; He started traveling as a backpacker while trying to build startups.; He typically wakes up around 11:00 a.m. to 12:00 p.m.; He focuses on features, improvements, and bugs that move the business forward the most.; He switches everything off about an hour before bed and switches his phone off for 30 minutes.; He feels most productive in places where he is happiest, regardless of whether he is in the UK, Colombia, or Southeast Asia. |

### 25. I Spent 24 Hours With iOS Millionaires

| Field | Value |
|---|---|
| **Published** | 2026-08-16 |
| **Business** | Cal AI |
| **Description** | iOS app |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | — |
| **MRR basis** | The $50 million figure is a forward projection for this year, while the $1 million-per-month figure was a run-rate reach |
| **Website** | — |
| **Founder** | Zach |
| **Type** | iOS app |
| **Revenue** | $30k in the first month; over $100k in the second month; $1 million a month within 8 months; $50 million this year · monthly and annual · revenue — The speakers discussed being on track for approximately $50 million this year. |
| **Revenue — amount** | $30k in the first month; over $100k in the second month; $1 million a month within 8 months; $50 million this year |
| **Revenue — period** | monthly and annual |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The speakers discussed being on track for approximately $50 million this year. |
| **Traffic / users** | Millions of downloads |
| **Engagement** | — |
| **Tech stack** | — |
| **Marketing channels** | YouTube |
| **Marketing tactics** | The founders recommended solving one's own problem because the founder then knows the desired product experience, target audience, and pain points; they also recommended taking a distinct idea and differentiating it through features, approach, or distribution. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | The first month made $30k.; The second month made over $100k.; Within 8 months, Cal AI was at $1 million a month.; Cal AI received low eight-figure acquisition offers at the end of 2024.; Zach's first company scaled to 5 million users over 2 years and made $60k a year.; The App Store opportunity was described as $100 billion today, growing over 10% year over year, and expected to exceed $200 billion within almost the next 6 years. |
| **Notable quotes** | We ultimately decided like let's burn all the boats, let's go all in on this idea.; If you're really solving your own problem, it really makes everything fall into place.; Take distinct ideas and put your differentiated spin on it. |
| **Other notable facts** | Blake Anderson was the co-founder, investor, and advisor at Cal AI.; Zach was the CEO of Cal AI.; Jake Castillo was the CMO/COO at Cal AI.; Henry was the CTO at Cal AI and managed the tech team.; The four founders trusted one another and each focused on their own domain of expertise.; After the sale, Zach said the next 6 months brought a massive sense of relief. |

### 26. The Lazy Method: How I Build $10K/Month Apps

| Field | Value |
|---|---|
| **Published** | 2026-08-12 |
| **Business** | Overlow and Glowly |
| **Description** | Two iOS apps: a fitness app and a looks-maxing app |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $10,000 |
| **MRR basis** | The founder stated Glowly is currently doing around $10,000 a month in revenue, which is the most recent monthly run-rat |
| **Website** | — |
| **Founder** | Will |
| **Type** | Two iOS apps: a fitness app and a looks-maxing app |
| **Revenue** | over $10,000 a month · monthly · revenue — Glowly is doing around $10,000 a month, and Overlow is doing like $800 a month passive. |
| **Revenue — amount** | over $10,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Glowly is doing around $10,000 a month, and Overlow is doing like $800 a month passive. |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | iOS; RevenueCat; Cloud CLI; AppsFlyer |
| **Marketing channels** | TikTok ads; Instagram; Twitter; paid ads |
| **Marketing tactics** | Create AI-assisted video ad variants, make ads feel native to TikTok, hook users without mentioning the app in the first 3 to 4 seconds, show the core viral feature in action, weave the app subtly into the story, test ads, kill the ones that do not work, and scale spend on winners by 20% every 3 days. |
| **Pricing model** | Subscription |
| **Customer count** | — |
| **Growth metrics** | Overlow makes like $800 a month passive; Glowly makes around $10,000 a month; The two apps make over $10,000 a month combined; Paid acquisition costs around $16 per subscription; LTV per paying user is around $30-$35; Winning ads can be run for the next four or five months; Ad spend is scaled by 20% every 3 days; Onboarding uses 12 to 15 steps; He can create 10 to 20 different video variants; A paid campaign can contain multiple ad variants |
| **Notable quotes** | Lazy maxing to me is just finding the easiest possible way to get what I want done.; I will not work on an app unless it has a clear viral feature that explains itself in essentially one screenshot.; Once you find a winner, or once I find a winner, I just scale it. |
| **Other notable facts** | Glowly scans a user's face and provides results and advice on improving facial appearance.; Overlow lets users log reps and scan their body for results, with a focus on building muscle.; Will previously tried drop shipping, selling likes and followers, crypto startups, and an NFT project.; He uses a 12-to-15-step onboarding process to provide personalized insights before users reach the paywall.; He aims to build apps to validate them, grow them to a sellable level, and repeat the process.; The apps require only a few hours of work per week. |

### 27. I Copied A Huge App. Now I Make $80K/Month

| Field | Value |
|---|---|
| **Published** | 2026-08-09 |
| **Business** | CalBuddy |
| **Description** | AI calorie tracking mobile app localized for the Israeli market in Hebrew |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $81,000 |
| **MRR basis** | The most recent stated monthly revenue is over $81,000 in the previous month, equivalent to over $80,000 per month curre |
| **Website** | — |
| **Founder** | Tomer |
| **Type** | AI calorie tracking mobile app localized for the Israeli market in Hebrew |
| **Revenue** | over $81,000 in the previous month · monthly · revenue (as of April 2026) — Launched in June 2025; started with only 1K in the first month; over $80,000 per month currently |
| **Revenue — amount** | over $81,000 in the previous month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | April 2026 |
| **Revenue — notes** | Launched in June 2025; started with only 1K in the first month; over $80,000 per month currently |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Cursor; Claude; AI agents; PostHog; RevenueCat; Supabase; Expo; Apple App Store |
| **Marketing channels** | paid ads; influencers; TV shows; interviews |
| **Marketing tactics** | Studied viral content from similar US apps and viral fitness and nutrition content in Israel, created creatives from it, and used them in paid ad campaigns. After reaching traction and social proof, partnered with two big influencers on revenue-share deals covering all Israeli revenue rather than paying per post. |
| **Pricing model** | Subscription |
| **Customer count** | — |
| **Growth metrics** | Launched in June 2025; 1K revenue in the first month; around 20K per month in 4 months; grew from 20K to 80K per month after partnering with influencers; over 81K in the previous month; built a working version with the main features in 2 weeks; around 2 months from the first line of code to being live on the App Store; Claude costs $200 per month; PostHog costs $20 per month; Supabase costs $35 per month; Expo costs $100 per month |
| **Notable quotes** | I realized that it doesn't matter that the app already exists if no one knows about it in my local market.; If I can acquire a user for half what my competition pays, that means I have more cash flow than they do, and more cash flow means I can outspend them on growth.; The best advice is don't be afraid of what you don't know. |
| **Other notable facts** | The app lets users take a photo of their food and receive calories and macros in seconds.; The founder was not a developer and had only some coding experience from high school and self-learning.; Apple's developer program acceptance and App Store review took longer than building the app.; The app was based on the concept of CalorieAI but is not a one-to-one clone, with language and small modifications to fit how Israelis eat and talk about food.; CPMs in Israel are significantly lower than in the US, making paid ads profitable without extensive testing or capital.; The influencer agreements specify required content pieces and filming or recording days per month. |

### 28. How I Work: $40K/Month Solo App Builder

| Field | Value |
|---|---|
| **Published** | 2026-08-02 |
| **Business** | Post Ridge |
| **Description** | Social scheduling tool and mobile apps |
| **Category** | SaaS / Web App |
| **Vertical** | Creator & Social Media |
| **MRR (normalised)** | $40,000 |
| **MRR basis** | Jack Butcher stated he was making $40,000 a month as a solopreneur, which is a current monthly run-rate. |
| **Website** | — |
| **Founder** | Jack Butcher |
| **Type** | Social scheduling tool and mobile apps |
| **Revenue** | $40,000 a month · monthly · revenue — Jack Butcher described himself as a solopreneur making $40,000 a month. |
| **Revenue — amount** | $40,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Jack Butcher described himself as a solopreneur making $40,000 a month. |
| **Traffic / users** | 100 other thousand people wanted his first app |
| **Engagement** | — |
| **Tech stack** | — |
| **Marketing channels** | TikTok; landing pages |
| **Marketing tactics** | He tested ideas by publishing a landing page and TikTok, then evaluating comments, landing-page visits, and whether visitors clicked buy. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | A mobile app peaked at 3,000 a month before growing to a peak month of 15,000 a month.; Post Ridge became 10 times, then 100 times bigger than the mobile app it was initially made to grow.; Monthly recurring revenue rose above a few thousand a month.; Jack works in weekly sprints, ranging from 4 hours some weeks to 40 hours.; During a launch week, he worked about 10 hours each day.; After the first year of working, his savings had built up and he slowed down. |
| **Notable quotes** | Hey, I'm Jack Butcher. I make $40,000 a month as a solopreneur.; Generally my rule is that I still only focus on one thing per day.; Everything kind of stems from my own need. |
| **Other notable facts** | Jack created his first app for himself and later created Post Ridge as a social scheduling tool.; His product ideas begin with something he wants to see in the world and would use himself.; He generally stops working around 5:00 p.m. and spends 5:00 p.m. to 9:00 p.m. with his fiance.; He usually goes to bed around 11:00 p.m. and wakes around 7:00 a.m.; He aims to get 8 hours of sleep.; Two and one-half years ago, he broke down during a summer because he thought his mobile app had peaked at 3,000. |

### 29. How Postiz Went From $17K to $143K/Month in 4 Months

| Field | Value |
|---|---|
| **Published** | 2026-07-30 |
| **Business** | Posties |
| **Description** | Agentic social media scheduling SaaS |
| **Category** | AI Wrapper |
| **Vertical** | Creator & Social Media |
| **MRR (normalised)** | $143,000 |
| **MRR basis** | The most recent stated monthly recurring revenue is $143K MRR. |
| **Website** | — |
| **Founder** | Neville |
| **Type** | Agentic social media scheduling SaaS |
| **Revenue** | $143K MR · monthly · MRR (as of less than two years after starting) — Posties reached 21K MR in one and a half years, then grew to 143K MR in 4 months. |
| **Revenue — amount** | $143K MR |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | less than two years after starting |
| **Revenue — notes** | Posties reached 21K MR in one and a half years, then grew to 143K MR in 4 months. |
| **Traffic / users** | 700 trials every day |
| **Engagement** | Churn decreased to 13.7% from 26% and 28% after pivoting to agentic workflows |
| **Tech stack** | Stripe; Claude; ChatGPT; OpenClaw; MCP |
| **Marketing channels** | X; TikTok; paid promotion reposts; influencer quote reposts; Claude marketplace; ChatGPT marketplace |
| **Marketing tactics** | Posties published articles about using OpenClaw with Posties, republished articles through paid influencers and other reposters, and listed its agent-ready MD file in Claude and ChatGPT marketplaces. |
| **Pricing model** | — |
| **Customer count** | 4,271 subscribers |
| **Growth metrics** | MR increased from 41,000 in February to 76,000 in March, 80,000 in April, 109,000 in May, and 140,000 in late June.; Reached 143K MR in less than two years.; Took one and a half years to reach 21K MR, then grew to 143K MR in 4 months.; Grew by around 1K MR every day during the four-month growth period.; One X article received 7.2 million views and brought in 700 trials every day.; A second X article received about 1.5 million views.; Posties' own X article received half a million views despite having 200 followers.; Another Posties X article received another half a million views.; Paid influencer quote reposts cost between $60 and $350.; Hired two people, one for support and one for develop… |
| **Notable quotes** | My name is Neville and I grew my startup posties to 143K in MR in less than two years.; So basically I was really surprised how this person can get 7 million views.; You need to make your app super reliable. |
| **Other notable facts** | Posties originally allowed users to schedule posts to more than 30 platforms.; The business pivoted from a social media scheduling tool to an agentic social media scheduling tool.; OpenClaw creator Peter inspired Neville to make Posties agent-ready.; Oliver Henry's X article about making money with Snugly and Posties received 7.2 million views.; Neville advised building an API and its MD file before a trend occurs.; Neville said agentic workflows could create a week of marketing content from a content source and an LLM. |

### 30. This Simple App Makes $18K/Month

| Field | Value |
|---|---|
| **Published** | 2026-07-26 |
| **Business** | Cat on Chair |
| **Description** | iOS app (Pomodoro timer for cat lovers) |
| **Category** | Mobile App |
| **Vertical** | Productivity & Workflow |
| **MRR (normalised)** | $18,000 |
| **MRR basis** | Most recent stated monthly run-rate: over $18,000 in the last 30 days. The $80,000 cumulative 8-9 month total and lifeti |
| **Website** | — |
| **Founder** | Ryan |
| **Type** | iOS app (Pomodoro timer for cat lovers) |
| **Revenue** | over 18K a month (over $18,000 in the last 30 days from April 13); close to 80K over a span of 8-9 months · monthly (last 30 days from April 13); lifetime total of close to 80K over 8-9 months · sales (as of last 30 days from April 13) — First app released; crossed $18,000 a month; lifetime plan is $29.99, annual $19.99, family share up to six people; most sales come from the lifetime plan |
| **Revenue — amount** | over 18K a month (over $18,000 in the last 30 days from April 13); close to 80K over a span of 8-9 months |
| **Revenue — period** | monthly (last 30 days from April 13); lifetime total of close to 80K over 8-9 months |
| **Revenue — metric** | sales |
| **Revenue — as of** | last 30 days from April 13 |
| **Revenue — notes** | First app released; crossed $18,000 a month; lifetime plan is $29.99, annual $19.99, family share up to six people; most sales come from the lifetime plan |
| **Traffic / users** | crossed 127K downloads overall; around 24K first-time downloads |
| **Engagement** | — |
| **Tech stack** | ChatGPT Pro plan (AI coding); RevenueCat (paywall and subscription management); ASO optimization tool; Droids (user feedback board, free); AI coding for iOS apps |
| **Marketing channels** | RedNotes (Xiaohongshu); Instagram; Threads; word of mouth/organic sharing; App Store (ASO) |
| **Marketing tactics** | Invited dozens of people on RedNotes to beta test for about a month before launch; small viral moments on RedNotes during the buggy period; Instagram influencers sharing app collection posts featuring the app, one exploding to over 2 million views; a person in Taiwan shared the app on Threads where it went viral again, roughly doubling downloads and revenue overnight; girlfriend's existing RedNotes following of illustrations; now targeting English and worldwide audiences |
| **Pricing model** | Free app with pro features; lifetime plan $29.99, annual $19.99, family share up to six people; most sales from the lifetime plan |
| **Customer count** | — |
| **Growth metrics** | Launched August 27th (first version ready by August after starting around May 2025); About 3,000 downloads in the first week; Instagram post hit over 2 million views; Threads viral moment in Taiwan roughly doubled downloads and revenue overnight; Peak ranking: #3 for free productivity apps and #11 for all free apps in Taiwan; First-time downloads around 24K; total downloads crossed 127K; Sales close to 80K over 8-9 months; over 18K in the last 30 days; Ryan previously left a 200K job as a product designer; Stable version only around December or January after launch |
| **Notable quotes** | I left my 200K job to build my own business. It took a few years, but with the help of AI and my girlfriend, we built an app that makes over 18K a month now.; It's really hard to innovate on the feature set of Pomodoro Timers... combined with a cat theme and the customization mechanics, we are able to add unique features that motivate people to keep using it.; I would say just keep trying and eventually you will find something you love, you enjoy doing. |
| **Other notable facts** | Ryan is a product designer turned indie developer; app was built with his girlfriend (Stephanie), whose illustrations are central to the app; App idea came from a necklace his girlfriend made — a little cat sitting on a chair; Features include pomodoro timer, cat animations, gift collection system, meow animation triggered by tapping the cat or saying its name, to-do list, focus timeline, stickers, different cats, furnitures and backgrounds; Gift system inspired by memes of cats bringing dead mice to owners; cat leaves a gift after a successful session and a trash if the session fails; Users come mainly from Chinese and Taiwanese markets (girlfriend's RedNotes following), now expanding to English/worldwide audience; RevenueCat costs around 200 to 300 depending on the month's revenue; the… |

### 31. I Make $50K Per Month Working 5 Hours A Week

| Field | Value |
|---|---|
| **Published** | 2026-07-23 |
| **Business** | Chart Detector AI |
| **Description** | AI chart analysis mobile app for analyzing stock and crypto charts |
| **Category** | Mobile App |
| **Vertical** | Finance & Money |
| **MRR (normalised)** | $56,000 |
| **MRR basis** | The founder explicitly stated revenue of $56,000 per month, which is the most recent monthly run-rate figure. |
| **Website** | — |
| **Founder** | Teemo |
| **Type** | AI chart analysis mobile app for analyzing stock and crypto charts |
| **Revenue** | $56,000 per month · monthly · revenue — Teemo also stated that the app made more than $50,000 per month, $43,700 in April, and more than $260,000 in total over the last 13 months. |
| **Revenue — amount** | $56,000 per month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Teemo also stated that the app made more than $50,000 per month, $43,700 in April, and more than $260,000 in total over the last 13 months. |
| **Traffic / users** | More than 90K downloads over 13 months; around 13 to 14k downloads every month; close to 40 million total impressions; 7.8 million views over the last 30 days. |
| **Engagement** | — |
| **Tech stack** | React Native; Expo; Supabase; Cursa AI; Bot Me AI; RevenueCat; AppsFlyer; CapCut; TikTok Ads |
| **Marketing channels** | TikTok Ads; paid ads |
| **Marketing tactics** | Teemo mainly creates videos showing the app and how a user uses it, then runs them as TikTok ads using Smart Plus campaigns. The campaigns optimize for subscription events, use broad targeting with only the country selected, start with a budget of at least $50 per day, and do not change campaign settings during the roughly 7-day learning phase. Teemo monitors ROAS weekly, increases the budget when stable and profitable, creates new videos when ROAS is not profitable, avoids increasing budgets by more than 20% every 3 days, and maintains a constant pipeline of new videos to prevent creative fa… |
| **Pricing model** | Hard paywall with no free trial; a weekly plan for $12.99 per week and a six-month plan for $59.99 every six months. |
| **Customer count** | — |
| **Growth metrics** | More than 90K downloads over the last 13 months; Around 13 to 14k downloads every month; More than $260,000 in total revenue over the last 13 months; $56,000 in monthly revenue; Close to 40 million total impressions; 7.8 million views over the last 30 days; A single TikTok ad generated over $15,000 in revenue and close to 5 million views; April revenue of $43,700; Total profit margin of around 25%; Around $20,000 in monthly ad spend; Around $18,000 per month spent on TikTok Ads; Total profit of around 11 and 1/2 thousand dollars in April; Teemo works 20 hours per month on the app; Teemo is 23 years old; Teemo quit his job after only 6 months |
| **Notable quotes** | My name is Teemo. I'm 23 years old, and I built a mobile app that makes more than 50K per month.; We are currently at $56,000 per month, and we are getting around 13 to 14k in downloads every month.; I would tell you I recommend you to start now the execution, because I always watched too many YouTube videos and procrastinated, and I thought I was productive. |
| **Other notable facts** | Teemo and his brother launched the app a little over a year ago.; The app started as a Telegram bot that analyzed stock charts with AI before becoming a mobile app.; Teemo previously worked as a software engineer at a big car brand in Germany.; The app analyzes stock and crypto charts from user-uploaded photos and provides directional predictions.; Teemo and his brother both quit their jobs to pursue the business full time.; Teemo uses Upwork and a freelancer for complex app integrations. |

### 32. This Stupidly Simple App Makes $100K/Month

| Field | Value |
|---|---|
| **Published** | 2026-07-19 |
| **Business** | Go Tall |
| **Description** | Height prediction mobile app with subscriptions and freemium features |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $100,000 |
| **MRR basis** | The founder stated revenue of about $100k per month, describing scaling to over $100k a month, so the current monthly ru |
| **Website** | — |
| **Founder** | Michael |
| **Type** | Height prediction mobile app with subscriptions and freemium features |
| **Revenue** | about 100k a month · monthly · revenue — On average; the interview also describes scaling to over 100k a month |
| **Revenue — amount** | about 100k a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | On average; the interview also describes scaling to over 100k a month |
| **Traffic / users** | about 700,000 downloads on the App Store and a couple hundred thousand on Android, for about a million downloads overall |
| **Engagement** | The paywall has about a 91% paywall show rate |
| **Tech stack** | Expo; iOS; Android; Superwall; Adapty; Singular MMP; Apple App Store Connect; CDC data |
| **Marketing channels** | TikTok; UGC creators; Paid ads |
| **Marketing tactics** | Made 10 TikToks every day for about a month, replicated the format on multiple accounts, recruited UGC creators by sending about 50 DMs a day, optimized the paywall, explored additional content formats, and then used paid ads to scale |
| **Pricing model** | $35 yearly subscription, $5 weekly plan, and a freemium tier |
| **Customer count** | — |
| **Growth metrics** | First sale came after two days of launching; Roughly 3K a month with the founder and a few UGC creators; About 10K a month after optimizing the paywall and scaling; About 30K a month in month five; Over 100k a month after adding paid ads; 10 TikToks every day for about a month; About 50 creator outreach DMs a day; 10 to 20 DMs a day requesting height predictions |
| **Notable quotes** | After 2 days of launching it, I already had the first sale.; You want to make something that really hits with people's needs.; The more information that you can get, the more predictive of the height you could be. |
| **Other notable facts** | The founder is 20 years old and was a finance student at NYU.; He found the idea after seeing a similar app listed on acquire.com for around $20,000.; His first viral format involved replying to TikTok height-related comments and predicting commenters' heights.; The app uses research papers and CDC data to make height predictions.; Users can log sleep, scan meals, and do stretches.; The app is available on the App Store and Android. |

### 33. I Quit My Job at Meta to Build a $30K/Month SaaS

| Field | Value |
|---|---|
| **Published** | 2026-07-15 |
| **Business** | Live Tournament Golf |
| **Description** | SaaS tournament-scoring and leaderboard software for golf courses |
| **Category** | SaaS / Web App |
| **Vertical** | Gaming & Entertainment |
| **MRR (normalised)** | $30,000 |
| **MRR basis** | The founder's most recent statement was $30,000 a month, which is the current monthly run-rate. The $40,000 monthly figu |
| **Website** | — |
| **Founder** | Matt |
| **Type** | SaaS tournament-scoring and leaderboard software for golf courses |
| **Revenue** | $30,000 a month; about 350K of ARR and about a $800,000 run rate · monthly · revenue (as of start of the year) — One introduction also described the app as making $40,000 a month; the founder subsequently stated $30,000 a month, about 350K ARR, and about a $800,000 run rate. |
| **Revenue — amount** | $30,000 a month; about 350K of ARR and about a $800,000 run rate |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | start of the year |
| **Revenue — notes** | One introduction also described the app as making $40,000 a month; the founder subsequently stated $30,000 a month, about 350K ARR, and about a $800,000 run rate. |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Next.js; Google Firebase |
| **Marketing channels** | LinkedIn; social media |
| **Marketing tactics** | The founder said he planned to become more outward-facing with the business by talking about it on LinkedIn and social media. |
| **Pricing model** | — |
| **Customer count** | about 150 golf courses |
| **Growth metrics** | First event about 4 years ago; about 150 golf courses using the product; about 350K of ARR; about a $800,000 run rate based on performance at the start of the year; about 100 proven micro-SaaS ideas in the free HubSpot database |
| **Notable quotes** | My heart tells me to go all in on this thing.; Set aside time in the day. For me, it was the morning like 6:00 a.m. to 9:00 a.m.; Find something you care about, figure out where you could make it better and go. |
| **Other notable facts** | The founder is a senior software engineer at Meta on the AI team and had worked there for 6 years.; The product lets players scan a QR code on a scorecard to enter a live leaderboard and record scores.; The founder said Golf Genius was too complicated and too expensive for his local course.; He initially built the product for his first event about 4 years ago, working nights and weekends.; The founder and his wife have two kids.; After the interview, the founder decided to quit Meta and work on the business full-time. |

### 34. She Built This $340K/Month App in 60 Days

| Field | Value |
|---|---|
| **Published** | 2026-07-12 |
| **Business** | Stella |
| **Description** | Manifesting app |
| **Category** | Mobile App |
| **Vertical** | Productivity & Workflow |
| **MRR (normalised)** | $360,000 |
| **MRR basis** | Used the upper end of the most recent stated range: Sarah said Stella was currently at about $350,000–$360,000 MRR. |
| **Website** | — |
| **Founder** | Sarah Pearl |
| **Type** | Manifesting app |
| **Revenue** | $300,000 MRR in 2 months; about $350,000–$360,000 MRR; over $340,000 per month · monthly (as of within the first two months since launching) — Sarah said Stella crossed over $300,000 MRR in 2 months and was currently at about $350,000–$360,000 MRR. |
| **Revenue — amount** | $300,000 MRR in 2 months; about $350,000–$360,000 MRR; over $340,000 per month |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | within the first two months since launching |
| **Revenue — notes** | Sarah said Stella crossed over $300,000 MRR in 2 months and was currently at about $350,000–$360,000 MRR. |
| **Traffic / users** | Over 200,000 downloads |
| **Engagement** | — |
| **Tech stack** | Cloud Code; Google AI Studio; Cursor; AI; ManyChat |
| **Marketing channels** | TikTok; Instagram; TikTok Shop; YouTube |
| **Marketing tactics** | Sarah recreated viral content in a chosen niche, asked what product could naturally fit a successful video, and created the content and distribution before building the product. On Instagram, she used ManyChat to invite people to comment "download" and receive custom affirmations, then directed them to download Stella. She also asked reviewers to leave reviews so she could thank them personally. |
| **Pricing model** | — |
| **Customer count** | 12,000 paying customers |
| **Growth metrics** | Crossed over $300,000 MRR in 2 months since launching; Current MRR of about $350,000–$360,000; Over 200,000 downloads; 12,000 paying customers; 1.2 million Instagram followers; 2.8 million TikTok followers; Combined TikTok views of over one billion; A new TikTok account grew to over 40,000 followers in a couple of months; Another TikTok account had over 700,000 followers; The first three TikTok videos Sarah posted went viral; A viral video received 300,000 views; The app took 2–3 months to build; The MVP may have been built in 2 days; TikTok Shop brand reportedly made seven figures a month; A TikTok Shop brand was launched about a year and a half earlier |
| **Notable quotes** | So, this is Stella and basically you tell it all of your dreams, all of your desires, and it will create these custom visualizations that you can listen to from your future self who already manifested it.; The faster you can whip up an MVP and test it, the sooner you will have a product that actually performs.; Create the content and the distribution first and then I create the product. |
| **Other notable facts** | Sarah was in college studying to become a teacher when she began monetizing her social media.; Stella creates custom visualizations and meditations based on a user's goals.; Stella provides daily custom affirmations.; Sarah is also known as Hot High Priestess.; Sarah said the app was built around a gap she saw in the market for apps designed to solve women's issues.; Sarah described Stella as the first app of its kind that she knew of and said she pioneered the concept. |

### 35. This Insanely Simple App Makes $50K/Month

| Field | Value |
|---|---|
| **Published** | 2026-07-05 |
| **Business** | Early |
| **Description** | Alarm clock app that requires users to complete push-ups to turn off the alarm |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $50,000 |
| **MRR basis** | Founder stated the app makes over $50,000 in revenue per month; the most recent current run-rate figure is $50,000/month |
| **Website** | — |
| **Founder** | Jake |
| **Type** | Alarm clock app that requires users to complete push-ups to turn off the alarm |
| **Revenue** | a little over $50,000 · monthly · revenue (as of last 28 days) — The founder also stated the app makes over $50,000 in revenue per month and reached $50,000 a month in month 4. |
| **Revenue — amount** | a little over $50,000 |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | last 28 days |
| **Revenue — notes** | The founder also stated the app makes over $50,000 in revenue per month and reached $50,000 a month in month 4. |
| **Traffic / users** | A little over 50,000 first-time downloads in the last 30 days; a little over 200,000 downloads in 2026 |
| **Engagement** | — |
| **Tech stack** | Firebase; Firebase database; Firebase authentication; Firebase Cloud Functions; Superwall; OpenAI API; Mixpanel; Cloud Code; Grow; SideShift; Instantly; Cal; Agree; Google Sheets; QuickBooks; 1Password; iOS AlarmKit API |
| **Marketing channels** | Influencer marketing; TikTok; Instagram; Email; UGC creators |
| **Marketing tactics** | Reached out directly to influencers on TikTok and Instagram, focused on day-in-the-life and lifestyle creators whose existing content naturally fit the app, and offered two to four videos per month with a view guarantee. Influencer videos demonstrated waking to the alarm, completing push-ups, and having the alarm turn off without feeling like a traditional advertisement. Jake tracked video views and correlated view spikes with conversion spikes. |
| **Pricing model** | Free trial, followed by $29.99 a year or $9.99 a month |
| **Customer count** | A little over 50,000 first-time downloads in the last 30 days; a little over 200,000 downloads in 2026 |
| **Growth metrics** | Launched at the end of 2025; Went from zero to $50,000 a month in 4 months; Reached the first $1,000 in revenue 3 weeks after the first influencer video went live; Reached the first $30,000 month in month 3; Reached the first $50,000 month in month 4; Took about 19 days from the first commit to the App Store; The alarm feature went live about another 19 days after the initial App Store release; The first influencer video went live 7 days after marketing began; Influencer video views typically peak within about a day; Influencer deals generally involved two to four videos per month; Influencer deals cost around $2 to $3 CPM based on the view guarantee; Some influencer videos reached 1 millio… |
| **Notable quotes** | Building doesn't really matter so much. What really matters is marketing.; Solve a painful problem in a simple way and it should be inherently viral.; Focus on top of funnel only. That is the most valuable skill right now is marketing. |
| **Other notable facts** | The app's original MVP was an accountability app for logging wake-ups, with no alarm feature.; The app connects to the native iPhone alarm system using the AlarmKit API.; The app uses video analysis to verify that the user performed the push-ups.; Jake described Early as a solo-founder business and said he now has help.; Jake studied accounting, completed a 4-year undergraduate degree and a master's degree, and obtained a CPA.; Jake previously had other businesses that did not work. |

### 36. How I Work: $10M/Year Serial Entrepreneur

| Field | Value |
|---|---|
| **Published** | 2026-07-01 |
| **Business** | Sam Parr's portfolio of content brands, podcasts, and software companies |
| **Description** | Portfolio of media and technology businesses |
| **Category** | Portfolio of Products |
| **Vertical** | Creator & Social Media |
| **MRR (normalised)** | $833,333 |
| **MRR basis** | Over $10 million in annual combined revenue divided by 12 to estimate current monthly recurring revenue. |
| **Website** | — |
| **Founder** | Sam Parr |
| **Type** | Portfolio of media and technology businesses, including podcasts, newsletters, apps, and SaaS products |
| **Products** | My First Million; The Hustle; Shoutouts; Bark; Snipfeed; Opal; Brick; Five-Year Journal |
| **Revenue** | over $10 million a year · annual · revenue — Combined revenue of Sam Parr's companies |
| **Revenue — amount** | over $10 million a year |
| **Revenue — period** | annual |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Combined revenue of Sam Parr's companies |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Claude; Brick; Nespresso |
| **Marketing channels** | podcasting |
| **Marketing tactics** | Publishes a podcast every Monday and Wednesday, interviews guests, and uses a Claude skill to identify the day's guest and automatically research them. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | Companies make over $10 million a year; Podcast published every Monday and Wednesday; Has used Brick for over a year; Commute usually takes about 13 minutes |
| **Notable quotes** | I cannot stand thinking about something and not acting on it. Life is so short.; From 0 to 5 million, or maybe 0 to 10 million in revenue, for every company that I've run, I am blunt force.; Once a company gets to like 5 or 10 million in revenue, you should delegate and you should hire. |
| **Other notable facts** | Gets up between 6:00 and 6:30 in the morning and exercises roughly 6 days a week.; Works in a highly structured schedule with time-bound, specific tasks and limits his daily goals to one or two things.; Owns motorcycles and cars but often rides a scooter or takes the subway to work.; Reads five to 10 books on the same topic during what he calls a semester.; Gets home between 5:30 and 6:00, has dinner with his kids, and reads from 10:00 to about 10:45.; Has spoken to thousands of entrepreneurs and talked to billionaires at conferences. |

### 37. How We Built This $20K/Month AI App

| Field | Value |
|---|---|
| **Published** | 2026-06-28 |
| **Business** | 3 AK |
| **Description** | All-in-one track and field app for sprinters, offering workout tracking, form analysis, nutrition analysis, progress… |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $20,000 |
| **MRR basis** | Founder stated the business is currently making over $20,000 per month, the most recent monthly run-rate. |
| **Website** | — |
| **Founder** | Christian and Braylon |
| **Type** | All-in-one track and field app for sprinters, offering workout tracking, form analysis, nutrition analysis, progress tracking, and a community |
| **Revenue** | $70,000 · 6 months · total sales — Started December 16th; made around $70,000 so far; over $20,000 a month; first month made $10,000 |
| **Revenue — amount** | $70,000 |
| **Revenue — period** | 6 months |
| **Revenue — metric** | total sales |
| **Revenue — as of** | — |
| **Revenue — notes** | Started December 16th; made around $70,000 so far; over $20,000 a month; first month made $10,000 |
| **Traffic / users** | around 40,000 users |
| **Engagement** | 4.7 rating in the App Store |
| **Tech stack** | ChatGPT; Claude; Co-work; Claude Code; RevenueCat; Apple Dev; Supabase; AI analyzer; Shopify |
| **Marketing channels** | TikTok |
| **Marketing tactics** | Built an audience of hundreds of thousands of followers in track and field through their videos without marketing, then mentioned the 3 AK method in videos, on their Shopify website, and in their bio before launching the app. |
| **Pricing model** | $10 monthly subscription and $30 yearly subscription |
| **Customer count** | — |
| **Growth metrics** | $70,000 in 6 months; first month made $10,000; over $20,000 a month; around 40,000 users; built the app in like 2 weeks; 4.7 rating in the App Store; hundreds of thousands of followers in track and field; worked 50-60 hour days during the football app launch |
| **Notable quotes** | We found a niche that not a lot of people were in. We realized a lot of people run track, but there's no apps for track and field specifically.; Do something that you're already doing in your day-to-day life and make it profitable. Make monetize it.; You cannot be a solo founder. If you're in school and you're a solo founder, just chalk it one up to go. |
| **Other notable facts** | Christian is 19, attends Texas Southern University, and runs track; Braylon is 20, attends Texas State University, and runs track; They met in high school and became close friends; They previously traded together and lost like $3,000; The app analyzes running videos and meals to provide form scores and nutrition guidance; Christian dropped out of college to focus on the apps |

### 38. I Turned This Spreadsheet Into a $30K/Month Micro-SaaS

| Field | Value |
|---|---|
| **Published** | 2026-06-24 |
| **Business** | Profit AI |
| **Description** | Profit analytics and marketing automation app for Shopify |
| **Category** | SaaS / Web App |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | $70,000 |
| **MRR basis** | The founder stated current MRR of $30K for the app plus just under $40K for services, totaling just under $70K per month |
| **Website** | — |
| **Founder** | Jack |
| **Type** | Profit analytics and marketing automation app for Shopify |
| **Revenue** | $147,000 · since launch in December · revenue (as of May) — 30K MRR for the app and just under 40K MRR for services |
| **Revenue — amount** | $147,000 |
| **Revenue — period** | since launch in December |
| **Revenue — metric** | revenue |
| **Revenue — as of** | May |
| **Revenue — notes** | 30K MRR for the app and just under 40K MRR for services |
| **Traffic / users** | 122 users of the app right now; most are free |
| **Engagement** | 43 un-installs and 47 installs; the founder said they are churning as many customers as they are bringing in |
| **Tech stack** | Claude Code; Cursor; Codex; Claude; Shopify; Slack; Framer; Google Sheets; CSV |
| **Marketing channels** | Word of mouth |
| **Marketing tactics** | Most growth came from word of mouth; the business had not hard-launched its marketing yet and planned a big launch |
| **Pricing model** | Free plan with a 30-day free trial of the paid plan, plus a paid plan reduced from $5,000 a month to $800 a month |
| **Customer count** | 38 or 39 paying customers |
| **Growth metrics** | $147,000 made to date; 30K MRR for the app; Just under 40K MRR for services; Launched in December and was approved by Shopify on Christmas Day; No customers for the first couple of weeks; 47 installs and 43 un-installs; 122 app users; 38 or 39 paying customers; Initial app build took between 3 and 1/2 months and 4 months; In 2016, launched a first e-commerce brand; $1,000 put into Facebook ads; Closed an agency in Miami with an office in New York |
| **Notable quotes** | What if I just turn this spreadsheet into an app?; Most of our growth came from like word of mouth.; Don't aim for laziness. |
| **Other notable facts** | The app was approved by Shopify on Christmas Day; Originally built client spreadsheets before consulting for agencies; The app shows profit, spend per channel, sales attributed to channels, and profit after costs; Enterprise stores can forecast and measure relationships between ad spend and revenue by platform; Users can launch ads, send email, build landing pages with AI, and deploy from Slack; The founder was not technical and built the app with AI |

### 39. I Built a $10K/Month App With This One System

| Field | Value |
|---|---|
| **Published** | 2026-06-21 |
| **Business** | Flame |
| **Description** | Daily ritual and relationship app for couples |
| **Category** | Mobile App |
| **Vertical** | Personal & Relationships |
| **MRR (normalised)** | $10,000 |
| **MRR basis** | The founder explicitly stated the current revenue as $10,000 MRR. |
| **Website** | — |
| **Founder** | On Neill |
| **Type** | Daily ritual and relationship app for couples |
| **Revenue** | 10,000 MRR · monthly (as of last year) — The app grew from 3,000 to 10,000 MRR in less than 8 months. |
| **Revenue — amount** | 10,000 MRR |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | last year |
| **Revenue — notes** | The app grew from 3,000 to 10,000 MRR in less than 8 months. |
| **Traffic / users** | 250,000 downloads; 50 million organic views |
| **Engagement** | — |
| **Tech stack** | Claude Code; Claude Design; RevenueCat; Mixpanel; TikTok native analytics; Hexfield; Nano Banana; Kling 3.0; SeedAndSpark |
| **Marketing channels** | TikTok; Instagram; Lemonade |
| **Marketing tactics** | Used organic short-form TikTok content, a portfolio of 15 to 20 TikTok accounts across 15 to 20 phones, high-volume hook testing, promoted comments from company accounts, AI-generated content, and outsourced UGC from Eastern European countries and Russia. The VSC framework evaluates content for virality, scalability, and convertibility. |
| **Pricing model** | Subscription model |
| **Customer count** | 250,000 downloads |
| **Growth metrics** | 3,000 to 10,000 MRR in less than 8 months; 50 million organic views; Roughly 58 million cumulative views over the last year; 150 pieces of content per day to test a single hook; 120,000 views on one video with eight or nine trials started; Roughly 1% conversion rate from a promoted-comment strategy; $1 for a 60-second UGC video; 15 to 20 TikTok accounts across 15 to 20 phones |
| **Notable quotes** | At one point, we were putting out 150 pieces every day to test a single hook.; You need to create enough content. Make more content, push out more volume, understand what's working, what's not working, what's working, double down on it, create more of it.; If you're not asking about the product, they don't mention the product, I would say that that's a bigger sign that it's not going to lead to high conversions. |
| **Other notable facts** | Flame gives couples one relationship question per day and requires each partner to answer before seeing the other's answer.; The app includes an AI relationship coach trained on users' answers.; The founder previously launched a fitness chain in China and scaled it to 50 million ARR across seven locations.; The founder's team tracks each account's status, views, likes, comments, hooks, and performance in spreadsheets.; The app is currently in the middle of a sales process.; The founder started Flame with his then French girlfriend, whom he later married. |

### 40. The First App I Ever Built Makes $25K/Month

| Field | Value |
|---|---|
| **Published** | 2026-06-14 |
| **Business** | Tone Adapt |
| **Description** | Website and mobile app for guitarists |
| **Category** | Mobile App |
| **Vertical** | Education & Learning |
| **MRR (normalised)** | $25,500 |
| **MRR basis** | Stated revenue over $25,000 monthly for combined website ($11.5k in past 4 weeks) and mobile app ($14,000 in past month) |
| **Website** | — |
| **Founder** | Kian |
| **Type** | Website and mobile app for guitarists that provides gear and tone settings for songs |
| **Revenue** | over $25,000 · monthly · combined website and mobile app revenue (as of past 4 weeks) — The website generated around $11 and 1/2 thousand dollars in the past 4 weeks and the mobile app generated another $14,000 in the past month. The website generated $45,000 in the past 3 months. |
| **Revenue — amount** | over $25,000 |
| **Revenue — period** | monthly |
| **Revenue — metric** | combined website and mobile app revenue |
| **Revenue — as of** | past 4 weeks |
| **Revenue — notes** | The website generated around $11 and 1/2 thousand dollars in the past 4 weeks and the mobile app generated another $14,000 in the past month. The website generated $45,000 in the past 3 months. |
| **Traffic / users** | over 100,000 users |
| **Engagement** | over 397 active subscribers in the past month since the mobile app launch |
| **Tech stack** | Cursor; Claude Code; Supabase; Vercel; Mailgun; Stripe; OpenAI API; Tavily web search API; RevenueCat; Superwall; Swift |
| **Marketing channels** | Instagram; TikTok; YouTube; Facebook; Meta ads; TikTok ads; UGC creators |
| **Marketing tactics** | Posted media three times a day, reposted across multiple platforms, put his face behind the brand, identified content formats that converted and scaled those formats aggressively, remade the first converting format 50 times with small variations, hired UGC creators to copy the format 60 times a month, and put money behind it on Meta and TikTok ads. |
| **Pricing model** | Tiered subscriptions with weekly plans at $10 a week and annual plans for around $60 a year |
| **Customer count** | 1,400 new subscribers in the past 3 months; over 397 active subscribers in the past month since the mobile app launch |
| **Growth metrics** | over 100,000 users; $25,000 a month in under 5 months; over $25,000 in revenue in the past 4 weeks; $45,000 on the website in the past 3 months; 1,400 new subscribers in the past 3 months; over 397 active subscribers in the past month; over 1,500 guitars and 2,000 amps in the database; V1 built in about a week; first video about Tone Adapt went viral overnight; posted three times a day |
| **Notable quotes** | Tone Up is a website and a mobile app for guitarists that allows any user to sound like their favorite song in under 30 seconds.; If you aren't posting your product for people to see, then nothing else here matters.; You can ship a web app today and get someone to pay for your product by tonight if you ship on the internet. |
| **Other notable facts** | Kian is 21 and a computer science major at San Diego State University.; He learned guitar about a year and a half before the interview and previously did UGC content for brands.; He built V1 over Thanksgiving break, with every line of code vibe-coded.; The mobile app is built natively in Swift and uses RevenueCat and Superwall.; The product database contains over 1,500 guitars and 2,000 amps.; The app ranks number two on the App Store for the keyword "guitar tone" after sponsor results, according to the interviewer. |

### 41. I Built A $1M SaaS In A Hidden Niche

| Field | Value |
|---|---|
| **Published** | 2026-06-10 |
| **Business** | Hero Analytics |
| **Description** | Analytics and reporting SaaS platform for email and SMS marketing agencies |
| **Category** | SaaS / Web App |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | $96,200 |
| **MRR basis** | Founder's stated current run-rate is about 96.2K in MR (monthly recurring revenue); the 'add close to 10K in MR every mo |
| **Website** | — |
| **Founder** | Zach |
| **Type** | Analytics and reporting SaaS platform for email and SMS marketing agencies |
| **Revenue** | over a million in ARR · 19 months (as of October 2024 launch) — Currently about 96.2K in MR and pacing to add close to 10K in MR every month |
| **Revenue — amount** | over a million in ARR |
| **Revenue — period** | 19 months |
| **Revenue — metric** | ARR |
| **Revenue — as of** | October 2024 launch |
| **Revenue — notes** | Currently about 96.2K in MR and pacing to add close to 10K in MR every month |
| **Traffic / users** | — |
| **Engagement** | churn is like extremely low |
| **Tech stack** | AWS; Snowflake; Retool; Cloud Code; Postscript; Attentive; Omnisend |
| **Tech stack — removed** (not found in transcript) | Klaviyo |
| **Marketing channels** | Shopify agency partner directory; Klaviyo partner directory; agency directories |
| **Marketing tactics** | Sell to email and SMS marketing agencies, using agency and partner directories to find and reach agencies by size and influence, and focusing on saving agency owners time. |
| **Pricing model** | Subscription with a 30-day free trial, priced based on client count, with larger agencies on bespoke pricing |
| **Customer count** | — |
| **Growth metrics** | Launched in October 2024; Went from zero to over $1 million in ARR in about 19 months; About $96.2K in MR; Adding close to $10K in MR every month; Example pricing: agency with 10 clients pays $500 per month, 20 clients pays $600 per month; Larger agencies with 200 clients might pay a couple thousand dollars per month; Example seat pricing: agency pays $10 per month per seat, with 20 customer seats adding $200 per month; 99% of launched features are relevant to every user every time; Previous email marketing agency ran for about 6 years with around 30 clients |
| **Notable quotes** | The path to finding like the business that really works is never linear.; Every agency owner is trying to take on more clients without hiring more people.; The sauce is not the data visualization, it's the time saved in doing so. |
| **Other notable facts** | Built by Zach and his partner Brendan; Focused specifically on email and SMS marketing agencies; Agencies can see all clients, team pacing versus goals, and automate reporting in one place; The founders worked at a data visualization startup that was acquired by Amazon, then worked at Amazon; They previously ran a failed newsletter business and an email marketing agency; AWS and Snowflake early bills were high, but the founders had prior ETL experience |

### 42. I Built Two Apps That Make $120K/Month

| Field | Value |
|---|---|
| **Published** | 2026-06-07 |
| **Business** | Card Stock and Scanemon |
| **Description** | Mobile apps for scanning, valuing, cataloging, and tracking sports and Pokémon trading cards |
| **Category** | Mobile App |
| **Vertical** | Gaming & Entertainment |
| **MRR (normalised)** | $120,000 |
| **MRR basis** | The founder explicitly stated revenue of $120K per month; the over-$1M annual figure is consistent with this run-rate. |
| **Website** | — |
| **Founder** | Kyle Fowler |
| **Type** | Mobile apps for scanning, valuing, cataloging, and tracking sports and Pokémon trading cards |
| **Revenue** | $120K a month · monthly · revenue — Combined revenue from two apps; also stated as over $1 million a year |
| **Revenue — amount** | $120K a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Combined revenue from two apps; also stated as over $1 million a year |
| **Traffic / users** | Card Stock gets about 13,000 downloads a month; Scanemon gets about 16,000 new customers a month |
| **Engagement** | — |
| **Tech stack** | Swift; SwiftUI; Core Data; RevenueCat; AWS EC2; Codex; ChatGPT subscriptions; Notion; Cursor; Slack; Framer; Claude; Supabase; Railway; Code Rabbit; WhisperFlow; Granola; Superwall |
| **Marketing channels** | TikTok; TikTok slideshows; Noise |
| **Marketing tactics** | Create simple, repeatable TikTok slideshow formats, test which formats convert and get views, balance those results to drive downloads, and distribute slideshows to creators through Noise by paying for the views they receive. |
| **Pricing model** | Subscriptions |
| **Customer count** | Card Stock has about 15,000 active subscriptions; Scanemon has about 3,400 active subscriptions |
| **Growth metrics** | Card Stock launched 6 years ago; Scanemon launched in 2025; Card Stock went from three guys making a few hundred bucks a month to five guys making $1.5 million a year; Card Stock has up to $75K monthly recurring revenue; Scanemon has $17K monthly recurring revenue; Card Stock took about six months from idea to completion, with a three-month gap in the middle; Scanemon's MVP was made in a day |
| **Notable quotes** | Card Stock is a sports card value scanner.; I built Scanemon last year in 2025. I tried to generate it, basically have Cursors agent generate everything, and it did insanely well. The MVP for Scanemon I made in a day.; People are usually happy to help and share information. |
| **Other notable facts** | Card Stock uses a phone camera to identify cards, show their value, and track collection values over time.; Scanemon is the Pokémon-card version of Card Stock.; Kyle built Card Stock using Swift and SwiftUI, with Core Data for storage.; The apps use a card-database back end hosted on an AWS EC2 server.; RevenueCat was added to handle subscriptions.; Kyle started Card Stock with two friends and split the revenue three ways when there was basically no revenue. |

### 43. I Built A $30K/Month App: Here's My Exact Process

| Field | Value |
|---|---|
| **Published** | 2026-05-31 |
| **Business** | Snag |
| **Description** | Consumer mobile app for finding free items nearby |
| **Category** | Mobile App |
| **Vertical** | E-commerce & Retail |
| **MRR (normalised)** | $30,000 |
| **MRR basis** | Founder explicitly stated $30,000 MRR (monthly recurring revenue). |
| **Website** | — |
| **Founder** | Benji |
| **Type** | Consumer mobile app for finding free items nearby |
| **Revenue** | $30,000 · monthly · MRR (as of around 4 months after launch) — The app launched around 4 months ago and generated over $80,000 in total proceeds. |
| **Revenue — amount** | $30,000 |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | around 4 months after launch |
| **Revenue — notes** | The app launched around 4 months ago and generated over $80,000 in total proceeds. |
| **Traffic / users** | over 100,000 authenticated users; 9,000 conversions; around 3.3 K App Store ratings |
| **Engagement** | — |
| **Tech stack** | Cursor; Claude Code Max; GoDaddy; Loops; Superwall; Mixpanel; Apple Developer account; Figma; Supabase; Figma |
| **Marketing channels** | UGC campaigns; Meta Ads; TikTok; YouTube; Twitter |
| **Marketing tactics** | Ran UGC campaigns at scale, identified and interviewed creators, put successful creators on monthly retainers plus a CPM structure, tested their videos, and turned videos with over 50,000 views into paid Meta ads. When budget was unavailable for creators, filmed videos directly and edited them at scale for paid ads. |
| **Pricing model** | Weekly, monthly, yearly, and one-time subscriptions |
| **Customer count** | 9,000 conversions |
| **Growth metrics** | Snag launched around 4 months ago; went from zero to $30,000 MRR; over 100,000 authenticated users; 9,000 conversions; over $80,000 in total proceeds; around 3.3 K App Store ratings; built over 45 apps in the past year or so; Snag's app-building process usually takes around 4 to 5 hours without the back end; UGC creator interviews typically have a 10% conversion rate; one UGC video received 240,000 views; around $3,000 was spent on one ad before its ROAS became negative; ad testing began around $50 a day and could scale to $100, $200, and $300; first app Pillar reached 11,000 users with basically zero CAC; sold his first media company for six figures; had a 4.0 GPA |
| **Notable quotes** | The highest leverage thing you could do is to find a great idea.; The final step is just iterating on the product so that you have a better product so that you get higher LTV, lower CAC.; Definitely create your own luck and meet the right people. |
| **Other notable facts** | Benji built Snag with his team at 10X Studio.; Snag helps users find free items near them, with search, filters, and favorites.; The app was built using Figma designs fed into Claude Code.; He previously worked in Congress, investment firms, quant research, and media companies.; He grew up in Asia and sold his first media company for six figures.; He built an app called Pillar and later built Hi GPT and 43 additional products. |

### 44. I Built A Micro-Version Of A $1B SaaS. Now I Make $50K/Month

| Field | Value |
|---|---|
| **Published** | 2026-05-28 |
| **Business** | Shipper |
| **Description** | AI app builder SaaS |
| **Category** | AI Wrapper |
| **Vertical** | AI & Automation (horizontal) |
| **MRR (normalised)** | $25,600 |
| **MRR basis** | The founder explicitly stated the current metric as '25.6 K MRR' for the monthly period; ARR of 307K also aligns (307000 |
| **Website** | — |
| **Founder** | David and Daniel |
| **Type** | AI app builder SaaS |
| **Revenue** | 25.6 K MRR · monthly (as of currently) — Gross volume is 71k; net volume is 65K. ARR is 307K. 90% of revenue comes from subscriptions and 10% from one-off top-ups. The narrator also states the business reached $50,000 a month and over $50,000 in gross monthly volume. |
| **Revenue — amount** | 25.6 K MRR |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | currently |
| **Revenue — notes** | Gross volume is 71k; net volume is 65K. ARR is 307K. 90% of revenue comes from subscriptions and 10% from one-off top-ups. The narrator also states the business reached $50,000 a month and over $50,000 in gross monthly volume. |
| **Traffic / users** | Around 690 paid users and zero free users |
| **Engagement** | — |
| **Tech stack** | Crisp; Notion; Frel; Charge; Webflow; WordPress; Data Fetch; X-Premium; Typefully; Told; Entropic's cloud models; GitHub; Vercel; Railway; Neon |
| **Marketing channels** | Product Hunt; Reddit; SEO; X, Twitter; email marketing; affiliates |
| **Marketing tactics** | They launched their MVP on Product Hunt, used Reddit for initial traction, focused on high-intent SEO keywords, and posted on X while building in public. They add their product link in the second tweet to drive traffic. They have not used any paid channels. |
| **Pricing model** | Users pay for credits that can be used to build apps. The cheapest plan is $25 a month. Separate cloud credits build back-ends, while builder credits cover everything else. |
| **Customer count** | Around 690 paid users and zero free users |
| **Growth metrics** | Zero to 50K monthly; ARR is 307K; Gross volume is 71k; Net volume is 65K; 90% of revenue comes from subscriptions and 10% from one-off top-ups; Made its first $50 MRR from the Product Hunt launch; Reddit regularly generated 400 upvotes; Reddit helped push growth from $50 to 1K MRR; Around day 50 of building in public, X started working; Made about 20K MRR in 1 or 2 weeks on X; By month three, had a working product they were confident with; By month four, had moved past catching up with competitors; By months five and six, were shipping features competitors did not have; Started building SaaS and tools in 2019; The first MVP shipped with one developer; 50 plus AI app ideas with real revenue… |
| **Notable quotes** | Find one common pain point and triple down on it.; Shipyard transforms your thoughts and ideas into a live business that can make money with zero skills required.; I start with something you genuinely know a lot about or care about. |
| **Other notable facts** | David and his brother Daniel are non-technical and learned marketing.; Their first success was Legit Check, a luxury goods authentication service that funded later ventures.; They have built, scaled, exited, and acquired a few companies.; Shipper can build websites, web apps, mobile apps, Chrome extensions, and bots for apps such as Telegram and Discord.; They found mobile-app demand by reviewing competitors' Trustpilot pages, public roadmaps, Discord servers, and customer-support conversations.; They offer no free plan and reinvest revenue in improving the product for paying users. |

### 45. I Built A $30K/Month in 35 Days

| Field | Value |
|---|---|
| **Published** | 2026-05-24 |
| **Business** | Pep AI |
| **Description** | iOS app for tracking peptides safely |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $11,000 |
| **MRR basis** | The RevenueCat dashboard explicitly reports the current MRR as $11K, which is more recent and directly comparable than t |
| **Website** | — |
| **Founder** | Cedric Roberge |
| **Type** | iOS app for tracking peptides safely, including dosage calculation, dose logging, injection-site tracking, quizzes, a research library, and lifestyle tracking |
| **Revenue** | $50,000 · 7 weeks · total revenue (as of 7 weeks after launch) — RevenueCat dashboard showed $33 thousand in the last 28 days, $51K total revenue, and MRR of 11K. |
| **Revenue — amount** | $50,000 |
| **Revenue — period** | 7 weeks |
| **Revenue — metric** | total revenue |
| **Revenue — as of** | 7 weeks after launch |
| **Revenue — notes** | RevenueCat dashboard showed $33 thousand in the last 28 days, $51K total revenue, and MRR of 11K. |
| **Traffic / users** | The app is helping thousands of people; nearly 2,000 active subscriptions |
| **Engagement** | — |
| **Tech stack** | Replit; Claude; RevenueCat; Resend; Firebase; Apple Health; PubMed |
| **Marketing channels** | TikTok; Instagram; Reddit; influencer marketing; App Store search; X |
| **Marketing tactics** | The founder scrolled social media to identify trending topics, reviewed existing apps and their reviews to identify desired features, reached out to influencers before launch to test interest, posted on Reddit to build a pre-launch waitlist, and benefited from organic App Store searches. One influencer's story post generated $1,000 in revenue, and his first actual post generated 50,000 views and about $4,000 in revenue that day, with the founder estimating over $10,000 in total revenue from that post. |
| **Pricing model** | Yearly subscription for $45 and monthly subscription for $10, with a 3-day free trial |
| **Customer count** | Almost 2,000 active subscriptions; waitlist of like 300 people before launch |
| **Growth metrics** | $50,000 in total revenue within 7 weeks; $33 thousand revenue in the last 28 days; MRR of 11K; About 2 weeks to build the app; About 1 week to get Apple approval; Apple expedited review took like 2 hours instead of 2 days; First app launched in October and got like 800 users; One influencer story post generated $1,000 in revenue; Influencer post got 50,000 views and generated like $4,000 in revenue that day; Founder estimates over $10,000 in revenue from one influencer post; Pre-launch Reddit waitlist had like 300 people; Goal to make Pep AI a $1 million month app |
| **Notable quotes** | We launched just 7 weeks ago and we've already hit $50,000 in total revenue.; I think marketing and distribution matters way more than your idea, than your app, how great it is.; My biggest piece of advice, and um the advice I've given myself this entire time is just literally never giving up on myself. |
| **Other notable facts** | Pep AI was initially rejected by Apple a number of times because Apple did not want the app giving medical advice.; Pep AI ranked number three in the App Store for the search term 'peptide tracker' at the time of the interview.; The founder's first app was a student marketplace app for the University of Oregon and made no money.; The app includes PubMed sources in its research library.; The app includes quizzes, meal scanning, nutrition tracking, weight tracking, Apple Health integration, and progress photos.; Cedric identified the peptide trend after a roommate mentioned peptides and he then saw a related TikTok on his For You page. |

### 46. I Make $1.7M/Year In The Most Boring Niche Imaginable

| Field | Value |
|---|---|
| **Published** | 2026-05-21 |
| **Business** | Savvy Nomad |
| **Description** | Subscription SaaS service helping US citizens abroad pay lower US state taxes via state domicile changes |
| **Category** | SaaS / Web App |
| **Vertical** | Finance & Money |
| **MRR (normalised)** | $140,000 |
| **MRR basis** | The founder explicitly stated the current revenue as $140,000 MRR, which is the most recent monthly run-rate and is cons |
| **Website** | — |
| **Founder** | Bo |
| **Type** | Subscription SaaS service helping US citizens abroad pay lower US state taxes via state domicile changes |
| **Revenue** | $140,000 MRR · monthly — ARR of $1.7 million; doing "almost $2 million a year" with six employees; "net volume slightly higher cuz we charge people up front"; "Today we do 1.7 million a year" |
| **Revenue — amount** | $140,000 MRR |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | — |
| **Revenue — notes** | ARR of $1.7 million; doing "almost $2 million a year" with six employees; "net volume slightly higher cuz we charge people up front"; "Today we do 1.7 million a year" |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Bubble; Framer; Ghost; ChatGPT; Claude; Ahrefs; Customer IO; Power BI; BigQuery; TurnKey churn analysis; Stripe; SavvyCal |
| **Marketing channels** | SEO |
| **Marketing tactics** | Free report of boring/unsexy business ideas with real revenue numbers offered for download via link in description; onboarding flow qualifying questions showing customers potential tax savings before presenting plans; customers complete the online portion of the process in less than an hour; pursuing a recurring layer on top of a single productized workflow |
| **Pricing model** | Three subscription plans: basic domicile, mid-tier plan (most popular), and premium "domicile premium"; billed upfront via Stripe |
| **Customer count** | Over 1,400 customers; 120 to 150 new customers added every month; over 1,400 active subscribers |
| **Growth metrics** | Approximately 10 million in state taxes saved for customers; Six employees; ARR of $1.7 million; 120-150 new customers added every month; Founded after previous startup in the digital nomad tax space |
| **Notable quotes** | We run basically the American infrastructure for people who don't live in America anymore.; For us, it was a state domicile change. We didn't try to solve all of the international taxation, we solved one thing really well.; I'd rather make $2 million a year in a boring business than $20,000 a year in a sexy AI app right now. |
| **Other notable facts** | Co-founded with a business/marketing co-founder; co-founder had met surfers from California abroad for years who were still paying California state taxes; Bo's inspiration came from rebuilding his life during the war in Ukraine, leading him into international taxation; Business works for four reasons: low competition for real demand, extremely high willingness to pay, concrete quantifiable value, and fit with team strengths; Suggested other boring million-dollar ideas: productized immigration workflows (agencies charge 8-15 thousand dollars), helping people move to tax-friendly jurisdictions (Dubai, Costa Rica, Malaysia) and exit sticky ones (Canada, UK, Spain), and international banking/asset holding/estate planning (e.g., Singapore accounts); Playbook for starting over: start with painf… |

### 47. My Two Apps Make $150K/Month Each

| Field | Value |
|---|---|
| **Published** | 2026-05-17 |
| **Business** | Glam Up |
| **Description** | Consumer mobile apps for beauty and personal growth, job search, and career guidance |
| **Category** | Mobile App |
| **Vertical** | Career & Hiring |
| **MRR (normalised)** | $150,000 |
| **MRR basis** | The founder stated she built multiple apps to over $150,000 a month each, with subscription revenue, making $150,000 the |
| **Website** | — |
| **Founder** | Nicole |
| **Type** | Consumer mobile apps for beauty and personal growth, job search, and career guidance |
| **Revenue** | around $150,000 a month each · monthly · revenue — The speaker said she built multiple apps to over $150,000 a month each. Glam Up and Sprout each use weekly or monthly subscriptions. |
| **Revenue — amount** | around $150,000 a month each |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The speaker said she built multiple apps to over $150,000 a month each. Glam Up and Sprout each use weekly or monthly subscriptions. |
| **Traffic / users** | Around 2 million total downloads for Glam Up; 1 million users in the first 6 months; Sprout had 400 million views during a 7-day period and around 4 to 500 million monthly views across TikTok, Instagram, and YouTube Shorts. |
| **Engagement** | More than 50% of creators who complete Nicole's creator course go viral within the first 2 weeks. |
| **Tech stack** | React Native; RevenueCat; Superwall; PostHog; Sideshift; Atio; Typeform; Discord |
| **Marketing channels** | TikTok; Instagram; YouTube Shorts; Reddit; UGC group chats; Sizzelle; influencer marketing; paid ads |
| **Marketing tactics** | She tests Reddit marketing, TikTok and Instagram faceless content, slideshows, different CTAs, face UGC, AI UGC, and actual UGC creators. Her system includes sourcing creators through inbound and outbound outreach, interviewing and onboarding them, providing an app-specific course with videos, modules, a content bank, and quizzes, then managing them through feedback calls or Discord chats. She also recommends designing apps to be inherently viral for social media, testing viral formats, double down on winning strategies, implementing creator referral systems, and using growth and analytics da… |
| **Pricing model** | Hard paywalls with weekly or monthly subscriptions for Glam Up and Sprout. |
| **Customer count** | — |
| **Growth metrics** | Glam Up reached 1 million users in 6 months.; Glam Up reached a peak of 150k MRR.; Sprout, previously PrepearAI, reached around 250k MRR in 8 months.; Sprout was steadily growing at around 200k MRR when discussed.; The two newer apps were in stealth and had around 200k MRR combined.; Nicole said she had built four apps in the past 2 years.; During Glam Up's scaling era, she managed around 200, maybe more, active creators.; At Glam Up's peak, she received around 40 to 50 million TikTok views and around 200 million Instagram views in one month.; Sprout's creator course course had more than 50% of participants go viral within the first 2 weeks. |
| **Notable quotes** | When it comes to distribution, you need to think of the design of the app as part of your distribution.; Every time you try a new strategy, really milk the hell out of it.; I think it's really important to turn virality into a system and a process. |
| **Other notable facts** | Nicole's first TikTok podcast gained 10K followers in the first 10 days.; She met co-founder Aaron while working at a tech startup; Aaron was in YC and H0 at the time.; They decided to start an app together during a 10-minute call.; Glam Up targets mostly women seeking to improve their makeup or skincare routines.; Sprout targets college students and post-college students seeking jobs.; Sprout can automatically apply for jobs on company websites and offers tailored resumes. |

### 48. I Built a $20K/Month App in 83 Days

| Field | Value |
|---|---|
| **Published** | 2026-05-10 |
| **Business** | Once |
| **Description** | Disposable camera app for events, especially weddings, birthday parties, and corporate events |
| **Category** | Mobile App |
| **Vertical** | Creator & Social Media |
| **MRR (normalised)** | $20,000 |
| **MRR basis** | The founder stated revenue of $20,000 a month; the ~$22,000 figure refers to the current month's total, not a recurring |
| **Website** | — |
| **Founder** | Brian Shin |
| **Type** | Disposable camera app for events, especially weddings, birthday parties, and corporate events |
| **Revenue** | $20,000 a month · monthly · revenue (as of within 83 days of launch) — The founder also said the current month totaled around $22,000; the app launched in December 2025. |
| **Revenue — amount** | $20,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | within 83 days of launch |
| **Revenue — notes** | The founder also said the current month totaled around $22,000; the app launched in December 2025. |
| **Traffic / users** | around 10,000 to 12,000 weekly active users |
| **Engagement** | — |
| **Tech stack** | Claude Code; Claude Code Max; Conductor; Supabase; Vercel; Figma |
| **Marketing channels** | X; LinkedIn; Instagram; Facebook; Reddit; TikTok; YouTube; cold messaging |
| **Marketing tactics** | To validate the product and get first customers, the founder went through personal contacts on X, LinkedIn, Instagram, and Facebook, identified people with upcoming events, and sent short cold messages. He searched Instagram for #wedding and #birthdayparty, assembled a cross-platform list of around 250 to 300 people, and sent two-to-three-sentence pitches. He built a quick web-app mockup and Figma prototype, defined a commitment metric of 10 events with actual dates and commitments to use the product before writing production code, and then launched. |
| **Pricing model** | Tiered pricing based on the number of invited guests: a 10-person birthday party costs $2, while a 150-person wedding costs $50. |
| **Customer count** | around 15 people replied and around 12 events were booked in the first month after outreach to 250 people |
| **Growth metrics** | Reached $20,000 in monthly revenue within 83 days of launch; Current month revenue totaled around $22,000; Weekly active users are around 10,000 to 12,000; More than 300 events scheduled for February; Around 700 events scheduled for March; The first web-app version took around a week or two to build; Traveled to almost seven or eight countries the previous year; Previously co-founded a venture-backed B2B startup with 50 people |
| **Notable quotes** | We set a number and didn't start building until we hit it.; Before writing a single line of code, I needed 10 events with an actual date, with an actual commitment that they would like to try using our product.; Stop overthinking and just launch. |
| **Other notable facts** | The app launched in December 2025.; The first web version was tested at a Halloween party with printed invitation codes and broke many times during the event.; The founder and his girlfriend fully bootstrapped Once after previously working at a venture-backed B2B startup.; All designs are created in Figma, and the founder does not use AI for design.; Users can create a film, set its ending date, choose when photos reveal, apply filters, customize invitation cards, and set participants and shots per person.; The team used AI for development and finance. |

### 49. How I Work: $77K/Month Solopreneur

| Field | Value |
|---|---|
| **Published** | 2026-04-26 |
| **Business** | Trust the Mual |
| **Description** | Marketplace and indie software app business |
| **Category** | Marketplace / Directory |
| **Vertical** | Creator & Social Media |
| **MRR (normalised)** | $77,000 |
| **MRR basis** | The founder explicitly stated revenue of $77,000 a month. |
| **Website** | — |
| **Founder** | Mark Manson |
| **Type** | Marketplace and indie software app business |
| **Revenue** | $77,000 a month · monthly · revenue — Made as a solo entrepreneur; also reported the marketplace makes $35K+ per month and a newly launched macOS app made about $1,000 in revenue on its first day |
| **Revenue — amount** | $77,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Made as a solo entrepreneur; also reported the marketplace makes $35K+ per month and a newly launched macOS app made about $1,000 in revenue on its first day |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Electron; macOS; code editor; ChatGPT; AI |
| **Marketing channels** | Twitter; LinkedIn; Threads; Reddit |
| **Marketing tactics** | Launching apps with a buy button, sharing launches on Twitter, LinkedIn, Threads, and Reddit, and publishing new work to grow an audience that discovers the apps. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | Built 35 startups; About 5% startup hit rate; Shipped about 300 marketplace features in the last 3 months; Shipped six new apps in 2026; New macOS app made about $1,000 in revenue on its first day; Marketplace makes $35K+ per month |
| **Notable quotes** | The only way to validate an idea is to ship it with a buy button.; It's the number of things you ship.; Every time you ship something new, you learn more stuff, you share about it so you grow a little audience of people who discover your work. |
| **Other notable facts** | Works nearly every day and follows an almost identical routine 365 days a year; Protects a 4-to-6-hour daily deep-work coding block with no email, customer support, or social media; Launched a macOS app that analyzes posture using a webcam; Works single-threaded with AI: makes a feature, releases it, then moves to the next; Goes to bed at 9:00 p.m. and wakes naturally around 6:00 to 7:00 without an alarm; Trains for Hyrox with his wife |

### 50. I Spent 24 Hours With A SaaS Millionaire

| Field | Value |
|---|---|
| **Published** | 2026-04-19 |
| **Business** | Task Magic |
| **Description** | Browser-based automation SaaS |
| **Category** | SaaS / Web App |
| **Vertical** | AI & Automation (horizontal) |
| **MRR (normalised)** | $250,000 |
| **MRR basis** | About $3 million in annual revenue divided by 12 gives approximately $250,000 per month; the mention of some months exce |
| **Website** | — |
| **Founder** | Jeremy |
| **Type** | Browser-based automation SaaS |
| **Revenue** | about 3 million annually · annual · revenue (as of last year) — The interview also says the business did upwards of $3 million a year; in some months it did north of 400 grand. |
| **Revenue — amount** | about 3 million annually |
| **Revenue — period** | annual |
| **Revenue — metric** | revenue |
| **Revenue — as of** | last year |
| **Revenue — notes** | The interview also says the business did upwards of $3 million a year; in some months it did north of 400 grand. |
| **Traffic / users** | over 60,000 users |
| **Engagement** | — |
| **Tech stack** | Zapier; Gmail |
| **Marketing channels** | SEO; cold email |
| **Marketing tactics** | The tentpole strategy: build small, cheap, specific side products that serve the core product, attract users through their own SEO, and create natural upsell paths into Task Magic. Mail Lead was built as a simple outbound email platform for Task Magic customers, and LeadQuest.ai was added as a lead-search product. |
| **Pricing model** | Lifetime deals and usage-based pricing |
| **Customer count** | about 8,000 paying customers |
| **Growth metrics** | over 60,000 users; about 8,000 paying customers; In some months, revenue was north of 400 grand; Made the Inc. 500 list with a single employee; The rebuilt product launched in 2020 and reached seven figures in revenue; Mail Lead brought in almost seven figures of revenue; Over 100 people messaged Jeremy after Task Magic was listed on acquire.com; The sale process took about 6 months to 7 months; The business was sold in the mid upper seven figures |
| **Notable quotes** | The tent pole strategy is essentially making small, cheap products that serve this core because they will essentially rank on their own and make more money.; The big thing to like walk away with is these aren't like separate side hustles. They're serving the same ecosystem.; Focus on the problems, you know? Have your bad day, have your bad video, share it. |
| **Other notable facts** | Jeremy started as a non-technical solo founder and hired his first employee in early 2019.; The company operated with Jeremy and one employee before the sale.; Task Magic received the Product Hunt Golden Kitty Award and an AppSumo award.; Jeremy sold Task Magic through acquire.com.; Before the sale, he put 50 grand on his Amex Platinum card and took on 200 grand more in personal debt to pay bills.; Jeremy said he wanted to exit the company before turning 38. |

### 51. I Made $1.5M From An App You’ve Never Heard Of

| Field | Value |
|---|---|
| **Published** | 2026-04-12 |
| **Business** | Parakeet Chat |
| **Description** | AI learning and communication SaaS for incarcerated people |
| **Category** | AI Wrapper |
| **Vertical** | Education & Learning |
| **MRR (normalised)** | $25,000 |
| **MRR basis** | Stated revenue of a little over $300,000 annually, consistent with the $300,000-per-year SaaS description; divided by 12 |
| **Website** | — |
| **Founder** | Jordan |
| **Type** | AI learning and communication SaaS for incarcerated people |
| **Revenue** | a little over 300k · annual · revenue (as of 2025) — The business was also described as a $300,000 per year SaaS. In total, it has made 1.5 million American dollars over its lifetime. |
| **Revenue — amount** | a little over 300k |
| **Revenue — period** | annual |
| **Revenue — metric** | revenue |
| **Revenue — as of** | 2025 |
| **Revenue — notes** | The business was also described as a $300,000 per year SaaS. In total, it has made 1.5 million American dollars over its lifetime. |
| **Traffic / users** | Around 30,000 people have tried it, representing 20% of the entire federal prison population in the United States. |
| **Engagement** | Nearly 100,000 family connections and more than 9 million messages sent since launch. |
| **Tech stack** | TypeScript; React; Postgres; Redis; Auth0; Prisma; Zod; Docker; ChatGPT; AI system |
| **Marketing channels** | Word of mouth; Customer referrals |
| **Marketing tactics** | The founder showed the product to contacts inside prison, who showed it to other incarcerated people. He also built an internal recruitment system that gave existing customers around a month of free credits when they referred someone who signed up and began paying. |
| **Pricing model** | Monthly SaaS subscription costing 15 or 20 bucks a month depending on the plan, with a discount for yearly plans. |
| **Customer count** | 200 paying users within the first month; around 30,000 people had tried the service in total. |
| **Growth metrics** | 200 paying users within about 1 month; $300,000 per year in SaaS revenue; A little over 300k in revenue in 2025; Over 1.5 million American dollars in lifetime revenue; Around 30,000 total users; 20% of the entire federal prison population in the United States; Almost 100,000 family connections; More than 9 million messages sent; Prototype took 1 month to build; Payment system took another month to build; Profitable from the second month |
| **Notable quotes** | People will be your zealots, right? They'll be your cultists.; The specifics about how to validate aren't as important as the fact that you must validate.; People say an overnight success, no such thing. |
| **Other notable facts** | The app helps incarcerated people use ChatGPT and other AI services for learning, including legal rights and case law.; Users can communicate with family through the service.; Users access the service through the internal prison email system rather than a downloadable mobile app.; The founder built the MVP in prison because the prison ecosystem is closed and users could not easily visit a webpage or provide email addresses.; Jordan solo-bootstrapped two businesses, each having made over a million in total revenue.; The founder previously worked on self-driving cars, drones, a moon rover, and other robotics. |

### 52. My App Makes $20K/Month: How I Found A Simple Idea And Turned It Into A Profitable Business

| Field | Value |
|---|---|
| **Published** | 2026-04-08 |
| **Business** | Cut Coach |
| **Description** | mobile app for combat sport athletes to cut weight for competition |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $20,000 |
| **MRR basis** | The founder explicitly stated revenue of $20,000 per month, also describing over $20,000 in a single month. |
| **Website** | — |
| **Founder** | Ethan |
| **Type** | mobile app for combat sport athletes to cut weight for competition |
| **Revenue** | $20,000 per month; over $60,000 in total revenue · per month; total over 6 months (as of over the last 6 months) — The app was launched in September; revenue was also described as over $20,000 in a single month. |
| **Revenue — amount** | $20,000 per month; over $60,000 in total revenue |
| **Revenue — period** | per month; total over 6 months |
| **Revenue — metric** | revenue |
| **Revenue — as of** | over the last 6 months |
| **Revenue — notes** | The app was launched in September; revenue was also described as over $20,000 in a single month. |
| **Traffic / users** | Around 38,000 downloads; around 39,000 downloads |
| **Engagement** | — |
| **Tech stack** | Cursor; ChatGPT; Figma; Supabase; Vercel; JavaScript; OpenAI API; RevenueCat; Mixpanel; Superwall; Cron Job |
| **Marketing channels** | organic social media posts; TikTok; Instagram Reels; influencer marketing; paid ads |
| **Marketing tactics** | Ethan adapted ideas from social media pages in the same niche, posted videos with a call to action to download the app, partnered with small influencers by sending direct messages, started with influencers receiving 1,000 to 10,000 views per video, later worked with influencers receiving 20,000 plus views per video, and put influencer videos into paid ads. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | 10 to 15 downloads per day from posts with 200 to 500 views; 5 to 10% conversion ratio on views; 38,000 downloads; 39,000 downloads; $20,000 per month; over $60,000 in total revenue over 6 months; MVP built in around a month; App released in September; Started building the app in June of last year; About 6 months to build the first app |
| **Notable quotes** | My product solved a very specific pain point that no other apps solved, it converted very well.; You don't need to get millions of views like you think you might need to do if you can get 5 to 10% conversion ratio on views.; The reason my other apps didn't make any money was just because I didn't market them. |
| **Other notable facts** | Ethan is 19 years old and dropped out of college.; The app was initially beta-tested with his wrestling club, but the club did not use the original coach-directed version.; During July and August, he redesigned the app so athletes received the weight-cutting plans directly.; The app uses nutrition tracking, weight tracking, and recommended meals to help athletes cut weight.; He was a provincial judo champion and a national wrestling champion.; The app was designed for combat sport athletes, including wrestlers. |

### 53. How This App Makes $35K/Month

| Field | Value |
|---|---|
| **Published** | 2026-04-05 |
| **Business** | Money Ai |
| **Description** | iOS expense tracking app |
| **Category** | Mobile App |
| **Vertical** | Finance & Money |
| **MRR (normalised)** | $35,000 |
| **MRR basis** | The most recent stated figure is over $35K MRR, so the current MRR is at least $35,000 per month. |
| **Website** | — |
| **Founder** | Flo |
| **Type** | iOS expense tracking app |
| **Revenue** | over 35K MRR · monthly — Grew from $300 MRR to over $35K MRR |
| **Revenue — amount** | over 35K MRR |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | — |
| **Revenue — notes** | Grew from $300 MRR to over $35K MRR |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Xcode; Claude Code; RevenueCat; Appwrite; OpenAI; Anthropic; Helm; Figma; Apple Pay; Shortcuts integrations; AI |
| **Marketing channels** | Influencer marketing; Main YouTube channel; Meta Ads; TikTok; Reddit; Paid ads; Email outreach |
| **Marketing tactics** | Partnered with one Colombian influencer who posts three high-quality, story-driven videos per month on his main channel. The influencer is responsible for video ideas and receives a fixed monthly retainer plus a percentage of profits. The app's social links helped the influencer find the founder. Outreach tactics include finding aligned partners, warming up the relationship, making specific personalized outreach, connecting the influencer's content to the product, signaling willingness to pay early, keeping messages brief, and sending personalized videos. The founder also recommends adding so… |
| **Pricing model** | Subscription-based app with a 7-day free trial and a hard paywall |
| **Customer count** | — |
| **Growth metrics** | Launched around 3 years ago; Spent around 1 and 1/2 years scaling to $300 MRR by himself; Partnered with a content creator and scaled to over 35K MRR in just over a year; Overall growth of over 10,000%; First influencer video posted at the end of 2024; Within a week of the first influencer video, MRR increased 10x; Within a month, MRR was at almost 8K; Two videos helped reach 7.8K MRR from $300; Another video added more than 5K MRR, reaching 13K MRR; Invited by Apple to join Dub Dub DC on June 21; One video received 1.7 million views and added almost 5K MRR; Latest video about a requested feature helped reach over 35K MRR; First app version took a month or two to build; Claude Code costs $1… |
| **Notable quotes** | The partnership is largely built on trust right now.; We only post three videos per month. They are very high quality, so we really want to have quality over quantity.; The only thing wrong with your app is that nobody was seeing it. |
| **Other notable facts** | Flo is from Germany and previously worked as a mobile UX lead.; He quit his job earlier that year to work on his apps full-time.; The app uses AI voice input, automations, budgets, and AI-generated financial reports.; The app is minimalistic and does not use tabs.; The creator's videos convert at a fairly high rate despite not receiving millions of views.; The partnership initially used a percentage of revenue but switched to a percentage of profits plus a fixed monthly retainer because the revenue model did not scale well. |

### 54. I'm 14 And I Built A $14K/Month App

| Field | Value |
|---|---|
| **Published** | 2026-04-01 |
| **Business** | Locked |
| **Description** | Gamified health and fitness app |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $14,000 |
| **MRR basis** | The founder stated revenue was $14,000 per month, and also described the app as doing over $14,000 a month, supporting a |
| **Website** | — |
| **Founder** | Evan |
| **Type** | Gamified health and fitness app |
| **Revenue** | $14,000 per month · monthly · revenue (as of 4 months after launch) — The app was also described as doing over $14,000 a month. |
| **Revenue — amount** | $14,000 per month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | 4 months after launch |
| **Revenue — notes** | The app was also described as doing over $14,000 a month. |
| **Traffic / users** | About 1,800 downloads from a Jeremiah Jones video that received approximately 1 million views across all platforms. |
| **Engagement** | — |
| **Tech stack** | Figma; Cloud Code; Xcode; Superwall; Superbase |
| **Marketing channels** | Influencer partnerships; Instagram; TikTok; YouTube Shorts; YouTube |
| **Marketing tactics** | Evan finds creators in the app's niche on Instagram or TikTok, sends each creator the same message, gets them on a call, and structures deals using flat-rate, CPM, minimum-view-clause, or bonus arrangements. He closes creators on a CPM lower than his RPM, sends video requirements and a contract, and gives creators a 1-week deadline to publish their first video. |
| **Pricing model** | $40 a year, $7 a week, or $20 a year after the user exits the paywall; the yearly option includes a 3-day free trial. |
| **Customer count** | — |
| **Growth metrics** | Reached $14,000 per month in only a few months; Reached the revenue level 4 months after launching; Took about a month and a half from idea to live in the App Store; Jeremiah Jones video generated around $3,000 and about 1,800 downloads; Jeremiah Jones video received approximately 1 million views across all platforms; Paid Jeremiah Jones about $800 with a 600,000 minimum view clause; Problem Pal peaked at about $2,000 per month; Cloud Code subscription costs $200 a month; Superwall takes 1% of earnings |
| **Notable quotes** | Locked is a gamified health fitness app and the whole point of it is to help our users stay on task while gamifying the whole experience.; I partner with influencers to promote my app.; I would tell myself to worry less about school and put more time into building my business. |
| **Other notable facts** | Locked uses leaderboards, XP, badges, levels, characters, rankings, and a motivational screen.; Users earn 100 XP for checking off a task.; Influencer videos are required to show the app within the first 15 seconds.; Evan previously built Problem Pal and Clear AI.; He developed Roblox games at age 9.; The app's designs were completed in about 2 weeks. |

### 55. My App Made $120K in 24 Hours

| Field | Value |
|---|---|
| **Published** | 2026-03-29 |
| **Business** | Flogga |
| **Description** | Mobile app for yoga teachers and practitioners |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | — |
| **MRR basis** | $117,000 was one-off revenue generated within 24 hours, not a recurring monthly run-rate. |
| **Website** | — |
| **Founder** | Umberto |
| **Type** | Mobile app for yoga teachers and practitioners |
| **Revenue** | over $120,000 in just 24 hours · one-off · revenue (as of May 5, 2025) — Flogga launched at 2:00 p.m. on May 5 and generated $117,000 by the end of that day. |
| **Revenue — amount** | over $120,000 in just 24 hours |
| **Revenue — period** | one-off |
| **Revenue — metric** | revenue |
| **Revenue — as of** | May 5, 2025 |
| **Revenue — notes** | Flogga launched at 2:00 p.m. on May 5 and generated $117,000 by the end of that day. |
| **Traffic / users** | about 4,000 active users between paid and free |
| **Engagement** | — |
| **Tech stack** | Flutter; Firebase; RevenueCat; Vimeo; OneSignal |
| **Marketing channels** | email; YouTube; landing pages; lead generation; Telegram |
| **Marketing tactics** | Umberto pre-launched Flogga with a limited-time, limited-quantity lifetime deal, warmed up the audience for about a month and 1 week through a storytelling email sequence, created curiosity, showed the app and its roadmap in a video, and avoided displaying the price before launch day. He also built a content buffer of email graphics, videos, and landing pages before promotion and generated leads to reach people who had never heard of the app. |
| **Pricing model** | Lifetime access was offered through three limited tiers priced at around $109, $199, and $349. The app later moved to recurring subscriptions with monthly, website-only quarterly, and yearly tiers. |
| **Customer count** | between 500 and 600 early customers |
| **Growth metrics** | Pre-launched in May 2025; Launched on May 5th at 2:00 p.m.; $117,000 generated by the end of launch day; about 4,000 active users between paid and free; doing between $9,000 and $10,000 a month; approximately $25 a month for Firebase; Play Pause Be generated over $200,000 in the first month on Kickstarter; Lifetime buyers are willing to pay three to five times more than yearly subscribers |
| **Notable quotes** | My approach here is always to monetize as early as you can.; Never show the price before the actual launch date.; Stop waiting for perfect. Perfection is just fear disguised as preparation. |
| **Other notable facts** | Umberto is not a developer and studied economics.; Umberto previously raised seed funding for a startup in 2012 that failed.; He and his girlfriend created Play Pause Be in 2020 as a side project focused on yoga decks of cards.; Flogga's lifetime launch involved no refunds.; The lifetime offer was recommended to be limited to 5 to 7 days and a limited number of spots.; Umberto created a Telegram group with early lifetime-deal adopters. |

### 56. I Built a $100K/Month Android App

| Field | Value |
|---|---|
| **Published** | 2026-03-25 |
| **Business** | Joinable |
| **Description** | AI calorie counter and nutrition assistant mobile app |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $80,000 |
| **MRR basis** | The founder explicitly stated current MRR is around $80K; the just-under-$1M ARR annual figure is consistent when divide |
| **Website** | — |
| **Founder** | Steve |
| **Type** | AI calorie counter and nutrition assistant mobile app |
| **Revenue** | $125,000 in the past 28 days; over $100,000 per month · past 28 days; monthly · revenue — MRR around 80K and just under 1 million ARR in annual terms |
| **Revenue — amount** | $125,000 in the past 28 days; over $100,000 per month |
| **Revenue — period** | past 28 days; monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | MRR around 80K and just under 1 million ARR in annual terms |
| **Traffic / users** | Almost 1 million downloads on Android |
| **Engagement** | Just over 30,000 active subscribers |
| **Tech stack** | Firebase; GA4; BigQuery; GCP; Google Play; Google Ads; RevenueCat; Cloud Code; Cloud Co-Work; OpenAI Premium; GitHub Copilot; CodeRabbit; Fixer; 8N; AppFollow; Webflow |
| **Marketing channels** | Product Hunt; Meta ads; Google Ads; Google Display network; Google Search; YouTube; Google Discover; Google Play ads |
| **Marketing tactics** | Launched on Product Hunt and secured a front-page feature, tested Android and iOS campaigns, concentrated on Android because it was more cost-effective, implemented attribution and measurement for installs, paywall actions, trials, and purchases, launched low-cost install campaigns, tested different advertising assets, updated Play Store listing assets, and scaled campaign budgets. |
| **Pricing model** | Premium subscription with monthly and annual subscription packages |
| **Customer count** | Around 40,000 total subscribers |
| **Growth metrics** | Bootstrapped from less than $1,000 in revenue up to $100,000 per month over the past year; About 80% of users and revenue come from Android; About 20% of users and revenue come from iOS; Product Hunt generated a couple hundred installs; Two Product Hunt installs converted to subscribers; Just under $500,000 spent on ads and almost the same amount in revenue attributed to Google ads; Founder dropped 45 kilos or 100 lb, from 125 kilos to 80 kilos; In the past couple years, five times as many iOS apps were released compared with two times as many Android apps; Google App campaigns require 10 pieces of copy, up to 20 images, and 20 videos; Recommended campaign budget is 10 times the CPI |
| **Notable quotes** | The number one thing that we focus on is simplicity, is the quick and easy experience that we offer.; If you're bootstrapping like we are, Android is actually way better.; The best people that we talk to are the people that are like crushing it. They all have like this system. |
| **Other notable facts** | The app was built approximately 18 months before the interview.; It tracks calories, macros, weight loss, meals, exercise, and weekly tracking.; Users can enter food by text or select a meal photo for ingredient and portion-size identification.; The business has been bootstrapped with the founders' own money since day one.; iOS cost per thousand views or cost per view was stated to be almost four times as high as Android.; The app had a million-dollar annual revenue level, according to the interview. |

### 57. I Make $250K/Month From 13 Businesses (After Losing Everything to AI)

| Field | Value |
|---|---|
| **Published** | 2026-03-22 |
| **Business** | Jackie Chow's portfolio of online businesses |
| **Description** | Portfolio of internet businesses |
| **Category** | Portfolio of Products |
| **Vertical** | Other / Miscellaneous |
| **MRR (normalised)** | $250,000 |
| **MRR basis** | The founder explicitly stated $250,000 a month, so the current monthly recurring revenue is $250,000. |
| **Website** | — |
| **Domains mentioned** | Trackings.ai |
| **Founder** | Jackie Chow |
| **Type** | Portfolio of internet businesses, including an SEO agency, B2B SaaS products, content sites, and an e-commerce brand |
| **Revenue** | $250,000 a month · monthly · revenue — Portfolio total; Indexsy generated $85,000 per month and 500k over the last 12 months, Local Rank generated 454k since March (roughly 50k per month), Advise generated 300k over the last 12 months, and Trackings.ai generated 25 to 30k per month |
| **Revenue — amount** | $250,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Portfolio total; Indexsy generated $85,000 per month and 500k over the last 12 months, Local Rank generated 454k since March (roughly 50k per month), Advise generated 300k over the last 12 months, and Trackings.ai generated 25 to 30k per month |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Stripe; PayPal; YouTube; ChatGPT; Seed amp 2.0 |
| **Marketing channels** | YouTube; X; email newsletter; lead magnets; SEO |
| **Marketing tactics** | Posting daily YouTube videos in a narrow niche, providing solutions to problems the audience already has, using hooks within the first five seconds, optimizing for trends and search, and building a simple funnel from each video to a newsletter lead magnet before pitching services. The Local Rank launch's 20k MRR came 80% from YouTube, with 1.8k views, while an X launch post received around 30k views and generated 20% of the revenue. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | Portfolio of more than 10 online businesses making $250,000 a month; 13 income streams; Indexsy: $85,000 per month and 500k over the last 12 months; Local Rank: 454k since March, roughly 50k per month; Local Rank launched at 20k per month right out the gate; Advise: 300k over the last 12 months; Trackings.ai: 25 to 30k per month; Seven to eight other revenue sources ranging from 170 to 5k per month; Started the SEO agency in 2015 and had been running it for 10 plus years; YouTube posting for two and a half years; First YouTube video received 30 views in the first 24 hours; Daily uploads generally receive one to two K views; Local Rank launch: 80% of 20k MRR came from YouTube's 1.8k views; X… |
| **Notable quotes** | Google's helpful content update plus AI overviews completely destroyed my business.; It was my insurance policy.; I'm living proof that diversification is the only way you'll survive the AI age, especially with the daily emergence of new LLMs. |
| **Other notable facts** | The founder runs an SEO agency, a couple B2B SaaS products, and previously built content sites and an e-commerce brand.; AI Overviews reduced clicks to the founder's foodie blog, which earned money through display ads and affiliate commissions.; Local Rank was built using the founder's experience in local SEO.; The founder's YouTube approach focuses on daily stream-of-consciousness videos that resonate with viewers despite low view counts.; The founder recommends starting in a niche the creator can completely own, such as local SEO or AI SEO.; The founder's stated YouTube playbook has seven steps: own a niche, commit to daily uploads for six months with one long-form and one short-form video per day, solve audience problems, use five-second hooks, optimize for trends and search, build a n… |

### 58. I Make $17K/Month With One Strategy

| Field | Value |
|---|---|
| **Published** | 2026-03-19 |
| **Business** | Follow Buddy |
| **Description** | SaaS subscription app for finding Instagram unfollowers |
| **Category** | SaaS / Web App |
| **Vertical** | Creator & Social Media |
| **MRR (normalised)** | $17,000 |
| **MRR basis** | Founder stated revenue of $17,000 a month, which is the current monthly run-rate; other dashboard figures are non-compar |
| **Website** | — |
| **Founder** | Ben |
| **Type** | SaaS subscription app for finding Instagram unfollowers |
| **Revenue** | $17,000 a month · monthly · revenue — The dashboard also showed revenue of 1742 over the last 28 days, 14,000 new customers, and 2,752 active subscriptions. |
| **Revenue — amount** | $17,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The dashboard also showed revenue of 1742 over the last 28 days, 14,000 new customers, and 2,752 active subscriptions. |
| **Traffic / users** | 82,000 users currently |
| **Engagement** | 484 people actively on a trial |
| **Tech stack** | React; SendGrid; MongoDB; AWS; Keywords Everywhere; RevenueCat; Instagram export data feature |
| **Marketing channels** | YouTube; TikTok; Instagram; YouTube Search; SEO |
| **Marketing tactics** | Uses a repeatable YouTube search playbook: identify keywords through Keywords Everywhere and VidIQ, prioritize them by search volume and purchase intent, make short videos targeting each keyword, front-load the primary keyword in titles, add relevant descriptions and tags, guide viewers to related videos through the awareness ladder, monitor performance, and remake variations until ranking. All traffic is organic, and the business has spent $0 on ads. |
| **Pricing model** | Freemium subscription with a free trial followed by weekly, monthly, or yearly plans; the yearly plan is pushed most at $50 per year. |
| **Customer count** | 3,128 paying users |
| **Growth metrics** | $17,000 a month in revenue; 82,000 users; 3,128 paying users; 484 people actively on a trial; 40,000 views over the last 28 days; 25,000 views for the video "best Instagram unfollower tracker apps"; Video receives views every 48 hours; Video was made 7 months ago; Video took 20 minutes to make; 1 something million views for an earlier video; Ranked number one for "unfollower app Instagram"; Ranked number one for "best Instagram unfollower tracker"; 2 years ago development reached an acceptable price point; 4 years spent developing the idea; 7 years running a marketing agency; $0 spent on ads; Revenue Cat processes payments and takes about 1% on all transactions |
| **Notable quotes** | All of our traffic is organic and it's all searchbased across the different social platforms.; We definitely push the yearly plan the most at a $50 per year price tag.; Don't over complicate it. If you even have the slightest idea or inclination, go try it. |
| **Other notable facts** | Follow Buddy uses Instagram's approved export data feature and does not violate Instagram's terms of service.; The founder developed the product with a full-time developer.; A list-sorting tool received traffic of about a million people after the founder sent it through a viral video.; The approach became known as the "compare lists method."; A HubSpot database cited in the interview contains 190 plus micro-SaaS business ideas. |

### 59. I Make $60K/Month From the Most Boring SaaS on the Internet

| Field | Value |
|---|---|
| **Published** | 2026-03-15 |
| **Business** | Packager |
| **Description** | Browser-based SaaS tool for IT administrators to deploy applications to Microsoft Intune with one click |
| **Category** | SaaS / Web App |
| **Vertical** | Developer Tools |
| **MRR (normalised)** | $60,000 |
| **MRR basis** | The founder described the business as earning about $60,000 per month, a direct monthly run-rate figure. |
| **Website** | — |
| **Founder** | Thomas |
| **Type** | Browser-based SaaS tool for IT administrators to deploy applications to Microsoft Intune with one click |
| **Revenue** | about 60k a month · monthly · revenue — The host described it as a '$60,000 per month business' and stated the business was 100% bootstrapped. |
| **Revenue — amount** | about 60k a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The host described it as a '$60,000 per month business' and stated the business was 100% bootstrapped. |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Bubble.io; GitHub Actions; GitHub; Microsoft Azure; monday.com; Microsoft 365; Microsoft Intune |
| **Marketing channels** | Reddit; YouTube; Microsoft MVP partners |
| **Marketing tactics** | Launched the product completely free on Reddit, fixed early bugs and stabilized the platform using initial feedback, then introduced a $25 US dollar monthly subscription. The most effective strategy was partnering with people who specialized in the product, including Microsoft MVPs who created demos for a highly targeted audience. |
| **Pricing model** | $25 US dollar subscription fee per month |
| **Customer count** | thousands of paying customers |
| **Growth metrics** | 447k as opposed to 910k, which the founder described as really good growth; 100% bootstrapped; The side project grew into a full-time business; A piece of content got the founder hundreds of paying users overnight for free |
| **Notable quotes** | When I built this, this was before AI coding tools like Cursor and Claude Code existed.; You want to launch early and share it with your target audience, and then listen closely to the feedback that they provide.; Charge early even if the price is low. |
| **Other notable facts** | Packaging an application in Microsoft Intune could take an hour, including verifying that it would install.; The founder discovered on forums that other IT administrators had the same problem.; Existing solutions were described as too technical or too expensive.; The founder targeted smaller businesses while competitors focused on customers with millions of devices.; The team is small, keeps costs low, works from home, and has a work-life balance.; The product includes pre-managed applications in its own catalog. |

### 60. How This $250K/Month SaaS Got Its First 100 Users (Steal This Playbook)

| Field | Value |
|---|---|
| **Published** | 2026-03-11 |
| **Business** | Super Demo |
| **Description** | AI-powered demo automation SaaS |
| **Category** | AI Wrapper |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | $250,000 |
| **MRR basis** | stated run-rate |
| **Website** | — |
| **Founder** | Joseph |
| **Type** | AI-powered demo automation SaaS that creates interactive, clickable product demos |
| **Revenue** | slightly over 3 million ARR; just over 250k MRR · annual recurring revenue and monthly recurring revenue (as of currently) — Super Demo launched around 2 and 1/2 years ago and has also been described as making over $250,000 a month. |
| **Revenue — amount** | slightly over 3 million ARR; just over 250k MRR |
| **Revenue — period** | — |
| **Revenue — metric** | annual recurring revenue and monthly recurring revenue |
| **Revenue — as of** | currently |
| **Revenue — notes** | Super Demo launched around 2 and 1/2 years ago and has also been described as making over $250,000 a month. |
| **Traffic / users** | 150,000 plus users; free tools bring in roughly 20% of all traffic |
| **Engagement** | Free tools convert like 15 to 20% of all visitors into sign-ups |
| **Tech stack** | Claude Code; Cursor; Codex; Linear; Slack; AWS; Postmark; Intercom; Ahrefs; Clay; Zapier |
| **Marketing channels** | SEO; AI LLMs; free tools; comparison pages; Reddit; Indie Hackers; word of mouth; watermarks; referrals; product updates; building in public; LinkedIn; Starter Story |
| **Marketing tactics** | The company created SEO content across the funnel, comparison pages for every competitor, ungated free tools, programmatic SEO pages with embedded Super Demos, and free demos posted directly for founders on Reddit and Indie Hackers. It also used direct outreach, product updates, building in public, referrals, and sharing demos publicly to create a viral loop. |
| **Pricing model** | Starter and premium tiers |
| **Customer count** | — |
| **Growth metrics** | Two separate products scaled to over 3 million in annual recurring revenue; Super Demo went from zero to 150,000 plus users; Super Demo launched around 2 and 1/2 years ago; Named G2's number five fastest-growing product in 2025; Approximately 30-40% of visitors come from SEO and LLMs; Approximately 30% of visitors come from word of mouth, watermarks, and referrals; Approximately 20% of visitors come from building in public on LinkedIn; Free tools convert like 15 to 20% of visitors into sign-ups; Talked to probably a hundred plus B2B SaaS founders during early validation; Rotates through 50 plus different tools every month; A Super Demo was created in like 2 minutes during the demonstration |
| **Notable quotes** | If you identify the right problem, the world is a very, very big place.; As a founder, the only advantage you have over an incumbent is urgency and speed.; Stop obsessing over the competition and the idea and just start building. |
| **Other notable facts** | Super Demo creates guided, clickable, realistic versions of products that can be embedded on websites or in documentation.; The company describes itself as a product-led growth SaaS company.; During early validation, Joseph spoke with probably a hundred plus B2B SaaS founders.; Super Demo has a Chrome extension and supports guided HTML recordings.; Demos are editable and can include chapters, HTML changes, voice-overs, cloned voices, face recordings, and camera recordings.; Joseph previously built a B2B seafood marketplace and has run businesses including an electronics reselling operation, a soy candle business, a clothing company, and a digital agency. |

### 61. I Built a $10K/Month SaaS Using Other People's Customers

| Field | Value |
|---|---|
| **Published** | 2026-03-08 |
| **Business** | Lancer |
| **Description** | SaaS AI agent that automates job discovery, qualifying, and bidding on Upwork |
| **Category** | AI Wrapper |
| **Vertical** | Career & Hiring |
| **MRR (normalised)** | $10,000 |
| **MRR basis** | stated run-rate |
| **Website** | — |
| **Founder** | Ivan |
| **Type** | SaaS AI agent that automates job discovery, qualifying, and bidding on Upwork |
| **Revenue** | $10,000 a month · monthly · MRR (as of third or fourth month after launching) — Reached from zero to $10,000 MRR in just a few months without running ads or building an audience. |
| **Revenue — amount** | $10,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | third or fourth month after launching |
| **Revenue — notes** | Reached from zero to $10,000 MRR in just a few months without running ads or building an audience. |
| **Traffic / users** | — |
| **Engagement** | Customers are said to save over 10 hours a week on repetitive work; no retention or churn figures were stated. |
| **Tech stack** | TypeScript; Next.js; Node.js; GCP; Firestore; LLMs; Cursor; Opus 4.5; OpenRouter; Hetzner; Elasticsearch; Stripe |
| **Tech stack — removed** (not found in transcript) | Tolt |
| **Marketing channels** | Affiliates; Upwork coaches; LinkedIn cold outreach |
| **Marketing tactics** | Used a connector strategy centered on Upwork coaches who had trusted networks of ideal customers. Most growth came from two coaches: one was introduced by a beta user and began referring every client, while the other was contacted through cold outreach on LinkedIn and offered $1,000 to take a call and use the product. Ivan described defining the ICP, finding people with networks of ICP users, sending personalized pitches with research and long Loom videos, offering 20%-30% lifetime commissions or upfront payments, and tracking affiliates with automated monthly payouts through Tolt. |
| **Pricing model** | Subscription SaaS with three plans: Pay You Go at $79 for 30 proposals plus $2 per extra proposal; Light at $300 for 250 proposals plus $1.50 per extra proposal; and an Unlimited plan initially offered at $500 per month. |
| **Customer count** | Depending on the coach, each brought between 5 and 10 or 20 new paying customers each month. |
| **Growth metrics** | Reached $10,000 MRR in the third or fourth month after launching; Two beta users collectively closed three five-figure clients within two weeks; Lancer generates between five and six figures for freelancers and agencies each month; Saves users over 10 hours a week; MB Masters did over seven figures and grew to almost 20 full-time employees; Around 200,000 jobs are posted on Upwork each month; Most growth came from two Upwork coaches; Affiliates receive 30% lifetime commission when they fully sign and onboard a client, or 20% for a referral |
| **Notable quotes** | We managed to get to $10,000 a month third or fourth month after launching.; This seems like a perfect case where an agent would outperform a human in this task by like 10 times or even more.; I delayed jumping into the what I call arena to optimize for income and financial security. |
| **Other notable facts** | Ivan is a builder from Macedonia.; Before launching Lancer, he ran the software development agency MB Masters for five years; Upwork was its main client acquisition channel.; Lancer was initially built as an internal agency tool over a weekend, then developed into an MVP over the next three months.; The agency version of the tool used text from the agency, with TypeScript on both frontend and backend using Next.js and Node.js, hosted on GCP and Firestore.; LLMs are used in Lancer for job qualification and proposal writing.; Lancer primarily targets agencies with high-volume proposal workflows rather than individual freelancers. |

### 62. Zero to $40K/Month With One Marketing Channel (No Social Media)

| Field | Value |
|---|---|
| **Published** | 2026-03-04 |
| **Business** | Late |
| **Description** | Social media API for developers and brands |
| **Category** | Developer Tool / API |
| **Vertical** | Creator & Social Media |
| **MRR (normalised)** | $40,000 |
| **MRR basis** | stated run-rate |
| **Website** | — |
| **Founder** | Mickey |
| **Type** | Social media API for developers and brands |
| **Revenue** | over $40,000 a month · monthly · MRR (as of 7 months after launch) — The founder also said the business crossed 40k MR, with more than 8K MR from organic revenue and around 15K MR from paid search. |
| **Revenue — amount** | over $40,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | 7 months after launch |
| **Revenue — notes** | The founder also said the business crossed 40k MR, with more than 8K MR from organic revenue and around 15K MR from paid search. |
| **Traffic / users** | 50K total signups since launch |
| **Engagement** | Turn rate is less than 10% |
| **Tech stack** | Cloud Code; Data Fast; Ahrefs; Google Ads; Google Search Console; PostHog; Google Sheets; Looker Studio; Facebook API; Instagram API; Twitter API; LinkedIn API |
| **Marketing channels** | Google SEO; Google Search Ads; link building |
| **Marketing tactics** | The founder focused on high-intent bottom-of-funnel keywords, including social media API and scheduling API for Twitter. He created content for both organic rankings and paid ads, built keyword-specific landing pages for ad groups, used automated bidding with a $120 target CPA, continuously A/B tested headlines, descriptions, and landing pages, and reinvested all revenue into scaling what worked. Link building was done through tools, manual outreach, and paying other people. |
| **Pricing model** | Users are charged for connected accounts, with three plans: a basic build plan, an accelerate plan for more accounts, and an unlimited plan. |
| **Customer count** | More than 700 paying users |
| **Growth metrics** | Reached over $40,000 MRR in 7 months; Went from zero to 30K MR in 7 months; 50K total signups since launch; More than 700 paying users; Turn rate is less than 10%; More than 8K MR in organic revenue; Monthly paid search revenue is around 15K MR; Spends around $8,000 a month on Google Ads; Gets $2.5 in revenue for every dollar spent; Target CPA is $120; Pushed 10 to 15 high-quality articles in the first week; Aims to rank for target keywords within 3 to 6 months; Founder previously built Academy in Spain, which has more than 100 employees |
| **Notable quotes** | We went from zero to 30K MR in just 7 months by focusing on Google search ads.; We focus 100% high in channels like SEO and go search ads because they have predictable unique economics and uh don't depend on lack or trends and we use data from both channels to optimize landing pages messaging and we reinvest all revenue into scaling what works.; My advice would be to just pick your single best level for growth, get obsessed with it, and measure it relentlessly. |
| **Other notable facts** | Late wraps the official Facebook, Instagram, Twitter, and LinkedIn APIs and provides access through a single API.; The founder said Late was profitable from day one.; The first clients started landing around August last year.; The product includes a UI for posts, account management, API keys, a unified inbox for DMs and comments, webhooks, publishing logs, and API documentation.; Before Late, the founder spent over 5 years experimenting with startups and previously raised venture capital for Academy.; The founder identified a gap in the market for a simple, affordable social media automation API with good developer documentation. |

### 63. I Make $15K/Month From One Website

| Field | Value |
|---|---|
| **Published** | 2026-03-01 |
| **Business** | DuckMath |
| **Description** | Unblocked games website |
| **Category** | Game |
| **Vertical** | Education & Learning |
| **MRR (normalised)** | $15,000 |
| **MRR basis** | Founder explicitly stated revenue of $15,000 per month, which is the current monthly run-rate. |
| **Website** | https://duckmath.org |
| **Founder** | Maddx Schmidtoffer |
| **Type** | Unblocked games website |
| **Revenue** | $15,000 per month · monthly · revenue (as of last four months) — AdSense earnings; founder also said he made $240 in one day and sold the business for $120,000. |
| **Revenue — amount** | $15,000 per month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | last four months |
| **Revenue — notes** | AdSense earnings; founder also said he made $240 in one day and sold the business for $120,000. |
| **Traffic / users** | About 1.5 million users a month; 150,000 daily active users; 4.6 million AdSense views; up to 7,000 Discord members. |
| **Engagement** | A/B testing was used to make people stay longer and click more pages. |
| **Tech stack** | Google Sites; React; AI tools; Cloudflare; Supabase; Google Analytics; PostHog; Google AdSense; Repurpose.io; Discord |
| **Marketing channels** | TikTok; Instagram Reels; YouTube Shorts; Snapchat |
| **Marketing tactics** | He posted three times a day, five days a week across three TikTok accounts, cross-posted the videos to Instagram Reels, YouTube Shorts, and Snapchat, researched and copied successful competitor formats, tested different hooks and calls to action, iterated based on engagement rates, and had a mentee produce videos following his format. |
| **Pricing model** | Free website supported by Google AdSense advertising. |
| **Customer count** | About 1.5 million users a month; 150,000 daily active users. |
| **Growth metrics** | Launched four years ago; Over the last four months, grew from 5 to 150,000 daily active users; Grew from about 1,000 users a month to 15,000 a month; A normal AdSense day was around 600 to 700; The top DuckMath TikTok video received 2.1 million views; The same video received 3.2 million views on Instagram; The video received five million views in total; The founder estimated the single video generated $1,000; Initially built the site in about one or two weeks; Sold the business a few weeks before the interview for $120,000; Received an initial $100,000 offer and countered it; Domains cost around $200 a month; Supabase cost $20; PostHog startup program provided $50,000 in credits; Next proje… |
| **Notable quotes** | I funnel people in from all my social media platforms and I get people to spend as much time as possible on the site because that's how Google pays me.; The main thing was just volume for me.; If all else fails, just stay consistent with your project, but make sure you know when to drop it. |
| **Other notable facts** | The initial site used Google Sites and embedded games hosted online.; He later rewrote the site in React after learning it during an internship.; The site's ads automatically generated revenue through Google AdSense.; He used three TikTok accounts and had a mentee produce videos.; The sale used escrow as a middleman to transfer the money.; After selling DuckMath, he began a cloud gaming platform for phone games. |

### 64. I Built a Niche App to $9K MRR

| Field | Value |
|---|---|
| **Published** | 2026-02-25 |
| **Business** | Chartbrew |
| **Description** | Open-source database visualization tool for developers with a paid hosted cloud version |
| **Category** | Developer Tool / API |
| **Vertical** | Data & Scraping |
| **MRR (normalised)** | $9,400 |
| **MRR basis** | The most recent monthly recurring revenue figure stated is almost 9,400 per month. |
| **Website** | — |
| **Founder** | Jonathan Fishner |
| **Type** | Open-source database visualization tool for developers with a paid hosted cloud version |
| **Revenue** | about 9,000 · monthly · MRR — The interview also states that revenue had passed almost 9400. |
| **Revenue — amount** | about 9,000 |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | — |
| **Revenue — notes** | The interview also states that revenue had passed almost 9400. |
| **Traffic / users** | 250,000 developers use the product |
| **Engagement** | — |
| **Tech stack** | React; React Vite; Node.js; Tailwind; React Flow; Claude Code; ChatGPT API; Resend; AWS; ChartMogul; Better Analytics; Framer; Stripe; Intercom; Ahrefs |
| **Marketing channels** | Hacker News; GitHub; Reddit; self-hosted subreddits; internal team sharing; SEO; content marketing; transactional email |
| **Marketing tactics** | Launched on Hacker News with a Show HN after three weeks of development, reached the front page, and brought thousands of engineers to the product on the same day. The team distributed where developers already were, including GitHub, Hacker News, Reddit, self-hosted subreddits, and internal teams sharing the tool. It used Ahrefs for SEO, keywords, and organic marketing. |
| **Pricing model** | Free open-source self-hosted version with paid cloud-hosted plans for team use, real-time collaboration, and usage-based subscription billing through Stripe |
| **Customer count** | — |
| **Growth metrics** | More than 21,000 GitHub stars; 250,000 developers use the product; Show HN brought thousands of engineers on the same day; Launched the open-source version 16 months ago; Three weeks of development before the Show HN launch; AWS hosting costs $600 per month; Claude Code costs up to $200 per month; A compliance account costs $500 per month; ChatGPT subscription costs $20 per month, with about $50 in API tokens; Better Analytics costs $25 per month; Framer costs $30 per month |
| **Notable quotes** | Monetization should not be a guess and should be response to your behavior.; You can start with one wedge and do one thing really well.; Everything started working when we double down on once we focus entirely on making database visualization obvious and ignore everything else. |
| **Other notable facts** | Jonathan Fishner is a developer and co-founder of Chartbrew.; The self-hosted product can be installed locally and used to visualize a database.; The hosted cloud version is where Chartbrew monetizes.; The original database-client idea incorporated AI but was abandoned because developers did not adopt it.; The cloud product has no sign-up requirement, sales calls, or credential requirement.; The product can query a database, import the resulting JSON, and visualize table relationships. |

### 65. I sold my company

| Field | Value |
|---|---|
| **Published** | 2026-02-23 |
| **Business** | Starter Story |
| **Description** | Media and storytelling business interviewing founders and sharing founder stories |
| **Category** | Creator / Content Business |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | — |
| **MRR basis** | Revenue and acquisition price were not disclosed, and no recurring or periodic revenue figure was stated. |
| **Website** | https://starterstory.com |
| **Domains mentioned** | starterstory.com |
| **Founder** | Pat Walls |
| **Type** | Media and storytelling business interviewing founders and sharing founder stories |
| **Revenue** | — |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Stripe |
| **Marketing channels** | — |
| **Marketing tactics** | Posting content, interviewing founders, and sending emails. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | Starter Story was acquired by HubSpot.; The founder had about $12,000 when he quit his job to build Starter Story.; Starter Story's early Stripe revenue grew from zero to a couple hundred bucks.; The founder first hired his sister and later hired additional team members.; The business operated for 8 years before the acquisition.; Thousands of founders were interviewed and millions of people watched the stories. |
| **Notable quotes** | Starter Story was acquired by HubSpot, a public company.; When I started the conversation with HubSpot, what mattered less was the numbers and more on alignment.; Not because of one big lucky break, but because you believed in yourself over a long enough number of days, months, and years for that to compound. |
| **Other notable facts** | The founder's first name and role are stated as Pat Walls working on starterstory.com.; The acquisition was agreed to keep the same team, mission, and focus on founder stories.; The founder previously worked as a developer at a small startup before quitting to build Starter Story.; The acquisition price was not disclosed.; The founder documented the sale and planned to cover the deal, building a sellable business, and negotiation lessons. |

### 66. How I Built a $12K/Month Micro-SaaS

| Field | Value |
|---|---|
| **Published** | 2026-02-11 |
| **Business** | Bulk Mockup |
| **Description** | Photoshop plugin for creating mockups |
| **Category** | Browser Extension / Add-on |
| **Vertical** | Design & Media |
| **MRR (normalised)** | $12,000 |
| **MRR basis** | The founder explicitly stated approximately $12,000-$13,000 per month in revenue and described the business as having $1 |
| **Website** | — |
| **Founder** | Vikash |
| **Type** | Photoshop plugin for creating mockups |
| **Revenue** | $12,000 a month · monthly · revenue (as of last year) — He said he was constantly hitting around $12,000-$13,000 a month; the interview also describes the business as having $12,000 MRR |
| **Revenue — amount** | $12,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | last year |
| **Revenue — notes** | He said he was constantly hitting around $12,000-$13,000 a month; the interview also describes the business as having $12,000 MRR |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | JavaScript; Photoshop; Komodo Decks; BoldDesk; Senja; Zoom; Adobe; Bormore; Notion; Cal.com; Gumroad |
| **Marketing channels** | YouTube; Google Search; communities; onboarding emails; customer support; YouTube comments |
| **Marketing tactics** | Uses a three-step content flywheel: collect customer pain, create content around it, and distribute it. Customer pain is harvested from four touch points: reading conversations in customer communities, onboarding emails, customer support calls, and YouTube comments. He creates YouTube videos that solve long-tail customer problems, optimizes each video for Google using on-page SEO, and keeps every video online as a long-term customer acquisition asset. |
| **Pricing model** | Monthly subscription for the Photoshop plugin; the initial version was sold as a one-time fee and later as a lifetime deal. |
| **Customer count** | — |
| **Growth metrics** | More than 100 five-star reviews; More than 1,500 recorded customer-support and tutorial videos over 3 years; 22% of YouTube channel views come from Google Search; One YouTube video with around 370 views in the past 4 months generated 3 customers and $45 MRR; Another YouTube video had 12,000 views in the last 6 months and generated $213 in the last 6 months; In the demo, 50 mockups took about 1 minute with Bulk Mockup versus around 30 to 40 minutes manually; The plugin reduces mockup creation from around 30 minutes to 1 hour down to 2 minutes |
| **Notable quotes** | My strategy is simple. I turn customer pain into content.; My videos do not get a lot of views, but they are solving a real pain a customer is having.; You do not need to get a viral video to be successful at marketing a product. A simple video that solves a customer pain is what you need. |
| **Other notable facts** | Vikash is from India.; He learned JavaScript in one day on Stack Overflow and built a Photoshop script overnight.; The internal freelance script completed 1,800 mockups in around 30 minutes instead of an expected three or four days.; A customer paid $300 for the script before Bulk Mockup was turned into a product.; He spent two straight months turning the script into a product with a UI/UX.; He previously worked on Upwork and freelancer.com doing Photoshop jobs. |

### 67. I Make $150K/Month From 20 Tiny Apps

| Field | Value |
|---|---|
| **Published** | 2026-02-08 |
| **Business** | Barn2 |
| **Description** | WordPress and WooCommerce plugin portfolio (19 WordPress plugins plus one Shopify app), sold as software products with… |
| **Category** | Portfolio of Products |
| **Vertical** | E-commerce & Retail |
| **MRR (normalised)** | $150,000 |
| **MRR basis** | Founder explicitly stated average monthly revenue is about $150,000 across all plugins. |
| **Website** | — |
| **Founder** | Katie Keith |
| **Type** | WordPress and WooCommerce plugin portfolio (19 WordPress plugins plus one Shopify app), sold as software products with subscriptions and lifetime deals |
| **Revenue** | $1.8 million a year (2025 revenue shown as just over $1.7 million); average monthly revenue about $150,000 across all plugins; $9.8 million lifetime WordPress plugin sales; lifetime deals ~15% of revenue · annual (as of 2025) — Other revenue streams include affiliate income and development services; higher in busy months like November, lower in quiet months like December |
| **Revenue — amount** | $1.8 million a year (2025 revenue shown as just over $1.7 million); average monthly revenue about $150,000 across all plugins; $9.8 million lifetime WordPress plugin sales; lifetime deals ~15% of revenue |
| **Revenue — period** | annual |
| **Revenue — metric** | revenue |
| **Revenue — as of** | 2025 |
| **Revenue — notes** | Other revenue streams include affiliate income and development services; higher in busy months like November, lower in quiet months like December |
| **Traffic / users** | Plugins used on over 90,000 sites; 17,000 paying customers on active subscription; tens of thousands of paying customers |
| **Engagement** | Not stated beyond 17,000 active subscription customers and 90,000+ sites using the premium plugins |
| **Tech stack** | ClickUp; GitHub; Zapier; WordPress; Easy Digital Downloads; WooCommerce |
| **Marketing channels** | organic search (SEO); blog posts and tutorials; email campaigns; cross-promotion between plugins; one-plugin and two-plugin bundles; settings-page banners; documentation cross-links; beta testing outreach to existing users |
| **Marketing tactics** | Most customers have always come from organic search; as a marketer she published blog posts and tutorials about how to password protect categories in WooCommerce and reached the top of Google, getting first sales within a few days; cross-promotion of closely related plugins with 50% off emails 3 days after purchase; separate Black Friday email campaigns segmented between prospects and existing customers; one-plugin and two-plugin bundles; banners on settings pages reminding customers of related complementary products; ideas sourced from the WooCommerce Ideas Forum and from customer feature re… |
| **Pricing model** | Plans of one site, five sites, or 20 sites, each with annual subscription or lifetime options |
| **Customer count** | 17,000 paying customers on an active subscription, plus additional lifetime-deal buyers; 90,000+ sites using the plugins |
| **Growth metrics** | 20 apps built over the past 10 years (19 WordPress plugins + 1 Shopify app); $1.8 million turnover a year; Average monthly revenue about $150,000; $9.8 million lifetime WordPress plugin sales; 90,000+ sites using plugins; 17,000 active subscription paying customers; Lifetime deals account for about 15% of revenue; First sales within a few days of launching the first plugin; Easy Digital Downloads costs about $300 a year |
| **Notable quotes** | Most of our customers have always come from organic search.; I would say, get a product out there and then keep your ears open to get those ideas from your users.; My advice would be to just do it. |
| **Other notable facts** | First plugin was WooCommerce Protected Categories, chosen from an idea on the WooCommerce Ideas Forum that many people voted for; Second plugin was Post Table Pro, built from a client project; Other named products include Document Library Pro and WooCommerce product table/options/protected areas plugins; Plugins are used on over 90,000 sites (premium), plus free versions of some plugins; She runs a remote team; If starting over in 2026 she would: focus on an area she knows, come up with several ideas and prioritize overlapping markets, launch one product first, then cross-promote each new product; Compliance/security sponsors segment referenced SOC 2 and ISO 27001 as enterprise blockers |

### 68. I Make $16K/Month... Even In A "Tiny" Niche

| Field | Value |
|---|---|
| **Published** | 2026-02-05 |
| **Business** | BlogToPin |
| **Description** | Pinterest marketing and automation SaaS |
| **Category** | SaaS / Web App |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | $16,000 |
| **MRR basis** | The founder stated MRR was a bit above 16K; the most recent current run-rate figure given is 16K monthly. |
| **Website** | — |
| **Founder** | Nick |
| **Type** | Pinterest marketing and automation SaaS |
| **Revenue** | a bit above 16k MR · monthly · MRR (as of today) — He also said he grew it to 16K MR over the last 2 years. |
| **Revenue — amount** | a bit above 16k MR |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | today |
| **Revenue — notes** | He also said he grew it to 16K MR over the last 2 years. |
| **Traffic / users** | 400, 300, 500 |
| **Engagement** | Churn is around 10%. |
| **Tech stack** | GitHub Copilot; Vercel; Hacker News; Oxylabs; Gemini; Fal.ai; Sequel; Stripe; Limitless |
| **Marketing channels** | word of mouth; affiliates; SEO; ChatGPT; other LLMs; Twitter; Reddit; email; YouTube; TikTok; Facebook |
| **Marketing tactics** | He created articles, reached out to influencers, posted on Reddit and other platforms, obtained backlinks, contacted potential users, recorded YouTube videos, tried different marketing angles, and focused on customer support and rapid feature implementation. |
| **Pricing model** | SaaS subscription with a starter plan around $39 per month, plus agency and enterprise plans; he initially launched with a lifetime deal. |
| **Customer count** | More than 400 active subscribers. |
| **Growth metrics** | Built the first version in 7 days; Rewrote most of the product and launched it in around 2 months; Idea originated in December 2023; Waited 10 days for the first paying customers after launch; Began getting first real customers within 1 month of switching to subscriptions; 400, 300, 500; Built a scrappy MVP in one or two weeks maximum |
| **Notable quotes** | I built a Pinterest automation tool which can create you Pinterest pins for your website.; My churn is around 10%.; For blocktoin, I chose this market because I felt the pain myself. |
| **Other notable facts** | More than 500 million active users are on Pinterest; Manually designing a Pinterest pin takes about 5 to 10 minutes; The tool can create a schedule for months in just a few minutes; Nick learned software engineering at 15 and got his first software engineering job after graduating from school; He created several apps that failed and generated zero revenue before starting an AI blog about cocktails; Selling the software in Europe required proper GDPR compliance |

### 69. I Made $500K From 8 Different Income Streams

| Field | Value |
|---|---|
| **Published** | 2026-02-01 |
| **Business** | Portfolio of online income streams (course, SaaS, ebook, YouTube channel, freelancing/consulting) targeting developers |
| **Description** | Portfolio of online projects and income streams |
| **Category** | Portfolio of Products |
| **Vertical** | Education & Learning |
| **MRR (normalised)** | — |
| **MRR basis** | The stated >$500,000 is cumulative revenue over the last 6 years across a portfolio of income sources, not a current mon |
| **Website** | — |
| **Founder** | Fim Pop |
| **Type** | Portfolio of online projects and income streams, including courses, SaaS, YouTube, ebooks, consulting, freelancing, and smaller products |
| **Products** | coding course; SaaS (sold for $50,000); ebook; YouTube channel; freelancing services; consulting services |
| **Revenue** | over $500,000 · over the last 6 years · total revenue — Combined revenue from a portfolio of income sources |
| **Revenue — amount** | over $500,000 |
| **Revenue — period** | over the last 6 years |
| **Revenue — metric** | total revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Combined revenue from a portfolio of income sources |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | NextJS; Supabase; Stripe; Vercel; Beehiiv; DFS; ChatGPT |
| **Marketing channels** | Twitter; YouTube; Reddit; TikTok; YouTube ads; sponsorships; email newsletter; Twitter ads; YouTube ads |
| **Marketing tactics** | Build something small and useful, ship it publicly where potential clients gather, gather feedback, add monetization early, then double down or move on. |
| **Pricing model** | Add a pay tier and validate whether people will pay; exact pricing was not stated. |
| **Customer count** | — |
| **Growth metrics** | over $500,000 combined from a portfolio of online projects over the last 6 years; course made over $180,000; first successful SaaS made $68,000 in revenue and was later sold for $50,000; YouTube generated over $100,000 from ads and sponsorships; freelancing brought in tens of thousands of dollars; ebook made over $30,000; consulting brought in another $14,000; smaller products added another $10 to $15,000 combined; learned to code during high school; worked as a full-time developer for 2 years; quit in 2019 to build online businesses; built 80 different income streams; coding course now brings in passive revenue |
| **Notable quotes** | Build your stuff, share it online, get feedback, monetize, and repeat.; Most projects don't fail because they're bad. They fail because nobody ever heard of them.; Stop comparing your level three with someone's level 20. |
| **Other notable facts** | The portfolio targets the developer niche across a course, ebook, SaaS, and learning platform.; Projects were built one at a time until each could sustain itself and require less day-to-day involvement.; His first successful SaaS was sold for $50,000.; The strategy emphasizes shipping, feedback, early monetization, and deciding whether to double down or move on.; AI tools are used to automate parts of building and operating a one-person business.; Over 14,000 fast-growing companies such as Ramp and Writer use Vanta for security compliance. |

### 70. How I Built It: $17K/Month Open Source SaaS

| Field | Value |
|---|---|
| **Published** | 2026-01-28 |
| **Business** | Posties |
| **Description** | Open-source social media scheduling SaaS |
| **Category** | SaaS / Web App |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | $17,000 |
| **MRR basis** | The founder explicitly states Posties is currently at $17K MRR, matching the stated revenue of $17K per month. |
| **Website** | — |
| **Founder** | Neo |
| **Type** | Open-source social media scheduling SaaS |
| **Revenue** | $17K per month · monthly · MRR — The transcript also states that Posties is currently at 17K MRR and has margins of around 80%. |
| **Revenue — amount** | $17K per month |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | — |
| **Revenue — notes** | The transcript also states that Posties is currently at 17K MRR and has margins of around 80%. |
| **Traffic / users** | Downloaded 5 million times; 3,830 trials since August 20, 2025; Hacker News posts can be expected to receive almost 10,000 views. |
| **Engagement** | Churn is 19%, which the founder is trying to reduce; trial-to-conversion rate is 21%. |
| **Tech stack** | Railway; Vercel; Semrush; Ahrefs; Resend; Cloudflare R2; Dub.co; PostHog; OpenAI; Google AI; Transcript; WebStorm; Beehiiv; Discord; GitHub Copilot; Sentry; GitHub Actions; Docker |
| **Tech stack — removed** (not found in transcript) | Next.js; Outrank; Coze |
| **Marketing channels** | Hacker News; Reddit; Lemy; DEV.to; Medium; HackerNoon; X; LinkedIn; Newsletter; GitHub; Discord; SEO; Product directories |
| **Marketing tactics** | Treat GitHub as the landing page, choose an open-source license, create feature issues for contributors, provide self-hosting documentation and a Docker setup, register accounts before launch, publish launch articles, submit the GitHub repository to Hacker News, post releases to r/selfhosted and other relevant subreddits, ask for GitHub stars, cross-post, and send traffic from existing channels to GitHub during the same week. |
| **Pricing model** | SaaS subscriptions with Standard, Team, Pro, and Ultimate packages; tiers provide different numbers of channels and features. The open-source and cloud offerings are otherwise the same. |
| **Customer count** | 472 subscribers |
| **Growth metrics** | $17K MRR; 5 million downloads; 472 subscribers; 19% churn; 3,830 trials since August 20, 2025; 21% trial-to-conversion rate; Around 80% margins; The founder's previous open-source infrastructure company grew from zero to 32,000 stars while he worked there for 2 years; Approximately 10,000 expected views from a Hacker News main-feed placement |
| **Notable quotes** | Open source is a great way to introduce your project to a million of developers.; There is no way that you are the brand.; You should focus your time half of the time learning, half of the time creating something and learning is the biggest power. |
| **Other notable facts** | Posties supports 25 social media platforms.; The open-source version can be self-hosted and includes documentation for doing so.; The product includes AI image and video generation, a public API, and editing for individual social platforms.; The founder said developers using Posties create user-generated content, contribute feedback and features, and write SEO articles and reviews.; The founder identifies self-hosted enterprise support as a major potential revenue opportunity.; The founder previously spent around a year doing niche open-source consulting. |

### 71. How I Used Reddit to Build a $34K/Month SaaS

| Field | Value |
|---|---|
| **Published** | 2026-01-25 |
| **Business** | Goji Berry AI |
| **Description** | SaaS; intent-based LinkedIn outreach tool |
| **Category** | SaaS / Web App |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | $30,000 |
| **MRR basis** | The founder stated approximately $30K MR, with the dashboard described as showing 24K MR (around $30K). Using the stated |
| **Website** | — |
| **Founder** | Roman |
| **Type** | SaaS; intent-based LinkedIn outreach tool |
| **Revenue** | about 30k MR · monthly (as of four months after zero revenue) — The dashboard was described as showing 24K MR, around $30K; another post stated the business was built in 5 months. |
| **Revenue — amount** | about 30k MR |
| **Revenue — period** | monthly |
| **Revenue — metric** | MR |
| **Revenue — as of** | four months after zero revenue |
| **Revenue — notes** | The dashboard was described as showing 24K MR, around $30K; another post stated the business was built in 5 months. |
| **Traffic / users** | More than 40,000 visitors on the website; 11 million Reddit impressions; one LinkedIn post generated 160K views and about 2,000 visitors; one Y Combinator post generated more than 179,000 views |
| **Engagement** | One Reddit post received 543 upvotes; every Reddit comment was replied to to provide traction, show engagement, obtain more upvotes, and rank higher |
| **Tech stack** | Instantly AI; Goji Berry AI; Calendly; Framer; ChatGPT; Nano Banana; Sales Navigator; LinkedIn |
| **Tech stack — removed** (not found in transcript) | Outrank |
| **Marketing channels** | Reddit; cold email; SEO; YouTube; Twitter; affiliate marketing |
| **Marketing tactics** | Use Reddit stories and proof, vary the angle of each post, direct people to a YouTube video or Twitter post, obtain early upvotes and comments from a 15-marketer group, reply to every comment, and avoid putting the SaaS directly in posts. He also told his stories to ChatGPT by voice and had it translate and correct the post. He created a playbook for getting the first 100 users on Reddit. |
| **Pricing model** | Three subscription types; most users are on the $99 plan, which includes unlimited high-intent leads and direct connection through the platform |
| **Customer count** | About 100 first customers; one LinkedIn post produced 10 or 15 clients, and one Y Combinator post produced maybe 15 clients |
| **Growth metrics** | Launched Goji Berry AI four months after having zero revenue; 11 million Reddit impressions in a few months; More than 40,000 website visitors from Reddit; One post generated 160K views, 543 upvotes, and about 2,000 visitors; One post generated more than 179,000 views and maybe 15 clients; Roman previously launched Coco AI in 2023 and scaled it to 50K MR before selling it to a US venture; Reddit is used to acquire the first 10 or 100 customers; Built the business in 5 months |
| **Notable quotes** | I think we cracked the Reddit distribution.; You can turn any event happening in your life into a Reddit post.; The more your leads see you, the more you are likely to close them during a call. |
| **Other notable facts** | Goji Berry AI finds high-intent LinkedIn leads based on signals such as liking specific posts, interacting with competitors, fundraising, and hiring.; It automates LinkedIn outreach by connecting with leads and sending AI-personalized messages.; Roman said its acceptance rate and reply rate are above industry because of lead quality and tailored messaging.; Roman was formerly a mechanical engineer and learned affiliate marketing before freelancing.; Marketing-tool costs stated were about $800 per month for Instantly AI, $99 for Outrank, $99 for Goji Berry AI, $20 for Calendly, $49 for Framer, $40 for ChatGPT plus Nano Banana, and $100 for Sales Navigator.; The Reddit playbook recommends a fresh account, profile setup, 7 to 14 days of warming up through comments and upvotes, and at least 1… |

### 72. How I Built a $13K/Month SaaS

| Field | Value |
|---|---|
| **Published** | 2026-01-21 |
| **Business** | LFS |
| **Description** | Native Mac AI assistant and knowledge-base app |
| **Category** | AI Wrapper |
| **Vertical** | AI & Automation (horizontal) |
| **MRR (normalised)** | $15,000 |
| **MRR basis** | $150K annual revenue divided by 12 equals $15K per month; the recent $12K per month figure is lower, so use the more cur |
| **Website** | — |
| **Founder** | Aayush |
| **Type** | Native Mac AI assistant and knowledge-base app |
| **Revenue** | $150K per year · annual · revenue (as of over the last 3 years) — The product also reached around $12K per month and $110K from Gumroad this year. |
| **Revenue — amount** | $150K per year |
| **Revenue — period** | annual |
| **Revenue — metric** | revenue |
| **Revenue — as of** | over the last 3 years |
| **Revenue — notes** | The product also reached around $12K per month and $110K from Gumroad this year. |
| **Traffic / users** | Around 180k website visits per year |
| **Engagement** | Thousands of people use the primary Super Brain feature to index documents, chat with them, and create content; the Super Brain feature received positive feedback and feature requests. |
| **Tech stack** | Swift; Claude Code; Ahrefs; Neuron Writer; Map of Reddit; Nitn; ClickUp; Discord; MailerLite; Plausible; Google Search Console; Gumroad; Setapp; Mac App Store; iOS App Store; OpenAI; YouTube; Apple Notes; offline open source models |
| **Tech stack — removed** (not found in transcript) | Superblock |
| **Marketing channels** | Reddit; SEO; Google; ChatGPT; Claude; AI answer engines; email marketing; Discord |
| **Marketing tactics** | Posted product demos and asked for feedback in niche subreddits, targeted one subreddit per day, added UTM links to track individual features, dates, and subreddits, and iteratively tweaked post copy. The company also published support articles, researched low-competition high-demand keywords, wrote listicles and SEO articles, and used AI as a research assistant for content outlines. |
| **Pricing model** | Subscriptions with monthly and annual plans, plus lifetime deals and one-time payments |
| **Customer count** | Thousands of people use the Super Brain feature |
| **Growth metrics** | Grew from 0 to $150K per year over the last 3 years; Went from 0 to $3,000 in MRR within 6 months using Reddit; Generated around $70,000 from Google during a 12-month period in 2023; Reached around $12,000 per month; Gumroad revenue was around 110K this year; Mac App Store revenue was around 12,000; Standard Reddit posts received 30, 40, or 50 upvotes, while some viral posts received 300 or 400 upvotes; Combined founder experience included more than 30 failed projects |
| **Notable quotes** | We essentially use Reddit to go from 0 to $3,000 in MR within a within a period of 6 months.; As long as you can add net new information to the internet, you will win with SEO.; Put more buy buttons on the internet. |
| **Other notable facts** | The product indexes local files such as PDFs and Apple Notes and creates personal knowledge bases called Super Brains.; LFS has an offline version using downloadable open source models.; Revenue comes from its own website, Setapp, the Mac App Store, and the iOS App Store.; Gumroad is used to sell licenses.; The company is a two-person team: Aayush handles marketing and his business partner handles development.; The founders have been together for more than 30 combined failed projects before LFS. |

### 73. I Built a $20K/Month Mobile App: Here’s My Entire Playbook

| Field | Value |
|---|---|
| **Published** | 2026-01-18 |
| **Business** | Prayer Lock |
| **Description** | Christian mobile app that blocks selected phone apps until the user prays and recites an AI-generated prayer |
| **Category** | Mobile App |
| **Vertical** | Personal & Relationships |
| **MRR (normalised)** | $21,000 |
| **MRR basis** | The most recent stated monthly sales figure was $21,000, so this is the current monthly run-rate. |
| **Website** | — |
| **Founder** | Mal Baron |
| **Type** | Christian mobile app that blocks selected phone apps until the user prays and recites an AI-generated prayer |
| **Revenue** | $21,000 in sales · monthly (as of December) — A previous month was $15K and October was $10K; total proceeds were stated as $41,000 |
| **Revenue — amount** | $21,000 in sales |
| **Revenue — period** | monthly |
| **Revenue — metric** | sales |
| **Revenue — as of** | December |
| **Revenue — notes** | A previous month was $15K and October was $10K; total proceeds were stated as $41,000 |
| **Traffic / users** | Close to 58,000 downloads; approximately 10K views per day from one account and consistent 10K views per video from a UGC creator |
| **Engagement** | Review rate over 12%; 6.7K ratings; 4.9-star rating on the App Store |
| **Tech stack** | Cursor; Claude Sonnet; ChatGPT; Codex CLI; Canva; AWS; Google Gemini Flash 2.5; Superwall; Singular |
| **Tech stack — removed** (not found in transcript) | PosterMyWall |
| **Marketing channels** | TikTok; Instagram; Meta Ads; TikTok Spark Ads; UGC creator videos |
| **Marketing tactics** | Posted around 40 times a day across 12 accounts, tested multiple formats, and scaled a UGC girl-reaction demo format that worked. The founder and a UGC creator ran TikTok and Instagram accounts, then used paid ads on organic videos. A broad TikTok campaign targeted the US with no audience controls and existing UGC videos; ad spend was then increased regularly each week. Meta ads initially optimized for downloads rather than trials. Onboarding was expanded from 5 minutes to 15 minutes, and organic conversion more than tripled without paid ads. |
| **Pricing model** | Subscription: $49.99 a year or $9.99 a week |
| **Customer count** | First few hundred paying users; approximately 2 to 300 downloads per day at one point |
| **Growth metrics** | Built in 3 days; Approved on the App Store in over a week; Launched 6 months before the interview; 43% conversion rate; Over 50% monthly growth; $23.6 proceeds per paying user; Number 22 in the App Store reference category in November; Download-to-trial conversion target of at least 10%; Approximately 1.5K in July and 2.4K in August; Closed October at $10K; Closed November at $15K; Closed December at $20K; Expected to close January at $40K a month; 14 days to get a UGC creator's video to approximately 20K views; Cost per trial started of $4 on TikTok ads, then $3 using Spark Ads; Current cost per trial of $1.88; $360 per day in paid ad spend; Approximately $9K spent on ads in December; Onbo… |
| **Notable quotes** | It took me 3 days to code the app with AI.; Volume really matters here.; Step four, do not touch your app. Obsess over distribution. |
| **Other notable facts** | Mal Baron majored in finance and said he taught himself AI and coding.; He discovered the original Codex model in 2022.; He launched Prayer Lock in June after spending about 3 months building apps nobody wanted.; The app has no authentication or database and stores information on the device.; His former girlfriend, now wife, helped record the UGC reaction videos.; The app generates a prayer based on two questions about the user's relationship with God and how they are feeling. |

### 74. I built a $14K/month SaaS using Discord

| Field | Value |
|---|---|
| **Published** | 2026-01-14 |
| **Business** | Algrow |
| **Description** | SaaS for creators to research and replicate viral formats and generate videos |
| **Category** | AI Wrapper |
| **Vertical** | Creator & Social Media |
| **MRR (normalised)** | $14,000 |
| **MRR basis** | The founder stated over $14,000 in revenue in the last 30 days, so the current monthly run-rate is approximately $14,000 |
| **Website** | — |
| **Founder** | Sam |
| **Type** | SaaS for creators to research and replicate viral formats and generate videos |
| **Revenue** | over $14,000 in revenue in the last 30 days · last 30 days — The Stripe dashboard showed over £10,000 in revenue for the last four weeks, which the founder said converts to around $13,000 to $14,000. |
| **Revenue — amount** | over $14,000 in revenue in the last 30 days |
| **Revenue — period** | last 30 days |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The Stripe dashboard showed over £10,000 in revenue for the last four weeks, which the founder said converts to around $13,000 to $14,000. |
| **Traffic / users** | over 10,000 users |
| **Engagement** | — |
| **Tech stack** | Cursor; Visual Studio Code; Heroku; Nano Banana; Sora 2; Gemini; Mailorite; Loom; Chatbutt; Stripe |
| **Marketing channels** | Discord; discboard.org; email; YouTube |
| **Marketing tactics** | Sam found niche Discord communities through discboard.org, joined servers, shared his screen without speaking to demonstrate the tool, helped members find channels, posted waitlist signup links, and later gave early users free access so they could demonstrate the product to paying friends. |
| **Pricing model** | Three monthly plans: $25, $45, and $80 |
| **Customer count** | exactly 480 new customers this month |
| **Growth metrics** | first coded the SaaS about six or seven months ago; got the first 400 users through Discord; went from zero to over 10,000 users in six months; built the initial MVP in about a week; hosting costs about $100 a month; AI image generation costs around $100 a month |
| **Notable quotes** | I got my first 400 users all on Discord.; As long as what you're trying to solve works I think you can ship anything.; Discord is 10 times better in terms of building a relationship with your users. |
| **Other notable facts** | Sam said he had zero coding background and initially copied code into Notepad before moving to VS Code.; The first shipped version was hosted on Heroku and had bugs and an application error.; Algrow initially targeted faceless YouTubers and later attracted influencers and dropshippers.; The product analyzes subscriber counts and average views per video and provides trending formats in real time.; AI video generation uses models such as Sora 2 and costs around $200 a month.; Mailorite email marketing costs around $80 a month, while other AI compute costs around $300 to $500 a month. |

### 75. How My App Hit $60K/Month in 2 Months

| Field | Value |
|---|---|
| **Published** | 2026-01-11 |
| **Business** | Cleo |
| **Description** | B2B SaaS — AI-powered LinkedIn ghostwriter / personal brand content tool |
| **Category** | AI Wrapper |
| **Vertical** | Creator & Social Media |
| **MRR (normalised)** | $62,000 |
| **MRR basis** | The most recent stated current run-rate is the dashboard showing $62K MRR. |
| **Website** | — |
| **Founder** | Lara Acosta (co-founders: Lara Acosta, Jake, Rob) |
| **Type** | B2B SaaS — AI-powered LinkedIn ghostwriter / personal brand content tool |
| **Revenue** | $30,000 in 4 days; later $60,000 a month in less than 2 months; dashboard shown at 62K MRR · one-off launch period then monthly (as of launched October 2025; dashboard shown with spike from October 1st) — 0 to $30,000 MRR in first month/first 4 days; went from 0 to $60,000 a month in less than 2 months |
| **Revenue — amount** | $30,000 in 4 days; later $60,000 a month in less than 2 months; dashboard shown at 62K MRR |
| **Revenue — period** | one-off launch period then monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | launched October 2025; dashboard shown with spike from October 1st |
| **Revenue — notes** | 0 to $30,000 MRR in first month/first 4 days; went from 0 to $60,000 a month in less than 2 months |
| **Traffic / users** | over 932 active subscriptions, over 1,000 in total subscriptions; waitlist of thousands of people |
| **Engagement** | kept in touch closely with every customer; co-founder Rob gave his personal number to every user; VIP white-glove onboarding calls to ensure customers use the product correctly so they 'stay on for longer' |
| **Tech stack** | Claude; Claude Code; Next.js; TypeScript; Vercel; Vercel chats; Clerk (authentication); Slack; Loops (emails); Calendly; Poyla (monetization); Poyla native landing page; Google Docs; Loom; Zoom; LinkedIn Live; Polar (dashboard shown) |
| **Marketing channels** | LinkedIn; LinkedIn Live; Zoom webinars; Email (Loops); Waitlist (landing page); Lead magnets (free Google Docs/Loom in exchange for email signup) |
| **Marketing tactics** | Used 'the Cleo launch playbook' of three parts: content, waitlist, and webinars. Waitlist-only mini/beta launches with scarcity and FOMO; 'edu-selling' LinkedIn posts with no CTA that educate first and soft-sell at the end; 4 weeks of list warming with 10+ pre-launch emails addressing objections (how is this better than ChatGPT or Claude); launch email 'Cleo 2.0 is live. Try it now.' with the link in the first line; scarcity offer of only 500 spots; 50% off for a lifetime if buying now; three-part webinar format (20 min education, 20 min demo, pitch with link); direct calls/DMs to customers f… |
| **Pricing model** | Subscription with lifetime discount — 50% off for a lifetime for early buyers; scarcity of only 500 spots |
| **Customer count** | over 932 active subscriptions, over 1,000 total subscriptions |
| **Growth metrics** | 0 to $30,000 MRR in 4 days (first launch); 0 to $60,000 a month in less than 2 months; 62K MRR shown on dashboard; over 932 active subscriptions, over 1,000 in total; launched October 2025; 10+ emails sent before the launch drop; 4 weeks of list warming before launch; two launch spikes (original waitlist launch and relaunch); 500 spots offered at launch; 50% off lifetime discount; 4321 content framework: 4 posts a week, 3 content pillars, 2 personas (ICP and IFP), 1 lead magnet; 6-step launch playbook shared; clients reported hitting 50K, 60K, and 70K following the same playbook |
| **Notable quotes** | We literally launched it in October of 2025, and we've gone from 0 to $60,000 a month in less than 2 months.; The emails that I was showing were literally the reason why we were able to get to 30K MRR, and then 60K MRR. It wasn't just viral content, it was emails.; We told people we only have 500 spots available, which made people want to take action faster. |
| **Other notable facts** | Cleo is an AI ghostwriter that 'thinks like you and writes like you', creating LinkedIn content for founders trying to grow on LinkedIn; Lara started posting on LinkedIn around 3 years ago and built two businesses off the back of it; Co-founder Rob gives his personal number to every user for support; Co-founder Jake coined the 'edu-selling' approach; posts were published under another account called 'The LinkedIn Creator'; No one could buy the product publicly — the landing page requires joining a waitlist; not yet launched to the public; Lara's background is in agency and info product businesses; co-founder Jake was in a similar situation; Onboarding calls were recorded to spot patterns in thinking, problems, bugs and issues to fix them immediately |

### 76. How I Grew My App to $13K/month (Even Though I Hate Marketing)

| Field | Value |
|---|---|
| **Published** | 2026-01-07 |
| **Business** | SiteGPT |
| **Description** | SaaS product that creates AI chatbots for websites |
| **Category** | AI Wrapper |
| **Vertical** | AI & Automation (horizontal) |
| **MRR (normalised)** | $13,000 |
| **MRR basis** | The founder explicitly stated $13,000 MRR; the $500,000 cumulative revenue since March 2023 is a lifetime total and does |
| **Website** | — |
| **Founder** | Banu |
| **Type** | SaaS product that creates AI chatbots for websites |
| **Revenue** | $13,000 MRR · monthly (as of 2026) — Banu also said SiteGPT had made around $500,000 in revenue since launching in March 2023. |
| **Revenue — amount** | $13,000 MRR |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | 2026 |
| **Revenue — notes** | Banu also said SiteGPT had made around $500,000 in revenue since launching in March 2023. |
| **Traffic / users** | More than 1 million website visitors since launch; around 50,000 visitors per month; around 50,000 clicks from Google per month |
| **Engagement** | Customer lifetime value of around $1,700 to $1,800 |
| **Tech stack** | Ahrefs; SiteGPT; Cal.com; DataFor; PostHog; Sibyl AI; Bento; Feather; Featurebase; Mintlify; Cloud Code; ChartMogul; Cursor; Notion |
| **Marketing channels** | Google; SEO; Free tools marketing; Engineering as marketing |
| **Marketing tactics** | Built almost 50 free tools targeting low-keyword-difficulty, high-volume search queries, used calls to action to direct users to SiteGPT, and prioritized tools by search volume, keyword difficulty, build effort, and product relevance. |
| **Pricing model** | Monthly subscription based on the number of chatbots, amount of content, or expected monthly messages |
| **Customer count** | Around 130 businesses |
| **Growth metrics** | Launched SiteGPT in March 2023; Built almost 50 free tools; Around 50,000 visitors per month; Around 200 monthly leads; Around 60 monthly trials; 25 to 40% of trials become customers; Around 100 average revenue per customer; Around 130 businesses; Reached $13,000 MRR; Around $500,000 in revenue since launch; Customer lifetime value of around $1,700 to $1,800; 60 to 70% of traffic comes from Google; Almost 90% of Google traffic comes from the free tools; Feather grew to $6,000 MRR and sold for $250,000; SiteGPT reached around $10,000 MRR within its first month; Took two weeks from idea to launch; Nearly 1 million website visits attributed to the strategy; A new free tool takes less than 5 mi… |
| **Notable quotes** | I'm a builder, I'm not a marketer.; The best way for me to learn is to build something with it.; I would not spend months and months on launching something. |
| **Other notable facts** | Banu was previously a software engineer and quit his job to build products independently.; He moved back to his parents' home to eliminate expenses while building.; Feather, his previous SaaS product, had 100 customers when he used them to inspire the initial SiteGPT idea.; The first version of SiteGPT was inspired by building a chatbot that could answer questions from Feather customers' blogs.; SiteGPT launched with a core feature after two weeks of work.; SiteGPT's free tools include PDF-to-markdown conversion and chatbot-name generators. |

### 77. How I built my first SaaS without an audience ($25K/month)

| Field | Value |
|---|---|
| **Published** | 2026-01-04 |
| **Business** | Launch Fast |
| **Description** | AI-powered Amazon product research SaaS for private label sellers |
| **Category** | AI Wrapper |
| **Vertical** | E-commerce & Retail |
| **MRR (normalised)** | $21,800 |
| **MRR basis** | The founder stated current revenue of about $21.8K per month as MRR. The $10,000 monthly figure was pure profit, not rev |
| **Website** | — |
| **Founder** | Hassam |
| **Type** | AI-powered Amazon product research SaaS for private label sellers |
| **Revenue** | about 21.8K · monthly · MRR (as of 90 days after launch) — Reached over $20,000 a month after 90 days; the interviewer later said he was making $10,000 a month pure profit |
| **Revenue — amount** | about 21.8K |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | 90 days after launch |
| **Revenue — notes** | Reached over $20,000 a month after 90 days; the interviewer later said he was making $10,000 a month pure profit |
| **Traffic / users** | 330 active users on the official Chrome extension |
| **Engagement** | — |
| **Tech stack** | Cursor; Vercel; Supabase; Supabase MCP; Resend; Apify; TypeScript; Next.js; Chrome extension |
| **Marketing channels** | Legacy X coaching company; Twitter; Reddit; Facebook groups; review sites; influencer groups |
| **Marketing tactics** | Partnered with Legacy X, a coaching company with an existing audience of thousands of active Amazon sellers, in exchange for equity to gain immediate distribution. Hassam proposed building a better product research tool in 48 hours, recorded a demo, and sent it to Legacy X. He also recommends identifying five potential distribution partners and reaching out to three by the end of the week, shipping at least one improvement daily for 30 days after launch, and getting a build in front of at least 10 people for feedback. |
| **Pricing model** | $50 a month for Legacy X coaching customers and $1.99 per month for the general public |
| **Customer count** | All users are paying; the Chrome extension has 330 active users |
| **Growth metrics** | Built the app in 48 hours; About 10K MRR around day 30; Around 17 to 18K MRR around day 60; About 21.8K MRR at 90 days; Legacy X had thousands of active Amazon sellers; Built about 10 to 12 projects across different spaces; Business started in 2025; Traded equity, possibly 50%, for distribution; Cursor Max subscription costs $200 |
| **Notable quotes** | Zero audience means zero distribution.; Even if it's at 50%, I would say 50% of 20K MR is better than 50% of zero MR.; Just ship and keep shipping. |
| **Other notable facts** | Hassam turned his Amazon business into Launch Fast.; He had a non-technical background and was working a corporate job while running two Amazon brands on the side.; He previously bought the Legacy X coaching program two years before building the tool.; The first four hours were spent mapping Legacy X's existing systems, SOPs, data, and workflows before building the MVP foundation.; The build schedule used Cursor for hours 5 to 12, testing and iteration for hours 13 to 20, UI and branding for hours 21 to 30, and edge-case testing for hours 31 to 40.; The company had about 10 to 12 active users on the official Chrome extension. |

### 78. How I Used Twitter to Hit $10K/Month

| Field | Value |
|---|---|
| **Published** | 2025-12-28 |
| **Business** | SuperX |
| **Description** | SaaS platform that helps users grow on X |
| **Category** | SaaS / Web App |
| **Vertical** | Creator & Social Media |
| **MRR (normalised)** | $13,000 |
| **MRR basis** | The most recent stated figure is over $13,000 a month, explicitly described as monthly recurring revenue and growing. |
| **Website** | — |
| **Founder** | Rob Palam |
| **Type** | SaaS platform that helps users grow on X |
| **Revenue** | $13,000 a month · monthly · monthly recurring revenue — The host earlier described the business as going from 0 to $12,000 a month; Rob later said the figure was over $13,000 and growing 25% month over month. |
| **Revenue — amount** | $13,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | monthly recurring revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The host earlier described the business as going from 0 to $12,000 a month; Rob later said the figure was over $13,000 and growing 25% month over month. |
| **Traffic / users** | 95% of traffic comes from X; Rob maintains about 100,000 impressions a day |
| **Engagement** | Trial rate is around 30%; churn is close to about 30%; about 60 active trials |
| **Tech stack** | Next.js; Node.js; Tailwind; SQLite; X API; OpenAI API; Anthropic Claude API; AWS; Zillas Cloud; Claude Code; Screen Studio; Framer; Stripe; Lemon Squeezy; PostHog; SuperX Chrome extension |
| **Marketing channels** | X; X direct messages; videos; authentic personal stories; product launch posts; feature-release content |
| **Marketing tactics** | Built the business in public by consistently sharing wins, failures, vulnerabilities, and personal stories on X; used AI data and analytics to identify viral content; posted systematically with intent; doubled down on formats that worked, killed content that did not, and used SuperX to grow SuperX. |
| **Pricing model** | $29 a month subscriptions |
| **Customer count** | About $450 active subscribers |
| **Growth metrics** | Launched publicly four months ago; Grew from 1,000 to over $13,000 in monthly recurring revenue; Growing at 25% month over month; Grew from zero to over 34,000 X followers in just over a year; 95% of traffic and most users came from X; About 100,000 impressions a day; Around 30% trial rate; About 60 active trials; Churn close to about 30%; Built and launched five products over two and a half years that made a total of $0; A viral failure-sharing post received about 150,000 views; Received a first $3,000 client from the initial viral post; Closed the development agency and began building SuperX in January 2025; A January 2025 vlogging post received over one million views; Launched SuperX in… |
| **Notable quotes** | I built the entire business on X itself, using SuperX to grow SuperX.; You need consistency, a story line, and a system.; Unlike what I thought was the case, it isn't about luck. |
| **Other notable facts** | SuperX shows which posts went viral, explains why they worked, and helps users create versions of those posts.; Rob partnered with Tibo, the former co-founder of Tweet Hunter, to build SuperX.; Tibo had acquired the SuperX Chrome extension, and Rob built the SuperX web app around his ideas.; SuperX includes daily AI-generated inspiration, profile and tweet analytics, content scheduling, and a reply-management feature called SuperX Engage.; The company recently migrated from Stripe to Lemon Squeezy.; Rob began his X journey in early 2023 after being laid off from his first software-engineering employer. |

### 79. How We Grew Our App to $30K/Month

| Field | Value |
|---|---|
| **Published** | 2025-12-20 |
| **Business** | Push School |
| **Description** | Consumer mobile app that requires users to exercise before unlocking blocked social media apps |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $30,000 |
| **MRR basis** | The founder stated revenue was over $30,000 per month, so the current MRR is conservatively recorded as $30,000. |
| **Website** | — |
| **Founder** | Alejandro and Mario |
| **Type** | Consumer mobile app that requires users to exercise before unlocking blocked social media apps |
| **Revenue** | over $30,000 a month · monthly · revenue (as of 4 months after launch) — All revenue initially came from organic content; the founders later scaled with ads. |
| **Revenue — amount** | over $30,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | 4 months after launch |
| **Revenue — notes** | All revenue initially came from organic content; the founders later scaled with ads. |
| **Traffic / users** | around 300,000 downloads across App Store and Play Store; one video got 80K views; one video got 6 million views |
| **Engagement** | — |
| **Tech stack** | Compose Multiplatform; Supabase; Supabase Auth; Supabase Storage; Supabase Database; Amplitude; Sentry; ThoroCode Max; Discord |
| **Tech stack — removed** (not found in transcript) | Firebase Crashlytics |
| **Marketing channels** | TikTok; YouTube; Discord; paid ads; influencer collaborations |
| **Marketing tactics** | They validated the app idea with a fake-footage TikTok video before building the product, then built the MVP, launched it with another TikTok video, offered the app free to users who downloaded within the first week, posted daily organic videos, tested different formats, and later scaled through paid ads and influencer collaborations. |
| **Pricing model** | Hard paywall; approximately $30 a year for everyone after the free launch period |
| **Customer count** | around 4,000 paying customers |
| **Growth metrics** | Launched 4 months ago; around 300,000 downloads across App Store and Play Store; around 20k to 30k downloads from the launch TikTok video; one validation video got 80K views; 500 comments begging the founders to build the app; built the MVP in around 2 weeks; MVP had three screens; one video got 6 million views and converted to around 10K MR; approximately $30 a year |
| **Notable quotes** | We first did the video, it went viral and then we built the app.; All revenue at the beginning came from organic content.; Build your consumer product with distribution in mind first and foremost. |
| **Other notable facts** | Alejandro was a software engineer who quit without a plan to do something against doom scrolling.; Alejandro previously built a side project that reached 5 million downloads.; After a week of daily uploads, one of Alejandro's videos blew up and led to the Push School idea.; The app uses push-ups, squats, or planks before social media can be accessed.; Every push-up gives one minute of screen time.; The founders met through a YC co-founder match. |

### 80. My mobile app made $800K in 365 days

| Field | Value |
|---|---|
| **Published** | 2025-12-17 |
| **Business** | Glow Up |
| **Description** | AI-powered makeup try-on mobile app |
| **Category** | Mobile App |
| **Vertical** | Design & Media |
| **MRR (normalised)** | $15,000 |
| **MRR basis** | The founder stated revenue of around 15K per month, which is a monthly run-rate and therefore directly represents MRR. |
| **Website** | — |
| **Founder** | Louis |
| **Type** | AI-powered makeup try-on mobile app |
| **Revenue** | around 15K per month · monthly · monthly revenue (as of right now) — The app generated a total of 800K in revenue in its first year. |
| **Revenue — amount** | around 15K per month |
| **Revenue — period** | monthly |
| **Revenue — metric** | monthly revenue |
| **Revenue — as of** | right now |
| **Revenue — notes** | The app generated a total of 800K in revenue in its first year. |
| **Traffic / users** | The app has around 2 million users and reached 100K users in around 3 days. |
| **Engagement** | A TikTok video received close to 48 million views, 2 million likes, and 60K downloads in one day. |
| **Tech stack** | Flutterflow; Flutter; Firebase; Google Cloud Functions; Superwall; Mixpanel |
| **Marketing channels** | TikTok; TikTok anchor links; UGC; influencers; faceless content |
| **Marketing tactics** | Louis studied TikTok makeup videos, hashtags, and comment sections to identify demand, created content before building the app, replicated trends that performed well, added an anchor link to videos that had already gained views, and posted across multiple accounts. At peak, around seven accounts posted 8 to 12 times per day. The app offered a free makeup look for inviting three friends, encouraging users to share codes and re-engage with viral posts. |
| **Pricing model** | Subscription: $9.99 per week or $39.99 per year for unlimited AI makeup looks. |
| **Customer count** | Around 70,000 paying customers. |
| **Growth metrics** | Grew from zero to 100K users in around 3 days; Generated 800K in total revenue in one year; Made around 12.5K in sales in one day from one video; Generated 60K downloads in one day from one video; Reached number one in lifestyle in the app store; Reached number four in the free mobile apps category; Profit margin is around 90%; Backend costs around a,000 per month; AI costs around 500 bucks per month; At peak, around seven accounts posted 8 to 12 times per day; Built approximately 10 apps that failed; Did software engineering for around 2 years before dropping out |
| **Notable quotes** | Most of our downloads came from our anchor link.; Move first and adjust later. Never wait for the perfect time because there's no perfect time.; Makeup is like not my passion. I don't know anything about it, but it's my capitalistic endeavor and it's lovely to make money out of it. |
| **Other notable facts** | Glow Up launched one year ago as a side project.; The app is available on iOS and Google Play.; The onboarding asks about sensitive skin, wrinkles, preferred makeup looks, and skin tone to personalize results.; The app recommends makeup products, a makeup routine, and instructions for applying the look.; Marketing could cost zero when posting organically or more when using a VA, UGC, or influencers.; Louis also writes philosophy books on the side. |

### 81. How I grew my mobile app to $17K per month

| Field | Value |
|---|---|
| **Published** | 2025-12-14 |
| **Business** | Wrestle AI |
| **Description** | AI-powered mobile app and wrestling coach |
| **Category** | AI Wrapper |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $13,000 |
| **MRR basis** | Most recent founder statement: "Now, we're at like 13K for this month." |
| **Website** | — |
| **Founder** | George Lampropolis |
| **Type** | AI-powered mobile app and wrestling coach |
| **Revenue** | $17,000 a month · monthly · revenue (as of within the last 6 months) — Revenue dashboard showed $8,000 MRR from monthly subscriptions with the rest from annual subscriptions. He later said, "Now, we're at like 13K for this month." He has not taken any money out of the business and will not until it reaches $100K MRR. |
| **Revenue — amount** | $17,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | within the last 6 months |
| **Revenue — notes** | Revenue dashboard showed $8,000 MRR from monthly subscriptions with the rest from annual subscriptions. He later said, "Now, we're at like 13K for this month." He has not taken any money out of the business and will not until it reaches $100K MRR. |
| **Traffic / users** | Over 2 million impressions on social media; around 17,000 downloads |
| **Engagement** | — |
| **Tech stack** | ROR; Ror Bolt; Replit; Expo; TestFlight; ChatGPT; OpenAI; Supabase; Apple App Store; Fiverr |
| **Marketing channels** | Influencer marketing; Instagram; TikTok; YouTube Shorts; Social media; Pre-order launch promotion |
| **Marketing tactics** | He used influencer marketing, opening direct messages with 100 influencers per day, switching from a personal to a business Instagram account, negotiating influencer deals by phone, and offering 20% to 50% upfront for four to five videos with view guarantees based on a $2 to $5 CPM. Wrestle AI launched with promotion from his co-founder, a large wrestling influencer, and generated about 3,000 to 4,000 pre-orders. He later invested $500 in marketing and expected to invest another $250 before the month ended. |
| **Pricing model** | $9.99 per month and $59.99 per year, with a free trial attached to the yearly option |
| **Customer count** | — |
| **Growth metrics** | Wrestle AI launched September 26th; Wrestle AI reached number 18 or 19 in the App Store on launch day; Wrestle AI launched on July 1st after approximately one month of development; Over 1.8 million impressions and around 100 downloads for another app called Green; About 3,000 to 4,000 pre-orders before launch; Founder is 18 and a college freshman; An earlier social self-improvement app took a year and a half to release after working with three development agencies; The earlier app built with those agencies had 10K followers waiting for it; Paid $250 on Fiverr for payment and authentication integration; Superbase costs around $30 a month; OpenAI AI inference costs are $40 to $60 a month; ROR… |
| **Notable quotes** | I truly believe that anyone can build a mobile app these days.; I feel like I need to learn how to code.; The gotcha moment is the moment that's going to stop someone from scrolling. |
| **Other notable facts** | The app analyzes wrestling match videos, identifies the wrestlers, and provides a performance breakdown, strengths, areas for improvement, strategy analysis, drills, and training programs.; Features also include a calorie tracker with a nutrition database, barcode scanner, food-photo calorie estimates, live coaching, a calendar for upcoming matches, and a weight journal.; The AI API went down around 30 minutes before launch and was fixed around 5:00 a.m.; by the time he woke up, the app was number 19 in the App Store and had made over $1,000.; The founder does not know how to code and used ChatGPT as an adviser by copying logs from Expo issues.; He previously worked at TJ Maxx after his earlier app project ran out of money.; The app's overall goal is to create an ecosystem for wrestling. |

### 82. I make $10K/month from 28 apps

| Field | Value |
|---|---|
| **Published** | 2025-12-11 |
| **Business** | Portfolio of mobile apps |
| **Description** | A portfolio of simple mobile apps |
| **Category** | Portfolio of Products |
| **Vertical** | Other / Miscellaneous |
| **MRR (normalised)** | $10,000 |
| **MRR basis** | The founder stated the business currently generates $10,000 a month in revenue, which is the most recent monthly figure. |
| **Website** | — |
| **Founder** | Max |
| **Type** | A portfolio of simple mobile apps |
| **Revenue** | $10,000 a month · monthly · revenue (as of 8 months) — Grew from $200 a month to $10,000 a month; four apps each bring around $1 and a half thousand dollars. |
| **Revenue — amount** | $10,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | 8 months |
| **Revenue — notes** | Grew from $200 a month to $10,000 a month; four apps each bring around $1 and a half thousand dollars. |
| **Traffic / users** | Over 1,000 subscribers and four or 5K daily users across all apps |
| **Engagement** | — |
| **Tech stack** | Flutter; Fastlane; Cursor; Firebase; OpenAI; Gemini; Mixpanel; Astro; Figma; App Store Connect |
| **Marketing channels** | App Store; Apple Search Ads; YouTube |
| **Marketing tactics** | Uses ASO keyword research to select targets, studies competitors, focuses on one core feature, publishes relevant keyword-focused metadata, gains an App Store launch boost, then adds ads to apps showing organic traction or retention. |
| **Pricing model** | — |
| **Customer count** | Over 1,000 subscribers across all apps |
| **Growth metrics** | 28 apps shipped in 8 months; Revenue grew from $200 a month to $10,000 a month; Four or 5K daily users across all apps; Four apps each generate around $1 and a half thousand dollars; Record of building and submitting one app in 2 hours; About 8 years as an iOS developer; Keyword research criteria of at least 20% popularity and 60 or 70% difficulty; Competitor revenue benchmark of at least 100 or €200 per month |
| **Notable quotes** | Once the app is live, just let it go and move on to the next project.; The most important advice would be not to be afraid of shipping.; Get it ready bugs free, just one single feature, ship it, and let users tell you what they think about it while you're building another app. |
| **Other notable facts** | Max is a full-time iOS engineer and built the portfolio during off-work hours.; His largest four apps account for the biggest chunk of revenue; the rest generate very small numbers.; For some apps, he copies about 90% of the code from previous projects.; He uses drag-and-drop UI elements, views, onboarding, and pay-wall screens.; The App Store initially gives launched apps a boost that fades over time.; Stated monthly tool costs were Cursor $20, Fastlane $0, OpenAI $200, Gemini $50, Firebase $5 to $10, Mixpanel $0, Astro $10, and Fox Data $0. |

### 83. I shipped my app in 12 hours and now it makes $15K/month

| Field | Value |
|---|---|
| **Published** | 2025-12-09 |
| **Business** | Audio Pen |
| **Description** | B2C SaaS voice-to-text AI tool |
| **Category** | AI Wrapper |
| **Vertical** | Productivity & Workflow |
| **MRR (normalised)** | $15,000 |
| **MRR basis** | The founder states the app makes about $15,000 a month, which is the current monthly recurring revenue run-rate. |
| **Website** | — |
| **Founder** | Lewis |
| **Type** | B2C SaaS voice-to-text AI tool |
| **Revenue** | about 15,000 a month · monthly · revenue — The introduction also states that the app makes $15,000 a month. |
| **Revenue — amount** | about 15,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The introduction also states that the app makes $15,000 a month. |
| **Traffic / users** | about 200,000 users |
| **Engagement** | — |
| **Tech stack** | Bubble; Draftbit; Loops; Plausible Analytics; Stripe |
| **Tech stack — removed** (not found in transcript) | Xano |
| **Marketing channels** | Twitter; email; Google Forms |
| **Marketing tactics** | He built and shared small tools publicly on Twitter, used direct messages to learn users' use cases, built hype before launch, opened a waitlist about 10 hours into the hackathon, collected early beta testers, and built in public. |
| **Pricing model** | Free version plus paid annual or two-year plans at $99 a year or $159 for 2 years; non-recurring subscriptions with user-controlled renewal. |
| **Customer count** | over 5,000 paying customers |
| **Growth metrics** | Built the Audio Pen MVP in about 12 hours; Reached the 20th paying customer; About 200,000 users; Over 5,000 paying customers; Built 15 to 20 tools, most of which failed; Started the Halfday Build hackathon in 2022; Bubble web app costs about $130 a month; Xano backend and logic costs about $260; Draftbit costs about $300 a year; Loops email platform costs about $800 a month; Plausible Analytics costs $19 a month |
| **Notable quotes** | Very often you will not know what will work. And the cost of experimentation is so low today that you might as well build a bunch of things and see what sticks and then double down on them.; I think that's slow consistency is what has worked for me.; Just build many things for fun because you will have fun while building those things. |
| **Other notable facts** | Audio Pen listens to speech, transcribes it, and transforms the transcription into a selected writing style.; It works across languages and on both mobile and desktop.; Use cases include capturing ideas, taking meeting notes, and combating writer's block.; Free users receive shorter recordings and limited features; premium users receive longer recordings, writing styles, integrations, and other features.; Lewis works full-time with his family business and describes Audio Pen as a solid source of secondary income.; Audio Pen was one of four or five small tools Lewis built and shared on Twitter during a hackathon week. |

### 84. I Built 4 SaaS Apps to $100K MRR: Here's My Exact Playbook

| Field | Value |
|---|---|
| **Published** | 2025-12-07 |
| **Business** | Rabbit.ai, Alfronk, Super X, Post Sinker, Feather, Tweet Hunter, Taplio, and Outrank |
| **Description** | SaaS products, including AI video creation, SEO, X audience growth, social media, blogging, Twitter management… |
| **Category** | Portfolio of Products |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | $700,000 |
| **MRR basis** | Founder explicitly stated $700,000 a month in current revenue, which is the monthly run-rate (MRR). |
| **Website** | — |
| **Founder** | Tibo / Thibault |
| **Type** | SaaS products, including AI video creation, SEO, X audience growth, social media, blogging, Twitter management, LinkedIn automation, and content ranking |
| **Revenue** | $700,000 a month · monthly · revenue — Combined revenue from five products; Rabbit.ai makes about $400K per month, Alfronk just passed $200K per month, Super X just passed $13K per month, Post Sinker makes $1.5K per month, and Feather makes about $10K per month. Four products are above $100K per month. |
| **Revenue — amount** | $700,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Combined revenue from five products; Rabbit.ai makes about $400K per month, Alfronk just passed $200K per month, Super X just passed $13K per month, Post Sinker makes $1.5K per month, and Feather makes about $10K per month. Four products are above $100K per month. |
| **Traffic / users** | — |
| **Engagement** | Total monthly revenue has grown about 20% per month consistently for over 6 months; Rabbit.ai is growing 10% month over month |
| **Tech stack** | Bubble.io; Notion |
| **Marketing channels** | Twitter DMs; Tweets; Subreddits; Email; Social media; Product Hunt; SEO; Ads; Affiliates; Cold email |
| **Marketing tactics** | Reach five to 10 people in the core target audience through tweets, subreddits, or email; talk to them every day; route each product's support link to Twitter DMs until it reaches $10K per month in revenue; build features in response to customer requests; build in public; create content and testimonials or case studies; hire for SEO; make the affiliate program easy for affiliates; test many acquisition channels and then focus on the one or two that work. |
| **Pricing model** | — |
| **Customer count** | 50K paying customers |
| **Growth metrics** | Four products are above $100K per month; Rabbit.ai is making something like $400K per month and growing 10% month over month; Alfronk just passed $200K per month; Super X just passed $13K per month; Post Sinker is making $1.5K per month; Feather makes about $10K per month; Total monthly revenue is growing about 20% per month consistently for over 6 months; Tibo built and exited Tweet Hunter and Taplio in an $8 billion acquisition; Feather was acquired for $250K; Outrank grew from zero to $20K per month by building in public and from $20K to $200K using ads, SEO, and affiliates; Tibo expects to slowly grow five current apps to $10 million in annual revenue |
| **Notable quotes** | Your job is to deeply understand the core need of uh your user.; Talk to your user every day and understand their core situation.; Being the user of my own products helped me becoming an expert on the problem that I'm trying to solve. |
| **Other notable facts** | Rabbit.ai can take a video and text and attempt to create an engaging video.; Alfronk began as a blog post generator and is becoming an all-in-one SEO SaaS.; Post Sinker lets users post on 10 platforms.; Feather converts Notion pages and Notion content into a blog on the web.; Elon Musk taking over X almost killed Tweet Hunter while it was making $200K per month.; Tibo built some MVPs using Bubble.io and recommends building MVPs in days or weeks. |

### 85. I make $120K/year from 3 mobile apps

| Field | Value |
|---|---|
| **Published** | 2025-12-04 |
| **Business** | the wellness company |
| **Description** | Health and wellness mobile app company |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $10,400 |
| **MRR basis** | The founder explicitly stated current monthly recurring revenue of $10.4K, which is consistent with $120K ARR divided by |
| **Website** | — |
| **Founder** | Pre |
| **Type** | Health and wellness mobile app company |
| **Revenue** | $10.4K monthly; $120K ARR · monthly and annual recurring revenue · revenue (as of in the past year) — All revenue is subscription based; the apps collectively make about $120K ARR. |
| **Revenue — amount** | $10.4K monthly; $120K ARR |
| **Revenue — period** | monthly and annual recurring revenue |
| **Revenue — metric** | revenue |
| **Revenue — as of** | in the past year |
| **Revenue — notes** | All revenue is subscription based; the apps collectively make about $120K ARR. |
| **Traffic / users** | Total downloads are over 20,000. |
| **Engagement** | Day 30 free-to-paid retention is 61%; free-to-paid conversion is around 8%. |
| **Tech stack** | Figma; Cloud Code; Xcode; Superbase; iMessage; RevenueCap; Sentry; PostHog; Linear; ChatGPT; CapCut; Framer; Lovable; Replit; Bolt; Apple Watch; iPhone |
| **Marketing channels** | App Store; Organic search; Creator platforms |
| **Marketing tactics** | Create content about the personal problem the product solves and talk about it on creator platforms to build an audience. Market new apps to existing users of the company's other apps because the apps serve overlapping audiences and remarketing is not cold. |
| **Pricing model** | Freemium subscription model with a paywall |
| **Customer count** | Over 1,500 paying subscribers |
| **Growth metrics** | Three apps launched in the past 10 months; Went from zero to $120K ARR in the past year; Total monthly revenue reached $10.4K; Total downloads over 20,000; Free-to-paid conversion around 8%; Day 30 free-to-paid retention of 61%; Tools cost about $300 a month; Margins close to the 80-85% range; Apple takes a 15% cut if revenue is under $1 million; Tempo launching in a few weeks |
| **Notable quotes** | If you care about it, ship it.; We make health and wellness apps.; We target the same audience because of the overlap. |
| **Other notable facts** | Go Polar tracks cold plunge and sauna sessions using Apple Watch or iPhone.; SunSeek provides sunlight and vitamin D guidance for sleep and circadian rhythm.; Posture AI scans posture and primarily targets desk workers.; Tempo is a health aggregator that combines wearable data and blood tests into a health span score.; Pre dropped out of business college after his first year and later worked at Launch for 7 years.; All three current apps focus on health and wellness and serve overlapping audiences. |

### 86. How I Built It: $30K/month Micro-SaaS (Subscribr Breakdown)

| Field | Value |
|---|---|
| **Published** | 2025-12-02 |
| **Business** | Subscriber |
| **Description** | SaaS AI script-writing tool for YouTube creators |
| **Category** | AI Wrapper |
| **Vertical** | Creator & Social Media |
| **MRR (normalised)** | $30,000 |
| **MRR basis** | The founder stated recurring revenue is typically around $30,000 per month, with some monthly variation. |
| **Website** | — |
| **Founder** | Gil |
| **Type** | SaaS AI script-writing tool for YouTube creators |
| **Revenue** | around $30,000 a month; over $700,000 in sales in the past year · monthly and past year · subscription revenue and total sales — Revenue every month varies, but typically is around $30,000 a month; the business was profitable from day one. |
| **Revenue — amount** | around $30,000 a month; over $700,000 in sales in the past year |
| **Revenue — period** | monthly and past year |
| **Revenue — metric** | subscription revenue and total sales |
| **Revenue — as of** | — |
| **Revenue — notes** | Revenue every month varies, but typically is around $30,000 a month; the business was profitable from day one. |
| **Traffic / users** | over 30,000 views a month from Google |
| **Engagement** | The founder emailed his email list weekly and used replies as feedback; an email list of over a thousand people was built. |
| **Tech stack** | Claude Code; Laravel; PHP; DigitalOcean; AI model providers |
| **Marketing channels** | Word of mouth; Social media; Programmatic SEO; Google; X; YouTube; Email |
| **Marketing tactics** | Built an audience by posting videos about startup ideas and sharing valuable free content, built an email list, contacted subscribers individually, and validated demand through a pre-sale of 50 lifetime licenses with increasing prices and a money-back guarantee. Customer acquisition also includes programmatic SEO campaigns, social media, and word of mouth. |
| **Pricing model** | SaaS subscription with plans ranging from $49 to $300 a month; the pre-sale offered 50 lifetime licenses at a low, progressively increasing price. |
| **Customer count** | over 4,000 customers |
| **Growth metrics** | 18 months after launch, over 4,000 customers; The pre-sale of 50 licenses sold out within 2 or 3 days; Made the first $20,000 before the app was built; Approximately 90% of the code is written with Claude Code; Spending about $3,500 a month on AI compute; Spending about $2,000 a month on ads and $1,500 a month on web scraping, hosting, and sending emails |
| **Notable quotes** | It was profitable from day one and 18 months later I have over 4,000 customers.; The only way to really get validation is to collect money from people.; It's better to have profit than growth. |
| **Other notable facts** | The pre-sale offered a money-back guarantee until 60 days after the product was delivered, followed by a 2-week trial period.; The founder pre-sold 50 lifetime licenses to fund about 3 months of his life while building the product.; Squidoo, a social publishing platform co-founded by the founder, grew to over $10 million in revenue and was acquired.; The founder raised millions of dollars from VCs for a cryptocurrency accounting business and later sold it.; The founder started coding at 15 and dropped out of college to freelance as a software developer.; The business generates over 30,000 monthly views from Google through programmatic SEO campaigns. |

### 87. My Apps Failed Until I Discovered This Playbook ($35K/month apps)

| Field | Value |
|---|---|
| **Published** | 2025-11-30 |
| **Business** | Drop Magic |
| **Description** | SaaS for creating online stores for beginners with AI |
| **Category** | SaaS / Web App |
| **Vertical** | E-commerce & Retail |
| **MRR (normalised)** | $45,000 |
| **MRR basis** | Founder stated over 45K MMR (monthly recurring revenue) within the first four months, so the current monthly run-rate is |
| **Website** | — |
| **Founder** | Loick |
| **Type** | SaaS for creating online stores for beginners with AI |
| **Revenue** | over 45K MMR within the first four months · first four months · MRR — Drop Magic was described as growing to over 45K MMR within its first four months. |
| **Revenue — amount** | over 45K MMR within the first four months |
| **Revenue — period** | first four months |
| **Revenue — metric** | MRR |
| **Revenue — as of** | — |
| **Revenue — notes** | Drop Magic was described as growing to over 45K MMR within its first four months. |
| **Traffic / users** | More than 60% of new customers come from YouTube; more than 500 YouTube creators work with Minia and Drop Magic. |
| **Engagement** | — |
| **Tech stack** | Superbase; Next.js; Vercel; Sentry; Trigger.dev; Cursor; Claude Code; Nano Banana; Gemini; OpenAI; Blime |
| **Marketing channels** | YouTube; Instagram; Twitter; TikTok; Creator affiliates; Paid ads |
| **Marketing tactics** | The founder uses YouTube creators as promoters or co-founders, paying promoters with cash or affiliate revenue and co-founders with equity. Creator outreach uses seven email campaigns with different marketing angles, plus outreach on Instagram and Twitter. The initial creator deal includes a fixed fee and commission, with two packages: one requiring more upfront cost for lower commission and another requiring less upfront cash for higher commission. The first video is tested before committing to a package of three or four videos. Long-form YouTube videos are repurposed into short-form content… |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | Infuspy reached 20K MMR in two months; Minia peaked at 750K MMR within two years; Drop Magic grew to over 45K MMR within the first four months; All three successful SaaS businesses reached at least 35K MRR within their first month of activity; All successful SaaS businesses were 100% bootstrapped; More than 500 YouTube creators work with Minia and Drop Magic; More than 60% of new customers come from YouTube; A creator co-founder of Drop Magic was expected to secure 10K MMR; Server and compute costs about $100 per month; AI costs about $1.5K because five AI images are offered for every free user; Minia had an 80% margin; Drop Magic's margin is currently lower; the stated sweet spot is betwee… |
| **Notable quotes** | We started with a newsletter that validated the initial traction, then with a no code app at the time that validated the product market fit, and then a real app that I've developed to really scale.; More than 60% of our new customers come from YouTube.; Just use simple deadlines and milestone as the only source of truth to carry on or not. |
| **Other notable facts** | Infuspy helped e-commerce businesses find influencers on Instagram and Snapchat.; Minia helped dropshippers and e-commerce businesses find product opportunities.; A creator was brought into Drop Magic's founding team as a co-founder.; Creator selection uses engagement rate above 10% and a minimum of 100 comments per video.; The founder prefers YouTube because videos can have a minimum number of views, allow long-form demonstrations, continue converting over time, support organic traffic, and can be repurposed.; The founder's process validates ideas with a newsletter, a no-code app, and then a real app. |

### 88. How he makes $250K per month from a simple app (Letterly Breakdown)

| Field | Value |
|---|---|
| **Published** | 2025-11-24 |
| **Business** | Letily |
| **Description** | Paid mobile application that transcribes speech into written text and rewrites text |
| **Category** | AI Wrapper |
| **Vertical** | Documents & Writing |
| **MRR (normalised)** | $250,000 |
| **MRR basis** | The founder stated revenue is $250,000 a month, which is a current monthly run-rate; the app's age does not require adju |
| **Website** | — |
| **Founder** | Anton |
| **Type** | Paid mobile application that transcribes speech into written text and rewrites text |
| **Revenue** | $250,000 a month · monthly · revenue — The app had launched 2 years ago. |
| **Revenue — amount** | $250,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The app had launched 2 years ago. |
| **Traffic / users** | 30K monthly active users; overall 150,000 downloads for 2 years |
| **Engagement** | — |
| **Tech stack** | React Native; Swift; Python; ChatGPT; OpenAI transcription; Google Docs; Notion |
| **Marketing channels** | Advertising |
| **Marketing tactics** | The company invested in advertising to continue improving the user experience and grow. |
| **Pricing model** | Paid application with a free trial |
| **Customer count** | 20K paid subscribers |
| **Growth metrics** | Launched 2 years ago; 150,000 downloads for 2 years; Team of 10; Salaries cost about 30k a month; AI cost about 5k a month; Advertising costs about $200,000 a month; Anton spent 15 years trying to create startups and tried maybe six or seven, all of which failed before Letily |
| **Notable quotes** | The number one goal with Lety is uh to make it really simple. It's all about making it more simple, eliminate friction.; Everyone can build a product. But there are really few that are very simple and easy to use.; It's better to find something that is already working and uh that can be done better. |
| **Other notable facts** | Letily turns speech into well-written text for notes, messages, emails, social media posts, and meeting notes.; It supports multi-speaker recording and real-time transcription.; The app can rewrite text in several ways, including generating takeaways.; Users can record additional content and add it to an existing note.; The app can share text with Google Docs or Notion in one click.; Anton says thousands of hours went into rebuilding the app, creating prototypes, and developing versions to achieve a simple UX. |

### 89. Our Mobile App Made $85K in 8 months

| Field | Value |
|---|---|
| **Published** | 2025-11-20 |
| **Business** | Coherence |
| **Description** | Mobile breath work app designed to help users relax, focus, and sleep better |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $11,000 |
| **MRR basis** | The founder stated they have averaged around $11,000 in revenue per month since launch, which is the most recent monthly |
| **Website** | — |
| **Founder** | Jack Sweeney and Nick Sweeney |
| **Type** | Mobile breath work app designed to help users relax, focus, and sleep better |
| **Revenue** | around $85,000 · since launch · revenue (as of eight months after launch) — They have averaged around $11,000 a month in revenue since launch; their biggest month was $22,000 in revenue. |
| **Revenue — amount** | around $85,000 |
| **Revenue — period** | since launch |
| **Revenue — metric** | revenue |
| **Revenue — as of** | eight months after launch |
| **Revenue — notes** | They have averaged around $11,000 a month in revenue since launch; their biggest month was $22,000 in revenue. |
| **Traffic / users** | over 15,000 downloads; just surpassed 2,000 users |
| **Engagement** | — |
| **Tech stack** | React Native; Expo; Supabase; Cursor; Codex; Mixpanel; RevenueCat; Vercel; Next.js; Figma; ManyChat; Stripe |
| **Tech stack — removed** (not found in transcript) | Rive |
| **Marketing channels** | X; Instagram; TikTok; YouTube; Meta Ads; Instagram DMs; influencer partnerships |
| **Marketing tactics** | They created content first, tested posts on X to identify what resonated, converted successful X posts into Instagram short-form scripts, replicated them on Instagram and TikTok, and made YouTube videos from content that performed well. They amplified winning content with Spark Money and Meta Ads, made reels in bulk, hired clippers, and used ghostwritten threads. |
| **Pricing model** | Subscription model with a 3-day free trial on the yearly plan; yearly plan is $40 and monthly plan is $10 a month |
| **Customer count** | over 15,000 downloads; just surpassed 2,000 users |
| **Growth metrics** | Launched eight months ago; Over 15,000 downloads; Around $85,000 in revenue; Averaged around $11,000 a month in revenue; Biggest month was $22,000 in revenue; Just surpassed 2,000 users; Finished the MVP in February 2025; One July content piece received around 8 million views across all platforms; That content had 1 million views the next day; Jack grew a university YouTube channel to about 20,000 subscribers; Operating at about 50% margin; Total operating costs are $5 to $6K a month |
| **Notable quotes** | We started with content and we were making content about things that genuinely excited us.; I didn't actually write a single line of code in this entire codebase.; You could sell whatever you want to sell, but with software, you have a lot of leverage. |
| **Other notable facts** | The idea for the app originated from a viral vortex breath tweet.; Nick was a division 1 cross-country skier who was injured and unable to walk for 10 months; he began breath work and was able to walk within 3 months.; Six months after beginning breath work, Nick was training full-time again.; They are fully bootstrapped.; They spend about $2.5K on video editors, $1 to $2K on influencer partnerships, $800 a month on a ghostwriter, $500 a month on a virtual assistant, about $300 a month on coding agents, and about $100 a month on RevenueCat.; Coherence includes six main techniques: coherence breathing, vortex energy, focus, stress relief, and sleep, along with a streak counter and gamification. |

### 90. How We Built It: $30K/month Mobile App

| Field | Value |
|---|---|
| **Published** | 2025-11-18 |
| **Business** | Prop GPT |
| **Description** | Sports betting analytics platform |
| **Category** | SaaS / Web App |
| **Vertical** | Gaming & Entertainment |
| **MRR (normalised)** | $30,000 |
| **MRR basis** | The founder stated revenue of $30,000 a month; the $40K MRR refers to a peak, not the current run-rate. |
| **Website** | — |
| **Founder** | Eyal and Yali |
| **Type** | Sports betting analytics platform |
| **Revenue** | $30,000 a month · monthly · revenue — The founders also said the app hit a peak of $40K MRR. |
| **Revenue — amount** | $30,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The founders also said the app hit a peak of $40K MRR. |
| **Traffic / users** | over 40,000 downloads |
| **Engagement** | 48% conversion to trial; 13% conversion from trial to paid; over 50% conversion rate to paid after the rebuild |
| **Tech stack** | React Native; TypeScript; Python; Neon; RevenueCat; Superwall; PostHog |
| **Marketing channels** | Influencer marketing; Organic social media |
| **Marketing tactics** | They spent a few thousand dollars on influencer marketing, shut down all marketing during a four-month rebuild, then resumed marketing for the NBA playoffs. They also use organic social media videos. |
| **Pricing model** | — |
| **Customer count** | over 3,000 paying customers |
| **Growth metrics** | Averaging 20 downloads a day right off the bat; About 5 to 10 free trials per day during the initial marketing test; 45% conversion to trial and 13% conversion from trial to paid before the rebuild; Over 50% paid conversion after the rebuild; 2,000 downloads in a single day at the $40K MRR peak; A video received 600,000 views and raised ARR from around $8K to $38K in about 3 days; The rebuilt version launched on April 15th; About $3.30 per download; Approximately 50% margins; Marketing costs about $10,000 a month |
| **Notable quotes** | We built Prop GPT, which is basically a sports betting analytics platform that uses our machine learning algorithm to hit the most picks.; We realized that what our customers actually wanted was just to be given the right answers to the test.; One video can seriously change your entire business. |
| **Other notable facts** | The founders spent five months building the first version and launched it in the middle of the previous NFL season.; The rebuilt version launched at $1,700 MRR and around $15 a day after several months without marketing.; The first rebuild took four months of engineering and design work.; Superwall costs about 20 cents per conversion; RevenueCat typically costs 1%.; Real-time sports data APIs cost about $100 a month, the Neon database about $10 a month, and LLM costs about $20 a month. |

### 91. My website makes $35K/month (built in 3 hours)

| Field | Value |
|---|---|
| **Published** | 2025-11-16 |
| **Business** | Cursive Directory |
| **Description** | Open-source directory for Cursor developers to discover, share, vote on, and generate Cursor rules |
| **Category** | Marketplace / Directory |
| **Vertical** | Developer Tools |
| **MRR (normalised)** | $34,000 |
| **MRR basis** | The founder stated revenue as '$34,000 a month' (also described as '35k per month'). The explicit $34,000 monthly figure |
| **Website** | https://cursordirectory.com |
| **Founder** | Pontis |
| **Type** | Open-source directory for Cursor developers to discover, share, vote on, and generate Cursor rules |
| **Revenue** | $34,000 a month · monthly · revenue — Also described as making "35k per month"; operational cost was just under 500 bucks per month, with a stated 99.8% gross margin |
| **Revenue — amount** | $34,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Also described as making "35k per month"; operational cost was just under 500 bucks per month, with a stated 99.8% gross margin |
| **Traffic / users** | 49,000 registered users and 2.2 million unique visitors since launch |
| **Engagement** | — |
| **Tech stack** | Next.js; JavaScript; TypeScript; shadcn/ui; Resend; OpenPanel; GitHub; Vercel; Polar; Cursor; Notion; Figma; JSON |
| **Marketing channels** | X; Hacker News; YouTube; GitHub |
| **Marketing tactics** | They built in public, shared their work and code on X, posted the directory at launch, posted on Hacker News, received coverage from YouTubers, and shared knowledge throughout the product's development. |
| **Pricing model** | Companies can pay for job listings and paid featured placements; other paid advertising is also available. |
| **Customer count** | — |
| **Growth metrics** | Built the initial directory in 3 hours; One X post received 1 million impressions; 49,000 registered users; 2.2 million unique visitors since launch; $34,000 in monthly revenue; 99.8% gross margin; Operational cost of just under $500 per month; Approximately 3 hours of maintenance per month; The prior year's Starter Story early-bird Black Friday deal sold out in less than 2 hours |
| **Notable quotes** | We build it in a weekend and now it makes 35k per month.; You create your own luck by constantly finding ways to move forward, shipping, sharing, and iterate.; Design will actually be the things that puts you apart from the competitors. |
| **Other notable facts** | The initial version was built after Pontis landed in France following a three-hour flight.; Pontis and Victor launched a simple directory after coding for 3 hours straight.; The directory's rules are open source and merged on GitHub.; The site allows users to filter, search, browse popular and official rules, register, publish rules, and vote.; The site also allows users to upload package.json and generate tailored Cursor rules.; Pontis and Victor have worked together for several years and maintain a long-term focus on their main startup, Midday. |

### 92. How I Built It: $400K/Month Mobile App (Gravl)

| Field | Value |
|---|---|
| **Published** | 2025-11-13 |
| **Business** | Gravel |
| **Description** | AI fitness app for strength training and gym workouts |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $440,000 |
| **MRR basis** | Most recent stated monthly revenue was over $440K last month; the $400K/month and $4M/year figures are lower or consiste |
| **Website** | — |
| **Founder** | Julian |
| **Type** | AI fitness app for strength training and gym workouts |
| **Revenue** | over $440K · last month · revenue (as of last month) — The app is also described as making over $400,000 a month and over $4 million a year. |
| **Revenue — amount** | over $440K |
| **Revenue — period** | last month |
| **Revenue — metric** | revenue |
| **Revenue — as of** | last month |
| **Revenue — notes** | The app is also described as making over $400,000 a month and over $4 million a year. |
| **Traffic / users** | Over 70,000 subscribers; used by hundreds of thousands of people |
| **Engagement** | — |
| **Tech stack** | React Native; Expo; .NET; Next; React; Cursor; Apple Health; Strava |
| **Marketing channels** | Reddit; Paid ads; Meta Ads; TikTok; Google; Apple Search; Influencer marketing; Content creators; Meta Ads Library |
| **Marketing tactics** | Julian posted a Reddit thread explaining how he built the app, shared its technical specifications, and received over 300,000 impressions. After adding subscriptions, the founders ran paid ads, translated the app into Spanish, and advertised in South America. They also recommended starting with small influencer or content-creator ads, using AI tools and CapCut to create videos, producing UGC ads, testing many ads, and copying ads that work from the public Meta Ads Library. |
| **Pricing model** | Subscription model with a hard paywall before first sign-in |
| **Customer count** | Over 70,000 subscribers |
| **Growth metrics** | Launched around 2 years ago; Initial MVP took around 2 to 3 months; The original app was cloned in 2 months; First Reddit thread received over a couple hundred likes within the first couple hours; First Reddit thread received over 300,000 impressions; Reddit launch produced the first couple thousand users; The first subscription was received within the first 10 minutes of activating ads; Ad spending was less than 50 bucks a day; Ads account for approximately one-third of revenue; Apple receives a 15% revenue cut; Apple search spending accounts for a 1% revenue cut; MMPS costs about a grand a month; Infrastructure, servers, AI bills, and other tools cost around a grand a month; The team was… |
| **Notable quotes** | I'm one of the co-founders and developer of Gravel, an AI fitness app that provide smart workouts for the gym.; Last month we made over 440K.; Tip number one for sure will be to validate before spending money on ads. |
| **Other notable facts** | Julian grew up in Argentina and moved to Australia for software engineering work.; He worked at startups, Atlassian, TV channels, and an investment fund.; The founders previously operated an influencer marketing platform for mobile games and later became a marketing agency.; The app asks users about experience, goals, training frequency, working split, equipment, excluded muscles, and focused muscles.; Workouts can adapt to a user's gym and adjust weights based on exercise order.; Recovery features incorporate previous workouts and external activity from Apple Health and Strava. |

### 93. I flipped 4 apps and made $500,000

| Field | Value |
|---|---|
| **Published** | 2025-11-09 |
| **Business** | Lots (app studio flipping apps; apps include Bible Buddy, Magic Music, Toxic Traits, Pray Screen) |
| **Description** | App studio that builds consumer apps to 10-20k MRR and flips/sells them |
| **Category** | Portfolio of Products |
| **Vertical** | Gaming & Entertainment |
| **MRR (normalised)** | — |
| **MRR basis** | Only lifetime total sales ($500,000+ since 2022), per-app historical MRR ranges ($10k-$20k), and an exit target were giv |
| **Website** | — |
| **Founder** | Lots |
| **Type** | App studio that builds consumer apps to 10-20k MRR and flips/sells them |
| **Revenue** | over $500,000 total sales · since 2022 (lifetime across four flips) (as of since 2022) — Apps built to about 10 to 20k MRR each; typical exit targeted at 'a cool 250k' within 6 to 12 months; valuations seen at 2 to 4 X EBITDA on ARR |
| **Revenue — amount** | over $500,000 total sales |
| **Revenue — period** | since 2022 (lifetime across four flips) |
| **Revenue — metric** | total sales |
| **Revenue — as of** | since 2022 |
| **Revenue — notes** | Apps built to about 10 to 20k MRR each; typical exit targeted at 'a cool 250k' within 6 to 12 months; valuations seen at 2 to 4 X EBITDA on ARR |
| **Traffic / users** | over a million users across all the apps; email list of 1.2 million Christians |
| **Engagement** | Pray Screen had 60% day 30 retention |
| **Tech stack** | React Native; Stripe; Supabase; Figma; TikTok tracking (Short Term Eyes); appstoretracker.com |
| **Marketing channels** | TikTok (UGC accounts); Meta Ads; Twitter; MicroAcquire; My First Million podcast community on Facebook; email list; Meta lookalike audiences |
| **Marketing tactics** | Spot trends by checking who is number one in App Store categories and who else is in the top 20 doing the same thing in slightly different niches, then use Sensor Tower to check their revenue numbers; pick a unique angle (Christian/faith market); make the app single-player; make it highly shareable via shared assets or super high retention; use multiple UGC accounts with rage-bait content to boost engagement and find the hook, then launch on Meta Ads for low CPIs; list for sale on MicroAcquire and post on Twitter |
| **Pricing model** | Subscription base (mentioned for Chill Guy AI idea); apps sold for cash via 2 to 4 X EBITDA on ARR |
| **Customer count** | — |
| **Growth metrics** | Pray Screen cost per install of 30 to 50 cents in the US market; apps grown to about 10k to 20k MRR before selling; last three months should show an uptick before selling; max $1,000 a month costs for Chill Guy AI at 10k a month, with 5 to 10k a month paid to 10 UGC creators; target of at least 70% profit margin; sells to the third highest bidder who can close in 3 to 4 days |
| **Notable quotes** | I'd rather take two to three years of profit up front than grind for a decade.; Is this going to be my legacy or is this cash flow?; Only play games you can win and always have an edge. |
| **Other notable facts** | Previously worked in banking, raised VC for his own startup which he ran for about 3 and a half years and failed; First app Bible Buddy was launched on WhatsApp using a third party, then costs ballooned to about 15k a month, so he hired an engineer from Upwork and moved to iOS and Android; Magic Music was a wrapper around Ceno AI, an AI music generator; Toxic Traits analyzed personality traits from screenshot chats; Pray Screen blocked your apps until you prayed to unlock them; Plans to build another Christian app in a different niche because he now has an email list of 1.2 million Christians and can cross-sell between apps |

### 94. I Built 3 SaaS Apps to $200K MRR: Here's My Exact Playbook

| Field | Value |
|---|---|
| **Published** | 2025-11-02 |
| **Business** | curator.io, juno.co, thrill.co, fluke.co, and smile.co |
| **Description** | Portfolio of SaaS businesses |
| **Category** | Portfolio of Products |
| **Vertical** | Other / Miscellaneous |
| **MRR (normalised)** | $200,000 |
| **MRR basis** | Founder stated revenue was just over $200,000 per month, with $200,000 used as the comparable current MRR. |
| **Website** | https://curator.io |
| **Domains mentioned** | curator.io; juno.co; thrill.co; fluke.co; smile.co |
| **Founder** | Mike |
| **Type** | Portfolio of SaaS businesses |
| **Revenue** | just over 200 grand a month · monthly · MRR (as of Right now) — Combined revenue from five apps; the five apps are described as fully bootstrapped. |
| **Revenue — amount** | just over 200 grand a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | Right now |
| **Revenue — notes** | Combined revenue from five apps; the five apps are described as fully bootstrapped. |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Vue; React; PHP; Laravel; Willow Voice; Granola; Slack; Framer; Vyo; Figma |
| **Marketing channels** | Reddit; Facebook groups; X; LTD groups; Content marketing; Landing pages; Blog posts; Competitor pages; Alternative pages; SEO; Google; ChatGPT; AppSumo; Email; Trustpilot; G2; Quora |
| **Marketing tactics** | Offer a private lifetime deal, build content as early as possible, launch through AppSumo, close a final lifetime deal through the mailing list, obtain customer reviews, and answer relevant questions authentically in communities. |
| **Pricing model** | Lifetime deals for a single payment, followed by subscriptions generating MRR. |
| **Customer count** | Over 35,000 customers rely on HubSpot for Startups to grow their startups. |
| **Growth metrics** | Five apps; Just over $200,000 MRR; Aim to reach about $1 million MRR over the next five years; Smile launching in the next two weeks; Thrill raised about 30 grand from its private LTD; Target of closing an LTD with 100 grand in the bank; Each business starts with four co-founders; Each co-founder owns 25%; Businesses grow to about $10,000 MRR before founders begin splitting profits; Playbook completed for three companies, halfway through on a fourth, and about to start on a fifth |
| **Notable quotes** | New ideas are risky. New ideas need validation.; If people pay for it, they'll use it.; Don't just create something that customers want. Create something that you love building as well. |
| **Other notable facts** | curator.io is a social media aggregator for websites and events.; thrill.co collects customer feedback, plots it to a roadmap, and announces new features.; juno.co is a digital signage business for cafes, gyms, schools, and shops.; fluke.co is a no-code tours platform for SaaS onboarding tours, tooltips, and pop-ups.; smile.co is planned as a group e-card service for B2B businesses.; Mike previously ran a digital advertising agency and sold it. |

### 95. I vibe coded a $12K/month mobile app (Stoppr Breakdown)

| Field | Value |
|---|---|
| **Published** | 2025-10-30 |
| **Business** | Stopper |
| **Description** | Mobile app for women to stop sugar cravings |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $12,000 |
| **MRR basis** | The founder explicitly stated revenue of $12,000 per month, which is the current monthly run-rate. The $5,000 first-mont |
| **Website** | — |
| **Founder** | David |
| **Type** | Mobile app for women to stop sugar cravings |
| **Revenue** | $12,000 per month · monthly · revenue — The clone generated $5,000 in its first month of revenue. Stopper's profit margin was 35% after 5 months. |
| **Revenue — amount** | $12,000 per month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The clone generated $5,000 in its first month of revenue. Stopper's profit margin was 35% after 5 months. |
| **Traffic / users** | 60,000 downloads in 5 months |
| **Engagement** | — |
| **Tech stack** | Cursor; RevenueCat; Mixpanel; Figma; Figma MCP; Firebase; Stripe; Supabase; Rocket; LinkedIn.ai; top yappers.com |
| **Marketing channels** | French influencers; TikTok; Instagram; YouTube; LinkedIn.ai; Meta ads; TikTok Spark Ads |
| **Marketing tactics** | Validated the niche through keyword research on Google Trends and content research on TikTok and Instagram, then identified French influencers using top yappers.com and added their emails to LinkedIn.ai. He also used ads on Meta and Spark Ads on TikTok. |
| **Pricing model** | Monthly, weekly, and yearly subscriptions, with a trial |
| **Customer count** | Around 900 paying customers |
| **Growth metrics** | Built Stopper 5 months before the interview; 60,000 downloads in 5 months; Around 900 paying customers; Built the first full app version in 2 weeks and a half; Took 1 week to submit the first version and obtain Apple approval; Previously took about 1 month to build the MVP; 35% profit margin after 5 months; Worked as a quant trader for 8 years |
| **Notable quotes** | Fastest way to make some money right now is to do one-to-one copy of a very successful app.; I validated by keyword research and by content research on TikTok and Instagram.; My customers are around 13 years old to 25, so like mostly Gen Z women. |
| **Other notable facts** | The app's target customers are women around 13 to 25 years old, mostly Gen Z.; David discovered the original app after seeing three founders of Quitter on a YouTube podcast.; The Quitter app was reported as making $200,000 per month after 3 months.; He copied Quitter's onboarding, changed black to pink, and replaced its original content with sugar-related content.; His Cursor Ultra plan costs $20 per month.; He paid around $100 for Mixpanel the previous month and around $100 per month for TikTok Spark Ads. |

### 96. My 2 apps made $1.5M

| Field | Value |
|---|---|
| **Published** | 2025-10-28 |
| **Business** | Social Wizard |
| **Description** | AI-powered application that helps guys improve their social skills and reply to direct messages |
| **Category** | AI Wrapper |
| **Vertical** | Personal & Relationships |
| **MRR (normalised)** | — |
| **MRR basis** | The $1.5 million figure is combined revenue over the last 12 months, so it is annual revenue rather than a stated monthl |
| **Website** | — |
| **Founder** | Kletchi |
| **Type** | AI-powered application that helps guys improve their social skills and reply to direct messages |
| **Revenue** | 1.5 million · within the last 12 months · revenue — Combined revenue from Social Wizard and Clean Eats; the apps are also described as having made over a million dollars |
| **Revenue — amount** | 1.5 million |
| **Revenue — period** | within the last 12 months |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Combined revenue from Social Wizard and Clean Eats; the apps are also described as having made over a million dollars |
| **Traffic / users** | over 600,000 downloads |
| **Engagement** | — |
| **Tech stack** | React Native; NestJS; Render; Heroku; Firebase; Mixpanel; OpenAI |
| **Marketing channels** | TikTok; Instagram; creator collaborations; micro streamers |
| **Marketing tactics** | Demonstrating the app through creator videos rather than explicitly selling it, recreating formats that had already worked, and scaling the same format across multiple creators and videos. The founder recommends publishing TikTok content consistently, increasing from three videos per day across two accounts to 10 or 20, and potentially reaching 100 videos per day. He also recommends contacting 100 creators to find one that will work and using a successful creator's video to recruit additional creators. |
| **Pricing model** | Subscriptions: about $10 per week, about $20 per month, and about $80 per year |
| **Customer count** | — |
| **Growth metrics** | First app launched in early 2024; Social Wizard scaled to about $60,000 a month; over 600,000 downloads; first sale came very late January; about $10 made on the first sale; 3.5K in MR after 2 weeks; crossed $25,000 in MR after 1 month; about $250,000 cash collected by month six; that year probably ended with about half a million cash collected; second app hit about 10K in revenue within 2 weeks; second app was exited about 4 months later to a UK-based company; one creator video hit 2 million views and brought in tens of thousands of dollars; paid the creator about $120; profit margins over 90% after Apple takes its cut; 1 to maybe 2K in monthly infrastructure costs; about 90% of budgets sp… |
| **Notable quotes** | Distribution is always a show don't tell game.; If you don't find a way to tell people about your product, then you might as well not even build a product.; When it comes to distribution, it's never luck. It's deterministic. |
| **Other notable facts** | Kletchi moved from Nigeria to the US with $100.; His first app, Casp, was a social application where people shared pictures in groups; it grew to a few thousand users and had over 20,000 pictures posted.; Social Wizard's users are primarily ages 16 to 24.; Social Wizard's main use case is helping users text.; Clean Eats is a health and fitness app that scans food-product barcodes and explains how the food affects skin or weight; its core users are women ages 18 to about 28.; The first app was put on autopilot before the second app was launched. |

### 97. I vibe coded a $20K/month mobile app in 14 days

| Field | Value |
|---|---|
| **Published** | 2025-10-26 |
| **Business** | Payout |
| **Description** | Mobile app for discovering class action lawsuits and preparing settlement claim forms |
| **Category** | Mobile App |
| **Vertical** | Other / Miscellaneous |
| **MRR (normalised)** | $20,000 |
| **MRR basis** | The founder stated the business reached $20,000 a month in revenue, which is the current monthly run-rate. |
| **Website** | — |
| **Founder** | Connor |
| **Type** | Mobile app for discovering class action lawsuits and preparing settlement claim forms |
| **Revenue** | $20,000 a month · monthly · revenue (as of 50 days after launch) — Payout was launched in the beginning of August and reached $20,000 a month in revenue. |
| **Revenue — amount** | $20,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | 50 days after launch |
| **Revenue — notes** | Payout was launched in the beginning of August and reached $20,000 a month in revenue. |
| **Traffic / users** | over 12,000 downloads |
| **Engagement** | — |
| **Tech stack** | Figma; Mixpanel; Claude Code; Next.js; TypeScript; Vercel; GitHub; Expo; RevenueCat |
| **Marketing channels** | Influencer campaigns; TikTok; Instagram; Facebook paid ads; UGC campaigns |
| **Marketing tactics** | He partnered with a content creator already active in the app's niche, whose videos drove thousands of downloads. He creates relatable, viral, natural-looking content, repeats successful formats with other creators, and builds a library of ads from creator content for future paid campaigns. |
| **Pricing model** | Freemium paywall with weekly and yearly subscription options |
| **Customer count** | over 300 new subscriptions |
| **Growth metrics** | over $1 million in sales a year; over $1 million in subscription revenue; approximately six apps built; Payout grew from 0 to $20,000 a month in 50 days; over 12,000 downloads; over 300 new subscriptions; Payout won first place for the Build and Grow award in a RevenueCat Shipaton competition; the competition had over 55,000 entrants; the Build and Grow award had a $65,000 grand prize; Payout was built and launched in a few weeks; Hotspot Events took 6 to 8 months to build; roughly 3 years of entrepreneurship; age 23 |
| **Notable quotes** | The apps that I build are designed to make money from day one.; A simple app can make lots of money. You only really need one to three good features and your onboarding will pull most of the weight for you.; The goal is to create relatable, viral content about your app that comes off as natural and unprocessed. |
| **Other notable facts** | Payout lets users find class action lawsuits they may be eligible for and prepare PDF forms to mail in.; The app has a wallet tab for tracking lawsuit applications and a forms tab for viewing completed forms.; The onboarding includes activity notifications, social proof, and a paywall.; Connor prioritizes the yearly subscription because it has the highest lifetime value per customer.; He uses Claude for AI coding and screenshotted app onboarding flows as design inspiration.; His first app, Hotspot Events, was a social app that failed after taking 6 to 8 months to build. |

### 98. How I built a $30K/month mobile app

| Field | Value |
|---|---|
| **Published** | 2025-10-23 |
| **Business** | Mumigo |
| **Description** | bus and train tracking app |
| **Category** | Mobile App |
| **Vertical** | Travel & Local |
| **MRR (normalised)** | $30,000 |
| **MRR basis** | The founder stated revenue is around $30,000 per month and that it is monthly recurring revenue, almost entirely subscri |
| **Website** | — |
| **Founder** | John Makavoy |
| **Type** | bus and train tracking app |
| **Revenue** | around $30,000 a month · monthly · monthly recurring revenue (as of right now) — Pretty much all of the revenue is subscription based. |
| **Revenue — amount** | around $30,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | monthly recurring revenue |
| **Revenue — as of** | right now |
| **Revenue — notes** | Pretty much all of the revenue is subscription based. |
| **Traffic / users** | Total downloads are around 5.2 million at the moment; monthly active users are around 400,000. |
| **Engagement** | Around 75,000 ratings so far. |
| **Tech stack** | Zamarind; .NET; Swift; Flutter; Laravel PHP; Adobe Creative Suite; After Effects; Lottie; Appfigures; Mixpanel; Cloudflare; ChatGPT; machine learning; third-party mapping APIs |
| **Tech stack — removed** (not found in transcript) | RevenueCat |
| **Marketing channels** | App Store optimization; Apple Search Ads; Apple App Store search; localized App Store listings; in-app rating requests |
| **Marketing tactics** | John used location-specific keywords in app titles, metadata, and keyword lists; created location-specific screenshots; added localizations such as Mexican Spanish; tested keywords with Apple Search Ads and researched App Store autocomplete suggestions; asked for ratings after positive live-tracking moments; and tested pay walls, onboarding, and other app experiences through A/B testing. |
| **Pricing model** | Subscriptions with premium features, including a 7-day free trial for a yearly plan, a weekly plan, a lifetime plan, and a reverse trial that starts when a user closes the pay wall. |
| **Customer count** | — |
| **Growth metrics** | The app has been downloaded just over 5 million times since 2017.; Around 5.2 million total downloads at the moment.; Around 400,000 monthly active users.; Around 75,000 ratings.; The app covers over 160 cities.; Ad revenue was making around $8,000 a month before the pandemic.; A new subscription-focused update was released in August 2020.; Over two or three months and about 10 experiments, the conversion rate increased from 0.5% to 8%.; Revenue grew from around $8K a month to over $30,000.; Cloudflare costs around $90 a month.; ChatGPT costs around $20 a month.; About 20 dedicated servers cost around $2,500 a month.; Third-party APIs such as mapping cost $1,000 a month. |
| **Notable quotes** | I had a problem I needed to solve, so I built it.; For any developer, any idea you have has to be something that you a problem that you yourself have and if it works for you, there's a good chance it'll work for lots of other people.; You need to solve a problem that you have because when you're working nights and weekends, you're hitting walls all the time. |
| **Other notable facts** | John built Mumigo solo with no previous developer experience.; He started his career in graphic design and later taught himself development concepts including JavaScript, backend systems, and databases.; The initial idea came from working for a bus company in Edinburgh and wanting to see buses on a map while waiting at a stop.; The first app versions were built in Zamarind using .NET; he later rebuilt it in Swift for iOS and Flutter.; Server-side machine learning monitors journeys for delays and missed connections, then sends notifications and alternative routes.; John said event-based analytics was a major unlock, while relying on vanity metrics such as monthly active users did not move the needle. |

### 99. I made $1M flipping apps

| Field | Value |
|---|---|
| **Published** | 2025-10-21 |
| **Business** | softgen.ai |
| **Description** | AI app for coding apps |
| **Category** | AI Wrapper |
| **Vertical** | Developer Tools |
| **MRR (normalised)** | — |
| **MRR basis** | The founder reported a current recurring revenue run-rate of half a million dollars, but did not state that it is monthl |
| **Website** | https://cortex.ai |
| **Domains mentioned** | cortex.ai |
| **Founder** | Dom |
| **Type** | AI app for coding apps |
| **Revenue** | half million RR · recurring revenue (as of after 3 months) — Grew from 20K R to half million RR in 3 months; sold for nearly a three times multiple of RR. |
| **Revenue — amount** | half million RR |
| **Revenue — period** | — |
| **Revenue — metric** | recurring revenue |
| **Revenue — as of** | after 3 months |
| **Revenue — notes** | Grew from 20K R to half million RR in 3 months; sold for nearly a three times multiple of RR. |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Bubble; Store; Mailtrap; Futurebase; Hunter.io; Make UGC.ai; Hatio.com; Stripe; Creator.io; Leit.co; Suna.o; yep.so; Excel |
| **Tech stack — removed** (not found in transcript) | TinyAds.com |
| **Marketing channels** | X; email; Reddit; influencer marketing; smart advertising campaigns |
| **Marketing tactics** | Building in public, distributing landing pages, collecting emails from interested users, and running outreach campaigns. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | Grew from 20K R to half million RR in 3 months; Sold softgen.ai after 3 months; Sold seven different apps; Exited one app for over seven figures; Built and sold six Microsoft projects while working a full-time job; Launched a new app every 30 days; Starter Story Build: ship a project to the real world in just a few days |
| **Notable quotes** | The secret to building a successful app is to ship fast.; My advice here is the most important thing today, adapt yourself to different situations and even change perspective if necessary.; Everything started from X; all the projects were based on trends. |
| **Other notable facts** | Between 2017 and 2019, Dom tried to launch different projects and small startups while enrolled at university studying economics.; In 2019, he launched his first physical business in the micromobility field with co-founder BOP.; His validation process used a single landing page with a target landing-page conversion rate of 15%.; His product-building process was a loop of build, feedback, edit, rebuild, and feedback.; He worked on projects while employed full-time using 25-minute focused intervals with the Pomodoro technique.; Cortex.ai is focused on migrating work from human to AI and automating up to 80% of manual, mundane, and ordinary tasks. |

### 100. I Found a Business for Sale and Rebuilt It Into $20K/Month

| Field | Value |
|---|---|
| **Published** | 2025-10-19 |
| **Business** | Scrape Creators |
| **Description** | Web scraping SaaS API |
| **Category** | Developer Tool / API |
| **Vertical** | Data & Scraping |
| **MRR (normalised)** | $20,000 |
| **MRR basis** | Founder explicitly stated monthly revenue is about $20,000 a month. |
| **Website** | — |
| **Founder** | Adrian |
| **Type** | Web scraping SaaS API |
| **Revenue** | $20,000 a month · monthly · revenue — Monthly revenue is about 20,000 a month; profit margin is about 80%. |
| **Revenue — amount** | $20,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Monthly revenue is about 20,000 a month; profit margin is about 80%. |
| **Traffic / users** | 600 people have paid; almost 20 million API requests a month |
| **Engagement** | — |
| **Tech stack** | Node.js; JavaScript; impit; ampify; Evomi; Core Residential; Webshare; Massive; Render.com; AWS Lambda; Cursor; Supabase; Astro; React; Notion |
| **Marketing channels** | Twitter; SEO; LinkedIn; YouTube; podcasts |
| **Marketing tactics** | He built audience awareness on Twitter, contacted users there, commented on launch videos for scraping and social-media products while offering 10K free credits, and reverse-engineered the original app's customer-acquisition strategy. |
| **Pricing model** | Credit-based pay-as-you-go with no subscription: $10 for 5,000 credits, $50 for 25,000 credits, and 500,000 credits for $500. |
| **Customer count** | 600 people have paid but aren't necessarily paying regularly; maybe 12 customers pay for the majority of the MRR |
| **Growth metrics** | Almost 20 million API requests a month; Original app he copied was doing $30,000 monthly recurring; Original app had been operating for 3 years and had less than 100 customers; First customer arrived a few weeks after launch; Profit margin is about 80%; About $1,500 a month is spent on proxies; A developer in the Philippines costs about $500; Server costs are about $400; Cursor costs $20 a month |
| **Notable quotes** | You don't have to come up with something new, you can copy a successful app.; I had no confidence myself that a scraping API could make that much money.; Stop bouncing around ideas and just pick one thing. Do it every single day. |
| **Other notable facts** | Adrian discovered the app for sale after a follower sent him a direct message on Twitter.; He rebuilt the web-scraping API concept rather than buying the listed app.; The API scrapes public data from Instagram, YouTube, Twitter, and ad libraries including Facebook and LinkedIn.; The product handles infrastructure and proxy rotation for developers.; The initial product was hosted on Render.com, documented in a Notion doc, and launched with a basic website.; Adrian previously attended App Academy, worked as an engineer for 3 years, and quit with $30,000 in savings. |

### 101. I rebuilt a $1B app and now make $14K/month

| Field | Value |
|---|---|
| **Published** | 2025-10-16 |
| **Business** | Yaphone |
| **Description** | Browser-based pay-as-you-go international calling service with B2C and B2B plans |
| **Category** | SaaS / Web App |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | $14,000 |
| **MRR basis** | The founder explicitly stated current revenue as $14,000 a month and identified the metric as MRR; earlier monthly figur |
| **Website** | — |
| **Founder** | Dennis |
| **Type** | Browser-based pay-as-you-go international calling service with B2C and B2B plans |
| **Revenue** | $14,000 a month · monthly · MRR (as of 7 months after launch) — The app made $4,000 in its first month, $10,800 in months two and three, and $13,300 in its sixth month. |
| **Revenue — amount** | $14,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | 7 months after launch |
| **Revenue — notes** | The app made $4,000 in its first month, $10,800 in months two and three, and $13,300 in its sixth month. |
| **Traffic / users** | More than 10,000 registered users in 7 months; users made 27,000 calls in September. |
| **Engagement** | — |
| **Tech stack** | React; JavaScript; HTML; CSS; Next.js; Cursor; Vercel; Ahrefs; Stripe; Twilio; Voice over IP technology |
| **Marketing channels** | Reddit; X; LinkedIn; SEO; email; blog posts |
| **Marketing tactics** | Launched primarily on Reddit with screenshots of the core functionality and a short product description, first targeting traveler subreddits and then regularly posting in entrepreneur subreddits. He also posted on X and LinkedIn, contacted authors of ranking blog posts by X, LinkedIn, or email to request mentions, and advised starting SEO from day one. |
| **Pricing model** | Pay-as-you-go international calling using purchased credits. Individual users buy credits, while businesses purchase credits for a central balance shared by organization members and can top up when credits run out. Competitors typically use subscriptions costing $30 a month or more or per-seat business subscriptions. |
| **Customer count** | 4,500 paying individual customers and 20 enterprise clients. |
| **Growth metrics** | Launched in March 2025; Reached zero to more than 10,000 registered users in under 7 months; Reached 150 users in the first week; Built the prototype in one weekend; Generated first sales within minutes of the first Reddit post; One enterprise customer pays around $1,000 each month |
| **Notable quotes** | I built Yaphone. It makes $14,000 a month.; I built a quick prototype over the weekend. I launched it on Reddit and X and got my first sales in minutes.; Enterprise has bigger checks and much lower churn. |
| **Other notable facts** | Dennis is a trained diplomat and self-taught developer.; He taught himself how to code in two months, mainly through books and courses.; The app uses Voice over IP technology to make calls to mobile or London numbers for cents.; A 10-minute international call can cost between $50 and $100 depending on the country and provider.; Dennis texted every paying customer for 6 months to request feedback.; Twilio handles calls and costs Dennis around 35% of his monthly earnings. |

### 102. Teen From Kazakhstan Makes $1M/Year Online

| Field | Value |
|---|---|
| **Published** | 2025-10-14 |
| **Business** | Silicon Valley design agency |
| **Description** | Design agency |
| **Category** | Agency / Service |
| **Vertical** | Design & Media |
| **MRR (normalised)** | $80,000 |
| **MRR basis** | The most recent stated monthly revenue run-rate is $80,000 per month; the $100K figure was a forward projection. |
| **Website** | — |
| **Founder** | Mark |
| **Type** | Design agency |
| **Revenue** | $80,000 a month on average · monthly · revenue (as of 10 months after opening the agency) — Started at $10K a month, then $20K, $40K, and $80K; the next month they were looking to break $100K. |
| **Revenue — amount** | $80,000 a month on average |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | 10 months after opening the agency |
| **Revenue — notes** | Started at $10K a month, then $20K, $40K, and $80K; the next month they were looking to break $100K. |
| **Traffic / users** | More than 25 million views throughout this year on X |
| **Engagement** | — |
| **Tech stack** | Figma; Blender; After Effects; Cinema 4D; Slack; Notion; X; Mobbin; TweetHunter |
| **Marketing channels** | X; giveaways; cold DMs |
| **Marketing tactics** | He posted free redesigns of big brands, left around 50 comments a day on other designers' posts, ran giveaways requiring followers, comments, and reposts, studied viral content to replicate it, tested many content ideas, and created high-quality work for trending brands. |
| **Pricing model** | One-off projects and monthly retainers; the average retainer price was about 20 K a month. |
| **Customer count** | An average of six to seven clients a month |
| **Growth metrics** | Built the business in 10 months; Scaled the team to 20 people; Revenue doubled every two months; Grew from 500 followers to 5 K followers in a couple of months using about three giveaways; A free Wolf redesign received around 110 K views and generated around 10 to 12 cold bookings overnight; An acquisition.com homepage redesign generated around 15 to 16 cold bookings overnight; Had 25 K followers on X; Opened his X account in January 2024 and opened the agency in November 2024 |
| **Notable quotes** | We make 80 K revenue a month on average.; So, on average I think we get like between six to seven clients a month.; People usually underestimate the amount of work you actually need to put in. |
| **Other notable facts** | Mark is 19 years old and from Kazakhstan.; The agency offers websites, launch videos, and Times Square billboards.; Named clients include Bolt, Primer, Wolf, and Contra.; The agency focuses on helping clients get noticed and making work go viral rather than focusing on landing-page conversions.; Mark opened the agency in November 2024.; The team communicates through Slack and uses Notion. |

### 103. I built a $100K/month AI app

| Field | Value |
|---|---|
| **Published** | 2025-10-11 |
| **Business** | Magi |
| **Description** | AI SaaS platform |
| **Category** | AI Wrapper |
| **Vertical** | AI & Automation (horizontal) |
| **MRR (normalised)** | $100,000 |
| **MRR basis** | The most recent monthly run-rate stated is "over $100,000 a month," represented by the $100,000 threshold. |
| **Website** | — |
| **Founder** | Dustin |
| **Type** | AI SaaS platform |
| **Revenue** | almost $100,000 a month · monthly · revenue — The founder also said Magi had done well over a million dollars in revenue and was making over $100,000 a month. |
| **Revenue — amount** | almost $100,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The founder also said Magi had done well over a million dollars in revenue and was making over $100,000 a month. |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Bubble; Stripe; ConvertKit; OpenRouter; file.ai; OpenAI; Google Analytics; Ahrefs; GPT-5; Claude; Dolly; Flux; GPT Image; Ideogram |
| **Marketing channels** | email; affiliates; personal blog; building in public |
| **Marketing tactics** | Built a personal brand over 10 years, maintained a personal blog with over 100,000 email subscribers, built in public, and launched an affiliate program paying recurring commissions. He did no advertising or other real marketing. |
| **Pricing model** | Strictly paid subscription with no freemium: a $20 a month solo plan, a $40 a month team plan for up to five users, additional usage available, and additional team members at $20 per team member per month. |
| **Customer count** | — |
| **Growth metrics** | First customers on the first day Magi was released; Built the MVP in 8 weeks; $3,000 in the first month; $4,000 in the second month; $10,000 a month by the third month; $30,000 a month in revenue after one full year; Grew from zero to $100,000 a month in revenue; Personal blog accumulated over 100,000 email subscribers over 10 years; Well over a million dollars in revenue 2 and 1/2 years later |
| **Notable quotes** | People are going to need like five or six different subscriptions just to get the best of the best AI things.; What if I could solve that one problem for them?; People rejected the products, they didn't reject you. |
| **Other notable facts** | Dustin had no money and no coding experience when he began building Magi.; He previously started a WordPress plugin company with partners and exited it.; Magi provides access to multiple AI models through one subscription and dashboard.; Magi offers large language, image, video, and audio models.; Dustin used direct API connections for some models, including a highest-tier OpenAI connection.; The founder stated that Magi's first day of release brought its first customers. |

### 104. My app failed, then I changed one thing, and made $80K

| Field | Value |
|---|---|
| **Published** | 2025-10-08 |
| **Business** | Canvas Mode |
| **Description** | Canvas-first desktop app for interacting with AI models |
| **Category** | AI Wrapper |
| **Vertical** | AI & Automation (horizontal) |
| **MRR (normalised)** | — |
| **MRR basis** | $80,000 is gross revenue over the last 6 months, not a stated recurring monthly run-rate; the $75,000 profit figure does |
| **Website** | — |
| **Founder** | Praneeth |
| **Type** | Canvas-first desktop app for interacting with AI models |
| **Revenue** | $80,000 · last 6 months · gross revenue — Approximately $75,000 in profit before refunds |
| **Revenue — amount** | $80,000 |
| **Revenue — period** | last 6 months |
| **Revenue — metric** | gross revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Approximately $75,000 in profit before refunds |
| **Traffic / users** | About 38,000 unique site visitors; about 1,200 paying users |
| **Engagement** | Approximately 60% of paying users bought lifetime access and 40% bought one-time access with renewal after a year for more updates |
| **Tech stack** | Cursor; Next.js; Electron; React; TypeScript; Cloudflare; Vercel AI SDK; Stripe |
| **Marketing channels** | Twitter; Website landing page |
| **Marketing tactics** | Tailored the landing page copy to power AI users, called them out in the H1 and elsewhere on the website, and engaged on Twitter with conversations related to AI interactions and the new age of AI while hinting at the product. |
| **Pricing model** | One-time purchase with lifetime access and a one-year renewal option for updates; pricing started at $29, increased to $49 after crossing 100 users, and was planned to move to a recurring model. |
| **Customer count** | About 1,200 paying users |
| **Growth metrics** | Made $80,000 in the last 6 months after changing the pricing model; Started pricing at $29 when under 100 users; Raised the lifetime price to $49 after crossing 100 users; Reached about 1,200 users; About 38,000 unique site visitors to date; Landing page hosting costs about $50 a month; Cursor subscription costs about $200 a month |
| **Notable quotes** | I think every bootstrap business should do an LTD model.; The way I've done that for Rabbit Holes is that the pricing of the actual product actually started with something really small.; Your goal is to find product market fit as soon as possible and your goal is to build something that makes people's lives better. |
| **Other notable facts** | Canvas Mode was formerly known as Rabbit Holes AI.; Praneeth quit his $250,000 job to build his own apps.; The first version launched as a web app with a free trial and subscription or freemium model but did not gain traction.; The product uses a bring-your-own-keys model, so users pay for their own AI usage.; The desktop app runs on users' computers to avoid server costs.; The app is intended for power AI users who want to branch conversations into new nodes. |

### 105. I Built a $1M SaaS Using YouTube

| Field | Value |
|---|---|
| **Published** | 2025-10-04 |
| **Business** | Arvo |
| **Description** | SaaS AI SEO tool for marketing agencies and business owners |
| **Category** | AI Wrapper |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | $70,000 |
| **MRR basis** | Stated directly as around $70K in MRR, describing the current monthly run-rate. |
| **Website** | https://arvogar.com |
| **Domains mentioned** | arvogar.com |
| **Founder** | Vasco |
| **Type** | SaaS AI SEO tool for marketing agencies and business owners |
| **Revenue** | $70,000 · monthly · MRR — Grew from zero to around 70K in MR fully organic |
| **Revenue — amount** | $70,000 |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | — |
| **Revenue — notes** | Grew from zero to around 70K in MR fully organic |
| **Traffic / users** | One YouTube video received 1.2 million impressions and around 300 views every single day; 65% of traffic comes from YouTube search and 20% from Google search |
| **Engagement** | — |
| **Tech stack** | Loom; Myro; Camtasia; Sure SM7B |
| **Marketing channels** | YouTube; YouTube Infeed Ads; Upwork; Fiverr |
| **Marketing tactics** | Produced long-form YouTube videos in three categories: evergreen content, news-relevant videos, and viral-style software videos. Created multiple YouTube channels and hired creators through Upwork, paying people per performance and per video. Used Portuguese and Spanish creators to expand into other languages. Repurposed videos that had generated views and sales but stagnated into YouTube Infeed Ads. Tracked YouTube traffic with dedicated UTM parameters, video-specific coupon codes, and a welcome questionnaire asking visitors to select their YouTube creator source. Moved calls to action to th… |
| **Pricing model** | Monthly SaaS subscriptions starting at around $99 a month and going up to almost $700 a month |
| **Customer count** | Around 600 paying clients |
| **Growth metrics** | Scaled from zero to around 70K in MR fully organic; One video received 1.2 million impressions and around 300 views every single day; 65% of traffic comes from YouTube search; 20% of traffic comes from Google search; The founder recorded 20- to 30-minute videos every single day for almost a year; Arvo has existed for about 2 years |
| **Notable quotes** | Most our users come from YouTube.; The way in which you get people to buy from you is if they know, like, and trust you.; There are no shortcuts. I believe that. |
| **Other notable facts** | Vasco previously built an SEO marketplace called Vetted and sold it last year.; Arvo was developed after the sale of Vetted as an AI application to the SEO market.; The company uses multiple owned YouTube channels, including Vasco SEO Tips, Tim SEO Guru, and SEO News.; The founder began doing rank-and-rent SEO in 2015 or 2016 after seeing an Alex Becker video.; The founder says most people do not need polished videos to generate results.; The business was described as doing basically a million dollars a year. |

### 106. My two apps made $30M

| Field | Value |
|---|---|
| **Published** | 2025-10-01 |
| **Business** | Uplead (also referred to as Uple) and Signafy (also referred to as Signaturely) |
| **Description** | Uplead is a B2B data provider with real-time verified emails, mobile numbers, and buyer intent signals; Signafy is an… |
| **Category** | Portfolio of Products |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | — |
| **MRR basis** | The $30M and $1.5M figures are cumulative sales, not stated over a period. The $1M ARR milestone is historical and not i |
| **Website** | — |
| **Founder** | Will Cannon |
| **Type** | Uplead is a B2B data provider with real-time verified emails, mobile numbers, and buyer intent signals; Signafy is an e-signature company and an easy-to-use alternative to DocuSign. |
| **Revenue** | Uplead has done over $30 million in sales; Signafy has done over $1.5 million in sales · total sales — Uplead reached its first $1 million in annual recurring revenue strictly from cold email. |
| **Revenue — amount** | Uplead has done over $30 million in sales; Signafy has done over $1.5 million in sales |
| **Revenue — period** | — |
| **Revenue — metric** | total sales |
| **Revenue — as of** | — |
| **Revenue — notes** | Uplead reached its first $1 million in annual recurring revenue strictly from cold email. |
| **Traffic / users** | Uplead has over 100,000 visits to its website every month. Signafy has over 1.6 million users and gets over 800,000 visits per month. |
| **Engagement** | — |
| **Tech stack** | — |
| **Marketing channels** | cold email; cold calling; SEO; ads; free online signature tool; templates and contracts; LinkedIn |
| **Marketing tactics** | Uplead used cold email with the subject line "Hi, first name," a neutral, direct intro referencing the prospect's LinkedIn profile, a clear value proposition framed against ZoomInfo, and a free-trial ask. Signafy used SEO, including a free online signature tool for typing or handdrawing and downloading a signature, plus marketing, construction, and landlord agreement templates, to get its first thousand-plus customers. Will Cannon said these skills were acquired by reading books and watching YouTube videos. |
| **Pricing model** | — |
| **Customer count** | Uplead has over $4,000 customers. Signafy got its first thousand-plus customers through templates and contracts and grew mainly through SEO to over 1.6 million users. |
| **Growth metrics** | over $30 million in sales for Uplead; over $1.5 million in sales for Signafy; over 4,000 Uplead customers; over 1.6 million Signafy users; over 100,000 monthly website visits for Uplead; over 800,000 monthly website visits for Signafy; first $1 million in ARR for Uplead came strictly from cold email; Will Cannon failed at probably over 20 different businesses before having two successful businesses; vendor data was around 50 to 60% accurate and scraped internet data was maybe 40 to 50% accurate; Will Cannon and his wife started their first mortgage company at age 19 in 2005, 2006, 2007, and sold lead lists from 2007ish to 2017; Signafy was founded in 2020 |
| **Notable quotes** | The playbooks are already out there. Most people just don't study them.; I did it all without reinventing the wheel. I took business models that already had product market fit and I added my own little twist to them.; You don't need long emails. You need short ones that feel human. |
| **Other notable facts** | Will Cannon lost everything after the 2008 real estate crash and had to start over.; Before founding Uplead, he ran an agency selling loan officer and real estate agent lists for about 10 years.; Uplead's customers could enter an ICP, download or export lists, and verify emails and phone numbers in real time.; Signafy was inspired by DocuSign's complicated product, with the goal of building a simple version a grandmother could use.; Will Cannon's framework: find markets with product market fit, find a unique twist by reading one- and two-star reviews, acquire customers profitably, and execute.; Will Cannon recommended a super simple CRM, payroll software for small businesses, and a website analytics tool as opportunities to build in 2025. |

### 107. How We Built a $10K/mo SaaS

| Field | Value |
|---|---|
| **Published** | 2025-09-27 |
| **Business** | Setter AI |
| **Description** | AI appointment setter and high-ticket agentic B2B SaaS |
| **Category** | AI Wrapper |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | $10,000 |
| **MRR basis** | The founder stated the business had reached around $10K MRR, with revenue of 10K last month; the most recent monthly run |
| **Website** | — |
| **Founder** | Joseph and Teemo |
| **Type** | AI appointment setter and high-ticket agentic B2B SaaS |
| **Revenue** | 10K last month · monthly · MRR (as of August) — August is described as a slow month in B2B, and the business had reached around 10K MR. |
| **Revenue — amount** | 10K last month |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | August |
| **Revenue — notes** | August is described as a slow month in B2B, and the business had reached around 10K MR. |
| **Traffic / users** | around 2,000 total signups of businesses |
| **Engagement** | Lower churn among higher-paying businesses |
| **Tech stack** | Ahrefs; AnswerThePublic; Zapier; Beehiiv; Calendly; Webflow; businessnumber.com; TypeScript; SvelteKit; Render; Supabase; Puppeteer; OpenAI; Brandfetch API; Plausible; Netlify; Cursor; Stripe |
| **Tech stack — removed** (not found in transcript) | PostgreSQL; ElevenLabs |
| **Marketing channels** | SEO; Content marketing; Free tools; Comparison articles; YouTube; Google Search Console |
| **Marketing tactics** | The founders validated the product with a fake landing page and demo, requested immediate Google indexing, used a Calendly link to close sales calls, and offered a 100% refundable deposit before building. After launch, they focused on inbound SEO and content, including free tools, comparison articles, and long-form YouTube videos. |
| **Pricing model** | Subscription pricing starting at around $50 per month, with some customers paying over $500 and the largest paying up to $5,000 per month |
| **Customer count** | 38 paying customers |
| **Growth metrics** | $500 in revenue before writing a single line of code; First Stripe payment of $500 in February 2024; Ranked on page one of Google within one week of launching the actual website; Now ranks number one worldwide for the target keyword; Around 2,000 total business signups; 38 paying customers; 600 YouTube subscribers; Applied to YC five times, received one interview, and had not been selected; Built the business in just over a year |
| **Notable quotes** | The only way to validate is when buyers swipe their credit card.; We basically went purely inbound.; Most of the customers we closed came through watching at least one YouTube video before jumping on a call. |
| **Other notable facts** | The founders primarily target the solar industry, coaches, and financial services.; They use a serverless hosting and database stack costing around $150 per month.; The highest monthly technology cost is the OpenAI API at around $250 per month.; Upwork freelancers can add up to $500 per month.; Margins are over 90% without ads and around 80% with ads and freelancers.; They received acquisition offers that they were considering. |

### 108. This app replaced my 9-5 ($150K/year)

| Field | Value |
|---|---|
| **Published** | 2025-09-24 |
| **Business** | Wishlist |
| **Description** | Cross-platform wish list app |
| **Category** | Mobile App |
| **Vertical** | E-commerce & Retail |
| **MRR (normalised)** | $12,500 |
| **MRR basis** | Annual revenue of $150,000 divided by 12 gives a current monthly run-rate of $12,500. |
| **Website** | — |
| **Founder** | Chris |
| **Type** | Cross-platform wish list app |
| **Revenue** | $150,000 a year · annual · revenue — Monthly revenue averaged around 6K in the low season; values can be multiplied by five during the high season. |
| **Revenue — amount** | $150,000 a year |
| **Revenue — period** | annual |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Monthly revenue averaged around 6K in the low season; values can be multiplied by five during the high season. |
| **Traffic / users** | 1.1 million registered users and 110k monthly active users |
| **Engagement** | — |
| **Tech stack** | Flutter; Cursor; ChatGPT; Firebase; OneLink; Stripe |
| **Tech stack — removed** (not found in transcript) | RevenueCat |
| **Marketing channels** | App Store reviews; In-app review prompts; Support emails; Affiliate links |
| **Marketing tactics** | Chris asked friends and family for reviews, prompted for in-app reviews after users added or fulfilled a wish, and followed up with users by email after shipping requested features or fixing individual users' issues. |
| **Pricing model** | In-app purchases and premium membership, including a paywall for features such as custom wish list images, plus affiliate commissions from product links. |
| **Customer count** | Around 4K paying customers |
| **Growth metrics** | Hit 100k registered users at the end-of-October launch of Wishlist 2.0; Currently has 1.1 million registered users; Currently has around 4K paying customers; Currently has 110k monthly active users; Started building the app in 2019; Released the first version in 2020; Relaunched as Wishlist 2.0 at the end of October; Quit his full-time job in July 2025; Built the app for six years; Worked on it for three years while in university and two and a half years while employed full-time; Negotiated a four-day workweek at the start of 2025; Reported a 99% margin |
| **Notable quotes** | Start small.; Users first monetization later.; Do not over complicate things. |
| **Other notable facts** | Built without a team, funding, or standard marketing.; Used an Excel sheet for his own wish list before creating the app.; The app allows users to create wish lists, add notes, adjust visibility, add wishes, and share lists with family.; Launched the first version in 2020 and Wishlist 2.0 at the end of October.; His full-time app developer job in 2021 helped him learn and improve the side project.; Chris's typical schedule included an hour of support and analytics in the morning and development from 8 PM to 11 PM. |

### 109. The $1M Mobile App Playbook

| Field | Value |
|---|---|
| **Published** | 2025-09-20 |
| **Business** | PuffCount |
| **Description** | quit vaping mobile app |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $44,000 |
| **MRR basis** | The founder explicitly stated $44,000 in monthly recurring revenue (MRR). |
| **Website** | — |
| **Founder** | Steven |
| **Type** | quit vaping mobile app |
| **Revenue** | $44,000 in monthly recurring revenue · monthly · MRR (as of before exiting the business) — The company was subsequently sold to a larger mobile app studio in Europe. |
| **Revenue — amount** | $44,000 in monthly recurring revenue |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | before exiting the business |
| **Revenue — notes** | The company was subsequently sold to a larger mobile app studio in Europe. |
| **Traffic / users** | 120,000 followers; over 50 million views; hundreds of thousands of app store installs |
| **Engagement** | — |
| **Tech stack** | TikTok Ads; Meta Ads; Adjust; AppsFlyer; Superwall; RevenueCat |
| **Marketing channels** | TikTok; Instagram Reels; YouTube Shorts; Twitter; Meta Ads; TikTok Ads |
| **Marketing tactics** | Research viral content in the niche, document hooks, storylines, and calls to action in a spreadsheet, create high-volume content based on the research, pin the highest-converting videos, recreate successful concepts, work with creators through Post, and scale proven organic videos with paid ads. |
| **Pricing model** | — |
| **Customer count** | hundreds of thousands of app store installs |
| **Growth metrics** | Scaled from $3K to $44,000 in monthly recurring revenue; Grew the PuffCount TikTok account to 120,000 followers; Generated over 50 million views; Generated hundreds of thousands of app store installs for $0 through organic content; Spent $82,000 on paid ads before exiting; Customer acquisition cost was around $20 to $24; Lifetime value was $55 to upwards of $70 per conversion; One organic video received 5 million views; One video received 11.6 million views and close to a million likes; Post creator with 552,000 followers charged $110 and generated 30,000 views; Post creator with 2.7 million followers charged $110 per video; Post creator with 768 followers generated 53,000 views |
| **Notable quotes** | Marketing should always come first.; Volume negates luck.; Everything is a funnel. |
| **Other notable facts** | Steven described himself as a solopreneur who bootstraps his products.; PuffCount was sold to a larger mobile app studio in Europe.; Steven's three-phase framework consists of market research, consistent organic posting, and scaling winning content with paid ads.; The recommended organic video structure is hook, problem, solution, or call to action.; TikTok provided cheaper traffic, while Meta provided higher-quality but more expensive traffic.; Post allows creators to submit videos to project briefs and lets the business owner approve content and negotiate creator prices. |

### 110. I Quit YouTube & Built a $1M App (Without My Audience)

| Field | Value |
|---|---|
| **Published** | 2025-09-17 |
| **Business** | Undisclosed SaaS business |
| **Description** | SaaS software business |
| **Category** | SaaS / Web App |
| **Vertical** | Other / Miscellaneous |
| **MRR (normalised)** | $250,000 |
| **MRR basis** | Founder explicitly stated $250K a month in recurring revenue, a direct monthly run-rate figure. |
| **Website** | — |
| **Founder** | Sebastian Georgu |
| **Type** | SaaS software business |
| **Revenue** | 250K a month in recurring revenue · monthly (as of June a couple months ago) — The business was also described as generating multi6 figures a month in recurring revenue and doing hundreds of thousands in revenue. |
| **Revenue — amount** | 250K a month in recurring revenue |
| **Revenue — period** | monthly |
| **Revenue — metric** | recurring revenue |
| **Revenue — as of** | June a couple months ago |
| **Revenue — notes** | The business was also described as generating multi6 figures a month in recurring revenue and doing hundreds of thousands in revenue. |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | — |
| **Marketing channels** | YouTube; short-form content; paid ads; affiliates; SEO; app store search |
| **Marketing tactics** | Share the product with people, improve it, listen to customers, have YouTube creators make videos, create short-form content from those videos, and use the videos in paid ads. These channels were combined into a flywheel and accounted for 60 to 65% of total traffic. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | Grew from zero to 250K in about 9 months; Reached 10K a month fairly organically; YouTube videos, short-form content, and paid ads account for 60 to 65% of total traffic; The Twitter Lamborghini clip received about 100 million impressions; The YouTube channel had nearly 1 million subscribers; The team has 10 plus people |
| **Notable quotes** | I really would like to build something that doesn't have my face attached to it.; Audience makes everything way easier.; The most successful people are just the most successful failures. |
| **Other notable facts** | Sebastian bought out his co-founder in January at 13 or 14K MR.; Sebastian and his co-founder were initially non-technical and later hired developers.; The team was described as lean, with the engineers being the best it had employed.; Discord communities used the product and helped support its initial growth.; SEO was ranking quite highly.; The app store brought traffic from people searching for tools. |

### 111. My app makes $41K/month

| Field | Value |
|---|---|
| **Published** | 2025-09-13 |
| **Business** | Weightley |
| **Description** | Wait list and reservations platform for businesses with waiting customers |
| **Category** | SaaS / Web App |
| **Vertical** | E-commerce & Retail |
| **MRR (normalised)** | $40,000 |
| **MRR basis** | The founder stated current recurring revenue is over $40,000 per month; the annual pace projection is not used. |
| **Website** | — |
| **Founder** | Joe |
| **Type** | Wait list and reservations platform for businesses with waiting customers |
| **Revenue** | over $40,000 a month · monthly · MRR — The business is described as a subscription business; this year is stated to be on pace to make over half a million. |
| **Revenue — amount** | over $40,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | — |
| **Revenue — notes** | The business is described as a subscription business; this year is stated to be on pace to make over half a million. |
| **Traffic / users** | Over 15,000 businesses tried Weightley; over 59 million parties have been waitlisted |
| **Engagement** | — |
| **Tech stack** | Google Firebase; Node.js; Swift; ReactJS; Revenue Cat; Apple Search Ads; Stripe; Survey Monkey; Hive; Claude Code; ChatGPT; Calendly |
| **Tech stack — removed** (not found in transcript) | Freshdesk |
| **Marketing channels** | Apple Search Ads; email |
| **Marketing tactics** | Run ads on certain keywords to drive app downloads, nurture customers with onboarding emails and quick-start videos, provide Zoom onboarding and employee training, and offer promotions near the end of trials to encourage a first purchase. |
| **Pricing model** | $100 per month flat fee to unlock all features; reservations booked through the platform incur cover fees |
| **Customer count** | 700 paying customers around the US and Canada |
| **Growth metrics** | 10 downloads within the first week; Year 1: made no money; Year 2: made 14,500; Year 3: made about 116,000; Year 4: made 186,000; Year 5: made 307,000; Year 6: made 354,000; Year 7: made $445,000; This year: on pace to make over half a million; Customer acquisition cost: about $130; Customer lifetime value: between $750 and $1,000; Weightley was put in over 700 locations around the United States during COVID, and that 10xed the business that year |
| **Notable quotes** | I shouldn't have to sign up for an account.; You don't need a new idea. There's plenty of ideas out there, problems that have been solved that you could improve upon.; Launch your product and see what the future holds. |
| **Other notable facts** | Joe launched Weightley as a side project after leaving hands-on coding work in engineering management.; The app launched with a free version; in-app purchases launched about two years later.; Weightley sends customers text messages with wait times and table-ready notifications without requiring them to download an app.; Firebase costs about $700 per month, business text messages about $2,500 per month, Apple Search Ads about $500 per month, Survey Monkey $35 per month, Hive about $25 per month, Freshdesk about $40 per month, Claude Code about $200 per month, ChatGPT about $20 per month, and Calendly about $12 per month.; Revenue Cat costs 1% of revenue, and Stripe charges 3% of revenue for website payments.; Joe said support calls are answered immediately. |

### 112. How I Made $65K in 3 Days

| Field | Value |
|---|---|
| **Published** | 2025-09-10 |
| **Business** | Supergrow |
| **Description** | SaaS that helps professionals build their personal brand on LinkedIn |
| **Category** | SaaS / Web App |
| **Vertical** | Creator & Social Media |
| **MRR (normalised)** | $19,167 |
| **MRR basis** | $230,000 annual revenue divided by 12; consistent with the stated monthly run-rate of more than $19,000. |
| **Website** | — |
| **Founder** | Din |
| **Type** | SaaS that helps professionals build their personal brand on LinkedIn |
| **Revenue** | $230,000 a year · annual · revenue (as of currently) — Also stated as making more than $19,000 per month; the lifetime deal generated $65,000 in 3 days |
| **Revenue — amount** | $230,000 a year |
| **Revenue — period** | annual |
| **Revenue — metric** | revenue |
| **Revenue — as of** | currently |
| **Revenue — notes** | Also stated as making more than $19,000 per month; the lifetime deal generated $65,000 in 3 days |
| **Traffic / users** | More than 15,000 visits every month on the landing page |
| **Engagement** | Only around 10% of lifetime-deal customers use the product after a certain period, with around 20 to 25 customers genuinely using it every week |
| **Tech stack** | Rails; React; Tailwind; Supabase; Railway; Framer; Superguru; Intercom; Mixpanel; Stripe; Microsoft Clarity |
| **Tech stack — removed** (not found in transcript) | PostgreSQL |
| **Marketing channels** | Email; Instagram; Facebook; Twitter; LinkedIn; Product Hunt; WhatsApp groups; Affiliates |
| **Marketing tactics** | Rocket Up marketed Supergrow through emails to its customer list, Instagram and Facebook ads, and newly created screenshots and videos. The founders then focused on customer support, used Intercom to resolve questions and manually help customers create content, converted those workflows into product features, and launched on Product Hunt. Lifetime-deal customers also promoted Supergrow on LinkedIn, Twitter, Product Hunt, and WhatsApp groups. |
| **Pricing model** | Subscription plans with basic, pro, and agency tiers; the lifetime deal offered $79 basic, $199 pro, and $299 agency plans |
| **Customer count** | More than 800 recurring customers and more than 250 lifetime-deal customers |
| **Growth metrics** | $65,000 lifetime-deal revenue in 3 days; More than $19,000 in monthly revenue; More than 800 recurring customers; More than 15,000 monthly landing-page visits; More than 250 lifetime-deal customers; Around 20 to 25 lifetime-deal customers using the product every week; 300 lifetime-deal users supported; Product Hunt launch generated 50 customers; 10 to 15 lifetime-deal customers promoted the product; Marketing and affiliate spending of around $3,000; Design and product freelancer spending of more than $1,000; 60 to 70% profit margin; 600 Twitter followers and maybe 500 LinkedIn followers at launch; Only two or three customers at launch |
| **Notable quotes** | Lifetime deals are a cheat code.; Don't try to create new market just work on the validated market.; LTD exposes bad products really faster because these LTD customers are going to give very brutal feedback to you. |
| **Other notable facts** | Din created the first MVP over a weekend after finding that existing LinkedIn content-creation tools did not satisfy him.; The founders studied their three biggest competitors: Taplio, ContentIn, and AuthoredUp.; Rocket Up took 40% of the lifetime-deal revenue, which translated to around $40,000 for Supergrow.; The lifetime-deal launch was limited to 3 days and 300 supported users.; The founders spent one or two hours every day on Intercom answering lifetime-deal customers' questions for a couple of months.; Supergrow became Product Hunt's Product of the Week after its lifetime-deal launch. |

### 113. Our simple app made $100K in 90 days

| Field | Value |
|---|---|
| **Published** | 2025-09-06 |
| **Business** | Natural Right |
| **Description** | AI writing tool that humanizes generated text |
| **Category** | AI Wrapper |
| **Vertical** | Documents & Writing |
| **MRR (normalised)** | $27,000 |
| **MRR basis** | Most recent monthly revenue was $27K in the third month, so current MRR is $27,000. |
| **Website** | — |
| **Founder** | Nikita and Yini |
| **Type** | AI writing tool that humanizes generated text |
| **Revenue** | $100k · 3 months · revenue — First month: $41K; second month: $32K; third month: $27K |
| **Revenue — amount** | $100k |
| **Revenue — period** | 3 months |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | First month: $41K; second month: $32K; third month: $27K |
| **Traffic / users** | Around 9 million total TikTok views; around 300K total visits; 250K signups |
| **Engagement** | Around 80% conversion rate from visit to signup |
| **Tech stack** | NextJS; Postgress; Coolify; Next AI; Resend |
| **Marketing channels** | TikTok |
| **Marketing tactics** | The founders first hired influencers to make videos, but that generated some views and almost no conversions, so they created their own TikTok account and began filming themselves and posting every day. Their strategy was to research the niche, use TikTok Search and Creator Search Insights, warm up a new account by engaging with niche content for 30-50 minutes per day for three to five days, recreate viral niche videos one-to-one with captions, post one video daily, test original ideas after going viral, and scale by creating more accounts and hiring creators. |
| **Pricing model** | — |
| **Customer count** | 250K signups |
| **Growth metrics** | Zero to $100k in revenue in 3 months; $250,000 downloads in 3 months; Around 9 million TikTok views across all accounts; Around 300K total visits; 250K signups; Around 80% visit-to-signup conversion rate; One TikTok video reached 4 million views; A Yuini copy received 1.5 million views; the original had around 150K views; Server cost: $35 per month; Resend cost: $20 per month; VPN cost: $5 per month per five devices; US phone numbers: $5 per month per phone number |
| **Notable quotes** | Together we built an AI writing tool called natural right and in just 3 months we took this app from zero to $100k in revenue and we did it all from a single Tik Tok account.; You need to start your Tik Tok journey by yourself. Try find out what works and only then start thinking about delegate or hiring other people.; Skip inventing your own Tik Tok format and just replicate what's already going viral. |
| **Other notable facts** | Nikita is based in Serbia, and Yini is based in Poland.; The product was built and operated from their bedrooms in Europe.; The tool lets users submit generated text, click a humanize button, and receive text presented as 100% human-written.; The tool is popular among students in schools and universities and is also used by marketers in businesses.; The founders said the generated humanized text usually bypasses most AI detectors.; Alexander is the team's third member and handles all technical work. |

### 114. This app made over $1M

| Field | Value |
|---|---|
| **Published** | 2025-08-31 |
| **Business** | Rooted |
| **Description** | iPhone app for panic attack and anxiety relief |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | — |
| **MRR basis** | Only a cumulative lifetime total ('over a million in revenue since launching in 2019') was stated, with no monthly run-r |
| **Website** | — |
| **Founder** | Anya |
| **Type** | iPhone app for panic attack and anxiety relief |
| **Revenue** | over a million in revenue · since launching in 2019 — The interview also describes the app as having generated over a million dollars. |
| **Revenue — amount** | over a million in revenue |
| **Revenue — period** | since launching in 2019 |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The interview also describes the app as having generated over a million dollars. |
| **Traffic / users** | downloaded over 4 million times |
| **Engagement** | Rooted has maintained a 4.8 out of five rating; users are feeling better from a panic attack within under 2 minutes |
| **Tech stack** | Photoshop; Illustrator |
| **Marketing channels** | social media; press releases; LinkedIn; email; app store optimization; word of mouth; B2B partnerships; Cosmopolitan; Women's Health; Time magazine |
| **Marketing tactics** | Spent hours engaging on social media by writing helpful comments and leaving links to Rooted; sent organic cold pitches to mental-health journalists via LinkedIn or email; continuously optimized the app store presence by aligning product-page content with search terms users later used in reviews; released the app once every week; partnered with wellness organizations, therapy groups, and psychologist offices; answered online questions with relevant Rooted lessons rather than immediately promoting the app. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | Around 10,000 downloads in the first year; 100,000 downloads by year two; 1 million downloads in year three; Thousands of users use newly launched features within about a week; 4.8 out of five rating; Users feel better from a panic attack within under 2 minutes; Over 100 visualizations and sleep sounds; First prototype took a few months; Anya became a full-time founder about 2 and 1/2 to 3 years after Rooted launched |
| **Notable quotes** | If you're confident that other people are experiencing your problem, it's worth just launching an MVP to see if what you've created will help them.; Our focus on tracking user reviews and the quality of rooted over revenue has been a big factor as to why we've grown.; They will have the answers you need. They'll help you know what to focus on. |
| **Other notable facts** | Anya had no technical background or prior app-development experience.; She got the idea for Rooted after struggling to find resources during a panic attack in her fourth year of university.; The first MVP centered on an SOS panic-attack button, a simple breathing tool, and lessons about panic attacks and anxiety.; Anya put all her savings into developing the prototype.; Rooted received coverage in Cosmopolitan, Women's Health, and Time magazine.; Anya initially worked on Rooted three days a week while working another job four days a week. |

### 115. How I Built a $4M Business (Simple Strategy)

| Field | Value |
|---|---|
| **Published** | 2025-08-27 |
| **Business** | Alia |
| **Description** | SaaS pop-up tool for e-commerce brands |
| **Category** | SaaS / Web App |
| **Vertical** | E-commerce & Retail |
| **MRR (normalised)** | $333,333 |
| **MRR basis** | Current ARR of $4 million divided by 12 months. |
| **Website** | — |
| **Founder** | Sean |
| **Type** | SaaS pop-up tool for e-commerce brands |
| **Revenue** | 4 million ARR · annual (as of last year) — The company went from $0 in revenue to 4 million ARR after repositioning. |
| **Revenue — amount** | 4 million ARR |
| **Revenue — period** | annual |
| **Revenue — metric** | ARR |
| **Revenue — as of** | last year |
| **Revenue — notes** | The company went from $0 in revenue to 4 million ARR after repositioning. |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | — |
| **Marketing channels** | — |
| **Marketing tactics** | Sean repositioned Alia around pop-ups by changing the website copy, creating content focused on pop-ups, opening sales calls by stating that the company does pop-ups, and aligning internal language around pop-ups. |
| **Pricing model** | — |
| **Customer count** | about 1500 brands using Alia's pop-up tool |
| **Growth metrics** | Went from two customers to about 20 customers in about 6 months.; Grew from two customers to hundreds of customers in about a year.; Went from $0 in revenue to 4 million ARR in about a year.; Team of 12 people, including three co-founders.; Sales calls became shorter, were more succinct, and closed more often after repositioning.; Content about pop-ups performed better than previous content. |
| **Notable quotes** | We decided to go all in on that and we've chosen to do nothing else besides that one thing which is called pop-ups.; Pop-ups equals Alia. Alia equals pop-ups.; Do one thing and do that one thing phenomenally. |
| **Other notable facts** | Sean originally built Alia at his university for a fintech club.; Before focusing on pop-ups, Alia was positioned as a loyalty program and education tool.; Sean and his co-founders read the book Obviously Awesome to develop their positioning.; Named customers include Nike Strength and Tom's Shoes.; The company is bootstrapped.; Alia was described as a SAS tool. |

### 116. How I Finally Built a $10K/Month SaaS (30 Failures)

| Field | Value |
|---|---|
| **Published** | 2025-08-23 |
| **Business** | Unid |
| **Description** | Launch platform for tech products; originally a front-end tools directory |
| **Category** | Marketplace / Directory |
| **Vertical** | Developer Tools |
| **MRR (normalised)** | $10,000 |
| **MRR basis** | Most recent stated revenue is $10,000 per month; the $8,000–$10,000 range and $200 historical figure do not supersede it |
| **Website** | — |
| **Founder** | Thomas |
| **Type** | Launch platform for tech products; originally a front-end tools directory |
| **Revenue** | $10,000 · per month · revenue (as of last month) — Revenue is irregular and oscillates between $8,000 per month and $10,000; Unid's best month before its pivot was $200 per month. |
| **Revenue — amount** | $10,000 |
| **Revenue — period** | per month |
| **Revenue — metric** | revenue |
| **Revenue — as of** | last month |
| **Revenue — notes** | Revenue is irregular and oscillates between $8,000 per month and $10,000; Unid's best month before its pivot was $200 per month. |
| **Traffic / users** | 40,000 users; 30,000 unique visitors per month |
| **Engagement** | — |
| **Tech stack** | Supabase; Brevo; Hetzner; self-hosted analytics; Crisp; Buffer; Polar |
| **Tech stack — removed** (not found in transcript) | Next.js; Coolify |
| **Marketing channels** | Twitter; social media |
| **Marketing tactics** | Building in public and repeatedly posting about the product on social media to create momentum; using Thomas's Twitter account as a distribution channel. |
| **Pricing model** | Customers paid to skip the line or advertise their products. |
| **Customer count** | 2,000 customers |
| **Growth metrics** | Reached $10,000 in revenue last month; Revenue oscillates between $8,000 per month and $10,000; Reached 40,000 users; Reached 2,000 customers; 30,000 unique visitors per month; Redirected 10,000 people to listed websites last month; Generated 10,000 clicks on Product Hunt last month; Launched more than 30 projects that failed; Gum Affiliates made approximately $500; Abandoned Gum Affiliates after 2 years |
| **Notable quotes** | If you don't do any marketing, if you don't talk about it, no one will come to your website.; The better thing that make an idea a good one is that you know how to sell it.; You can think of it as a marathon, not a sprint. |
| **Other notable facts** | Unid began as a simple directory for front-end tools before pivoting to a launch platform.; The pivot initially caused revenue to fall, then revenue began growing step by step.; Thomas used the drama around Product Hunt's featured-product complaints to time Unid's launch.; Thomas built Frisbee with his girlfriend but never published it.; Other named projects included Gidley, Cidi, a Twitter feed, a bookmark manager, and a plans-management web app.; Thomas says a sustainable work routine and maintaining a personal life are important to long-term work. |

### 117. How We Built It: $900K Open Source SaaS

| Field | Value |
|---|---|
| **Published** | 2025-08-16 |
| **Business** | Papermark |
| **Description** | Open-source document analytics and sharing platform and data room provider |
| **Category** | SaaS / Web App |
| **Vertical** | Documents & Writing |
| **MRR (normalised)** | $75,000 |
| **MRR basis** | The founder explicitly stated current revenue of $75,000 MRR, already expressed as a monthly recurring run-rate. |
| **Website** | https://papermark.com |
| **Domains mentioned** | papermark.com; app.papermark.com |
| **Founder** | Mark and Julia |
| **Type** | Open-source document analytics and sharing platform and data room provider |
| **Revenue** | $75,000 MR · monthly · MRR (as of middle of the second year) — The founders said they were close to reaching their first million in revenue. |
| **Revenue — amount** | $75,000 MR |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | middle of the second year |
| **Revenue — notes** | The founders said they were close to reaching their first million in revenue. |
| **Traffic / users** | Around 30,000 users in the middle of the second year; 800,000 views on shared documents |
| **Engagement** | — |
| **Tech stack** | Next.js; TypeScript; Cursor; GitHub; Vercel; PlanetScale; Resend; Stripe |
| **Tech stack — removed** (not found in transcript) | PostgreSQL; Trigger.dev |
| **Marketing channels** | Twitter; LinkedIn; Hacktoberfest; open-source community |
| **Marketing tactics** | Built in public, shared work-in-progress on Twitter and LinkedIn, participated in the month-long Hacktoberfest hackathon, and used the open-source community to attract early users and contributors. |
| **Pricing model** | Open-core: self-hosted for free, a paid hosted version, and enterprise licenses for advanced features |
| **Customer count** | Around 2,000 customers |
| **Growth metrics** | $20,000 MR in the first year; $75,000 MR by the middle of the second year; Approximately 900,000 ARR; 60 contributors; 7,000 GitHub stars; Initial launch tweet received 100,000 views; Earlier tweet received 40,000 views within a couple of hours; Spent around 80% of costs on freelancers and founder salaries, 15% on marketing and growth experiments, and 5% to 6% on tools |
| **Notable quotes** | Papermark started as an open-source project on the side without the idea to actually go commercial.; You need to reach at least feature parity with the existing tools in the market and then you need to out-ship them.; Just do it open source from the beginning. |
| **Other notable facts** | Papermark is described as an open-source successor to DocSend.; The first usable MVP was built over a weekend and launched on Monday.; The core software is open source and self-hostable.; Customers can run advanced features on their own infrastructure with an enterprise license.; Papermark is run as two Next.js projects: one for the website and marketing content, and one for the open-source application.; The founders described the product as providing password protection, watermarking, and document-viewing analytics. |

### 118. How I Built It: $23K/month micro-saas

| Field | Value |
|---|---|
| **Published** | 2025-08-13 |
| **Business** | Data Fetcher |
| **Description** | SaaS business; an Airtable extension for connecting other platforms and scheduling data syncs through APIs |
| **Category** | Browser Extension / Add-on |
| **Vertical** | AI & Automation (horizontal) |
| **MRR (normalised)** | $23,000 |
| **MRR basis** | The founder stated recurring revenue of $23,000 per month, explicitly identified as current revenue and MRR. |
| **Website** | — |
| **Founder** | Andy Cloak |
| **Type** | SaaS business; an Airtable extension for connecting other platforms and scheduling data syncs through APIs |
| **Revenue** | $23,000 a month · monthly · recurring revenue (as of current) — The transcript also refers to current revenue and MRR. |
| **Revenue — amount** | $23,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | recurring revenue |
| **Revenue — as of** | current |
| **Revenue — notes** | The transcript also refers to current revenue and MRR. |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | TypeScript; React; Airtable's own extension SDK; GraphQL; Node; Next.js; Tailwind; shadcn; Heroku; Hetzner; Help Scout; Fastmail; Plausible; MailerLite; ChartMogul; Airtable; Claude |
| **Tech stack — removed** (not found in transcript) | PostgreSQL |
| **Marketing channels** | Airtable marketplace; Content marketing; Blog posts; YouTube |
| **Marketing tactics** | Andy published blog posts and created YouTube videos about popular integrations and use cases, while early marketplace placement generated qualified leads. |
| **Pricing model** | — |
| **Customer count** | 600 paying customers |
| **Growth metrics** | First customer after a few days; 1K MRR after a few months; 3K MRR after a year; 10K MRR after the first year; 20K MRR after 3 years; API Connector, a similar Google Sheets add-on, had like 100,000 users; Hosting costs $2,500 a month; SaaS tools cost about $1,000; Co-working costs $150; Total margin is 85%; Andy spent almost an entire year without speaking to users; The business has been operating for almost 5 years |
| **Notable quotes** | The biggest lesson has been the power of focus over chasing shiny objects.; Do proper user testing. Do it early and do it often.; Speak to the people that are using what you've built. |
| **Other notable facts** | Andy works on Data Fetcher as a solo founder and lives in London.; Before Data Fetcher, Andy built and sold a TikTok influencer directory that reached a few thousand dollars a month in MRR.; The Airtable marketplace provided a steady stream of qualified leads and platform approval gave users trust.; Data Fetcher supports use cases including marketing data and operational workflows.; Andy previously worked as a freelance React developer for startups.; Andy identifies platform risk as the main downside of building on Airtable. |

### 119. How I Used Reddit To Build a $25K/Month Business

| Field | Value |
|---|---|
| **Published** | 2025-08-09 |
| **Business** | Save Wise |
| **Description** | Platform that helps people earn credit card points and airline miles for purchases they are already making online |
| **Category** | SaaS / Web App |
| **Vertical** | Finance & Money |
| **MRR (normalised)** | $25,000 |
| **MRR basis** | The founder stated revenue of about $25,000 per month, so this is the current monthly run-rate. The lifetime-plan mix do |
| **Website** | — |
| **Founder** | Anish |
| **Type** | Platform that helps people earn credit card points and airline miles for purchases they are already making online |
| **Revenue** | about $25,000 a month · monthly · revenue — Approximately 97% of revenue comes from customers choosing the lifetime plan over a monthly or yearly subscription. |
| **Revenue — amount** | about $25,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Approximately 97% of revenue comes from customers choosing the lifetime plan over a monthly or yearly subscription. |
| **Traffic / users** | Tens of thousands of users; over 1,500 website visitors from one Rakuten Stacks Facebook group spreadsheet post |
| **Engagement** | Initial Product Hunt, Hacker News, and Indie Hackers traffic had a bounce rate of like 95 96%. |
| **Tech stack** | Next.js; Vercel; Azure; Retool; Clerk; Google; Apple; Vercel Analytics; Figma; PostHog; ChatGPT; GitHub Copilot; Cursor; Google Analytics |
| **Marketing channels** | Reddit; Facebook groups; Product Hunt; Hacker News; Indie Hackers; Influencer and creator outreach; Email; F5bot keyword alerts |
| **Marketing tactics** | Used a five-step playbook: brainstorm keywords, interests, and demographics; use Map of Reddit to discover related subreddits; observe each community without immediately promoting; define a goal for each post; participate in comments before top-level posts; set F5bot keyword alerts; and provide organic, helpful advice before mentioning the product. In one Facebook group, Anish posted a SQL-generated spreadsheet of Rakuten and American Express offers with a link to the website. On Reddit, he monitored a community for a few weeks, posted the website in weekly Q&A threads for about three and a h… |
| **Pricing model** | Initially a subscription, with Pro offered as a monthly, yearly, or lifetime membership; about 97% of revenue now comes from lifetime purchases. |
| **Customer count** | About 1,500 paying customers |
| **Growth metrics** | Built a $25,000 per month business in 15 months; Grew from thousands of users to tens of thousands of users; One Facebook group spreadsheet post generated over 1,500 website visits; Sent 300, 400 influencer and creator emails and messages and received one response; Spent about three and a half months participating in Reddit weekly Q&A threads before posting at the top level |
| **Notable quotes** | My name is Anish. I'm the founder of a product called Save Wise; I got none of the feedback that I was actually looking for.; Never forget about your target customer, who they are, because it'll guide you not just for what to build, but how to go and get that product into their hands. |
| **Other notable facts** | Anish previously worked at Microsoft, Instagram, Foursquare, and Dropbox.; The product originated from his own manual process of finding deals, stacking coupons and promo codes, and earning credit card points online.; Early Product Hunt, Hacker News, and Indie Hackers campaigns produced tons of traffic, but users largely did not stick.; One Facebook group contained thousands of people manually searching for offers that Save Wise could find with a single query.; The lifetime plan represented about 97% of revenue, with some customers willing to pay for more than two years of Pro membership upfront.; Anish used a SQL query to generate the Rakuten and American Express offer spreadsheet shared in the Facebook group. |

### 120. I Copied a $100M SaaS, Undercut Their Prices, and Hit $10K/Month

| Field | Value |
|---|---|
| **Published** | 2025-08-02 |
| **Business** | EUform |
| **Description** | SaaS form-building and data-collection platform positioned as an alternative to Typeform |
| **Category** | SaaS / Web App |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | $11,000 |
| **MRR basis** | The founder explicitly stated current revenue of around 11,000 MR, described as monthly recurring revenue (MRR). |
| **Website** | — |
| **Founder** | Abhishek |
| **Type** | SaaS form-building and data-collection platform positioned as an alternative to Typeform |
| **Revenue** | around 11,000 MR · monthly · MRR (as of currently) — The speaker also said EUform had grown to around 11,000 MR over the last 2 years. |
| **Revenue — amount** | around 11,000 MR |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | currently |
| **Revenue — notes** | The speaker also said EUform had grown to around 11,000 MR over the last 2 years. |
| **Traffic / users** | around 35,000 or so registered users; around 35,000 unique visitors per month |
| **Engagement** | recently crossed 4 million form submissions |
| **Tech stack** | Laravel; AWS; Cloudflare; Stripe; OpenAI; Slite; Gmail; Simple Analytics; Canny; Mailgun |
| **Marketing channels** | Twitter; Reddit; Typeform's own forum |
| **Marketing tactics** | The founder searched Twitter, Reddit, and Typeform's own forum for user pain points, then reached out to users with a basic landing page explaining the solution. EUform's landing page allowed users to paste a Typeform URL and generate a EUform within a few seconds. The founder also advised not neglecting marketing. |
| **Pricing model** | Freemium; 90% plus of features are free |
| **Customer count** | around 500 something paying customers |
| **Growth metrics** | launched in 2023; around 11,000 MR over the last 2 years; around 35,000 or so registered users; around 35,000 unique visitors per month; conversion rate around somewhere around 1.5 to less than 2%; recently crossed 4 million form submissions; initial MVP built in 2 weeks; current landing page created after reaching 200 plus users; previous SaaS, Bflow, had 200 users or so; last month expense was around less than $1,200 |
| **Notable quotes** | Finding the gap is something where you can take something which is already working.; In my opinion, the best approach to build a SAS is you should not invent things.; If you really want a SAS business to support your lifestyle, then I think you should first search for what people are looking for and then build it. |
| **Other notable facts** | The previous SaaS was a no-code chatbot builder called Bflow.; The initial EUform version supported fields such as name, email, and star rating and allowed data downloads as CSV.; The initial version had no fancy landing page, logo, Google Sheets integration, or other API integrations.; EUform is intended as an alternative to Typeform.; OpenAI is used for fraud detection because many users attempt to abuse the premium model.; The founder said the business was built by validating an existing market and addressing gaps competitors were not solving. |

### 121. My AI App Makes $100K/Month

| Field | Value |
|---|---|
| **Published** | 2025-07-30 |
| **Business** | Neuroframes |
| **Description** | AI music video generator |
| **Category** | AI Wrapper |
| **Vertical** | Design & Media |
| **MRR (normalised)** | $100,000 |
| **MRR basis** | Founder states ~$100,000 a month from ~1,500 customers, which is a current monthly run-rate (MRR) used as-is. |
| **Website** | — |
| **Founder** | Nico |
| **Type** | AI music video generator |
| **Revenue** | $100,000 · monthly · revenue (as of last month) — Around 1,500 customers bringing in $100,000 a month. |
| **Revenue — amount** | $100,000 |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | last month |
| **Revenue — notes** | Around 1,500 customers bringing in $100,000 a month. |
| **Traffic / users** | Around 100,000 monthly active users, described as visitors coming to the site |
| **Engagement** | — |
| **Tech stack** | Cursor; Python; Next.js; RunPod; FAL; PostHog; Slack; Linear; Notion; Ahrefs; Intercom; EmailOctopus; Telegram bot; ChatGPT |
| **Marketing channels** | Hacker News; SEO; Google; free tools; free landing pages; YouTube tutorials; indie hacker and solopreneur messaging; email newsletters |
| **Marketing tactics** | Posted on Hacker News, used SEO early, created dedicated landing pages and free tools, added a personal indie hacker and solopreneur message to the footer, put his photo throughout the site, recorded YouTube tutorials, and continued reaching out to AI people. |
| **Pricing model** | — |
| **Customer count** | Around 1,500 customers |
| **Growth metrics** | Around 1,500 customers bringing in $100,000 a month; Around 100,000 monthly active users; 1.5 million videos finished on Neuroframes; Hacker News post reached the top six on a Sunday; 350 people visited in the last 30 minutes after the Hacker News post; Team grew from one solo founder to five people; About $45,000 per month for GPUs and text-to-video APIs; About $5,000 per month for servers, storage, and hosting |
| **Notable quotes** | Building an AI is the best decision I ever made.; Do it. Don't be scared.; Somebody pays for a problem solved. They don't pay for the tech around it. |
| **Other notable facts** | Nico started building Neuroframes in the end of 2022.; Most users are hobby or indie musicians, with some professional musicians and people using AI music tools.; Nico studied physics, completed a PhD in 2020, and previously worked at a deep-tech startup at the intersection of computer vision and physics.; The company is bootstrapped and had no VC money at the time of the interview.; Narrowing the product from text-to-video for everyone to AI music videos was described as a major unlock.; The company was spending around $45,000 per month on GPUs and text-to-video APIs and about $5,000 per month on servers, storage, and hosting. |

### 122. I cloned 3 apps and now make $35K/month

| Field | Value |
|---|---|
| **Published** | 2025-07-26 |
| **Business** | Usermius, StoryShort.ai, Capacity.so |
| **Description** | SaaS apps |
| **Category** | Portfolio of Products |
| **Vertical** | AI & Automation (horizontal) |
| **MRR (normalised)** | $35,000 |
| **MRR basis** | The founder explicitly stated revenue of $35,000 per month. |
| **Website** | https://storyshort.ai |
| **Domains mentioned** | storyshort.ai; capacity.so; us.com |
| **Founder** | Samuel Rondo |
| **Type** | SaaS apps |
| **Revenue** | $35,000 per month · monthly · revenue — Usermius makes around $15,000 per month, StoryShort.ai makes around $20,000 per month, and Capacity.so makes currently $900 per month. |
| **Revenue — amount** | $35,000 per month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Usermius makes around $15,000 per month, StoryShort.ai makes around $20,000 per month, and Capacity.so makes currently $900 per month. |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Node.js; Href; Outrank.so; Vercel; Stripe; AI tools |
| **Tech stack — removed** (not found in transcript) | Next.js |
| **Marketing channels** | Google Ads; Meta Ads; SEO; faceless YouTube channels; TikTok; Instagram; affiliate marketing |
| **Marketing tactics** | Runs ads first to validate and test the market, builds SEO once ads generate traction, uses faceless YouTube channels to drive attention on YouTube, TikTok, and Instagram, and runs an affiliate program to acquire customers at a fixed cost and create virality. StoryShort automatically publishes daily UGC-style videos about a user's product across multiple channels on autopilot. |
| **Pricing model** | — |
| **Customer count** | Usermius has around 10,000 customers, StoryShort.ai has around $4,000 customers, and Capacity.so has around 50 users. |
| **Growth metrics** | Three apps making $35,000 per month; Usermius: around $15,000 per month and around 10,000 customers; StoryShort.ai: around $20,000 per month and around $4,000 customers; Capacity.so: currently $900 per month and around 50 users; Usermius costs around $4,000 per month; StoryShort costs around $5,000 per month; Builds an MVP in two weeks; Over 1,000 people have joined Starter Story Build and shipped their first apps |
| **Notable quotes** | I have one rule that is really crucial for me is to never build something that doesn't already exist and isn't already successful or at least getting some traction.; If you like the product and see that it's working, just clone the idea, build an MVP in two weeks and launch ads immediately.; Once you get traction, focus on SEO. It will bring a compounding free traffic over time. |
| **Other notable facts** | Samuel previously worked full time as an optician and had zero coding experience.; He taught himself to code by following a 15-hour YouTube course and applying each new skill to a tool he was building for Instagram.; He finds product ideas mainly on Twitter, including communities such as solopreneur and building in public.; His validation filters are personal use, existing traction, limited marketing spend, and ease of maintenance.; StoryShort's traffic came from Facebook ads and included automatic publishing to YouTube, TikTok, and Instagram.; He recommends using AI coding tools such as ChatGPT and automating posting and article creation. |

### 123. My Side Project Makes $15K/Month (Quit My 9-5)

| Field | Value |
|---|---|
| **Published** | 2025-07-24 |
| **Business** | Tech Lockdown |
| **Description** | SaaS platform that helps adults block websites and apps and control their internet use |
| **Category** | SaaS / Web App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $15,000 |
| **MRR basis** | monthly figure in notes |
| **Website** | — |
| **Founder** | Ben Boz |
| **Type** | SaaS platform that helps adults block websites and apps and control their internet use |
| **Revenue** | over 15,000 · monthly · monthly recurring revenue — The revenue was described as 15,000 MR and later as over 15,000 MRR. |
| **Revenue — amount** | over 15,000 |
| **Revenue — period** | monthly |
| **Revenue — metric** | monthly recurring revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The revenue was described as 15,000 MR and later as over 15,000 MRR. |
| **Traffic / users** | over 2 million people found the site organically in the last 2 years |
| **Engagement** | A lot of people give up after like a month. |
| **Tech stack** | Supabase; SvelteKit; Vercel; Mailgun; Elastic Email; Google Gemini; Plausible Analytics |
| **Marketing channels** | Google search; referrals; social channels; YouTube; Reddit; email |
| **Marketing tactics** | Create an audience before building the product, publish well-researched and helpful free content, and use content to build an email list. Promote videos and guides through subtle Reddit posts that provide useful information and include references to the underlying resource. The founder also focuses on content marketing as his primary customer-acquisition channel. |
| **Pricing model** | Subscription with a 14-day free trial; $15 month-to-month or an annual plan for about $10 a month |
| **Customer count** | 1,300 customers |
| **Growth metrics** | grown by 5x since the founder was laid off; revenue was $3,000 at the time of the layoff; over 2 million people found the site organically in the last 2 years; 1,300 customers generate over 15,000 in monthly recurring revenue; mailing list with around 20,000 contacts; an iPhone-to-dumb-phone guide has been read hundreds of thousands of times; approximately 70% profit margin; email infrastructure costs about $150 a month; Vercel hosting costs $20 a month |
| **Notable quotes** | My name is Ben Boz and I'm a software developer who created Tech Lockdown.; It's actually not that hard to make money with a side project. The hard part is making it into a viable business.; Get bogged down in the details leads to burnout and not actually shipping the product. |
| **Other notable facts** | Tech Lockdown uses content policies to schedule when websites and apps are blocked and can block millions of websites and apps using categories or keywords.; Devices connect through a VPN connection that provides a filtered internet connection.; The founder was laid off in 2023 and chose to work on Tech Lockdown full-time.; The idea originated in 2020, when the founder created guardrails for his own internet use.; The founder first distilled his approach into a YouTube video and a Reddit post before monetizing it about a year later.; The founder previously co-founded a web agency that operated for about 2 and 1/2 years. |

### 124. I make $40K/month with this one website

| Field | Value |
|---|---|
| **Published** | 2025-07-20 |
| **Business** | Bank Statement Converter |
| **Description** | SaaS website that converts PDF bank statements into transaction data for Excel spreadsheets |
| **Category** | SaaS / Web App |
| **Vertical** | Finance & Money |
| **MRR (normalised)** | $40,000 |
| **MRR basis** | stated run-rate |
| **Website** | — |
| **Founder** | Angus Chang |
| **Type** | SaaS website that converts PDF bank statements into transaction data for Excel spreadsheets |
| **Revenue** | $40,000 a month · monthly · MRR/revenue (as of today) — The transcript also states that about $39 out of every $40,000 is profit. |
| **Revenue — amount** | $40,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR/revenue |
| **Revenue — as of** | today |
| **Revenue — notes** | The transcript also states that about $39 out of every $40,000 is profit. |
| **Traffic / users** | 75,000 total users; about 40,000 traffic per month |
| **Engagement** | After stopping paid ads, Angus began getting two or three new signups a day. |
| **Tech stack** | Cotlin; Next.js; JVM; Brevo; AWS EC2; Netlify; Stripe |
| **Marketing channels** | Google Search Ads; Blogging; Building in public; Twitter; Cold email; Organic search |
| **Marketing tactics** | Angus initially bought Google Search Ads, later tried blogging, building in public, and cold email, then cut paid advertising and focused on improving the product based on customer complaints and requests. |
| **Pricing model** | SaaS |
| **Customer count** | About 1,000 paying customers |
| **Growth metrics** | Launched in 2021; Reached 6,000 USD MRR in 2022; Reached 14,000 USD MRR in 2023; Reached 27,000 USD MRR in 2024; Reached 40,000 USD MRR today; Google Search Ads produced about $300 in sales from about $1,000 in ad spend; Three months of cold email produced one sale; After stopping paid ads, began getting two or three new signups per day; Took two or three years before revenue could cover rent; Solo founder with zero employees; 100% bootstrapped |
| **Notable quotes** | I built a business that does just one thing.; I do all the development, customer support, sales, and marketing.; Ignore social media. |
| **Other notable facts** | Angus lives in Hong Kong.; A friend helped with the UI for about a week but left after a few weeks.; Angus built the initial console application for his own bank before generalizing it for other bank statements.; The MVP took about a week to build.; Before Bank Statement Converter, Angus developed indie games and a virtual girlfriend app called Girlfriend Plus.; Angus advised founders to save enough money to survive multiple years with no income. |

### 125. How I Used Reddit to Hit $17K MRR (With ZERO Audience)

| Field | Value |
|---|---|
| **Published** | 2025-07-09 |
| **Business** | App Alchemi |
| **Description** | AI sauce (SaaS) for building mobile app designs |
| **Category** | AI Wrapper |
| **Vertical** | Design & Media |
| **MRR (normalised)** | $17,000 |
| **MRR basis** | stated run-rate |
| **Website** | — |
| **Founder** | Diego |
| **Type** | AI sauce (SaaS) for building mobile app designs |
| **Revenue** | around 17K per month · monthly · MRR (as of started 4 months ago) — The founder also described the business as a 17K MR SaaS. |
| **Revenue — amount** | around 17K per month |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | started 4 months ago |
| **Revenue — notes** | The founder also described the business as a 17K MR SaaS. |
| **Traffic / users** | over 1 million eyes on the product; about 20K traffic per month; 20K or more signups purely from Reddit |
| **Engagement** | — |
| **Tech stack** | Cursor; Next.js; React; Firebase; Chakra UI; Ant Design; AI API backends |
| **Marketing channels** | Reddit |
| **Marketing tactics** | Become an active Reddit user, create a list of related subreddits, publish value-first organic posts with a catchy headline, mention or link the product after providing niche value, cross-post successful content across multiple subreddits, and repeat with different post types two to three times per week. |
| **Pricing model** | — |
| **Customer count** | more than 1K paying customers |
| **Growth metrics** | Started 4 months ago; Built the MVP in about 2 weeks; Got his first KMR purely off Reddit; Overall margins are about 70%; Cursor costs 20 per month; Vercel hosting costs about 40 per month; AI API backends cost about 2.5K per month; Less than 100 followers on X at the time of recording; No YouTube channel; Only friends and family on Instagram; Example of posting on 10 subreddits with an average of around 10k views per post for a total of like 100k views |
| **Notable quotes** | My app is called App Alchemi and it allows you to build mobile app designs very fast using AI.; I got my first KMR and even more purely off Reddit.; Right now is the best time to build. |
| **Other notable facts** | The founder initially paid a designer on Upwork hundreds of dollars and incurred extra fees for small changes.; The founder says AI is better at libraries that are most used on the web, so he does not use the newest libraries or frameworks.; He found a successful mobile app case study on Twitter and summarized it before plugging his product.; For subreddits that prohibit direct product links, he links a complementary product such as Cursor.; He recommends posting two to three times per week because posting more could result in being banned.; The founder describes marketing and distribution as important from the start of building a SaaS business. |

### 126. How I Built A $1M Business in 117 Days

| Field | Value |
|---|---|
| **Published** | 2025-07-02 |
| **Business** | Chatbase |
| **Description** | AI chat product that lets users upload a PDF and talk with it |
| **Category** | AI Wrapper |
| **Vertical** | Documents & Writing |
| **MRR (normalised)** | $566,667 |
| **MRR basis** | Most recent stated ARR is $6.8 million; dividing by 12 gives monthly recurring revenue. |
| **Website** | — |
| **Founder** | Yasser |
| **Type** | AI chat product that lets users upload a PDF and talk with it |
| **Revenue** | $6.8 million · ARR · ARR (as of right now) — Previously stated as $7 million in ARR and as going from $0 to $1 million ARR in 117 days |
| **Revenue — amount** | $6.8 million |
| **Revenue — period** | ARR |
| **Revenue — metric** | ARR |
| **Revenue — as of** | right now |
| **Revenue — notes** | Previously stated as $7 million in ARR and as going from $0 to $1 million ARR in 117 days |
| **Traffic / users** | Registered users are around 600,000 something |
| **Engagement** | — |
| **Tech stack** | Vercel; Vercel AI SDK; Supabase; OpenAI; Anthropic; Cohere; Google Gemini; Stripe; Dub; Mintlify; LangChain; Pinecone |
| **Tech stack — removed** (not found in transcript) | Grok |
| **Marketing channels** | X; Twitter; Reddit; LinkedIn; sponsored posts; affiliates |
| **Marketing tactics** | Yasser built in public, shared what he was using and what he was building every day, posted videos on X, framed every feature release as a new launch for newcomers, created free custom ChatGPT wrappers for books and influencers, and used sponsored posts with large pages. |
| **Pricing model** | Product-led subscription with self-service Stripe checkout; paying customers subscribe between $40 and $500 a month |
| **Customer count** | Just passed 10,000 paying customers 2 days ago |
| **Growth metrics** | Launched 2 and a half years ago; Launched to 16 followers on Twitter; Went from $0 to $1 million ARR in 117 days; Grew to over $6 million ARR in less than 3 years; Originally had two or three sales every day; One sponsored post on LinkedIn cost $4,000 |
| **Notable quotes** | I built Chadbase to 7 million in ARR with no funding.; The easiest thing is just to share what you're doing every day.; Why not build the first 100 million ARR bootstrap company. |
| **Other notable facts** | Yasser launched Chatbase while completing his final year of university and later dropped out.; The initial launch went viral and created a viral loop.; The product was initially framed as a ChatGPT wrapper.; Chatbase's core feature is uploading a PDF and talking with it.; The business is currently only using product-led growth.; Yasser did not perform validation before releasing Chatbase. |

### 127. This App Makes $25,000/Month

| Field | Value |
|---|---|
| **Published** | 2025-06-25 |
| **Business** | Stage Timer |
| **Description** | SaaS countdown timer app for video productions and events |
| **Category** | SaaS / Web App |
| **Vertical** | Design & Media |
| **MRR (normalised)** | $25,000 |
| **MRR basis** | Stated revenue is $25,000 per month, already a monthly run-rate; the $10K mark by September 2023 is an earlier milestone |
| **Website** | https://stage timer.io |
| **Founder** | Lucas Herman |
| **Type** | SaaS countdown timer app for video productions and events |
| **Revenue** | $25,000 per month · monthly · revenue — Reached a $10K monthly revenue mark by September 2023 |
| **Revenue — amount** | $25,000 per month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Reached a $10K monthly revenue mark by September 2023 |
| **Traffic / users** | 20,000 users; 86,000 unique visitors per month |
| **Engagement** | — |
| **Tech stack** | JavaScript; Vue.js; NodeJS; Airtable; Postmark; Google Ads |
| **Marketing channels** | Reddit; Google; YouTube; word of mouth; paid ads |
| **Marketing tactics** | Posted one link per relevant subreddit without attaching a price, created documentation pages for existing niche integrations, published niche YouTube videos, and branded every shared link with the Stage Timer name. The app also has a free tier, and paid subscribers are expected to encounter usage limits before purchasing. |
| **Pricing model** | Freemium with a free tier and paid subscriptions |
| **Customer count** | 4,400 users are paying or have paid at any point in time |
| **Growth metrics** | Shipped the MVP in 3 days; Took 224 days to earn the first dollar; Made $3,000 per month by 2022; Reached $10K monthly revenue by September 2023; About 50% of traffic comes from Google; About one-third of traffic comes from recommendations or word of mouth; Server and infrastructure cost of $280 a month; $250 spent on tools and services; $1,400 spent on paid ads; Profit margin between 80% and 90% |
| **Notable quotes** | One post per subreddit.; Having a free tier works really well for us.; There are so many solutions that still have interfaces from 1999. |
| **Other notable facts** | Lucas Herman is a software developer and solopreneur from Germany.; Lucas handles product, finances, development, and overall direction; his wife handles marketing, sales emails, customer support, and Google Ads.; The app displays a timer for stage speakers and can show messages such as advising someone to hold a microphone closer.; The app is used for television broadcasts, election coverage, horse races, and other real-life video productions.; The original idea came from observing a studio owner using an old Flash app and walking into another room to start a timer.; The first commit for Stage Timer was made shortly after November 2020. |

### 128. How I Built It: $15K/month Mobile App

| Field | Value |
|---|---|
| **Published** | 2025-06-21 |
| **Business** | Habit Kit |
| **Description** | Mobile habit-tracking app |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $15,000 |
| **MRR basis** | Founder stated $15,000 a month as MRR; the Revenue Cat 1% fee does not change the stated revenue figure. |
| **Website** | — |
| **Founder** | Sebastian Ro |
| **Type** | Mobile habit-tracking app |
| **Revenue** | $15,000 · monthly · MRR (as of end of 2024) — Sebastian also described the business as making $15,000 a month; Revenue Cat takes 1% of revenue. |
| **Revenue — amount** | $15,000 |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | end of 2024 |
| **Revenue — notes** | Sebastian also described the business as making $15,000 a month; Revenue Cat takes 1% of revenue. |
| **Traffic / users** | Roughly 300,000 downloads on the App Store and Google Play combined |
| **Engagement** | Over 2,000 reviews and ratings |
| **Tech stack** | Flutter; Cursor; Astro; Appfigures; Revenue Cat; Waycast; Chat with AI |
| **Tech stack — removed** (not found in transcript) | 1Password |
| **Marketing channels** | X; LinkedIn; Bluesky; Threads; Podcasts; Videos; Apple Search Ads; App Store Optimization; App Store; Google Play |
| **Marketing tactics** | Built in public by sharing development progress, wins, failures, and successes on social media; ran a low-budget Apple Search Ads campaign at $100 per month; optimized app store metadata, keywords, app name, subtitle, and screenshots; focused on the “habit tracker” keyword; and prompted users for an App Store review immediately after they checked off their first habit. |
| **Pricing model** | In-app subscriptions |
| **Customer count** | — |
| **Growth metrics** | Roughly 300,000 App Store and Google Play downloads combined; Over 2,000 reviews and ratings; Top-five ranking for “habit tracker” in multiple countries; $3,000 MRR at the end of 2023; Over $15,000 MRR at the end of 2024; Habit Kit was built and launched in 2 months; Sebastian gave himself 12 months of runway to develop indie apps; Less than a dozen downloads after 6 months; Largest ongoing expense was Revenue Cat at 1% of revenue; other expenses totaled roughly $200 or $300 per month; Zen Business states that more than 800,000 founders have used it |
| **Notable quotes** | All data is stored locally on the device. There's no sign in required, no authentication.; I always will be my first customer.; If you manage to secure a good ranking on the app store, you don't need a big marketing budget. |
| **Other notable facts** | Sebastian is 32 years old and lives in Germany.; He launched Habit Kit in 2022 after leaving a corporate programming job.; He later returned to his old job after his 12-month deadline and continued building the app on the side.; Habit Kit has no employees and is run by Sebastian as a solo developer.; The MVP included basic habit tracking and progress visualization.; Sebastian studied computer science for roughly 6 years and spent 3 years at a midsized company before leaving. |

### 129. I Make $100K/Year From 2 AI Side Projects

| Field | Value |
|---|---|
| **Published** | 2025-06-18 |
| **Business** | Superme and Question.ai |
| **Description** | AI side projects, including an AI meme generator and an automated quiz-creation app |
| **Category** | Portfolio of Products |
| **Vertical** | AI & Automation (horizontal) |
| **MRR (normalised)** | $8,500 |
| **MRR basis** | The founder stated that both apps combined currently generate $8,500 per month, so this is the current monthly run-rate. |
| **Website** | https://question.ai and superme.ai |
| **Founder** | Rams |
| **Type** | AI side projects, including an AI meme generator and an automated quiz-creation app |
| **Revenue** | $8,500 per month; approximately a little over 100k ARR; Superme lifetime revenue of about 130k USD and Question.ai around 100k USD · monthly; annual; lifetime · revenue and ARR — Both apps combined make $8,500 per month. |
| **Revenue — amount** | $8,500 per month; approximately a little over 100k ARR; Superme lifetime revenue of about 130k USD and Question.ai around 100k USD |
| **Revenue — period** | monthly; annual; lifetime |
| **Revenue — metric** | revenue and ARR |
| **Revenue — as of** | — |
| **Revenue — notes** | Both apps combined make $8,500 per month. |
| **Traffic / users** | 1.5 million plus users for Superme and about 150k plus users for Question.ai |
| **Engagement** | — |
| **Tech stack** | Next.js; JavaScript; Supabase; Typedream; Windsurf; Cursor; OpenAI APIs; Anthropic APIs |
| **Marketing channels** | LinkedIn; Twitter; YouTube; Product Hunt; blogs; videos; social media founder content sharing |
| **Marketing tactics** | Built both apps in public by sharing what he was working on, writing about quiz generation, creating videos, posting every day on LinkedIn, and getting his first users through social media. The initial users then supported the launches, and Superme's virality helped it reach number one on Product Hunt on launch day. |
| **Pricing model** | — |
| **Customer count** | 400 paying customers for Superme and 18 to 200 for Question.ai |
| **Growth metrics** | $8,500 per month in combined revenue; approximately a little over 100k ARR; Superme lifetime revenue of about 130k USD; Question.ai lifetime revenue around 100k USD; 1.5 million plus Superme users; about 150k plus Question.ai users; 400 Superme paying customers; 18 to 200 Question.ai paying customers; 70 to 75% profit margin; 2 hours a week spent on the apps; Udemy course made like $10,000 in revenue till now |
| **Notable quotes** | Build distribution before building a product.; The biggest thing was social media founder content sharing. That's how we got all of our first users.; The biggest thing is to aim for solving a problem by chaining and stitching together tools and products that are out there than spending months in R&D. |
| **Other notable facts** | Rams builds the apps alongside a full-time job and spends about 2 hours a week on them.; The apps mostly run on complete autopilot.; The founders have no employees besides themselves.; The biggest operating cost is AI APIs.; Question.ai's first version was ported to a modern tech stack over 6 months.; Superme reached number one on Product Hunt on launch day. |

### 130. I Built a $1M SaaS 100% with No Code (Bubble)

| Field | Value |
|---|---|
| **Published** | 2025-06-14 |
| **Business** | Faceless Video |
| **Description** | B2C SaaS that automates faceless social media channels |
| **Category** | SaaS / Web App |
| **Vertical** | Creator & Social Media |
| **MRR (normalised)** | $83,333 |
| **MRR basis** | Over $1 million in ARR divided by 12 months; the stated figure is approximate. |
| **Website** | https://faceless.video |
| **Domains mentioned** | faceless.video |
| **Founder** | Jacob |
| **Type** | B2C SaaS that automates faceless social media channels |
| **Revenue** | over a million dollars a year in ARR · annual — The business was bootstrapped from scratch and reached $1 million ARR in 10 months. |
| **Revenue — amount** | over a million dollars a year in ARR |
| **Revenue — period** | annual |
| **Revenue — metric** | ARR |
| **Revenue — as of** | — |
| **Revenue — notes** | The business was bootstrapped from scratch and reached $1 million ARR in 10 months. |
| **Traffic / users** | Total number of users signed up: over 1.1 million |
| **Engagement** | — |
| **Tech stack** | Bubble; APIs; Bubble AI |
| **Marketing channels** | SEO; ads; influencers; organic content; Twitter threads; word of mouth |
| **Marketing tactics** | The founders used SEO, ads, influencers, organic content, Twitter threads, influencer collaborations, and storytelling-focused messaging to acquire customers. Their first advertisement was a Twitter thread that cost about 200 bucks and received hundreds of thousands of views. Influencers who saw the ads began promoting Faceless.video on their own, and word of mouth was consistently among the top five attribution sources. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | Reached $1 million ARR in 10 months; Generated thousands of videos every single day for users; Some videos had well over a million views; Plenty of videos had hundreds of thousands of views; First advertisement received hundreds of thousands of views; Total users signed up exceeded 1.1 million |
| **Notable quotes** | If it ain't broke, don't fix it.; We didn't reinvent the wheel.; You can validate really quickly and scale based on that. |
| **Other notable facts** | Faceless Video writes video content, creates videos, and posts them on users' behalf every day on autopilot.; The first month of development focused on a MVP that accepted text and output a faceless video.; The product later expanded to include user management, a UI/UX flow, payment processing, and pricing.; Jacob previously ran Domino, a music marketing agency.; Before Faceless Video, Jacob tried six business ideas.; Jacob was a songwriter, producer, and artist who released music on Spotify. |

### 131. How I Built It: $9K/Month Micro-SaaS

| Field | Value |
|---|---|
| **Published** | 2025-06-11 |
| **Business** | Sync to Sheets |
| **Description** | Google Workspace Marketplace add-on |
| **Category** | Browser Extension / Add-on |
| **Vertical** | Productivity & Workflow |
| **MRR (normalised)** | $9,000 |
| **MRR basis** | Founder explicitly stated revenue of $9,000 a month, which is the current monthly run-rate; the lifetime total is not us |
| **Website** | — |
| **Founder** | Leandro |
| **Type** | Google Workspace Marketplace add-on that syncs Notion databases to Google Sheets |
| **Revenue** | $9,000 a month · monthly · revenue — Lifetime revenue was probably around $120k for the last four years, with most of the money made in the last one or two years. |
| **Revenue — amount** | $9,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Lifetime revenue was probably around $120k for the last four years, with most of the money made in the last one or two years. |
| **Traffic / users** | More than 70K users in the application; approximately 5K visitors a month |
| **Engagement** | — |
| **Tech stack** | TypeScript; Apps Script; Google Sheets API; Notion API; VS Code; Cursor; Google Cloud; Firebase; SendGrid; Paddle; Tidio |
| **Tech stack — removed** (not found in transcript) | Mixpanel |
| **Marketing channels** | Google Workspace Marketplace; SEO; Blogging; Reddit; X; Facebook groups; LinkedIn groups; Product Hunt; Hacker News |
| **Marketing tactics** | Validated demand by searching the Notion subreddit for terms such as sheets, Google sheets, Excel, and CSV; built a two-week MVP; recruited beta testers and first users through Notion-related Facebook and LinkedIn groups, Reddit, and personal DMs; published to the Google Workspace Marketplace; used targeted SEO articles about Notion and Google Sheets; tracked relevant Reddit keywords with F5 Bot and replied with value while identifying the founder; launched on Product Hunt; posted on Hacker News and reached the front page; and added a landing-page chat interface for direct customer conversati… |
| **Pricing model** | Paid subscription with paid plans; the free plan was removed |
| **Customer count** | More than 450 paying customers |
| **Growth metrics** | Built in two weeks without AI; Operating for four years; More than 70K application users; More than 450 paying customers; Approximately 5K monthly visitors; Around $120k lifetime revenue over four years; Most revenue was generated in the last one or two years; Revenue reportedly went from $5K to $8K within a few months after removing the free plan; Approximately 90% margin; Product Hunt launch occurred a year and a half after the initial launch |
| **Notable quotes** | It has hundreds of business ideas waiting to be built.; It's super important to at least find your first user that is willing to pay for your application.; Do not waste time building something that no one is going to be willing to pay for. |
| **Other notable facts** | Leandro lives in Buenos Aires, Argentina.; He studied electronics engineering and later learned to code in JavaScript.; He freelanced for eight years before leaving client work to build his own product.; The first version used Sheets API experience gained while building another integration.; The product supports conditional formatting, data validation, dropdowns, moving columns, and hiding columns.; The main current expense is cloud infrastructure because the add-on continuously synchronizes data in real time. |

### 132. I Built an App with Cursor and Made $100K on Launch Day

| Field | Value |
|---|---|
| **Published** | 2025-06-07 |
| **Business** | Creator Buddy |
| **Description** | AI content app |
| **Category** | AI Wrapper |
| **Vertical** | Creator & Social Media |
| **MRR (normalised)** | $25,000 |
| **MRR basis** | $300,000 ARR divided by 12 equals $25,000 in monthly recurring revenue. |
| **Website** | — |
| **Founder** | Alex Finn |
| **Type** | AI content app |
| **Revenue** | $300,000 · annual · ARR (as of within 2 weeks of launch) — Reached $100,000 ARR within 15 minutes of launch and $300,000 ARR within 2 weeks. |
| **Revenue — amount** | $300,000 |
| **Revenue — period** | annual |
| **Revenue — metric** | ARR |
| **Revenue — as of** | within 2 weeks of launch |
| **Revenue — notes** | Reached $100,000 ARR within 15 minutes of launch and $300,000 ARR within 2 weeks. |
| **Traffic / users** | — |
| **Engagement** | Almost 500 active paid subscribers. |
| **Tech stack** | Cursor; Windsurf; ChatGPT; Vercel; Next.js; Supabase; Claude; ChatGPT API; X API; Resend |
| **Marketing channels** | X; Twitter; YouTube; email; X Spaces |
| **Marketing tactics** | He created content consistently for 3 years, built an audience around the open-sourced X algorithm, offered Creator Buddy to X subscribers as a beta test, met each beta tester individually, collected feedback and made improvements, then launched on X Spaces and shared his six-to-seven-month building journey throughout the launch day. |
| **Pricing model** | — |
| **Customer count** | Almost 500 active paid subscribers |
| **Growth metrics** | Built and launched the app in 3 months; Working prototype on day one; $100,000 ARR within 15 minutes of launch; $300,000 ARR within 2 weeks of launch; $200,000 made on launch day; 150 beta testers; Launched on January 24th; $25,000 a month of revenue; About 80% margins; About $5,300 a month in costs; About $250 a month in tools and AI API costs before the $5,000-a-month X API cost; Gained hundreds of thousands of followers after an X algorithm thread; Created content for 3 years; Spent 5 minutes a day tweeting |
| **Notable quotes** | The moat is your distribution.; The best way to solve all of those is to just do it.; Someone goes out and builds Creator Buddy 2.0, the exact same app in 5 seconds, but they have 10 followers, I'm going to outsell them in circles. |
| **Other notable facts** | Creator Buddy automatically pulls tweets from X and uses an AI model to read them and coach users on creating better content.; Finn previously led a team of technical consultants at MongoDB.; He began creating content on Twitter around December 2021.; An X algorithm thread he wrote in March 2023 went viral and was retweeted by Elon Musk.; He ran and shipped the product by himself using AI.; He says the app was built entirely by him, with no coding help. |

### 133. How to Use AI to Find a $1M Idea [Reddit, Claude]

| Field | Value |
|---|---|
| **Published** | 2025-06-04 |
| **Business** | Transition Garden |
| **Description** | Landing page for a co-parenting app focused on child-centered custody transitions |
| **Category** | Mobile App |
| **Vertical** | Personal & Relationships |
| **MRR (normalised)** | — |
| **MRR basis** | No revenue figure or comparable period was stated. |
| **Website** | — |
| **Founder** | Steph France |
| **Type** | Landing page for a co-parenting app focused on child-centered custody transitions |
| **Revenue** | — |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Claude; Gemini; Google; Chrome; Keyword Everywhere; Google Trends; Reddit; Lovable; Cursor |
| **Marketing channels** | Google; Google Trends; Reddit; email; YouTube |
| **Marketing tactics** | Use Google search volume and related keywords to identify markets, Google Trends to assess trends, and advanced Google searches to find relevant Reddit threads about customer pain points. Extract pain points, generate and differentiate business ideas, create a landing page with Lovable, then validate demand with a quiz-based waiting list before building the app. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | 20,000 searches for the query "Swedish massage near me"; 40,000 searches for "co-arenting"; The co-parenting landing page was created in one hour; The Gold Mining Framework uses six tools, five prompts, and 45 minutes |
| **Notable quotes** | The landing page was created only with this framework A to Z.; And this landing page was created in an hour.; The Gold Mining Framework uses six tools, five prompts, and 45 minutes. |
| **Other notable facts** | The demonstrated framework is called the Gold Mining Framework.; It covers three core markets: health, wealth, and relationships.; The demonstrated landing page was for a co-parenting app.; The presenter said the framework can take someone from nothing to a potential million-dollar business idea and a complete landing page without writing code or copy.; The Gold Mining Framework was made freely available through the link in the video description.; Starter Story Build's flagship program is the AI App Accelerator. |

### 134. I Make $250K/Month From 20 Apps

| Field | Value |
|---|---|
| **Published** | 2025-05-31 |
| **Business** | Unicorn Platform |
| **Description** | Website builder and directory builder for busy founders |
| **Category** | Marketplace / Directory |
| **Vertical** | E-commerce & Retail |
| **MRR (normalised)** | $250,000 |
| **MRR basis** | Combined annual revenue of 3 million divided by 12; SEO Bot's stated 100K MR is consistent with this run-rate. |
| **Website** | — |
| **Founder** | John Rush |
| **Type** | Website builder and directory builder for busy founders |
| **Revenue** | 3 million AR · combined revenue — Across all businesses; seven products bring most of the revenue. SEO Bot has 100K MR and makes 100K a month. |
| **Revenue — amount** | 3 million AR |
| **Revenue — period** | — |
| **Revenue — metric** | combined revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | Across all businesses; seven products bring most of the revenue. SEO Bot has 100K MR and makes 100K a month. |
| **Traffic / users** | Around 1 million combined users in B2B; Unicorn Platform has 600,000 users |
| **Engagement** | — |
| **Tech stack** | JavaScript; Tailwind; Discord; Apple Notes; Code; Gemini API; OpenAI API; Nova |
| **Tech stack — removed** (not found in transcript) | Grok |
| **Marketing channels** | SEO; X; LinkedIn; Substack; Facebook; Twitter; Directories; Cross-promotion; Email; Ads |
| **Marketing tactics** | John reposts repurposed content on every social platform daily, shares at least 30 tweets a month, promotes products through directory listings, cross-promotes and integrates products so users move between them, and uses AI for SEO, email, copywriting, and ad generation. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | Running 26 startups at the same time; 3 million AR across all businesses; Seven products bring most of the revenue; Unicorn Platform has 600,000 users; SEO Bot has 100K MR; SEO Bot grew in less than 12 months; SEO Bot has around 70% margins; Non-AI tools have 90% margins; User failure rate fell from 90% to 10% after building in public; Paid almost a million dollar for Unicorn Platform; Joined the bootstrap scene in 2022; Shares ownership 50/50 with co-makers |
| **Notable quotes** | The ideal marketing is where the product just drives the sales and drives the word of mouth.; The most important thing when you build a startup is the idea and the founder idea fit.; Users natively float from product to product and end up using my entire ecosystem. |
| **Other notable facts** | John worked in VC-backed startups for 10 years before leaving in 2022.; The Unicorn Platform founder joined John for a year and mentored him after the acquisition.; John validates ideas by launching a waitlist, seeking 100 signups, offering a 90% pre-sale discount, and building an MVP after five sales.; Before coding, John manually delivers the solution and iterates until customers are satisfied.; John built a custom AI code generator for building his SaaS products, no-code tools, and AI agents.; John keeps human support for all products and says AI does not have the soul. |

### 135. I Built an App with Cursor, Made $30K, and Quit My Job.

| Field | Value |
|---|---|
| **Published** | 2025-05-24 |
| **Business** | Creator Hunter |
| **Description** | SaaS app that matches startups with influencers |
| **Category** | Marketplace / Directory |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | — |
| **MRR basis** | The $30,000 is a one-off total from launch night (about 20–30 sales), with no stated period or recurring run-rate. |
| **Website** | — |
| **Founder** | Polus |
| **Type** | SaaS app that matches startups with influencers |
| **Revenue** | $30,000 · revenue — The app made 30K; about 20 or 30 sales occurred on launch night. |
| **Revenue — amount** | $30,000 |
| **Revenue — period** | — |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The app made 30K; about 20 or 30 sales occurred on launch night. |
| **Traffic / users** | Over 1,000 users |
| **Engagement** | — |
| **Tech stack** | Perplexity; Bolt; Cursor; GPT-4; Framer; Supabase; Clerk; Vercel; shadcn; Figma; API for scraping |
| **Marketing channels** | X Twitter; TikTok |
| **Marketing tactics** | Shipped often, built in public, attached posts to existing trends and debates, used a simple visual demo with a human reaction, and published creator-related posts on X inspired by similar content. |
| **Pricing model** | — |
| **Customer count** | Over 350 paid users |
| **Growth metrics** | Built and launched the app 7 months ago; Got traction in about 30 days; Made $30,000 from the app; Over 1,000 users; Over 350 paid users; Got close to 500k impressions on one X post; About 20 or 30 sales on launch night; Works on Creator Hunter full-time since the 24th of December; Runs the business at about 90% margins |
| **Notable quotes** | My name is Polus and I used AI to build an app that made me 30K.; I think you can just start prompting and just prompt your way to making something and sell it.; Never underestimate how much you can do solo. AI as your CTO is like a superpower. |
| **Other notable facts** | Built the app by himself without needing a team, primarily during his daily commute.; Before building the app, worked in web design, copywriting, and sales funnels while pursuing creator-led services and products.; Used a free Framer template and focused 80% of design time on the above-the-fold hero section.; Traveled to China, New York, and France while building the MVP.; Quit his job to work on Creator Hunter full-time.; The founder described the product as Creator Hunter and described it as an app that matches startups with influencers. |

### 136. From Zero to $42K/Month in 90 Days with AI

| Field | Value |
|---|---|
| **Published** | 2025-05-21 |
| **Business** | Code Guide |
| **Description** | AI startup providing knowledge bases |
| **Category** | Developer Tool / API |
| **Vertical** | Developer Tools |
| **MRR (normalised)** | $42,000 |
| **MRR basis** | The founder explicitly stated current MRR as $42K. The $90K figure is a projection and the $17,000 a month figure is low |
| **Website** | https://codeguide.dev |
| **Domains mentioned** | codeguide.dev |
| **Founder** | Sajila Mazafir |
| **Type** | AI startup providing knowledge bases that help AI developers write detailed documentation for AI coding models |
| **Revenue** | $17,000 a month; 42K MRR; over 500,000 in ARR · monthly · MRR/ARR/revenue (as of 49 days after launch; within the first 3 months after launch) — The business launched on 24th of December 2024 and was projected to cross around 90K this month. |
| **Revenue — amount** | $17,000 a month; 42K MRR; over 500,000 in ARR |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR/ARR/revenue |
| **Revenue — as of** | 49 days after launch; within the first 3 months after launch |
| **Revenue — notes** | The business launched on 24th of December 2024 and was projected to cross around 90K this month. |
| **Traffic / users** | More than 4,800 AI developers in the community; all traffic was coming from X |
| **Engagement** | — |
| **Tech stack** | Next.js; Claude 3.7 model; Cursor; Windsurf; Supabase; PostgreSQL; Vercel; Hetzner; OpenAI API; Cloud API; Gemini Flash API; Clerk; ConvertKit; Make.com; Bolt; Canva; Figma; ChatGPT |
| **Marketing channels** | X; Twitter; email; waitlist landing page |
| **Marketing tactics** | The founder uses a content-audience-fit approach and calls it tutorial marketing: publishing tutorial-style threads and long-form posts about AI coding problems and workflows, creating assets with Canva and Figma, and directing traffic to a waitlist landing page. He also validates ideas by posting screen-recorded demos on Twitter, talking directly with beta users, identifying their pain points, and doubling down on content that works. |
| **Pricing model** | Monthly membership at $29, planned to rise to $39 to $49 in the next 6 months, plus a yearly membership with a 40% discount and additional perks; no free trials |
| **Customer count** | 100 users on the first day of launch; the first 100 customers came from waitlist emails |
| **Growth metrics** | 0 to 42K MRR in just a couple of months; $17,000 a month within 49 days; Over 500,000 in ARR; More than 1,800 waitlist signups within 2 weeks; Approximately 400 retweets and 300 signups from the validation tweet; 100 users on the first day of launch; Projected to cross around 90K this month; Four threads and three long-form posts per week; Team of two; Overall operating costs around $3,500 per month |
| **Notable quotes** | I didn't build any product. I didn't have anything. I just had a glimpse of what a product can look like in a landing page and people were signing up from left to right.; The actual validation for me was when people starting to sign up.; Everything is organic. All my traffic is coming from X. |
| **Other notable facts** | Code Guide launched on 24th of December 2024.; The founder is known on X as CJZ.; The product addresses AI hallucinations by attaching a user-specific knowledge base to AI coding tools.; The founder built 11 products as part of a public goal of building 12 startups in 12 months; 10 collapsed and Code Guide was the one that grew quickly.; The original prototype turned prompts into a sequence with Make.com and reportedly saved seven hours out of nine.; The business had partnerships with Cursor AI, Windsurf, Bolt, and Lovable, and the founder also handles marketing while his friend handles the backend and customer service. |

### 137. I Got Rejected From YC, Then Built a $200M Startup

| Field | Value |
|---|---|
| **Published** | 2025-05-07 |
| **Business** | V |
| **Description** | video editing tools in the browser |
| **Category** | SaaS / Web App |
| **Vertical** | Design & Media |
| **MRR (normalised)** | — |
| **MRR basis** | The founder stated cumulative revenue milestones over time, not a monthly recurring revenue figure or a period total tha |
| **Website** | https://v.io |
| **Domains mentioned** | v.io |
| **Founder** | Saba Kenned |
| **Type** | video editing tools in the browser |
| **Revenue** | 0 to 1 million in the first year; 4 months later 2 million; 2 months later 3 million; 6 months after that 6 million; 10, 20, 30, 40 million in revenue · first year and subsequent periods — The speaker described the growth as going from 0 to 1 million in the first year, then 2 million, 3 million, and 6 million. |
| **Revenue — amount** | 0 to 1 million in the first year; 4 months later 2 million; 2 months later 3 million; 6 months after that 6 million; 10, 20, 30, 40 million in revenue |
| **Revenue — period** | first year and subsequent periods |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The speaker described the growth as going from 0 to 1 million in the first year, then 2 million, 3 million, and 6 million. |
| **Traffic / users** | Went from zero users to 30,000 monthly users in like 9 months |
| **Engagement** | — |
| **Tech stack** | PostHog |
| **Marketing channels** | SEO; YouTube |
| **Marketing tactics** | Built a landing page for every one of about 500 video-related search terms, then recorded a YouTube video for every landing page. The speaker also implemented paid pricing in response to Y Combinator feedback. |
| **Pricing model** | Charged users after initially having users who were not paying; the business later generated revenue. |
| **Customer count** | 20 paid users |
| **Growth metrics** | Went from zero users to 30,000 monthly users in like 9 months; 0 to 1 million in the first year; 4 months later 2 million; 2 months later 3 million; 6 months after that 6 million; Worked on projects together for two or three years; Used about one year of runway during the early period; Applied to Y Combinator and was rejected; Had two interns who quit on the same day |
| **Notable quotes** | If other people have done it, why are they so special? Why can't we do it?; We went from like zero users to 30,000 monthly users in like 9 months.; Once we got back to the UK after California I did one thing which was only focus on growth. |
| **Other notable facts** | Saba Kenned and Tim met through a global hackathon and started working together after meeting online and for coffee.; The initial product idea was to build basic video editing tools in the browser.; The company initially had no funding, no validation, and no money in the founders' bank accounts.; The founders sold crypto to keep the company going and later used half of their salaries to hire two engineers.; Saba studied design after learning graphics and images using a cracked version of Photoshop.; The speaker said they had about 500 search terms related to trimming and cropping video. |

### 138. My Coding Game Makes $1M Per Month

| Field | Value |
|---|---|
| **Published** | 2025-04-30 |
| **Business** | boot.dev |
| **Description** | Online learning platform for software engineers |
| **Category** | SaaS / Web App |
| **Vertical** | Education & Learning |
| **MRR (normalised)** | $1,000,000 |
| **MRR basis** | The founder explicitly stated current revenue of almost $1 million per month, so the MRR is $1,000,000. |
| **Website** | https://boot.dev |
| **Domains mentioned** | boot.dev |
| **Founder** | Lane Wagner |
| **Type** | Online learning platform for software engineers |
| **Revenue** | almost $1 million a month; $5.7 million total revenue in 2024 · monthly and annual (as of 2024) — Cost of goods sold was $300k; around $2.5 million profit in 2024 |
| **Revenue — amount** | almost $1 million a month; $5.7 million total revenue in 2024 |
| **Revenue — period** | monthly and annual |
| **Revenue — metric** | revenue |
| **Revenue — as of** | 2024 |
| **Revenue — notes** | Cost of goods sold was $300k; around $2.5 million profit in 2024 |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Golang; Google Cloud; Cloudflare; Kubernetes; Docker; Vue; JavaScript; TypeScript; PostHog; SendGrid; Stripe |
| **Tech stack — removed** (not found in transcript) | PostgreSQL; Nuxt |
| **Marketing channels** | Blogging; Influencer marketing; Free Code Camp collaborations; YouTube; Email |
| **Marketing tactics** | The founder grew boot.dev from zero to about $2,000 a month through his blog, then used influencer collaborations and an eight-hour Free Code Camp course published on YouTube. To scale beyond that, boot.dev expanded YouTube marketing with other creators, particularly creators serving gaming audiences. The business also used AB testing and customer recommendations to source influencers, and sometimes shot B-roll for influencers to secure better one-off deals. |
| **Pricing model** | All content is free, but non-paying members lose interactivity after a certain point; paying membership restores access to the interactive features. |
| **Customer count** | 25,332 active paying members |
| **Growth metrics** | About $2,000 a month when the founder first considered investing more time in the business; Angel funding of $330K; Grew from zero to about $2K a month through the founder's blog; Grew from 10K to 30K through Free Code Camp collaborations; Almost $1 million a month in current revenue; 2024 revenue of $5.7 million; 2024 cost of goods sold of $300k; Around $600,000 to $700,000 spent on salaries and full-time contractors in the last year; Almost $2 million spent on marketing; Around $2.5 million profit in 2024; About 30 courses; Founder previously led a small team of three; Founder earned about $200K total compensation before building boot.dev; The business was developed over four years |
| **Notable quotes** | MVP doesn't mean shitty product and it can't mean that for you your product is going to flop pretty hard.; You should shoot for minimum quantity not minimum quality.; The product is the thing that really is non-negotiable. |
| **Other notable facts** | The platform teaches software engineers through coding on local machines and in the browser.; The founder initially focused on back-end technologies because he had difficulty hiring Go developers in 2020.; boot.dev has operated as a side project while the founder retained his full-time job.; The founder has worked from home since the pandemic.; The founder has a two-year-old and a four-year-old, with a third child due the following month.; PostHog was adopted because it was cheaper and easier to integrate than the founder's previous product analytics tool. |

### 139. I Spent 24 Hours With Roblox Millionaires

| Field | Value |
|---|---|
| **Published** | 2025-04-23 |
| **Business** | or Die |
| **Description** | Roblox game development business |
| **Category** | Game |
| **Vertical** | Gaming & Entertainment |
| **MRR (normalised)** | $45,000 |
| **MRR basis** | The founder's most recent stated current monthly revenue figure was about $45K per month; the $70K figure is a projectio |
| **Website** | — |
| **Founder** | Cole |
| **Type** | Roblox game development business |
| **Revenue** | about $45K a month just or Die; on track to make like $70 grand this month · monthly · revenue (as of this month) — or Die was launched about 6 months ago; Cole and his programmer/business partner split the revenue 50/50 |
| **Revenue — amount** | about $45K a month just or Die; on track to make like $70 grand this month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | this month |
| **Revenue — notes** | or Die was launched about 6 months ago; Cole and his programmer/business partner split the revenue 50/50 |
| **Traffic / users** | about 1 million daily active users across all his games; 13,000 people playing or Die right now |
| **Engagement** | — |
| **Tech stack** | Roblox Studio |
| **Marketing channels** | — |
| **Marketing tactics** | No ads; games are discovered through Roblox's recommendation and discovery system, like YouTube. Cole focuses on making games clickable, social, and replayable. |
| **Pricing model** | In-game purchases using Robux, including skins, coins, and abilities; developers convert Robux into real money |
| **Customer count** | — |
| **Growth metrics** | or Die is about a top 100 game on Roblox; or Die was launched about 6 months ago; Cole has spent about $300K on a previous Roblox game that failed; Cole previously spent half a million dollars on two failed projects; Cole has 6 million Robux |
| **Notable quotes** | I always focus on clickability.; I think being like dramatic or unique in some way, it always works out.; You got to build a curiosity in the user. |
| **Other notable facts** | Cole is one of the top like 50 biggest Roblox developers in the world.; Cole started playing Roblox in 2013 and began making money from Roblox at 16.; Cole skipped college and moved to Austin, Texas, when he turned 18.; Cole and his business partner split profits 50/50.; Cole pays about $5K a month for contract modelers and graphics work.; Cole's brother Ian develops Roblox games with him. |

### 140. My Apps Make $4.5M/Year With $0 Marketing

| Field | Value |
|---|---|
| **Published** | 2025-04-19 |
| **Business** | Kaching |
| **Description** | Shopify app business |
| **Category** | SaaS / Web App |
| **Vertical** | E-commerce & Retail |
| **MRR (normalised)** | $375,000 |
| **MRR basis** | Annual recurring revenue of $4.5 million divided by 12 gives $375,000 per month. |
| **Website** | — |
| **Founder** | Ericas |
| **Type** | Shopify app business |
| **Revenue** | $4.5 million a year · annual · revenue — The interview also states the business was at $4.5 million annual recurring revenue and 90% profitable. |
| **Revenue — amount** | $4.5 million a year |
| **Revenue — period** | annual |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The interview also states the business was at $4.5 million annual recurring revenue and 90% profitable. |
| **Traffic / users** | — |
| **Engagement** | Around 95% of the apps' reviews come from customer support; 24/7 customer support is provided. |
| **Tech stack** | Shopify; Slack; Intercom; features.vote; Linear; Mantle |
| **Marketing channels** | Shopify app store; Discord communities; e-commerce Facebook groups; Facebook posts; email; Twitter; affiliate partnerships |
| **Marketing tactics** | Ericas manually onboarded users by asking clients, friends, and Shopify users in communities to install the app. New apps were launched free with free trials to reduce install friction, while existing users were grandfathered in. Monthly emails showed merchants the revenue generated by the app and requested reviews. The customer-support team used a gamified bonus system, leaderboard, and raffles to encourage reviews, and Mantle was used for affiliate partnerships and marketplace metrics. |
| **Pricing model** | Subscription model with tiers based on usage; free launch periods, free trials, and full refunds were offered. |
| **Customer count** | — |
| **Growth metrics** | $4.5 million annual recurring revenue; 90% profitability; 5 apps in total; Kaching Bundles: around $400k monthly recurring revenue; Launched in 2022 August; More than $400 million in additional revenue for merchants using the apps; Around 95% of app reviews come from customer support; 24/7 customer support; Top 25% of Shopify app developers were said to be making almost $300k a year; monday.com has over 245,000 customers across over 200 industries; 90% of monday.com enterprise customers use monday.com apps |
| **Notable quotes** | All of our growth is coming either from or; Since our launch in 2022 August, we already made more than 400 million in additional revenue for all of the merchants that are using our apps.; Every time you go to launch a new app, I always launch it for free because it reduces friction of installs |
| **Other notable facts** | Ericas is a designer turned entrepreneur from Lithuania who was living in Paris.; He worked at a local web design agency for $2 per hour before freelancing.; The business was described as being run with an async team and 90% margin.; Ericas recommends starting with a designer and a technical co-founder.; The company emphasizes very lean expenses.; Ericas says he finds ideas by researching competitors, noting what he likes and dislikes, and designing an objectively better user experience. |

### 141. I Make $60K/Month with 4 Apps

| Field | Value |
|---|---|
| **Published** | 2025-04-12 |
| **Business** | Rummer; Parakeet AI; Optivase; Parakeet AI Apply Agent |
| **Description** | Online businesses, including a car engine-sound device, an AI interview assistant, a B2B SaaS A/B testing tool for… |
| **Category** | Portfolio of Products |
| **Vertical** | AI & Automation (horizontal) |
| **MRR (normalised)** | $6,500 |
| **MRR basis** | The most recent explicit MRR figure is about $6.5K for Rummer; other figures are for different businesses or non-MRR per |
| **Website** | — |
| **Founder** | Ure |
| **Type** | Online businesses, including a car engine-sound device, an AI interview assistant, a B2B SaaS A/B testing tool for Webflow, and an AI job-application agent |
| **Revenue** | $60,000 per month; $300,000; over $35,000; about $6.5K; about $1,000 · per month; last year; last 30 days; currently; so far · revenue; MRR; sales (as of last year; last 30 days; currently; two weeks after launch) — The $60,000 per month is across four businesses. The $300,000, over $35,000, about $6.5K MRR, and about $1,000 relate to Rummer, Parakeet AI, Optivase, and Parakeet AI Apply Agent, respectively. |
| **Revenue — amount** | $60,000 per month; $300,000; over $35,000; about $6.5K; about $1,000 |
| **Revenue — period** | per month; last year; last 30 days; currently; so far |
| **Revenue — metric** | revenue; MRR; sales |
| **Revenue — as of** | last year; last 30 days; currently; two weeks after launch |
| **Revenue — notes** | The $60,000 per month is across four businesses. The $300,000, over $35,000, about $6.5K MRR, and about $1,000 relate to Rummer, Parakeet AI, Optivase, and Parakeet AI Apply Agent, respectively. |
| **Traffic / users** | Rummer generated about 600,000 page visits and over 6,000 orders from about 200 million organic short-form content views in the last year. |
| **Engagement** | — |
| **Tech stack** | Next.js; React; Speechmatics; ChatGPT; OBD2; Webflow; Shopify |
| **Marketing channels** | TikTok; Instagram; YouTube; Webflow app store; Google; word of mouth; Facebook Ads; Google Ads; Reddit |
| **Marketing tactics** | Rummer uses organic short-form funny videos on TikTok, Instagram, and YouTube; its co-founder creates batches of hooks, main parts, and endings and repeatedly remakes concepts that work. Ure says new online businesses should choose one distribution channel, dedicate full-time attention to it for two months, and double down on what works. Optivase receives organic sales from the Webflow app store, Google, and word of mouth. |
| **Pricing model** | Parakeet AI uses credit-based pricing with one-time payments and no subscription. Ure says monetization should fit the product's usage. |
| **Customer count** | Rummer sold 6,000 units last year. |
| **Growth metrics** | Rummer launched about 2 years ago.; Rummer produced about 200 million organic short-form content views in the last year.; Rummer generated about 600,000 page visits and over 6,000 orders in the last year.; Parakeet AI launched about 6 months ago.; Optivase launched about a year ago.; Parakeet AI Apply Agent launched two weeks ago.; The first business's monthly revenue went from about $700 in the first month to $4,000 in the second month and about 12 in the third month.; Ure began building apps around age 13 or 14 and first made money 3 years ago.; Ure worked at Microsoft for about a year and a half.; Ure is 26 years old.; Speechmatics transcription costs about $1 an hour.; AI spending is ab… |
| **Notable quotes** | I think if you're trying to start an online business right now, the way to do it is to bet on organic short form content.; Make sure that the way you monetize your product fits the nature of the product.; You really need to believe in yourself. |
| **Other notable facts** | Ure is a developer who co-founded and runs all four businesses.; Rummer plugs into a car's OBD2 port and generates fake engine sounds through the speakers.; Parakeet AI is a real-time AI interview assistant primarily used for job interviews.; Optivase is a B2B SaaS A/B testing tool for Webflow.; Parakeet AI Apply Agent is an AI agent that applies to jobs.; Ure and his content co-founder Urban work on a revenue split. |

### 142. I Locked Myself In A Room, Made 17 Apps, & Sold 2 for $265,000

| Field | Value |
|---|---|
| **Published** | 2025-03-31 |
| **Business** | Make Logo AI |
| **Description** | AI logo-generation app |
| **Category** | AI Wrapper |
| **Vertical** | Design & Media |
| **MRR (normalised)** | — |
| **MRR basis** | The $85,000 is a one-off total comprising $26,000 in sales and a $65,000 sale of Make Logo AI, not a stated monthly recu |
| **Website** | — |
| **Founder** | Nico |
| **Type** | AI logo-generation app |
| **Revenue** | $85,000 · one-off · total revenue (as of March) — $26,000 in sales plus a $65,000 sale of Make Logo AI |
| **Revenue — amount** | $85,000 |
| **Revenue — period** | one-off |
| **Revenue — metric** | total revenue |
| **Revenue — as of** | March |
| **Revenue — notes** | $26,000 in sales plus a $65,000 sale of Make Logo AI |
| **Traffic / users** | 1,500 MRR or something like that |
| **Engagement** | — |
| **Tech stack** | JavaScript; Next UI; Cursor; v0; Figma; Dribbble; Google Images; Framer; Tally; Hotjar |
| **Tech stack — removed** (not found in transcript) | Next.js |
| **Marketing channels** | Facebook Ads; Instagram Ads; Google Ads; SEO; Acquire.com |
| **Marketing tactics** | He initially validated Make Logo AI organically, then ran basic static ads, created audience-specific landing pages, and used video and static ads for To Notes. The ads were designed to look organic and focus on the user's problem without mentioning the app name until the call to action. |
| **Pricing model** | Make Logo AI used a one-time payment, with packs of 5, 10, or 15 logo options and customization options. To Notes began with a one-time lifetime pass and later switched to a subscription priced at $60/year or $12/month. |
| **Customer count** | Around 10,000 users for To Notes |
| **Growth metrics** | Built 17 apps in one year; Grew apps from 0 to $7,000 monthly recurring revenue; To Notes generated $77,000 in sales before being sold for $200,000; Make Logo AI generated $26,000 in sales before being sold for $65,000; Two apps were sold for a combined $265,000; Spent two months teaching himself to code; Resigned from a bank summer job after 3 days; Was 19 years old when he resigned; Used a hotel room for two months to learn coding; The Make Logo AI transaction closed in March, approximately six months after work began; Made his first dollar online after initially avoiding a target of $10,000 or $100,000 for his first project |
| **Notable quotes** | I grew my apps from 0 to 7,000 of monthly recurring revenue with Facebook ads; Don't get emotionally attached to the products; Just try to make your first dollar online first and forget about scalability |
| **Other notable facts** | Make Logo AI used a Typeform-based flow to collect project information, logo preferences, and payment without a backend.; Make Logo AI's customers included people curious about AI and small entrepreneurs who did not want to pay a designer for a full logo.; He learned about dropshipping and running Facebook ads through Facebook groups and was hired as a freelancer for a Belgian clothing brand.; He used a four-part criteria to evaluate ideas: personal value, market scale, ability to execute based on his skills, and profitable distribution.; He built prototypes quickly, spoke with users early, and focused on essential features rather than unnecessary features.; For To Notes, he spent between $20 and $100 per day on ads. |

### 143. I Built a $10K/Month App from My Mom's Basement

| Field | Value |
|---|---|
| **Published** | 2025-03-25 |
| **Business** | Curiosity Quench; PostBridge |
| **Description** | Consumer mobile app and social media scheduling SaaS |
| **Category** | Mobile App |
| **Vertical** | Creator & Social Media |
| **MRR (normalised)** | $10,000 |
| **MRR basis** | The founder explicitly states that the two startups together make $10,000 a month. |
| **Website** | — |
| **Founder** | Jack Ficks |
| **Type** | Consumer mobile app and social media scheduling SaaS |
| **Revenue** | $10,000 a month; Curiosity Quench: $3,000 a month in monthly recurring revenue and over $60,000 in the last year; PostBridge: $7,000 in monthly recurring revenue and about $40,000 in the first five months · monthly, annual, and first five months · monthly recurring revenue and revenue (as of in the last year; in the first five months) — The two startups together make $10,000 a month. |
| **Revenue — amount** | $10,000 a month; Curiosity Quench: $3,000 a month in monthly recurring revenue and over $60,000 in the last year; PostBridge: $7,000 in monthly recurring revenue and about $40,000 in the first five months |
| **Revenue — period** | monthly, annual, and first five months |
| **Revenue — metric** | monthly recurring revenue and revenue |
| **Revenue — as of** | in the last year; in the first five months |
| **Revenue — notes** | The two startups together make $10,000 a month. |
| **Traffic / users** | Curiosity Quench has over 100,000 downloads and reached 100,000 users. |
| **Engagement** | — |
| **Tech stack** | Next.js; React Native; Expo; ChipFast; Supabase; ChatGPT; PostHog; CapCut; Twitter API |
| **Tech stack — removed** (not found in transcript) | JavaScript |
| **Marketing channels** | TikTok; Instagram; Twitter; YouTube; X |
| **Marketing tactics** | He spends one hour a day on organic marketing with no ad spend, repeatedly posts short videos built from a reusable 2x2 images-and-caption template, and uses captions and pinned comments as calls to action to download the app. He creates TikTok and Instagram accounts, warms them up for two days by scrolling, commenting, following people in his niche, and saving viral videos before posting. He recreates videos from proven examples, iterates daily rather than batching, and runs three Instagram accounts to space posts at least three or four hours apart. He also validates ideas by posting short T… |
| **Pricing model** | Curiosity Quench charges about $30 a year for a subscription with a 7-day free trial. PostBridge starts at $9 a month, has additional pricing tiers, and uses a 7-day free trial with no free version and a 40% discount on yearly pricing. |
| **Customer count** | — |
| **Growth metrics** | Curiosity Quench took 4 months to build.; PostBridge hit $7,000 in monthly recurring revenue after four and a half months.; Curiosity Quench has over 100,000 downloads.; One 2x2 template posted over 300 times on two accounts drove 60 to 70,000 signups and brought in hundreds of millions of views.; The founder spends one hour a day marketing and says he generated over 300 million views and made 1,000 videos.; Running costs are around $400 a month, including $200 a month for the Twitter API, with margins over 95%.; A Starter Story A/B test using PostHog increased conversion rate by over 300%.; Jack runs three Instagram accounts.; He works 2 to 4 focused hours after waking and 2 to 4 hours aft… |
| **Notable quotes** | The biggest reason most people over complicate building profitable apps is because they're not trying to solve a painful enough problem.; The easiest way to make a successful business is really just to solve your own problems.; Just keep trying different things even when something doesn't work. |
| **Other notable facts** | Jack quit his McDonald's job and dropped out of college three years before the interview to pursue online businesses.; He built both startups from his mom's basement.; Curiosity Quench helps people scroll less on their phones by giving them hobby-based action plans.; PostBridge lets users schedule social media posts from one place.; Jack generated Curiosity Quench's idea from his own phone-scrolling problem and PostBridge's idea from spending 30 minutes per day posting the same content to every platform.; His first ideas included making a book, selling T-shirts, and running a crypto YouTube channel. |

### 144. The $10M AI SaaS Playbook

| Field | Value |
|---|---|
| **Published** | 2025-03-18 |
| **Business** | Jenny AI |
| **Description** | Collection of edtech tools |
| **Category** | Portfolio of Products |
| **Vertical** | Education & Learning |
| **MRR (normalised)** | $833,333 |
| **MRR basis** | Annual revenue of over $10 million divided by 12 gives a monthly recurring revenue of approximately $833,333. |
| **Website** | — |
| **Founder** | David Park |
| **Type** | Collection of edtech tools that helps researchers research, write, and perform other tasks with AI assistance |
| **Revenue** | over $10 million a year · annual · revenue — The company is profitable; the speaker said the majority of growth came in the last two years. |
| **Revenue — amount** | over $10 million a year |
| **Revenue — period** | annual |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The company is profitable; the speaker said the majority of growth came in the last two years. |
| **Traffic / users** | over 5 million users |
| **Engagement** | — |
| **Tech stack** | AI |
| **Marketing channels** | TikTok; Instagram; Instagram Reels; YouTube Shorts; email; direct messages; influencer marketing; paid ads; meme pages; aggregate accounts; affiliate bonuses; coupon codes; UTM links |
| **Marketing tactics** | David uses a three-step distribution process: gather information about target users and relevant influencers, test content types and creators, then extend winning content through series, reposting, additional accounts, translations, influencer partnerships, and paid ads. His content strategy includes testing people on camera, hooks, accounts, editing pace, lighting, and SIM cards; posting at least one video daily; repurposing videos across short-form platforms; rewriting each native platform's hook text; contacting influencers through both email and DMs; following up within a few days; struct… |
| **Pricing model** | Free trials with paid subscriptions; some UGC deals include base monthly salary plus incentives based on coupon redemptions, views, clicks, or a percentage of LTV |
| **Customer count** | tens of thousands of paid users from the Point of View series |
| **Growth metrics** | Revenue grew from $0 to $10 million in 2 years; The majority of growth came in the last two years; over 5 million users; Point of View was posted about twice a week for maybe half a year; Point of View generated hundreds of millions of views; Point of View generated tens of thousands of paid users; David said Point of View probably generated over half a million dollars; The company once had five accounts posting similar content across platforms; 15 videos were going out every single day across those accounts; One account with 48 followers sometimes received more views than the main account with 55k followers; The Starter Story Underdog video featuring David received 1 million views; More th… |
| **Notable quotes** | A video with 10,000 views that somehow hits the pocket of viewers that love your product and they're immediately evangelized I would say that is like very viral; Once you have one viral video you can basically milk that Discovery into 10x or even 100x the initial views; The first few emails you send will probably be super cringe and they're probably going to get ignored and your first influence partner ship will probably be painful |
| **Other notable facts** | Jenny AI's tools support AI-assisted research and writing.; David described growth as distribution, conversion, and retention.; The company has operated accounts including Jenny AI USA, Jenny AI Germany, and Jenny AI Australia, plus an account entirely in Mandarin.; David's Point of View series changed the opening situation, such as waking up, walking a dog, or being at a restaurant, while retaining the same latter portion.; Influencer deals can include exclusivity, Instagram Story and bio placement, and video usage rights.; Negotiated examples included three videos for $1,200 instead of $500 per video, a proposed 30% or 40% bulk-order discount, and 30% more for an additional TikTok posting. |

### 145. I Quit My Job & Accidentally Built A $10M Business

| Field | Value |
|---|---|
| **Published** | 2025-03-08 |
| **Business** | Oceans |
| **Description** | Offshoring services business providing high-skill operational outsourcing to entrepreneurs, e-commerce brands, and… |
| **Category** | Agency / Service |
| **Vertical** | AI & Automation (horizontal) |
| **MRR (normalised)** | — |
| **MRR basis** | $650k is a stated revenue figure for 2022 without a monthly run-rate, annual period, or cumulative span sufficient to de |
| **Website** | — |
| **Founder** | Ian |
| **Type** | Offshoring services business providing high-skill operational outsourcing to entrepreneurs, e-commerce brands, and service businesses |
| **Revenue** | $650k in Revenue · 2022 (as of 2022) — First year in business; the business was founded in late 2021 and signed its first contract in February 2022. |
| **Revenue — amount** | $650k in Revenue |
| **Revenue — period** | 2022 |
| **Revenue — metric** | revenue |
| **Revenue — as of** | 2022 |
| **Revenue — notes** | First year in business; the business was founded in late 2021 and signed its first contract in February 2022. |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Git; Google Sheets; Google Classroom; G Suite; Stripe; Notion; TLD DV; HubSpot |
| **Marketing channels** | Referrals; Word of mouth |
| **Marketing tactics** | From the beginning, Ian used referrals as the primary growth method. The first customers came from pitching friends at reduced pricing and then expanding through referrals from existing customers. The service model was also designed to make customers look and feel successful so they would recommend Oceans. |
| **Pricing model** | Monthly pricing per headcount, generally around $3 to $4,000 per month per headcount; executive assistants cost less and financial controllers cost more. |
| **Customer count** | Hundreds of clients |
| **Growth metrics** | Signed its first contract in February 2022; Generated $650k in Revenue in 2022; Closed at about $15 million in Revenue last year; Built the business to over $10 million a year in 3 years; Hires 30 to 40 people a month; Started with three people for its first cohort; Originally owned 100% of the business; Lived in New York for 10 years before moving to New Hampshire; Wakes at around 5:36 and starts work around 7:30; Usually works until 6 or 7 p.m. |
| **Notable quotes** | The idea came in late 2021, signed our first contract in February of 2022.; From the beginning, I knew that referrals were going to be the secret to our growth.; Go find something that people already want and do it differently or better, and there's your equation for a successful business. |
| **Other notable facts** | Hires people mostly in Sri Lanka, with a few in South Africa and other locations.; Matches personnel full-time, 40 hours a week, for long-term client assignments.; The company pays its personnel's wages and benefits and retains the profit difference.; Ian previously worked in finance, venture capital, and private equity, and previously built and sold a venture-backed app company.; Initially hired an executive assistant with 10 years of experience to create its training course.; The first three customers received reduced pricing and did not generate profit. |

### 146. The Underdog: From $200K in Debt to $1M App Maker

| Field | Value |
|---|---|
| **Published** | 2025-02-26 |
| **Business** | portfolio of mobile apps |
| **Description** | Portfolio of mobile apps |
| **Category** | Portfolio of Products |
| **Vertical** | Other / Miscellaneous |
| **MRR (normalised)** | $60,000 |
| **MRR basis** | Current stated monthly revenue is $50,000 to $60,000; using the most recent upper end as the current run-rate. |
| **Website** | — |
| **Founder** | Adam Liel |
| **Type** | Portfolio of mobile apps |
| **Revenue** | $50,000 to $60,000 per month · monthly · revenue (as of the last couple of months) — Revenue increased from $10,000 a month to $50,000 per month after creating a new pay wall and onboarding flow; an earlier app generated around $11,000 a month. |
| **Revenue — amount** | $50,000 to $60,000 per month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | the last couple of months |
| **Revenue — notes** | Revenue increased from $10,000 a month to $50,000 per month after creating a new pay wall and onboarding flow; an earlier app generated around $11,000 a month. |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | ChatGPT |
| **Marketing channels** | YouTube |
| **Marketing tactics** | Testing apps through a YouTube channel and sharing feedback about what worked and what did not. |
| **Pricing model** | App monetization through recurring revenue; the transcript mentions a new pay wall. |
| **Customer count** | — |
| **Growth metrics** | Over 50 apps built; Nine apps released in one month; Revenue increased from $10,000 a month to $50,000 per month; An app sold for $224,000; 100% debt-free as of last month; Prior web agency generated around $300,000 profit per year at its high point |
| **Notable quotes** | I spent 6 months building this lawn mowing app I released it and it didn't actually do all that well; I created a new pay wall and I created a new onboarding flow and that turned my revenue from generating $10,000 a month to $50,000 per month pretty much overnight; the more you put out into the world that has a positive impact or a positive net positive result the money and the revenue flow as a byproduct |
| **Other notable facts** | Adam started with $200,000 of unsecured debt.; His former web agency collapsed after Wix and Squarespace made it possible to build websites for $10 a month.; He built his first lawn-mowing app for six months before releasing it.; He pursued a one-app-per-month challenge for two years.; He sold one app for two times its annual revenue, or $224,000.; His app portfolio began generating enough recurring revenue to avoid selling apps to maintain a pipeline. |

### 147. The Underdog: From Life Changing Accident to $100M/Year

| Field | Value |
|---|---|
| **Published** | 2025-02-07 |
| **Business** | Neuro |
| **Description** | Functional gum and mints company |
| **Category** | Physical Product |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $10,000,000 |
| **MRR basis** | The founder stated revenue is almost $10 million per month, which is a current monthly run-rate figure. |
| **Website** | — |
| **Founder** | Ryan Chen |
| **Type** | Functional gum and mints company |
| **Revenue** | almost $10 million a month · monthly · revenue |
| **Revenue — amount** | almost $10 million a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | — |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Hostinger |
| **Marketing channels** | Indiegogo; Reddit; Dr. Oz; Shark Tank; organic earned media; TikTok; Instagram |
| **Marketing tactics** | Crowdfunded on Indiegogo, obtained support through a Reddit newsgroup, earned media coverage including Time Magazine and Dr. Oz, appeared on Shark Tank, cultivated celebrity and professional-athlete word-of-mouth, and published videos that went viral on TikTok. |
| **Pricing model** | — |
| **Customer count** | — |
| **Growth metrics** | Raised $30,000 on Indiegogo in 3 or 4 days; First-year revenue was a little over 100k; Second-year revenue was 750k; The business is described as a $100 million company; The first 4,000 lb of gum was shipped from Kent's apartment; Employee satisfaction was 96%; Neuro was described as a top 10 TikTok shop brand |
| **Notable quotes** | We are now doing almost $10 million a month; Organic earned media ... Shark Tank was huge for us; Success is defined by how high you bounce back from Rock Bottom |
| **Other notable facts** | Ryan Chen founded Neuro with his best friend and business partner Kent.; The first product formulas were made in Kent's dorm room and were tested by Ryan's Hulu coworkers.; Daniel Lubetzky consulted and defended Ryan and Kent for 18 months during a trademark lawsuit.; Neuro was featured on Shark Tank and appeared on Dr. Oz.; Celebrities mentioned as organic Neuro advocates include Ashley Graham, Steve Aoki, Joe Rogan, and Andrew Schulz.; Ryan and Kent left their previous jobs at Hulu and Sony Music to work on the business full-time. |

### 148. How I Built It: $20K/Month AI App as a Non-Technical Founder

| Field | Value |
|---|---|
| **Published** | 2025-01-22 |
| **Business** | Sheets Resume |
| **Description** | AI Resume Builder |
| **Category** | AI Wrapper |
| **Vertical** | Career & Hiring |
| **MRR (normalised)** | $20,000 |
| **MRR basis** | The founder explicitly stated revenue of $20,000 a month, which is the most recent monthly run-rate; $220,000 in second- |
| **Website** | https://sheetsres.com |
| **Domains mentioned** | sheetsres.com |
| **Founder** | Colin Macintosh |
| **Type** | AI Resume Builder |
| **Revenue** | $220,000 of sales; $20,000 a month · second month of business · total sales and monthly revenue (as of in our second month of business) — In the second month, the business did $220,000 of sales. The speaker also described it as a $250,000 per year business. |
| **Revenue — amount** | $220,000 of sales; $20,000 a month |
| **Revenue — period** | second month of business |
| **Revenue — metric** | total sales and monthly revenue |
| **Revenue — as of** | in our second month of business |
| **Revenue — notes** | In the second month, the business did $220,000 of sales. The speaker also described it as a $250,000 per year business. |
| **Traffic / users** | Probably thousands of resumes were created for people during the first week of the free launch. |
| **Engagement** | — |
| **Tech stack** | OpenAI; Gemini; PHP; Laravel; REST API; AWS; Gmail; Stripe; Mercury |
| **Marketing channels** | Word of mouth; Affiliate marketing; Google Ads; Reddit; SEO |
| **Marketing tactics** | The founders initially launched the product for free and promoted it through an edited post on the founder's existing Reddit resume-advice post. After seeing strong usage and word of mouth, they enabled pricing. To scale word of mouth, they hired an affiliate marketing agency, set up rudimentary Google Ads as a training mechanism for Google's algorithm, and published multiple Reddit posts about resume building, job-hunting questions, interviewing, and salary negotiation. They linked to the product from Reddit posts without making it the primary call to action. |
| **Pricing model** | $99 for lifetime access and $29 for one week of access; the business does not offer monthly subscriptions. |
| **Customer count** | — |
| **Growth metrics** | $1,000 day within one week; $220,000 of sales in the second month; $20,000 a month in the second month; Nearly 100% product margin; Approximately 90% net margins; Launched August 26th; Took about 4 months to build; About 20,000 resume-review questions answered over the last 6 years; A Reddit resume-advice post received 500 upvotes; The founder spends about 5 to 10 hours a week on the project |
| **Notable quotes** | In our second month of business we did $220,000 of sales that's nearly 100% margin; We launched it August 26th of this year and within one week we had gotten our first $1,000 day; Word of mouth is huge it's it's so invaluable |
| **Other notable facts** | Colin Macintosh is founder and CEO and created the AI Resume Builder with his friend Nate.; Nate is a software engineer at Eventbrite and took about 4 months to build the product.; The founder previously worked at Bridgewater Associates and later became a recruiter.; The founder and Nate split the business three ways with two other partners found through Reddit.; Before building the product, they conducted resume reviews priced at a couple hundred dollars, then $300 and $400.; The business is a side project built to scale without the founder's full-time involvement. |

### 149. He Made $10M with 3 iPhone Apps

| Field | Value |
|---|---|
| **Published** | 2024-12-29 |
| **Business** | Riz GPT, Umax, CI, and Apex |
| **Description** | AI mobile applications and an all-in-one self-improvement ecosystem |
| **Category** | Mobile App |
| **Vertical** | Health & Fitness |
| **MRR (normalised)** | $1,000,000 |
| **MRR basis** | CI revenue is stated as over $1 million per month, so $1,000,000 is the current monthly run-rate figure; it was the most |
| **Website** | — |
| **Founder** | Blake Anderson |
| **Type** | AI mobile applications and an all-in-one self-improvement ecosystem |
| **Revenue** | Riz GPT: $2.2 million in annual revenue; Umax: almost $5 million in revenue in the past year; CI: over $1 million per month; apps combined: almost $20 million per year · annual and monthly (as of past year) — CI was launched about 6 months ago. Riz GPT initially generated $80k MRR, scaled to a little over $250k MRR, and later plateaued at $150k to $200k MRR. |
| **Revenue — amount** | Riz GPT: $2.2 million in annual revenue; Umax: almost $5 million in revenue in the past year; CI: over $1 million per month; apps combined: almost $20 million per year |
| **Revenue — period** | annual and monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | past year |
| **Revenue — notes** | CI was launched about 6 months ago. Riz GPT initially generated $80k MRR, scaled to a little over $250k MRR, and later plateaued at $150k to $200k MRR. |
| **Traffic / users** | Riz GPT received 45,000 downloads on its first major promotional day, 200,000 downloads that week, and 500,000 downloads in the first month. |
| **Engagement** | — |
| **Tech stack** | Figma; Cursor; CapCut; Mercury; Upwork; React Native; Expo; ChatGPT; Apple |
| **Tech stack — removed** (not found in transcript) | Node.js |
| **Marketing channels** | TikTok; Instagram; influencer marketing; internal UGC; organic account growth; user-generated content |
| **Marketing tactics** | He found two underground creators, paid each $50 for promotion, and generated 5 million to 10 million views. He recommends influencer marketing, internal UGC, organic account growth, and user-generated content. For creator outreach, he used Discord links hidden in Instagram bios, sent messages every 10 minutes, and even contacted creators' parents. He advocates constant iteration, testing different strategies, and doubling down on tactics that produce profitable returns. He validates ideas by creating a target-customer account and consuming niche content on social media. |
| **Pricing model** | Subscription, generally with lower price points; Superwall is recommended for split-testing weekly, yearly, and monthly offers at different price points and in-app placements. |
| **Customer count** | — |
| **Growth metrics** | Riz GPT launched in July 2023; Riz GPT reached $80k MRR from the jump; Riz GPT scaled to a little over $250k MRR; Riz GPT later plateaued at $150k to $200k MRR; CI launched about 6 months ago; Umax generates a little over $100,000 in profit per month consistently; CI generates a few hundred thousand in profit per month; Apex started a little over one and a half months ago; Apple's cut is stated as closer to 20% of revenue up to the first $1 million in earnings and closer to 33% beyond that; Backend AI costs are stated to be under 3% unless using image generation or advanced voice mode; Internal UGC businesses generally see 50% to 80% profit margins; Influencer marketing businesses generally… |
| **Notable quotes** | The first app that I built was called Riz GPT, it's at 2.2 million in annual revenue.; When I was building UMX, I had obviously just split from my previous team and I felt like I had something to prove.; You have to be able to think on your own and think from first principles as opposed to constantly just doing what others say. |
| **Other notable facts** | Blake taught himself to code with ChatGPT in May or June 2023, less than two years before the interview.; He set a goal after graduating college to make $50,000 on his own within 12 months.; He built an Ethereum mining machine in 2016 or 2017 and scaled Instagram meme pages in high school.; Umax was identified as an opportunity because people were already spending heavily on skincare, haircare, gua sha, and related physical products.; Apex is described as an all-in-one self-improvement ecosystem with content, a free community, free mobile apps, and low-margin physical products.; Riz GPT's first version lacked notifications, reviews, a clean design, and an effective paywall. |

### 150. The Underdog: He Turned His Last $1,000 Into $150M

| Field | Value |
|---|---|
| **Published** | 2024-12-17 |
| **Business** | lemlist |
| **Description** | software as a service business and sales tool for sales teams |
| **Category** | SaaS / Web App |
| **Vertical** | Marketing & Sales |
| **MRR (normalised)** | $2,500,000 |
| **MRR basis** | $30 million ARR divided by 12 equals $2.5 million in current monthly recurring revenue; $10 million EBDA is not used. |
| **Website** | — |
| **Founder** | Guam Mubes |
| **Type** | software as a service business and sales tool for sales teams |
| **Revenue** | $30 million AR · annual · ARR (as of right now) — Also stated $10 million in EBDA. |
| **Revenue — amount** | $30 million AR |
| **Revenue — period** | annual |
| **Revenue — metric** | ARR |
| **Revenue — as of** | right now |
| **Revenue — notes** | Also stated $10 million in EBDA. |
| **Traffic / users** | — |
| **Engagement** | Retention is described as the name of the game in SaaS; the founder focused on identifying the 'magnet Persona,' described as sales reps. |
| **Tech stack** | — |
| **Marketing channels** | live demos; outbound; community; content |
| **Marketing tactics** | The founder closed the first 100 customers through live demos and outbound, personally wrote campaigns for customers in exchange for their participation in success stories, pushed content into a community, collected feedback, improved the product, and repositioned lemlist as a sales tool for sales reps. |
| **Pricing model** | software subscription |
| **Customer count** | — |
| **Growth metrics** | The first MVP took two weeks of work.; The founder closed the first 100 customers.; lemlist made $600 in its first month.; lemlist grew 40% month over month before a product redesign.; Activation rate increased to about 35% from 15%.; Growth was about 60% the next month.; It took one year to go from zero to $250,000 ARR.; Annual recurring revenue reached $1 million in year two.; Annual recurring revenue was about $8 million in year three.; Annual recurring revenue reached $10 million after three and a half years.; The company plateaued at around $10 million ARR before the magnet Persona strategy.; The company was valued at over $150 million in just four years.; The team was about 100 people… |
| **Notable quotes** | My ambition was to personalize the internet.; The magnet Persona strategy allowed lemlist to break through the plateau.; It's an overnight success story that took 10 years for me. |
| **Other notable facts** | The founder's first business was a T-shirt business with his father, which sold only six shirts after launch.; He worked in lead generation for about a year and booked meetings for tens of companies in different industries.; An earlier startup project was abandoned after LinkedIn changed one line of code.; Two of the founder's co-founders later exited the company.; The founder described the company as a sales tool for sales teams.; The founder had close to 10 years of combined entrepreneurial experience. |

### 151. I Make $15K/Month With 2 AI Apps

| Field | Value |
|---|---|
| **Published** | 2024-12-02 |
| **Business** | Resume Maker Online and AI Carousels |
| **Description** | SaaS products for resume creation and AI-generated social media carousels |
| **Category** | Portfolio of Products |
| **Vertical** | Career & Hiring |
| **MRR (normalised)** | $15,000 |
| **MRR basis** | Founder stated that the two products together bring in about 15K MRR. |
| **Website** | — |
| **Domains mentioned** | resumemaker.online; aicarels.com |
| **Founder** | Fernando Pro designer |
| **Type** | SaaS products for resume creation and AI-generated social media carousels |
| **Revenue** | about 15K · monthly · MRR — Together, the two products bring in about 15K MRR. |
| **Revenue — amount** | about 15K |
| **Revenue — period** | monthly |
| **Revenue — metric** | MRR |
| **Revenue — as of** | — |
| **Revenue — notes** | Together, the two products bring in about 15K MRR. |
| **Traffic / users** | — |
| **Engagement** | — |
| **Tech stack** | Notion; Bubble; AI |
| **Marketing channels** | Product Hunt; SEO; free tools; Twitter; LinkedIn; affiliate program; email |
| **Marketing tactics** | Built about 30 complementary free tools to bring in SEO traffic, launched on Product Hunt, shared the building process publicly on Twitter and LinkedIn, and launched affiliate programs for both products. |
| **Pricing model** | Freemium with subscriptions unlocking AI and pro features; AI Carousels launched at $9.99 and later moved to $4.95; Resume Maker Online started with one-time purchases and was relaunched this year with a subscription model. |
| **Customer count** | Five users signed up after the AI Carousels launch; the transcript does not state the total number of paying customers. |
| **Growth metrics** | A year after leaving his 9-to-5 job, Fernando became a solopreneur.; AI Carousels went from 0 to 1 through a 10-day challenge.; About 30 free tools were built for both products.; The two products together brought in about 15K MRR.; Business costs were around 1,000 per month, with profit margins above 90%.; Fernando works four hours a day. |
| **Notable quotes** | I only need 0.1% of the market and I'm good.; I don't sell design I sell time.; The ultimate validation is when you get pay for it. |
| **Other notable facts** | Fernando is originally from Argentina and lives in Sweden.; He previously ran an agency for over a decade.; He left his 9-to-5 job after unexpectedly being fired.; He works as a solo entrepreneur and has no employees or co-founders, though he brought in a freelancer for content tasks.; Both products use a freemium model.; Fernando works four hours of deep work each morning and also works on weekends. |

### 152. How I Built It: $12K/Month Micro SaaS

| Field | Value |
|---|---|
| **Published** | 2024-11-22 |
| **Business** | Screenshot One |
| **Description** | Subscription SaaS product |
| **Category** | SaaS / Web App |
| **Vertical** | AI & Automation (horizontal) |
| **MRR (normalised)** | $12,000 |
| **MRR basis** | Founder stated recurring revenue is around $12,000 a month; the $100,000/year SaaS figure is an annual price, not curren |
| **Website** | — |
| **Founder** | Demitro |
| **Type** | Subscription SaaS product that automates screenshots for companies |
| **Revenue** | around $12,000 a month · monthly · recurring revenue (as of currently) — The interview also describes the product as a $100,000 per year SaaS product. |
| **Revenue — amount** | around $12,000 a month |
| **Revenue — period** | monthly |
| **Revenue — metric** | recurring revenue |
| **Revenue — as of** | currently |
| **Revenue — notes** | The interview also describes the product as a $100,000 per year SaaS product. |
| **Traffic / users** | — |
| **Engagement** | Monthly churn was 11%, then close to 7%; the founder wants it below 5%. |
| **Tech stack** | TypeScript; headless browsers; Puppeteer Library; Go; Cloudflare; Google Search Console; Google Keyword Planner; PostHog Analytics; PostHog; Crisp |
| **Marketing channels** | Twitter; Google; Zapier; Make; Product Hunt; SEO; YouTube; Reddit; Hacker News; cold email |
| **Marketing tactics** | The founder promoted the product on every possible platform, contacted potential paying customers directly, listed the product on Zapier and Make, launched it on Product Hunt, published technical tutorials on YouTube, and optimized SEO content around relevant keywords. He also contacted churned customers by email to ask why they canceled and used the answers to improve targeting and messaging. |
| **Pricing model** | Subscription, with a base plan starting at $17 a month and extra charges for additional screenshots and features; the initial price was $5 and the first customer paid $7 per month. |
| **Customer count** | 280 customers |
| **Growth metrics** | Built and launched Screenshot One in 5 months; First paying customer came after one month of promotion; Around 2 million screenshots rendered; Profit margins of 40 to 60%; Server costs of $3,000 to $4,000 per month; Total expenses of around $4,500; Monthly churn decreased from 11% to close to 7%; Around 10 paying customers outside the founder's network was described as strong validation |
| **Notable quotes** | You need to be persistent enough to try anything to just get to this first dollar.; Once you have at least 10 paying customers from outside your network and you didn't know them, they just came and bought your product and used it, that's for me like an ultimate validation.; You need to talk after churn because sometimes you just realize somebody came and they're not your customer. |
| **Other notable facts** | The founder previously worked as a backend and server-side developer building APIs.; He initially focused on API products after narrowing a large list of ideas.; He built an email validation API before focusing on Screenshot One.; The founder describes himself as a solopreneur.; He considers himself to be for developers who need to write code to integrate the product, rather than a no-code product.; He reads for at least one hour every morning. |

### 153. How I Built It: $37K/Month Notion App

| Field | Value |
|---|---|
| **Published** | 2024-11-07 |
| **Business** | Notion Forms |
| **Description** | SaaS form builder for Notion users |
| **Category** | SaaS / Web App |
| **Vertical** | Productivity & Workflow |
| **MRR (normalised)** | $37,000 |
| **MRR basis** | The founder stated current monthly recurring revenue as close to $37k per month; the $400,000+ annual figure is consiste |
| **Website** | — |
| **Founder** | Julian |
| **Type** | SaaS form builder for Notion users |
| **Revenue** | close to 37k of monthly working Revenue; over $400,000 a year · monthly — The interview also states he is making a doctor's salary; $90 was his first yearly subscription sale. |
| **Revenue — amount** | close to 37k of monthly working Revenue; over $400,000 a year |
| **Revenue — period** | monthly |
| **Revenue — metric** | revenue |
| **Revenue — as of** | — |
| **Revenue — notes** | The interview also states he is making a doctor's salary; $90 was his first yearly subscription sale. |
| **Traffic / users** | close to 100K registered users |
| **Engagement** | — |
| **Tech stack** | PHP; Laravel; AWS; Stripe; Amplitude; Crisp; Sentry; Featurebase; Cursor |
| **Tech stack — removed** (not found in transcript) | Next.js; PostgreSQL |
| **Marketing channels** | Reddit; Facebook groups; Twitter; Product Hunt; Google Ads |
| **Marketing tactics** | Julian published the project and posted in Notion-related communities, including Reddit, Facebook groups, and Twitter. He also used a viral loop in which users shared embedded forms with links back to the product. His Product Hunt launch produced more eyes, a backlink, and traffic but no sales. |
| **Pricing model** | Subscription pricing with monthly and yearly plans and multiple tiers; he found that selling something for $50 per month was much easier than selling one thing for $500 one time. |
| **Customer count** | — |
| **Growth metrics** | 100K registered users; close to 37k of monthly revenue; over $400,000 a year; MVP built in 6 days; 3 full-time employees and 1 part-time employee; total salary for employees is 5K; around 1K per month for servers and SaaS tools; around 3K per month on ads; around 2K per month with freelancers; his first subscription was a yearly subscription for $90; Notion's API made it possible to build integrations and products on Notion; Julian is 28 years old |
| **Notable quotes** | I just spent 6 days working on it creating like a small MVP; close to 100K registered users; the more users you have the more people see your product and then the more users you have |
| **Other notable facts** | The founder built the product after Notion released its API.; He started with a fully free product during beta and later made a Pro feature paid.; Existing users received a 4% lifetime discount code when subscriptions launched.; He used an AI chatbot trained on product documentation and past conversations for support.; He built the first year of the product alone before hiring help.; His team uses a public roadmap through Featurebase. |

