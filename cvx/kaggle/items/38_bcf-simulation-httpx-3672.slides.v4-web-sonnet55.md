# BCF × httpx-3672 — v4 Deep-Dive: How Each Step Is Chosen, What It Buys, and How to Climb to the Next Accuracy Tier

**Bottom line up front:** Under the competition's actual constraints, BCF's turn optimizations matter because wall-clock time is the real budget, not tokens. A 12-hour limit across about 120 hidden tasks leaves roughly 6 minutes per task, and community measurements show about 20 seconds per tool step, which means an agent gets on the order of 15–18 actions per task. The next accuracy tier will come from three things working together: (1) making every action maximize information gain about *where* and *how* to patch, (2) giving the agent cheap, execution-grounded verification before it submits, and (3) a LoRA adapter trained by rejection sampling on filtered successful trajectories. Prompt polish alone will not get there.

> **Mentor's honesty note (read first).** The research environment that produced this report could not open the files in `/mnt/project/`. That includes `03-bcf-simulation-httpx-3672_slides_v3.html`, the Reference Compendium, HARNESS_README and the Competition Plan. So the per-step walkthrough below is built on (a) the public competition specification, dataset schema and tool contracts; (b) public facts about the upstream httpx change; and (c) the BCF concepts described in your brief (spec-first, Tier A/B/C). Each step comes with a "v3 slide #" column for you to map onto your deck. Where the v3 deck makes a different choice, trust v3 and use this report's analysis on that choice. Nothing in v3 should be dropped. v4 is meant to be layered *on top of* v3's content.

---

## TL;DR

- **The binding constraint is time per action.** The competition gives you 12 hours for all ~120 hidden tasks, and community runs report ~20 s per tool step plus ~9 min of startup.\[1\] That works out to roughly 15–18 tool calls per task. Every BCF step should therefore be judged by *information gain per turn*: how much uncertainty about the fix location and fix shape it removes, divided by the seconds it costs.
- **BCF's spec-first, tiered loop already beats a naive ReAct loop on paper**, because it front-loads localization and constrains edits. The literature says the next jump comes from verification and training rather than more prompting. SWE-agent showed edit guardrails (linting) lifted resolve rate from 15.0% to 18.0%. Agentless (Xia et al., FSE 2025) showed a structured localize→repair→validate pipeline resolving 32.00% (96 fixes) of SWE-bench Lite at $0.70 per issue, the best among open-source approaches at the time. SWE-Gym (Pan et al.) showed fine-tuning on only 491 successful trajectories gave up to 19% absolute gains, and self-improvement gave up to 19.7% on SWE-Bench Lite.
- **Your measurement apparatus is currently too weak to tell real gains from noise.** At a ~20% resolve rate, a 60-task public leaderboard split has a 95% margin of error of roughly ±10 percentage points. Run paired, multi-seed local experiments on the 129 public tasks, score them with McNemar's test and task-clustered bootstrap CIs, and collect the per-turn telemetry specified in the wishlist below before spending scarce daily submissions.

---

## Key Findings

1. **The game board (Competition SME hat).** The only allowed model is `gemma-4-31b-it-qat-w4a16-ct`, used for every agent and sub-agent.\[2\] You may ship one or more PEFT LoRA adapters and route different adapters to different agents. Scoring is SWE-bench-style PASS/FAIL resolution rate. Each issue's patch is applied and that issue's validation tests are run. The hidden test set has about 120 tasks from *private* repositories, split evenly between public and private leaderboards. For the test set, "a larger frontier model must pass the case or come within a single test of passing." You get one submission per day and can select up to two finals. Key dates: Nov 12 2026 (paper track), Nov 25 2026 (entry/merger), Dec 2 2026 (final).\[3\]
2. **The public dev set is extremely skewed.** Of the 129 public tasks, fastapi has 67, rich 48, requests 13 and httpx 1, across 127 distinct base commits, and `hints_text` is empty in all 129.\[4\] httpx-3672 is the *only* httpx task.\[5\] It makes a great teaching case, but on its own it says almost nothing statistically about your hidden-set score.
3. **httpx-3672's upstream provenance.** The upstream change is encode/httpx PR #3672, "Server connection handling.", by maintainer lovelydinosaur. It was opened from a `reset` branch and merged into the `v1` branch as commit `68989ae`, followed immediately by PR #3673, "Connection resets."\[6\] The `v1` line is the HTTPX 1.0 prerelease, which describes itself as "A complete HTTP toolkit for Python. Supporting both client & server".\[7\] So this is server-side connection-lifecycle code in a rewritten codebase. Treat any prior knowledge Gemma has of httpx 0.x internals as a **contamination risk in reverse**: the model's memories of the old architecture can mislead it.
4. **Context-compaction settings are disputed.** One Kaggle discussion quotes HARNESS_README §7.2 as `EventsCompactionConfig(compaction_interval=15, overlap_size=2, token_threshold=32768, event_retention_size=5)` and notes the Getting Started notebook uses `token_threshold=14336`.\[8\] One community repo asserts that the scorer uses interval 5 and memory utilization 0.80.\[1\] Another states that there is "no compaction inside a task" at `max_model_len=32768`.\[9\] **Verify against your copy of HARNESS_README before designing anything that depends on what survives in context.**
5. **Known harness traps that cost accuracy.** Test files, `conftest.py` and `pytest.ini` are reset before grading, so test edits are wasted. `write_file("/tmp/x")` actually writes `/workspace/tmp/x`, and untracked files end up in the patch. Scratch work should therefore go through `run_command` heredocs to the real `/tmp`. `submit_patch` is free and repeatable. The sample `eval_config` (10 calls / 1 minute) produces near-zero scores and must not be reused.\[9\]
6. **The leaderboard is young and noisy.** As of 2026-10-02 there were 1,330 teams and 4,365 submissions, with a top public score of 0.24 and "many teams tied at 0.15."\[3\] Given the statistical-power math below, a 0.15 vs 0.24 gap on ~60 public tasks is only marginally distinguishable.

---

## Details

### Part 0 — The cast of SMEs in the room

