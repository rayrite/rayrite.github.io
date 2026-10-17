# NES 8-Bit Homebrew Research: Intermediate Workstream Evidence Notes

**Date:** 2026-10-12  
**Researcher:** Lead Deep-and-Wide Retrocomputing Research Agent (Antigravity AI)  
**Status:** Verification & Extraction Notes for WS-01 through WS-13  

---

## 1. WS-01: Architecture & Hardware Constraints

### CPU (Ricoh 2A03 / 2A07)
- Core: MOS Technology 6502 core with decimal mode (BCD) physically disabled (CLD/SED instructions execute, but ADC/SBC operate in binary mode).
- Clock speed: 
  - NTSC (2A03): 1.789773 MHz (~1.79 MHz), master clock 21.477272 MHz divided by 12.
  - PAL (2A07): 1.662607 MHz (~1.66 MHz), master clock 26.601712 MHz divided by 16.
  - Dendy (2A03 clone on PAL timing): 1.773448 MHz, master clock divided by 15.
- Address Space: 16-bit (64 KB, $0000–$FFFF).
  - $0000–$07FF: 2 KB internal work RAM (mirrored up to $1FFF).
  - $0000–$00FF: Zero page (fast 1-byte direct addressing, 1 cycle faster).
  - $0100–$01FF: Hardware stack (descending stack pointer S).
  - $2000–$2007: PPU memory-mapped I/O registers (mirrored every 8 bytes through $3FFF).
  - $4000–$4017: APU and I/O registers ($4014 is OAM DMA, $4016/$4017 are controller ports).
  - $4018–$401F: APU and I/O test mode registers (normally disabled).
  - $4020–$5FFF: Cartridge expansion space / mapper registers.
  - $6000–$7FFF: Cartridge PRG-RAM / WRAM / Battery-backed SRAM (8 KB).
  - $8000–$FFFF: Cartridge PRG-ROM (32 KB accessible directly; mappers bankswitch here).
- Interrupt Vectors:
  - $FFFA–$FFFB: NMI (Non-Maskable Interrupt, triggered every vblank if PPUCTRL bit 7 is set).
  - $FFFC–$FFFD: RESET vector.
  - $FFFE–$FFFF: IRQ/BRK vector.

### PPU (Ricoh 2C02 / 2C07)
- Resolution: 256 × 240 pixels (NTSC overscan typically cuts top/bottom 8 pixels, leaving 256 × 224 visible on CRTs).
- Color Palette: 64 hardware palette entries (54-56 unique visible colors, including grayscale and chromatic hues; black mirrored across rows).
- Active Palettes:
  - 8 palettes total: 4 background palettes, 4 sprite palettes.
  - Each palette has 4 entries: 1 shared universal backdrop color + 3 unique colors per palette.
  - Total simultaneous visible colors on screen = 1 (backdrop) + 4×3 (BG) + 4×3 (Sprite) = 25 colors.
- Pattern Tables:
  - Two 4 KB pattern tables ($0000–$0FFF and $1000–$1FFF), totaling 512 8×8 tiles.
  - Tiles stored in 2bpp planar format (16 bytes per 8×8 tile: 8 bytes for bitplane 0, 8 bytes for bitplane 1).
- Nametables:
  - 32 × 30 tile matrix (960 bytes) + 64 bytes Attribute Table = 1024 bytes per nametable.
  - Internal VRAM is 2 KB, providing space for 2 physical nametables.
  - Mirroring modes: Horizontal (vertical scrolling games), Vertical (horizontal scrolling games), Single-screen, and 4-screen (requires extra 2 KB VRAM on cartridge).
  - Attribute Table: 64 bytes at end of nametable. Divides screen into 32×32 pixel blocks (each subdivided into four 16×16 pixel quadrants), specifying which of the 4 background palettes is applied to each 16×16 tile group.
- Sprites (OAM - Object Attribute Memory):
  - 256 bytes internal OAM = 64 sprites maximum.
  - Each sprite: 4 bytes (Byte 0: Y position, Byte 1: Tile index, Byte 2: Attributes [flip X, flip Y, priority, palette 0-3], Byte 3: X position).
  - Sprite sizes: 8×8 or 8×16 (selected via PPUCTRL bit 5).
  - Hardware Scanline Limit: Maximum 8 sprites evaluated per horizontal scanline. If >8 sprites share a scanline, sprite overflow flag ($2002 bit 5) is raised and subsequent sprites are dropped, causing flicker.
  - Sprite 0 Hit: When a non-transparent pixel of sprite 0 collides with a non-transparent pixel of background, PPUSTATUS bit 6 is set. Used for cycle-exact split-screen raster timing (e.g. static HUD).
  - OAM DMA ($4014): Transfers 256 bytes from CPU RAM to PPU OAM in 513 or 514 CPU cycles during vblank.
