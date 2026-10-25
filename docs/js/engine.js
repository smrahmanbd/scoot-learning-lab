/* SCOOT engine - JavaScript mirror of sumo/scoot/core.py.
   Educational re-implementation of published SCOOT principles; numeric settings are illustrative. */
(function (g) {
  const S = {};

  // LPU: hybrid of count and occupancy (lab definition: 1 per vehicle + 2 per occupied second)
  S.lpu = (vehicles, occSeconds) => 1.0 * vehicles + 2.0 * occSeconds;

  // Robertson platoon dispersion (TRANSYT / SCOOT)
  S.robertson = (T, alpha = 0.35, beta = 0.8) => ({ F: 1 / (1 + alpha * beta * T), lag: Math.max(1, Math.round(beta * T)) });
  S.disperse = (profile, T, cyclic = true) => {
    const { F, lag } = S.robertson(T), n = profile.length, out = new Array(n).fill(0);
    let prev = cyclic ? profile.reduce((a, b) => a + b, 0) / n : 0;
    for (let pass = 0; pass < (cyclic ? 2 : 1); pass++)
      for (let i = 0; i < n; i++) {
        const src = cyclic ? profile[((i - lag) % n + n) % n] : (i >= lag ? profile[i - lag] : 0);
        prev = F * src + (1 - F) * prev; out[i] = prev;
      }
    return out;
  };

  S.effGreenMask = (C, gStart, gEnd, startLag, endLag) => {
    const a = gStart + startLag, b = gEnd + endLag, m = new Array(C).fill(false);
    let len = ((b - a) % C + C) % C; if (len === 0 && b !== a) len = C;
    for (let k = 0; k < Math.round(len); k++) m[(Math.round(a + k) % C + C) % C] = true;
    return m;
  };

  // cyclic queue model; returns stats of the last cycle and the queue trace
  S.simulateQueue = (arr, eff, sat, cycles = 3, q0 = 0) => {
    const n = arr.length; let q = q0, delay = 0, stops = 0, qmax = 0; const trace = [];
    for (let c = 0; c < cycles; c++) {
      const last = c === cycles - 1;
      for (let i = 0; i < n; i++) {
        if ((q > 0.01 || !eff[i]) && last) stops += arr[i];
        q += arr[i];
        if (eff[i]) q -= Math.min(q, sat);
        if (last) { delay += q; qmax = Math.max(qmax, q); trace.push(q); }
      }
    }
    return { delay, stops, residual: q, qmax, trace };
  };

  S.dos = (demand, effGreen, sat, residual = 0) => effGreen * sat <= 0 ? 9.9 : (demand + residual) / (effGreen * sat);
  S.pi = (delay, stops, K = 4, lpuPerVeh = 1.95) => (delay + K * stops) / lpuPerVeh;

  S.stageWindows = (changes, igs, C) => changes.map((c, k) => {
    const prev = (k - 1 + changes.length) % changes.length;
    return [((changes[prev] + igs[prev]) % C + C) % C, ((c % C) + C) % C];
  });
  S.greenLengths = (changes, igs, C) => S.stageWindows(changes, igs, C).map(([s, e]) => ((e - s) % C + C) % C);

  S.splitOptions = (changes, k, igs, mins, C, auth = 4) => {
    const o = [];
    for (const d of [-auth, 0, auth]) {
      const t = changes.slice(); t[k] = ((t[k] + d) % C + C) % C;
      const gl = S.greenLengths(t, igs, C);
      if (gl.every((v, i) => v >= mins[i] - 1e-6)) o.push(d);
    }
    return o.length ? o : [0];
  };
  S.chooseMin = obj => {
    const keys = Object.keys(obj).map(Number); const best = Math.min(...keys.map(k => obj[k]));
    if (Math.abs((obj[0] ?? 99) - best) < 1e-9) return 0;
    return keys.filter(k => Math.abs(obj[k] - best) < 1e-9).sort((a, b) => Math.abs(a) - Math.abs(b))[0];
  };

  S.cycleStep = C => C < 64 ? 4 : C < 128 ? 8 : 16;
  S.cycleDefaults = { cmin: 40, cmax: 120, target: 0.9, lower: 0.8, period: 300, fast: 150 };

  S.resample = (p, n) => {
    if (p.length === n || !p.length) return p.slice();
    const tot = p.reduce((a, b) => a + b, 0); const out = [];
    for (let i = 0; i < n; i++) out.push(p[Math.floor(i * p.length / n)]);
    const s = out.reduce((a, b) => a + b, 0) || 1; return out.map(v => v * tot / s);
  };
  S.roll = (p, k) => { const n = p.length; k = ((Math.round(k) % n) + n) % n; return k ? p.slice(n - k).concat(p.slice(0, n - k)) : p.slice(); };

  S.webster = (L, Y) => Y >= 0.95 ? Infinity : (1.5 * L + 5) / (1 - Y);

  S.rng = seed => { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1e9) / 1e9; }; };
  S.poisson = (rand, lambda) => { const L = Math.exp(-lambda); let k = 0, p = 1; do { k++; p *= rand(); } while (p > L); return k - 1; };

  g.SCOOT = S;
})(window);
