# Round 4 (final): combined visual + historical review (2026-10-06)

Scope: the five pages changed after the round-3 review (newport-1778, retreat-across-new-jersey, arnold-treason, sullivan-expedition, cowpens-guilford). Every other page passed round 3 with no open bugs. Maps read at 1280 px and 390 px; routes checked against each map's own land/water geometry with a point-in-polygon script.

Verdict: 2 BUGs (both routes on land), no history ERROR/INCONSISTENCY. Three of the five round-3 BUGs were fully fixed (retreat m3 scale box, cowpens m1 skirmishers, sullivan m2 Sullivan Hill); the other two were partly fixed.

### BUG (both fixed by the coordinator; new routes re-checked as all water)
1. **newport-1778 m1:** the Aug 8 French track cut the south-east lobe of Conanicut ([-71.365, 41.48] on land); the outbound track crossed the same lobe. Both now run up the East Passage.
2. **arnold-treason m2:** "Arnold's flight, Sept 25" ran over the east bank between Robinson House and Peekskill Bay and clipped Verplanck's Point. Now follows the river's west bend and the channel past King's Ferry.

### History
- sullivan m3 item 5 wording verified (Dearborn rejoined at Fort Reed Sep 26, Butler Sep 28; Easton Oct 15). Newport: the French did force the East Passage on Aug 8.

### NIT (not fixed)
- sullivan m2 phone: escape route's dashed line runs through "Sullivan Hill"; m3 phone return route through "Sep 16–30", Aug 26 arrowhead touches its label.
- cowpens m1 phone: "skirmishers" sits on Tarleton's arrow, loosely attached to its block; m2 phone "Guilford Courthouse" above the Salem dot reads as labelling it.
- newport m1 phone: Aug 8 arrowhead touches the "Aug 8–10" ship.
- retreat m3 phone: callout 1 covers the "K" of "King's Ferry"; "Lee taken away" touches "Basking Ridge".
