(function () {
  const $ = id => document.getElementById(id);
  const S = SCOOT;
  const bind = (id, fmt, fn) => { const el = $(id), out = $(id + 'o'); const f = () => { out.textContent = fmt(+el.value); fn && fn(); }; el.addEventListener('input', f); return f; };
  const prep = cv => { const r = cv.getBoundingClientRect(), d = devicePixelRatio || 1; cv.width = r.width * d; cv.height = r.height * d; const c = cv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, r.width, r.height); c.font = '12px Barlow, sans-serif'; return [c, r.width, r.height]; };
  const redraws = [];

  // ---------- LPU calculator ----------
  function lpuCalc() {
    const L = +$('lpLen').value, v = +$('lpSpd').value, loop = +$('lpLoop').value;
    const occ = (L + loop) / v, val = S.lpu(1, occ), car = S.lpu(1, (4.8 + loop) / 13.5);
    $('lpOcc').textContent = occ.toFixed(2); $('lpVal').textContent = val.toFixed(2); $('lpRel').textContent = (val / car).toFixed(2);
  }
  [bind('lpLen', v => v + ' m', lpuCalc), bind('lpSpd', v => v + ' m/s', lpuCalc), bind('lpLoop', v => v.toFixed(1) + ' m', lpuCalc)].forEach(f => f());

  // ---------- dispersion ----------
  function dpDraw() {
    const T = +$('dpT').value, G = +$('dpG').value, C = 90;
    const det = new Array(C).fill(0); for (let i = 5; i < 5 + G; i++) det[i] = 1.8;
    const out = S.disperse(det, T), { F, lag } = S.robertson(T);
    $('dpF').textContent = F.toFixed(3); $('dpLag').textContent = lag; $('dpPk').textContent = Math.round(100 * Math.max(...out) / 1.8) + ' %';
    const [c, W, H] = prep($('dpCv')), L = 34, X = i => L + (W - L - 8) * i / C, Y = v => H - 22 - (H - 34) * v / 2;
    c.fillStyle = tok('--phase-b'); det.forEach((v, i) => { if (v) c.fillRect(X(i), Y(v), (W - L - 8) / C, Y(0) - Y(v)); });
    c.strokeStyle = tok('--fg'); c.lineWidth = 2; c.beginPath(); out.forEach((v, i) => i ? c.lineTo(X(i), Y(v)) : c.moveTo(X(i), Y(v))); c.stroke();
    c.fillStyle = tok('--muted'); for (let s = 0; s <= C; s += 15) c.fillText(s + ' s', X(s) - 6, H - 6);
    c.fillText('LPU/s', 2, 14);
  }
  [bind('dpT', v => v + ' s', dpDraw), bind('dpG', v => v + ' s', dpDraw)].forEach(f => f()); redraws.push(dpDraw);

  // ---------- queue model, one cycle ----------
  function qmDraw() {
    const C = 60, gs = +$('qmG').value, gl = +$('qmL').value, ps = +$('qmP').value, flow = +$('qmV').value;
    const sat = 0.5 * 1.95, perCycle = flow / 3600 * C * 1.95;
    const base = new Array(C).fill(0); for (let i = 0; i < 18; i++) base[(ps + i) % C] = 1;
    const arr0 = S.disperse(base, 12), tot = arr0.reduce((a, b) => a + b, 0), arr = arr0.map(v => v * perCycle / tot);
    const mask = S.effGreenMask(C, gs, (gs + gl) % C, 3, 4), res = S.simulateQueue(arr, mask, sat, 4);
    const geff = mask.filter(Boolean).length;
    $('qmDos').textContent = S.dos(perCycle, geff, sat).toFixed(2);
    $('qmDelay').textContent = (res.delay / 1.95).toFixed(0); $('qmStops').textContent = (res.stops / 1.95).toFixed(1); $('qmMax').textContent = (res.qmax / 1.95).toFixed(1);
    const [c, W, H] = prep($('qmCv')), L = 34, X = i => L + (W - L - 8) * i / C;
    const qmax = Math.max(4, ...res.trace.map(v => v / 1.95)), Yq = v => H - 22 - (H - 40) * v / qmax, Ya = v => H - 22 - (H - 40) * v / 1.5;
    c.fillStyle = tok('--phase-a'); c.globalAlpha = 0.5; mask.forEach((m, i) => { if (m) c.fillRect(X(i), 8, (W - L - 8) / C + 0.5, H - 30); }); c.globalAlpha = 1;
    c.fillStyle = tok('--phase-b'); arr.forEach((v, i) => c.fillRect(X(i) + 1, Ya(v), (W - L - 8) / C - 2, Ya(0) - Ya(v)));
    c.strokeStyle = tok('--stop'); c.lineWidth = 2.2; c.beginPath(); res.trace.forEach((v, i) => i ? c.lineTo(X(i), Yq(v / 1.95)) : c.moveTo(X(i), Yq(v / 1.95))); c.stroke();
    c.fillStyle = tok('--muted'); for (let s = 0; s <= C; s += 10) c.fillText(s + ' s', X(s) - 6, H - 6);
    c.fillText(`queue (veh, max ${qmax.toFixed(0)})`, L + 4, 20);
  }
  [bind('qmG', v => v + ' s', qmDraw), bind('qmL', v => v + ' s', qmDraw), bind('qmP', v => v + ' s', qmDraw), bind('qmV', v => v + ' veh/h', qmDraw)].forEach(f => f()); redraws.push(qmDraw);

  // ---------- validation game ----------
  let vlSeed = 3, truth;
  function newStreet() { const r = S.rng(vlSeed); truth = { sat: 0.8 + r() * 1.2, sl: 1 + Math.floor(r() * 5), q0: 14 + Math.floor(r() * 10), arr: 0.25 + r() * 0.25 }; }
  function clearTime(sat, sl, q0, arr) { let q = q0 * 1.95, t = 0; const tr = []; while (t < 60) { if (t >= sl) q = Math.max(0, q + arr - sat); else q += arr; tr.push(q / 1.95); if (q <= 0.01 && t >= sl) break; t++; } return { t, tr }; }
  function vlDraw() {
    const sat = +$('vlSat').value, sl = +$('vlSl').value;
    const ob = clearTime(truth.sat, truth.sl, truth.q0, truth.arr), md = clearTime(sat, sl, truth.q0, truth.arr);
    $('vlObs').textContent = ob.t; $('vlMod').textContent = md.t;
    const ok = Math.abs(ob.t - md.t) <= 1 && Math.abs(sl - truth.sl) <= 1;
    $('vlVerdict').textContent = ok ? 'validated' : md.t < ob.t ? 'model clears too early' : 'model clears too late';
    const [c, W, H] = prep($('vlCv')), L = 34, X = i => L + (W - L - 8) * i / 60, Y = v => H - 22 - (H - 34) * v / (truth.q0 + 6);
    [[ob.tr, '--fg'], [md.tr, '--stop']].forEach(([tr, col]) => { c.strokeStyle = tok(col); c.lineWidth = 2; c.beginPath(); tr.forEach((v, i) => i ? c.lineTo(X(i), Y(v)) : c.moveTo(X(i), Y(v))); c.stroke(); });
    c.fillStyle = tok('--fg'); c.fillRect(X(ob.t) - 1, 8, 2, H - 30);
    c.fillStyle = tok('--muted'); for (let s = 0; s <= 60; s += 10) c.fillText(s + ' s', X(s) - 6, H - 6); c.fillText('queue (veh) from green start', L + 4, 14);
  }
  newStreet();
  [bind('vlSat', v => v.toFixed(2), vlDraw), bind('vlSl', v => v + ' s', vlDraw)].forEach(f => f());
  $('vlNew').addEventListener('click', () => { vlSeed++; newStreet(); vlDraw(); }); redraws.push(vlDraw);

  // ---------- live junction ----------
  const sim = new IntersectionSim($('liveCv'), { mode: 'scoot', speed: 5 });
  const setD = () => sim.setDemand({ W: +$('lvMain').value, E: +$('lvMain').value * 0.92, N: +$('lvSide').value, S: +$('lvSide').value * 0.92 });
  [bind('lvMain', v => v + ' veh/h', setD), bind('lvSide', v => v + ' veh/h', setD), bind('lvSpd', v => v + '×', () => sim.setSpeed(+$('lvSpd').value))].forEach(f => f());
  document.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('[data-mode]').forEach(x => x.setAttribute('aria-pressed', x === b));
    sim.setMode(b.dataset.mode); setD(); chart();
  }));
  let running = true;
  $('lvPause').addEventListener('click', () => { running = !running; running ? sim.start() : sim.stop(); $('lvPause').textContent = running ? 'Pause' : 'Resume'; });
  $('lvReset').addEventListener('click', () => { sim.reset(); setD(); chart(); });
  function chart() {
    const H = sim.history.slice(-40);
    lineChart($('lvChart'), [{ color: '--fg', data: H.map(r => r.C / 100), step: true }, { color: '--go', data: H.map(r => r.dos.A) }, { color: '--phase-b', data: H.map(r => r.dos.B) }],
      { ymin: 0, ymax: 1.5, hlines: [{ y: 0.9, color: '--amber' }], xlabel: 'last 40 cycles' });
  }
  sim.on(chart);
  setInterval(() => {
    const s = sim.stats();
    $('lvC').textContent = sim.opts.mode === 'actuated' ? '–' : s.C.toFixed(0);
    $('lvDs').textContent = `${s.dos.A.toFixed(2)} / ${s.dos.B.toFixed(2)}`; $('lvD').textContent = s.avgDelay.toFixed(1); $('lvErr').textContent = s.modelErr.toFixed(2);
    if (sim.opts.mode === 'scoot' && s.last) {
      const L = s.last, opts = Object.keys(L.dos).sort((a, b) => a - b).map(k => `${+k > 0 ? '+' : ''}${k} s → ${L.dos[k].toFixed(2)}`).join(', ');
      $('lvLast').textContent = `Last split decision, end of stage ${L.stage}: max DoS ${opts}. Chose ${L.d > 0 ? 'advance +4 s' : L.d < 0 ? 'retard −4 s' : 'keep'}.`;
    } else $('lvLast').textContent = sim.opts.mode === 'scoot' ? 'Split decisions appear here.' : 'No optimiser in this mode.';
  }, 500);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) sim.start(); else { for (let i = 0; i < 600; i++) sim.tick(); sim.draw(); running = false; $('lvPause').textContent = 'Resume'; }
  chart(); redraws.push(() => { sim.draw(); chart(); });

  // ---------- race ----------
  $('raceBtn').addEventListener('click', () => {
    const cv = document.createElement('canvas'); const rows = [];
    for (const mode of ['fixed', 'actuated', 'scoot']) {
      const s = new IntersectionSim(cv, { mode, seed: 11 });
      for (let t = 0; t < 3600; t++) { const pk = t >= 1200 && t < 2400; s.setDemand(pk ? { W: 780, E: 720, N: 380, S: 350 } : { W: 420, E: 400, N: 200, S: 190 }); s.tick(); }
      const st = s.stats(); rows.push([mode, st.avgDelay, st.avgQueue, st.served, mode === 'actuated' ? '–' : st.C]);
    }
    const best = Math.min(...rows.map(r => r[1]));
    $('raceT').tBodies[0].innerHTML = rows.map(r => `<tr class="${r[1] === best ? 'best' : ''}"><td>${r[0]}</td><td>${r[1].toFixed(1)}</td><td>${r[2].toFixed(1)}</td><td>${r[3]}</td><td>${r[4]}</td></tr>`).join('');
  });

  // ---------- webster ----------
  function web() {
    const L = +$('wL').value, a = +$('wA').value, b = +$('wB').value, Y = a + b, C = S.webster(L, Y);
    $('wY').textContent = Y.toFixed(2);
    if (!isFinite(C)) { $('wC').textContent = 'over capacity'; $('wS').textContent = '–'; return; }
    const eff = C - L; $('wC').textContent = C.toFixed(0); $('wS').textContent = `${(eff * a / Y).toFixed(0)} / ${(eff * b / Y).toFixed(0)}`;
  }
  [bind('wL', v => v + ' s', web), bind('wA', v => v.toFixed(2), web), bind('wB', v => v.toFixed(2), web)].forEach(f => f());

  // ---------- SUMO table ----------
  const R = window.RESULTS || {};
  if (R.foundation) $('fTable').innerHTML = `<table class="data"><thead><tr><th>Controller</th><th>Mean delay (s)</th><th>Travel time (s)</th><th>Stops / veh</th></tr></thead><tbody>${R.foundation.map(r => `<tr><td>${r.label}</td><td>${r.avg_delay}</td><td>${r.avg_travel_time}</td><td>${r.stops_per_veh}</td></tr>`).join('')}</tbody></table>`;

  Quiz($('quizF'), QUIZ.foundation, 'foundation');
  addEventListener('themechange', () => redraws.forEach(f => f()));
  addEventListener('resize', () => redraws.forEach(f => f()));
})();
