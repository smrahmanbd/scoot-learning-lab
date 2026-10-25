"""
MASTERY 1 - SCOOT fed by connected vehicles instead of loops
============================================================
Research question: SCOOT 7 added cooperative (V2X) data. Could probe /
connected-vehicle (CV) data replace upstream loops entirely, and how much
penetration does the SCOOT model need?

Estimator (transparent baseline - improve it!):
    LPU_hat(t) = (CVs crossing the virtual detector in t) / p * LPU_per_vehicle

Part A - profile accuracy: on the same traffic, compare CV-based cyclic flow
         profiles with loop-based ones at several penetration rates.
Part B - control: run SCOOT on CV-only data and measure delay.

    python mastery/01_cv_lpu.py
Extend: use CV *trajectories* (queue-join positions) to observe the queue
directly; fuse loops + CVs; estimate p online.
"""
import _path  # noqa: F401
import os
import statistics

from scoot import cli, plots
from scoot.controller import is_cv
from scoot.runner import mode_config, run
from scoot.scenarios import advanced

PENETRATIONS = [0.05, 0.1, 0.25, 0.5, 1.0]


def main():
    args = cli.parser(__doc__).parse_args()
    out = cli.outdir(args, "mastery/cv")
    end = args.end or 5400
    base = run(advanced(end), mode_config("scoot", bus_priority=True), "loops", out, seed=args.seed)

    # Part A: replay the CV estimator on the *same* vehicles that crossed the loops
    lpv = mode_config("scoot").lpu_per_veh
    probe = run(advanced(end), mode_config("scoot", bus_priority=True, log_links=["W_J1", "J1_J2", "N2_J2", "J3_J4"]),
                "shadow", out, seed=args.seed, verbose=False)
    print("\nPart A - error of 60 s LPU totals, CV estimate vs loops (same traffic)")
    mae = {}
    for p in PENETRATIONS:
        errs = []
        for lid in ("W_J1", "J1_J2", "N2_J2", "J3_J4"):
            log = probe["_links"][lid].log
            for a in range(600, int(end), 60):
                seg = [r for r in log if a <= r[0] < a + 60]
                loop = sum(r[5] for r in seg)
                cv = sum(sum(1 for v in r[6] if is_cv(v, p)) for r in seg) / p * lpv
                if loop > 2:
                    errs.append(abs(cv - loop) / loop)
        mae[p] = statistics.mean(errs)
        print(f"  p={p:4.2f}  mean relative error = {mae[p] * 100:5.1f} %  ({len(errs)} link-minutes)")

    print("\nPart B - SCOOT driven by CV data only")
    results = [base]
    delays = {}
    for p in PENETRATIONS:
        r = run(advanced(end), mode_config("scoot", bus_priority=True, data_source="cv", cv_penetration=p),
                f"cv_{p}", out, seed=args.seed)
        delays[p] = r["avg_delay"]
        results.append(r)
    cli.write_summary(results, os.path.join(out, "cv_control.csv"))
    plots.line_compare(PENETRATIONS, {"relative error of 60 s LPU totals": [mae[p] for p in PENETRATIONS]},
                       os.path.join(out, "cv_accuracy.png"), "CV-based detection error vs penetration",
                       "CV penetration rate", "Mean relative error")
    plots.line_compare(PENETRATIONS, {"SCOOT on CV data": [delays[p] for p in PENETRATIONS],
                                      "SCOOT on loops": [base["avg_delay"]] * len(PENETRATIONS)},
                       os.path.join(out, "cv_delay.png"), "Delay vs CV penetration", "CV penetration rate",
                       "Mean delay (s/veh)")
    print(f"\nResults in {out}")


if __name__ == "__main__":
    main()
