# WeightLab Test Results

Generated 2026-09-23 17:04 · runtime 4.0.30319.42000 · x64 · 12 logical CPUs

## 1. Scenario matrix — pieces resting on each body (CountAbove)

Expected = ground truth by construction. New = contact-support algorithm. Legacy = port of the current `SpawnManager` algorithm (AABB touching + first-collider top-Y).

| # | Scenario | Body | Expected | New | Legacy | New OK | Legacy OK |
|---|---|---|---|---|---|---|---|
| 1 | S1 Box tower (convex, 1 collider) | A (bottom) | 2 | 2 | 2 | ✅ | ✅ |
| 2 | S1 Box tower (convex, 1 collider) | B | 1 | 1 | 1 | ✅ | ✅ |
| 3 | S1 Box tower (convex, 1 collider) | C (top) | 0 | 0 | 0 | ✅ | ✅ |
| 4 | S1 Box tower (convex, 1 collider) | Platform | 3 | 3 | n/a (platforms ignored) | ✅ | — |
| 5 | S2 Taller neighbour touching the side | A (nothing on it) | 0 | 0 | 1 | ✅ | ❌ |
| 6 | S2 Taller neighbour touching the side | B | 0 | 0 | 0 | ✅ | ✅ |
| 7 | S3 T umbrella (concave overhang, no contact above X) | X (only side contact with stem) | 0 | 0 | 1 | ✅ | ❌ |
| 8 | S3 T umbrella (concave overhang, no contact above X) | T | 0 | 0 | 0 | ✅ | ✅ |
| 9 | S4 Γ arm on pillar + box on arm | Pillar (Γ + D) | 2 | 2 | 2 | ✅ | ✅ |
| 10 | S4 Γ arm on pillar + box on arm | Γ (D) | 1 | 1 | 1 | ✅ | ✅ |
| 11 | S4 Γ arm on pillar + box on arm | D | 0 | 0 | 0 | ✅ | ✅ |
| 12 | S5 ⊥ bridge on two pillars | P1 | 2 | 2 | 2 | ✅ | ✅ |
| 13 | S5 ⊥ bridge on two pillars | P2 | 2 | 2 | 2 | ✅ | ✅ |
| 14 | S5 ⊥ bridge on two pillars | ⊥ | 1 | 1 | 1 | ✅ | ✅ |
| 15 | S5 ⊥ bridge on two pillars | E | 0 | 0 | 0 | ✅ | ✅ |
| 16 | S6 + arms on pillars, box in notch | Left pillar | 2 | 2 | 2 | ✅ | ✅ |
| 17 | S6 + arms on pillars, box in notch | Right pillar | 2 | 2 | 2 | ✅ | ✅ |
| 18 | S6 + arms on pillars, box in notch | + | 1 | 1 | 1 | ✅ | ✅ |
| 19 | S6 + arms on pillars, box in notch | W | 0 | 0 | 0 | ✅ | ✅ |
| 20 | S6b + overhanging a box (gap 0.1) | Q (side contact only) | 0 | 0 | 1 | ✅ | ❌ |
| 21 | S6b + overhanging a box (gap 0.1) | + | 0 | 0 | 0 | ✅ | ✅ |
| 22 | S7 ^ straddling a box (45° support) | B (^ rests on its corners) | 1 | 1 | 1 | ✅ | ✅ |
| 23 | S7 ^ straddling a box (45° support) | ^ | 0 | 0 | 0 | ✅ | ✅ |
| 24 | S7b Big ^ roof over small box (no contact) | Small box | 0 | 0 | 1 | ✅ | ❌ |
| 25 | S7b Big ^ roof over small box (no contact) | Big ^ | 0 | 0 | 0 | ✅ | ✅ |
| 26 | S8 U cup with box against wall | U | 1 | 1 | 1 | ✅ | ✅ |
| 27 | S8 U cup with box against wall | Box | 0 | 0 | 0 | ✅ | ✅ |
| 28 | S9 Diamond (45° box) wedged in a V | Left | 1 | 1 | 1 | ✅ | ✅ |
| 29 | S9 Diamond (45° box) wedged in a V | Right | 1 | 1 | 1 | ✅ | ✅ |
| 30 | S9 Diamond (45° box) wedged in a V | Diamond | 0 | 0 | 0 | ✅ | ✅ |
| 31 | S10 Two-collider convex box, piece on the seam | Base | 2 | 2 | 2 | ✅ | ✅ |
| 32 | S10 Two-collider convex box, piece on the seam | SplitBox | 1 | 1 | 1 | ✅ | ✅ |
| 33 | S10 Two-collider convex box, piece on the seam | Top | 0 | 0 | 0 | ✅ | ✅ |
| 34 | S11 L foot + tall neighbour | L (box on foot) | 1 | 1 | 0 | ✅ | ❌ |
| 35 | S11 L foot + tall neighbour | Box on foot | 0 | 0 | 2 | ✅ | ❌ |
| 36 | S11 L foot + tall neighbour | Tall neighbour | 0 | 0 | 0 | ✅ | ✅ |
| 37 | S12 Rotated L (45°) with a box on it | L @45° (box on it) | 1 | 1 | 1 | ✅ | ✅ |
| 38 | S12 Rotated L (45°) with a box on it | Box | 0 | 0 | 0 | ✅ | ✅ |
| 39 | S12 Rotated L (45°) with a box on it | Platform | 2 | 2 | n/a (platforms ignored) | ✅ | — |
| 40 | S13 X-shape (+ at 45°) with a box in its V | X | 1 | 1 | 1 | ✅ | ✅ |
| 41 | S13 X-shape (+ at 45°) with a box in its V | Box | 0 | 0 | 0 | ✅ | ✅ |
| 42 | S13 X-shape (+ at 45°) with a box in its V | Platform | 2 | 2 | n/a (platforms ignored) | ✅ | — |

