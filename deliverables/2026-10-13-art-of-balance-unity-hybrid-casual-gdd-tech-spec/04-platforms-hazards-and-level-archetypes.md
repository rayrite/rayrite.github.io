# Module 04: Platforms, Hazards, and Level Archetypes

## 1. Platform Encyclopedia & Physics Implementation

In *Art of Balance*, the foundation upon which you stack dictates the puzzle's entire physics dynamic. *Zen Stacker* implements 7 distinct platform archetypes, ranging from rock-solid stone pedestals to hydrodynamically simulated floating bowls and coupled balance scales.

### 1.1 Complete Platform Archetypes Matrix

| Platform ID | Platform Name | Physics Rigging Architecture | Angular & Positional Freedom | Hazard Rating (1-5) | Core Puzzle Challenge & Player Countermeasure |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PL-01** | Fixed Stone Plinth | Static Mesh Collider | Locked in all axes ($X, Y, Z$) | 1 / 5 (Baseline) | Standard flat granite pedestal; focus is purely on internal stack balance. |
| **PL-02** | Buoyant Floating Dish | Rigidbody + Custom Hydrodynamic Spring | Bobs vertically ($Y$) and tilts ($Z$ rotation) | 3 / 5 (Moderate) | Displaces water under load; asymmetrically placed blocks cause the dish to list, dumping the stack. |
| **PL-03** | Fulcrum / Teeter-Totter | HingeJoint (Limits: $\pm 28^\circ$, Spring Return) | Tilts around center pivot ($Z$ rotation) | 4 / 5 (High) | A seesaw balanced on a knife-edge; player must alternately counterbalance both sides to maintain center. |
| **PL-04** | Connected Balance Scales| Dual Rigidbodies + Coupled Kinematic Constraint| Plinth A and B move vertically inversely | 4 / 5 (High) | Adding weight to Left Plinth causes Right Plinth to elevate; heights must equalize to avoid slope spill. |
| **PL-05** | Inverted Ceiling Plinth | Static Mesh + Gravity Inversion Zone | Fixed in ceiling, builds downwards/upwards | 3 / 5 (Moderate) | Upside-down construction; requires wedge interlocking against upward gravitational pull. |
| **PL-06** | Oscillating Kinematic Base | Kinematic Rigidbody ($X = A \sin(\omega t)$) | Lateral periodic translation ($X$ axis) | 5 / 5 (Extreme) | Constant lateral acceleration exerts inertial shear force on every stacked block. |
| **PL-07** | Needle Spire Base | Static Mesh (Contact Width $0.3\text{ m}$) | Locked, but contact area $< 10\%$ of standard | 4 / 5 (High) | Extremely narrow foundation; requiring symmetrical T-block or dumbbell cantilever anchors. |

---

## 2. Platform Mechanical Schematics

```
    [PL-01: Fixed Stone]          [PL-02: Buoyant Dish]           [PL-03: Fulcrum Seesaw]
         +---------+                 \~~~~~~~~~~~~~~~/                 +---------------+
         |  BASE   |                  \   [DISH]    /                  |    PLANK      |
    =====+=========+=====        ~~~~~~\___________/~~~~~~             +-------+-------+
       WATER SURFACE                  WATER SURFACE                            ^ (Pivot)
                                                                             /___\
                                                                             
    [PL-04: Connected Balance Scales]                       [PL-06: Oscillating Kinematic Base]
        [Scale A]         [Scale B]                                    <-- [BASE] -->
         +-----+           +-----+                                   =======+======+=======
         |     |           |     |                                          |
         +--+--+           +--+--+                                    (Sine wave motor)
            |                 |
            +========[O]======+ (Pulley)
```

---

## 3. Level Archetypes & Game Modes

### 3.1 Campaign Progression: The 10 Zen Worlds
The single-player campaign comprises **200 hand-crafted stages** across 10 visually distinct biomes. Each world introduces a core mechanic and culminates in a complex multi-hazard capstone stage.

