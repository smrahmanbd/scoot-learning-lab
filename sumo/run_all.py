"""Run every Foundation, Advanced and Mastery script in order (~15 minutes).

    python run_all.py              # everything
    python run_all.py foundation   # one level
"""
import os
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
LEVELS = {
    "foundation": ["01_lpu_profiles_queue.py", "02_validate_model.py", "03_fixed_vs_scoot.py"],
    "advanced": ["01_corridor_scoot.py", "02_ablation_study.py"],
    "mastery": ["01_cv_lpu.py", "02_rl_split_optimiser.py", "03_maxpressure.py",
                "04_loop_faults_astrid.py", "05_emissions_stop_weight.py", "06_glosa_prediction.py"],
}

if __name__ == "__main__":
    for level in sys.argv[1:] or list(LEVELS):
        for script in LEVELS[level]:
            t = time.time()
            print(f"\n=== {level}/{script} ===", flush=True)
            subprocess.run([sys.executable, os.path.join(HERE, level, script)], check=True)
            print(f"--- done in {time.time() - t:.0f}s", flush=True)
