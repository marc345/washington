# Washington's War, Mapped

A geographic companion to Ron Chernow's *Washington: A Life*: static maps of the battles, marches and campaigns of the Revolutionary War, as described in the book.

- `index.html`: interactive overview map with every event
- `events/*.html`: one page per event, each with static period maps
- `SPEC.md` (goals and conventions), `docs/AUTHORING.md` (how pages are built)

The site is plain HTML/JS with no build step. To run it locally: `npm install && npm run serve`, then open http://localhost:8080.
Map geography is generated with `node tools/geo/build.mjs tools/geo/maps/<event>.json` (US Census TIGER, Natural Earth, AWS Terrain Tiles).
