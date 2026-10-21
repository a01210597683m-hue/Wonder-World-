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
  await page.locator('#toggle-vehicle').click();
  assert.equal(await page.locator('#toggle-vehicle').getAttribute('aria-pressed'), 'true', 'vehicle button should enter driving mode');
  assert.match(await page.locator('#toggle-vehicle').innerText(), /النزول من العربية/);
  await page.locator('#toggle-vehicle').click();
  assert.equal(await page.locator('#toggle-vehicle').getAttribute('aria-pressed'), 'false', 'vehicle button should return to walking mode');
  await page.locator('#open-map').click();
  await page.locator('#map-panel').waitFor({ state: 'visible' });
  await page.locator('.map-destination').filter({ hasText: 'رحلة إلى مصر' }).click();
  assert.match(await page.locator('#status').innerText(), /وصلتي إلى رحلة إلى مصر/, 'Egypt destination should report arrival');
  await page.locator('#open-map').click();
  await page.locator('.map-destination').filter({ hasText: 'رحلة إلى باريس' }).click();
  assert.match(await page.locator('#status').innerText(), /وصلتي إلى رحلة إلى باريس/, 'Paris destination should report arrival');
  await page.locator('#open-map').click();
  await page.locator('.map-destination').filter({ hasText: 'رحلة إلى طوكيو' }).click();
  assert.match(await page.locator('#status').innerText(), /وصلتي إلى رحلة إلى طوكيو/, 'Tokyo destination should report arrival');
  await page.locator('#open-map').click();
  await page.locator('.map-destination').filter({ hasText: 'نافورة الساحة' }).click();
  await page.locator('#open-home-build').click();
  await page.locator('#home-build-panel').waitFor({ state: 'visible' });
  await page.locator('[data-home-wall="mint"]').click();
  assert.match(await page.locator('#home-build-feedback').innerText(), /نعناعي/);
  await page.locator('[data-home-roof="blue"]').click();
  await page.locator('#toggle-home-garden').click();
  assert.equal(await page.locator('#toggle-home-garden').getAttribute('aria-pressed'), 'false', 'garden customization should toggle off');
  assert.match(await page.evaluate(() => localStorage.getItem('wonderworld-home-design-v1')), /"wall":"mint"/, 'home design should persist locally');
  await page.locator('#close-home-build').click();
  await page.locator('#home-build-panel').waitFor({ state: 'hidden' });
  await page.locator('#open-wonder-guide').click();
  await page.locator('#wonder-guide-panel').waitFor({ state: 'visible' });
  assert.equal(await page.locator('.wonder-guide-choice').count(), 5, 'Wonder guide should expose only bounded preset questions');
  await page.locator('.wonder-guide-choice').filter({ hasText: 'إزاي أبدأ اللعب؟' }).click();
  assert.match(await page.locator('#wonder-guide-answer').innerText(), /أزرار الحركة/);
  await page.locator('#close-wonder-guide').click();
  await page.locator('#wonder-guide-panel').waitFor({ state: 'hidden' });

  await page.locator('#open-careers').click();
  await page.locator('#career-panel').waitFor({ state: 'visible' });
  assert.match(await page.locator('#career-title').innerText(), /الوظائف/);
  await page.locator('#career-shift').click();
  assert.match(await page.locator('#career-feedback').innerText(), /وردية/, 'career shift should respond in the local prototype');
  await page.locator('#career-panel .career-heading button').click();
  await page.locator('#career-panel').waitFor({ state: 'hidden' });

  await page.locator('#open-football').click();
  await page.locator('#football-panel').waitFor({ state: 'visible' });
  await page.locator('[data-foot-aim="40"]').click();
  assert.equal(await page.locator('[data-foot-aim="40"]').getAttribute('aria-pressed'), 'true', 'football aim selector should update its selected state');
  await page.locator('#football-shoot').click();
  assert.equal(await page.locator('#football-shots').innerText(), '1 / 5', 'football practice should register a valid first shot');
  assert.equal(await page.locator('#football-score').innerText(), '1', 'a deliberate shot away from the keeper should score deterministically');
  // Complete a whole training round, verify the persistent best score, then reset.
  for (const lane of ['50', '50', '40', '40']) {
    await page.locator('[data-foot-aim="' + lane + '"]').click();
    await page.locator('#football-shoot').click();
  }
  assert.equal(await page.locator('#football-shots').innerText(), '5 / 5', 'football practice should stop after five shots');
  assert.equal(await page.locator('#football-score').innerText(), '5', 'deliberate aiming should beat the keeper for the full round');
  assert.equal(await page.locator('#football-best').innerText(), '5', 'football best score should update after the round');
  assert.equal(await page.evaluate(() => localStorage.getItem('wonderworld-football-best')), '5', 'football best score should persist locally');
  await page.locator('#football-restart').click();
  assert.equal(await page.locator('#football-shots').innerText(), '0 / 5', 'new training round should reset the shot counter');
  assert.equal(await page.locator('#football-best').innerText(), '5', 'resetting a round should preserve the best score');
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[data-foot-aim="60"]').getAttribute('aria-pressed'), 'true', 'keyboard arrows should change the football aim lane');
  await page.keyboard.press('r');
  assert.equal(await page.locator('#football-shots').innerText(), '0 / 5', 'R should restart the football training round');
  await page.locator('#close-football').click();
  await page.locator('#football-panel').waitFor({ state: 'hidden' });

  await page.locator('#open-blockblast').click();
  await page.locator('#blockblast-panel').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#blockblast-board .blockblast-cell').count(), 64, 'Block Blast should render an 8x8 board');
  await page.locator('#blockblast-pieces button[data-piece="0"]').click();
  await page.locator('#blockblast-board button[data-row="0"][data-col="0"]').click();
  assert.ok(Number(await page.locator('#blockblast-score').innerText()) > 0, 'placing a valid Block Blast piece should score points');
  assert.ok(Number(await page.evaluate(() => localStorage.getItem('wonderworld-blockblast-best'))) > 0, 'Block Blast should persist its best score');
  await page.locator('#blockblast-restart').click();
  assert.equal(await page.locator('#blockblast-score').innerText(), '0', 'Block Blast restart should reset the current score');
  await page.locator('#close-blockblast').click();
  await page.locator('#blockblast-panel').waitFor({ state: 'hidden' });

  await page.locator('#open-watersort').click();
  await page.locator('#watersort-panel').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#watersort-tubes .watersort-tube').count(), 6, 'Water Sort should render four color tubes and two empty tubes');
  assert.match(await page.locator('#watersort-feedback').innerText(), /قابل للحل/, 'new Water Sort puzzles should advertise a solvable scramble');
  const waterSortPair = await page.locator('#watersort-tubes .watersort-tube').evaluateAll(tubes => {
    const states = tubes.map((tube, index) => ({
      index,
      layers: [...tube.querySelectorAll('.watersort-layer')].map(layer => layer.style.background).filter(Boolean)
    }));
    for (const source of states) {
      if (!source.layers.length) continue;
      const topColor = source.layers[source.layers.length - 1];
      for (const target of states) {
        if (target.index !== source.index && target.layers.length < 4 &&
            (!target.layers.length || target.layers[target.layers.length - 1] === topColor)) {
          return { source: source.index, target: target.index };
        }
      }
    }
    return null;
  });
  assert.ok(waterSortPair, 'Water Sort should always expose at least one legal move');
  await page.locator('#watersort-tubes .watersort-tube').nth(waterSortPair.source).click();
  await page.locator('#watersort-tubes .watersort-tube').nth(waterSortPair.target).click();
  assert.equal(await page.locator('#watersort-moves').innerText(), '1', 'a valid Water Sort pour should increment the move counter');
  assert.equal(await page.locator('#watersort-undo').isDisabled(), false, 'undo should become available after a valid pour');
  await page.locator('#watersort-undo').click();
  assert.equal(await page.locator('#watersort-moves').innerText(), '0', 'Water Sort undo should restore the previous move count');
  await page.locator('#watersort-restart').click();
  assert.equal(await page.locator('#watersort-moves').innerText(), '0', 'Water Sort restart should reset the move counter');
  assert.equal(await page.locator('#watersort-undo').isDisabled(), true, 'undo should be disabled after starting a new puzzle');
  await page.locator('#close-watersort').click();
  await page.locator('#watersort-panel').waitFor({ state: 'hidden' });

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
  await page.locator('#ww-signin').click();
  assert.match(await page.locator('#ww-auth-message').innerText(), /البريد الإلكتروني وكلمة المرور/, 'empty sign-in should be rejected with clear guidance');
  await page.locator('#ww-signup').click();
  assert.match(await page.locator('#ww-auth-message').innerText(), /البريد الإلكتروني وكلمة المرور/, 'empty sign-up should be rejected with clear guidance');
  await page.locator('#ww-auth-close').click();
  await page.locator('#ww-auth-overlay').waitFor({ state: 'hidden' });

  assert.deepEqual(pageErrors, [], 'browser should not raise uncaught JavaScript exceptions');
  process.stdout.write('PASS — mobile browser smoke tests: 3D canvas, touch controls, Egypt/Paris/Tokyo travel, home customization persistence, bounded guide, careers, football keyboard controls and full five-shot scoring/persistence, Block Blast scoring and persistence, solvable Water Sort, undo, move and reset behavior, memory board, signed-out cloud-wallet guidance, account form validation, and no uncaught page errors.\n');
} finally {
  if (browser) await browser.close();
  await new Promise(resolveClose => server.close(resolveClose));
}
