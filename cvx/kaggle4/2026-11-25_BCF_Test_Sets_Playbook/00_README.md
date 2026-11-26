# BCF test sets: the playbook

**Start here.** This folder is a playbook system for a beginner: it takes you from a machine with a fresh Zorin OS 18 to comparing two versions of the BCF brain on test sets the brain has never seen, and it shows how to cut each set of 20 tasks into smaller sets for fast loops. The same text is in `BCF_Test_Sets_Guide.html`, one portable file you can open anywhere (double-click it; it needs no internet).

**Prepared:** 2026-11-25. **Machine the playbooks are written for:** the PowerSpec G914 (RTX 5090, 32 GB) with Zorin OS 18 and Windows. **What the sets are:** six sets of real software-engineering tasks in the competition's own format, taken from the public FreshSWE-Py data set. The brain under test is the patched one of the 2026-11-24 package.

## The path in one page

| Stage | Playbook | What you have at the end | Time the first time |
| --- | --- | --- | --- |
| 1 | Playbook 1. Install | Zorin, driver, two Python environments, the data, Docker, the sandbox image, the model, the brain | 2 to 4 hours, mostly downloads |
| 2 | Playbook 2. First run | Proof that the environment is sound (the gate), then the first tasks run end to end | 1 to 2 hours |
| 3 | Playbook 3. The sets | You know what P20, B40 and R1 to R4 are and which to use when | 15 minutes of reading |
| 4 | Playbook 4. Cut a set into slices | Lists of 1, 3, 5 and 10 tasks cut from every set, and the command that cuts more | 15 minutes |
| 5 | Playbook 5. Compare | A paired comparison of two versions, with its meaning spelled out | from 45 minutes per loop |
| 6 | Playbook 6. Rotate and confirm | A schedule that never reuses a set for the same question, and the final confirmation | the length of the runs |
| 7 | Playbook 7. Troubleshooting | The symptom, the cause and the fix for what can go wrong | when needed |

## The commands you will use most

```bash
source ~/bcf/.venv-harness/bin/activate && cd ~/bcf/playbook     # every session starts here
python3 tools/run_set.py --set P20 --part slice_A --version v2    # run one part of one set with one version
python3 tools/compare.py ~/bcf/results/P20/slice_A/v1-run1 ~/bcf/results/P20/slice_A/v2-run1   # pair the two runs
python3 tools/ledger.py                                           # the table of every run
python3 tools/check_setup.py                                      # is the machine ready?
```

## The sets in five lines

| Set | Tasks | What it is for | Use it |
| --- | --- | --- | --- |
| P20 | 20 | The main set: three small repositories (`packaging`, `click`, `more-itertools`) | For every comparison; cut into slices for the loops |
| R1, R2, R3, R4 | 20 each | Four more sets from 26 other repositories | One new set for each new comparison; they keep a change from being tuned to one set |
| B40 | 40 | Twice as many tasks of the same three repositories as P20 | Once per decision, at the end, to confirm it |

Every set mixes tasks the same way: 9 that two published baseline agents both solved, 7 that one of them solved, 4 that neither solved. Each part of a set keeps that mix.

## What is in the folder

| File or folder | Content |
| --- | --- |
| `01_Playbook_Install_Zorin_OS_18.md` to `07_Playbook_Troubleshooting.md` | The seven playbooks; each is a list of steps with what to type, what to expect and what to do when it fails |
| `08_Reference.md` | Commands, the terminal in ten lines, the folder map, file formats, glossary, sources, what was and was not verified |
| `09_Table_QC_Report.md` | Result of the table check on every document |
| `BCF_Test_Sets_Guide.html` | The portable guide: every playbook and every list of tasks in one file |
| `playbook.conf` | The paths on your machine; the defaults follow Playbook 1, so most people never edit it |
| `sets/` | The lists: `sets/P20/smoke_1.txt`, `sets/P20/slice_A.txt`, and so on for the six sets; `sets/<NAME>/slices.md` shows every part with its tasks |
| `sets/_tasks/` | The task rows of the six sets (copies of the portfolio package's files) |
| `tools/` | The scripts, with a README: cut, run, compare, gate, ledger, checks, self-test |

## What was verified, and what was not

| Verified on 2026-11-25 | How |
| --- | --- |
| The cut of every set | `make_slices.py` rebuilds the shipped lists byte for byte; every part is a partition of its set, every part of four has 5 tasks with 4 solved by a baseline and 1 not, the smoke tasks sit inside slice A, slice A inside half 1 |
| The launcher, the comparison and the ledger | `tools/selftest.py`: 21 tests with a pretend runner and pretend results written in the harness's own result format |
| The harness environment recipe | Built from scratch on Windows in a throwaway environment: the four harness wheels, then `finish_env.py` (151 packages), then the import probe (1,340 of 1,341 modules import; the one other is Windows-only) and the pre-flight of the panel runner (imports, adapters, registry, settings, evaluator) passed |
| The dependency facts | The wheelhouse listing and the package metadata were read today; the two dependency trees were resolved with uv for Linux and Python 3.12 (metadata only) |
| Zorin OS facts | The official Zorin pages were read today: 18.1 is the current version, its installer and driver steps |
| The model repository | The Hugging Face API says the model repository is public and not gated |

| Not verified | Why |
| --- | --- |
| Any step on the Zorin machine itself | This package was written on a Windows machine without the RTX 5090, without Docker running and without the model; every command that was not run is marked "not run here" |
| The model server, the Docker sandbox and the gates | They need the GPU, Linux and the 7 GB data set; the scripts that drive them were checked against the harness source and by self-check only |
| A real agent run and a real comparison | No model was called; the example output of `compare.py` is from pretend results and is labelled so |
| Times | Minutes per part are computed from published figures (277 seconds per task-run on the scorer's hardware; 8 minutes as the limit), not measured here |

## Five words to know before Playbook 1

| Word | Meaning here |
| --- | --- |
| Task | One bug to fix in one repository: the text the agent sees, the reference fix and the hidden tests |
| Set | 20 (or 40) tasks: P20, R1 to R4, B40 |
| Part | A few tasks of one set, as a list file: `smoke_1`, `slice_B`, `half_1` |
| Version | One build of the brain, under a name you choose: `v1`, `v2` |
| Run | One version on one part, once: its results are in one folder and are never overwritten |

> If you have never used a terminal, read the ten lines about it in `08_Reference.md` first; everything else is copy and paste.
