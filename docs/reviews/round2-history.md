# Round 2: historical accuracy review (2026-10-05)

Reviews the round-1 fixes (commit 901d045) and re-checks each page. m1, m2… = map number on the page. Sections are added as reviewers finish; a missing page range means that review has not been saved yet.

## Pages 1–12 (lexington-concord-bunker-hill … fort-washington)

Verdict: no ERROR; 1 INCONSISTENCY. All round-1 findings acted on are fixed correctly (E1–E2, I1–I6, U1–U3, N1–N12; N8 Lee ~600 m west of the Winter Hill works, acceptable). N13 (Canada start "Aug 1775") optional, not done.

### INCONSISTENCY
1. **dorchester-heights m1:** label "Nook's Hill" at [-71.0595, 42.3375], `anchor: 'end'` sits in South Bay water ~0.7 km west of the hill. Map 2 and gazetteer `nooks-hill` use [-71.0525, 42.3378] (B and W. Third Sts, South Boston). → use `'nooks-hill'`, `anchor: 'middle'`.

### UNMARKED-APPROX
2. **fort-washington m2:** note says crossing point and garrison's road west are approximate, but "garrison" (Fort Lee → New Bridge) and "Nov 19–20" (Philipse Manor → Lower Closter Landing) lack `approx: true`.

### NIT
3. siege-of-boston m1: "Howe's garrison" on a summer–autumn 1775 map; Gage commanded until Oct 10–11 → "British garrison" or "Gage's (later Howe's) garrison".
4. knox-noble-train: Lake George boat route crosses ~10 km of land at Tongue Mountain; [-73.560, 43.660] and [-73.655, 43.560] on land. → waypoints [-73.50,43.70],[-73.515,43.66],[-73.55,43.62],[-73.635,43.56],[-73.66,43.50]. ~3 km gap between Fort Ticonderoga and the route start; optionally a short La Chute march.
5. invasion-of-canada Valcour map: "night escape" line runs through the westernmost British ship [-73.437, 44.600]; the boats slipped between it and the shore → waypoint [-73.4382, 44.600] → [-73.4420, 44.600], or move the ship east.
6. new-york-defenses m1 (phone): Fort Greene, Fort Box, Oblong Redoubt dropped (`phone: false`) but caption item 2 names them.

## Pages 13–24 (retreat-across-new-jersey … newport-1778)

Verdict: 1 ERROR, 1 INCONSISTENCY (both one-line fixes), rest NITs. All 15 round-1 findings fixed correctly; new gazetteer entries (dunks-ferry, fort-george, mount-holly) check out; events.json entries match headers.

### ERROR
1. **trenton m1:** label "Delaware River" at [-74.952, 40.142] sits on Neshaminy Creek in Pennsylvania, ~18 km west of the Delaware (river ≈ −74.73 at that latitude). → ≈[-74.80, 40.10] angle ≈−30° (Bristol–Florence reach) or [-74.78, 40.17] angle ≈−60°; check screenshot.

### INCONSISTENCY
2. **monmouth m1 callout 3:** "cross at Coryell's Ferry, June 22–23" — army crossed June 20–21, last units in NJ by June 22 (Emerging Revolutionary War 2019/01/17) → "June 20–22".

### NIT / uncertain
3. delaware-forts-whitemarsh m1: caption "Nov 18–20 … galleys burned or slip upriver" vs arrow "galleys slip upriver, Nov 21"; PA galleys ran past the city night of Nov 19–20, Continental vessels burned Nov 21 → arrow "Nov 19–21", caption "Nov 18–21".
4. delaware-forts-whitemarsh m3: "A week later the army crossed the Schuylkill" — Howe back Dec 8, crossing at Swede's Ford ~Dec 12–13 → "Days later".
5. trenton m2: unnamed water ≈[-74.787, 40.233] (0.04 km²) shows as a wide band between Pennington and River roads — likely the D&R feeder canal (1830s); thin line along the PA bank maybe the Delaware Canal (uncertain) → `hideIn` boxes. Its "Delaware River" label sits on PA land (cosmetic).
6. delaware-forts-whitemarsh m1: modern impoundment pond in Tinicum marsh ≈[-75.273, 39.882], just outside `SPOIL_PONDS` box → widen west to −75.285.
7. monmouth m1: unnamed dot at [-74.514, 40.316] (Cranbury, a route stop) → label or drop.
8. monmouth m3: caption names "marshy Middle Brook"; only m2's note says stream names are modern → add the note or say "the West Morass".
9. saratoga m1 (optional): no arrow for the Ticonderoga → Skenesborough boat leg (Jul 6); "Jul 6–30" march starts at Skenesborough unlinked.

## Pages 25–36 (savannah … road-home-1783)

Verdict: 1 ERROR, several UNMARKED-APPROX (mostly missed in round 1); no INCONSISTENCY. Round-1 fixes correct: E1, I1–I3, P1–P2, N1, N3–N8, N10–N11 fixed; N9 (Maitland) partly (~450 m east of Spring Hill, acceptable); N2 (stony-point `washington: true`) kept by decision (Washington planned both raids and inspected Stony Point after its capture).

### ERROR
- **sullivan-expedition map-lakes, item 5 + Butler route:** "Both rejoin the army near Tioga" is wrong; Butler's route ends at Tioga [-76.50, 42.02]. The army was back at Fort Reed (Newtown/Kanawaholla, modern Elmira) Sep 24; Dearborn rejoined Sep 26, Butler Sep 28; Tioga only Sep 30 (JAR 2025/07; Hardenbergh journal; Early America Review). → "They rejoin the army at Fort Reed (Newtown) on Sep 26 and 28"; end Butler at ≈[-76.79, 42.10]; optionally extend Dearborn toward Catharine's Town/Newtown. Keep `approx`.

### UNMARKED-APPROX (note says approximate, moves solid)
- charleston-camden map-campaign: "Feb 11", "Cornwallis, June", "Gates", "flight to Charlotte".
- cowpens-guilford map-wilmington: "Mar 18 – Apr 7", "Greene".
- sullivan-expedition map-lakes: main march "Aug 26 – Sep 14", "return, Sep 16–30".
- savannah map-1778: "Baird" attack (swamp path approximate).
- savannah map-region: "Sept 12" (naval), "Sept 16" (French), "Lincoln, from Charleston".
- battle-of-the-capes map-after: all five tracks.
- Optional ("schematic" notes): stony-point map-assault columns; savannah map-assault (all but Dillon).

### NIT
- charleston-camden campaign: "Cornwallis, June" → "May–June" (left Charleston ~May 18, Camden ~Jun 1).
- arnold-treason map-ride: callout 2 (Fishkill, night of Sep 24) at [-74.04, 41.57] is west of the Hudson; Fishkill is at −73.899 → east bank.
- cowpens-guilford map-wilmington: "Arnold's force" [-77.27, 37.17] ~13 km SE of Petersburg; Arnold was at Petersburg (-77.40, 37.23) May 20 (optional).
- places.json `newtown-ny` holds the battlefield coords but is named "Newtown" → "Newtown battlefield".
