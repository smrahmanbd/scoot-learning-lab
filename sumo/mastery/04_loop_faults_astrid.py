"""
MASTERY 4 - Detector faults and ASTRID-style historic substitution
==================================================================
Research question: every SCOOT link depends on one upstream detector. What
happens when loops fail, and how well does substituting *historic* profiles
(as SCOOT does with ASTRID data) recover performance?

At t = 25 min a random 30% of SCOOT detectors fail (half stuck-on, half
stuck-off). The fault logic flags a loop after 2 min continuously occupied or
10 min silent. Runs:

  healthy   no faults
  none      faulty data used as if it were real
  astrid    flagged loops replaced by the link's historic profile, recorded
            shortly before the faults (in practice: same weekday/time in ASTRID)

    python mastery/04_loop_faults_astrid.py --fail-share 0.3
"""
import _path  # noqa: F401
import os
import random

from scoot import cli, plots
from scoot.runner import mode_config, run
from scoot.scenarios import advanced

T_FAIL = 1500


def make_filter(share, seed):
    rng = random.Random(seed)
    decided = {}

    def f(det, occ, ids, t):
        if t < T_FAIL or not det.startswith("up_"):
            return occ, ids
        if det not in decided:
            r = rng.random()
            decided[det] = "off" if r < share / 2 else "on" if r < share else "ok"
        m = decided[det]
        if m == "off":
            return 0.0, ()
        if m == "on":
            return 100.0, ()
        return occ, ids
    f.decided = decided
    return f


def main():
    p = cli.parser(__doc__)
    p.add_argument("--fail-share", type=float, default=0.3)
    args = p.parse_args()
    out = cli.outdir(args, "mastery/faults")
    end = args.end or 5400
    results = [run(advanced(end), mode_config("scoot", bus_priority=True), "healthy", out, seed=args.seed)]
    for strat in ("none", "astrid"):
        f = make_filter(args.fail_share, 42)
        snap = {"done": False}

        def on_cycle_end(node, rec, snap=snap):
            if not snap["done"] and rec["t"] >= T_FAIL - 120:
                for l in node.region.links.values():
                    l.snapshot_history()
                snap["done"] = True

        res = run(advanced(end), mode_config("scoot", bus_priority=True, sensor_filter=f, fault_handling=strat,
                                             on_cycle_end=on_cycle_end), f"faults_{strat}", out, seed=args.seed)
        res["failed_detectors"] = sum(1 for v in f.decided.values() if v != "ok")
        results.append(res)
    cli.write_summary(results, os.path.join(out, "faults.csv"))
    plots.compare_bars(results, os.path.join(out, "faults.png"),
                       f"{int(args.fail_share * 100)}% of SCOOT detectors fail at minute 25")


if __name__ == "__main__":
    main()
