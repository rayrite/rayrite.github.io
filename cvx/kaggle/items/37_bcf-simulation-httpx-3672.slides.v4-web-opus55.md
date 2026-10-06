# BCF v4 Research Grounding: How Coding Agents Choose Their Next Step, What Each Step Buys You, and How a Gemma 4 Agent Can Climb to the Next Accuracy Tier

The research points one way: for a small open-weights model like Gemma 4, the biggest accuracy gains come less from a smarter free-form loop and more from a structured pipeline. That means coarse-to-fine localization, a reproduction test before any patch, a constrained edit format, several patch candidates filtered by execution, and then a learned verifier. The verified path past that ceiling is fine-tuning on successful trajectories (LoRA/QLoRA), optionally followed by reinforcement learning (RL) from verifiable rewards. Each of these steps has published effect sizes you can turn into a testable hypothesis for BCF.

## TL;DR

- **Next-step selection is uncertainty reduction.** Every strong system narrows "where is the bug and what is the fix" in stages. Agentless's file-level step keeps the ground-truth file in its candidate set 81.67% of the time while cutting context to ~3.4K lines of code. Its reproduction-test filter lifts SWE-bench Lite resolution from 27.00% to 32.00%. SWE-agent's interface design alone took GPT-4 Turbo from 11.0% (shell-only) to 18.0% on Lite.
- **The next accuracy tier for small open models is training plus verification, not prompting.** SWE-smith fine-tuned Qwen2.5-Coder-32B on 5,016 trajectories, taking it from roughly 6.8% to 40.2% pass@1 on SWE-bench Verified. The SWE-smith paper reports the gain as "+33.4%". R2E-Gym's hybrid execution-plus-learned verifier reached 51% best-of-26; the two verifiers alone plateaued at 43.7% (execution-based) and 42.8% (execution-free). Gemma 4's native function calling and 128K/256K context make it a viable base. One third-party report puts Gemma 4 E4B at 14.0% and Gemma 4 12B at 44.2% on SWE-bench Verified.
- **Your experiments will be underpowered unless you design for it.** On a 50-task subset, a 95% confidence interval on a ~20% resolve rate is roughly ±11 points. A real 10-point improvement can easily fail a paired McNemar test. Use paired designs, repeated seeds, clustered/bootstrap errors, and contamination-resistant task sets. In February 2026 OpenAI stopped reporting SWE-bench Verified after an audit of 138 problems that o3 consistently failed found that 59.4% contained flawed test cases.

## A note before we start (teachable moment #0: verify your ground truth)

GitHub uses one numbering sequence for issues and pull requests. In encode/httpx, the GitHub Actions run history lists **#3672 as a pull request titled "Server connection handling" opened by maintainer lovelydinosaur**, not an issue.\[1\] Before v4 presents "issue #3672" as a SWE-bench-style task, check whether the simulation targets that PR, an issue it closes, or a different number. In SWE-bench terms, a task instance is a triple: (issue text, repository snapshot at the base commit, gold patch plus FAIL_TO_PASS / PASS_TO_PASS tests). If the "issue" is really a maintainer's PR description, the problem statement may leak the solution. SWE-bench+ shows that this kind of leak inflates scores (details below).

---

## Key Findings

1. **Interface design is a first-order variable.** SWE-agent's ablations on SWE-bench Lite (GPT-4 Turbo) are the cleanest evidence:
   - Removing the edit command drops 18.0% to 10.3%.
   - Removing linting from the edit command gives 15.0%.
   - Showing the full file instead of a 100-line window gives 12.7%; a 30-line window gives 14.3%.
   - Iterative search instead of summarized search gives 12.0%.
   - Keeping the full history instead of the last 5 observations gives 15.0%.\[2\]
2. **Fixed pipelines rival free agents at a fraction of the cost.** Agentless v2 (GPT-4o) resolved 96/300 = 32.00% of SWE-bench Lite at $0.70/issue.\[3\] v1 resolved 27.33% at $0.34. Both beat contemporary open-source agents.\[4\] AutoCodeRover (ISSTA 2024) resolved 19.00% (57/300) with AST-aware search, using on average 37K tokens (≈$0.43) per task. Adding SBFL raised that to 22%.
3. **Patch selection is where much of the remaining headroom sits.** Agentless's upper bound, if any of its sampled patches could be picked, was 42.0% (126 issues), against the 32.0% it actually achieved. Selection ladder: majority voting alone 25.67% → +regression tests 27.00% → +reproduction tests 32.00%.\[3\] SWE-agent's pass@k rose from 17.94% (k=1) to 32.67% (k=6).\[2\] Generation is not the bottleneck; recognizing the right patch is.
4. **Learned verifiers and hybrid verification compound with sampling.** R2E-Gym: execution-based verification alone ≈43.7%, execution-free alone ≈42.8%, hybrid 51% (best@26).\[5\] SWE-World's SWR-32B verifier: 55.0% at K=1 → 68.2% at K=8.\[6\]
5. **Fine-tuning small open models works, and scales with data.** SWE-Gym: up to +19 points absolute from 491 trajectories.\[7\] R2E-Gym: 32B at 34.4% pass@1.\[8\] SWE-smith: 40.2% (14.3% at 100 trajectories → 40.2% at 5,016).\[9\] Skywork-SWE: no saturation at 8,209 trajectories.\[10\] SWE-RL: RL with a patch-similarity reward on Llama-3.3-70B gave 41.0% on Verified.\[11\]
6. **Edit format and line-number handling cause failures in their own right.** In SWE-agent runs, 51.7% of trajectories contain at least one failed edit. After one failed edit, the chance a later edit succeeds drops from 90.5% to 57.2%.\[2\] Aider found that format choice alone moved GPT-4 Turbo from 20% to 61% on its laziness benchmark, and it tells models not to emit line numbers.\[12\]\[13\]
7. **Benchmarks overstate success.** SWE-bench+ found that filtering solution leakage and weak tests cut SWE-agent + GPT-4 from 18% to 9.33% on Lite and from 22.4% to 10.0% on Verified.\[14\] Running all developer tests shows 7.8% of "plausible" patches are wrong (−4.5 points on average).\[15\]

---

## Details

### Part 1 — How each next step is determined, and what each step buys you

#### 1.1 Foundational vocabulary

- **Agent (LLM agent).** *Formal:* a policy π(aₜ | hₜ) that maps an interaction history hₜ = (o₀, a₀, o₁, …, oₜ) to the next action aₜ, where observations oₜ come from an environment (shell, file system, test runner). *Plain:* the model reads everything so far and decides what to do next.
- **ReAct (Yao et al.).** *Formal:* a prompting scheme where the action space is extended with free-text "thoughts", producing interleaved Thought → Action → Observation triples. *Plain:* the model writes down its reasoning, takes one tool action, reads the result, and repeats. ReAct is the template almost every coding agent descends from, including BCF's turn structure. Its weakness is that the next step depends entirely on the model's judgment each turn, so small models drift.
- **Agent-Computer Interface (ACI) (Yang et al., SWE-agent).** *Formal:* the set of commands, their argument schemas, the format of their outputs, and the guardrails (e.g., linting) through which an LM agent acts on a computer. *Plain:* the "IDE built for an LLM". SWE-agent's thesis is that LMs are a new kind of user with their own ergonomic needs.\[2\]
- **CodeAct (Wang et al., ICML 2024; the action format used by OpenHands).** *Formal:* the action space is executable Python code run in an interpreter, rather than JSON or text tool calls.\[16\] *Plain:* instead of calling one tool per turn, the model writes a small program that can loop, branch, and chain tools. Across 17 LLMs, CodeAct gave up to 20% higher success rates. With gpt-4-1106-preview it gained 20.7 points absolute and needed 2.1 fewer turns on average.\[16\]\[17\]
- **Pipeline ("agentless") vs. agent loop.** *Formal:* a pipeline is a fixed directed graph of LLM calls and programmatic steps whose control flow does not depend on model decisions. An agent loop lets the model choose the next action. *Plain:* Agentless decides the "next step" in advance (localize → repair → validate); SWE-agent lets the model decide.

