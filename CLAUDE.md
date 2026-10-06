# Washington's War, Mapped

A geographic companion to Chernow's *Washington: A Life* (Revolutionary War part). Live at https://marc345.github.io/washington/. GitHub Pages deploys every push to `main`.

Read first: `SPEC.md` (goals, rules, process), `docs/AUTHORING.md` (page/map authoring and the `HMap.render` schema), `data/events.json` (the 36 events in book order). `PLAN.md` holds the research notes.

## Status (2026-10-06)

- Process steps 1–3 of SPEC are done. All 36 event pages are built.
- **Review loop (SPEC steps 4–6): finished.** Four rounds were run (the maximum); reviews are in `docs/reviews/`, and `docs/reviews/final-report.md` lists what remains (cosmetic items and known data gaps only). Nothing is in progress.
- Stopping rule: repeat review → fix only while reviews find bugs, factual errors or inconsistencies. Cosmetic nitpicks alone don't trigger another round. Maximum 4 rounds, then report what remains.

## Done in round 1 (library, see docs/AUTHORING.md)

Phone-scaled label offsets; per-item `ph` / `phone: false` and top-level `ph`; built-in marsh; corrections by URL (water/land/marsh/coast/baseLand); `preset: 'ny1776'`; seamless water; labels kept off the north arrow and scale box; path labels slide/extend; HQ/fort legend entries; `rivers.major`; move `flip: false`. Build tool: James River (Natural Earth calls it "Cowpasture") and the US/Canada land seam (dissolve2 + gap fill).

## Known open items

- `data/geo/new-york-defenses-1776.json` (generator `tools/geo/ny-shoreline-1776.mjs`): Brooklyn Navy Yard basin, modern piers, Hunts Point/Randalls/Wards fill, Hoboken–Weehawken pier tips (road-home-1783 patches these locally), straight-edged Manhattan outline.
- Lake George is missing from campaign-scale lakes (saratoga adds it as a correction).
- Modern Maine–Quebec border in base land; the Quebec map has a stray river stub.

Build tool (`tools/geo/build.mjs`): "Playland Lk" in TIGER is a mislabelled piece of Long Island Sound, so never hide it by name. River centrelines for the Hudson, East and Harlem rivers appear in the streams layer (the `ny1776` preset hides them).

## Working conventions

- Pages are plain HTML with no build step. Generated geography in `data/geo/` is committed.
- Screenshots: `node tools/shot.mjs <scratch-dir> events/<id>.html …` (desktop and phone PNGs, plus console and overflow report). `SHOT_MAPS=1` adds one PNG per map; `SHOT_OFFLINE=1` skips blocked tiles/fonts; `CHROMIUM_PATH=/opt/pw-browsers/chromium` uses the preinstalled browser. Look at the PNGs.
- Subagents editing pages in parallel must not touch shared files (`assets/`, `data/*.json`, `tools/*.mjs`, `docs/`); they report requests back to the coordinator.
- Each agent keeps its helper scripts in its own scratch subdirectory.
- No narrative text on pages, no quotes from the book. Mark approximate positions.

## Cloud environment notes

`npm install` then `npx playwright install chromium` (needed for `tools/shot.mjs`), or set `CHROMIUM_PATH` to a preinstalled Chromium. Geo builds download from `www2.census.gov`, `naciscdn.org` and `s3.amazonaws.com` (elevation tiles). If the environment's network allowlist blocks these, use Full network access or add the domains. Pages load Google Fonts and Esri tiles at runtime, but screenshots still work without them.
