# Sources

All URLs were opened on 2026-11-25 unless a capture date is given. Pages of the competition were read from local copies captured earlier (`input/kagglecomp/`), because Kaggle pages need a signed-in browser session. The six background research passes kept their page dumps and API captures under `scratch/2026-11-25-bcf-portfolio/research-agent-*/`.

## Official competition pages and staff statements

| # | Source | Publisher | Date | URL or place | Used for |
| ---: | --- | --- | --- | --- | --- |
| 1 | Data page of the Gemma 4 Developer Agent competition (fields of `tasks.jsonl`, the generation and verification pipeline, "about 120 tasks ... curated from a set of private repositories") | Kaggle | captured 2026-09-29 | [competition data page](https://www.kaggle.com/competitions/gemma-4-developer-agent/data); local copy `input/kagglecomp/docs/markdown/Kaggle-02-Data.md` | Task format; rigour standard; hidden set |
| 2 | `HARNESS_README.md` of the competition data package (two-container lifecycle, test conventions, verification flags, protected paths) | Kaggle | package of 2026-09-29 | `input/kagglecomp/kagglecomp_data_package/HARNESS_README.md` | Harness behaviour |
| 3 | `swegemma` 0.2.11, `adk-submission` 0.2.13 and `adk-eval-core` 0.1.0, installed from the public wheelhouse | Kaggle | wheelhouse version 31 | local environment `scratch/2026-11-23-bcf-brain/venv` | Loader fields; sample verification; difficulty engine |
| 4 | Staff reply in thread 747248: none of the training repositories are in the test set; every test task is solvable with the gold patch | Kaggle staff (Ryan Holbrook) | 2026-10-09 | [discussion 747248](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747248) | Why transfer matters |
| 5 | Host note in thread 745998: no scored task touches an `async def` function | Competition host (Elan Markowitz) | 2026-10-05 | [discussion 745998](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/745998) | Excluding async tasks |
| 6 | Official Rules, section 2.6a (External Data may be used to develop and test submissions) | Kaggle | captured 2026-09-29 | local copy `input/kagglecomp/docs/markdown/Kaggle-04-OfficialRules.md` | Legitimacy of third-party sets |

## Model and contamination

| # | Source | Publisher | Date | URL or place | Used for |
| ---: | --- | --- | --- | --- | --- |
| 7 | Gemma 4 model card (pre-training data with a cutoff of January 2025) | Google DeepMind | fetched 2026-11-25 | [gemma.ai model card](https://gemma.ai/models/gemma-4/model-card) | Cutoff |
| 8 | Gemma 4 Technical Report | Google DeepMind | arXiv 2607.02770 | [arXiv HTML](https://arxiv.org/html/2607.02770v1) | Cutoff |
| 9 | The SWE-Bench Illusion: When State-of-the-Art LLMs Remember Instead of Reason | Microsoft Research | arXiv 2506.12286 (v4 2025-12-01) | [arXiv](https://arxiv.org/abs/2506.12286) | Memorisation on SWE-bench Verified; post-cutoff probe |
| 10 | SWE-Bench+: Enhanced Coding Benchmark for LLMs | Aleithan et al. | arXiv 2410.06992 (2024-10) | [arXiv](https://arxiv.org/abs/2410.06992) | Solution leakage in issue text |
| 11 | Remembered or Reasoned? A Contamination Audit of the Gemma 4 Agent Benchmark | Kaggle user vladee | 2026-10-07 | [writeup](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/remembered-or-reasoned-a-contamination-audit-of-t) | No robust memorisation by Gemma 4; merge date hides exposure |
| 12 | One Run Is Not Enough: Reminding a small Gemma 4 coding agent of its last finding made no measurable difference in a paired test | Patrick Passos | arXiv 2611.19359 (2026-11-14) | [arXiv](https://arxiv.org/abs/2611.19359) | Run-to-run variance |

## Sets in the competition's format

| # | Source | Publisher | Date | URL or place | Used for |
| ---: | --- | --- | --- | --- | --- |
| 13 | FreshSWE-Py, version 6: dataset, README, `tasks.jsonl`, `splits.json`, `baselines/`, `validation/`, `sandbox/setup.py`, `docker/Dockerfile` | Hersh Mittelman | v6 2026-11-07 | [Kaggle dataset](https://www.kaggle.com/datasets/moshegolderson/freshswe-py) | Base of P20 and B40 |
| 14 | FreshSWE-Py: Scorer-Faithful Tasks and Three Ways a Coding Leaderboard Misleads (paper PDF in the dataset) | Hersh Mittelman | PDF 2026-11-06 | `paper/freshswe-py-paper.pdf` in dataset 13 | Mining funnel; scorer audit; baselines; power |
| 15 | Thread 751707: announcement of FreshSWE-Py | Hersh Mittelman | about 2026-10-22 | [discussion 751707](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751707) | Provenance |
| 16 | OOD-45, version 4: dataset, README, `prereg.md`, `validation/`, `tools/` | Rodrigo Stachlewski Palma | v4 2026-10-18 | [Kaggle dataset](https://www.kaggle.com/datasets/rodrigospalma/ood45-bugfix-split) | Cross-check panel; leakage audit |
| 17 | OOD-45: Measuring Statement Leakage and Harness Error in Gemma 4 Coding Agents | Rodrigo Stachlewski Palma | 2026-10-18 | [writeup](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/ood-45-measuring-statement-leakage-and-harness-er) | Leakage effect; harness error rates |
| 18 | Thread 750573: announcement of OOD-45 | Rodrigo Stachlewski Palma | 2026-10-18 | [discussion 750573](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/750573) | Provenance |
| 19 | OOD-B pilot: dataset and README | Özgün Genç | 2026-10-31 | [Kaggle dataset](https://www.kaggle.com/datasets/ozgung/g4-oodb-pilot) | Organic issue text |
| 20 | OOD-C: dataset, README, `tools/build_env.py`, `validation/` | Özgün Genç | 2026-11-11 | [Kaggle dataset](https://www.kaggle.com/datasets/ozgung/g4-oodc) | Far-transfer probes; conversion builder |
| 21 | Thread 758821: announcement of OOD-B, OOD-C and the replay set | Özgün Genç | 2026-11-12 | [discussion 758821](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758821) | Provenance |
| 22 | Tools and Held-Out Tasks for Testing Agent-Written Weight Edits on Gemma 4 | Özgün Genç | 2026-11-12 | [writeup](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/tools-held-out-tasks-agent-written-weight-edits) | Attrition of held-out tasks |
| 23 | Frontier Models as Weight Editors for Gemma 4 E4B | Özgün Genç | 2026-11-12 | [writeup](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups/frontier-models-as-weight-editors-for-gemma-4-e4b) | Size of OOD-B; run-time attrition |
| 24 | Threads 756315 (gemma4-locbench-v1) and 751959 (Trap-25) | competition participants | 2026-11-05; 2026-10-23 | [756315](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/756315); [751959](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751959) | Other community sets |

## Public datasets and pipelines

| # | Source | Publisher | Date | URL or place | Used for |
| ---: | --- | --- | --- | --- | --- |
| 25 | SWE-rebench V2: Language-Agnostic SWE Task Collection at Scale | Nebius | arXiv 2602.23866 (ICML 2026) | [arXiv HTML](https://arxiv.org/html/2602.23866v1) | Pipeline and funnel |
| 26 | SWE-rebench-V2 builder repository | Nebius | pushed 2026-11-17 | [GitHub](https://github.com/SWE-rebench/SWE-rebench-V2) | What the builder releases |
| 27 | SWE-rebench: An Automated Pipeline for Task Collection and Decontaminated Evaluation | Nebius | arXiv 2505.20411 (NeurIPS 2025) | [arXiv](https://arxiv.org/abs/2505.20411) | Decontamination by date |
| 28 | Hugging Face datasets `nebius/SWE-rebench-leaderboard`, `nebius/SWE-rebench-V2`, `ibragim-bad/SWE-rebench-V2.1`, `nebius/SWE-rebench` | Nebius; Ibragim Badertdinov | API and statistics endpoints | [leaderboard](https://huggingface.co/datasets/nebius/SWE-rebench-leaderboard); [V2](https://huggingface.co/datasets/nebius/SWE-rebench-V2); [V2.1](https://huggingface.co/datasets/ibragim-bad/SWE-rebench-V2.1); [V1](https://huggingface.co/datasets/nebius/SWE-rebench) | Rows, repositories, dates |
| 29 | SWE-bench repository: `swebench/collect/README.md`, collection tutorial, `swebench/cli/dataset.py` | SWE-bench team | read 2026-11-25 | [GitHub](https://github.com/SWE-bench/SWE-bench) | What `collect` automates |
| 30 | SWE-smith: Scaling Data for Software Engineering Agents (paper and repository) | SWE-bench team | arXiv 2504.21798 (NeurIPS 2025) | [arXiv](https://arxiv.org/html/2504.21798v2); [GitHub](https://github.com/SWE-bench/SWE-smith) | Cost of collection; synthetic bugs |
| 31 | SWE-bench-Live: paper, repository and `Development.md` | Microsoft | arXiv 2505.23419; repo pushed 2026-11-24 | [arXiv](https://arxiv.org/abs/2505.23419); [GitHub](https://github.com/microsoft/SWE-bench-Live) | Builder recipe |
| 32 | SWE-Gym: paper, repository and dataset | SWE-Gym team | arXiv 2412.21139 (ICML 2025) | [arXiv](https://arxiv.org/html/2412.21139v2); [GitHub](https://github.com/SWE-Gym/SWE-Gym); [dataset](https://huggingface.co/datasets/SWE-Gym/SWE-Gym) | Its 11 repositories |
| 33 | SWE-bench Pro (repository and dataset) | Scale AI | v2 2026-09-22 | [GitHub](https://github.com/scaleapi/SWE-bench_Pro-os); [dataset](https://huggingface.co/datasets/ScaleAI/SWE-bench_Pro) | Python rows |
| 34 | Multi-SWE-bench repository | ByteDance Seed | README news to 2025-09-19 | [GitHub](https://github.com/Multi-SWE-bench/Multi-SWE-bench) | Languages covered |
| 35 | SWE-Factory: repository and paper | DeepSoftwareAnalytics | 2026-05-12 | [GitHub](https://github.com/DeepSoftwareAnalytics/swe-factory) | Environment construction yield and cost |
| 36 | Awesome-Issue-Resolution | DeepSoftwareAnalytics | current to 2026-11 | [list](https://deepsoftwareanalytics.github.io/Awesome-Issue-Resolution) | Landscape |
| 37 | GitHub REST API: metadata, `pyproject.toml`, test directories, releases and merged pull requests of 38 repositories | GitHub | 2026-11-25T17:32 UTC | `data/github_repo_survey_38.tsv` | Repository survey |

## Local evidence produced in this run

| # | File | Content |
| ---: | --- | --- |
| 38 | `data/probe45.tsv`, `data/probeb.tsv`, `data/probef.tsv` | Helper dry run: repository map, route, localizer ranking and timing for 70 tasks, with both helpers |
| 39 | `data/replay45_1123.json`, `data/replay45_1123_fix.json`, `data/replayb_1123.json`, `data/replayf_1123.json` | Editor replay of the 70 gold patches |
| 40 | `data/route_census.tsv` | Category, domain and route for every statement of four pools, both helpers |
| 41 | `data/localizer129_fixed.json` | Localizer evaluation of the public 129 with every entry of the top-file line counted |
| 42 | `data/difficulty_tiers.tsv`, `data/difficulty_tiers_freshswe.tsv` | Harness difficulty engine on the candidates and the reference sets |
| 43 | `data/panel_power.md` | Power of the paired sign test on panels of 20 to 129 tasks |
| 44 | `data/freshswe_py_663_tasks.tsv`, `data/ood45_45_tasks.tsv`, `data/oodb_82_tasks.tsv`, `data/swe_rebench_leaderboard_860.tsv` | Per-task facts of the held-out sets |
| 45 | `data/dataset_repo_sources.tsv`, `data/leaderboard_repos_ge3.tsv` | Repository counts per dataset |
