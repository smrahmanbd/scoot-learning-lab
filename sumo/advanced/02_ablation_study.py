"""
ADVANCED 2 - Ablation: which SCOOT mechanism earns its keep?
===========================================================
Switch one mechanism off at a time on the four-junction region:

  full                everything on
  no_split_opt        split optimiser off (initial 60/40 split all day)
  no_offset_opt       offset optimiser off (initial eastbound offsets)
  no_cycle_opt        cycle optimiser off (60 s all day)
  no_congestion       congestion importance factor = 0
  no_bus_priority     extensions and recalls off
  two_regions         J1-J2 and J3-J4 as separate regions (own cycles)

    python advanced/02_ablation_study.py      (~2 min)
"""
import _path  # noqa: F401
import os

from scoot import cli, plots
from scoot.runner import mode_config, run
from scoot.scenarios import advanced

VARIANTS = {
    "full": ({}, None),
    "no_split_opt": ({"split_opt": False}, None),
    "no_offset_opt": ({"offset_opt": False}, None),
    "no_cycle_opt": ({"cycle_opt": False}, None),
    "no_congestion": ({"congestion_importance": 0.0}, None),
    "no_bus_priority": ({"bus_priority": False}, None),
    "two_regions": ({}, [[0, 1], [2, 3]]),
}


def main():
    args = cli.parser(__doc__).parse_args()
    out = cli.outdir(args, "advanced/ablation")
    results = []
    for name, (ov, regions) in VARIANTS.items():
        kw = {"bus_priority": True}
        kw.update(ov)
        results.append(run(advanced(args.end or 5400, regions=regions), mode_config("scoot", **kw), name, out,
                           seed=args.seed))
    cli.write_summary(results, os.path.join(out, "ablation.csv"))
    plots.compare_bars(results, os.path.join(out, "ablation.png"), "SCOOT ablation on the four-junction region")
    print(f"\nAblation table: {os.path.join(out, 'ablation.csv')}")


if __name__ == "__main__":
    main()
