"""Standard scenarios used by the three learning levels."""
from .runner import Scenario


def foundation(end: float = 3600.0) -> Scenario:
    """One junction with an off-peak / peak / off-peak profile."""
    third = end / 3
    periods = [
        dict(begin=0, end=third, east=700, west=600, side=250, turn=50),
        dict(begin=third, end=2 * third, east=1600, west=1400, side=550, turn=80),
        dict(begin=2 * third, end=end, east=700, west=600, side=250, turn=50),
    ]
    return Scenario("foundation", n=1, periods=periods, regions=[[0]], end=end)


def advanced(end: float = 5400.0, bus_headway: float = 240.0, regions=None, spacing: float = 300.0) -> Scenario:
    """Four junctions 300 m apart in one SCOOT region; eastbound AM peak,
    westbound PM peak, buses both ways."""
    q = end / 4.5
    periods = [
        dict(begin=0, end=q, east=500, west=450, side=150, turn=30),
        dict(begin=q, end=2.5 * q, east=1800, west=800, side=300, turn=60),
        dict(begin=2.5 * q, end=3.5 * q, east=800, west=1800, side=300, turn=60),
        dict(begin=3.5 * q, end=end, east=500, west=450, side=150, turn=30),
    ]
    return Scenario("advanced", n=4, spacing=spacing, periods=periods, bus_headway=bus_headway,
                    regions=regions or [[0, 1, 2, 3]], end=end)