| Hat | What they watch for in this document |
|---|---|
| 🧭 **SWE-agent / benchmark researcher** | Agent loop design, localization, ACI (agent-computer interface) quality, failure taxonomies |
| 🧪 **Statistician / experimentalist** | Paired designs, power, CIs, multiple comparisons, contamination |
| 🛠️ **ML / fine-tuning engineer** | LoRA, QLoRA/QAT, RFT, hyperparameters, data mixtures |
| 🏛️ **Software architect (SOLID)** | Agent/sub-agent decomposition, contracts between tools and prompts |
| 🔤 **LLM tokenization specialist** | How code, whitespace and symbols become tokens, and why exact-string edits fail |
| 🔎 **OSINT / data-provenance specialist** | Where task data came from, leakage paths, upstream history |

---

### Part 1 — Foundations you need before the walkthrough

**🧭 Term: Agent loop / ReAct.**
*Official definition* (Yao et al., ICLR 2023, "ReAct: Synergizing Reasoning and Acting in Language Models"): a prompting paradigm in which the model interleaves *reasoning traces* and *actions*, producing at each step t a thought τₜ, an action aₜ, and receiving an observation oₜ. The policy is π(aₜ | c, o₁..ₜ₋₁, a₁..ₜ₋₁).
*Plain language:* think → do → look → repeat.
*Analogy:* a mechanic who says "probably the alternator," tests the voltage, reads the meter, and updates the plan.

**🧭 Term: POMDP (Partially Observable Markov Decision Process).**
*Definition:* a tuple (S, A, T, R, Ω, O, γ). S is the states, A the actions, T(s′|s,a) the transitions, R the reward, Ω the observations, O(o|s′,a) the observation model, and γ the discount. The agent never sees s, only o, so it must keep a *belief* b(s).
*Why it matters here:* the "true state" is *where the bug is and what the fix is*. Each tool call is an observation that sharpens the belief. Research on training long-context SWE agents formalizes the task exactly this way.\[10\]

**🧪 Term: Entropy and information gain.**
*Definition (Shannon):* H(X) = −Σₓ p(x) log₂ p(x). Information gain from observation Y is IG(X;Y) = H(X) − H(X | Y).
*Plain language:* entropy measures how unsure you are. Information gain is how much a step cuts that uncertainty.
*Analogy:* a game of 20 Questions. A good question halves the remaining possibilities, which is 1 bit.
*Worked example for httpx-3672:* suppose the snapshot has ~100 Python files and you start uniformly unsure which one needs the fix. That is H = log₂100 ≈ 6.6 bits. A graph or embedding search that narrows the candidates to 4 files leaves log₂4 = 2 bits, so that step earned ~4.6 bits. A `read_file` that confirms one function out of 10 in that file earns another ~3.3 bits.

> **🎓 Teachable Moment — "bits per second" is your design currency.** With ~15–18 actions per task, rank every candidate next action by *expected information gain ÷ expected seconds*. A `search_similar_code` call that returns ten ranked symbols in one turn often beats three exploratory `grep`s. A full test-suite run can be worth it near the end, when its gain is about *whether the patch is correct*, but it is wasteful at the start.

**🔤 Term: Tokenization (BPE / SentencePiece).**
*Definition:* a tokenizer maps a string to a sequence of integer IDs from a fixed vocabulary V. Byte-Pair Encoding builds V by repeatedly merging the most frequent adjacent symbol pair. SentencePiece applies this (or a unigram LM) to raw text that includes whitespace.
*Why you care:* code is full of indentation, underscores, dunder names (`__aenter__`) and punctuation. A single space can change the token sequence. The `edit_file(filepath, old_string, new_string)` tool requires an *exact* `old_string` match,\[3\] so a model that "remembers" a line slightly wrong (tabs vs spaces, a trailing space, a stale identifier) produces a failed edit.
*Analogy:* asking a locksmith to copy a key from memory. Close is not good enough.

**🔤 Term: Embedding and cosine similarity.**
*Definition:* an embedding is a function f: text → ℝᵈ. Cosine similarity is cos(u,v) = (u·v) / (‖u‖‖v‖). The competition provides `float32` 256-dimensional embeddings per AST symbol, and `search_similar_code(query, k)` returns the top-k nodes by cosine similarity.\[3\]\[5\]
*Plain language:* "find code that *means* something like my query," even if the words differ.

**🔤 Term: Attention.**
*Definition (Vaswani et al., 2017):* Attention(Q,K,V) = softmax(QKᵀ/√dₖ)·V.
*Why you care:* the model weighs every context token against every other. Liu et al. (TACL 2024, "Lost in the Middle", vol. 12, pp. 157–173) showed that "performance can degrade significantly when changing the position of relevant information."\[11\]\[12\] In practice the start and end of the context are recalled best.\[13\] *Design consequence:* pin the spec/state ledger at the *top* of the context (system prompt) and re-state the current hypothesis at the *bottom* (latest turn).

**🏛️ Term: SOLID (Robert C. Martin).**
- **S**ingle Responsibility: a module should have one reason to change.
- **O**pen/Closed: open for extension, closed for modification.
- **L**iskov Substitution: subtypes must be usable wherever their base type is expected without breaking correctness.
- **I**nterface Segregation: clients shouldn't depend on methods they don't use.
- **D**ependency Inversion: depend on abstractions, not concretions.

*Applied to agents:* a read-only "analyzer" sub-agent that holds only graph/search tools is Single Responsibility plus Interface Segregation. A root agent that depends on a *return schema* rather than on the analyzer's prose is Dependency Inversion.

---

### Part 2 — Per-step walkthrough of the httpx-3672 solution

**How to read this section.** Each step lists (a) **how the next step is determined**, meaning which state, observation or rule selects it, and (b) **what is gained**, meaning the uncertainty reduced, plus failure modes and alternatives. Use the "v3 slide #" column to map each step onto your deck.

#### Step map

| # | Step (BCF phase) | v3 slide # | Primary tool(s) | Uncertainty targeted | Est. turns |
|---|---|---|---|---|---|
| 0 | Harness boot & budget read | ___ | `get_status` (free) | "How much time/how many calls do I have?" | 0–1 |
| 1 | Spec-first issue parse (Tier classification) | ___ | none (reasoning) | "What is being asked; what does done look like?" | 0 (in-prompt) |
| 2 | Repo orientation | ___ | `run_command` (`git log -1`, `ls`, `pyproject`) | "Which codebase era/architecture is this?" | 1 |
| 3 | Semantic localization | ___ | `search_similar_code` | "Which symbols relate to the issue?" | 1–2 |
| 4 | Structural localization | ___ | `get_code_neighbors` / `get_code_subgraph` | "Who calls/is called by the candidates?" | 1–2 |
| 5 | Targeted reading | ___ | `read_file` (line ranges) | "Exactly what does the code do now?" | 2–4 |
| 6 | Reproduction / hypothesis test | ___ | `run_command` (heredoc to `/tmp`, `python`/`pytest -x`) | "Is my hypothesis about the failure right?" | 1–2 |
| 7 | Patch | ___ | `edit_file` (or `write_file` for new files) | "Can I express the fix minimally?" | 1–3 |
| 8 | Static check | ___ | `run_command` (`python -m py_compile`, import) | "Did the edit break syntax/imports?" | 1 |
| 9 | Targeted verification | ___ | `run_command` (`pytest tests/<module> -q -x`) | "Does it fix the case without regressions?" | 1–2 |
| 10 | Submit early, refine, resubmit | ___ | `submit_patch` (free), `git status` hygiene | "Is a valid patch banked before the timer ends?" | 1–2 |

