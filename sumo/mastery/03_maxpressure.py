"""
MASTERY 3 - SCOOT vs max-pressure, and a spill-back-aware SCOOT
===============================================================
Research question: SCOOT's DoS looks only at the approach. Max-pressure
(Varaiya 2013) uses upstream queue minus downstream load, so it reacts to
exit blocking, but it is acyclic and ignores progression. Compare:

  scoot           standard SCOOT
  mp_pure         acyclic max-pressure (decide every 5 s after min green)
  scoot_pressure  SCOOT whose split optimiser scores options with
                  DoS_link / (1 + lam * exit blocking) - a stage whose exit link is
                  filling up (SCOOT's own model queue) counts for less, because extra
                  green cannot move its traffic

    python mastery/03_maxpressure.py --lam 1.0
"""
import _path  # noqa: F401
import os

import traci.constants as tc

from scoot import cli, plots
from scoot import core
from scoot.runner import mode_config, run
from scoot.scenarios import advanced


class MaxPressure:
    def __init__(self, net, nodes, links, min_green=8.0, decision=5.0):
        self.nodes, self.links = nodes, links
        self.min_green, self.decision = min_green, decision
        self.st = {n.tls: {"cur": 0, "mode": "green", "since": 0.0} for n in nodes}
        self.out_of = {}
        for n in nodes:
            n._set(n.green["A"])
        import traci
        self.down = {}
        for n in nodes:
            for lk in traci.trafficlight.getControlledLinks(n.tls):
                i, o, _ = lk[0]
                self.down.setdefault(i.rsplit("_", 1)[0], set()).add(o)

    def pressure(self, n, stage, lane_data):
        p = 0.0
        for l in n.stage_links[stage]:
            q = sum(lane_data.get(x, {}).get(tc.LAST_STEP_VEHICLE_HALTING_NUMBER, 0) for x in l.lane_ids)
            outs = self.down.get(l.id, set())
            d = sum(lane_data.get(o, {}).get(tc.LAST_STEP_VEHICLE_NUMBER, 0) for o in outs) / max(len(outs), 1)
            p += q - 0.5 * d
        return p

    def step(self, t, det_data, lane_data):
        for n in self.nodes:
            st = self.st[n.tls]
            if st["mode"] == "green":
                el = t - st["since"]
                if el < self.min_green or el % self.decision:
                    continue
                cur, oth = n.STAGES[st["cur"]], n.STAGES[1 - st["cur"]]
                if self.pressure(n, oth, lane_data) > self.pressure(n, cur, lane_data):
                    n._set("".join("y" if c in "Gg" else "r" for c in n.green[cur]))
                    st.update(mode="ig", t_ig=t)
            else:
                if t - st["t_ig"] >= n.cfg.amber:
                    n._set("r" * len(n.green["A"]))
                if t - st["t_ig"] >= n.ig:
                    st.update(cur=1 - st["cur"], mode="green", since=t)
                    n._set(n.green[n.STAGES[st["cur"]]])


def make_pressure_chooser(lam):
    """Score split options with DoS / (1 + lam * exit blocking).

    Exit blocking of a stage = how full the *downstream* links its traffic
    feeds are, from SCOOT's own queue model (modelled queue / link storage),
    counted only above 30% full. Links leaving the network count as free."""

    def blocking(node, stage):
        vals = []
        for l in node.stage_links[stage]:
            for down in node.region.links.values():
                if down.frm == node.tls and down.to in node.region.node_of and down.cls == "art" and l.cls == "art":
                    # same direction: W->E traffic of l continues on down if down heads away from l's origin
                    if down.to != l.frm:
                        vals.append(max(0.0, (down.q / down.qcap - 0.3) / 0.7))
        return max(vals) if vals else 0.0

    def chooser(node, k, dos):
        cyc = node.region.C
        blk = {s: blocking(node, s) for s in node.STAGES}
        scores = {}
        for d in dos:
            extra = [0.0, 0.0]
            extra[k] = d
            win = dict(zip(node.STAGES, node.windows(cyc, extra)))
            scores[d] = max(l.dos(win[s], cyc) / (1 + lam * blk[s]) for s in node.STAGES for l in node.stage_links[s])
        node.stats.setdefault("blocked_decisions", 0)
        if core.choose_split(scores) != core.choose_split(dos):
            node.stats["blocked_decisions"] += 1
        return core.choose_split(scores)
    return chooser


def main():
    p = cli.parser(__doc__)
    p.add_argument("--lam", type=float, default=2.0)
    args = p.parse_args()
    out = cli.outdir(args, "mastery/maxpressure")
    end = args.end or 5400
    results = []
    for spacing in (300, 120):
        tag = f"_{spacing}m"
        results += [
            run(advanced(end, spacing=spacing), mode_config("scoot", bus_priority=True), "scoot" + tag, out, seed=args.seed),
            run(advanced(end, spacing=spacing), mode_config("scoot"), "mp_pure" + tag, out, seed=args.seed,
                pure_controller=MaxPressure),
            run(advanced(end, spacing=spacing), mode_config("scoot", bus_priority=True,
                                                            split_chooser=make_pressure_chooser(args.lam)),
                "scoot_pressure" + tag, out, seed=args.seed),
        ]
        print("  split decisions changed by exit blocking:",
              sum(n.stats.get("blocked_decisions", 0) for n in results[-1]["_nodes"]))
    cli.write_summary(results, os.path.join(out, "maxpressure.csv"))
    plots.compare_bars(results, os.path.join(out, "maxpressure.png"),
                       "SCOOT vs max-pressure vs exit-blocking-aware SCOOT (300 m and 120 m links)")


if __name__ == "__main__":
    main()
