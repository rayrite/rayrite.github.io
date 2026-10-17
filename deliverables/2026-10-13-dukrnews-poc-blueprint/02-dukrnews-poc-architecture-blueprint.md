# DUKRNews — Proof-of-Concept Architecture Blueprint (Micro-Library Compositing)

`Research date: 2026-10-12 · Current as of: 2026-10-13`
**Companion files:** [01 Feature Catalog](01-dukrnews-composite-feature-catalog.md) · [03 FOSS Stack Research](03-software-research-dukrnews-foss-stack.md) · [04 QA Report](04-quality-assurance-report.md)

---

## TL;DR

* **Approach:** Don't fork one big aggregator. Build a thin **TypeScript core** (SvelteKit + Fastify + PostgreSQL) and compose **~45 small, actively maintained FOSS libraries** around it, plus a **Python ML sidecar** for the models that only exist in Python (embeddings, NLI grounding, NER, ASR, TTS, translation).
* **Postgres is the center of gravity.** `pgvector` handles embeddings and clustering lookups, `ltree` handles comment trees and invitation lineage, and job queues run on Valkey (BullMQ), with `pg-boss` as a fallback for small installs. One database to back up.
* **AI is a policy layer, not a dependency.** A local model (Ollama) is the default. BYOAI keys route through a LiteLLM proxy. Every generated sentence must pass a **Reality Check** grounding model before display.
* **Protocols over platforms.** RSS/Atom/JSON Feed out of every list, ActivityPub via **Fedify**, WebSub in, Google Reader/Fever APIs for existing clients, **MCP** for agents and IDEs.
* **License strategy:** AGPL-3.0 core (same as daily.dev's apps, FreshRSS, Folo, Lemmy). Avoid source-available dependencies (SSPL, Elastic-2.0, Sustainable Use). Run GPL-3.0 components (e.g. Piper TTS) as **separate processes**, not linked libraries.

> [!NOTE]
> Code in this document is an **illustrative skeleton** written to show how the libraries compose. Library APIs change between versions; check each snippet against the versions pinned in [03 §3](03-software-research-dukrnews-foss-stack.md) before you build on it.

---

## 1. Design principles

| # | Principle | What it means in practice | Competitor lesson |
| :---: | :--- | :--- | :--- |
| 1 | Explainable by default | Every ranking, filter and AI output has a "why" panel and a provenance link | Google News opacity is its top criticism in the source report |
| 2 | Overridable | Users can turn off any algorithm; the chronological River is always available | HN/Lobsters users treat personalization as a defect |
| 3 | Exportable | OPML + JSON export of feeds, rules, trainer weights, annotations, shares | Feedly/Inoreader lock-in vs. NewsBlur portability |
| 4 | Local-first AI | Local models default; cloud AI is opt-in BYOAI | Inoreader BYOAI; privacy-sensitive users |
| 5 | Protocol-native | Every list is a feed and every collection is an ActivityPub actor | Flipboard federation; Lobsters JSON feeds |
| 6 | Small, swappable parts | Each capability sits behind an interface with ≥2 candidate libraries | MinIO archival (2026) and Piper relicensing (2025) show why |
| 7 | Cheap to self-host | Minimal profile targets **≤ 2 GB RAM** without GPU | NewsBlur needs 2–4 GB (Celery + Mongo + Postgres + Redis) |
| 8 | Publisher-respectful | No paywall bypass; outbound links prominent; AI bullets are hooks, not substitutes | Particle's "Citation Compact" |

---

## 2. System context

```mermaid
flowchart LR
  subgraph Sources
    RSS["RSS / Atom / JSON Feed"]
    WS["WebSub hubs"]
    MAIL["Newsletter email"]
    SOC["Mastodon / Bluesky / YouTube / Reddit"]
    WEB["Sites without feeds"]
    POD["Podcasts"]
    INTEL["NVD / OSV / CISA KEV"]
    USERS["User submissions"]
  end

  subgraph DUKR["DUKRNews core"]
    API["Fastify API + OpenAPI"]
    WEBAPP["SvelteKit web / PWA"]
    WORK["Pipeline workers (BullMQ)"]
    ML["dukr-ml sidecar (Python)"]
    FED["Fedify federation service"]
    MCP["MCP server"]
    PG[("PostgreSQL + pgvector")]
    VK[("Valkey")]
    S3[("S3 storage: SeaweedFS or Garage")]
    SRCH[("Meilisearch (optional)")]
    LLM["LiteLLM proxy"]
    OLL["Ollama (local LLM)"]
    HOOK["Svix webhook server"]
  end

  subgraph Consumers
    BROWSER["Browsers + extension"]
    MOBILE["Capacitor iOS / Android"]
    CLIENTS["Reeder / NetNewsWire via GReader API"]
    FEDI["Mastodon / Threads / Lemmy"]
    AGENTS["Claude Code / Cursor / agents"]
    AUTOM["Webhooks / Slack / SIEM"]
  end

  Sources --> WORK
  WORK <--> PG
  WORK <--> VK
  WORK <--> ML
  WORK --> LLM
  LLM --> OLL
  WORK --> S3
  WORK --> SRCH
  WORK --> HOOK
  API <--> PG
  API <--> SRCH
  WEBAPP --> API
  FED <--> PG
  MCP --> API
  BROWSER --> WEBAPP
  MOBILE --> API
  CLIENTS --> API
  FEDI <--> FED
  AGENTS --> MCP
  HOOK --> AUTOM
```

---

## 3. Service decomposition

| Service | Responsibility | Runtime | Key composed libraries | Scales by |
| :--- | :--- | :--- | :--- | :--- |
| `dukr-web` | SSR pages, zero-JS mode, PWA shell, Full Coverage pages | Node (SvelteKit 3) | SvelteKit, vite-plugin-pwa, Workbox, Dexie.js, tinykeys, Swiper, DOMPurify | Stateless replicas |
| `dukr-api` | REST, GReader/Fever compat, SSE stream, auth, PATs | Node (Fastify 5) | Fastify, @fastify/swagger, @fastify/rate-limit, Better Auth, Drizzle ORM | Stateless replicas |
| `dukr-ingest` | Fetch feeds, WebSub callbacks, newsletter SMTP, social adapters | Node workers | feedsmith, undici, smtp-server, mailparser, masto.js, @atproto/api | Queue concurrency |
| `dukr-extract` | Full text, sanitization, Markdown, images, recipes | Node workers | defuddle, @mozilla/readability, DOMPurify + jsdom, turndown | Queue concurrency |
| `dukr-cluster` | Dedup, embed, assign to Story, periodic re-cluster | Node + `dukr-ml` | pgvector, datasketch (MinHash), sentence-transformers or fastembed, HDBSCAN | Single leader + workers |
| `dukr-ml` | Embeddings, NLI grounding, NER, lean classifier, ASR, TTS, MT | Python (FastAPI) | sentence-transformers, LettuceDetect / HHEM, GLiNER, faster-whisper, Kokoro, Argos Translate | CPU or GPU pool |
| `dukr-synth` | TL;DR, consensus bullets, Q&A, briefings | Node workers | Vercel AI SDK → LiteLLM proxy → Ollama / BYOAI providers | Token budget |
| `dukr-rules` | Evaluate CEL rules, dispatch actions | Node workers | @marcbachmann/cel-js, re2 (node-re2), Apprise API, Svix | Queue concurrency |
| `dukr-fed` | ActivityPub actors, inbox/outbox, WebFinger | Node (Fedify) | Fedify, Fedify Postgres KV/MQ adapters | Queue concurrency |
| `dukr-mcp` | MCP tools/resources for agents and IDEs | Node | @modelcontextprotocol/sdk | Stateless |
| `dukr-media` | Audio briefings, podcast transcripts, image thumbnails | Python + Node | Kokoro-FastAPI, faster-whisper, sharp | GPU optional |

---

## 4. The news pipeline

### 4.1 Flow

```mermaid
flowchart TD
  A["fetch: feed / WebSub / email / social / submission"] --> B["normalize to DukrItem"]
  B --> C{"seen URL or GUID?"}
  C -- yes --> Z["update metadata only"]
  C -- no --> D["extract full text: defuddle, fallback readability"]
  D --> E["MinHash near-dup check"]
  E -- syndicated copy --> F["attach to existing item as mirror"]
  E -- new --> G["embed title + lede: dukr-ml"]
  G --> H["pgvector ANN against active Story centroids, 72h window"]
  H -- "cosine >= tau" --> I["join Story, update centroid"]
  H -- "cosine < tau" --> J["create candidate Story"]
  I --> K{"outlets >= 2?"}
  J --> K
  K -- no --> L["hold as candidate"]
  K -- yes --> M["enrich: entities, CVEs, lean, ownership, reputation"]
  M --> N["synthesize consensus bullets"]
  N --> O["Reality Check grounding per bullet"]
  O --> P["rank: gravity, blindspot, trainer, For You"]
  P --> Q["fan-out: rules, webhooks, push, AP outbox, SSE, search index"]
```

### 4.2 Stage contract

| Stage | Queue | Primary library | Fallback library | Target latency (p95) |
| :--- | :--- | :--- | :--- | :--- |
| Fetch | `ingest:fetch` | undici + feedsmith | rss-parser, @extractus/feed-extractor | 2 s per feed |
| Extract | `ingest:extract` | defuddle | @mozilla/readability; trafilatura via dukr-ml | 1.5 s |
| Near-dup | inline | MinHash (datasketch in dukr-ml) | SimHash in TS | 20 ms |
| Embed | `ml:embed` | sentence-transformers (multilingual small model) | fastembed (ONNX, CPU) | 60 ms CPU |
| Assign | inline SQL | pgvector HNSW | sqlite-vec (single-user mode) | 30 ms |
| Re-cluster | `cluster:batch` (every 15 min) | HDBSCAN | BERTopic for topic labels | 2 min batch |
| Enrich | `ml:enrich` | GLiNER + regex extractors | spaCy | 200 ms |
| Synthesize | `ai:synth` | Vercel AI SDK → LiteLLM | direct provider SDK | 8 s |
| Reality Check | `ml:verify` | LettuceDetect | HHEM-2.1-open; MiniCheck (stale) | 400 ms per bullet |
| Fan-out | `rules:eval`, `hooks:send` | cel-js + Svix | Apprise for chat targets | 1 s |

### 4.3 Normalized item schema (TypeScript)

```ts
// packages/core/src/item.ts
export interface DukrItem {
  id: string;                 // ULID
  sourceId: string;           // feed, adapter, or "submission"
  outletId: string | null;    // resolved publisher (domain → outlet registry)
  canonicalUrl: string;
  guid?: string;
  title: string;
  author?: string;
  publishedAt: Date;
  lang?: string;
  summaryHtml?: string;       // from feed
  contentHtml?: string;       // sanitized full text
  contentMd?: string;         // for LLM + MCP
  enclosures?: { url: string; type: string; length?: number }[];
  tags: string[];             // feed categories + inferred tags
  kind: "article" | "link" | "ask" | "show" | "tell" | "podcast" | "video" | "intel" | "newsletter";
}
```

### 4.4 Ingest + extract worker (skeleton)

```ts
// services/ingest/src/fetchFeed.ts
import { Worker, Queue } from "bullmq";
import { parseFeed } from "feedsmith";
import { request } from "undici";
import { db, feeds, items } from "@dukr/db";
import { eq } from "drizzle-orm";

const extractQ = new Queue("ingest:extract", { connection: { host: "valkey" } });

new Worker("ingest:fetch", async (job) => {
  const feed = await db.query.feeds.findFirst({ where: eq(feeds.id, job.data.feedId) });
  if (!feed) return;

  const res = await request(feed.url, {
    headers: {
      "user-agent": "DUKRNews/0.1 (+https://dukr.example/bot)",
      ...(feed.etag ? { "if-none-match": feed.etag } : {}),
      ...(feed.lastModified ? { "if-modified-since": feed.lastModified } : {}),
    },
  });
  if (res.statusCode === 304) return { notModified: true };

  const { format, feed: parsed } = parseFeed(await res.body.text());
  for (const entry of parsed.items ?? parsed.entries ?? []) {
    const inserted = await db.insert(items).values(toDukrItem(feed, format, entry))
      .onConflictDoNothing({ target: [items.sourceId, items.guidHash] })
      .returning({ id: items.id });
    if (inserted[0]) await extractQ.add("extract", { itemId: inserted[0].id });
  }
  await db.update(feeds).set({
    etag: res.headers.etag as string | undefined,
    lastModified: res.headers["last-modified"] as string | undefined,
    nextFetchAt: adaptiveNextFetch(feed),        // posting-rate-aware polling
  }).where(eq(feeds.id, feed.id));
}, { connection: { host: "valkey" }, concurrency: 32 });
```

```ts
// services/extract/src/extract.ts
import { JSDOM } from "jsdom";
import { Defuddle } from "defuddle/node";
import { Readability } from "@mozilla/readability";
import createDOMPurify from "dompurify";
import TurndownService from "turndown";

export async function extractArticle(html: string, url: string) {
  const dom = new JSDOM(html, { url });
  let result = await Defuddle(dom, url, { markdown: false }).catch(() => null);
  if (!result?.content || result.wordCount < 80) {
    const r = new Readability(dom.window.document).parse();   // battle-tested fallback
    result = r ? { content: r.content, title: r.title, wordCount: r.length / 5 } as any : null;
  }
  if (!result) return null;
  const purify = createDOMPurify(new JSDOM("").window as any);
  const clean = purify.sanitize(result.content, { USE_PROFILES: { html: true } });
  return { contentHtml: clean, contentMd: new TurndownService().turndown(clean) };
}
```

---

## 5. Data model (PostgreSQL 17 + pgvector + ltree)

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS ltree;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Publishers and the media-literacy layer
CREATE TABLE outlets (
  id            text PRIMARY KEY,               -- e.g. "apnews.com"
  name          text NOT NULL,
  wikidata_qid  text,                           -- ownership graph anchor
  country       text,
  reputation    real DEFAULT 0.5,               -- spam/quality prior (AI-10)
  created_at    timestamptz DEFAULT now()
);
CREATE TABLE outlet_ratings (
  outlet_id   text REFERENCES outlets(id),
  provider    text NOT NULL,                    -- 'wikidata_p1387', 'community', 'model', 'licensed:<name>'
  lean        smallint,                         -- -2..+2 (L, LC, C, RC, R)
  reliability real,                             -- 0..1
  license     text NOT NULL,                    -- provenance shown in UI
  observed_at date NOT NULL,
  PRIMARY KEY (outlet_id, provider)
);
CREATE TABLE ownership_edges (
  child_qid  text, parent_qid text, relation text,  -- P127 owned by, P749 parent org
  source     text DEFAULT 'wikidata', fetched_at timestamptz,
  PRIMARY KEY (child_qid, parent_qid, relation)
);

-- Sources and items
CREATE TABLE feeds (
  id text PRIMARY KEY, url text UNIQUE NOT NULL, kind text NOT NULL,
  outlet_id text REFERENCES outlets(id), etag text, last_modified text,
  websub_hub text, next_fetch_at timestamptz, error_count int DEFAULT 0
);
CREATE TABLE items (
  id text PRIMARY KEY, source_id text NOT NULL, outlet_id text REFERENCES outlets(id),
  guid_hash bytea NOT NULL, canonical_url text NOT NULL, title text NOT NULL,
  author text, published_at timestamptz NOT NULL, lang text, kind text NOT NULL,
  content_html text, content_md text, minhash bytea, mirror_of text REFERENCES items(id),
  UNIQUE (source_id, guid_hash)
);
CREATE TABLE item_embeddings (
  item_id text PRIMARY KEY REFERENCES items(id) ON DELETE CASCADE,
  model text NOT NULL, embedding vector(384) NOT NULL
);
CREATE INDEX ON item_embeddings USING hnsw (embedding vector_cosine_ops);

-- Stories (clusters)
CREATE TABLE stories (
  id text PRIMARY KEY, centroid vector(384) NOT NULL, first_seen timestamptz NOT NULL,
  last_seen timestamptz NOT NULL, outlet_count int DEFAULT 1, status text DEFAULT 'candidate',
  lean_left real, lean_center real, lean_right real, blindspot text, score real DEFAULT 0
);
CREATE INDEX ON stories USING hnsw (centroid vector_cosine_ops);
CREATE TABLE story_items (story_id text REFERENCES stories(id), item_id text REFERENCES items(id),
  similarity real, PRIMARY KEY (story_id, item_id));
CREATE TABLE story_bullets (
  id bigserial PRIMARY KEY, story_id text REFERENCES stories(id), ord int, text text NOT NULL,
  cited_item_ids text[] NOT NULL, grounding_score real NOT NULL, verdict text NOT NULL,  -- pass, flag, drop
  model text NOT NULL, created_at timestamptz DEFAULT now()
);

-- Users, personalization, automation
CREATE TABLE subscriptions (user_id text, feed_id text, folder text, PRIMARY KEY (user_id, feed_id));
CREATE TABLE trainer_weights (user_id text, facet text, value text, weight smallint,  -- facet: author, tag, title_phrase, outlet
  PRIMARY KEY (user_id, facet, value));
CREATE TABLE rules (id text PRIMARY KEY, owner_id text, name text, cel text NOT NULL,
  actions jsonb NOT NULL, enabled bool DEFAULT true);
CREATE TABLE ai_keys (owner_id text, provider text, ciphertext bytea NOT NULL, nonce bytea NOT NULL,
  monthly_cap_usd numeric, PRIMARY KEY (owner_id, provider));
CREATE TABLE reading_events (user_id text, item_id text, story_id text, dwell_ms int, at timestamptz DEFAULT now());

-- Community and governance
CREATE TABLE comments (id text PRIMARY KEY, story_id text REFERENCES stories(id), author_id text,
  path ltree NOT NULL, body_md text, score int DEFAULT 1, ap_id text, created_at timestamptz DEFAULT now());
CREATE INDEX ON comments USING gist (path);
CREATE TABLE invitations (user_id text PRIMARY KEY, inviter_id text, lineage ltree NOT NULL);
CREATE TABLE moderation_log (
  seq bigserial PRIMARY KEY, moderator_id text, action text, target text, reason text,
  at timestamptz DEFAULT now(), prev_hash bytea, hash bytea NOT NULL      -- hash chain for tamper evidence
);
CREATE TABLE collections (id text PRIMARY KEY, kind text CHECK (kind IN ('squad','magazine','shared')),
  slug text UNIQUE, owner_id text, ap_actor_uri text, title text, description text);
```

---

## 6. Core algorithms

### 6.1 Online Story assignment (pgvector)

```sql
-- $1 = new item embedding, $2 = similarity threshold tau (start at 0.80, tune on a labelled sample)
SELECT id, 1 - (centroid <=> $1) AS sim
FROM stories
WHERE last_seen > now() - interval '72 hours'
ORDER BY centroid <=> $1
LIMIT 5;
-- If best sim >= tau AND the outlet differs from existing members, join; else create a candidate.
-- Centroid update: centroid = normalize(centroid * n/(n+1) + e/(n+1)).
-- A 15-minute HDBSCAN batch re-clusters the window, merging and splitting drifted Stories.
```

### 6.2 Ranking formulas

| Feed | Formula | Notes |
| :--- | :--- | :--- |
| Front Page (community items) | `score = (votes - 1) / (age_hours + 2)^1.8` | Hacker News gravity, as given in the source report |
| Front Page (clustered Stories) | `score = log2(1 + outlets) * reputation_avg / (age_hours + 2)^1.5` | More independent outlets means more consensus; decays more slowly than votes |
| River | `ORDER BY published_at DESC` | No ranking, by design |
| Blindspot | `max(left_share, right_share) >= 0.80 AND outlets >= 6` | Thresholds are configurable and published on the methodology page |
| Trainer boost | `final = base * (1 + 0.25 * sum(weights matched))`, items with any −1 hidden | NewsBlur-style green/red; weights shown on hover |
| For You (opt-in) | Gorse recommendations re-ranked by trainer weights | Off by default; "why" panel lists signals |

### 6.3 Bias distribution bar

```ts
// Bias bar for one Story; ratings resolved by provider precedence the user can see and change.
const PRECEDENCE = ["licensed", "community", "wikidata_p1387", "model"] as const;

export function biasBar(outlets: { id: string; ratings: Rating[] }[]) {
  const buckets = { left: 0, center: 0, right: 0, unrated: 0 };
  for (const o of outlets) {
    const r = PRECEDENCE.map((p) => o.ratings.find((x) => x.provider.startsWith(p))).find(Boolean);
    if (!r || r.lean == null) buckets.unrated++;
    else if (r.lean < 0) buckets.left++;
    else if (r.lean > 0) buckets.right++;
    else buckets.center++;
  }
  const rated = outlets.length - buckets.unrated;
  return { ...buckets, rated, shares: rated ? {
    left: buckets.left / rated, center: buckets.center / rated, right: buckets.right / rated } : null };
}
```

### 6.4 Consensus synthesis + Reality Check

```ts
// services/synth/src/consensus.ts
import { generateObject } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";

const litellm = createOpenAICompatible({ name: "litellm", baseURL: process.env.LITELLM_URL! });

const Bullets = z.object({
  bullets: z.array(z.object({ text: z.string().max(400), cites: z.array(z.string()).min(1) })).max(7),
  disputed: z.array(z.object({ claim: z.string(), sides: z.array(z.string()) })).optional(),
});

export async function synthesize(story: StoryWithItems, modelAlias: string) {
  const sources = story.items.map((i) => `[${i.id}] ${i.outletName}: ${i.title}\n${i.lede}`).join("\n\n");
  const { object } = await generateObject({
    model: litellm(modelAlias),                 // "local-default" maps to Ollama; BYOAI aliases map to user keys
    schema: Bullets,
    system: "Write neutral bullets. Every bullet must cite source IDs that directly state it. " +
            "Do not add facts. Put contested facts in 'disputed'.",
    prompt: sources,
  });
  // Reality Check: ground each bullet against the text of the sources it cites.
  const checked = await fetch(`${process.env.ML_URL}/verify`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ bullets: object.bullets, sources: story.items.map((i) => ({ id: i.id, text: i.contentMd })) }),
  }).then((r) => r.json());
  return checked.filter((b: any) => b.verdict !== "drop");
}
```

```python
# dukr-ml/app/verify.py  (FastAPI route; LettuceDetect primary, HHEM-2.1-open fallback)
from fastapi import APIRouter
from lettucedetect.models.inference import HallucinationDetector