**Total ≈ 11–20 turns.** That sits right at the edge of the ~15–18-action budget, which is why the *stopping rules* in Steps 6–10 matter so much.

---

#### Step 0 — Harness boot & budget read
**(a) How it's chosen:** this is a fixed rule, not a model decision. The harness creates `/workspace` from the snapshot, `sandbox/setup.py` installs offline wheels in editable mode and creates a baseline commit "so `git diff HEAD` captures only the agent's edits". `get_status()` "returns live budget consumption and patch status"\[3\] and does not count against your budget.
**(b) What is gained:** the agent learns its *remaining budget*, which conditions everything else. An agent that doesn't know its budget can't make rational stop/continue decisions.
**Failure modes:** reusing the sample `eval_config` (10 calls/1 min) causes near-universal timeouts.\[9\] Not knowing the per-task cap leads to `NO_PATCH`.

> **🎓 Teachable Moment — Budget-awareness is a policy input, not a footnote.** In decision-theory terms, the value of an action depends on the remaining horizon. "Explore more" is right with 15 turns left and wrong with 2.

#### Step 1 — Spec-first issue parse & Tier classification
**(a) How it's chosen:** BCF's spec-first rule converts `problem_statement` (hints are empty for all public tasks) into a mini-spec *before* any tool use. The mini-spec covers the expected behavior, the observed behavior, the acceptance criterion, and the likely blast radius. The Tier A/B/C label then selects a *playbook*: how much exploration to allow, whether a repro script is mandatory, and the edit-size cap.
**(b) What is gained:** the spec is an explicit hypothesis space. It turns a vague issue into testable statements, and it is cheap because it is pure reasoning with zero tool time.
**Specific to httpx-3672:** the upstream title, "Server connection handling.", together with its sibling "Connection resets",\[6\] strongly implies the acceptance tests exercise the *server-side* connection lifecycle in the 1.0 codebase: keep-alive vs close, and handling peer disconnects. The spec should say explicitly that this codebase "may differ from httpx 0.x". That one sentence guards against the model hallucinating `httpcore`-era APIs.
**Failure modes:** over-specifying, for example inventing a requirement the hidden tests don't check. SWE-agent's failure analysis found "about half (52.0%) of unresolved instances fall into the Incorrect Implementation or Overly Specific Implementation categories."\[14\]

#### Step 2 — Repo orientation
**(a) How it's chosen:** this step is triggered when the spec mentions components whose location is unknown, or when the codebase "era" is ambiguous (as with httpx v1). A single fused shell command is the norm, for example `git log -1 --stat; ls; sed -n '1,40p' pyproject.toml`.
**(b) What is gained:** architectural priors such as package layout, test layout and Python version (the sandbox is Python 3.13).\[3\] This removes "wrong-mental-model" risk.
**Alternative:** skip this step when Step 3's semantic search is confident. That saves one turn on familiar repos like fastapi.

> **🎓 Teachable Moment — Action fusion.** The SoL-Pi harness study (arXiv 2609.20519) names "Action Fusion" as a reusable mechanism that "combines both actions into one tool request," such as an edit followed by a test, "eliminating an intermediate model round trip" and "reducing API calls from three to two." Every `;`-chained shell command is a turn you didn't spend.

#### Step 3 — Semantic localization (`search_similar_code`)
**(a) How it's chosen:** the spec's key nouns and verbs (e.g., "server connection", "keep-alive", "close", "reset") become the query, and k is set to ~10. The rule is: *search before you read.*
**(b) What is gained:** a ranked candidate set of symbols, typically the largest single entropy drop of the whole episode (see the worked example in Part 1).
**Failure modes:** embedding search misses code whose vocabulary differs from the issue, and the 256-d embeddings are compact, so ranking is coarse. *Mitigation:* run two differently-phrased queries, or one query plus a `grep -rn` fallback in a single fused command.
**Literature anchor:** Agentless localizes hierarchically (file → class/function → edit lines) and combines prompting with embedding retrieval.\[15\]\[16\] The FSE 2025 version reports 81.3% correct file localization using both together.\[17\]

#### Step 4 — Structural localization (`get_code_neighbors` / `get_code_subgraph`)
**(a) How it's chosen:** Step 3 returned two or more plausible symbols and it's unclear which one is *causal*. Neighbors reveal callers and callees, and `get_code_subgraph` on the top 3–5 candidates shows how they interconnect.\[3\]
**(b) What is gained:** it separates *where the symptom appears* from *where the fix belongs*. Connection-handling bugs often surface in a read/write method while the fix belongs in a state transition, such as deciding whether to keep the connection alive.
**Data structure note (🧭/🏛️):** the graphs are NetworkX directed *multigraphs* (`directed: true, multigraph: true`). Nodes carry `{id, name, text}`, where text is the full source at base commit. Edges carry `{source, target, type, key}`, and the key distinguishes parallel edges.\[3\] *Teachable bonus:* because nodes include full source text, a subgraph call can sometimes *replace* several `read_file` calls. Weigh that against the extra context it adds.

#### Step 5 — Targeted reading (`read_file` with line ranges)
**(a) How it's chosen:** read only the lines of the top candidate(s), using line numbers from the graph node or a `grep -n`. Community notes report `read_file` truncation around 150 lines / 10K characters,\[18\] so ranged reads are mandatory.
**(b) What is gained:** exact current text. This matters especially for Step 7, because `edit_file` needs an exact `old_string`.
**Failure mode (🔤):** paraphrase drift. If the model reads a function, takes three more turns, and *then* edits from memory, whitespace and identifier drift cause failed edits. *Rule:* re-read the exact lines immediately before editing, or fuse the read and edit plan in a single turn.

