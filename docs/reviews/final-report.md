# Review loop: final report (2026-10-06)

Four review rounds were run (the SPEC maximum): `round1-*.md`, `round2-*.md`, `round3.md`, `round4.md`.

| Round | Found | Status |
|---|---|---|
| 1 | Many phone label collisions, broken overview markers; 7 factual errors, ~15 inconsistencies | All fixed (library rework + all 36 pages) |
| 2 | Phone collisions, anachronistic shorelines, Fort Lee in the Hudson; 2 errors, 2 inconsistencies | All fixed |
| 3 | 5 bugs (labels, routes on land, a scale box covering content); no factual errors | All fixed |
| 4 | 2 bugs (routes on land) on the 5 pages changed after round 3; no factual errors | Both fixed; routes re-checked against the map geometry |

The round-4 fixes themselves were checked by screenshot and land/water test but not by a further independent review (the SPEC caps the loop at four rounds).

## What remains

All remaining items are cosmetic (NIT): they lose no information.

- **Phone label crowding:** small touches between labels, callouts and arrowheads, listed per page in `round3.md` and `round4.md`.
- **Unlabelled units:** a few remain where the place label next to them identifies them (e.g. the red block on Bunker Hill, siege-of-boston m1; the easternmost red unit, philadelphia-germantown m3).
- **Modern geography still visible:**
  - Meadowlands creeks that are partly natural but have straightened ditch stretches (Bellmans, Cromakill, Wolf, Mill creeks); hiding them would hide real creeks.
  - Railroad cuts through Bergen Hill in Jersey City and chevron-shaped fill south of Trenton: both come from the elevation data, which pages can't mask.
  - Newtown Creek turning basins; the Rockaway spit's modern western extent (its 1776 tip couldn't be confirmed).
  - The modern Maine–Quebec border in the base land data.
  - Ruler-straight hand-drawn waterfront rings at Philadelphia/Camden (piers removed, outline simplified).
- **Data gaps:** Lake George is missing from campaign-scale lakes (saratoga and knox-noble-train each carry a copy of the outline).
- **Overview map:** at the default zoom one pin groups 18 events around New York; it splits on zoom and every event card is reachable.

## Possible follow-ups (not bugs)
- Library: keep callouts off labels automatically (callouts are placed by hand now).
- Build tool: add Lake George to campaign-scale lakes; smooth elevation artefacts (rail cuts, fill).
- Shared NY 1776 file: Newtown Creek basins, Rockaway spit.
