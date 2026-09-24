Now I have all the research needed. Let me create the comprehensive implementation plan as a markdown deliverable.

# Art of Balance Clone - Unity 6.6 Implementation Plan

## Overview

This document outlines a complete implementation plan for recreating the WiiWare puzzle game **"Art of Balance"** by Shin'en Multimedia using Unity 6.6 (LTS). The plan focuses on faithfully recreating the visual style, physics-based gameplay loop, level structure, and game modes from the original WiiWare release while leveraging modern Unity features.

---

## 1. Project Architecture & Setup

### 1.1 Unity Version & Pipeline
- **Unity 6.6 LTS** (6000.0.x branch)
- **Universal Render Pipeline (URP)** for cross-platform performance
- **Physics**: Built-in PhysX (3D) for rigidbody simulation
- **Input System**: New Input System package (1.12+) for multi-device support
- **Addressables** for asset management and DLC-ready content delivery

### 1.2 Project Structure
```
Assets/
├── _Project/
│   ├── Scripts/
│   │   ├── Core/           # Game managers, singleton services
│   │   ├── Gameplay/       # Block, platform, physics logic
│   │   ├── UI/             # Menus, HUD, level selection
│   │   ├── Modes/          # Arcade, Endurance, Swift Stacker, Tower Tumble
│   │   ├── Input/          # Control schemes (mouse, touch, gamepad, motion)
│   │   └── Audio/          # Music manager, SFX
│   ├── Prefabs/
│   │   ├── Blocks/         # All block variants
│   │   ├── Platforms/      # Stone bases, scale bases
│   │   ├── UI/             # Menus, HUD elements
│   │   └── Effects/        # Particles, shatter, splash
│   ├── ScriptableObjects/
│   │   ├── LevelData/      # Level definitions
│   │   ├── BlockData/      # Block type definitions
│   │   ├── WorldData/      # World themes, progression
│   │   └── AudioData/      # Music tracks, SFX
│   ├── Scenes/
│   │   ├── MainMenu.unity
│   │   ├── LevelSelect.unity
│   │   ├── Gameplay.unity  # Single reusable scene
│   │   └── Multiplayer.unity
│   ├── Materials/
│   ├── Shaders/
│   ├── Textures/
│   └── Audio/
├── _ThirdParty/            # External packages (DOTween, etc.)
└── StreamingAssets/        # Level JSON fallback
```

### 1.3 Core Systems Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    GameManager (Singleton)                   │
│  - GameState (Menu, Playing, Paused, Result, Transition)    │
│  - CurrentMode, CurrentWorld, CurrentLevel                  │
│  - SaveSystem reference                                     │
├─────────────────────────────────────────────────────────────┤
│  LevelManager          │  BlockManager        │  PhysicsMgr │
│  - Load/Unload levels  │  - Spawn/Pool blocks │  - Config   │
│  - Progression logic   │  - Type registry     │  - Callbacks│
├─────────────────────────────────────────────────────────────┤
│  InputManager          │  AudioManager        │  VFXManager │
│  - Control schemes     │  - Music (per world) │  - Pooling  │
│  - Multiplayer input   │  - SFX (3D/2D)       │  - Shaders  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Visual Style & Rendering

### 2.1 Art Direction (Faithful to Shin'en's "Gemütlich" Aesthetic)
Per Shin'en's developer commentary, the visual pillars are:
- **Warm, inviting environments** ("gemütlich" - cozy/comfortable)
- **Imperfect, lived-in surfaces** - subtle scratches, variations on every asset
- **Soft, realistic lighting** - HDR, bloom, radial blur sun rays (512 samples)
- **Dynamic bokeh** on far backgrounds for depth-of-field focus
- **High-quality planar reflections** - water and table surfaces rendered 3x
- **Subtle chromatic aberration** on glass blocks and post-process
- **Subsurface scattering** on plant leaves
- **Lounge/jazz soundtrack** per world (8 distinct tracks)

