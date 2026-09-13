# AI Coding Agent Tool Data Dictionary

**Machine:** Windows 11 Pro (10.0.26200, x64) · **User:** Cooly
**Compiled:** 2026-09-12 · **Updated:** 2026-09-13 (coding-agent Tier 1 batch installed — see §10; drift audit folded into §1/§2) · **Audience:** AI coding agents (Claude Code, etc.) and their operator
**Scope legend:** 🖥 Machine = all users, system-wide · 👤 User = current user only

Everything below was installed/verified on this machine. All commands resolve on a fresh terminal's PATH (Machine + User).

---

## 1. Package Managers & Language Runtimes

| Command | Version | Purpose | Capabilities agents can use | Location | Scope |
|---|---|---|---|---|---|
| `choco` | 2.7.4 | Windows package manager (Chocolatey) | install/upgrade/uninstall machine-wide software; `choco search`, `choco list`, `choco outdated` for inventory | `C:\ProgramData\chocolatey\bin` | 🖥 |
| `winget` | built-in | Windows package manager (App Installer) | install software; **always pass `--source winget --scope machine`** for machine-wide, else it may silently pick per-user Store packages | `WindowsApps` | 🖥 |
| `python` / `py` | 3.14.7 | CPython interpreter (per-user python.org build) | run scripts; `python -m pip` (never bare `pip`); aliases are functional, not Store stubs | `...\Local\Python\pythoncore-3.14-64\python.exe` | 👤 |
| `pip` (via `python -m pip`) | 26.2.1 | Python package installer | install/upgrade/uninstall Python packages; prefer `uv` for isolated tooling | same dir as python | 👤 |
| `pipx` | 1.17.2 | Isolated Python CLI app installer | `pipx install <app>` (own venv each), `pipx list`, `pipx upgrade-all`, `pipx run <app>` (ephemeral); manages Poetry here | `%APPDATA%\Python\Python314\Scripts` | 👤 |
| `uv` / `uvx` | 0.12.13 | Ultra-fast Python manager (Astral) | `uv tool install` (isolated CLIs), `uvx <tool>` (run without install), `uv python install`, `uv venv`/`uv sync` (projects), `uv pip` | `C:\Users\Cooly\.local\bin` | 👤 |
| `poetry` | 2.4.3 | Python dependency & packaging manager (pipx-managed) | `poetry install/add/lock/run/shell` for project dependency isolation | `C:\Users\Cooly\.local\bin` (pipx shim) | 👤 |
| `pwsh` | 7.6.6 | PowerShell 7 (modern cross-platform shell) | preferred shell for scripts; side-by-side with 5.1; MSIX machine-provisioned, Store-updated | `Program Files\WindowsApps\Microsoft.PowerShell_...` + alias | 🖥 |
| `powershell` | 5.1 | Windows PowerShell (legacy, always present) | fallback shell; no ternary/`??`; profiles: `Documents\WindowsPowerShell\` | `System32\WindowsPowerShell\v1.0\` | 🖥 |
| `node` / `nvm` | 26.8.2 (npm 11.19.1) | Node.js via nvm-windows — **single installed version** | JS runtime; `nvm use <ver>` to switch (then reinstall npm-global CLIs — see gotcha 14); `npx <pkg>` for ephemeral JS CLIs | `...\Author Software\nvm\.nodejs` | 👤 |
| `deno` | 2.9.6 (V8 15.0, TS 6.0.3) | Secure TS/JS runtime | runs TS directly, no build step; **capability-scoped sandbox** — `deno run --allow-read=./data --allow-net=api.host script.ts` denies everything not granted. The zero-install way to execute untrusted/agent-authored JS safely (see gotcha 13 + §10 "Still absent") | `%LOCALAPPDATA%\Microsoft\WinGet\Packages\DenoLand.Deno_...` | 👤 |
| `dotnet` | host 8.0.23 — **runtime only, NO SDK** | .NET runtime | runs published .NET apps (`Microsoft.NETCore.App` + `WindowsDesktop.App` 8.0.23). **Cannot build or `dotnet run` source** — `dotnet --list-sdks` is empty. Install an SDK before assuming C# is a buildable target | `C:\Program Files\dotnet` | 🖥 |
| `java` | 8 (1.8.0_503) | Java runtime (Oracle) | runs `.jar` tooling — this is what veraPDF (§7) executes on; JRE only, no `javac` | `C:\Program Files (x86)\Common Files\Oracle\Java\java8path` | 🖥 |

## 2. Dev Collaboration & Terminal Utilities

| Command | Version | Purpose | Capabilities agents can use | Location | Scope |
|---|---|---|---|---|---|
| `gh` | 2.100.0 | GitHub CLI | PRs (`gh pr create/view/merge`), issues, releases, Actions runs, `gh api` for any REST/GraphQL call; ideal for agent-driven GitHub work | `C:\Program Files\GitHub CLI\` | 🖥 |
| `jq` | 1.8.1 | JSON processor | slice/filter/transform JSON on the command line; pairs with `gh api`, `yt-dlp -J`, any REST output | choco shim | 🖥 |
| `rg` (ripgrep) | 15.2.0 | **Content** search — the default grep for agents | recursive regex over file contents at high speed; respects `.gitignore` by default (`-u`/`-uu` to override), `--type`/`-g` filters, `-C` context, `--json` for machine parsing, `-l` files-only. **Use this, not `grep -r`** | `%LOCALAPPDATA%\Microsoft\WinGet\Packages\BurntSushi.ripgrep.MSVC_...` | 👤 |
| `fd` | 10.5.0 | **Filename** search, project-scoped | gitignore-aware `find` replacement: `fd <pat> [path]`, `-e ext`, `-t f` / `-t d` type filter, `-H` hidden, `-x`/`-X` parallel exec, `-a` absolute. Complements `es` — see gotcha 23 for which to reach for | choco shim | 🖥 |
| `fzf` | 0.74.3 | Fuzzy finder | interactive fuzzy filter for any stdin list; scripted via `fzf --filter <pat>`; PS keybinds: Ctrl+T files, Ctrl+R history (PSFzf module) | choco shim | 🖥 |
| `zoxide` | 0.9.2 | Smart directory jumper | `z <partial>` jumps to frequently/recently used dirs; learns from `cd` history | choco shim | 🖥 |
| `gsudo` | 2.6.1 | sudo for Windows | prefix any command for elevation: `gsudo <cmd>`; `gsudo config` for cache mode; replaces UAC-wrapper scripts | `C:\tools\gsudo\Current` | 🖥 |
| `7z` | 26.03 | Archive tool (7-Zip) | extract/create zip/7z/tar/gz/iso and 30+ formats; `7z x`, `7z a`, `7z l`; handles everything Windows' native zip can't | choco shim | 🖥 |
| `es` | 1.1.0.37 | Everything search CLI | instant filename search over NTFS index (via running Everything service): `es <pattern>`; regex with `-r`; far faster than any filesystem walk | `C:\Users\Cooly\.local\bin` | 👤 |
| Everything (GUI+service) | 1.4.11032 | Instant file indexer | runs as service, feeds `es`; GUI at `Program Files\Everything` | `C:\Program Files\Everything` | 🖥 |
| `ruff` | 0.15.20 | Python linter + formatter | `ruff check`, `ruff format`; single fast binary; ~all pyproject rulesets | choco shim | 🖥 |
| `FileLocksmithCLI` | 0.101.2362 | File-lock detective (PowerToys) | `FileLocksmithCLI <path>` → PID/process/user holding a file (EBUSY diagnosis); **sees user processes only, not SYSTEM holders**; crashes on ACL-broken paths (segfault) | `C:\Program Files\PowerToys\` | 🖥 |
| `Add-PathDir.ps1` / `Remove-PathDir.ps1` | — | Safe PATH editors (custom helpers) | idempotently append/remove one dir in User PATH; raw-registry read, kind-preserving, match-only normalization, WM_SETTINGCHANGE broadcast + process refresh | `D:\stuff\ai-misc\_bsh2026\vscode_project01\71-tavily\` | script |

## 3. Multimedia — Acquisition & Core Processing

| Command | Version | Purpose | Capabilities agents can use | Location | Scope |
|---|---|---|---|---|---|
| `ffmpeg` / `ffprobe` | 9.0.1 | Universal A/V engine (canonical copy) | transcode (any codec incl. AV1/SVT-AV1), lossless cut (`-c copy` + `-ss/-to`), mux/demux, extract audio (`-vn`), thumbnails/storyboards (`fps` filter), GIF via `palettegen`+`paletteuse`, screen capture (gdigrab), audio norm (`loudnorm`), filters/chains; `ffprobe -v quiet -print_format json` for machine-readable metadata | choco shim (beats yt-dlp's companion copy in PATH order) | 🖥 |
| `yt-dlp` | 2026.08.19 | Media downloader (1000+ sites) | download video/audio/playlists; format selection (`-f`), metadata JSON (`-J`), subtitles, chapters; `--downloader aria2c` for speed | `%LOCALAPPDATA%...\yt-dlp.yt-dlp_...` | 👤 |
| `aria2c` | 1.37.0 | Multi-protocol downloader | multi-connection HTTP/FTP/BitTorrent/Metalink; resume (`-c`), retries; pairs with yt-dlp | choco shim | 🖥 |
| `streamlink` | 8.5.0 | Live-stream extractor | pull live HLS/RTMP/DASH to file or pipe (`-o -` → ffmpeg); handles auth pages yt-dlp doesn't | `C:\Program Files\Streamlink\bin` | 🖥 |
| `gallery-dl` | 1.32.2 | Image-gallery downloader | bulk-download galleries/scroll sites (pixiv, DeviantArt, Reddit, ...); metadata JSON, filters, range selection | choco shim | 🖥 |
| `scenedetect` | 0.7.1 | Scene-boundary detection (PySceneDetect) | `scenedetect -i video.mp4 detect-content list-scenes` → cut lists; pairs with ffmpeg lossless cut (`-c copy` + `-ss/-to`) instead of guessing timestamps | `~\.local\bin` (uv tool, Python 3.12) | 👤 |
| `ffsubsync` / `ffs` | 0.5.1 | Subtitle auto-sync (audio fingerprint) | `ffsubsync video.mkv -i wrong.srt -o fixed.srt`; aligns out-of-sync subs to any video | `~\.local\bin` (uv tool, Python 3.12) | 👤 |
| `alass` | 2.0.0 | Subtitle synchronizer (Rust) | different algorithm than ffsubsync, good when it misses; `alass <video> <sub> <out>`; bundled ffmpeg 4.x referenced only via bat-local env — system ffmpeg unaffected | `C:\tools\alass\alass.bat` | 🖥 |
| `beet` (beets) | 2.14.0 | Music library tagger/organizer | `beet import/ls/modify/move`; MusicBrainz lookup, dedup; config `~\AppData\Roaming\beets\config.yaml` | `~\.local\bin` (uv tool, Python 3.12) | 👤 |

## 4. Multimedia — Images

| Command | Version | Purpose | Capabilities agents can use | Location | Scope |
|---|---|---|---|---|---|
| `magick` | 7.1.2-Q16-HDRI | ImageMagick 7 — raster image suite | convert/resize/crop/rotate/composite/annotate 200+ formats; batch loops; `identify` metadata; **always `magick` — never `convert`** (shadowed by System32) | `C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\` | 🖥 |
| `vips` | 8.18.6 | libvips — fast image processing | same class of ops as ImageMagick at 5-10× speed / low RAM; `vipsheader` metadata; the choice for huge images/batches | `Program Files\WinGet\Packages\libvips...\vips-dev-8.18\bin` (real bin dir, not Links) | 🖥 |
| `oxipng` | 10.2.1 | Lossless PNG optimizer | `-o max --strip safe`; safe to run blindly in pipelines; multithreaded | `Program Files\WinGet\Links` | 🖥 |
| `gifsicle` | 1.95 | GIF manipulation | optimize (`-O3`, `--colors`), crop/resize/merge frames, batch edit | choco shim | 🖥 |
| `jpegoptim` | 1.5.6 (mozjpeg-linked) | Lossy JPEG optimizer | `jpegoptim -m<quality> -o <files>`, `--strip-all`; better compression than libjpeg default; covers the mozjpeg recommendation | choco shim | 🖥 |
| `pngquant` | 2.17.0 | Lossy PNG quantizer | `pngquant --quality 40-90 256 <png>` for web-bound output; complements oxipng (lossless). choco pkg says "3.0.3" but ships 2.17.0 (gotcha 20) | choco shim | 🖥 |
| `avifenc` / `avifdec` | 1.4.2 | AVIF encode/decode (libavif) | modern JPEG-replacement images, much smaller at same quality; aom encoder + dav1d decoder; pairs with magick/vips | `C:\tools\avif\` | 🖥 |

## 5. Multimedia — Containers, Metadata, QC

| Command | Version | Purpose | Capabilities agents can use | Location | Scope |
|---|---|---|---|---|---|
| `mkvmerge` / `mkvextract` / `mkvpropedit` | v100.0 | MKVToolNix — Matroska surgery | lossless track add/remove/extract (subs/audio/video), split/append, chapter editing — **no re-encode** | `C:\Program Files\MKVToolNix\` | 🖥 |
| `mediainfo` | CLI 26.5 | Media file reporter | one-line codec/bitrate/duration reports; machine-readable (`--Output=JSON`) | choco shim | 🖥 |
| `exiftool` | 13.59 | Universal metadata reader/writer | read/write EXIF/IPTC/XMP on virtually any media/office file; strip GPS/PII (`-all=`), rename by date (`-d`), batch ops | choco shim | 🖥 |
| `sox` | 14.4.1 | Sound processing swiss knife | convert/resample/trim/splice/merge audio; effects (reverb, fade, speed); render spectrograms to PNG | choco shim | 🖥 |
| `mpv` | 0.41.0 | Media player (scriptable) | compatibility prober: `mpv --vo=null --frames=1 file` verifies playability; precise frame screenshots (`--frames=N` + screenshot); handles files ffmpeg rejects | choco shim | 🖥 |
| `czkawka_cli` | 12.0.2 | Duplicate & similar-media finder (Rust) | image similarity, video/audio hashes, empty dirs, big files; scripted library cleanup | `C:\tools\czkawka\` | 🖥 |

## 6. Multimedia — Speech AI (local)

| Command | Version | Purpose | Capabilities agents can use | Location | Scope |
|---|---|---|---|---|---|
| `whisper-ctranslate2` | 0.5.7 | Speech-to-text (faster-whisper engine) | transcribe audio/video → txt/srt/vtt/json; word timestamps, VAD; models auto-download on first run (small/base/medium/large-v3); GPU if available | `C:\Users\Cooly\.local\bin` (uv tool) | 👤 |
| `piper` | 1.8.0 | Text-to-speech (neural, offline) | `-m <voice-model> -f out.wav` from stdin text; needs a voice model download; fully local, no API | `C:\Users\Cooly\.local\bin` (uv tool) | 👤 |

## 7. PDF Processing

| Command | Version | Purpose | Capabilities agents can use | Location | Scope |
|---|---|---|---|---|---|
| `qpdf` | 12.4.1 | Structural PDF engine | merge/split (`--pages`), rotate, encrypt/decrypt, linearize, **repair corrupt PDFs**, compress streams; `qpdf --json` = machine-readable structure | choco shim | 🖥 |
| `pdftotext` / `pdftoppm` / `pdfinfo` / `pdfimages` / `pdftohtml` / `pdfseparate` / `pdfunite` / `pdffonts` (poppler) | 26.7.0 | PDF utilities bundle | text extraction (`-layout`), **render pages → PNG for vision analysis**, extract embedded images, metadata, split/merge, font inspection. Note: version flag is `-v`, not `--version` | choco shims | 🖥 |
| `gswin64c` | 10.08.0 | Ghostscript (PS/PDF interpreter) | shrink PDFs (`-dPDFSETTINGS=/ebook`), PDF/A conversion, deep repair, PS↔PDF. **Command is `gswin64c`, not `gs`** | `C:\Program Files\gs\gs10.08.0\bin` | 🖥 |
| `tesseract` | 5.5.3 | OCR engine | scanned pages/images → text, hOCR, or OCR'd PDF; multi-language; feeds ocrmypdf | `C:\Program Files\Tesseract-OCR\` | 🖥 |
| `pdfcpu` | 0.15.0 | Go-based PDF processor | watermark/stamp, rotate/insert/extract pages, optimize, `pdfcpu info -json` | `Program Files\WinGet\Links` | 🖥 |
| `pandoc` | 3.11 | Universal document converter | markdown/HTML/docx ↔ each other; →PDF with typst engine; report generation | choco shim | 🖥 |
| `typst` | 0.15.1 | Modern typesetting → PDF | markdown-ish source → PDF in milliseconds; no LaTeX toolchain; verified end-to-end (compile → pdftotext round-trip) | choco shim | 🖥 |
| `img2pdf` | 0.6.3 | Lossless images → PDF | JPEG/PNG → PDF with zero re-encoding; DPI/paper control | `~\.local\bin` (uv tool) | 👤 |
| `ocrmypdf` | 17.11.0 | OCR pipeline for scanned PDFs | deskew/clean/OCR/PDF-A in one command; Windows = community-supported (works here; v17 verified) | `~\.local\bin` (uv tool) | 👤 |
| `marker` / `marker_single` | 2.0.0 | ML PDF → Markdown | layout-aware extraction for RAG; `marker_single <file>` for one doc; models (~GBs) download on first run; runs on uv-managed **Python 3.12** | `~\.local\bin` (uv tool) | 👤 |
| `mutool` | 1.28.0 | MuPDF tools | fastest PDF render (`mutool draw -o page.png`), `clean`/`merge`/`convert`, object-level `show` inspection; complements qpdf (structure) + poppler (utils). Upgrades: new versioned dir under `C:\tools\mutool\` + repoint `Current` junction (gotcha 21) | `C:\tools\mutool\Current\` (junction) | 🖥 |
| `verapdf` | 1.30.2 (Greenfield) | PDF/A & PDF/UA validator (Java) | `verapdf --flavor 1b <pdf>` or folder batch — verify ocrmypdf `--output-type pdfa` output actually validates; runs on machine's Java 8 | `C:\Users\Cooly\verapdf\verapdf.bat` | 👤 |

## 8. Research & Platform (pre-existing, retained)

| Command | Version | Purpose | Capabilities agents can use | Location | Scope |
|---|---|---|---|---|---|
| `tvly` | 0.1.8 | Tavily CLI (authenticated) | web search/extract for research tasks; token in `~\.tavily\config.json` | Python user scripts | 👤 |
| `git` | 2.55.0.windows.3 | Version control | all git operations; credential manager configured | `C:\Program Files\Git\cmd` | 🖥 |
| Claude Code Agent Skills | 8 skills | Tavily skills installed globally | `tavily-search`, `tavily-extract`, `tavily-crawl`, `tavily-map`, `tavily-research`, `tavily-dynamic-search`, `tavily-cli`, `tavily-best-practices` | `~\.claude\skills\` | 👤 |

## 9. Browser Control & Web Automation

Two MCP servers ship as Claude Code plugins (user scope, `~\.claude\plugins\`) — both verified live 2026-09-12. CLIs are npm-global shims (PATH ✓), uv tools, or standalone binaries. Research report with sources: `agent-browser-control-research-2026-09-12.md`.

| Tool | Version | Kind | Capabilities agents can use | Location | Scope |
|---|---|---|---|---|---|
| Playwright MCP (plugin `playwright@claude-plugins-official`) | 0.0.80 | MCP server (Microsoft) | live browser control in agent sessions: navigate, a11y snapshots with element refs (written to file = token-cheap), click/fill by ref, screenshots, JS eval; drives system Chrome/Edge/Firefox/WebKit via `--browser`; `--isolated` for in-memory profile; `--extension` attaches your real Chrome | `~\.claude\plugins\cache\...` (invokes `npx @playwright/mcp@latest`) | 👤 |
| Chrome DevTools MCP (plugin `chrome-devtools-mcp`) + bundled `chrome-devtools` CLI | 1.9.0 | MCP server + CLI (Google) | DevTools-grade debugging: network request/response inspection, console with stacks, performance traces + insights, Lighthouse audits, heap snapshots, emulate (viewport/throttle/geolocation); Chrome-only | `~\.claude\plugins\cache\...` | 👤 |
| `agent-browser` | 0.37.1 | Daemon CLI + MCP (Vercel, Rust native) | token-efficient default surface: `open`, `snapshot` (a11y tree, refs `@e1`), `click @ref`, `fill @ref`, `screenshot`, `pdf`, `eval`; headless by default; own Chrome for Testing (no profile clashes); `agent-browser mcp` = MCP server (registered user-scope, `core` profile) | npm shim → nvm installs dir | 👤 |
| `playwright-cli` | 0.1.19 | Daemon CLI (Microsoft `@playwright/cli`) | same pattern as agent-browser, first-party: `open`, `snapshot` (to file), `click/fill` by ref, `attach --cdp` to a running browser, `requests`/`console`, screenshots/PDF; young (0.1.x — expect churn) | npm shim → nvm installs dir | 👤 |
| `browse` | 0.9.6 | CLI (Browserbase/Stagehand) | deterministic commands (`open/click @0-12/fill/snapshot/get/eval`), per-session daemon, `--local` key-free, `--remote`/`--cdp` targets, skills catalog (`browse skills add <site>/<skill>`) | npm shim → nvm installs dir | 👤 |
| `browser-use` / `browser-harness` | 0.1.13 / 0.13.10 | CDP snippet CLI (Browser Use) | agents pipe Python snippets to stdin (`new_tab()`, `page_info()`, helpers pre-imported); daemon attaches real Chrome via CDP (= logged-in sessions); Claude Code skill installed (`browser-use` in `~\.claude\skills\`); `browser-use doctor` for health | `~\.local\bin` (uv, Python 3.12) | 👤 |
| Playwright Chromium | 1243 (≈1.63) | Managed browser binary | isolated automation target shared by playwright-cli / `npx playwright`; `PLAYWRIGHT_BROWSERS_PATH` overrides | `%LOCALAPPDATA%\ms-playwright\chromium-1243` | 👤 |
| Chrome for Testing | 153.0.8010.36 | agent-browser's browser | dedicated to agent-browser; auto-detected alongside system Chrome/Brave | `~\.agent-browser\browsers\` | 👤 |
| System Chrome / Edge | 153 | Headless one-liners (zero install) | `chrome --headless --user-data-dir=<TEMP dir> --dump-dom <url>` / `--print-to-pdf= out.pdf --no-pdf-header-footer` / `--screenshot=out.png --window-size=1280,1696`; **throwaway `--user-data-dir` required when Chrome is already running** | `C:\Program Files\Google\Chrome` / `...\Edge` | 🖥 |

| `mitmproxy` / `mitmdump` / `mitmweb` | 12.2.3 | HTTP(S) intercepting proxy (binary) | capture/inspect/rewrite/replay any client's traffic — reverse-engineer a site's underlying API once, then script it with curl/aria2c; `mitmdump` for headless scripting | `C:\Program Files\mitmproxy\bin` | 🖥 |
| `monolith` | 2.10.1 | Page archiver (Rust binary) | `monolith <url> > page.html` → one self-contained HTML (CSS/images inlined); preserves text/structure where screenshots/PDF don't. `-o` accepts relative paths only (gotcha 19) | `C:\tools\monolith\` | 🖥 |
| `trafilatura` | 2.2.0 | Main-content extraction CLI (uv, Python 3.12) | stdin/URL → clean text/markdown/JSON; local free complement to Tavily extract/crawl | `~\.local\bin` | 👤 |

**Cloud (deferred, zero local install):** Browserbase hosted MCP (`mcp.browserbase.com`), Steel (most generous free credits; **its CLI has no Windows binary**), Hyperbrowser, Browserless (hosted MCP; local MCP needs Node 24+ ✓). Sign up only when anti-bot/parallelism is needed — see research report for 2026-09-12 pricing snapshot.

---

## 10. Code Intelligence, Verification & Local AI

Installed 2026-09-13 (Tier 1 coding-agent batch), each **functionally** verified — not just `--version`. Details and per-tool test evidence: `toolrecs/install-log-2026-09-12-tier1.md`.

| Command | Version | Purpose | Capabilities agents can use | Location | Scope |
|---|---|---|---|---|---|
| `ast-grep` / `sg` | 0.45.3 | **AST-aware search & rewrite** — the highest-leverage refactor tool here | structural match/rewrite on real syntax, not text: `ast-grep run -p 'console.log($$$A)' -r 'logger.debug($$$A)' -l js -U`. Metavars `$A` (one node) / `$$$A` (variadic). **Ignores matches inside comments and string literals** — verified — which is exactly where `rg`-and-edit corrupts files. `ast-grep scan` runs YAML rule files for repeatable, reviewable refactors and custom lint. Prefer this over multi-file text edits | `C:\Program Files\WinGet\Packages\ast-grep.ast-grep_Microsoft.Winget.Source_8wekyb3d8bbwe\` (real bin dir, **not `Links`** — gotcha 4 does not apply) | 🖥 |
| `shellcheck` | 0.9.0 | Shell script static analysis | lint bash **before executing it**: catches unquoted expansions, word splitting, `rm -rf $VAR/*` expanding to `/*` (SC2115/SC2086). Given how much bash gets generated on this machine against paths containing spaces, run it on any non-trivial script first. `-f json` for machine-readable output. choco pin is behind upstream (gotcha 27) | choco shim | 🖥 |
| `shfmt` | 3.14.1 | Shell formatter | `shfmt -i 2 -w <file>`; `-d` diff mode, `-l` list-unformatted for CI gates | choco shim | 🖥 |
| `sqlite3` | 3.53.4 | Embedded SQL engine | query/build structured intermediate state instead of hand-rolling Python: `sqlite3 db.sqlite "select ..."`; `-json`/`-csv` output modes, `.import` for CSV. Also reads `beets`' library DB (§3) and Claude Code transcript stores | choco shim | 🖥 |
| `yq` | v4.53.6 | `jq` for YAML/XML/TOML (and JSON) | same expression language as `jq`: `yq '.nested.key' f.yaml`, `-o=json` to convert, `-i` in-place edit. The tool for skill frontmatter, `settings.json`, `docs.json`, GH Actions workflows, MCP configs | choco shim | 🖥 |
| `just` | 1.58.0 | Command runner | `just --list` gives agents a **discoverable, verifiable command surface** instead of guessing build/test invocations from prose. Recipes take args and can set their own shell. Document recipes in `justfile` + CLAUDE.md and agents stop inventing commands | choco shim | 🖥 |
| `difft` (difftastic) | 0.70.0 | **Structural** diff | compares parse trees, so pure reformats report "No syntactic changes" (verified) — removes the false-positive noise that makes agent self-review unreliable. `GIT_EXTERNAL_DIFF=difft git diff`, or `difft --display inline --color never a b` for clean piping | choco shim | 🖥 |
| `gitleaks` | 8.30.1 | Secret scanner | `gitleaks dir .` or `gitleaks protect --staged` before any agent-authored commit. Live tokens exist on this box (`~\.tavily\config.json`, gh creds). `--redact` to keep findings out of logs; `-f json`. **Allowlists published example keys** — gotcha 25 | choco shim | 🖥 |
| `watchexec` | 2.7.2 (+pid1) | File-watch command runner | closes the TDD loop: re-run tests on save. `--watch <dir> --exts py --debounce 200ms`. **`--shell=none` is mandatory here** — gotcha 24 | choco shim | 🖥 |
| `ollama` | 0.34.0 | Local LLM host (pre-existing, previously undocumented) | offline inference for bulk subtasks (classify/summarize N files) **without spending main-context tokens**; HTTP API on `127.0.0.1:11434`, `ollama run <model>`, `ollama list`. **Models already pulled:** `qwen2.5-coder:7b` (4.7 GB, code), `deepseek-r1:8b` (5.2 GB, reasoning), `gemma4:e2b` (7.2 GB), `qwen3:4b`, `qwen3:1.7b` | `%LOCALAPPDATA%\Programs\Ollama` | 👤 |

**Still absent (deliberate gaps to be aware of):** no Rust/`cargo`, no Go, **no Docker/Podman, and no WSL** (`wsl --status` → not installed). Consequences: (a) no container/Linux sandbox for agent-executed code — `deno`'s `--allow-*` flags (§1) are the only capability-scoped option on hand; (b) `semgrep` is unobtainable (OCaml engine, no native Windows build, absent from both choco and winget) — `ast-grep scan` covers a useful subset; (c) `cargo install`-only and `go install`-only tools remain out of reach, including `resvg` (§11). See `toolrecs/agent-dev-tool-recs-2026-09-12[opus5].md` Tiers 2–4.

## 11. 2026-09-12 Tool-Recommendations Batch

All 13 tools from `toolrecs/recommended-tool-additions-2026-09-12[zcode-glm53].md` are **integrated into the category tables above** (sections 3, 4, 5, 7, 9), each installed and functionally verified 2026-09-12. Sources, install details, and skipped candidates with reasons: `toolrecs/install-log-2026-09-12.md`.

**Also verified 2026-09-12 (no install needed):** `curl.exe` 8.21.0 ships in `System32` and resolves in cmd/pwsh; `wget.exe` 1.21.4 via choco shim; SVG→PNG already handled by `vips svgload` and `magick`; ephemeral pattern `uv run --with pdfplumber --with pypdf python -c "..."` works.

**resvg intentionally absent:** upstream ships no Windows binary (like gifski, gotcha 8) and `vips`/`magick` SVG rendering already passes; revisit only if Rust/cargo gets installed (`cargo install resvg`).

## Gotchas & Operating Notes for Agents

1. **PATH registry safety:** User `Path` value kind is now plain `REG_SZ` (flipped from `REG_EXPAND_SZ`, likely by an nvm rewrite, 2026-09-12 — verified safe: no unexpanded `%` entries remain; the former `%USERPROFILE%\...` entry survives as an expanded absolute path). Never rewrite via `[Environment]::SetEnvironmentVariable` with a pre-expanded value if any `%` entries exist — use `Add-PathDir.ps1` / `Remove-PathDir.ps1` (raw read, kind-preserving either way).
2. **`convert` is NOT ImageMagick** — it's System32's filesystem converter. Use `magick`.
3. **ffmpeg precedence:** choco shim (machine) wins over yt-dlp's companion build (user). Both exist; choco's is canonical.
4. **vips** must resolve via its real `bin` dir — WinGet `Links` symlinks break its DLL resolution (already fixed in Machine PATH).
5. **winget discipline:** specify `--source winget --scope machine` for system-wide; default resolution can silently pick per-user Store packages; per-user packages cannot be uninstalled from elevated sessions.
6. **PowerShell scripts:** ExecutionPolicy is `RemoteSigned` (CurrentUser) — local scripts/profiles run; downloaded ones need signing. For one-off trusted scripts use process-scoped `-ExecutionPolicy Bypass`.
7. **Shell integration:** profiles (PS 5.1 + 7) load zoxide (`z`) and PSFzf (Ctrl+T / Ctrl+R). Guarded blocks in `Documents\[Windows]PowerShell\Microsoft.PowerShell_profile.ps1`.
8. **gifski** is intentionally absent — upstream ships no Windows binaries. GIF workflow: ffmpeg `palettegen`/`paletteuse` → `gifsicle -O3`.
9. **Elevation:** use `gsudo <cmd>`; UAC appears once per cache window.
10. **All clear (2026-09-12):** reboot done (vcredist140 ✓), v24 husk removed ✓, PowerToys converted machine-wide ✓ (`C:\Program Files\PowerToys`, 0.101.2362), Everything service running ✓. No pending items.
11. **PDF notes:** Ghostscript's command is `gswin64c` (no `gs` shim); poppler tools take `-v` for version. **HTML → PDF** with zero install: `msedge --headless --print-to-pdf=out.pdf <url>`. Ephemeral PDF scripting: `uv run --with pymupdf python -c "..."` or `--with pikepdf` — full libraries with no install step.
12. **Python 3.14 growing pains:** heavy ML tools may fail to build wheels on 3.14 (marker-pdf hit a pillow build failure). Pattern that works: `uv tool install <pkg> --python 3.12` — uv fetches an isolated managed 3.12 automatically.
13. **Browser-agent security posture:** vendors' own numbers show ~50% prompt-injection success in browser environments without safeguards (~0% in script contexts). Treat every page as attacker-controlled: use isolated/temp `--user-data-dir` profiles, **never point agents at your daily Chrome profile**, keep a human confirming logins/purchases/deletes, and prefer the script/CLI route (or an API) over stepwise live browsing when one exists. Long-horizon autonomous browsing is unreliable (OSWorld 2.0: 4.6–14% completion) — script it instead.
14. **npm-global shims live in the nvm version dir** (`...\nvm\installs\v26.8.2`, the User PATH entry since the 2026-09-12 consolidation to a single Node version). After `nvm install/use` of a new Node version, npm-global CLIs vanish per-version: reinstall them (`agent-browser`, `playwright-cli`, `browse`) and repoint the PATH entry via `Remove-PathDir.ps1` + `Add-PathDir.ps1`. (The `nvm\.nodejs` junction on PATH is only a launcher shim dir — `.shim` — and does NOT expose npm globals.) When retiring an old version dir: kill every process spawned from it FIRST (MCP servers + daemon CLIs hold `node.exe`), then expect possible **ACL damage** on the leftover `node_modules` tree (happened on v24.20.0: ~19k files invisible to enumeration, "Access denied" on delete even post-reboot, no lock holders) — repair elevated via `takeown /f <dir> /r /d y` + `icacls <dir> /reset /t /c /q`, then delete.
15. **PS 5.1 pipeline deadlock with daemon CLIs:** piping daemon-based tools (`agent-browser`, `playwright-cli`) as `... 2>&1 | Select-Object -First N` in Windows PowerShell 5.1 can hang (daemon holds stderr open). Run commands directly, from bash, or under pwsh 7.
16. **browser-use specifics:** daemon attaches your *real* Chrome — needs a one-time `chrome://inspect/#remote-debugging` toggle in Chrome, or an isolated target: launch Chrome with `--remote-debugging-port=9223 --user-data-dir=<temp>` and set `BU_CDP_URL=http://127.0.0.1:9223`. `browser-use skill install` has a Windows self-upgrade bug (venv `Scripts` dir lock) — SKILL.md is registered manually at `~\.claude\skills\browser-use\`; update by re-copying from `browser-use skill` output.
17. **agent-browser MCP** is registered at user scope in `~\.claude.json` (`mcpServers.agent-browser` → `agent-browser mcp`, `core` profile; backup `.bak-before-agent-browser-mcp`). Remove the key to unregister. Other harnesses (Cursor/Gemini/Codex) reuse the same JSON shape; Codex needs the `cmd /c` wrapper — see research report Tier 3.
18. **Avoid chrome-devtools-mcp `--autoConnect`** for now (open Windows timeout issue #2675, Sept 2026); let the server launch its own Chrome instead.
19. **monolith `-o` requires a relative path** on Windows (absolute paths of any style panic with `could not prepare output`); use stdout redirection (`monolith <url> > page.html`) instead.
20. **choco pngquant "3.0.3" installs binary 2.17.0** — upstream's `pngquant-windows.zip` never shipped a 3.x build; fine in practice.
21. **mutool upgrades:** extract the new `mupdf-<ver>-windows` dir next to the old one under `C:\tools\mutool\`, then repoint the `Current` junction (`cmd /c rmdir Current & mklink /J Current mupdf-<ver>-windows` from `C:\tools\mutool`). Machine PATH entry `C:\tools\mutool\Current` stays valid.
22. **veraPDF unattended install:** console mode hangs on piped stdin; use the IzPack auto-install XML route (panel classes + pack names in install-log gotcha 3/7). It installs to `%USERPROFILE%\verapdf` regardless of `<installpath>`.
23. **Three search tools, three jobs — don't substitute blindly.** `rg` = **file contents** (regex, gitignore-aware, the default for "where is this code"). `fd` = **filenames within a project** (gitignore-aware, so it won't walk `node_modules`). `es` = **filenames machine-wide** via the NTFS index (instant, but gitignore-blind and unaware of repo boundaries — use it to locate a file *somewhere on disk*, not to enumerate a repo). For anything structural — "find this call pattern", "rename this API across files" — use `ast-grep`, not `rg`.
24. **`watchexec` shell modes are broken under Git Bash here — always pass `--shell=none`.** watchexec resolves its default shell to Git Bash `sh` and passes the command as *separate argv items*, so `sh -c` takes token 1 as the command string and the rest become `$0` + positional args: `-- cp a b` → `cp: missing file operand`; from pwsh, `-- "copy a b"` → `a: line 1: copy: command not found`. `--shell=bash`, the default, and single-quoting the whole command all fail identically. Verified working forms: `watchexec --shell=none -- pytest -x` (direct exec) and `watchexec --shell=none -- bash -c 'cmd | pipeline'` (explicit shell).
25. **`gitleaks` allowlists published example credentials** — a test using AWS's documented `AKIAIOSFODNN7EXAMPLE` returns "no leaks found", which is *correct behaviour*, not a broken install. Validate with a realistic random token (e.g. `ghp_` + 36 random alphanumerics).
26. **`gsudo cache on` does not work from Claude Code's redirected console.** It reports "Elevation allowed for process Id N and children", but each tool call is a fresh process tree, so the next shell sees `Total active cache sessions: 0` / `Available for this process: False`. Use per-command **`gsudo -- <cmd>`** (one UAC prompt each) for elevated installs, and confirm nothing is left open afterwards with `gsudo -k`. (Supersedes the cache-session pattern noted in `install-log-2026-09-12.md`.)
27. **New-install PATH visibility:** choco shims land in `C:\ProgramData\chocolatey\bin` (already on Machine PATH → immediately usable). **winget** writes a *new* Machine PATH entry, so winget-installed tools — `ast-grep` was the case here — are invisible to already-running shells until a fresh one starts. Verify with a registry-derived PATH rather than the current process env. Also note `ast-grep` registers a second alias `sg.exe`; harmless on Windows (`sg` is a Linux setgid tool) but both names resolve. choco's `shellcheck` is pinned at 0.9.0, behind upstream — fine for SC2086/SC2115-class checks; use the GitHub release zip if newer rules are needed.
