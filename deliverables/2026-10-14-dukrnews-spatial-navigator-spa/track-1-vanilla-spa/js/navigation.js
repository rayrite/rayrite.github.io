/**
 * DukrNews Spatial Navigator — Track 1 Navigation & Intelligence Drawer
 */
class NavigationManager {
  constructor(engine, dataStore) {
    this.engine = engine;
    this.store = dataStore;

    this.drawer = document.getElementById('intelDrawer');
    this.typeBadge = document.getElementById('drawerTypeBadge');
    this.title = document.getElementById('drawerTitle');
    this.summary = document.getElementById('drawerSummary');
    this.biasSection = document.getElementById('drawerBiasSection');
    this.hopGrid = document.getElementById('drawerHopTags');
    this.headlinesSection = document.getElementById('drawerHeadlinesSection');
    this.headlinesList = document.getElementById('drawerHeadlinesList');

    this.onNodeSelectCallback = null;
    this.init();
  }

  init() {
    document.getElementById('drawerCloseBtn').onclick = () => {
      this.closeDrawer();
    };

    document.getElementById('btnResetView').onclick = () => {
      this.engine.resetCamera();
      this.closeDrawer();
    };

    // Filter Chips
    document.querySelectorAll('[data-filter]').forEach(chip => {
      chip.onclick = () => {
        document.querySelectorAll('[data-filter]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.engine.activeFilter = chip.dataset.filter;
      };
    });
  }

  openDrawer(node) {
    this.engine.focusNode(node);
    this.drawer.classList.remove('collapsed');

    const color = this.engine.getNodeColor(node);
    this.typeBadge.innerText = node.group;
    this.typeBadge.style.background = color + '25';
    this.typeBadge.style.color = color;
    this.title.innerText = node.label;
    this.summary.innerText = node.summary || (node.details ? JSON.stringify(node.details, null, 2) : 'Extracted news graph entity hub.');

    // Bias Spectrum
    if (node.bias) {
      this.biasSection.style.display = 'block';
      const total = (node.bias.left + node.bias.center + node.bias.right) || 1;
      const lp = Math.round((node.bias.left / total) * 100);
      const cp = Math.round((node.bias.center / total) * 100);
      const rp = Math.round((node.bias.right / total) * 100);

      document.getElementById('biasLeftVal').innerText = lp + '%';
      document.getElementById('biasCenterVal').innerText = cp + '%';
      document.getElementById('biasRightVal').innerText = rp + '%';

      document.getElementById('biasBarLeft').style.width = lp + '%';
      document.getElementById('biasBarCenter').style.width = cp + '%';
      document.getElementById('biasBarRight').style.width = rp + '%';
      document.getElementById('sourceCountBadge').innerText = `Based on ${node.sources_count || 1} reporting news sources`;
    } else {
      this.biasSection.style.display = 'none';
    }

    // Connected Entities (Hop Tags)
    this.hopGrid.innerHTML = '';
    const neighbors = this.store.getNeighbors(node.id);

    if (neighbors.length === 0) {
      this.hopGrid.innerHTML = '<span style="font-size:12px; color:var(--text-muted);">No direct connected hubs.</span>';
    } else {
      neighbors.forEach(({ node: nb }) => {
        const tag = document.createElement('div');
        tag.className = 'hop-tag';
        const nbColor = this.engine.getNodeColor(nb);
        tag.innerHTML = `<span class="badge" style="background:${nbColor}25; color:${nbColor};">${nb.group}</span> <span>${nb.label}</span>`;
        tag.onclick = () => {
          this.openDrawer(nb);
          if (this.onNodeSelectCallback) this.onNodeSelectCallback(nb);
        };
        this.hopGrid.appendChild(tag);
      });
    }

    // Headlines
    this.headlinesList.innerHTML = '';
    if (node.headlines && node.headlines.length > 0) {
      this.headlinesSection.style.display = 'block';
      node.headlines.forEach((hl, i) => {
        const item = document.createElement('div');
        item.className = 'headline-item';
        const txt = typeof hl === 'string' ? hl : hl.text;
        const biasLabel = typeof hl === 'object' && hl.bias ? ` [${hl.bias}]` : '';
        item.innerHTML = `"${txt}" <span class="source-tag">Source Attribution #${i+1}${biasLabel}</span>`;
        this.headlinesList.appendChild(item);
      });
    } else {
      this.headlinesSection.style.display = 'none';
    }

    if (this.onNodeSelectCallback) this.onNodeSelectCallback(node);
  }

  closeDrawer() {
    this.drawer.classList.add('collapsed');
    this.engine.selectedNode = null;
  }
}

window.NavigationManager = NavigationManager;
