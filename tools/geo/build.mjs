#!/usr/bin/env node
// Builds base geography for one or more maps.
//
//   node tools/geo/build.mjs tools/geo/maps/<event-id>.json [more spec files...]
//
// A spec file is a JSON array of maps:
//   [{ "id": "long-island-positions", "bbox": [west, south, east, north], "detail": "local" }]
//
// detail:
//   "local"    (< ~60 km wide)   Census TIGER water polygons + named streams, 500k land
//   "regional" (~60–300 km)      Census TIGER large water polygons + Natural Earth rivers
//   "campaign" (> ~300 km)       Natural Earth lakes + rivers
//
// Outputs (committed, served as static files):
//   data/geo/<id>.topo.json   TopoJSON objects: land, water, rivers
//   data/geo/<id>.elev.json   Elevation grid (Web Mercator aligned, 8-bit: m = min + byte*step)
//
// Downloads are cached in tools/geo/cache (gitignored).

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CACHE = path.join(ROOT, 'tools/geo/cache');
const OUT = path.join(ROOT, 'data/geo');
const MAPSHAPER = path.join(ROOT, 'node_modules/.bin/mapshaper');
fs.mkdirSync(CACHE, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

const SRC = {
  states: { url: 'https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_us_state_500k.zip', shp: 'cb_2023_us_state_500k/cb_2023_us_state_500k.shp' },
  counties: { url: 'https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_us_county_500k.zip', shp: 'cb_2023_us_county_500k/cb_2023_us_county_500k.shp' },
  countries: { url: 'https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_0_countries.zip', shp: 'ne_10m_admin_0_countries/ne_10m_admin_0_countries.shp' },
  lakes: { url: 'https://naciscdn.org/naturalearth/10m/physical/ne_10m_lakes.zip', shp: 'ne_10m_lakes/ne_10m_lakes.shp' },
  riversNA: { url: 'https://naciscdn.org/naturalearth/10m/physical/ne_10m_rivers_north_america.zip', shp: 'ne_10m_rivers_north_america/ne_10m_rivers_north_america.shp' },
  rivers: { url: 'https://naciscdn.org/naturalearth/10m/physical/ne_10m_rivers_lake_centerlines.zip', shp: 'ne_10m_rivers_lake_centerlines/ne_10m_rivers_lake_centerlines.shp' },
};

const DETAIL = {
  local: { simplify: 4, minWater: 20000, tiger: true, streams: true, elevPx: 900, grid: 260 },
  regional: { simplify: 25, minWater: 400000, tiger: true, streams: false, elevPx: 900, grid: 260 },
  campaign: { simplify: 150, minWater: 0, tiger: false, streams: false, elevPx: 900, grid: 260 },
};

function sh(args, opts = {}) {
  return execFileSync(MAPSHAPER, ['-quiet', ...args], { encoding: 'utf8', maxBuffer: 1 << 28, ...opts });
}

// Downloads and unzips go through temp names + rename so parallel builds can share the cache.
function download(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return true;
  const part = `${dest}.${process.pid}.part`;
  try {
    execFileSync('curl', ['-sfL', '--retry', '3', '-o', part, url]);
    fs.renameSync(part, dest);
    return true;
  } catch {
    if (fs.existsSync(part)) fs.unlinkSync(part);
    return false;
  }
}

function unzipTo(zip, dir) {
  if (fs.existsSync(dir)) return;
  const tmp = `${dir}.${process.pid}.tmp`;
  fs.mkdirSync(tmp, { recursive: true });
  execFileSync('unzip', ['-oq', zip, '-d', tmp]);
  try { fs.renameSync(tmp, dir); } catch { fs.rmSync(tmp, { recursive: true, force: true }); }
}

function ensureShp(src) {
  const shp = path.join(CACHE, src.shp);
  if (fs.existsSync(shp)) return shp;
  const zip = path.join(CACHE, path.basename(src.url));
  if (!download(src.url, zip)) throw new Error('download failed: ' + src.url);
  unzipTo(zip, path.join(CACHE, path.basename(src.url, '.zip')));
  return shp;
}

function tigerShp(kind, geoid) {
  const name = `tl_2023_${geoid}_${kind}`;
  const shp = path.join(CACHE, name, name + '.shp');
  if (fs.existsSync(shp)) return shp;
  const url = `https://www2.census.gov/geo/tiger/TIGER2023/${kind.toUpperCase()}/${name}.zip`;
  const zip = path.join(CACHE, name + '.zip');
  if (!download(url, zip)) return null;
  unzipTo(zip, path.join(CACHE, name));
  return shp;
}

function padBbox([w, s, e, n], f = 0.08) {
  const dx = (e - w) * f, dy = (n - s) * f;
  return [w - dx, s - dy, e + dx, n + dy];
}

function countiesIn(bbox) {
  const csv = sh(['-i', ensureShp(SRC.counties), '-clip', 'bbox=' + bbox.join(','), '-filter-fields', 'GEOID', '-o', 'format=csv', '-']);
  return csv.trim().split('\n').slice(1).map(s => s.trim().replace(/"/g, '')).filter(Boolean);
}

// Man-made water features that did not exist in the 18th century (canals, reservoirs, ditches).
// Dammed lakes without these words (e.g. "Carnegie Lk") must be hidden per map via water.hide.
const MODERN = /\b(Cnl|Ca|Canal|Resr|Resv|Reservoir|Ditch|Artificial|Impoundment|Aqueduct|Sewer|R O W)\b/i;

const emptyFC = '{"type":"FeatureCollection","features":[]}';

function buildVectors(spec, tmp) {
  const d = DETAIL[spec.detail];
  const clip = padBbox(spec.bbox);
  const cb = 'bbox=' + clip.join(',');
  const widthM = (spec.bbox[2] - spec.bbox[0]) * 111320 * Math.cos((spec.bbox[1] + spec.bbox[3]) / 2 * Math.PI / 180);
  const simp = ['-simplify', `interval=${Math.round(Math.max(d.simplify, widthM / 3000))}`, 'keep-shapes'];
  const files = {};

  // land: US states (500k shoreline) + Canada (Natural Earth 10m)
  const usLand = path.join(tmp, 'us.json'), caLand = path.join(tmp, 'ca.json');
  sh(['-i', ensureShp(SRC.states), '-clip', cb, '-dissolve', '-o', 'format=geojson', usLand]);
  sh(['-i', ensureShp(SRC.countries), '-filter', "ADMIN == 'Canada'", '-clip', cb, '-dissolve', '-o', 'format=geojson', caLand]);
  files.land = path.join(tmp, 'land.json');
  sh(['-i', usLand, caLand, 'combine-files', '-merge-layers', 'force', ...simp, '-rename-layers', 'land', '-o', 'format=geojson', files.land]);

  // water polygons
  files.water = path.join(tmp, 'water.json');
  const waterParts = [];
  const lk = path.join(tmp, 'lakes.json');
  sh(['-i', ensureShp(SRC.lakes), '-clip', cb, '-o', 'format=geojson', lk]);
  waterParts.push(lk);
  if (d.tiger) {
    const geoids = countiesIn(clip);
    console.log(`  ${spec.id}: ${geoids.length} counties`);
    geoids.forEach((g, i) => {
      const shp = tigerShp('areawater', g);
      if (!shp) return;
      const f = path.join(tmp, `aw${i}.json`);
      sh(['-i', shp, '-clip', cb, '-filter', `AWATER >= ${d.minWater}`, '-each', 'name = FULLNAME', '-o', 'format=geojson', f]);
      waterParts.push(f);
    });
  }
  sh(['-i', ...waterParts, 'combine-files', '-merge-layers', 'force', ...simp, '-rename-layers', 'water', '-o', 'format=geojson', files.water]);

  // rivers (lines)
  files.rivers = path.join(tmp, 'rivers.json');
  const riverParts = [];
  // Natural Earth centrelines are too coarse for local maps (TIGER streams + water polygons are used instead)
  for (const key of d.streams ? [] : ['rivers', 'riversNA']) {
    const f = path.join(tmp, `ne_${key}.json`);
    sh(['-i', ensureShp(SRC[key]), '-clip', cb, '-o', 'format=geojson', f]);
    riverParts.push(f);
  }
  if (d.streams) {
    countiesIn(clip).forEach((g, i) => {
      const shp = tigerShp('linearwater', g);
      if (!shp) return;
      const f = path.join(tmp, `lw${i}.json`);
      sh(['-i', shp, '-clip', cb, '-filter', "MTFCC == 'H3010' && !!FULLNAME", '-each', 'name = FULLNAME', '-o', 'format=geojson', f]);
      riverParts.push(f);
    });
  }
  sh(['-i', ...riverParts, 'combine-files', '-merge-layers', 'force', ...simp, '-rename-layers', 'rivers', '-o', 'format=geojson', files.rivers]);

  for (const f of Object.values(files)) {
    // keep only a "name" property (inputs have heterogeneous schemas)
    const fc = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : JSON.parse(emptyFC);
    const feats = fc.type === 'FeatureCollection' ? fc.features : fc.type === 'GeometryCollection'
      ? fc.geometries.map(g => ({ type: 'Feature', properties: {}, geometry: g })) : [];
    fc.type = 'FeatureCollection'; delete fc.geometries;
    fc.features = feats.filter(ft => ft.geometry && !MODERN.test((ft.properties && ft.properties.name) || '')).map(ft => ({ type: 'Feature', geometry: ft.geometry,
      properties: ft.properties && ft.properties.name ? { name: ft.properties.name } : {} }));
    fs.writeFileSync(f, JSON.stringify(fc));
  }
  const out = path.join(OUT, `${spec.id}.topo.json`);
  sh(['-i', files.land, files.water, files.rivers, 'combine-files', '-o', 'format=topojson', 'quantization=100000', out]);
  return out;
}

// ---- elevation (AWS Terrain Tiles, terrarium encoding) ----
const lon2x = (lon, z) => (lon + 180) / 360 * 256 * 2 ** z;
const lat2y = (lat, z) => {
  const r = lat * Math.PI / 180;
  return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * 256 * 2 ** z;
};

function tile(z, x, y) {
  const dir = path.join(CACHE, 'terrarium', String(z), String(x));
  fs.mkdirSync(dir, { recursive: true });
  const f = path.join(dir, `${y}.png`);
  if (!download(`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`, f)) return null;
  return PNG.sync.read(fs.readFileSync(f));
}

function buildElevation(spec) {
  const d = DETAIL[spec.detail];
  const [w, s, e, n] = padBbox(spec.bbox, 0.04);
  let z = 0;
  while (z < 14 && lon2x(e, z + 1) - lon2x(w, z + 1) <= d.elevPx) z++;
  const x0 = lon2x(w, z), x1 = lon2x(e, z), y0 = lat2y(n, z), y1 = lat2y(s, z);
  const W = Math.ceil(x1 - x0), H = Math.ceil(y1 - y0);
  const full = new Float32Array(W * H);
  const tiles = new Map();
  for (let ty = Math.floor(y0 / 256); ty <= Math.floor(y1 / 256); ty++)
    for (let tx = Math.floor(x0 / 256); tx <= Math.floor(x1 / 256); tx++) tiles.set(`${tx},${ty}`, tile(z, tx, ty));
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const gx = Math.floor(x0) + i, gy = Math.floor(y0) + j;
    const t = tiles.get(`${Math.floor(gx / 256)},${Math.floor(gy / 256)}`);
    if (!t) continue;
    const k = ((gy % 256) * 256 + (gx % 256)) * 4;
    full[j * W + i] = t.data[k] * 256 + t.data[k + 1] + t.data[k + 2] / 256 - 32768;
  }
  // downsample (box average) to grid width
  const gw = Math.min(d.grid, W), f = W / gw, gh = Math.max(2, Math.round(H / f));
  const vals = new Float32Array(gw * gh);
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
    let sum = 0, cnt = 0;
    for (let y = Math.floor(j * f); y < Math.min(H, Math.floor((j + 1) * f)); y++)
      for (let x = Math.floor(i * f); x < Math.min(W, Math.floor((i + 1) * f)); x++) { sum += full[y * W + x]; cnt++; }
    vals[j * gw + i] = cnt ? sum / cnt : 0;
  }
  // quantize to 8 bits: elevation = min + byte * step (sea floor clamped to -5 m)
  let min = Infinity, max = -Infinity;
  for (let k = 0; k < vals.length; k++) { vals[k] = Math.max(-5, vals[k]); min = Math.min(min, vals[k]); max = Math.max(max, vals[k]); }
  const step = Math.max((max - min) / 255, 0.01);
  const out = new Uint8Array(gw * gh);
  for (let k = 0; k < vals.length; k++) out[k] = Math.round((vals[k] - min) / step);
  // exact geographic bounds of the pixel grid
  const x2lon = x => x / (256 * 2 ** z) * 360 - 180;
  const y2lat = y => { const t = Math.PI - 2 * Math.PI * y / (256 * 2 ** z); return 180 / Math.PI * Math.atan(Math.sinh(t)); };
  const fx0 = Math.floor(x0), fy0 = Math.floor(y0);
  const res = {
    bbox: [x2lon(fx0), y2lat(fy0 + H), x2lon(fx0 + W), y2lat(fy0)].map(v => +v.toFixed(6)),
    width: gw, height: gh, units: 'm', min: +min.toFixed(2), step: +step.toFixed(4),
    data: Buffer.from(out.buffer).toString('base64'),
  };
  const outFile = path.join(OUT, `${spec.id}.elev.json`);
  fs.writeFileSync(outFile, JSON.stringify(res));
  return outFile;
}

// ---- main ----
const specFiles = process.argv.slice(2);
if (!specFiles.length) { console.error('usage: node tools/geo/build.mjs <spec.json> [...]'); process.exit(1); }
for (const sf of specFiles) {
  for (const spec of JSON.parse(fs.readFileSync(sf, 'utf8'))) {
    if (!DETAIL[spec.detail]) throw new Error(`${spec.id}: unknown detail "${spec.detail}"`);
    const tmp = fs.mkdtempSync(path.join(CACHE, 'tmp-'));
    try {
      const v = buildVectors(spec, tmp);
      const el = spec.elevation === false ? null : buildElevation(spec);
      const kb = f => (fs.statSync(f).size / 1024).toFixed(0) + 'KB';
      console.log(`✓ ${spec.id}: ${path.relative(ROOT, v)} ${kb(v)}` + (el ? `, ${path.relative(ROOT, el)} ${kb(el)}` : ''));
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  }
}
