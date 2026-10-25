(function () {
  const $ = id => document.getElementById(id);
  const S = SCOOT;
  const bind = (id, fmt, fn) => { const el = $(id), out = $(id + 'o'); const f = () => { out.textContent = fmt(+el.value); fn && fn(); }; el.addEventListener('input', f); return f; };
  const redraws = [];

  // ---------- 1 CV sampling ----------
  function cvDraw() {
    const p = +$('cvP').value, n = +$('cvN').value, lpv = 1.95, truth = n * lpv, rand = S.rng(9);
    const est = []; let zero = 0;
    for (let k = 0; k < 2000; k++) { let c = 0; for (let i = 0; i < n; i++) if (rand() < p) c++; if (!c) zero++; est.push(c / p * lpv); }
    const mean = est.reduce((a, b) => a + b, 0) / est.length, sd = Math.sqrt(est.reduce((a, b) => a + (b - mean) ** 2, 0) / est.length);
    $('cvTrue').textContent = truth.toFixed(1); $('cvSd').textContent = '±' + Math.round(100 * sd / truth) + ' %'; $('cvZero').textContent = Math.round(100 * zero / 2000) + ' %';
    const cv = $('cvCv'), r = cv.getBoundingClientRect(), d = devicePixelRatio || 1; cv.width = r.width * d; cv.height = r.height * d;
    const c = cv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, r.width, r.height);
    const max = truth * 3, bins = 40, h = new Array(bins).fill(0); est.forEach(e => h[Math.min(bins - 1, Math.floor(e / max * bins))]++);
    const top = Math.max(...h), L = 30, W = r.width - L - 10, H = r.height - 28;
    c.fillStyle = tok('--phase-b'); h.forEach((v, i) => c.fillRect(L + i * W / bins + 1, 8 + H - H * v / top, W / bins - 2, H * v / top));
    c.fillStyle = tok('--stop'); c.fillRect(L + truth / max * W - 1, 4, 3, H + 4);
    c.fillStyle = tok('--muted'); c.font = '12px Barlow, sans-serif';
    for (let k = 0; k <= 4; k++) c.fillText((max * k / 4).toFixed(0), L + W * k / 4 - 6, r.height - 6);
    c.fillText('estimated LPU per cycle (red = true)', L + 4, 18);
  }
  [bind('cvP', v => Math.round(v * 100) + ' %', cvDraw), bind('cvN', v => v, cvDraw)].forEach(f => f()); redraws.push(cvDraw);

  // ---------- 2 RL toy ----------
  const AV = 50, SAT = 1.0;
  function episode(policy, rand, learn) {
    let qa = 3, qb = 3, gA = 25, tot = 0, prev = null, dA = 20, dB = 20;
    for (let k = 0; k < 60; k++) {
      const ph = 2 * Math.PI * k / 60, la = (900 + 500 * Math.sin(ph)) / 3600, lb = (600 - 350 * Math.sin(ph)) / 3600;
      const st = Math.min(3, Math.floor(qa / 6)) * 16 + Math.min(3, Math.floor(qb / 6)) * 4 + Math.min(3, Math.floor((gA - 8) / 9));
      const opts = [-4, 0, 4].filter(d => gA + d >= 8 && AV - gA - d >= 8);
      let d;
      if (policy === 'fixed') d = 0;
      else if (policy === 'dos') { const o = {}; opts.forEach(x => o[x] = Math.max(dA / ((gA + x) * SAT), dB / ((AV - gA - x) * SAT))); d = S.chooseMin(o); }
      else d = policy.act(st, opts, rand);
      gA += d;
      const arrA = S.poisson(rand, la * 60), arrB = S.poisson(rand, lb * 60);
      qa += arrA; qb += arrB; dA = 0.7 * dA + 0.3 * arrA; dB = 0.7 * dB + 0.3 * arrB;
      qa -= Math.min(qa, Math.floor(gA * SAT / 2)); qb -= Math.min(qb, Math.floor((AV - gA) * SAT / 2));
      tot += qa + qb;
      const s2 = Math.min(3, Math.floor(qa / 6)) * 16 + Math.min(3, Math.floor(qb / 6)) * 4 + Math.min(3, Math.floor((gA - 8) / 9));
      if (learn && prev) policy.update(prev[0], prev[1], -(qa + qb) / 10, s2);
      prev = [st, [-4, 0, 4].indexOf(d)];
    }
    return tot / 60;
  }
  function Agent() { this.Q = Array.from({ length: 64 }, () => [0, 0, 0]); this.eps = 0.3; }
  Agent.prototype.act = function (s, opts, rand) {
    const idx = opts.map(o => [-4, 0, 4].indexOf(o));
    if (rand() < this.eps) return opts[Math.floor(rand() * opts.length)];
    let best = idx[0]; idx.forEach(i => { if (this.Q[s][i] > this.Q[s][best]) best = i; }); return [-4, 0, 4][best];
  };
  Agent.prototype.update = function (s, a, r, s2) { this.Q[s][a] += 0.1 * (r + 0.9 * Math.max(...this.Q[s2]) - this.Q[s][a]); };
  let agent, curve, baseDs, baseFix, busy = false;
  function rlReset() {
    agent = new Agent(); curve = []; const r1 = S.rng(77), r2 = S.rng(77); baseDs = 0; baseFix = 0;
    for (let i = 0; i < 20; i++) { baseDs += episode('dos', r1) / 20; baseFix += episode('fixed', r2) / 20; }
    $('rlEp').textContent = 0; $('rlQ').textContent = '–'; $('rlDs').textContent = baseDs.toFixed(1); rlDraw();
  }
  function rlDraw() {
    const sm = curve.map((_, i) => { const w = curve.slice(Math.max(0, i - 19), i + 1); return w.reduce((a, b) => a + b, 0) / w.length; });
    const n = Math.max(sm.length, 2);
    lineChart($('rlCv'), [{ color: '--fg', data: sm }, { color: '--amber', data: new Array(n).fill(baseDs) }, { color: '--muted', data: new Array(n).fill(baseFix), width: 1 }], { ymin: 0, xlabel: 'training episodes (20-episode moving average)' });
  }
  $('rlGo').addEventListener('click', () => {
    if (busy) return; busy = true; $('rlGo').disabled = true; const rand = S.rng(1000 + curve.length); let done = 0;
    const chunk = () => {
      for (let i = 0; i < 10; i++) { agent.eps = Math.max(0.02, 0.3 * (1 - curve.length / 300)); curve.push(episode(agent, rand, true)); done++; }
      $('rlEp').textContent = curve.length; const last = curve.slice(-20); $('rlQ').textContent = (last.reduce((a, b) => a + b, 0) / last.length).toFixed(1);
      rlDraw(); if (done < 300) setTimeout(chunk, 16); else { busy = false; $('rlGo').disabled = false; $('rlGo').textContent = 'Train 300 more'; }
    };
    chunk();
  });
  $('rlReset').addEventListener('click', () => { if (!busy) { rlReset(); $('rlGo').textContent = 'Train 300 episodes'; } });
  rlReset(); redraws.push(rlDraw);

  // ---------- 3 pressure-aware split ----------
  function mpDraw() {
    const dA = +$('mpDa').value, dB = +$('mpDb').value, oA = +$('mpOa').value, lam = +$('mpL').value;
    const gA = 26, gB = 20, rows = [];
    for (const [name, wA] of [['SCOOT DoS rule', 1], ['Exit-aware', 1 / (1 + lam * oA)]]) {
      const sc = {}; for (const d of [-4, 0, 4]) sc[d] = Math.max(dA * gA / (gA + d) * wA, dB * gB / (gB - d));
      const ch = S.chooseMin(sc);
      rows.push(`<tr><td>${name}</td>${[-4, 0, 4].map(d => `<td class="num">${sc[d].toFixed(2)}</td>`).join('')}<td>${ch > 0 ? 'advance (+4 to A)' : ch < 0 ? 'retard (−4 from A)' : 'keep'}</td></tr>`);
    }
    $('mpT').innerHTML = rows.join('');
  }
  [bind('mpDa', v => v.toFixed(2), mpDraw), bind('mpDb', v => v.toFixed(2), mpDraw), bind('mpOa', v => Math.round(v * 100) + ' %', mpDraw), bind('mpL', v => v.toFixed(1), mpDraw)].forEach(f => f());

  // ---------- 4 faults ----------
  let ft = 'ok', fh = 'none';
  function ftDraw() {
    const C = 60, trueA = 44, B = 16, sat = 2.0, hist = 42, avail = C - 10 + 2;
    let seen = ft === 'ok' ? trueA : ft === 'off' ? 0 : 2 * 3 * C;      // stuck-on: 2 LPU/s per lane, 3 lanes
    if (ft !== 'ok' && fh === 'astrid') seen = hist;
    const effA = Math.max(9, Math.min(avail - 9, avail * seen / (seen + B))), effB = avail - effA;
    $('ftMeas').textContent = seen.toFixed(0) + (ft !== 'ok' && fh === 'astrid' ? ' (historic)' : '');
    $('ftDos').textContent = `${(seen / (effA * sat)).toFixed(2)} / ${(B / (effB * sat)).toFixed(2)}`;
    $('ftGreen').textContent = (effA - 1).toFixed(0) + ' s';
    const real = trueA / (effA * sat);
    $('ftReal').textContent = real.toFixed(2) + (real > 1 ? ' (queue grows)' : '');
  }
  const seg = (id, attr, set) => document.querySelectorAll(`#${id} button`).forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll(`#${id} button`).forEach(x => x.setAttribute('aria-pressed', x === b)); set(b.dataset[attr]); ftDraw(); }));
  seg('ftType', 'f', v => ft = v); seg('ftHand', 'h', v => fh = v); ftDraw();

  // ---------- 5 stop weight on one link ----------
  function emDraw() {
    const K = +$('emK').value, C = 60, sat = 1.95;
    const base = new Array(C).fill(0); for (let i = 0; i < 26; i++) base[i] = 1.2;
    const arr0 = S.disperse(base, 20), mask = S.effGreenMask(C, 0, 30, 3, 4);
    let best = null;
    for (let o = 0; o < C; o++) {
      const r = S.simulateQueue(S.roll(arr0, -o), mask, sat, 3), pi = S.pi(r.delay, r.stops, K);
      if (!best || pi < best.pi - 1e-9) best = { o, pi, r };
    }
    $('emOff').textContent = best.o; $('emDelay').textContent = (best.r.delay / 1.95).toFixed(0); $('emStops').textContent = (best.r.stops / 1.95).toFixed(1);
  }
  bind('emK', v => v + ' s', emDraw)();

  // ---------- results tables + findings ----------
  const R = window.RESULTS || {};
  const table = (rows, cols) => !rows ? '<p class="muted">Run the script to generate results.</p>' : `<table class="data"><thead><tr>${cols.map(c => `<th>${c[1]}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${cols.map(c => `<td>${r[c[0]] ?? '–'}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const cols = [['label', 'Run'], ['avg_delay', 'Mean delay (s)'], ['stops_per_veh', 'Stops / veh'], ['bus_avg_delay', 'Bus delay (s)']];
  $('cvTable').innerHTML = table(R.cv, cols);
  $('rlTable').innerHTML = table(R.rl, cols);
  $('mpTable').innerHTML = table(R.maxpressure, cols);
  $('ftTable').innerHTML = table(R.faults, cols.concat([['failed_detectors', 'Failed detectors']]));
  $('emTable').innerHTML = table(R.emissions, [['label', 'Stop weight'], ['avg_delay', 'Mean delay (s)'], ['stops_per_veh', 'Stops / veh'], ['co2_g_per_veh', 'CO2 (g/veh)']]);
  $('glTable').innerHTML = table(R.glosa, [['horizon_s', 'Seconds ahead'], ['mae_s', 'Mean abs. error (s)'], ['p90_s', '90th percentile (s)'], ['n', 'Predictions']]);

  Quiz($('quizM'), QUIZ.mastery, 'mastery');
  addEventListener('themechange', () => redraws.forEach(f => f()));
  addEventListener('resize', () => redraws.forEach(f => f()));
})();
