/**
 * DukrNews Spatial Navigator — Track 1 Data Store & Indexer
 */
class NewsDataStore {
  constructor() {
    this.raw = null;
    this.nodes = [];
    this.edges = [];
    this.nodeMap = new Map();
    this.neighborsMap = new Map();
    this.typeMap = new Map();
  }

  async load() {
    if (window.__NEWS_GRAPH_DATA__) {
      this.raw = window.__NEWS_GRAPH_DATA__;
    } else {
      try {
        const res = await fetch('data/news-graph-bundle.json');
        this.raw = await res.json();
      } catch (e) {
        console.warn('Falling back to window bundle if available', e);
      }
    }

    if (!this.raw || !this.raw.nodes) {
      throw new Error('Failed to load news graph bundle.');
    }

    this.nodes = this.raw.nodes.map((n, idx) => {
      const angle = (idx / this.raw.nodes.length) * Math.PI * 2;
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

    this.nodes.forEach(n => this.nodeMap.set(n.id, n));

    this.edges = this.raw.edges.map(e => ({
      ...e,
      sourceNode: this.nodeMap.get(e.source),
      targetNode: this.nodeMap.get(e.target)
    })).filter(e => e.sourceNode && e.targetNode);

    // Build Adjacency List
    this.nodes.forEach(n => {
      this.neighborsMap.set(n.id, []);
      if (!this.typeMap.has(n.group)) {
        this.typeMap.set(n.group, []);
      }
      this.typeMap.get(n.group).push(n);
    });

    this.edges.forEach(e => {
      this.neighborsMap.get(e.sourceNode.id).push({ node: e.targetNode, edge: e });
      this.neighborsMap.get(e.targetNode.id).push({ node: e.sourceNode, edge: e });
    });

    console.log(`[NewsDataStore] Indexed ${this.nodes.length} nodes and ${this.edges.length} edges.`);
    return this;
  }

  getNode(id) {
    return this.nodeMap.get(id);
  }

  getNeighbors(id) {
    return this.neighborsMap.get(id) || [];
  }

  getByType(type) {
    if (type === 'all') return this.nodes;
    return this.typeMap.get(type) || [];
  }
}

window.NewsDataStore = NewsDataStore;
