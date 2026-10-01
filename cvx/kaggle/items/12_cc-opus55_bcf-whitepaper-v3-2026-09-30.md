Q: I am thinking about the whitepaper and the BCF algorithm. I want to put some "meat and potatoes" into my first whitepaper by backing my results up with real math behind it. Please investigate the following statement:
"I aim to build BCF to help solve more issues sooner by classifying errors into exception classes. This effectively limits the search space to the most probable root causes. [Please flesh out the math and idea on how BCF can solve multi-step, chained issues such as the "httpx_6821" example in the dossier HTML doc in the project knowledge]. Therefore, the speed and overall effectiveness  of the algorithm will simply depend on the adjustments to the number and fidelity of the exception categories..."

 If I have explained some particular math phenomena that please indicate what it is and then proceed to flesh out the idea into content for the next draft of the whitepaper.
 
A: Your statement actually describes three separate, well-studied pieces of math, and one of its claims needs correcting before it goes into the paper. The full whitepaper section is in the Markdown file below. Here is what you described and where it leads.

**1. "Classifying errors limits the search space to the most probable root causes."** This is **search with side information**. In information theory, the quantity is called *guesswork*: the expected number of tries to find something when you always try the most likely option next. Massey introduced it in 1994, and also showed that the optimal strategy is simply to guess elements in decreasing order of probability. In your terms, the defect class is the side information, and the drop in uncertainty it causes is the *mutual information* between the class and the bug's location.

There is also an older result from search theory that fits BCF closely. Blackwell showed that the strategy which at each step searches the box with the largest value of detection probability × posterior probability ÷ cost minimizes the expected searching cost. That formula separates three levers:

- **Where to look.** Class-specific graph queries change this.
- **Whether the agent recognizes the bug when it reads it.** Your fix-shape templates change this, and it's the lever people usually miss.
- **Cost per look.** Line-range reads change this.

**2. "Speed depends on the number and fidelity of the categories."** This is where I'd push back. Effectiveness doesn't *simply* depend on those two things. The math sets hard limits:

- **Number of classes.** A K-class label carries at most log₂K bits. Five classes can shrink the effective search space at most five-fold, so the taxonomy multiplies the value of graph search rather than replacing it.
- **Fidelity of the input.** A classifier reading the issue text can never know more about the root cause than the text contains. This is the *data-processing inequality*.
- **Accuracy.** Classification helps only when accuracy exceeds a break-even threshold. That threshold is set by how expensive a wrong route is.

The most useful result in the draft is that a **probe cap** bounds that cost: try the class hunch at most *m* times, then fall back to the default search. This is your 3-strike circuit breaker. In the toy model, a cap of 3 makes even a 50%-accurate classifier roughly break even, while an uncapped one needs about 41% accuracy just to avoid doing harm.

The principled name for "choosing the right categories" is the *Information Bottleneck*: compress the issue text into as few buckets as possible while keeping what predicts the bug's location.

One practical warning for your 30-task experiment. Estimates of information from small samples come out too high. With 5 classes and roughly 20 distinct root-cause files, the upward bias is about 1.8 bits, nearly the whole 2.3-bit ceiling. The draft therefore measures guesswork directly, as paired per-task comparisons, instead of computing information.

**3. Chained issues like httpx_6821.** The software-testing literature calls this *fault interference*. Debroy and Wong showed that simultaneous faults can cause interferences in which some faults hide the incorrect behavior of other faults. DiGiuseppe and Jones found that the fault localization effectiveness of the other faults (beyond the first fault) is impaired as the number of faults grows.

The draft models the defects as a dependency graph (a DAG) with two kinds of edge:

- **Masking edges.** Fixing in the wrong order costs rediscovery, but the final patch can be the same.
- **Semantic edges.** Fixing in the wrong order produces a wrong fix that has to be redone.

From that model, three results follow:

- **Factorization.** Classifying and localizing each defect separately turns a *multiplicative* search over pairs of locations into an *additive* one. The condition is that each defect has its own verification signal. In the toy model, a two-defect search drops from 348 expected inspections (joint search, no classes) to 6.8 (factored, with classes).
- **Ordering.** A random fix order for a chain of k defects is correct with probability 1/k!. Choosing the correct order is a *topological sort* of the dependency graph.
- **Compounding.** Per-defect success rates multiply, so raising each defect's success rate from 0.7 to 0.8 gives a 14% relative gain on one-bug tasks but a 49% gain on three-bug tasks. That is a testable prediction your experiment can check.

I also added a hypothesis I'd call **loud-symptom bias**. A traceback is louder than a quietly wrong value, and in chains the loud crash is often the *downstream* effect of a quiet upstream logic bug. If that holds in your data, your class labels give the agent a free ordering prior.

**Two provenance notes.**

- httpx_6821 is the invented task your own dossier retracted. The draft keeps it only as a clearly labelled worked example, and every number in the file is marked as either established math or toy arithmetic.
- The scenario's masking is only *partial*, which is why the naive agent sees the AssertionError first. I kept this and framed it as the realistic, dangerous case rather than an inconsistency.

The file also contains seven falsifiable hypotheses, mapped to fields your taxonomy and ledger schemas already define. It ends with a change journal listing which v2 claims this section replaces.

***

###

---
title: "BCF Whitepaper — Draft v3 insert: A Search-Theoretic Model of Class-Conditioned Localization"
status: Draft [B] — theory section; no measured results inside
replaces_in_v2: "Figure 4 (12 invented bug categories) framing; abstract claim of '12–20 calls to 3–4 calls'"
date: 2026-09-29
provenance_legend:
  ESTABLISHED: "Published mathematics; cited"
  DESIGNED: "BCF design choice; not yet run"
  SYNTHETIC: "Toy-model arithmetic; illustrates a formula, not BCF performance"
  ILLUSTRATIVE: "Constructed walkthrough; httpx_6821 is an invented task id"
  TO_MEASURE: "Hypothesis the experiments will test"
---

# Section X — Why classifying defects should speed up localization: a search-theoretic model

> **Reader's map.** Expert readers can skip every block that starts with *Plain-language note*. Those blocks exist for newcomers and can be hidden without breaking the argument.

## X.0 Thesis (revised statement)

BCF classifies each reported defect, from the issue text alone, into a small set of mechanism-based classes before any code is read. Formally, the class label is **side information** that conditions the agent's search over candidate root-cause locations. It lowers the expected number of inspections needed to find the root cause, and it also changes *how* the agent searches (query phrasing, graph-edge direction) and *what it looks for* (the expected fix shape). For issues containing several defects, BCF classifies each defect separately, recovers a dependency order, and localizes defects one at a time, which turns a search over the *product* of location spaces into a *sum* of independent searches.

The benefit is bounded. A taxonomy of $K$ classes can shrink the effective search space by at most a factor of $K$, and never by more than the information the issue text actually contains. The benefit is realized only when classification accuracy exceeds a break-even threshold set by the cost of a wrong route, and BCF caps that cost with a probe budget. Taxonomy design is therefore an optimization over the number of classes and their accuracy, not a knob where more classes are always better. `[DESIGNED + ESTABLISHED]`

> **Plain-language note.** Think of a mechanic who hears "grinding noise when braking." That one phrase rules out most of the car. It doesn't tell them which bolt is loose, and if they mishear "grinding" as "squealing" they look in the wrong place first. This section puts numbers on all three of those effects.

---

## X.1 Notation

| Symbol | Meaning |
|---|---|
| $X$ | Issue text (the only input available at classification time) |
| $\mathcal{L}$, $N=\lvert\mathcal{L}\rvert$ | Candidate root-cause locations (symbols in the code graph) |
| $R \in \mathcal{L}$ | True root-cause location (single-defect case) |
| $C = f(X) \in \{1,\dots,K\}$ | Predicted defect class; $C^\*$ is the true class |
| $\pi$ | An inspection order over $\mathcal{L}$; $g_\pi(R)$ is the position of $R$ in $\pi$ |
| $G(R) = \min_\pi \mathbb{E}[g_\pi(R)]$ | Guesswork: minimum expected inspections to hit $R$ |
| $H(\cdot)$, $I(\cdot;\cdot)$ | Shannon entropy and mutual information, in bits |
| $d_\ell$, $c_\ell$ | Detection probability and turn cost of inspecting location $\ell$ |
| $a$ | Classifier accuracy, $P(C = C^\*)$ |
| $m$ | Probe cap: maximum class-directed inspections before falling back |
| $B$ | Turn budget per task |
| $k$, $D$ | Number of defects in one issue; their dependency graph (a DAG) |

---

## X.2 Localization is a search problem `[ESTABLISHED]`