- Vblank Timing Budget:
  - NTSC: Vblank lasts 20 scanlines (scanlines 241 to 260) = 2273 CPU machine cycles.
  - Subtracting OAM DMA (513/514 cycles) leaves ~1760 CPU cycles for all VRAM updates (nametable writes, palette updates, attribute updates) before rendering re-enables.
  - PAL: Vblank lasts 70 scanlines = ~7450 CPU cycles (much more generous, but runs at 50 Hz).

### APU (Audio Processing Unit)
- Channels:
  1. Pulse 1 (Square wave): 4 duty cycles (12.5%, 25%, 50%, 75%), volume/envelope, sweep unit.
  2. Pulse 2 (Square wave): Same as Pulse 1, but sweep unit complements differently.
  3. Triangle: 32-step pseudo-triangle wave, linear counter, length counter. No volume register (volume controlled via pitch/linear counter or software).
  4. Noise: 16 frequencies, pseudo-random bit shift generator (15-bit or 6-bit periodic "metallic" mode), volume/envelope.
  5. DMC (Delta Modulation Channel): Plays 1-bit delta-encoded samples (DPCM) or raw 7-bit PCM. Frequency range 4.18 kHz to 33.14 kHz (NTSC). Reads samples via CPU DMA stall (causes 4-cycle CPU stall, notorious for corrupting joypad reads if not double-read).
- Frame Counter ($4017): Drives envelopes, sweeps, and length counters at 4-step (240 Hz) or 5-step (192 Hz) sequences.

### Common Mappers
- Mapper 0 (NROM): 16 KB or 32 KB PRG-ROM, 8 KB CHR-ROM. No banking.
- Mapper 1 (MMC1): Up to 256 KB PRG-ROM, 128 KB CHR-ROM/RAM, configurable mirroring via serial register.
- Mapper 2 (UNROM): Up to 256 KB PRG-ROM, 8 KB CHR-RAM. PRG banking with bus conflict avoidance.
- Mapper 3 (CNROM): 32 KB PRG-ROM, up to 32 KB CHR-ROM banking.
- Mapper 4 (MMC3): Scanline IRQ counter, up to 512 KB PRG-ROM, 256 KB CHR-ROM, 8 KB WRAM. Industry standard for late-generation titles.
- Mapper 30 (UNROM-512): Modern homebrew standard (NESmaker baseline), 512 KB flash PRG, 32 KB CHR-RAM, single-screen/vertical/horizontal mirroring, self-flashing capability.

---

## 2. WS-02: Toolchains, SDKs, and Compilers

### Assemblers
- **ca65 (part of cc65 suite):** Macro assembler with full relocation linker (`ld65`), modular memory configuration files (`.cfg`), robust scoping, Mesen debug symbol export (`.dbg`). De facto gold standard for professional development.
- **asm6 / asm6f:** Single-pass absolute assembler. `asm6f` fork by freem (latest `v1.6_f03`, Jan 2025) adds Mesen label generation, Famistudio support, and modern macro capabilities. Fast, beginner-friendly, and used as the compilation backend for NESmaker.
- **NESASM (v3.1):** Historic assembler popular in early tutorials (Nerdy Nights). Strict 8 KB banking requirements (`.bank`), non-standard bracket syntax for indirect addressing (`[$00]` vs `($00)`). Largely considered legacy today.

### C Compilers
- **cc65 (v2.19 stable):** ISO C compiler with 6502 code generator. Does not produce cycle-exact code; generates software stack calls for local variables. Highly effective when paired with Shiru's `neslib` or Doug Fraker's updated frameworks, writing critical inner loops and NMI updates in assembly.

### Sound Engines
- **FamiStudio Sound Engine:** Official C and 6502 assembly drivers for FamiStudio (v4.5.3, Aug 2026). Supports SFX, multi-banking, DPCM, and expansion audio.
- **FamiTone2 / FamiTone5:** Lightweight, highly optimized engine by Shiru and modified by Nesdev community. Very low CPU and RAM footprint.
- **GGSound:** Written by Gradual Games (Derek Andrews). Supports NTSC/PAL speed compensation, priority-based sound effects, clean ca65 integration.
- **Pently:** Music engine by Damian Yerrick (tepples). Uses score-based bytecodes instead of tracker pattern tables, saving substantial ROM space.

---

## 3. WS-03: Development Environments per OS

