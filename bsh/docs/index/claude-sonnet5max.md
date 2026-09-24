# Art of Balance — Unity 6.6 Implementation Plan

**Working title used throughout this document: "Balance Grove."** *Art of Balance* is Shin'en Multimedia's trademark; this plan is for an original, clean-room game inspired by its genre and design pillars, not a reproduction of its assets, code, or brand. Rename the project, namespaces, and any player-facing text before you ship anything — search-and-replace `BalanceGrove` throughout.

**Engine target:** Unity 6.6 (internal version `6000.6`), a TECH-stream release. Note up front: Unity's current LTS is **6.3** (supported through Dec 2027); 6.6 is newer and gets a shorter support window before APIs may shift again in the next LTS (6.7). Nothing in this plan depends on 6.6-exclusive features — if you'd rather build on a longer-support floor, everything here applies unchanged on 6.3 LTS. Where 6.6 specifically matters (URP profiler tooling, Android baseline bumps), it's called out inline. [Source](https://docs.unity3d.com/6000.6/Documentation/Manual/WhatsNewUnity66.html) · [Source](https://makaka.org/unity-tutorials/best-version)

---

## Table of Contents

1. [Source Material: What We're Recreating](#1-source-material-what-were-recreating)
2. [Clone Design Pillars & Scope Decisions](#2-clone-design-pillars--scope-decisions)
3. [Core Gameplay Loop Specification](#3-core-gameplay-loop-specification)
4. [Technical Architecture Overview](#4-technical-architecture-overview)
5. [Core Systems — Production Spec](#5-core-systems--production-spec)
6. [Multi-Platform Input Architecture](#6-multi-platform-input-architecture)
7. [Special Block Mechanics](#7-special-block-mechanics)
8. [Visual Recreation Plan](#8-visual-recreation-plan)
9. [Phased Development Roadmap](#9-phased-development-roadmap)
10. [Deep Dive — Wii U Edition](#10-deep-dive--wii-u-edition-2013-the-definitive-pre-switch-version)
11. [Deep Dive — PlayStation Edition](#11-deep-dive--playstation-edition-ps4-2016)
12. [Deep Dive — Nintendo Switch Edition](#12-deep-dive--nintendo-switch-edition-2018)
13. [Cross-Cutting Concerns](#13-cross-cutting-concerns)
14. [Risk Register & Open Questions](#14-risk-register--open-questions)
15. [Appendix](#15-appendix)

---

## 1. Source Material: What We're Recreating

Everything in this section is drawn from public reviews, official store listings, and Shin'en's own press materials — not from disassembling or datamining the original game. Facts are cited; anything not confirmed by a source is explicitly flagged as our own design extrapolation rather than presented as historical fact.

### 1.1 Franchise timeline (all entries developed & published by Shin'en Multimedia)

| Release | Platform | Date | Distinguishing facts |
|---|---|---|---|
| *Art of Balance* | WiiWare (Wii) | Mar 26, 2010 | 100 levels, Wii Remote pointer + motion controls, 800 Wii Points, co-op drop-in + split-screen versus mode |
| *Art of Balance TOUCH!* | Nintendo 3DS eShop | Sep 25, 2012 | 200 levels (100 more than the Wii original), touch-only controls |
| *Art of Balance* | Wii U eShop | Sep 25, 2013 | The "definitive edition" — unifies motion, GamePad touch, and button control schemes; 200 levels; HD remaster; up to 240fps physics; new multiplayer modes |
| *Art of Balance* | PlayStation 4 | Jun 3, 2016 | 200 levels; Arcade + Infinity modes; EN/DE/FR/ES localization; later playable via PS5 backward compatibility. **No PS Vita release exists** — an early assumption of ours, corrected during research |
| *Art of Balance* | Nintendo Switch | Oct 4, 2018 | 200 levels across 8 themed worlds; 5 official modes; motion controls added post-launch in patch v1.01; Metacritic 88 |

Sources: [Wikipedia](https://en.wikipedia.org/wiki/Art_of_Balance) · [Nintendo Life (WiiWare review)](https://www.nintendolife.com/reviews/2010/02/art_of_balance) · [Nintendo Life (Wii U review)](https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance) · [Nintendo Life (Wii U eShop announcement)](https://www.nintendolife.com/news/2014/02/exclusive_shinen_multimedia_bringing_art_of_balance_to_the_wii_u_eshop) · [GameFAQs PS4 data](https://gamefaqs.gamespot.com/ps4/190945-art-of-balance/data) · [Nintendo Switch eShop listing](https://www.nintendo.com/us/store/products/art-of-balance-switch/) · [Gematsu (Switch announcement)](https://www.gematsu.com/2018/09/physics-based-puzzle-game-art-of-balance-coming-to-switch-on-october-4) · [Nintendo Everything (v1.01 patch)](https://nintendoeverything.com/art-of-balance-switch-update-out-now-version-1-01-more-art-of-balance-news-next-week/)

### 1.2 The core loop, as documented

- The player is presented with a stone basin full of water with a stand/platform at its center, and a queue of differently-shaped blocks to place. ([GameCritics](https://gamecritics.com/michael-hughes/art-of-balance-review/), [Nintendo Life](https://www.nintendolife.com/reviews/2010/02/art_of_balance))
- Blocks are positioned and **rotated in 45° increments**, then dropped to fall under physics onto the growing stack. ([PlayStation Store listing](https://store.playstation.com/en-us/product/UP4496-CUSA01465_00-ARTOFBALANCE0000))
- A stack that survives **at least three seconds without any piece touching the water** counts as a win. ([GameCritics](https://gamecritics.com/michael-hughes/art-of-balance-review/), [Nintendo Life Wii U review](https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance))
- Difficulty ramps via a smooth, gradual curve rather than sudden spikes. ([Nintendo Life](https://www.nintendolife.com/reviews/2010/02/art_of_balance))
- **What is *not* documented anywhere we found:** an exact scoring formula, a star-rating system for standard levels, or the precise trigger condition for when a gravity-inverting block activates. Section 3.4 and Section 7 propose original designs for these gaps and label them as such.

### 1.3 Special block types (documented from Wii U-era reviews and later)

| Block type | Documented behavior | Source |
|---|---|---|
| Breakable / weight-limited | Shatters once a threshold number of other blocks (reviews cite **three**) rest on top of it | [Cubed3](https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2), [Nintendo Life](https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance) |
| Timed / disappearing | Vanishes a short time after another block is placed on it, or on contact with a matching block type | [GameFAQs](https://gamefaqs.gamespot.com/wii-u/842577-art-of-balance/reviews/164850), [Cubed3](https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2) |
| Gravity-inverting | Reverses gravity for the stack, sending it "flying" to land on an opposing surface | [GameCritics](https://gamecritics.com/michael-hughes/art-of-balance-review/) ("WTF: Gravity-inverting blocks?!"), [GameFAQs](https://gamefaqs.gamespot.com/wii-u/842577-art-of-balance/reviews/164850) |
| Linked rising/falling (seesaw) | Two blocks built into the base platform, mechanically linked so one rises as the other falls | [Nintendo Life](https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance) |

### 1.4 Visual identity, as described by reviewers

- A recurring "zen" framing: "a gorgeous zen presentation... a tub of water that catches the rays of sunlight coming in through the window just right." ([The Game Hoard](https://thegamehoard.com/2023/03/14/art-of-balance-wii-u/))
- Wood-toy-like blocks and soft, rounded shading; water with reflections and ripple effects; per-review technical notes of "flawless 60fps" (Wii U) and "up to 240fps physics" processing independent of render framerate. ([Nintenpedia](https://nintenpedia.com/art-of-balance-review/), [Nintendo Life](https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance))
- The original 2010 WiiWare release had a **mixed** visual reception — some backdrops were called out for jagged 3D edges contrasting with smooth block shading — that the later HD Wii U pass explicitly addressed with "all new graphics, designs and locations." ([Nintendo Life 2010](https://www.nintendolife.com/reviews/2010/02/art_of_balance), [Nintendo Life Wii U](https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance))
- The Switch version organizes its 200 levels into **8 worlds, each with its own "lounge style"** — implying a distinct visual + musical theme per world. ([Nintendo Switch eShop](https://www.nintendo.com/us/store/products/art-of-balance-switch/))

---

## 2. Clone Design Pillars & Scope Decisions

These are the decisions that shape every section below. They were chosen deliberately over the alternatives, not defaulted into:

1. **Original-style art, not exact reproduction.** We recreate the *category* of look (soft-shaded toy-like blocks, nature-diorama basins, warm zen lighting, per-world thematic variety) using entirely original character, prop, and environment designs. This keeps the project safe to show, share, or eventually publish, and it also happens to match Shin'en's own trajectory — they redesigned the look wholesale between the 2010 original and the 2013 HD version, so "reinterpret, don't trace" is in keeping with the franchise's own history.
2. **Multi-platform input from day one.** The original series solved this exact problem three times over (Wii Remote → touch → unified Wii U tri-scheme → Switch's later motion patch). Rather than bolt on alternate control schemes after the fact, Section 6 designs a single input abstraction every gameplay system talks to, so PC, touch, gamepad, and motion are peers from the first prototype. This also means the Section 10–12 deep dives are mostly about *plugging new providers into an existing seam* rather than new architecture — read Section 12.4 for how directly this pays off when we walk through the real Switch v1.01 motion patch as a worked example.
3. **Full production-ready technical depth.** Section 5 onward includes concrete C# — class names, field lists, method signatures, and working logic for the non-obvious systems (stability detection, gravity inversion, input routing) — not just prose architecture. Treat the code as a strong starting skeleton, not copy-paste-final; you will still need to tune physics values by feel in-editor.
4. **A phased roadmap, not just a systems catalog.** Section 9 sequences all of the above into build order with entry/exit criteria per phase, so this document can drive actual sprint planning.
5. **Target platforms for our build:** PC (Windows/Mac/Linux) as the primary development target, with Switch-like and mobile-like constraints treated as first-class citizens throughout (not an afterthought) because of pillar #2. Section 13.2 gives concrete performance budgets per tier.

---

## 3. Core Gameplay Loop Specification

### 3.1 Game flow (state diagram)

```
   ┌────────┐     ┌───────────┐     ┌─────────────┐     ┌───────────┐
   │  Boot  │ ──► │ Main Menu │ ──► │ World Select│ ──► │Level Select│
   └────────┘     └───────────┘     └─────────────┘     └─────┬─────┘
                                                                │
                        ┌───────────────────────────────────────┘
                        ▼
                 ┌─────────────┐   pause   ┌────────┐
                 │  Gameplay   │◄─────────►│ Paused │
                 └──────┬──────┘           └────────┘
                        │ win / fail / abandon
                        ▼
                 ┌──────────────┐
                 │ Level Result │──► back to Level Select (or auto-advance)
                 └──────────────┘
```

This maps directly onto the `GameStateMachine` in Section 5.2.

### 3.2 The stacking loop, beat by beat

1. **Queue advance.** `PieceQueueController` dequeues the next `PieceDefinition` and spawns a **held piece** — kinematic (not yet physics-driven), positioned at a fixed spawn point above the stage.
2. **Position & orient.** The active `IPieceInputProvider` (Section 6) drives the held piece's target X/Z position and its yaw/pitch orientation. Orientation snaps to **45° increments** per axis (matching the documented control feel) — 8 discrete facings on each rotation axis.
3. **Drop.** On the drop input, the piece's `Rigidbody.isKinematic` flips to `false`; it now falls and collides under normal physics.
4. **Settle.** `StabilityMonitor` (Section 5.5) watches every placed piece's `Rigidbody.IsSleeping()` state (Unity 6 API — see Section 5.4) and its distance from the water plane.
5. **Evaluate.**
   - If any piece's collider enters the `WaterHazardVolume` trigger at any point → **immediate fail**.
   - If the queue is empty and every placed piece has been asleep (settled) continuously for **3 seconds** without a water touch → **level won**.
   - Otherwise, return to step 1 for the next queued piece.
6. **Result.** Show `LevelResult` (Section 3.4 scoring), offer retry / next level / level select.

### 3.3 Win/lose conditions — precise rules for implementation

| Rule | Value | Source / status |
|---|---|---|
| Stability hold duration | 3.0 seconds | Documented ([GameCritics](https://gamecritics.com/michael-hughes/art-of-balance-review/)) |
| Fail trigger | Any placed piece's collider touches the water volume | Documented |
| Rotation snap increment | 45° | Documented ([PS Store](https://store.playstation.com/en-us/product/UP4496-CUSA01465_00-ARTOFBALANCE0000)) |
| Whether the *held* (not-yet-dropped) piece can also fail the level by falling into water before drop | Not documented | **Our ruling:** no — only pieces that have been intentionally dropped count; the held piece can be freely repositioned including over water without penalty, matching how every reviewed control scheme describes free aiming before commit |
| Retry limit / fail counter | Cubed3's Switch review mentions Endurance mode ending after "three total fails" | Documented for Endurance mode specifically (Section 12.3); standard Arcade levels are unlimited-retry per our design |

### 3.4 Scoring design (original design — not a recreation of undocumented internals)

No source documents an exact scoring formula for standard levels, so we designed one that fits the observed shape of the game (par-time driven, stability-margin rewarding) and is simple to compute and explain to the player:

- **1 star:** level completed (any time, any number of retries).
- **2 stars:** completed at or under the level's authored `parTimeSeconds` (measured from first piece drop to final settle).
- **3 stars:** 2-star condition **and** a "clean stack" bonus — the maximum instantaneous tilt angle recorded on any piece during the 3-second hold never exceeded a per-level `cleanTiltThresholdDegrees` (default 15°). This rewards a genuinely stable build, not just a lucky one, and is cheap to compute incrementally (Section 5.7).

Retries do not block 3-star eligibility — only the successful attempt's metrics matter. This is a deliberate, documented design choice you're free to change; it's flagged here specifically so nobody mistakes it for a recreated original mechanic.

---

## 4. Technical Architecture Overview

### 4.1 Project setup

| Setting | Choice | Why |
|---|---|---|
| Unity version | 6.6 (6000.6), or 6.3 LTS if you want a longer support window | Neither this plan nor the gameplay depends on 6.6-only features |
| Render pipeline | **URP** (`com.unity.render-pipelines.universal`) | Stylized, performant on PC/mobile/console alike; HDRP is desktop/console-only and overkill for this art style |
| Physics | Built-in 3D physics (`Rigidbody`/`Collider`, PhysX-backed) | Level-authored, small body counts (tens, not thousands) per level — DOTS/Unity Physics (ECS) buys nothing here and costs iteration speed and tooling simplicity |
| Input | Input System package (`com.unity.inputsystem`) | Required for the multi-platform abstraction in Section 6; supports simultaneous local multiplayer natively |
| Camera | Cinemachine (`com.unity.cinemachine`) | Smooth stack-framing and multiplayer split-screen rigs without hand-rolled camera math |
| Localization | Localization package (`com.unity.localization`) | Needed for Section 11.4 (the original shipped 4 languages) |
| Networking (optional, Section 10/12) | Netcode for GameObjects (`com.unity.netcode.gameobjects`) | Only needed once you build the online multiplayer features from the Wii U/Switch deep dives |
| Testing | Unity Test Framework (`com.unity.test-framework`) | Physics-determinism and level-solvability tests, Section 13.4 |

### 4.2 Folder structure

```
Assets/
  _Project/
    Art/
      Models/            (block meshes, per-world environment kits)
      Materials/
      Shaders/           (block "soft toy" shader, water shader)
      Textures/
      VFX/               (break/shatter, dissolve, gravity-flip particles)
    Audio/
      Music/             (per-world "lounge" tracks)
      SFX/
    Data/
      Pieces/            (PieceDefinition .asset files)
      Levels/            (LevelDefinition .asset files)
      Worlds/            (WorldDefinition .asset files)
    Prefabs/
      Pieces/
      Stages/            (basin + platform + water volume per stage archetype)
      UI/
    Scenes/
      Boot.unity
      MainMenu.unity
      Gameplay.unity
    Scripts/
      BalanceGrove.Core/       (state machine, bootstrap, save)
      BalanceGrove.Data/       (ScriptableObject definitions)
      BalanceGrove.Gameplay/   (LevelManager, PieceController, StabilityMonitor, block behaviours)
      BalanceGrove.Input/      (IPieceInputProvider + implementations)
      BalanceGrove.Modes/      (IGameMode + implementations)
      BalanceGrove.Services/   (ISaveService, IAchievementService, localization glue)
      BalanceGrove.UI/
      BalanceGrove.Camera/
      BalanceGrove.Editor/     (custom LevelDefinition inspector/validator)
      BalanceGrove.Tests/
    Settings/
      URP/
      InputActions/
```

Each `Scripts/BalanceGrove.*` folder gets its own `.asmdef` so gameplay code doesn't recompile when you touch editor tooling, and tests compile in isolation.

### 4.3 System map

```
                         ┌───────────────────┐
                         │  GameStateMachine  │
                         └─────────┬──────────┘
                                   │ drives
                 ┌─────────────────┼─────────────────┐
                 ▼                 ▼                 ▼
        ┌────────────────┐ ┌──────────────┐  ┌───────────────┐
        │  LevelManager   │ │  IGameMode   │  │   SaveSystem   │
        └───────┬─────────┘ └──────┬───────┘  └───────────────┘
                 │ owns             │ configures
                 ▼                  ▼
        ┌─────────────────┐  (win/fail rules, retry limits, scoring variant)
        │PieceQueueController│
        └───────┬─────────┘
                 │ spawns
                 ▼
        ┌─────────────────┐      reads       ┌────────────────────┐
        │  PieceController │ ◄──────────────► │IPieceInputProvider │
        └───────┬─────────┘                   └────────────────────┘
                 │ on drop, physics-driven
                 ▼
        ┌─────────────────┐      watches     ┌────────────────────┐
        │  Rigidbody/      │ ◄──────────────  │  StabilityMonitor   │
        │  IBlockBehaviour │ ──────────────►  │  WaterHazardVolume  │
        └─────────────────┘   fires events    └────────────────────┘
```

Systems talk through C# events / interfaces, not direct references, so any box can be unit-tested or swapped independently (e.g., swapping `IAchievementService` per platform, Section 11.3).

---

## 5. Core Systems — Production Spec

### 5.1 Data layer: ScriptableObject definitions

```csharp
namespace BalanceGrove.Data
{
    public enum BlockBehaviourType
    {
        Normal,
        Breakable,
        Timed,
        GravityInverter,
        LinkedSeesaw
    }

    [CreateAssetMenu(menuName = "BalanceGrove/Piece Definition")]
    public class PieceDefinition : ScriptableObject
    {
        public string pieceId;
        public string displayName;
        public GameObject visualPrefab;        // mesh + renderer + material
        public PhysicsMaterial physicsMaterial; // friction/bounciness tuning
        public float mass = 1f;
        public BlockBehaviourType behaviourType = BlockBehaviourType.Normal;

        [Header("Behaviour parameters (used per behaviourType)")]
        public int breakAfterLoadCount = 3;       // Breakable
        public float disappearDelaySeconds = 2f;  // Timed
        public float gravityInvertRadius = 3f;    // GravityInverter
    }

    [CreateAssetMenu(menuName = "BalanceGrove/Level Definition")]
    public class LevelDefinition : ScriptableObject
    {
        public string levelId;
        public GameObject stagePrefab;           // basin + platform + WaterHazardVolume
        public List<PieceDefinition> pieceQueue; // ordered
        public float parTimeSeconds = 60f;
        public float stabilityHoldSeconds = 3f;
        public float cleanTiltThresholdDegrees = 15f;
    }

    [CreateAssetMenu(menuName = "BalanceGrove/World Definition")]
    public class WorldDefinition : ScriptableObject
    {
        public string worldId;
        public string displayName;
        public WorldTheme theme;                 // skybox, lighting preset, music track
        public List<LevelDefinition> levels;
    }
}
```

An editor-only validator (`BalanceGrove.Editor`) should assert on asset save that `pieceQueue` isn't empty, `stagePrefab` has exactly one `WaterHazardVolume`, and IDs are unique across the project — catching authoring mistakes before they reach a build.

### 5.2 Game state machine

```csharp
namespace BalanceGrove.Core
{
    public interface IGameState
    {
        void Enter();
        void Tick(float deltaTime);
        void Exit();
    }

    public class GameStateMachine
    {
        public IGameState Current { get; private set; }
        public event Action<IGameState, IGameState> OnStateChanged;

        public void ChangeState(IGameState next)
        {
            var previous = Current;
            previous?.Exit();
            Current = next;
            Current.Enter();
            OnStateChanged?.Invoke(previous, Current);
        }

        public void Tick(float deltaTime) => Current?.Tick(deltaTime);
    }
}
```

Concrete states (`MainMenuState`, `LevelSelectState`, `GameplayState`, `PausedState`, `LevelResultState`) each own their scene/UI activation in `Enter()`/`Exit()`. `GameplayState.Enter()` is what calls into `LevelManager.LoadLevel(LevelDefinition)`.

### 5.3 Level & queue management

```csharp
namespace BalanceGrove.Gameplay
{
    public class LevelManager : MonoBehaviour
    {
        [SerializeField] private PieceQueueController queueController;
        [SerializeField] private StabilityMonitor stabilityMonitor;

        public event Action OnLevelWon;
        public event Action OnLevelFailed;

        private LevelDefinition _current;
        private GameObject _stageInstance;

        public void LoadLevel(LevelDefinition level)
        {
            _current = level;
            _stageInstance = Instantiate(level.stagePrefab);
            var waterVolume = _stageInstance.GetComponentInChildren<WaterHazardVolume>();

            queueController.Initialize(level.pieceQueue);
            stabilityMonitor.Initialize(waterVolume, level.stabilityHoldSeconds, level.cleanTiltThresholdDegrees);

            stabilityMonitor.OnHazardTouched += HandleFail;
            stabilityMonitor.OnStackStable += HandleWin;
            queueController.OnQueueExhausted += stabilityMonitor.BeginFinalWatch;

            queueController.SpawnNext();
        }

        private void HandleWin()  { OnLevelWon?.Invoke();  }
        private void HandleFail() { OnLevelFailed?.Invoke(); }

        public void Reload() => LoadLevel(_current);
    }

    public class PieceQueueController : MonoBehaviour
    {
        [SerializeField] private Transform spawnPoint;
        [SerializeField] private GameObject pieceControllerPrefab;

        private Queue<PieceDefinition> _queue;
        public event Action OnQueueExhausted;
        public PieceController ActivePiece { get; private set; }

        public void Initialize(List<PieceDefinition> pieces) => _queue = new Queue<PieceDefinition>(pieces);

        public void SpawnNext()
        {
            if (_queue.Count == 0) { OnQueueExhausted?.Invoke(); return; }

            var def = _queue.Dequeue();
            var go = Instantiate(pieceControllerPrefab, spawnPoint.position, Quaternion.identity);
            ActivePiece = go.GetComponent<PieceController>();
            ActivePiece.Initialize(def);
            ActivePiece.OnDropped += () => SpawnNext();
        }
    }
}
```

### 5.4 Piece control & physics configuration

```csharp
namespace BalanceGrove.Gameplay
{
    [RequireComponent(typeof(Rigidbody))]
    public class PieceController : MonoBehaviour
    {
        [SerializeField] private float moveSpeed = 4f;
        [SerializeField] private int yawSteps45;   // 0-7, current facing
        [SerializeField] private int pitchSteps45; // 0-7

        private Rigidbody _rb;
        private IPieceInputProvider _input;
        public event Action OnDropped;

        public void Initialize(PieceDefinition def)
        {
            _rb = GetComponent<Rigidbody>();
            _rb.isKinematic = true; // held, not yet physics-driven
            _rb.mass = def.mass;
            _rb.collisionDetectionMode = CollisionDetectionMode.ContinuousSpeculative;
            _rb.interpolation = RigidbodyInterpolation.Interpolate;

            // Stacking-specific solver tuning — PhysX default (6) under-resolves
            // multi-body stacks; raise both position and velocity iterations.
            _rb.solverIterations = 16;
            _rb.solverVelocityIterations = 8;

            GetComponent<Collider>().material = def.physicsMaterial;
            Instantiate(def.visualPrefab, transform);

            _input = PieceInputRouter.Active; // Section 6
        }

        private void Update()
        {
            if (_rb.isKinematic)
            {
                var move = _input.GetMoveDelta() * moveSpeed * Time.deltaTime;
                transform.position += new Vector3(move.x, 0, move.y);

                if (_input.ConsumeRotateYawStep(out int ySteps))
                    yawSteps45 = Mod8(yawSteps45 + ySteps);
                if (_input.ConsumeRotatePitchStep(out int pSteps))
                    pitchSteps45 = Mod8(pitchSteps45 + pSteps);

                transform.rotation = Quaternion.Euler(pitchSteps45 * 45f, yawSteps45 * 45f, 0f);

                if (_input.DropPressed())
                    Drop();
            }
        }

        private void Drop()
        {
            _rb.isKinematic = false;
            OnDropped?.Invoke();
        }

        private static int Mod8(int v) => ((v % 8) + 8) % 8;
    }
}
```

> **Unity 6 API note:** `Rigidbody.velocity` was renamed to `Rigidbody.linearVelocity` in Unity 6. `StabilityMonitor` below uses the new name — if you're referencing older Unity tutorials, expect this to be the most common compile break you hit while porting sample code.

### 5.5 Stability detection

This is the trickiest system to get feeling right — too generous and the game never fails; too strict and physics jitter causes false fails. The design uses Unity's own sleep state (which already accounts for velocity thresholds settling over multiple frames) rather than re-inventing a velocity check:

```csharp
namespace BalanceGrove.Gameplay
{
    public class StabilityMonitor : MonoBehaviour
    {
        private WaterHazardVolume _water;
        private float _holdDuration;
        private float _cleanTiltThreshold;
        private readonly List<Rigidbody> _placedBodies = new();
        private bool _finalWatchArmed;
        private float _stableTimer;
        private float _maxTiltRecorded;

        public event Action OnHazardTouched;
        public event Action OnStackStable;

        public void Initialize(WaterHazardVolume water, float holdDuration, float cleanTiltThreshold)
        {
            _water = water;
            _holdDuration = holdDuration;
            _cleanTiltThreshold = cleanTiltThreshold;
            _water.OnPieceTouchedWater += HandleHazard;
        }

        public void RegisterPlacedBody(Rigidbody rb) => _placedBodies.Add(rb);

        // Called once the queue is empty — only then do we start counting toward the win.
        public void BeginFinalWatch() => _finalWatchArmed = true;

        private void FixedUpdate()
        {
            if (!_finalWatchArmed || _placedBodies.Count == 0) return;

            bool allAsleep = true;
            foreach (var rb in _placedBodies)
            {
                if (rb == null) continue; // destroyed by a Breakable/Timed behaviour — handled in Section 7

                float tilt = Vector3.Angle(rb.transform.up, Vector3.up);
                _maxTiltRecorded = Mathf.Max(_maxTiltRecorded, tilt);

                if (!rb.IsSleeping()) allAsleep = false;
            }

            if (allAsleep)
            {
                _stableTimer += Time.fixedDeltaTime;
                if (_stableTimer >= _holdDuration)
                {
                    OnStackStable?.Invoke();
                    enabled = false; // stop watching, level is won
                }
            }
            else
            {
                _stableTimer = 0f; // any wake-up (settling shift) resets the hold
            }
        }

        public bool CleanStackAchieved => _maxTiltRecorded <= _cleanTiltThreshold;

        private void HandleHazard() => OnHazardTouched?.Invoke();
    }
}
```

```csharp
namespace BalanceGrove.Gameplay
{
    [RequireComponent(typeof(Collider))]
    public class WaterHazardVolume : MonoBehaviour
    {
        public event Action OnPieceTouchedWater;

        private void OnTriggerEnter(Collider other)
        {
            if (other.GetComponentInParent<PieceController>() != null)
                OnPieceTouchedWater?.Invoke();
        }
    }
}
```

`PieceController` should call `stabilityMonitor.RegisterPlacedBody(_rb)` from within `Drop()` so the monitor only ever watches pieces that have actually been committed — the held piece is deliberately exempt (Section 3.3).

### 5.6 Scoring

```csharp
namespace BalanceGrove.Gameplay
{
    public readonly struct LevelScoreResult
    {
        public readonly int stars;
        public readonly float completionTimeSeconds;
        public LevelScoreResult(int stars, float time) { this.stars = stars; completionTimeSeconds = time; }
    }

    public static class ScoreCalculator
    {
        public static LevelScoreResult Evaluate(LevelDefinition level, float completionTime, bool cleanStack)
        {
            int stars = 1;
            if (completionTime <= level.parTimeSeconds) stars = 2;
            if (stars == 2 && cleanStack) stars = 3;
            return new LevelScoreResult(stars, completionTime);
        }
    }
}
```

### 5.7 Camera

A `StackFramingCamera` (Cinemachine `CinemachineCamera` driven by a custom `CinemachineExtension` or a plain script) recomputes a bounding box from every placed piece's renderer each time a piece settles, then smooth-damps the camera's distance/height to keep the whole stack framed with margin. Orbit is player-driven via the same input abstraction (Section 6): mouse-drag, touch-drag, or right-stick all map to the same `GetOrbitDelta()` call.

### 5.8 Save system

```csharp
namespace BalanceGrove.Services
{
    [Serializable]
    public class LevelProgress { public string levelId; public int stars; public float bestTimeSeconds; }

    [Serializable]
    public class PlayerProfile
    {
        public List<string> unlockedWorldIds = new();
        public List<LevelProgress> levelProgress = new();
    }

    public interface ISaveService
    {
        PlayerProfile Load();
        void Save(PlayerProfile profile);
    }

    // Default: local JSON. Platform-specific implementations (Steam Cloud,
    // PSN save data, Nintendo save-data API) implement the same interface —
    // see Section 13.1.
    public class LocalJsonSaveService : ISaveService
    {
        private readonly string _path = Path.Combine(Application.persistentDataPath, "profile.json");

        public PlayerProfile Load() =>
            File.Exists(_path) ? JsonUtility.FromJson<PlayerProfile>(File.ReadAllText(_path)) : new PlayerProfile();

        public void Save(PlayerProfile profile) =>
            File.WriteAllText(_path, JsonUtility.ToJson(profile, prettyPrint: true));
    }
}
```

---

## 6. Multi-Platform Input Architecture

This is the seam pillar #2 (Section 2) is built around. Every downstream deep dive (Sections 10–12) reduces to "implement one more `IPieceInputProvider`."

### 6.1 The abstraction

```csharp
namespace BalanceGrove.Input
{
    public interface IPieceInputProvider
    {
        Vector2 GetMoveDelta();
        bool ConsumeRotateYawStep(out int steps);   // returns true once per discrete 45° step
        bool ConsumeRotatePitchStep(out int steps);
        bool DropPressed();
        Vector2 GetOrbitDelta();
        bool PausePressed();
    }
}
```

Every gameplay script (`PieceController`, camera) talks only to this interface — never to `Keyboard.current` or `Touchscreen.current` directly. That single rule is what makes Sections 10–12's "add a new control scheme" work additive rather than invasive.

### 6.2 Input Actions asset

One `InputActionAsset` (`Settings/InputActions/PieceControls.inputactions`) with action map `PieceControl`:

| Action | Type | KBM binding | Gamepad binding | Notes |
|---|---|---|---|---|
| Move | Vector2 | WASD / mouse delta | Left stick | |
| RotateYaw | Axis (1D) | Q / E | Right stick X | Edge-triggered into discrete steps in code |
| RotatePitch | Axis (1D) | Scroll wheel | Right stick Y | |
| Drop | Button | Space / Left click | South button | |
| Orbit | Vector2 | Right-click drag | Right stick (when not rotating — see 6.4) | |
| Pause | Button | Escape | Start | |

Touch and motion/gyro are **not** expressed as Input Action bindings — they're handled by dedicated providers below because drag-to-place and gyro-to-tilt need custom gesture logic that binding-based actions don't model well.

### 6.3 Concrete providers

```csharp
namespace BalanceGrove.Input
{
    public class KeyboardMouseInputProvider : IPieceInputProvider
    {
        private readonly InputAction _move, _rotateYaw, _rotatePitch, _drop, _orbit, _pause;
        // ... constructed from the shared InputActionAsset's PieceControl map

        public Vector2 GetMoveDelta() => _move.ReadValue<Vector2>();
        public bool ConsumeRotateYawStep(out int steps) => StepHelper.EdgeTrigger(_rotateYaw, out steps);
        public bool ConsumeRotatePitchStep(out int steps) => StepHelper.EdgeTrigger(_rotatePitch, out steps);
        public bool DropPressed() => _drop.WasPressedThisFrame();
        public Vector2 GetOrbitDelta() => _orbit.ReadValue<Vector2>();
        public bool PausePressed() => _pause.WasPressedThisFrame();
    }

    public class TouchInputProvider : IPieceInputProvider
    {
        // Built on Unity's EnhancedTouch API rather than raw bindings:
        // one finger drag = Move, two-finger twist = RotateYaw,
        // two-finger pinch-drag vertically = RotatePitch, on-screen button = Drop.
        // Orbit is a secondary single-finger drag outside the piece's drag hotspot.
    }

    public class MotionGyroInputProvider : IPieceInputProvider
    {
        // Wraps Gyroscope/attitude sensor input (mobile) or a Joy-Con's
        // gyro (via platform SDK on Switch — see Section 12.4).
        // Device tilt maps to RotatePitch/RotateYaw step events once
        // accumulated delta crosses a 45° threshold, then resets the
        // accumulator — converting continuous motion into the same
        // discrete-step contract every other provider honors.
    }
}
```

### 6.4 Routing & device-switch UX

```csharp
namespace BalanceGrove.Input
{
    public static class PieceInputRouter
    {
        public static IPieceInputProvider Active { get; private set; }
        public static event Action<IPieceInputProvider> OnProviderChanged;

        // Subscribed to InputSystem.onActionChange / InputUser device-change
        // notifications: last device used wins, mirroring how the Wii U
        // version let players switch between motion, touch, and buttons
        // mid-session without a settings menu (Section 10.1).
        public static void SetActive(IPieceInputProvider provider)
        {
            Active = provider;
            OnProviderChanged?.Invoke(provider);
        }
    }
}
```

UI prompts (e.g., "Press A to drop" vs. "Tap to drop") subscribe to `OnProviderChanged` and swap icon sets — a small system, but it's the difference between a control scheme that feels native per-device and one that feels like a PC game with a gamepad bolted on.

---

## 7. Special Block Mechanics

All four documented special block types (Section 1.3) implement one interface, attached as a component alongside the piece's `Rigidbody`:

```csharp
namespace BalanceGrove.Gameplay.Blocks
{
    public interface IBlockBehaviour
    {
        void OnPlaced(PieceController owner);     // called once, on Drop()
        void OnSupportingContact(PieceController other); // another piece now resting on this one
    }

    [RequireComponent(typeof(Rigidbody))]
    public class BreakableBlockBehaviour : MonoBehaviour, IBlockBehaviour
    {
        [SerializeField] private int breakAfterLoadCount = 3;
        [SerializeField] private GameObject shatterVfxPrefab;
        private int _loadCount;

        public void OnPlaced(PieceController owner) { }

        public void OnSupportingContact(PieceController other)
        {
            _loadCount++;
            if (_loadCount >= breakAfterLoadCount)
                Break();
        }

        private void Break()
        {
            Instantiate(shatterVfxPrefab, transform.position, transform.rotation);
            // Pieces that were resting on this one are now unsupported and
            // fall under normal physics — no special-case code needed,
            // PhysX handles the cascade once this collider/rigidbody is gone.
            Destroy(gameObject);
        }
    }

    public class TimedBlockBehaviour : MonoBehaviour, IBlockBehaviour
    {
        [SerializeField] private float disappearDelaySeconds = 2f;
        [SerializeField] private GameObject dissolveVfxPrefab;
        private bool _countdownStarted;

        public void OnPlaced(PieceController owner) { }

        public void OnSupportingContact(PieceController other)
        {
            if (_countdownStarted) return;
            _countdownStarted = true;
            StartCoroutine(CountdownAndDisappear());
        }

        private IEnumerator CountdownAndDisappear()
        {
            yield return new WaitForSeconds(disappearDelaySeconds);
            Instantiate(dissolveVfxPrefab, transform.position, transform.rotation);
            Destroy(gameObject);
        }
    }

    public class GravityInverterBlockBehaviour : MonoBehaviour, IBlockBehaviour
    {
        [SerializeField] private float affectRadius = 3f;
        [SerializeField] private GameObject flipVfxPrefab;

        // Design ruling (undocumented in sources): activates once THIS
        // block itself settles after being placed — not on contact from
        // another piece — since it's the piece the player deliberately
        // drops to trigger the twist, per reviewer descriptions of a
        // structure "flying up into the air after a change in gravity."
        public void OnPlaced(PieceController owner) => StartCoroutine(WaitThenInvert(owner));

        public void OnSupportingContact(PieceController other) { }

        private IEnumerator WaitThenInvert(PieceController owner)
        {
            var rb = owner.GetComponent<Rigidbody>();
            yield return new WaitUntil(() => rb.IsSleeping());

            Instantiate(flipVfxPrefab, transform.position, transform.rotation);
            foreach (var body in GravityZoneManager.BodiesWithinRadius(transform.position, affectRadius))
                GravityZoneManager.InvertGravityFor(body);
        }
    }
}
```

**Why a `GravityZoneManager` instead of flipping `Physics.gravity`:** global gravity is scene-wide — flipping it would also fling the piece currently in the player's hand and any UI-attached physics objects. Instead, each affected `Rigidbody` gets `useGravity = false` and a per-body custom gravity force applied in `FixedUpdate`, scoped to just the bodies in the inverted stack:

```csharp
namespace BalanceGrove.Gameplay.Blocks
{
    public static class GravityZoneManager
    {
        private static readonly Dictionary<Rigidbody, Vector3> _customGravity = new();

        public static void InvertGravityFor(Rigidbody rb)
        {
            rb.useGravity = false;
            _customGravity[rb] = -Physics.gravity;
        }

        // Called from a single manager MonoBehaviour's FixedUpdate,
        // not per-block, to keep this O(affected bodies) not O(blocks).
        public static void Tick()
        {
            foreach (var (rb, gravity) in _customGravity)
                rb.AddForce(gravity, ForceMode.Acceleration);
        }
    }
}
```

**Linked seesaw** is deliberately *not* scripted logic — it's built as a **physical hinge** so the behavior emerges from the same physics stack everything else uses:

- A plank `Rigidbody` connected to the stage's base via a `HingeJoint` (axis through the plank's center, matching a real seesaw pivot).
- No motor, no scripted rotation — when the player's stack piece rests on one side, gravity + the joint naturally tips the plank and raises the other side, exactly matching the documented "as one rises, the other falls" behavior. This is both the simplest implementation and the most physically honest one.

---

## 8. Visual Recreation Plan

### 8.1 Art direction brief (original designs, "Art of Balance"-*inspired*, not copied)

| Element | Direction | Rationale |
|---|---|---|
| Block material | Soft matte "toy wood" shader: rounded-corner normal map fakes, warm diffuse, subtle rim light, no hard specular | Matches "soft, rounded shapes" reviewer language without copying specific geometry |
| Basin / stage | Carved-stone or wood-bowl silhouettes, one archetype per world theme | Matches "stone basin" language; per-world reskins give the 8-world visual variety documented for the Switch version |
| Water | Stylized, not photoreal: soft normal-map ripple animation, Fresnel-based reflection tint, gentle caustic overlay | "Reflections and ripples" were specifically praised; going stylized rather than physically-based fits the toy-diorama tone and is cheap on lower-end targets |
| Lighting | Warm single key light (simulated "window sunlight"), soft fill, no harsh shadows | Directly recreates the reviewer-described "sunlight coming in through the window" mood |
| World theming | 8 original biome concepts (e.g., orchard, tidepool, autumn forest, greenhouse, mountain shrine, workshop, meadow, night garden) — original names/assets, thematically parallel to "8 worlds, each its own lounge style" | Delivers the documented structure without reusing any specific original asset |

### 8.2 URP setup

- One `UniversalRenderPipelineAsset` per quality tier (Mobile/Switch-like, Desktop-high) swapped via `QualitySettings`, not per-scene — keeps a single Gameplay scene portable across target performance tiers (ties into Section 13.2 budgets).
- Post-processing volume: mild bloom (readable "sunlit" highlights on wet water/block edges), soft depth-of-field on the `LevelSelect`/`LevelResult` cameras only (keep gameplay camera DoF-free so players can always judge piece silhouettes precisely), ACES or a warm custom tonemap for the "zen" color grade.
- Unity 6.6 specifically improves the URP Profiler (GPU Resident Drawer reporting, a new URP Settings Analyzer in Project Auditor) — worth running once per world-theme art pass to catch shader-variant bloat before it snowballs across 8 worlds. [Source](https://docs.unity3d.com/6000.6/Documentation/Manual/WhatsNewUnity66.html)

### 8.3 Block shader

A single Shader Graph, parameterized per `PieceDefinition` via a `MaterialPropertyBlock` (avoids a material-per-block-color draw call explosion): base color, rim intensity, and a "wet" float (0→1, driven by proximity to the water plane, so pieces visibly darken/gain sheen near-miss the water — a nice readability cue for how close to failing a near-fail stack is).

### 8.4 Per-world environment theming

Each `WorldTheme` (referenced from `WorldDefinition`, Section 5.1) bundles: a skybox/environment reflection probe, a directional light color+intensity preset, a basin material override, and a music track reference. Levels within a world share the theme; only the basin/platform geometry and piece queue vary per level. This keeps 200-level content scale (Section 12.1) from requiring 200 unique environment builds — 8 themes reused across ~25 levels each.

### 8.5 UI/HUD

- **In-level HUD:** minimal — piece queue preview (next 2-3 shapes), a subtle stability-hold radial timer that only appears once the final piece is placed (avoids cluttering the screen during active placement), context-sensitive input prompt (Section 6.4).
- **World/level select:** a literal map metaphor (matches "world" framing) with 8 nodes, each opening a level grid themed to that world's palette.
- Star/score display follows the 1–3 star convention from Section 3.4.

### 8.6 Audio direction

- Per-world ambient "lounge" music loops (matches documented "relaxing lounge soundtrack" framing) — original compositions, not recreations of Shin'en's tracks.
- Diegetic-feeling SFX: soft wood-knock placement sounds, a rising "wobble creak" tied to the same tilt-angle metric `StabilityMonitor` already tracks (Section 5.5) — reusing that value for audio feedback is effectively free and gives players an audio cue for "this is getting unstable" that the original's reviewers describe experiencing viscerally ("a game of nervous tension").

---

## 9. Phased Development Roadmap

Durations are relative sizing for a small team/solo developer, not calendar commitments — resequence freely, but keep the dependency order (each phase's exit criteria are the next phase's assumptions).

| Phase | Focus | Exit criteria |
|---|---|---|
| **0. Pre-production** (1–2 wk) | Unity 6.6 project scaffold; gray-box physics prototype; validate stacking "feel" and 3-second stability rule | A single hand-built level is winnable/failable end-to-end with placeholder cubes |
| **1. Core loop vertical slice** (2–3 wk) | Section 5 data layer + `LevelManager` + `PieceQueueController` + `StabilityMonitor`, one input provider (KBM) | 5 hand-authored levels playable start-to-finish, greybox art |
| **2. Multi-platform input** (1–2 wk) | Full `IPieceInputProvider` abstraction (Section 6), Gamepad + Touch + Motion providers, device-switch UI | Same 5 levels fully playable on at least 3 distinct input methods |
| **3. Special block mechanics** (2 wk) | `IBlockBehaviour` system (Section 7): breakable, timed, gravity-inverter, linked seesaw | 10–15 levels exercising each block type at least twice |
| **4. Visual & audio production** (3–4 wk, parallelizable with 1–3) | Art direction execution (Section 8), URP setup, 2–3 world themes fully realized | One world (≈25 levels) at final visual quality |
| **5. Meta systems & content scale-up** (2–3 wk) | World/level select UI, `SaveSystem`, scoring/star UI, content scaled to target world/level count | Full 8-world/200-level structure (or your chosen scope) navigable and saved |
| **6. Game modes** (2–3 wk) | `IGameMode` architecture (Section 12.2) — Arcade/Endurance/Infinity/Swift Stacker/Tower Tumble, local split-screen | All 5 modes selectable and completable, 2–4 player local multiplayer working |
| **7. Platform-specific deep-dive features** (ongoing, per target) | Achievements abstraction, localization, platform save services, docked/handheld quality tiers — pick from Sections 10–12 per your actual release targets | Each targeted platform's checklist (see deep-dive sections) passes |
| **8. Polish, accessibility, QA** (2–4 wk) | Accessibility pass (Section 13.3), performance profiling per tier (Section 13.2), bug bash, playtesting | Meets Section 13.2 budgets on lowest target tier; accessibility checklist complete |

---

## 10. Deep Dive — Wii U Edition (2013, the "definitive" pre-Switch version)

### 10.1 Tri-control scheme

The Wii U release's headline feature was letting players pick motion (Wii Remote pointed at the TV), GamePad touch, or L-stick+button controls — freely, without a settings menu — and this maps almost exactly onto Section 6's `PieceInputRouter`:

- **Motion "pointer" parity:** a PC/console equivalent isn't a literal IR pointer, but the *design intent* — direct spatial aiming rather than incremental stick nudges — is best matched by our `MotionGyroInputProvider` (mobile tilt) or, on desktop, treating mouse position as an absolute aim ray into the scene (raycast onto the stage plane) rather than a relative delta. Add a `PointerAimInputProvider : IPieceInputProvider` using `Vector3? GetAimPoint()` semantics for this — it's a genuinely different interaction model from delta-based movement, not just a rebinding.
- **Touch parity:** `TouchInputProvider` (Section 6.3) already covers this directly.
- **Buttons parity:** `KeyboardMouseInputProvider`/`GamepadInputProvider` already cover this.
- **Implementation note:** because all three write into the same `IPieceInputProvider` contract, "let the player switch control scheme mid-session with no menu" is just `PieceInputRouter.SetActive(...)` firing on device-change events (Section 6.4) — this was a standout UX feature of the original and costs us almost nothing extra given the architecture.

### 10.2 Asymmetric local + online multiplayer

Documented: up to 5 local players (1 on GamePad + 4 on Wii Remotes) in one room, and up to 10 players across two consoles online, with leaderboards.

- **Local (up to 4, realistically, on modern hardware without a second-screen GamePad equivalent):** Unity's Input System supports multiple simultaneous local players natively via `PlayerInputManager`, auto-assigning each connected gamepad/keyboard-half to its own `PlayerInput` + camera viewport (`Camera.rect` split-screen). This directly implements Section 12.5's Switch local multiplayer too — same system, reused.
- **Online:** implement via Netcode for GameObjects with a relay/dedicated-server host. Treat the original's "10 across 2 consoles" as a specific hardware-era workaround (each Wii U hosting up to 5 local + syncing to the other) — the *modern* equivalent goal is simply "support N remote players in Swift Stacker/Tower Tumble lobbies," which decouples cleanly from any specific console-pairing scheme.
- **Leaderboards:** abstract behind an `ILeaderboardService`, same pattern as `IAchievementService` (Section 11.3) — swap Steamworks/PSN/Nintendo NEX implementations per target platform.

### 10.3 Swift Stacker mode

Two teams race to solve the *same* puzzle fastest.

```csharp
namespace BalanceGrove.Modes
{
    public class SwiftStackerMode : IGameMode
    {
        // Both teams load an identical LevelDefinition into separate
        // LevelManager instances (split-screen). First LevelManager to
        // fire OnLevelWon reports its team as winner; the losing side's
        // LevelManager is force-stopped. Timer differential (not raw
        // completion) is the display stat, matching "solve fastest."
    }
}
```

Because `LevelManager` (Section 5.3) already only depends on a `LevelDefinition` and doesn't assume single-player, running two instances side by side needs no core-system changes — just a mode-level orchestrator and a split-screen camera rig.

### 10.4 Tower Tumble mode

"Reverse Jenga" — players take turns *adding* to a shared tower; whoever's placement collapses it loses the point.

```csharp
namespace BalanceGrove.Modes
{
    public class TowerTumbleMode : IGameMode
    {
        // Turn-based wrapper around the same PieceQueueController/
        // PieceController pipeline, except:
        //  - the "queue" is shared and turn order round-robins players
        //  - there is no win-by-stability timer; instead, StabilityMonitor
        //    is repurposed to fire "OnHazardTouched" as an immediate
        //    round-loss for whoever's turn it was
        //  - score is tracked per-player, incremented on opponents'
        //    collapse, up to a configurable point target
    }
}
```

Reusing `StabilityMonitor`'s existing hazard-touch event for a completely different win condition (round-loss instead of level-fail) is the payoff of keeping that system's public contract narrow (Section 5.5) — modes consume its events, they don't need to know its internals.

### 10.5 High-substep physics ("240fps" stacking precision)

Unity's render framerate and physics update rate are decoupled by design. To get Wii-U-review-matching stacking precision without forcing the whole game to run its main loop at 240Hz:

```csharp
// One-time setup, e.g. in a bootstrap MonoBehaviour:
Physics.simulationMode = SimulationMode.Script;

// In a fixed-cadence driver (e.g. FixedUpdate at the default 50Hz):
private void FixedUpdate()
{
    const int substeps = 4; // 50Hz * 4 = effective 200Hz solve rate
    float subDt = Time.fixedDeltaTime / substeps;
    for (int i = 0; i < substeps; i++)
        Physics.Simulate(subDt);
}
```

Combined with the raised `solverIterations`/`solverVelocityIterations` already set per-piece (Section 5.4), this gets stacking precision well into the range reviewers described, without any gameplay-visible framerate coupling. Profile this — substepping is the first thing to dial back on low-end targets (Section 13.2) since it directly multiplies physics CPU cost.

### 10.6 Wii U feature checklist

- [ ] `PointerAimInputProvider` (absolute aim) alongside existing delta-based providers
- [ ] Mid-session control-scheme switching with no menu (device-change driven)
- [ ] Local multiplayer via `PlayerInputManager`, split-screen up to 4
- [ ] `SwiftStackerMode`, `TowerTumbleMode`
- [ ] `ILeaderboardService` abstraction
- [ ] Physics substepping tuned to target hardware

---

## 11. Deep Dive — PlayStation Edition (PS4, 2016)

### 11.1 Arcade & Infinity modes

- **Arcade** is our existing core loop (Section 3) essentially as-is — the standard level-by-level campaign.
- **Infinity mode** ("the blocks don't stop, build the highest possible stack") is a direct variant:

```csharp
namespace BalanceGrove.Modes
{
    public class InfinityMode : IGameMode
    {
        // PieceQueueController's finite List<PieceDefinition> is replaced
        // by an endless generator: PieceDefinition Next() picks randomly
        // (optionally weighted, harder shapes more likely as height grows)
        // from the current world's piece pool. There is no OnQueueExhausted
        // event — StabilityMonitor's "final watch" never arms; instead the
        // run ends only on OnHazardTouched, and the score is current stack
        // height at that moment.
    }
}
```

### 11.2 DualShock/DualSense control mapping

No new architecture — the existing `GamepadInputProvider` (Section 6.3) is built on Input System's generic `Gamepad` device class, which already targets DualShock 4/DualSense on PC and PlayStation alike. Platform-specific extras (adaptive triggers, haptic rumble on wobble) are additive, not required: wire `Gamepad.current.SetMotorSpeeds()` (generic rumble, cross-platform) to the same tilt-angle metric already computed in `StabilityMonitor` (Section 5.5) for a "controller shudders as the stack destabilizes" feel — cheap, and reuses data you're already tracking.

### 11.3 Trophies / achievements

```csharp
namespace BalanceGrove.Services
{
    public interface IAchievementService
    {
        void Unlock(string achievementId);
        void ReportProgress(string achievementId, float percent);
    }

    // Swapped at bootstrap via a platform-detection factory:
    // PS -> PlayStationAchievementService (PS SDK trophy calls)
    // Steam -> SteamAchievementService (Steamworks.NET)
    // Switch -> NintendoAchievementService (or no-op, if unsupported)
    // Editor/dev -> NoOpAchievementService
}
```

Hook calls into existing events you already have: `LevelManager.OnLevelWon` for completion-count trophies, `ScoreCalculator`'s 3-star result for "clean stack" trophies, `InfinityMode`'s height record for high-score trophies.

### 11.4 Localization pipeline

The PS4 release shipped English/German/French/Spanish. Use the Localization package (`com.unity.localization`, Section 4.1): a `String Table Collection` per UI text asset, `Locale Selector` driven by platform system language at boot with an in-game override. Because Shin'en's own confirmed language set is only 4 languages, treat that as your minimum viable localization scope — expanding further is easy with this package but not necessary to match the original's documented scope.

### 11.5 PlayStation feature checklist

- [ ] `InfinityMode`
- [ ] `IAchievementService` + platform implementation
- [ ] Localization package wired for EN/DE/FR/ES minimum
- [ ] Generic rumble tied to stability tilt metric

---

## 12. Deep Dive — Nintendo Switch Edition (2018)

### 12.1 8-world / 200-level content structure

This is a direct, no-translation-needed use of the `WorldDefinition` → `LevelDefinition` hierarchy already specified in Section 5.1 — it was designed with exactly this structure in mind. Content planning implication: 200 levels ÷ 8 worlds ≈ 25 levels/world, which is also a reasonable difficulty-curve unit (Section 3.2's "smooth gradual increase" applies *within* a world, with a slight reset/reintroduction at each new world's start, matching how the per-world theme also serves as a difficulty-tier signpost to the player).

### 12.2 Five-mode architecture

```csharp
namespace BalanceGrove.Modes
{
    public interface IGameMode
    {
        void Configure(LevelManager levelManager);
        void Begin();
    }
}
```

| Mode | Documented behavior | Maps to |
|---|---|---|
| Arcade | Standard level campaign | Section 3 core loop, unmodified |
| Endurance | "Never-ending string of puzzles," ends after 3 total fails (Cubed3) | New `EnduranceMode : IGameMode` wrapping repeated `LevelManager.LoadLevel` calls from a shuffled pool, tracking a fail counter that ends the run at 3 |
| Infinity | Endless single stack, highest score | Section 11.1 `InfinityMode` |
| Swift Stacker | Versus race | Section 10.3 `SwiftStackerMode` |
| Tower Tumble | Shared-tower elimination | Section 10.4 `TowerTumbleMode` |

All five share the same `LevelManager`/`PieceQueueController`/`StabilityMonitor` core — the entire "5 modes" feature is mode-orchestration logic on top of one gameplay core, not five separate gameplay implementations. This is the payoff of Section 5's system boundaries: modes are consumers of core systems' public events, never forks of their internals.

### 12.3 Docked/handheld adaptive performance

Switch-style hybrid hardware (and, more broadly, "the same build must hit very different performance tiers") maps to:

- Multiple `UniversalRenderPipelineAsset` quality tiers (Section 8.2), selected at runtime by a simple power-state/platform check, not hardcoded per-platform build variants.
- Dynamic resolution scaling via URP's built-in support, targeting a fixed frame-time budget (Section 13.2) rather than a fixed resolution.
- Physics substep count (Section 10.5) as the first dial turned down on the lower tier — it's pure CPU cost with a direct, easily-tuned quality/performance tradeoff, and stacking precision needs matter less on a mode you're likely to be playing more casually in handheld.

### 12.4 Case study: the v1.01 motion-control patch

Shin'en shipped Switch Art of Balance *without* motion controls at launch and added them in a post-launch patch. This is worth building out explicitly as a worked example of why Section 2's "multi-platform input from day one" pillar pays for itself:

Because every gameplay system already talks to `IPieceInputProvider` and nothing else, adding motion controls post-launch in our architecture means:
1. Write `MotionGyroInputProvider` (Section 6.3) — the only genuinely new code.
2. Add it to `PieceInputRouter`'s device-detection switch (Section 6.4).
3. Add one settings-menu entry and one control-prompt icon set (Section 6.4/8.5).

No changes to `PieceController`, `LevelManager`, `StabilityMonitor`, or any mode class — because none of them ever depended on *how* input arrived, only on the `IPieceInputProvider` contract. If your team is scoping a real v1.0 launch without motion controls, this section is your evidence that deferring it is genuinely low-risk *given* the Section 6 architecture is in place first — deferring it *without* that abstraction built in advance is the trap (retrofitting a new control paradigm onto code that assumed mouse-delta-shaped input everywhere).

### 12.5 Local wireless multiplayer (up to 4)

Same `PlayerInputManager`-based system specified in Section 10.2 — Switch's "local wireless" is a transport-layer detail (handled by the platform's networking layer under Netcode for GameObjects, or a platform-specific local-session API), not a gameplay-architecture difference. Build once against the abstraction in Sections 10.2/10.3.

### 12.6 Switch feature checklist

- [ ] `WorldDefinition` content scaled to 8 worlds × ~25 levels
- [ ] `EnduranceMode` (3-fail run) alongside the other four `IGameMode`s
- [ ] Docked/handheld quality-tier switching + dynamic resolution
- [ ] `MotionGyroInputProvider` (can ship post-launch by design, per 12.4)
- [ ] Local wireless multiplayer via `PlayerInputManager`

---

## 13. Cross-Cutting Concerns

### 13.1 Save data & cloud sync across platforms

`ISaveService` (Section 5.8) is the seam. `LocalJsonSaveService` is the dev/offline default; production platform builds swap in `SteamCloudSaveService`, `PsnSaveDataService`, or a Nintendo save-data wrapper behind the same interface, chosen at bootstrap by the same platform-detection factory pattern as `IAchievementService` (Section 11.3). Keep `PlayerProfile` a plain serializable POCO (already true in Section 5.8) so every backend just needs bytes-in/bytes-out.

### 13.2 Performance budgets per tier

| Tier | Target | Frame budget | Notes |
|---|---|---|---|
| PC (primary dev target) | 1080p+ | Uncapped, aim 60fps+ | Full physics substeps (Section 10.5), highest URP quality tier |
| Switch-like / low-power docked | 1080p | 60fps (16.6ms) | Reduced substeps, dynamic resolution enabled |
| Switch-like / handheld | 720p | 30fps (33.3ms) | Lowest URP tier, substeps reduced further, simplified post-processing |
| Mobile-like touch | 1080p | 60fps (16.6ms) | Mirrors handheld budget; touch input already covered (Section 6.3) |

Physics body count per level is the dominant cost driver for this genre specifically — budget levels to roughly 15–25 active `Rigidbody` pieces at once; beyond that, solver cost (Section 5.4's raised iteration counts) starts to dominate frame time on the low tier first.

### 13.3 Accessibility

- **Never encode information in color alone.** Special block types (Section 7) should pair their color-coding with a distinct silhouette/icon/pattern — a straightforward, low-cost win given we're already doing original asset design (Section 8.1) rather than matching a fixed reference palette.
- **Fully remappable controls** — free given the Input System abstraction (Section 6) already isolates bindings from gameplay logic.
- **Assist options:** an extended stability-hold duration (Section 3.3's 3.0s is a `LevelDefinition` field, already data-driven and easy to expose as a difficulty toggle) and an optional slow-motion drop (scale `Time.timeScale` locally during the fall phase only) for players who want more reaction time to judge placement.

### 13.4 Testing strategy

- **Physics determinism tests** (Unity Test Framework, Play Mode): load a fixed `LevelDefinition` with a scripted input sequence, assert the level resolves win/fail consistently across repeated runs. PhysX is not bit-exact deterministic across platforms/frame-timing — treat these as tolerance-banded regression tests (e.g., "wins in ≥95% of 100 runs"), not strict equality checks, and design levels with enough stability margin that they aren't flaky by construction.
- **Level solvability smoke test:** an editor tool that runs each `LevelDefinition`'s piece queue through a naive "drop straight down, no rotation" placement as a lower-bound sanity check — not a real solver, just a fast way to catch obviously-broken level data (e.g., a stage prefab with a missing `WaterHazardVolume`) before a human playtester wastes time on it.
- **Manual playtesting loop** remains essential for the actual puzzle-design quality (par times, clean-stack thresholds, difficulty curve) — none of the above substitutes for it.

---

## 14. Risk Register & Open Questions

| Risk / open question | Why it matters | Mitigation |
|---|---|---|
| Exact original scoring/star formula is undocumented | Section 3.4's design is original, not verified against the source game | Low risk — it's your game; playtest and tune the thresholds rather than treating them as fixed |
| Gravity-inverter trigger condition is inferred, not confirmed | Section 7's "activates on settle after placement" is a design ruling | Low risk for the same reason; revisit if playtesting shows a more intuitive trigger (e.g., on any contact) |
| PhysX stacking stability at scale (many simultaneous bodies) is the single biggest technical risk in this genre | A wobbly-feeling stack undermines the entire game | Mitigate early — Phase 0 (Section 9) exists specifically to de-risk this before content production begins; the solver-iteration and substepping settings (Sections 5.4, 10.5) are your primary tuning levers |
| Trademark/IP exposure if visuals or the name drift too close to the original | Could block release or invite a takedown | Already addressed structurally — Section 2 pillar #1 and the working-title callout at the top of this document; keep it that way through production, not just at kickoff |
| Scope: this plan covers WiiWare + Wii U + PS4 + Switch feature parity; it does not cover the 3DS *TOUCH!* release in depth (mentioned only in Section 1 for lineage) since it wasn't in the requested scope | Avoids silent scope creep, per this workspace's "no silent re-scoping" convention | If 3DS-era specifics become relevant later, they're a small addition: `TouchInputProvider` (Section 6.3) already covers its control scheme |
| Netcode for online modes (Sections 10.2, 12.5) is scoped architecturally but not specified in implementation depth | Online multiplayer is a substantial project in its own right | Treat as its own follow-up spec once local multiplayer (Phase 6) is solid — flagged here rather than hand-waved into the phased roadmap |

---

## 15. Appendix

### 15.1 Full source list

- [Wikipedia — Art of Balance](https://en.wikipedia.org/wiki/Art_of_Balance)
- [Nintendo Life — WiiWare review (2010)](https://www.nintendolife.com/reviews/2010/02/art_of_balance)
- [Nintendo Life — Wii U eShop review](https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance)
- [Nintendo Life — Wii U eShop game page](https://www.nintendolife.com/games/wiiu-eshop/art_of_balance)
- [Nintendo Life — Shin'en Wii U eShop announcement](https://www.nintendolife.com/news/2014/02/exclusive_shinen_multimedia_bringing_art_of_balance_to_the_wii_u_eshop)
- [Nintendo Life — Switch eShop game page](https://www.nintendolife.com/games/switch-eshop/art_of_balance)
- [Cubed3 — Wii U review](https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2)
- [Cubed3 — Switch review](https://www.cubed3.com/review/5290/1/art-of-balance-nintendo-switch.html)
- [Metacritic — Art of Balance TOUCH!](https://www.metacritic.com/game/art-of-balance-touch/)
- [Switch Player — review](https://switchplayer.net/2018/10/26/art-of-balance-review/)
- [Shin'en — official WiiWare video page](https://artofbalance.shinen.com/wii/video.php)
- [Nintendo World Report — Wii U review](http://www.nintendoworldreport.com/review/38619/art-of-balance-wii-u-review)
- [Nintendo UK — Wii U store listing](https://www.nintendo.com/en-gb/Games/Wii-U-download-software/Art-of-Balance-918559.html)
- [Nintendo Everything — Wii U eShop announcement](https://nintendoeverything.com/shinen-releasing-art-of-balance-on-the-wii-u-eshop)
- [Nintendo Everything — Switch v1.01 patch](https://nintendoeverything.com/art-of-balance-switch-update-out-now-version-1-01-more-art-of-balance-news-next-week/)
- [Nintenpedia — Wii U review](https://nintenpedia.com/art-of-balance-review/)
- [GameFAQs — PS4 release data](https://gamefaqs.gamespot.com/ps4/190945-art-of-balance/data)
- [GameFAQs — Wii U user review discussing block mechanics](https://gamefaqs.gamespot.com/wii-u/842577-art-of-balance/reviews/164850)
- [PlayStation Store — product listing](https://store.playstation.com/en-us/product/UP4496-CUSA01465_00-ARTOFBALANCE0000)
- [Bonus Stage — PS4 review](https://www.bonusstage.co.uk/archives/69313)
- [Nintendo.com — Switch store listing](https://www.nintendo.com/us/store/products/art-of-balance-switch/)
- [Gematsu — Switch announcement](https://www.gematsu.com/2018/09/physics-based-puzzle-game-art-of-balance-coming-to-switch-on-october-4)
- [GameCritics — Wii U review ("gravity-inverting blocks")](https://gamecritics.com/michael-hughes/art-of-balance-review/)
- [The Game Hoard — Wii U retrospective](https://thegamehoard.com/2023/03/14/art-of-balance-wii-u/)
- [Unity Manual — What's New in Unity 6.6](https://docs.unity3d.com/6000.6/Documentation/Manual/WhatsNewUnity66.html)
- [Unity — 6000.6.0f1 release notes](https://unity.com/releases/editor/whats-new/6000.6.0f1)
- [Makaka — Unity version comparison (6.6 vs. 6.3 LTS), 2026](https://makaka.org/unity-tutorials/best-version)

### 15.2 Glossary

- **Held piece** — the currently player-controlled, kinematic (not-yet-dropped) piece.
- **Placed piece** — a piece that has been dropped and is physics-driven; only placed pieces can trigger a fail or count toward the stability hold.
- **Settle / sleeping** — Unity's `Rigidbody.IsSleeping()` state; a piece whose linear/angular velocity has stayed below threshold long enough for PhysX to stop actively simulating it.
- **Clean stack** — a completed stack whose maximum recorded tilt angle stayed under the level's threshold (Section 3.4); drives the 3-star condition.
- **Provider** (input) — a concrete `IPieceInputProvider` implementation for one device family (Section 6).
- **Mode** — an `IGameMode` implementation configuring how `LevelManager`/`PieceQueueController` are driven (Sections 10–12).

---

*Document prepared for a from-scratch Unity 6.6 project. All gameplay facts about the commercial *Art of Balance* series are cited inline to their source; all original design (scoring formula, undocumented trigger conditions, the "Balance Grove" working title, and every line of C#) is this plan's own contribution, not a reproduction of Shin'en Multimedia's game.*
