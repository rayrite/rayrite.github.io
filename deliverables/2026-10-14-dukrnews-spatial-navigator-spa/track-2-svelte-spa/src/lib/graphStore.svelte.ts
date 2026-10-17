import type { NewsNode, NewsEdge, GraphBundle, ViewMode, SpatialSubMode, ThemeMode, FilterType } from './types';
import rawBundle from './data/news-graph-bundle.json';

class GraphStore {
  // Svelte 5 Runes state
  primaryView = $state<ViewMode>('spatial');
  spatialSubMode = $state<SpatialSubMode>('constellation');
  theme = $state<ThemeMode>('theme-obsidian');
  activeFilter = $state<FilterType>('all');
  selectedNode = $state<NewsNode | null>(null);
  hoveredNode = $state<NewsNode | null>(null);
  hoveredPos = $state<{ x: number; y: number }>({ x: 0, y: 0 });
  fps = $state<number>(60);
  isLoaded = $state<boolean>(false);

  nodes = $state<NewsNode[]>([]);
  edges = $state<NewsEdge[]>([]);

  nodeMap = new Map<string, NewsNode>();
  adjacency = new Map<string, { node: NewsNode; edge: NewsEdge }[]>();

  // Derived state: Neighbors of currently selected node
  connectedNeighbors = $derived.by(() => {
    if (!this.selectedNode) return [];
    return this.adjacency.get(this.selectedNode.id) || [];
  });

  // Derived state: Active stories for wire feed
  stories = $derived.by(() => {
    return this.nodes.filter(n => n.group === 'story');
  });

  constructor() {
    // Immediately initialize with bundled dataset so UI renders at t=0
    this.initData(rawBundle as unknown as GraphBundle);
  }

  initData(data: GraphBundle) {
    if (!data || !data.nodes) return;

    this.nodes = data.nodes.map((n, idx) => {
      const angle = (idx / data.nodes.length) * Math.PI * 2;
      const radius = 180 + Math.random() * 420;
      return {
        ...n,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        fx: null,
        fy: null,
        geoX: n.geo ? (n.geo.lon / 180) * 600 : (n.details && n.details.lon ? (n.details.lon / 180) * 600 : null),
        geoY: n.geo ? (-n.geo.lat / 90) * 350 : (n.details && n.details.lat ? (-n.details.lat / 90) * 350 : null)
      };
    });

    this.nodeMap.clear();
    this.nodes.forEach(n => this.nodeMap.set(n.id, n));

    this.edges = data.edges.map(e => ({
      ...e,
      sourceNode: this.nodeMap.get(e.source),
      targetNode: this.nodeMap.get(e.target)
    })).filter((e): e is NewsEdge & { sourceNode: NewsNode; targetNode: NewsNode } => !!(e.sourceNode && e.targetNode));

    // Build Adjacency List
    this.adjacency.clear();
    this.nodes.forEach(n => this.adjacency.set(n.id, []));
    this.edges.forEach(e => {
      if (e.sourceNode && e.targetNode) {
        this.adjacency.get(e.sourceNode.id)?.push({ node: e.targetNode, edge: e });
        this.adjacency.get(e.targetNode.id)?.push({ node: e.sourceNode, edge: e });
      }
    });

    this.isLoaded = true;
    if (this.stories.length > 0 && !this.selectedNode) {
      this.selectedNode = this.stories[0];
    }
    console.log(`[GraphStore] Data initialized synchronously: ${this.nodes.length} nodes, ${this.edges.length} edges.`);
  }

  async load() {
    // Attempt live fetch if running under dev server with live API, fallback to bundled data
    try {
      const res = await fetch('./data/news-graph-bundle.json');
      if (res.ok) {
        const liveData: GraphBundle = await res.json();
        this.initData(liveData);
      }
    } catch {
      // Keep bundled data
    }
  }

  selectNode(node: NewsNode | null) {
    this.selectedNode = node;
  }

  setHoveredNode(node: NewsNode | null, pos?: { x: number; y: number }) {
    this.hoveredNode = node;
    if (pos) this.hoveredPos = pos;
  }

  setView(view: ViewMode) {
    this.primaryView = view;
  }

  setSpatialSubMode(mode: SpatialSubMode) {
    this.spatialSubMode = mode;
  }

  setTheme(theme: ThemeMode) {
    this.theme = theme;
    document.body.className = theme;
  }

  setFilter(filter: FilterType) {
    this.activeFilter = filter;
  }

  getNodeColor(node: NewsNode): string {
    if (node.group === 'person') return '#F59E0B';
    if (node.group === 'topic') return '#EC4899';
    if (node.group === 'place') return '#10B981';
    if (node.group === 'thing') return '#3B82F6';
    if (node.bias) {
      if (node.bias.right > node.bias.left && node.bias.right > node.bias.center) return '#EF4444';
      if (node.bias.left > node.bias.right && node.bias.left > node.bias.center) return '#06B6D4';
      return '#8B5CF6';
    }
    return '#6366F1';
  }
}

export const graphStore = new GraphStore();
