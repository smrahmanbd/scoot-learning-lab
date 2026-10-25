(function () {
  const $ = id => document.getElementById(id);
  const S = SCOOT;
  const bind = (id, fmt, fn) => { const el = $(id), out = $(id + 'o'); const f = () => { out.textContent = fmt(+el.value); fn && fn(); }; el.addEventListener('input', f); return f; };
  const prep = cv => { const r = cv.getBoundingClientRect(), d = devicePixelRatio || 1; cv.width = r.width * d; cv.height = r.height * d; const c = cv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, r.width, r.height); c.font = '12px Barlow, sans-serif'; return [c, r.width, r.height]; };
  const redraws = [];

  // ================= split optimiser =================
  const SP = { C: 60, IG: 5, SAT: 2.0, MIN: 8 };
  let sp, spRand;
  function spReset() { sp = { stored: 27, hist: [], counts: { '-4': 0, '0': 0, '4': 0 }, last: null }; spRand = S.rng(4); spTable(); spDraw(); }
  const effG = g => g - 3 + 4;
  function spDos(gA, dA, dB) { const gB = SP.C - 2 * SP.IG - gA; return [dA / (effG(gA) * SP.SAT), dB / (effG(gB) * SP.SAT)]; }
  function spOne() {
    const n = +$('spN').value, dA = +$('spA').value * (1 + (spRand() - 0.5) * 2 * n), dB = +$('spB').value * (1 + (spRand() - 0.5) * 2 * n);
    const opts = {}, rows = [];
    for (const d of [-4, 0, 4]) {
      const gA = sp.stored + d, gB = SP.C - 2 * SP.IG - gA;
      if (gA < SP.MIN || gB < SP.MIN) continue;
      const [a, b] = spDos(gA, dA, dB); opts[d] = Math.max(a, b); rows.push([d, gA, gB, a, b]);
    }
    const d = S.chooseMin(opts);
    sp.counts[String(d)]++;
    const actual = sp.stored + d;
    if (d) sp.stored += Math.sign(d);
    const tot = SP.C - 2 * SP.IG + 2, bal = Math.max(SP.MIN, Math.min(SP.C - 2 * SP.IG - SP.MIN, tot * (+$('spA').value) / (+$('spA').value + +$('spB').value) - 1));
    sp.hist.push({ stored: sp.stored, actual, bal }); if (sp.hist.length > 60) sp.hist.shift();
    sp.last = { rows, d };
  }
  function spTable() {
    const L = sp.last;
    $('spT').innerHTML = L ? L.rows.map(([d, a, b, x, y]) => `<tr class="${d === L.d ? 'best' : ''}"><td>${d > 0 ? 'advance +4 s' : d < 0 ? 'retard −4 s' : 'keep'}</td><td class="num">${a} / ${b}</td><td class="num">${x.toFixed(2)}</td><td class="num">${y.toFixed(2)}</td><td class="num"><strong>${Math.max(x, y).toFixed(2)}</strong></td></tr>`).join('') : '<tr><td colspan="5" class="muted">Press "Run 1 stage change".</td></tr>';
    $('spKeep').textContent = `${sp.counts['-4']} / ${sp.counts['0']} / ${sp.counts['4']}`; $('spStored').textContent = sp.stored;
  }
  function spDraw() {
    const H = sp.hist;
    lineChart($('spCv'), [{ color: '--fg', data: H.map(h => h.stored), step: true }, { color: '--go', data: H.map(h => h.actual) }, { color: '--amber', data: H.map(h => h.bal), width: 1.5 }],
      { ymin: 0, ymax: 50, xlabel: 'cycles →' });
  }
  [bind('spA', v => v), bind('spB', v => v), bind('spN', v => '±' + Math.round(v * 100) + ' %')].forEach(f => f());
  $('spStep').addEventListener('click', () => { spOne(); spTable(); spDraw(); });
  $('spRun').addEventListener('click', () => { for (let i = 0; i < 30; i++) spOne(); spTable(); spDraw(); });
  $('spReset').addEventListener('click', spReset);
  spReset(); redraws.push(spDraw);

  // ================= offset optimiser =================
  const OF = { C: 60, G: 30, SAT: 1.95 };
  let ofCur = 50;
  function departProfile(flow) {   // a node's departures: uniform arrivals queue on red, discharge on green
    const lam = flow / 3600 * 1.95, mask = S.effGreenMask(OF.C, 0, OF.G, 0, 0); let q = 0; const dep = new Array(OF.C).fill(0);
    for (let c = 0; c < 3; c++) for (let i = 0; i < OF.C; i++) { q += lam; if (mask[i]) { const d = Math.min(q, OF.SAT); q -= d; if (c === 2) dep[i] = d; } }
    return dep;
  }
  function ofPI(off) {
    const T = +$('ofT').value, K = +$('ofK').value, mask = S.effGreenMask(OF.C, 0, OF.G, 3, 4);
    const east = S.roll(S.disperse(departProfile(+$('ofE').value), T), -off);   // node2 runs `off` s later
    const west = S.roll(S.disperse(departProfile(+$('ofW').value), T), off);
    const re = S.simulateQueue(east, mask, OF.SAT, 3), rw = S.simulateQueue(west, mask, OF.SAT, 3);
    const pe = S.pi(re.delay, re.stops, K), pw = S.pi(rw.delay, rw.stops, K);
    return { pe, pw, tot: pe + pw };
  }
  function ofDraw(msg) {
    const curve = []; for (let o = 0; o < OF.C; o++) curve.push(ofPI(o));
    const best = curve.reduce((b, v, i) => v.tot < curve[b].tot ? i : b, 0);
    lineChart($('ofCv'), [{ color: '--fg', data: curve.map(v => v.tot), width: 2.5 }, { color: '--phase-b', data: curve.map(v => v.pe) }, { color: '--stop', data: curve.map(v => v.pw) }],
      { ymin: 0, xlabel: 'offset of node 2 relative to node 1 (0 to 59 s)' });
    const cv = $('ofCv'), r = cv.getBoundingClientRect(), c = cv.getContext('2d'), x = 40 + (r.width - 50) * ofCur / (OF.C - 1);
    c.fillStyle = tok('--amber'); c.globalAlpha = 0.35; c.fillRect(x - (r.width - 50) * 4 / 59, 10, (r.width - 50) * 8 / 59, r.height - 34); c.globalAlpha = 1;
    c.fillRect(x - 1.5, 10, 3, r.height - 34);
    $('ofCur').textContent = ofCur; $('ofPi').textContent = curve[ofCur].tot.toFixed(0); $('ofBest').textContent = best;
    if (msg !== undefined) $('ofTxt').textContent = msg;
  }
  function ofStep() {
    const opts = {}; for (const d of [-4, 0, 4]) opts[d] = ofPI(((ofCur + d) % OF.C + OF.C) % OF.C).tot;
    const d = S.chooseMin(opts); ofCur = ((ofCur + d) % OF.C + OF.C) % OF.C;
    return `PI at −4 / 0 / +4 s: ${opts[-4].toFixed(0)} / ${opts[0].toFixed(0)} / ${opts[4].toFixed(0)}. ${d ? `Moved ${d > 0 ? '+4' : '−4'} s.` : 'Kept the offset: a local minimum.'}`;
  }
  ['ofE', 'ofW'].forEach(id => bind(id, v => v + ' veh/h', () => ofDraw())()); bind('ofT', v => v + ' s', () => ofDraw())(); bind('ofK', v => v + ' s/stop', () => ofDraw())();
  $('ofStep').addEventListener('click', () => ofDraw(ofStep()));
  $('ofAuto').addEventListener('click', () => { let m; for (let i = 0; i < 20; i++) m = ofStep(); ofDraw(m); });
  $('ofRand').addEventListener('click', () => { ofCur = Math.floor(Math.random() * OF.C); ofDraw('New starting offset. Step the optimiser to see it descend.'); });
  ofDraw('Each run compares only three offsets. Repeated every cycle, it walks down the curve.'); redraws.push(() => ofDraw());

  // ================= cycle optimiser =================
  const CY = { L: 10 };
  const cyDos = (C, Y) => Y * C / (C - CY.L);
  // Webster delay summed over two stages (flow ratios 60/40 of Y, saturation flow 0.5 veh/s)
  const cyPI = (C, Y) => {
    let tot = 0;
    for (const share of [0.6, 0.4]) {
      const y = Y * share, lam = share * (C - CY.L) / C, x = y / lam, q = y * 0.5;
      if (x >= 0.99) return 1e6 * x;
      tot += q * (C * (1 - lam) ** 2 / (2 * (1 - y)) + x * x / (2 * q * (1 - x)));
    }
    return tot;
  };
  let cyTimer = null;
  function cyPlay() {
    if (cyTimer) { clearInterval(cyTimer); cyTimer = null; $('cyPlay').textContent = 'Play the peak'; return; }
    const pk = +$('cyPk').value, cmax = +$('cyMax').value, p = Object.assign({}, S.cycleDefaults, { cmax });
    let C = 48, t = 0; const hist = { C: [], D: [], Y: [] }; let nextOpt = 0;
    $('cyPlay').textContent = 'Stop';
    cyTimer = setInterval(() => {
      const Y = 0.35 + (pk - 0.35) * Math.exp(-(((t - 55) / 22) ** 4));
      let action = '';
      if (t >= nextOpt) {
        const step = S.cycleStep(C); let cands = [...new Set([Math.max(p.cmin, C - step), C, Math.min(cmax, C + step)])];
        if (cyDos(C, Y) > p.target) cands = [...new Set(cands.concat([8, 12, 16].map(j => Math.min(cmax, C + j))))];
        const feas = cands.filter(c => cyDos(c, Y) <= (c < C ? p.lower : p.target));
        let nw; if (feas.length) { const longer = feas.filter(c => c > C); nw = cyDos(C, Y) > p.target && longer.length ? Math.min(...longer) : feas.sort((a, b) => cyPI(a, Y) - cyPI(b, Y) || a - b)[0]; } else nw = Math.max(...cands);
        action = nw > C ? `up to ${nw} s` : nw < C ? `down to ${nw} s` : 'hold';
        nextOpt = t + (nw > C ? 2.5 : 5); C = nw; $('cyA').textContent = `${t.toFixed(1)} min: ${action}`;
      }
      hist.C.push(C); hist.D.push(cyDos(C, Y) * 100); hist.Y.push(Y * 100);
      $('cyC').textContent = C; $('cyD').textContent = cyDos(C, Y).toFixed(2);
      lineChart($('cyCv'), [{ color: '--fg', data: hist.C, step: true, width: 2.5 }, { color: '--stop', data: hist.D }, { color: '--muted', data: hist.Y, width: 1 }],
        { ymin: 0, ymax: Math.max(140, cmax + 10), hlines: [{ y: 90, color: '--amber' }], xlabel: 'minutes (each point 0.5 min)' });
      t += 0.5; if (t > 120) { clearInterval(cyTimer); cyTimer = null; $('cyPlay').textContent = 'Play the peak'; }
    }, 60);
  }
  [bind('cyPk', v => v.toFixed(2)), bind('cyMax', v => v + ' s')].forEach(f => f());
  $('cyPlay').addEventListener('click', cyPlay);
  lineChart($('cyCv'), [{ color: '--fg', data: [48] }], { ymin: 0, ymax: 140, xlabel: 'press "Play the peak"' });

  // ================= gating =================
  let gtMode = 'off';
  function gtRun() {
    const th = +$('gtTh').value, pk = +$('gtPk').value / 3600, base = 600 / 3600;
    const STORE = 25, MU = 0.36, GSAT = 0.55;
    let qg = 0, qc = 0, through = 0, blocked = 0, win = []; const hc = [], hg = [], ht = []; let minuteThrough = 0;
    for (let t = 0; t < 2400; t++) {
      const dem = t > 300 && t < 1500 ? pk : base;
      qg += dem;
      const dos = win.length ? (win.reduce((a, b) => a + b, 0) / win.length) / MU + qc / STORE * 0.3 : 0;
      let gr = 0.7; if (gtMode === 'on' && dos > th) gr = Math.max(0.2, 0.7 * MU / Math.max(dos * MU, 0.01) * 0.9);
      let move = Math.min(qg, GSAT * gr, Math.max(0, STORE - qc)); qg -= move; qc += move;
      win.push(move); if (win.length > 60) win.shift();
      const isBlocked = qc >= STORE - 0.5;
      if (isBlocked) blocked++;
      const out = Math.min(qc, MU * (isBlocked ? 0.6 : 1)); qc -= out; through += out; minuteThrough += out;
      if (t % 30 === 29) { hc.push(qc); hg.push(qg); ht.push(minuteThrough * 2); minuteThrough = 0; }
    }
    $('gtTp').textContent = Math.round(through); $('gtBlk').textContent = (blocked / 60).toFixed(1);
    lineChart($('gtCv'), [{ color: '--stop', data: hc }, { color: '--phase-b', data: hg }, { color: '--fg', data: ht, width: 1.5 }], { ymin: 0, xlabel: 'minutes 0 to 40' });
  }
  document.querySelectorAll('#gtMode button').forEach(b => b.addEventListener('click', () => { gtMode = b.dataset.g; document.querySelectorAll('#gtMode button').forEach(x => x.setAttribute('aria-pressed', x === b)); gtRun(); }));
  [bind('gtTh', v => v.toFixed(2), gtRun), bind('gtPk', v => v + ' veh/h', gtRun)].forEach(f => f()); redraws.push(gtRun);

  // ================= bus priority =================
  function ptDraw() {
    const ta = +$('ptT').value, gA = 40, I = 5, C = 80, bmin = 7, ext = 12;
    const d0 = ta < gA ? 0 : C - ta;
    let segs = [['A', 0, gA], ['i', gA, gA + I], ['B', gA + I, 75], ['i', 75, 80], ['A', 80, 120]], d1 = d0, act = 'none needed';
    if (ta >= gA && ta < gA + ext) {
      const e = ta - gA + 2; segs = [['A', 0, gA + e], ['i', gA + e, gA + e + I], ['B', gA + e + I, 75], ['i', 75, 80], ['A', 80, 120]]; d1 = 0; act = `extension +${e} s`;
    } else if (ta >= gA + ext && ta < 75) {
      const bEnd = Math.max(ta - I, gA + I + bmin);
      if (bEnd + I < 80) { segs = [['A', 0, gA], ['i', gA, gA + I], ['B', gA + I, bEnd], ['i', bEnd, bEnd + I], ['A', bEnd + I, 120]]; d1 = Math.max(0, bEnd + I - ta); act = 'recall: B cut short'; }
      else act = 'too late to help';
    } else if (ta >= 75) act = 'A is coming anyway';
    $('ptD0').textContent = d0.toFixed(0); $('ptD1').textContent = d1.toFixed(0); $('ptX').textContent = act;
    const [c, W, H] = prep($('ptCv')); const L = W < 500 ? 62 : 90, X = t => L + (W - L - 10) * t / 120;
    const row = (y, sg, label) => { c.fillStyle = tok('--fg'); c.fillText(label, 4, y + 15); sg.forEach(([k, a, b]) => { c.fillStyle = tok(k === 'A' ? '--phase-a' : k === 'B' ? '--phase-b' : '--amber'); c.fillRect(X(a), y, X(b) - X(a), 22); if (k !== 'i' && X(b) - X(a) > 20) { c.fillStyle = tok('--fg'); c.fillText(k, X(a) + 5, y + 15); } }); };
    row(12, [['A', 0, gA], ['i', gA, gA + I], ['B', gA + I, 75], ['i', 75, 80], ['A', 80, 120]], 'normal');
    row(52, segs, 'priority');
    c.fillStyle = tok('--stop'); c.fillRect(X(ta) - 1, 4, 3, 76); c.fillText('bus', Math.min(X(ta) + 4, W - 30), 96);
    c.fillStyle = tok('--muted'); for (let s = 0; s <= 100; s += 20) c.fillText(s + ' s', X(s) - 6, H - 6);
  }
  bind('ptT', v => v + ' s', ptDraw)(); redraws.push(ptDraw);

  // ================= SUMO tables =================
  const R = window.RESULTS || {};
  const table = (rows, cols) => !rows ? '<p class="muted">Run the script to generate results.</p>' : `<table class="data"><thead><tr>${cols.map(c => `<th>${c[1]}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${cols.map(c => `<td>${r[c[0]] ?? '–'}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const cols = [['label', 'Controller'], ['avg_delay', 'Mean delay (s)'], ['avg_travel_time', 'Travel time (s)'], ['stops_per_veh', 'Stops / veh'], ['bus_avg_delay', 'Bus delay (s)']];
  $('advTable').innerHTML = table(R.advanced, cols);
  $('ablTable').innerHTML = table(R.ablation, [['label', 'Variant'], ...cols.slice(1)]);

  Quiz($('quizA'), QUIZ.advanced, 'advanced');
  addEventListener('themechange', () => redraws.forEach(f => f()));
  addEventListener('resize', () => redraws.forEach(f => f()));
})();