#### Step 6 — Reproduction / hypothesis test
**(a) How it's chosen:** for Tier B/C issues, or whenever the cause is uncertain, write a minimal script with a `run_command` heredoc into the *real* `/tmp` (never `write_file`, which pollutes the patch)\[9\] and run it.
**(b) What is gained:** *hypothesis validation*. A failing repro confirms the bug model, and the same script becomes the post-fix oracle. Agentless's validation phase generates reproduction tests for the same purpose and uses them to re-rank candidate patches.\[15\]
**Trade-off:** 1–2 turns. *Decision rule:* skip it if the spec plus code reading make the fix "obvious" (Tier A). Make it mandatory if the fix touches control flow under concurrency or I/O, which a connection-lifecycle task like httpx-3672 likely does.

#### Step 7 — Patch (`edit_file`)
**(a) How it's chosen:** confidence in location plus mechanism exceeds a threshold, and enough budget remains for at least verify + submit (≥ 3 turns).
**(b) What is gained:** the fix itself, kept *minimal*. Smaller diffs carry less regression risk under the Pass-to-Pass check, where the whole suite must still pass.\[3\]
**Literature anchor (🧭):** SWE-agent's ablation shows editing *with* linting at 18.0% vs 15.0% for the edit action without it, and shell-only at 10.3%.\[19\] It also found that after a single failed edit, "there is only a 57.2% chance the edit is ultimately successful."\[14\]

> **🎓 Teachable Moment — Cascading failure is the silent killer.** One malformed edit costs more than one turn, because it *degrades the context* with error text and raises the odds of the next failure. Guardrails pay for themselves.\[19\]

#### Step 8 — Static check
**(a) How it's chosen:** an automatic rule after every edit, ideally fused, for example `python -m py_compile httpx/<file>.py && python -c "import httpx"`.
**(b) What is gained:** syntax and import errors are caught before any expensive test run. This is the competition-legal stand-in for SWE-agent's linting guardrail.

#### Step 9 — Targeted verification
**(a) How it's chosen:** run your `/tmp` repro, then `pytest` on the *module's* test file with `-x -q`. Don't run the full suite, because that costs time.
**(b) What is gained:** evidence for Fail-to-Pass (your repro) and *partial* evidence for Pass-to-Pass (neighboring tests). Remember that the hidden `test_patch` is not visible during scoring.\[3\]
**Failure mode:** "teaching to the test" by editing tests. Those edits are discarded at grading, because tests, `conftest.py` and `pytest.ini` are reset.\[9\]\[18\]

#### Step 10 — Submit early, refine, resubmit
**(a) How it's chosen:** submit as soon as Step 8 passes, then use the remaining turns to improve. `submit_patch` is free and repeatable, and community notes say "the session ends on a text-only reply after submitting."\[9\]
**(b) What is gained:** it turns a "timeout → `NO_PATCH`" outcome into "submitted best-so-far." This is an *anytime algorithm* (see glossary). Hygiene check: `git status` must show no stray scratch files, since untracked files end up in the patch.\[9\]

---

### Part 3 — Naive baseline vs. what BCF does now vs. the next tier

#### 3.1 The naive baseline (🧭)
An unconstrained ReAct loop with all 9 tools has no budget awareness, explores by `grep`/`cat`, edits from memory, runs the full test suite, and submits only at the end. Its predictable failure profile:
- **Timeouts → `NO_PATCH`.** Time ran out before submission.
- **Cascading failed edits.** SWE-agent attributes 23.4% of failures to cascading failed edits.\[14\]
- **Lost-in-the-middle forgetting.** Early findings fall out of attention or out of the compaction window.
- **Patch pollution.** Scratch files leak into the diff.

#### 3.2 What BCF does now (as described in your brief; verify against the Compendium)
- **Spec-first:** converts the issue into checkable criteria before acting, which reduces "overly specific" or wrong-target implementations.
- **Tier A/B/C:** sets the exploration budget by difficulty, a form of *adaptive computation*.
- **Context management:** keeps a compact spec/state ledger so findings survive compaction.
- **Harness constraints:** encodes the trap list (no test edits, `/tmp` via heredoc, early submit).

#### 3.3 Quantifying the turn budget (🧪)
Let T_total = 12 h = 720 min, startup ≈ 9 min (community measurement), N ≈ 120 tasks, per-task sandbox setup ≈ 0.5 min, and seconds per step s ≈ 20.\[1\]

Per-task minutes ≈ (720 − 9)/120 − 0.5 ≈ 5.4 min, so max steps ≈ 5.4 × 60 / 20 ≈ **16 steps**.

Any design that "needs" 25 turns on average is *structurally* doomed under these numbers, and even 16 leaves no slack for slow generations. The community workspace that set "4.5 min / 40 calls / 80 turns per task (~11 h worst case)" is applying the same arithmetic.\[9\] *Fill in your own measured s, startup, and per-task time from your local `swegemma eval` traces. These community figures come from public repos and notebooks, not the organizers.*

#### 3.4 What the next tier requires
1. **Verification beats more exploration.** Brown et al. 2024 ("Large Language Monkeys", arXiv 2407.21787) showed that on SWE-bench Lite, the fraction of issues solved with DeepSeek-Coder-V2-Instruct rose "from 15.9% with one sample to 56% with 250 samples, outperforming the single-sample state-of-the-art of 43%". The bottleneck is *selecting* the right candidate.\[20\] Under your time budget you can't afford 250 samples, but you can afford 2 candidate patches on Tier B/C tasks, selected by your repro and targeted tests.
2. **Training beats prompting at fixed model size.** In SWE-Gym (Pan et al., ICML 2025), built from "2,438 Python tasks sourced from 11 popular open-source repositories," fine-tuning a 32B Qwen-2.5-Coder on only 491 successful trajectories produced "up to 19% absolute gains in resolve rate," and self-improvement boosted performance by up to 19.7% on SWE-Bench Lite. With learned verifiers it reached 32.0%/26.0% on SWE-bench Verified/Lite. In SWE-smith (Yang et al., NeurIPS 2025 D&B Spotlight), SWE-agent-LM-32B was fine-tuned on 5,016 SWE-smith trajectories and reached 40.2% on Verified, against 20.6% for SWE-Gym-32B. Your LoRA adapter slot is the competition's sanctioned lever for this.
3. **Data quality beats data quantity.** Scale-SWE ("Immersion in the GitHub Universe", arXiv 2602.09892) ran an identical distillation-and-SFT pipeline on each dataset and scored SWE-Gym at 54.8, SWE-smith at 54.6 and Scale-SWE at 64.0 on SWE-bench Verified. It notes that "despite SWE-smith possessing a considerably larger volume of instances than SWE-Gym, it yields slightly inferior performance," and concludes that real-world data beats massive synthetic data. *Implication for you:* curate trajectories from real-repo tasks first.
4. **Context engineering as a tier.** "An Empirical Study of Harness Design for Coding Agents" (arXiv 2609.20804, September 2026) compares tiers from T0 (no context management) to T4 (elision + recall + summarization) on SWE-Bench Verified. At a 32k window, context management lifted Nemotron-3 550B from 6.40% (T0) to 58.40% (T3). The study uses soft and hard thresholds at 0.6 and 0.85 of the usable window and keeps "a token-budgeted recent window of at least two turns" verbatim. BCF's ledger is a version of this. Measure it.

