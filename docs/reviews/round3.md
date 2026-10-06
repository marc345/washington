# Round 3: combined visual + historical review (2026-10-06)

Three reviewers, each checking visuals (every map at 1280 px and 390 px) and the history of the round-2 changes for one page range. m1, m2… = map number. A missing page range means that review has not been saved yet.

## Pages 13–24 (retreat-across-new-jersey … newport-1778)

Verdict: 2 BUGs, no history ERRORs. No console/HTTP/overflow errors. All round-2 BUGs and the history ERROR/INCONSISTENCY are fixed; round-2 text and position changes verified (Trenton river labels, Monmouth dates, Delaware forts galley dates, Germantown wings, Saratoga Jul 6 leg, Princeton retreats, Lacey at Crooked Billet, Fort Nonsense, Sandy Hollow).

### BUG
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