### 2.2 Rendering Setup (URP)
```csharp
// URP Asset Configuration
- Rendering: Forward+ (for many lights)
- HDR: Enabled
- MSAA: 4x (quality) / 2x (performance)
- Post Processing: Enabled
- Shadow Distance: 50m (optimized for tabletop scale)
- Shadow Cascades: 2
- Depth Texture: Enabled (for water reflections)
- Opaque Texture: Enabled (for post-process)
```

### 2.3 Custom Shaders

#### 2.3.1 Block Standard Shader (`BlockStandard.shader`)
```hlsl
// Features:
// - Physically-based shading with subtle imperfection normal map
// - Vertex color support for tinting (block type colors)
// - Optional emission for "active" block highlight
// - Rim lighting for edge definition
// - Chromatic aberration on glass variant
Properties {
    _BaseMap ("Albedo", 2D) = "white" {}
    _ImperfectionMap ("Imperfections", 2D) = "gray" {}
    _NormalMap ("Normal", 2D) = "bump" {}
    _Roughness ("Roughness", Range(0,1)) = 0.7
    _Metallic ("Metallic", Range(0,1)) = 0.0
    _BlockTint ("Block Tint", Color) = (1,1,1,1)
    _IsGlass ("Glass Variant", Float) = 0
    _ChromaticAberration ("CA Strength", Range(0,0.02)) = 0.005
}
```

#### 2.3.2 Water Shader (`WaterSurface.shader`)
```hlsl
// Planar reflection via RenderTexture (3x scene render)
// - Fresnel-based reflectivity
// - Subtle ripple normal map (animated)
// - Refraction for underwater view
// - Caustics projection on submerged objects
// - Intersection foam at block boundaries
```

#### 2.3.3 Table/Surface Shader (`TableSurface.shader`)
```hlsl
// - Scratch normal map (tiled, subtle)
// - Planar reflection on smooth areas (roughness mask)
// - Warm subsurface color bleed
// - Baked AO + lightmap support
```

### 2.4 Post-Processing Stack (Volume-based)
| Effect | Settings | Purpose |
|--------|----------|---------|
| **Bloom** | Threshold: 1.2, Intensity: 0.4, Scatter: 0.7 | Soft HDR highlights |
| **Chromatic Aberration** | Intensity: 0.08 | Lens imperfection |
| **Vignette** | Intensity: 0.15, Smoothness: 0.4 | Focus on play area |
| **Color Grading** | Lift: warm, Gamma: slight contrast, Post-exposure: +0.15 | "Gemütlich" warmth |
| **Depth of Field** | Focus: play area, Aperture: 2.8, Focal Length: 50mm | Bokeh background |
| **Lens Distortion** | -0.02 (barrel) | Subtle lens feel |

### 2.5 Environment per World (8 Worlds)
Each world has a distinct **lounge environment** with unique:
- **Skybox/Background**: Panoramic HDR cubemap (living room, library, greenhouse, etc.)
- **Table Material**: Wood, stone, glass, metal variants with unique imperfections
- **Lighting**: Time-of-day (morning, afternoon, evening, night) + warm sun rays through window
- **Props**: Plants (SSS leaves), books, candles, instruments - all with scratch maps
- **Music**: Unique lounge/jazz track (looped, ~2-3 min)
- **Color Palette**: Defined in `WorldData` ScriptableObject

---

## 3. Core Gameplay Systems

### 3.1 Physics Configuration
```csharp
// Project Settings > Physics
- Gravity: (0, -9.81, 0)
- Default Solver Iterations: 10 (position), 15 (velocity) // High for stability
- Sleep Threshold: 0.005
- Max Depenetration Velocity: 1.0
- Contact Generation: Persistent (for stable stacking)
- Layer Collision Matrix: 
  - Blocks collide with: Blocks, Platforms, WaterTrigger
  - Blocks DON'T collide with: HeldBlock (while dragging)
  - WaterTrigger: Trigger only
```

### 3.2 Block System

