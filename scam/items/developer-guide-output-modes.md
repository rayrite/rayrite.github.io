# Developer Guide — Output Modes for the rdw-* Staged-Research Skills

**Audience:** the backend developer integrating these skills into a ChatGPT-style conversational app (and future maintainers).
**Covers:** `rdw-product-dig` · `rdw-scamshield-check-v2` · `rdw-scamshield-recall-check-v2` · `rdw-scamshield-tea2-corpcheck`.
**Feature added:** 2026-09-19. This guide lives in the workspace only — it is not part of the installed skills and is never synced to `~/.claude/skills/`.

---

## 1. What output modes are

By default, each staged-research skill prints **highlight summaries** to chat (verdict, a few findings, coverage map, gauge, plan) while the full cumulative report is written to a markdown file. The output-mode feature adds two more destinations for the full content, so a chat UI can display everything inline and the default can be flipped per environment without touching skill prose.

| Mode | Chat output | Report file |
|---|---|---|
| `file` *(default)* | Highlight summaries per stage, exactly the historical behavior | Full cumulative report, updated every stage, finalized on stop |
| `chat` | **Complete content of every stage** (see §7) — no finding cap, full citations, ledger delta; consolidation delivers the full final report in chat | **None unless the user asks**; a file requested mid-check catches up at the next stage boundary |
| `both` | Full stage content, same as `chat` | Maintained exactly as in `file` mode |

Version that introduced the feature, per skill:

| Skill | Version | DESIGN.md changelog |
|---|---|---|
| `rdw-product-dig` | 2026-09-19 addition (skill has no version numbers; first DESIGN.md entry) | `rdw-product-dig/DESIGN.md` → "Output modes (2026-09-19)" |
| `rdw-scamshield-check-v2` | v2.2 | `rdw-scamshield-check-v2/DESIGN.md` → "# v2.2 — output modes" |
| `rdw-scamshield-recall-check-v2` | v2.2 | `rdw-scamshield-recall-check-v2/DESIGN.md` → "# v2.2 — output modes" |
| `rdw-scamshield-tea2-corpcheck` | v1.2 | `rdw-scamshield-tea2-corpcheck/DESIGN.md` → "## v1.2 changes (2026-09-19) — output modes" |

---

## 2. Precedence — which setting wins

Three levers, evaluated in this order. Higher wins.

```
1. End user's in-chat choice   ("print full stages here" / "in chat" / "write the file" / "both")
        beats  ↓
2. Config file in the working directory   (<skill>.config.json → "output_mode")
        beats  ↓
3. Baked-in default in SKILL.md   (the Inputs bullet — editable by you, see §5)
```

- An in-chat override **sticks for the rest of the check** and is **noted in the report meta** (when a file exists).
- Absent config file or absent `"output_mode"` field → the baked-in default applies (`file`).
- Use exactly one of the three strings `"file"` / `"chat"` / `"both"`; anything else is undefined behavior.

---

## 3. Lever 1 — the config file (recommended for debug/production toggling)

Each skill reads its own config file **from the working directory** — the directory the agent session is running in when the skill triggers. No config file is shipped with any skill; you create it per environment.

| Skill | Config file | Fields |
|---|---|---|
| rdw-product-dig | `product-dig.config.json` | `output_mode` |
| rdw-scamshield-check-v2 | `scamshield-check.config.json` | `output_mode` |
| rdw-scamshield-recall-check-v2 | `recall-check.config.json` | `output_mode` **and** `overview_map` (pre-existing, independent) |
| rdw-scamshield-tea2-corpcheck | `corpcheck.config.json` | `output_mode` |

### Recipes

**Debugging session** (default behavior, nothing to create — or make it explicit):
```json
{ "output_mode": "file" }
```

**Production release** (full stages stream into the chat UI, no report files written):
```json
{ "output_mode": "chat" }
```

**Production with resume-safety** (full stages in chat *and* the report file maintained — use when sessions can be long or transcripts can be lost):
```json
{ "output_mode": "both" }
```

