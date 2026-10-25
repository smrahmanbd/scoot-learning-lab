"""
MASTERY 6 - Predicting stage changes for GLOSA (SCOOT 7 cooperative data)
=========================================================================
Research question: Green Light Optimal Speed Advisory needs "when will this
green end?". SCOOT keeps a *schedule* (stage change times in the cycle) and
changes it only in small steps, so its predictions should be good, but
temporary split changes, offset moves, cycle changes and bus priority all
move the real change. How large is the error, and how does it grow with the
prediction horizon?

At every second of every green we predict the end of green from the current
schedule, then compare with the actual end.

    python mastery/06_glosa_prediction.py
"""
import _path  # noqa: F401
import csv
import os
import statistics

from scoot import cli, plots
from scoot.runner import mode_config, run
from scoot.scenarios import advanced
import scoot.controller as ctl


def main():
    args = cli.parser(__doc__).parse_args()
    out = cli.outdir(args, "mastery/glosa")
    preds = []        # (tls, t_pred, predicted_end, stage_start)
    ends = {}         # (tls, stage_start) -> actual end
    orig = ctl.Node.step

    def step(self, t, tau, cycle):
        orig(self, t, tau, cycle)
        if self.mode == "green":
            win = self.windows(cycle)[self.cur]
            rem = (win[1] - tau) % cycle
            preds.append((self.tls, t, t + rem, self.since))
        elif self.mode == "ig" and abs(t - self.ig_start) < 0.5:
            ends[(self.tls, self.since)] = t

    ctl.Node.step = step
    run(advanced(args.end or 5400), mode_config("scoot", bus_priority=True), "glosa", out, seed=args.seed)
    ctl.Node.step = orig
    by_h = {}
    for tls, tp, pe, start in preds:
        ae = ends.get((tls, start))
        if ae is None:
            continue
        h = int((ae - tp) // 10) * 10
        if h <= 60:
            by_h.setdefault(h, []).append(abs(pe - ae))
    hs = sorted(by_h)
    with open(os.path.join(out, "glosa_error.csv"), "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["horizon_s", "mae_s", "p90_s", "n"])
        for h in hs:
            v = sorted(by_h[h])
            w.writerow([h, round(statistics.mean(v), 2), round(v[int(0.9 * len(v))], 2), len(v)])
            print(f"  {h:2d}-{h + 9:2d} s ahead: MAE {statistics.mean(v):5.2f} s, 90th pct {v[int(0.9 * len(v))]:5.1f} s")
    plots.line_compare(hs, {"mean absolute error": [statistics.mean(by_h[h]) for h in hs]},
                       os.path.join(out, "glosa_error.png"), "Predicting end of green from the SCOOT schedule",
                       "Prediction horizon (s before the real change)", "Error (s)")


if __name__ == "__main__":
    main()
