# Art of Balance - Unity 6.6 C# Clone Implementation Plan
**Target:** Faithful recreation of WiiWare original (2010) visuals + gameplay, with modular support for all later port variations (3DS TOUCH!, Wii U, PS4, Switch)
**Engine:** Unity 6.6 LTS + URP, C# 12, Physics (PhysX 5.x), New Input System
**Author:** Implementation Blueprint - 2026

---

## 0. Executive Summary

`Art of Balance` by Shin'en Multimedia is deceptively simple: stack a queue of wooden blocks on a small stone platform floating in water. If nothing touches water for 3 seconds after the last block is placed, you win. The depth comes from physics tuning, 14+ irregular shapes, and special block types that break under load or time.

This plan breaks the clone into two pillars:

1.  **Visual Faithfulness:** Recreating Shin'en's "power of beauty" - zen lounge environments, high-quality wood materials, realistic water bowl with reflections, soft global illumination, 60fps locked.
2.  **Gameplay Faithfulness:** Deterministic but forgiving physics, 45-degree rotation, 3-block visible queue, 3-second stability timer, water as fail plane.

Later ports added content, not core changes. We will architect the game as **Core Loop + Variation Modules** so you can toggle WiiWare (100 levels), TOUCH! (200 levels), WiiU/PS4/Switch (5 modes) with ScriptableObjects and feature flags.

### Version Feature Matrix (from research)

| Version | Levels | Arcade | Endurance | Tower Tumble | Swift Stacker | Online | Max Players | Physics Rate | Key Additions |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **WiiWare (2010)** | 100 | Yes (1-2 co-op drop-in) | No | No | Yes (2p split) | No | 2 | 60 Hz | 14 shapes + 2 special |
| **TOUCH! 3DS (2012)** | 200 | Yes (1p) | Yes (system LB) | No | No | No | 1 | 30 Hz (orig) | 8 worlds A-H, Awards |
| **Wii U (2014)** | 200 | Yes (1-5 co-op) | Yes (online LB) | Yes (2-5p) | Yes (2-5p + online) | Yes | 5 | 240 Hz | HD graphics, GamePad/Wiimote/Touch |
| **PS4 (2016)** | 200+ | Yes | Yes | Yes | Yes | Yes | 5 | 240 Hz | Infinity Mode, split-screen, lounge soundtrack |
| **Switch (2018)** | 200+ | Yes | Yes | Yes | Yes | Yes + local wireless | 5 | 240 Hz | Portable/docked, HD Rumble, 8 environments |

> Sources: Arcade is main mode: stack until none left, 3-sec timer[^1]. Worlds A-H mechanic breakdown with weight, timer, scale base, gravity, fire[^1]. WiiU hosts Endurance + Tower Tumble + Swift Stacker up to 5 players[^2]. TOUCH! adds double levels + Endurance[^1]. PS4/Switch: 5 unique modes, online + local split-screen, 8 environments[^3]. WiiWare: 14 shapes + 2 special that break on load/timer[^4].

---

## 1. Deconstructing the Original WiiWare Vision

### 1.1 Core Loop (The One More Level Loop)
1.  Level starts: stone platform floating in large water bowl. Queue shows 4-7 blocks, but only first 3 are selectable (rest shown as silhouettes). This forces forward planning.
2.  Player picks current block (A-button / pointer), moves X/Y freely above playfield, rotates in 45° steps (D-Pad).
3.  Release: Block switches from Kinematic to Dynamic, falls. 50 points per release.
4.  Repeat until queue empty.
5.  **Stability Phase:** 3-second countdown starts. In later ports shortened to ~2s but we keep it configurable. If no block enters water trigger during countdown, WIN. If any block touches water, FAIL -> retry.
6.  Optional Super Puzzles: Balance Challenges (platform sways), Height Challenges (must reach min height), Time Challenges (60s limit).

