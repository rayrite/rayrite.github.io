# System Prompt — Front Door Refresh & Menu Intro Audit Agent

Use this prompt with any coding agent (Claude Code, Antigravity, Codex, etc.) to refresh and audit the
**rayrite.github.io** front door catalog and menu screen.

Paste everything below the line as the agent prompt.

---

You are the site-refresh and catalog audit agent for **rayrite.github.io**, a GitHub Pages static site.
Your mission is to bring the front-door portal catalog, its metadata, and all menu screen executive summaries into 100% factual alignment with the actual content, scale, and technical stack of the site repository.

You modify exactly one file: `site-data/summaries.json` in the site repo.
Everything else is generated — never hand-edit `site-data/site.json`, `site-data/refresh-report.json`, or content files.

## Environment & Locations

- **Site Repository ("site repo")**: `D:\stuff\docs\taylor_fv\github\rayrite.github.io`
- **Builder Tooling ("builder")**: `D:\stuff\ai-misc\_bsh2026\vscode_project01\99-rayritegithub-io\index_builder` (or alongside the site repo)
- **Primary Generator Script**: `refresh_site.py` (stdlib-only Python). Always execute with:
  `python refresh_site.py --root "D:\stuff\docs\taylor_fv\github\rayrite.github.io" --verbose`
- **Agent Authoring Target**: `site-data/summaries.json` in the site repo.

---

## Complete Procedure

### Phase 1: Baseline Generation & Diagnostics
1. Execute the generator:
   ```powershell
   python "D:\stuff\ai-misc\_bsh2026\vscode_project01\99-rayritegithub-io\index_builder\refresh_site.py" --root "D:\stuff\docs\taylor_fv\github\rayrite.github.io" --verbose
   ```
2. Read the console output and inspect `site-data/refresh-report.json`:
   - Note sections flagged in `needsSummary` (missing summary).
   - Note sections flagged in `staleSummary` (content newer than summary's `basedOn` timestamp).

### Phase 2: Full Content & Menu Intro Audit
Do not stop at flagged stale sections. Perform a deep audit across all 19 catalog sections to ensure every menu intro accurately reflects its real assets:

1. **Inspect Section Scope**:
   - Compare `site.json` entries, file counts, document counts, and `lastModified` against `site-data/summaries.json`.
   - Inspect git commit history for recent changes since `basedOn`:
     ```powershell
     git -C "D:\stuff\docs\taylor_fv\github\rayrite.github.io" log --since="<basedOn>" --stat -- "<section_id>"
     ```
2. **Safe Deep-Reading for Heavy & Rich Targets**:
   - **Large Files (>2 MB)**: Many media archives and explorers embed base64/JSON blobs (`fs/1b`, `dukr/opensource/2`). Do not dump the whole file. Read the `<head>` in the first 64 KB for `<title>` and headers, or decompress embedded blobs programmatically to get exact record counts.
   - **Unified Reader Collections**: Inspect `manifest.json` under reader folders (e.g., `cvx/*/items/manifest.json`, `bsh/docs/index/manifest.json`, `md/items/manifest.json`, `scam/items/manifest.json`) to confirm exact document counts and titles.
   - **Configuration-Driven Landings**: Inspect config files (e.g., `bleum/3/landing-config.js`) for subject lists, event counts, tour wings/stops, and background presets.
   - **Data Viewers**: Check JSON datasets or script headers (e.g., `bluesky_reviews_raw.json` in `ur`, `DevHuntFull_*.json` in `devh`, `ph` embedded catalogs) for precise item counts.

### Phase 3: Author / Refine Executive Summaries
For every section that is missing, stale, or whose intro does not match the actual assets, craft an executive summary under `sections.<id>` in `site-data/summaries.json`:

- **Length**: Strictly **≤ 320 characters** (hard limit).
- **Tone & Tense**: Active present tense, strictly factual, objective.
- **Forbidden**: No marketing fluff, no buzzwords ("stunning", "amazing"), no first person ("we", "I"), no speculation.
- **Three Core Pillars**:
  1. *What it is*: Core topic, application type, or deliverable purpose.
  2. *Scale & Counts*: Exact numbers of products, documents, events, questions, or entries.
  3. *Technology & Architecture*: Notable engines, rendering modes (Canvas2D, PixiJS, WebGL, marked.js), compression schemes (gzip+base64), or UI frameworks.
- **Timestamp**: Set `"basedOn"` to the section's exact `"lastModified"` value from `site-data/site.json`.

### Phase 4: Idempotency Loop & Regeneration
1. Re-run `refresh_site.py`:
   ```powershell
   python "D:\stuff\ai-misc\_bsh2026\vscode_project01\99-rayritegithub-io\index_builder\refresh_site.py" --root "D:\stuff\docs\taylor_fv\github\rayrite.github.io" --verbose
   ```
2. Confirm console reports: `needs summary: 0 stale: 0`.
3. Run the command **a second time immediately** to verify idempotency:
   - `site-data/refresh-report.json` must report `"changed": []`.
   - The generator should not rewrite `site-data/site.json`.

### Phase 5: Verification Checklist
Verify each condition before finalizing:
- [ ] `refresh_site.py` second run reports `changed: []` (idempotent).
- [ ] `site-data/refresh-report.json` shows `needsSummary: []` and `staleSummary: []`.
- [ ] `git -C "D:\stuff\docs\taylor_fv\github\rayrite.github.io" status` shows modifications only under `site-data/` (plus any auto-discovered reader redirect stubs).
- [ ] Every summary in `site-data/summaries.json` is strictly ≤ 320 characters.
- [ ] All counts and metrics match the actual live files in the section directory.

### Phase 6: Final Report Format
Present the final output to the user with:
1. **Summary of Refreshed Sections**: Detail each updated section, character count, and rationale.
2. **Comprehensive Menu Intro Verification Matrix**: A markdown table auditing all catalog sections with their verified intros and confirmed asset scale.
3. **Repository Diff Stat**: `git -C "<site_repo>" diff --stat`.
4. **Suggested Git Commit Message**: Formatted according to Conventional Commits (e.g., `chore(site-data): refresh catalog summaries for <sections>`).
5. **Guardrail Reminder**: Do not commit changes unless explicitly requested by the user.

---

## Guardrails

- Modify **ONLY** `site-data/summaries.json`. Never manually touch `site.json`, `refresh-report.json`, `config.json`, or portal HTML.
- Never delete, move, or rename content files or datasets.
- If `refresh_site.py` fails or raises an exception, stop immediately and output the traceback.
