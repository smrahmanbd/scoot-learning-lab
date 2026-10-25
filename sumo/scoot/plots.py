"""Matplotlib helpers that turn SCOOT controller logs into teaching figures."""
from __future__ import annotations

from typing import Dict, List

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

COLORS = ["#2b6cb0", "#c0392b", "#2a9d8f", "#d68910", "#7b61ff", "#6c757d", "#8e44ad"]


def _clean(ax):
    ax.spines[["top", "right"]].set_visible(False)


def compare_bars(results: List[Dict], path: str, title: str,
                 keys=("avg_delay", "stops_per_veh", "bus_avg_delay")) -> None:
    keys = [k for k in keys if all(r.get(k) is not None for r in results)]
    fig, axes = plt.subplots(1, len(keys), figsize=(4 * len(keys), 3.4))
    if len(keys) == 1:
        axes = [axes]
    labels = [r["label"] for r in results]
    nice = {"avg_delay": "Mean delay (s/veh)", "stops_per_veh": "Stops per vehicle",
            "bus_avg_delay": "Bus delay (s/bus)", "avg_travel_time": "Travel time (s)",
            "co2_g_per_veh": "CO2 (g/veh)"}
    for ax, k in zip(axes, keys):
        vals = [r[k] for r in results]
        ax.bar(labels, vals, color=COLORS[:len(vals)] if len(vals) <= len(COLORS) else None)
        ax.set_title(nice.get(k, k), fontsize=10)
        ax.tick_params(axis="x", rotation=25, labelsize=8)
        for i, v in enumerate(vals):
            ax.text(i, v, f"{v:.1f}" if v >= 2 else f"{v:.2f}", ha="center", va="bottom", fontsize=8)
        _clean(ax)
    fig.suptitle(title, fontsize=11)
    fig.tight_layout()
    fig.savefig(path, dpi=130)
    plt.close(fig)


def model_vs_sumo(log, path: str, title: str, t0=0, t1=600) -> None:
    """Upstream LPUs, predicted stop-line arrivals and modelled vs real queue on one link."""
    rows = [r for r in log if t0 <= r[0] < t1]
    t = [r[0] for r in rows]
    fig, axes = plt.subplots(2, 1, figsize=(9, 5.5), sharex=True)
    axes[0].bar(t, [r[3] for r in rows], width=1.0, color="#9db4d0", label="LPU at upstream detector")
    axes[0].plot(t, [r[4] for r in rows], color=COLORS[0], lw=1.4, label="predicted stop-line arrivals (dispersed)")
    axes[0].set_ylabel("LPU / s")
    axes[1].plot(t, [r[1] for r in rows], color=COLORS[1], lw=1.6, label="SCOOT model queue (veh)")
    axes[1].plot(t, [r[2] for r in rows], color="black", lw=1.0, alpha=0.7, label="SUMO halted vehicles")
    axes[1].set_ylabel("Queue (veh)")
    axes[1].set_xlabel("Simulation time (s)")
    for ax in axes:
        ax.legend(fontsize=8, loc="upper left")
        _clean(ax)
    fig.suptitle(title, fontsize=11)
    fig.tight_layout()
    fig.savefig(path, dpi=130)
    plt.close(fig)


def profile_plot(link, path: str, title: str) -> None:
    """The learnt cyclic flow profile on a link, with the node's green window."""
    C = len(link.prof)
    fig, ax = plt.subplots(figsize=(8, 3.2))
    ax.bar(range(C), link.prof, width=1.0, color="#9db4d0", label="cyclic flow profile at stop line (LPU)")
    ax.set_xlabel("Cycle second")
    ax.set_ylabel("LPU per cycle-second")
    ax.set_title(title, fontsize=11)
    ax.legend(fontsize=8)
    _clean(ax)
    fig.tight_layout()
    fig.savefig(path, dpi=130)
    plt.close(fig)


