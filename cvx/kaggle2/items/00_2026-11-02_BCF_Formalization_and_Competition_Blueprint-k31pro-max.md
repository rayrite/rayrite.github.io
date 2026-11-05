# COMBINED MARKDOWN - combine

_Generated 2026-11-05 15:09:41 | 10 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle2\items\combine_

## Contents

1. 00_Gemma-Models-and-BCF-Framework.md
2. 01_gemma4-developer-agent-brain-roadmap.md
3. 02_gemma4-representative-issues-2026-11-02.md
4. 02b_representative-issues-by-category-2026-11-02.md
5. 03_Gemma_4_27_Issue_Families_Python_Root_Cause_and_Triage_2026-11-02.md
6. 04_gemma4-python-root-cause-triage-2026-11-02-k31ph-agsw.md
7. 05_gemma4-agent-brain-architecture.md
8. 06_swe-bench-vs-gemma-4-developer-agent-scoring-2026-11-02.md
9. 07_swegemma-built-in-methods-primer-2026-11-02.md
10. 08_swegemma-timeout-prevention-primer-2026-11-02.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_Gemma-Models-and-BCF-Framework.md -->
<!-- ====================================================================== -->

# The main idea

Yes—BCF is coherent and testable. Its strongest formulation is:

> **BCF turns a coding model from a patch-guesser into a controlled experimenter, then turns verified experiments into reusable capability.**

A naive agent behaves like an apprentice who edits files until something appears to work, then forgets the experience. BCF behaves like a disciplined engineering team:

- preserve the last working version;
- reproduce the problem;
- gather evidence before editing;
- generate candidates away from the stable version;
- independently test them;
- promote only verified improvements;
- distill the experience into something reusable.

The “baton” passed between machines is therefore **not merely output text**. It is:

> **working state + evidence + provenance + tests + a reproducible environment + the next useful action.**

One important competition distinction: the Bonus Prize does **not** specifically require self-improvement or BCF. It awards $10,000 to the highest private-test-performing selected final submission using E2B or E4B; LoRA is allowed. BCF is therefore a means to increase resolved tasks—not the judging criterion itself.

# What E2B and E4B mean for BCF

| Property | Gemma 4 E2B | Gemma 4 E4B |
|---|---:|---:|
| Effective parameters | 2.3B | 4.5B |
| Approximate total parameters, including embeddings | 5B | 8B |
| Architecture | Dense Transformer with per-layer embeddings | Same |
| Native context | 128K tokens | 128K tokens |
| Input modalities | Text, image, audio | Text, image, audio |
| Local-to-global attention pattern | 4:1 | 5:1 |
| LiveCodeBench v6, thinking | 44.0 | 52.0 |
| Terminal Bench Hard, thinking | 3.0 | 8.0 |
| MRCR v2, eight needles at 128K | 19.1 | 25.4 |

The technical report also describes thinking mode, function calling, quantization-aware training, KV-cache sharing, and multi-token-prediction drafters for faster speculative decoding. These published benchmarks are not Kaggle competition scores, but the especially low Terminal Bench Hard results are a warning: **small-model coding knowledge does not automatically translate into reliable long-horizon agent behavior.**

Two practical consequences follow.

**First, E4B is the sensible initial default.** It has the stronger published coding and agentic results. E2B becomes attractive only if its speed allows sufficiently more attempts to produce a higher measured **pass rate within the complete evaluation budget**.

**Second, BCF must externalize discipline.** Do not expect a long constitution in the system prompt to produce reliable behavior. Compile the constitution into short phase-specific instructions, structured state, tests, and explicit transitions.

Also, “full developer reference available” must mean **version-matched and retrievable**, not “the entire documentation is always in the prompt.”

# Where BCF can actually move the needle

Conceptually, task resolution can be examined as a chain:

\[
P(\text{resolve}) =
P(\text{reproduce})
\times P(\text{localize}\mid\text{reproduce})
\times P(\text{valid patch}\mid\text{localized})
\times P(\text{survive verification}\mid\text{valid patch})
\]

BCF should instrument these stages. Otherwise, you cannot tell whether the agent is failing because it cannot find the bug, cannot construct the fix, or keeps damaging otherwise viable fixes.

Against a naive baseline, BCF should produce five measurable improvements:

1. **Better reproduction:** convert the issue into a minimal observable failure.
2. **Better localization:** identify the responsible mechanism rather than editing whichever file looks related.
3. **Less looping:** recognize repeated no-progress states and change strategy.
4. **Less patch thrashing:** preserve candidates and test them independently instead of accumulating uncontrolled edits.
5. **Reusable learning:** convert verified traces into skills, evaluation cases, or training data that improve later tasks.

The largest immediate gain will probably come from **better localization and recovery from failed hypotheses**, not from adding more agents or producing more documentation.

# BCF 1.0: an enforceable constitution

## 1. Last known good

Every run starts from an immutable, reproducible baseline:

- repository commit;
- dependency and tool versions;
- model and adapter identifiers;
- prompt and skill versions;
- initial test results.

Experiments occur in isolated worktrees or equivalent sandboxes. A failed experiment can never destroy the last known good state.

“Preserve working code” therefore means **always restorable**, not “never modify broken code.”

## 2. Single writer, evidence-based risk gate

The Conductor is the only role permitted to integrate a candidate into the stable state. Other roles may inspect, propose, or test.

Risk should be estimated from observable properties:

\[
risk=f(\text{blast radius},\text{reversibility},\text{uncertainty},
\text{test coverage},\text{statefulness})
\]

Higher risk requires stronger verification. A public API, concurrency, persistence, or cross-module change requires more than a single happy-path test.

The model should not be able to approve its own patch merely by asserting that it is safe.

## 3. Evidence before modification

Before the first repair attempt, the agent must establish as much as practical:

- expected behavior;
- observed behavior;
- a reproduction or diagnostic observation;
- affected versions and environment;
- initial passing tests that must remain passing.

If a minimal reproduction is impossible, record why and choose the cheapest experiment that reduces uncertainty.

## 4. Versioned source of truth

Use an explicit evidence hierarchy:

1. issue requirements and executable acceptance behavior;
2. version-matched source code and tests;
3. version-matched official developer documentation;
4. established repository conventions;
5. inferred patterns and prior experience.

Documentation is not automatically correct for every version. Every important diagnosis should link to concrete evidence: file, symbol, test, documentation section, or command result.

## 5. Atomic decomposition

The decomposition tool should produce an **evidence graph**, not merely a list of smaller tasks. Each node should contain:

- an observation or claim;
- expected versus actual behavior;
- supporting evidence;
- a falsifiable hypothesis;
- the cheapest discriminating test;
- status: unknown, supported, refuted, or resolved.

“Atomic” does not always mean a language primitive. The atomic unit might be a configuration value, data shape, exception path, lifecycle event, or concurrency assumption.

## 6. Deliberate search and termination

Use different searches for different structures:

- **Breadth-first:** discover relevant files, symbols, tests, and dependencies.
- **Depth-first:** follow a promising call or data-flow chain.
- **Binary search:** locate regressions across ordered commits or changes.
- **Delta debugging:** shrink a failing input or patch while preserving the failure.

Every search needs a budget, a no-progress detector, and a termination condition. Search is useful only when it reduces uncertainty.

## 7. Clean-room candidate construction

Clean-room generation receives:

- the minimal reproduction;
- relevant requirements;
- verified atomic constructs;
- applicable reference documentation;
- explicit constraints.

It is insulated from anchoring on earlier flawed patches and speculative reasoning.

Clean-room output should initially be a **design or reference implementation**. A separate integration step adapts it to repository conventions. A solution correct in isolation can still be incompatible with the actual project.

Generate alternatives only when they represent genuinely different hypotheses; do not waste budget producing near-duplicates.

## 8. Independent verification and rollback

A candidate is accepted only after appropriate checks:

- the reproduction fails before and passes after;
- targeted tests pass;
- relevant pre-existing tests remain green;
- broader regression tests match the risk level;
- the diff is inspectable and no larger than necessary;
- the result reproduces from a clean checkout.

Verification must inspect behavior, not the candidate generator’s confidence. On failure, revert to the exact last verified candidate—not to an arbitrarily edited approximation of it.

## 9. Root-cause analysis and controlled distillation

A post-mortem must distinguish:

- **root cause:** the mechanism that produced the failure;
- **contributing conditions:** why it escaped detection;
- **failed hypotheses:** what was tried and what evidence refuted it;
- **generalizable lesson:** when the lesson applies and when it does not.

A failed attempt is not automatically a useful negative lesson. It may simply have been implemented badly. Negative knowledge requires a validated counterexample or discriminating experiment.

Reusable lessons should have a trigger, context signature, minimal example, verified procedure, tests, references, limitations, and version.

## 10. Adaptive but bounded effort

Effort should purchase missing evidence, not merely generate more tokens.

- Use cheap exploration for initial localization.
- Escalate reasoning when hypotheses conflict or the root cause remains uncertain.
- Use clean-room generation after diagnosis stalls.
- Reserve budget for final verification.
- Stop after verified success, exhausted budget, or repeated no-progress states.

Logical roles do not all need separate agents. For E2B/E4B, begin with **one Conductor and phase-specific skills**. Add subagents only when measurements show that their benefit exceeds their coordination cost.

# The two loops that make improvement permanent

## Inner loop: improve the current repository

```text
BASELINE
  → REPRODUCE
  → LOCALIZE
  → HYPOTHESIZE
  → CLEAN-ROOM CANDIDATE
  → INTEGRATE
  → VERIFY
  → ACCEPT or REVERT
```

Its output is a patch and an evidence capsule.

## Outer loop: improve the agent itself

```text
EVALUATE AGENT
  → ANALYZE FAILURES
  → DISTILL VERIFIED LESSONS
  → PROPOSE NEW PROMPT / SKILL / TEST / LoRA
  → COMPARE ON PAIRED VALIDATION TASKS
  → PROMOTE or REJECT
  → FREEZE VERSIONED BUNDLE
```

This outer loop is what your original idea needs in order to become **permanent improvement**. Run it during development. Do not make the final score depend on undocumented memory writes during evaluation; assume tasks may start fresh unless the harness explicitly guarantees persistence.

The competition’s predefined-tool and submission constraints likewise mean these roles should first be treated as logical workflows mapped onto the permitted agent configuration, rather than assuming that arbitrary new runtime tools can be introduced.

# Replacing “x′ is asymptotically greater than x”

That statement is a useful aspiration, but it is not a valid engineering guarantee. A finite evaluation cannot prove asymptotic superiority, and an agent can improve on one task distribution while regressing on another.

Use this stronger, testable contract instead:

> **Every attempt must produce an inspectable artifact. Only verified improvements may change the stable agent.**

An attempt artifact can be:

- a verified patch;
- a minimal reproduction;
- a validated counterexample;
- a narrowed search space;
- a regression test;
- a reusable skill;
- a verified training example;
- a reproducible failure report.

A long transcript alone is not valuable output.

For agent version \(A_t\) and candidate change \(\Delta_t\):

\[
A_{t+1}=
\begin{cases}
A_t+\Delta_t,&\text{if verification and promotion criteria pass}\\
A_t,&\text{otherwise}
\end{cases}
\]

Promotion should require:

1. improved paired resolution rate on validation tasks, beyond expected run noise;
2. no unacceptable critical regressions;
3. compliance with time, tool-call, context, and packaging constraints;
4. reproducibility from a clean environment.

The intended invariant is:

\[
Q_V(A_{t+1})\geq Q_V(A_t)
\]

on the versioned validation suite, while the final claim of generalization is:

\[
Q_H(A_{\text{final}})>Q_H(A_{\text{naive}})
\]

on a separate audit set \(H\) that was not used for training or routine promotion decisions.

Here, **permanent** means the improvement survives a restart because it is packaged in the agent bundle and transfers to fresh tasks. It does not mean perfection on every future task.

# The experiment that proves BCF works

Use the same base model, quantization, tools, and budget for four variants:

| Variant | Purpose |
|---|---|
| **A0: naive agent** | Establishes the baseline |
| **A1: BCF inner loop** | Tests debugging discipline alone |
| **A2: A1 + distilled skills/tests** | Tests durable cross-task learning |
| **A3: A2 + verified-trace LoRA** | Tests whether weight-level learning adds value |

Measure:

- final paired resolution rate;
- reproduction and localization success;
- verified-patch rate;
- regressions introduced;
- repeated/no-progress tool-call rate;
- time and tool calls per resolved task;
- performance on fresh repositories and issue families.

The interpretation is clean:

- **A1 > A0:** BCF improves execution.
- **A2 > A1 on fresh tasks:** BCF produces durable learning.
- **A3 > A2:** LoRA adds capability beyond explicit skills.
- **Only training tasks improve:** you have memorization, not general improvement.

# Recommended competition strategy

Start with **BCF-lite on E4B**:

1. Establish the naive baseline and stage-level failure statistics.
2. Implement baseline preservation, minimal reproduction, an evidence ledger, bounded localization, candidate isolation, and final verification.
3. Keep the runtime physically simple: one Conductor, short phase prompts, skills loaded when needed.
4. Use post-mortems from development tasks to create a small library of high-quality diagnostic and recovery skills.
5. Add clean-room alternatives only for measured failure modes.
6. Train LoRA only from verified, concise action traces—not raw rambling transcripts.
7. Compare E2B against E4B by **resolved tasks under the complete budget**, not tokens per second.
8. Freeze the best reproducible bundle and evaluate it on held-out tasks before selecting it as a Bonus Prize finalist.

In one sentence:

> **BCF moves the needle when it makes the small agent spend its budget on discriminating experiments instead of guesses—and makes improvement permanent only when verified lessons survive as tested skills, regression cases, or trained adapters.**


---

<!-- ====================================================================== -->
<!-- FILE: 01_gemma4-developer-agent-brain-roadmap.md -->
<!-- ====================================================================== -->

# A “Brain” for the Gemma 4 Developer Agent

## A two-track engineering roadmap for Gemma 4 31B and E4B

**Scope:** All 3 technical categories and 27 category–subcategory pairs in `gemma4_task_classification.csv`  
**Evidence base:** The 129-row taxonomy and the companion report, `gemma4-representative-issues-2026-11-02.md`  
**Date:** 2026-11-02

## Executive decision

Build **one shared repair system with two operating policies**, not two unrelated agents and not one enormous prompt.

The “brain” should contain:

1. a **task compiler** that turns an issue into observable requirements;
2. a **repository world model** containing symbols, dependencies, tests, and runtime phases;
3. a **router** that selects one or more of 27 repair playbooks;
4. a **closed-loop controller** that observes, probes, edits, tests, and recovers;
5. **structured working memory** for hypotheses, evidence, and test state;
6. a **verified case library** of disjoint historical repairs;
7. a **deterministic verifier** that checks behavior, regressions, diff hygiene, and budget; and
8. a **model adaptation layer** trained on verified action trajectories rather than final patches alone.

The track-specific strategy is:

- **31B: reasoning-centric adaptive repair.** Use the model as planner, localizer, editor, and critic. Allow multiple competing hypotheses, dynamic playbook composition, longer dependency traces, and test-driven replanning.
- **E4B: system-centric distilled repair.** Externalize routing, retrieval, context compression, invariant checks, and workflow state. Give the model one retrieved playbook, a small evidence packet, constrained actions, and short repair loops. Distill verified 31B trajectories into concise decisions and action sequences.

Do not make E4B imitate the 31B agent’s long deliberations. Transfer the **verified decisions, probes, and recovery policies**, not the larger model’s token consumption.

## 1. Model and competition assumptions to lock first

Gemma 4 31B has a 256K-token context window; E4B has 128K. The official model card describes E4B as 4.5B effective parameters with approximately 8B parameters including embeddings, while 31B is a 30.7B dense model. Both support native function calling and configurable thinking. [Official Gemma 4 model card](https://huggingface.co/google/gemma-4-31B-it)

Google’s approximate inference-memory table lists 17.5 GB for 31B Q4_0 and 4.5 GB for E4B Q4_0, including its stated loading overhead but excluding runtime software and KV-cache growth. These are weight-loading estimates, not complete agent-memory budgets. [Gemma 4 model overview](https://ai.google.dev/gemma/docs/core)

Gemma 4’s official function-calling flow uses structured tool declarations, model-generated calls, application-side parsing/execution, and tool responses returned to the model. The same documentation recommends manual schemas when automatic conversion hides complex nested arguments. [Function calling with Gemma 4](https://ai.google.dev/gemma/docs/capabilities/text/function-calling-gemma4)

Before training or submission, verify the current official competition rules for:

- permitted base checkpoints and adapter merging;
- whether training-time teacher models or externally generated trajectories are allowed;
- network access and use of upstream issue/PR material;
- tool availability in the evaluation sandbox;
- inference time, token, memory, and storage limits;
- whether multiple model calls, sampling branches, or verifier calls are allowed; and
- treatment of the supplied 129 tasks and reference patches.

The public competition pages did not expose usable rule text through the retrieval path used here. Therefore, this roadmap does **not** invent submission constraints. Treat rules verification as Phase 0, and keep a rules-compliant fallback that uses only the target checkpoint, local repository tools, and permitted training data.

## 2. Target architecture

### 2.1 The shared control loop

```text
Issue + repository
       |
       v
[1] Task compiler
    - expected behavior
    - observed failure
    - compatibility constraints
    - explicit prohibited changes
       |
       v
[2] Repository world model
    - symbols and imports
    - candidate runtime phases
    - test map
    - dependency/version files
       |
       v
[3] Multi-label skill router ----> [27 playbook library]
       |                                  |
       v                                  v
[4] Reproduce and localize <---- retrieved probes and invariants
       |
       v
[5] Hypothesis ledger
    H1/H2/... + predictions + evidence + status
       |
       v
[6] Minimal repair operator
       |
       v
[7] Layered verifier
    reproduction -> focused tests -> sibling tests -> static/diff checks
       |
       +---- failure: update evidence and choose next probe/hypothesis
       |
       +---- success: independent final critique and clean diff
```

The model should propose actions and interpretations; deterministic code should own command execution, timeouts, repository state, test selection, patch application, and final validation.

### 2.2 Structured working memory

Do not use the raw conversation as the agent’s only memory. Maintain a compact state object:

```json
{
  "goal": "Observable behavior to restore or add",
  "constraints": ["Public API compatibility", "No test weakening"],
  "skills": ["fastapi.responses_streaming"],
  "reproduction": {
    "command": "...",
    "before": "fail",
    "evidence": "closed resource while stream is consumed"
  },
  "hypotheses": [
    {
      "id": "H1",
      "claim": "Dependency exit runs before response consumption",
      "prediction": "Cleanup timestamp precedes final chunk",
      "status": "supported"
    }
  ],
  "candidate_files": ["..."],
  "edits": [{"file": "...", "purpose": "..."}],
  "tests": [{"id": "...", "result": "pass", "why_relevant": "..."}],
  "budget": {"model_calls": 8, "commands": 20},
  "status": "verifying"
}
```

This gives both tracks a resumable state and prevents a failed command from being silently forgotten.

### 2.3 Playbook format

Every subcategory playbook should be a versioned data object, not just a prompt paragraph:

```yaml
id: rich.unicode_graphemes
triggers:
  - hang in console output
  - zero-width character or segmentation failure
required_probes:
  - minimal reproducer with bounded timeout
  - record string indices, grapheme widths, and emitted spans
invariants:
  - every input index is covered exactly once
  - every iteration advances or terminates
repair_operators:
  - add explicit leading zero-width span handling
  - guard cyclic or non-advancing traversal
oracle:
  - adversarial fixtures terminate
  - spans have no gaps
  - ordinary grapheme widths remain unchanged
anti_patterns:
  - special-casing one emoji
  - assuming zero terminal cells means zero input characters
related_cases: [rich_4006, rich_3953, rich_3521]
```

### 2.4 Tool contract

Use a small, explicit action vocabulary:

- `search_repository(query, paths?, regex?)`
- `read_symbol(symbol, context_lines?)`
- `read_file(path, range)`
- `map_tests(changed_symbols)`
- `run_command(command, timeout, expected_evidence)`
- `run_tests(test_ids, timeout)`
- `apply_edit(file, old, new, purpose)`
- `inspect_diff()`
- `record_evidence(hypothesis_id, evidence)`
- `finish(summary, tests_run, residual_risks)`

Each action should include `objective` and `expected_evidence`. This makes tool calls auditable and lets the controller detect aimless exploration. Use allowlisted dispatch rather than evaluating model-generated function names.

## 3. Two operating tracks

| Dimension | Gemma 4 31B track | Gemma 4 E4B track |
|---|---|---|
| Core bet | Adaptive reasoning finds non-obvious root causes | Scaffolding and verified memory make a small model reliable |
| Routing | Soft, multi-label; model may combine playbooks | Deterministic first pass plus model confirmation; usually one primary and one fallback playbook |
| Context | Dynamic evidence packet, expandable dependency trace; never dump the whole repository by default | Aggressive retrieval and compression; one playbook, relevant symbols, reproducer, and a small test excerpt |
| Hypotheses | Start with 2–3 when evidence is ambiguous; compare predictions | Start with 1; generate a second only after a falsifying result |
| Editing | Can coordinate multi-file lifecycle or adapter changes | Prefer local edits and established repair operators; require escalation for broad changes |
| Verification | Model critic plus deterministic tests and property checks | Primarily deterministic verifier; model explains failures but cannot declare success alone |
| Recovery | Replan from the hypothesis ledger and test evidence | Bounded recovery templates: localization failure, test failure, invalid action, budget exhaustion |
| Thinking | Enable adaptively for localization and final critique; disable for mechanical calls | Use sparingly; short structured decisions usually give better budget efficiency |
| Adaptation | SFT on long-horizon verified trajectories and recovery; QLoRA first, larger tuning only after ablation | Distill concise verified actions from 31B; QLoRA, balanced skill sampling, strong tool-call supervision |
| Main risk | Overthinking, broad refactors, expensive parallel exploration | Routing errors, shallow localization, premature patching, brittle long-horizon behavior |

### 3.1 31B inference policy

1. Compile the issue and identify the violated invariant.
2. Retrieve candidate skills, but allow the model to reject the router.
3. Build 2–3 falsifiable hypotheses for ambiguous tasks.
4. Run the cheapest discriminating probe before editing.
5. Patch the highest-supported hypothesis.
6. Use focused tests, then ask a separate critic pass to identify untested sibling paths and compatibility risks.
7. Run broader tests only after the focused oracle passes.
8. Stop when the evidence is sufficient; do not spend budget merely because more context is available.

### 3.2 E4B inference policy

1. Deterministically extract repository, error type, symbols, and likely subsystem.
2. Route to a primary playbook and retrieve at most a few verified analogous cases.
3. Present a fixed decision packet: requirement, failing evidence, candidate invariant, permitted edit region, and test oracle.
4. Execute a short probe–edit–verify cycle with schema-constrained actions.
5. On failure, classify the failure and invoke the matching recovery template.
6. If the task requires broad cross-file reasoning or two failed hypotheses, use a conservative fallback: gather more evidence, reduce the edit, or terminate honestly within budget rather than thrashing.
7. Let deterministic checks, not model confidence, decide completion.

## 4. The 27-subcategory skill roadmap

The “31B” and “E4B” entries below specify how the same skill should operate under each track. Every skill requires a minimal reproducer, a violated invariant, a repair operator, and an executable oracle.

### 4.1 Web framework & API development — FastAPI

| Subcategory and seed case | Brain capability and executable oracle | 31B policy | E4B policy |
|---|---|---|---|
| **Documentation & project automation** — `fastapi_15661` | Model release/documentation work as a state machine: inputs, version transitions, validation, release events, and user-facing security guidance. Test version bumps, empty/duplicate sections, CLI/environment inputs, and workflow event ordering. | Reason across CLI, version files, notes, and CI YAML; dry-run the full state transition and critique permissions/failure paths. | Retrieve a release checklist and command templates; use parsers for semantic versions and workflow YAML; restrict edits to declared release surfaces. |
| **Responses, SSE & streaming** — `fastapi_14099` | Distinguish endpoint return, response consumption, final chunk, exception, cancellation, and dependency cleanup. Oracle records event order and verifies resources remain alive until streaming completes, including cleanup on failure. | Trace asynchronous phases across middleware and dependencies; compare alternative lifetimes and backward-compatible opt-outs. | Retrieve a lifecycle diagram and streaming fixture; require an event-order assertion before editing; prefer a known middleware/scope repair over free-form redesign. |
| **Parameter & request-body parsing** — `fastapi_13537` | Separate raw wire values from normalized model values; track aliases, defaults, extras, and content types. Test empty strings, `None`, unknown fields, aliases, URL-encoded forms, and multipart forms. | Dynamically trace values through parser, field processing, and merge logic; audit sibling parameter paths. | Generate a boundary-value matrix and use a known merge-rule checklist; require both form encodings when forms are involved. |
| **Routing, application APIs & lifecycle** — `fastapi_14851` | Preserve public lifecycle contracts when dependency internals change. Probe startup/shutdown order, sync/async handlers, generator lifespans, router inclusion, and object identity. | Compare upstream/downstream lifecycle implementations and design an adapter; critique multi-file compatibility and deprecated API behavior. | Use a compatibility playbook with a version matrix and lifecycle fixtures; avoid broad router rewrites unless deterministic call-graph evidence demands them. |
| **OpenAPI, JSON Schema & schema metadata** — `fastapi_14986` | Track schema ownership, cache mutation, reference/metadata propagation, and output context. Oracles repeat requests with different root paths, assert configured servers remain unchanged, inspect security scopes/refs, and test HTML-script escaping. | Jointly analyze state isolation and schema semantics; inspect transformations from endpoint metadata to rendered UI. | Use separate checklists for cache isolation, schema shape, and escaping; provide golden payloads and immutable-input assertions. |
| **Authentication & request security** — `fastapi_13786` | Encode authentication versus authorization semantics and scheme-specific challenge behavior. Test every security helper for status, `WWW-Authenticate`, whitespace/content-type handling, scope propagation, and legacy overrides. | Audit all sibling security classes and downstream compatibility before editing; use a final protocol-semantics critique. | Use a table-driven scheme matrix and explicit expected headers/statuses; retrieve migration notes for behavior-changing fixes. |
| **Dependency injection & function/annotation handling** — `fastapi_14485` | Understand runtime annotation formats, static-only imports, signature evaluation, generator scopes, and dependency teardown. Test postponed annotations, `TYPE_CHECKING`, parameter and return annotations, and genuine unresolved names. | Trace annotation values through inspection and DI; evaluate whether fallback behavior masks real errors. | Retrieve the guarded-signature pattern and focused fixtures; keep exception handling narrow and use prebuilt annotation scenarios. |
| **Errors & developer experience** — `fastapi_14306` | Propagate structured diagnostic context without changing validation behavior. Test HTTP, WebSocket, sub-applications, partial context, absent context, and stable error formatting. | Trace context across application layers and weigh usefulness against message compatibility and information exposure. | Use a context-schema plus snapshot matrix; add optional fields incrementally and test absent/partial cases first. |
| **Pydantic, models & type handling** — `fastapi_14512` | Preserve semantics through annotation → `FieldInfo` → field → `TypeAdapter` transformations. Test runtime validation and schema generation, discriminated `oneOf`, both `Body()` declaration styles, and supported Pydantic versions. | Inspect metadata at every transformation stage and compare clean versus reused field objects; handle multi-file adapter repairs. | Retrieve a clean-field reconstruction pattern and Cat/Dog-style discriminated-union fixtures; require schema and validation oracles. |
| **Compatibility, deprecations & warnings** — `fastapi_14609` | Represent migration timelines, supported dependency combinations, warnings, and removal stages. Test current supported behavior and ensure expired compatibility paths are not resurrected from old examples. | Analyze ecosystem blast radius and documentation/migration impacts; distinguish temporary adapters from permanent contracts. | Use an explicit version-support table and retrieval cutoff; reject fixes that depend on unsupported legacy namespaces. |

### 4.2 HTTP client & protocol handling — Requests and HTTPX

| Subcategory and seed case | Brain capability and executable oracle | 31B policy | E4B policy |
|---|---|---|---|
| **Protocol typing & duck-type compatibility** — `requests_7505` | Distinguish runtime protocols from dynamic proxies. Test a `__getattr__` read proxy with iteration unavailable and audit every protocol-based dispatch path. | Search globally for inconsistent `isinstance` assumptions and reason about type narrowing plus runtime behavior. | Apply the shared `isinstance(...) or hasattr(...)` capability helper through a checklist; use the proxy fixture to prevent iterable fallback. |
| **Request bodies, file wrappers & content length** — `requests_7502` | Understand multipart dispatch, streaming, encoded-byte length, and framing. Oracles inspect the actual body and `Content-Length` for wrappers, streams, ASCII, and non-ASCII strings. | Trace end-to-end body construction and dependency interaction across all preparation paths. | Use a body-type × encoding fixture matrix and reuse the common readability helper; prohibit patches that only fix one multipart branch. |
| **URLs, paths & proxy boundary handling** — `requests_7427` | Separate string suffixes from DNS domain boundaries and preserve path semantics. Test exact host, true subdomain, deceptive suffix, leading dot, port-specific entries, and leading slashes. | Treat proxy matching as a security boundary and audit canonicalization order plus downstream effects. | Generate a deterministic truth table before editing; implement the established exact/subdomain/port rules rather than improvising regexes. |
| **Redirects & connection/stream lifecycle** — `requests_7328` | Model response history and connection ownership as object graphs. Walk every response in a multi-redirect chain and assert no self-reference or cycles; test stream cleanup where applicable. | Reason about mutation order, shared lists, and cross-library lifecycle behavior; inspect intermediate objects, not only the final response. | Use a copy-before-append checklist and graph assertions; retrieve a three-redirect fixture and bounded stream-cleanup tests. |
| **Response parsing & exception serialization** — `requests_6629` | Understand parser failures, multiple-inheritance MRO, exception constructors, and pickle boundaries. Round-trip exceptions through a process pool and verify type, `doc`, `pos`, and representation. | Trace MRO and serialization protocols; test the actual cross-process consumer rather than only local raising. | Retrieve the explicit `__reduce__` and process-pool fixture; use constructor-argument preservation as a fixed checklist. |
| **Authentication configuration** — `requests_7205` | Distinguish container truthiness from usable credentials and understand `.netrc` machine/default fallback. Test valid machine entries, empty defaults, unrelated hosts, and absence of leaked auth. | Audit configuration precedence and side effects across host selection and session auth. | Apply the semantic-validity guard pattern and a fixture containing both valid and empty entries; require a no-auth negative assertion. |
| **Dependency compatibility & HTTP constants** — `requests_6757` | Encode dependency-specific wire behavior and protocol constants. Run a urllib3 1.x/2.x matrix, compare encoded-byte lengths, and verify constants map to the intended protocol semantics. | Design and critique version adapters and CI coverage; inspect behavior rather than version numbers alone where possible. | Use a version-gated helper and precomputed expected lengths; do not claim matrix support without executing both jobs. |

### 4.3 Terminal UI & text rendering — Rich

| Subcategory and seed case | Brain capability and executable oracle | 31B policy | E4B policy |
|---|---|---|---|
| **Import-time performance** — `rich_4070` | Build an import dependency graph and move work to feature execution without changing behavior. Measure import time against a recorded baseline and run tests that monkeypatch deferred modules. | Coordinate multi-module lazy imports and inspect circular-import/test-seam effects; require measured before/after evidence. | Defer one dependency group at a time using an import-profile report; never invent a speedup and rerun affected monkeypatch tests after each edit. |
| **Terminal detection, ANSI & console I/O** — `rich_3468` | Model terminal capabilities, environment flags, capture, escape sequences, broken consumers, and interpreter shutdown. Use a real subprocess pipeline and assert no secondary shutdown traceback. | Reason across OS/process state and output buffering; choose process-level oracles for process-level bugs. | Retrieve a broken-pipe state machine and subprocess fixture; avoid in-memory-only tests and free-form platform changes. |
| **Markdown & markup parsing/rendering** — `rich_3130` | Treat parser output as cumulative text plus spans, not isolated strings. Test nested bold/italic/strikethrough/links in table cells, escaping, and all justifications. | Trace token-to-renderable state transitions and audit destructive assignments across sibling parsers. | Apply the append-not-replace rule with token fixtures; compare both plain text and style spans. |
| **Unicode, graphemes & cell-width segmentation** — `rich_4006` | Separate code-point progress, grapheme boundaries, and terminal-cell width. Use bounded tests for ESC, ZWJ, variation selectors, repeated zero-width input, wrapping, and full index coverage. | Derive and property-test segmentation invariants; compare adversarial and ordinary Unicode behavior. | Retrieve an adversarial corpus and explicit progress/span assertions; prohibit one-character special cases and unbounded reproducers. |
| **Tables, panels & visual layout** — `rich_3935` | Convert layout into width equations covering content, collapsed padding, edges, and justification. Assert exact output for first/last columns and fixed-width grids. | Derive the general padding calculation and audit related panel/table edge paths. | Use an edge-condition truth table and golden spacing outputs, including the three-column collapsed-padding case. |
| **Live displays, progress & prompts** — `rich_3882` | Track console defaults versus per-call rendering intent and live-display state. Test `markup=False`, invalid prompt input, plain expected error text, and non-default console configurations. | Inspect configuration propagation and distinguish library-authored markup from user-controlled text. | Use an options matrix and explicit per-call rendering flags; keep changes local and golden-test the prompt transcript. |
| **Tracebacks, introspection & object representation** — `rich_3772` | Traverse exception and object graphs defensively. Test self-cause, repeated/cyclic exception groups, safe string conversion, and termination with locals enabled. | Design visited/self guards while preserving cause/group structure and diagnostic completeness. | Retrieve graph-traversal guard templates and bounded regression tests; require successful termination, not merely a timeout exception. |
| **Syntax highlighting & URL recognition** — `rich_3454` | Validate complete token spans and boundary characters. Test URLs containing `@`, punctuation, fragments, query strings, and adjacent text. | Audit regex interaction and highlighting spans across related recognizers; check for overmatching as well as undermatching. | Use golden span fixtures and minimal character-class edits; success requires the entire intended span, not partial highlighting. |
| **Text & style data-structure internals** — `rich_3480` | Detect source/destination aliasing and mutation during iteration. Test `append` and `append_text` with self-input, exact duplicated text, and finite span counts. | Audit related methods for shared assumptions and choose the narrowest snapshot/ownership correction. | Apply the stable-snapshot pattern to both methods and run self-alias fixtures before considering any broader refactor. |
| **Export & output formats** — `rich_3043` | Separate document grammar, content escaping, styles, and file output. Validate `<html>/<head>/<body>` order, inline/class styles, links, escaped markup, and saved output. | Use structural parsers plus golden tests across export variants and inspect interactions among template features. | Retrieve template and golden-output fixtures; make minimal structural edits and run every export variant. |

## 5. Training-data engine

### 5.1 Use the CSV as a taxonomy, not automatic training permission

Unless the rules explicitly permit it, do not train on evaluation instances, their reference patches, or near-duplicates. Use the CSV to define coverage and build disjoint historical tasks. For every collected task, record repository, base commit, issue/PR identifiers, patch hash, dates, and textual similarity so leakage can be audited.

Use three splits:

1. **Time split:** train on older tasks and validate on later tasks.
2. **Repository split:** hold out selected repositories or major subsystems to test transfer.
3. **Skill split:** leave out some examples from each playbook and, for a harder generalization test, leave out an entire subcategory during training.

All patches and tests must come from the same pre-fix repository snapshot. Never let the agent see the reference patch during solution generation.

### 5.2 What one training example should contain

```text
Task metadata
  repository, base commit, issue statement, allowed dependencies
Taxonomy
  primary/secondary skill, failure signature, invariant, risk flags
Initial observation
  repository map, failing test or minimal reproducer
Action trajectory
  searches, reads, probes, edits, tests, and concise evidence updates
Recovery events
  wrong hypothesis, failed command, test regression, and corrective action
Outcome
  final diff, executed tests, resolved/not resolved, regressions, resource use
Verification
  independent test result and contamination/deduplication status
```

A final-patch-only dataset teaches the answer shape but not localization, evidence gathering, or recovery. Keep those intermediate actions.

### 5.3 Data balancing

Raw sampling would overrepresent FastAPI and underrepresent singleton subcategories. Balance by **skill first, difficulty second**:

- ensure every playbook has verified positive trajectories;
- add hard negatives and boundary cases for singleton skills;
- include cross-skilled tasks so the router learns multi-label behavior;
- preserve a separate naturally distributed validation set for realistic operating metrics; and
- use a macro-averaged validation score so aggregate volume cannot hide a dead skill.

For E4B, prioritize high-quality, short, verified trajectories over a larger number of noisy long trajectories. For 31B, retain harder cross-file and recovery episodes.

### 5.4 Verified teacher distillation

A practical cross-track pipeline is:

1. Run the 31B agent on permitted training tasks.
2. Keep only trajectories whose final patch passes independent verification.
3. Compress each trajectory into observable actions, concise evidence, the failing probe, the corrective decision, and the final oracle.
4. Generate counterfactual examples from rejected hypotheses: what evidence ruled them out and what the next action should have been.
5. Train E4B on these compressed traces, not on unverified teacher prose or private reasoning.
6. Re-run E4B on held-out tasks and feed its verified recoveries back into the case library.

This transfers a **repair policy** while avoiding the assumption that a smaller model can reproduce the teacher’s full reasoning capacity.

### 5.5 Negative and adversarial data

Include examples that teach the model not to:

- edit tests to make a failure disappear;
- patch only the reported path while sibling paths retain the same defect;
- return success without running the relevant oracle;
- treat an empty container as semantically valid data;
- special-case one literal from the issue;
- mutate shared caches or history objects;
- use an API from an unsupported dependency version;
- broaden a one-line repair into an unrelated refactor; or
- continue iterating after the budget has stopped producing new evidence.

## 6. Model adaptation plan

### Stage A — Base-model baseline

Before tuning, measure both instruction-tuned checkpoints with the same tools, playbook retrieval disabled, and a fixed budget. Then add the deterministic controller and verifier without changing weights. This separates gains from scaffolding versus training.

Test thinking on/off as an ablation. Native support for thinking or function calling does not establish that either improves repository-repair success under a fixed budget.

### Stage B — Tool and state supervision

Fine-tune first for:

- valid tool names and complete arguments;
- correct state transitions;
- evidence recording after commands;
- no premature `finish` actions; and
- concise, machine-checkable summaries.

Use the official chat template and tool format. QLoRA is a sensible first experiment for both tracks; Google provides a Gemma 4 QLoRA workflow using Transformers, TRL, and PEFT. [Official QLoRA guide](https://ai.google.dev/gemma/docs/core/huggingface_text_finetune_qlora)

### Stage C — Skill-policy SFT

Train on verified trajectories balanced across the 27 playbooks. Loss should emphasize actions and concise evidence updates rather than long narrative explanations.

- **31B:** include ambiguous localization, multi-hypothesis comparison, cross-file patches, and critic/recovery episodes.
- **E4B:** emphasize router confirmation, evidence-packet use, local repair operators, and bounded recovery.

Start with one unified adapter per model. Only split E4B into three domain adapters if measured cross-domain interference outweighs the additional routing complexity; do not begin with 27 sparsely trained adapters.

### Stage D — Preference or execution-based optimization

After SFT, construct pairs from the same initial task:

- verified minimal repair versus plausible but failing repair;
- fail-before/pass-after test addition versus no meaningful oracle;
- focused patch versus unnecessary broad refactor; and
- evidence-based recovery versus repetitive tool use.

Use preference optimization or execution-guided reinforcement only if the base SFT agent has stable tool behavior. Reward must require independent test success and penalize test modification, regression, invalid final states, and budget abuse. A model must never receive a success reward solely for claiming that tests pass.

### Stage E — Quantization and serving validation

Evaluate the exact quantized deployment artifact, not only the training checkpoint. Compare structured-call validity, localization, final resolve rate, and long-context degradation for each supported quantization. Include KV cache, test-runner processes, repository indexes, and tool output in the memory budget.

## 7. Verification and evaluation

### 7.1 Definition of a resolved task

A task counts as **verified resolved** only when:

1. the original failure is reproduced or a precise pre-fix oracle is established;
2. the final patch changes that oracle to pass;
3. relevant existing tests pass without weakening or deleting assertions;
4. the diff contains no unrelated changes;
5. compatibility constraints are preserved; and
6. an independent final run starts from a clean checkout plus only the submitted patch.

Model confidence, a plausible diff, or a targeted test that was never run is not resolution.

### 7.2 Metrics that matter

| Metric group | Measures |
|---|---|
| Effectiveness | Micro resolve rate, macro resolve rate across 27 skills, repository-held-out resolve rate, time-held-out resolve rate |
| Correctness quality | Reproduction validity, regression rate, sibling-path coverage, independent clean-run success |
| Agent behavior | Tool-call validity, localization accuracy, premature-finish rate, repeated-action rate, recovery success |
| Patch quality | Files/hunks changed, unrelated edits, test modifications, reviewer-flagged compatibility risks |
| Efficiency | Model calls, input/output tokens, wall time, command count, peak memory, cost per verified resolution |
| Robustness | Quantized versus unquantized delta, timeout rate, long-context degradation, behavior under tool/test failure |

Use macro resolve rate as a primary internal selection metric and micro resolve rate as a secondary metric. Otherwise the 67 FastAPI tasks can conceal failures in smaller categories.

### 7.3 Required ablations

Run the same held-out suite for:

1. base model alone;
2. base model plus tools;
3. tools plus generic controller;
4. controller plus 27 playbooks;
5. controller plus verified case retrieval;
6. SFT/QLoRA;
7. critic and recovery additions;
8. thinking on/off and different budget caps; and
9. deployment quantization.

For 31B, additionally ablate multiple hypotheses and independent critic calls. For E4B, ablate router accuracy, evidence-packet size, distilled recovery data, and number of permitted repair loops.

### 7.4 Failure taxonomy

Every failed episode should receive one primary failure label:

- wrong skill route;
- failed reproduction;
- wrong localization;
- correct hypothesis, incorrect patch;
- incomplete sibling-path audit;
- inadequate test oracle;
- regression introduced;
- invalid tool sequence;
- context loss or stale state;
- budget exhaustion or repetitive loop; and
- verifier/repository infrastructure failure.

Route model-repair failures into training data and infrastructure failures into harness fixes. Do not mix them.

## 8. Delivery roadmap and exit gates

### Phase 0 — Rules, threat model, and measurement contract

**Build:** Rules checklist, allowed-data policy, sandbox, timeout model, clean-patch verifier, metric definitions.  
**Exit when:** The exact training and inference configuration is known to be permitted and the evaluator cannot reward test weakening or false success claims.

### Phase 1 — Shared harness and no-training baseline

**Build:** Tool contract, repository index, state object, bounded controller, final verifier, per-skill dashboard.  
**Exit when:** Both models can complete valid episodes and every failure is attributable through the taxonomy.

### Phase 2 — Complete but shallow 27-playbook brain

**Build:** All playbooks above with triggers, probes, invariants, repair operators, oracles, anti-patterns, and seed cases.  
**Exit when:** Every playbook has at least one disjoint development fixture and the router has a generic fallback. Do not deepen only the popular categories before all 27 exist.

### Phase 3 — Data engine and verified memory

**Build:** Historical task collector, snapshot restore, deduplication, trajectory schema, independent verifier, teacher-trace compression.  
**Exit when:** Every training trajectory is reproducible, allowed, deduplicated, and independently labeled resolved or unresolved.

### Phase 4 — Track-specific SFT and distillation

**Build:** 31B long-horizon SFT; E4B concise-trace distillation; unified adapters; quantized evaluation artifacts.  
**Exit when:** Each tuned track beats its own strongest no-training scaffold baseline on macro and clean-run resolve rates, not merely on tool syntax.

### Phase 5 — Verification-guided recovery

**Build:** Hypothesis comparison for 31B, failure-classified recovery for E4B, adversarial negative training, test-selection improvements.  
**Exit when:** Recovery improves held-out resolution without unacceptable regression, timeout, or token growth.

### Phase 6 — Budget and deployment optimization

**Build:** Context compression, cache reuse, test selection, stopping policy, quantized serving, memory telemetry.  
**Exit when:** Both tracks meet verified resource limits with margin, and E4B’s efficiency gain does not come from silently skipping required verification.

### Phase 7 — Final hardening

**Build:** Clean-room rerun, contamination audit, per-skill sign-off, deterministic packaging, fallback configuration, failure report.  
**Exit when:** Final artifacts reproduce the reported scores from clean snapshots and no subcategory has an unexplained systemic failure.

## 9. Recommended build order under limited resources

1. **Harness and verifier first.** A weak model with trustworthy evaluation yields useful data; a strong model with false success labels does not.
2. **Generic loop plus all 27 shallow playbooks.** Establish macro coverage before optimizing the average case.
3. **High-value invariant libraries.** Prioritize lifecycle ordering, raw/normalized data mapping, state ownership, graph cycles, iterator progress, and dependency-version matrices.
4. **31B teacher only after independent verification exists.** Otherwise errors are distilled at scale.
5. **E4B distillation focused on short decisions and recovery.** Do not spend the small model’s capacity reproducing repository information that tools can retrieve.
6. **Deepen skills by measured failure frequency and cost.** Use the dashboard, not intuition or raw category size alone.
7. **Tune stopping as aggressively as patching.** Repetitive exploration can consume the budget needed for verification.

## 10. What success looks like for each track

### 31B track

The 31B agent should earn its advantage on ambiguous, cross-file problems: asynchronous cleanup, Starlette lifecycle compatibility, OpenAPI state isolation, Pydantic metadata preservation, dependency-version adapters, and exception/object graphs. It should compare hypotheses, audit siblings, and stop after sufficient evidence. If it wins only on mechanical one-line fixes while consuming much more budget, the track is not using the model well.

### E4B track

The E4B agent should become highly reliable on localized, invariant-driven problems: empty form values, duck-typed wrappers, proxy boundaries, redirect-history ordering, empty `.netrc` entries, prompt markup, URL spans, self-append, table padding, and HTML structure. It should remain functional on harder tasks through retrieval and bounded recovery, but its design goal is the best verified resolution per unit of compute—not imitation of 31B deliberation.

## 11. Core principle

The durable asset is not a collection of answers to 129 tasks. It is a **verified repair operating system**:

```text
Observable requirements
+ explicit invariants
+ falsifiable hypotheses
+ small repair operators
+ executable oracles
+ verified episodic memory
+ budget-aware recovery
```

The 31B and E4B checkpoints are interchangeable reasoning engines inside that system to only a limited extent. The shared tools, playbooks, data schema, and verifier should remain common; the reasoning depth, context policy, recovery strategy, and training distribution should be deliberately different.

## Official technical references

- [Gemma 4 model card](https://huggingface.co/google/gemma-4-31B-it)
- [Gemma 4 technical report](https://arxiv.org/pdf/2607.02770)
- [Gemma 4 model overview and inference-memory estimates](https://ai.google.dev/gemma/docs/core)
- [Function calling with Gemma 4](https://ai.google.dev/gemma/docs/capabilities/text/function-calling-gemma4)
- [Gemma 4 QLoRA fine-tuning guide](https://ai.google.dev/gemma/docs/core/huggingface_text_finetune_qlora)


---

<!-- ====================================================================== -->
<!-- FILE: 02_gemma4-representative-issues-2026-11-02.md -->
<!-- ====================================================================== -->

# Representative Upstream Issues in the Gemma 4 Developer Agent Dataset

**Research scope:** The 129 tasks in `gemma4_task_classification.csv`, covering FastAPI, Requests, HTTPX, and Rich  
**As of:** 2026-11-02  
**Deliverable:** One deeply analyzed representative for every technical category–subcategory pair, with the remaining dataset rows retained as supporting context

## Executive summary

The CSV contains **129 problem instances across 3 technical categories and 27 category–subcategory pairs**: 67 FastAPI tasks, 48 Rich tasks, 13 Requests tasks, and 1 HTTPX task. This report selects 27 representative upstream issues or pull requests and analyzes their symptoms, root causes, fixes, compatibility implications, regression tests, and lessons for a developer agent.

The dominant finding is that these are not primarily exercises in generating a plausible-looking line of code. They test whether an agent can preserve a library’s contracts at boundaries:

- **Time and lifecycle boundaries.** FastAPI’s streaming fix shows that returning a response object is not the same as finishing response consumption; cleanup moved too early and closed resources still needed by the stream.
- **Representation boundaries.** FastAPI’s `Annotated`/`Body()` discriminated-union fix and Requests’ file-wrapper fixes involve metadata or capabilities being lost when one abstraction is translated into another.
- **Boundary values.** Empty HTML form fields, empty `.netrc` entries, leading dots in proxy rules, zero-width graphemes, self-referential objects, and malformed exception graphs all expose assumptions that ordinary happy-path tests miss.
- **Shared mutable state.** OpenAPI schema caching, redirect history, and `Text.append(text)` demonstrate how aliasing can create cross-request contamination, cycles, or non-terminating iteration.
- **Dependency and language evolution.** FastAPI’s Starlette lifecycle compatibility work, Requests’ urllib3 1.x/2.x handling, and annotation-evaluation fallbacks require preserving public behavior while internals or dependencies change.
- **Security and protocol semantics are part of routine maintenance.** Swagger UI escaping, `no_proxy` domain matching, and authentication status codes are not just cosmetic fixes; they change trust boundaries or interoperability behavior.
- **Regression tests must assert invariants.** The strongest tests do more than snapshot output: they verify that history contains only predecessors, grapheme spans cover every index without gaps, cleanup happens after streaming, and an operation terminates.

For a developer agent, the recurring successful workflow is: reproduce the boundary condition, identify the invariant that was violated, make the smallest change that restores it across all relevant code paths, and add a regression test that would fail for the original reason—not merely a test that exercises the edited function.

## 1. Dataset profile and research method

### 1.1 Coverage map

| Repository | Rows | Role in this report |
|---|---:|---|
| `fastapi/fastapi` | 67 | Web framework & API development |
| `Textualize/rich` | 48 | Terminal UI & text rendering |
| `psf/requests` | 13 | HTTP client & protocol handling |
| `encode/httpx` | 1 | Supporting instance in HTTP client & protocol handling |
| **Total** | **129** | **27 category–subcategory pairs** |

The work-intent labels are dominated by bug fixes (86), followed by new features (21), enhancement/hardening/developer experience (7), deprecation/removal/dependency maintenance (6), refactor/internal compatibility (4), documentation/examples (3), project tooling/automation (1), and performance optimization (1). The selected examples deliberately include the smaller intents so the report does not reduce the dataset to bug fixing alone.

### 1.2 Selection and evidence strategy

One primary example was selected for each subcategory using four criteria:

1. a clear user-visible symptom or design requirement;
2. an identifiable root cause rather than only a title;
3. an upstream final diff and, where available, regression tests; and
4. relevance to other rows in the same subcategory.

Primary evidence was prioritized in this order: upstream issue report, final PR diff, tests in that diff, official documentation, and release notes. PR-page prose was not relied on when extraction was inconsistent. Related instance IDs are listed under every case so that all 129 rows remain visible in the coverage map; the related rows are supporting examples, not claims that each received an equally deep independent audit.

## 2. Web framework & API development — FastAPI (67 rows)

### Category synthesis

The FastAPI tasks cluster around framework contracts rather than endpoint business logic. The hard problems arise where FastAPI mediates among user functions, Starlette’s ASGI lifecycle, Pydantic’s model metadata, Python’s annotation semantics, OpenAPI generation, and HTTP security conventions. A correct local function can still be wrong if cleanup runs at the wrong phase, metadata is discarded during conversion, shared schema state is mutated, or a dependency’s private API disappears.

### 2.1 Documentation & project automation (3 rows)

**Representative:** [`fastapi_15661` — FastAPI PR #15661, “Automate release preparation”](https://github.com/fastapi/fastapi/pull/15661)  
**Related dataset rows:** `fastapi_14492`, `fastapi_14487`

**Problem and scope.** This is the representative non-runtime task: release preparation itself is software, with inputs, validation rules, failure modes, and automation permissions. Manual preparation can produce inconsistent version updates, malformed release-note sections, or mismatches among a release PR, tag, draft release, and publication event.

**Fix and verification.** The PR adds `scripts/prepare_release.py`, implemented as a Typer CLI with `prepare`, `current-version`, and `release-notes` commands. It parses and bumps semantic versions, validates version and release-note structure, and supports CLI arguments and environment-based configuration. The accompanying GitHub Actions work adds manually dispatched release preparation, a release-labelled PR flow, draft-release creation, and changes the publishing trigger from release `created` to `published`. Tests cover version increments, duplicate or empty release sections, and command/environment inputs. [PR #15661 and its tests](https://github.com/fastapi/fastapi/pull/15661/files)

**Why it is representative.** An agent must understand operational state transitions, not just application code. The important test oracle is whether the workflow fails closed on malformed release metadata and whether automation runs at the intended event. The sibling documentation rows reinforce a related constraint: examples and error-handling guidance are also user-facing contracts, especially when insecure example code could disclose validation input.

### 2.2 Responses, SSE & streaming (7 rows)

**Representative:** [`fastapi_14099` — FastAPI PR #14099, streaming responses with dependencies using `yield` or `UploadFile`](https://github.com/fastapi/fastapi/pull/14099)  
**Related dataset rows:** `fastapi_15588`, `fastapi_15030`, `fastapi_14962`, `fastapi_14964`, `fastapi_15023`, `fastapi_9425`

**User-visible problem.** A streaming response could attempt to read an uploaded file or use a dependency-provided resource after that resource had already been closed, producing errors such as `ValueError: I/O operation on closed file`. The original report is [FastAPI issue #10857](https://github.com/fastapi/fastapi/issues/10857).

**Root cause.** Before FastAPI 0.118.0, exit code in a dependency with `yield` ran after the path operation returned but before the response was sent. That optimization released resources early, but a `StreamingResponse` is consumed asynchronously after it is constructed. The resource lifetime therefore ended before the stream’s actual work was complete. [Official advanced-dependency documentation](https://fastapi.tiangolo.com/advanced/advanced-dependencies/)

**Fix and verification.** The PR introduces FastAPI-specific `AsyncExitStackMiddleware` so dependency cleanup is deferred until response delivery is complete. Regression coverage streams from a dependency-provided session, making cleanup ordering—not merely successful response construction—the tested behavior. FastAPI 0.121.0 later added `Depends(scope="function")` for deliberate early cleanup; the default `scope="request"` retains cleanup after the response. [PR #14099](https://github.com/fastapi/fastapi/pull/14099/files), [lifecycle documentation](https://fastapi.tiangolo.com/advanced/advanced-dependencies/)

**Why it is representative.** The agent must reason about asynchronous phases and ownership. A unit test that only calls the endpoint function would miss the bug; verification must consume the stream and observe when cleanup occurs.

### 2.3 Parameter & request-body parsing (8 rows)

**Representative:** [`fastapi_13537` — empty HTML form fields should honor missing/default semantics](https://github.com/fastapi/fastapi/pull/13537)  
**Related dataset rows:** `fastapi_15589`, `fastapi_14360`, `fastapi_14356`, `fastapi_14371`, `fastapi_14303`, `fastapi_14616`, `fastapi_11194`

**User-visible problem.** Browsers submit some untouched optional controls as empty strings. For an optional integer form field whose default is `None`, the empty field could overwrite the normalized missing value and produce validation behavior inconsistent with the endpoint declaration.

**Root cause and fix.** After body-field processing produced `values`, the old merge logic copied a raw received value back whenever `key not in values`. That condition treated a normalized value as though the field had not been processed, restoring `""`. The fix computes `field_aliases = {field.alias for field in body_fields}` and copies only received keys that are not declared body-field aliases. Unknown/extra values can still pass through without overwriting known fields. [PR #13537 diff](https://github.com/fastapi/fastapi/pull/13537/files)

**Verification.** Tests submit empty strings for optional integer fields through both URL-encoded and multipart forms and expect `None`. This is important because the two form encodings share semantics but take different parsing paths.

**Why it is representative.** The subcategory also contains alias, extra-parameter-list, header-underscore, JSON-list, and `File`-after-`Form` cases. All require distinguishing the raw wire mapping from the normalized model mapping. The agent must test declared fields, aliases, defaults, and extras together rather than treating parsing as a simple dictionary update.

### 2.4 Routing, application APIs & lifecycle (8 rows)

**Representative:** [`fastapi_14851` — reimplement `on_event` for Starlette compatibility while preserving FastAPI behavior](https://github.com/fastapi/fastapi/pull/14851)  
**Related dataset rows:** `fastapi_15280`, `fastapi_14258`, `fastapi_14873`, `fastapi_15800`, `fastapi_15785`, `fastapi_15763`, `fastapi_15745`

**Problem and root cause.** Starlette removed legacy startup/shutdown support and private helpers on which FastAPI relied. A simple dependency upgrade could therefore break FastAPI’s application and router lifecycle APIs even when user code had not changed.

**Fix and verification.** FastAPI vendors the needed `_AsyncLiftContextManager` and `_wrap_gen_lifespan_context` behavior, adds `_DefaultLifespan`, stores `on_startup` and `on_shutdown` handlers locally, and implements `_startup`, `_shutdown`, and `add_event_handler`. The public `on_event` API remains deprecated but backward compatible. Tests cover asynchronous shutdown and synchronous/asynchronous generator lifespan contexts. [PR #14851](https://github.com/fastapi/fastapi/pull/14851/files)

**Why it is representative.** Compatibility work often means owning an adapter rather than deleting a public API when an upstream dependency changes. The correct solution preserves lifecycle ordering and both sync and async forms; merely making imports succeed would be insufficient. The sibling rows extend the same theme to router identity, route introspection, self-inclusion errors, and path edge cases.

### 2.5 OpenAPI, JSON Schema & schema metadata (7 rows)

**Representative:** [`fastapi_14986` — refactor OpenAPI/Swagger UI data handling and escaping](https://github.com/fastapi/fastapi/pull/14986)  
**Related dataset rows:** `fastapi_14463`, `fastapi_14459`, `fastapi_14455`, `fastapi_14266`, `fastapi_13713`, `fastapi_14791`

**Two coupled problems.** First, request-specific `root_path` handling could mutate shared server state or cached schema data, allowing path prefixes to persist or accumulate across requests. Second, JSON embedded directly in Swagger UI `<script>` blocks was not HTML-safe, so markup-significant characters could change the surrounding document rather than remain data.

**Fix and verification.** The root-path handling creates a per-request schema copy only when necessary and leaves configured servers untouched. The PR also introduces an HTML-safe JSON serializer that escapes `<`, `>`, and `&` as Unicode escapes after `json.dumps`. Tests cover spoofed root paths, accumulation across requests, server-list immutability, and payloads containing `</script><script>` or HTML injection text. [PR #14986](https://github.com/fastapi/fastapi/pull/14986/files)

**Why it is representative.** A refactor can conceal both state-isolation and output-encoding security work. Correct JSON encoding alone is not automatically safe embedding in an HTML script context, and a cache optimization must not turn per-request data into shared mutable state. Other rows in this subcategory similarly require preserving security scopes, references, and validation metadata through schema transformations.

### 2.6 Authentication & request security (4 rows)

**Representative:** [`fastapi_13786` — use `401` when security credentials are missing](https://github.com/fastapi/fastapi/pull/13786)  
**Related dataset rows:** `fastapi_14978`, `fastapi_14786`, `fastapi_5624`

**User-visible problem.** Security utilities commonly returned `403 Forbidden` for missing credentials. The distinction matters: `401 Unauthorized` signals failed or absent authentication and can be paired with `WWW-Authenticate`, while `403` ordinarily means the server understood the request but refuses authorization. The motivating report is [FastAPI issue #10177](https://github.com/fastapi/fastapi/issues/10177).

**Fix and compatibility impact.** The PR standardizes missing-credential responses and appropriate `WWW-Authenticate` headers across API-key, HTTP Basic/Bearer/Digest, OAuth2, and OpenID Connect utilities. It adds overridable `make_not_authenticated_error()` methods and documents how to restore legacy `403` behavior. The change was released in FastAPI 0.122.0. [PR #13786](https://github.com/fastapi/fastapi/pull/13786/files), [FastAPI release notes](https://fastapi.tiangolo.com/release-notes/)

**Why it is representative.** A standards-correct fix can still break downstream tests and clients that encoded the old behavior. An agent must update all security schemes consistently, preserve a migration path, and avoid silently conflating authentication with authorization. Related tasks on strict JSON content types, credential whitespace, and hierarchical scopes show that security correctness often lives in small parsing and propagation details.

### 2.7 Dependency injection & function/annotation handling (13 rows)

**Representative:** [`fastapi_14485` — support annotations imported only under `TYPE_CHECKING`](https://github.com/fastapi/fastapi/pull/14485)  
**Related dataset rows:** `fastapi_13920`, `fastapi_14794`, `fastapi_14372`, `fastapi_11355`, `fastapi_14458`, `fastapi_14448`, `fastapi_9753`, `fastapi_5077`, `fastapi_9555`, `fastapi_14419`, `fastapi_14301`, `fastapi_14262`

**Problem and root cause.** With postponed annotations, a type imported only inside `if TYPE_CHECKING:` is available to static analysis but absent at runtime. Calling `inspect.signature(call, eval_str=True)` then raises `NameError` while FastAPI is inspecting an endpoint or dependency. The failure occurs during framework introspection, before ordinary endpoint logic can run.

**Fix and verification.** Signature acquisition is centralized with a fallback: first call `inspect.signature(call, eval_str=True)`, catch `NameError`, then call `inspect.signature(call)` without string evaluation. Both parameter and return-annotation processing use the fallback. A regression test combines `from __future__ import annotations` with an `AsyncGenerator` imported only under `TYPE_CHECKING`. [PR #14485](https://github.com/fastapi/fastapi/pull/14485/files)

**Why it is representative.** Python annotations can be values, forward references, or strings depending on language version and evaluation mode; [Python’s `annotationlib` documentation](https://docs.python.org/3/library/annotationlib.html) makes those formats explicit. A blanket fallback can hide real name errors, so the regression test and limited recovery point matter. The agent must preserve useful runtime evaluation where possible while supporting static-only types.

### 2.8 Errors & developer experience (2 rows)

**Representative:** [`fastapi_14306` — include endpoint context in validation errors](https://github.com/fastapi/fastapi/pull/14306)  
**Related dataset row:** `fastapi_14479`

**Problem.** Validation errors can identify invalid fields without identifying which endpoint caused the failure. In large applications, mounted sub-applications, or WebSocket handlers, that omission makes logs difficult to act on.

**Fix and verification.** The PR adds `EndpointContext`, a `TypedDict` with optional `function`, `path`, `file`, and `line` fields. `ValidationException` accepts `endpoint_ctx`, and validation-error strings include the available endpoint metadata. Tests cover HTTP, WebSocket, sub-application, partial-context, and no-context cases. [PR #14306](https://github.com/fastapi/fastapi/pull/14306/files)

**Why it is representative.** The correct behavior is improved diagnosis without changing validation semantics. Partial and absent context are explicit test cases, so the diagnostic enhancement does not itself become a new failure mode. A developer agent should treat error messages as an interface: add actionable location information while keeping output stable and safe for contexts that cannot supply it.

### 2.9 Pydantic, models & type handling (11 rows)

**Representative:** [`fastapi_14512` — discriminated unions inside `Annotated`/`Body()`](https://github.com/fastapi/fastapi/pull/14512)  
**Related dataset rows:** `fastapi_12942`, `fastapi_14349`, `fastapi_14482`, `fastapi_14430`, `fastapi_14361`, `fastapi_13207`, `fastapi_14246`, `fastapi_14186`, `fastapi_14297`, `fastapi_14953`

**Problem and root cause.** Discriminator metadata could be lost or mishandled when FastAPI reused an existing Pydantic `FieldInfo` while adapting types declared through `Annotated` and `Body()`. Validation and generated schema could then treat the union as an ordinary `anyOf` rather than the intended discriminated `oneOf`.

**Fix and verification.** The fix reconstructs a clean Pydantic `Field` from extracted attributes before creating the `TypeAdapter`, avoiding contaminated or incomplete metadata reuse. It includes a compatibility implementation of `asdict` for Pydantic versions before 2.12.3. Cat/Dog regression models use `Tag` and a callable `Discriminator`, exercise both assignment-style `Body()` and `Annotated[..., Body()]`, and assert discriminated `oneOf` schema output. [PR #14512](https://github.com/fastapi/fastapi/pull/14512/files)

**Why it is representative.** Framework adapters must preserve semantics across multiple metadata containers, not merely copy the annotation object. The tests check both runtime validation and schema generation because those can diverge. The correct agent behavior is to trace the complete annotation-to-field-to-adapter pipeline and verify every supported declaration style.

### 2.10 Compatibility, deprecations & warnings (4 rows)

**Representative:** [`fastapi_14609` — drop `pydantic.v1` support](https://github.com/fastapi/fastapi/pull/14609)  
**Related dataset rows:** `fastapi_14077`, `fastapi_14605`, `fastapi_14583`

**Migration sequence.** FastAPI 0.119.0 temporarily supported Pydantic v2 models and `pydantic.v1` models together to ease migration. FastAPI 0.126.0 dropped direct Pydantic v1 support while briefly retaining the `pydantic.v1` compatibility namespace; 0.127.0 added deprecation warnings for that namespace; and 0.128.0 removed `pydantic.v1` support through PR #14609. The release notes also state that Pydantic v1 is unsupported on recent Python versions starting with Python 3.14. [FastAPI release notes](https://fastapi.tiangolo.com/release-notes/)

**Why it is representative.** Removal is a staged compatibility project, not a single deletion. Temporary coexistence, minimum dependency changes, warnings, and final removal give users different migration signals at different times. An agent must read the target version’s actual contract and must not resurrect an expired compatibility layer because it appears in older examples.

**Evidence note.** The direct PR diff was not available through the retrieval path used for this research; the timeline above is grounded in FastAPI’s official release notes rather than an inferred implementation summary.

## 3. HTTP client & protocol handling — Requests and HTTPX (14 rows)

### Category synthesis

These tasks concern the invisible contracts beneath `requests.get(...)`: what counts as a file-like object, how byte length is calculated, whether a proxy exception matches a domain boundary, whether redirect objects form a cycle, whether exceptions survive pickling, and how dependency versions alter encoding. The lone HTTPX row (`httpx_3672`) sits in redirects/connection lifecycle and reinforces that connection ownership is part of the same protocol-handling landscape.

### 3.1 Protocol typing & duck-type compatibility (1 row)

**Representative:** [`requests_7505` — add `hasattr` checks for remaining protocol `isinstance` checks](https://github.com/psf/requests/pull/7505)

**Problem and root cause.** Runtime-checkable `SupportsRead` checks recognize structural implementations but miss proxies that expose `read` dynamically through `__getattr__`. Such an object works when caller code invokes `.read()`, yet fails a nominal runtime protocol check.

**Fix and verification.** The PR adds a `has_read` helper using `TypeIs[SupportsRead[str | bytes]]` and returns `isinstance(obj, SupportsRead) or hasattr(obj, "read")`. It applies the helper in `_encode_params`, `_encode_files`, and `prepare_body`. A `ReadProxy` regression test forwards attributes through `__getattr__` and deliberately makes iteration unavailable, ensuring Requests cannot accidentally pass by treating the proxy as an iterable instead. [PR #7505](https://github.com/psf/requests/pull/7505/files)

**Why it is representative.** Type narrowing is also runtime dispatch logic. The agent must apply the compatibility rule consistently to every protocol check, not only the path shown in a single reproducer.

### 3.2 Request bodies, file wrappers & content length (3 rows)

**Representative:** [`requests_7502` — fix multipart detection for `__getattr__`-based file wrappers](https://github.com/psf/requests/pull/7502)  
**Related dataset rows:** `requests_7433`, `requests_6589`

**Problem and fix.** Multipart encoding used only `isinstance(fp, _SupportsRead)` to detect file content. Proxy/wrapper objects that forward `.read()` dynamically could therefore fall through to incorrect multipart handling. The fix accepts either the runtime protocol or `hasattr(fp, "read")`, ensuring the wrapper is consumed as file content. [PR #7502](https://github.com/psf/requests/pull/7502/files)

**Verification and relationship to other rows.** The regression coverage uses a wrapper rather than a concrete file object, while `requests_7433` addresses the same capability-detection problem in streamed-body preparation and `requests_6589` addresses encoded-byte length. Together with #7505, these rows show why a fix is incomplete until all request-body dispatch paths share the same definition of “readable.”

**Why it is representative.** Multipart bugs often appear as malformed requests or wrong framing rather than a clear local exception. Tests should inspect the encoded body and `Content-Length`, not only confirm that `prepare_body` returns.

### 3.3 URLs, paths & proxy boundary handling (3 rows)

**Representative:** [`requests_7427` — port bpo-39057 proxy-boundary behavior](https://github.com/psf/requests/pull/7427)  
**Related dataset rows:** `requests_7315`, `requests_6644`

**Problem and root cause.** Raw suffix matching such as `hostname.endswith(host)` allowed a `no_proxy` entry like `requests.com` to match an unrelated hostname such as `attacker-requests.com`. String suffix equality is not DNS domain-boundary equality. The motivating report is [Requests issue #4795](https://github.com/psf/requests/issues/4795).

**Fix and verification.** The implementation strips a leading dot, checks exact hostname or host-with-port equality, and then prepends `.` before suffix matching so only genuine subdomains match. Tests include `prelocalhost` as a negative case and exercise port-specific behavior. Requests 2.34.0 release notes identify the change as the bpo-39057 port. [PR #7427](https://github.com/psf/requests/pull/7427/files), [Requests release history](https://requests.readthedocs.io/en/latest/community/updates/)

**Why it is representative.** The security property is in the negative cases. Testing only `sub.example.com` against `example.com` would preserve the bug; tests must also prove that visually similar but unrelated domains do not match. Leading-slash path rows nearby require the same attention to exact string boundaries.

### 3.4 Redirects & connection/stream lifecycle (2 rows)

**Representative:** [`requests_7328` — prevent `Response` self-reference in redirect history](https://github.com/psf/requests/pull/7328)  
**Related dataset row:** `httpx_3672`

**Problem and root cause.** Redirect processing previously appended the current response to `hist` and only then assigned `resp.history = hist[1:]`. In the relevant chain state, the response could include itself in its own history, creating a cyclic object graph and causing accidental looping for consumers that walk history.

**Fix and verification.** The order becomes `resp.history = hist[:]` followed by `hist.append(resp)`. Copying before appending ensures each response contains only predecessor responses. The regression test walks a three-redirect chain and checks every history list rather than only the final response. [PR #7328](https://github.com/psf/requests/pull/7328/files)

**Why it is representative.** The bug is about graph topology and mutation order. A correct agent must ask whether a container aliases a shared list, whether an object can reach itself, and whether every intermediate object satisfies the invariant. Connection-lifecycle work in HTTPX similarly requires reasoning beyond the final returned object.

### 3.5 Response parsing & exception serialization (2 rows)

**Representative:** [`requests_6629` — make `JSONDecodeError` deserializable](https://github.com/psf/requests/pull/6629)  
**Related dataset row:** `requests_7309`

**User-visible problem.** An invalid JSON response decoded inside a `ProcessPoolExecutor` could break the process pool instead of returning a normal JSON decoding exception to the parent process. The motivating report is [Requests issue #6628](https://github.com/psf/requests/issues/6628).

**Root cause and fix.** Requests’ compatibility JSON exception inherits through multiple built-in exception classes. Method resolution selected `IOError.__reduce__`, which omitted the `doc` and `pos` constructor arguments needed to reconstruct the JSON exception. The fix explicitly delegates `__reduce__` to `CompatJSONDecodeError.__reduce__`. A pickle round-trip test verifies representation equality. [PR #6629](https://github.com/psf/requests/pull/6629/files)

**Why it is representative.** An exception is part of a library’s inter-process API, not just its local control flow. Tests must serialize the actual raised object across the boundary; asserting the exception type inside one process would miss the MRO/pickling defect. Malformed `Content-Type` parsing in the sibling row likewise tests hostile parser inputs rather than valid happy paths.

### 3.6 Authentication configuration (1 row)

**Representative:** [`requests_7205` — fix empty `.netrc` entry usage](https://github.com/psf/requests/pull/7205)

**Problem and root cause.** A `.netrc` lookup can produce a tuple whose credential fields are all empty. The tuple itself is truthy even though it contains no usable authentication value, so a simple `if _netrc:` treats it as credentials.

**Fix and verification.** The guard becomes `if _netrc and any(_netrc):`, requiring both a result and at least one non-empty field. The regression fixture includes a valid machine entry followed by an empty `default` entry and verifies that an unrelated host receives no authentication. [PR #7205](https://github.com/psf/requests/pull/7205/files)

**Why it is representative.** Container truthiness is not semantic validity. The correct test includes a competing valid entry to ensure the empty default does not trigger fallback authentication or otherwise alter host selection.

### 3.7 Dependency compatibility & HTTP constants (2 rows)

**Representative:** [`requests_6757` — urllib3 1.x/2.x compatibility](https://github.com/psf/requests/pull/6757)  
**Related dataset row:** `requests_6592`

**Problem and root cause.** urllib3 2 changed string request-body encoding from ISO-8859-1 to UTF-8. Requests’ `super_len` must predict transmitted byte length consistently with the urllib3 version actually used; a single encoding assumption can produce an incorrect `Content-Length` for non-ASCII strings.

**Fix and verification.** The PR adds an explicit urllib3 1.x CI job using `urllib3<2`, introduces `is_urllib3_1` detection, and encodes strings as UTF-8 in `super_len` only for urllib3 2.x. Tests conditionalize the expected UTF-8 length. [PR #6757](https://github.com/psf/requests/pull/6757/files)

**Why it is representative.** Version compatibility needs a test matrix, not a comment claiming support. The code path and the byte-level assertion must vary with the dependency behavior. The sibling HTTP-425 constant row looks simpler, but belongs to the same protocol-compatibility maintenance surface.

## 4. Terminal UI & text rendering — Rich (48 rows)

### Category synthesis

Rich tasks turn textual and terminal complexity into software-engineering constraints: import graphs affect startup latency; pipes can disappear during output; markup tokens can carry nested styles; Unicode code points do not map one-to-one to graphemes or terminal cells; tables must satisfy spacing invariants; and exported output must be structurally valid. Several of the most serious bugs are non-termination bugs caused by iterators that fail to advance or grow while being consumed.

### 4.1 Import-time performance (1 row)

**Representative:** [`rich_4070` — reduce `Console` and `RichHandler` import time by deferring unused imports](https://github.com/Textualize/rich/pull/4070)

**Problem and fix.** Importing high-level Rich entry points pulled in heavy or infrequently used features before the user needed them. The PR defers imports for emoji tables, `Pretty`, `render_scope`, `inspect`, `getpass`, HTML escaping, zlib, `Traceback`, and `configparser`, among others, until the relevant feature executes. Type-only imports move under `TYPE_CHECKING`. Tests affected by monkeypatching deferred modules are adjusted accordingly. [PR #4070](https://github.com/Textualize/rich/pull/4070/files)

**Why it is representative.** Lazy imports change initialization order and test seams. An agent must preserve public behavior, avoid circular imports, and update tests that patch module globals. No trustworthy numeric speedup was established in the reviewed evidence, so the defensible conclusion is the mechanism—less work at import time—not an invented percentage improvement.

### 4.2 Terminal detection, ANSI & console I/O (8 rows)

**Representative:** [`rich_3468` — handle broken pipes](https://github.com/Textualize/rich/pull/3468)  
**Related dataset rows:** `rich_4077`, `rich_4076`, `rich_4075`, `rich_3777`, `rich_3675`, `rich_3470`, `rich_3278`

**Problem.** In a Unix pipeline such as `python -m rich | head -1`, the downstream reader can close while Rich still has output to write. Without deliberate handling, `BrokenPipeError` can produce a traceback and can recur during interpreter shutdown.

**Fix and verification.** `_check_buffer()` separates `_write_buffer()` and catches `BrokenPipeError`. A new overridable `Console.on_broken_pipe()` sets `quiet=True`, redirects stdout to `os.devnull` using `dup2` to prevent a second shutdown failure, and raises `SystemExit(1)`. A Unix subprocess test exercises the actual pipeline behavior. [PR #3468](https://github.com/Textualize/rich/pull/3468/files)

**Why it is representative.** Console output is an operating-system interaction, not an in-memory string operation. Verification needs a subprocess and a real closed pipe; mocking `print` cannot establish correct process-exit and shutdown behavior.

### 4.3 Markdown & markup parsing/rendering (6 rows)

**Representative:** [`rich_3130` — preserve inline styles and links in Markdown table cells](https://github.com/Textualize/rich/pull/3130)  
**Related dataset rows:** `rich_4079`, `rich_3942`, `rich_3469`, `rich_3064`, `rich_3063`

**Problem and root cause.** `TableDataElement.on_text()` replaced cell content for each text token. Nested formatting and links generate multiple tokens and spans, so later plain text could discard earlier styled content. The code also used `token.attrs.get("style" "")`, a malformed lookup expression, instead of `token.attrs.get("style")`.

**Fix and verification.** The new implementation initializes a `Text` object with column justification, converts strings to `Text`, applies the current style, and uses `append_text` rather than replacement. Tests cover bold, italic, strikethrough, hyperlinks, and left/center/right justification. [PR #3130](https://github.com/Textualize/rich/pull/3130/files)

**Why it is representative.** Parser state is cumulative. Testing plain table text would not reveal destructive token handling; the regression must include nested inline constructs and verify both text and spans.

### 4.4 Unicode, graphemes & cell-width segmentation (8 rows)

**Representative:** [`rich_4006` — fix infinite loop in `split_graphemes`](https://github.com/Textualize/rich/pull/4006)  
**Related dataset rows:** `rich_3953`, `rich_3944`, `rich_3930`, `rich_3180`, `rich_3535`, `rich_3521`, `rich_3506`

**Problem and root cause.** ANSI ESC and other zero-width inputs can produce a grapheme with zero terminal-cell width. When no previous span existed, the segmentation loop did not advance, so `split_graphemes()` and ultimately `Console.print()` could hang. The motivating report is [Rich issue #3958](https://github.com/Textualize/rich/issues/3958).

**Fix and verification.** The implementation makes the span invariant explicit: returned spans cover every string index with no gaps, while zero-cell graphemes remain legal. Leading zero-width characters now produce `(start, end, 0)` spans and advance the index; leading/trailing ZWJ and variation-selector edge cases are handled explicitly. Tests cover repeated ESC, leading ZWJ, repeated variation selectors, and zero-width chopping. [PR #4006](https://github.com/Textualize/rich/pull/4006/files)

**Why it is representative.** Terminal-cell width and string progress are separate quantities. “The next grapheme consumes zero columns” must never imply “the iterator consumes zero characters.” The strongest tests assert termination and full index coverage, not only expected widths for ordinary emoji.

### 4.5 Tables, panels & visual layout (5 rows)

**Representative:** [`rich_3935` — correct collapsed/edge table padding](https://github.com/Textualize/rich/pull/3935)  
**Related dataset rows:** `rich_3718`, `rich_3938`, `rich_3518`, `rich_2725`

**Problem and root cause.** A regression reported in [Rich issue #3871](https://github.com/Textualize/rich/issues/3871) produced extra padding around the first cell or columns when padding was collapsed. The width calculation did not consistently account for collapsed left/right padding and `pad_edge` at the first and last columns.

**Fix and verification.** `_get_padding_width()` now handles those edge conditions explicitly. A compact regression uses `Table.grid(padding=(0, 1))` with three fixed-width columns and requires exactly `aaa aaa aaa`. [PR #3935](https://github.com/Textualize/rich/pull/3935/files)

**Why it is representative.** This is an invariant problem rather than a subjective whitespace preference: content widths plus inter-column padding must equal the intended rendered width. Exact-output tests are appropriate when spaces themselves are the contract.

### 4.6 Live displays, progress & prompts (4 rows)

**Representative:** [`rich_3882` — render prompt validation errors with markup](https://github.com/Textualize/rich/pull/3882)  
**Related dataset rows:** `rich_3934`, `rich_3905`, `rich_3052`

**Problem and root cause.** Prompt validation errors were printed with `self.console.print(error)`. If a console had `markup=False`, Rich’s intended formatting tags appeared as raw text rather than being interpreted for that specific error message.

**Fix and verification.** The call becomes `self.console.print(error, markup=True)`, making the prompt’s own formatting intent explicit without changing the console’s global default. The test uses `Console(markup=False)`, enters invalid `Confirm` input, and expects plain `Please enter Y or N` without markup tags. [PR #3882](https://github.com/Textualize/rich/pull/3882/files)

**Why it is representative.** A one-argument fix still requires distinguishing library-authored markup from user data and testing non-default configuration. It also illustrates a broader live-display concern: rendering behavior must remain correct under caller-customized consoles.

### 4.7 Tracebacks, introspection & object representation (6 rows)

**Representative:** [`rich_3772` — fix traceback recursion](https://github.com/Textualize/rich/pull/3772)  
**Related dataset rows:** `rich_3894`, `rich_3486`, `rich_3676`, `rich_3472`, `rich_3006`

**Problem and root cause.** Python permits the unusual but valid state produced by `raise exc from exc`, where `exc.__cause__ is exc`. Rich repeatedly followed `__cause__`, so `console.print_exception()` entered an infinite loop and consumed resources until killed. The report includes a minimal reproducer and notes that third-party libraries can create this state even if application code would not normally write it. [Rich issue #3708](https://github.com/Textualize/rich/issues/3708)

**Fix and verification.** Traceback extraction refuses to follow a cause back to the same exception and adds a visited-exception set for recursive `ExceptionGroup` extraction. The regression constructs a self-caused exception, asserts the self-reference exists, and calls `console.print_exception(show_locals=True)` to prove termination. [PR #3772](https://github.com/Textualize/rich/pull/3772/files)

**Why it is representative.** Diagnostic tooling must tolerate malformed or cyclic object graphs; otherwise the error reporter becomes a second failure. A timeout alone is weaker than a regression that completes and checks the expected extracted structure.

### 4.8 Syntax highlighting & URL recognition (4 rows)

**Representative:** [`rich_3454` — allow `@` in highlighted hyperlinks](https://github.com/Textualize/rich/pull/3454)  
**Related dataset rows:** `rich_3782`, `rich_3296`, `rich_3067`

**Problem and root cause.** `ReprHighlighter` stopped URL highlighting at `@`, although the character is valid and widely used in URLs such as YouTube channel addresses. The report shows `https://www.youtube.com/@LinusTechTips` highlighted only up to the `@`. [Rich issue #3327](https://github.com/Textualize/rich/issues/3327)

**Fix and verification.** The URL regular expression adds `@` to its accepted character class. A span-level test expects the entire YouTube URL to receive `repr.url`. [PR #3454](https://github.com/Textualize/rich/pull/3454/files)

**Why it is representative.** The patch is one character, but the test must assert the complete span, not merely that highlighting occurred. Partial highlighting was precisely the bug.

### 4.9 Text & style data-structure internals (4 rows)

**Representative:** [`rich_3480` — fix infinite loop when appending a `Text` instance to itself](https://github.com/Textualize/rich/pull/3480)  
**Related dataset rows:** `rich_3471`, `rich_2943`, `rich_3061`

**Problem and root cause.** Both `append` and `append_text` extended `self._spans` through a generator iterating `text._spans`. When `text is self`, the generator iterates the same list that `extend` is growing. Python’s list iterator can observe newly appended items indefinitely, so `a.append(a)` fails to terminate instead of producing `oneone`.

**Fix and verification.** Both paths iterate `text._spans.copy()`, taking a stable snapshot before mutation. Regression tests call `a.append(a)` and `b.append_text(b)` and assert exactly `oneone` and `twotwo`. The PR changelog identifies the underlying report as [Rich issue #3479](https://github.com/Textualize/rich/issues/3479). [PR #3480](https://github.com/Textualize/rich/pull/3480/files)

**Why it is representative.** Self-aliasing invalidates the assumption that source and destination are independent. Copying only the span list is sufficient because the patch needs a finite snapshot of source spans; it avoids changing unrelated text semantics.

### 4.10 Export & output formats (2 rows)

**Representative:** [`rich_3043` — fix the HTML export template](https://github.com/Textualize/rich/pull/3043)  
**Related dataset row:** `rich_3105`

**Problem and root cause.** The export template placed `<head>` before `<html>`, producing incorrectly structured document markup. The fix moves `<html>` immediately after the doctype and before `<head>`. The associated report is [Rich issue #3021](https://github.com/Textualize/rich/issues/3021).

**Fix and verification.** The PR updates `CONSOLE_HTML_FORMAT` and exact-output tests for ordinary HTML export, inline styles, and saved HTML. Those tests also retain assertions for escaped markup and generated links, ensuring the structural correction does not regress content encoding. [PR #3043](https://github.com/Textualize/rich/pull/3043/files)

**Why it is representative.** Browsers can be lenient with malformed documents, so manual visual inspection may miss the defect. Exact template tests and, where appropriate, standards validation are stronger than “the export opens.”

## 5. Cross-category findings for developer agents

| Recurring pattern | Representative cases | What an agent should do |
|---|---|---|
| Lifecycle phase confusion | FastAPI #14099; Rich #3468 | Model when work actually occurs—response construction, response consumption, process shutdown—and test across that boundary. |
| Lossy abstraction conversion | FastAPI #14512; Requests #7502/#7505 | Trace metadata or capabilities through every adapter and dispatch path; do not validate only the original representation. |
| Shared mutable state or aliasing | FastAPI #14986; Requests #7328; Rich #3480 | Identify ownership, copy at the correct point, and test for cross-request leakage, cycles, and self-aliasing. |
| Iterator fails to make progress | Rich #3772, #4006, #3480 | Add explicit cycle/progress invariants and regression cases that terminate under self-reference or zero-width input. |
| Boundary values invalidate truthiness or suffix logic | FastAPI #13537; Requests #7205/#7427 | Test empty values, exact matches, near-miss negative cases, ports, aliases, and defaults together. |
| Dependency internals change | FastAPI #14851/#14609; Requests #6757 | Preserve the public contract with adapters or staged migration, and test the supported dependency/version matrix. |
| Correct serialization depends on context | FastAPI #14986; Requests #6629; Rich #3043 | Test the consumer boundary: HTML embedding, process pickling, or document structure—not just local object creation. |
| Small patch, broad semantic impact | FastAPI #13786; Rich #3454/#3882 | Audit all sibling implementations and downstream compatibility before assuming a one-line change is trivial. |

### Practical regression-test checklist

A strong solution to tasks like these should, where relevant:

1. reproduce the original failure before editing;
2. assert the violated invariant, not only a successful return value;
3. include negative and boundary cases, especially empty, zero, self-referential, and near-match inputs;
4. exercise every sibling code path that shares the faulty assumption;
5. verify behavior under supported dependency versions and non-default options;
6. consume asynchronous streams, subprocesses, or serialized objects across their real boundaries;
7. check compatibility impact when changing status codes, deprecations, error text, or public lifecycle behavior; and
8. avoid broad rewrites when a focused snapshot, guard, ordering change, or adapter restores the contract.

## 6. Open questions and evidence limitations

- **Competition mechanics are out of scope.** The public Kaggle page exposed little usable content through the retrieval path, so the CSV is treated as the authoritative scope. This report makes no claims about scoring, prize structure, hidden tests, or submission rules.
- **Representative does not mean exhaustive.** Every one of the 27 subcategories has a deeply analyzed primary case, and all 129 instance IDs are mapped, but the other 102 rows were not independently root-caused to the same depth.
- **Patch-level evidence, not local execution.** Findings are based on upstream issue reports, final PR diffs, tests, documentation, and release notes. The report does not claim that each historical test suite was executed locally in this research environment.
- **No numeric Rich import-time benchmark.** PR #4070 clearly defers imports, but the reviewed evidence did not establish a reliable speedup figure; none is invented here.
- **Two sparse Rich issue pages.** Public extraction for Rich issues #3479 and #3021 returned only titles/automated text. Their symptoms and fixes are therefore grounded in the PR diffs, regression tests, and changelog entries, not in unavailable issue-body details.
- **FastAPI #14609 implementation detail.** Direct diff retrieval was unavailable. The report limits itself to the officially documented deprecation/removal timeline and does not infer unseen code changes.
- **Release labels are intentionally selective.** Versions are included where official documentation or release notes supported them. They are omitted elsewhere rather than inferred from PR chronology.

## 7. Sources

All links below are upstream project sources or official language documentation. PR pages provide access to the final diff and test changes; issue pages provide user-facing reproductions where available.

### FastAPI

- [PR #15661 — Automate release preparation](https://github.com/fastapi/fastapi/pull/15661)
- [PR #14099 — Streaming responses and dependency cleanup](https://github.com/fastapi/fastapi/pull/14099); [issue #10857](https://github.com/fastapi/fastapi/issues/10857); [Advanced Dependencies](https://fastapi.tiangolo.com/advanced/advanced-dependencies/)
- [PR #13537 — Empty form values and defaults](https://github.com/fastapi/fastapi/pull/13537)
- [PR #14851 — Starlette-compatible lifecycle implementation](https://github.com/fastapi/fastapi/pull/14851)
- [PR #14986 — OpenAPI/Swagger UI state and escaping](https://github.com/fastapi/fastapi/pull/14986)
- [PR #13786 — Authentication status codes](https://github.com/fastapi/fastapi/pull/13786); [issue #10177](https://github.com/fastapi/fastapi/issues/10177)
- [PR #14485 — `TYPE_CHECKING` annotation handling](https://github.com/fastapi/fastapi/pull/14485); [Python `annotationlib`](https://docs.python.org/3/library/annotationlib.html)
- [PR #14306 — Endpoint context in validation errors](https://github.com/fastapi/fastapi/pull/14306)
- [PR #14512 — Discriminated unions in `Annotated`/`Body()`](https://github.com/fastapi/fastapi/pull/14512)
- [PR #14609 — Remove `pydantic.v1` support](https://github.com/fastapi/fastapi/pull/14609); [FastAPI release notes](https://fastapi.tiangolo.com/release-notes/)

### Requests and HTTP protocol handling

- [PR #7505 — Remaining duck-typed protocol checks](https://github.com/psf/requests/pull/7505)
- [PR #7502 — Multipart file-wrapper detection](https://github.com/psf/requests/pull/7502)
- [PR #7427 — Proxy domain boundaries](https://github.com/psf/requests/pull/7427); [issue #4795](https://github.com/psf/requests/issues/4795); [Requests release history](https://requests.readthedocs.io/en/latest/community/updates/)
- [PR #7328 — Redirect-history self-reference](https://github.com/psf/requests/pull/7328)
- [PR #6629 — JSON exception pickling](https://github.com/psf/requests/pull/6629); [issue #6628](https://github.com/psf/requests/issues/6628)
- [PR #7205 — Empty `.netrc` entries](https://github.com/psf/requests/pull/7205)
- [PR #6757 — urllib3 1.x/2.x compatibility](https://github.com/psf/requests/pull/6757)

### Rich

- [PR #4070 — Deferred imports](https://github.com/Textualize/rich/pull/4070)
- [PR #3468 — Broken-pipe handling](https://github.com/Textualize/rich/pull/3468)
- [PR #3130 — Markdown table inline styles](https://github.com/Textualize/rich/pull/3130)
- [PR #4006 — Zero-width grapheme progress](https://github.com/Textualize/rich/pull/4006); [issue #3958](https://github.com/Textualize/rich/issues/3958)
- [PR #3935 — Collapsed/edge table padding](https://github.com/Textualize/rich/pull/3935); [issue #3871](https://github.com/Textualize/rich/issues/3871)
- [PR #3882 — Prompt validation markup](https://github.com/Textualize/rich/pull/3882)
- [PR #3772 — Recursive exception extraction](https://github.com/Textualize/rich/pull/3772); [issue #3708](https://github.com/Textualize/rich/issues/3708)
- [PR #3454 — `@` in highlighted URLs](https://github.com/Textualize/rich/pull/3454); [issue #3327](https://github.com/Textualize/rich/issues/3327)
- [PR #3480 — Self-append infinite loop](https://github.com/Textualize/rich/pull/3480); [issue #3479](https://github.com/Textualize/rich/issues/3479)
- [PR #3043 — HTML export structure](https://github.com/Textualize/rich/pull/3043); [issue #3021](https://github.com/Textualize/rich/issues/3021)


---

<!-- ====================================================================== -->
<!-- FILE: 02b_representative-issues-by-category-2026-11-02.md -->
<!-- ====================================================================== -->

# Representative Issues for the Gemma 4 Developer Agent Dataset

*Research scope: Select one representative dataset task for each of the 27 technical sub-categories in Tables 1–3, and summarize the problem, intended change, and reason it is representative. The selections come from the 129 records in the uploaded `tasks.jsonl`; summaries use the problem statements, reference patches, test patches, and linked GitHub PR/issue context.*

*As of: 2026-11-02. This is a historical dataset analysis, not an assessment of the current status of each upstream PR.*

## Executive summary

The 27 representatives show three distinct kinds of engineering difficulty. FastAPI tasks most often require reasoning about composed framework semantics—type metadata, dependency lifetimes, routing structures, and schema generation. Rich tasks concentrate on terminal rendering correctness, especially Unicode, style preservation, parser state, and output lifecycle. Requests and HTTPX tasks emphasize protocol boundaries, duck typing, dependency compatibility, exception behavior, and connection cleanup.

Most representatives are small-to-moderate code changes whose difficulty lies in locating the invariant that failed rather than in writing a large implementation. A smaller but important group—router preservation, grapheme handling, streaming cleanup, and import-time optimization—requires broader architectural reasoning. The main caveat is that one PR per sub-category is illustrative rather than statistically representative; many tasks span multiple domains and were assigned to their dominant technical area.

**Terminology:** the dataset identifiers correspond to GitHub pull requests. Accordingly, the links below are PRs, with original issue numbers mentioned where the PR supplies them.

## 1. Web framework and API development

### 1.1 Dependency injection and function/annotation handling

**Representative:** [FastAPI PR #14448 — Fix support for `functools.wraps` and `partial` combined](https://github.com/fastapi/fastapi/pull/14448), related to issue #14444.

**Executive summary:** Combining decorators, `functools.wraps`, and `functools.partial` can hide whether the underlying endpoint or dependency is synchronous, asynchronous, a generator, or a callable class. Inspecting only the outer wrapper can therefore lead FastAPI to await the wrong thing or execute a callable through the wrong path. The change unwraps and analyzes the callable chain across endpoints and dependencies, with combinatorial tests for synchronous and asynchronous wrappers, functions, classes, and generators. This is representative because the hard part is preserving Python callable semantics through framework introspection, not merely adding another dependency-injection special case.

### 1.2 Pydantic, models, and type handling

**Representative:** [FastAPI PR #14512 — Fix tagged unions with a discriminator inside `Annotated` and `Body()`](https://github.com/fastapi/fastapi/pull/14512), related to issue #14508 and discussion #14495.

**Executive summary:** A callable-discriminated `Cat | Dog` union worked when declared as `pet: Pet = Body()` but failed when written as `pet: Annotated[Pet, Body()]`. The two forms should be equivalent, but the latter could duplicate or nest discriminator metadata when FastAPI constructed Pydantic’s type adapter, producing a Pydantic error rather than validating the request. The fix restores correct metadata handling and tests both request validation and generated OpenAPI. It represents the sub-category well because a small type-system change can affect runtime validation and schema generation simultaneously.

### 1.3 Parameter and request-body parsing

**Representative:** [FastAPI PR #11194 — Fix validation when `File` is declared after `Form`](https://github.com/fastapi/fastapi/pull/11194), related to discussion #9116.

**Executive summary:** An endpoint accepting both form fields and file uploads could return HTTP 422 unless the `File` parameter appeared before the `Form` parameter in the Python signature. Declaration order should not change the meaning of the request. The fix makes file/form analysis order-independent and adds coverage for multiple files and different parameter orderings. This is a strong representative of request-parsing tasks: the externally visible symptom is a validation error, while the underlying problem is how FastAPI classifies and assembles body fields.

### 1.4 Routing, application APIs, and lifecycle

**Representative:** [FastAPI PR #15745 — Preserve `APIRouter` and `APIRoute` instances](https://github.com/fastapi/fastapi/pull/15745).

**Executive summary:** Previously, `include_router()` cloned path operations into the parent router, discarding object identity and preventing routes added later to an included router from appearing automatically. The refactor retains router and route objects and records inclusion metadata as a tree rather than flattening everything into one route list. This enables late route registration and custom route/router classes, but also changes the internal shape of `router.routes`, an important compatibility trade-off. It represents the broader architectural end of the routing category, where object lifetime, composition, and backward compatibility must be considered together.

### 1.5 OpenAPI, JSON Schema, and schema metadata

**Representative:** [FastAPI PR #14463 — Stop duplication of `anyOf` references in app-level responses](https://github.com/fastapi/fastapi/pull/14463).

**Executive summary:** When an application-level response combined a union of Pydantic models with custom content examples, generated OpenAPI accumulated repeated `$ref` entries as more routes were processed. A shallow copy left nested response content shared between routes; schema merging then mutated that shared object and repeatedly appended the same `anyOf` members. The intended fix prevents shared response configuration from being modified during per-route schema generation. This is representative because the visible schema defect arises from object aliasing and state mutation, not from an incorrect OpenAPI union definition alone.

### 1.6 Responses, SSE, and streaming

**Representative:** [FastAPI PR #14099 — Close dependency resources after a `StreamingResponse` finishes](https://github.com/fastapi/fastapi/pull/14099).

**Executive summary:** Cleanup code after `yield` in a dependency could run after the endpoint returned but before the response body was streamed. A streaming generator that still needed a database session, uploaded file, or similar resource could therefore encounter an already-closed object. The change uses exit-stack handling to defer dependency cleanup until the response is complete, while preserving error propagation for ordinary responses and WebSockets. This exemplifies streaming tasks because correctness depends on resource ownership across asynchronous lifecycle boundaries rather than on the response class in isolation.

### 1.7 Authentication and request security

**Representative:** [FastAPI PR #13786 — Return 401 when credentials are missing](https://github.com/fastapi/fastapi/pull/13786).

**Executive summary:** Several security classes returned HTTP 403 when no credentials were supplied, conflating “not authenticated” with “authenticated but forbidden.” The change moves missing-credential responses to 401 and adds appropriate `WWW-Authenticate` behavior across API-key and HTTP authentication schemes. Because clients may depend on the old behavior, the design also provides a compatibility route for applications that temporarily need 403. It is representative of security work that combines standards semantics, consistent behavior across related classes, documentation, and explicit management of a breaking change.

### 1.8 Compatibility, deprecations, and warnings

**Representative:** [FastAPI PR #14605 — Add `FastAPIDeprecationWarning`](https://github.com/fastapi/fastapi/pull/14605).

**Executive summary:** Python’s standard `DeprecationWarning` is commonly hidden from application users, making it a poor channel for notifying them that library behavior they use will be removed. FastAPI introduces a custom `UserWarning` subclass and applies it to deprecated functionality, including `pydantic.v1` usage and older parameter APIs. Tests are updated to assert the new warning category. This represents cross-cutting maintenance: the code change is small, but it affects public observability, migration behavior, and numerous call sites and tests.

### 1.9 Documentation and project automation

**Representative:** [FastAPI PR #15661 — Automate release preparation](https://github.com/fastapi/fastapi/pull/15661).

**Executive summary:** Release preparation requires coordinated edits to the package version and structured release notes, with several opportunities for inconsistent or malformed output. The new command-line tool supports semantic major/minor/patch bumps, rejects invalid or non-increasing versions, validates the release-note structure, and extracts the relevant release body. Extensive tests cover parsing and failure cases. This is representative of the non-runtime side of the dataset: the agent must implement robust file transformation and validation logic rather than change web-framework behavior.

### 1.10 Errors and developer experience

**Representative:** [FastAPI PR #14306 — Add endpoint metadata to validation-error tracebacks](https://github.com/fastapi/fastapi/pull/14306).

**Executive summary:** Validation errors previously did not identify which endpoint triggered them, making failures harder to locate in larger applications. The change attaches the endpoint’s file, line, function, HTTP method, and route to the error context, and caches that metadata so repeated requests do not repeatedly pay the introspection cost. This is a representative developer-experience task because the objective is not to change validation outcomes but to make failures actionable while protecting request-path performance.

## 2. Terminal UI and text rendering

### 2.1 Unicode, graphemes, and cell-width segmentation

**Representative:** [Rich PR #3930 — Handle graphemes](https://github.com/Textualize/rich/pull/3930), related to issue #3897.

**Executive summary:** Rich historically handled many code points independently, which is insufficient for multi-code-point emoji and other grapheme clusters that terminals display as one glyph. The change adds Unicode data and glyph-cluster segmentation, then uses it in low-level width and splitting operations needed for wrapping and cropping. It also has to avoid excessive startup and width-calculation overhead. This is the clearest representative of the Unicode category because it combines terminal-width semantics, Unicode data, string segmentation, and performance-sensitive infrastructure.

### 2.2 Terminal detection, ANSI, and console I/O

**Representative:** [Rich PR #3278 — Strip problematic private escape sequences](https://github.com/Textualize/rich/pull/3278).

**Executive summary:** Private ANSI sequences such as `ESC 7` and `ESC 8`, commonly used to save and restore the cursor, could pass through Rich’s ANSI handling. Programs emitting those sequences could move the cursor unexpectedly and corrupt the rendered output. The parser is changed to ignore the problematic private sequences. This represents terminal I/O tasks well: the defect appears only when Rich interoperates with real terminal producers, and the fix requires understanding control-sequence side effects rather than ordinary text layout.

### 2.3 Markdown and markup parsing/rendering

**Representative:** [Rich PR #3130 — Preserve Markdown table content with inline styles and links](https://github.com/Textualize/rich/pull/3130), related to issue #3115.

**Executive summary:** In Markdown table cells, encountering a new inline style or link could replace previously accumulated text instead of adding to it. The result was missing or overridden cell content when multiple styled fragments appeared together. The fix appends new content in the same manner as Rich’s ordinary text-element handling. This is representative because it exposes a parser-state invariant: styling boundaries must change annotations, not discard the text accumulated so far.

### 2.4 Tracebacks, introspection, and object representation

**Representative:** [Rich PR #3486 — Report fine-grained error locations](https://github.com/Textualize/rich/pull/3486).

**Executive summary:** Python’s PEP 657 supplies fine-grained source positions for exceptions, but Rich’s traceback output did not take advantage of them. The change incorporates those positions so a traceback can identify the relevant expression span rather than only the containing line. It represents this sub-category because the task bridges interpreter metadata and user-facing diagnostics: the information already exists, but must be interpreted and rendered accurately to improve debugging.

### 2.5 Tables, panels, and visual layout

**Representative:** [Rich PR #3718 — Restore the panel-title background](https://github.com/Textualize/rich/pull/3718), related to issue #3569.

**Executive summary:** A panel title could lose the panel’s background style, producing an inconsistent visual transition between the title and the panel body. The fix reverts the responsible styling change, with particular attention to earlier panel-title issues because this rendering path had already proven regression-prone. This is representative of layout tasks where a very small style-composition change can have a conspicuous visual effect and where nearby historical bugs constrain the solution.

### 2.6 Syntax highlighting and URL recognition

**Representative:** [Rich PR #3454 — Allow `@` in highlighted hyperlinks](https://github.com/Textualize/rich/pull/3454), related to issue #3327.

**Executive summary:** The URL regular expression used by `ReprHighlighter` did not accept `@`, causing highlighting to break on otherwise valid hyperlinks containing that character. The change adds the missing character and a regression test. Although the patch is minimal, it is highly representative of URL-recognition work: an overly restrictive pattern creates a visible rendering defect, and the correct solution is a precise grammar adjustment rather than a broader highlighting rewrite.

### 2.7 Live displays, progress, and prompts

**Representative:** [Rich PR #3905 — Do not emit a blank line for disabled progress displays](https://github.com/Textualize/rich/pull/3905).

**Executive summary:** Creating `Progress` with `disabled=True` suppressed startup output but could still print an extraneous blank line on shutdown for non-interactive consoles. The fix makes `stop()` respect the disabled state symmetrically with `start()`. This represents live-component lifecycle bugs: the visual artifact arises because two sides of the same lifecycle do not apply the same guard, and the impact is especially noticeable in CI logs and captured output.

### 2.8 Text and style data-structure internals

**Representative:** [Rich PR #3061 — Preserve styles when expanding tabs](https://github.com/Textualize/rich/pull/3061).

**Executive summary:** `Text.extend_tabs()` replaced tab characters with spaces but failed to extend the associated style spans, turning previously styled tabs into unstyled whitespace. The fix carries the existing spans over the inserted spaces. This is representative of text-internals tasks because the character transformation is trivial, but preserving parallel style annotations is the real invariant. Similar reasoning applies to slicing, splitting, appending, and other operations on styled text.

### 2.9 Export and output formats

**Representative:** [Rich PR #3043 — Fix the HTML export template](https://github.com/Textualize/rich/pull/3043), related to issue #3021.

**Executive summary:** Rich’s HTML export path contained a template defect separate from terminal rendering, causing incorrect exported output. The PR corrects the template and includes an ancillary pre-commit update needed by the contributor. This represents output-format tasks because correctness must be evaluated in the target format, not inferred from successful console rendering; export templates introduce their own escaping, structure, and compatibility concerns.

### 2.10 Import-time performance

**Representative:** [Rich PR #4070 — Reduce `Console` and `RichHandler` import time](https://github.com/Textualize/rich/pull/4070).

**Executive summary:** Importing commonly used Rich entry points pulled in modules needed only for optional operations such as tracebacks, export, local-variable logging, or password input. The change defers those imports to their call sites, moves annotation-only imports behind `TYPE_CHECKING`, and removes dead code. Reported benchmarks show substantial startup improvements. This is the sole performance representative and demonstrates a broad but behavior-preserving optimization: reduce import-graph weight without changing the public API or delaying required functionality incorrectly.

## 3. HTTP client and protocol handling

### 3.1 Request bodies, file wrappers, and content length

**Representative:** [Requests PR #7502 — Fix `_encode_files` detection for `__getattr__`-based wrappers](https://github.com/psf/requests/pull/7502).

**Executive summary:** Requests used a runtime-checkable `SupportsRead` protocol to recognize file-like objects during multipart encoding. Wrappers that proxy `read()` through `__getattr__`, including the standard-library temporary-file case covered by the test, could fail that `isinstance` check despite supporting the required operation. The fix adds a `hasattr(fp, "read")` fallback so the wrapper is read as file content. This is representative because runtime protocol checks and Python’s dynamic proxy patterns do not always agree, even when the object satisfies the intended duck-typed contract.

### 3.2 URLs, paths, and proxy boundary handling

**Representative:** [Requests PR #7427 — Port CPython bpo-39057 to `no_proxy` handling](https://github.com/psf/requests/pull/7427), related to issue #4795.

**Executive summary:** Requests matched `no_proxy` entries with a raw suffix test, so an entry such as `localhost` could also match an unrelated host such as `prelocalhost`. The change ports CPython’s boundary-aware behavior: exact hosts and genuine subdomains match, while arbitrary string suffixes do not; host-and-port cases are covered as well. This is representative of URL/proxy tasks because a seemingly simple string comparison controls request routing and must respect domain boundaries and ecosystem conventions.

### 3.3 Response parsing and exception serialization

**Representative:** [Requests PR #6629 — Make `JSONDecodeError` pickle round-trips work](https://github.com/psf/requests/pull/6629), related to issue #6628.

**Executive summary:** Requests’ JSON exception inherits from both its own request-exception hierarchy and the JSON library’s decode error. Method-resolution order selected an `__reduce__` implementation that discarded arguments required to reconstruct the JSON exception, so `pickle.loads(pickle.dumps(error))` failed and could crash a process pool. Delegating reduction to the JSON parent preserves all constructor arguments. This is representative because response parsing extends beyond decoding: exceptions must remain well-behaved when crossing process and serialization boundaries.

### 3.4 Redirects and connection/stream lifecycle

**Representative:** [HTTPX PR #3672 — Server connection handling](https://github.com/encode/httpx/pull/3672).

**Executive summary:** Persistent HTTP connections can be reused safely only after the request/response exchange is complete and both sides permit keep-alive. The change makes parser reset explicit, ensures requests are read to completion on keep-alive connections, closes streams during server exit, and avoids raising `KeyboardException` on that path. This represents lifecycle work because correctness depends on a state machine spanning parsing, connection reuse, stream ownership, and shutdown—not on any single request handler.

### 3.5 Dependency compatibility and HTTP constants

**Representative:** [Requests PR #6757 — Restore testing on urllib3 1.26.x](https://github.com/psf/requests/pull/6757), related to issue #6734.

**Executive summary:** Requests lost explicit urllib3 1.26.x coverage when its test pin moved toward urllib3 2.x, allowing version-specific behavior to go unchecked. The PR restores that compatibility direction and makes string content-length handling version-aware because urllib3 2.x encodes strings as UTF-8 where older behavior followed `http.client` conventions. This is representative of dependency-maintenance tasks: the goal is not merely to adjust CI, but to encode behavioral differences in tests and compatibility helpers across supported dependency majors.

### 3.6 Protocol typing and duck-type compatibility

**Representative:** [Requests PR #7505 — Centralize `hasattr` checks for readable protocols](https://github.com/psf/requests/pull/7505).

**Executive summary:** PR #7502 fixed one multipart-encoding path, but similar protocol checks existed in parameter encoding and body preparation. This follow-up introduces a reusable `has_read()` type guard combining `isinstance()` with `hasattr()`, preserving static narrowing while recognizing `__getattr__` proxies, and applies it consistently. It is representative because it turns a point fix into a shared invariant, reducing the chance that another request-body path repeats the same compatibility defect.

### 3.7 Authentication configuration

**Representative:** [Requests PR #7205 — Ignore empty netrc entries](https://github.com/psf/requests/pull/7205).

**Executive summary:** Before Python 3.11, an empty netrc profile raised a parse error; newer Python versions can return the truthy tuple `('', '', '')`. Requests consequently treated the profile as credentials and could generate an empty `:` authorization value. Checking that at least one tuple component is non-empty restores the intended behavior of ignoring empty profiles, while explicit `auth=('', '')` remains available. This represents authentication-configuration tasks driven by standard-library behavior changes and unintended credential generation.

## Cross-category findings

The strongest common thread is **invariant preservation at boundaries**. FastAPI must preserve metadata and resource lifetimes as values move between user declarations, Pydantic, routing, and responses. Rich must preserve text, style, and terminal state as content moves through parsers and renderers. Requests and HTTPX must preserve protocol and object contracts as data crosses proxy, serialization, dependency, and connection boundaries.

A second finding is that **many superficially small tasks require broad regression thinking**. Adding `@` to a URL pattern is localized, but streaming cleanup and router preservation affect numerous lifecycle paths. Likewise, centralizing `has_read()` is a small refactor whose value comes from preventing equivalent bugs in several request-body paths. For an agent benchmark, this means patch size is a poor proxy for problem difficulty.

Finally, **tests are part of the problem statement in practice**. Several PR descriptions are terse, while their test patches define the actual contract: declaration-order permutations, callable-wrapper combinations, Unicode edge cases, proxy boundaries, and pickle round-trips. An effective agent should use tests to infer the required behavior rather than relying only on the title or prose description.

## Open questions and evidence limits

- One representative per sub-category cannot show the full variation within that group. In particular, dependency injection and Pydantic handling contain many distinct failure modes beyond the two selected PRs.
- Some tasks legitimately belong to more than one category. For example, PR #14099 concerns both dependency cleanup and streaming responses; it is placed under responses because resource availability during streaming is the user-visible failure.
- The dataset contains reference patches, so these summaries describe the intended dataset change. They do not claim that every PR remains merged, unchanged, or representative of the latest upstream architecture.
- Original issue reports are not available for every record. Where the dataset supplies only a PR, the PR and its tests are the primary evidence.

## Sources

All dates below are the dataset’s recorded PR creation dates.

### FastAPI

1. [PR #14448 — Fix support for `functools.wraps` and `partial` combined](https://github.com/fastapi/fastapi/pull/14448), FastAPI, 2025-12-04.
2. [PR #14512 — Fix tagged unions with a discriminator inside `Annotated` and `Body()`](https://github.com/fastapi/fastapi/pull/14512), FastAPI, 2025-12-12.
3. [PR #11194 — Fix validation when `File` is declared after `Form`](https://github.com/fastapi/fastapi/pull/11194), FastAPI, 2025-09-20.
4. [PR #15745 — Preserve `APIRouter` and `APIRoute` instances](https://github.com/fastapi/fastapi/pull/15745), FastAPI, 2026-06-14.
5. [PR #14463 — Stop duplication of `anyOf` references in app-level responses](https://github.com/fastapi/fastapi/pull/14463), FastAPI, 2026-02-04.
6. [PR #14099 — Close dependency resources after a `StreamingResponse` finishes](https://github.com/fastapi/fastapi/pull/14099), FastAPI, 2025-09-29.
7. [PR #13786 — Return 401 when credentials are missing](https://github.com/fastapi/fastapi/pull/13786), FastAPI, 2025-11-24.
8. [PR #14605 — Add `FastAPIDeprecationWarning`](https://github.com/fastapi/fastapi/pull/14605), FastAPI, 2025-12-26.
9. [PR #15661 — Automate release preparation](https://github.com/fastapi/fastapi/pull/15661), FastAPI, 2026-05-31.
10. [PR #14306 — Add endpoint metadata to validation-error tracebacks](https://github.com/fastapi/fastapi/pull/14306), FastAPI, 2025-12-06.

### Rich

11. [PR #3930 — Handle graphemes](https://github.com/Textualize/rich/pull/3930), Rich, 2026-01-22.
12. [PR #3278 — Strip problematic private escape sequences](https://github.com/Textualize/rich/pull/3278), Rich, 2024-07-01.
13. [PR #3130 — Preserve Markdown table content with inline styles and links](https://github.com/Textualize/rich/pull/3130), Rich, 2023-09-17.
14. [PR #3486 — Report fine-grained error locations](https://github.com/Textualize/rich/pull/3486), Rich, 2024-09-11.
15. [PR #3718 — Restore the panel-title background](https://github.com/Textualize/rich/pull/3718), Rich, 2025-06-24.
16. [PR #3454 — Allow `@` in highlighted hyperlinks](https://github.com/Textualize/rich/pull/3454), Rich, 2024-08-26.
17. [PR #3905 — Do not emit a blank line for disabled progress displays](https://github.com/Textualize/rich/pull/3905), Rich, 2026-01-23.
18. [PR #3061 — Preserve styles when expanding tabs](https://github.com/Textualize/rich/pull/3061), Rich, 2023-07-29.
19. [PR #3043 — Fix the HTML export template](https://github.com/Textualize/rich/pull/3043), Rich, 2023-07-29.
20. [PR #4070 — Reduce `Console` and `RichHandler` import time](https://github.com/Textualize/rich/pull/4070), Rich, 2026-04-11.

### Requests and HTTPX

21. [Requests PR #7502 — Fix `_encode_files` detection for `__getattr__`-based wrappers](https://github.com/psf/requests/pull/7502), Requests, 2026-06-08.
22. [Requests PR #7427 — Port CPython bpo-39057 to `no_proxy` handling](https://github.com/psf/requests/pull/7427), Requests, 2026-05-11.
23. [Requests PR #6629 — Make `JSONDecodeError` pickle round-trips work](https://github.com/psf/requests/pull/6629), Requests, 2024-02-22.
24. [HTTPX PR #3672 — Server connection handling](https://github.com/encode/httpx/pull/3672), HTTPX, 2025-09-19.
25. [Requests PR #6757 — Restore testing on urllib3 1.26.x](https://github.com/psf/requests/pull/6757), Requests, 2024-07-30.
26. [Requests PR #7505 — Centralize `hasattr` checks for readable protocols](https://github.com/psf/requests/pull/7505), Requests, 2026-06-09.
27. [Requests PR #7205 — Ignore empty netrc entries](https://github.com/psf/requests/pull/7205), Requests, 2026-02-13.


---

<!-- ====================================================================== -->
<!-- FILE: 03_Gemma_4_27_Issue_Families_Python_Root_Cause_and_Triage_2026-11-02.md -->
<!-- ====================================================================== -->

# Gemma 4 developer-agent dataset: Python root-cause analysis and triage for 27 issue families

*Research scope: static, evidence-led analysis of all 129 instances in the supplied classification CSV and task JSONL, using each problem statement, implementation patch, and regression-test patch as dataset evidence. Python documentation explains the relevant language semantics and standard-library APIs; data-structure and algorithm analysis supplies invariants, complexity, and test oracles. This is a triage guide, not a claim that every historical patch can be applied to every other base commit.*
*As of: 2026-11-02. Linked documentation is versioned or continuously updated; confirm details against the Python and dependency versions in the target repository.*

## Executive summary

The 129 tasks resolve into exactly 27 families: 10 FastAPI/web families (67 instances), 7 Requests/HTTPX families (14), and 10 Rich/terminal families (48). Most defects are not missing algorithms; they are broken contracts at boundaries—runtime annotations versus static types, code points versus graphemes and terminal cells, character counts versus encoded bytes, shallow copies versus nested ownership, and callable objects versus functions. The highest-value general triage method is therefore to identify the contract, write its invariant before changing code, and test adversarial boundary cases at the relevant `base_commit`.

Four findings deserve priority. First, callable and annotation handling needs an explicit normalization pipeline; isolated fixes for wrappers, `partial`, classes, or forward references regress when those features compose. Second, caches and schema structures need ownership and invalidation rules: canonical cache keys, deep copies at nested mutable boundaries, and visited sets for recursive graphs. Third, streaming and console parsers need state-machine invariants, especially guaranteed input progress and cleanup only after iteration finishes. Fourth, Unicode triage must distinguish three coordinate systems—Python string indices, grapheme boundaries, and display cells—or wrapping and infinite-loop fixes will remain fragile.

The most important caveat is patch chronology. `requests_6644` collapses excess leading slashes, while the later `requests_7315` removes that transformation because it breaks signed S3 URLs. Similar follow-up chains exist in FastAPI annotation, union, and lifespan handling, and in Rich Markdown and grapheme handling. Treat the supplied patches as evidence tied to their individual bases, not as one stack to apply indiscriminately.

## Evidence model and triage conventions

For each family below, **coverage** accounts for every supplied instance; **root cause** distinguishes the implementation mechanism from the visible symptom; **Python/DSA** identifies useful semantics and structures; and **triage/oracles** gives a practical reproduction and regression-test path. Complexity is stated only where it helps choose an implementation.

Recommended workflow for any individual task:

1. Check out its `base_commit`, reproduce with the problem statement, and inspect its `test_patch` before generalizing from another instance.
2. Reduce the failure to a contract violation: wrong value shape, wrong coordinate system, wrong object lifetime, stale derived state, missing graph-base case, or incomplete parser state.
3. Write one executable invariant—for example, “history never contains the current response,” “spans partition every input index,” or “cleanup occurs after the final stream item.”
4. Run a compatibility matrix only on dimensions implicated by the patch: Python version, sync/async callable kind, Pydantic/Starlette/urllib3 version, TTY mode, or Unicode-data version.
5. Keep security oracles explicit: credential whitespace and status codes, proxy domain boundaries, raw signed paths, HTML-safe JSON, and validation-error disclosure.

# FastAPI and web framework families

## 1. Authentication & request security — 4 instances

**Coverage.** `fastapi_14978` (strict JSON content type), `fastapi_14786` (authorization credential whitespace), `fastapi_5624` (hierarchical security scopes), and `fastapi_13786` (missing-credential status semantics).

**Root cause.** These are four different trust-boundary parsing errors. A JSON body was accepted without enforcing the declared media-type contract; splitting an authorization header with `partition(" ")` left extra credential whitespace; child security dependencies replaced rather than accumulated parent scopes; and absent credentials were conflated with authenticated-but-insufficient access. The scope bug is an aggregation defect, not merely an OpenAPI display defect, because dependency authorization also consumes the scopes.

**Python/DSA.** [`str.partition()`](https://docs.python.org/3/library/stdtypes.html#str.partition) returns exactly one separator split; it does not implement HTTP whitespace normalization. [`json.loads()`](https://docs.python.org/3/library/json.html#json.loads) parses text but does not validate an HTTP `Content-Type`. [`http.HTTPStatus`](https://docs.python.org/3/library/http.html#http.HTTPStatus) provides symbolic status codes. Model inherited scopes as an **ordered set union**: preserve first-seen order for deterministic output while deduplicating in expected O(total scopes) time. A tiny header parser is clearer and safer than ad hoc chains of `split()`.

**Triage/oracles.** Test absent, `application/json`, charset-qualified, and incorrect content types separately from malformed JSON. Exercise one space, repeated spaces, tabs where permitted, and empty credentials; assert that no credential reaches logs. Build a three-level security dependency tree and assert ordered, duplicate-free parent-plus-child scopes. Missing or malformed authentication should produce the intended 401 challenge behavior; insufficient scope after authentication should remain a distinct authorization case. Check `WWW-Authenticate` where the security scheme requires it, not just the numeric status.

## 2. Compatibility, deprecations & warnings — 4 instances

**Coverage.** `fastapi_14609` (drop `pydantic.v1`), `fastapi_14077` (Starlette version range), `fastapi_14605` (custom `FastAPIDeprecationWarning`), and `fastapi_14583` (warn on `pydantic.v1`). This is a phased migration: introduce the warning, make it visible/actionable, then remove support at the later base.

**Root cause.** Dependency compatibility had been treated as a packaging-only concern even though runtime behavior and imports had drifted. The warning defect is subtler: a plain `DeprecationWarning` is normally hidden outside `__main__`, so users can miss a migration notice entirely. A project-specific `UserWarning` subclass gives filtering a stable category without relying on default `DeprecationWarning` visibility.

**Python/DSA.** Use [`warnings.warn()`](https://docs.python.org/3/library/warnings.html#warnings.warn), a meaningful `stacklevel`, and [`warnings.catch_warnings()`](https://docs.python.org/3/library/warnings.html#warnings.catch_warnings) with `simplefilter("always")` in tests. [`importlib.metadata.version()`](https://docs.python.org/3/library/importlib.metadata.html#importlib.metadata.version) can diagnose installed versions, but feature detection is often more robust than comparing hand-written version strings. Treat compatibility work as a **finite migration state machine**: supported → warned → unsupported, with no silent skipped state.

**Triage/oracles.** Assert the warning category, message, and user-facing stack location; test both default filters and explicit capture. Run import and behavior smoke tests at both ends of the supported Starlette/Pydantic range. At removal, assert a clear import or runtime error for the unsupported path rather than an accidental downstream exception. Do not backport the final removal patch into the earlier warning-only base and call it equivalent.

## 3. Dependency injection & function/annotation handling — 13 instances

**Coverage.** `fastapi_13920` (PEP 695 `TypeAliasType`), `fastapi_14794` (`Response` as a dependency annotation), `fastapi_14372` (hashable `Depends`/`Security`), `fastapi_11355` (string annotations), `fastapi_14485` (`TYPE_CHECKING` names), `fastapi_14458` (callable classes), `fastapi_14448` (composed wrappers/partials), `fastapi_9753` (`partial`), `fastapi_5077` and `fastapi_9555` (wrapped callables), `fastapi_14419` (scope-aware caching), `fastapi_14301` (top-level function-scoped dependencies), and `fastapi_14262` (dependency cleanup scopes).

**Root cause.** The implementation lacked a single runtime model of “the callable.” Different branches inspected the wrapper, the partial, the underlying function, or `__call__`, producing inconsistent signature and generator-kind decisions. String annotation evaluation failed when a name existed only under `TYPE_CHECKING`; callable classes were mistaken for function instances; and special injected annotations were not recognized. Scope-aware caching also needed a key that represented semantic scope sets, while parameterless dependencies still needed the full dependency metadata path.

**Python/DSA.** [`inspect.signature(..., eval_str=True)`](https://docs.python.org/3/library/inspect.html#inspect.signature) evaluates string annotations but may raise `NameError`; the follow-up fallback is therefore narrower and safer than suppressing every exception. [`inspect.unwrap()`](https://docs.python.org/3/library/inspect.html#inspect.unwrap), [`functools.partial`](https://docs.python.org/3/library/functools.html#functools.partial), `inspect.isclass()`, and the generator/coroutine predicates must be composed deliberately. PEP 695’s [`TypeAliasType`](https://peps.python.org/pep-0695/) carries its aliased value in `__value__`. [`dataclasses.replace()`](https://docs.python.org/3/library/dataclasses.html#dataclasses.replace) updates frozen dependency metadata without mutation. Use a **normalization pipeline** for callable kind, a **dependency DAG** for execution, canonical tuples such as `tuple(sorted(set(scopes)))` for cache keys, and LIFO cleanup stacks.

**Triage/oracles.** Parameterize a matrix over sync/async, plain/wrapped/partial/class, and generator/non-generator callables; include combinations, not only one feature at a time. Add unresolved-only-at-runtime names, stringified annotations, special `Response` injection, frozen-object hashing, empty dependency parameter lists, and overlapping scope orders. Assert cache hits only for semantically equal keys and verify exact cleanup order. Chronology matters: `fastapi_11355` precedes the `NameError` fallback in `fastapi_14485`; the wrapper/partial/class patches are successive expansions of the same normalization problem.

## 4. Documentation & project automation — 3 instances

**Coverage.** `fastapi_15661` (release preparation), `fastapi_14492` (SPDX license example), and `fastapi_14487` (validation-error disclosure documentation).

**Root cause.** Manual release editing allowed version and changelog updates to drift, while an incorrect license identifier made the documented package metadata invalid. The documentation issue is security-relevant: re-raising raw validation exception strings can disclose submitted input and exception context that was never intended for an API response.

**Python/DSA.** Release automation should use [`re.fullmatch()`](https://docs.python.org/3/library/re.html#re.fullmatch) for complete version validation, anchored multiline patterns for targeted edits, and [`pathlib.Path.read_text()/write_text()`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.read_text) for explicit encoding. A small **validated transformation pipeline**—parse, validate, transform, verify, commit to disk—is safer than independent regex substitutions. For multi-file changes, stage outputs and replace files only after every validation succeeds; [`tempfile`](https://docs.python.org/3/library/tempfile.html) and `os.replace()` can support atomic publication.

**Triage/oracles.** Test valid and invalid versions, missing or duplicated anchors, unchanged input, repeated execution, and failure before any file is modified. Validate the license example against the intended SPDX expression. For error documentation, use a secret-like input and assert that neither the response nor logs reproduce it or the raw validation context. Documentation tests should assert the security property, not merely that a page builds.

## 5. Errors & developer experience — 2 instances

**Coverage.** `fastapi_14479` (invalid query annotation diagnostics) and `fastapi_14306` (endpoint metadata in tracebacks).

**Root cause.** A bare assertion reported that something was wrong without identifying the offending parameter, and framework-generated validation errors omitted the endpoint’s file, line, function, and route context. Assertions are also removable under optimization, making them unsuitable for validating user-supplied framework declarations.

**Python/DSA.** The [`assert` statement](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement) is for internal invariants, not external input validation. [`inspect.getsourcefile()` and `inspect.getsourcelines()`](https://docs.python.org/3/library/inspect.html#inspect.getsourcefile) can recover source metadata; [`traceback`](https://docs.python.org/3/library/traceback.html) formats exception context. PEP 657’s [fine-grained locations](https://peps.python.org/pep-0657/) explain why position metadata must be treated as optional across Python versions.

**Triage/oracles.** Assert that an invalid query declaration names its parameter and accepted category, without dumping its value. Trigger nested validation failures and assert endpoint function, route path, source file, and a valid line range. Run with and without optional position information and with optimized Python where relevant. The invariant is actionable, stable diagnostic context—not an exact traceback string tied to one CPython release.

## 6. OpenAPI, JSON Schema & schema metadata — 7 instances

**Coverage.** `fastapi_14986` (request-specific OpenAPI/Swagger escaping), `fastapi_14463` (duplicated nested `anyOf` references), `fastapi_14459` and `fastapi_14455` (security scope propagation/deduplication), `fastapi_14266` (application-level security), `fastapi_13713` (`external_docs`), and `fastapi_14791` (validation-error schema shape).

**Root cause.** A cached schema was being customized in place for request-specific `root_path`; shallow-copying additional responses left nested dictionaries shared, so repeated generation accumulated references. Security aggregation needed to merge inherited scopes and preserve top-level requirements rather than overwrite them. Two metadata contracts were simply not forwarded or had fallen behind runtime: external documentation and validation-error `input`/`ctx` fields. Swagger UI JSON also needed escaping before embedding in HTML.

**Python/DSA.** [`copy.deepcopy()`](https://docs.python.org/3/library/copy.html#copy.deepcopy) is appropriate at the nested response boundary; shallow `dict.copy()` copies only the container. Use **copy-on-write for cached schemas**, ordered dictionaries for deterministic security aggregation, and ordered-set scope deduplication. [`json.dumps()`](https://docs.python.org/3/library/json.html#json.dumps) produces JSON, but JSON alone is not automatically safe inside a `<script>` element; escaping `<`, `>`, and `&` as Unicode escapes prevents HTML-significant character sequences while retaining JSON values.

**Triage/oracles.** Generate OpenAPI repeatedly and across different `root_path` requests; assert byte-identical output where configuration is unchanged and no cross-request leakage. Reuse app-level responses with union models and assert that nested `anyOf` does not grow. Cover parent/child security schemes, repeated scopes in different orders, app-level requirements, external documentation, and validation errors containing input/context. Include `</script>`, `<`, `>`, and `&` in schema strings and verify both HTML safety and JSON round-trip equality.

## 7. Parameter & request-body parsing — 8 instances

**Coverage.** `fastapi_15589` (underscore-header rejection), `fastapi_14360` and `fastapi_14371` (parameter aliases), `fastapi_14356` and `fastapi_14303` (extra non-body/form lists), `fastapi_13537` (empty form strings), `fastapi_14616` (`Json[list[T]]`), and `fastapi_11194` (declaration-order-independent `File`/`Form`).

**Root cause.** Alias canonicalization was inconsistent, processed-key bookkeeping omitted fields, and multidict input was sometimes reduced to a single last value. Empty strings were confused with missing values; a JSON-decoded list was treated as an ordinary repeated form sequence; and body-field classification depended on whether `File` appeared before or after `Form`.

**Python/DSA.** Build an explicit **symbol table** mapping each external alias to one canonical internal field, plus a set of processed external keys. Preserve multivalue shape through the multidict’s `getlist()` operation rather than normal dictionary indexing. Distinguish three states—absent, present-empty, present-valued—with a sentinel rather than truthiness. Model body fields as a tagged shape (scalar, repeated sequence, JSON-decoded value, upload) before validation; this avoids order-dependent branching and expected O(fields + values) parsing.

**Triage/oracles.** Test validation and serialization aliases, hyphen/underscore header variants, repeated keys in different orders, and duplicate-key policy. Distinguish an omitted form value from `""`, especially with `None` and empty-string defaults. Test JSON arrays, malformed JSON, nested lists, and scalar/list ambiguity. Permute `File` and `Form` declarations and assert identical extraction. Regression tests should inspect both parsed values and the set of consumed keys so extra parameters cannot silently reappear elsewhere.

## 8. Pydantic, models & type handling — 11 instances

**Coverage.** `fastapi_12942` and `fastapi_14512` (discriminated unions, including `Annotated`/`Body`), `fastapi_14349` and `fastapi_14361` (`$ref` collisions/missing keys), `fastapi_14482` (arbitrary types), `fastapi_14297` and `fastapi_14430` (optional sequences and both union spellings), `fastapi_13207` (computed fields with shared input/output schemas), `fastapi_14246` (nested-model schema separation), `fastapi_14186` (Pydantic compatibility warnings), and `fastapi_14953` (byte schema metadata).

**Root cause.** Annotation introspection inspected the outer wrapper rather than the semantic type, causing `Annotated` metadata and PEP 604 unions to be missed. JSON Schema compatibility remapping assumed `$ref` was framework-owned and always present. Model-field reconstruction dropped `FieldInfo` metadata or arbitrary-type configuration, nested-model traversal was incomplete, input/output schema modes were selected incorrectly, and bytes used an obsolete or inaccurate binary representation.

**Python/DSA.** [`typing.get_origin()` and `get_args()`](https://docs.python.org/3/library/typing.html#typing.get_origin) should drive a recursive **annotation normalizer** that understands `Annotated`, `typing.Union`, and `types.UnionType`; [PEP 604](https://peps.python.org/pep-0604/) defines the latter spelling. Treat JSON Schema as a graph with arbitrary user property names: access optional keys defensively and keep framework references in a separate namespace. Nested-model discovery needs graph traversal with a visited set. Preserve field metadata by transformation rather than reconstructing a reduced field from scratch.

**Triage/oracles.** Run equivalent cases through `Optional[T]`, `T | None`, `Annotated[..., Body(...)]`, nested sequences, and discriminated unions. Include both a user property literally named `$ref` and a schema with no `$ref`. Assert arbitrary-type config, computed-field visibility in each schema mode, nested-model input/output separation, and byte `contentMediaType`. `fastapi_14297` handles `typing.Union`; the later `fastapi_14430` adds `types.UnionType`, so test both rather than choosing one syntax in the suite.

## 9. Responses, SSE & streaming — 7 instances

**Coverage.** `fastapi_15030` and `fastapi_15588` (SSE support and field validation), `fastapi_14962` (typed JSON serialization), `fastapi_14964` (response deprecations), `fastapi_15023` (streaming documentation), `fastapi_14099` (cleanup after streaming), and `fastapi_9425` (stringified `None` return annotations).

**Root cause.** SSE needs a wire-format state machine, not arbitrary string interpolation: multiline `id` or `event` values can create invalid events. Typed iterables and response models expose places where returning intermediate Python objects causes an extra or wrong serialization path. The critical lifecycle defect was exiting dependency or upload-file contexts before the response iterator had finished. Separately, the string annotation `"None"` was not normalized to `NoneType`, so a bodiless response could be assigned a response model.

**Python/DSA.** [`contextlib.AsyncExitStack`](https://docs.python.org/3/library/contextlib.html#contextlib.AsyncExitStack) and `aclosing()` encode LIFO asynchronous cleanup; the stack must remain active until streaming terminates. [`inspect.signature(..., eval_str=True)`](https://docs.python.org/3/library/inspect.html#inspect.signature) or equivalent annotation normalization handles stringified `None`. Treat serialization as a **typed pipeline** and streaming as a **lazy iterator state machine** with bounded buffering; never materialize a potentially infinite SSE stream to simplify validation.

**Triage/oracles.** Record events in an async generator’s `finally` block and assert dependency/upload cleanup occurs after the last item, including client disconnect and iterator exception. Reject CR/LF-containing SSE `id` and `event` values while preserving valid multiline `data` encoding. Test typed iterable responses and the intended Pydantic serialization path without requiring a particular third-party implementation. Test both `None` and `"None"` annotations and the documented deprecation-warning path.

## 10. Routing, application APIs & lifecycle — 8 instances

**Coverage.** `fastapi_15280` (`app.vibe()`), `fastapi_14258` (self-including routers), `fastapi_14851` and `fastapi_14873` (`on_event` compatibility and initialization order), `fastapi_15800` (frontend static routes), `fastapi_15785` (route-context iteration), `fastapi_15763` (empty paths), and `fastapi_15745` (route-object identity).

**Root cause.** Router inclusion is graph composition, but self-inclusion lacked a cycle check. Lifespan compatibility work built a default context before startup/shutdown handler lists had been initialized, a construction-order regression rather than an async-algorithm bug. Other routes lost identity during internal reconstruction, empty paths were normalized incorrectly, and new frontend/route-context/decorator APIs needed registration paths that preserved the same invariants.

**Python/DSA.** Model inclusion as a directed graph and reject direct or indirect cycles using a visited set; use object identity where route instances themselves matter. Keep route storage ordered for deterministic matching. Lifespan composition belongs in an [`AsyncExitStack`](https://docs.python.org/3/library/contextlib.html#contextlib.AsyncExitStack)-style LIFO owner, but all fields must be initialized before constructing that owner. Path joining should be a dedicated function with explicit empty/prefix/slash cases, not repeated string concatenation.

**Triage/oracles.** Test direct and two-node self-inclusion, repeated inclusion of a valid router, exact startup/shutdown order, and exceptions during startup. Assert `included_route is original_route` where identity is part of the contract, and iterate route contexts without relying on a replaced route list. Cover `""`, `"/"`, prefixed, and prefixless routes without accidental `//`. For frontend mounting, test index/fallback behavior and path traversal rejection. `fastapi_14873` is a follow-up to `fastapi_14851`: reproduce on the latter’s base before diagnosing the initialization order independently.

# Requests and HTTPX families

## 11. Authentication configuration — 1 instance

**Coverage.** `requests_7205` (empty `netrc` entries).

**Root cause.** Python’s `netrc` interface can produce a credential tuple containing only empty strings. Testing the tuple itself is truthy is therefore insufficient: Requests treated an empty default entry as usable credentials instead of ignoring it. This is a sentinel-validation bug, not a general failure of `netrc` parsing.

**Python/DSA.** [`netrc.netrc().authenticators()`](https://docs.python.org/3/library/netrc.html#netrc.netrc.authenticators) returns a `(login, account, password)`-style tuple or a null result depending on the entry. The patch’s `any(_netrc)` check expresses “at least one meaningful credential field” without mistaking container truthiness for content. Keep credential selection as a short, deterministic precedence chain: explicit request credentials, valid `netrc` credentials, then no implicit authentication.

**Triage/oracles.** Cover no entry, a real entry, `('', '', '')`, partially populated fields, malformed files, and platform permission errors. Assert both the selected authentication object and that an empty entry does not suppress later behavior unexpectedly. Never put passwords or complete `netrc` contents in failure messages. Tests should inject a fake authenticator result rather than depend on a developer’s home directory.

## 12. Dependency compatibility & HTTP constants — 2 instances

**Coverage.** `requests_6757` (urllib3 1.26.x compatibility) and `requests_6592` (symbolic status name for 425).

**Root cause.** A supported dependency range included behavior that the test and compatibility layers did not fully exercise, while the status-code lookup had an incomplete alias for HTTP 425. One is a version-matrix defect; the other is an incomplete finite mapping.

**Python/DSA.** [`http.client.responses`](https://docs.python.org/3/library/http.client.html#http.client.responses) and [`http.HTTPStatus`](https://docs.python.org/3/library/http.html#http.HTTPStatus) are useful references, but library compatibility aliases must still map the exact wire code expected by the supported versions. A status table is a finite immutable mapping, so validation is O(1) per lookup and should include both symbolic-to-code and code-to-symbol behavior. Use [`importlib.metadata`](https://docs.python.org/3/library/importlib.metadata.html) to report the actual dependency version in reproduction output.

**Triage/oracles.** Run a real installed-dependency matrix at minimum and maximum supported urllib3 versions, including HTTPS and proxy tests where compatibility code branches. Assert that 425 and `TOO_EARLY` resolve consistently and that neighboring status aliases are unchanged. Avoid patching a test to hide a failure that also occurs in production code; classify each failure as product incompatibility, test-only API drift, or an intentionally unsupported combination.

## 13. Protocol typing & duck-type compatibility — 1 instance

**Coverage.** `requests_7505` (dynamic file-like proxies and protocol checks).

**Root cause.** Runtime-checkable protocol `isinstance()` did not recognize every object whose `read` capability is supplied dynamically through `__getattr__`. Requests then rejected valid wrappers or handled them inconsistently at different call sites. Static structural typing and runtime attribute discovery are related but not identical contracts.

**Python/DSA.** PEP 544’s [runtime-checkable protocol rules](https://peps.python.org/pep-0544/#runtime-checkable-decorator-and-runtime-checkable-protocols) check protocol compatibility only within defined runtime limits; they do not prove method signatures or every dynamic proxy. [`hasattr()`](https://docs.python.org/3/library/functions.html#hasattr) invokes attribute lookup and returns false only when lookup raises `AttributeError`; other exceptions propagate. A shared `has_read()` capability helper removes divergent checks, but presence alone still does not prove callability or stream semantics.

**Triage/oracles.** Use a proxy with no concrete `read` attribute whose `__getattr__` returns a working method, a normal `io` object, an object without `read`, and one whose attribute hook raises a non-`AttributeError`. Exercise both text and byte streams where supported. Assert consistent classification across request-body and multipart paths. Do not use `inspect.getattr_static()` as a drop-in replacement: avoiding dynamic execution would also avoid discovering the proxy capability that this fix is meant to support.

## 14. Redirects & connection/stream lifecycle — 2 instances

**Coverage.** `requests_7328` (self-referential redirect history) and `httpx_3672` (server parser, keep-alive, and stream shutdown).

**Root cause.** Requests appended the current response to a history structure that could already represent that response, creating a self-reference and defeating the intended finite-chain ownership. HTTPX’s server side needed a fuller connection state reset: consume a request before keep-alive reuse, reset the parser, close streams on exit, and avoid turning normal shutdown into an unintended keyboard-exception path.

**Python/DSA.** Redirect history is an ordered list with the invariant `current_response not in history` by identity and no cycles in the history graph. Take the prior-history snapshot before appending. Connection reuse is a **state machine** with explicit `reading → complete → reset → reusable/closed` transitions; resource owners should follow [`contextlib`](https://docs.python.org/3/library/contextlib.html) cleanup semantics. [`gc`](https://docs.python.org/3/library/gc.html) can help diagnose cycles, but identity assertions are a more deterministic regression oracle than exact garbage-collection timing.

**Triage/oracles.** Build zero-, one-, and multi-redirect chains; assert exact length, order, absence of self by `is`, and release after references are dropped. For HTTPX, send sequential requests on one keep-alive connection, a request with an unread or partial body, malformed input, client disconnect, and server shutdown. Assert that each parser starts clean, streams close once, and a later request cannot consume bytes left from its predecessor.

## 15. Request bodies, file wrappers & content length — 3 instances

**Coverage.** `requests_7502` and `requests_7433` (`__getattr__`-based wrappers in multipart/body detection) and `requests_6589` (encoded byte length for strings).

**Root cause.** Two body-preparation paths used different capability checks, so wrappers accepted in one path were treated as non-streams in another. Separately, character count was used where HTTP content length requires encoded octets; `len(text)` equals UTF-8 byte length only for a subset of text.

**Python/DSA.** Centralize stream detection with the same capability helper discussed in family 13. The [`io` protocol](https://docs.python.org/3/library/io.html) distinguishes readable, seekable, and tell-capable objects; length discovery must not consume a non-seekable stream or change its current position. Compute string length as `len(text.encode(encoding))`, with the actual request encoding. This is an adapter problem plus a units bug: O(1) metadata queries are preferable when available, with a non-destructive fallback.

**Triage/oracles.** Reuse the same dynamic proxy across `_encode_files` and `prepare_body`, and compare with regular files, `BytesIO`, empty streams, and non-seekable objects. Include multibyte ASCII/non-ASCII mixtures and astral characters; assert `Content-Length == len(encoded_body)`, not `len(text)`. Save and restore stream position where the API promises non-destructive length inspection. Family 13 and this family should share tests so a future refactor cannot reintroduce divergent detection.

## 16. Response parsing & exception serialization — 2 instances

**Coverage.** `requests_7309` (malformed `Content-Type` parameters) and `requests_6629` (pickling `JSONDecodeError`).

**Root cause.** Header parameter parsing accepted a token without `=` as though it were a well-formed parameter. The exception defect came from multiple inheritance: the selected method-resolution path inherited a reduction implementation whose arguments did not reconstruct Requests’ combined JSON exception correctly, breaking pickle and process-pool transport.

**Python/DSA.** A header parameter parser should be a deterministic tokenizer that requires the expected `name=value` production and handles quoted strings deliberately; `str.partition("=")` is useful only when the result is validated. Python’s [MRO and attribute lookup](https://docs.python.org/3/tutorial/classes.html#multiple-inheritance) explain why the inherited `__reduce__` may not match the subclass constructor. [`pickle`](https://docs.python.org/3/library/pickle.html) uses the reduction protocol; it must round-trip exception type, arguments, and useful attributes.

**Triage/oracles.** Test valid parameters, quoted separators, empty names/values, missing `=`, and repeated parameters with a defined policy. Round-trip the exception through every supported pickle protocol and through a `multiprocessing` worker using the spawn start method, not only same-process `pickle.loads()`. Assert type, message, and original document/position attributes where exposed. Never use unpickling of untrusted data as a test shortcut; construct the payloads locally.

## 17. URLs, paths & proxy boundary handling — 3 instances

**Coverage.** `requests_7427` (proxy hostname boundary), `requests_6644` (collapse leading path separators), and `requests_7315` (preserve leading slashes for signed URLs).

**Root cause.** Proxy matching used a suffix relationship without requiring a DNS-label boundary, allowing a hostname such as `notexample.com` to be treated as inside an `example.com` rule. The path issue is a genuine historical conflict: `requests_6644` collapsed `//...` to `/...` to avoid urllib3 reparsing, whereas the later `requests_7315` deletes that workaround because the transformation changes signed S3 object keys and invalidates signatures.

**Python/DSA.** [`urllib.parse.urlsplit()`](https://docs.python.org/3/library/urllib.parse.html#urllib.parse.urlsplit) separates scheme, host, port, path, query, and fragment; use structured components instead of arbitrary suffix or slash manipulation. Host matching should canonicalize case/port as required, strip a rule’s leading dot, then accept exact equality or a `"." + host` suffix boundary. A signed request path is opaque bytes for signature purposes: normalize only where the transport contract explicitly permits it.

**Triage/oracles.** Test exact domains, subdomains, deceptive suffixes, leading-dot rules, ports, and case variants. Add `https://bucket.s3.amazonaws.com//key_name` with a signature over the raw path and assert the request target remains `//key_name`; separately test proxy absolute-form URLs and fragments/authentication removal. Do **not** apply the old slash-collapsing line after the later preservation fix. Resolve the original urllib3 confusion at the URL/transport parsing layer and keep both the security boundary and signed-path oracle in the final suite.

# Rich and terminal UI families

## 18. Export & output formats — 2 instances

**Coverage.** `rich_3105` (export styling/markup integration) and `rich_3043` (HTML export template).

**Root cause.** The HTML export path had an incomplete or malformed template and inconsistent integration between rendered text, styles, and markup. This is a serialization-boundary defect: a valid in-memory sequence of styled spans does not guarantee a complete, escaped HTML document.

**Python/DSA.** Use [`html.escape()`](https://docs.python.org/3/library/html.html#html.escape) for text inserted into HTML, not JSON escaping or terminal ANSI rules. [`string.Template`](https://docs.python.org/3/library/string.html#string.Template) or an equivalent controlled template can keep static scaffolding separate from generated content. Treat export as a deterministic span-to-markup transformation: merge only spans with identical serialized style, escape text once, and emit structural tags independently of content.

**Triage/oracles.** Parse the result with an HTML parser and assert a complete document, expected `<pre>`/style structure, and no unresolved placeholders. Include `&`, `<`, `>`, quotes, non-ASCII text, markup-like input, adjacent styles, and empty output. Verify that terminal markup is interpreted only according to the export API’s setting and that user text cannot inject raw tags. Prefer structural assertions plus a small golden document over a brittle whole-file snapshot alone.

## 19. Import-time performance — 1 instance

**Coverage.** `rich_4070` (defer rarely used imports in `Console` and `RichHandler` paths).

**Root cause.** Eager module-level imports pulled optional or rarely used subsystems into every import, enlarging the startup import graph even when the features were never exercised. The problem is initialization graph breadth, not rendering-loop asymptotics.

**Python/DSA.** Local imports and [`typing.TYPE_CHECKING`](https://docs.python.org/3/library/typing.html#typing.TYPE_CHECKING) can prune runtime edges while retaining static annotations; [`importlib.import_module()`](https://docs.python.org/3/library/importlib.html#importlib.import_module) is useful when import itself must be deferred or parameterized. Python caches modules in [`sys.modules`](https://docs.python.org/3/library/sys.html#sys.modules), so benchmark cold startup in fresh processes. Use [`timeit`](https://docs.python.org/3/library/timeit.html), [`profile`](https://docs.python.org/3/library/profile.html), or `-X importtime` rather than timing repeated imports in one interpreter.

**Triage/oracles.** Measure median cold-process wall time and imported-module count before and after, with variance reported. Assert that deferred modules are absent immediately after the base import and appear after the feature is used. Exercise optional-dependency failure, threads, circular-import-prone paths, and all public signatures. A performance patch passes only if behavior is unchanged and the target import-graph edges, not just a noisy timing number, are actually removed.

## 20. Live displays, progress & prompts — 4 instances

**Coverage.** `rich_3934` (empty live display), `rich_3905` (disabled progress output), `rich_3882` (raw markup in prompt errors), and `rich_3052` (case-insensitive choices).

**Root cause.** Live display state retained stale height or blank-line information when content became empty; disabled progress still crossed the output boundary; prompt error rendering used the wrong markup mode; and case normalization was performed repeatedly without a stable mapping back to the configured choice.

**Python/DSA.** Model live/progress rendering as a **state machine** with an explicit invariant: rendered height equals the current renderable’s height, including zero. Output-disabled state should be checked at the emission boundary, not only in update methods. For prompts, use a dictionary `normalized_choice → canonical_choice`, giving expected O(1) lookup and preserving the exact configured return value. Keep presentation markup as a deliberate rendering option rather than inheriting it accidentally from the prompt.

**Triage/oracles.** Start and stop an empty live region, transition nonempty → empty → nonempty, and capture every write. With progress disabled, assert zero console output under updates and refreshes. Include markup metacharacters in invalid prompt input and error messages. Test upper-, lower-, and mixed-case input, colliding normalized choices, custom normalizers, and the canonical returned string. Run TTY and non-TTY cases because refresh and line-erasure paths differ.

## 21. Markdown & markup parsing/rendering — 6 instances

**Coverage.** `rich_4079`, `rich_3130`, `rich_3064` (table/inline rendering), `rich_3942` (Markdown styles), `rich_3469` (superfluous whitespace), and `rich_3063` (trailing-backslash escaping).

**Root cause.** Inline Markdown tokens were converted into new `Text` objects and then stylized wholesale, which could erase or override nested code/link highlighting. Table construction and whitespace handling exposed additional token-composition gaps. Escaping logic failed when the final character was a backslash because the parser lacked an explicit terminal escape state.

**Python/DSA.** Treat parsing as a token stream and rendering as composition of styled span intervals. When a token is a plain string, append it with the current context style; when it is already `Text`, append the object without flattening its existing spans. [`re.escape()`](https://docs.python.org/3/library/re.html#re.escape) is for literal regex text, not a substitute for a Markdown escape grammar. Build output with list/`Text.append` operations rather than repeated immutable string concatenation, avoiding unnecessary O(n²) copying.

**Triage/oracles.** Test inline code containing markup characters, links inside tables, nested emphasis, empty cells, multiline rows, leading/trailing spaces, and backslashes at every position—especially end of input. Assert both plain text and style spans; matching visible text alone misses the original defect. `rich_3130` stylized token `Text` objects, while the later `rich_4079` distinguishes strings from existing `Text`; use the later composition rule when constructing the final design.

## 22. Syntax highlighting & URL recognition — 4 instances

**Coverage.** `rich_3782` and `rich_3296` (syntax padding/background) and `rich_3454` and `rich_3067` (`@` and `~` in URLs).

**Root cause.** Highlight width and background calculations omitted configured padding, so the emitted style interval did not cover the visible syntax block. URL recognition used character classes that omitted valid path/user-info characters, causing highlighting to stop at `@` or `~`.

**Python/DSA.** Syntax layout is interval arithmetic over **display cells**, not Python code-point count. Padding must be included exactly once in both width and background-span calculations. URL recognition is a lexer character-class problem: [`re.compile()`](https://docs.python.org/3/library/re.html#re.compile) with readable verbose patterns and explicit escaping is easier to audit than repeated ad hoc edits. Do not “fix” a character class by accepting arbitrary trailing punctuation.

**Triage/oracles.** Assert rendered cell widths and style coverage for zero, symmetric, and asymmetric padding, with wide Unicode characters and background overrides. Test URLs containing `~`, `@`, percent escapes, ports, query strings, and fragments, followed by `)`, `]`, `.`, `,`, or whitespace. Assert the exact recognized span and that adjacent prose is not highlighted. The key invariant is agreement among token span, emitted segment span, and terminal cell extent.

## 23. Tables, panels & visual layout — 5 instances

**Coverage.** `rich_3718` (panel-title background), `rich_3938` (soft-wrap background), `rich_3935` (padding width), `rich_3518` (highlight inheritance for columns created by `add_row`), and `rich_2725` (box-element order).

**Root cause.** Layout style precedence and geometry were calculated in separate paths. Titles and soft-wrapped lines lost their container background, padding was omitted or double-counted in available width, implicitly created columns failed to inherit table highlighting, and border segments were emitted in an order inconsistent with the box model.

**Python/DSA.** Use an explicit **box-layout model**: outer width = left border + left padding + content cells + right padding + right border. Style composition needs a defined precedence order, while box drawing needs a stable z/order contract. Segments should be an ordered sequence whose text, style, and control fields remain aligned; visible width must be derived from cell measurement rather than `len()`.

**Triage/oracles.** Test panel titles with inherited and explicit styles, soft-wrapped backgrounds on every line, odd/even and asymmetric padding, narrow widths, and wide characters. Create columns both explicitly and through `add_row`; assert identical highlighting. For box ordering, inspect segment order as well as the final rendered grid. Useful invariants are nonnegative content width, equal intended line widths, complete background coverage, and exactly one border element at each junction.

## 24. Terminal detection, ANSI & console I/O — 8 instances

**Coverage.** `rich_4077` (proxy `isatty`), `rich_4076` (preserve trailing newlines), `rich_4075` (empty print with `end`), `rich_3777` and `rich_3675` (TTY environment overrides), `rich_3468` (broken pipe), `rich_3470` (record/capture state), and `rich_3278` (private escape-sequence filtering).

**Root cause.** File proxies did not expose the complete interface Rich expected; [`str.splitlines()`](https://docs.python.org/3/library/stdtypes.html#str.splitlines) does not preserve a final empty line in the way the renderer needed; and empty writes were incorrectly assumed to be no-ops even when `end` contained output. Terminal capability overrides were incomplete, pipe shutdown crossed an unhandled OS boundary, recording/capture state was not balanced, and ANSI filtering lacked states for problematic private sequences.

**Python/DSA.** Delegate the file-like protocol deliberately—especially `isatty()`—rather than assuming every proxy inherits it. [`print()`](https://docs.python.org/3/library/functions.html#print) writes both converted objects and `end`; empty object text does not imply empty output. Python’s [SIGPIPE note](https://docs.python.org/3/library/signal.html#note-on-sigpipe) explains the platform-sensitive translation to `BrokenPipeError`. ANSI stripping should be a scanner/state machine over escape introducers, parameters, intermediates, and final bytes, not one greedy regex. Recording is balanced state best managed with a context manager.

**Triage/oracles.** Use proxies whose `isatty` is true, false, absent, or raises; test `"a"`, `"a\n"`, `"a\n\n"`, and empty strings. Assert `print("", end=":")` emits exactly `:`. Build an environment-variable truth table with explicit override precedence. Exercise closed pipes and platform-appropriate signal behavior without changing global handlers in tests. Nest or interleave recording/capture and assert restoration after exceptions. Feed complete, split, malformed, and private ANSI sequences and assert that ordinary adjacent text survives.

## 25. Text & style data-structure internals — 4 instances

**Coverage.** `rich_3480` (self-append infinite loop), `rich_3471` (control tokens in `append_tokens`), `rich_2943` (stale hash after metadata clear), and `rich_3061` (tab expansion with styles).

**Root cause.** Appending a `Text` object to itself iterated a live span collection that the same operation kept extending. Token append allowed control-only entries into a text path that could not handle them. Metadata participating in a derived hash was mutated without invalidating the cached value. Tab expansion changed string offsets but did not apply a corresponding transformation to style spans.

**Python/DSA.** Iterate over a snapshot such as `list(spans)` when mutation is possible; the O(n) snapshot prevents unbounded growth during traversal. A cached hash must be a pure function of all hash-relevant state, with invalidation on every mutation. Text plus spans is an **interval-annotated sequence**: every edit must transform both the character buffer and affected `[start, end)` intervals. Tab expansion is a piecewise offset map based on tab stops, not a constant shift.

**Triage/oracles.** Self-append empty, short, and heavily styled text under a timeout; assert finite spans and expected duplication. Include control tokens between ordinary tokens. Compare hash/equality behavior before and after metadata changes and repeated cache access. For tabs, vary tab stops, style boundaries inside and across expansions, multiple tabs, and wide characters. Assert that resulting text and spans describe the same offsets and that no span points outside the new buffer.

## 26. Tracebacks, introspection & object representation — 6 instances

**Coverage.** `rich_3894` (non-string `__qualname__`), `rich_3486` (fine-grained error positions), `rich_3772` (recursive exception graphs), `rich_3676` (exception notes), `rich_3472` (missing dataclass field attributes), and `rich_3006` (custom-class signatures/defaults).

**Root cause.** Introspection code treated metadata as guaranteed and well typed. Classes can expose unusual `__qualname__` values; position information is version- and exception-dependent; exception `__cause__`/`__context__` links can form cycles; PEP 678 notes need explicit traversal; dataclass field metadata does not guarantee a corresponding instance attribute; and class signature selection can involve metaclasses, `__new__`, `__init__`, and custom `__signature__`.

**Python/DSA.** [`inspect.signature()`](https://docs.python.org/3/library/inspect.html#inspect.signature) documents class-callable selection and should be guarded for unsupported callables. [`dataclasses.fields()`](https://docs.python.org/3/library/dataclasses.html#dataclasses.fields) describes fields, while actual representation still needs safe attribute access. [`BaseException.add_note()`](https://docs.python.org/3/library/exceptions.html#BaseException.add_note) and PEP 678 define notes. PEP 657 positions are optional metadata. Exception rendering is graph traversal: track visited object identities before following cause/context links to guarantee termination.

**Triage/oracles.** Construct a class with a non-string qualname, exceptions with and without position data, a self-cycle and a two-object cause/context cycle, and multiple notes. Use dataclasses with fields lacking ordinary instance values and custom classes with metaclass `__call__`, custom `__signature__`, and defaulted parameters. Assert safe fallback representation, note order, useful source positions when present, and finite output. Avoid exact caret snapshots across unsupported Python versions; assert presence and valid ranges conditionally.

## 27. Unicode, graphemes & cell-width segmentation — 8 instances

**Coverage.** `rich_3930` (grapheme support), `rich_3944` (font/width edge behavior), `rich_3953` (ZWJ and width-table edge cases), `rich_4006` (`split_graphemes` non-progress), `rich_3535` (single-cell fast-path regex), `rich_3506` and `rich_3521` (cell splitting), and `rich_3180` (double-width wrapping).

**Root cause.** Earlier code conflated code-point indices with terminal-cell offsets and lacked a complete grapheme state machine. Some ZWJ, variation-selector, control, or malformed-cluster branches failed to advance the input index, producing infinite loops. Width lookup tables were incomplete or inconsistently searched, and the single-cell regex fast path disagreed with the general algorithm. Splitting at a cell boundary could cut through a double-width character, while wrapping sometimes dropped it.

**Python/DSA.** Python string indexing and `len()` operate on code points, not user-perceived graphemes or terminal cells; the [Unicode HOWTO](https://docs.python.org/3/howto/unicode.html) supplies the basic distinction. [`unicodedata`](https://docs.python.org/3/library/unicodedata.html) is useful metadata but `east_asian_width()` or `combining()` alone does not implement emoji grapheme width. Use Unicode’s [UAX #29 segmentation rules](https://www.unicode.org/reports/tr29/) and [UAX #11 width definitions](https://www.unicode.org/reports/tr11/) as the policy baseline, tempered by terminal behavior. Sorted width intervals support [`bisect`](https://docs.python.org/3/library/bisect.html) lookup in O(log U), while segmentation remains O(n) if every branch advances. Cell splitting may search near a proportional index estimate but must correct using measured cells.

**Triage/oracles.** The strongest segmentation invariant is: spans exactly partition every input index with no gaps or overlaps, each iteration strictly increases the index, and total width equals the sum of cluster widths—including zero-cell clusters. Test combining marks, ZWJ emoji, variation selectors, regional indicators, controls, repeated/malformed joiners, empty input, and non-BMP characters under a timeout. Compare fast and general paths on every character around each regex boundary. Split before, inside, and after double-width characters; if a glyph cannot occupy one cell, assert the documented space-substitution behavior rather than dropping it. Record Unicode-data and terminal versions: actual fonts/terminals can disagree, so the implementation’s policy must be deterministic even when rendering is not.

# Cross-family design and triage synthesis

## Recurring invariants and suitable data structures

| Contract | Recommended structure/algorithm | Core invariant | Typical cost |
|---|---|---|---|
| Dependency or router graph | Adjacency map plus DFS/BFS visited set | No unguarded recursive revisit; invalid cycles rejected | O(V + E) |
| Ordered scopes/routes/security | Ordered dict or list plus membership set | Deterministic first-seen order; no duplicates | O(n) aggregate |
| Dependency cache | Canonical immutable tuple key | Semantically equal scope orders share a key; different scopes do not | O(s log s) canonicalization |
| Nested schema ownership | Deep copy at mutable plugin boundary; copy-on-write cache | One request/model cannot mutate another’s schema | Proportional to copied subgraph |
| Streaming/dependency resources | `ExitStack`/`AsyncExitStack`, iterator state machine | LIFO cleanup after final iteration or abort | O(resources) cleanup |
| Redirect history | Ordered list, snapshot before append | No current/self response and no cycle | O(r) chain |
| Styled text | Character buffer plus ordered `[start, end)` spans | Every edit keeps text and span coordinates aligned | O(n + spans) transformation |
| Grapheme/ANSI parsing | Explicit state machine with monotonic input cursor | Every branch consumes input or reaches a defined terminal state | O(n) |
| Unicode width table | Sorted nonoverlapping intervals plus binary search | Lookup agrees with general path and data version | O(log U) per lookup |
| Case-insensitive choices | Normalized-key dict to canonical value | Returned value is the configured canonical choice | O(n) build, O(1) expected lookup |

The repeated lesson is to optimize only after restoring the contract. A cache cannot repair stale schema ownership; a regex fast path cannot disagree with the general segmenter; and a proportional index estimate cannot replace cell measurement. Conversely, once invariants hold, binary search, snapshots, canonical keys, and conservative fast paths provide substantial practical speedups.

## Patch ordering and compatibility hazards

| Instances | Relationship | Integration guidance |
|---|---|---|
| `requests_6644` → `requests_7315` | Later patch deletes the earlier slash-collapsing workaround | Preserve raw leading slashes; resolve transport parsing without changing signed paths. |
| `fastapi_11355` → `fastapi_14485` | String-evaluation fix followed by unresolved-name fallback | Catch the specific `NameError` case; retain string evaluation where names resolve. |
| `fastapi_9555` / `fastapi_5077` / `fastapi_9753` → `fastapi_14448` / `fastapi_14458` | Wrapper and partial support expands to composition and callable-class guards | Implement one normalization pipeline and a combination matrix, not independent booleans. |
| `fastapi_14297` → `fastapi_14430` | Optional-sequence handling expands from `typing.Union` to PEP 604 | Normalize both union origins in the same branch. |
| `fastapi_14851` → `fastapi_14873` | Lifespan reimplementation followed by constructor-order correction | Initialize handler lists before building the default lifespan context. |
| `rich_3130` → `rich_4079` | Inline table rendering refined to preserve existing `Text` styling | Append strings with context style and existing `Text` without flattening spans. |
| `rich_3930` → `rich_3944` / `rich_3953` / `rich_4006` | Grapheme implementation followed by font, ZWJ, and progress hardening | Treat segmentation as a versioned data-plus-state-machine subsystem. |

`created_at` is useful evidence within the supplied dataset, not a substitute for upstream merge topology. Always inspect `base_commit` and rebase the semantic fix onto the actual target. In particular, two individually correct historical patches can express incompatible policies at a later base.

## A compact regression-test checklist

A high-quality task solution should usually contain four layers of tests:

1. **The original reproducer**, minimized to one public API call and one assertion about the contract.
2. **Boundary cases**, including empty input, absent metadata, repeated input, mixed types, unusual declaration order, and malformed syntax.
3. **Composition cases**, such as wrapped partial async generators, nested security scopes, nested schemas, or graphemes inside padded styled table cells.
4. **Operational behavior**, including cleanup after exceptions, no non-progress loops, stable cache behavior, byte-accurate lengths, and version-specific warning visibility.

For parser and renderer families, add property-based or table-driven invariants rather than relying only on golden output. For security-sensitive families, assert what is *not* emitted: no raw credentials, no unescaped script terminator, no leaked validation input, no out-of-domain proxy match, and no modified signed path.

# Open questions and where the evidence runs out

Confidence is high for family membership and the immediate implementation mechanisms because the supplied patches and test patches directly expose them. Confidence is necessarily lower when extrapolating those mechanisms into a universal design across different historical bases or dependency versions.

This research did not check out all 129 repositories or execute their full test suites; it is static analysis of the supplied evidence plus documentation research. A solution agent must still run the relevant suite at each `base_commit`. The CSV/JSONL also does not replace each repository’s complete dependency lockfile or platform support policy, so version matrices must be recovered from the target tree.

Some competing behaviors are policy decisions rather than facts that documentation can settle. Examples include duplicate HTTP parameter precedence, the treatment of partially empty `netrc` credentials, ambiguous Markdown trailing escapes, and rendering width under terminals that depart from Unicode guidance. The regression tests should encode the project’s chosen policy explicitly.

Finally, Unicode rendering has an external uncertainty that cannot be removed by Python code alone: terminal emulator, font fallback, and Unicode-data versions can produce different visual widths. The correct software guarantee is deterministic segmentation, monotonic progress, and a documented width policy—not a promise that every terminal displays every emoji identically.

# Sources

## Supplied dataset and resource catalog

- `gemma4_task_classification.csv`: 129-instance repository, title, intent, category, family, and patch-file classification.
- `tasks.jsonl`: instance IDs, repositories, base commits, problem statements, implementation patches, test patches, hints, and timestamps.
- `python-developer-reference-resources.md`: supplied curated Python documentation and reference catalog, link-verified 2026-11-02.
- Kaggle competition data page supplied by the requester: [Gemma 4 Developer Agent Competition](https://www.kaggle.com/competitions/gemma-4-developer-agent/data).

## Python language and standard-library documentation

- [`inspect` — introspection and signatures](https://docs.python.org/3/library/inspect.html).
- [`typing` — origins, arguments, annotations, and `TYPE_CHECKING`](https://docs.python.org/3/library/typing.html).
- [`dataclasses` — frozen objects, replacement, and fields](https://docs.python.org/3/library/dataclasses.html).
- [`functools` — wrappers, partials, and cached callables](https://docs.python.org/3/library/functools.html).
- [`contextlib` — context managers and exit stacks](https://docs.python.org/3/library/contextlib.html).
- [`copy` — shallow and deep copy operations](https://docs.python.org/3/library/copy.html).
- [Built-in string types — `partition` and `splitlines`](https://docs.python.org/3/library/stdtypes.html).
- [`json` — JSON encoding and decoding](https://docs.python.org/3/library/json.html).
- [`re` — regular-expression parsing and escaping](https://docs.python.org/3/library/re.html).
- [`warnings` — warning categories, filters, and capture](https://docs.python.org/3/library/warnings.html).
- [`traceback` — exception formatting and positions](https://docs.python.org/3/library/traceback.html).
- [Built-in exceptions — notes and exception state](https://docs.python.org/3/library/exceptions.html).
- [`assert` statement semantics](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement).
- [`netrc` — credential-file parsing](https://docs.python.org/3/library/netrc.html).
- [`http` — HTTP status enums](https://docs.python.org/3/library/http.html).
- [`http.client` — protocol constants and responses](https://docs.python.org/3/library/http.client.html).
- [`urllib.parse` — structured URL parsing](https://docs.python.org/3/library/urllib.parse.html).
- [`pickle` — object reduction and serialization](https://docs.python.org/3/library/pickle.html).
- [Multiple inheritance and method resolution](https://docs.python.org/3/tutorial/classes.html#multiple-inheritance).
- [`io` — file-like interfaces](https://docs.python.org/3/library/io.html).
- [`gc` — cyclic garbage diagnostics](https://docs.python.org/3/library/gc.html).
- [`html` — HTML escaping](https://docs.python.org/3/library/html.html).
- [`string` — templates and string helpers](https://docs.python.org/3/library/string.html).
- [`pathlib` — object-oriented filesystem paths](https://docs.python.org/3/library/pathlib.html).
- [`tempfile` — secure temporary files](https://docs.python.org/3/library/tempfile.html).
- [`importlib` and `importlib.metadata`](https://docs.python.org/3/library/importlib.html).
- [`sys.modules` — module cache](https://docs.python.org/3/library/sys.html#sys.modules).
- [`timeit`](https://docs.python.org/3/library/timeit.html) and [`profile`](https://docs.python.org/3/library/profile.html) performance measurement.
- [Built-in functions — `hasattr` and `print`](https://docs.python.org/3/library/functions.html).
- [`signal` — SIGPIPE and broken-pipe behavior](https://docs.python.org/3/library/signal.html#note-on-sigpipe).
- [`unicodedata` — Unicode character database](https://docs.python.org/3/library/unicodedata.html).
- [`bisect` — sorted-array searching](https://docs.python.org/3/library/bisect.html).
- [Python Unicode HOWTO](https://docs.python.org/3/howto/unicode.html).

## PEPs and external standards

- [PEP 544 — Protocols and runtime-checkable structural typing](https://peps.python.org/pep-0544/).
- [PEP 604 — `X | Y` union types](https://peps.python.org/pep-0604/).
- [PEP 657 — fine-grained error locations](https://peps.python.org/pep-0657/).
- [PEP 678 — exception notes](https://peps.python.org/pep-0678/).
- [PEP 695 — type parameter syntax and `TypeAliasType`](https://peps.python.org/pep-0695/).
- [Unicode UAX #29 — Unicode Text Segmentation](https://www.unicode.org/reports/tr29/).
- [Unicode UAX #11 — East Asian Width](https://www.unicode.org/reports/tr11/).

## Ecosystem references consulted

- [FastAPI: dependencies with `yield`](https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/).
- [Pydantic: JSON Schema](https://docs.pydantic.dev/latest/concepts/json_schema/).
- [Starlette: responses](https://www.starlette.io/responses/).
- [HTTPX: resource limits](https://www.python-httpx.org/advanced/resource-limits/).


---

<!-- ====================================================================== -->
<!-- FILE: 04_gemma4-python-root-cause-triage-2026-11-02-k31ph-agsw.md -->
<!-- ====================================================================== -->

# Gemma 4 Developer Agent Dataset: Python Root-Cause Analysis and Triage for 27 Issue Families

**Research date:** 2026-11-02  
**Dataset coverage:** 129 tasks; 27 `technical_subcategory` issue families; FastAPI (67), Rich (48), Requests (13), HTTPX (1).  
**Primary evidence:** `gemma4_task_classification.csv`, `tasks.jsonl`, and the supplied `python-developer-reference-resources.md`.  
**Documentation emphasis:** official Python language, standard-library, PEP, and DSA references from the supplied resource guide.

## Scope and method

This report treats each distinct CSV `technical_subcategory` as one issue family. It maps every task to exactly one of the 27 families, inspects the corresponding JSONL problem statement and reference patch, identifies the violated runtime or data-structure invariant, and turns that analysis into a practical triage playbook. Each family includes relevant Python APIs, DSA concepts, default priority, diagnostic steps, and high-value regression tests.

This is **patch-informed retrospective RCA**, not a claim that the repositories were rebuilt or their test suites executed. The JSONL reference patches reveal the intended fix, so they are used as evidence alongside the problem statements. The recommendations are deliberately family-level: an individual incident can deserve a higher priority than its family default. Python documentation URLs under `/3/` track the current stable documentation; when working on a historical base commit, confirm version-sensitive behavior in the matching Python release.

### Priority scale

- **P0 — urgent:** credible security boundary violation, remotely triggerable hang, severe data corruption, or broad denial of service.
- **P1 — high:** externally visible protocol/runtime incorrectness, crashes, resource leaks, invalid signatures, or broken cleanup.
- **P2 — normal:** compatibility, performance, rendering, deprecation, or developer-experience defects with limited immediate blast radius.
- **P3 — low:** documentation/example inconsistencies without a direct runtime or security impact.

### Family index

| ID | Issue family | Tasks | Default triage |
|---|---|---:|---|
| F01 | Documentation & project automation | 3 | P2; P3 for example-only fixes |
| F02 | Responses, SSE & streaming | 7 | P1 |
| F03 | Parameter & request-body parsing | 8 | P1 |
| F04 | Routing, application APIs & lifecycle | 8 | P1 for lifecycle/cycles; otherwise P2 |
| F05 | OpenAPI, JSON Schema & schema metadata | 7 | P1; P0 for exploitable docs injection |
| F06 | Authentication & request security | 4 | P0/P1 |
| F07 | Dependency injection & function/annotation handling | 13 | P1 |
| F08 | Errors & developer experience | 2 | P2 |
| F09 | Pydantic, models & type handling | 11 | P1 |
| F10 | Compatibility, deprecations & warnings | 4 | P2; P1 for a broken supported-version boundary |
| H01 | Protocol typing & duck-type compatibility | 1 | P1 |
| H02 | Request bodies, file wrappers & content length | 3 | P1 |
| H03 | URLs, paths & proxy boundary handling | 3 | P1 |
| H04 | Redirects & connection/stream lifecycle | 2 | P1 |
| H05 | Response parsing & exception serialization | 2 | P1 |
| H06 | Authentication configuration | 1 | P1 |
| H07 | Dependency compatibility & HTTP constants | 2 | P2 |
| R01 | Import-time performance | 1 | P2 |
| R02 | Terminal detection, ANSI & console I/O | 8 | P1 for I/O failure; otherwise P2 |
| R03 | Markdown & markup parsing/rendering | 6 | P2 |
| R04 | Unicode, graphemes & cell-width segmentation | 8 | P1; P0 for an input-triggered infinite loop |
| R05 | Tables, panels & visual layout | 5 | P2 |
| R06 | Live displays, progress & prompts | 4 | P2 |
| R07 | Tracebacks, introspection & object representation | 6 | P2; P1 for recursion/crash |
| R08 | Syntax highlighting & URL recognition | 4 | P2 |
| R09 | Text & style data-structure internals | 4 | P1 |
| R10 | Export & output formats | 2 | P2 |

## Cross-family diagnostic rules

1. **Locate the layer that owns the bad value.** A type annotation that executes incorrectly belongs to F07; the same annotation producing a bad model/schema transformation belongs to F09; an incorrect emitted OpenAPI document belongs to F05. Security scopes that propagate incorrectly at runtime belong to F06/F07, while duplicate or missing scopes in the document belong to F05.
2. **Preserve semantic boundaries during normalization.** Missing is not the same as empty, a URL path is not a filesystem path, a Unicode code point is not a grapheme cluster, and character count is not encoded byte count or terminal cell width.
3. **Check progress invariants before optimizing.** Every scanner, grapheme splitter, wrapper-chain walk, recursive schema transform, or route/dependency traversal must either advance, terminate, or use cycle detection. A local special case that fails to advance is a hang, not merely wrong output.
4. **Treat mutation and lifetime as first-class causes.** Shallow copies share nested dictionaries; caches require stable keys and invalidation; streaming responses outlive endpoint return; and redirect/connection graphs must not accidentally retain themselves.
5. **Distinguish Python semantics from library policy.** Python defines `inspect`, `typing`, `dataclasses`, string, iterator, context-manager, and pickling behavior. FastAPI, Pydantic, Requests, HTTPX, and Rich define the higher-level compatibility, HTTP, OpenAPI, SSE, terminal, and rendering policies built on those primitives.

---
# I. Web framework and API development

## F01. Documentation & project automation

**Dataset tasks:** `fastapi_15661`, `fastapi_14492`, `fastapi_14487`  
**Default priority:** P2; P3 for the license-example-only correction. Escalate documentation that demonstrates unsafe error disclosure.

**Root-cause analysis.** These tasks share a source-of-truth problem rather than one runtime bug. `fastapi_15661` replaces manual release edits with a deterministic pipeline: parse `X.Y.Z`, compare versions as numeric tuples, require exactly one current-version assignment and release heading, update files, and assemble notes. The failure mode being prevented is partially edited or internally inconsistent release state. `fastapi_14492` is a metadata consistency error: the human-readable license says Apache 2.0 while the identifier says `MIT`. `fastapi_14487` addresses an unsafe example, not exception formatting itself: returning `str(exc)` can expose raw validation input and context, so the example selects only `loc` and `msg`.

**Relevant Python APIs and DSA.** Use [`re.fullmatch()`](https://docs.python.org/3/library/re.html#re.fullmatch), anchored compiled patterns, and `Match.group()` for strict recognition; [`pathlib.Path`](https://docs.python.org/3/library/pathlib.html) for file I/O; and tuple comparison for numeric version ordering. A release document is a small structured text format: headings delimit records, matches form a collection, and cardinality checks enforce uniqueness. Parsing and rewriting are O(n) in input size. The dataset’s `X.Y.Z` parser is intentionally narrower than full [PEP 440](https://peps.python.org/pep-0440/) versioning and should not be represented as a general PEP 440 parser.

**Triage and tests.** First determine whether the affected artifact is executable automation, generated metadata, or example code. For release automation, test pure parse/bump/update functions with `tmp_path`: malformed versions, zero/multiple assignments, downgrade attempts, major/minor/patch boundaries, duplicate headings, empty notes, and repeated runs. Verify the complete resulting files, not only returned strings. For documentation, compare example output with the generated schema and test that validation-error responses include location/message but exclude `input`, `ctx`, credentials, and raw bodies. Prefer allowlisted fields over attempting to sanitize an arbitrary exception string.

**Documentation:** [`re`](https://docs.python.org/3/library/re.html), [`pathlib`](https://docs.python.org/3/library/pathlib.html), [`datetime.date`](https://docs.python.org/3/library/datetime.html#datetime.date), [errors and exceptions](https://docs.python.org/3/tutorial/errors.html), and [PEP 440](https://peps.python.org/pep-0440/).

## F02. Responses, SSE & streaming

**Dataset tasks:** `fastapi_15588`, `fastapi_15030`, `fastapi_14962`, `fastapi_14964`, `fastapi_15023`, `fastapi_14099`, `fastapi_9425`  
**Default priority:** P1; escalate malformed-event injection and leaked resources when attacker-controlled or long-lived.

**Root-cause analysis.** The common defect is treating response production as a single synchronous serialization step when it is actually a protocol plus a lifetime state machine. SSE fields have different grammars: `event` and `id` must remain single-line, and `id` must not contain NUL; validating only one field or only NUL permits broken frames. Response-model serialization can avoid an intermediate Python object by using Pydantic’s JSON-byte path, which also changes the rationale for custom `ORJSONResponse`/`UJSONResponse` classes. Streaming introduces two lifetime errors: iterating a file without keeping its context open, and exiting yield-dependencies or closing upload files before a `StreamingResponse` has consumed its iterator. Finally, `None` as a return annotation must be distinguished from a model that should be validated when the route is intentionally bodiless.

**Relevant Python APIs and DSA.** Generators implement lazy iterator state; `yield from` delegates to a subiterator; and file objects are context managers whose closure is deterministic under `with` ([`io.IOBase`](https://docs.python.org/3/library/io.html#io.IOBase)). [`contextlib.AsyncExitStack`](https://docs.python.org/3/library/contextlib.html#contextlib.AsyncExitStack) is the appropriate model for dynamic, LIFO asynchronous cleanup. Direct JSON-byte serialization avoids one intermediate allocation but remains O(n) in response size. SSE validation is linear scanning; it must not reject legal multiline `data` merely because `event`/`id` are single-line fields.

**Triage and tests.** Establish whether the bad behavior occurs before endpoint return, during iterator consumption, or during final cleanup. For SSE, test CR, LF, CRLF, NUL, empty strings, non-ASCII text, and multiline `data`; verify both validation and wire framing. For streams, test sync and async iterables, annotated and unannotated endpoints, `yield from`, empty streams, exceptions mid-stream, and early disconnect. Assert that yield-dependency teardown and `UploadFile.close()` happen **after** the final chunk, including exceptional exits. Test direct serialization against alias/exclusion flags and deprecation warnings separately. For bodiless routes, verify status-specific behavior and that no response model is constructed accidentally.

**Documentation:** [generator and iterator semantics](https://docs.python.org/3/reference/datamodel.html#generator-objects), [`with` and context managers](https://docs.python.org/3/reference/compound_stmts.html#the-with-statement), [`contextlib`](https://docs.python.org/3/library/contextlib.html), [`io`](https://docs.python.org/3/library/io.html), and [`json`](https://docs.python.org/3/library/json.html).

## F03. Parameter & request-body parsing

**Dataset tasks:** `fastapi_15589`, `fastapi_14360`, `fastapi_14356`, `fastapi_14371`, `fastapi_14303`, `fastapi_13537`, `fastapi_14616`, `fastapi_11194`  
**Default priority:** P1.

**Root-cause analysis.** These failures arise when several representations of one parameter are normalized inconsistently. With `convert_underscores=True`, the declared field may be consumed through `x-user-id`, but the original `x_user_id` is left out of the processed-key set and reappears as an allowed extra. Alias fixes show that validation alias, serialization alias, and FastAPI’s parameter name cannot be collapsed into one map. Extra query/header/cookie/form lists fail when scalar assumptions meet repeated keys. Empty form strings need an explicit missing-value policy rather than ordinary truthiness. `Json[list[str]]` requires nested JSON decoding rather than sequence classification alone, and `File` after `Form` demonstrates that declaration order must not change body-field classification.

**Relevant Python APIs and DSA.** The core structure is a canonical-key map plus a `set` of processed aliases, giving expected O(1) membership and preventing double classification. Use [`str.strip()`](https://docs.python.org/3/library/stdtypes.html#str.strip), string replacement/partition operations, [`json.loads()`](https://docs.python.org/3/library/json.html#json.loads), and [`collections.abc.Mapping`/`Sequence`](https://docs.python.org/3/library/collections.abc.html) deliberately; strings are sequences but usually require a separate branch. A dedicated sentinel is safer than conflating `None`, `""`, missing, and an empty collection. Parsing remains O(n + k) for input bytes and keys, provided alias lookup is not repeatedly linear.

**Triage and tests.** Capture the raw multidict before validation and print the declared field’s name, alias(es), converted wire name, and final processed set. Test every representation together, not only separately: hyphenated and underscored duplicates; validation versus serialization aliases; scalar and repeated extras; form fields before/after files; and empty, missing, `null`, and explicitly supplied `None` cases. Include nested `Json[list[str]]`, malformed JSON, and non-list JSON. Assert both accepted values and rejected extras. Preserve deterministic precedence when two wire aliases are present; do not silently depend on dictionary iteration accidents.

**Documentation:** [built-in string and sequence types](https://docs.python.org/3/library/stdtypes.html), [`collections.abc`](https://docs.python.org/3/library/collections.abc.html), [`json`](https://docs.python.org/3/library/json.html), and [dictionary view/mapping semantics](https://docs.python.org/3/library/stdtypes.html#dict-views).

## F04. Routing, application APIs & lifecycle

**Dataset tasks:** `fastapi_15280`, `fastapi_14258`, `fastapi_14851`, `fastapi_14873`, `fastapi_15800`, `fastapi_15785`, `fastapi_15763`, `fastapi_15745`  
**Default priority:** P1 for lifecycle and recursive-routing defects; P2 for additive APIs and internal refactors.

**Root-cause analysis.** Routers form an ordered, nested graph, but several code paths treat them as flat bags of copied routes. Including a router in itself creates an immediate cycle and previously failed without a useful error. Route-preservation and route-context tasks show that rebuilding route objects can break identity-sensitive consumers. Empty paths expose a concatenation boundary: a prefixless router must not manufacture an invalid or different path merely to satisfy a helper assumption. Startup/shutdown support depends on initialization order and on adapting generator/context-manager lifespans without relying on removed upstream private APIs. `vibe()` and `frontend()` are additive route APIs; their main triage risk is dispatch/lifetime integration, not a Python language defect.

**Relevant Python APIs and DSA.** Use identity (`self is router`) for direct cycle detection and a visited set for nested graph traversal; route registration order is a stable sequence, while inclusion relationships form a directed graph. [`contextlib.contextmanager`/`asynccontextmanager`](https://docs.python.org/3/library/contextlib.html#contextlib.contextmanager) and [`AsyncExitStack`](https://docs.python.org/3/library/contextlib.html#contextlib.AsyncExitStack) define cleanup ordering. [`inspect`](https://docs.python.org/3/library/inspect.html) is relevant to callable route metadata. Python’s `assert` can validate an internal invariant, but it is removed under `python -O`; public input validation that must always run should raise an explicit exception instead ([`assert`](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement)).

**Triage and tests.** Draw the inclusion graph and record route object IDs before/after inclusion. Test direct self-inclusion and indirect A→B→A cycles, clear error text, repeated inclusion, and stable route ordering. For lifecycle changes, log startup, request, response completion, and shutdown; test custom lifespan plus legacy handlers, exceptions during startup, and prefixed routers. For empty paths, cover prefixless and prefixed routers, `/`, and trailing-slash redirects. Additive APIs need method dispatch, body handling, static-file path traversal, and OpenAPI inclusion/exclusion tests rather than only import tests.

**Documentation:** [`contextlib`](https://docs.python.org/3/library/contextlib.html), [`inspect`](https://docs.python.org/3/library/inspect.html), [`graphlib`](https://docs.python.org/3/library/graphlib.html) as a conceptual graph/cycle reference, and [sequence/dictionary ordering](https://docs.python.org/3/library/stdtypes.html).

## F05. OpenAPI, JSON Schema & schema metadata

**Dataset tasks:** `fastapi_14986`, `fastapi_14463`, `fastapi_14459`, `fastapi_14455`, `fastapi_14266`, `fastapi_13713`, `fastapi_14791`  
**Default priority:** P1; P0 when unescaped schema/docs data permits a practical script-injection path.

**Root-cause analysis.** Two structural bugs dominate. First, shallow copying or in-place updates leak mutations across requests/routes: root-path handling can mutate shared server state, and modifying nested app-level response content can accumulate duplicate `anyOf` references. Second, flattening dependency/security graphs into OpenAPI loses identity or multiplicity information: top-level schemes may be omitted, parent/child scope propagation can be wrong, and repeated scheme entries need scope union rather than duplicate declarations. Escaping is a separate output-context error—valid JSON is not automatically safe inside an HTML `<script>` element. Schema evolution also requires the `ValidationError` model to include the `input` and `ctx` fields consumers actually receive.

**Relevant Python APIs and DSA.** [`copy.deepcopy()`](https://docs.python.org/3/library/copy.html#copy.deepcopy) recursively copies nested containers, unlike `dict.copy()`; use it at ownership boundaries, not indiscriminately in hot loops. Schema transformation is tree traversal, O(n) in schema nodes. Ordered dictionaries keyed by scheme name implement stable deduplication and scope union; a set is suitable only for membership, not when output order matters. [`json.dumps()`](https://docs.python.org/3/library/json.html#json.dumps) handles JSON quoting, while additional escaping addresses the HTML embedding context.

**Triage and tests.** Generate the schema repeatedly and across different root paths/routes, then compare for accidental growth or cross-request mutation. Retain a pristine app-level `responses` object and assert deep equality after generation. For unions with examples/content, assert unique `anyOf` references. For security, test app-level schemes, parent with scopes plus child without scopes, shared schemes with different scope sets, deterministic ordering, and scope union. Test `<`, `>`, `&`, quotes, and script-closing text in every docs-embedded value. Validate `externalDocs` and validation-error schemas against actual serialized errors.

**Documentation:** [`copy`](https://docs.python.org/3/library/copy.html), [`json`](https://docs.python.org/3/library/json.html), [mapping types](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict), and [recursive data-model/container semantics](https://docs.python.org/3/reference/datamodel.html).

## F06. Authentication & request security

**Dataset tasks:** `fastapi_14978`, `fastapi_14786`, `fastapi_5624`, `fastapi_13786`  
**Default priority:** P0 for a demonstrated CSRF/authentication bypass; otherwise P1.

**Root-cause analysis.** Security defects here are boundary-classification errors. Strict JSON content-type checking closes a gap where a body without `Content-Type` is treated as JSON despite browser simple-request/CSRF concerns; the compatibility flag must be explicit. Authorization parsing uses the first space to separate scheme and credentials, but failing to trim the credential leaves protocol whitespace in a security token. Hierarchical dependencies require scopes to propagate through the complete dependency path; a local-only calculation loses required authorization constraints. Missing credentials also need a different response policy from present-but-invalid credentials: the security classes move the missing case to `401`, rather than treating every failure identically.

**Relevant Python APIs and DSA.** [`str.partition()`](https://docs.python.org/3/library/stdtypes.html#str.partition) performs one deterministic split and [`str.strip()`](https://docs.python.org/3/library/stdtypes.html#str.strip) removes surrounding whitespace in O(n). Security requirements form a dependency DAG: scope propagation is a graph walk, and deduplication should use ordered maps/sets without dropping the path on which a requirement arose. Header names, content types, and schemes need protocol-specific normalization; generic string truthiness is not sufficient to distinguish absent, empty, malformed, and valid values.

**Triage and tests.** Reproduce at the raw HTTP layer before debugging dependency internals. For strict content type, test absent, correct, incorrect, and parameterized content types with the flag both enabled and disabled, including browser-like simple requests. For authorization, test multiple spaces, tabs where legal, leading/trailing whitespace, empty credentials, wrong scheme, and token text containing internal spaces. For scopes, build parent/child chains with scopes at each level and assert both runtime enforcement and resulting requirements. Verify missing credentials return `401` with appropriate challenge behavior while malformed or insufficient credentials follow their distinct policy. Never log raw authorization values during triage.

**Documentation:** [string methods](https://docs.python.org/3/library/stdtypes.html#string-methods), [`http.HTTPStatus`](https://docs.python.org/3/library/http.html#http.HTTPStatus), [mapping/set types](https://docs.python.org/3/library/stdtypes.html), and [`graphlib`](https://docs.python.org/3/library/graphlib.html) for the underlying dependency-graph concepts.

## F07. Dependency injection & function/annotation handling

**Dataset tasks:** `fastapi_13920`, `fastapi_14794`, `fastapi_14372`, `fastapi_11355`, `fastapi_14485`, `fastapi_14458`, `fastapi_14448`, `fastapi_9753`, `fastapi_5077`, `fastapi_9555`, `fastapi_14419`, `fastapi_14301`, `fastapi_14262`  
**Default priority:** P1.

**Root-cause analysis.** The family is a normalization and graph-evaluation problem. PEP 695 aliases must be unpacked through `__value__`; `Annotated`, stringified annotations, forward references, `TYPE_CHECKING` imports, wrappers, and partials otherwise reach parameter analysis in shapes it does not recognize. `inspect.signature(..., eval_str=True)` resolves strings but can raise `NameError` for intentionally unavailable typing-only names, requiring a fallback rather than unconditional evaluation. Wrapped forward references must use the unwrapped function’s globals. Callable classes need to be classified before inspecting their `__call__`, while partials and `__wrapped__` chains must be normalized independently and repeatedly. An explicit `Depends` must take precedence over special injection based only on a `Response` annotation. Finally, caching and scopes are graph properties: a dependency cannot be cached safely by callable alone if security scopes differ, and function/request scope determines when yield-dependencies exit.

**Relevant Python APIs and DSA.** Use [`inspect.signature()`](https://docs.python.org/3/library/inspect.html#inspect.signature), [`inspect.unwrap()`](https://docs.python.org/3/library/inspect.html#inspect.unwrap), callable-class predicates, and generator/coroutine predicates; [`functools.wraps()`](https://docs.python.org/3/library/functools.html#functools.wraps) and [`functools.partial`](https://docs.python.org/3/library/functools.html#functools.partial); and [`typing.get_origin()/get_args()`](https://docs.python.org/3/library/typing.html#typing.get_origin). [PEP 695](https://peps.python.org/pep-0695/) specifies `TypeAliasType` and lazy `__value__`; [PEP 563](https://peps.python.org/pep-0563/) explains postponed annotations. [`dataclasses.replace()`](https://docs.python.org/3/library/dataclasses.html#dataclasses.replace) supports immutable updates. A frozen dataclass supplies a generated hash only when the hashed field values are themselves hashable—`scopes=['read']` still fails, so normalize sequences to tuples if they participate in a key.

The runtime structure is a dependency DAG with memoization. Keys must include every result-changing input (callable, cache policy, scopes/lifetime), and cleanup is stack ordered. Wrapper traversal and type unwrapping are linear in chain depth; full graph setup should be O(V + E), with cycle detection where user graphs are possible.

**Triage and tests.** Dump the original callable, partial chain, `inspect.unwrap` result, defining globals, raw/evaluated signature, and final dependency graph. Test a matrix of sync, async, generator, and async-generator functions; callable instances; callable classes; `wraps`; nested partials; and both combined. Cover forward references and `TYPE_CHECKING` names separately from resolvable strings. Test explicit `Depends` on special annotation types. For caching, reuse one callable under different scope sets and under different subdependency graphs; test parameterless top-level dependencies and function- versus request-scoped cleanup around streaming responses. Assert call counts, values, and teardown order—not merely successful imports.

**Documentation:** [`inspect`](https://docs.python.org/3/library/inspect.html), [`functools`](https://docs.python.org/3/library/functools.html), [`typing`](https://docs.python.org/3/library/typing.html), [`dataclasses`](https://docs.python.org/3/library/dataclasses.html), [`contextlib`](https://docs.python.org/3/library/contextlib.html), and PEPs [695](https://peps.python.org/pep-0695/) and [563](https://peps.python.org/pep-0563/).

## F08. Errors & developer experience

**Dataset tasks:** `fastapi_14479`, `fastapi_14306`  
**Default priority:** P2.

**Root-cause analysis.** The underlying operations already fail, but their diagnostics omit the context needed to act. Invalid query annotations raised a bare assertion without identifying the parameter or supported-type constraint. Validation errors lacked endpoint identity, forcing users to infer which route/function produced them in a large application. The fix adds a structured, optional endpoint context—function, path, file, and line—and formats it only when available. This is an error-enrichment problem; adding formatting should not alter the original exception type, validation errors, or control flow.

**Relevant Python APIs and DSA.** [`inspect.getsourcefile()/getsourcelines()`](https://docs.python.org/3/library/inspect.html) and function code metadata can supply source context. [`typing.TypedDict`](https://docs.python.org/3/library/typing.html#typing.TypedDict) with `total=False` models optional metadata without a permissive untyped dictionary contract. [`traceback`](https://docs.python.org/3/library/traceback.html) is the standard formatting reference. The data structure is a small metadata record attached to an exception; formatting is O(number of errors), and no sensitive raw input is required to make the message actionable.

**Triage and tests.** Trigger each invalid annotation class and assert the message includes the exact parameter name and a useful supported-type summary. For endpoint context, test normal functions, decorated functions, missing source metadata, synchronous/asynchronous routes, and validation failures inside dependencies. Confirm exception chaining and `.errors()` remain unchanged, strings are stable enough for logs/tests, and optional fields degrade gracefully. Include a secret-like input to ensure enriched messages do not accidentally reintroduce raw values.

**Documentation:** [`inspect`](https://docs.python.org/3/library/inspect.html), [`traceback`](https://docs.python.org/3/library/traceback.html), [`TypedDict`](https://docs.python.org/3/library/typing.html#typing.TypedDict), and [exception hierarchy](https://docs.python.org/3/library/exceptions.html).

## F09. Pydantic, models & type handling

**Dataset tasks:** `fastapi_12942`, `fastapi_14349`, `fastapi_14512`, `fastapi_14482`, `fastapi_14430`, `fastapi_14361`, `fastapi_13207`, `fastapi_14246`, `fastapi_14186`, `fastapi_14297`, `fastapi_14953`  
**Default priority:** P1.

**Root-cause analysis.** This family is primarily an incomplete algebraic-type normalizer. `Annotated` can hide a complex union from body classification; PEP 604 `X | None` has a different runtime origin from `typing.Optional[X]`; and tagged unions lose discriminators when field metadata is reconstructed incompletely. Arbitrary types fail when model configuration is not propagated into type adapters. JSON Schema remapping assumes every `$ref` is a schema-keyword string and that the key exists, even though a model may legally expose a field named `$ref`. Input/output schema separation must account for computed fields and nested-model namespaces rather than treating a model name as globally sufficient. Bytes and optional sequences show that serialization shape and JSON Schema representation must follow the actual annotated type, not a scalar or `typing.Union`-only special case.

**Relevant Python APIs and DSA.** [`typing.get_origin()/get_args()`](https://docs.python.org/3/library/typing.html#typing.get_origin), `Annotated`, `types.UnionType`/`typing.Union`, and [`dataclasses.is_dataclass()`](https://docs.python.org/3/library/dataclasses.html#dataclasses.is_dataclass) support structural dispatch. Safe dictionary access (`key in mapping`, `mapping.get`) and type checks are required before interpreting schema keywords. Model/schema transformations are recursive tree walks with a model-name map; nested models require scoped naming and, where recursion is legal, a visited set or memo. Sequence serialization is O(n), and schema rewriting is O(schema nodes). Avoid a long chain of special cases: normalize aliases, annotations, unions, and metadata into one internal representation first.

**Triage and tests.** Print the raw annotation, origin, args, metadata list, model config, and generated validation/serialization schemas. Test `Optional[T]`, `T | None`, nested `Annotated`, tagged unions in different metadata positions, arbitrary classes and dataclasses, computed fields, nested models with colliding names, and recursive models where supported. For `$ref`, cover a missing key, a schema-reference string, and an ordinary model field—including non-string values. Verify optional sequence serialization for both union syntaxes and bytes schema/output against the intended base64/octet-stream contract. Run the matrix across the actual supported Python/Pydantic versions rather than extrapolating from one release.

**Documentation:** [`typing`](https://docs.python.org/3/library/typing.html), [union and generic-alias runtime types](https://docs.python.org/3/library/stdtypes.html#types-union), [`dataclasses`](https://docs.python.org/3/library/dataclasses.html), [mapping methods](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict), and [PEP 695](https://peps.python.org/pep-0695/).

## F10. Compatibility, deprecations & warnings

**Dataset tasks:** `fastapi_14609`, `fastapi_14077`, `fastapi_14605`, `fastapi_14583`  
**Default priority:** P2; P1 when a supported dependency/Python combination is broken.

**Root-cause analysis.** Compatibility shims become independent compatibility surfaces. Supporting `pydantic.v1` requires parallel parameter, schema, encoder, and warning behavior; removing it is a coordinated deletion, not a single import cleanup. Starlette range changes require adapting exception/OpenAPI behavior to the actual supported versions. Warning-only changes can still fail their purpose if emitted through a generic category that users filter inconsistently or if they point at library internals. A dedicated `FastAPIDeprecationWarning` gives applications a stable filtering target, and [PEP 702](https://peps.python.org/pep-0702/) annotations expose deprecations to type checkers as well as runtime users.

**Relevant Python APIs and DSA.** [`warnings.warn()`](https://docs.python.org/3/library/warnings.html#warnings.warn), warning categories, filters, and `stacklevel` control visibility and attribution; [`typing.TYPE_CHECKING`](https://docs.python.org/3/library/typing.html#typing.TYPE_CHECKING) separates static-only imports. A compatibility layer is an adapter with a version-by-feature matrix. Removal must be treated as graph pruning: find all imports, re-exports, documentation examples, tests, and generated compatibility objects before deleting the node. Avoid version-string parsing when a feature/API check is more reliable, and use the project’s packaging specifier tooling for declared ranges.

**Triage and tests.** Build the supported Python/dependency matrix and test both boundaries plus at least one intermediate version. Run with warnings treated as errors and with a filter targeting the custom category; assert category, message, and user-code stack level. Test deprecated APIs at call sites and type-check PEP 702 annotations where applicable. For removals, verify clean imports without the old compatibility package, absence of stale documentation examples, and no incidental removal of supported behavior. Distinguish an intentional breaking change from a regression by checking the declared version/range and migration note.

**Documentation:** [`warnings`](https://docs.python.org/3/library/warnings.html), [`typing`](https://docs.python.org/3/library/typing.html), [PEP 702](https://peps.python.org/pep-0702/), and [Python version/release documentation](https://docs.python.org/3/whatsnew/index.html).

---
# II. HTTP client and protocol handling

## H01. Protocol typing & duck-type compatibility

**Dataset task:** `requests_7505`  
**Default priority:** P1.

**Root-cause analysis.** A runtime-checkable `Protocol` describing `read()` does not recognize every object whose attributes are supplied dynamically through `__getattr__`. Requests therefore rejected valid file-like proxies in some paths and accepted them in others. The fix centralizes a `has_read()` capability predicate: structural `isinstance` first, then `hasattr(obj, 'read')`. The underlying defect is inconsistent capability detection across call sites, not a failure of static typing. Static protocol conformance and runtime dynamic attribute lookup are different questions.

**Relevant Python APIs and DSA.** [`typing.runtime_checkable`](https://docs.python.org/3/library/typing.html#typing.runtime_checkable) and [PEP 544](https://peps.python.org/pep-0544/) define structural protocols; [`hasattr()`](https://docs.python.org/3/library/functions.html#hasattr) uses dynamic lookup and can invoke descriptors or `__getattr__` ([attribute lookup](https://docs.python.org/3/reference/datamodel.html#customizing-attribute-access)). The pattern is an adapter/capability interface with short-circuit evaluation. It is O(1) in ordinary attribute lookup but may execute user code, and `hasattr` suppresses only `AttributeError`—other exceptions still propagate.

**Triage and tests.** Build one minimal proxy whose concrete class has no `read` method but whose `__getattr__` delegates to a real file. Run it through every body/multipart path, not just the originally reported one. Also test real files, `BytesIO`/`StringIO`, objects without `read`, attributes that raise non-`AttributeError`, and non-callable `read` attributes so the chosen policy is explicit. Centralize the predicate and compare its result with the operation actually required; do not add more unrelated protocols piecemeal.

**Documentation:** [`typing` protocols](https://docs.python.org/3/library/typing.html#protocols), [PEP 544](https://peps.python.org/pep-0544/), [`inspect.getattr_static`](https://docs.python.org/3/library/inspect.html#inspect.getattr_static) as a passive-introspection contrast, and [`io` stream interfaces](https://docs.python.org/3/library/io.html).

## H02. Request bodies, file wrappers & content length

**Dataset tasks:** `requests_7502`, `requests_7433`, `requests_6589`  
**Default priority:** P1.

**Root-cause analysis.** Multipart encoding used only protocol `isinstance`, while body streaming used only `isinstance(data, Iterable)`; both miss `__getattr__`-based wrappers that expose `read` or `__iter__` dynamically. As a result, files could be encoded as the wrong value and streamed bodies could skip length/rewind handling, notably across 307/308 redirects. Separately, `len(str)` counts Unicode code points, whereas HTTP content length must describe encoded bytes; non-ASCII strings therefore produce a length that is too small. The shared cause is confusing an object’s declared class or Python-level text measure with its runtime wire capability.

**Relevant Python APIs and DSA.** [`collections.abc.Iterable`](https://docs.python.org/3/library/collections.abc.html#collections.abc.Iterable), `hasattr`, [`str.encode()`](https://docs.python.org/3/library/stdtypes.html#str.encode), `len(bytes)`, and [`io.IOBase.seek()/tell()`](https://docs.python.org/3/library/io.html#io.IOBase.seek) are the key primitives. A request body is a stream adapter with position state; length calculation and rewinding are metadata operations around that state. UTF-8 encoding is O(n), and a byte count must be taken after encoding. Avoid eagerly materializing a large stream merely to discover its length.

**Triage and tests.** Trace the same wrapper through parameter encoding, multipart encoding, `prepare_body`, length calculation, and redirect replay. Test named temporary files and proxies exposing either `read` or iteration only through `__getattr__`. Include ASCII, multibyte UTF-8, empty text, bytes, seekable/non-seekable streams, and 307/308 redirects; assert transmitted bytes, `Content-Length`, and rewind behavior. Check whether reading to compute length changes stream position and restore it when required.

**Documentation:** [`io`](https://docs.python.org/3/library/io.html), [`collections.abc`](https://docs.python.org/3/library/collections.abc.html), [text/binary sequence types](https://docs.python.org/3/library/stdtypes.html), and [`codecs`/encoding behavior](https://docs.python.org/3/library/codecs.html).

## H03. URLs, paths & proxy boundary handling

**Dataset tasks:** `requests_7427`, `requests_7315`, `requests_6644`  
**Default priority:** P1; escalate a proxy-bypass or signature failure with security impact.

**Root-cause analysis.** Two superficially similar string operations have different semantics. `NO_PROXY` matching used raw suffix tests, so `prelocalhost` could match `localhost` and unrelated domains could match without a label boundary; the fix normalizes a leading dot, checks exact host/port matches, then requires a dot-boundary suffix. Request-path handling has a historical tension: `requests_6644` trimmed excess leading separators to avoid confusing the transport, while `requests_7315` preserves them because collapsing `//key` changes signed S3 URLs. The correct RCA is not “slashes are good/bad,” but that transport interpretation and application-path octets must not be conflated.

**Relevant Python APIs and DSA.** [`urllib.parse.urlsplit()`](https://docs.python.org/3/library/urllib.parse.html#urllib.parse.urlsplit) separates URL components; `str.lstrip`, `endswith`, and exact equality implement the matching logic. Host matching is a boundary-aware suffix algorithm, O(number of entries × candidate length), and should compare canonical host/port forms rather than arbitrary suffixes. Path preservation is a canonicalization invariant: apply only transformations guaranteed not to change resource identity or signatures. [`urllib.request.proxy_bypass_environment()`](https://docs.python.org/3/library/urllib.request.html#urllib.request.proxy_bypass_environment) is the standard-library reference point for proxy bypass behavior.

**Triage and tests.** Table-test exact hosts, subdomains, leading-dot entries, lookalike suffixes (`prelocalhost`), ports, case, and empty entries. For paths, test `/`, `//`, `///`, a colon after double slash, query/fragment combinations, direct and proxied requests, and a presigned URL whose signature must remain valid. Inspect both `PreparedRequest.path_url` and the exact bytes handed to the transport. When older and newer tasks conflict, triage against the current transport’s handling and regression tests rather than restoring normalization blindly.

**Documentation:** [`urllib.parse`](https://docs.python.org/3/library/urllib.parse.html), [`urllib.request`](https://docs.python.org/3/library/urllib.request.html), [string methods](https://docs.python.org/3/library/stdtypes.html#string-methods), and [`ipaddress`](https://docs.python.org/3/library/ipaddress.html) for literal-host normalization where applicable.

## H04. Redirects & connection/stream lifecycle

**Dataset tasks:** `requests_7328`, `httpx_3672`  
**Default priority:** P1.

**Root-cause analysis.** Redirect history is a predecessor list, not a cyclic graph of responses. Assigning `hist[1:]` after mutation could include the current response in its own history, creating self-reference and reference explosion. Assigning the predecessor slice before append preserves the invariant that response *i* owns exactly responses `[0:i]`. HTTPX shows the analogous connection-state problem: a keep-alive parser cannot reset until both send and receive sides are complete, a server must drain an unread request body before reuse, and listener shutdown must close active streams. “Response returned” is not equivalent to “connection safely reusable.”

**Relevant Python APIs and DSA.** A list slice copies the sequence of references, while object graphs can still become cyclic through their attributes; use predecessor-only lists and avoid unnecessary backreferences. Connection handling is a finite-state machine with send/receive states and keep-alive flags. HTTPX’s active-stream list is periodically pruned in O(n) and closed in LIFO-agnostic cleanup on exit; high-churn servers may prefer a set plus explicit removal. [`contextlib`](https://docs.python.org/3/library/contextlib.html) and stream `close()` methods make cleanup deterministic. [`weakref`](https://docs.python.org/3/library/weakref.html) is useful for some caches/graph edges but is not a substitute for correct response history.

**Triage and tests.** For multi-redirect chains, assert final length, every intermediate `resp.history == final.history[:i]`, and `resp not in resp.history`; inspect retained objects under repeated redirects. For HTTPX, test keep-alive with fully and partially consumed request/response bodies, pipelined sequential requests, parser reset flags, connection-close cases, endpoint exceptions, and server exit with active streams. Assert sockets close exactly once and no next request inherits bytes from the previous one.

**Documentation:** [sequence slicing](https://docs.python.org/3/library/stdtypes.html#common-sequence-operations), [`contextlib`](https://docs.python.org/3/library/contextlib.html), [`io` closing](https://docs.python.org/3/library/io.html#io.IOBase.close), [`weakref`](https://docs.python.org/3/library/weakref.html), and [`gc`/reference-cycle caveats](https://docs.python.org/3/library/gc.html).

## H05. Response parsing & exception serialization

**Dataset tasks:** `requests_7309`, `requests_6629`  
**Default priority:** P1.

**Root-cause analysis.** The content-type parser treated a parameter without `=` as a key with value `True`, even though the segment is malformed for this key/value representation; the fix ignores such segments while retaining valid parameters. This is a token-classification bug. `requests_6629` is an MRO/serialization bug: `requests.exceptions.JSONDecodeError` inherits both Requests’ I/O-flavored exception path and the standard/compatible JSON decode error. Default exception reduction follows the wrong parent for reconstruction, dropping `doc` and `pos`; delegating `__reduce__` to `CompatJSONDecodeError` preserves the constructor state. The result previously crashed consumers such as process pools when an exception crossed a process boundary.

**Relevant Python APIs and DSA.** [`json.JSONDecodeError`](https://docs.python.org/3/library/json.html#json.JSONDecodeError) carries message, document, and position. [`pickle`](https://docs.python.org/3/library/pickle.html) and the [`__reduce__()` protocol](https://docs.python.org/3/library/pickle.html#object.__reduce__) determine reconstruction, while [method resolution order](https://docs.python.org/3/tutorial/classes.html#multiple-inheritance) selects the default implementation. Header parsing is a linear token scan; malformed tokens should be ignored or rejected according to a stated policy, not silently changed into another type.

**Triage and tests.** For headers, test empty segments, missing `=`, multiple `=`, quoted values, whitespace, empty values, and case normalization; confirm valid parameters survive. For exceptions, round-trip through `pickle.dumps`/`loads`, compare `args`, `msg`, `doc`, `pos`, and `repr`, and include a real process-pool transfer. Test both stdlib JSON and any supported compatibility backend. Do not catch the reconstruction error and hide it—the exception’s value and type must remain useful to the caller.

**Documentation:** [`json`](https://docs.python.org/3/library/json.html), [`pickle`](https://docs.python.org/3/library/pickle.html), [multiple inheritance/MRO](https://docs.python.org/3/tutorial/classes.html#multiple-inheritance), and [string methods](https://docs.python.org/3/library/stdtypes.html#string-methods).

## H06. Authentication configuration

**Dataset task:** `requests_7205`  
**Default priority:** P1.

**Root-cause analysis.** `netrc.authenticators()` can return a three-element tuple whose fields are all empty for an empty default entry. The tuple itself is truthy, so `if _netrc:` accepted it and Requests generated empty basic credentials (`:`). The fix requires both a tuple and `any(_netrc)`, restoring the intended “ignore this profile” behavior while still allowing callers to explicitly pass `auth=('', '')`. The defect is a container-versus-contents truth-value error exposed by a Python-version behavior change.

**Relevant Python APIs and DSA.** [`netrc.netrc.authenticators()`](https://docs.python.org/3/library/netrc.html#netrc.netrc.authenticators) returns login/account/password information, and [truth-value testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing) explains why a non-empty tuple of empty strings is true. `any()` is a short-circuit reduction over the credential fields. The structure is a small record of optional values; absence must be represented by no usable credentials, not by an Authorization header with empty values.

**Triage and tests.** Use a temporary `NETRC` file to test empty `default`, empty machine entries, partially populated entries, normal credentials, malformed files, and host mismatch. Assert that empty profiles produce no auth header, partial profiles follow the documented selection policy, and explicit per-request empty auth remains distinct. Run across supported Python versions because the motivating `netrc` behavior changed. Redact decoded credentials from logs and test output.

**Documentation:** [`netrc`](https://docs.python.org/3/library/netrc.html), [truth values and `any()`](https://docs.python.org/3/library/functions.html#any), and [`base64`](https://docs.python.org/3/library/base64.html) for inspecting the resulting Basic-auth encoding without printing secrets.

## H07. Dependency compatibility & HTTP constants

**Dataset tasks:** `requests_6757`, `requests_6592`  
**Default priority:** P2; P1 if a declared supported dependency combination fails at import/runtime.

**Root-cause analysis.** `requests_6757` exercises the compatibility boundary with urllib3 1.26.x: conditional imports/helpers must track the actual dependency surface rather than assuming only the newest release. `requests_6592` adds the `425 TOO_EARLY` named status constant, preventing magic numbers and completing the status-code registry. Neither is a complex algorithmic defect; the risk is an incomplete compatibility matrix or inconsistent lookup table.

**Relevant Python APIs and DSA.** [`http.HTTPStatus`](https://docs.python.org/3/library/http.html#http.HTTPStatus) is the stdlib’s status-code enumeration and a useful semantic cross-check. Conditional imports are adapter logic; status codes are a static key→constant lookup with expected O(1) access. Compatibility helpers should centralize version differences instead of spreading version checks through request logic.

**Triage and tests.** Run import and core request tests against the minimum and maximum declared urllib3 versions, checking compatibility names on both branches. Verify the 425 constant’s numeric value, lookup aliases, and response behavior without inventing new protocol semantics. Keep dependency-range metadata, CI, and compatibility branches consistent; a test-only support claim without runtime coverage is insufficient.

**Documentation:** [`http.HTTPStatus`](https://docs.python.org/3/library/http.html#http.HTTPStatus), [`importlib`](https://docs.python.org/3/library/importlib.html), [dependency specifiers](https://packaging.python.org/en/latest/specifications/dependency-specifiers/), and [`unittest.mock`](https://docs.python.org/3/library/unittest.mock.html) for controlled compatibility-branch tests.

---
# III. Terminal UI and text rendering

## R01. Import-time performance

**Dataset task:** `rich_4070`  
**Default priority:** P2.

**Root-cause analysis.** `Console` and `RichHandler` eagerly imported large modules and transitive Rich components used only by optional paths such as SVG/HTML export, password input, exception rendering, emoji replacement, syntax integration, and local-variable logging. Cold-start callers paid for work they never requested. The patch defers imports to the function that needs them, moves annotation-only imports under `TYPE_CHECKING`, removes dead code, and uses cheaper equivalent predicates where appropriate. The defect is an over-eager import graph, not slow rendering.

**Relevant Python APIs and DSA.** Modules are cached in [`sys.modules`](https://docs.python.org/3/library/sys.html#sys.modules), so lazy importing shifts first-use cost rather than making the dependency free. [`typing.TYPE_CHECKING`](https://docs.python.org/3/library/typing.html#typing.TYPE_CHECKING) supports static-only names; postponed annotations are covered by [PEP 563](https://peps.python.org/pep-0563/). Treat imports as a directed dependency graph and prune/defer edges leaving the common entry-point path. Measure with [`python -X importtime`](https://docs.python.org/3/using/cmdline.html#cmdoption-X), [`timeit`](https://docs.python.org/3/library/timeit.html), and a clean interpreter; warm-process timings conceal cold-start cost.

**Triage and tests.** Capture the import-time tree for `rich.console` and `rich.logging`, classify each top-level import as required, annotation-only, single-path, or dead, then re-measure after each change. Exercise every deferred path to catch `NameError`, circular imports, and changed typing behavior. Keep behavioral tests for console, syntax, logging, export, and emoji, plus a separate controlled benchmark rather than a fragile wall-clock unit assertion. Verify public import latency without claiming that deferred optional operations became faster overall.

**Documentation:** [`importlib`](https://docs.python.org/3/library/importlib.html), [`sys.modules`](https://docs.python.org/3/library/sys.html#sys.modules), [`typing.TYPE_CHECKING`](https://docs.python.org/3/library/typing.html#typing.TYPE_CHECKING), [`timeit`](https://docs.python.org/3/library/timeit.html), and [`cProfile`](https://docs.python.org/3/library/profile.html#cProfile).

## R02. Terminal detection, ANSI & console I/O

**Dataset tasks:** `rich_4077`, `rich_4076`, `rich_4075`, `rich_3777`, `rich_3468`, `rich_3675`, `rich_3470`, `rich_3278`  
**Default priority:** P1 for broken-pipe/process failures; P2 for detection and rendering defects.

**Root-cause analysis.** These are stream-contract and state-machine bugs. `FileProxy` forwarded several file methods but not `isatty()`, so terminal detection saw an incomplete file-like object. `str.splitlines()` discarded line-boundary information needed by the ANSI decoder, including the final-newline state, and recognizes more boundaries than the intended LF-only grammar. Empty `Console.print()` ignored a custom `end`. Environment detection lacked explicit, consistent empty-value and precedence rules, and a property getter mutated hidden state. Broken pipe handling needed to catch `BrokenPipeError` during flush and prevent a second failure during interpreter shutdown. Record/capture mixed two output-buffer regions, duplicating recorded text. Finally, the ANSI tokenizer did not consume private escape-sequence forms, allowing control sequences to leak into rendered output.

**Relevant Python APIs and DSA.** [`io.IOBase.isatty()`](https://docs.python.org/3/library/io.html#io.IOBase.isatty) is part of the expected proxy surface. [`str.splitlines()`](https://docs.python.org/3/library/stdtypes.html#str.splitlines), `partition`, `rstrip`, and [`re.split()`](https://docs.python.org/3/library/re.html#re.split) have materially different delimiter semantics. [`BrokenPipeError`](https://docs.python.org/3/library/exceptions.html#BrokenPipeError) and the [`SIGPIPE` note](https://docs.python.org/3/library/signal.html#note-on-sigpipe) govern Unix pipeline exits; `os.dup2`/`os.devnull` prevent shutdown reflushes from failing again. ANSI decoding is a finite-state tokenizer that must consume recognized sequences completely. Environment detection should be a pure precedence function: explicit parameter → compatibility override → color/terminal variables → `isatty` auto-detection. Record/capture requires disjoint buffer intervals.

**Triage and tests.** Compare proxy methods with the actual consumer queries and test true/false TTY wrappers. Use `repr()` to inspect empty, blank, trailing-newline, CRLF, and Unicode-line-separator inputs. Test empty `print` with `end=''`, `'!'`, and `'\n'`. Table-test every environment variable unset, empty, `0`, `1`, and conflicting combinations; ensure getters are side-effect free. Reproduce broken pipe with a consumer that closes early and verify a single controlled exit. Compare record/export with nested capture, and feed CSI, OSC, DEC-private, malformed, and truncated escape sequences to ensure no unintended control text survives.

**Documentation:** [`io`](https://docs.python.org/3/library/io.html), [`os`](https://docs.python.org/3/library/os.html), [`sys` standard streams](https://docs.python.org/3/library/sys.html#sys.stdout), [`re`](https://docs.python.org/3/library/re.html), [string methods](https://docs.python.org/3/library/stdtypes.html#string-methods), and [`signal`](https://docs.python.org/3/library/signal.html).

## R03. Markdown & markup parsing/rendering

**Dataset tasks:** `rich_4079`, `rich_3942`, `rich_3469`, `rich_3130`, `rich_3064`, `rich_3063`  
**Default priority:** P2; P1 for malformed input that crashes rendering.

**Root-cause analysis.** Table-cell events were handled by replacing an accumulator, discarding earlier inline-styled fragments; the follow-up inline-code bug arose because applying a base style to an already styled `Text` appended a higher-precedence span. Headerless/partial tables used assertions as if they were input validation. Inline and block nodes were emitted with the same newline policy, producing superfluous whitespace. Style updates needed copies to avoid mutating shared parsed text. Trailing-backslash escaping missed the end-of-string case because the regex only recognized runs followed by a markup character. The shared theme is loss of parser-event, style-span, and delimiter-boundary invariants.

**Relevant Python APIs and DSA.** A Markdown renderer is an event-driven tree/fragment parser with an accumulator and style context. Inline spans are ordered intervals; appending versus replacing and span precedence determine the final render. [`dataclasses`](https://docs.python.org/3/library/dataclasses.html) and `typing.ClassVar` support immutable configuration patterns, while [`re`](https://docs.python.org/3/library/re.html) and [`str.endswith()`](https://docs.python.org/3/library/stdtypes.html#str.endswith) handle escaping boundaries. Python [`assert`](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement) is removed under `-O` and must not validate external Markdown. Streaming accumulation is O(n) when append operations are amortized O(1).

**Triage and tests.** Minimize to one table cell or one inline node and inspect the accumulated `Text` plus ordered spans after every event. Test multiple links/emphasis fragments, inline code with a lexer/theme, cell base styles, justification, and repeated rendering for mutation leaks. Include headerless, partial, and empty-cell tables. Test inline versus block adjacency and trailing runs of one, two, and three backslashes, both before markup and at end-of-string. Assert content and style separately so “text present but incorrectly styled” is not hidden by a text-only comparison.

**Documentation:** [`re`](https://docs.python.org/3/library/re.html), [string methods](https://docs.python.org/3/library/stdtypes.html#string-methods), [`dataclasses`](https://docs.python.org/3/library/dataclasses.html), [`ClassVar`](https://docs.python.org/3/library/typing.html#typing.ClassVar), and [`assert`](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement).

## R04. Unicode, graphemes & cell-width segmentation

**Dataset tasks:** `rich_4006`, `rich_3953`, `rich_3944`, `rich_3930`, `rich_3180`, `rich_3535`, `rich_3521`, `rich_3506`  
**Default priority:** P1; P0 for an input-triggered infinite loop.

**Root-cause analysis.** Rich must maintain three different coordinate systems simultaneously: Python string indices, grapheme clusters, and terminal cells. The initial grapheme implementation added multi-codepoint handling but left degenerate states: a leading ZWJ/variation selector or zero-width character had no previous span, so some branches neither emitted a span nor advanced the cursor. A trailing ZWJ could advance by two beyond the remaining input. The correct invariant is a gap-free span partition covering every string index, including zero-cell graphemes. Width lookup also needed control/non-printable and font/Unicode-version corrections plus safe binary-search termination. Wrapping and `Segment.split_cells` estimated a string index from a cell ratio, which fails with mixed widths and cuts through double-width characters; later fixes move by measured cells and substitute spaces when a double-width glyph must be split. A malformed fast-path regex also excluded valid single-width characters, changing performance and potentially bypassing tested logic.

**Relevant Python APIs and DSA.** Python `len(str)` counts code points, not graphemes or terminal cells; [`unicodedata`](https://docs.python.org/3/library/unicodedata.html) exposes character metadata but does not supply Rich’s complete grapheme/terminal-width policy. The width table is a sorted interval array, so [`bisect`](https://docs.python.org/3/library/bisect.html)/binary search gives O(log m) lookup; segmentation is intended O(n). Span tuples `(start, end, width)` must satisfy `start[0] == 0`, `end[-1] == len(text)`, `start[i+1] == end[i]`, and strictly increasing indices. Cell splitting is an interval-partition problem, not proportional indexing. Avoid recomputing `cell_len(before)` on every iteration, which can turn splitting into O(n²).

**Triage and tests.** First separate hangs, wrong width, lost text, and incorrect wrapping. For every splitter, property-test empty input, isolated combining marks, leading/doubled/trailing ZWJ, variation selectors, control codes, emoji sequences, CJK, mixed ASCII/wide/zero-width text, and every supported Unicode table version. Assert monotonic progress, contiguous spans, total-width conservation, and termination within a bounded step count. Test every cell cut from 0 through total width; allow the documented two-space substitution only when cutting inside a double-width glyph. Exercise fast and general paths with equivalent inputs and compare results, then benchmark long strings separately.

**Documentation:** [`unicodedata`](https://docs.python.org/3/library/unicodedata.html), [Unicode HOWTO](https://docs.python.org/3/howto/unicode.html), [`bisect`](https://docs.python.org/3/library/bisect.html), [sequence slicing](https://docs.python.org/3/library/stdtypes.html), and [`itertools`](https://docs.python.org/3/library/itertools.html) for linear iterator pipelines.

## R05. Tables, panels & visual layout

**Dataset tasks:** `rich_3718`, `rich_3938`, `rich_3935`, `rich_3518`, `rich_2725`  
**Default priority:** P2.

**Root-cause analysis.** Layout defects arise when style, geometry, and child-column state diverge. Panel titles used a partial border style rather than the same composite style as the border. Soft-wrap styling included newline terminators, extending backgrounds into line breaks; the fix splits content from terminators before applying style. Padding calculations ignored edge/collapse rules, so the sum of column widths and padding disagreed with measured width. Columns auto-created by `add_row` used dataclass defaults instead of inheriting the table’s highlight policy. A static box-element tuple had adjacent mid/footer entries transposed, so the data table itself encoded the wrong rendering order.

**Relevant Python APIs and DSA.** A table is a 2D grid with per-column metadata; derived children must inherit parent policy. Width computation is additive accounting, and box glyphs are ordered records. [`str.partition()`](https://docs.python.org/3/library/stdtypes.html#str.partition) preserves whether a newline delimiter existed, while generator-based line processing avoids unnecessary intermediate copies. [`dataclasses.field`](https://docs.python.org/3/library/dataclasses.html#dataclasses.field) defaults apply only when callers omit explicit inheritance. Span/style composition remains ordered: later or prepended styles have different precedence under Rich’s policy.

**Triage and tests.** Render to a fixed-width capture console and compare both plain text and ANSI styles. For panels, assert title/subtitle/border backgrounds. For soft wrap, inspect each segment and ensure newline segments carry no content background. For geometry, test first/middle/last columns with `collapse_padding` and `pad_edge`, checking that component widths sum to the final measurement. Add rows with more cells than existing columns and verify inherited highlighting. Test every row type against the expected box-glyph tuple, not only a full-table snapshot.

**Documentation:** [`dataclasses`](https://docs.python.org/3/library/dataclasses.html), [iterators](https://docs.python.org/3/tutorial/classes.html#iterators), [string methods](https://docs.python.org/3/library/stdtypes.html#string-methods), and [list/sequence semantics](https://docs.python.org/3/tutorial/datastructures.html).

## R06. Live displays, progress & prompts

**Dataset tasks:** `rich_3934`, `rich_3882`, `rich_3905`, `rich_3052`  
**Default priority:** P2.

**Root-cause analysis.** Lifecycle flags were not symmetric. Empty transient `Live` wrote a trailing newline on `stop()` despite a last-render height of zero, and `Progress(disable=True)` suppressed startup output but not shutdown output. Prompt validation errors were authored in Rich markup but printed with the console’s inherited markup setting, exposing raw tags when markup was globally disabled. Case-insensitive choices normalized input and choices repeatedly with `lower()`, which is correct for the narrow feature but rebuilds lists and does not provide full Unicode caseless matching.

**Relevant Python APIs and DSA.** The display is a small state machine: no rendered content implies height zero and no cleanup newline; whatever `start()` gates, `stop()` must also gate. The [`with` context-manager protocol](https://docs.python.org/3/reference/datamodel.html#with-statement-context-managers) makes that symmetry important on exceptional exits. [`property`](https://docs.python.org/3/library/functions.html#property) can expose derived render height. For choices, a prebuilt normalized-key dictionary gives O(n) setup and expected O(1) lookup; [`str.casefold()`](https://docs.python.org/3/library/stdtypes.html#str.casefold) is stronger than `lower()` for Unicode caseless comparisons, though adopting it is a policy change requiring tests.

**Triage and tests.** Capture `repr(output)` for empty, nonempty, transient, alternate-screen, terminal/non-terminal, and disabled live/progress instances; test normal and exceptional context exits. Assert no newline when nothing rendered. For prompts, test markup enabled/disabled and validation failures separately from successful input. For choices, cover canonical return values, mixed case, invalid input, duplicate normalized choices, and non-ASCII policy. Check that repeated attempts do not unnecessarily rebuild normalization maps.

**Documentation:** [context managers](https://docs.python.org/3/reference/compound_stmts.html#the-with-statement), [`property`](https://docs.python.org/3/library/functions.html#property), [`str.lower()/casefold()`](https://docs.python.org/3/library/stdtypes.html#string-methods), and [dictionary lookup](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict).

## R07. Tracebacks, introspection & object representation

**Dataset tasks:** `rich_3894`, `rich_3486`, `rich_3772`, `rich_3676`, `rich_3472`, `rich_3006`  
**Default priority:** P2; P1 for recursion, stack exhaustion, or crashes on legal objects.

**Root-cause analysis.** Introspection metadata was trusted too strongly. An arbitrary object’s `__qualname__` need not be a string; dataclass field declaration does not guarantee an instance attribute exists; and comparing a default with `inspect.Parameter.empty` using `==` can invoke user-defined equality instead of testing sentinel identity. Exception groups and cause/context links form a graph, not necessarily a chain, so rendering without a visited set can recurse forever or duplicate stacks. Fine-grained error locations require version-gated code-position metadata and correct style ordering. PEP 678 notes require safe optional-attribute handling and per-instance list factories rather than shared mutable defaults.

**Relevant Python APIs and DSA.** [`inspect`](https://docs.python.org/3/library/inspect.html) documents live-object metadata and [`inspect.Parameter.empty`](https://docs.python.org/3/library/inspect.html#inspect.Parameter.empty); sentinels require `is`, not `==`. [`dataclasses.fields()`](https://docs.python.org/3/library/dataclasses.html#dataclasses.fields) describes declared fields, while `hasattr` checks live state. [`code.co_positions()`](https://docs.python.org/3/library/dis.html#dis.Positions) and [`traceback.walk_tb`](https://docs.python.org/3/library/traceback.html#traceback.walk_tb) support source ranges. Exception traversal needs a visited set, O(V + E) time and O(V) auxiliary space; where custom equality/hash is possible, identity-based tracking is safer. PEPs [654](https://peps.python.org/pep-0654/), [657](https://peps.python.org/pep-0657/), and [678](https://peps.python.org/pep-0678/) define exception groups, fine-grained locations, and notes.

**Triage and tests.** Construct minimal hostile-but-legal objects: non-string `__qualname__`, unusual descriptors/slots, custom `__eq__`, unset `field(init=False)`, self-referential/shared exception groups, and self-cause/context. Assert termination and no duplicate output. Test notes absent/present and confirm separate list instances. Gate position-based rendering by supported Python versions and test missing source/position data. Audit all sentinel comparisons and all dunder values retrieved with `getattr`; add type and identity guards rather than assuming normal user objects.

**Documentation:** [`inspect`](https://docs.python.org/3/library/inspect.html), [`traceback`](https://docs.python.org/3/library/traceback.html), [`dataclasses`](https://docs.python.org/3/library/dataclasses.html), [exception chaining](https://docs.python.org/3/library/exceptions.html), and PEPs [654](https://peps.python.org/pep-0654/), [657](https://peps.python.org/pep-0657/), and [678](https://peps.python.org/pep-0678/).

## R08. Syntax highlighting & URL recognition

**Dataset tasks:** `rich_3782`, `rich_3296`, `rich_3454`, `rich_3067`  
**Default priority:** P2.

**Root-cause analysis.** These tasks combine normalized-value truthiness, style ownership, width accounting, and incomplete lexical recognition. `rich_3782` normalizes padding with `Padding.unpack`, producing a four-element tuple; a non-empty tuple remains truthy even when every element is zero, so zero padding still took the padded-rendering path. The same path failed to subtract horizontal padding from the available code width and could calculate a negative width. The fix centralizes assignment through a `PaddingProperty` descriptor, tests `any(self.padding)`, subtracts both horizontal components, and clamps `code_width` to at least zero. `rich_3296` paints padding from the theme background instead of the base style that includes the caller’s explicit background override—two competing sources of truth for one visual property. `rich_3454` and `rich_3067` are character-class omissions: the URL highlighter stopped at legal/common `@` userinfo and `~` path characters. These are highlighter boundaries, not a claim that the regex is a complete RFC 3986 URL parser.

**Relevant Python APIs and DSA.** [Truth-value testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing) explains why `(0, 0, 0, 0)` is true while `any((0, 0, 0, 0))` is false. The [descriptor protocol](https://docs.python.org/3/howto/descriptor.html) is useful for normalizing every assignment rather than only constructor input. [`re` character classes and greedy quantifiers](https://docs.python.org/3/library/re.html#regular-expression-syntax) determine token extent; hand-maintained allowlists need explicit boundary tests. Syntax layout is additive interval accounting: `available = total - line_numbers - separators - left_padding - right_padding`, with a non-negative-width invariant. Regex recognition is normally linear for this simple URL class, but nested ambiguous quantifiers elsewhere still warrant backtracking review.

**Triage and tests.** For padding defects, compare integer zero, an all-zero tuple, asymmetric padding, and padding larger than the console width; verify identical zero-padding renderings, correct backgrounds, non-negative code width, and no overflow. Test reassignment after construction so descriptor normalization is exercised. For backgrounds, distinguish theme default from explicit override and inspect emitted ANSI rather than only plain text. For URLs, table-test `@`, `~`, userinfo, `/~user/` paths, query/fragment characters, Unicode adjacent text, and trailing punctuation. Check both recognized span and following text; do not “fix” highlighting by accepting arbitrary delimiters or silently changing link targets.

**Documentation:** [`re`](https://docs.python.org/3/library/re.html), [regular-expression HOWTO](https://docs.python.org/3/howto/regex.html), [truth-value testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing), [descriptor HOWTO](https://docs.python.org/3/howto/descriptor.html), and [`typing.NamedTuple`](https://docs.python.org/3/library/typing.html#typing.NamedTuple) for fixed-shape normalized records.

## R09. Text & style data-structure internals

**Dataset tasks:** `rich_3480`, `rich_3471`, `rich_2943`, `rich_3061`  
**Default priority:** P1; P0 for attacker-reachable self-append/nontermination.

**Root-cause analysis.** `rich_3480` is mutation during lazy iteration: appending a `Text` to itself extended `_spans` from a generator reading that same list. Because list iterators can observe appended elements, the source never becomes exhausted, causing unbounded growth rather than a finite copy. Taking `text._spans.copy()` before extension snapshots the source and restores linear behavior. `rich_3471` is inconsistent normalization across entry points: `append_tokens` did not strip control codes before storing text and advancing span offsets, allowing downstream exceptions and an offset ledger based on different content. `rich_2943` is stale derived state: `clear_meta_and_links` changed equality-relevant metadata but retained the cached `_hash`, violating hash/equality consistency until `_hash` is reset. `rich_3061` is interval-bookkeeping loss during tab expansion: replacing a styled tab with spaces discarded style coverage; `Span.extend(cells)` and extending eligible spans preserve the original style interval across inserted cells.

**Relevant Python APIs and DSA.** [`list`/mutable-sequence semantics](https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types) and [`list.copy()`](https://docs.python.org/3/tutorial/datastructures.html) are central to aliasing fixes; never extend a sequence from a lazy iterator that may alias it. [`object.__hash__`](https://docs.python.org/3/reference/datamodel.html#object.__hash__) must agree with equality, and any cached hash must be invalidated whenever logically immutable state is replaced through a copy-with-edit operation. [Custom truthiness](https://docs.python.org/3/reference/datamodel.html#object.__bool__) also matters when deciding whether an empty style should produce a span. `_spans` is an ordered interval list over a mutable text buffer: text rewrites must translate offsets and extend/split intervals deliberately. A correct self-append is O(n); the aliased generator defeats that bound. Strip-then-measure is the required order for token offsets.

**Triage and tests.** Reproduce `text.append(text)` and `text.append_text(text)` with a timeout, then assert finite termination, exact content doubling, and the expected span count. Property-test appending distinct and aliased objects. For token input, include control codes and verify stored text and all subsequent offsets against stripped content. Force `hash(style)` before clearing metadata/links, then compare hashes and equality and exercise the result in sets/dicts; audit sibling copy-with-edit methods for the same cache omission. For tabs, test styled/unstyled tabs, multiple tab stops, tabs at span boundaries, zero/custom tab sizes, and console-default behavior; assert every inserted space inherits only the intended style. Treat a style hash mismatch as a correctness defect even if rendering appears unchanged.

**Documentation:** [mutable sequences](https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types), [list operations](https://docs.python.org/3/tutorial/datastructures.html), [`object.__hash__`](https://docs.python.org/3/reference/datamodel.html#object.__hash__), [`object.__bool__`](https://docs.python.org/3/reference/datamodel.html#object.__bool__), and [`copy`](https://docs.python.org/3/library/copy.html).

## R10. Export & output formats

**Dataset tasks:** `rich_3105`, `rich_3043`  
**Default priority:** P2.

**Root-cause analysis.** Both tasks are output-artifact contract violations rather than rendering-algorithm defects. `rich_3105` loses the intended monospace presentation because a browser’s user-agent style for `<code>` can override inheritance from `<pre>`; adding `font-family:inherit` makes the export template explicit. `rich_3043` emits an invalid document skeleton by placing `<html>` after `</head>` rather than around both `<head>` and `<body>`. Browser error recovery can conceal this defect, so successful visual opening is not proof of valid structure. Because the export skeleton is a `str.format` template, literal CSS braces must remain doubled, and the declared UTF-8 charset must match the bytes actually written.

**Relevant Python APIs and DSA.** [`str.format` syntax](https://docs.python.org/3/library/string.html#format-string-syntax) defines substitution fields and `{{`/`}}` escaping; an accidental unmatched or unescaped brace can turn a static template change into an export-time exception. [`html.escape()`](https://docs.python.org/3/library/html.html#html.escape) is relevant whenever exported code is inserted into markup, while [`html.parser`](https://docs.python.org/3/library/html.parser.html) can provide a basic structural smoke test (not full HTML5 validation). [`open(..., encoding='utf-8')`](https://docs.python.org/3/library/functions.html#open) and the [Unicode HOWTO](https://docs.python.org/3/howto/unicode.html) support the encoding invariant. Treat the template as a small grammar with balanced nesting, a closed substitution-field set, context-appropriate escaping, and consistent output encoding.

**Triage and tests.** Export minimal and grapheme-heavy consoles, then inspect the exact template around doctype, `<html>`, `<head>`, charset metadata, `<body>`, `<pre>`, and `<code>`. Parse the result and assert the intended hierarchy; do not rely solely on a browser screenshot. Include `&`, `<`, `>`, quotes, `{`, and `}` in source content and verify escaped markup plus successful formatting. Write the export, re-read it strictly as UTF-8, and test non-ASCII content to expose charset/byte mismatches. Verify the CSS rule survives substitution and test in the target browser/rendering pipeline when font fidelity matters.

**Documentation:** [format-string syntax](https://docs.python.org/3/library/string.html#format-string-syntax), [`html`](https://docs.python.org/3/library/html.html), [`html.parser`](https://docs.python.org/3/library/html.parser.html), [text I/O and encodings](https://docs.python.org/3/library/io.html#text-i-o), and [Unicode HOWTO](https://docs.python.org/3/howto/unicode.html).

---

# Consolidated triage playbook

The 27 families reduce to a small set of repeatable engineering checks. First, reproduce at the public boundary and capture the smallest legal input, runtime/dependency versions, and exact observable failure. Second, identify the representation and owner of the bad value: raw bytes, text, encoded body, parsed mapping, callable annotation, dependency graph, schema tree, response stream, terminal grapheme, style interval, or export template. Third, write the violated invariant before editing code—for example, byte length equals `len(text.encode(...))`, history contains predecessors only, every scanner branch advances, cleanup follows stream completion, or nested schema state is not shared. Fourth, choose the simplest DSA that preserves that invariant: a canonical-key map, visited set, ordered deduplication map, immutable cache key, interval list, sorted width table, explicit state machine, or LIFO exit stack. Finally, add regression tests at the boundary that failed plus property/matrix tests for the dimensions the original special cases omitted.

Prioritization should follow blast radius rather than patch size. One-character regex or sentinel fixes can be high impact, while large compatibility patches may be routine maintenance. Escalate security-boundary errors, hangs, self-referential growth, cross-request mutation, and resource leakage. Keep rendering and documentation defects at normal/low priority unless they crash, disclose data, or corrupt downstream artifacts. When tasks in one family represent sequential fixes to the same function, use the latest patch as canonical and earlier patches as historical evidence, not as independent confirmation of a single root cause.

# Official reference map

The supplied resource guide was used to prioritize primary Python references. The most reusable documentation entry points across the families are:

- **Runtime structure and typing:** [data model](https://docs.python.org/3/reference/datamodel.html), [`inspect`](https://docs.python.org/3/library/inspect.html), [`typing`](https://docs.python.org/3/library/typing.html), [`dataclasses`](https://docs.python.org/3/library/dataclasses.html), [`functools`](https://docs.python.org/3/library/functools.html), and PEPs [544](https://peps.python.org/pep-0544/), [563](https://peps.python.org/pep-0563/), [654](https://peps.python.org/pep-0654/), [657](https://peps.python.org/pep-0657/), [678](https://peps.python.org/pep-0678/), [695](https://peps.python.org/pep-0695/), and [702](https://peps.python.org/pep-0702/).
- **Containers, copying, graphs, and algorithms:** [built-in types](https://docs.python.org/3/library/stdtypes.html), [`collections.abc`](https://docs.python.org/3/library/collections.abc.html), [`copy`](https://docs.python.org/3/library/copy.html), [`bisect`](https://docs.python.org/3/library/bisect.html), [`itertools`](https://docs.python.org/3/library/itertools.html), and [`graphlib`](https://docs.python.org/3/library/graphlib.html).
- **Text, bytes, Unicode, and parsing:** [string methods](https://docs.python.org/3/library/stdtypes.html#string-methods), [`re`](https://docs.python.org/3/library/re.html), [`json`](https://docs.python.org/3/library/json.html), [`unicodedata`](https://docs.python.org/3/library/unicodedata.html), [Unicode HOWTO](https://docs.python.org/3/howto/unicode.html), [`html`](https://docs.python.org/3/library/html.html), and [format strings](https://docs.python.org/3/library/string.html#format-string-syntax).
- **I/O, lifetime, processes, and errors:** [`io`](https://docs.python.org/3/library/io.html), [`contextlib`](https://docs.python.org/3/library/contextlib.html), [`os`](https://docs.python.org/3/library/os.html), [`sys`](https://docs.python.org/3/library/sys.html), [`traceback`](https://docs.python.org/3/library/traceback.html), [`exceptions`](https://docs.python.org/3/library/exceptions.html), and [`pickle`](https://docs.python.org/3/library/pickle.html).
- **HTTP-adjacent stdlib behavior:** [`urllib.parse`](https://docs.python.org/3/library/urllib.parse.html), [`urllib.request`](https://docs.python.org/3/library/urllib.request.html), [`http`](https://docs.python.org/3/library/http.html), [`http.client`](https://docs.python.org/3/library/http.client.html), and [`netrc`](https://docs.python.org/3/library/netrc.html). These define useful Python behavior but do not replace Requests/HTTPX compatibility policy or the relevant HTTP specifications.
- **Verification and performance:** [`unittest`](https://docs.python.org/3/library/unittest.html), [`unittest.mock`](https://docs.python.org/3/library/unittest.mock.html), [`doctest`](https://docs.python.org/3/library/doctest.html), [`timeit`](https://docs.python.org/3/library/timeit.html), [`cProfile`](https://docs.python.org/3/library/profile.html#cProfile), and [`python -X importtime`](https://docs.python.org/3/using/cmdline.html#cmdoption-X). Property-based tests are especially valuable for span partitions, cell splits, parser boundaries, and cache-key matrices.

# Evidence limits and open questions

The analysis is bounded by the supplied problem statements and reference/test patches; repository rebuilds and full upstream test-suite execution were not performed. Patch presence establishes the intended correction, not that every edge case is solved. In particular, sequential Rich cell-splitting fixes should be evaluated at their actual base commits, URL highlighting remains deliberately narrower than full URL parsing, Unicode rendering depends on terminal/font/Unicode-version policy, and dependency/version recommendations must be checked against the project’s supported matrix. Any proposed security severity beyond the supplied evidence requires a separate exploitability review.

The actionable next step is to convert each family’s tests into a shared regression checklist, then run it against the target repository revision and supported Python/dependency matrix. Preserve the distinctions in this report—language guarantee versus framework policy, code point versus grapheme versus cell, container truth versus field truth, and object return versus resource cleanup—when reviewing generated patches.


---

<!-- ====================================================================== -->
<!-- FILE: 05_gemma4-agent-brain-architecture.md -->
<!-- ====================================================================== -->

# Gemma 4 Developer Agent Competition — Brain Architecture for 27 Task Families, 31B and E4B Tracks

## Part 0 — Report metadata

| Field | Value |
|---|---|
| Preparation and research date | 2026-11-02 |
| Research cutoff | 2026-11-02; later upstream changes are deliberately excluded |
| Mode | Exhaustive, deep-and-wide, source-ranked research; no task solving or training |
| Deliverable | Research blueprint and draft-ready declarative brain artifacts, not a working submission |
| Workstreams | Contract/runtime; model tracks; corpus/taxonomy; 27 family dossiers; retrieval; patch control; public prior art; post-training; evaluation; licensing |
| Primary sources | Kaggle search-visible official material, Gemma/model configuration, ADK, vLLM, upstream standards/repositories |
| Community evidence | Dated public engineering logs and reproducible benchmark artifacts, always labeled as such |
| Corpus provenance | A complete alternate public 129-task index was recovered. The original CSV and JSONL paths in the handoff were absent and were **not** inspected. |

**How to read this report.** Parts I–III are the implementable answer: corpus and dossiers, track designs, and build/evaluation recipes. Part IV separates official contracts from community reports and records contradictions. Part V contains the complete 129-row profile, all rosters and upstream links, budget arithmetic, LoRA matrix, license screen, and research log. A family label is a routing aid, not a hidden-test prediction. Every configuration value marked “starting hypothesis” must be measured against the actual starter harness before it becomes a submission setting.

**Confidence legend.** **High** means primary documentation or reproducible data directly supports the claim. **Medium** means convergent community evidence or a strong derivation with a material unexecuted assumption. **Low** means a planning hypothesis. **Implementation readiness:** **IR-A** is draft-ready text; **IR-B** requires a contract/runtime probe; **IR-C** requires paired agent evaluation before adoption; **IR-D** is research-only and should not enter the first scaffold.

## Part I — The answer

### 1. Executive summary

| # | Conclusion that matters | Confidence | Decision and pointer |
|---:|---|---|---|
| 1 | **The harness contract is the first brain component.** General ADK Agent Config is experimental and documents Gemini-only model support, whereas the competition supplies a custom Gemma compiler/runtime ([ADK](https://adk.dev/agents/config/)). | High | Probe includes, tools, skills, adapters, and eval overrides before architecture work; §11, §16. |
| 2 | **Retrieval should be lexical-first, graph-assisted.** File BM25 reaches R@20 69.0%; the best tested graph-node method reaches 53.3% on a different 107-task node-evaluable denominator ([benchmark](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)). | High | Exact identifiers/files first; one bounded structural expansion only when useful; §7, §17, Appendix G. |
| 3 | **One shared kernel, two deliberately different shells.** In the latest same-setting community run, 31B solved 51/129 and E4B 20/129; all 20 E4B solves were a subset of 31B’s ([Fatu results](https://github.com/fatu/gemma4-dev-agent/blob/main/RESULTS.md)). | Medium-High | Do not swap weights into an identical brain; §8–§10. |
| 4 | **F-03, F-07, and F-08 are the first FastAPI targets.** They contain 32 tasks, mostly compact patches; F-07 is uniformly one-file with a 15.5-line median reference patch (derived from the recovered index). | High | Build dependency, request-extraction, and Pydantic-schema procedures first; §4.3, §4.7, §4.8. |
| 5 | **Rich’s small rendering/state families outperform broad refactors as artifact candidates.** F-13 through F-19 contain 37 tasks, generally local parser, layout, I/O, state, or introspection changes. | High | Prefer compact triggered skills over repository-wide prompt dumps; §4.13–§4.19. |
| 6 | **Native context and served context are different contracts.** Official native context is 256K for 31B and 128K for E4B; the 32K figure is community-reported serving configuration, not a model limitation ([Gemma card](https://ai.google.dev/gemma/docs/core/model_card_4)). | High on native; Medium on served | Design to a probe-gated 32K envelope, never to 256K; §17, Appendix H. |
| 7 | **Minimal source diffs and verification discipline are shared invariants.** Public logs repeatedly report wrong files, wrong fixes, timeouts, no-patch outcomes, and edit-tool failures rather than a single reasoning deficit ([Fatu results](https://github.com/fatu/gemma4-dev-agent/blob/main/RESULTS.md)). | Medium-High | Enforce edit-by-deadline, targeted tests, repeated-call detection, and diff hygiene; §7, §11. |
| 8 | **LoRA is a gated second wave, not the baseline.** Public adapters have produced both a small non-significant gain and catastrophic repetition/timeout regressions; held-out NLL did not predict agent behavior ([Fatu results](https://github.com/fatu/gemma4-dev-agent/blob/main/RESULTS.md)). | Medium-High | Select checkpoints by held-out PASS and trajectory health, never NLL alone; §12. |
| 9 | **Small score deltas are often noise.** With 20 discordant paired outcomes on 129 tasks, an approximate 95% half-width for a score difference is 6.8 percentage points; on 58 tasks with 12 discordances it is 11.7 points (Appendix H). | High | Use paired per-instance outcomes, McNemar tests, and frozen held-out splits; §13. |
| 10 | **The 27 families are a working partition, not a hidden-set law.** The original labels were unavailable, and several tasks genuinely sit on DI/security, Pydantic/OpenAPI, and docs/runtime boundaries. | High | Keep a generic unfamiliar-family path and leave-one-family-out tests; §3, §13, §22. |

**Recommended 31B architecture.** A single contract-driven root agent runs a budgeted locate → read → edit → targeted-verify → review loop, with conditional decomposition only for cross-layer features. It starts with lexical file/symbol retrieval, uses graph neighbors as a bounded assist, carries broader family resources, and reserves time for verification. A unified adapter is attempted only after the no-adapter baseline and data/contamination gates pass. This is **IR-B/IR-C**, not a measured final submission.

**Recommended E4B architecture.** A shorter single-agent loop uses explicit search templates, an earlier first-edit deadline, compact triggered resources, deterministic repeated-call breakers, and no planner sub-agent fan-out. It prioritizes single-file semantic families and uses a conservative low-rank SFT adapter only if held-out PASS improves without increasing loops or timeouts. The design responds to observed E4B wrong-file/repetition failures rather than assuming that faster inference compensates for weaker control.

### 2. Scope, definitions, and the “brain” concept

| Term | Operational definition |
|---|---|
| Brain | Declarative prompts, agent/sub-agent configuration, skills/resources, repository-navigation contracts, and the specified—but not executed—adapter pipeline. |
| Brain kernel | Track-invariant rules: literal specification extraction, safe tools, lexical-first localization, minimal source edits, targeted verification, clean diff, and submission. |
| Track shell | Model-specific prompt length, retrieval depth, decomposition, context/thinking/tool budgets, stopping rules, family routing, and adapter strategy. |
| Family | One of the requested 27 technical subcategories; a retrieval and engineering unit, not proof of hidden-set distribution. |
| De facto spec | The observable behavior implied by the statement, existing API, sibling implementations, and repository tests—not merely the literal example. |
| Localization surface | Files, symbols, callers, generated-data boundaries, and parallel sync/async or registration paths likely to contain the cause. |
| Artifact form | Generic prompt, family skill, reference resource, navigation helper, optional sub-agent, or adapter supervision. |
| Marginal value | Expected transfer-weighted benefit of adding a dedicated artifact after the generic kernel, discounted by task count, tractability, context cost, and overfit risk. |

**In scope:** all 129 recovered public tasks, all 27 families, four repositories, submission/runtime constraints, both requested model tracks, external normative resources, localization, patch/test procedure, post-training specification, evaluation, public prior art, and license compatibility. **Out of scope:** solving public tasks, creating a working `submission.zip`, running training, producing checkpoints, identifying hidden instances, hardcoding per-instance answers, or treating public gold patches as hidden-test knowledge. Potential benchmark-exploitation observations are limitations only and generate no recommendation.

The contract-safe first version is intentionally smaller than the theoretically possible brain. Skills and sub-agents are optional accelerators, not prerequisites for a valid agent. The minimal viable brain is a strong system prompt, a small repository-navigation resource set, explicit budget control, and a clean edit/verify loop; each additional component must justify its tokens and failure surface. The submission-contract reality and unresolved probes are specified in §§11 and 16.

### 3. The dataset: 129 tasks, 27 families, 4 repositories

#### 3.1 Corpus profile and heavy tail

The recovered index contains **129 unique instances**: FastAPI 67, Rich 48, Requests 13, and HTTPX 1. The median reference patch is **32 lines**, **91/129 (70.5%)** touch one reference file, and the median statement length is **418 characters**. The maximum is **12,870 lines across 26 files** for `rich_3930`, a versioned Unicode-data update; that one record accounts for **46.6%** of all reference patch lines. These are reference-diff statistics, not predictions of the smallest valid agent patch ([recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

![Family counts, patch medians, and one-file prevalence](gemma4-brain-assets/family-corpus-profile.png)

Seventeen families, representing 86 tasks, have a median reference patch no greater than 40 lines. This supports a small-patch generic kernel, but the broad exceptions matter: compatibility migrations, lifecycle features, SSE additions, and generated Unicode tables require different budgets and should not dominate SFT tokens. The original statements and complete patch/test bodies were not available in this continuation, so “gold anatomy” below means file/symbol anatomy from the recovered index plus upstream behavioral titles—not a fabricated line-by-line reading.

#### 3.2 The 27-family roster

| Family | Repository | N | Median patch lines | One-file tasks | Primary artifact |
|---|---|---:|---:|---:|---|
| F-01 Authentication & request security | fastapi/fastapi | 4 | 96.5 | 2/4 | `skills/fastapi-request-security/SKILL.md` plus a compact RFC/OAuth checklist. |
| F-02 Compatibility, deprecations & warnings | fastapi/fastapi | 4 | 486 | 0/4 | `repo_navigation/resources/fastapi-version-matrix.md`; normally no standalone skill. |
| F-03 Dependency injection & function/annotation handling | fastapi/fastapi | 13 | 34 | 9/13 | `skills/fastapi-dependant-analysis/SKILL.md` with a callable/annotation decision table. |
| F-04 Documentation & project automation | fastapi/fastapi | 3 | 16 | 3/3 | `repo_navigation/resources/executable-docs-and-automation.md`, not a model-triggered skill by default. |
| F-05 Errors & developer experience | fastapi/fastapi | 2 | 149 | 0/2 | `skills/fastapi-error-contract/SKILL.md` with an error-channel table. |
| F-06 OpenAPI, JSON Schema & schema metadata | fastapi/fastapi | 7 | 34 | 4/7 | `skills/fastapi-openapi-composition/SKILL.md` with object/scope/escape checklists. |
| F-07 Parameter & request-body parsing | fastapi/fastapi | 8 | 15.5 | 8/8 | `skills/fastapi-request-extraction/SKILL.md`; this is a first-wave artifact for both tracks. |
| F-08 Pydantic, models & type handling | fastapi/fastapi | 11 | 33 | 9/11 | `skills/fastapi-pydantic-v2-schema/SKILL.md` with a model/transformation pipeline. |
| F-09 Responses, SSE & streaming | fastapi/fastapi | 7 | 85 | 4/7 | `skills/fastapi-response-lifecycle/SKILL.md` plus an SSE/ASGI sequence resource. |
| F-10 Routing, application APIs & lifecycle | fastapi/fastapi | 8 | 114.5 | 4/8 | `skills/fastapi-routing-lifecycle/SKILL.md` with route-object and lifespan checklists. |
| F-11 Export & output formats | Textualize/rich | 2 | 14 | 2/2 | `repo_navigation/resources/rich-export-contract.md`; generic minimal-patch loop plus one CSS checklist. |
| F-12 Import-time performance | Textualize/rich | 1 | 402 | 0/1 | `repo_navigation/resources/rich-import-graph.md`; no dedicated runtime skill. |
| F-13 Live displays, progress & prompts | Textualize/rich | 4 | 29 | 3/4 | `skills/rich-interactive-state/SKILL.md` with state-transition tables. |
| F-14 Markdown & markup parsing/rendering | Textualize/rich | 6 | 23 | 5/6 | `skills/rich-markdown-composition/SKILL.md` with block/inline/context matrix. |
| F-15 Syntax highlighting & URL recognition | Textualize/rich | 4 | 12 | 4/4 | `skills/rich-syntax-and-highlights/SKILL.md` with measurement/style and regex boundary checks. |
| F-16 Tables, panels & visual layout | Textualize/rich | 5 | 30 | 5/5 | `skills/rich-layout-style-regions/SKILL.md` with region/style/phase table. |
| F-17 Terminal detection, ANSI & console I/O | Textualize/rich | 8 | 32 | 6/8 | `skills/rich-console-io/SKILL.md` with stream/capability/environment matrix. |
| F-18 Text & style data-structure internals | Textualize/rich | 4 | 15.5 | 3/4 | `skills/rich-text-segment-invariants/SKILL.md` with mutation/cache/iterator checks. |
| F-19 Tracebacks, introspection & object representation | Textualize/rich | 6 | 46 | 4/6 | `skills/rich-safe-introspection/SKILL.md` with hostile-object and exception-chain checklist. |
| F-20 Unicode, graphemes & cell-width segmentation | Textualize/rich | 8 | 57.5 | 5/8 | `skills/unicode-cell-segmentation/SKILL.md` plus a versioned UAX #29/#11 resource; exclude generated data from prompt preload. |
| F-21 Authentication configuration | psf/requests | 1 | 11 | 1/1 | `repo_navigation/resources/requests-auth-precedence.md`; no dedicated skill needed for one task. |
| F-22 Dependency compatibility & HTTP constants | psf/requests | 2 | 26.5 | 1/2 | `repo_navigation/resources/http-version-compat.md` with status/feature-detection checks. |
| F-23 Protocol typing & duck-type compatibility | psf/requests | 1 | 63 | 0/1 | `skills/requests-duck-type-boundaries/SKILL.md`, shared with F-25. |
| F-24 Redirects & connection/stream lifecycle | encode/httpx, psf/requests | 2 | 135.5 | 1/2 | `skills/http-connection-lifecycle/SKILL.md` with redirect-list and keep-alive state machines. |
| F-25 Request bodies, file wrappers & content length | psf/requests | 3 | 13 | 3/3 | `skills/requests-body-encoding/SKILL.md` shared with F-23. |
| F-26 Response parsing & exception serialization | psf/requests | 2 | 27 | 2/2 | `repo_navigation/resources/requests-parsing-exceptions.md`. |
| F-27 URLs, paths & proxy boundary handling | psf/requests | 3 | 12 | 3/3 | `skills/requests-url-proxy-boundaries/SKILL.md` with URL pipeline and host-match table. |

#### 3.3 Archetype taxonomy

| Archetype | Families | Brain consequence |
|---|---|---|
| Single-site boundary semantics | F-04, F-07, F-11, F-14–F-18, F-21–F-23, F-25–F-27 | Direct symbol/file routing, a compact decision table, early edit, one targeted regression check. |
| Cross-layer type/schema/dependency flow | F-01, F-03, F-06, F-08 | Trace construction and consumption separately; avoid fixing generated output when the producer is wrong. |
| Lifecycle/state machine | F-05, F-09, F-10, F-13, F-17, F-19, F-24 | Write states and ownership before editing; check sync/async and enter/exit parity. |
| Algorithmic text/Unicode internals | F-18, F-20 | Prove progress and offset invariants on degenerate input; do not equate codepoints, graphemes, bytes, and cells. |
| Broad compatibility/public API work | F-02, F-09, F-10, F-12 | Higher budget and regression surface; exclude bulk diffs from generic small-patch training. |

This archetype layer is more behaviorally stable than the 27 labels. A hidden task that does not match a named family can still match a boundary-semantics, cross-layer-flow, lifecycle, algorithmic, or broad-API path. The family router should therefore be allowed to return “generic archetype” rather than forcing the nearest public label.

#### 3.4 Label-validation findings

The required counts reconcile exactly, but the following assignments are **reconstructed boundary decisions**, not claims that the absent CSV contained these exact labels. They were chosen from behavior and touched symbols rather than filenames alone.

| Instance | Boundary | Assignment used | Reason |
|---|---|---|---|
| `fastapi_5624` | DI scopes vs request security | F-01 | Hierarchical security-scope propagation is the observable contract. |
| `fastapi_14459`, `fastapi_14455`, `fastapi_14266` | Security vs OpenAPI | F-06 | Security scheme/requirement generation is the decisive output. |
| `fastapi_14349`, `fastapi_13207`, `fastapi_14246` | OpenAPI vs Pydantic | F-08 | The defect is in model/schema production before OpenAPI consumption. |
| `fastapi_14371` | Parameter aliases vs Pydantic compatibility | F-08 | Cross-layer field/model behavior dominates the patch. |
| `fastapi_13920` | Type handling vs DI | F-03 | PEP 695 alias resolution occurs in dependant analysis. |
| `fastapi_14964` | Deprecation vs responses | F-09 | Public response classes and rendering are the behavioral surface. |
| `fastapi_15023` | Documentation vs streaming | F-09 | Executable examples specify streaming-with-yield lifetime. |
| `fastapi_14487` | Errors vs documentation | F-04 | The reference change is an executable documentation example. |
| `fastapi_14077` | Compatibility vs errors | F-05 | Exception-handler behavior is the distinguishing changed surface. |
| `rich_3061` | Text internals vs visual layout | F-16 | Styled tab expansion is a user-visible layout/style operation. |

#### 3.5 Repository architecture maps

| Repository | Cognitive map | Highest-value route |
|---|---|---|
| FastAPI | Public app/router APIs → route/dependant construction → Pydantic compatibility/model fields → OpenAPI generation → response/ASGI lifecycle; `docs_src/` is executable product surface. | Use issue nouns to select the pipeline stage; do not start by reading every `dependencies/utils.py` match. |
| Rich | Console/renderables → Text/Style/Segment primitives → layout/Markdown/Syntax → terminal I/O → export; generated Unicode tables are a separate boundary. | Distinguish content, style, line, cell, and terminal-control layers before choosing a file. |
| Requests | Request/PreparedRequest → body/auth/proxy utilities → HTTPAdapter/urllib3 → Session redirects → Response/exceptions. | Trace values through preparation and transport; test dependency-specific boundaries. |
| HTTPX | Sync/async clients and servers → parsers → pools → network streams. | Mirror proven sync/async behavior; one public task provides no frequency prior. |

### 4. Family-by-family brain dossiers

Each dossier below supplies the required identity and roster, issue morphology, public reference-patch anatomy, behavioral specification, normative resources, localization surface and wrong turns, traps, draft-ready brain artifact, separate 31B and E4B variants, expected marginal value, confidence and gaps, and sources. The anatomy is deliberately limited to recovered public metadata and upstream behavioral records; it is not a claim to have inspected the absent original patches or test bodies.

### 4.1 F-01 — Authentication & request security

**Identity, category, repository, count, and roster.** F-01 belongs to the fastapi domain; it contains **4** recovered public tasks. Roster: `fastapi_5624`, `fastapi_13786`, `fastapi_14786`, `fastapi_14978`. Median reference patch: **96.5 lines**; one-file tasks: **2/4** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.1.1 Issue morphology.** Credential normalization, missing-credential status codes, hierarchical OAuth2 scopes, and request Content-Type enforcement. The statements are short on implementation but long on externally visible security behavior.

**4.1.2 Gold-patch anatomy.** Changes span security callables and dependency scope construction, plus route matching for strict JSON media types. One task is a single helper; the 401 task touches parallel security classes and executable documentation, explaining the 96.5-line median.

**4.1.3 De facto behavioral specification.** Missing credentials must produce the specified authentication response; Authorization parameters are stripped before parsing; scopes propagate through the dependency tree without duplication or loss; a route that opts into strict JSON must reject underspecified or wrong media types while preserving legitimate charset/parameters behavior.

**4.1.4 External resources required.**
- [RFC 9110, §§11–12 (authentication and content metadata)](https://www.rfc-editor.org/rfc/rfc9110.html) — **Reason:** Defines 401 semantics, Authorization, and Content-Type.
- [RFC 6749, §3.3 (access-token scope)](https://www.rfc-editor.org/rfc/rfc6749.html) — **Reason:** Normative meaning of OAuth2 scopes.
- [FastAPI security and dependencies](https://fastapi.tiangolo.com/tutorial/security/) — **Reason:** Repository-level API contracts and sibling security implementations.
- [OpenAPI 3.1 Security Requirement Object](https://spec.openapis.org/oas/v3.1.0.html#security-requirement-object) — **Reason:** Separates runtime authentication from schema declaration.

**4.1.5 Localization surface and likely wrong turns.** Start in `fastapi/security/`, `fastapi/dependencies/utils.py`, and `fastapi/routing.py`; then inspect `fastapi/openapi/utils.py` only if the observable output includes generated security schemes. Wrong turns include treating every OAuth issue as an OpenAPI issue, editing docs instead of the security callable, and changing global route behavior rather than the opted-in route.

**4.1.6 Trap list.**
- Returning 403 where the new contract requires 401.
- Stripping only one Authorization scheme or mutating other headers.
- Deduplicating scopes by an unordered set and destabilizing output.
- Rejecting valid JSON media-type parameters or accepting unrelated types.
- Confusing scope cache keys with dependency cache keys.

**4.1.7 Recommended brain artifact and draft content.** `skills/fastapi-request-security/SKILL.md` plus a compact RFC/OAuth checklist.

```text
TRIGGER: credentials, Authorization, OAuth scopes, 401/403, strict JSON, Content-Type.
1. Classify runtime authentication versus OpenAPI declaration.
2. Trace credentials from extraction to dependant/security requirements.
3. Preserve scheme-specific parsing and sibling classes.
4. Test missing, malformed, whitespace, duplicate-scope, and media-type boundary cases.
```

**4.1.8 31B track variant.** Use a two-pass dependency/schema trace when scopes cross layers; compare the nearest security sibling and inspect generated OpenAPI only after runtime behavior is understood.

**4.1.9 E4B track variant.** Force a four-row checklist—credential input, status, parsed value, scopes—and edit the first extraction/helper site before exploring OpenAPI. Limit to one caller and one parallel security class.

**4.1.10 Expected marginal value: HIGH.** Four tasks, several reusable security invariants, and high cost for a wrong status or scope-cache decision.

**4.1.11 Confidence and evidence gaps.** **Medium-High.** The original label for hierarchical scopes is unverified; this report assigns it here by runtime behavior, not by its shared dependency file. No claim below treats public reference patches as hidden-test data.

**4.1.12 Sources.** Representative upstream records: [fastapi_5624](https://github.com/fastapi/fastapi/pull/5624), [fastapi_14786](https://github.com/fastapi/fastapi/pull/14786), [fastapi_14978](https://github.com/fastapi/fastapi/pull/14978); the normative resources linked in §4.1.4; the complete instance digest is Appendix F.

### 4.2 F-02 — Compatibility, deprecations & warnings

**Identity, category, repository, count, and roster.** F-02 belongs to the fastapi domain; it contains **4** recovered public tasks. Roster: `fastapi_14186`, `fastapi_14583`, `fastapi_14605`, `fastapi_14609`. Median reference patch: **486 lines**; one-file tasks: **0/4** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.2.1 Issue morphology.** Version-boundary work: removing Pydantic-v1 support, introducing dedicated deprecation warnings, and suppressing or migrating compatibility warnings for new Python/Pydantic combinations.

**4.2.2 Gold-patch anatomy.** These are the least “small bug” like FastAPI tasks: none is one-file, the median reference change is 486 lines, and removal touches the compatibility facade, models, dependency analysis, OpenAPI, and executable docs.

**4.2.3 De facto behavioral specification.** Warning category, emission point, supported-version matrix, import-time behavior, and remaining compatibility paths must agree. A removal must delete dead paths coherently; a deprecation must warn without changing otherwise valid execution.

**4.2.4 External resources required.**
- [Python `warnings`](https://docs.python.org/3/library/warnings.html) — **Reason:** Warning categories, filters, stack levels, and default visibility.
- [Pydantic migration guide](https://docs.pydantic.dev/latest/migration/) — **Reason:** Defines v1/v2 behavior boundaries.
- [FastAPI release notes](https://github.com/fastapi/fastapi/blob/master/docs/en/docs/release-notes.md) — **Reason:** Pins the intended version transition and exact deprecation wording.
- [Starlette release notes](https://www.starlette.io/release-notes/) — **Reason:** Checks the adjacent framework compatibility contract.

**4.2.5 Localization surface and likely wrong turns.** Map `fastapi/_compat/{__init__,main,may_v1,shared,v1,v2}.py` before editing; then follow imports into `dependencies/utils.py`, `routing.py`, `exceptions.py`, and docs. The main wrong turn is a filename-only global rewrite or adding a warning in a low-level helper where it fires repeatedly.

**4.2.6 Trap list.**
- Training on generated/bulk removal text and teaching large rewrites.
- Wrong `stacklevel`, causing warnings to point inside FastAPI.
- Leaving imports or public names that imply removed support remains.
- Fixing the local environment instead of the source compatibility branch.

**4.2.7 Recommended brain artifact and draft content.** `repo_navigation/resources/fastapi-version-matrix.md`; normally no standalone skill.

```text
RESOURCE: record base commit, Python/Pydantic/Starlette versions, public names, warning category, and intended removal/retention.
RULE: build the compatibility call graph before editing; never infer the whole migration from one failing import.
TRAINING RULE: exclude bulk generated/removal hunks from generic small-patch supervision.
```

**4.2.8 31B track variant.** Allocate extra exploration for the compatibility facade and public re-exports; use a reviewer pass for dangling references and warning emission frequency.

**4.2.9 E4B track variant.** Avoid broad removal tasks unless the statement gives a narrow symbol; prefer warning-category tasks and make one facade-local change. Do not attempt a many-file migration from memory.

**4.2.10 Expected marginal value: MEDIUM.** A version matrix is valuable, but dedicated patch LoRA on these broad diffs has poor transfer and high regression risk.

**4.2.11 Confidence and evidence gaps.** **High on anatomy; Medium on hidden transfer.** Full migration test semantics were not independently replayed; version-specific recommendations must be pinned to each base commit. No claim below treats public reference patches as hidden-test data.

**4.2.12 Sources.** Representative upstream records: [fastapi_14186](https://github.com/fastapi/fastapi/pull/14186), [fastapi_14605](https://github.com/fastapi/fastapi/pull/14605), [fastapi_14609](https://github.com/fastapi/fastapi/pull/14609); the normative resources linked in §4.2.4; the complete instance digest is Appendix F.

### 4.3 F-03 — Dependency injection & function/annotation handling

**Identity, category, repository, count, and roster.** F-03 belongs to the fastapi domain; it contains **13** recovered public tasks. Roster: `fastapi_5077`, `fastapi_9555`, `fastapi_9753`, `fastapi_11355`, `fastapi_13920`, `fastapi_14262`, `fastapi_14301`, `fastapi_14372`, `fastapi_14419`, `fastapi_14448`, `fastapi_14458`, `fastapi_14485`, `fastapi_14794`. Median reference patch: **34 lines**; one-file tasks: **9/13** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.3.1 Issue morphology.** Callable identity and annotation resolution: wrappers, partials, callable classes, forward references, PEP 695 aliases, dependency scopes, cache keys, hashability, and Response as a dependency annotation.

**4.3.2 Gold-patch anatomy.** Nine of thirteen tasks touch one file; the median patch is 34 lines. Most modify `dependencies/models.py` or `dependencies/utils.py`, while scope features cross into params, routing, exceptions, and docs.

**4.3.3 De facto behavioral specification.** Dependency analysis must preserve the callable’s effective signature, async/generator nature, annotations, and identity. Cache and scope behavior must distinguish the dependant, requested scope, and security scopes without incorrectly sharing or recomputing values.

**4.3.4 External resources required.**
- [Python `inspect.signature`](https://docs.python.org/3/library/inspect.html#inspect.signature) — **Reason:** Defines signature unwrapping and annotation evaluation surfaces.
- [Python `functools`](https://docs.python.org/3/library/functools.html) — **Reason:** Specifies `partial` and `wraps` metadata behavior.
- [PEP 695](https://peps.python.org/pep-0695/) — **Reason:** Normative `TypeAliasType` semantics.
- [FastAPI dependencies](https://fastapi.tiangolo.com/tutorial/dependencies/) — **Reason:** Explains yield, caching, Security, and dependency trees.

**4.3.5 Localization surface and likely wrong turns.** Begin with `get_typed_signature`, `get_typed_return_annotation`, callable classifiers, `Dependant.cache_key`, and `get_flat_dependant`; read one registration caller in routing. Wrong turns include unwrapping until the callable kind changes, resolving annotations in the wrong globals/locals, and editing route matching for a dependency-scope problem.

**4.3.6 Trap list.**
- Using `__name__` as callable identity for partials.
- Losing `__wrapped__` return annotations or `TYPE_CHECKING` names.
- Treating every callable object as a plain function.
- Making mutable dependency instances hashable by identity when value semantics are required.
- Ignoring security scopes in cache keys—or adding them where cache should be shared.

**4.3.7 Recommended brain artifact and draft content.** `skills/fastapi-dependant-analysis/SKILL.md` with a callable/annotation decision table.

```text
TRIGGER: Depends, Security, partial, wraps, callable class, forward ref, TypeAliasType, scope, cache.
1. Record raw callable, unwrapped callable, signature, return annotation, async/generator kind.
2. Resolve names in the defining namespace.
3. For cache/scope issues, write the intended key before editing.
4. Exercise one wrapped, one callable-object, and one scoped sibling case.
```

**4.3.8 31B track variant.** Use a small dependency-tree trace for scope tasks and a callable metadata table for wrappers; inspect both models and utils when the first file does not explain identity.

**4.3.9 E4B track variant.** Use a fixed six-field callable table and restrict the search to models/utils. For cache tasks, require a written key tuple in the working notes before editing; avoid speculative multi-file scope redesign.

**4.3.10 Expected marginal value: HIGH.** Largest family, mostly compact patches, and one reusable procedure covers many historically difficult Python edge cases.

**4.3.11 Confidence and evidence gaps.** **High.** Individual hidden-test assertions are not directly inspected; de facto specs derive from titles, touched symbols, and upstream contracts. No claim below treats public reference patches as hidden-test data.

**4.3.12 Sources.** Representative upstream records: [fastapi_5077](https://github.com/fastapi/fastapi/pull/5077), [fastapi_14301](https://github.com/fastapi/fastapi/pull/14301), [fastapi_14794](https://github.com/fastapi/fastapi/pull/14794); the normative resources linked in §4.3.4; the complete instance digest is Appendix F.

### 4.4 F-04 — Documentation & project automation

**Identity, category, repository, count, and roster.** F-04 belongs to the fastapi domain; it contains **3** recovered public tasks. Roster: `fastapi_14487`, `fastapi_14492`, `fastapi_15661`. Median reference patch: **16 lines**; one-file tasks: **3/3** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.4.1 Issue morphology.** Executable documentation corrections and release automation, not prose polishing. Tasks alter a documentation example, SPDX-style license metadata, or the release-preparation script.

**4.4.2 Gold-patch anatomy.** All three reference patches touch one file and have a 16-line median. Two live under `docs_src/`; one lives in `scripts/prepare_release.py`.

**4.4.3 De facto behavioral specification.** Examples must execute and embody the documented schema without leaking raw validation internals; metadata examples must use valid identifiers; release automation must perform the intended version/changelog operations deterministically.

**4.4.4 External resources required.**
- [FastAPI metadata docs](https://fastapi.tiangolo.com/tutorial/metadata/) — **Reason:** Normative repository examples for OpenAPI metadata.
- [SPDX license list](https://spdx.org/licenses/) — **Reason:** Validates license identifiers used in examples.
- [FastAPI handling-errors docs](https://fastapi.tiangolo.com/tutorial/handling-errors/) — **Reason:** Connects executable examples to documented exception output.
- [Python `pathlib` and `re`](https://docs.python.org/3/library/pathlib.html) — **Reason:** Relevant primitives for deterministic release-file edits.

**4.4.5 Localization surface and likely wrong turns.** Treat `docs_src/` as production executable surface and `scripts/` as maintainer automation. Search the exact example value or release-version string. Wrong turns are editing rendered Markdown instead of `docs_src`, “improving” unrelated docs, and using current upstream scripts rather than the base-commit sibling pattern.

**4.4.6 Trap list.**
- Assuming documentation changes are optional for PASS.
- Using a human-readable license name instead of an SPDX identifier.
- Hardcoding a public instance’s exact version bump as a reusable rule.
- Running release automation with side effects during verification.

**4.4.7 Recommended brain artifact and draft content.** `repo_navigation/resources/executable-docs-and-automation.md`, not a model-triggered skill by default.

```text
RESOURCE: docs_src files are executable product surfaces; locate the matching test import before editing.
For metadata, validate identifiers against SPDX.
For release scripts, perform a dry, read-only trace of inputs/outputs; never run publication steps.
```

**4.4.8 31B track variant.** Read the corresponding docs page and test import to infer intended user-visible behavior; inspect script sibling helpers before a narrow automation edit.

**4.4.9 E4B track variant.** Direct path from the statement, one file read, literal replacement or minimal control-flow fix. Skip broad documentation research.

**4.4.10 Expected marginal value: MEDIUM.** Only three tasks but extremely tractable; a short resource prevents the common mistake of ignoring executable docs.

**4.4.11 Confidence and evidence gaps.** **High.** The original CSV could not confirm whether the validation-example task belongs here or under developer experience. No claim below treats public reference patches as hidden-test data.

**4.4.12 Sources.** Representative upstream records: [fastapi_14487](https://github.com/fastapi/fastapi/pull/14487), [fastapi_14492](https://github.com/fastapi/fastapi/pull/14492), [fastapi_15661](https://github.com/fastapi/fastapi/pull/15661); the normative resources linked in §4.4.4; the complete instance digest is Appendix F.

### 4.5 F-05 — Errors & developer experience

**Identity, category, repository, count, and roster.** F-05 belongs to the fastapi domain; it contains **2** recovered public tasks. Roster: `fastapi_14077`, `fastapi_14306`. Median reference patch: **149 lines**; one-file tasks: **0/2** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.5.1 Issue morphology.** Framework error surfaces: endpoint metadata in validation exceptions and exception-handler behavior across a Starlette compatibility transition.

**4.5.2 Gold-patch anatomy.** Both tasks cross files; the 149-line median reflects coordinated exception classes, routing, OpenAPI/error examples, and handlers rather than a single formatting change.

**4.5.3 De facto behavioral specification.** Errors must retain machine-readable structure while gaining useful endpoint context; exception handlers must keep response status/content behavior across supported framework versions; documentation examples must not expose unintended raw internals.

**4.5.4 External resources required.**
- [FastAPI handling errors](https://fastapi.tiangolo.com/tutorial/handling-errors/) — **Reason:** Defines request/response validation and HTTP exception surfaces.
- [Starlette exceptions](https://www.starlette.io/exceptions/) — **Reason:** Adjacent handler and exception middleware contract.
- [Python `traceback`](https://docs.python.org/3/library/traceback.html) — **Reason:** Exception metadata and rendering behavior.
- [Pydantic errors](https://docs.pydantic.dev/latest/errors/errors/) — **Reason:** Validation error structure and URL/metadata conventions.

**4.5.5 Localization surface and likely wrong turns.** Start in `fastapi/exceptions.py`, `fastapi/exception_handlers.py`, and route-handler construction in `routing.py`; inspect `openapi/utils.py` only for documented error schema. Avoid treating the traceback printing layer as the source of missing endpoint metadata.

**4.5.6 Trap list.**
- Stringifying structured errors too early.
- Adding endpoint data to only one validation exception subclass.
- Changing public exception constructors without preserving compatibility.
- Repairing environment failures or tests rather than source behavior.

**4.5.7 Recommended brain artifact and draft content.** `skills/fastapi-error-contract/SKILL.md` with an error-channel table.

```text
TRIGGER: traceback, validation exception, endpoint metadata, exception handler.
1. Identify construction, transport, handler, and rendering stages.
2. Preserve structured `.errors()` and response shapes.
3. Add metadata at construction/annotation, not by reparsing formatted text.
4. Check every sibling exception class and supported framework branch.
```

**4.5.8 31B track variant.** Trace the full exception lifecycle before editing and compare OpenAPI/runtime channels separately.

**4.5.9 E4B track variant.** Use the four-stage table and one exception sibling; avoid broad framework-version migration work.

**4.5.10 Expected marginal value: MEDIUM.** Only two tasks, but the error-lifecycle resource generalizes beyond the exact pair and prevents destructive error rewrites.

**4.5.11 Confidence and evidence gaps.** **Medium.** The Starlette-upgrade task is behaviorally assigned here; its compatibility-label boundary remains unverified. No claim below treats public reference patches as hidden-test data.

**4.5.12 Sources.** Representative upstream records: [fastapi_14077](https://github.com/fastapi/fastapi/pull/14077), [fastapi_14306](https://github.com/fastapi/fastapi/pull/14306); the normative resources linked in §4.5.4; the complete instance digest is Appendix F.

### 4.6 F-06 — OpenAPI, JSON Schema & schema metadata

**Identity, category, repository, count, and roster.** F-06 belongs to the fastapi domain; it contains **7** recovered public tasks. Roster: `fastapi_13713`, `fastapi_14266`, `fastapi_14455`, `fastapi_14459`, `fastapi_14463`, `fastapi_14791`, `fastapi_14986`. Median reference patch: **34 lines**; one-file tasks: **4/7** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.6.1 Issue morphology.** Generated API documentation and schema composition: external docs, OAuth2 security schemes/scopes, duplicated `$ref`/`anyOf`, ValidationError metadata, and safe Swagger UI initialization.

**4.6.2 Gold-patch anatomy.** Four of seven tasks are one-file; most edits are in `openapi/utils.py`, with cross-layer security tasks entering dependency analysis and escaping work entering application/docs setup.

**4.6.3 De facto behavioral specification.** Generated OpenAPI must be structurally valid, deduplicated where required, stable across repeated routes/security dependencies, and faithful to application metadata. Values inserted into HTML/JavaScript must be escaped for their output context, not merely JSON-serialized once.

**4.6.4 External resources required.**
- [OpenAPI 3.1.0](https://spec.openapis.org/oas/v3.1.0.html) — **Reason:** Normative Schema, Security Scheme, External Documentation, and ValidationError-adjacent objects.
- [JSON Schema 2020-12](https://json-schema.org/draft/2020-12/json-schema-core) — **Reason:** Defines `$ref` and composition behavior.
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) — **Reason:** Output-context escaping rationale for Swagger HTML/JS.
- [FastAPI extending OpenAPI](https://fastapi.tiangolo.com/advanced/extending-openapi/) — **Reason:** Repository generation entry points and customization contract.

**4.6.5 Localization surface and likely wrong turns.** Use `get_openapi`, model-name mapping, security-requirement construction, and `openapi/docs.py`; for security schemes, trace dependant construction first. Wrong turns include hand-editing generated JSON fixtures, globally deduplicating legitimate schemas, or HTML-escaping strings destined for JavaScript without context analysis.

**4.6.6 Trap list.**
- Deduping by name when scopes make requirements distinct.
- Deduplicating security schemes but losing top-level registration.
- Removing a repeated `$ref` without checking sibling branches.
- Double escaping or leaving JS-breaking terminators.
- Assuming Pydantic model schema bugs belong here when the defect is in `_compat/v2.py`.

**4.6.7 Recommended brain artifact and draft content.** `skills/fastapi-openapi-composition/SKILL.md` with object/scope/escape checklists.

```text
TRIGGER: OpenAPI, Swagger, externalDocs, ValidationError, anyOf, $ref, OAuth security scheme.
1. Name the exact OpenAPI object and producer.
2. For security, compare requirement identity and scheme identity separately.
3. For refs, inspect model-name mapping before deleting branches.
4. For docs HTML, identify HTML, attribute, URL, and JS contexts independently.
```

**4.6.8 31B track variant.** Generate a compact before/after schema excerpt and inspect model/security provenance; spend a second read on cross-layer scope cases.

**4.6.9 E4B track variant.** Require the exact OpenAPI object name before search; choose one producer function and one regression example. Avoid global normalization helpers.

**4.6.10 Expected marginal value: HIGH.** Seven tasks with compact median patches and stable normative specifications; dedicated knowledge has clear reuse.

**4.6.11 Confidence and evidence gaps.** **High.** Exact validation fixtures were not replayed; schema recommendations must be checked against the OpenAPI version pinned by the repository. No claim below treats public reference patches as hidden-test data.

**4.6.12 Sources.** Representative upstream records: [fastapi_13713](https://github.com/fastapi/fastapi/pull/13713), [fastapi_14459](https://github.com/fastapi/fastapi/pull/14459), [fastapi_14986](https://github.com/fastapi/fastapi/pull/14986); the normative resources linked in §4.6.4; the complete instance digest is Appendix F.

### 4.7 F-07 — Parameter & request-body parsing

**Identity, category, repository, count, and roster.** F-07 belongs to the fastapi domain; it contains **8** recovered public tasks. Roster: `fastapi_11194`, `fastapi_13537`, `fastapi_14303`, `fastapi_14356`, `fastapi_14360`, `fastapi_14479`, `fastapi_14616`, `fastapi_15589`. Median reference patch: **15.5 lines**; one-file tasks: **8/8** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.7.1 Issue morphology.** Request parameter extraction at the boundary: underscore headers, invalid annotations, parameter-model aliases, repeated non-body fields, form lists, empty form values, `Json[list[...]]`, and File/Form ordering.

**4.7.2 Gold-patch anatomy.** The cleanest high-yield family: all eight tasks modify only `fastapi/dependencies/utils.py`, and the median reference patch is 15.5 lines.

**4.7.3 De facto behavioral specification.** Extraction must preserve declaration aliases and multiplicity, distinguish missing from empty values, honor header conversion rules, parse JSON-annotated values at the right nesting level, and maintain correct body-field ordering independent of Python argument ordering surprises.

**4.7.4 External resources required.**
- [FastAPI query, header, form, and file parameters](https://fastapi.tiangolo.com/tutorial/query-params/) — **Reason:** Repository API contracts and sibling parameter declarations.
- [Starlette requests](https://www.starlette.io/requests/) — **Reason:** Defines headers, query params, forms, and upload surfaces.
- [RFC 9110 field semantics](https://www.rfc-editor.org/rfc/rfc9110.html#name-field-names-and-values) — **Reason:** HTTP field-name/value constraints relevant to underscore conversion.
- [Pydantic `Json`](https://docs.pydantic.dev/latest/concepts/types/#json-type) — **Reason:** Defines JSON-string decoding versus native list input.

**4.7.5 Localization surface and likely wrong turns.** Go directly to request dependant/body analysis and `_get_multidict_value`; inspect parameter model field construction in `_compat` only when aliases or schema metadata are involved. Wrong turns include editing route handlers, changing global Header defaults, or flattening every multidict value to one scalar.

**4.7.6 Trap list.**
- Treating empty string, empty list, and missing as one value.
- Using Python parameter name after an alias was declared.
- Solving File-after-Form by sorting unrelated fields.
- Accepting underscore names that the conversion contract excludes.
- Parsing JSON twice or parsing native lists as strings.

**4.7.7 Recommended brain artifact and draft content.** `skills/fastapi-request-extraction/SKILL.md`; this is a first-wave artifact for both tracks.

```text
TRIGGER: Query/Header/Cookie/Form/File/Body, alias, list, empty, Json, underscore.
1. Write declared name → wire name → container → cardinality → missing/empty semantics.
2. Inspect `_get_multidict_value` and field construction before routing.
3. Change only the implicated parameter class.
4. Verify scalar/list, missing/empty, alias/name, and File/Form ordering cases.
```

**4.7.8 31B track variant.** Read the dependant construction and extraction helper together; check whether the same helper serves Query, Form, and Header before changing shared behavior.

**4.7.9 E4B track variant.** Use the five-column extraction table verbatim and limit context to one function plus its direct caller. This family should receive early-edit priority and minimal graph use.

**4.7.10 Expected marginal value: HIGH.** Eight uniformly one-file, tiny-patch tasks: the best count-to-tractability ratio in the corpus.

**4.7.11 Confidence and evidence gaps.** **High.** No material corpus gap beyond unexecuted test replay. No claim below treats public reference patches as hidden-test data.

**4.7.12 Sources.** Representative upstream records: [fastapi_11194](https://github.com/fastapi/fastapi/pull/11194), [fastapi_14360](https://github.com/fastapi/fastapi/pull/14360), [fastapi_15589](https://github.com/fastapi/fastapi/pull/15589); the normative resources linked in §4.7.4; the complete instance digest is Appendix F.

### 4.8 F-08 — Pydantic, models & type handling

**Identity, category, repository, count, and roster.** F-08 belongs to the fastapi domain; it contains **11** recovered public tasks. Roster: `fastapi_12942`, `fastapi_13207`, `fastapi_14246`, `fastapi_14297`, `fastapi_14349`, `fastapi_14361`, `fastapi_14371`, `fastapi_14430`, `fastapi_14482`, `fastapi_14512`, `fastapi_14953`. Median reference patch: **33 lines**; one-file tasks: **9/11** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.8.1 Issue morphology.** Pydantic-v2 model and schema semantics: discriminated unions in Body/Annotated, optional sequences, computed fields, nested model separation, aliases, arbitrary types, `$ref`-named attributes, and bytes JSON-schema metadata.

**4.8.2 Gold-patch anatomy.** Nine of eleven tasks touch one file, usually `_compat/v2.py`; the 33-line median is small but semantically dense. Alias work crosses dependencies/OpenAPI and bytes work includes executable docs.

**4.8.3 De facto behavioral specification.** Input/output model schemas must be separated only when required, references must point to the correct model map, union discriminators must survive Annotated/Body wrapping, optional sequences must validate and serialize symmetrically, and arbitrary/custom types must retain their declared schema hooks.

**4.8.4 External resources required.**
- [Pydantic discriminated unions](https://docs.pydantic.dev/latest/concepts/unions/#discriminated-unions) — **Reason:** Normative library behavior for tagged unions.
- [Pydantic JSON Schema](https://docs.pydantic.dev/latest/concepts/json_schema/) — **Reason:** Model schema generation, refs, input/output modes, and customization hooks.
- [Pydantic computed fields](https://docs.pydantic.dev/latest/concepts/fields/#computed-fields) — **Reason:** Serialization-only field behavior.
- [JSON Schema 2020-12 content vocabulary](https://json-schema.org/draft/2020-12/json-schema-validation#name-content-keywords) — **Reason:** Explains `contentMediaType` and byte-content intent.

**4.8.5 Localization surface and likely wrong turns.** Start in `_compat/v2.py` and its model-field/name-map callers; inspect `_compat.py` only for the base commit that still uses that facade. Wrong turns include patching OpenAPI output after generation, special-casing a model class name, and assuming every `$ref` issue is an OpenAPI dedup bug.

**4.8.6 Trap list.**
- Mutating shared model schema dictionaries in place.
- Dropping `Annotated` metadata while flattening unions.
- Using `lenient_issubclass` or arbitrary-type checks that reject valid custom classes.
- Fixing validation but not sequence serialization.
- Treating a user field literally named `$ref` as a JSON Schema keyword.

**4.8.7 Recommended brain artifact and draft content.** `skills/fastapi-pydantic-v2-schema/SKILL.md` with a model/transformation pipeline.

```text
TRIGGER: Pydantic v2, discriminated union, Annotated, computed field, arbitrary type, $ref, alias, bytes.
1. Record model class, input/output mode, wrapping metadata, and generated schema.
2. Trace model fields → name map → OpenAPI consumer.
3. Preserve user keys and Pydantic hooks; avoid in-place shared-schema mutation.
4. Test validation and serialization as separate channels.
```

**4.8.8 31B track variant.** Inspect a minimal generated-schema diff and the model-name map; use deeper reasoning for nested input/output separation and union metadata.

**4.8.9 E4B track variant.** Force the four-stage pipeline and one Pydantic sibling hook. Prefer the smallest `_compat/v2.py` change; do not roam into OpenAPI unless the generated schema is already correct there.

**4.8.10 Expected marginal value: HIGH.** Eleven compact, recurring tasks with a coherent library-spec core; strong candidate for high-quality SFT as well as a skill.

**4.8.11 Confidence and evidence gaps.** **High.** Boundary assignments for `$ref` and parameter aliases are reconstructed rather than CSV-verified. No claim below treats public reference patches as hidden-test data.

**4.8.12 Sources.** Representative upstream records: [fastapi_12942](https://github.com/fastapi/fastapi/pull/12942), [fastapi_14361](https://github.com/fastapi/fastapi/pull/14361), [fastapi_14953](https://github.com/fastapi/fastapi/pull/14953); the normative resources linked in §4.8.4; the complete instance digest is Appendix F.

### 4.9 F-09 — Responses, SSE & streaming

**Identity, category, repository, count, and roster.** F-09 belongs to the fastapi domain; it contains **7** recovered public tasks. Roster: `fastapi_9425`, `fastapi_14099`, `fastapi_14962`, `fastapi_14964`, `fastapi_15023`, `fastapi_15030`, `fastapi_15588`. Median reference patch: **85 lines**; one-file tasks: **4/7** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.9.1 Issue morphology.** Response serialization and streaming lifetime: bodiless return annotations, Pydantic-backed JSON serialization, response deprecations, streaming-with-yield docs, SSE API addition, and SSE field validation.

**4.9.2 Gold-patch anatomy.** The 85-line median mixes small response changes with a broad SSE feature. Files include responses/routing/compat, async exit-stack middleware, executable docs, and the new SSE module.

**4.9.3 De facto behavioral specification.** Response rendering must preserve declared response-model semantics; `None`/bodiless responses must not be forced through a model; generator dependencies and uploads must remain alive until streaming completes; SSE fields must validate and serialize according to the event-stream contract.

**4.9.4 External resources required.**
- [WHATWG Server-Sent Events](https://html.spec.whatwg.org/multipage/server-sent-events.html) — **Reason:** Normative event-stream fields, framing, and browser behavior.
- [ASGI HTTP specification](https://asgi.readthedocs.io/en/latest/specs/main.html) — **Reason:** Response start/body and connection lifecycle.
- [Starlette responses](https://www.starlette.io/responses/) — **Reason:** StreamingResponse and response rendering sibling behavior.
- [FastAPI dependencies with yield](https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/) — **Reason:** Cleanup timing and exit-stack contract.

**4.9.5 Localization surface and likely wrong turns.** Trace route handler → response field/serialization → Response.render → ASGI send; for cleanup, inspect `middleware/asyncexitstack.py`. For SSE, read the sibling response class and route registration. Wrong turns include closing resources at dependency return, validating SSE only at render time, and editing only docs for a runtime feature.

**4.9.6 Trap list.**
- Running generator cleanup before the stream is consumed.
- Changing response-model serialization for endpoints without a declared model.
- Deprecating a class by breaking its import/render behavior.
- Allowing newline injection or invalid SSE field types.
- Ignoring both sync and async streaming examples.

**4.9.7 Recommended brain artifact and draft content.** `skills/fastapi-response-lifecycle/SKILL.md` plus an SSE/ASGI sequence resource.

```text
TRIGGER: Response, StreamingResponse, SSE, yield cleanup, response_model, None return.
1. Draw construction → dependency exit → render → ASGI body frames.
2. Keep resources alive through final body frame.
3. Separate response rendering from OpenAPI schema.
4. For SSE, validate field values and preserve exact event formatting.
```

**4.9.8 31B track variant.** Use sequence reasoning across middleware/routing and inspect both response and dependency cleanup; reserve more calls for the SSE feature family.

**4.9.9 E4B track variant.** Prefer narrow serialization/validation tasks. For streaming lifetime, use the four-stage sequence and edit only the exit-stack handoff; defer broad SSE feature implementation unless statement and sibling API are unusually explicit.

**4.9.10 Expected marginal value: HIGH.** Seven tasks and a reusable lifecycle model; broad SSE tasks are harder but the same resource covers several small validation/serialization cases.

**4.9.11 Confidence and evidence gaps.** **High.** The exact accepted SSE field coercions require repository tests at the pinned commit; the report does not invent them. No claim below treats public reference patches as hidden-test data.

**4.9.12 Sources.** Representative upstream records: [fastapi_9425](https://github.com/fastapi/fastapi/pull/9425), [fastapi_14964](https://github.com/fastapi/fastapi/pull/14964), [fastapi_15588](https://github.com/fastapi/fastapi/pull/15588); the normative resources linked in §4.9.4; the complete instance digest is Appendix F.

### 4.10 F-10 — Routing, application APIs & lifecycle

**Identity, category, repository, count, and roster.** F-10 belongs to the fastapi domain; it contains **8** recovered public tasks. Roster: `fastapi_14258`, `fastapi_14851`, `fastapi_14873`, `fastapi_15280`, `fastapi_15745`, `fastapi_15763`, `fastapi_15785`, `fastapi_15800`. Median reference patch: **114.5 lines**; one-file tasks: **4/8** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.10.1 Issue morphology.** Router composition and application surface: self-inclusion errors, lifespan reimplementation, startup/shutdown arguments, route-context iteration, empty paths, object identity preservation, and new app/router APIs.

**4.10.2 Gold-patch anatomy.** Half the tasks are one-file but the median is 114.5 lines because new APIs and route-context preservation coordinate applications, routing, OpenAPI, and executable docs.

**4.10.3 De facto behavioral specification.** Included routers must preserve or deliberately clone the documented route objects; effective route context must be iterable without loss; empty paths and prefix composition must avoid malformed URLs; lifecycle contexts must merge in order and propagate startup/shutdown arguments; self-inclusion must fail clearly.

**4.10.4 External resources required.**
- [FastAPI bigger applications](https://fastapi.tiangolo.com/tutorial/bigger-applications/) — **Reason:** Router inclusion and prefix behavior.
- [FastAPI lifespan](https://fastapi.tiangolo.com/advanced/events/) — **Reason:** Lifespan, startup, and shutdown contracts.
- [Starlette routing](https://www.starlette.io/routing/) — **Reason:** Underlying route composition and matching.
- [ASGI lifespan specification](https://asgi.readthedocs.io/en/latest/specs/lifespan.html) — **Reason:** Normative lifespan message sequence.

**4.10.5 Localization surface and likely wrong turns.** Start in `APIRouter`, `APIRoute`, `include_router`, `_merge_lifespan_context`, and application convenience methods; inspect OpenAPI route iteration when context disappears. Wrong turns include fixing path normalization in Starlette rather than FastAPI, decorating only `FastAPI` but not `APIRouter`, and reconstructing route objects when identity must be preserved.

**4.10.6 Trap list.**
- Recursive router inclusion without a direct guard.
- Losing custom APIRoute/APIRouter subclass instances.
- Merging lifespan contexts in reverse order.
- Normalizing `""` and `"/"` as if always equivalent.
- Adding a public decorator without registration, docs, and router parity.

**4.10.7 Recommended brain artifact and draft content.** `skills/fastapi-routing-lifecycle/SKILL.md` with route-object and lifespan checklists.

```text
TRIGGER: APIRouter, include_router, lifespan, startup, shutdown, empty path, app/router method.
1. Identify route object identity versus copied metadata.
2. Trace prefix/path composition and effective context.
3. For lifespan, write enter/exit order before editing.
4. Check FastAPI/APIRouter parity and OpenAPI route enumeration.
```

**4.10.8 31B track variant.** Allow a wider architecture trace for route-context and new API tasks; use a final registration/identity audit. For narrow self-inclusion or empty-path tasks, stay minimal.

**4.10.9 E4B track variant.** Split tasks into narrow bug versus broad API. Take narrow bugs early; for broad APIs, copy the nearest decorator/registration skeleton and avoid inventing internal abstractions.

**4.10.10 Expected marginal value: MEDIUM.** Eight tasks, but broad feature patches and public API surface reduce expected per-call return relative to F-03/F-07/F-08.

**4.10.11 Confidence and evidence gaps.** **High.** New upstream APIs such as vibe/frontend are version-specific; their semantics must come from the pinned statement and siblings, not present-day general knowledge. No claim below treats public reference patches as hidden-test data.

**4.10.12 Sources.** Representative upstream records: [fastapi_14258](https://github.com/fastapi/fastapi/pull/14258), [fastapi_15745](https://github.com/fastapi/fastapi/pull/15745), [fastapi_15800](https://github.com/fastapi/fastapi/pull/15800); the normative resources linked in §4.10.4; the complete instance digest is Appendix F.

### 4.11 F-11 — Export & output formats

**Identity, category, repository, count, and roster.** F-11 belongs to the rich domain; it contains **2** recovered public tasks. Roster: `rich_3043`, `rich_3105`. Median reference patch: **14 lines**; one-file tasks: **2/2** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.11.1 Issue morphology.** HTML export defects: template structure and code font-family inheritance/overrides. The issue appears only in exported artifacts, not terminal rendering.

**4.11.2 Gold-patch anatomy.** Both tasks touch only `rich/_export_format.py`, with a 14-line median. The fix is template/CSS-level rather than console segmentation.

**4.11.3 De facto behavioral specification.** Exported HTML must remain valid and self-contained, preserve console text and styles, and specify font inheritance with sufficient selector coverage so browser user-agent `<code>` rules do not silently override the intended font.

**4.11.4 External resources required.**
- [Rich console export docs](https://rich.readthedocs.io/en/stable/console.html#exporting) — **Reason:** Defines HTML/SVG/text export entry points.
- [CSS Fonts 4, `font-family`](https://www.w3.org/TR/css-fonts-4/#font-family-prop) — **Reason:** Font selection and inheritance contract.
- [HTML standard, `code` element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-code-element) — **Reason:** Explains browser default rendering context.

**4.11.5 Localization surface and likely wrong turns.** Inspect `_export_format.py`, the export template placeholders, and the console method that injects foreground/background CSS. Wrong turns include changing `Console.print`, adding inline styles to every segment, or modifying tests/snapshots instead of the template.

**4.11.6 Trap list.**
- Overriding browser defaults with an unrelated global selector.
- Regenerating huge golden HTML snapshots by hand.
- Breaking SVG export while fixing HTML.
- Escaping already-rendered segment markup twice.

**4.11.7 Recommended brain artifact and draft content.** `repo_navigation/resources/rich-export-contract.md`; generic minimal-patch loop plus one CSS checklist.

```text
RESOURCE: distinguish exporter template, console-generated CSS, and segment markup.
For HTML bugs, reproduce from exported text, inspect the exact CSS cascade, and make the smallest template change.
Do not alter terminal layout code.
```

**4.11.8 31B track variant.** Read exporter and one console caller; reason about CSS selector specificity before editing.

**4.11.9 E4B track variant.** Direct file from issue/export symbol, inspect template only, make a literal CSS/template correction and skip terminal subsystems.

**4.11.10 Expected marginal value: MEDIUM.** Two very tractable tasks but little need for a large family-specific apparatus.

**4.11.11 Confidence and evidence gaps.** **High.** The font-family issue is linked through upstream issue #3104 and PR #3105; browser-specific snapshot differences were not rerun. No claim below treats public reference patches as hidden-test data.

**4.11.12 Sources.** Representative upstream records: [rich_3043](https://github.com/Textualize/rich/pull/3043), [rich_3105](https://github.com/Textualize/rich/pull/3105); the normative resources linked in §4.11.4; the complete instance digest is Appendix F.

### 4.12 F-12 — Import-time performance

**Identity, category, repository, count, and roster.** F-12 belongs to the rich domain; it contains **1** recovered public tasks. Roster: `rich_4070`. Median reference patch: **402 lines**; one-file tasks: **0/1** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.12.1 Issue morphology.** Import-time regression caused by eager imports across commonly used Rich modules. The statement concerns startup cost and lazy loading rather than rendered output.

**4.12.2 Gold-patch anatomy.** One broad 402-line reference patch spans nine modules, changing lazy import/export behavior in console, emoji, logging, syntax, protocol, repr, segments, and theme.

**4.12.3 De facto behavioral specification.** Public imports must remain backward-compatible while heavy dependencies load on first actual use; lazy attributes must avoid recursion, preserve type/checking behavior where supported, and not degrade repeated-access performance.

**4.12.4 External resources required.**
- [Python `-X importtime`](https://docs.python.org/3/using/cmdline.html#cmdoption-X) — **Reason:** Measures import phases and cumulative cost.
- [PEP 562, module `__getattr__`](https://peps.python.org/pep-0562/) — **Reason:** Normative lazy module attribute mechanism.
- [Rich API reference](https://rich.readthedocs.io/en/stable/reference.html) — **Reason:** Public re-export compatibility surface.

**4.12.5 Localization surface and likely wrong turns.** Build an import graph before editing: `rich/__init__.py`, `console.py`, `emoji.py`, `syntax.py`, `logging.py`, `protocol.py`, and `repr.py`. Wrong turns include lazy-loading a value needed by class definition, moving imports without handling `TYPE_CHECKING`, and optimizing only the dominant local import while missing the public entry point.

**4.12.6 Trap list.**
- Circular `__getattr__` recursion.
- Breaking `from rich import X` or documentation references.
- Using wall-clock import comparisons without warm/cold controls.
- Treating the 402-line patch as a template for small tasks.

**4.12.7 Recommended brain artifact and draft content.** `repo_navigation/resources/rich-import-graph.md`; no dedicated runtime skill.

```text
RESOURCE: measure before optimizing; separate public re-export, runtime dependency, and TYPE_CHECKING import.
Preserve every public symbol and check repeated attribute access.
Exclude bulk import-move hunks from generic LoRA patch supervision.
```

**4.12.8 31B track variant.** Use one call to inspect import relationships and one targeted import-time measurement; coordinate all affected modules before editing.

**4.12.9 E4B track variant.** Treat as low-priority broad work. Unless the statement isolates one symbol, make only the safest single lazy-import change rather than attempting the full upstream refactor.

**4.12.10 Expected marginal value: LOW.** Single, broad, architecture-specific task; a resource helps but a dedicated artifact or adapter slice is unlikely to repay its cost.

**4.12.11 Confidence and evidence gaps.** **High on task anatomy; Medium on recipe transfer.** No local import-time benchmark was run; numeric optimization claims are intentionally absent. No claim below treats public reference patches as hidden-test data.

**4.12.12 Sources.** Representative upstream records: [rich_4070](https://github.com/Textualize/rich/pull/4070); the normative resources linked in §4.12.4; the complete instance digest is Appendix F.

### 4.13 F-13 — Live displays, progress & prompts

**Identity, category, repository, count, and roster.** F-13 belongs to the rich domain; it contains **4** recovered public tasks. Roster: `rich_3052`, `rich_3882`, `rich_3905`, `rich_3934`. Median reference patch: **29 lines**; one-file tasks: **3/4** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.13.1 Issue morphology.** Stateful interactive rendering and input: Live height/newline accounting, disabled Progress output, prompt validation display, and case-insensitive choices.

**4.13.2 Gold-patch anatomy.** Three of four tasks touch one file; edits concentrate in `prompt.py`, `progress.py`, `live.py`, and `live_render.py`, with a 29-line median.

**4.13.3 De facto behavioral specification.** Noninteractive or disabled components must not emit spurious blank lines; Live must remember the correct previous render height including empty renders; prompt errors must preserve raw markup expectations and valid choices must match with the documented case behavior.

**4.13.4 External resources required.**
- [Rich Live](https://rich.readthedocs.io/en/stable/live.html) — **Reason:** Refresh and transient rendering contract.
- [Rich Progress](https://rich.readthedocs.io/en/stable/progress.html) — **Reason:** Start/stop, disable, and noninteractive behavior.
- [Rich Prompt](https://rich.readthedocs.io/en/stable/prompt.html) — **Reason:** Choice validation, error display, and defaults.

**4.13.5 Localization surface and likely wrong turns.** Trace renderable → LiveRender line calculation → Console control for Live; Progress.start/stop and Console.is_interactive for progress; Prompt.process_response/on_validate_error/pre_prompt for input. Wrong turns include changing global Console newline behavior for a Live bug or normalizing choices before validation but not before display/completion.

**4.13.6 Trap list.**
- Off-by-one height after an empty render.
- Writing a newline when Progress is disabled.
- Escaping markup that the error path is specified to show literally.
- Case-folding stored values instead of comparison only.

**4.13.7 Recommended brain artifact and draft content.** `skills/rich-interactive-state/SKILL.md` with state-transition tables.

```text
TRIGGER: Live, Progress, Prompt, blank line, disabled, noninteractive, choice, markup error.
1. Record enabled/interactive state and prior render height.
2. Trace start → render → refresh → stop/exit.
3. Separate output text from terminal control/newline emission.
4. For prompts, compare normalized input but preserve user-facing values.
```

**4.13.8 31B track variant.** Read the state owner and one Console caller; model empty and noninteractive transitions explicitly.

**4.13.9 E4B track variant.** Use a three-state table and one targeted state test; avoid terminal-wide changes.

**4.13.10 Expected marginal value: HIGH.** Four compact tasks whose failures share state-machine reasoning; a small artifact can prevent repeated blank-line and validation regressions.

**4.13.11 Confidence and evidence gaps.** **High.** Terminal behavior varies by environment; tests should use Console’s scripted interfaces rather than an actual TTY. No claim below treats public reference patches as hidden-test data.

**4.13.12 Sources.** Representative upstream records: [rich_3052](https://github.com/Textualize/rich/pull/3052), [rich_3905](https://github.com/Textualize/rich/pull/3905), [rich_3934](https://github.com/Textualize/rich/pull/3934); the normative resources linked in §4.13.4; the complete instance digest is Appendix F.

### 4.14 F-14 — Markdown & markup parsing/rendering

**Identity, category, repository, count, and roster.** F-14 belongs to the rich domain; it contains **6** recovered public tasks. Roster: `rich_3063`, `rich_3064`, `rich_3130`, `rich_3469`, `rich_3942`, `rich_4079`. Median reference patch: **23 lines**; one-file tasks: **5/6** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.14.1 Issue morphology.** Markdown element composition and Rich markup escaping: inline code/styles/links in tables, header/table styling, extra table spacing, table parsing, and a trailing backslash.

**4.14.2 Gold-patch anatomy.** Five of six tasks touch one file, mainly `markdown.py`; the 23-line median reflects local parser/render-state fixes rather than a new Markdown engine.

**4.14.3 De facto behavioral specification.** Markdown block elements must compose inline children without losing style, links, or code spans; tables must follow surrounding style and vertical-spacing conventions; markup parsing must treat a terminal escape character literally when it cannot escape a following tag.

**4.14.4 External resources required.**
- [CommonMark 0.31.2](https://spec.commonmark.org/0.31.2/) — **Reason:** Normative code spans, links, tables via extension context, and backslash escapes.
- [Rich Markdown](https://rich.readthedocs.io/en/stable/markdown.html) — **Reason:** Supported Markdown subset and rendering behavior.
- [Rich markup](https://rich.readthedocs.io/en/stable/markup.html) — **Reason:** Rich tag and escaping semantics.

**4.14.5 Localization surface and likely wrong turns.** Map Markdown token/element classes (`Heading`, `TableElement`, `ListElement`, `CodeBlock`) and their `on_text`, `create`, and `__rich_console__` methods; use `markup.py` for trailing escapes. Wrong turns include editing global table layout for a Markdown-parent style bug or assuming full CommonMark support where Rich intentionally implements a subset.

**4.14.6 Trap list.**
- Flattening inline children to plain text.
- Adding blank lines at both parent and child levels.
- Changing default styles to compensate for a parser state bug.
- Applying CommonMark rules that Rich’s markup language does not define.

**4.14.7 Recommended brain artifact and draft content.** `skills/rich-markdown-composition/SKILL.md` with block/inline/context matrix.

```text
TRIGGER: Markdown table/header/list/code/link, markup escape, extra blank line.
1. Identify block element, inline child, style context, and spacing owner.
2. Trace token → element stack → renderable.
3. Preserve inline objects rather than stringifying.
4. Distinguish CommonMark escaping from Rich markup escaping.
```

**4.14.8 31B track variant.** Read the element stack and nearest sibling element; compare style and newline ownership before editing.

**4.14.9 E4B track variant.** Fill the four-field matrix, choose one element class, and avoid global table/style edits.

**4.14.10 Expected marginal value: HIGH.** Six compact tasks with recurring composition errors; strong transfer to unseen renderer issues.

**4.14.11 Confidence and evidence gaps.** **High.** Rich’s supported Markdown subset—not full CommonMark—must remain the behavioral authority when they differ. No claim below treats public reference patches as hidden-test data.

**4.14.12 Sources.** Representative upstream records: [rich_3063](https://github.com/Textualize/rich/pull/3063), [rich_3469](https://github.com/Textualize/rich/pull/3469), [rich_4079](https://github.com/Textualize/rich/pull/4079); the normative resources linked in §4.14.4; the complete instance digest is Appendix F.

### 4.15 F-15 — Syntax highlighting & URL recognition

**Identity, category, repository, count, and roster.** F-15 belongs to the rich domain; it contains **4** recovered public tasks. Roster: `rich_3067`, `rich_3296`, `rich_3454`, `rich_3782`. Median reference patch: **12 lines**; one-file tasks: **4/4** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.15.1 Issue morphology.** Syntax styling/padding and regular-expression highlighting: background override, hyperlink `@`, URL tilde, and `Syntax.padding`.

**4.15.2 Gold-patch anatomy.** All four tasks touch one file and have a 12-line median. Two concern `syntax.py`; two concern regexes in `highlighter.py`.

**4.15.3 De facto behavioral specification.** Syntax padding must participate consistently in measurement and rendering without erasing background style; URL/h hyperlink regexes must accept legal punctuation and not terminate or misclassify at `@`/`~`.

**4.15.4 External resources required.**
- [Rich Syntax](https://rich.readthedocs.io/en/stable/syntax.html) — **Reason:** Padding, theme, line-number, and background options.
- [Pygments documentation](https://pygments.org/docs/) — **Reason:** Lexer/formatter and token-style behavior.
- [RFC 3986, §2.3 and §3](https://www.rfc-editor.org/rfc/rfc3986.html) — **Reason:** URI unreserved characters including tilde and component delimiters.
- [Python `re`](https://docs.python.org/3/library/re.html) — **Reason:** Regex greediness, character classes, and escaping.

**4.15.5 Localization surface and likely wrong turns.** Inspect `Syntax.__rich_console__`, `__rich_measure__`, `from_path`, and highlighter URL patterns. Wrong turns include modifying generic Text padding for a Syntax-only option or “fixing” URLs with a broad `\S+` expression that swallows punctuation/markup.

**4.15.6 Trap list.**
- Adding padding in render but forgetting measurement.
- Overriding the user background with the theme default.
- Using RFC grammar as a drop-in hyperlink regex without considering Rich’s plaintext boundaries.
- Catastrophic or overly greedy regex replacements.

**4.15.7 Recommended brain artifact and draft content.** `skills/rich-syntax-and-highlights/SKILL.md` with measurement/style and regex boundary checks.

```text
TRIGGER: Syntax, padding, background, URL, hyperlink, @, tilde.
1. For layout, compare measure and render paths.
2. For style, identify user/theme/default precedence.
3. For URLs, test legal character, delimiter, and trailing punctuation cases.
4. Make a local regex/style change; do not rewrite the highlighter framework.
```

**4.15.8 31B track variant.** Inspect measure/render and regex match examples; check both option precedence and neighboring highlight patterns.

**4.15.9 E4B track variant.** Use direct `syntax.py` versus `highlighter.py` routing and test three literal strings before editing; keep patch tiny.

**4.15.10 Expected marginal value: HIGH.** Four tiny, single-file tasks with reusable measurement/style and URL-boundary lessons.

**4.15.11 Confidence and evidence gaps.** **High.** Exact hyperlink acceptance is Rich behavior, not solely RFC conformance; repository tests take precedence. No claim below treats public reference patches as hidden-test data.

**4.15.12 Sources.** Representative upstream records: [rich_3067](https://github.com/Textualize/rich/pull/3067), [rich_3454](https://github.com/Textualize/rich/pull/3454), [rich_3782](https://github.com/Textualize/rich/pull/3782); the normative resources linked in §4.15.4; the complete instance digest is Appendix F.

### 4.16 F-16 — Tables, panels & visual layout

**Identity, category, repository, count, and roster.** F-16 belongs to the rich domain; it contains **5** recovered public tasks. Roster: `rich_2725`, `rich_3061`, `rich_3518`, `rich_3718`, `rich_3935`. Median reference patch: **30 lines**; one-file tasks: **5/5** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.16.1 Issue morphology.** Visual composition: panel-title background, Columns first-cell padding, row-added column highlighting, box-element order, and styled tab expansion.

**4.16.2 Gold-patch anatomy.** Every task touches one file, mostly `table.py`, with one each in `panel.py` and `text.py`; median patch is 30 lines.

**4.16.3 De facto behavioral specification.** Styles and padding must apply to the same logical region the user sees; dynamically added rows must not bypass highlighters; table box characters must be selected from current neighbor state; tab expansion must carry source span styles.

**4.16.4 External resources required.**
- [Rich Table](https://rich.readthedocs.io/en/stable/table.html) — **Reason:** Rows, columns, padding, box, and highlighting contract.
- [Rich Panel](https://rich.readthedocs.io/en/stable/panel.html) — **Reason:** Panel title/border/body style ownership.
- [Rich Text](https://rich.readthedocs.io/en/stable/text.html) — **Reason:** Styled spans and tab-size behavior.
- [Unicode Box Drawing](https://www.unicode.org/charts/PDF/U2500.pdf) — **Reason:** Character repertoire; repository box definitions remain authoritative.

**4.16.5 Localization surface and likely wrong turns.** Read table row/column construction, `_measure_column`, `_get_padding_width`, box substitution, Panel title rendering, and Text tab expansion. Wrong turns include applying panel background globally, compensating with hardcoded space counts, or recomputing all table boxes instead of fixing local ordering.

**4.16.6 Trap list.**
- Padding first/last cell twice.
- Highlighting only rows present at construction.
- Ignoring border/title style composition.
- Losing style offsets when tabs expand to multiple spaces.
- Assuming box order is cosmetic and untestable.

**4.16.7 Recommended brain artifact and draft content.** `skills/rich-layout-style-regions/SKILL.md` with region/style/phase table.

```text
TRIGGER: Table, Columns, Panel, padding, box, add_row, tabs, style.
1. Name the visual region and owning renderable.
2. Track construction-time versus render-time additions.
3. Keep measurement and emitted segments aligned.
4. Preserve style spans across character expansion.
```

**4.16.8 31B track variant.** Read construction and render paths together and compare a sibling container; inspect segment output for style alignment.

**4.16.9 E4B track variant.** Use the region table and one construction/render path only; direct file routing is reliable in this family.

**4.16.10 Expected marginal value: HIGH.** Five single-file tasks with systematic visual-region invariants and compact patches.

**4.16.11 Confidence and evidence gaps.** **High.** Pixel-perfect behavior should be asserted through segments/rendered text, not terminal screenshots alone. No claim below treats public reference patches as hidden-test data.

**4.16.12 Sources.** Representative upstream records: [rich_2725](https://github.com/Textualize/rich/pull/2725), [rich_3518](https://github.com/Textualize/rich/pull/3518), [rich_3935](https://github.com/Textualize/rich/pull/3935); the normative resources linked in §4.16.4; the complete instance digest is Appendix F.

### 4.17 F-17 — Terminal detection, ANSI & console I/O

**Identity, category, repository, count, and roster.** F-17 belongs to the rich domain; it contains **8** recovered public tasks. Roster: `rich_3278`, `rich_3468`, `rich_3470`, `rich_3675`, `rich_3777`, `rich_4075`, `rich_4076`, `rich_4077`. Median reference patch: **32 lines**; one-file tasks: **6/8** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.17.1 Issue morphology.** Console environment and I/O edges: `FileProxy.isatty`, ANSI newline preservation, empty-print `end`, interactivity environment variables, broken pipes, color overrides, private ANSI sequences, and record/capture interaction.

**4.17.2 Gold-patch anatomy.** Six of eight tasks touch one file; edits are concentrated in `console.py`, `ansi.py`, `file_proxy.py`, and diagnostics, with a 32-line median.

**4.17.3 De facto behavioral specification.** Capability detection must honor explicit environment policy and wrapped streams; output must preserve caller newline controls and ANSI-derived line boundaries; broken pipes must follow a controlled hook/exit path; recording and capturing must not corrupt each other’s buffers.

**4.17.4 External resources required.**
- [Rich Console](https://rich.readthedocs.io/en/stable/console.html) — **Reason:** Color, capture, record, file proxy, and terminal detection APIs.
- [ECMA-48](https://www.ecma-international.org/publications-and-standards/standards/ecma-48/) — **Reason:** Control-function/sequence terminology.
- [NO_COLOR informal specification](https://no-color.org/) — **Reason:** De facto empty/nonempty environment-variable convention; not an ANSI standard.
- [Python `sys` and `os` I/O](https://docs.python.org/3/library/sys.html#sys.stdout) — **Reason:** Stream and broken-pipe behavior.

**4.17.5 Localization surface and likely wrong turns.** Start in Console capability detection and buffer flush, `ansi.decode_line`, `FileProxy.fileno/isatty`, and capture/record state. Wrong turns include checking only `sys.stdout` instead of the configured file, treating `NO_COLOR=` as absent, or changing global print endings for an empty-render edge case.

**4.17.6 Trap list.**
- Boolean-parsing environment values against the documented presence semantics.
- Dropping newline-only ANSI input.
- Swallowing all OSErrors as broken pipes.
- Proxying `fileno` but not `isatty`.
- Stripping private sequences needed for legitimate internal rendering.

**4.17.7 Recommended brain artifact and draft content.** `skills/rich-console-io/SKILL.md` with stream/capability/environment matrix.

```text
TRIGGER: Console, ANSI, TTY, NO_COLOR, TTY_*, broken pipe, capture, record, isatty.
1. Identify configured stream, wrapper, environment, and output mode.
2. Separate text content from control sequences and newline controls.
3. Preserve hook behavior on I/O failure.
4. Check capture and record state independently.
```

**4.17.8 31B track variant.** Inspect configured stream and environment precedence, then one writer/reader path; use a state table for capture/record interactions.

**4.17.9 E4B track variant.** Use explicit presence-versus-value checks and one Console method. Avoid deep terminal backend exploration unless the statement names it.

**4.17.10 Expected marginal value: HIGH.** Eight compact tasks and frequent environment edge cases; high reuse across terminal issues.

**4.17.11 Confidence and evidence gaps.** **High.** NO_COLOR and TTY_* are library/de facto conventions, not all formal standards; follow pinned Rich tests. No claim below treats public reference patches as hidden-test data.

**4.17.12 Sources.** Representative upstream records: [rich_3278](https://github.com/Textualize/rich/pull/3278), [rich_3777](https://github.com/Textualize/rich/pull/3777), [rich_4077](https://github.com/Textualize/rich/pull/4077); the normative resources linked in §4.17.4; the complete instance digest is Appendix F.

### 4.18 F-18 — Text & style data-structure internals

**Identity, category, repository, count, and roster.** F-18 belongs to the rich domain; it contains **4** recovered public tasks. Roster: `rich_2943`, `rich_3471`, `rich_3480`, `rich_3938`. Median reference patch: **15.5 lines**; one-file tasks: **3/4** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.18.1 Issue morphology.** Core mutable data-structure invariants: style metadata/hash caches, self-append, control-code tokens, and soft-wrap newline/segment splitting.

**4.18.2 Gold-patch anatomy.** Three of four tasks touch one file; the fourth coordinates console wrapping and Segment splitting. Median patch is 15.5 lines.

**4.18.3 De facto behavioral specification.** Cached style representations must invalidate when metadata changes; appending a Text to itself must terminate with deterministic content; token append must preserve control codes without turning them into printable text; line splitting must retain the specified terminator/style behavior.

**4.18.4 External resources required.**
- [Rich Text API](https://rich.readthedocs.io/en/stable/text.html) — **Reason:** Mutable text, spans, and append semantics.
- [Rich Segment API](https://rich.readthedocs.io/en/stable/reference/segment.html) — **Reason:** Line/cell splitting primitives.
- [Rich Style API](https://rich.readthedocs.io/en/stable/style.html) — **Reason:** Style composition and metadata.
- [Python object hash contract](https://docs.python.org/3/reference/datamodel.html#object.__hash__) — **Reason:** Cache/hash consistency requirements.

**4.18.5 Localization surface and likely wrong turns.** Go to `style.py` cache/metadata mutation, `text.py` append/token paths, and `segment.py` plus console soft-wrap code. Wrong turns include clearing every cache globally, copying arbitrary Text on each append, or handling grapheme width for a purely line-terminator bug.

**4.18.6 Trap list.**
- Iterating and appending to the same mutable sequence.
- Leaving hash/equality caches stale after metadata reset.
- Dropping `\r`, `\n`, or control characters during token conversion.
- Changing cell splitting when the bug is line splitting.

**4.18.7 Recommended brain artifact and draft content.** `skills/rich-text-segment-invariants/SKILL.md` with mutation/cache/iterator checks.

```text
TRIGGER: Text append/tokens, Style metadata/cache, Segment split lines/cells, soft wrap.
1. Identify mutable object, iteration source, cache, and output invariant.
2. Snapshot input when self-aliasing is possible.
3. Invalidate exactly the derived state tied to the mutation.
4. Distinguish line boundaries, cells, styles, and graphemes.
```

**4.18.8 31B track variant.** Trace both producer and consumer for shared Segment behavior; inspect invalidation points for style caches.

**4.18.9 E4B track variant.** Use direct file routing and one invariant sentence before editing; avoid touching Unicode width tables unless the issue explicitly concerns cells.

**4.18.10 Expected marginal value: HIGH.** Four very small patches teaching general mutation and cache discipline; low context cost.

**4.18.11 Confidence and evidence gaps.** **High.** No material gap beyond execution-level verification. No claim below treats public reference patches as hidden-test data.

**4.18.12 Sources.** Representative upstream records: [rich_2943](https://github.com/Textualize/rich/pull/2943), [rich_3480](https://github.com/Textualize/rich/pull/3480), [rich_3938](https://github.com/Textualize/rich/pull/3938); the normative resources linked in §4.18.4; the complete instance digest is Appendix F.

### 4.19 F-19 — Tracebacks, introspection & object representation

**Identity, category, repository, count, and roster.** F-19 belongs to the rich domain; it contains **6** recovered public tasks. Roster: `rich_3006`, `rich_3472`, `rich_3486`, `rich_3676`, `rich_3772`, `rich_3894`. Median reference patch: **46 lines**; one-file tasks: **4/6** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.19.1 Issue morphology.** Exception and object introspection: Python 3.11 fine-grained traceback positions, exception notes/cycles, unusual qualnames, dataclasses with missing fields, and custom equality in repr handling.

**4.19.2 Gold-patch anatomy.** Four of six tasks touch one file; traceback location work crosses syntax/default styles and the median patch is 46 lines.

**4.19.3 De facto behavioral specification.** Traceback extraction must handle recursive exception chains and PEP 678 notes without losing context; PEP 657 positions must map to the correct source range; introspection must tolerate unusual or missing attributes; repr/pretty logic must not invoke arbitrary equality with unrelated sentinel objects.

**4.19.4 External resources required.**
- [PEP 657](https://peps.python.org/pep-0657/) — **Reason:** Fine-grained instruction location data.
- [PEP 678](https://peps.python.org/pep-0678/) — **Reason:** Exception notes contract.
- [Python `traceback`](https://docs.python.org/3/library/traceback.html) — **Reason:** Exception chains, extraction, and rendering.
- [Python `inspect` and `dataclasses`](https://docs.python.org/3/library/inspect.html) — **Reason:** Introspection and field behavior.
- [Rich Traceback/Pretty](https://rich.readthedocs.io/en/stable/traceback.html) — **Reason:** Repository rendering options and pretty representation.

**4.19.5 Localization surface and likely wrong turns.** Inspect `traceback.py` extraction/rendering, `syntax.py` range highlighting, `_inspect.py`, `pretty.py`, and `repr.py`. Wrong turns include suppressing cycles by dropping exceptions, assuming `__qualname__` is always a string, and comparing sentinel/default values with arbitrary user objects using `==`.

**4.19.6 Trap list.**
- Infinite recursion on self-referential exception causes/context.
- Rendering notes repeatedly at every chain level.
- Trusting end positions without checking Python version/None.
- Field-default access raising for dataclass edges.
- User `__eq__` mutating or throwing during repr.

**4.19.7 Recommended brain artifact and draft content.** `skills/rich-safe-introspection/SKILL.md` with hostile-object and exception-chain checklist.

```text
TRIGGER: traceback, exception notes/cycles, inspect, qualname, dataclass, repr, custom __eq__.
1. Assume user attributes and special methods may be missing or hostile.
2. Track visited exception/object identities.
3. Separate extraction from rendering and source-range highlighting.
4. Use identity/type guards for sentinels rather than arbitrary equality.
```

**4.19.8 31B track variant.** Trace exception chain and source-location pipeline; inspect one standard-library contract before choosing a guard.

**4.19.9 E4B track variant.** Apply visited-identity and identity-sentinel rules mechanically; read only the relevant introspection function and one caller.

**4.19.10 Expected marginal value: HIGH.** Six tasks with reusable defensive-introspection techniques and moderate, tractable patches.

**4.19.11 Confidence and evidence gaps.** **High.** Python-version-specific traceback output must be verified in the actual test interpreter; no universal golden formatting is assumed. No claim below treats public reference patches as hidden-test data.

**4.19.12 Sources.** Representative upstream records: [rich_3006](https://github.com/Textualize/rich/pull/3006), [rich_3676](https://github.com/Textualize/rich/pull/3676), [rich_3894](https://github.com/Textualize/rich/pull/3894); the normative resources linked in §4.19.4; the complete instance digest is Appendix F.

### 4.20 F-20 — Unicode, graphemes & cell-width segmentation

**Identity, category, repository, count, and roster.** F-20 belongs to the rich domain; it contains **8** recovered public tasks. Roster: `rich_3180`, `rich_3506`, `rich_3521`, `rich_3535`, `rich_3930`, `rich_3944`, `rich_3953`, `rich_4006`. Median reference patch: **57.5 lines**; one-file tasks: **5/8** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.20.1 Issue morphology.** Unicode correctness and termination: grapheme splitting loops, isolated ZWJ/control codes, out-of-range codepoints, Unicode data update, double-width wrapping, regex performance, and cell splitting.

**4.20.2 Gold-patch anatomy.** Five of eight tasks touch one file, but the family contains the corpus’s 12,870-line Unicode-data outlier. The remaining work is concentrated in `cells.py` and `segment.py`, often below 100 lines.

**4.20.3 De facto behavioral specification.** Segmentation must make progress on every codepoint/cluster, treat grapheme clusters as user-perceived units where the library does, return defined widths for unusual/control/out-of-range inputs, and keep cell offsets consistent for wide/combining characters.

**4.20.4 External resources required.**
- [Unicode UAX #29](https://www.unicode.org/reports/tr29/) — **Reason:** Normative grapheme-cluster boundary rules.
- [Unicode UAX #11](https://www.unicode.org/reports/tr11/) — **Reason:** East Asian Width classes and wide-character interpretation.
- [Unicode Character Database](https://www.unicode.org/ucd/) — **Reason:** Versioned source for generated width/Unicode tables.
- [Rich Segments/Text](https://rich.readthedocs.io/en/stable/reference/segment.html) — **Reason:** Cell splitting and renderable primitive contracts.

**4.20.5 Localization surface and likely wrong turns.** Route grapheme/width issues to `cells.py`, segment offsets to `segment.py`, and wrapping to `_wrap.py` plus cells. Inspect generated `_unicode_data/` only for version-update tasks. Wrong turns include vendoring new Unicode tables for a single loop bug, using `len()` as cell width, or patching regexes without checking empty-match progress.

**4.20.6 Trap list.**
- Loop failing to advance on ZWJ/control/empty regex match.
- Indexing width tables with an invalid/out-of-range codepoint.
- Counting codepoints rather than terminal cells.
- Dropping a double-width character at a wrap boundary.
- Training on the 12,870-line generated table diff as if it were reasoning data.

**4.20.7 Recommended brain artifact and draft content.** `skills/unicode-cell-segmentation/SKILL.md` plus a versioned UAX #29/#11 resource; exclude generated data from prompt preload.

```text
TRIGGER: grapheme, ZWJ, combining, East Asian Width, wide char, cell split, control code, Unicode version.
1. Classify codepoint, grapheme, cell, and byte offsets.
2. Prove every loop advances, including empty/degenerate clusters.
3. Define control/out-of-range fallback before table lookup.
4. Regenerate versioned tables only when the task is explicitly a Unicode update.
```

**4.20.8 31B track variant.** Read the cluster/cell algorithm and one wrapper consumer; reason with minimal adversarial strings and inspect table versions only when needed.

**4.20.9 E4B track variant.** Use a four-row example table—input, cluster count, cell width, next offset—and require a progress assertion in the proposed logic. Avoid generated-data tasks.

**4.20.10 Expected marginal value: HIGH.** Eight tasks and a dense shared algorithmic core; the artifact is valuable even though generated Unicode-update patches should not be imitated.

**4.20.11 Confidence and evidence gaps.** **High.** Rich intentionally implements library-specific width policy; UAX references guide reasoning but pinned tests decide ambiguous emoji/control behavior. No claim below treats public reference patches as hidden-test data.

**4.20.12 Sources.** Representative upstream records: [rich_3180](https://github.com/Textualize/rich/pull/3180), [rich_3930](https://github.com/Textualize/rich/pull/3930), [rich_4006](https://github.com/Textualize/rich/pull/4006); the normative resources linked in §4.20.4; the complete instance digest is Appendix F.

### 4.21 F-21 — Authentication configuration

**Identity, category, repository, count, and roster.** F-21 belongs to the requests domain; it contains **1** recovered public tasks. Roster: `requests_7205`. Median reference patch: **11 lines**; one-file tasks: **1/1** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.21.1 Issue morphology.** Authentication configuration parsing: an empty netrc entry must not become malformed credentials.

**4.21.2 Gold-patch anatomy.** One 11-line change in `src/requests/utils.py`, near netrc selection and Authorization preparation.

**4.21.3 De facto behavioral specification.** Empty/missing netrc machine entries must behave as absent authentication rather than constructing an invalid user/password pair; nonempty matching entries retain their existing precedence and behavior.

**4.21.4 External resources required.**
- [Python `netrc`](https://docs.python.org/3/library/netrc.html) — **Reason:** Netrc parsing, authenticators, and default behavior.
- [RFC 7617](https://www.rfc-editor.org/rfc/rfc7617.html) — **Reason:** Basic authentication credential construction.
- [Requests authentication](https://requests.readthedocs.io/en/latest/user/authentication/) — **Reason:** Library netrc and explicit-auth precedence.

**4.21.5 Localization surface and likely wrong turns.** Search `get_netrc_auth`, its callers, and request authentication preparation. Wrong turns include changing Basic Auth encoding, catching every netrc parsing exception as empty credentials, or overriding explicitly supplied auth.

**4.21.6 Trap list.**
- Turning empty tuple/login into `":"` credentials.
- Broad exception handling that hides malformed netrc files.
- Changing proxy versus origin credential selection.
- Breaking explicit `auth=` precedence.

**4.21.7 Recommended brain artifact and draft content.** `repo_navigation/resources/requests-auth-precedence.md`; no dedicated skill needed for one task.

```text
RESOURCE: distinguish no entry, empty entry, malformed file, explicit auth, origin auth, and proxy auth.
Edit the netrc-selection helper, not Basic Auth encoding.
Verify absent and nonempty entries retain their prior paths.
```

**4.21.8 31B track variant.** Read helper and one caller to confirm precedence, then make the local guard.

**4.21.9 E4B track variant.** Direct helper search and a two-case truth table; one small edit and targeted check.

**4.21.10 Expected marginal value: MEDIUM.** A tiny, tractable task but only one public instance; fold the lesson into a general HTTP resource.

**4.21.11 Confidence and evidence gaps.** **High.** No material task-specific gap; original family label remains unverified only at the corpus level. No claim below treats public reference patches as hidden-test data.

**4.21.12 Sources.** Representative upstream records: [requests_7205](https://github.com/psf/requests/pull/7205); the normative resources linked in §4.21.4; the complete instance digest is Appendix F.

### 4.22 F-22 — Dependency compatibility & HTTP constants

**Identity, category, repository, count, and roster.** F-22 belongs to the requests domain; it contains **2** recovered public tasks. Roster: `requests_6592`, `requests_6757`. Median reference patch: **26.5 lines**; one-file tasks: **1/2** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.22.1 Issue morphology.** HTTP constants and dependency compatibility: add HTTP 425 `too_early` and keep Requests working with urllib3 1.26.x as well as newer branches.

**4.22.2 Gold-patch anatomy.** One status-code addition and one compatibility patch in `compat.py`/`utils.py`; median patch is 26.5 lines.

**4.22.3 De facto behavioral specification.** Reason phrases and constants must map to the correct RFC status; imports and utility behavior must feature-detect supported urllib3 APIs without breaking either dependency line.

**4.22.4 External resources required.**
- [RFC 8470](https://www.rfc-editor.org/rfc/rfc8470.html) — **Reason:** Defines 425 Too Early.
- [RFC 9110 status codes](https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes) — **Reason:** Current HTTP status framework and registry context.
- [urllib3 2.0 migration guide](https://urllib3.readthedocs.io/en/stable/v2-migration-guide.html) — **Reason:** Dependency API differences.
- [Requests dependencies](https://requests.readthedocs.io/en/latest/user/install/) — **Reason:** Supported dependency contract.

**4.22.5 Localization surface and likely wrong turns.** Inspect `status_codes.py`, `compat.py`, and utility imports/callers. Wrong turns include backporting an urllib3 implementation wholesale or adding an HTTP constant in docs only.

**4.22.6 Trap list.**
- Wrong reason phrase or numeric key.
- Importing a symbol that exists only in one urllib3 major line.
- Catching ImportError around unrelated runtime failures.
- Upgrading dependencies as a substitute for source compatibility.

**4.22.7 Recommended brain artifact and draft content.** `repo_navigation/resources/http-version-compat.md` with status/feature-detection checks.

```text
RESOURCE: cite the status-defining RFC and test both the constant and phrase.
For dependencies, enumerate API by version, prefer explicit feature detection, and never repair the installed environment as the patch.
```

**4.22.8 31B track variant.** Inspect both compatibility branches and one consumer; validate the RFC mapping independently.

**4.22.9 E4B track variant.** Use a version/API table and minimal import guard; direct file routing.

**4.22.10 Expected marginal value: MEDIUM.** Only two tasks but cheap reusable standards/version discipline.

**4.22.11 Confidence and evidence gaps.** **High.** Exact supported versions depend on the base commit’s packaging constraints, which must be read locally. No claim below treats public reference patches as hidden-test data.

**4.22.12 Sources.** Representative upstream records: [requests_6592](https://github.com/psf/requests/pull/6592), [requests_6757](https://github.com/psf/requests/pull/6757); the normative resources linked in §4.22.4; the complete instance digest is Appendix F.

### 4.23 F-23 — Protocol typing & duck-type compatibility

**Identity, category, repository, count, and roster.** F-23 belongs to the requests domain; it contains **1** recovered public tasks. Roster: `requests_7505`. Median reference patch: **63 lines**; one-file tasks: **0/1** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.23.1 Issue morphology.** Duck-typed protocol compatibility: runtime checks must tolerate objects implementing behavior through dynamic attributes rather than nominal classes.

**4.23.2 Gold-patch anatomy.** One 63-line patch spans `_types.py` and `models.py`, touching protocol definitions and `items`/`read` detection.

**4.23.3 De facto behavioral specification.** Objects with the required `items` or `read` behavior must not be rejected merely because `isinstance` against a Protocol/ABC is unreliable; `hasattr` checks must preserve clear errors for genuinely unsupported objects.

**4.23.4 External resources required.**
- [Python `typing.Protocol`](https://docs.python.org/3/library/typing.html#typing.Protocol) — **Reason:** Static structural typing and runtime-checkable limits.
- [Python `collections.abc`](https://docs.python.org/3/library/collections.abc.html) — **Reason:** Nominal versus structural container behavior.
- [Requests advanced usage](https://requests.readthedocs.io/en/latest/user/advanced/) — **Reason:** Body/file-like object expectations.

**4.23.5 Localization surface and likely wrong turns.** Trace `_types.py` protocols into `models.py` request-body encoding; compare this family with F-25 dynamic file wrappers. Wrong turns include making every Protocol runtime-checkable or replacing all type checks indiscriminately.

**4.23.6 Trap list.**
- Runtime Protocol checks raising TypeError for non-method members.
- Using `callable(getattr(...))` in a way that triggers surprising dynamic behavior repeatedly.
- Weakening validation for unrelated fields.
- Fixing only one of parallel body/multipart paths.

**4.23.7 Recommended brain artifact and draft content.** `skills/requests-duck-type-boundaries/SKILL.md`, shared with F-25.

```text
TRIGGER: Protocol, isinstance, hasattr, __getattr__, items, read, file-like.
1. State the behavior required, not the concrete class.
2. Locate every parallel runtime protocol check.
3. Preserve static types while making runtime detection behavior-based.
4. Test nominal, __getattr__-based, and genuinely invalid objects.
```

**4.23.8 31B track variant.** Inspect both typing and runtime body paths and compare sibling dynamic-wrapper fixes.

**4.23.9 E4B track variant.** Use the three-object test set and one protocol/helper at a time; avoid rewriting the type module broadly.

**4.23.10 Expected marginal value: HIGH.** One instance, but the duck-typing rule also covers two F-25 tasks and is highly reusable.

**4.23.11 Confidence and evidence gaps.** **High.** Small public count means the marginal-value rating depends on cross-family transfer, explicitly counted here. No claim below treats public reference patches as hidden-test data.

**4.23.12 Sources.** Representative upstream records: [requests_7505](https://github.com/psf/requests/pull/7505); the normative resources linked in §4.23.4; the complete instance digest is Appendix F.

### 4.24 F-24 — Redirects & connection/stream lifecycle

**Identity, category, repository, count, and roster.** F-24 belongs to the httpx domain (cross-repository HTTP lifecycle); it contains **2** recovered public tasks. Roster: `httpx_3672`, `requests_7328`. Median reference patch: **135.5 lines**; one-file tasks: **1/2** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.24.1 Issue morphology.** Connection and redirect lifecycle: prevent cyclic `Response.history`, and fix HTTPX server keep-alive/parser/stream shutdown behavior.

**4.24.2 Gold-patch anatomy.** Requests has a local session redirect fix; HTTPX has a broad seven-file change across sync/async parsers, pools, servers, and network streams. Median patch is 135.5 lines.

**4.24.3 De facto behavioral specification.** Redirect history must contain prior responses without self-reference; persistent HTTP/1.1 connections must consume/reset requests correctly, preserve keep-alive only when valid, close server streams, and exit cleanly.

**4.24.4 External resources required.**
- [RFC 9112, message body and persistence](https://www.rfc-editor.org/rfc/rfc9112.html) — **Reason:** Normative HTTP/1.1 message completion and persistent connections.
- [RFC 9110 redirects](https://www.rfc-editor.org/rfc/rfc9110.html#name-redirection-3xx) — **Reason:** Redirect semantics.
- [Requests redirects](https://requests.readthedocs.io/en/latest/user/quickstart/#redirection-and-history) — **Reason:** `Response.history` contract.
- [HTTPX async support](https://www.python-httpx.org/async/) — **Reason:** Sync/async lifecycle parity context.

**4.24.5 Localization surface and likely wrong turns.** For Requests, inspect `sessions.py` redirect resolution and history append/copy. For HTTPX, trace parser → pool → server → network stream for both `httpx` and `ahttpx`. Wrong turns include clearing all history or patching only the sync server when the defect is shared.

**4.24.6 Trap list.**
- Appending a response to its own history list by aliasing.
- Reusing a parser before the prior request body is complete.
- Keeping a connection alive after malformed/incomplete input.
- Closing one sync/async stream but not its counterpart.
- Treating the lone HTTPX task as representative of repository frequency.

**4.24.7 Recommended brain artifact and draft content.** `skills/http-connection-lifecycle/SKILL.md` with redirect-list and keep-alive state machines.

```text
TRIGGER: Response.history, redirect loop, keep-alive, request body, parser reset, stream close, server exit.
1. Draw object ownership and connection state transitions.
2. For history, copy/link prior responses without self-aliasing.
3. For connections, define complete, reusable, must-close, and shutdown states.
4. Check sync/async parity explicitly.
```

**4.24.8 31B track variant.** Use a lifecycle trace across all seven HTTPX modules and reserve more budget; Requests history remains a small direct fix.

**4.24.9 E4B track variant.** Take Requests redirect first. On HTTPX, avoid an ungrounded seven-file rewrite; trace one failing transition and mirror only a proven sync/async sibling.

**4.24.10 Expected marginal value: HIGH.** Only two tasks but severe correctness invariants and a strong cross-repository lifecycle lesson; broad HTTPX work lowers tractability.

**4.24.11 Confidence and evidence gaps.** **High on morphology; Medium on E4B tractability.** HTTPX server internals are version-specific and one public task cannot support a repository-level prior. No claim below treats public reference patches as hidden-test data.

**4.24.12 Sources.** Representative upstream records: [httpx_3672](https://github.com/encode/httpx/pull/3672), [requests_7328](https://github.com/psf/requests/pull/7328); the normative resources linked in §4.24.4; the complete instance digest is Appendix F.

### 4.25 F-25 — Request bodies, file wrappers & content length

**Identity, category, repository, count, and roster.** F-25 belongs to the requests domain; it contains **3** recovered public tasks. Roster: `requests_6589`, `requests_7433`, `requests_7502`. Median reference patch: **13 lines**; one-file tasks: **3/3** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.25.1 Issue morphology.** Request-body preparation: dynamic file wrappers, custom `__getattr__` iterability, and byte-accurate Content-Length for non-ASCII/emoji bodies.

**4.25.2 Gold-patch anatomy.** All three tasks touch one file and have a 13-line median, split between `models.py` body/multipart encoding and `utils.py` length calculation.

**4.25.3 De facto behavioral specification.** File-like and iterable detection must be based on effective behavior, including dynamically supplied attributes; body length must be computed from the exact encoded bytes on the wire, not Unicode codepoint count; empty/unknown-length streams must retain their existing semantics.

**4.25.4 External resources required.**
- [RFC 9112, Content-Length](https://www.rfc-editor.org/rfc/rfc9112.html#name-content-length) — **Reason:** Message framing requires octet length.
- [RFC 3629](https://www.rfc-editor.org/rfc/rfc3629.html) — **Reason:** UTF-8 byte encoding.
- [RFC 7578](https://www.rfc-editor.org/rfc/rfc7578.html) — **Reason:** Multipart form-data bodies.
- [Python `io`](https://docs.python.org/3/library/io.html) — **Reason:** File-like read/seek/tell behavior.

**4.25.5 Localization surface and likely wrong turns.** Inspect `PreparedRequest.prepare_body`, `_encode_files`, iterable/file detection, and `super_len`/stream positioning. Wrong turns include encoding once for length and differently for transmission, consuming a nonseekable stream to measure it, or using `len(text)` for UTF-8.

**4.25.6 Trap list.**
- Calling dynamic attributes repeatedly and changing object state.
- Misclassifying strings/mappings as generic iterables.
- Returning character count for multibyte content.
- Destroying stream position or reading an infinite iterator.
- Fixing multipart but not plain body behavior.

**4.25.7 Recommended brain artifact and draft content.** `skills/requests-body-encoding/SKILL.md` shared with F-23.

```text
TRIGGER: Content-Length, UTF-8, emoji, __getattr__, file wrapper, iterable, multipart.
1. Identify exact wire bytes and stream seekability.
2. Detect required read/items/iter behavior without nominal-class assumptions.
3. Compute length from encoded octets and preserve stream position.
4. Check plain body and multipart sibling paths.
```

**4.25.8 31B track variant.** Trace prepare_body and multipart encoding together; inspect stream state before/after length calculation.

**4.25.9 E4B track variant.** Use the byte-length rule and three-object behavior test; prioritize this family for early compact edits.

**4.25.10 Expected marginal value: HIGH.** Three tiny, single-file tasks plus transfer to F-23; excellent tractability.

**4.25.11 Confidence and evidence gaps.** **High.** Ambiguous dynamic-object behavior should be constrained by upstream tests rather than overgeneralized to all iterables. No claim below treats public reference patches as hidden-test data.

**4.25.12 Sources.** Representative upstream records: [requests_6589](https://github.com/psf/requests/pull/6589), [requests_7433](https://github.com/psf/requests/pull/7433), [requests_7502](https://github.com/psf/requests/pull/7502); the normative resources linked in §4.25.4; the complete instance digest is Appendix F.

### 4.26 F-26 — Response parsing & exception serialization

**Identity, category, repository, count, and roster.** F-26 belongs to the requests domain; it contains **2** recovered public tasks. Roster: `requests_6629`, `requests_7309`. Median reference patch: **27 lines**; one-file tasks: **2/2** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.26.1 Issue morphology.** Response metadata parsing and exception serialization: malformed Content-Type handling and robust JSONDecodeError reconstruction.

**4.26.2 Gold-patch anatomy.** Two one-file patches in `utils.py` and `exceptions.py`, with a 27-line median.

**4.26.3 De facto behavioral specification.** Content-Type parsing must return a safe, predictable result for malformed parameters without crashing response processing; JSON decode exceptions must retain message, document, position, and response/request context across serialization/deserialization.

**4.26.4 External resources required.**
- [RFC 9110, Content-Type](https://www.rfc-editor.org/rfc/rfc9110.html#name-content-type) — **Reason:** Media type and parameter grammar.
- [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259.html) — **Reason:** JSON text grammar.
- [Python `json.JSONDecodeError`](https://docs.python.org/3/library/json.html#json.JSONDecodeError) — **Reason:** Constructor and attributes required for faithful reconstruction.
- [Requests exceptions](https://requests.readthedocs.io/en/latest/api/#exceptions) — **Reason:** Exception inheritance and response context.

**4.26.5 Localization surface and likely wrong turns.** Inspect `_parse_content_type_header` and Requests’ JSONDecodeError compatibility class/constructor. Wrong turns include replacing the parser with a strict standards parser that rejects previously tolerated inputs or pickling the entire Response unnecessarily.

**4.26.6 Trap list.**
- Dropping `doc`/`pos` during exception reconstruction.
- Catching all ValueError and hiding unrelated parsing defects.
- Changing header casing or parameter semantics globally.
- Confusing response `.json()` failure with network failure.

**4.26.7 Recommended brain artifact and draft content.** `repo_navigation/resources/requests-parsing-exceptions.md`.

```text
RESOURCE: list parser input, tolerated malformed forms, fallback output, and exception fields.
Preserve Requests compatibility exceptions and response/request ownership.
Do not broaden JSON or media-type acceptance beyond the stated edge case.
```

**4.26.8 31B track variant.** Read parser and caller plus exception constructor signature; verify all state fields survive a round trip.

**4.26.9 E4B track variant.** Use a field checklist and minimal parser guard; avoid redesigning content-type parsing.

**4.26.10 Expected marginal value: MEDIUM.** Two small tasks with reusable defensive parsing knowledge but limited breadth.

**4.26.11 Confidence and evidence gaps.** **High.** Serialization behavior should be tested with the actual pickle/copy protocol used by Requests tests. No claim below treats public reference patches as hidden-test data.

**4.26.12 Sources.** Representative upstream records: [requests_6629](https://github.com/psf/requests/pull/6629), [requests_7309](https://github.com/psf/requests/pull/7309); the normative resources linked in §4.26.4; the complete instance digest is Appendix F.

### 4.27 F-27 — URLs, paths & proxy boundary handling

**Identity, category, repository, count, and roster.** F-27 belongs to the requests domain; it contains **3** recovered public tasks. Roster: `requests_6644`, `requests_7315`, `requests_7427`. Median reference patch: **12 lines**; one-file tasks: **3/3** (derived from the [recovered index](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)).

**4.27.1 Issue morphology.** URL/path/proxy boundaries: duplicate leading slashes, an extra slash triggering urllib3 reparsing, and greedy `no_proxy` matching.

**4.27.2 Gold-patch anatomy.** All three tasks touch one file with a 12-line median; two are in `adapters.py`, one in `utils.py`.

**4.27.3 De facto behavioral specification.** URL normalization must preserve significant path form while preventing downstream reparse ambiguity; proxy bypass must match intended host/domain boundaries rather than arbitrary suffixes; changes must respect installed urllib3 behavior and documented minimum versions.

**4.27.4 External resources required.**
- [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986.html) — **Reason:** URI path, authority, and normalization boundaries.
- [Python `urllib.request.getproxies`](https://docs.python.org/3/library/urllib.request.html#urllib.request.getproxies) — **Reason:** Platform proxy environment and bypass context.
- [CPython bpo-39057](https://bugs.python.org/issue39057) — **Reason:** Upstream proxy-matching defect history.
- [urllib3 2.x migration](https://urllib3.readthedocs.io/en/stable/v2-migration-guide.html) — **Reason:** Version-dependent URL/request-target behavior.

**4.27.5 Localization surface and likely wrong turns.** Inspect HTTPAdapter.request_url and proxy selection/`should_bypass_proxies`; read the exact URL through PreparedRequest → adapter → urllib3. Wrong turns include normalizing every repeated slash in the original URL, using naive string `endswith` for domains, or changing global proxy policy for one adapter path.

**4.27.6 Trap list.**
- Collapsing `//` where the server treats it as significant.
- Fixing leading slash in one scheme/path branch only.
- Matching `notexample.com` as a subdomain of `example.com`.
- Assuming a full path fix works on unsupported urllib3 versions.
- Mishandling IPv6, ports, or trailing dots while fixing suffix matching.

**4.27.7 Recommended brain artifact and draft content.** `skills/requests-url-proxy-boundaries/SKILL.md` with URL pipeline and host-match table.

```text
TRIGGER: leading slash, duplicate slash, request_url, proxy, no_proxy, suffix.
1. Track URL form through PreparedRequest → adapter → urllib3.
2. Preserve path semantics; change only the implicated boundary.
3. Match proxy hosts on host/domain labels, not raw suffixes.
4. Include ports, subdomains, lookalike suffixes, and dependency-version checks.
```

**4.27.8 31B track variant.** Trace the full URL pipeline and inspect dependency-version conditionals; test host boundaries independently.

**4.27.9 E4B track variant.** Use direct adapter/utils routing and a four-case host/path table; make one local normalization/match correction.

**4.27.10 Expected marginal value: HIGH.** Three tiny, single-file tasks with precise reusable boundary rules and low implementation cost.

**4.27.11 Confidence and evidence gaps.** **High.** The duplicate-slash fix depends on urllib3 2.7.0+ for the complete upstream resolution; the report does not claim source-only parity on older versions. No claim below treats public reference patches as hidden-test data.

**4.27.12 Sources.** Representative upstream records: [requests_6644](https://github.com/psf/requests/pull/6644), [requests_7315](https://github.com/psf/requests/pull/7315), [requests_7427](https://github.com/psf/requests/pull/7427); the normative resources linked in §4.27.4; the complete instance digest is Appendix F.

### 5. Family comparison and prioritization

#### 5.1 Tractability, artifact form, and marginal value

Artifact forms follow the handoff: **(i)** generic scaffold, **(ii)** family prompt fragment, **(iii)** skill/resource, **(iv)** dedicated sub-agent, **(v)** adapter specialization. No family receives a dedicated sub-agent in the baseline; the shared 31B reviewer, if enabled, is family-agnostic. No family receives a standalone adapter: family slices may contribute to one unified adapter only after contamination and holdout gates.

| Family | Tractability | Recommended forms | Value | Reason in one line |
|---|---|---|---|---|
| F-01 | Medium | (i)+(iii) | **HIGH** | Four tasks, several reusable security invariants, and high cost for a wrong status or scope-cache decision. |
| F-02 | Low | (i)+(ii/resource) | **MEDIUM** | A version matrix is valuable, but dedicated patch LoRA on these broad diffs has poor transfer and high regression risk. |
| F-03 | High | (i)+(iii) | **HIGH** | Largest family, mostly compact patches, and one reusable procedure covers many historically difficult Python edge cases. |
| F-04 | Very high | (i)+(ii/resource) | **MEDIUM** | Only three tasks but extremely tractable; a short resource prevents the common mistake of ignoring executable docs. |
| F-05 | Medium-low | (i)+(iii) | **MEDIUM** | Only two tasks, but the error-lifecycle resource generalizes beyond the exact pair and prevents destructive error rewrites. |
| F-06 | High | (i)+(iii) | **HIGH** | Seven tasks with compact median patches and stable normative specifications; dedicated knowledge has clear reuse. |
| F-07 | Very high | (i)+(iii) | **HIGH** | Eight uniformly one-file, tiny-patch tasks: the best count-to-tractability ratio in the corpus. |
| F-08 | High | (i)+(iii) | **HIGH** | Eleven compact, recurring tasks with a coherent library-spec core; strong candidate for high-quality SFT as well as a skill. |
| F-09 | Medium | (i)+(iii) | **HIGH** | Seven tasks and a reusable lifecycle model; broad SSE tasks are harder but the same resource covers several small validation/serialization cases. |
| F-10 | Medium-low | (i)+(iii) | **MEDIUM** | Eight tasks, but broad feature patches and public API surface reduce expected per-call return relative to F-03/F-07/F-08. |
| F-11 | Very high | (i)+(ii/resource) | **MEDIUM** | Two very tractable tasks but little need for a large family-specific apparatus. |
| F-12 | Low | (i)+(ii/resource) | **LOW** | Single, broad, architecture-specific task; a resource helps but a dedicated artifact or adapter slice is unlikely to repay its cost. |
| F-13 | High | (i)+(iii) | **HIGH** | Four compact tasks whose failures share state-machine reasoning; a small artifact can prevent repeated blank-line and validation regressions. |
| F-14 | Very high | (i)+(iii) | **HIGH** | Six compact tasks with recurring composition errors; strong transfer to unseen renderer issues. |
| F-15 | Very high | (i)+(iii) | **HIGH** | Four tiny, single-file tasks with reusable measurement/style and URL-boundary lessons. |
| F-16 | Very high | (i)+(iii) | **HIGH** | Five single-file tasks with systematic visual-region invariants and compact patches. |
| F-17 | High | (i)+(iii) | **HIGH** | Eight compact tasks and frequent environment edge cases; high reuse across terminal issues. |
| F-18 | Very high | (i)+(iii) | **HIGH** | Four very small patches teaching general mutation and cache discipline; low context cost. |
| F-19 | High | (i)+(iii) | **HIGH** | Six tasks with reusable defensive-introspection techniques and moderate, tractable patches. |
| F-20 | High except generated update | (i)+(iii) | **HIGH** | Eight tasks and a dense shared algorithmic core; the artifact is valuable even though generated Unicode-update patches should not be imitated. |
| F-21 | Very high | (i)+(ii/resource) | **MEDIUM** | A tiny, tractable task but only one public instance; fold the lesson into a general HTTP resource. |
| F-22 | High | (i)+(ii/resource) | **MEDIUM** | Only two tasks but cheap reusable standards/version discipline. |
| F-23 | Medium-high | (i)+(iii) | **HIGH** | One instance, but the duck-typing rule also covers two F-25 tasks and is highly reusable. |
| F-24 | Mixed/low for HTTPX | (i)+(iii) | **HIGH** | Only two tasks but severe correctness invariants and a strong cross-repository lifecycle lesson; broad HTTPX work lowers tractability. |
| F-25 | Very high | (i)+(iii) | **HIGH** | Three tiny, single-file tasks plus transfer to F-23; excellent tractability. |
| F-26 | Very high | (i)+(ii/resource) | **MEDIUM** | Two small tasks with reusable defensive parsing knowledge but limited breadth. |
| F-27 | Very high | (i)+(iii) | **HIGH** | Three tiny, single-file tasks with precise reusable boundary rules and low implementation cost. |

#### 5.2 Priority waves and artifacts that should not be built

| Wave | Families | Deliverable | Numeric gate |
|---|---|---|---|
| 1: compact high-yield | F-03, F-07, F-08, F-13–F-18, F-20, F-23, F-25, F-27 | Six to eight consolidated skills, not 27 large prompt dumps; shared decision tables for related families | No localization regression on frozen dev; median time/calls must not rise by >10% without a paired PASS gain |
| 2: cross-layer and lifecycle | F-01, F-04–F-06, F-09, F-11, F-19, F-21, F-22, F-24, F-26 | Normative resources plus lifecycle/schema traces | Add only where baseline failure labels show the targeted misconception in at least two tasks or one repeated trajectory class |
| 3: broad/version-specific | F-02, F-10, F-12 | Short version/API resources and triage policy | Do not train on bulk diffs; require a task-specific plan and higher budget before attempting |
| Never as baseline | 27 standalone sub-agents; 27 adapters; full upstream docs; generated Unicode tables; public-instance answer lookup | None | Reject as context, latency, overfit, integrity, or license risk |

The families that most deserve dedicated artifacts are F-03, F-07, F-08, F-14, F-17, F-20, F-25, and F-27. F-12 deserves only a short import-graph resource; F-02 deserves a version matrix but **negative-value bulk-patch supervision**; the generated part of F-20 should be excluded from SFT. The generic kernel remains the only recommended treatment for an unseen family until evidence supports a new artifact.

## Part II — The two tracks

### 6. Model capability profiles

#### 6.1 Official architecture and raw configuration

| Axis | `gemma-4-31b-it-qat-w4a16-ct` | `gemma-4-e4b-it-qat-w4a16-ct` | Design meaning |
|---|---|---|---|
| Parameters | 30.7B dense | 4.5B effective; 8B with embeddings | E4B is not simply a uniformly shrunk 31B ([model card](https://ai.google.dev/gemma/docs/core/model_card_4)). |
| Text layers | 60 | 42 | Different reasoning capacity and adapter surface ([31B config](https://huggingface.co/google/gemma-4-31B-it-qat-w4a16-ct/blob/main/config.json), [E4B config](https://huggingface.co/google/gemma-4-E4B-it-qat-w4a16-ct/blob/main/config.json)). |
| Hidden size / intermediate | 5376 / 21504 | 2560 / 10240 | Different activation/memory profile. |
| Attention heads / KV heads | 32 / 16; 4 global KV heads | 8 / 2 | KV behavior differs; do not infer throughput from parameter count alone. |
| Shared-KV layers / per-layer input | 0 / not applicable | 18 / 256 | E4B’s PLE/shared-KV design requires model-aware adapter targeting. |
| Sliding window | 1024 | 512 | Local attention span differs. |
| Native position/context | 262144 / 256K | 131072 / 128K | Native limit is not the competition serving limit. |
| Vocabulary | 262144 | 262144 | Tokenizer/domain token costs should be similar, but must still be measured. |
| Quantization | compressed-tensors, `pack-quantized`, `compressed` | Same | Do not confuse with bitsandbytes NF4; official checkpoint configs govern. |
| Official sampling start | temperature 1.0, top-p 0.95, top-k 64 | Same | General model-card starting point, not a competition-proven optimum. |
| LiveCodeBench v6 | 80.0% | 52.0% | Useful capability signal, not repository-issue PASS ([model card](https://ai.google.dev/gemma/docs/core/model_card_4)). |
| Tau2 average | 76.9% | 42.2% | Agentic/tool-use signal, not this harness’s tool fidelity. |

Official vLLM documents `--reasoning-parser gemma4`, `--tool-call-parser gemma4`, automatic tool choice, and a Gemma 4 tool chat template; thinking increases required output/context budget ([vLLM Gemma 4](https://docs.vllm.ai/projects/recipes/en/stable/Google/Gemma4.html)). The model card says `<|think|>` enables thinking and prior thoughts should normally be omitted **except on tool-call turns, where thinking content should be preserved** ([model card](https://ai.google.dev/gemma/docs/core/model_card_4)). Training data and local replay must follow that turn-specific rule rather than stripping every thought or preserving every thought indiscriminately.

#### 6.2 Differential-axis matrix

| Axis | 31B shell | E4B shell | Evidence and uncertainty |
|---|---|---|---|
| Multi-step reasoning | Conditional deeper trace across up to three layers | One causal chain; externalized tables | Official benchmark delta plus community PASS delta; family-level causality unmeasured. |
| Tool-call reliability | Standard schema checks and retry on changed args | Stronger exact-call/repetition guards | Public E4B logs show loops; no official per-model schema-error rate. |
| Localization | Lexical candidates, then caller/callee graph if ambiguous | Direct path/exact symbol first; graph only on a named symbol | Same retrieval policy, less E4B exploration depth. |
| Decomposition | Internal subgoals; optional reviewer late | No planner fan-out; one editor | Prevents orchestration overhead and repeated planning. |
| Context/thinking | 32K probe envelope; 6144 output/4096 thinking start | 32K probe envelope; 4096 output/2048 thinking start | Values are hypotheses, not official limits. |
| Family resources | Broader triggered resources | Compressed checklists | E4B benefits from less choice and shorter instructions; must be ablated. |
| Patch strategy | Cross-file coordination when evidence requires | Prefer single-site and sibling-mirroring | Avoids ungrounded broad migrations. |
| Retry | One test-driven correction plus final review | One correction only; break repeated calls immediately | E4B failure logs show timeout/repetition risk. |
| Post-training | Unified main adapter; failed-trajectory repair | Conservative low-rank SFT/distillation; one adapter | NLL is insufficient; PASS/trajectory health selects. |
| Proxy use | Target model for final decisions | Qualitative smoke/failure discovery only | E4B cannot rank subtle 31B prompt changes reliably. |

The latest public same-prompt/same-budget comparison—51/129 for 31B versus 20/129 for E4B—has 31 discordant pairs in favor of 31B if every E4B solve is a 31B solve as reported; exact two-sided McNemar \(p=2(1/2)^{31}=9.31\times10^{-10}\). This strongly establishes a delta **for that community run**, not a universal pass-rate ratio ([Fatu results](https://github.com/fatu/gemma4-dev-agent/blob/main/RESULTS.md)).

### 7. The brain kernel (shared)

![Shared kernel and divergent model shells](gemma4-brain-assets/brain-architecture.png)

#### 7.1 Control-flow spine

| Phase | Shared rule | Output before advancing | Approximate token policy* |
|---|---|---|---|
| 0. Contract probe | Validate archive, includes, model, tools, skill loading, adapter binding, eval schema on public smoke tasks | Raw probe log; no guessed tool semantics | Offline; no per-task cost |
| 1. Statement preprocessing | Extract exact names/messages/types, trigger, expected behavior, edge cases, and bug/feature/docs intent | Five-to-eight-field de facto spec | 150–350 working tokens |
| 2. Archetype/family route | Choose generic archetype first; trigger at most one family skill | Route + reason; “generic” is valid | L1 index ≤250; L2 skill 400–800 |
| 3. Locate | Exact path/symbol → fixed-string lexical search → filenames/tests; graph only with a concrete node/question | One primary file/symbol and one fallback | Search results ≤1200 |
| 4. Read | Implementation plus one caller/test/sibling; narrow regions | Causal hypothesis and compatibility constraint | 4–8K code, not whole files |
| 5. Edit | Smallest source change at cause; preserve API and parallel implementations | Non-empty diff by track deadline | Patch usually small; no gold-size target |
| 6. Verify | Named targeted test or one minimal repro/compile; one evidence-driven correction | Pass/fail signature; no environment repair | Test output tail ≤1200 |
| 7. Review/submit | `git status --short && git diff`; remove scratch/debug/test edits; confirm source-only intent | Clean non-empty patch, then `submit_patch` | Diff review ≤2K typical |

\*Token policies are engineering ceilings for drafting, **not tokenizer measurements**. Measure with the exact chat template/tool schemas during P0; Appendix H gives a 32K allocation.

#### 7.2 Draft shared prompt fragment

```text
You are an autonomous repository repair agent. Treat the issue's exact public behavior as the specification, not as an example to hardcode.

Before tools: record exact symbols/messages/types, trigger, expected result, edge cases, and whether this is a bug, feature, compatibility change, or executable-docs change. Choose a generic archetype; load at most one family skill when its trigger matches.

Locate by exact path or fixed-string identifiers. If that fails, use bounded lexical file/symbol search. Use a graph tool only when you can state the node and caller/callee question it will answer. Do not seed retrieval from embeddings alone.

Read the causal implementation and one caller, test, or sibling. Make the smallest source change that preserves unrelated behavior. Never edit tests or repair the environment. Put scratch files outside the repository. For parallel sync/async, security, registration, or export paths, change every path implicated by evidence—not every path that looks similar.

Run one named targeted test or minimal reproduction. If it fails, make one different, evidence-driven correction. Never repeat an identical tool call after an unchanged result. Review git status and the complete diff for test edits, scratch files, debug output, unrelated churn, and missing source changes. Submit a non-empty patch before the budget expires.
```

#### 7.3 Shared loop breakers and integrity invariants

- **Repeated call:** hash normalized tool name + arguments + result signature; two identical no-progress calls force a different action or final review.
- **Search ceiling:** at most two unsuccessful query reformulations before editing the best-supported candidate.
- **Edit failure:** after two exact-match failures, reread the region and use a uniqueness assertion; never rewrite a whole file from memory.
- **Verification ceiling:** one targeted rerun after a correction; no bare full-suite run.
- **No-progress timeout:** reserve final review/submission unconditionally; a best-supported wrong patch and an empty tree both require postmortem, but only the former exposes repairable behavior for evaluation.
- **Integrity:** no instance-ID answer tables, no hidden-test discovery, no network dependency, no test patch edits, no benchmark-specific environment manipulation.

### 8. Track A — Gemma 4 31B

#### 8.1 Shell specification

The 31B shell is a single root `LlmAgent` with a staged prompt and conditional decomposition. It may create an internal three-part plan for cross-layer features—producer, consumer, compatibility—but does not require a separate planner agent. An optional read-only reviewer sub-agent can inspect the final diff only after the main agent has a tested patch and at least 45 seconds/three calls remain; it is excluded from the baseline because sub-agent contract and marginal value are unverified.

| Component | 31B starting hypothesis | Abort/adaptation rule |
|---|---|---|
| Retrieval | Up to two lexical batches; one graph expansion for a concrete caller/callee question | Stop localization at call 8 or when one causal file + one corroborating source is read |
| First edit | By call 12 and soft time 2:30 | Edit best-supported site; do not keep reading for certainty |
| Verification | Calls 13–22; one correction cycle | No new exploration after call 22 unless a traceback names a different causal file |
| Review | Calls 23–28; final 45 seconds reserved | Reviewer only if contract-probed and budget remains |
| Sampling | temperature 0.2, top-p 0.95, max output 6144, thinking 4096 | Ablate against 0.7/1.0; reduce thinking if timeouts dominate |
| Eval ceiling | 28 calls, 6 minutes, 80 turns, command timeout 240 s | Internal target ≤5:15 average; 6-minute cap leaves no global slack if every task uses it |
| Adapter | One `main_lora`, optional second wave | Reject on held-out PASS regression, >5% repetition increase, or adapter binding mismatch |

#### 8.2 Per-family 31B policy

| Family | Retrieval/effort policy | Artifact loaded | Abort or simplify when |
|---|---|---|---|
| F-01 | Use a two-pass dependency/schema trace when scopes cross layers; compare the nearest security sibling and inspect generated OpenAPI only after runtime behavior is understood. | `skills/fastapi-request-security/SKILL.md` plus a compact RFC/OAuth checklist. | Two reads fail to identify the producer/consumer or state owner; take the best local hypothesis. |
| F-02 | Allocate extra exploration for the compatibility facade and public re-exports; use a reviewer pass for dangling references and warning emission frequency. | `repo_navigation/resources/fastapi-version-matrix.md`; normally no standalone skill. | Broad diff exceeds two evidence-backed files; preserve a minimal patch and submit rather than migrating by memory. |
| F-03 | Use a small dependency-tree trace for scope tasks and a callable metadata table for wrappers; inspect both models and utils when the first file does not explain identity. | `skills/fastapi-dependant-analysis/SKILL.md` with a callable/annotation decision table. | Two reads fail to identify the producer/consumer or state owner; take the best local hypothesis. |
| F-04 | Read the corresponding docs page and test import to infer intended user-visible behavior; inspect script sibling helpers before a narrow automation edit. | `repo_navigation/resources/executable-docs-and-automation.md`, not a model-triggered skill by default. | Two reads fail to identify the producer/consumer or state owner; take the best local hypothesis. |
| F-05 | Trace the full exception lifecycle before editing and compare OpenAPI/runtime channels separately. | `skills/fastapi-error-contract/SKILL.md` with an error-channel table. | Two reads fail to identify the producer/consumer or state owner; take the best local hypothesis. |
| F-06 | Generate a compact before/after schema excerpt and inspect model/security provenance; spend a second read on cross-layer scope cases. | `skills/fastapi-openapi-composition/SKILL.md` with object/scope/escape checklists. | Two reads fail to identify the producer/consumer or state owner; take the best local hypothesis. |
| F-07 | Read the dependant construction and extraction helper together; check whether the same helper serves Query, Form, and Header before changing shared behavior. | `skills/fastapi-request-extraction/SKILL.md`; this is a first-wave artifact for both tracks. | One causal file and one corroborating test/sibling are known; do not expand. |
| F-08 | Inspect a minimal generated-schema diff and the model-name map; use deeper reasoning for nested input/output separation and union metadata. | `skills/fastapi-pydantic-v2-schema/SKILL.md` with a model/transformation pipeline. | Two reads fail to identify the producer/consumer or state owner; take the best local hypothesis. |
| F-09 | Use sequence reasoning across middleware/routing and inspect both response and dependency cleanup; reserve more calls for the SSE feature family. | `skills/fastapi-response-lifecycle/SKILL.md` plus an SSE/ASGI sequence resource. | Two reads fail to identify the producer/consumer or state owner; take the best local hypothesis. |
| F-10 | Allow a wider architecture trace for route-context and new API tasks; use a final registration/identity audit. For narrow self-inclusion or empty-path tasks, stay minimal. | `skills/fastapi-routing-lifecycle/SKILL.md` with route-object and lifespan checklists. | Broad diff exceeds two evidence-backed files; preserve a minimal patch and submit rather than migrating by memory. |
| F-11 | Read exporter and one console caller; reason about CSS selector specificity before editing. | `repo_navigation/resources/rich-export-contract.md`; generic minimal-patch loop plus one CSS checklist. | One causal file and one corroborating test/sibling are known; do not expand. |
| F-12 | Use one call to inspect import relationships and one targeted import-time measurement; coordinate all affected modules before editing. | `repo_navigation/resources/rich-import-graph.md`; no dedicated runtime skill. | Broad diff exceeds two evidence-backed files; preserve a minimal patch and submit rather than migrating by memory. |
| F-13 | Read the state owner and one Console caller; model empty and noninteractive transitions explicitly. | `skills/rich-interactive-state/SKILL.md` with state-transition tables. | Two reads fail to identify the producer/consumer or state owner; take the best local hypothesis. |
| F-14 | Read the element stack and nearest sibling element; compare style and newline ownership before editing. | `skills/rich-markdown-composition/SKILL.md` with block/inline/context matrix. | One causal file and one corroborating test/sibling are known; do not expand. |
| F-15 | Inspect measure/render and regex match examples; check both option precedence and neighboring highlight patterns. | `skills/rich-syntax-and-highlights/SKILL.md` with measurement/style and regex boundary checks. | One causal file and one corroborating test/sibling are known; do not expand. |
| F-16 | Read construction and render paths together and compare a sibling container; inspect segment output for style alignment. | `skills/rich-layout-style-regions/SKILL.md` with region/style/phase table. | One causal file and one corroborating test/sibling are known; do not expand. |
| F-17 | Inspect configured stream and environment precedence, then one writer/reader path; use a state table for capture/record interactions. | `skills/rich-console-io/SKILL.md` with stream/capability/environment matrix. | Two reads fail to identify the producer/consumer or state owner; take the best local hypothesis. |
| F-18 | Trace both producer and consumer for shared Segment behavior; inspect invalidation points for style caches. | `skills/rich-text-segment-invariants/SKILL.md` with mutation/cache/iterator checks. | One causal file and one corroborating test/sibling are known; do not expand. |
| F-19 | Trace exception chain and source-location pipeline; inspect one standard-library contract before choosing a guard. | `skills/rich-safe-introspection/SKILL.md` with hostile-object and exception-chain checklist. | Two reads fail to identify the producer/consumer or state owner; take the best local hypothesis. |
| F-20 | Read the cluster/cell algorithm and one wrapper consumer; reason with minimal adversarial strings and inspect table versions only when needed. | `skills/unicode-cell-segmentation/SKILL.md` plus a versioned UAX #29/#11 resource; exclude generated data from prompt preload. | Two reads fail to identify the producer/consumer or state owner; take the best local hypothesis. |
| F-21 | Read helper and one caller to confirm precedence, then make the local guard. | `repo_navigation/resources/requests-auth-precedence.md`; no dedicated skill needed for one task. | One causal file and one corroborating test/sibling are known; do not expand. |
| F-22 | Inspect both compatibility branches and one consumer; validate the RFC mapping independently. | `repo_navigation/resources/http-version-compat.md` with status/feature-detection checks. | One causal file and one corroborating test/sibling are known; do not expand. |
| F-23 | Inspect both typing and runtime body paths and compare sibling dynamic-wrapper fixes. | `skills/requests-duck-type-boundaries/SKILL.md`, shared with F-25. | Two reads fail to identify the producer/consumer or state owner; take the best local hypothesis. |
| F-24 | Use a lifecycle trace across all seven HTTPX modules and reserve more budget; Requests history remains a small direct fix. | `skills/http-connection-lifecycle/SKILL.md` with redirect-list and keep-alive state machines. | Broad diff exceeds two evidence-backed files; preserve a minimal patch and submit rather than migrating by memory. |
| F-25 | Trace prepare_body and multipart encoding together; inspect stream state before/after length calculation. | `skills/requests-body-encoding/SKILL.md` shared with F-23. | One causal file and one corroborating test/sibling are known; do not expand. |
| F-26 | Read parser and caller plus exception constructor signature; verify all state fields survive a round trip. | `repo_navigation/resources/requests-parsing-exceptions.md`. | One causal file and one corroborating test/sibling are known; do not expand. |
| F-27 | Trace the full URL pipeline and inspect dependency-version conditionals; test host boundaries independently. | `skills/requests-url-proxy-boundaries/SKILL.md` with URL pipeline and host-match table. | One causal file and one corroborating test/sibling are known; do not expand. |

The highest-leverage 31B change is **a hard budgeted patch-and-verify spine with lexical-first retrieval**. More elaborate planning is justified only for broad features; the measured loss profile includes wrong patches and timeouts, so preserving the last correction/review window is more credible than adding agents.

### 9. Track B — Gemma 4 E4B

#### 9.1 Shell specification and simplifications

E4B receives a shorter instruction hierarchy, fewer options, and more deterministic control. It does not use a planner or reviewer sub-agent. It chooses from six archetypes, loads a compact checklist only on an exact trigger, and writes a five-field localization/spec table before its first search. The shell intentionally sacrifices broad exploration to reduce wrong-file wandering and repeated calls.

| Component | E4B starting hypothesis | Abort/adaptation rule |
|---|---|---|
| Retrieval | One exact search + one lexical fallback; graph only after a named symbol exists | Stop at call 6; no open-ended semantic search |
| First edit | By call 8 and soft time 1:45 | Use best-supported single-site edit |
| Verification | Calls 9–15; one correction | No second retry unless the first test was unexecutable |
| Review/finish | Calls 16–20; final 30 seconds reserved | Any repeated call/no-progress loop jumps to diff review |
| Sampling | temperature 0.1, top-p 0.95, max output 4096, thinking 2048 | Ablate 0.2; increase thinking only if wrong-fix dominates and time remains |
| Eval ceiling | 20 calls, 5 minutes, 60 turns, command timeout 180 s | Internal target ≤4:00 average; global budget still governs |
| Adapter | One conservative unified SFT adapter | Reject on any catastrophic loop/timeout signature, even if NLL improves |

#### 9.2 Per-family E4B policy

| Family | Simplification and priority | Artifact loaded | Abort or simplify when |
|---|---|---|---|
| F-01 | **Selective.** Force a four-row checklist—credential input, status, parsed value, scopes—and edit the first extraction/helper site before exploring OpenAPI. Limit to one caller and one parallel security class. | `skills/fastapi-request-security/SKILL.md` plus a compact RFC/OAuth checklist. | No second exploration branch after a failed test; submit best clean patch. |
| F-02 | **Late/narrow only.** Avoid broad removal tasks unless the statement gives a narrow symbol; prefer warning-category tasks and make one facade-local change. Do not attempt a many-file migration from memory. | `repo_navigation/resources/fastapi-version-matrix.md`; normally no standalone skill. | No second exploration branch after a failed test; submit best clean patch. |
| F-03 | **Early.** Use a fixed six-field callable table and restrict the search to models/utils. For cache tasks, require a written key tuple in the working notes before editing; avoid speculative multi-file scope redesign. | `skills/fastapi-dependant-analysis/SKILL.md` with a callable/annotation decision table. | No second exploration branch after a failed test; submit best clean patch. |
| F-04 | **Early.** Direct path from the statement, one file read, literal replacement or minimal control-flow fix. Skip broad documentation research. | `repo_navigation/resources/executable-docs-and-automation.md`, not a model-triggered skill by default. | No second exploration branch after a failed test; submit best clean patch. |
| F-05 | **Selective.** Use the four-stage table and one exception sibling; avoid broad framework-version migration work. | `skills/fastapi-error-contract/SKILL.md` with an error-channel table. | No second exploration branch after a failed test; submit best clean patch. |
| F-06 | **Selective.** Require the exact OpenAPI object name before search; choose one producer function and one regression example. Avoid global normalization helpers. | `skills/fastapi-openapi-composition/SKILL.md` with object/scope/escape checklists. | No second exploration branch after a failed test; submit best clean patch. |
| F-07 | **Early.** Use the five-column extraction table verbatim and limit context to one function plus its direct caller. This family should receive early-edit priority and minimal graph use. | `skills/fastapi-request-extraction/SKILL.md`; this is a first-wave artifact for both tracks. | No second exploration branch after a failed test; submit best clean patch. |
| F-08 | **Early.** Force the four-stage pipeline and one Pydantic sibling hook. Prefer the smallest `_compat/v2.py` change; do not roam into OpenAPI unless the generated schema is already correct there. | `skills/fastapi-pydantic-v2-schema/SKILL.md` with a model/transformation pipeline. | No second exploration branch after a failed test; submit best clean patch. |
| F-09 | **Selective.** Prefer narrow serialization/validation tasks. For streaming lifetime, use the four-stage sequence and edit only the exit-stack handoff; defer broad SSE feature implementation unless statement and sibling API are unusually explicit. | `skills/fastapi-response-lifecycle/SKILL.md` plus an SSE/ASGI sequence resource. | No second exploration branch after a failed test; submit best clean patch. |
| F-10 | **Late/narrow only.** Split tasks into narrow bug versus broad API. Take narrow bugs early; for broad APIs, copy the nearest decorator/registration skeleton and avoid inventing internal abstractions. | `skills/fastapi-routing-lifecycle/SKILL.md` with route-object and lifespan checklists. | No second exploration branch after a failed test; submit best clean patch. |
| F-11 | **Early.** Direct file from issue/export symbol, inspect template only, make a literal CSS/template correction and skip terminal subsystems. | `repo_navigation/resources/rich-export-contract.md`; generic minimal-patch loop plus one CSS checklist. | No second exploration branch after a failed test; submit best clean patch. |
| F-12 | **Late/narrow only.** Treat as low-priority broad work. Unless the statement isolates one symbol, make only the safest single lazy-import change rather than attempting the full upstream refactor. | `repo_navigation/resources/rich-import-graph.md`; no dedicated runtime skill. | No second exploration branch after a failed test; submit best clean patch. |
| F-13 | **Early.** Use a three-state table and one targeted state test; avoid terminal-wide changes. | `skills/rich-interactive-state/SKILL.md` with state-transition tables. | No second exploration branch after a failed test; submit best clean patch. |
| F-14 | **Early.** Fill the four-field matrix, choose one element class, and avoid global table/style edits. | `skills/rich-markdown-composition/SKILL.md` with block/inline/context matrix. | No second exploration branch after a failed test; submit best clean patch. |
| F-15 | **Early.** Use direct `syntax.py` versus `highlighter.py` routing and test three literal strings before editing; keep patch tiny. | `skills/rich-syntax-and-highlights/SKILL.md` with measurement/style and regex boundary checks. | No second exploration branch after a failed test; submit best clean patch. |
| F-16 | **Early.** Use the region table and one construction/render path only; direct file routing is reliable in this family. | `skills/rich-layout-style-regions/SKILL.md` with region/style/phase table. | No second exploration branch after a failed test; submit best clean patch. |
| F-17 | **Early.** Use explicit presence-versus-value checks and one Console method. Avoid deep terminal backend exploration unless the statement names it. | `skills/rich-console-io/SKILL.md` with stream/capability/environment matrix. | No second exploration branch after a failed test; submit best clean patch. |
| F-18 | **Early.** Use direct file routing and one invariant sentence before editing; avoid touching Unicode width tables unless the issue explicitly concerns cells. | `skills/rich-text-segment-invariants/SKILL.md` with mutation/cache/iterator checks. | No second exploration branch after a failed test; submit best clean patch. |
| F-19 | **Early.** Apply visited-identity and identity-sentinel rules mechanically; read only the relevant introspection function and one caller. | `skills/rich-safe-introspection/SKILL.md` with hostile-object and exception-chain checklist. | No second exploration branch after a failed test; submit best clean patch. |
| F-20 | **Early.** Use a four-row example table—input, cluster count, cell width, next offset—and require a progress assertion in the proposed logic. Avoid generated-data tasks. | `skills/unicode-cell-segmentation/SKILL.md` plus a versioned UAX #29/#11 resource; exclude generated data from prompt preload. | No second exploration branch after a failed test; submit best clean patch. |
| F-21 | **Early.** Direct helper search and a two-case truth table; one small edit and targeted check. | `repo_navigation/resources/requests-auth-precedence.md`; no dedicated skill needed for one task. | No second exploration branch after a failed test; submit best clean patch. |
| F-22 | **Early.** Use a version/API table and minimal import guard; direct file routing. | `repo_navigation/resources/http-version-compat.md` with status/feature-detection checks. | No second exploration branch after a failed test; submit best clean patch. |
| F-23 | **Early.** Use the three-object test set and one protocol/helper at a time; avoid rewriting the type module broadly. | `skills/requests-duck-type-boundaries/SKILL.md`, shared with F-25. | No second exploration branch after a failed test; submit best clean patch. |
| F-24 | **Late/narrow only.** Take Requests redirect first. On HTTPX, avoid an ungrounded seven-file rewrite; trace one failing transition and mirror only a proven sync/async sibling. | `skills/http-connection-lifecycle/SKILL.md` with redirect-list and keep-alive state machines. | No second exploration branch after a failed test; submit best clean patch. |
| F-25 | **Early.** Use the byte-length rule and three-object behavior test; prioritize this family for early compact edits. | `skills/requests-body-encoding/SKILL.md` shared with F-23. | No second exploration branch after a failed test; submit best clean patch. |
| F-26 | **Early.** Use a field checklist and minimal parser guard; avoid redesigning content-type parsing. | `repo_navigation/resources/requests-parsing-exceptions.md`. | No second exploration branch after a failed test; submit best clean patch. |
| F-27 | **Early.** Use direct adapter/utils routing and a four-case host/path table; make one local normalization/match correction. | `skills/requests-url-proxy-boundaries/SKILL.md` with URL pipeline and host-match table. | No second exploration branch after a failed test; submit best clean patch. |

The highest-leverage E4B change is **wrong-trajectory suppression**: direct localization templates, early edit, repeated-call detection, and conservative SFT selected on trajectory health. Increasing maximum calls is not the default remedy for a model already wasting calls.

### 10. Divergence table and expected-score reasoning

#### 10.1 Component-level divergence

| Component | 31B | E4B | Justification/effect | Confidence | Invalidation condition |
|---|---|---|---|---|---|
| Agent tree | Single root; optional late reviewer | Single root only | Avoid orchestration overhead for weaker control | Medium | Reviewer yields paired PASS gain without time regression |
| Plan | Conditional three-stage internal plan | Fixed short loop | Match reasoning/control delta | Medium-High | E4B plan ablation reduces wrong-file rate enough to justify cost |
| Retrieval seed | Exact + lexical | Exact + lexical | Same measured retrieval reality | High | A new harness tool shows reproducible superior PASS/localization |
| Graph use | One bounded expansion | Rare, named-node only | E4B map-tool use/benefit weak in public study | Medium-High | Graph hints beat lexical on frozen paired tasks |
| Family routing | One skill + broader resource | One compact checklist | Reduce context and choices | Medium | Compact resource omits behavior needed for a family |
| First edit | Call 12 / 2:30 | Call 8 / 1:45 | E4B wrong-file/repetition risk | Medium | Earlier edit raises wrong-fix more than it reduces no-patch |
| Calls | 28 | 20 | Starting budgets, not official constants | Low-Medium | Measured marginal calls produce net new passes |
| Time cap | 6 min; 5:15 internal target | 5 min; 4:00 internal target | Protect 12-hour aggregate | Medium | Actual task count/parallelism/wall-clock accounting differs |
| Output/thinking | 6144 / 4096 | 4096 / 2048 | Budget for deeper 31B reasoning | Low-Medium | Timeout or truncation telemetry dictates otherwise |
| Temperature | 0.2 start | 0.1 start | Conservative patch generation; not official optimum | Low | Paired sampling ablation favors another value |
| Verification | One correction + optional review | One correction only | E4B loop suppression | Medium | Extra correction yields significant paired gains |
| Broad features | Conditional cross-file work | Narrow/sibling-mirror only | Avoid ungrounded migrations | Medium-High | E4B demonstrates reliable broad feature synthesis |
| Adapter | Main unified SFT/repair | Conservative unified SFT/distillation | Different plasticity/failure profile | Medium | Contract forbids or adapter regresses held-out PASS |
| Proxy evaluation | Final 31B runs required | Qualitative proxy for 31B only | Limited proxy validity | High | A validated cross-model rank correlation is established |
| Highest leverage | Preserve verify/correct time | Stop wrong/repeated trajectories | Dominant observed losses differ | Medium-High | Frozen per-family failure counts identify another dominant loss |

#### 10.2 Expected-score arithmetic and sensitivity

No defensible hidden-score point forecast exists. The planning intervals below are scenario arithmetic over approximately 120 hidden tasks, not confidence intervals or claims about the leaderboard. The latest community local measurements—39.5% for 31B and 15.5% for E4B—anchor the upper/middle scenarios, while hidden distribution, harness fidelity, and public-set overfit justify substantial discounts ([Fatu results](https://github.com/fatu/gemma4-dev-agent/blob/main/RESULTS.md)).

| Track | Conservative scenario | Planning scenario | Favorable scenario | Dominant sensitivity |
|---|---:|---:|---:|---|
| 31B | 20% → 24/120 | 30% → 36/120 | 40% → 48/120 | One task per 0.833 percentage point; wrong-patch rate and per-task time |
| E4B | 8% → 10/120 | 12% → 14/120 | 18% → 22/120 | Localization/no-progress loops; broad-task abandonment |

A one-point change on 58 public-leaderboard tasks is one task = **1.72 points**, before stochastic rerun variance. This is why a notebook’s small score delta cannot establish causality. Use the planning ranges for capacity allocation only; the submit-one-vs-both decision must use frozen paired local outcomes and actual official smoke results.

## Part III — Implementation

### 11. Submission blueprint

#### 11.1 Archive inventory

The following is a **design inventory**, not a generated archive. Root `agent.yaml` is supported by official search-visible competition material and public sample configurations; optional paths must be checked against the actual starter package. Do not place a second nested `agent.yaml` inside a directory and assume it will be found.

| Path | Purpose/content sketch | Prompt/token cost | Track | Readiness |
|---|---|---:|---|---|
| `agent.yaml` | Root `LlmAgent`, exact model, prompt/config includes, exposed tools | Tool schemas dominate; YAML itself small | Both | IR-B |
| `prompts/system.md` | Track shell + shared kernel + budget state machine | 31B 900–1300; E4B 600–900 estimated | Both | IR-A/C |
| `configs/sampling.yaml` | Temperature/top-p/output/thinking start values | No recurring text cost | Both | IR-B/C |
| `eval_config.yaml` | Per-task ceilings; verify whether `evaluation:` wrapper is required | None | Both | IR-B/C |
| `skills/repo-navigation/SKILL.md` | ADK-compliant name; lexical-first route and graph-assist rules | L1 ≤250; L2 500–800 when loaded | Both | IR-B/C |
| `skills/fastapi-request-extraction/SKILL.md` | First-wave F-07 decision table | 400–650 when loaded | Both | IR-A/C |
| `skills/fastapi-dependant-analysis/SKILL.md` | F-03 callable/scope table | 500–800 | 31B full; E4B compact | IR-A/C |
| `skills/fastapi-pydantic-v2-schema/SKILL.md` | F-08 model/schema pipeline | 500–800 | Both | IR-A/C |
| `skills/rich-text-rendering/SKILL.md` | Consolidated F-14–F-18 routing/invariants | 600–900 | Both | IR-A/C |
| `skills/unicode-cell-segmentation/SKILL.md` | F-20 UAX-guided progress/width checks | 500–800 | Both | IR-A/C |
| `skills/requests-http-boundaries/SKILL.md` | Consolidated F-21–F-27 HTTP/body/URL checks | 500–800 | Both | IR-A/C |
| `repo_navigation/resources/*.md` | Version matrices and compact normative notes; no full docs | Load on demand only | Both | IR-A |
| `repo_navigation/scripts/` | Specifications for read-only locate/test/diff helpers; actual implementation is follow-on work | Output caps 400–1200 | Optional | IR-B/C |
| `sub_agents/reviewer.yaml` | Optional final diff reviewer | Additional model call/context | 31B only, second wave | IR-C |
| `adapters/main_lora/` | `adapter_config.json` + `adapter_model.safetensors`, exact base | Runtime binding, not prompt tokens | Optional both | IR-B/C |
| `adapters/tool_lora/` | Optional separate tool-policy adapter | Additional binding complexity | Not baseline | IR-D |

**Skill-layout caution.** ADK requires lowercase kebab-case skill names, ≤64 characters, nonempty descriptions ≤1024 characters, and a directory name matching frontmatter. Therefore a `repo_navigation/` directory with an underscore must not automatically be registered as an ADK Skill named `repo_navigation`; use `skills/repo-navigation/` for ADK and retain `repo_navigation/` only if the competition’s custom layout defines it separately ([ADK Skills](https://adk.dev/skills/)).

#### 11.2 Annotated `agent.yaml` skeleton

```yaml
# Public configurations use this root shape; validate against the official starter.
agent_class: LlmAgent
name: gemma_swe_agent
model: gemma-4-31b-it-qat-w4a16-ct  # E4B archive uses its exact E4B identifier.
instruction: !include prompts/system.md

tools:
  # Core tools reported consistently in public configurations.
  - run_command
  - read_file
  - edit_file
  - write_file
  - get_status
  - submit_patch
  # Expose graph tools only after their runtime schemas/behavior are probed.
  - get_code_neighbors
  - search_similar_code
  - get_code_subgraph
  # Do not invent load_skill/run_skill_script entries: use the starter's syntax.

generate_content_config: !include configs/sampling.yaml
# adapter: main_lora  # Uncomment only after binding and held-out PASS gates.
# sub_agents:         # Optional 31B second wave; exact syntax is probe-gated.
```

A public retrieval-benchmark configuration uses this nine-tool list and the same `!include` pattern, while another community configuration uses the same core tool names. This agreement raises confidence in the shape but does not prove the current official schema ([public benchmark](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark), [Fatu](https://github.com/fatu/gemma4-dev-agent)).

#### 11.3 `repo_navigation/` script and resource contracts

No production scripts are supplied here. Each follow-on implementation must be standard-library-only where practical, read-only unless explicitly an edit helper, network-free, bounded in output, and safe under `/workspace`; scratch state belongs outside the repository. A nonexistent script must never become a hidden dependency of the prompt.

| Contract name | Inputs | Output (capped) | Must not do |
|---|---|---|---|
| `locate_symbol` | Fixed string/regex, optional path/glob | Up to 20 `file:line:symbol` matches | Build a new graph, walk `.git`, dump whole files |
| `find_tests` | Source path and/or issue keywords | Up to 10 ranked existing test files | Modify tests or infer hidden tests |
| `read_regions` | Up to three `path:start:end` regions | Numbered source regions, ≤160 lines total | Read outside workspace or dump large generated files |
| `run_targeted_test` | Exact existing test path, optional `-k`, timeout | Exit code + last 40 lines + failure signature | Bare full suite, environment installation, test edits |
| `review_diff` | None | Status, diff stat, source/test/scratch/debug warnings | Auto-“fix” tests or delete user/source work |
| `call_ledger` | Normalized tool-call/result record | Repeated-call/no-progress signal and budget state | Persist inside repository or make model decisions autonomously |

Resource inventory: `fastapi-version-matrix.md`, `fastapi-error-contract.md`, `fastapi-openapi-objects.md`, `fastapi-response-lifecycle.md`, `rich-console-environment.md`, `rich-import-graph.md`, `unicode-width-grapheme-notes.md`, `requests-auth-precedence.md`, `http-version-compat.md`, and `license-provenance.md`. Every resource states upstream URL/version/access date and contains decision rules, not copied documentation chapters.

#### 11.4 Per-track evaluation and sampling configurations

```yaml
# 31B starting hypothesis — wrapper and fields must be probe-validated.
evaluation:
  timeout_seconds: 240
  max_tool_calls: 28
  max_time_minutes: 6
  max_turns: 80
```

```yaml
# E4B starting hypothesis — shorter to suppress low-value wandering.
evaluation:
  timeout_seconds: 180
  max_tool_calls: 20
  max_time_minutes: 5
  max_turns: 60
```

```yaml
# 31B sampling start: community-inspired low temperature, not an official optimum.
temperature: 0.2
top_p: 0.95
max_output_tokens: 6144
thinking_config:
  thinking_budget: 4096
  include_thoughts: true
```

```yaml
# E4B sampling start: low-temperature/compact hypothesis for paired ablation.
temperature: 0.1
top_p: 0.95
max_output_tokens: 4096
thinking_config:
  thinking_budget: 2048
  include_thoughts: true
```

One public benchmark omits the `evaluation:` wrapper while a later community arm includes it; exact field names such as `max_output_tokens`, `thinking_budget`, and `include_thoughts` likewise require starter validation. These are not claimed official constants. If only integer minute caps are accepted, use the shown values; if fractional caps are accepted, evaluate a 5.5-minute 31B ceiling after global wall-clock calibration.

#### 11.5 Edit-and-verify loop specification

1. **Localize to a cause.** Record primary file/symbol and corroborating caller/test/sibling. Do not confuse where an error is observed with where wrong behavior is produced.
2. **State compatibility.** Write the behavior that must remain unchanged, including defaults, signatures, sync/async parity, public exports, and exact messages.
3. **Make one minimal patch.** Prefer existing-file `edit_file`; use `write_file` only for a genuinely new required source file. Never edit `tests/`, test configuration, or validation patches.
4. **Run a named oracle.** Use one existing targeted test with `-k` where possible. If no oracle is executable, run one inline reproduction or compile check. Do not install packages or repair unrelated fixtures.
5. **Correct once from evidence.** A relevant traceback can change the hypothesis; a generic failure cannot justify random additional edits. Never repeat the same call and expect a new result.
6. **Audit the artifact.** `git status --short && git diff` must show only intended source/executable-docs changes, no scratch files, debug prints, line-ending churn, or generated data unless explicitly required.
7. **Submit before expiry.** Call `submit_patch`; record status and actual changed files. A post-submit prose summary is optional and must not consume the final budget.

#### 11.6 Statement-preprocessing specification

The model receives noisy upstream PR-style text. It should not “clean” the statement by deleting unusual requirements. It should extract: **(a)** literal API/file/function/class names; **(b)** exact exception types/messages and output strings; **(c)** trigger and minimal reproduction; **(d)** expected behavior; **(e)** edge cases—`None`, empty, duplicates, Unicode, wrappers, aliases, scopes, stream closure; **(f)** compatibility constraints; **(g)** work intent; **(h)** unresolved ambiguity and the most literal interpretation. The oracle hierarchy is statement + current repository contract → existing tests/siblings → normative standards → upstream history. Present-day upstream behavior must not override a pinned base commit.

### 12. Post-training recipe (summary)

#### 12.1 Cost/benefit verdict and division of labor

**Scaffold first.** Prompts/resources encode stable contracts, budget policy, repository maps, and normative checklists; they are inspectable and cheap to ablate. **Adapters second.** Training targets action selection under the exact tool grammar: concise localization, valid tool calls, early patch, evidence-driven retry, stopping, and avoidance of repeated/no-progress behavior. It should not teach instance answers, current upstream trivia, or giant patch recall.

| Track | Potential benefit | Principal risk | Verdict |
|---|---|---|---|
| 31B | Medium: improve consistency and recover avoidable tool/edit failures on an already stronger base | Adapter can erase strong general reasoning or shift quantization behavior | Run one unified SFT experiment only after no-adapter baseline; reject unless paired PASS improves |
| E4B | High potential: control failures are a large fraction of loss | High: public adapters have caused loops/timeouts; small gains were non-significant | Conservative SFT/distillation may be worthwhile, but trajectory health is a hard gate |

Official Transformers documentation says compressed-tensors supports PEFT fine-tuning; it also distinguishes compressed execution from `dequantize=True` dense execution ([Transformers](https://huggingface.co/docs/transformers/en/quantization/compressed_tensors)). This makes a QAT-base adapter experiment plausible, not automatically validated for Gemma 4 on 24 GB. Do not substitute bitsandbytes NF4 and assume equivalence with the checkpoint’s `compressed-tensors` `pack-quantized` format.

#### 12.2 Data schema and construction

```json
{
  "example_id": "stable-content-hash",
  "source": "public-dev-or-permissive-upstream",
  "repo": "owner/name",
  "base_commit": "pinned-sha",
  "family_or_archetype": "F-07|boundary-semantics|generic",
  "license": "MIT|BSD-3-Clause|Apache-2.0",
  "split": "train|dev|family_holdout|repo_holdout|final_holdout",
  "messages": [{"role": "system|user|assistant|tool", "content": "...", "tool_calls": []}],
  "budget_state": {"calls_used": 0, "seconds_used": 0},
  "action_type": "locate|read|edit|verify|correct|review|submit",
  "teacher": "31B-filtered-trajectory|human-authored-rule",
  "outcome": {"validation_pass": true, "patch_files": 1, "repeated_calls": 0},
  "contamination": {"instance_excluded": true, "patch_hash_excluded": true}
}
```

- Use public gold patches only as **training targets on the training partition**, never as evaluation inputs or hidden-test claims. Do not include `test_patch` in the model’s problem input.
- Generate teacher trajectories with the same chat/tool template, then filter by actual validation, minimal clean diff, no test edits, and healthy call/time profile. Distill actions and concise rationales, not private verbose chain-of-thought.
- Include failed-trajectory repair pairs: repeated search → different query; wrong file → caller-guided relocation; failed exact edit → reread/unique replacement; no-patch near deadline → immediate best edit; test failure → one causal correction.
- Balance by archetype/family rather than raw patch tokens. Exclude generated Unicode tables and bulk migrations from generic SFT; cap any one family at 20% of examples and reserve at least 30% generic/unseen-repository examples.
- Deduplicate on instance ID, PR URL, base commit, normalized issue text, and patch hash. Keep family and repository holdouts frozen before teacher generation. Record all source licenses.

#### 12.3 Objectives, distillation, and checkpoint selection

Start with supervised fine-tuning on validated action trajectories. For E4B, compare direct SFT against 31B-teacher distillation under the **same E4B shell and tool schemas**; do not distill a deep 31B plan that E4B cannot execute within its call budget. A lightweight second stage can optimize pairwise preferences between validated and failed/repetitive next actions. RL is optional third-wave research, not a baseline requirement.

A future RL/preference reward may combine validation PASS, targeted-test progress, valid tool schema, clean source-only diff, and early submission, with penalties for test edits, invalid patch, repetition, timeout, and unrelated churn. Never optimize gold-patch textual similarity as the sole reward: multiple patches can be correct. Checkpoint selection uses frozen held-out agent PASS, McNemar discordances, wrong-file rate, repeated-call rate, no-patch rate, timeout rate, and patch cleanliness; held-out NLL is diagnostic only.

#### 12.4 Initial LoRA recipe and 24-GB gates

Use gradient checkpointing, microbatch 1, gradient accumulation 16, BF16 adapter/master compute where supported, attention/MLP projections only, no embeddings/PLE/lm_head targets, and sequence lengths 2048–4096 before any longer-context experiment. Start 31B at rank 16 and E4B at rank 8–16; sweep only after the baseline data recipe is stable. The full matrix is Appendix I.

The 24-GB process must pass: exact compressed-tensors load; nonempty adapter target report; forward/backward smoke at sequence 512 then 2048; saved/reloaded adapter tensor mapping; vLLM adapter binding; and a base-versus-adapter logit/output difference check. If any fails, stop rather than silently training a no-op. A BF16 31B full-model training path is not assumed to fit 24 GB.

### 13. Evaluation methodology

#### 13.1 Local harness fidelity and gold baseline

Use two phases. **Phase 1 (agent):** fresh base commit, exact model/adapter, tool parsers, served context, sampling, task statement, budget, and no network; capture the working-tree patch. **Phase 2 (validation):** clean base commit in a fresh container, apply agent patch then the task’s validation test patch, install only the pinned environment, and run the exact validation selection. Record infrastructure outcomes separately from model failures.

Before comparing agents, apply every public reference patch in the same validator. Public reports conflict: an earlier account reported 109/129, a later Fatu strict-sandbox audit 112/129 with 17 environment-defect tasks, and a separate faithful 33-task sandbox 33/33. These are different harnesses, not interchangeable universal baselines ([Fatu results](https://github.com/fatu/gemma4-dev-agent/blob/main/RESULTS.md), [Happy harness](https://github.com/happyc0der/gemma-swe-agent)). The local baseline is whatever the frozen validator actually reproduces; tasks whose gold fails are excluded from model-quality denominators and retained in an environment-defect report.

#### 13.2 Frozen splits and leave-one-family-out protocol

1. Freeze a stratified development/final split before prompt or teacher tuning; a public study used 45 development and 84 held-out tasks, which is a reasonable documented precedent, not a mandatory split ([Clavis study](https://github.com/clavis-systems/who-reads-the-code-map)).
2. Keep a per-task outcome ledger for every run. Never count repeated use of final holdout as independent confirmation.
3. For each of 27 folds, exclude the target family from prompt-resource selection, teacher traces, adapter training, and threshold tuning; train/tune on the others, then evaluate the held-out family once. Singleton families measure generic transfer, not family-specific learning.
4. Add repository holdouts—especially Requests/HTTPX—to test whether repository navigation is generic. HTTPX’s single task cannot support a repository-specific conclusion.
5. Report micro PASS (all eligible tasks), macro family PASS, per-repository PASS, and trajectory health. Macro family PASS prevents FastAPI’s 67 tasks from hiding failures in small families.

#### 13.3 Scorecard and noise floor

| Metric | Formula/use | Required display |
|---|---|---|
| PASS | Passed eligible tasks / eligible tasks | k/n, %, Wilson 95% interval |
| Paired delta | \((b-c)/n\), where b=A-only and c=B-only passes | b, c, delta, exact McNemar p |
| Discordant-noise approximation | \(\mathrm{SE}(\hat p_A-\hat p_B)\approx\sqrt{b+c}/n\) | q=b+c and approximate 95% half-width \(1.96\sqrt q/n\) |
| Family macro | Mean of 27 family pass rates | Also show family n; singleton intervals remain huge |
| Wrong localization | Wrong file or right file/wrong place | Count and % of failed tasks |
| Control health | Repeated calls, no patch, timeout, call-cap | Rates per run and per family |
| Patch hygiene | Test edits, scratch, debug, unrelated files | Count; any test edit is an integrity failure |
| Efficiency | Median/p90 seconds, calls, tokens | Per pass and per task |

Computed reference points: 51/129 = 39.5% with Wilson 95% **31.5–48.2%**; 20/129 = 15.5% with **10.3–22.7%**. For paired reruns with q=20 on 129 tasks, the approximate 95% delta half-width is **6.8 points**; q=40 gives **9.6 points**. On 58 tasks, q=12 gives **11.7 points** and q=20 gives **15.1 points**. These are planning approximations; report exact McNemar for actual paired comparisons.

#### 13.4 E4B-as-proxy on one 24-GB-class GPU

Use E4B to discover malformed tool calls, obvious prompt ambiguity, broken skill loading, and gross loop breakers. Keep the same 32K-or-lower context, chat template, tool parser, and task oracle where feasible; reduce served context if memory requires and record the difference. Do **not** use E4B to infer 31B absolute score, subtle sampling rankings, broad-feature competence, or optimal thinking budget. Final candidates require 31B runs on the closest attainable serving stack; 4×L4-specific throughput claims are competition-hardware-only.

#### 13.5 Run-log schema

```text
run_id, timestamp_utc, code_commit, submission_hash, model_id, base_digest,
adapter_digest, vllm_version, parser_versions, served_context, sampling,
eval_config, task_id, base_commit, family_version, split, start/end time,
calls, turns, input/output tokens, tool schemas returned, tool calls/results,
first_edit_call, test_commands/results, final_files, diff_lines, submit_status,
validation_status, infrastructure_status, failure_primary/secondary,
repeated_call_count, scratch/test_edit_flags, notes
```

### 14. Implementation roadmap

#### 14.1 Ordered phases

| Phase | Effort | Benefit | Dependencies and exit criterion |
|---|---:|---|---|
| P0 contract/harness probes | 4–8 h | Very high | Official starter accessible; archive/include/tool/eval/skill/adapter probe log complete; top unknowns resolved or isolated |
| P1 frozen validator + gold baseline | 8–16 h | Very high | Clean containers; gold eligibility denominator and environment defects frozen |
| P2 no-adapter 31B kernel | 8–12 h | Very high | One public smoke then full frozen dev; per-task outcomes and failure labels exist |
| P3 first-wave resources | 12–20 h | High | F-03/F-07/F-08 + Rich/Requests compact artifacts; one-at-a-time paired ablations |
| P4 E4B shell | 8–16 h | High for second track | Direct localization/loop breakers; same eligible tasks; no identical-prompt assumption |
| P5 retrieval/budget/sampling sweeps | 12–24 h | Medium-High | Only 2–3 preregistered comparisons; exact paired statistics; stop if deltas below noise |
| P6 unified SFT/distillation | 16–40 h + GPU | Uncertain | Data/contamination gates, 24-GB binding smoke, frozen family holdout, trajectory-health gate |
| P7 release candidate | 8–12 h | Very high | Full archive static checks, license manifest, clean final holdout, 12-hour aggregate dry run |

#### 14.2 First concrete week: 2026-11-02 through 2026-11-08

| Day | Numeric plan | Concrete next action |
|---|---|---|
| Mon 11-02 | 4 h | Obtain official starter/sample through legitimate access; freeze source/config hashes; run static archive and YAML/include probes. |
| Tue 11-03 | 6 h | Probe nine core tools and skill loaders on public smoke; record raw schemas, 32K served setting, and eval wrapper. |
| Wed 11-04 | 8 h | Build/freeze local validator; run gold baseline and classify environment defects. |
| Thu 11-05 | 8 h | Run no-adapter 31B kernel on a small stratified public smoke, then frozen dev; publish per-task ledger. |
| Fri 11-06 | 6 h | Label failures; implement only repeated-call, diff-hygiene, and deadline fixes justified by counts. |
| Sat 11-07 | 8 h | Ablate F-07 and F-03 resources separately; start E4B short-loop baseline on identical eligible tasks. |
| Sun 11-08 | 6 h | Review paired outcomes; freeze next week’s three comparisons; do not start SFT without data/holdout gates. |

By **2026-11-12**, the contract, baseline, and first-wave scaffold should be stable. By **2026-11-19**, complete track/resource comparisons and decide whether adapter work has a measured rationale. Use **2026-11-20 through 2026-11-24** for frozen holdout/release checks before the **2026-11-25 entry/team merger deadline**; reserve the final week before **2026-12-02** for validation, not new architecture ([Kaggle evaluation](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview/evaluation)).

#### 14.3 Submit one versus both

Prioritize 31B because its measured same-setting capability is substantially higher. Maintain E4B as an independent archive only if it passes contract checks and improves or matches its own frozen base without worse control health. Submitting both is rational only when independent final runs and the 12-hour aggregate budget are reproducible; otherwise one well-validated 31B candidate is preferable to two unvalidated architectures. This is an engineering readiness decision, not a leaderboard-manipulation strategy.

### 15. Failure taxonomy and counter-evidence

#### 15.1 Consolidated failure taxonomy

| Class | Detection signature | Brain response | Postmortem owner |
|---|---|---|---|
| Contract/schema | Archive rejected, include missing, unknown tool/field | Stop; fix against starter; never guess | P0 |
| Serving/parser | Empty thoughts/tool calls, malformed calls, context error | Verify Gemma 4 parsers/template, served length, output budget | P0/runtime |
| Wrong file | Patch outside causal surface; lexical candidates unrelated | Exact identifiers + caller/test corroboration | Localization |
| Right file/wrong place | Same module, unrelated helper/class | Trace producer/consumer or state owner | Localization |
| Spec omission | Missed literal status/message/edge/parallel path | De facto spec checklist | Statement analysis |
| Wrong fix | Tests/repro still fail; causal hypothesis unsupported | One evidence-driven correction; otherwise submit best clean patch | Synthesis |
| Partial fix | Sync only, one security sibling, missing export/registration | Parallel-surface checklist | Synthesis |
| Edit mechanics | old_string not found/multiple, whole-file churn | Reread, unique short match, assert count | Tool use |
| Verification misuse | Full suite, environment repair, tests edited | Named test only; restore integrity | Verification |
| Diff contamination | Scratch/debug/test files, generated noise | Status+diff review and cleanup | Final gate |
| No-progress loop | Same call/result, repeated planning | Hash ledger; force different action/finalize | Control |
| Timeout/no patch | First edit too late, excessive thinking/reads | Earlier edit and unconditional submit reserve | Budget |
| Environment defect | Gold also fails in frozen validator | Exclude from model denominator; report separately | Harness |
| Adapter collapse | NLL improves but loops/timeouts/invalid calls rise | Reject checkpoint; rollback to base | Training |
| Contamination/overfit | Family holdout or unseen repo collapses | Remove instance-specific content; retrain/revert | Data/eval |
| License/provenance | Missing license/attribution or restrictive vendored text | Exclude or replace with original concise notes | Release |

#### 15.2 Counter-evidence register

| Recommendation | Counter-evidence or failure mode | Decision safeguard |
|---|---|---|
| Lexical-first retrieval | Graph coverage is 96.3%; hybrid graph improves node BM25 R@20 from 47.7% to 53.3% | Keep bounded graph assist; re-evaluate on actual PASS, not ideology |
| Single-agent baseline | A planner/reviewer could help cross-layer features | Allow 31B reviewer only after paired evidence |
| Early first edit | Can lock in wrong file/fix | Require one corroborating read and permit traceback-driven relocation |
| Short E4B loop | More calls might let E4B recover | Increase only if marginal-call analysis shows new passes, not repeated calls |
| Family skills | Can overfit labels and consume context | One triggered skill, generic archetype fallback, leave-one-family-out |
| Low temperature | May reduce useful diversity on ambiguous tasks | Paired 0.1/0.2/0.7/1.0 ablations; no universal claim |
| Targeted tests only | May miss regressions elsewhere | Final diff/sibling audit; occasional broader test on release validation, not per-task loop |
| SFT/distillation | Public adapters show non-significant gain and catastrophic regressions | No-adapter baseline; frozen holdout; trajectory-health veto |
| 32K budget design | Actual served context may differ | Probe raw serving config; tokenize real prompts; adaptive lower bound |
| 31B priority | E4B may offer better throughput/cost and improve with training | Keep independent E4B gate; do not infer final ranking before measured candidate runs |

#### 15.3 Conclusions that should not be trusted

Do not trust a score without its date, harness, eligible denominator, and raw per-task outcomes; a leaderboard delta without a paired comparison; a retrieval recall number presented as end-to-end PASS; a native context number presented as the served limit; an official sampling start presented as a competition optimum; an adapter selected by NLL while loops or timeouts worsen; a family label inferred only from a touched filename; an E4B result used to rank subtle 31B changes; or any expected-score scenario in this report presented as a hidden-set forecast. Likewise, no categorical claim that graphs, planning, reviewers, or adapters can never help is justified—the adopted defaults are evidence-weighted starting points with explicit invalidation conditions.

## Part IV — Supporting research

### 16. Submission contract (ADK Agent Config, tools, budgets)

| Contract question | Evidence established at cutoff | Status and required probe |
|---|---|---|
| Archive entry | Official search-visible competition material identifies `agent.yaml` at archive root ([Kaggle](https://www.kaggle.com/competitions/gemma-4-developer-agent)). | High; statically verify actual zip root. |
| Agent Config | ADK supports YAML `LlmAgent`, instructions, tools, custom tools, includes in public examples, and sub-agent config paths ([ADK](https://adk.dev/agents/config/)). | High for general ADK; competition compiler remains separate. |
| Model support | General ADK Agent Config documentation says it currently supports Gemini models, while competition uses Gemma 4. | Do not use ADK parser acceptance alone as competition compatibility proof. |
| Same model | Official competition material requires every agent/sub-agent to use the same selected model. | High; 31B+E4B ensembles are out of scope. |
| Sub-agents/AgentTool | ADK supports sub-agents and lists `AgentTool` among supported Agent Config tools; exact competition sandbox exposure is not fully retrieved. | Medium; probe before optional 31B reviewer. |
| Core tools | Nine names recur in public benchmark and community configurations: command/read/edit/write/status/submit plus three graph tools. | Medium-High; raw runtime schemas still authoritative. |
| Skill tools | ADK documents `load_skill`, `load_skill_resource`, and `run_skill_script`; community setups differ on exposure ([ADK Skills](https://adk.dev/skills/)). | Unresolved 9-vs-11+ question; P0 highest priority. |
| Skill validation | ADK specifies L1/L2/L3, kebab-case name ≤64, description ≤1024, matching directory. | High for ADK; check competition’s additional `repo_navigation/` convention. |
| Patch capture | Community reports describe working-tree/git-diff capture from `/workspace`, with separate validation. | Medium; one public smoke must verify untracked files, edits at timeout, and submit semantics. |
| Evaluation configuration | Official starter search results expose `EvalConfig` and `build_submission_limits`; public examples differ on `evaluation:` wrapper ([starter](https://www.kaggle.com/code/ryanholbrook/getting-started-gemma-4-developer-agent)). | Medium; parse/round-trip exact starter rather than copying a blog. |
| Adapters | Public competition/community material describes optional PEFT LoRA directories and per-agent selection. | Medium-High; verify filenames, base alias, rank ceiling, binding, and same-base rule. |
| Deadlines | Entry 2026-11-25 and final 2026-12-02, 23:59 UTC ([Kaggle evaluation](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview/evaluation)). | High at cutoff; recheck live rules before submission. |
| Winner licensing | Competition rules/report material require open-source delivery under permissive terms, described as Apache-2.0 in the handoff. | High for planning; verify current rules and all third-party notices. |

The declarative/executable boundary is important. Prompts, YAML, and Markdown resources are portable and low risk. Skill scripts and navigation helpers can reduce token cost and enforce deterministic checks but add filesystem, interpreter, tool-schema, and sandbox failure modes. Adapters add base-digest, target-module, serving, and behavioral-regression risks. The baseline therefore uses the fewest executable components that can express the control loop.

### 17. Runtime envelope (serving, context, throughput, wall clock)

Official vLLM Gemma 4 guidance establishes the reasoning/tool parser family and thinking/tool-call template requirements, not the competition’s exact TP/context flags ([vLLM](https://docs.vllm.ai/projects/recipes/en/stable/Google/Gemma4.html)). Community harness transcriptions report 4×L4 (96 GB aggregate), TP4, w4a16, GPU-memory utilization around 0.80, thinking enabled, and `max_model_len=32768`. Treat those as dated environment evidence, not timeless official constants.

| Quantity | Official/model fact | Community/hypothesis | Design consequence |
|---|---|---|---|
| Native context | 256K 31B; 128K E4B | — | Never advertise native context as usable competition budget |
| Served context | Exact starter not retrieved | 32768 reported | Probe and tokenize; use 32K planning envelope |
| TP/hardware | vLLM supports Gemma 4 | 4×L4, TP4 reported | Local 24-GB throughput is not comparable |
| Quantization | compressed-tensors pack-quantized w4a16 | Served with vLLM | Adapter/merge path must match exact format |
| Thinking | `<|think|>`; preserve thoughts on tool-call turns | Enabled in reference reports | Reserve output/context; do not strip tool-call thoughts in replay |
| Per-task time | `EvalConfig` exists | 5–7 minute entrant choices common | Compute from aggregate cap, not imitation |
| Aggregate time | 12-hour competition run described in official/handoff material | Setup inclusion/validation exclusion needs live verification | Reserve 60–90 min and track cumulative time |
| Throughput | No official tokens/s for this exact stack | Not independently measured | Do not fabricate; log actual prompt/output tokens and latency |

The aggregate arithmetic is more binding than a per-task ceiling. If 120 tasks run sequentially in 720 minutes and 60 minutes are reserved for startup/drain/contingency, the sustainable average is **5.5 minutes/task**. A six-minute cap is therefore only an upper bound; using it on every task produces 720 minutes before startup. If tasks run concurrently or the hidden count differs, recompute from observed orchestration rather than assuming linearity.

![Measured lexical and graph-assisted retrieval](gemma4-brain-assets/retrieval-evidence.png)

Retrieval metrics are not PASS metrics. File BM25’s 69.0% R@20 means roughly three in ten tasks still lack a gold file in the top 20; exact issue symbols and caller/test evidence must supplement it. Node hybrid+graph improves over node BM25, but two-stage lexical→graph narrowing underperforms single-stage file lexical retrieval. A separate pre-registered E4B study found exact-function top-five word search 40 versus graph 36 on 78 definition-changing held-out tasks, and agent scores push_graph 31, pull 31, push_lex 40, no map 29; it also reported official map-tool use in only 1/84 pull runs ([Clavis](https://github.com/clavis-systems/who-reads-the-code-map)). These independent results justify the shell’s default while preserving graph assistance for structural questions.

### 18. Public landscape and prior art

This table enumerates the substantive, search-accessible efforts found by the cutoff; it is not a claim to have discovered every private or unindexed notebook. Kaggle’s authenticated/interstitial pages prevented a complete live code/leaderboard census.

| Effort | Architecture/evidence | What transfers | What does not transfer |
|---|---|---|---|
| [Official starter](https://www.kaggle.com/code/ryanholbrook/getting-started-gemma-4-developer-agent) | `EvalConfig`, evaluator, submission limits in search-visible notebook content | First authority for schema and Phase 1/2 behavior | Full body was not retrieved; no invented flags |
| [Fatu `gemma4-dev-agent`](https://github.com/fatu/gemma4-dev-agent) | Dated 31B/E4B arms, prompts, failure analyses, adapters, gold audits | Same-setting 51/129 vs 20/129; wrong-file/fix/timeout losses; NLL warning | Local vs leaderboard numbers and dates are not poolable; “graphs useless” is entrant-specific |
| [Happy `gemma-swe-agent`](https://github.com/happyc0der/gemma-swe-agent) | Early iterative prompts, local harness, validation reports | Harness-fidelity checks and recurrent no-patch/diff issues | Early low scores are not a current ceiling |
| [Elamurg `gemma-4-dev`](https://github.com/elamurg/gemma-4-dev) | Analyzer/coder concepts and plans | Candidate decomposition hypothesis | Placeholder/unmeasured tables are not evidence of gain |
| [Graph retrieval benchmark](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark) | Complete index, graph audit, BM25/graph ranking results | Quantitative lexical-first, bounded graph-assist design | Localization recall is not end-to-end PASS |
| [Clavis `who-reads-the-code-map`](https://github.com/clavis-systems/who-reads-the-code-map) | Pre-registered 45/84 split, static and E4B agent comparisons | Strong counter-evidence to graph-first and class-level correctness | E4B/Ollama results do not determine 31B/vLLM behavior |
| [Aeris Competition](https://github.com/belemcrizan/Aeris_Competition) | Graph-guided uncertainty gates, skill scripts, validator | Good probe/ledger/ablation hygiene and explicit unverified labels | README says no real harness/model measurements; hypotheses not results |
| [kb2326 Ask or Enforce](https://github.com/kb2326) | Pre-registered prompt rules vs planning stage, 41 held-out tasks | Planning gain failed to replicate; literal prompt compliance differs from intent | Profile summary is secondary to full paper/config; no broad causal generalization |

The recurring structural lessons are budgeted editing, clean patch capture, explicit failure labels, frozen splits, and skepticism toward small score deltas. Public leaderboard scores are time-stamped snapshots under changing configurations and cannot be pooled with local 129-task runs. No current leaderboard ceiling is asserted because the live table was not reliably retrievable at cutoff.

### 19. Research methodology

The research proceeded through contract, runtime, model, corpus, retrieval, family, public-landscape, training, evaluation, and license workstreams. Direct Kaggle page/notebook retrieval returned an interstitial, and unauthenticated data access returned 401; no bypass was attempted. The two original attachment paths were absent. A complete alternate public task index and benchmark artifacts were recovered, upstream release notes/PR records were used for behavioral titles, and official raw model configs were retrieved through a mirror after direct downloads timed out.

Every family was assigned exactly once and counts were programmatically reconciled to the requested 4/4/13/3/2/7/8/11/7/8, 2/1/4/6/4/5/8/4/6/8, and 1/2/1/2/3/2/3 partitions. Patch/file/statement statistics were recomputed from the recovered index. No original problem statements, complete patches, or test patches were claimed as directly inspected. Family assignments at semantic boundaries are explicitly marked reconstructed.

Quantitative checks used exact counts, medians, ratios, Wilson intervals, paired McNemar arithmetic, and global time budgets. External standards were selected only where they explain actual touched behavior. Remaining contract questions were converted into probes rather than filled with plausible guesses. No public task was solved, no model was trained, and no checkpoint or submission archive was produced.

### 20. Source-quality approach

| Rank | Source type | Permitted claim | Example |
|---|---|---|---|
| A | Official current documentation/config | Model architecture, ADK/vLLM semantics, deadlines when retrieved | Gemma card, raw configs, ADK, vLLM, Kaggle evaluation |
| B | Upstream primary repository/standard | Behavioral history and normative domain contract | FastAPI/Rich/Requests release notes and PRs, RFCs, Unicode, OpenAPI |
| C | Reproducible public artifact | Corpus/retrieval statistics within stated denominator | Graph benchmark JSON/CSV and task index |
| D | Dated community engineering log | Reported result/failure in that environment | Fatu, Happy, Clavis, kb2326 |
| E | Derived analysis | Counts, partitions, time/noise arithmetic, design inference | Appendix calculations; always labeled derived |
| Excluded as proof | Anonymous snippets, unattributed blogs, conceptual placeholders | Leads only | Not used for load-bearing contract/model claims |

Harness behavior ideally requires official documentation or two independent community reports plus an uncertainty label. Model capability uses official model/report or reproducible measurement. Scores require date, configuration, environment, and denominator. Upstream resources are pinned by PR/base-commit era where possible; current docs are not silently treated as historical behavior.

### 21. Contradictory evidence and competing interpretations

| ID | Contradiction | Resolution at cutoff | Remaining action |
|---|---|---|---|
| C-01 | 256K/128K native vs 32K served | Different layers; both can be true | Probe actual served `max_model_len`; P0 |
| C-02 | Nine vs eleven-plus tools | Core nine are consistent; skill loaders vary by setup | Record runtime tool list/schema; highest open item |
| C-03 | Meaning of 12-hour cap | Official/handoff describes aggregate run; exact setup/validation accounting not independently replayed | Verify live overview/staff clarification and measure startup/drain |
| C-04 | Sample budgets vs entrant choices | `EvalConfig` existence is official; 24/28 calls and 6/7 minutes are choices | Treat report numbers as hypotheses and ablate |
| C-05 | Leaderboard/local comparability | Not comparable without environment/config/denominator match | Never pool; report date and harness |
| C-06 | Gold patch 109/129 vs 112/129 vs 33/33 | Different validators/strictness; no universal value | Freeze local gold eligibility and environment defects |
| C-07 | Graph-first vs lexical-first | Current public ranking and E4B agent evidence favor lexical-first; graph helps conditionally | Re-test end-to-end if tools change |
| C-08 | E4B as proxy vs independent track | Independent weaker track; limited qualitative proxy only | Require final 31B evidence for 31B decisions |
| C-09 | ADK general contract vs competition extensions | Competition custom compiler is authoritative for Gemma/tools/adapters | ADK acceptance is necessary at most, not sufficient |
| C-10 | `repo_navigation/` vs ADK kebab-case skill names | May be separate custom resource directory; not automatically an ADK Skill | Probe registration; use `skills/repo-navigation/` for ADK |

The strongest alternative interpretation is that a sufficiently trained E4B could benefit from more graph/planning structure, not less. That remains possible, but current public evidence does not justify making it the baseline. The correct response is a preregistered ablation with PASS and trajectory health, not a categorical claim that graphs or planning can never help.

### 22. Risks, limitations, and evidence gaps

| Priority | Gap/risk | Consequence | Mitigation |
|---|---|---|---|
| 1 | Exact official tool/skill/eval schemas inaccessible | Valid-looking archive may fail or ignore controls | P0 raw probe against starter; no production reliance before pass |
| 2 | Served context/throughput unverified | Token/time plan may be over- or under-constrained | Log actual config/token/latency; adaptive budgets |
| 3 | Original CSV/JSONL absent | Family labels and test-anatomy claims cannot be independently checked | Reconstructed labels flagged; no fabricated statement/test assertions |
| 4 | Hidden distribution unknown | Public family optimization may not transfer | Generic archetypes, family/repository holdouts, no ID hardcoding |
| 5 | Local harness mismatch | False gains/losses and wrong gold denominator | Frozen containers, gold baseline, infrastructure labels |
| 6 | Public training contamination | Memorized patches inflate public score | Split before teacher generation; dedupe hashes; leave-one-family-out |
| 7 | Small samples/leaderboard noise | Noise marketed as improvement | Paired exact tests, confidence intervals, limited comparisons |
| 8 | Upstream version drift | Present-day API advice breaks base commit | Pin PR/base era; repository siblings/tests first |
| 9 | QAT/adapter compatibility | Silent no-op or serving regression | Binding/output checks and held-out agent evaluation |
| 10 | Vendored license/provenance | Winner release conflict | Original concise notes, attribution manifest, restrictive-license exclusion |
| 11 | One HTTPX task | Repository prior is meaningless | Generic HTTP lifecycle only; no HTTPX-specific frequency claim |
| 12 | Security of executable helpers | Workspace damage or data leakage | Read-only defaults, path allowlist, no network, output caps, scratch outside repo |

No claim is made about hidden `hints_text`; the scaffold must handle the field if present but cannot assume it is empty. No exact vLLM version, tokens/s, or official sampling optimum is invented. No complete validation-test anatomy is claimed where only test file paths and upstream titles were available.

### 23. Recommendations, implications, and future outlook

The immediate recommendation is to build the smallest measurable system: official-contract probe, frozen validator, no-adapter 31B kernel, then E4B short loop. Add only resources that address observed failure classes. The first three family artifacts should be request extraction, dependant analysis, and Pydantic-v2 schema; the first cross-repository resources should cover Rich text/cell invariants and Requests body/URL boundaries. Keep graph tools available but subordinate to a concrete structural question.

The next research priority is not another prompt rewrite. It is a paired measurement of **where time and calls stop producing new information**: marginal pass by call number, wrong-file transition after each retrieval method, correction success after first targeted test, and family-specific no-patch/timeout rates. Those measurements can falsify the proposed 28/20-call split and the E4B early-edit rule.

Longer-term, the most promising training direction is validated action distillation with failed-trajectory repair, not gold-patch memorization or RL for its own sake. A useful public research contribution would be a family-held-out comparison of lexical-first/graph-assist retrieval and track-specific control policies, with raw per-task outcomes, contamination controls, and environment-defect reporting.

### 24. Conclusion

The winning “brain” is not a warehouse of 27 repository manuals. It is a contract-valid control system that extracts literal behavior, locates causality cheaply, edits early but narrowly, verifies with a targeted oracle, and submits a clean patch inside an aggregate time budget. The 31B shell can spend more effort on cross-layer reasoning; the E4B shell must spend more effort avoiding low-value trajectories.

The evidence supports lexical-first/graph-assisted retrieval, compact triggered family knowledge, and cautious post-training. It does not support a universal graph prohibition, an identical model-swap architecture, a current leaderboard ceiling, or a precise hidden-score forecast. The report’s remaining unknowns are explicit and probeable; the implementation sequence is designed to resolve them before they become expensive.

## Part V — Appendices

### Appendix A. Research-question coverage matrix

| ID | Question | Answer location | Status |
|---|---|---|---|
| RQ-01 | Archive, Agent Config, tools, sub-agents, skills, adapters | §§2, 11, 16; App. J | Mostly answered; exact runtime schemas probe-gated |
| RQ-02 | 31B/E4B capability, architecture, serving, sampling | §§2, 6–9, 17; App. H–I | Official facts answered; throughput/context served values open |
| RQ-03 | Scoring, validation, time, reliability | §§3, 13, 16–17; App. H, K | Method answered; exact aggregate accounting open |
| RQ-04 | Validate the 27-family partition and counts | §§4–5; App. C–D, F | Complete reconstructed partition; original labels unavailable |
| RQ-05 | Knowledge each family needs | §4 dossiers; App. D, G | Complete for all 27 |
| RQ-06 | Retrieval: lexical, graph, embeddings | §§3, 11, 17; App. G | Evidence supports lexical-first/graph-assisted |
| RQ-07 | Procedural repair and trajectory controls | §§3, 6–9, 11, 15 | Complete starting policy, ablation required |
| RQ-08 | Declarative artifacts and draft resources | Every dossier; §11 | Draft-ready fragments supplied, not production code |
| RQ-09 | Post-training, distillation, LoRA, contamination | §12; App. I | Specified, not executed |
| RQ-10 | Expected value and prioritization | §§5, 14; App. D, G | Relative judgment, not guaranteed score uplift |
| VQ-01 | 31B tool/sampling/context policy | §6; App. H | Draft starting hypothesis |
| VQ-02 | 31B multi-agent choice | §6 | Single baseline; late reviewer conditional |
| VQ-03 | 31B family priorities | §7 | All families assigned HIGH/MEDIUM/LOW |
| VQ-04 | 31B adapter need and recipe | §§6, 12; App. I | Optional unified adapter after no-adapter baseline |
| VQ-05 | E4B tool/sampling/context policy | §8; App. H | Deliberately shorter than 31B |
| VQ-06 | E4B multi-agent choice | §8 | Rejected as baseline |
| VQ-07 | E4B family priorities/triage | §9 | Same coverage, earlier abandon/review rules |
| VQ-08 | E4B direct SFT vs distillation | §§8, 12; App. I | Paired experiment specified; no winner assumed |
| VQ-09 | E4B proxy limits | §§8, 13 | Gross failures only; not ranking subtle 31B changes |
| VQ-10 | Expected-score and time arithmetic | §10; App. H | Scenarios only, not forecasts |
| SQ-01 | Exact submission contract | §§2, 11, 16 | Partially unresolved pending P0 probe |
| SQ-02 | Context/token budget | §§2, 17; App. H | Planning envelope supplied; served value unverified |
| SQ-03 | Runtime/throughput | §17; App. H | Formula supplied; no fabricated tokens/s |
| SQ-04 | Shared scaffold vs model-specific policy | §§3, 6–9, 11 | Complete kernel + two shells |
| SQ-05 | Evaluation and noise | §13; App. H | Paired/family-held-out protocol supplied |
| SQ-06 | Reproducibility and traceability | §§19–20; App. B–M | Complete within recovered-source limits |
| SQ-07 | Integrity/license/security | §§12, 22; App. J, K | Screen supplied; final vendored-file review still required |

### Appendix B. Claim-evidence traceability matrix

| Claim ID | Claim | Evidence and denominator | Use limit |
|---|---|---|---|
| B-01 | 129 unique recovered tasks | Recovered `tasks_index.json`, recomputed IDs ([dataset](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)) | Alternate public index, not missing original JSONL |
| B-02 | FastAPI 67, Rich 48, Requests 13, HTTPX 1 | Same index, exact repository counts | Corpus composition only |
| B-03 | 27,603 total reference patch lines; median 32 | Recomputed `patch_lines` | Public reference patches, not hidden tests |
| B-04 | 91/129 one-file references (70.5%) | Recomputed `gold_files` | Does not imply one-file correct solution always |
| B-05 | `rich_3930`: 12,870 lines, 26 files | Recovered index row | Generated-data outlier; exclude from generic SFT |
| B-06 | 96.3% graph function coverage | Benchmark audit, modification tasks ([audit](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark)) | Representation is not ranking quality |
| B-07 | File BM25 R@1 22.5%, R@5 42.6%, R@10 55.8%, R@20 69.0%, MRR .320 | 129 tasks, benchmark summary | Localization only |
| B-08 | Best graph-node hybrid R@1 17.8%, R@20 53.3%, MRR .257 | 107 evaluable node tasks | Different denominator from file results |
| B-09 | Node BM25 R@20 47.7%; bounded graph expansion 53.3% | Same benchmark | Supports conditional graph expansion |
| B-10 | Embedding pairwise cosine mean .8045, p90 .9890, p99 1.0 | Published embedding sample | Warns against naive dense similarity on this sample |
| B-11 | E4B lexical 40, graph 31, pull 31, no map 29 on 84 held-out tasks | Clavis preregistered agent study ([Clavis](https://github.com/clavis-systems/who-reads-the-code-map)) | E4B/Ollama setting; not 31B proof |
| B-12 | Official map tools used in 1/84 pull runs | Same Clavis report | Tool-usage evidence in that harness |
| B-13 | 31B 51/129 vs E4B 20/129 in same setting | Dated Fatu `RESULTS.md` ([Fatu](https://github.com/fatu/gemma4-dev-agent/blob/main/RESULTS.md)) | Community result, not official leaderboard |
| B-14 | All 20 E4B solves subset of 31B solves | Same Fatu comparison | 31 discordant pairs, exact two-sided p≈9.31e-10 |
| B-15 | E4B adapter 20/129 vs no adapter 15/129, p=.23 | Fatu paired comparison | Not statistically persuasive at this sample |
| B-16 | Earlier E4B LoRA 6/33→1/33, 23/33 timeouts | Fatu failure report | Small/different sample; warning against NLL selection |
| B-17 | Gold baselines 109/129, 112/129, 33/33 appear in different reports | Dated community validators | Do not pool; freeze local eligibility |
| B-18 | 31B 30.7B, 60 layers, 5376 hidden, 256K native | Official model card/config ([31B](https://huggingface.co/google/gemma-4-31B-it)) | Native, not served context |
| B-19 | E4B 4.5B effective/8B embeddings, 42 layers, 2560 hidden, 128K native | Official model card/config ([E4B](https://huggingface.co/google/gemma-4-E4B-it)) | Same limitation |
| B-20 | Official LiveCodeBench v6 80.0 vs 52.0; Tau2 average 76.9 vs 42.2 | Official model report/cards | Benchmark transfer is indicative only |
| B-21 | Sampling start temperature 1.0, top-p .95, top-k 64 | Official model card | Not competition-proven optimum |
| B-22 | Thinking via `<|think|>`; preserve thoughts on tool-call turns | Official chat-template/model guidance | Affects replay/training serialization |
| B-23 | ADK skill naming/size and L1/L2/L3 loading | Official ADK Skills docs | Competition extensions still need probe |
| B-24 | Agent Config general docs support Gemini, not proof of Gemma competition support | Official ADK Config docs | Separate custom compiler contract |
| B-25 | vLLM `gemma4` reasoning/tool parsers and automatic tool choice | Official vLLM recipe | Exact competition version/flags unknown |
| B-26 | Fatu latest public arm 28 calls/7 min/80 turns/240 s | Public arm configs | Entrant choice, not official constant |
| B-27 | 12 hours=720 min; 120 tasks +60 reserve→5.5 min average | Derived arithmetic | Assumes sequential 120-task scenario |
| B-28 | 51/129=39.5%, Wilson 95% 31.5–48.2 | Derived exact count/interval | Does not estimate hidden score |
| B-29 | 20/129=15.5%, Wilson 95% 10.3–22.7 | Derived exact count/interval | Same limitation |
| B-30 | q=20 on 129 gives ≈6.8-point paired delta half-width; q=40 gives ≈9.6 | Derived normal discordant-pair approximation | Planning heuristic; use exact tests for decisions |
| B-31 | One task on 58 tasks =1.72 points | Exact arithmetic | Explains small-board noise |
| B-32 | 17 families/86 tasks have family median patch ≤40 lines | Recomputed family stats | Tractability signal, not solve probability |
| B-33 | F-20 accounts for 48.3% of all patch lines | Recomputed share | Driven by generated Unicode outlier |
| B-34 | Family assignments cover every ID exactly once | Programmatic reconciliation | Labels reconstructed and boundary-sensitive |
| B-35 | No hidden task IDs, working zip, training, or checkpoints produced | Scope/integrity audit | Deliverable is research and draft artifacts only |

### Appendix C. Full 129-row task profile

All fields derive from the recovered public index plus reconstructed behavioral titles/families. “Patch lines” and touched files/functions describe public reference patches, not hidden tests. Statement length is characters in the recovered index; the original statements were not directly inspected.

| # | Instance | Repository / base commit | Family | Behavioral title | Gold files | Gold functions | Test files | Patch lines | Statement chars |
|---:|---|---|---|---|---|---|---|---:|---:|
| 1 | `fastapi_5624` | `fastapi/fastapi`<br>`c6487ed632056e450d844846a1b63be551a3cbc6` | F-01 | Fix hierarchical security scope propagation. | `fastapi/dependencies/utils.py` | — | `tests/test_security_scopes_dont_propagate.py` | 13 | 63 |
| 2 | `fastapi_13786` | `fastapi/fastapi`<br>`e2354a0a063f2fcb890ec568f1a98e136a39fd25` | F-01 | Use `401` status code in security classes when credentials are missing. | `docs_src/authentication_error_status_code/tutorial001_an.py`<br>`docs_src/authentication_error_status_code/tutorial001_an_py39.py`<br>`docs_src/security/tutorial003.py`<br>`docs_src/security/tutorial003_an.py`<br>`docs_src/security/tutorial003_an_py310.py`<br>`docs_src/security/tutorial003_an_py39.py`<br>`docs_src/security/tutorial003_py310.py`<br>`fastapi/security/api_key.py`<br>`fastapi/security/http.py`<br>`fastapi/security/oauth2.py`<br>`fastapi/security/open_id_connect_url.py` | `APIKeyBase`<br>`APIKeyCookie`<br>`APIKeyHeader`<br>`OpenIdConnect`<br>`__init__` | `tests/test_security_api_key_cookie.py`<br>`tests/test_security_api_key_cookie_description.py`<br>`tests/test_security_api_key_header.py`<br>`tests/test_security_api_key_header_description.py`<br>`tests/test_security_api_key_query.py`<br>`tests/test_security_api_key_query_description.py`<br>`tests/test_security_http_base.py`<br>`tests/test_security_http_base_description.py`<br>`tests/test_security_http_basic_optional.py`<br>`tests/test_security_http_basic_realm.py`<br>`tests/test_security_http_basic_realm_description.py`<br>`tests/test_security_http_bearer.py`<br>`tests/test_security_http_bearer_description.py`<br>`tests/test_security_http_digest.py`<br>`tests/test_security_http_digest_description.py`<br>`tests/test_security_oauth2.py`<br>`tests/test_security_openid_connect.py` | 512 | 5328 |
| 3 | `fastapi_14786` | `fastapi/fastapi`<br>`eacbce24c9d299c6a28110d9fc8ac50f53cddb08` | F-01 | Strip whitespaces from `Authorization` header credentials. | `fastapi/security/utils.py` | — | `tests/test_security_http_base.py`<br>`tests/test_security_oauth2_authorization_code_bearer.py` | 8 | 2303 |
| 4 | `fastapi_14978` | `fastapi/fastapi`<br>`94a1ee749e63591e6e275b726a66e07a25f6c407` | F-01 | Add `strict_content_type` checking for JSON requests. | `docs_src/strict_content_type/tutorial001_py310.py`<br>`fastapi/applications.py`<br>`fastapi/routing.py` | `matches`<br>`route` | `tests/test_strict_content_type_app_level.py`<br>`tests/test_strict_content_type_nested.py`<br>`tests/test_strict_content_type_router_level.py`<br>`tests/test_tutorial/test_body/test_tutorial001.py`<br>`tests/test_tutorial/test_strict_content_type/test_tutorial001.py` | 180 | 112 |
| 5 | `fastapi_14186` | `fastapi/fastapi`<br>`6e49dc029541aaa896fa63c47647ccd3f066df67` | F-02 | Fix internal Pydantic v1 compatibility (warnings) for Python 3.14 and Pydantic 2.12.1. | `fastapi/_compat/__init__.py`<br>`fastapi/_compat/main.py`<br>`fastapi/_compat/may_v1.py`<br>`fastapi/_compat/shared.py`<br>`fastapi/_compat/v1.py`<br>`fastapi/_compat/v2.py`<br>`fastapi/dependencies/utils.py`<br>`fastapi/encoders.py`<br>`fastapi/temp_pydantic_v1_params.py`<br>`fastapi/utils.py` | `_annotation_is_complex`<br>`_get_model_config`<br>`_is_error_wrapper`<br>`_is_model_class`<br>`_is_model_field`<br>`_is_undefined`<br>`_model_dump`<br>`_model_rebuild`<br>`annotation_is_pydantic_v1`<br>`copy_field_info`<br>`create_body_model`<br>`get_annotation_from_field_info`<br>`get_cached_model_fields`<br>`get_compat_model_name_map`<br>`get_schema_from_model_field`<br>`is_bytes_field`<br>`is_bytes_sequence_field`<br>`is_scalar_field`<br>`is_scalar_sequence_field`<br>`is_sequence_field`<br>`serialize_sequence_value` | `tests/test_compat.py`<br>`tests/test_get_model_definitions_formfeed_escape.py`<br>`tests/test_response_model_as_return_annotation.py` | 775 | 1009 |
| 6 | `fastapi_14583` | `fastapi/fastapi`<br>`6513d4daa16a536d17743de6a292f49bd06388a4` | F-02 | Add deprecation warnings when using `pydantic.v1`. | `fastapi/dependencies/utils.py`<br>`fastapi/routing.py` | — | `tests/benchmarks/test_general_performance.py`<br>`tests/test_compat_params_v1.py`<br>`tests/test_datetime_custom_encoder.py`<br>`tests/test_filter_pydantic_sub_model/app_pv1.py`<br>`tests/test_get_model_definitions_formfeed_escape.py`<br>`tests/test_pydantic_v1_deprecation_warnings.py`<br>`tests/test_pydantic_v1_v2_01.py`<br>`tests/test_pydantic_v1_v2_list.py`<br>`tests/test_pydantic_v1_v2_mixed.py`<br>`tests/test_pydantic_v1_v2_multifile/main.py`<br>`tests/test_pydantic_v1_v2_noneable.py`<br>`tests/test_read_with_orm_mode.py`<br>`tests/test_response_model_as_return_annotation.py`<br>`tests/test_tutorial/test_pydantic_v1_in_v2/test_tutorial002.py`<br>`tests/test_tutorial/test_pydantic_v1_in_v2/test_tutorial003.py`<br>`tests/test_tutorial/test_pydantic_v1_in_v2/test_tutorial004.py`<br>`tests/test_tutorial/test_request_form_models/test_tutorial002_pv1.py`<br>`tests/test_tutorial/test_schema_extra_example/test_tutorial001_pv1.py` | 70 | 104 |
| 7 | `fastapi_14605` | `fastapi/fastapi`<br>`6b53786f626db95a42fd0f66afd360bab161f4b1` | F-02 | Add a custom `FastAPIDeprecationWarning`. | `fastapi/dependencies/utils.py`<br>`fastapi/exceptions.py`<br>`fastapi/openapi/utils.py`<br>`fastapi/params.py`<br>`fastapi/routing.py`<br>`fastapi/temp_pydantic_v1_params.py`<br>`fastapi/utils.py` | — | `tests/benchmarks/test_general_performance.py`<br>`tests/test_compat_params_v1.py`<br>`tests/test_pydantic_v1_deprecation_warnings.py`<br>`tests/test_regex_deprecated_body.py`<br>`tests/test_regex_deprecated_params.py`<br>`tests/test_schema_extra_examples.py`<br>`tests/test_tutorial/test_pydantic_v1_in_v2/test_tutorial002.py`<br>`tests/test_tutorial/test_pydantic_v1_in_v2/test_tutorial003.py`<br>`tests/test_tutorial/test_pydantic_v1_in_v2/test_tutorial004.py`<br>`tests/test_tutorial/test_query_params_str_validations/test_tutorial004.py`<br>`tests/test_tutorial/test_request_form_models/test_tutorial002_pv1.py`<br>`tests/test_tutorial/test_schema_extra_example/test_tutorial001_pv1.py` | 197 | 242 |
| 8 | `fastapi_14609` | `fastapi/fastapi`<br>`1b3bea8b6be2220cc1544653ea785d2134fcb35b` | F-02 | Drop support for `pydantic.v1`. | `docs_src/request_form_models/tutorial002_pv1_an_py39.py`<br>`docs_src/request_form_models/tutorial002_pv1_py39.py`<br>`fastapi/_compat/__init__.py`<br>`fastapi/_compat/main.py`<br>`fastapi/_compat/may_v1.py`<br>`fastapi/_compat/model_field.py`<br>`fastapi/_compat/shared.py`<br>`fastapi/_compat/v1.py`<br>`fastapi/_compat/v2.py`<br>`fastapi/datastructures.py`<br>`fastapi/dependencies/utils.py`<br>`fastapi/encoders.py`<br>`fastapi/exceptions.py`<br>`fastapi/openapi/models.py`<br>`fastapi/openapi/utils.py`<br>`fastapi/param_functions.py`<br>`fastapi/params.py`<br>`fastapi/routing.py`<br>`fastapi/temp_pydantic_v1_params.py`<br>`fastapi/utils.py` | `FastAPIDeprecationWarning`<br>`__get_pydantic_core_schema__`<br>`__get_pydantic_json_schema__`<br>`_annotation_is_complex`<br>`_has_computed_fields`<br>`_merge_lifespan_context`<br>`annotation_is_pydantic_v1`<br>`generate_operation_id_for_path`<br>`get_flat_models_from_model`<br>`get_model_name_map` | `tests/test_compat.py`<br>`tests/test_compat_params_v1.py`<br>`tests/test_datetime_custom_encoder.py`<br>`tests/test_filter_pydantic_sub_model/app_pv1.py`<br>`tests/test_filter_pydantic_sub_model/test_filter_pydantic_sub_model_pv1.py`<br>`tests/test_get_model_definitions_formfeed_escape.py`<br>`tests/test_inherited_custom_class.py`<br>`tests/test_jsonable_encoder.py` | 2814 | 144 |
| 9 | `fastapi_5077` | `fastapi/fastapi`<br>`930b27e5fa32ce150ddcea61f0c913435ae71c83` | F-03 | Add support for wrapped functions (e.g. `@functools.wraps()`) used with forward references. | `fastapi/dependencies/utils.py` | `get_typed_return_annotation`<br>`get_typed_signature` | `tests/forward_reference_type.py`<br>`tests/test_wrapped_method_forward_reference.py` | 27 | 2679 |
| 10 | `fastapi_9555` | `fastapi/fastapi`<br>`4976568fc7cb7501729d8f84d946cde1e91299cd` | F-03 | Handle wrapped dependencies. | `fastapi/dependencies/models.py` | `is_async_gen_callable`<br>`is_coroutine_callable`<br>`is_gen_callable` | `tests/test_dependency_wrapped.py` | 44 | 2934 |
| 11 | `fastapi_9753` | `fastapi/fastapi`<br>`aee8e78078e8a7f2736d3cab7a1cb7197356951c` | F-03 | Allow using dependables with `functools.partial()`. | `fastapi/dependencies/models.py` | `_unwrapped_call`<br>`is_gen_callable` | `tests/test_dependency_partial.py` | 23 | 689 |
| 12 | `fastapi_11355` | `fastapi/fastapi`<br>`811fa898752e7f5697733a2958ff79ad8dfb5276` | F-03 | Fix evaluating stringified annotations in Python 3.10. | `fastapi/dependencies/utils.py` | `get_typed_return_annotation`<br>`get_typed_signature` | `tests/test_stringified_annotations_simple.py` | 33 | 299 |
| 13 | `fastapi_13920` | `fastapi/fastapi`<br>`0dd42b746e17d33a74ea267a62eace9ccdccf345` | F-03 | Add support for PEP695 `TypeAliasType`. | `fastapi/dependencies/utils.py` | — | `tests/test_dependency_pep695.py` | 20 | 225 |
| 14 | `fastapi_14262` | `fastapi/fastapi`<br>`425a4c5bb1d1a8e00007e82e5188fc4d30585767` | F-03 | Add support for dependencies with scopes, support `scope="request"` for dependencies with `yield` that exit before the response is sent. | `docs_src/dependencies/tutorial008e.py`<br>`docs_src/dependencies/tutorial008e_an.py`<br>`docs_src/dependencies/tutorial008e_an_py39.py`<br>`fastapi/dependencies/models.py`<br>`fastapi/dependencies/utils.py`<br>`fastapi/exceptions.py`<br>`fastapi/param_functions.py`<br>`fastapi/params.py`<br>`fastapi/routing.py`<br>`fastapi/types.py` | `Depends`<br>`Security`<br>`ValidationException`<br>`__init__`<br>`get_flat_dependant` | `tests/test_dependency_yield_scope.py`<br>`tests/test_dependency_yield_scope_websockets.py`<br>`tests/test_tutorial/test_dependencies/test_tutorial008e.py` | 503 | 2437 |
| 15 | `fastapi_14301` | `fastapi/fastapi`<br>`972a967d5d3fa24d450637c36c6b7ad1f1d8c1b6` | F-03 | Fix `Depends(func, scope='function')` for top level (parameterless) dependencies. | `fastapi/dependencies/utils.py` | — | `tests/test_dependency_yield_scope.py` | 14 | 739 |
| 16 | `fastapi_14372` | `fastapi/fastapi`<br>`566e3157a5517784c741dbf36e39687af326fe90` | F-03 | Make the result of `Depends()` and `Security()` hashable, as a workaround for other tools interacting with these internal parts. | `fastapi/dependencies/utils.py`<br>`fastapi/params.py` | `Depends`<br>`Security` | `tests/test_depends_hashable.py` | 34 | 1160 |
| 17 | `fastapi_14419` | `fastapi/fastapi`<br>`63d7a2b9978258d13dfc22664e60fc2110d30e20` | F-03 | Cache dependencies that don't use scopes and don't have sub-dependencies with scopes. | `fastapi/dependencies/models.py`<br>`fastapi/dependencies/utils.py` | `cache_key`<br>`is_gen_callable` | `tests/test_security_scopes.py`<br>`tests/test_security_scopes_sub_dependency.py` | 152 | 689 |
| 18 | `fastapi_14448` | `fastapi/fastapi`<br>`c57ac7bdf3613798c94caceff562a41fa16d4a2d` | F-03 | Fix support for functools wraps and partial combined, for async and regular functions and classes in path operations and dependencies. | `fastapi/dependencies/models.py`<br>`fastapi/dependencies/utils.py` | `SecurityRequirement`<br>`computed_scope`<br>`is_async_gen_callable`<br>`is_coroutine_callable`<br>`is_gen_callable` | `tests/test_dependency_wrapped.py` | 142 | 1226 |
| 19 | `fastapi_14458` | `fastapi/fastapi`<br>`516169428d2fa189d34318ebc469a082c49c1189` | F-03 | Fix using class (not instance) dependency that has `__call__` method. | `fastapi/dependencies/models.py` | — | `tests/test_dependency_class.py` | 37 | 591 |
| 20 | `fastapi_14485` | `fastapi/fastapi`<br>`60699f306b67dc1f4918ebea17f04d7a48cda645` | F-03 | Fix support for `if TYPE_CHECKING`,  non-evaluated stringified annotations. | `fastapi/dependencies/utils.py` | `get_typed_return_annotation` | `tests/test_stringified_annotation_dependency.py` | 38 | 317 |
| 21 | `fastapi_14794` | `fastapi/fastapi`<br>`464c359bb03f7ba72330198cc9f44df36194837d` | F-03 | Allow `Response` type hint as dependency annotation. | `fastapi/dependencies/utils.py` | — | `tests/test_response_dependency.py` | 21 | 816 |
| 22 | `fastapi_14487` | `fastapi/fastapi`<br>`4a98a66778987648d2195155c9cbe0824d67b02a` | F-04 | Update docs about re-raising validation errors, do not include string as is to not leak information. | `docs_src/handling_errors/tutorial004.py` | — | `tests/test_tutorial/test_handling_errors/test_tutorial004.py` | 16 | 204 |
| 23 | `fastapi_14492` | `fastapi/fastapi`<br>`a456e92a21d5b94a67d6d0fd070218df09444443` | F-04 | Fix example of license identifier in documentation. | `docs_src/metadata/tutorial001_1_py39.py` | — | `tests/test_tutorial/test_metadata/test_tutorial001_1.py` | 11 | 159 |
| 24 | `fastapi_15661` | `fastapi/fastapi`<br>`ee22a4b8ca46dcce26c8c183afc4992a888d8be2` | F-04 | Automate release preparation. | `scripts/prepare_release.py` | — | `tests/test_prepare_release.py` | 219 | 1025 |
| 25 | `fastapi_14077` | `fastapi/fastapi`<br>`16d75d90eb96976a57b94cc24e4018859cd54c4d` | F-05 | Upgrade Starlette supported version range to >=0.40.0,<0.49.0. | `docs_src/handling_errors/tutorial005.py`<br>`fastapi/exception_handlers.py`<br>`fastapi/openapi/utils.py` | — | `tests/test_enforce_once_required_parameter.py` | 56 | 677 |
| 26 | `fastapi_14306` | `fastapi/fastapi`<br>`08b09e5236e315b6f10265ed229f130d4befb4ea` | F-05 | Improve tracebacks by adding endpoint metadata. | `fastapi/exceptions.py`<br>`fastapi/routing.py` | `HTTPException`<br>`RequestValidationError`<br>`ResponseValidationError`<br>`ValidationException`<br>`WebSocketRequestValidationError`<br>`errors` | `tests/test_validation_error_context.py` | 242 | 2791 |
| 27 | `fastapi_13713` | `fastapi/fastapi`<br>`5c1f87c56387a96dbdddb2b1c4ec9ba48dcebc4e` | F-06 | Add OpenAPI `external_docs` parameter to `FastAPI`. | `fastapi/applications.py`<br>`fastapi/openapi/utils.py` | — | `tests/main.py`<br>`tests/test_application.py` | 68 | 756 |
| 28 | `fastapi_14266` | `fastapi/fastapi`<br>`2cf04ee30db9df2db04a5b1e0d2c625dfbf1a211` | F-06 | Fix security schemes in OpenAPI when added at the top level app. | `fastapi/dependencies/utils.py` | — | `tests/test_top_level_security_scheme_in_openapi.py` | 34 | 247 |
| 29 | `fastapi_14455` | `fastapi/fastapi`<br>`603df6e36f59cc4a3e189f506b8f36d1e816c3ac` | F-06 | Fix OpenAPI security scheme OAuth2 scopes declaration, deduplicate security schemes with different scopes. | `fastapi/openapi/utils.py` | — | `tests/test_security_oauth2_authorization_code_bearer_scopes_openapi.py` | 29 | 283 |
| 30 | `fastapi_14459` | `fastapi/fastapi`<br>`eb1d50479ba0ac873e4ffa08a824b1d822ca3a17` | F-06 | Fix OAuth2 scopes in OpenAPI in extra corner cases, parent dependency with scopes, sub-dependency security scheme without scopes. | `fastapi/dependencies/models.py`<br>`fastapi/dependencies/utils.py`<br>`fastapi/openapi/utils.py` | `Dependant`<br>`is_gen_callable` | `tests/test_security_oauth2_authorization_code_bearer_scopes_openapi.py`<br>`tests/test_security_oauth2_authorization_code_bearer_scopes_openapi_simple.py` | 172 | 815 |
| 31 | `fastapi_14463` | `fastapi/fastapi`<br>`f2687dc1bb01f4cb62eee90e656b61c38c2aaf6a` | F-06 | Fix OpenAPI duplication of `anyOf` refs for app-level responses with specified `content` and `model` as `Union`. | `fastapi/openapi/utils.py` | — | `tests/test_additional_responses_union_duplicate_anyof.py` | 16 | 10095 |
| 32 | `fastapi_14791` | `fastapi/fastapi`<br>`08924400c2c75533685148b029defcf6913f1def` | F-06 | Update `ValidationError` schema to include `input` and `ctx`. | `fastapi/openapi/utils.py` | — | `tests/test_additional_properties.py`<br>`tests/test_additional_properties_bool.py`<br>`tests/test_additional_responses_custom_model_in_callback.py`<br>`tests/test_additional_responses_default_validationerror.py`<br>`tests/test_annotated.py`<br>`tests/test_application.py`<br>`tests/test_dependency_duplicates.py`<br>`tests/test_enforce_once_required_parameter.py`<br>`tests/test_extra_routes.py`<br>`tests/test_filter_pydantic_sub_model_pv2.py`<br>`tests/test_forms_single_param.py`<br>`tests/test_generate_unique_id_function.py`<br>`tests/test_get_model_definitions_formfeed_escape.py`<br>`tests/test_get_request_body.py`<br>`tests/test_include_router_defaults_overrides.py`<br>`tests/test_infer_param_optionality.py`<br>`tests/test_modules_same_name_body/test_main.py`<br>`tests/test_multi_body_errors.py`<br>`tests/test_multi_query_errors.py`<br>`tests/test_no_schema_split.py`<br>`tests/test_openapi_examples.py`<br>`tests/test_openapi_query_parameter_extension.py`<br>`tests/test_openapi_separate_input_output_schemas.py`<br>`tests/test_param_in_path_and_dependency.py`<br>`tests/test_param_include_in_schema.py`<br>`tests/test_put_no_body.py`<br>`tests/test_regex_deprecated_body.py`<br>`tests/test_regex_deprecated_params.py`<br>`tests/test_repeated_dependency_schema.py` | 11 | 591 |
| 33 | `fastapi_14986` | `fastapi/fastapi`<br>`2f9c914d440e99fe8b62646b51e4d24c5bcd858b` | F-06 | Refactor logic to handle OpenAPI and Swagger UI escaping data. | `fastapi/applications.py`<br>`fastapi/openapi/docs.py` | `setup` | `tests/test_openapi_cache_root_path.py`<br>`tests/test_swagger_ui_escape.py` | 69 | 1000 |
| 34 | `fastapi_11194` | `fastapi/fastapi`<br>`a7f2dbe976bf72703376f0cd04487bfc4a849f83` | F-07 | Fix validation error when `File` is declared after `Form` parameter. | `fastapi/dependencies/utils.py` | — | `tests/test_file_and_form_order_issue_9116.py` | 26 | 617 |
| 35 | `fastapi_13537` | `fastapi/fastapi`<br>`3b4b5ab8c819dce27fbaf0aa0a9c74b7f3255ec0` | F-07 | Fix support for form values with empty strings interpreted as missing (`None` if that's the default), for compatibility with HTML forms. | `fastapi/dependencies/utils.py` | — | `tests/test_form_default.py` | 13 | 1650 |
| 36 | `fastapi_14303` | `fastapi/fastapi`<br>`740ec2787b25e59f7aa9e3df1db09d4489c22718` | F-07 | Fix parsing extra `Form` parameter list. | `fastapi/dependencies/utils.py` | — | `tests/test_forms_single_model.py` | 18 | 2644 |
| 37 | `fastapi_14356` | `fastapi/fastapi`<br>`6cf40df24d1d199fd25d034fc87fcae284fc23a2` | F-07 | Fix parsing extra non-body parameter list. | `fastapi/dependencies/utils.py` | — | `tests/test_query_cookie_header_model_extra_params.py`<br>`tests/test_tutorial/test_header_param_models/test_tutorial003.py` | 21 | 1481 |
| 38 | `fastapi_14360` | `fastapi/fastapi`<br>`eead41bf4cf8587b4d86091dd3eabbb85796e717` | F-07 | Fix Query\Header\Cookie parameter model alias. | `fastapi/dependencies/utils.py` | — | `tests/test_request_param_model_by_alias.py` | 13 | 753 |
| 39 | `fastapi_14479` | `fastapi/fastapi`<br>`2b212ddd7604891d42e2ffbafe764c334230bdb7` | F-07 | Improve error message for invalid query parameter type annotations. | `fastapi/dependencies/utils.py` | — | `tests/test_invalid_sequence_param.py` | 11 | 2455 |
| 40 | `fastapi_14616` | `fastapi/fastapi`<br>`54f8aeeb9a15e4d5a12401ec5549840966df0087` | F-07 | Fix using `Json[list[str]]` type (issue #10997). | `fastapi/dependencies/utils.py` | `_get_multidict_value` | `tests/test_json_type.py` | 32 | 1176 |
| 41 | `fastapi_15589` | `fastapi/fastapi`<br>`22b02e26f9e8c7e32bd8266e2b0ebe8bb3a0db2b` | F-07 | Do not accept underscore headers when using `convert_underscores=True` (the default). | `fastapi/dependencies/utils.py` | — | `tests/test_query_cookie_header_model_extra_params.py` | 13 | 1247 |
| 42 | `fastapi_12942` | `fastapi/fastapi`<br>`27c0f7e75fc0ce26ca75295d455eb36f0ca033d3` | F-08 | Fix tagged discriminated union not recognized as body field. | `fastapi/_compat.py` | — | `tests/test_union_body_discriminator.py` | 12 | 1392 |
| 43 | `fastapi_13207` | `fastapi/fastapi`<br>`5126e099bdda51f261fd5a101b5f914991d31897` | F-08 | Fix OpenAPI schema support for computed fields when using `separate_input_output_schemas=False`. | `fastapi/_compat/v2.py` | — | `tests/test_computed_fields.py` | 33 | 354 |
| 44 | `fastapi_14246` | `fastapi/fastapi`<br>`7132a690461c2367f22556eb87c2b5eb7d9cfb45` | F-08 | Fix separation of schemas with nested models introduced in 0.119.0. | `fastapi/_compat/v2.py` | — | `tests/test_no_schema_split.py`<br>`tests/test_pydantic_v1_v2_multifile/test_multifile.py` | 38 | 273 |
| 45 | `fastapi_14297` | `fastapi/fastapi`<br>`3c54a8f07b70cdd40e3d81ea319e9fcccd2481d2` | F-08 | Fix optional sequence handling in `serialize sequence value` with Pydantic V2. | `fastapi/_compat/v2.py` | `serialize_sequence_value` | `tests/test_compat.py`<br>`tests/test_optional_file_list.py` | 16 | 1219 |
| 46 | `fastapi_14349` | `fastapi/fastapi`<br>`eaf611f9ee56de4f16c837d4f487a4b9fca507c4` | F-08 | Fix handling of JSON Schema attributes named "$ref". | `fastapi/_compat/v2.py` | — | `tests/test_schema_ref_pydantic_v2.py` | 21 | 169 |
| 47 | `fastapi_14361` | `fastapi/fastapi`<br>`5265c4f5cb4d8fb4fb5015bccf1a6de8f3fc6044` | F-08 | Avoid accessing non-existing "$ref" key for Pydantic v2 compat remapping. | `fastapi/_compat/v2.py` | — | `tests/test_schema_compat_pydantic_v2.py` | 11 | 96 |
| 48 | `fastapi_14371` | `fastapi/fastapi`<br>`3fe6522aaed4d36d6a38175a4a8137ee0fc62451` | F-08 | Fix parameter aliases. | `fastapi/_compat/v2.py`<br>`fastapi/dependencies/utils.py`<br>`fastapi/openapi/utils.py`<br>`fastapi/params.py` | `_get_multidict_value`<br>`required` | `tests/test_request_params/test_body/test_list.py`<br>`tests/test_request_params/test_body/test_optional_list.py`<br>`tests/test_request_params/test_body/test_optional_str.py`<br>`tests/test_request_params/test_body/test_required_str.py`<br>`tests/test_request_params/test_cookie/test_optional_str.py`<br>`tests/test_request_params/test_cookie/test_required_str.py`<br>`tests/test_request_params/test_file/test_list.py`<br>`tests/test_request_params/test_file/test_optional.py`<br>`tests/test_request_params/test_file/test_optional_list.py`<br>`tests/test_request_params/test_file/test_required.py`<br>`tests/test_request_params/test_form/test_list.py`<br>`tests/test_request_params/test_form/test_optional_list.py`<br>`tests/test_request_params/test_form/test_optional_str.py`<br>`tests/test_request_params/test_form/test_required_str.py`<br>`tests/test_request_params/test_header/test_list.py`<br>`tests/test_request_params/test_header/test_optional_list.py`<br>`tests/test_request_params/test_header/test_optional_str.py`<br>`tests/test_request_params/test_header/test_required_str.py`<br>`tests/test_request_params/test_path/test_required_str.py`<br>`tests/test_request_params/test_query/test_list.py`<br>`tests/test_request_params/test_query/test_optional_list.py`<br>`tests/test_request_params/test_query/test_optional_str.py`<br>`tests/test_request_params/test_query/test_required_str.py` | 168 | 397 |
| 49 | `fastapi_14430` | `fastapi/fastapi`<br>`cff2236dacb7aedcaf2d2de0873cfbc9bb2b897a` | F-08 | Fix optional sequence handling with new union syntax from Python 3.10. | `fastapi/_compat/v2.py` | `serialize_sequence_value` | `tests/test_compat.py` | 20 | 335 |
| 50 | `fastapi_14482` | `fastapi/fastapi`<br>`71a17b5932e38bcf798fcd05c5bb384e6d4db5bf` | F-08 | Fix handling arbitrary types when using `arbitrary_types_allowed=True`. | `fastapi/_compat/v2.py` | `alias`<br>`get_default`<br>`get_model_fields` | `tests/test_arbitrary_types.py` | 70 | 266 |
| 51 | `fastapi_14512` | `fastapi/fastapi`<br>`1fcec88ad2df4541b6a81c4786c4d039dc745e1e` | F-08 | Fix support for tagged union with discriminator inside of `Annotated` with `Body()`. | `fastapi/_compat/v2.py` | `BaseConfig` | `tests/test_union_body_discriminator_annotated.py` | 76 | 289 |
| 52 | `fastapi_14953` | `fastapi/fastapi`<br>`d2c17b603d2f986d5f3800d3bf24acba8e1f485b` | F-08 | Fix JSON Schema for bytes, use `"contentMediaType": "application/octet-stream"` instead of `"format": "binary"`. | `docs_src/json_base64_bytes/tutorial001_py310.py`<br>`fastapi/_compat/v2.py`<br>`fastapi/datastructures.py`<br>`scripts/playwright/json_base64_bytes/image01.py` | `__get_pydantic_core_schema__`<br>`__get_pydantic_json_schema__` | `tests/test_request_params/test_file/test_list.py`<br>`tests/test_request_params/test_file/test_optional.py`<br>`tests/test_request_params/test_file/test_optional_list.py`<br>`tests/test_request_params/test_file/test_required.py`<br>`tests/test_tutorial/test_json_base64_bytes/test_tutorial001.py`<br>`tests/test_tutorial/test_request_files/test_tutorial001.py`<br>`tests/test_tutorial/test_request_files/test_tutorial001_02.py`<br>`tests/test_tutorial/test_request_files/test_tutorial001_03.py`<br>`tests/test_tutorial/test_request_files/test_tutorial002.py`<br>`tests/test_tutorial/test_request_files/test_tutorial003.py`<br>`tests/test_tutorial/test_request_forms_and_files/test_tutorial001.py` | 135 | 1775 |
| 53 | `fastapi_9425` | `fastapi/fastapi`<br>`0bdc3ca3732e3742e094bea2b320e9774659ac38` | F-09 | Allow `None` as return type for bodiless responses. | `fastapi/dependencies/utils.py` | — | `tests/test_return_none_stringified_annotations.py` | 11 | 235 |
| 54 | `fastapi_14099` | `fastapi/fastapi`<br>`861b22c40897a03d2d7e5926923d962121ed5e2e` | F-09 | Fix support for `StreamingResponse`s with dependencies with `yield` or `UploadFile`s, close after the response is done. | `docs_src/dependencies/tutorial013_an_py310.py`<br>`docs_src/dependencies/tutorial014_an_py310.py`<br>`fastapi/applications.py`<br>`fastapi/middleware/asyncexitstack.py`<br>`fastapi/routing.py` | `_prepare_response_content`<br>`openapi` | `tests/test_dependency_after_yield_raise.py`<br>`tests/test_dependency_after_yield_streaming.py`<br>`tests/test_dependency_after_yield_websockets.py`<br>`tests/test_dependency_contextmanager.py`<br>`tests/test_route_scope.py`<br>`tests/test_tutorial/test_dependencies/test_tutorial008c.py` | 568 | 644 |
| 55 | `fastapi_14962` | `fastapi/fastapi`<br>`1e78a36b7310003f0ff634627d8a7bc53c6ccdee` | F-09 | Serialize JSON response with Pydantic (in Rust), when there's a Pydantic return type or response model. | `docs_src/custom_response/tutorial010_py310.py`<br>`fastapi/_compat/v2.py`<br>`fastapi/routing.py` | `__hash__` | `tests/test_dump_json_fast_path.py`<br>`tests/test_tutorial/test_custom_response/test_tutorial001.py`<br>`tests/test_tutorial/test_custom_response/test_tutorial010.py` | 104 | 210 |
| 56 | `fastapi_14964` | `fastapi/fastapi`<br>`bc06e4296d588f39f38c7ac2fc96d3913c565962` | F-09 | Deprecate `ORJSONResponse` and `UJSONResponse`. | `fastapi/responses.py` | `ORJSONResponse`<br>`UJSONResponse`<br>`render` | `tests/test_deprecated_responses.py`<br>`tests/test_orjson_response_class.py`<br>`tests/test_tutorial/test_custom_response/test_tutorial001.py`<br>`tests/test_tutorial/test_custom_response/test_tutorial001b.py` | 85 | 370 |
| 57 | `fastapi_15023` | `fastapi/fastapi`<br>`c0836dc1b7f4ba91e9563c8c4ccd0ebe655bc914` | F-09 | Update docs for responses and new stream with `yield`. | `docs_src/stream_data/tutorial002_py310.py` | `stream_image_no_async`<br>`stream_image_no_async_no_annotation` | `tests/test_tutorial/test_stream_data/test_tutorial002.py` | 44 | 112 |
| 58 | `fastapi_15030` | `fastapi/fastapi`<br>`48d58ae3b6ef4ded5a4794618c00345667256d98` | F-09 | Add support for Server Sent Events. | `docs_src/server_sent_events/tutorial001_py310.py`<br>`docs_src/server_sent_events/tutorial002_py310.py`<br>`docs_src/server_sent_events/tutorial003_py310.py`<br>`docs_src/server_sent_events/tutorial004_py310.py`<br>`docs_src/server_sent_events/tutorial005_py310.py`<br>`fastapi/openapi/utils.py`<br>`fastapi/responses.py`<br>`fastapi/routing.py`<br>`fastapi/sse.py` | `get_route_handler` | `tests/test_sse.py`<br>`tests/test_tutorial/test_server_sent_events/test_tutorial001.py`<br>`tests/test_tutorial/test_server_sent_events/test_tutorial002.py`<br>`tests/test_tutorial/test_server_sent_events/test_tutorial003.py`<br>`tests/test_tutorial/test_server_sent_events/test_tutorial004.py`<br>`tests/test_tutorial/test_server_sent_events/test_tutorial005.py` | 669 | 148 |
| 59 | `fastapi_15588` | `fastapi/fastapi`<br>`cb83b83dcf78eab4ea17d504db5abcda705fbdc4` | F-09 | Validate Server Sent Event fields to avoid applications from sending broken data. | `fastapi/sse.py` | `ServerSentEvent` | `tests/test_sse.py` | 56 | 1891 |
| 60 | `fastapi_14258` | `fastapi/fastapi`<br>`e94028ab60d18080810910352bc9129e8046c92d` | F-10 | Show a clear error on attempt to include router into itself. | `fastapi/routing.py` | — | `tests/test_router_circular_import.py` | 13 | 418 |
| 61 | `fastapi_14851` | `fastapi/fastapi`<br>`8e50c55fd90c4433ddc9096ff439da9498a8314a` | F-10 | Re-implement `on_event` in FastAPI for compatibility with the next Starlette, while keeping backwards compatibility. | `fastapi/routing.py` | `_merge_lifespan_context` | `tests/test_router_events.py` | 213 | 464 |
| 62 | `fastapi_14873` | `fastapi/fastapi`<br>`cd31576d5704b6aef1bdadc43770238cd88aad2b` | F-10 | Fix `on_startup` and `on_shutdown` parameters of `APIRouter`. | `fastapi/routing.py` | — | `tests/test_router_events.py` | 37 | 674 |
| 63 | `fastapi_15280` | `fastapi/fastapi`<br>`6ee87478d821171139264cd9cd17cbd2232934ce` | F-10 | Add support for `@app.vibe()`. | `docs_src/vibe/tutorial001_py310.py`<br>`fastapi/applications.py` | `websocket_route` | `tests/test_vibe.py` | 91 | 64 |
| 64 | `fastapi_15745` | `fastapi/fastapi`<br>`016ab760faba1813ba235d5582a014a58bd2f417` | F-10 | Refactor internals to preserve `APIRouter` and `APIRoute` instances. | `docs_src/path_operation_advanced_configuration/tutorial002_py310.py`<br>`fastapi/applications.py`<br>`fastapi/openapi/utils.py`<br>`fastapi/routing.py` | `APIRoute`<br>`APIRouter`<br>`__init__`<br>`api_route`<br>`generate_operation_id`<br>`get_fields_from_routes`<br>`get_openapi_operation_metadata`<br>`get_openapi_path`<br>`get_route_handler`<br>`matches`<br>`route`<br>`setup`<br>`websocket` | `tests/test_custom_route_class.py`<br>`tests/test_router_include_context.py` | 1446 | 4304 |
| 65 | `fastapi_15763` | `fastapi/fastapi`<br>`9a9c4ad5d06f5fe8ee6775a5aeaa2f83c854f263` | F-10 | Fix bug, allow empty path in path operation in prefixless router. | `fastapi/routing.py` | — | `tests/test_router_include_context.py` | 22 | 1064 |
| 66 | `fastapi_15785` | `fastapi/fastapi`<br>`202b2d2f5f331db9102b5dbcef071a9e09bed10e` | F-10 | Add `iter_route_contexts()` for advanced use cases that used to use `router.routes` (e.g. Jupyverse). | `fastapi/openapi/utils.py`<br>`fastapi/routing.py` | `_IncludedRouter`<br>`_get_api_route_for_openapi`<br>`_iter_routes_with_context`<br>`get_fields_from_routes` | `tests/test_router_include_context.py` | 138 | 1263 |
| 67 | `fastapi_15800` | `fastapi/fastapi`<br>`f1d750fddad90e2faad6c3cc5c85c7687b787e89` | F-10 | Add support for `app.frontend("/", directory="dist")` and `router.frontend("/", directory="dist")`. | `docs_src/frontend/tutorial001_py310.py`<br>`docs_src/frontend/tutorial002_py310.py`<br>`docs_src/frontend/tutorial003_py310.py`<br>`docs_src/frontend/tutorial004_py310.py`<br>`docs_src/frontend/tutorial005_py310.py`<br>`docs_src/frontend/tutorial006_py310.py`<br>`fastapi/applications.py`<br>`fastapi/routing.py` | `APIRouter`<br>`_build_effective_context`<br>`_get_fastapi_scope`<br>`_get_scope_effective_route_context`<br>`_mark_routes_changed`<br>`api_route`<br>`effective_candidates`<br>`route` | `tests/test_frontend.py` | 804 | 1236 |
| 68 | `rich_3043` | `Textualize/rich`<br>`8a616de8e25db3c93abaaa220c493d80878de69d` | F-11 | Fix HTML export template | `rich/_export_format.py` | — | `tests/test_console.py` | 17 | 286 |
| 69 | `rich_3105` | `Textualize/rich`<br>`9f620dc50c0008c35e9f8493f198e6e593574a70` | F-11 | Fix HTML export font-family inheritance for code | `rich/_export_format.py` | — | `tests/test_console.py` | 11 | 452 |
| 70 | `rich_4070` | `Textualize/rich`<br>`fc41075a3206d2a5fd846c6f41c4d2becab814fa` | F-12 | Improve import time with lazy loading | `rich/_emoji_replace.py`<br>`rich/console.py`<br>`rich/emoji.py`<br>`rich/logging.py`<br>`rich/protocol.py`<br>`rich/repr.py`<br>`rich/segment.py`<br>`rich/syntax.py`<br>`rich/theme.py` | `ControlType`<br>`Emoji`<br>`RichHandler`<br>`__init__`<br>`_caller_frame_info`<br>`auto_rich_repr`<br>`log` | `tests/test_console.py`<br>`tests/test_syntax.py` | 402 | 3096 |
| 71 | `rich_3052` | `Textualize/rich`<br>`7a168a27c5097805b3bafa495f35e3955004ff4a` | F-13 | Make prompt choices case-insensitive | `rich/prompt.py` | `on_validate_error`<br>`process_response` | `tests/test_prompt.py` | 119 | 863 |
| 72 | `rich_3882` | `Textualize/rich`<br>`4d6d631a3d2deddf8405522d4b8c976a6d35726c` | F-13 | Show raw markup on prompt errors | `rich/prompt.py` | `pre_prompt` | `tests/test_prompt.py` | 11 | 652 |
| 73 | `rich_3905` | `Textualize/rich`<br>`96dd4b60e3a7c647c43a85ad375afa690b3bb85b` | F-13 | Avoid blank line from disabled noninteractive Progress | `rich/progress.py` | `__enter__`<br>`stop` | `tests/test_progress.py` | 16 | 1672 |
| 74 | `rich_3934` | `Textualize/rich`<br>`6764b24739b580c0c32ff5ef0b971ed4cfcf4f75` | F-13 | Fix LiveRender height accounting and empty-render newline | `rich/live.py`<br>`rich/live_render.py` | `set_renderable` | `tests/test_live.py` | 42 | 64 |
| 75 | `rich_3063` | `Textualize/rich`<br>`368e8ad77c95a6bef8f9d332039091d1417296bc` | F-14 | Fix escaping a trailing backslash | `rich/markup.py` | — | `tests/test_markup.py` | 20 | 85 |
| 76 | `rich_3064` | `Textualize/rich`<br>`01b85ac116c4635b6ddb8b488be8254be6df2a84` | F-14 | Fix Markdown table rendering | `rich/markdown.py` | — | `tests/test_markdown.py` | 26 | 76 |
| 77 | `rich_3130` | `Textualize/rich`<br>`720800e6930d85ad027b1e9bd0cbb96b5e994ce3` | F-14 | Fix Markdown tables with inline styles and links | `rich/markdown.py` | `ListElement`<br>`__init__`<br>`create`<br>`on_text` | `tests/test_markdown.py` | 31 | 878 |
| 78 | `rich_3469` | `Textualize/rich`<br>`c478588f3c228a4e86741a057c42b452d7bc6bce` | F-14 | Remove extra space above Markdown tables | `rich/markdown.py` | — | `tests/test_markdown.py` | 11 | 75 |
| 79 | `rich_3942` | `Textualize/rich`<br>`c595fa95068dd2c5095d25446b2f0571bc0b3995` | F-14 | Fix Markdown header and table styling | `rich/default_styles.py`<br>`rich/markdown.py` | `CodeBlock`<br>`Heading`<br>`TableElement`<br>`__rich_console__`<br>`create` | `tests/_card_render.py`<br>`tests/test_markdown.py`<br>`tests/test_markdown_no_hyperlinks.py` | 134 | 54 |
| 80 | `rich_4079` | `Textualize/rich`<br>`19c67b9a3479841e9133bea94607c89ee931d3fc` | F-14 | Support inline code in Markdown table cells | `rich/markdown.py` | `ListElement`<br>`on_text` | `tests/test_markdown.py` | 16 | 71 |
| 81 | `rich_3067` | `Textualize/rich`<br>`1ad6f73a4d1d3b40ac3f879feccfaad66412bd1d` | F-15 | Allow tilde in URLs | `rich/highlighter.py` | — | `tests/test_highlighter.py` | 11 | 584 |
| 82 | `rich_3296` | `Textualize/rich`<br>`fde5d6eee3b0437eaecdcbf6f8b11aeab3a5d503` | F-15 | Fix syntax padding with background-color override | `rich/syntax.py` | — | `tests/test_syntax.py` | 13 | 818 |
| 83 | `rich_3454` | `Textualize/rich`<br>`e1e6d745f670ff3df6b8f47377c0a4006cb74066` | F-15 | Fix @ breaking hyperlink highlighting | `rich/highlighter.py` | — | `tests/test_highlighter.py` | 11 | 865 |
| 84 | `rich_3782` | `Textualize/rich`<br>`3b70db5a2997de191f7db3e422dbe4da35ca1c95` | F-15 | Add Syntax padding | `rich/syntax.py` | `Syntax`<br>`__rich_measure__`<br>`from_path` | `tests/test_syntax.py` | 90 | 68 |
| 85 | `rich_2725` | `Textualize/rich`<br>`577def22dd83b999c5937cb2bf2ed49600943325` | F-16 | Fix table box-element rendering order | `rich/table.py` | — | `tests/test_table.py` | 24 | 1779 |
| 86 | `rich_3061` | `Textualize/rich`<br>`aca9467ec6a482b3bed1ba7d2e3de72271c5f817` | F-16 | Extend tabs with styles | `rich/text.py` | `Text`<br>`__rich_console__`<br>`highlight_regex` | `tests/test_panel.py`<br>`tests/test_text.py` | 191 | 411 |
| 87 | `rich_3518` | `Textualize/rich`<br>`5ba9cb56e68dcdf2db50c214d8f1412c8a50761b` | F-16 | Highlight columns added by add_row | `rich/table.py` | — | `tests/test_table.py` | 11 | 658 |
| 88 | `rich_3718` | `Textualize/rich`<br>`7d36119f8378b36129502c3281a7faffef837e02` | F-16 | Apply panel background to panel title | `rich/panel.py` | — | `tests/test_panel.py` | 30 | 749 |
| 89 | `rich_3935` | `Textualize/rich`<br>`fe55a131c2780fa856464ad04d7d6dc8a1079b72` | F-16 | Remove extra first-cell padding in Columns | `rich/table.py` | `_get_padding_width`<br>`_measure_column` | `tests/test_columns.py`<br>`tests/test_table.py` | 54 | 75 |
| 90 | `rich_3278` | `Textualize/rich`<br>`4c5d305bb902ce97011666ada19e48d0b27b49e1` | F-17 | Strip problematic private ANSI sequences | `rich/ansi.py` | — | `tests/test_ansi.py` | 10 | 1216 |
| 91 | `rich_3468` | `Textualize/rich`<br>`ae15db600976a7999d21653002f338d0761b180c` | F-17 | Handle broken pipes and add Console.on_broken_pipe | `rich/console.py` | `_check_buffer` | `tests/test_console.py` | 72 | 146 |
| 92 | `rich_3470` | `Textualize/rich`<br>`0ba607dc080c9f102b5ae5346bcdb70d6e9c969d` | F-17 | Fix record/capture interaction | `rich/console.py` | — | `tests/test_console.py` | 11 | 74 |
| 93 | `rich_3675` | `Textualize/rich`<br>`edc6b0a39b6df1c0e26d409bb5c5eda7149b2de6` | F-17 | Honor TTY_COMPATIBLE and empty NO_COLOR | `rich/console.py`<br>`rich/diagnose.py` | `decorator` | `tests/test_console.py` | 90 | 168 |
| 94 | `rich_3777` | `Textualize/rich`<br>`49117ced6648a432d85951f72dce777038f6ce09` | F-17 | Add TTY_INTERACTIVE environment handling | `rich/console.py`<br>`rich/diagnose.py` | — | `tests/test_console.py` | 49 | 341 |
| 95 | `rich_4075` | `Textualize/rich`<br>`1fc7cb210ae52eb099df39818ddb9569e5b14c7b` | F-17 | Make empty print respect end | `rich/console.py` | — | `tests/test_console.py` | 45 | 101 |
| 96 | `rich_4076` | `Textualize/rich`<br>`9cb198944f8184df92217efc8b20d3fffa4b4fa0` | F-17 | Preserve newlines in Text.from_ansi | `rich/ansi.py` | `decode_line` | `tests/test_ansi.py` | 19 | 71 |
| 97 | `rich_4077` | `Textualize/rich`<br>`58ac15120fe254886c10d6253667733c83604cb4` | F-17 | Proxy FileProxy.isatty | `rich/file_proxy.py` | `fileno` | `tests/test_file_proxy.py` | 9 | 66 |
| 98 | `rich_2943` | `Textualize/rich`<br>`610fd75c433c3dfcd9c296e8b91363979127b9fa` | F-18 | Clear hashed cache when clearing metadata | `rich/style.py` | — | `tests/test_style.py` | 11 | 473 |
| 99 | `rich_3471` | `Textualize/rich`<br>`e2a982d5ea747f0deb7f78e8eaa5b4be7d9194cf` | F-18 | Handle control codes in append_tokens | `rich/text.py` | — | `tests/test_text.py` | 10 | 86 |
| 100 | `rich_3480` | `Textualize/rich`<br>`9ec419154102acce7363e3958bec6c261864d7fb` | F-18 | Prevent infinite loop when appending Text to itself | `rich/text.py` | — | `tests/test_text.py` | 20 | 81 |
| 101 | `rich_3938` | `Textualize/rich`<br>`05ff970926cbd0b5d0acb6fc18cdbd1fc971e582` | F-18 | Fix soft-wrap style newlines and Segment.split_lines_terminator | `rich/console.py`<br>`rich/segment.py` | `split_and_crop_lines` | `tests/test_segment.py`<br>`tests/test_text.py` | 64 | 89 |
| 102 | `rich_3006` | `Textualize/rich`<br>`0c8bb032ad3b54a32fdb8a43f5ab457c8cd6dcb1` | F-19 | Fix custom-class __eq__ breaking repr parameter handling | `rich/repr.py` | — | `tests/test_repr.py` | 11 | 677 |
| 103 | `rich_3472` | `Textualize/rich`<br>`b6f2f7aa5b27f612f391cd28212aff51ad0d42d1` | F-19 | Pretty-print dataclasses with missing fields | `rich/pretty.py` | — | `tests/test_pretty.py` | 13 | 88 |
| 104 | `rich_3486` | `Textualize/rich`<br>`d0de442c08df8793c5ff36d9ad322ca5c47fc38c` | F-19 | Support fine-grained Python 3.11 traceback locations | `rich/default_styles.py`<br>`rich/syntax.py`<br>`rich/traceback.py` | `Syntax`<br>`_get_line_numbers_color`<br>`_process_code`<br>`error`<br>`stylize_range` | `tests/test_traceback.py` | 191 | 98 |
| 105 | `rich_3676` | `Textualize/rich`<br>`2b5d648b2c62960deb6439f4204ed8fa6eb3cf7b` | F-19 | Render traceback exception notes | `rich/default_styles.py`<br>`rich/traceback.py` | `get_locals`<br>`safe_str` | `tests/test_traceback.py` | 79 | 42 |
| 106 | `rich_3772` | `Textualize/rich`<br>`2809954800af15b4027364cebf82390fe23dc194` | F-19 | Extract recursive exceptions correctly | `rich/traceback.py` | `safe_str` | `tests/test_traceback.py` | 90 | 131 |
| 107 | `rich_3894` | `Textualize/rich`<br>`4d6d631a3d2deddf8405522d4b8c976a6d35726c` | F-19 | Handle unusual __qualname__ during inspect | `rich/_inspect.py` | — | `tests/test_inspect.py` | 13 | 1974 |
| 108 | `rich_3180` | `Textualize/rich`<br>`e76f3c3ea78481342e21a7b3328075462ab69c2b` | F-20 | Prevent double-width characters disappearing during wrapping | `rich/_wrap.py`<br>`rich/cells.py` | — | `tests/test_cells.py`<br>`tests/test_text.py` | 183 | 1189 |
| 109 | `rich_3506` | `Textualize/rich`<br>`4101991898ee7a09fe1706daca24af5e1e054862` | F-20 | Fix Segment._split_cells | `rich/segment.py` | `_split_cells` | `tests/test_segment.py` | 34 | 115 |
| 110 | `rich_3521` | `Textualize/rich`<br>`66074922edabeac684434b4d87ee994fb97b0627` | F-20 | Fix Segment.split_cells | `rich/segment.py` | `split_cells` | `tests/test_segment.py` | 53 | 80 |
| 111 | `rich_3535` | `Textualize/rich`<br>`0f2f51b872d14588de3a65968f5cdde6fb5694a3` | F-20 | Fix broken regex with potential performance impact | `rich/cells.py`<br>`rich/segment.py` | — | `tests/test_cells.py` | 30 | 193 |
| 112 | `rich_3930` | `Textualize/rich`<br>`53757bc234cf18977cade41a5b64f3abaccb0b85` | F-20 | Support multi-codepoint glyphs and update UNICODE_VERSION | `rich/__main__.py`<br>`rich/_cell_widths.py`<br>`rich/_unicode_data/__init__.py`<br>`rich/_unicode_data/_versions.py`<br>`rich/_unicode_data/unicode10-0-0.py`<br>`rich/_unicode_data/unicode11-0-0.py`<br>`rich/_unicode_data/unicode12-0-0.py`<br>`rich/_unicode_data/unicode12-1-0.py`<br>`rich/_unicode_data/unicode13-0-0.py`<br>`rich/_unicode_data/unicode14-0-0.py`<br>`rich/_unicode_data/unicode15-0-0.py`<br>`rich/_unicode_data/unicode15-1-0.py`<br>`rich/_unicode_data/unicode16-0-0.py`<br>`rich/_unicode_data/unicode17-0-0.py`<br>`rich/_unicode_data/unicode4-1-0.py`<br>`rich/_unicode_data/unicode5-0-0.py`<br>`rich/_unicode_data/unicode5-1-0.py`<br>`rich/_unicode_data/unicode5-2-0.py`<br>`rich/_unicode_data/unicode6-0-0.py`<br>`rich/_unicode_data/unicode6-1-0.py`<br>`rich/_unicode_data/unicode6-2-0.py`<br>`rich/_unicode_data/unicode6-3-0.py`<br>`rich/_unicode_data/unicode7-0-0.py`<br>`rich/_unicode_data/unicode8-0-0.py`<br>`rich/_unicode_data/unicode9-0-0.py`<br>`rich/cells.py` | — | `tests/test_cells.py`<br>`tests/test_text.py`<br>`tests/test_unicode_data.py` | 12870 | 1224 |
| 113 | `rich_3944` | `Textualize/rich`<br>`36fe3f7ca9becca4777861d5e6e625f5a4a37545` | F-20 | Handle out-of-range Unicode character width | `rich/cells.py` | — | `tests/test_cells.py` | 11 | 63 |
| 114 | `rich_3953` | `Textualize/rich`<br>`1d402e0c59f8765e420a5a4440eb2fca7465d1ae` | F-20 | Handle solo ZWJ and control-code width | `rich/cells.py` | — | `tests/test_cells.py` | 62 | 130 |
| 115 | `rich_4006` | `Textualize/rich`<br>`27701029082052c6541031b6f139097230253900` | F-20 | Fix infinite loop in cells.split_graphemes | `rich/cells.py` | `split_graphemes` | `tests/test_cells.py` | 83 | 96 |
| 116 | `requests_7205` | `psf/requests`<br>`1b40fdd004bfc8ba5301bcf8a6908264e9b6b877` | F-21 | Handle empty netrc entries without malformed authentication | `src/requests/utils.py` | — | `tests/test_utils.py` | 11 | 609 |
| 117 | `requests_6592` | `psf/requests`<br>`0b4d494192de489701d3a2e32acef8fb5d3f042e` | F-22 | Add too_early constant for HTTP 425 | `src/requests/status_codes.py` | — | `tests/test_requests.py` | 11 | 239 |
| 118 | `requests_6757` | `psf/requests`<br>`0e322af87745eff34caffe4df68456ebc20d9068` | F-22 | Test compatibility with urllib3 1.26.x | `src/requests/compat.py`<br>`src/requests/utils.py` | — | `tests/test_requests.py` | 42 | 268 |
| 119 | `requests_7505` | `psf/requests`<br>`6f205ff422bccd5e4c4fc0b64c5f3e7df5181db6` | F-23 | Add hasattr checks for remaining protocol isinstance checks | `src/requests/_types.py`<br>`src/requests/models.py` | `SupportsItems`<br>`items`<br>`read` | `tests/test_requests.py` | 63 | 518 |
| 120 | `httpx_3672` | `encode/httpx`<br>`4acf5c2c37714cc63b5cf71b3e284fca83c90311` | F-24 | Fix server connection handling and keep-alive lifecycle | `src/ahttpx/_parsers.py`<br>`src/ahttpx/_pool.py`<br>`src/ahttpx/_server.py`<br>`src/httpx/_network.py`<br>`src/httpx/_parsers.py`<br>`src/httpx/_pool.py`<br>`src/httpx/_server.py` | `__exit__`<br>`__repr__`<br>`_close`<br>`_handler`<br>`_recv_body`<br>`_serve`<br>`close`<br>`host`<br>`is_idle`<br>`wait` | `tests/test_parsers.py` | 258 | 243 |
| 121 | `requests_7328` | `psf/requests`<br>`cbce031327be4f1b4b5fd041ff4dcaa8efa2ce53` | F-24 | Prevent Response.history from referencing itself | `src/requests/sessions.py` | — | `tests/test_requests.py` | 13 | 580 |
| 122 | `requests_6589` | `psf/requests`<br>`7a13c041dbef42f9f3feb14110f02626f6892e9a` | F-25 | Calculate Content-Length from encoded bytes for emoji and non-ASCII bodies | `src/requests/utils.py` | — | `tests/test_requests.py` | 12 | 237 |
| 123 | `requests_7433` | `psf/requests`<br>`0b401c76b6e80a4eecf3c690085b2553f6e261ca` | F-25 | Detect request bodies implemented through custom __getattr__ | `src/requests/models.py` | — | `tests/test_requests.py` | 15 | 498 |
| 124 | `requests_7502` | `psf/requests`<br>`661970d171d9c3e12e4c789c4768db647d8c4da0` | F-25 | Fix _encode_files detection for __getattr__-based file wrappers | `src/requests/models.py` | — | `tests/test_requests.py` | 13 | 67 |
| 125 | `requests_6629` | `psf/requests`<br>`7a13c041dbef42f9f3feb14110f02626f6892e9a` | F-26 | Make JSONDecodeError deserialization robust | `src/requests/exceptions.py` | `HTTPError` | `tests/test_requests.py` | 19 | 836 |
| 126 | `requests_7309` | `psf/requests`<br>`7407309c8a8a73aa2f4337184025d440bbedab7a` | F-26 | Handle malformed Content-Type parsing | `src/requests/utils.py` | `_parse_content_type_header` | `tests/test_utils.py` | 35 | 406 |
| 127 | `requests_6644` | `psf/requests`<br>`382fc2c0c6c0ef0874bc65bc1175f97c073e5086` | F-27 | Prevent extra leading slash from causing urllib3 to reparse the request URI | `src/requests/adapters.py` | — | `tests/test_adapters.py` | 12 | 295 |
| 128 | `requests_7315` | `psf/requests`<br>`6360477c52303c9445b45fa8744b02d05a2f0905` | F-27 | Preserve duplicate leading slashes in request paths | `src/requests/adapters.py` | — | `tests/test_adapters.py` | 11 | 694 |
| 129 | `requests_7427` | `psf/requests`<br>`b684dcb9bbf3aa557d1238e72062c4a29737dd1c` | F-27 | Avoid greedy no_proxy matching | `src/requests/utils.py` | — | `tests/test_utils.py` | 16 | 394 |

### Appendix D. Complete 27-family roster

Counts sum to 129 and every recovered instance appears exactly once. Values are derived from the public reference index; expected marginal value is a research judgment, not a guaranteed gain.

| Family | Name | Repositories | Count | Median patch | Total patch | One-file | Median statement | Value |
|---|---|---|---:|---:|---:|---:|---:|---|
| F-01 | Authentication & request security | `fastapi/fastapi` | 4 | 96.5 | 713 | 2/4 | 1207.5 | HIGH |
| F-02 | Compatibility, deprecations & warnings | `fastapi/fastapi` | 4 | 486.0 | 3856 | 0/4 | 193.0 | MEDIUM |
| F-03 | Dependency injection & function/annotation handling | `fastapi/fastapi` | 13 | 34 | 1088 | 9/13 | 739 | HIGH |
| F-04 | Documentation & project automation | `fastapi/fastapi` | 3 | 16 | 246 | 3/3 | 204 | MEDIUM |
| F-05 | Errors & developer experience | `fastapi/fastapi` | 2 | 149.0 | 298 | 0/2 | 1734.0 | MEDIUM |
| F-06 | OpenAPI, JSON Schema & schema metadata | `fastapi/fastapi` | 7 | 34 | 399 | 4/7 | 756 | HIGH |
| F-07 | Parameter & request-body parsing | `fastapi/fastapi` | 8 | 15.5 | 147 | 8/8 | 1364.0 | HIGH |
| F-08 | Pydantic, models & type handling | `fastapi/fastapi` | 11 | 33 | 600 | 9/11 | 335 | HIGH |
| F-09 | Responses, SSE & streaming | `fastapi/fastapi` | 7 | 85 | 1537 | 4/7 | 235 | HIGH |
| F-10 | Routing, application APIs & lifecycle | `fastapi/fastapi` | 8 | 114.5 | 2764 | 4/8 | 869.0 | MEDIUM |
| F-11 | Export & output formats | `Textualize/rich` | 2 | 14.0 | 28 | 2/2 | 369.0 | MEDIUM |
| F-12 | Import-time performance | `Textualize/rich` | 1 | 402 | 402 | 0/1 | 3096 | LOW |
| F-13 | Live displays, progress & prompts | `Textualize/rich` | 4 | 29.0 | 188 | 3/4 | 757.5 | HIGH |
| F-14 | Markdown & markup parsing/rendering | `Textualize/rich` | 6 | 23.0 | 238 | 5/6 | 75.5 | HIGH |
| F-15 | Syntax highlighting & URL recognition | `Textualize/rich` | 4 | 12.0 | 125 | 4/4 | 701.0 | HIGH |
| F-16 | Tables, panels & visual layout | `Textualize/rich` | 5 | 30 | 310 | 5/5 | 658 | HIGH |
| F-17 | Terminal detection, ANSI & console I/O | `Textualize/rich` | 8 | 32.0 | 305 | 6/8 | 123.5 | HIGH |
| F-18 | Text & style data-structure internals | `Textualize/rich` | 4 | 15.5 | 105 | 3/4 | 87.5 | HIGH |
| F-19 | Tracebacks, introspection & object representation | `Textualize/rich` | 6 | 46.0 | 397 | 4/6 | 114.5 | HIGH |
| F-20 | Unicode, graphemes & cell-width segmentation | `Textualize/rich` | 8 | 57.5 | 13326 | 5/8 | 122.5 | HIGH |
| F-21 | Authentication configuration | `psf/requests` | 1 | 11 | 11 | 1/1 | 609 | MEDIUM |
| F-22 | Dependency compatibility & HTTP constants | `psf/requests` | 2 | 26.5 | 53 | 1/2 | 253.5 | MEDIUM |
| F-23 | Protocol typing & duck-type compatibility | `psf/requests` | 1 | 63 | 63 | 0/1 | 518 | HIGH |
| F-24 | Redirects & connection/stream lifecycle | `encode/httpx`<br>`psf/requests` | 2 | 135.5 | 271 | 1/2 | 411.5 | HIGH |
| F-25 | Request bodies, file wrappers & content length | `psf/requests` | 3 | 13 | 40 | 3/3 | 237 | HIGH |
| F-26 | Response parsing & exception serialization | `psf/requests` | 2 | 27.0 | 54 | 2/2 | 621.0 | MEDIUM |
| F-27 | URLs, paths & proxy boundary handling | `psf/requests` | 3 | 12 | 39 | 3/3 | 394 | HIGH |

- **F-01 — Authentication & request security (4)**: `fastapi_5624`, `fastapi_13786`, `fastapi_14786`, `fastapi_14978`.
- **F-02 — Compatibility, deprecations & warnings (4)**: `fastapi_14186`, `fastapi_14583`, `fastapi_14605`, `fastapi_14609`.
- **F-03 — Dependency injection & function/annotation handling (13)**: `fastapi_5077`, `fastapi_9555`, `fastapi_9753`, `fastapi_11355`, `fastapi_13920`, `fastapi_14262`, `fastapi_14301`, `fastapi_14372`, `fastapi_14419`, `fastapi_14448`, `fastapi_14458`, `fastapi_14485`, `fastapi_14794`.
- **F-04 — Documentation & project automation (3)**: `fastapi_14487`, `fastapi_14492`, `fastapi_15661`.
- **F-05 — Errors & developer experience (2)**: `fastapi_14077`, `fastapi_14306`.
- **F-06 — OpenAPI, JSON Schema & schema metadata (7)**: `fastapi_13713`, `fastapi_14266`, `fastapi_14455`, `fastapi_14459`, `fastapi_14463`, `fastapi_14791`, `fastapi_14986`.
- **F-07 — Parameter & request-body parsing (8)**: `fastapi_11194`, `fastapi_13537`, `fastapi_14303`, `fastapi_14356`, `fastapi_14360`, `fastapi_14479`, `fastapi_14616`, `fastapi_15589`.
- **F-08 — Pydantic, models & type handling (11)**: `fastapi_12942`, `fastapi_13207`, `fastapi_14246`, `fastapi_14297`, `fastapi_14349`, `fastapi_14361`, `fastapi_14371`, `fastapi_14430`, `fastapi_14482`, `fastapi_14512`, `fastapi_14953`.
- **F-09 — Responses, SSE & streaming (7)**: `fastapi_9425`, `fastapi_14099`, `fastapi_14962`, `fastapi_14964`, `fastapi_15023`, `fastapi_15030`, `fastapi_15588`.
- **F-10 — Routing, application APIs & lifecycle (8)**: `fastapi_14258`, `fastapi_14851`, `fastapi_14873`, `fastapi_15280`, `fastapi_15745`, `fastapi_15763`, `fastapi_15785`, `fastapi_15800`.
- **F-11 — Export & output formats (2)**: `rich_3043`, `rich_3105`.
- **F-12 — Import-time performance (1)**: `rich_4070`.
- **F-13 — Live displays, progress & prompts (4)**: `rich_3052`, `rich_3882`, `rich_3905`, `rich_3934`.
- **F-14 — Markdown & markup parsing/rendering (6)**: `rich_3063`, `rich_3064`, `rich_3130`, `rich_3469`, `rich_3942`, `rich_4079`.
- **F-15 — Syntax highlighting & URL recognition (4)**: `rich_3067`, `rich_3296`, `rich_3454`, `rich_3782`.
- **F-16 — Tables, panels & visual layout (5)**: `rich_2725`, `rich_3061`, `rich_3518`, `rich_3718`, `rich_3935`.
- **F-17 — Terminal detection, ANSI & console I/O (8)**: `rich_3278`, `rich_3468`, `rich_3470`, `rich_3675`, `rich_3777`, `rich_4075`, `rich_4076`, `rich_4077`.
- **F-18 — Text & style data-structure internals (4)**: `rich_2943`, `rich_3471`, `rich_3480`, `rich_3938`.
- **F-19 — Tracebacks, introspection & object representation (6)**: `rich_3006`, `rich_3472`, `rich_3486`, `rich_3676`, `rich_3772`, `rich_3894`.
- **F-20 — Unicode, graphemes & cell-width segmentation (8)**: `rich_3180`, `rich_3506`, `rich_3521`, `rich_3535`, `rich_3930`, `rich_3944`, `rich_3953`, `rich_4006`.
- **F-21 — Authentication configuration (1)**: `requests_7205`.
- **F-22 — Dependency compatibility & HTTP constants (2)**: `requests_6592`, `requests_6757`.
- **F-23 — Protocol typing & duck-type compatibility (1)**: `requests_7505`.
- **F-24 — Redirects & connection/stream lifecycle (2)**: `httpx_3672`, `requests_7328`.
- **F-25 — Request bodies, file wrappers & content length (3)**: `requests_6589`, `requests_7433`, `requests_7502`.
- **F-26 — Response parsing & exception serialization (2)**: `requests_6629`, `requests_7309`.
- **F-27 — URLs, paths & proxy boundary handling (3)**: `requests_6644`, `requests_7315`, `requests_7427`.

### Appendix E. Four-repository module maps

These maps are navigation aids, not claims that only gold files matter. Path frequency comes from the recovered reference index; roles come from upstream module/API organization. Always verify the base commit and follow imports/callers/tests.

#### E.1 FastAPI (67 tasks)

| Module/path | Role in repair | Typical route into it |
|---|---|---|
| `fastapi/routing.py` | APIRoute/APIRouter request handling, response models, dependencies, route configuration | Status/body mismatch, response fields, custom request/response, lifespan/router behavior |
| `fastapi/dependencies/models.py` | `Dependant` graph, security requirements, caches | Dependency overrides, scopes, cache identity, sub-dependency shape |
| `fastapi/dependencies/utils.py` | Signature analysis and request-time dependency solving | Body/query/cookie/header extraction, validation, async context, scopes |
| `fastapi/applications.py` | Application setup, exception handlers, OpenAPI, lifespan | App-level regression, docs URLs, exception routing |
| `fastapi/params.py`, `param_functions.py`, `datastructures.py` | Parameter metadata/defaults/placeholders | Query/Body/Header semantics and default handling |
| `fastapi/_compat/v2.py` | Pydantic v2 fields, schemas, validation adaptation | `model_fields`, core schema, serialization, unions |
| `fastapi/_compat/may_v1.py`, `v1.py`, `shared.py`, `main.py` | Compatibility boundary across Pydantic versions | A v2 fix that must not break v1; shared field/schema logic |
| `fastapi/openapi/utils.py` | OpenAPI paths, operation IDs, callbacks, schemas, security | Generated document differs while runtime behavior may be correct |
| `fastapi/encoders.py` | `jsonable_encoder` conversion and exclusions | Response serialization, custom types, include/exclude |
| `fastapi/responses.py`, `sse.py` | Response rendering and server-sent events | Media type, streaming format, headers |
| `fastapi/exceptions.py`, `exception_handlers.py` | Validation/HTTP/WebSocket exception shapes | Error status/detail and handler selection |
| `fastapi/security/` | Scheme-specific credential extraction and OpenAPI security schemes | Missing/malformed credentials and OAuth scopes |
| `fastapi/utils.py` | Shared field/model/helpers | Cross-layer helper behavior; check every caller |
| `docs_src/` | Executable examples used by tests/docs | Only a target when executable behavior or generated docs are the contract |
| `tests/` | Behavioral oracle and sibling patterns | Find nearest feature test before broad suite runs |

High-frequency public reference files were `dependencies/utils.py` (27), `routing.py` (16), `_compat/v2.py` (13), and `openapi/utils.py` (12). This makes dependency analysis the first repository spine, not a rule to edit those files blindly.

#### E.2 Rich (48 tasks)

| Module/path | Role in repair | Typical route into it |
|---|---|---|
| `rich/console.py` | Render/measure/print pipeline and `ConsoleOptions` | Width, cropping, markup, styles, output artifacts |
| `rich/segment.py` | Segment splitting, cell adjustment, style boundaries | ANSI/table/line splitting and cell-width bugs |
| `rich/cells.py` | Display-cell length/chopping and Unicode width | CJK, emoji, grapheme, zero-width/combining behavior |
| `rich/text.py` | Text construction, wrapping, spans, rendering | Plain text vs markup, styles, overflow, justification |
| `rich/style.py`, `default_styles.py`, `theme.py` | Style parsing/composition/defaults | Incorrect attributes, inheritance, named styles |
| `rich/markdown.py`, `markup.py`, `highlighter.py` | Parsing and token-to-style conversion | Escaping, inline/block constructs, highlighting |
| `rich/syntax.py` | Lexing/highlighting and line rendering | Theme, tokens, line numbers, background |
| `rich/table.py` | Column measurement, rows, borders, padding | Width distribution, overflow, edge/cell layout |
| `rich/panel.py`, `box.py` | Container measurement and borders | Nested widths and padding |
| `rich/live.py`, `live_render.py`, `progress.py` | Dynamic rendering and refresh | Residual lines, transient output, progress layout |
| `rich/traceback.py` | Exception formatting and source excerpts | Width, syntax, frames, locals |
| `rich/ansi.py` | ANSI decoding/sequences | Cursor/control handling and re-rendering |
| `rich/prompt.py` | Input rendering and validation | Defaults, choices, password/input display |
| `rich/repr.py`, `protocol.py` | Rich repr/render protocol | Debugging representations and custom renderables |
| `rich/_emoji_replace.py`, `emoji.py` | Emoji substitution/rendering | Codes, variants, widths |
| Generated Unicode-data modules | Versioned width/emoji tables | Usually regenerate/update intentionally; do not learn bulk lines as generic SFT |

The most frequent public reference files were `console.py` (7), `cells.py` (6), `segment.py` (5), and `markdown.py` (5). The correct invariant is often cell geometry across `Text→Segment→Console`, not a superficial string comparison in one leaf.

#### E.3 Requests (13 tasks)

| Module/path | Role in repair | Typical route into it |
|---|---|---|
| `src/requests/models.py` | `Request`, `PreparedRequest`, `Response`; body/URL/header preparation | Content-Length, streaming body, encoding, redirects/history |
| `src/requests/sessions.py` | Request merging, environment settings, redirect loop, hooks | Session/default merging, proxies, netrc, redirect behavior |
| `src/requests/adapters.py` | Transport boundary, timeout/proxy/cert handling and send | Body passed to urllib3, connection lifecycle, streaming |
| `src/requests/utils.py` | URL, proxy, netrc, encoding and helper logic | Most reusable helper-level fixes; five public references |
| `src/requests/auth.py` | Authentication handlers | Credential rebuild on redirects; avoid unrelated auth changes |
| `src/requests/cookies.py` | Cookie extraction/merging | Redirect/session state; check domain/path semantics |
| `src/requests/exceptions.py` | Public exception taxonomy | Preserve exception type and context |
| `src/requests/status_codes.py` | Status lookup | One focused public task; no broad HTTP semantics rewrite |
| `src/requests/compat.py`, `_types.py` | Compatibility/type surface | Minimal support change, not runtime redesign |
| `tests/` | Prepared-request, session, redirect, utility oracles | Use a local fake/transport test, not external network dependence |

Requests fixes should distinguish a `Response`-like duck type from an actual library `Response`, and a caller-owned stream from a library-owned connection. Those ownership boundaries recur across the small corpus.

#### E.4 HTTPX (1 task)

| Module/path | Role in repair | Caution |
|---|---|---|
| `src/httpx/_models.py` | Request/Response state, headers, content, streaming | First stop for wrapper/stream semantics even if not in the single reference patch |
| `src/httpx/_client.py` | Client lifecycle, redirects, transport calls | Check sync/async sibling symmetry |
| `src/httpx/_content.py` | Byte/text/json/stream encoding | Content-Length and iterator ownership |
| `src/httpx/_transports/` | Connection/transport abstraction | Do not patch transport for a parser/model bug |
| `src/httpx/_network.py`, `_pool.py` | Network/backend and connection pooling | Relevant only for demonstrated connection lifecycle |
| `src/httpx/_parsers.py`, `_server.py` | Test/server parsing utilities in this base tree | Public patch touched both `httpx` and `ahttpx` paths; inspect rather than assume |
| `src/ahttpx/` mirror paths | Alternate compatibility tree present in reference | One-task oddity; verify base commit before treating as production target |

With one HTTPX instance, no repository-specific success rate or family frequency is defensible. The useful map is generic HTTPX architecture and the actual PR/base tree, not a statistical prior.

### Appendix F. Upstream digest for all 129 instances

The digest links the public upstream locator and states the reconstructed behavioral theme. Base commits anchor the era; they are not instructions to apply public patches to hidden tasks.

| Instance | Upstream behavioral digest | Era anchor | Public test targets |
|---|---|---|---|
| `fastapi_5624` | [Fix hierarchical security scope propagation.](https://github.com/fastapi/fastapi/pull/5624) | `c6487ed63205` | `tests/test_security_scopes_dont_propagate.py` |
| `fastapi_13786` | [Use `401` status code in security classes when credentials are missing.](https://github.com/fastapi/fastapi/pull/13786) | `e2354a0a063f` | `tests/test_security_api_key_cookie.py`<br>`tests/test_security_api_key_cookie_description.py`<br>`tests/test_security_api_key_header.py`<br>`tests/test_security_api_key_header_description.py`<br>`tests/test_security_api_key_query.py`<br>`tests/test_security_api_key_query_description.py`<br>`tests/test_security_http_base.py`<br>`tests/test_security_http_base_description.py`<br>`tests/test_security_http_basic_optional.py`<br>`tests/test_security_http_basic_realm.py`<br>`tests/test_security_http_basic_realm_description.py`<br>`tests/test_security_http_bearer.py`<br>`tests/test_security_http_bearer_description.py`<br>`tests/test_security_http_digest.py`<br>`tests/test_security_http_digest_description.py`<br>`tests/test_security_oauth2.py`<br>`tests/test_security_openid_connect.py` |
| `fastapi_14786` | [Strip whitespaces from `Authorization` header credentials.](https://github.com/fastapi/fastapi/pull/14786) | `eacbce24c9d2` | `tests/test_security_http_base.py`<br>`tests/test_security_oauth2_authorization_code_bearer.py` |
| `fastapi_14978` | [Add `strict_content_type` checking for JSON requests.](https://github.com/fastapi/fastapi/pull/14978) | `94a1ee749e63` | `tests/test_strict_content_type_app_level.py`<br>`tests/test_strict_content_type_nested.py`<br>`tests/test_strict_content_type_router_level.py`<br>`tests/test_tutorial/test_body/test_tutorial001.py`<br>`tests/test_tutorial/test_strict_content_type/test_tutorial001.py` |
| `fastapi_14186` | [Fix internal Pydantic v1 compatibility (warnings) for Python 3.14 and Pydantic 2.12.1.](https://github.com/fastapi/fastapi/pull/14186) | `6e49dc029541` | `tests/test_compat.py`<br>`tests/test_get_model_definitions_formfeed_escape.py`<br>`tests/test_response_model_as_return_annotation.py` |
| `fastapi_14583` | [Add deprecation warnings when using `pydantic.v1`.](https://github.com/fastapi/fastapi/pull/14583) | `6513d4daa16a` | `tests/benchmarks/test_general_performance.py`<br>`tests/test_compat_params_v1.py`<br>`tests/test_datetime_custom_encoder.py`<br>`tests/test_filter_pydantic_sub_model/app_pv1.py`<br>`tests/test_get_model_definitions_formfeed_escape.py`<br>`tests/test_pydantic_v1_deprecation_warnings.py`<br>`tests/test_pydantic_v1_v2_01.py`<br>`tests/test_pydantic_v1_v2_list.py`<br>`tests/test_pydantic_v1_v2_mixed.py`<br>`tests/test_pydantic_v1_v2_multifile/main.py`<br>`tests/test_pydantic_v1_v2_noneable.py`<br>`tests/test_read_with_orm_mode.py`<br>`tests/test_response_model_as_return_annotation.py`<br>`tests/test_tutorial/test_pydantic_v1_in_v2/test_tutorial002.py`<br>`tests/test_tutorial/test_pydantic_v1_in_v2/test_tutorial003.py`<br>`tests/test_tutorial/test_pydantic_v1_in_v2/test_tutorial004.py`<br>`tests/test_tutorial/test_request_form_models/test_tutorial002_pv1.py`<br>`tests/test_tutorial/test_schema_extra_example/test_tutorial001_pv1.py` |
| `fastapi_14605` | [Add a custom `FastAPIDeprecationWarning`.](https://github.com/fastapi/fastapi/pull/14605) | `6b53786f626d` | `tests/benchmarks/test_general_performance.py`<br>`tests/test_compat_params_v1.py`<br>`tests/test_pydantic_v1_deprecation_warnings.py`<br>`tests/test_regex_deprecated_body.py`<br>`tests/test_regex_deprecated_params.py`<br>`tests/test_schema_extra_examples.py`<br>`tests/test_tutorial/test_pydantic_v1_in_v2/test_tutorial002.py`<br>`tests/test_tutorial/test_pydantic_v1_in_v2/test_tutorial003.py`<br>`tests/test_tutorial/test_pydantic_v1_in_v2/test_tutorial004.py`<br>`tests/test_tutorial/test_query_params_str_validations/test_tutorial004.py`<br>`tests/test_tutorial/test_request_form_models/test_tutorial002_pv1.py`<br>`tests/test_tutorial/test_schema_extra_example/test_tutorial001_pv1.py` |
| `fastapi_14609` | [Drop support for `pydantic.v1`.](https://github.com/fastapi/fastapi/pull/14609) | `1b3bea8b6be2` | `tests/test_compat.py`<br>`tests/test_compat_params_v1.py`<br>`tests/test_datetime_custom_encoder.py`<br>`tests/test_filter_pydantic_sub_model/app_pv1.py`<br>`tests/test_filter_pydantic_sub_model/test_filter_pydantic_sub_model_pv1.py`<br>`tests/test_get_model_definitions_formfeed_escape.py`<br>`tests/test_inherited_custom_class.py`<br>`tests/test_jsonable_encoder.py` |
| `fastapi_5077` | [Add support for wrapped functions (e.g. `@functools.wraps()`) used with forward references.](https://github.com/fastapi/fastapi/pull/5077) | `930b27e5fa32` | `tests/forward_reference_type.py`<br>`tests/test_wrapped_method_forward_reference.py` |
| `fastapi_9555` | [Handle wrapped dependencies.](https://github.com/fastapi/fastapi/pull/9555) | `4976568fc7cb` | `tests/test_dependency_wrapped.py` |
| `fastapi_9753` | [Allow using dependables with `functools.partial()`.](https://github.com/fastapi/fastapi/pull/9753) | `aee8e78078e8` | `tests/test_dependency_partial.py` |
| `fastapi_11355` | [Fix evaluating stringified annotations in Python 3.10.](https://github.com/fastapi/fastapi/pull/11355) | `811fa898752e` | `tests/test_stringified_annotations_simple.py` |
| `fastapi_13920` | [Add support for PEP695 `TypeAliasType`.](https://github.com/fastapi/fastapi/pull/13920) | `0dd42b746e17` | `tests/test_dependency_pep695.py` |
| `fastapi_14262` | [Add support for dependencies with scopes, support `scope="request"` for dependencies with `yield` that exit before the response is sent.](https://github.com/fastapi/fastapi/pull/14262) | `425a4c5bb1d1` | `tests/test_dependency_yield_scope.py`<br>`tests/test_dependency_yield_scope_websockets.py`<br>`tests/test_tutorial/test_dependencies/test_tutorial008e.py` |
| `fastapi_14301` | [Fix `Depends(func, scope='function')` for top level (parameterless) dependencies.](https://github.com/fastapi/fastapi/pull/14301) | `972a967d5d3f` | `tests/test_dependency_yield_scope.py` |
| `fastapi_14372` | [Make the result of `Depends()` and `Security()` hashable, as a workaround for other tools interacting with these internal parts.](https://github.com/fastapi/fastapi/pull/14372) | `566e3157a551` | `tests/test_depends_hashable.py` |
| `fastapi_14419` | [Cache dependencies that don't use scopes and don't have sub-dependencies with scopes.](https://github.com/fastapi/fastapi/pull/14419) | `63d7a2b99782` | `tests/test_security_scopes.py`<br>`tests/test_security_scopes_sub_dependency.py` |
| `fastapi_14448` | [Fix support for functools wraps and partial combined, for async and regular functions and classes in path operations and dependencies.](https://github.com/fastapi/fastapi/pull/14448) | `c57ac7bdf361` | `tests/test_dependency_wrapped.py` |
| `fastapi_14458` | [Fix using class (not instance) dependency that has `__call__` method.](https://github.com/fastapi/fastapi/pull/14458) | `516169428d2f` | `tests/test_dependency_class.py` |
| `fastapi_14485` | [Fix support for `if TYPE_CHECKING`,  non-evaluated stringified annotations.](https://github.com/fastapi/fastapi/pull/14485) | `60699f306b67` | `tests/test_stringified_annotation_dependency.py` |
| `fastapi_14794` | [Allow `Response` type hint as dependency annotation.](https://github.com/fastapi/fastapi/pull/14794) | `464c359bb03f` | `tests/test_response_dependency.py` |
| `fastapi_14487` | [Update docs about re-raising validation errors, do not include string as is to not leak information.](https://github.com/fastapi/fastapi/pull/14487) | `4a98a6677898` | `tests/test_tutorial/test_handling_errors/test_tutorial004.py` |
| `fastapi_14492` | [Fix example of license identifier in documentation.](https://github.com/fastapi/fastapi/pull/14492) | `a456e92a21d5` | `tests/test_tutorial/test_metadata/test_tutorial001_1.py` |
| `fastapi_15661` | [Automate release preparation.](https://github.com/fastapi/fastapi/pull/15661) | `ee22a4b8ca46` | `tests/test_prepare_release.py` |
| `fastapi_14077` | [Upgrade Starlette supported version range to >=0.40.0,<0.49.0.](https://github.com/fastapi/fastapi/pull/14077) | `16d75d90eb96` | `tests/test_enforce_once_required_parameter.py` |
| `fastapi_14306` | [Improve tracebacks by adding endpoint metadata.](https://github.com/fastapi/fastapi/pull/14306) | `08b09e5236e3` | `tests/test_validation_error_context.py` |
| `fastapi_13713` | [Add OpenAPI `external_docs` parameter to `FastAPI`.](https://github.com/fastapi/fastapi/pull/13713) | `5c1f87c56387` | `tests/main.py`<br>`tests/test_application.py` |
| `fastapi_14266` | [Fix security schemes in OpenAPI when added at the top level app.](https://github.com/fastapi/fastapi/pull/14266) | `2cf04ee30db9` | `tests/test_top_level_security_scheme_in_openapi.py` |
| `fastapi_14455` | [Fix OpenAPI security scheme OAuth2 scopes declaration, deduplicate security schemes with different scopes.](https://github.com/fastapi/fastapi/pull/14455) | `603df6e36f59` | `tests/test_security_oauth2_authorization_code_bearer_scopes_openapi.py` |
| `fastapi_14459` | [Fix OAuth2 scopes in OpenAPI in extra corner cases, parent dependency with scopes, sub-dependency security scheme without scopes.](https://github.com/fastapi/fastapi/pull/14459) | `eb1d50479ba0` | `tests/test_security_oauth2_authorization_code_bearer_scopes_openapi.py`<br>`tests/test_security_oauth2_authorization_code_bearer_scopes_openapi_simple.py` |
| `fastapi_14463` | [Fix OpenAPI duplication of `anyOf` refs for app-level responses with specified `content` and `model` as `Union`.](https://github.com/fastapi/fastapi/pull/14463) | `f2687dc1bb01` | `tests/test_additional_responses_union_duplicate_anyof.py` |
| `fastapi_14791` | [Update `ValidationError` schema to include `input` and `ctx`.](https://github.com/fastapi/fastapi/pull/14791) | `08924400c2c7` | `tests/test_additional_properties.py`<br>`tests/test_additional_properties_bool.py`<br>`tests/test_additional_responses_custom_model_in_callback.py`<br>`tests/test_additional_responses_default_validationerror.py`<br>`tests/test_annotated.py`<br>`tests/test_application.py`<br>`tests/test_dependency_duplicates.py`<br>`tests/test_enforce_once_required_parameter.py`<br>`tests/test_extra_routes.py`<br>`tests/test_filter_pydantic_sub_model_pv2.py`<br>`tests/test_forms_single_param.py`<br>`tests/test_generate_unique_id_function.py`<br>`tests/test_get_model_definitions_formfeed_escape.py`<br>`tests/test_get_request_body.py`<br>`tests/test_include_router_defaults_overrides.py`<br>`tests/test_infer_param_optionality.py`<br>`tests/test_modules_same_name_body/test_main.py`<br>`tests/test_multi_body_errors.py`<br>`tests/test_multi_query_errors.py`<br>`tests/test_no_schema_split.py`<br>`tests/test_openapi_examples.py`<br>`tests/test_openapi_query_parameter_extension.py`<br>`tests/test_openapi_separate_input_output_schemas.py`<br>`tests/test_param_in_path_and_dependency.py`<br>`tests/test_param_include_in_schema.py`<br>`tests/test_put_no_body.py`<br>`tests/test_regex_deprecated_body.py`<br>`tests/test_regex_deprecated_params.py`<br>`tests/test_repeated_dependency_schema.py` |
| `fastapi_14986` | [Refactor logic to handle OpenAPI and Swagger UI escaping data.](https://github.com/fastapi/fastapi/pull/14986) | `2f9c914d440e` | `tests/test_openapi_cache_root_path.py`<br>`tests/test_swagger_ui_escape.py` |
| `fastapi_11194` | [Fix validation error when `File` is declared after `Form` parameter.](https://github.com/fastapi/fastapi/pull/11194) | `a7f2dbe976bf` | `tests/test_file_and_form_order_issue_9116.py` |
| `fastapi_13537` | [Fix support for form values with empty strings interpreted as missing (`None` if that's the default), for compatibility with HTML forms.](https://github.com/fastapi/fastapi/pull/13537) | `3b4b5ab8c819` | `tests/test_form_default.py` |
| `fastapi_14303` | [Fix parsing extra `Form` parameter list.](https://github.com/fastapi/fastapi/pull/14303) | `740ec2787b25` | `tests/test_forms_single_model.py` |
| `fastapi_14356` | [Fix parsing extra non-body parameter list.](https://github.com/fastapi/fastapi/pull/14356) | `6cf40df24d1d` | `tests/test_query_cookie_header_model_extra_params.py`<br>`tests/test_tutorial/test_header_param_models/test_tutorial003.py` |
| `fastapi_14360` | [Fix Query\Header\Cookie parameter model alias.](https://github.com/fastapi/fastapi/pull/14360) | `eead41bf4cf8` | `tests/test_request_param_model_by_alias.py` |
| `fastapi_14479` | [Improve error message for invalid query parameter type annotations.](https://github.com/fastapi/fastapi/pull/14479) | `2b212ddd7604` | `tests/test_invalid_sequence_param.py` |
| `fastapi_14616` | [Fix using `Json[list[str]]` type (issue #10997).](https://github.com/fastapi/fastapi/pull/14616) | `54f8aeeb9a15` | `tests/test_json_type.py` |
| `fastapi_15589` | [Do not accept underscore headers when using `convert_underscores=True` (the default).](https://github.com/fastapi/fastapi/pull/15589) | `22b02e26f9e8` | `tests/test_query_cookie_header_model_extra_params.py` |
| `fastapi_12942` | [Fix tagged discriminated union not recognized as body field.](https://github.com/fastapi/fastapi/pull/12942) | `27c0f7e75fc0` | `tests/test_union_body_discriminator.py` |
| `fastapi_13207` | [Fix OpenAPI schema support for computed fields when using `separate_input_output_schemas=False`.](https://github.com/fastapi/fastapi/pull/13207) | `5126e099bdda` | `tests/test_computed_fields.py` |
| `fastapi_14246` | [Fix separation of schemas with nested models introduced in 0.119.0.](https://github.com/fastapi/fastapi/pull/14246) | `7132a690461c` | `tests/test_no_schema_split.py`<br>`tests/test_pydantic_v1_v2_multifile/test_multifile.py` |
| `fastapi_14297` | [Fix optional sequence handling in `serialize sequence value` with Pydantic V2.](https://github.com/fastapi/fastapi/pull/14297) | `3c54a8f07b70` | `tests/test_compat.py`<br>`tests/test_optional_file_list.py` |
| `fastapi_14349` | [Fix handling of JSON Schema attributes named "$ref".](https://github.com/fastapi/fastapi/pull/14349) | `eaf611f9ee56` | `tests/test_schema_ref_pydantic_v2.py` |
| `fastapi_14361` | [Avoid accessing non-existing "$ref" key for Pydantic v2 compat remapping.](https://github.com/fastapi/fastapi/pull/14361) | `5265c4f5cb4d` | `tests/test_schema_compat_pydantic_v2.py` |
| `fastapi_14371` | [Fix parameter aliases.](https://github.com/fastapi/fastapi/pull/14371) | `3fe6522aaed4` | `tests/test_request_params/test_body/test_list.py`<br>`tests/test_request_params/test_body/test_optional_list.py`<br>`tests/test_request_params/test_body/test_optional_str.py`<br>`tests/test_request_params/test_body/test_required_str.py`<br>`tests/test_request_params/test_cookie/test_optional_str.py`<br>`tests/test_request_params/test_cookie/test_required_str.py`<br>`tests/test_request_params/test_file/test_list.py`<br>`tests/test_request_params/test_file/test_optional.py`<br>`tests/test_request_params/test_file/test_optional_list.py`<br>`tests/test_request_params/test_file/test_required.py`<br>`tests/test_request_params/test_form/test_list.py`<br>`tests/test_request_params/test_form/test_optional_list.py`<br>`tests/test_request_params/test_form/test_optional_str.py`<br>`tests/test_request_params/test_form/test_required_str.py`<br>`tests/test_request_params/test_header/test_list.py`<br>`tests/test_request_params/test_header/test_optional_list.py`<br>`tests/test_request_params/test_header/test_optional_str.py`<br>`tests/test_request_params/test_header/test_required_str.py`<br>`tests/test_request_params/test_path/test_required_str.py`<br>`tests/test_request_params/test_query/test_list.py`<br>`tests/test_request_params/test_query/test_optional_list.py`<br>`tests/test_request_params/test_query/test_optional_str.py`<br>`tests/test_request_params/test_query/test_required_str.py` |
| `fastapi_14430` | [Fix optional sequence handling with new union syntax from Python 3.10.](https://github.com/fastapi/fastapi/pull/14430) | `cff2236dacb7` | `tests/test_compat.py` |
| `fastapi_14482` | [Fix handling arbitrary types when using `arbitrary_types_allowed=True`.](https://github.com/fastapi/fastapi/pull/14482) | `71a17b5932e3` | `tests/test_arbitrary_types.py` |
| `fastapi_14512` | [Fix support for tagged union with discriminator inside of `Annotated` with `Body()`.](https://github.com/fastapi/fastapi/pull/14512) | `1fcec88ad2df` | `tests/test_union_body_discriminator_annotated.py` |
| `fastapi_14953` | [Fix JSON Schema for bytes, use `"contentMediaType": "application/octet-stream"` instead of `"format": "binary"`.](https://github.com/fastapi/fastapi/pull/14953) | `d2c17b603d2f` | `tests/test_request_params/test_file/test_list.py`<br>`tests/test_request_params/test_file/test_optional.py`<br>`tests/test_request_params/test_file/test_optional_list.py`<br>`tests/test_request_params/test_file/test_required.py`<br>`tests/test_tutorial/test_json_base64_bytes/test_tutorial001.py`<br>`tests/test_tutorial/test_request_files/test_tutorial001.py`<br>`tests/test_tutorial/test_request_files/test_tutorial001_02.py`<br>`tests/test_tutorial/test_request_files/test_tutorial001_03.py`<br>`tests/test_tutorial/test_request_files/test_tutorial002.py`<br>`tests/test_tutorial/test_request_files/test_tutorial003.py`<br>`tests/test_tutorial/test_request_forms_and_files/test_tutorial001.py` |
| `fastapi_9425` | [Allow `None` as return type for bodiless responses.](https://github.com/fastapi/fastapi/pull/9425) | `0bdc3ca3732e` | `tests/test_return_none_stringified_annotations.py` |
| `fastapi_14099` | [Fix support for `StreamingResponse`s with dependencies with `yield` or `UploadFile`s, close after the response is done.](https://github.com/fastapi/fastapi/pull/14099) | `861b22c40897` | `tests/test_dependency_after_yield_raise.py`<br>`tests/test_dependency_after_yield_streaming.py`<br>`tests/test_dependency_after_yield_websockets.py`<br>`tests/test_dependency_contextmanager.py`<br>`tests/test_route_scope.py`<br>`tests/test_tutorial/test_dependencies/test_tutorial008c.py` |
| `fastapi_14962` | [Serialize JSON response with Pydantic (in Rust), when there's a Pydantic return type or response model.](https://github.com/fastapi/fastapi/pull/14962) | `1e78a36b7310` | `tests/test_dump_json_fast_path.py`<br>`tests/test_tutorial/test_custom_response/test_tutorial001.py`<br>`tests/test_tutorial/test_custom_response/test_tutorial010.py` |
| `fastapi_14964` | [Deprecate `ORJSONResponse` and `UJSONResponse`.](https://github.com/fastapi/fastapi/pull/14964) | `bc06e4296d58` | `tests/test_deprecated_responses.py`<br>`tests/test_orjson_response_class.py`<br>`tests/test_tutorial/test_custom_response/test_tutorial001.py`<br>`tests/test_tutorial/test_custom_response/test_tutorial001b.py` |
| `fastapi_15023` | [Update docs for responses and new stream with `yield`.](https://github.com/fastapi/fastapi/pull/15023) | `c0836dc1b7f4` | `tests/test_tutorial/test_stream_data/test_tutorial002.py` |
| `fastapi_15030` | [Add support for Server Sent Events.](https://github.com/fastapi/fastapi/pull/15030) | `48d58ae3b6ef` | `tests/test_sse.py`<br>`tests/test_tutorial/test_server_sent_events/test_tutorial001.py`<br>`tests/test_tutorial/test_server_sent_events/test_tutorial002.py`<br>`tests/test_tutorial/test_server_sent_events/test_tutorial003.py`<br>`tests/test_tutorial/test_server_sent_events/test_tutorial004.py`<br>`tests/test_tutorial/test_server_sent_events/test_tutorial005.py` |
| `fastapi_15588` | [Validate Server Sent Event fields to avoid applications from sending broken data.](https://github.com/fastapi/fastapi/pull/15588) | `cb83b83dcf78` | `tests/test_sse.py` |
| `fastapi_14258` | [Show a clear error on attempt to include router into itself.](https://github.com/fastapi/fastapi/pull/14258) | `e94028ab60d1` | `tests/test_router_circular_import.py` |
| `fastapi_14851` | [Re-implement `on_event` in FastAPI for compatibility with the next Starlette, while keeping backwards compatibility.](https://github.com/fastapi/fastapi/pull/14851) | `8e50c55fd90c` | `tests/test_router_events.py` |
| `fastapi_14873` | [Fix `on_startup` and `on_shutdown` parameters of `APIRouter`.](https://github.com/fastapi/fastapi/pull/14873) | `cd31576d5704` | `tests/test_router_events.py` |
| `fastapi_15280` | [Add support for `@app.vibe()`.](https://github.com/fastapi/fastapi/pull/15280) | `6ee87478d821` | `tests/test_vibe.py` |
| `fastapi_15745` | [Refactor internals to preserve `APIRouter` and `APIRoute` instances.](https://github.com/fastapi/fastapi/pull/15745) | `016ab760faba` | `tests/test_custom_route_class.py`<br>`tests/test_router_include_context.py` |
| `fastapi_15763` | [Fix bug, allow empty path in path operation in prefixless router.](https://github.com/fastapi/fastapi/pull/15763) | `9a9c4ad5d06f` | `tests/test_router_include_context.py` |
| `fastapi_15785` | [Add `iter_route_contexts()` for advanced use cases that used to use `router.routes` (e.g. Jupyverse).](https://github.com/fastapi/fastapi/pull/15785) | `202b2d2f5f33` | `tests/test_router_include_context.py` |
| `fastapi_15800` | [Add support for `app.frontend("/", directory="dist")` and `router.frontend("/", directory="dist")`.](https://github.com/fastapi/fastapi/pull/15800) | `f1d750fddad9` | `tests/test_frontend.py` |
| `rich_3043` | [Fix HTML export template](https://github.com/Textualize/rich/pull/3043) | `8a616de8e25d` | `tests/test_console.py` |
| `rich_3105` | [Fix HTML export font-family inheritance for code](https://github.com/Textualize/rich/pull/3105) | `9f620dc50c00` | `tests/test_console.py` |
| `rich_4070` | [Improve import time with lazy loading](https://github.com/Textualize/rich/pull/4070) | `fc41075a3206` | `tests/test_console.py`<br>`tests/test_syntax.py` |
| `rich_3052` | [Make prompt choices case-insensitive](https://github.com/Textualize/rich/pull/3052) | `7a168a27c509` | `tests/test_prompt.py` |
| `rich_3882` | [Show raw markup on prompt errors](https://github.com/Textualize/rich/pull/3882) | `4d6d631a3d2d` | `tests/test_prompt.py` |
| `rich_3905` | [Avoid blank line from disabled noninteractive Progress](https://github.com/Textualize/rich/pull/3905) | `96dd4b60e3a7` | `tests/test_progress.py` |
| `rich_3934` | [Fix LiveRender height accounting and empty-render newline](https://github.com/Textualize/rich/pull/3934) | `6764b24739b5` | `tests/test_live.py` |
| `rich_3063` | [Fix escaping a trailing backslash](https://github.com/Textualize/rich/pull/3063) | `368e8ad77c95` | `tests/test_markup.py` |
| `rich_3064` | [Fix Markdown table rendering](https://github.com/Textualize/rich/pull/3064) | `01b85ac116c4` | `tests/test_markdown.py` |
| `rich_3130` | [Fix Markdown tables with inline styles and links](https://github.com/Textualize/rich/pull/3130) | `720800e6930d` | `tests/test_markdown.py` |
| `rich_3469` | [Remove extra space above Markdown tables](https://github.com/Textualize/rich/pull/3469) | `c478588f3c22` | `tests/test_markdown.py` |
| `rich_3942` | [Fix Markdown header and table styling](https://github.com/Textualize/rich/pull/3942) | `c595fa95068d` | `tests/_card_render.py`<br>`tests/test_markdown.py`<br>`tests/test_markdown_no_hyperlinks.py` |
| `rich_4079` | [Support inline code in Markdown table cells](https://github.com/Textualize/rich/pull/4079) | `19c67b9a3479` | `tests/test_markdown.py` |
| `rich_3067` | [Allow tilde in URLs](https://github.com/Textualize/rich/pull/3067) | `1ad6f73a4d1d` | `tests/test_highlighter.py` |
| `rich_3296` | [Fix syntax padding with background-color override](https://github.com/Textualize/rich/pull/3296) | `fde5d6eee3b0` | `tests/test_syntax.py` |
| `rich_3454` | [Fix @ breaking hyperlink highlighting](https://github.com/Textualize/rich/pull/3454) | `e1e6d745f670` | `tests/test_highlighter.py` |
| `rich_3782` | [Add Syntax padding](https://github.com/Textualize/rich/pull/3782) | `3b70db5a2997` | `tests/test_syntax.py` |
| `rich_2725` | [Fix table box-element rendering order](https://github.com/Textualize/rich/pull/2725) | `577def22dd83` | `tests/test_table.py` |
| `rich_3061` | [Extend tabs with styles](https://github.com/Textualize/rich/pull/3061) | `aca9467ec6a4` | `tests/test_panel.py`<br>`tests/test_text.py` |
| `rich_3518` | [Highlight columns added by add_row](https://github.com/Textualize/rich/pull/3518) | `5ba9cb56e68d` | `tests/test_table.py` |
| `rich_3718` | [Apply panel background to panel title](https://github.com/Textualize/rich/pull/3718) | `7d36119f8378` | `tests/test_panel.py` |
| `rich_3935` | [Remove extra first-cell padding in Columns](https://github.com/Textualize/rich/pull/3935) | `fe55a131c278` | `tests/test_columns.py`<br>`tests/test_table.py` |
| `rich_3278` | [Strip problematic private ANSI sequences](https://github.com/Textualize/rich/pull/3278) | `4c5d305bb902` | `tests/test_ansi.py` |
| `rich_3468` | [Handle broken pipes and add Console.on_broken_pipe](https://github.com/Textualize/rich/pull/3468) | `ae15db600976` | `tests/test_console.py` |
| `rich_3470` | [Fix record/capture interaction](https://github.com/Textualize/rich/pull/3470) | `0ba607dc080c` | `tests/test_console.py` |
| `rich_3675` | [Honor TTY_COMPATIBLE and empty NO_COLOR](https://github.com/Textualize/rich/pull/3675) | `edc6b0a39b6d` | `tests/test_console.py` |
| `rich_3777` | [Add TTY_INTERACTIVE environment handling](https://github.com/Textualize/rich/pull/3777) | `49117ced6648` | `tests/test_console.py` |
| `rich_4075` | [Make empty print respect end](https://github.com/Textualize/rich/pull/4075) | `1fc7cb210ae5` | `tests/test_console.py` |
| `rich_4076` | [Preserve newlines in Text.from_ansi](https://github.com/Textualize/rich/pull/4076) | `9cb198944f81` | `tests/test_ansi.py` |
| `rich_4077` | [Proxy FileProxy.isatty](https://github.com/Textualize/rich/pull/4077) | `58ac15120fe2` | `tests/test_file_proxy.py` |
| `rich_2943` | [Clear hashed cache when clearing metadata](https://github.com/Textualize/rich/pull/2943) | `610fd75c433c` | `tests/test_style.py` |
| `rich_3471` | [Handle control codes in append_tokens](https://github.com/Textualize/rich/pull/3471) | `e2a982d5ea74` | `tests/test_text.py` |
| `rich_3480` | [Prevent infinite loop when appending Text to itself](https://github.com/Textualize/rich/pull/3480) | `9ec419154102` | `tests/test_text.py` |
| `rich_3938` | [Fix soft-wrap style newlines and Segment.split_lines_terminator](https://github.com/Textualize/rich/pull/3938) | `05ff970926cb` | `tests/test_segment.py`<br>`tests/test_text.py` |
| `rich_3006` | [Fix custom-class __eq__ breaking repr parameter handling](https://github.com/Textualize/rich/pull/3006) | `0c8bb032ad3b` | `tests/test_repr.py` |
| `rich_3472` | [Pretty-print dataclasses with missing fields](https://github.com/Textualize/rich/pull/3472) | `b6f2f7aa5b27` | `tests/test_pretty.py` |
| `rich_3486` | [Support fine-grained Python 3.11 traceback locations](https://github.com/Textualize/rich/pull/3486) | `d0de442c08df` | `tests/test_traceback.py` |
| `rich_3676` | [Render traceback exception notes](https://github.com/Textualize/rich/pull/3676) | `2b5d648b2c62` | `tests/test_traceback.py` |
| `rich_3772` | [Extract recursive exceptions correctly](https://github.com/Textualize/rich/pull/3772) | `2809954800af` | `tests/test_traceback.py` |
| `rich_3894` | [Handle unusual __qualname__ during inspect](https://github.com/Textualize/rich/pull/3894) | `4d6d631a3d2d` | `tests/test_inspect.py` |
| `rich_3180` | [Prevent double-width characters disappearing during wrapping](https://github.com/Textualize/rich/pull/3180) | `e76f3c3ea784` | `tests/test_cells.py`<br>`tests/test_text.py` |
| `rich_3506` | [Fix Segment._split_cells](https://github.com/Textualize/rich/pull/3506) | `4101991898ee` | `tests/test_segment.py` |
| `rich_3521` | [Fix Segment.split_cells](https://github.com/Textualize/rich/pull/3521) | `66074922edab` | `tests/test_segment.py` |
| `rich_3535` | [Fix broken regex with potential performance impact](https://github.com/Textualize/rich/pull/3535) | `0f2f51b872d1` | `tests/test_cells.py` |
| `rich_3930` | [Support multi-codepoint glyphs and update UNICODE_VERSION](https://github.com/Textualize/rich/pull/3930) | `53757bc234cf` | `tests/test_cells.py`<br>`tests/test_text.py`<br>`tests/test_unicode_data.py` |
| `rich_3944` | [Handle out-of-range Unicode character width](https://github.com/Textualize/rich/pull/3944) | `36fe3f7ca9be` | `tests/test_cells.py` |
| `rich_3953` | [Handle solo ZWJ and control-code width](https://github.com/Textualize/rich/pull/3953) | `1d402e0c59f8` | `tests/test_cells.py` |
| `rich_4006` | [Fix infinite loop in cells.split_graphemes](https://github.com/Textualize/rich/pull/4006) | `277010290820` | `tests/test_cells.py` |
| `requests_7205` | [Handle empty netrc entries without malformed authentication](https://github.com/psf/requests/pull/7205) | `1b40fdd004bf` | `tests/test_utils.py` |
| `requests_6592` | [Add too_early constant for HTTP 425](https://github.com/psf/requests/pull/6592) | `0b4d494192de` | `tests/test_requests.py` |
| `requests_6757` | [Test compatibility with urllib3 1.26.x](https://github.com/psf/requests/pull/6757) | `0e322af87745` | `tests/test_requests.py` |
| `requests_7505` | [Add hasattr checks for remaining protocol isinstance checks](https://github.com/psf/requests/pull/7505) | `6f205ff422bc` | `tests/test_requests.py` |
| `httpx_3672` | [Fix server connection handling and keep-alive lifecycle](https://github.com/encode/httpx/pull/3672) | `4acf5c2c3771` | `tests/test_parsers.py` |
| `requests_7328` | [Prevent Response.history from referencing itself](https://github.com/psf/requests/pull/7328) | `cbce031327be` | `tests/test_requests.py` |
| `requests_6589` | [Calculate Content-Length from encoded bytes for emoji and non-ASCII bodies](https://github.com/psf/requests/pull/6589) | `7a13c041dbef` | `tests/test_requests.py` |
| `requests_7433` | [Detect request bodies implemented through custom __getattr__](https://github.com/psf/requests/pull/7433) | `0b401c76b6e8` | `tests/test_requests.py` |
| `requests_7502` | [Fix _encode_files detection for __getattr__-based file wrappers](https://github.com/psf/requests/pull/7502) | `661970d171d9` | `tests/test_requests.py` |
| `requests_6629` | [Make JSONDecodeError deserialization robust](https://github.com/psf/requests/pull/6629) | `7a13c041dbef` | `tests/test_requests.py` |
| `requests_7309` | [Handle malformed Content-Type parsing](https://github.com/psf/requests/pull/7309) | `7407309c8a8a` | `tests/test_utils.py` |
| `requests_6644` | [Prevent extra leading slash from causing urllib3 to reparse the request URI](https://github.com/psf/requests/pull/6644) | `382fc2c0c6c0` | `tests/test_adapters.py` |
| `requests_7315` | [Preserve duplicate leading slashes in request paths](https://github.com/psf/requests/pull/7315) | `6360477c5230` | `tests/test_adapters.py` |
| `requests_7427` | [Avoid greedy no_proxy matching](https://github.com/psf/requests/pull/7427) | `b684dcb9bbf3` | `tests/test_utils.py` |

### Appendix G. Per-family retrieval table

Lexical seeds are starting terms, not hardcoded instance answers. Add exact identifiers from the statement, then tests and sibling implementations. Graph expansion is conditional on a concrete structural question.

| Family | Lexical-first seeds and path priors | Graph-assist trigger | Avoid | Draft brain artifact | Value |
|---|---|---|---|---|---|
| F-01 | `APIKeyBase`, `APIKeyCookie`, `APIKeyHeader`, `OpenIdConnect`<br>`fastapi/dependencies/utils.py`, `docs_src/authentication_error_status_code/tutorial001_an.py` | One bounded caller/callee hop across dependency, schema, response, or route layers after the failing layer is known. | Returning 403 where the new contract requires 401.; Stripping only one Authorization scheme or mutating other headers. | `skills/fastapi-request-security/SKILL.md` plus a compact RFC/OAuth checklist. | HIGH |
| F-02 | `_annotation_is_complex`, `annotation_is_pydantic_v1`, `_get_model_config`, `_is_error_wrapper`<br>`fastapi/dependencies/utils.py`, `fastapi/temp_pydantic_v1_params.py` | Use one caller or sibling implementation only when shared behavior or inheritance is implicated. | Training on generated/bulk removal text and teaching large rewrites.; Wrong `stacklevel`, causing warnings to point inside FastAPI. | `repo_navigation/resources/fastapi-version-matrix.md`; normally no standalone skill. | MEDIUM |
| F-03 | `is_gen_callable`, `get_typed_return_annotation`, `get_typed_signature`, `is_async_gen_callable`<br>`fastapi/dependencies/utils.py`, `fastapi/dependencies/models.py` | One bounded caller/callee hop across dependency, schema, response, or route layers after the failing layer is known. | Using `__name__` as callable identity for partials.; Losing `__wrapped__` return annotations or `TYPE_CHECKING` names. | `skills/fastapi-dependant-analysis/SKILL.md` with a callable/annotation decision table. | HIGH |
| F-04 | behavior nouns from statement/title<br>`docs_src/handling_errors/tutorial004.py`, `docs_src/metadata/tutorial001_1_py39.py` | Usually none; inspect imports/configuration only if execution reaches a shared import. | Assuming documentation changes are optional for PASS.; Using a human-readable license name instead of an SPDX identifier. | `repo_navigation/resources/executable-docs-and-automation.md`, not a model-triggered skill by default. | MEDIUM |
| F-05 | `HTTPException`, `RequestValidationError`, `ResponseValidationError`, `ValidationException`<br>`docs_src/handling_errors/tutorial005.py`, `fastapi/exception_handlers.py` | Use one caller or sibling implementation only when shared behavior or inheritance is implicated. | Stringifying structured errors too early.; Adding endpoint data to only one validation exception subclass. | `skills/fastapi-error-contract/SKILL.md` with an error-channel table. | MEDIUM |
| F-06 | `Dependant`, `is_gen_callable`<br>`fastapi/openapi/utils.py`, `fastapi/applications.py` | One bounded caller/callee hop across dependency, schema, response, or route layers after the failing layer is known. | Deduping by name when scopes make requirements distinct.; Deduplicating security schemes but losing top-level registration. | `skills/fastapi-openapi-composition/SKILL.md` with object/scope/escape checklists. | HIGH |
| F-07 | `_get_multidict_value`<br>`fastapi/dependencies/utils.py` | One bounded caller/callee hop across dependency, schema, response, or route layers after the failing layer is known. | Treating empty string, empty list, and missing as one value.; Using Python parameter name after an alias was declared. | `skills/fastapi-request-extraction/SKILL.md`; this is a first-wave artifact for both tracks. | HIGH |
| F-08 | `serialize_sequence_value`, `_get_multidict_value`, `get_default`, `get_model_fields`<br>`fastapi/_compat/v2.py`, `fastapi/_compat.py` | One bounded caller/callee hop across dependency, schema, response, or route layers after the failing layer is known. | Mutating shared model schema dictionaries in place.; Dropping `Annotated` metadata while flattening unions. | `skills/fastapi-pydantic-v2-schema/SKILL.md` with a model/transformation pipeline. | HIGH |
| F-09 | `_prepare_response_content`, `openapi`, `ORJSONResponse`, `UJSONResponse`<br>`fastapi/routing.py`, `fastapi/responses.py` | Use one caller or sibling implementation only when shared behavior or inheritance is implicated. | Running generator cleanup before the stream is consumed.; Changing response-model serialization for endpoints without a declared model. | `skills/fastapi-response-lifecycle/SKILL.md` plus an SSE/ASGI sequence resource. | HIGH |
| F-10 | `APIRouter`, `api_route`, `get_fields_from_routes`, `_merge_lifespan_context`<br>`fastapi/routing.py`, `fastapi/applications.py` | One bounded caller/callee hop across dependency, schema, response, or route layers after the failing layer is known. | Recursive router inclusion without a direct guard.; Losing custom APIRoute/APIRouter subclass instances. | `skills/fastapi-routing-lifecycle/SKILL.md` with route-object and lifespan checklists. | MEDIUM |
| F-11 | behavior nouns from statement/title<br>`rich/_export_format.py` | Use one caller or sibling implementation only when shared behavior or inheritance is implicated. | Overriding browser defaults with an unrelated global selector.; Regenerating huge golden HTML snapshots by hand. | `repo_navigation/resources/rich-export-contract.md`; generic minimal-patch loop plus one CSS checklist. | MEDIUM |
| F-12 | `ControlType`, `Emoji`, `RichHandler`, `_caller_frame_info`<br>`rich/_emoji_replace.py`, `rich/console.py` | Usually none; inspect imports/configuration only if execution reaches a shared import. | Circular `__getattr__` recursion.; Breaking `from rich import X` or documentation references. | `repo_navigation/resources/rich-import-graph.md`; no dedicated runtime skill. | LOW |
| F-13 | `on_validate_error`, `process_response`, `pre_prompt`, `__enter__`<br>`rich/prompt.py`, `rich/progress.py` | Use one caller or sibling implementation only when shared behavior or inheritance is implicated. | Off-by-one height after an empty render.; Writing a newline when Progress is disabled. | `skills/rich-interactive-state/SKILL.md` with state-transition tables. | HIGH |
| F-14 | `ListElement`, `create`, `on_text`, `CodeBlock`<br>`rich/markdown.py`, `rich/markup.py` | Use one caller or sibling implementation only when shared behavior or inheritance is implicated. | Flattening inline children to plain text.; Adding blank lines at both parent and child levels. | `skills/rich-markdown-composition/SKILL.md` with block/inline/context matrix. | HIGH |
| F-15 | `Syntax`, `__rich_measure__`, `from_path`<br>`rich/highlighter.py`, `rich/syntax.py` | Use one caller or sibling implementation only when shared behavior or inheritance is implicated. | Adding padding in render but forgetting measurement.; Overriding the user background with the theme default. | `skills/rich-syntax-and-highlights/SKILL.md` with measurement/style and regex boundary checks. | HIGH |
| F-16 | `Text`, `__rich_console__`, `highlight_regex`, `_get_padding_width`<br>`rich/table.py`, `rich/text.py` | Trace one render/measure/cell caller chain when a leaf fix would break a shared invariant. | Padding first/last cell twice.; Highlighting only rows present at construction. | `skills/rich-layout-style-regions/SKILL.md` with region/style/phase table. | HIGH |
| F-17 | `_check_buffer`, `decorator`, `decode_line`, `fileno`<br>`rich/console.py`, `rich/ansi.py` | Trace one render/measure/cell caller chain when a leaf fix would break a shared invariant. | Boolean-parsing environment values against the documented presence semantics.; Dropping newline-only ANSI input. | `skills/rich-console-io/SKILL.md` with stream/capability/environment matrix. | HIGH |
| F-18 | `split_and_crop_lines`<br>`rich/text.py`, `rich/style.py` | Trace one render/measure/cell caller chain when a leaf fix would break a shared invariant. | Iterating and appending to the same mutable sequence.; Leaving hash/equality caches stale after metadata reset. | `skills/rich-text-segment-invariants/SKILL.md` with mutation/cache/iterator checks. | HIGH |
| F-19 | `safe_str`, `Syntax`, `_get_line_numbers_color`, `_process_code`<br>`rich/traceback.py`, `rich/default_styles.py` | Trace one render/measure/cell caller chain when a leaf fix would break a shared invariant. | Infinite recursion on self-referential exception causes/context.; Rendering notes repeatedly at every chain level. | `skills/rich-safe-introspection/SKILL.md` with hostile-object and exception-chain checklist. | HIGH |
| F-20 | `_split_cells`, `split_cells`, `split_graphemes`<br>`rich/cells.py`, `rich/segment.py` | Trace one render/measure/cell caller chain when a leaf fix would break a shared invariant. | Loop failing to advance on ZWJ/control/empty regex match.; Indexing width tables with an invalid/out-of-range codepoint. | `skills/unicode-cell-segmentation/SKILL.md` plus a versioned UAX #29/#11 resource; exclude generated data from prompt preload. | HIGH |
| F-21 | behavior nouns from statement/title<br>`src/requests/utils.py` | Use one caller or sibling implementation only when shared behavior or inheritance is implicated. | Turning empty tuple/login into `":"` credentials.; Broad exception handling that hides malformed netrc files. | `repo_navigation/resources/requests-auth-precedence.md`; no dedicated skill needed for one task. | MEDIUM |
| F-22 | behavior nouns from statement/title<br>`src/requests/status_codes.py`, `src/requests/compat.py` | Use one caller or sibling implementation only when shared behavior or inheritance is implicated. | Wrong reason phrase or numeric key.; Importing a symbol that exists only in one urllib3 major line. | `repo_navigation/resources/http-version-compat.md` with status/feature-detection checks. | MEDIUM |
| F-23 | `SupportsItems`, `items`, `read`<br>`src/requests/_types.py`, `src/requests/models.py` | Use one caller or sibling implementation only when shared behavior or inheritance is implicated. | Runtime Protocol checks raising TypeError for non-method members.; Using `callable(getattr(...))` in a way that triggers surprising dynamic behavior repeatedly. | `skills/requests-duck-type-boundaries/SKILL.md`, shared with F-25. | HIGH |
| F-24 | `__exit__`, `__repr__`, `_close`, `_handler`<br>`src/ahttpx/_parsers.py`, `src/ahttpx/_pool.py` | Follow one ownership/call path across request/session/transport only when stream or redirect state crosses the boundary. | Appending a response to its own history list by aliasing.; Reusing a parser before the prior request body is complete. | `skills/http-connection-lifecycle/SKILL.md` with redirect-list and keep-alive state machines. | HIGH |
| F-25 | behavior nouns from statement/title<br>`src/requests/models.py`, `src/requests/utils.py` | Follow one ownership/call path across request/session/transport only when stream or redirect state crosses the boundary. | Calling dynamic attributes repeatedly and changing object state.; Misclassifying strings/mappings as generic iterables. | `skills/requests-body-encoding/SKILL.md` shared with F-23. | HIGH |
| F-26 | `HTTPError`, `_parse_content_type_header`<br>`src/requests/exceptions.py`, `src/requests/utils.py` | Use one caller or sibling implementation only when shared behavior or inheritance is implicated. | Dropping `doc`/`pos` during exception reconstruction.; Catching all ValueError and hiding unrelated parsing defects. | `repo_navigation/resources/requests-parsing-exceptions.md`. | MEDIUM |
| F-27 | behavior nouns from statement/title<br>`src/requests/adapters.py`, `src/requests/utils.py` | Follow one ownership/call path across request/session/transport only when stream or redirect state crosses the boundary. | Collapsing `//` where the server treats it as significant.; Fixing leading slash in one scheme/path branch only. | `skills/requests-url-proxy-boundaries/SKILL.md` with URL pipeline and host-match table. | HIGH |

### Appendix H. Token/time arithmetic

All token allocations below are **planning envelopes**, not measured tokenizer counts or official limits. Probe the served context, count tokens with the actual template, and include tool schemas/thoughts as served. Output limits are per generation, not a whole-run allowance.

| Component | 31B envelope | E4B envelope | Control |
|---|---:|---:|---|
| System/kernel + tool/schema allowance | 2,048 | 2,048 | Compact static instructions |
| Statement + metadata | 3,072 | 3,072 | Preserve raw statement; structure separately |
| Retrieved code/test/tool output | 10,240 | 8,192 | Line windows, capped search output |
| Dialogue/history/working reserve | 8,192 | 11,264 | Trim stale outputs; preserve required tool-call thoughts |
| Current generation max | 6,144 | 4,096 | Includes any served thinking allocation as applicable |
| Safety reserve | 3,072 | 4,096 | Absorb template/schema variance |
| **Total** | **32,768** | **32,768** | Hypothesis until actual `max_model_len` is verified |

The larger E4B dialogue reserve is not extra reasoning capacity; it protects against truncation in a shorter-output loop. If history grows, remove stale file contents before current code/diff/test output. Never discard thinking content from tool-call turns when the official template requires preserving it.

**Aggregate wall clock.** Let \(H=720\) minutes, \(R\) be startup/drain/contingency reserve, and \(N\) the number of sequentially processed tasks. The required average is \(t_{avg}\le(H-R)/N\), independent of a higher per-task timeout.

| Scenario | Arithmetic | Consequence |
|---|---|---|
| 120 tasks, 60 reserve | (720−60)/120 = **5.5 min/task** | Baseline planning average |
| 120 tasks at 6 min each | 720 min | Zero startup/drain slack |
| 120 tasks at 5 min each | 600 min | 120 min gross slack |
| 120 tasks at 7 min each | 840 min | 120 min over budget |
| 100 tasks, 60 reserve | 660/100 = **6.6 min/task** | More slack only if count/accounting confirmed |
| 140 tasks, 60 reserve | 660/140 ≈ **4.71 min/task** | Requires earlier triage |
| 31B internal average 5:15 | 120×5.25 = 630 min | 90 min gross slack |
| E4B internal average 4:00 | 120×4 = 480 min | 240 min gross slack |

Concurrency changes the formula: measure makespan and per-worker queues rather than summing task times blindly. Setup inclusion and validation exclusion must be verified against the live rules.

**Paired-noise arithmetic.** For two runs on the same \(n\) tasks with \(q=b+c\) discordant outcomes, a rough 95% half-width for the PASS difference is \(1.96\sqrt{q}/n\), expressed as a proportion.

| n | q | Approximate half-width |
|---:|---:|---:|
| 129 | 20 | 6.8 percentage points |
| 129 | 40 | 9.6 percentage points |
| 58 | 12 | 11.7 percentage points |
| 58 | 20 | 15.1 percentage points |

For Fatu’s same-setting comparison, all 20 E4B successes were also 31B successes: \(b=31,c=0\), and exact two-sided McNemar \(p=2(1/2)^{31}\approx9.31\times10^{-10}\). That supports a model difference **within that configuration**, not a universal hidden-set effect size. The separate adapter comparison’s \(p=0.23\) is not persuasive evidence of improvement.

Wilson 95% intervals for the observed public-run proportions are 51/129 = 39.5% (31.5–48.2%) and 20/129 = 15.5% (10.3–22.7%). They describe binomial uncertainty for those runs, while paired tests are preferred for comparing configurations.

**Expected-score scenarios—not forecasts.** For a hypothetical 120-task hidden set, rounded solved counts are:

| Track | Low scenario | Middle scenario | High scenario |
|---|---:|---:|---:|
| 31B | 20% → 24 | 30% → 36 | 40% → 48 |
| E4B | 8% → 10 | 12% → 14 | 18% → 22 |

These values are scenario arithmetic for capacity planning. They are not calibrated from the hidden distribution and must not be presented as leaderboard predictions.

### Appendix I. LoRA configuration matrix

No training was run. Values are conservative starting hypotheses for a single-24-GB-class GPU and must pass the gates in §12 before scale-up.

| Field | 31B unified adapter | E4B direct-SFT arm | E4B distillation arm |
|---|---|---|---|
| Base | Exact `gemma-4-31b-it-qat-w4a16-ct` digest | Exact E4B QAT digest | Same exact E4B digest as direct arm |
| Method | PEFT LoRA on quantized base if supported | Same | Same data/action schema; 31B teacher actions |
| Rank | 16 | 8 initial; 16 second arm | Match direct arm for paired comparison |
| Alpha | 32 | 16 for r8; 32 for r16 | Match direct arm |
| Dropout | 0.05 starting point | 0.05 | Match direct arm |
| Targets | Attention q/k/v/o and MLP gate/up/down projections after target report | Same | Same |
| Exclusions | Embeddings, lm_head, multimodal tower, PLE/shared-KV/special modules unless separately justified | Same plus architecture-specific shared modules | Same |
| Precision | BF16 adapter/master compute where supported; base stays QAT | Same | Same |
| Sequence | 2048 start; 4096 after memory/quality gate | 2048 start | Match direct arm |
| Microbatch / accumulation | 1 / 16 | 1 / 16 | Match direct arm |
| Gradient checkpointing | On | On | On |
| Learning rate | 1e-4 starting sweep point | 1e-4 starting sweep point | Same initial; sweep only after paired baseline |
| Schedule | Cosine or linear with 3% warmup; fixed within comparison | Same | Same |
| Epochs | 1 initial; compare 2 only on held-out PASS | Same | Same |
| Family cap | ≤20% examples/family | Same | Same |
| Generic/unseen data | ≥30% | Same | Same |
| Checkpoint selection | Held-out agent PASS + trajectory health | Same | Same |
| Merge/serving | Adapter binding first; merge only if validated | Same | Same |

Mandatory gates: exact compressed-tensors load; nonempty intended target-module report; forward/backward smoke at 512 then 2048 tokens; saved/reloaded tensor mapping; vLLM adapter binding; measurable base-versus-adapter output/logit difference; and no regression on generic/unseen tasks. A smaller loss with worse loops/timeouts is a failed run.

### Appendix J. License-compliance screen

This is a release-planning screen, not legal advice. Recheck the exact license file and version for anything actually vendored. Reading public code or reporting facts does not grant redistribution rights. Keep code, documentation, model weights, datasets, and generated artifacts as separate provenance categories.

| Resource | License/provenance position | Planned use | Release action |
|---|---|---|---|
| New YAML, prompts, `SKILL.md`, original concise notes | Created for this project | Submission brain | Suitable for intended Apache-2.0 release, subject to competition rules; add copyright/notice |
| Gemma 4 model/QAT weights | Governed by Gemma terms, not presumed Apache-2.0 ([Gemma terms](https://ai.google.dev/gemma/terms)) | Download/use permitted base and adapters | Do not relicense weights; record exact model/revision/terms |
| FastAPI source/docs | MIT upstream ([license](https://github.com/fastapi/fastapi/blob/master/LICENSE)) | Read behavior; write original summaries | Preserve MIT notice for any copied code/text; prefer original notes |
| Rich source/docs | MIT upstream ([license](https://github.com/Textualize/rich/blob/master/LICENSE)) | Same | Same; generated Unicode data may carry additional provenance |
| Requests source/docs | Apache-2.0 upstream ([license](https://github.com/psf/requests/blob/main/LICENSE)) | Same | Preserve notice for copied material |
| HTTPX source/docs | BSD-3-Clause upstream ([license](https://github.com/encode/httpx/blob/master/LICENSE.md)) | Same | Preserve BSD notice for copied material |
| ADK/vLLM/Transformers/PEFT code | Generally permissive upstream projects; exact files/version still require review | API/reference research | Do not vendor unless needed; retain exact notices |
| IETF RFCs | IETF Trust legal provisions apply | Link and short attributed quotations | Avoid wholesale vendoring; cite section and preserve required notices for excerpts |
| Unicode UAX/data | Unicode license/terms and specific data-file notices | Behavioral summaries; possible regeneration | Record Unicode version and notices; do not imply Apache origin |
| OpenAPI/JSON Schema/ASGI/CommonMark/SSE | Specifications have their own document copyrights/licenses | Normative behavior notes | Link; write original explanations; review before copying tables or long text |
| Public graph benchmark dataset | No license file found in recovered local snapshot | Compute/report aggregate facts; retain source URL | Do not redistribute wholesale in winner bundle without explicit permission/license |
| Fatu/Happy/Elamurg retrieved snapshots | No `LICENSE*`/`COPYING*` file found in local snapshots | Read architecture/results; cite | Treat code as not licensed for copying; do not vendor code/prompts wholesale |
| Clavis/Aeris/kb2326 and other community work | Verify each upstream license before reuse | Comparative research | Citation only unless license and attribution are confirmed |
| Training trajectories generated from public tasks | Mix of upstream code, statement, model output, and new annotations | Local training only after split/dedupe | Provenance manifest; avoid redistributing upstream/gold material in release |
| Third-party icons/images/fonts | Not needed by the agent brain | None | Avoid; if added, record license and notice separately |

The safe default is **links + original behavioral summaries + tiny necessary attributed excerpts**, not a large vendored documentation corpus. A file without a license is not public domain. Generated summaries can still be derivative if they closely track expressive text, so write from behavioral facts and keep source provenance.

### Appendix K. Contradiction log

| ID | Evidence on each side | Decision and confidence | Closure condition |
|---|---|---|---|
| C-01 | Official native 256K/128K vs community served 32768 | Both address different layers; plan to 32K, Medium | Starter/runtime reports actual context and tokenizer accounting |
| C-02 | Core nine tools vs ADK three skill loaders/community eleven-plus | Tool exposure is configuration-dependent, Medium-Low | Runtime lists callable names and schemas |
| C-03 | Aggregate 12-hour wording vs differing setup/validation interpretations | Reserve aggregate time; exact inclusion unresolved, Medium | Current rules/staff clarification and measured run accounting |
| C-04 | Model-card sampling and public sample configs vs 0.1/0.2 entrant settings | No official optimum; all non-model-card values hypotheses, High | Paired PASS/trajectory sweeps |
| C-05 | Public leaderboard scores vs local 129-task results | Incomparable without matched environment/date/config, High | Raw outcomes and full config for each comparison |
| C-06 | 109/129, 112/129, 33/33 gold baselines | Harness-specific denominators; no pooled “gold ceiling,” High | Frozen validator reports eligible/defective tasks |
| C-07 | Handoff graph-first preference vs file/node/E4B lexical evidence | Lexical-first, graph-assisted, Medium-High | End-to-end ablation on target harness reverses result |
| C-08 | E4B useful cheap proxy vs large paired model gap | Limited qualitative proxy only, High for reported setting | Target-track paired evidence |
| C-09 | ADK Gemini-only general config docs vs Gemma competition use | Competition custom compiler is separate authority, High | Official starter compile/smoke |
| C-10 | `repo_navigation/` underscore vs ADK kebab-case skill rule | Treat as separate custom resource until registered, Medium | Tool registration and L1/L2/L3 smoke |

No contradiction is resolved by choosing the more convenient number. Dates, source ranks, denominators, and environment labels remain attached wherever the conflict affects a decision.

### Appendix L. Grouped source list

All web sources in this appendix were accessed or rechecked by **2026-11-02**, unless a narrower date is stated. Instance-specific upstream PR links appear in Appendix F and family-specific normative links appear in §4.

#### Competition, ADK, serving, and models

- [Kaggle competition overview](https://www.kaggle.com/competitions/gemma-4-developer-agent); [evaluation](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview/evaluation); [official starter notebook](https://www.kaggle.com/code/ryanholbrook/getting-started-gemma-4-developer-agent).
- [ADK Agent Config](https://adk.dev/agents/config/); [ADK Skills](https://adk.dev/skills/).
- [vLLM Gemma 4 recipe](https://docs.vllm.ai/projects/recipes/en/stable/Google/Gemma4.html); [vLLM tool calling](https://docs.vllm.ai/en/latest/features/tool_calling.html).
- [Gemma 4 31B IT](https://huggingface.co/google/gemma-4-31B-it); [Gemma 4 E4B IT](https://huggingface.co/google/gemma-4-E4B-it); corresponding official QAT configuration artifacts cited in §2.
- [Transformers compressed-tensors documentation](https://huggingface.co/docs/transformers/main/en/quantization/compressed_tensors); [PEFT documentation](https://huggingface.co/docs/peft/).
- [Gemma terms](https://ai.google.dev/gemma/terms).

#### Public implementations and measurements

- [Fatu `gemma4-dev-agent`](https://github.com/fatu/gemma4-dev-agent), especially dated `RESULTS.md`, public arm prompts/configs, and failure analyses.
- [Happy `gemma-swe-agent`](https://github.com/happyc0der/gemma-swe-agent), early harness and validation reports.
- [Elamurg `gemma-4-dev`](https://github.com/elamurg/gemma-4-dev), conceptual analyzer/coder material; not treated as measured.
- [HIMANSHUKUMARJHA graph-retrieval benchmark](https://huggingface.co/datasets/HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark), recovered task index, audit, summaries, per-task CSV, and sample submission.
- [Clavis `who-reads-the-code-map`](https://github.com/clavis-systems/who-reads-the-code-map), preregistered static/agent retrieval comparisons.
- [Aeris Competition](https://github.com/belemcrizan/Aeris_Competition), architecture and validation design; README explicitly lacks measured results.
- [kb2326 GitHub profile/repositories](https://github.com/kb2326), Ask-or-Enforce preregistered prompt/planning study.

#### Upstream repositories and history

- [FastAPI repository](https://github.com/fastapi/fastapi) and [release notes](https://github.com/fastapi/fastapi/blob/master/docs/en/docs/release-notes.md); 67 PR locators in Appendix F.
- [Rich repository](https://github.com/Textualize/rich) and [changelog](https://github.com/Textualize/rich/blob/master/CHANGELOG.md); 48 PR locators in Appendix F.
- [Requests repository](https://github.com/psf/requests) and [history](https://github.com/psf/requests/blob/main/HISTORY.md); 13 PR locators in Appendix F.
- [HTTPX repository](https://github.com/encode/httpx) and [changelog](https://github.com/encode/httpx/blob/master/CHANGELOG.md); one PR locator in Appendix F.
- [Pydantic documentation](https://docs.pydantic.dev/); [Starlette documentation](https://www.starlette.io/); [Pytest documentation](https://docs.pytest.org/).

#### Normative standards and domain documentation

- [RFC 9110 HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html); [RFC 9112 HTTP/1.1](https://www.rfc-editor.org/rfc/rfc9112.html); [RFC 3986 URI](https://www.rfc-editor.org/rfc/rfc3986.html); [RFC 6749 OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749.html).
- [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0.html); [JSON Schema 2020-12](https://json-schema.org/draft/2020-12); [ASGI specification](https://asgi.readthedocs.io/en/latest/specs/main.html).
- [Unicode UAX #29 text segmentation](https://www.unicode.org/reports/tr29/); [Unicode UAX #11 East Asian Width](https://www.unicode.org/reports/tr11/).
- [CommonMark specification](https://spec.commonmark.org/); [WHATWG HTML—server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html).

### Appendix M. Search/research log

The log records workstreams and outcomes rather than pretending every query or page was accessible. Repeated retries/mirrors are not counted as independent evidence.

| Step | Research action | Outcome / limitation |
|---:|---|---|
| 1 | Read handoff and map RQ/VQ/SQ, required structure, integrity constraints | Plan converted to research and audit checklist |
| 2 | Check original CSV/JSONL attachment paths | Both absent; no direct-inspection claim made |
| 3 | Retrieve Kaggle overview/evaluation/starter surfaces | Search-visible facts recovered; direct pages often interstitial |
| 4 | Try unauthenticated Kaggle data access | 401; no bypass attempted |
| 5 | Search official ADK Agent Config/custom tools/includes/sub-agents | General contract established; Gemma compiler kept separate |
| 6 | Search official ADK Skills loading/validation | L1/L2/L3, tool names, naming constraints established |
| 7 | Search official vLLM Gemma 4 serving/tool/reasoning guidance | Parser/template requirements established; exact competition version open |
| 8 | Retrieve official 31B/E4B cards/configs/templates | Direct HF timeouts; official raw files recovered via mirror |
| 9 | Compare official model architecture and benchmark evidence | Track differences grounded; sampling defaults not treated as optima |
| 10 | Recover complete alternate 129-task public index | Unique IDs/repositories/base commits/files/functions/tests verified |
| 11 | Audit public graph benchmark JSON/CSV/config | File/node denominators and retrieval metrics recomputed |
| 12 | Retrieve FastAPI release notes and PR locators | All 67 behavioral titles/family boundaries reconstructed |
| 13 | Retrieve Rich changelog and direct PR pages | All 48 titles reconstructed; generated-data outlier identified |
| 14 | Retrieve Requests history and PR pages | All 13 titles reconstructed |
| 15 | Retrieve HTTPX history/direct PR | Single instance confirmed; no repository frequency inference |
| 16 | Programmatically reconcile taxonomy and task statistics | Exactly 27 families, 129 unique assignments; counts/statistics generated |
| 17 | Research Fatu harness/arms/results/failures | Dated paired evidence and configuration/failure taxonomy extracted |
| 18 | Research Happy/Elamurg public work | Early measured lessons separated from conceptual placeholders |
| 19 | Research Clavis preregistered retrieval/agent study | Independent lexical-first and low-map-use evidence found |
| 20 | Research Aeris/kb2326 and other public leads | Unmeasured architecture separated from preregistered prompt evidence |
| 21 | Research standards for touched behavioral domains | HTTP/OAuth/URI/OpenAPI/JSON Schema/ASGI/Unicode/CommonMark/SSE linked |
| 22 | Research quantized PEFT/LoRA support and constraints | Recipe drafted; actual 24-GB/Gemma 4 operation left probe-gated |
| 23 | Compute noise/time/score scenarios | Wilson/McNemar/time formulas and rounded scenario counts checked |
| 24 | Screen retrieved resources for license files | No license files in three community snapshots; copying prohibited by default |
| 25 | Draft shared kernel, two shells, 27 dossiers, training/evaluation plan | No tasks solved, training executed, or submission archive produced |
| 26 | Generate static figures and inspect them | Corpus, retrieval, and architecture figures embedded by relative path |
| 27 | Run final structural/numerical/integrity audit | Results recorded in delivery note; remaining evidence gaps stay explicit |

**Stopping assessment.** All 27 dossiers and required appendices are covered. The highest-value unresolved items are runtime contract probes that cannot be answered from inaccessible official internals. Further broad searching has lower expected value than implementing the P0/P1 probes; the report therefore stops with those gaps visible rather than manufacturing certainty.


---

<!-- ====================================================================== -->
<!-- FILE: 06_swe-bench-vs-gemma-4-developer-agent-scoring-2026-11-02.md -->
<!-- ====================================================================== -->

# SWE-bench vs. the Kaggle Gemma 4 Developer Agent Competition: What the Scores Mean

*Research scope: This report compares the main, automated Agent Track of Google’s Kaggle Gemma 4 Developer Agent Competition with SWE-bench, especially SWE-bench Verified. It examines task-level success, aggregation formulas, denominators, leaderboard splits, evaluation constraints, statistical granularity, and whether the resulting numbers can be compared. The separate human-judged Paper Track is covered only to prevent confusion.*

*As of: 2026-11-02. The Kaggle competition is live and its rules, leaderboard, and harness documentation may change. Kaggle’s pages are client-rendered and some competition files require joining the competition; those access limits are noted where they affect confidence.*

## Executive summary

The two scores belong to the same broad family: **an agent receives a repository and an issue, produces a patch, and receives credit only when execution-based validation succeeds**. Both aggregate binary, equally weighted task outcomes; neither headline score is the percentage of individual tests passed, patch similarity to a reference solution, or a human code-quality rating.

The practical formulas are nevertheless embedded in different protocols. A complete SWE-bench leaderboard result is normally **resolved tasks divided by all tasks in the named dataset**—500 for Verified—whereas Kaggle calculates separate public- and private-leaderboard results over different halves of roughly 120 hidden tasks. Kaggle displays values such as `0.22`, so `0.22` means approximately **22%**, not 0.22%. Its private split, not the public split, determines the final competition ranking.

A 20% Kaggle result and a 20% SWE-bench Verified result are **not equivalent measurements of coding ability**. The tasks, difficulty distribution, repository visibility, model and agent constraints, time budget, and denominator differ. Kaggle’s score is especially tightly coupled to a constrained Gemma 4 system completing all tasks within a shared 12-hour generation budget; SWE-bench’s general Verified leaderboard accommodates varied models and agent systems, while its Bash Only view provides a more controlled model comparison.

The safest interpretation is therefore: **same scoring concept, different measurement instruments**. Report the raw resolved/total counts and the exact benchmark or leaderboard split alongside every percentage.

## 1. Side-by-side comparison

| Dimension | SWE-bench | Kaggle Gemma 4 Developer Agent — main Agent Track |
|---|---|---|
| Basic task | Resolve a real GitHub issue by editing a repository and producing a patch. | Resolve a repository issue by producing a patch in the competition harness. |
| Per-task outcome | Resolved only when the required tests pass. For standard SWE-bench evaluation, both `FAIL_TO_PASS` and `PASS_TO_PASS` groups must pass. | PASS/FAIL: the submitted patch is applied and the task’s validation tests are run. The accessible public description does not provide a SWE-bench-style breakdown into named test groups. |
| Aggregation | “% Resolved”: the fraction of tasks resolved, expressed as a percentage. | The percentage of patched repositories passing validation; the leaderboard displays the corresponding 0–1 fraction. |
| Partial credit | No test-level partial credit in the headline task-resolution metric. | No documented test-level partial credit; each task contributes a pass/fail outcome. |
| Principal denominators | Full: 2,294 tasks; Lite: 300; Verified: 500. A local run’s FAQ-defined resolution rate instead uses submitted instances, so incomplete runs must state their denominator. | About 120 hidden test tasks, evenly divided between public and private leaderboard splits—approximately 60 per split, rather than all 120 in each displayed split score. |
| Leaderboard structure | Separate results for named datasets and evaluation views. The general Verified leaderboard includes varied systems; Bash Only uses mini-SWE-agent for a controlled comparison. | Public leaderboard gives developmental feedback on one hidden split; the private leaderboard uses the other split and determines final ranking/prizes. |
| Task visibility | Public GitHub issues, repositories, and associated pull requests. This supports reproducibility but creates training-exposure risk. | Scored tasks are hidden and drawn from private repositories; a separate public development set supports iteration. This reduces direct public-benchmark memorization risk but does not prove zero contamination. |
| System constraints | The general leaderboard permits different models, scaffolds, retrieval, tools, and multi-rollout/review systems. Bash Only standardizes the scaffold for model-focused comparisons. | Constrained to supported Gemma 4 models and the competition’s offline ADK-based harness and rules. The score measures the submitted model-plus-agent system under those constraints. |
| Time/resource coupling | Evaluation applies and tests pre-generated patches; generation budgets depend on the evaluated system and are reported separately rather than defined by one universal SWE-bench leaderboard clock. | The agent has 12 hours to submit patches for all tasks. Sandbox setup is included; subsequent patch-validation time is excluded. Thus inference speed and budget allocation can directly affect the score. |
| What a high score establishes | High test-based issue-resolution rate on the named SWE-bench dataset under the stated system configuration. | High test-based issue-resolution rate on the relevant hidden split under the competition’s model, harness, offline, and shared-time constraints. |

Sources for the table: [SWE-bench paper](https://arxiv.org/abs/2310.06770), [SWE-bench FAQ](https://www.swebench.com/SWE-bench/faq/), [Verified documentation](https://www.swebench.com/verified.html), [OpenAI’s Verified explanation](https://openai.com/index/introducing-swe-bench-verified/), [Kaggle overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview), [Kaggle data page](https://www.kaggle.com/competitions/gemma-4-developer-agent/data), and [Kaggle leaderboard](https://www.kaggle.com/competitions/gemma-4-developer-agent/leaderboard).

## 2. How SWE-bench scoring works

### 2.1 The unit of success is an issue, not a test or a line of code

The original SWE-bench contains **2,294 software-engineering problems from real GitHub issues and corresponding pull requests across 12 popular Python repositories**. Given a codebase and issue description, the evaluated system edits the repository to address the issue ([Jimenez et al., 2024](https://arxiv.org/abs/2310.06770)).

The evaluation harness creates a Dockerized repository environment, applies the generated patch, and runs tests ([SWE-bench evaluation guide](https://www.swebench.com/SWE-bench/guides/evaluation/)). Two test groups matter:

- **`FAIL_TO_PASS` tests** fail before the reference fix and pass afterward; they check whether the issue was addressed.
- **`PASS_TO_PASS` tests** pass before and after the reference fix; they check that unrelated existing behavior was not broken.

OpenAI’s documentation states that **both groups must pass** for an edit fully to resolve the issue ([OpenAI, 2025](https://openai.com/index/introducing-swe-bench-verified/)). Consequently, an agent can pass some—or even most—tests and still receive zero credit for that task. The headline metric does not award 0.7 of a task because 70% of its tests passed, and it does not compare the generated diff token-by-token with the human patch.

For a complete evaluation of a named dataset, the useful scoring abstraction is:

\[
R_i = \begin{cases}
1, & \text{if task }i\text{ meets all required test conditions}\\
0, & \text{otherwise}
\end{cases}
\]

\[
\%\,\mathrm{Resolved}=100\times\frac{\sum_{i=1}^{N}R_i}{N}
=100\times\frac{\text{resolved tasks}}{\text{tasks in the evaluation denominator}}
\]

This is a **micro-average over tasks**: every task has equal weight regardless of repository, patch size, number of tests, or human-estimated difficulty.

### 2.2 The denominator depends on what is being reported

For a normal, complete leaderboard result, \(N\) is the full named dataset:

- **SWE-bench Full:** 2,294 tasks.
- **SWE-bench Lite:** 300 selected test tasks.
- **SWE-bench Verified:** 500 human-screened tasks.

The official FAQ lists these dataset sizes and also defines local **resolution rate** as “the percentage of submitted instances that were successfully resolved” ([SWE-bench FAQ](https://www.swebench.com/SWE-bench/faq/)). The evaluation guide separately reports total, submitted, completed, resolved, unresolved, incomplete, empty-patch, and error counts ([evaluation guide](https://www.swebench.com/SWE-bench/guides/evaluation/)). This creates an important reporting distinction:

- **Complete dataset result:** `resolved / all tasks in the named dataset`.
- **Submitted-only local result:** `resolved / submitted tasks`, following the FAQ wording.

For example, resolving 10 of 50 submitted Verified tasks is 20% **on that submitted subset**, but it is not a complete 20% SWE-bench Verified result. A complete Verified run with only 10 resolutions would be 10/500 = 2%. Any subset, filtered run, or incomplete evaluation should therefore publish its numerator and denominator rather than only a percentage.

### 2.3 “SWE-bench score” is incomplete without the variant

SWE-bench Lite is a 300-task subset selected for cheaper, more self-contained evaluation ([official Lite page](https://www.swebench.com/lite.html)). SWE-bench Verified is a 500-task subset screened by professional developers for clear problem statements, appropriate tests, and solvability; it was created by OpenAI and the SWE-bench authors to reduce underspecified or unfair tasks ([official Verified page](https://www.swebench.com/verified.html); [OpenAI, 2025](https://openai.com/index/introducing-swe-bench-verified/)).

These subsets change both difficulty and task quality, so Full, Lite, and Verified percentages are not interchangeable. The agent setup matters too. Verified’s general leaderboard allows systems ranging from simple agent loops to retrieval-augmented and multi-rollout/review designs. Its **Bash Only** view instead evaluates models through mini-SWE-agent in a minimal bash environment, making model-to-model comparisons more controlled; even there, the documentation cautions that mini-SWE-agent release changes can affect comparability ([Verified documentation](https://www.swebench.com/verified.html)).

## 3. How Kaggle main-track scoring works

### 3.1 Per-task PASS/FAIL and the displayed score

Kaggle describes the main track as PASS/FAIL evaluation: each submitted patch is applied to the relevant repository and validation tests are run. Its overview states: “Your submission’s overall score is the percentage of patched repositories that pass the validation tests” ([Kaggle overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)). There is no documented partial credit for the fraction of validation tests passed within an issue.

The leaderboard displays decimal fractions—for example, `0.22`—rather than the numeral `22` ([Kaggle leaderboard](https://www.kaggle.com/competitions/gemma-4-developer-agent/leaderboard)). Thus:

\[
\text{Kaggle percentage}=100\times\text{displayed score}
\]

For interpretation, a split’s scoring structure can be written as:

\[
S_{\mathrm{split}}=\frac{1}{N_{\mathrm{split}}}\sum_{i=1}^{N_{\mathrm{split}}}P_i
\]

where \(P_i=1\) when task \(i\) passes validation and \(0\) otherwise, and \(S_{\mathrm{split}}\) is the displayed 0–1 value. The corresponding percentage is \(100S_{\mathrm{split}}\). This formula expresses the documented equal-task PASS/FAIL structure; the accessible overview does not explicitly spell out every edge case for missing patches, incomplete generations, or harness errors, so those cases should not be inferred from the formula alone.

### 3.2 Public and private leaderboards have different denominators—and roles

The Kaggle data page describes **about 120 hidden test tasks**, divided evenly between public and private leaderboard splits, with scored tasks sourced from private repositories ([Kaggle data page](https://www.kaggle.com/competitions/gemma-4-developer-agent/data)). The public leaderboard provides feedback during the competition; the private leaderboard determines final ranking and prizes ([Kaggle overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)).

The practical consequence is that a public score is not calculated over all approximately 120 tasks. Under the official “even split” description, each leaderboard uses roughly 60 tasks. Public and private scores should be treated as measurements on two task samples, not as two interchangeable displays of one result. There is no need to average them to determine the prize ranking: the private split is decisive.

Kaggle also supplies a separate public development set. The official data page identifies a public development container for 129 open-source tasks; competition documentation and participant tooling describe these as drawn from FastAPI, Rich, Requests, and HTTPX ([Kaggle data page](https://www.kaggle.com/competitions/gemma-4-developer-agent/data)). Development-set pass rates are useful for engineering iteration but are not the hidden public- or private-leaderboard score.

### 3.3 The score embeds a shared generation budget and a constrained system

The overview gives the agent **12 hours to submit patches for all tasks**, with sandbox setup included and patch validation excluded ([Kaggle overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)). The competition uses supported Gemma 4 variants in an offline, ADK-based agent configuration under a fixed competition harness. These constraints make the score a measure of the complete submitted system: model choice among allowed variants, optional adaptation, prompts, tool use, sub-agent orchestration, verification strategy, stopping policy, and allocation of the shared clock.

This differs from simply evaluating a static set of already-generated patches. A slower agent that could eventually solve more issues may score below a faster agent if it fails to produce enough patches within the budget. Conversely, SWE-bench’s headline percentage describes test-based resolution for a stated system and dataset; it does not, by itself, normalize every submitted system to Kaggle’s model family, offline hardware, harness, and shared 12-hour generation protocol.

## 4. The substantive similarities

Despite the different leaderboard mechanics, the scores are conceptually close in four ways.

First, **both evaluate repository-level issue resolution rather than isolated code generation**. The agent must understand an issue in the context of an existing codebase and produce an applicable patch.

Second, **both use execution as the arbiter**. A plausible-looking patch earns no headline credit unless the relevant validation succeeds. This is stronger than exact-match comparison with a reference diff because different implementations can receive credit if they pass.

Third, **both use binary task outcomes and equal task weighting**. A task with 100 validation tests does not receive 100 times the weight of a task with one test. Likewise, a large or difficult patch does not receive extra points merely for being large or difficult.

Fourth, **both headline metrics are task pass rates**, even though their visual formatting differs. SWE-bench normally writes “% Resolved” as a percentage; Kaggle displays a 0–1 fraction that can be converted to a percentage by multiplying by 100.

It is therefore fair to call the Kaggle metric **SWE-bench-style**. It would be incorrect, however, to infer that identical percentages are calibrated to one another.

## 5. Why the numerical scores are not directly comparable

### 5.1 Different task populations and difficulty

SWE-bench tasks are public GitHub issues from known open-source Python repositories. Verified and Lite are different filtered samples of the original pool, with documented selection processes. Kaggle’s scored tasks are hidden tasks from private repositories and have their own curation process. Even if both contain Python bug-fixing tasks, there is no evidence that their difficulty distributions, repository complexity, issue specificity, or test strictness match.

A pass rate is always conditional on its task set. “20% resolved” means 20% of **these tasks**, not 20% of all software-engineering work.

### 5.2 Different denominators and leaderboard selection

A complete Verified score uses 500 tasks. Each Kaggle leaderboard split uses roughly 60 under the official approximate counts. Kaggle participants can also iterate against public-leaderboard feedback while the final private split remains hidden until the end. This introduces a public-split overfitting risk that is different from interpreting a fixed SWE-bench result.

A public Kaggle score should never be presented as though it were the final private score, and neither should be presented as a result over the public development set.

### 5.3 Different system and resource constraints

The general SWE-bench Verified leaderboard compares varied agent systems, so even two results using the same underlying language model can differ because of scaffolding, retrieval, tools, or repeated attempts. Bash Only reduces this variation by standardizing the agent, but it still does not turn the score into Kaggle-equivalent conditions.

Kaggle deliberately restricts the model family and execution environment and includes a shared generation-time constraint. Its score therefore reflects efficiency and orchestration under that budget as well as issue-solving capability. A raw percentage does not isolate the model from the agent, and it does not isolate coding skill from runtime strategy.

### 5.4 Different exposure and reproducibility profiles

SWE-bench’s public tasks and solutions facilitate inspection and reproduction, but OpenAI explicitly cautions that models trained on internet text are likely to have been exposed to some public GitHub benchmark material ([OpenAI, 2025](https://openai.com/index/introducing-swe-bench-verified/)). Kaggle’s private scored repositories reduce this particular form of public-task memorization by construction. They do not establish that every related code pattern, issue, or repository version is absent from training data, and hidden tasks are harder for outside researchers to audit independently.

### 5.5 A worked equivalence that is only arithmetic

Suppose an agent resolves 100 of 500 Verified tasks:

\[
100\times\frac{100}{500}=20.0\%\ \text{Resolved on SWE-bench Verified}.
\]

Suppose a Kaggle submission passes 12 tasks on a hypothetical 60-task public split:

\[
\frac{12}{60}=0.20\quad\text{(displayed score)},\qquad 100\times0.20=20\%.
\]

The arithmetic conversion is valid; a claim that the systems demonstrated equal coding ability is not. The two 20% values come from different tasks, denominators, visibility conditions, agent constraints, and time protocols. No defensible conversion factor between them can be derived from the scoring formulas alone.

## 6. Score granularity and sensitivity to a few tasks

Because each task contributes equally, the smallest possible change caused by one additional resolved task is \(100/N\) percentage points.

| Evaluation denominator | One additional resolved task changes the percentage by |
|---|---:|
| SWE-bench Full, \(N=2,294\) | approximately **0.0436 percentage points** |
| SWE-bench Verified, \(N=500\) | **0.2 percentage points** |
| SWE-bench Lite, \(N=300\) | approximately **0.333 percentage points** |
| One Kaggle split, approximately \(N=60\) | approximately **1.67 percentage points** |

This is score **granularity**, not a confidence interval. The tasks are fixed and non-identically difficult, and displayed leaderboard values may be rounded. Nevertheless, the arithmetic shows why a small Kaggle split is much more sensitive to a handful of task outcomes: one task can move the percentage by roughly 1.7 points, compared with 0.2 points on Verified.

For additional intuition only, if task outcomes were independent Bernoulli trials with a true 20% pass probability, the simple binomial standard error would be about 1.79 percentage points at \(N=500\) and 5.16 points at \(N=60\). Those assumptions are not literally true for fixed benchmark tasks, so these are illustrative variability calculations—not official leaderboard confidence intervals. Run-to-run variation in the agent would add another source of uncertainty.

## 7. What both scores can miss

Passing tests is evidence of task success, not proof of complete semantic correctness. Tests can be incomplete, overly specific, flaky, or misaligned with the issue. A patch may pass while introducing untested regressions, and a valid alternative fix may fail because the tests demand behavior not stated clearly in the issue. Neither metric directly scores maintainability, security, readability, minimality, or long-term architectural fit.

The Verified curation process was designed to reduce underspecified problems and unfair tests, not to prove that every passing patch is correct ([OpenAI, 2025](https://openai.com/index/introducing-swe-bench-verified/)). A later empirical study of patches from **three** issue-solving systems on SWE-bench Verified found plausible but incorrect patches and concluded that test-based evaluation can inflate reported resolution rates ([Wang et al., 2025, v2](https://arxiv.org/abs/2503.15223v2)). Its estimates should not be treated as a universal correction factor for every model, scaffold, SWE-bench run, or Kaggle submission; the broader lesson is that test passage is a proxy with measurable failure modes.

Kaggle’s hidden validation tests face the same general proxy problem, but the accessible public materials are insufficient to determine whether its per-task false-positive and false-negative rates resemble SWE-bench’s. It would be unsupported to transfer the paper’s numerical inflation estimate to Kaggle.

## 8. How to report and compare results responsibly

A well-formed result should include:

1. **Benchmark and variant:** for example, SWE-bench Verified, not merely “SWE-bench.”
2. **Leaderboard or split:** for Kaggle, public development, hidden public leaderboard, and hidden private leaderboard are distinct.
3. **Raw counts:** resolved/passed tasks and the exact denominator, alongside the percentage.
4. **Scale:** make clear whether `0.20`, `20`, or `20%` is being reported.
5. **System configuration:** model/version, agent or scaffold, tools, retrieval, retry or rollout policy, and relevant adaptations.
6. **Resource protocol:** hardware, generation-time budget, and whether results are single-run or aggregated across runs.
7. **Completeness:** distinguish a full named-dataset evaluation from a submitted-only subset run.

A defensible statement is:

> The system resolved 100/500 tasks (20.0%) on SWE-bench Verified under configuration A; separately, the Gemma 4 competition submission passed 12 of a hypothetical 60 public-split tasks (displayed score 0.20, or 20%) under the competition harness and time budget.

An unsupported statement is:

> Both systems scored 20%, so they are equally good at software engineering.

A genuinely controlled comparison would require the same tasks, model or clearly specified models, agent permissions, tools, retry policy, compute/time budget, and evaluation harness—or a deliberately designed cross-benchmark study that quantifies those differences rather than assuming them away.

## 9. Do not confuse the Agent Track with the Paper Track

The main Agent Track uses the automated test-based score described above. The separate Kaggle **Paper Track** is human judged: its five criteria—novelty, quality, relevance, verifiability, and clarity—are each scored from 0 to 5 and combined as an average under the published rubric ([Kaggle Paper Track](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/overview)). That 0–5 research-writing score has no numerical equivalence to SWE-bench “% Resolved” or to the main competition’s task pass rate.

## Open questions and evidence limits

- **Kaggle denominator edge cases.** The overview clearly states PASS/FAIL evaluation and an overall percentage, but the publicly accessible text reviewed here does not unambiguously specify how every missing-patch, unfinished-task, timeout, and infrastructure-error case enters the official denominator. The fixed-task formula is the natural interpretation of the leaderboard metric, not a substitute for private grader source code.
- **Exact split size.** Official wording says “about 120” tasks, evenly split. Participant discussions have reported 58 current public tasks and a one-task increment of approximately 0.017, but those are observations rather than a stable official replacement for the published approximate count. This report therefore uses approximately 60 for general arithmetic.
- **Repeated runs and nondeterminism.** The accessible overview does not establish whether private scoring repeats generation, averages multiple runs, or uses a single run. Participant reports of unchanged submissions receiving different scores should be treated as anecdotal until confirmed by official documentation.
- **Validation-test semantics.** Kaggle does not publicly expose enough hidden-task detail to establish a one-to-one mapping between its validation procedure and SWE-bench’s named `FAIL_TO_PASS`/`PASS_TO_PASS` groups. The safe shared claim is execution-based per-task validation, not identical test construction.
- **Direct competition-file inspection.** Kaggle’s unauthenticated competition-data API returned an authentication requirement during research, and direct page retrieval exposed only the client-rendered shell. No attempt was made to bypass access controls. Official indexed page text was used for the load-bearing scoring claims; secondary and participant material was used only for clearly labeled supplementary context.
- **Live-competition changes.** Rules and harness behavior may be clarified before the competition closes. The Kaggle overview, data page, rules, and official discussion posts should be checked again before using this report to make a submission decision.

## Sources

1. **Jimenez, Carlos E., et al. “SWE-bench: Can Language Models Resolve Real-World GitHub Issues?”** ICLR 2024; arXiv:2310.06770. Original task formulation, 2,294-task dataset, 12 repositories, and issue-resolution setting. https://arxiv.org/abs/2310.06770
2. **SWE-bench — Frequently Asked Questions.** Official dataset sizes, Docker evaluation outline, reported counts, and local resolution-rate wording. https://www.swebench.com/SWE-bench/faq/
3. **SWE-bench — Evaluation Guide.** Official prediction format, Docker-based patch evaluation, result files, and count definitions. https://www.swebench.com/SWE-bench/guides/evaluation/
4. **SWE-bench Verified.** Official 500-task overview, general-system leaderboard description, and Bash Only comparability notes. https://www.swebench.com/verified.html
5. **SWE-bench Lite.** Official 300-task overview and selection criteria. https://www.swebench.com/lite.html
6. **Chowdhury, Neil, et al. “Introducing SWE-bench Verified.”** OpenAI, updated 2025-02-24. `FAIL_TO_PASS`/`PASS_TO_PASS` semantics, both-groups-pass requirement, Verified curation, limitations, and contamination discussion. https://openai.com/index/introducing-swe-bench-verified/
7. **Google — The Gemma 4 Developer Agent Competition: Overview.** Kaggle. Main-track objective, PASS/FAIL scoring description, overall percentage, public/private leaderboard roles, and 12-hour patch-generation limit. https://www.kaggle.com/competitions/gemma-4-developer-agent/overview
8. **Google — The Gemma 4 Developer Agent Competition: Data.** Kaggle. Hidden test set, approximate task count and split, private-repository origin, and development-data description. https://www.kaggle.com/competitions/gemma-4-developer-agent/data
9. **Google — The Gemma 4 Developer Agent Competition: Leaderboard.** Kaggle. Displayed decimal score format. https://www.kaggle.com/competitions/gemma-4-developer-agent/leaderboard
10. **Google — The Gemma 4 Developer Agent Paper Track: Overview.** Kaggle. Separate human-judged research-paper rubric. https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/overview
11. **Wang, You, et al. “Are ‘Solved Issues’ in SWE-bench Really Solved Correctly? An Empirical Study.”** arXiv:2503.15223v2, 2025-09-09. Empirical evidence on plausible but incorrect patches and limitations of test-based resolution scoring. https://arxiv.org/abs/2503.15223v2
12. **“Gemma 4 Developer Agent Competition 2026: $100K Guide.”** Reconscribe, 2026-10-17. Secondary compilation of official competition pages and staff posts; used as supplementary context for harness/development-set details, not as the authority for the core scoring formula. https://reconscribe.com/gemma-4-developer-agent-competition-2026/


---

<!-- ====================================================================== -->
<!-- FILE: 07_swegemma-built-in-methods-primer-2026-11-02.md -->
<!-- ====================================================================== -->

# `swegemma` Built-In Methods: A Comprehensive Primer

*Research scope: This report explains all nine built-in methods registered by `SwegemmaContext.create_tools()`, including their calling conventions, internal behavior, budgets, outputs, truncation rules, failure modes, and recommended usage. It is a documentation-based technical primer derived from the supplied `HARNESS_README.md`, not an independent source-code audit.*
*As of: 2026-11-02.*

## Executive summary

The nine built-ins form three layers: `run_command`, `submit_patch`, and `get_status` control execution and the agent-session lifecycle; `read_file`, `edit_file`, and `write_file` inspect and modify the workspace; and `get_code_neighbors`, `search_similar_code`, and `get_code_subgraph` navigate precomputed repository intelligence. All normal calls return a **JSON string**, not a native Python object, with `status: "ok"` or a structured error envelope. Seven methods consume the tool-call budget; `submit_patch()` and `get_status()` are free in tool-call terms, although wall-clock time still matters.

The most important operational rule is to treat `submit_patch()` as the final action: it captures the current binary Git diff, marks the patch submitted, and causes the harness to leave the agent loop after the current response or turn. The harness can recover an unsubmitted working-tree diff, but explicit submission is safer and makes completion intentional. Changes to protected tests and runner configuration are stripped before verification, so the durable output of every workflow is a patch to non-protected project code—not test edits, scratch scripts, or configuration tampering. *(Source: `HARNESS_README.md`, §§6, 8.1–8.2, 10.)*

## 1. The mental model: methods are gated operations on an evaluation session

### 1.1 Registration and declaration

`SwegemmaContext.create_tools()` registers nine method names in the harness `ToolRegistry`. A root agent or sub-agent receives only the subset explicitly listed under `tools:` in its YAML configuration. Declaring a method makes it available to that agent; it does not mean every other agent in the hierarchy inherits it automatically. The initial task prompt is also filtered against the declared tool set, so tool-specific instructions and code-intelligence capabilities are not advertised when the corresponding methods are absent. *(Source: §§5.2, 6, lines 303–347 and 371–377.)*

Conceptually, a method call crosses this path:

```text
Agent-generated tool call
        ↓
ADK tool dispatch and argument handling
        ↓
Budget gate and SwegemmaContext operation
        ↓
Container A workspace, Git state, or in-memory code-intelligence data
        ↓
JSON string returned to the agent
```

The execution and workspace methods operate on the editable repository in **Container A**, whose working directory is `/workspace`. The graph methods query precomputed, in-memory graph and embedding data rather than running a shell command in the repository. None of these methods runs the final scoring tests in Container B; verification is a separate lifecycle that begins after patch extraction. *(Source: §§4, 6.3, 8.2.)*

### 1.2 The common response envelope

Budget-gated methods return a JSON string. Successful responses have this general shape:

```json
{
  "status": "ok",
  "...": "method-specific fields"
}
```

Failures use a structured envelope:

```json
{
  "status": "error",
  "error_type": "<Type>",
  "error_message": "<Message>",
  "details": {}
}
```

The exact `details` object varies by method. For example, `run_command` places `stdout`, `stderr`, and `exit_code` there for a nonzero exit. The harness’s `ToolErrorPlugin` also converts undeclared tool calls and runtime tool exceptions into structured error dictionaries for the model, rather than automatically aborting the whole task. An agent should therefore read the error, adjust its next call, and continue when budgets permit. *(Source: §§5.3, 6, lines 349–353 and 373–382.)*

### 1.3 Budget accounting

| Method | Consumes one tool call? | Important limit or side effect |
|---|---:|---|
| `run_command` | Yes | Command timeout and output truncation |
| `submit_patch` | **No** | Ends agent work after the current response/turn |
| `get_status` | **No** | Read-only budget and patch inspection |
| `read_file` | Yes | 150-line and 10,000-character caps |
| `edit_file` | Yes | Match uniqueness and diff truncation |
| `write_file` | Yes | Creates or overwrites the complete file |
| `get_code_neighbors` | Yes | Neighbor-list output cap |
| `search_similar_code` | Yes | Aggregate code-snippet output cap |
| `get_code_subgraph` | Yes | Node/edge-list output cap |

`submit_patch` remains callable when the used tool calls exactly equal the configured maximum, provided session wall-clock time remains. “Free” therefore means **exempt from tool-call accounting**, not exempt from time limits or session termination rules. *(Source: §§6.1–6.3, lines 384–533.)*

When the configured tool budget is at least 20 calls and no more than 10 calls remain, tool responses gain a warning such as:

```json
{
  "budget_warning": "Only 8 tool call(s) remaining (42/50 used). Finalize your edits and call submit_patch soon."
}
```

This is a finalization signal, not a new error. The agent should stop broad exploration, inspect `get_status()` if necessary, run only decisive verification, and submit. *(Source: §6, lines 375–382.)*

### 1.4 Shared output and environment limits

The defaults most relevant to all methods are:

- Single-command timeout: 300 seconds, dynamically shortened near the session deadline.
- Command, diff, and graph output ceiling: 5,000 characters, applied according to each method’s rules.
- File reads: at most 150 lines **and** at most 10,000 characters.
- Offline sandbox: no internet or PyPI access; dependencies are preinstalled.
- Agent workspace: `/workspace`.
- Context window: 32,768 tokens for the model server, with automatic event compaction configured for long sessions.

The exact tool-call, turn, and wall-clock budgets are configuration-dependent. For example, the documented inference default is 100 tool calls, while the CLI default is `None`; the normal session default is 60 minutes and 500 turns. Container setup happens before the agent timer starts, so installation and snapshot extraction do not consume the agent’s wall-clock allowance. *(Source: §§3.1, 5.2, 7.1–7.2.)*

## 2. Execution and lifecycle methods

### 2.1 `run_command(command: str) -> str`

#### Purpose

`run_command` is the general-purpose escape hatch for operations not covered by dedicated file or graph methods: listing directories, searching text, inspecting Git state, running tests, executing small Python assertions, and invoking other already-installed command-line programs.

#### What it does

1. Accepts one shell command string.
2. Runs it through `/bin/bash -c` with `/workspace` as the working directory.
3. Enforces the current dynamic timeout.
4. Captures standard output, standard error, and the exit code.
5. Truncates command output according to the harness output limit.
6. Returns a success response only when `exit_code == 0`; otherwise it returns `CommandError`.

The timeout is:

```text
min(command_timeout_seconds, max(5, int(remaining_time_seconds)))
```

The default `command_timeout_seconds` is 300. A command timeout returns `error_type: "TimeoutExceeded"` and normally does **not** end the agent session. The overall session can still end if its own wall-clock budget has expired. *(Source: §6.1, lines 386–405.)*

#### Success response

```json
{
  "status": "ok",
  "stdout": "...",
  "stderr": "...",
  "exit_code": 0
}
```

Both output streams are subject to the default 5,000-character truncation rule. A zero exit status means the shell command succeeded; it does not, by itself, prove that the task is solved. For example, a command that runs no tests can still exit successfully, which is why targeted test selection and output inspection matter.

#### Failure responses

A normal nonzero exit produces:

```json
{
  "status": "error",
  "error_type": "CommandError",
  "error_message": "...",
  "details": {
    "stdout": "...",
    "stderr": "...",
    "exit_code": 1
  }
}
```

This distinction is useful: a failing test is usually a **successfully executed tool call whose command failed**, not a harness malfunction. The traceback remains available in `details.stdout` and `details.stderr`, subject to truncation. A timeout instead uses `TimeoutExceeded`.

#### Example uses

Inspect repository state:

```json
{
  "command": "git status --short && find src -maxdepth 2 -type f | sort | head -80"
}
```

Run a focused test:

```json
{
  "command": "python3 -m pytest tests/path/to/test_module.py::TestCase::test_behavior -q"
}
```

Run a small assertion without creating a workspace file:

```json
{
  "command": "python3 -c 'from pkg.module import parse; assert parse(\"a,b\") == [\"a\", \"b\"]'"
}
```

Search for exact text:

```json
{
  "command": "grep -RIn --exclude-dir=.git 'parse_header' src tests | head -80"
}
```

#### Best practices and traps

- **Narrow the output.** Use targeted paths, test node IDs, and bounded search output. The relevant exception can disappear when a verbose suite exceeds the output cap.
- **Do not try to install dependencies.** The environment is offline and the initial prompt explicitly says dependencies are already present.
- **Use tests as feedback, not as the submission mechanism.** Container A testing is enabled by default, but final scoring applies the task’s test patch in a fresh Container B. Local success does not bypass final verification.
- **Keep scratch work outside the repository or clean it up.** A reproduction file created under `/workspace` can enter the final diff. Prefer `/tmp` or remove it before submission.
- **Interpret exit codes carefully.** Combine the exit code with the visible test count and output; final scoring itself requires both a zero test exit and valid JUnit evidence that required tests actually passed.

*(Sources: §§5.2, 6.1, 8.2, 10.)*

### 2.2 `submit_patch() -> str`

#### Purpose

`submit_patch` converts the current workspace changes into the agent’s official patch and signals that Phase 1 work is complete. It is both a capture operation and a lifecycle control operation.

#### What it does

The method performs the equivalent of:

```bash
cd /workspace
git add -N .
git diff --binary _swegemma_baseline 2>/dev/null || git diff --binary HEAD
```

It then:

1. Includes intent-to-add entries for untracked files so new files appear in `git diff` without staging their full contents.
2. Captures a **binary-capable unified diff** against the special baseline reference, falling back to `HEAD` when needed.
3. Stores the result in `ctx.submitted_patch`.
4. Sets `ctx.patch_submitted = True`.
5. Returns patch summary information.
6. Causes the harness to exit the agent loop once the agent emits its final response or the current `run_async` turn finishes with the submitted flag set.

The patch-extraction pipeline also strips sections touching protected test and runner-configuration files. Consequently, calling `submit_patch` does not preserve edits to files such as `tests/test_example.py`, `conftest.py`, `pytest.ini`, `pyproject.toml`, `tox.ini`, or `setup.cfg`. *(Source: §§6.1, 8.1, lines 406–413 and 584–594.)*

#### Response

```json
{
  "status": "ok",
  "patch_size": 1420,
  "files_changed": 2
}
```

The documentation defines these as summary values but does not specify the unit used by `patch_size`; agents should treat it as diagnostic metadata rather than a contractual byte count.

#### Why `git add -N .` matters

Ordinary `git diff` does not include arbitrary untracked files. Intent-to-add makes Git aware of new paths, allowing the diff to represent both:

- modifications to already tracked files; and
- newly created, non-excluded workspace files.

Harness-generated artifacts such as `__pycache__/`, `*.pyc`, `.pytest_cache/`, `*.egg-info/`, `build/`, `dist/`, and `.coverage` are excluded through `.git/info/exclude`. Other scratch files are not automatically harmless merely because they are untracked. *(Source: §§4.2, 8.1.)*

#### Correct finalization sequence

```text
1. Make the intended non-protected source changes.
2. Remove scratch files from /workspace or move them to /tmp.
3. Inspect the final diff and Git status with run_command.
4. Run focused tests or assertions.
5. Call submit_patch().
6. Provide only the final completion response; do not plan more tool work.
```

#### Automatic fallback—and why not to rely on it

If the agent finishes, exhausts nudges or budgets, or times out without calling `submit_patch`, the harness attempts to recover a nonempty working-tree diff using the same intent-to-add, binary-diff, and protected-file-stripping process. That means an accidental omission does not necessarily discard all work. Nevertheless, explicit submission is preferable because it establishes a deliberate endpoint and avoids depending on termination behavior. *(Source: §8.1, lines 592–594.)*

#### Best practices and traps

- **Call it last.** Post-submission edits are not a viable strategy because the harness leaves the agent loop after the current response/turn.
- **Verify before calling.** The tool captures current state; it does not run tests or judge correctness.
- **Check what will be captured.** Use `git status --short` and `git diff` before submission, while remembering that newly untracked files become visible to the extraction process through `git add -N`.
- **Do not put the solution in tests or runner configuration.** Those changes are stripped and later reset during verification.
- **Use the free call strategically.** It can still submit at the tool-call ceiling, but not after wall-clock termination.

### 2.3 `get_status() -> str`

#### Purpose

`get_status` is a read-only dashboard for session budget and patch state. It answers “How much room remains, and have I submitted?” without consuming a tool call.

#### Example response

```json
{
  "status": "ok",
  "tool_calls_used": 12,
  "patch_submitted": false,
  "patch_size": 0,
  "tool_calls_remaining": 38,
  "max_tool_calls": 50,
  "time_seconds_remaining": 3120.4,
  "max_time_minutes": 60.0,
  "agent_elapsed_seconds": 479.6,
  "max_turns": 500,
  "command_timeout_seconds": 300
}
```

#### Field guide

| Field | Meaning | Practical use |
|---|---|---|
| `tool_calls_used` | Count of budget-consuming calls already made | Measure exploration cost |
| `tool_calls_remaining` | Remaining budget-consuming calls | Decide whether more exploration is affordable |
| `max_tool_calls` | Configured tool-call ceiling | Understand the denominator in warnings |
| `patch_submitted` | Whether submission has been signaled | Confirm lifecycle state |
| `patch_size` | Current recorded patch-size summary | Check whether a patch has been captured |
| `time_seconds_remaining` | Agent-session wall-clock time left | Avoid starting a long command near deadline |
| `max_time_minutes` | Configured session time allowance | Interpret total time budget |
| `agent_elapsed_seconds` | Time spent in the agent session | Track pacing; setup time is excluded |
| `max_turns` | Reasoning/loop-turn ceiling | Avoid excessive continuation cycles |
| `command_timeout_seconds` | Configured per-command ceiling | Estimate whether a test command can finish |

The displayed values are live, not a snapshot taken at session start. The method does not run Git, modify files, submit a patch, or reset any counter. *(Source: §6.1, lines 415–433; timer behavior in §7.1.)*

#### Recommended use

- At the beginning of an unusually constrained run, to learn the actual configured limits.
- After an expensive debugging sequence, to decide between more investigation and finalization.
- Near a budget warning, to plan the last verification and submission.
- Before a potentially long test run, to compare remaining wall-clock time with the command timeout.

Because it is free in tool-call terms, `get_status` is preferable to guessing budget state. It should still be used purposefully rather than inserted after every operation.

## 3. Workspace file methods

### 3.1 Shared path and argument behavior

All three file methods resolve paths relative to `/workspace` through `_resolve_workspace_path(filepath)`. These two arguments therefore identify the same file:

```text
src/app.py
/workspace/src/app.py
```

A leading `/` or `/workspace/` prefix is stripped automatically. Any path containing a `..` traversal component raises `ValidationError`; these methods are intentionally workspace-scoped rather than general filesystem APIs. The workspace layer also coerces string-encoded integers and booleans produced by models—for example, `"10"` to `10` and `"true"` to `True`—for typed arguments. *(Source: §6.2, lines 437–440.)*

### 3.2 `read_file(filepath: str, start_line: int | None = None, end_line: int | None = None) -> str`

#### Purpose

`read_file` returns a bounded, line-oriented view of one workspace file. It is the safest way to inspect a known path because its response includes location and truncation metadata.

#### Line semantics

- Lines are **1-indexed**, so the first line is `1`, not `0`.
- `start_line` and `end_line` are **inclusive**.
- Omitting the bounds requests the default beginning-of-file view.
- The response reports the actual returned interval, which may be shorter than requested.

Examples:

```json
{"filepath": "src/module.py", "start_line": 80, "end_line": 180}
```

```json
{"filepath": "/workspace/src/module.py"}
```

#### Dual truncation

The result stops at whichever cap is reached first:

1. 150 returned lines; or
2. 10,000 returned characters.

When either cap is reached:

- `is_truncated` becomes `true`; and
- `end_line` identifies the last complete line actually returned.

This means a request for lines 1–400 may end at line 150, and a file with unusually long lines may end even earlier. `total_lines` tells the agent that more file content exists, while the returned `end_line` tells it where to resume. *(Source: §6.2, lines 441–456.)*

#### Response

```json
{
  "status": "ok",
  "filepath": "src/module.py",
  "content": "...",
  "start_line": 1,
  "end_line": 150,
  "total_lines": 420,
  "is_truncated": true
}
```

#### Efficient continuation pattern

If the first response ends at line 150 with `is_truncated: true`, continue with:

```json
{
  "filepath": "src/module.py",
  "start_line": 151,
  "end_line": 300
}
```

Do not repeatedly request the same default view. For a targeted function, first locate its line number with `run_command` (`grep -n`, for example), then read a tight interval around it.

#### Best practices and traps

- **Read before targeted editing.** Exact surrounding code reduces failed matches and accidental replacements.
- **Use the metadata, not assumptions.** `total_lines` describes the file; `end_line` describes this response.
- **Expect truncation even inside a requested range.** Both caps apply simultaneously.
- **Use shell search for discovery.** `read_file` requires a known path and is not a filename-search or content-search method.
- **Confirm current source after edits.** This is especially important when using precomputed graph results as a map.

### 3.3 `edit_file(filepath: str, old_string: str, new_string: str, allow_multiple: bool = False) -> str`

#### Purpose

`edit_file` performs a targeted replacement in an existing, nonempty file. Its defining feature is a three-tier matcher that can tolerate formatting differences while preserving a uniqueness safeguard.

#### Preconditions and immediate errors

The method returns `FileEditError` without performing the requested edit when:

- the file does not exist;
- the file is empty (0 bytes);
- `old_string` is empty; or
- more than one match exists while `allow_multiple` is `False`.

For a new file or an empty existing file, use `write_file`. For a targeted change to a populated file, use `edit_file`. *(Source: §6.2, lines 458–476.)*

#### The three matching tiers

##### Tier 1: `exact`

The engine first looks for a character-for-character substring match after normalizing CRLF line endings (`\r\n`) to LF (`\n`) for matching. This is the most predictable strategy and the one an agent should aim for by copying the current source precisely.

Conceptual example:

```json
{
  "filepath": "src/parser.py",
  "old_string": "def parse(value):\n    return value.strip()",
  "new_string": "def parse(value):\n    if value is None:\n        return \"\"\n    return value.strip()"
}
```

A successful response can report `"strategy": "exact"`.

##### Tier 2: `flexible`

If exact matching fails, the engine compares line by line after stripping leading and trailing whitespace on each line. This tolerates indentation and edge-whitespace differences. When constructing the replacement, it reindents `new_string` to preserve the matched block’s baseline indentation.

This is useful when the model has reproduced the right lines but not their precise leading whitespace. It is not a license to omit structurally important internal content: the line sequence still needs to match under the documented normalization.

##### Tier 3: `regex`

Finally, the engine tokenizes `old_string` around these code delimiters:

```text
( ) : [ ] { } > = <
```

It joins the tokens with flexible whitespace (`\s*`), allowing matches across minor line wrapping and spacing discrepancies around those delimiters. This can rescue a replacement when formatting differs from the model’s rendering, but it is more permissive than exact matching; the agent should inspect the returned diff to confirm that the intended block changed.

#### Uniqueness and `allow_multiple`

By default, a replacement must identify one occurrence. This protects against changing every similarly shaped block when only one was intended.

Use:

```json
{
  "filepath": "src/settings.py",
  "old_string": "enabled = False",
  "new_string": "enabled = True",
  "allow_multiple": false
}
```

If the same text occurs twice, the safe response is to add surrounding context and retry—not immediately set `allow_multiple: true`. Set it to true only when replacing **every** matching occurrence is actually intended. String `"true"` and `"false"` values are automatically coerced to booleans by the workspace argument layer.

#### Response

```json
{
  "status": "ok",
  "filepath": "src/module.py",
  "occurrences": 1,
  "strategy": "exact",
  "diff": "--- a/src/module.py\n+++ b/src/module.py\n...",
  "is_truncated": false
}
```

Important fields:

- `occurrences`: how many replacements the operation reports.
- `strategy`: which matching tier succeeded (`exact`, `flexible`, or `regex`).
- `diff`: a unified-diff view of the change.
- `is_truncated`: whether the returned diff hit the 5,000-character output cap. Truncation of the **displayed diff** does not mean the file edit itself was partially applied.

#### Best practices and traps

- **Use a small but unique anchor.** Include the function signature or neighboring lines when repeated snippets are possible.
- **Prefer exact matches.** Copy text from a recent `read_file` result rather than reconstructing it from memory.
- **Inspect `strategy` and `diff`.** A non-exact success deserves extra attention.
- **Do not use an empty `old_string` for insertion.** That is rejected. Anchor the insertion to adjacent existing text.
- **Keep payloads incremental.** Oversized model-generated tool calls can hit `max_output_tokens` and leave the tool-call markup unclosed. Smaller edits are more reliable.
- **Do not target protected tests or configuration for the solution.** Even a successful workspace edit will be stripped from the official patch or reset before scoring.

*(Sources: §§5.3, 6.2, 8.1–8.2, 10.)*

### 3.4 `write_file(filepath: str, content: str) -> str`

#### Purpose

`write_file` creates a new file or replaces the complete contents of an existing file. It also creates missing parent directories, making it suitable for new source modules, fixtures that are not protected from submission, or complete rewrites when a targeted replacement is impractical.

#### What it does

Given a workspace-relative path and a content string, the method:

1. Resolves the path under `/workspace` and rejects traversal.
2. Creates parent directories as needed, equivalent to `mkdir -p`.
3. Creates the file if absent or overwrites it if present.
4. Writes the supplied `content` as the complete file body.
5. Returns the normalized filepath and a size summary.

Unlike `edit_file`, it has no old-content matching requirement and no uniqueness check. It is therefore valid for empty files and new paths, but it also provides less protection against accidentally discarding existing content. *(Source: §6.2, lines 478–484.)*

#### Examples

Create a new module:

```json
{
  "filepath": "src/pkg/result.py",
  "content": "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Result:\n    value: str\n"
}
```

Completely replace an existing file:

```json
{
  "filepath": "src/pkg/result.py",
  "content": "...the complete intended file contents..."
}
```

The second form does not patch only the visible difference; it replaces the entire file. Any content omitted from `content` is lost from the workspace version.

#### Response

```json
{
  "status": "ok",
  "filepath": "tests/repro.py",
  "size": 342
}
```

The example in the source uses a reproduction-test path to illustrate the response shape, not to endorse submitting test modifications. Protected tests are removed from the official patch, while an unprotected scratch file left in the workspace can be captured. The documentation also does not define whether `size` is a character count or encoded byte count, so it should be treated as diagnostic metadata.

#### `write_file` versus `edit_file`

| Situation | Preferred method | Reason |
|---|---|---|
| Create a new file | `write_file` | No existing content to match |
| Populate an empty file | `write_file` | `edit_file` rejects empty files |
| Change one block in a large file | `edit_file` | Preserves everything outside the targeted block |
| Replace a small file wholesale | `write_file` | Complete-content semantics are intentional |
| Insert text relative to existing code | `edit_file` | Anchors insertion without rewriting the file |
| Repeated snippet, only one should change | `edit_file` with more context | Uniqueness check protects unrelated occurrences |

#### Best practices and traps

- **Read an existing file before overwriting it.** The method does not return a diff and does not ask for confirmation.
- **Supply complete content.** A partial file body is still treated as the whole file.
- **Keep generation bounded.** Very large content strings increase the risk of output-token truncation before the tool call closes; split large work into smaller, coherent operations when possible.
- **Use scratch locations deliberately.** Files created below `/workspace` can enter patch extraction; temporary scripts belong in `/tmp` or should be deleted before submission.
- **Do not rely on test/config writes for scoring.** Protected changes are stripped or reset during the verification pipeline.

*(Sources: §§5.3, 6.2, 8.1–8.2, 10.)*

## 4. Code-intelligence graph methods

### 4.1 Shared data model and availability

The three code-intelligence methods are available when the repository has precomputed AST/dependency graph data (`data/graphs/<repo>.json`) and, for similarity search, node embeddings (`data/embeddings/<repo>.npz`). The prompt advertises them only when the relevant files exist and exceed 100 bytes, and only for methods declared in the agent hierarchy.

The graph is an in-memory NetworkX `CustomMultiDiGraph`. In practical terms, symbols are nodes and typed relationships are directed edges. A method such as `get_code_neighbors` can therefore distinguish incoming from outgoing relationships and optionally filter by an edge type such as `calls`. The symbol index uses dotted paths such as:

```text
pkg.module.Class.method
```

The graph layer also performs model-friendly argument coercion: string-encoded integers are accepted for `max_neighbors` and `k`, and `nodes` can be supplied as a JSON-encoded list or comma-separated string in addition to a normal list. *(Source: §§5.2, 6.3, lines 338–345 and 488–490.)*

**Practical implication:** because these data are precomputed, use them as a navigation index and confirm the current working-tree code with `read_file` before editing, especially after making changes.

### 4.2 `get_code_neighbors(node: str, edge_type: str | None = None, max_neighbors: int = 50) -> str`

#### Purpose

`get_code_neighbors` answers: “Which symbols are directly connected to this symbol, and in which direction?” It is the primary method for local call/dependency exploration around a known function, class, or method.

#### What it does

1. Resolves the supplied symbol name to a graph node.
2. Examines incoming and outgoing graph neighbors.
3. Optionally keeps only edges matching `edge_type`, case-insensitively.
4. Returns at most `max_neighbors` entries, whose default is 50.
5. Applies the graph-output character cap and reports truncation.

#### Four-tier symbol resolution

The resolver tries, in order:

1. **Exact match** — the supplied string is the full node key.
2. **Suffix match** — a shorter name matches the end of a node across `.`, `;`, or `/` boundaries.
3. **Case-insensitive match** — casing differences are ignored.
4. **Substring match** — the supplied text is found within a candidate node name.

For example, a canonical node might be:

```text
fastapi.applications.FastAPI.get
```

Depending on the index, a shorter query such as `FastAPI.get` can be resolved through suffix matching. Exact dotted paths are still preferable because they minimize ambiguity. The supplied documentation does not specify how ties are broken when a suffix or substring matches multiple nodes, so a surprising result should be corrected with a more canonical name rather than assumed to be the intended symbol. *(Source: §6.3, lines 492–501.)*

#### Parameters

| Parameter | Default | Effect |
|---|---:|---|
| `node` | Required | Canonical or short symbol name to resolve |
| `edge_type` | `None` | Optional case-insensitive relationship filter, e.g. `calls` |
| `max_neighbors` | `50` | Maximum number of neighbor entries requested |

Example calls:

```json
{
  "node": "pkg.module.Parser.parse"
}
```

```json
{
  "node": "Parser.parse",
  "edge_type": "calls",
  "max_neighbors": 25
}
```

#### Response

```json
{
  "status": "ok",
  "node": "fastapi.applications.FastAPI",
  "neighbors": ["..."],
  "count": 18,
  "is_truncated": false
}
```

The resolved canonical node is returned as `node`, which helps refine later graph calls. Neighbor names are capped by the default 5,000-character output rule; if the serialized result is cut short, `is_truncated` becomes true.

#### Best practices and traps

- **Start canonical when possible.** Use a dotted path from an import, stack trace, or earlier graph result.
- **Use `edge_type` to reduce noise.** A focused `calls` query is easier to interpret than every dependency relationship.
- **Lower `max_neighbors` for high-degree symbols.** This saves context and reduces the chance of truncation.
- **Remember the radius.** This method reports direct neighbors, not the complete transitive call tree. Repeat it on a selected neighbor or use `get_code_subgraph` for relationships among a chosen set.
- **Confirm source text separately.** A graph edge identifies a relationship; it does not show the current implementation body.

### 4.3 `search_similar_code(query: str, k: int = 10) -> str`

#### Purpose

`search_similar_code` finds graph nodes whose precomputed embeddings are closest to a resolved query node, returning their names, source snippets, and similarity scores. It is most useful for finding analogous implementations, related handlers, or sibling methods that may reveal the project’s established pattern.

#### The crucial mechanism: no live query embedding

Despite the natural-language-sounding name, this is **not** a conventional online semantic-search endpoint. The sandbox is offline and has no live neural embedding server.

For a symbol query, the method:

1. Resolves `query` against node keys or suffixes stored in the graph and `.npz` embedding dictionary.
2. Retrieves that node’s precomputed vector.
3. Computes cosine similarity against the other repository nodes.
4. Selects the top `k` results.
5. Returns bounded source snippets and scores.

For a multi-word keyword string, it uses a **lexical token-overlap fallback**. Therefore, a dotted symbol path or short symbol name is the reliable input style:

```text
pkg.module.Class.method
Class.method
parse_header
```

A query such as `"functions that parse HTTP headers defensively"` should not be assumed to receive a newly computed semantic embedding. For exact phrase or identifier searches, `run_command` with `grep` is often the better tool. *(Source: §6.3, lines 503–517.)*

#### Parameters and examples

| Parameter | Default | Effect |
|---|---:|---|
| `query` | Required | Symbol to resolve, or multi-word keywords for lexical fallback |
| `k` | `10` | Number of top results requested |

Symbol-based call:

```json
{
  "query": "HTTPConnection",
  "k": 5
}
```

Canonical-path call:

```json
{
  "query": "pkg.module.Class.method",
  "k": 8
}
```

#### Response

```json
{
  "status": "ok",
  "query": "HTTPConnection",
  "results": [
    {
      "node_name": "...",
      "code": "...",
      "similarity": 0.9412
    }
  ],
  "count": 10,
  "is_truncated": false
}
```

For embedding-based results, `similarity` is the cosine-similarity score used for ranking. A high score identifies vector proximity in the precomputed representation; it does not prove behavioral equivalence or guarantee that the same fix applies.

#### Snippet-budget allocation

The total `code` content across all returned results is capped at 5,000 characters by default. The allocator conceptually divides the budget across the `k` results, then lets unused capacity from shorter snippets roll over to larger ones. If any snippet is truncated, `is_truncated` becomes true.

This has two practical consequences:

- A large `k` can produce many shallow snippets rather than a few useful ones.
- The method is a discovery aid, not a substitute for reading a complete implementation. Use `node_name` to locate the file and then call `read_file` for precise context.

#### Best practices and traps

- **Use a real symbol as the seed.** This activates the intended precomputed-vector path.
- **Start with a modest `k`.** Five good candidates are often more useful than ten heavily truncated candidates.
- **Treat matches as hypotheses.** Inspect their code and tests before copying an approach.
- **Do not confuse it with text search.** Use shell search for literals, error messages, and exact identifiers.
- **Do not expect natural-language semantic search.** Multi-word input falls back to lexical token overlap.

### 4.4 `get_code_subgraph(nodes: list[str]) -> str`

#### Purpose

`get_code_subgraph` extracts the **induced subgraph** for a selected set of symbols: the selected nodes plus the graph edges that interconnect them. It answers “How are these particular symbols related?” rather than “What is everything connected to one symbol?”

#### What “induced” means

If the input selects nodes A, B, and C, the result contains edges from the original graph whose endpoints are within that selected set. It does not automatically add every neighbor of A, B, and C, and it should not be confused with a shortest-path algorithm that inserts arbitrary intermediate nodes.

A good workflow is therefore:

```text
Resolve a central symbol
        ↓
Use get_code_neighbors to choose relevant candidates
        ↓
Pass the central symbol and chosen candidates to get_code_subgraph
        ↓
Inspect the returned relationship edges
        ↓
Read the current source for the important nodes
```

#### Input forms

The declared signature takes a list:

```json
{
  "nodes": [
    "pkg.module.Parser.parse",
    "pkg.module.Parser._tokenize",
    "pkg.module.handlers.handle"
  ]
}
```

The graph layer also coerces JSON-encoded or comma-separated strings emitted by a model into the expected node list. Canonical node names from previous graph responses are the safest inputs. *(Source: §6.3, lines 488–490 and 519–533.)*

#### Response

```json
{
  "status": "ok",
  "nodes": ["node_a", "node_b"],
  "edges": [
    {
      "from": "node_a",
      "to": "node_b",
      "type": "calls"
    }
  ],
  "node_count": 2,
  "edge_count": 1,
  "is_truncated": false
}
```

Each edge exposes direction (`from` and `to`) and relationship `type`. Returned node and edge lists are subject to the default 5,000-character cap, with `is_truncated` indicating an incomplete view.

#### Best practices and traps

- **Curate the input set.** An induced subgraph is most informative when the candidates are already relevant.
- **Use it after neighbor discovery.** This avoids supplying a large, unfocused symbol list.
- **Watch truncation.** A dense subgraph can become unreadable or incomplete; reduce the node set and rerun.
- **Do not expect implementation snippets.** The response is topology—nodes and edges—not source code. Follow up with file reads.
- **Do not expect transitive closure.** Add important intermediates explicitly if they belong in the analysis.

## 5. Choosing the right method

| Question the agent needs to answer | Best first method | Why | Typical follow-up |
|---|---|---|---|
| What files or identifiers are present? | `run_command` | General shell discovery and exact search | `read_file` |
| What does this known file region contain? | `read_file` | Bounded, line-addressed source view | `edit_file` or shell tests |
| What directly calls or depends on this symbol? | `get_code_neighbors` | Directed local graph relationships | `get_code_subgraph`, `read_file` |
| Are there analogous implementations? | `search_similar_code` | Precomputed embedding similarity | `read_file` |
| How are these selected symbols interconnected? | `get_code_subgraph` | Induced typed-edge view | `read_file` |
| How should this existing block change? | `edit_file` | Targeted replacement with matching safeguards | `run_command` tests |
| How should a new or empty file be populated? | `write_file` | Complete-content creation and parent-directory setup | `run_command` checks |
| Did the focused tests pass? | `run_command` | Executes tests and captures exit/output | Further edit or `submit_patch` |
| How much budget remains? | `get_status` | Live counters without consuming a tool call | Replan or finalize |
| Is the solution ready to become the official diff? | `submit_patch` | Captures changes and ends Phase 1 | Final text response |

A useful division of labor is:

- **Shell methods for exact text and execution.** Use `run_command` for `find`, `grep`, Git, tests, and assertions.
- **File methods for bounded source I/O.** Use `read_file` and `edit_file` for precise inspection and modification.
- **Graph methods for symbol-level navigation.** Use them to reduce blind repository exploration, not to replace source reading.

## 6. Recommended end-to-end workflows

### 6.1 A disciplined bug-fix loop

```text
get_status (optional, free)
        ↓
run_command: inspect status, locate files, search exact identifiers
        ↓
read_file: inspect the smallest useful source ranges
        ↓
Optional graph sequence:
search_similar_code → get_code_neighbors → get_code_subgraph
        ↓
read_file: confirm the current code around the selected edit
        ↓
edit_file: apply a focused source change
        ↓
run_command: inspect diff and run targeted tests/assertions
        ↓
Repeat edit/test only while the evidence justifies it
        ↓
run_command: clean scratch files and inspect final repository state
        ↓
submit_patch (free in tool-call terms, final action)
```

This loop spends budget on evidence rather than repeated broad reads. It also keeps submission separate from verification: `run_command` performs local checks, while `submit_patch` records the finished state.

### 6.2 Graph-guided navigation without wasting context

1. Seed `search_similar_code` with a known symbol from the problem statement or traceback.
2. Choose one or two relevant `node_name` results instead of reading every snippet.
3. Call `get_code_neighbors` on the most relevant node, filtering by `calls` if appropriate.
4. Select the small set of symbols that matter and call `get_code_subgraph`.
5. Locate and read the corresponding current source files.
6. Return to the normal edit-and-test loop.

The key is to use graph output to **select** source reads, not to accumulate graph JSON indefinitely.

### 6.3 Recovering from a failed `edit_file`

| Observed problem | Recommended recovery |
|---|---|
| `FileEditError`, no file | Confirm the path with shell discovery; use `write_file` only if creation is intended |
| `FileEditError`, empty file | Populate it with `write_file` |
| `FileEditError`, empty `old_string` | Supply a real anchor from current source |
| `FileEditError`, multiple matches | Read the relevant regions and add unique surrounding context |
| No match after formatting drift | Re-read the block and copy exact text; allow the flexible/regex tiers to handle only minor differences |
| Success with unexpected `flexible` or `regex` match | Inspect the returned diff and current file before making more changes |
| Returned diff is truncated | Treat the edit as applied, but verify the precise region with `read_file` and `git diff` |

### 6.4 Endgame under a budget warning

1. Stop broad graph and repository exploration.
2. Call `get_status()` if the exact remaining time or calls are unclear.
3. Run one decisive targeted test or assertion if affordable.
4. Inspect the final diff and remove unprotected scratch files.
5. Call `submit_patch()` explicitly.

Because `get_status` and `submit_patch` do not consume the tool-call budget, they remain appropriate finalization operations even when ordinary exploration calls are exhausted, subject to wall-clock time.

## 7. Failure modes and important gotchas

### 7.1 Truncation is method-specific

A single “5,000-character limit” does not mean identical behavior everywhere:

- `run_command`: command output streams are truncated.
- `edit_file`: the **returned diff** is truncated, not necessarily the edit.
- `get_code_neighbors`: the neighbor-name output is capped.
- `search_similar_code`: the aggregate snippet budget is distributed across results.
- `get_code_subgraph`: returned node and edge lists are capped.
- `read_file`: a separate dual cap of 150 lines and 10,000 characters applies.

Always inspect `is_truncated` where provided. Do not mistake a partial view for a partial workspace mutation or a complete repository analysis. *(Source: §§6.1–6.3.)*

### 7.2 Protected files can be edited locally but will not survive as the solution

The patch pipeline strips protected test and runner-configuration paths. During verification, it also resets relevant protected files to the evaluation baseline before applying the task’s official test patch. This includes conventional test paths and names plus files such as `conftest.py`, `pytest.ini`, `pyproject.toml`, `tox.ini`, `setup.cfg`, and other test-runner hooks.

Therefore:

- local edits to such files may change Container A behavior temporarily;
- those edits are not a valid way to influence the score;
- the official patch must fix non-protected project code; and
- temporary reproduction tests should be treated as scratch artifacts, not deliverables.

*(Source: §8.1–8.2, especially lines 590–615.)*

### 7.3 An unsubmitted diff can survive, but explicit submission is still correct

The fallback extracts non-protected working-tree changes after several kinds of termination. This is a recovery mechanism, not a reason to omit `submit_patch`. Explicit submission gives the agent control over cleanup, final verification, and endpoint timing.

### 7.4 Large tool calls can fail before the method executes

If the model spends too many output tokens on reasoning and then starts a large `edit_file` or `write_file` call, the response can hit `max_output_tokens` before the tool-call markup closes. The harness can issue a targeted continuation nudge, but prevention is better: use bounded reasoning and smaller incremental edits. This is a model-output/protocol failure, distinct from a `FileEditError` returned by an executing method. *(Source: §§5.3, 10.)*

### 7.5 Local test success is useful evidence, not the scoring criterion

Final verification starts from a fresh baseline, applies the agent patch with resilient fallback passes, resets protected paths, applies the task’s test patch, and runs hermetic `pytest`. A task is resolved only when the test command exits zero **and** JUnit XML validation confirms positive, non-skipped passes for every required test node with no failures or errors. Agents should therefore favor robust source fixes over behavior that depends on temporary Container A state. *(Source: §8.2, lines 596–629.)*

## 8. Compact method cards

### `run_command`

- **Input:** shell command string.
- **Budget:** one tool call.
- **Mutates:** potentially, depending on the command.
- **Returns:** `stdout`, `stderr`, `exit_code`, or structured command/timeout error.
- **Main limit:** dynamic timeout and output truncation.
- **Best for:** discovery, exact search, Git inspection, tests, assertions.

### `submit_patch`

- **Input:** none.
- **Budget:** no tool-call charge.
- **Mutates:** Git intent-to-add state and harness submission state; captures workspace diff.
- **Returns:** `patch_size`, `files_changed`.
- **Main side effect:** terminates Phase 1 after the current response/turn.
- **Best for:** final, explicit handoff to patch extraction and verification.

### `get_status`

- **Input:** none.
- **Budget:** no tool-call charge.
- **Mutates:** nothing in the workspace or patch state.
- **Returns:** live call, time, turn, timeout, and patch-status fields.
- **Best for:** pacing and endgame planning.

### `read_file`

- **Input:** path plus optional inclusive 1-indexed line bounds.
- **Budget:** one tool call.
- **Mutates:** nothing.
- **Returns:** content and precise interval/truncation metadata.
- **Main limit:** 150 lines and 10,000 characters.
- **Best for:** bounded inspection of a known file.

### `edit_file`

- **Input:** path, old string, new string, optional multi-replacement flag.
- **Budget:** one tool call.
- **Mutates:** targeted content in an existing nonempty file.
- **Returns:** occurrence count, matching strategy, and bounded diff.
- **Main safeguards:** nonempty anchors and uniqueness by default.
- **Best for:** focused source changes.

### `write_file`

- **Input:** path and complete content.
- **Budget:** one tool call.
- **Mutates:** creates or overwrites the whole file; creates parents.
- **Returns:** filepath and size summary.
- **Main risk:** unintentional wholesale replacement.
- **Best for:** new files, empty files, and deliberate complete rewrites.

### `get_code_neighbors`

- **Input:** symbol, optional edge-type filter, optional result maximum.
- **Budget:** one tool call.
- **Mutates:** nothing.
- **Returns:** resolved node, direct neighbors, count, truncation flag.
- **Main feature:** four-tier symbol resolution and directed graph traversal.
- **Best for:** local caller/callee/dependency exploration.

### `search_similar_code`

- **Input:** symbol query or keyword fallback, optional `k`.
- **Budget:** one tool call.
- **Mutates:** nothing.
- **Returns:** ranked nodes, source snippets, similarities, truncation flag.
- **Main feature:** cosine similarity over precomputed vectors; no live query embedding.
- **Best for:** discovering analogous implementations.

### `get_code_subgraph`

- **Input:** selected symbol list.
- **Budget:** one tool call.
- **Mutates:** nothing.
- **Returns:** selected nodes, interconnecting typed edges, counts, truncation flag.
- **Main feature:** induced-subgraph extraction.
- **Best for:** understanding relationships within a curated symbol set.

## 9. Open questions and documentation limits

The supplied README is detailed enough to explain the public behavior and recommended operational use, but several implementation details are not specified:

1. **Ambiguous graph-name tie-breaking.** The four resolver tiers are documented, but not how multiple candidates within one tier are ranked or disambiguated.
2. **Exact lexical-fallback scoring.** The existence of token-overlap fallback is documented, but not its tokenization, normalization, or score formula.
3. **Units of summary sizes.** The README does not define whether `patch_size` and `write_file`’s `size` count characters, bytes, or another unit.
4. **Complete error taxonomies.** Specific errors are given for command execution, editing, and path traversal, but not every possible read, write, or graph failure variant.
5. **Graph freshness after edits.** The data are explicitly precomputed; the documentation does not describe any reindexing during a task. The safe practice is to confirm current code with file reads.
6. **Implementation-level verification.** No package source files were supplied alongside the README, so this primer does not claim to validate the code paths beyond the provided technical reference.

These gaps do not prevent effective use of the methods; they identify places where agents should prefer canonical inputs, inspect returned metadata, and verify workspace state rather than relying on undocumented behavior.

## Sources

1. **User-supplied `HARNESS_README.md`**, “`swegemma` Evaluation Harness & Competitor Guide.” Primary references: §4 (Two-Phase Evaluation Lifecycle), §5 (Harness-to-Agent Interaction Protocol), §6 (Built-In Tools Reference), §7 (Budgets, Operational Limits & Context Management), §8 (Patch Extraction & Phase 2 Verification), and §10 (Competitor Best Practices & Important Gotchas).
2. **Method-specific line references in the supplied document:** common response/budget behavior, lines 371–382; execution and lifecycle methods, lines 384–433; workspace methods, lines 437–484; graph methods, lines 488–533; patch extraction, lines 584–594; verification, lines 596–629; operational gotchas, lines 681–692.

*No external sources were used. The report’s examples and workflows are explanatory compositions based on the behavior specified in the supplied README; where the documentation is silent, the limitation is stated explicitly rather than filled with assumptions.*


---

<!-- ====================================================================== -->
<!-- FILE: 08_swegemma-timeout-prevention-primer-2026-11-02.md -->
<!-- ====================================================================== -->

# Avoiding Timeouts in the `swegemma` Competition Harness

## Evidence from the Kaggle discussion board

*Scope: Prevention and recovery guidance for the Gemma 4 Developer Agent competition, combining the supplied `HARNESS_README.md` with a 2026-11-02 scan of the linked Kaggle discussion board. The scan covered 292 topics and 936 returned topic/comment records. Official host statements, community measurements, and version-specific bug reports are labeled separately.*
*Revision note: This edition adds the discussion-board evidence and corrects the earlier documentation-only example that mirrored a 60-minute per-task budget. That is not a safe whole-run scored configuration.*

## Executive summary

The most important timeout is not the 300-second command timer. It is the **whole scored run**. Kaggle staff said hidden tasks run sequentially, approximately 120 tasks share the same 12-hour evaluation, and vLLM startup counts toward that window. A 60-minute per-task cap could theoretically consume 120 hours across 120 tasks, so it is not a viable scored-run budget. ([Staff on sequential execution and the 12-hour limit](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743063#3527819); [staff on approximately 120 tasks in one run](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744258#3530082); [staff on startup counting](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/745805#3534268).)

Budget in three layers:

1. **Whole run:** reserve time for startup, setup, and slow tasks before choosing a per-task cap.
2. **Agent session:** stop exploration early enough to edit, verify, and submit; all agents share the task budget.
3. **Commands and verification:** keep commands bounded and ensure the submitted patch cannot hang the scorer’s fixed 300-second test run.

The board also reports failure modes absent from the README: inference-server startup exceeding 1,200 seconds, queue-related “Kaggle Error” failures, a version-specific Gemma tool-parser infinite loop, malformed edit calls repeatedly consuming budget, and multi-stage agents redoing work after continuation nudges. These need different responses. Some are participant-controllable; others are infrastructure incidents that no prompt or YAML setting can prevent.

No configuration can guarantee zero timeouts. The practical objective is to finish the whole run with margin, preserve a valid patch on each task, and correctly identify incidents that require host action rather than another resubmission.

## 1. Timeout map: identify the clock before changing anything

| Failure or symptom | Evidence and meaning | Can the submission prevent it? | Correct first response |
|---|---|---|---|
| Whole notebook/run reaches 12 hours | Too much aggregate agent, startup, and setup time across approximately 120 sequential tasks | **Mostly**, through whole-run budgeting | Recalculate per-task cap and overhead reserve |
| Per-task agent session reaches `max_time_minutes` | Exploration, reasoning, retries, or multi-agent work consumed the task clock | **Usually** | Bound exploration, monitor status, finalize earlier |
| `run_command` returns `TimeoutExceeded` | One command reached its dynamic deadline; session normally continues | **Usually** | Replace with a narrower, non-interactive command |
| Phase 2 verification exceeds 300 seconds | Submitted code or required tests hang or run too slowly | **Often**, but not always | Test the exact patch fresh; remove unbounded behavior |
| Long `PENDING`/`Running` wait | May be queueing rather than agent execution; staff extended the queue allowance | **No** | Check the official queue thread; do not tune agent YAML for queue delay |
| `ServerStartupError` after 1,200 seconds or early `Notebook Threw Exception` | Reported inference-startup/infrastructure failure | **Often no** | Preserve evidence and check host incident updates |
| Server stops answering after an array tool argument | Reported vLLM 0.19.1 parser non-advancing loop | **Sometimes**, by avoiding affected argument shapes/tools | Verify wheelhouse version and remove risky array tools if affected |
| Repeated missing-argument errors on edits | Malformed tool calls consume turns and time | **Often** | Reconstruct smaller calls; never resend identical failures |
| Continuation nudge causes earlier agent stages to rerun | Community-reported `SequentialAgent` resume/context behavior | **Often**, through simpler orchestration | Test nudge paths or avoid fragile multi-stage pipelines |
| Exit 137 / `Notebook Exceeded Allowed Compute` | Resource limit, not an ordinary timeout | **Sometimes** | Reduce memory/concurrency; diagnose separately |
| Tool/turn/nudge exhaustion | Budget termination even with wall time left | **Usually** | Control loops and make each turn perform useful work |

## 2. Budget the 12-hour run first

### 2.1 Official constraints established on the board

Kaggle staff gave these answers on 2026-09-24:

- hidden tasks run **sequentially**;
- the scorer reads `timeout_seconds`, `max_tool_calls`, `max_time_minutes`, and `max_turns`;
- at that time, hitting the 12-hour limit caused an error, and staff recommended a moderate `max_time_minutes` failsafe. ([Staff answer](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743063#3527819).)

On 2026-09-29, staff clarified that approximately **120 tasks**—about 60 public and 60 private—are scored during the **same 12-hour run**. ([Staff answer](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744258#3530082).) On 2026-10-07, staff also answered yes to vLLM startup counting toward that window. ([Staff answer](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/745805#3534268).)

Do not assume unfinished tasks will safely receive zero. On 2026-10-15, staff were still reconsidering how to do that consistently across public and private leaderboards. The safe planning assumption is therefore **finish before the global limit** rather than depend on partial scoring. ([Staff follow-up](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/749597#3539198).)

### 2.2 Use a whole-run inequality

Use this relationship, not the library’s per-task default in isolation:

```text
N × (per-task agent cap + measured per-task overhead)
+ inference startup
+ global safety reserve
≤ 12 hours
```

Where:

- `N` is approximately 120 according to the staff answer;
- per-task agent cap is `max_time_minutes`;
- overhead includes per-task setup and other charged non-agent work;
- the safety reserve absorbs slow tasks, retries, and environment variation.

A simple illustration with one hour reserved for startup, setup, and overhead:

```text
(12 h − 1 h) / 120 = 5.5 minutes per task
```

This is arithmetic, not an official mandated cap. One team independently adopted 5.5 minutes on Kaggle after 4×L4 calibration, estimating 11 hours of agent time and about one hour for setup and overhead. Their scored 5.5-minute submission completed, but they explicitly said this did not guarantee future configurations. ([Community calibration, 2026-10-06](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/746250#3533676); [follow-up, 2026-10-09](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747857#3536125).)

### 2.3 Correct the configuration mistake

Do **not** use this merely because it mirrors library defaults:

```yaml
# Unsafe as a scored-run starting point:
evaluation:
  max_time_minutes: 60
```

Across 120 sequential tasks, the agent caps alone could total 120 hours. The README’s 60-minute value is an inference/library default, not evidence that 60 minutes fits the competition’s aggregate window.

Likewise, the sample’s one-minute/ten-call configuration is a smoke-test setting, not a generally suitable competition budget.

A community-derived **starting hypothesis** is:

```yaml
evaluation:
  timeout_seconds: 300
  max_tool_calls: 50
  max_time_minutes: 5.5
  max_turns: 80
```

The 5.5-minute cap and 50-call/80-turn shape draw on the cited community experiments. They are not official optimum values. Recalibrate for your model, adapters, prompt, tools, and current scorer. Explicitly setting all four fields also avoids relying on defaults that have varied across board reports and harness versions.

### 2.4 Do not assume a smaller cap is automatically better

Community ablations show a quality–runtime tradeoff, not a monotonic “shorter is safer and better” rule:

- In one local sweep, 6-, 10-, 15-, 20-, and 60-minute caps produced 61, 26, 3, 4, and 0 session timeouts respectively; resolved counts did not increase monotonically. The author selected 15 minutes for that local quality sweep, **not** for Kaggle submission. ([Experiment](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/746250#3533676).)
- Reducing a tool budget from 50 to 25 calls reduced median runtime by 29% but resolved 14 fewer tasks in that experiment. ([Same experiment](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/746250#3533676).)
- In a later sequential-B40 comparison, 4.5 minutes produced more session timeouts than 7 minutes, and the observed pass-count difference did not establish a statistically meaningful accuracy improvement. ([Follow-up](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747857#3536125).)

Choose a cap that fits the aggregate run, then test whether the agent can still localize, edit, and finalize within it. Do not sacrifice solution quality merely to make a timeout metric look smaller.

## 3. Prevent per-task session timeouts

### 3.1 Long exploration is the recurring participant-side cause

A team whose first full run timed out reported these changes: budget for the slowest case, cap tool calls, remove latency-heavy components, put stopping rules in the prompt, test the failure path, and change one variable at a time. They specifically identified long exploratory loops as the usual cause of their timeouts. ([Community lessons, 2026-10-25](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/752511#3544293).)

A separate trace analysis found that many default-prompt tasks never edited a source file; most of those no-edit tasks ran out of time. However, forcing an early edit often produced a wrong edit rather than a solution. The lesson is not “edit blindly by call N.” It is **bound localization, then require a concrete implementation and finalization phase**. ([Trace analysis, 2026-10-14](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/749198#3538461).)

### 3.2 Use phase gates, not one open-ended loop

Recommended policy within each task:

```text
Orientation and localization
→ Source-reading stop rule
→ Initial implementation
→ Targeted verification and bounded repair
→ Patch hygiene
→ Explicit submit_patch()
```

A workable prompt should tell the agent:

- what evidence is enough to stop searching;
- when to make the first reasoned source edit;
- how many failed repair attempts to tolerate before preserving the best state;
- to use `get_status()` before expensive work and during finalization; and
- to call `submit_patch()` explicitly rather than end with a text-only status update.

The README documents a tool-call warning when at most ten calls remain for budgets of 20 or more. There is no equivalent automatic “time almost exhausted” warning described, so the agent must inspect `time_seconds_remaining` through the free `get_status()` method.

### 3.3 Every stage shares the same task budget

The README describes a single task evaluation budget, and board contributors emphasize that one clock, call counter, and turn counter cover the entire agent hierarchy. In one two-stage test, a team reported that 7 of 8 timeouts came from the first stage. ([Combined incident report, 2026-10-22](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747519#3542626).)

Consequences:

- A localization sub-agent can consume the time the coder needs.
- A `LoopAgent` needs a small intentional `max_iterations` and a real stopping condition.
- More sub-agents do not create more task time.
- A component should justify its latency with measured benefit.

Prefer the simplest architecture that solves the task. If a read-only `AgentTool` reduces context and latency, use it; do not add a multi-stage pipeline solely for architectural elegance.

### 3.4 Test continuation behavior, especially for `SequentialAgent`

A 2026-10-31 community report says continuation nudges can restart a `SequentialAgent` from stage 1, while shared-session context duplication can trigger premature compaction and more latency. This is a detailed participant diagnosis, not an official confirmation. ([Community orchestration report](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754636#3547929).)

Conservative mitigation:

1. Test a turn that ends normally without submission.
2. Test a `MAX_TOKENS` finish and an intentionally unclosed tool call.
3. Verify whether stage 1 reruns or overwrites state.
4. Measure duplicated prompt tokens and compaction events.
5. If resume behavior is unreliable, use a single `LlmAgent` or a narrowly scoped `AgentTool` rather than a fragile sequential pipeline.

The harness’s nudge mechanism is documented; the reported stage-restart impact is the additional community finding.

## 4. Keep command timeouts in proportion

### 4.1 The documented command behavior

`run_command` uses:

```text
min(command_timeout_seconds, max(5, int(remaining_time_seconds)))
```

The default command ceiling is 300 seconds. A timeout returns `TimeoutExceeded` and normally does not end the session unless the overall session time has also expired. The correct recovery is to narrow or replace the command, not resend it unchanged. (`HARNESS_README.md`, §6.1, lines 386–390.)

Avoid:

- package installation or downloads in the offline sandbox;
- interactive commands waiting for input;
- watchers and foreground servers;
- unbounded full-suite runs;
- verbose repository dumps; and
- background jobs that continue consuming the 2-vCPU/4-GiB sandbox resources.

Prefer targeted test node IDs, focused `grep`/`find`, inline assertions, and bounded output.

### 4.2 Board evidence says command timeout was rarely the main bottleneck

In one 129-task ablation, only approximately **0.06–0.47% of commands** timed out across tested configurations. The author treated 150 seconds as a candidate default but explicitly did not establish it as an optimum or prove equivalence to 300 seconds. ([Command-timeout ablation](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747857#3536125).)

Therefore:

- Do not assume lowering `timeout_seconds` will improve score.
- Do not spend all optimization effort on command timeouts while session timeouts dominate.
- Keep 300 seconds as a reasonable starting ceiling unless your own traces support another value.
- Measure timed-out commands separately from agent-session timeouts.

This community result is specific to one setup and stochastic single-run comparisons; use it to prioritize measurement, not as a universal frequency.

## 5. Prevent tool-call failures from becoming time failures

### 5.1 Split large edits and reasoning blocks

The README warns that a large thought block followed by a large `edit_file` or `write_file` call can hit `max_output_tokens` before closing the tool-call markup. The harness may nudge the agent, but the retry consumes time and turns.

Use bounded reasoning and incremental edits. The README’s example starting point is `thinking_budget: 4096` with `max_output_tokens: 16384`, not a requirement to generate maximally long responses. (`HARNESS_README.md`, §§5.3, 10.)

### 5.2 Do not resend malformed edit calls unchanged

One team reported that, across 104 runs, 60 of 234 `edit_file` calls and 20 of 255 `write_file` calls were rejected for missing mandatory arguments, while 0 of 1,135 `run_command` calls had that failure. They also reported 64 exact resends and one run with 34 rejected calls that timed out. Their example involved a backtick and subsequent argument parsing. This is one team’s dataset, not a harness-wide rate. ([Incident details](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747519#3542626).)

Mitigation:

- Keep edit payloads small.
- Avoid unnecessary code fences and backtick-heavy content inside arguments.
- On a missing-parameter error, inspect the received call shape if visible.
- Reconstruct a simpler call with fresh arguments; never exact-resend a parser failure.
- If appropriate, use a small, carefully quoted scalar-argument alternative and inspect the resulting diff.
- Put a hard limit on repeated identical tool errors.

### 5.3 Version-specific: avoid array-argument parser hangs

Multiple participants reported a non-advancing loop in the Gemma 4 tool parser in vLLM 0.19.1. A malformed array argument can leave the parser index stationary, block the API server’s event loop, and prevent later requests from being served. A 2026-10-29 report described subsequent tasks receiving zero model calls until their agent clocks expired. ([Initial parser report](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/745138#3535323); [local server-hang report](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/746336#3533812); [detailed follow-up](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/753973#3546910).)

The reports identify array-valued arguments, including skill-script arguments and potentially list-valued code-graph calls. The README’s `get_code_subgraph(nodes: list[str])` is therefore relevant **if the current scorer still uses an affected parser**.

Conservative response:

1. Check the current wheelhouse and vLLM parser version; do not assume an old bug remains unfixed.
2. If affected, avoid declaring array-argument tools unless their benefit justifies the risk.
3. Consider removing `get_code_subgraph` and array-taking skill scripts from the exposed toolset under the affected version.
4. Prefer scalar-argument navigation and command tools.
5. Test malformed-argument handling locally before a full scored run.

This workaround is version-specific. It should not be presented as a permanent requirement after the parser is fixed.

## 6. Separate infrastructure delays from agent timeouts

### 6.1 Queue delays and “Kaggle Error”

On 2026-10-08, staff said high L4 submission volume caused long queues, and jobs waiting more than 15 hours to start had been marked “Kaggle Error.” Staff said they had drastically extended the queue allowance so submissions would no longer time out while waiting, were reprocessing affected runs, and were adding a pending-submission limit. ([Official queue update](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747519#3535572).) Two days later, staff reported an approximately 33-hour queue delay. ([Staff follow-up](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747519#3536532).)

Operational guidance:

- A long pending wait is not evidence that the agent is looping.
- Changing `max_time_minutes` cannot fix a machine queue.
- Check the official thread before resubmitting or consuming another slot.
- Keep the submission ID, ZIP hash, timestamps, and observed status.
- Do not infer charged runtime from submit-to-score wall time without knowing queue time.

Queue conditions are time-sensitive; the historical 33-hour figure is not a current estimate.

### 6.2 Inference-server startup failures

A participant reported `ServerStartupError: Inference server did not become healthy within 1200s`, with the same model-loading code previously starting in six minutes. ([Startup report](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751264#3541998).) Another team measured 4×L4 vLLM starts ranging from 454 to 1,677 seconds across two days and correlated some unchanged-bundle failures with slow model loading; that causal attribution was their assessment, not an official root-cause declaration. ([Combined report](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747519#3542626).)

For one non-LoRA submission that failed with `Notebook Threw Exception`, staff explicitly said on 2026-10-22 that it appeared to be a failure on their side and that affected submissions would be rerun. ([Staff acknowledgement](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751339#3542818).)

Participant control is limited here:

- Validate and compile the exact ZIP locally.
- Keep adapters and moving parts no larger than necessary.
- Record whether the run reached the first task.
- Check the board for a failure wave before changing a known-good bundle.
- Report the submission ID and preserve the frozen artifact.

Do not respond to an acknowledged host-side startup failure by randomly rewriting prompts or budgets.

## 7. Prevent verification timeouts in the fresh scorer

Staff confirmed on 2026-10-12 that a participant’s `eval_config.yaml` does not control final scoring; scorer-side `pytest` receives a **300-second timeout** to prevent hung tests from killing the whole submission. ([Staff answer](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748428#3537307).) The supplied README likewise lists Phase 2 verification as fixed at 300 seconds on the scorer.

A separate community measurement found some no-patch public runs hanging to the cap because of infinite-loop bugs, with pytest’s own timeout option disabled by `-o timeout=0`. That setting does **not** remove the harness’s outer 300-second limit. ([Runtime analysis](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748443#3537175).)

Before submission:

- Remove unbounded loops, sleeps, polling, retries, network waits, and subprocess/IPC waits.
- Check algorithmic behavior on inputs larger than the local reproduction.
- Avoid expensive import-time work and per-test repeated setup.
- Run no-patch and gold-patch validation locally to distinguish baseline environment problems from the agent’s change.
- Run the exact extracted patch through fresh Phase 2 verification.
- Read `test_outputs/<instance_id>.log`, not only the Phase 1 transcript.

Gold patches finishing quickly in the official environment does not prove an agent patch will finish; the patch can introduce new hangs.

## 8. Model retries and context loss still consume time

The README documents up to five automatic retries for transient model/proxy errors, with exponential backoff up to 60 seconds and jitter. These retries improve resilience but can consume the same per-task clock. Leave enough margin for a slow model turn and avoid adding independent retry storms. (`HARNESS_README.md`, §7.2.)

Long contexts also create time risk through compaction, repeated tool output, and token-truncated turns. Keep outputs focused, use sub-agents only when they reduce total work, and test continuation paths. Do not rely on automatic unsubmitted-patch recovery for every error class: the README explicitly describes fallback after termination modes such as timeout, budget exhaustion, and nudge exhaustion, but that should not be generalized into a guarantee for every infrastructure or context exception.

## 9. Diagnostic playbook

| Evidence in logs or UI | Likely interpretation | Next action |
|---|---|---|
| `TimeoutExceeded` in a tool response | One Phase 1 command timed out | Narrow the command and check session time |
| Many tasks end at `max_time_minutes` | Agent-session budget is binding | Bound exploration and simplify the architecture |
| Whole run approaches 12 hours | Aggregate budget is binding | Recalculate cap from whole-run arithmetic |
| Only a tiny fraction of commands time out | Command timer is not the main problem | Prioritize session and global budgeting |
| Identical missing-argument edit errors repeat | Parser/tool-call loop | Reconstruct smaller calls; cap repeats |
| Server CPU spins and `/v1/models` stops responding under affected vLLM | Possible array-parser hang | Remove affected array tools; verify parser version |
| No model calls on consecutive later tasks after a malformed array | Possible server-wide stall, not ordinary task difficulty | Preserve trace and investigate parser path |
| Stage 1 repeats after a continuation nudge | Possible sequential-agent restart | Simplify orchestration or repair resume behavior |
| `PENDING` for many hours | Possible queue backlog | Check official queue updates; do not tune agent code for queueing |
| Failure before first task / `ServerStartupError` | Possible infrastructure startup failure | Preserve evidence and check host incident response |
| Phase 2 reaches 300 seconds | Verification hang or slow test path | Test exact patch fresh and remove unbounded behavior |
| Exit 137 / allowed-compute error | Resource limit, not normal timeout | Reduce memory/concurrency and diagnose resource use |

## 10. Rehearsal protocol before spending a scored submission

### Step 1: Freeze and validate the artifact

- Compile the exact submission with the current official libraries.
- Confirm the four `evaluation` fields are explicit.
- Record ZIP hash, model/adapters, library versions, and configuration.
- Keep a known-good artifact for comparison.

### Step 2: Validate the environment before measuring agent speed

- Run no-patch and gold-patch checks on the public tasks used for development.
- Fix missing local test dependencies or document excluded tasks.
- Do not interpret environment failures as agent timeout behavior.

### Step 3: Calibrate on comparable serving conditions

The community calibration changed its recommendation when it moved from multiple concurrent agents per B40 server to one sequential agent per replica. Measure your own model tokens, tool execution, and wall time under comparable concurrency. Do not copy another GPU’s minute conversion without calibration. ([Calibration discussion](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747857#3536125).)

### Step 4: Measure the long tail

Record per task:

- agent elapsed time and P50/P90/P95/max;
- setup time;
- LLM and tool-call counts;
- session timeouts versus command timeouts;
- malformed/repeated tool calls;
- compaction and nudge events;
- explicit submission rate; and
- Phase 2 duration and outcome.

Budget for slow tasks, not only the median.

### Step 5: Test failure paths deliberately

- A slow task that reaches the agent cap.
- A command that reaches its command cap.
- Repeated rejected edit calls.
- A normal stop without `submit_patch()`.
- A token-truncated tool call.
- If relevant, malformed array arguments under the exact parser version.
- Fresh verification of the exact extracted patch.

Confirm that the agent preserves the best valid state and submits when budgets are nearly exhausted.

### Step 6: Recompute the whole-run budget

Use measured overhead and long-tail time in the inequality from §2.2. Keep a real reserve for startup and infrastructure variation. Change one major variable at a time so the cause of an improvement remains identifiable.

### Step 7: Check current incidents before submitting

Review the official queue/update thread and recent board posts. A scorer-side failure wave is not the right time to debug a known-good ZIP through repeated submissions.

## 11. Reusable root-agent policy

```markdown
Time and termination policy:
- The whole scored run has a global time budget; this task receives only a small share of it.
- Wall-clock time, tool calls, turns, command timeouts, output tokens, and verification time are separate constraints.
- Use get_status() after localization, before expensive tests, after any timeout, and before finalization.
- Stop broad exploration once sufficient evidence supports a source edit; do not edit blindly merely to meet a call-number deadline.
- Never run network access, package installation, interactive commands, watchers, or unbounded servers.
- Prefer focused searches, small reads, targeted tests, and inline assertions.
- If a command returns TimeoutExceeded, do not repeat it unchanged; narrow it and check remaining time.
- If an edit call is rejected for malformed or missing arguments, reconstruct a smaller call; never exact-resend the same failure.
- Keep reasoning brief and edits incremental to avoid token-truncated tool-call markup.
- All sub-agents share this task's budget. Avoid unnecessary hand-offs and loops.
- Either perform concrete work or finalize; do not emit repeated text-only status updates.
- Reserve time for patch hygiene, one decisive verification, and explicit submit_patch().
```

## 12. Final checklist

### Whole-run configuration

- [ ] The per-task cap was derived from the 12-hour/~120-task run, not copied from a library default.
- [ ] Startup, setup, slow-task, and retry reserve is included.
- [ ] All four supported evaluation fields are explicit.
- [ ] The configuration has been calibrated under comparable serving concurrency.

### Agent behavior

- [ ] Exploration has an evidence-based stopping rule.
- [ ] `get_status()` is used at real decision points.
- [ ] Repeated malformed calls and command retries have hard limits.
- [ ] Sub-agents and loops have measured value and strict stopping conditions.
- [ ] Continuation/nudge behavior has been tested on the actual architecture.
- [ ] The agent explicitly submits before the task deadline.

### Tools and parser safety

- [ ] Large edits are split into bounded calls.
- [ ] The current vLLM parser version has been checked for the reported array-argument hang.
- [ ] Array-argument tools are removed if the deployed parser is affected and the workaround is necessary.
- [ ] Commands are offline, non-interactive, and bounded.

### Verification and incident handling

- [ ] The exact patch passes fresh Phase 2 verification with margin under 300 seconds.
- [ ] No-patch/gold-patch checks distinguish environment issues from agent changes.
- [ ] Logs distinguish session, command, global, queue, startup, verification, and resource failures.
- [ ] Current host incident updates are checked before resubmitting.
- [ ] Submission ID, timestamps, ZIP hash, and relevant logs are preserved for host-side incidents.

## 13. Evidence limits and remaining uncertainties

- The 5.5-minute operating point is a community result, not an official guarantee or universal optimum.
- Board experiments use different hardware, concurrency, task subsets, wheelhouse versions, prompts, and stochastic runs. Their numbers should guide hypotheses, not be treated as stable harness-wide rates.
- The parser hang and `SequentialAgent` reports are detailed community diagnoses; the board evidence reviewed here does not establish that every current scorer path remains affected.
- Staff statements about queue recovery and infrastructure incidents are time-specific. Check the linked official thread for current updates.
- The supplied README and older board answers sometimes describe different defaults. Explicit configuration and local validation are safer than relying on either source’s defaults blindly.
- No participant-side guide can prevent all queue, startup, or scorer infrastructure failures.

## Sources

### Official host statements

1. [Scoring-run questions: sequential tasks, supported fields, and the 12-hour limit — 2026-09-24](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/743063#3527819).
2. [Approximately 120 tasks in the same 12-hour run — 2026-09-29](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/744258#3530082).
3. [Aggregated questions, including startup counting and verification — 2026-10-07](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/745805#3534268).
4. [Official update on “Kaggle Error” submissions and queue delays — 2026-10-08](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747519#3535572).
5. [Staff answer on scorer-side 300-second pytest timeout — 2026-10-12](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748428#3537307).
6. [Staff follow-up on unfinished tasks at the global limit — 2026-10-15](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/749597#3539198).
7. [Staff acknowledgement of a host-side failure — 2026-10-22](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751339#3542818).

### Community experiments and incident reports

8. [Sampling, thinking, time limits, and tool ablations — 2026-10-06](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/746250#3533676).
9. [Kaggle runtime calibration and command-timeout ablations — 2026-10-09](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747857#3536125).
10. [Scoring duration and verification-hang measurements — 2026-10-12](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748443#3537175).
11. [Trace analysis of no-edit tasks and edit deadlines — 2026-10-14](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/749198#3538461).
12. [Server startup exceeding 1,200 seconds — 2026-10-21](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/751264#3541998).
13. [Combined infrastructure, malformed-edit, and shared-budget incident report — 2026-10-22](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747519#3542626).
14. [Practical lessons after a full-run timeout — 2026-10-25](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/752511#3544293).
15. [Detailed array-argument parser freeze report — 2026-10-29](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/753973#3546910).
16. [Continuation nudge, context duplication, and compaction report — 2026-10-31](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754636#3547929).
17. Earlier parser reports: [2026-10-02](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/745138#3535323) and [2026-10-06](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/746336#3533812).

### Harness reference

18. User-supplied `HARNESS_README.md`: §§4–10, especially command/session behavior, budgets, retries, patch recovery, verification, and competitor gotchas.