| World ID | World Title & Theme | Platform Archetypes | Featured Shape Mechanics | Level Count | Capstone Boss Puzzle Theme |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **World 1** | The Tranquil Pond | Fixed Stone (PL-01) | Standard Cedar Wood (Cubes, Planks, Wedges) | 20 Levels | "The Gateway Pagoda" (10-piece tower on narrow plinth). |
| **World 2** | Bamboo Grove | Buoyant Dish (PL-02) | Rollers, Cylinders & Semicircles | 20 Levels | "Floating Lotus" (Stacking rolling drums on a bobbing bowl). |
| **World 3** | Stone Lanterns | Fulcrum Seesaw (PL-03) | Heavy Iron & Eccentric Weighted Shapes | 20 Levels | "The Scales of Judgment" (Counterbalancing off-center CoM blocks). |
| **World 4** | Glass Pavilion | Fixed & Buoyant (PL-01, 02) | Fragile Tempered Glass (Load capacity limits) | 20 Levels | "Crystal Spire" (Stacking heavy wood atop delicate glass). |
| **World 5** | The Sacred Forge | Oscillating Base (PL-06) | Blazing Fire Shapes & Flammable Wood Sacrifices | 20 Levels | "Trial by Fire" (Incinerating temporary wooden struts to settle tower). |
| **World 6** | Scales of Balance | Connected Scales (PL-04) | Connected Dual Scales & Latch-Lock Shapes | 20 Levels | "Perfect Harmony" (Equalizing heights with welded cantilevers). |
| **World 7** | Spirit Shrine | Fixed & Fulcrum (PL-01, 03) | Ticking Spirit Blocks (5-second dissolution) | 20 Levels | "Fleeting Time" (Surviving staggered dissolution void drops). |
| **World 8** | Padlock Pagoda | Moving Base (PL-06) | Rotation-Locked & Queue-Locked Shapes | 20 Levels | "The Fixed Stance" (Stacking awkward shapes with zero rotation). |
| **World 9** | Magnetic Caverns | Buoyant & Inverted (PL-02, 05)| Magnetic Polarity & Tenchi Gravity Inverters | 20 Levels | "Polar Levitation" (Attracting and repelling upside-down blocks). |
| **World 10** | Grandmaster Sanctuary | All Platforms Hybridized | All Hazards Combined (Fire, Glass, Heavy, Locked) | 20 Levels | "Art of Zen" (18-piece master stack with thermal and weight hazards). |

### 3.2 Hybrid-Casual Star Rating System
Each campaign level rewards between 1 and 3 stars to encourage replayability and mastery:
* **1 Star (Cleared)**: Complete the level by holding all required shapes steady through the 3-second countdown.
* **2 Stars (Zen Master)**: Complete the level within the par time limit (typically $\le 45	ext{ seconds}$).
* **3 Stars (Perfectionist)**: Complete the level with zero glass fractures, zero resets, or exceeding a target structural height.

### 3.3 Auxiliary Game Modes
1. **Swift Mode (Blitz)**: A continuous time-attack challenge where players face a randomized series of puzzles with a global 60-second ticking clock. Every cleared level adds $+15	ext{ seconds}$ to the clock.
2. **Height Challenge (Tower Mode)**: The objective is not just to place all pieces, but to build high enough that the highest point of the stack crosses a glowing laser boundary line located $4.0	ext{ meters}$ above the water surface.
3. **Endless Zen Tower**: A single broad floating platform where randomly drawn shapes appear in the dock one by one. The player stacks indefinitely; every 5 placed blocks raises the water level and unlocks score multipliers until the tower collapses.
4. **Daily Zen Master Puzzle**: A single, globally synchronized puzzle updated every 24 hours at 00:00 UTC. Global leaderboards rank players by clearance time and lowest center-of-mass deviation.

---

## 4. Production C# Scripts for Dynamic Platforms

### 4.1 `BuoyantWaterDish.cs`: Hydrodynamic Water Simulation
Simulates buoyancy forces, water damping, and rotational listing without expensive fluid mesh calculations.

```csharp
using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class BuoyantWaterDish : MonoBehaviour
{
    [Header("Buoyancy Settings")]
    [SerializeField] private float waterLevelY = 0f;
    [SerializeField] private float floatSpringStrength = 65f;
    [SerializeField] private float waterDamping = 12f;
    [SerializeField] private float tiltRestoringTorque = 30f;
    [SerializeField] private float angularDamping = 8f;
    [SerializeField] private Transform[] buoyancyPoints;

    private Rigidbody rb;

    private void Awake()
    {
        rb = GetComponent<Rigidbody>();
        rb.constraints = RigidbodyConstraints.FreezePositionZ | 
                         RigidbodyConstraints.FreezeRotationX | 
                         RigidbodyConstraints.FreezeRotationY;
        rb.collisionDetectionMode = CollisionDetectionMode.ContinuousDynamic;
        rb.interpolation = RigidbodyInterpolation.Interpolate;
    }

    private void FixedUpdate()
    {
        // Apply vertical Archimedes spring-damper force at each buoyancy float point
        if (buoyancyPoints == null || buoyancyPoints.Length == 0) return;

        float forcePerPoint = floatSpringStrength / buoyancyPoints.Length;

        for (int i = 0; i < buoyancyPoints.Length; i++)
        {
            Transform point = buoyancyPoints[i];
            float depth = waterLevelY - point.position.y;

            if (depth > 0f)
            {
                // Submerged; apply upward buoyant spring force
                float displacementForce = depth * forcePerPoint;
                float verticalVelocity = rb.GetPointVelocity(point.position).y;
                float dampingForce = -verticalVelocity * waterDamping;

                Vector3 totalForce = Vector3.up * (displacementForce + dampingForce);
                rb.AddForceAtPosition(totalForce, point.position, ForceMode.Force);
            }
        }

        // Apply angular restoring torque around Z to simulate self-righting stability
        float currentAngleZ = transform.localEulerAngles.z;
        if (currentAngleZ > 180f) currentAngleZ -= 360f; // Wrap to [-180, 180]

        float restoringTorque = -currentAngleZ * tiltRestoringTorque;
        float angularVelocityZ = rb.angularVelocity.z;
        float dampingTorque = -angularVelocityZ * angularDamping;

        rb.AddTorque(new Vector3(0f, 0f, restoringTorque + dampingTorque), ForceMode.Force);
    }
}
```

