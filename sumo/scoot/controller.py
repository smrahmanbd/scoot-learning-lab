"""
scoot.controller - a SCOOT-style adaptive controller running inside SUMO via TraCI.

Structure (mirroring SCOOT):
  Link    - one approach: upstream detector -> LPUs -> platoon dispersion ->
            stop-line queue model; cyclic flow profile; congestion measure.
  Node    - one junction: stage change times inside the region cycle,
            split optimiser (a few seconds before every stage change),
            offset optimiser (once per cycle), bus extensions and recalls.
  Region  - nodes sharing one cycle time; cycle optimiser every 5 min
            (2.5 min while rising) targeting 90% DoS at the critical node.

SCOOT is centralised and model-based: there is no gap-out. Stage changes
happen when the optimised schedule says so (minimum greens always respected).
"""
from __future__ import annotations

import hashlib
import math
from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional

import sumolib
import traci
import traci.constants as tc

from . import core


def is_cv(veh_id: str, p: float) -> bool:
    """Deterministic 'is this vehicle connected?' draw."""
    if p >= 1.0:
        return True
    h = int(hashlib.md5(veh_id.encode()).hexdigest()[:8], 16) / 0xFFFFFFFF
    return h < p


@dataclass
class ScootConfig:
    # which optimisers run (all True = full SCOOT)
    split_opt: bool = True
    offset_opt: bool = True
    cycle_opt: bool = True
    # initial plan
    initial_cycle: float = 60.0
    initial_split: float = 0.6          # share of green for stage A (main road)
    progression_speed: float = 12.0     # m/s, for the initial / fixed offsets
    # traffic model ("validation" parameters, see foundation/02_validate_model.py)
    cruise_speed: float = 13.5          # m/s detector -> stop line (validated)
    sato_per_lane: Dict[str, float] = field(default_factory=lambda: {"art": 0.67, "side": 0.89})
    start_lag: float = 3.0
    end_lag: float = 4.0
    lpu_per_veh: float = 1.95
    profile_weight: float = 0.25        # smoothing of cyclic flow profiles per cycle
    # optimisers
    split_lead: int = 5                 # split decision this many s before a stage change
    split_authority: float = 4.0        # temporary change (s)
    split_permanent: float = 1.0        # permanent change (s)
    offset_authority: float = 4.0
    stop_weight: float = 4.0            # K in PI = delay + K * stops
    cycle: core.CycleParams = field(default_factory=core.CycleParams)
    congestion_importance: float = 1.0  # extra DoS weight on links with queues over the detector
    # stages
    amber: float = 3.0
    all_red: float = 2.0
    min_green: Dict[str, float] = field(default_factory=lambda: {"A": 10.0, "B": 7.0})
    # bus priority
    bus_priority: bool = False
    bus_detect_dist: float = 120.0
    bus_ext_max: float = 12.0
    # data source / faults (research hooks)
    data_source: str = "loop"           # 'loop' or 'cv'
    cv_penetration: float = 1.0
    sensor_filter: Optional[Callable] = None   # (det_id, occ_pct, ids, t) -> (occ_pct, ids)
    fault_handling: str = "none"        # 'none' | 'astrid' (historic profile substitution)
    split_chooser: Optional[Callable] = None   # (node, k, dos_by_option) -> delta
    on_cycle_end: Optional[Callable] = None    # (node, record) -> None
    # validation logging
    log_links: List[str] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Link
# ---------------------------------------------------------------------------