Legacy produced the wrong count on **6 of 39** shape rows above; the new algorithm matched every expectation it passed.

## 2. Support classifier (synthetic contact normals, MaxSupportAngle = 60°)

| Normal angle from up | Expected | Got |
|---|---|---|
| 0° | AOnB | AOnB |
| 30° | AOnB | AOnB |
| 59° | AOnB | AOnB |
| 61° | None | None |
| 90° | None | None |
| 119° | None | None |
| 121° | BOnA | BOnA |
| 180° | BOnA | BOnA |

## 3. Cycles (interlocking pieces, noisy contacts)

- 2-cycle and 3-cycle inputs produce a DAG (weakest edge rejected), finite counts, and full mass conservation.
- Self-contacts, unknown ids and hazard (water) contacts are ignored as supporters.

## 4. Rules engine (weight limit, timer fuse, fire contact, de-duplication, display)

- Weight limit, timer fuse (per-shape duration), fire contact (side contact counts), verdict de-duplication and display thresholds all pass (see console log for each case).

## 5. Stack height and grounding

- Height is the top of **all** colliders of grounded pieces (a T measures 3, legacy measured its first collider = 2).
- Held pieces and pieces in the water are excluded from height and support.

## 6. Change tracking (feeds `WeightChanged` events)

- Only bodies whose count changed are reported; an unchanged stack produces zero events.

## 7. Order independence

- 200 random permutations of the body and contact lists of an 18-piece mixed tower gave identical counts and loads.

## 8. Fuzz — 500 random towers (seed 20260923)

Each tower: 1–3 platforms at random heights, water below, 5–30 pieces drawn from {1×1, 1×3, 2×1, L, Γ, T, ⊥, +, ^, U, two-collider box}, each rotated by a random multiple of 45° and dropped at a random x. Each piece also gets a random type (Regular/Weighted/Timer/Fire).

| Metric | Value |
|---|---|
| Bodies analysed | 10437 |
| Contact points | 15437 |
| Support edges accepted | 8680 |
| Edges rejected as cycles | 2 |
| Invariant violations | **0** |
| Analyzer time, all 500 towers (cold analyzer each time) | 18.9 ms |
| Legacy disagreed with the new algorithm | 1455 of 8926 pieces (16.3%) — over-counted 1184, under-counted 271 |

Invariants checked per tower: (a) `CountAbove` equals an independent DFS over the reported support edges; (b) the support graph is acyclic and no body carries itself; (c) mass reaching the platforms never exceeds the grounded mass and matches it exactly when no load path ends in the water; (d) loads are non-negative, `MassAbove > 0` exactly when `CountAbove > 0`, and load ≤ count for unit masses.

## 9. Performance

Pure C# core on .NET Framework 4.8 JIT (x64). The analyzer runs **once per settle event**, not per frame, so these costs are paid a few times per drop, never every frame. Legacy = the lab port of the current algorithm on the same scene (the real Unity version also calls `GetComponents<Collider>()` for every pair, which allocates, so the real cost is higher).

| Scene | Bodies | Contacts | New: µs / analysis | New: bytes allocated / analysis (steady state) | Rules engine µs | Legacy µs / analysis | Legacy bytes / analysis |
|---|---|---|---|---|---|---|---|
| Typical level: 15-piece mixed concave tower | 17 | 22 | 12.1 | 0 | 2.21 | 288.9 | 10224 |
| Pyramid 15 boxes (5 rows) | 17 | 90 | 28.1 | 0 | 3.72 | 178.4 | 14845 |
| Pyramid 66 boxes (11 rows) | 68 | 462 | 242.0 | 0 | 52.83 | 8624.1 | 235649 |
| Pyramid 136 boxes (16 rows) | 138 | 992 | 668.3 | 0 | 240.02 | 62995.3 | 978707 |
| Pyramid 253 boxes (22 rows) | 255 | 1892 | 1684.3 | 0 | 651.48 | 294202.1 | 3381791 |


## Summary

**90 passed, 0 failed.**
