"""
FOUNDATION 1 - From detector to queue: LPUs, cyclic flow profiles, queue model
==============================================================================
SCOOT never measures the queue directly. It counts link profile units (LPUs)
at a detector near the *upstream* end of the link, predicts when they will
reach the stop line (cruise time + platoon dispersion), and runs a queue
model: arrivals join the back of the queue; during effective green the queue
discharges at the saturation occupancy (SATO).

This lab runs one SCOOT junction and compares the model with what SUMO
really did, second by second.

    python foundation/01_lpu_profiles_queue.py --link W_J1
Outputs in results/foundation/: model_vs_sumo_<link>.png, profile_<link>.png,
model_vs_sumo_<link>.csv
"""
import _path  # noqa: F401
import csv
import os
import statistics

from scoot import cli, plots
from scoot.runner import mode_config, run
from scoot.scenarios import foundation


def main():
    p = cli.parser(__doc__)
    p.add_argument("--link", default="W_J1", help="approach link to inspect (W_J1, E_J1, N1_J1, S1_J1)")
    args = p.parse_args()
    out = cli.outdir(args, "foundation")
    res = run(foundation(args.end or 3600), mode_config("scoot", log_links=[args.link]), "lpu_lab", out,
              seed=args.seed, gui=args.gui)
    link = res["_links"][args.link]
    log = link.log
    with open(os.path.join(out, f"model_vs_sumo_{args.link}.csv"), "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["t", "model_queue_veh", "sumo_halting_veh", "lpu_detector", "lpu_arrivals_stopline"])
        w.writerows([[r[0], round(r[1], 2), r[2], round(r[3], 2), round(r[4], 3)] for r in log])
    plots.model_vs_sumo(log, os.path.join(out, f"model_vs_sumo_{args.link}.png"),
                        f"SCOOT model vs SUMO on {args.link} (peak, 4 minutes)", 1500, 1740)
    plots.profile_plot(link, os.path.join(out, f"profile_{args.link}.png"),
                       f"Learnt cyclic flow profile on {args.link} at the end of the run (C = {len(link.prof)} s)")
    print(f"\nLink {args.link}: detector {link.det_ids[0].split('_')[0]} at the upstream end,"
          f" cruise time {link.cruise:.1f} s, SATO {link.sat:.2f} LPU/s")
    print(f"{'period':>12} {'model queue':>12} {'SUMO queue':>11} {'LPU/s':>7}")
    for a in range(0, int(args.end or 3600), 600):
        seg = [r for r in log if a <= r[0] < a + 600]
        print(f"{a:5d}-{a + 600:<6d} {statistics.mean(r[1] for r in seg):12.1f} "
              f"{statistics.mean(r[2] for r in seg):11.1f} {statistics.mean(r[3] for r in seg):7.2f}")
    err = statistics.mean(abs(r[1] - r[2]) for r in log)
    print(f"\nMean |model - SUMO| queue error: {err:.1f} vehicles")
    print("Exercise: rerun foundation/02_validate_model.py, then change sato_per_lane by +30%\n"
          "in ScootConfig and see how the model queue drifts away from SUMO.")


if __name__ == "__main__":
    main()
