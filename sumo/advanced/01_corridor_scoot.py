"""
ADVANCED 1 - Full SCOOT on a four-junction region
=================================================
J1 - J2 - J3 - J4, 300 m apart, one SCOOT region (common cycle).
Demand: low -> eastbound peak -> westbound peak -> low, buses every 4 min.

Every SCOOT mechanism runs:
  * upstream detection, LPUs, cyclic flow profiles, dispersion, queue model
  * split optimiser: 5 s before every stage change, -4 / 0 / +4 s temporary,
    1 s permanent, minimising the maximum DoS
  * offset optimiser: once per cycle per node, -4 / 0 / +4 s, minimising the
    performance index (delay + K*stops) on links in and out of the node
  * cycle optimiser: every 5 min (2.5 min while rising), 4/8/16 s steps,
    keeping the critical node at or below 90% DoS
  * congestion importance (queues over the upstream detector)
  * bus priority: extensions and recalls

    python advanced/01_corridor_scoot.py [--gui]
"""
import _path  # noqa: F401
import os

from scoot import cli, plots
from scoot.runner import mode_config, run
from scoot.scenarios import advanced


def main():
    args = cli.parser(__doc__).parse_args()
    out = cli.outdir(args, "advanced")
    scn = advanced(args.end or 5400)
    results = [
        run(scn, mode_config("fixed"), "fixed", out, seed=args.seed),
        run(scn, mode_config("actuated"), "actuated", out, seed=args.seed),
        run(scn, mode_config("scoot", bus_priority=True), "scoot", out, seed=args.seed, gui=args.gui),
    ]
    cli.write_summary(results, os.path.join(out, "summary.csv"))
    plots.compare_bars(results, os.path.join(out, "compare.png"), "Four-junction region - 90 minutes, tidal peaks")
    s = results[-1]
    plots.corridor_timeline(s["_nodes"], s["_log"], os.path.join(out, "corridor_timeline.png"),
                            "SCOOT decisions: cycle, critical DoS, offsets and splits")
    print("\nCycle optimiser log:")
    for e in s["_log"]:
        print(f"  t={e['t']:5.0f}s  C={e['C']:3d}s  critical {e['critical']} DoS={e['dos']:.2f}  {e['action']}")
    for n in s["_nodes"]:
        print(f"  {n.tls}: split {n.stats['split']}  offset {n.stats['offset']}  "
              f"bus extensions {n.stats['ext']}  recalls {n.stats['recall']}")
    print(f"\nFigures and CSVs in {out}")


if __name__ == "__main__":
    main()