class Link:
    def __init__(self, eid: str, info: dict, cls: str, cfg: ScootConfig, cycle: int):
        self.id, self.cfg, self.cls = eid, cfg, cls
        self.lanes = info["lanes"]
        self.frm, self.to = info["from"], info["to"]
        self.det_ids = [f"up_{eid}_{i}" for i in range(self.lanes)]
        self.stop_ids = [f"loop_{eid}_{i}" for i in range(self.lanes)]
        self.lane_ids = [f"{eid}_{i}" for i in range(self.lanes)]
        self.cruise = info["det_dist"] / cfg.cruise_speed
        self.F, self.lag = core.robertson_factor(self.cruise)
        self.sat = cfg.sato_per_lane[cls] * self.lanes
        self.qcap = info["det_dist"] / 7.0 * self.lanes * cfg.lpu_per_veh
        self.buf = [0.0] * (self.lag + 1)
        self.arr = 0.0
        self.q = 0.0
        self.prof = [0.0] * cycle           # stop-line arrival profile (region cycle seconds)
        self.cyc = [0.0] * cycle            # this cycle's arrivals
        self.prev_ids = {d: set() for d in self.det_ids}
        self.stuck_on = {d: 0 for d in self.det_ids}
        self.silent = {d: 0 for d in self.det_ids}
        self.faulty = {d: False for d in self.det_ids}
        self.hist_lpu = None                # ASTRID-like historic per-second LPU profile
        self.cong_s = 0                     # seconds with a queue standing over the detector
        self.cong_frac = 0.0
        self.residual = 0.0                 # smoothed queue left at end of effective green
        self.measured_cycle = 0.0
        self.log: List[tuple] = []

    # ------------------------------------------------------------- measurement
    def measure(self, t: float, tau: int, det_data) -> float:
        """LPUs crossing the upstream detector during this second."""
        cfg = self.cfg
        total = 0.0
        healthy_share = 0
        self._loop_lpu, self._new_ids = 0.0, []
        for d in self.det_ids:
            r = det_data.get(d, {})
            occ = r.get(tc.LAST_STEP_OCCUPANCY, 0.0)
            ids = r.get(tc.LAST_STEP_VEHICLE_ID_LIST, ())
            if cfg.sensor_filter:
                occ, ids = cfg.sensor_filter(d, occ, ids, t)
            new = [v for v in ids if v not in self.prev_ids[d]]
            self.prev_ids[d] = set(ids)
            # fault logic: continuously occupied for 2 min, or silent for 10 min
            self.stuck_on[d] = self.stuck_on[d] + 1 if occ >= 99.0 else 0
            self.silent[d] = self.silent[d] + 1 if (occ <= 0 and not ids) else 0
            self.faulty[d] = self.stuck_on[d] >= 120 or self.silent[d] >= 600
            if occ > 90:
                self.cong_s += 1 / self.lanes
            self._loop_lpu += core.lpu(len(new), occ / 100.0)
            self._new_ids.extend(new)
            if cfg.data_source == "cv":
                n_cv = sum(1 for v in new if is_cv(v, cfg.cv_penetration))
                val = n_cv / max(cfg.cv_penetration, 1e-6) * cfg.lpu_per_veh
            else:
                val = core.lpu(len(new), occ / 100.0)
            if cfg.fault_handling == "astrid" and self.faulty[d]:
                continue
            total += val
            healthy_share += 1
        if cfg.fault_handling == "astrid" and healthy_share < self.lanes:
            if self.hist_lpu is not None:
                hist = self.hist_lpu[tau % len(self.hist_lpu)]
                if healthy_share == 0:
                    total = hist
                else:
                    total = total * self.lanes / healthy_share
            elif healthy_share:
                total = total * self.lanes / healthy_share
        return total

    def step(self, t: float, tau: int, det_data, eff_green: bool, lane_data):
        m = self.measure(t, tau, det_data)
        self.measured_cycle += m
        self.buf.append(m)
        src = self.buf.pop(0)
        self.arr = self.F * src + (1 - self.F) * self.arr
        self.q += self.arr
        if eff_green:
            self.q -= min(self.q, self.sat)
        self.q = min(self.q, self.qcap)
        if tau < len(self.cyc):
            self.cyc[tau] += self.arr
        if self.id in self.cfg.log_links:
            halting = sum(lane_data.get(l, {}).get(tc.LAST_STEP_VEHICLE_HALTING_NUMBER, 0) for l in self.lane_ids)
            self.log.append((t, self.q / self.cfg.lpu_per_veh, halting, m, self.arr, self._loop_lpu, tuple(self._new_ids)))

    def end_effective_green(self):
        self.residual = 0.7 * self.residual + 0.3 * self.q

    def close_cycle(self, cycle: int):
        w = self.cfg.profile_weight
        n = len(self.prof)
        for i in range(n):
            self.prof[i] = (1 - w) * self.prof[i] + w * self.cyc[i]
        self.cong_frac = min(1.0, self.cong_s / max(cycle, 1))
        self.cong_s = 0
        self.cyc = [0.0] * n
        self.measured_cycle = 0.0

    def resize(self, new_cycle: int):
        self.prof = core.resample(self.prof, new_cycle)
        self.cyc = [0.0] * new_cycle
        if self.hist_lpu is not None:
            self.hist_lpu = core.resample(self.hist_lpu, new_cycle)

    def snapshot_history(self):
        """ASTRID: remember the current profile (per-second LPU at the detector)."""
        lagged = self.prof[self.lag:] + self.prof[:self.lag]   # undo the cruise shift roughly
        self.hist_lpu = list(lagged)

    def dos(self, green_window, cycle: int) -> float:
        s, e = green_window
        g = ((e - s) % cycle) - self.cfg.start_lag + self.cfg.end_lag
        d = core.degree_of_saturation(sum(self.prof), max(g, 1.0), self.sat, self.residual)
        return d * (1 + self.cfg.congestion_importance * self.cong_frac)


