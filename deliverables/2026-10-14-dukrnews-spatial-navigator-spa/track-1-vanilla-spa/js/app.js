/**
 * DukrNews Spatial Navigator — Track 1 Main Bootstrapper
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[App] Initializing DukrNews Spatial Navigator (Track 1 Vanilla SPA)...');

  const store = new NewsDataStore();
  await store.load();

  const physics = new GraphPhysics(store);
  const canvasElement = document.getElementById('stage');
  const engine = new CanvasEngine(canvasElement, store, physics);
  const nav = new NavigationManager(engine, store);
  const wire = new WireManager(store, engine, nav);

  // Link Callbacks
  engine.onFpsUpdate = (fps) => {
    document.getElementById('fpsVal').innerText = fps;
  };

  engine.onNodeClick = (node) => {
    nav.openDrawer(node);
    if (node.group === 'story') {
      wire.activeStory = node;
      wire.renderPerspectives(node);
      wire.renderRadar(node);
    }
  };

  const tooltip = document.getElementById('tooltip');
  engine.onNodeHover = (node, clientX, clientY) => {
    if (node) {
      tooltip.style.display = 'block';
      tooltip.style.left = clientX + 'px';
      tooltip.style.top = clientY + 'px';
      tooltip.innerHTML = `<strong>${node.label}</strong><br><span style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">${node.group}</span>`;
    } else {
      tooltip.style.display = 'none';
    }
  };

  // Primary View Switcher Elements
  const tabSpatial = document.getElementById('tabSpatialMode');
  const tabKinetic = document.getElementById('tabKineticMode');
  const spatialSubToggle = document.getElementById('spatialSubToggle');
  const wireContainer = document.getElementById('kineticWireContainer');
  const radarBox = document.getElementById('microRadarBox');
  const activeViewLabel = document.getElementById('activeViewLabel');

  let currentView = 'spatial';

  function setView(view) {
    currentView = view;
    if (view === 'spatial') {
      tabSpatial.classList.add('active');
      tabKinetic.classList.remove('active');
      spatialSubToggle.style.display = 'flex';
      wireContainer.classList.remove('active');
      radarBox.classList.remove('active');
      canvasElement.style.opacity = '1';
      activeViewLabel.innerText = physics.mode === 'constellation' ? 'Spatial / Constellation' : 'Spatial / Geospatial';
      if (engine.selectedNode) {
        engine.focusNode(engine.selectedNode);
      }
    } else {
      tabKinetic.classList.add('active');
      tabSpatial.classList.remove('active');
      spatialSubToggle.style.display = 'none';
      wireContainer.classList.add('active');
      radarBox.classList.add('active');
      canvasElement.style.opacity = '0.35';
      activeViewLabel.innerText = 'Kinetic Column Wire';
      wire.populateFeed();
    }
  }

  tabSpatial.onclick = () => setView('spatial');
  tabKinetic.onclick = () => setView('kinetic');

  // Sub-Toggles for Spatial
  const btnConstellation = document.getElementById('subBtnConstellation');
  const btnGeospatial = document.getElementById('subBtnGeospatial');

  btnConstellation.onclick = () => {
    physics.setMode('constellation');
    btnConstellation.classList.add('active');
    btnGeospatial.classList.remove('active');
    activeViewLabel.innerText = 'Spatial / Constellation';
  };

  btnGeospatial.onclick = () => {
    physics.setMode('geospatial');
    btnGeospatial.classList.add('active');
    btnConstellation.classList.remove('active');
    activeViewLabel.innerText = 'Spatial / Geospatial';
    engine.camera.targetZoom = 0.9;
    engine.camera.targetX = 0;
    engine.camera.targetY = 0;
  };

  // Theme Switcher Buttons
  document.querySelectorAll('[data-theme]').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('[data-theme]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.body.className = btn.dataset.theme;
    };
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', e => {
    if (e.key === ' ' && e.target === document.body) {
      e.preventDefault();
      engine.resetCamera();
      nav.closeDrawer();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setView(currentView === 'spatial' ? 'kinetic' : 'spatial');
    } else if (e.key === 'Escape') {
      nav.closeDrawer();
    } else if (currentView === 'kinetic' && (e.key === 'j' || e.key === 'k')) {
      const stories = store.getByType('story');
      const idx = stories.indexOf(wire.activeStory);
      if (e.key === 'j' && idx < stories.length - 1) {
        wire.selectStory(stories[idx + 1]);
      } else if (e.key === 'k' && idx > 0) {
        wire.selectStory(stories[idx - 1]);
      }
    }
  });

  // Start Engine & Select initial story
  engine.start();
  window.addEventListener('resize', () => engine.resize());

  const initialStory = store.getByType('story')[0];
  if (initialStory) {
    setTimeout(() => {
      nav.openDrawer(initialStory);
    }, 350);
  }

  console.log('[App] Track 1 Vanilla SPA running at 60 FPS.');
});
