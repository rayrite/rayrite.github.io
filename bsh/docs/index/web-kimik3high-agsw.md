# Art of Balance — Unity 6.6 Implementation Plan
### A from-scratch recreation of Shin'en Multimedia's WiiWare physics puzzler, with deep dives into the Wii U, PS4 and Switch ports

---

## 1. Executive Summary

**Art of Balance** (Shin'en Multimedia, WiiWare, 2010) is a physics puzzle game in which the player stacks a fixed set of wooden, stone and glass shapes onto one or more plinths standing in a bowl of water. The tower must remain standing for a short countdown without any piece touching the water. Its enduring appeal comes from four pillars:

1. **A beautifully legible toy-box physics core** — every failure is the player's fault, visible in slow motion as the tower tips.
2. **A serene, premium presentation** — a softly rippling pool of water, warm lounge environments, glass and wood materials catching the light, and a laid-back soundtrack.
3. **A frictionless retry loop** — fail, instantly restart, try "just one more time."
4. **Escalating mechanical variety** — fragile glass, timed bombs, double plinths, weighing scales, gravity flips, and special "challenge" levels.

This document is a complete build plan for a faithful recreation in **Unity 6** (URP, PhysX), covering:

- **Part I** — analysis of the original game (visuals + main gameplay loop)
- **Part II** — full technical implementation of the core game in Unity
- **Part III** — deep dives into the additional modes introduced by the Wii U (2013), PS4 (2016) and Switch (2018) ports — Endurance, Infinity, Tower Tumble, Swift Stacker, online play, touch/gyro controls — and concrete implementation guidance for each
- **Part IV** — production roadmap, risks, and legal notes

> **Note on naming:** the Wii U and PS4/Switch releases are all titled simply "Art of Balance" but contain substantially more content than the WiiWare original (200 levels across 8 worlds vs. 100 levels across 4 worlds). The 3DS version is titled *Art of Balance TOUCH!* and is the source of the expanded level set used by all later ports.

---

# PART I — Reference Analysis: The Original WiiWare Game

## 2. What the Original Game Actually Is

### 2.1 Core fantasy and loop
The player is presented with a glass bowl of water. In the middle stands a plinth (pedestal) of varying shape. A queue of shapes (blocks) is given — sometimes all visible at once, sometimes revealed only as earlier ones are placed. The player grabs each shape with a cursor, rotates it in 45° steps, and places it on the tower. The rules:

- **Every given shape must be placed.** You cannot skip or discard pieces.
- **No shape may touch the water.** One splash = instant fail.
- **Once the last shape is placed, a ~3-second countdown starts.** If the stack survives it, the level is won. (Later ports shortened this countdown.)
- **No take-backs.** A placed shape cannot be moved; a mistake means restarting the level — which is why instant retry is a core feature, not a convenience.

### 2.2 Content structure (WiiWare original)
| Element | Detail |
|---|---|
| Worlds | 4 (A, B, C, D), each with a distinct lounge environment + music |
| Levels | 25 per world = 100 total |
| Progression | Levels award "circles" (1 per normal level, extra for challenge levels, 3 for world finals). Unlock World B at 20 circles, C at 40, D at 60 |
| Co-op | A second player can drop in and control a second cursor in Arcade |
| Versus | 2 players, same screen, race to solve identical randomly drawn levels; best of 5/7/9 rounds |

### 2.3 The shape vocabulary
The puzzle design is built from a small set of shape/material modifiers that combine freely:

- **Basic solids** — bars, cubes, L/T-shapes, wedges, arches; different densities implied by material (wood light, stone heavy).
- **Fragile (glass) shapes** — shatter when too much weight rests on them, removing support from everything above.
- **Timed/self-destructing shapes** — explode or vanish after a fuse, so everything supported by them must be re-supported elsewhere.
- **Structural twists** — double plinths (bridge a gap between two pedestals), weighing-scale plinths (platforms that sink under load and rise when the other side is loaded).
- **Later ports added** gravity-reversing shapes that flip the stack upside down (see Part III).

### 2.4 Special / "challenge" levels
Interleaved into each world (and visually flagged, e.g. orange-tinted) are variations on the base ruleset: **time-attack** solves, **swaying platform** levels (the plinth rocks on the water), and **tower height** challenges. These award bonus circles and pace the difficulty curve.

### 2.5 Visual identity — what makes it look like *Art of Balance*
This is the single most important section for the "recreate the visuals" requirement. The look decomposes into:

1. **The water bowl as stage.** The entire game happens in a fish-tank-like bowl: a calm, gently rippling water surface with refraction, a visible waterline, splashes with particles and rings when something falls in, and slow caustic light patterns on the bowl floor.
2. **Warm, low-saturation lounge environments.** Each world is a different softly lit scene (sunset terrace, aquarium tones, spa-like minimalism) visible *behind* the bowl, heavily blurred (depth of field) so the bowl reads as a diorama.
3. **Material contrast as information.** Wood = warm matte, stone = cool grey heavy, glass = transparent refractive. You can read the physics from the materials alone.
4. **Slow, cinematic camera.** Gentle orbiting drift, slow push-ins on success, subtle handheld sway. Never snappy.
5. **Soft global illumination look** — the 2010 original faked this with baked ambient and careful light placement; in Unity 6 we get it nearly free with baked lightmaps/probes or APV.
6. **Minimal, elegant UI** — thin serif/light typography, soft white on translucent panels, circle motifs for progression, no aggressive colors.

### 2.6 Audio identity
Lounge/chillout soundtrack per world, gentle water ambience, soft "knock" sounds on placement pitch-shifted by impact force, a glass shatter, a muffled underwater *bloop* for failures, and a warm chime on level clear. The audio is 50% of the "zen" feel — budget for it accordingly.

---

# PART II — Core Implementation in Unity 6

## 3. Project Setup & Technical Foundations

### 3.1 Project configuration
- **Unity 6 (6000.x LTS)**, **Universal Render Pipeline (URP)** — the game is a single-camera, small-scene title; URP gives us water refraction, DoF and bloom cheaply on every target (PC, console, mobile).
- **Physics: built-in PhysX** (`Physics`, not DOTS Physics). The original is a classic rigidbody stacking game; PhysX is the right tool. Key Project Settings:
  - `Fixed Timestep: 1/60` (0.0167s) — stacking stability demands it.
  - `Default Solver Iterations: 12–16`, `Solver Velocity Iterations: 4–8` (higher than default 6/1; tall stacks need solver accuracy to avoid jitter and "jelly towers").
  - Enable **Adaptive Force** off; enable **Enhanced Determinism** only if you plan replay-verified leaderboards.
  - `Sleep Threshold` raised slightly (~0.01–0.02) so settled towers go to sleep and stay rock solid — this is how the original keeps 20-piece towers stable.
  - Broadphase: default is fine (scenes are tiny).
- **Input: Unity Input System** with an abstracted `IPlacementController` (see §5.4) so Pointer/Gamepad/Touch/Gyro are pluggable — required later for the port features.
- **Camera: Cinemachine 3.x** for the slow orbital drift and success push-ins.
- **Audio:** standard AudioSources + a small pooling system; snapshot mixer for underwater muffle.
- **Save:** JSON save file (circles, unlocked worlds, awards, settings) with atomic write; abstract behind `ISaveService` so consoles can swap in platform storage.

### 3.2 Determinism & fairness note
PhysX is not deterministic across machines. For **single player this doesn't matter**. For **online competitive modes (Swift Stacker)** never simulate both players in one shared simulation — run independent local simulations and only sync *events* (level seed, completion time, fail). See §10.

### 3.3 Suggested folder / assembly structure
```
Assets/
  Art/ (Environments, Shapes, VFX, UI)
  Audio/ (Music, SFX, Mixers)
  Data/ (LevelAssets, ShapeLibrary, WorldDefinitions)
  Scripts/
    Core/        (GameLoop, LevelManager, SaveService, SceneFlow)
    Physics/     (StackValidator, ShapeBehaviour, WaterKillVolume)
    Placement/   (Cursor, PlacementController(s), RotationStepper)
    Rendering/   (WaterSurface, Caustics, CameraDirector)
    Modes/       (Arcade, Endurance, Infinity, TowerTumble, SwiftStacker)
    UI/          (HUD, Menus, WorldMap)
    Net/         (Session, Relay sync, Leaderboards)
  Settings/ (URP assets, Quality tiers, Input actions)
```
Use **Assembly Definitions** per folder so `Modes` and `Net` depend on `Core`, never vice versa — this keeps every port-specific mode a pure plugin over the same core loop.

## 4. The Shape System

### 4.1 Data model
```csharp
[CreateAssetMenu(menuName = "AoB/Shape Definition")]
public class ShapeDefinition : ScriptableObject {
    public string id;
    public GameObject prefab;            // contains Mesh + colliders + ShapeBehaviour
    public ShapeMaterial material;       // Wood, Stone, Glass...
    public float mass;                   // drives PhysX + audio pitch
    public ShapeModifier modifiers;      // flags: Fragile, Timed, GravityFlip...
    public float breakLoadKg;            // Fragile only
    public float fuseSeconds;            // Timed only
}
```
Every shape prefab uses **convex MeshColliders or primitive compound colliders** — never concave mesh colliders on dynamic bodies. For arches/L-shapes, compose 2–4 convex children. Keep collider bevels slightly rounded (PhysX contact offsets ~0.005 m) — sharp corners cause the micro-jitter that kills tall stacks.

**Scale reference:** build at real-world scale, plinth ≈ 0.3 m wide, bowl ≈ 1.2 m diameter. PhysX is happiest between 0.1–10 m.

### 4.2 Shape behaviour components
- `ShapeBehaviour` — base: placed state, impact events (drives audio/VFX), sleep monitoring.
- `FragileBehaviour` — accumulates impulse/ sustained load from contacts above; when the running total of supported mass × time exceeds `breakLoadKg`, play shatter VFX, spawn fragments, and **swap itself for a broken, non-load-bearing remnant** (or despawn). Implementation: sum `contact.impulse.magnitude` in `OnCollisionStay`, weighted by normal alignment.
- `TimedBehaviour` — visible fuse countdown ring; on expiry → small explosion force + despawn. Everything above must topple naturally; do not freeze anything.
- `GravityFlipBehaviour` (port content, see Part III) — on placement, after a beat, flips world gravity for shapes only (`Physics.gravity` per-object via constant force, or a dedicated rigidbody gravity override), effectively hanging the stack upside-down from a ceiling plinth.

### 4.3 The "locked-in" rule
The original never lets you move a placed piece. Enforce it structurally: on placement the shape leaves the cursor system entirely and becomes a pure simulation object with `isKinematic = false`. There is literally no code path that re-attaches it. This one decision preserves the game's tension and massively simplifies netcode later.

## 5. Placement & Controls

### 5.1 The ghost cursor
The held shape is **kinematic**, rendered as a slightly translucent "ghost" with a validity tint (soft white = ok, red pulse = invalid). It moves on a plane facing the camera at the tower's depth, with:
- **Rotation in 45° steps** (the Wii original's constraint — keep it; it is a core part of the puzzle design, making orientations a finite, readable decision space) around the vertical axis and, for some shapes, flip.
- **Collision preview:** use `Physics.ComputePenetration` / overlap checks against placed pieces; the ghost may overlap visually but blocks *release* when invalid.
- **Release = commit:** on confirm, spawn/enable the dynamic body with zero velocity at the ghost transform.

### 5.2 Controls matrix (ship all three from day one)
| Scheme | Implementation |
|---|---|
| Mouse/Pointer | Cursor follows pointer; LMB place; RMB/wheel rotate 45° |
| Gamepad | Left stick = cursor with acceleration curve + aim assist magnetism toward valid contact points; A place; bumpers rotate |
| Touch | Drag shape from tray; two-finger twist rotate; release to drop (needed for Switch-port parity, §9) |

Add subtle **snap assistance**: within ~2–3 cm and ~5° of a stable resting pose (coplanar face contact), ease the ghost toward the mathematically flat pose. The original feels "tight" because of exactly this invisible magnetism — without it, PhysX placements feel mushy.

### 5.3 Camera
One Cinemachine rig: slow orbital drift (±10° over ~30 s), auto-framing that zooms out as the tower grows (fit tower bounds + water plane), a gentle push-in on countdown, and a slow dolly-in + DoF rack on victory. Keep max angular velocity tiny; serenity is the brief.

## 6. Win/Lose Detection — the Heart of the Loop

```
Level flow:
  LOAD → INTRO CAMERA → PLACING (loop) → COUNTDOWN (3s) → WIN
                        ↘ piece touches water → SPLASH → FAIL → instant retry prompt
```

- **Fail detection:** a `WaterKillVolume` trigger at the water surface. Any `ShapeBehaviour` entering it = fail. (Also fail on countdown timer for time-attack variants.)
- **Win detection:** when the shape queue is empty, start a 3 s `StabilityCountdown`. Cancel and return to PLACING if any piece enters the water during it. Optionally require total kinetic energy below a threshold for the final 0.5 s so a tower that is *about* to fall still fails fairly.
- **Instant retry:** keep the level's initial state as plain data (list of shape IDs + plinth config). Retry = wipe dynamic shapes, respawn from data. Target **< 300 ms** from fail to playable. Do not reload the scene at runtime — reset it. This is the "one more go" engine.

## 7. Water & Bowl Rendering (URP)

The bowl is the game's signature. Build it as a stack of cheap effects:

1. **Water surface mesh** — a disc with a low-frequency Gerstner-wave vertex shader (2–3 waves, amplitude in millimeters). Calm, not oceanic.
2. **Refraction** — sample the URP opaque texture with normal-distorted UVs in the water shader; add slight chromatic offset for a glassy feel.
3. **The bowl glass** — double-sided transparent material with fresnel rim, refraction, and a faint specular streak. Render after water.
4. **Splash system** — on `WaterKillVolume` entry: radial mesh ripple (vertex wave propagating outward), particle burst, expanding foam ring decal, and a camera-appropriate *bloop*. Since every fail shows this, it must look great — it is the game's "game over" screen.
5. **Caustics** — animated caustics texture projected (or light cookie) onto the bowl floor and plinth, intensity modulated by recent splashes.
6. **Submerged pieces** — pieces resting under water get a tint + fog via a depth-check in their shader; let them stay visible — seeing your failure sink is part of the charm.

## 8. Environments, Lighting, Post

- **8 world environments** (ports standard; the Wii original had 4 — build the pipeline for N). Each is a simple backdrop diorama behind the bowl: a few props, a skybox, a distinct color script (sunset amber, aqua teal, violet dusk, candle-lit warm...). Heavy **depth of field** (bokeh, f/1.8 look) so backgrounds stay abstract.
- **Lighting:** one key directional + 1–2 fill point lights + baked ambient via **Adaptive Probe Volumes** or simple light probes; soft shadows (PCF, short distance). Bake per world; the bowl pieces are dynamic so they rely on probes — this is exactly the APV use case.
- **Post stack (URP Volume):** Bloom (gentle, threshold ~1.1), DoF, Tonemapping (ACES), subtle Vignette, Film Grain ~5%. White balance per world for the color script.
- **UI art direction:** thin sans/serif, off-white on 20% black panels, thin circle iconography for progression currency, generous letterspacing. No saturated accent colors; one warm gold for highlights.

## 9. Level Data & Content Pipeline

```csharp
[CreateAssetMenu(menuName = "AoB/Level")]
public class LevelDefinition : ScriptableObject {
    public WorldId world;
    public PlinthSetup plinths;          // 1–2 plinths, scale-platform flags, sway params
    public ShapeEntry[] shapeQueue;      // id + reveal index (reveal-as-you-go support)
    public LevelVariant variant;         // Standard, TimeAttack, Sway, TowerHeight
    public float timeLimit;              // TimeAttack
    public int circleReward;             // 1 / 2 / 3
}
```
- **Reveal-as-you-go:** `shapeQueue[i].revealIndex` gates which queue slots are visible — the original only shows some pieces up front, which is a major strategic lever. Build it into the data model from day one.
- **Weighing-scale plinths:** kinematic platform on a `ConfigurableJoint` (or scripted spring) with downward travel proportional to supported mass; two scales side by side create the classic "seesaw towers" levels.
- **Swaying platform:** sinusoidal torque on the plinth rigidbody with randomized phase; amplitude ramps over the level.
- **Authoring tool:** a small custom editor window to place plinths, queue shapes, and playtest the level in-editor with one click. You will author 100–200 levels; the tool pays for itself in week one.
- **Difficulty curve strategy:** mirror the original — first level of each world introduces the new mechanic as a guided tutorial (but make tutorials skippable on retry; the unskippable voiced tutorial was the original's most-criticized flaw).

---

# PART III — Deep Dives: The Ports' Additional Modes & Their Implementation

The later versions expanded the game from "100 arcade levels + versus" into a five-mode package. This section analyzes each addition and shows exactly how to build it on the Part II foundation. Because every mode is a thin ruleset over the same core systems (shape queue, placement, kill volume, stability check), each one below maps to a `GameModeBase` subclass.

```csharp
public abstract class GameModeBase : MonoBehaviour {
    public abstract void OnLevelLoaded(LevelDefinition level);
    public abstract void OnShapePlaced(ShapeBehaviour shape);
    public abstract void OnSplash(ShapeBehaviour shape);
    public abstract void OnStackStabilized();
    public abstract bool IsComplete(out ModeResult result);
}
```

## 10. Wii U Version (2013) — Deep Dive

**What it added over WiiWare:** the 3DS's 200-level / 8-world set, drop-in co-op for up to **five** players, **Endurance mode**, the renamed competitive mode **Swift Stacker** (local + online, including mixed local/online teams of two), and the brand-new **Tower Tumble**. Platform features: Off-TV Play on the GamePad, touch placement via GamePad screen, Miiverse integration (obsolete), and Wii Remote pointer support alongside traditional controls.

### 10.1 Endurance Mode
**Design:** play arcade levels back-to-back in one session; you have only **3 total retries** for the whole run; score accumulates per level; ends when retries are exhausted. Built for leaderboard bragging.

**Implementation:**
- `EnduranceMode : GameModeBase` holds `int retriesLeft = 3`, `int levelsCleared`, `float totalTime`, and a seeded `LevelSequenceGenerator`.
- Sequence generator: ordered world-by-world shuffle (easiest first) with a seed, so daily/weekly leaderboard seeds are possible — strongly recommended for your clone.
- On `OnSplash`: consume a retry, reset level (do NOT advance). On retries exhausted → submit score (levels cleared, then total time as tiebreak).
- UX: between levels, a 2-second "next level" card, never a menu — momentum is the mode's point.
- Effort: **small** (2–3 days). Pure session-state machine over existing systems.

### 10.2 Five-player drop-in co-op
**Design:** extra players grab a controller and join mid-level; each gets their own cursor; anyone can place the next shape.

**Implementation:**
- Your `IPlacementController` abstraction pays off: spawn one cursor per active player, each with a distinct tint.
- Queue ownership: the next shape is "first come, first served" — whichever cursor grabs it, others see it as held. Add a 0.5 s "steal" cooldown to prevent griefing.
- Drop-in: listen for unpaired device input (Input System's `PlayerInputManager` with join-on-any-button handles this nearly out of the box).
- Camera: shared single camera (co-op is same-screen); auto-framing already handles growth.
- Effort: **medium** (1–2 weeks, mostly UX polish and input pairing).

### 10.3 Swift Stacker (competitive puzzle race)
**Design:** head-to-head (or 2v2 teams) race to solve the *same* puzzle first. Best-of-N rounds; levels drawn at random from a chosen world. On Wii U: local split-screen, online, and mixed.

**Implementation (local):**
- Split screen: two cameras, two bowls, two fully independent simulations. This is the crucial architectural point — **each player simulates their own stack in their own physics scene**. Use Unity's **multi-scene physics** (`PhysicsScene` via `SceneManager.CreateScene` with `LocalPhysicsMode.Physics3D`) so the two simulations never interact and each can be reset independently.
- Shared round controller deals the same `LevelDefinition` to both sides, starts synchronized countdown, first `WIN` takes the round. Loser's side freezes with a subtle slow-mo of their tower falling (great drama, nearly free).
- Effort: **medium** (1 week local).

**Implementation (online):** see §12 — the same event-sync model covers it.

### 10.4 Tower Tumble (the Wii U's signature new mode)
**Design:** "reverse Jenga." Players take turns placing a shape onto a shared, ever-growing tower. Whoever makes the tower collapse loses; all *opponents* score a point. Local-only, up to 4 players. First to N points wins.

**Why it's smart:** it reuses 100% of the core physics and placement code but inverts the goal — you now *want* future placements to be hard for the next player, creating delicious passive aggression.

**Implementation:**
- `TowerTumbleMode : GameModeBase` with a turn queue (players in fixed rotation), shared tower, and a collapse detector.
- **Collapse detection:** a fall is "your fault" if a structural failure occurs within `X` seconds (e.g., 4 s) of your placement — the original attributes collapse to the most recent placer within a grace window. Implement as: after each placement, start a 4 s attribution timer; any `OnSplash` or tower-integrity event (top N pieces displaced > threshold) during the window = current player faults. If the window expires stable, attribution transfers to the next placer.
- Give the current player a shape drawn from a shared random bag (seeded for fairness in rematches).
- Points: on fault, everyone else +1. Round ends, tower resets, play to 5/7/10.
- Effort: **medium** (1 week) — the attribution window is the only novel logic.

### 10.5 Wii U platform features → your Unity equivalents
| Wii U feature | Unity 6 equivalent |
|---|---|
| GamePad Off-TV play | Not applicable on modern targets; skip (or Steam Deck Remote Play — free) |
| Touchscreen placement | Your touch `IPlacementController` — drag shapes directly on screen, pinch-rotate |
| Wii Remote pointer | Gyro/pointer scheme (see Switch §11.2) |
| Miiverse stamps | Replace with a shareable screenshot button (Unity `ScreenCapture` + native share sheet) |

## 11. PS4 Version (2016) & Switch Version (2018) — Deep Dive

The PS4 release consolidated the five-mode package (**Arcade, Endurance, Infinity, Tower Tumble, Swift Stacker**) and added **online leaderboards**, **trophies**, and full gamepad-centric UX. The Switch release is the same package plus **touch controls in handheld**, **gyro motion aiming** (post-launch patch), **local wireless multi-console play**, and HD Rumble. New puzzle mechanics visible in this era include **gravity-flipping shapes** that turn the stack upside down.

### 11.1 Infinity Mode
**Design:** endless stream of shapes; build the highest tower you can; one collapse ends the run. Height is the score. Pure flow-state content and the best "just one more" engine in the package.

**Implementation:**
- `InfinityMode : GameModeBase` with an infinite `ShapeBag` — weighted random draws from the shape library, difficulty-scaled (heavier/awkward shapes and modifiers become more frequent as height increases).
- **Height metric:** max Y of any resting shape above the plinth base, sampled when the stack is stable (kinetic energy below threshold); display live.
- **Endless stability concerns:** tall stacks stress the PhysX solver. Mitigations: cap simultaneous awake bodies (force-sleep the bottom two-thirds of the tower once stable — the player's recent pieces are what matter), keep solver iterations high, and consider fusing settled lower sections into combined static colliders beyond ~30 pieces. The original clearly does something similar — this is the one mode where naive physics will betray you.
- Camera: your auto-framing rig already zooms out; add a subtle rising ambient (music layer) as height milestones pass.
- Leaderboard: personal best + online global (see §12.3).
- Effort: **medium** (1 week + polish).

### 11.2 Control schemes added by the ports
- **Touch (Switch handheld / mobile):** direct-manipulation placement — drag the shape itself, not a cursor; twist to rotate 45°; lift to drop. Feels dramatically more tactile; implement as a first-class `IPlacementController`, not an afterthought.
- **Gyro aiming (Switch patch):** pointer-style cursor driven by controller angular velocity, with recenter button and auto-drift correction. In Unity: Input System gyroscope sensor (`UnityEngine.InputSystem.Gyroscope`) with a complementary filter; map to cursor velocity, clamp gain. On PC, DualSense/DualShock gyros via Steam Input or SDL give you the same scheme for playtesting.
- **HD Rumble → haptics:** map impact impulse magnitude to rumble amplitude/duration (`Gamepad.SetMotorSpeeds` / DualSense haptics). Placement *thock* + tiny pulse is a big part of the tactile identity.

### 11.3 Platform meta features
- **Trophies/Achievements ("Awards"):** the ports ship an awards list (clear worlds, win without retry, reach Infinity heights, win Swift Stacker matches...). Implement an `AwardService` with ScriptableObject award definitions evaluated against gameplay events; map to platform APIs at ship time.
- **Online leaderboards:** Endurance and Infinity are the ranked modes. Abstract behind `ILeaderboardService` (see §12.3).
- **Local wireless (Switch multi-console):** architecturally identical to online Swift Stacker with a LAN transport — if you build online via a transport-agnostic session layer, LAN comes free.

## 12. Online Multiplayer & Leaderboards (Your Implementation)

### 12.1 Architecture decision (important)
Do **not** sync rigidbody state across the network. Physics stacking over the internet is a latency nightmare and PhysX isn't cross-machine deterministic. The ports' design already shows the correct pattern: **every client simulates its own bowl; only events and results travel the wire.**

For Swift Stacker online:
- Lobby/relay: Unity **Lobby + Relay** (Unity Gaming Services) with **Netcode for GameObjects** in a thin event-only role, or Mirror if you prefer open source.
- Wire protocol per round: `{levelSeed/levelId, roundStartTime}` → each side plays locally → `{result: win/fail, solveTimeMs}` → authoritative-ish host validates plausibility (solve time ≥ human minimum, no teleported wins) and scores the round.
- Opponent presence: show a ghost progress bar (pieces placed / total) and their solve events, not their live tower — cheap, robust, and still tense. Optional flourish: transmit placement *events* (shape id + transform, 2–4 Hz snapshot for their newest piece) to animate a low-fidelity "shadow tower" on the opponent's side. Purely cosmetic; never affect local sim.

### 12.2 2v2 mixed teams (the Wii U's mixed local/online trick)
Each "seat" in a match is a team slot; a seat can be satisfied by 1–2 local players sharing one simulation (co-op cursors, already built in §10.2). The session layer only knows about seats, not humans. This cleanly reproduces the Wii U's "local pair + online pair" matches.

### 12.3 Leaderboards
`ILeaderboardService { Submit(board, score, meta); Fetch(board, around|top|friends); }` — implementations: platform-native (Steam, PSN, Xbox, Switch) at port time; for PC-first development use a simple self-hosted board or LootLocker/PlayFab. Design decision: **seeded Endurance boards** (weekly seed) make runs comparable and cheat-resistant-ish.

## 13. Progression, Meta & Session Flow (Full Package)

```
Title (water pool backdrop, logo bobbing) 
 → Mode Select: Arcade | Endurance | Infinity | Tower Tumble | Swift Stacker
     Arcade → World Map (8 worlds, circle-gated: unlock at 20/40/60... circles)
              → Level Grid (25/world, circles earned shown per level)
                 → Level → Results (circles, time, retry count) → next
     Endurance → run → leaderboard submit
     Infinity → run → leaderboard submit
     Tower Tumble → local lobby (2–4) → match
     Swift Stacker → lobby (local split / online / mixed) → best-of-N match
```
- **Circle economy:** normal level = 1, challenge = 2, world finale = 3 (mirrors the original's ~30/world).
- **Awards list** (PS4-style): 15–25 achievements; display in a gallery with circle motif.
- **Skippable tutorials** on retry; first-visit-only guidance.
- **Settings:** music/SFX sliders, camera drift on/off, colorblind-safe validity tint, gyro sensitivity.

---

# PART IV — Production Plan

## 14. Milestone Roadmap (~7 months solo / ~4–5 months small team)

| Phase | Duration | Deliverable |
|---|---|---|
| **0. Foundations** | 2 wks | Unity 6 URP project, physics tuning bed (stack of 20 pieces, stable), shape data model, save service |
| **1. Core loop vertical slice** | 4 wks | One world environment, water bowl v1, cursor + gamepad + mouse placement, 10 authored levels, win/fail/instant-retry, placeholder audio |
| **2. Visual target** | 3 wks | Water/bowl/caustics/splash final-quality, lighting + post per world, Cinemachine director, UI art direction locked |
| **3. Content complete (WiiWare parity)** | 4 wks | 4 worlds × 25 levels, full shape modifier set, challenge variants, circle progression, arcade co-op |
| **4. Port modes wave 1** | 3 wks | Endurance, Infinity, Tower Tumble (all local), 5-player drop-in co-op |
| **5. Port modes wave 2 (online)** | 4 wks | Swift Stacker local split-screen (multi-physics-scene), then online via Lobby/Relay/Netcode, leaderboards, awards |
| **6. Controls & polish** | 3 wks | Touch + gyro schemes, haptics, 8-world content expansion to 200 levels, audio final, difficulty pass |
| **7. Certification prep / release** | 2 wks | Performance sweep, platform storage/achievements, store assets |

**Critical path:** physics stability tuning (Phase 0–1) → water look (Phase 2) → online event-sync (Phase 5). Everything else parallelizes.

## 15. Testing Strategy
- **Physics soak tests:** scripted random placement bots running thousands of solves per level overnight; flag any level with >1% "physically correct but topples" outcomes — physics-puzzle fairness bugs destroy trust.
- **Golden replays:** record placement sequences for every level; CI replays them after any physics/setting change to catch stability regressions.
- **Determinism guard for leaderboards:** hash level definitions + version; reject submissions from mismatched builds.
- **Playtest focus:** placement magnetism tuning and rotation discoverability — the two make-or-break feel items.

## 16. Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Tall-stack PhysX instability (Infinity mode) | Sleep management, settled-section fusion, solver tuning (§11.1) |
| "Unfair" physics failures | Soak tests, rounded colliders, placement snap assist, generous validity preview |
| Online physics sync temptation | Event-only netcode (§12.1) — non-negotiable architecture rule |
| Water look under-delivering | It's the signature — schedule Phase 2 early with real iteration budget |
| Content authoring bottleneck (200 levels) | Custom level editor in week 1; bot-assisted solvability verification |
| Scope creep from 5 modes | Ship WiiWare parity first (Phases 0–3); every port mode is an isolated `GameModeBase` plugin — cut without surgery |

## 17. Legal / IP Note
*Art of Balance*, its name, logo, level designs, music, and audiovisual assets are the property of **Shin'en Multimedia**. This plan describes building a mechanically inspired game ("physics stacking in a bowl of water"), which as a genre/mechanic is generally not protectable, but you **must not** copy the name, exact level layouts, art, audio, or UI designs, and you should ship original environments, shapes, and soundtrack. Treat this document as a study of design patterns, not a license to clone assets. If in doubt, consult an IP attorney before commercial release.

---

## Appendix A — Core System Checklist
- [ ] PhysX tuned: 60 Hz fixed step, 12+ solver iterations, sleep threshold raised
- [ ] Shape library: data-driven ScriptableObjects, convex/compound colliders
- [ ] Modifiers: Fragile, Timed, GravityFlip, material density set
- [ ] Ghost cursor with validity tint + 45° stepped rotation + snap assist
- [ ] Water kill volume + splash VFX/SFX (the fail state — make it beautiful)
- [ ] 3-second stability countdown + kinetic-energy sanity check
- [ ] Sub-300 ms instant retry via data-driven level reset
- [ ] URP water: Gerstner surface, refraction, caustics, underwater tint
- [ ] Cinemachine auto-framing orbit camera
- [ ] Level editor window + bot solvability tests
- [ ] `GameModeBase` plugin architecture: Arcade, Endurance, Infinity, Tower Tumble, Swift Stacker
- [ ] Multi-scene physics for split-screen; event-only netcode for online
- [ ] Mouse / gamepad / touch / gyro controllers behind one abstraction
- [ ] Circle progression economy + awards + leaderboards
- [ ] Lounge audio direction: per-world tracks, force-mapped placement sounds

## Appendix B — Reference Facts Used
- WiiWare original (2010): 4 worlds (A–D), 100 levels, circle-gated unlocks (20/40/60), co-op arcade, best-of-5/7/9 versus mode, 45° rotation steps, breakable glass shapes, 3 s final countdown, 800 Wii Points. 
- Wii U (2013): 200 levels / 8 worlds (from 3DS *TOUCH!*), Endurance (3 retries), 5-player co-op, Swift Stacker (local/online/mixed 2v2), Tower Tumble (new, local-only reverse-Jenga).
- PS4 (2016): five modes (Arcade, Endurance, Infinity, Tower Tumble, Swift Stacker), online leaderboards, trophies; gravity-flip shapes in level design.
- Switch (2018): PS4 content + touch controls, gyro aiming (patch), local wireless, HD Rumble; considered the definitive edition.
