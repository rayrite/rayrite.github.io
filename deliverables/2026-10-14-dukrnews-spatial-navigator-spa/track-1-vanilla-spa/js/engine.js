/**
 * DukrNews Spatial Navigator — Track 1 60 FPS Canvas Render Engine
 */
class CanvasEngine {
  constructor(canvasElement, dataStore, physics) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.store = dataStore;
    this.physics = physics;

    this.width = canvasElement.parentElement.clientWidth;
    this.height = canvasElement.parentElement.clientHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.camera = { x: 0, y: 0, zoom: 1, targetX: 0, targetY: 0, targetZoom: 1 };
    this.activeFilter = 'all';
    this.selectedNode = null;
    this.hoveredNode = null;

    this.fps = 60;
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();
    this.onFpsUpdate = null;
    this.onNodeClick = null;
    this.onNodeHover = null;

    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.draggedNode = null;

    this.initListeners();
  }

  resize() {
    this.width = this.canvas.width = this.canvas.parentElement.clientWidth;
    this.height = this.canvas.height = this.canvas.parentElement.clientHeight;
  }

  start() {
    const loop = (timestamp) => {
      this.frameCount++;
      if (timestamp - this.lastFpsUpdate >= 1000) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.lastFpsUpdate = timestamp;
        if (this.onFpsUpdate) this.onFpsUpdate(this.fps);
      }

      this.physics.step(this.width, this.height);
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  render() {
    // Smooth camera glide
    this.camera.x += (this.camera.targetX - this.camera.x) * 0.1;
    this.camera.y += (this.camera.targetY - this.camera.y) * 0.1;
    this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * 0.1;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.translate(this.width / 2, this.height / 2);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(-this.camera.x, -this.camera.y);

    // Draw Geospatial World Grid if in geospatial mode
    if (this.physics.mode === 'geospatial') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-600, -350, 1200, 700);
      for (let gx = -500; gx <= 500; gx += 200) {
        ctx.beginPath();
        ctx.moveTo(gx, -350);
        ctx.lineTo(gx, 350);
        ctx.stroke();
      }
      for (let gy = -300; gy <= 300; gy += 150) {
        ctx.beginPath();
        ctx.moveTo(-600, gy);
        ctx.lineTo(600, gy);
        ctx.stroke();
      }
    }

    // 1. Draw Edges
    const edges = this.store.edges;
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      if (this.activeFilter !== 'all') {
        if (e.sourceNode.group !== this.activeFilter && e.targetNode.group !== this.activeFilter) continue;
      }

      const isConnected = this.selectedNode && (e.sourceNode === this.selectedNode || e.targetNode === this.selectedNode);
      const isHovered = this.hoveredNode && (e.sourceNode === this.hoveredNode || e.targetNode === this.hoveredNode);

      ctx.beginPath();
      if (this.physics.mode === 'geospatial') {
        const mx = (e.sourceNode.x + e.targetNode.x) / 2;
        const my = (e.sourceNode.y + e.targetNode.y) / 2 - 55;
        ctx.moveTo(e.sourceNode.x, e.sourceNode.y);
        ctx.quadraticCurveTo(mx, my, e.targetNode.x, e.targetNode.y);
      } else {
        ctx.moveTo(e.sourceNode.x, e.sourceNode.y);
        ctx.lineTo(e.targetNode.x, e.targetNode.y);
      }

      if (isConnected || isHovered) {
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2.5;
      } else {
        ctx.strokeStyle = e.type === 'semantic_similarity' ? 'rgba(139, 92, 246, 0.22)' : 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = 1;
      }
      ctx.stroke();
    }

    // 2. Draw Nodes
    const nodes = this.store.nodes;
    const isSwiss = document.body.classList.contains('theme-swiss');

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (this.activeFilter !== 'all' && n.group !== this.activeFilter) continue;

      const isSelected = n === this.selectedNode;
      const isHovered = n === this.hoveredNode;
      const color = this.getNodeColor(n);
      const radius = (n.size || 14) * (isSelected ? 1.4 : isHovered ? 1.25 : 1);

      // Glow halo
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.32)' : 'rgba(255, 255, 255, 0.16)';
        ctx.fill();
      }

      // Disc
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = isSelected ? 2.5 : 1;
      ctx.stroke();

      // Label (LOD threshold)
      if (this.camera.zoom > 0.55 || isSelected || isHovered || n.size > 22) {
        ctx.fillStyle = isSelected ? '#38BDF8' : '#FFF';
        ctx.font = `${isSelected ? '600 13px' : '500 11px'} ${isSwiss ? 'Newsreader' : 'Inter'}`;
        ctx.textAlign = 'center';
        const label = n.label.length > 28 ? n.label.slice(0, 26) + '…' : n.label;
        ctx.fillText(label, n.x, n.y + radius + 14);
      }
    }

    ctx.restore();
  }

  getNodeColor(n) {
    if (n.group === 'person') return '#F59E0B';
    if (n.group === 'topic') return '#EC4899';
    if (n.group === 'place') return '#10B981';
    if (n.group === 'thing') return '#3B82F6';
    if (n.bias) {
      if (n.bias.right > n.bias.left && n.bias.right > n.bias.center) return '#EF4444';
      if (n.bias.left > n.bias.right && n.bias.left > n.bias.center) return '#06B6D4';
      return '#8B5CF6';
    }
    return '#6366F1';
  }

  findNodeAt(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const screenX = clientX - rect.left - this.width / 2;
    const screenY = clientY - rect.top - this.height / 2;
    const worldX = screenX / this.camera.zoom + this.camera.x;
    const worldY = screenY / this.camera.zoom + this.camera.y;

    const nodes = this.store.nodes;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      if (this.activeFilter !== 'all' && n.group !== this.activeFilter) continue;
      const dx = worldX - n.x;
      const dy = worldY - n.y;
      if (dx * dx + dy * dy <= (n.size + 10) * (n.size + 10)) {
        return n;
      }
    }
    return null;
  }

  initListeners() {
    this.canvas.addEventListener('mousedown', e => {
      const hit = this.findNodeAt(e.clientX, e.clientY);
      if (hit) {
        this.draggedNode = hit;
        hit.fx = hit.x;
        hit.fy = hit.y;
      } else {
        this.isDragging = true;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
      }
    });

    window.addEventListener('mousemove', e => {
      if (this.draggedNode) {
        const rect = this.canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left - this.width / 2;
        const screenY = e.clientY - rect.top - this.height / 2;
        this.draggedNode.x = screenX / this.camera.zoom + this.camera.x;
        this.draggedNode.y = screenY / this.camera.zoom + this.camera.y;
        this.draggedNode.fx = this.draggedNode.x;
        this.draggedNode.fy = this.draggedNode.y;
      } else if (this.isDragging) {
        const dx = (e.clientX - this.dragStartX) / this.camera.zoom;
        const dy = (e.clientY - this.dragStartY) / this.camera.zoom;
        this.camera.x -= dx;
        this.camera.y -= dy;
        this.camera.targetX = this.camera.x;
        this.camera.targetY = this.camera.y;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
      } else {
        const hit = this.findNodeAt(e.clientX, e.clientY);
        this.hoveredNode = hit;
        if (this.onNodeHover) this.onNodeHover(hit, e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.draggedNode) {
        this.draggedNode.fx = null;
        this.draggedNode.fy = null;
        this.draggedNode = null;
      }
      this.isDragging = false;
    });

    this.canvas.addEventListener('click', e => {
      const hit = this.findNodeAt(e.clientX, e.clientY);
      if (hit && this.onNodeClick) {
        this.onNodeClick(hit);
      }
    });

    this.canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      this.camera.targetZoom = Math.max(0.25, Math.min(3.5, this.camera.zoom * zoomFactor));
    }, { passive: false });
  }

  focusNode(node, zoom = 1.35) {
    this.selectedNode = node;
    this.camera.targetX = node.x;
    this.camera.targetY = node.y;
    this.camera.targetZoom = zoom;
  }

  resetCamera() {
    this.selectedNode = null;
    this.camera.targetX = 0;
    this.camera.targetY = 0;
    this.camera.targetZoom = 1;
  }
}

window.CanvasEngine = CanvasEngine;
