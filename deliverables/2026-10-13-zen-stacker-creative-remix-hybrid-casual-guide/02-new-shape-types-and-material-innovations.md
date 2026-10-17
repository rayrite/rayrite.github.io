# Module 02: New Shape Types and Material Innovations

## 1. Innovative Shape Geometries Beyond the Original Formula

While *Art of Balance* relied on standard 2D extruded prisms, *Zen Stacker* introduces 7 groundbreaking shape classes designed specifically for 3D tactile mobile gameplay.

### 1.1 Complete Specialized Shapes Taxonomy

| Shape Class | Physical Blueprint & Silhouette | Unique Physics Mechanic | Strategic Puzzle Utility |
| :--- | :--- | :--- | :--- |
| **Yin-Yang Entangled Shapes** | Two interlocking teardrop blocks connected by a dynamic virtual spring tether. | Moving Piece A applies tension forces to Piece B; if tether stretches $> 3.0\text{ m}$, spring pulls violently. | Forces simultaneous dual-tower construction on separated platforms. |
| **Gelatinous Mochi Blocks** | Soft-body squishy cube with internal spring-damper mesh. | Absorbs kinetic impact energy from dropped blocks above; sags and deforms under heavy load. | Acts as a shock absorber for heavy iron pieces, but threatens stack verticality. |
| **Rotary Cog / Gear Blocks** | Cylindrical disk with 12 beveled involute gear teeth ($R = 1.0\text{ m}$). | Interlocks with adjacent cogs or motor wheels; rotates around center pin when torqued. | Used to build kinetic mechanisms and bridge gaps via interlocking teeth. |
| **Prismatic Light Crystals** | Octagonal optical prism ($1.2 \times 1.2 \times 1.0\text{ m}$) with refractive internal core. | Refracts and reflects real-time sunbeams at precise $90^\circ$ angles. | Must balance the tower while simultaneously aligning the light beam to strike a target bell. |
| **Aerostatic Helium Lanterns** | Silk paper lantern cylinder with negative effective mass ($M = -0.5\text{ kg}$). | Experiences constant upward buoyant force ($F_b = +12.0\text{ N}$ upward). | Acts as an airborne balloon; can be used to lift sagging cantilevered overhangs! |
| **Liquid Mercury Cavity Shapes** | Hollow cedar box containing simulated internal liquid mercury particles. | Liquid sloshes to the lowest side when tilted, dynamically and continuously shifting the Center of Mass! | Highly unstable rolling balance; must be stabilized quickly before fluid momentum flips it. |
| **Phase-Shifting Spirit Blocks** | Ethereal translucent runic block with pulsing boundary edges. | Rhythmic 4-second cycle: $2.5\text{s}$ solid physical collider $\to 1.5\text{s}$ non-colliding ghost. | Requires stacking blocks on it while solid, then surviving the drop when it phases out! |

---

## 2. Deep Dive: Dynamic Liquid Core Shapes

The **Liquid Mercury Cavity Shape** represents a major technological leap over the static rigidbodies of 2010.

```
       [ RESTING FLAT ]                               [ TILTED 10 DEGREES ]
   +-----------------------+                       +-----------------------+
   | (Hollow Cavity)       |                       |                       |
   |                       |                       |         / / / /       |
   | [=== MERCURY POOL ===]|                       |       / / / /         | <--- Mercury sloshes
   +-----------^-----------+                       +======/ / / /==========+      to lowest corner!
            (Center)                                       ^
     Center of Mass is centered.                CoM shifts 0.45m to the right!
                                                Result: Runaway tipping cascade!
```

### 2.1 The Sloshing Mechanics
* The block contains 8 internal mass-less raycast probes or a simplified 2D fluid particle cluster inside its hollow bounding volume.
* When the block lists by angle $\theta$, the internal fluid mass $m_f$ shifts toward the lower edge:
  $$x_{\text{fluid}} = R_{\text{cavity}} \cdot \sin(\theta)$$
* The `Rigidbody.centerOfMass` is updated dynamically every `FixedUpdate()` step, creating runaway momentum. If a player places this piece crookedly, it will self-accelerate into a violent topple unless wedged between two immovable uprights.

---

## 3. Deep Dive: Prismatic Light-Refracting Crystals

This shape integrates puzzle-solving optics with balance physics.

```
       Sunlight Source Beam
               |
               v
       +---------------+
       |   PRISMATIC   |
       |    CRYSTAL    | -------> Refracted 90-degree Beam
       +---------------+                   |
                                           v
                                   [ LOTUS RECEIVER ]
                                (Lights up: Level Cleared!)
```

### 3.1 Optics & Beam Reflection Rules
1. A directional laser sunbeam emanates from an environmental golden pagoda above the pond.
2. When the beam strikes the crystal's top face, a `LineRenderer` casts a refracted ray at an angle determined by Snell's Law ($n = 1.52$ glass index).
3. The player must rotate and balance the crystal such that the exit beam strikes the **Golden Lotus Receiver** mounted on the shoreline.
4. Level completion requires **both**:
   * Holding balance for the 3.0-second stability countdown.
   * Maintaining continuous beam illumination on the receiver throughout the countdown!
