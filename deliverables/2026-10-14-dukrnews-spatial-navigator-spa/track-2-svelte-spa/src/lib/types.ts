export type EntityGroup = 'story' | 'person' | 'topic' | 'place' | 'thing';
export type ViewMode = 'spatial' | 'kinetic';
export type SpatialSubMode = 'constellation' | 'geospatial';
export type ThemeMode = 'theme-obsidian' | 'theme-swiss' | 'theme-scifi';
export type FilterType = 'all' | EntityGroup;

export interface Headline {
  text: string;
  bias?: string;
  url?: string;
}

export interface BiasDistribution {
  left: number;
  center: number;
  right: number;
  unknown?: number;
}

export interface GeoLocation {
  place: string;
  lat: number;
  lon: number;
}

export interface NewsNode {
  id: string;
  label: string;
  group: EntityGroup;
  size?: number;
  summary?: string;
  sources_count?: number;
  bias?: BiasDistribution;
  bias_score?: number;
  geo?: GeoLocation | null;
  headlines?: Headline[];
  details?: Record<string, any>;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number | null;
  fy?: number | null;
  geoX?: number | null;
  geoY?: number | null;
}

export interface NewsEdge {
  source: string;
  target: string;
  type: string;
  weight?: number;
  common_entities?: string[];
  sourceNode?: NewsNode;
  targetNode?: NewsNode;
}

export interface GraphBundle {
  version: string;
  generated_at: string;
  dataset: string;
  counts: {
    stories: number;
    entities: number;
    edges: number;
  };
  nodes: NewsNode[];
  edges: NewsEdge[];
}
