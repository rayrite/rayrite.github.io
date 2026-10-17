import { Engine } from "json-rules-engine";
import { Webhook } from "standard-webhooks";
import type { RawArticle } from "./types.js";

export async function testAutomationRules(article: RawArticle, webhookSecret: string): Promise<boolean> {
  const engine = new Engine();

  // Rule: Alert on Security CVEs
  engine.addRule({
    conditions: {
      any: [
        {
          fact: "cveIndicators",
          operator: "contains",
          value: "CVE-2026-9999"
        },
        {
          fact: "tags",
          operator: "contains",
          value: "security"
        }
      ]
    },
    event: {
      type: "cve_alert",
      params: { action: "dispatch_webhook" }
    }
  });

  const facts = {
    cveIndicators: article.cveIndicators,
    tags: article.tags,
    domain: article.canonicalDomain
  };

  const results = await engine.run(facts);
  const matched = results.events.length > 0;

  if (matched) {
    const wh = new Webhook(webhookSecret);
    const payload = JSON.stringify({
      event: "article.cve_alert",
      articleId: article.id,
      title: article.title,
      cve: article.cveIndicators
    });
    const sig = wh.sign(payload);
    console.log(`[Webhook Engine] Generated HMAC signature: ${sig.substring(0, 24)}...`);
  }

  return matched;
}