#### 3.2.1 Block Types (from WiiWare + Wii U)
| Type | Worlds | Behavior | Visual |
|------|--------|----------|--------|
| **Regular** | A-H | Standard rigidbody | Wood/stone texture, tinted per world |
| **Weight-Breakable** | B, D, H | Breaks when ≥3 blocks stacked on top | Cracked texture, stress cracks appear at 2 |
| **Timer-Breakable** | C, D, H | Starts countdown (3-5s) when block placed on top | Glowing timer ring, pulses faster near break |
| **Gravity-Reversal** | F, H | Flips gravity for entire stack when released | Distinctive arrow/vortex pattern, glow |
| **Fire** | G, H | Destroys on contact with another fire block | Emissive flame texture, particle trail |
| **Scale-Base** | E, H | Platform (not block) - seesaw base | Wooden seesaw with fulcrum |

#### 3.2.2 Block Data (ScriptableObject)
```csharp
[CreateAssetMenu(menuName = "ArtOfBalance/BlockData")]
public class BlockData : ScriptableObject {
    public BlockType type;
    public GameObject prefab;           // Visual + collider + rigidbody
    public Mesh[] shapeVariants;        // 8-12 shapes per type
    public Material material;           // Instanced per world tint
    public float mass = 1.0f;
    public float breakThreshold = 3;    // For weight-breakable
    public float timerDuration = 4f;    // For timer-breakable
    public AudioClip placeSound;
    public AudioClip breakSound;
    public ParticleSystem breakEffect;
    public bool isPlatform = false;     // For scale bases
}
```

#### 3.2.3 Shapes (Geometric Variety)
Based on research: rectangles, circles, X-shapes, half-circles, large arrows, dumbbells, crosses with round edges, triangles, L-shapes, Z-shapes, thin blocks with circles on ends.
- **Total**: ~30 unique meshes across all types
- **Rotation**: 45° increments (8 orientations) - enforced by snap system

### 3.3 Platform System
- **Stone Bases**: Static meshes (rocks in water bowl) - varied shapes per level
- **Scale Bases (World E/H)**: Seesaw platforms with hinge joint
  - Configurable: fulcrum position, tilt limits, damping
  - Visual feedback: tilt indicator UI
- **Swaying Base (Challenge levels)**: Single pre-placed block on spring joint
  - Spring: low stiffness, high damping for gentle sway

### 3.4 Water System
- **Visual**: Planar reflection (3x render) + animated ripple normal map + caustics
- **Gameplay**: Trigger volume - any block entering = level fail
- **Splash VFX**: Particle system on contact (size based on block mass/velocity)
- **Audio**: Procedural splash pitch based on impact energy

### 3.5 Input & Block Manipulation

#### 3.5.1 Control Schemes
| Scheme | Platform | Implementation |
|--------|----------|----------------|
| **Mouse/Keyboard** | PC, Mac | Raycast from cursor, drag plane at water level |
| **Gamepad** | Console, PC | Virtual cursor (analog stick), adjustable speed |
| **Touch** | Mobile, Switch | Direct drag, two-finger rotate (45° snap) |
| **Motion (Gyro)** | Switch, Mobile | Gyro aiming + button confirm |

#### 3.5.2 Block Handling Flow
```
1. PLAYER SELECTS BLOCK (from tray of 3 visible)
   → Block instantiated at tray position
   → Rigidbody: isKinematic = true, useGravity = false
   → Layer = "HeldBlock" (no collision with world)
   → Visual: highlight outline, semi-transparent ghost at valid drop positions

2. PLAYER MOVES BLOCK
   → Raycast to water plane (Y=0)
   → Clamp to play area bounds
   → Show ghost preview at snap positions (grid-free, but collision-checked)

3. PLAYER ROTATES BLOCK (45° increments)
   → Input: Q/E (keys), RB/LB (gamepad), two-finger twist (touch)
   → Snap to nearest 45°: targetRot = Quaternion.Euler(0, round(y/45)*45, 0)
   → Smooth damp rotation (0.1s)

4. PLAYER RELEASES BLOCK
   → Rigidbody: isKinematic = false, useGravity = true
   → Layer = "Block"
   → Physics takes over
   → Play place sound
   → Check win condition after settle
```

