# Problem sources across the internet: repositories useful for creating tasks with the competition's rigour

**Prepared:** 2026-11-25. **Scope:** the added task, "research what other repositories across the internet would be useful to create problems with the same rigour as the Kaggle competition". It covers GitHub repositories, Hugging Face datasets, Kaggle datasets and the papers behind them, beyond the three named in the request (`swebench/collect`, `SWE-rebench-V2`, `Multi-SWE-bench`), which are assessed first. The suitable target repositories found in these sources are listed in Document 02.

Six background research passes collected the evidence for this document and Documents 02 and 04; their notes, page dumps and API captures are kept under `scratch/2026-11-25-bcf-portfolio/research-agent-*/`. Claims marked as single-source rest on one page.

---

## 0. Summary

| Class | Most useful | Use it for |
| --- | --- | --- |
| Sets already in the competition's format | FreshSWE-Py, OOD-45, OOD-B, OOD-C | Testing today, without building anything |
| Large validated Python pools | `nebius/SWE-rebench-leaderboard` and the rest of the SWE-rebench family, SWE-bench-Live, SWE-Gym, SWE-bench Pro | Breadth; rows to convert into the competition layout |
| Pipelines that mine and validate | The FreshSWE-Py scripts, the OOD builder `build_env.py`, SWE-rebench-V2's builder, SWE-bench-Live's recipe | Creating tasks with every rigour criterion in place |
| Tools that build environments and test oracles | SWE-Factory, Repo2Run, SetUpAgent, EnvBench, mini-swe-agent, OpenHands benchmarks, MoatlessTools | The expensive step: a reproducible environment for an arbitrary repository |
| Older bug databases | BugsInPy, BugSwarm, Commit0 | Shaking down a harness; not holdouts |
| Training-shaped sets | SWE-smith, R2E-Gym, SWE-Dev, Multi-SWE-RL, Nemotron, Scale-SWE | Training only; several state that they are not for evaluation |
| Curated lists | Awesome-Issue-Resolution | Watching for new sets |

---

## 1. The three repositories named in the request

| Repository | What it is | What it automates | What it leaves to you | Rigour it can deliver | Verdict |
| --- | --- | --- | --- | --- | --- |
| `SWE-bench/SWE-bench` (`swebench/collect`) | The original collection toolkit | Repository selection, pull-request and issue scraping, candidate construction (`swebench dataset collect`, `build_dataset.py`, `print_pulls.py`) | Per-task version assignment, install specifications and validation: "The candidates still need versions, install specs and validation before they are usable" (docstring of `collect`, read on 2026-11-25). The validation code was removed from the public tree; the collection tutorial recommends reverting to commit `b4a40501` for it | Not by itself. In the SWE-smith paper's comparison, collecting 11 Flask instances this way took about 38 human hours | Scraping only; not a route to 20 verified tasks this month |
| `SWE-rebench/SWE-rebench-V2` | Builder for the SWE-rebench V2 dataset (arXiv 2602.23866, ICML 2026) | Prompt templates, Dockerfile generators, image builders, an evaluation script and a converter to Harbor task directories | The mining itself: the public repository shows no crawl or issue-linking module. The paper's pipeline needs an interactive setup agent (mini-SWE-agent with Qwen3-Coder-480B) and three LLM judges | High, when you consume its rows: paired full-suite runs keep tasks with at least one fail-to-pass test. The funnel is 29.5 million pull requests to 32,079 tasks; about 20 percent of repositories succeed the setup on one attempt | Consume the datasets; do not re-run the pipeline for three repositories |
| `Multi-SWE-bench/Multi-SWE-bench` (ByteDance) | A multilingual benchmark and its collection and harness modules | Scraping and joining (`collect.get_pipeline`), Docker image build and run (`harness.build_dataset`) | Expert annotation: 68 annotators curated 2,456 candidates into 1,632 instances | High, but for Java, TypeScript, JavaScript, Go, Rust, C and C++. Its README lists no Python, and the companion `Multi-SWE-RL` dataset has no Python rows either | Not applicable to a Python portfolio; a reference for a manual validation protocol |

