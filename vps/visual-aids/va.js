/** va.js — tiny shared behavior for every visual aid.
 *  Each visual-aid HTML:
 *    - includes Mermaid via CDN
 *    - calls MermaidBot()  once
 *    - has div.stage containers holding a .zoom-inner (the actual content)
 *    - has +/- buttons + zoom% pct + (optional) print button in the header
 *  This file does the wiring: zoom on each panel, shared header buttons,
 *  keyboard shortcuts.
 */
(function () {
  if (window.mermaid) {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      securityLevel: 'loose',
      themeVariables: {
        background: 'transparent', primaryColor: '#1c212c', primaryTextColor: '#e6e9ef',
        primaryBorderColor: '#3a4252', lineColor: '#5b6680', secondaryColor: '#1c212c',
        tertiaryColor: '#11151c',
        fontFamily: 'ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        fontSize: '13px', clusterBkg: '#11151c', clusterBorder: '#2b313c',
        edgeLabelBackground: '#161a22', noteBkgColor: '#1c212c', noteTextColor: '#e6e9ef',
        noteBorderColor: '#7aa2ff'
      },
      flowchart: { htmlLabels: true, curve: 'basis' }
    });
  }

  const stages = Array.from(document.querySelectorAll('.stage'));

  function setZoom(st, next) {
    const cur = parseFloat(st.dataset.zoom || 1);
    const clamped = Math.min(3, Math.max(0.5, next));
    st.dataset.zoom = clamped;
    const inner = st.querySelector('.zoom-inner') || st;
    inner.style.transform = 'scale(' + clamped + ')';
    inner.style.transformOrigin = 'top left';
    if (clamped > 1) st.style.minHeight = (inner.scrollHeight * clamped + 24) + 'px';
    else st.style.minHeight = '';
    const q = st.querySelector('.pct');
    if (q) q.textContent = Math.round(clamped * 100) + '%';
  }

  function pickFocused() {
    const vh = window.innerHeight;
    let best = null, bestDist = Infinity;
    stages.forEach(p => {
      const r = p.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= window.innerHeight) return;
      const d = Math.abs((r.top + r.height / 2) - vh / 2);
      if (d < bestDist) { best = p; bestDist = d; }
    });
    return best || stages[0];
  }

  stages.forEach(st => {
    const inner = st.querySelector('.zoom-inner');
    st.addEventListener('wheel', e => {
      if (e.ctrlKey || e.metaKey || e.target.closest('.mermaid-rendered, .stage pre')) {
        e.preventDefault();
        const cur = parseFloat(st.dataset.zoom || 1);
        const delta = (e.deltaY > 0 ? -0.1 : 0.1);
        setZoom(st, cur + delta);
      }
    }, { passive: false });

    let lastDist = 0;
    st.addEventListener('touchstart', e => {
      if (e.touches.length === 2) lastDist = pinch(e.touches);
    });
    st.addEventListener('touchmove', e => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const d = pinch(e.touches);
        const f = d / lastDist;
        lastDist = d;
        const cur = parseFloat(st.dataset.zoom || 1);
        setZoom(st, cur * f);
      }
    }, { passive: false });

    const inBtn = st.querySelector('[data-act="in"]');
    const outBtn = st.querySelector('[data-act="out"]');
    if (inBtn) inBtn.onclick = () => setZoom(st, parseFloat(st.dataset.zoom || 1) + 0.1);
    if (outBtn) outBtn.onclick = () => setZoom(st, parseFloat(st.dataset.zoom || 1) - 0.1);
  });

  function pinch(t) { return Math.hypot(t[0].pageX - t[1].pageX, t[0].pageY - t[1].pageY); }

  document.querySelectorAll('.tabs').forEach(tg => {
    const root = tg.closest('.panel');
    tg.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', () => {
        tg.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        root.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        const pane = root.querySelector('.tab-pane[data-pane="' + btn.dataset.pane + '"]');
        if (pane) pane.classList.add('active');
      });
    });
  });

  const zi = document.getElementById('zoomIn');
  const zo = document.getElementById('zoomOut');
  const zr = document.getElementById('zoomReset');
  const pr = document.getElementById('printBtn');
  if (zi) zi.onclick = () => setZoom(pickFocused(), parseFloat(pickFocused().dataset.zoom || 1) + 0.1);
  if (zo) zo.onclick = () => setZoom(pickFocused(), parseFloat(pickFocused().dataset.zoom || 1) - 0.1);
  if (zr) zr.onclick = () => stages.forEach(p => { p.dataset.zoom = 1; const i = p.querySelector('.zoom-inner'); if (i) i.style.transform = 'scale(1)'; p.style.minHeight = ''; const q = p.querySelector('.pct'); if (q) q.textContent = '100%'; });
  if (pr) pr.onclick = () => window.print();

  window.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea')) return;
    if (e.key === '+' || e.key === '=') zi && zi.click();
    else if (e.key === '-' || e.key === '_') zo && zo.click();
    else if (e.key === '0') zr && zr.click();
    else if (e.key === 'p') pr && pr.click();
  });
})();