#### 3.5.3 Tray System (3 Visible Blocks)
- Level data defines full block sequence (4-7 blocks)
- Only first 3 are "available" (colored)
- Remaining shown as white silhouettes (ghost outlines)
- When block placed, tray shifts: next block becomes available
- Allows planning ahead (per original design)

---

## 4. Game Modes Implementation

### 4.1 Arcade Mode (Core Single-Player)
**Structure**: 8 Worlds × 25 Levels = 200 Levels + Challenge Levels
- **World A**: Regular blocks only (tutorial)
- **World B**: Weight-breakable blocks introduced
- **World C**: Timer-breakable blocks introduced
- **World D**: Combines A-C
- **World E**: Scale bases (seesaw platforms)
- **World F**: Gravity-reversal blocks
- **World G**: Fire blocks
- **World H**: Combines all mechanics (ultimate challenge)

**Level Data Format** (ScriptableObject + JSON):
```json
{
  "levelId": "B-12",
  "world": 1,
  "index": 11,
  "isChallenge": false,
  "blocks": [
    {"type": "Regular", "shape": "RectWide", "mass": 1.0},
    {"type": "WeightBreakable", "shape": "Circle", "mass": 1.5},
    {"type": "Regular", "shape": "XShape", "mass": 0.8},
    {"type": "WeightBreakable", "shape": "HalfCircle", "mass": 2.0}
  ],
  "platforms": [
    {"type": "StoneBase", "shape": "RockFormation_3", "position": "0,0,0", "rotation": 0}
  ],
  "challenge": null,
  "parTime": 60,
  "parMoves": 4
}
```

**Challenge Types** (3-5 per world):
- **Height Challenge**: Reach minimum stack height (measured from water)
- **Time Limit**: Place all blocks within X seconds (3s stability timer excluded)
- **Unstable Base**: Build on single swaying block (spring joint)
- **Minimal Blocks**: Solve with subset of blocks (bonus)

**Win Condition**:
1. All available blocks placed (tray empty)
2. 3-second stability timer starts
3. No block touches water trigger during timer
4. Stack velocity < threshold (settled)
5. → Level Complete → Award circles (1 normal, 3 for world final, +1 for challenge)

**Progression**:
- 20 circles → unlock next world
- World final level (25th) awards 3 circles
- Non-linear world map per world (branching paths)
- Time/retries tracked per world for stats screen

### 4.2 Endurance Mode (Score Attack)
**Rules**:
- Random sequence of 166 non-challenge levels (Worlds A-H)
- 3 lives (retries)
- Score submitted to online leaderboard

**Scoring**:
```
Per Block Released:     50 pts
Per Block Broken:       100 pts
Life Remaining Bonus:   100 pts × lives left
Time Bonus:             10 pts × seconds left (max 60s)
Difficulty Multiplier:  World A=1x, B=2x, C=3x, D=4x, E=5x, F=6x, G=7x, H=8x

Total = (Blocks×50 + Broken×100 + Lives×100 + Time×10) × WorldMultiplier
```

**Implementation**:
- `EnduranceRun` class manages session state
- Level queue: weighted random (avoid same world twice)
- Persistent save between sessions (for "continue" feel)
- Online leaderboard via Unity Gaming Services or custom backend

### 4.3 Swift Stacker (Versus Race)
**2-5 Players** (local split-screen + online)
- Same puzzle, race to complete first
- Winner gets point
- Best of 5/7/9 rounds
- Online: Unity Netcode for GameObjects (NGO) or Photon Fusion

**Split-Screen**:
- 2 players: Horizontal split
- 3-4 players: 2×2 grid
- 5 players: 2×3 with one empty
- Shared physics simulation (deterministic) or separate instances with sync