# ---------------------------------------------------------------------------
# Node
# ---------------------------------------------------------------------------


class Node:
    STAGES = ("A", "B")      # A = main road (W/E approaches), B = side road (N/S)

    def __init__(self, tls: str, net: sumolib.net.Net, links: Dict[str, Link], cfg: ScootConfig,
                 x: float, cycle: float, offset: float):
        self.tls, self.cfg, self.x = tls, cfg, x
        jx, jy = net.getNode(tls).getCoord()
        ctrl = traci.trafficlight.getControlledLinks(tls)
        self.stage_links: Dict[str, List[Link]] = {"A": [], "B": []}
        self.in_links = []
        for l in links.values():
            if l.to == tls:
                self.in_links.append(l)
                self.stage_links["A" if l.cls == "art" else "B"].append(l)
        # build SUMO state strings per stage
        states = {"A": [], "B": []}
        for lk in ctrl:
            in_lane, out_lane, _ = lk[0]
            lane_obj = net.getLane(in_lane)
            fx, fy = lane_obj.getEdge().getFromNode().getCoord()
            art = abs(fx - jx) > abs(fy - jy)
            turn = "s"
            for c in lane_obj.getOutgoing():
                if c.getToLane().getID() == out_lane:
                    d = c.getDirection().lower()
                    turn = "l" if d in ("l", "pl") else "r" if d in ("r", "pr") else "s"
            own = "A" if art else "B"
            for s in self.STAGES:
                states[s].append(("g" if turn == "l" else "G") if s == own else "r")
        self.green = {s: "".join(v) for s, v in states.items()}
        self.ig = cfg.amber + cfg.all_red
        # stage change times (end of green) in region cycle seconds
        gA = (cycle - 2 * self.ig) * cfg.initial_split
        self.change = [(offset + gA) % cycle, (offset + gA + self.ig + (cycle - 2 * self.ig) * (1 - cfg.initial_split)) % cycle]
        self.temp = [0.0, 0.0]
        self.out_links: List[Link] = []      # arterial links leaving this node (set by Region)
        # runtime
        self.cur = 0
        self.mode = "green"
        self.since = 0.0
        self.ig_end = 0.0
        self._started = False
        self.bus_req: Optional[str] = None
        self.ext_used = 0.0
        self.decided = [False, False]
        self.offset_done = False
        self.stats = {"split": {-1: 0, 0: 0, 1: 0}, "offset": {-1: 0, 0: 0, 1: 0}, "ext": 0, "recall": 0}
        self.history: List[Dict] = []
        self.rec = {"g": {"A": 0.0, "B": 0.0}}
        self.region: Optional["Region"] = None
        self.ig_start = -99.0
        self._amber_state_done = True
        self.last_close = -1e9

    # ------------------------------------------------------------- helpers
    def windows(self, cycle, extra=(0.0, 0.0)):
        ch = [self.change[k] + self.temp[k] + extra[k] for k in range(2)]
        return core.stage_windows(ch, [self.ig, self.ig], cycle)

    def _in(self, tau, win, cycle):
        s, e = win
        return ((tau - s) % cycle) < ((e - s) % cycle)

    def max_dos(self, cycle, extra=(0.0, 0.0), stages=("A", "B")) -> float:
        win = dict(zip(self.STAGES, self.windows(cycle, extra)))
        vals = [l.dos(win[s], cycle) for s in stages for l in self.stage_links[s]]
        return max(vals) if vals else 0.0

    def _set(self, state):
        traci.trafficlight.setRedYellowGreenState(self.tls, state)

    # ------------------------------------------------------------- optimisers
    def split_optimiser(self, k: int, cycle: int):
        cfg = self.cfg
        mins = [cfg.min_green["A"], cfg.min_green["B"]]
        base = [self.change[i] + self.temp[i] for i in range(2)]
        opts = core.split_options(base, k, [self.ig, self.ig], mins, cycle, cfg.split_authority)
        dos = {}
        for d in opts:
            extra = [0.0, 0.0]
            extra[k] = d
            dos[d] = self.max_dos(cycle, extra)
        if cfg.split_chooser:
            d = cfg.split_chooser(self, k, dos)
        else:
            d = core.choose_split(dos)
        self.temp[k] += d
        if d:
            self.change[k] = (self.change[k] + math.copysign(cfg.split_permanent, d)) % cycle
        self.stats["split"][int(math.copysign(1, d)) if d else 0] += 1

    def offset_pi(self, cycle: int, delta: float) -> float:
        cfg = self.cfg
        pi = 0.0
        win = dict(zip(self.STAGES, self.windows(cycle, (delta, delta))))
        for s in self.STAGES:
            for l in self.stage_links[s]:
                mask = core.effective_green_mask(cycle, win[s][0], win[s][1], cfg.start_lag, cfg.end_lag)
                r = core.simulate_queue(l.prof, mask, l.sat, cycles=2)
                pi += core.performance_index(r["delay"], r["stops"], cfg.stop_weight, cfg.lpu_per_veh)
        for l in self.out_links:                     # departures shift with this node
            down = self.region.node_of[l.to]
            dwin = dict(zip(self.STAGES, down.windows(cycle)))["A"]
            mask = core.effective_green_mask(cycle, dwin[0], dwin[1], cfg.start_lag, cfg.end_lag)
            sh = int(round(delta)) % cycle
            prof = l.prof[-sh:] + l.prof[:-sh] if sh else l.prof
            r = core.simulate_queue(prof, mask, l.sat, cycles=2)
            pi += core.performance_index(r["delay"], r["stops"], cfg.stop_weight, cfg.lpu_per_veh)
        return pi

    def offset_optimiser(self, cycle: int):
        a = self.cfg.offset_authority
        pis = {d: self.offset_pi(cycle, d) for d in (-a, 0.0, a)}
        d = core.choose_offset(pis)
        if d:
            self.change = [(c + d) % cycle for c in self.change]
        self.stats["offset"][int(math.copysign(1, d)) if d else 0] += 1
        return d

    # ------------------------------------------------------------- per second
    def step(self, t: float, tau: int, cycle: int):
        cfg = self.cfg
        if not self._started:
            self._started = True
            # start in whichever stage the schedule says
            win = self.windows(cycle)
            self.cur = 0 if self._in(tau, win[0], cycle) or not self._in(tau, win[1], cycle) else 1
            self.mode, self.since = "green", t
            self._set(self.green[self.STAGES[self.cur]])
        win = self.windows(cycle)
        # optimiser triggers
        for k in range(2):
            lead_tau = int(round(self.change[k] + self.temp[k] - cfg.split_lead)) % cycle
            if tau == lead_tau and not self.decided[k] and cfg.split_opt:
                self.split_optimiser(k, cycle)
                self.decided[k] = True
        if tau == int(round(self.change[1] + 2)) % cycle and t - self.last_close > 0.6 * cycle:
            self.last_close = t
            # end of the node cycle (after the B->A change): reset per-cycle state
            self.decided = [False, False]
            if cfg.offset_opt and not self.offset_done:
                self.offset_optimiser(cycle)
            self.offset_done = False
            self._close_cycle(t, cycle)
            win = self.windows(cycle)
        # effective green for the queue model
        for s_i, s in enumerate(self.STAGES):
            eg = (self.mode == "green" and self.cur == s_i and t - self.since >= cfg.start_lag) or \
                 (self.mode == "ig" and self.cur == s_i and t - self.ig_start < cfg.end_lag)
            for l in self.stage_links[s]:
                l._eg = eg
                if self.mode == "ig" and self.cur == s_i and abs(t - self.ig_start - cfg.end_lag) < 0.5:
                    l.end_effective_green()
        # signal state machine
        if self.mode == "green":
            s = self.STAGES[self.cur]
            want_change = not self._in(tau, win[self.cur], cycle)
            el = t - self.since
            if cfg.bus_priority and self.bus_req:
                if self.bus_req == s and want_change and self.ext_used < cfg.bus_ext_max:
                    want_change = False
                    self.ext_used += 1
                    if self.ext_used == 1:
                        self.stats["ext"] += 1
                elif self.bus_req != s and not want_change and el >= cfg.min_green[s] + 2:
                    want_change = True
                    self.stats["recall"] += 1
            if want_change and el >= cfg.min_green[s]:
                self.rec["g"][s] = el
                self.mode, self.ig_start = "ig", t
                self.ext_used = 0.0
                self.temp[self.cur] = 0.0
                nxt = self.STAGES[1 - self.cur]
                self._set("".join("y" if c in "Gg" else "r" for c in self.green[s]))
                self._amber_state_done = False
        elif self.mode == "ig":
            if t - self.ig_start >= cfg.amber and not self._amber_state_done:
                self._set("r" * len(self.green["A"]))
                self._amber_state_done = True
            if t - self.ig_start >= self.ig:
                self.cur = 1 - self.cur
                self.mode, self.since = "green", t
                self._set(self.green[self.STAGES[self.cur]])

    def _close_cycle(self, t, cycle):
        rec = self.rec
        rec.update({"t": t, "tls": self.tls, "C": cycle,
                    "change": [round(c, 1) for c in self.change],
                    "dos": {s: round(max([l.dos(w, cycle) for l in self.stage_links[s]] or [0]), 3)
                            for s, w in zip(self.STAGES, self.windows(cycle))},
                    "cong": round(max([l.cong_frac for l in self.in_links] or [0]), 2)})
        self.history.append(rec)
        if self.cfg.on_cycle_end:
            self.cfg.on_cycle_end(self, rec)
        self.rec = {"g": {"A": 0.0, "B": 0.0}}


