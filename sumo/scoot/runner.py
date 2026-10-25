"""
scoot.runner - builds a scenario, runs SUMO with the SCOOT controller (or a
baseline), and returns performance metrics + logs.
"""
from __future__ import annotations

import csv
import json
import os
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from typing import Callable, Dict, List, Optional

import sumolib
import traci
import traci.constants as tc

from . import controller as ctl
from .network import build_corridor, write_demand


@dataclass
class Scenario:
    name: str
    n: int = 1
    spacing: float = 300.0
    periods: List[dict] = field(default_factory=list)
    bus_headway: float = 0.0
    regions: List[List[int]] = field(default_factory=lambda: [[0]])   # junction indices per region
    end: float = 3600.0


MODES = {
    # TRANSYT-style fixed plan: 80 s, 60/40 split, eastbound progression offsets
    "fixed":    dict(split_opt=False, offset_opt=False, cycle_opt=False, initial_cycle=80.0),
    "actuated": dict(split_opt=False, offset_opt=False, cycle_opt=False),
    "scoot":    dict(),
}


def mode_config(mode: str, **overrides) -> ctl.ScootConfig:
    cfg = ctl.ScootConfig(**MODES[mode])
    for k, v in overrides.items():
        setattr(cfg, k, v)
    cfg._mode = mode
    return cfg


def _parse_tripinfo(path: str) -> Dict[str, float]:
    tot = {"n": 0, "duration": 0.0, "timeLoss": 0.0, "waiting": 0.0, "stops": 0, "co2": 0.0}
    bus = {"n": 0, "timeLoss": 0.0}
    for _, el in ET.iterparse(path):
        if el.tag == "emissions":
            tot["co2"] += float(el.get("CO2_abs", 0.0))
            continue
        if el.tag != "tripinfo":
            continue
        # delay = time lost on the network + time spent waiting to enter it
        tl = float(el.get("timeLoss")) + float(el.get("departDelay", 0.0))
        tot["n"] += 1
        tot["duration"] += float(el.get("duration")) + float(el.get("departDelay", 0.0))
        tot["timeLoss"] += tl
        tot["waiting"] += float(el.get("waitingTime"))
        tot["stops"] += int(el.get("waitingCount"))
        if el.get("vType", "").startswith("bus"):
            bus["n"] += 1
            bus["timeLoss"] += tl
    n = max(tot["n"], 1)
    return {"trips": tot["n"],
            "avg_travel_time": round(tot["duration"] / n, 2),
            "avg_delay": round(tot["timeLoss"] / n, 2),
            "avg_wait": round(tot["waiting"] / n, 2),
            "stops_per_veh": round(tot["stops"] / n, 3),
            "co2_g_per_veh": round(tot["co2"] / n / 1000.0, 1),
            "bus_avg_delay": round(bus["timeLoss"] / max(bus["n"], 1), 2) if bus["n"] else None}


