# ScamShield Marketplace — AI Generation Prompts
**Document ID:** SSM-VID-002
**Project:** Venture313 Buildathon 2026 — Video Submission
**Version:** 1.0.0
**Date:** September 2026
**Tools:** Pollo.ai (video) + OpenArt.ai (still frames / compositing sources)

---

## How to Use This Document

Two tools, two jobs:

| Tool | Job | Output |
|---|---|---|
| **OpenArt.ai** | Generate individual still frames for each scene — character shots, environments, the Spirit, the Laser sequence backgrounds | JPEG / PNG for import into video editor |
| **Pollo.ai** | Generate short video clips (4–8 seconds) with camera motion and character action | MP4 clips for assembly in video editor |

**Recommended workflow:**
1. Use **OpenArt.ai** to generate key frames (proof fast, low cost)
2. Approve the look and tone
3. Use **Pollo.ai** to generate the motion clips (more expensive, generate after look is approved)
4. Assemble in your video editor with Sole Waves Chuck Chop on the timeline

---

## OpenArt.ai — Global Settings

### Lo-Fi Proofing Settings (Cheap, Fast)
| Setting | Value |
|---|---|
| **Model** | SDXL Lightning or DreamShaper XL |
| **Resolution** | 512×512 or 768×768 |
| **Steps** | 20–25 |
| **CFG/Guidance Scale** | 7.0 |
| **Sampler** | DPM++ 2M Karras |
| **Batch** | 4 images per prompt (pick best) |

### Hi-Fi Production Settings
| Setting | Value |
|---|---|
| **Model** | FLUX.1 Pro or Stable Diffusion 3.5 Large |
| **Resolution** | 1344×768 (cinematic 16:9) or 1024×1024 (square for phone close-ups) |
| **Steps** | 40–50 |
| **CFG/Guidance Scale** | 7.5 |
| **Sampler** | DPM++ 3M SDE or Euler a |
| **Batch** | 2–3 images per prompt (higher quality per generation) |

### Universal Negative Prompt (add to every generation)
```
cartoon, anime, illustration style, blurry, low quality, distorted face, 
watermark, text artifacts, oversaturated, bad anatomy, extra fingers, 
deformed hands, plastic skin, AI artifacts, corporate stock photo, 
cheesy expression, generic smile, generic stock people
```

---

## Pollo.ai — Global Settings

### Lo-Fi Proofing Settings
| Setting | Value |
|---|---|
| **Model** | Standard / Base model |
| **Resolution** | 480p |
| **Duration** | 4 seconds |
| **Motion intensity** | Medium |
| **Batch** | Generate 2 versions per prompt |

### Hi-Fi Production Settings
| Setting | Value |
|---|---|
| **Model** | Pro / Premium model (highest available) |
| **Resolution** | 1080p |
| **Duration** | 4–8 seconds (scene-dependent) |
| **Motion intensity** | Scene-dependent (see individual prompts) |
| **Batch** | Generate 2–3 versions; pick best |

---

## Scene 1 — Detroit Skyline (Cold Open)

### OpenArt.ai Prompt — Lo-Fi Proof
```
Detroit Michigan skyline at golden hour, wide establishing shot, 
Renaissance Center towers reflecting warm orange sunset light, 
Detroit River foreground with light reflections, Ambassador Bridge 
visible in background, dramatic amber and blue sky contrast, 
photorealistic style, cinematic widescreen composition
```

### OpenArt.ai Prompt — Hi-Fi Production
```
Cinematic Detroit Michigan skyline at magic golden hour, wide angle 
establishing shot, Renaissance Center glass towers glowing amber in 
sunset light, Detroit River in foreground with orange light reflections 
across the water, Ambassador Bridge in middle distance, dramatic split 
sky — warm amber below, deep cerulean blue above, lens flare from 
setting sun, photorealistic 8K detail, shot on RED cinema camera, 
cinematic color grade, extreme sharpness, architectural photography quality
```

### Pollo.ai Prompt — Lo-Fi Proof
```
Detroit skyline at golden hour, slow camera push forward from river level, 
Renaissance Center towers in background, warm amber sunset light, 
cinematic establishing shot, gentle water reflections, 4 seconds
```

### Pollo.ai Prompt — Hi-Fi Production
```
Cinematic Detroit Michigan skyline at golden hour magic light, drone camera 
slowly drifting forward and slightly upward above the Detroit River, 
Renaissance Center glass towers catching amber sunset, Ambassador Bridge 
in background, warm orange reflections rippling on the water surface, 
dramatic sky transition from amber to deep blue at zenith, photorealistic, 
cinematic color grade, smooth dolly motion, no shaking, 6 seconds
```
**Motion intensity:** Low (slow, dignified)

