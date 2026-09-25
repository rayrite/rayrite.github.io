# COMBINED MARKDOWN - combine

_Generated 2026-09-24 23:51:03 | 5 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\bsh\docs\combine_

## Contents

1. audio-ui-platform.md
2. gameplay-loop.md
3. levels-progression.md
4. physics-materials.md
5. visual-style.md

---

<!-- ====================================================================== -->
<!-- FILE: audio-ui-platform.md -->
<!-- ====================================================================== -->

# Art of Balance — Audio, UI/Flow, and Platform Research

Project: Balance Stack Hero 2026 (clone of *Art of Balance*, Shin'en Multimedia, WiiWare 2010; remakes *Art of Balance TOUCH!* 3DS 2012, Wii U 2014, PS4 2016, Switch 2018)
Researcher: games researcher (web sources only) — compiled 2026-09-24
Every substantive claim is tagged `[confirmed: URL]` or `[inferred]`. Where facts differ per version, the version is named.

---

## 1. Audio

### 1.1 Composer and release facts
- The score for every version was composed by **Martin Schioeler (Schjøler)**, a Danish freelance composer who has been Shin'en's lead composer since the GBA era (he used Bernhard Wodok's tracker + the GAX sound engine on GBA, and Shin'en's DSX engine on DS). Credits: Art of Balance (Wii) 2010-03-26, TOUCH! (3DS) 2012-05-24, Wii U 2014-09-25, PS4 2016-05-31, Switch 2018-10-04. [confirmed: https://www.vgmpf.com/Wiki/index.php?title=Martin_Schj%C3%B8ler]
- **Shin'en officially released the soundtrack for free** in December 2014 (around the Wii U launch); it is still distributed by them and mirrored (composer credit: Martin Schioeler, ℗ Shin'en Multimedia GmbH, 2014). A full copy is on the Internet Archive, tagged: *Downtempo, Trip Hop, New Age, Ambient, Frutiger Aero*. [confirmed: https://archive.org/details/art-of-balance-soundtrack , https://soundtrack.shinen.com/preview_artofbalance.html]
- The commercial/official album is **12 tracks, ~24 minutes** total, genre tagged "Easy Listening" on Apple Music. [confirmed: https://music.apple.com/us/album/art-of-balance-soundtrack/1661726912]

### 1.2 Track structure = music map (very useful for our clone)
The official OST doubles as a complete enumeration of the game's music contexts:
`Main Menu · Level Selection · World A · World B · World C · World D · World E · World F · World G · World H · Challenges · Credits` [confirmed: https://archive.org/details/art-of-balance-soundtrack]
- So: **one dedicated looping track per world (A–H), plus separate cues for Main Menu, Level Selection, the Challenges variants, and a Credits song.** File sizes (2–6.6 MB) imply ~1.5–5 min loops. [confirmed sizes: archive.org; loop-length: inferred from 24-min/12-track average of 2 min]
- Rips confirm the WiiWare original (2010) already had per-world tracks plus "Challenge", "Level Complete", "Level Selection", "Credits" entries in its rip, and the Wii U rip (2014, 18 files) includes ultra-short win cues (e.g. a ~0:06 "Level Ok" jingle) alongside "In Game 1–8" world tracks. [confirmed via search snippets of: https://downloads.khinsider.com/game-soundtracks/album/art-of-balance-wii-gamerip-2010 , https://downloads.khinsider.com/game-soundtracks/album/art-of-balance-2014-wii-u — note: khinsider blocks direct fetch; treat titles as rip track-list names, i.e. the "Level Complete"/"Level Ok" items are the win jingle]

### 1.3 Genre and mood per theme
- The official word for every version: each of the worlds "has its own unique lounge style". [confirmed: https://art-of-balance.shinen.com/wii/about.php , https://art-of-balance.shinen.com/3ds/about.php , https://art-of-balance.shinen.com/wiiu/about.php] Nintendo's own Switch store copy says: "With a relaxing lounge soundtrack and 8 beautiful environments…". [confirmed: https://www.nintendo.com/us/store/products/art-of-balance-switch/]
- Reviewer vocabulary across versions: "serene soundtrack" (Wikipedia reception summary) [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance]; "gloriously soothing lounge soundtrack" (3DS TOUCH!) [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch]; "The music, meanwhile, is jazzy, relaxing, and fits perfectly with the game… there aren't a huge number of tracks, but what they have is so good you won't mind listening" (Wii U) [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance]; "gentle tunes keep things meditative and comfy" (Wii U) [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]; "a mellow yet somehow inviting musical beat" opening on Switch [confirmed: https://www.cubed3.com/games/reviews/nintendo-switch/art-of-balance].
- WiiWare-era dissent worth noting: Nintendo Life found the original's tracks "offbeat… plenty of booming bass beats", "quirky", but "most tracks tend to sound very similar in style" and "can become a bit repetitive" (audio scored "slightly average"). Cubed3 countered: "Zany, yet serene, backing tracks are present for each world… tunes that never become annoying, even when you need to retry a level for the umpteenth time… sublime music". [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance , https://www.cubed3.com/games/reviews/wii/art-of-balance-3]
- **Synthesis [inferred]:** the score is downtempo/electronic **lounge — jazzy, trip-hop-adjacent, "spa/meditation" mood**, one distinct vibe per world (world music-palette = world identity), low dynamic range, loop-friendly on purpose (retries are the core verb).

### 1.4 Does music react to gameplay tension?
- No source describes interactive/layered music. The music unit is the *world*, not the game state; challenge levels get their own single track ("Challenges"); win/fail is punctuated by short jingles/SFX instead (see 1.2/1.5). The only "tension" audio described anywhere is the fixed **3-second stability countdown** at level end (visual lights on Wii; "countdown shortened in versions following the original" per Wikipedia) — a timing/feedback device, not a musical one. [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance , https://en.wikipedia.org/wiki/Art_of_Balance]
- **[inferred] Verdict: the soundtrack is static per-world; there is no adaptive/stinger system.** Our clone may optionally add subtle ducking/filtered layers during the final countdown as a modernization, but fidelity to the original means: no reactive music.

### 1.5 SFX inventory (from reviews + store copy; grouped for our audio plan)
- **Pickup/grab & placement:** placement is sonically "wooden": "you'll hear a satisfying clunk as though you were using real wooden blocks" (Wii U NL) [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance]; "each piece makes delightfully accurate sounds as they clink together and tumble into the equally well-done water sound effects" [confirmed: https://www.dualshockers.com/review-art-of-balance-watch-the-blocks-fall-along-with-your-dreams/]. **[inferred]:** a grab sound + per-impact wood clink/thud whose loudness scales with collision energy; rolling/tumbling loops are plausible given "tumble into the water".
- **Water/fail:** shapes falling in water is the fail state — water splash SFX confirmed both by "Don't let any shape fall into the water!" (official, all versions) [confirmed: https://art-of-balance.shinen.com/wii/about.php] and by review splash descriptions; on 3DS the water "splash[ed] the screen" visually, an effect ported reviewers missed on Wii U ("doesn't seem to splash the screen anymore if a block falls in") [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch]. **[inferred]:** fail sting = big splash (+ tower-collapse clatter) rather than a separate "game over" theme.
- **Success:** level completion jingle exists ("Level Complete" in the 2010 rip; "Level Ok" ~0:06 in the 2014 rip — see 1.2); preceded by the 3-light/3-second confirmation (see 3.3). [confirmed via khinsider track names above; countdown lights: NL review]
- **Special blocks:** glass-block shatter, timer-block countdown/disappearance, fire-shape explosion, gravity-flip whoosh are implied by the mechanic write-ups ("Glass blocks shatter…", "timer blocks disappear…", "explodes on contact", "inverts gravity") [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch , https://art-of-balance.shinen.com/3ds/about.php] — **[inferred]** these need distinct destruction/trigger SFX; the original almost certainly has one sound per event.
- **UI/menu:** "quirky sound effects to enjoy throughout the game's many levels" (NL Wii) [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance]; separate Main-Menu and Level-Selection music tracks imply distinct menu navigation stingers. **[inferred]** hover/confirm/back UI blips, world-unlock fanfare (see awards, 3.4).
- **Voice:** "A calming female voice chips in with advice and allows you to try out each new part as it is encountered" (WiiWare original) — a tutorial/announcer voice. [confirmed: https://www.cubed3.com/games/reviews/wii/art-of-balance-3] Note: **Switch store copy confirms linear PCM surround** ("Surround sound (linear PCM)") [confirmed: https://www.nintendo.com/us/store/products/art-of-balance-switch/].

---

## 2. UI / Flow

### 2.1 Title → menu → level (reconstructed)
- Music-track evidence proves at least four UI "screens with dedicated audio": title/main menu ("Main Menu"), mode/world browsing ("Level Selection"), gameplay ("In Game 1–8"/per-world), and a "Credits" song → the game has an end-credits sequence. [confirmed track names: https://archive.org/details/art-of-balance-soundtrack ; existence of a credits sequence: inferred]
- Flow described/consistent across reviews: boot → title/main menu with mode selection (Arcade/Versus; later + Endurance/Tower Tumble/Swift Stacker/Infinity) → world/level selection → puzzle → win jingle or restart. Cubed3 (Wii): "Arcade Mode is the story mode…"; versus rounds configurable to "five, seven or nine rounds". [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance]
- **[inferred] Keep our menu diegetic-minimal and instantly resumable** — every source emphasizes "easy to pick up", quick retries ("quick retries", "repeating an action yields identical results") [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].

### 2.2 Level select presentation (this evolved per version)
- **WiiWare (2010):** per-world "grid formation" selector; each level cell shows "a difficulty-denoting circle pattern… one, two, or even the dreaded three"; "beating one will unlock the next in line"; earned circles "act as a currency of sorts that open up new worlds upon collection of enough of them". [confirmed: https://www.cubed3.com/games/reviews/wii/art-of-balance-3] Nintendo Life's preview confirms "Medals, earned from Challenge levels, allow access to the game's four worlds". [confirmed: https://www.nintendolife.com/news/2010/01/first_impressions_art_of_balance] Levels are coded world.row (World A "1.1–11.1", B up to "9.1", C "10.3", D "9.1" per the fan guide) [confirmed: https://www.artofbalanceguide.com/]; PS4 reviewers likewise describe "1.1, 1.2, 2.1" coding. [confirmed: https://www.dualshockers.com/review-art-of-balance-watch-the-blocks-fall-along-with-your-dreams/]
- **Wii U / later:** selector reimagined as **3D clusters of cubes in space**: "Stages are arranged as cube clusters; finishing a level unlocks any cubes touching it, often giving multiple available options at once. Orange cubes are challenge levels (height requirements, timers, or building on a precarious balancing beam). Completing levels earns rings that unlock later worlds — sometimes before the previous world is fully cleared." [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/] The ring/medal-to-unlock-world economy is therefore original to WiiWare and persists. **[inferred]:** the cube-cluster map is the prettier evolution of the same "grid + difficulty pips + currency" idea.

### 2.3 In-game HUD & success/failure feedback
- Completion is *not* instant: after the last block is placed the structure must survive a **3-second countdown, "indicated by three lights at the bottom of the screen"** (WiiWare) [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance]; the countdown was "shortened in versions following the original Wii release" [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance] and on Wii U "a three-second countdown completes the level even if a tower is in the process of falling, as long as blocks haven't hit the water" [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].
- Failure condition: any shape touching the water fails/restarts; placed pieces **cannot be picked up again** after settling — a full restart is required [confirmed: https://switchplayer.net/2018-10-26/art-of-balance-review/ , official: "Don't let any shape fall into the water!" https://artofbalance.shinen.com/wiiu/about.php].
- Special challenge markers: orange levels = Balance/Height/Time challenges with extra points [confirmed: https://art-of-balance.shinen.com/wii/about.php , https://switchplayer.net/2018-10-26/art-of-balance-review/].

### 2.4 Pause, settings, and unlockable extras
- Wii U pause is minimal: "If you want to manually restart a level, there's no option in the pause menu." (SuperPhillip Central) [confirmed: https://www.superphillipcentral.com/2014_11_02_archive.html]
- 3DS pause carries a real option: camera views A/B (pop-out vs. depth) are chosen by pausing mid-game [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch].
- Switch exposes a Settings screen from the **main menu** (press SL+SR), where the v1.01 patch's gyro control must be enabled (off by default at launch) [confirmed: https://www.reddit.com/r/NintendoSwitch/comments/9wp4x3/art_of_balance_101_is_now_available_enabling/].
- No source documents music/SFX volume sliders in any version — typical Nintendo eShop-era parsimony (console-level volume assumed). [inferred from absence across all reviews; context: https://www.reddit.com/r/nintendo/comments/4gf3gq/nintendo_games_and_the_lack_of_sound_options/]
- Extras/unlockables: world-gating currency (circles/rings/medals, above); **"Special Challenges… for extra points and unlock awards"** (official, all post-3DS versions) [confirmed: https://art-of-balance.shinen.com/wiiu/about.php]; TOUCH! has **13 unlockable awards** [confirmed: https://art-of-balance.shinen.com/3ds/about.php] with examples ("amass 100,000 points in Endurance", "solve 150 levels") [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch]; online leaderboards (Endurance) on 3DS/Wii U/Switch [confirmed: same NL review + https://art-of-balance.shinen.com/wiiu/about.php]; PS4 has 13 trophies per the PlayStation Store [confirmed: https://store.playstation.com/en-us/product/UP4496-CUSA01465_00-ARTOFBALANCE0000]. Promo extras on the WiiWare site: downloadable wallpapers + MP4 trailers. [confirmed: https://art-of-balance.shinen.com/wii/]

---

## 3. Platform

### 3.1 WiiWare constraints (original, 2010)
- **Video/tech:** official spec line: "supports 4:3 and 16:9 screen modes, PAL (576i), NTSC (480i) and EDTV/HDTV (480p)" and "runs in super-smooth 60 frames/sec". [confirmed: https://art-of-balance.shinen.com/wii/about.php]
- **Distribution:** 800 Wii Points; Wii Shop era size cap commonly quoted as 40 MB; archival reports put the game's `.wad` at ≈42.7 MB (≈336–340 blocks), i.e. essentially at the ceiling for its price class. Exact official MB figure could not be confirmed from a primary source. [confirmed price: https://art-of-balance.shinen.com/wii/ ; size cap context: https://gamefaqs.gamespot.com/boards/930752-nintendo-wii/61487190 ; 42.7 MB: https://gbatemp.net/threads/best-way-to-compress-wiiware-games-for-archival.675003 ; treated as [inferred] whether 40- or 80-MB tier applied at time of release]
- **Design consequence [inferred]:** everything on-screen (textures, water shader, audio) was squeezed to a few tens of MB — which is why audio is a handful of short loops + small samples and the "one lounge track per world" model. For us this validates a **small, high-polish asset budget** (≤16 loops, ≤60 SFX).

### 3.2 Wii Remote control scheme (WiiWare original)
- Canonical loop: **"Point at a block and press A to grab it. Rotate it with the D-pad. Press A again to drop it into place."** Camera "zooms in on the 'action'" for delicate placement. [confirmed: https://www.nintendolife.com/news/2010/01/first_impressions_art_of_balance]
- Corroborated: "Using the Wii Remote's pointer, and the A button and D-pad to grab and rotate pieces… The D-pad makes for a precise and non-jittery substitute. Shin'en have avoided the slightly gimmicky possibility of rotating the Remote to turn pieces." **Rotation is fixed-step, button-driven — deliberately NOT motion-based.** [confirmed: https://www.cubed3.com/games/reviews/wii/art-of-balance-3]
- B/minus/plus functions aren't documented by sources found; minus almost certainly opens the pause ("Wii Remote… join anytime with another Wii Remote" for drop-in co-op). [co-op confirmed: https://art-of-balance.shinen.com/wii/about.php ; pause key: inferred]
- Peripherals: compatible with "Wii Remote & Wii Remote Plus" (no mandatory Wii MotionPlus) [confirmed: https://www.nintendo.com/en-gb/Games/WiiWare/Art-of-Balance-284413.html].

### 3.3 Art of Balance TOUCH! (3DS, 2012) — $6.99/€6.99
- Controls: stylus-first ("Rotate and place all available shapes with your stylus"), optionally "touch screen or buttons". [confirmed: https://art-of-balance.shinen.com/3ds/about.php , https://www.nintendolife.com/reviews/eshop/art_of_balance_touch]
- Content delta vs. WiiWare: "carries all the stages from the home console version and adds new ones on top… four worlds double to eight" (200 levels); new shapes — glass (breaks under 3 stacked items), timer blocks, gravity-inverting blocks, fire (NL/official list three of five specials) [confirmed: same two URLs]; **new Endurance mode** (random puzzles, 3 lives, speed+difficulty scoring, leaderboard); **13 awards**; multiplayer dropped; stereoscopic 3D with two depth styles switchable from pause; water splashes the touch-screen (lens effect). [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch]

### 3.4 Wii U (2014) — €8.99/$8.99; "the biggest iteration"
- Shin'en's own list of deltas vs. prior versions: "HD… almost photo real look", **physics updated "240 times" per second (vs ~30 fps physics on 3DS)**, "new game modes, 5 player support, online play and leaderboards". [confirmed: https://www.nintendolife.com/news/2014/02/interview_shinen_multimedia_on_the_wii_u_difference_for_art_of_balance]
- Controls: "You can change between touch and analogue or even Wii Remote at any time" — **but camera+pointer was explicitly rejected**: "We don't use the camera+pointer, as we don't think its a good working control option." → On Wii U the Wii Remote is used via buttons/stick-emulation, and direct touch on the GamePad becomes the "new pointer". [confirmed: same interview]
- Modes (official): Arcade (drop-in, "four additional players can join at any time"), 2-player Versus split/online, Endurance w/ online leaderboards, Tower Tumble, Special Challenges. NL's write-up adds Swift Stacker (team race, online). [confirmed: https://art-of-balance.shinen.com/wiiu/about.php , https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance]

### 3.5 PS4 (2016) — $8.99
- DualShock 4 only; stick-driven cursor (reviewer suspicion: "leans entirely on control sticks" — the gamehoard comparison) [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]; store lists 1–4 players, vibration, Remote Play, online w/ PS Plus, 13 trophies [confirmed: https://store.playstation.com/en-us/product/UP4496-CUSA01465_00-ARTOFBALANCE0000]. Adds/mostly-shares **Infinity mode** ("The blocks don't stop. Build the highest possible stack.") [confirmed: https://artofbalance.shinen.com/ps4/about.php]. No PlayLink edition found in any primary source — treat "PlayLink" claims as unsupported. [inferred]

### 3.6 Switch (2018) — $8.99/¥1000
- The "definitive" bundle of everything: five modes (Arcade 200 levels/8 worlds, Endurance, Tower Tumble, Swift Stacker, Infinity), local split-screen up to 4, online. [confirmed: https://www.nintendo.com/us/store/products/art-of-balance-switch/ , https://artofbalance.shinen.com/switch/about.php , https://www.cubed3.com/games/reviews/nintendo-switch/art-of-balance]
- Controls: "analogue stick cursor movement and button input or the portable-only Touchscreen sliding and menu selection"; touchscreen support is a listed eShop feature; **gyro motion added in v1.01 post-launch, off by default, enabled in main-menu Settings**, "works superbly well with a single Joy-Con, and very non-intuitively on a Pro Controller". [confirmed: https://www.cubed3.com/games/reviews/nintendo-switch/art-of-balance , https://www.reddit.com/r/NintendoSwitch/comments/9wp4x3/art_of_balance_101_is_now_available_enabling/ , https://www.nintendo.com/us/store/products/art-of-balance-switch/]
- Technical: 200 MB eShop size, "Surround sound (linear PCM)", TV/Tabletop/Handheld, Switch-2 compatible. [confirmed: https://www.nintendo.com/us/store/products/art-of-balance-switch/]

### 3.7 Quick version-difference table

| Feature | WiiWare 2010 | 3DS TOUCH! 2012 | Wii U 2014 | PS4 2016 | Switch 2018 |
|---|---|---|---|---|---|
| Levels / worlds | 100 / A–D | 200 / A–H | 200 / A–H | 200 / A–H | 200 / A–H |
| Input | pointer+A, D-pad rotate | stylus / buttons | GamePad touch, sticks, Wii Remote (no pointer) | sticks | sticks, touch (handheld), gyro (1.01) |
| Multiplayer | 2p drop-in co-op, 2p split Versus | none | co-op up to 5, Versus split/online, Tower Tumble, Swift Stacker online | 1–4 | 1–4 local, online |
| Endurance | — | yes (new) | yes + leaderboards | yes | yes |
| Infinity | — | — | — | yes | yes |
| Price | 800 WP ($8) | $6.99 | $8.99 | $8.99 | $8.99 |
| Res/FPS | 480p/576i, 60 fps | 400×240-ish, 2D/3D | HD, ~"240 Hz" physics | 1080p class | 1080p class |

[cells sourced to the URLs in §3.1–3.6 above; PS4/Wii U resolution class is inferred from marketing, no exact figures published]

---

## 4. Implications for our clone (mouse / touch / gamepad mapping)
1. **Pointer model:** Wii original = *cursor (pointer) + grab(A) + fixed-step rotate (D-pad) + drop(A)*; Wii U/Switch replaced the pointer with direct touch/stick cursor — and Shin'en *rejected IR pointer* on Wii U as "not a good working control". For Unity 6.6: mouse = pointer (hover piece → click grab → click place); wheel/Q-E = fixed 45°/90° steps (NOT free rotation); touch = direct drag-and-drop (stylus parity with 3DS); gamepad = left-stick cursor + A/B grab/place + shoulder rotate — exactly the Wii U "analogue" scheme. Gyro as an optional toggle, off by default (Switch precedent). [all grounded in §3.2–3.6]
2. **Placement camera zoom-in** near the target during placement [confirmed 3.2]; cap placement speed so players can't fling blocks to save a collapse [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]; no re-grab after a block settles (restart-to-undo) [confirmed: https://switchplayer.net/2018-10-26/art-of-balance-review/].
3. **Audio budget:** ~12–16 lounge/downtempo loops (menu, level-select, 8 world themes, challenges, win jingle, fail/sting, credits) + small wood/water/UI SFX bank; female-voice tutorial announcer for first encounters with each new shape (WiiWare original only — nice authenticity feature). [confirmed track map §1.2; announcer §1.5]
4. **Flow:** Title → mode/world map (cube-cluster selector, orange = challenge, difficulty pips, ring/medal unlock currency) → in-level 3-light survival countdown → win jingle or splash-fail; minimal pause (resume/quit), a small Settings node on the main menu (control mode toggles: motion, camera style A/B), awards + online leaderboard shell for the modern versions. [confirmed §2]
5. **UI restraint** is a feature: the original shipped *no* audio options and almost no settings — our clone should keep a Settings tab but the default experience untouched, matching the "calm spa puzzler" identity that reviewers consistently credit as central to its charm. [inferred from §2.4 + reception]

---

## 5. Open questions / low-confidence flags
- Exact WiiWare download MB: only community-reported (~42.7 MB WAD) [medium].
- Whether the *original* WiiWare win required exactly 3 s or was later *reduced* to a shorter fixed time (Wikipedia only says "shortened in versions following the original") [medium].
- B/−/＋ button semantics on Wii Remote (pause, world map, sound-test?) — unconfirmed beyond convention [low].
- PS4 "PlayLink" association — unconfirmed, likely false [low].
- Per-world visual themes for E–H (glass/fire/gravity gimmick worlds: "Each world spotlights one gimmick… a final world mixing them together" is from The Game Hoard; exact A–H theme list remains undocumented) [medium].
- Whether menu music (Main Menu vs Level Selection) ever played simultaneously/crossfaded — single tracks named separately, so likely discrete screens [inferred].


---

<!-- ====================================================================== -->
<!-- FILE: gameplay-loop.md -->
<!-- ====================================================================== -->

# Art of Balance — The Level, Beat by Beat (Gameplay-Loop Research)

Research for "Balance Stack Hero 2026" (Unity 6.6 clone of Art of Balance, Shin'en Multimedia, 2010).
Scope: exactly how one level plays from start to finish — piece supply, drag/placement, physics timing, win/fail, retry, scoring, progression — plus where the versions diverge (WiiWare original vs. *Art of Balance TOUCH!* 3DS vs. Wii U/PS4 vs. Switch).

Tagging convention: every fact is `[confirmed: <url>]` or `[inferred]`. A few facts come from search-engine snippets of pages that blocked direct fetching; those are tagged `[confirmed-via-snippet: <url>]`.

## 0. Version map (so each fact can be attributed correctly)

- **WiiWare original** — released 15 Feb 2010 (NA) / 26 Mar 2010 (EU), 800 Wii Points, **100 levels in 4 worlds (A–D)** [confirmed: https://art-of-balance.shinen.com/wii/] [confirmed: https://www.artofbalanceguide.com/] [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance].
- **Art of Balance TOUCH!** — 3DS eShop, 2012; stylus/touch variant; content expanded to **8 worlds / ~200 levels** [confirmed: https://art-of-balance.shinen.com/3ds/] [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html].
- **Wii U eShop HD port** — 2013/2014 ("Director's Cut"-style compilation of the Wii + 3DS content): 200 levels, 8 worlds, multiple control schemes, online leaderboards/multiplayer [confirmed: https://art-of-balance.shinen.com/wiiu/] [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2].
- **PS4** (2016) and **Switch** (4 Oct 2018) — same 200-level/8-world package with 5 modes and online; Switch patch 1.1 added motion controls [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance] [confirmed: https://artofbalance.shinen.com/switch/] [confirmed: https://www.nintendo.com/us/store/products/art-of-balance-switch/].

Note: Wikipedia's gameplay section describes the later 8-world/200-puzzle package, not the 2010 original's 4-world/100-level structure [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance].

## 1. What the player sees at level start

- The arena is a shallow **bowl/tub of water with a small platform (peg) in it**; the whole puzzle happens over the water [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance] [confirmed: https://www.dualshockers.com/review-art-of-balance-watch-the-blocks-fall-along-with-your-dreams/].
- The level's full set of shapes is **laid out in a row in the water beside the platform**, bobbing/queued at the edge of the play area [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/] ("a set of blocks will [be] placed out in a line before you"). [inferred] On the original Wii this same tray-of-blocks-in-water layout is shown in all Wii gameplay footage (e.g., https://www.youtube.com/watch?v=WpMLfRje1hU).
- Some levels' platforms are themselves hostile: tiny stone points, **floating platforms that tilt**, or **weighing-scale bases with two platforms at different heights**, or platforms pinned on a fulcrum [confirmed: https://www.nintendolife.com/news/2010/01/first_impressions_art_of_balance] [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2] [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance] ("protruding blocks built into the base that are linked so that as one rises, the other falls").
- The camera is a fixed 3/4 side view of the tub, and it **dynamically zooms to frame the growing tower** — on Wii, "the camera even zooms in on the 'action' to allow more delicacy for your block-dropping feats" [confirmed: https://www.nintendolife.com/news/2010/01/first_impressions_art_of_balance]; a 3DS reviewer complains "the camera zoomed out and messed up my subtle approach" [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html]. [inferred] The zoom follows the top of the structure, so tall stacks reframe the scene.
- A HUD of **three lights sits at the bottom of the screen** (see §7) — inert until the final block is placed [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance].

## 2. How pieces are given: the queue-of-three rule

- Each level supplies a **fixed set of shapes** (the "given blocks"); all must be used [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance] [confirmed: https://artofbalance.shinen.com/switch/] ("Build a balanced stack from all given shapes").
- **Only the first 3 blocks of the set are selectable at once**; placing one unlocks the next in the queue [confirmed: https://www.nintendolife.com/forums/wii/art_of_balance_impressions] ("each level allows you to pick from 3 blocks once you have selected them it opens up more blocks") [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html] ("you can only pick from the starting three blocks available to you, and not the ones awaiting you in the queue") [confirmed-via-snippet: https://www.pocketgamer.com/art-of-balance-touch/review/] ("You're also only provided with three blocks at a time"). This is a 3-block rolling tray, not an inventory you can browse.
- Later levels reorder pieces deliberately "in an unhelpful order," forcing strategic choices about which of the 3 visible shapes to commit first [confirmed: https://www.gamesasylum.com/2011/05/13/art-of-balance/] — a WiiWare-era review, so this applies to the original. [inferred] The remaining queue is visible-but-locked in the tray.
- Shapes are odd: rectangles, L/T/X, half-circles/balls, "bones," crosses, dumbbells, arrows; dimensions stay consistent so a shape "will be the same size as last time" across levels [confirmed: https://www.nintendolife.com/news/2010/01/first_impressions_art_of_balance] [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].

## 3. Grab, drag, rotate — Wii Remote controls (original)

- **Cursor is the Wii Remote's IR pointer.** Cubed3 (Wii U review, describing what it inherited): "Art of Balance takes the super-accurate IR pointer mechanic from the WiiWare edition" [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2].
- The exact button flow, from Nintendo Life's hands-on of the WiiWare release: **"Point at a block and press (A), rotate it with the (DPAD),"** then **"move it to its intended location and press (A) again to drop it into place"** [confirmed: https://www.nintendolife.com/news/2010/01/first_impressions_art_of_balance]. So: A = grab/release (grab-and-release, not hold-to-carry), D-pad = rotate.
- A community review summarizes it as: "pick up blocks, position them, rotate them in 45-degree increments, and release them" [confirmed-via-snippet: https://forums.serenesforest.net/topic/63225-art-of-balance-review/]; Wikipedia: "The blocks can be rotated at 45° angles" [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance]. **Rotation is quantized to fixed 45° steps** — every press turns the block the same amount [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].
- On 3DS *TOUCH!*: stylus drag directly, or Circle Pad cursor ("much slower as you must drag the cursor to each block"); rotation moves to **L/R shoulder buttons** [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html]. On Wii U: three schemes — GamePad/Pro stick-cursor click-and-move, GamePad touchscreen drag, or original Wii Remote pointer; rotation always on dedicated buttons ("rotating them still requires the use of the [shoulder] buttons") [confirmed: https://www.dualshockers.com/review-art-of-balance-watch-the-blocks-fall-along-with-your-dreams/] [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2] [confirmed-via-snippet: https://gamefaqs.gamespot.com/wii-u/842577-art-of-balance/reviews/164850]. [inferred] The original WiiWare game offered pointer + D-pad only; the stick-cursor and tilt-style options belong to the later ports (no source documents pointer-tilt aiming on the 2010 release).

## 4. Does the piece float, or does it fall, while being placed?

- **While carried, a grabbed block floats wherever the cursor puts it** — it ignores gravity until released. [inferred: universal in all footage; implied by "move it to its intended location and press (A) again to drop it into place" — the word "drop" marks where gravity begins — https://www.nintendolife.com/news/2010/01/first_impressions_art_of_balance]
- On release the block falls under gravity onto the structure; **the simulation is live continuously, not gated behind a "start" button.** Evidence: on the Wii U (which kept the original's physics) "some stages ... act like weighing scales, dropping down with the weight of a shape" — bases react to each piece as it lands during normal play [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2]; timer blocks "start counting down once a shape is stacked on top of them" mid-level [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance]; a gravity-flip block inverts the stack "the moment [it's] placed" [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]; and players can win with a structure already mid-collapse when the countdown ends — "everything could start coming down, but as long you get the 3rd green light it doesn't matter" [confirmed: https://www.nintendolife.com/forums/wii/art_of_balance_impressions].
- [inferred] The physics are deterministic so retries are learnable: "the results of your work identical each time you attempt a specific action" [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].
- Placement nuance confirmed across ports: released blocks nudge/slide each other, and the **exact release position is the skill** ("the exact spot a block is dropped is key to managing a stack's balance" — https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/). Switch reviewers note a quirky anti-jitter behavior: side-by-side blocks are slightly pushed apart at release, so players learn to leave a gap and "let gravity pull them together" [confirmed: https://switchplayer.net/2018-10-26/art-of-balance-review/].

## 5. Can already-placed pieces be repositioned?

- **No.** Explicit for the Switch package (which contains the same Arcade rules): "You can't simply pick up a shape you've already placed and move it ... you'll need to begin again from scratch" [confirmed: https://switchplayer.net/2018-10-26/art-of-balance-review/].
- [inferred] Same rule for the WiiWare original: no source describes any re-grab of placed blocks, and the design's whole tension ("only pick from the starting three blocks," risky-order queues) depends on permanent commits [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html] [confirmed: https://www.gamesasylum.com/2011-05-13/art-of-balance/].

## 6. Special block/arena behaviors (the escalation vocabulary)

Present already in the WiiWare original:
- **Rounded-edge shapes** ("you'll soon get shapes with rounded edges to deal with") [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance].
- **Timer blocks**: carry a timer that "will start counting down once a shape is stacked on top of them"; at zero "the blocks will break, causing all blocks stacked on top of them to fall" [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance].
- **Weight-limited (glass/crushable) blocks**: "you can only stack a certain number of shapes on top of them until they break" [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance]; Wii U wording: glass blocks "fracture if too many other blocks are placed atop them"; on the 200-level package, weight-restricted blocks break past "no more than three other regulars" [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2] [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].
- **Unstable/rocking platforms** as a level modifier [confirmed: https://www.nintendolife.com/news/2010/01/first_impressions_art_of_balance] [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance] ("super puzzles in which the player has a time limit or the platform sways on the water").

Added by the expanded remakes (3DS/Wii U/PS4/Switch):
- **Gravity-flip blocks** — placing one "completely invert[s] gravity the moment they're placed," with a second platform on the ceiling ("platforms at both the top and bottom of the screen") [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2] [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]; on 3DS it was "a real game-changer" [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch].
- **Fire blocks** — "flaming shapes that explode when two touch" / "disappear if they touch another one that's on fire" [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2] [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].
- **Linked seesaw platforms, moving pistons** ("as one rises, the other falls") [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance].
- [inferred] For a clone of the *original's* main loop, the first two lists (rounded, timer, crushable, swaying base, gravity-flip optional) cover the core escalation; fire/seesaw/piston are the expanded package's depth.

## 7. The win condition

- Place **every given block** first: "after placing the last block ... the structure must stay above water for three seconds, indicated by three lights at the bottom of the screen" [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance]. Forum detail: "you have 3 lights at the bottom that need to all light up green (takes 3 seconds)" [confirmed: https://www.nintendolife.com/forums/wii/art_of_balance_impressions].
- The check is generous at the margin: a structure that survives until the third green light wins even if it collapses right after [confirmed: https://www.nintendolife.com/forums/wii/art_of_balance_impressions]; on Wii U, "once all blocks are placed, a countdown starts that only needs to count to three" and you pass "if the countdown completes before the blocks hit the water" [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]. A GameFAQs player: "my unstable stack fall[ed] slowly enough for the countdown to finish" [confirmed-via-snippet: https://gamefaqs.gamespot.com/wii/979375-art-of-balance/reviews/158290].
- Height matters: pieces must be off the water — "You need to have your blocks at least up in the air in order for it to count" [confirmed: https://www.nintendolife.com/forums/wii/art_of_balance_impressions]; the win is defined as "no blocks hit or go below the water level" [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html].
- **Some levels add an extra objective beyond survival**: "a time or height limit that must be met" [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance]; Wii Ware-era article: challenge stages with "a time limit," "a required height to achieve with your stack," or "a floating, unstable base" [confirmed: https://www.gamesasylum.com/2011-05-13/art-of-balance/]. On Wii U these extras live in orange "challenge" cubes: time attack, tallest-tower, precarious ground [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]; [confirmed: https://switchplayer.net/2018-10-26/art-of-balance-review/].
- Timing conflict to note: the hold/countdown was **longer on the 2010 original** than in later ports — "the countdown that is required in order to pass a level is significantly shorter than its predecessor's" (Wii U vs WiiWare) [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance]; Wikipedia: "this countdown was shortened in versions following the original Wii release" [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance]. Exact original duration could not be pinned (sources only give the ports' 3 seconds) — treat "≈3 s hold on later versions, longer on WiiWare (undocumented value)" as the safe reading. [inferred]

## 8. Fail conditions

- **Any block touching or sinking below the water line = instant level failure**: "lost when an object hits the water" [confirmed: https://wiki.dolphin-emu.org/index.php?title=Art_of_Balance]; "Just one block falling off is enough to warrant a fail" [confirmed: https://switchplayer.net/2018-10-26/art-of-balance-review/]; "letting one piece or more fall into the water forces you to restart the level" [confirmed: https://www.dualshockers.com/review-art-of-balance-watch-the-blocks-fall-along-with-your-dreams/].
- Collapse during the countdown also fails (the countdown must *complete* first — §7) [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].
- On **gravity-flip** levels the kill-plane moves: "a loss is determined once a block passes an invisible line in the air" [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].
- Failing can also come from special blocks mid-placement (timer expiry / overload collapsing the stack into water), which is just the physics rule expressing itself [inferred from §6 sources].

## 9. Retry behavior

- Failure loops back to a **full level restart** (no checkpoints, no undo) [confirmed: https://www.dualshockers.com/review-art-of-balance-watch-the-blocks-fall-along-with-your-dreams/]; retrying is "quick" on the modern ports with "instant retry system, and quick loading screens" [confirmed: https://www.cubed3.com/games/reviews/nintendo-switch/art-of-balance] — [inferred] the 2010 original was the same loop (restart the puzzle from the empty platform) given every source describes trial-and-error repetition as the intended practice: later stages "require serious trial and error" [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance]; "repeated attempts are required" [confirmed: https://www.gamesasylum.com/2011-05-13/art-of-balance/].
- In **Endurance mode** (3DS onward — see §11) a run tolerates exactly **three failures** before it ends [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html] ("You get three retries") [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance] ("you're given three lives").
- Arcade itself imposes no lives or penalty for dying — pure puzzle retry [inferred: consistent across all sources; Arcade has "no time limits or scores to pressure you" — https://www.dualshockers.com/review-art-of-balance-watch-the-blocks-fall-along-with-your-dreams/].

## 10. Timers, scoring, medals/ranks

- **Arcade = no clock by default** (except time-limit challenge levels): "There's no time limit, so you can leisurely go about your stacking business" [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance].
- **No per-level medals or star ranks were found in any version.** 3DS awards "rings" per completed level, spent to unlock worlds, plus achievement-style awards (13 of them, e.g. "amass 100,000 points in Endurance") [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html] [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch]. [confirmed] On Wii U, "simply by completing a level you also earn rings that eventually unlock additional worlds ... there are no extra rewards to give reason to return to a completed stage" [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]. Switch keeps "an Awards list to try and clear" (Xbox-style achievements) [confirmed: https://www.cubed3.com/games/reviews/nintendo-switch/art-of-balance].
- **Numeric scoring exists only in score modes** (Endurance on 3DS/Wii U/Switch, and online leaderboards): "dishing out points based on difficulty and how quickly you solved it" [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch]; "Your speed, number of remaining lives and the difficulty of the puzzle are all taken into consideration when judging your score" [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance]; online leaderboards on Wii U/Switch/PS4 [confirmed: https://art-of-balance.shinen.com/wiiu/] [confirmed: https://artofbalance.shinen.com/switch/].
- [inferred] A clone of the original's loop therefore needs: pass/fail per level + persistent progress only; a separate Endurance-style scoring mode if we want replay depth.

## 11. Level structure, skip rules, progression gates

- **WiiWare original:** 100 levels across 4 worlds named A–D, each world ~25 levels, numbered like "1.1, 1.2, ... 6.4" (world.level) [confirmed: https://www.artofbalanceguide.com/] [confirmed: https://gamefaqs.gamespot.com/wii/979375-art-of-balance/videos/1479 (video titles: "World A, Part 1 (Levels 1.1 - 6.4)")]. World D is the finale ("Once you get through level D, thats it") [confirmed: https://www.nintendolife.com/forums/wii/art_of_balance_impressions]. [inferred] Progression is linear-unlock per world (complete a level to open the next), since no source describes any branching or free-select on the original and difficulty ramps "smooth and gradual" [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance].
- **Expanded versions (3DS/Wii U/Switch):** 8 worlds × ~25 levels; each world themed (its own backdrop, music/"lounge style," and gimmick block) [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch] [confirmed: https://www.nintendo.com/us/store/products/art-of-balance-switch/] [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]. Level select is a **non-linear node map ("set of cubes")**: finishing one node unlocks adjacent nodes, so several levels are open at once, and rings can open a new world before the old one is 100% done [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html] [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]; gating rule on Wii U/Switch: "You must complete a certain amount of puzzles in order to move on to the next world" [confirmed: https://www.dualshockers.com/review-art-of-balance-watch-the-blocks-fall-along-with-your-dreams/].
- **Level skip:** no evidence anywhere of a paid/cheat skip. Players can only replay/re-enter *unlocked* levels; locked ones simply aren't selectable. [inferred from absence in all sources; versus modes do let you pick any puzzle of the same layout set — https://www.nintendolife.com/reviews/2010/02/art_of_balance].
- **Hints:** no hint/solution-preview feature is documented in any version by any source reviewed. Difficulty is explicitly intended to be met by trial-and-error, and a fan solution site exists precisely because the game doesn't hint [confirmed: https://www.artofbalanceguide.com/] [confirmed: https://www.gamesasylum.com/2011-05-13/art-of-balance/]. [inferred] None in the original.

## 12. Extra modes riding on the same loop (context for the "main loop" plan)

- **Drop-in co-op (Wii):** a second player joins "with a second Wii Remote ... at any time" [confirmed: https://art-of-balance.shinen.com/wii/]; expanded to up to 5 players on Wii U (4 Remotes + GamePad) and 4 on Switch [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2] [confirmed: https://artofbalance.shinen.com/switch/].
- **Versus (Wii original only):** split-screen race on the same puzzle, best of 5/7/9 rounds [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance]; did not carry to 3DS ("WiiWare's multiplayer mode hasn't made the leap") [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch].
- **Endurance (new in TOUCH!, kept everywhere since):** random puzzles, 3 lives, points from difficulty+speed, leaderboard [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch] [confirmed: https://art-of-balance.shinen.com/3ds/] ("new endurance mode").
- **Tower Tumble** (up to 5 players, turn-based "Jenga": the player whose piece collapses the stack loses the round; randomly generated pieces) and **Swift Stacker** (teams race the same puzzle; unlimited retries), plus **Infinity** (endless pieces) on Switch [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance] [confirmed: https://www.cubed3.com/games/reviews/nintendo-switch/art-of-balance].
- [inferred] The 2010 WiiWare package = Arcade + co-op + Versus only (Endurance is called "new" for 3DS; official Wii page lists only solo/co-op/versus).

## 13. Open questions / conflicts (for later verification)

1. Exact original WiiWare countdown length (longer than 3 s; no number found). [confirmed-conflict: NL WiiWare review says 3 s + 3 lights vs NL Wii U "shorter than its predecessor" — see §7.]
2. Whether the Wii original ever offered a non-pointer cursor alternative (only D-pad *rotation* is documented; no tilt-aim evidence) [inferred].
3. Original's level-select format (linear list vs node map) — only the expanded versions' node maps are documented.
4. Whether the "anti-jitter push-apart" on release exists on Wii or is a Switch-era physics tweak (Switch Player observed it; no equivalent report elsewhere) [confirmed for Switch: https://switchplayer.net/2018-10-26/art-of-balance-review/].

## 14. What this means for the clone's main loop (one-paragraph spec)

A level: water tub + themed platform, camera framing a tray of oddly shaped blocks; pick one of 3 available blocks (cursor click or touch drag), rotate in 45° steps, release — it falls under continuous, deterministic physics that keep the whole scene live the entire time; placed pieces are committed (no re-grab); use every piece, then survive a short stability countdown (3 lights) with no piece touching the water; fail = restart from empty. Escalation comes from rounded/crushable/timed blocks first (original), then gravity-flip/fire/seesaw gimmicks (expanded package). No scores, no timers, no hints in Arcade — pressure is purely physical; scoring and lives exist only in Endurance. [all of the above sourced in §§1–12]

---
Compiled 2026-09-24. Direct fetches used: nintendolife.com (4), wikipedia.org (raw wikitext), cubed3.com (2), shinen.com official (4), thegamehoard.com, dualshockers.com, switchplayer.net, superphillipcentral.com, gamesasylum.com, wiiwarewave.com, wiki.dolphin-emu.org, artofbalanceguide.com, nintendo.com store, serenesforest.net + gamefaqs.gamespot.com + pocketgamer.com via search snippets only.


---

<!-- ====================================================================== -->
<!-- FILE: levels-progression.md -->
<!-- ====================================================================== -->

# Art of Balance — Levels & Progression Research

**Scope:** Level counts, world/theme grouping, unlock structure, named level sets, early-vs-late difficulty design, bonus/challenge levels, scoring meta, save/progress behavior, and walkthrough sources — for the WiiWare original (2010) and each remake: *Art of Balance TOUCH!* (3DS), Wii U / PS4 HD, and Nintendo Switch.
**Date compiled:** 2026-09-24. Every claim is tagged `[confirmed: URL]` (seen on that page during research) or `[inferred]` (my reasoning from the confirmed base).

---

## 1. Version map (the headline answer on "~150 levels")

The "~150?" guess is close but wrong in a useful way: there are exactly **two tier sizes — 100 and 200 levels** — and no version has 150.

| Version | Levels | Worlds | Modes | Notes |
|---|---|---|---|---|
| WiiWare (2010) | **100** | 4 (World A–D) | Arcade (+2P drop-in co-op, split-screen Versus) | The original; the "100" figure is on Shin'en's own Wii page |
| 3DS *TOUCH!* (2012) | **200** | 8 (A–H) | Arcade, Endurance (no multiplayer) | Doubles the content; first HD-gimmick blocks |
| Wii U HD (2014) | **200** | 8 | Arcade, Endurance, Tower Tumble, Swift Stacker (+online) | "200 varied levels" per Nintendo's EU store page |
| PS4 (2016) | **200** | 8 | + Infinity mode present (trophy evidence) | 13 PS4 trophies (full list below) |
| Switch (2018) | **200** | 8 | **5 modes**: Arcade, Endurance, Infinity, Tower Tumble, Swift Stacker | Gyro + touch; 4-player local; current master version |

Confirmed counts:
- WiiWare original: "That's why we designed **100 levels**..." [confirmed: https://art-of-balance.shinen.com/wii/] (official Shin'en microsite, still live; also "100 levels to tackle" [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance] and "all 100 levels in the game" [confirmed: https://www.youtube.com/watch?v=5xdl2eBR2vM])
- TOUCH!: "That's why we designed **200 levels**..." [confirmed: https://art-of-balance.shinen.com/3ds/] (official; plus "**new** endurance mode" advertised there — Endurance did NOT exist on WiiWare)
- Wii U: "**200 levels**... new Online Leaderboards and the new Online Multiplayer game modes" [confirmed: https://art-of-balance.shinen.com/wiiu/]; Nintendo EU store: "**200 varied levels** of block-balancing gameplay" [confirmed: https://www.nintendo.com/en-gb/Games/Wii-U-download-software/Art-of-Balance-918559.html]
- PS4: "That's why we designed **200 levels**" [confirmed: https://art-of-balance.shinen.com/ps4/]
- Switch: "That's why we designed **200 levels**... **8 beautiful environments**" [confirmed: https://art-of-balance.shinen.com/switch/]; Nintendo US store: "Play **200 levels spread across 8 worlds**, each with its own unique lounge style" and "Packed with **5 unique game modes**, online play and local split-screen" [confirmed: https://www.nintendo.com/us/store/products/art-of-balance-switch/]
- World count for the 200-level games: "eight worlds and 200 levels" [confirmed: https://www.cubed3.com/games/reviews/nintendo-switch/art-of-balance]; "Art of Balance's four worlds double to eight" [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch]
- Wikipedia: "In this game mode there are eight worlds with a total of 200 puzzles. There are also super puzzles in which the player has a time limit or the platform sways on the water." [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance]

**Version dates/prices:** WiiWare US 15 Feb 2010, ~800 Wii Points [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance — a walkthrough uploader says "1000 points" [confirmed: https://www.youtube.com/watch?v=5xdl2eBR2vM]; the 800 WP figure from contemporaneous press is more likely correct [inferred]]. TOUCH!: US 07-Jun-2012 / EU 24-May-2012, $6.99 [confirmed: https://art-of-balance.shinen.com/3ds/]. Wii U: EU 25-Sep-2014, US 09-Oct-2014, $8.99 [confirmed: https://art-of-balance.shinen.com/wiiu/ and https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance] — note Wikipedia's infobox says "25 September 2013" for Wii U, which conflicts with Shin'en's own news archive; treat 2013 as suspect [inferred]. PS4: 03-Jun-2016, $8.99 [confirmed: https://art-of-balance.shinen.com/ps4/]. Switch: 04-Oct-2018, launched at a promo US$2.99/UK£2.39/EU€2.99 [confirmed: https://shinen.com/press/sheet.php?p=art_of_balance(Switch)], now $8.99 [confirmed: https://www.nintendo.com/us/store/products/art-of-balance-switch/].

## 2. How levels are grouped: named level sets

### WiiWare original — Worlds A–D, 25 each
The dedicated solution site groups all 100 solutions into exactly four worlds, 25 levels per world, using in-game "X.Y" menu numbering [confirmed: https://www.artofbalanceguide.com/]:
- **World A**: 1.1 → 11.1 (25 levels)
- **World B**: 1.1 → 9.1 (25 levels)
- **World C**: 1.1 → 10.3 (25 levels)
- **World D**: 1.1 → 9.1 (25 levels)

The X in "X.Y" behaves like a node-group/chapter index within the world map (rows of 1–5 sections), not a separate difficulty tier [inferred — consistent with the guide's numbering and with the cube-map layout described below for later versions]. A world is literally named in the WiiWare review comments: "Once you get through level D, thats it" and "the flowers in world D" [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance].

### Later versions — 8 worlds, one gimmick focus each
Arcade worlds remain lettered A–H: the PS4 trophy "Speed Stacker — Solve a level in **World D or higher** in under 30 seconds" and YouTube "Full World G/H Solution Guide" titles prove the letters run to H on the 200-level games [confirmed: https://www.cheatcc.com/articles/art-of-balance-cheats-codes-cheat-codes-walkthrough-guide-faq-unlockables-for-playstation-4-ps4-ps4/ and https://www.youtube.com/watch?v=0vQrgVsD6i8].

Each world is defined by a **visual environment + a gameplay concern**:
- "each of which introduces new block types, shapes and platform styles" (TOUCH!) [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch]
- "each world has its own map... each of which is set in a distinctive environment" (TOUCH!; World A has pink flowers) [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html]
- "in each of the worlds, the game will introduce some new concern that becomes that world's focus... Eventually they will all be featured together in the final world" (Wii U) [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]
- Official Switch copy: "8 beautiful environments", "each with its own unique lounge style", relaxing lounge music varying per world [confirmed: https://art-of-balance.shinen.com/switch/, https://www.nintendo.com/us/store/products/art-of-balance-switch/, https://www.dualshockers.com/review-art-of-balance-watch-the-blocks-fall-along-with-your-dreams/]
- Setting constants across all versions: a stack platform above a tub/pool of water, calm zen/lounge presentation, background changes between worlds but stays meditative [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]

## 3. Unlock structure (levels → worlds)

Two nested layers, confirmed for both the original and remakes:

1. **Within a world — branching node map.** "Levels in a world are arranged in a set of cubes, each one containing a level and unlocking any levels they're touching when completed... ensures more than one level in a world is available at a time as the cube structure branches off" (Wii U) [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]; same for 3DS: "a series of blocks connected in a nonlinear fashion. There's multiple paths to choose from" [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html]. [Inferred] The original WiiWare used the same token-branch map — the walkthrough describes skipping ahead within World A (levels "up to 6.4", "7.1–11.1") while farming tokens, which only makes sense with a branching map.
2. **Between worlds — token/ring currency, not forced completion.** Each cleared level grants a token/"ring"; accumulating enough unlocks the next world "regardless of which levels you get them from": "**World B will unlock once you get 20 tokens** (the circle things awarded after a level)"; in the walkthrough World B opened at level 8.2 completion [confirmed: https://www.youtube.com/watch?v=CbyrgbWgz-g]. "by completing a level you also earn rings that eventually unlock additional worlds. New worlds can be unlocked before you completely finish a previous one, meaning if one stage really isn't clicking you can continue on" (Wii U) [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]. TOUCH!: "The rings you earn from them are used to unlock new worlds"; special orange challenge levels "give you more rings than a normal level as they are harder to complete" [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html].

**Design consequence:** players can always progress by solving ~60–70% of a world; stubborn levels are skippable, comeback-friendly pacing [inferred].

**Endurance unlock gate (remakes):** "After World B has been cleared, the Endurance mode opens up" (3DS) [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html] — Nintendo Life's 3DS review instead says "opened up after finishing the first world" [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch]; minor source conflict, either way it's gated behind early Arcade progress [inferred].

## 4. What changes early → late (pieces, timers, gimmicks)

**Per-level piece counts stay small.** Sample WiiWare solutions: World A 1.1 gives ~3–4 shapes ("Long beam," "Cross," "Ball") [confirmed: https://www.artofbalanceguide.com/world-a/level-1.1.html]; World D 9.1 lists ~5–6 named shapes ("Roadsign (timed)", "Cross (breakable)", "Reverse-L", "Keyhole", "Rectangle") [confirmed: https://www.artofbalanceguide.com/world-d/level-9.1.html]. [Inferred] Difficulty scales not by piece count but by **shape awkwardness + block behaviors + platform stability**; balls/spheres appear as pieces from World A onward.

**Commitment mechanics:** "In most levels, only some of your total blocks are available to you from the beginning" (later pieces unlock after placing others — also "some blocks in a stage only become available after you have placed others"), and "You can't simply pick up a shape you've already placed and move it — you'll need to begin again from scratch" [confirmed: https://switchplayer.net/2018-10-26/art-of-balance-review/, https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]. Placement is also speed-limited and rotation is quantized (fixed increments per button press; "rotated at 45° angles" per Wikipedia; touch versions rotate more freely via touch/shoulder buttons with "predetermined" angles) [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/, https://en.wikipedia.org/wiki/Art_of_Balance, https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html].

**Fail/pass rule:** use every given block, then the structure must survive a countdown: "the structure must stay above water for three seconds, indicated by three lights at the bottom of the screen" (WiiWare) [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance]. "this countdown was shortened in versions following the original Wii release" [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance]; Wii U: "the countdown that is required in order to pass a level is significantly shorter than its predecessor's" [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance]. A dropped piece = restart level [confirmed: https://www.dualshockers.com/review-art-of-balance-watch-the-blocks-fall-along-with-your-dreams/].

**Gimmick ladder (order confirmed for Wii U; lettered-world order for 3DS):**
- Early worlds: plain wooden rectangles/beams; then round/ball pieces ("round blocks are tough to balance anywhere but the top of your stack") and rounded-edge shapes [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch, https://www.nintendolife.com/reviews/2010/02/art_of_balance]
- **Glass/breakable blocks:** "can only hold the weight of two blocks... any more on them and they shatter" (3DS; Wii U "fracture if too many blocks are placed atop them"; WiiWare "shapes that have weight limits") [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html, https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/, https://www.nintendolife.com/reviews/2010/02/art_of_balance]
- **Timed/burning blocks:** 3DS World C "showcases timed blocks. Once they are set, they disintegrate after a short period"; Wii U adds "burning blocks that will disappear if they touch another one that's on fire"; WiiWare already had "shapes have a timer on them that will start counting down once a shape is stacked on top" [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html, https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/, https://www.nintendolife.com/reviews/2010/02/art_of_balance]
- **Gravity-inverting blocks:** "when used literally flip the level on its head", with "two starting pedestals in these levels" (3DS); "blocks that will completely invert gravity the moment they're placed" (Wii U); Switch pitch: "others can even reverse gravity and literally turn the stack upside down" [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html, https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/, https://art-of-balance.shinen.com/switch/]
- **Unstable/linked platforms:** "protruding blocks built into the base that are linked so that as one rises, the other falls" (Wii U); "asymmetrical and unstable platforms" (Wii U); late Switch stages add double plinths that "can act like weighing scales" [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance, https://www.gamecritics.com/michael-hughes/art-of-balance-review/, https://switchplayer.net/2018-10-26/art-of-balance-review/]
- **Final world:** all gimmicks combined [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]
- **Wind:** no source — not Nintendo's own pages, not any of the ~10 reviews checked — mentions a wind/gust hazard; instability comes from water-swaying platforms and physics, never weather [confirmed: none found; searched specifically] → treat wind as NOT part of the original's design vocabulary [inferred].

**Timers exist only on special levels, not normal ones:** "There's no time limit, so you can leisurely go about your stacking business" (Arcade, Wii U) [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance]; time limits are a Challenge-level modifier (below).

## 5. Bonus/extra/challenge levels

No separate "bonus level" set exists; instead **special challenge levels are embedded in every world map**, visually distinct as **orange cubes/blocks** [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/, https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html]. Their variants (converging across several sources):
- time-limited stacking ("requiring... adding a timer to your work") [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]
- minimum-height requirements ("requiring the stack to reach a certain height as well as the normal stability requirement"; WiiWare: "Some levels will also set a time or height limit"; Switch: "building a tower as tall as possible") [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/, https://www.nintendolife.com/reviews/2010/02/art_of_balance, https://switchplayer.net/2018-10-26/art-of-balance-review/]
- **unstable base:** "swap out the stable peg for a lightweight and easily capsized floaty" / "the platform sways on the water" (the "super puzzles" of Wikipedia's line) [confirmed: https://www.dualshockers.com/review-art-of-balance-watch-the-blocks-fall-along-with-your-dreams/, https://en.wikipedia.org/wiki/Art_of_Balance]
- unique balancing beams [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]
- They pay **more unlock rings** than normal levels (3DS) [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html]; clearing **all challenges** is a PS4 trophy ("Challenger") [confirmed: https://www.cheatcc.com/articles/art-of-balance-cheats-codes-cheat-codes-walkthrough-guide-faq-unlockables-for-playstation-4-ps4-ps4/]
- The 200-level games' extra 100 are simply additional designed levels: TOUCH! "carries all the stages from the home [WiiWare] version and adds new ones on top", plus new block types [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch]; "It seems the Wii U release was the last time unique content was added to the package" (PS4/Switch reuse the Wii U set) [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]

## 6. Scoring, stars, medals — what per-level rewards actually look like

**There is no star/medal grading of individual levels in any version.** Per-level success is binary (survive the countdown), rewarded by map tokens/rings [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance, https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/, https://www.youtube.com/watch?v=CbyrgbWgz-g]. The meta-progression layers are:
- **Endurance mode (3DS+):** score attack over previously-cleared levels, "three lives"/"three losses before your run comes to an end"; "points based on difficulty and how quickly you solved it"; Wii U adds online leaderboards [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html, https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/, https://www.nintendolife.com/reviews/eshop/art_of_balance_touch, https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance]
- **Infinity mode (PS4/Switch generation; "the self-explanatory Infinity of endless pieces to place")** — score-driven, e.g. trophy "Sky High: Destroy 20 shapes in a single game in Infinity mode" [confirmed: https://www.cubed3.com/games/reviews/nintendo-switch/art-of-balance, https://www.cheatcc.com/articles/art-of-balance-cheats-codes-cheat-codes-walkthrough-guide-faq-unlockables-for-playstation-4-ps4-ps4/] — its absence from Wii U reviews suggests it is a PS4-era addition [inferred]
- **Platform achievements (the closest thing to "medals"):** 13 PS4 trophies (1 Gold / 3 Silver / 9 Bronze): Stack Builder (10 levels), World Solver (a complete world), Balance Artist (100 levels), Master Stacker (all worlds, Gold), Challenger (all challenges), Speed Stacker (World D+ under 30s), Balanced Opposition (Tower Tumble stable stack of all shapes), Endurance Stacker (10 in a row), Enduring Heights (100,000 Endurance score), Stack of all Trades (20 in a row with all worlds unlocked), Sky High / Infinity Stacker (15 placed) / Infinite Heights (250,000 Infinity score) [confirmed: https://www.cheatcc.com/articles/art-of-balance-cheats-codes-cheat-codes-walkthrough-guide-faq-unlockables-for-playstation-4-ps4-ps4/]. Switch mirrors these as an "Awards list" (per Cubed3) [confirmed: https://www.cubed3.com/games/reviews/nintendo-switch/art-of-balance]
- Multiplayer modes worth noting for the loop: **Tower Tumble** (turn-based Jenga; the player who collapses the stack loses; up to 5 players) and **Swift Stacker** (two players/teams race the same puzzle; online on Wii U — Nintendo EU: "four-versus-four online multiplayer", 1–8 players total) [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/, https://www.nintendo.com/en-gb/Games/Wii-U-download-software/Art-of-Balance-918559.html]. WiiWare original: 2-player split-screen "versus" with 5/7/9-round matches + drop-in co-op [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance, https://art-of-balance.shinen.com/wii/]. **3DS TOUCH! dropped all multiplayer** [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch, https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html]. Switch: "Three additional players can join in at any time" — 4-player drop-in co-op, local wireless, online; gyro aiming added post-launch ("Gyro motion control added via update, that works superbly well with a single Joy-Con") [confirmed: https://art-of-balance.shinen.com/switch/, https://www.cubed3.com/games/reviews/nintendo-switch/art-of-balance]

## 7. Save/progress behavior

Thinly documented. What is safe: progress is persistent and world/token-based; WiiWare saved to console internal storage like any WiiWare title [inferred from platform norms]; remakes add instant retry ("retry levels quickly and as many times as it takes"), fast loads, and skip-ahead unlocking so progress never hard-stalls [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/, https://www.cubed3.com/games/reviews/nintendo-switch/art-of-balance]. No source describes manual save slots or per-level best-time records in Arcade [confirmed: none found] — flag as a research gap if save-slot fidelity matters to the clone.

## 8. Walkthrough / level-list sources (for further digging)

- **artofbalanceguide.com** — full 100-level WiiWare solution index (Worlds A–D, per-level shape lists + solution images + videos) [confirmed: https://www.artofbalanceguide.com/]
- **YouTube, AagamNM 8-part WiiWare walkthrough** ("World A Part 1: Levels 1.1–6.4" etc., "will cover all 100 levels... 1000 points") [confirmed: https://www.youtube.com/watch?v=5xdl2eBR2vM, https://www.youtube.com/watch?v=CbyrgbWgz-g, https://www.youtube.com/watch?v=LzrEbQzDsDU]
- **YouTube "ART OF BALANCE | Full Solution Guide | PS4" playlist** incl. "Full World H Solution Guide" (confirms A–H) [confirmed: https://www.youtube.com/playlist?list=PLfKxoQUn1HR0h6uaez2lJlD0G7GoZS9iR, https://www.youtube.com/watch?v=0vQrgVsD6i8]
- **GameFAQs hubs** with the video walkthroughs mirrored: Wii #979375, 3DS TOUCH! #665692, Wii U #842577, PS4 #190945, Switch #249016 [confirmed: https://gamefaqs.gamespot.com/wii/979375-art-of-balance/videos/1581, https://gamefaqs.gamespot.com/switch/249016-art-of-balance/videos/1480]
- Nintendo Life forum level-help threads (e.g., "Art of Balance Touch World C Level 4.2") [confirmed: https://www.nintendolife.com/forums/3ds/art_of_balance_touch_world_c_level_4_2]
- Official Shin'en microsites (live): /wii/, /3ds/, /wiiu/, /ps4/, /switch/ at art-of-balance.shinen.com [confirmed: fetched directly]
- Unretrieved during this pass (403/paywall, revisit if needed): IGN review text, WiiWare World / Nintendo fandom wikis, RetroAchievements Wii achievement list (would document original-world challenge levels), Serenes Forest review, CheatCC full guide body (trophy list captured; no per-level data)

## 9. Clone takeaways (short)

1. Ship either 100 (original-faithful, 4×25) or 200 (remake-faithful, 8×25) Arcade levels; lettered worlds A–H with a per-world visual theme + one signature block gimmick; final world mixes all [inferred from confirmed structure].
2. Gate worlds by earned tokens (~20/world, any levels), with a branching node map — not strict sequences; embed orange challenge levels that pay double [confirmed pattern].
3. Per level: 3–8 pieces, staged availability, no un-stacking, 3-second stability countdown; gimmick ladder = rounded/ball → weight-limited (glass) → timed → gravity-flip → unstable/see-saw bases → height/time challenge variants → mix [confirmed ladder; piece counts inferred from guide samples].
4. No stars; binary pass + tokens + Endurance/Infinity score attack + platform achievements [confirmed].


---

<!-- ====================================================================== -->
<!-- FILE: physics-materials.md -->
<!-- ====================================================================== -->

# Art of Balance — Physics Behavior & Materials Research

**Game:** Art of Balance (Shin'en Multimedia) — WiiWare original 2010; *Art of Balance TOUCH!* (3DS, 2012); HD remake (Wii U, 2013–2014); PS4 (2016); Nintendo Switch (2018).
**Research focus:** physics model, piece "materials," special physics objects, stability/settling feel, settling time, player control during simulation, quirks/exploits, version differences.
**Tagging convention:** every factual claim is `[confirmed: URL]` or `[inferred]`. Where a page was blocked to direct fetching and the quote comes from a search-engine snippet, that is noted.

---

## 1. Simulation model: 3D-rendered game, effectively 2D-plane physics

No source explicitly names the physics engine or states "2D physics," so this section combines confirmed observations with a clearly-flagged inference.

- Blocks are 3D-rendered geometric solids — a Wii-focused wiki describes them as "3D in nature, and can be any geometric shape, although they are often spheres, oblongs and crosses" [confirmed: https://wiiwaredatabase.fandom.com/wiki/Art_of_Balance (via search snippet; page returned HTTP 402 to direct fetch)].
- The scene is viewed from a fixed front-facing camera onto a play plane with a bowl/tub of water; the goal is stated in-plane: "stack a given set of shapes up without having them fall into the water below" [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance].
- Rotation is locked to discrete steps about the view axis only: blocks "can be rotated at 45° angles" [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance]; a forum review phrases the verb set as "Pick up blocks, position them, rotate them in 45-degree increments, and release them" [confirmed: https://forums.serenesforest.net/topic/63225-art-of-balance-review/ (via search snippet; direct fetch blocked)]. The 3DS version rotates with shoulder buttons and "the degrees you can actually rotate each shape are predetermined" [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html]; on Wii U rotation is via L/R [confirmed: https://pietriots.com/2016-12-20/art-of-balance-collapsing-into-a-puddle-of-tears/] and "a button press that turns a block the same amount every time" [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].
- Gravity acts along one screen-vertical axis, and the gravity gimmick flips it between down and up ("gravity changes from down to up or vice versa") — there is never any sideways gravity or depth movement [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch].
- The 3DS version's autostereoscopic slider offered two camera looks — one "where objects seem to come out of the screen, the other granting depth" — i.e. depth is a camera/stereo effect, not a gameplay axis [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch].
- The Switch-era rendering keeps 3D models and environments (each world its own themed environment; "the blocks are beautifully rendered" with sunlight dynamically occluded by moving objects) [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance].

**Inference for the clone:** the simulation is best modeled as a *2D rigid-body simulation on the XY plane* (single gravity vector, discrete yaw-free rotations, depth-independent contacts) presented with 3D meshes and lighting. A Unity 2D physics setup (or a 3D setup with z-locked Rigidbody constraints) reproduces the original's behavior class exactly; nothing in the evidence requires true 3D center-of-mass balancing [inferred from the confirmed facts above].

- Physics tick rate was a real design variable: Shin'en's Manfred Linz explained that on 3DS "we often only had the physics running in 30fps," while the Wii U build updates "the whole game physics … 240 times" per second, yielding "smoother animation" and "more stable physics" that needed fewer "hacks" than the 3DS build [confirmed: https://www.nintendolife.com/news/2014/02/interview_shinen_multimedia_on_the_wii_u_difference_for_art_of_balance].
- Players perceive the simulation as deterministic: "consistent and clean, the results … identical each time you attempt a specific action" [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].

---

## 2. Core interaction model (drag → rotate → release)

- Each puzzle gives a set of pieces; the task is to place *all* of them so the structure survives [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance]. Pieces arrive in a tray/queue: on 3DS "you can only pick from the starting three blocks available to you, and not the ones awaiting you in the queue" [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html], and on later versions "some blocks in a stage only become available after you have placed others" [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].
- **No re-grabbing:** "You can't simply pick up a shape you've already placed and move it" [confirmed: https://switchplayer.net/2018-10-26/art-of-balance-review/]. This is the rule that converts a soft-body-feeling sandbox into a puzzle.
- A held piece follows the cursor and physics applies the instant it is released (a block falls from the player's hand mid-anecdote when the stylus left the touchscreen: the piece "fell into the water" and the attempt restarted) [confirmed: https://pietriots.com/2016-12-20/art-of-balance-collapsing-into-a-puddle-of-tears/].
- While dragging, the rest of the world is simulated in real time — timer gimmick blocks keep counting after contact [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2].
- Input hardware across versions: Wii Remote pointer on WiiWare ("the intuitive control scheme made possible by the Wii Remote" [confirmed: https://www.metacritic.com/game/art-of-balance-touch/]); stylus touch or Circle Pad cursor on 3DS [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html]; Wii U combines "the GamePad/Pro controller's buttons and analog stick," "the GamePad's touchscreen," and "the original Wii Remote" — switchable "at any time," though Shin'en deliberately rejected GamePad camera+pointer aiming ("We don't use the camera+pointer, as we don't think its a good working control option") [confirmed: https://www.dualshockers.com/review-art-of-balance-watch-the-blocks-fall-along-with-your-dreams/, https://www.nintendolife.com/news/2014/02/interview_shinen_multimedia_on_the_wii_u_difference_for_art_of_balance]. Switch adds stick cursor + touchscreen, and a post-launch update added gyro aiming that "works superbly well with a single Joy-Con" [confirmed: https://www.cubed3.com/games/reviews/nintendo-switch/art-of-balance].
- Pacing is deliberately not twitch-based: "you're not going to be able to toss blocks into the pile quickly enough" to save a teetering stack, so planning beats reflexes [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].

---

## 3. Piece "materials": what the game actually has

**There is no named-material system.** No source describes wood/stone/steel/rubber/balloon/ice piece types with different densities, frictions or bounciness. A targeted search for balloon/ice/rubber/heavy/light piece mechanics returned nothing relevant [confirmed negative: web search, 2026-09-24]. The visual style is a zen "lounge" aesthetic with a "relaxing lounge soundtrack and 8 beautiful environments" [confirmed: https://www.shinen.com/games/game.php3?art%20of%20balance (via search snippet)] and HD remake visuals aiming at "an almost photo real look … reflections, refractions, physics based water" [confirmed: https://www.nintendolife.com/news/2014/02/interview_shinen_multimedia_on_the_wii_u_difference_for_art_of_balance].

**Inferred:** pieces are visually polished wood/stone-like solids, but physically one uniform material for all pieces [inferred; supported by uniform behavior in every review].

Observable physics parameters that *are* documented:

- **Near-zero restitution:** an Art of Balance TOUCH! reviewer flatly notes "objects don't bounce" [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch].
- **Friction matters and is praised:** a Wii U thread commenter claims "the calculation of friction is fantastic" (user comment, not editorial — treat as anecdote) [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance].
- **Rounded pieces roll/slide:** "shapes with rounded edges to deal with" are called out as hard because a round piece "is only really good on top of a stack" (it rolls off elsewhere) [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance, https://www.nintendolife.com/reviews/eshop/art_of_balance_touch]; Game Hoard: where a piece lands "can be key to if they settle into a nice position or roll right off" [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].
- **Shape vocabulary:** rectangles/bars, L-blocks, crosses/X-shapes, half-circles, circles, dumbbell/barbell, large arrow, and spheres [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/, https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html, https://www.nintendolife.com/reviews/eshop/art_of_balance_touch, https://wiiwaredatabase.fandom.com/wiki/Art_of_Balance (via search snippet)]. A given shape keeps identical dimensions every time it appears, letting players learn interlocks [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].
- **Load is counted, not weighed:** "fragile" pieces break based on how many blocks sit on them — glass blocks "can only hold the weight of two blocks," and elsewhere "weight-restricted ones that can hold no more than three other regulars before smashing" (2–3 depending on piece) [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html, https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2]. No source shows mass-dependent crushing, implying the original used a scripted stack-count trigger, not real contact-force thresholds [inferred].

### Gimmick blocks (behavioral, not material)

- **Glass / breakable:** "break if too many blocks are placed on it" [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance]; "blocks that shatter if another is placed on top of them" (Wii U) [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance]; on the Switch version, "clear shapes can crumble from the weight of the blocks placed on top of them" [confirmed: https://switchplayer.net/2018-10-26/art-of-balance-review/].
- **Timer / "burning" blocks:** original WiiWare: "Some shapes have a timer on them that will start counting down once a shape is stacked on top of them … the blocks will break, causing all blocks stacked on top of them to fall" [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance]; 3DS: "timer blocks disappear a few seconds after a shape touches them" / "disintegrate after a short period of time" [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch, https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html]; Wii U presents the same family as "flaming shapes that explode when two touch" plus "timer blocks that countdown and eventually disappear when a new piece is placed atop of them" [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2], and "burning blocks … will disappear if they touch another one that's on fire" usable as demolition tools [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].
- **Gravity-flip blocks:** "drop it anywhere in your stack and gravity changes from down to up or vice versa," enabling upside-down stacks hung from the plinth — Cubed3 calls gravity-swappers the highlight, "a masterful inclusion," and notes "What balances nicely as it is may well be as sturdy as jelly when flipped upside down" [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch, https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2]. Gravity stages use two starting pedestals (floor and ceiling) [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html].
- Each world introduces one new gimmick and the final world combines them all [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/, https://elder-geek.com/2012/06/art-of-balance-touch-review/].

---

## 4. Special physics objects & stage gimmicks (balls, floats, seesaws)

- **The plinth floats on water and has its own buoyancy behavior:** "a platform floating in water" [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance]; on some stages the base is "floating on water, prone to tilting hither and thither when cast off balance" — i.e. the raft physically tilts under off-center load [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2]. Challenge stages replace the stable peg with "a lightweight and easily capsized floaty" [confirmed: https://www.dualshockers.com/review-art-of-balance-watch-the-blocks-fall-along-with-your-dreams/] or "a unique balancing beam" [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]; Super puzzles include "the platform sways on the water" [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance].
- **Seesaw / linked plinths:** Wii U adds "protruding blocks built into the base that are linked so that as one rises, the other falls" [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance]; Switch Player describes later two-plinth stages where paired plinths "behave like weighing scales, dropping or rising as weight shifts" [confirmed: https://switchplayer.net/2018-10-26/art-of-balance-review/]; Cubed3 likewise notes "moving parts that adjust dependant on how much weight is dropped onto a particular section" [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2].
- **Spheres/rolls:** ball-like pieces exist as shapes (spheres, circles, half-circles) rather than as a separate rolling hazard; they roll off unless parked on top [confirmed: https://wiiwaredatabase.fandom.com/wiki/Art_of_Balance (via search snippet), https://www.nintendolife.com/reviews/eshop/art_of_balance_touch].
- **Water = instant fail region:** "letting one piece or more fall into the water forces you to restart the level" [confirmed: https://www.dualshockers.com/review-art-of-balance-watch-the-blocks-fall-along-with-your-dreams/]; inverting gravity, loss is instead judged by "a block passes an invisible line in the air" [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/]. Blocks hitting water get realistic splash audio [confirmed: https://www.wiiwarewave.com/t4383-review-art-of-balance-wii-u-eshop].
- **No buoyant/floating pieces, no wind, no water current on pieces:** not mentioned anywhere across ~15 sources reviewed; water is scenery + fail zone, not a per-piece force [inferred from comprehensive negative search].
- **Timed / height challenge levels (orange cubes):** "time attacks and building a tower as tall as possible" [confirmed: https://switchplayer.net/2018-10-26/art-of-balance-review/]; also "use all pieces in a set time, build a tower as high as possible" [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2]; "a time or height limit that must be met" was already in the WiiWare original [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance].

---

## 5. How stable vs unstable stacks feel; settling time

- The win gate is a short post-placement stability countdown. Original WiiWare: "the structure must stay above water for three seconds, indicated by three lights at the bottom of the screen" [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance]. 3DS keeps a ~3 s gate ("a 3-second countdown … Three seconds can seem like an eternity") [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html]; a Wii U player describes "3 seconds to let the tower 'hold'" [confirmed: https://pietriots.com/2016-12-20/art-of-balance-collapsing-into-a-puddle-of-tears/]; Cubed3's Wii U review: "form a tower that stands solid for three full seconds," with "three lights" and "how agonisingly long those seconds can be" [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2].
- **Later versions shortened the wait.** Wikipedia: "this countdown was shortened in versions following the original Wii release" [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance]; Nintendo Life's Wii U review agrees: "the countdown … is significantly shorter than its predecessor's," probably "to speed up gameplay rather than reduce the challenge" — and that it can let you win "by the very skin of your teeth simply because the timer had finished" [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance]. Exact seconds per version remain unclear across reports [inferred: sources conflict on whether Wii U shows 3 s; Wikipedia/NL claim shorter].
- Unstable builds visibly negotiate: pieces slide and the tower tilts during the countdown — "one piece starts to slide, causing the whole shebang to tilt ever so slightly" [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2]; a doomed tower "can slowly tip toward collapse while the player is left to watch helplessly" [confirmed: https://pietriots.com/2016-12-20/art-of-balance-collapsing-into-a-puddle-of-tears/].
- A nearly-toppled tower can still pass if it never touches water before time expires [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/, https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance].
- Good foundations forgive bad placements: "You can get away with poor placement if you have a solid enough foundation" [confirmed: https://pietriots.com/2016-12-20/art-of-balance-collapsing-into-a-puddle-of-tears/], but "The physics are very eager to present themselves at the smallest opportunity" [same source]. The GameFAQs critic calls the flip side "faulty physics" that "cause a considerable amount of stress," e.g. levels starting "with an already unstable base" demanding "extremely perfect" placement [confirmed: https://gamefaqs.gamespot.com/wii/979375-art-of-balance/reviews/158290 (via search snippet; direct fetch 403)].
- Retry friction is deliberately near-zero: "If you mess up you can just try again in seconds" [confirmed: https://pietriots.com/2016-12-20/art-of-balance-collapsing-into-a-puddle-of-tears/]; "the instant retry system, and quick loading screens encourage repeat play" [confirmed: https://www.cubed3.com/games/reviews/nintendo-switch/art-of-balance].
- **Inferred typical settle:** most successful builds reach visible quiescence within the 3 s window; the design intent is that the countdown *is* the settling timeout, and Endurance scoring rewards fast (i.e. immediately stable) solutions [inferred from confirmed 3 s gate + endurance speed scoring].

---

## 6. Player control during simulation

- **No slow motion and no pause-during-placement exist in any version.** No review, official page, or store listing mentions slow-mo or physics pause; feature lists describe only the game modes below [confirmed negative across all sources fetched; official pages: https://art-of-balance.shinen.com/wii/, /wiiu/, /3ds/].
- **Inferred:** the only temporal affordances are (a) thinking time while *no* piece is in flight between placements, and (b) real-time simulation that is effectively turn-gated — nothing moves in your tray until you grab a piece. During the final countdown the player "is left to watch helplessly," i.e. input over pieces is locked [inferred from https://pietriots.com/2016-12-20/art-of-balance-collapsing-into-a-puddle-of-tears/ + the no-regrab rule at https://switchplayer.net/2018-10-26/art-of-balance-review/].
- Multiplayer is where real-time pressure lives: **Tower Tumble** is turn-based sabotage — each player drops one piece and "the one whose piece collapses the tower 'loses'" [confirmed: https://www.dualshockers.com/review-art-of-balance-watch-the-blocks-fall-along-with-your-dreams/], "a kind of frantic game of Jenga" [confirmed: https://switchplayer.net/2018-10-26/art-of-balance-review/]; **Swift Stacker** races teams on the same puzzle, playable online [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance]; **Endurance** is score-attack with three lives across random puzzles [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html, https://elder-geek.com/2012/06/art-of-balance-touch-review/]; Switch lists Arcade, Endurance, Tower Tumble, Swift Stacker and an endless "Infinity" mode [confirmed: https://www.cubed3.com/games/reviews/nintendo-switch/art-of-balance].

---

## 7. Physics quirks and exploits players actually mention

Confirmed player/reviewer-reported behaviors:

1. **Spontaneous vibration:** blocks that "shake or vibrate until they fall, despite being perfectly balanced," and a four-legged circular block that "can balance on one leg when it shouldn't" — called "dodgy" physics by a reader (other commenters judged it minor) [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch, comments section].
2. **Reasonless sliding:** stacks that "slide without any reason" [same source, comments].
3. **Separation impulse:** placing blocks side by side produces "an invisible force pushing the blocks apart as soon as you set them"; the community workaround is to "allow gravity to pull them together" [confirmed: https://switchplayer.net/2018-10-26/art-of-balance-review/].
4. **Penetration under inverted gravity:** "a glass block, after gravity was inverted, would lightly clip into another block" [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].
5. **Unfair invisible fail line** in gravity stages [confirmed: https://thegamehoard.com/2023-03-14/art-of-balance-wii-u/].
6. **Lucky timer wins** when the stability countdown ends mid-collapse [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance].
7. **Tilt-to-cheat pointer trick:** on Wii U, "turning the GamePad helps 'cheat' slightly!" — angling the pointer to reach placements (a control exploit, not a simulation break) [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2]; the same impulse (physically rotating the device to lean the tower) is described as instinctive but fruitless [confirmed: https://www.dualshockers.com/review-art-of-balance-watch-the-blocks-fall-along-with-your-dreams/].
8. **3DS camera fights:** auto "hover intent" zooms/pan when placing high pieces — "when I was trying to have a steady hand … the camera zoomed out," and the pan "refuses to follow the pieces upward" past a height [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html, https://elder-geek.com/2012/06/art-of-balance-touch-review/].
9. General: "Occasionally the physics have their wonky moments" [confirmed: https://elder-geek.com/2012/06/art-of-balance-touch-review/]; a Wii U user comment asserts "the physics engine drastically changed" between versions [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance, comments].
- **No dedicated exploit for "freezing" the sim** (e.g. hover-at-edge tricks) was found; the closest accepted technique is the gravity-block "build top-down" planning trick [confirmed: https://www.cubed3.com/games/reviews/wii-u/art-of-balance-2].

---

## 8. Version differences (physics-relevant)

| Aspect | WiiWare 2010 | TOUCH! 3DS 2012 | Wii U 2013/14 | PS4 2016 / Switch 2018 |
|---|---|---|---|---|
| Content | 100 levels | 200 levels = "100 from the WiiWare game and 100 new" [confirmed: https://elder-geek.com/2012/06/art-of-balance-touch-review/] | all 200 retained [confirmed: interview URL above] | "little different over its predecessors, even visually" (Switch) [confirmed: https://www.cubed3.com/games/reviews/nintendo-switch/art-of-balance] |
| Physics rate | (unrecorded) | "often … 30fps" sim [confirmed: interview] | 240 Hz sim updates [confirmed: interview] | (unrecorded; engine = Wii U Next-Gen engine) [inferred] |
| Stability wait | 3 s + 3 lights [confirmed: NL 2010 review] | ~3 s [confirmed: SuperPhillip] | "significantly shorter" per NL; "three full seconds" per Cubed3 — reports conflict [confirmed both] | same as Wii U [inferred] |
| Gimmicks | breakable, timer, time/height limits, rounded shapes [confirmed: NL 2010] | adds glass + gravity-flip presentation, 8 worlds [confirmed: NL touch! / Elder-Geek] | adds flaming/exploding + linked seesaw plinths [confirmed: Cubed3, NL Wii U] | inherit full Wii U set [inferred] |
| Input | Wii Remote pointer (+2nd remote co-op) [confirmed: https://art-of-balance.shinen.com/wii/] | stylus touch or Circle Pad [confirmed: SuperPhillip] | stick + touch + Wii Remote, live-swappable; no camera+pointer [confirmed: interview, DualShockers] | stick + touch + gyro (added by patch) [confirmed: Cubed3 Switch] |
| Multiplayer | drop-in co-op + split-screen versus [confirmed: official Wii page] | none (complaint) [confirmed: NL touch!] | 5-player local (4 Remotes + GamePad), online Swift Stacker, leaderboards [confirmed: Cubed3, NL Wii U] | up to 4/5 local + wireless/online [confirmed: Cubed3 Switch] |

Release dates and platforms: WiiWare 2010; 3DS 2012; Wii U 2013–2014; PS4 3 June 2016; Switch 4 October 2018 [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance, https://art-of-balance.shinen.com/3ds/].

---

## 9. Take-aways for the Unity 6.6 clone (all [inferred] recommendations grounded in the facts above)

1. Use 2D physics (Rigidbody2D, single gravity vector, rotation snapped to 45°) rendered with 3D meshes constrained to one plane — this matches every documented behavior and is cheaper to tune than a full 3D sim.
2. Model all pieces as one uniform material with restitution ≈ 0, moderate-to-high friction; get difficulty from *shapes*, not material parameters.
3. Implement gimmicks as scripted triggers on top of physics: stack-count breakage (2–3), contact-armed countdown → despawn/explode, gravity inversion events, kinematic seesaw plinths, and a tilting buoyant raft as a separate revolute/float constraint — mirroring the confirmed count-based (not force-based) breakage.
4. Freeze pieces on release (no re-grab), run the sim in real time during placement, and gate victory behind a ~3 s "3 lights" stability countdown where water contact = level restart; consider exposing a developer-settable countdown length since the franchise itself shortened it.
5. Match the reported sim smoothness with a high fixed timestep (e.g. Unity's FixedUpdate at 240 Hz physics, interpolated presentation) and deterministic ordering to preserve the "identical every time" feel; budget for the known artifacts (vibration, separation impulses) by tuning solver iterations and contact offsets so they're *less* visible than in the 3DS original.
6. No pause/slow-mo during simulation; the design relies on instant retry instead.

*Compiled 2026-09-24. Primary fetch failures (pages blocked to this tool, quotes taken from search snippets and flagged as such): IGN review, GameFAQs reader review, Serenes Forest review, Fandom wiki, Wikipedia via WebFetch succeeded. Reddit comment threads could not be fetched at all (403 through every route), so community quirks are sourced from the visible reviewer/comment ecosystems above instead.*


---

<!-- ====================================================================== -->
<!-- FILE: visual-style.md -->
<!-- ====================================================================== -->

# Art of Balance — Visual Teardown (WiiWare 2010 · touch! 2012 · Wii U 2013 · Switch 2018)

Research for *Balance Stack Hero 2026* (Unity 6.6 clone plan). Method: primary-source image analysis of all official screenshots downloaded from Shin'en's live game sites (stored at `D:/Unity Projects/Balance Stack Hero 2026[Qwen38Max]/independent_research/_shots/`), programmatic hex-palette sampling from those images, plus press coverage and official spec pages. Every fact is tagged **[confirmed: URL]** or **[inferred]**. Hex values are my own median-cut color samples off lossy JPEGs — treat as ±1 lightness band estimates, not engine values.

---

## 1. Overall art direction

The game is a **glossy, miniature "zen diorama"**: one small toy-scale scene — a basin/tray of water on a table in a stylized interior — rendered in full 3D with heavy specular highlights and printed-wallpaper backdrops. It is *not* flat vector and *not* photoreal (until the HD re-releases, see §12). Nintendo Life's pre-release impressions called it "extremely polished, with a glossy, stippled presentation style" [confirmed: https://www.nintendolife.com/news/2010/01/first_impressions_art_of_balance]. Shin'en's own Wii feature banner reads "State-of-the-Art Graphics" [confirmed: https://art-of-balance.shinen.com/wii/about.php]. IGN (8.0) said "the presentation wrapping the whole thing together is just plain slick — this team knows its stuff" [confirmed: https://www.ign.com/articles/2010/02/16/art-of-balance-review, via Wayback 2015-12-06]. Kotaku-style summaries and Metacritic blurbs use "Simple, elegant, and beautiful" [confirmed: https://www.metacritic.com/game/art-of-balance-touch/].

Key creative intent: calm/meditative staging ("Art of Balance simply strikes a chord with the power of beauty" — Manfred Linzner) [confirmed: https://www.cubed3.com/features/interviews/shinen-talks-art-of-balance-for-nintendo-wiiware], against which the physics collapse plays as slapstick tension. The puzzle "wraps" an ordinary object study — like a product render of designer toys [inferred from the three official wallpapers' studio-product framing: https://art-of-balance.shinen.com/wallpapers/...].

## 2. Piece / block shape language

Official Wii count: **"14 Shapes + 2 Special Shapes"**; the specials "break once you put too much load on top, or a timer runs out" [confirmed: https://art-of-balance.shinen.com/wii/about.php]. 3DS expanded to "16 Shapes + 5 Special Shapes", adding fire (explodes on contact with another fire shape) and gravity (inverts gravity) pieces [confirmed: https://art-of-balance.shinen.com/3ds/about.php].

Observed primitives in official shots: cubes with embossed concentric-ring faces, rounded bars ("bones"/dumbbells), spheres, cylinders, half-cylinders (caps), L-pieces, X/cross pieces, plus pieces, triangles/wedges, arrow-tile pieces [confirmed: /wii/images/screen01–15.jpg on https://art-of-balance.shinen.com/wii/gallery.php; corroborated by "balls, bones, crosses and more" https://www.nintendolife.com/news/2010/01/first_impressions_art_of_balance and "rectangles, circles, x-shapes, and half-circles… a large arrow or dumbbell" https://thegamehoard.com/2023/03/14/art-of-balance-wii-u/].

Shape-language rules [inferred from screenshot geometry]:
- Every corner is radiused (~8–12 % of the cube edge on a cube; bars are fully capsule/lozenge ended, i.e. radius = half thickness). No sharp edges anywhere — pieces read like injection-molded plastic toys or lacquered wood.
- All curved pieces are built from the same "thick round bar + sphere" family, so stacking contact areas are generous — physics is about balance, not edge-catching [inferred].
- Rotation is discrete **45° increments** [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance]; button-press rotation "turns a block the same amount every time" [confirmed: https://thegamehoard.com/2023/03/14/art-of-balance-wii-u/].

## 3. Material looks

WiiWare original: pieces look **glossy candy/plastic** with strong specular and per-theme paint finishes: blue glassy bars (#366DB9 body / #83B5E3 specular / #1E468A shade, sampled screen01), translucent jade-green "glass" pieces (screen04), polished gunmetal/stone I-beams with speckle (screen02,05), cream/white matte crosses (screen15), amber-and-giraffe-patterned pieces (screen10,13 — sampled #A2580E body, #E0C98D highlight). Reviewer wording: "glass blocks can only hold the weight of two blocks" [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html]; "Some shapes are clear and will either crumble… or self-destruct after a time limit" [confirmed: https://switchplayer.net/2018/10/26/art-of-balance-review/]. So fragile pieces = visibly translucent; normal pieces = opaque gloss. [inferred: patterned pieces (rings on cubes, spots/dots on some bars) are diffuse decals under a clear gloss coat.]

HD re-releases (Wii U/Switch/PS4) re-skin toward **real materials**: natural oak-grain blocks, granite plinth, terracotta tubs — "The blocks are beautifully rendered, the water looks real enough to drink" [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance]; "a gorgeous zen presentation… looks like a slice of pleasant reality" [confirmed: https://thegamehoard.com/2023/03/14/art-of-balance-wii-u/].

## 4. Backgrounds, themes and per-theme palettes (WiiWare original)

Each world is a "unique lounge style" — a printed wallpaper + out-of-focus houseplants + a tabletop [confirmed: https://art-of-balance.shinen.com/wii/about.php; structure: 100 levels across 4 worlds on Wii vs 200 levels across 8 worlds in every later version — https://art-of-balance.shinen.com/3ds/about.php, /wiiu/about.php, /switch/about.php]. Cubed3 described "fully realised themes like plant life and snowfall" [confirmed: https://www.cubed3.com/games/reviews/wii/art-of-balance-3]; SuperPhillip names "World A's pink flowers to World B's bamboo background" [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html]; a Serenes Forest review notes "Each world has a unique lounge environment and music" [confirmed via search snippet: https://forums.serenesforest.net/topic/63225-art-of-balance-review/].

Palette samples from official Wii shots (dominant regions, my quantization) [all confirmed images: https://art-of-balance.shinen.com/wii/gallery.php; hexes inferred from those pixels]:
- **Magenta halftone** (screen01): base #7F3A64 / #8E4775, lilac halftone dots #A26991, slate #56617A. High-saturation orchid on violet.
- **Green "snake print" + bird-of-paradise** (screen02, 15): #4E826C, #7ABB9F, warm bone #C9DECC, floral orange accents.
- **Cyan floral + bamboo** (screen04): #327899, #55A0AB, leaf #2F5255; watery teal palette.
- **Olive dot-grid zen room** (screen05): walls #67723E/#899B4F, grey cubes #4D4942/#596066 with amber accents #70380A→#703A0B.
- **Dark-green sunburst + sparkles** (screen06): near-black olive #1B2704/#2A330A with #62782B rays and white star particles.
- **Amber swirl + bamboo** (screen08): #A0530E/#8C3D02 base, highlight #F0CA67.
- **Rose halftone + mint** (screen07): #7A3D5C with mint-green zigzag wall #659E89.
- **Wood-panel + "snow"** (screen10, 13): dark walnut #1D0E05–#6E491D, indigo #2B374E, falling white flecks #CEAE76-tinted light.
- **Pink orchid + sage print** (screen11,12): foliage #3F6639/#689C4C, orchid #C9A0C0-ish accents, grey marble basin.
- **Blue leaf-print bathroom** (screen14): #72BBD4→#BBE4F2 sky-blue wallpaper, grey stone #574D3D, potted plants.
General rule: **one saturated wallpaper hue per level + neutral warm wood/metal tray + 3–4 piece colors**, pieces always popping against backdrop [inferred from the set].

## 5. Water, tray and play surface

The stage: a rectangular wooden tray, marble bowl, or **metal plinth in a bowl** rising ~5–8 cm above water; pieces must never touch the water [confirmed across /wii/images/*; "above a pool of water… not cascade down into the drink" https://www.ign.com/articles/2010/02/16/art-of-balance-review; "tiny stone points or shaky platforms floating on water" https://www.nintendolife.com/news/2010/01/first_impressions_art_of_balance]. Water is shallow, highly reflective, tinted by its surroundings (sampled: olive-grey #54554D in wooden trays, green-white #7C9069/#869B77 in marble basins, speculars #E9F4DF) with ripple rings on impact [confirmed visually: screen04, screen12, wiiu_screen02]. "The water animates nicely" [confirmed: https://www.nintendolife.com/news/2010/01/first_impressions_art_of_balance]. On the 3DS port the water aged worst: "looks more like shimmering tin foil than a liquid with any amount of depth" [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html] — note the Wii original's water reads *stylized-reflective*, not transparent [inferred].

## 6. Lighting and shadow

WiiWare: uniform soft "photo studio" key + strong ambient; pieces self-shadow lightly on the tray; no cast dynamic shadows visible in screenshots [inferred from /wii/images/screens 01–15]. Backgrounds are flat-lit [inferred]. HD versions add **real window sunlight**: "light is shining through the window, the objects block out the sunlight as you move them across" [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance] — i.e. dynamic real-time shadows from the stack onto the room; lens bloom through lattice windows [confirmed visually: wiiu_screen02, wiiu_screen15]. The same sunlight can wash out gameplay: bright backdrops "can blur your vision a bit" when a block crosses a sunbeam [confirmed: https://thegamehoard.com/2023/03/14/art-of-balance-wii-u/]. [inferred: the original's "hit or miss… jagged edges in their 3D designs" complaint (https://www.nintendolife.com/reviews/2010/02/art_of_balance) means background geometry was low-poly with aliasing, while blocks were smooth-shaded with high specular.]

## 7. Camera

**Near-fixed, slightly-high eye-level view at a gentle downward tilt; mild perspective (NOT orthographic)** [inferred from consistent verticals with slight convergence across all official shots — tray front is trapezoidal, plants converge]. One framing per level; the stack grows toward camera-center. The camera **zooms in on the "action" when a level resolves** [confirmed: https://www.nintendolife.com/news/2010/01/first_impressions_art_of_balance] and can also zoom out unexpectedly during placement on touch controls [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html]. No camera shake evidence; split-screen versus and multi-angle views appear in HD versions (wiiu_screen07 shows side-by-side dual trays) [confirmed: /wiiu/gallery.php].

## 8. Particles and feedback

- **Water splash**: a falling block produces a white droplet-particle burst; the Wii original additionally threw **screen-wet splash onto the TV** ("the water doesn't seem to splash the screen anymore" — a complaint about the 3DS port) [confirmed: https://www.nintendolife.com/reviews/eshop/art_of_balance_touch comments]. Particle spray frozen mid-air is visible in wiiu_screen02 [confirmed].
- **Ambient sparkles**: floating white star/glitter sprites in several themes (screen06,09,10; snow-fleck variants) [confirmed: /wii/images/].
- **Success**: "Level cleared!" ribbon banner (Switch) [confirmed: switch gallery screen12] + celebratory zoom; block "plop" SFX on water entry [confirmed: https://www.superphillipcentral.com/2012/07/art-of-balance-touch-3dsware-review.html].
- **Countdown**: a circular gauge with red/white needle (Wii, screen06) or numeric timer; post-Wii versions cut the hold-time to **3 seconds** [confirmed: https://en.wikipedia.org/wiki/Art_of_Balance; thegamehoard quote].
- Fire pieces flash before self-destruct; gravity pieces invert the stack [confirmed: https://art-of-balance.shinen.com/3ds/about.php]. No dust/impact puff evidence — impacts read via sound + jiggle, not dust [inferred from absence in all shots].

## 9. HUD and menus

In-game HUD is intentionally near-absent [inferred from screenshots]: top-center **row of dots** marks the level's place in the world (one filled black; screen07); bottom-center a **black pill with green dots = blocks remaining** (screen11) or a circular score/count (screen05, "0" next to a ring); bottom-right **available-piece inventory icons** (screen12: three blue silhouettes); a **circular timer dial** top-right during the settle phase (screen06). Placement uses a **translucent ghost preview** with a small crosshair/orb cursor (screen02,04,15) — ghost opacity ≈40–60 % [inferred].

Menus: warm gradient rooms (orange screen03, green screen09) with **sparkle field backdrop**, a **glossy black rounded-rectangle "cabinet" panel** holding world cards in a curved 3D carousel ("World A, 0/31" screen09; 3DS "World F"; Switch "World E" over an ocean/sky backdrop with sun flare), blue circular arrow buttons, Wii-style button prompts ("▼ Back", " Select") [confirmed: /wii/images/screen03,09; /3ds/images/screen04; switch gallery]. Level select in HD = **grid of textured cubes** (orange cubes = challenge levels; cleared cubes' patterns light up) [confirmed: wiiu_screen05,10; thegamehoard; Cubed3 "a difficulty-denoting circle pattern that clears when you best it" https://www.cubed3.com/games/reviews/wii/art-of-balance-3].

## 10. Typography and logo

All-caps/rounded UI lettering in menus ("Icon Selection", "CONTROLLER", "Level cleared!") is a **rounded, bold techno display face — blue fill with white outline + soft drop shadow** in the Wii version [confirmed visually: screen03, screen09, wiiu_screen11]. The **logo wordmark is lowercase "art of balance"**, a geometric rounded squarish font (lookalike of a Eurostile/Digiface-adjacent rounded sci-fi face), light blue/cyan with white glow, "art of" small and right-aligned above "balance" [confirmed: wallpapers + title screens wiiu_screen01,14]. [inferred] The typeface is bespoke/bundled, not a famous retail face.

## 11. Sound (one-paragraph context)

Chill lounge: "Zany, yet serene, backing tracks… never become annoying" (Cubed3) [confirmed: https://www.cubed3.com/games/reviews/wii/art-of-balance-3]; "really complex but friendly lounge music" [confirmed: https://pietriots.com/2016/12/20/art-of-balance-collapsing-into-a-puddle-of-tears/]; Linzner: they "tested quite a few styles before we settled on the current type of music" [confirmed: cubed3 interview]. Nintendo Life found Wii tracks "very similar in style… repetitive" [confirmed: https://www.nintendolife.com/reviews/2010/02/art_of_balance].

## 12. Technical presentation & version differences

| Fact | WiiWare 2010 | 3DS touch! 2012 | Wii U 2013/14 | Switch 2018 |
|---|---|---|---|---|
| Levels/worlds | 100 / 4 [confirmed: /wii/about.php] | 200 / 8 [confirmed: /3ds/about.php; nintendo.com/en-gb page] | 200 / 8 [confirmed: /wiiu/about.php] | 200 / 8 [confirmed: /switch/about.php] |
| Video modes | 4:3 + 16:9; NTSC 480i, PAL 576i, EDTV/HDTV 480p; 60 fps [confirmed: /wii/about.php] | top 800×480 native [confirmed by screenshot pixel size] | captured 1280×720 [confirmed by screenshot pixel size]; "into HD" (NL review) | 200 MB; 60 fps docked+handheld (Shin'en on X) [confirmed: search results re nintendo.com store page] |
| Style | stylized glossy pop-wallpaper lounge | same, brighter/cleaner assets, stylus UI | photoreal zen room, sun shafts, dynamic shadows | same as Wii U (criticized as "little different even visually" — Cubed3) [confirmed: https://www.cubed3.com/games/reviews/nintendo-switch/art-of-balance] |
| Extras | co-op, split-screen versus, 800 Wii Points | touch controls; lost screen-splash | GamePad touch/analog, online, Tower Tumble | +Infinity, Swift Stacker, online co-op [confirmed: official about pages] |

Wii gallery screenshots measure 814×448 px — ≈16:9, matching the advertised "4:3 and 16:9 screen modes" [confirmed: /wii/about.php + image files]. Physics: tuned for fun, "finely tuned over a long time until the gameplay and fun aspects were maximised" (Linzner) [confirmed: cubed3 interview]; Wii U rebuild changed friction/solver ("the physics engine drastically changed… even the same puzzles might not work"; "the calculation of friction is fantastic") [confirmed: https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance comments].

## 13. Takeaways for the clone

Replicate the **WiiWare original look** (stylized-glossy, not the HD photoreal re-skin): capsule/cube pieces with ~10 % corner radii in 3 material families (opaque gloss candy, translucent glass, painted-wood/metal); a single high-saturation printed-wallpaper plane + 2 billboard foliage props + a wooden tray of reflective-but-opaque water per theme; near-fixed ~10–15° downward camera with mild FOV; ghost preview + 45° snaps; splash particles + wet-screen on water failure, ambient sparkles, 3-second settle; black-pill HUD, dotted progress, glossy black carousel menus with rounded blue UI type. Six-to-eight themes, each = wallpaper hue + material accent pair. [all inferred-from-above]