---

### Part 4 — Machine-learning vocabulary for the adapter path (🛠️)

Each term below is introduced at the point where the hypotheses need it.

**Parameters / weights.** *Definition:* the learned real numbers θ ∈ ℝᴾ of a model. "31B" means P ≈ 31×10⁹. *Analogy:* the positions of billions of tiny knobs.

**Loss (cross-entropy for next-token prediction).** *Definition:* L(θ) = −(1/N) Σₜ log p_θ(xₜ | x₍<t₎). *Plain language:* how surprised the model is by the correct next token. Training reduces that surprise.

**Gradient descent / learning rate η.** *Definition:* θ ← θ − η ∇_θ L(θ). *Plain language:* take a step downhill. η is the step size: too big and you overshoot, too small and you crawl.

**AdamW & weight decay λ.** *Definition (Loshchilov & Hutter, 2019):* Adam's adaptive per-parameter step plus *decoupled* decay θ ← θ − ηλθ. *Plain language:* a gentle pull toward zero that discourages overfitting.

**Warmup.** *Definition:* ηₜ = η_max · t / T_warm for t < T_warm, then a schedule such as cosine. *Analogy:* idling a cold engine before flooring it.

**Epoch, batch size, gradient accumulation.** An *epoch* is one pass over the training set. *Effective batch* = micro-batch × gradient-accumulation steps × number of devices. *Gradient accumulation* sums gradients over several micro-batches before one update, which lets you simulate a big batch on small GPUs.

**Fine-tuning.** *Definition:* continuing to train a pretrained θ₀ on task data D to get θ*. *Full fine-tuning* updates all P parameters. *Parameter-efficient fine-tuning (PEFT)* updates a small added or selected subset.

**LoRA (Hu et al., 2021, "LoRA: Low-Rank Adaptation of Large Language Models", ICLR 2022).**
*Definition:* for a frozen weight W₀ ∈ ℝᵈˣᵏ, learn ΔW = B·A with B ∈ ℝᵈˣʳ, A ∈ ℝʳˣᵏ and rank r ≪ min(d,k). The forward pass is h = W₀x + (α/r)·B·A·x. B is initialized to 0, so training starts exactly at the base model.
- **Rank r:** capacity of the update. Trainable params per adapted matrix = r(d+k).
- **Alpha α:** scaling. The effective update magnitude ∝ α/r.
- **LoRA dropout p:** each input to the adapter path is zeroed with probability p during training (regularization).
- **Target modules:** which matrices get adapters, e.g., attention `q_proj, k_proj, v_proj, o_proj` and/or MLP `gate_proj, up_proj, down_proj`.
*Worked example:* a 5,120×5,120 projection at r = 16 adds 16×(5,120+5,120) = 163,840 trainable parameters, versus 26.2M frozen ones (≈0.6%).
*Analogy:* instead of repainting a whole mural, you add a thin transparent overlay with a few strokes.
*Competition fit:* adapters ship as `adapters/<name>/adapter_config.json` + `adapter_model.safetensors` and attach via `adapter: <name>` on any `LlmAgent`.\[3\]

**Quantization; "w4a16"; QAT.** *Definition:* map real values x to low-bit integers via q = round(x/s) + z (scale s, zero-point z) and dequantize x̂ = s(q − z). "w4a16" means 4-bit *weights* and 16-bit *activations*. *QAT (quantization-aware training)* simulates quantization during training so that the model learns to tolerate it. *Why you care:* your adapter will run on top of a 4-bit QAT base. Train it against the same quantized base (QLoRA-style) or at minimum *evaluate* it on the quantized base, because an adapter trained on bf16 weights can behave differently on w4 weights.

**QLoRA (Dettmers et al., NeurIPS 2023).** *Definition:* LoRA training where the frozen base is stored in 4-bit NormalFloat (NF4), with double quantization of the scales and paged optimizers to survive memory spikes. *Plain language:* fine-tune a giant model on modest GPUs by keeping the frozen part tiny.

**Rejection-sampling fine-tuning (RFT) / filtered behavior cloning / expert iteration.** *Definition:* sample trajectories τ ~ π, keep those with reward R(τ) = 1 (tests pass), and run supervised fine-tuning on the kept set. Iterating this gives *expert iteration*. *Plain language:* "learn only from your wins." This is SWE-Gym's baseline method, and SWE-smith's recipe was full fine-tuning at learning rate 5e-5, a maximum of 3 epochs, and 32,768 max context.\[21\]\[22\]

**Distillation.** *Definition:* train a student to match a teacher's outputs or trajectories. In the agent setting this means SFT on teacher trajectories. *Rules check:* external data and tools are allowed if publicly available to all at no or minimal cost, and winners must deliver training code.\[3\] Keep a provenance log.

**Verifier / outcome vs. process reward model.** *Definition:* an ORM scores a whole trajectory or final answer. A PRM scores each step (Lightman et al., 2023, "Let's Verify Step by Step"). SWE-Gym trained a verifier with LoRA that scored 29.8@8 vs 27.2@8 for full fine-tuning.\[23\] That result is a useful reminder that LoRA is not automatically "second-best."

> **🎓 Teachable Moment — Why LoRA can beat full fine-tuning on small data.** With hundreds of trajectories, full fine-tuning can overfit and forget general skills. LoRA's low-rank constraint acts as a regularizer. This is a *hypothesis* to test on your data, not a law.

