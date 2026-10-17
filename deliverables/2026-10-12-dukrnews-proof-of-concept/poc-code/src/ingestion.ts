import { parseFeed } from "feedsmith";
import DOMPurify from "isomorphic-dompurify";
import type { RawArticle } from "./types.js";

export async function parseFeedPayload(xmlContent: string, sourceDomain: string): Promise<RawArticle[]> {
  const feed = parseFeed(xmlContent);
  const results: RawArticle[] = [];

  for (const item of (feed.items || []).slice(0, 10)) {
    const raw = item.description || item.content || "";
    const clean = DOMPurify.sanitize(raw);
    const title = item.title || "Untitled Article";
    
    // Extract CVE identifiers, e.g. CVE-2026-1234
    const cveMatches = (title + " " + clean).match(/CVE-\d{4}-\d{4,7}/gi) || [];

    results.push({
      id: "art_" + Math.random().toString(36).substring(2, 9),
      title,
      url: item.link || "https://" + sourceDomain,
      canonicalDomain: sourceDomain,
      author: item.author || "Editorial Staff",
      publishedAt: item.published ? new Date(item.published) : new Date(),
      cleanMarkdown: clean,
      tags: item.categories || ["tech"],
      cveIndicators: Array.from(new Set(cveMatches.map(c => c.toUpperCase()))),
      upvotes: 1
    });
  }

  return results;
}
