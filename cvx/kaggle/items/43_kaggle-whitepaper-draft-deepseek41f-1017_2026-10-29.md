# COMBINED MARKDOWN - combine

_Generated 2026-10-29 09:43:32 | 7 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 00a-README-deepseek41f-1017.md
2. 00b-STATUS.md
3. 01-whitepaper-essentials.md
4. 02-gemma4-paper-track-playbook.md
5. 03-templates-and-checklists.md
6. 04-sources.md
7. 05-qc-report.md

---

<!-- ====================================================================== -->
<!-- FILE: 00a-README-deepseek41f-1017.md -->
<!-- ====================================================================== -->

# Writing a data-science whitepaper that wins

*Prepared 2026-10-29. The target competition closes 2026-11-12 at 23:59 UTC.*

This pack does two jobs. The first is a practical guide to the craft of an
academic data-science whitepaper: what the genre is, how the sections work,
how to write them, and how to make the evidence survive a skeptical reader.
The second is a competition playbook for the Kaggle **Google – The Gemma 4
Developer Agent Paper Track**, where the writing is judged against five
equally weighted criteria and the prize pool is $35,000.

The advice is deliberately opinionated. Claims that come from an official
competition page or a published guide are traceable to the source register in
`04-sources.md`. Statements about what a judge panel will reward are labelled
as inference.

## Five things that matter most

1. **The rubric is the specification.** Novelty, Quality, Relevance,
   Verifiability, and Clarity are each scored 0–5 and averaged. A weak
   dimension is expensive: raising a 2 to a 4 is worth more than polishing a 5.
   Design for at least a 4 in every row, then push one row to 5.
2. **Novelty is not the same as a leaderboard gain.** The organizers ask for
   new insights, deeper understanding, or important properties of existing
   methods. A careful diagnosis of why small agents fail, or a reusable
   resource that others can build on, can score higher than a small, noisy
   score improvement.
3. **3,000 words is a workshop paper, not a thesis.** One claim, one mechanism,
   one evaluation, one limitation. Every paragraph that does not support that
   spine is costing you Clarity points.
4. **Generalization is the differentiator.** The Quality criterion explicitly
   asks whether the work translates beyond the competition. A paper tuned to
   the 129 public tasks is a leaderboard report; a paper that shows the
   mechanism transfers to another repository, model, or budget is research.
5. **Verifiability is cheap to add and expensive to fake.** Release the code,
   prompts, configs, and per-task results; report repeats or intervals; state
   the evaluation protocol. Then submit a complete version early, because ties
   may be broken by original submission time.

## What is in the pack

| File | What it covers | Read it when |
|:---|:---|:---|
| [`01-whitepaper-essentials.md`](01-whitepaper-essentials.md) | Genre, structure, section-by-section craft, evidence standards, figures, citations, do's and don'ts | You want the general craft, or you are revising a draft |
| [`02-gemma4-paper-track-playbook.md`](02-gemma4-paper-track-playbook.md) | Competition facts, rubric decode, prize strategy, judge analysis, contribution selection, 3,000-word blueprint, 14-day plan, submission traps | You are entering the Kaggle track |
| [`03-templates-and-checklists.md`](03-templates-and-checklists.md) | Title formulas, abstract template, contribution bullets, results tables, limitations paragraph, self-score sheet, pre-submission and table-QC checklists | You are drafting or doing a final pass |
| [`04-sources.md`](04-sources.md) | Annotated sources with publisher, date, URL, and what each supports | You need to check or cite a claim |
| [`05-qc-report.md`](05-qc-report.md) | Table, rendering, link, and placeholder checks, with reproducible commands | You want to audit the pack's quality |
| [`STATUS.md`](STATUS.md) | Research workstream board and progress log | You want to see how the pack was assembled |

## How to use it in the fourteen days before the deadline

- **Oct 29–30**: read `02` sections 1–6 and choose one contribution. Write the
  one-sentence claim and the abstract skeleton before running anything.
- **Oct 31–Nov 2**: run the baseline, the method, and one ablation. Repeat the
  headline comparison at least twice; a single run is not evidence.
- **Nov 3–4**: build the figures and the failure taxonomy. If a result does
  not fit the claim, change the claim, not the data.
- **Nov 5–7**: draft in the order method → results → introduction →
  related work → abstract. Use `03` for the templates.
- **Nov 8–9**: cut to 3,000 judged words, verify every number against the
  tables, and release the artifact.
- **Nov 10–12**: submit a complete version, then polish only if the new
  version is clearly better. Do not leave the submission to the final hour.

## Scope and confidence

- **As of 2026-10-29.** Competition rules, dates, prizes, and dataset details
  were read from the official Kaggle pages on that date. Fast-moving details
  should be re-checked before submitting.
- **Official versus inferred.** Statements about the rubric, prizes, word
  limit, and submission mechanics are official. Statements about what the
  judge panel will reward are inference from public profiles and the stated
  criteria; they are labelled in `02`.
- **Community evidence is labelled.** Several useful signals come from
  competitor discussion threads, not organizers. They are identified as
  community reports and should not be treated as measurements of the official
  benchmark.
- **No fabricated results.** The worked examples in `03` are illustrative and
  marked as such. The pack does not report experiments that were not run.

## The one-paragraph version

Write a paper that makes one falsifiable claim about a mechanism, shows the
mechanism works with a matched-budget baseline and an ablation, shows it
generalizes beyond the exact public tasks, and releases enough code and
per-task evidence that a skeptical judge could check it. Then say it in 3,000
clear words. That is the whole game.


---

<!-- ====================================================================== -->
<!-- FILE: 00b-STATUS.md -->
<!-- ====================================================================== -->

# Research status — academic data-science whitepapers & Kaggle Gemma 4 Paper Track

Started 2026-10-29. Scope frozen below; logs live in
`scratch/research-kaggle-gemma4-whitepaper-2026-10/_progress/`.

## Scope

Produce a practical, well-sourced guide to (a) the essentials of writing an
academic data-science whitepaper and (b) how to write a competitive paper for
the Kaggle *Google – The Gemma 4 Developer Agent Paper Track* (deadline
2026-11-12, 3,000 words, five equally weighted criteria).

## Workstreams

| ID | Workstream | Owner | State | Log |
|:---|:---|:---|:---|:---|
| A1 | Academic paper structure and genre conventions | research agent | 🟢 done | `angle-1-structure.log` |
| A2 | Writing craft: title, abstract, intro, related work, results, figures | research agent | 🟢 done | `angle-2-craft.log` |
| A3 | Rigor, verifiability, reproducibility, and evaluation standards | research agent | 🟢 done | `angle-3-rigor.log` |
| A4 | Kaggle writeup craft and prior competition winners | research agent | 🟢 done | `angle-4-kaggle.log` |
| A5 | Competition context, dataset, and judge taste | research agent | 🟢 done | `angle-5-context.log` |
| A6 | Failure modes, critiques, and do-nots | research agent | 🟢 done | `angle-6-failure.log` |
| D1 | Deep dives and cross-checking | orchestrator | 🟢 done | `deep-dive.log` |
| W1 | Write deliverables | orchestrator | 🟢 done | `writing.log` |
| Q1 | Markdown/table QC and final review | orchestrator | 🟢 done | `qc.log` |

State key: ⚪ pending · 🔵 running · 🟢 done · 🔴 failed.

## Deliverables

| File | Contents | State |
|:---|:---|:---|
| `README.md` | Orientation, five key takeaways, file map, how to use the pack | 🟢 |
| `01-whitepaper-essentials.md` | Genre, architecture, section-by-section craft, evidence standards, figures, citations, do's and don'ts | 🟢 |
| `02-gemma4-paper-track-playbook.md` | Official facts, rubric decode, prize strategy, judge analysis, contribution selection, 3,000-word blueprint, 14-day plan, submission traps | 🟢 |
| `03-templates-and-checklists.md` | Title and abstract templates, results tables, limitations paragraph, self-score sheet, pre-submission and table-QC checklists | 🟢 |
| `04-sources.md` | Annotated source register with publisher, date, URL, and confidence | 🟢 |
| `05-qc-report.md` | Table, rendering, link, and placeholder checks with reproducible commands | 🟢 |

All 42 tables (39 content tables plus 3 in the QC report) pass the GFM
structural check (`scratch/check_md_tables.py`, T1–T6) and render as tables
under Pandoc's GFM reader.

## Ground rules

- $0 search plan: DuckDuckGo / warmed Google browser / Tavily keyless only.
  No keyed Tavily allowance and no PAYG without explicit user approval.
- Every load-bearing claim needs a source URL, publisher, and date.
- Competition claims are anchored to the official Kaggle pages fetched
  2026-10-29; secondary commentary is labelled as such.


---

<!-- ====================================================================== -->
<!-- FILE: 01-whitepaper-essentials.md -->
<!-- ====================================================================== -->

# The essentials of an academic data-science whitepaper

*Scope: what the genre is, how a paper is built, how to write each section,
and how to make the evidence survive a skeptical reader. The advice is written
for a short paper — a workshop paper, a competition writeup, or a technical
whitepaper with academic standards — rather than a 30-page journal article.*

---

## Executive summary

An academic data-science whitepaper is an argument, not a report. It makes one
falsifiable claim, supports it with evidence that a reader could check, places
it against the nearest prior work, and states the conditions under which the
claim should not hold. Everything else — the literature review, the system
diagram, the extra experiments — exists to support that argument.

The craft has five layers, and they fail in this order:

1. **The claim.** If the paper does not have one sentence that could be false,
   no amount of polish will save it.
2. **The evidence.** A baseline, an ablation, and a variance estimate are the
   minimum for an empirical claim. A single run is an anecdote.
3. **The positioning.** The reader must be able to see what is new relative to
   the nearest work, without reading a literature review.
4. **The structure.** Each section answers one question; the argument flows
   from problem to gap to method to evidence to limitation.
5. **The prose.** Clear sentences, defined terms, consistent numbers, and
   figures that carry the argument.

Most weak papers are weak at layers 1–3, not at layer 5. Editing sentences
cannot fix a paper whose claim is vague or whose evidence is a single run.

---

## 1. What an academic data-science whitepaper is

### 1.1 The genre

An academic whitepaper is a short, self-contained document that presents a
problem, a method or finding, and evidence, with citations to prior work. It
sits between a conference paper and a technical report: shorter and more
focused than a journal article, more rigorous and better situated than a blog
post, and more argument-driven than internal documentation.

The genre is defined by a contract with the reader:

- **Claims are falsifiable.** The paper says what would count as evidence
  against its claim.
- **Evidence is reported.** The method, data, protocol, and results are
  described well enough to be checked.
- **Prior work is credited.** The paper says what others have done and what is
  new here.
- **Limitations are stated.** The paper says where the claim does not apply.
- **Methods are reproducible.** A competent reader could rerun the main
  experiment from the paper and the released artifacts.

A marketing whitepaper breaks this contract deliberately: it selects evidence
to persuade. An academic whitepaper selects evidence to inform, including the
evidence that complicates the story.

### 1.2 What it is not

| Form | Purpose | Why it is not an academic whitepaper |
|:---|:---|:---|
| Blog post | Share an idea quickly | Informal, often unreviewed, usually no baseline or related work |
| Technical report | Document a system or project | May be internal, descriptive, and not organized around a claim |
| Survey | Summarize a field | Contributes synthesis, not a new result; different structure |
| Marketing whitepaper | Persuade a buyer | Selection bias, no limitations, no falsifiable claim |
| Full journal article | Exhaustive treatment | Longer, broader review, more experiments than a short paper can hold |

### 1.3 The reader

Assume a skeptical expert who is skimming. They will ask three questions in
the first minute:

1. **What is new?** If the answer is not in the title and abstract, they may
   stop.
2. **How do you know?** If the evidence is a single run or a cherry-picked
   example, they will discount the claim.
3. **Why should I care?** If the implication is only "this benchmark number
   went up," they will file it as a leaderboard report.

Write for that reader. The paper does not need to be entertaining; it needs to
be checkable.

### 1.4 Where the genre lives

Academic data-science whitepapers appear in four main venues: peer-reviewed
conferences (NeurIPS, ICML, ICLR, KDD, and their workshops), journals (JMLR,
the Journal of Data Science, and domain journals), workshops and symposia, and
technical reports or preprints. The venues differ in length, prestige, and
review process, but they converge on the same questions: what is new, how do
you know, and why does it matter.

A competition writeup is a fifth venue. It is judge-scored against a published
rubric rather than peer-reviewed, and the judge's attention is shorter than a
reviewer's. It borrows the paper's evidence norms but not its peer-review
gate. That is why the craft advice in this guide transfers: the questions are
the same, even when the format is shorter.

---

## 2. The architecture

### 2.1 The standard sections

A short data-science paper can be built from nine sections. The proportions
are for a 3,000–5,000-word paper; a longer paper expands the method and
related work, not the abstract.

| Section | The question it answers | Typical share |
|:---|:---|---:|
| Title and subtitle | What is the contribution, and in what setting? | 1% |
| Abstract | What did you find, and why should I read on? | 5–8% |
| Introduction | What is the problem, what is missing, what is new? | 12–15% |
| Related work | What is the nearest work, and how are you different? | 10–15% |
| Method | How does it work, well enough to reimplement? | 20–30% |
| Experimental setup | What data, baselines, metrics, and protocol? | 8–12% |
| Results | What happened, and what does it mean? | 15–20% |
| Discussion and limitations | Where does the claim hold, and where does it not? | 10–12% |
| Conclusion | What should the reader remember? | 3–5% |

References and appendix sit outside the argument. References establish
credibility; the appendix supports verification. Neither should carry the
paper.

### 2.2 The argument spine

A paper is easier to write if you state the spine before drafting:

> **Claim**: X improves Y because Z.
> **Evidence**: On benchmark B, X raises Y from A to B under a matched budget.
> **Warrant**: The ablation shows that removing Z removes most of the gain.
> **Limit**: The effect is largest on multi-file tasks and disappears on
> single-file tasks.

Every section serves one of these four lines. The introduction motivates the
claim; related work isolates what is new; the method explains Z; the setup and
results supply the evidence; the discussion states the limit.

If you cannot fill in all four lines, the paper is not ready. If the warrant
is missing, you have a correlation, not a mechanism.

### 2.3 Three paper templates

**Empirical or mechanism paper**

1. Problem and why it matters.
2. Gap in existing methods.
3. Proposed mechanism.
4. Matched-budget evaluation.
5. Ablation isolating the mechanism.
6. Generalization test.
7. Limitations and implications.

**Diagnostic paper**

1. Phenomenon: a system fails in a specific, reproducible way.
2. Measurement: a taxonomy or instrument that quantifies the failure.
3. Explanation: the mechanism behind the failure.
4. Intervention: a change that alters the failure rate.
5. Scope: where the explanation holds.
6. Implications for builders.

**Resource or application paper**

1. Need: what existing resources or tools cannot do.
2. Artifact: what you built, with enough detail to reuse.
3. Construction: how it was built, validated, and licensed.
4. Use case: a baseline task that the artifact enables.
5. Evidence: a small evaluation showing the artifact works.
6. Limitations: coverage, bias, maintenance.

Choose one template before you start. A paper that tries to be all three is
usually none of them.

### 2.4 Three word-budget templates

The templates below are adapted from the reader-funnel advice in Simon Peyton
Jones's ["How to Write a Great Research Paper"](https://www.cis.upenn.edu/~sweirich/icfp-plmw15/slides/peyton-jones.pdf),
the context–content–conclusion structure in Mensh and Kording's ["Ten Simple
Rules for Structuring Papers"](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1005619),
and Neel Nanda's [advice to compress to one to three claims](https://www.alignmentforum.org/posts/eJGptPbbFPZGLpjsp/highly-opinionated-advice-on-how-to-write-ml-papers)
before expanding.

| Template | Best for | Section budget | Total |
|:---|:---|:---|:---|
| A. Compressed method paper | One strong mechanism | Title 25; abstract 150–200; introduction 350–400; task and data 250; approach 600–700; experiments 800–900; related work 250–300; limitations and conclusion 200–250 | ~2,950 |
| B. IMRAD competition variant | Empirical or benchmark study | Abstract 180; introduction 400; related work 300; methods 850; results 950; discussion 220; conclusion 120 | ~3,020, trim related work |
| C. Figure-first narrative | Results are the story | Abstract 150; introduction 350; setup 250; three claim sections 450 each; cross-cutting analysis 500; related work 100; limitations and conclusion 250 | ~2,950 |

Template A is the safest for a competition paper with one method. Template B
fits an evaluation or benchmark paper, where the protocol needs room. Template
C works when the figures can carry the argument and the prose is mostly
connective tissue.

### 2.5 What the authoritative guides agree on

The guides disagree about placement and emphasis, but they agree on seven
things, and those seven are the safest structural rules for a short paper:

1. **One central contribution, or at most three claims.** Simon Peyton Jones
   calls it the "one ping"; Mensh and Kording make it the first rule; Neel
   Nanda recommends one to three novel claims with a cohesive theme.
2. **Front-load the message.** The title, abstract, and introduction carry most
   readers; the method details are read by few. Peyton Jones's reader funnel is
   blunt: the title has the most readers, the abstract a tenth as many, the
   details a small fraction.
3. **Use context–content–conclusion at every scale.** A paper, a section, and a
   paragraph should each open with context, deliver content, and close with the
   conclusion. Mensh and Kording recommend the same pattern for results
   paragraphs: question, evidence, answer.
4. **Make result headers declarative.** "Graph reranking helps most on
   multi-file issues" is a result header; "Results" is a label. Declarative
   headers make the paper skimmable and force the section to have a point.
5. **Make figures self-contained.** A reader should understand the figure and
   caption without the body text. Nanda treats figure captions as part of the
   argument, not decoration.
6. **Do not write a chronological diary.** The paper is not the story of your
   research journey; it is the argument you would have made if you had known
   the answer first.