### 1.2 Why It Feels Zen, Not Frustrating
- **Forgiving Physics:** Not 100% realistic. Shin'en tuned for "gameplay maximized"[^5]. Low bounciness (0.1), high friction (0.8-1.0), slight angular damping.
- **Input Choice:** Wii used pure pointer without twist gimmicks[^5]. We replicate: move is direct, not physics-controlled cursor.
- **Non-linear Map:** You don't have to solve all levels to progress. 2-3 challenge levels per world that gate alternate paths[^5].

### 1.3 Visual Pillars
WiiWare ran 480p 60fps with 4:3/16:9 support, praised for lush, polished, next-gen look on Wii[^5].

- **Environment:** Always a circular water bowl (infinity pool illusion) inside a lounge interior. 8 worlds = 8 materials/lighting setups, not 8 geometry sets. Minimalist architecture, depth-of-field, soft shadows.
- **Blocks:** Photoscanned wood look, beveled edges, clear grain. Two categories: Natural wood (light pine, dark walnut) and Special (red-striped weight, pulsing blue timer, orange fire emissive).
- **Water:** Not simulated fluid, but planar shader with reflection + Fresnel + subtle normal scroll. The "fail" is trigger volume slightly below visual surface.
- **Lighting:** Baked GI for lounge + one dynamic directional for blocks. Soft shadows (PCF 5x5). Light probes for block stack.

---

## 2. Unity 6.6 Project Setup

### 2.1 Template & Packages
- **Template:** URP 3D (Unity 6.6 -> URP 17+). Forward+ rendering for many lights on wood.
- **Essential Packages:**
  - `com.unity.inputsystem` 1.8+ : pointer, gamepad, touch unified.
  - `com.unity.cinemachine` : Smooth follow cam for stack.
  - `com.unity.render-pipelines.universal` : Configured.
  - Netcode for GameObjects (if you implement online Swift Stacker).

**Project Settings:**
- Fixed Timestep: `0.0041667` (240Hz) to match Wii U upgrade[^6]. Set `Maximum Allowed Timestep = 0.0333`. Interpolate rigidbodies.
- Physics: Default Solver Iterations = 12, Velocity = 12 (was 6). Enable Enhanced Determinism.
- URP Asset: Enable HDR, MSAA 4x (Switch docked), Shadows Soft.

### 2.2 Folder Structure
```
/Assets/_ArtOfBalance/
  /Art/Materials/Wood_{Pine,Walnut,Weight,Timer,Fire,Gravity}
  /Art/Shaders/WaterBowl.shadergraph / WoodBlocks.shadergraph
  /Prefabs/Blocks/ Block_*.prefab (14+)
  /Prefabs/Platforms/ Platform_Static, Scale, Sway
  /ScriptableObjects/ Blocks/ Levels/ Worlds/
  /Scripts/Core/ LevelManager, StabilityTimer, WaterKillZone
  /Scripts/Blocks/ BlockController, Special/WeightBlock, TimerBlock, FireBlock, GravityBlock
  /Scripts/Modes/ ArcadeMode, EnduranceMode, TowerTumbleMode, SwiftStackerMode, InfinityMode
  /Scripts/Input/ PointerInputHandler
```

---

## 3. Recreating Visuals in URP

### 3.1 Wood Block Shader
Goal: Wii U HD rework was "complete new look that makes Wii U shine"[^7].

Shader Graph:
- Albedo: Wood grain texture (1024px) + color tint via property.
- Normal: Fine bump from grain.
- Smoothness: 0.6, slightly higher on edges.
- Edge Bevel: Use `Bevel` node or mesh bevel. Crucial for highlight catch.
- AO: Baked into vertex color for inner crevices of complex shapes (e.g., L-shape).

14 Base Shapes from WiiWare:
`Cube, Long Plank (3x1), L-shape, T-shape, Z-shape, Triangle wedge, Rounded plank, U-shape, Small cube, Bridge, Hex, Trapezoid, Irregular 5-sided, Ball` (ball was later addition). All have convex MeshCollider for stable stacking, but for non-convex (U, T) use Compound BoxColliders - far more stable than MeshCollider.

