# SCOOT-style controller for SUMO

Python + TraCI. Runs on the SUMO installed by `pip install eclipse-sumo` (or any SUMO ≥ 1.18).

## Structure

```
scoot/core.py        simulator-independent algorithms (unit tested)
                     LPU, Robertson dispersion, cyclic queue model, DoS, performance index,
                     stage windows, split options/choice, offset choice, cycle steps, Webster
scoot/controller.py  Link     - upstream detector -> LPUs -> dispersion -> queue model,
                                cyclic flow profile, congestion, fault logic, ASTRID substitution
                     Node     - stage change schedule, split optimiser (5 s before each change,
                                -4/0/+4 s temporary, 1 s permanent), offset optimiser (once per
                                cycle, -4/0/+4 s on PI), bus extensions and recalls
                     Region   - common cycle; cycle optimiser every 5 min (2.5 min rising),
                                4/8/16 s steps, critical node at or below 90% DoS
                     ActuatedNode - isolated gap-out baseline
scoot/network.py     corridor generator; SCOOT detectors (up_*) at the upstream end of each
                     link and stop-line loops (loop_*) for the baseline / model checks
scoot/runner.py      Scenario, run(), baselines ("fixed", "actuated", "scoot"), metrics, logs
scoot/scenarios.py   Foundation (1 node) and Advanced (4-node region)
```

## Labs

| Script | What it does |
|---|---|
| `foundation/01_lpu_profiles_queue.py` | LPUs, dispersed arrivals and SCOOT's model queue vs SUMO's real queue |
| `foundation/02_validate_model.py` | measures LPU/veh, cruise speed, SATO, start and end lag |
| `foundation/03_fixed_vs_scoot.py` | fixed vs actuated vs SCOOT at one junction |
| `advanced/01_corridor_scoot.py` | all optimisers on a 4-junction region + decision timeline |
| `advanced/02_ablation_study.py` | one mechanism off at a time; one vs two regions |
| `mastery/01_cv_lpu.py` | LPUs from connected vehicles: accuracy and control vs penetration |
| `mastery/02_rl_split_optimiser.py` | Q-learning makes the split optimiser's -4/0/+4 choice |
| `mastery/03_maxpressure.py` | pure max-pressure and a spill-back-aware SCOOT |
| `mastery/04_loop_faults_astrid.py` | stuck-on/off detectors; historic substitution |
| `mastery/05_emissions_stop_weight.py` | stop weight K vs delay, stops and CO2 |
| `mastery/06_glosa_prediction.py` | predicting end of green from the SCOOT schedule |

All scripts take `--gui --seed --end --out`. `python run_all.py` runs everything;
`python tools/export_site_results.py` refreshes the website's figures and tables.

## Example

```python
from scoot.runner import run, mode_config
from scoot.scenarios import advanced

def always_keep(node, k, dos_by_option):
    return 0.0                      # replace with your split rule

res = run(advanced(), mode_config("scoot", split_chooser=always_keep), "mine", "results/mine")
print(res["avg_delay"], res["stops_per_veh"])
```

SCOOT is a product of TRL Software. This is an independent educational
re-implementation of published principles; LPU coding and parameters are
illustrative.
