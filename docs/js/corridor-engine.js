/* Waterfront corridor: a small microsimulation with a SCOOT-style controller.
   Teaching model only. Geometry, demand and LPU coding are illustrative, not surveyed and not TRL's.
   World units are metres and seconds. The main road runs west to east; x grows eastwards, y grows southwards.
   Traffic drives on the right: eastbound lanes are south of the median, westbound lanes are north of it. */
(function (root) {
  'use strict';

  const DT = 0.25;                       // one detector sample, a quarter of a second
  const XMAX = 2000;
  const JX = [250, 550, 900, 1750];      // junction centres; the 850 m link is where the region boundary falls
  const REGION = [0, 0, 0, 1];
  const EB_Y = [3.25, 6.75], WB_Y = [-3.25, -6.75];
  const SIDE_LEN = 180, SIDE_STOP = 168; // side street: s = 0 at its southern end, stop line at s = 168 (y = 12)
  const INTER = 5, AMBER = 3;            // intergreen: 3 s amber + 2 s all red
  const MIN_GB = 14, MIN_GA = 16;        // side green must cover the pedestrian crossing time
  const CRUISE = 13;                     // m/s used for journey times
  const BIN = 4;                         // profile bin, seconds

  function rng(seed) { let a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  // Demand in vehicles per hour as a function of scenario time. An evening rush builds between minutes 9 and 24.
  const PERIOD = 32 * 60;
  function surge(t) {
    const m = (t % PERIOD) / 60, up = Math.min(1, Math.max(0, (m - 9) / 3)), dn = Math.min(1, Math.max(0, (m - 22) / 3));
    const s = up - dn; return s * s * (3 - 2 * s);
  }
  function demand(t, force) {
    const s = force == null ? surge(t) : force;
    return { s, eb: 850 + 250 * s, wb: 750 + 750 * s, side: [200 + 110 * s, 270 + 330 * s, 220 + 150 * s, 180 + 60 * s] };
  }

  const COLORS = ['#f4f5f6', '#f4f5f6', '#f4f5f6', '#e9eaec', '#c9ced3', '#8f979f', '#2b3138', '#1d2024', '#b9432f', '#3d6fa8', '#c8b68a'];

  function World(opts) {
    const o = opts || {};
    this.scoot = !!o.scoot; this.rand = rng(o.seed || 7); this.t = 0; this.forceSurge = null;
    this.nextId = 1; this.events = []; this.done = []; // done: {t, delay, stops}
    this.totals = { n: 0, delay: 0, stops: 0 };
    this.lanes = [];
    const mk = (kind, idx, y, node) => { const L = { kind, idx, y, node, veh: [], stops: [], length: kind === 'side' ? SIDE_LEN : XMAX }; this.lanes.push(L); return L; };
    this.eb = [mk('eb', 0, EB_Y[0]), mk('eb', 1, EB_Y[1])];
    this.wb = [mk('wb', 0, WB_Y[0]), mk('wb', 1, WB_Y[1])];
    this.side = JX.map((x, j) => mk('side', 0, 0, j));
    JX.forEach((x, j) => {
      this.eb.forEach(L => L.stops.push({ s: x - 13, node: j }));
      this.wb.forEach(L => L.stops.push({ s: XMAX - (x + 10), node: j }));
      this.side[j].stops.push({ s: SIDE_STOP, node: j });
    });
    this.wb.forEach(L => L.stops.sort((a, b) => a.s - b.s));
    this.turners = []; this.peds = []; this.backlog = { eb: [], wb: [], side: JX.map(() => []) };
    this.arr = { eb: 0, wb: 0, side: JX.map(() => 0) };
    // Signals. Both worlds start from the same fixed plan: 70 s cycle, 20 s side green, offsets set for eastbound progression.
    this.regions = [{ C: 70, min: 48, max: 112, review: 150, crit: 0, critNode: 0, nodes: [0, 1, 2] }, { C: 70, min: 40, max: 112, review: 150, crit: 0, critNode: 3, nodes: [3] }];
    this.nodes = JX.map((x, j) => {
      const off = Math.round(((x - JX[0]) / CRUISE) % 70);
      return { j, x, region: REGION[j], stage: 'A', ts: 0, gA: 40 + off, gB: 20, planA: 40, C: 70, cycleStart: -70 + off, shift: 0, pedWait: 0, lastNudge: null, cycles: 0, links: {} };
    });
    // SCOOT links: one upstream detector per approach.
    this.nodes.forEach((n, j) => {
      const upE = j > 0 ? JX[j - 1] + 45 : n.x - 13 - 190, upW = j < JX.length - 1 ? JX[j + 1] - 45 : n.x + 10 + 190;
      n.links.eb = mkLink('eb', upE, n.x - 13 - upE, 2.08, j > 0 ? j - 1 : -1);
      n.links.wb = mkLink('wb', XMAX - upW, upW - (n.x + 10), 2.08, j < JX.length - 1 ? j + 1 : -1);
      n.links.side = mkLink('side', SIDE_STOP - 130, 130, 1.15, -1);
    });
    function mkLink(kind, detS, dist, stoc, from) {
      const jt = Math.round(dist / (kind === 'side' ? 10 : CRUISE));
      return { kind, detS, dist, jt, stoc, from, occ: [false, false], lpuSec: 0, pipe: new Array(jt + 1).fill(0), pi: 0, q: 0, cyc: 0, dos: 0.5, prof: new Array(30).fill(0), cur: new Array(30).fill(0), lpuTotal: 0, flash: 0, was: [false, false], run: [0, 0], lpv: stoc / (kind === 'side' ? 0.5 : 1), lanes: kind === 'side' ? 1 : 2, vehTotal: 0 };
    }
    this.secAcc = 0;
  }

  World.prototype.mainGreen = function (j) { return this.nodes[j].stage === 'A'; };
  World.prototype.lamp = function (j, side) {
    const st = this.nodes[j].stage;
    if (side) return st === 'B' ? 'g' : st === 'BI' ? 'a' : 'r';
    return st === 'A' ? 'g' : st === 'AI' ? 'a' : 'r';
  };

  World.prototype.spawn = function (laneKind, j) {
    const r = this.rand, bus = laneKind !== 'side' && r() < 0.03;
    const v = { id: this.nextId++, s: 0, v: 0, len: bus ? 11.5 : 4.3 + r() * 0.6, wid: bus ? 2.5 : 1.85, bus,
      v0: (laneKind === 'side' ? 10.5 : bus ? 12 : 13.6) + (r() - 0.5) * 2.4, T: 1.3 + r() * 0.3, a: bus ? 1.1 : 1.5 + r() * 0.4,
      color: bus ? '#1f8a8a' : COLORS[(r() * COLORS.length) | 0], t0: this.t, free: 0, stops: 0, moving: true, exit: -1, brake: false, dist: 0, lat: 0, lc: 0 };
    return v;
  };

  World.prototype.feed = function () {
    const d = demand(this.t, this.forceSurge), r = this.rand, self = this;
    const pois = (rate, bl, mkv) => { if (r() < rate / 3600 * DT) bl.push(mkv()); };
    pois(d.eb, this.backlog.eb, () => { const v = self.spawn('eb'); if (r() < 0.22) { let j = (r() * 4) | 0; v.exit = j; } return v; });
    pois(d.wb, this.backlog.wb, () => self.spawn('wb'));
    JX.forEach((x, j) => pois(d.side[j], this.backlog.side[j], () => self.spawn('side', j)));
    const enter = (bl, lanes, pick) => {
      if (!bl.length) return;
      const v = bl[0], L = pick(v, lanes), last = L.veh[L.veh.length - 1];
      if (last && last.s - last.len < 9) { const alt = lanes.length > 1 ? lanes[1 - L.idx] : null, al = alt && alt.veh[alt.veh.length - 1]; if (!alt || (al && al.s - al.len < 9)) return; bl.shift(); place(v, alt, al); return; }
      bl.shift(); place(v, L, last);
    };
    function place(v, L, last) { v.s = 0; v.v = last ? Math.min(v.v0, Math.max(2, last.v)) : v.v0; v.lane = L; L.veh.push(v); }
    enter(this.backlog.eb, this.eb, (v, ls) => (ls[0].veh.length <= ls[1].veh.length ? ls[0] : ls[1]));
    enter(this.backlog.wb, this.wb, (v, ls) => (ls[0].veh.length <= ls[1].veh.length ? ls[0] : ls[1]));
    JX.forEach((x, j) => enter(this.backlog.side[j], [this.side[j]], (v, ls) => ls[0]));
  };

  function idm(v, gap, dv) {
    const s0 = 2, b = 2.2, ss = s0 + Math.max(0, v.v * v.T + v.v * dv / (2 * Math.sqrt(v.a * b)));
    return v.a * (1 - Math.pow(v.v / v.vd, 4) - (ss / Math.max(0.3, gap)) * (ss / Math.max(0.3, gap)));
  }

  World.prototype.stepLane = function (L) {
    const vs = L.veh;
    for (let i = 0; i < vs.length; i++) {
      const v = vs[i]; v.vd = v.v0;
      // slow down for the right turn into a side street
      if (L.kind === 'eb' && v.exit >= 0 && L.idx === 1) { const d = JX[v.exit] - 8 - v.s; if (d > 0 && d < 45) v.vd = Math.min(v.v0, 6 + d * 0.16); }
      let acc = v.a * (1 - Math.pow(v.v / v.vd, 4));
      if (i > 0) { const ld = vs[i - 1]; acc = Math.min(acc, idm(v, ld.s - ld.len - v.s, v.v - ld.v)); }
      for (let k = 0; k < L.stops.length; k++) {
        const st = L.stops[k], gap = st.s - v.s; if (gap < -0.5) continue;
        const lamp = this.lamp(st.node, L.kind === 'side');
        let stop = lamp === 'r' || (lamp === 'a' && gap > v.v * v.v / (2 * 3.2) - 1);
        if (!stop && L.kind === 'side' && !this.mergeClear(st.node)) stop = true;
        if (stop) acc = Math.min(acc, idm(v, gap + 1.2, v.v));
        break;
      }
      acc = Math.max(-7, acc); v.brake = acc < -0.6 || v.v < 0.3;
      v.v = Math.max(0, v.v + acc * DT); v.s += v.v * DT; v.dist += v.v * DT;
      if (v.lat) { const m = Math.sign(v.lat) * Math.min(Math.abs(v.lat), (0.5 + v.v * 0.09) * DT); v.lat -= m; }
      if (v.moving && v.v < 0.4) { v.moving = false; v.stops++; } else if (!v.moving && v.v > 3) v.moving = true;
    }
    // leave the lane: end of road, turn off, or turn in from a side street
    for (let i = vs.length - 1; i >= 0; i--) {
      const v = vs[i];
      if (L.kind === 'side') { if (v.s >= SIDE_STOP + 0.8) { vs.splice(i, 1); this.turners.push({ v, type: 'in', j: L.node, u: 0 }); } }
      else if (L.kind === 'eb' && v.exit >= 0 && v.s >= JX[v.exit] - 8) { if (L.idx === 1) { vs.splice(i, 1); this.turners.push({ v, type: 'out', j: v.exit, u: 0 }); } else v.exit = -1; }
      else if (v.s >= XMAX) { vs.splice(i, 1); this.finish(v, XMAX); }
    }
  };

  // A side-street driver may turn in unless the outer eastbound lane is occupied in the junction or blocked just beyond it.
  // Simple lane choice on the main road: move to the other lane when it offers clearly more room and the move is safe.
  World.prototype.laneChanges = function (pair) {
    for (let a = 0; a < 2; a++) {
      const from = pair[a], to = pair[1 - a], vs = from.veh;
      for (let i = vs.length - 1; i >= 0; i--) {
        const v = vs[i]; if (v.lc > 0) { v.lc -= 1; continue; }
        if (v.bus) continue;
        const want = from.kind === 'eb' && v.exit >= 0 ? 1 : -1;      // drivers turning off must be in the outer lane
        if (want === from.idx) continue;
        let near = false; for (let k = 0; k < from.stops.length; k++) { const g = from.stops[k].s - v.s; if (g > -22 && g < 6) { near = true; break; } }
        if (near) continue;
        const gapHere = i > 0 ? vs[i - 1].s - vs[i - 1].len - v.s : 999;
        let ahead = null, behind = null, k = 0; const ts = to.veh;
        while (k < ts.length && ts[k].s > v.s) k++;
        ahead = k > 0 ? ts[k - 1] : null; behind = k < ts.length ? ts[k] : null;
        const gapThere = ahead ? ahead.s - ahead.len - v.s : 999, gapBack = behind ? v.s - v.len - behind.s : 999;
        const must = want === to.idx && JX[v.exit] - v.s < 260;
        const better = gapThere > gapHere + 10 && gapHere < 40 + v.v * 2;
        if (!(must || better)) continue;
        if (gapThere < 3 + v.v * 0.6 || gapBack < 3 + (behind ? behind.v : 0) * 0.9) continue;
        vs.splice(i, 1); ts.splice(k, 0, v); v.lane = to; v.lat = from.y - to.y; v.lc = 6;
      }
    }
  };

  World.prototype.mergeClear = function (j) {
    const x = JX[j], vs = this.eb[1].veh;
    for (let i = 0; i < vs.length; i++) { const f = vs[i].s, bk = f - vs[i].len; if (f > x - 12 && f < x + 8) return false; if (bk < x + 24 && f >= x + 8 && vs[i].v < 2.5) return false; }
    return true;
  };

  World.prototype.finish = function (v, dist) {
    const tt = this.t - v.t0, free = v.dist / v.v0, delay = Math.max(0, tt - free);
    this.done.push({ t: this.t, delay, stops: v.stops }); this.totals.n++; this.totals.delay += delay; this.totals.stops += v.stops;
    if (this.done.length > 6000) this.done.splice(0, 2000);
  };

  // Turn paths. 'in': side street to the outer eastbound lane. 'out': outer eastbound lane into the side street, then away south.
  function turnPos(t) {
    const x = JX[t.j], u = Math.min(1, t.u);
    if (t.type === 'in') { const p0 = [x + 1.75, 12 - 0.8], c = [x + 1.75, 6.75], p1 = [x + 9, 6.75]; return bez(p0, c, p1, u); }
    if (t.u <= 1) return bez([x - 8, 6.75], [x - 1.75, 6.75], [x - 1.75, 13], u);
    return { x: x - 1.75, y: 13 + (t.u - 1) * 60, a: Math.PI / 2 };
  }
  function bez(p0, c, p1, u) {
    const w = 1 - u, x = w * w * p0[0] + 2 * w * u * c[0] + u * u * p1[0], y = w * w * p0[1] + 2 * w * u * c[1] + u * u * p1[1];
    const dx = 2 * w * (c[0] - p0[0]) + 2 * u * (p1[0] - c[0]), dy = 2 * w * (c[1] - p0[1]) + 2 * u * (p1[1] - c[1]);
    return { x, y, a: Math.atan2(dy, dx) };
  }

  World.prototype.stepTurners = function () {
    for (let i = this.turners.length - 1; i >= 0; i--) {
      const t = this.turners[i], v = t.v, sp = Math.max(4, Math.min(7, v.v + 1 * DT)); v.v = sp; v.brake = false; v.dist += sp * DT;
      t.u += sp * DT / (t.type === 'in' ? 11.5 : (t.u <= 1 ? 11 : 60));
      if (t.type === 'in' && t.u >= 1) {
        this.turners.splice(i, 1); v.s = JX[t.j] + 9; v.lane = this.eb[1];
        if (this.rand() < 0.2) { const later = []; for (let k = t.j + 1; k < JX.length; k++) later.push(k); if (later.length) v.exit = later[(this.rand() * later.length) | 0]; }
        const vs = this.eb[1].veh; let k = 0; while (k < vs.length && vs[k].s > v.s) k++; vs.splice(k, 0, v);
      } else if (t.type === 'out' && t.u >= 2) { this.turners.splice(i, 1); this.finish(v); }
    }
  };

  // Pedestrians cross the main road on the west side of each junction while the side street has green.
  World.prototype.stepPeds = function () {
    const r = this.rand, s = demand(this.t, this.forceSurge).s;
    this.nodes.forEach(n => {
      if (r() < (0.012 + 0.02 * s) * DT) this.peds.push({ j: n.j, x: n.x - 9.5 + (r() - 0.5) * 2.2, y: r() < 0.5 ? 10.6 : -10.6, dir: 0, sp: 1.15 + r() * 0.4, hue: (r() * 6) | 0, wait: true });
    });
    for (let i = this.peds.length - 1; i >= 0; i--) {
      const p = this.peds[i], n = this.nodes[p.j];
      if (p.wait) { if (n.stage === 'B' && n.ts < Math.max(1, n.gB - 13.5)) { p.wait = false; p.dir = p.y > 0 ? -1 : 1; } continue; }
      p.y += p.dir * p.sp * DT; if (Math.abs(p.y) > 16) this.peds.splice(i, 1);
    }
  };

  // ---------------- signals ----------------
  World.prototype.stepSignals = function () {
    this.nodes.forEach(n => {
      n.ts += DT;
      if (n.stage === 'A' && n.ts >= n.gA) { n.stage = 'AI'; n.ts = 0; }
      else if (n.stage === 'AI' && n.ts >= AMBER) { n.stage = 'AR'; n.ts = 0; }
      else if (n.stage === 'AR' && n.ts >= INTER - AMBER) { n.stage = 'B'; n.ts = 0; }
      else if (n.stage === 'B' && n.ts >= n.gB) { n.stage = 'BI'; n.ts = 0; }
      else if (n.stage === 'BI' && n.ts >= AMBER) { n.stage = 'BR'; n.ts = 0; }
      else if (n.stage === 'BR' && n.ts >= INTER - AMBER) { n.stage = 'A'; n.ts = 0; this.newCycle(n); }
    });
  };

  World.prototype.newCycle = function (n) {
    const R = this.regions[n.region]; n.cycles++; n.cycleStart = this.t;
    // close the cycle for the link model
    ['eb', 'wb', 'side'].forEach(k => {
      const L = n.links[k], g = (k === 'side' ? n.gB : n.planA) - 2, x = L.cyc / Math.max(1, L.stoc * g);
      L.last = { lpu: L.cyc, g, x };
      L.dos = 0.5 * L.dos + 0.5 * Math.min(1.6, x); L.cyc = 0;
      const nb = Math.ceil(n.C / BIN); for (let b = 0; b < 30; b++) { L.prof[b] = b < nb ? 0.6 * L.prof[b] + 0.4 * L.cur[b] : 0; L.cur[b] = 0; }
    });
    if (!this.scoot) { n.gA = n.planA; return; }
    n.lastNudge = null;
    if (n.cycles > 2) {
      // Split optimiser: move up to 4 s towards the more saturated stage.
      const dm = Math.max(n.links.eb.dos, n.links.wb.dos), ds = n.links.side.dos, diff = ds - dm;
      let step = Math.abs(diff) < 0.04 ? 0 : Math.sign(diff) * Math.min(4, Math.max(1, Math.round(Math.abs(diff) * 14)));
      const gB = Math.max(MIN_GB, Math.min(R.C - 2 * INTER - MIN_GA, n.gB + step)); step = gB - n.gB;
      if (step) { n.gB = gB; this.note(n, 'split', (step > 0 ? '+' : '−') + Math.abs(step) + ' s side green'); }
    }
    if (n.C !== R.C) { n.C = R.C; }
    n.gB = Math.min(n.gB, n.C - 2 * INTER - MIN_GA);
    n.planA = n.C - 2 * INTER - n.gB;
    // Offset optimiser: try 4 s earlier, no change, 4 s later, and keep the cheapest.
    let d = 0;
    if (n.cycles > 3) {
      const cost = dd => this.offsetCost(n, dd), c0 = cost(0), cm = cost(-4), cp = cost(4);
      if (cm < c0 * 0.97 && cm <= cp) d = -4; else if (cp < c0 * 0.97) d = 4;
      if (n.planA + d < MIN_GA) d = 0;
      if (d) this.note(n, 'offset', (d > 0 ? '+4' : '−4') + ' s offset');
    }
    n.gA = n.planA + d;
  };

  World.prototype.note = function (n, kind, text) { n.lastNudge = { kind, text, t: this.t }; this.events.push({ t: this.t, node: n.j, kind, text }); if (this.events.length > 200) this.events.splice(0, 100); };

  // Predicted queue-seconds on one link for a profile shifted by `sh` seconds against a green of length g.
  function linkCost(prof, C, g, stoc, sh) {
    const nb = Math.ceil(C / BIN); let q = 0, cost = 0;
    for (let rep = 0; rep < 2; rep++) for (let s = 0; s < C; s++) {
      let b = Math.floor((((s + sh) % C) + C) % C / BIN); if (b >= nb) b = nb - 1;
      q += prof[b] / BIN; if (s >= 2 && s < g) q = Math.max(0, q - stoc); if (rep) cost += q;
    }
    return cost;
  }
  World.prototype.offsetCost = function (n, d) {
    let c = 0; const self = this;
    // incoming main links: if this node starts d later, traffic arrives d earlier on its own clock
    ['eb', 'wb'].forEach(k => { const L = n.links[k]; if (L.from >= 0) c += linkCost(L.prof, n.C, n.planA, L.stoc, d); });
    // links fed by this node: their arrivals move d later on the neighbour's clock
    this.nodes.forEach(m => { if (m.region !== n.region || m === n) return; ['eb', 'wb'].forEach(k => { const L = m.links[k]; if (L.from === n.j) c += linkCost(L.prof, m.C, m.planA, L.stoc, -d); }); });
    return c;
  };

  // Cycle optimiser: every 150 s, hold the critical node near 90% saturation.
  World.prototype.cycleReview = function () {
    this.regions.forEach((R, ri) => {
      R.review -= DT; if (R.review > 0) return; R.review = 150;
      let crit = 0, cn = R.nodes[0];
      R.nodes.forEach(j => { const n = this.nodes[j], x = Math.max(n.links.eb.dos, n.links.wb.dos, n.links.side.dos); if (x >= crit) { crit = x; cn = j; } });
      R.crit = crit; R.critNode = cn;
      if (!this.scoot || this.t < 240) return;
      let step = crit > 1.02 ? 8 : crit > 0.9 ? 4 : crit < 0.78 ? -4 : 0;
      const C = Math.max(R.min, Math.min(R.max, R.C + step));
      if (C !== R.C) { this.events.push({ t: this.t, node: cn, kind: 'cycle', text: 'cycle ' + R.C + ' → ' + C + ' s', region: ri }); R.C = C; }
    });
  };

  // ---------------- detectors and the SCOOT link model ----------------
  World.prototype.stepDetectors = function () {
    const self = this; this.secAcc += DT; const tick = this.secAcc >= 1 - 1e-9; if (tick) this.secAcc = 0;
    this.nodes.forEach(n => {
      ['eb', 'wb', 'side'].forEach(k => {
        const L = n.links[k], lanes = k === 'eb' ? self.eb : k === 'wb' ? self.wb : [self.side[n.j]];
        lanes.forEach((ln, li) => {
          let occ = false, sp = 0; const vs = ln.veh;
          for (let i = 0; i < vs.length; i++) { const f = vs[i].s; if (f < L.detS) break; if (f - vs[i].len <= L.detS + 2) { occ = true; sp = vs[i].v; break; } }
          L.occ[li] = occ; if (occ) { L.lpuSec++; L.lpuTotal++; L.flash = 1; L.run[li]++; if (!L.was[li]) L.vehTotal++; L.fast = sp > 7; }
          // "validation": learn the LPUs one free-flowing vehicle produces, which sets the saturation occupancy
          else if (L.was[li]) { if (L.fast && L.run[li] < 12) { L.lpv = 0.98 * L.lpv + 0.02 * L.run[li]; L.stoc = L.lanes * 0.5 * L.lpv; } L.run[li] = 0; }
          L.was[li] = occ;
        });
        if (!lanes.some((_, li) => L.occ[li])) L.flash = Math.max(0, L.flash - DT * 3);
        if (!tick) return;
        // one-second step of the queue model: detector counts arrive at the stop line a journey time later
        L.pipe[L.pi] = L.lpuSec; L.lpuSec = 0; L.pi = (L.pi + 1) % L.pipe.length;
        const arr = L.pipe[L.pi]; L.q += arr; L.cyc += arr;
        const green = k === 'side' ? (n.stage === 'B' && n.ts >= 2) : (n.stage === 'A' && n.ts >= 2);
        if (green) L.q = Math.max(0, L.q - L.stoc);
        L.q = Math.min(L.q, L.dist / 6.5 * (k === 'side' ? 1 : 2) * 2.2);
        const b = Math.min(29, Math.floor((self.t - n.cycleStart) / BIN)); if (b >= 0) L.cur[b] += arr;
      });
    });
  };

  // Real queue on an approach, in vehicles (slow vehicles within the link).
  World.prototype.realQueue = function (j, k) {
    const n = this.nodes[j], L = n.links[k], lanes = k === 'eb' ? this.eb : k === 'wb' ? this.wb : [this.side[j]];
    const stop = k === 'eb' ? n.x - 13 : k === 'wb' ? XMAX - (n.x + 10) : SIDE_STOP; let c = 0, back = 0;
    lanes.forEach(ln => ln.veh.forEach(v => { if (v.s <= stop + 0.5 && v.s > stop - L.dist - 60 && v.v < 2) { c++; back = Math.max(back, stop - v.s + v.len); } }));
    return { n: c, back };
  };

  World.prototype.step = function () {
    this.feed();
    for (let i = 0; i < this.lanes.length; i++) this.stepLane(this.lanes[i]);
    if (Math.abs(this.secAcc) < 1e-9) { this.laneChanges(this.eb); this.laneChanges(this.wb); }
    this.stepTurners(); this.stepPeds(); this.stepSignals(); this.stepDetectors(); this.cycleReview();
    this.t += DT;
  };

  // Mean delay per vehicle for vehicles finishing in [t0, t1), plus everyone still waiting to enter.
  World.prototype.meanDelay = function (t0, t1) {
    let n = 0, d = 0, st = 0; for (let i = this.done.length - 1; i >= 0; i--) { const e = this.done[i]; if (e.t < t0) break; if (e.t < t1) { n++; d += e.delay; st += e.stops; } }
    return { n, delay: n ? d / n : 0, stops: n ? st / n : 0 };
  };
  World.prototype.vehicleCount = function () { let c = this.turners.length; this.lanes.forEach(L => c += L.veh.length); return c; };
  World.prototype.backlogCount = function () { return this.backlog.eb.length + this.backlog.wb.length + this.backlog.side.reduce((a, b) => a + b.length, 0); };

  const api = { World, DT, XMAX, JX, REGION, EB_Y, WB_Y, SIDE_LEN, SIDE_STOP, PERIOD, CRUISE, BIN, INTER, demand, surge, turnPos };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Corridor = api;
})(typeof window !== 'undefined' ? window : globalThis);
