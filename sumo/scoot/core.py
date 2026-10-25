"""
scoot.core - pure-Python, simulator-independent SCOOT-style algorithms.

No SUMO here, so everything can be unit-tested and mirrored in the website's
JavaScript (docs/js/engine.js).

IMPORTANT: SCOOT (Split Cycle Offset Optimisation Technique) is a product of
TRL Software. This module is an *educational re-implementation* of the
principles published in the literature (TRRL LR1014, TAL 7/99, ...): upstream
detection, link profile units, cyclic flow profiles, a queue model with
platoon dispersion, and the split / offset / cycle optimisers. Numeric
settings are illustrative teaching values, not TRL's.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional, Sequence, Tuple

# ---------------------------------------------------------------------------
# 1. Link profile units (LPU)
# ---------------------------------------------------------------------------

LPU_PER_VEHICLE = 1.0       # weight of a vehicle count
LPU_PER_OCC_SECOND = 2.0    # weight of each second the loop is occupied


def lpu(vehicles: float, occupied_seconds: float) -> float:
    """Link profile units measured by an upstream detector in one interval.

    SCOOT's LPU is a hybrid of flow and occupancy. This lab uses
        LPU = 1 * vehicles + 2 * occupied seconds
    so a car crossing at 50 km/h (~0.4 s on the loop) is ~1.8 LPU and a
    12 m truck (~1 s) is ~3 LPU: long vehicles 'count more', as they use
    more green. TRL's exact coding is not published; any hybrid with that
    property teaches the same ideas.
    """
    return LPU_PER_VEHICLE * vehicles + LPU_PER_OCC_SECOND * occupied_seconds


# ---------------------------------------------------------------------------
# 2. Platoon dispersion (Robertson, as used in TRANSYT and SCOOT)
# ---------------------------------------------------------------------------

def robertson_factor(cruise_time: float, alpha: float = 0.35, beta: float = 0.8) -> Tuple[float, int]:
    """Smoothing factor F and lag (s) of Robertson's platoon dispersion model.

        q_stop(t + beta*T) = F * q_up(t) + (1 - F) * q_stop(t + beta*T - 1)
        F = 1 / (1 + alpha * beta * T)
    """
    lag = max(1, int(round(beta * cruise_time)))
    F = 1.0 / (1.0 + alpha * beta * cruise_time)
    return F, lag


def disperse(profile: Sequence[float], cruise_time: float, cyclic: bool = True) -> List[float]:
    """Predict the stop-line arrival profile from an upstream detector profile."""
    F, lag = robertson_factor(cruise_time)
    n = len(profile)
    out = [0.0] * n
    prev = sum(profile) / n if (cyclic and n) else 0.0
    for _ in range(2 if cyclic else 1):          # second pass reaches cyclic steady state
        for i in range(n):
            src = profile[(i - lag) % n] if cyclic else (profile[i - lag] if i >= lag else 0.0)
            prev = F * src + (1 - F) * prev
            out[i] = prev
    return out


# ---------------------------------------------------------------------------
# 3. Queue model on one link
# ---------------------------------------------------------------------------

def effective_green_mask(cycle: int, green_start: float, green_end: float,
                         start_lag: float, end_lag: float) -> List[bool]:
    """Cycle-second mask of effective green (when the queue can discharge).

    green_start/green_end are the signal green window in cycle seconds (may wrap).
    Effective green starts start_lag after green and ends end_lag after
    green ends (vehicles keep crossing during early amber).
    """
    a = green_start + start_lag
    b = green_end + end_lag
    mask = [False] * cycle
    length = (b - a) % cycle if (b - a) % cycle else (cycle if b != a else 0)
    for k in range(int(round(length))):
        mask[int(round(a + k)) % cycle] = True
    return mask


def simulate_queue(arrivals: Sequence[float], eff_green: Sequence[bool], sat: float,
                   cycles: int = 3, q0: float = 0.0) -> Dict[str, float]:
    """Cyclic queue simulation (LPU) used by the optimisers.

    arrivals : LPU arriving at the stop line in each cycle second
    eff_green: effective-green mask, same length
    sat      : saturation occupancy SATO (LPU discharged per second of effective green)
    Returns per-cycle delay (LPU*s of queue), stops (LPU joining a queue), the
    residual queue at the end and the max queue - all for the *last* simulated cycle.
    """
    n = len(arrivals)
    q = q0
    delay = stops = qmax = 0.0
    for c in range(cycles):
        last = c == cycles - 1
        for i in range(n):
            a = arrivals[i]
            if q > 0.01 or not eff_green[i]:
                if last:
                    stops += a
            q += a
            if eff_green[i]:
                q -= min(q, sat)
            if last:
                delay += q
                qmax = max(qmax, q)
    return {"delay": delay, "stops": stops, "residual": q, "qmax": qmax}


def degree_of_saturation(demand_per_cycle: float, eff_green_s: float, sat: float,
                         residual: float = 0.0) -> float:
    """SCOOT-style DoS: (arrivals + residual queue) / (capacity in the cycle)."""
    cap = eff_green_s * sat
    if cap <= 0:
        return 9.9
    return (demand_per_cycle + residual) / cap


def performance_index(delay_lpus: float, stops_lpu: float, stop_weight: float = 4.0,
                      lpu_per_veh: float = 1.8) -> float:
    """PI = delay (veh*s) + K * stops (veh). SCOOT weights stops much less than
    TRANSYT's fuel-based ~20 s; K is tunable (see mastery/05)."""
    return (delay_lpus + stop_weight * stops_lpu) / lpu_per_veh


