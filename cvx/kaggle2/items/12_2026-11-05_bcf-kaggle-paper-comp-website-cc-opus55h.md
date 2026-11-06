# COMBINED MARKDOWN - combine

_Generated 2026-11-05 20:13:00 | 6 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle2\items\combine_

## Contents

1. 00_README_Executive_Summary-cc-opus55h.md
2. 01_Overview_Rules_and_Writeups_Intel.md
3. 02_Discussion_Intel_and_Host_Rulings.md
4. 03_Code_Tab_Intel.md
5. 04_How_To_Writeup_Public_Notebook_and_Project_Link.md
6. 05_Winning_Whitepaper_Guide_Judging_Dos_Donts_Tips.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_README_Executive_Summary-cc-opus55h.md -->
<!-- ====================================================================== -->

# Gemma 4 Developer Agent Paper Track: Intel and Winning-Paper Guide (2026-11-05)

**Research question.** What does every tab of the Kaggle Paper Track (Overview, Code, Discussion, Rules, plus the Writeups tab) say, explicitly or implicitly? How do you attach the optional Public Notebook and the optional Public Project Link? And what does it take to write a winning paper under this rubric?

**Snapshot.** 2026-11-05, seven days before the **2026-11-12 23:59 UTC** deadline.

**Method.**
- Scraped every tab with the in-app browser and Kaggle's login-free internal API. This covered all 49 forum topics with every comment and all 108 public notebooks.
- Ran three parallel research passes against official sources: Kaggle docs and staff posts, arXiv/Zenodo/GitHub docs, and the NeurIPS guidelines plus the paper-writing and agent-evaluation literature.
- Spot-checked the claims that carry the most weight against the original pages: the NeurIPS Originality wording, the ARC "Universality" wording, the arXiv endorsement and PDF rules, the arXiv 2026 holiday list, and the Kaggle "Attachments / Media Gallery" wording.

---

## Contents

| # | File | What's inside |
| :---: | :--- | :--- |
| 00 | `00_README_Executive_Summary.md` | This file: summary, top findings, action plan |
| 01 | `01_Overview_Rules_and_Writeups_Intel.md` | Overview (rubric, requirements, topics, awards, citation), hidden API settings, main-competition data, Rules digest |
| 02 | `02_Discussion_Intel_and_Host_Rulings.md` | 29 numbered host and admin rulings, open questions, competitor themes, credibility red flags |
| 03 | `03_Code_Tab_Intel.md` | 108-notebook landscape, top notebooks, companion-notebook patterns |
| 04 | `04_How_To_Writeup_Public_Notebook_and_Project_Link.md` | Step by step: Writeup editor, public notebook into Project Links, PDF via Public Project Link, arXiv timing, checklist |
| 05 | `05_Winning_Whitepaper_Guide_Judging_Dos_Donts_Tips.md` | Rubric decoded, per-award reading, per-criterion playbook, do's and don'ts, word budget, skeleton, final QA |
| — | `scripts/` | Reproducible scrapers (`comp.py`, `scrape.py`) |

Raw captures: `scratch/paper_track_20261105/` (competition JSON, forum JSON plus `forum_dump.txt`, kernel lists).

---

## Executive summary: top 12 findings

1. **The format is a hackathon Writeup, judged by rubric.** There is no leaderboard and no medals.
   - Prize pool: $35k. Best Paper is $15k; Best New Resource and Best New Application are $10k each.
   - Scoring: five criteria, each 0–5, averaged.
   - Every paper is considered for every award, but each paper can win **one** award at most.
2. **Two criteria are borrowed word for word from established rubrics.**
   - *Novelty* is the NeurIPS 2025/2026 "Originality" question. Under it, insight from evaluating existing methods counts as novel; you do not need a new method.
   - *Quality* is the ARC Prize 2026 paper track's "Universality" (generality beyond the competition).
   - Write for a NeurIPS-style reviewer who also wants evidence that the work transfers.
3. **The organizers lean towards graph ML.** The citation block lists Perozzi, Rózemberczki and Galkin. The topics stress code graphs, graph reasoning and "the provided embeddings". This is an inference, but graph-centric work is on-theme.
4. **The word limit is 3,000 words of judged text.**
   - Counted: title, abstract, captions and **tables**.
   - Not counted: figures and references.
   - The appendix is supplementary, and the host does not guarantee it will be read. There is no official word counter.
5. **If you link a PDF, only the PDF is judged.** The host recommends using the Writeup body as an abstract. arXiv posting is allowed, and the track is non-archival.
6. **"Optional" is not quite optional.** The API settings include `requireCardImage: true` and `requireLinks: true`. Expect the submit form to demand a **cover image** and **at least one Project Link**.
7. **The second-writeup problem is unresolved.** The host allows two writeups per team, but the UI blocks a second *submitted* writeup, and no fix has been announced. Plan for one.
8. **Code is not mandatory.** If you also compete in the main competition, which ends 2 Dec, you can withhold your agent code. A dataset can ship as a ~5% sample now and in full later.
9. **The data-release rules are generous.** You may publish:
   - graphs and embeddings regenerated from upstream repos
   - derived labels
   - agent traces
   - translations keyed by `instance_id`

   Always add licences and links back to the source. Never redistribute the raw competition files.
10. **AI assistance is allowed, but "slop" is not.** The host: "Purely LLM generated 'slop' will not score well". Tasteful polishing is fine.
11. **Competitors are clustering on a few themes.** These are code-graph localization, harness and benchmark audits, loop and context management, and AST verification. A visible group pre-registers analysis plans with SHA-256 hashes (8 posts). Several public entries make outsized, unverifiable claims. Rigour is the differentiator.
12. **arXiv is a timing trap.**
    - Endorsement rules got stricter in January 2026.
    - A PDF generated from TeX is typically rejected; arXiv wants the source.
    - Moderation takes 1–4 days, and **Wed 11 Nov is an arXiv holiday**.
    - The last practical submit cutoff is **Tue 10 Nov, 14:00 ET**.
    - **Use a Zenodo version DOI plus an immutable GitHub release** as the PDF link.

---

## Recommended action plan (7 days)

| When (UTC) | Action |
| :--- | :--- |
| 5–6 Nov | Fix 1–3 claims and the target award. Freeze the held-out set and analysis plan, and post a hash (optional). Pick the template: NeurIPS 2026 `[preprint]` or arxiv-style |
| 6–8 Nov | Run the final experiments (≥3 seeds, paired, with CIs). Build the fast companion notebook that regenerates every table and figure from logs |
| 8–9 Nov | Write the full draft to the §6 word budget in report 05. Make the cover image. Do a cold-read review |
| **9–10 Nov** | **Submit a complete Writeup** (track selected, cover image, Project Links). Publish the PDF on Zenodo and as a GitHub release. Optionally submit to arXiv before Tue 10 Nov, 14:00 ET |
| 10–12 Nov | Iterate: word count, citation check, links tested logged out. Confirm the state is **Submitted** well before 12 Nov 23:59 UTC |

---

## Confidence and limits

- **High confidence:** the Overview, Rules, API settings, forum rulings and notebook list were captured first-hand. The quoted rubric origins and arXiv facts were checked on the original pages.
- **Medium confidence:**
  - The exact Writeup-editor labels come from Kaggle docs and sibling 2026 hackathon pages. The editor itself needs a login and was not seen.
  - Whether `requireLinks` hard-blocks submission without a link is inferred from the flag.
  - The arXiv announcement timing around the 11 Nov holiday is inferred from arXiv's October holiday pattern.
- **Not covered:**
  - Competitors' submitted writeups, which stay hidden until the deadline.
  - Host answers posted after 2026-11-05 21:08 UTC.


---

<!-- ====================================================================== -->
<!-- FILE: 01_Overview_Rules_and_Writeups_Intel.md -->
<!-- ====================================================================== -->

# 01 — Overview, Rules and Writeups Tab Intel

