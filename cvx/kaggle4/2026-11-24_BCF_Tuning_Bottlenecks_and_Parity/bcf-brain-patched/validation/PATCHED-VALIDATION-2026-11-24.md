# Validation of bcf-brain-patched (2026-11-24)

Every line below was produced by a command run on 2026-11-24 against this copy, after the patches of `../patches/bcf-brain-patches.diff` were applied and the helper was reassembled with `python assemble.py`.

| Step | Command | Result |
| --- | --- | --- |
| Patch | `python ../tools/apply_brain_patches.py <copy>` | 2 files patched; every replacement matched exactly once; both files compiled before they were written |
| Assemble | `python assemble.py` | `src/bcf.py` assembled: 60,655 bytes, 1,424 lines |
| Build | `python build.py` | 6 bundles and 6 zips; helper 60,655 B in each skill-carrying bundle; prompts unchanged (solver 5,585 and 6,524 characters on the 31B track, 2,799 and 3,141 on E4B) |
| Helper tests | `python -m unittest tests.test_bcf` | `Ran 37 tests in 90.972s`, `OK (skipped=1)` |
| Official compiler | `python tools/run_validator.py --python <validation environment>` | `OVERALL: 6 bundle(s), 0 failed`; the advisory warning (solver instruction longer than 2.6 KB) is on the same four bundles as before |
| Negative controls | same command | `OVERALL: bundles pass; controls 15 rejected, 0 not rejected` |
| Gold replay | `python tools/replay_gold.py <store> <tasks.jsonl> src/bcf.py <work>` | `TOTAL 129: bcf applied 129, identical to git apply 129, git apply itself failed on 0, files needing wider context 4` (1,094 s); per-task file `replay_gold_patched.json` |
| Behaviour probe | `python ../tools/brain_probe.py src/bcf.py` | `SUMMARY: PASS 15, GAP 0, INFO 1` (`brain_probe_after.txt`); the original helper gave `PASS 10, GAP 5` (`brain_probe_before.txt`) |
| Routing | `python ../tools/route_eval.py <tasks.jsonl> <rca_merged.jsonl> src/bcf.py` | category 97 of 129, domain 82 of 129 (91 within the reviewed pair), route 52 of 129; the original helper: 55, 49, 57, 42 |

## What the first patch attempt taught

The first version of the test-command fix also passed `-s` and `PYTHONNOUSERSITE=1`, as the scorer does. Three helper tests failed with `No module named pytest`: on a development machine pytest can live in the user site-packages, which those two flags hide. The scorer's image has no user site, so the flags change nothing there. They were removed; the four flags that can change a verdict stayed.

## What is still not validated

| Item | Why it matters | How to close it |
| --- | --- | --- |
| A run with the Gemma 4 model | The routing change alters the CLASS, ROUTE and HINT lines of the baton; whether the model follows them better is unmeasured | Panel runs of the original and the patched bundle, paired |
| Mean seconds per task | The 12-hour risk | One local panel with the projection of `04_Local_Scoring_and_Interpretation_Guide.md` |
| The skill path on the scorer | The first skill-carrying submission answers it | Submit; read the result size |
