# SPEC: Geographic companion to Chernow's *Washington: A Life*

## Purpose

I'm reading Ron Chernow's *Washington: A Life* and keep looking places up on Google Maps to follow the movements the book describes. This project is a set of static web pages with maps that show the geography of the events in the book. It supplements the book. It does not retell it.

## Scope

- **Period:** the Revolutionary War chapters, from the outbreak of war to its end. The research phase (see Process) sets the exact chapter range.
- **Book-centric:** cover every event the book describes where geography helps understanding, whether or not Washington was there (e.g. Saratoga, the Southern campaign, naval actions). Events without Washington are marked differently on the main map.
- **Geography only:** maps of positions, movements, routes and terrain. No charts, statistics, timelines or diagrams.
- **No spoilers handling:** build the whole period, with no reveal or progress logic.
- **No narrative:** pages hold legends, captions, short labels and brief descriptions (1–2 sentences per map at most). No paragraphs of explanation, because the book already provides those.
- **Copyright:** all text is our own wording. No quotes from the book beyond short chapter titles.

## Content model

- **Sub-page = one continuous event.** A battle, campaign or movement that happened as one uninterrupted episode in the book. If the same place hosts events separated by unrelated events elsewhere, each gets its own sub-page.
- **A sub-page holds one or more maps.** Each map shows one aspect (e.g. "Aug 26 night: British flanking march", "Aug 29–30: retreat across the East River"). A complex event gets several maps instead of one crowded one.
- **Coverage over precision:** cover every geographic event the book mentions. When unsure whether the book covers something, include it. Skip only what is certainly absent, plus parts that gain nothing from a map (political or personal chapters). Sub-pages are ordered chronologically, following the book. No chapter numbers are shown.

## Pages

### Main page: interactive overview
- A zoomable real map (Leaflet + free no-key tiles with attribution (Esri World Topo; CARTO now requires a key)) covering the colonies.
- One marker per sub-page, placed at the event's location. Places with several events get several markers, or a marker listing the events.
- Clicking a marker opens a card with the title, date range, and a 1–2 sentence description, plus a link to the sub-page.
- Also a plain list or index of all sub-pages in book order, for direct navigation without the map.

### Sub-pages: static maps
- Static SVG maps with a fixed extent, no zoom or pan, each self-contained with title, legend, scale bar, north arrow and caption.
- They show the area **as it was at the time**: period coastlines (e.g. pre-landfill Manhattan), relevant rivers, roads, towns, fortifications and terrain.
- Overlays: unit positions, movement arrows with dates/times, battle sites, and labels.
- Navigation: back to the main map, plus previous/next sub-page in book order.

## Visual and technical conventions

- **Shared foundation, built before any sub-page:**
  - `data/events.json`: the master list of sub-pages (id, title, dates, location, description, Washington-present flag), in book order. The main page and prev/next navigation read from it.
  - `data/places.json`: one shared gazetteer of places with coordinates.
  - Base geography: coastlines and rivers from real geodata (e.g. Natural Earth or US hydrography), projected with d3-geo so maps are accurate and consistent. Known historical differences are corrected by hand per map.
  - Shared CSS/JS: colour palette (e.g. Continental = blue, British = red, Hessian/German = dark green, French = white or light blue, militia = lighter variant), a period-styled parchment look, legend, scale bar, arrow and label components, and the page template.
  - One finished **reference sub-page** that all other sub-pages follow.
- **Stack:** plain HTML/CSS/JS, no build step. Libraries (d3, Leaflet) are vendored or pinned. Works by opening locally via a simple static server.
- **Responsive:** readable on phone and desktop. On narrow screens SVGs scale to the viewport width, and legends and captions move below the map instead of overlapping it.
- **Hosting:** git repo from day one, deployable to GitHub Pages as-is.
- **Accuracy:** use reputable historical sources beyond the book for positions and routes. Mark uncertain or approximate positions visually (e.g. dashed lines) and note them in the caption.

## Process

1. **Research and plan** (single agent, then user review)
   - Find the book's table of contents and cross-check it against at least two independent sources.
   - Determine which chapters cover the war and what each covers (summaries, reviews, previews).
   - Produce the event list: each sub-page with its dates, location and the maps planned.
   - **Checkpoint:** I review and approve the event list before building starts.
2. **Foundation** (single agent): data files, base geography pipeline, shared CSS/JS, main page, and the reference sub-page.
3. **Sub-pages** (parallel subagents): each implements a batch of sub-pages using the foundation, without changing shared files. Requests to change shared files are reported back instead.
4. **Review** (subagents): view the whole site in a browser (Playwright) at phone and desktop widths, check console errors, broken links, visual consistency, legibility and overlaps. A separate reviewer checks historical accuracy.
5. **Fix:** depending on the volume of findings, one or several subagents apply fixes.
6. **Repeat 4–5** only while reviews find bugs, factual errors or inconsistencies (cosmetic nitpicks alone don't trigger another round). Maximum 4 rounds, then report what remains.
