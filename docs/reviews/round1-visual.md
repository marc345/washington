# Round 1: visual / UX review (2026-10-05)

Three reviewers, Playwright screenshots of every map at 1280 px and 390 px (external tiles and fonts blocked). m1, m2… = map number on the page.

## Visual: index + pages 1–12 (lexington … white-plains)

Clean everywhere: no console errors/overflow; all links work; callouts match lists; approx notes present; headers and structure match trenton.html. Per-map PNGs in scratchpad/vis1/figs/.

### Library (hmap.js)
1. **BUG scale bar:** "N miles" text sits on the longer km bar (line through text), every map both widths. → put miles text above its bar or both texts past the longer bar.
2. **BUG phone labels over own symbols** (known #1): new-york-defenses m2 (Heath, Putnam, Greene, Howe's army, Flying Camp); long-island m1–3 (Putnam, Miles, Stirling, Mifflin, Howe); charleston m2 (Clinton, Thomson); invasion-of-canada m2 (Carleton's garrison), m4 (Indian allies).
3. **BUG rows of ships/units merge on phone** (symbols scale, spacing doesn't): Valcour (Arnold's line, Carleton's fleet), Charleston m2, Kip's Bay warships, Dorchester m2 (Nantasket Road).
4. **BUG phone label hiding leaves bare symbols:** white-plains m1 (Fort Lee, Fort Washington, Magaw); new-york-defenses m2 (Kingsbridge, Brooklyn); long-island m2 (Sullivan unit; Old Stone House, Red Lion, Flatbush Pass; "Howe & Clinton" cut to "8–9 a.m."); kips-bay m1 (Paulus Hook, Inclenberg, MANHATTAN), m2 (all battle/route labels). → hide symbol too, or alternative position.
5. **BUG labels collide with north arrow / scale box** (keep-inside ignores them). North arrow (phone): dorchester m2 "Massachusetts Bay", charleston m2 Clinton, kips-bay m2 "Morris house", white-plains m2 "Horton's Pond". Scale box: siege-of-boston m2 (phone) fort + "Charles River"; Quebec (phone) "Montgomery (about 300)"; white-plains m1 (desktop) "MANHATTAN" + Oct 12 move.
6. NIT legend lacks forts, gold HQ star, ferries, callouts; HQ star needs one.
7. NIT straight stream lines: Gowanus Canal ruler-straight on NYC maps; stray river stub on Quebec.

### index.html
- **BUG initial view** omits #4 Canada, #7 Sullivan's Island, #25, #29, #31; #36 cut at bottom (desktop). → fit to all markers / extend north to lat 47.
- **BUG unclickable markers:** at start zoom #1, #3 fully under #6 (Lexington click opened Dorchester). NYC (#8–10, #12) and Philadelphia (#18–22) overlap likewise. → group by screen distance, or fan out.

### Per page
- **lexington-concord-bunker-hill:** BUG m3 caption 4 sentences. NIT "Sudbury R." clipped left (phone); "Charlestown Neck" labelled on mainland; Mystic north shore modern piers.
- **ride-to-cambridge:** BUG callout 3 (Watertown) in Boston Harbor; BUG callout 1 (Hoboken crossing) in inland NJ; BUG (phone) New Brunswick, New York, New Haven, Long Island Sound, PENNSYLVANIA, Hudson R. collide.
- **siege-of-boston:** BUG m1 unlabelled gold HQ star at Cambridge (name empty); BUG m2 (phone) scale box covers a fort. NIT "Bunker Hill" label in the river.
- **invasion-of-canada:** BUG m3 "retreat, May 6" over Deschambault (both widths); BUG m3 ~60% empty Maine → tighten; BUG (phone) m1, m2, m4 crowded collisions; BUG unlabelled Native-allies unit at Valcour (m4). NIT modern (1842) Maine–Quebec border.
- **knox-noble-train:** BUG Lake George arrow points north to Ticonderoga (guns went south to Fort George). NIT callout 2 ~25 mi west of Albany.
- **dorchester-heights:** BUG m2 straight N–S seam across harbor + rectangle artefact near Deer Island; BUG m2 modern fill (Moon Island causeway, Logan Airport fill); BUG (phone) ships merge.
- **charleston-1776:** BUG marsh behind Sullivan's Island filled as solid land (worst m2); BUG Morris Island wedge / James Island edge straight artificial edges; BUG (phone) m2 overlaps (north arrow, ships).
- **new-york-defenses:** BUG (phone) m2 library 2 & 4. NIT HQ star no legend; Brooklyn line 4 stars / 3 labels (long-island m3 draws 3); modern piers, Gowanus Canal; crude straight-edged Manhattan 1776 outline.
- **long-island:** BUG (phone) labels lost (lib 4); "HEIGHTS OF GUAN" overrun; only Jamaica Pass labelled. NIT straight channels, Navy Yard basin.
- **kips-bay-harlem-heights:** BUG m1 landing area illegible on phone; BUG m2 desktop "Knowlton & Leitch" runs through "Point of Rocks". NIT industrial canals/landfill (Newtown Creek, Randalls/Wards, Hunts Point).
- **white-plains:** BUG m1 scale box covers MANHATTAN + start of Oct 12 move (→ top-left); BUG (phone) m1 forts lose labels. NIT Washington route solid; header Oct 12–28 but maps run to Nov 5.

## Visual: pages 13–24 (fort-washington … monmouth)

Tooling clean: no console errors/overflow; all links work, prev/next order matches events.json; headers OK; callouts match lists. Per-map PNGs in scratchpad/vis2/figs/.

### Library (hmap.js)
1. **BUG offsets not scaled on phones** (known #1): trenton (Rall, Donop, Knox's guns, Knyphausen), brandywine (Sullivan, Stirling, Wayne, Weedon), valley-forge m2 (Steuben square hidden under label).
2. **BUG place outside frame leaves floating label:** keep-inside pulls the label in though the symbol is outside. morristown-1777 m2 "Elizabethtown" with no symbol ~3 mi from the place. → library drops label when symbol outside frame; page removes it.
3. **BUG north arrow / scale bar cover content on phones:** delaware-forts m1 "Cooper's Ferry"; trenton m1 callout 3; philadelphia m2 "to Fort Mifflin"; fort-washington m2 "Hackensack River"; valley-forge m1 Jun 19 arrowhead.
4. **BUG route labels truncated on phones:** "wing (faile", "lader (rec" (trenton m1), "ov 19–2" (fort-washington m2). → shrink/move/hide labels that don't fit their line.
5. NIT callout circles grow on phones, cover labels/battle symbols.
6. NIT region labels cross borders on phones ("PENNSYLVANIA" monmouth m1; "MARYLAND" under "Annapolis" howe m1).

### Content
- Captions with 4 sentences: retreat-across-new-jersey m3, princeton m3, morristown-1777 m1.
- valley-forge m1: label "about 18 miles" vs caption "about 20 miles".
- saratoga m2: callout 1 (Morgan at Freeman's farm, 1 p.m.) on the arrowhead of Riedesel's late-afternoon attack (item 3) → move to the farm/Morgan's arrow.
- monmouth m2: bridge where Washington meets Lee (item 4) is an unlabeled square; unlabeled red unit; callout 1 (main column to Middletown) on "Clinton turns back" arrow, not the unlabeled Middletown arrow.
- retreat-across-new-jersey m1: modern Manhattan/Hudson shorelines with piers, landfill, Meadowlands ditches; inconsistent with fort-washington's 1776 corrections (known #4).
- delaware-forts m1–2: modern features despite period-shoreline note: Navy Yard basin, straight channels at Schuylkill mouth (m2), comb piers on Camden side, dredge-spoil basins below Billingsport (m1).
- morristown-1777 m1: callouts 2, 5 and two battle symbols pile up at Bound Brook/Millstone.
- philadelphia-germantown m1: crowded on phones around Paoli/Valley Forge; shows the Oct 3–4 march outside its title dates (Sep 12–26) and repeated on m3.

### Phone collisions that hide information
- trenton: callout 2 on "Ewing (failed)"; callout 3 and "Cadwalader (recalled)" under scale bar; "McConkey's Ferry" covered (m1).
- howe-to-the-chesapeake: m1 "Annapolis" × "MARYLAND", "Wilmington" × "NEW JERSEY"; m2 "Washington, Sep 6–8" over its units, "Christina R." × "Christiana Bridge".
- saratoga m1: "Fort Stanwix", "St. Leger", "Oriskany", "Oneida L." overlap; "Baum" unreadable.
- retreat-across-new-jersey m3: "Sullivan" × Pittstown; callout 2 × "Basking Ridge"; route covers "Delaware R.".
- princeton m1: "Pennsylvania militia" × "to Bordentown"; "Assunpink bridge" under battle swords.
- delaware-forts: m1 "Chester" under British fleet; m2 "Fort Mifflin" under "Nov 15–16", "Fort Mercer" under Donop's arrow.
- philadelphia-germantown m2: "Kensington" × "NEW JERSEY"; "Middle Ferry" × "Schuylkill River".
- monmouth m1: "Trenton" × "Delaware R."; "Mount Holly" covered by Clinton label (both widths).
- valley-forge m1: "Barren Hill" covered by "May 18" and callout 2; "Crooked Billet" under swords.
- fort-washington m2: "Nov 19–20" covers "Lower Closter Landing".

### Nits
- Spellings: "King's Bridge" (fort-washington m1) vs "Kingsbridge" (m2); "Lower Closter Landing" vs "Closter landing" (retreat).
- saratoga m4: "Burgoyne, Oct 8–9" × "Dovegat"; Morgan and Gates routes start inside the scale bar.
- fort-washington m1: phone hides "Jeffrey's Hook" label, leaves unlabeled star.
- morristown-1777 m2: May 28 route starts in open country, not at Morristown.
- Unit-over-symbol overlaps on philadelphia m3, saratoga m3, monmouth m3 (library fix 1).

## Visual: pages 25–36 (newport-1778 … road-home-1783), 41 maps

Clean everywhere: no console errors/overflow; all hrefs work; headers/structure match trenton.html; every map has scale, north arrow, legend; callouts match lists; approx notes present. Per-map PNGs in scratchpad/vis3/figs/.

### Per page
- **newport-1778:** BUG m1 phone "into the bay, Aug 8" over "Newport" and "Conanicut I." (desktop: other French track crosses it). BUG m3 both widths "Laurens" covers "Turkey Hill" + fighting symbol; "Livingston" covers "Quaker Hill" → `labelAt`. NIT m2 "Aug 15" hides "East Road"; "Green End" on the trench.
- **savannah:** BUG m3 phone "allied siege trenches" behind scale box; "d'Estaing"/"Laurens, McIntosh"/"Dillon (French)" overlap → scale bottom-right. NIT m2 phone "Savannah R." × "Zubly's Ferry"; "SOUTH CAROLINA" × "HILTON HEAD I."
- **sullivan-expedition:** BUG m2 phone "Maxwell (reserve)" × "Sullivan from Tioga". BUG m3 phone "return, Sep 16–30" covers "Honeoye"; "Butler", "Dearborn" on Cayuga L.; labels ~9 px. NIT m1 phone "Clinton, Aug 9–22" touches "Oquaga".
- **stony-point:** BUG m1 both "Wayne, July 15" covers "Fort Montgomery (ruins)" and "Queensboro"; phone "Clinton, from New York" into the Stony Point star; "Vulture" on its ship. NIT m2 callout 3 covers "Murfree"; "Fort Lafayette" × "Hudson River". NIT m3 "Lee, Aug 18" × "Bergen road".
- **morristown-1779-80:** BUG m1 phone callout 1 + north arrow cover "Ford house"; callout 4 between "New York"/"Maryland". NIT m1 blue star (Fort Nonsense) no legend. BUG m2 phone Connecticut Farms illegible ("Galloping Hill road", "Vauxhall road", "June 7", "Knyphausen, June 23", "Connecticut Farms"); "Hobart Gap", "Short Hills", "to Morristown" pile up.
- **charleston-camden:** BUG m1 phone "Overmountain men" cut at top; "flight to Charlotte" covers "Waxhaws"; "SOUTH CAROLINA" × "GEORGIA". BUG m2 hand-drawn Morris Island (`morris`) sharp straight-edged triangle; `ashleyFill` leaves ruler-straight west edge. NIT m2 "Arbuthnot" on "SULLIVAN'S ISLAND"; star covers "Fort Johnson"; callouts 1, 4 in corners. NIT m3 phone "Waxhaw road" × Gates.
- **arnold-treason:** BUG m2 phone André label through "NEUTRAL GROUND"; "Arnold's flight" × "Verplanck's Point". BUG m3 Great Chain stops mid-river, doesn't reach Constitution Island. NIT m1 whole Washington route dotted but caption says only Hudson–Litchfield part approximate. NIT m2 "André taken" uses Fighting symbol.
- **cowpens-guilford:** BUG m2 caption 6 sentences; says routes approximate, none drawn so; phone "Huger" covers "Trading Ford", "Greene, Feb 10–14" × "Dan River" + ferries. BUG m3 "New Garden road" cut at left, missing on desktop; phone "Webster" on "from New Garden Meeting House"; three American lines read as scattered blocks; callouts 1, 2 away from units. NIT m1 "Washington (dragoons)" × "Green River road". NIT m4 phone "Mar 18 – Apr 7" covers "Ramsey's Mill"; "Hobkirk's Hill" × "SOUTH CAROLINA".
- **virginia-1781:** BUG m3 phone "Wayne" cut at top; "Lafayette, May 27 – Jun 10", "Cornwallis", "Simcoe" on place names; "Jun 11–25" nearly upside down; caption 4 sentences; James faint unlabeled hairline. BUG m4 phone "to Cobham, Jul 7–9" cut, over Jamestown, Green Spring, Spencer's Ordinary. NIT m1 phone "from Portsmouth" covers "James River". NIT m1, m3 captions say approximate, drawn solid. NIT m2 ship covers Mount Vernon marker.
- **march-to-yorktown:** BUG m2 phone "allied armies, Aug 19 – Sep 8" cut at top; "Washington rides ahead" covers Mount Vernon and Fredericksburg (both); caption 4 sentences; calls ride approximate but solid. BUG m3 phone "de Grasse from Cap-Français" under scale box/off corner; "Newport" × north arrow; desktop unclear which red track is "Graves & Hood". NIT m1 phone "to Princeton and Trenton" covers "Raritan Bay"; "French" covers "Whippany". NIT `<title>` "The March to Yorktown" vs h1 "The march to Yorktown".
- **battle-of-the-capes:** NIT m1 phone British track into north arrow; French ship covers "Cape Henry"; "Lynnhaven Bay" on land. NIT m2 de Barras track starts under north arrow.
- **siege-of-yorktown:** BUG m3 caption 5 sentences, mentions Fusiliers' Redoubt not on map; legend lacks British redoubt stars (m2 has). BUG m2–4 "Williamsburg Rd", "Hampton Rd", "Main St." cut at edge. NIT m1 routes solid but called approximate; labels crowd "Yorktown" on phone.
- **road-home-1783:** BUG m1 anachronism: Manhattan Hudson shore and Brooklyn waterfront show modern piers despite "Water (period shoreline)"; m2 Brooklyn piers too. BUG m2 both "Bowery" × "Nov 25"; phone "Broadway" covers "Collect Pond". BUG m1 phone scale box covers Washington's arrowhead and "Brooklyn". NIT m3 phone four overlaps (Dec 4–8/New Brunswick, New York/north arrow, Annapolis/"resigns", Mount Vernon/"home"). NIT m1 hand-added "Land" legend; tab title "The Road Home, 1783" vs h1 "Evacuation of New York & the road home".

### Library (hmap.js)
1. Path-following move labels not kept inside frame or away from other labels → run off edge/over names on phone. Clamp label position along path + per-move phone override.
2. Scale box covers content (savannah 3, cowpens-guilford 2, march-to-yorktown 3, road-home-1783 1); need easy phone placement.
3. Movement vs Attack look the same in legend (~0.5 px width difference).
4. "Approximate route" only when `approx: true`; five maps say approximate but draw solid (page fixes; add AUTHORING note).
5. Road names cut at edge (not nudged inside like point labels).
6. Callouts sit on labels (morristown-1779-80 m1, stony-point m2).
7. Open item 1 visible on almost every phone map.
