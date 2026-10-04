/* HMap: static historical maps rendered as SVG with d3-geo.
 *
 * Usage (see docs/AUTHORING.md for the full schema):
 *   HMap.render('#map-a', { geo: 'trenton-attack', bbox: [w, s, e, n], units: [...], moves: [...] });
 *
 * Coordinates are always [longitude, latitude].
 * All maps use Web Mercator, which matches the elevation grid built by tools/geo/build.mjs.
 */
(function () {
  'use strict';

  const BASE = (function () {
    const s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/assets\/js\/hmap\.js(\?.*)?$/, '') : '';
  })();

  // Viewbox width; height follows from the bbox aspect ratio.
  const VW = 1000;

  const SIDES = {
    continental: { label: 'Continental Army', fill: '#2f5597', stroke: '#1b3466' },
    militia:     { label: 'American militia', fill: '#7d9bd1', stroke: '#2f5597' },
    british:     { label: 'British', fill: '#b8312f', stroke: '#6e1716' },
    hessian:     { label: 'Hessian / German', fill: '#2f6b45', stroke: '#173a24' },
    loyalist:    { label: 'Loyalist', fill: '#d9823b', stroke: '#8a4a14' },
    french:      { label: 'French', fill: '#f4f1e6', stroke: '#2b3f7a' },
    native:      { label: 'Native allies', fill: '#8a5a2b', stroke: '#4d2f12' },
    neutral:     { label: '', fill: '#6b5a48', stroke: '#3a2f24' },
  };

  const MOVE_KINDS = {
    march:   { label: 'Movement', width: 2.6 },
    attack:  { label: 'Attack', width: 4.2 },
    retreat: { label: 'Retreat', width: 2.6, dash: '9 5' },
    naval:   { label: 'Naval movement', width: 2.2, dash: '14 4 3 4' },
  };

  const cache = new Map();
  function fetchJSON(url) {
    if (!cache.has(url)) cache.set(url, fetch(url).then(r => {
      if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
      return r.json();
    }));
    return cache.get(url);
  }

  let placesPromise = null;
  function places() {
    return placesPromise || (placesPromise = fetchJSON(BASE + 'data/places.json'));
  }

  function decodeElevation(el) {
    const bin = atob(el.data);
    const v = new Float32Array(bin.length);
    for (let i = 0; i < bin.length; i++) v[i] = el.min + bin.charCodeAt(i) * el.step;
    return v;
  }

  function niceInterval(range, target) {
    const raw = range / target;
    const nice = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500];
    return nice.find(n => n >= raw) || 500;
  }

  // Resolve a coordinate that may be a place id string.
  function resolver(gaz) {
    return function at(c) {
      if (typeof c === 'string') {
        const p = gaz[c];
        if (!p) throw new Error(`HMap: unknown place "${c}" (add it to data/places.json)`);
        return p.coords;
      }
      return c;
    };
  }

  function el(parent, tag, attrs) {
    const n = parent.append(tag);
    if (attrs) for (const k in attrs) if (attrs[k] != null) n.attr(k, attrs[k]);
    return n;
  }

  async function render(target, cfg) {
    const container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) throw new Error('HMap: no container ' + target);
    const [topo, elev, gaz] = await Promise.all([
      fetchJSON(`${BASE}data/geo/${cfg.geo}.topo.json`),
      cfg.terrain === false ? null : fetchJSON(`${BASE}data/geo/${cfg.geo}.elev.json`).catch(() => null),
      places(),
    ]);
    const draw = () => drawMap(container, cfg, topo, elev, gaz);
    draw();
    // Re-render when the width changes enough to need different text scaling.
    let lastW = container.clientWidth, t;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => {
        const w = container.clientWidth;
        if (w && Math.abs(w - lastW) / lastW > 0.12) { lastW = w; draw(); }
      }, 150);
    });
    ro.observe(container);
  }

  function drawMap(container, cfg, topo, elev, gaz) {
    const at = resolver(gaz);
    const [w, s, e, n] = cfg.bbox;
    const m = d3.geoMercator().scale(1).translate([0, 0]);
    const [ax, ay] = m([w, n]), [bx, by] = m([e, s]);
    const VH = Math.round(VW * (by - ay) / (bx - ax));
    const proj = d3.geoMercator().fitExtent([[0, 0], [VW, VH]],
      { type: 'MultiPoint', coordinates: [[w, n], [e, s]] });
    const path = d3.geoPath(proj);
    const P = c => proj(at(c));

    // UI scale: symbols and text keep a readable on-screen size on narrow screens.
    const cw = container.clientWidth || VW;
    const u = Math.pow(Math.max(1, VW / cw), 0.82) * (cfg.textScale || 1);
    const fs = px => +(px * u).toFixed(2);

    container.innerHTML = '';
    const uid = 'hm' + Math.random().toString(36).slice(2, 8);
    const svg = d3.select(container).append('svg')
      .attr('viewBox', `0 0 ${VW} ${VH}`)
      .attr('class', 'hmap')
      .attr('role', 'img')
      .attr('aria-label', cfg.alt || cfg.title || 'Historical map');
    const defs = svg.append('defs');
    el(defs, 'clipPath', { id: uid + '-frame' }).append('rect').attr('width', VW).attr('height', VH);

    const root = el(svg, 'g', { 'clip-path': `url(#${uid}-frame)`, class: 'hm-root' });
    el(root, 'rect', { width: VW, height: VH, class: 'hm-sea' });

    const land = topojson.feature(topo, topo.objects.land);
    const water = topojson.feature(topo, topo.objects.water);
    const rivers = topojson.feature(topo, topo.objects.rivers);
    const corr = cfg.corrections || {};
    const poly = rings => ({ type: 'Polygon', coordinates: [rings.map(at).concat([at(rings[0])])] });

    // land clip (for terrain)
    const landClip = el(defs, 'clipPath', { id: uid + '-land' });
    landClip.append('path').attr('d', path(land));
    (corr.land || []).forEach(r => landClip.append('path').attr('d', path(poly(r))));
    el(root, 'path', { d: path(land), class: 'hm-land' });
    (corr.land || []).forEach(r => el(root, 'path', { d: path(poly(r)), class: 'hm-land' }));

    // terrain: hillshade + contours from the elevation grid
    if (elev && cfg.terrain !== false) drawTerrain(root, defs, uid, elev, proj, cfg.terrain || {}, fs);

    // water polygons + historical water corrections (e.g. later landfill)
    const whide = new Set((cfg.water && cfg.water.hide) || []);
    const wopt = cfg.water || {};
    const inBox = (f, b) => { const c = d3.geoCentroid(f); return c[0] >= b[0] && c[0] <= b[2] && c[1] >= b[1] && c[1] <= b[3]; };
    const wf = { type: 'FeatureCollection', features: water.features.filter(f =>
      !whide.has(f.properties.name) &&
      !(wopt.hideUnnamed && !f.properties.name) &&
      !(wopt.hideIn || []).some(b => inBox(f, b))) };
    el(root, 'path', { d: path(wf), class: 'hm-water' });
    (corr.water || []).forEach(r => el(root, 'path', { d: path(poly(r)), class: 'hm-water' }));
    (corr.land || []).forEach(r => el(root, 'path', { d: path(poly(r)), class: 'hm-land hm-land-fix' }));

    // rivers & streams
    const hide = new Set((cfg.rivers && cfg.rivers.hide) || []);
    const only = cfg.rivers && cfg.rivers.only ? new Set(cfg.rivers.only) : null;
    const rv = rivers.features.filter(f => {
      const nm = f.properties.name || '';
      return !hide.has(nm) && (!only || only.has(nm));
    });
    el(root, 'g', { class: 'hm-rivers' }).selectAll('path').data(rv).join('path')
      .attr('d', path).attr('stroke-width', f => fs(/Riv|River/.test(f.properties.name || '') ? 1.3 : 0.8));

    // roads
    const line = d3.line().curve(d3.curveCatmullRom.alpha(0.5));
    const gRoads = el(root, 'g', { class: 'hm-roads' });
    (cfg.roads || []).forEach((r, i) => {
      const pts = r.coords.map(P);
      el(gRoads, 'path', { d: line(pts), class: 'hm-road hm-road-' + (r.kind || 'road'),
        'stroke-width': fs(r.kind === 'track' ? 1 : 1.6), 'stroke-dasharray': r.kind === 'track' ? `${fs(3)} ${fs(3)}` : null });
      if (r.name) {
        const rev = pts[pts.length - 1][0] < pts[0][0];
        const id = `${uid}-rd${i}`;
        el(defs, 'path', { id, d: line(rev ? pts.slice().reverse() : pts) });
        const t = el(gRoads, 'text', { class: 'hm-lbl hm-lbl-road', 'font-size': fs(r.size || 10.5), dy: -fs(3.5) });
        el(t, 'textPath', { href: '#' + id, startOffset: ((r.labelAt != null ? (rev ? 1 - r.labelAt : r.labelAt) : 0.5) * 100) + '%', 'text-anchor': 'middle' }).text(r.name);
      }
    });

    // shaded areas (camps, occupied zones, flooded ground...) and plain lines (boundaries, chains, booms)
    const gAreas = el(root, 'g', { class: 'hm-areas' });
    (cfg.areas || []).forEach(a => {
      const side = SIDES[a.side || 'neutral'];
      const d = d3.line().curve(a.smooth === false ? d3.curveLinearClosed : d3.curveCatmullRomClosed.alpha(0.5))(a.coords.map(P));
      el(gAreas, 'path', { d, fill: side.fill, 'fill-opacity': a.opacity != null ? a.opacity : 0.22,
        stroke: side.stroke, 'stroke-width': fs(1), 'stroke-dasharray': `${fs(4)} ${fs(3)}` });
      if (a.label) {
        const c = a.labelAt ? P(a.labelAt) : d3.polygonCentroid(a.coords.map(P));
        label(gAreas, c, a.label, { anchor: 'middle', dx: 0, dy: 0 }, 'hm-lbl-area', fs(a.size || 12));
      }
    });
    (cfg.lines || []).forEach(l => {
      el(gAreas, 'path', { d: d3.line()(l.coords.map(P)), fill: 'none', stroke: l.color || '#3a2f24',
        'stroke-width': fs(l.width || 1.5), 'stroke-dasharray': l.dash ? l.dash.split(' ').map(x => fs(+x)).join(' ') : null });
    });

    // fortifications
    const gWorks = el(root, 'g', { class: 'hm-works' });
    (cfg.works || []).forEach(wk => {
      const side = SIDES[wk.side || 'neutral'];
      const pts = wk.coords.map(P);
      if (wk.kind === 'redoubt' && pts.length === 1) {
        const r = fs(wk.size || 6);
        el(gWorks, 'path', { d: starPath(pts[0][0], pts[0][1], r), fill: 'none', stroke: side.stroke, 'stroke-width': fs(1.8) });
      } else {
        const d = (wk.closed ? d3.line().curve(d3.curveLinearClosed) : d3.line())(pts);
        el(gWorks, 'path', { d, fill: 'none', stroke: side.stroke, 'stroke-width': fs(2.4) });
        el(gWorks, 'path', { d, fill: 'none', stroke: side.stroke, 'stroke-width': fs(5),
          'stroke-dasharray': `${fs(1.2)} ${fs(3.5)}`, transform: null, class: 'hm-work-teeth' });
      }
    });

    // movements
    const gMoves = el(root, 'g', { class: 'hm-moves' });
    (cfg.moves || []).forEach((mv, i) => drawMove(gMoves, defs, uid + 'mv' + i, mv, P, fs));

    // places
    const gPlaces = el(root, 'g', { class: 'hm-places' });
    (cfg.towns || []).forEach(t => {
      const p = gaz[t.place] || {};
      const c = P(t.coords || t.place);
      const kind = t.kind || p.kind || 'town';
      drawPlaceSymbol(gPlaces, kind, c, fs, t.side);
      const name = t.name != null ? t.name : p.name;
      if (name) label(gPlaces, c, name, Object.assign({ dx: 7, dy: 4, anchor: 'start' }, t.label), 'hm-lbl-place hm-lbl-' + kind, fs(t.size || (kind === 'town' ? 14 : 12)));
    });

    // ships
    const gShips = el(root, 'g', { class: 'hm-ships' });
    (cfg.ships || []).forEach(sh => {
      const side = SIDES[sh.side || 'british'];
      const c = P(sh.coords);
      const g = el(gShips, 'g', { transform: `translate(${c[0]},${c[1]}) rotate(${sh.angle || 0}) scale(${u})` });
      el(g, 'path', { d: 'M-11,-2 L9,-2 L13,1 L9,4 L-11,4 Z M-4,-2 L-4,-12 L4,-2 Z', fill: side.fill, stroke: side.stroke, 'stroke-width': 1 });
      if (sh.label) label(gShips, c, sh.label, Object.assign({ dx: 0, dy: -16, anchor: 'middle' }, sh.labelPos), 'hm-lbl-unit', fs(11));
    });

    // units
    const gUnits = el(root, 'g', { class: 'hm-units' });
    (cfg.units || []).forEach(un => drawUnit(gUnits, un, P, fs, u));

    // battles
    const gBattles = el(root, 'g', { class: 'hm-battles' });
    (cfg.battles || []).forEach(b => {
      const c = P(b.coords);
      el(gBattles, 'path', { d: swordsPath(), transform: `translate(${c[0]},${c[1]}) scale(${u})`, class: 'hm-battle' });
      if (b.label) label(gBattles, c, b.label, Object.assign({ dx: 0, dy: -15, anchor: 'middle' }, b.labelPos), 'hm-lbl-battle', fs(13));
    });

    // free labels
    const gLabels = el(root, 'g', { class: 'hm-labels' });
    (cfg.labels || []).forEach(l => {
      const c = P(l.coords);
      const base = { water: 15, region: 15, terrain: 12, note: 11.5 }[l.kind || 'note'];
      label(gLabels, c, l.text, Object.assign({ dx: 0, dy: 0, anchor: 'middle', angle: l.angle }, l), 'hm-lbl-' + (l.kind || 'note'), fs(l.size || base));
    });

    // numbered callouts
    const gCall = el(root, 'g', { class: 'hm-callouts' });
    (cfg.callouts || []).forEach(co => {
      const c = P(co.coords);
      el(gCall, 'circle', { cx: c[0], cy: c[1], r: fs(9), class: 'hm-callout' });
      el(gCall, 'text', { x: c[0], y: c[1], dy: '0.35em', 'text-anchor': 'middle', class: 'hm-callout-n', 'font-size': fs(11) }).text(co.n);
    });

    // escape hatch for one-off drawing: cfg.after({ svg, root, defs, proj, P, fs, u, d3 })
    if (typeof cfg.after === 'function') cfg.after({ svg, root, defs, proj, P, fs, u, d3 });

    // furniture
    drawNorth(svg, VW - fs(34), fs(40), fs);
    drawScale(svg, proj, VH, fs, cfg.bbox);
    el(svg, 'rect', { x: 1.5, y: 1.5, width: VW - 3, height: VH - 3, class: 'hm-frame' });
    el(svg, 'rect', { x: 6, y: 6, width: VW - 12, height: VH - 12, class: 'hm-frame hm-frame-inner' });

    keepLabelsInside(svg, VW, VH, fs(10));
    if (cfg.legend !== false) buildLegend(container, cfg);
  }

  function drawTerrain(root, defs, uid, elev, proj, opt, fs) {
    const vals = decodeElevation(elev);
    const W = elev.width, H = elev.height;
    const [x0, y0] = proj([elev.bbox[0], elev.bbox[3]]);
    const [x1, y1] = proj([elev.bbox[2], elev.bbox[1]]);
    const g = root.append('g').attr('clip-path', `url(#${uid}-land)`).attr('class', 'hm-terrain');

    if (opt.hillshade !== false) {
      const cv = document.createElement('canvas');
      cv.width = W; cv.height = H;
      const ctx = cv.getContext('2d');
      const img = ctx.createImageData(W, H);
      // cell size in metres, roughly, for slope; exaggeration keeps low relief visible
      const cell = ((x1 - x0) / W) / proj.scale() * 6378137;
      const z = opt.exaggeration || 4;
      const az = 315 * Math.PI / 180, alt = 45 * Math.PI / 180;
      for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
        const v = (x, y) => vals[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))];
        const dzdx = (v(i + 1, j) - v(i - 1, j)) / (2 * cell) * z;
        const dzdy = (v(i, j + 1) - v(i, j - 1)) / (2 * cell) * z;
        const slope = Math.atan(Math.hypot(dzdx, dzdy));
        const aspect = Math.atan2(dzdy, -dzdx);
        let sh = Math.cos(alt) * Math.cos(slope) + Math.sin(alt) * Math.sin(slope) * Math.cos(az - Math.PI / 2 - aspect);
        sh = Math.max(0, Math.min(1, sh));
        const k = (j * W + i) * 4;
        // dark where shaded, transparent where lit
        const dark = Math.max(0, 0.72 - sh);
        img.data[k] = 70; img.data[k + 1] = 52; img.data[k + 2] = 30;
        img.data[k + 3] = Math.round(dark * 255 * (opt.shadeOpacity || 0.55));
      }
      ctx.putImageData(img, 0, 0);
      g.append('image').attr('href', cv.toDataURL()).attr('x', x0).attr('y', y0)
        .attr('width', x1 - x0).attr('height', y1 - y0).attr('preserveAspectRatio', 'none');
    }

    if (opt.contours !== false) {
      let lo = Infinity, hi = -Infinity;
      for (const v of vals) { if (v < lo) lo = v; if (v > hi) hi = v; }
      lo = Math.max(lo, 0);
      const step = typeof opt.contours === 'number' ? opt.contours : niceInterval(hi - lo, 9);
      const thresholds = d3.range(Math.ceil((lo + 0.5) / step) * step, hi, step);
      const contours = d3.contours().size([W, H]).thresholds(thresholds).smooth(true)(Array.from(vals));
      const sx = (x1 - x0) / W, sy = (y1 - y0) / H;
      const tr = d3.geoTransform({ point(x, y) { this.stream.point(x0 + x * sx, y0 + y * sy); } });
      const cpath = d3.geoPath(tr);
      g.selectAll('path.hm-contour').data(contours).join('path')
        .attr('class', d => 'hm-contour' + (Math.round(d.value / step) % 5 === 0 ? ' hm-contour-index' : ''))
        .attr('d', cpath)
        .attr('stroke-width', d => fs(Math.round(d.value / step) % 5 === 0 ? 0.9 : 0.5));
    }
  }

  function drawMove(g, defs, id, mv, P, fs) {
    const side = SIDES[mv.side || 'continental'];
    const kind = MOVE_KINDS[mv.kind || 'march'];
    const pts = mv.coords.map(P);
    const curve = mv.straight ? d3.curveLinear : d3.curveCatmullRom.alpha(0.5);
    const d = d3.line().curve(curve)(pts);
    const width = fs(mv.width || kind.width);
    const dash = mv.approx ? `${fs(2)} ${fs(4.5)}` : kind.dash ? kind.dash.split(' ').map(x => fs(+x)).join(' ') : null;
    // white casing for legibility
    el(g, 'path', { d, class: 'hm-move-casing', 'stroke-width': width + fs(2.4) });
    const p = el(g, 'path', { d, fill: 'none', stroke: side.stroke === '#2b3f7a' ? side.stroke : side.fill,
      'stroke-width': width, 'stroke-dasharray': dash, 'stroke-linecap': mv.approx ? 'round' : 'butt', class: 'hm-move' });
    // arrowhead aligned with the final direction of the rendered path
    const node = p.node();
    const L = node.getTotalLength();
    const tip = node.getPointAtLength(L), back = node.getPointAtLength(Math.max(0, L - fs(6)));
    const ang = Math.atan2(tip.y - back.y, tip.x - back.x) * 180 / Math.PI;
    const hs = fs(mv.kind === 'attack' ? 6 : 5) + width * 0.6;
    el(g, 'path', { d: `M${hs},0 L${-hs},${-hs * 0.85} L${-hs * 0.45},0 L${-hs},${hs * 0.85} Z`,
      transform: `translate(${tip.x},${tip.y}) rotate(${ang})`, fill: side.stroke === '#2b3f7a' ? side.stroke : side.fill,
      stroke: '#fffaf0', 'stroke-width': fs(0.8), class: 'hm-move-head' });
    if (mv.label) {
      // label runs along the path, flipped so it is never upside down
      const a = pts[0], b = pts[pts.length - 1];
      const rev = b[0] < a[0];
      const tp = el(defs, 'path', { id, d: rev ? d3.line().curve(curve)(pts.slice().reverse()) : d });
      const t = el(g, 'text', { class: 'hm-lbl-move', 'font-size': fs(mv.labelSize || 11.5), dy: -(width / 2 + fs(4)) });
      el(t, 'textPath', { href: '#' + id, startOffset: ((mv.labelAt != null ? (rev ? 1 - mv.labelAt : mv.labelAt) : 0.5) * 100) + '%', 'text-anchor': 'middle' })
        .text(mv.label);
      void tp;
    }
  }

  function drawUnit(g, un, P, fs, u) {
    const side = SIDES[un.side || 'continental'];
    const c = P(un.coords);
    const w = (un.w || 26), h = (un.h || 11);
    const grp = el(g, 'g', { transform: `translate(${c[0]},${c[1]}) rotate(${un.angle || 0}) scale(${u})` });
    el(grp, 'rect', { x: -w / 2, y: -h / 2, width: w, height: h, fill: side.fill, stroke: side.stroke, 'stroke-width': 1.2 });
    if (un.type === 'cavalry') el(grp, 'line', { x1: -w / 2, y1: h / 2, x2: w / 2, y2: -h / 2, stroke: side.stroke, 'stroke-width': 1.2 });
    if (un.type === 'artillery') el(grp, 'circle', { cx: 0, cy: 0, r: h * 0.22, fill: side.stroke });
    if (un.label) {
      const pos = Object.assign({ dx: w / 2 * u + fs(4), dy: fs(4), anchor: 'start' }, un.labelPos);
      label(g, c, un.label, pos, 'hm-lbl-unit', fs(un.size || 11.5));
    }
  }

  function drawPlaceSymbol(g, kind, c, fs, sideKey) {
    const [x, y] = c;
    const r = fs(3.6);
    switch (kind) {
      case 'town': el(g, 'rect', { x: x - r, y: y - r, width: 2 * r, height: 2 * r, class: 'hm-sym-town' }); break;
      case 'village': el(g, 'circle', { cx: x, cy: y, r: r * 0.85, class: 'hm-sym-town' }); break;
      case 'building': el(g, 'rect', { x: x - r * 0.8, y: y - r * 0.8, width: 1.6 * r, height: 1.6 * r, class: 'hm-sym-building' }); break;
      case 'church': el(g, 'path', { d: `M${x - r},${y} h${2 * r} M${x},${y - r * 1.4} v${2.8 * r}`, class: 'hm-sym-church', 'stroke-width': fs(1.6) }); break;
      case 'ferry': el(g, 'path', { d: `M${x},${y - r * 1.2} L${x + r * 1.2},${y} L${x},${y + r * 1.2} L${x - r * 1.2},${y} Z`, class: 'hm-sym-ferry' }); break;
      case 'fort': {
        const side = SIDES[sideKey || 'neutral'];
        el(g, 'path', { d: starPath(x, y, r * 1.9), fill: '#fffaf0', stroke: side.stroke, 'stroke-width': fs(1.6) }); break;
      }
      case 'hq': el(g, 'path', { d: `M${x},${y - r * 1.6} L${x + r * 0.5},${y - r * 0.5} L${x + r * 1.6},${y - r * 0.4} L${x + r * 0.75},${y + r * 0.3} L${x + r},${y + r * 1.5} L${x},${y + r * 0.8} L${x - r},${y + r * 1.5} L${x - r * 0.75},${y + r * 0.3} L${x - r * 1.6},${y - r * 0.4} L${x - r * 0.5},${y - r * 0.5} Z`, class: 'hm-sym-hq' }); break;
      default: el(g, 'circle', { cx: x, cy: y, r, class: 'hm-sym-town' });
    }
  }

  function label(g, c, text, o, cls, size) {
    const t = el(g, 'text', {
      x: c[0] + (o.dx || 0) * (o.dxRaw ? 1 : 1), y: c[1] + (o.dy || 0),
      'text-anchor': o.anchor || 'start', class: 'hm-lbl ' + cls, 'font-size': size,
      transform: o.angle ? `rotate(${o.angle},${c[0] + (o.dx || 0)},${c[1] + (o.dy || 0)})` : null,
    });
    const lines = String(text).split('\n');
    lines.forEach((ln, i) => el(t, 'tspan', { x: c[0] + (o.dx || 0), dy: i ? '1.1em' : 0 }).text(ln));
    return t;
  }

  // Shift point labels that would be clipped by the map frame back inside it.
  function keepLabelsInside(svg, VW, VH, pad) {
    svg.selectAll('.hm-root text.hm-lbl').each(function () {
      if (this.querySelector('textPath')) return;
      const b = this.getBBox();
      let dx = 0, dy = 0;
      if (b.x < pad) dx = pad - b.x; else if (b.x + b.width > VW - pad) dx = VW - pad - b.x - b.width;
      if (b.y < pad) dy = pad - b.y; else if (b.y + b.height > VH - pad) dy = VH - pad - b.y - b.height;
      if (dx || dy) {
        const tr = this.getAttribute('transform') || '';
        this.setAttribute('transform', `translate(${dx},${dy}) ${tr}`);
      }
    });
  }

  function starPath(x, y, r) {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.5 : r;
      d += (i ? 'L' : 'M') + (x + rr * Math.cos(a)).toFixed(1) + ',' + (y + rr * Math.sin(a)).toFixed(1);
    }
    return d + 'Z';
  }

  function swordsPath() {
    return 'M-8,-8 L8,8 M8,-8 L-8,8 M-9,-4 L-4,-9 M4,-9 L9,-4 M-10,10 L-7,7 M10,10 L7,7';
  }

  function drawNorth(svg, x, y, fs) {
    const g = el(svg, 'g', { transform: `translate(${x},${y})`, class: 'hm-north' });
    const r = fs(14);
    el(g, 'path', { d: `M0,${-r} L${r * 0.38},${r * 0.55} L0,${r * 0.25} L${-r * 0.38},${r * 0.55} Z`, class: 'hm-north-arrow' });
    el(g, 'text', { y: -r - fs(3), 'text-anchor': 'middle', 'font-size': fs(12), class: 'hm-lbl hm-north-n' }).text('N');
  }

  function drawScale(svg, proj, VH, fs, bbox) {
    // metres per viewbox unit at the map's centre latitude
    const lat = (bbox[1] + bbox[3]) / 2, lon = (bbox[0] + bbox[2]) / 2;
    const a = proj([lon, lat]), b = proj([lon + 0.01, lat]);
    const mPerUnit = (0.01 * 111320 * Math.cos(lat * Math.PI / 180)) / (b[0] - a[0]);
    const target = 180 * mPerUnit / 1609.34; // miles in ~180 units
    const nice = [0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500];
    const mi = nice.reduce((best, v) => Math.abs(v - target) < Math.abs(best - target) ? v : best, nice[0]);
    const kmT = target * 1.60934;
    const km = nice.reduce((best, v) => Math.abs(v - kmT) < Math.abs(best - kmT) ? v : best, nice[0]);
    const lm = mi * 1609.34 / mPerUnit, lk = km * 1000 / mPerUnit;
    const x = fs(20), y = VH - fs(30);
    const g = el(svg, 'g', { class: 'hm-scale' });
    el(g, 'rect', { x: x - fs(8), y: y - fs(22), width: Math.max(lm, lk) + fs(64), height: fs(42), class: 'hm-scale-bg' });
    el(g, 'path', { d: `M${x},${y - fs(5)} v${fs(5)} h${lm} v${-fs(5)}`, class: 'hm-scale-bar', 'stroke-width': fs(1.4) });
    el(g, 'text', { x: x + lm + fs(5), y: y - fs(1), 'font-size': fs(11), class: 'hm-lbl hm-scale-t' }).text(mi + (mi === 1 ? ' mile' : ' miles'));
    el(g, 'path', { d: `M${x},${y + fs(5)} v${-fs(5)} h${lk} v${fs(5)}`, class: 'hm-scale-bar', 'stroke-width': fs(1.4) });
    el(g, 'text', { x: x + lk + fs(5), y: y + fs(10), 'font-size': fs(11), class: 'hm-lbl hm-scale-t' }).text(km + ' km');
  }

  // ---- HTML legend (outside the SVG so it reflows on small screens) ----
  function buildLegend(container, cfg) {
    const fig = container.closest('figure') || container.parentElement;
    let lg = fig.querySelector('.hm-legend');
    if (lg) lg.remove();
    lg = document.createElement('ul');
    lg.className = 'hm-legend';
    const items = [];
    const sides = new Set();
    (cfg.units || []).forEach(x => sides.add(x.side || 'continental'));
    (cfg.moves || []).forEach(x => sides.add(x.side || 'continental'));
    (cfg.ships || []).forEach(x => sides.add(x.side || 'british'));
    sides.forEach(k => items.push([`<svg viewBox="0 0 26 12"><rect x="1" y="1" width="24" height="10" fill="${SIDES[k].fill}" stroke="${SIDES[k].stroke}" stroke-width="1.2"/></svg>`, SIDES[k].label]));
    const kinds = new Set((cfg.moves || []).map(x => x.kind || 'march'));
    kinds.forEach(k => {
      const mk = MOVE_KINDS[k];
      items.push([`<svg viewBox="0 0 30 12"><path d="M1,6 H22" stroke="#4a3b2c" stroke-width="${Math.min(mk.width, 3.5)}" stroke-dasharray="${mk.dash ? mk.dash.replace(/\d+/g, n => n * 0.6) : ''}" fill="none"/><path d="M29,6 L21,1.5 L23,6 L21,10.5 Z" fill="#4a3b2c"/></svg>`, mk.label]);
    });
    if ((cfg.moves || []).some(x => x.approx)) items.push(['<svg viewBox="0 0 30 12"><path d="M2,6 H28" stroke="#4a3b2c" stroke-width="2.4" stroke-dasharray="1.2 4" stroke-linecap="round"/></svg>', 'Approximate route']);
    if ((cfg.works || []).length) items.push(['<svg viewBox="0 0 30 12"><path d="M2,6 H28" stroke="#4a3b2c" stroke-width="2"/><path d="M2,6 H28" stroke="#4a3b2c" stroke-width="5" stroke-dasharray="1 3"/></svg>', 'Fortifications']);
    (cfg.areas || []).filter(a => a.legend).forEach(a => items.push([`<svg viewBox="0 0 26 12"><rect x="1" y="1" width="24" height="10" fill="${SIDES[a.side || 'neutral'].fill}" fill-opacity="${a.opacity != null ? a.opacity : 0.22}" stroke="${SIDES[a.side || 'neutral'].stroke}" stroke-dasharray="3 2"/></svg>`, a.legend]));
    (cfg.lines || []).filter(l => l.legend).forEach(l => items.push([`<svg viewBox="0 0 30 12"><path d="M2,6 H28" stroke="${l.color || '#3a2f24'}" stroke-width="${l.width || 1.5}" stroke-dasharray="${l.dash || ''}"/></svg>`, l.legend]));
    if ((cfg.roads || []).length) items.push(['<svg viewBox="0 0 30 12"><path d="M2,6 H28" stroke="#8b6b45" stroke-width="1.6"/></svg>', 'Period road']);
    if ((cfg.battles || []).length) items.push([`<svg viewBox="-11 -11 22 22"><path d="${swordsPath()}" stroke="#7a1f1a" stroke-width="2.2" fill="none"/></svg>`, 'Fighting']);
    if ((cfg.corrections || {}).water) items.push(['<svg viewBox="0 0 26 12"><rect x="1" y="1" width="24" height="10" fill="#bccfd0" stroke="#7d9ea3"/></svg>', 'Water (period shoreline)']);
    if (cfg.terrain !== false) items.push(['<svg viewBox="0 0 30 12"><path d="M1,9 C8,2 14,2 20,6 S27,9 29,4" stroke="#a08a63" stroke-width="1.2" fill="none"/></svg>', 'Elevation contours']);
    (cfg.legendExtra || []).forEach(x => items.push([x.svg || '', x.text]));
    lg.innerHTML = items.map(([svg, t]) => `<li>${svg}<span>${t}</span></li>`).join('');
    const cap = fig.querySelector('figcaption');
    fig.insertBefore(lg, cap || null);
  }

  window.HMap = { render, SIDES, MOVE_KINDS, BASE };
})();