### 4.4 Tower Tumble (Reverse Jenga)
**2-5 Players** (local only)
- Players take turns placing ONE block on shared tower
- Random block from pool, random base
- Tower falls → active player loses round, others get point
- First to X points wins

**Implementation**:
- Turn manager with player index
- Shared physics scene (single tower)
- Block pool: all types, weighted random
- Camera orbits tower smoothly

### 4.5 Multiplayer Architecture
```
NetworkManager (NGO/Photon)
├── LobbySystem
│   ├── Create/Join Room
│   ├── Player Slots (max 5)
│   └── Ready Check
├── GameSession
│   ├── Mode: SwiftStacker | TowerTumble
│   ├── Level Sync (seed for deterministic)
│   ├── Input Authority (per player)
│   └── State Sync (block positions for Tower Tumble)
└── Relay/Transport
    ├── Unity Relay (NGO)
    └── Photon Cloud (Fusion)
```

---

## 5. Level Design & Content Pipeline

### 5.1 Level Authoring Tool (Editor Extension)
```csharp
// Custom Editor Window: "Art of Balance Level Editor"
// Features:
// - Visual level builder in Scene view
// - Drag-drop blocks from palette
// - Auto-snap to 45° rotation
// - Physics simulation preview (play in editor)
// - Challenge type selector
// - Export to ScriptableObject + JSON
// - Validate: solvable, no immediate water contact, par time calibration
```

### 5.2 Level Data Structure
```csharp
[CreateAssetMenu(menuName = "ArtOfBalance/LevelData")]
public class LevelData : ScriptableObject {
    public string levelId;           // "A-01", "B-12", etc.
    public int worldIndex;           // 0-7
    public int levelIndex;           // 0-24 (+ challenges)
    public bool isChallenge;
    public ChallengeType challengeType;
    public ChallengeData challengeData;
    
    public BlockInstance[] blockSequence;  // Full sequence (4-7)
    public PlatformInstance[] platforms;   // Stone bases, scale bases
    public Vector3 waterLevel = new Vector3(0, -0.5f, 0);
    public Bounds playArea;
    public float parTime = 60f;
    public int parMoves = 4;
}
```

### 5.3 Procedural Assistance
- **Challenge Level Generator**: Algorithmically create height/time/unstable variants
- **Endurance Queue Balancer**: Ensure variety across worlds in random sequence
- **Difficulty Analyzer**: Simulate 1000x physics runs to estimate solve time/difficulty

---

## 6. Audio System

### 6.1 Music (8 World Tracks + Menu + Endurance)
- **Format**: OGG Vorbis (loopable, ~2-3 min each)
- **Implementation**: `AudioManager` with crossfade between worlds
- **Adaptive**: Low-pass filter when paused, volume duck for SFX

### 6.2 Sound Effects
| Event | Details |
|-------|---------|
| Block Pickup | Soft "wood click" + subtle whoosh |
| Block Place | Impact sound varied by mass/surface (wood/stone/glass) |
| Block Rotate | Subtle tick at each 45° snap |
| Block Break (Weight) | Cracking wood, debris particles |
| Block Break (Timer) | Electronic beep sequence → shatter |
| Gravity Flip | Whoosh + reverse reverb tail |
| Fire Contact | Fizzle + small explosion |
| Water Splash | Procedural pitch/volume by impact energy |
| Level Complete | Gentle chime (major pentatonic) |
| Level Fail | Soft "plunk" + water ripple |
| Menu Navigate | Minimal UI ticks |

### 6.3 Spatial Audio
- **3D SFX**: Block impacts, water splashes (spatial blend 0.8)
- **2D SFX**: UI, music, level complete/fail
- **Reverb Zones**: Room reverb for lounge feel

---

## 7. UI/UX Design

### 7.1 Visual Language
- **Minimal, clean, readable** - fits "zen" aesthetic
- **Typography**: Rounded sans-serif (e.g., Nunito, Quicksand)
- **Color**: World-themed accent colors, warm neutrals
- **Animations**: DOTween - easeOutCubic, 0.3s transitions

