"""
FOUNDATION 3 - Fixed time vs vehicle actuated vs SCOOT (single junction)
========================================================================
Same demand (off-peak -> peak -> off-peak), three controllers:

  fixed     : one 80 s TRANSYT-style plan all hour
  actuated  : isolated gap-out on stop-line loops (max greens 45 / 30 s)
  scoot     : upstream detectors, queue model, split + offset + cycle optimisers

    python foundation/03_fixed_vs_scoot.py [--gui]
Outputs: results/foundation/{summary.csv, compare.png, node_timeline.png}
"""
import _path  # noqa: F401
import os

from scoot import cli, plots
from scoot.runner import mode_config, run
from scoot.scenarios import foundation


def main():
    args = cli.parser(__doc__).parse_args()
    out = cli.outdir(args, "foundation")
    scn = foundation(args.end or 3600)
    results = [run(scn, mode_config(m), m, out, seed=args.seed, gui=args.gui and m == "scoot")
               for m in ("fixed", "actuated", "scoot")]
    cli.write_summary(results, os.path.join(out, "summary.csv"))
    plots.compare_bars(results, os.path.join(out, "compare.png"), "Single junction - one hour, peak in the middle")
    s = results[-1]
    plots.node_timeline(s["_nodes"][0], s["_log"], os.path.join(out, "node_timeline.png"),
                        "SCOOT at one junction: cycle, greens and modelled DoS")
    print("\nCycle optimiser decisions:")
    for e in s["_log"]:
        print(f"  t={e['t']:5.0f}s  C={e['C']:3d}s  critical DoS={e['dos']:.2f}  {e['action']}")
    print(f"Split decisions (retard/keep/advance): {s['split_decisions']}")
    print(f"\nFigures and CSVs in {out}")


if __name__ == "__main__":
    main()
