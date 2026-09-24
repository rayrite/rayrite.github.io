I couldn’t create a downloadable file in this turn. Below is the Markdown deliverable, ready to save as **`art_of_balance_unity_6_6_implementation_plan.md`**.

### Art of Balance Recreation — Unity 6.6 Implementation Plan

**Primary target:** The visuals, interaction, and main gameplay loop of the original WiiWare release.  
**Extended scope:** Gameplay variations and presentation improvements documented in the Wii U, PlayStation 4, and Nintendo Switch versions.  
**Recommended architecture:** A 3D-rendered game with a two-dimensional physics simulation, data-driven puzzles, and separately configurable game modes.

#### 1. Scope, evidence, and implementation priorities

The project should be built in two layers:

1. **WiiWare-style foundation**
   - Precise shape selection, rotation, and placement.
   - Physically simulated stacking above water.
   - Fragile and timed shapes.
   - Standard, height, time, and balance challenges.
   - Rapid failure and retry.
   - A restrained lounge-inspired presentation.
   - Two-player cooperative and split-screen competitive play.

2. **Expanded-port features**
   - Additional puzzle content and environments.
   - Larger local multiplayer sessions.
   - Endurance, Tower Tumble, Swift Stacker, and Infinity modes.
   - Linked moving supports.
   - Gravity-changing mechanics.
   - Online competition and leaderboards.
   - Additional input methods and enhanced rendering.

The most important design decision is to **avoid building a generic stacking game and adding the appearance afterward**. Shape handling, collider geometry, surface friction, camera framing, and the duration of the completion countdown all influence the puzzle solutions.

**Evidence conventions used in this document**

- **Documented:** Supported by the linked publisher material, storefront descriptions, or contemporary reviews.
- **Reference observation:** Informed by analysis of the linked WiiWare gameplay video; not a measurement of the original engine.
- **Proposed implementation:** A recommended design for the Unity recreation, not a claim about the original source code.
- **Verification needed:** A detail that requires further capture or hands-on testing before claiming exact fidelity.

**Unity version qualification:** Unity 6.6 is the requested target. Exact Unity 6.6 package versions, rendering APIs, and console deployment compatibility were not verified in this research. The plan deliberately avoids depending on a particular unverified package version or new API. Confirm those dependencies at project initialization.

### 2. Reference feature baseline

#### 2.1 Original WiiWare release

The original game includes:

- 100 puzzles.
- Four worlds, according to the contemporary feature listing.
- Shape rotation and placement using the Wii Remote.
- Two-player drop-in cooperative play.
- Two-player split-screen versus play.
- Height, time, and balance challenges.
- Shapes that break under excessive load.
- Shapes that break after an activated timer expires.

The contemporary feature listing describes **14 shapes plus two special shape types**. Do not interpret that as proof of exactly 16 distinct geometric silhouettes: special behavior and geometric shape should be modeled separately.

A contemporary WiiWare review describes completion as keeping the placed structure above water for **three seconds**, represented by three lights. That is the best documented initial value for the original-style ruleset.