**Recall skill, production with the overview map** (two independent toggles in one file):
```json
{ "output_mode": "chat", "overview_map": true }
```
`overview_map` defaults ON during beta; set `"overview_map": false` to disable map rendering. The map is post-processing and is **unaffected by output mode**: map artifacts (`_map.html`, `_locations.csv`, `_locations.json`) are always written as files and linked from chat, even in `chat` mode. `chat` mode suppresses the *report* file only.

### Config file placement rules

- One config file controls one skill. If your app runs all four skills in the same working directory and you want the same mode everywhere, create all four files (`product-dig.config.json`, `scamshield-check.config.json`, `recall-check.config.json`, `corpcheck.config.json`).
- The file is read when a check starts; changing it mid-check does not retroactively change the active check (an in-chat override is the way to switch mid-check).
- Config files are environment artifacts, not skill artifacts — keep them out of the skill folders.

---

## 4. Lever 2 — the end user's in-chat choice

Every skill states the active mode **once at intake**, so the user always knows they can switch. The intake line reads (in spirit):

> *"Full report → file (default). Say 'in chat' to print full stages here, 'both' for both."*

- Recognized overrides are natural language: "in chat" / "print full stages here" → `chat`; "write the file" / "also write the file" → `file` (or adds a file to a `chat` run); "both" → `both`.
- The override sticks for the rest of the check and is noted in the report meta.
- The user can switch at any stage boundary.