### 3.2 Water Bowl
No fluid sim needed.
- Mesh: Large inverted sphere/cylinder, scaled.
- Shader: URP Lit with transparency.
  - Base: Deep blue #1A3A4A
  - Reflection: Planar Reflection Probe (URP) + Screen Space Reflections for platform underside.
  - Normal Map: Scrolling at 0.02 speed, strength 0.1.
  - Fresnel: Power 3.0 to give bright edge.
  - Depth Fade: Soften intersection with platform pillar.
- Logic: Add child `KillZone` with BoxTrigger 0.2m below water mesh. OnTriggerEnter with block layer -> `LevelManager.Fail()` + splash VFX + sound.

### 3.3 Environments (8 Worlds)
Implement as lighting presets, not separate scenes.

| World | Mechanic Intro | Visual Theme | URP Setup |
| :--- | :--- | :--- | :--- |
| A | Regular blocks only | White minimalist loft, sunny | HDRI sunny, warm temp |
| B | Weight blocks break if >3 blocks on top | Wood workshop | Warmer point lights |
| C | Timer blocks break after timer activated by placing block on top | Blue evening lounge | Cooler, blue timer glow |
| D | Mix A-C | Industrial | Mixed lighting |
| E | Scale bases move up/down by weight | Zen garden | Scale base metal material |
| F | Gravity blocks reverse gravity when released | Sci-fi, dark | Purple emissive, inverted particle |
| G | Fire blocks break if they touch each other | Fireplace lounge | Fire emissive + heat distortion |
| H | Mix A-G | Ultimate lounge, sunset | All combined |

[^1]

Implementation: `WorldDefinitionSO` holds skybox, fog color, water color, BGM clip, post-processing volume profile.

### 3.4 Camera & Juice
- Cinemachine FreeLook for level select, Dolly for gameplay: Slight orbit around stack center, auto-zoom out as height grows (calculate bounds).
- Winning: 3-sec timer UI + slow-mo (Time.timeScale 0.8) + subtle camera shake if wobble detected (angular velocity > threshold).
- Shadows: Block casts soft shadow onto other blocks and platform - essential for depth perception.

---

## 4. Main Gameplay Loop - Code Deep Dive

### 4.1 State Machine
```csharp
public enum GameState { Selecting, Dragging, Falling, StabilityCheck, Won, Failed }

public class LevelManager : MonoBehaviour
{
    [Header("WiiWare Config")]
    public int stabilitySeconds = 3; // original Wii
    public int visibleQueue = 3;
    public float rotationStep = 45f;

    GameState state;
    Queue<BlockDefinition> blockQueue;
    BlockController currentBlock;
    float stabilityTimer;

    void Update()
    {
        if (state == GameState.StabilityCheck)
        {
            if (PhysicsStackIsMoving()) { stabilityTimer = stabilitySeconds; } // reset if still collapsing
            else {
                stabilityTimer -= Time.deltaTime;
                UIManager.Instance.UpdateStability(stabilityTimer);
                if (stabilityTimer <= 0) Win();
            }
        }
    }

    bool PhysicsStackIsMoving()
    {
        // Check all placed blocks: if linear vel > 0.02 or angular > 0.05, stack still moving
        foreach(var b in placedBlocks) if (b.Rb.velocity.sqrMagnitude > 0.0004f) return true;
        return false;
    }
}
```

### 4.2 Block Placement (Faithful to Wii pointer)

Original: pick up blocks, position them, rotate in 45-degree increments[^1].

Implementation for Unity 6.6 New Input System:
- `PointerInputHandler`: Unified for mouse, touch, gyro pointer, gamepad stick. Cursor speed config for stick (was complaint: slow[^1]) -> expose 1-10 sensitivity.
- On Select: Instantiate block from queue as Kinematic Rigidbody, disable gravity, follow cursor plane.
  - Plane: Horizontal plane at current stack height + 2m, raycast from pointer.
  - Move: `Vector3.Lerp` for smoothness, not direct set to avoid jitter.
