# SCOOT Learning Lab

Learn **SCOOT, the Split Cycle Offset Optimisation Technique**, in three levels, with
interactive browser simulators, quizzes, a mind map and a runnable SCOOT-style controller
for **Eclipse SUMO**.

**Website:** https://smrahmanbd.github.io/scoot-learning-lab/

| Level | What you learn | Browser simulators | SUMO labs |
|---|---|---|---|
| **1 Foundation** | regions, nodes, links, stages · upstream detectors and LPUs · cyclic flow profiles · platoon dispersion · queue model · degree of saturation · validation | live junction (fixed / actuated / SCOOT with its model queue), LPU calculator, dispersion, one-cycle queue model, validation exercise, controller race, Webster | `01_lpu_profiles_queue`, `02_validate_model`, `03_fixed_vs_scoot` |
| **2 Advanced** | split optimiser (temporary / permanent), offset optimiser and PI, cycle optimiser and critical node, double cycling, congestion importance, gating, bus extensions and recalls, ASTRID, INGRID, versions | split explorer, offset PI curve, cycle optimiser through a peak, gating, priority planner | `01_corridor_scoot`, `02_ablation_study` |
| **3 Mastery** | research directions with implementations | CV sampling, split agent you train in the browser, pressure-aware split rule, detector faults, stop weight | `01_cv_lpu`, `02_rl_split_optimiser`, `03_maxpressure`, `04_loop_faults_astrid`, `05_emissions_stop_weight`, `06_glosa_prediction` |

Plus a **42-question quiz bank** with explanations and an explorable **mind map**.

## Study guides and slides

Beginner-friendly study guides (plain-language explanations, worked hand calculations, a memory route, mind maps, an 18-question self-quiz with answers, a cheat sheet and a revision plan) and a matching slide deck with speaker notes for each level:

| Level | Study guide | Slides |
|---|---|---|
| Foundation | [SCOOT_Foundation_Study_Guide.pdf](docs/materials/SCOOT_Foundation_Study_Guide.pdf) | [SCOOT_Foundation_Presentation.pptx](docs/materials/SCOOT_Foundation_Presentation.pptx) |
| Advanced | [SCOOT_Advanced_Study_Guide.pdf](docs/materials/SCOOT_Advanced_Study_Guide.pdf) | [SCOOT_Advanced_Presentation.pptx](docs/materials/SCOOT_Advanced_Presentation.pptx) |
| Mastery | [SCOOT_Mastery_Study_Guide.pdf](docs/materials/SCOOT_Mastery_Study_Guide.pdf) | [SCOOT_Mastery_Presentation.pptx](docs/materials/SCOOT_Mastery_Presentation.pptx) |

## Website

`docs/` is a static site published with GitHub Pages (Settings → Pages → `main` / `/docs`).
To view it locally:

```bash
cd docs && python -m http.server 8000     # open http://localhost:8000
```

## SUMO code

```bash
cd sumo
python -m pip install -r requirements.txt   # installs SUMO itself via eclipse-sumo
python foundation/03_fixed_vs_scoot.py --gui
python run_all.py                           # all 11 labs, ~15 minutes
python tools/export_site_results.py         # refresh website figures and tables
python -m pytest tests -q
```

See [`sumo/README.md`](sumo/README.md) for the controller design and research hooks.

### Results from the included run (seed 1)

Four junctions, 300 m apart, one region; 90 minutes with an eastbound then a westbound peak;
buses every 4 minutes. Delay includes time spent waiting to enter the network.

| Controller | Mean delay (s/veh) | Stops/veh | Bus delay (s) |
|---|---|---|---|
| Fixed time (80 s, TRANSYT-style offsets) | 87.0 | 1.77 | 122.2 |
| Isolated vehicle actuation | 29.1 | 1.15 | 38.0 |
| **SCOOT-style** | **30.4** | **1.10** | **22.9** |

At a single junction: SCOOT 12.8 s, actuated 14.5 s, fixed 19.0 s.

## Disclaimer

SCOOT is a product of TRL Software. This project is an independent, educational
re-implementation of principles published in the literature (TRRL LR1014, DfT TAL 7/99 and
others). The LPU coding and all numeric settings are illustrative and are not TRL's.

MIT licensed.
