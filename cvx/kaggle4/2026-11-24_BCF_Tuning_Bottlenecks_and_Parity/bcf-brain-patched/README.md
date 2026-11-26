# bcf-brain-patched: the BCF brain with the audited fixes of 2026-11-24

This is a copy of `2026-11-23_BCF_Brain_and_Dataset_RCA/bcf-brain` with six fixes to the helper, found by executing the helper against the issues teams report on the competition board. **The original package was not modified.** The exact changes are in `../patches/bcf-brain-patches.diff`; `../tools/apply_brain_patches.py` reproduces them from a fresh copy.

Design and justification: `../2026-11-23_BCF_Brain_and_Dataset_RCA/02_BCF_Brain_Design_and_Justification.md`. Audit that found the defects: `../05_Board_Issues_Graceful_Handling_Audit.md` (this package). Test evidence: `validation/PATCHED-VALIDATION-2026-11-24.md`.

## What changed

| Fix | Where | Why | Evidence |
| --- | --- | --- | --- |
| Protected paths follow the harness rule | `parts/_bcf_head.py`, `PROTECTED_RE` | Any `.py` under `tests/`, `test/` or `testing/` is discarded by the scorer; the helper allowed nested helpers such as `tests/helpers/util.py` | Probe: 3 of 15 paths mismatched before, 0 after |
| `finalize` never deletes what the helper wrote | `parts/_bcf_tail.py`, `cmd_finalize` | A new root-level module created through `apply` was removed and the message said "NO SOURCE CHANGES"; legitimate modules named `temp_*`, `check_*`, `try_*` were removed as "scratch" | Probe: both cases now kept; scratch at the root and under `tmp/`, `scratch/`, `repro/` is still removed (test `T05Hygiene`) |
| The test command uses the scorer's flags | `parts/_bcf_head.py`, `cmd_test`, `_run` | `-p no:anyio`, `-o timeout=0`, `-o python_classes="Test* *Test"`, `PYTHONSAFEPATH=1`: the flags that change a verdict on the scorer | Source: `harness/verification.py` |
| The docstring names both interpreters | `parts/_bcf_head.py` | The Docker sandbox is Python 3.13, the harness and the staff notebook 3.12.13; the text said "pinned Python 3.12" | `docker/Dockerfile.sandbox`; notebook metadata |
| Dead keyword stems repaired | `DOMAINS` in `parts/_bcf_head.py` | `pickl`, `hash`, `diagnos`, `qualname`, `forward ref` were followed by a word boundary, so `picklable`, `hashable`, `__qualname__`, `forward references` never matched | `tools/route_eval.py` |
| Routing: most distinct keyword matches win; generic words leave VAL and SER; C1 before C4 | `DOMAINS`, `KIND_RULES`, `domain_of` | First-match-wins let `field`, `default`, `response` decide almost every FastAPI statement; a bug fix that mentioned a warning was routed as a behaviour change | `tools/route_eval.py`: category 55 to 97 of 129, domain 49 to 82, route 42 to 52 |

## Validation of this copy (2026-11-24)

| Check | Original package | This copy |
| --- | --- | --- |
| Helper tests | 36 pass, 1 optional skipped | 36 pass, 1 optional skipped (`Ran 37 tests ... OK (skipped=1)`) |
| Official compiler on the six bundles | 6 of 6 | 6 of 6 |
| Negative controls rejected | 15 of 15 | 15 of 15 |
| The 129 published fixes replayed through the editor | 129 of 129 identical to `git apply` | 129 of 129 identical to `git apply` (1,094 s) |
| Behaviour probe (`tools/brain_probe.py`) | 10 pass, 5 gaps | 15 pass, 0 gaps |

Not validated, as before: any run with the Gemma 4 model, the mean seconds per task, and the skill path on the scorer.

## Layout, bundles and workflow

Identical to the original: `assemble.py`, `build.py`, `parts/`, `src/`, `dist/` (six bundles and zips, rebuilt from this copy), `tests/`, `tools/`. The original validation logs are kept in `validation/pre-patch-logs/`.

```bash
python assemble.py                       # after editing parts/
python build.py                          # bundles and zips in dist/
python -m unittest tests.test_bcf        # about 90 seconds
python tools/run_validator.py            # official compiler; needs tools/setup_validate_venv.py once
```
