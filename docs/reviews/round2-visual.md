# Round 2: visual / UX review (2026-10-05)

Reviews the round-1 fixes (commit 901d045) at 1280 px and 390 px. m1, m2… = map number on the page. Sections are added as reviewers finish; a missing page range means that review has not been saved yet.

## Index + pages 1–12 (lexington-concord-bunker-hill … fort-washington)

Verdict: BUGs remain (Fort Lee drawn in the Hudson on two pages; Savannah marker untappable on phones; phone collisions; symbols under the scale box). Clean: no console/HTTP errors or overflow; links and prev/next OK; captions, callouts, approx notes, headers OK. Most round-1 BUGs fixed (library scale text, phone offsets, phone drops, furniture avoidance, ship rows; overview view and grouping; per-page items).

### Round-1 not fixed
- charleston-1776: Morris Island still a straight-edged wedge/spike (m1; sliver bottom-left of m2); Fort Johnson shore ruler-straight.
- invasion-of-canada m2 (Quebec): stray straight river stub in the St. Charles estuary.
- lexington m3, siege-of-boston m2: "Charlestown Neck" labelled on the mainland.
- NYC maps: Jamaica Bay basins, Floyd Bennett Field (new-york-defenses m2, long-island m1); Meadowlands ditches (kips-bay m1, fort-washington m2); Randall's/Wards Island, Bronx Kill (kips-bay m1).
- Legend: no entry for ships or `works` redoubt stars.

