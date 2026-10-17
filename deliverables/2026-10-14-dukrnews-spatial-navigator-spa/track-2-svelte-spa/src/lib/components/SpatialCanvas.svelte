<script lang="ts">
  import { onMount } from 'svelte';
  import { graphStore } from '../graphStore.svelte';
  import type { NewsNode } from '../types';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let width = 0;
  let height = 0;

  let camera = { x: 0, y: 0, zoom: 1, targetX: 0, targetY: 0, targetZoom: 1 };
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let draggedNode: NewsNode | null = null;

  // React to selectedNode changes from anywhere (e.g. wire feed, hops)
  $effect(() => {
    if (graphStore.selectedNode) {
      camera.targetX = graphStore.selectedNode.x;
      camera.targetY = graphStore.selectedNode.y;
      camera.targetZoom = 1.35;
    }
  });

  // React to spatialSubMode changes
  $effect(() => {
    if (graphStore.spatialSubMode === 'geospatial') {
      camera.targetX = 0;
      camera.targetY = 0;
      camera.targetZoom = 0.9;
    }
  });

  function resize() {
    if (!canvas) return;
    const parent = canvas.parentElement;
    width = canvas.width = Math.max(300, parent?.clientWidth || window.innerWidth);
    height = canvas.height = Math.max(300, parent?.clientHeight || (window.innerHeight - 64));
  }

  function stepPhysics() {
    const nodes = graphStore.nodes;
    const edges = graphStore.edges;

    if (graphStore.spatialSubMode === 'geospatial') {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.geoX !== null && n.geoX !== undefined && n.geoY !== null && n.geoY !== undefined) {
          n.x += (n.geoX - n.x) * 0.08;
          n.y += (n.geoY - n.y) * 0.08;
        } else {
          const targetY = -height / 2 + 110;
          n.y += (targetY - n.y) * 0.05;
        }
      }
      return;
    }

    // Repulsion
    const maxDist = 380;
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const distSq = dx * dx + dy * dy + 100;
        if (distSq < maxDist * maxDist) {
          const dist = Math.sqrt(distSq);
          const force = (maxDist - dist) / dist * 0.35;
          const fx = dx * force * 0.02;
          const fy = dy * force * 0.02;
          if (!n1.fx) { n1.vx -= fx; n1.vy -= fy; }
          if (!n2.fx) { n2.vx += fx; n2.vy += fy; }
        }
      }
    }

    // Spring attraction
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      if (!e.sourceNode || !e.targetNode) continue;
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

    // Velocity integration
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.vx -= n.x * 0.0008;
      n.vy -= n.y * 0.0008;
      n.x += n.vx;
      n.y += n.vy;
      n.vx *= 0.86;
      n.vy *= 0.86;
    }
  }

  function render() {
    camera.x += (camera.targetX - camera.x) * 0.1;
    camera.y += (camera.targetY - camera.y) * 0.1;
    camera.zoom += (camera.targetZoom - camera.zoom) * 0.1;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-camera.x, -camera.y);

    // Geospatial coordinate grid
    if (graphStore.spatialSubMode === 'geospatial') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-600, -350, 1200, 700);
      for (let gx = -500; gx <= 500; gx += 200) {
        ctx.beginPath(); ctx.moveTo(gx, -350); ctx.lineTo(gx, 350); ctx.stroke();
      }
      for (let gy = -300; gy <= 300; gy += 150) {
        ctx.beginPath(); ctx.moveTo(-600, gy); ctx.lineTo(600, gy); ctx.stroke();
      }
    }

    // Edges
    const edges = graphStore.edges;
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      if (!e.sourceNode || !e.targetNode) continue;

      if (graphStore.activeFilter !== 'all') {
        if (e.sourceNode.group !== graphStore.activeFilter && e.targetNode.group !== graphStore.activeFilter) continue;
      }

      const isConnected = graphStore.selectedNode && (e.sourceNode === graphStore.selectedNode || e.targetNode === graphStore.selectedNode);
      const isHovered = graphStore.hoveredNode && (e.sourceNode === graphStore.hoveredNode || e.targetNode === graphStore.hoveredNode);

      ctx.beginPath();
      if (graphStore.spatialSubMode === 'geospatial') {
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

    // Nodes
    const nodes = graphStore.nodes;
    const isSwiss = graphStore.theme === 'theme-swiss';

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (graphStore.activeFilter !== 'all' && n.group !== graphStore.activeFilter) continue;

      const isSelected = n === graphStore.selectedNode;
      const isHovered = n === graphStore.hoveredNode;
      const color = graphStore.getNodeColor(n);
      const radius = (n.size || 14) * (isSelected ? 1.4 : isHovered ? 1.25 : 1);

      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.32)' : 'rgba(255, 255, 255, 0.16)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = isSelected ? 2.5 : 1;
      ctx.stroke();

      if (camera.zoom > 0.55 || isSelected || isHovered || (n.size || 14) > 22) {
        ctx.fillStyle = isSelected ? '#38BDF8' : '#FFF';
        ctx.font = `${isSelected ? '600 13px' : '500 11px'} ${isSwiss ? 'Newsreader' : 'Inter'}`;
        ctx.textAlign = 'center';
        const label = n.label.length > 28 ? n.label.slice(0, 26) + '…' : n.label;
        ctx.fillText(label, n.x, n.y + radius + 14);
      }
    }

    ctx.restore();
  }

  function findNodeAt(clientX: number, clientY: number): NewsNode | null {
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const screenX = clientX - rect.left - width / 2;
    const screenY = clientY - rect.top - height / 2;
    const worldX = screenX / camera.zoom + camera.x;
    const worldY = screenY / camera.zoom + camera.y;

    const nodes = graphStore.nodes;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      if (graphStore.activeFilter !== 'all' && n.group !== graphStore.activeFilter) continue;
      const dx = worldX - n.x;
      const dy = worldY - n.y;
      if (dx * dx + dy * dy <= ((n.size || 14) + 10) * ((n.size || 14) + 10)) {
        return n;
      }
    }
    return null;
  }

  onMount(() => {
    ctx = canvas.getContext('2d')!;
    resize();

    const ro = new ResizeObserver(() => resize());
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    window.addEventListener('resize', resize);

    let lastFps = performance.now();
    let frames = 0;

    let animId: number;
    const loop = (ts: number) => {
      frames++;
      if (ts - lastFps >= 1000) {
        graphStore.fps = frames;
        frames = 0;
        lastFps = ts;
      }

      stepPhysics();
      render();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('resize', resize);
    };
  });

  function handleMouseDown(e: MouseEvent) {
    const hit = findNodeAt(e.clientX, e.clientY);
    if (hit) {
      draggedNode = hit;
      hit.fx = hit.x;
      hit.fy = hit.y;
    } else {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (draggedNode && canvas) {
      const rect = canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left - width / 2;
      const screenY = e.clientY - rect.top - height / 2;
      draggedNode.x = screenX / camera.zoom + camera.x;
      draggedNode.y = screenY / camera.zoom + camera.y;
      draggedNode.fx = draggedNode.x;
      draggedNode.fy = draggedNode.y;
    } else if (isDragging) {
      const dx = (e.clientX - dragStartX) / camera.zoom;
      const dy = (e.clientY - dragStartY) / camera.zoom;
      camera.x -= dx;
      camera.y -= dy;
      camera.targetX = camera.x;
      camera.targetY = camera.y;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    } else {
      const hit = findNodeAt(e.clientX, e.clientY);
      graphStore.setHoveredNode(hit, { x: e.clientX, y: e.clientY });
    }
  }

  function handleMouseUp() {
    if (draggedNode) {
      draggedNode.fx = null;
      draggedNode.fy = null;
      draggedNode = null;
    }
    isDragging = false;
  }

  function handleClick(e: MouseEvent) {
    const hit = findNodeAt(e.clientX, e.clientY);
    if (hit) {
      graphStore.selectNode(hit);
    }
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    camera.targetZoom = Math.max(0.25, Math.min(3.5, camera.zoom * zoomFactor));
  }
</script>

<canvas 
  bind:this={canvas}
  id="stage"
  style:opacity={graphStore.primaryView === 'kinetic' ? '0.35' : '1'}
  onmousedown={handleMouseDown}
  onmousemove={handleMouseMove}
  onmouseup={handleMouseUp}
  onclick={handleClick}
  onwheel={handleWheel}
></canvas>
