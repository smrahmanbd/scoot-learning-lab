"""
FOUNDATION 2 - Validating the SCOOT model (what engineers do on site)
=====================================================================
SCOOT only works if its traffic model matches the street. On site, engineers
"validate" each link by watching the queue and setting a handful of
parameters. This lab measures the same parameters from SUMO:

  journey (cruise) time  detector -> stop line at free flow        [s]
  LPU per vehicle        average LPUs a vehicle produces at the detector
  saturation occupancy   SATO: LPUs discharged per second of saturated green
  start lag              green start -> first vehicle crosses the stop line
  end lag                green end -> last vehicle of the queue crosses

Method: overload one junction under a fixed 80 s plan so queues never clear,
then read the upstream and stop-line loops.

    python foundation/02_validate_model.py
Copy the printed values into ScootConfig (sato_per_lane, start_lag, end_lag,
cruise_speed, lpu_per_veh).
"""
import _path  # noqa: F401
import statistics

import traci
import traci.constants as tc

from scoot import cli
from scoot.runner import Scenario, mode_config, run
import scoot.controller as ctl


def main():
    args = cli.parser(__doc__).parse_args()
    out = cli.outdir(args, "foundation")
    end = args.end or 1500
    scn = Scenario("validate", n=1, periods=[dict(begin=0, end=end, east=2600, west=2600, side=1100, turn=0)], end=end)

    crossings = {}     # link -> list of (t, vehicle) at stop line
    lpu_per_veh = []
    greens = []        # (link_cls, start, end)
    state = {"prev": None, "t_change": 0}
    cruise = []
    seen_up = {}
    first_cross = {}

    orig = ctl.ActuatedNode  # not used; we hook the fixed controller through on_cycle_end

    def hook_step(self, t, tau, cycle, _orig=ctl.Node.step):
        _orig(self, t, tau, cycle)
        # record signal green windows per stage
        s = self.STAGES[self.cur] if self.mode == "green" else None
        if s != state["prev"]:
            if state["prev"] is not None:
                greens.append((state["prev"], state["t_change"], t))
            state["prev"], state["t_change"] = s, t
        for l in self.in_links:
            for d_up, d_sl in zip(l.det_ids, l.stop_ids):
                up = traci.inductionloop.getVehicleData(d_up)
                for vid, vlen, entry, leave, vtype in up:
                    if leave >= 0 and vid not in seen_up:
                        seen_up[vid] = (t, (leave - entry))
                for vid, vlen, entry, leave, vtype in traci.inductionloop.getVehicleData(d_sl):
                    if vid in first_cross:
                        continue
                    first_cross[vid] = t
                    crossings.setdefault(l.cls, []).append((t, vid))
                    if vid in seen_up and vid not in self.__dict__.setdefault("_done", set()):
                        self._done.add(vid)
                        t_up, occ = seen_up[vid]
                        lpu_per_veh.append(1.0 + 2.0 * occ)

    ctl.Node.step = hook_step
    run(scn, mode_config("fixed"), "validate", out, seed=args.seed, gui=args.gui)

    # free-flow cruise time: run a light-traffic copy and time detector -> stop line on green
    light = Scenario("light", n=1, periods=[dict(begin=0, end=600, east=200, west=200, side=60, turn=0)], end=600)
    t_up, t_sl = {}, {}

    def hook_light(self, t, tau, cycle, _orig=ctl.Node.step):
        _orig(self, t, tau, cycle)
        for l in self.stage_links["A"]:
            for d_up, d_sl in zip(l.det_ids, l.stop_ids):
                for vid, *_ in traci.inductionloop.getVehicleData(d_up):
                    t_up.setdefault(vid, (t, l.cruise * ctl.ScootConfig().cruise_speed))
                for vid, *_ in traci.inductionloop.getVehicleData(d_sl):
                    t_sl.setdefault(vid, t)

    ctl.Node.step = hook_light
    run(light, mode_config("fixed"), "validate_light", out, seed=args.seed, verbose=False)
    speeds = []
    for vid, (tu, dist) in t_up.items():
        if vid in t_sl and 0 < t_sl[vid] - tu < 40:
            speeds.append(dist / (t_sl[vid] - tu))
    free = [v for v in speeds if v > 9.0]                       # vehicles that did not stop
    v_cruise = statistics.median(free)

    # saturation discharge and lags from saturated greens
    rates = {"art": [], "side": []}
    start_lags, end_lags = [], []
    lanes = {"art": 6, "side": 4}      # lanes on both approaches served by the stage
    for cls_stage, a, b in greens[4:]:
        cls = "art" if cls_stage == "A" else "side"
        cr = sorted(tc_ for tc_, _ in crossings.get(cls, []) if a <= tc_ <= b + 6)
        if len(cr) < 6:
            continue
        start_lags.append(cr[0] - a)
        end_lags.append(max(0.0, cr[-1] - b))
        mid = [x for x in cr if a + 6 <= x <= b]
        if b - a - 6 > 5:
            rates[cls].append(len(mid) / (b - a - 6) / lanes[cls])
    lpv = statistics.median(lpu_per_veh)
    print(f"\nLPU per vehicle at the detector      : {lpv:.2f}")
    print(f"Cruise speed (detector -> stop line)  : {v_cruise:.1f} m/s  "
          f"(journey time on a 270 m link = {270 / v_cruise:.0f} s)")
    for cls in ("art", "side"):
        r = statistics.median(rates[cls])
        print(f"Saturation flow per lane ({cls:4s})      : {r * 3600:.0f} veh/h  ->  SATO = {r * lpv:.2f} LPU/s per lane")
    print(f"Start lag                             : {statistics.median(start_lags):.1f} s")
    print(f"End lag                               : {statistics.median(end_lags):.1f} s")


if __name__ == "__main__":
    main()
