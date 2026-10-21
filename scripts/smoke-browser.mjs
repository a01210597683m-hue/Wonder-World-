import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const file = resolve(root, relative);
    if (file !== root && !file.startsWith(root + sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const body = await readFile(file);
    response.writeHead(200, { 'content-type': mime[extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
});

let browser;
try {
  await new Promise((resolveListen, reject) => {
    server.once('error', reject);
    server.listen(4173, '127.0.0.1', resolveListen);
  });
  browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.locator('#application').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('#life-ui').waitFor({ state: 'attached', timeout: 20000 });
  await page.locator('#player-level').waitFor({ state: 'attached', timeout: 10000 });

  assert.equal(await page.locator('#application').count(), 1, '3D canvas should be present');
  assert.equal(await page.locator('[data-dir="up"]').count(), 1, 'mobile movement controls should be present');
  await page.locator('#toggle-actions').click();
  assert.equal(await page.locator('#toggle-actions').getAttribute('aria-expanded'), 'true', 'activity dock should expand');

  await page.locator('#open-careers').click();
  await page.locator('#career-panel').waitFor({ state: 'visible' });
  assert.match(await page.locator('#career-title').innerText(), /الوظائف/);
  await page.locator('#career-panel .career-heading button').click();
  await page.locator('#career-panel').waitFor({ state: 'hidden' });

  await page.locator('#open-football').click();
  await page.locator('#football-panel').waitFor({ state: 'visible' });
  await page.locator('#football-shoot').click();
  assert.equal(await page.locator('#football-shots').innerText(), '1 / 5', 'football practice should register a valid first shot');
  await page.locator('#close-football').click();
  await page.locator('#football-panel').waitFor({ state: 'hidden' });

  await page.locator('#open-memory-match').click();
  await page.locator('#memory-match-panel').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#memory-board button').count(), 16, 'memory game should render eight playable pairs');
  await page.locator('#close-memory-match').click();

  await page.locator('#open-shop').click();
  await page.locator('#shop-panel').waitFor({ state: 'visible' });
  await page.locator('#cloud-economy-panel').waitFor({ state: 'visible' });
  assert.match(await page.locator('#cloud-economy-panel').innerText(), /سجّلي الدخول/, 'signed-out players should see clear cloud-wallet account guidance');
  await page.locator('#shop-products button[data-shop-item="mint-outfit"]').click();
  assert.match(await page.locator('#shop-feedback').innerText(), /اشتريتي طقم نعناعي/, 'the main wardrobe purchase button should perform a purchase for signed-out prototype mode');
  await page.locator('#close-shop').click();
  await page.locator('#shop-panel').waitFor({ state: 'hidden' });

  await page.locator('#ww-auth-launch').click();
  await page.locator('#ww-auth-overlay').waitFor({ state: 'visible' });
  await page.locator('#ww-auth-close').click();
  await page.locator('#ww-auth-overlay').waitFor({ state: 'hidden' });

  assert.deepEqual(pageErrors, [], 'browser should not raise uncaught JavaScript exceptions');
  process.stdout.write('PASS — mobile browser smoke tests: 3D canvas, touch controls, career panel, football shot, memory board, account dialog, signed-out cloud-wallet guidance, and no uncaught page errors.\n');
} finally {
  if (browser) await browser.close();
  await new Promise(resolveClose => server.close(resolveClose));
}
