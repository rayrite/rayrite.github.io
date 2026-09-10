const timelineCanvas = document.getElementById('timeline');
const miniMapCanvas = document.getElementById('mini-map');
const miniWindow = document.getElementById('mini-window');
const centerReadout = document.getElementById('center-readout');
const scaleReadout = document.getElementById('scale-readout');

const timelineCtx = timelineCanvas.getContext('2d');
const miniCtx = miniMapCanvas.getContext('2d');

const ZOOM_BOUNDS = {
  minSecondsPerPixel: 0.001,
  maxSecondsPerPixel: 31_557_600,
};

const TICK_STEPS = [
  0.001,
  0.002,
  0.005,
  0.01,
  0.02,
  0.05,
  0.1,
  0.2,
  0.5,
  1,
  2,
  5,
  10,
  15,
  30,
  60,
  120,
  300,
  600,
  1_800,
  3_600,
  7_200,
  14_400,
  86_400,
  172_800,
  604_800,
  1_209_600,
  2_592_000,
  7_776_000,
  15_552_000,
  31_557_600,
  63_115_200,
  157_788_000,
  315_576_000,
  946_728_000,
  3_155_760_000,
];

const events = [];
const view = {
  centerMs: 0,
  secondsPerPixel: 86_400,
};

const state = {
  isDragging: false,
  dragStart: null,
  dragStartCenter: 0,
  globalStartSec: 0,
  globalEndSec: 0,
  needsRender: true,
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC',
  dateStyle: 'medium',
  timeStyle: 'medium',
});

async function init() {
  setupCanvasSizes();
  await loadData();
  attachEvents();
  requestAnimationFrame(renderLoop);
}

async function loadData() {
  const response = await fetch('data/events.json');
  if (!response.ok) {
    throw new Error(`Unable to load events.json: ${response.status}`);
  }
  const data = await response.json();
  data.forEach((item) => {
    const timeMs = Date.parse(item.timestamp);
    if (Number.isNaN(timeMs)) {
      return;
    }
    events.push({
      ...item,
      timeMs,
    });
  });

  if (!events.length) {
    throw new Error('No events loaded.');
  }

  events.sort((a, b) => a.timeMs - b.timeMs);
  const first = events[0];
  const last = events[events.length - 1];
  state.globalStartSec = first.timeMs / 1000;
  state.globalEndSec = last.timeMs / 1000;

  const span = Math.max(state.globalEndSec - state.globalStartSec, 1);
  const margin = span * 0.15 + 86_400;
  state.globalStartSec -= margin;
  state.globalEndSec += margin;

  view.centerMs = (first.timeMs + last.timeMs) / 2;
  const baseWidth = Math.max(timelineCanvas.clientWidth, 1);
  view.secondsPerPixel = clamp(
    span / baseWidth,
    ZOOM_BOUNDS.minSecondsPerPixel,
    ZOOM_BOUNDS.maxSecondsPerPixel
  );
  state.needsRender = true;
}

function setupCanvasSizes() {
  setCanvasSize(timelineCanvas, timelineCtx);
  setCanvasSize(miniMapCanvas, miniCtx);
  state.needsRender = true;
}

function setCanvasSize(canvas, context) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(rect.width, 1);
  const height = Math.max(rect.height, 1);
  const scaledWidth = Math.floor(width * dpr);
  const scaledHeight = Math.floor(height * dpr);

  if (canvas.width !== scaledWidth || canvas.height !== scaledHeight) {
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
  }

  if (typeof context.setTransform === 'function') {
    context.setTransform(1, 0, 0, 1, 0, 0);
  } else if (typeof context.resetTransform === 'function') {
    context.resetTransform();
  }

  context.scale(dpr, dpr);
}