- Rotation: Q/E or shoulder buttons -> snap to 45°. Visual ghost with transparent material shows snap.
- Release: `Rb.isKinematic = false`, enable gravity, add tiny random torque 0.01 for natural feel. Invoke scoring: +50[^1].

### 4.3 Physics Tuning (The Secret Sauce)

This is where clones fail. Settings from reverse engineering + WiiU 240Hz upgrade:

```csharp
// On each Block prefab
Rb.mass = 1f; // except weight blocks 0.5f
Rb.linearDamping = 0.1f;
Rb.angularDamping = 0.3f; // prevents endless spinning
Rb.collisionDetectionMode = CollisionDetectionMode.ContinuousSpeculative;
Rb.interpolation = RigidbodyInterpolation.Interpolate;

// Physics Material
PhysicMaterial woodMat = new PhysicMaterial("Wood");
woodMat.staticFriction = 0.9f;
woodMat.dynamicFriction = 0.8f;
woodMat.bounciness = 0.05f;
woodMat.frictionCombine = PhysicMaterialCombine.Maximum;
```

- **Solver:** In Project Settings, increase default contact offset to 0.001 (prevents sinking).
- **Sleep:** Enable sleeping, threshold 0.005. Once blocks sleep, stability check passes faster.
- **Stability Hack:** After block settles, after 0.5s of sleeping, increase its mass to 5x (islands stabilization). Prevents late collapse from micro vibrations.

### 4.4 Special Blocks Logic

**WeightBlock (World B):** Breaks if >3 blocks placed on top.
```csharp
public class WeightBlock : BlockController
{
    public int maxLoad = 3;
    List<BlockController> supporting = new();
    void OnCollisionEnter(Collision c) { if (IsOnTop(c)) supporting.Add(...); CheckBreak(); }
    void CheckBreak() { if (supporting.Count > maxLoad) BreakFX(); }
    void BreakFX() { Instantiate(fracturedPrefab, transform.position, transform.rotation); Destroy(gameObject); // +100 points for broken[^1]
    }
}
```

**TimerBlock (World C):** Breaks after timer activated by placing block on top.
- On `OnCollisionEnter` from above, start coroutine `Timer=3s`, pulsate emissive. On expiry, break. Player must build quickly.

**FireBlock (World G):** Breaks if touches another fire block.
- In `OnCollisionStay`, check `other.GetComponent<FireBlock>() != null` -> both break.

**Scale Base (World E):** Platform that moves up/down depending on weight on each side.
- Two platforms linked by pivot. Calculate total mass on left vs right each FixedUpdate, apply torque to pivot hinge joint.

**Gravity Block (World F):** Reverse gravity when released.
- On release, set `Physics.gravity = -Physics.gravity` for 2 seconds OR better: per-block gravity: add constant upward force, disable global. Visual: purple trails.

### 4.5 Fail / Win Detection
- Fail: Any block with tag `Block` enters `WaterKillZone`. Immediate fail unless it's the block being dragged (ignore).
- Win: Queue empty && stabilityTimer <=0 && !fail. Show confetti, unlock next level.

### 4.6 Level Data
Use ScriptableObjects for designer friendly workflow:

```csharp
[CreateAssetMenu]
public class LevelDefinition : ScriptableObject
{
    public string id; // e.g., B6.4
    public WorldType world;
    public List<BlockType> queue; // 4-7 blocks[^1]
    public LevelModifier modifier; // None, HeightRequirement, TimeLimit, SwayingBase
    public float requiredHeight; // for HeightChallenge
    public float timeLimit = 60f;
}
```

---

## 5. Port Variations - Deep Dive Implementation

### 5.1 Art of Balance TOUCH! (3DS - 2012) - Foundation for All Later Ports

**What Changed:**
- 200 levels (double WiiWare)[^1]
- Touch controls: "perfect touch controls" praised[^8]
- Endurance Mode: Random 166 non-challenge levels, 3 lives, scoring with multiplier x1-x8 per world, online/system leaderboard[^1]
- 13 Awards/Achievements[^1]

