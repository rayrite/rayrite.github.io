# Module 01: New Gameplay Elements and Dynamic Mechanics

## 1. Idle-Physics Generation Engine ("The Perpetual Stream")

In standard puzzle games, physics calculations exist solely inside active levels. Once a puzzle is solved, the physics simulation halts. *Zen Stacker* remixes this paradigm by incorporating an **Arcade-Idle Physics Loop** directly into the player's Zen Sanctuary.

```
       [ PUZZLE GAMEPLAY ]                      [ ZEN SANCTUARY IDLE META ]
  +---------------------------+              +----------------------------------+
  | Clear 3-Star Level        |              | Rebuilt Perpetual Waterwheel     |
  | Earn Blueprint Fragments  | -----------> | Marble Runs & Bamboo Flumes      |
  | Unlock Garden Machines    |              |                                  |
  +---------------------------+              | Physics particles generate:      |
                                             | * +15 Zen Coins / minute         |
                                             | * +2 Harmony Shards / hour       |
                                             | (Accumulates up to 8h offline!)  |
                                             +----------------------------------+
```

### 1.1 The Perpetual Waterwheel Generator
* **Physical Presence**: A beautifully rendered wooden waterwheel sits on the edge of the sanctuary pond.
* **Mechanical Function**: Water drops cascade over physical paddle cups, driving a `HingeJoint` with dynamic angular velocity. Every full rotation of the wheel fires a micro-currency event (`+1 Zen Coin`).
* **Offline Accumulation**: When the app is closed, the system records `DateTime.UtcNow`. Upon re-opening, an offline progression solver calculates accumulated coins based on the wheel's upgrade level and offline duration:
  $$\text{CoinsEarned} = \text{BaseRate} \times \text{LevelMultiplier} \times \min(t_{\text{offline}}, t_{\text{cap}})$$
* **Rewarded Ad Multiplier**: Players can watch a 30s rewarded video to double their accumulated offline yield ("Collect 2x Zen Blessings").

### 1.2 The Zen Sand Raker (Karesansui Automaton)
* **Mechanic**: A brass pendulum automaton swings over a raked gravel sandbed in the garden.
* **Physics Interaction**: The pendulum tip interacts with a dynamic displacement shader on the sand plane, raking concentric ripples. When the pattern completes a full geometric mandala (approx. every 2 hours), a buried **Cosmetic Shard Capsule** is unearthed!

---

## 2. Dynamic Environmental Hazards ("Nature's Trials")

To challenge veterans who have mastered static block balancing, advanced campaign worlds introduce dynamic environmental vectors that interact with PhysX rigidbodies in real time.

### 2.1 Complete Environmental Hazards Matrix

| Hazard Name | Physics Simulation Formula | Visual & Auditory Telegraphed Cue | Strategic Countermeasure |
| :--- | :--- | :--- | :--- |
| **Mountain Wind Gusts** | Lateral aerodynamic drag force: $\vec{F}_w = \vec{D} \cdot [A + \sin(\omega t)] \cdot \text{Area}$ | Wind trails across screen; cherry blossom petals blow horizontally; wind chime audio intensifies. | Build low, wide, aerodynamic pyramid structures; avoid thin vertical pillars (**SH-04**). |
| **Seismic Earth Tremors** | Periodic base vibration: $Y_{\text{offset}} = A_s \sin(2\pi f_s t)$ | Screen rumbling; camera shake ($1.5\text{ px}$); water surface ripples radiate violently. | Interlock shapes using L-shapes and crosses (**SH-09**, **SH-11**) to prevent sliding. |
| **Glacial Rain & Sleet** | Surface friction modifier: $\mu_s \to 0.20, \mu_k \to 0.10$ | Rain streaks on camera lens; wet specular sheen on wooden block shaders; splashing droplets. | Anchor blocks into concave cups (Arched Bridge **SH-13**) or wedged V-grooves. |
| **Thermal Geyser Vents** | Intermittent vertical upward thrust: $\vec{F}_g = \vec{U} \cdot 800\text{ N}$ | Bubbling water around platform base; steam hiss audio telegraphed for $2.0\text{s}$ before burst. | Position heavy Kurogane Iron anchors (**SH-Iron**) directly over vent nozzles. |

---

## 3. Harmonic Centroid Combos (The Ketchapp "Stack" Effect)

In Ketchapp's hit *Stack*, perfect alignment rewards players with an ascending musical scale and vibrant visual feedback. *Zen Stacker* adapts this sensation to physics-based balance.

```
       [ CENTROID COMBO ALIGNMENT ]
         +-----------------+
         |   NEW BLOCK     |
         |        X        | <--- Center of Mass (CoM)
         +--------|--------+
                  |  <= 5 mm deviation (PERFECT SNAP!)
         +--------|--------+
         |     SUPPORT     |
         |        X        | <--- Base CoM
         +-----------------+
```

### 3.1 The Harmonic Scale Progression
When a player drops a shape such that its vertical Center of Mass falls within **$5\text{ mm}$ ($0.005\text{ m}$)** of the underlying support's center of mass, a **Harmonic Snap** is registered:

| Combo Step | Musical Note (Pentatonic Scale) | Audio Instrument | Particle & Visual Feedback | Gameplay Bonus |
| :--- | :--- | :--- | :--- | :--- |
| **Combo 1** | $C_4$ ($261.63\text{ Hz}$) | Japanese Koto Pluck | Soft white circle ripple at contact point. | $+10\%$ Level Coins |
| **Combo 2** | $D_4$ ($293.66\text{ Hz}$) | Resonant Koto Chord | Green lotus ring radiates through water. | $+25\%$ Level Coins |
| **Combo 3** | $E_4$ ($329.63\text{ Hz}$) | Silver Chime Strike | Golden sparklers burst from contact edge. | $+50\%$ Level Coins |
| **Combo 4** | $G_4$ ($392.00\text{ Hz}$) | Shakuhachi Flute Flourish | Water ripples turn iridescent gold. | $+100\%$ Level Coins |
| **Combo 5+**| $A_4$ ($440.00\text{ Hz}$) | Tibetan Singing Bowl Gong | Screen-wide golden bloom flash. | **Aura of Stillness** activated! |

### 3.2 The "Aura of Stillness" Reward
Achieving a 5-combo streak triggers the **Aura of Stillness**:
* A serene blue glowing ring encompasses the balance dish.
* Angular drag on all resting rigidbodies is boosted by $+500\%$ for $4.0\text{ seconds}$, dampening micro-wobbles and allowing the player to place their next precarious piece onto a rock-solid foundation.
