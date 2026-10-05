# Round 2: visual / UX review (2026-10-05)

Reviews the round-1 fixes (commit 901d045) at 1280 px and 390 px. m1, m2… = map number on the page. Sections are added as reviewers finish; a missing page range means that review has not been saved yet.

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

