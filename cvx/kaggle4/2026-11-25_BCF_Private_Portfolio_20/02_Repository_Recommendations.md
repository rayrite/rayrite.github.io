# Repository recommendations: where to get tasks, and where to mine new ones

**Prepared:** 2026-11-25. **Scope:** which repositories to use for testing the BCF brain, in three tiers: repositories that already carry validated post-release tasks, repositories that carry validated post-cutoff tasks from before the model's release, and repositories that are good targets for mining new tasks. This document answers the added request "include suitable repos from these repositories" for the problem sources surveyed in Document 03.

Figures come from four places: the task rows of the sets themselves (`data/`), the Hugging Face API and its statistics endpoints (queried 2026-11-25), a GitHub API survey of 38 candidate repositories collected 2026-11-25T17:32 UTC (`data/github_repo_survey_38.tsv`), and the baseline result files of FreshSWE-Py. Assessments that are mine, not measurements, are marked as such.

---

## 0. Summary

| Purpose | Recommended repositories | Why |
| --- | --- | --- |
| Test today with validated post-release tasks | `pypa/packaging`, `pallets/click`, `more-itertools/more-itertools`; swaps `pytest-dev/pluggy`, `python-humanize/humanize`, `tox-dev/platformdirs`, `PyCQA/isort` | 14 to 90 validated tasks each in FreshSWE-Py, all created after 2026-04-02, zero runtime dependencies, unrelated to the public four |
| Add breadth with validated post-cutoff tasks | `tobymao/sqlglot`, `Delgan/loguru`, `omni-us/jsonargparse`, `PyCQA/isort`, `tox-dev/tox`, `getmoto/moto`, `beeware/briefcase` | Several execution-validated, issue-linked tasks each in `nebius/SWE-rebench-leaderboard`; convertible to the competition layout with the OOD builder |
| Mine new tasks this month | `pypa/packaging`, `wntrblm/nox`, `fsspec/filesystem_spec`, `hgrecco/pint`, `pallets/click`, `PyCQA/isort`, `BrianPugh/cyclopts`, `pypa/build` | The most fix-titled merged pull requests since 2026-04-01 among clean, pure-Python repositories, with at most four runtime dependencies and no compiled one |
| Avoid as sources of fresh problems | SWE-bench Verified's 12 repositories before 2025, SWE-Gym's 11 repositories, SWE-bench Lite | Their tasks predate the model's training cutoff and are known to be memorised by large models |

---

## 1. How suitability was judged

| Criterion | What counts as suitable | Where it was checked |
| --- | --- | --- |
| Validated tasks exist | Tests fail at the base commit and pass with the reference patch, under execution | The set's own validation records and paper |
| Freshness | Task created after the model's release (best) or after its training cutoff of January 2025 (acceptable) | `created_at` of each task row |
| Purity | No compiled runtime dependency, so the offline environment is small and reproducible | `pyproject.toml` through the GitHub API (38 repositories); otherwise an assessment |
| Distance from the public four | Different owner and different subject | Assessment |
| Test suite | pytest-style tests that run in a few seconds | Median gold test time in FreshSWE-Py; test directory layout in the survey |
| Permitted licence | MIT, BSD or Apache-2.0 | GitHub API licence field; the set's README |
| Activity | Merged pull requests since 2026-04-01 | GitHub search API |
| Statement quality | A closed issue, not a generated or bare text | `statement_source` in FreshSWE-Py |
| Evidence of difficulty | Solved by at least one of two independent baseline agents | FreshSWE-Py `baselines/` |

---

## 2. Tier 1: the 33 repositories of FreshSWE-Py

Every task in this set was created after 2026-04-02 and passed the scorer's own gate. "Solved by both", "one agent" and "neither" refer to the author's tuned agent (two runs) and the organizers' reference agent. The last column is this run's assessment.