**App note:** if your UI wants a dedicated toggle instead of relying on natural language, inject the choice as part of the triggering prompt (e.g. prefix the user's message with a system-set directive) — precedence level 1 still applies.

---

## 5. Lever 3 — editing the baked-in default (the "underlying prompt")

Each SKILL.md carries the default in **one Inputs bullet**. Editing that line changes the skill's permanent default with no config file needed. The bullet begins identically in all four skills:

```
- **Output mode** — `file` / `chat` / `both` (default `file`, from <skill>.config.json; editing the default in this bullet changes the skill's baked-in default). State the active mode once at intake …
```

Change `(default `file`, from …)` to `(default `chat`, from …)` (or `both`) in the **workspace copy** of the SKILL.md, then sync.

### Where the files live and how to sync

| Copy | Path |
|---|---|
| Workspace (source of truth — always edit here) | `D:\stuff\ai-misc\_bsh2026\vscode_project01\73-product_staged_research\<skill-name>\SKILL.md` |
| Installed (what actually runs) | `C:\Users\Cooly\.claude\skills\<skill-name>\SKILL.md` |

Sync command (run from the workspace root; copies and verifies):

```bash
cd "D:\stuff\ai-misc\_bsh2026\vscode_project01\73-product_staged_research"
for s in rdw-product-dig rdw-scamshield-check-v2 rdw-scamshield-recall-check-v2 rdw-scamshield-tea2-corpcheck; do
  mkdir -p "C:/Users/Cooly/.claude/skills/$s" && cp -r "$s/." "C:/Users/Cooly/.claude/skills/$s/" && diff -rq "$s" "C:/Users/Cooly/.claude/skills/$s" && echo "SYNC OK — $s"
done
```

> **Never edit only the installed copy.** The workspace is the source of truth; the next sync would silently revert an installed-only edit. Edit workspace → sync → verify (`SYNC OK` on every skill, `diff -rq` silent).

---

## 6. What mode-independent behavior to expect

These never change with output mode — safe assumptions for your app's parsing and UI:

- **Snap verdicts and register previews** (the fast Stage-½ responses) are identical in every mode. They are already complete responses; there is no hidden content to expand.
- **Safety rules, verdict discipline, rubrics, source hierarchies** are untouched by mode.
- **Gauge/coverage/verdict blocks are never truncated** to save space in `chat` mode — full content *adds* findings, it never drops the standing blocks (verdict box, coverage map, ripeness gauge, plan, command hint).
- **Scope-down single-fact asks** (product-dig's "does the 2024 Prius have a spare tire" class) have no stages and no mode.
- **Map artifacts** (recall skill) are always files; see §3.

---

## 7. What "full stage content" contains (for transcript parsing)

In `chat`/`both` mode, each stage response is, in order:

1. Stage banner
2. **Every finding recorded this stage** with its complete citation — finding + source + URL + date (publication or access, per skill) + check line/vein + ID mapping where one fits (T-ID in scamshield, DP-ID in corpcheck) + confidence tag — **no 3–6 finding cap**
3. Verdict box(es) — one per readout (recall renders two when applicable; corpcheck includes the balance readout)
4. Coverage map (or vein map in product-dig) with legend
5. Ripeness gauge with legend
6. **Stage ledger delta** — queries run this stage, new finding IDs, lead-pool changes. The cumulative ledger is *not* reprinted per stage; the full ledger rides the report file (or the final chat delivery at consolidation).
7. Plan + gate command hint

At consolidation in `chat`/`both` mode, the **full final report** is delivered in the chat response (in `chat` mode there is no file to link).

In `file` mode the stage response is the historical highlight summary and the report file carries sections in the order defined by each skill's output contract (see each SKILL.md).

---

## 8. Report file naming (when a file exists)

Default names, written to the working directory (the user can override the path at intake via the "Output location" input — distinct from output mode):

| Skill | Default file |
|---|---|
| rdw-product-dig | `product-dig_<slug>_<YYYY-MM-DD>.md` |
| rdw-scamshield-check-v2 | `scam-check_<slug>_<YYYY-MM-DD>.md` |
| rdw-scamshield-recall-check-v2 | `recall-check_<slug>_<YYYY-MM-DD>.md` (+ `_map.html`, `_locations.csv`, `_locations.json` when the map runs) |
| rdw-scamshield-tea2-corpcheck | `corp-check_<slug>_<YYYY-MM-DD>.md` |

Name collision → `-v2` suffix.

---

## 9. The `chat`-mode trade-off (read before choosing production defaults)

The report file is also the **state container**: the research ledger in its appendices is what lets a check resume after a session break. In `chat` mode there is no file, so **a mid-check session break cannot resume — the check restarts**. The skill surfaces this trade-off at intake when the user picks `chat`.

Guidance for the app:

- Short checks (most scam/recall checks end after Stage 1–2): `chat` is fine.
- Long multi-stage digs, or any deployment where the conversation transcript may not persist: prefer `both`. It costs one file write per stage and keeps resume capability.

---

## 10. Verification checklist (run when integrating or changing a default)

Adapted from the DESIGN.md testing notes (all currently **untested live**):

1. **Default unchanged:** run any check with no config file → behavior identical to the pre-feature skill (highlights in chat, file written).
2. **Config works:** create `<skill>.config.json` with `"output_mode": "chat"` → Stage-1 response carries every finding with full citations, no report file, consolidation delivered in chat.
3. **Recall two-field independence:** `{"output_mode": "chat", "overview_map": true}` → full stages in chat, no report file, map artifacts still written and linked at consolidation; `"no map this run" in chat still disables just the map.
4. **In-chat override:** with no config, say "in chat" → chat behavior for the rest of the check, noted in report meta (when a file exists).
5. **Mid-check file request:** in a `chat` run, say "write the file" → file appears/catches up at the next stage boundary.
6. **Snaps unchanged:** a snap-verdict input (e.g. an obvious phishing email) produces the identical ~10-line snap response in every mode.
7. **No truncation:** in a `chat`/`both` stage response, verdict box + coverage map + gauge + plan are all present — full content adds findings, never drops blocks.

---

## 11. Quick reference card

```
Mode values:        "file" (default) | "chat" | "both"
Config files:       product-dig.config.json · scamshield-check.config.json
                    recall-check.config.json (+overview_map) · corpcheck.config.json
Config location:    working directory of the agent session
Precedence:         in-chat choice > config file > SKILL.md Inputs-bullet default
Baked-in default:   one Inputs bullet per SKILL.md ("**Output mode** — …")
Edit workflow:      workspace SKILL.md → cp -r to ~/.claude/skills → diff -rq verify
Unaffected:         snap verdicts · register previews · map artifacts · safety rules · rubrics
chat-mode caveat:   no file → no ledger → mid-check session break restarts (use `both` if that matters)
```

*Authored 2026-09-19 after implementing output modes across all four skills (changelogs: product-dig DESIGN.md "Output modes", check-v2 v2.2, recall-check-v2 v2.2, corpcheck v1.2).*