---

## Scene 2 — The Bait (Split Screen Listings)

### OpenArt.ai Prompt A — Facebook Marketplace Car Listing on Phone

**Lo-Fi Proof:**
```
Close-up smartphone screen showing Facebook Marketplace car listing, 
2019 Toyota Camry listing priced $1800, suspicious deal, phone held 
in hand with dark background, subtle red digital glow border around 
listing, moody lighting, flat lay photography style
```

**Hi-Fi Production:**
```
Macro photography of smartphone screen showing Facebook Marketplace car 
listing interface, listing reads "2019 Toyota Camry $1,800 - Military 
Deployment Must Sell", suspiciously low price visible, a subtle ominous 
pulsing red digital outline traces the listing border, hand holding phone 
barely visible at edge, moody dark background, shallow depth of field 
with phone screen sharp, cinematic tension, 8K detail, no cartoon elements
```

### OpenArt.ai Prompt B — Detroit Coney Island Interior

**Lo-Fi Proof:**
```
Classic American diner interior, Detroit Coney Island, chrome counter 
stools, red vinyl seats, large plate glass windows, afternoon light 
streaming in, empty counter seats, vintage neon sign, photorealistic, 
warm nostalgic lighting
```

**Hi-Fi Production:**
```
Authentic Detroit Coney Island diner interior, classic American lunch 
counter with chrome stools and red vinyl seats, large plate glass window 
with afternoon Detroit street visible outside, vintage neon signage 
reflecting on chrome surfaces, Formica counter top, coffee cups, 
ketchup bottles, warm amber afternoon light casting long shadows, 
photorealistic architectural interior photography, 35mm film grain, 
shallow depth of field, rich saturated colors
```

---

## Scene 3 — Marcus (The Almost-Mistake)

> **Note to Cooly:** These prompts describe a character type. Update the physical description to match your actual casting. The goal is an authentic Detroit thirty-something who reads as "real person making a real decision" — not a stock photo person.

### OpenArt.ai — Marcus at Coney Counter

**Lo-Fi Proof:**
```
Black man in his late 30s sitting at diner counter, Detroit Lions baseball 
cap, casual streetwear, looking intently at smartphone screen, concerned 
expression, diner environment, natural lighting, photorealistic portrait
```

**Hi-Fi Production:**
```
Authentic portrait of a Black man in his late thirties at a classic 
Detroit Coney Island diner counter, wearing a Detroit Lions cap and 
casual streetwear, looking intently downward at smartphone screen with 
a mixture of excitement and dawning uncertainty on his face, warm diner 
lighting from overhead fixtures, bokeh background of chrome and vinyl 
diner interior, 35mm Kodak Portra film aesthetic, skin texture visible, 
genuine expression — not posed, natural hands on phone, cinematic portrait
```

### OpenArt.ai — Phone Screen Close-Up (Zelle Payment)

**Lo-Fi Proof:**
```
Smartphone screen close-up showing Zelle payment app, recipient field 
filled in, amount $1800 entered, SEND button visible, thumb hovering 
above screen about to tap, tension in the frame, overhead shot, 
dark moody background
```

**Hi-Fi Production:**
```
Extreme macro close-up of smartphone screen showing Zelle payment 
application, recipient name visible (blurred), amount reads "$1,800.00", 
blue SEND button prominent, a thumb visible at bottom of frame hovering 
2cm above the screen, tension frozen at the moment of decision, overhead 
angle, dark vignette background, shallow depth of field with screen 
perfectly sharp, cinematic still life, high contrast lighting
```

---

## Scene 4 — The Save (Keisha Arrives)

### OpenArt.ai — Keisha at Coney Counter

**Lo-Fi Proof:**
```
Black woman in her mid thirties, confident smile, sitting at diner 
counter, placing smartphone on counter between two people, knowing 
expression, casual Detroit style, diner environment, photorealistic
```

**Hi-Fi Production:**
```
Authentic portrait of a Black woman in her mid-thirties, confident 
energy with a knowing half-smile, sitting at a classic Detroit diner 
counter, placing her smartphone face-up on the Formica counter between 
two seats, the gesture of someone who has already won the argument and 
knows it, casual streetwear, warm diner light, 35mm film look, genuine 
expression, not stock photo, natural body language, bokeh diner background
```

### OpenArt.ai — Two-Shot: Marcus and Keisha at Counter