### Windows 11 Native
- Package management via `winget` or Scoop.
- Toolchains: cc65 (ca65/ld65), asm6f, Make (via MSYS2 or Git for Windows).
- IDE: Visual Studio Code + extensions (`Retro Assembler`, `ca65 Macro Assembler`, or `NES Hacker`).
- Emulators: Mesen 2 (MesenCE), FCEUX, puNES.

### Windows 11 + WSL2
- Ubuntu 22.04/24.04 LTS under WSL2. Native Linux build tools (`build-essential`, `cc65` package).
- GUI integration via WSLg for running Linux builds of Mesen or piping `.nes` output to native Windows Mesen.

### macOS (Apple Silicon arm64 & Intel)
- Homebrew package manager (`brew install cc65`).
- Native SDL2 builds of Mesen 2, FCEUX, or puNES.
- Wine / CrossOver support for legacy Windows-only tools (like NEXXT or NES Screen Tool).

### Linux (Debian/Ubuntu, Fedora, Arch)
- Native packages: `apt install cc65` (Debian/Ubuntu), Arch AUR (`cc65-git`, `asm6f-git`, `mesen-git`).
- Dockerized build containers for automated reproducible CI pipelines.

---

## 4. WS-05 & WS-06: Asset Pipelines

### Graphics Tools
- **NEXXT (by FrankenGraphics, itch.io):** Modern successor to Shiru's NES Screen Tool (NESST). Full CHR bank management, nametable and attribute editing, metasprite builder, palette controls.
- **Aseprite / Pyxel Edit / GIMP:** Modern pixel art editors exporting indexed PNGs (4-color indexed).
- **`nexxtporter` / `png2nes` / `bmp2chr`:** CLI tools to convert modern indexed bitmaps into raw 2bpp planar CHR-ROM binaries.

### Audio Tools
- **FamiStudio (BleuBleu, v4.5.3, Aug 2026):** Modern DAW-style NES music editor. Cross-platform, intuitive UI, exports directly to ASM drivers, NSF, and WAV.
- **FamiTracker / 0CC-FamiTracker / Dn-FamiTracker:** Traditional vertical pattern tracker. Pure APU fidelity, export to NSF, text, or driver data.

---

## 5. WS-08: Productivity & Non-Game Software
- Historical systems: Family BASIC (1984), Famicom Data Recorder, Famicom Network System (banking, stock terminals), Miracle Piano Teaching System, Subor Educational computers.
- Modern implementations: Artemio Urbina's *240p Test Suite*, ChipNES / MIDI-NES live synthesizer ROMs, text readers, interactive diagnostic utilities.
- Playbook: 32×30 text resolution (up to 42×30 with 6-pixel proportional fonts using CHR-RAM), Joypad virtual keyboard vs. Famicom expansion keyboard, persistent storage via battery-backed WRAM ($6000–$7FFF) or flash-cart file systems.

---

## 6. WS-09 & WS-11: ROM Distribution & Legal Landscape
- ROM Formats: iNES 1.0 (legacy 16-byte header), NES 2.0 (modern standard with submappers, PRG/CHR-RAM nibbles, timing specification), UNIF (deprecated).
- Digital Storefronts: itch.io (DRM-free .nes files), Steam (requires bundled emulator wrapper such as custom libretro core or Mesen frontend), GOG.
- Physical Publishing: Broke Studio / Homebrew Factory, Mega Cat Studios, Limited Run Games, Retro Room Games.
- Self-Publishing Hardware: Muramasa Entertainment, Infinite NES Lives, Retro Stage (dumper/programmer).
- Legal: Emulator legality established under *Sony v. Bleem* and *Sony v. Connectix*. Original homebrew code and art is 100% legal; trademark infringement must be avoided (do not use "Nintendo", "NES", or official trademarked logos).

---

## 7. WS-10: Featured Tools Profiles
- **3dSen (Geod Studio):** 3D voxel retro emulator ($14.99 on Steam PC, $19.99 on Steam VR). Procedurally projects 2D NES graphics into 3D dioramas using custom profile metadata.
- **3dSen Maker (itch.io):** Free / "Name Your Own Price" tool on itch.io by Geod Studio. Allows users and developers to create 3D voxel profiles for any NES ROM by separating pattern tables, sprites, and background layers into 3D z-depth planes.
- **NESmaker (The New 8-bit Heroes):** Visual NES IDE and engine ($36 license key, v4.5.9). Built on Mapper 30 (UNROM-512) and ASM6. Features module architecture (Platformer, Adventure, Shooter, RPG), drag-and-drop screen painting, and custom ASM scripting.