**Competition:** Google - The Gemma 4 Developer Agent Paper Track
**URL:** <https://www.kaggle.com/competitions/gemma-4-developer-agent-paper>
**Snapshot:** 2026-11-05 (scraped through the in-app browser and Kaggle's public internal API; no login used)
**Raw captures:** `scratch/paper_track_20261105/` (`competition.json`, `ListPages.json`, `GetCompetitionHackathonSettings.json`, `ListHackathonTracks.json`, `ListJudges.json`)

---

## 1. Key facts at a glance

| Item | Value | Source |
| :--- | :--- | :--- |
| Host / sponsor | Google DeepMind (sponsor entity: Google LLC) | Overview header; Rules §1.2 |
| Format | Featured **Hackathon**. You submit a Kaggle **Writeup** (a paper), not a prediction file | Overview |
| Start | 2026-09-22 (enabled on Kaggle 2026-09-23 15:15 UTC) | Timeline; API `dateEnabled` |
| **Final deadline** | **2026-11-12 23:59 UTC** (7 days after this snapshot) | Timeline; API `deadline` |
| Main (code) competition deadline | 2026-12-02. The paper deadline is earlier because papers take longer to judge | Forum 755176, 752667 |
| Prize pool | $35,000. No Kaggle points or medals | Overview |
| Word limit | 3,000 words of judged text | Submission Requirements; forum rulings |
| Archival status | Non-archival. You may also submit to other venues and arXiv | Overview; forum 743310 |
| Team size | Max 5. Mergers allowed | Rules §2.1 |
| Submission limits | 5 per day. Up to **2 Final Submissions** judged per team | Rules §2.2; forum 743255 |
| Winner licence | Open Source (OSI-approved, commercial use allowed); listed as Apache 2.0 | Rules §1.6, §2.5 |
| Data licence | "Competition Use and Commercial", Apache 2.0 | Rules §1.7 |
| Participation (05 Nov) | 6,782 entrants, 606 participants, 587 teams, 633 submissions | Overview sidebar; API |
| Judges listed | Elan Markowitz (ML Engineer, Google) | Overview > Judges; `ListJudges` |

> **Note on the 633 "submissions":** this counts all writeup submission events, including resubmissions. It is not 633 distinct papers. Writeups stay hidden until the deadline. One entrant says theirs "unlocks publicly on Kaggle after the Nov 13 deadline" (forum 751430).

---

## 2. Overview tab — full intelligence

### 2.1 Framing (Description)

- **Motivation.** Today's best coding agents run on large cloud API models. The goal is an agent "equally capable offline, on consumer hardware" by post-training an open model (Gemma 4) to navigate codebases and draft fixes.
- **Relation to the main competition.** There are two competitions. The featured leaderboard competition (`gemma-4-developer-agent`) ranks agents by bugs fixed. This Paper Track asks for research on the *how and why*. You do **not** need to take part in the main competition. Any related research is welcome as long as it is unpublished.
- **Showcase.** Winning papers will be highlighted at a Google-hosted event, "such as a NeurIPS expo workshop". The Tracks section says "a Google hosted expo during NeurIPS 2026".

### 2.2 Evaluation rubric (verbatim criteria, five equal weights, 0–5 each, final score = mean)

| Criterion | What the judges ask |
| :--- | :--- |
| **Novelty** | Does the work provide new insights, deepen understanding, or highlight important properties of existing methods? |
| **Quality** | How general and universal is the approach beyond the competition? Does it translate to other similar problems? How well does it generalize? |
| **Relevance** | Is there significance and/or potential impact on software engineering and agentic learning? |
| **Verifiability** | Does the paper give enough information to understand how the innovation works, and how data was obtained, analyzed and interpreted? |
| **Clarity** | Is the paper clearly presented and written? |

- The rubric score is **not shared** with entrants.
- Ties go to the paper "entered first". The host later said that several judges will score the top papers, that ties are "extremely unlikely", and that any tie-break would "likely be by original submission time" (forum 750338).
- If a potential winner is disqualified, the next-highest paper takes its place.

### 2.3 Submission requirements

**Required: a Kaggle Writeup** that works as the research paper. It must include:

1. Title and subtitle
2. Abstract
3. Introduction
4. Description of the research, including methods and experiments
5. Related work and citations

**Optional: Public Notebook.** Overview wording: "If you choose to submit code, your code should be submitted as a public notebook in the Project Links field… publicly accessible and not require a login or paywall. If you use a private Kaggle Notebook, it will automatically be made public after the deadline."

**Optional: Public Project Link.** Overview wording: "instead of writing your paper in the Kaggle Writeup, you can also upload an arXiv-ready (LaTeX/Word) PDF version of your paper using the Public Project Link feature… publicly accessible and not require a login or paywall."

**Mechanics.** Click **New Writeup** (Writeups tab) and **Save**. A **Submit** button then appears in the top-right corner. Drafts or unsubmitted writeups at the deadline **are not judged**.

**Other details**

- Scope: 3,000 words maximum, original and unpublished.
- Non-archival.
- If you attach a private Kaggle Resource (dataset, model or notebook) to your public Writeup, it becomes public automatically after the deadline.

### 2.4 Suggested topics (not exhaustive)

| Topic | Host description |
| :--- | :--- |
| Tuning & Optimization | Parameter-efficient fine-tuning and RL tailored to SWE-agent capabilities |
| Code Comprehension | Code-graph generation, parsing and embedding for deep repository comprehension |
| Tasks & Benchmarks | New tasks, evaluation datasets or resources about code structure, graphs and structured code generation |
| Graph Reasoning | Methods and architectures for LLM reasoning over large-scale graphs |

The host's welcome post (forum 743012) adds **Novel Applications**: "Creative use cases leveraging Gemma 4, DiffusionGemma, or code graphs beyond standard benchmarks."

### 2.5 Tracks and awards ($35,000 total)

| Award | Prize | What the host says qualifies |
| :--- | ---: | :--- |
| Overall Best Paper | $15,000 | Highest average across the five criteria |
| Best New Resource (dataset, library, etc.) | $10,000 | A new dataset, tool or software, as opposed to an empirical paper. Examples: a dataset built from the provided embeddings for evaluating or fine-tuning Gemma 4; a library that uses Gemma plus another algorithm to cluster code by behaviour; a dashboard to explore GitHub repos structurally similar to a target repo |
| Best New Application | $10,000 | A new use case, e.g. "using code-graphs for writing TPU kernels". Creative uses of code graphs and/or the provided embeddings; new evaluation datasets for new tasks; applying them to benchmarks other than the provided ones |

There is **one** submission pool. The judges decide eligibility for each prize. A paper can be considered for several awards but **can win only one** (forum 743255).

### 2.6 Citation block (from the Overview)

> Elan Markowitz, Bryan Perozzi, Benedek Rózemberczki, Glenn Cameron, Hadi Hemmati, Yuchen Li, Michael Galkin, Majid Farhadi, Ryan Holbrook, and Ashley Oldacre. *Google - The Gemma 4 Developer Agent Paper Track.* <https://www.kaggle.com/competitions/gemma-4-developer-agent-paper>, 2026. Kaggle.

**Intel value.** These names show the organizing group's research interests: Perozzi, Rózemberczki and Galkin are graph-ML researchers (Google Research graph-mining and GNN work). This fits the heavy emphasis on code graphs and graph reasoning. It is an inference that graph-centric work will resonate with this group, but the rubric itself is topic-neutral.

---

## 3. Hidden settings found through the API (not visible on the Overview)

| Setting (`GetCompetitionHackathonSettings`) | Value | Implication |
| :--- | :--- | :--- |
| `requireCardImage` | `true` | The Writeup form **requires a cover/card image** before you can submit. Prepare one: a title card or key figure |
| `requireLinks` | `true` | The form appears to **require at least one Project Link**, even though the Overview calls the notebook and PDF "optional". Plan to add at least one public link (Kaggle notebook, GitHub repo, dataset or arXiv/PDF). *Inferred from the flag; confirm in the editor* |
| `allowMultipleSubmissions` | `true` | Fits the "up to 2 final submissions" rule. But see the open issue below: the UI has blocked a second simultaneous submitted writeup |
| `showOverviewCitation` | `true` | The citation block is shown |

**Open issue (unresolved on the forum as of 05 Nov).** On 22 Oct, entrants reported that creating a second writeup shows the message *"You've already submitted to this competition. To submit this writeup, you'll first need to unsubmit your previous writeup."* (forum 743255, 753195). The host had confirmed that two writeups are allowed. So far there is no answer on how to have both submitted at once. **Plan around one primary writeup**, and treat a second as best-effort.

---

## 4. Main-competition data the prizes refer to ("provided embeddings", "code graphs")

The Best New Resource and Best New Application text refers to assets released with the **main** competition (`gemma-4-developer-agent`, Data tab):

- `tasks.jsonl`: **129 public development tasks** from `fastapi/fastapi`, `Textualize/rich`, `psf/requests` and `encode/httpx`, with `problem_statement`, `hints_text`, reference `patch`, `test_patch` and `base_commit`.
- `snapshots/`: 129 git working-tree archives frozen at `base_commit`.
- `graphs/`: NetworkX AST call/dependency graphs in node-link JSON. Nodes are fully qualified symbols with source `text`; edges are typed (e.g. `calls`). These graphs back the `get_code_neighbors` and `get_code_subgraph` agent tools.
- `embeddings/`: 256-dimensional float32 vectors per graph node (`.npz`). These back the `search_similar_code` tool.
- `wheels/`: offline dependency wheels for the sandbox.

**Data-use rules for papers** (from the host's forum rulings; details in report 02):

- Do **not** redistribute the competition files themselves.
- You **may** publish:
  - regenerated graphs and embeddings built from public upstream repositories
  - derived labels
  - agent traces, with citations and upstream licences
  - translations keyed by `instance_id` that link back to the original data

---

## 5. Rules tab — the parts that matter for a paper

### 5.1 Competition-specific rules

| Rule | Content | Practical meaning for a paper |
| :--- | :--- | :--- |
| §2.1 Team limits | Max 5 members. The team leader performs mergers; the merged team must not exceed the submission allowance | Form or merge teams early. One team per person |
| §2.2 Submission limits | 5 per day. Select up to 2 Final Submissions | Each Save→Submit counts. Do not spam resubmissions |
| §2.4 Competition data | Any use, commercial or not. **Must not redistribute** to non-participants | Publish derived artefacts, not raw task files (see the host rulings in report 02) |
| §2.5 Winner licence | Winners license the submission and its source code under an OSI-approved licence that allows commercial use. Exceptions for commercial software and incompatibly licensed data or models | Use Apache-2.0 or MIT for your code from the start |
| §2.5.b / §2.8 Winner obligations | You may need to deliver a reproducible description and a code repository with full instructions: architecture, preprocessing, loss, training details, hyper-parameters, environment | Keep a clean, reproducible repository *now*. It also raises your Verifiability score |
| §2.6 External data and tools | Allowed if publicly and equally accessible at minimal cost (the "Reasonableness Standard"). AutoML tools allowed with a proper licence | Cloud LLMs or tools with small subscriptions are fine. Do not use costly proprietary datasets |
| §2.7 Eligibility | Employees of Google, Kaggle and affiliates may enter but **cannot win prizes** | — |

### 5.2 Foundational rules (they override the specific rules if the two conflict)

- **Eligibility:** registered Kaggle user; 18 or older, or the age of majority (minors need guardian consent through Kaggle's consent forms; forum 743314); not in a sanctioned region.
- **One account per person.** Using multiple accounts means disqualification.
- **No private sharing** of competition code or data outside your team. Public sharing must happen on Kaggle (forum or notebooks) and is deemed OSI-licensed (§3.6.b). The host said **GitHub is fine** for sharing paper code (forum 751804).
- **Open-source code** you use must carry OSI licences that allow commercial use (§3.6.c). The host's view is that this covers *your* code, not sandbox test dependencies (forum 753871).
- **Warranty:** the work must be your own original work and must not infringe third-party IP.
- **Publicity:** the sponsor may use your name and likeness. Admins confirmed you can **opt out of photo publicity**, and that identity-verification photos are kept separate (forum 745326, 745712).
- **Winner paperwork:**
  - respond to the winner email within 1 week
  - return documents (tax forms W-9 or W-8BEN) within 2 weeks
  - payment arrives about 30 days later
  - team prizes are split evenly unless the team agrees otherwise
- **Attendance:** winners do not have to attend the NeurIPS event in person. Prize eligibility is unaffected (forum 749463).
- **Individuals** without a company can receive prizes (forum 745712).

---

## 6. Writeups and Code tabs (logged-out view)

- **Writeups tab:** shows only the **+ New Writeup** button (greyed out when logged out). Submitted writeups are **not publicly listed before the deadline**, so you cannot study competitors' papers until after 12 Nov.
- **Code tab:** 108 public notebooks. See report 03.
- **Data tab:** none. This competition has no dataset of its own; data comes from the main competition.

---

## 7. Implications and action items (as of 05 Nov, 7 days left)

1. **Submit an early, complete version within 48 hours**, then iterate. Unsubmitted drafts are not judged, and edits are allowed until the deadline.
2. **Prepare a card image** (required) and **at least one public project link** (likely required).
3. **Choose your primary artefact.** Either write in the Writeup body, or link an arXiv-ready PDF. If you link a PDF, the **PDF alone is judged**; use the Writeup body as an abstract (host ruling of 27 Oct in forum 743255).
4. **Stay under 3,000 words**, counting title, abstract, captions and tables. Figures and references do not count. The appendix is optional reading.
5. **Plan for one judged writeup.** A second writeup can be submitted simultaneously only if the UI allows it.
6. If you also compete in the main competition, you **do not have to publish code** (forum 752667). You can release a small dataset sample now and the full set after 2 Dec (forum 751413).


---

<!-- ====================================================================== -->
<!-- FILE: 02_Discussion_Intel_and_Host_Rulings.md -->
<!-- ====================================================================== -->

# 02 — Discussion Tab Intel and Host Rulings

**Source:** <https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion> (forum ID 12784402)
**Coverage:** all **49 topics** and every comment, from 2026-09-24 to 2026-11-05 21:08 UTC. Fetched through Kaggle's public internal API (`GetTopicListByForumId`, `GetForumTopicById`).
**Full text dump:** `scratch/paper_track_20261105/forum_dump.txt`. Raw JSON is in `scratch/paper_track_20261105/raw/`.

---

## 1. Forum at a glance

| Metric | Value |
| :--- | ---: |
| Topics | 49 (7 in Sep, 32 in Oct, 10 in Nov so far) |
| Topics with a host or admin reply | 18 |
| Host replies (Elan Markowitz) | 23 |
| Kaggle admin replies (Ashley Oldacre) | 2 |
| Team-finding topics | 5 |
| Pre-registration hash posts | 8 |
| Self-promotion or results posts | ~6 |

**Character of the forum.** It is mostly rules and eligibility Q&A, which the host answered in batches (29 Sep, 5 Oct, 27 Oct, 3–4 Nov). Two trends stand out: a growing number of **pre-registration hash commitments**, and entrants posting their open-source assets early.

---

## 2. Host rulings — the authoritative list

These are the clarifications that change how you write and package a paper. They are quoted or closely paraphrased from host (H) or admin (A) replies.

### 2.1 Submission format, length and judging

| # | Question | Ruling | Date | Topic |
| :---: | :--- | :--- | :--- | :--- |
| R1 | How many writeups per team? | "A team can submit at most two write-ups." There is one submission track; the judges decide prize eligibility. "Quality over quantity." | 29 Sep (H) | [743255](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743255) |
| R2 | Can one paper win several awards? | It can be *considered* for several but can win only one. If it wins Best Paper, it drops out of the Resource and Application prizes | 29 Sep (H) | 743255 |
| R3 | Are the Resource and Application prizes scored differently? | Same five criteria, "but in the context of that prize". Novelty, quality and relevance are judged as a resource or as an application | 29 Sep (H) | 743255 |
| R4 | Must I declare a track? | "All submissions are considered across all tracks but you are welcome to make it explicit" | 27 Oct (H) | [750338](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/750338) |
| R5 | What counts toward 3,000 words? | All "judged" text counts, including **title, abstract, captions and tables**. **Figures and references do not count.** There is no official word counter yet | 27 Oct (H) | 743255 |
| R6 | Appendix? | "Appendix will not be used for main evaluation so treat [it] as supplementary material… do not expect it to be read guaranteed." Include proofs, or shortened versions, in the main paper | 27 Oct (H) | [749546](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/749546), 743255 |
| R7 | PDF instead of the Writeup body? | "In the case of a PDF submission, we will just be judging the PDF as the writeup. Recommend using the Kaggle writeup as an abstract." The same word limit applies to the PDF | 27 Oct (H) | 743255 |
| R8 | Can I post to arXiv? | "Posting to ArXiv is totally fine! You can even submit a link to the ArXiv paper as your submission." The event is non-archival; parallel submissions are allowed | 5 Oct, 29 Sep (H) | [745872](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/745872), [743310](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743310) |
| R9 | Will judges run my notebook? | "The full pipeline does not need to run when doing run all. We will likely look at any code that is present, but running the code itself is not guaranteed… having a quick way to run your code sounds like a good idea" | 27 Oct (H) | 750338 |
| R10 | Tie-break timestamp? | Multiple judges score the top papers, so ties are "extremely unlikely". A tie-break would "likely be by original submission time" | 27 Oct (H) | 750338 |
| R11 | Is code required? | "The code itself is not a requirement for submitting the paper if you want to protect it until the main competition ends" | 27 Oct (H) | [752667](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/752667) |
| R12 | Who gets highlighted at NeurIPS? | Only prize winners are promised a highlight. The event is non-archival | 29 Sep (H) | 743310 |
| R13 | Must winners attend in person? | "Prize eligibility is unaffected" | 27 Oct (H) | [749463](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/749463) |

### 2.2 "Unpublished" and prior work

| # | Question | Ruling | Topic |
| :---: | :--- | :--- | :--- |
| R14 | Blog post plus a Kaggle Benchmark pilot, then an extended study? | "Definitely a valid submission, especially given the recency and extensions" | [745150](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/745150) |
| R15 | Public GitHub repo with notes and results since September? | "Prior github repo would not count as a prior publication." Eligible | [755867](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/755867) |
| R16 | arXiv preprint before the deadline? | Fine (R8) | 745872 |

### 2.3 Data release and licensing (key for Best New Resource)

| # | What you want to publish | Ruling | Topic |
| :---: | :--- | :--- | :--- |
| R17 | Graphs and embeddings regenerated from public upstream repos (not the official files) | Allowed "with appropriate licensing". The host explicitly confirmed one team's 152-graph Apache-2.0 dataset plan | 743255 |
| R18 | Agent run traces on public training tasks (they quote repo code and contain the agent's own patches) | "Yes, it can include such traces. Please cite and reference the upstream license" | 743255 |
| R19 | Derived localization labels (instance → files and functions edited) | "Yes, publishing derived labels is okay" | [749803](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/749803) |
| R20 | Machine translations of problem statements | Preferred: publish translations keyed by `instance_id`, and link to the original dataset (or ship a download script) for verbatim parts | 749803 |
| R21 | Delay the dataset release until the main competition ends | Allowed. Suggestion: release a small sample now (e.g. a 5% random sample) so the resource can be verified during judging | [751413](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/751413) |
| R22 | External dataset (e.g. Loc-Bench) and GitHub-only code | "Github should work for sharing code." External datasets are fine if you have the rights to evaluate on them | [751804](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/751804) |
| R23 | Harness wheels with no stated licence, called from a public notebook | "I believe a public notebook can call them as they are." The open-source rule covers *your* code, not sandbox test dependencies | [753871](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/753871) |
| R24 | Independent, blinded reviewers outside the team | "Should be fine… Just make sure they follow the licensing rules." No restriction on reporting aggregate results | [751403](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/751403) |

### 2.4 AI assistance, eligibility and publicity

| # | Question | Ruling | Topic |
| :---: | :--- | :--- | :--- |
| R25 | Codex or AI-assisted code and resources? | Coding assistants are "absolutely acceptable". **"Purely LLM generated 'slop' will not score well. However, if tastefully used, LLMs can improve the writing quality and clarity."** You are responsible for terms of service | [745712](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/745712) |
| R26 | Individuals without a company? | Yes, they can receive prizes (A) | 745712 |
| R27 | Photo, voice or on-camera privacy? | You can opt out of photo publicity. Identity-verification photos are kept separate from marketing. "Reasonable accommodations" are available for likeness (A) | [745326](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/745326), 745712 |
| R28 | Under 18? | Not answered by the host. A community answer points to Kaggle's two guardian-consent forms (13–17 eligible with consent; under 13 not allowed on Kaggle) | [743314](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743314) |
| R29 | 27 fastapi tasks cannot pass in the sandbox (missing `inline_snapshot` and `dirty_equals`) | "The scoring is done on private repos so does not include these tasks." The host suggested posting in the code-track forum | [753370](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/753370) |

---

## 3. Open or unanswered questions (as of 2026-11-05)

| Topic | Question | Status and recommended assumption |
| :--- | :--- | :--- |
| [753195](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/753195), 743255 | The UI blocks a second *submitted* writeup ("you'll first need to unsubmit your previous writeup") | **Unanswered.** Plan for one judged writeup |
| [754899](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/754899) | Intermediate deadlines, dataset freeze, what auto-selection picks, official harness | **Unanswered.** Assume there are no checkpoints, the mounted data is final, and you bring your own harness |
| [746168](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/746168) | Does the judged PDF version equal the version at the deadline? | **Unanswered.** Use a frozen, versioned link (arXiv vN, GitHub release tag, or Zenodo DOI) |
| [755176](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/755176) | Extend the deadline to align with 2 Dec? | **Unanswered.** Assume 12 Nov 23:59 UTC holds |
| [749202](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/749202) | Can papers use Gemma 4 E2B or E4B instead of 31B? | **Unanswered.** Nothing in the rules restricts model size, and several entrants use E4B |
| [751856](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/751856) | Which per-run results and instance IDs a public notebook may include | Not answered directly, but R18 and R19 imply that traces and derived labels are fine |
| [748747](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/748747) | Does an earlier teaching notebook count as prior publication? | Not answered directly. R14 and R15 suggest it does not, if the paper adds new evidence |
| 749546 (follow-up) | Do captions count? | Answered in 743255: yes |

---

## 4. What competitors are doing (signals about the field)

### 4.1 Themes visible from forum posts and notebooks

| Theme | Examples (forum or notebook) | Read-across |
| :--- | :--- | :--- |
| **Bug localization over code graphs** | codegraph-loc (746035); model-free localization benchmark on 129 tasks (748395): embeddings Hit@5 25.6%, RRF 30.8%, edit site within 2 hops in 47.9% of tasks; "Where Is the Bug?" (E4B) | The most crowded theme. Novelty must come from a sharper insight, not just "graph helps" |
| **Benchmark integrity and harness audits** | 27 unpassable fastapi tasks (753370); "Systems Autopsy"; "BudgetAudit"; "Found Is Not Fit"; graph-tools audit; async omission in the provided graphs (750732) | Audits score well on Verifiability and "highlight important properties of existing methods" (Novelty wording) |
| **Loop and context management** | Trap-25 / Counterfactual Context Reset (751430); "Selective restarts"; "ThoughtKeep"; thinking-budget tuning | Many claim very large gains. Rigour and controls will separate entries |
| **AST-guided verification and self-repair** | AGVA (754697); A2-DASC (752268/752271); CodeGuardian (748973); PhaseGuard-AST | Crowded; risk of looking generic |
| **Post-training (SFT, RL, distillation)** | Trajectory dataset of 3,586 SWE-rebench runs converted to harness format (748627); GRPO tool-calling notebook; QAT paper pre-registration (747862) | Fewer entries than inference-time work. Room for careful PEFT/RL studies |
| **Resources** | gemma4-swe-kit plus a trajectory dataset (748627); 152 regenerated graphs plus embeddings (743255); Trap-25 dataset; translations of task statements (749803) | Best New Resource is clearly contested |
| **Pre-registration** | 8 hash-commitment posts (747862, 750732, 754667, 754918, 755607, 755652, 756259, 756281) | A strong rigour signal. One post (754667) openly discloses a *late* disclosure. This shows how to report deviations honestly |

### 4.2 Credibility red flags seen in public posts (lessons, not accusations)

Several public posts make claims a careful judge would question. They are useful as **"don't do this" examples**:

- **Very large headline gains from small samples**, e.g. "96% vs 16%" on 25 tasks, or "+116%" without confidence intervals, seeds or task lists.
- **Inconsistencies with the official data.** One "starter notebook" reports 15 `sympy/sympy` tasks, but the official data description lists only fastapi, rich, requests and httpx.
- **Non-reproducible links.** One duplicated post has a code link that is just `https://github.com`.
- **Pasted marketing tone** (emoji headers, "Usability 10.00", requests for upvotes) instead of a scientific argument.
- **Comparisons with outdated frontier models** and unverifiable contamination claims ("Contamination checks confirmed no overlap…" with no method given).

### 4.3 Team-finding

Five team-search threads exist, mostly from students and academics. The team limit is 5. Mergers must happen before the deadline, and the merged team must fit the submission allowance.

---

## 5. Timeline of host activity

| Date | Host activity |
| :--- | :--- |
| 24 Sep | Welcome post (743012). Adds "Novel Applications" and DiffusionGemma to the topics |
| 29 Sep | First batch: two writeups per team, cross-award eligibility, regenerated graphs (tentative), non-archival |
| 5 Oct | arXiv fine; extended pilot study valid; AI-assistance and "slop" warning; admin publicity answers |
| 27 Oct | Big batch: word count, appendix, PDF judging, code optional, tie-break, notebook run-all, data-release confirmations, in-person attendance |
| 3–4 Nov | Translations, wheel licensing, sandbox tasks, prior GitHub repo not a publication |

**Pattern:** the host answers in weekly batches. Questions posted after about 5 Nov may not be answered before the deadline.


---

<!-- ====================================================================== -->
<!-- FILE: 03_Code_Tab_Intel.md -->
<!-- ====================================================================== -->

# 03 — Code Tab Intel

**Source:** <https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/code>
**Coverage:** all **108 public notebooks** linked to this competition as of 2026-11-05. Fetched through Kaggle's `ListKernels` API, sorted by `HOTNESS` and `DATE_CREATED`.
**Raw files:** `scratch/paper_track_20261105/kernels_HOTNESS.json`, `kernels_DATE_CREATED.json`

---

## 1. Summary

- **Low engagement.** Only one notebook has more than 11 votes, and that one (49 votes) is an overview of the *main* competition. The most-voted notebook written specifically for the Paper Track has **5 votes**. There is no community "starter" notebook in the usual Kaggle sense.
- **Most notebooks are paper companions:** "reproduction", "replay", "audit", "registration" or "code and data" notebooks. They exist to support Verifiability, which matches the host's hint that judges "will likely look at any code that is present" (forum 750338).
- **Many notebooks were created after mid-October**, and a burst appeared in the last week. Expect the number to double near the deadline, because private notebooks attached to writeups become public automatically after the deadline.
- Several notebooks are **unnamed defaults** (`notebookXXXX`). Treat them as noise.

---

## 2. Most-voted notebooks

| Votes | Views | Created | Title | Author | Notes |
| ---: | ---: | :--- | :--- | :--- | :--- |
| 49 | 2,408 | 2026-09-24 | [Google - The Gemma 4 Developer Agent Competition](https://www.kaggle.com/code/manuelgagofernandez/google-the-gemma-4-developer-agent-competition) | manuelgagofernandez | Main-competition overview, cross-linked |
| 11 | 680 | 2026-09-29 | [Gemma 4 LB: 58 Tasks, Bronze Is a 124-Team Tie](https://www.kaggle.com/code/dariushafshar/gemma-4-lb-58-tasks-bronze-is-a-124-team-tie) | dariushafshar | Leaderboard analysis |
| 5 | 323 | 2026-10-02 | [Gemma 4 Agent Research Artifact](https://www.kaggle.com/code/jek1wantaufik/gemma-4-agent-research-artifact) | jek1wantaufik | Paper artefact |
| 4 | 232 | 2026-10-20 | [TRACE: Test-Guided Repository Exploration](https://www.kaggle.com/code/jocelyndumlao/trace-test-guided-repository-exploration) | jocelyndumlao | Method companion |
| 4 | 389 | 2026-09-27 | [Gemma 4 Dev Agent Paper](https://www.kaggle.com/code/jefferyjeromeharris/gemma-4-dev-agent-paper) | jefferyjeromeharris | Paper companion |
| 3 | 61 | 2026-11-05 | [Gemma 4 Developer Agent Paper Starter Notebook](https://www.kaggle.com/code/pablodiegoo/gemma-4-developer-agent-paper-starter-notebook) | pablodiegoo | Not a starter. It is a dense paper abstract (see §4) |
| 3 | 179 | 2026-10-01 | [Gemma 4: A 16384 Output Cap Refuses Long Prompts](https://www.kaggle.com/code/dariushafshar/gemma-4-a-16384-output-cap-refuses-long-prompts) | dariushafshar | Harness finding |
| 3 | 181 | 2026-10-02 | [Token-Insulated Compound Agent Graphs for Gemma-4](https://www.kaggle.com/code/manderson240/token-insulated-compound-agent-graphs-for-gemma-4) | manderson240 | Method |
| 2 | 146 | 2026-10-16 | [Easy RLAIF GRPO 12B on Gemma 12B Tool Calling](https://www.kaggle.com/code/kevlarzanderchi/easy-rlaif-grpo-12b-on-gemma-12b-tool-calling) | kevlarzanderchi | RL post-training |
| 2 | 54 | 2026-10-22 | [AST-Compressed Code Graphs for Gemma 4 Agents](https://www.kaggle.com/code/maroofiums/ast-compressed-code-graphs-for-gemma-4-agents) | maroofiums | Code graphs |
| 2 | 51 | 2026-10-28 | [CRAG - Code-Graph Routed Memory for Offline Gemma](https://www.kaggle.com/code/priyachauhan369/crag-code-graph-routed-memory-for-offline-gemma) | priyachauhan369 | Code graphs plus memory |
| 2 | 55 | 2026-10-30 | [BudgetAudit - Held-out Context Evidence Audit](https://www.kaggle.com/code/salahibrahiemu/budgetaudit-held-out-context-evidence-audit) | salahibrahiemu | Audit |

Votes and views are as of 2026-11-05. Low vote counts mean popularity is **not** a quality signal here.

---

## 3. Notebook landscape by theme (108 notebooks)

| Theme | Approx. count | Representative notebooks |
| :--- | ---: | :--- |
| Reproduction / replay / "code and data" companions | ~25 | "Reproduce paper table", "How Far Off Replay Full Run", "PM-1 Replay v1/v2", "selective-restarts-reproduction", "Name the Method at Its Code: code and data", "Loc32K reproduction notebook" |
| Code-graph localization and retrieval | ~18 | [Code-Graph Bug Localization Benchmark](https://www.kaggle.com/code/alikalwar/code-graph-bug-localization-benchmark-gemma-4-pap) (linked from forum 748395), GraphFault, BudgetGraph, Code-KGR, GraphSlicing, NeuroCode, CodeGraph-Steiner, "Localising Before Patching" |
| Audits of budget, harness, context and tools | ~10 | "Found Is Not Fit: CPU Context Budget Audit", "Budget Feasibility Audit", "Gemma 4 graph tools audit", "Systems Autopsy", "Gemma 4 agent evaluation audit" |
| Pre-registration notebooks | ~5 | `thoughtkeep-analysis-registration-v1`, `selective-restarts-analysis-registration-v3/v4` |
| Loop detection and context reset | ~5 | Loop Breaker CCR / Trap-25, "Detecting SWE Agent Action Loops with Jaccard", "Optimizing W4A16 Thinking Budgets" |
| AST verification and self-repair | ~6 | AST-Guided Loops Verification, AST Fault Localization, PhaseGuard-AST, "Every Answer Must Run" |
| Test selection | 2 | "Can Gemma 4 Choose Which Tests to Run?" plus its reproduction |
| Post-training (SFT, RL, LoRA, distillation) | ~4 | GRPO tool calling, "Nullspace LoRA Surgeon", "Sovereign SWE Dual-Node Distillation" |
| Off-topic (mobile, edge, Android) | ~10 | One author's series on Android chroot, Mali GPU and abliterated LLMs. Weak relevance to the rubric |
| Untitled or default names | ~10 | `notebookXXXX` |

Counts are approximate, from a manual classification of titles.

---

## 4. What the best companion notebooks do (patterns to copy)

From the notebooks inspected and the forum posts that link to them:

1. **CPU-only, fast run-all.** For example, the localization benchmark (forum 748395) runs end to end on CPU in about 8 minutes and produces a per-task CSV, bootstrap CIs and an ablation. This fits the host's "quick way to run your code" comment.
2. **Per-task results files** with stable IDs (task-level CSV or JSONL), so a judge can check any number in the paper.
3. **Replay instead of rerun.** Store logged trajectories and recompute the tables from them. Expensive GPU agent runs stay optional.
4. **Frozen analysis plus a hash.** The registration notebooks print the SHA-256 of the analysis plan, which ties the notebook to the forum pre-registration post.
5. **Explicit statement of the data policy** ("No competition data is redistributed").

**Anti-pattern.** The "Paper Starter Notebook" packs a whole paper's numbers into one dense abstract with many digits per sentence. It also cites a repository (`sympy`) that does not appear in the official task list. Dense, over-precise claims that conflict with known facts hurt both **Clarity** and **Verifiability**.

---

## 5. Implications for your entry

- A **public, fast, CPU-runnable companion notebook** is cheap to make, and it is what the active competitors are converging on. It is the most direct way to raise Verifiability.
- **Don't compete on popularity.** Votes are not part of the rubric, and the Code tab gets little traffic.
- If you also compete in the main competition and want to protect your agent until 2 Dec, publish an **analysis-only notebook** (logged results → tables and figures) and hold back the agent code (allowed under forum 752667).


---

<!-- ====================================================================== -->
<!-- FILE: 04_How_To_Writeup_Public_Notebook_and_Project_Link.md -->
<!-- ====================================================================== -->

# 04 — How To: Writeup, (Optional) Public Notebook and (Optional) Public Project Link

This is a step-by-step guide for the Paper Track. It is grounded in Kaggle's official docs, Kaggle staff announcements, the Paper Track Overview, and the identical wording on sibling Kaggle hackathons from 2026.

**Labelling rule used below.**
- **[V]** = verified from an official Kaggle or host source.
- **[I]** = inferred. Check it in the editor.

Kaggle's Writeup editor needs a login, and this research was done logged out. Read the UI labels below as "as documented", and confirm them on screen.

---

## 0. What the Overview actually asks for

> **(Optional) Public Notebook:** "If you choose to submit code, your code should be submitted as a public notebook in the Project Links field. Your notebook should be publicly accessible and not require a login or paywall. If you use a private Kaggle Notebook, it will automatically be made public after the deadline."
>
> **(Optional) Public Project Link:** "Optionally, instead of writing your paper in the Kaggle Writeup, you can also upload an arXiv-ready (LaTeX/Word) PDF version of your paper using the Public Project Link feature. It should be publicly accessible and not require a login or paywall."

Two facts change how "optional" these are:

1. The competition's hackathon settings (API `GetCompetitionHackathonSettings`) show `requireLinks: true` and `requireCardImage: true`. **Expect the form to require at least one Project Link and a cover image.** [V for the flags; I for how the form enforces them]
2. Host ruling (forum 743255, 27 Oct): if you supply a PDF, *"we will just be judging the PDF as the writeup. Recommend using the Kaggle writeup as an abstract."* [V]

---

## 1. Anatomy of a Kaggle Writeup (the editor)

| Editor area | What goes there | Status | Source |
| :--- | :--- | :---: | :--- |
| Title and Subtitle | Paper title and one-line subtitle | V | Kaggle docs "How to Create a Writeup"; Paper Track Overview |
| Body (Markdown) | The paper: abstract, introduction, method, experiments, related work, citations. All Kaggle content is Markdown, so pasted Word text may need cleanup | V | Kaggle docs (competitions) |
| **Track** selector | "You must select a Track for your Writeup in order to submit." The Paper Track has **one** track: *"Total Prizes Available"* (track ID 7317), which covers all three awards | V | Kaggle docs; Gemma 4 Good and ARC Paper Track Overviews; API `ListHackathonTracks` |
| **Media Gallery** | Images and videos. "A cover image is required to submit your Writeup." | V | Gemma 4 Good and ARC Prize 2026 Paper Track Overviews (identical text) |
| **Attachments → Project Links** | Public URLs: a Kaggle notebook, GitHub repo, Kaggle dataset, arXiv/Zenodo PDF. GitHub and Hugging Face links render as "rich embedded cards" | V | Gemma 4 Good Overview; "Introducing Writeups!" (Kaggle staff, 2025-07-30) |
| **Attachments → Files** | Uploaded files ("If you are providing files… under 'Files'") | V (sibling hackathon) / I (Paper Track) | Gemma 4 Good Overview |
| DOI Citation → **Generate DOI** | Mints a DOI for a *published* writeup. As of 2026-06-08 this covered competition-solution and project writeups, "with support for Hackathon Writeups coming soon" | V / unknown for this track | "DOIs for Competition and Project Writeups" (Kaggle staff, 2026-06-08) |
| **Save** → **Submit** (top right) | Save first, and the Submit button appears. Unsubmitted drafts are not judged | V | Paper Track Overview |

No official pixel size or aspect ratio for the cover image was found. A 16:9 landscape image of at least 1200×675 px is a safe [I] choice: a title card or your key figure.

---

## 2. Creating and submitting the Writeup (step by step)

1. **Join the competition.** Open <https://www.kaggle.com/competitions/gemma-4-developer-agent-paper> → **Join Hackathon** → accept the rules. [V]
2. **(Teams)** Form your team before submitting. Everyone competes as a team, even a team of one. The **Team Leader** has the edit rights. [V, Kaggle docs]
3. Open the **Writeups** tab and click **+ New Writeup**. [V; button seen on the tab 2026-11-05]
4. Fill in **Title** and **Subtitle**, then write or paste the body in Markdown. If your main artefact is a PDF, make the body a short abstract plus a link list (§4). [V/host ruling]
5. Under **Track**, select **"Total Prizes Available"**. [V]
6. In the **Media Gallery**, upload a **cover image** (required). You can add figures and a short demo video if useful. [V]
7. Under **Attachments → Project Links**, add the public URLs: your notebook (§3), repository, dataset and PDF (§4). Under **Attachments → Files**, optionally upload the PDF itself as a backup. [V/I]
8. Click **Save**. Then click **Submit** (top right). [V]
9. **Verify while logged out.** Open every link in a private or incognito window and confirm that none needs a login. [V requirement; method I]
10. **Iterate safely.** On sibling hackathons, a writeup "can be un-submitted, edited, and re-submitted as many times as you'd like" [V there; I here]. Each submission counts toward the 5-per-day limit (Rules §2.2). **Make sure it is in the *Submitted* state when the deadline passes.** The host said a tie-break would "likely" use the *original* submission time, so submit early (forum 750338).
11. **Second writeup?** The rules and the host allow 2 per team. But entrants report the UI blocks a second *submitted* writeup ("you'll first need to unsubmit your previous writeup") — forum 753195, still unanswered. Plan for one.

---

## 3. (Optional) Public Notebook — create it and link it

### 3.1 Create the notebook

1. **Create → New Notebook.** You can also start from the competition's **Code** tab ("New Notebook"). [V, Kaggle docs: Notebooks]
2. **Attach inputs.** In the right-hand **Input** pane, click **Add Input** and pick:
   - competition data: the *main* competition `gemma-4-developer-agent`, which holds the tasks, graphs and embeddings (requires accepting that competition's rules)
   - your datasets
   - models such as Gemma 4 on Kaggle Models
   - other notebooks' outputs

   [V]
3. **Settings pane**
   - **Accelerator:** None (CPU) / GPU T4 ×2 / GPU P100 / TPU. Changing it restarts the session.
   - GPU quota: about 30 h per week, sometimes higher. Session limit: 12 h on CPU or GPU, 9 h on TPU. Output: 20 GB in `/kaggle/working`.
   - **Internet:** on or off. A notebook that runs offline is a plus for an "offline agent" paper.

   [V, Kaggle docs: Notebooks and Efficient GPU Usage]
4. **Secrets** (only if you need API keys): **Add-ons → Secrets**, then `from kaggle_secrets import UserSecretsClient`. Never hard-code keys in a public notebook. [partly V: a Kaggle staff comment on GitHub]

### 3.2 Make it judge-friendly (recommended structure)

| Cell group | Content | Why it helps |
| :--- | :--- | :--- |
| 0. Header (Markdown) | Paper title, link to the writeup or PDF, licence, data policy ("no competition data redistributed"), expected runtime | Clarity; compliance |
| 1. Environment | Pinned versions, seed, hardware note | Verifiability |
| 2. Fast path (default) | Load logged results (CSV or JSONL) → regenerate **every table and figure** in the paper in under 10 min on CPU | Host: "having a quick way to run your code sounds like a good idea" (forum 750338) |
| 3. Full path (flag, off by default) | Optional heavy rerun: agent runs, training. Set with `RUN_FULL = False` | The host said the full pipeline does not need to run on Run All |
| 4. Integrity checks | SHA-256 of frozen analysis plans and data files; assertion that the numbers match the paper | Verifiability; ties to any pre-registration post |

### 3.3 Commit and publish

5. **Save Version → Save & Run All (Commit).** This runs top to bottom in a clean session, so the saved version contains real outputs. *Quick Save* stores a snapshot without running. Viewers see the latest version. [V]
6. **Make it public.** Use **Share** (or **File/Options → Sharing**) and change Private → **Public**. [V that sharing lives there; I for the exact toggle label]
   API alternative: set `"is_private": "false"` in `kernel-metadata.json` and run `kaggle kernels push`. [V, Kaggle/kaggle-api docs]
7. **Copy the URL** (`https://www.kaggle.com/code/<user>/<slug>`). In the Writeup, paste it under **Attachments → Project Links**. [V]
8. **If you want to keep code private until the main competition ends (2 Dec):** you may leave the notebook out. "The code itself is not a requirement" (forum 752667). Any *private* Kaggle notebook you attach becomes public automatically after the 12 Nov deadline. **Do not attach a private notebook you need to keep secret.** [V]

### 3.4 Optional: a public Kaggle Dataset for a resource paper

- **Datasets → New Dataset** → title, slug, upload → **Create Dataset**.
- Set visibility in **Sharing** (Private is the default; choose Public).
- Pick a licence from the dropdown (e.g. CC BY 4.0, CC0, or "Other").
- **Generate a DOI** from the dataset's Metadata tab. Each new version gets its own DOI.

[V, Kaggle docs: Datasets; Kaggle DOI announcement 2019]

The host allows publishing regenerated graphs and embeddings, derived labels and traces **with upstream licence notices**. You can also publish only a **~5% sample** now and the full set after 2 Dec (forum 743255, 749803, 751413).

---

## 4. (Optional) Public Project Link — the arXiv-ready PDF route

### 4.1 Choose where the PDF lives (it must be public, with no login)

Today is 5 Nov and the deadline is 12 Nov 23:59 UTC.

| Host | Login to view? | Frozen version / DOI | Timing risk | Verdict |
| :--- | :---: | :--- | :--- | :--- |
| **Zenodo** (Publication → Preprint, CC BY 4.0) | No | Files and DOI are **immutable** after publishing. Each new version gets a new DOI. A DOI can be reserved before publishing | Instant on publish. Non-institutional accounts may be "unverified" and hidden from search, but the link still works | **Primary.** Link the *version* DOI |
| **GitHub release** (immutable releases on) | No; the PDF renders in the browser | Tag and assets are locked. A commit-SHA permalink pins the file | Instant | **Mirror / backup** |
| Kaggle Writeup → Attachments → Files | No (once the writeup is public) | Tied to the writeup | Instant | Good extra backup [I] |
| **arXiv** | No | Versioned (vN); licence choice is irrevocable | **High.** See §4.2 | Only as an extra, if you are already endorsed |
| Google Drive "Anyone with the link" | No | None; the file can be swapped | Instant | Avoid as the only link |
| Overleaf view link | Unclear | Live project, changes as you edit | — | Avoid |
| OSF Preprints | No (after acceptance) | DOI per version | Moderation time not guaranteed | Too slow |

Sources: Zenodo help (reserve DOI, versioning, record immutability); GitHub Docs (permanent links, immutable releases, non-code files); Google Drive help; OSF FAQ; all accessed 2026-11-05.

### 4.2 arXiv timing for this deadline (checked 2026-11-05)

- **Endorsement got stricter on 21 Jan 2026.** An institutional email alone no longer qualifies a new author. Without an existing claimed paper in the same domain, you need a **personal endorsement** from an established author. (arXiv blog, 2026-01-21 — verified.)
- **TeX source is expected.** "A PDF file created from a TeX/LaTeX file will typically be rejected." (arXiv help, submit_pdf — verified.)
- **Moderation** takes "one to four days… sometimes longer". The arXiv ID and DOI exist **only after announcement**. (arXiv help, availability — verified.)
- **Holiday.** arXiv's 2026 holiday list includes **Wednesday 2026-11-11** (verified). The resulting schedule (inferred from arXiv's announcement pattern, all times ET = UTC−5):

| Submit before (ET) | Announced (ET) | Announced (UTC) | OK for deadline? |
| :--- | :--- | :--- | :---: |
| Fri 6 Nov, 14:00 | Sun 8 Nov, 20:00 | Mon 9 Nov, 01:00 | Yes |
| Mon 9 Nov, 14:00 | Mon 9 Nov, 20:00 | Tue 10 Nov, 01:00 | Yes |
| Tue 10 Nov, 14:00 | Tue 10 Nov, 20:00 | Wed 11 Nov, 01:00 | Last chance |
| Thu 12 Nov, 14:00 | Thu 12 Nov, 20:00 | Fri 13 Nov, 01:00 | **No (~1 h late)** |

Any moderation hold makes arXiv miss the deadline. **Never make arXiv your only link.**

### 4.3 Recommended fastest safe path

1. **Write in LaTeX.**
   - Use the **NeurIPS 2026 style with `[preprint]`**: official kit at `media.neurips.cc/Conferences/NeurIPS2026/Formatting_Instructions_For_NeurIPS_2026.zip`. It prints "Preprint. Work in progress." and does not claim acceptance.
   - Or use the neutral **arxiv-style** template (`github.com/kourgeorge/arxiv-style`).
   - Keep the TeX source ready in case you also go to arXiv.
2. **Check the word count (3,000 maximum; title, abstract, captions and tables count; figures and references do not).**
   - `texcount -inc -sum main.tex` (bibliography is excluded by default; confirm table cells are counted with `texcount -v -html`).
   - Cross-check: `pdftotext -l <last page before References> paper.pdf - | wc -w`.
3. **Publish the PDF on Zenodo** by about 10 Nov and copy the **version DOI** link (`https://doi.org/10.5281/zenodo.<id>`). Do not submit it to a Zenodo community, which would wait for curator approval.
4. **Mirror it** as an asset on an **immutable GitHub Release** (e.g. tag `paper-v1.0`).
5. In the Kaggle Writeup:
   - **Body:** title, subtitle, a 150–250-word abstract, and the line "The judged paper is the PDF linked below (Zenodo DOI …)", plus links to the code and data.
   - **Attachments → Project Links:** Zenodo DOI, GitHub release URL, public notebook, dataset.
   - **Attachments → Files:** the PDF (backup).
   - **Media Gallery:** cover image.
6. **Submit**, then open every link logged out.
7. **Optional:** submit to arXiv before Fri 6 Nov or Tue 10 Nov at 14:00 ET, if you are already endorsed. If it appears in time, add the `arxiv.org/abs/…` link.

**Version freeze.** One open question asks whether judges read the PDF as it stood at the deadline (forum 746168, unanswered). Immutable links (a Zenodo version DOI or a GitHub release tag) remove the ambiguity. Avoid linking a branch or Drive file that you keep editing.

---

## 5. Pre-submission checklist

| # | Check | Done |
| :---: | :--- | :---: |
| 1 | Writeup has title, subtitle, abstract, introduction, method/experiments, related work and citations | ☐ |
| 2 | Judged text ≤ 3,000 words (title, abstract, captions and tables counted; figures and references excluded) | ☐ |
| 3 | Track "Total Prizes Available" selected | ☐ |
| 4 | Cover image in the Media Gallery | ☐ |
| 5 | At least one Project Link; every link opens logged out | ☐ |
| 6 | Notebook committed with **Save & Run All** and set to **Public**; fast path under 10 min | ☐ |
| 7 | PDF (if used) on an immutable, versioned host; the writeup body says the PDF is the judged paper | ☐ |
| 8 | No raw competition files redistributed; upstream licences cited; code licensed Apache-2.0 or MIT | ☐ |
| 9 | Writeup state = **Submitted** (not draft) well before 12 Nov 23:59 UTC | ☐ |
| 10 | Private resources attached? Accept that they become public after the deadline | ☐ |


---

<!-- ====================================================================== -->
<!-- FILE: 05_Winning_Whitepaper_Guide_Judging_Dos_Donts_Tips.md -->
<!-- ====================================================================== -->

# 05 — How to Write a Winning Paper: Judging Criteria, Do's and Don'ts, Tips

**Scope:** practical guidance for the Gemma 4 Developer Agent Paper Track. The paper is at most 3,000 words and scored 0–5 on five equally weighted criteria. It draws on:

- the competition's own rubric and host rulings (reports 01–02)
- the official NeurIPS reviewer guidelines and paper checklist
- the ARC Prize paper-award rubric
- the Pineau reproducibility checklist
- well-known paper-writing guides
- 2024–2026 research on agentic-SWE evaluation pitfalls

Sources are listed in §9. Items marked *(single source)* rest on one source or a search summary.

---

## 1. Decoding the rubric: where each criterion's wording comes from

The five criteria are not ad hoc. Two of them are **copied word for word** from established review rubrics. I checked both against the original pages on 2026-11-05.

| Paper Track criterion | Wording origin | What that origin tells you the judges value |
| :--- | :--- | :--- |
| **Novelty**: "new insights, deepen understanding, or highlight important properties of existing methods" | **NeurIPS 2025/2026 Reviewer Guidelines, "Originality"** (identical first sentence) | NeurIPS continues: "originality does not necessarily require introducing an entirely new method". Novel insight from *evaluating existing methods*, or better efficiency, is "equally valuable". It also asks: "Is it clear how this work differs from previous contributions, with relevant citations?" |
| **Quality**: "How general and universal is the Submission approach beyond the competition? Does your submission translate to other similar problems? How well does your method generalize?" | **ARC Prize 2026 Paper Track, "Universality"** (identical text). That rubric uses the same 0–5 average and the same tie rule | Generality and transfer, not leaderboard rank. In ARC Prize 2024 and 2025, paper-award winners were *not* the leaderboard leaders. 2025's first-place paper used a 7M-parameter model |
| **Relevance**: significance and potential impact on SE and agentic learning | Close to NeurIPS "Significance" ("Are others likely to use the ideas or build on them?… unique data, unique conclusions about existing data") | Show who will use it and why it matters for local or offline coding agents |
| **Verifiability**: enough information to understand how the innovation works and how data was obtained, analyzed and interpreted | Mirrors the NeurIPS Paper Checklist (reproducibility, statistics, compute, open code and data) and Pineau's checklist | Concrete protocol, error bars, compute, code and data links, licences |
| **Clarity** | NeurIPS "Clarity": "a superbly written paper provides enough information for an expert reader to reproduce its results" | Structure, readable figures, no jargon soup |

**What this means for strategy**

1. You can score high on Novelty **without a new method**. Careful evaluation, auditing or explaining *why* existing methods work or fail all count, and many forum entrants are doing exactly this.
2. Quality means generalization. Demonstrate it: a held-out repository, a second model size (E4B vs 31B), or a second benchmark.
3. Your main-competition leaderboard score is not a criterion. An unscored entrant can still win with a strong "why it works" insight.

---

## 2. What each award rewards

The host ruled (forum 743255) that the **same five criteria** apply to every award, "in the context of that prize". All submissions are considered for every award, and each paper can win only one.

| Award | Novelty means… | Quality means… | Relevance means… | Extra verifiability expectations |
| :--- | :--- | :--- | :--- | :--- |
| **Overall Best Paper** ($15k) | New knowledge: insight, explanation, method | Findings transfer beyond the 129 tasks and 4 repos | Changes how people build small local SWE agents | Strong statistics, ablations, held-out evaluation |
| **Best New Resource** ($10k) | A dataset, tool or library that did not exist before | Reusable beyond this competition (other repos, models, tasks) | Others will plausibly adopt it | Public hosting; datasheet or data card; licence; loader code; Croissant metadata (Kaggle and Hugging Face generate it automatically); usage example; baseline numbers |
| **Best New Application** ($10k) | A new use case for code graphs or embeddings (host example: code graphs for writing TPU kernels) | Works on a benchmark or domain other than the provided one | Clear value for real users | An end-to-end demo, plus an analysis of *why* the method combination works (NeurIPS "use-inspired" guidance) |

---

## 3. Per-criterion playbook

### 3.1 Novelty (0–5)

- **State the delta explicitly.** End the introduction with 3–4 bulleted, *refutable* contributions, each pointing to the section that supports it (Peyton Jones; Widom).
- **Position against the closest 4–6 works by name**, for example SWE-agent, Agentless, AutoCodeRover, Reflexion, LocAgent, CodeRAG and SWE-Gym. Say what is new for each. Leave out lengthy surveys.
- Valid forms of novelty: a rigorous replication, a well-analyzed negative result, an audit that reveals a hidden property, or a new combination with a stated rationale (NeurIPS 2026).
- **Framing matters.** The same result can read as arrogant or as modest and incremental, depending on how you frame it (Nanda, 2025).

### 3.2 Quality / generality (0–5)

- **Show transfer** with at least one of these:
  - a held-out repo or task family
  - a second model size
  - an external benchmark (SWE-bench Lite/Verified subset, Loc-Bench, SWE-rebench)
  - a second language or framework
- **Use strong, tuned baselines.** Simple retry or "warming" baselines often match elaborate agents at lower cost (Kapoor et al., 2024).
- **Attribute the gains with ablations.** Do not credit the architecture for gains that came from tuning (Lipton & Steinhardt, 2018).
- Discuss **when the method fails**. NeurIPS asks whether authors are "careful and honest about evaluating both the strengths and weaknesses".

### 3.3 Relevance / significance (0–5)

- Tie the result to the competition's mission: **capable coding agents offline on consumer hardware.**
- **Report accuracy together with cost**: tokens, wall-clock time, GPU type, VRAM, ideally as a Pareto plot. "AI agent evaluations must be cost-controlled" (Kapoor et al., 2024).
- Say who benefits and how they would use it. For a resource, describe two or three concrete downstream uses.

### 3.4 Verifiability (0–5)

Use this as a minimum checklist, condensed from the NeurIPS checklist, Pineau v2.0 and the Papers with Code checklist:

| Item | What to state |
| :--- | :--- |
| Data provenance | Which tasks or repos and which commits; how the data was collected; exclusions, with counts and reasons |
| Splits | Development vs held-out; how held-out tasks were chosen; frozen in advance (a dated hash is a bonus) |
| Runs and variance | n runs per condition (≥3 seeds); mean ± SE or bootstrap 95% CI; **source of variance named**; paired comparisons on the same task IDs |
| Model and decoding | Exact checkpoint (e.g. `gemma-4-31b-it-qat-w4a16`), quantization, serving stack and version, temperature, max tokens, thinking budget |
| Compute | GPU type and count, hours per run and in total; whether the whole project used more compute than reported |
| Code | Public repo or notebook; exact commands; environment pins; a README table that maps commands to paper numbers |
| Assets and licences | Licence of each upstream asset (repos MIT/BSD/Apache) and of your release; "no competition data redistributed" |
| Evaluation integrity | Manual or differential audit of a sample of "resolved" patches (false-pass rate); leakage check (is the fix hinted in the issue?) |
| LLM use | Disclose where LLMs were used in the method and in writing |

**Agentic-SWE statistics, in one paragraph.**

- Single-run pass@1 on SWE-bench Verified varies by about **2–6 percentage points** across runs, even at temperature 0. Gains of 2–3 pp can be noise (Bjarnason et al., 2026).
- Weak tests and solution leakage inflate resolve rates. SWE-bench+ found that about a third of "successes" leaked the solution through the issue text, and about a third passed only because tests were weak (Aleithan et al., 2024). PatchDiff found 29.6% of plausible patches behave differently from the gold patch (Wang et al., 2025).
- With roughly 100–129 tasks, your CIs will be wide. Say so, and use paired tests.
- **Competition-specific integrity facts you can cite:**
  - 27 of the 129 public fastapi tasks cannot pass in the provided sandbox because of missing test dependencies (forum 753370; the host confirmed the private scoring set does not include them).
  - The provided graphs omit async functions (forum 750732; the codegraph-loc repo).

### 3.5 Clarity (0–5)

- Settle **1–3 claims and one takeaway** before drafting (Nanda; Peyton Jones: "one ping").
- **Introduction**: answer Widom's five questions:
  1. What is the problem?
  2. Why does it matter?
  3. Why is it hard?
  4. Why is it unsolved, or how do you differ?
  5. What are the key components and their limits?

  The main contribution should be clear about a quarter of the way into the paper.
- **Lead with a running example**: one real issue traced through your pipeline, shown as a figure. Figures don't count toward the word limit.
- Tell the story of the **results**, not your journey (Widom; Peyton Jones). Use the active voice.
- Put key numbers in the main text. The **appendix may not be read** (host ruling, forum 749546).
- Make figures self-explanatory, colour-blind-safe and labelled. Don't encode with red and green only (Nanda).
- Get a "cold read" from someone who has not seen the work, and fix every "I got lost here" (Peyton Jones).

---

## 4. Do's

1. **Submit a complete version early** (by 9–10 Nov), then refine. Drafts are not judged, and any tie-break would likely use the original submission time.
2. **Fit the 3,000-word budget** (§6). Count title, abstract, captions *and table cells*. Run `texcount` or `pdftotext | wc -w`.
3. **Write a 4–5-sentence abstract**: problem, idea, headline number **with CI**, why it generalizes, and where the artefacts are.
4. **Include a Limitations / Threats-to-Validity section.** NeurIPS reviewers are told to reward candour. It is worse when reviewers find unacknowledged limitations themselves.
5. **Publish a fast companion notebook** that regenerates every table and figure from logged results in under 10 minutes on CPU (report 04 §3.2).
6. **Freeze the analysis plan and held-out set in advance.** Post a SHA-256 hash; 8 entrants already have (forum). Report any deviation honestly. Forum 754667 is a good example of transparent late disclosure.
7. **Name the exact model, quantization, serving stack and decoding settings.**
8. **Cite and respect licences.** Use Apache-2.0 or MIT for your code, which the winner licence requires anyway. Add upstream notices for any data you derive.
9. **For resources:** a datasheet or data card, a loader snippet, baseline numbers, Croissant metadata, a DOI (Kaggle Dataset or Zenodo), and a sample release if the full set must wait until 2 Dec.
10. **Use LLMs "tastefully"** (host's word) for polishing and literature triage. Then rewrite in your own voice and verify every citation.
11. **Make every link work logged out.** Pin versions with a release tag or version DOI.
12. **Name the target award in one line** if it helps the judges, e.g. "We submit this as a resource paper". Optional (forum 750338).

## 5. Don'ts

1. **Don't submit unedited LLM prose.** "Purely LLM generated 'slop' will not score well" (host, forum 745712). arXiv also bans papers with hallucinated references or leftover chatbot text *(single source: press report)*.
2. **Don't claim large gains from tiny samples or single runs.** "96% vs 16% on 25 tasks" with no CIs or seeds invites scepticism. Don't claim deltas under about 3 pp from one run.
3. **Don't report best-of-k as pass@1**, and don't hide retry budgets or extra test-time compute.
4. **Don't state facts that conflict with the official data.** Example: citing `sympy` tasks when the task set has only fastapi, rich, requests and httpx. One wrong fact undermines trust in all the others.
5. **Don't redistribute competition files** (raw `tasks.jsonl`, official graphs or embeddings, gold or test patches). Publish derived artefacts with links instead (host rulings R17–R21).
6. **Don't put essential results or proofs only in the appendix.**
7. **Don't use broken or placeholder links** (e.g. a bare `https://github.com`) or links behind a login.
8. **Don't compare against untuned or outdated baselines**, or against frontier models without stating version, date and settings.
9. **Don't mix speculation with explanation.** Label hypotheses as hypotheses. Avoid "mathiness" and redefined terms such as "verified" or "proves" (Lipton & Steinhardt).
10. **Don't use marketing tone**: emoji headers, upvote requests, "SOTA" without evidence.
11. **Don't cherry-pick trajectories.** Say how you chose the qualitative examples.
12. **Don't rely on arXiv alone for the PDF.** Moderation, endorsement rules and the arXiv holiday on Wed 11 Nov can push the link past the deadline (report 04 §4.2).
13. **Don't leave the writeup in Draft**, and don't attach private resources you need to keep secret. They become public after the deadline.

---

## 6. Suggested 3,000-word budget

Captions and table cells count, so reserve about 350 words for them. Figures are free, so push explanation into well-designed figures. Keep figure text minimal: words inside a figure image are *not* counted, but a dense caption is.

| Section | Words | Content |
| :--- | ---: | :--- |
| Title + subtitle + abstract | 180 | 4–5 sentences, with the headline number and its CI |
| 1 Introduction + contributions | 400 | Widom's 5 questions; 3–4 refutable bullets with section references |
| 2 Setting and running example | 200 | Task format, constraints (local, small model, time budget), one worked issue |
| 3 Method / resource design | 600 | Intuition first, then mechanism; *why* it works (ARC "Theory") |
| 4 Experimental protocol | 350 | Splits, held-out set, pre-registration hash, runs, CI method, compute, contamination and leakage checks |
| 5 Results (incl. tables and captions) | 550 | Main table with CIs and paired deltas; cost–accuracy Pareto figure |
| 6 Analysis, ablations, failure audit | 300 | Source of the gains; false-pass audit; failure taxonomy |
| 7 Limitations / threats to validity | 200 | Scope, n, single hardware, benchmark flaws |
| 8 Related work | 150 | Closest 4–6 works and how you differ (it can sit after the results) |
| 9 Conclusion + availability statement | 70 | Repo, notebook, dataset, DOI, licence |
| **Total** | **3,000** | References and figures excluded |

---

## 7. A paper skeleton you can fill in (Markdown for the Kaggle Writeup body)

```markdown
# <Title: claim-style, ≤ 12 words>
### <Subtitle: method/resource + setting, e.g. "A held-out audit on Gemma 4 E4B and 31B">

**Abstract.** <Problem>. <Key idea>. On <n tasks, k seeds>, <headline result ± CI> vs <strong baseline>,
at <cost>. <Why it generalizes / held-out evidence>. Code, data and a 10-minute reproduction notebook are public (links below).

## 1 Introduction
<Problem → why it matters for offline agents → why hard → gap>.
**Contributions:** (1) … (§3) (2) … (§5) (3) … (§6) (4) Released: … (§9)

## 2 Setting and running example
## 3 Method / Resource
## 4 Experimental protocol   (splits · held-out set · pre-registration SHA-256 · runs · CIs · compute)
## 5 Results                 (Table 1 with CIs · Fig. 2 cost–accuracy Pareto)
## 6 Analysis and ablations  (what drives the gain · false-pass audit · failures)
## 7 Limitations
## 8 Related work
## 9 Availability            (notebook · repo tag · dataset/DOI · licences · LLM-use statement)
## References
```

---

## 8. Final 48-hour quality pass

| # | Check | Criterion served |
| :---: | :--- | :--- |
| 1 | Can a stranger state your main claim after reading only the abstract and Figure 1? | Clarity |
| 2 | Is every number in the abstract reproduced by the notebook fast path? | Verifiability |
| 3 | Does every comparison have n, a CI and a named variance source? | Verifiability, Quality |
| 4 | Is there at least one held-out or transfer result? | Quality |
| 5 | Does each contribution bullet cite its closest prior work and the delta? | Novelty |
| 6 | Is cost (tokens, time, GPU) reported next to accuracy? | Relevance |
| 7 | Is there a Limitations section? | Quality, Verifiability |
| 8 | Word count ≤ 3,000 under the host's counting rules? | Eligibility |
| 9 | Cover image, track selected, links working logged out, state = Submitted? | Eligibility |
| 10 | Every citation checked for existence and correctness (no hallucinated references)? | Clarity, credibility |

---

## 9. Sources

**Competition (primary, scraped 2026-11-05)**

- Paper Track Overview, Rules and API settings: <https://www.kaggle.com/competitions/gemma-4-developer-agent-paper>
- Host rulings: forum topics 743255, 745712, 745872, 749546, 750338, 751413, 752667 (see report 02)
- ARC Prize 2026 Paper Track, Evaluation page (Kaggle comp 133724; text verified through the API 2026-11-05): <https://www.kaggle.com/competitions/arc-prize-2026-paper-track>

**Review rubrics and checklists**

- NeurIPS 2025 Reviewer Guidelines (Originality wording verified 2026-11-05): <https://neurips.cc/Conferences/2025/ReviewerGuidelines>
- NeurIPS 2026 Reviewer Guidelines: <https://neurips.cc/Conferences/2026/ReviewerGuidelines>
- NeurIPS Paper Checklist: <https://neurips.cc/public/guides/PaperChecklist>
- NeurIPS 2025 Datasets & Benchmarks CFP and Data Hosting Guidelines: <https://neurips.cc/Conferences/2025/CallForDatasetsBenchmarks>, <https://neurips.cc/Conferences/2025/DataHostingGuidelines>
- J. Pineau, ML Reproducibility Checklist v2.0 (McGill, 2020): <https://www.cs.mcgill.ca/~jpineau/ReproducibilityChecklist.pdf>
- Papers with Code, ML Code Completeness Checklist (2020): <https://github.com/paperswithcode/releasing-research-code>
- Gebru et al., Datasheets for Datasets (2018): <https://arxiv.org/abs/1803.09010>

**Writing guides**

- N. Nanda, "Highly Opinionated Advice on How to Write ML Papers" (AI Alignment Forum, 12 May 2025): <https://www.alignmentforum.org/posts/eJGptPbbFPZGLpjsp/highly-opinionated-advice-on-how-to-write-ml-papers>
- S. Peyton Jones, "How to write a great research paper" (MSR, PLMW 2015 slides): <https://www.cis.upenn.edu/~sweirich/icfp-plmw15/slides/peyton-jones.pdf>
- J. Widom, "Tips for Writing Technical Papers" (Stanford): <https://cs.stanford.edu/people/widom/paper-writing.html>
- Z. Lipton & J. Steinhardt, "Troubling Trends in Machine Learning Scholarship" (2018): <https://arxiv.org/abs/1807.03341>

**Agentic-SWE evaluation pitfalls**

- Kapoor et al., "AI Agents That Matter" (Princeton, 2024): <https://arxiv.org/abs/2407.01502>
- Bjarnason et al., run-to-run variance on SWE-bench Verified (Feb 2026): <https://arxiv.org/abs/2602.07150>
- E. Miller, "Adding Error Bars to Evals" (Nov 2024): <https://arxiv.org/abs/2411.00640>
- Aleithan et al., SWE-bench+ (Oct 2024): <https://arxiv.org/abs/2410.06992>
- Wang et al., PatchDiff (Mar 2025): <https://arxiv.org/abs/2503.15223>
- UTBoost (Jun 2025): <https://arxiv.org/abs/2506.09289>
- Zhu et al., Agentic Benchmark Checklist (Jul 2025): <https://arxiv.org/abs/2507.02825>

**Paper-award precedents**

- ARC Prize 2024 technical report: <https://arcprize.org/blog/arc-prize-2024-winners-technical-report>
- ARC Prize 2025 results analysis (5 Dec 2025): <https://arcprize.org/blog/arc-prize-2025-results-analysis>

**Pre-registration**

- NeurIPS 2020/2021 Pre-registration workshops: <https://preregister.science/>
- Scheel, Schijen & Lakens (2021), Registered Reports vs standard reports: <https://journals.sagepub.com/doi/10.1177/25152459211007467>

**Single-source / weaker** (noted by the research agent): ARC 2024 criteria wording, Gemma 4 Good judging notes, OpenAI's 2026 SWE-bench Verified deprecation, the SWE-rebench best-of-k note, and the arXiv "AI slop" ban (press report: The Next Web).

