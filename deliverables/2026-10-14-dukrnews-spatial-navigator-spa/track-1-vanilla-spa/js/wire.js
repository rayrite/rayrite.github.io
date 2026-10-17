/**
 * DukrNews Spatial Navigator — Track 1 Kinetic Column Wire & Floating Radar
 */
class WireManager {
  constructor(dataStore, engine, navManager) {
    this.store = dataStore;
    this.engine = engine;
    this.nav = navManager;

    this.container = document.getElementById('kineticWireContainer');
    this.storiesList = document.getElementById('feedStoriesList');
    this.perspectivesList = document.getElementById('feedPerspectivesList');
    this.radarBox = document.getElementById('microRadarBox');
    this.radarCanvas = document.getElementById('radarCanvas');
    this.radarCtx = this.radarCanvas.getContext('2d');
    this.radarLabel = document.getElementById('radarActiveStoryLabel');

    this.activeStory = null;
    this.init();
  }

  init() {
    this.resizeRadar();
    window.addEventListener('resize', () => this.resizeRadar());
  }

  resizeRadar() {
    this.radarCanvas.width = this.radarCanvas.parentElement.clientWidth;
    this.radarCanvas.height = this.radarCanvas.parentElement.clientHeight - 34;
  }

  populateFeed() {
    const stories = this.store.getByType('story');
    this.storiesList.innerHTML = '';

    stories.forEach(s => {
      const card = document.createElement('div');
      card.className = 'feed-card' + (s === this.activeStory ? ' active' : '');
      const biasText = s.bias ? (s.bias.right > s.bias.left ? 'Lean Right' : (s.bias.left > s.bias.right ? 'Lean Left' : 'Balanced')) : 'Multi-source';
      
      card.innerHTML = `
        <div class="feed-card-title">${s.label}</div>
        <div class="feed-card-meta">
          <span class="meta-tag">Sources: <strong>${s.sources_count || 1}</strong></span>
          <span class="meta-tag" style="color:var(--accent);">Bias: ${biasText}</span>
        </div>
      `;

      card.onclick = () => {
        document.querySelectorAll('.feed-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.selectStory(s);
      };

      this.storiesList.appendChild(card);
    });

    if (!this.activeStory && stories.length > 0) {
      this.selectStory(stories[0]);
    } else if (this.activeStory) {
      this.selectStory(this.activeStory);
    }
  }

  selectStory(story) {
    this.activeStory = story;
    this.radarLabel.innerText = story.label.slice(0, 22) + '…';
    this.renderPerspectives(story);
    this.renderRadar(story);
    this.nav.openDrawer(story);
  }

  renderPerspectives(story) {
    this.perspectivesList.innerHTML = '';
    if (!story.headlines || story.headlines.length === 0) {
      this.perspectivesList.innerHTML = `
        <div style="color:var(--text-muted); font-size:13px; text-align:center; margin-top:50px;">
          No publisher headlines recorded for this story.
        </div>`;
      return;
    }

    story.headlines.forEach((hl, i) => {
      const card = document.createElement('div');
      card.className = 'feed-card';
      const biasLabel = typeof hl === 'object' && hl.bias ? hl.bias : (i % 3 === 0 ? 'leanLeft' : (i % 3 === 1 ? 'center' : 'leanRight'));
      const biasColor = biasLabel.toLowerCase().includes('left') ? 'var(--bias-left)' : (biasLabel.toLowerCase().includes('right') ? 'var(--bias-right)' : 'var(--bias-center)');
      const txt = typeof hl === 'string' ? hl : hl.text;

      card.innerHTML = `
        <div style="font-size:10px; font-family:var(--font-mono); color:${biasColor}; text-transform:uppercase; margin-bottom:5px; font-weight:700;">
          ${biasLabel} Perspective
        </div>
        <div style="font-size:13px; font-weight:600; line-height:1.4;">"${txt}"</div>
      `;
      this.perspectivesList.appendChild(card);
    });
  }

  renderRadar(story) {
    const ctx = this.radarCtx;
    const w = this.radarCanvas.width;
    const h = this.radarCanvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    // Draw radar target rings
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, 35, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 70, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 105, 0, Math.PI * 2); ctx.stroke();

    // Central Node
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#38BDF8';
    ctx.fill();

    // Connected entities
    const neighbors = this.store.getNeighbors(story.id);
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
      ctx.fillStyle = this.engine.getNodeColor(nb);
      ctx.fill();
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }
}

window.WireManager = WireManager;