Of the three, only the SWE-rebench family supplies ready Python tasks, and those come from its Hugging Face datasets rather than from the GitHub repository.

---

## 2. Sets published for this competition, in its own task format

| Set | Owner | Tasks | Repositories | Dates | Gate | Environment | Licence | Updated | Verdict |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| FreshSWE-Py (v6) | moshegolderson | 663 (lite 278, issue-statement 167) | 33 public Python libraries | created 2026-04-02 to 2026-10-18 | Fails at the base commit, passes with the reference patch, passes again, under the scorer's test rules | Docker image with an offline wheelhouse of 1,537 wheels; drop-in for `swegemma eval` | Upstream licences (MIT, BSD, Apache-2.0); scripts Apache-2.0 | 2026-11-07 | The base of P20; the deepest validation record of the four |
| OOD-45 | rodrigospalma | 45 | 17 projects | fixes merged 2026-09-18 to 2026-10-03 | Gold resolves and base fails 3 of 3, on two platforms; statements rewritten and checked for fix material | Subprocess sandbox with the set's runner, which installs each repository's wheels | CC BY 4.0 for the curated material; MIT for the tools | 2026-10-18 | Cross-check with leakage-audited statements |
| OOD-B pilot | ozgung | 82 | 70 | created 2025-11-14 to 2026-05-11 | Gold resolves in four runs; the empty patch does not | Same layout as OOD-45 | Per repository, OSI-approved only | 2026-10-31 | Cross-check with organic issue text |
| OOD-C | ozgung | 186 | 148 | created 2025-01-03 to 2026-05-05 | Agent path runs on all 186; 58 gradable with Python 3.13 | Same layout as OOD-45 | Per repository, OSI-approved only | 2026-11-11 | Far-transfer probes; keep the gradable ones only |
| g4-weight-edit-replay | ozgung | 320 recorded `edit_file` calls | NA | 2026 | Frozen gate reports | Replay of prompts and file states | Apache-2.0 | 2026-11 | Not a task set; useful to test an editor without a repository |
| gemma4-locbench-v1 | Kris_shah123 | 129 localization probes | The four public ones | 2026 | Labels derived from the public reference patches | A GPU-free notebook that scores any context selector | NA | 2026-11-05 | A localizer test on the public set only |
| Trap-25 | robinamirbahar | 25 | The four public ones and one more | 2026 | Author-verified buggy and gold states | Notebook | CC0 | about 2026-11-06 | Loop and deception diagnostics only |

Sources: the Kaggle metadata API and each set's README and task file, read on 2026-11-25; the forum threads 750573 (OOD-45), 751707 (FreshSWE-Py), 758821 (OOD-B and OOD-C), 756315 (locbench) and 751959 (Trap-25). None of the four task sets has been audited by anyone but its author; the OOD-45 and FreshSWE-Py papers pre-register their analyses and release per-task records.

A finding shared by these sets matters for anyone building a set: in the plain Kaggle notebook the harness installs no task dependencies in its subprocess sandbox, so the gold patch resolved only 3 of 45 OOD-45 tasks until a runner unpacked the wheels (OOD-45 writeup, 2026-10-18). On the public 129, different teams report between 43 and 127 gold patches passing locally depending on how the sandbox was built.

---

## 3. Public task datasets with real issues

