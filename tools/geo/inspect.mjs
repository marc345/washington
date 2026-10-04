// Lists the largest water polygons and the named streams of a built map, to spot modern features
// (quarry lakes, dammed lakes, reservoirs) that should be hidden with `water.hide` / `water.hideIn`.
//   node tools/geo/inspect.mjs <map-id> [count]
import fs from 'node:fs';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';
const [id, n = 30] = process.argv.slice(2);
const t = JSON.parse(fs.readFileSync(`data/geo/${id}.topo.json`, 'utf8'));
const water = topojson.feature(t, t.objects.water).features;
console.log('Largest water polygons (name, km², centroid lon,lat):');
water.map(f => [f.properties.name || '(unnamed)', d3.geoArea(f) * 6371 ** 2, d3.geoCentroid(f)])
  .sort((a, b) => b[1] - a[1]).slice(0, +n)
  .forEach(([nm, a, c]) => console.log(`  ${nm.padEnd(28)} ${a.toFixed(2).padStart(7)}  [${c[0].toFixed(3)}, ${c[1].toFixed(3)}]`));
const rivers = topojson.feature(t, t.objects.rivers).features;
console.log('\nStream/river names:', [...new Set(rivers.map(f => f.properties.name).filter(Boolean))].sort().join(', '));
