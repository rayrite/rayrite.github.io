export interface RawArticle {
  id: string;
  sourceId?: string;
  title: string;
  url: string;
  canonicalDomain: string;
  author?: string;
  publishedAt: Date;
  rawContent?: string;
  cleanMarkdown?: string;
  tags: string[];
  cveIndicators: string[];
  upvotes: number;
}

export interface StoryCluster {
  id: string;
  title: string;
  articles: RawArticle[];
  sourceCount: number;
  biasDistribution: {
    leftPct: number;
    centerPct: number;
    rightPct: number;
  };
  isBlindspot: boolean;
  blindspotLean?: "Left-Blindspot" | "Right-Blindspot";
  consensusSummary?: string[];
  citations?: Array<{ claim: string; domains: string[] }>;
}