router = APIRouter()
detector = HallucinationDetector(method="transformer",
                                 model_path="KRLabsOrg/lettucedect-base-modernbert-en-v1")

@router.post("/verify")
def verify(req: dict):
    by_id = {s["id"]: s["text"] for s in req["sources"]}
    out = []
    for b in req["bullets"]:
        context = [by_id[c] for c in b["cites"] if c in by_id]
        spans = detector.predict(context=context, question="Summarize the story.",
                                 answer=b["text"], output_format="spans")
        unsupported = sum(s["end"] - s["start"] for s in spans) / max(len(b["text"]), 1)
        verdict = "pass" if unsupported < 0.05 else ("flag" if unsupported < 0.25 else "drop")
        out.append({**b, "grounding_score": 1 - unsupported, "verdict": verdict})
    return out
```

### 6.5 Rules engine (CEL) and signed webhooks

```ts
// services/rules/src/evaluate.ts
import { evaluate } from "@marcbachmann/cel-js";
import RE2 from "re2";
import { Svix } from "svix";

const svix = new Svix(process.env.SVIX_TOKEN!, { serverUrl: process.env.SVIX_URL });

// Example rule (stored in rules.cel):
//   item.kind == "intel" && item.cves.exists(c, c in user.sbom_cves) && story.outlets >= 2
export async function runRules(ctx: RuleContext, rules: Rule[]) {
  for (const rule of rules.filter((r) => r.enabled)) {
    const matched = evaluate(rule.cel, {
      ...ctx,
      // safe, linear-time regex exposed to CEL as matchesRe(field, pattern)
      matchesRe: (s: string, p: string) => new RE2(p, "i").test(s),
    });
    if (!matched) continue;
    for (const action of rule.actions) {
      if (action.type === "webhook") {
        await svix.message.create(ctx.user.svixAppId, {
          eventType: "story.matched",
          payload: { rule: rule.id, story: ctx.story.id, item: ctx.item.id, url: ctx.item.canonicalUrl },
        });                                     // Standard Webhooks signing, retries, replay handled by Svix
      }
      // other actions: tag, star, mute, notify (Apprise URL), summarize, route-to-squad, open-issue
    }
  }
}
```

---

## 7. API surface

### 7.1 REST (OpenAPI 3.1, PAT or session auth)

| Method & path | Purpose | Competitor parity |
| :--- | :--- | :--- |
| `GET /v1/stories?feed=front` | Front Page, River, Blindspot, For You, tag, Squad, Magazine | HN, daily.dev, Ground News |
| `GET /v1/stories/{id}` | Full Coverage dossier: bullets, outlets, bias bar, ownership, timeline | Google News, Ground News, Particle |
| `POST /v1/stories/{id}/ask` | Closed-book Q&A over the cluster | Particle, Feedly Ask AI |
| `GET /v1/items/{id}` | Article with clean HTML/Markdown and provenance | All readers |
| `POST /v1/submissions` | Link / Ask / Show / Tell | HN, Lobste.rs |
| `POST /v1/trainer` | Thumbs up/down on facet | NewsBlur |
| `GET/POST /v1/rules` | CRUD CEL rules + dry-run against last 7 days | Inoreader |
| `GET/POST /v1/webhooks` | Endpoint management (proxied to Svix) | Inoreader |
| `GET /v1/search?q=` | Hybrid search (BM25 + vector) | HN Algolia, Feedly Pro |
| `GET /v1/stream` | Server-Sent Events of new Stories per topic | HN Firebase |
| `GET /v1/export` | OPML + JSON bundle (feeds, rules, weights, annotations) | NewsBlur |
| `/reader/api/0/*` | Google Reader API compatibility | FreshRSS/Miniflux convention |
| `/fever/` | Fever API compatibility | FreshRSS/Miniflux convention |
| `/{list}.rss` · `.atom` · `.json` | Feed output for every list | Lobste.rs, NewsBlur |

### 7.2 MCP server tools

| Tool | Input | Returns | Typical agent use |
| :--- | :--- | :--- | :--- |
| `search_stories` | query, since, tags, feed | Story list with outlet counts | "What happened with the Rust 2027 edition this week?" |
| `get_story_dossier` | story_id | Bullets with citations, bias bar, ownership, links | Grounded briefing inside an IDE |
| `list_feed` | feed name, limit | Ranked items | Morning digest in Claude Code |
| `ask_story` | story_id, question | Cited answer or "not in sources" | Follow-up research |
| `train` | facet, value, weight | Updated weights | "Show me less about crypto" |
| `create_rule` | natural-language or CEL | Compiled CEL + dry-run matches | Agent-authored automations |
| `cve_watch` | SBOM or package list | Matching intel Stories | DevSecOps triage |

```ts
// services/mcp/src/server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { DukrClient } from "@dukr/sdk";

const dukr = new DukrClient({ baseUrl: process.env.DUKR_URL!, token: process.env.DUKR_PAT! });
const server = new McpServer({ name: "dukrnews", version: "0.1.0" });

server.registerTool("search_stories", {
  description: "Search clustered news Stories. Returns outlet counts and story IDs.",
  inputSchema: { query: z.string(), since: z.string().optional(), tags: z.array(z.string()).optional() },
}, async ({ query, since, tags }) => {
  const res = await dukr.search({ q: query, since, tags });
  return { content: [{ type: "text", text: JSON.stringify(res.stories, null, 2) }] };
});

server.registerTool("get_story_dossier", {
  description: "Full Coverage dossier with cited consensus bullets, bias bar, and ownership chain.",
  inputSchema: { story_id: z.string() },
}, async ({ story_id }) => ({
  content: [{ type: "text", text: JSON.stringify(await dukr.story(story_id), null, 2) }],
}));

await server.connect(new StdioServerTransport());   // also expose Streamable HTTP for remote agents
```

### 7.3 Webhook payload (Standard Webhooks envelope)

```json
{
  "type": "story.matched",
  "timestamp": "2026-10-13T04:42:03Z",
  "data": {
    "rule_id": "rul_01JAXK",
    "story": { "id": "sty_01JAX9", "title": "OpenSSL patches high-severity flaw", "outlets": 14,
               "bias": { "left": 0.31, "center": 0.46, "right": 0.23 }, "cves": ["CVE-2026-12345"] },
    "item": { "id": "itm_01JAX7", "url": "https://example.org/openssl-advisory", "outlet": "example.org" }
  }
}
```

---

## 8. AI policy layer (BYOAI done safely)

| Concern | Mechanism | Library |
| :--- | :--- | :--- |
| Model routing | Aliases (`local-default`, `byo:<provider>`, `hosted-plus`) resolved per user/org | LiteLLM proxy (router + budgets) |
| Local default | Small instruction model served on CPU or GPU | Ollama (or llama.cpp server; vLLM for GPU scale) |
| Key storage | Keys encrypted with libsodium sealed boxes; KEK held in env/KMS; never logged | libsodium (sodium-native) |
| Spend caps | Monthly USD cap per key; hard stop and notify | LiteLLM budgets |
| Caching | Summaries keyed by `(item_id, prompt_version, model)`; shared across users only for local and hosted models, never for BYOAI | Postgres table + Valkey |
| Provenance | Model, prompt version and grounding score stored per bullet; shown on hover | `story_bullets` table |
| Prompt-injection hygiene | Article text passed as data in delimited blocks; tools disabled during synthesis; output schema enforced | Vercel AI SDK `generateObject` + Zod |
| Evaluation | Nightly faithfulness eval on a labelled sample | ragas or deepeval (both optional) |

---

## 9. Federation design

| Actor / protocol | DUKRNews object | Behaviour | Library |
| :--- | :--- | :--- | :--- |
| ActivityPub `Service` or `Group` actor | Magazine | Followable as `@slug@instance`; each curated item is an `Announce` or `Create(Note)` with link card | Fedify |
| ActivityPub `Group` (FEP-1b12) | Squad | Remote Lemmy/Mbin/PieFed users can post and comment; Squad re-announces to followers | Fedify |
| ActivityPub `Person` | User share-blog | Shares with commentary federate as Notes | Fedify |
| Inbound replies & likes | Comment threads | `Create(Note)` with `inReplyTo` maps into the `comments` ltree | Fedify inbox listeners |
| WebSub subscriber | Feeds with hubs | Push updates replace polling | Custom (small) or hub service |
| WebSub publisher | Every DUKR list feed | Ping a hub on update so other readers get push | Custom |
| AT Protocol | Bluesky bridge | Ingest lists as sources; optionally publish Magazines as feeds | @atproto/api |

```ts
// services/fed/src/magazine.ts (Fedify skeleton)
import { createFederation, Group, Endpoints } from "@fedify/fedify";
import { PostgresKvStore, PostgresMessageQueue } from "@fedify/postgres";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);
export const federation = createFederation<void>({
  kv: new PostgresKvStore(sql), queue: new PostgresMessageQueue(sql),
});

federation.setActorDispatcher("/ap/c/{identifier}", async (ctx, identifier) => {
  const c = await getCollection(identifier);              // squad or magazine
  if (!c) return null;
  return new Group({
    id: ctx.getActorUri(identifier),
    preferredUsername: identifier,
    name: c.title,
    summary: c.description,
    inbox: ctx.getInboxUri(identifier),
    outbox: ctx.getOutboxUri(identifier),
    endpoints: new Endpoints({ sharedInbox: ctx.getInboxUri() }),
  });
});
```

---

## 10. Clients

| Client | Build | Composed libraries | Parity notes |
| :--- | :--- | :--- | :--- |
| Web (full) | SvelteKit SSR + hydration | Swiper (flip/swipe deck), tinykeys (Vim keys), DOMPurify | Feedly layouts, Inoreader keys, Flipboard flip |
| Web (zero-JS) | Same routes, `?lite=1` server-only render | none (plain HTML/CSS) | HN/Lobste.rs speed |
| PWA offline | Service worker + IndexedDB | vite-plugin-pwa, Workbox, Dexie.js | SmartView-style pre-render of next N stories |
| iOS / Android | Capacitor shell around the PWA build | Capacitor (push, background fetch, share sheet, media session) | Apple/SmartNews app parity |
| Desktop | Tauri 2 shell | Tauri | Feedly desktop parity |
| Browser extension | New Tab + outlet overlay + 1-click subscribe | WXT | daily.dev New Tab, Ground News overlay |
| CLI / TUI | `dukr` | oclif | NewsBlur CLI |
| VS Code side panel | Webview + MCP | VS Code API + MCP SDK | daily.dev IDE presence |
| Audio | Briefing player with chapters | howler.js + Media Session API | Apple/Particle narration |
| Puzzles | Daily crossword + sudoku + news quiz | Exolve (ipuz player), sudoku.js; quiz generated from Stories | Apple News+ puzzles |

---

## 11. Deployment profiles

| Profile | Target | Services | RAM | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `solo` | Single user on a Raspberry Pi 5 or small VPS | api+web+workers in one Node process, Postgres, fastembed CPU, no LLM (extractive TL;DR) | ≤ 2 GB | pg-boss instead of Valkey; sqlite-vec optional |
| `standard` | Family / team / small community | All Node services, Postgres, Valkey, dukr-ml CPU, Ollama 3–4B model, SeaweedFS | 8–16 GB | Default docker-compose |
| `gpu` | Public instance | standard + vLLM, faster-whisper GPU, Kokoro GPU, Meilisearch | 32 GB + 1 GPU | Horizontal API and worker replicas |

```yaml
# docker-compose.yml (standard profile, abbreviated)
services:
  postgres:
    image: pgvector/pgvector:pg17
    environment: { POSTGRES_PASSWORD: "${PG_PASSWORD}" }
    volumes: ["pg:/var/lib/postgresql/data"]
  valkey:
    image: valkey/valkey:9
  api:
    image: ghcr.io/dukr/api:0.1
    depends_on: [postgres, valkey]
    environment: { DATABASE_URL: "postgres://postgres:${PG_PASSWORD}@postgres/dukr", LITELLM_URL: "http://litellm:4000" }
  web:
    image: ghcr.io/dukr/web:0.1
    depends_on: [api]
  workers:
    image: ghcr.io/dukr/workers:0.1
    deploy: { replicas: 2 }
  ml:
    image: ghcr.io/dukr/ml:0.1          # FastAPI: embed, verify, ner, lean, asr, tts, mt
  litellm:
    image: ghcr.io/berriai/litellm:main-stable
    volumes: ["./litellm.yaml:/app/config.yaml"]
  ollama:
    image: ollama/ollama
    volumes: ["ollama:/root/.ollama"]
  svix:
    image: svix/svix-server
    depends_on: [postgres, valkey]
  fed:
    image: ghcr.io/dukr/fed:0.1
  seaweedfs:
    image: chrislusf/seaweedfs
    command: "server -s3"
volumes: { pg: {}, ollama: {} }
```

---

## 12. Security, privacy and trust & safety

| Area | Control | Library / mechanism |
| :--- | :--- | :--- |
| Auth | Email + passkeys + OAuth; orgs and roles; scoped PATs | Better Auth (passkey, api-key, organization plugins) |
| Untrusted HTML | Sanitize at ingest **and** render; CSP with no inline scripts | DOMPurify |
| User regex | Linear-time engine only | node-re2 |
| SSRF on fetch | Block private IP ranges; DNS pinning; size and time limits | undici dispatcher + IP allow/deny list |
| Rate limits | Per IP, per PAT, per route | @fastify/rate-limit (Valkey store) |
| Federation abuse | Domain blocks, signature verification, inbox rate limits | Fedify built-ins + moderation log |
| Toxic comments | Pre-moderation score; human review queue | Detoxify (dukr-ml) |
| Privacy | Reading history and My News Bias computed on-device by default; server copy opt-in | Dexie.js local store |
| Observability | Traces across queue hops | OpenTelemetry JS |
| Analytics | Cookie-less, self-hosted | Umami (optional) |

---

## 13. Licensing strategy

| Decision | Rationale |
| :--- | :--- |
| Core repository under **AGPL-3.0-or-later** | Matches peer projects (daily.dev apps, FreshRSS, Folo, Lemmy, Mbin). Prevents closed SaaS forks while allowing commercial self-hosting |
| Permissive libraries (MIT, Apache-2.0, BSD, ISC, PostgreSQL, Unlicense, CC0) linked freely | All are compatible with AGPL-3.0 distribution |
| MPL-2.0 (web-push, Bergamot) | File-level copyleft; fine to link unmodified |
| GPL-3.0 (Piper TTS, Typesense) | Run as **separate network services**, never linked, to keep the boundary clean; Kokoro (Apache-2.0) is the default TTS anyway |
| AGPL-3.0 services (Garage, Open-Meteo, LibreTranslate, Lago, RSSHub, ParadeDB) | Compatible with an AGPL core; if the core is ever relicensed permissively, swap to SeaweedFS / Argos / Kill Bill equivalents |
| **Excluded:** SSPL (Hook0), Elastic-2.0 (Convoy), Sustainable Use (n8n), BUSL (Meilisearch Enterprise) | Not OSI open source; conflicts with "fully FOSS" positioning. Meilisearch **Community** (MIT) is fine |
| Data licenses tracked per row | `outlet_ratings.license` and `ownership_edges.source` are rendered in the UI next to every rating |

---

## 14. Delivery roadmap

| Phase | Weeks | Scope (catalog IDs) | Exit gate |
| :--- | :---: | :--- | :--- |
| 0. Skeleton | 1–2 | Monorepo, DB schema, auth, docker-compose, CI | `docker compose up` gives a working login |
| 1. Reader core | 3–6 | ING-01/03/04/06/12, AI-01, PER-01/03/04/05/06, RX-01/03/05, FED-05, DEV-01 | 300 feeds ingest; River and Front Page work |
| 2. Story engine | 7–10 | AI-02/03/04/05/06/13, ML-08/10 | Clustering F1 ≥ 0.80 on a labelled set; ≥ 95% of displayed bullets grounded |
| 3. Media literacy | 11–13 | ML-01/02/03/04/05/06, AI-12 | Bias bar on ≥ 70% of US-outlet Stories using open data |
| 4. Automation | 14–16 | DEV-02/03/04/05/06/08/12/13, NTF-01/02/03 | Reeder syncs; MCP works in Claude Code; webhooks replayable |
| 5. Social & federation | 17–21 | COM-01..07, COM-10/11, FED-01/03 | Mastodon user follows a Magazine and replies round-trip |
| 6. Media & platforms | 22–26 | RX-02/04/06/07/08/09/13/14, AI-11, PER-07, ING-02/05/07/08 | PWA offline, Capacitor builds, DUKR Daily audio |
| 7. Beyond parity | 27+ | All P2 rows | Per-feature |

---

## 15. PoC exit criteria (measurable)

| Metric | Target | How measured |
| :--- | :--- | :--- |
| Clustering quality | Pairwise F1 ≥ 0.80 | 500 hand-labelled article pairs from the 72-hour window |
| Grounded bullets | ≥ 95% of displayed bullets rated supported by a human reviewer | 200-bullet audit sample |
| Hallucination escape rate | ≤ 2% | Bullets marked "pass" by Reality Check that a human rejects |
| Ingest freshness | p95 ≤ 10 min from publish (polling); ≤ 1 min (WebSub) | Timestamp delta logging |
| Front-page TTFB (zero-JS) | ≤ 150 ms p95 on the standard profile | k6 load test |
| Solo profile footprint | ≤ 2 GB RSS total at 300 feeds | `docker stats` over 24 h |
| Third-party client sync | Reeder + NetNewsWire read/star sync | Manual test |
| Agent integration | 4 MCP tools callable from Claude Code and Cursor | Manual test |
| Accessibility | WCAG 2.2 AA automated checks pass | axe-core in CI |

---

## 16. Risk register

| Risk | Likelihood | Impact | Mitigation |
| :--- | :---: | :---: | :--- |
| Open bias data is thin outside the US | High | Medium | Show "unrated" honestly; community ratings with provenance; pluggable licensed providers |
| AI summaries trigger publisher complaints | Medium | High | Short cited bullets, prominent outbound links, publisher opt-out registry, no paywalled text in prompts |
| Reality Check model is English-centric | High | Medium | Translate-then-verify for other languages; flag unverifiable bullets rather than showing them |
| Dependency churn (archived or relicensed libraries) | Medium | Medium | Interface per capability with ≥2 candidates (see [03 §5](03-software-research-dukrnews-foss-stack.md)); quarterly maintenance re-check |
| Federation spam and moderation load | Medium | High | Invite-only default for new instances; moderation log; domain blocklists |
| Crawl load or robots violations | Low | High | Polite crawler, robots.txt, per-domain rate limits, opt-out registry |
| GPU cost for audio and podcast features | Medium | Low | CPU-friendly Kokoro and whisper.cpp; hosted tiers meter minutes |
| Scope creep (78 catalog rows) | High | High | Phase gates above; P2 rows stay out of the PoC |
