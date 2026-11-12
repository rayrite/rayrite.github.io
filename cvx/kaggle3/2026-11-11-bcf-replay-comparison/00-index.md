# BCF Replay Comparison — Index

**Date:** 2026-11-11 · **Task:** review the other agent's v6 research (`input/kagglecomp/2/2026-11-11-bcf-v6/`), re-run replay simulations for the same three problems against the CURRENT shipped brain (`deliverables/2026-11-11-bcf-gemma4-brain/`), compare strategies, and gap-analyze improvements/regressions.

**Method:** the current brain's deterministic machinery was **really executed** for all three tasks (36 logged steps, all rc=0 — real reference-hunk `apply`, `check`, strike-recovery, warm-cache re-entry at ~0.22 s). LLM turns are **[MODELED]** from the shipped prompts + RCAs + reference patches, not sampled from Gemma; costs are **[EST]**; **no grader run** — verdicts are predictions from reference-patch equivalence. Every deck carries the same honesty tagging as the v6 package ([EXECUTED]/[MODELED]/[EST]/[R]).

## Deliverables

| File | What |
|---|---|
| [01-review-of-v6-research.md](01-review-of-v6-research.md) | Review of the other agent's package: claim-by-claim audit (22 errors logged), feasibility assessment, staleness vs latest intel, adoptables. Verdict: strong teaching artifact, sound core critique, but not scorer-parity evidence; v6-3's central narrative falsified |
| [02-replay-httpx-3672.slides.html](02-replay-httpx-3672.slides.html) | Replay deck (16 slides): naive vs v6-BCF-v3 vs current brain on the twin-tree connection-lifecycle task. Naive FAIL (revert at stale-test red); current PASS predicted; expected-red gap = #1 adoption |
| [03-replay-fastapi-14463.slides.html](03-replay-fastapi-14463.slides.html) | Replay deck (16 slides): OpenAPI anyOf dedup (aliasing). Full reference patch executed via apply (reference_equivalent=True); sharpest canary: check PASS with missing import (syntax-only gate) |
| [04-replay-fastapi-14482.slides.html](04-replay-fastapi-14482.slides.html) | Replay deck (16 slides): error-masking task (config propagation, two loci ~330 lines apart). Current PASS predicted on primary branch; producer-question prompt gap; dep-gap doctrine applied |
| [05-gap-analysis.md](05-gap-analysis.md) | **Cross-cutting synthesis:** per-task scorecards, 15-axis divergence matrix, 8 improvements + 11 ranked gaps (G1–G11), 10 ranked adoptables (A1–A10) with lever mapping, rejected v6 prescriptions, validation plan |
| [STATUS.md](STATUS.md) | Work board |

## Headline findings

1. **Current brain predicted 3/3 (primary branch) vs naive 0/3** on the replayed trio — with executed machinery, general localization (no fitted router), and structural harness-survival. v6's "BCF v3" claims similar outcomes but its replays are scripted, two decks regress on honesty, and its 14482 narrative is falsified.
2. **The crux gap (G1):** the current brain has **no expected-red predictor/journal/ratchet in code** — revert-avoidance on rename tasks is a prompt sentence. This is the #1 falsification risk and the highest-value adoption from v6 (A1).
3. **Call count binds the cap (G2):** per-site edits on the 7-file httpx task model to ~33 charged calls (>4.5-min cap); v6's scoped batch renames (~14) fit. Adopt closure-bounded batching (A3).
4. **Cheap high-leverage fixes:** producer-question prompt line (A2), classifier vocabulary + honest fallback (A4), evidence shaping (A6), edit-locus anchor priors (A5), semantic smoke gate (A7 — check is syntax-only: it PASSed a patch missing `import copy`).
5. **Reject v6's stale config:** thinking 256–512 contradicts verified corpus evidence (thinking-off halves solves; 2048 sweet spot); pre-register a 1024 A/B arm instead (A8). No graph tools (array-arg run-freeze risk; null benefit p=0.69).

## Reproduce the executed backbone

```bash
python -I scratch/bcf-replay-2026-11-11/replay_driver.py httpx_3672   scratch/bcf-replay-2026-11-11/exec-httpx-3672.json keep_alive reset complete is_keepalive
python -I scratch/bcf-replay-2026-11-11/replay_driver.py fastapi_14463 scratch/bcf-replay-2026-11-11/exec-fastapi-14463.json anyOf responses copy
python -I scratch/bcf-replay-2026-11-11/replay_driver.py fastapi_14482 scratch/bcf-replay-2026-11-11/exec-fastapi-14482.json arbitrary_types_allowed config TypeAdapter
python -I scratch/bcf-replay-2026-11-11/verify_14463_extras.py
```

Exec logs + per-task comparison notes: `scratch/bcf-replay-2026-11-11/` (exec-*.json, notes-*.md, verify-14463-extras.json). Logs: `_progress/replay-*.log`.

## Companion deliverables

- Shipped brain: `deliverables/2026-11-11-bcf-gemma4-brain/` (the implementation replayed here)
- Hardening research: `deliverables/2026-11-11-bcf-hardening-research/` (02b lever ids referenced by the adoptables; 05 canary checklist)
- Setup guide: `deliverables/2026-11-11-bcf-local-harness-setup-guide/` (run the validation plan locally)