def node_timeline(node, region_log, path: str, title: str) -> None:
    H = node.history
    t = [r["t"] / 60 for r in H]
    fig, axes = plt.subplots(2, 1, figsize=(9, 5.5), sharex=True)
    axes[0].step([e["t"] / 60 for e in region_log], [e["C"] for e in region_log], where="post",
                 color="black", lw=1.6, label="region cycle (s)")
    axes[0].plot(t, [r["g"]["A"] for r in H], color=COLORS[0], lw=1, label="green stage A (main)")
    axes[0].plot(t, [r["g"]["B"] for r in H], color=COLORS[1], lw=1, label="green stage B (side)")
    axes[0].set_ylabel("Seconds")
    axes[1].plot(t, [r["dos"]["A"] for r in H], ".-", ms=3, color=COLORS[0], label="DoS stage A")
    axes[1].plot(t, [r["dos"]["B"] for r in H], ".-", ms=3, color=COLORS[1], label="DoS stage B")
    axes[1].axhline(0.9, color="grey", ls="--", lw=0.8, label="90% target")
    axes[1].set_ylabel("Degree of saturation")
    axes[1].set_xlabel("Time (min)")
    for ax in axes:
        ax.legend(fontsize=7, ncol=4, loc="upper left")
        _clean(ax)
    fig.suptitle(title, fontsize=11)
    fig.tight_layout()
    fig.savefig(path, dpi=130)
    plt.close(fig)


def corridor_timeline(nodes, region_log, path: str, title: str) -> None:
    """Cycle optimiser, critical DoS, offsets (stage A change time) and split decisions."""
    fig, axes = plt.subplots(4, 1, figsize=(9, 9.5), sharex=True,
                             gridspec_kw={"height_ratios": [1.1, 1.0, 1.1, 1.0]})
    tl = [e["t"] / 60 for e in region_log]
    axes[0].step(tl, [e["C"] for e in region_log], where="post", color="black", lw=1.8)
    axes[0].set_ylabel("Cycle (s)")
    axes[1].plot(tl, [e["dos"] for e in region_log], "o-", ms=3, color=COLORS[1], label="critical node DoS")
    axes[1].axhline(0.9, color="grey", ls="--", lw=0.8)
    axes[1].set_ylabel("Critical DoS")
    axes[1].legend(fontsize=7, loc="upper left")
    for i, n in enumerate(nodes):
        t = [r["t"] / 60 for r in n.history]
        rel = [((r["change"][0] - nodes[0].history[min(k, len(nodes[0].history) - 1)]["change"][0]) % r["C"]) / r["C"]
               for k, r in enumerate(n.history)]
        axes[2].plot(t, rel, ".", ms=2.5, color=COLORS[i], label=n.tls)
        axes[3].plot(t, [r["g"]["A"] / max(r["C"], 1) for r in n.history], lw=1, color=COLORS[i], label=n.tls)
    axes[2].set_ylabel("Offset vs J1\n(fraction of cycle)")
    axes[3].set_ylabel("Stage A share\nof cycle")
    axes[3].set_xlabel("Time (min)")
    for ax in axes[2:]:
        ax.legend(fontsize=7, ncol=4, loc="upper left")
    for ax in axes:
        _clean(ax)
    fig.suptitle(title, fontsize=11)
    fig.tight_layout()
    fig.savefig(path, dpi=130)
    plt.close(fig)


def line_compare(xs, series: Dict[str, List[float]], path: str, title: str, xlabel: str, ylabel: str):
    fig, ax = plt.subplots(figsize=(7, 4))
    for i, (k, v) in enumerate(series.items()):
        ax.plot(xs, v, "o-", color=COLORS[i % len(COLORS)], label=k)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.set_title(title, fontsize=11)
    ax.legend(fontsize=8)
    _clean(ax)
    fig.tight_layout()
    fig.savefig(path, dpi=130)
    plt.close(fig)