---

### Part 5 — Testable hypotheses with test plans (🧪 lead, all hats contributing)

**Common protocol (applies to every H unless stated):**
- **Units:** the 129 public tasks. Stratify by repo, because fastapi and rich dominate.
- **Design:** *paired*. Every arm runs on every task. Use ≥ 3 seeds (temperature > 0) or ≥ 2 if time-limited.
- **Primary metric:** resolve rate (local `swegemma eval` PASS/FAIL using `test_patch`).
- **Secondary metrics:** `NO_PATCH` rate, turns-to-submit, wall-seconds, failed-edit count, localization hit@k (does the agent read or edit a file touched by the reference `patch`?), and tokens.
- **Statistics:** McNemar's test for paired binary outcomes on per-task majority-over-seeds, plus a *task-clustered* bootstrap 95% CI on the resolve-rate difference. Miller (2024) warns that clustered SEs can be up to ~3× naive ones and recommends paired comparisons.\[24\] Apply Holm–Bonferroni across the H-family.
- **Power (back-of-envelope):** for McNemar with discordant-pair proportion ψ = 0.20 and a target difference δ = 0.10 at α = 0.05 and power 0.8, n ≈ (1.96√ψ + 0.84√(ψ−δ²))² / δ² ≈ **154 tasks**. 129 tasks × multiple seeds is therefore borderline. Treat effects < 8–10 pp as "not detectable" locally.
- **Contamination controls:** the reference `patch` must never enter prompts. For training, split by repo *and* base_commit. Hold out an entire repo (e.g., requests) as a proxy for the private-repo test set. Check upstream post-date leakage, since httpx-3672's code postdates much pretraining but the *old* httpx is heavily memorized.

| ID | Hypothesis (H₁) | Null (H₀) | IV (manipulated) | DV | Grounding |
|---|---|---|---|---|---|
| **H1** | An "anytime" policy (submit after first passing static check, then refine and resubmit) raises resolve rate by cutting `NO_PATCH` | No difference | submit-early rule on/off | resolve, NO_PATCH | Community observation that `submit_patch` is free and repeatable; anytime-algorithm theory |
| **H2** | Graph+embedding-first localization (Steps 3–4 before any `grep`) improves file hit@3 and reduces turns-to-first-correct-file | No difference | localization order | hit@k, turns | Agentless hierarchical localization (81.3% file-level with prompting + embeddings) |
| **H3** | A mandatory `/tmp` reproduction script for Tier B/C raises resolve rate despite costing 1–2 turns | Net zero or negative | repro rule on/off by tier | resolve, wall-s | Agentless reproduction-test validation |
| **H4** | A fused edit→`py_compile`→import guardrail cuts cascading failed edits and raises resolve rate | No difference | guardrail on/off | failed edits/task, resolve | SWE-agent linting ablation (18.0 vs 15.0) |
| **H5** | Pinning a ≤ 300-token spec/state ledger at the top *and* restating it in the latest turn improves resolve vs compaction-only | No difference | ledger placement (none / top / top+bottom) | resolve, "forgot finding" rate | Liu et al. TACL 2024; harness-design tiers T0–T4 |
| **H6** | Thinking mode *on* with a tight thinking budget beats thinking *off* at equal wall-clock | No difference or worse | `include_thoughts` / thinking budget | resolve, s/step | Gemma 4 model card (built-in thinking; "No Thinking Content in History"); community reports that public 0.10–0.12 entries run thinking off.\[9\]\[25\] Contested, so test it |
| **H7** | A read-only analyzer sub-agent (graph/search tools only, strict JSON return schema, `skip_summarization: true`) improves resolve by protecting root context | No difference | sub-agent on/off | resolve, root-context tokens | SOLID (SRP/ISP); community "context-preserving map-reduce" thesis\[18\] |
| **H8** | A LoRA adapter trained by RFT on filtered successful trajectories improves held-out-repo resolve rate over the base model | No difference | adapter on/off | resolve on held-out repo | SWE-Gym (+up to 19% abs.), SWE-smith (40.2%) |
| **H9** | For H8, r = 16 on all linear layers beats r = 8 attention-only, and r = 64 shows no further gain (data-limited) | Monotone in r, or no difference | r, target modules | resolve, train/val loss gap | Hu et al. 2021; SWE-Gym LoRA-vs-full result |
| **H10** | Exact-match edit failures are mostly whitespace/identifier drift, and a "re-read lines then edit in the same turn" rule cuts them by ≥ 50% | Failures not reduced | re-read rule | edit failure rate, failure category | Tokenization mechanics; SWE-agent's 57.2% post-failure recovery figure |
| **H11** | On Tier B/C only, generating 2 candidate patches and picking by repro+targeted tests beats 1 patch at equal wall-clock | No difference | n candidates ∈ {1,2} | resolve, wall-s | Brown et al. 2024 (repeated sampling + verification) |

#### Test plan details for the highest-value hypotheses

**H1 (anytime submit).**
Run arm A (submit at end) against arm B (submit at first green static check, then resubmit), 3 seeds × 129 tasks.
*Pre-registered decision:* adopt B if the McNemar p-value is < 0.05 after Holm correction *or* the NO_PATCH rate drops ≥ 5 pp with no resolve-rate loss.
*Ablation:* B without the resubmit step.

**H2 (localization order).**
Ground truth: the files and functions touched by each task's reference `patch`. Parse it with `unidiff`.
Log every `read_file`/`edit_file` path. Metrics: hit@1/@3 (top-ranked candidates contain a gold file) and turns-to-first-gold-read.
Paired Wilcoxon signed-rank on turns, plus McNemar on hit@3.

**H5 (ledger placement).**
Three arms. Measure "forgot finding" by auto-detecting re-reads of an already-read file range and contradictions between ledger and action.
Stratify by trajectory length, since the benefit should grow with longer episodes. That gives a dose-response check.

**H8/H9 (LoRA via RFT).**
*Data:*
- (i) your own successful trajectories on public tasks, *excluding* the held-out repo;
- (ii) optionally SWE-Gym or SWE-smith trajectories (public, so permissible under the Reasonableness Standard, but log licenses).

*Filter:* tests pass, no test-file edits, no scratch files in the diff, ≤ 16 turns. This trains the *budget-compliant* behavior you need.
*Training grid:*
- r ∈ {8, 16, 64}, α = 2r, dropout 0.05;
- targets ∈ {attention-only, all-linear};
- learning rate ∈ {1e-4, 2e-4} with 3% warmup and cosine decay;
- 2–3 epochs, effective batch 16–32 via gradient accumulation, weight decay 0.0–0.01, max sequence length ≤ 32,768.