> **Teachable moment #1 — "Who decides the next step?" is a design dial, not a binary.** Fully fixed pipeline (Agentless) → model-chosen actions inside fixed phases (AutoCodeRover's two-stage workflow with an agentic context-retrieval stage) → fully free loop (SWE-agent, OpenHands). The weaker the model, the more structure should sit in the scaffold rather than in the model's head. A spec-first framework like BCF is naturally at the "structured" end. That's a strength for Gemma-class models, as long as each phase's exit criterion is measurable.

#### 1.2 The information-theoretic view of the pipeline

The literature doesn't usually write equations for this, but the following framing matches what Agentless and AutoCodeRover actually measure (candidate-set recall versus lines of context). It gives v4 a single lens for "what is each step for?"

- **Entropy.** *Formal:* for a discrete random variable L (the true edit location) with distribution p, H(L) = −Σₗ p(l) log₂ p(l) bits. For a uniform distribution over N candidates, H = log₂ N. *Plain:* how many yes/no questions you'd need to pin down the answer.
- **Expected information gain (EIG).** *Formal:* for an action a with observation O, EIG(a) = H(L) − E_O[H(L | O, a)], which equals the mutual information I(L; O). *Plain:* how much an action is expected to shrink your uncertainty. A principled agent picks the action with the highest EIG per unit cost (tokens, seconds, dollars).
- **Worked illustration (hypothetical numbers, for intuition only).** Suppose a repository has ~100 candidate source files with ~20 functions each: ~2,000 functions, so H ≈ log₂ 2000 ≈ 11 bits. If file-level localization concentrates belief on 3 files, the remaining uncertainty is ≈ log₂ 60 ≈ 5.9 bits, a gain of ≈5 bits for one cheap call. A failing reproduction test with a stack trace can pin a function almost outright (≈0–2 bits left). That is why it is the single highest-EIG action available when it works.

> **Teachable moment #2 — Recall must be protected at every narrowing step.** Information gain is only real if the true location survives the cut. Agentless's per-stage numbers show the tradeoff directly:
> - File level keeps the ground truth 81.67% of the time with ~3,424 LoC of context.
> - Related elements (class/function, "skeleton" format) keep it 58.33% with ~698 LoC.
> - Edit locations keep it ~48–56% with 165–342 LoC.\[3\]
>
> Every stage trades recall for focus. An error at stage k is unrecoverable downstream unless you build a fallback (re-localize when tests keep failing).

#### 1.3 Phase-by-phase: how the next step is chosen and what is gained

**Phase A — Issue understanding (reading the problem statement)**
- *How the step is chosen:* always first. In Agentless and AutoCodeRover it is implicit in the localization prompt. In SWE-agent and OpenHands the model's first Thought usually restates the issue and plans a search.
- *What is gained:* (1) a candidate symbol list (class/function names, error messages, file paths quoted in the issue); (2) an expected-behavior statement (the oracle for the reproduction test); (3) a risk flag for under-specification.
- *Evidence:* Agentless v2 classified SWE-bench Lite problems: 10.0% lack enough information to solve; 4.3% contain the exact ground-truth patch; 9.7% describe the exact solution steps in natural language; 5.0% contain a misleading solution. About half give the file location; fewer than 10% give exact line locations.\[3\]
- *BCF implication:* the spec-first step should emit a structured spec with fields like `symptoms`, `expected_behavior`, `mentioned_symbols`, `mentioned_paths`, `repro_snippet_present`, and `ambiguity_score`. Each field becomes a logged datapoint (see wishlist).