# ---------------------------------------------------------------------------
# Region
# ---------------------------------------------------------------------------


class Region:
    def __init__(self, name: str, nodes: List[Node], links: Dict[str, Link], cfg: ScootConfig, cycle: float):
        self.name, self.nodes, self.links, self.cfg = name, nodes, links, cfg
        self.C = int(cycle)
        self.t0 = 0.0
        self.next_opt = cfg.cycle.period
        self.node_of = {n.tls: n for n in nodes}
        for n in nodes:
            n.region = self
            n.out_links = [l for l in links.values() if l.frm == n.tls and l.to in self.node_of]
        self.last_tau = -1
        self.log: List[Dict] = []
        self.bus_ids: set = set()

    def tau(self, t) -> int:
        return int((t - self.t0) % self.C)

    def evaluate_cycle(self, Cn: int):
        """Predicted (critical DoS, region PI) if the region ran at cycle Cn.

        Change times scale with the cycle; arrival profiles keep their flow
        rate (so arrivals per cycle grow with Cn)."""
        cfg = self.cfg
        ratio = Cn / self.C
        crit, crit_node, pi = 0.0, None, 0.0
        for n in self.nodes:
            ch = [(c + tmp) * ratio for c, tmp in zip(n.change, n.temp)]
            win = dict(zip(n.STAGES, core.stage_windows(ch, [n.ig, n.ig], Cn)))
            for s in n.STAGES:
                for l in n.stage_links[s]:
                    prof = [v * ratio for v in core.resample(l.prof, Cn)]
                    g = ((win[s][1] - win[s][0]) % Cn) - cfg.start_lag + cfg.end_lag
                    d = core.degree_of_saturation(sum(prof), max(g, 1.0), l.sat, l.residual)
                    d *= 1 + cfg.congestion_importance * l.cong_frac
                    if d > crit:
                        crit, crit_node = d, n.tls
                    mask = core.effective_green_mask(Cn, win[s][0], win[s][1], cfg.start_lag, cfg.end_lag)
                    r = core.simulate_queue(prof, mask, l.sat, cycles=2)
                    pi += core.performance_index(r["delay"], r["stops"], cfg.stop_weight, cfg.lpu_per_veh) / Cn
        return crit, crit_node, pi        # pi per second of operation

    def cycle_optimiser(self, t):
        p = self.cfg.cycle
        step = int(core.cycle_step(self.C))
        cands = sorted({max(int(p.c_min), self.C - step), self.C, min(int(p.c_max), self.C + step)})
        if self.evaluate_cycle(self.C)[0] > p.target:
            # rapidly rising demand: also consider bigger jumps (up to +16 s per decision)
            cands = sorted(set(cands) | {min(int(p.c_max), self.C + j) for j in (8, 12, 16)})
        ev = {c: self.evaluate_cycle(c) for c in cands}
        # shorter cycles must keep the critical node below the lower bound (model margin),
        # the current or a longer cycle below the 90% target
        feasible = [c for c in cands if ev[c][0] <= (p.lower if c < self.C else p.target)]
        if feasible:
            longer = [c for c in feasible if c > self.C]
            if ev[self.C][0] > p.target and longer:
                new = min(longer)                  # smallest increase that restores 90%
            else:
                new = min(feasible, key=lambda c: (ev[c][2], c))
        else:
            new = max(cands)                       # nothing meets 90%: lengthen
        action = "up" if new > self.C else "down" if new < self.C else "hold"
        crit, crit_node, _ = ev[self.C]
        self.next_opt = t + (p.fast_period if action == "up" else p.period)
        if new != self.C:
            ratio = new / self.C
            tau_new = self.tau(t) * ratio
            for n in self.nodes:
                n.change = [(c * ratio) % new for c in n.change]
                n.temp = [0.0, 0.0]
            for l in self.links.values():
                l.resize(new)
                l.prof = [v * ratio for v in l.prof]
            self.C = new
            self.t0 = t - tau_new
        self.log.append({"t": t, "region": self.name, "C": self.C, "critical": crit_node,
                         "dos": round(crit, 3), "action": action,
                         "pi": {c: round(ev[c][2], 2) for c in cands}})

    def step(self, t: float, det_data, lane_data):
        cfg = self.cfg
        if cfg.cycle_opt and t >= self.next_opt:
            self.cycle_optimiser(t)
        tau = self.tau(t)
        # bus detection (priority requests)
        if cfg.bus_priority:
            for v in traci.simulation.getDepartedIDList():
                if traci.vehicle.getTypeID(v).startswith("bus"):
                    self.bus_ids.add(v)
            for v in traci.simulation.getArrivedIDList():
                self.bus_ids.discard(v)
            for n in self.nodes:
                n.bus_req = None
            for v in list(self.bus_ids):
                try:
                    lane = traci.vehicle.getLaneID(v)
                    pos = traci.vehicle.getLanePosition(v)
                except traci.TraCIException:
                    continue
                edge = lane.rsplit("_", 1)[0]
                l = self.links.get(edge)
                if l and l.to in self.node_of and traci.lane.getLength(lane) - pos <= cfg.bus_detect_dist:
                    self.node_of[l.to].bus_req = "A" if l.cls == "art" else "B"
        for n in self.nodes:
            n.step(t, tau, self.C)
        for l in self.links.values():
            l.step(t, tau, det_data, getattr(l, "_eg", False), lane_data)
        if tau < self.last_tau:          # region cycle wrapped
            for l in self.links.values():
                l.close_cycle(self.C)
        self.last_tau = tau


