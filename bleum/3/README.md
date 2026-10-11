# DUKR ChronoSync: production folder

Static site, no build step. Drop this whole folder into your GitHub Pages repo.

## Deploy

1. Copy the contents of this folder to the repo root (served at `https://rayrite.github.io/`) or to a subfolder such as `chronosync/` (served at `https://rayrite.github.io/chronosync/`). All paths are relative, so either works.
2. Commit and push. Pages publishes in a minute or two.

Notes:
- Total size is about 50 MB. The four timeline files in `subjects/` are 1 to 21 MB each. GitHub warns above 50 MB per file and blocks above 100 MB per file, so keep each timeline under that.
- `.nojekyll` tells GitHub Pages to publish the files as they are.
- GitHub Pages is case-sensitive. Keep filenames exactly as written in `landing-config.js`.

## Everything you edit is in `landing-config.js`

- **Renamed or updated a timeline?** Put the new file in `subjects/` and change that subject's `file:` value.
- **Add a subject:** copy one block in `subjects[]`, then add the timeline file and a portrait image.
- **Backgrounds:** `background.mode` is `'random'` (new one on every reload) or a preset id to lock one. Switch individual presets on or off under `background.presets`.
- **Preview a preset:** add `?bg=aurora` to the page address (and `?label` to show its name).

## Files

| File | Purpose |
|---|---|
| `index.html` | The landing page (Orbit layout, random background) |
| `landing-config.js` | All text, filenames and background switches |
| `landing-core.js` | Shared runtime: routing, detail panel, settings |
| `landing-backgrounds.js` | The 12 background presets and the random picker |
| `assets/portraits/` | Subject portraits |
| `subjects/` | The timeline pages the menu links to |

## Photo credits

Portraits are from Wikimedia Commons and are credited in each subject's detail panel:
Beyoncé: Raph_PH, CC BY 2.0. Drake: GabboT (crop by UCinternational), CC BY-SA 2.0. Elon Musk: Gage Skidmore, CC BY-SA 4.0. Kendrick Lamar: Fuzheado, CC BY-SA 4.0. Keep the credits if you replace or crop the images.
