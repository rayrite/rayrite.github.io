"""
Build a single portable HTML image browser from aws_images_unified.json.
Embeds the JSON data directly into the HTML file.
Images are referenced externally from images/ directory.
"""
import json, os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT  = os.path.join(SCRIPT_DIR, "aws_images_unified.json")
OUTPUT = os.path.join(SCRIPT_DIR, "image_browser.html")

with open(INPUT, "r", encoding="utf-8") as f:
    raw_json = f.read()

data = json.loads(raw_json)
print(f"Loaded {len(data)} entries")

compact = json.dumps(data, ensure_ascii=False, separators=(",", ":"))

HTML = r"""<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AWS Exam Image Browser</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --aif:#8b5cf6;--saa:#14b8a6;
  --bg:#f1f5f9;--card:#fff;--border:#e2e8f0;--text:#1e293b;--muted:#64748b;
  --accent:#4f46e5;--accent-hover:#4338ca;
  --card-desc:#475569;--footer-border:#f1f5f9;--tag-cat-bg:#f1f5f9;
  --tip-bg:#fffbeb;--tip-border:#fbbf24;--tip-color:#92400e;
  --sources-color:#94a3b8;
}
[data-theme="dark"]{
  --bg:#0f172a;--card:#1e293b;--border:#334155;--text:#e2e8f0;--muted:#94a3b8;
  --card-desc:#cbd5e1;--footer-border:#334155;--tag-cat-bg:#334155;
  --tip-bg:#422006;--tip-border:#92400e;--tip-color:#fcd34d;
  --sources-color:#64748b;
}
[data-theme="dark"] .tag-aif{background:#2e1065;color:#c4b5fd}
[data-theme="dark"] .tag-saa{background:#134e4a;color:#5eead4}
[data-theme="dark"] .tag-src{background:#1e3a5f;color:#93c5fd}
[data-theme="dark"] ::-webkit-scrollbar-thumb{background:#475569}
html{font-size:var(--font-size,14px)}
body{font-family:'Inter',system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;transition:background .3s,color .3s}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:10px}
::-webkit-scrollbar-thumb:hover{background:#94a3b8}

/* ── Sticky header ── */
.header{position:sticky;top:0;z-index:30;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);box-shadow:0 1px 3px rgba(0,0,0,.06);padding:8px 12px;transition:background .3s}
[data-theme="dark"] .header{background:rgba(15,23,42,.92)}
.header-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px}

/* ── Controls ── */
select,input[type=text]{height:32px;padding:0 8px;border:1px solid var(--border);border-radius:6px;font-size:.8rem;font-family:inherit;background:var(--card);color:var(--text);outline:none;transition:border .15s}
select:focus,input[type=text]:focus{border-color:var(--accent);box-shadow:0 0 0 2px rgba(79,70,229,.15)}
input[type=text]{flex:1 1 120px;min-width:100px}
select{max-width:180px;cursor:pointer}
.search-wrap{position:relative;display:flex;flex:1 1 160px;min-width:120px}
.search-wrap input{width:100%;padding-right:28px}
.search-clear{position:absolute;right:6px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--muted);cursor:pointer;font-size:1rem;line-height:1;display:none}
.search-clear.show{display:block}

.count{font-size:.7rem;color:var(--muted);white-space:nowrap}
.sort-btn,.grid-btn{height:32px;padding:0 10px;border:1px solid var(--border);border-radius:6px;font-size:.72rem;font-family:inherit;cursor:pointer;background:var(--card);color:var(--muted);transition:all .15s;white-space:nowrap}
.sort-btn.active,.grid-btn.active{background:var(--accent);color:#fff;border-color:var(--accent)}
.grid-btns{display:flex;gap:2px}
.grid-btn{padding:0 7px;font-size:.8rem}

.font-ctrl{display:flex;align-items:center;gap:4px;font-size:.7rem;color:var(--muted)}
.font-slider{-webkit-appearance:none;appearance:none;width:56px;height:4px;border-radius:2px;background:var(--border);outline:none;cursor:pointer}
.font-slider::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--accent);cursor:pointer}
.font-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:var(--accent);border:none;cursor:pointer}

/* ── Icon buttons ── */
.icon-btn{width:32px;height:32px;border-radius:6px;border:1px solid var(--border);background:var(--card);color:var(--muted);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;font-size:1rem;transition:all .15s}
.icon-btn:hover{background:rgba(79,70,229,.08);color:var(--accent);border-color:var(--accent)}
.icon-btn.active{background:var(--accent);color:#fff;border-color:var(--accent)}

/* ── Stats bar ── */
.stats-bar{display:flex;flex-wrap:wrap;gap:6px;padding:4px 0 0;font-size:.7rem;color:var(--muted)}
.stats-bar .chip{background:var(--border);padding:2px 8px;border-radius:10px}
.chip-bm{background:rgba(245,158,11,.12);color:#d97706;cursor:pointer;transition:all .15s}
.chip-bm:hover{background:rgba(245,158,11,.22)}
.chip-bm.active{outline:2px solid #f59e0b;outline-offset:-1px}

/* ── Grid ── */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--grid-min,320px),1fr));gap:10px;padding:10px 12px}
@media(max-width:640px){.grid{grid-template-columns:1fr;padding:8px}}

/* ── Card ── */
.card{background:var(--card);border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.06);display:flex;flex-direction:column;border-left:4px solid var(--border);transition:box-shadow .2s,transform .15s;cursor:default;content-visibility:auto;contain-intrinsic-size:0 350px;position:relative;overflow:hidden}
.card:hover{box-shadow:0 4px 12px rgba(0,0,0,.1);transform:translateY(-1px)}
.card.bookmarked{background:linear-gradient(135deg,rgba(245,158,11,.06),transparent 60%)}
.card.exam-aif{border-left-color:var(--aif);background:linear-gradient(90deg,rgba(139,92,246,.03) 0%,transparent 40%)}
.card.exam-saa{border-left-color:var(--saa);background:linear-gradient(90deg,rgba(20,184,166,.03) 0%,transparent 40%)}

.bm-btn{position:absolute;top:8px;right:8px;background:rgba(0,0,0,.4);border:none;cursor:pointer;font-size:1rem;color:#fff;opacity:.7;transition:all .15s;padding:4px 6px;z-index:2;border-radius:4px}
.bm-btn:hover{opacity:1;transform:scale(1.15);background:rgba(0,0,0,.6)}
.bm-btn.active{color:#f59e0b;opacity:1}

/* Thumbnail */
.card-thumb{position:relative;overflow:hidden;cursor:pointer;background:#e2e8f0;min-height:120px}
[data-theme="dark"] .card-thumb{background:#334155}
.card-thumb img{width:100%;height:auto;display:block;transition:transform .3s}
.card:hover .card-thumb img{transform:scale(1.03)}
.card-thumb .enlarge-hint{position:absolute;bottom:6px;right:6px;background:rgba(0,0,0,.5);color:#fff;font-size:.6rem;padding:2px 6px;border-radius:3px;opacity:0;transition:opacity .2s}
.card:hover .card-thumb .enlarge-hint{opacity:1}

/* Card body */
.card-body{padding:10px 12px;flex:1;display:flex;flex-direction:column}
.card-title{font-size:.85rem;font-weight:700;line-height:1.25;word-break:break-word;margin-bottom:4px}
.card-tags{display:flex;flex-wrap:wrap;gap:3px;margin-bottom:6px}

.tag{font-size:.6rem;font-weight:600;padding:1px 6px;border-radius:3px;white-space:nowrap}
.tag-aif{background:#ede9fe;color:#6d28d9}
.tag-saa{background:#ccfbf1;color:#0f766e}
.tag-ch{font-size:.6rem;font-weight:500;padding:1px 6px;border-radius:10px;background:var(--tag-cat-bg);color:var(--muted)}
.tag-src{font-size:.58rem;font-weight:600;padding:1px 5px;border-radius:3px;background:#dbeafe;color:#1e40af}

.card-desc{font-size:.78rem;color:var(--card-desc);line-height:1.5;flex:1;margin-bottom:4px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical}
.card-desc.expanded{-webkit-line-clamp:unset;display:block}

/* Exam focus tip callout */
.exam-tip{font-size:.72rem;line-height:1.4;padding:6px 8px;margin:4px 0;border-left:3px solid var(--tip-border);background:var(--tip-bg);color:var(--tip-color);border-radius:0 4px 4px 0;display:none}
.exam-tip.show{display:block}
.exam-tip.expanded{display:block}

.card-footer{display:flex;justify-content:space-between;align-items:center;padding-top:6px;border-top:1px solid var(--footer-border)}
.card-page{font-size:.7rem;color:var(--muted)}
.expand-btn{font-size:.65rem;color:var(--muted);cursor:pointer;border:none;background:none;padding:2px 4px}
.expand-btn:hover{color:var(--accent)}

/* ── Modal / Lightbox ── */
.modal{display:none;position:fixed;z-index:100;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,.95)}
.modal.active{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px}
.modal-wrap{position:relative;max-width:95vw;max-height:90vh;display:flex;flex-direction:column;align-items:center}
.modal-wrap img{max-width:95vw;max-height:70vh;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,.5);background:#fff;object-fit:contain}
.modal-close{position:fixed;top:15px;right:25px;color:#fff;font-size:2.2rem;cursor:pointer;background:rgba(0,0,0,.5);border:none;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:110;transition:background .2s}
.modal-close:hover{background:#f59e0b;color:#232f3e}
.modal-nav{position:fixed;top:50%;transform:translateY(-50%);color:#fff;font-size:2rem;cursor:pointer;background:rgba(0,0,0,.4);border:none;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;z-index:110;transition:background .2s}
.modal-nav:hover{background:rgba(255,255,255,.2)}
.modal-prev{left:15px}
.modal-next{right:15px}
.modal-info{margin-top:16px;color:#fff;text-align:center;max-width:800px}
.modal-info h3{color:#f59e0b;font-size:1rem;margin-bottom:4px}
.modal-info p{color:#ccc;font-size:.9rem;line-height:1.5;margin:2px 0}
.modal-counter{font-size:.75rem;color:#94a3b8;margin-top:8px}

/* ── Scroll sentinel ── */
.sentinel{height:1px}

/* ── No results ── */
.no-results{text-align:center;padding:60px 20px;color:var(--muted)}
.no-results h2{font-size:1.2rem;font-weight:700;margin-bottom:4px}
.no-results p{font-size:.85rem}

/* ── Loading spinner ── */
.loading{text-align:center;padding:20px;color:var(--muted);font-size:.8rem}
.loading::before{content:"";display:inline-block;width:16px;height:16px;border:2px solid #e2e8f0;border-top-color:var(--accent);border-radius:50%;animation:spin .6s linear infinite;margin-right:6px;vertical-align:middle}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── Back to top ── */
.btt{position:fixed;bottom:20px;right:20px;width:40px;height:40px;border-radius:50%;background:var(--accent);color:#fff;border:none;cursor:pointer;font-size:1.1rem;box-shadow:0 2px 8px rgba(0,0,0,.2);opacity:0;transform:translateY(10px);transition:opacity .2s,transform .2s;z-index:20}
.btt.show{opacity:1;transform:translateY(0)}
.btt:hover{background:var(--accent-hover)}
</style>
</head>
<body>

<!-- ── Modal ── -->
<div class="modal" id="modal">
  <button class="modal-close" id="modalClose" title="Close (Esc)">&times;</button>
  <button class="modal-nav modal-prev" id="modalPrev" title="Previous (←)">‹</button>
  <button class="modal-nav modal-next" id="modalNext" title="Next (→)">›</button>
  <div class="modal-wrap">
    <img id="modalImg" src="" alt="">
    <div class="modal-info">
      <h3 id="modalTitle"></h3>
      <p id="modalCaption"></p>
      <p id="modalTip" style="color:#fcd34d;font-style:italic"></p>
      <div class="modal-counter" id="modalCounter"></div>
    </div>
  </div>
</div>

<!-- ── Header ── -->
<div class="header">
  <div class="header-row">
    <select id="fExam" aria-label="Filter by exam">
      <option value="all">All Exams</option>
      <option value="AIF-C01">AIF-C01</option>
      <option value="SAA-C03">SAA-C03</option>
    </select>
    <select id="fChapter" aria-label="Filter by chapter"></select>
    <select id="fSource" aria-label="Filter by source">
      <option value="all">All Sources</option>
      <option value="1">Study Guide (1)</option>
      <option value="1b">Exam Focus (1b)</option>
      <option value="2">SAA Guide (2)</option>
    </select>
    <div class="search-wrap">
      <input type="text" id="fSearch" placeholder="Search title, caption, chapter…" aria-label="Search">
      <button class="search-clear" id="searchClear" title="Clear search">&times;</button>
    </div>
    <button class="sort-btn active" id="sortBtn" title="Toggle sort mode">By Chapter ▲</button>
    <div class="grid-btns" title="Grid size">
      <button class="grid-btn" data-size="small" title="Small thumbnails">▪</button>
      <button class="grid-btn active" data-size="medium" title="Medium thumbnails">▪▪</button>
      <button class="grid-btn" data-size="large" title="Large thumbnails">▪▪▪</button>
    </div>
    <div class="font-ctrl" title="Adjust font size">
     <span style="font-size:.6rem">A</span>
     <input type="range" class="font-slider" id="fontSlider" min="11" max="18" step="1" value="14">
     <span style="font-size:.85rem">A</span>
    </div>
    <button class="icon-btn" id="themeToggle" title="Toggle dark mode">🌙</button>
    <span class="count" id="countLabel">0 images</span>
  </div>
  <div class="stats-bar" id="statsBar"></div>
</div>

<!-- ── Grid ── -->
<div class="grid" id="grid"></div>
<div class="no-results" id="noResults" style="display:none">
  <h2>No matching images</h2>
  <p>Try adjusting your filters or search query.</p>
</div>
<div class="loading" id="loadingIndicator" style="display:none">Loading more…</div>
<div class="sentinel" id="sentinel"></div>
<button class="btt" id="bttBtn" title="Back to top">↑</button>

<script>
// ══════════════════════════════════════════════════════
// DATA (embedded at build time)
// ══════════════════════════════════════════════════════
const IMAGES = __IMAGES_JSON__;

let bookmarks = JSON.parse(localStorage.getItem('aws_img_bookmarks') || '[]');
let filtered = [];
let rendered = 0;
const BATCH = 20;
let sortByChapter = true;
let showBookmarked = false;
let observer;
let modalIndex = -1;

const $grid      = document.getElementById('grid');
const $noRes     = document.getElementById('noResults');
const $loading   = document.getElementById('loadingIndicator');
const $sentinel  = document.getElementById('sentinel');
const $count     = document.getElementById('countLabel');
const $fExam     = document.getElementById('fExam');
const $fChapter  = document.getElementById('fChapter');
const $fSource   = document.getElementById('fSource');
const $fSearch   = document.getElementById('fSearch');
const $searchClr = document.getElementById('searchClear');
const $sortBtn   = document.getElementById('sortBtn');
const $statsBar  = document.getElementById('statsBar');
const $bttBtn    = document.getElementById('bttBtn');
const $fontSlider = document.getElementById('fontSlider');
const $themeToggle = document.getElementById('themeToggle');
const $modal     = document.getElementById('modal');
const $modalImg  = document.getElementById('modalImg');
const $modalTitle = document.getElementById('modalTitle');
const $modalCaption = document.getElementById('modalCaption');
const $modalTip  = document.getElementById('modalTip');
const $modalCounter = document.getElementById('modalCounter');

// ── Font size ──
(function initFontSize() {
  const saved = localStorage.getItem('aws_img_fontsize');
  if (saved) { $fontSlider.value = saved; document.documentElement.style.setProperty('--font-size', saved + 'px'); }
  $fontSlider.addEventListener('input', function() {
    document.documentElement.style.setProperty('--font-size', this.value + 'px');
    localStorage.setItem('aws_img_fontsize', this.value);
  });
})();

// ── Dark mode ──
(function initTheme() {
  const saved = localStorage.getItem('aws_img_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  $themeToggle.textContent = saved === 'dark' ? '☀️' : '🌙';
  $themeToggle.addEventListener('click', function() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('aws_img_theme', next);
    this.textContent = next === 'dark' ? '☀️' : '🌙';
  });
})();

// ── Grid size ──
(function initGridSize() {
  const sizes = { small: '200px', medium: '320px', large: '480px' };
  const saved = localStorage.getItem('aws_img_gridsize') || 'medium';
  document.documentElement.style.setProperty('--grid-min', sizes[saved] || '320px');
  document.querySelectorAll('.grid-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.size === saved);
    b.addEventListener('click', function() {
      document.querySelectorAll('.grid-btn').forEach(x => x.classList.remove('active'));
      this.classList.add('active');
      const s = this.dataset.size;
      document.documentElement.style.setProperty('--grid-min', sizes[s]);
      localStorage.setItem('aws_img_gridsize', s);
    });
  });
})();

// ── Bookmarks ──
function isBookmarked(id) { return bookmarks.includes(id); }
function toggleBookmark(id) {
  const i = bookmarks.indexOf(id);
  if (i >= 0) bookmarks.splice(i, 1); else bookmarks.push(id);
  localStorage.setItem('aws_img_bookmarks', JSON.stringify(bookmarks));
}

// ══════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════
(function init() {
  populateChapters();
  buildStats();
  applyFilters();
  setupIO();
  setupListeners();
})();

function populateChapters() {
  const chapters = [];
  const seen = new Set();
  IMAGES.forEach(e => {
    const key = (e.exam || '') + '|' + (e.chapter || '');
    if (!seen.has(key) && e.chapter) {
      seen.add(key);
      chapters.push({ exam: e.exam, ch: e.chapterNumber || 99, title: e.chapter });
    }
  });
  chapters.sort((a, b) => a.exam.localeCompare(b.exam) || a.ch - b.ch);
  $fChapter.innerHTML = '<option value="all">All Chapters (' + chapters.length + ')</option>';
  chapters.forEach(c => {
    const o = document.createElement('option');
    o.value = c.exam + '|' + c.title;
    o.textContent = c.exam.replace('AIF-C01','AIF').replace('SAA-C03','SAA') + ' Ch' + c.ch + ': ' + c.title.substring(0, 40) + (c.title.length > 40 ? '…' : '');
    $fChapter.appendChild(o);
  });
}

function buildStats() {
  const total = IMAGES.length;
  const exams = {};
  IMAGES.forEach(e => { exams[e.exam] = (exams[e.exam] || 0) + 1; });
  const withTips = IMAGES.filter(e => e.examFocusTip).length;
  let html = '<span class="chip">' + total + ' total images</span>';
  Object.keys(exams).sort().forEach(x => { html += '<span class="chip">' + x + ': ' + exams[x] + '</span>'; });
  if (withTips) html += '<span class="chip">💡 ' + withTips + ' with exam tips</span>';
  if (bookmarks.length) html += '<span class="chip chip-bm' + (showBookmarked ? ' active' : '') + '" id="bmChip" title="Click to filter bookmarked">★ ' + bookmarks.length + ' bookmarked</span>';
  $statsBar.innerHTML = html;
}

// ══════════════════════════════════════════════════════
// FILTERING & SORTING
// ══════════════════════════════════════════════════════
function applyFilters() {
  const exam    = $fExam.value;
  const chapter = $fChapter.value;
  const source  = $fSource.value;
  const search  = $fSearch.value.toLowerCase().trim();

  $searchClr.classList.toggle('show', search.length > 0);

  let list = IMAGES;
  if (showBookmarked) list = list.filter(e => isBookmarked(e.id));
  if (exam !== 'all')    list = list.filter(e => e.exam === exam);
  if (chapter !== 'all') {
    const [cExam, cTitle] = chapter.split('|');
    list = list.filter(e => e.exam === cExam && e.chapter === cTitle);
  }
  if (source !== 'all')  list = list.filter(e => e.source === source);
  if (search) {
    const terms = search.split(/\s+/);
    list = list.filter(e => {
      const hay = (e.title + ' ' + e.caption + ' ' + (e.examFocusTip || '') + ' ' + (e.alt || '') + ' ' + (e.chapter || '')).toLowerCase();
      return terms.every(t => hay.includes(t));
    });
  }

  if (sortByChapter) {
    list = [...list].sort((a, b) => {
      const ea = a.exam === 'AIF-C01' ? 0 : 1;
      const eb = b.exam === 'AIF-C01' ? 0 : 1;
      if (ea !== eb) return ea - eb;
      const ca = a.chapterNumber || 99;
      const cb = b.chapterNumber || 99;
      if (ca !== cb) return ca - cb;
      const pa = a.page || 999;
      const pb = b.page || 999;
      return pa - pb || a.title.localeCompare(b.title);
    });
  } else {
    list = [...list].sort((a, b) => (a.page || 999) - (b.page || 999) || a.title.localeCompare(b.title));
  }

  filtered = list;
  rendered = 0;
  $grid.innerHTML = '';
  $noRes.style.display = list.length === 0 ? '' : 'none';
  $count.textContent = list.length + ' images';
  buildStats();
  renderBatch();
}

// ══════════════════════════════════════════════════════
// RENDERING
// ══════════════════════════════════════════════════════
function escHtml(s) {
  return s ? s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : '';
}

function examBadge(exam) {
  const cls = exam === 'AIF-C01' ? 'tag-aif' : 'tag-saa';
  return '<span class="tag ' + cls + '">' + exam + '</span>';
}

function sourceBadge(src) {
  const labels = { '1': 'Study Guide', '1b': 'Exam Focus', '2': 'SAA Guide' };
  return '<span class="tag tag-src">' + (labels[src] || src) + '</span>';
}

function renderCard(entry, globalIdx) {
  const eClass = entry.exam === 'AIF-C01' ? 'exam-aif' : 'exam-saa';
  const bmCls  = isBookmarked(entry.id) ? ' bookmarked' : '';
  const bmActive = isBookmarked(entry.id) ? ' active' : '';

  let tipHtml = '';
  if (entry.examFocusTip) {
    tipHtml = '<div class="exam-tip show">💡 ' + escHtml(entry.examFocusTip) + '</div>';
  }

  const pageText = entry.page ? 'Page ' + entry.page : '';
  const figText = entry.figureNumber ? 'Fig ' + entry.figureNumber : '';
  const metaParts = [figText, pageText].filter(Boolean).join(' · ');

  const div = document.createElement('div');
  div.className = 'card ' + eClass + bmCls;
  div.innerHTML =
    '<button class="bm-btn' + bmActive + '" data-bm="' + escHtml(entry.id) + '" title="Bookmark">' + (isBookmarked(entry.id) ? '★' : '☆') + '</button>' +
    '<div class="card-thumb" data-idx="' + globalIdx + '">' +
      '<img src="' + escHtml(entry.imagePath) + '" alt="' + escHtml(entry.alt || entry.title) + '" loading="lazy">' +
      '<span class="enlarge-hint">Click to enlarge</span>' +
    '</div>' +
    '<div class="card-body">' +
      '<div class="card-title">' + escHtml(entry.title) + '</div>' +
      '<div class="card-tags">' +
        examBadge(entry.exam) + ' ' +
        (entry.chapter ? '<span class="tag-ch">' + escHtml(entry.chapter) + '</span> ' : '') +
        sourceBadge(entry.source) +
      '</div>' +
      '<div class="card-desc" id="desc-' + globalIdx + '">' + escHtml(entry.caption) + '</div>' +
      tipHtml +
      '<div class="card-footer">' +
        '<span class="card-page">' + metaParts + '</span>' +
        '<button class="expand-btn" data-desc="desc-' + globalIdx + '">more ▾</button>' +
      '</div>' +
    '</div>';

  return div;
}

function renderBatch() {
  if (rendered >= filtered.length) {
    $loading.style.display = 'none';
    return;
  }
  const end = Math.min(rendered + BATCH, filtered.length);
  const frag = document.createDocumentFragment();
  for (let i = rendered; i < end; i++) {
    frag.appendChild(renderCard(filtered[i], i));
  }
  $grid.appendChild(frag);
  rendered = end;
  $loading.style.display = rendered < filtered.length ? '' : 'none';
}

// ══════════════════════════════════════════════════════
// INTERSECTION OBSERVER
// ══════════════════════════════════════════════════════
function setupIO() {
  observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && rendered < filtered.length) {
      renderBatch();
    }
  }, { rootMargin: '400px' });
  observer.observe($sentinel);
}

// ══════════════════════════════════════════════════════
// MODAL / LIGHTBOX
// ══════════════════════════════════════════════════════
function openModal(idx) {
  if (idx < 0 || idx >= filtered.length) return;
  modalIndex = idx;
  const entry = filtered[idx];
  $modalImg.src = entry.imagePath;
  $modalImg.alt = entry.alt || entry.title;
  $modalTitle.textContent = entry.title;
  $modalCaption.textContent = entry.caption;
  $modalTip.textContent = entry.examFocusTip || '';
  $modalTip.style.display = entry.examFocusTip ? '' : 'none';
  $modalCounter.textContent = (idx + 1) + ' of ' + filtered.length;
  $modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  $modal.classList.remove('active');
  document.body.style.overflow = '';
  modalIndex = -1;
}

function modalNav(dir) {
  if (modalIndex < 0) return;
  let next = modalIndex + dir;
  if (next < 0) next = filtered.length - 1;
  if (next >= filtered.length) next = 0;
  openModal(next);
}

// ══════════════════════════════════════════════════════
// EVENT LISTENERS
// ══════════════════════════════════════════════════════
function setupListeners() {
  $fExam.addEventListener('change', applyFilters);
  $fChapter.addEventListener('change', applyFilters);
  $fSource.addEventListener('change', applyFilters);

  let debounce;
  $fSearch.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(applyFilters, 200);
  });
  $searchClr.addEventListener('click', () => {
    $fSearch.value = '';
    applyFilters();
    $fSearch.focus();
  });

  $sortBtn.addEventListener('click', () => {
    sortByChapter = !sortByChapter;
    $sortBtn.textContent = sortByChapter ? 'By Chapter ▲' : 'By Page ▲';
    $sortBtn.classList.toggle('active', sortByChapter);
    applyFilters();
  });

  // Delegated clicks on grid
  $grid.addEventListener('click', e => {
    // Bookmark
    const bmBtn = e.target.closest('.bm-btn');
    if (bmBtn) {
      const id = bmBtn.dataset.bm;
      toggleBookmark(id);
      const active = isBookmarked(id);
      bmBtn.classList.toggle('active', active);
      bmBtn.textContent = active ? '★' : '☆';
      bmBtn.closest('.card').classList.toggle('bookmarked', active);
      buildStats();
      return;
    }
    // Expand description
    const expBtn = e.target.closest('.expand-btn');
    if (expBtn) {
      const descEl = document.getElementById(expBtn.dataset.desc);
      if (descEl) {
        const isExpanded = descEl.classList.toggle('expanded');
        expBtn.textContent = isExpanded ? 'less ▴' : 'more ▾';
      }
      return;
    }
    // Thumbnail click → open modal
    const thumb = e.target.closest('.card-thumb');
    if (thumb) {
      const idx = parseInt(thumb.dataset.idx, 10);
      if (!isNaN(idx)) openModal(idx);
      return;
    }
  });

  // Modal controls
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalPrev').addEventListener('click', () => modalNav(-1));
  document.getElementById('modalNext').addEventListener('click', () => modalNav(1));
  $modal.addEventListener('click', e => {
    if (e.target === $modal) closeModal();
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if ($modal.classList.contains('active')) {
      if (e.key === 'Escape') closeModal();
      else if (e.key === 'ArrowLeft') modalNav(-1);
      else if (e.key === 'ArrowRight') modalNav(1);
    } else {
      if (e.key === 'Escape' && document.activeElement === $fSearch) {
        $fSearch.value = '';
        applyFilters();
      }
    }
  });

  // Back to top
  window.addEventListener('scroll', () => {
    $bttBtn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  $bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Bookmark chip
  $statsBar.addEventListener('click', e => {
    const chip = e.target.closest('#bmChip');
    if (chip) {
      showBookmarked = !showBookmarked;
      applyFilters();
    }
  });
}
</script>
</body>
</html>"""

# Inject data
html_out = HTML.replace("__IMAGES_JSON__", compact)

with open(OUTPUT, "w", encoding="utf-8") as f:
    f.write(html_out)

print(f"Generated {OUTPUT}")
print(f"  {len(data)} image entries embedded")
print(f"  File size: {len(html_out):,} bytes")