**Phase B — Repository navigation and localization**
- *Hierarchical / coarse-to-fine localization.* *Formal:* a sequence of filters F₁ ⊃ F₂ ⊃ F₃ over granularity levels (file → class/function → line/hunk), where each level conditions on the previous survivors. *Plain:* find the right folder, then the file, then the function, then the lines. Agentless prompts with the repository tree, then with file "skeletons" (signatures only), then with full code of the shortlisted functions.
- *Retrieval.* **BM25** — *formal:* score(D, Q) = Σ_{q∈Q} IDF(q) · f(q,D)(k₁+1) / (f(q,D) + k₁(1 − b + b·|D|/avgdl)), with typical k₁ ∈ [1.2, 2.0] and b ≈ 0.75; *plain:* keyword matching that rewards rare terms and normalizes for document length. **Dense embeddings** — *formal:* encode query and chunk into vectors and rank by cosine similarity cos(u,v) = u·v / (‖u‖‖v‖); *plain:* semantic "meaning" matching. Agentless's file-level ablation: prompting alone 78.67%, embedding alone 67.67% (70.33% with irrelevant-folder filtering), combined 81.67%. The methods are complementary.\[3\]
- *Program-structure-aware search (AutoCodeRover).* APIs like `search_class`, `search_method_in_class`, and `search_code` operate over the AST (abstract syntax tree: the parsed tree of a program's syntactic constructs).\[18\] Results come back as signatures or bodies rather than raw grep lines. That keeps each observation compact and semantically typed.
- *SWE-agent's interface findings for navigation:* summarized search (list matching files, then let the agent open one) beats iterative "next match" search (18.0% vs 12.0%). A 100-line viewer beats both 30 lines and the whole file.\[2\]
- *What is gained:* a shortlist of candidate edit locations with an implicit probability ranking, plus the actual code text needed to write a patch.
- *Newer evidence that localization is the lever:* SHERLOC (2026) added a structured diagnostic localizer in front of SWE-agent/OpenHands. With Qwen3-Next-80B-A3B it cut localization tokens from 161.4K to 32.9K and raised resolve rate from 38.8% to 49.4% (SWE-agent) and 38.6% to 50.4% (OpenHands). With a stronger repair model (MiniMax-M2.5), resolve rate fell 4–5 points even as cost dropped.\[19\] Localization aids help most when the base model is the weak link.

**Phase C — Reproduction-test creation**
- *Reproduction test.* *Formal:* a test t such that t fails on the base commit and passes on a correct fix: the FAIL_TO_PASS property. *Plain:* a script that shows the bug, so you can tell when it's gone.
- *How the step is chosen:* in Agentless it is a fixed phase after localization. In SWE-agent's demonstration-guided loop the agent is nudged to "reproduce first".
- *What is gained:* (1) an executable oracle for patch selection; (2) a stack trace or failure point that serves as a localization signal; (3) the coverage spectrum needed for SBFL (next section).
- *Evidence:* Agentless's reproduction tests add +5 points (27.00% → 32.00%) on Lite at $0.25 extra per issue. Generated tests are noisy: of 300, 213 reproduced the issue on the original repo, but only 94 printed "Issue resolved" once the real fix was applied.\[3\] IssueExec (2026) showed that test-driven localization lifts F1@3 at function level from 21.14% (without tests) to 34.08%, and file level from 52.55% to 65.27%.\[20\]

> **Teachable moment #3 — A reproduction test is a measuring instrument, and instruments need calibration.** Less than half of Agentless's generated tests were valid both ways (fail-before, pass-after-gold). In BCF, log whether the reproduction test fails on the base commit (necessary) and, during offline evaluation, whether it passes with the gold patch (sufficient). Count only tests with both properties as "calibrated".

**Phase D — Spectrum-based fault localization (SBFL), the optional power-up when tests exist**
- *Definition.* Run the test suite with coverage. For each program element e (statement or method), count e_f / e_p = number of failing / passing tests that execute e, and n_f / n_p = number of failing / passing tests that do not execute e. A suspiciousness formula ranks elements by these counts.
- *Formulas:*
  - **Tarantula** (Jones & Harrold): S(e) = [e_f / (e_f + n_f)] / ( [e_f / (e_f + n_f)] + [e_p / (e_p + n_p)] )
  - **Ochiai** (Abreu et al.): S(e) = e_f / √((e_f + n_f)(e_f + e_p))\[21\]
  - **DStar** (Wong et al.): S(e) = e_f^* / (e_p + n_f), with exponent * usually 2 or 3\[21\]\[22\]
- *Plain:* code that runs in failing tests but rarely in passing ones is suspicious.\[21\] Ochiai and DStar consistently perform best in empirical comparisons (e.g., Pearson, Ernst et al.; Zou et al. found SBFL the most effective single family, with Ochiai and DStar on top).\[23\]
- *Evidence in LLM agents:* AutoCodeRover's method-level SBFL raised SWE-bench Lite from 19% to 22%. ACR-sbfl uniquely resolved 7 instances.\[24\]\[25\] CodeR linearly combines SBFL with BM25 file scores.\[26\]

> **Teachable moment #4 — SBFL needs at least one failing test.** That's why reproduction comes before localization refinement in the strongest pipelines. With only one failing test (your reproduction test), SBFL degenerates toward "what did the failing test touch". That is still a strong prior, and essentially free compared with an LLM call.

**Phase E — Patch generation**
- *Sampling vocabulary.* **Temperature** τ: *formal:* the next-token distribution is softmax(z/τ) over logits z; *plain:* τ→0 is greedy and repeatable, higher τ is more diverse. **Self-consistency** (Wang et al.): *formal:* sample k outputs and return the mode of their final answers; *plain:* majority vote across attempts.
- *What Agentless does:* 4 edit-location sets × 10 patches each (1 greedy + 9 at τ=0.8) = 40 candidates. Performance plateaus around 40 samples.\[3\]
- *What is gained:* a candidate set whose "oracle" success rate (any candidate correct) far exceeds the single-shot rate: 42.0% versus 32.0% achieved.

**Phase F — Patch validation and selection**
- *Normalization + majority voting.* Agentless parses each patch to an AST, strips docstrings and comments, unparses it to a canonical form, and votes.\[3\] Semantically identical patches therefore count together.
- *Regression tests (PASS_TO_PASS).* Run existing tests and drop candidates that break them.
- *Reproduction tests.* Keep candidates that flip the reproduction test from fail to pass.
- *Learned verifiers / outcome reward models (ORM).* *Formal:* a model V(x, y) → [0,1] trained to predict P(y resolves x) from trajectories labeled by hidden tests; selection is argmax_y V(x, y) (best-of-n). *Plain:* a judge model that scores patches without running anything.
- *Evidence:* the selection ladder above (25.67 → 27.00 → 32.00%). R2E-Gym found that test-based verifiers suffer from low *distinguishability*: many candidates pass the same tests, so the tests can't separate them. Execution-free verifiers are biased toward stylistic features.\[8\] Combining the two yields 51%.

> **Teachable moment #5 — Pass@k measures what is possible; best@k measures what your selector achieves.** The gap between them is your selection error. SWE-agent: pass@1 17.94% → pass@6 32.67%. Agentless: 32.0% chosen versus 42.0% oracle. If BCF logs every candidate and whether it was correct, you can attribute failures to "never generated the right patch" versus "generated it but picked wrong". That is the most important diagnostic split in this whole report.

#### 1.4 The control-loop comparison at a glance

| System | Who picks next step | Localization | Reproduction | Candidates & selection | Reported result |
|---|---|---|---|---|---|
| Naive RAG (SWE-bench baseline) | Fixed: retrieve → generate once | BM25 retrieval | None | 1 | SWE-agent paper: 2.67% Lite (GPT-4 Turbo)\[2\] |
| Shell-only ReAct agent | Model | grep/cat | Ad hoc | 1 | 11.0% Lite\[2\] |
| SWE-agent | Model, with ACI guardrails | Summarized search, 100-line viewer | Encouraged by demo | 1 (pass@k reported) | 18.0% Lite, $1.67; 12.47% full\[2\] |
| AutoCodeRover | Two fixed stages, agentic retrieval | AST APIs + optional SBFL | Uses available tests | Retries | 19% Lite @1, 26% @3, ~$0.43; 22% with SBFL\[27\] |
| Agentless v2 | Fixed pipeline | Hierarchical, prompt+embedding | Generated reproduction tests | 40 samples, normalized vote + tests | 32.00% Lite, $0.70; 38.80% Verified\[3\] |
| R2E-Gym 32B + hybrid verifier | Model (trained) | Learned | Testing agent | 26 rollouts, hybrid verifier | 51% Verified\[28\] |

---

### Part 2 — Naive baseline vs. turn optimization

A naive single-shot system (issue plus BM25-retrieved files, one diff) scores 2.67% on Lite with GPT-4 Turbo. A naive unconstrained loop fails through context flooding (full-file viewing: 12.7% vs 18.0%), history bloat (full history: 15.0% vs 18.0%), and edit-failure cascades (57.2% recovery after a failed edit).

| Technique | Mechanism | Measured gain (source) |
|---|---|---|
| Purpose-built ACI | Bounded views, summarized search, lint-gated edits | 11.0% → 18.0% Lite (SWE-agent) |
| Lint-on-edit guardrail | Reject syntactically broken edits before they land | +3.0 points (SWE-agent ablation) |
| Observation windowing | Keep only the last 5 observations in full | 15.0% → 18.0% (SWE-agent) |
| Hierarchical localization, prompt+embedding | Narrow file → element → line | File recall 81.67% (Agentless) |
| Skeleton views | Show signatures rather than full files | 53.67% → 58.33% element recall at fewer LoC, $0.15 → $0.02 (Agentless) |
| SBFL | Coverage-based suspiciousness | 19% → 22% Lite (AutoCodeRover) |
| Reproduction tests in selection | Execution oracle | 27.00% → 32.00% Lite (Agentless) |
| Multiple samples + voting | Diversity + mode-seeking | v1: 23.33% → 26.00% (Agentless v1) |
| Learned/hybrid verifier | Rank candidates | ~43% → 51% (R2E-Gym) |
| Code-as-action | Compose tools within one turn | Up to +20.7 points, −2.1 turns (CodeAct)\[17\] |

**Cost per resolved issue.** *Formal:* CPR = total spend / number resolved = (cost per attempt) / (resolve rate). *Plain:* the price of one fixed bug. Example: Agentless v2 at $0.70/issue and 32% → ≈$2.19 per resolved issue. SWE-agent at $1.67 and 18% → ≈$9.28. For a local Gemma model, replace dollars with GPU-seconds or energy. SWEnergy (2025) measured mini-SWE-agent with Gemma-3 4B at 23.41 kJ per run and 3.20 minutes.\[29\] That configuration resolved 0% of SWE-bench Verified Mini (50 tasks), so its cost per resolved issue is infinite. A cheap run that never succeeds is the most expensive kind.

> **Teachable moment #6 — Turn budgets are a hyperparameter with a sweet spot.** SWE-agent's "ran out of budget" and "gave up prematurely" are separate failure categories.\[2\] Too few turns truncates good trajectories; too many lets a lost agent burn tokens. SWE-smith's fine-tuned 32B solved tasks in 24.9 steps on average versus 29.1 for Claude 3.7 Sonnet.\[9\]

---

### Part 3 — The next level of accuracy for small open models (Gemma 4)

#### 3.1 Gemma 4 facts that matter for BCF (official model card)

- Sizes: **E2B** (2.3B effective / 5.1B with embeddings), **E4B** (4.5B effective / 8B), **12B Unified** (11.95B), **26B A4B MoE** (25.2B total, 3.8B active; 8 of 128 experts plus 1 shared), **31B Dense** (30.7B).\[30\]
- Context: 128K (E2B/E4B) and 256K (12B/26B/31B). Hybrid attention: local sliding windows (512 or 1,024 tokens) interleaved with global layers; the final layer is always global; Proportional RoPE.\[30\]
- Vocabulary: 262K tokens for all sizes. Native function calling, native `system` role, configurable thinking mode. License: Apache 2.0.\[30\]\[31\]
- Official coding numbers: LiveCodeBench v6 80.0% (31B), 77.1% (26B A4B), 72.0% (12B), 52.0% (E4B), 44.0% (E2B); Codeforces Elo 2150 for 31B.\[30\]
- **SWE-bench Verified (third-party, not on the model card):** the Nanbeige4.2-3B report lists Gemma 4 E4B at 14.0% and Gemma 4 12B at 44.2%.\[32\] Treat these as indicative; scaffold and settings are not disclosed in the excerpt.
- *Glossary — Mixture-of-Experts (MoE):* *formal:* a layer y = Σᵢ gᵢ(x) Eᵢ(x) where a router g selects the top-k experts per token. *Plain:* many specialist sub-networks, only a few used per token. Hence "A4B": ~4B parameters do the work on each step.\[30\]

> **Teachable moment #7 — Context window ≠ usable context.** Gemma 4's own long-context score (MRCR v2, 8-needle, 128K) is 66.4% for 31B and only 25.4% for E4B.\[33\] SWE-agent showed that more context (full file, full history) hurt even GPT-4 Turbo. For BCF, the 256K window is a ceiling, not a target.\[34\]

#### 3.2 Fine-tuning vocabulary, with formal definitions

- **Parameters / weights.** *Formal:* the entries of the matrices W ∈ ℝ^{d×k} in each layer, learned by minimizing a loss. *Plain:* the model's knobs. "31B" means 31 billion knobs.
- **Supervised fine-tuning (SFT).** *Formal:* minimize the negative log-likelihood L(θ) = −Σ_t log p_θ(y_t | x, y_<t) over demonstration tokens, usually masking the loss on prompt/observation tokens so only assistant actions are learned. *Plain:* show the model good trajectories and make it more likely to produce them.
- **Rejection-sampling fine-tuning / trajectory distillation.** *Formal:* sample trajectories from a teacher (or the model itself), keep those whose final patch passes the hidden tests (reward = 1), and run SFT on the survivors. *Plain:* only learn from successful attempts. This is the recipe behind SWE-Gym (491 trajectories), SWE-smith (5,016 Claude 3.7 Sonnet trajectories), and R2E-Gym.
- **Learning rate (η)**, *formal:* the step size in θ ← θ − η∇L (or its Adam variant). **Epoch:** one full pass over the training set. **Batch size:** sequences per gradient step.
- **LoRA (Hu et al., 2021).** *Formal:* freeze the pretrained W₀ ∈ ℝ^{d×k} and learn ΔW = BA with B ∈ ℝ^{d×r}, A ∈ ℝ^{r×k}, rank r ≪ min(d,k). The forward pass is h = W₀x + (α/r)·BAx.\[35\]\[36\] A is initialized randomly and B to zero, so ΔW = 0 at the start. *Plain:* instead of retraining a giant matrix, learn a thin "correction" built from two skinny matrices. Trainable parameters per matrix drop from d·k to r(d+k).\[37\] For GPT-3 175B, Hu et al. report 10,000× fewer trainable parameters and 3× less GPU memory, with no added inference latency once BA is merged into W₀.\[38\] Key knobs:
  - **rank r:** capacity of the correction;
  - **α (lora_alpha):** scale; the effective multiplier is α/r;
  - **target modules:** which matrices get adapters (original paper: attention W_q, W_k, W_v, W_o; modern practice usually adds the MLP projections);\[39\]
  - **LoRA dropout:** dropout on the adapter input for regularization.
- **QLoRA (Dettmers et al., 2023).** *Formal:* store W₀ in 4-bit **NormalFloat (NF4)**, a data type whose 16 levels are quantiles of a standard normal distribution, which the paper calls information-theoretically optimal for normally distributed weights.\[40\] Dequantize to bf16 on the fly and backpropagate only into LoRA adapters.\[41\] **Double quantization** quantizes the per-block quantization constants themselves, saving ~0.37 bits per parameter.\[42\] **Paged optimizers** use unified memory paging to absorb memory spikes.\[43\] *Plain:* compress the frozen model to 4 bits and train only the small adapters. QLoRA fine-tuned a 65B model on a single 48GB GPU (down from >780GB) while matching 16-bit fine-tuning.\[41\]\[43\] For BCF, Gemma 4 12B or 26B A4B under QLoRA on a single 24–48GB GPU is the practical sweet spot; Google's Gemma docs include a QLoRA tuning guide.\[30\]
- **Reinforcement learning from verifiable rewards (RLVR).** *Formal:* maximize J(θ) = E_{y∼π_θ}[R(x,y)], where R is computed by a program (tests pass, or patch similarity), not a human. *Plain:* let the model try, score attempts automatically, and nudge it toward higher-scoring ones.
- **PPO (Schulman et al.).** *Formal:* maximize E[min(ρₜAₜ, clip(ρₜ, 1−ε, 1+ε)Aₜ)] with probability ratio ρₜ = π_θ(aₜ|sₜ)/π_old(aₜ|sₜ), advantage Aₜ from a learned value function, and ε ≈ 0.2. *Plain:* improve the policy, but never move too far in one update.
- **GRPO (Group Relative Policy Optimization; DeepSeek).** *Formal:* for each prompt, sample a group of G outputs with rewards r₁…r_G and set Âᵢ = (rᵢ − mean(r)) / std(r). Plug Âᵢ into the PPO-style clipped objective, usually with a KL penalty to a reference model, and with no value network. *Plain:* grade each attempt relative to its siblings; above average is reinforced, below average is discouraged. It is cheaper than PPO because there is no critic.
- **SWE-RL (Wei et al., Meta; NeurIPS 2025)** used GRPO on Llama-3.3-70B with reward −1 for malformed output, otherwise difflib.SequenceMatcher similarity to the oracle patch (0–1). Training: 1,600 steps, batch 512, 16K context, ~11M PR instances. Result: 41.0% on SWE-bench Verified.\[44\]\[45\] The paper reports that the continuous reward beats a discrete exact-match variant.\[46\] Limitation: similarity rewards can penalize functionally equivalent alternatives.\[47\]

> **Teachable moment #8 — Data quality and verification dominate algorithm choice at hobbyist scale.** SWE-smith's scaling curve (14.3% at 100 trajectories → 40.2% at 5,016) and Skywork-SWE's "no saturation at 8,209 trajectories" say that more verified successful trajectories is the single most reliable lever. The Scale-SWE study (2026) adds a nuance: SWE-smith's much larger synthetic set yielded slightly lower performance than real-world-sourced data in a controlled comparison.\[48\]

#### 3.3 Reference points for "what a small model can reach"

| System (base) | Size | Training | SWE-bench Verified |
|---|---|---|---|
| Gemma-3 4B, mini-SWE-agent | 4B | none | 0% (Verified Mini, 50 tasks) |
| Gemma 4 E4B (third-party) | 4.5B eff. | none (instruct) | 14.0% |
| R2E-Gym 7B (secondary source) | 7B | SFT | 19.0% (vs 10.6% SWE-Gym-trained, 1.0% base)\[5\] |
| SWE-Gym 32B | 32B | SFT, 491 traj. | 20.6% → 32.0% with verifier\[48\]\[49\] |
| R2E-Gym 32B | 32B | SFT | 34.4% pass@1 → 51% hybrid best@26\[50\] |
| SWE-agent-LM-32B (SWE-smith) | 32B | SFT, 5,016 traj. | 40.2% pass@1 |
| Llama3-SWE-RL-70B | 70B | GRPO | 41.0% |
| Gemma 4 12B (third-party) | 12B | none (instruct) | 44.2% |
| SWE-Lego-32B / SWE-Mirror-32B | 32B | SFT | 52.6% / 52.2%\[48\] |
| SWE-World SWT-32B + SWR-32B verifier | 32B | SFT + verifier | 55.0% → 68.2% (TTS@8)\[6\] |

*Interpretation:* if the third-party Gemma 4 12B figure holds, an untuned Gemma 4 12B already sits near 2025's fine-tuned 32B open models. That makes verifier-based selection and light LoRA SFT the most credible paths to the next tier within a competition timeline.

---

### Part 4 — How LLMs read code text and symbols

- **Tokenization.** *Formal:* a deterministic map from a string to a sequence of vocabulary IDs. **Byte-Pair Encoding (BPE)** starts from bytes or characters and repeatedly merges the most frequent adjacent pair into a new symbol until the vocabulary size V is reached. **SentencePiece** treats input as raw Unicode, including whitespace (shown as "▁"), and learns BPE or unigram segmentations over it. Gemma models use SentencePiece-style tokenizers; Gemma 4's vocabulary is 262K.\[51\] *Plain:* the model never sees characters, only chunks, and the chunk boundaries for `    def` or `self._transport` depend on what was frequent in training data.
- **Why this matters for patches:**
  1. **Indentation is tokens, not geometry.** Python's meaning depends on exact leading whitespace. A model that emits 3 spaces instead of 4, or mixes tabs, produces a patch that fails to apply or changes semantics.
  2. **Counting is weak.** Unified-diff hunk headers `@@ -a,b +c,d @@` require exact line arithmetic. LLMs process tokens, not line counts, so line numbers are a classic failure point. Aider explicitly tells the model not to include line numbers and treats each hunk as a search-and-replace operation.\[12\]
  3. **Exact-match anchoring.** Search/replace edits require the "search" text to match the file byte for byte. Whitespace drift or a hallucinated line breaks the match.
- **Evidence:**
  - Aider (GPT-4 Turbo laziness benchmark of 89 refactoring tasks): SEARCH/REPLACE baseline 20% → unified diff 61%, with lazy-comment occurrences cut 3×.\[12\]\[13\]
  - JetBrains' Diff-XYZ (2025): no single format dominates. Udiff-based formats were best for applying diffs, search-replace was best for generating them, and modified udiff variants worked best for smaller models.\[52\]\[53\]
  - SWE-agent's in-loop data: 51.7% of trajectories had at least one failed edit.

> **Teachable moment #9 — The patch-apply rate is a separate funnel stage. Measure it separately.** A correct idea in a malformed diff scores the same as a wrong idea. For Gemma-class models, (a) prefer anchored search/replace with tolerant matching (whitespace-normalized fallback), (b) never require line numbers from the model, (c) lint and parse after every edit. SWE-agent's lint gate was worth +3 points for GPT-4 Turbo; the benefit is plausibly larger for smaller models.

---

### Part 5 — Experimental design for testable hypotheses

#### 5.1 Core definitions

- **Resolve rate.** The fraction of task instances whose final patch passes all FAIL_TO_PASS and PASS_TO_PASS tests.
- **pass@k (Chen et al., 2021, unbiased estimator).** Generate n ≥ k samples per task, count c correct, and compute pass@k = E_tasks[ 1 − C(n−c, k) / C(n, k) ], where C is the binomial coefficient. *Plain:* the probability that at least one of k random draws is correct. Computing it from n > k samples reduces variance compared with literally drawing k.
- **best@k / selection accuracy.** The resolve rate when one patch is chosen from k candidates by your selector. **Selection efficiency** = best@k / pass@k.
- **Paired design.** Both conditions (control A, treatment B) run on the same task IDs, so per-task difficulty cancels.\[54\]
- **McNemar's test.** *Formal:* for paired binary outcomes, let b = #tasks A solved and B didn't, and c = #tasks B solved and A didn't. Under H₀, b ~ Binomial(b+c, 0.5). The exact two-sided p-value is 2·P(X ≤ min(b,c)). The large-sample statistic is χ² = (b−c)²/(b+c) with 1 degree of freedom. *Plain:* only the tasks where the two systems disagree carry information.
- **Bootstrap confidence interval.** *Formal:* resample tasks with replacement B times (e.g., 10,000), recompute the metric (or paired difference) each time, and take the 2.5th and 97.5th percentiles. *Plain:* simulate "what if we had drawn a different set of tasks?"
- **Clustered standard errors (Miller, Anthropic 2024).** When tasks are grouped (several tasks from the same repository, or repeated seeds of the same task), observations are not independent. Clustered errors can be more than 3× naïve ones.\[54\]\[55\] Miller also shows paired differences are a "free" variance reduction.\[56\]
- **Small-sample warning.** Bowyer, Aitchison & Ivanova's ICML 2025 Spotlight position paper (arXiv:2503.01747) warns that in small-data settings "CLT-based methods perform very poorly, usually dramatically underestimating uncertainty (i.e. producing error bars that are too small)." With a 50-task subset, use exact or bootstrap/Bayesian intervals.

#### 5.2 Power: a worked example (teachable moment #10)

- At p ≈ 0.20 on 50 tasks, the standard error is √(0.2·0.8/50) ≈ 0.057, so the 95% interval is ≈ ±11 points. At 500 tasks it is ≈ ±3.5 points.
- Suppose a treatment truly adds 10 points on 50 tasks, showing up as b = 2 losses and c = 7 wins (net +5 tasks). Exact McNemar gives p = 2·P(X ≤ 2 | n=9) = 2·(1+9+36)/512 ≈ 0.18. **Not significant**, even though the effect is real.
- The same effect on 500 tasks (b = 20, c = 70) gives χ² = 50²/90 ≈ 27.8, p < 10⁻⁶.
- *Practical rule:* either (a) run ≥300 tasks, (b) run each task with 3–5 seeds and analyze per-task solve probabilities with clustered errors, or (c) pre-register a single primary hypothesis per experiment and treat the rest as exploratory. Correct for multiple comparisons with Holm-Bonferroni (sort p-values ascending and compare the i-th smallest against α/(m−i+1)).

#### 5.3 Variance, contamination and benchmark validity

- **Seed/temperature variance.** SWE-agent's six-run mean was 17.94% ± 0.49 on Lite at temperature 0.\[2\] Variance at τ > 0 for a small model will be larger. Always report mean ± SD across ≥3 seeds.
- **Weak tests and leakage.** SWE-bench+ (Aleithan et al.) cut SWE-agent + GPT-4 from 18% to 9.33% on Lite\[57\] and from 22.4% to 10.0% on Verified after removing leaked-solution and weak-test cases.\[14\] For the full SWE-bench, versions of the paper report 12.47% → 3.97% and 12.47% → 4.58%; the figures differ across revisions.\[58\]\[59\] Running all developer tests (Wang et al., 2025) found 7.8% of plausible patches incorrect, −4.5 points on average.\[15\]
- **SWE-bench Verified's status.** In February 2026 OpenAI stopped reporting SWE-bench Verified ("Why SWE-bench Verified no longer measures frontier coding capabilities") and recommended SWE-bench Pro instead. Its audit of 138 problems that o3 consistently failed found 59.4% had flawed test cases, and it reported that the frontier models it tested could reproduce exact gold patches. A 2026 survey (arXiv 2608.13867) puts that 59.4% at about 82 tasks, or 16.4% of the full 500-task subset. Citing "OpenAI (2026b)", the same survey says that in July 2026 OpenAI "retracted its subsequent recommendation to use SWE-Bench Pro after an audit estimated that roughly 30 percent of its tasks were broken." I could not find OpenAI's own retraction post. Treat that claim as secondhand and check it before citing it in the deck.
- **Practical guidance for BCF:** use SWE-bench Verified (or its 50-task Mini) for comparability. Add a **private holdout** of issues filed after Gemma 4's training cutoff from repositories like httpx, and report results separately.\[60\] Run a memorization screen: the similarity of passing patches to gold patches. A spike near 1.0 suggests regurgitation.\[61\] For ablations, change one factor per arm and hold everything else fixed; run both leave-one-out from the full system and add-one-in from the naive baseline, since complementary components can make the two orderings disagree.

---

### Part 6 — Testable hypotheses and test plans

All hypotheses share the **common protocol**:
- Gemma 4 (fix one size per study; 12B or 26B A4B recommended for the main line, E4B for an efficiency track);
- identical containers;
- task set T = SWE-bench Verified Mini (50) for pilots, SWE-bench Verified (500) or Lite (300) for confirmatory runs, plus a private post-cutoff holdout;
- 3 seeds per arm;
- primary metric = resolve rate;
- primary test = exact McNemar on per-task majority-of-seeds outcomes plus paired bootstrap 95% CI of the difference, clustered by repository.

**What BCF does now (assumed from the v3 deck's structure — confirm):** spec-first issue understanding → exploration/localization → reproduction → patch → test validation, single trajectory, model-chosen actions within phases.

**H1 — Hierarchical skeleton localization improves localization recall at lower token cost.**
- *Rationale:* Agentless's combined prompt+embedding file localization and skeleton views; SWE-agent's summarized search.
- *Expected effect:* file-level recall +3–14 points versus a single method (Agentless: 67.67–78.67% → 81.67%); element recall +4.7 points with skeletons at ~10% of the cost.
- *Procedure:* Arm A = current BCF exploration. Arm B = (repo tree prompt ∪ embedding top-k) → skeleton pass → full code of top-3 functions.
- *Metrics:* file/function/line recall@k against gold-patch locations, localization tokens, end-to-end resolve rate.
- *Test:* McNemar on per-task "gold file in top-3"; paired bootstrap on tokens.
- *Data:* gold-patch file/function/line sets, per-stage candidate lists with ranks, tokens per stage.

**H2 — A calibrated reproduction test before patching increases resolve rate, and adding SBFL on that test further improves function-level localization.**
- *Rationale:* Agentless +5.0 points from reproduction tests; IssueExec function F1@3 21.14 → 34.08 with tests; AutoCodeRover SBFL +3 points.
- *Expected effect:* +3 to +5 points resolve; +10 points function-level recall.
- *Procedure:* A = no reproduction gate; B = reproduction test must fail on the base commit before patching; C = B + Ochiai ranking from coverage of the reproduction test plus related existing tests.
- *Metrics:* resolve rate; reproduction validity (fails on base; offline, passes on gold); function recall@3.
- *Test:* McNemar for A vs B and B vs C, with Holm correction.
- *Data:* reproduction test code, base-commit outcome, gold-patch outcome, coverage spectra (e_f, e_p, n_f, n_p per function), SBFL rank of the gold function.

**H3 — An anchored search/replace edit format with whitespace-tolerant matching and a lint/parse gate reduces patch-apply failures and raises resolve rate for Gemma.**
- *Rationale:* SWE-agent lint gate +3.0 points; 57.2% recovery after failed edits; Aider format findings; Diff-XYZ's size-dependent format results.
- *Expected effect:* patch-apply failure rate halved; +2–5 points resolve.
- *Procedure:* A = unified diff with line numbers; B = search/replace, exact match; C = B + normalized-whitespace fallback + `python -m py_compile`/linter gate with error echo.
- *Metrics:* apply rate, number of failed edits per trajectory, recovery rate, resolve rate.
- *Test:* McNemar on resolve; Wilcoxon signed-rank on failed edits per task.
- *Data:* every raw edit string, apply outcome and error class (no match / ambiguous match / syntax error / indentation error), lint output.

**H4 — Sampling N patch candidates with AST-normalized majority voting plus regression and reproduction filtering beats single-trajectory BCF, with diminishing returns beyond N≈20–40.**
- *Rationale:* Agentless selection ladder (25.67 → 27.00 → 32.00%) with a plateau near 40 samples; SWE-agent pass@k curve.
- *Expected effect:* +5–10 points resolve at N=10–20; selection efficiency (best@N / pass@N) of ~0.7–0.8.
- *Procedure:* N ∈ {1, 5, 10, 20, 40} at τ=0.8 (one greedy); selectors: vote only, +regression, +reproduction.
- *Metrics:* pass@N (unbiased estimator), best@N, cost per resolved issue.
- *Test:* paired bootstrap on best@N curves; McNemar at the chosen operating point.
- *Data:* all candidates with normalized hashes, per-candidate test outcomes, hidden-test correctness (offline), tokens and GPU-seconds per candidate.

**H5 — A LoRA-trained Gemma verifier combined with execution signals (hybrid) improves selection over execution-only selection.**
- *Rationale:* R2E-Gym hybrid 51% versus 43.7% (execution-based) and 42.8% (execution-free) alone; SWE-Gym verifier lift (20.6 → 32.0%); SWE-World SWR-32B 55.0 → 68.2.
- *Expected effect:* +3–8 points best@N at fixed N.
- *Procedure:* train a verifier (Gemma 4 E4B or 12B, QLoRA, r=16–64, α=2r, targets = attention + MLP projections, lr ≈ 1e-4–2e-4, 1–3 epochs) on (trajectory, patch) → resolved labels from SWE-Gym/SWE-smith/R2E-Gym environments that exclude the evaluation repos. Score = λ·V + (1−λ)·(test pass fraction).
- *Metrics:* best@N, AUROC of the verifier on held-out candidates, calibration (Brier score = mean (p − y)²).
- *Test:* McNemar versus execution-only selection; DeLong or bootstrap for AUROC.
- *Data:* labeled candidate pool (≥ several thousand candidates), verifier scores, tests passed per candidate.

**H6 — LoRA/QLoRA SFT of Gemma 4 on rejection-sampled successful BCF-format trajectories increases pass@1, roughly log-linearly in trajectory count.**
- *Rationale:* SWE-Gym (+up to 19 points, 491 trajectories); SWE-smith scaling 14.3% → 40.2% from 100 → 5,016 trajectories; Skywork no saturation at 8,209.
- *Expected effect:* +5–15 points pass@1 with 500–2,000 trajectories. Smaller absolute gains at E4B scale; see R2E-Gym 7B at 19.0% (secondary source).
- *Procedure:* collect trajectories with a teacher in BCF's exact tool schema and keep the successful ones. Train at sizes {250, 500, 1,000, 2,000}. Hyperparameter grid: r ∈ {16, 64}, lr ∈ {1e-4, 2e-4}, epochs ∈ {2, 3}, effective batch 32–64, loss masked to assistant turns. Evaluate repos disjoint from training repos.
- *Metrics:* pass@1, steps per resolved task, format-error rate, general-capability regression (e.g., LiveCodeBench subset).
- *Test:* McNemar base vs tuned; regression of resolve rate on log(trajectories).
- *Data:* trajectory provenance (teacher, repo, task source), token lengths, train/eval repo lists, checkpoint hashes, hyperparameters.

**H7 — GRPO with an execution-based reward (tests pass = 1, format error = −1, else 0), optionally shaped with patch similarity, improves over SFT-only.**
- *Rationale:* SWE-RL (41.0% with similarity reward); Kimi-Dev's outcome-only RL. GRPO avoids a value network, which suits limited hardware.
- *Expected effect:* +2–6 points over the SFT checkpoint (uncertain at small scale; flag as exploratory).
- *Procedure:* group size G = 4–8 rollouts per task; KL coefficient to the SFT reference; curriculum that drops tasks with pass@G = 0.
- *Metrics:* pass@1, reward curve, KL, response length.
- *Test:* McNemar SFT vs SFT+GRPO.
- *Data:* per-rollout rewards, group statistics, KL per step, training tasks' pass@G before and after.

**H8 — Adaptive turn budgets with early stopping improve cost per resolved issue without reducing resolve rate.**
- *Rationale:* SWE-agent's "ran out of budget" and "gave up prematurely" failure classes; SWE-smith's step-efficiency finding.
- *Expected effect:* −20–40% tokens at equal resolve rate (non-inferiority margin of 2 points).
- *Procedure:* fixed budgets {30, 50, 75} versus an adaptive policy (stop when the reproduction test passes and regressions are green; re-localize after m consecutive failed tests).
- *Test:* paired-bootstrap non-inferiority on resolve rate (lower CI bound > −2 points); paired difference in tokens.
- *Data:* termination reason per run, turn index of first correct localization, of first passing reproduction test, and of final submission.

---

## Recommendations

1. **Re-architect the v4 walkthrough around the funnel:** issue → localized (file/function/line) → reproduced → patch applied → regression-clean → selected → resolved. For every step, show "what entered, what was gained, what recall was preserved". This answers both 1a and 1b of your request.
2. **Prioritize H3 → H2 → H4 → H5 for the competition window.** These are inference-time changes with the strongest published effect sizes and no training risk. Treat H6 (LoRA SFT) as the stretch goal; it is the documented route to the next tier. Keep H7 (GRPO) exploratory.
3. **Instrument before optimizing.** Without per-candidate correctness labels you cannot separate generation failures from selection failures (teachable moment #5).

---

## Consolidated Data-Points Wishlist

**Per run (task × arm × seed)**
- Task ID, repository, base commit, benchmark split, issue creation date (versus model cutoff), container image hash
- Model ID/size, quantization, LoRA adapter hash, temperature, seed, max turns, context cap
- Outcome: resolved (FAIL_TO_PASS + PASS_TO_PASS), FAIL_TO_PASS-only pass, regression breaks
- Termination reason (submitted / budget exhausted / gave up / error)
- Totals: input tokens, output tokens, turns, tool calls by type, wall-clock, GPU-seconds or kJ, cost-per-resolved contribution
- Issue spec features: mentions file path? function? stack trace? reproduction snippet? contains a solution? (leakage flag), ambiguity score
- Gold-patch features: files touched, functions touched, hunks, lines changed

**Per localization stage**
- Ranked candidate lists at file, function and line level; recall@1/3/5 against gold; lines of context passed forward; tokens and cost per stage; retrieval method (prompt/BM25/embedding/SBFL) per candidate
- SBFL spectra (e_f, e_p, n_f, n_p) and Ochiai/DStar ranks of gold elements

**Per reproduction test**
- Code; fails on base? (and error type/stack trace); passes on gold (offline)? → calibrated flag; number of attempts to obtain a valid test

**Per edit/patch candidate**
- Raw edit text, format, apply success, failure class (no match / ambiguous / indentation / syntax), lint output, recovery success on retry
- Normalized AST hash, vote count, regression pass count, reproduction pass, verifier score, hidden-test correctness (offline label), chosen? (yes/no)
- Similarity to gold patch (difflib ratio), for memorization screening

**Per turn**
- Turn index, phase label (understand/localize/reproduce/patch/validate), Thought text, action/tool + arguments, observation length (tokens) and truncation flag, latency, tokens in/out, whether the turn changed the candidate set (proxy for information gain)

**Per failure (for a taxonomy aligned with SWE-agent's categories)**
- Label: incorrect implementation, overly specific implementation, failed edit recovery, failed to reproduce, failed to find relevant file, failed to find edit location, ran out of budget, gave up prematurely, other
- Label source: human or LLM judge; record LLM-judge agreement with human labels on a sample (SWE-agent's GPT-4o labeler matched authors on 87% of a 15-instance hand-labeled set)\[2\]

**For training (H5, H6, H7)**
- Trajectory provenance (teacher model, scaffold version), success label, train/eval repo disjointness list, token-length distribution
- Hyperparameters (r, α, target modules, dropout, lr, schedule, epochs, effective batch), loss curves, checkpoint hashes
- RL: group rewards, advantage statistics, KL to reference, response length over training

---

## Caveats

- **BCF's current behavior** is inferred from the v3 deck's structure as described to me. I have not seen the deck's internals, so "current vs. proposed" baselines must be confirmed.
- **Third-party and secondary numbers:** the Gemma 4 SWE-bench Verified figures (E4B 14.0%, 12B 44.2%) come from the Nanbeige4.2-3B report, not Google. The R2E-Gym 7B number comes from a secondary wiki summary. The July 2026 SWE-bench Pro retraction comes from a survey paper, not OpenAI directly.
- **Effect sizes don't transfer cleanly.** Most were measured with GPT-4-class or 32B+ models. Small models may benefit more from structure (likely) and less from self-generated reproduction tests (they write worse tests). Treat every expected effect as a prior to update, not a promise.
- **The information-theoretic framing** (entropy and expected information gain of localization actions) is an explanatory lens consistent with the measured recall-versus-context tradeoffs. It is not a result reported in the cited papers.

## Sources

1. [Workflow runs · encode/httpx](https://github.com/encode/httpx/actions)
2. [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/html/2405.15793)
3. [Agentless :Demystifying LLM-based Software Engineering Agents](https://arxiv.org/html/2407.01489)
4. <https://arxiv.org/html/2407.01489v1>
5. [R2E-Gym - Learn AI - Miraheze](https://ai.miraheze.org/wiki/R2E-Gym)
6. [SWE-World: Building Software Engineering Agents in Docker-Free Environments](https://arxiv.org/pdf/2602.03419)
7. [Training Software Engineering Agents and Verifiers with SWE-Gym](https://hyper.ai/en/papers/2412.21139)
8. [\[2504.07164\] R2E-Gym: Procedural Environments and Hybrid Verifiers for Scaling Open-Weights SWE Agents](https://arxiv.org/abs/2504.07164)
9. [SWE-smith: Scaling Data for Software Engineering Agents](https://www.alphaxiv.org/abs/2504.21798)
10. [Skywork-SWE: Unveiling Data Scaling Laws for Software Engineering in LLMs](https://arxiv.org/pdf/2506.19290)
11. [\[2502.18449\] SWE-RL: Advancing LLM Reasoning via Reinforcement Learning on Open Software Evolution](https://arxiv.org/abs/2502.18449)
12. [Unified diffs make GPT-4 Turbo 3X less lazy](https://aider.chat/docs/unified-diffs.html)
13. [Prompting with unified diffs makes GPT-4 write much better code](https://notes.aimodels.fyi/new-research-shows-lazy-coding-reduced-in-large-language-models-using-unified-diffs/)
14. [SWE-Bench+: Enhanced Coding Benchmark for LLMs](https://arxiv.org/pdf/2410.06992)
15. [Are “Solved Issues” in SWE-bench Really Solved Correctly? An Empirical Study](https://arxiv.org/html/2503.15223v1)
16. [GitHub - xingyaoww/code-act: Official Repo for ICML 2024 paper "Executable Code Actions Elicit Better LLM Agents" by Xingyao Wang, Yangyi Chen, Lifan Yuan, Yizhe Zhang, Yunzhu Li, Hao Peng, Heng Ji. · GitHub](https://github.com/xingyaoww/code-act)
17. [Executable Code Actions Elicit Better LLM Agents](https://arxiv.org/html/2402.01030v4)
18. [Dissecting the SWE-Bench Leaderboards: Profiling Submitters and Architectures of LLM- and Agent-Based Repair Systems](https://arxiv.org/html/2506.17208v2)
19. [SHERLOC: Structured Diagnostic Localization for Code Repair Agents](https://arxiv.org/pdf/2606.24820)
20. [IssueExec: A Test-Driven Approach for Localizing Software Engineering Issues](https://arxiv.org/pdf/2607.17286)
21. [1 An Empirical Study of Fault Localization Families and Their Combinations](https://homes.cs.washington.edu/~mernst/pubs/fl-families-tse2019.pdf)
22. [Large Language Models in Fault Localisation](https://arxiv.org/pdf/2308.15276)
23. [1 An Empirical Study of Fault Localization Families and Their Combinations](https://arxiv.org/pdf/1803.09939)
24. [AutoCodeRover: Autonomous Program Improvement Yuntong Zhang](https://dl.acm.org/doi/pdf/10.1145/3650212.3680384)
25. [AutoCodeRover: Autonomous Program Improvement Yuntong Zhang](https://arxiv.org/pdf/2404.05427)
26. [Dissecting the SWE-Bench Leaderboards: Profiling Submitters and Architectures of LLM- and Agent-Based Repair Systems](https://arxiv.org/pdf/2506.17208)
27. [AutoCodeRover: Autonomous Program Improvement](https://www.alphaxiv.org/abs/2404.05427)
28. [R2E-Gym: Scaling Open-Weights SWE Agents](https://r2e-gym.github.io/)
29. [Mini-SWE Agent: Lightweight Code Repair Agent](https://www.emergentmind.com/topics/mini-swe-agent-27d26942-1f63-4337-bee8-576ebb1468c3)
30. [Gemma 4 model card | Google AI for Developers](https://ai.google.dev/gemma/docs/core/model_card_4)
31. [Gemma 4: Google DeepMind’s Most Capable Open Multimodal Models](https://medium.com/@danushidk507/gemma-4-google-deepminds-most-capable-open-multimodal-models-3a7f3e47e764)
32. [Nanbeige4.2-3B: Unlocking Agentic Capabilities in a Compact Model](https://arxiv.org/pdf/2607.22083)
33. [Gemma 4](https://lmstudio.ai/models/gemma-4)
34. [How to Use Gemma 4 12B: Hugging Face Model Card and Local Loading Guide](https://knightli.com/en/2026/06/06/gemma-4-12b-hugging-face-model-card/)
35. [Theoretical Foundations of Communication-Efficient, Robust, and Practical Distributed and Federated Optimization](https://arxiv.org/pdf/2608.06563)
36. [HEFT: A Coarse-to-Fine Hierarchy for Enhancing the Efficiency and Accuracy of Language Model Reasoning](https://arxiv.org/pdf/2509.09801)
37. [Bayesian Low-rank Adaptation for Large Language Models](https://arxiv.org/pdf/2308.13111)
38. [LoRA Fine-Tuning: Low-Rank Adapters and QLoRA](https://memx.app/glossary/lora/)
39. [LoTR: Low Tensor Rank Weight Adaptation](https://arxiv.org/pdf/2402.01376)
40. [Paper Review: QLoRA: Efficient Finetuning of Quantized LLMs](https://andlukyane.com/blog/paper-review-qlora)
41. [QLoRA — FinLoRA Documentation 1.0 documentation](https://finlora-docs.readthedocs.io/en/latest/lora_methods/qlora.html)
42. [Interactive Study with Conversation1st.ai — QLoRA: Efficient Finetuning of Quantized LLMs](https://medium.com/@tonytong.ai/interactive-study-with-conversation1st-ai-qlora-efficient-finetuning-of-quantized-llms-7b50cb31ea19)
43. [QLORA: Efficient Finetuning of Quantized LLMs Tim Dettmers∗ Artidoro Pagnoni∗](https://proceedings.neurips.cc/paper_files/paper/2023/file/1feb87871436031bdc0f2beaa62a049b-Paper-Conference.pdf)
44. [SWE-RL: Reinforcement Learning for Software Engineering](https://www.emergentmind.com/topics/swe-rl)
45. [SWE-RL by Meta — Reinforcement Learning for Software Engineering LLMs - AI Papers Academy](https://aipapersacademy.com/swe-rl/)
46. [SWE-RL: Advancing LLM Reasoning via Reinforcement Learning on Open Software Evolution](https://www.alphaxiv.org/abs/2502.18449)
47. [SWE-RL: Advancing LLM Reasoning via Reinforcement Learning on Open Software Evolution - AI Research Paper Analysis](https://arxivlens.com/PaperView/Details/swe-rl-advancing-llm-reasoning-via-reinforcement-learning-on-open-software-evolution-9627-77ce2e6f)
48. [Immersion in the GitHub Universe: Scaling Coding Agents to Mastery](https://arxiv.org/pdf/2602.09892)
49. [Training Software Engineering Agents and Verifiers with SWE-Gym](https://arxiv.org/pdf/2412.21139)
50. [R2E-Gym: Procedural Environment Generation and Hybrid Verifiers for Scaling Open-Weights SWE Agents — Lacuna](https://lacuna.tiptreesystems.com/work/r2e-gym-procedural-environment-generation-and-hybrid-verifiers-for-scaling-open/wrk_f5f44a285ae3b49cb2c6263702f8b172)
51. [nvidia/Gemma-4-31B-IT-NVFP4 · Hugging Face](https://huggingface.co/nvidia/Gemma-4-31B-IT-NVFP4)
52. [Diff-XYZ: A Benchmark for Evaluating Diff Understanding](https://arxiv.org/html/2510.12487v1)
53. [\[Feature\]: Hashline File Editing for Hive Agents · Issue #4752 · adenhq/hive](https://github.com/adenhq/hive/issues/4752)
54. [Adding Error Bars to Evals: A Statistical Approach to Language Model Evaluations](https://www.alphaxiv.org/abs/2411.00640)
55. [evalci: A Python Library for Statistically Rigorous Comparison of Language Model Evaluations](https://arxiv.org/pdf/2607.04429)
56. [Anthropic on X: "New Anthropic research: Adding Error Bars to Evals. AI model evaluations don’t usually include statistics or uncertainty. We think they should. Read the blog post here: https://t.co/jwT73WsyFe" / X](https://x.com/AnthropicAI/status/1858976458330505639)
57. [SWE-Bench Lite: LLM Bug-Fix Benchmark](https://www.emergentmind.com/topics/swe-bench-lite-287687ae-2efa-4e10-b36b-2ea90e25ec7e)
58. [SWE-Bench+: Enhanced Benchmark for LLMs](https://www.emergentmind.com/papers/2410.06992)
59. [SWE-Bench+: Enhanced Coding Benchmark for LLMs](https://yorkspace.library.yorku.ca/items/39fdcdf5-f606-4b77-b59a-27ed480838fa)
60. [Why we no longer evaluate SWE-bench Verified - DEV Community](https://dev.to/jgnoncelogic/why-we-no-longer-evaluate-swe-bench-verified-59gc)
61. [SWE Atlas: Benchmarking Coding Agents Beyond Issue Resolution](https://arxiv.org/pdf/2605.08366)
