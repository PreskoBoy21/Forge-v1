// Phone-size browser smoke test for the Expo web export.
// usage: node e2e/smoke.cjs <base-url | export-dir> [out-dir]
//   base-url: a running dev server, e.g. `npx expo start --web --port 8099` -> http://127.0.0.1:8099
//   export-dir: a static `expo export -p web` folder (served locally)
// Opens each route at iPhone 15 size, saves a screenshot, and fails if a page
// crashes (uncaught error) or renders blank. In dev mode the tab screens show sample data.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium, devices } = require('playwright');

(async () => {

const arg = process.argv[2] ?? 'dist';
const remote = /^https?:/.test(arg);
const root = remote ? '' : path.resolve(arg);
const out = path.resolve(process.argv[3] ?? 'e2e-shots');
fs.mkdirSync(out, { recursive: true });

const ROUTES = (process.env.SMOKE_ROUTES ?? '/welcome,/sign-in,/goal,/training,/food,/coach,/connect,/plan,/today,/today/forge-day,/train,/train/gym,/snap,/body,/you').split(',');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json', '.ttf': 'font/ttf', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  const tries = [p, p + '.html', path.join(p, 'index.html')];
  for (const t of tries) {
    const f = path.join(root, t);
    if (f.startsWith(root) && fs.existsSync(f) && fs.statSync(f).isFile()) {
      res.writeHead(200, { 'content-type': TYPES[path.extname(f)] ?? 'application/octet-stream' });
      return fs.createReadStream(f).pipe(res);
    }
  }
  res.writeHead(404); res.end('not found');
});
if (!remote) await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = remote ? arg.replace(/\/$/, '') : `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'] });
const failures = [];
for (const route of ROUTES) {
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + route, { waitUntil: 'networkidle' }).catch((e) => errors.push(String(e)));
  await page.waitForTimeout(remote ? 2500 : 800);
  const text = (await page.evaluate(() => document.body.innerText).catch(() => '')).trim();
  const name = route === '/' ? 'home' : route.slice(1).replace(/\//g, '_');
  await page.screenshot({ path: path.join(out, `${name}.png`) });
  const status = errors.length ? 'CRASH' : text.length < 5 ? 'BLANK' : 'OK';
  console.log(`${status.padEnd(5)} ${route} -> ${page.url().replace(base, '')}${errors.length ? '  ' + errors[0] : ''}`);
  if (status !== 'OK') failures.push(route);
  await page.close();
}
await browser.close();
if (!remote) server.close();
if (failures.length) { console.error(`Smoke test failed: ${failures.join(', ')}`); process.exit(1); }
console.log(`All ${ROUTES.length} screens rendered. Screenshots in ${out}`);
})();