### 4.2 `ConnectedBalanceScale.cs`: Coupled Dual-Plinth Pulley Simulation
```csharp
using UnityEngine;

public class ConnectedBalanceScale : MonoBehaviour
{
    [Header("Plinth References")]
    [SerializeField] private Rigidbody leftPlinth;
    [SerializeField] private Rigidbody rightPlinth;

    [Header("Constraint Settings")]
    [SerializeField] private float neutralY = 1.0f;
    [SerializeField] private float maxTravelDistance = 1.5f;
    [SerializeField] private float couplingStiffness = 40f;

    private void Awake()
    {
        SetupPlinth(leftPlinth);
        SetupPlinth(rightPlinth);
    }

    private void SetupPlinth(Rigidbody rb)
    {
        rb.constraints = RigidbodyConstraints.FreezePositionX | 
                         RigidbodyConstraints.FreezePositionZ | 
                         RigidbodyConstraints.FreezeRotation;
        rb.collisionDetectionMode = CollisionDetectionMode.ContinuousDynamic;
    }

    private void FixedUpdate()
    {
        // Compute displacement from neutral baseline
        float leftDeltaY = leftPlinth.position.y - neutralY;
        float rightDeltaY = rightPlinth.position.y - neutralY;

        // Pulley conservation rule: deltaLeft + deltaRight = 0
        float error = leftDeltaY + rightDeltaY;

        // Apply corrective opposing forces
        float correctionForce = error * couplingStiffness;
        leftPlinth.AddForce(Vector3.down * correctionForce, ForceMode.Force);
        rightPlinth.AddForce(Vector3.down * correctionForce, ForceMode.Force);

        // Clamp travel limits
        ClampPlinth(leftPlinth);
        ClampPlinth(rightPlinth);
    }

    private void ClampPlinth(Rigidbody rb)
    {
        Vector3 pos = rb.position;
        pos.y = Mathf.Clamp(pos.y, neutralY - maxTravelDistance, neutralY + maxTravelDistance);
        rb.position = pos;
    }
}
```

### 4.3 `KinematicMovingPlatform.cs`: Sinusoidal Oscillation
```csharp
using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class KinematicMovingPlatform : MonoBehaviour
{
    [SerializeField] private Vector3 translationAxis = Vector3.right;
    [SerializeField] private float amplitude = 1.2f;
    [SerializeField] private float frequency = 0.5f; // Hertz (cycles per second)

    private Rigidbody rb;
    private Vector3 originPosition;

    private void Awake()
    {
        rb = GetComponent<Rigidbody>();
        rb.isKinematic = true;
        rb.interpolation = RigidbodyInterpolation.Interpolate;
        originPosition = transform.position;
    }

    private void FixedUpdate()
    {
        float offset = Mathf.Sin(Time.time * frequency * 2f * Mathf.PI) * amplitude;
        Vector3 targetPos = originPosition + (translationAxis.normalized * offset);
        rb.MovePosition(targetPos);
    }
}
```

### 4.4 `LevelDataSO.cs`: Data-Driven Level Serialization
```csharp
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(fileName = "Level_001", menuName = "Zen Stacker/Level Data")]
public class LevelDataSO : ScriptableObject
{
    [Header("Level Identification")]
    public int worldIndex = 1;
    public int levelIndex = 1;
    public string levelTitle = "The First Step";

    [Header("Environment & Platform")]
    public GameObject platformPrefab;
    public Vector3 platformSpawnPosition = Vector3.zero;

    [Header("Available Shape Inventory")]
    public List<ShapeDataSO> shapesInInventory = new List<ShapeDataSO>();

    [Header("Star Challenge Par Values")]
    public float targetTimeSeconds = 45f;
    public float targetTowerHeight = 2.5f;
    public bool disallowAnyGlassCracking = true;

    [Header("Reward Tuning")]
    public int baseCoinsReward = 50;
    public int harmonyShardsReward = 5;
}
```