*Train on the quantized base or evaluate strictly on the quantized base.*
*Evaluation:* the held-out repo (e.g., requests, 13 tasks), which is underpowered on its own, plus a leave-one-repo-out rotation.
*Contamination:* deduplicate by base_commit, and never train on tasks you evaluate.
*Kill criterion:* if the held-out resolve rate does not beat base by ≥ 5 pp across rotations, don't spend a daily submission on it.

> **🎓 Teachable Moment — Leaderboard probing is an experiment with n ≈ 60.** At p ≈ 0.2, the standard error is √(0.2·0.8/60) ≈ 0.052, so the 95% CI is about ±10 pp. Use local paired experiments to *choose*, and use the leaderboard to *confirm*. And remember that the final ranking uses the *private* half.

---

### Part 6 — Data-collection wishlist (🧪 + 🔎)

**Per run (JSON):**
```json
{
  "run_id": "2026-10-06T14:00Z_h1_armB_seed2",
  "git_sha_submission": "abc1234",
  "hypothesis": "H1",
  "arm": "B",
  "seed": 2,
  "model": "gemma-4-31b-it-qat-w4a16-ct",
  "adapter": {"name": "main_lora", "sha256": "...", "r": 16, "alpha": 32, "targets": ["q_proj","k_proj","v_proj","o_proj","gate_proj","up_proj","down_proj"]},
  "sampling": {"temperature": 0.2, "max_output_tokens": 4096, "thinking": false},
  "eval_config": {"per_task_minutes": 4.5, "max_calls": 40},
  "compaction": {"interval": null, "token_threshold": null, "event_retention": null, "source": "HARNESS_README §7.2 (verify)"},
  "harness_version": "swegemma x.y.z",
  "hardware": "L4x4",
  "startup_seconds": 540
}
```

**Per task (JSON):**
```json
{
  "run_id": "...",
  "instance_id": "httpx_3672",
  "repo": "encode/httpx",
  "tier": "B",
  "resolved": true,
  "no_patch": false,
  "turns": 14,
  "wall_seconds": 301,
  "tokens_in": 51234,
  "tokens_out": 6120,
  "failed_edits": 1,
  "first_submit_turn": 11,
  "num_submits": 2,
  "gold_files": ["httpx/_server.py"],
  "first_gold_read_turn": 4,
  "loc_hit_at_3": true,
  "patch_files": ["httpx/_server.py"],
  "patch_lines_added": 18,
  "patch_lines_removed": 6,
  "stray_files_in_patch": 0,
  "tests_edited": false,
  "compaction_events": 0
}
```
*(Field values are illustrative placeholders, not measurements. In particular, `httpx/_server.py` is a hypothetical path, so fill it from the actual reference patch.)*

**Per turn (JSON Lines, from ATIF-style traces at `results/<run>/traces/trace_<id>.json`):**
```json
{"instance_id":"httpx_3672","turn":5,"tool":"read_file","args":{"filepath":"...","start_line":120,"end_line":190},"latency_s":19.4,"tokens_in":3120,"tokens_out":210,"obs_chars":4800,"truncated":false,"error":null,"belief_top_file":"...","belief_conf":0.7,"ledger_tokens":260}
```

**Also collect:**
1. Per-task human labels for *failure category*, using SWE-agent's taxonomy: incorrect implementation, overly specific, cascading edits, localization miss, timeout, patch pollution.
2. Embedding search ranks of gold symbols (rank of first gold node in `search_similar_code` results).
3. Graph distance from the issue's top-retrieved node to the gold node (hop count via `get_code_neighbors`).
4. Training-data provenance: source dataset, license, base_commit, dedupe hash.
5. Daily leaderboard submissions: date, config hash, public score, and the matching local score (to calibrate local → public).

---

### Part 7 — Assembling the v4 HTML (🏛️ full-stack hat)

**Design requirements:**
- one self-contained file;
- inline CSS/JS with no external fonts or CDNs;
- `prefers-color-scheme` dark/light plus a manual toggle;
- a sticky, auto-generated table of contents;
- `<details>` collapsibles for glossary entries;
- color-coded call-outs for 🎓 Teachable Moments and SME hats.

**Minimal skeleton:**
```html
<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BCF httpx-3672 — v4 Deep Dive</title>
<style>
:root{--bg:#fff;--fg:#1b1f24;--card:#f5f7fa;--acc:#2b6cb0;--tm:#fff7e0}
@media (prefers-color-scheme:dark){:root{--bg:#0f1216;--fg:#e6e9ee;--card:#171b21;--acc:#7fb3ff;--tm:#2a2414}}
[data-theme=dark]{--bg:#0f1216;--fg:#e6e9ee;--card:#171b21;--acc:#7fb3ff;--tm:#2a2414}
body{margin:0;font:16px/1.6 system-ui,sans-serif;background:var(--bg);color:var(--fg);display:grid;grid-template-columns:minmax(220px,280px) 1fr}
nav{position:sticky;top:0;height:100vh;overflow:auto;padding:1rem;background:var(--card)}
main{padding:2rem;max-width:980px}
.tm{background:var(--tm);border-left:4px solid #d69e2e;padding:.75rem 1rem;border-radius:6px}
.hat{font-size:.8rem;padding:.1rem .5rem;border-radius:99px;background:var(--card)}
table{border-collapse:collapse;width:100%}td,th{border:1px solid #8884;padding:.4rem}
@media (max-width:800px){body{grid-template-columns:1fr}nav{position:static;height:auto}}
</style></head><body>
<nav id="toc"><button onclick="t()">☀/☾</button></nav><main id="doc"><!-- paste sections --></main>
<script>
function t(){const r=document.documentElement;r.dataset.theme=r.dataset.theme==='dark'?'light':'dark'}
const toc=document.getElementById('toc');document.querySelectorAll('main h2,main h3').forEach((h,i)=>{h.id=h.id||'s'+i;const a=document.createElement('a');a.href='#'+h.id;a.textContent=h.textContent;a.style.display='block';a.style.marginLeft=h.tagName==='H3'?'1rem':'0';toc.appendChild(a)});
</script></body></html>
```
Paste each Part of this report into `<main>` as `<section>`s. Put each glossary term in a `<details><summary>Term</summary>definition → plain language → analogy</details>`.