# ---------------------------------------------------------------------------
# 4. Stage timings at a node
# ---------------------------------------------------------------------------

def stage_windows(change_times: Sequence[float], intergreens: Sequence[float],
                  cycle: float) -> List[Tuple[float, float]]:
    """Green window (start, end) of each stage in cycle seconds.

    change_times[k] = moment stage k's green ends (amber starts).
    Stage k's green starts at change_times[k-1] + intergreen[k-1].
    """
    n = len(change_times)
    out = []
    for k in range(n):
        start = (change_times[k - 1] + intergreens[k - 1]) % cycle
        out.append((start, change_times[k] % cycle))
    return out


def green_lengths(change_times, intergreens, cycle) -> List[float]:
    return [((e - s) % cycle) for s, e in stage_windows(change_times, intergreens, cycle)]


# ---------------------------------------------------------------------------
# 5. The three optimisers
# ---------------------------------------------------------------------------

def split_options(change_times: List[float], k: int, intergreens, min_greens,
                  cycle: float, authority: float = 4.0) -> List[float]:
    """Feasible moves of stage change k: retard (-), keep (0), advance (+ = later)."""
    opts = []
    for d in (-authority, 0.0, authority):
        trial = list(change_times)
        trial[k] = (trial[k] + d) % cycle
        g = green_lengths(trial, intergreens, cycle)
        if all(g[i] >= min_greens[i] - 1e-6 for i in range(len(g))):
            opts.append(d)
    return opts or [0.0]


def choose_split(dos_by_option: Dict[float, float]) -> float:
    """Pick the move giving the lowest maximum DoS; ties keep the timing."""
    best = min(dos_by_option.values())
    if abs(dos_by_option.get(0.0, 99) - best) < 1e-9:
        return 0.0
    return min(dos_by_option, key=lambda d: (dos_by_option[d], abs(d)))


def choose_offset(pi_by_option: Dict[float, float]) -> float:
    best = min(pi_by_option.values())
    if abs(pi_by_option.get(0.0, 1e18) - best) < 1e-9:
        return 0.0
    return min(pi_by_option, key=lambda d: (pi_by_option[d], abs(d)))


@dataclass
class CycleParams:
    c_min: float = 40.0
    c_max: float = 120.0
    target: float = 0.90       # DoS kept at the critical node
    lower: float = 0.80        # all below this -> shorten
    period: float = 300.0      # normal optimiser interval (s)
    fast_period: float = 150.0 # when cycle is rising


def cycle_step(cycle: float) -> float:
    """SCOOT changes cycle time in 4, 8 or 16 s steps; longer cycles, bigger steps."""
    if cycle < 64:
        return 4.0
    if cycle < 128:
        return 8.0
    return 16.0


def next_cycle(cycle: float, critical_dos: float, p: CycleParams = CycleParams()) -> Tuple[float, str]:
    """Cycle optimiser decision for a region from the critical node's max DoS."""
    if critical_dos > p.target:
        return min(p.c_max, cycle + cycle_step(cycle)), "up"
    if critical_dos < p.lower:
        return max(p.c_min, cycle - cycle_step(max(p.c_min, cycle - 4))), "down"
    return cycle, "hold"


def can_double_cycle(node_dos_at_half_cycle: float, target: float = 0.90) -> bool:
    """A node may run at half the region cycle if it stays below target DoS."""
    return node_dos_at_half_cycle <= target


def resample(profile: Sequence[float], new_len: int) -> List[float]:
    """Stretch a cyclic profile to a new cycle length, conserving its total."""
    n = len(profile)
    if n == new_len or n == 0:
        return list(profile)
    tot = sum(profile)
    out = [profile[int(i * n / new_len)] for i in range(new_len)]
    s = sum(out) or 1.0
    return [v * tot / s for v in out]


def webster_cycle(lost_time: float, flow_ratios: Sequence[float]) -> float:
    """Webster's optimum fixed cycle C0 = (1.5 L + 5) / (1 - Y) - the fixed-time reference."""
    Y = sum(flow_ratios)
    if Y >= 0.95:
        return float("inf")
    return (1.5 * lost_time + 5.0) / (1.0 - Y)