**Lo-Fi Proof:**
```
Two Black people in their 30s at a Detroit diner counter, man looking 
at phone, woman setting phone on counter between them, collaborative 
moment, warm diner lighting, natural expressions, photorealistic
```

**Hi-Fi Production:**
```
Medium two-shot of a Black man and Black woman in their thirties at a 
classic Detroit diner lunch counter, man looking at her phone she just 
placed on the counter with slightly wide eyes, woman leaning back with 
arms crossed and a knowing expression, warm amber diner lighting, 
genuine human chemistry, 35mm Portra film look, bokeh background, 
casual streetwear, authentic Detroit diner chrome and vinyl visible
```

---

## Scene 5 — The Analysis (Product Demo)

> **Best practice:** For the ScamShield Verdict Card animation, use screen recording of the actual app or a Figma prototype animated in Figma/ProtoPie. AI image generation is not the right tool for a UI demo sequence. These prompts support the surrounding shots only.

### OpenArt.ai — Phone Screen Held Between Two People

**Lo-Fi Proof:**
```
Close-up of smartphone being held between two pairs of hands, screen 
glowing with a red alert interface, dark background, dramatic lighting, 
two people leaning in to look at phone together
```

**Hi-Fi Production:**
```
Dramatic close-up of a smartphone screen glowing a vivid red, being 
held between two pairs of hands (one set of hands barely visible at 
each side of frame), a warning verdict visible on screen (red 
background, white text), dark atmospheric background, the phone is 
the only light source in the frame, cinematic product photography, 
high contrast, 8K detail, the tension of a discovery moment
```

---

## Scene 6 — The Laser Sequence ⚡

> **Best practice for this scene:** The laser sequence is best built in your video editor using motion graphics templates and particle effects — NOT AI video generation. Use OpenArt.ai to generate the static background environment only, then add the text/laser animation in DaVinci Resolve, CapCut, or After Effects.

### OpenArt.ai — Laser Sequence Background

**Lo-Fi Proof:**
```
Dark black background with subtle neon cyan grid lines, retro techno 
aesthetic, 1990s Detroit electronic music visual, geometric precision, 
glowing amber accent lines, no text, clean dark background
```

**Hi-Fi Production:**
```
Minimalist retro-techno dark background, pitch black with subtle 
receding perspective grid in neon cyan (#00F5FF), secondary accent 
lines in deep amber (#FF8C00), Detroit techno 1996 aesthetic — think 
Underground Resistance visual vocabulary, clean geometric precision, 
faint lens flare at vanishing point, no text or logos, pure environment 
background for motion graphics compositing, 16:9 widescreen, 8K
```

### OpenArt.ai — ScamShield Logo Glow Reference Frame

**Lo-Fi Proof:**
```
Shield logo icon glowing bright cyan on dark background, neon glow 
effect, retro electro aesthetic, centered composition, particle 
energy around edges, dramatic product logo reveal
```

**Hi-Fi Production:**
```
Minimalist shield logo icon centered on pitch black background, 
radiating intense cyan neon glow (#00F5FF) with amber secondary 
halo, particle energy trails orbiting the shield, retro-techno 
Detroit aesthetic, cinematic product reveal framing, outer glow 
diffuses into dark background, no other elements, pure logomark 
power shot, 8K, HDR lighting simulation
```

### Pollo.ai — Laser Fire Animation Reference Clip

> This clip generates a reference for the laser fire visual — customize in post to sync with the beat.

**Lo-Fi Proof:**
```
Neon cyan laser beam fires from center of dark screen toward target 
word, explosion of particles on impact, retro sci-fi aesthetic, 
dark background, 4 second clip
```

**Hi-Fi Production:**
```
Cinematic motion graphics: centered neon cyan laser beam fires from 
a glowing shield emblem toward a bold target word in the frame, 
on impact the word shatters into bright particle fragments that 
scatter offscreen in all directions, residual amber glow where the 
word was, pitch black background, retro-techno Detroit aesthetic, 
crisp 1080p, 4 seconds — one full laser fire and particle resolution
```
**Motion intensity:** High

---

## Scene 7 — Detroit Celebrates

### OpenArt.ai — Eastern Market Fist Bump

**Lo-Fi Proof:**
```
Two Black people at a Detroit farmers market stall, fist bumping, 
happy expressions, looking at phone showing green success screen, 
Saturday morning market atmosphere, vegetables and flowers in 
background, photorealistic, warm natural light
```

