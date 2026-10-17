# Module 03: New Level Types, Modes, and Objective Systems

## 1. Multi-Tiered Sub-Objectives (The King 3-Star Architecture)

In the original game, clearing a level was a binary outcome: pass or fail. *Zen Stacker* incorporates King's celebrated **tiered mastery model** (*Candy Crush*), where every stage offers three distinct, escalating challenges that cater to different player personas:

```
                  [ 3-STAR OBJECTIVE HIERARCHY ]
  +-------------------------------------------------------------+
  |  STAR 1: CORE EQUILIBRIUM (Casual Clear)                    |
  |  * Place all shapes and hold balance for 3.0 seconds.       |
  +------------------------------+------------------------------+
                                 |
                                 v
  +-------------------------------------------------------------+
  |  STAR 2: ARCHITECTURAL CONSTRAINT (Tactical Challenge)      |
  |  * "Sky High": Exceed 4.0m altitude boundary line.          |
  |  * "Low Ceiling": Stay underneath 1.8m clearance bar.       |
  |  * "Zen Minimalist": Clear with zero shape rotations.       |
  +------------------------------+------------------------------+
                                 |
                                 v
  +-------------------------------------------------------------+
  |  STAR 3: PURITY / MASTER CONSTRAINT (Hardcore Mastery)      |
  |  * "Flawless Glass": Zero glass stress hairlines.           |
  |  * "Centroid Purity": Final CoM within 2cm of base pivot.   |
  |  * "Swift Mastery": Clear puzzle in under 20.0 seconds.     |
  +-------------------------------------------------------------+
```

### 1.1 Objective Archetypes Catalog

| Objective Identifier | Objective Category | Verification Metric in Unity | Player Experience & Psychological Hook |
| :--- | :--- | :--- | :--- |
| **The Skyward Pagoda** | Height Challenge | `HighestVertex.y >= targetHeightMarker` | Encourages vertical stacking using tall pillars (**SH-04**) and risky wedges. |
| **Low Cave Clearance** | Spatial Constraint | `HighestVertex.y <= ceilingObstacle.y` | Forces horizontal sprawling cantilever construction across water dishes. |
| **The Unrotated Mind** | Input Restriction | `TotalRotationsPerformed == 0` | Tests spatial foresight; player must balance blocks exactly as spawned in tray. |
| **Unbroken Crystalline** | Material Health | `GlassNormalForce < 600N` across all pieces | Demands delicate weight distribution; no heavy blocks atop fragile glass. |
| **The Rapid River** | Speed Blitz | `TotalLevelTime <= 20.0 seconds` | High adrenaline; rewards muscle memory and snappy drag-and-drop actions. |
| **Absolute Symmetry** | Physics Precision | `Mathf.Abs(TotalTowerCoM.x - BasePivot.x) <= 0.02m` | Visual perfectionist satisfaction; tower must be mathematically centered. |

---

## 2. Innovative Game Modes

Beyond the standard campaign, *Zen Stacker* deploys four specialized auxiliary game modes:

### 2.1 Mode 1: Tea Ceremony Precision Mode (Micro-Physics)
* **Scale**: The puzzle arena shrinks to $1:10$ scale.
* **Objects**: Delicate porcelain teacups, bamboo spoons, lacquered tea saucers, and sugar cubes.
* **Platform**: A single floating lotus leaf on a tranquil wooden basin.
* **Gameplay Feel**: Micro-haptics and extreme sensitivity; the slightest off-center placement causes the teacups to clatter and roll into the tea bath!

### 2.2 Mode 2: The Rising Tide (Survival Blitz)
* **Mechanic**: The water level begins rising at a steady rate of $+0.04\text{ meters/second}$.
* **Win Condition**: Construct a tower high enough that the designated **Golden Relic Block** remains above the rising waterline for $45.0\text{ seconds}$.
* **Player Tension**: Pieces that fall beneath the water are destroyed with splash particle bursts, slowly eating away the lower foundation of the tower!

### 2.3 Mode 3: Shrine Illumination (Optic Laser Puzzles)
* **Mechanic**: Combines Prismatic Light Crystals with balance physics.
* **Win Condition**: The player must construct a stable tower that simultaneously refracts a continuous sunbeam across three target mirrors to strike the Sacred Shrine Bell.

### 2.4 Mode 4: Endless Zen Ascent (Ketchapp Infinite High-Score Chase)
* **Mechanic**: The platform rests over an endless misty mountain gorge.
* **Procedural Delivery**: Shapes appear in the bottom dock tray one by one infinitely.
* **Camera System**: The camera smoothly cranes upward as the tower climbs higher into the clouds.
* **Leaderboard Hook**: Global and friend leaderboards rank players by vertical altitude achieved (e.g., "Altitude: $48.2\text{ meters}$").