| Dataset | Owner | Size | Python repositories | Dates | Execution validation | Access | Licence | Use |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SWE-rebench-leaderboard | nebius | 860 tasks | 413 | 2025-01-03 to 2026-05-12 | Full test suite before and after the fix; at least one fail-to-pass test; curated for agent evaluation | open | CC BY 4.0 | The best large pool: all post-cutoff, 64 post-release |
| SWE-rebench-V2 and V2.1 | nebius; ibragim-bad | 32,079 tasks in 20 languages, 7,243 of them Python (V2.1: 21,272 re-verified tasks, 11,925 Python) | 691 (V2); 2,454 (V2.1) | to 2025-07-22 | Paired full-suite runs; three-judge issue-clarity filter; V2.1 adds `quality_flags` and re-verified images | open | CC BY 4.0 | Rows with clean flags, after converting to this harness |
| SWE-rebench | nebius | 27,878 tasks | 3,468 | 2014 to 2025-04-30 | Scripted install and full test run | open | CC BY 4.0 | Mostly pre-cutoff; training material |
| SWE-bench-Live | microsoft | 1,319 Python tasks, 93 repositories; about 50 new tasks a month; MultiLang 1,077 tasks | 93 | issues since 2024 | Gold patch, then three runs to drop flaky tests | gated on Hugging Face | MIT | The best-documented builder recipe (Section 5) |
| SWE-Gym | SWE-Gym | 2,438 tasks | 11 (pandas 737, MONAI 374, moto 343, mypy 257, dvc 225, modin 107, dask 145, pydantic 83, conan 75, hydra 66, bokeh 26) | 2018-09 to 2024-05 | Gold patch must pass more tests than the base | open | MIT | Pre-cutoff: training, not holdout |
| SWE-bench Pro | Scale AI | 642 validated tasks, 11 repositories, 4 languages | 3 in version 1 (ansible 96, openlibrary 91, qutebrowser 79) | no date column | Hidden fail-to-pass and pass-to-pass tests in a pristine container | open (v1); gated (v2) | MIT | Long-horizon difficulty; a cross-check harness |
| SWE-bench-extra | nebius | 6,376 rows | 1,988 | to 2025-05 | Environments built and tests run | open | CC BY 4.0 | Predecessor of SWE-rebench; contamination era |
| SWE-PolyBench | Amazon Science | 2,110 tasks; verified split 382, of which 113 Python | 21 | pre-2025 | Verified split passes with its gold patch | gated | MIT | The authors warn of patch leakage |
| SWE-bench++ | Turing | 500 public rows of 7,000 claimed, 9 languages | NA | 2025-12 | Runs on the SWE-bench harness | open | none stated | Hardest public post-2025 split; check dates per row (single source) |
| LongTail-SWE | SWE-rebench | 471 tasks, 13 languages | none in Python | 2025 to 2026 | Fail-to-pass and pass-to-pass from merged pull requests; no-network gates | open | MIT; CC BY 4.0 | Wrong languages; a rigour exemplar |
| SWE-Lancer | OpenAI | 1,400 freelance tasks; 198 offline-verified of 237 | one application (Expensify), mostly JavaScript and TypeScript | 2024 era | Triple-verified end-to-end tests | gated | MIT | Different metric and format; not a Python source |
| SWE-Dev | THUDM; DorothyDUUU (two projects) | 38,000 training instances; 14,000 train and 500 test | 4,413 PyPI repositories | 2025 | Generated or developer-written tests | gated; no licence for the second | NA | Feature-shaped tasks; training |
| SWE-bench Lite and Multimodal | SWE-bench | 323; 580 | 12; none (JavaScript and TypeScript) | 2012 to 2024 | SWE-bench harness | open | family MIT | Known to the model; JS only |
| SWE-Perf, SWE-fficiency | their authors | 140; 498 optimization tasks | 12; 9 | to 2025-07 | Runtime measured | open | Apache-2.0 | A different objective |
| SWE-MERA | MERA-evaluation | NA | NA | to 2026-01 | not inspected | open | NA | Inspect before any use |

Older databases of real bugs with tests: **BugsInPy** (`soarsmu/BugsInPy`: 17 Python projects including fastapi; bugs of about 2013 to 2020; Docker and a command line; no licence file found), **BugSwarm** (Java and Python build artefacts; about 97 percent reproducibility claimed; old) and **Commit0** (57 libraries rebuilt from their tests; MIT). Their fixes are old enough to be memorised, so they serve to shake down a harness, not to measure an agent.

