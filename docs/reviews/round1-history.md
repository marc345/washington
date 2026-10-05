# Round 1: historical accuracy review (2026-10-05)

Three reviewers, checked against NPS, American Battlefield Trust, Journal of the American Revolution, Mount Vernon and similar sources (Wikipedia fetches were blocked). m1, m2… = map number on the page.

## Pages 1–12 (lexington-concord-bunker-hill … fort-washington)

Dates, times, commanders, units, numbers and sequences almost all correct; no book quotes; Washington flags correct for all 12. Wikipedia/allthingsliberty fetch blocked; checked via search snippets.

### ERROR
- **E1 kips-bay-harlem-heights, map-landing:** Putnam's escape route from ~86th St to the arrowhead lies on/beyond the 1776 shoreline, arrowhead in the Hudson (`[-73.9890,40.7760] … [-73.9545,40.8240]`). → shift 0.004–0.008° east, e.g. `[-73.9850,40.776],[-73.976,40.79],[-73.9665,40.802],[-73.956,40.815],[-73.950,40.823]`, ending inside the American lines.
- **E2 white-plains, map-westchester:** "Magaw" unit `[-73.9180, 40.8510]` is on the Bronx side of the Harlem River (river ≈ −73.928 here); garrison was on Manhattan. → `[-73.9345, 40.8560]`.

### INCONSISTENCY
- **I1 charleston-1776:** header "June 1–28, 1776" vs events.json "Jun 28, 1776". Content covers fleet arrival Jun 1 and bar crossing Jun 7–10 → events.json `dates: "Jun 1–28, 1776"`, `start: "1776-06-01"`.
- **I2 kips-bay map-landing:** caption "five warships" bombarded Kip's Bay; map shows three there and two in the Hudson. Bombardment: Roebuck, Phoenix, Orpheus, Carysfort, Rose; separate Hudson diversion: Renown, Repulse, Pearl, schooner Tryal. → five ships at Kip's Bay; Hudson group of three separately, or drop it.
- **I3 white-plains:** header/events.json Oct 12–28, but map 1 titled "October 12 – November 1" and draws a "Nov 4–5" move → align.
- **I4 dorchester-heights map-night:** caption "two nights of diversionary bombardment" vs item 1/legend "March 2–4"; cover fire ran three nights (NPS) → "three nights".
- **I5 events.json long-island summary:** "Two nights later the army escapes" — flank march night Aug 26–27, escape Aug 29–30 → "three nights later".
- **I6 siege-of-boston callout 3 (uncertain):** caption says Boston Neck lines "a mile and a half apart"; map draws ~1 mile → "about a mile apart" or drop.

### UNMARKED-APPROX
- **U1 ride-to-cambridge:** route lacks `approx: true` though note calls it approximate (sources differ on CT stop dates, e.g. Hartford Jun 29 vs 30).
- **U2 knox-noble-train:** main overland leg lacks `approx: true` though caption says roads approximate.
- **U3 white-plains:** "Washington, Oct 17–23" and "Howe, Oct 19–28" marches solid though note says approximate.

### NIT
- N1 knox "Albany, Dec 26 – Jan 9": Knox reached Albany Dec 27; crossing Jan 7–9 → "late Dec – Jan 9".
- N2 Lexington item 3: Revere reached Lexington ~midnight, Dawes ~30 min later; left for Concord ~1 a.m.
- N3 "× Revere captured" label centred ~0.5 mi south of the capture site (≈42.449, −71.276).
- N4 Bunker Hill caption has 4 sentences (rule 1–3).
- N5 new-york-defenses fleet map: "Fort Lee" was Fort Constitution in Jun–Aug 1776 (renamed October).
- N6 ride-to-cambridge: route ends at the Battery; party landed at Lispenard's, north of town.
- N7 Harlem Heights map: "Knowlton, dawn" route starts `[-73.958, 40.8225]` on the Hudson shore, partly in water.
- N8 siege-of-boston: "Lee (left wing)" `[-71.115, 42.389]` west of Prospect Hill → nearer Prospect/Winter Hill works.
- N9 charleston-1776: Thomson `side: 'militia'`; 3rd SC Rangers were provincial regulars → `continental` (optional).
- N10 places.json `chambly` ~1.4 km west of the fort → `[-73.2755, 45.4486]`.
- N11 places.json `roxbury` east of meetinghouse → ≈ `[-71.095, 42.3306]` (pages already override).
- N12 events.json `ride-to-cambridge` coords `[-73.0, 41.5]` off the route → New Haven or Hartford.
- N13 events.json `invasion-of-canada`: Montgomery moved late Aug 1775 → "Aug 1775 – Oct 1776" (optional).

## Pages 13–24 (retreat-across-new-jersey … newport-1778)

events.json entries (dates, coords, washington flags) correct; all used places within a few hundred metres; no quotes, no narrative. morristown-1777 and brandywine: no findings.

