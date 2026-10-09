/* ==========================================================================
   Emanuel Pet Grooming — Luxe front page engine
   - Lenis smooth scrolling (desktop pointers only; touch stays native)
   - One rAF loop drives: parallax layers, in-frame image parallax, word
     reveal, scroll-scrubbed tub, header, marquee
   - Everything degrades: no JS = static page; reduced motion = no motion.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document, html = doc.documentElement, body = doc.body, win = window;
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  var mqReduced = win.matchMedia('(prefers-reduced-motion: reduce)');
  var mqFine = win.matchMedia('(hover: hover) and (pointer: fine)');
  var reduced = mqReduced.matches;

  /* ------------------------------------------------------------------------
     ★ YOUR CALL — how far apart do the parallax depth layers feel?
     Every element with data-depth="n" runs through this. Positive n = far
     away (scrolls slower than the page), negative n = in front (scrolls
     faster). The return value is the fraction of scroll it "lags" by:
        0     → moves with the page (no parallax)
        0.08  → subtle, expensive-feeling (default: depth × 0.08)
        0.2+  → dramatic, can feel floaty on small screens
     Try an eased curve (e.g. Math.sign(d) * Math.pow(Math.abs(d), 0.8) * 0.1)
     if you want far layers to separate less than near ones.
     ------------------------------------------------------------------------ */
  function depthToSpeed(depth) {
    return depth * 0.08;
  }

  /* ---------- state ---------- */
  var vw = win.innerWidth, vh = win.innerHeight;
  var lastY = win.scrollY, vel = 0, docH = 1;
  var mouse = { tx: 0, ty: 0, x: 0, y: 0 };
  var lenis = null, bubbles = null, ticking = false, isReady = false;

  /* ---------- smooth scroll ---------- */
  function initLenis() {
    if (reduced || typeof win.Lenis === 'undefined' || !mqFine.matches) return;
    lenis = new win.Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });
  }
  function lockScroll(on) {
    html.classList.toggle('is-locked', on);
    if (lenis) { on ? lenis.stop() : lenis.start(); }
  }
  function scrollToEl(el) {
    var off = el.id === 'home' ? 0 : -6;
    if (lenis) {
      lenis.scrollTo(el, { offset: off, duration: 1.6, easing: function (t) { return 1 - Math.pow(1 - t, 4); } });
    } else {
      win.scrollTo({ top: el.getBoundingClientRect().top + win.scrollY + off, behavior: reduced ? 'auto' : 'smooth' });
    }
  }

  /* ---------- parallax layers ([data-depth]) ---------- */
  var layers = [];
  function collectLayers() {
    layers = $$('[data-depth]').map(function (el) {
      // Layers in the hero are measured from scroll 0 so they rest exactly where designed;
      // every other layer rests when it is centered in the viewport.
      return { el: el, speed: depthToSpeed(parseFloat(el.getAttribute('data-depth')) || 0), mouse: parseFloat(el.getAttribute('data-mouse')) || 0, hero: !!el.closest('.hero'), cy: 0, h: 0, last: '' };
    });
  }
  function measureLayers() {
    layers.forEach(function (l) { l.el.style.translate = ''; l.last = ''; });
    var sy = win.scrollY;
    layers.forEach(function (l) {
      var r = l.el.getBoundingClientRect();
      l.cy = r.top + sy + r.height / 2; l.h = r.height;
    });
  }
  function updateLayers(y) {
    var mid = y + vh / 2;
    for (var i = 0; i < layers.length; i++) {
      var l = layers[i], d = l.hero ? -y : l.cy - mid;
      if (l.hero ? y > vh * 1.6 : Math.abs(d) > vh / 2 + l.h / 2 + 320) continue;   // off-screen: skip
      var tx = l.mouse ? mouse.x * l.mouse : 0;
      var ty = -d * l.speed + (l.mouse ? mouse.y * l.mouse : 0);
      var v = tx.toFixed(1) + 'px ' + ty.toFixed(1) + 'px';
      if (v !== l.last) { l.el.style.translate = v; l.last = v; }
    }
  }

  /* ---------- in-frame image parallax ([data-img-parallax]) ---------- */
  var frames = [];
  function collectFrames() {
    frames = $$('[data-img-parallax]').map(function (el) { return { el: el, img: $('img', el), last: '' }; });
  }

  /* ---------- word-by-word statement ---------- */
  var words = [], wordsLit = -1, statementEl = $('#statement');
  function splitWords(root) {
    var out = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (tok) {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { frag.appendChild(doc.createTextNode(tok)); return; }
            var s = doc.createElement('span'); s.className = 'w'; s.textContent = tok;
            frag.appendChild(s); out.push(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) { walk(n); }
      });
    })(root);
    return out;
  }

  /* ---------- the visit: tub + steps ---------- */
  var tub = $('#tub'), stepsEl = $('#steps'), stepEls = $$('.step'), tubStep = $('#tubStep'), tubName = $('#tubName'), activeStep = -1;
  function updateJourney(stepRects) {
    if (!tub || !stepsEl) return;
    var r = stepsEl.getBoundingClientRect();
    var p = clamp((vh * 0.5 - r.top) / r.height, 0, 1);
    tub.style.setProperty('--p', (0.05 + p * 0.9).toFixed(3));
    var best = 0, bestD = Infinity;
    for (var i = 0; i < stepRects.length; i++) {
      var d = Math.abs(stepRects[i].top + stepRects[i].height / 2 - vh * 0.5);
      if (d < bestD) { bestD = d; best = i; }
    }
    if (best !== activeStep) {
      activeStep = best;
      stepEls.forEach(function (s, i) { s.classList.toggle('is-active', i === best); });
      if (tubStep) tubStep.textContent = 'Step ' + (best + 1) + ' of ' + stepEls.length;
      if (tubName) tubName.innerHTML = stepEls[best].getAttribute('data-name');
    }
  }

  /* ---------- header, progress, dock, marquee ---------- */
  var header = $('#siteHeader'), progress = $('#scrollProgress'), dock = $('#dock'), skew = $('#marqueeSkew'), visitSec = $('#visit');
  var skewCur = 0, headerHidden = false;
  function updateChrome(y, delta) {
    header.classList.toggle('is-scrolled', y > 24);
    if (!body.classList.contains('menu-open')) {
      if (!headerHidden && y > vh * 0.9 && delta > 5) { headerHidden = true; header.classList.add('is-hidden'); }
      else if (headerHidden && (delta < -4 || y < vh * 0.9)) { headerHidden = false; header.classList.remove('is-hidden'); }
    }
    if (progress) progress.style.transform = 'scaleX(' + clamp(y / Math.max(1, docH - vh), 0, 1).toFixed(4) + ')';
    if (dock) {
      var vr = visitSec ? visitSec.getBoundingClientRect() : null;
      dock.classList.toggle('is-on', y > vh * 0.7 && !(vr && vr.top < vh * 0.55 && vr.bottom > 0));
    }
    if (skew) {
      skewCur += (clamp(vel * -0.22, -7, 7) - skewCur) * 0.12;
      skew.style.transform = Math.abs(skewCur) > 0.02 ? 'skewX(' + skewCur.toFixed(2) + 'deg)' : '';
    }
  }

  /* ---------- phone tilt ---------- */
  var tilt = $('[data-tilt]'), tiltLast = '';
  function updateTilt(y) {
    if (!tilt || !mqFine.matches) return;
    var r = tilt.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    var v = (-mouse.y * 7).toFixed(2) + 'deg|' + (mouse.x * 9).toFixed(2) + 'deg';
    if (v !== tiltLast) { tiltLast = v; var p = v.split('|'); tilt.style.setProperty('--rx', p[0]); tilt.style.setProperty('--ry', p[1]); }
  }

  /* ---------- main loop ---------- */
  var lastT = 0;
  function frame(now) {
    win.requestAnimationFrame(frame);
    if (doc.hidden) { lastT = now; return; }
    var dt = lastT ? (now - lastT) / 1000 : 0.016; lastT = now;
    if (lenis) lenis.raf(now);

    var y = win.scrollY, delta = y - lastY; lastY = y;
    vel += (delta - vel) * 0.18;
    mouse.x += (mouse.tx - mouse.x) * 0.07; mouse.y += (mouse.ty - mouse.y) * 0.07;

    // ---- read phase ----
    var wRect = words.length ? statementEl.getBoundingClientRect() : null;
    var fRects = [];
    for (var i = 0; i < frames.length; i++) {
      var r = frames[i].el.getBoundingClientRect();
      fRects.push(r.bottom < -200 || r.top > vh + 200 ? null : r);
    }
    var sRects = stepEls.length ? stepEls.map(function (s) { return s.getBoundingClientRect(); }) : [];

    // ---- write phase ----
    updateLayers(y);
    for (var f = 0; f < frames.length; f++) {
      var fr = fRects[f]; if (!fr) continue;
      var t = clamp((fr.top + fr.height / 2 - vh / 2) / (vh / 2 + fr.height / 2), -1, 1);
      var v = (-t * fr.height * 0.065).toFixed(1) + 'px';
      if (v !== frames[f].last) { frames[f].img.style.translate = '0 ' + v; frames[f].last = v; }
    }
    if (wRect) {
      var p = clamp((vh * 0.88 - wRect.top) / (vh * 0.6), 0, 1);   // lit start: top at 88% of viewport → fully lit at 28%
      var lit = Math.round(p * words.length);
      if (lit !== wordsLit) {
        for (var w = 0; w < words.length; w++) words[w].classList.toggle('lit', w < lit);
        wordsLit = lit;
      }
    }
    updateJourney(sRects);
    updateChrome(y, delta);
    updateTilt(y);
    if (bubbles) { bubbles.update(dt, delta); bubbles.draw(); }
  }

  /* ---------- package cards: one shared height ---------- */
  // The stacked cards must all be as tall as the tallest, or a taller card pokes out beneath the
  // next one. Content wraps differently at every width, so measure instead of hand-tuning rems.
  // (The CSS --pkg-min values stay as the no-JS fallback.)
  function fitPackages() {
    var cards = $$('.pkg');
    if (!cards.length) return;
    cards.forEach(function (c) { c.style.setProperty('--pkg-min', '0px'); });
    var tallest = 0;
    cards.forEach(function (c) { tallest = Math.max(tallest, c.offsetHeight); });
    cards.forEach(function (c) { c.style.setProperty('--pkg-min', (tallest + 2) + 'px'); });
  }

  /* ---------- measuring ---------- */
  var measureTimer = 0;
  function measureAll() {
    vw = win.innerWidth; vh = win.innerHeight;
    fitPackages();
    docH = doc.documentElement.scrollHeight;
    measureLayers();
    docH = doc.documentElement.scrollHeight;
  }
  function queueMeasure() { win.clearTimeout(measureTimer); measureTimer = win.setTimeout(measureAll, 140); }

  /* ---------- dialogs ---------- */
  function openDialog(d) {
    if (!d) return;
    if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
    lockScroll(true);
  }
  function wireDialog(d) {
    d.addEventListener('close', function () { lockScroll(false); });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    $$('[data-close]', d).forEach(function (b) { b.addEventListener('click', function () { d.close(); }); });
  }
  var portalDialog = $('#portalDialog'), lightbox = $('#lightbox');
  [portalDialog, lightbox].forEach(function (d) { if (d) wireDialog(d); });
  $$('[data-open-portal]').forEach(function (b) { b.addEventListener('click', function () { closeMenu(); openDialog(portalDialog); }); });

  // Lightbox: each [data-lightbox="name"] group (gallery, bubble field) pages through its own photos
  var lbGroup = [], lbIdx = 0, lbImg = $('#lbImg'), lbCap = $('#lbCap');
  function showShot(i) {
    lbIdx = (i + lbGroup.length) % lbGroup.length;
    var s = lbGroup[lbIdx], img = $('img', s);
    lbImg.src = img.getAttribute('src'); lbImg.alt = img.alt; lbCap.textContent = s.getAttribute('data-caption') || '';
  }
  $$('[data-lightbox]').forEach(function (s) {
    s.addEventListener('click', function () {
      lbGroup = $$('[data-lightbox="' + s.getAttribute('data-lightbox') + '"]');
      showShot(lbGroup.indexOf(s));
      openDialog(lightbox);
    });
  });
  if (lightbox) {
    $('.lb-prev', lightbox).addEventListener('click', function () { showShot(lbIdx - 1); });
    $('.lb-next', lightbox).addEventListener('click', function () { showShot(lbIdx + 1); });
    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') showShot(lbIdx - 1); else if (e.key === 'ArrowRight') showShot(lbIdx + 1);
    });
  }

  /* ---------- menu ---------- */
  var menu = $('#menu'), menuBtn = $('#menuToggle');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    if (open) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
    if (open) { headerHidden = false; header.classList.remove('is-hidden'); }
    lockScroll(open);
  }
  function closeMenu() { if (body.classList.contains('menu-open')) setMenu(false); }
  menuBtn.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  win.matchMedia('(min-width: 1180px)').addEventListener('change', function (e) { if (e.matches) closeMenu(); });

  /* ---------- anchors ---------- */
  doc.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var target = $(id);
    if (!target) return;
    e.preventDefault();
    var wasOpen = body.classList.contains('menu-open');
    closeMenu();
    // let the scroll lock release before moving
    win.setTimeout(function () { scrollToEl(target); try { history.replaceState(null, '', id); } catch (err) {} }, wasOpen ? 60 : 0);
  });

  /* ---------- nav highlight ---------- */
  function wireNavHighlight() {
    var links = $$('.nav a');
    if (!('IntersectionObserver' in win)) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var a = map[en.target.id]; if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var s = doc.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- reveals ---------- */
  function wireReveals() {
    var els = $$('.reveal:not([data-hero])');
    if (!('IntersectionObserver' in win)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- toast ---------- */
  var toastEl = $('#toast'), toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('is-on');
    win.clearTimeout(toastTimer);
    toastTimer = win.setTimeout(function () { toastEl.classList.remove('is-on'); }, 3800);
  }

  /* ---------- bubbles wiring ---------- */
  function initBubbles() {
    var canvas = $('#bubbleCanvas');
    if (!canvas || !win.EmanuelBubbles) return;
    bubbles = win.EmanuelBubbles.create(canvas, {
      onPop: function (n) {
        if (n === 5) toast('Five bubbles popped! Loyalty points are on the way.');
        else if (n === 25) toast('Okay, you really love bubbles. So do we.');
      }
    });
    if (reduced) { bubbles.draw(); win.addEventListener('resize', function () { bubbles.resize(); bubbles.draw(); }, { passive: true }); return; }

    var down = null;
    var blocked = 'a,button,summary,input,select,textarea,iframe,dialog,img,figure,details,p,h1,h2,h3,li,label,.card,.phone,.menu,[data-no-pop]';
    win.addEventListener('pointerdown', function (e) { down = { x: e.clientX, y: e.clientY, t: e.timeStamp }; }, { passive: true });
    win.addEventListener('pointerup', function (e) {
      if (!down) return;
      var moved = Math.hypot(e.clientX - down.x, e.clientY - down.y), dur = e.timeStamp - down.t; down = null;
      if (moved < 8 && dur < 500 && !(e.target.closest && e.target.closest(blocked))) bubbles.tryPop(e.clientX, e.clientY);
    }, { passive: true });
    win.addEventListener('pointercancel', function () { down = null; }, { passive: true });
    if (mqFine.matches) {
      win.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'mouse') return;
        bubbles.setMouse(e.clientX, e.clientY);
        mouse.tx = (e.clientX / vw - 0.5) * 2; mouse.ty = (e.clientY / vh - 0.5) * 2;
      }, { passive: true });
      doc.documentElement.addEventListener('mouseleave', function () { bubbles.clearMouse(); mouse.tx = mouse.ty = 0; });
    }
  }

  /* ---------- boot / preloader ---------- */
  function ready() {
    if (isReady) return; isReady = true;
    html.classList.remove('is-loading');
    html.classList.add('is-ready');
    if (lenis) lenis.start();
    $$('.reveal[data-hero]').forEach(function (el) { el.classList.add('in'); });
    measureAll();
  }
  function boot() {
    var pre = $('#preloader');
    var seen = false;
    try { seen = win.sessionStorage.getItem('epg-intro') === '1'; } catch (e) {}
    if (reduced || !pre || seen) { if (pre) pre.remove(); ready(); return; }

    html.classList.add('is-loading');
    if (lenis) lenis.stop();
    var heroImgs = $$('.hero-bubbles img').map(function (img) { return img.decode ? img.decode().catch(function () {}) : Promise.resolve(); });
    var assets = Promise.all([doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve()].concat(heroImgs));
    var minWait = new Promise(function (r) { win.setTimeout(r, 1500); });
    var maxWait = new Promise(function (r) { win.setTimeout(r, 3600); });
    Promise.race([Promise.all([minWait, assets]), maxWait]).then(function () {
      pre.classList.add('is-done');
      try { win.sessionStorage.setItem('epg-intro', '1'); } catch (e) {}
      win.setTimeout(ready, 380);
      win.setTimeout(function () { pre.remove(); }, 1700);
    });
  }

  function init() {
    var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

    var track = $('#marqueeTrack');
    if (track && !reduced) track.innerHTML += track.innerHTML;

    if (statementEl && !reduced) words = splitWords(statementEl);

    initLenis();
    collectLayers();
    collectFrames();
    wireReveals();
    wireNavHighlight();
    initBubbles();

    win.addEventListener('resize', queueMeasure, { passive: true });
    win.addEventListener('load', measureAll);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(queueMeasure);
    if ('ResizeObserver' in win) new ResizeObserver(queueMeasure).observe(body);

    if (reduced && tubStep && tubName) { tubStep.textContent = 'Four gentle steps'; tubName.textContent = 'Your visit'; }
    measureAll();
    if (!reduced) win.requestAnimationFrame(frame);
    else {
      // static page: still keep the progress bar + header state honest
      win.addEventListener('scroll', function () { var y = win.scrollY; updateChrome(y, 0); }, { passive: true });
    }
    boot();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