---

## 4. Tools that build the environment and the test oracle

Creating one rigorous task has two expensive steps: a reproducible environment for the repository at the base commit, and proof that the new tests fail before the fix and pass after it. These tools address the first.

| Tool | Owner | What it does | Documented result | Needs | Licence | Last update |
| --- | --- | --- | --- | --- | --- | --- |
| SWE-Factory | DeepSoftwareAnalytics | Four agents build a Dockerfile and an evaluation script for a GitHub issue, with a memory pool | 337 valid task instances out of 671 issues (50.2 percent) with GPT-4.1 mini, at $0.047 per instance; exit-code fail-to-pass validation with F1 0.99 (FSE 2026 paper, arXiv) | An OpenAI-compatible API and Docker | none declared | 2026-05-12 |
| Repo2Run | ByteDance | An agent builds the environment and emits a Dockerfile; success means the tests can be collected | NeurIPS 2025 spotlight | An LLM API and Docker | Apache-2.0 | 2026-06-10 |
| SetUpAgent | paper authors | Historically accurate dependency setup | arXiv 2503.07701 | NA | NA | 2025-03 |
| EnvBench | JetBrains Research | A benchmark of environment setup | The best setup agents succeed on 6.69 percent of Python repositories | NA | MIT | 2025-11-09 |
| EnvAgent | paper authors | Synthesizes Docker environments for scientific repositories | arXiv 2611.23258 | NA | NA | 2025-11 |
| mini-swe-agent | SWE-agent | A small agent harness; the one Nebius used to build the SWE-rebench V2 environments | NA | NA | MIT | 2026-11-23 |
| OpenHands benchmarks | OpenHands | Evaluation harness for SWE-bench-style tasks | NA | Docker | MIT | 2026-11-24 |
| MoatlessTools | aorwall | Runs SWE-bench evaluations with retrieval plumbing | NA | Docker | MIT | 2025-09-01 |
| SWE-smith | SWE-bench | Injects synthetic bugs into 128 repositories and writes issue text for them | 50,137 tasks for $1,360 and about 20 hours; the paper states the instances are not appropriate for evaluation | Docker, Ubuntu | MIT | 2025-12 (dataset) |
| The OOD builder `tools/build_env.py` | ozgung (in the OOD-B and OOD-C datasets) | Turns a SWE-rebench row into the competition's layout: snapshot, frozen environment as wheels, gate with gold, empty patch and a stub agent | OOD-B: 160 candidates to 129 built to 82 gated; OOD-C: 258 candidates to 58 gradable | A Kaggle CPU kernel with internet | MIT | 2026-11 |
| The FreshSWE-Py scripts | moshegolderson (in the dataset) | Mine commits from git history, lock environments, validate under the scorer's rules | 1,143 candidates to 663 tasks | Python, `uv`, Docker | Apache-2.0 | 2026-11-06 |

SWE-Factory's figures are the paper's abstract and results table: 671 issues from 12 repositories in four languages, of which the GPT-4.1 mini configuration built 337 valid instances. The "none declared" licence entry means no licence was identified on its repository page in this survey; check before reusing its code.

---

## 5. Ranked routes to create tasks with the competition's rigour

The rigour standard used here has six criteria: a real merged fix of a real issue; a hidden test patch; tests that fail at the base commit and pass with the fix; a reproducible offline environment; a snapshot without future history; and a task newer than the model's training cutoff.

