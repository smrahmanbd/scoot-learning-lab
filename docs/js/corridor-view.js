/* Whole-process animation: renders the waterfront corridor, runs the guided tour and draws the console.
   Two simulations run side by side from the same random seed: one on the fixed plan, one with the SCOOT-style controller. */
(function () {
  'use strict';
  const C = window.Corridor, JX = C.JX, XMAX = C.XMAX, DT = C.DT, STOP = C.SIDE_STOP;
  const cv = document.getElementById('stage'), ctx = cv.getContext('2d');
  const $ = id => document.getElementById(id);
  let W = 960, H = 540, dpr = 1;

  let F, S;
  function reset() { F = new C.World({ scoot: false, seed: 7 }); S = new C.World({ scoot: true, seed: 7 }); F.forceSurge = S.forceSurge = 0; for (let i = 0; i < 300 / DT; i++) { F.step(); S.step(); } hist.q.length = 0; hist.d.length = 0; secClock = 0; base = { t: 0, f: { n: 0, delay: 0 }, s: { n: 0, delay: 0 } }; }
  const hist = { q: [], d: [] }; let secClock = 0, base = null;
  let sel = { j: 1, k: 'eb' };

  // ---------------- scenery (generated once, deterministic) ----------------
  let seed = 20; const R = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const CC = { x: JX[1] + 58, y: 24, w: 46, h: 30 };                 // control centre
  const CROSS = [228, 442];
  const buildings = [], palms = [], parked = [], lamps = [], umbrellas = [], boats = [];
  (function build() {
    const edges = [-200].concat(JX).concat([XMAX + 200]);
    const pal = ['#efe6d6', '#e6dcc8', '#f3efe6', '#d9ccb4', '#eae3d5', '#d2c8b7', '#f1e9dc', '#dcd3c3'];
    for (let b = 0; b < edges.length - 1; b++) {
      const x0 = edges[b] + (b ? 9 : 0), x1 = edges[b + 1] - (b < edges.length - 2 ? 9 : 0);
      let y = 20;
      while (y < 660) {
        const cs = CROSS.find(c => y < c + 6 && y + 34 > c - 6); if (cs) { y = cs + 8; continue; }
        const depth = 18 + R() * 16; let x = x0 + 2 + R() * 4;
        while (x < x1 - 14) {
          const w = Math.min(x1 - x - 2, 16 + R() * 30), d = depth - R() * 6;
          const hit = x < CC.x + CC.w + 4 && x + w > CC.x - 4 && y < CC.y + CC.h + 4 && y + d > CC.y - 4;
          if (w > 10 && !hit) { if (R() < 0.1) buildings.push({ x, y, w, h: d, lot: true }); else buildings.push({ x, y, w, h: d, c: pal[(R() * pal.length) | 0], ht: 2 + R() * 7, ac: R() }); }
          x += w + 4 + R() * 6;
        }
        y += depth + 9 + R() * 4;
      }
    }
    for (let x = 14; x < XMAX; x += 26) { if (JX.some(j => Math.abs(x - j) < 26)) continue; palms.push({ x, y: 0, r: 2.6, a: R() * 6 }); }
    for (let x = 6; x < XMAX; x += 17 + R() * 9) { if (JX.some(j => Math.abs(x - j + 9) < 8)) continue; palms.push({ x, y: -14.5, r: 2.9 + R(), a: R() * 6 }); if (R() < 0.75) palms.push({ x: x + 5 + R() * 6, y: -40 - R() * 3, r: 2.7 + R(), a: R() * 6 }); }
    for (let x = 30; x < XMAX; x += 6.2) { if (JX.some(j => x > j - 34 && x < j + 30)) continue; if (R() < 0.62) parked.push({ x, y: 9.8, len: 4.3 + R() * 0.5, c: ['#f4f5f6', '#f4f5f6', '#e9eaec', '#c9ced3', '#8f979f', '#2b3138', '#b9432f', '#3d6fa8'][(R() * 8) | 0] }); }
    for (let x = 20; x < XMAX; x += 40) { lamps.push({ x, y: -9.6 }); lamps.push({ x: x + 20, y: 12.2 }); }
    for (let x = 12; x < XMAX; x += 9 + R() * 16) umbrellas.push({ x, y: -49 - R() * 9, c: ['#e2574c', '#f2b134', '#3d9bd1', '#ffffff', '#2fa37c'][(R() * 5) | 0] });
    for (let i = 0; i < 9; i++) boats.push({ x: R() * XMAX, y: -95 - R() * 150, a: R() * 6, sp: 0.6 + R() * 1.2, l: 7 + R() * 6 });
  })();
  const strollers = []; for (let i = 0; i < 70; i++) strollers.push({ x: R() * XMAX, y: -20 - R() * 18, dir: R() < 0.5 ? 1 : -1, sp: 0.8 + R() * 0.7, hue: (R() * 6) | 0 });
  const PED = ['#f2f2f2', '#2c3e50', '#c0392b', '#f4d03f', '#1abc9c', '#8e6e53'];

  // ---------------- camera ----------------
  const cam = { x: 1000, y: 45, z: 0.45 }, tgt = { x: 1000, y: 45, span: 2100 };
  let free = false;
  const SX = x => (x - cam.x) * cam.z + W / 2, SY = y => (y - cam.y) * cam.z + H / 2;
  function resize() {
    const r = cv.getBoundingClientRect(); dpr = Math.min(2, window.devicePixelRatio || 1);
    W = Math.max(320, r.width); H = Math.max(180, r.height); cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  }

  // ---------------- world drawing ----------------
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
  function drawWorld(Wd, now) {
    const z = cam.z, px = 1 / z, vx0 = cam.x - W / 2 / z - 30, vx1 = cam.x + W / 2 / z + 30, vy0 = cam.y - H / 2 / z - 30, vy1 = cam.y + H / 2 / z + 30;
    const vis = (x, m) => x > vx0 - (m || 0) && x < vx1 + (m || 0);
    const detail = z > 1.5, mid = z > 0.8;
    ctx.setTransform(dpr * z, 0, 0, dpr * z, dpr * (W / 2 - cam.x * z), dpr * (H / 2 - cam.y * z));
    // sea
    const g = ctx.createLinearGradient(0, vy0, 0, -60); g.addColorStop(0, '#1f6f97'); g.addColorStop(1, '#58b6cf');
    ctx.fillStyle = g; ctx.fillRect(vx0, vy0, vx1 - vx0, -58 - vy0);
    ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = Math.max(px, 0.35);
    for (let y = -70; y > vy0; y -= 11) { ctx.beginPath(); for (let x = Math.floor(vx0 / 30) * 30; x < vx1; x += 30) { const o = Math.sin(x * 0.05 + y + now * 0.8) * 6; ctx.moveTo(x + o, y); ctx.lineTo(x + o + 12, y + Math.sin(now + x) * 0.6); } ctx.stroke(); }
    boats.forEach(b => { const bx = ((b.x + now * b.sp) % (XMAX + 200)) - 100; if (!vis(bx, 20) || b.y < vy0) return; ctx.save(); ctx.translate(bx, b.y); ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(-b.l * 1.6, 0); ctx.lineTo(-b.l * 0.4, -1.4); ctx.lineTo(-b.l * 0.4, 1.4); ctx.fill(); ctx.fillStyle = '#fbfbf7'; ctx.beginPath(); ctx.moveTo(b.l / 2, 0); ctx.lineTo(-b.l / 2, -1.6); ctx.lineTo(-b.l / 2, 1.6); ctx.fill(); ctx.fillStyle = '#7a5a3a'; ctx.fillRect(-b.l / 4, -0.8, b.l / 3, 1.6); ctx.restore(); });
    // beach with a moving waterline
    ctx.fillStyle = '#ecdfb8'; ctx.beginPath(); ctx.moveTo(vx0, -42);
    for (let x = vx0; x <= vx1 + 8; x += 8) ctx.lineTo(x, -60 + Math.sin(x * 0.045) * 2.2 + Math.sin(now * 0.9 + x * 0.02) * 0.9);
    ctx.lineTo(vx1, -42); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = Math.max(px, 0.7); ctx.beginPath();
    for (let x = vx0; x <= vx1 + 8; x += 8) { const y = -60.4 + Math.sin(x * 0.045) * 2.2 + Math.sin(now * 0.9 + x * 0.02) * 0.9; x === vx0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
    if (mid) umbrellas.forEach(u => { if (!vis(u.x)) return; ctx.fillStyle = 'rgba(40,30,10,.18)'; ctx.beginPath(); ctx.arc(u.x + 0.8, u.y + 1, 1.5, 0, 7); ctx.fill(); ctx.fillStyle = u.c; ctx.beginPath(); ctx.arc(u.x, u.y, 1.5, 0, 7); ctx.fill(); });
    // promenade: paving, lawn, cycle track
    ctx.fillStyle = '#d8cdb9'; ctx.fillRect(vx0, -44, vx1 - vx0, 35.5);
    ctx.fillStyle = '#86b266'; for (let x = Math.floor(vx0 / 120) * 120; x < vx1; x += 120) { rr(x + 12, -38, 78, 10, 4); ctx.fill(); }
    ctx.fillStyle = '#b8684a'; ctx.fillRect(vx0, -24.5, vx1 - vx0, 3);
    if (detail) { ctx.strokeStyle = 'rgba(120,105,80,.25)'; ctx.lineWidth = px; ctx.beginPath(); for (let x = Math.floor(vx0 / 4) * 4; x < vx1; x += 4) { ctx.moveTo(x, -20); ctx.lineTo(x, -9); } ctx.stroke(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.moveTo(vx0, -23); ctx.lineTo(vx1, -23); ctx.stroke(); ctx.setLineDash([]); }
    // city ground and sidewalks
    ctx.fillStyle = '#cfc8ba'; ctx.fillRect(vx0, 8.5, vx1 - vx0, vy1 - 8.5);
    ctx.fillStyle = '#bfb8ab'; ctx.fillRect(vx0, -9.2, vx1 - vx0, 0.7); ctx.fillRect(vx0, 11, vx1 - vx0, 0.5);
    // roads
    ctx.fillStyle = '#41464d'; ctx.fillRect(vx0, -8.5, vx1 - vx0, 19.5);
    JX.forEach(x => { if (vis(x, 20)) { ctx.fillStyle = '#41464d'; ctx.fillRect(x - 3.8, 8.5, 7.6, vy1); ctx.fillStyle = '#bfb8ab'; ctx.fillRect(x - 4.4, 11.4, 0.6, vy1); ctx.fillRect(x + 3.8, 11.4, 0.6, vy1); } });
    CROSS.forEach(y => { if (y < vy1) { ctx.fillStyle = '#41464d'; ctx.fillRect(vx0, y - 4, vx1 - vx0, 8); } });
    ctx.fillStyle = '#4a5058'; ctx.fillRect(vx0, 8.5, vx1 - vx0, 2.5);        // parking lane
    // median
    ctx.fillStyle = '#a9a294'; let mx = vx0;
    JX.concat([XMAX + 400]).forEach(x => { if (x - 14 > mx) { rr(mx, -1.5, x - 14 - mx, 3, 1.4); ctx.fill(); ctx.fillStyle = '#9a8a67'; rr(mx + 1, -1, x - 16 - mx, 2, 1); ctx.fill(); ctx.fillStyle = '#a9a294'; } mx = x + 11; });
    // markings
    ctx.strokeStyle = '#e9e9e2'; ctx.lineWidth = Math.max(px * 0.8, 0.18);
    if (mid) { ctx.setLineDash([3, 6]); [-5, 5].forEach(y => { ctx.beginPath(); ctx.moveTo(Math.floor(vx0 / 9) * 9, y); ctx.lineTo(vx1, y); ctx.stroke(); }); ctx.setLineDash([]); }
    ctx.beginPath(); ctx.moveTo(vx0, -8.3); ctx.lineTo(vx1, -8.3); ctx.moveTo(vx0, 8.5); ctx.lineTo(vx1, 8.5); ctx.stroke();
    JX.forEach((x, j) => {
      if (!vis(x, 40)) return;
      ctx.fillStyle = '#41464d'; ctx.fillRect(x - 14, -8.5, 25, 17);
      ctx.fillStyle = '#ecece6'; ctx.fillRect(x - 13.6, 1.6, 0.5, 6.9); ctx.fillRect(x + 10.1, -8.4, 0.5, 6.9); ctx.fillRect(x, 12, 3.6, 0.5);
      for (let y = -8; y < 8.2; y += 1.5) ctx.fillRect(x - 11.4, y, 3.2, 0.8);
      if (mid) { ctx.strokeStyle = '#e9e9e2'; ctx.lineWidth = 0.16; ctx.setLineDash([2.5, 4]); ctx.beginPath(); ctx.moveTo(x, 13); ctx.lineTo(x, vy1); ctx.stroke(); ctx.setLineDash([]); }
    });
    // detector loops
    Wd.nodes.forEach(n => ['eb', 'wb', 'side'].forEach(k => loopRects(n, k).forEach((q, li) => { if (!vis(q.x, 10)) return; const on = n.links[k].occ[li]; ctx.strokeStyle = on ? '#ffd24a' : 'rgba(210,220,230,.55)'; ctx.lineWidth = Math.max(px * 1.2, 0.16); ctx.strokeRect(q.x, q.y, q.w, q.h); if (on) { ctx.fillStyle = 'rgba(255,210,74,.3)'; ctx.fillRect(q.x, q.y, q.w, q.h); } })));
    // buildings
    buildings.forEach(b => {
      if (!vis(b.x + b.w / 2, b.w) || b.y > vy1) return;
      if (b.lot) { ctx.fillStyle = '#595e66'; ctx.fillRect(b.x, b.y, b.w, b.h); if (mid) { ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 0.14; ctx.beginPath(); for (let x = b.x + 2.6; x < b.x + b.w; x += 2.6) { ctx.moveTo(x, b.y); ctx.lineTo(x, b.y + 5); ctx.moveTo(x, b.y + b.h); ctx.lineTo(x, b.y + b.h - 5); } ctx.stroke(); } return; }
      ctx.fillStyle = 'rgba(25,28,38,.26)'; ctx.fillRect(b.x + b.ht * 0.5, b.y + b.ht * 0.7, b.w, b.h);
      ctx.fillStyle = b.c; ctx.fillRect(b.x, b.y, b.w, b.h);
      if (mid) { ctx.strokeStyle = 'rgba(90,80,60,.35)'; ctx.lineWidth = Math.max(px, 0.3); ctx.strokeRect(b.x + 0.6, b.y + 0.6, b.w - 1.2, b.h - 1.2); }
      if (detail) { ctx.fillStyle = '#b5b9bd'; for (let i = 0; i < 3; i++) ctx.fillRect(b.x + 2 + i * 3.4 + b.ac * 4, b.y + 2 + b.ac * (b.h - 7), 2, 1.6); ctx.fillStyle = '#9fb6c4'; ctx.fillRect(b.x + b.w - 6, b.y + 2.4, 3.4, 3.4); }
    });
    // control centre
    if (vis(CC.x, 80)) { ctx.fillStyle = 'rgba(25,28,38,.28)'; ctx.fillRect(CC.x + 4, CC.y + 5.6, CC.w, CC.h); ctx.fillStyle = '#dfe7ee'; ctx.fillRect(CC.x, CC.y, CC.w, CC.h); ctx.fillStyle = '#0d5a3a'; ctx.fillRect(CC.x, CC.y, CC.w, 4); ctx.fillStyle = '#8fa6b8'; ctx.fillRect(CC.x + 4, CC.y + 8, CC.w - 8, CC.h - 12); ctx.fillStyle = '#e8eef2'; ctx.beginPath(); ctx.arc(CC.x + CC.w - 9, CC.y + 15, 3.4, 0, 7); ctx.fill(); ctx.strokeStyle = '#6c7d8b'; ctx.lineWidth = 0.3; ctx.stroke(); }
    // cabinets
    JX.forEach(x => { if (!vis(x)) return; ctx.fillStyle = 'rgba(20,25,35,.3)'; ctx.fillRect(x + 6.9, 13.3, 1.6, 1); ctx.fillStyle = '#8c959d'; ctx.fillRect(x + 6.5, 12.8, 1.6, 1); });
    // parked cars
    parked.forEach(p => { if (vis(p.x)) car(p.x + p.len / 2, p.y, 0, p.len, 1.8, p.c, false, false, detail); });
    // moving vehicles
    const drawV = (v, x, y, a) => { if (vis(x, 16)) car(x, y, a, v.len, v.wid, v.color, v.brake, v.bus, detail, mid); };
    Wd.eb.forEach(L => L.veh.forEach(v => drawV(v, v.s, L.y + v.lat, v.lat ? -Math.sign(v.lat) * 0.08 : 0)));
    Wd.wb.forEach(L => L.veh.forEach(v => drawV(v, XMAX - v.s, L.y + v.lat, Math.PI + (v.lat ? Math.sign(v.lat) * 0.08 : 0))));
    Wd.side.forEach((L, j) => L.veh.forEach(v => drawV(v, JX[j] + 1.75, 12 + (STOP - v.s), -Math.PI / 2)));
    Wd.turners.forEach(t => { const p = C.turnPos(t); drawV(t.v, p.x, p.y, p.a); });
    // people
    if (mid) {
      const person = (x, y, hue) => { ctx.fillStyle = 'rgba(20,25,35,.28)'; ctx.beginPath(); ctx.ellipse(x + 0.35, y + 0.45, 0.42, 0.3, 0, 0, 7); ctx.fill(); ctx.fillStyle = PED[hue]; ctx.beginPath(); ctx.arc(x, y, 0.42, 0, 7); ctx.fill(); ctx.fillStyle = '#3a2c22'; ctx.beginPath(); ctx.arc(x, y, 0.2, 0, 7); ctx.fill(); };
      Wd.peds.forEach(p => { if (vis(p.x)) person(p.x, p.y, p.hue); });
      strollers.forEach(s => { const x = (((s.x + now * s.sp * s.dir) % XMAX) + XMAX) % XMAX; if (vis(x)) person(x, s.y, s.hue); });
    }
    // palms and lamps
    palms.forEach(p => {
      if (!vis(p.x, 6)) return;
      ctx.fillStyle = 'rgba(20,30,20,.25)'; ctx.beginPath(); ctx.arc(p.x + 1.4, p.y + 1.9, p.r * 0.9, 0, 7); ctx.fill();
      if (!mid) { ctx.fillStyle = '#4c8a43'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.85, 0, 7); ctx.fill(); return; }
      ctx.lineCap = 'round';
      for (let i = 0; i < 9; i++) { const a = p.a + i * 0.698 + Math.sin(now * 0.7 + p.x) * 0.03; ctx.strokeStyle = i % 2 ? '#3f7d3a' : '#5c9d4a'; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.quadraticCurveTo(p.x + Math.cos(a) * p.r * 0.6, p.y + Math.sin(a) * p.r * 0.6, p.x + Math.cos(a + 0.25) * p.r, p.y + Math.sin(a + 0.25) * p.r); ctx.stroke(); }
      ctx.lineCap = 'butt'; ctx.fillStyle = '#6b4f2f'; ctx.beginPath(); ctx.arc(p.x, p.y, 0.45, 0, 7); ctx.fill();
    });
    if (detail) lamps.forEach(l => { if (!vis(l.x)) return; ctx.fillStyle = '#5b6470'; ctx.beginPath(); ctx.arc(l.x, l.y, 0.28, 0, 7); ctx.fill(); ctx.strokeStyle = '#5b6470'; ctx.lineWidth = 0.18; ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(l.x, l.y + (l.y < 0 ? 2.4 : -2.4)); ctx.stroke(); });
    // signal heads
    Wd.nodes.forEach(n => { if (!vis(n.x, 30)) return; head(n.x - 13.4, 9.6, Wd.lamp(n.j, false), z); head(n.x + 10.4, -9.9, Wd.lamp(n.j, false), z); head(n.x + 4.9, 12.4, Wd.lamp(n.j, true), z); });
  }
  function loopRects(n, k) {
    const L = n.links[k];
    if (k === 'eb') return C.EB_Y.map(y => ({ x: L.detS, y: y - 1.2, w: 2, h: 2.4 }));
    if (k === 'wb') return C.WB_Y.map(y => ({ x: XMAX - L.detS - 2, y: y - 1.2, w: 2, h: 2.4 }));
    return [{ x: n.x + 0.55, y: 12 + (STOP - L.detS) - 2, w: 2.4, h: 2 }];
  }
  function loopCentre(n, k) { const q = loopRects(n, k); return { x: q[0].x + q[0].w / 2, y: k === 'side' ? q[0].y + 1 : (q[0].y + q[q.length - 1].y) / 2 + 1.2 }; }
  function car(x, y, a, len, wid, color, brake, bus, detail, mid) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); const k = Math.max(1, 2.6 / (wid * cam.z)); if (k > 1) { ctx.translate(-len / 2, 0); ctx.scale(k, k); ctx.translate(len / 2, 0); }
    ctx.fillStyle = 'rgba(15,18,25,.3)'; rr(-len + 0.35, -wid / 2 + 0.45, len, wid, 0.6); ctx.fill();
    ctx.fillStyle = color; rr(-len, -wid / 2, len, wid, bus ? 0.5 : 0.75); ctx.fill();
    if (mid !== false) {
      if (bus) { ctx.fillStyle = '#e9f1f1'; rr(-len + 0.6, -wid / 2 + 0.3, len - 1.6, wid - 0.6, 0.3); ctx.fill(); ctx.fillStyle = '#9fb3b3'; ctx.fillRect(-len * 0.7, -0.5, 1.6, 1); ctx.fillRect(-len * 0.35, -0.5, 1.6, 1); ctx.fillStyle = '#1b2a33'; ctx.fillRect(-0.9, -wid / 2 + 0.25, 0.5, wid - 0.5); }
      else { ctx.fillStyle = 'rgba(22,30,40,.82)'; rr(-len * 0.78, -wid / 2 + 0.22, len * 0.52, wid - 0.44, 0.45); ctx.fill(); ctx.fillStyle = color; rr(-len * 0.66, -wid / 2 + 0.3, len * 0.26, wid - 0.6, 0.3); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(-len * 0.66, -wid / 2 + 0.3, len * 0.26, 0.35); }
      if (detail) { ctx.fillStyle = '#fff6cf'; ctx.fillRect(-0.22, -wid / 2 + 0.15, 0.22, 0.42); ctx.fillRect(-0.22, wid / 2 - 0.57, 0.22, 0.42); }
      if (brake) { ctx.fillStyle = '#ff3b2f'; ctx.fillRect(-len, -wid / 2 + 0.12, 0.3, 0.5); ctx.fillRect(-len, wid / 2 - 0.62, 0.3, 0.5); }
    }
    ctx.restore();
  }
  function head(x, y, lamp, z) {
    const s = Math.max(1, 5 / z / 3.2), w = 1.1 * s, h = 3.1 * s;
    ctx.fillStyle = 'rgba(15,18,25,.3)'; rr(x - w / 2 + 0.3 * s, y - h / 2 + 0.4 * s, w, h, 0.3 * s); ctx.fill();
    ctx.fillStyle = '#11181f'; rr(x - w / 2, y - h / 2, w, h, 0.3 * s); ctx.fill();
    [['r', '#ff4133'], ['a', '#ffb62e'], ['g', '#2fe07a']].forEach((c, i) => { const on = lamp === c[0], cy = y - h / 2 + (0.55 + i) * s; if (on) { ctx.fillStyle = c[1] + '55'; ctx.beginPath(); ctx.arc(x, cy, 1.25 * s, 0, 7); ctx.fill(); } ctx.fillStyle = on ? c[1] : '#39424c'; ctx.beginPath(); ctx.arc(x, cy, 0.4 * s, 0, 7); ctx.fill(); });
  }

  // ---------------- screen-space annotations ----------------
  function ui() { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function fs(n) { return Math.max(11, Math.min(17, n * W / 1100)); }
  function tag(wx, wy, text, o) {
    o = o || {}; if (SX(wx) < -20 || SX(wx) > W + 20 || SY(wy) < -20 || SY(wy) > H + 20) return; const x = SX(wx) + (o.dx || 0), y = SY(wy) + (o.dy || 0), f = fs(o.size || 14);
    ctx.font = '600 ' + f + 'px Barlow, system-ui, sans-serif'; const lines = String(text).split('\n'), tw = Math.max.apply(null, lines.map(l => ctx.measureText(l).width)), pw = 9, bh = lines.length * f * 1.25 + 9;
    let bx = o.align === 'left' ? x : o.align === 'right' ? x - tw - pw * 2 : x - tw / 2 - pw, by = y - bh / 2;
    bx = Math.max(6, Math.min(W - tw - pw * 2 - 6, bx)); by = Math.max(6, Math.min(H - bh - 6, by));
    if (o.from) { ctx.strokeStyle = o.bg || '#0b2a3d'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(SX(o.from[0]), SY(o.from[1])); ctx.lineTo(Math.max(bx, Math.min(bx + tw + pw * 2, SX(o.from[0]))), by + (SY(o.from[1]) < by ? 0 : bh)); ctx.stroke(); ctx.fillStyle = o.bg || '#0b2a3d'; ctx.beginPath(); ctx.arc(SX(o.from[0]), SY(o.from[1]), 3.5, 0, 7); ctx.fill(); }
    ctx.globalAlpha = o.alpha == null ? 1 : o.alpha; ctx.fillStyle = o.bg || '#0b2a3d'; rr(bx, by, tw + pw * 2, bh, 7); ctx.fill();
    ctx.fillStyle = o.fg || '#fff'; ctx.textBaseline = 'middle'; lines.forEach((l, i) => ctx.fillText(l, bx + pw, by + 4.5 + f * 0.62 + i * f * 1.25)); ctx.globalAlpha = 1;
  }
  function ring(wx, wy, rM, color, now) { const r = Math.max(10, rM * cam.z) * (1 + 0.06 * Math.sin(now * 5)); ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(SX(wx), SY(wy), r, 0, 7); ctx.stroke(); }
  function box(x0, y0, x1, y1, color, label) { ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.setLineDash([10, 7]); rr(SX(x0), SY(y0), (x1 - x0) * cam.z, (y1 - y0) * cam.z, 14); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = color + '22'; ctx.fill(); if (label) tag(x0, y1, label, { bg: color, align: 'left', dy: 18, dx: 4 }); }
  function dim(x0, x1, y, text) { const a = SX(x0), b = SX(x1), yy = SY(y); ctx.strokeStyle = '#0b2a3d'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a, yy); ctx.lineTo(b, yy); ctx.moveTo(a, yy - 7); ctx.lineTo(a, yy + 7); ctx.moveTo(b, yy - 7); ctx.lineTo(b, yy + 7); ctx.stroke(); tag((x0 + x1) / 2, y, text, { dy: -16 }); }
  function nodeNames(extra) { JX.forEach((x, j) => tag(x, -8, 'J' + (j + 1) + (extra ? extra(j) : ''), { dy: -30, bg: '#0d5a3a' })); }
  function fibre(now, upTo) {
    ctx.strokeStyle = '#ff9d2e'; ctx.lineWidth = 3; ctx.setLineDash([9, 7]); ctx.lineDashOffset = -now * 40;
    JX.forEach((x, j) => { if (j > upTo) return; ctx.beginPath(); ctx.moveTo(SX(x + 7.3), SY(13.3)); ctx.lineTo(SX(x + 7.3), SY(16.5)); ctx.lineTo(SX(CC.x + CC.w / 2), SY(16.5)); ctx.lineTo(SX(CC.x + CC.w / 2), SY(CC.y)); ctx.stroke(); });
    ctx.setLineDash([]); ctx.lineDashOffset = 0;
  }
  function scaleBar() {
    const opts = [10, 20, 50, 100, 200, 500], m = opts.find(v => v * cam.z > 70) || 500, x = W - 22 - m * cam.z, y = H - 20;
    ctx.fillStyle = 'rgba(255,255,255,.85)'; rr(x - 8, y - 20, m * cam.z + 16, 28, 6); ctx.fill(); ctx.strokeStyle = '#17263a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x, y); ctx.lineTo(x + m * cam.z, y); ctx.lineTo(x + m * cam.z, y - 4); ctx.stroke();
    ctx.fillStyle = '#17263a'; ctx.font = '600 12px Barlow, system-ui, sans-serif'; ctx.textBaseline = 'alphabetic'; ctx.fillText(m + ' m', x + 4, y - 6);
  }

  // ---------------- helpers used by chapters ----------------
  const stopX = (j, k) => k === 'eb' ? JX[j] - 13 : JX[j] + 10;
  const modelVeh = (Wd, j, k) => { const L = Wd.nodes[j].links[k]; return L.q / Math.max(1.5, L.lpv); };
  let track = null, counts0 = null;
  function pickTrack() { const vs = F.eb[0].veh.concat(F.eb[1].veh).filter(v => v.s > JX[0] + 40 && v.s < JX[0] + 75 && v.v > 6 && v.exit < 0); if (vs.length) track = { v: vs[0], t0: F.t, done: null }; }
  function vehXY(Wd, v) { return { x: v.s, y: v.lane.y + v.lat }; }

  // ---------------- the guided tour ----------------
  const STEPS7 = ['Nodes, links, stages', 'Detector location', 'Communications', 'Cycle time limits', 'Link validation', 'Extra facilities', 'Evaluation'];
  const chapters = [
    { kicker: 'The street', title: 'A waterfront road with four signals', view: 'F', speed: 1.5, dur: 14,
      steps: [[0, 'Sea on one side, city on the other. Four junctions with traffic signals, J1 to J4, sit along the road.', { x: 1000, y: 45, span: 2100 }],
              [7, 'Today the signals follow a <b>fixed plan</b>: the same timings all day, whatever the traffic does.', { x: 640, y: 30, span: 1150 }]],
      draw() { nodeNames(); } },
    { kicker: 'Existing conditions', title: 'First, watch the street as it is', view: 'F', speed: 1, dur: 36,
      enter() { counts0 = F.nodes[1].links.eb.vehTotal + '|' + F.nodes[1].links.wb.vehTotal + '|' + F.nodes[1].links.side.vehTotal; track = null; },
      steps: [[0, 'Before choosing any equipment, engineers record how the street behaves today.', { x: JX[1] - 25, y: 6, span: 230 }],
              [5, '<b>Count the traffic</b> on every approach. The counts show which junction is busiest.', { x: JX[1] - 25, y: 10, span: 250 }],
              [12, '<b>Measure the queue</b> at red. Later, the detector must sit beyond the end of this queue.', { x: JX[1] - 60, y: 4, span: 240 }],
              [20, '<b>Time a car</b> from the start of the link to the stop line. SCOOT needs this cruise time.', { x: (JX[0] + JX[1]) / 2, y: 4, span: 400 }],
              [29, 'Note the <b>people crossing</b> and the <b>cars parked</b> at the kerb. Both limit what the signals can do.', { x: JX[1] - 30, y: 4, span: 170 }]],
      draw(tl, si, now) {
        const c0 = counts0.split('|').map(Number), n = F.nodes[1];
        if (si === 1) { tag(JX[1] - 60, 5, 'Eastbound: ' + (n.links.eb.vehTotal - c0[0]) + ' counted', { dy: 44 }); tag(JX[1] + 40, -5, 'Westbound: ' + (n.links.wb.vehTotal - c0[1]) + ' counted', { dy: -44 }); tag(JX[1] + 1.75, 40, 'Side street: ' + (n.links.side.vehTotal - c0[2]) + ' counted', { dx: 80 }); }
        if (si === 2) { const q = F.realQueue(1, 'eb'), sx = stopX(1, 'eb'); if (q.n > 0) { dim(sx - q.back, sx, 12, 'Queue: ' + q.n + ' cars, ' + Math.round(q.back) + ' m'); } else tag(sx - 30, 12, 'Green: the queue has cleared', {}); }
        if (si === 3) {
          if (!track || (track.done && F.t - track.done.at > 4)) pickTrack();
          if (track) { const v = track.v; if (!track.done && v.s >= JX[1] - 13.5) track.done = { at: F.t, tt: F.t - track.t0 }; if (v.lane) { const p = vehXY(F, v); ring(p.x - v.len / 2, p.y, 4, '#ffd24a', now); tag(p.x, p.y, track.done ? 'Arrived: ' + track.done.tt.toFixed(0) + ' s' : 'Stopwatch: ' + (F.t - track.t0).toFixed(0) + ' s', { dy: -34, bg: '#8a5f00' }); } }
        }
        if (si === 4) { ring(JX[1] - 9.8, 0, 11, '#ffd24a', now); tag(JX[1] - 9.8, -9, 'Pedestrian crossing', { dy: -50 }); tag(JX[1] - 60, 9.8, 'Parked cars', { dy: 34, from: [JX[1] - 60, 9.8] }); }
      } },
    { kicker: 'How SCOOT sees', title: 'A detector far up the road', view: 'S', speed: 1, dur: 27, panel: 'p1',
      steps: [[0, 'SCOOT watches each approach through one <b>detector</b>, placed far upstream of the signal it feeds.', { x: JX[0] + 110, y: 4, span: 330 }],
              [8, 'Four times a second the loop reports: covered or empty. Each “covered” tick is one unit of traffic, an <b>LPU</b>.', { x: JX[0] + 52, y: 4, span: 120 }],
              [17, 'Added up through the signal cycle, the ticks draw a picture of <b>when</b> traffic arrives: the cyclic flow profile. It is the first chart below.', { x: JX[0] + 60, y: 4, span: 150 }]],
      draw(tl, si, now) {
        const n = S.nodes[1], L = n.links.eb, c = loopCentre(n, 'eb');
        ring(c.x, c.y, 5.5, L.flash > 0.2 ? '#ffd24a' : '#ffffff', now);
        tag(c.x, c.y, si === 0 ? 'Detector for J2 eastbound' : 'LPUs counted: ' + L.lpuTotal, { dy: 58, bg: '#8a5f00' });
        if (si === 0) { tag(stopX(1, 'eb'), 5, 'J2 stop line', { dy: 44, from: [stopX(1, 'eb'), 5] }); dim(L.detS, stopX(1, 'eb'), -13, Math.round(L.dist) + ' m, about ' + L.jt + ' s of driving'); }
      } },
    { kicker: 'How SCOOT sees', title: 'From detector ticks to a predicted queue', view: 'S', speed: 1, dur: 27, panel: 'p2',
      steps: [[0, 'SCOOT knows the cruise time to the stop line, so it knows <b>when</b> each car will arrive there.', { x: JX[0] + 150, y: 4, span: 330 }],
              [9, 'Arrivals during red join a queue in SCOOT’s model. During green the model queue drains at a known rate.', { x: JX[1] - 75, y: 4, span: 230 }],
              [18, 'The model queue is a <b>prediction</b>: there is no camera at the stop line. Compare it with the real queue.', { x: JX[1] - 75, y: 4, span: 230 }]],
      draw(tl, si) {
        const sx = stopX(1, 'eb'), q = S.realQueue(1, 'eb');
        tag(sx - 45, -9, 'SCOOT predicts: ' + modelVeh(S, 1, 'eb').toFixed(0) + ' cars', { dy: -46, bg: '#0d5a3a' });
        tag(sx - 45, 9, 'On the street: ' + q.n + ' cars', { dy: 46 });
      } },
    { kicker: 'How SCOOT decides', title: 'Three small decisions, again and again', view: 'S', speed: 6, dur: 33, panel: 'p3',
      steps: [[0, '<b>Split.</b> At each junction SCOOT moves a few seconds of green towards the busier approach.', { x: 575, y: 30, span: 900 }],
              [11, '<b>Offset.</b> Once per cycle it tries starting the green 4 seconds earlier or later, so that platoons meet a green light.', { x: 575, y: 30, span: 900 }],
              [22, '<b>Cycle time.</b> Every few minutes it lengthens or shortens the cycle for the whole group, aiming for about 90% use at the busiest junction.', { x: 575, y: 30, span: 900 }]],
      draw() {
        nodeNames(j => ' · ' + S.nodes[j].C + ' s cycle');
        const col = { split: '#1d6fb8', offset: '#8a3fa0', cycle: '#b3541e' }, seen = {};
        for (let i = S.events.length - 1; i >= 0; i--) { const e = S.events[i]; if (S.t - e.t > 16) break; const k = e.node + e.kind; if (seen[k]) continue; seen[k] = 1; const row = e.kind === 'split' ? 0 : e.kind === 'offset' ? 1 : 2; tag(JX[e.node], 14, e.text, { dy: 30 + row * 30, bg: col[e.kind], alpha: Math.min(1, (16 - (S.t - e.t)) / 5) }); }
      } },
    { kicker: 'Network', title: 'Which junctions belong together?', view: 'S', speed: 3, dur: 27,
      steps: [[0, 'Junctions that are <b>close together</b> pass platoons of cars to each other. They gain from working as a team.', { x: 1000, y: 45, span: 2100 }],
              [9, 'J1, J2 and J3 form one <b>region</b>. They share one cycle time so their greens can stay in step.', { x: 1000, y: 45, span: 2100 }],
              [18, 'The 850 m link is too long: platoons spread out before J4. The <b>boundary</b> goes here and J4 runs its own cycle.', { x: 1000, y: 45, span: 2100 }]],
      draw(tl, si) {
        nodeNames();
        dim(JX[0], JX[1], -85, '300 m'); dim(JX[1], JX[2], -85, '350 m'); dim(JX[2], JX[3], -85, '850 m');
        if (si >= 1) box(JX[0] - 90, -30, JX[2] + 90, 70, '#0d5a3a', 'Region A · one cycle: ' + S.regions[0].C + ' s');
        if (si >= 2) { box(JX[3] - 90, -30, JX[3] + 90, 70, '#1d6fb8', 'Region B · ' + S.regions[1].C + ' s'); const bx = (JX[2] + JX[3]) / 2; ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 4; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(SX(bx), SY(-45)); ctx.lineTo(SX(bx), SY(80)); ctx.stroke(); ctx.setLineDash([]); tag(bx, -45, 'Boundary', { dy: -18, bg: '#c0392b' }); }
      } },
    { kicker: 'Design', title: 'Seven design steps, in order', view: 'S', speed: 3, dur: 49, stepper: true,
      steps: [[0, '<b>1 · Nodes, links, stages.</b> List every junction (node), every approach (link) and the order of the greens (stages).', { x: 575, y: 30, span: 950 }],
              [7, '<b>2 · Detector location.</b> One detector per link, far upstream and clear of parked cars.', { x: 575, y: 30, span: 950 }],
              [14, '<b>3 · Communications.</b> Connect every junction to the control centre. Data travels both ways every second.', { x: 575, y: 40, span: 950 }],
              [21, '<b>4 · Cycle time limits.</b> Set the shortest and longest cycle allowed. The shortest must still let pedestrians cross.', { x: 575, y: 30, span: 950 }],
              [28, '<b>5 · Link validation.</b> On street, tune each link until SCOOT’s queue matches the real one.', { x: 575, y: 30, span: 950 }],
              [35, '<b>6 · Extra facilities.</b> Add extras where needed, such as bus priority and pedestrian priority.', { x: 575, y: 30, span: 950 }],
              [42, '<b>7 · Evaluation.</b> Compare delay before and after, in matching conditions. It is the last chart below.', { x: 575, y: 30, span: 950 }]],
      draw(tl, si, now) {
        if (si === 0) { nodeNames(); for (let j = 0; j < 3; j++) { tag(JX[j] - 60, 5, 'link →', { dy: 26, bg: '#1d6fb8', size: 12 }); tag(JX[j] + 60, -5, '← link', { dy: -26, bg: '#1d6fb8', size: 12 }); tag(JX[j] + 1.75, 60, 'link ↑', { dx: 34, bg: '#1d6fb8', size: 12 }); } }
        if (si === 1) S.nodes.forEach(n => ['eb', 'wb', 'side'].forEach(k => { const c = loopCentre(n, k); ring(c.x, c.y, 6, '#ffd24a', now); }));
        if (si === 2) { fibre(now, 3); tag(CC.x + CC.w / 2, CC.y + CC.h, 'Control centre', { dy: 18, bg: '#b3541e' }); }
        if (si === 3) { box(JX[0] - 90, -30, JX[2] + 90, 70, '#0d5a3a', 'Region A · cycle may run from ' + S.regions[0].min + ' to ' + S.regions[0].max + ' s'); JX.slice(0, 3).forEach(x => tag(x - 9.8, 0, 'crossing needs 14 s', { dy: -40, size: 12 })); }
        if (si === 4) for (let j = 0; j < 3; j++) { const m = modelVeh(S, j, 'eb'), r = S.realQueue(j, 'eb').n; tag(JX[j] - 40, 5, 'model ' + m.toFixed(0) + ' · street ' + r + (Math.abs(m - r) <= 2 ? '  ✓' : ''), { dy: 34, bg: Math.abs(m - r) <= 2 ? '#0d5a3a' : '#8a5f00' }); }
        if (si === 5) { S.eb.concat(S.wb).forEach(L => L.veh.forEach(v => { if (v.bus) { const x = L.kind === 'eb' ? v.s : XMAX - v.s; ring(x, L.y, 9, '#1fd0d0', now); tag(x, L.y, 'bus', { dy: -26, bg: '#167a7a', size: 12 }); } })); JX.slice(0, 3).forEach(x => ring(x - 9.8, 0, 12, '#ffd24a', now)); }
        if (si === 6) nodeNames();
      } },
    { kicker: 'Hardware', title: 'What gets installed', view: 'S', speed: 1, dur: 27,
      steps: [[0, '<b>Detectors:</b> wire loops cut into the road surface, one site per link. Each is wired to the nearest cabinet.', { x: JX[1], y: 6, span: 190 }],
              [9, '<b>Controller cabinet:</b> switches the lamps and holds a fallback plan. An outstation unit beside it talks to the centre every second.', { x: JX[1] + 8, y: 10, span: 110 }],
              [18, '<b>Control centre:</b> the SCOOT computer, the operators’ screens and the store of past data, joined to the street by a data network.', { x: JX[1] + 50, y: 28, span: 260 }]],
      draw(tl, si, now) {
        const a = loopCentre(S.nodes[2], 'eb'), b = loopCentre(S.nodes[0], 'wb'), cab = [JX[1] + 7.3, 13.3];
        if (si === 0) { [a, b].forEach(c => { ring(c.x, c.y, 5.5, '#ffd24a', now); ctx.strokeStyle = '#ffd24a'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(SX(c.x), SY(c.y)); ctx.lineTo(SX(c.x), SY(12.2)); ctx.lineTo(SX(cab[0]), SY(12.2)); ctx.stroke(); ctx.setLineDash([]); }); tag(a.x, a.y, 'Loop for the J3 link', { dy: -52, bg: '#8a5f00' }); tag(b.x, b.y, 'Loop for the J1 link', { dy: -52, bg: '#8a5f00' }); tag(cab[0], cab[1], 'Cabinet', { dy: 40, from: cab }); }
        if (si === 1) { ring(cab[0], cab[1], 3, '#ffd24a', now); tag(cab[0], cab[1], 'Controller + outstation unit', { dy: 50, dx: 60, from: cab }); tag(JX[1] + 4.9, 12.4, 'Signal head', { dx: 110, dy: -40, from: [JX[1] + 4.9, 12.4] }); }
        if (si === 2) { fibre(now, 3); tag(CC.x + CC.w / 2, CC.y + CC.h / 2, 'Control centre\nserver · screens · data store', { bg: '#b3541e' }); tag(JX[1] + 30, 16.5, 'data network', { dy: -20, bg: '#b3541e', size: 12 }); }
      } },
    { kicker: 'Evaluation', title: 'Evening rush: fixed plan against SCOOT', view: 'S', speed: 30, dur: 48, panel: 'p4', rush: true,
      enter() { base = { t: S.t, f: { n: F.totals.n, delay: F.totals.delay }, s: { n: S.totals.n, delay: S.totals.delay } }; },
      steps: [[0, 'Now the test, in fast forward. Evening traffic builds, most of all westbound and out of the side street at J2.', { x: 640, y: 45, span: 1250 }],
              [11, 'The fixed plan cannot react. SCOOT gives the busy side street more green and stretches the cycle.', { x: JX[1], y: 45, span: 620 }],
              [23, 'Watch the delay chart below. Both lines rise in the rush. The two streets are the same; only the signal control differs.', { x: 640, y: 45, span: 1250 }],
              [35, '', { x: 1000, y: 45, span: 2100 }]],
      draw(tl, si) {
        nodeNames(j => ' · ' + S.nodes[j].C + ' s'); const r = result();
        if (si === 1) tag(JX[1] + 1.75, 70, 'Side green now ' + S.nodes[1].gB.toFixed(0) + ' s (fixed plan: 20 s)', { dx: 150, bg: '#1d6fb8', from: [JX[1] + 1.75, 60] });
        if (si === 3 && r) setCaption('Since the rush began in this run: <b>fixed plan ' + r.f.toFixed(0) + ' s</b> of delay per vehicle, <b>SCOOT ' + r.s.toFixed(0) + ' s</b>. This is a teaching simulation, not a forecast for any real road.');
      } },
  ];
  function result() { const fn = F.totals.n - base.f.n, sn = S.totals.n - base.s.n; if (fn < 20 || sn < 20) return null; return { f: (F.totals.delay - base.f.delay) / fn, s: (S.totals.delay - base.s.delay) / sn }; }

  // ---------------- state, controls ----------------
  let ch = 0, tl = 0, playing = true, stepIdx = -1, userSpeed = 1, viewSel = 'auto', rush = 'auto', lastCap = '';
  function setCaption(html) { if (html === lastCap) return; lastCap = html; $('capText').innerHTML = html; }
  function enter(i) {
    ch = (i + chapters.length) % chapters.length; tl = 0; stepIdx = -1; free = false; const c = chapters[ch]; if (c.enter) c.enter();
    $('capKicker').textContent = (ch + 1) + ' / ' + chapters.length + ' · ' + c.kicker; $('capTitle').textContent = c.title;
    document.querySelectorAll('.chip').forEach((b, k) => b.setAttribute('aria-current', k === ch ? 'step' : 'false'));
    document.querySelectorAll('.cpanel').forEach(p => p.classList.toggle('hot', p.id === c.panel));
    $('stepper').hidden = !c.stepper; $('tourBtn').hidden = true; $('ended').hidden = true;
  }
  function currentView() { return viewSel === 'auto' ? (free ? 'S' : chapters[ch].view) : viewSel; }

  // ---------------- console panels ----------------
  function prep(c) { const r = c.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); if (c.width !== Math.round(r.width * d)) { c.width = Math.round(r.width * d); c.height = Math.round(r.height * d); } const x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0); x.clearRect(0, 0, r.width, r.height); x.font = '12px Barlow, system-ui, sans-serif'; return { x, w: r.width, h: r.height }; }
  const T = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  function panels() {
    const Wd = currentView() === 'F' ? F : S, n = Wd.nodes[sel.j], L = n.links[sel.k], fg = T('--fg'), mu = T('--muted'), line = T('--line'), go = T('--go'), stop = T('--stop'), amber = T('--amber');
    // 1 profile
    let p = prep($('c1')), x = p.x; const nb = Math.ceil(n.C / C.BIN), bw = (p.w - 36) / nb, mx = Math.max(6, Math.max.apply(null, L.prof.slice(0, nb).concat(L.cur.slice(0, nb))) * 1.15), gLen = sel.k === 'side' ? n.gB : n.planA, g0 = sel.k === 'side' ? n.planA + C.INTER : 0;
    x.fillStyle = go + '33'; x.fillRect(30 + g0 / C.BIN * bw, 6, gLen / C.BIN * bw, p.h - 28);
    for (let b = 0; b < nb; b++) { const v = L.prof[b], hh = v / mx * (p.h - 34); x.fillStyle = amber; x.fillRect(30 + b * bw + 1, p.h - 22 - hh, Math.max(1, bw - 2), hh); const c = L.cur[b]; if (c) { x.strokeStyle = fg; x.lineWidth = 1.5; const ch2 = c / mx * (p.h - 34); x.strokeRect(30 + b * bw + 1, p.h - 22 - ch2, Math.max(1, bw - 2), ch2); } }
    x.strokeStyle = line; x.beginPath(); x.moveTo(30, p.h - 22); x.lineTo(p.w - 6, p.h - 22); x.stroke();
    const cur = Math.min(n.C, Wd.t - n.cycleStart); x.strokeStyle = stop; x.lineWidth = 2; x.beginPath(); x.moveTo(30 + cur / C.BIN * bw, 4); x.lineTo(30 + cur / C.BIN * bw, p.h - 22); x.stroke();
    x.fillStyle = mu; x.fillText('0 s', 30, p.h - 6); x.fillText(n.C + ' s', p.w - 34, p.h - 6); x.fillText('time in the cycle · shaded = green for this approach', 70, p.h - 6); x.save(); x.translate(12, p.h / 2 + 14); x.rotate(-Math.PI / 2); x.fillText('LPUs', 0, 0); x.restore();
    // 2 queue: model vs street
    p = prep($('c2')); x = p.x; const q = hist.q, m2 = Math.max(6, Math.max.apply(null, q.map(e => Math.max(e.m, e.r))) * 1.15), X = i => 30 + (p.w - 38) * i / 179, Y = v => 8 + (p.h - 32) * (1 - v / m2);
    x.strokeStyle = line; x.fillStyle = mu; [0, 0.5, 1].forEach(f => { const y = Y(m2 * f); x.beginPath(); x.moveTo(30, y); x.lineTo(p.w - 6, y); x.stroke(); x.fillText((m2 * f).toFixed(0), 8, y + 4); });
    [['r', fg, 2.5], ['m', go, 2.5]].forEach(s => { x.strokeStyle = s[1]; x.lineWidth = s[2]; x.beginPath(); q.forEach((e, i) => { const xx = X(i + 180 - q.length), yy = Y(e[s[0]]); i ? x.lineTo(xx, yy) : x.moveTo(xx, yy); }); x.stroke(); });
    x.fillStyle = fg; x.fillRect(34, p.h - 13, 14, 3); x.fillText('street', 52, p.h - 6); x.fillStyle = go; x.fillRect(100, p.h - 13, 14, 3); x.fillStyle = fg; x.fillText('SCOOT’s model · cars queued, last 3 minutes', 118, p.h - 6);
    // 3 timings
    p = prep($('c3')); x = p.x; const rowH = (p.h - 22) / 4, sc = (p.w - 150) / 112;
    Wd.nodes.forEach((nd, j) => {
      const y = 6 + j * rowH, C2 = nd.planA + nd.gB + 2 * C.INTER; x.fillStyle = fg; x.font = '600 12px Barlow, system-ui, sans-serif'; x.fillText('J' + (j + 1), 4, y + rowH / 2 + 3);
      let xx = 28; const seg = (len, col) => { x.fillStyle = col; x.fillRect(xx, y + 3, len * sc, rowH - 8); xx += len * sc; };
      seg(nd.planA, go); seg(C.INTER, amber); seg(nd.gB, '#3d86d6'); seg(C.INTER, amber);
      const tc = Math.min(C2, Wd.t - nd.cycleStart); x.fillStyle = fg; x.fillRect(28 + tc * sc - 1, y, 2, rowH - 2);
      x.fillStyle = fg; x.font = '12px Barlow, system-ui, sans-serif'; x.fillText(C2.toFixed(0) + ' s', p.w - 112, y + rowH / 2 + 3); x.fillStyle = mu; x.fillText(nd.gB.toFixed(0) + ' s side', p.w - 66, y + rowH / 2 + 3);
    });
    x.fillStyle = go; x.fillRect(28, p.h - 13, 12, 6); x.fillStyle = mu; x.fillText('main road green', 44, p.h - 6); x.fillStyle = '#3d86d6'; x.fillRect(146, p.h - 13, 12, 6); x.fillStyle = mu; x.fillText('side street + crossing', 162, p.h - 6);
    // 4 delay
    p = prep($('c4')); x = p.x; const d = hist.d, m4 = Math.max(60, Math.max.apply(null, d.map(e => Math.max(e.f, e.s))) * 1.15), X4 = i => 34 + (p.w - 42) * i / 89, Y4 = v => 8 + (p.h - 32) * (1 - v / m4);
    x.strokeStyle = line; x.fillStyle = mu; [0, 0.5, 1].forEach(f => { const y = Y4(m4 * f); x.beginPath(); x.moveTo(34, y); x.lineTo(p.w - 6, y); x.stroke(); x.fillText((m4 * f).toFixed(0), 6, y + 4); });
    d.forEach((e, i) => { if (e.rush > 0.5) { x.fillStyle = amber + '22'; x.fillRect(X4(i + 90 - d.length) - (p.w - 42) / 178, 8, (p.w - 42) / 89 + 1, p.h - 32); } });
    [['f', stop], ['s', go]].forEach(s => { x.strokeStyle = s[1]; x.lineWidth = 2.5; x.beginPath(); d.forEach((e, i) => { const xx = X4(i + 90 - d.length), yy = Y4(e[s[0]]); i ? x.lineTo(xx, yy) : x.moveTo(xx, yy); }); x.stroke(); });
    x.fillStyle = stop; x.fillRect(38, p.h - 13, 14, 3); x.fillStyle = fg; x.fillText('fixed plan', 56, p.h - 6); x.fillStyle = go; x.fillRect(122, p.h - 13, 14, 3); x.fillStyle = fg; x.fillText('SCOOT · seconds of delay per vehicle, last 30 min · shaded = rush', 140, p.h - 6);
    const r = result(); $('res').textContent = r ? 'Since ' + clock(base.t) + ': fixed plan ' + r.f.toFixed(0) + ' s per vehicle, SCOOT ' + r.s.toFixed(0) + ' s.' : 'Collecting vehicles…';
  }
  const clock = t => { const m = 17 * 60 + 30 + Math.floor(t / 60); return String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };

  // ---------------- main loop ----------------
  let last = 0, acc = 0, frame = 0, wall = 0;
  function tick(ts) {
    const dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts; frame++;
    const c = chapters[ch]; let speed = free ? userSpeed : c.speed * userSpeed;
    if (playing) {
      wall += dt;
      if (!free) {
        tl += dt * (userSpeed >= 1 ? 1 : userSpeed);
        let si = 0; c.steps.forEach((s, k) => { if (tl >= s[0]) si = k; });
        if (si !== stepIdx) { stepIdx = si; const s = c.steps[si]; if (s[1]) setCaption(s[1]); Object.assign(tgt, s[2]); if (c.stepper) document.querySelectorAll('#stepper li').forEach((li, k) => li.className = k < si ? 'done' : k === si ? 'on' : ''); }
        if (tl >= c.dur) { if (ch === chapters.length - 1) { free = true; $('ended').hidden = false; $('tourBtn').hidden = false; document.querySelectorAll('.cpanel').forEach(p => p.classList.remove('hot')); } else enter(ch + 1); }
      }
      const force = rush === 'on' ? 1 : rush === 'off' ? 0 : (!free && c.rush ? Math.min(1, tl / 8) : (!free ? 0 : null));
      F.forceSurge = S.forceSurge = force;
      acc += speed * dt; let n = 0;
      while (acc >= DT && n < 260) { F.step(); S.step(); acc -= DT; n++; secClock += DT; if (secClock >= 1) { secClock = 0; sample(); } }
      if (n >= 260) acc = 0;
    }
    const k = 1 - Math.pow(0.02, dt), tz = W / tgt.span; cam.x += (tgt.x - cam.x) * k; cam.y += (tgt.y - cam.y) * k; cam.z *= Math.pow(tz / cam.z, k);
    const Wd = currentView() === 'F' ? F : S;
    drawWorld(Wd, wall); ui();
    if (!free && stepIdx >= 0) c.draw && c.draw(tl, stepIdx, wall); else nodeNames(j => ' · ' + Wd.nodes[j].C + ' s');
    scaleBar();
    if (frame % 6 === 0) { panels(); const d = C.demand(S.t, S.forceSurge); $('hudClock').textContent = clock(S.t); $('hudMode').textContent = currentView() === 'F' ? 'Showing: fixed plan' : 'Showing: SCOOT'; $('hudMode').className = 'badge ' + (currentView() === 'F' ? 'fx' : 'sc'); $('hudRush').style.width = Math.round(d.s * 100) + '%'; $('hudSpeed').textContent = speed >= 2 ? '×' + speed.toFixed(0) + ' fast forward' : ''; }
    requestAnimationFrame(tick);
  }
  let dTick = 0;
  function sample() {
    hist.q.push({ m: modelVeh(S, sel.j, sel.k), r: S.realQueue(sel.j, sel.k).n }); if (hist.q.length > 180) hist.q.shift();
    if (++dTick >= 20) { dTick = 0; hist.d.push({ f: F.meanDelay(F.t - 120, F.t + 1).delay, s: S.meanDelay(S.t - 120, S.t + 1).delay, rush: C.demand(S.t, S.forceSurge).s }); if (hist.d.length > 90) hist.d.shift(); }
  }

  // ---------------- wiring ----------------
  function init() {
    reset(); resize(); window.addEventListener('resize', resize);
    const chips = $('chips'); chapters.forEach((c, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = (i + 1) + ' · ' + c.kicker; b.title = c.title; b.addEventListener('click', () => { enter(i); playing = true; syncPlay(); }); chips.append(b); });
    $('stepper').innerHTML = STEPS7.map((s, i) => '<li><b>' + (i + 1) + '</b>' + s + '</li>').join('');
    const syncPlay = () => { $('play').textContent = playing ? 'Pause' : 'Play'; $('play').setAttribute('aria-pressed', playing); };
    $('play').addEventListener('click', () => { playing = !playing; syncPlay(); });
    $('prev').addEventListener('click', () => enter(ch - (tl < 3 || free ? 1 : 0)));
    $('next').addEventListener('click', () => enter(ch + 1));
    $('restart').addEventListener('click', () => { reset(); enter(0); playing = true; syncPlay(); });
    $('replay').addEventListener('click', () => { reset(); enter(0); playing = true; syncPlay(); });
    $('tourBtn').addEventListener('click', () => enter(ch));
    $('speed').addEventListener('change', e => userSpeed = +e.target.value);
    $('view').addEventListener('change', e => viewSel = e.target.value);
    $('rush').addEventListener('change', e => rush = e.target.value);
    $('link').addEventListener('change', e => { const v = e.target.value.split('-'); sel = { j: +v[0], k: v[1] }; hist.q.length = 0; });
    // free exploration: drag to pan, wheel or pinch buttons to zoom
    const goFree = () => { if (!free) { free = true; $('tourBtn').hidden = false; setCaption('Exploring freely. Drag to move, scroll or use + and − to zoom. The simulation keeps running.'); document.querySelectorAll('.cpanel').forEach(p => p.classList.remove('hot')); $('stepper').hidden = true; } };
    let drag = null;
    cv.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY }; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (!free && Math.abs(dx) + Math.abs(dy) < 6) return; goFree(); tgt.x -= dx / cam.z; tgt.y -= dy / cam.z; cam.x = tgt.x; cam.y = tgt.y; drag = { x: e.clientX, y: e.clientY }; });
    cv.addEventListener('pointerup', () => drag = null); cv.addEventListener('pointercancel', () => drag = null);
    const zoom = f => { goFree(); tgt.span = Math.max(60, Math.min(2400, tgt.span * f)); tgt.x = Math.max(0, Math.min(XMAX, tgt.x)); tgt.y = Math.max(-150, Math.min(200, tgt.y)); };
    cv.addEventListener('wheel', e => { e.preventDefault(); zoom(e.deltaY > 0 ? 1.15 : 0.87); }, { passive: false });
    $('zin').addEventListener('click', () => zoom(0.7)); $('zout').addEventListener('click', () => zoom(1.4));
    document.addEventListener('visibilitychange', () => { last = performance.now(); });
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) playing = false;
    enter(0); syncPlay(); cam.x = tgt.x; cam.y = tgt.y; cam.z = W / tgt.span;
    window.__tour = { chapters, state: () => ({ ch, tl, free, t: S.t, result: result() }), enter, setSpeed: v => userSpeed = v };
    requestAnimationFrame(t => { last = t; tick(t); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
