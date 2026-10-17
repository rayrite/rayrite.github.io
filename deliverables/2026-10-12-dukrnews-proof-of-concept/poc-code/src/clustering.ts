import type { RawArticle, StoryCluster } from "./types.js";

// Fast Jaccard / lexical shingle similarity for proof of concept
export function calculateLexicalSimilarity(textA: string, textB: string): number {
  const wordsA = new Set(textA.toLowerCase().split(/\W+/).filter(w => w.length > 3));
  const wordsB = new Set(textB.toLowerCase().split(/\W+/).filter(w => w.length > 3));
  
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  
  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }
  
  const union = wordsA.size + wordsB.size - intersection;
  return union > 0 ? intersection / union : 0;
}

export function clusterArticles(articles: RawArticle[], threshold = 0.35): StoryCluster[] {
  const clusters: StoryCluster[] = [];

  for (const article of articles) {
    let matchedCluster: StoryCluster | null = null;

    for (const cluster of clusters) {
      const avgSim = calculateLexicalSimilarity(article.title, cluster.title);
      if (avgSim >= threshold) {
        matchedCluster = cluster;
        break;
      }
    }

    if (matchedCluster) {
      matchedCluster.articles.push(article);
      matchedCluster.sourceCount = new Set(matchedCluster.articles.map(a => a.canonicalDomain)).size;
    } else {
      clusters.push({
        id: "clust_" + Math.random().toString(36).substring(2, 9),
        title: article.title,
        articles: [article],
        sourceCount: 1,
        biasDistribution: { leftPct: 33, centerPct: 34, rightPct: 33 },
        isBlindspot: false
      });
    }
  }

  return clusters;
}