| Rank | Route | Why | Documented cost or attrition |
| ---: | --- | --- | --- |
| 1 | Adopt a post-release set in the competition's format and re-run its gate locally | All six criteria are already met and the format is this scorer's | Near zero to adopt; the gate is a few CPU-hours |
| 2 | Convert SWE-rebench rows with the OOD builder | Large post-cutoff supply, already execution-validated upstream | Between one in five and one in two candidates survives the conversion (OOD-B 82 of 160; OOD-C 58 of 258) |
| 3 | Mine fresh commits with the FreshSWE-Py recipe (Document 04) | Needs no GitHub API and no LLM; the validation step is the scorer's own | 58 percent of candidates pass (663 of 1,143) |
| 4 | SWE-Factory or Repo2Run for repositories without a lock file | Automates the environment step where the recipe has nothing to pin | Cents per candidate for the API; about half the environments valid |
| 5 | SWE-bench-Live's recipe (LLM quality judge, RepoLaunch, three-run flaky filter) | The most complete published pipeline | At least three GitHub tokens, an OpenAI key, a large Docker host |
| 6 | `swebench/collect` plus manual work | The original method | About 207 minutes of human work per instance in the SWE-smith paper's comparison |

Two rules apply to every route. Validate with the target scorer's own test rules and record what they exclude: FreshSWE-Py found that 277 of 1,143 real fixes (24 percent) fail only because of a scoring rule (the anyio plugin ban alone removes every starlette fix and 25 of 43 uvicorn fixes), and that two of the 129 public tasks cannot be credited to any agent for the same reason. And audit the statement for fix material: 43 of the 45 texts that OOD-45 was mined from carried part of the fix, and 44 of the 129 public statements do too as shipped.

---

## 6. Training-shaped sets, and why they are not evaluation sets

| Set | Owner | Size | Why not for evaluation |
| --- | --- | --- | --- |
| SWE-smith | SWE-bench | 50,137 tasks (59,136 rows on Hugging Face) | Bugs are injected and issue text is generated; "does not yield instances appropriate for evaluation" (paper) |
| R2E-Gym | R2E-Gym | 8,101 tasks from 13 repositories | Tests are generated; no issue dates |
| Multi-SWE-RL | ByteDance Seed | 4,723 instances, 76 repositories | Seven languages, none of them Python; training set |
| Nemotron-SWE-v1 and related sets | NVIDIA | NA | Training trajectories |
| Scale-SWE | AweAI-Team | 100,000 instances claimed | Agent-verified with synthesized tests |
| SWE-Universe | paper by Chen et al. (arXiv 2602.02361) | 807,693 environments claimed | Training scale; no official release located |
| SWE-Fixer | InternLM | 110,000 training pairs | Training data only |

---

## 7. Curated lists

**Awesome-Issue-Resolution** (`deepsoftwareanalytics.github.io/Awesome-Issue-Resolution`) is the one list worth following: it is current through November 2026 and names sets this survey did not open one by one (Robo-SWE, SWE-DIVE, Active-SWE, Multi-Docker-Eval, SWE-Mirror, SWE-Flow, SWE-Synth). Trackers: `swebench.com` and the leaderboards of Epoch AI and vals.ai.

---

## 8. Leads that did not pan out, and what was not verified

| Lead | What was found |
| --- | --- |
| `SWE-rebench/SWE-universe` | The repository does not exist (404); SWE-Universe is a paper by a different team (arXiv 2602.02361) |
| `SWE-agent/agent-instructions` | Not found |
| "EnvGent" | No such project; EnvAgent, EnvBench and Repo2Run are the real neighbours |
| "SWE-PBench" | No hits on arXiv, GitHub or Hugging Face |
| "LMPI" operator of SWE-smith | Does not exist; the operators are LM Modify, LM Rewrite, Procedural Modification, PR Mirror and Combine |
| `openai/SWE-Lancer` | Moved into the `openai/preparedness` project |
| "SWE-bench-extra by Agentless or MoatlessTools" | The canonical set is `nebius/SWE-bench-extra` |

Not verified: per-repository counts of the six gated Hugging Face datasets; the total size of SWE-bench Pro including its private split; R2E-Gym's full repository list; whether SWE-rebench-V2's "collection code" release includes the mining module; the contents of SWE-MERA; the gate numbers of any set, which were not re-run in this survey.