### 7.2 Key Screens

#### Main Menu
```
┌─────────────────────────────────────┐
│         ART OF BALANCE              │
│    [Arcade]  [Endurance]  [Multi]   │
│    [Options]  [Awards]  [Credits]   │
│                                     │
│    World Select (horizontal scroll) │
│    [A] [B] [C] [D] [E] [F] [G] [H]  │
│    Progress: ████████░░ 80%         │
└─────────────────────────────────────┘
```

#### Level Select (Per World)
- Non-linear map with nodes (levels)
- Lines show connections
- Completed: gold circle, Challenge: star icon
- Locked: dimmed, shows requirement
- Hover: preview thumbnail, best time, retries

#### Gameplay HUD (Minimal)
```
┌─────────────────────────────────────┐
│  WORLD B • LEVEL 12      0:42       │
│  ◉◉◉○○○  Circles: 23/120           │
│                                     │
│        [Block Tray - 3 visible]     │
│    ┌───┐ ┌───┐ ┌───┐                │
│    │ █ │ │ ░ │ │ ░ │  ← colored     │
│    └───┘ └───┘ └───┘  ← ghosted    │
│                                     │
│  [Pause]  [Restart]  [Hint]         │
└─────────────────────────────────────┘
```

#### Result Screen
- **Success**: "BALANCED" + circles earned + time + retry count
- **Fail**: "TOPLED" + water splash animation + instant retry button

### 7.3 Accessibility
- Colorblind modes (block type patterns + colors)
- Adjustable cursor speed (gamepad)
- High contrast UI option
- Remappable controls
- Screen reader compatible menus

---

## 8. Save System & Progression

### 8.1 Save Data Structure
```csharp
[Serializable]
public class SaveData {
    public int version = 1;
    public PlayerProfile profile;
    public WorldProgress[] worlds;        // 8 worlds
    public EnduranceRecord enduranceBest; // High score + seed
    public AwardsData awards;             // 13 awards
    public SettingsData settings;
    public Statistics stats;              // Total time, blocks placed, etc.
}

[Serializable]
public class WorldProgress {
    public int circlesEarned;             // 0-30 per world
    public LevelRecord[] levels;          // 25 + challenges
    public bool isUnlocked;
    public float bestTotalTime;
    public int totalRetries;
}

[Serializable]
public class LevelRecord {
    public bool completed;
    public float bestTime;
    public int retries;
    public bool challengeCompleted;
}
```

### 8.2 Persistence
- **Primary**: `Application.persistentDataPath` + JSON (Encrypted with `System.Security.Cryptography`)
- **Cloud**: Unity Cloud Save (UGS) for cross-device sync
- **Backup**: Auto-save on level complete, mode exit, settings change

---

## 9. Multiplayer Networking (Unity 6.6 + NGO)

### 9.1 Architecture
- **Netcode for GameObjects (NGO)** v2.x (Unity 6 native)
- **Relay Service** for NAT traversal
- **Lobby Service** for matchmaking
- **Deterministic Physics**: Fixed timestep (0.02s), same seed for level gen

### 9.2 Swift Stacker (Race Mode)
- Each player runs **local physics simulation**
- Only **completion event** synced (timestamp + hash of final state)
- Anti-cheat: Server validates final stack stability

### 9.3 Tower Tumble (Turn-Based)
- **Single authoritative simulation** (host)
- Clients send **placement commands** (position, rotation, block ID)
- Host simulates, replicates transforms to clients
- Low bandwidth (few Hz updates)

### 9.4 Connection Flow
```
1. Player creates lobby → gets Lobby ID + Relay Allocation
2. Others join via Lobby ID or invite
3. Host starts game → loads level (same seed)
4. NGO spawns PlayerObjects (input authority)
5. Gameplay loop with RPC/NetworkVariables
6. Results synced → return to lobby
```