**Hi-Fi Production:**
```
Candid-style photograph of two Black people at a Detroit Eastern Market 
produce stand, both smiling genuinely, sharing a fist bump across the 
counter, one person holding a smartphone with a green SAFE verdict screen 
visible, Saturday morning market energy, produce stalls and flowers in 
warm bokeh background, 35mm film aesthetic, natural morning light, 
authentic Detroit market atmosphere, no posed expressions
```

### OpenArt.ai — The Older Woman at Kitchen Table

**Lo-Fi Proof:**
```
Black woman in her 60s sitting at kitchen table with laptop, pointing 
at laptop screen, triumphant expression, "not today" energy, 
warm home kitchen, natural light, photorealistic
```

**Hi-Fi Production:**
```
Candid portrait of a Black woman in her sixties sitting at a warm 
Detroit home kitchen table, laptop open in front of her, she is 
pointing at the screen with one firm finger and looking directly into 
the camera with the most satisfied, knowing expression — the expression 
of someone who has seen this before and is done with it, warm morning 
light from kitchen window, natural home environment, reading glasses 
on, 35mm film aesthetic, authentic not posed
```

### OpenArt.ai — DPD Illustrated (if archival not available)

**Lo-Fi Proof:**
```
Retro 1990s Detroit style illustration of a police officer in blue 
uniform doing a joyful dance move with a civilian on a city street, 
neon cyan and amber color palette, retro-techno geometric style, 
community celebration, Detroit street background
```

**Hi-Fi Production:**
```
Stylized retro-techno illustration in the aesthetic of Detroit 
Underground Resistance visual art, depicting a Detroit Police officer 
in dress blue uniform mid-dance-step alongside a Detroit civilian, 
both in joyful motion, set on a Detroit street with recognizable 
urban geometry, color palette: neon cyan (#00F5FF), amber (#FF8C00), 
and white on deep black background, geometric design language, 
1990s Detroit electronic music artwork style, celebration energy, 
ScamShield shield logo visible on officer's phone screen
```

### Pollo.ai — Campus Martius Celebration

**Lo-Fi Proof:**
```
People celebrating on a Detroit plaza, two people looking at a phone 
with big smiles, shoulder shimmy dance, urban outdoor setting, 
sunny day, joyful energy, 4 seconds
```

**Hi-Fi Production:**
```
Candid documentary-style video of two people on a Detroit urban plaza 
(Campus Martius style — water features, surrounding buildings), both 
looking at a smartphone between them, spontaneous shoulder shimmy 
celebration at something they saw on screen, natural Detroit afternoon 
light, genuine joy, authentic movement, not choreographed, 
documentary cinematography style, handheld camera feel, 5 seconds
```
**Motion intensity:** Medium-High

---

## Scene 8 — The Spirit of Detroit

> **Strong recommendation:** Do NOT use AI to generate the Spirit of Detroit for the animation effect. The statue is too specific and AI will hallucinate wrong details. Instead:
>
> **Recommended approach:**
> 1. Photograph or find a high-resolution public domain image of the Spirit of Detroit statue
> 2. Import into After Effects / DaVinci Fusion / CapCut
> 3. Use Puppet Pin tool (After Effects) or a subtle face warp to create the smile animation
> 4. Add the ScamShield text orbit as a motion graphics layer
> 5. Color grade with warm amber lift to match the golden hour palette
>
> The prompts below generate **reference frames and texturing inspiration** — not the final animation source.

### OpenArt.ai — Spirit of Detroit Artistic Reference (not final)

**Lo-Fi Proof:**
```
Large bronze sculpture of a seated man, golden hour afternoon light, 
warm amber light on bronze surface, Detroit Michigan, architectural 
photography, dramatic lighting from low sun angle, deep shadows, 
photorealistic, outdoor monument photography
```

**Hi-Fi Production:**
```
Dramatic architectural photography of a large bronze civic monument 
of a seated figure on Jefferson Avenue Detroit, warm golden afternoon 
light casting amber glow across the bronze patina surface, deep 
directional shadows from low sun angle, figure slightly backlit creating 
rim light on shoulder and head, the bronze surface texture catching 
highlights, surrounding urban Detroit architecture softly out of focus, 
Kodak Portra 400 film aesthetic, medium telephoto compression, 8K
```

### OpenArt.ai — Globe Glow Effect (for compositing)

**Lo-Fi Proof:**
```
Glowing orb or globe in hand, amber and cyan light, warm glow radiating 
outward, dramatic dark background, the word ScamShield orbiting the globe 
in glowing text, close-up
```

