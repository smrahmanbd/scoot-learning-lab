"""
MASTERY 2 - A learning split optimiser inside SCOOT
===================================================
Research question: SCOOT's split optimiser chooses retard / keep / advance
(-4 / 0 / +4 s) by minimising the maximum modelled DoS. Can a reinforcement-
learning agent make that same three-way choice better, while every other
SCOOT safeguard (min greens, offsets, cycle optimiser) stays in place?

Agent: tabular Q-learning shared by all stage changes.
  state  : (stage being ended, bin(DoS ending stage), bin(DoS next stage),
            bin(modelled queue of ending stage now))
  action : -4, 0, +4 s
  reward : - change in total modelled queue over the next cycle (LPU), via a
           per-node running queue measure at the next decision

    python mastery/02_rl_split_optimiser.py --episodes 10
"""
import _path  # noqa: F401
import json
import os
import random
from collections import defaultdict

from scoot import cli, plots
from scoot.runner import mode_config, run
from scoot.scenarios import advanced

ACTIONS = [-4.0, 0.0, 4.0]


def b(x, edges=(0.5, 0.8, 1.0)):
    return sum(x > e for e in edges)


class QSplit:
    def __init__(self, alpha=0.2, gamma=0.6, eps=0.3):
        self.Q = defaultdict(lambda: [0.0, 0.0, 0.0])
        self.alpha, self.gamma, self.eps = alpha, gamma, eps
        self.prev = {}

    def __call__(self, node, k, dos):
        cyc = node.region.C
        win = dict(zip(node.STAGES, node.windows(cyc)))
        st_end, st_next = node.STAGES[k], node.STAGES[1 - k]
        d_end = max([l.dos(win[st_end], cyc) for l in node.stage_links[st_end]] or [0])
        d_next = max([l.dos(win[st_next], cyc) for l in node.stage_links[st_next]] or [0])
        q = sum(l.q for l in node.in_links) / node.cfg.lpu_per_veh
        s = (k, b(d_end), b(d_next), min(3, int(q // 8)))
        key = (node.tls, k)
        if key in self.prev and self.eps > 0:
            ps, pa, pq = self.prev[key]
            r = -(q - pq) - 0.05 * q
            self.Q[ps][pa] += self.alpha * (r + self.gamma * max(self.Q[s]) - self.Q[ps][pa])
        valid = [i for i, a in enumerate(ACTIONS) if a in dos]
        if random.random() < self.eps:
            a = random.choice(valid)
        else:
            a = max(valid, key=lambda i: self.Q[s][i])
        self.prev[key] = (s, a, q)
        return ACTIONS[a]


def main():
    p = cli.parser(__doc__)
    p.add_argument("--episodes", type=int, default=10)
    args = p.parse_args()
    out = cli.outdir(args, "mastery/rl")
    random.seed(args.seed)
    agent = QSplit()
    curve = []
    for ep in range(args.episodes):
        agent.eps = max(0.05, 0.3 * (1 - ep / max(args.episodes - 1, 1)))
        agent.prev = {}
        r = run(advanced(args.end or 3600), mode_config("scoot", bus_priority=True, split_chooser=agent),
                f"train_{ep:02d}", out, seed=100 + ep, verbose=False)
        curve.append(r["avg_delay"])
        print(f"episode {ep:2d}  eps={agent.eps:.2f}  delay={r['avg_delay']:.1f}s  states={len(agent.Q)}")
    with open(os.path.join(out, "q_table.json"), "w") as f:
        json.dump({str(k): v for k, v in agent.Q.items()}, f, indent=1)
    agent.eps = 0.0
    rows = []
    for seed in (7, 8, 9):
        rows.append(run(advanced(5400), mode_config("scoot", bus_priority=True), f"scoot_s{seed}", out, seed=seed))
        agent.prev = {}
        rows.append(run(advanced(5400), mode_config("scoot", bus_priority=True, split_chooser=agent),
                        f"rl_s{seed}", out, seed=seed))
    cli.write_summary(rows, os.path.join(out, "rl_vs_scoot.csv"))
    plots.line_compare(list(range(len(curve))), {"training delay": curve}, os.path.join(out, "learning_curve.png"),
                       "Q-learning split optimiser - training", "Episode", "Mean delay (s/veh)")
    s = [r["avg_delay"] for r in rows[0::2]]
    q = [r["avg_delay"] for r in rows[1::2]]
    print(f"\nUnseen seeds: SCOOT {sum(s) / 3:.1f}s vs RL split optimiser {sum(q) / 3:.1f}s mean delay")


if __name__ == "__main__":
    main()
