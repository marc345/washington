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