**Hi-Fi Production:**
```
Dramatic product shot: a hand (bronze-toned, sculptural) holding a 
small glowing globe, the globe radiates a warm amber and cyan light 
outward in a soft halo, the word "ScamShield" appears as glowing 
amber text orbiting around the globe at a slight angle, background 
is deep black, god-ray light effect from the globe illuminates the 
hand, cinematic product photography, 8K, HDR lighting, compositing 
reference frame
```

### Pollo.ai — Slow Camera Push Toward Bronze Face

**Lo-Fi Proof:**
```
Slow camera push toward the face of a large bronze sculpture, warm 
afternoon light, documentary style, 4 seconds
```

**Hi-Fi Production:**
```
Cinematic slow camera push in toward the face of a large seated bronze 
civic statue in Detroit Michigan, golden hour warm amber light on the 
bronze patina, the face gradually fills the frame as the camera approaches, 
dramatic tension of the slow zoom, 35mm film aesthetic, steady camera 
motion with no shake, architectural documentary cinematography, 
deep focus, 6 seconds
```
**Motion intensity:** Very Low (this is the quiet finale)

---

## Scene 9 — End Card

> **Recommendation:** Build the end card entirely in your video editor — no AI generation needed. Black background, ScamShield wordmark, URL, Venture313 badge. Three seconds. Clean.

### OpenArt.ai — Logo Lockup Reference Frame (if needed)

**Lo-Fi Proof:**
```
Clean minimal tech logo lockup on black background, shield icon with 
company name wordmark, professional brand identity design, centered 
composition
```

**Hi-Fi Production:**
```
Professional brand identity end card, pitch black background, centered 
bold shield logo icon in cyan and amber, company name in clean modern 
sans-serif typeface below the mark, URL text below in smaller weight, 
minimal design, high contrast, premium product branding feel, 8K
```

---

## Scene-Specific Priority Matrix

Which scenes are worth spending production AI credits on vs. which are better handled in post:

| Scene | AI Generate? | Best Tool | Notes |
|---|---|---|---|
| 1 — Detroit Skyline | ✅ YES | Pollo.ai (video) | Beautiful camera motion pays off here |
| 2 — Listing Screens | 🟡 PARTIAL | OpenArt.ai (phone close-up only) | UI screens: screen-record real phone |
| 3 — Marcus at Counter | ✅ YES | OpenArt.ai | Character frame + Coney interior |
| 4 — Keisha Arrives | ✅ YES | OpenArt.ai | Character frame + two-shot |
| 5 — Analysis UI | 🔴 NO | Screen record app / Figma | AI cannot render your actual UI |
| 6 — Laser Sequence | 🟡 BG ONLY | OpenArt.ai (background) | Motion graphics in video editor |
| 7 — Celebrates | ✅ YES | OpenArt.ai + Pollo.ai | Real community energy shots |
| 7C — DPD Dance | 🟡 IF NEEDED | OpenArt.ai (illustrated) | Archival first; AI illustrated as fallback |
| 8 — Spirit | 🔴 NO for animation | OpenArt.ai (reference only) | Puppet Pin / warp in After Effects |
| 9 — End Card | 🔴 NO | Video editor | Pure motion graphics |

---

## Prompt Engineering Notes

### Consistency Across Shots
For character consistency across multiple OpenArt.ai generations:
- Save your best lo-fi result for Marcus as an **Image Reference** (use OpenArt.ai's "Reference Image" or "IP-Adapter" feature)
- Generate subsequent shots of the same character using the reference image to maintain face/style consistency
- The Detroit Coney Island environment: generate one establishing interior shot, then use it as environment reference for subsequent close-ups

### Cinematic Coherence
All production prompts specify either "35mm Kodak Portra film aesthetic" or "35mm film look" — this creates visual unity across scenes even though they were generated separately. The warm, slightly desaturated film aesthetic is also very Detroit and period-appropriate for a track from 1996.

### The Laser Sequence Is Motion Graphics, Not AI Video
No current AI video tool will generate the beat-synced 4-shot laser sequence with the precision this scene requires. Build it in your editor:
- Place beat markers on the four laser hits
- Use a text animation template (dramatic slam in) for each of the four words
- Apply a particle explosion transition on each beat
- The shield logo glow pulse: simple scale keyframe + glow effect

### Detroit Authenticity Signal
In all character and location prompts, the phrase "authentic not posed" or "genuine expression" is doing important work. Stock photo body language will undermine the entire concept. If an OpenArt.ai result looks like a Getty Images photo, reject it and regenerate.
