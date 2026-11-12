# BCF Hardening Research — Status Board

Started: 2026-11-11 · Deliverable root: `deliverables/2026-11-11-bcf-hardening-research/`
Scratch: `scratch/bcf-hardening-2026-11-11/` · Logs: `_progress/hardening-*.log`

| # | Workstream | State | Output |
|---|------------|-------|--------|
| R1 | Web: RTX 5090 / CUDA / PyTorch / vLLM / WSL2 | 🟢 done | pins: vLLM 0.19.1/torch 2.10; WSL#40401 VRAM risk; KV fit conditional |
| R2 | Web: Zorin OS 18 / NVIDIA driver / Docker + NCT | 🟢 done | Zorin 18=Ubuntu 24.04; 5090 needs open kernel modules 570+/580; Docker Engine+NCT |
| R3 | Web: Python 3.13 official docs (exceptions/traceback/typing) | 🟢 done | per-family traps, version-verified; corrections register |
| R4 | Web: vLLM serving + tuning official docs | 🟢 done | parity flags; 5090 KV-cache ceiling binding; TP1≠TP4 numerics |
| L2 | Bottleneck inventory (local 5090 + Kaggle 4xL4) | 🟢 done | 02 Part A: 18 tables, top-10 ranking, measurement plan |
| L3 | BCF tuning levers + impact-effort ranking | 🟢 done | 02 Part B: 66 levers; top-10 ranked; 22 do-NOT-tune items |
| L4 | Fast iteration / feedback-loop strategy | 🟢 done | 02 Part C: L0-L4 ladder, ledger, scripts, first-week plan |
| L7 | Robustness audit vs all field issues (+safe fixes) | 🟢 done | 05: 70 rows (36 HANDLED/20 PARTIAL/1 corpus-GAP/13 N-A); 2 bcf.py bugs fixed; independently re-verified |
| L1 | Python traps/gotchas per error family | 🟢 done | 01: 10 family playbooks + version skew + reference card + corrections |
| L6 | Local env parity plan (WSL2 + Zorin 18) | 🟢 done | 03: 994 lines, both tracks, KV/VRAM probes, 14-item verification, divergence register |
| L5 | Local scoring + interpretation + correlation guide | 🟢 done | 04: artifacts, decision tree, correlation caveats, results→actions |
| QA | Table QC, cross-consistency, index | 🟢 done | 0 table defects (all files); 02 merged from 3 drafts; 00-index written; brain README updated (audited hash 33629118…) |

**Side effect on the shipped brain:** the L7 audit fixed 2 bcf.py defects (critical strike→anchors crash; anchors truncation). Both tracks re-mirrored byte-identical, validators PASS 0/0, 32/32 probes, independent strike-recovery probe PASS. See `deliverables/2026-11-11-bcf-gemma4-brain/README.md` update note.