---

## 10. Performance Optimization

### 10.1 Target Specs
| Platform | Target | Resolution | FPS |
|----------|--------|------------|-----|
| PC (Steam) | High | 1080p/4K | 60/120 |
| Switch | Handheld/Docked | 720p/1080p | 30/60 |
| Mobile (iOS/Android) | Mid | 1080p | 60 |
| PS4/Xbox One | Base | 1080p | 60 |
| PS5/Xbox Series | Enhanced | 4K | 60/120 |

### 10.2 Optimization Strategies
- **Object Pooling**: Blocks, particles, splash effects, UI elements
- **GPU Instancing**: All blocks use same material (instanced properties for tint)
- **Physics**: 
  - Sleep aggressively (threshold 0.005)
  - Disable collision for held blocks
  - Use `Physics.autoSimulation = false` during level load
- **Rendering**:
  - Static batching for environment
  - Dynamic batching for blocks (small meshes)
  - Reflection probes baked (not realtime) except water
  - Water reflection: 30 FPS cap, half-res
- **Memory**:
  - Addressables for world environments (load/unload per world)
  - Audio: Compressed in memory, stream music
  - Texture compression: ASTC (mobile), BC7 (desktop/console)

### 10.3 Profiling Checkpoints
- `Profiler.BeginSample("LevelLoad")` - target < 2s
- `Physics.ProcessingTime` - target < 2ms/frame
- `RenderThread` - target < 8ms (60 FPS) / 4ms (120 FPS)
- `GC.Alloc` - zero per frame during gameplay

---

## 11. Testing & Quality Assurance

### 11.1 Automated Testing
```csharp
// PlayMode Tests (NUnit)
[Test] public void Block_Placed_On_Valid_Surface_Stays_Stable()
[Test] public void WeightBreakable_Breaks_At_Third_Block()
[Test] public void TimerBreakable_Triggers_After_Delay()
[Test] public void GravityBlock_Flips_Entire_Stack()
[Test] public void FireBlock_Destroys_On_Contact()
[Test] public void ScaleBase_Tilts_With_Weight_Distribution()
[Test] public void WaterTrigger_Fails_Level_On_Contact()
[Test] public void StabilityTimer_Requires_3_Seconds_Settled()
[Test] public void Endurance_Scoring_Matches_Formula()
[Test] public void Progression_Unlocks_World_At_20_Circles()
```

### 11.2 Physics Determinism Tests
- Run same level 100x with fixed seed → verify identical outcome
- Cross-platform determinism (PC vs Switch vs Mobile)

### 11.3 Playtesting Milestones
| Milestone | Focus |
|-----------|-------|
| **Vertical Slice** (1 world, 10 levels) | Core loop, physics feel, visual target |
| **Alpha** (All worlds, Arcade + Endurance) | Progression, difficulty curve, scoring |
| **Beta** (All modes, multiplayer) | Network sync, split-screen, matchmaking |
| **RC** | Polish, bugs, certification, performance |

---

## 12. Development Timeline (Estimated)

### Phase 1: Foundation (Weeks 1-6)
| Week | Deliverable |
|------|-------------|
| 1-2 | Project setup, URP config, input system, core architecture |
| 3-4 | Block system (types, physics, 45° rotation, tray) |
| 5-6 | Water system, platform system, win/fail conditions |

### Phase 2: Arcade Mode & Content (Weeks 7-16)
| Week | Deliverable |
|------|-------------|
| 7-9 | Level editor tool, World A (25 levels) + challenges |
| 10-12 | Worlds B, C, D (breakable blocks) |
| 13-14 | Worlds E, F (scale bases, gravity blocks) |
| 15-16 | Worlds G, H (fire blocks, combined) |

### Phase 3: Visual Polish (Weeks 17-22)
| Week | Deliverable |
|------|-------------|
| 17-18 | Environment art (8 worlds), lighting, post-process |
| 19-20 | Custom shaders (blocks, water, table, imperfections) |
| 21-22 | VFX (break, splash, particles), UI animations |

