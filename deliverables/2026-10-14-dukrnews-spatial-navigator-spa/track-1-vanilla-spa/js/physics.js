/**
 * DukrNews Spatial Navigator — Track 1 Physics Simulation
 */
class GraphPhysics {
  constructor(dataStore) {
    this.store = dataStore;
    this.mode = 'constellation'; // 'constellation' or 'geospatial'
    this.damping = 0.86;
    this.repulsionStrength = 0.35;
    this.maxDistance = 380;
    this.isPaused = false;
  }

  setMode(mode) {
    this.mode = mode;
  }

  step(width, height) {
    if (this.isPaused) return;

    const nodes = this.store.nodes;
    const edges = this.store.edges;

    if (this.mode === 'geospatial') {
      // Smoothly snap to geographical coordinates
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.geoX !== null && n.geoY !== null) {
          n.x += (n.geoX - n.x) * 0.08;
          n.y += (n.geoY - n.y) * 0.08;
        } else {
          // Dock non-spatial nodes into an orbital upper tray
          const targetY = -height / 2 + 110;
          n.y += (targetY - n.y) * 0.05;
        }
      }
      return;
    }

    // 1. N-Body Repulsion (Pairwise with distance cutoff)
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const distSq = dx * dx + dy * dy + 100;
        if (distSq < this.maxDistance * this.maxDistance) {
          const dist = Math.sqrt(distSq);
          const force = (this.maxDistance - dist) / dist * this.repulsionStrength;
          const fx = dx * force * 0.02;
          const fy = dy * force * 0.02;

          if (!n1.fx) { n1.vx -= fx; n1.vy -= fy; }
          if (!n2.fx) { n2.vx += fx; n2.vy += fy; }
        }
      }
    }

    // 2. Spring Attraction along Edges
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      const n1 = e.sourceNode;
      const n2 = e.targetNode;
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const targetDist = e.type === 'mention' ? 95 : 160;
      const force = (dist - targetDist) * 0.015 * (e.weight || 1);
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      if (!n1.fx) { n1.vx += fx; n1.vy += fy; }
      if (!n2.fx) { n2.vx += fx; n2.vy += fy; }
    }

    // 3. Center Gravity & Velocity Integration
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.vx -= n.x * 0.0008;
      n.vy -= n.y * 0.0008;
      n.x += n.vx;
      n.y += n.vy;
      n.vx *= this.damping;
      n.vy *= this.damping;
    }
  }
}

window.GraphPhysics = GraphPhysics;
