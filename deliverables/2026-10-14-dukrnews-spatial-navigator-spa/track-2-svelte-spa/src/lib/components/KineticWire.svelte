<script lang="ts">
  import { graphStore } from '../graphStore.svelte';
  import type { NewsNode } from '../types';

  let activeStory = $derived.by(() => {
    if (graphStore.selectedNode && graphStore.selectedNode.group === 'story') {
      return graphStore.selectedNode;
    }
    return graphStore.stories[0] || null;
  });

  function getBiasBadge(story: NewsNode) {
    if (!story.bias) return 'Multi-source';
    if (story.bias.right > story.bias.left && story.bias.right > story.bias.center) return 'Lean Right';
    if (story.bias.left > story.bias.right && story.bias.left > story.bias.center) return 'Lean Left';
    return 'Balanced';
  }

  function getHeadlineBias(hl: any, idx: number) {
    if (typeof hl === 'object' && hl.bias) return hl.bias;
    return idx % 3 === 0 ? 'leanLeft' : (idx % 3 === 1 ? 'center' : 'leanRight');
  }

  function getHeadlineColor(biasLabel: string) {
    const l = biasLabel.toLowerCase();
    if (l.includes('left')) return 'var(--bias-left)';
    if (l.includes('right')) return 'var(--bias-right)';
    return 'var(--bias-center)';
  }
</script>

<div class="kinetic-wire-container" class:active={graphStore.primaryView === 'kinetic'}>
  <!-- Column 1: Story Wire -->
  <div class="feed-column">
    <div class="feed-header">
      <span>Harvested Story Feed</span>
      <span style="color: var(--accent);">{graphStore.stories.length} Stories</span>
    </div>
    <div class="feed-scroll">
      {#each graphStore.stories as s}
        <div 
          class="feed-card"
          class:active={s === activeStory}
          role="button"
          tabindex="0"
          onclick={() => graphStore.selectNode(s)}
          onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); graphStore.selectNode(s); } }}
        >
          <div class="feed-card-title">{s.label}</div>
          <div class="feed-card-meta">
            <span class="meta-tag">Sources: <strong>{s.sources_count || 1}</strong></span>
            <span class="meta-tag" style="color:var(--accent);">Bias: {getBiasBadge(s)}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Column 2: Perspectives & Sourcing -->
  <div class="feed-column">
    <div class="feed-header">
      <span>Multi-Perspective Coverage</span>
      <span style="font-family: var(--font-mono); color: var(--text-muted);">Left / Center / Right</span>
    </div>
    <div class="feed-scroll">
      {#if activeStory && activeStory.headlines && activeStory.headlines.length > 0}
        {#each activeStory.headlines as hl, i}
          {@const bias = getHeadlineBias(hl, i)}
          {@const color = getHeadlineColor(bias)}
          <div class="feed-card">
            <div style="font-size: 10px; font-family: var(--font-mono); color: {color}; text-transform: uppercase; margin-bottom: 5px; font-weight: 700;">
              {bias} Perspective
            </div>
            <div style="font-size: 13px; font-weight: 600; line-height: 1.4;">
              "{typeof hl === 'string' ? hl : hl.text}"
            </div>
          </div>
        {/each}
      {:else}
        <div style="color: var(--text-muted); font-size: 13px; text-align: center; margin-top: 50px;">
          Select any story on the left to compare publisher framing and bias angles.
        </div>
      {/if}
    </div>
  </div>
</div>