Localization means finding $R$ by inspecting candidates one at a time (a graph query result, a line-range read). Two classical results govern this.

**Result 1 — Guesswork (Massey, 1994).** If each inspection costs the same and always recognizes the root cause when it is looked at, the optimal strategy inspects candidates in decreasing order of probability, and the expected number of inspections is

$$
G(R) = \sum_{j=1}^{N} j \cdot p_{(j)}, \qquad p_{(1)} \ge p_{(2)} \ge \dots
$$

Massey showed that guesswork is bounded below by entropy: $G(R) \ge 2^{H(R)-2} + 1$ when $H(R) \ge 2$ bits. A later refinement gives $G(R \mid Y) > 2^{H(R \mid Y)}/e$ for side information $Y$ (Rioul, 2022, and prior work cited there). There is **no matching upper bound** in general: a distribution can have low entropy and still require several guesses. Guesswork must therefore be measured directly, not inferred from entropy.

**Result 2 — Search with overlook probability (Blackwell, reported in Matula, 1964; Stone, 1975).** If inspecting the right location only *recognizes* it with probability $d_\ell$, and inspections cost $c_\ell$, the expected-cost-minimizing rule is: at every step, inspect the location with the largest

$$
\frac{d_\ell \, p_\ell}{c_\ell},
$$

then update the posterior after a miss:

$$
p_\ell' = \frac{p_\ell (1-d_\ell)}{1 - p_\ell d_\ell}, \qquad p_j' = \frac{p_j}{1 - p_\ell d_\ell}\ \ (j \neq \ell).
$$

With $d_\ell = 1$ this reduces to ordering by $p_\ell / c_\ell$, which is Smith's rule from scheduling (Smith, 1956).

> **Plain-language note.** *Guesswork* is "how many doors do I open, on average, before I find the prize, if I always open the most likely door next?" *Overlook probability* is the chance you open the right door and still don't notice the prize. The ratio rule says: go where the prize is likely, where you'd actually spot it, and where looking is cheap.

**Why this matters for BCF.** Result 2 exposes three separate levers, and a defect class can pull all three:

| Lever | Symbol | How a class changes it in BCF `[DESIGNED]` |
|---|---|---|
| Where to look | $p_\ell$ | Class-specific query phrasing for `search_similar_code`; `called_by` vs `calls` edge direction |
| Recognizing it when seen | $d_\ell$ | The class's expected fix shape (e.g., "a hard `assert` in source" vs "a conditional that clears state") tells the model what the defect *looks like* |
| Cost per look | $c_\ell$ | Line-range reads taken from graph metadata instead of whole-file reads |

The second lever is easy to miss. A taxonomy does not only narrow the search; it also raises the chance that the model recognizes the bug when it reads the right lines. Most "wrong fix" turns in agent traces are failures of $d$, not of $p$.

**Calibration caveat.** Graph similarity scores are not probabilities. To apply the ratio rule, scores must be mapped to calibrated estimates, for example $\hat p_\ell = \operatorname{softmax}(s_\ell / \tau)$ with the temperature $\tau$ fitted on training tasks, or isotonic regression. Uncalibrated scores still give a usable ranking, but the break-even analysis in X.4 needs calibrated values.

---

## X.3 Classes as side information, and the ceiling on their value `[ESTABLISHED]`

**Proposition 1 (conditioning never hurts an informed searcher).** If the searcher knows the class correctly, then $G(R \mid C) \le G(R)$ and $H(R \mid C) \le H(R)$.

*Proof sketch.* For each class value $c$, the optimal ranking for $P(R \mid C=c)$ does at least as well as the single unconditional ranking applied to that same distribution. Averaging over $c$ gives $G(R \mid C) \le \sum_c P(c)\,\mathbb{E}[g_0(R) \mid C=c] = G(R)$. The entropy statement is standard (Cover & Thomas, 2006). $\square$

The entropy reduction has a name: **mutual information**, $I(C;R) = H(R) - H(R \mid C)$. It measures, in bits, how much knowing the class tells you about where the bug lives.

**Proposition 2 (the ceiling).** Because $C$ is computed from the issue text, $R \to X \to C$ is a Markov chain, and

$$
I(C;R) \;\le\; \min\{\, I(X;R),\ H(C) \,\} \;\le\; \log_2 K.
$$

The first inequality is the **data-processing inequality**: no function of the issue text can know more about the root cause than the issue text itself. The second is the fact that a $K$-way label carries at most $\log_2 K$ bits.

**Corollary (effective search-space size).** Define the effective number of candidates as the perplexity $2^{H(R)}$. Classification divides it by $2^{I(C;R)} \le K$. Five classes can shrink the effective search space at most five-fold. Everything beyond that has to come from anchors, graph search, and reading. **The taxonomy is a multiplier on top of search, not a replacement for it.**

**Corollary (every bit halves the floor).** From the guesswork bound, $G(R \mid C) > 2^{H(R) - I(C;R)}/e$. Each additional bit of mutual information the taxonomy captures halves the lower bound on expected inspections.

> **Plain-language note.** *Mutual information* is how much one thing tells you about another. A class label like "crash" tells you something about where the bug is, but a label can only hold so much: picking one of five buckets is worth at most about 2.3 bits, like answering two or three yes/no questions. And no label can know more than the bug report it was read from — that's the *data-processing inequality*, the "garbage in, garbage out" law written as math.

**Synthetic illustration `[SYNTHETIC]`.** Take $N = 40$ candidates, $K = 4$ equally likely classes, each owning 10 candidates, with probabilities inside a class falling off as $1/\text{rank}$ (a Zipf shape). This is the *best case* for a taxonomy, because the classes don't overlap.

| Quantity | No class | With correct class |
|---|---|---|
| Entropy $H$ | 4.88 bits | 2.88 bits |
| Effective candidates $2^H$ | 29.4 | 7.3 |
| Guesswork $G$ (expected inspections) | 12.16 | 3.41 |

Mutual information here is exactly 2.00 bits $= \log_2 4$, the ceiling. Real classes overlap, so real $I(C;R)$ will be lower.

---

## X.4 Fidelity: when classification pays for itself `[ESTABLISHED + DESIGNED]`

A classifier is sometimes wrong. When it is, the agent searches the wrong class's candidates first. BCF bounds that damage with a **probe cap** $m$: after $m$ class-directed inspections without a hit, the agent falls back to the class-free default ordering. `[DESIGNED — this is the Batonic 3-strike circuit breaker applied to localization]`

Let $G_0 = G(R)$ be the default cost, $G_c = G(R \mid C)$ the cost with a correct class, and $M_m$ the cost after a misroute. Expected localization cost is

$$
\mathbb{E}[T_{\text{loc}}] = c_{\text{cls}} + a\,G_c + (1-a)\,M_m ,
$$

