# Module 07: Deep Dive: Weighted Shapes & Original WiiWare Mechanics

## 1. Executive Overview

In physics-based construction and stacking games, **mass distribution** is the foundational variable governing structural equilibrium. While a naive player intuitively equates visual size with physical weight, advanced puzzle design exploits the discrepancy between visual geometry and gravitational torque. 

This deep dive examines how weight and mass mechanics functioned in the original 2010 Nintendo WiiWare title **"Art of Balance"** by Shin'en Multimedia, and details how those mechanics are systematically modernized and expanded for a hybrid-casual mobile release in **Unity 6 (6.5 LTS)**.

---

## 2. Weight Mechanics in the Original WiiWare Game (2010)

Shin'en Multimedia's original WiiWare release achieved critical acclaim largely due to its immaculate custom physics engine running on the Nintendo Wii's modest hardware ($729\text{ MHz}$ Broadway CPU, $243\text{ MHz}$ Hollywood GPU). Because memory and compute cycles were constrained by WiiWare's strict $40\text{ MB}$ total download size limit, Shin'en engineered weight mechanics through elegant, computationally lightweight rules.

```
       [ ORIGINAL WIIWARE PHYSICS WEIGHT ARCHITECTURE ]
  +---------------------------------------------------------------+
  |  1. Volumetric Density Model                                  |
  |     - All standard timber pieces shared uniform density.      |
  |     - Mass = Volume * BaseDensity (Crosses >> Small Cubes).   |
  +-------------------------------+-------------------------------+
                                  |
                                  v
  +-------------------------------+-------------------------------+
  |  2. Load-Sensitive Breakable Blocks                           |
  |     - Tracked downward piece count (Max 2-3 blocks atop).     |
  |     - Exceeding load limit crushed the block into shards.     |
  +-------------------------------+-------------------------------+
                                  |
                                  v
  +-------------------------------+-------------------------------+
  |  3. Coupled Balance Scales & Plinths                          |
  |     - Weight on Plinth A drove it down into water.            |
  |     - Plinth B elevated proportionally via pulley math.       |
  +---------------------------------------------------------------+
```

### 2.1 The Volumetric Density Model
In the original WiiWare title, standard blocks did not have arbitrary mass stats assigned by material; instead, Shin'en utilized a **strict volumetric density equation**:
$$M_{\text{piece}} = V_{\text{mesh}} \cdot \rho_{\text{timber}}$$

* **Large Composite Blocks**: Bulky shapes like the Cross/Plus (**SH-09**), Arched Bridge (**SH-13**), and Long Planks (**SH-02**) possessed massive physical weight simply because their volume was $3\times \text{ to } 5\times$ larger than standard cubes.
* **Small Detail Blocks**: Slender triangular wedges (**SH-06**) and tiny spacer cubes had minimal mass.
* **Puzzle Impact**: Placing a heavy Cross block on one side of a floating dish would immediately tip the entire dish into the water unless an equivalent volume of blocks was placed on the opposing rim.

### 2.2 Breakable / Load-Sensitive Blocks
The most direct manifestation of weight in the original WiiWare title was the introduction of **Breakable (Glass/Porous Stone) Blocks** in early worlds (such as World B):
1. **Load Limits**: Each breakable piece was visually distinct (translucent glass or cracked, porous sandstone) and could only withstand a predetermined downward load.
2. **The "Rule of Three"**: Typically, if more than two or three other pieces were stacked directly above the breakable block, the cumulative gravitational load exceeded the structural threshold, instantly shattering the block.
3. **Tactical Destruction**: Players frequently had to solve puzzles by intentionally overloading a breakable block at a precise moment, causing an upper beam to fall cleanly into a lower cradle to stabilize the final tower.

