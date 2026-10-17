<script lang="ts">
  import { onMount } from 'svelte';
  import { graphStore } from '../graphStore.svelte';

  let radarCanvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  function renderRadar() {
    if (!radarCanvas || !ctx) return;
    const w = radarCanvas.width = radarCanvas.parentElement?.clientWidth || 250;
    const h = radarCanvas.height = (radarCanvas.parentElement?.clientHeight || 250) - 34;

    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;

    // Draw radar target rings
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, 35, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 70, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 105, 0, Math.PI * 2); ctx.stroke();

    if (!graphStore.selectedNode) return;

    // Center Node
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#38BDF8';
    ctx.fill();

    // Neighbors
    const neighbors = graphStore.connectedNeighbors;
    neighbors.forEach(({ node: nb }, idx) => {
      const angle = (idx / neighbors.length) * Math.PI * 2;
      const dist = 70;
      const nx = cx + Math.cos(angle) * dist;
      const ny = cy + Math.sin(angle) * dist;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(nx, ny, 6, 0, Math.PI * 2);
      ctx.fillStyle = graphStore.getNodeColor(nb);
      ctx.fill();
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  $effect(() => {
    // Re-render radar whenever selected node or connected neighbors update
    if (graphStore.selectedNode || graphStore.connectedNeighbors) {
      renderRadar();
    }
  });

  onMount(() => {
    ctx = radarCanvas.getContext('2d')!;
    renderRadar();
    window.addEventListener('resize', renderRadar);
    return () => window.removeEventListener('resize', renderRadar);
  });
</script>

<div class="micro-radar-box" class:active={graphStore.primaryView === 'kinetic'}>
  <div class="radar-header">
    <span>Story Entity Radar</span>
    <span style="color: var(--text-muted);">
      {graphStore.selectedNode ? graphStore.selectedNode.label.slice(0, 18) + '…' : 'Active'}
    </span>
  </div>
  <canvas bind:this={radarCanvas} id="radarCanvas"></canvas>
</div>
