"""
MASTERY 5 - Emissions-aware SCOOT: tuning the stop penalty
==========================================================
Research question: SCOOT's performance index is delay + K * stops. Stops cost
fuel and emissions (TRANSYT's fuel weighting is ~20 s of delay per stop;
SCOOT normally uses much less). How do delay, stops and CO2 trade off as K
changes?  SUMO's HBEFA emission model gives CO2 per vehicle.

    python mastery/05_emissions_stop_weight.py
"""
import _path  # noqa: F401
import os

from scoot import cli, plots
from scoot.runner import mode_config, run
from scoot.scenarios import advanced

WEIGHTS = [0.0, 4.0, 12.0, 20.0, 40.0]


def main():
    args = cli.parser(__doc__).parse_args()
    out = cli.outdir(args, "mastery/emissions")
    end = args.end or 5400
    results = []
    for k in WEIGHTS:
        results.append(run(advanced(end), mode_config("scoot", bus_priority=True, stop_weight=k), f"K={k:g}", out,
                           seed=args.seed, emissions=True))
    cli.write_summary(results, os.path.join(out, "stop_weight.csv"))
    plots.compare_bars(results, os.path.join(out, "stop_weight.png"), "Stop weight K in the SCOOT performance index",
                       keys=("avg_delay", "stops_per_veh", "co2_g_per_veh"))


if __name__ == "__main__":
    main()