### BUG
1. **white-plains m1, fort-washington m2 (both):** Fort Lee star in the Hudson (gazetteer [-73.961, 40.851] at the cliff edge; river wider on coarse maps). white-plains m1 desktop: "Fort Washington" label under Fort Lee, wrong side of the river; phone "Fort Lee" through its own star. → places.json Fort Lee ≈[-73.967, 40.851] or per-map override; Fort Washington label east of its star.
2. **index.html phone:** #25 Savannah marker under the Leaflet attribution, untappable. → bottom padding in `fitBounds` or smaller attribution.
3. **index.html (both):** merged markers overlap ("2·11" × "8·9·10 +9"; "32·35" × "34"); merged marker sits at first event's position ("2·11" shows White Plains at New Haven). → place at mean position; group by marker size.
4. **invasion-of-canada m3 phone:** scale box covers Crown Point star and both arrowheads → `ph: { scale: 'top-left' }`.
5. **invasion-of-canada m2 (Quebec, both):** Lower Town barely land; "Lower Town" label in the St. Lawrence; Montgomery's retreat (unlabelled dashed blue) entirely in the river. → narrow shore strip under the cliff; label and retreat on land.
6. **charleston-1776 m1 phone:** "MORRIS ISLAND" × "SULLIVAN'S ISLAND" at the harbor mouth; "June 28" through "SULLIVAN'S ISLAND".
7. **kips-bay-harlem-heights m1 phone:** rotated "Harlem River" through "Harlem".
8. **long-island m2 phone:** "Miles" × "Howe, 8–9 a.m."; "Hessians" onto Flatbush dot/label beside callout 3.
9. **long-island m1 phone:** "Gowanus P." × "Upper Bay".
10. **knox-noble-train m1 phone:** "MASSACHUSETTS" in VT/NH (lat 42.85; border ≈42.7) → lat ≤ 42.45.
11. **Unlabelled units:** long-island m1 (blue at Gowanus Pass), m3 (blue by Fort Box), m2 desktop (red at Old Stone House); white-plains m2 (militia on Chatterton's Hill).

### NIT
- lexington m2 phone: "Percy and Smith" arrowhead covers "Charlestown". m3 phone: Stark and Knowlton blocks merge; desktop long modern-looking pier bottom-right of Boston.
- siege-of-boston: unlabelled forts (Back Bay shore stars, red Copp's Hill star); phone "Winter Hill"/"Prospect Hill" over their works; m2 phone arrowheads cover Lechmere Point star.
- ride-to-cambridge phone: "R.I." in Massachusetts; "Hudson R." touches "NEW JERSEY" and callout 1; route crosses "New Brunswick".
- invasion-of-canada: m1 "L. Megantic" ~80 units from the lake, phone on Arnold's route; m1 phone "Richelieu R." and Montgomery route cross "PROVINCE OF QUEBEC"; m2 phone "Cape Diamond" on "UPPER TOWN", "Montgomery killed" touches river label; m3 about half empty; m4 night-escape line through westernmost British ship, callout 1 far from Royal Savage.
- dorchester-heights: m1 "Nook's Hill" in water; m1 phone callout 2 clips "Thomas, from 7 p.m.", stars merge with arrowheads; m2 callout 3 in Back Bay not on Boston Neck, troop arrow crosses water; m2 phone callout 1 touches "Dorchester Heights".
- charleston-1776: Haddrell's Point dot in water; m2 phone "SULLIVAN'S ISLAND" touches the fort.
- new-york-defenses m1: rectangular modern basin top-right; rail-cut lines in Jersey City top-left; phone "Gowanus marsh" under creek line.
- long-island m1 phone: "HEIGHTS OF GUAN" spills off the ridge.
- kips-bay m2: phone "Knowlton" and "feint." cramped, callout 3 on flank arrow; "Hollow Way" half in the river; step artefact on NJ shore.
- white-plains m1 phone: "Kingsbridge" touches "Glover"; "Chatterton's Hill" touches Washington's arrowhead.
- fort-washington m1: Marble Hill land patch (shared ny-shoreline-1776) a crude straight-edged block across Spuyten Duyvil Creek; Inwood marsh patches hard-edged.

### Library (hmap.js, index.html)
- Furniture still hides symbols/arrowheads/works (only labels avoid it) → warn, or move scale per map.
- Callouts not kept off labels (dorchester m1–m2 phone, kips-bay m2 phone).
- Legend gaps: ships, `works` redoubt stars, callouts.
- Overview grouping: see BUG 2–3.

## Pages 13–24 (retreat-across-new-jersey … newport-1778)

Verdict: BUGs remain (one library cause, one anachronism, misplaced labels, phone collisions). Clean: no console errors/overflow, links and prev/next OK, captions 1–3 sentences, approx notes present, structure matches trenton.html, scale-bar text fixed.

### Library (hmap.js)
1. **BUG keep-inside clamp pushes labels onto their own symbol** (`keepLabelsInside`): philadelphia-germantown m1 desktop "Philadelphia" on its square; delaware-forts m3 phone square inside "Philadelphia"; monmouth m1 phone Philadelphia square hidden; brandywine m1 phone "Stirling, Stephen" over its unit. → flip anchor to the other side of the symbol, or treat the own symbol as an obstacle.
2. NIT callout circles grow on phones onto swords/labels: morristown-1777 m1 (3, 4, 5 on swords); valley-forge m1 (1 on Crooked Billet swords); delaware-forts m3 (1 on "Wissahickon"), m1 (3 on "Billingsport").

### Round-1 findings not / partly fixed
- **monmouth m1 BUG (both):** "Clinton, June 18–26" runs into "Mount Holly" → `labelAt` ≈0.3 or shorter.
- princeton m1 phone: "Pennsylvania militia" unit covers "to Bordentown".
- **newport-1778 m1 BUG (both):** "Newport" label west of its square in the channel, both French tracks through it → `dx: 9` right/below.
- newport-1778 m2 phone: "Aug 15" touches "East Road".
- delaware-forts m2 phone: "Nov 15–16" route through "Fort Mifflin".
- delaware-forts m1–2 anachronism NIT: spoil-basin ponds below Billingsport, ditch grid bottom-left (m1); NJ-shore mounds, straight basin at Woodbury Creek (m2); `PHL_WATERFRONT`/`NJ_WATERFRONT` give ruler-straight banks.
- saratoga m2 NIT: callout 1 ~1 km south of Freeman's farm in empty ground.
- philadelphia-germantown m1 phone: crowded at Paoli; swords + red arrowheads on unlabelled Wayne unit; "feint" dropped.

### New, per page
- **trenton:** BUG m1 "Delaware River" on Neshaminy Creek (−74.952, 40.142) → ≈(−74.84, 40.13). NIT m2 "Delaware River" on PA bank beside a thin line (Delaware Canal?), unlabelled NJ water strip (D&R feeder?); m2 phone "King St." clipped by Knyphausen; m1 chevron mounds south of Trenton (modern fill?).
- **retreat-across-new-jersey:** NIT m2 date labels break up on the wiggly post-road ("ov 28–29", "D e c") → `straight: true`/smoother; m3 phone "Lee taken away" × "Basking Ridge"; m1 phone "Closter Landing" vs "Lower Closter Landing".
- **princeton:** NIT m2 "Cornwallis returns, Jan 3" struck by road; phone "Assunpink Creek" × night-march route. NIT m3 unlabelled red dashed retreat under north arrow.
- **morristown-1777:** BUG m2 gold HQ star (callout 1) nearly hidden under Fort Nonsense star; callout 2 beside Loantaka, not the fort → offset fort star SW of the Green, move callout 2. NIT m2 "Great Swamp" covers Basking Ridge.
- **howe-to-the-chesapeake:** NIT m2 desktop "Head of Elk" crossed by Howe's route; m1 phone Aug 15–25 arrowhead under "Head of Elk", Jul 23–30 track × "NEW JERSEY".
- **brandywine:** BUG m2 phone "Birmingham Meeting House" struck by Guards and Grenadiers arrows, arrowhead on its cross. NIT m2 two unlabelled swords, callout 1 far west, phone "Birmingham Rd" cut at top; m1 "Great Road" under Knyphausen's route.
- **philadelphia-germantown:** BUG m2 anachronism: comb piers at Port Richmond/Kensington and Camden side; `PERIOD` covers only central waterfront → extend north to ≈39.985. BUG m2 phone "Sep 27", "Delaware River", callout 2 pile up. NIT m2 unlabelled red unit N of Germantown, unlabelled redoubt star; m3 desktop "Sullivan, Wayne, Washingto" cut; m3 unlabelled Hessian and far-right red units; phone "Knyphausen" reads as Hessian label, Jäger touches scale box.
- **saratoga:** BUG m3 "Arnold" unreadable, British retreat path on top → offset path or `labelAt` ≈0.8. BUG m1 phone Oriskany swords on Fort Stanwix star; callout 3 on "NEW HAMPSHIRE"; "St. Clair" cut by Hubbardton swords. NIT m1 desktop St. Clair route through "Fort Edward"; m2 phone Hamilton arrowhead on "Freeman farm", "Gates" × "Bemis Heights"; m3 works line through "Balcarres redoubt".
- **delaware-forts-whitemarsh:** BUG m3 phone "Philadelphia" on its square (lib 1). NIT m3 phone Howe's route through "Germantown", Edge Hill swords/callout 2/arrowhead overlap; m1 phone Donop route × "(Red Bank)", "Cooper's Ferry".
- **valley-forge:** BUG m1 phone "Delaware River" over "Darby". NIT m1 unlabelled militia unit at Crooked Billet; m2 legend lacks the blue redoubt stars on the lines; phone "Muhlenberg, Weedon" × "Mass. & N.H. brigades".
- **monmouth:** BUG m1 phone callout 1 on "Haddonfield"; "Crosswicks" × "Allentown" (dot hidden); Clinton route × "Philadelphia". BUG m2 phone swords cover "Wayne"; "to Middletown" dropped, arrowhead to frame edge. NIT m3 unlabelled artillery on Perrine's Hill; green dotted line legend check; m1 route through "Hopewell", "Kingston" (desktop), "Coryell's Ferry" (phone).
- **newport-1778:** NIT m1 French tracks × "Sakonnet R.", phone Sullivan arrow × "Aquidneck I."; m2 works line × "Tonomy Hill", unlabelled Hessian and militia units.

### Consistency (NIT)
- Unlabelled units on many pages vs trenton.html labelling every unit: philadelphia m1–m3, saratoga m3, valley-forge m1, monmouth m3, newport m2 → label or use callouts consistently.
- Shortened phone labels lose information: trenton m1 drops "Donop"; howe m2 drops "Sep 6–8".

