# BCF — Batonic Coding Framework · Gemma 4 Developer Agent Competition

Delivered 2026-11-11. Independent re-derivation from the local dataset (`input/kagglecomp`) plus fresh
discussion-board intelligence (`input/kagglecomp/intel_20261111/`, captured today).

## Deliverables map

| Path | What |
|---|---|
| `01-task1-dataset-classification-rootcause.md` | Task 1: all 129 tasks classified (9 kinds / 40 subcategories / 10 root-cause families) with source-grounded root-cause analyses; distributions, insights, scoring caveats; 0 table defects |
| `02-bcf-brain-31b/submission/` | Task 2 main track: `gemma-4-31b-it-qat-w4a16-ct` — SequentialAgent `bcf_plan → solver` + bcf-spec skill |
| `03-bcf-brain-e4b/submission/` | Task 2 bonus track: `gemma-4-e4b-it-qat-w4a16-ct` — same skill (byte-identical), thinking-off transcribe-and-apply prompts, tighter budgets |
| `04-task2-bcf-design-justification.md` | Why BCF can top main + bonus: evidence-tagged argument, 18-risk register, canary plan, ops plan, 14 evidence appendices |
| `STATUS.md` | Live work board (all workstreams closed) |

Supporting evidence (scratch): `scratch/bcf-2026-11-11/` — per-task RCAs, taxonomy, research notes,
intel syntheses, design proposals, architecture spec, empirical/compliance/E4B review reports.

## The brain in one paragraph

`bcf_plan` (mechanical, never analyzes code) installs a stdlib-only helper into `<repo>/.git/bcf/`
(patch-invisible) and runs it: `bcf.py` classifies the task, ranks candidate files with verified line
anchors, discovers acceptance tests, and emits a ≤300-word brace-free spec — cached by problem hash so
the harness's SequentialAgent nudge-restart bug costs one cheap call. `solver` receives the spec via
`{bcf_spec}` and applies the minimal edit: 31B as advisor (may overrule with evidence), E4B as foreman
(numbered steps, deterministic line-range `apply` editor with auto-rollback, 2-strike circuit breaker,
`py_compile` gate, `check` pre-submit gate). State lives on disk (spec.md, state.json compass), surviving
compaction; every critical tool result is paraphrased into visible text (reasoning-drop hedge).

## Verified metrics (CPU-measured; no GPU score yet)

| Metric | Result | Gate |
|---|---|---|
| Localization hit@3 (129 tasks, partial sources — upper bound) | 96.9% (gold rank-1 when found) | ≥80% |
| Root-cause family top-2 agreement vs taxonomy | 71.3% | ≥70% |
| Kind accuracy | 76.0% | — |
| Anchor uniqueness | 458/477 (96.0%), 0 copy-fidelity violations | ≥90% |
| Cold spec runtime p95 | 0.266 s (3,002-file synthetic repo: 1.06 s) | ≤8 s |
| Warm cache | byte-identical, <0.5 s | <0.5 s |
| Submission validator (both trees) | PASS, 0 errors / 0 warnings | 0 errors |
| Cross-track skill identity | sha256-identical (bcf.py 33629118…, install.py 14a9d916…, SKILL.md c9621270…) | identical |
| Compliance probes | 18/18 + 14/14 hardening-audit probes (incl. empty-stdin apply refusal, auto-rollback, protected paths, new-file awareness, strike→anchors recovery) | all pass |

**Update 2026-11-11 (hardening audit):** the field-issues audit
(`deliverables/2026-11-11-bcf-hardening-research/05-robustness-audit-vs-field-issues.md`) found and
fixed 2 defects in bcf.py — a critical strike→anchors crash (unhashable dict in a set) and an
anchors truncation that could cut inside verbatim edit windows. Both tracks re-mirrored
byte-identical (bcf.py sha256 33629118…, superseding b6ac6a07… cited in 04's appendices),
validators re-passed 0/0, strike-recovery probe re-verified independently.

## Before spending a submission slot (canary gates — details in 04, §6-7)

A *canary* is a small, cheap probe that validates one load-bearing assumption before you spend a
scarce submission slot or GPU hours — cheapest first, never spend a slot on an unvalidated assumption.
Full explanation + the C0–C7 ladder table:
`deliverables/2026-11-11-bcf-hardening-research/05-robustness-audit-vs-field-issues.md` §6.0.

1. **C0** official `compile_submission` on both trees: confirm skill-tool injection + `skills:` path base
   (one-line fallback `skills/bcf-spec` ready if root-relative).
2. **C2** local harness telemetry: per-task setup time, nudge-restart drill (spec byte-identical, ≤15 s),
   `include_contents:none` planner boundary; apply the §8 budget decision rule.
3. **C3** gemma4 parser fuzz on the exact injected schemas (array-arg hang class).
4. **C5** E4B serving canary end-to-end (contested thinking template; intermittent "incorrect format").
5. **C6** replicated local eval on the masked 68-valid set + OOD proxy; win-both selection; hold the E4B
   bonus slot until a non-zero resolve rate is demonstrated.

## Packaging

```bash
python -I scratch/bcf-2026-11-11/validate_submission.py <track>/submission   # must PASS
cd <track>/submission && zip -r ../../submission.zip .                      # root = agent.yaml
```

Deadlines: paper track **Nov 12** (tomorrow), entry/merger **Nov 25**, finals **Dec 2** (bonus deadline
Nov-12/Dec-2 page ambiguity unresolved — working assumption Dec 2, safe internal milestone Nov 12).
Queue defense: submit early, 1/day + 1-pending gate, 36–52 h stalls observed, no reruns promised.