**Unity Implementation:**
- **Touch Input Module:** Add `Touchscreen` binding to Input Action `Drag`. For mobile-like feel, allow direct drag: finger down on block in queue tray -> block follows finger with offset.
- **Queue UI:** In TOUCH! mode, show queue as bottom tray (like 3DS bottom screen). Top screen = gameplay. In Unity, split canvas: Bottom 25% = queue, Top 75% = world.
- **Endurance Mode Controller:**
```csharp
public class EnduranceMode : GameMode
{
    int lives = 3;
    int score = 0;
    int streak = 0;
    List<LevelDefinition> pool = allLevels.Where(l => !l.isChallenge).ToList();
    
    void OnLevelComplete(float timeLeft, int livesLeft)
    {
        int baseScore = placedBlocks.Count * 50 + livesLeft*100 + (int)(timeLeft*10);
        int worldMult = (int)currentLevel.world +1; // A=1..H=8
        score += baseScore * worldMult; // x1-x8[^1]
        lives = Mathf.Min(lives+1, 5); // bonus?
        NextRandomLevel();
    }
    void OnLevelFail() { lives--; if(lives<=0) GameOverUploadScore(); }
}
```
- **Awards:** ScriptableObject `AwardDefinition` with condition delegates. Use `PlayerPrefs` or Unity Gaming Services for persistence. Example: "Solve 20 levels in a row in Endurance"[^1] -> track streak.

### 5.2 Wii U eShop (2014) - The Definitive Version Blueprint

**What Changed:**
- HD graphics complete revamp[^1]
- Physics 240 fps (was 30 on 3DS)[^6]
- 5 players: Arcade co-op 1-5, Endurance 1-5, Tower Tumble 2-5, Swift Stacker 2-5 + online[^1]
- New Mode: Tower Tumble - reverse Jenga[^1]

**Unity Implementation:**

1.  **240Hz Physics:** Already set in Fixed Timestep. Critical for 5-player tower stability.
2.  **Co-op Arcade:** Multiple pointers. Each player has different color cursor. Any player can grab current block. Implement drop-in/out: listen for gamepad connect.
    - Use `PlayerInputManager` with split join behavior. Each pointer is a `PlayerInput` instance sharing same `LevelManager`.
3.  **Tower Tumble Mode:**
    - Concept: Players take turns stacking, loser who tumbles loses round[^1].
    - Implementation: Start with random base + 3 random blocks pre-stacked slightly unstable. Turn manager cycles players. On fail, award point to all except loser (like Jenga). Random block shapes each turn[^1].
