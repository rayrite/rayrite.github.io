# Module 04: Visual Themes and World Building Bible

## 1. Aesthetic Philosophy: The 12 Realms of Enlightenment

To support long-term retention across a 200-to-300 level campaign, *Zen Stacker* organizes puzzles into **12 thematic worlds**. Each biome represents a distinct stage of meditative enlightenment, featuring custom color grading, weather shaders, particle systems, and traditional Japanese acoustic instrumentation.

### 1.1 Complete 12-World Thematic Matrix

| World ID | World Title & Environment | Lighting Color Temp & Mood | Predominant Materials | Ambient Particle System | Featured Audio Instrumentation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **World 01** | The Spring Blossom Pond | $5,500\text{ K}$ (Warm morning sunlight) | Hinoki Cedar, River Stone | Drifting pink cherry blossom petals | Japanese 13-string Koto, singing birds |
| **World 02** | Emerald Bamboo Rainforest | $6,200\text{ K}$ (Lush diffuse green) | Bamboo stalks, wet slate | Soft morning mist, water droplets | Bamboo flute (Shakuhachi), water drips |
| **World 03** | Mount Hiei Misty Shrine | $4,800\text{ K}$ (Golden dawn) | Mossy granite, dark bronze | Swirling mountain fog, fireflies | Low wooden temple drum (Taiko), chimes |
| **World 04** | Crystal Ice Pavilion | $8,500\text{ K}$ (Glacial blue twilight) | Glacial ice, tempered glass | Floating snow flurry specks | Glass marimba, crystal singing bowls |
| **World 05** | The Sacred Forge | $2,400\text{ K}$ (Volcanic ember glow) | Kurogane iron, volcanic basalt | Glowing embers, heat haze distortion | Heavy bronze gong, rhythmic anvil strikes |
| **World 06** | Autumn Maple Rapids | $4,200\text{ K}$ (Warm amber afternoon) | Lacquered mahogany, copper | Drifting red and gold maple leaves | Biwa lute, rushing water rapids |
| **World 07** | Spirit Lantern Dusk | $3,200\text{ K}$ (Deep purple twilight) | Luminous spirit runes, wood | Floating paper lanterns, spirit wisps | Pentatonic glass chimes, distant crickets |
| **World 08** | Shogun's Fortress | $5,000\text{ K}$ (Shadowed courtyard) | Black pine, iron armor brackets | Drifting courtyard dust, fallen leaves | Solemn Shamisen lute, wooden clackers |
| **World 09** | Celestial Moon Pond | $9,000\text{ K}$ (Midnight lunar radiance)| Polished white marble, jade | Starlight sparkles, glowing lotus | Ethereal synth pads, silver bells |
| **World 10** | Inverted Sky Sanctuary | $6,000\text{ K}$ (Surreal cloudscape) | Anti-gravity stone, gold leaf | Clouds flowing upside-down | Reversed flute echoes, wind gusts |
| **World 11** | Dry Sand Karesansui | $5,200\text{ K}$ (Arid midday Zen sun) | Raked white gravel, river boulders| Blown sand grains, heat shimmer | Minimal wooden clack (Hyoshigi) |
| **World 12** | Grandmaster Nirvana | $4,500\text{ K}$ (Harmonious gold glow) | Golden Kintsugi, imperial jade | Swirling golden divine dust | Full traditional orchestra, singing bowls |

---

## 2. Dynamic Audio Engineering: Adaptive Zen Soundscapes

Audio in *Zen Stacker* is not merely background music; it is an interactive physical instrument.

```
       [ AUDIO MODULATION SYSTEM ]
  +--------------------------------------------------------+
  |  PHYSICAL IMPACT SFX:                                  |
  |  Pitch = BasePitch * (1.0 / cbrt(Mass))                |
  |  * Small Cedar Wedge: Crisp tick (1,200 Hz)            |
  |  * Kurogane Iron Block: Deep bass thud (110 Hz)        |
  +---------------------------+----------------------------+
                              |
                              v
  +--------------------------------------------------------+
  |  INTERACTIVE HARMONIC SNAP:                            |
  |  Perfect Alignment triggers pentatonic scale chord:    |
  |  C4 -> D4 -> E4 -> G4 -> A4                            |
  +---------------------------+----------------------------+
                              |
                              v
  +--------------------------------------------------------+
  |  LEVEL VICTORY SWELL:                                  |
  |  Resonant Tibetan singing bowl strike (174 Hz)         |
  |  Mixed with warm bamboo flute cadence.                 |
  +--------------------------------------------------------+
```

### 2.1 Mass-Modulated Collision Audio
Every collision triggers a high-resolution 24-bit physical sample selected from a library of 32 authentic Japanese wooden, ceramic, and iron strikes.
* The playback pitch is mathematically linked to the colliding body's mass:
  $$\text{Pitch} = \text{BasePitch} \times \left(\frac{1.0}{\sqrt[3]{\text{Mass}}}\right)$$
* Velocity scaling controls gain: impacts under $0.5\text{ m/s}$ produce soft wooden friction ticks; heavy impacts above $2.5\text{ m/s}$ trigger bass-heavy impacts with subtle low-frequency shelf boost.
