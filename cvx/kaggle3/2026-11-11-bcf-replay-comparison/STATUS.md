# BCF Replay Comparison — Status Board

Started: 2026-11-11 · Root: `deliverables/2026-11-11-bcf-replay-comparison/`
Scratch: `scratch/bcf-replay-2026-11-11/` · Logs: `_progress/replay-*.log`

Task: review the other agent's v6 research (input/kagglecomp/2/2026-11-11-bcf-v6),
re-run replay simulations for the same 3 problems against the CURRENT shipped brain,
compare strategies, gap-analyze improvements/regressions.

| # | Workstream | State | Output |
|---|------------|-------|--------|
| 0 | Replay driver (executes real bcf.py machinery) | 🟢 done | 3 tasks executed: 16/10/10 steps, all rc=0, real reference-hunk applies + check PASS, warm cache ~0.22s |
| 1 | Review of v6 research (critique accuracy, stale facts, adoptables) | 🟢 done | 01-review-of-v6-research.md (181 lines; 22 errors logged; v6-3 narrative falsified) |
| 2 | Replay: httpx_3672 (current brain) | 🟢 done | 02-replay-httpx-3672.slides.html (16 slides) + notes; expected-red gap = #1 adoption |
| 3 | Replay: fastapi_14463 (current brain) | 🟢 done | 03-replay-fastapi-14463.slides.html (16 slides) + notes + extras; check-PASS≠correct canary |
| 4 | Replay: fastapi_14482 error-masking (current brain) | 🟢 done | 04-replay-fastapi-14482.slides.html (16 slides, executed quotes verbatim-verified) + scratch/bcf-replay-2026-11-11/notes-fastapi-14482.md |
| 5 | Cross-cutting gap analysis (divergences, improvements/regressions) | 🟢 done | 05-gap-analysis.md: 15-axis divergence matrix, 8 improvements, 11 gaps (G1–G11), 10 ranked adoptables (A1–A10) |
| 6 | Index + QC (tables, HTML structure) | 🟢 done | 00-index.md; 4 md files 0 table defects; 3 HTML decks structurally valid |
