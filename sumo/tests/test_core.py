"""Unit tests for the SCOOT algorithms (no SUMO needed)."""
import _path  # noqa: F401
import pytest

from scoot import core


def test_lpu_long_vehicles_count_more():
    car = core.lpu(1, 0.4)
    truck = core.lpu(1, 1.0)
    assert car == pytest.approx(1.8)
    assert truck > car


def test_robertson():
    F, lag = core.robertson_factor(20)
    assert lag == 16
    assert F == pytest.approx(1 / (1 + 0.35 * 0.8 * 20))


def test_dispersion_conserves_flow_and_flattens():
    prof = [0.0] * 60
    for i in range(10):
        prof[i] = 3.0                        # a 10 s platoon
    out = core.disperse(prof, 20)
    assert sum(out) == pytest.approx(sum(prof), rel=1e-3)
    assert max(out) < max(prof)              # platoon spreads out


def test_effective_green_mask_wraps():
    m = core.effective_green_mask(60, 50, 10, 2, 3)   # green 50 -> 10 (wraps)
    assert sum(m) == 21
    assert m[52] and m[12] and not m[13] and not m[51]


def test_queue_model_undersaturated_clears():
    arr = [0.5] * 60
    green = [i < 30 for i in range(60)]
    r = core.simulate_queue(arr, green, sat=2.0)
    assert r["residual"] == pytest.approx(r["residual"])  # finite
    assert r["qmax"] <= 0.5 * 30 + 1e-6                  # red queue builds to 15
    assert r["delay"] > 0


def test_queue_model_oversaturated_grows():
    arr = [1.5] * 60
    green = [i < 30 for i in range(60)]
    r1 = core.simulate_queue(arr, green, sat=2.0, cycles=1)
    r3 = core.simulate_queue(arr, green, sat=2.0, cycles=3)
    assert r3["residual"] > r1["residual"] > 0


def test_dos():
    assert core.degree_of_saturation(30, 20, 2.0) == pytest.approx(0.75)
    assert core.degree_of_saturation(30, 20, 2.0, residual=10) == pytest.approx(1.0)


def test_stage_windows():
    w = core.stage_windows([30, 55], [5, 5], 60)
    assert w == [(0, 30), (35, 55)]
    assert core.green_lengths([30, 55], [5, 5], 60) == [30, 20]


def test_split_options_respect_min_green():
    opts = core.split_options([30, 55], 0, [5, 5], [10, 18], 60, 4)
    assert 4.0 not in opts          # would cut B to 16 < 18
    assert -4.0 in opts and 0.0 in opts


def test_choose_split_and_offset():
    assert core.choose_split({-4: 0.9, 0: 0.85, 4: 0.8}) == 4
    assert core.choose_split({-4: 0.9, 0: 0.8, 4: 0.8}) == 0     # ties keep timing
    assert core.choose_offset({-4: 10, 0: 12, 4: 11}) == -4


def test_cycle_steps():
    assert core.cycle_step(40) == 4
    assert core.cycle_step(90) == 8
    assert core.cycle_step(130) == 16
    p = core.CycleParams()
    assert core.next_cycle(60, 0.95, p) == (64, "up")
    assert core.next_cycle(60, 0.85, p) == (60, "hold")
    assert core.next_cycle(60, 0.5, p)[1] == "down"


def test_resample_conserves_total():
    out = core.resample([1, 2, 3, 4], 8)
    assert sum(out) == pytest.approx(10)


def test_webster():
    assert core.webster_cycle(10, [0.35, 0.25]) == pytest.approx(50)
