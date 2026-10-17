<script lang="ts">
  import { graphStore } from '../graphStore.svelte';
  import type { ThemeMode } from '../types';

  const themes: { id: ThemeMode; label: string }[] = [
    { id: 'theme-obsidian', label: 'Obsidian' },
    { id: 'theme-swiss', label: 'Swiss' },
    { id: 'theme-scifi', label: 'Sci-Fi' }
  ];
</script>

<header class="hud-header">
  <div class="logo-cluster">
    <div class="logo-badge">D</div>
    <div>
      <div class="logo-text">DukrNews Spatial</div>
    </div>
    <div class="logo-tag">Track 2: Svelte 5 Full-Stack</div>
  </div>

  <!-- Primary Unified View Switcher -->
  <div class="view-switcher-group">
    <div class="primary-mode-tabs">
      <button 
        class="primary-tab-btn" 
        class:active={graphStore.primaryView === 'spatial'}
        onclick={() => graphStore.setView('spatial')}
      >
        <span>🌌 Dual-Mode Spatial Canvas</span>
      </button>
      <button 
        class="primary-tab-btn" 
        class:active={graphStore.primaryView === 'kinetic'}
        onclick={() => graphStore.setView('kinetic')}
      >
        <span>📰 Kinetic Column Wire</span>
      </button>
    </div>

    <!-- Spatial Sub-Toggle -->
    {#if graphStore.primaryView === 'spatial'}
      <div class="spatial-sub-toggle">
        <button 
          class="sub-btn" 
          class:active={graphStore.spatialSubMode === 'constellation'}
          onclick={() => graphStore.setSpatialSubMode('constellation')}
        >
          Force Constellation
        </button>
        <button 
          class="sub-btn" 
          class:active={graphStore.spatialSubMode === 'geospatial'}
          onclick={() => graphStore.setSpatialSubMode('geospatial')}
        >
          Geospatial World
        </button>
      </div>
    {/if}
  </div>

  <!-- Themes -->
  <div class="theme-selector">
    <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">THEME:</span>
    {#each themes as t}
      <button 
        class="theme-btn" 
        class:active={graphStore.theme === t.id}
        onclick={() => graphStore.setTheme(t.id)}
      >
        {t.label}
      </button>
    {/each}
  </div>
</header>
