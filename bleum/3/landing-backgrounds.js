/* ============================================================================
   DUKR ChronoSync — background presets (window.CSBG)
   Load AFTER landing-config.js and landing-core.js.

   Which presets may be chosen, and whether the pick is random, is set in
   landing-config.js  ->  background { mode, avoidRepeat, showLabel, presets }.

   Each preset has:
     label  name shown in the optional tag
     vars   CSS custom properties applied to <html> (colours for text, core, pills)
     make   (view) -> frame(ctx, dt, t, view, orbit)   // canvas animation
   ============================================================================ */
(function () {
  'use strict';
  var C = window.CHRONOSYNC, CS = window.CS, TAU = Math.PI * 2, P = {};

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function mix(a, b, t) { return Math.round(a + (b - a) * t); }
  function orbitBox() {
    var el = document.querySelector('.orbit');
    if (!el) return { x: innerWidth / 2, y: innerHeight / 2, r: Math.min(innerWidth, innerHeight) / 3 };
    var b = el.getBoundingClientRect();
    return { x: b.left + b.width / 2, y: b.top + b.height / 2, r: b.width / 2 };
  }
  /* shared theme tokens: [bgA, bgB, ink, mute, titleA, titleB, coreA, coreB, coreC, coreInk, pillBg, pillBd, path, halo, focus, panelBg, onAccent] */
  function T(a) {
    return {
      '--bg-a': a[0], '--bg-b': a[1], '--ink': a[2], '--mute': a[3], '--title-a': a[4], '--title-b': a[5],
      '--core-a': a[6], '--core-b': a[7], '--core-c': a[8], '--core-ink': a[9], '--pill-bg': a[10], '--pill-bd': a[11],
      '--path': a[12], '--halo': a[13], '--focus': a[14],
      '--cs-panel-bg': a[15], '--cs-panel-fg': a[2], '--cs-on-accent': a[16]
    };
  }

  /* 1. Starfield: drifting stars and the odd shooting star (the original Orbit) */
  P.starfield = {
    label: 'Starfield',
    vars: T(['#0d1540', '#070b1f', '#eaf0ff', '#9fb0dd', '#ffffff', '#c9d6ff', '#fff6cf', '#f5c451', '#b9801b', '#4a3000',
      'rgba(7,11,31,.7)', 'rgba(159,176,221,.22)', 'rgba(159,176,221,.28)', 'rgba(7,11,31,.7)', '#f5c451', '#10173a', '#14110a']),
    make: function (v) {
      var stars = [], shoot = null, i;
      for (i = 0; i < Math.round(v.w * v.h / 5200); i++) stars.push({ x: rnd(0, v.w), y: rnd(0, v.h), z: rnd(.1, 1), p: rnd(0, 6.28) });
      return function (c, dt, t) {
        stars.forEach(function (s) {
          s.x -= dt * 9 * s.z; s.y += dt * 3 * s.z; if (s.x < -2) s.x = v.w + 2; if (s.y > v.h + 2) s.y = -2;
          c.globalAlpha = (.25 + .6 * s.z) * (.55 + .45 * Math.sin(t * 1.4 + s.p)); c.fillStyle = s.z > .8 ? '#ffe9a8' : '#cfe0ff';
          c.beginPath(); c.arc(s.x, s.y, s.z * 1.4 + .2, 0, TAU); c.fill();
        });
        if (!shoot && dt && Math.random() < dt * .08) shoot = { x: rnd(0, v.w), y: rnd(0, v.h * .4), l: 0 };
        if (shoot) {
          shoot.l += dt * 520; shoot.x -= dt * 380; shoot.y += dt * 190;
          var g = c.createLinearGradient(shoot.x, shoot.y, shoot.x + 90, shoot.y - 45);
          g.addColorStop(0, 'rgba(255,240,200,.9)'); g.addColorStop(1, 'rgba(255,240,200,0)');
          c.globalAlpha = 1; c.strokeStyle = g; c.lineWidth = 1.6; c.beginPath(); c.moveTo(shoot.x, shoot.y); c.lineTo(shoot.x + 90, shoot.y - 45); c.stroke();
          if (shoot.l > 900) shoot = null;
        }
        c.globalAlpha = 1;
      };
    }
  };

  /* 2. Film grain: flickering grain and warm light leaks */
  P['film-grain'] = {
    label: 'Film grain',
    vars: T(['#1d1713', '#14110f', '#f3e6cf', '#b9a98f', '#f3e6cf', '#ffb347', '#ffe3b0', '#ffb347', '#b3651a', '#3a2108',
      'rgba(10,8,7,.75)', 'rgba(243,230,207,.2)', 'rgba(243,230,207,.25)', 'rgba(20,17,15,.75)', '#ffb347', '#1d1813', '#1a1006']),
    make: function (v) {
      var gw = Math.max(120, Math.round(v.w / 3)), gh = Math.max(80, Math.round(v.h / 3)), g = document.createElement('canvas');
      g.width = gw; g.height = gh; var gx = g.getContext('2d'), id = gx.createImageData(gw, gh), acc = 1;
      function noise() { var d = id.data; for (var i = 0; i < d.length; i += 4) { d[i] = d[i + 1] = d[i + 2] = Math.random() < .5 ? 0 : 255; d[i + 3] = Math.random() * 34; } gx.putImageData(id, 0, 0); }
      noise();
      return function (c, dt, t) {
        var R = Math.max(v.w, v.h) * .5, x1 = v.w * (.1 + .14 * Math.sin(t * .09)), y1 = v.h * (.1 + .1 * Math.cos(t * .07));
        var x2 = v.w * (.9 + .1 * Math.cos(t * .08)), y2 = v.h * (.9 + .08 * Math.sin(t * .06)), a = c.createRadialGradient(x1, y1, 0, x1, y1, R), b = c.createRadialGradient(x2, y2, 0, x2, y2, R * .85);
        a.addColorStop(0, 'rgba(255,138,61,.3)'); a.addColorStop(1, 'rgba(255,138,61,0)'); b.addColorStop(0, 'rgba(255,77,106,.24)'); b.addColorStop(1, 'rgba(255,77,106,0)');
        c.fillStyle = a; c.fillRect(0, 0, v.w, v.h); c.fillStyle = b; c.fillRect(0, 0, v.w, v.h);
        acc += dt; if (acc > .09) { acc = 0; noise(); }
        c.drawImage(g, 0, 0, v.w, v.h);
      };
    }
  };

  /* 3. Ocean swell: layered rolling waves */
  P['ocean-swell'] = {
    label: 'Ocean swell',
    vars: T(['#07404b', '#04222b', '#e8fffb', '#bff3ea', '#ffffff', '#bff3ea', '#fff3cf', '#ffd98a', '#d99a3a', '#5a3c05',
      'rgba(3,35,42,.7)', 'rgba(191,243,234,.28)', 'rgba(191,243,234,.3)', 'rgba(4,34,43,.7)', '#ffd98a', '#082f38', '#03232a']),
    make: function (v) {
      var ph = 0, L = [
        { y: .70, amp: 16, len: 330, sp: .55, c0: 'rgba(191,243,234,.10)', c1: 'rgba(191,243,234,.02)' },
        { y: .76, amp: 22, len: 440, sp: -.38, c0: 'rgba(120,225,214,.16)', c1: 'rgba(120,225,214,.03)' },
        { y: .83, amp: 26, len: 560, sp: .27, c0: 'rgba(60,190,190,.22)', c1: 'rgba(10,90,102,.1)' },
        { y: .91, amp: 20, len: 380, sp: -.5, c0: 'rgba(4,34,43,.5)', c1: 'rgba(4,34,43,.8)' }];
      return function (c, dt) {
        ph += dt;
        L.forEach(function (l, k) {
          var base = v.h * l.y, g = c.createLinearGradient(0, base - l.amp, 0, v.h);
          g.addColorStop(0, l.c0); g.addColorStop(1, l.c1); c.fillStyle = g; c.beginPath(); c.moveTo(0, v.h);
          for (var x = 0; x <= v.w + 8; x += 8) c.lineTo(x, base + Math.sin(x / l.len * TAU + ph * l.sp * 2) * l.amp + Math.sin(x / (l.len * .43) + ph * l.sp * 3.1 + k) * l.amp * .35);
          c.lineTo(v.w, v.h); c.closePath(); c.fill();
        });
      };
    }
  };

  /* 4. Aurora: slow drifting colour clouds */
  P.aurora = {
    label: 'Aurora',
    vars: T(['#14102e', '#0b0a1a', '#f4f1ff', '#b8b0e0', '#ffffff', '#a7f3d0', '#e9ddff', '#8b5cf6', '#4c2a9e', '#ffffff',
      'rgba(11,10,26,.65)', 'rgba(200,190,255,.25)', 'rgba(200,190,255,.28)', 'rgba(11,10,26,.7)', '#34d399', '#181234', '#0b0a1a']),
    make: function (v) {
      var B = [['139,92,246', .5, .2, .09, .07, 0], ['52,211,153', .8, .3, .07, .1, 2], ['244,114,182', .45, .85, .08, .06, 4], ['56,189,248', .85, .78, .06, .09, 1]];
      return function (c, dt, t) {
        var R = Math.max(v.w, v.h) * .5; c.globalCompositeOperation = 'screen';
        B.forEach(function (b) {
          var x = v.w * (b[1] + .16 * Math.sin(t * b[3] + b[5])), y = v.h * (b[2] + .14 * Math.cos(t * b[4] + b[5])), g = c.createRadialGradient(x, y, 0, x, y, R);
          g.addColorStop(0, 'rgba(' + b[0] + ',.42)'); g.addColorStop(1, 'rgba(' + b[0] + ',0)'); c.fillStyle = g; c.fillRect(0, 0, v.w, v.h);
        });
        c.globalCompositeOperation = 'source-over';
      };
    }
  };

  /* 5. Brass rings: concentric dashed rings turning around the orbit */
  P['brass-rings'] = {
    label: 'Brass rings',
    vars: T(['#10224a', '#0a1730', '#f6efdc', '#a9b4cf', '#ecd08a', '#c9a24b', '#fff0c0', '#c9a24b', '#7a5d20', '#2b1d04',
      'rgba(10,23,48,.75)', 'rgba(201,162,75,.3)', 'rgba(201,162,75,.35)', 'rgba(10,23,48,.7)', '#ecd08a', '#0f2046', '#1a1204']),
    make: function () {
      var ph = 0;
      return function (c, dt, t, v, o) {
        ph += dt;
        for (var k = 0; k < 6; k++) {
          var r = o.r * (1.12 + k * .2), dir = k % 2 ? -1 : 1;
          c.save(); c.translate(o.x, o.y); c.rotate(ph * dir * (.05 + k * .012));
          c.strokeStyle = 'rgba(201,162,75,' + (.24 - k * .028) + ')'; c.lineWidth = k % 2 ? 1 : 2;
          c.setLineDash(k % 2 ? [2, 14] : [38, 10 + k * 5]); c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke(); c.restore();
        }
      };
    }
  };

  /* 6. Time stream: glowing particles flowing down a central line */
  P['time-stream'] = {
    label: 'Time stream',
    vars: T(['#0f1a30', '#0b1220', '#e2e8f0', '#8a9bb5', '#eab308', '#ec4899', '#fff1b0', '#eab308', '#a16a00', '#3b2800',
      'rgba(15,23,42,.8)', 'rgba(226,232,240,.18)', 'rgba(236,72,153,.28)', 'rgba(11,18,32,.75)', '#eab308', '#0f172a', '#1a1300']),
    make: function (v) {
      var P2 = [], i; for (i = 0; i < 80; i++) P2.push({ f: Math.random(), o: rnd(-14, 14), v: rnd(.03, .12), r: rnd(.8, 2.6) });
      return function (c, dt) {
        var x = v.w / 2, g = c.createLinearGradient(0, 0, 0, v.h);
        g.addColorStop(0, 'rgba(234,179,8,.35)'); g.addColorStop(1, 'rgba(236,72,153,.35)'); c.fillStyle = g; c.fillRect(x - 1.5, 0, 3, v.h);
        c.globalCompositeOperation = 'lighter';
        P2.forEach(function (p) {
          p.f += dt * p.v; if (p.f > 1) { p.f = 0; p.o = rnd(-14, 14); }
          var y = p.f * v.h, R = mix(234, 236, p.f), G = mix(179, 72, p.f), B = mix(8, 153, p.f), gr = c.createRadialGradient(x + p.o, y, 0, x + p.o, y, p.r * 6);
          gr.addColorStop(0, 'rgba(' + R + ',' + G + ',' + B + ',.8)'); gr.addColorStop(1, 'rgba(' + R + ',' + G + ',' + B + ',0)');
          c.fillStyle = gr; c.beginPath(); c.arc(x + p.o, y, p.r * 6, 0, TAU); c.fill();
        });
        c.globalCompositeOperation = 'source-over';
      };
    }
  };

  /* 7. Constellation: twinkling star-map with faint linking lines */
  P.constellation = {
    label: 'Constellation',
    vars: T(['#0d1730', '#060a13', '#eef2fb', '#aab6cf', '#ffffff', '#17e8d8', '#c8fff9', '#17e8d8', '#0a8a82', '#032b28',
      'rgba(6,10,19,.75)', 'rgba(238,242,251,.18)', 'rgba(23,232,216,.28)', 'rgba(6,10,19,.7)', '#17e8d8', '#0c1426', '#03201d']),
    make: function (v) {
      var S = [], links = [], i, j;
      for (i = 0; i < Math.round(v.w * v.h / 7500); i++) S.push({ x: rnd(0, v.w), y: rnd(0, v.h), r: rnd(.3, 1.6), p: rnd(0, 6.28), s: rnd(.6, 2.2) });
      for (i = 0; i < S.length; i += 2) for (j = i + 2; j < S.length; j += 2) { var dx = S[i].x - S[j].x, dy = S[i].y - S[j].y; if (dx * dx + dy * dy < 9000) links.push([S[i], S[j]]); }
      return function (c, dt, t) {
        c.globalAlpha = .12; c.strokeStyle = '#8fe8ff'; c.lineWidth = .7; c.beginPath();
        links.forEach(function (l) { c.moveTo(l[0].x, l[0].y); c.lineTo(l[1].x, l[1].y); }); c.stroke();
        c.fillStyle = '#dff6ff';
        S.forEach(function (s) { c.globalAlpha = .25 + .6 * (.5 + .5 * Math.sin(t * s.s + s.p)); c.beginPath(); c.arc(s.x, s.y, s.r, 0, TAU); c.fill(); });
        c.globalAlpha = 1;
      };
    }
  };

  /* 8. Deep glow: rising bioluminescent motes */
  P['deep-glow'] = {
    label: 'Deep glow',
    vars: T(['#03222c', '#01070d', '#dffbff', '#8fc5d1', '#eaffff', '#22e6ff', '#d6fbff', '#22e6ff', '#0b7f95', '#00303a',
      'rgba(1,7,13,.75)', 'rgba(34,230,255,.3)', 'rgba(34,230,255,.28)', 'rgba(1,7,13,.7)', '#ff4fd8', '#05232d', '#00222a']),
    make: function (v) {
      var hues = [186, 300, 170, 210], M = [], i;
      function make(init) { return { x: rnd(0, v.w), y: init ? rnd(0, v.h) : v.h + 20, r: rnd(1, 4.2), v: rnd(8, 34), w: rnd(0, 6.28), a: rnd(20, 60), h: hues[(Math.random() * hues.length) | 0], t: rnd(0, 6.28) }; }
      for (i = 0; i < Math.round(v.w * v.h / 15000); i++) M.push(make(true));
      return function (c, dt, t) {
        c.globalCompositeOperation = 'lighter';
        M.forEach(function (m, i) {
          m.y -= m.v * dt; m.w += dt * .6; var x = m.x + Math.sin(m.w) * m.a; if (m.y < -20) M[i] = make(false);
          var tw = .5 + .5 * Math.sin(t * 1.6 + m.t), R = m.r * 7, g = c.createRadialGradient(x, m.y, 0, x, m.y, R);
          g.addColorStop(0, 'hsla(' + m.h + ',100%,70%,' + (.5 * tw + .15) + ')'); g.addColorStop(1, 'hsla(' + m.h + ',100%,60%,0)');
          c.fillStyle = g; c.beginPath(); c.arc(x, m.y, R, 0, TAU); c.fill();
        });
        c.globalCompositeOperation = 'source-over';
      };
    }
  };

  /* 9. Pastel shapes (light theme): confetti-like shapes drifting up */
  P['pastel-shapes'] = {
    label: 'Pastel shapes',
    vars: T(['#fff9dc', '#fff3c4', '#2b1d3a', '#5b4770', '#2b1d3a', '#ff6b57', '#ffd2c9', '#ff6b57', '#c7402e', '#2b1d3a',
      'rgba(255,255,255,.88)', 'rgba(43,29,58,.25)', 'rgba(43,29,58,.25)', 'rgba(255,249,220,.9)', '#2b1d3a', '#fffdf2', '#2b1d3a']),
    make: function (v) {
      var cols = ['#ff6b57', '#4cc9f0', '#7bd88f', '#ffffff', '#ffb3a7', '#b5e8fa'], S = [], i;
      for (i = 0; i < Math.round(v.w * v.h / 26000) + 8; i++) S.push({ x: rnd(0, v.w), y: rnd(0, v.h), k: i % 5, r: rnd(12, 42), a: rnd(0, 6.28), va: rnd(-.25, .25), vx: rnd(6, 20), vy: rnd(-12, -4), c: cols[i % cols.length] });
      return function (c, dt) {
        c.globalAlpha = .5; c.lineCap = 'round';
        S.forEach(function (s) {
          s.x += s.vx * dt; s.y += s.vy * dt; s.a += s.va * dt; if (s.x > v.w + 50) s.x = -50; if (s.y < -50) s.y = v.h + 50;
          c.save(); c.translate(s.x, s.y); c.rotate(s.a); c.fillStyle = s.c; c.strokeStyle = s.c; c.lineWidth = 6; c.beginPath();
          if (s.k === 0) { c.arc(0, 0, s.r, 0, TAU); c.fill(); }
          else if (s.k === 1) { c.moveTo(-s.r, 0); c.lineTo(s.r, 0); c.moveTo(0, -s.r); c.lineTo(0, s.r); c.stroke(); }
          else if (s.k === 2) { c.moveTo(0, -s.r); c.lineTo(s.r, s.r * .8); c.lineTo(-s.r, s.r * .8); c.closePath(); c.fill(); }
          else if (s.k === 3) { c.arc(0, 0, s.r, 0, TAU); c.stroke(); }
          else { for (var j = 0; j < 5; j++) { var a = j * 1.2566 - 1.5708; c.lineTo(Math.cos(a) * s.r, Math.sin(a) * s.r); a += .6283; c.lineTo(Math.cos(a) * s.r * .45, Math.sin(a) * s.r * .45); } c.closePath(); c.fill(); }
          c.restore();
        });
        c.globalAlpha = 1;
      };
    }
  };

  /* 10. Radar: sweeping beam with fading blips */
  P.radar = {
    label: 'Radar',
    vars: T(['#0e1812', '#0a0f0c', '#d6f7e3', '#7fae94', '#ffffff', '#5dfc9a', '#d2ffe3', '#5dfc9a', '#1f7a47', '#03160b',
      'rgba(10,15,12,.8)', 'rgba(93,252,154,.28)', 'rgba(93,252,154,.25)', 'rgba(10,15,12,.75)', '#ffb000', '#0c1711', '#04140a']),
    make: function () {
      var ang = 0, blips = [], i; for (i = 0; i < 9; i++) blips.push({ a: rnd(0, 6.28), r: rnd(.15, .95) });
      return function (c, dt, t, v, o) {
        ang += dt * .55; var R = Math.max(v.w, v.h) * .62;
        c.strokeStyle = 'rgba(93,252,154,.1)'; c.lineWidth = 1;
        for (var k = 1; k <= 5; k++) { c.beginPath(); c.arc(o.x, o.y, R * k / 5, 0, TAU); c.stroke(); }
        c.beginPath(); c.moveTo(o.x - R, o.y); c.lineTo(o.x + R, o.y); c.moveTo(o.x, o.y - R); c.lineTo(o.x, o.y + R); c.stroke();
        if (c.createConicGradient) {
          var g = c.createConicGradient(ang - 1.1, o.x, o.y);
          g.addColorStop(0, 'rgba(93,252,154,0)'); g.addColorStop(.17, 'rgba(93,252,154,.16)'); g.addColorStop(.1751, 'rgba(93,252,154,0)'); g.addColorStop(1, 'rgba(93,252,154,0)');
          c.fillStyle = g; c.beginPath(); c.arc(o.x, o.y, R, 0, TAU); c.fill();
        }
        c.strokeStyle = 'rgba(93,252,154,.4)'; c.beginPath(); c.moveTo(o.x, o.y); c.lineTo(o.x + Math.cos(ang) * R, o.y + Math.sin(ang) * R); c.stroke();
        blips.forEach(function (b) {
          var d = (ang - b.a) % TAU; if (d < 0) d += TAU; var al = Math.max(0, 1 - d / 3.4) * .8;
          if (al > .02) { c.fillStyle = 'rgba(255,176,0,' + al + ')'; c.beginPath(); c.arc(o.x + Math.cos(b.a) * b.r * R, o.y + Math.sin(b.a) * b.r * R, 3, 0, TAU); c.fill(); }
        });
      };
    }
  };

  /* 11. Bokeh: soft out-of-focus lights drifting upward */
  P.bokeh = {
    label: 'Bokeh',
    vars: T(['#5b3a6b', '#2b1f3a', '#fbf6ea', '#ffd3b0', '#fbf6ea', '#ffd3b0', '#fff0d8', '#ffd3b0', '#e58fa0', '#3a2a3f',
      'rgba(43,31,58,.7)', 'rgba(251,246,234,.25)', 'rgba(251,246,234,.28)', 'rgba(43,31,58,.7)', '#ffd3b0', '#2f2140', '#3a2a3f']),
    make: function (v) {
      var cols = ['255,211,176', '229,143,160', '255,240,210', '190,150,230'], B = [], i;
      for (i = 0; i < 26; i++) B.push({ x: rnd(0, v.w), y: rnd(0, v.h), r: rnd(18, 88), vx: rnd(-5, 5), vy: rnd(-12, -3), a: rnd(.05, .17), c: cols[i % cols.length], p: rnd(0, 6.28) });
      return function (c, dt, t) {
        c.globalCompositeOperation = 'screen';
        B.forEach(function (b) {
          b.x += b.vx * dt; b.y += b.vy * dt; if (b.y < -b.r) { b.y = v.h + b.r; b.x = rnd(0, v.w); } if (b.x < -b.r) b.x = v.w + b.r; if (b.x > v.w + b.r) b.x = -b.r;
          var al = b.a * (.7 + .3 * Math.sin(t * .8 + b.p)), g = c.createRadialGradient(b.x, b.y, b.r * .55, b.x, b.y, b.r);
          g.addColorStop(0, 'rgba(' + b.c + ',' + al * .6 + ')'); g.addColorStop(.88, 'rgba(' + b.c + ',' + al + ')'); g.addColorStop(1, 'rgba(' + b.c + ',0)');
          c.fillStyle = g; c.beginPath(); c.arc(b.x, b.y, b.r, 0, TAU); c.fill();
        });
        c.globalCompositeOperation = 'source-over';
      };
    }
  };

  /* 12. Clouds (light theme): soft clouds drifting past a sun */
  P.clouds = {
    label: 'Clouds',
    vars: T(['#e6f3ff', '#bfe3ff', '#1f3a5f', '#4a6a93', '#1f3a5f', '#4a78b8', '#fff8dc', '#ffe0a8', '#ffb876', '#5a3300',
      'rgba(255,255,255,.88)', 'rgba(31,58,95,.2)', 'rgba(31,58,95,.2)', 'rgba(230,243,255,.9)', '#1f3a5f', '#ffffff', '#1f3a5f']),
    make: function (v) {
      var sprites = [], K = [], q, i;
      function sprite(w, h, seed) {
        var o = document.createElement('canvas'); o.width = w; o.height = h; var c = o.getContext('2d'); c.filter = 'blur(3px)'; c.fillStyle = '#fff';
        var puffs = 7 + (seed % 4);
        for (var n = 0; n < puffs; n++) { var t = n / (puffs - 1), r = h * (.22 + .2 * Math.sin(t * 3.14 + seed)); c.beginPath(); c.arc(h * .35 + t * (w - h * .7), h * .68 - Math.sin(t * 3.14) * h * .16, Math.abs(r) + h * .08, 0, TAU); c.fill(); }
        c.fillRect(h * .3, h * .68, w - h * .6, h * .22); return o;
      }
      for (q = 0; q < 5; q++) sprites.push(sprite(380 + q * 40, 150 + q * 12, q + 1));
      for (i = 0; i < 9; i++) K.push({ s: sprites[i % sprites.length], x: rnd(-250, v.w + 250), y: v.h * rnd(.05, .85), sc: rnd(.6, 1.7), v: rnd(5, 17), a: rnd(.4, .8) });
      return function (c, dt, t) {
        var sx = v.w * .85, sy = v.h * .14, sr = Math.min(v.w, v.h) * (.2 + .015 * Math.sin(t * .5)), g = c.createRadialGradient(sx, sy, 0, sx, sy, sr);
        g.addColorStop(0, 'rgba(255,246,216,.95)'); g.addColorStop(.4, 'rgba(255,224,168,.75)'); g.addColorStop(1, 'rgba(255,200,150,0)'); c.fillStyle = g; c.fillRect(0, 0, v.w, v.h);
        K.forEach(function (k) { k.x += k.v * dt * k.sc; var w = k.s.width * k.sc; if (k.x > v.w + 40) k.x = -w - 40; c.globalAlpha = k.a; c.drawImage(k.s, k.x, k.y, w, k.s.height * k.sc); });
        c.globalAlpha = 1;
      };
    }
  };

  /* ---------- picking (reads landing-config.js -> background) ---------- */
  function settings() { return C.background || {}; }
  function enabledIds() {
    var b = settings(), on = Object.keys(P).filter(function (id) { return !b.presets || b.presets[id] !== false; });
    return on.length ? on : ['starfield'];                       // everything switched off: fall back to the original
  }
  function choose() {
    var b = settings(), q = new URLSearchParams(location.search).get('bg');
    if (q && P[q]) return q;                                      // ?bg=aurora always wins (handy for previews)
    if (b.mode && b.mode !== 'random' && P[b.mode]) return b.mode;
    var ids = enabledIds(), last = null, pool = ids;
    try { last = localStorage.getItem('cs-last-bg'); } catch (e) {}
    if (b.avoidRepeat !== false && ids.length > 1) pool = ids.filter(function (id) { return id !== last; });
    var id = pool[Math.floor(Math.random() * pool.length)];
    try { localStorage.setItem('cs-last-bg', id); } catch (e) {}
    return id;
  }

  function start(canvas) {
    var id = choose(), p = P[id], root = document.documentElement, k;
    for (k in p.vars) root.style.setProperty(k, p.vars[k]);
    root.setAttribute('data-bg', id);
    if (settings().showLabel || /[?&]label\b/.test(location.search)) {
      var tag = document.createElement('div'); tag.className = 'bg-label'; tag.textContent = 'Background: ' + p.label; document.body.appendChild(tag);
    }
    var view = CS.fitCanvas(canvas), frame = p.make(view);
    window.addEventListener('resize', function () { view = CS.fitCanvas(canvas); frame = p.make(view); });
    CS.loop(function (dt, t) { view.ctx.clearRect(0, 0, view.w, view.h); frame(view.ctx, dt, t, view, orbitBox()); });
    return id;
  }

  window.CSBG = { presets: P, choose: choose, start: start, enabled: enabledIds };
})();