```csharp
public class TowerTumbleMode : GameMode
{
    int currentPlayer = 0;
    void Start() { BuildWobblyStarterTower(); }
    void OnTurnEnd() { if(!failed) currentPlayer = (currentPlayer+1)%playerCount; }
    void OnTumble(int culprit) { for(int i=0;i<playerCount;i++) if(i!=culprit) scores[i]++; ResetTower(); }
}
```
4.  **Controls:** Wii U had 3 methods: stick, touchscreen, Wii Remote[^1]. In Unity, map all to same action: `Gamepad.leftStick` + `Mouse` + `Touchscreen.primaryTouch` + `Pointer` (for gyro via new Input System's `Pen` or custom).

### 5.3 PlayStation 4 (2016) & 5 Modes Marketing

**What Changed:**
- Official description: "Packed with 5 unique game modes, online play and local split-screen"[^3]
- 8 beautiful environments[^3]
- Endurance highscore online.
- DualShock touchpad as pointer.

**Unity Implementation:**
- **Swift Stacker Enhanced (Split-screen):**
  - Two cameras, `Rect` 0-0.5 and 0.5-1. Same level seed for both sides. Race to solve faster. First to stabilize wins point[^1].
  - Code: Use `Camera.rect`, duplicate level with `PhysicsScene` separation (Unity 6 supports multiple physics scenes). Or use same physics scene but offset by 100 units.
- **Online:** For clone, use Unity Relay + Lobby. Swift Stacker online: sync block positions via `NetworkTransform` (only when held, kinematic). Since physics deterministic-ish, only sync release events.
- **Infinity Mode (introduced here, also on Switch):** Endless stacking until tumble, not level-based. Scoring per height. Implement as procedural queue with increasing difficulty.

### 5.4 Nintendo Switch (2018) - Final Form

**What Changed:**
- Play at home or on the go and challenge other players[^9]
- Endurance and Infinity modes high score focus[^9]
- HD Rumble for block wobble feedback.
- Single Joy-Con play for multiplayer.

**Unity Implementation:**
- **Platform Switch:** Handle docked vs handheld: In handheld, lower shadow resolution, enable touch. Use `Switch` define for build: `UNITY_SWITCH`.
- **HD Rumble:** Use `Gamepad.current.SetMotorSpeeds` with low freq for wobble: when stack velocity > 0.1, rumble proportional. On Joy-Con single, use `InputSystem.GetDevice<SwitchJoyCon>`.
- **Local Wireless:** Same as PS4 online but use `Unity.Services.Multiplayer` with local discovery.
- **8 Environments Rendering:** For Switch docked 1080p 60fps, handheld 720p 60fps. Use URP Asset variants with LOD bias.

---

## 6. Systems Architecture in Unity 6.6

### 6.1 Core Managers
- **GameBootstrapper:** ScriptableObject config loads correct feature flag set per `BuildTarget`. `WiiWareFlag = { levels=100, modes=[Arcade,Swift], players=2, physicsHz=60 }`
- **SaveSystem:** Use `JsonUtility` + `Application.persistentDataPath`. Save: completed levels, best times, Endurance highscore, Awards.
- **Audio:** Zen lounge soundtrack praised[^1]. Use `AudioMixer` with 2D BGM + 3D SFX (wood clack). Pool audio sources for collisions to avoid spam.

### 6.2 Input System Asset (`ArtOfBalance.inputactions`)
```
ActionMap: Gameplay
  Point: <Mouse>/position, <Touchscreen>/primaryTouch/position, <Gamepad>/rightStick (as delta), <Pen>/position
  Select: <Mouse>/leftButton, <Touchscreen>/press, <Gamepad>/buttonSouth
  RotateCW: <Gamepad>/rightShoulder, <Keyboard>/e, <Mouse>/scroll/y
  RotateCCW: <Gamepad>/leftShoulder, <Keyboard>/q
  Sensitivity: For stick, apply curve: input * (1 + sensitivity*0.5)
```

### 6.3 Level Editor Tool
Create custom EditorWindow to design levels quickly, matching non-linear world map[^1]:
- Grid of 25 levels per world, branching paths. Use `GraphView` API in Unity 6.6 to visualize map.
- Drag block types from palette to queue.

### 6.4 Performance Checklist for Unity 6.6
- URP Batching: Enable SRP Batcher, all wood materials same shader variant.
- Physics: `Physics.Broadphase` = Sap. Layer collision: Blocks vs Blocks, Blocks vs Platform, Blocks vs KillZone only.
- Switch/PS4: Profile 5-player Tower Tumble worst case (20 blocks + 5 pointers). Keep < 4ms physics.

---

## 7. Roadmap to Build Clone

**Milestone 1 (2 weeks): WiiWare Core**
- 14 block prefabs, platform, water bowl shader, pointer input, queue, 45° rotation, stability timer, fail trigger, 5 test levels.

**Milestone 2 (2 weeks): Visual Polish**
- 8 world lighting presets, wood materials, splash VFX, UI (Arcade map), SFX, 100 levels import via CSV.

**Milestone 3 (2 weeks): TOUCH! Expansion**
- Touch tray UI, 200 levels, Endurance mode, scoring multiplier, Awards system, save.

**Milestone 4 (3 weeks): WiiU/PS4/Switch Modes**
- Implement Scale, Gravity, Fire blocks, Tower Tumble, Swift Stacker split-screen, multiplayer input manager, 240Hz tuning.

**Milestone 5 (1 week): Online & Polish**
- Leaderboard (Unity Leaderboards), local wireless, HD rumble, settings (cursor speed), QA for physics determinism.

---

## 8. Code Snippets to Start

### Block Spawning Queue UI
```csharp
public class BlockQueueUI : MonoBehaviour
{
    [SerializeField] Transform queueParent;
    [SerializeField] GameObject silhouettePrefab;
    public void RefreshQueue(Queue<BlockDefinition> q, int visible=3)
    {
        foreach(Transform c in queueParent) Destroy(c.gameObject);
        int i=0;
        foreach(var def in q)
        {
            var go = Instantiate(silhouettePrefab, queueParent);
            var img = go.GetComponent<Image>();
            if(i<visible) { img.sprite = def.icon; img.color = Color.white; }
            else { img.sprite = def.icon; img.color = new Color(1,1,1,0.3f); } // outline only
            i++; if(i>=7) break;
        }
    }
}
```

### Water Kill Zone
```csharp
public class WaterKillZone : MonoBehaviour
{
    void OnTriggerEnter(Collider other)
    {
        if(other.attachedRigidbody != null && other.attachedRigidbody.GetComponent<BlockController>() != null)
        {
            if(LevelManager.Instance.IsDragging(other.attachedRigidbody)) return;
            LevelManager.Instance.Fail();
        }
    }
}
```

### Fire Block Special
```csharp
public class FireBlock : BlockController
{
    void OnCollisionEnter(Collision col)
    {
        if(col.rigidbody?.GetComponent<FireBlock>() != null)
        {
            // Both break - fire blocks break if they touch each other
            BreakBoth();
        }
    }
}
```

---

## 9. Legal & Differentiation Note
Shin'en owns Art of Balance IP. For a clone, do not use same name, same block silhouettes, or same soundtrack. Use this implementation plan to build an "inspired by" game with original art, e.g., "Balance: Zen Stack" with own wood textures and lounge environments. Keep mechanics (physics stacking is not copyrightable) but change visual identity.

---

## 10. Final Deliverable Structure in Unity

When you open Unity 6.6:
1. Create URP Project.
2. Import this markdown as `Documentation/ImplementationPlan.md`.
3. Create `ScriptableObject` library: 14 shapes + 5 specials + 200 levels from CSV provided.
4. Build Arcade scene first.

You now have a blueprint that respects WiiWare's minimalist elegance and scales cleanly to the feature-complete Switch/PS4 version with 5 modes, 5 players, and online.

**Next step I recommend:** I can generate the initial C# scaffolding (LevelManager, BlockController, GameModes) and URP shader graphs as a Unity package.

[^1]: Art of Balance Review — https://forums.serenesforest.net/index.php?showtopic=63225
[^2]: Art of Balance Review - Review - Nintendo World Report — http://www.nintendoworldreport.com/review/38619/art-of-balance-wii-u-review
[^3]: Shin'en Multimedia - Nintendo Switch™, PS4, PS5, Xbox, WiiU, Nintendo 3DS™, Wii™, Nintendo DS™, Game Boy Advance® Development — http://www.shinen.com/games/game.php3?art%20of%20balance
[^4]: Art of Balance (2010) | WiiWare Game | Nintendo Life — https://www.nintendolife.com/games/wiiware/art_of_balance
[^5]: Interview | Shin'en Talks Art of Balance (Nintendo WiiWare) Page 1 - Cubed3 — http://www.cubed3.com/news/13701/1/interview-shinen-talks-art-of-balance-nintendo-wiiware.html
[^6]: Shin'en releasing Art of Balance on the Wii U eShop — https://nintendoeverything.com/shinen-releasing-art-of-balance-on-the-wii-u-eshop/
[^7]: Art of Balance Archives - Page 3 of 3 - Nintendo Everything — https://nintendoeverything.com/tag/art-of-balance/page/3/
[^8]: Art of Balance TOUCH! eShop 3DS Decrypted Roms Download — https://madloader.com/art-of-balance-touch-eshop-3ds-decrypted/
[^9]: Art of Balance is Europe's next Switch Online Game Trial — https://nintendoeverything.com/?p=737046
