// Screenshots pages at desktop and phone widths and reports console errors.
//   node tools/shot.mjs <outdir> <page.html> [more pages...]     (paths relative to repo root)
// Env: SHOT_MAPS=1 per-map PNGs; SHOT_OFFLINE=1 skip external tiles/fonts; CHROMIUM_PATH=<browser binary>.
// Starts its own static server on a free port.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const [outDir, ...pages] = process.argv.slice(2);
if (!outDir || !pages.length) { console.error('usage: node tools/shot.mjs <outdir> <page.html>...'); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const f = path.join(process.cwd(), decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(f, (err, buf) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); res.end(buf);
  });
}).listen(0);
const port = server.address().port;
// CHROMIUM_PATH: use a preinstalled browser when Playwright's own download is unavailable.
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
let failures = 0;
for (const pg of pages) {
  for (const [name, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: name === 'phone' ? 2 : 1 });
    const page = await ctx.newPage();
    const errs = [];
    // SHOT_OFFLINE=1: skip external requests (map tiles, fonts) when the network blocks them.
    if (process.env.SHOT_OFFLINE) await page.route(u => !u.hostname.startsWith('localhost'), r => r.abort());
    const external = s => process.env.SHOT_OFFLINE && /https?:\/\/(?!localhost)|ERR_FAILED|ERR_TUNNEL/.test(s);
    page.on('console', m => { if ((m.type() === 'error' || m.type() === 'warning') && !external(m.text())) errs.push(`${m.type()}: ${m.text()}`); });
    page.on('pageerror', e => errs.push('pageerror: ' + e.message));
    page.on('requestfailed', r => { if (!external(r.url())) errs.push('requestfailed: ' + r.url()); });
    page.on('response', r => { if (r.status() >= 400) errs.push(`HTTP ${r.status()}: ${r.url()}`); });
    await page.goto(`http://localhost:${port}/${pg}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (overflow) errs.push('layout: horizontal page overflow');
    const out = path.join(outDir, `${path.basename(pg, '.html')}-${name}.png`);
    await page.screenshot({ path: out, fullPage: true });
    // SHOT_MAPS=1: also one PNG per map canvas (<page>-<n>-<width>.png), easier to inspect
    if (process.env.SHOT_MAPS) {
      const maps = await page.$$('.map-canvas');
      for (let i = 0; i < maps.length; i++) await maps[i].screenshot({ path: path.join(outDir, `${path.basename(pg, '.html')}-${i + 1}-${name}.png`) });
    }
    console.log(`${errs.length ? '✗' : '✓'} ${pg} [${name}] → ${out}`);
    errs.forEach(e => console.log('    ' + e));
    failures += errs.length;
    await ctx.close();
  }
}
await browser.close();
server.close();
process.exit(failures ? 2 : 0);