function attachEvents() {
  window.addEventListener('resize', () => {
    setupCanvasSizes();
  });

  timelineCanvas.addEventListener('pointerdown', (event) => {
    timelineCanvas.setPointerCapture(event.pointerId);
    state.isDragging = true;
    state.dragStart = { x: event.clientX };
    state.dragStartCenter = view.centerMs;
    timelineCanvas.classList.add('dragging');
  });

  window.addEventListener('pointermove', (event) => {
    if (!state.isDragging) return;
    const deltaX = event.clientX - state.dragStart.x;
    const deltaSeconds = deltaX * view.secondsPerPixel;
    const newCenterSec = state.dragStartCenter / 1000 - deltaSeconds;
    setCenterSeconds(newCenterSec);
  });

  const releasePointer = (event) => {
    if (!state.isDragging) return;
    state.isDragging = false;
    state.dragStart = null;
    if (typeof timelineCanvas.releasePointerCapture === 'function' && event.pointerId !== undefined && timelineCanvas.hasPointerCapture?.(event.pointerId)) {
      timelineCanvas.releasePointerCapture(event.pointerId);
    }
    timelineCanvas.classList.remove('dragging');
  };

  window.addEventListener('pointerup', releasePointer);
  window.addEventListener('pointercancel', releasePointer);

  const wheelHandler = (event) => {
    event.preventDefault();
    const { offsetX } = event;
    const direction = Math.sign(event.deltaY);
    const zoomFactor = direction > 0 ? 1.15 : 0.85;
    const oldSecondsPerPixel = view.secondsPerPixel;
    const newSecondsPerPixel = clamp(
      oldSecondsPerPixel * zoomFactor,
      ZOOM_BOUNDS.minSecondsPerPixel,
      ZOOM_BOUNDS.maxSecondsPerPixel
    );
    if (newSecondsPerPixel === oldSecondsPerPixel) return;

    const viewStartSec = getViewStartSeconds();
    const focusTimeSec = viewStartSec + offsetX * oldSecondsPerPixel;
    view.secondsPerPixel = newSecondsPerPixel;
    const newViewStartSec = focusTimeSec - offsetX * newSecondsPerPixel;
    const canvasWidth = Math.max(timelineCanvas.clientWidth, 1);
    const newCenterSec = newViewStartSec + (canvasWidth * newSecondsPerPixel) / 2;
    setCenterSeconds(newCenterSec);
  };

  timelineCanvas.addEventListener('wheel', wheelHandler, { passive: false });

  miniMapCanvas.addEventListener('click', (event) => {
    const rect = miniMapCanvas.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const targetSec = state.globalStartSec + ratio * (state.globalEndSec - state.globalStartSec);
    setCenterSeconds(targetSec);
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getViewStartSeconds() {
  const width = Math.max(timelineCanvas.clientWidth, 1);
  return view.centerMs / 1000 - (width * view.secondsPerPixel) / 2;
}

function setCenterSeconds(seconds) {
  const clamped = clamp(seconds, state.globalStartSec, state.globalEndSec);
  view.centerMs = clamped * 1000;
  state.needsRender = true;
}

function renderLoop() {
  if (state.needsRender) {
    drawTimeline();
    drawMiniMap();
    updateReadouts();
    state.needsRender = false;
  }
  requestAnimationFrame(renderLoop);
}

function drawTimeline() {
  const width = Math.max(timelineCanvas.clientWidth, 1);
  const height = Math.max(timelineCanvas.clientHeight, 1);
  timelineCtx.clearRect(0, 0, width, height);

  const gradient = timelineCtx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
  gradient.addColorStop(1, 'rgba(235, 240, 255, 0.8)');
  timelineCtx.fillStyle = gradient;
  timelineCtx.fillRect(0, 0, width, height);

  drawTicks(width, height);
  drawEvents(width, height);
}

function drawTicks(width, height) {
  const secondsPerPixel = view.secondsPerPixel;
  const startSec = getViewStartSeconds();
  const tickStep = pickTickStep(secondsPerPixel);
  const endSec = startSec + width * secondsPerPixel;
  const firstTick = Math.floor(startSec / tickStep) * tickStep;

  timelineCtx.save();
  timelineCtx.strokeStyle = 'rgba(20, 33, 61, 0.35)';
  timelineCtx.fillStyle = 'rgba(20, 33, 61, 0.65)';
  timelineCtx.lineWidth = 1;
  timelineCtx.beginPath();

  const bottom = height - 60;
  for (let tick = firstTick; tick <= endSec; tick += tickStep) {
    const x = (tick - startSec) / secondsPerPixel;
    timelineCtx.moveTo(x, bottom);
    timelineCtx.lineTo(x, bottom + 12);
  }
  timelineCtx.stroke();

  timelineCtx.font = '12px Inter, sans-serif';
  timelineCtx.textAlign = 'center';
  timelineCtx.textBaseline = 'top';

  const labelBottom = bottom + 16;
  for (let tick = firstTick; tick <= endSec; tick += tickStep) {
    const x = (tick - startSec) / secondsPerPixel;
    const label = formatTickLabel(tick, tickStep);
    timelineCtx.fillText(label, x, labelBottom);
  }

  timelineCtx.restore();
}

function pickTickStep(secondsPerPixel) {
  const minPixels = 80;
  for (const step of TICK_STEPS) {
    if (step / secondsPerPixel >= minPixels) {
      return step;
    }
  }
  return TICK_STEPS[TICK_STEPS.length - 1];
}

function formatTickLabel(seconds, step) {
  const date = new Date(seconds * 1000);
  if (step < 1) {
    return date.toISOString().substring(11, 23);
  }
  if (step < 60) {
    return date.toISOString().substring(11, 19);
  }
  if (step < 86_400) {
    return date.toISOString().replace('T', ' ').substring(0, 16);
  }
  if (step < 31_557_600) {
    return date.toISOString().substring(0, 10);
  }
  if (step < 315_576_000) {
    return date.getUTCFullYear().toString();
  }
  return `${Math.floor(date.getUTCFullYear() / 100) * 100}`;
}

function drawEvents(width, height) {
  const secondsPerPixel = view.secondsPerPixel;
  const startSec = getViewStartSeconds();
  const endSec = startSec + width * secondsPerPixel;

  const baseY = height - 80;
  const labelOffset = 30;

  events.forEach((event, index) => {
    const eventSec = event.timeMs / 1000;
    if (eventSec < startSec - 10 * secondsPerPixel || eventSec > endSec + 10 * secondsPerPixel) {
      return;
    }

    const x = (eventSec - startSec) / secondsPerPixel;
    const isHighlighted = index === events.length - 1;

    timelineCtx.save();
    timelineCtx.strokeStyle = isHighlighted ? 'rgba(216, 75, 75, 0.85)' : 'rgba(47, 111, 237, 0.6)';
    timelineCtx.lineWidth = isHighlighted ? 3 : 2;
    timelineCtx.beginPath();
    timelineCtx.moveTo(x, 40);
    timelineCtx.lineTo(x, baseY);
    timelineCtx.stroke();

    timelineCtx.fillStyle = isHighlighted ? 'rgba(216, 75, 75, 0.95)' : 'rgba(47, 111, 237, 0.85)';
    timelineCtx.beginPath();
    timelineCtx.arc(x, baseY, isHighlighted ? 6 : 5, 0, Math.PI * 2);
    timelineCtx.fill();

    timelineCtx.font = '13px Inter, sans-serif';
    const text = event.label;
    const textWidth = timelineCtx.measureText(text).width;
    const padding = 8;
    const boxWidth = textWidth + padding * 2;
    const boxHeight = 24;
    const boxX = x - boxWidth / 2;
    const boxY = baseY - labelOffset - boxHeight;

    timelineCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    timelineCtx.strokeStyle = 'rgba(20, 33, 61, 0.15)';
    timelineCtx.lineWidth = 1;
    timelineCtx.beginPath();
    timelineCtx.roundRect(boxX, boxY, boxWidth, boxHeight, 6);
    timelineCtx.fill();
    timelineCtx.stroke();

    timelineCtx.fillStyle = 'rgba(20, 33, 61, 0.9)';
    timelineCtx.textAlign = 'center';
    timelineCtx.textBaseline = 'middle';
    timelineCtx.fillText(text, x, boxY + boxHeight / 2);

    timelineCtx.restore();
  });
}

function drawMiniMap() {
  const width = Math.max(miniMapCanvas.clientWidth, 1);
  const height = Math.max(miniMapCanvas.clientHeight, 1);
  miniCtx.clearRect(0, 0, width, height);

  const spanSec = Math.max(state.globalEndSec - state.globalStartSec, 1);
  const startSec = state.globalStartSec;

  miniCtx.save();
  miniCtx.fillStyle = 'rgba(47, 111, 237, 0.08)';
  miniCtx.fillRect(0, 0, width, height);

  miniCtx.strokeStyle = 'rgba(47, 111, 237, 0.35)';
  miniCtx.fillStyle = 'rgba(47, 111, 237, 0.6)';
  miniCtx.lineWidth = 1;

  events.forEach((event) => {
    const eventSec = event.timeMs / 1000;
    const x = ((eventSec - startSec) / spanSec) * width;
    miniCtx.beginPath();
    miniCtx.moveTo(x, 12);
    miniCtx.lineTo(x, height - 12);
    miniCtx.stroke();
    miniCtx.beginPath();
    miniCtx.arc(x, height / 2, 3, 0, Math.PI * 2);
    miniCtx.fill();
  });

  miniCtx.restore();

  const viewStartSec = getViewStartSeconds();
  const canvasWidth = Math.max(timelineCanvas.clientWidth, 1);
  const viewSpanSec = canvasWidth * view.secondsPerPixel;

  const windowStart = (viewStartSec - startSec) / spanSec;
  const windowEnd = (viewStartSec + viewSpanSec - startSec) / spanSec;
  const boundedStart = clamp(windowStart, 0, 1);
  const boundedEnd = clamp(windowEnd, boundedStart, 1);

  const left = boundedStart * width;
  const windowWidth = Math.max((boundedEnd - boundedStart) * width, 8);

  miniWindow.style.left = `${left}px`;
  miniWindow.style.width = `${windowWidth}px`;
}

function updateReadouts() {
  const centerDate = new Date(view.centerMs);
  centerReadout.textContent = dateFormatter.format(centerDate);

  const spanSec = Math.max((timelineCanvas.clientWidth || 1) * view.secondsPerPixel, 0.0001);
  if (view.secondsPerPixel < 1) {
    scaleReadout.textContent = `${(view.secondsPerPixel * 1000).toFixed(3)} ms / px`;
  } else if (spanSec < 120) {
    scaleReadout.textContent = `${view.secondsPerPixel.toFixed(3)} s / px`;
  } else if (spanSec < 86_400) {
    scaleReadout.textContent = `${(view.secondsPerPixel / 60).toFixed(2)} min / px`;
  } else if (spanSec < 31_557_600) {
    scaleReadout.textContent = `${(view.secondsPerPixel / 3_600).toFixed(2)} h / px`;
  } else {
    scaleReadout.textContent = `${(view.secondsPerPixel / 31_557_600).toFixed(2)} yr / px`;
  }
}

if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    const radii = typeof radius === 'number' ? [radius, radius, radius, radius] : radius;
    const [tl, tr, br, bl] = radii;
    this.beginPath();
    this.moveTo(x + tl, y);
    this.lineTo(x + width - tr, y);
    this.quadraticCurveTo(x + width, y, x + width, y + tr);
    this.lineTo(x + width, y + height - br);
    this.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
    this.lineTo(x + bl, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - bl);
    this.lineTo(x, y + tl);
    this.quadraticCurveTo(x, y, x + tl, y);
    this.closePath();
  };
}

init().catch((error) => {
  console.error(error);
  centerReadout.textContent = 'Failed to load timeline';
  scaleReadout.textContent = '';
});
