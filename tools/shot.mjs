// Screenshots pages at desktop and phone widths and reports console errors.
//   node tools/shot.mjs <outdir> <page.html> [more pages...]     (paths relative to repo root)
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
const browser = await chromium.launch();
let failures = 0;
for (const pg of pages) {
  for (const [name, vp] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: name === 'phone' ? 2 : 1 });
    const page = await ctx.newPage();
    const errs = [];
    page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(`${m.type()}: ${m.text()}`); });
    page.on('pageerror', e => errs.push('pageerror: ' + e.message));
    page.on('requestfailed', r => errs.push('requestfailed: ' + r.url()));
    page.on('response', r => { if (r.status() >= 400) errs.push(`HTTP ${r.status()}: ${r.url()}`); });
    await page.goto(`http://localhost:${port}/${pg}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (overflow) errs.push('layout: horizontal page overflow');
    const out = path.join(outDir, `${path.basename(pg, '.html')}-${name}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log(`${errs.length ? '✗' : '✓'} ${pg} [${name}] → ${out}`);
    errs.forEach(e => console.log('    ' + e));
    failures += errs.length;
    await ctx.close();
  }
}
await browser.close();
server.close();
process.exit(failures ? 2 : 0);