| Repository | Tasks | Issue statements | PR descriptions | Commit messages | Created from | Created to | Solved by both | One agent | Neither | Median fix | Median gold test | Relation to the public four | Note |
| --- | ---: | ---: | ---: | ---: | --- | --- | ---: | ---: | ---: | --- | ---: | --- | --- |
| `pypa/packaging` | 90 | 14 | 75 | 1 | 2026-04-05 | 2026-10-13 | 50 | 6 | 34 | 12 lines | 0.7 s | unrelated | anchor of P20; version, specifier, marker and tag parsing |
| `pydantic/pydantic-settings` | 68 | 30 | 38 | 0 | 2026-04-02 | 2026-10-16 | 20 | 7 | 41 | 22 lines | 1.3 s | unrelated | needs pydantic (compiled core) |
| `scrapy/w3lib` | 57 | 6 | 51 | 0 | 2026-06-15 | 2026-10-18 | 25 | 9 | 23 | 12 lines | 2.1 s | unrelated | pure Python; URL and encoding helpers |
| `tox-dev/platformdirs` | 54 | 2 | 52 | 0 | 2026-04-06 | 2026-10-17 | 27 | 8 | 19 | 20 lines | 0.8 s | unrelated | clean swap: many short fix statements |
| `PyCQA/isort` | 46 | 10 | 4 | 32 | 2026-05-12 | 2026-10-18 | 9 | 12 | 25 | 12 lines | 1.0 s | unrelated | clean swap: mostly commit-message statements (terse) |
| `simonw/sqlite-utils` | 39 | 1 | 11 | 27 | 2026-06-21 | 2026-09-22 | 15 | 1 | 23 | 18 lines | 0.8 s | unrelated | CLI tool; mostly commit-message statements |
| `pallets/click` | 38 | 19 | 17 | 2 | 2026-04-08 | 2026-10-04 | 6 | 2 | 30 | 29 lines | 0.6 s | unrelated | anchor of P20; command-line parsing |
| `strawberry-graphql/strawberry` | 31 | 7 | 24 | 0 | 2026-04-06 | 2026-10-17 | 7 | 8 | 16 | 40 lines | 1.6 s | web framework | web framework; two tasks touch async code |
| `psf/black` | 28 | 16 | 12 | 0 | 2026-04-14 | 2026-10-10 | 12 | 2 | 14 | 17 lines | 4.2 s | unrelated | compiled wheels with a pure-Python fallback; test cases stored as data files |
| `litestar-org/litestar` | 26 | 14 | 11 | 1 | 2026-04-02 | 2026-08-24 | 11 | 4 | 11 | 7 lines | 2.0 s | web framework | web framework |
| `more-itertools/more-itertools` | 21 | 4 | 17 | 0 | 2026-05-05 | 2026-09-29 | 3 | 13 | 5 | 13 lines | 3.8 s | unrelated | anchor of P20; iterator recipes |
| `python-poetry/poetry-core` | 20 | 0 | 20 | 0 | 2026-05-23 | 2026-09-19 | 7 | 2 | 11 | 15 lines | 1.4 s | unrelated | packaging back end; clean |
| `pallets/werkzeug` | 17 | 8 | 7 | 2 | 2026-04-18 | 2026-10-13 | 6 | 1 | 10 | 29 lines | 0.4 s | Pallets web stack | Pallets web toolkit (the WSGI layer under Flask) |
| `urllib3/urllib3` | 16 | 6 | 10 | 0 | 2026-04-04 | 2026-10-04 | 7 | 2 | 7 | 10 lines | 2.0 s | HTTP stack of requests | the HTTP engine under requests; 16 tasks |
| `pytest-dev/pluggy` | 14 | 8 | 6 | 0 | 2026-05-27 | 2026-10-18 | 6 | 1 | 7 | 32 lines | 0.3 s | unrelated | clean swap: hook and plugin registry |
| `jd/tenacity` | 12 | 4 | 7 | 1 | 2026-05-22 | 2026-10-07 | 8 | 1 | 3 | 12 lines | 2.3 s | unrelated | clean swap; three tasks touch async code |
| `python-humanize/humanize` | 11 | 1 | 10 | 0 | 2026-05-22 | 2026-09-16 | 7 | 3 | 1 | 7 lines | 0.4 s | unrelated | clean swap: number and date formatting |
| `python-attrs/cattrs` | 11 | 0 | 1 | 10 | 2026-06-03 | 2026-10-02 | 7 | 1 | 3 | 20 lines | 6.1 s | unrelated | clean swap; slower test file |
| `encode/uvicorn` | 8 | 1 | 7 | 0 | 2026-04-19 | 2026-10-11 | 5 | 0 | 3 | 7 lines | 0.7 s | same organisation as a public repository | ASGI server; same organisation as httpx |
| `fastapi/typer` | 8 | 2 | 6 | 0 | 2026-04-26 | 2026-10-06 | 1 | 1 | 6 | 8 lines | 1.2 s | same organisation as a public repository | same organisation as fastapi; command-line interface on top of click |
| `Delgan/loguru` | 8 | 4 | 3 | 1 | 2026-05-23 | 2026-10-17 | 4 | 1 | 3 | 7 lines | 31.5 s | unrelated | clean; some test files take about 30 s |
| `Python-Markdown/markdown` | 5 | 1 | 0 | 4 | 2026-08-24 | 2026-10-08 | 1 | 1 | 3 | 9 lines | 0.3 s | unrelated | pure Python; five tasks |
| `marshmallow-code/marshmallow` | 5 | 1 | 3 | 1 | 2026-04-02 | 2026-08-21 | 3 | 0 | 2 | 4 lines | 0.5 s | unrelated | pure Python; five tasks |
| `executablebooks/markdown-it-py` | 5 | 2 | 3 | 0 | 2026-05-06 | 2026-09-17 | 3 | 0 | 2 | 57 lines | 0.3 s | unrelated | pure Python; one file touched per task |
| `scrapy/parsel` | 4 | 2 | 2 | 0 | 2026-08-03 | 2026-10-16 | 1 | 0 | 3 | 33 lines | 0.3 s | unrelated | pure Python; XPath helpers; four tasks |
| `fastapi/sqlmodel` | 4 | 0 | 4 | 0 | 2026-08-28 | 2026-09-22 | 1 | 0 | 3 | 17 lines | 0.5 s | same organisation as a public repository | same organisation as fastapi; needs pydantic and SQLAlchemy |
| `Kludex/python-multipart` | 3 | 0 | 3 | 0 | 2026-04-05 | 2026-04-10 | 2 | 1 | 0 | 3 lines | 1.8 s | unrelated | three tasks; a 20 MB JUnit report breaks the harness read-back |
| `python-attrs/attrs` | 3 | 1 | 2 | 0 | 2026-04-16 | 2026-08-02 | 0 | 1 | 2 | 26 lines | 1.2 s | unrelated | clean; only three tasks |
| `hynek/structlog` | 3 | 0 | 3 | 0 | 2026-05-02 | 2026-05-10 | 2 | 0 | 1 | 5 lines | 0.6 s | unrelated | clean; only three tasks |
| `python-jsonschema/jsonschema` | 3 | 0 | 0 | 3 | 2026-09-07 | 2026-09-07 | 2 | 0 | 1 | 57 lines | 0.4 s | unrelated | three tasks; compiled dependency in its wheel set |
| `Textualize/textual` | 2 | 1 | 1 | 0 | 2026-05-17 | 2026-06-24 | 0 | 1 | 1 | 121 lines | 0.6 s | same organisation as a public repository | same organisation as rich; two tasks |
| `pallets/flask` | 2 | 2 | 0 | 0 | 2026-08-11 | 2026-08-11 | 0 | 0 | 2 | 13 lines | 0.8 s | Pallets web stack | Pallets web framework; two tasks |
| `tqdm/tqdm` | 1 | 0 | 1 | 0 | 2026-07-27 | 2026-07-27 | 1 | 0 | 0 | 5 lines | 0.3 s | unrelated | one task |