where $c_{\text{cls}}$ is the turn cost of classifying (0 if the regex runs inside the system prompt's logic, 1 if it runs as a `run_skill_script` call).

**Proposition 3 (break-even accuracy).** Ignoring $c_{\text{cls}}$, classification helps if and only if

$$
a \;>\; a^\* = \frac{M_m - G_0}{M_m - G_c}.
$$

**Proposition 4 (the probe cap bounds the downside).** A misroute wastes at most $m$ inspections before fallback, so $M_m \le G_0 + m$, and therefore

$$
a^\* \;\le\; \frac{m}{G_0 + m - G_c}.
$$

A small probe cap makes a mediocre classifier safe. Without a cap (the agent commits to the wrong class indefinitely), the break-even accuracy climbs.

**Synthetic illustration `[SYNTHETIC]`** (same toy model as X.3):

| Probe cap $m$ | Misroute cost $M_m$ | Break-even $a^\*$ | Cost at $a=0.7$ | Cost at $a=0.9$ |
|---|---|---|---|---|
| 3 | 12.14 | ≈ 0.00 | 6.03 | 4.29 |
| 5 | 13.63 | 0.14 | 6.48 | 4.44 |
| 10 (no real cap) | 18.24 | 0.41 | 7.86 | 4.90 |

Default cost with no classifier is 12.16. With $m = 3$, even a coin-flip classifier roughly breaks even and a 70%-accurate one halves the cost. With no cap, the classifier must beat 41% just to avoid hurting.

**The `unknown` class is a reject option.** Chow (1970) showed that a classifier allowed to abstain should do so whenever its confidence falls below a threshold set by the relative costs of error and abstention. BCF's `unknown` class plays exactly this role: route to a class only when the signals are strong enough that the estimated accuracy exceeds $a^\*$; otherwise use the default strategy and pay $G_0$ with no misroute risk. `[DESIGNED]`

> **Plain-language note.** *Break-even accuracy* answers "how often must my guess about the bug's type be right before guessing is worth it?" The answer depends on how badly a wrong guess hurts, and the probe cap is what keeps a wrong guess cheap: "try my hunch three times, then go back to the normal method." The *reject option* is the classifier saying "I'm not sure" instead of bluffing.

---

## X.5 How many classes? The granularity trade-off `[ESTABLISHED + TO_MEASURE]`

The claim "effectiveness depends on the number and fidelity of the categories" is right in spirit but needs three corrections.

**1. More classes raise the ceiling slowly and cost accuracy quickly.** The ceiling grows as $\log_2 K$: going from 4 to 8 classes adds one bit at most. Meanwhile accuracy usually falls as classes get finer, because neighbouring classes share signals. The net value of a $K$-class taxonomy is

$$
V(K) = \sum_{c=1}^{K} \pi_c \Big[ a_c\,(G_0 - G_c) \;-\; (1-a_c)\,(M_{m,c} - G_0) \Big] - c_{\text{cls}},
$$

where $\pi_c$ is the class frequency and $a_c$ the per-class accuracy. $V(K)$ typically rises and then falls, so there is an interior optimum. This is a value-of-information calculation in the sense of Howard (1966): the classifier is worth what it saves in expected search cost, net of what its errors cost.

**2. The principled name for "choosing the categories" is the Information Bottleneck.** Tishby, Pereira and Bialek (1999) framed the problem of compressing an input $X$ into a small representation $C$ that keeps as much information as possible about a target $R$:

$$
\min_{P(C \mid X)} \; I(X;C) - \beta\, I(C;R).
$$

Designing a defect taxonomy is this problem with $X$ = issue text and $R$ = root-cause location: use as few, as coarse buckets as possible while preserving what predicts where the bug lives. BCF does not need to solve the optimization numerically; the framing tells us what a good class is. A good class is one whose members share a root-cause *mechanism* (and therefore a search strategy), not one whose members merely share vocabulary.

**3. Small samples inflate measured information.** With $n$ labelled tasks, the naive (plug-in) estimate of $I(C;R)$ is biased upward by approximately

$$
\frac{(\lvert\mathcal{C}\rvert - 1)(\lvert\mathcal{R}\rvert - 1)}{2n \ln 2}\ \text{bits}
$$

(the Miller–Madow correction applied to the three entropies that make up mutual information; Miller, 1955). With $n = 30$ tasks, 5 classes, and 20 distinct root-cause files, the bias is about 1.8 bits, close to the 2.3-bit ceiling itself. **With 30 tasks, $I(C;R)$ over files cannot be estimated meaningfully.** The experiments therefore measure guesswork directly and pairwise (X.8), and keep $K$ small.

**Practical rule for this paper `[DESIGNED]`.** Keep the top-level taxonomy at the current five labels (`crash`, `logic`, `edge_case`, `feature`, `unknown`). Add depth only where the signal is free and deterministic. The best example is the **exception type** named in a traceback (`AssertionError`, `AttributeError`, `KeyError`, `TypeError`): it costs no labelled data to extract, it follows Python's own exception hierarchy, and it sharply predicts the fix shape. A two-level hierarchy (class → exception type) adds information without splitting the 30-task sample into tiny groups.

> **Terminology note.** "Exception class" is ambiguous, because Python already uses it for `ValueError` and friends. This paper uses **defect class** for BCF's top-level label and **exception type** for the Python exception named in a traceback. The exception type names the *symptom*, not necessarily the root cause. An `AttributeError: 'NoneType' ...` is very often raised far downstream of the code that produced the `None`. That observation is the bridge to chained defects in the next section.

---

## X.6 Chained defects: masking, ordering, and factorization `[ESTABLISHED + DESIGNED]`

Many hard issues contain more than one defect, and the defects interact. The fault-localization literature calls this **fault interference**: one fault can hide another's failure, or make it appear. Debroy and Wong (2009) documented interference in multi-bug programs, and DiGiuseppe and Jones (2011) found it widespread and showed that localizing faults beyond the first gets harder as faults accumulate.

### X.6.1 A dependency model

Model the $k$ defects in an issue as nodes of a directed acyclic graph $D$ with two kinds of edge:

- **Masking edge** $b_i \multimap b_j$: while $b_i$ is present, $b_j$'s failure is hidden or only partly visible. Fixing in the wrong order costs *rediscovery* (extra searches and test runs) but the final patch can be identical.
- **Semantic edge** $b_i \to b_j$: the correct fix for $b_j$ depends on the state that $b_i$'s fix produces. Fixing in the wrong order can produce a *wrong* fix that must be reworked, with regression risk.

The dossier's complexity rubric already names the second case (Tier 4: "2+ files with causal dependency") and the failure codebook already has `root_cause_order_error`. This model gives both a precise meaning.

### X.6.2 Factorization turns a product into a sum

**Proposition 5 (factorization).** Suppose each defect $b_i$ has a *separable verification signal*: a test or reproduction that fails if and only if $b_i$ is present, given its predecessors in $D$ are fixed. Then the defects can be localized one at a time, and expected localization cost is additive:

$$
\mathbb{E}[T_{\text{loc}}] = \sum_{i=1}^{k} G(R_i \mid C_i).
$$

Without separable signals, the agent can only confirm the *whole set* of fixes, so it is effectively searching pairs (or $k$-tuples) of locations. For independent locations, $H(R_1,\dots,R_k) = \sum_i H(R_i)$, so the guesswork floor $2^{H}/e$ for the joint search is *multiplicative* in the per-defect floors, while factored search is *additive*.

**Synthetic illustration `[SYNTHETIC]`** — two defects, toy model from X.3, expected inspections:

|  | Joint search (pairs) | Factored (one at a time) |
|---|---|---|
| **No classification** | 347.6 | 24.3 |
| **Correct classification per defect** | 22.2 | **6.8** |

The two mechanisms compound. This 2×2 layout is also the right *ablation design* for multi-bug tasks (X.8, H6).

> **Plain-language note.** If two light bulbs in a string are dead and the string only lights when *both* are replaced, you must try pairs: 10 × 10 = 100 combinations. If each bulb has its own tester, you check 10 + 10 = 20. BCF's per-bug spec entries, each with its own hypothesis and check, are the "tester per bulb."

### X.6.3 Ordering

**Proposition 6 (random ordering).** The admissible fix orders are the **linear extensions** of $D$ (orderings that respect every edge). A uniformly random order is admissible with probability $e(D)/k!$, where $e(D)$ counts linear extensions. For a pure chain $b_1 \to b_2 \to \dots \to b_k$ that probability is $1/k!$: one half for two defects, one sixth for three. Recovering an admissible order from the spec's `fix_order` is a **topological sort** (Kahn, 1962).

**The loud-symptom bias `[TO_MEASURE]`.** Agents without a spec step do not order randomly; they chase the most salient failure. A traceback with an exception type is louder than a quietly wrong value, and in chained defects the loud crash is frequently the *downstream* symptom of a quiet upstream logic error. If this holds in the data, a symptom-first agent picks the wrong order *more* often than chance. BCF's defect classes give a usable ordering prior: when a `crash` defect and a `logic` defect co-occur in one issue, the `logic` defect is the more likely upstream node. This is a hypothesis, not a finding.

**Connection to the Phase 1b crash fork `[DESIGNED]`.** BCF's crash strategy already forces a choice between a *state fix* (the bad value came from elsewhere; fix upstream) and a *guard* (the crash site itself is wrong). In the dependency model, that fork is the question "is this crash node a root of $D$, or does it have an upstream parent?"

### X.6.4 Re-classify after every fix

A masked defect may only become visible after its parent is fixed. The protocol is therefore a loop, not a single pass: classify → localize → patch → run the agent's own reproduction → if new failure output appears, classify *that* output and continue. This mirrors model-based diagnosis, where de Kleer and Williams (1987) choose each next measurement to reduce the remaining uncertainty over candidate diagnoses. Note the constraint from the dossier: the hidden `test_patch` is never visible, so re-classification uses only the agent's own test and reproduction output. `[DESIGNED]`

---

## X.7 Reliability compounds across a chain `[ESTABLISHED arithmetic + TO_MEASURE]`

If each of $k$ defects is independently localized and correctly patched with probability $s_i$, then

$$
P(\text{pass}) \approx \prod_{i=1}^{k} s_i \;\times\; P(\text{admissible order or recovered}) \;\times\; P(T \le B).
$$

Because the terms multiply, $\partial \ln P / \partial s_i = 1/s_i$, and a uniform per-defect improvement produces a *larger relative gain on longer chains*.

**Arithmetic illustration `[SYNTHETIC]`:**

| Per-defect success $s$ | 1 defect | 2 defects | 3 defects |
|---|---|---|---|
| 0.6 | 0.600 | 0.360 | 0.216 |
| 0.7 | 0.700 | 0.490 | 0.343 |
| 0.8 | 0.800 | 0.640 | 0.512 |
| 0.9 | 0.900 | 0.810 | 0.729 |

Raising $s$ from 0.7 to 0.8 improves a single-defect task by 14% relative, a two-defect task by 31%, and a three-defect task by 49%.

**Budget.** The full expected turn cost for a $k$-defect task is

$$
\mathbb{E}[T] = c_{\text{cls}} + T_{\text{spec}} + \bar c \sum_{i=1}^{k}\big(a_i G_{c,i} + (1-a_i) M_{m,i}\big) + \sum_{i=1}^{k} \mathbb{E}[T_{\text{patch},i}] + T_{\text{val}} + P_{\text{order}}\,\Delta_{\text{order}},
$$

with $\bar c$ the average turns per inspection. Pass rate depends on the *tail* $P(T \le B)$, not only the mean. The probe cap limits misroute waste to at most $k\,m$ inspections per task, which trims the tail as well as the mean.

**What the taxonomy cannot fix.** Classification acts on localization and recognition. It does not make the model write a correct patch once it is looking at the right lines. If failures are dominated by patch-writing errors, a better taxonomy will not move the pass rate, and the LoRA go/no-go decision in the roadmap is the right place to address that.

---

## X.8 Worked example: `httpx_6821` `[ILLUSTRATIVE]`

> **Provenance.** `httpx_6821` is an **invented task id**. It is not in the competition dataset. Function names, line numbers, and similarity scores are constructed. It appears here only to show how the quantities above map onto a realistic two-defect issue. No number in this subsection is a measurement.

**Issue text (constructed).** A three-hop redirect from `http://` to `https://` ends with `len(r.history) == 1` instead of 3; the reporter adds that accessing `history[0].stream` raises `AssertionError` "after fix."

**Phase 1a — classify each defect from the text alone.**

| Defect | Text signal | Class | Exception type | Fix-shape prior ($d$ lever) |
|---|---|---|---|---|
| $b_1$ history cleared on scheme change | Expected-vs-actual count, no traceback | `logic` | — | A conditional in control flow that resets state |
| $b_2$ hard assert on consumed stream | Named `AssertionError` | `crash` | `AssertionError` | A literal `assert` in source; replace with a raised domain exception |

**Dependency and order.** The phrase "after fix" is a deterministic ordering cue: the reporter found $b_2$ only after changing something, which marks a masking edge $b_1 \multimap b_2$. Topological order: $(b_1, b_2)$. The class-based ordering prior agrees (quiet `logic` upstream, loud `crash` downstream).

Masking in this scenario is **partial**: history still holds one response, so the `AssertionError` is already observable. That is the dangerous case for a symptom-first agent, because the downstream symptom is visible *and* louder. The constructed naive trace in the dossier shows exactly this pattern: it fixes $b_2$ first and only reaches $b_1$ much later.

**Phase 2 — two factored searches, not one joint search.** Each defect gets its own class-specific query (control-flow language for $b_1$, exception-and-property language for $b_2$), so each search runs over its own conditional distribution $P(R_i \mid C_i)$. The naive trace's broad `grep history` returning dozens of lines across several files is a picture of an *unconditioned, unfactored* search.

**Recognition.** Knowing in advance that $b_2$ "looks like a literal `assert`" and that the codebase already defines a domain exception for consumed streams raises $d$ when the agent reads the property, which is the lever that prevents the wrong-fix turns seen in the naive trace.

**What a real run would record** (fields already in the taxonomy and ledger schemas): `multi_bug = true`, `complexity_tier = 4`, per-defect class and `root_cause_symbol`, rank of each gold symbol in the agent's inspection sequence, whether `fix_order` matched the gold order, and any `root_cause_order_error` label.

---

## X.9 Predictions and how the experiments test them `[TO_MEASURE]`

Each hypothesis maps to data the roadmap already plans to collect: the frozen 30-task held-out set, the 8-task pilot, `trace.jsonl` ledgers, and the taxonomy fields `root_cause_symbol`, `multi_bug`, `complexity_tier`, and the failure codebook.

| ID | Prediction | Measurement | Test |
|---|---|---|---|
| H1 | Class routing lowers localization cost | Per task: inspections (tool calls) until the first read of the gold root-cause symbol, default vs class-routed | Paired Wilcoxon signed-rank; report median difference with bootstrap CI |
| H2 | Classes below break-even hurt | Per-class Phase 1a accuracy against taxonomy labels, compared with estimated $a^\*$ | Descriptive; merge or reroute to `unknown` any class below $a^\*$ |
| H3 | The probe cap bounds misroute waste | Extra inspections on misrouted tasks | Check that observed waste $\le m$ |
| H4 | Spec ordering reduces order errors | Frequency of `root_cause_order_error` on multi-bug tasks, baseline vs BCF | Descriptive (expected few multi-bug tasks); McNemar if counts allow |
| H5 | Loud-symptom bias exists in the baseline | Fraction of multi-bug tasks where the baseline's first edit targets the downstream defect | Compare with the random-order rate $e(D)/k!$ |
| H6 | Classification and factorization compound | 2×2 ablation (classification on/off × per-defect decomposition on/off) on multi-bug dev tasks | Descriptive; likely underpowered, reported as exploratory |
| H7 | Relative gain grows with chain length | Relative pass-rate or turn improvement by `complexity_tier` | Descriptive; report per-tier counts alongside every figure |

Pass/fail comparisons use McNemar's test on paired outcomes. Turn counts use paired non-parametric tests. With $n = 30$, only large effects are detectable, and the paper should say so plainly rather than over-read small differences.

---

## X.10 Threats to validity

- **Calibration.** The ratio rule and break-even analysis assume calibrated probabilities; graph similarity scores are not calibrated out of the box.
- **Independence.** The factorization and compounding results assume defects are localized independently. Semantic edges violate this; the model then gives optimistic bounds.
- **Issue-text quality.** By the data-processing inequality, a vague issue caps what any taxonomy can extract. Some tasks will sit at `unknown` regardless of design.
- **Distribution shift.** The hidden evaluation uses private repositories. Classes must be mechanism-based and repo-agnostic; repo keyword maps were already retracted for this reason.
- **Small sample.** Thirty tasks cannot support fine-grained taxonomies or precise information estimates (X.5, point 3).
- **Scope of effect.** The taxonomy acts on localization and recognition, not on patch synthesis (X.7).

---

## X.11 Glossary (beginner-friendly)

- **Guesswork.** Expected number of tries to find something when you always try the most likely option next.
- **Entropy.** Average uncertainty in bits; $2^{H}$ is roughly "how many equally likely options it feels like."
- **Conditional entropy $H(R \mid C)$.** Uncertainty left about $R$ after learning $C$.
- **Mutual information $I(C;R)$.** How many bits of uncertainty about $R$ are removed by learning $C$.
- **Perplexity.** $2^H$, the "effective number of choices."
- **Data-processing inequality.** Processing data can't create information about the source that wasn't already there.
- **Overlook (miss) probability.** The chance of looking in the right place and not noticing.
- **Break-even accuracy.** The classifier accuracy above which routing by class beats not classifying.
- **Reject option.** Letting a classifier abstain when unsure; BCF's `unknown` class.
- **Information Bottleneck.** Compress an input as much as possible while keeping what predicts a target.
- **Value of information.** What a piece of information is worth, measured by how much it improves the decision it feeds.
- **Fault interference / masking.** One bug hiding or altering the visible failure of another.
- **DAG, topological sort, linear extension.** A graph of "must come before" relations with no cycles; an ordering that respects every relation; the set of all such orderings.
- **Miller–Madow bias.** Plug-in entropy estimates from small samples are systematically off; mutual information comes out too high.

---

## References

Verified during drafting (bibliographic details checked against indexes on 2026-09-29):

1. Massey, J. L. (1994). Guessing and entropy. *Proc. IEEE International Symposium on Information Theory (ISIT).*
2. Rioul, O. (2022). Variations on a theme by Massey. *IEEE Transactions on Information Theory.* arXiv:2102.04200.
3. Matula, D. (1964). A periodic optimal search. *American Mathematical Monthly*, 71(1). (Reports Blackwell's search rule.)
4. Debroy, V., & Wong, W. E. (2009). Insights on fault interference for programs with multiple bugs. *ISSRE 2009*, 165–174.
5. DiGiuseppe, N., & Jones, J. A. (2011). Fault interaction and its repercussions. *ICSM 2011*, 3–12.
6. DiGiuseppe, N., & Jones, J. A. (2011). On the influence of multiple faults on coverage-based fault localization. *ISSTA 2011*, 210–220.

Standard references (widely cited; confirm page numbers before submission):

7. Arıkan, E. (1996). An inequality on guessing and its application to sequential decoding. *IEEE Transactions on Information Theory*, 42(1).
8. Stone, L. D. (1975). *Theory of Optimal Search.* Academic Press.
9. Smith, W. E. (1956). Various optimizers for single-stage production. *Naval Research Logistics Quarterly*, 3.
10. Cover, T. M., & Thomas, J. A. (2006). *Elements of Information Theory* (2nd ed.). Wiley.
11. Tishby, N., Pereira, F. C., & Bialek, W. (1999). The information bottleneck method. *Proc. 37th Allerton Conference.* arXiv:physics/0004057.
12. Howard, R. A. (1966). Information value theory. *IEEE Transactions on Systems Science and Cybernetics*, 2(1).
13. Chow, C. K. (1970). On optimum recognition error and reject tradeoff. *IEEE Transactions on Information Theory*, 16(1).
14. Miller, G. A. (1955). Note on the bias of information estimates. In H. Quastler (Ed.), *Information Theory in Psychology.* Free Press.
15. de Kleer, J., & Williams, B. C. (1987). Diagnosing multiple faults. *Artificial Intelligence*, 32(1).
16. Kahn, A. B. (1962). Topological sorting of large networks. *Communications of the ACM*, 5(11).
17. Chillarege, R., et al. (1992). Orthogonal defect classification — a concept for in-process measurements. *IEEE Transactions on Software Engineering*, 18(11). (Industrial precedent for classifying defects to speed root-cause analysis.)
18. Xia, C. S., Deng, Y., Dunn, S., & Zhang, L. (2024). Agentless: Demystifying LLM-based software engineering agents. arXiv:2407.01489. (Precedent for hierarchical narrowing of the localization search space.)

---

## Integration notes for draft v3 (change journal for this insert)

| Location in v2 | Change | Reason |
|---|---|---|
| Abstract | Remove "12–20 calls to 3–4 calls"; replace with the revised thesis in X.0 | Unmeasured claim |
| Figure 4 (12 bug categories) | Replace with the five-label taxonomy plus exception-type second level (X.5) | Categories were invented before data; X.5 explains why $K$ stays small at $n = 30$ |
| Section 6.2 (labeling) | Keep future tense; cross-reference X.9 | Labeling has not happened |
| Section 7 case studies | Keep `httpx_6821` only as the labelled illustration in X.8 | Invented task id |
| New | Insert X.1–X.11 as the theory section, placed before Methods | Gives the experiments falsifiable predictions to test |


Q: Ahhh it has a name! "fault interference" . Please tell me what prior research has been done in the area of solving github repo issues with fault interference, and also the identification of scenarios in a codebase where fault interference can occur? What part of the prior research would be relevant for this?

A: "Fault interference" is one name among several for this idea. Searching under the neighbouring names turns up most of the literature: **multiple-fault localization (MFL)**, **fault interaction**, **fault masking**, **coincidental correctness**, and on the repair side **multi-hunk** or **multi-location repair**. There are three bodies of work, and none of them fully covers your case.

## 1. The classic fault-interference research (2009–2015)

Most of this work studies *spectrum-based fault localization* (SBFL). SBFL records which lines each test executes, then ranks lines as suspicious if failing tests run them more than passing tests do.

- **The founding papers.** Debroy and Wong (ISSRE 2009) showed that simultaneous faults can cause interferences in which some faults hide the incorrect behavior of other faults. Conversely, some faults can help to manifest failures related to other faults. DiGiuseppe and Jones (ICSM 2011 and ISSTA 2011) found a pattern that directly supports your chained-issue model: multiple faults have little impact on finding the first fault, but localization of the faults beyond the first is impaired as the number of faults grows, and interference occurred in 80% of the assessed programs.
- **A reliable survey.** Zakari et al.'s systematic review (Information and Software Technology, 2020) identified 55 studies and is the best single map of the older work.
- **A contradiction worth knowing.** A fault-injection study by Li et al. (2017) reported that the probability of two faults interfering is less than 1%, fault masking is more frequent than fault "construction," and interference is not random: the high-interference double-fault versions always involve the same variable. The "80%" figures probably count per program (does *any* pair interfere?), while the "<1%" figure counts random pairs. Keep the two apart in the paper. The "same variable" finding matters for your second question.

## 2. Formal models and the current frontier

- **The closest current framework to BCF.** Omar Al-Bataineh (GSSI) has an active research line here. His ASE 2025 paper introduces a formal model of the ways faults can interact, including masking, synergy, and cascading, and proposes reasoning about faults as part of a network of influences. Related papers of his cover interaction-aware patch assessment and lightweight test oracles for multi-fault repair. I'd align your "masking edge / semantic edge" vocabulary with his.
- **Iterative test-suite reduction.** Callaghan and Fischer (2023) localize one fault, remove the tests it explains, and localize again. They also flag a benchmark problem: the literature's default dataset is overwhelmingly single-fault versions, with only some accidental multi-fault versions.
- **Coupling theory.** Gopinath et al. (ICST 2017) separate weak interactions, which the coupling effect can model, from strong interactions that produce faults semantically different from the originals.

## 3. Repair and GitHub-issue research (the LLM era)

- **Divisible vs indivisible bugs.** This is the most important paper for you. Xin et al. (FSE 2024) show that a divisible multi-hunk bug is essentially a combination of multiple bugs triggering different failures, and that most earlier multi-hunk evaluations were inflated by them. Their IBugFinder tool found 139 divisible bugs among 281 multi-hunk Defects4J bugs. Studying developer and tool patches, they identified 8 partial-patch relationships. This split is exactly the separability condition in the factorization proposition of the draft section: divisible bugs factor, indivisible ones don't.
- **Iterative repair.** ITER (Ye and Monperrus, ICSE 2024) improves partial patches into multi-location patches by re-running fault localization after each step. This is the published precedent for BCF's "re-classify after every fix" loop.
- **Divide and conquer.** PReMM (OOPSLA 2025) targets the fact that most LLM repair techniques assume the fix is confined to a single method.
- **Evidence from agents on GitHub issues.** No study I found analyzes fault interference inside SWE-bench-style agent runs specifically, so treat that as a gap BCF might fill (my search could have missed something). The indirect evidence is consistent with it:
  - One analysis of SWE-agent patches found that agents rarely apply broad, multi-location changes on complex problems.
  - Multi-SWE-bench reports agents exhausting the 50-round limit, sometimes without even submitting, and plots the resolved rate against the number of files the fix touches.
  - SWE-EVO reports 21% versus 65% on SWE-bench Verified for sustained multi-file work.

## Where interference can occur in a codebase

The mechanism comes from the **reachability–infection–propagation (RIP) model**: a failure requires that the defect is reached, the program state is infected, and the infection propagates to the output. Masking is propagation failing. That happens either because another fault absorbs the error or because the code "recovers" from it. The studied form is *coincidental correctness*, where a faulty line runs but the output is still correct. Masri and Assi measured it on real Defects4J bugs and found it harms fault localization.

Combining RIP with the same-variable finding and the exception-handling studies gives a list of hotspots. The list is my synthesis, not a published taxonomy:

1. **Over-broad or silent exception handlers.** De Pádua and Shang found that the Dummy Handler and Generic Catch anti-patterns have a strong statistical relationship to defects. These are masking points by construction.
2. **Two suspects writing the same state.** This follows from the same-variable finding. In a code graph it is a cheap query: do two candidate locations share a def-use chain or write the same attribute? httpx's history list is exactly this.
3. **Recovery and default paths.** Fallbacks like `.get(k, default)`, `x or []`, retries, and caches hide an upstream bad value.
4. **Information-losing operations.** Truncation, rounding, deduplication, and the like, where an erroneous state does not propagate, such as when an erroneous value is multiplied with 0.
5. **Validation downstream of a producer.** Asserts and type checks crash loudly downstream of a quiet logic bug. This is the loud-symptom pattern from the draft.

## What's most relevant for BCF, in priority order

1. **Xin et al.'s method, as a labeling tool.** On training tasks you have the gold patch. Apply subsets of its hunks, run the tests, and see which failures each subset clears. That reveals each task's real dependency graph (divisible or indivisible, masking or semantic) instead of guessing it. It would give your taxonomy's `multi_bug` and ordering labels an empirical basis.
2. **DiGiuseppe and Jones's first-fault finding,** as the prior evidence behind the loud-symptom and ordering hypotheses.
3. **ITER and Callaghan and Fischer,** as precedents that make the re-classify loop a known-good pattern rather than an untested idea.
4. **Al-Bataineh's model,** for vocabulary and related work, and because his patch-assessment work covers something the draft underplays. During repair, the agent's own partial patch becomes a second fault that can mask or trigger failures. That is how PASS_TO_PASS regressions happen.
5. **The hotspot list,** as generic, repository-agnostic signals. These respect the dossier's rule that nothing repository-specific transfers to the hidden private repos.

One caution: almost all of this evidence comes from Java or C programs with seeded or benchmark faults. Its applicability to Python GitHub issues with a Gemma agent is a reasonable hypothesis, not an established result, and the paper should frame it that way.

I can turn this into a cited Related Work section in Markdown to sit beside the theory insert.

A: I've written Section Y as a companion to the theory insert. It follows the same conventions: provenance tags on every claim, skippable plain-language notes, and a change journal at the end. The theory file itself is unchanged; the journal lists the cross-references to add to it when you merge the two.

The section has six survey and positioning parts plus two practical artifacts:

- **Y.1–Y.5, the literature.** Fault interference, formal interaction models, iterative disentangling, multi-hunk repair, and evidence from coding agents. It deals with the prevalence contradiction (80% vs under 1%) directly instead of quoting whichever number suits the argument.
- **Y.6, positioning.** A table of what each idea borrows from prior work and what BCF adds. It also states plainly what the paper does *not* claim as novel, in line with the dossier's retractions.
- **Y.7, a hotspot catalogue.** Seven code patterns where masking or cascading is likely, such as silent exception handlers, shared mutable state, state resets, and downstream asserts. Each comes with a detection signal that works on any repository. It's labelled as my synthesis of the cited findings, not a published taxonomy.
- **Y.8, a labeling protocol.** It adapts Xin et al.'s method: apply subsets of the gold patch's hunks, run the tests, and read off each task's real interaction graph (divisible or indivisible, masking or semantic edges, and the gold fix order). This works because your training file includes both `patch` and `test_patch` for all 129 tasks, and neither is used at evaluation time. It turns hypotheses H4 and H5 from judgement calls into measurements, and the counts it produces are a publishable descriptive result in their own right.

In the reference list, some entries are marked *(confirm)* because I saw their title and venue in an index but haven't checked page numbers or the author list. Clear those before submission, especially the Callaghan & Fischer venue and the Aleithan study, which I only found through a secondary summary.

###

BCF-whitepaper-v3-section-related-work-fault-interference (1).md

---
title: "BCF Whitepaper — Draft v3 insert: Related Work on Fault Interference and Multi-Fault Repair"
status: Draft [B] — literature section; contains no BCF measurements
companion_to: "BCF-whitepaper-v3-section-class-conditioned-search.md (Section X, theory)"
date: 2026-09-29
provenance_legend:
  VERIFIED: "Bibliographic details checked against indexes or publisher pages on 2026-09-29"
  PARTIAL: "Title/authors/venue seen in an index or reference list; page numbers or year to confirm"
  SYNTHESIS: "The author's own synthesis of cited findings; not a published taxonomy"
  DESIGNED: "BCF design choice; not yet run"
---

# Section Y — Related Work: fault interference, multi-fault localization, and multi-location repair

> **Reader's map.** Y.1–Y.5 survey prior work. Y.6 positions BCF against it. Y.7 and Y.8 turn the literature into two concrete BCF artifacts: a catalogue of code patterns where interference is likely, and a labeling protocol for the training set. Blocks marked *Plain-language note* can be skipped by expert readers.

---

## Y.1 Fault interference in multiple-fault localization

Most fault-localization research historically assumed a program contains one fault. The sub-field that drops this assumption is called **multiple fault localization (MFL)**. Zakari et al. (2020) systematically reviewed it, identifying 55 relevant studies from 2009–2018, and describe MFL as more complicated, tedious, and costly than the single-fault case. `[VERIFIED]`

The core phenomenon was named by **Debroy and Wong (2009)**: simultaneous faults *interfere*. Some faults hide the incorrect behavior of others (destructive interference, or masking); others help failures appear that would otherwise stay hidden (constructive interference). A widely cited survey reports that their experiments found interference in 67% of the programs assessed (de Souza, Chaim & Kon, 2016). `[VERIFIED]`

**DiGiuseppe and Jones (2011a, 2011b)** added the finding most relevant to chained defects. The presence of several faults barely affects localization of the *first* fault (about a 2% decrease in effectiveness), but localization of the faults *beyond* the first degrades as faults accumulate, and some faults became unlocalizable. They observed interference in 80% of assessed programs. Xue and Namin, in the same survey's summary, report that interference can reduce the effectiveness of the Ochiai ranking metric by 20% while *improving* it in around 30% of cases. Interference cuts both ways. `[VERIFIED via survey]`

**A contradiction to handle carefully.** A fault-injection study on the Siemens suite (Li, Yan, Liu & Wang, 2017) reported that the probability of two faults interfering is *below 1%*, that masking is more frequent than constructive interference, and that interference is not random: the high-interference double-fault versions always involved the same variable. The prevalence figures differ by two orders of magnitude, most plausibly because they count different units. The 67–80% figures are per *program* (does any fault pair interfere anywhere?), whereas the below-1% figure is per randomly chosen *pair* of faults. This paper does not treat either number as a prior for BCF's task distribution; it uses the qualitative findings (first fault easier than later faults; interference concentrated on shared state). `[SYNTHESIS]`

> **Plain-language note.** *Spectrum-based fault localization* (SBFL) records which lines each test executes and ranks lines as more suspicious when failing tests run them more than passing tests do. *Ochiai* and *Tarantula* are two formulas for that suspiciousness score. Interference breaks the statistics: a line that really is buggy can look innocent because another bug stopped its failure from showing.

---

## Y.2 Formal models of how faults interact

The most direct current framework is a research line by **Al-Bataineh**. The ASE 2025 NIER paper *Debugging the Undebuggable* introduces a formal model covering masking, synergy, and cascading interactions, and proposes reasoning about faults as a network of influences rather than in isolation. Related papers by the same author address obstacles in multi-fault repair (ASE 2024 NIER), current challenges in multi-fault repair (APR 2025), test oracles for multi-fault repair (ICSME 2025 NIER), and interaction-aware patch assessment (ASE 2025 NIER). BCF's dependency model (Section X.6) adopts compatible vocabulary: its *masking edge* corresponds to masking, and its *semantic edge* is a special case of the cascading and synergy relations. `[VERIFIED — titles and venues; page numbers to confirm]`

**Gopinath, Jensen and Groce (ICST 2017)** analyze *composite faults* and distinguish two kinds of interaction. *Weak* interactions are captured by the classical coupling effect, the assumption that tests catching simple faults also catch their combinations. *Strong* interactions produce faults semantically different from their parts and should be treated as independent atomic faults. For BCF, a strongly interacting pair behaves like a new, single defect and cannot be factored. `[PARTIAL]`

**Niu et al. (IEEE TSE, 2020)** show the same problem in combinatorial testing: with multiple faults, masking effects can hide failures, so algorithms that isolate the minimal failure-causing input combination can blame the wrong factors. `[VERIFIED — TSE 46(2):141–162]`

Two older threads formalize multi-fault diagnosis as reasoning over candidate *sets* rather than single locations. De Kleer and Williams (1987) choose each next measurement to reduce uncertainty over multiple-fault diagnoses. Abreu, Zoeteweij and van Gemund (2011) bring that model-based, multi-fault reasoning to software fault localization. `[PARTIAL]`

---

## Y.3 Disentangling faults: parallel debugging and iterative reduction

A second family of work tries to separate failures by cause before localizing.

- **Parallel debugging.** Jones, Bowring and Harrold (ISSTA 2007) cluster failing tests so that each cluster targets one fault, which lets separate developers debug in parallel. `[VERIFIED]`
- **Classifying failing tests.** Yu, Bai and Cai (ICSE 2015) ask whether each failing test executes a single fault or several, and propose an approach to classify them. `[VERIFIED]`
- **Fault causality.** DiGiuseppe and Jones (ICST 2012) study how program behavior and failure clusters relate to fault causality. `[VERIFIED]`
- **Iterative test-suite reduction.** Callaghan and Fischer (2023) localize one fault, reduce the test suite to remove what that fault explains, and repeat. They define *exposure* and *masking* formally in terms of which faults are executed by failing tests, and note that the standard Defects4J dataset is overwhelmingly single-fault, containing only some accidental multi-fault versions. `[VERIFIED — arXiv:2306.09892; venue to confirm]`

The iterative approach is the closest classical analogue to BCF's re-classify-after-every-fix loop (Section X.6.4). BCF applies the same idea to issue text and the agent's own reproduction output instead of to coverage spectra.

---

## Y.4 Multi-hunk and multi-location program repair

Repair research reached multi-fault problems from a different direction: patches that must touch several places.

**Xin, Wu, Tang, Liu, Reiss and Xuan (FSE 2024)** is the most important reference for this paper. They distinguish *divisible* multi-hunk bugs, which are really several independent bugs causing different failures, from *indivisible* ones, which need all hunks together. They argue earlier multi-hunk evaluations were misguided because Defects4J contains many divisible bugs. Their tool, IBugFinder, found 139 divisible bugs among 281 multi-hunk Defects4J bugs and created 249 new isolated bugs (105 of them multi-hunk). Existing repair techniques fixed only a small number of the indivisible bugs. From developer and tool patches they identified **8 relationships between partial patches**. `[VERIFIED — Proc. ACM Softw. Eng. 1(FSE):2747–2770]`

Their divisible/indivisible split maps exactly onto the separability condition in Proposition 5 (Section X.6.2): divisible bugs have separable verification signals and can be searched one at a time; indivisible bugs cannot.

Other repair work in this family:

- **Hercules** (Saha, Saha & Prasad, ICSE 2019) exploits evolutionary siblings, code that changed together historically, to repair multi-hunk bugs. `[VERIFIED — pp. 13–24]`
- **ITER** (Ye & Monperrus, ICSE 2024) improves partial patches iteratively and builds multi-location patches with fault localization re-executed after each step. It is the published precedent for localize → patch → re-localize. `[VERIFIED — doi:10.1145/3597503.3623337]`
- **PReMM** (Xie et al., OOPSLA 2025) observes that LLM repair techniques mostly assume the fix lives in one method, and repairs multi-method bugs by divide and conquer with separate fault-analysis and patch-generation agents. `[VERIFIED — PACMPL 9(OOPSLA2):1316–1344]`
- **MultiFixer** (2026) and **SiblingRepair** (2026) are recent LLM-based multi-hunk systems. `[PARTIAL — arXiv:2607.26591, arXiv:2605.06209]`

A 2025 survey of LLM-based repair summarizes the trade-off: agentic frameworks handle multi-hunk and cross-file bugs, but at the price of latency and complexity (Yang et al., 2025). `[VERIFIED — arXiv:2506.23749]`

---

## Y.5 Evidence from coding agents on repository issues

No study found in this review analyzes fault interference *as such* inside SWE-bench-style issue resolution by LLM agents. The indirect evidence points the same way as the classical literature.

- **Localization dominates failures.** In a harness-design study on SWE-bench, file localization was the earliest failed stage in roughly half of unresolved runs for a 30B open model (Table 10 of arXiv:2609.20804). `[VERIFIED]`
- **File-level localization is necessary but not sufficient.** Across three agents, over 90% of successful patches touched the gold patch's files, but only about 27% modified the gold function (arXiv:2511.00197). `[VERIFIED]`
- **Agents avoid multi-location changes.** A manual analysis of 251 SWE-agent + GPT-4 patches (Aleithan et al., summarized in arXiv:2506.17208) found that on harder issues agents rarely apply broad, multi-location changes. `[VERIFIED via secondary summary; cite primary before submission]`
- **Turn budgets are exhausted on complex tasks.** Multi-SWE-bench reports agents running out of a 50-round interaction limit, sometimes without submitting, and plots resolved rate against the number of files a fix modifies (arXiv:2504.02605). `[VERIFIED]`
- **Multi-file work is much harder.** SWE-EVO reports 21% resolution against 65% on SWE-bench Verified for sustained multi-file evolution tasks (arXiv:2512.18470). `[VERIFIED]`
- **Hierarchical narrowing is established.** Agentless (Xia et al., 2024) localizes from files to classes and functions to edit locations before patching. `[VERIFIED]`

---

## Y.6 Positioning BCF

| Idea | Prior art | What BCF adds or changes |
|---|---|---|
| Faults interfere; later faults are harder | Debroy & Wong 2009; DiGiuseppe & Jones 2011 | Applies the finding to issue-text-driven agents under a hard turn budget |
| Formal interaction model | Al-Bataineh 2025; Gopinath et al. 2017 | Reduces it to two operational edge types (masking, semantic) that change agent behaviour: ordering vs joint repair |
| Localize one fault, then re-localize | Callaghan & Fischer 2023; ITER 2024 | Re-classifies from the agent's own reproduction output; no coverage spectra needed |
| Divisible vs indivisible | Xin et al. 2024 | Uses the split as the precondition for factored search (Prop. 5), and as a labeling protocol (Y.8) |
| Hierarchical narrowing | Agentless 2024; ODC 1992 | Adds mechanism-based defect classes as side information with a bounded misroute cost (Section X.4) |

**What this paper does not claim.** Graph-first localization, the four-phase loop, iterative re-localization, and multi-fault awareness each have precedents. The claimed contribution is their combination under the competition's constraints, the search-theoretic account of *why* class conditioning and factorization should help (Section X), and measurements that test those predictions. `[SYNTHESIS]`

**The gap BCF can speak to.** Classical interference studies use coverage spectra on seeded or benchmark faults, mostly in Java and C. LLM-agent studies measure localization and multi-file difficulty but not interference. Measuring how often chained defects occur in a Python issue-resolution corpus, and whether ordering and factorization help a small open model, sits between the two. It should be presented as exploratory: with 129 training tasks and a 30-task held-out set, multi-defect tasks will be few.

---

## Y.7 Where interference arises in a codebase: a hotspot catalogue `[SYNTHESIS + DESIGNED]`

The mechanism comes from the **reachability–infection–propagation (RIP)** model. A failure requires that the faulty location is reached, the program state becomes infected, and the infection propagates to the output. When a faulty location runs but the output is still correct, the result is *coincidental correctness*. Abou Assi, Masri and Trad (2021) distinguish *weak* coincidental correctness (reached, not infected) from *strong* (infected, not propagated) and study its effect on Defects4J. Masri and Assi (2014) showed it is prevalent and harms fault localization. **Masking is propagation failing**, either because a second fault absorbs the error or because the code recovers from it. `[VERIFIED]`

Combining RIP with the shared-variable finding (Li et al., 2017) and exception-handling studies gives the following catalogue. It is the author's synthesis, not a published taxonomy. Every signal is generic and repository-agnostic, so it can run on the hidden private repositories.

| # | Hotspot | Why it masks or cascades | Detection signal (static or graph) |
|---|---|---|---|
| H1 | Silent or over-broad exception handlers | The error is caught and discarded; downstream code runs on bad state. De Pádua & Shang (MSR 2018) found Dummy Handler and Generic Catch strongly related to post-release defects. | `except:` / `except Exception:` whose body is `pass`, a log call, or a default return |
| H2 | Two suspects touching the same state | Interference concentrates on shared variables (Li et al., 2017) | Two candidate symbols with a write→read path to the same attribute or container in the code graph |
| H3 | Recovery and default paths | An upstream bad value is replaced by a plausible default | `.get(k, default)`, `x or []`, `getattr(..., default)`, retry loops, cache fallbacks near a candidate |
| H4 | State reset or clear | Evidence of an earlier error is erased (the `history = []` pattern in the httpx illustration) | Reassignment to an empty literal, `.clear()`, or re-initialization inside a loop or conditional |
| H5 | Information-losing operations | Distinct wrong values collapse into one output | Rounding, truncation, `int()`, `set()` dedupe, `min`/`max` clamps on a data path |
| H6 | Downstream validation of an upstream producer | A quiet logic bug surfaces as a loud crash elsewhere; the crash site is a symptom | `assert`, `isinstance` checks, or raised `ValueError`/`TypeError` whose checked value is produced in a different module |
| H7 | Weak test oracles | Tests pass on wrong state, so masking is invisible | Tests asserting only "no exception" or only type/length, not values |

**How BCF uses the catalogue `[DESIGNED]`.** In Phase 2, when the top two localization candidates are joined by an H2 path or separated by an H1, H3, or H4 site, the agent treats the issue as possibly multi-defect even if the text describes one symptom. It then checks the upstream candidate before patching the crash site. This implements the Phase 1b crash fork (state fix vs guard) with evidence from code structure rather than guesswork. Whether the flag improves outcomes is an empirical question for the ablation plan.

---

## Y.8 Labeling protocol: recovering each task's interaction graph `[DESIGNED]`

Adapted from the enumeration idea behind IBugFinder (Xin et al., 2024). **Training tasks only**: it needs the reference `patch` and `test_patch`, which the dataset documents as present in the published training file and absent from the hidden test set. Nothing here runs at evaluation time.

1. **Split** the reference `patch` into hunks $h_1, \dots, h_n$.
2. **Apply** `test_patch` plus each subset $S$ of hunks to `base_commit`, run the task's tests, and record per-test pass/fail. With $n \le 4$ that is at most 16 runs per task. For larger $n$, test all singletons and all leave-one-out subsets ($2n$ runs) instead of all $2^n$.
3. **Derive labels** from the pass/fail pattern:
   - **Divisible:** disjoint groups of hunks each turn a disjoint set of failing tests green. Record the groups as separate defects.
   - **Indivisible:** some test turns green only when a group of hunks is applied together. Record one defect with a joint fix.
   - **Masking edge $b_i \multimap b_j$:** applying $b_j$'s hunks alone changes no test outcome, but applying them after $b_i$ does.
   - **Semantic edge $b_i \to b_j$:** $b_j$'s hunks alone make an existing passing test fail, or they only pass once $b_i$ is present.
   - **Gold fix order:** a topological sort of the resulting graph.
4. **Store** the labels in the taxonomy as `multi_bug`, a new `interaction` field (`none` / `divisible` / `indivisible`), and `depends_on` edges typed `masking` or `semantic`. The spec schema already carries `depends_on` and `fix_order`.
5. **Validate** a random sample by hand, and record `human_override` as the codebook requires.

**What the labels enable.** Hypotheses H4 and H5 in Section X.9 (order errors and loud-symptom bias) become measurable against real interaction graphs rather than annotator judgement. The prevalence of divisible, indivisible, masking, and semantic structure in the 129 training tasks becomes a descriptive result in its own right, and fills part of the gap identified in Y.6.

**Caveats.** Hunks are a proxy for defects: one defect can span several hunks, and one hunk can touch two defects. Test outcomes can be flaky, so each subset run should be repeated when results disagree with neighbouring subsets. The protocol measures interaction *as the tests see it*, which inherits any weak oracles (H7).

---

## References (Section Y)

Checked against indexes or publisher pages on 2026-09-29 unless marked *(confirm)*.

- Abou Assi, R., Masri, W., & Trad, C. (2021). How detrimental is coincidental correctness to coverage-based fault detection and localization? An empirical study. *Software Testing, Verification and Reliability*, 31(5).
- Abou Assi, R., Trad, C., Maalouf, M., & Masri, W. (2019). Coincidental correctness in the Defects4J benchmark. *Software Testing, Verification and Reliability*, 29(3).
- Abreu, R., van Gemund, A. J. C., & Zoeteweij, P. (2011). Simultaneous debugging of software faults. *Journal of Systems and Software*. doi:10.1016/j.jss.2010.11.915 *(confirm volume)*
- Al-Bataineh, O. I. (2025). Debugging the undebuggable: Why multi-fault programs break debugging and repair tools. *ASE 2025, NIER track*, 3804–3808.
- Al-Bataineh, O. I. (2024–2025). Related NIER and workshop papers on multi-fault repair: ASE 2024; APR 2025; ICSME 2025; ASE 2025 (interaction-aware patch assessment). *(confirm co-authors and pages)*
- Callaghan, D., & Fischer, B. (2023). Improving spectrum-based localization of multiple faults by iterative test suite reduction. arXiv:2306.09892. *(confirm venue and first-author initial)*
- Debroy, V., & Wong, W. E. (2009). Insights on fault interference for programs with multiple bugs. *ISSRE 2009*, 165–174.
- de Kleer, J., & Williams, B. C. (1987). Diagnosing multiple faults. *Artificial Intelligence*, 32(1).
- de Pádua, G. B., & Shang, W. (2017). Studying the prevalence of exception handling anti-patterns. *ICPC 2017*, 328–331.
- de Pádua, G. B., & Shang, W. (2018). Studying the relationship between exception handling practices and post-release defects. *MSR 2018*.
- de Souza, H. A., Chaim, M. L., & Kon, F. (2016). Spectrum-based software fault localization: A survey of techniques, advances, and challenges. arXiv:1607.04347.
- DiGiuseppe, N., & Jones, J. A. (2011a). Fault interaction and its repercussions. *ICSM 2011*, 3–12.
- DiGiuseppe, N., & Jones, J. A. (2011b). On the influence of multiple faults on coverage-based fault localization. *ISSTA 2011*, 210–220.
- DiGiuseppe, N., & Jones, J. A. (2012). Software behavior and failure clustering: An empirical study of fault causality. *ICST 2012*, 191–200.
- Gopinath, R., Jensen, C., & Groce, A. (2017). The theory of composite faults. *ICST 2017*. *(confirm pages)*
- Jones, J. A., Bowring, J. F., & Harrold, M. J. (2007). Debugging in parallel. *ISSTA 2007*, 16–26.
- Li, J., Yan, X., Liu, B., & Wang, S. (2017). An insight of double-faults interactions in program: An empirical study. *ICRSE 2017*. doi:10.1109/ICRSE.2017.8030752
- Masri, W., & Assi, R. A. (2014). Prevalence of coincidental correctness and mitigation of its impact on fault localization. *ACM TOSEM*, 23(1), 8:1–8:28.
- Niu, X., et al. (2020). Identifying failure-causing schemas in the presence of multiple faults. *IEEE TSE*, 46(2), 141–162. *(confirm author list)*
- Saha, S., Saha, R. K., & Prasad, M. R. (2019). Harnessing evolution for multi-hunk program repair. *ICSE 2019*, 13–24.
- Xia, C. S., Deng, Y., Dunn, S., & Zhang, L. (2024). Agentless: Demystifying LLM-based software engineering agents. arXiv:2407.01489 (also *Proc. ACM Softw. Eng.* 2(FSE), 2025).
- Xie, L., Li, Z., Pei, Y., Wen, Z., Liu, K., Zhang, T., & Li, X. (2025). PReMM: LLM-based program repair for multi-method bugs via divide and conquer. *PACMPL* 9(OOPSLA2), 1316–1344.
- Xin, Q., Wu, H., Tang, J., Liu, X., Reiss, S. P., & Xuan, J. (2024). Detecting, creating, repairing, and understanding indivisible multi-hunk bugs. *Proc. ACM Softw. Eng.*, 1(FSE), 2747–2770.
- Yang, B., et al. (2025). A survey of LLM-based automated program repair: Taxonomies, design paradigms, and applications. arXiv:2506.23749.
- Ye, H., & Monperrus, M. (2024). ITER: Iterative neural repair for multi-location patches. *ICSE 2024*. doi:10.1145/3597503.3623337
- Yu, Z., Bai, C., & Cai, K.-Y. (2015). Does the failing test execute a single or multiple faults? An approach to classifying failing tests. *ICSE 2015*, 924–935.
- Zakari, A., Lee, S. P., Abreu, R., Ahmed, B. H., & Rasheed, R. A. (2020). Multiple fault localization of software programs: A systematic literature review. *Information and Software Technology*, 124, 106312.

Agent-evaluation sources cited in Y.5 by arXiv id: 2504.02605 (Multi-SWE-bench), 2506.17208 (SWE-bench leaderboard analysis), 2511.00197 (agent trajectory study), 2512.18470 (SWE-EVO), 2609.20804 (harness design study). Confirm titles and authors before submission.

---

## Change journal for this insert

| Target | Change | Reason |
|---|---|---|
| Whitepaper v3 | **New section Y**, placed after Section X (theory) and before Methods | Grounds the chained-defect model in prior work |
| Section X.6 (theory) | Add cross-references: masking/semantic edges ↔ Al-Bataineh 2025; Prop. 5 separability ↔ Xin et al. 2024 divisible/indivisible; X.6.4 re-classify loop ↔ ITER and Callaghan & Fischer | Ties each proposition to precedent |
| Section X.9 (hypotheses) | H4 and H5 measured against Y.8 interaction labels instead of annotator judgement | Replaces a subjective label with an empirical one |
| Taxonomy schema | Add `interaction` field (`none` / `divisible` / `indivisible`); type `depends_on` edges as `masking` or `semantic` | Needed by Y.8 |
| Section X.8 (httpx illustration) | Note that H4 (state reset) and H6 (downstream `assert`) both appear in the constructed example | Links the illustration to the catalogue |
| Section X references | No entries removed; Section Y keeps its own list | Preserves the prior insert unchanged |


