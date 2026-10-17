<script lang="ts">
  import { graphStore } from '../graphStore.svelte';
  import type { FilterType } from '../types';

  const filterChips: { id: FilterType; label: string; color?: string }[] = [
    { id: 'all', label: 'All Entities' },
    { id: 'person', label: 'People', color: 'var(--entity-person)' },
    { id: 'topic', label: 'Topics', color: 'var(--entity-topic)' },
    { id: 'place', label: 'Places', color: 'var(--entity-place)' },
    { id: 'thing', label: 'Things', color: 'var(--entity-thing)' },
    { id: 'story', label: 'Stories', color: 'var(--entity-story)' }
  ];
</script>

<!-- Telemetry HUD Badge -->
<div class="telemetry-badge">
  <span>FPS: <strong class="fps-good">{graphStore.fps}</strong></span>
  <span>ACTIVE NODES: <strong>{graphStore.nodes.length}</strong></span>
  <span>VIEW: <strong style="color: var(--accent);">
    {graphStore.primaryView === 'spatial' 
      ? (graphStore.spatialSubMode === 'constellation' ? 'Spatial / Constellation' : 'Spatial / Geospatial')
      : 'Kinetic Column Wire'}
  </strong></span>
  <span style="color: rgba(255,255,255,0.4);">[Tab] Toggle Wire | [Space] Reset Camera</span>
</div>

<!-- Bottom Filter Bar -->
<div class="filter-hud">
  {#each filterChips as chip}
    <button 
      class="filter-chip"
      class:active={graphStore.activeFilter === chip.id}
      onclick={() => graphStore.setFilter(chip.id)}
    >
      {#if chip.color}
        <span class="dot" style="background: {chip.color};"></span>
      {/if}
      {chip.label}
    </button>
  {/each}
  <button 
    class="filter-chip" 
    style="margin-left: 8px; color: var(--accent);"
    onclick={() => graphStore.selectNode(null)}
  >
    ⟲ Reset Camera
  </button>
</div>