How to read it:

- **Unrelated and clean, with depth.** `packaging`, `click`, `more-itertools`, `pluggy`, `humanize`, `platformdirs`, `isort`, `poetry-core`, `cattrs`, `tenacity`, `attrs`, `structlog`. The GitHub survey confirms zero runtime dependencies for `packaging`, `click`, `more-itertools`, `pluggy` and `attrs`, one for `isort` and three for `cattrs`; for the others the claim is an assessment.
- **Unrelated, with a caveat.** `black` publishes compiled wheels but runs from its pure-Python source; the set's paper notes that its test cases live in `.py` data files, which the harness passes to pytest as targets. `python-jsonschema/jsonschema` depends on a compiled package. `loguru`'s test files take about 30 seconds. `python-multipart` writes a 20 MB JUnit report for some fixes, which the harness cannot read back (the set's own audit).
- **Web frameworks.** `litestar` and `strawberry` are closer in subject to FastAPI than the others; useful as a "near transfer" group, not as evidence of far transfer.
- **Same organisation or same stack as a public repository.** `fastapi/typer`, `fastapi/sqlmodel`, `encode/uvicorn`, `Textualize/textual`, `urllib3/urllib3`, `pallets/werkzeug`, `pallets/flask`. They are valid tasks, but a result on them says less about transfer to unknown repositories.
- **`pydantic-settings`** has the most issue statements after `packaging` (30) and is a natural "near transfer" choice for the FastAPI-shaped parts of the helper (type introspection, validation), at the price of a compiled dependency.

---

## 3. Tier 2: repositories with validated post-cutoff tasks from before the release

The SWE-rebench family is the largest public pool of execution-validated, issue-linked Python tasks. `nebius/SWE-rebench-leaderboard` is the curated part: 860 tasks from 413 repositories, created 2025-01-03 to 2026-05-12, all after the training cutoff and 64 of them after April 2026. The OOD-B and OOD-C sets are two ready-made conversions of its rows into the competition layout (82 and 186 tasks; 58 of the OOD-C tasks are gradable).

| Dataset | Rows | Python rows | Python repositories | First created | Last created | Rows created in 2025 or later | Rows created in April 2026 or later | Access | Note |
| --- | ---: | ---: | ---: | --- | --- | --- | ---: | ---: | --- |
| SWE-Gym/SWE-Gym | 2,438 | 2,438 | 11 | 2018-09-13 | 2024-05-28 | 0 | 0 | open | pandas 737, MONAI 374, moto 343, mypy 257, dvc 225, modin 107, dask 145, pydantic 83, conan 75, hydra 66, bokeh 26 |
| ScaleAI/SWE-bench_Pro | 731 (v1; 642 and 51 are subsets) | 266 | 3 | no date column | no date column | NA | NA | open | ansible 96, openlibrary 91, qutebrowser 79 |
| R2E-Gym/R2E-Gym-V1 | 8,101 | 8,101 | 13 | no date column | no date column | NA | NA | open | synthetic tasks with generated tests |
| SWE-bench/SWE-bench_Lite | 323 | 323 | 12 | 2012-09-20 | 2023-09-13 | 0 | 0 | open | contains psf/requests (6 tasks) |
| SWE-bench/SWE-bench_Multimodal | 580 | 0 | 0 | 2015-11-16 | 2024-06-04 | 0 | 0 | open | JavaScript and TypeScript only |
| nebius/SWE-rebench | 27,878 | 27,878 | 3,468 | 2014-04-30 | 2025-04-30 | 708 | 0 | open | the `filtered` split is an exact subset of `test` |
| nebius/SWE-rebench-V2 | 32,079 | 7,243 | 691 | 2015-01-23 | 2025-07-22 | 969 | 0 | open | 20 languages; Python isolated through the `language` column |
| ibragim-bad/SWE-rebench-V2.1 | 21,272 | 11,925 | 2,454 | 2014-06-23 | 2025-07-22 | 629 | 0 | open | adds `quality_flags` and Harbor task directories |
| nebius/SWE-rebench-leaderboard | 860 | 860 | 413 | 2025-01-03 | 2026-05-12 | 860 | 64 | open | the only part with tasks created after the release |
| SWE-bench-Live | 1,319 | 1,319 | 93 | issues since 2024 | NA | NA | NA | gated | about 50 new Python tasks a month; per-repository counts need a free login |
| ScaleAI/SWE-bench_Pro_v2 | 642 | subset of v1 | 11 (3 Python) | NA | NA | NA | NA | gated | 480 of the 731 v1 tasks repaired or retired |
| ByteDance-Seed/Multi-SWE-RL | 4,723 | 0 | 0 | NA | NA | NA | NA | gated | seven languages, none of them Python |
| THUDM/SWE-Dev | 38,000 | 38,000 | 4,413 | NA | NA | NA | NA | gated | training instances with generated tests |
| amazon-science/SWE-PolyBench | 2,110 | 113 in the verified split | 21 | NA | NA | NA | NA | gated | pre-2025; the authors warn of patch leakage |
| openai/SWE-Lancer | 198 verified of 237 | NA | NA | NA | NA | NA | NA | gated | freelance tasks of one application, mostly JavaScript |

The repositories of the leaderboard set with three or more tasks (the first 45 of 84; the rest are in `data/leaderboard_repos_ge3.tsv`):

| Repository | Tasks | Python of the task images | Median statement | Median files per fix | First created | Last created |
| --- | ---: | --- | ---: | ---: | --- | --- |
| `tobymao/sqlglot` | 41 | 3.11,3.12,3.13,3.9 | 903 characters | 2 | 2025-01-05 | 2026-04-09 |
| `sympy/sympy` | 28 | 3.11,3.12,3.9 | 528 characters | 2.0 | 2025-01-08 | 2025-12-18 |
| `astropy/astropy` | 17 | 3.11,3.12,3.13 | 1815 characters | 1 | 2025-01-16 | 2026-03-16 |
| `BerriAI/litellm` | 16 | 3.12 | 1797 characters | 2.0 | 2025-08-21 | 2025-11-24 |
| `pandas-dev/pandas` | 13 | 3.10,3.11,3.12,3.13 | 3515 characters | 2 | 2025-01-10 | 2026-03-24 |
| `zarr-developers/zarr-python` | 12 | 3.11 | 1996 characters | 1.0 | 2025-01-03 | 2025-04-24 |
| `schemathesis/schemathesis` | 10 | 3.12,3.13 | 3370 characters | 2.5 | 2025-08-01 | 2026-05-12 |
| `probabl-ai/skore` | 10 | 3.11,3.9 | 761 characters | 1.0 | 2025-01-08 | 2025-02-15 |
| `getmoto/moto` | 9 | 3.12,3.13 | 1435 characters | 2 | 2025-08-23 | 2026-03-23 |
| `deepset-ai/haystack` | 9 | 3.11,3.12,3.9 | 1610 characters | 2 | 2025-02-19 | 2026-02-10 |
| `lincc-frameworks/nested-pandas` | 8 | 3.11,3.12,3.9 | 1968 characters | 1.0 | 2025-01-27 | 2026-01-05 |
| `tox-dev/tox` | 7 | 3.11,3.12,3.13 | 1649 characters | 2 | 2026-01-08 | 2026-05-01 |
| `scipp/plopp` | 7 | 3.10,3.11,3.12 | 696 characters | 1 | 2025-03-10 | 2026-01-22 |
| `pgmpy/pgmpy` | 7 | 3.11,3.13,3.9 | 1733 characters | 1 | 2025-01-26 | 2026-03-22 |
| `omni-us/jsonargparse` | 7 | 3.12,3.9 | 1817 characters | 3 | 2025-02-03 | 2026-02-02 |
| `koxudaxi/datamodel-code-generator` | 7 | 3.11,3.12,3.13,3.9 | 2446 characters | 1 | 2025-04-23 | 2026-04-04 |
| `conan-io/conan` | 7 | 3.11,3.12,3.13,3.6,3.9 | 1441 characters | 2 | 2025-03-24 | 2026-03-13 |
| `dask/dask` | 6 | 3.10 | 2273 characters | 1.0 | 2025-01-24 | 2025-10-30 |
| `beeware/briefcase` | 6 | 3.12,3.9 | 1096 characters | 2.5 | 2025-01-17 | 2026-01-27 |
| `agronholm/sqlacodegen` | 6 | 3.10,3.12,3.9 | 1745 characters | 2.0 | 2025-02-16 | 2025-08-03 |
| `stfc/PSyclone` | 5 | 3.12,3.9 | 279 characters | 1 | 2025-05-08 | 2025-08-14 |
| `pydata/xarray` | 5 | 3.10,3.11,3.12 | 4227 characters | 2 | 2025-01-22 | 2025-10-17 |
| `ethereum/web3.py` | 5 | 3.12,3.13,3.9 | 1955 characters | 2 | 2025-01-18 | 2026-01-08 |
| `SpikeInterface/spikeinterface` | 5 | 3.11,3.9 | 1295 characters | 2 | 2025-02-05 | 2025-05-18 |
| `raullenchai/Rapid-MLX` | 4 | 3.13 | 1287 characters | 0.0 | 2026-05-05 | 2026-05-09 |
| `python-wheel-build/fromager` | 4 | 3.11,3.13 | 1036 characters | 1.0 | 2025-06-03 | 2026-05-07 |
| `python-scim/scim2-models` | 4 | 3.12,3.13,3.9 | 788 characters | 3.0 | 2025-03-07 | 2026-04-03 |
| `pypa/virtualenv` | 4 | 3.12,3.9 | 3317 characters | 2.5 | 2025-01-11 | 2026-01-10 |
| `openai/openai-agents-python` | 4 | 3.12 | 1296 characters | 2.5 | 2025-09-22 | 2025-12-03 |
| `marimo-team/marimo` | 4 | 3.12 | 2379 characters | 2.0 | 2025-10-01 | 2026-02-20 |
| `macbre/sql-metadata` | 4 | 3.12,3.13,3.9 | 605 characters | 1.0 | 2025-05-04 | 2026-05-07 |
| `keras-team/keras` | 4 | 3.11,3.13 | 2026 characters | 0.0 | 2026-02-09 | 2026-04-06 |
| `jlowin/fastmcp` | 4 | 3.11,3.12 | 2038 characters | 4.0 | 2025-07-02 | 2026-02-19 |
| `idaholab/MontePy` | 4 | 3.12,3.13,3.9 | 3017 characters | 3.0 | 2025-03-29 | 2026-03-20 |
| `google/flax` | 4 | 3.10,3.12 | 905 characters | 1.5 | 2025-02-26 | 2026-01-06 |
| `basicmachines-co/basic-memory` | 4 | 3.12 | 1620 characters | 2.0 | 2025-09-11 | 2025-12-29 |
| `astropy/astroquery` | 4 | 3.11 | 580 characters | 2.0 | 2025-01-07 | 2025-03-26 |
| `agronholm/anyio` | 4 | 3.11,3.12,3.13 | 1673 characters | 1.0 | 2025-06-29 | 2026-05-05 |
| `Ultraplot/UltraPlot` | 4 | 3.11,3.12,3.13 | 1280 characters | 1.0 | 2025-08-23 | 2026-04-16 |
| `PyPSA/PyPSA` | 4 | 3.11,3.12,3.13 | 1787 characters | 1.0 | 2025-10-16 | 2026-04-13 |
| `GenericMappingTools/pygmt` | 4 | 3.12,3.13 | 2038 characters | 1.0 | 2025-09-19 | 2026-03-21 |
| `Delgan/loguru` | 4 | 3.12,3.13,3.9 | 740 characters | 1.5 | 2025-02-13 | 2026-03-25 |
| `zwicker-group/py-pde` | 3 | 3.12,3.9 | 412 characters | 3 | 2025-03-21 | 2025-12-01 |
| `zarr-developers/VirtualiZarr` | 3 | 3.10,3.11,3.13 | 1464 characters | 1 | 2025-01-28 | 2026-04-24 |
| `yt-project/unyt` | 3 | 3.12,3.9 | 1694 characters | 1 | 2025-02-06 | 2026-01-29 |

39 more repositories with three tasks each are listed in `data/leaderboard_repos_ge3.tsv`.

Which of these to take, in this run's assessment (the dependency judgement is an estimate):

- **Pure Python and unrelated to the public four:** `tobymao/sqlglot` (41 tasks, but its test files are slow: one search took 13.9 s in the dry run), `Delgan/loguru` (4), `omni-us/jsonargparse` (7), `tox-dev/tox` (7, all created in 2026), `getmoto/moto` (9), `beeware/briefcase` (6), `pypa/virtualenv` (4), `macbre/sql-metadata` (4), `python-wheel-build/fromager` (4), `agronholm/sqlacodegen` (6), `zwicker-group/py-pde` (3, terse statements: median 412 characters).
- **Compiled dependencies, large code bases:** `sympy`, `astropy`, `pandas`, `dask`, `xarray`, `zarr-python`, `keras`, `flax`. Good for a stress test of the localizer on large repositories; harder to package offline.
- **Async-heavy or different in kind:** `agronholm/anyio`, `ethereum/web3.py`, `jlowin/fastmcp`, `openai/openai-agents-python`; the scored set has no asynchronous code.

A caution on dates: 796 of the 860 leaderboard tasks were created before April 2026, so they are after the training cutoff but before the release. A contamination audit in this competition found no robust sign that Gemma 4 memorised the benchmark's fixes, and it also showed that the merge date hides exposure, because nine "post-cutoff" FastAPI pull requests had been open for up to 2.5 years before the cutoff ([writeup](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/remembered-or-reasoned-a-contamination-audit-of-t), 2026-10-07). Record the date the pull request was opened as well as the date it was merged.

---

## 4. Tier 3: repositories to mine for new tasks

The survey collected packaging facts, test layout, the latest release and merged pull requests since 2026-04-01 for 38 repositories through the GitHub API. "Fix-titled" counts pull requests whose title contains "fix"; "bug" and "regression" are separate counts.

| Repository | Stars | Licence | Last push | Python requirement | Build backend | Runtime dependencies | Compiled dependency | Tests found at top level | Merged PRs since 2026-04-01 | Fix-titled |
| --- | ---: | --- | --- | --- | --- | ---: | --- | --- | ---: | ---: |
| `schemathesis/schemathesis` | 3,817 | MIT | 2026-11-25 | 3.11 and later | hatchling | 13 | pyyaml | `test/` | 2,367 | 1,434 |
| `pypa/virtualenv` | 5,069 | MIT | 2026-11-24 | 3.9 and later | hatchling | 7 | no | `tests/` | 542 | 281 |
| `tox-dev/tox` | 3,984 | MIT | 2026-11-24 | 3.11 and later | hatchling | 11 | no | `tests/` | 416 | 232 |
| `koxudaxi/datamodel-code-generator` | 4,065 | MIT | 2026-11-25 | 3.11 and later | hatchling | 12 | pydantic | `tests/` | 2,847 | 217 |
| `psd-tools/psd-tools` | 1,491 | MIT | 2026-11-25 | 3.11 and later | setuptools | 3 | pillow | `tests/` | 352 | 123 |
| `pypa/packaging` | 762 | NOASSERTION (dual) | 2026-11-24 | 3.10 and later | flit_core | 0 | no | `tests/` | 288 | 97 |
| `BrianPugh/cyclopts` | 1,306 | Apache-2.0 | 2026-11-24 | 3.11 and later | hatchling | 4 | no | `tests/` | 204 | 91 |
| `collective/icalendar` | 1,192 | BSD-2-Clause | 2026-11-24 | 3.10 and later | hatchling | 3 | no | not under tests or test | 350 | 62 |
| `fsspec/filesystem_spec` | 1,388 | BSD-3-Clause | 2026-11-25 | 3.11 and later | hatchling | 0 | no | not under tests or test | 276 | 58 |
| `wntrblm/nox` | 1,566 | Apache-2.0 | 2026-11-16 | 3.10 and later | hatchling | 11 | no | `tests/` | 121 | 56 |
| `hgrecco/pint` | 2,832 | NOASSERTION (dual) | 2026-11-15 | 3.13 and later | hatchling | 3 | no | not under tests or test | 147 | 52 |
| `pypa/build` | 864 | MIT | 2026-11-23 | 3.11 and later | flit_core | 4 | no | `tests/` | 218 | 49 |
| `PyCQA/isort` | 6,966 | MIT | 2026-11-25 | 3.11 and later | hatchling | 1 | no | `tests/` | 153 | 39 |
| `pallets/click` | 17,847 | BSD-3-Clause | 2026-11-16 | 3.11 and later | flit_core | 0 | no | `tests/` | 181 | 37 |
| `omni-us/jsonargparse` | 434 | MIT | 2026-11-25 | 3.10 and later | setuptools | 0 | no | not under tests or test | 149 | 35 |
| `joke2k/faker` | 19,504 | MIT | 2026-11-20 | 3.10 and later | setuptools (legacy) | 1 | no | `tests/` | 90 | 34 |
| `Python-Markdown/markdown` | 4,259 | BSD-3-Clause | 2026-11-25 | 3.11 and later | setuptools | 0 | no | `tests/` | 63 | 22 |
| `more-itertools/more-itertools` | 4,109 | MIT | 2026-11-23 | 3.11 and later | flit_core | 0 | no | `tests/` | 92 | 18 |
| `pygments/pygments` | 2,227 | BSD-2-Clause | 2026-09-27 | 3.9 and later | hatchling | 0 | no | `tests/` | 88 | 16 |
| `Delgan/loguru` | 24,170 | MIT | 2026-11-24 | 3.5 and later | flit_core | 3 | no | `tests/` | 44 | 14 |
| `pytest-dev/pluggy` | 1,721 | MIT | 2026-11-24 | 3.10 and later | setuptools | 0 | no | `testing/` | 96 | 9 |
| `dateutil/dateutil` | 2,647 | NOASSERTION (dual) | 2026-11-18 | 3.11 and later | hatchling | 1 | no | `tests/` | 39 | 9 |
| `python-semver/python-semver` | 527 | BSD-3-Clause | 2026-11-18 | 3.10 and later | setuptools | 0 | no | `tests/` | 31 | 8 |
| `tkem/cachetools` | 2,797 | MIT | 2026-11-25 | 3.11 and later | setuptools | 0 | no | `tests/` | 25 | 6 |
| `marshmallow-code/marshmallow` | 7,243 | MIT | 2026-11-24 | 3.11 and later | flit_core | 0 | no | `tests/` | 60 | 5 |
| `jazzband/tablib` | 4,759 | MIT | 2026-11-11 | 3.11 and later | setuptools | 0 | no | `tests/` | 24 | 5 |
| `python-attrs/cattrs` | 1,061 | MIT | 2026-11-02 | 3.10 and later | hatchling | 3 | no | `tests/` | 34 | 4 |
| `python-attrs/attrs` | 5,866 | MIT | 2026-11-25 | 3.10 and later | hatchling | 0 | no | `tests/` | 39 | 3 |
| `PyCQA/pyflakes` | 1,466 | MIT | 2026-10-28 | 3.11 and later | setuptools (legacy) | NA | no | not under tests or test | 50 | 3 |
| `matthewwithanm/python-markdownify` | 2,262 | MIT | 2026-11-18 | not declared | setuptools | 1 | no | `tests/` | 6 | 3 |
| `pallets/markupsafe` | 703 | BSD-3-Clause | 2026-10-03 | 3.11 and later | setuptools | 0 | own C speedups | `tests/` | 9 | 2 |
| `pallets/werkzeug` | 6,887 | BSD-3-Clause | 2026-11-09 | 3.11 and later | flit_core | 1 | markupsafe | `tests/` | 83 | 2 |
| `pypa/twine` | 1,794 | Apache-2.0 | 2026-11-11 | 3.10 and later | setuptools | 9 | no | `tests/` | 19 | 2 |
| `pallets/jinja` | 11,832 | BSD-3-Clause | 2025-06-14 | 3.10 and later | flit_core | 1 | markupsafe | `tests/` | 0 | 0 |
| `pallets/itsdangerous` | 3,145 | BSD-3-Clause | 2025-06-14 | 3.10 and later | flit_core | 0 | no | `tests/` | 0 | 0 |
| `alecthomas/voluptuous` | 1,851 | BSD-3-Clause | 2026-11-14 | not declared | none declared | 0 | no | not under tests or test | 14 | 0 |
| `pyeve/cerberus` | 3,282 | ISC | 2026-10-01 | 3.7 and later | setuptools | 1 | no | not under tests or test | 2 | 0 |
| `jaraco/keyring` | 1,521 | none detected | 2026-10-29 | 3.10 and later | setuptools | 7 | no | `tests/` | 0 | 0 |

Source: GitHub API, collected 2026-11-25T17:32 UTC (`data/github_repo_survey_38.tsv`). "NOASSERTION (dual)" means GitHub reports several licences in one file. "Not under tests or test" means the repository has no `tests/` or `test/` directory at its top level: these projects keep their tests elsewhere, for example in `pint/testsuite/`, `fsspec/tests/` or `jsonargparse_tests/`, and the helper's `map` counts only files named like tests there. Python 3.13 appears in the packaging file of 35 of the 38 repositories; three do not mention it.

**The ten to mine first**, in this order:

1. `pypa/packaging`: 97 fix-titled pull requests since April, no dependency, a fast test suite, 90 tasks already validated in FreshSWE-Py to compare against.
2. `wntrblm/nox`: 56, no validated task in the leaderboard set; the helper misroutes its one OOD-45 task (Document 05), so more tasks are informative.
3. `fsspec/filesystem_spec`: 58, no dependency; 7 tasks exist in OOD-45 but all need a test plugin that the harness does not inject.
4. `pallets/click`: 37, and an anchor of P20; new pull requests after October 2026 extend the panel for free.
5. `PyCQA/isort`: 39; its statements are often bare commit messages, the regime the public set has most of.
6. `BrianPugh/cyclopts`: 91; 3 tasks in the leaderboard set; small and active.
7. `hgrecco/pint`: 52, but it now requires Python 3.13 or later, which matches the scorer's image and excludes the Python 3.12 interpreter of the staff notebook.
8. `pypa/build`: 49 fix-titled pull requests, 4 runtime dependencies, none compiled; one validated post-release task in the leaderboard set and 11 older ones in SWE-rebench-V2.
9. `pytest-dev/pluggy`: 9 fix-titled pull requests, 14 validated tasks; tests take 0.3 s.
10. `more-itertools/more-itertools`: 18, an anchor of P20.

**Leave out**: `schemathesis` and `datamodel-code-generator` at the top of the table owe their counts to conventional-commit automation (1,434 of 2,367 and a large share of 2,847 merged pull requests) and depend on compiled packages (`pyyaml`, `pydantic`); `psd-tools` needs pillow; `markupsafe` is itself the compiled package. `jinja`, `itsdangerous`, `voluptuous`, `cerberus` and `keyring` merged no pull request since April 2026.

Title counts are raw material only. A pull request counts as "fix-titled" whether or not it changes tests, and the verification that new tests fail before the fix is a later, per-task step (Document 04).

---

## 5. The same repositories across sources

Where the surveyed repositories already have validated tasks:

| Repository | FreshSWE-Py (post-release) | SWE-rebench-leaderboard (post-cutoff) | SWE-rebench-V2 | SWE-rebench-V2.1 | Earlier sets |
| --- | ---: | ---: | ---: | ---: | --- |
| `pypa/packaging` | 90 | 0 | 27 | 22 | none |
| `pallets/click` | 38 | 1 | 70 | 50 | none |
| `more-itertools/more-itertools` | 21 | 0 | 11 | 7 | none |
| `pytest-dev/pluggy` | 14 | 0 | 8 | 4 | none |
| `PyCQA/isort` | 46 | 1 | 20 | 17 | 4 in SWE-rebench |
| `Delgan/loguru` | 8 | 4 | 12 | 6 | 14 in SWE-rebench |
| `tox-dev/tox` | 0 | 7 | 7 | 44 | 99 in SWE-rebench |
| `wntrblm/nox` | 0 | 0 | 61 | 24 | none |
| `fsspec/filesystem_spec` | 0 | 0 | 2 | 20 | 31 in SWE-rebench |
| `hgrecco/pint` | 0 | 0 | 0 | 33 | 57 in SWE-rebench |
| `python-attrs/attrs` | 3 | 0 | 45 | 33 | none |
| `marshmallow-code/marshmallow` | 5 | 2 | 1 | 27 | 61 in SWE-rebench |
| `pallets/werkzeug` | 17 | 0 | 55 | 43 | none |
| `pallets/jinja` | 0 | 0 | 23 | 22 | none |

Counts from `data/dataset_repo_sources.tsv` (Hugging Face, 2026-11-25) and Section 2. A repository's tasks in the SWE-rebench family were mostly created before 2025: in SWE-rebench-V2, between one and five tasks per repository of this table are post-cutoff. FreshSWE-Py is the only source with post-release tasks for them.

---

## 6. Repositories to avoid, or to treat with care

| Group | Repositories | Reason |
| --- | --- | --- |
| SWE-bench Verified and Lite | astropy, django, flask, matplotlib, pylint, pytest, requests, scikit-learn, seaborn, sphinx, sympy, xarray | Closed models identify the buggy file from the issue text alone on up to 76 percent of Verified instances against fewer than 53 percent on other repositories (arXiv 2506.12286). `requests` is also one of the public four. Their tasks date from 2012 to 2023 |
| SWE-Gym's 11 repositories | pandas, MONAI, moto, mypy, dvc, modin, dask, pydantic, conan, hydra, bokeh | Every task predates May 2024. Usable as training data, not as a holdout |
| Synthetic-test sets | R2E-Gym, SWE-smith, SWE-Dev, Scale-SWE | Tests are generated, not written by the maintainers; the SWE-smith paper states its instances are not appropriate for evaluation |
| Compiled dependencies | pydantic and pydantic-settings, numpy, pandas, scipy, pillow, lxml, markupsafe | Valid tasks, but each needs binary wheels for CPython 3.13 on Linux and a larger offline environment |
| Same owner as a public repository | `fastapi/typer`, `fastapi/sqlmodel`, `encode/uvicorn`, `Textualize/textual` | Valid tasks; weaker evidence of transfer |
| Dormant in 2026 | `pallets/jinja`, `pallets/itsdangerous`, `alecthomas/voluptuous`, `pyeve/cerberus`, `jaraco/keyring` | No merged pull request since 2026-04-01, so nothing new to mine |

---

## 7. Not verified

| Not verified | Why |
| --- | --- |
| Dependency and purity claims for repositories outside the 38 surveyed | Assessments from this run and from the dataset survey, marked as estimates |
| Per-repository counts of the gated datasets | Hugging Face answers 401 without a login; paper-level facts only |
| Whether each repository's tests pass offline under the scorer's conventions | Only the FreshSWE-Py repositories were validated under them; for the others, expect about a quarter of real fixes to fail the scorer's test rules for environmental reasons alone (FreshSWE-Py's audit: 277 of 1,143) |
| Task dates of SWE-bench Pro and R2E-Gym | Those datasets carry no date column |
