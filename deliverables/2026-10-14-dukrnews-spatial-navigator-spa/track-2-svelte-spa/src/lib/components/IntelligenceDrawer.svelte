<script lang="ts">
  import { graphStore } from '../graphStore.svelte';

  let node = $derived(graphStore.selectedNode);
  let isCollapsed = $derived(!graphStore.selectedNode);

  let biasStats = $derived.by(() => {
    if (!node || !node.bias) return null;
    const total = (node.bias.left + node.bias.center + node.bias.right) || 1;
    return {
      lp: Math.round((node.bias.left / total) * 100),
      cp: Math.round((node.bias.center / total) * 100),
      rp: Math.round((node.bias.right / total) * 100)
    };
  });
</script>

<aside class="intel-drawer" class:collapsed={isCollapsed}>
  {#if node}
    <div class="drawer-header">
      <div>
        <span 
          class="drawer-type-badge" 
          style="background: {graphStore.getNodeColor(node)}25; color: {graphStore.getNodeColor(node)};"
        >
          {node.group}
        </span>
        <h2 class="drawer-title">{node.label}</h2>
      </div>
      <button class="drawer-close-btn" onclick={() => graphStore.selectNode(null)}>✕</button>
    </div>

    <div class="drawer-content">
      <!-- Context & Overview -->
      <div>
        <div class="drawer-section-title">Context & Overview</div>
        <p style="font-size: 13px; line-height: 1.5; color: var(--text-muted);">
          {node.summary || (node.details ? JSON.stringify(node.details, null, 2) : 'Extracted news graph entity hub.')}
        </p>
      </div>

      <!-- Bias Spectrum -->
      {#if biasStats}
        <div>
          <div class="drawer-section-title">Political Bias Distribution</div>
          <div class="bias-spectrum-meter">
            <div class="bias-legend">
              <span style="color: var(--bias-left);">Left: <strong>{biasStats.lp}%</strong></span>
              <span style="color: var(--bias-center);">Center: <strong>{biasStats.cp}%</strong></span>
              <span style="color: var(--bias-right);">Right: <strong>{biasStats.rp}%</strong></span>
            </div>
            <div class="bias-bar-wrap">
              <div class="bias-bar-left" style="width: {biasStats.lp}%;"></div>
              <div class="bias-bar-center" style="width: {biasStats.cp}%;"></div>
              <div class="bias-bar-right" style="width: {biasStats.rp}%;"></div>
            </div>
            <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); text-align: center;">
              Based on {node.sources_count || 1} reporting news sources
            </div>
          </div>
        </div>
      {/if}

      <!-- Entity Hop Navigation -->
      <div>
        <div class="drawer-section-title">Connected Entities (Click to Hop)</div>
        <div class="entity-hop-grid">
          {#if graphStore.connectedNeighbors.length === 0}
            <span style="font-size: 12px; color: var(--text-muted);">No direct connected hubs.</span>
          {:else}
            {#each graphStore.connectedNeighbors as { node: nb }}
              {@const nbColor = graphStore.getNodeColor(nb)}
              <div 
                class="hop-tag" 
                role="button" 
                tabindex="0"
                onclick={() => graphStore.selectNode(nb)}
                onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); graphStore.selectNode(nb); } }}
              >
                <span class="badge" style="background: {nbColor}25; color: {nbColor};">{nb.group}</span>
                <span>{nb.label}</span>
              </div>
            {/each}
          {/if}
        </div>
      </div>

      <!-- Headlines List -->
      {#if node.headlines && node.headlines.length > 0}
        <div>
          <div class="drawer-section-title">Publisher Headlines</div>
          <div class="headlines-list">
            {#each node.headlines as hl, i}
              {@const txt = typeof hl === 'string' ? hl : hl.text}
              {@const biasLabel = typeof hl === 'object' && hl.bias ? ` [${hl.bias}]` : ''}
              <div class="headline-item">
                "{txt}" <span class="source-tag">Source Attribution #{i+1}{biasLabel}</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</aside>
