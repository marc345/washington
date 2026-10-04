// Copies pinned browser libraries from node_modules into assets/vendor (run: npm run vendor).
import fs from 'node:fs';
const cp = (a, b) => fs.cpSync(a, b, { recursive: true });
fs.mkdirSync('assets/vendor/leaflet', { recursive: true });
cp('node_modules/d3/dist/d3.min.js', 'assets/vendor/d3.min.js');
cp('node_modules/topojson-client/dist/topojson-client.min.js', 'assets/vendor/topojson-client.min.js');
for (const f of ['leaflet.js', 'leaflet.css', 'images']) cp(`node_modules/leaflet/dist/${f}`, `assets/vendor/leaflet/${f}`);