# ---------------------------------------------------------------------------
# baselines
# ---------------------------------------------------------------------------


class ActuatedNode:
    """Isolated vehicle actuation (stop-line loops, gap-out, max green). Baseline only."""

    def __init__(self, node: Node, gap: float = 3.0, max_green=None):
        self.n = node
        self.gap, self.maxg = gap, max_green or {"A": 45.0, "B": 30.0}
        self.gaps = {}
        self.cur, self.mode, self.since = 0, "green", 0.0
        self.started = False

    def step(self, t, loop_data):
        n, cfg = self.n, self.n.cfg
        if not self.started:
            self.started = True
            n._set(n.green["A"])
        for s in n.STAGES:
            for l in n.stage_links[s]:
                for d in l.stop_ids:
                    occ = loop_data.get(d, {}).get(tc.LAST_STEP_OCCUPANCY, 0.0)
                    self.gaps[d] = 0.0 if occ > 0 else self.gaps.get(d, 9.0) + 1
        if self.mode == "green":
            s = n.STAGES[self.cur]
            el = t - self.since
            ids = [d for l in n.stage_links[s] for d in l.stop_ids]
            other = [d for l in n.stage_links[n.STAGES[1 - self.cur]] for d in l.stop_ids]
            demand_other = any(self.gaps.get(d, 9) < 60 for d in other)
            gap_out = all(self.gaps.get(d, 9) >= self.gap for d in ids)
            if el >= cfg.min_green[s] and ((gap_out and demand_other) or el >= self.maxg[s]):
                self.mode, self.ig_start = "ig", t
                n._set("".join("y" if c in "Gg" else "r" for c in n.green[s]))
        else:
            if t - self.ig_start >= cfg.amber:
                n._set("r" * len(n.green["A"]))
            if t - self.ig_start >= n.ig:
                self.cur = 1 - self.cur
                self.mode, self.since = "green", t
                n._set(n.green[n.STAGES[self.cur]])
