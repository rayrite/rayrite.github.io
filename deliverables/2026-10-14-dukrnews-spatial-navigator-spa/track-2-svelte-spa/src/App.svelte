<script lang="ts">
  import { onMount } from 'svelte';
  import { graphStore } from './lib/graphStore.svelte';
  import TopHUD from './lib/components/TopHUD.svelte';
  import SpatialCanvas from './lib/components/SpatialCanvas.svelte';
  import KineticWire from './lib/components/KineticWire.svelte';
  import MicroRadar from './lib/components/MicroRadar.svelte';
  import IntelligenceDrawer from './lib/components/IntelligenceDrawer.svelte';
  import FilterBar from './lib/components/FilterBar.svelte';

  onMount(() => {
    graphStore.load();

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        graphStore.selectNode(null);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        graphStore.setView(graphStore.primaryView === 'spatial' ? 'kinetic' : 'spatial');
      } else if (e.key === 'Escape') {
        graphStore.selectNode(null);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<TopHUD />

<main class="workspace">
  <SpatialCanvas />
  <KineticWire />
  <MicroRadar />
  <FilterBar />
  <IntelligenceDrawer />

  {#if graphStore.hoveredNode}
    <div id="tooltip" style="display: block; left: {graphStore.hoveredPos.x}px; top: {graphStore.hoveredPos.y}px;">
      <strong>{graphStore.hoveredNode.label}</strong><br>
      <span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">
        {graphStore.hoveredNode.group}
      </span>
    </div>
  {/if}
</main>