Sources: [Nintendo’s WiiWare listing](https://www.nintendo.com/en-gb/Games/WiiWare/Art-of-Balance-284413.html), [Wii’s World feature listing](https://www.wiisworld.com/wiiware-games/Art-of-Balance.html), and [Nintendo Life’s WiiWare review](https://www.nintendolife.com/reviews/2010/02/art_of_balance).

#### 2.2 Expanded versions: what is actually established

| Area | WiiWare baseline | Wii U | PlayStation 4 | Nintendo Switch |
|---|---|---|---|---|
| Puzzle campaign | 100 puzzles; four worlds | Expanded campaign; exact content mapping needs verification | 200 puzzles confirmed | 200 puzzles across eight worlds confirmed |
| Local cooperative play | Two players | Up to five total players described in review | Store lists one to four players | Up to four total players |
| Split-screen competition | Confirmed | Swift Stacker described | Confirmed | Swift Stacker confirmed |
| Endurance | Not part of the documented original baseline | Confirmed | Confirmed | Confirmed |
| Tower Tumble | Not part of the documented original baseline | Confirmed | Verify exact mode roster | Confirmed |
| Infinity | Not part of the documented original baseline | Not established by consulted Wii U review | Not established by consulted PS4 listing | Confirmed by publisher press kit |
| Online play | Not part of original baseline | Online Swift Stacker described | Two online players listed | Two online players listed |
| Linked supports | Verify original coverage | Explicitly described | Verify puzzle coverage | Explicitly described in review |
| Gravity reversal | Not established here | Verify | Verify | Explicitly confirmed |
| Motion-pointer support | Wii Remote interaction | Wii Remote play described | Do not assume equivalent support | Added in patch 1.1, according to publisher |

**Important:** A feature appearing in the Switch release does not establish that it originated there. Likewise, do not assume all later releases share identical player limits, timers, or mode rules.

Sources: [Wii U review](https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance), [PlayStation Store](https://store.playstation.com/en-us/product/UP4496-CUSA01465_00-ARTOFBALANCE0000), [Nintendo Switch listing](https://www.nintendo.com/us/store/products/art-of-balance-switch/), [Switch publisher page](http://artofbalance.shinen.com/switch/), and [Switch press kit](http://shinen.com/press/sheet.php?p=art_of_balance%28Switch%29).

### 3. Preproduction: establish a fidelity specification

Before producing the full campaign, build a reference notebook.

For each observed puzzle or mechanic, record:

- Release and platform.
- Shape silhouettes and relative dimensions.
- Platform outline and location.
- Waterline position.
- Available shape selection and replenishment behavior.
- Rotation increments.
- Whether a held piece interacts physically with the tower.
- Whether released pieces can be selected again.
- Completion countdown trigger and duration.
- Failure trigger and reset behavior.
- Special-block activation conditions.
- Camera composition and UI placement.
- A reference timestamp or screenshot identifier.
- Confidence level and unresolved questions.

Use the [WiiWare gameplay reference](https://www.youtube.com/watch?v=pKFl3PmNtTg) as an initial behavioral and visual reference, not as a substitute for measuring the entire game.

**Priority verification tasks**

1. Determine the exact piece-selection rules.
2. Measure the rotation step and repeat behavior.
3. Determine whether preview pieces push placed pieces.
4. Establish whether the final countdown starts on release, first contact, or another placement event.
5. Confirm timed-block activation and cancellation behavior.
6. Determine whether fragile blocks count supported pieces, physical mass, or another load rule.
7. Verify challenge scoring and progression requirements.
8. Record the complete original shape inventory.

**Preproduction exit criterion:** The team can describe the interaction rules without relying on phrases such as “probably like a normal physics game.”

### 4. Technical foundation

#### 4.1 Use 2D physics with 3D rendering

**Recommendation:** Simulate gameplay on a two-dimensional plane and render all visible objects as three-dimensional meshes.

This provides:

- Reliable planar stacking.
- No accidental depth-axis movement.
- No unwanted out-of-plane tipping.
- Straightforward polygon collision shapes.
- Easier picking and placement validation.
- Consistent geometry for height and water checks.

The game can still have:

- Extruded shapes with visible thickness.
- Beveled edges.
- Specular materials.
- Real-time shadows.
- Reflective water.
- Fully modeled rooms and bowls.
- Perspective or orthographic presentation.

This is a **2.5D architecture**, not a sprite-based visual treatment.

**Alternative:** Constrained 3D rigid bodies can work, but introduce additional solver behavior and depth constraints without contributing much to the core puzzle. Choose that approach only if prototype testing demonstrates a clear advantage.

#### 4.2 Separate simulation and presentation

Use three independent layers:

| Layer | Responsibility |
|---|---|
| Simulation | Bodies, contacts, gravity, supports, hazards, block behavior |
| Rules | Inventory, mode state, timers, scoring, success, failure |
| Presentation | Meshes, lighting, water, particles, sound, camera, UI |

A splash effect must never determine failure. A failure event should cause the splash effect.

Likewise, a countdown animation must not be the authoritative timer. The rules layer owns the timer; the UI displays it.

#### 4.3 Recommended project setup

- A Unity 6.6 project using the Universal Render Pipeline, subject to package compatibility validation.
- A 3D renderer rather than a sprite-focused rendering setup.
- Input abstraction supporting mouse, controller, touch, and optional motion input.
- Source control from the first prototype.
- Serialized, reviewable puzzle assets.
- Automated tests for rules and inventory.
- A dedicated physics calibration scene.
- A dedicated visual comparison scene.
- Separate quality profiles for original-style and enhanced presentation.

Start with a desktop build. Recreating Wii U or Switch features does **not** require deploying to those consoles during development.

Actual console deployment is a separate compatibility and platform-integration task.

### 5. Runtime architecture and content model

The following are **proposed project components**, not existing Unity APIs.

| Component | Responsibility |
|---|---|
| Session controller | Starts and ends a game session; owns the selected mode |
| Arena controller | Owns one independently simulated puzzle |
| Puzzle loader | Instantiates platforms, shapes, and challenge settings |
| Shape inventory | Tracks available, reserved, released, and consumed pieces |
| Placement controller | Handles selection, preview, rotation, validation, and release |
| Physics coordinator | Applies queued actions at simulation boundaries |
| Block behavior controller | Handles fragile, timed, and gravity-changing behavior |
| Objective evaluator | Determines progress, success, and failure |
| Mode controller | Implements campaign, race, survival, or turn-based rules |
| Presentation controller | Responds to gameplay events with audiovisual feedback |
| Progress service | Saves completed puzzles, unlocks, and records |
| Network authority | Validates commands and owns authoritative online state |

#### 5.1 Shape definition

Each reusable shape definition should contain:

- A stable identifier.
- Display name.
- Two-dimensional collision outline or compound geometry.
- Three-dimensional visual mesh.
- Preview icon.
- Physical material settings.
- Mass policy.
- Optional center-of-mass override.
- Behavior type and behavior parameters.
- Sound category.
- Visual material category.

Keep geometry and behavior separate. The same geometric piece should be able to appear as a normal piece, fragile piece, or timed piece.

#### 5.2 Puzzle definition

Each puzzle asset should contain:

- Stable puzzle identifier.
- World and display ordering.
- Environment reference.
- Platform arrangement.
- Ordered piece inventory.
- Availability/reveal policy.
- Challenge type.
- Completion countdown profile.
- Time or height target, where relevant.
- Special-mechanic settings.
- Progression prerequisites.
- Authoring notes.
- Reference or solution captures.
- Content revision.

#### 5.3 Rules profiles

Maintain separate profiles for:

- Original-style campaign.
- Expanded campaign.
- Cooperative play.
- Competitive race.
- Turn-based Tower Tumble.
- Endurance.
- Infinity.

Profiles should hold behavior differences, rather than scattering platform-specific conditions throughout the code.

Examples include:

- Local player limit.
- Countdown duration.
- Permitted shape behaviors.
- Available-piece window.
- Whether retries consume lives.
- Whether a session uses finite or infinite inventory.
- How scoring is calculated.
- Whether late join is permitted.

### 6. Main gameplay loop

#### 6.1 Player-facing loop

1. Select a puzzle.
2. Inspect the platform and available shapes.
3. Select a shape.
4. Move it above the playfield.
5. Rotate it into a useful orientation.
6. Release it.
7. Watch the resulting physical response.
8. Adapt the next placement to the tower’s actual position.
9. Repeat until all required pieces are used.
10. Survive the completion countdown.
11. Continue, replay, or return to the puzzle map.

If a gameplay piece enters the water, the attempt fails and the player can retry quickly.

The emotional rhythm should alternate between **careful placement** and **brief observation**. Do not introduce unnecessary confirmation dialogs or long transitions.

#### 6.2 Session states

| State | Permitted behavior | Transition |
|---|---|---|
| Loading | Instantiate and reset arena | Arena ready |
| Ready | Display puzzle; enable participation | Start condition met |
| Playing | Select, move, rotate, release | Inventory exhausted or failure |
| Completion countdown | Continue physics and hazards | Countdown ends or failure |
| Succeeded | Record result; present completion | Continue or replay |
| Failed | Block new placements; present failure | Retry |
| Paused | Suspend relevant local simulation and timers | Resume |

A player may be holding a shape while the rest of the tower moves. Therefore, “holding a piece” is a placement substate, not a reason to suspend the entire arena.

#### 6.3 Completion rules

For the original-style profile, begin with the documented three-second countdown.

A successful completion requires:

- All required inventory has been consumed.
- No required piece remains held.
- No failure event has occurred.
- The mode-specific objective is satisfied.
- The completion countdown has elapsed.

**Do not require all bodies to sleep or reach near-zero velocity unless reference testing establishes that rule.** “Remain above water” is different from “be perfectly motionless.”

Similarly, do not silently replace the original countdown with a more forgiving or stricter “stability score.”

The Wii U review reports a shorter countdown than the original, but does not establish a reliable exact duration. Keep it configurable and measure it before claiming fidelity.

#### 6.4 Failure precedence

Resolve failure and success at a consistent simulation boundary.

Recommended rule:

- If a piece enters the hazard during the same simulation step in which the countdown would finish, failure wins.

This is a proposed deterministic tie policy; verify it against the reference if exact replication is required.

### 7. Shape handling and input

#### 7.1 Picking

Selecting a shape should:

1. Reserve that exact inventory entry.
2. Create or reveal its placement preview.
3. Attach the preview to the player’s pointer.
4. Preserve a consistent grab anchor.
5. Show the available rotation actions.
6. Leave the existing tower simulating.

Do not remove an inventory entry permanently until release is accepted.

#### 7.2 Pointer-to-world mapping

Project the pointer onto the gameplay plane.

The mapping must account for:

- Camera projection.
- Viewport rectangle.
- Split-screen layout.
- UI scaling.
- Touch offset.
- Camera movement in Infinity mode.

Do not convert screen coordinates into world positions using assumptions that work only for the initial resolution.

#### 7.3 Rotation

The game is described as supporting 45-degree rotation steps, but exact input behavior should still be measured.

Recommended initial implementation:

- Discrete left/right rotation.
- A configurable step size.
- A short visual transition.
- Immediate update of the logical target orientation.
- Controlled button-repeat behavior.
- Rotation around a consistent local anchor.

Avoid free rotation by default. It changes both the feel and the solution space.

#### 7.4 Preview collision policy

The available video analysis does not conclusively establish how held pieces interact with the stack.

Implement two prototype policies:

**Non-interacting preview**

- The held piece does not push the tower.
- Collision queries identify valid release positions.
- Invalid overlaps prevent release.

**Physical held piece**

- The held piece follows the pointer through constrained physical movement.
- Contact can affect the tower.
- Speed and displacement are limited to prevent unrealistic impacts.

Evaluate both against captured behavior. Do not select one solely because it is easier to implement.

For the first functional prototype, the non-interacting preview is simpler and less likely to introduce misleading physics.

#### 7.5 Release transaction

A release should be processed atomically:

1. Confirm inventory ownership.
2. Confirm the candidate position and orientation.
3. Recheck overlap against the current simulation state.
4. Reject invalid placement or accept it.
5. Consume the inventory entry.
6. Activate the dynamic body.
7. Apply the intended release velocity policy.
8. Emit one placement event.
9. Update inventory availability.
10. Evaluate whether the completion countdown should begin.

The recheck matters in cooperative play: another player may have changed the tower since the preview was last validated.

**Recommended starting policy:** Released pieces inherit no pointer “throw” velocity. Treat throwing as a separate optional feature unless the reference proves otherwise.

#### 7.6 Repositioning and undo

A Switch review explicitly states that already placed shapes cannot simply be picked up again.

For the fidelity profile:

- Released pieces cannot be grabbed.
- No ordinary undo.
- Restart remains immediately accessible.

If an accessibility or practice mode adds undo, label it as an extension and keep its records separate from standard play.

### 8. Physics calibration and collision geometry

#### 8.1 Build a calibration laboratory first

Create test arrangements for:

- A flat block on a flat platform.
- A tall column.
- A long horizontal beam.
- An offset cantilever.
- A circular piece supporting a flat piece.
- A flat piece supporting a circular piece.
- Two pieces placed almost edge-to-edge.
- A narrow support.
- A bridge across two supports.
- A fragile support beneath multiple pieces.
- A moving-platform arrangement.

These scenes should be faster to run than loading campaign puzzles.

#### 8.2 Recommended starting parameters

These are **prototype tuning values**, not measurements of Art of Balance:

| Parameter | Initial proposal |
|---|---|
| Rendering target | 60 frames per second |
| Physics update | Start at 120 simulation steps per second; profile and compare alternatives |
| Reference scale | A medium block approximately one world unit wide |
| Restitution | Near zero |
| Friction | Moderate to high; tune using slip tests |
| Damping | Low enough to preserve natural tipping |
| Solver effort | Increase only when calibration scenes demonstrate a need |
| Sleeping | Conservative enough that marginal towers still collapse |
| Release velocity | Zero unless a specific input mechanic requires otherwise |

Do not compensate for a poor collision outline by adding extreme friction or damping.

#### 8.3 Collider construction

- Rectangular pieces: simple boxes.
- Circular pieces: circles rather than coarse polygon approximations.
- Convex irregular pieces: carefully authored polygons.
- Concave pieces: compound convex geometry.
- Hollow shapes: preserve the opening; do not accidentally fill it with a convex hull.

For compound pieces:

- Remove unnecessary internal overlaps.
- Inspect seams where another piece could snag.
- Verify mass distribution.
- Ensure all sub-colliders belong to one logical piece.

#### 8.4 Visual mesh versus collider

The physics outline and visible outline should agree closely.

Use bevels to catch light, but do not make the collider so much smaller that the player sees objects floating apart.

A useful authoring test is to render:

- The shaded mesh.
- Its collision outline.
- Its center of mass.
- Its contact points.

Review these overlays before accepting each shape.

#### 8.5 Mass and center of mass

Start with a consistent density policy so larger pieces naturally weigh more, then compare outcomes with the reference.

However, do not assume original fragile-block rules are driven by the same mass model.

Mass affects:

- Tower tipping.
- Moving supports.
- Impact response.
- Center of mass of compound pieces.

The fragile-block rule may instead count supported pieces. Keep those concepts separate.

#### 8.6 Avoid false stability

Do not:

- Freeze placed blocks after a short delay.
- Parent touching pieces together.
- Increase friction when the tower is almost falling.
- Snap pieces onto invisible grid positions.
- Prevent tipping by altering the center of mass automatically.

Those shortcuts undermine the principal gameplay mechanic.

### 9. Recreating the WiiWare visual presentation

#### 9.1 Overall art direction

The original should guide composition and restraint.

Reference analysis suggests:

- A fixed, predominantly side-on gameplay view.
- Smooth, solid-looking geometric pieces.
- A bowl or basin containing reflective water.
- Muted room backgrounds.
- Clear separation between the tower and environment.
- Compact interface elements that leave the stack unobstructed.

The contemporary review also describes three-dimensional backdrops and relatively smooth-looking shapes.

**Visual priority order**

1. Camera composition.
2. Shape silhouettes.
3. Shape thickness and bevels.
4. Platform and waterline placement.
5. Material response.
6. Contact shadows.
7. Background styling.
8. Effects and post-processing.

A recognizable composition with restrained shaders is preferable to elaborate water in an incorrectly framed scene.

#### 9.2 Camera

Begin with an orthographic camera and a small elevation adjustment if needed to reveal object thickness and the bowl.

Then compare it with a long-lens perspective alternative.

The reference’s “orthographic-style” appearance does not prove the original projection type.

Keep the camera:

- Fixed during ordinary campaign placement.
- Free from shake.
- Free from automatic reframing after every drop.
- Consistent between retries.

Fit the playable region without distorting it at different aspect ratios.

#### 9.3 Shape meshes

Use a repeatable production pipeline:

1. Author the 2D outline.
2. Extrude it to a consistent depth.
3. Add restrained bevels.
4. Generate clean face and side normals.
5. Create UVs.
6. Assign material categories.
7. Create the matching collider asset.
8. Validate silhouette and contact alignment.

Keep the front face visually legible. Excessive roughness detail or large bevels can make exact contact boundaries harder to judge.

#### 9.4 Materials

Build a small material library rather than a unique shader for every piece:

- Standard opaque block.
- Alternate standard surface.
- Fragile or glass-like block.
- Timed special block.
- Platform.
- Bowl.
- Water.

Treat exact color and texture choices as reference-matching tasks. Do not assume every version uses identical materials.

For special pieces:

- Preserve the underlying silhouette.
- Add readable cracks, indicators, or timer treatment.
- Avoid relying on transparency alone to communicate behavior.
- Keep the contact boundary visible against the background.

#### 9.5 Lighting

Recommended original-style setup:

- One dominant soft light.
- Baked environmental illumination.
- Restrained ambient fill.
- Dynamic shadows for the tower.
- Gentle specular highlights.
- Limited post-processing.

Avoid:

- Strong depth of field on gameplay pieces.
- Heavy bloom.
- Aggressive vignette.
- Film grain.
- Motion blur.
- Exposure adaptation that changes the apparent waterline.

The goal is tactile clarity, not cinematic spectacle.

#### 9.6 Bowl and water

Separate the scene into:

1. Bowl exterior and rim.
2. Visible water surface.
3. Platform.
4. Logical hazard boundary.

The bowl rim should not accidentally become a usable support unless a puzzle explicitly requires it.

For water rendering, begin with:

- A shallow surface mesh.
- Subtle animated normals.
- A restrained reflection contribution.
- Fresnel response.
- Local ripple effects.
- A modest splash effect.

An initial reflection can use a simplified reflected render of relevant geometry. Upgrade to a planar reflection only if its cost and complexity are justified.

Keep water animation cosmetic. Ripples should not move the failure boundary.

#### 9.7 Background environments

Create a modular environment kit:

- Walls and floor.
- Window or light-opening elements.
- Furniture silhouettes.
- Decorative panels or artwork.
- Plants or similar set dressing.
- Environment-specific lighting and color settings.

Use lower contrast and less detail behind the active tower.

For an original-scale campaign, prepare four environment themes. For expanded scope, grow to eight without changing the gameplay coordinate system.

Do not claim these proposed assets reproduce the exact original rooms until they have been compared against references.

#### 9.8 Interface

Recreate the original interface’s functional hierarchy:

- Puzzle/world identity.
- Available shapes.
- Remaining inventory.
- Completion lights or countdown.
- Challenge-specific time or height display.
- Restart and pause access.
- Clear success/failure feedback.

Use three completion indicators for the original-style countdown, consistent with the contemporary review.

Do not derive exact map layout or unlock counts from a single ambiguous video frame.

#### 9.9 Audio

Use original or appropriately licensed audio matching the functional character of the game:

- Relaxed lounge-oriented music.
- Soft placement clicks.
- Material-dependent contact sounds.
- Subtle rotation feedback.
- Water splashes.
- Fragile-piece break sounds.
- Distinct completion tones.

Trigger impact audio using meaningful collision intensity, with cooldowns and voice limits. Otherwise a settling tower can produce a rapid stream of tiny clicks.

### 10. Original challenge mechanics

#### 10.1 Standard puzzles

Objective:

- Place all required shapes.
- Keep required pieces out of water.
- Survive the completion countdown.

Author difficulty using:

- Shape order and availability.
- Support width.
- Rounded surfaces.
- Offset centers of mass.
- Overhang requirements.
- Fragile-piece placement.
- Limited opportunities to build a wide base.

#### 10.2 Fragile shapes

**Documented behavior:** Some pieces break when too much is stacked above them.

**Unresolved detail:** The original load calculation is not established by the consulted material.

Support two candidate implementations during calibration:

**Supported-piece count**

- Build a directional support graph from contacts.
- Identify pieces supported through the fragile piece.
- Count unique logical pieces rather than collider contacts.
- Break when the configured threshold is exceeded.

**Physical load approximation**

- Use sustained compressive contact information.
- Filter short-lived spikes.
- Compare the estimated supported load with a threshold.

Neither is automatically a perfect representation of load sharing across a bridge.

For complex multi-support arrangements, explicitly define whether a piece counts against both supports or has its load distributed. Verify this behavior rather than hiding it inside implementation details.

On break:

1. Emit one break event.
2. Remove the gameplay support.
3. Spawn cosmetic fragments.
4. Wake affected bodies if necessary.
5. Let the remaining tower fall naturally.

Cosmetic fragments should not trigger water failure or become unintended supports.

#### 10.3 Timed shapes

The WiiWare review describes shapes whose timers begin when another shape is stacked on top.

Recommended behavior state:

- Dormant.
- Activated.
- Counting down.
- Broken.

Detect meaningful support from another gameplay piece, not any side collision or cosmetic contact.

Expose these unresolved rules as configuration:

- Does the timer pause when unloaded?
- Does unloading reset it?
- Is activation permanent?
- Does it start on impact or sustained support?

For the first prototype, use permanent activation after a valid support contact, clearly marked as a provisional rule.

#### 10.4 Height challenges

Measure height from released gameplay geometry, not from the cursor or held preview.

Decide through reference testing whether the target must be:

- Reached momentarily.
- Maintained throughout a countdown.
- Satisfied only at final completion.

The proposed default is to require the target at completion, while retaining the standard water-failure rule.

Use a readable target marker and avoid unnecessary numerical clutter.

#### 10.5 Time challenges

Use a dedicated puzzle timer.

Specify:

- When it begins.
- Whether the final hold is included.
- Whether local pause suspends it.
- How timeout and completion on the same step are resolved.

These rules must be part of the puzzle profile, not hard-coded assumptions.

#### 10.6 Balance challenges and moving bases

Implement physical instability through a constrained support:

- A pivoting platform.
- A platform with limited translation.
- A restoring force.
- Adjustable damping.
- Explicit travel or angle limits.

Do not merely animate a support back and forth unless the observed challenge uses prescribed movement. A balance-sensitive platform should react to where the player places weight.

### 11. Wii U deep dive

#### 11.1 Documented differences

The consulted Wii U review describes:

- Enhanced HD presentation.
- More elaborate water and lighting.
- Shorter final countdown.
- Cooperative play with up to five total players.
- Linked supports that move in opposite directions.
- Endurance.
- Tower Tumble.
- Swift Stacker, including online competition.

Source: [Nintendo Life’s Wii U review](https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance).

#### 11.2 Five-player cooperative interaction

Extend the original two-player ownership system rather than creating a different placement implementation.

Each participant needs:

- An input source.
- A distinct pointer.
- A held-piece reservation.
- A player color and redundant visual identifier.
- Independent placement controls.

Inventory reservation must prevent two players from selecting the same piece.

Resolve simultaneous accepted actions in a stable order. Include an explicit policy for overlapping held previews and nearly simultaneous releases.

Late join should:

- Register a new participant.
- Display the new cursor.
- Leave the tower untouched.
- Preserve all existing inventory ownership.

Disconnect should return an uncommitted held piece safely to inventory.

#### 11.3 Linked moving supports

The described mechanic is not simply a tilting plank. One support rises as another falls.

A practical implementation uses a shared mechanical degree of freedom:

- Both support heights derive from one mechanism state.
- Loading one side drives movement.
- The other side responds in the opposite direction.
- Travel limits prevent unlimited displacement.
- Damping prevents endless oscillation.

Possible implementation approaches:

1. A constrained linkage using physical joints.
2. A custom coupled mechanism that computes equal-and-opposite support motion.

For the custom approach, move supports through the physics system, not arbitrary transform teleports. Otherwise the blocks may receive unstable or incorrect contact motion.

Test:

- Equal loading.
- Unequal loading.
- Off-center loading.
- A long piece bridging both supports.
- A support reaching its travel stop.
- Sudden removal of a fragile piece.

#### 11.4 Enhanced presentation profile

Add a separate enhanced profile with:

- Higher-resolution environment assets.
- Improved reflection quality.
- More detailed water shading.
- Better dynamic shadowing.
- Optional light-shaft treatment where appropriate.
- Improved anti-aliasing.

Do not use this profile as a reason to redesign the original’s composition or puzzle dimensions.

### 12. Endurance mode implementation

**Documented Wii U rules:** A sequence of puzzles, three lives across the session, and scoring influenced by speed, remaining lives, and puzzle difficulty.

**Also documented:** Endurance exists on PS4 and Switch.

#### 12.1 Session model

Maintain:

- Current puzzle.
- Remaining lives.
- Cumulative score.
- Completed-puzzle count.
- Difficulty progression.
- Puzzle selection state.
- Session seed.
- Rules/content revision.

On success:

1. Finalize the puzzle result.
2. Calculate the score contribution.
3. Advance to the next puzzle.
4. Preserve session lives and score.

On failure:

1. Deduct one life exactly once.
2. Apply the selected retry-or-advance rule.
3. End the run when lives are exhausted.

The consulted sources do not establish the exact retry-versus-advance behavior. Keep it configurable until verified.

#### 12.2 Scoring

Do not claim an invented formula is the original formula.

For an initial implementation, combine:

- A base value assigned to puzzle difficulty.
- A completion-speed bonus.
- A remaining-life modifier.

Make the formula and coefficients data-driven.

Ensure:

- Restarting cannot farm score.
- A failure cannot deduct multiple lives.
- Pause behavior is consistent.
- Repeated trivial puzzles cannot dominate records.
- Rules changes create a new leaderboard category or revision.

#### 12.3 Puzzle sequencing

Start with curated pools rather than purely random selection.

Pools should prevent:

- A difficult special mechanic appearing before introduction.
- Repeated near-identical puzzles.
- Abrupt difficulty spikes.
- Excessive runs of the same platform type.

Randomness should select within a designed difficulty structure.

### 13. Tower Tumble implementation

**Documented behavior:** Players take turns placing pieces. The player responsible for toppling the tower loses; the others receive points. The Wii U review describes randomized pieces, and the Switch press kit confirms a version for up to four players.

#### 13.1 Core loop

1. Select the active player.
2. Offer or assign a piece.
3. Allow placement.
4. Observe the tower for the required handoff interval.
5. Resolve failure or pass the turn.
6. Repeat until collapse.
7. Award round points.
8. Start a new round.

#### 13.2 Failure attribution

This is the most important implementation detail.

Track:

- Active player.
- Last committed placement owner.
- Whether the turn has formally transferred.
- Pending failure events.
- Turn-resolution timing.

A tower may collapse after the piece has been released but before the next player has meaningfully acted.

**Proposed policy:** Keep responsibility with the placing player until the post-placement resolution interval finishes successfully. Then transfer the turn.

The exact handoff timing requires reference testing.

Do not assign blame simply to whoever happens to be holding the controller when a water event arrives.

#### 13.3 Piece generation

Use a seeded shape generator with controlled distributions.

Avoid accidental runs that are:

- Trivially easy.
- Unplayable regardless of skill.
- Dominated by one awkward piece.
- Incompatible with the current rules profile.

Expose the seed for reproducible testing.

#### 13.4 Multiplayer presentation

Clearly display:

- Current player.
- Next player.
- Round score.
- Available piece.
- Whether the turn is being resolved.

Inactive players should not be able to alter the tower through leftover preview objects.

### 14. Swift Stacker and original Versus implementation

The original has a two-player race to solve puzzles. The later Swift Stacker mode extends this competitive structure; the Wii U review describes teams and unlimited retries within a round.

#### 14.1 Independent arenas

Each competitor or team receives:

- The same puzzle.
- The same starting inventory.
- The same physics configuration.
- Its own simulation.
- Its own completion and failure state.

Never place both towers into one shared collision space and rely only on distance to avoid interference.

Use isolated arena simulation ownership, with separate cameras and UI viewports.

#### 14.2 Round rules

1. Load matching puzzle revisions.
2. Confirm both sides are ready.
3. Start from one authoritative start event.
4. Allow independent retries.
5. Declare the first valid completion the winner.
6. Apply an explicit tie policy.
7. Advance the match score.

For original-style matches, the contemporary review describes configurable match lengths of five, seven, or nine rounds. Verify whether these are total scheduled rounds or a particular victory structure before reproducing the exact menu wording.

#### 14.3 Team play

Team members share:

- One tower.
- One inventory.
- One objective.

Reuse cooperative reservation and placement logic within each team.

A failed attempt resets only that team’s arena, not the opposing team’s progress.

#### 14.4 Split-screen camera

Each viewport must show the same playable region in world units.

Do not accidentally make one side easier by:

- Showing more vertical space.
- Using a larger pointer-to-world movement ratio.
- Providing a different shape preview scale.
- Cropping a required height target.

### 15. PlayStation 4 deep dive

#### 15.1 Established feature scope

The PlayStation Store confirms:

- 200 puzzles.
- Drop-in cooperative play.
- Split-screen competition.
- Online multiplayer.
- Endurance.
- Online high scores.
- One to four local players.
- Up to two online players.
- Controller vibration.

The consulted publisher page also mentions touch controls, but that wording alone is not sufficient to specify the exact touchpad interaction.

Sources: [PlayStation Store listing](https://store.playstation.com/en-us/product/UP4496-CUSA01465_00-ARTOFBALANCE0000) and [publisher’s PS4 page](http://artofbalance.shinen.com/ps4).

#### 15.2 Controller-first adaptation

Implement a virtual cursor with:

- Adjustable acceleration.
- A low-speed precision range.
- A clear dead zone.
- Configurable sensitivity.
- Separate rotation controls.
- A deliberate placement button.
- Easy restart access.

Avoid smoothing so aggressive that the cursor continues moving after the player stops the stick.

Tune cursor speed in relation to the visible playfield, not raw screen pixels alone.

#### 15.3 Touchpad support

Treat touchpad input as an optional adapter.

Prototype:

- Relative cursor movement.
- Absolute playfield mapping.

Use reference capture and usability tests to determine the intended behavior.

Do not force touchpad controls as the only precise input method.

#### 15.4 Haptics

Recommended feedback:

- Small pulse on committed placement.
- Stronger pulse for substantial impact.
- Distinct brief failure cue.
- Optional break cue.

Do not emit vibration continuously while a tower is settling.

#### 15.5 Port-specific implementation boundary

The consulted PS4 material does not fully establish every named mode or its exact rules.

Build shared mode modules so they can be enabled through a PS4-style profile after verification. Do not invent a PS4-exclusive mechanic to make the port section appear more extensive.

### 16. Nintendo Switch deep dive

#### 16.1 Confirmed scope

The publisher press kit explicitly lists:

- Arcade.
- Tower Tumble.
- Swift Stacker.
- Endurance.
- Infinity.

It also confirms:

- 200 puzzles across eight worlds.
- Up to four local cooperative players.
- Touchscreen and controller input.
- TV, tabletop, and handheld play styles.

The publisher page states that motion controls were added in patch 1.1.

Sources: [Switch press kit](http://shinen.com/press/sheet.php?p=art_of_balance%28Switch%29), [publisher page](http://artofbalance.shinen.com/switch/), and [Nintendo listing](https://www.nintendo.com/en-gb/Games/Nintendo-Switch-download-software/Art-of-Balance-1452211.html).

#### 16.2 Touch input

A direct touch implementation needs:

- Large enough shape-selection targets.
- A visible placement preview.
- An optional finger offset.
- Dedicated rotation controls.
- A clear distinction between selecting and releasing.
- Protection against accidental placement during UI interaction.

Switching from touch to controller must not release the current piece unexpectedly.

#### 16.3 Motion input

Implement motion pointing through an input adapter, not inside placement logic.

Include:

- Recenter action.
- Adjustable sensitivity.
- Drift handling.
- Optional smoothing.
- Clear controller ownership.

Do not assume a motion sensor reproduces Wii Remote infrared pointing automatically. The source of pointer position differs, even if the game-facing result is similar.

#### 16.4 Layout adaptation

Use separate layout presets for:

- Full-screen television play.
- Small-screen single-player.
- Small-screen split-screen.
- Multiple local cursors.

Preserve gameplay geometry while adapting UI scale and safe areas.

### 17. Infinity mode implementation

**Publisher-confirmed concept:** The blocks continue indefinitely and the player builds the highest possible stack.

The consulted material does not establish every scoring, failure, or camera rule.

#### 17.1 Core implementation

Replace finite puzzle inventory with a generated shape stream.

Maintain:

- Shape sequence seed.
- Current tower state.
- Height record.
- Current and upcoming piece availability.
- Difficulty progression.
- Run score.
- Session rules revision.

#### 17.2 Height scoring

Do not score the height of:

- Held previews.
- Pieces launched briefly into the air.
- Cosmetic debris.

A robust proposed policy is to register height from released pieces that have valid support and maintain the height for a short confirmation interval.

That interval is a design proposal, not an established original rule.

Keep the measurement relative to the platform or another fixed arena reference, not the camera.

#### 17.3 Camera behavior

As the tower grows:

- Expand or raise the visible play area gradually.
- Preserve pointer-to-world accuracy.
- Avoid camera motion during an exact placement if possible.
- Keep enough context to understand tower lean.
- Provide an unobtrusive indication of the lower support region.

Prototype controlled zoom and upward tracking separately. Excessive zoom makes precision placement unreadable.

#### 17.4 Long-run performance

Pool:

- Shape visuals.
- Effects.
- Audio sources.
- UI elements.

Do not delete lower structural pieces simply because they are offscreen. Their mass and contacts still affect the tower.

If very long runs require simplification, treat that as a distinct engineering problem and validate that the resulting tower behaves equivalently. Do not silently replace the lower stack with a rigid column.

### 18. Gravity-changing shapes

**Confirmed:** Switch publisher material describes shapes that reverse gravity and turn the stack upside down.

**Not established here:** Exact trigger, duration, affected objects, camera behavior, or support transformation.

#### 18.1 Build the capability without inventing the final rule

Give each arena its own gravity definition rather than changing a global value shared by every arena.

A gravity-change event should specify:

- Which arena it affects.
- Triggering piece.
- New gravity direction.
- Whether the change is instantaneous or animated.
- Affected body categories.
- Whether it is one-shot or repeatable.
- Presentation response.

#### 18.2 Coordinate-dependent systems

Every gravity-sensitive subsystem must use the arena’s current gravity direction:

- Support detection.
- Fragile-load interpretation.
- Timed-block “piece on top” detection.
- Height measurement where applicable.
- Placement guides.
- Moving-support behavior.
- Out-of-bounds rules.

Do not assume “up” always means increasing screen height.

#### 18.3 Physics and visual rotation are different

Possible behaviors include:

- Gravity reverses while the camera remains fixed.
- The presentation rotates.
- The arena or supports rotate.
- Some combination of these occurs.

These are not equivalent.

Do not both rotate every body and reverse gravity unless reference evidence requires it; that can produce a double transformation with the wrong outcome.

#### 18.4 Safe prototype

Build a dedicated test arena with appropriate receiving supports and explicit hazard regions.

Test:

- A sleeping tower.
- A moving tower.
- A held preview.
- A timed block already counting down.
- A fragile bridge.
- A second gravity-changing piece.
- Two simultaneous competitive arenas.

The test supports are development fixtures, not a claim about the original level designs.

### 19. Online play and leaderboard architecture

#### 19.1 Use authoritative simulation

Do not assume floating-point physics will remain identical on different machines simply because they receive the same input.

Recommended model:

- One authoritative host or server simulates gameplay.
- Clients submit selection and placement commands.
- The authority validates ownership and placement.
- Clients receive confirmed events and state updates.
- Client presentation interpolates received motion.

Local preview movement can be immediate without making the local client authoritative over the tower.

#### 19.2 Command validation

Validate:

- Player identity.
- Current session and round.
- Shape reservation.
- Inventory availability.
- Position limits.
- Allowed rotation.
- Placement overlap.
- Turn ownership.
- Command order.
- Whether the arena has already ended.

#### 19.3 State replication

Replicate:

- Body position and rotation.
- Linear and angular motion.
- Spawn and removal events.
- Fragile and timed-block states.
- Platform mechanism state.
- Arena gravity state.
- Inventory ownership.
- Countdown and mode phase.
- Scores and lives.

A seed reproduces piece selection, not necessarily exact physical outcomes.

#### 19.4 Race fairness

Use authoritative simulation time to determine finish order.

Define:

- Simultaneous completion policy.
- Disconnect policy.
- Retry behavior.
- Whether an opponent can continue after a disconnect.
- Whether ranked sessions can pause.

Do not compare untrusted client wall clocks.

#### 19.5 Leaderboards

Include these categories in every submitted record:

- Mode.
- Rules revision.
- Physics revision.
- Content revision.
- Player count.
- Score.
- Relevant seed or puzzle identifier.

A locally generated score is not automatically trustworthy. Competitive validation may require server-owned sessions or an auditable command history.

### 20. Puzzle authoring and progression

#### 20.1 Build an editor early

The authoring workflow should support:

- Selecting an environment.
- Positioning supports.
- Choosing shape inventory.
- Reordering pieces.
- Configuring availability.
- Assigning special behaviors.
- Setting challenge goals.
- Entering play mode from the current puzzle.
- Recording reference solutions.
- Inspecting collision and support data.

Avoid creating every puzzle as a manually maintained scene.

#### 20.2 Validation rules

Automatically flag:

- Missing assets.
- Invalid polygon geometry.
- Duplicate puzzle identifiers.
- Unreachable prerequisite chains.
- Missing time limits for timed challenges.
- Height targets outside the usable camera region.
- Spawned pieces initially intersecting hazards.
- Unsupported behavior combinations.
- Empty inventories where the mode requires pieces.

#### 20.3 Difficulty progression

A proposed teaching order:

1. Wide flat supports.
2. Basic rotation.
3. Narrow supports.
4. Rounded pieces.
5. Asymmetric shapes.
6. Overhangs and bridges.
7. Fragile shapes.
8. Timed shapes.
9. Height and time challenges.
10. Moving supports.
11. Combined mechanics.
12. Expanded gravity mechanics.

This is a recommended curriculum, not a reconstruction of the original puzzle order.

#### 20.4 Solution testing

For each authored puzzle, retain:

- At least one reproducible solution attempt.
- Expected difficulty.
- Known alternate solutions.
- Typical failure patterns.
- Camera and UI checks.
- Relevant physics revision.

A scripted placement sequence is useful for regression testing but should not be treated as a guarantee of cross-platform deterministic replay.

### 21. Persistence, restart, and recovery

#### 21.1 Save persistent progress

Store:

- Completed puzzles.
- Unlock state.
- Best challenge results.
- Mode records.
- Input settings.
- Audio and visual settings.
- Accessibility preferences.
- Save-format revision.

Use stable content identifiers rather than array positions.

#### 21.2 Restart correctly

A retry must restore:

- Original platform state.
- Original inventory.
- Gravity state.
- All behavior timers.
- Player reservations.
- Countdown state.
- Pending events.
- Temporary effects.
- Mode-specific attempt state.

Do not reload the entire environment for every failure if only the puzzle state needs resetting.

#### 21.3 Avoid fake physics snapshots

Restoring body transforms and velocities alone may not reproduce internal contact and solver state perfectly.

For ordinary campaign retry, reconstruct the initial arena cleanly.

For practice-mode undo or mid-run restoration, document the approximation and test it carefully.

### 22. Testing and acceptance criteria

#### 22.1 Gameplay tests

- A shape cannot be selected twice.
- Invalid placement does not consume inventory.
- A released piece cannot be grabbed in the fidelity profile.
- One hazard contact produces one failure.
- Cosmetic fragments do not fail the level.
- Countdown expiration cannot overwrite an earlier failure.
- Retry restores all state.
- Timed blocks activate under the intended condition.
- Fragile blocks do not count duplicate collider contacts as extra pieces.
- Gravity changes affect only the intended arena.
- Split-screen puzzles do not interact physically.

#### 22.2 Physics regression tests

Run calibration scenes after changing:

- Shape outlines.
- Mass policy.
- Friction.
- Solver configuration.
- Simulation rate.
- Gravity.
- Platform constraints.
- Physics engine version.

Compare outcomes using tolerances and behavioral expectations, not only exact floating-point equality.

#### 22.3 Visual acceptance tests

Compare equivalent camera compositions.

Check:

- Tower scale.
- Waterline position.
- Platform silhouette.
- Shape thickness.
- Outline readability.
- Shadow softness.
- Reflection strength.
- Background contrast.
- UI obstruction.
- Special-piece readability.

Do not approve a visual match based solely on a attractive standalone screenshot.

#### 22.4 Performance targets

Proposed targets:

- Stable 60-frame-per-second presentation on the chosen baseline hardware.
- No noticeable hitch when selecting or releasing a piece.
- No unbounded allocations during ordinary placement.
- Fast local retry.
- Bounded effect and audio counts.
- Acceptable performance with the maximum supported local player count.

Measure CPU simulation and GPU rendering separately.

#### 22.5 User testing questions

Ask players:

- Could you predict where the piece would land?
- Did the release position match the preview?
- Did a failure feel physically understandable?
- Were special pieces readable?
- Was restarting immediate enough?
- Did the tower remain visible during precise placement?
- Did controller input feel as precise as the game demanded?

The most valuable feedback concerns **trust in the simulation**.

### 23. Implementation milestones

| Milestone | Work | Exit criterion |
|---|---|---|
| 1. Reference specification | Resolve high-risk behavioral questions; establish visual reference set | Core rules recorded with confidence levels |
| 2. Graybox prototype | One support, basic pieces, pointer, rotation, release, water failure, countdown, retry | Complete playable loop |
| 3. Physics calibration | Collider pipeline, friction/mass tests, preview policy, release validation | Representative stacks behave consistently |
| 4. Visual vertical slice | Bowl, water, one room, final-quality shapes, shadows, UI, audio | One scene meets the visual target |
| 5. Original mechanics | Fragile, timed, height, time, unstable supports | Each mechanic works in isolation and combination |
| 6. Authoring tools | Puzzle assets, validation, progression, solution recording | New puzzles can be authored without code changes |
| 7. Original multiplayer | Two-player co-op and split-screen versus | No ownership conflicts or arena interference |
| 8. Campaign production | Build and test the intended original-scale content | Every puzzle has validated completion paths |
| 9. Expanded local modes | Endurance, Tower Tumble, Swift Stacker, Infinity | Mode-specific scoring and transitions tested |
| 10. Expanded mechanics | Linked supports, gravity changes, larger local sessions | Cross-mechanic regression tests pass |
| 11. Online systems | Authority, replication, race timing, leaderboards | Validated multi-client matches |
| 12. Polish and release preparation | Performance, accessibility, recovery, device testing | Acceptance criteria met on target builds |

Do not begin large-scale puzzle production before physics calibration is sufficiently stable. Small physics changes can invalidate a large amount of authored content.

### 24. Recommended first vertical slice

Build **12 original prototype puzzles**, explicitly treated as development content rather than reproductions of named original levels:

- Three introductory flat-support puzzles.
- Two narrow-support puzzles.
- Two rounded-piece puzzles.
- One bridge puzzle.
- One fragile-piece puzzle.
- One timed-piece puzzle.
- One height challenge.
- One moving-support challenge.

Include:

- One finished environment.
- A finished bowl and water surface.
- Representative final-quality shape meshes.
- Mouse and controller input.
- Three-indicator completion countdown.
- Failure, splash, retry, and success feedback.
- Basic progress saving.
- A two-player cooperative test.

**Do not include online play in this milestone.**

This slice should answer the most consequential question: **Does placing and balancing a small set of shapes already feel satisfying and trustworthy?**

### 25. Principal risks and mitigations

| Risk | Consequence | Mitigation |
|---|---|---|
| Wrong held-piece behavior | Fundamental mismatch in puzzle solving | Prototype and compare both interaction policies early |
| Inaccurate collider outlines | Unexpected slipping, snagging, or floating | Shared geometry pipeline and debug overlays |
| Excessive damping or sleeping | Towers appear artificially stable | Calibration scenes and marginal-balance tests |
| Incorrect fragile-load rule | Different valid solutions | Separate count-based and load-based candidates |
| Timer assumptions | Special puzzles become too easy or impossible | Parameterize activation and countdown rules |
| Late physics changes | Campaign solutions break | Freeze and version physics before content expansion |
| Overcomplicated water | Performance cost without gameplay benefit | Start with restrained rendering; scale quality independently |
| Multiplayer ownership races | Duplicate pieces or unfair placements | Atomic reservation and release validation |
| Assumed deterministic networking | Divergent towers | Authoritative simulation |
| Unverified port equivalence | Incorrect feature claims | Maintain platform-specific evidence and profiles |
| Infinity optimization shortcuts | Tower loses physical credibility | Preserve structural bodies; validate any simplification |

### 26. Definition of done

The original-style recreation is ready when:

- Selection, rotation, placement, collapse, countdown, and retry form a complete loop.
- The preview accurately communicates release position.
- Shapes behave consistently enough for players to reason about them.
- Collision boundaries visually match the pieces.
- Water failure is predictable.
- Fragile and timed mechanics match the selected fidelity specification.
- Standard and special challenges are authored and tested.
- The presentation captures the original’s quiet, tactile composition.
- Two-player modes function without shared-state errors.
- All puzzles and saves use stable identifiers.
- Physics and content revisions are recorded.

Expanded-port parity additionally requires:

- Verified mode rules.
- Correct player limits per selected profile.
- Validated linked-support behavior.
- Verified gravity-change behavior.
- Infinity height and camera rules.
- Reliable online race resolution.
- Leaderboards separated by compatible rules and physics revisions.

### 27. Research gaps that remain

The plan is actionable, but it is not a claim of complete reverse engineering.

Before declaring exact fidelity, verify:

- Unity 6.6 package and deployment compatibility.
- Complete original shape geometry.
- Original selection-window and inventory-reveal behavior.
- Exact rotation interaction.
- Held-piece collision behavior.
- Countdown activation and later-port duration.
- Fragile-load calculation.
- Timed-block reset or pause behavior.
- Exact original challenge scoring.
- Detailed campaign unlock structure.
- Full PS4 mode roster and touchpad behavior.
- Gravity-reversal triggers and scene transformations.
- Infinity scoring and failure details.
- Exact online team and participant arrangements for each release.

**Recommended implementation order:** get the placement feel and physics right, lock the visual composition, build the puzzle tools, produce the original-style campaign, then add the expanded modes and online systems.

### 28. Sources

**Original WiiWare**

- [Nintendo — Art of Balance, WiiWare](https://www.nintendo.com/en-gb/Games/WiiWare/Art-of-Balance-284413.html)
- [Shin’en — Original WiiWare page](https://art-of-balance.shinen.com/wii/)
- [Nintendo Life — WiiWare review](https://www.nintendolife.com/reviews/2010/02/art_of_balance)
- [Wii’s World — Feature listing](https://www.wiisworld.com/wiiware-games/Art-of-Balance.html)
- [WiiWare gameplay reference](https://www.youtube.com/watch?v=pKFl3PmNtTg)

**Wii U**

- [Nintendo Life — Wii U review](https://www.nintendolife.com/reviews/wiiu-eshop/art_of_balance)

**PlayStation 4**

- [PlayStation Store — Art of Balance](https://store.playstation.com/en-us/product/UP4496-CUSA01465_00-ARTOFBALANCE0000)
- [Shin’en — PS4 page](http://artofbalance.shinen.com/ps4)

**Nintendo Switch**

- [Nintendo — US product listing](https://www.nintendo.com/us/store/products/art-of-balance-switch/)
- [Nintendo — UK product listing and input features](https://www.nintendo.com/en-gb/Games/Nintendo-Switch-download-software/Art-of-Balance-1452211.html)
- [Shin’en — Switch page and motion-control update](http://artofbalance.shinen.com/switch/)
- [Shin’en — Switch press kit and mode descriptions](http://shinen.com/press/sheet.php?p=art_of_balance%28Switch%29)
- [Switch Player — Review](https://switchplayer.net/2018/10/26/art-of-balance-review/)

This response reached its per-turn effort limit. Would you like me to continue?
