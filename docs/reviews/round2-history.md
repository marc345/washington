# Round 2: historical accuracy review (2026-10-05)

Reviews the round-1 fixes (commit 901d045) and re-checks each page. m1, m2… = map number on the page. Sections are added as reviewers finish; a missing page range means that review has not been saved yet.

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
