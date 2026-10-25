/* Live single-junction simulation with three controllers: fixed time, vehicle actuated, SCOOT.
   Each approach has a SCOOT detector near its upstream end and a stop-line loop.
   SCOOT never sees the real queue: it counts LPUs upstream, predicts arrivals
   (cruise time + dispersion) and runs its own queue model, drawn as an amber bar. */
(function (g) {
  const S = g.SCOOT;
  const STAGES = ['A', 'B'], APPR = { W: 0, E: 0, N: 1, S: 1 };
  const AMBER = 3, IG = 5, MIN = [8, 6], HEADWAY = 2.0, STARTUP = 2, CRUISE = 12;
  const SAT = 1 / HEADWAY * 1.8;             // SATO, LPU/s per approach (one lane)
  const START_LAG = 2, END_LAG = 2;

  class IntersectionSim {
    constructor(canvas, opts = {}) {
      this.cv = canvas; this.ctx = canvas.getContext('2d');
      this.opts = Object.assign({ mode: 'scoot', demand: { W: 600, E: 550, N: 300, S: 280 }, speed: 5, seed: 7, compact: false }, opts);
      this.listeners = [];
      this.reset();
      if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => this.resize()).observe(canvas);
      this.resize();
    }
    on(fn) { this.listeners.push(fn); }
    setMode(m) { this.opts.mode = m; this.reset(); }
    setDemand(d) { Object.assign(this.opts.demand, d); }
    setSpeed(s) { this.opts.speed = s; }

    reset() {
      this.rand = S.rng(this.opts.seed);
      this.t = 0;
      this.trav = { W: [], E: [], N: [], S: [] };
      this.q = { W: [], E: [], N: [], S: [] };
      this.acc = { W: 0, E: 0, N: 0, S: 0 };
      this.det = {}; this.stopGap = {};
      this.model = {};
      const C = this.opts.mode === 'fixed' ? 80 : 60;
      for (const a in this.q) {
        this.det[a] = 0; this.stopGap[a] = 9;
        const { F, lag } = S.robertson(CRUISE);
        this.model[a] = { F, lag, buf: new Array(lag + 1).fill(0), arr: 0, q: 0, prof: new Array(C).fill(0), cyc: new Array(C).fill(0), resid: 0 };
      }
      this.C = C; this.t0 = 0;
      const gA = (C - 2 * IG) * 0.55;
      this.change = [gA, gA + IG + (C - 2 * IG) * 0.45];
      this.temp = [0, 0];
      this.decided = [false, false];
      this.cur = 0; this.mode = 'green'; this.since = 0; this.igStart = -99;
      this.nextOpt = 300; this.lastTau = 0;
      this.history = []; this.cycleLog = [];
      this.rec = { g: { A: 0, B: 0 } };
      this.delaySum = 0; this.served = 0; this.queueInt = 0; this.modelErr = 0;
      this.splitStats = { '-4': 0, '0': 0, '4': 0 };
      this.lastDecision = null;
    }

    tau() { return Math.floor(((this.t - this.t0) % this.C + this.C) % this.C); }
    windows(extra = [0, 0]) { return S.stageWindows([0, 1].map(k => this.change[k] + this.temp[k] + extra[k]), [IG, IG], this.C); }
    inWin(tau, w) { const C = this.C; return ((tau - w[0]) % C + C) % C < ((w[1] - w[0]) % C + C) % C; }

    linkDos(a, win, C = this.C, prof = this.model[a].prof) {
      const g = ((win[1] - win[0]) % C + C) % C - START_LAG + END_LAG;
      return S.dos(prof.reduce((x, y) => x + y, 0), Math.max(g, 1), SAT, this.model[a].resid);
    }
    stageDos(extra = [0, 0]) {
      const w = this.windows(extra), out = [0, 0];
      for (const a in APPR) out[APPR[a]] = Math.max(out[APPR[a]], this.linkDos(a, w[APPR[a]]));
      return out;
    }

    splitOptimiser(k) {
      const base = [0, 1].map(i => this.change[i] + this.temp[i]);
      const opts = S.splitOptions(base, k, [IG, IG], MIN, this.C, 4);
      const dos = {};
      for (const d of opts) { const e = [0, 0]; e[k] = d; dos[d] = Math.max(...this.stageDos(e)); }
      const d = S.chooseMin(dos);
      this.temp[k] += d;
      if (d) this.change[k] = ((this.change[k] + Math.sign(d)) % this.C + this.C) % this.C;
      this.splitStats[String(d)]++;
      this.lastDecision = { t: this.t, stage: STAGES[k], dos, d };
    }

    evaluateCycle(Cn) {
      const r = Cn / this.C, ch = [0, 1].map(k => (this.change[k] + this.temp[k]) * r);
      const win = S.stageWindows(ch, [IG, IG], Cn);
      let crit = 0, pi = 0;
      for (const a in APPR) {
        const prof = S.resample(this.model[a].prof, Cn).map(v => v * r), w = win[APPR[a]];
        crit = Math.max(crit, this.linkDos(a, w, Cn, prof));
        const res = S.simulateQueue(prof, S.effGreenMask(Cn, w[0], w[1], START_LAG, END_LAG), SAT, 2);
        pi += S.pi(res.delay, res.stops) / Cn;
      }
      return { crit, pi };
    }
    cycleOptimiser() {
      const p = S.cycleDefaults, step = S.cycleStep(this.C);
      let cands = [...new Set([Math.max(p.cmin, this.C - step), this.C, Math.min(p.cmax, this.C + step)])];
      const now = this.evaluateCycle(this.C);
      if (now.crit > p.target) cands = [...new Set(cands.concat([8, 12, 16].map(j => Math.min(p.cmax, this.C + j))))];
      const ev = {}; cands.forEach(c => ev[c] = this.evaluateCycle(c));
      const feas = cands.filter(c => ev[c].crit <= (c < this.C ? p.lower : p.target));
      let nw;
      if (feas.length) {
        const longer = feas.filter(c => c > this.C);
        nw = now.crit > p.target && longer.length ? Math.min(...longer) : feas.sort((a, b) => ev[a].pi - ev[b].pi || a - b)[0];
      } else nw = Math.max(...cands);
      const action = nw > this.C ? 'up' : nw < this.C ? 'down' : 'hold';
      this.nextOpt = this.t + (action === 'up' ? p.fast : p.period);
      this.cycleLog.push({ t: this.t, C: nw, crit: now.crit, action });
      if (nw !== this.C) {
        const r = nw / this.C, tauNew = this.tau() * r;
        this.change = this.change.map(c => (c * r) % nw); this.temp = [0, 0];
        for (const a in this.model) { const m = this.model[a]; m.prof = S.resample(m.prof, nw).map(v => v * r); m.cyc = new Array(nw).fill(0); }
        this.C = nw; this.t0 = this.t - tauNew;
      }
    }

    closeCycle() {
      for (const a in this.model) {
        const m = this.model[a];
        for (let i = 0; i < m.prof.length; i++) m.prof[i] = 0.75 * m.prof[i] + 0.25 * (m.cyc[i] || 0);
        m.cyc = new Array(m.prof.length).fill(0);
      }
      const r = this.rec, d = this.stageDos();
      r.t = this.t; r.C = this.C; r.dos = { A: d[0], B: d[1] };
      this.history.push(r); if (this.history.length > 120) this.history.shift();
      this.listeners.forEach(f => f(r, this));
      this.rec = { g: { A: 0, B: 0 } };
    }

    setState(stage, kind) { this.light = { stage, kind }; }

    tick() {
      const t = ++this.t, d = this.opts.demand, mode = this.opts.mode;
      // arrivals at the upstream end: they cross the SCOOT detector, then travel to the queue
      for (const a in this.trav) {
        const k = S.poisson(this.rand, d[a] / 3600);
        let occ = 0, n = 0;
        for (let i = 0; i < k; i++) {
          const truck = this.rand() < 0.08;
          this.trav[a].push({ born: t, arrive: t + CRUISE * (0.85 + 0.3 * this.rand()), truck, hue: this.rand() });
          occ += truck ? 1.0 : 0.4; n++;
        }
        this.det[a] = k ? 1 : this.det[a] * 0.6;
        this.measured = this.measured || {}; this.measured[a] = S.lpu(n, Math.min(1, occ));
        const arrived = this.trav[a].filter(v => v.arrive <= t);
        this.trav[a] = this.trav[a].filter(v => v.arrive > t);
        arrived.forEach(v => this.q[a].push(v));
      }
      // signals: which stage is green
      const greenStage = this.mode === 'green' ? this.cur : -1;
      for (const a in this.q) {
        let crossed = 0;
        if (greenStage === APPR[a] && t - this.since > STARTUP) {
          this.acc[a] = Math.min(this.acc[a] + 1 / HEADWAY, 1);
          while (this.acc[a] >= 1 && this.q[a].length) {
            const v = this.q[a].shift(); this.acc[a] -= 1; crossed++;
            this.delaySum += Math.max(0, t - v.arrive); this.served++;
          }
        } else this.acc[a] = 0;
        this.stopGap[a] = crossed ? 0 : this.stopGap[a] + 1;
        this.queueInt += this.q[a].length;
      }
      // SCOOT model (also run in other modes so it can be displayed)
      const tau = this.tau();
      const wins = this.windows();
      for (const a in this.model) {
        const m = this.model[a];
        m.buf.push(this.measured[a]); const src = m.buf.shift();
        m.arr = m.F * src + (1 - m.F) * m.arr;
        m.q += m.arr;
        const st = APPR[a];
        const eg = (this.mode === 'green' && this.cur === st && t - this.since >= START_LAG) || (this.mode === 'ig' && this.cur === st && t - this.igStart < END_LAG);
        if (eg) m.q -= Math.min(m.q, SAT);
        if (this.mode === 'ig' && this.cur === st && t - this.igStart === END_LAG) m.resid = 0.7 * m.resid + 0.3 * m.q;
        if (tau < m.cyc.length) m.cyc[tau] += m.arr;
        this.modelErr += Math.abs(m.q / 1.8 - this.q[a].length);
      }
      if (mode === 'scoot') {
        if (t >= this.nextOpt) this.cycleOptimiser();
        const tau2 = this.tau();
        for (let k = 0; k < 2; k++) {
          const lead = Math.round(this.change[k] + this.temp[k] - 5);
          if (tau2 === ((lead % this.C) + this.C) % this.C && !this.decided[k]) { this.splitOptimiser(k); this.decided[k] = true; }
        }
      }
      const tauNow = this.tau();
      if (tauNow < this.lastTau) { this.decided = [false, false]; this.closeCycle(); }
      this.lastTau = tauNow;
      // state machine
      if (this.mode === 'green') {
        const s = this.cur, el = t - this.since;
        let want;
        if (mode === 'actuated') {
          const lanes = Object.keys(APPR).filter(a => APPR[a] === s), other = Object.keys(APPR).filter(a => APPR[a] !== s);
          const gap = lanes.every(a => this.stopGap[a] >= 3 && !this.q[a].length);
          const demandOther = other.some(a => this.q[a].length || this.trav[a].length);
          want = (gap && demandOther) || el >= [40, 30][s];
        } else {
          want = !this.inWin(this.tau(), this.windows()[s]);
        }
        if (want && el >= MIN[s]) { this.rec.g[STAGES[s]] = el; this.mode = 'ig'; this.igStart = t; this.temp[s] = 0; }
      } else if (t - this.igStart >= IG) {
        this.cur = 1 - this.cur; this.mode = 'green'; this.since = t;
      }
    }

    stats() {
      const d = this.stageDos();
      return { avgDelay: this.served ? this.delaySum / this.served : 0, served: this.served,
        avgQueue: this.t ? this.queueInt / this.t : 0, C: this.C, dos: { A: d[0], B: d[1] },
        modelErr: this.t ? this.modelErr / this.t / 4 : 0, t: this.t, split: this.splitStats, last: this.lastDecision };
    }

    start() {
      if (this._raf) return; this._last = performance.now(); this._acc = 0;
      const loop = now => {
        this._acc += (now - this._last) / 1000 * this.opts.speed; this._last = now;
        let n = 0; while (this._acc >= 1 && n < 200) { this.tick(); this._acc -= 1; n++; }
        this.draw(); this._raf = requestAnimationFrame(loop);
      };
      this._raf = requestAnimationFrame(loop);
    }
    stop() { cancelAnimationFrame(this._raf); this._raf = null; }

    resize() {
      const r = this.cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      this.cv.width = Math.max(10, r.width * dpr); this.cv.height = Math.max(10, r.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); this.W = r.width; this.H = r.height; this.draw();
    }

    draw() {
      const c = this.ctx, W = this.W, H0 = this.H; if (!W) return;
      const tok = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
      const bar = this.opts.compact ? 0 : 34, H = H0 - bar, cx = W / 2, cy = H / 2, rw = Math.min(W, H) * 0.12;
      c.clearRect(0, 0, W, H0);
      c.fillStyle = tok('--road-verge'); c.fillRect(0, 0, W, H);
      c.fillStyle = tok('--road'); c.fillRect(0, cy - rw, W, 2 * rw); c.fillRect(cx - rw, 0, 2 * rw, H);
      c.strokeStyle = tok('--marking'); c.lineWidth = 2; c.setLineDash([10, 10]);
      [[0, cy, cx - rw, cy], [cx + rw, cy, W, cy], [cx, 0, cx, cy - rw], [cx, cy + rw, cx, H]].forEach(([a, b, d, e]) => { c.beginPath(); c.moveTo(a, b); c.lineTo(d, e); c.stroke(); });
      c.setLineDash([]);
      const len = { W: cx - rw - 8, E: W - cx - rw - 8, N: cy - rw - 8, S: H - cy - rw - 8 };
      const geo = {
        W: { sx: cx - rw - 4, sy: cy + rw / 2, dx: -1, dy: 0 }, E: { sx: cx + rw + 4, sy: cy - rw / 2, dx: 1, dy: 0 },
        N: { sx: cx - rw / 2, sy: cy - rw - 4, dx: 0, dy: -1 }, S: { sx: cx + rw / 2, sy: cy + rw + 4, dx: 0, dy: 1 },
      };
      const sz = Math.max(3.5, rw * 0.36), gap = sz * 1.5;
      const green = this.mode === 'green' ? this.cur : -1, amber = this.mode === 'ig' && this.t - this.igStart < AMBER ? this.cur : -1;
      const veh = (x, y, horiz, v) => {
        const L = v.truck ? 2.2 : 1.4;
        c.fillStyle = v.truck ? tok('--car-alt') : tok('--car');
        c.fillRect(x - (horiz ? sz * L / 2 : sz * 0.45), y - (horiz ? sz * 0.45 : sz * L / 2), horiz ? sz * L : sz * 0.9, horiz ? sz * 0.9 : sz * L);
      };
      for (const a in geo) {
        const G = geo[a], horiz = G.dy === 0, Lp = len[a];
        // stop line
        c.strokeStyle = tok('--marking'); c.lineWidth = 3; c.beginPath();
        if (horiz) { c.moveTo(G.sx - G.dx * 1, G.sy - rw / 2); c.lineTo(G.sx - G.dx * 1, G.sy + rw / 2); } else { c.moveTo(G.sx - rw / 2, G.sy - G.dy); c.lineTo(G.sx + rw / 2, G.sy - G.dy); }
        c.stroke();
        // upstream SCOOT detector near the far end
        const dd = Lp * 0.86, dx = G.sx + G.dx * dd, dy = G.sy + G.dy * dd;
        c.strokeStyle = this.det[a] > 0.3 ? tok('--amber') : tok('--loop'); c.lineWidth = 2;
        c.strokeRect(dx - sz * 0.9, dy - sz * 0.9, sz * 1.8, sz * 1.8);
        // model queue (amber bar, beside the lane)
        const mq = this.model[a].q / 1.8, mlen = Math.min(Lp * 0.8, mq * gap);
        c.fillStyle = tok('--amber'); c.globalAlpha = 0.55;
        const off = rw * 0.42;
        if (horiz) c.fillRect(Math.min(G.sx, G.sx + G.dx * mlen), G.sy + (a === 'W' ? off : -off) - 2, mlen, 4);
        else c.fillRect(G.sx + (a === 'N' ? -off : off) - 2, Math.min(G.sy, G.sy + G.dy * mlen), 4, mlen);
        c.globalAlpha = 1;
        // real queue
        this.q[a].slice(0, 40).forEach((v, i) => veh(G.sx + G.dx * (6 + i * gap), G.sy + G.dy * (6 + i * gap), horiz, v));
        // travelling vehicles (between detector and queue tail)
        const tail = 6 + this.q[a].length * gap;
        this.trav[a].forEach(v => {
          const k = Math.min(1, (this.t - v.born) / Math.max(1, v.arrive - v.born));
          const dist = dd + (tail - dd) * k;
          if (dist < tail) return;
          veh(G.sx + G.dx * dist, G.sy + G.dy * dist, horiz, v);
        });
        // signal head
        const st = APPR[a], col = green === st ? tok('--go') : amber === st ? tok('--amber') : tok('--stop');
        const hx = { W: cx - rw - 12, E: cx + rw + 12, N: cx - rw - 12, S: cx + rw + 12 }[a];
        const hy = { W: cy + rw + 12, E: cy - rw - 12, N: cy - rw - 12, S: cy + rw + 12 }[a];
        c.fillStyle = tok('--signal-body'); c.beginPath(); c.arc(hx, hy, 8, 0, 7); c.fill();
        c.fillStyle = col; c.beginPath(); c.arc(hx, hy, 5.5, 0, 7); c.fill();
      }
      if (bar) {
        const y0 = H + 10, bw = W - 20, x0 = 10, C = this.C;
        if (this.opts.mode === 'actuated') {
          c.fillStyle = tok('--muted'); c.font = '12px Barlow, system-ui, sans-serif';
          c.fillText(`Vehicle actuated: no cycle plan. Stage ${STAGES[this.cur]} ${this.mode === 'green' ? 'green' : 'intergreen'} for ${this.t - (this.mode === 'green' ? this.since : this.igStart)} s`, x0, y0 + 11);
        } else {
          const w = this.windows();
          w.forEach(([s, e], i) => {
            const len = ((e - s) % C + C) % C, col = i === 0 ? tok('--phase-a') : tok('--phase-b');
            const seg = (from, l) => { c.fillStyle = col; c.fillRect(x0 + from / C * bw, y0, l / C * bw, 14); };
            if (s + len <= C) seg(s, len); else { seg(s, C - s); seg(0, len - (C - s)); }
            c.fillStyle = tok('--fg'); c.font = '600 11px Barlow, system-ui, sans-serif';
            c.fillText(`${STAGES[i]} ${len.toFixed(0)}s`, x0 + ((s + 2) % C) / C * bw, y0 + 11);
          });
          c.fillStyle = tok('--fg'); c.fillRect(x0 + this.tau() / C * bw - 1, y0 - 4, 2, 22);
        }
      }
    }
  }
  IntersectionSim.CRUISE = CRUISE;
  g.IntersectionSim = IntersectionSim;
})(window);
