/* ==========================================================================
   Emanuel Pet Grooming — ambient bubble layer
   One fixed <canvas> behind the page content. Bubbles are drawn from two
   pre-rendered sprites (cheap), drift upward, react to scroll speed and the
   cursor, and pop when tapped. Exposes window.EmanuelBubbles.
   ========================================================================== */
(function () {
  'use strict';

  var TAU = Math.PI * 2;

  /** Pre-render one glossy bubble in the logo's flat-aqua style. */
  function makeSprite(size) {
    var c = document.createElement('canvas');
    c.width = c.height = size;
    var g = c.getContext('2d');
    var r = size / 2;

    // Body: transparent core, aqua edge (matches the bubbles in the logo)
    var body = g.createRadialGradient(r * 0.86, r * 0.92, r * 0.12, r, r, r * 0.97);
    body.addColorStop(0, 'rgba(207,232,243,0.06)');
    body.addColorStop(0.72, 'rgba(159,205,226,0.24)');
    body.addColorStop(0.94, 'rgba(120,176,210,0.62)');
    body.addColorStop(1, 'rgba(120,176,210,0)');
    g.fillStyle = body;
    g.beginPath(); g.arc(r, r, r * 0.97, 0, TAU); g.fill();

    // Thin-film iridescence ring (pink / lilac / aqua)
    if (g.createConicGradient) {
      var film = g.createConicGradient(-0.7, r, r);
      film.addColorStop(0.00, 'rgba(159,205,226,0.55)');
      film.addColorStop(0.25, 'rgba(242,196,207,0.50)');
      film.addColorStop(0.50, 'rgba(200,180,245,0.42)');
      film.addColorStop(0.75, 'rgba(143,227,255,0.55)');
      film.addColorStop(1.00, 'rgba(159,205,226,0.55)');
      g.strokeStyle = film;
    } else {
      g.strokeStyle = 'rgba(180,205,240,0.45)';
    }
    g.lineWidth = size * 0.04;
    g.beginPath(); g.arc(r, r, r * 0.9, 0, TAU); g.stroke();

    // Crisp rim
    g.lineWidth = Math.max(1, size * 0.012);
    g.strokeStyle = 'rgba(255,255,255,0.6)';
    g.beginPath(); g.arc(r, r, r * 0.965, 0, TAU); g.stroke();

    // Primary highlight (top-left ellipse)
    g.save();
    g.translate(r * 0.62, r * 0.48);
    g.rotate(-0.62);
    g.scale(1, 0.52);
    var hi = g.createRadialGradient(0, 0, 0, 0, 0, r * 0.3);
    hi.addColorStop(0, 'rgba(255,255,255,0.96)');
    hi.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = hi;
    g.beginPath(); g.arc(0, 0, r * 0.3, 0, TAU); g.fill();
    g.restore();

    // Secondary reflection (bottom-right arc)
    g.strokeStyle = 'rgba(255,255,255,0.55)';
    g.lineWidth = size * 0.022;
    g.lineCap = 'round';
    g.beginPath(); g.arc(r, r, r * 0.76, 0.18 * Math.PI, 0.46 * Math.PI); g.stroke();
    return c;
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function create(canvas, opts) {
    opts = opts || {};
    var ctx = canvas.getContext('2d', { alpha: true });
    var sprites = { sm: makeSprite(128), lg: makeSprite(320) };
    var bubbles = [];
    var pops = [];
    var W = 0, H = 0, dpr = 1;
    var mouse = { x: -9999, y: -9999, active: false };
    var popCount = 0;
    var onPop = opts.onPop || function () {};
    var coarse = window.matchMedia('(pointer: coarse)').matches;

    function targetCount() {
      var n = Math.round((W * H) / 52000);
      if (coarse || W < 700) n = Math.round(n * 0.7);
      return Math.max(14, Math.min(56, n));
    }

    function spawn(b, anywhere) {
      var z = Math.pow(Math.random(), 1.6);              // few big/near, many small/far
      b.z = z;
      b.r = 7 + z * 46 + (Math.random() < 0.06 ? 30 : 0);
      b.x = rand(0, W);
      b.y = anywhere ? rand(0, H) : H + b.r + rand(0, H * 0.35);
      b.speed = rand(14, 34) * (0.55 + z * 0.9);          // px/s upward
      b.sway = rand(6, 22);
      b.swayF = rand(0.25, 0.7);
      b.phase = rand(0, TAU);
      b.vx = 0; b.vy = 0;
      b.alpha = 0.5 + z * 0.5;
      b.dead = false;
      return b;
    }

    function resize() {
      var w = window.innerWidth, h = window.innerHeight;
      // ignore tiny height changes (mobile URL bar) to avoid reseeding mid-scroll
      var firstRun = W === 0;
      if (!firstRun && w === W && Math.abs(h - H) < 140) return;
      W = w; H = h;
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = targetCount();
      while (bubbles.length < n) bubbles.push(spawn({}, true));
      if (bubbles.length > n) bubbles.length = n;
      bubbles.forEach(function (b) { if (b.x > W) b.x = rand(0, W); });
    }

    /** Advance simulation. dt in seconds, scrollDelta in px since last frame. */
    function update(dt, scrollDelta) {
      dt = Math.min(dt, 0.05);
      var t = performance.now() / 1000;
      for (var i = 0; i < bubbles.length; i++) {
        var b = bubbles[i];
        // Rise + parallax coupling: scrolling down lifts bubbles; farther ones lift less.
        b.y -= b.speed * dt;
        b.y -= scrollDelta * (0.18 + b.z * 0.42);
        b.x += Math.sin(t * b.swayF + b.phase) * b.sway * dt;

        // Cursor repel (soft push that eases out)
        if (mouse.active) {
          var dx = b.x - mouse.x, dy = b.y - mouse.y;
          var d2 = dx * dx + dy * dy, R = b.r + 90;
          if (d2 < R * R && d2 > 1) {
            var d = Math.sqrt(d2), f = (1 - d / R) * 260;
            b.vx += (dx / d) * f * dt;
            b.vy += (dy / d) * f * dt;
          }
        }
        b.x += b.vx * dt; b.y += b.vy * dt;
        var damp = Math.pow(0.04, dt);
        b.vx *= damp; b.vy *= damp;

        if (b.y < -b.r * 2) spawn(b, false);
        else if (b.y > H + b.r * 2 + H * 0.5) { spawn(b, false); b.y = -b.r - rand(0, 60); }
        if (b.x < -b.r * 2) b.x = W + b.r; else if (b.x > W + b.r * 2) b.x = -b.r;
      }
      for (var p = pops.length - 1; p >= 0; p--) {
        pops[p].t += dt / 0.42;
        if (pops[p].t >= 1) pops.splice(p, 1);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingQuality = 'high';
      for (var i = 0; i < bubbles.length; i++) {
        var b = bubbles[i];
        var s = b.r > 34 ? sprites.lg : sprites.sm;
        ctx.globalAlpha = b.alpha * 0.9;
        ctx.drawImage(s, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
      }
      for (var p = 0; p < pops.length; p++) {
        var o = pops[p], e = 1 - Math.pow(1 - o.t, 3);
        ctx.globalAlpha = (1 - o.t) * 0.9;
        ctx.strokeStyle = 'rgba(255,255,255,0.95)';
        ctx.lineWidth = 2 * (1 - o.t) + 0.5;
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r * (1 + e * 0.5), 0, TAU); ctx.stroke();
        ctx.fillStyle = 'rgba(159,205,226,0.95)';
        for (var k = 0; k < o.drops.length; k++) {
          var a = o.drops[k], dist = o.r * (0.7 + e * 1.1);
          ctx.beginPath();
          ctx.arc(o.x + Math.cos(a) * dist, o.y + Math.sin(a) * dist, Math.max(0.6, 2.6 * (1 - o.t)), 0, TAU);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    /** Hit-test a viewport point; pops the nearest bubble under it. */
    function tryPop(x, y) {
      var best = null, bestD = Infinity;
      for (var i = 0; i < bubbles.length; i++) {
        var b = bubbles[i], dx = x - b.x, dy = y - b.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d <= b.r * 1.15 + 6 && d < bestD) { best = b; bestD = d; }
      }
      if (!best) return false;
      var drops = [];
      for (var k = 0; k < 8; k++) drops.push((k / 8) * TAU + rand(-0.2, 0.2));
      pops.push({ x: best.x, y: best.y, r: best.r, t: 0, drops: drops });
      spawn(best, false);
      popCount++;
      onPop(popCount);
      return true;
    }

    function setMouse(x, y) { mouse.x = x; mouse.y = y; mouse.active = true; }
    function clearMouse() { mouse.active = false; mouse.x = mouse.y = -9999; }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    return { update: update, draw: draw, resize: resize, tryPop: tryPop, setMouse: setMouse, clearMouse: clearMouse };
  }

  window.EmanuelBubbles = { create: create };
})();