### Phase 4: Additional Modes (Weeks 23-30)
| Week | Deliverable |
|------|-------------|
| 23-25 | Endurance mode + online leaderboards |
| 26-28 | Swift Stacker (local + online) |
| 29-30 | Tower Tumble (local) |

### Phase 5: Polish & Ship (Weeks 31-40)
| Week | Deliverable |
|------|-------------|
| 31-34 | Audio integration, accessibility, settings |
| 35-36 | Multiplayer testing, netcode optimization |
| 37-38 | Platform certification (console) |
| 39-40 | Launch prep, marketing builds, day-1 patch |

**Total: ~40 weeks (10 months) for small team (3-5 devs)**

---

## 13. Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Physics instability (jitter, tunneling) | High | Critical | High solver iterations, CCD on fast blocks, extensive soak tests |
| Network desync (Swift Stacker) | Medium | High | Deterministic sim, server validation, rollback netcode fallback |
| Performance on Switch/Mobile | High | High | Profiling early, scalable quality settings, Addressables |
| Level design difficulty curve | Medium | High | Automated difficulty analyzer, playtest telemetry |
| Scope creep (multiplayer modes) | Medium | Medium | Phase-gated milestones, cut Tower Tumble if needed |
| Asset pipeline bottlenecks | Low | Medium | Level editor tool investment early |

---

## 14. Extensibility & Future Content

### 14.1 DLC-Ready Architecture
- Worlds/Levels as **Addressable Asset Groups** (downloadable)
- Block types via **ScriptableObject registry** (moddable)
- Game modes as **separate assemblies** (loadable)

### 14.2 Community Features
- **Level Editor Export** → Steam Workshop / Custom server
- **Replay System** → Deterministic seed + input log → video export
- **Daily Challenge** → Seeded Endurance run (same for all players)

---

## 15. Appendix: Key Code Interfaces

### 15.1 IBlockBehavior (Polymorphic Block Logic)
```csharp
public interface IBlockBehavior {
    void OnPlaced(Block block);
    void OnBlockStackedOn(Block block, Block stackedBlock, int count);
    void OnTimerTick(Block block, float timeRemaining);
    void OnGravityFlipped(Block block);
    void OnFireContact(Block block, Block other);
    bool ShouldBreak(Block block);
    void Break(Block block);
}
```

### 15.2 IGameMode (Mode Interface)
```csharp
public interface IGameMode {
    void Initialize(LevelData level, ModeConfig config);
    void OnBlockPlaced(Block block);
    void OnBlockBroken(Block block);
    void OnStabilityTimerComplete(bool success);
    void OnBlockTouchedWater(Block block);
    ModeResult GetResult();
    void Update(float dt);
}
```

### 15.3 LevelGenerator (Procedural Assist)
```csharp
public static class LevelGenerator {
    public static LevelData GenerateChallenge(LevelData baseLevel, ChallengeType type);
    public static LevelData[] GenerateEnduranceQueue(int count, WorldDifficulty[] weights);
    public static DifficultyAnalysis Analyze(LevelData level, int simulations = 1000);
}
```

---

## Conclusion

This implementation plan provides a comprehensive roadmap for building a faithful **Art of Balance** clone in Unity 6.6. The architecture prioritizes:

1. **Physics fidelity** - The core of the gameplay experience
2. **Visual authenticity** - Recreating Shin'en's "gemütlich" aesthetic with modern URP
3. **Scalable content pipeline** - 200+ levels authorable via custom tools
4. **Multiplayer readiness** - NGO-based networking for all modes
5. **Cross-platform performance** - From Switch to 4K PC

The modular design (ScriptableObjects, interfaces, Addressables) ensures maintainability and extensibility for post-launch content. With a focused 10-month timeline and clear milestones, a small team can deliver a polished, commercially-viable physics puzzler that honors the original while leveraging Unity 6's capabilities.