### 2.3 Weighing Scales & Coupled Plinths
Later worlds introduced **Connected Balance Scales** and dual plinths suspended over the water pool:
* When a shape was placed on Plinth A, the platform physically dipped downward into the water surface.
* Through an internal pulley constraint, Plinth B would rise upward by an identical distance.
* Because pieces had volumetric mass, players had to mentally balance the total volume placed on either side. Overloading one scale would submerge it into the water trigger plane, resulting in an instant level failure.

### 2.4 Wii Remote Tactile Feedback & Input Inertia
On the Nintendo Wii, shapes were picked up using the **Wii Remote IR pointer** and the `A` / `B` triggers:
* **Spring-Damper Cursor Connection**: Shin'en connected the grabbed block to the pointer via a virtual spring-damper joint. Heavy volumetric blocks exhibited noticeable visual drag/inertia lag when swung across the screen, giving players an immediate tactile sense of heft.
* **Wii Remote Speaker Cues**: Dropping a heavy piece triggered deep, low-frequency wooden clack audio routed directly through the internal speaker of the Wii Remote in the player's hand.

---

## 3. Comparison Matrix: WiiWare (2010) vs Unity 6 Mobile (2026)

| Architectural Dimension | Original WiiWare (Shin'en 2010) | Modern Hybrid-Casual (Unity 6.5 LTS) | Evolutionary Enhancement |
| :--- | :--- | :--- | :--- |
| **Mass Definition** | Implicit volumetric density (uniform timber). | Explicit material density ($600 - 7,800\text{ kg/m}^3$) via `PhysicsMaterial` + ScriptableObjects. | Allows small blocks (Kurogane Iron) to be much heavier than large wooden planks. |
| **Center of Mass (CoM)** | Symmetrical mesh centroid $(0, 0, 0)$. | Overridden `Rigidbody.centerOfMass` for eccentric off-axis rotational torque. | Introduces asymmetrical balance puzzles without changing visible outer silhouettes. |
| **Input / Pointer Physics** | Wii Remote IR pointer with spring-lag. | Capacitive touch with calibrated $+1.8\text{ cm}$ finger occlusion offset and 45° snap buttons. | Ergonomically optimized for one-handed mobile touchscreens. |
| **Breakable Load Detection**| Integer count of stacked blocks atop ($> 2\text{ or } 3$). | Continuous impulse normal force integration ($F_n = \int J_n / \Delta t > 1,200\text{ N}$). | Physically accurate load monitoring factoring in drop impacts and kinetic momentum. |
| **Platform Buoyancy** | 2.5D analytical water dip formula. | Multi-point hydrodynamic Archimedes spring-damper solver in 3D PhysX. | Natural listing, tilting, and dynamic wave bobbing on floating dishes. |
| **Tactile Sensory Feedback**| Wii Remote internal low-res speaker. | High-fidelity haptic waveforms (CoreHaptics / Android Vibrator) + pitch-modulated binaural audio. | Premium, satisfying physical response on mobile glass displays. |

---

## 4. Modernized Weighted Shapes Architecture in Unity 6

*Zen Stacker* expands the original WiiWare concept into two specialized classes of weighted shapes:

```
  CLASS A: KUROGANE IRON (HIGH DENSITY)       CLASS B: ECCENTRIC WEIGHTED (OFF-CENTER CoM)
      +---------------------+                    +---------------------+
      |   DENSE CAST IRON   |                    |   (Inlaid Brass)    |
      |   Density = 7,800   |                    |       [ * ]         | <--- Center of Mass (CoM)
      |   Mass = 10.0 kg    |                    |                     |      shifted 0.35m left!
      |   (CoM at Center)   |                    +----------^----------+
      +----------^----------+                             (Pivot)
               (Pivot)                                       |
                  |                             Result: Severe spontaneous
         Predictable balance                    counter-clockwise torque!
```

### 4.1 Class A: High-Density Anchors (Kurogane Iron)
* **Mass Multiplier**: $5.0\times \text{ to } 13.0\times$ standard cedar wood pieces.
* **Physics Equation**:
  $$F_g = m \cdot g = (V \cdot \rho_{\text{iron}}) \cdot 9.81\text{ m/s}^2$$
* **Gameplay Dynamics**:
  * **Anchoring Overhangs**: Used as heavy counter-weights on the short arm of a cantilevered beam, allowing delicate wooden shapes to bridge across open water.
  * **Hazard for Buoyant Dishes**: Sinks floating platforms significantly deeper, reducing clearance above the water trigger volume.
  * **Instant Glass Crusher**: Placing Kurogane Iron atop fragile glass immediately triggers the $1,200\text{ N}$ stress limit, instantly shattering it.

### 4.2 Class B: Eccentric (Asymmetrical CoM) Shapes
* **Mechanic**: The physical center of mass is intentionally displaced from the geometric center:
  $$\vec{r}_{\text{CoM}} = (x_{\text{offset}}, y_{\text{offset}}, 0) \neq (0, 0, 0)$$
* **Rotational Torque on Flat Supports**:
  $$\vec{\tau} = \vec{r}_{\text{CoM}} \times \vec{F}_g = (x_{\text{offset}} \cdot m \cdot g) \hat{k}$$
* **Player Experience**: Even if visually centered on a pedestal, the block spontaneously rotates around the support edge unless counterbalanced by an adjacent shape or wedged into a corner.

---

## 5. Complete Production C# Scripts

### 5.1 `WeightedShape.cs`: Variable Density & CoM Controller
```csharp
using UnityEngine;

/// <summary>
/// Controls mass density scaling and asymmetrical Center-of-Mass overrides in Unity 6 PhysX.
/// </summary>
[RequireComponent(typeof(Rigidbody))]
public class WeightedShape : MonoBehaviour
{
    [Header("Mass Configuration")]
    [Tooltip("Multiplier applied to the base mesh mass (e.g., 8x for Kurogane Iron).")]
    [SerializeField] private float massMultiplier = 8.0f;

    [Header("Center of Mass Offset")]
    [Tooltip("If true, overrides PhysX center of mass with eccentricOffset.")]
    [SerializeField] private bool hasEccentricCoM = false;
    [SerializeField] private Vector3 eccentricOffset = new Vector3(-0.35f, 0f, 0f);

    [Header("Visual Indicators")]
    [SerializeField] private GameObject brassWeightPlugMesh;

    private Rigidbody rb;

    public float MassMultiplier => massMultiplier;
    public bool HasEccentricCoM => hasEccentricCoM;

    private void Awake()
    {
        rb = GetComponent<Rigidbody>();
        ApplyPhysicsProperties();
    }

    public void ApplyPhysicsProperties()
    {
        // 1. Scale total mass
        rb.mass *= massMultiplier;

        // 2. Override Center of Mass in local coordinate space
        if (hasEccentricCoM)
        {
            rb.centerOfMass = eccentricOffset;

            // Position visual brass plug indicator
            if (brassWeightPlugMesh != null)
            {
                brassWeightPlugMesh.transform.localPosition = eccentricOffset;
                brassWeightPlugMesh.SetActive(true);
            }
        }

        // 3. Enforce 2.5D planar physics constraints
        rb.constraints = RigidbodyConstraints.FreezePositionZ | 
                         RigidbodyConstraints.FreezeRotationX | 
                         RigidbodyConstraints.FreezeRotationY;
    }

    private void OnDrawGizmosSelected()
    {
        if (rb != null && hasEccentricCoM)
        {
            Gizmos.color = Color.yellow;
            Vector3 worldCoM = transform.TransformPoint(eccentricOffset);
            Gizmos.DrawSphere(worldCoM, 0.08f);
            Gizmos.DrawLine(worldCoM, worldCoM + Vector3.down * 0.4f);
        }
    }
}
```

### 5.2 `WiiWareStyleLoadSensor.cs`: Cumulative Load & Shatter Monitor
Recreating the WiiWare load-bearing breakable block mechanic using modern continuous normal impulse integration:

```csharp
using System;
using UnityEngine;

/// <summary>
/// Monitors downward gravitational load and block counts atop breakable shapes (WiiWare style).
/// </summary>
public class WiiWareStyleLoadSensor : MonoBehaviour
{
    [Header("Load Limits (WiiWare Rule of Three)")]
    [SerializeField] private int maxStackedBlocksAllowed = 3;
    [SerializeField] private float maxNormalForceNewtons = 1200f;

    [Header("FX References")]
    [SerializeField] private GameObject shatterVfxPrefab;
    [SerializeField] private AudioClip shatterSound;

    private int currentBlocksAtopCount = 0;
    private float currentNormalForce = 0f;
    private bool isBroken = false;

    public event Action OnBlockCrushed;

    private void OnCollisionStay(Collision collision)
    {
        if (isBroken) return;

        float cumulativeImpulse = 0f;
        for (int i = 0; i < collision.contactCount; i++)
        {
            ContactPoint contact = collision.GetContact(i);
            // Verify contact vector is pressing downward onto the top surface
            if (Vector3.Dot(contact.normal, Vector3.down) > 0.45f)
            {
                cumulativeImpulse += collision.impulse.magnitude;
            }
        }

        currentNormalForce = cumulativeImpulse / Time.fixedDeltaTime;

        if (currentNormalForce >= maxNormalForceNewtons)
        {
            TriggerShatter("Excess normal force: " + currentNormalForce + "N");
        }
    }

    public void RegisterBlockPlacedOnTop()
    {
        currentBlocksAtopCount++;
        if (currentBlocksAtopCount > maxStackedBlocksAllowed && !isBroken)
        {
            TriggerShatter("Stacked block count exceeded: " + currentBlocksAtopCount);
        }
    }

    public void RegisterBlockRemovedFromTop()
    {
        currentBlocksAtopCount = Mathf.Max(0, currentBlocksAtopCount - 1);
    }

    private void TriggerShatter(string reason)
    {
        if (isBroken) return;
        isBroken = true;

        Debug.Log("[LoadSensor] Breakable block crushed! Reason: " + reason);

        if (shatterVfxPrefab != null)
        {
            Instantiate(shatterVfxPrefab, transform.position, transform.rotation);
        }

        if (shatterSound != null)
        {
            AudioSource.PlayClipAtPoint(shatterSound, transform.position);
        }

        HapticFeedbackManager.TriggerFailure();
        OnBlockCrushed?.Invoke();

        // Disable collider immediately to plunge resting structures downward
        GetComponent<Collider>().enabled = false;
        Destroy(gameObject, 0.05f);
    }
}
```

---

## 6. Multi-Sensory Player Feedback ("Juice") for Weight

To make weight tangible on glass mobile screens, three sensory channels operate in unison:

1. **Visual Screen-Shake & Dust**:
   * Dropping a Kurogane Iron block onto wood triggers a directional vertical screen shake ($2.5\text{ pixels}$ amplitude over $0.06\text{ seconds}$) and a burst of dust particles at the contact seams.
2. **Dynamic Mass-Modulated Audio**:
   * The audio pitch of collision clacks scales with the inverse cube root of mass:
     $$\text{Pitch} = 1.0 \times \left(\frac{1.0}{\sqrt[3]{\text{Mass}}}\right)$$
   * Standard cedar produces sharp clacks (`800 Hz`). Dense iron produces deep, bass-rich thuds (`120 Hz`).
3. **Calibrated Mobile Haptics**:
   * Standard wood contact triggers a light **$20\text{ms}$** tap.
   * Heavy iron contact triggers a sharp **$60\text{ms}$** high-amplitude shock via iOS `UIImpactFeedbackGenerator(style: .heavy)` or Android `VibrationEffect`.
