/* Robotmea — motion system */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const ease = 'expo.out';
  const root = document.documentElement;
  const TONES = ['#13a5d4', '#141416', '#f39a2a', '#7aa53c', '#e8474b'];
  if (!window.gsap || !window.ScrollTrigger) { window.__rescue && window.__rescue(); return; }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- original line icons ---------------- */
  const I = (d) => `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ORB = [
    I('<rect x="9" y="9" width="14" height="14" rx="2"/><rect x="13" y="13" width="6" height="6" rx="1"/><path d="M12 9V5M16 9V5M20 9V5M12 27v-4M16 27v-4M20 27v-4M9 12H5M9 16H5M9 20H5M27 12h-4M27 16h-4M27 20h-4"/>'),
    I('<path d="M6 27h10M11 27v-5l5-6 6 2 3-4"/><circle cx="16" cy="16" r="2"/><circle cx="22" cy="18" r="1.6"/><path d="M25 14l2-3M25 14l3 1"/>'),
    I('<rect x="12" y="13" width="8" height="6" rx="2"/><path d="M12 14 6 10M20 14l6-4M12 18l-6 4M20 18l6 4"/><circle cx="6" cy="10" r="2.4"/><circle cx="26" cy="10" r="2.4"/><circle cx="6" cy="22" r="2.4"/><circle cx="26" cy="22" r="2.4"/>'),
    I('<circle cx="16" cy="16" r="4"/><path d="M16 4v4M16 24v4M4 16h4M24 16h4M7.5 7.5l2.8 2.8M21.7 21.7l2.8 2.8M7.5 24.5l2.8-2.8M21.7 10.3l2.8-2.8"/>'),
    I('<ellipse cx="16" cy="16" rx="12" ry="4.5"/><ellipse cx="16" cy="16" rx="12" ry="4.5" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="12" ry="4.5" transform="rotate(120 16 16)"/><circle cx="16" cy="16" r="1.6"/>'),
    I('<rect x="5" y="11" width="22" height="11" rx="4"/><circle cx="11.5" cy="16.5" r="2.5"/><circle cx="20.5" cy="16.5" r="2.5"/><path d="M14 21q2-2 4 0"/>'),
  ];
  $('.orbiters').innerHTML = ORB.map((s, i) => `<span class="orbiter" style="--a:${i * 60}deg">${s}</span>`).join('');

  /* ---------------- team ---------------- */
  const TEAM = [['song-won-heon', 'Song Won-heon', 'President, IERDG'], ['khaled-al-aswadi', 'Khaled Al-Aswadi', 'Chairman'], ['yoonsang-chang', 'Prof. Dr. Yoonsang Chang', 'Head of Research'], ['burhan-ali', 'Syed Burhan Ali', 'Chief Vision Officer'], ['hugh-kim', 'Hugh Kim', 'International Enablement'], ['feraz-zaidan', 'Feras Zeidan', 'Advisor'], ['nauman-khan', 'Muhammad Nauman Khan', 'Chief EdTech Officer'], ['hammad-basil', 'Hammad Basil', 'Consultant']];
  $('.team').innerHTML = TEAM.map(([f, n, r]) => `<article class="person"><div class="person-img"><img src="assets/team/${f}.webp" alt="${n}" loading="lazy" /></div><h4>${n}</h4><p>${r}</p></article>`).join('');

  /* ---------------- hardware line art (original) ---------------- */
  const HW = {
    hub: `<path class="fl" d="M40 150 160 90l120 60-120 60z"/><path class="st" d="M40 150 160 90l120 60-120 60zM40 150v-70l120-60v70M280 150V80L160 20"/>
      <path class="st" d="M90 150l40-20 30 15-40 20zM170 165l40-20 30 15-40 20z"/><path class="st" d="M110 140v-14M140 155v-14M190 155v-14M220 170v-14"/>
      <rect class="st" x="148" y="110" width="22" height="18" rx="4"/><circle class="st" cx="154" cy="119" r="2"/><circle class="st" cx="164" cy="119" r="2"/><path class="st" d="M159 110v-8M155 102h8"/>
      <path class="acc" stroke="#13a5d4" d="M70 70h40M70 82h26"/><circle class="led" style="color:#7aa53c" cx="250" cy="70" r="4"/>`,
    garage: `<path class="st" d="M30 190h260"/><path class="st" d="M70 190v-20h40v20M90 170l20-50 40 10 18-30"/><circle class="st" cx="110" cy="120" r="7"/><circle class="st" cx="150" cy="130" r="6"/><path class="st" d="M168 100l12-10M168 100l16 4"/>
      <g class="drone"><rect class="st" x="205" y="58" width="40" height="18" rx="6"/><path class="st" d="M205 62h-22M245 62h22M205 72h-22M245 72h22"/><ellipse class="st" cx="176" cy="60" rx="16" ry="3"/><ellipse class="st" cx="274" cy="60" rx="16" ry="3"/><circle class="led" style="color:#e8474b" cx="225" cy="67" r="3"/></g>
      <path class="acc" stroke="#f39a2a" d="M205 140h70v40h-70zM215 150h20M215 160h40"/>`,
    box: `<path class="fl" d="M60 120 160 80l100 40-100 40z"/><path class="st" d="M60 120v60l100 40 100-40v-60M60 120 160 80l100 40-100 40zM160 160v60"/>
      <path class="st" d="M60 120l-30-30 100-40 30 30M260 120l30-30-100-40-30 30"/>
      <rect class="st" x="120" y="104" width="34" height="22" rx="3" transform="skewY(-10)"/><path class="acc" stroke="#13a5d4" d="M175 112h24M175 120h16"/><circle class="led" style="color:#7aa53c" cx="140" cy="96" r="3"/><circle class="led" style="color:#f39a2a" cx="188" cy="100" r="3"/>`,
    portal: `<rect class="st" x="50" y="30" width="220" height="140" rx="10"/><path class="st" d="M30 190h260l-16-20H46z"/><path class="st" d="M50 52h220"/>
      <circle class="led" style="color:#e8474b" cx="64" cy="41" r="3"/><circle class="led" style="color:#f39a2a" cx="76" cy="41" r="3"/><circle class="led" style="color:#7aa53c" cx="88" cy="41" r="3"/>
      <path class="acc" stroke="#13a5d4" d="M72 150l40-36 30 18 40-46 40 22"/><path class="st" d="M72 70h60M72 82h40M200 70h48v48h-48z"/><path class="st" d="M210 106v-10M222 106v-20M234 106v-28"/>`,
  };
  $$('.hw').forEach((h) => ($('svg', h).innerHTML = HW[h.dataset.hw]));

  /* ---------------- split headings into masked lines ---------------- */
  function split(el) {
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map((p) => `<span class="l"><span>${p.trim()}</span></span>`).join('');
  }
  $$('.split').forEach(split);

  /* ---------------- smooth scroll, menu, nav ---------------- */
  let lenis = null;
  if (!reduced && window.Lenis) { lenis = new Lenis({ duration: 1.2, smoothWheel: true }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  const go = (t) => (lenis ? lenis.scrollTo(t, { duration: 1.8 }) : (t === 0 ? scrollTo({ top: 0, behavior: 'smooth' }) : t.scrollIntoView({ behavior: 'smooth' })));
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => { const id = a.getAttribute('href'), t = id === '#top' ? 0 : $(id); if (t === null) return; e.preventDefault(); root.classList.remove('menu-open'); go(t); }));
  $('.nav-menu').addEventListener('click', () => root.classList.toggle('menu-open'));
  const nav = $('.nav'); let lastY = 0;
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { const y = s.scroll(); nav.classList.toggle('solid', y > 30); lastY = y; } });
  $$('.nav-links a').forEach((a) => { const t = $(a.getAttribute('href')); if (t) ScrollTrigger.create({ trigger: t, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => a.classList.toggle('on', s.isActive) }); });

  /* ---------------- technology waves (fixed canvas) ---------------- */
  const wave = { tone: TONES[0], toneC: { r: 19, g: 165, b: 212 } };
  (function waves() {
    const cv = $('.waves'), ctx = cv.getContext('2d'); let W, H; const dpr = Math.min(devicePixelRatio, 2);
    const size = () => { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; };
    size(); addEventListener('resize', size);
    const LINES = 7, parts = Array.from({ length: 9 }, (_, i) => ({ l: i % LINES, x: Math.random(), v: 0.0006 + Math.random() * 0.0012 }));
    let scrollV = 0, sy = 0;
    const yAt = (l, x, t) => { const base = H * (0.18 + l * 0.11); return base + Math.sin(x * 2.2 + t * 0.35 + l * 0.9) * 46 + Math.sin(x * 5.1 - t * 0.5 + l) * 14 + Math.sin(sy * 0.0012 + l) * 30; };
    const hex = (h) => { const n = parseInt(h.slice(1), 16); return { r: n >> 16, g: (n >> 8) & 255, b: n & 255 }; };
    const target = { ...wave.toneC };
    window.__setTone = (h) => Object.assign(target, hex(h));
    gsap.ticker.add((time) => {
      const t = reduced ? 0 : time; const ny = scrollY; scrollV += (ny - sy - scrollV) * 0.1; sy = ny;
      const c = wave.toneC; c.r += (target.r - c.r) * 0.04; c.g += (target.g - c.g) * 0.04; c.b += (target.b - c.b) * 0.04;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      for (let l = 0; l < LINES; l++) {
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) { const x = i / 80; const y = yAt(l, x * Math.PI, t); i ? ctx.lineTo(x * W, y) : ctx.moveTo(x * W, y); }
        ctx.strokeStyle = l % 3 === 0 ? `rgba(${c.r | 0},${c.g | 0},${c.b | 0},.16)` : 'rgba(20,20,22,.055)'; ctx.lineWidth = 1; ctx.stroke();
      }
      parts.forEach((p) => {
        p.x += p.v * (1 + Math.abs(scrollV) * 0.05); if (p.x > 1) p.x = 0;
        const x = p.x * W, y = yAt(p.l, p.x * Math.PI, t);
        const g = ctx.createRadialGradient(x, y, 0, x, y, 14); g.addColorStop(0, `rgba(${c.r | 0},${c.g | 0},${c.b | 0},.28)`); g.addColorStop(1, `rgba(${c.r | 0},${c.g | 0},${c.b | 0},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 14, 0, 7); ctx.fill();
        ctx.fillStyle = `rgba(${c.r | 0},${c.g | 0},${c.b | 0},.75)`; ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 7); ctx.fill();
      });
    });
    $$('[data-tone]').forEach((s) => ScrollTrigger.create({ trigger: s, start: 'top 55%', end: 'bottom 55%', onToggle: (st) => st.isActive && window.__setTone(TONES[+s.dataset.tone]) }));
  })();

  /* ---------------- circuit spine linking every section ---------------- */
  const spine = $('.spine'), sBg = $('.spine-bg'), sFg = $('.spine-fg');
  let spineLen = 1;
  function buildSpine() {
    const secs = $$('main > section'), docH = document.documentElement.scrollHeight, W = innerWidth;
    spine.setAttribute('height', docH); spine.setAttribute('viewBox', `0 0 ${W} ${docH}`);
    const margin = Math.min(36, W * 0.03); let d = '', side = 0;
    secs.forEach((s, i) => {
      const top = s.getBoundingClientRect().top + scrollY, x = side ? W - margin : margin;
      if (i === 0) d = `M ${W / 2} ${top + s.offsetHeight * 0.92} L ${W / 2} ${top + s.offsetHeight} Q ${W / 2} ${top + s.offsetHeight + 40} ${x} ${top + s.offsetHeight + 40}`;
      else { const end = top + s.offsetHeight; d += ` L ${x} ${end - 60} Q ${x} ${end} ${(W / 2)} ${end} Q ${side ? margin : W - margin} ${end} ${side ? margin : W - margin} ${end + 60}`; side = 1 - side; }
    });
    sBg.setAttribute('d', d); sFg.setAttribute('d', d);
    spineLen = sFg.getTotalLength(); sFg.style.strokeDasharray = spineLen; sFg.style.strokeDashoffset = spineLen;
  }
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { sFg.style.strokeDashoffset = spineLen * (1 - Math.min(1, s.progress * 1.04)); }, onRefresh: buildSpine });

  /* ---------------- counters ---------------- */
  const count = (el) => { const to = +el.dataset.to, dec = +(el.dataset.dec || 0), sep = el.dataset.sep, o = { v: 0 }; gsap.to(o, { v: to, duration: 2.4, ease: 'power3.out', onUpdate: () => { let s = o.v.toFixed(dec); if (sep) s = Number(s).toLocaleString('en-US'); el.textContent = s; } }); };

  /* ---------------- cursor + magnetic ---------------- */
  if (fine && !reduced) {
    root.classList.add('has-cursor');
    const cur = $('.cursor'), cx = gsap.quickTo(cur, 'x', { duration: 0.3, ease: 'power3' }), cy = gsap.quickTo(cur, 'y', { duration: 0.3, ease: 'power3' });
    addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', (e) => cur.classList.toggle('hot', !!e.target.closest('a, button, .prog, .hw, .pl')));
    $$('.magnetic').forEach((b) => { const mx = gsap.quickTo(b, 'x', { duration: 0.7, ease: 'elastic.out(1,.45)' }), my = gsap.quickTo(b, 'y', { duration: 0.7, ease: 'elastic.out(1,.45)' }); b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * 0.3); my((e.clientY - r.top - r.height / 2) * 0.4); }); b.addEventListener('pointerleave', () => { mx(0); my(0); }); });
  }

  /* ---------------- hero emblem: living mark ---------------- */
  const qs = $$('.em-q'), dirs = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  const tilt = $('.em-tilt'); gsap.set('.emblem', { perspective: 1100 });
  let mx = 0, my = 0, emScroll = 0;
  if (fine) addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  let cmx = 0, cmy = 0, breathe = 1;
  gsap.ticker.add((t) => {
    if (reduced) return;
    cmx += (mx - cmx) * 0.06; cmy += (my - cmy) * 0.06;
    gsap.set(tilt, { rotateY: cmx * 28 + Math.sin(t * 0.6) * 4, rotateX: -cmy * 22 + Math.cos(t * 0.5) * 3, y: Math.sin(t * 1.1) * 8 });
    const gap = (3 + Math.sin(t * 1.4) * 3) * breathe + emScroll * 60;
    qs.forEach((q, i) => gsap.set(q, { x: dirs[i][0] * gap, y: dirs[i][1] * gap, z: 20 + i * 6 + Math.sin(t * 1.2 + i) * 10, rotateZ: dirs[i][0] * emScroll * 8 }));
  });

  /* ---------------- decode the mark (pinned) ---------------- */
  function decode() {
    const dq = $$('.dc-q'), caps = $$('.dc-cap');
    const spread = () => Math.min(innerWidth * 0.13, 190);
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.from('.decode-head .l > span', { yPercent: 110, duration: 0.3, stagger: 0.05 }, 0)
      .to(dq, { x: (i) => dirs[i][0] * spread(), y: (i) => dirs[i][1] * spread() * 0.75, rotate: (i) => dirs[i][0] * 6, duration: 0.6 }, 0.25);
    dq.forEach((q, i) => {
      const at = 0.9 + i * 0.8;
      tl.to(dq.filter((_, k) => k !== i), { opacity: 0.18, filter: 'grayscale(1) drop-shadow(0 18px 24px rgba(20,20,22,.1))', scale: 0.92, duration: 0.25 }, at)
        .to(q, { opacity: 1, filter: 'grayscale(0) drop-shadow(0 30px 40px rgba(20,20,22,.3))', scale: 1.12, duration: 0.25 }, at)
        .fromTo(caps[i], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.25 }, at + 0.05)
        .to(caps[i], { autoAlpha: 0, y: -30, duration: 0.2 }, at + 0.6);
    });
    tl.to(dq, { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, filter: 'grayscale(0) drop-shadow(0 18px 24px rgba(20,20,22,.2))', duration: 0.6 }, 4.15)
      .fromTo('.dc-final', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 4.55)
      .to('.dc-mark', { scale: 1.08, duration: 0.4 }, 4.6)
      .to('.dc-progress i', { scaleX: 1, duration: 5.1 }, 0);
    ScrollTrigger.create({ trigger: '.decode', start: 'top top', end: 'bottom bottom', scrub: 0.7, animation: tl });
    caps.forEach((c, i) => ScrollTrigger.create({ trigger: '.decode', start: () => `top+=${(0.9 + i * 0.8) / 5.1 * ($('.decode').offsetHeight - innerHeight)} top`, end: () => `top+=${(1.6 + i * 0.8) / 5.1 * ($('.decode').offsetHeight - innerHeight)} top`, onToggle: (s) => s.isActive && window.__setTone(TONES[[2, 0, 3, 4][i]]) }));
  }

  /* ---------------- system: two models on a real timetable ---------------- */
  (function models() {
    const box = $('.models'), grid = $('.tt-grid'), mode = $('.tt-mode');
    if (!box || !grid) return;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const T = [
      ['English', 'Maths', 'Science', 'Urdu', 'Maths'],
      ['Maths', 'Science', 'English', 'Maths', 'Islamiat'],
      ['Science', 'Urdu', 'Maths', 'Science', 'English'],
      ['Islamiat', 'English', 'Comp.', 'English', 'Science'],
      ['Urdu', 'Art', 'Islamiat', 'Sports', 'Urdu'],
    ];
    const TECH = { Maths: ['AI', '#f39a2a'], Science: ['IoT', '#13a5d4'] };
    const VR = { '2-3': 1, '1-1': 1 };
    let h = '<span></span>' + days.map((d) => `<span class="h">${d}</span>`).join('');
    T.forEach((row, r) => { h += `<span class="t">P${r + 1}</span>` + row.map((sub, c) => `<span class="tt-c" data-r="${r}" data-c="${c}" data-s="${sub}">${sub}</span>`).join(''); });
    grid.innerHTML = h;
    const cells = $$('.tt-c', grid), btns = $$('.mt', box), copies = $$('.mc', box);
    const ADD = ['3-2', '4-3']; // the two new AI & Robotics periods
    const paint = (m) => cells.forEach((el, k) => {
      const key = el.dataset.r + '-' + el.dataset.c, sub = el.dataset.s;
      el.classList.remove('new', 'int'); el.innerHTML = sub;
      if (m === 0 && ADD.includes(key)) { el.classList.add('new'); el.innerHTML = 'AI &amp; Robotics'; }
      if (m === 1 && TECH[sub]) {
        const [t, c] = VR[key] ? ['VR', '#e8474b'] : TECH[sub];
        el.classList.add('int'); el.innerHTML = `${sub}<i class="chip" style="--c:${c}">${t}</i>`;
      }
      if (!reduced && window.gsap) gsap.fromTo(el, { scale: 0.86, autoAlpha: 0.3 }, { scale: 1, autoAlpha: 1, duration: 0.7, delay: ((+el.dataset.r) + (+el.dataset.c)) * 0.04, ease: 'back.out(1.8)' });
    });
    let cur = -1, timer;
    const show = (m) => {
      if (m === cur) return; cur = m;
      box.classList.toggle('m1', m === 1);
      btns.forEach((b, k) => { b.classList.toggle('on', k === m); b.setAttribute('aria-selected', k === m); });
      copies.forEach((c, k) => c.classList.toggle('on', k === m));
      mode.textContent = m === 0 ? 'Path A · +2 new periods' : 'Path B · 0 new periods';
      paint(m);
    };
    // the timetable starts "before", then the chosen path upgrades it
    cells.forEach((el) => (el.innerHTML = el.dataset.s));
    const start = () => { show(0); timer = setInterval(() => show(1 - cur), 6000); };
    btns.forEach((b, i) => b.addEventListener('click', () => { clearInterval(timer); show(i); }));
    box.addEventListener('mouseenter', () => clearInterval(timer));
    if (window.ScrollTrigger) ScrollTrigger.create({ trigger: box, start: 'top 70%', once: true, onEnter: () => setTimeout(start, 700) });
    else start();
  })();

  /* ---------------- footer: live clocks, newsletter, hex, back to top ---------------- */
  (function footer() {
    const clocks = $$('.clock[data-tz]');
    const tick = () => clocks.forEach((c) => { try { c.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: c.dataset.tz }).format(new Date()); } catch (e) {} });
    tick(); setInterval(tick, 1000);
    const hex = $('.ft-hex');
    if (hex) {
      const ims = $$('img', hex), d = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
      hex.addEventListener('mouseenter', () => ims.forEach((im, i) => (im.style.transform = `translate(${d[i][0] * 7}px, ${d[i][1] * 7}px) rotate(${d[i][0] * d[i][1] * 6}deg)`)));
      hex.addEventListener('mouseleave', () => ims.forEach((im) => (im.style.transform = '')));
    }
    const top = $('.to-top');
    if (top) {
      top.addEventListener('click', () => go(0));
      const set = () => { const m = document.documentElement.scrollHeight - innerHeight; top.style.setProperty('--off', 113 * (1 - Math.min(1, scrollY / (m || 1)))); };
      addEventListener('scroll', set, { passive: true }); set();
    }
    const form = $('.ft-news');
    if (form) form.addEventListener('submit', () => { const b = $('.ft-ok', form); if (b) b.textContent = "You're in. The next lab note lands soon."; });
  })();

  /* ---------------- the logo as page progress ---------------- */
  (function hexprog() {
    const g = $('.hp-q'), n = $('.hp-n');
    if (!g) return;
    // pointy-top hexagon, cut into the four quadrants of the mark
    const R = 50, P = [0, 1, 2, 3, 4, 5].map((i) => { const a = (Math.PI / 3) * i - Math.PI / 2; return [Math.cos(a) * R, Math.sin(a) * R * 1.08]; });
    const [T, TR, BR, B, BL, TL] = P, mid = (u, v) => [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2];
    const L = mid(TL, BL), Rr = mid(TR, BR), O = [0, 0];
    const q = [[O, L, TL, T], [O, T, TR, Rr], [O, Rr, BR, B], [O, B, BL, L]];
    const C = ['#f39a2a', '#13a5d4', '#e8474b', '#7aa53c'];
    g.innerHTML = q.map((pts) => `<path d="M${pts.map((x) => x.join(' ')).join('L')}Z" fill="rgba(20,20,22,.06)"/>`).join('');
    const ps = $$('path', g), secs = $$('main > section');
    const upd = () => {
      const m = document.documentElement.scrollHeight - innerHeight, p = Math.min(1, scrollY / (m || 1));
      ps.forEach((el, i) => el.setAttribute('fill', p >= (i + 1) / 4 - 0.001 ? C[i] : p > i / 4 ? C[i] + '66' : 'rgba(20,20,22,.06)'));
      let k = 0; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.5) k = i; });
      n.textContent = String(k + 1).padStart(2, '0');
    };
    addEventListener('scroll', upd, { passive: true }); upd();
  })();

  /* ---------------- everything scroll-driven ---------------- */
  function motion() {
    if (reduced) { $$('.num').forEach((n) => (n.textContent = Number(n.dataset.to).toLocaleString('en-US'))); return; }
    $$('.split').forEach((el) => { if (el.closest('.decode')) return; gsap.from($$('.l > span', el), { yPercent: 110, duration: 1.5, ease, stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 86%' } }); });
    $$('.kicker').forEach((el) => { if (el.closest('.decode')) return; gsap.from(el, { autoAlpha: 0, x: -24, duration: 1.2, ease, scrollTrigger: { trigger: el, start: 'top 90%' } }); });
    $$('.num').forEach((el) => ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => count(el) }));
    [['.pl', '.pl-track'], ['.why-c', '.why-grid'], ['.hw', '.hw-grid'], ['.prog', '.prog-list'], ['.proof-nums > div', '.proof-nums'], ['.partners img', '.partners'], ['.person', '.team'], ['.door', '.door-grid'], ['.offices > div', '.offices'], ['.hw-strip span', '.hw-strip'], ['.values li', '.values']].forEach(([a, b]) =>
      gsap.from(a, { y: 70, autoAlpha: 0, duration: 1.4, ease, stagger: 0.08, scrollTrigger: { trigger: b, start: 'top 86%' } }));
    [['.models', '.models'], ['.compare', '.compare'], ['.ft-h', '.ft-cta'], ['.ft-actions > *', '.ft-actions'], ['.ft-grid > *', '.ft-grid'], ['.sec-cta', null]].forEach(([a, b]) => $$(a).length && gsap.from(a, { y: 60, autoAlpha: 0, duration: 1.4, ease, stagger: 0.08, scrollTrigger: { trigger: b || a, start: 'top 90%' } }));
    gsap.from('.accred', { y: 80, autoAlpha: 0, duration: 1.4, ease, scrollTrigger: { trigger: '.accred', start: 'top 85%' } });
    gsap.from('.quote p', { y: 60, autoAlpha: 0, duration: 1.6, ease, scrollTrigger: { trigger: '.quote', start: 'top 80%' } });

    // hero emblem drifts and opens as you leave the hero
    ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => (emScroll = s.progress) });
    gsap.to('.emblem', { yPercent: 18, scale: 0.86, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-copy', { yPercent: -16, autoAlpha: 0.15, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });

    decode();

    // belief: what others sell is struck out, what we transplant switches on
    ScrollTrigger.matchMedia({ '(min-width: 861px)': () => {
      const them = $$('.bl-them li'), us = $$('.bl-us li'), sign = $('.bl-sign'), hexI = $$('.bl-hex img'), n = them.length;
      const d = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
      const st = ScrollTrigger.create({ trigger: '.belief', start: 'top top', end: 'bottom bottom', scrub: 0.5, onUpdate: (s) => {
        const p = s.progress * 1.15;
        them.forEach((li, i) => { const x = Math.max(0, Math.min(1, (p - i / n * 0.8) * n / 0.8)); li.querySelector('span').style.setProperty('--x', x); li.classList.toggle('out', x > 0.98); });
        us.forEach((li, i) => li.classList.toggle('on', p > (i + 0.9) / n * 0.8));
        const gap = Math.max(0, 1 - p) * 12;
        hexI.forEach((im, i) => (im.style.transform = `translate(${d[i][0] * gap}px, ${d[i][1] * gap}px)`));
        sign.style.opacity = Math.max(0, Math.min(1, (p - 0.85) * 6));
        sign.style.transform = `translateY(${(1 - Math.min(1, Math.max(0, (p - 0.85) * 6))) * 20}px)`;
      } });
      return () => st.kill();
    } });
    gsap.from('.bl-head > *', { y: 50, autoAlpha: 0, duration: 1.4, ease, stagger: 0.1, scrollTrigger: { trigger: '.belief', start: 'top 70%' } });

    // hardware line art draws itself
    $$('.hw').forEach((h) => {
      const paths = $$('.st, .acc', h);
      paths.forEach((p) => { const L = p.getTotalLength ? p.getTotalLength() : 400; p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
      gsap.to(paths, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', stagger: 0.04, scrollTrigger: { trigger: h, start: 'top 80%' } });
      gsap.from($$('.led', h), { scale: 0, transformOrigin: 'center', duration: 0.6, ease: 'back.out(3)', stagger: 0.1, delay: 1.6, scrollTrigger: { trigger: h, start: 'top 80%' } });
      const drone = $('.drone', h); if (drone) gsap.to(drone, { y: -10, duration: 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });

    // ETM journey: the line draws, a pulse travels, stages light up
    ScrollTrigger.matchMedia({ '(min-width: 861px)': () => {
      const fg = $('.fl-fg'), L = fg.getTotalLength(), nodes = $$('.node');
      fg.style.strokeDasharray = L; fg.style.strokeDashoffset = L;
      const st = ScrollTrigger.create({ trigger: '.journey', start: 'top top', end: 'bottom bottom', scrub: 0.6, onUpdate: (s) => { const p = s.progress; fg.style.strokeDashoffset = L * (1 - p); nodes.forEach((n, i) => n.classList.toggle('on', p >= i / 5 + 0.02)); } });
      return () => st.kill();
    } });

    // six-step loop
    ScrollTrigger.matchMedia({ '(min-width: 861px)': () => {
      const prog = $('.lp-prog'), R = 120, C = 2 * Math.PI * R, pulse = $('.lp-pulse'), steps = $$('.ls'), nodesG = $('.lp-nodes');
      const names = ['Feasibility', 'D&I Hub', 'Curriculum', 'Teachers', 'M&E', 'Improve'];
      nodesG.innerHTML = names.map((n, i) => { const a = (i / 6) * Math.PI * 2 - Math.PI / 2, x = Math.cos(a) * R, y = Math.sin(a) * R, lx = Math.cos(a) * (R + 26), ly = Math.sin(a) * (R + 26); return `<circle class="lp-node" cx="${x}" cy="${y}" r="9"/><text class="lp-label" x="${lx}" y="${ly + 3}" text-anchor="${Math.abs(lx) < 5 ? 'middle' : lx > 0 ? 'start' : 'end'}">${n}</text>`; }).join('');
      const nodeEls = $$('.lp-node', nodesG);
      prog.style.strokeDasharray = C; prog.style.strokeDashoffset = C;
      let cur = -1;
      const st = ScrollTrigger.create({ trigger: '.loop', start: 'top top', end: 'bottom bottom', scrub: 0.6, onUpdate: (s) => {
        const p = s.progress, a = p * Math.PI * 2 - Math.PI / 2;
        prog.style.strokeDashoffset = C * (1 - p);
        pulse.setAttribute('cx', Math.cos(a) * R); pulse.setAttribute('cy', Math.sin(a) * R);
        const i = Math.min(5, Math.floor(p * 6));
        nodeEls.forEach((n, k) => n.classList.toggle('on', k <= i));
        if (i !== cur) { cur = i; steps.forEach((x, k) => x.classList.toggle('on', k === i)); $('.lc-n').textContent = String(i + 1).padStart(2, '0'); $('.lc-t').textContent = names[i]; gsap.fromTo('.loop-center', { scale: 0.9, autoAlpha: 0.4 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease }); }
      } });
      return () => st.kill();
    } });

    // doors heading
    gsap.from('.door b', { rotate: 90, duration: 1, ease, stagger: 0.1, scrollTrigger: { trigger: '.door-grid', start: 'top 85%' } });
  }

  /* ---------------- loader (logo only) → hero ---------------- */
  const heroIn = () => {
    root.style.overflow = ''; lenis && lenis.start();
    if (reduced) return;
    gsap.timeline({ defaults: { ease } })
      .from('.hero-h .ln > span', { yPercent: 115, duration: 1.6, stagger: 0.1 }, 0.1)
      .from('.tag, .hero-p, .hero-ctas', { y: 30, autoAlpha: 0, duration: 1.3, stagger: 0.1 }, 0.5)
      .from('.em-q', { scale: 0.4, autoAlpha: 0, duration: 1.6, stagger: 0.08, ease: 'back.out(1.4)' }, 0.2)
      .from('.orbit', { scale: 0.6, autoAlpha: 0, duration: 1.8, stagger: 0.1 }, 0.3)
      .from('.orbiter', { scale: 0, autoAlpha: 0, duration: 1, stagger: 0.07, ease: 'back.out(2)' }, 0.8)
      .from('.nav', { y: -30, autoAlpha: 0, duration: 1.2, clearProps: 'transform,opacity,visibility' }, 0.4)
      .from('.hero-foot', { autoAlpha: 0, y: 20, duration: 1.2 }, 1);
  };
  // never let a slow font or image hold the page: start after fonts/load, or after 4s at most
  const ready = Promise.race([Promise.all([document.fonts.ready, new Promise((r) => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true })))]), new Promise((r) => setTimeout(r, 4000))]);
  root.style.overflow = 'hidden'; lenis && lenis.stop();
  const loader = $('.loader');
  const dropLoader = () => { if (loader && loader.isConnected) loader.remove(); };
  if (reduced) { ready.then(() => { dropLoader(); motion(); heroIn(); buildSpine(); }); return; }
  const from = [[-260, -200, -40], [260, -220, 50], [-240, 230, 35], [250, 210, -45]];
  gsap.set('.ld-q', { x: (i) => from[i][0], y: (i) => from[i][1], rotate: (i) => from[i][2], autoAlpha: 0, scale: 0.7 });
  const lt = gsap.timeline();
  lt.to('.ld-q', { x: 0, y: 0, rotate: 0, scale: 1, autoAlpha: 1, duration: 1.3, ease: 'expo.out', stagger: 0.14 }, 0.15)
    .to('.ld-mark', { scale: 1.06, duration: 0.25, ease: 'power2.out' }, 1.35).to('.ld-mark', { scale: 1, duration: 0.6, ease: 'elastic.out(1,.5)' }, 1.6)
    .to('.ld-word', { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'expo.inOut' }, 1.3)
    .to('.ld-line', { scaleX: 1, duration: 2.2, ease: 'power2.inOut' }, 0.1);
  Promise.all([ready, new Promise((r) => setTimeout(r, 2500))]).then(() => {
    motion();
    gsap.timeline()
      .to('.ld-word', { y: -20, autoAlpha: 0, duration: 0.5, ease: 'power2.in' })
      .to('.ld-q', { x: (i) => dirs[i][0] * 30, y: (i) => dirs[i][1] * 30, autoAlpha: 0, duration: 0.6, ease: 'power3.in', stagger: 0.04 }, 0.1)
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, 0.45)
      .add(heroIn, 0.8)
      .add(() => { dropLoader(); ScrollTrigger.refresh(); buildSpine(); });
  });
  gsap.set(loader, { clipPath: 'inset(0 0 0% 0)' });
  addEventListener('load', () => setTimeout(() => { ScrollTrigger.refresh(); buildSpine(); }, 300));
  // late images change the layout: re-measure so every reveal fires at the right place
  let rf; $$('img').forEach((im) => { if (!im.complete) im.addEventListener('load', () => { clearTimeout(rf); rf = setTimeout(() => ScrollTrigger.refresh(), 200); }, { once: true }); });
  addEventListener('resize', () => { clearTimeout(window.__sp); window.__sp = setTimeout(buildSpine, 300); });
})();