7. **State limitations and credit prior work.** Honest limitations are cheaper
   than invented ones, and generous credit signals that you know the field.
   Peyton Jones's warning is memorable: failing to credit prior work can kill a
   paper because it suggests you do not know the idea is old.

The main disagreement is where related work belongs. Peyton Jones and Nanda
prefer it after the main content; Mensh and Kording keep the introduction
gap-focused and put the broad review later. The Kaggle Paper Track explicitly
requires "related works and citations", so use a named section even if you
place it after the results.

The consensus above is drawn from [Peyton Jones (2018)](https://www.cis.upenn.edu/~sweirich/icfp-plmw15/slides/peyton-jones.pdf),
[Mensh and Kording (2017)](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1005619),
and [Nanda (2025)](https://www.alignmentforum.org/posts/eJGptPbbFPZGLpjsp/highly-opinionated-advice-on-how-to-write-ml-papers).
The disagreements are noted in the text.

---

## 3. Section by section

The sections below follow the reader funnel: the title, abstract, and
introduction are read by many; the method and details are read by few. Simon
Peyton Jones's rough readership numbers are a useful planning heuristic, not a
measurement.

| Section | Relative readers | What it means for your effort |
|:---|:---|:---|
| Title | 1,000 | Spend real time on it; it is the most-read sentence you write |
| Abstract | 100 | It must stand alone; many readers stop here |
| Introduction | 100 | State the problem, the gap, and the contributions |
| Method and details | 10 | Write for the reader who will reimplement; do not pad |
| Related work | 10 | Position, do not survey |
| Conclusion | Few | Restate the claim; add nothing new |

This is why front-loading matters. A brilliant method described on page six
loses to a clear claim on page one, because most readers never reach page six.

### 3.1 Title and subtitle

A title should name the contribution and the setting. Good titles are
specific, searchable, and honest about scope. The subtitle can carry the
qualifier that keeps the title from overclaiming.

- Strong: "Call-graph reranking for multi-file bug localization in small
  coding agents."
- Weak: "A Comprehensive Study of Code Graphs."
- Weak: "Towards Better Software Agents."
- Weak: "Our Submission to the Competition."

A useful test: can a reader guess the claim from the title? If not, the title
is a label, not a contribution.

### 3.2 Abstract

The abstract is the most-read section and the last one you should write. It
should contain, in order:

1. **Context**: what practitioners want, and why it is hard.
2. **Gap**: what existing approaches do, and what they miss.
3. **Approach**: what you introduce, in one clause.
4. **Evidence**: the benchmark, the number, and the comparison.
5. **Mechanism**: the ablation or analysis that shows why the number moved.
6. **Implication**: what follows, and what you do not claim.

Rules:

- No citations in the abstract unless the venue requires them.
- No "we hope" or "we believe." State what the evidence shows.
- Include at least one number, with its denominator.
- If the abstract says "state of the art," the results table must show a
  comparison to the prior state of the art on the same benchmark.

### 3.3 Introduction

The introduction has four jobs, usually in four paragraphs:

1. **Territory**: the problem and why it matters. Cite one or two real
   deployments, benchmarks, or costs.
2. **Niche**: what the best existing approaches do. Be fair; a strawman is
   easy to detect.
3. **Gap**: the specific thing they cannot do or cannot explain. This is the
   hinge of the paper.
4. **Occupation**: your insight and contributions. State the claim, then list
   three or four contributions, each with a result.

A useful gap sentence has the form: "Prior work improves [outcome] by
[approach], but it does not isolate [mechanism], so it cannot tell whether
[alternative] would produce the same gain."

Contribution bullets should commit to findings, not activities:

- Weak: "We study code graphs."
- Strong: "We show that call-graph reranking, not embedding similarity,
  explains the gain on multi-file issues."

### 3.4 Related work

Related work is not a literature review. It is a positioning section. Its job
is to make the delta unmissable in the fewest words.

Three moves:

1. **Group** the nearest work into two or three lines of research.
2. **Contrast** each group with your paper in one sentence.
3. **Conclude** with the specific difference that matters.

A matrix is often better than prose:

| Work | Setting | Method | Evaluation | What it leaves open |
|:---|:---|:---|:---|:---|
| Work A | Repo-level bug fixing | Agent loop | Benchmark B | Small models, graph context |
| Work B | Repo understanding | Graph retrieval | Benchmark B | Embedding quality |
| This paper | Local agent | Graph reranking | 129-task subset | Generalization beyond Python |

Six to ten nearest works is enough for a short paper. Cite the primary paper,
not the survey that mentions it. If a claim is contested, cite both sides.

### 3.5 Method

The method section should let a reader reimplement the mechanism without
reading the code. It should include:

- **Problem definition**: inputs, outputs, and the success condition.
- **Representation**: what a node, edge, prompt, or trajectory is.
- **Pipeline**: numbered steps, one sentence each, with the data flow.
- **Design choices**: why this depth, rank, threshold, schedule, or stopping
  rule. What did you try and reject?
- **Cost**: model calls, tokens, wall-clock, memory, and what is cached.
- **What is fixed vs learned**: prompts, weights, thresholds, schedules.

A useful test: can a reader draw the pipeline from your description? If they
need the code to understand the method, the method section has failed the
verifiability test.

### 3.6 Experimental setup

The setup section is where credibility is won or lost. It should state:

- **Data**: source, size, splits, exclusions, and license.
- **Baselines**: a naive baseline, a strong published baseline, and a tuned
  version if possible. All matched on budget.
- **Metrics**: the primary metric, its denominator, and any secondary metric.
- **Protocol**: how many runs, how seeds are handled, how failures are counted.
- **Compute**: hardware, hours, cost, and whether the environment matches the
  official harness.
- **Threats**: the two or three ways the setup could bias the result.

Report the protocol before the results. A reader who does not trust the setup
will not trust the numbers.

### 3.7 Results

The results section has four jobs:

1. **Main result**: one table, one paragraph. State the headline and the
   comparison.
2. **Ablation**: show that the mechanism, not a confound, drives the effect.
3. **Failure analysis**: categorize the residual failures and quantify them.
4. **Generalization**: one test outside the exact benchmark configuration.

Use the claim–evidence–interpretation pattern for each paragraph:

> **Claim**: Graph reranking helps most on multi-file issues.
> **Evidence**: The resolved rate rises from 18.4% to 24.1% overall, and from
> 12% to 21% on multi-file tasks.
> **Interpretation**: This is consistent with the mechanism: multi-file tasks
> require call-graph context that embedding similarity does not capture.

Do not narrate every row. The table is for the reader; the prose is for the
argument.

### 3.8 Discussion and limitations

The discussion should do three things:

- **Interpret** the result: what does it mean beyond the benchmark?
- **Generalize** carefully: where should the mechanism apply, and where not?
- **Limit** honestly: what are the threats to validity?

A good limitations paragraph names three specific threats, each with a
consequence and a mitigation. It does not say "our method has limitations."

Examples of specific threats:

- The evaluation covers four Python repositories, so the result may not
  transfer to statically typed languages.
- The model and budget are fixed, which isolates the mechanism but does not
  measure its interaction with a larger model.
- The public and hidden sets share a curation pipeline, so a distribution
  shift would weaken the absolute numbers.

### 3.9 Conclusion

The conclusion restates the claim and the implication. It adds no new result,
no new caveat, and no new citation. Three sentences is enough:

> We showed that [claim]. The result implies [implication] for [audience]. The
> artifact and per-task results are available at [link].

### 3.10 References and appendix

References should include the nearest prior work, the benchmark, the model,
and the evaluation methodology. A 3,000-word paper typically cites 15–25
entries; a longer workshop paper 20–35. Cite the primary source, not the blog
post about it.

The appendix holds material that supports verification but does not carry the
argument: prompts, extended tables, per-task results, dataset cards, licenses,
and reproduction commands. If a result is load-bearing, it belongs in the
body.

---

## 4. Writing craft

### 4.1 Paragraphs

A paragraph should make one point. The first sentence states it; the middle
sentences support it; the last sentence interprets it or transitions.

A useful pattern is **old-to-new**: start with information the reader already
has, and end with the new information that the next sentence will pick up.
This is the principle Gopen and Swan call the reader's expectation of
structure: readers expect the topic in the subject position and the new
information at the end of the sentence ([Gopen and Swan, 1990](https://www.gatsby.ucl.ac.uk/~pel/misc/gopen_swan.pdf)).

If a paragraph has two topic sentences, split it. If a paragraph has no topic
sentence, the reader has to infer the point, which is work you should have
done.

### 4.2 Sentences

Gopen and Swan's two positional rules do most of the work:

- **Stress position: put the new, important information at the end.** Readers
  give the greatest emphasis to the point of syntactic closure. End the
  sentence with the number or the key noun, not with a trailing qualifier.
- **Topic position: start with old information.** The beginning of a sentence
  is where readers look for context and linkage to what they already know.
  Old-to-new flow across a paragraph is what makes it feel inevitable.

The rest follows:

- **Prefer active voice** when the actor matters. "The agent edits the file"
  is clearer than "the file is edited by the agent."
- **Use verbs, not nominalizations.** "We evaluate" beats "we perform an
  evaluation of."
- **Keep the subject and verb close.** Long introductory phrases separate
  them and cost the reader memory.
- **Define terms once.** Use the same term everywhere; synonym cycling looks
  like variety but reads as ambiguity.
- **Quantify claims.** "Large improvement" is not evidence; "5.7 points on
  129 tasks" is.
- **Hedge uncertainty, not the main claim.** "The result suggests" is fine for
  an interpretation; "we might possibly have somewhat improved" is not.

### 4.3 Overclaiming

The most common overclaims in data-science papers are:

| Claim | Why it fails | Better |
|:---|:---|:---|
| "State of the art" | Requires a comparison to the prior best on the same benchmark | "Improves over the strongest matched-budget baseline on the public tasks" |
| "First" | Hard to prove; reviewers usually know a prior paper | "To our knowledge, the first ... in this setting" or drop it |
| "Significant" | Statistical significance is not practical significance | Report the effect size and the interval |
| "Generalizes" | One extra dataset is not generalization | State the scope and the evidence |
| "Proves" | Empirical results support, they do not prove | "Shows" or "is consistent with" |
| "Robust" | Requires perturbation or sensitivity analysis | "Stable across three seeds and two budgets" |

### 4.4 Editing passes

Edit in four passes, from large to small:

1. **Structural pass**: does each section do its job? Is the claim in the
   abstract the same as the claim in the conclusion?
2. **Paragraph pass**: does each paragraph have one point and a topic
   sentence? Does the order follow the argument?
3. **Sentence pass**: subject–verb–object, active voice, no nominalizations,
   no hedge stacking.
4. **Word pass**: cut redundant adjectives, throat-clearing, and repeated
   definitions.

Most writers try to do all four at once, which is why drafts stall. Do them
separately.

### 4.5 Common style errors

| Error | Example | Fix |
|:---|:---|:---|
| Throat-clearing | "In recent years, with the rapid development of AI, ..." | Start with the claim or the problem |
| Nominalization | "We perform an analysis of the results" | "We analyze the results" |
| Hedge stacking | "It may potentially be somewhat effective" | "It is effective in this setting" |
| Synonym cycling | "model", "system", "framework", "approach" for the same thing | Pick one term |
| Undefined acronym | "We use an AST-based GNN on the CPG" | Define each term on first use |
| Zombie noun | "The utilization of retrieval" | "Using retrieval" |
| Unnecessary passive | "It was found that" | "We found that" |
| Dangling modifier | "Using the graph, the agent's accuracy improved" | "Using the graph, the agent improved its accuracy" |

### 4.6 Before and after: two rewrites

The rewrites below are illustrative, not reported results. They show the
positional rules in action.

**Abstract sentence**

- Before: "In this paper, a novel approach for the improvement of bug
  localization performance through the utilization of repository-level code
  graph embeddings is presented."
- After: "We fuse repository call-graph structure with Gemma 4 code embeddings
  to localize the buggy function before editing; top-1 localization rises from
  52% to 71% over dense-retrieval-only on SWE-bench Verified."

What changed: the actor "we" is the grammatical subject next to its verb; the
nominalizations "improvement" and "utilization" are gone; the self-label
"novel" is gone because the result now speaks for itself; old information
(embeddings, retrieval) comes first and the new number lands in the stress
position.

**Results sentence**

- Before: "As can be seen from Table 2, the evaluation of the proposed method
  was performed on SWE-bench Verified and improvements were observed across
  all metrics."
- After: "Graph-ranked context, not a bigger model, drives the gain. Replacing
  BM25 ranking with code-graph ranking raises pass@1 from 24.1% to 29.7% while
  shrinking mean prompt tokens by 18% (Table 2); the same model with BM25
  remains flat at 24.3%."

What changed: the paragraph opens with a declarative claim, the evidence
sentences carry the numbers, and the final clause isolates the mechanism by
showing the contrast condition. The table is referenced, not narrated.

---

## 5. Evidence and rigor

### 5.1 Baselines

A credible empirical paper has at least three baselines:

- **Naive**: the simplest reasonable system. It establishes that the task is
  not trivial.
- **Strong**: the best published or open system that fits the budget. It
  establishes that your gain is real.
- **Tuned**: the strong baseline with the same tuning effort as your method.
  It establishes that the gain is not a tuning artifact.

The tuned baseline is the one most often missing, and the one reviewers ask
for first.

### 5.2 Ablations

An ablation is not a component-removal table. It is an experiment that
isolates the mechanism. The question is not "does removing X hurt?" but "does
X do what the theory says it does?"

Three kinds of ablation:

- **Removal**: remove the component. Shows necessity, not mechanism.
- **Substitution**: replace the component with a plausible alternative. Shows
  specificity.
- **Perturbation**: shuffle, randomize, or degrade the component's input.
  Shows that the structure, not the presence, matters.

A good paper has at least one substitution or perturbation, not only removal.

### 5.3 Uncertainty

For a benchmark with 129 tasks, a single run is not enough to distinguish a
small gain from noise. Report:

- The number of runs and the seeds.
- The mean and the standard deviation, or the confidence interval.
- The per-task or per-repository breakdown.
- A paired comparison when the same tasks are used for both systems.

A useful rule of thumb: if the gain is smaller than the run-to-run variation,
the paper needs more runs or a larger effect before it can claim a win. In
noisy agent benchmarks, a one-task difference is not evidence.

At n = 129, the worst-case binomial standard error on a resolved rate near 50%
is about 4.4 percentage points, so a 95% confidence interval spans roughly
±8.6 points. That is task-sampling uncertainty alone; run-to-run variance adds
to it. For an A-versus-B comparison on the same tasks, use a paired analysis
(McNemar's test or a paired bootstrap) and report the discordant pairs, not
just the two rates. Per-repository cells of 20–50 tasks each are exploratory;
a headline claim should not rest on one of them.

Absolute scores also drift across harness versions even when the rank order
stays stable. That is a reason to report deltas, confidence intervals, and the
harness version, rather than treating a single absolute number as comparable
to a number from a different scaffold.

### 5.4 Leakage and contamination

Data-science papers fail when the evaluation leaks information from the test
set into the method. Common leaks:

- The prompt includes issue text that contains the fix.
- The retrieval index includes the test patch.
- The model was trained on the benchmark repository at a later commit.
- The evaluation uses the same tasks for model selection and reporting.
- The test set was filtered using a frontier model that is also a baseline.

A short leakage paragraph is a credibility signal. State what you checked and
what you could not check.

### 5.5 Reproducibility

Reproducibility is not the same as releasing code. A reproducible paper
releases:

- The code and the exact environment.
- The prompts, configs, and seeds.
- The per-task results, not just the aggregate.
- The evaluation script and the data preparation steps.
- The compute budget and the hardware.

The minimum standard is that a competent reader could rerun the main table.
The gold standard is that they could rerun every table.

### 5.6 Generalization

The strongest papers test the mechanism outside the exact setting where it was
developed. Four affordable tests:

1. **Per-group breakdown**: does the effect hold in every repository or
   subgroup?
2. **Sensitivity**: does the effect survive a change in budget, model size, or
   hyperparameter?
3. **Transfer**: does the method work on a second dataset or task family?
4. **Ablation under shift**: does the mechanism still explain the gain when
   the distribution changes?

A paper that does one of these well is stronger than a paper that claims
generalization without evidence.

### 5.7 What the evidence says about rigor

Several empirical studies are worth knowing because they turn "be rigorous"
into specific, checkable actions.

| Finding | Evidence | What it implies for your paper |
|:---|:---|:---|
| Code release alone is a weak predictor of reproducibility | Raff, "A Step Toward Quantifying Independently Reproducible Machine Learning Research" (NeurIPS 2019, arXiv:1909.06674): 255 papers attempted from the text alone, about 62% lower-bound reproduction; explicit hyperparameters and readability predicted success better than code availability | Release method detail, not just a repository link: seeds, versions, hyperparameters, and a readable protocol |
| Leakage is widespread and inflates results | Kapoor and Narayanan, "Leakage and the Reproducibility Crisis in ML-based Science" (arXiv:2207.07048): eight leakage types across 17 fields and 329 papers | Include a leakage paragraph: how train, validation, and test were separated, and what contamination you could not rule out |
| Under-tuned baselines are a top rejection reason | ACL Rolling Review reviewer guidelines explicitly flag baselines that are not sufficiently tuned, including prompt tuning | Tune the baseline as hard as your method; report the tuning budget |
| Benchmark populations differ and contain defects | SWE-bench Verified was built by 93 developers annotating 1,699 samples, filtering out about 68% to leave 500; later audits found test flaws in a substantial share of consistently failed tasks, and SWE-bench Pro has its own defect estimate | Pin the benchmark snapshot, harness version, and denominator; never compare a number from one population to a number from another |
| Negative results are a legitimate contribution | "Position: Embracing Negative Results in Machine Learning" (arXiv:2406.03980); NeurIPS 2026 lists Negative Results as a contribution type | A well-measured null result is a paper if the measurement is rigorous and the scope is stated |

The practical lesson is that rigor is mostly documentation. A reader cannot
see your careful split, your tuned baseline, or your repeated runs unless you
write them down. The paper that writes them down earns the Verifiability
score even when the result is modest.

---

## 6. Figures and tables

### 6.1 One message per exhibit

Each figure or table should make one point. If a table has ten columns and no
clear message, split it or move it to the appendix.

### 6.2 Captions

A caption should be self-contained: what the exhibit shows, on what data, with
what metric, and what the reader should notice. A reader who jumps to the
figure should not need the body text.

Weak: "Results."
Strong: "Resolved rate by repository for the base agent, the strongest
matched-budget baseline, and the full method (n = 129 tasks; higher is
better). The method's advantage is concentrated in fastapi and requests."

Rougier, Droettboom, and Bourne's ["Ten Simple Rules for Better
Figures"](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1003833)
adds the operational checks: know the audience, identify the message, adapt
the figure to the display medium, never omit the caption, do not trust
defaults, use colour effectively and colourblind-safely, do not mislead with
truncated axes or misleading ratios, avoid chartjunk, let the message trump
beauty, and use the right tool.

### 6.3 Chart selection

| Question | Chart |
|:---|:---|
| Compare categories | Bar chart |
| Show a trend over time or budget | Line chart |
| Show a trade-off between two metrics | Scatter plot |
| Show a distribution | Box plot or violin plot |
| Show a confusion matrix or failure taxonomy | Heatmap or stacked bar |
| Show a pipeline | Diagram, not a chart |

Avoid 3D charts, dual axes, and pie charts with more than four slices. They
make comparisons harder.

### 6.4 Tables

- Fewer lines; horizontal rules only where they separate groups.
- Align numbers by decimal point.
- State units and denominators in the caption.
- Use the same precision within a column.
- Bold the best result only if the comparison is fair; do not bold a number
  that is not comparable.

---

## 7. Citations and related work

### 7.1 How many

A 3,000-word competition paper typically cites 15–25 works; a 5,000-word
workshop paper 20–35. More is not better; the goal is to cover the nearest
prior work, the benchmark, the model, and the methodology. A citation that
does not change the argument is padding.

### 7.2 Which sources

- **Primary**: the paper that introduced the method, benchmark, or dataset.
- **Recent**: the last 12–24 months, especially for fast-moving areas.
- **Nearest**: the papers a reviewer would compare you to.
- **Contested**: both sides of a disagreement, not just the side you agree
  with.

### 7.3 Common citation errors

| Error | Why it hurts |
|:---|:---|
| Citing a survey instead of the original method | The reader cannot check the claim |
| Citing a paper that says the opposite | Reviewers notice; credibility drops |
| Missing the nearest recent work | Signals a shallow literature review |
| Self-citation padding | Looks like an attempt to inflate metrics |
| Citing a preprint as if it were peer-reviewed | Overstates the evidence |
| A reference list with broken links | Makes the paper look careless |

### 7.4 Positioning

The last sentence of related work should state the difference, not the
similarity. "Unlike X, we isolate the mechanism with a substitution ablation"
is a positioning sentence. "Our work is related to X" is not.

---

## 8. Do's and don'ts

| Do | Don't |
|:---|:---|
| State one falsifiable claim in the first page | List three contributions with no result |
| Match the baseline on model, tools, and budget | Compare against a weaker model or a smaller budget |
| Report repeats or intervals | Report the best of several runs |
| Include an ablation that isolates the mechanism | Remove a component and call it a mechanism |
| State the limitations specifically | Write "our method has limitations" |
| Release code, prompts, configs, and per-task results | Say "code available on request" |
| Cite the nearest prior work | Cite a survey and call it related work |
| Define terms once and use them consistently | Cycle synonyms for the same concept |
| Make figures self-contained | Put the key result only in the appendix |
| Write the abstract last | Write the abstract first and force the paper to match it |
| Submit a complete draft early | Leave the submission to the final hour |
| Check the venue's rules | Assume the rules are the same as the last competition |

---

## 9. Pre-submission checklist

Use the detailed checklist in `03-templates-and-checklists.md`. The
short version:

- [ ] One-sentence claim, stated in the abstract and the introduction.
- [ ] A naive, a strong, and a tuned baseline, all matched on budget.
- [ ] An ablation that isolates the mechanism.
- [ ] Repeats or confidence intervals for the headline number.
- [ ] A failure analysis or a leakage audit.
- [ ] A generalization test or a clear scope statement.
- [ ] Code, prompts, configs, and per-task results released.
- [ ] Three exhibits that carry the argument.
- [ ] References to the nearest prior work, with links.
- [ ] Limitations with consequences and mitigations.
- [ ] Word count within the limit; appendix supplementary.
- [ ] Every number in the abstract matches the results table.

---

## 10. Open questions and venue-specific checks

The craft advice above is stable, but a few questions depend on the venue and
should be checked before submission:

- **Does the word limit include tables and figure captions?** For the Kaggle
  Paper Track, yes: the organizer said all judged text counts, including
  tables and captions; figures and references do not. Keep captions short.
- **Will the judges read the appendix?** The organizer said the appendix is
  supplementary and not guaranteed to be read. Do not put a load-bearing
  result there.
- **Is a preprint prior publication?** For the Kaggle Paper Track, arXiv
  preprints are explicitly allowed. Other venues differ.
- **How much does the evaluation environment change the result?** In agent
  benchmarks, it can change the measured resolve rate substantially. Report
  the environment, not just the score.
- **How large a gain is credible at n = 129?** The worst-case 95% interval on
  a headline rate is about ±8.6 points from task sampling alone. A paired test
  on the same tasks is more informative than a rule of thumb.

The sources for the claims in this guide are listed in `04-sources.md`.


---

<!-- ====================================================================== -->
<!-- FILE: 02-gemma4-paper-track-playbook.md -->
<!-- ====================================================================== -->

# How to win the Gemma 4 Developer Agent Paper Track

*Scope: a competition-specific playbook for the Kaggle **Google – The Gemma 4
Developer Agent Paper Track**
(<https://www.kaggle.com/competitions/gemma-4-developer-agent-paper>), with the
general craft it depends on. Official facts were read from the competition
pages on 2026-10-29; the deadline is 2026-11-12 at 23:59 UTC. Statements about
what individual judges will reward are inference from public profiles and the
stated rubric, not official policy.*

---

## Executive summary

The Paper Track is not a second leaderboard. The organizers say it explicitly:
the main competition ranks how many real-world issues an agent resolves, while
the paper track asks you to explain **the how and why**. The winners are likely
to be the papers that make a transferable claim about agentic software
engineering, not the papers that report the highest public score.

The winning shape is consistent across the five criteria:

1. **One falsifiable claim.** A named mechanism, diagnosis, resource, or
   application, stated in one sentence and tested.
2. **One matched-budget comparison.** The strongest available baseline plus
   your method, with the same model, tools, and time budget.
3. **One ablation that isolates the mechanism.** Not "we removed a component
   and the score dropped"; a manipulation that shows *why* the effect exists.
4. **One generalization test.** Another repository, model size, budget, or
   task family — evidence that the result is not a property of the 129 public
   tasks.
5. **One released artifact.** Code, prompts, configs, per-task results, and a
   quick way to rerun the main table.
6. **3,000 clear words.** A workshop paper, not a thesis. The abstract, the
   first figure, and the contributions must carry the argument.

The most common losing paper is a main-track solution report with a method
section and no mechanism, evaluated on one run, claiming a leaderboard gain
that the noise cannot support. The second most common is a survey of prompt
tips with citations. Both fail Novelty and Quality at once.

---

## 1. The competition in one page

| Item | Detail |
|:---|:---|
| Host | Google DeepMind, on Kaggle |
| Track | Featured Hackathon, paper track running alongside a prediction competition |
| Start | 2026-09-22 |
| Final submission deadline | 2026-11-12, 23:59 UTC |
| Prize pool | $35,000 total: Best Paper $15,000, Best New Resource $10,000, Best New Application $10,000 |
| Word limit | 3,000 words maximum; all judged text counts, including tables and captions; references and figures do not count; appendix is supplementary and not guaranteed to be read |
| Required writeup elements | Title and subtitle, abstract, introduction, description of research including methods and experiments, related works and citations |
| Optional attachments | Public Kaggle notebook, and/or an arXiv-ready PDF via the Public Project Link field |
| Evaluation | Five criteria, each scored 0–5; final score is the arithmetic mean |
| Criteria | Novelty, Quality, Relevance, Verifiability, Clarity |
| Team limit | At most two write-ups per team; one submission track; judges decide prize eligibility |
| Originality | Original, unpublished research; arXiv preprints are allowed and may be linked as the submission |
| Non-archival | Submission does not prevent submission to conferences or other venues |
| Participation | Does not require entering, or topping, the main competition |
| Topics | Tuning and optimization; code comprehension; tasks and benchmarks; graph reasoning |
| Judges | Elan Markowitz, Bryan Perozzi, Benedek Rózemberczki, Glenn Cameron, Hadi Hemmati, Yuchen Li, Michael Galkin, Majid Farhadi, Ryan Holbrook, Ashley Oldacre |

The two tracks are deliberately coupled. The main competition supplies the
task: post-train Gemma 4 into an autonomous software-engineering agent that
navigates repositories and drafts fixes on consumer hardware. Its dataset gives
you 129 public bug-fix tasks across fastapi, rich, requests, and httpx, plus
full repository snapshots, NetworkX AST call and dependency graphs, 256-
dimensional node embeddings, and three graph tools: `get_code_neighbors`,
`search_similar_code`, and `get_code_subgraph`. The paper track lets you study
that setting without needing to win it.

The paper deadline is earlier than the main deadline (November 12 versus
December 2) because, as the organizer explained, papers take longer to score.
That has a strategic consequence: the paper can be written while the main
competition is still running, and publishing it does not require releasing the
code you want to protect. The organizer confirmed that code is optional for
the paper.

### 1.1 The model behind the benchmark

Gemma 4 was released in April 2026 under Apache 2.0. The family has five
sizes, but the competition supports four QAT (quantization-aware training)
variants at 4-bit weights and 16-bit activations.

| Supported variant | Size class | Context | What to know |
|:---|:---|:---|:---|
| `gemma-4-31b-it-qat-w4a16-ct` | 31B dense | 256K | The strongest supported model; the natural upper bound for a paper's model-size comparison |
| `gemma-4-12b-it-qat-w4a16-ct` | 12B unified | 256K | Encoder-free unified architecture; the middle option |
| `gemma-4-e4b-it-qat-w4a16-ct` | E4B | 128K | Small model; agentically weak on the model card benchmarks |
| `gemma-4-e2b-it-qat-w4a16-ct` | E2B | 128K | Smallest supported model; the hardest setting |

"E" stands for effective parameters: the small models use Per-Layer
Embeddings, large lookup tables kept out of the hot path, so the effective
parameter count is much smaller than the total. The 26B A4B mixture-of-experts
variant is not supported by the competition.

The model card makes the competition's premise quantitative. On LiveCodeBench
v6, the 31B model scores 80.0 but E4B scores 52.0 and E2B 44.0; on Tau2
(agentic tool use), the gap is larger: 76.9 for 31B, 42.2 for E4B, and 24.5
for E2B. The small models are capable enough to be interesting and weak
enough that post-training, tooling, and scaffolding matter. That is the space
the paper track is asking you to study.

For a paper, state the exact variant and quantization, and say whether your
method uses the provided graph and embedding assets. A reviewer cannot compare
your result to another paper's without those facts.

---

## 2. The rubric as a design specification

Each criterion is scored 0–5, and the final score is the average. That
arithmetic is the single most important strategic fact in the competition. A
paper scoring 5, 5, 5, 5, 2 averages 4.4; a paper scoring 4, 4, 4, 4, 4
averages 4.0. The first wins despite its weak dimension. But the margin is only
0.4, and a 2 in Verifiability or Clarity is often the cheapest point to
recover: raising it to a 4 moves the average to 4.8, while polishing a 5
cannot go higher. Fix the weakest row first, then protect the balance.

| Criterion | The judge is really asking | Evidence that earns a 4 or 5 | What produces a 1 or 2 |
|:---|:---|:---|:---|
| Novelty | What is new here that I could not have guessed from the nearest prior work? | A named mechanism, diagnosis, resource, or application, contrasted explicitly with the closest work, with an experiment that isolates the new part | "We used Gemma 4 with a better prompt"; a leaderboard gain with no stated insight |
| Quality | Does this generalize beyond these 129 tasks and this exact harness? | Cross-repository or cross-model transfer, budget sensitivity, ablations, scope conditions, a clear statement of where it should not work | A single aggregate score tuned on the public tasks; no ablation; no discussion of scope |
| Relevance | Why should software-engineering or agentic-learning researchers care? | A concrete developer workflow, a cost or latency argument, an offline or privacy motivation, or a general lesson about small agents | A benchmark-only result with no implication beyond the competition |
| Verifiability | Can I understand how it works and check how the data was obtained, analyzed, and interpreted? | Code, prompts, configs, per-task results, seeds or repeats, data provenance, exact evaluation protocol, a quick-run path | "Code available on request"; unreported variance; a method that cannot be reimplemented from the paper |
| Clarity | Can I follow the argument in one read? | One-sentence claim, signposted sections, three figures or tables that carry the argument, consistent numbers, defined terms | Dense prose, undefined acronyms, numbers that disagree between abstract and tables, an argument that lives in the appendix |

### 2.1 Novelty

The organizers define novelty as new insights, deeper understanding, or
important properties of existing methods. That is broader than "a new model"
and narrower than "a new dataset." It admits at least five kinds of
contribution:

- **Mechanism**: a new component or training procedure that changes behavior.
- **Diagnosis**: a new explanation of why an existing system fails.
- **Measurement**: a new benchmark, metric, or audit that reveals something
  the old measurement missed.
- **Resource**: a dataset, tool, or software artifact that enables new work.
- **Application**: a new use case that demonstrates a capability.

A competition paper often has a novelty problem because the method is a
combination of known parts. The fix is not to hide the combination; it is to
name the part that is new and show that it is doing the work. "We combine
graph retrieval with a Gemma 4 agent" is a combination. "Call-graph reranking,
not embedding similarity, explains the gain on multi-file issues" is a claim.

Make the delta legible in the first two pages. A related-work matrix with a
final column headed "what this paper does differently" is worth more than a
paragraph of prose.

### 2.2 Quality and generalization

The Quality criterion is where competition papers most often fail. The rubric
asks how general and universal the approach is beyond the competition, whether
it translates to other similar problems, and how well it generalizes. A paper
that reports a gain on the 129 public tasks and stops has answered none of
those questions.

There are four affordable generalization tests, in increasing cost:

1. **Per-repository breakdown.** Show the effect on fastapi, rich, requests,
   and httpx separately. A gain that exists only in one repository is a
   repository-specific finding, which is still interesting if you say so.
2. **Budget sensitivity.** Rerun at a shorter and a longer tool budget. If the
   effect disappears when the budget changes, the mechanism is probably a
   budget artifact.
3. **Model transfer.** Rerun on a second Gemma 4 size (E2B, E4B, 12B, 31B) or
   on the base model without your adapter. A mechanism that only works at one
   scale is a scale-specific finding.
4. **Task-family transfer.** Apply the method to a related task that was not in
   the competition, such as function-level localization, test generation, or
   code review. Even a small external set is stronger evidence than another
   split of the same public tasks.

You do not need all four. One well-chosen test, reported honestly, is enough
to move Quality from a 2 to a 4. The key is to state the scope condition:
"the effect is largest on multi-file issues and disappears on single-file
tasks" is a stronger scientific claim than "the method works."

### 2.3 Relevance

Relevance is not the same as importance. The rubric asks about significance
and potential impact on software engineering and agentic learning. A paper on
a niche prompt trick can be relevant if it addresses a real workflow, and a
paper on a general reasoning method can be irrelevant if no one can use it.

The strongest relevance arguments in this competition are:

- **Local and offline**: the competition's premise is that advanced coding
  agents should run on consumer hardware, without internet or API models.
- **Cost**: a method that improves results at fixed compute, or matches a
  larger model at lower cost, is directly relevant.
- **Reliability**: a diagnosis of why small agents stop, loop, or mis-edit is
  relevant to anyone deploying them.
- **Reuse**: a resource that other researchers can adopt has impact beyond the
  paper's own experiments.

State the workflow, not the abstraction. "A developer with a single GPU can
run this" is more relevant than "this advances agentic learning."

### 2.4 Verifiability

The organizers define verifiability as sufficient information to understand
how an innovation works and how data was obtained, analyzed, and interpreted.
That is a documentation standard, not a reproducibility requirement: the judges
are not guaranteed to run your code, and the organizer said the full pipeline
does not need to run on "Run All." But they will look at what is present, and
a quick way to run the main result helps.

The minimum verifiability package for this competition is small:

- A public repository (GitHub is acceptable, per the organizer) with the
  method, prompts, configs, and evaluation script.
- Per-task results, not just an aggregate: task id, pass/fail, and the
  configuration that produced it.
- The exact model variant and adapter, the tool budget, the number of attempts,
  and the stopping rule.
- A statement of how the public tasks were obtained and whether any were
  excluded, and why.
- A license and a data-provenance note.

The appendix can hold the long version. The organizer confirmed that the
appendix is not used for main evaluation and should be treated as
supplementary, so do not put a load-bearing result there. Put the artifact
links and the extended tables there; keep the argument in the body.

### 2.5 Clarity

Clarity is the cheapest criterion to improve and the easiest to neglect. The
judge is reading many papers. A clear paper lets them state your claim, your
evidence, and your main caveat after reading the abstract, the first figure,
and the conclusion.

Three practical rules:

- **One claim per paper.** If the abstract contains two "we show" sentences
  about different things, choose one.
- **Three exhibits.** One main results table, one ablation, one failure
  analysis or generalization table. Everything else is appendix.
- **Numbers agree.** The abstract, the results table, and the conclusion must
  report the same values, with the same denominator.

---

## 3. Three prizes, three strategies

The three awards are not three separate competitions with separate rubrics.
Every submission is considered across all tracks, the same five criteria are
applied, and a single write-up can be considered for more than one award but
can win only one. If it wins Best Paper, it becomes ineligible for the resource
and application prizes.

| Prize | What wins it | Best-fit contribution | Evidence bar | Main risk |
|:---|:---|:---|:---|:---|
| Overall Best Paper ($15,000) | The highest average of the five criteria | A balanced empirical or conceptual contribution with a clear mechanism and generalization evidence | Strong on all five; avoid a 2 | A single weak criterion drags the average down |
| Best New Resource ($10,000) | A dataset, library, tool, or software that others can adopt and build on | Code-graph generator, local evaluation harness, trajectory dataset, benchmark, audit tool | Documentation, license, reproduction script, validation that the resource is useful and correct | A resource that is not validated or not reusable |
| Best New Application ($10,000) | A novel use case for Gemma 4, DiffusionGemma, or code graphs beyond standard benchmarks | New task family, workflow, or domain application | A working prototype plus evidence it solves a real problem | A demo without evaluation |

### 3.1 Best Paper

This is the default target and the hardest to win. The strategy is balance:
score 4 or 5 on every criterion, with one criterion as the standout. A paper
that is brilliant on Novelty but thin on Verifiability risks losing to a paper
that is solid everywhere and excellent on one.

The strongest Best Paper shape in this competition is a **mechanism paper with
a diagnostic edge**: a named method, a matched-budget comparison, an ablation
that isolates the mechanism, and a failure analysis that explains when it
breaks. The diagnostic edge is what makes it feel like research rather than a
leaderboard report.

### 3.2 Best New Resource

The resource prize is the most underrated route. The competition's own data
page reveals an open gap: the provided graphs and embeddings are documented,
but the pipeline that generated them is not released, and at least one
competitor asked publicly where it is. A well-documented, validated generator
would be a genuine resource. Other candidates:

- A local evaluation harness that reproduces the scorer's environment (the
  community thread showing gold patches passing 52/129 in a plain notebook
  versus 127/129 in a scorer-like sandbox is evidence that this matters).
- A trajectory dataset converted to the harness's tool format, with per-
  trajectory scores and license metadata.
- A benchmark for a task the competition does not cover, such as
  function-level localization, test generation, or vulnerability repair.
- An audit tool for leakage, contamination, or benchmark quality.

A resource paper still needs a claim. The claim is about the resource:
"existing graphs miss async functions, and a generator that includes them
changes localization accuracy by X" is a resource paper with a finding. "We
release a dataset" is not enough.

### 3.3 Best New Application

The application prize rewards a novel use case. The organizers give examples
such as using code graphs for writing TPU kernels, and the welcome post
mentions DiffusionGemma and code graphs beyond standard benchmarks. The bar is
evidence that the application works and matters, not just that it is novel.

Good application papers answer three questions: Who has this problem? What
does the application do that existing tools cannot? Does it work on a
representative case, with a baseline?

The risk is a demo paper: an impressive notebook with no comparison and no
failure analysis. The fix is the same as for any other paper: a baseline, a
small evaluation, and a limitation.

### 3.4 Which should you target?

Choose the prize that matches the evidence you can actually produce in the
time available:

- If you have a controlled result with an ablation and a generalization test,
  target Best Paper.
- If you have a reusable artifact with validation and documentation, target
  Best New Resource.
- If you have a working application with a real user and a small evaluation,
  target Best New Application.

You can state a target in the write-up, but the judges decide eligibility. The
organizer said all submissions are considered across all tracks, so the safest
strategy is to make the paper legible as both a paper and a resource or
application where the evidence supports it — without pretending to be
something it is not.

---

## 4. What this judge panel likely rewards

This section is inference, not official policy. The names are from the
competition page; the research areas are from public profiles and publication
records accessed on 2026-10-29. Two identities could not be resolved
confidently and are flagged rather than guessed.

| Judge | Public role and research area | Likely lens on a paper |
|:---|:---|:---|
| Elan Markowitz | Machine learning at Google; PhD from USC; works on graphs and large language models, agentic systems, inference-time compute; recent work on autonomous knowledge-graph exploration | Agentic graph navigation: does the agent use structure, or just retrieve it? |
| Bryan Perozzi | Google Research; DeepWalk, GNNs, "Talk like a Graph", hybrid graph-sequence models; recent position paper on graph learning losing relevance because of poor benchmarks | Graph methods and benchmark quality: does the evaluation measure what it claims? |
| Benedek Rózemberczki | Staff Research Scientist at Google; PyTorch Geometric Temporal, TGL, Temporal Graph Benchmark; Shapley-value graph explainability | Reusable libraries, standardized benchmarks, temporal and dynamic structure |
| Michael Galkin | Senior Research Scientist at Google; ULTRA and knowledge-graph foundation models, expressivity theory, TGB 2.0 | Generalization to unseen graphs, expressivity, open benchmark challenges |
| Hadi Hemmati | Associate Professor at York University, also listed in Google Research; software testing, debugging, repair, test-suite reduction, LLM-based code and test generation | Software-engineering validity: oracles, test quality, measurement hygiene, threats to validity |
| Ryan Holbrook | Data Scientist at Kaggle; competition developer, including this one | Reproducible submissions, verifiable scoring, participant-usable tooling |
| Ashley Oldacre | Competitions Program Manager at Kaggle | Fairness of evaluation, clean writeup standards |
| Glenn Cameron | Senior Product Marketing Manager at Google; marketing lead for Gemma | Developer impact, story, adoption |
| Yuchen Li | Identity ambiguous in public sources; a Google researcher working on LLMs and agents is the most plausible match, but this is unconfirmed | Treat as a general ML reviewer; do not assume a specific agenda |
| Majid Farhadi | Listed on the paper-track citation page alongside Holbrook and Oldacre; likely Kaggle or Google staff, otherwise unidentified | Treat as an organizer/staff reviewer; clarity and process compliance |

The panel is weighted toward graph machine learning and software engineering,
with a smaller organizer/operations contingent. Three implications follow.

### 4.1 The graph-ML cluster will judge the mechanism, not the pipeline

A paper that says "we built a code graph and used it for retrieval" is not
novel in 2026. The panel's own recent work is about graph representation,
benchmark quality, expressivity, and agentic graph navigation. They will ask
whether the graph does something a lexical baseline could not, whether the
evaluation isolates the graph's contribution, and whether the result
generalizes to an unseen graph or repository.

### 4.2 The software-engineering reviewer will judge the measurement

Hemmati's work is in testing, repair, and empirical software engineering. That
means matched budgets, valid oracles, test-suite quality, and threats to
validity matter. A paper that reports a resolve rate without saying which
benchmark population, which harness version, and which tasks were unattempted
will look naive to this reviewer even if the graph result is interesting.

### 4.3 The Kaggle staff will judge the artifact and the writeup

Holbrook and Oldacre run competitions. They care about whether the submission
is reproducible, whether the writeup is clean, and whether the artifact is
usable. A quick-run notebook, per-task results, and an annotated link list
are cheap ways to earn their confidence.

### 4.4 The near-neighbor test

The single most important novelty fact for this competition is a paper
published four days before this pack was prepared:

> Saurav Bellam, "How Do Small Coding Agents Use Code Graphs and
> Embeddings?", arXiv:2610.33958, submitted 2026-10-25.

The paper tests the exact premise the competition supplies. It ablates a
localization agent's tool set (grep only, embedding search, graph tools, all)
on SWE-bench Verified, with six Qwen3 sizes and three Gemma 4 sizes, across
79,000 episodes. Its findings:

- Structured tools roughly double grep-only localization accuracy for
  Qwen3-8B and Gemma 4 E4B.
- The gain peaks at 17–21 points for 1.7B–4B models and falls to 4–5 points
  at 32B.
- Each additional code-graph hop multiplies the odds of correct localization
  by 0.50–0.67, at every model size.
- Agents chain graph expansions in only 12–14% of episodes.
- Linear probes decode direct call edges at AUC 0.74, but a lexical baseline
  reaches 0.99; two-hop edges are at 0.57.
- A fixed repair model resolves 6–13 of 160 tasks from these localizations,
  against an oracle of 26.

The implication is blunt: the broad question "do code graphs help small
agents?" has been asked and answered. A competition paper that repeats it
without citing this work risks a low Novelty score, and a reviewer who knows
the paper may see the omission immediately.

The open space is in the paper's own limitations: teaching small models to
chain more than one hop; closing the localization-to-repair gap; understanding
how quantization changes tool use; measuring tool uptake at the 2B–4B scale;
and building evaluation that is robust to benchmark defects and memory. Those
are the questions a competitive paper should answer.

---

## 5. Choosing a contribution

The competition suggests four topic areas. Each has a different novelty bar,
a different evidence standard, and a different prize fit.

| Topic area | Example contribution | What "new" means here | Evidence the judges will expect | Best prize fit |
|:---|:---|:---|:---|:---|
| Tuning and optimization | PEFT or RL procedure for SWE agents | A mechanism that changes learning or behavior, or a controlled negative result that changes how others tune | Matched-budget comparison, multiple seeds, adapter-vs-base, cost | Best Paper |
| Code comprehension | Code-graph generation, parsing, or embedding | A representation that captures something existing graphs miss, or an analysis of what they miss | Retrieval or localization metrics, ablation of the representation, validation on a second repository | Best Paper or Best New Resource |
| Tasks and benchmarks | New task family, evaluation dataset, or resource | Coverage, difficulty calibration, leakage control, or a task that existing benchmarks cannot measure | Baseline results, validation of solvability, documentation and license | Best New Resource |
| Graph reasoning | Method or architecture for reasoning over large code graphs | A reasoning procedure that scales or generalizes where current methods do not | Ablations, scaling analysis, comparison to non-graph baselines | Best Paper |

### 5.1 Idea filters

Run every candidate idea through these seven questions. If it fails two, drop
it before spending a week.

1. **Can you state the claim in one sentence that could be false?** "Graph
   reranking improves multi-file localization" is falsifiable. "Graphs help
   agents" is not.
2. **Is there a mechanism, not just a correlation?** If you cannot explain why
   the effect should occur, you cannot design the ablation that isolates it.
3. **Does it generalize beyond the 129 public tasks?** If the only evidence is
   a public-score gain, the Quality score will be low.
4. **Can it be verified in 3,000 words plus an appendix?** If the method needs
   a 20-page derivation, it is the wrong venue.
5. **Does it use the provided assets, or explain why not?** The competition
   supplies graphs, embeddings, and graph tools. Ignoring them is allowed, but
   it invites the question of whether you engaged with the setting.
6. **Is it distinct from your main-track submission?** The paper must be
   original and unpublished. A paper that simply documents the submission may
   still be eligible, but its novelty is the submission's novelty, which is
   usually a combination of known parts.
7. **Is the data and licensing situation clean?** Competition data cannot be
   redistributed; derived labels, regenerated graphs, and agent traces may be
   released with proper licensing and citation.

### 5.2 Five paper archetypes

Most strong competition papers are one of these shapes. Pick one before you
start writing; the shape determines the experiments you need.

| Archetype | Claim shape | Experiments you need | Prize fit | Risk |
|:---|:---|:---|:---|:---|
| Mechanism paper | "X improves Y because Z" | Matched baseline, full method, ablation of Z, generalization test | Best Paper | Needs a real effect, not noise |
| Diagnostic paper | "Agents fail at Y because Z, and fixing Z changes the failure rate" | Failure taxonomy, intervention, before/after | Best Paper | Needs a representative sample |
| Resource paper | "Existing resources miss Z; our resource captures it and changes results by X" | Construction, validation, baseline use case | Best New Resource | Needs adoption evidence |
| Application paper | "Code graphs enable a new use case: Z" | Prototype, baseline, small evaluation, user relevance | Best New Application | Demo-paper risk |
| Reliability paper | "The measured effect of X is smaller than reported because of Y" | Repeated runs, variance decomposition, re-analysis | Best Paper | Must be constructive, not a critique |

The **diagnostic** and **reliability** archetypes are underused and fit this
competition unusually well, because the main track is hard and noisy. A
carefully measured negative result — for example, that LoRA adapters change
tool-call style but not resolved rate under a matched budget — is a legitimate
contribution if the measurement is rigorous and the scope is stated. The
organizers ask for "new insights, deeper understanding, or important
properties of existing methods"; a well-measured negative result is exactly
that.

### 5.3 What the community evidence suggests

Several public discussion threads point to gaps that are paper-shaped. These
are community reports, not official measurements, and should be cited as such.

- **The task is hard and the score is compressed.** The public leaderboard
  top was around 0.24 (14 of 58 leaderboard tasks; the development set has 129
  tasks), and the first-place competitor compared it to the Konwinski Prize,
  where the winner solved 9 of 120. This makes "why agents fail" a more
  promising paper than "how we got another point."
- **Public-score noise is large relative to typical gains.** One community
  analysis estimated that a single task is worth 0.017, that roughly two-thirds
  of task-by-configuration cells are "flippy," and that a claimed +9-point gain
  had p = 0.22. The practical implication: a paper that reports one run per
  configuration is not reporting evidence.
- **LoRA gains are not obvious.** One competitor reported that several
  adapters on E4B did not clearly beat the base model over repeated runs, and
  that the adapters seemed to learn style (shorter runs, fewer tool calls)
  rather than problem-solving. A controlled version of this observation would
  be a strong diagnostic paper.
- **The evaluation environment changes the answer.** A community thread
  reported that gold patches passed only 52 of 129 public tasks in a plain
  Kaggle notebook, but 127 of 129 in a scorer-like sandbox built from the
  published Dockerfile. Any paper that reports local numbers without a
  scorer-like environment is reporting an environment artifact.
- **The graph generator is not public.** A competitor asked where the graph and
  embedding pipeline lives and received no answer in the thread. A validated
  generator would be a resource contribution.
- **The provided graphs miss async functions.** The organizer confirmed that
  `async def` functions are absent from the code-graph tools, affecting some
  public fastapi and httpx tasks but no private-repo tasks. A paper that
  quantifies the effect and fixes the gap is a concrete resource or mechanism
  contribution.

The near-neighbor paper in section 4.4 raises the bar further. It already
answers the broad question and leaves five specific openings: multi-hop
chaining, the localization-to-repair gap, quantized-model behavior, tool
uptake at the smallest sizes, and evaluation that is robust to benchmark
defects. A competition paper should aim at one of those openings rather than
at the broad question.

### 5.4 Ten paper-worthy questions

These are prompts, not claims. Each can be turned into a falsifiable paper in
the time available if the data exists. The first five are the openings the
near-neighbor paper leaves; the last five are resource, application, and
reliability angles.

1. What training signal teaches a 2B–4B Gemma 4 QAT agent to chain more than
   one code-graph hop, and does it improve localization beyond the one-hop
   ceiling?
2. Can a hop-aware policy or curriculum close the localization-to-repair gap,
   where a fixed repair model resolves 6–13 of 160 tasks against an oracle of
   26?
3. How does 4-bit QAT change tool use, copying, and multi-turn behavior
   relative to the unquantized model, and which differences matter for agents?
4. Why do agents expand the graph in only 12–14% of episodes? A turn-level
   analysis of tool uptake and a minimal intervention.
5. How much of the measured resolve rate is an artifact of the evaluation
   environment? A controlled comparison of plain-notebook and scorer-like
   sandboxes.
6. Do LoRA adapters learn problem-solving or style? A matched-budget,
   repeated-run comparison.
7. What makes a task "structurally dead"? Predicting which public tasks no
   configuration will solve.
8. Are the public tasks contaminated by their upstream issue text? A leakage
   audit and a cleaned subset.
9. What does a faithful code-graph generator need to capture that the provided
   graphs miss, and does fixing it change results?
10. Which graph representation is best for which repository structure? A
    comparative study across call, import, inheritance, and test edges.

---

## 6. The 3,000-word architecture

The word limit is the hardest constraint in the competition, and it is also a
gift: it forces a single argument. The official rule is stricter than many
entrants assume: **all judged text counts, including the title, abstract,
table contents, and figure captions; figures and references do not count.**
The appendix is supplementary and outside the main evaluation. The budget
below assumes compact tables and one-clause captions.

| Section | Words | Share | What it must do |
|:---|---:|---:|:---|
| Title and subtitle | 20 | 1% | Name the mechanism and the outcome |
| Abstract | 200 | 7% | Claim, method, result, implication |
| Introduction | 400 | 13% | Problem, gap, insight, contributions |
| Related work | 350 | 12% | Position against the nearest six to ten works |
| Method | 750 | 25% | Mechanism, described well enough to reimplement |
| Experimental setup | 300 | 10% | Data, harness, baselines, metrics, repeats |
| Results | 550 | 18% | Main table, ablation, failure analysis |
| Discussion and limitations | 300 | 10% | Generalization, threats, scope |
| Conclusion | 100 | 3% | Restate the claim; add nothing new |
| **Total** | **2,970** | **99%** | |

### 6.1 What to cut

Cut in this order:

1. **Background that the judge already knows.** No history of LLMs, no
   tutorial on SWE-bench, no explanation of what a transformer is.
2. **Related work that does not change the delta.** Six to ten nearest works,
   one sentence each, then a matrix.
3. **Experimental setup that repeats the dataset page.** Cite it; spend the
   words on your protocol and your exclusions.
4. **Ablations that do not isolate the mechanism.** One good ablation beats
   four component-removal rows.
5. **The second contribution.** If the paper has two claims, one is usually
   weaker. Save it for a second write-up, if you have the evidence.

### 6.2 What not to cut

- The matched-budget statement.
- The number of runs and the variance.
- The failure taxonomy.
- The limitations paragraph.
- The artifact link and the license.

### 6.3 The one-screen test

Before submission, put the abstract, the title, and the first exhibit on one
screen. A judge who reads only that screen should be able to answer:

- What is the claim?
- What is the evidence?
- What is new?
- What is the caveat?

If any answer is missing, rewrite the abstract and the first figure, not the
appendix.

### 6.4 References, appendix, and the PDF

The official word-count rule is stricter than many entrants assume: **all
judged text counts, including the title, abstract, table contents, and figure
captions; only figures and references are excluded.** The appendix is
supplementary and the organizer said it is not guaranteed to be read, so it
should support verifiability — code links, extended tables, prompts, per-task
results — not carry the argument. Proofs should live in the main body.

There are two submission routes, and they are not equivalent:

- **Writeup route.** The Kaggle Writeup is the judged artifact. Keep all
  judged text at or under 3,000 words.
- **PDF route.** Put an arXiv-ready PDF in the Public Project Link. The
  organizer said: "In the case of a PDF submission, we will just be judging
  the PDF as the writeup… Recommend using the Kaggle writeup as an abstract."
  The PDF has the same 3,000-word limit for judged text, but the Kaggle
  Writeup body is not judged and does not count.

If you have LaTeX, equations, or complex tables, the PDF route gives better
formatting and avoids Kaggle Markdown rendering uncertainty. If you use it,
still write a self-contained abstract in the Kaggle Writeup and link the PDF
prominently. If you use the Writeup route, keep tables compact and captions to
one clause; table text counts.

LaTeX support in Kaggle Markdown is not dependable across surfaces. Inline
`$...$` and display `$$...$$` have rendered in some Kaggle pages, while
`\[ ... \]` failed in a public report. Test any equation in a draft writeup
before relying on it, or use the PDF route.

---

## 7. Section-by-section blueprint

The templates below are starting points, not prose to paste. The parenthetical
notes say what the sentence must accomplish.

### 7.1 Title and subtitle

**Purpose**: name the contribution and the setting in one line.

**Pattern**: `[Mechanism]: [Outcome] for [Setting]`, or `[Finding]: evidence
from [Benchmark]`.

**Template**: "Call-graph reranking for multi-file bug localization in small
coding agents."

**Pitfall**: a title that names the competition rather than the contribution
("Our Submission to the Gemma 4 Paper Track") tells the judge nothing and
wastes the most-read line in the paper.

### 7.2 Abstract

**Purpose**: let a judge decide in 30 seconds whether to read the paper.

**Template** (six sentences):

1. "Local coding agents promise [benefit], but [obstacle]."
2. "Prior work [approach], yet [specific gap]."
3. "We introduce [method], which [mechanism]."
4. "On [benchmark], [method] improves [metric] from [baseline] to [result]
   under a matched [budget]."
5. "[Ablation] shows that [mechanism], not [alternative], drives the gain."
6. "These results imply [implication]; we release [artifact]."

**Pitfall**: an abstract that lists three contributions and reports no number.
The judge cannot calibrate the claim.

### 7.3 Introduction

**Purpose**: motivate the problem, establish the gap, state the insight, and
list the contributions.

**Structure** (four paragraphs, about 100 words each):

1. **Problem**: the workflow and why it is hard. Cite one or two real
   deployments or benchmarks.
2. **Gap**: what existing methods do and the specific thing they miss. This is
   where the related-work delta begins.
3. **Insight**: the observation that motivates your method. "We observe that
   ..." is a strong sentence if the observation is yours.
4. **Contributions**: three or four bullets, each with a result.

**Template for the gap**: "Prior work improves [outcome] by [approach], but it
does not isolate [mechanism], so it cannot say whether [alternative] would
have produced the same gain."

**Pitfall**: a contributions list that describes activities ("we study", "we
build") rather than findings ("we show"). Use verbs that commit to a result.

### 7.4 Related work

**Purpose**: position the paper against the nearest work and make the delta
unmissable.

**Structure**: three short paragraphs, or one paragraph plus a matrix.

- Paragraph 1: the closest line of work on agentic SWE.
- Paragraph 2: the closest line of work on code graphs or retrieval.
- Paragraph 3: the difference. "Unlike these methods, we ..."

**Template**: "The closest work is [X], which [approach] on [benchmark].
Unlike X, we [difference], which lets us [capability]."

**Pitfall**: a literature-review dump that summarizes everything and
positions nothing. Six to ten nearest works is enough at 3,000 words.

### 7.5 Method

**Purpose**: let a reader reimplement the mechanism without the code.

**Structure**:

1. **Problem definition**: inputs, outputs, success condition.
2. **Representation**: what a node, edge, prompt, or trajectory is.
3. **Pipeline**: numbered steps, one sentence each.
4. **Design choices**: why this depth, rank, threshold, or stopping rule.
5. **Cost**: calls, tokens, wall-clock, memory, caching.

**Template**: "Given a repository snapshot and an issue, our pipeline first
[step], then [step], and finally [step]. The only learned component is [X];
the rest is fixed."

**Pitfall**: a method section that is a list of libraries. The judge wants the
mechanism, not the stack.

### 7.6 Experimental setup

**Purpose**: make the evaluation auditable.

**Must state**:

- Dataset: the 129 public tasks, the four repositories, any exclusions.
- Harness: the model variant, adapter, tools, context limit, time budget.
- Baselines: naive and strong, matched on budget.
- Metrics: resolved rate, per-repo breakdown, cost, time.
- Repeats: how many runs, how variance is reported.
- Compute: GPU type, hours, and whether the evaluation is local or scorer-like.

**Template**: "We evaluate on the 129 public tasks with [model] and a
[budget]-minute tool budget. All systems use the same harness, prompts, and
tool set; the only difference is [method]."

**Pitfall**: reporting a local score without saying whether the environment is
scorer-like. The community evidence shows the environment can change the
measured resolve rate by tens of points.

### 7.7 Results

**Purpose**: show the main effect, isolate the mechanism, and explain the
failures.

**Structure**:

1. **Main result**: one table, one paragraph. State the headline number and
   the comparison.
2. **Ablation**: one table or one paragraph. Show that the mechanism, not a
   confound, drives the effect.
3. **Failure analysis**: one table or figure. Categorize the residual failures
   and quantify them.
4. **Generalization**: one paragraph. The second repository, model, or budget.

**Template**: "Table 1 shows that [method] resolves [X]% of tasks, compared
with [Y]% for the strongest matched-budget baseline. Removing [component]
reduces the rate to [Z]%, which isolates [mechanism]."

**Pitfall**: narrating every row of every table. The judge can read the table;
spend the prose on what the table means.

### 7.8 Discussion and limitations

**Purpose**: state the scope, the threats, and the implications.

**Structure**: three limitations, each with a consequence and a mitigation;
then two or three implications.

**Template**: "Our evaluation has three limitations. First, [scope], so the
results may not transfer to [setting]. Second, [design choice], which isolates
[effect] but does not measure [interaction]. Third, [data risk]. We mitigate
the first by [action]; the third remains an open risk."

**Pitfall**: a generic limitations paragraph that could belong to any paper.
Name the specific threat your design creates.

### 7.9 Conclusion

**Purpose**: restate the claim and the implication. Add nothing new.

**Template**: "We showed that [claim]. The result implies [implication] for
[audience]. The artifact and per-task results are available at [link]."

**Pitfall**: introducing a new result, a new caveat, or a new claim in the
conclusion. If it matters, it belongs in the body.

### 7.10 References and appendix

**References**: 15–25 purposeful entries is typical for a 3,000-word paper.
Cite the nearest prior work, the benchmark, the model, and the evaluation
methodology. Do not cite a paper you have not read; judges in this area will
notice.

**Appendix**: prompts, extended tables, per-task results, dataset card,
license, and reproduction commands. It supports verifiability; it does not
carry the argument.

### 7.11 What winning Kaggle writeups actually look like

The paper track is judged by researchers, not product-demo judges, so the
winning patterns are a hybrid: the argument of a paper, the skimmability of a
good technical post, and the evidence discipline of a reproducibility report.
Four public exemplars show the pattern.

| Writeup | Competition | What it demonstrates |
|:---|:---|:---|
| Gemma Vision | Gemma 3n Impact Challenge, overall winner | Honest engineering: failed hardware and approach attempts with reasons, quantified fixes such as a 10x camera slowdown and a 50s-to-5s response time, a documented model weakness with a fallback, and real-user validation |
| Gemma Scout | Gemma 3n Impact Challenge | Numbers on the first screen: training scale, win rate against the base model, per-task gains; annotated project links; an explicit license and citation block |
| Agentika | Vibe Code with Gemini 3 | One-screen skimmability: problem, solution, numbered flow, feature-to-model mapping, impact, live demo |
| "What Makes a Winning Kaggle Team?" | Meta Kaggle Hackathon 2025 | Research-paper shape: objective and metric, key questions, methodology with leakage-aware cross-validation, quantified insights, conclusion |

Eight tactics recur:

1. **Put the headline number on the first screen.** The abstract or opening
   paragraph should contain the claim and the result, not a table of contents.
2. **Mirror the rubric vocabulary in headings.** Give each criterion an
   obvious home: a novelty paragraph, a method section, an evaluation section,
   a related-work section, and a limitations section. The judge should never
   have to infer which criterion a section serves.
3. **Use real Markdown tables, not screenshots.** Table text counts toward the
   word limit, so keep cells short; a screenshot of a table is unverifiable and
   reads as low effort.
4. **Annotate project links.** Each link card gets one line explaining what it
   is and why it matters: code, dataset, notebook, demo, PDF.
5. **Show the failed attempts.** A short "what did not work" paragraph with
   reasons is a Quality signal, not a weakness. It shows you searched the
   space rather than cherry-picked one configuration.
6. **Provide a fast verification path.** A two-minute evaluation-only notebook
   or a `make eval` target is enough; the full training run can remain
   optional, and the organizer explicitly endorsed this.
7. **Declare the prize lens.** All entries are considered across all prizes,
   and the criteria are applied in the context of each prize. If the work is a
   resource or an application, say so in the subtitle or abstract.
8. **Submit early and verify the status.** The tie-break is original
   submission time, and Kaggle has a documented history of writeups that
   looked submitted but were still drafts. Check the Writeups tab for a
   submitted badge well before the deadline.

The common thread is that the writeup is treated as **proof of work**, not as
a pitch. The judges are trying to determine whether the result is real, not
whether the project is exciting.

---

## 8. The verifiability package

The organizer said the judges will likely look at any code that is present,
but running it is not guaranteed. That means the artifact should be **legible
without execution**: a reader should be able to see what was run, on what
data, with what settings, and what came out. A quick-run path is a bonus, not
a substitute for documentation.

| Artifact | Minimum | Strong | Why it matters |
|:---|:---|:---|:---|
| Code repository | Method and evaluation script | Clean install, pinned dependencies, one-command run | Lets a reader check the implementation |
| Prompts and configs | System prompt, tool definitions, sampling parameters | Versioned configs with the exact values used for each table | Prompt changes are method changes |
| Per-task results | CSV of task id and pass/fail | Per-task id, pass/fail, attempts, time, patch hash, failure category | Turns an aggregate into evidence |
| Repeats and logs | Number of runs and range | Per-run logs, seeds, variance decomposition | Separates effect from noise |
| Evaluation environment | Description of the harness | Dockerfile or scorer-like sandbox, with versions | The environment can change the measured rate |
| Model and adapter | Exact variant and adapter hash | Adapter files, training data description, license | Reproducibility and provenance |
| Notebook | A public notebook that reads the results | A notebook that reruns the main table in minutes | A fast path for a skeptical judge |
| Resource card | What the resource contains and its license | Datasheet-style documentation, intended use, limitations | Makes a resource reusable |
| Data provenance | Source, license, exclusions | Upstream commit hashes, regeneration script, audit | Makes the data checkable |
| Compute disclosure | GPU type and hours | Per-experiment compute and cost | Makes the result comparable |

### 8.1 The quick-run path

A judge who wants to check the main table should not need a cluster. Provide
one of these:

- A notebook that loads the released per-task results and regenerates Table 1
  in under ten minutes.
- A `make eval` target that runs a small subset of tasks end-to-end.
- A replay harness that takes logged contexts and reproduces the pass/fail
  decisions without rerunning the model.

The organizer's reaction to a quick-run path was positive: "having a quick way
to run your code sounds like a good idea to me." It is not required, but it is
cheap insurance for the Verifiability score.

### 8.2 What not to release

- Competition task statements, gold patches, or test patches.
- The provided graphs or embeddings as a redistributed dataset.
- Agent traces containing problem statements or hints, unless removed and
  licensed.
- Any data you do not have the rights to redistribute.

Derived labels, regenerated graphs, and sanitized traces are permitted with
licensing and citation, per the organizer. When in doubt, release the code
that regenerates the artifact from public sources, not the artifact itself.

### 8.3 How to describe data provenance

A single paragraph in the setup section is enough:

> We use the 129 public development tasks released with the competition. We
> exclude [N] tasks for [reason]. The repository snapshots are used at the
> published base commits. Our derived localization labels are released under
> [license]; they contain file and symbol paths only, with no problem
> statements, patches, or test content. The competition dataset itself is not
> redistributed.

That paragraph is worth more than a page of appendix.

### 8.4 The minimum verifiability package

The package below maps each disclosure to the organizer's definition —
sufficient information to understand how the innovation works and how data was
obtained, analyzed, and interpreted. Nothing in it requires a working training
pipeline.

| Element | What to disclose | Why it matters |
|:---|:---|:---|
| Evaluation protocol box | The PASS/FAIL rule (patch applies and all FAIL_TO_PASS and PASS_TO_PASS tests pass), the task-ID list, public/hidden disjointness, and the denominator policy: all tasks scored, with timeout, patch rejection, and parse failure counted as unresolved rather than excluded | Makes the score re-derivable and closes the "only attempted tasks" loophole |
| Scaffold disclosure | Model and adapter checkpoint IDs, prompts verbatim, tool list, context and truncation policy, retry policy (including "none"), 12-hour budget accounting, harness version, and container image digest | The scaffold is part of the method; without it the result is not attributable |
| Data provenance and licenses | Datasheet-style description of the tasks and assets; upstream licenses; the encoder used for the 256-dimensional embeddings; how derived labels were built | Directly matches the Verifiability definition |
| Results | Resolved rate with a confidence interval once, per-repository table, difficulty strata, failure-taxonomy counts, cost columns, a paired test for every A-over-B claim, and at least one ablation per claimed mechanism | Turns the headline into evidence a judge can audit |
| Reproducibility artifacts | Code, configs, and logs at a permanent link (a GitHub release plus a Zenodo or Software Heritage identifier), a one-command rescore, and a determinism and seed statement | Lets a reader check the main table without a cluster |
| Limitations and contamination | Memorization risk for these four repositories, a task-quality spot check, and the public-versus-hidden delta if available | Preempts the objection a benchmark-literate judge will raise |

**Nice to have**: multi-run seed variance for any stochastic step, bootstrap
intervals per repository, a second benchmark as an external anchor, uniformly
sampled trajectories rather than cherry-picked ones, a Croissant metadata
file, and a README sized to the ACM "Artifacts Available" and "Artifacts
Functional" descriptions.

**Not needed here**: IRB or crowdsourcing statements, a formal artifact-badge
audit, packaging for an "Artifacts Reusable" badge, a model card for a model
you did not train, or releasing the hidden test set.

### 8.5 Statistical reporting at n = 129

The competition's public set is 129 tasks. That number has consequences:

- The worst-case binomial standard error on a resolved rate near 50% is about
  4.4 percentage points; a 95% confidence interval spans roughly ±8.6 points.
  A two-point difference between two single runs is well inside that interval.
- For an A-versus-B comparison on the same tasks, use a paired analysis
  (McNemar's test or a paired bootstrap) and report the number of discordant
  pairs. The two marginal rates are not enough.
- Per-repository cells are 20–50 tasks. Treat them as exploratory and do not
  rest a headline claim on one.
- Absolute agent scores drift when the scaffold or harness changes, even when
  the rank order is stable. Report deltas, intervals, and the harness version;
  avoid comparing your absolute number to a number from a different scaffold.
- Report cost per resolved task (tokens, wall-clock, and tool calls). A method
  that buys two points for three times the compute is a different contribution
  from one that is free.

A paper that reports a single run per configuration and a two-point gain is
not reporting evidence. A paper that reports a paired comparison, an interval,
and a cost column is.

---

## 9. Rules, prize mechanics, and submission traps

Most disqualifications and lost points in competition papers come from
mechanics, not from bad science. The table below collects the rules that
matter and the action each implies.

| Trap | What the rule says | What to do |
|:---|:---|:---|
| Unpublished requirement | Submissions must be original, unpublished research | Do not submit a paper under review elsewhere; arXiv preprints are allowed, and a substantially extended study following a public pilot is acceptable |
| Word count | 3,000 words maximum; all judged text counts, including title, abstract, table contents, and figure captions; figures and references do not count | Count the whole judged body, not just the prose; keep tables and captions short |
| Missing required sections | Title and subtitle, abstract, introduction, research description with methods and experiments, related works and citations | Use the five-part skeleton even if you rename the sections |
| Draft submission | Unsubmitted or draft Writeups at the deadline are not judged | Save, submit, and confirm the entry appears as submitted |
| Submitted status | Kaggle has a documented history of writeups that looked submitted but were still drafts | Check the Writeups tab for a submitted badge, not just the editor state |
| PDF route | If a PDF is submitted, the judges judge the PDF as the writeup; the Kaggle Writeup can be an abstract; the PDF has the same 3,000-word limit for judged text | Decide the route before drafting; do not assume the PDF escapes the word limit |
| Private resources | Attaching a private Kaggle resource to a public writeup makes it public after the deadline | Do not attach anything you want to keep private until the main competition ends |
| Two write-ups | A team may submit at most two; one submission track; judges decide prize eligibility | Plan one primary paper and one backup; the form may require unsubmitting the first before submitting a second |
| Tie-break | Ties are expected to be rare; if one occurs it would likely be broken by original submission time | Submit a complete version early; do not rely on last-minute edits |
| Prize cross-eligibility | A write-up can be considered for multiple prizes but can win only one; Best Paper winners become ineligible for the other two | Pick a primary target but write so the work is legible to all three panels |
| Competition data | Competition data must not be redistributed | Do not publish task statements, gold patches, test patches, or the provided graphs as your own dataset |
| Derived artifacts | Organizer: derived labels, regenerated graphs, and agent traces may be published with proper licensing and citation | Include a license, upstream notices, and a clear statement of what was derived |
| Public accessibility | Attached notebooks and links must be public and login-free | Test the link in a private browser window before submitting |
| Non-archival | Submission does not prevent submission to conferences or other venues | You can submit the same work elsewhere; check the other venue's dual-submission policy |
| Main-track IP | Code is not required for the paper; the paper is judged before the main competition ends, and attached private resources auto-publish | If you are protecting a main-track solution, withhold the code and release per-task results and prompts instead |

### 9.1 The two-write-up ambiguity

The official answer is that a team may submit at most two write-ups. A
participant then reported that the submission form blocks a second live entry:
"You've already submitted to this competition. To submit this writeup, you'll
first need to unsubmit your previous writeup." A follow-up thread asking
whether two can be live at once was unanswered when this pack was prepared.

Plan for one primary submission. If you have two genuinely distinct
contributions, prepare both and try to submit the second early; if the form
blocks it, keep the stronger one live and preserve the other as a local draft
for a later venue. Do not assume the two-write-up allowance means two entries
will be judged simultaneously.

### 9.2 The tie-break is a submission-time incentive

The organizer said ties are expected to be extremely unlikely because top
papers will be read by multiple judges, and that if a tie occurs it would
likely be broken by original submission time. The practical implication is
simple: submit a complete, defensible version by November 10, then improve it
only if the improvement is unambiguous. An early submission with a clear
argument beats a late submission with a polished abstract and an unverified
number.

### 9.3 What you may publish

The organizer confirmed three permissions that matter for a resource or
diagnostic paper:

- **Derived labels** — function- or class-level localization labels without
  problem statements, patches, or test content — may be published.
- **Regenerated graphs** — graphs built from public upstream repositories,
  with appropriate licensing and citation, may be published, provided they do
  not redistribute the competition's graphs or embeddings.
- **Agent traces** — traces from public training tasks may be published with
  upstream license citations, provided problem statements and hints are
  removed and gold/test patches are never included.

These permissions make a Best New Resource entry feasible without violating
the competition's data rules. They do not permit publishing the competition
dataset itself.

---

## 10. The fourteen-day plan

Today is 2026-10-29. The deadline is 2026-11-12 at 23:59 UTC. The plan below
assumes one person working part-time, or a small team. It front-loads the
experiments because the writing is easier to compress than the evidence.

| Date | Day | Focus | Output |
|:---|---:|:---|:---|
| Oct 29 | 0 | Choose archetype and claim; inventory evidence | One-page outline with a one-sentence claim |
| Oct 30 | 1 | Define evaluation protocol; set up baseline and harness | Reproducible baseline command; list of baselines |
| Oct 31 | 2 | Run baseline and first method version | First results table, even if incomplete |
| Nov 1 | 3 | Repeat runs; run the ablation | Variance estimate; ablation table |
| Nov 2 | 4 | Generalization test: second repository, model, or budget | One transfer result |
| Nov 3 | 5 | Failure taxonomy; error analysis; figures | Failure table; first two figures |
| Nov 4 | 6 | Draft method, setup, results | 1,500 words of technical draft |
| Nov 5 | 7 | Draft introduction and related work; go/no-go review | Full draft; decision to keep or pivot |
| Nov 6 | 8 | Draft abstract, discussion, conclusion; internal review | Complete draft |
| Nov 7 | 9 | Cut to 3,000 words; verify every number | Submission-length draft |
| Nov 8 | 10 | Release code, prompts, configs, per-task results; license | Public artifact and quick-run path |
| Nov 9 | 11 | Final proofread; table and figure QC; references | Polished draft and artifact |
| Nov 10 | 12 | Submit a complete version; record timestamp | Submitted entry |
| Nov 11 | 13 | Optional polish; only if clearly better | Updated entry, if justified |
| Nov 12 | 14 | Deadline day buffer; confirm submission | Confirmation |

### 10.1 The go/no-go checkpoint

On November 5, ask one question: **do I have a credible effect or a credible
measurement?**

- If yes, keep writing the mechanism or diagnostic paper.
- If the effect is small and the variance is large, pivot to a reliability
  paper: report the measurement, the variance, and what it implies for the
  community. A well-measured null result is a paper.
- If the method did not work and the measurement is not yet credible, pivot to
  a resource paper using the artifact you built: the harness, the evaluation
  environment, the trajectory dataset, or the generator.

The worst outcome is a paper that claims a positive result the data cannot
support. An honest negative or resource paper scores better on Verifiability
and Clarity than an overclaimed positive one.

### 10.2 Daily cadence

- Two hours of experiments or analysis.
- Two hours of writing, in the order method → results → introduction →
  related work → abstract.
- One hour of verification: numbers against tables, links against a private
  browser, word count against the limit.

Writing every day prevents the final-week compression that produces vague
prose and inconsistent numbers.

---

## 11. Red flags and what a 5 looks like

### 11.1 Red flags

| Red flag | Why it hurts | Fix |
|:---|:---|:---|
| No matched-budget baseline | The comparison may be a budget artifact | Match model, tools, and time; state the budget in the table |
| One run per configuration | Public-score noise is large relative to typical gains | Repeat the headline comparison; report the range |
| No ablation | The mechanism is asserted, not shown | Add one manipulation that isolates the new part |
| Leaderboard-only claim | Quality and Relevance both suffer | Add a generalization test and a workflow implication |
| Argument lives in the appendix | The organizer said the appendix is not guaranteed to be read | Move the claim and the main evidence into the body |
| "State of the art" without hidden-test evidence | Overclaiming is easy to detect | Say "on the public tasks" and state the scope |
| Ignores the provided graphs and embeddings | Looks like you did not engage with the setting | Use them, compare to them, or explain why not |
| Repackages the main-track submission | Novelty is the submission's novelty, usually a combination | Name the new insight and test it |
| No limitations | Reviewers read it as either naivety or concealment | Three limitations, each with a consequence |
| Over the word count | A rule violation, not a style issue | Cut background and related work first |
| No artifact | Verifiability drops to a 2 | Release code, prompts, configs, and per-task results |
| Undefined acronyms and inconsistent terms | Clarity drops with every ambiguity | Define once; use the same term everywhere |
| Comparing numbers across benchmark populations | Lite, Verified, Pro, and the competition's 129 tasks are different denominators | Pin the population, harness version, and denominator in every table |
| No leakage or contamination paragraph | Reviewers assume the worst when it is not addressed | State the split, what the model saw, and what you could not rule out |
| Attaching a private Kaggle resource | It becomes public after the deadline | Do not attach anything you want to keep private |
| Assuming a saved writeup is submitted | Drafts are not judged; Kaggle has a history of status confusion | Check the Writeups tab for a submitted badge |
| Claiming more than the evidence supports | "First" and "state of the art" invite a search for counterexamples | Say what the evidence shows and state the scope |

### 11.2 What a 5 looks like

| Criterion | A 5 paper does this |
|:---|:---|
| Novelty | States one insight a reader could not have guessed, contrasts it with the nearest work, and isolates it with an experiment |
| Quality | Shows the effect on a second repository, model, or budget; states where it should not work |
| Relevance | Connects the result to a concrete developer workflow, cost, or reliability problem |
| Verifiability | Releases code, prompts, configs, per-task results, repeats, and the exact protocol; a reader could rerun the main table |
| Clarity | The abstract, first figure, and conclusion tell the same story with the same numbers; a skimming judge can state the claim and the caveat |

---

## 12. Open questions and sources

### 12.1 What is still unresolved

| Question | Status as of 2026-10-29 | What to do |
|:---|:---|:---|
| Can two write-ups be live at the same time? | The organizer confirmed a maximum of two write-ups per team, but a participant reported the form requires unsubmitting the first; a follow-up thread was unanswered | Plan one primary write-up; prepare a second only if the form accepts it |
| Can a submitted write-up be edited after the deadline? | Unanswered | Submit a complete version; do not plan to add the code later |
| Do table contents and captions count toward 3,000 words? | The organizer said all judged text counts, including tables and captions; figures and references do not; no official counter exists | Keep a 5–10% buffer and count the whole judged body |
| Does LaTeX render in the writeup editor? | Inline and display dollar signs have worked in some Kaggle surfaces; `\[ \]` failed in a public report | Test in a draft, or use the PDF route |
| Are write-ups public before judging ends? | Kaggle documentation says hackathon submissions are private until the event ends | Do not rely on early visibility; protect IP accordingly |
| Who are Yuchen Li and Majid Farhadi? | Public identities are ambiguous or limited | Treat them as general ML and organizer reviewers; do not tailor to a guessed agenda |
| Are the five criteria equally weighted? | The page says each is scored 0–5 and the final score is the average | Optimize the average; do not assume hidden weights |

### 12.2 Official, inferred, and community evidence

- **Official**: the competition overview, evaluation, submission requirements,
  prizes, timeline, and the organizer's replies on the discussion board. These
  are cited with URLs in `04-sources.md`.
- **Inferred**: the judge-taste analysis in section 4, the prize strategy in
  section 3, and the presentation tactics in section 7.11. They are reasoned
  from public profiles and the rubric, not from organizer statements.
- **Community**: the main-track score, noise analysis, LoRA experience, and
  local-evaluation thread are competitor reports, not official measurements.
  They are labelled in the text and should be treated as signals.

### 12.3 Sources

The full source register is in `04-sources.md`, grouped into official
competition pages, writing-craft sources, rigor and reproducibility sources,
Kaggle mechanics, and the technical context. Each entry records the publisher,
date, URL, and what it supports.

The one-sentence summary of this playbook: **write a paper that would still be
interesting if the competition did not exist.** The rubric rewards exactly
that, and the judges are the people who would read it.


---

<!-- ====================================================================== -->
<!-- FILE: 03-templates-and-checklists.md -->
<!-- ====================================================================== -->

# Templates and checklists

*Companion to `01-whitepaper-essentials.md` and `02-gemma4-paper-track-playbook.md`.
Everything here is designed to be copied, filled in, and cut down. The worked
examples are illustrative, not reported results.*

---

## 1. Title formulas

A title has two jobs: name the contribution and make a skimming judge want the
abstract. The subtitle carries the qualifier that keeps the title honest.

| Formula | Pattern | When to use |
|:---|:---|:---|
| Mechanism + outcome | `[Mechanism]: [Outcome] for [Setting]` | You have a named method with a measurable effect |
| Finding + scope | `Why [small models] fail at [subtask]: evidence from [benchmark]` | Diagnostic or negative-result paper |
| Resource | `[Name]: an open [dataset/tool/benchmark] for [purpose]` | Best New Resource entry |
| Application | `[Use case] with [representation]: a case study on [domain]` | Best New Application entry |
| Method + constraint | `[Method] improves [metric] without [cost]` | Efficiency, locality, or budget-constrained work |

Avoid: "A Comprehensive Study of...", "Towards...", "An Empirical Analysis
of..." unless the paper really is a broad study. They signal a survey, not a
contribution.

---

## 2. Abstract template

Write six sentences, in this order. If a sentence cannot be written, the paper
does not yet have an argument.

1. **Context**: what practitioners want, and why it is hard.
2. **Gap**: what existing approaches do, and the specific thing they miss.
3. **Approach**: what you introduce, in one clause.
4. **Evidence**: the benchmark, the number, and the comparison.
5. **Mechanism**: the ablation or analysis that shows *why* the number moved.
6. **Implication and scope**: what follows, and what you do not claim.

### Worked example (illustrative)

> Local coding agents could bring autonomous software engineering to consumer
> hardware, but small models struggle to navigate large repositories. Prior work
> improves prompts or fine-tunes on agent trajectories, yet neither isolates
> which repository context actually helps. We introduce GraphRerank, a
> training-free reranker that reorders retrieved functions using the provided
> AST call graph. On 129 public tasks across four Python repositories,
> GraphRerank raises resolved rate from 18.4% to 24.1% with the same model and
> tool budget; a graph-shuffle ablation removes most of the gain. The effect is
> largest on multi-file issues, where call-graph context is most informative.
> We release the reranker, prompts, and per-task results.

Why it works: one claim, one mechanism, one benchmark, one ablation, one
release. No "state of the art" claim that the evidence cannot support.

---

## 3. Contribution bullets

Use three or four bullets, each with a verb and a falsifiable object.

| Weak | Stronger |
|:---|:---|
| We study code graphs. | We show that call-graph reranking, not embedding similarity, drives the gain on multi-file issues. |
| We fine-tune Gemma 4. | We show that LoRA on 1.4k filtered trajectories changes tool-call style but not resolved rate under a matched budget. |
| We build a benchmark. | We release a 129-task localization benchmark with leakage checks, license metadata, and a one-command evaluation script. |
| We achieve good results. | We improve resolved rate by 5.7 points over the strongest matched-budget baseline, with 3 seeds and per-repo breakdowns. |

The stronger versions are specific enough to be wrong. That is the point.

---

## 4. The 3,000-word outline

The Kaggle Paper Track caps the writeup at 3,000 words of judged text.
References and figures do not count; tables and figure captions do.
That is roughly a five-page workshop paper. The outline below lands at about
2,970 words.

| Section | Words | Job |
|:---|---:|:---|
| Title and subtitle | 20 | Name the mechanism and the outcome |
| Abstract | 200 | Claim, method, result, implication |
| Introduction | 400 | Problem, gap, insight, contributions |
| Related work | 350 | Position against the nearest six to ten works |
| Method | 750 | Mechanism, described well enough to reimplement |
| Experimental setup | 300 | Data, harness, baselines, metrics, repeats |
| Results | 550 | Main table, ablations, failure analysis |
| Discussion and limitations | 300 | Generalization, threats, scope |
| Conclusion | 100 | Restate the claim; add nothing new |
| **Total** | **2,970** | |

If you are over budget, cut related work and setup first, not the ablation or
the limitations. A judge can look up prior work; they cannot look up the
experiment you did not report.

---

## 5. Method section template

1. **Problem definition**: inputs, outputs, and the success condition.
2. **Representation**: what a node, edge, prompt, or trajectory is.
3. **Pipeline**: numbered steps, one sentence each, with the data flow.
4. **Design choices**: why this retrieval depth, this adapter rank, this
   stopping rule; what you tried and rejected.
5. **Cost**: model calls, tokens, wall-clock, GPU memory, and what is cached.
6. **What is fixed vs learned**: prompts, weights, thresholds, schedules.

A reader should be able to draw the pipeline from your description without
seeing the code. If they need the code to understand the method, the method
section has failed the Verifiability criterion.

---

## 6. Results table schemas

The tables below are illustrative schemas, not reported results. Use them to
decide which columns to collect before you run the experiments.

### Table 1: Main results

| System | Model | Budget | fastapi | rich | requests | httpx | Overall resolved | 95% CI |
|:---|:---|:---|---:|---:|---:|---:|---:|---:|
| Base agent | Gemma 4 E4B | matched | 12.0 | 41.0 | 23.0 | 0.0 | 18.4 | 12.1–24.7 |
| Strongest baseline | Gemma 4 E4B | matched | 14.0 | 43.0 | 25.0 | 0.0 | 20.2 | 13.7–26.7 |
| Ours | Gemma 4 E4B | matched | 18.0 | 47.0 | 31.0 | 100.0 | 24.1 | 17.0–31.2 |

Report percentages and raw counts; define the denominator; state the number of
repeats. Do not report only the best run.

### Table 2: Ablation

| Variant | Resolved | Delta vs full | What it isolates |
|:---|---:|:---|:---|
| Full method | 24.1 | — | Everything on |
| No graph reranking | 19.3 | -4.8 | Contribution of the graph |
| Shuffled graph | 20.1 | -4.0 | Whether graph structure, not graph presence, matters |
| No embedding retrieval | 21.0 | -3.1 | Contribution of semantic recall |

### Table 3: Failure taxonomy

| Failure mode | Count | Share of failures | Representative symptom |
|:---|---:|---:|:---|
| Wrong file localized | 34 | 40% | Patch edits a plausible but untested module |
| Test never run | 21 | 25% | Agent stops after editing |
| Correct fix, malformed patch | 12 | 14% | Diff does not apply |
| Regression introduced | 9 | 11% | Previously passing test fails |
| Other | 8 | 10% | Timeout, policy refusal, infrastructure |

A failure table is often more persuasive than another success table. It shows
you understand the system rather than the leaderboard.

---

## 7. Related-work matrix

Build this before writing the section. Six to ten rows is enough.

| Work | Setting | Method | Evaluation | What it leaves open |
|:---|:---|:---|:---|:---|
| SWE-agent | Repo-level bug fixing | Agent-computer interface | SWE-bench | Small local models, graph context |
| OpenHands | General SWE agent | Sandboxed tool use | SWE-bench | Compute-constrained settings |
| Agentless | Bug fixing | Two-stage localize and repair | SWE-bench | Multi-turn interaction |
| RepoGraph | Repo understanding | Graph retrieval | SWE-bench | Embedding quality, small models |
| This paper | Local Gemma 4 agent | Graph reranking | 129-task subset | Generalization beyond Python |

The last column is the paper. If you cannot fill it for a row, drop the row.

---

## 8. Limitations paragraph template

> Our evaluation has three limitations. First, all tasks come from four Python
> repositories, so the results may not transfer to statically typed or
> monorepo settings. Second, we hold the model and tool budget fixed, which
> isolates the effect of graph reranking but does not measure its interaction
> with a larger model. Third, the public and hidden sets are drawn from the
> same curation pipeline, so a distribution shift in the hidden set would
> weaken the absolute numbers. We mitigate the first by reporting per-repo
> results and the second by releasing the harness; the third remains an open
> risk.

Three limitations, each with a consequence and a mitigation. Do not write
"our method has limitations" and stop.

---

## 9. Rubric self-score sheet

Score honestly before submitting. A 4 in every row beats a 5, 3, 3, 2, 4.

| Criterion | Score (0–5) | Evidence in the paper | Weakest link | Fix before submission |
|:---|:---|:---|:---|:---|
| Novelty |  |  |  |  |
| Quality / generalization |  |  |  |  |
| Relevance |  |  |  |  |
| Verifiability |  |  |  |  |
| Clarity |  |  |  |  |
| **Average** |  |  |  |  |

Prompts for each row:

- **Novelty**: can you state the new idea in one sentence that a reviewer could
  not have guessed from the title of the nearest prior work?
- **Quality**: what evidence shows the method works outside the exact
  benchmark configuration you tuned on?
- **Relevance**: who would change what they do because of this paper?
- **Verifiability**: could a competent reader reproduce the main number from
  the paper, the code, and the released configs?
- **Clarity**: can a reader who skims the abstract, figures, and conclusion
  state your claim and your main caveat?

---

## 10. Pre-submission checklist

### Argument

- [ ] One-sentence claim appears in the abstract and the introduction.
- [ ] Every contribution bullet maps to a section and a result.
- [ ] The conclusion claims no more than the results support.
- [ ] The paper says what it does *not* show.

### Evidence

- [ ] At least one naive and one strong baseline, both matched on budget.
- [ ] At least one ablation that isolates the proposed mechanism.
- [ ] Repeats or confidence intervals for the headline number.
- [ ] Per-repo or per-task breakdown, not just an aggregate.
- [ ] Failure taxonomy or error analysis.
- [ ] Numbers in the abstract match the results table exactly.

### Verifiability

- [ ] Code, prompts, configs, and per-task results are linked.
- [ ] The link works without a login or paywall; test in a private window.
- [ ] The evaluation command is documented and takes minutes, not hours.
- [ ] Data provenance, license, and any derived labels are stated.
- [ ] No competition data, gold patches, or test patches are redistributed.

### Presentation

- [ ] Title names the contribution, not the competition.
- [ ] Abstract is under 200 words and contains a number.
- [ ] Three figures or tables carry the argument; the rest are appendix.
- [ ] Every table has a caption that states n and metric.
- [ ] References are complete and recent enough to include the nearest work.
- [ ] Word count is at most 3,000 judged words, including tables and captions; figures and references excluded.
- [ ] Appendix is supplementary, not load-bearing.

### Submission

- [ ] Competition rules accepted; team formed before the merger deadline.
- [ ] Writeup saved and submitted, not left as a draft.
- [ ] Public notebook or PDF link attached and publicly accessible.
- [ ] Submission timestamp recorded; confirm the entry appears as submitted.
- [ ] A complete version is submitted early, before the final polish.

---

## 11. Table and figure QC checklist

Run this on every table before publishing.

| Check | Why it matters | Pass condition |
|:---|:---|:---|
| Blank line before the table | GFM will not render a table glued to a paragraph | One empty line above the header row |
| Header and delimiter rows | The delimiter row is what makes it a table | Header row, then a dash-delimited row, then body |
| Consistent cell count | A missing pipe shifts every later cell | Every row has the same number of pipes |
| Delimiter alignment | `:---`, `---:`, `:---:` control alignment | Intentional per column; same on every table |
| Escaped pipes | A literal pipe character inside a cell breaks the grid | Use a comma, semicolon, or HTML entity instead |
| Units and denominators | "24.1" is meaningless without them | Caption states metric, n, and budget |
| Consistent precision | Mixed decimals look careless | Same number of decimals within a column |
| No trailing whitespace | Some renderers treat it as a line break | No spaces after the final pipe |
| Caption above or below | Readers skim captions, not tables | Caption states what, where, and n |

### Figure checklist

- [ ] The figure is readable at the width it will be displayed.
- [ ] Axes are labelled with units; the metric is defined in the caption.
- [ ] The comparison is visual, not decorative: a bar chart for categories, a
      line chart for trends, a scatter for trade-offs.
- [ ] Error bars or ranges are shown when the claim is about a difference.
- [ ] Colour is not the only encoding; the figure works in grayscale.
- [ ] The caption states the takeaway, not just the axes.

---

## 12. Submission-day checklist

- [ ] Read the current competition overview once more; deadlines and rules can
      change.
- [ ] Confirm the writeup is submitted, not merely saved.
- [ ] Confirm the attached notebook or PDF is public and login-free.
- [ ] Record the submission timestamp; ties may be broken by original
      submission time.
- [ ] Keep a local copy of the exact submitted text and links.
- [ ] Do not edit the writeup after the deadline.
- [ ] If submitting two writeups, confirm the form accepts both; otherwise
      keep one primary submission live.


---

<!-- ====================================================================== -->
<!-- FILE: 04-sources.md -->
<!-- ====================================================================== -->

# Sources

*All web sources were accessed on 2026-10-29. Publication dates are given where
the source states one. "Fetched" means the page was read directly on that date;
"via search" means the claim rests on a search snippet or a secondary summary
and should be re-checked before quoting.*

Confidence tags:

- **High** — read on the primary page on 2026-10-29.
- **Medium** — corroborated by a secondary source or a partial page.
- **Low** — single snippet or inference; do not cite without re-checking.

---

## 1. Official competition sources

These are the load-bearing sources for every competition-specific claim.

### 1.1 Competition pages

- **Google – The Gemma 4 Developer Agent Paper Track**, Kaggle, fetched
  2026-10-29. <https://www.kaggle.com/competitions/gemma-4-developer-agent-paper>
  — rubric, prizes, 3,000-word limit, required writeup elements, timeline,
  topics, judges, participation counts. **High.**
- **Google – The Gemma 4 Developer Agent Competition**, Kaggle, fetched
  2026-10-29. <https://www.kaggle.com/competitions/gemma-4-developer-agent/overview>
  — main-track task, model variants, ADK submission format, PASS/FAIL scoring,
  12-hour budget, prizes. **High.**
- **Main competition data page**, Kaggle, fetched 2026-10-29.
  <https://www.kaggle.com/competitions/gemma-4-developer-agent/data> — 129
  public tasks, four repositories, snapshots, NetworkX AST graphs, 256-dim
  embeddings, graph tools, offline wheels, dataset generation and verification
  pipeline. **High.**
- **Paper-track data and code tabs**, fetched 2026-10-29 — the data tab is a
  404 and the code tab is empty; the paper track has no dataset of its own.
  **High.**

### 1.2 Organizer clarifications on the discussion board

Base URL: `https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/<id>`

- **/743012 — "Welcome to the Gemma 4 Developer Agent Paper Track"**, Elan
  Markowitz, ~2026-09-22. The track explores "the how and why"; welcomes
  methodological insights and detailed project writeups; topics include novel
  applications with Gemma 4, DiffusionGemma, or code graphs; does not require
  main-track participation. **High.**
- **/749546 — "Word Count"**, organizer reply 2026-10-27. References do not
  count; the appendix is supplementary and not guaranteed to be read. **High.**
- **/743255 — word-count and PDF clarification**, organizer comment. "The PDF
  will have the same word limit. All 'judged' text is included in the word
  count except figures and references… title and abstract will, captions, and
  tables will count." Also: "In the case of a PDF submission, we will just be
  judging the PDF as the writeup… it will not be used for judging and will not
  count towards the word count" (referring to the Kaggle writeup body).
  **High.**
- **/752667 — "Precision about public notebook and papers vs conflicting Coding
  Competition"**, organizer reply 2026-10-27. Code is not required for the
  paper; papers take longer to score, hence the earlier deadline. **High.**
- **/751804 — "Rule 3.6.b: does the code-sharing requirement apply to this
  paper track?"**, organizer reply 2026-10-27. GitHub is acceptable; external
  datasets are fine if you have the rights. **High.**
- **/751403 — "Permitted independent validation for Paper Track research"**,
  organizer reply 2026-10-27. Independent reviewers are allowed if they follow
  the licensing rules; no restrictions on aggregate results. **High.**
- **/750338 — "Clarification on Prize Track Categorization, Tie-Breaker
  Timestamps, and Notebook Runtime"**, organizer reply 2026-10-27. All
  submissions are considered across all tracks; multiple judges for top
  papers; ties likely broken by original submission time; the full pipeline
  need not run on "Run All"; a quick way to run code is a good idea. **High.**
- **/743255 — "Clarification: number of writeups per team and eligibility
  across awards"**, organizer replies. At most two write-ups per team; one
  submission track; judges determine prize eligibility; same five criteria
  applied in the context of each prize; a single write-up can be considered
  for multiple prizes but can win only one; if it wins Best Paper it becomes
  ineligible for the resource and application prizes; quality over quantity;
  regenerated graph files are allowable with appropriate licensing; agent
  traces may be published with upstream license citations and no problem
  statements or hints. **High.**
- **/749803 — "Can derived localization labels from the task data be published
  (paper track)?"**, organizer reply 2026-10-27. Publishing derived labels is
  okay. **High.**
- **/745872 — "Does an arXiv preprint count as 'published' for the Paper
  Track?"**, organizer reply. arXiv posting is fine; an arXiv link can be the
  submission. **High.**
- **/745150 — "Question: does a blog post about a pilot study count as prior
  publication?"**, organizer reply. A substantially extended study following a
  public pilot is a valid submission; recency and extensions matter. **Medium**
  on exact wording because the reply was partially captured; the direction is
  clear.
- **/753195 — "Two writeups per team: can both be submitted at the same
  time?"**, no organizer reply at fetch time. A participant reports the form
  says "You've already submitted to this competition. To submit this writeup,
  you'll first need to unsubmit your previous writeup." **High** for the
  question and the participant report; **unresolved** as a rule.
- **/746168 — "Tie-break timing and edits to a submitted Writeup"**, no
  organizer reply captured. **Unresolved.**
- **/751856 — "Paper track: what may a public code notebook include about the
  training tasks?"**, no organizer reply at fetch time. **Unresolved.**
- **/745998 — "Note on Code Graphs for Async Functions"**, Elan Markowitz,
  ~2026-10-05. `async def` functions are absent from the code-graph tools; this
  affects some public fastapi and httpx tasks but no private-repo tasks (at
  most 1.8% of functions in private repos). **High.**

### 1.3 Kaggle mechanics and precedent

- **Kaggle competition documentation**, fetched 2026-10-29.
  <https://www.kaggle.com/docs/competitions> — hackathons are judged by a panel
  against a pre-established rubric; drafts are not judged; judges rarely give
  individualized feedback; everything on Kaggle is Markdown; links must be
  public and login-free; private resources attached to a public writeup are
  made public after the deadline. **High.**
- **Meta Kaggle Hackathon 2025 evaluation page**, fetched 2026-10-29.
  <https://www.kaggle.com/competitions/meta-kaggle-hackathon/overview/evaluation>
  — a Kaggle-hosted research rubric: rules compliance, narrative quality (30),
  data-driven justification (40), novelty (30). **High.** Useful precedent for
  what Kaggle research judging values, not a rule of this competition.
- **Gemma Vision writeup**, Gemma 3n Impact Challenge, fetched 2026-10-29.
  <https://www.kaggle.com/competitions/google-gemma-3n-hackathon/writeups/gemma-vision>
  — winning writeup anatomy: motivation, solution, development process,
  quantified failures and fixes, real-user validation, project links. **High.**
- **Gemma Scout writeup**, Gemma 3n Impact Challenge, fetched 2026-10-29.
  <https://www.kaggle.com/competitions/google-gemma-3n-hackathon/writeups/gemma-scout>
  — first-screen numbers, annotated project links, license and citation
  blocks. **High.**
- **Agentika writeup**, Vibe Code with Gemini 3, fetched 2026-10-29.
  <https://www.kaggle.com/competitions/gemini-3/writeups/agentika> — one-screen
  skimmable structure and feature-to-model mapping. **High.**
- **"What Makes a Winning Kaggle Team?"**, Meta Kaggle Hackathon 2025,
  fetched 2026-10-29.
  <https://www.kaggle.com/competitions/meta-kaggle-hackathon/writeups/what-makes-a-winning-kaggleteamabehavioraland>
  — research-paper-shaped writeup with objective, questions, methodology,
  leakage-aware cross-validation, quantified insights, conclusion. **Medium**
  on exemplar quality; the structure is verifiable.
- **Kaggle product feedback 358946**, fetched 2026-10-29.
  <https://www.kaggle.com/product-feedback/358946> — LaTeX rendering report:
  `$$` and `$` worked in some Kaggle Markdown surfaces, `\[ \]` failed. **Medium**
  (2022-era report; re-test before relying on it).
- **Gemma 3n hackathon discussion 597689**, fetched 2026-10-29.
  <https://www.kaggle.com/competitions/google-gemma-3n-hackathon/discussion/597689>
  — teams discovered their writeups were still drafts after the deadline;
  verify submitted status. **High** for the reported failure pattern.

### 1.4 Community threads cited as signals, not measurements

Base URL: `https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/<id>`

- **/752848 — "Why does nobody have a score of over 0.24?"** — public
  leaderboard around 0.24 (14 of 58 public tasks); comparison to the Konwinski
  Prize. **Medium** (community report).
- **/753524 — "How noisy is the public score? 58 tasks, 1 task = 0.017"** —
  community noise simulation and repeats; ~67% flippy task-by-configuration
  cells; a claimed +9-point gain had p = 0.22. **Medium** (community analysis,
  not an official measurement).
- **/753793 — "Is LoRA really helpful?"** — a competitor reports no adapter
  clearly beat the base model over repeated runs; adapters learned style.
  **Medium** (single anecdote).
- **/751487 — "Local eval in a scorer-like sandbox: gold patches pass on
  127/129 public tasks (was 52)"** — environment mismatch can change the
  measured resolve rate. **Medium** (community report with per-repo counts).
- **/753624 — "Graph and embedding generation pipeline"** — a competitor could
  not find the pipeline that generates the provided graphs and embeddings.
  **Medium** (question, no answer).
- **/753277 — "Gemma's Copying Bug: A One-Tensor Repair"** — a narrow
  diagnosis of a copying failure in the QAT E4B release. **Medium** (community
  report; not independently verified).

---

## 2. Writing craft and structure

- **ICMJE, "Preparing for Submission"**, fetched 2026-10-29.
  <https://www.icmje.org/recommendations/browse/manuscript-preparation/preparing-for-submission.html>
  — IMRAD is the standard structure for original research and "a reflection of
  the process of scientific discovery." **High.**
- **Wikipedia, "IMRAD"**, fetched 2026-10-29.
  <https://en.wikipedia.org/wiki/IMRAD> — IMRAD as the dominant norm; the
  wineglass model (broad, narrow, broad). **Medium** (encyclopedia; consistent
  with ICMJE).
- **Simon Peyton Jones, "How to Write a Great Research Paper"**, slides fetched
  2026-10-29.
  <https://www.cis.upenn.edu/~sweirich/icfp-plmw15/slides/peyton-jones.pdf> —
  the reader funnel, the one-ping rule, refutable contributions, the
  four-sentence abstract, late related work, the ban on "the rest of this
  paper is structured as follows." Formal version: OASIcs Vol. 60, ICCSW 2017,
  DOI 10.4230/OASIcs.ICCSW.2017.1. **High.**
- **Mensh and Kording, "Ten Simple Rules for Structuring Papers"**, PLOS
  Computational Biology 13(9):e1005619, published 2017-09-28.
  <https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1005619>
  — one central contribution, context–content–conclusion at every scale,
  declarative result headers, self-contained figures, reader-time budget.
  **High.**
- **Neel Nanda, "Highly Opinionated Advice on How to Write ML Papers"**,
  Alignment Forum, 2025-05-12.
  <https://www.alignmentforum.org/posts/eJGptPbbFPZGLpjsp/highly-opinionated-advice-on-how-to-write-ml-papers>
  — one to three claims, self-contained abstract and introduction, figures as
  argument, related work after the main content, limitations matter, verify
  experiments before writing. **High.**
- **NeurIPS 2026 Main Track Handbook**, fetched 2026-10-29.
  <https://neurips.cc/Conferences/2026/MainTrackHandbook> — nine content pages,
  mandatory paper checklist, contribution types including Negative Results,
  review criteria. **High.**
- **ICLR 2026 Author Guide**, fetched 2026-10-29.
  <https://iclr.cc/Conferences/2026/AuthorGuide> — nine pages at submission,
  unlimited references and appendices, reviewers not required to read the
  appendix, LLM-usage disclosure. **High.**
- **ICML 2026 Author Instructions**, fetched 2026-10-29.
  <https://icml.cc/Conferences/2026/AuthorInstructions> — eight-page main body,
  unlimited references, impact statement, and appendices. **Medium** (official
  page via search excerpts).
- **Zobel, Writing for Computer Science**, 3rd ed., Springer 2014, DOI
  10.1007/978-1-4471-6639-9. <https://link.springer.com/book/10.1007/978-1-4471-6639-9>
  — book scope verified (style, figures, structuring arguments, experiment
  design, checklists); chapter-level advice paywalled. **Medium** on scope.
- **Gopen and Swan, "The Science of Scientific Writing"**, American Scientist
  78(6):550–558, 1990. Full text mirror fetched 2026-10-29:
  <https://www.gatsby.ucl.ac.uk/~pel/misc/gopen_swan.pdf> — topic position,
  stress position, subject–verb proximity, old-to-new information flow.
  **High.**
- **Rougier, Droettboom, and Bourne, "Ten Simple Rules for Better Figures"**,
  PLOS Computational Biology 10(9):e1003833, 2014.
  <https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1003833>
  — know the audience, identify the message, captions are mandatory, do not
  trust defaults, colourblind-safe colour, no truncated axes, no chartjunk.
  **High.**
- **"Writing the title and abstract for a research paper: being concise,
  precise, and meticulous is the key"**, PMC6398294, fetched 2026-10-29.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC6398294/> — keyword placement,
  descriptive-versus-declarative titles, abstract self-containment, no
  citations in the abstract, write it last. **Medium-High** (review article).
- **Wager et al., "Do declarative titles affect readers' perceptions of
  research findings? A randomized trial"**, PMC5803632, fetched 2026-10-29.
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC5803632/> — declarative titles did
  not significantly change readers' confidence in the conclusions; the
  editors' fear of over-influence was not supported. **High** for the trial;
  **Medium** for the broader citation-advantage literature.
- **Microsoft Academic, "NeurIPS Conference Analytics"**, fetched 2026-10-29.
  <https://www.microsoft.com/en-us/research/project/academic/articles/neurips-conference-analytics/>
  — reference counts per paper over time; useful for calibrating citation
  density, not a rule. **Medium** (chart-based page).
- **CMU Student Academic Success Center, "Related Work"**, fetched 2026-10-29.
  <https://www.cmu.edu/student-success/other-resources/resource-descriptions/related-work.html>
  — related work compares, contrasts, and synthesizes rather than enumerates.
  **Medium** (teaching handout).
- **Kaggle product feedback 373153**, fetched 2026-10-29.
  <https://www.kaggle.com/product-feedback/373153> — Kaggle's writing guide for
  solution writeups; useful for tone and structure, not a rule of this
  competition. **Medium.**
- **Kaggle community guidelines**, fetched 2026-10-29.
  <https://www.kaggle.com/community-guidelines> — attribution and plagiarism
  rules. **High** on the existence of the rules; the specific wording should be
  checked in the current version.
- **Wikipedia, "White paper"**, fetched 2026-10-29.
  <https://en.wikipedia.org/wiki/White_paper> — the genre's origin as an
  authoritative position paper; commercial forms and grey literature.
  **Medium.**
- **Karpathy, "A Survival Guide to a PhD"** — the guide could not be fetched on
  2026-10-29 (GitHub rate limit; no Wayback capture at the expected URL).
  It is **not** cited for any specific claim in this pack. **Low.**

---

## 3. Rigor, reproducibility, and evaluation

- **Raff, "A Step Toward Quantifying Independently Reproducible Machine
  Learning Research"**, NeurIPS 2019, arXiv:1909.06674.
  <https://arxiv.org/abs/1909.06674> — 255 papers attempted from text alone,
  about 62% lower-bound reproduction; code release alone is a weak predictor;
  explicit hyperparameters and readability predict success. **High** on
  direction; **Medium** on exact percentages (some figures came via summary).
- **Kapoor and Narayanan, "Leakage and the Reproducibility Crisis in ML-based
  Science"**, arXiv:2207.07048. <https://arxiv.org/abs/2207.07048> — eight
  leakage types across 17 fields and 329 papers; leakage produced
  overoptimistic conclusions. **High.**
- **ACL Rolling Review, reviewer guidelines**, fetched 2026-10-29.
  <https://aclrollingreview.org/reviewerguidelines> — missing or under-tuned
  baselines, overclaiming, insufficient hyperparameter detail, and unclear
  code/data availability are named faults; "Limitations != weaknesses";
  reproduction and analysis are proper contributions. **High.**
- **NeurIPS 2026 Main Track Handbook** — also covers desk-rejection grounds,
  dual submission, and LLM policies. **High.**
- **OpenAI, "Introducing SWE-bench Verified"**, fetched 2026-10-29.
  <https://openai.com/index/introducing-swe-bench-verified/> — 93 developers
  annotated 1,699 samples with three annotations each; about 68% of the test
  set was filtered out, leaving 500. Defect classes include underspecified
  issues (38.3% of the sample), tests that could mark valid solutions wrong
  (61.1%), and gameable FAIL_TO_PASS tests. **High.**
- **NeurIPS Paper Checklist** — 15 yes/no/NA questions covering experimental
  disclosure, exact commands and environment, all splits and hyperparameters,
  error bars with the source of variability, compute, and asset licensing. The
  live `neurips.cc/public/PaperChecklist` URL returned a 404 during this
  research; the verbatim checklist is reproduced in Appendix G of the ABC
  paper (arXiv:2507.02825). **High** on the checklist text; **Medium** on the
  current official URL.
- **NeurIPS 2026 Main Track Handbook** — also documents the ML Reproducibility
  Challenge, run through TMLR, whose scope explicitly includes reproducibility
  of AI agents and recommends Software Heritage archival for a permanent
  citable code identifier. **High.**
- **ACM Artifact Review and Badging v1.1**, archived copy fetched 2026-10-29
  through the Wayback Machine; the live ACM page is Cloudflare-walled. The
  ladder is Artifacts Available, Evaluated–Functional, Evaluated–Reusable,
  Results Reproduced, and Results Validated. <https://www.acm.org/publications/policies/artifact-review-and-badging-current>
  **High** on the ladder; **Medium** on whether a later version supersedes it.
- **SWE-bench PASS/FAIL definition**, from the SWE-bench repository and
  documentation, fetched 2026-10-29. <https://github.com/SWE-bench/SWE-bench> —
  a patch is resolved if and only if it applies and all FAIL_TO_PASS and
  PASS_TO_PASS tests pass. Patch-application failure is a distinct outcome
  class and should have its own row in a failure taxonomy. **High.**
- **"Efficient Benchmarking of AI Agents"**, arXiv:2603.23749, March 2026.
  <https://arxiv.org/abs/2603.23749> — scaffold-driven distribution shift
  across eight benchmarks, 33 scaffolds, and 70+ configurations; absolute
  agent scores drift with harness changes while rank order is more stable.
  **Medium** (single 2026 source; direction is consistent with Agentless).
- **MLE-bench agent paper**, arXiv:2507.02554.
  <https://arxiv.org/abs/2507.02554> — results are an interaction between the
  search policy and the operator set (medal rate 39.6% to 47.7%); argues for
  ablating mechanisms rather than reporting one monolithic agent number.
  **High.**
- **Datasheets for Datasets**, arXiv:1803.09010.
  <https://arxiv.org/abs/1803.09010> — the documentation standard for dataset
  provenance, composition, collection, and intended use. **High.**
- **Croissant**, MLCommons. <https://mlcommons.org/working-groups/data/croissant/>
  — a standardized metadata vocabulary for ML datasets. **Medium** (existence
  and purpose; not fetched in full).
- **LiveCodeBench**, arXiv:2403.07974. <https://arxiv.org/abs/2403.07974> —
  time-stamped continuous collection and release of prompts and completions as
  a contamination mitigation. **High.**
- **SWE-bench Pro**, arXiv:2509.16941. <https://arxiv.org/abs/2509.16941> —
  public, held-out, and commercial repository splits designed to resist
  contamination; long-horizon tasks. **High** on design.
- **"Establishing Best Practices for Rigorous Agentic Benchmarks"** (ABC),
  arXiv:2507.02825. <https://arxiv.org/abs/2507.02825> — rules for task,
  reward, and outcome validity in agentic benchmarks; documents insufficient
  tests in SWE-bench Verified and empty-response successes in tau-bench.
  **High.**
- **Agentless**, arXiv:2407.01489. <https://arxiv.org/abs/2407.01489> — a
  simple three-stage pipeline beats complex agents on SWE-bench Lite at low
  cost; also documents incorrect ground-truth patches in Lite. **High.**
- **"NLP Evaluation in Trouble"**, arXiv:2310.18018.
  <https://arxiv.org/abs/2310.18018> — contamination from training on test
  data inflates scores; extent is hard to measure. **High.**
- **"Between Spoilers and Guesswork"**, arXiv:2610.22760, IBM, 2026-10-16.
  <https://arxiv.org/abs/2610.22760> — benchmarks that add ground-truth-derived
  hints create over-specification and contamination risks; recommends
  parsimonious task statements. **High.**
- **"Position: Embracing Negative Results in Machine Learning"**,
  arXiv:2406.03980. <https://arxiv.org/abs/2406.03980> — predictive performance
  alone is a poor indicator of a paper's worth; publication bias is documented.
  **High.**
- **ACM Artifact Review and Badging**, fetched 2026-10-29.
  <https://www.acm.org/publications/policies/artifact-review-and-badging-current>
  — artifact availability, reproducibility, and reusability badging.
  **High.**
- **NeurIPS Paper Checklist** — the 2026 location moved; the checklist concept
  and its questions are referenced via the NeurIPS 2026 handbook. The direct
  public checklist URL returned a 404 during this research. **Medium** on the
  URL, **High** on the checklist's existence and role.

---

## 4. Technical context: Gemma 4, agents, and code graphs

- **Gemma 4 model card**, Google AI for Developers, fetched 2026-10-29.
  <https://ai.google.dev/gemma/docs/core/model_card_4> — five sizes (E2B, E4B,
  12B Unified, 26B A4B, 31B), effective and active parameters, 128K/256K
  context, hybrid attention with proportional RoPE, native function calling,
  multimodal inputs, thinking control, benchmark table. **High.**
- **Gemma 4 Technical Report**, arXiv:2607.02770, v1 2026-07-02, v2
  2026-07-24. <https://arxiv.org/abs/2607.02770> — open-weight multimodal
  models from 2.3B to 31B, dense and MoE, thinking mode, encoder-free 12B.
  **High.**
- **Gemma 4 31B model page**, Hugging Face, fetched 2026-10-29.
  <https://huggingface.co/google/gemma-4-31B> — model card and usage details.
  **High.**
- **Google ADK documentation**, fetched 2026-10-29.
  <https://google.github.io/adk-docs/agents/llm-agents/> and
  <https://google.github.io/adk-docs/agents/multi-agents/> — `LlmAgent`,
  `AgentTool`, `transfer_to_agent`, workflow agents, model pluggability.
  **High.**
- **ADK Skills documentation**, fetched 2026-10-29. <https://adk.dev/skills/>
  — skills as self-contained instructions, resources, and tools, loaded
  incrementally; `SkillToolset`; experimental status. **High.**
- **Bellam, "How Do Small Coding Agents Use Code Graphs and Embeddings?"**,
  arXiv:2610.33958, submitted 2026-10-25.
  <https://arxiv.org/abs/2610.33958> — the near-neighbor paper: tool-set
  ablations on SWE-bench Verified with Qwen3 and Gemma 4 sizes, 79k episodes;
  structured tools double grep-only accuracy for E4B and Qwen3-8B; gains peak
  at 1.7B–4B; hop odds 0.50–0.67; 12–14% expansion rate; probe AUC 0.74 vs
  lexical 0.99; repair resolves 6–13 of 160 vs oracle 26. **High.**
- **SWE-bench**, arXiv:2310.06770. <https://arxiv.org/abs/2310.06770> —
  repository-level issue resolution benchmark. **High.**
- **SWE-agent**, arXiv:2405.15793. <https://arxiv.org/abs/2405.15793> —
  agent-computer interface. **High.**
- **CodeAct**, arXiv:2402.01030. <https://arxiv.org/abs/2402.01030> —
  executable code actions for LLM agents. **High.**
- **OpenHands**, arXiv:2407.16741. <https://arxiv.org/abs/2407.16741> —
  open platform for software agents. **High.**
- **SWE-RL**, arXiv:2502.18449. <https://arxiv.org/abs/2502.18449> —
  reinforcement learning for software engineering agents. **High.**
- **SWE-smith**, arXiv:2502.18443. <https://arxiv.org/abs/2502.18443> —
  scalable task generation for SWE agents. **High.**
- **RepoGraph**, arXiv:2410.14684. <https://arxiv.org/abs/2410.14684> —
  repository-level code graph for agent navigation. **High.**
- **SWE-Ladder**, arXiv:2610.33667, 2026-10-24.
  <https://arxiv.org/abs/2610.33667> — stage-specific privileged
  self-distillation plus GRPO; a current bar for RL-for-SWE papers. **High.**
- **OpenDraco**, arXiv:2610.32686, 2026-10-23.
  <https://arxiv.org/abs/2610.32686> — versioned multi-agent configuration;
  equal outcomes at very different costs. **High** on existence.

---

## 5. Judge profiles

These are public profiles and publication records, used only for the
inference in `02-gemma4-paper-track-playbook.md` section 4. They are not
official statements about judging.

- **Elan Markowitz** — personal site <https://elanmarkowitz.github.io/>;
  Google Scholar profile; recent work on autonomous knowledge-graph
  exploration. **High** on research area.
- **Bryan Perozzi** — Google Research profile
  <https://research.google/people/bryanperozzi/>; DeepWalk, GNNs, "Talk like a
  Graph", benchmark-quality position paper. **High** on research area.
- **Benedek Rózemberczki** — Google Scholar profile; PyTorch Geometric
  Temporal, TGL, Temporal Graph Benchmark. **High** on research area.
- **Michael Galkin** — <https://migalkin.github.io/>; ULTRA, knowledge-graph
  foundation models, expressivity, TGB 2.0. **High** on research area.
- **Hadi Hemmati** — York University profile; software testing, debugging,
  repair, test-suite reduction, LLM code and test generation. **High** on
  research area.
- **Ryan Holbrook** — <https://www.kaggle.com/ryanholbrook>; Kaggle Data
  Scientist and competition developer. **High.**
- **Ashley Oldacre** — Kaggle team page <https://www.kaggle.com/about/team>;
  Competitions Program Manager. **High.**
- **Glenn Cameron** — Google; marketing lead for Gemma per public profile.
  **Medium** on exact title.
- **Yuchen Li** — identity ambiguous across several public homonyms; not
  resolved. **Low.**
- **Majid Farhadi** — listed on the paper-track citation page; public identity
  otherwise unresolved. **Low.**

---

## 6. What could not be verified

- The full text of the competition **Rules** page is login-gated; rule numbers
  such as "3.6.b" and "37.b" are quoted by participants, not read directly.
- The paper-track **Writeups** tab is not visible without joining; no current
  entries could be inspected as exemplars.
- **Karpathy's PhD guide** could not be fetched; it is not cited.
- **OpenAI's follow-up audit** behind the "59.4% test flaws / 30% of SWE-bench
  Pro broken" claim was found only through secondary coverage; treat those
  numbers as medium confidence.
- **CodeR's arXiv ID** was not verified; the paper is not cited here.
- The **exact Verified leaderboard SOTA percentage** was not captured from the
  leaderboard table; no number is asserted.
- Whether a **submitted writeup can be edited after the deadline** was not
  answered by the organizers at fetch time.


---

<!-- ====================================================================== -->
<!-- FILE: 05-qc-report.md -->
<!-- ====================================================================== -->

# Quality-check report

*Run on 2026-10-29 against the six content files in this folder. This report
is excluded from the table counts below.*

## What was checked

| Check | Tool or method | Result |
|:---|:---|:---|
| Table structure | `scratch/check_md_tables.py` (T1–T6: blank line before table, header and delimiter rows, delimiter cell syntax, consistent cell counts, closing pipes, no trailing whitespace) | Pass |
| Table rendering | Pandoc 3.x, `-f gfm -t html`, count of `<table>` elements | Pass |
| Alignment markers | Normalized every delimiter row to explicit left (`:---`) or right (`---:`) alignment; re-ran the structural check | Pass |
| Placeholders | Search for `TODO`, `TBD`, `PLACEHOLDER`, `FIXME`, `<!--` | None found |
| Internal links | Checked the relative links in `README.md` against the files on disk | All resolve |
| Repeated words | Case-sensitive regex for doubled words | None found |
| Key external links | HTTP status check on the uncertain URLs | See below |

## Table counts

| File | Tables found | Structural check | Pandoc `<table>` count |
|:---|:---|:---|:---|
| `01-whitepaper-essentials.md` | 11 | Pass | 11 |
| `02-gemma4-paper-track-playbook.md` | 16 | Pass | 16 |
| `03-templates-and-checklists.md` | 9 | Pass | 9 |
| `04-sources.md` | 0 | Pass | 0 |
| `README.md` | 1 | Pass | 1 |
| `STATUS.md` | 2 | Pass | 2 |
| **Total** | **39** | **Pass** | **39** |

## External-link spot checks

| URL | Status | Note |
|:---|:---|:---|
| Kaggle competition and discussion pages | 200 | Fetched directly during research |
| Kaggle docs, exemplar writeups, product feedback | 200 | Fetched or status-checked |
| NeurIPS 2026 handbook, ICLR 2026 guide, ICML 2026 instructions | 200 | Status-checked |
| ACL Rolling Review guidelines | 200 | Fetched |
| Gopen and Swan full-text mirror | 200 | Fetched |
| Springer book page (Zobel) | 200 | Scope only |
| OpenAI SWE-bench Verified page | 403 | Bot-blocked to the status checker; fetched by the research agent earlier |
| ACM artifact badging page | 403 | Cloudflare-blocked; archived copy used |
| MLCommons Croissant page | 403 | Bot-blocked; existence and purpose verified via search |
| American Scientist article page | 503 | Temporarily unavailable; the Gatsby mirror of the same article is used |

## Known limitations

- The Kaggle **Rules** page and the paper-track **Writeups** tab are
  login-gated. Rule numbers quoted by participants (such as "3.6.b" and
  "37.b") were not read from the primary page.
- A few claims rest on search snippets rather than a fetched page; these are
  marked **Medium** or **Low** confidence in `04-sources.md`.
- The competition-specific facts are as of 2026-10-29 and should be re-checked
  before the 2026-11-12 deadline.
- The worked examples in `03-templates-and-checklists.md` are illustrative and
  are labelled as such; they are not reported experimental results.

## Reproduce the check

```bash
cd <workspace>
for f in deliverables/2026-10-29/*.md; do
  python scratch/check_md_tables.py "$f"
  pandoc "$f" -f gfm -t html | grep -c "<table>"
done
```