def run(scn: Scenario, cfg: ctl.ScootConfig, label: str, outdir: str,
        seed: int = 1, gui: bool = False, pure_controller: Optional[Callable] = None,
        verbose: bool = True, emissions: bool = False) -> Dict:
    """Run one simulation and return metrics.

    pure_controller: optional factory (net, nodes, links) -> object with .step(t, det_data, lane_data)
                     for research baselines that replace SCOOT (e.g. max-pressure).
    """
    os.makedirs(outdir, exist_ok=True)
    info = build_corridor(os.path.join(outdir, "net"), n=scn.n, spacing=scn.spacing)
    rou = os.path.join(outdir, f"{scn.name}.rou.xml")
    write_demand(rou, scn.n, scn.periods, bus_headway=scn.bus_headway)
    trip = os.path.join(outdir, f"tripinfo_{label}.xml")
    binary = sumolib.checkBinary("sumo-gui" if gui else "sumo")
    cmd = [binary, "-n", info["net"], "-r", rou, "-a", info["loops"],
           "--step-length", "1", "--seed", str(seed), "--tripinfo-output", trip,
           "--no-step-log", "true", "--duration-log.disable", "true", "--no-warnings", "true",
           "--time-to-teleport", "300", "--end", str(scn.end + 900)]
    if emissions:
        cmd += ["--device.emissions.probability", "1"]
    if gui:
        cmd += ["--start", "--delay", "50"]
    traci.start(cmd)
    net = sumolib.net.readNet(info["net"])

    mode = getattr(cfg, "_mode", "scoot")
    C0 = int(cfg.initial_cycle)
    links = {eid: ctl.Link(eid, li, "art" if (li["from"] in ("W", "E") or li["from"].startswith("J")) else "side", cfg, C0)
             for eid, li in info["links"].items()}
    nodes = []
    for k in range(scn.n):
        x = info["xs"][k]
        offset = (x / cfg.progression_speed) % C0          # eastbound progression to start
        nodes.append(ctl.Node(f"J{k + 1}", net, links, cfg, x, C0, offset))

    if pure_controller is not None:
        brain = pure_controller(net, nodes, links)
    elif mode == "actuated":
        brain = None
        act = [ctl.ActuatedNode(n) for n in nodes]
    else:
        regions = []
        for ri, members in enumerate(scn.regions):
            mem = [nodes[k] for k in members]
            rl = {eid: l for eid, l in links.items() if l.to in {m.tls for m in mem}}
            regions.append(ctl.Region(f"R{ri + 1}", mem, rl, cfg, C0))

    det_ids = [d for l in links.values() for d in l.det_ids + l.stop_ids]
    lane_ids = sorted({ln for l in links.values() for ln in l.lane_ids} |
                      {lk[0][1] for n in nodes for lk in traci.trafficlight.getControlledLinks(n.tls)})
    for d in det_ids:
        traci.inductionloop.subscribe(d, [tc.LAST_STEP_OCCUPANCY, tc.LAST_STEP_VEHICLE_ID_LIST])
    for ln in lane_ids:
        traci.lane.subscribe(ln, [tc.LAST_STEP_VEHICLE_NUMBER, tc.LAST_STEP_VEHICLE_HALTING_NUMBER])

    while True:
        traci.simulationStep()
        t = traci.simulation.getTime()
        det_data = traci.inductionloop.getAllSubscriptionResults()
        lane_data = traci.lane.getAllSubscriptionResults()
        if pure_controller is not None:
            brain.step(t, det_data, lane_data)
        elif mode == "actuated":
            for a in act:
                a.step(t, det_data)
        else:
            for r in regions:
                r.step(t, det_data, lane_data)
        if (t >= scn.end and traci.simulation.getMinExpectedNumber() == 0) or t >= scn.end + 900:
            break
    traci.close()

    metrics = _parse_tripinfo(trip)
    metrics["label"] = label
    if mode == "scoot" and pure_controller is None:
        with open(os.path.join(outdir, f"cycles_{label}.csv"), "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["t", "node", "C", "change_A", "change_B", "g_A", "g_B", "DoS_A", "DoS_B", "congestion"])
            for n in nodes:
                for r in n.history:
                    w.writerow([r["t"], r["tls"], r["C"], r["change"][0], r["change"][1],
                                round(r["g"]["A"], 1), round(r["g"]["B"], 1), r["dos"]["A"], r["dos"]["B"], r["cong"]])
        log = [e for r in regions for e in r.log]
        with open(os.path.join(outdir, f"cycleopt_{label}.json"), "w") as f:
            json.dump(log, f, indent=1)
        metrics["_regions"] = regions
        metrics["_log"] = log
        metrics["split_decisions"] = {k: sum(n.stats["split"][k] for n in nodes) for k in (-1, 0, 1)}
        metrics["offset_decisions"] = {k: sum(n.stats["offset"][k] for n in nodes) for k in (-1, 0, 1)}
    metrics["_nodes"] = nodes
    metrics["_links"] = links
    if verbose:
        print(f"[{label:>16}] trips={metrics['trips']:5d}  delay={metrics['avg_delay']:6.1f}s  "
              f"travel={metrics['avg_travel_time']:6.1f}s  stops/veh={metrics['stops_per_veh']:.2f}"
              + (f"  bus_delay={metrics['bus_avg_delay']}s" if metrics['bus_avg_delay'] is not None else "")
              + (f"  CO2={metrics['co2_g_per_veh']}g" if emissions else ""), flush=True)
    return metrics