---

### Version-diff note (v3 → v4)

**Preserved from v3:** every v3 slide and data point. v4 extends the deck; it never replaces it. Map v3 slides onto the Part 2 step table.

**Added in v4:**
1. A per-step "how the next step is chosen" plus "what is gained" analysis, with failure modes and alternatives.
2. An information-gain framing (entropy, bits per second) for ranking actions.
3. Turn-budget arithmetic derived from competition limits.
4. A naive-vs-BCF-vs-next-tier comparison grounded in SWE-agent, Agentless, SWE-Gym, SWE-smith and Large Language Monkeys.
5. Eleven falsifiable hypotheses with nulls, variables, statistics, power and contamination controls.
6. A JSON telemetry schema at run, task and turn level.
7. An ML/LoRA glossary with formulas.
8. SME-hat attribution and Teachable Moments.
9. An HTML assembly blueprint.
10. A flagged list of disputed harness settings.

---

## Recommendations

1. **This week:** run H1 (anytime submit) and H4 (edit guardrail) first. They are cheap, low-risk, and attack the two most common loss modes, timeouts and cascading edits.
2. **Instrument before optimizing:** implement the per-turn JSONL logging. Without it, H2/H5/H10 are untestable.
3. **Resolve the compaction ambiguity** by reading HARNESS_README §7.2 in your copy and checking the forum. H5's design depends on it.
4. **Start the LoRA track in parallel (H8):** begin harvesting successful, budget-compliant trajectories now. RFT data is the long pole, and the deadline is Dec 2.
5. **Spend daily submissions only on configurations that won locally** with a clustered CI that excludes zero, or with a pre-registered NO_PATCH reduction.
6. **For the paper track (Nov 12):** the information-gain-per-second framing plus a rigorous paired ablation table is a credible, novel write-up.

## Caveats

- **v3 was not read directly** (no file access in this research environment). Map steps onto v3 yourself and, wherever they differ, keep v3's facts.
- **Community numbers are unofficial:** ~20 s/step, ~9 min startup, 150-line `read_file` cap, thinking-off prevalence, and per-task budget conventions all come from participants' public repos, not organizers.
- **Compaction settings conflict** across sources (interval 15 vs 5; threshold 32,768 vs 14,336; "no compaction inside a task").
- **httpx-3672's exact diff, files and tests could not be retrieved**, because the GitHub PR page was inaccessible. Read the `patch` and `test_patch` fields of the `httpx_3672` record in `tasks.jsonl` to ground Steps 3–9 concretely.
- **External-paper results don't transfer automatically.** They were obtained on SWE-bench with other models (Qwen, GPT-4, Claude), with no 6-minute-per-task limit and no 4-bit base.
- **Statistical power is limited:** with 129 tasks, effects under ~8–10 pp are hard to detect even with paired designs.

## Sources

1. [M2.5: consolidate docs, time budget tool, 4 min per-task budget by Ranjit1312 · Pull Request #1 · Ranjit1312/Gemma-4-swe](https://github.com/Ranjit1312/Gemma-4-swe/pull/1)
2. [Google - The Gemma 4 Developer Agent Competition](https://www.kaggle.com/competitions/gemma-4-developer-agent)
3. [GitHub - sweeden-ttu/developer-agent: Notes and tooling for the Kaggle Gemma 4 Developer Agent competition](https://github.com/sweeden-ttu/developer-agent)
4. [docs: competition data inventory by emiliodavola · Pull Request #12 · emiliodavola/kaggle-gemma-agent](https://github.com/emiliodavola/kaggle-gemma-agent/pull/12)
5. [Google - The Gemma 4 Developer Agent Competition](https://www.kaggle.com/competitions/gemma-4-developer-agent/data)
6. [Workflow runs · encode/httpx](https://github.com/encode/httpx/actions)
7. [httpx](https://www.encode.io/httpnext/)
8. [Google - The Gemma 4 Developer Agent Competition](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743752)
9. [GitHub - Maukthik/gemma4 · GitHub](https://github.com/Maukthik/gemma4)
10. [Training Long-Context, Multi-Turn Software Engineering ...](https://www.arxiv.org/pdf/2508.03501)
11. [Lost in the Middle: How Language Models Use Long Contexts](https://transacl.org/index.php/tacl/article/view/5757)
12. [@article{liu-etal:2024:tacl,](https://cs.stanford.edu/~nfliu/papers/lost-in-the-middle.tacl2023.bib)
13. [The “Lost in the Middle” Problem in LLMs](https://medium.com/@rajveer.rathod1301/the-lost-in-the-middle-problem-in-llms-b0d88e13f025)
14. [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://papers.nips.cc/paper_files/paper/2024/file/5a7c947568c1b1328ccc5230172e1e7c-Paper-Conference.pdf)
15. [GitHub - OpenAutoCoder/Agentless: Agentless🐱: an agentless approach to automatically solve software development problems](https://github.com/OpenAutoCoder/Agentless)
16. [Demystifying LLM-Based Software Engineering Agents](https://dl.acm.org/doi/full/10.1145/3715754)
17. [Demystifying LLM-Based Software Engineering Agents](https://lingming.cs.illinois.edu/publications/fse2025.pdf)
18. [GitHub - Acivar-Digital/gemma4](https://github.com/Acivar-Digital/gemma4)
19. [(PDF) SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://www.researchgate.net/publication/380907343_SWE-agent_Agent-Computer_Interfaces_Enable_Automated_Software_Engineering)
20. [\[Research Paper Summary\] Large Language Monkeys: Scaling Inference Compute with Repeated Sampling](https://medium.com/athina-ai/large-language-monkeys-scaling-inference-compute-with-repeated-sampling-4de85a3e1384)
21. [Training Software Engineering Agents and Verifiers with SWE-Gym](https://www.alphaxiv.org/overview/2412.21139)
22. [SWE-smith: Scaling Data for Software Engineering Agents](https://arxiv.org/pdf/2504.21798)
23. [Training Software Engineering Agents and Verifiers with SWE-Gym](https://openreview.net/pdf?id=Cq1BNvHx74)
24. [Error Bars for Evals: Why Most Benchmark Differences Are Noise — Praveen T N](https://praveentn.live/learn/blog/error-bars-for-llm-evals)
25. [Gemma 4 model card](https://ai.google.dev/gemma/docs/core/model_card_4)
