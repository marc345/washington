# Round 3: combined visual + historical review (2026-10-06)

Three reviewers, each checking visuals (every map at 1280 px and 390 px) and the history of the round-2 changes for one page range. m1, m2… = map number. A missing page range means that review has not been saved yet.

## Index + pages 1–12 (lexington-concord-bunker-hill … fort-washington)

Verdict: no BUGs/ERRORs. No console/HTTP errors; overview pins checked at four zooms and both widths (no overlaps, none under attribution/zoom control). All round-2 visual BUGs and history findings fixed with no regressions; round-2 changes (Fort Lee, Lake George, Morris Island, Fort Johnson, Haddrell's Point, Nook's Hill, siege forts, Valcour ships, new unit labels, approx flags) verified.

### NIT
- index: default-zoom pin "2·8·9 +15" holds 18 events (Ride to Cambridge folded into NY group); all cards reachable, splits on zoom; wide pins ~5 px off-centre.
- lexington: phone m3 arrowheads/swords mostly cover the redoubt; phone m2 "Percy, from 9 a.m." touches "Roxbury".
- siege-of-boston m1: red block on Bunker Hill unlabelled; "Charles River" on land west of the river.
- invasion-of-canada: m1 "L. Megantic" ~50 units NW of the lake; phone m2 Montgomery arrowhead touches "Près-de-Ville"; phone m3 north arrow touches "Quebec"; phone m4 escape arrowhead touches the "to Split Rock…" note.
- knox m1: "Lake George" label on land west of the lake.
- dorchester m1: desktop "Dorchester Heights" half over water; phone stars touch arrowheads.
- charleston m1 desktop: thin straight sliver of old outline inside Morris Island, tiny spike at its north tip.
- new-york-defenses m2 phone: Fort Constitution and Fort Washington stars touch; "Fort Washington" label centred under the pair crossing the Hudson → anchor start right of its star.
- long-island m3: "Mifflin" and "covering force" blocks vs caption "Mifflin's covering force" read as two forces → relabel or merge. m1 Jamaica Bay fill/basins remain.
- kips-bay: m1 desktop militia block covers part of "Kip's Bay", "Conn. militia" in the river; phone m1 militia label ~70 units below its block; m2 Knowlton route through "Hollow Way".
- white-plains m1 phone: Fort Lee and Ft. Washington stars half over water.

## Pages 13–24 (retreat-across-new-jersey … newport-1778)

Verdict: 2 BUGs, no history ERRORs. No console/HTTP/overflow errors. All round-2 BUGs and the history ERROR/INCONSISTENCY are fixed; round-2 text and position changes verified (Trenton river labels, Monmouth dates, Delaware forts galley dates, Germantown wings, Saratoga Jul 6 leg, Princeton retreats, Lacey at Crooked Billet, Fort Nonsense, Sandy Hollow).

### BUG (both fixed by the coordinator in the same round)
1. **retreat-across-new-jersey m3 phone:** scale box covers most of the "River line guarded by Washington" shading → `ph: { scale: 'bottom-right' }`.
2. **newport-1778 m1 (both):** French "into the bay, Aug 8" track crosses Brenton's Neck (point [-71.355, 41.462] on land) → route up the East Passage.

### NIT
- retreat: phone m3 "Lee taken away" touches "Basking Ridge", callout 1 touches "King's Ferry"; phone m1 route under scale box below Newark; m2 route through "New Brunswick".
- princeton: phone m2 "Jan3" spacing on the curve.
- morristown-1777: m2 Great Swamp shading over "Basking Ridge"; phone m1 callout 5 touches Bound Brook swords.
- howe: phone m1 Aug 15–25 track crosses "Chesapeake Bay".
- brandywine: phone m1 Wayne block butts "Chadds Ford".
- philadelphia-germantown: phone m1 Paoli/Clouds swords over Wayne block, "Sep 26" touches callout 5; phone m2 "batteries" touches State House; m3 easternmost red unit unlabelled, swords on Cliveden.
- saratoga: phone m1 Oriskany swords ~5 km east of desktop position; phone m4 "Schuyler's house" onto the river.
- delaware-forts: phone m1 "Oct 1–2 · Nov 18" touches "Chester", callout 3 touches "Billingsport"; phone m3 callout 1 on "Wissahickon Cr." and Chestnut Hill swords, Dec 6–7 arrowhead on Edge Hill swords; caption item 3 double "and".
- monmouth: m1 desktop road through "Clinton, June 18–26"; phone m1 "Delaware R." × "Crosswicks"; phone m2 callout 3 covers "fl" of "flank move"; phone m3 "American guns" under Lafayette block.
- trenton: m1 chevron mounds (modern fill, elevation data); phone m2 "Knox's guns" touches Greene's arrowhead.