### ERROR
1. **trenton map 1 item 1:** "crossing from about 11 p.m. to 3 a.m." — crossing began at dusk (Stephen's brigade over ~7 p.m.), last troops ~3–3:30 a.m. → "from about 6–7 p.m. until after 3 a.m." (washingtoncrossingpark.org/what-time-did-washington-cross/)
2. **trenton map 1:** `Donop` unit at Bordentown; on Dec 26 Donop and most of his force were at Mount Holly (drawn there Dec 22–23). → relabel "Donop's posts" + note, or arrow "to Mount Holly". (battlefields.org mount-holly; allthingsliberty 2019/12 Woodlane)
3. **trenton map 1:** Cadwalader arrow runs along the PA shore toward Bristol, never crosses. → draw from near Dunk's Ferry (below Bristol) to the NJ bank.
4. **newport-1778 map 1 item 1:** puts frigates entering passages and British ship burnings on Jul 29; fleet only arrived that day. Sakonnet entry/burnings Jul 30; western-passage frigates scuttled Aug 5 → "Jul 30 – Aug 5: …".

### INCONSISTENCY
5. **valley-forge map 1:** caption "about 20 miles" vs label "about 18 miles" → 18 both (NPS).
6. **trenton map 2:** Assunpink Creek label and "Assunpink bridge" but no creek drawn; bridge on dry ground → reuse princeton.html `ASSUNPINK_LOWER`.
7. **monmouth map 3:** caption Combs Hill "about 3:45 p.m." vs map's only time label "4:45 p.m." near the parsonage → clarify/align.

### UNMARKED-APPROX
8. **howe-to-the-chesapeake map 1:** "Jul–Aug" arrow straight Middlebrook → Coryell's Ferry → Neshaminy omits the July march toward the Highlands and the Germantown stop → `approx: true` + note.

### NIT / uncertain
9. delaware-forts-whitemarsh map 2 (uncertain): Donop attacked "north and east faces" of Fort Mercer — most accounts: north and south sides, galleys raking the southern column (thelibertytrail.org red-bank).
10. delaware-forts-whitemarsh map 2: Mud Island renders joined to Hog Island and a large landmass toward the Schuylkill mouth (modern fill). Outlines already marked approximate.
11. philadelphia-germantown map 2: "to Fort Mifflin, 5 mi" label sits ~3.7 mi from the fort; fort ~6 mi from city → drop or correct.
12. saratoga map 1: Lake George naval line continues by water to Fort Edward; Fort George → Fort Edward was a road portage → end naval move at Fort George + short march.
13. monmouth map 1 (uncertain): "about 17,000 troops" — sources ~10,000–20,000 → "estimates vary".
14. retreat-across-new-jersey map 1: inline "Closter landing" ~1.3 km north of gazetteer `lower-closter-landing` → use the place id.
15. newport-1778 map 1: "into the bay, Aug 8" line grazes Brenton Point → nudge waypoint `[-71.375, 41.44]` west.

## Pages 25–36 (savannah … road-home-1783)

Overall accurate: dates, commanders, sequences and unit placements check out almost everywhere. No Chernow quotes; every map has an approx note. Wikipedia was blocked; facts checked via battlefields.org, mountvernon.org, washingtonpapers.org and similar.

### ERROR
- **E1 arnold-treason, events.json summary:** "hours before Washington arrives" is wrong. Arnold got Jameson's note at breakfast (~10 a.m.) and left moments before Washington arrived; the page itself says "shortly after Arnold had gone". → "just before Washington arrives". (emergingrevolutionarywar.org 2020-09-25; newenglandhistoricalsociety.com)

### INCONSISTENCY
- **I1 sullivan-expedition:** header "June – October 1779" vs events.json "Jun – Sep 1779". Army reached Easton Oct 15 → events.json "Jun – Oct 1779".
- **I2 charleston-camden:** header "February – October 1780" vs events.json "Mar – Oct 1780" (start 1780-03-29). Page shows the Feb 11 landing → events.json "Feb – Oct 1780" (check sort order if `start` changes).
- **I3 stony-point, Paulus Hook map:** caption item 3: no boats at Dow's Ferry, marched back "along the ridge". Drawn withdrawal never goes to Dow's Ferry and runs along the Hudson bank. → route west to the ferry, then north along the Bergen road (approx).

### Position errors
- **P1 charleston-camden campaign map:** Waxhaws marker [-80.670, 34.800] is ~7 km from Buford's Massacre site ~[-80.626, 34.741] (hmdb.org/m.asp?m=95555). Minor at this scale.
- **P2 places.json `stony-point`:** [-73.968, 41.241] sits east of the fort, possibly at the water's edge. Fort ≈ [-73.9725, 41.2412] (as the assault map draws).

### NIT / uncertain
1. stony-point "some 550 … taken prisoner": British report 472 captured + 58 missing; others 543 → "about 470–540".
2. stony-point `washington: true`: Washington planned both raids but was at neither (uncertain; flag-rule decision).
3. stony-point Dow's Ferry [-74.09, 40.758] maybe ~2.5 km too far north; local histories ≈ lat 40.735 (uncertain).
4. arnold-treason: Arnold's flight drawn in Continental colour on two maps; `british` or `neutral` reads better. "Sept 18–25" route merges out/return legs (caption explains).
5. virginia-1781 raids map: "from Portsmouth" arrow label wrong for January (Arnold came from Hampton Roads).
6. virginia-1781 chase map: callouts out of date order (1 = Jun 10, 2 = Jun 4–5) → swap.
7. virginia-1781 Green Spring (uncertain): "Lafayette watches" understates; he came forward, horse reportedly shot under him.
8. cowpens-guilford Wilmington map: "Phillips & Arnold" unit wrong for May 20 (Phillips died May 13); also placed near Jamestown, not Petersburg.
9. savannah assault map: "Maitland" unit mid-line; he commanded the British right at Spring Hill → move west.
10. sullivan-expedition lakes map: `newtown-ny` is the battlefield but labelled as the destroyed town; village near Elmira ≈ [-76.80, 42.09].
11. Caption length: cowpens-guilford "race to the Dan" caption (4 sentences + second paragraph) breaks the 1–3 rule; virginia-1781 raids caption borderline.
