/* ============================================================================
   DUKR ChronoSync — shared runtime (window.CS)
   Load AFTER landing-config.js. No dependencies, works from file:// and http.
   ============================================================================ */
(function () {
  'use strict';
  var C = window.CHRONOSYNC;
  var doc = document, html = doc.documentElement;

  /* ---------- helpers ---------- */
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function el(tag, cls, text) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function join(root, dir, file) { return root + dir + encodeURI(file); }

  /* ---------- subjects ---------- */
  var subjects = C.subjects.map(function (s, i) {
    var m = s.file.match(/v(\d+(?:\.\d+)+)/);
    var words = s.name.split(/\s+/);
    return {
      index: i, id: s.id, name: s.name, short: words[0], fullName: s.fullName || s.name,
      tagline: s.tagline || '', accent: s.accent || '#ffffff', focus: s.focus || '50% 30%',
      credit: s.credit || null, file: s.file,
      href: join(C.root, C.timelinesDir, s.file),
      img: C.root + s.portrait,
      initials: words.map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase(),
      version: m ? m[1] : ''
    };
  });
  function byId(id) { return subjects.filter(function (s) { return s.id === id; })[0] || null; }

  /* ---------- settings (query string, hub postMessage, reduced motion) ---------- */
  var qs = new URLSearchParams(location.search);
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var settings = {
    intensity: clamp(isNaN(parseFloat(qs.get('i'))) ? 1 : parseFloat(qs.get('i')), 0, 2),
    reduced: qs.get('motion') === 'off' || mq.matches,
    paused: qs.get('paused') === '1'
  };
  var userReduced = qs.get('motion') === 'off';

  function applySettings() {
    html.classList.toggle('cs-reduced', settings.reduced);
    html.classList.toggle('cs-paused', settings.paused || settings.intensity === 0);
    html.style.setProperty('--cs-i', String(Math.max(0.1, settings.intensity)));
    window.dispatchEvent(new CustomEvent('cs:settings', { detail: settings }));
  }
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.type !== 'cs-settings') return;
    if (typeof d.intensity === 'number') settings.intensity = clamp(d.intensity, 0, 2);
    if (typeof d.reduced === 'boolean') { userReduced = d.reduced; settings.reduced = d.reduced || mq.matches; }
    if (typeof d.paused === 'boolean') settings.paused = d.paused;
    applySettings();
  });
  if (mq.addEventListener) mq.addEventListener('change', function () { settings.reduced = userReduced || mq.matches; applySettings(); });

  function running() { return !settings.paused && settings.intensity > 0 && !settings.reduced && !doc.hidden; }

  /* Animation loop. fn(dt, t): dt is seconds already scaled by intensity.
     While motion is off it is called once (dt = 0) per settings change / resize so
     canvases still draw a still frame. */
  function loop(fn) {
    var last = 0;
    function frame(t) {
      requestAnimationFrame(frame);
      var dt = Math.min(0.05, (t - last) / 1000 || 0); last = t;
      if (running()) fn(dt * settings.intensity, t / 1000);
    }
    function still() { if (!running()) fn(0, performance.now() / 1000); }
    window.addEventListener('cs:settings', still);
    window.addEventListener('resize', function () { setTimeout(still, 60); });
    requestAnimationFrame(function (t) { last = t; still(); requestAnimationFrame(frame); });
  }

  /* Fit a canvas to the viewport at devicePixelRatio (capped); returns {ctx, w, h}. */
  function fitCanvas(canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = window.innerWidth, h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  /* ---------- text fill ---------- */
  function fill() {
    doc.title = C.brand.title;
    [['data-cs-title', C.brand.title], ['data-cs-tagline', C.brand.tagline], ['data-cs-footer', C.brand.footer]]
      .forEach(function (p) {
        Array.prototype.forEach.call(doc.querySelectorAll('[' + p[0] + ']'), function (n) { n.textContent = p[1]; });
      });
  }

  /* ---------- portrait with monogram fallback ---------- */
  function img(node, s, alt) {
    node.alt = alt == null ? '' : alt;
    node.decoding = 'sync';
    node.style.objectFit = 'cover'; node.style.objectPosition = s.focus;
    node.addEventListener('error', function () {
      var m = el('div', node.className + ' cs-mono', s.initials);
      m.style.setProperty('--cs-accent', s.accent);
      m.setAttribute('role', 'img'); m.setAttribute('aria-label', alt || s.name);
      if (node.parentNode) node.parentNode.replaceChild(m, node);
    }, { once: true });
    node.src = s.img;
    return node;
  }

  /* ---------- router ---------- */
  var routeCbs = [];
  function route() {
    var m = location.hash.match(/^#\/subject\/([^\/?]+)/);
    if (m) { var s = byId(decodeURIComponent(m[1])); if (s) return { name: 'subject', subject: s }; }
    return { name: 'home' };
  }
  function onRoute(cb) { routeCbs.push(cb); cb(route()); }
  function go(s) { location.hash = s ? '#/subject/' + s.id : '#/'; }

  /* ---------- detail dialog ---------- */
  var dlg, parts = {};
  function buildDialog() {
    dlg = el('dialog', 'cs-dialog');
    dlg.setAttribute('aria-labelledby', 'cs-d-name');
    var card = el('div', 'cs-d-card');
    parts.close = el('button', 'cs-d-close', '×'); parts.close.type = 'button'; parts.close.setAttribute('aria-label', 'Close');
    var photo = el('div', 'cs-d-photo'); parts.img = el('img'); photo.appendChild(parts.img);
    var body = el('div', 'cs-d-body');
    parts.name = el('h2', 'cs-d-name'); parts.name.id = 'cs-d-name';
    parts.tag = el('p', 'cs-d-tag'); parts.meta = el('p', 'cs-d-meta');
    parts.open = el('a', 'cs-d-open'); parts.credit = el('p', 'cs-d-credit');
    body.append(parts.name, parts.tag, parts.meta, parts.open, parts.credit);
    card.append(parts.close, photo, body); dlg.appendChild(card); doc.body.appendChild(dlg);
    parts.close.addEventListener('click', close);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
  }
  function open(s) {
    if (!dlg) buildDialog();
    dlg.style.setProperty('--cs-accent', s.accent);
    var fresh = el('img'); fresh.className = parts.img.className;
    parts.img.replaceWith(fresh); parts.img = fresh; img(fresh, s, s.name + ' portrait');
    parts.name.textContent = s.fullName; parts.tag.textContent = s.tagline;
    parts.meta.textContent = s.version ? 'Timeline version ' + s.version : '';
    parts.open.textContent = 'Open ' + s.short + '’s timeline';
    parts.open.href = s.href;
    if (C.openInNewTab) { parts.open.target = '_blank'; parts.open.rel = 'noopener'; }
    else { parts.open.removeAttribute('target'); }
    parts.credit.textContent = '';
    if (s.credit) {
      parts.credit.append('Photo: ' + s.credit.author + ', ' + s.credit.license + '. ');
      var a = el('a', null, 'Wikimedia Commons'); a.href = s.credit.source; a.target = '_blank'; a.rel = 'noopener';
      parts.credit.appendChild(a);
    }
    if (!dlg.open) { dlg.showModal(); }
    parts.open.focus();
  }
  function close() {
    if (dlg && dlg.open) dlg.close();
    if (route().name === 'subject') location.hash = '#/';
  }
  function syncDialog(r) { if (r.name === 'subject') open(r.subject); else if (dlg && dlg.open) dlg.close(); }
  window.addEventListener('hashchange', function () { var r = route(); routeCbs.forEach(function (cb) { cb(r); }); });
  onRoute(function (r) { if (doc.body) syncDialog(r); else doc.addEventListener('DOMContentLoaded', function () { syncDialog(r); }); });

  /* ---------- injected base CSS (dialog + motion switches) ---------- */
  var css = [
    'html.cs-reduced *,html.cs-reduced *::before,html.cs-reduced *::after{animation:none!important;transition-duration:.01ms!important;scroll-behavior:auto!important}',
    'html.cs-paused *,html.cs-paused *::before,html.cs-paused *::after{animation-play-state:paused!important}',
    '.cs-mono{display:grid;place-items:center;font-weight:800;letter-spacing:.04em;color:#fff;background:linear-gradient(145deg,var(--cs-accent,#888),#1b1b2a);font-size:clamp(1.4rem,6vw,3rem)}',
    '.cs-dialog{margin:auto;border:0;padding:0;background:transparent;max-width:min(860px,94vw);width:100%;color:var(--cs-panel-fg,#eef2ff);font-family:var(--cs-font,system-ui,sans-serif);overflow:visible}',
    '.cs-dialog::backdrop{background:var(--cs-backdrop,rgba(4,6,18,.72));backdrop-filter:blur(6px)}',
    '.cs-d-card{position:relative;display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);background:var(--cs-panel-bg,#12172e);border-radius:var(--cs-radius,26px);overflow:auto;max-height:calc(100dvh - 24px);box-shadow:0 30px 80px rgba(0,0,0,.45);border:var(--cs-panel-border,1px solid rgba(255,255,255,.12));animation:cs-pop .28s cubic-bezier(.2,.9,.3,1.2)}',
    '@keyframes cs-pop{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}',
    '.cs-d-photo{min-height:300px;background:#000}.cs-d-photo>*{width:100%;height:100%;min-height:300px;display:block}',
    '.cs-d-body{padding:clamp(22px,4vw,38px);display:flex;flex-direction:column;gap:10px;justify-content:center}',
    '.cs-d-name{margin:0;font-size:clamp(1.6rem,4vw,2.3rem);line-height:1.1;font-weight:800}',
    '.cs-d-tag{margin:0;font-size:1.05rem;opacity:.85}.cs-d-meta{margin:0;font-size:.9rem;opacity:.6}',
    '.cs-d-open{align-self:flex-start;margin-top:10px;padding:13px 24px;border-radius:999px;background:var(--cs-accent,#f5c451);color:var(--cs-on-accent,#14110a);font-weight:800;text-decoration:none;font-size:1rem;transition:transform .15s,box-shadow .15s}',
    '.cs-d-open:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(0,0,0,.35)}',
    '.cs-d-credit{margin:14px 0 0;font-size:.78rem;opacity:.6;line-height:1.5}.cs-d-credit a{color:inherit}',
    '.cs-d-close{position:absolute;top:10px;right:12px;z-index:2;width:42px;height:42px;border-radius:50%;border:0;cursor:pointer;font-size:1.6rem;line-height:1;background:rgba(0,0,0,.45);color:#fff}',
    '.cs-d-close:hover{background:rgba(0,0,0,.7)}',
    '.cs-d-open:focus-visible,.cs-d-close:focus-visible,.cs-d-credit a:focus-visible{outline:3px solid var(--cs-accent,#f5c451);outline-offset:3px}',
    '@media (max-width:640px){.cs-d-card{grid-template-columns:1fr}.cs-d-photo,.cs-d-photo>*{min-height:0;height:min(48vw,230px)}}'
  ].join('\n');
  var style = el('style'); style.textContent = css; doc.head.appendChild(style);

  applySettings();

  window.CS = {
    config: C, subjects: subjects, byId: byId, settings: settings,
    fill: fill, img: img, loop: loop, fitCanvas: fitCanvas, running: running,
    route: route, onRoute: onRoute, go: go,
    detail: { open: open, close: close }
  };
})();
