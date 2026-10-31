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
  const consoleErrors = [];
  const failedRequests = [];
  page.on('pageerror', error => pageErrors.push(error.stack || error.message));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('requestfailed', request => failedRequests.push(request.url() + ' :: ' + (request.failure()?.errorText || 'request failed')));

  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.locator('#application').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('#life-ui').waitFor({ state: 'attached', timeout: 20000 });
  await page.locator('#player-level').waitFor({ state: 'attached', timeout: 10000 });

  // Memory challenge should open, render all twelve cards, restart, and close accessibly.
  await page.locator('#ww-memory-open').waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('#ww-memory-open').click();
  await page.locator('#ww-memory-panel').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#wwm-grid .wwm-card').count(), 12, 'memory game should render six matching pairs');
  await page.locator('#wwm-grid .wwm-card').first().click();
  assert.notEqual(await page.locator('#wwm-grid .wwm-card').first().innerText(), '?', 'memory card should reveal its symbol');
  await page.locator('#wwm-restart').click();
  assert.equal(await page.locator('#wwm-moves').innerText(), '0', 'restart should reset move count');
  await page.keyboard.press('Escape');
  await page.locator('#ww-memory-panel').waitFor({ state: 'hidden' });

  const canvas = page.locator('#application');
  assert.equal(await canvas.count(), 1, '3D canvas should be present');
  const canvasBox = await canvas.boundingBox();
  assert.ok(canvasBox && canvasBox.width >= 300 && canvasBox.height >= 500, '3D canvas should fill the mobile game viewport');
  assert.equal(await page.locator('[data-dir="up"]').count(), 1, 'mobile movement controls should be present');
  const joystick = page.locator('#move-joystick');
  const joystickBox = await joystick.boundingBox();
  assert.ok(joystickBox, 'mobile virtual joystick should be visible');
  const joystickCenterX = joystickBox.x + joystickBox.width / 2;
  const joystickCenterY = joystickBox.y + joystickBox.height / 2;
  await page.mouse.move(joystickCenterX, joystickCenterY);
  await page.mouse.down();
  await page.mouse.move(joystickCenterX + 30, joystickCenterY - 18, { steps: 3 });
  assert.notEqual(await page.locator('#move-joystick-thumb').evaluate(el => el.style.transform), 'translate(0px,0px)', 'joystick thumb should respond while dragging');
  await page.mouse.up();
  const joystickThumbAfterRelease = await page.locator('#move-joystick-thumb').boundingBox();
  const joystickAfterRelease = await joystick.boundingBox();
  assert.ok(joystickThumbAfterRelease && joystickAfterRelease, 'joystick and thumb should remain measurable after release');
  assert.ok(Math.abs((joystickThumbAfterRelease.x + joystickThumbAfterRelease.width / 2) - (joystickAfterRelease.x + joystickAfterRelease.width / 2)) < 3, 'joystick thumb should visually recenter horizontally after release');
  assert.ok(Math.abs((joystickThumbAfterRelease.y + joystickThumbAfterRelease.height / 2) - (joystickAfterRelease.y + joystickAfterRelease.height / 2)) < 3, 'joystick thumb should visually recenter vertically after release');

  // Mobile camera dock: zoom, recenter, and right-side canvas orbit must all work independently.
  try {
    await page.waitForFunction(() => Number.isFinite(Number(document.querySelector('#application')?.dataset.cameraDistance)), { timeout: 15000 });
  } catch (error) {
    const diagnostics = await page.locator('#application').evaluate(el => ({
      engineReady: el.dataset.engineReady || 'false',
      engineFrames: el.dataset.engineFrames || '0',
      cameraDistance: el.dataset.cameraDistance || 'missing'
    })).catch(() => ({}));
    throw new Error('Camera update did not become ready. Diagnostics: ' + JSON.stringify({
      ...diagnostics, pageErrors, consoleErrors: consoleErrors.slice(-12), failedRequests: failedRequests.slice(-12)
    }) + '\\nOriginal: ' + error.message);
  }
  assert.equal(await page.locator('#camera-controls button').count(), 3, 'camera dock should expose zoom in, recenter, and zoom out');
  const cameraDistanceBefore = Number(await canvas.getAttribute('data-camera-distance'));
  const zoomInButton = page.locator('#camera-zoom-in');
  await zoomInButton.click();
  try {
    await page.waitForFunction(before => {
      const value = Number(document.querySelector('#application')?.dataset.cameraDistance);
      return Number.isFinite(value) && value < before - 0.2;
    }, cameraDistanceBefore, { timeout: 3000 });
  } catch (error) {
    const zoomDiagnostics = await page.evaluate(() => {
      const canvas = document.querySelector('#application');
      const button = document.querySelector('#camera-zoom-in');
      const rect = button?.getBoundingClientRect();
      const hit = rect ? document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2) : null;
      const style = button ? getComputedStyle(button) : null;
      return {
        cameraDistance: canvas?.dataset.cameraDistance ?? 'missing',
        cameraYaw: canvas?.dataset.cameraYaw ?? 'missing',
        engineReady: canvas?.dataset.engineReady ?? 'false',
        engineFrames: canvas?.dataset.engineFrames ?? '0',
        buttonExists: Boolean(button),
        buttonDisabled: button?.disabled ?? null,
        buttonRect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null,
        buttonPointerEvents: style?.pointerEvents ?? null,
        buttonZIndex: style?.zIndex ?? null,
        hitTarget: hit ? { id: hit.id, tag: hit.tagName, className: String(hit.className || '') } : null
      };
    });
    throw new Error('Zoom-in diagnostic failure: ' + JSON.stringify({
      before: cameraDistanceBefore,
      after: await canvas.getAttribute('data-camera-distance'),
      ...zoomDiagnostics,
      pageErrors: pageErrors.slice(-8),
      consoleErrors: consoleErrors.slice(-8),
      failedRequests: failedRequests.slice(-8),
      original: error.message
    }));
  }
  const cameraDistanceAfterZoomIn = Number(await canvas.getAttribute('data-camera-distance'));
  assert.ok(cameraDistanceAfterZoomIn < cameraDistanceBefore, 'camera zoom-in button should move the camera closer');
  await page.locator('#camera-zoom-out').click();
  await page.waitForFunction(afterZoomIn => {
    const value = Number(document.querySelector('#application')?.dataset.cameraDistance);
    return Number.isFinite(value) && value > afterZoomIn + 0.2;
  }, cameraDistanceAfterZoomIn, { timeout: 3000 });
  const cameraDistanceAfterZoomOut = Number(await canvas.getAttribute('data-camera-distance'));
  assert.ok(cameraDistanceAfterZoomOut > cameraDistanceAfterZoomIn, 'camera zoom-out button should move the camera farther away');
  await page.locator('#camera-reset').click();
  assert.ok(Math.abs(Number(await canvas.getAttribute('data-camera-distance')) - 7.5) < 0.15, 'camera reset should restore the outdoor follow distance');
  const cameraBox = await canvas.boundingBox();
  const cameraStartX = cameraBox.x + cameraBox.width * 0.78;
  const cameraStartY = cameraBox.y + cameraBox.height * 0.48;
  const yawBeforeDrag = Number(await canvas.getAttribute('data-camera-yaw'));
  // Drive the exact Pointer Events consumed by the game's document-level handlers.
  // page.mouse can target a composited WebGL layer differently under headless mobile emulation.
  const pointerOrbit = await page.evaluate(({ x, y, before }) => {
    const target = document.querySelector('#application');
    const pointer = (type, clientX, clientY, buttons) => new PointerEvent(type, {
      bubbles: true, cancelable: true, pointerId: 731, pointerType: 'touch',
      isPrimary: true, clientX, clientY, button: 0, buttons
    });
    target.dispatchEvent(pointer('pointerdown', x, y, 1));
    document.dispatchEvent(pointer('pointermove', x + 42, y + 16, 1));
    const afterMove = Number(target.dataset.cameraYaw);
    document.dispatchEvent(pointer('pointerup', x + 42, y + 16, 0));
    return { before, afterMove, afterRelease: Number(target.dataset.cameraYaw) };
  }, { x: cameraStartX, y: cameraStartY, before: yawBeforeDrag });
  assert.ok(Number.isFinite(pointerOrbit.afterMove), 'camera yaw should remain a finite number after pointer movement');
  assert.ok(Math.abs(pointerOrbit.afterMove - yawBeforeDrag) > 0.01,
    'a pointer drag beginning on the right side of the 3D canvas should rotate the camera');
  const yawAfterDrag = Number(await canvas.getAttribute('data-camera-yaw'));
  assert.notEqual(yawAfterDrag, yawBeforeDrag, 'right-side canvas pointer drag should rotate the camera');
  await page.locator('#camera-reset').click();
  assert.ok(Math.abs(Number(await canvas.getAttribute('data-camera-yaw'))) < 0.01, 'camera reset should restore the default orbit angle');

  // Ludo must visibly move a home piece onto the track after a six, then advance it on a later roll.
  await page.locator('#board-games-launch').waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('#board-games-launch').click();
  await page.locator('#bg-open-ludo').click();
  await page.evaluate(() => { window.__wwOriginalRandom = Math.random; Math.random = () => 0.999; });
  await page.locator('#ludo-roll').click();
  await page.locator('#ludo-status').waitFor({ state: 'visible' });
  assert.match(await page.locator('#ludo-status').innerText(), /طلع 6/, 'Ludo should report a six before leaving home');
  await page.locator('#ludo-board [data-ludo-home][aria-label="حمراء 1"]').click();
  assert.equal(await page.locator('#ludo-board button[aria-label="حمراء 1"]').count(), 1, 'red piece should appear on the track after leaving home');
  assert.equal(await page.locator('#ludo-board [data-ludo-home][aria-label="حمراء 1"]').count(), 0, 'moved red piece should no longer remain in its home slot');
  await page.evaluate(() => { Math.random = () => 0; });
  await page.locator('#ludo-roll').click();
  await page.locator('#ludo-board button[aria-label="حمراء 1"]').click();
  assert.match(await page.locator('#ludo-status').innerText(), /حركتِ القطعة/, 'Ludo should advance an already launched piece');
  await page.evaluate(() => { if (window.__wwOriginalRandom) Math.random = window.__wwOriginalRandom; });
  await page.locator('#bg-close').click();
  await page.locator('#ww-menu-toggle').click();
  assert.equal(await page.locator('#ww-menu-toggle').getAttribute('aria-expanded'), 'true', 'main menu should expand');
  assert.equal(await page.locator('#ww-menu-content').isVisible(), true, 'grouped actions should be visible when menu expands');
  await page.locator('#open-map').evaluate(el => el.click());
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
  // The customization overlay is vertically scrollable on a 390px mobile viewport.
  // Bring each control into the visible area before tapping, matching a real phone interaction.
  for (const [color, feedback] of [['brick', /الطوبي/], ['gold', /الذهبي/], ['yellow', /الأصفر/]]) {
    const wallButton = page.locator('[data-home-wall="' + color + '"]');
    const wallVisibility = await wallButton.evaluate(el => ({
      display: getComputedStyle(el).display,
      visibility: getComputedStyle(el).visibility,
      width: el.getBoundingClientRect().width,
      height: el.getBoundingClientRect().height,
      panelHidden: el.closest('#home-build-panel')?.hidden ?? true,
      hudCollapsed: el.closest('#life-ui')?.classList.contains('actions-collapsed') ?? false
    }));
    assert.notEqual(wallVisibility.display, 'none',
      color + ' facade button must not be hidden by compact HUD styles: ' + JSON.stringify(wallVisibility));
    assert.equal(wallVisibility.visibility, 'visible',
      color + ' facade button must be visible: ' + JSON.stringify(wallVisibility));
    assert.ok(wallVisibility.width > 0 && wallVisibility.height > 0,
      color + ' facade button must have a visible hit area: ' + JSON.stringify(wallVisibility));
    await wallButton.scrollIntoViewIfNeeded();
    await wallButton.click();
    assert.match(await page.locator('#home-build-feedback').innerText(), feedback, color + ' facade button should apply and report its selection');
  }
  await page.locator('[data-home-wall="mint"]').click();
  assert.match(await page.locator('#home-build-feedback').innerText(), /نعناعي/);
  await page.locator('[data-home-roof="blue"]').click();
  await page.locator('#toggle-home-garden').click();
  assert.equal(await page.locator('#toggle-home-garden').getAttribute('aria-pressed'), 'false', 'garden customization should toggle off');
  assert.match(await page.evaluate(() => localStorage.getItem('wonderworld-home-design-v1')), /"wall":"mint"/, 'home design should persist locally');
  assert.equal(await page.locator('[data-home-wall="mint"]').getAttribute('aria-pressed'), 'true', 'selected facade must be visibly and accessibly marked');
  assert.equal(await page.locator('[data-home-wall="brick"]').getAttribute('aria-pressed'), 'false', 'unselected facade must not appear selected');
  await page.locator('#reset-home-design').click();
  assert.equal(await page.locator('[data-home-wall="brick"]').getAttribute('aria-pressed'), 'true', 'reset must select the default brick facade');
  assert.match(await page.evaluate(() => localStorage.getItem('wonderworld-home-design-v1')), /"wall":"brick"/, 'reset must persist the default design');
  await page.locator('#close-home-build').click();
  await page.locator('#home-build-panel').waitFor({ state: 'hidden' });

  // Shop and cafe should open separate furnished interiors and expose their own action.
  // The preceding gameplay checks may leave the player indoors; explicitly return outdoors
  // before testing neighborhood fast travel so the map's intended guard does not block it.
  if (await page.locator('#exit-home').isVisible()) {
    await page.locator('#exit-home').click();
    await page.locator('#exit-home').waitFor({ state: 'hidden' });
  }
  await page.locator('#open-map').click();
  await page.locator('.map-destination').filter({ hasText: 'متجر Wonder' }).click();
  await page.locator('#exit-home').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#indoor-place-action').isVisible(), true, 'shop interior should expose its shopping action');
  assert.equal(await page.locator('#indoor-floor-controls').isVisible(), true, 'multi-storey shop interiors should expose floor navigation');
  await page.locator('#indoor-floor-up').click();
  assert.equal(await page.locator('#indoor-floor-label').innerText(), 'الدور 2', 'stair navigation should move the player to the upper floor');
  await page.locator('#indoor-floor-down').click();
  assert.equal(await page.locator('#indoor-floor-label').innerText(), 'الدور الأرضي', 'floor navigation should return to the ground floor');
  await page.locator('#indoor-place-action').click();
  await page.locator('#shop-panel').waitFor({ state: 'visible' });
  await page.locator('#close-shop').click();
  await page.locator('#exit-home').click();
  await page.locator('#exit-home').waitFor({ state: 'hidden' });

  await page.locator('#open-map').click();
  await page.locator('.map-destination').filter({ hasText: 'كافيه Wonder' }).click();
  await page.locator('#exit-home').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#indoor-place-action').innerText(), '☕ طلب من الكافيه', 'cafe interior should expose the cafe order action');
  await page.locator('#indoor-place-action').click();
  assert.match(await page.locator('#status').innerText(), /كافيه|قهوة|مشروب|Wonder Cafe/, 'cafe action should respond');
  await page.locator('#exit-home').click();
  await page.locator('#exit-home').waitFor({ state: 'hidden' });

  // Restaurant, office and gym must be enterable rooms with their own equipment and action.
  await page.locator('#open-map').click();
  await page.locator('.map-destination').filter({ hasText: 'مطعم Wonder' }).click();
  await page.locator('#interact').click();
  await page.locator('#exit-home').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#indoor-place-action').innerText(), '🍽️ طلب وجبة', 'restaurant should expose a meal-order action');
  await page.locator('#indoor-place-action').click();
  assert.match(await page.locator('#status').innerText(), /وجبتك وصلت|مطعم Wonder|الوجبة/, 'restaurant action should respond');
  await page.locator('#exit-home').click();
  await page.locator('#exit-home').waitFor({ state: 'hidden' });

  await page.locator('#open-map').click();
  await page.locator('.map-destination').filter({ hasText: 'مكتب الحي' }).click();
  await page.locator('#interact').click();
  await page.locator('#exit-home').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#indoor-place-action').innerText(), '💼 بدء وردية عمل', 'office should expose its work-shift action');
  await page.locator('#indoor-place-action').click();
  assert.match(await page.locator('#status').innerText(), /وردية قصيرة|الشغل/, 'office shift should respond');
  await page.locator('#exit-home').click();
  await page.locator('#exit-home').waitFor({ state: 'hidden' });

  await page.locator('#open-map').click();
  await page.locator('.map-destination').filter({ hasText: 'Wonder Fitness' }).click();
  await page.locator('#interact').click();
  await page.locator('#exit-home').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#indoor-place-action').innerText(), '🏋️ ابدئي التمرين', 'gym should expose a workout action');
  await page.locator('#indoor-place-action').click();
  assert.match(await page.locator('#status').innerText(), /تمرين|طاقة|تمرينًا/, 'gym workout should respond');
  await page.locator('#exit-home').click();
  await page.locator('#exit-home').waitFor({ state: 'hidden' });

  // The visible aircraft and train station should launch their playable activities.
  await page.locator('#open-map').click();
  await page.locator('.map-destination').filter({ hasText: 'مطار Wonder Air' }).click();
  await page.locator('#interact').click();
  await page.locator('#ww-activities').waitFor({ state: 'visible' });
  assert.match(await page.locator('#wwa-title').innerText(), /الطيران/);
  await page.locator('#wwa-home').click();
  await page.locator('#ww-activities').waitFor({ state: 'hidden' });

  await page.locator('#open-map').click();
  await page.locator('.map-destination').filter({ hasText: 'محطة Wonder Central' }).click();
  await page.locator('#interact').click();
  await page.locator('#ww-activities').waitFor({ state: 'visible' });
  assert.match(await page.locator('#wwa-title').innerText(), /القطارات/);
  await page.locator('#wwa-home').click();
  await page.locator('#ww-activities').waitFor({ state: 'hidden' });

  await page.locator('#open-map').click();
  await page.locator('.map-destination').filter({ hasText: 'منصة عروض الأزياء' }).click();
  await page.locator('#interact').click();
  await page.locator('#ww-activities').waitFor({ state: 'visible' });
  assert.match(await page.locator('#wwa-title').innerText(), /الموضة/);
  await page.locator('#wwa-looks button').first().click();
  assert.notEqual(await page.locator('#wwa-fashion-clothes').innerText(), '👗', 'fashion selection should update the runway avatar');
  await page.locator('#wwa-runway-go').click();
  assert.match(await page.locator('#wwa-feedback').innerText(), /تقييم لجنة التحكيم/);
  assert.equal((await page.locator('#wwa-fashion-theme').innerText()).trim(), 'إطلالة رياضية', 'one runway show should advance exactly one theme');
  await page.locator('#wwa-home').click();
  await page.locator('#ww-activities').waitFor({ state: 'hidden' });

  // A free ready-made villa opens a distinct furnished interior; the premium villa is price-gated.
  await page.locator('#open-map').click();
  await page.locator('.map-destination').filter({ hasText: 'فيلا Wonder الجاهزة' }).click();
  await page.locator('#interact').click();
  await page.locator('#exit-home').waitFor({ state: 'visible' });
  await page.locator('#exit-home').click();
  await page.locator('#exit-home').waitFor({ state: 'hidden' });
  await page.locator('#open-map').click();
  await page.locator('.map-destination').filter({ hasText: 'فيلا Wonder الفاخرة' }).click();
  assert.match(await page.locator('#map-feedback').innerText(), /250 عملة/);
  await page.locator('#close-map').click();
  await page.locator('#map-panel').waitFor({ state: 'hidden' });

  if (await page.locator('#ww-menu-toggle').getAttribute('aria-expanded') !== 'true') {
    await page.locator('#ww-menu-toggle').click();
  }
  await page.locator('#ww-menu-content').waitFor({ state: 'visible' });
  await page.locator('#open-shop').waitFor({ state: 'visible' });
  await page.locator('#open-pets').waitFor({ state: 'visible' });
  await page.locator('#toggle-vehicle').click();
  assert.equal(await page.locator('#toggle-vehicle').getAttribute('aria-pressed'), 'true', 'vehicle button should enter driving mode');
  assert.match(await page.locator('#toggle-vehicle').innerText(), /النزول من العربية/);
  await page.locator('#toggle-vehicle').click();
  assert.equal(await page.locator('#toggle-vehicle').getAttribute('aria-pressed'), 'false', 'vehicle button should return to walking mode');

  // Preset-only group gathering: choose participants, respond to each, and finish with no free-text chat.
  await page.locator('#open-gathering').click();
  await page.locator('#gathering-panel').waitFor({ state: 'visible' });
  await page.locator('#gathering-location').selectOption('park');
  await page.locator('#gathering-event').selectOption('birthday');
  await page.locator('#start-gathering').click();
  await page.locator('#gathering-choices .gathering-person').first().locator('button').first().click();
  await page.locator('#gathering-choices .gathering-person').nth(1).locator('button').nth(1).click();
  await page.locator('#finish-gathering').waitFor({ state: 'visible' });
  await page.locator('#finish-gathering').click();
  await page.locator('#gathering-active').waitFor({ state: 'hidden' });
  await page.locator('#close-gathering').click();
  await page.locator('#gathering-panel').waitFor({ state: 'hidden' });

  await page.locator('#open-avatar-creator').click();
  await page.locator('#avatar-creator-panel').waitFor({ state: 'visible' });
  await page.locator('#avatar-age').evaluate(el => { el.value = '65'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.locator('#avatar-presentation').selectOption('masculine');
  await page.locator('#avatar-skin').selectOption('deep');
  await page.locator('#avatar-hair-style').selectOption('curly');
  await page.locator('#avatar-hair-color').selectOption('rose');
  await page.locator('#save-avatar-profile').click();
  assert.match(await page.locator('#avatar-creator-feedback').innerText(), /اتحفظ شكل شخصيتك/);
  const avatarSave = await page.evaluate(() => JSON.parse(localStorage.getItem('wonderworld-save-v1') || '{}').avatarProfile);
  assert.deepEqual(avatarSave, { age: 65, presentation: 'masculine', skin: 'deep', hairStyle: 'curly', hairColor: 'rose' });
  await page.locator('#close-avatar-creator').click();
  await page.locator('#avatar-creator-panel').waitFor({ state: 'hidden' });

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

  await page.locator('#board-games-launch').click();
  await page.locator('#board-games-panel').waitFor({ state: 'visible' });
  await page.locator('#bg-open-ludo').click();
  await page.locator('#ludo-record').waitFor({ state: 'visible' });
  assert.match(await page.locator('#ludo-record').innerText(), /سجلّك:/, 'Ludo should display the persistent win-loss record');
  await page.evaluate(() => { Math.random = () => 0.9999; });
  await page.locator('#ludo-roll').click();
  assert.equal(await page.locator('#ludo-board .ludo-cell, #ludo-board .ludo-center').count(), 49, 'Ludo should render its 7x7 board');
  assert.equal(await page.locator('#ludo-board button[data-ludo-home="true"][aria-label="حمراء 1"]').count(), 1, 'red home token should be visible before moving');
  assert.match(await page.locator('#ludo-status').innerText(), /6/, 'forced roll should show the rolled six');
  await page.locator('#ludo-board button[data-ludo-home="true"][aria-label="حمراء 1"]').click();
  assert.equal(await page.locator('#ludo-board .track button[aria-label="حمراء 1"]').count(), 1, 'selecting the home token after a six should move it onto the track');
  await page.evaluate(() => { Math.random = () => 0.5; });
  await page.locator('#ludo-reset').click();
  await page.locator('#bg-open-chess').click();
  assert.equal(await page.locator('#chess-board .chess-square').count(), 64, 'chess should render all 64 squares');
  assert.equal(await page.locator('#chess-undo').isDisabled(), true, 'chess undo should be disabled before any move');
  await page.locator('#chess-board button[aria-label="خانة e2"]').click();
  await page.locator('#chess-board button[aria-label="خانة e4"]').click();
  assert.equal((await page.locator('#chess-board button[aria-label="خانة e4"]').innerText()).trim(), '♙', 'white pawn should move from e2 to e4');
  assert.equal(await page.locator('#chess-undo').isDisabled(), false, 'chess undo should become available after a move');
  assert.match(await page.locator('#chess-status').innerText(), /الأسود/, 'chess should switch turns after a valid move');
  await page.locator('#chess-undo').click();
  assert.equal((await page.locator('#chess-board button[aria-label="خانة e2"]').innerText()).trim(), '♙', 'undo should restore the pawn to its original square');
  assert.equal((await page.locator('#chess-board button[aria-label="خانة e4"]').innerText()).trim(), '', 'undo should clear the destination square');
  assert.match(await page.locator('#chess-status').innerText(), /الأبيض/, 'undo should restore the previous turn');
  await page.locator('#chess-reset').click();
  assert.equal(await page.locator('#chess-undo').isDisabled(), true, 'reset should clear chess undo history');
  await page.locator('#bg-close').click();
  await page.locator('#board-games-panel').waitFor({ state: 'hidden' });

  await page.locator('#ww-arcade-launch').click();
  await page.locator('#ww-arcade-panel').waitFor({ state: 'visible' });
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'wwa-close', 'opening the arcade dialog should move keyboard focus inside it');
  await page.keyboard.press('Escape');
  await page.locator('#ww-arcade-panel').waitFor({ state: 'hidden' });
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'ww-arcade-launch', 'Escape should close the arcade dialog and restore focus to its launcher');
  await page.locator('#ww-arcade-launch').click();
  await page.locator('#ww-arcade-panel').waitFor({ state: 'visible' });
  await page.locator('#wwa-color-open').click();
  const targetColor = await page.locator('#wwa-color-target').getAttribute('data-target');
  assert.ok(['mint', 'coral', 'blue', 'violet'].includes(targetColor), 'color matching should select a known target color');
  await page.locator('.wwa-color-choice[data-color="' + targetColor + '"]').click();
  assert.equal(await page.locator('#wwa-color-score').innerText(), '1', 'choosing the target color should increment the score');
  assert.match(await page.locator('#wwa-color-status').innerText(), /صح/, 'correct color choice should show positive feedback');
  assert.equal(await page.locator('#wwa-color-options .wwa-color-choice:disabled').count(), 4, 'color round should lock answers after one choice');
  await page.locator('#wwa-color-next').click();
  assert.equal(await page.locator('#wwa-color-options .wwa-color-choice:disabled').count(), 0, 'next color round should enable all answer choices');
  await page.locator('#wwa-color-reset').click();
  assert.equal(await page.locator('#wwa-color-score').innerText(), '0', 'color game restart should reset the score');
  await page.locator('#wwa-cups-open').click();
  await page.locator('#ww-cups .ww-cup').first().click();
  assert.match(await page.locator('#wwa-cups-status').innerText(), /النجمة/, 'cup guessing should reveal a result and identify the hidden star');
  assert.equal(await page.locator('#ww-cups .ww-cup:disabled').count(), 3, 'cup round should prevent repeated guesses after revealing the result');
  assert.equal(await page.locator('#ww-cups .ww-cup').filter({ hasText: '⭐' }).count(), 1, 'cup round should reveal exactly one hidden star');
  await page.locator('#wwa-cups-reset').click();
  assert.equal(await page.locator('#ww-cups .ww-cup:disabled').count(), 0, 'cup restart should enable all three cups again');
  await page.locator('#wwa-match-open').click();
  assert.equal(await page.locator('#wwa-match-board .wwa-candy-tile').count(), 64, 'Candy Match should render a playable 8x8 board');
  await page.locator('#wwa-match-reset').click();
  await page.locator('#wwa-rope-open').click();
  assert.equal(await page.locator('#wwa-casual-rope-board .wwa-casual-rope-node').count(), 6, 'Rope Untangle should render six draggable nodes');
  await page.locator('#wwa-rope-reset').click();
  await page.locator('#wwa-party-open').click();
  assert.equal(await page.locator('#wwa-party-board .wwa-party-star').count(), 12, 'Sparkle Party should render twelve collectible stars');
  await page.locator('#wwa-party-board .wwa-party-star').first().click();
  assert.ok(Number(await page.locator('#wwa-party-score').innerText()) > 0, 'collecting a star should award points');
  await page.locator('#ww-arcade-panel').getByRole('button', { name: 'إغلاق' }).click();
  await page.locator('#ww-arcade-panel').waitFor({ state: 'hidden' });

  // PUBG-inspired Battle Royale: validate touch actions, ammunition, reload and reset.
  await page.locator('#ww-activities-launch').click();
  await page.locator('#ww-activities').waitFor({ state: 'visible' });
  await page.locator('#wwa-menu [data-game="battle"]').click();
  await page.locator('#wwa-battle-canvas').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#wwa-hp').innerText(), '100', 'Battle Royale should start with full health');
  assert.equal(await page.locator('#wwa-ammo').innerText(), '30', 'Battle Royale should start with a full magazine');
  await page.locator('#wwa-content [data-act="up"]').click();
  await page.locator('#wwa-content [data-act="left"]').click();
  await page.locator('#wwa-content [data-act="fire"]').click();
  assert.equal(await page.locator('#wwa-ammo').innerText(), '29', 'Battle Royale fire control should consume one round');
  await page.locator('#wwa-content [data-act="reload"]').click();
  assert.equal(await page.locator('#wwa-ammo').innerText(), '30', 'Battle Royale reload should restore ammunition up to magazine capacity');
  await page.locator('#wwa-content [data-act="heal"]').click();
  assert.ok(Number(await page.locator('#wwa-hp').innerText()) <= 100, 'Battle Royale healing must not exceed maximum health');
  await page.locator('#wwa-reset').click();
  assert.equal(await page.locator('#wwa-ammo').innerText(), '30', 'Battle Royale restart should restore the starting magazine');
  await page.locator('#wwa-back').click();
  await page.locator('#wwa-menu [data-game="ropes"]').click();
  await page.locator('#wwa-rope-nodes').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#wwa-rope-nodes [data-node]').count(), 4, 'Tangle Master should render four draggable rope endpoints');
  const ropeSvg = page.locator('#wwa-rope-nodes');
  const ropeBox = await ropeSvg.boundingBox();
  assert.ok(ropeBox, 'rope board should have a measurable touch surface');
  const ropePoint = (x, y) => ({ x: ropeBox.x + x / 640 * ropeBox.width, y: ropeBox.y + y / 360 * ropeBox.height });
  for (const move of [
    { from: [525, 285], to: [525, 85] },
    { from: [115, 285], to: [525, 285] },
    { from: [525, 85], to: [115, 285] }
  ]) {
    const from = ropePoint(...move.from), to = ropePoint(...move.to);
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(to.x, to.y, { steps: 4 });
    await page.mouse.up();
  }
  assert.equal(await page.locator('#wwa-crossings').innerText(), '0', 'dragging rope endpoints into a square should remove all crossings');
  assert.match(await page.locator('#wwa-feedback').innerText(), /الحبال بقت منفصلة/, 'Tangle Master should confirm a solved rope layout');
  await page.locator('#wwa-reset').click();
  assert.equal(await page.locator('#wwa-rope-moves').innerText(), '0', 'rope reset should clear the move counter');
  await page.locator('#wwa-home').click();
  await page.locator('#ww-activities').waitFor({ state: 'hidden' });

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
  assert.match(await page.locator('#ww-auth-message').innerText(), /البريد الإلكتروني/, 'empty sign-in should be rejected with clear guidance');
  await page.locator('#ww-signup').click();
  assert.match(await page.locator('#ww-auth-message').innerText(), /البريد الإلكتروني/, 'empty sign-up should be rejected with clear guidance');
  await page.locator('#ww-email').fill('not-an-email');
  await page.locator('#ww-password').fill('short');
  await page.locator('#ww-signup').click();
  assert.match(await page.locator('#ww-auth-message').innerText(), /بريدًا إلكترونيًا صحيحًا/, 'malformed email should be rejected before contacting auth');
  await page.locator('#ww-email').fill('player@example.com');
  await page.locator('#ww-signup').click();
  assert.match(await page.locator('#ww-auth-message').innerText(), /12 حرفًا على الأقل/, 'short passwords should be rejected before contacting auth');
  await page.locator('#ww-password').fill('aaaaaaaaaaaa');
  await page.locator('#ww-signup').click();
  assert.match(await page.locator('#ww-auth-message').innerText(), /نفس الحرف مكرر/, 'repeated-character passwords should be rejected');
  await page.locator('#ww-password').fill('qwertyuiop12');
  await page.locator('#ww-signup').click();
  assert.match(await page.locator('#ww-auth-message').innerText(), /كلمة مرور أقوى وفريدة/, 'common keyboard sequences should be rejected');
  await page.locator('#ww-password-toggle').click();
  assert.equal(await page.locator('#ww-password').getAttribute('type'), 'text', 'password visibility control should reveal the password');
  assert.equal(await page.locator('#ww-password-toggle').getAttribute('aria-pressed'), 'true', 'password visibility state should be accessible');
  await page.locator('#ww-password-toggle').click();
  assert.equal(await page.locator('#ww-password').getAttribute('type'), 'password', 'password visibility control should hide the password again');
  assert.equal(await page.locator('#ww-save-new-password').isHidden(), true, 'new-password action should stay hidden outside recovery mode');
  await page.locator('#ww-save-new-password').evaluate(el => { el.hidden = false; });
  await page.locator('#ww-password').fill('short');
  await page.locator('#ww-save-new-password').click();
  assert.match(await page.locator('#ww-auth-message').innerText(), /12 حرفًا على الأقل/, 'new password should enforce a 12-character minimum');
  await page.locator('#ww-save-new-password').evaluate(el => { el.hidden = true; });
  await page.locator('#ww-password').fill('');
  await page.locator('#ww-email').fill('');
  await page.locator('#ww-forgot-password').click();
  assert.match(await page.locator('#ww-auth-message').innerText(), /البريد الإلكتروني/, 'password recovery should require an email address');
  await page.locator('#ww-email').fill('not-an-email');
  await page.locator('#ww-forgot-password').click();
  assert.match(await page.locator('#ww-auth-message').innerText(), /بريدًا إلكترونيًا صحيحًا/, 'password recovery should validate email format');
  await page.locator('#ww-email').fill('player@example.com');
  await page.locator('#ww-password').fill('');
  await page.locator('#ww-password').press('Enter');
  assert.match(await page.locator('#ww-auth-message').innerText(), /كلمة المرور/, 'Enter should submit sign-in validation from the password field');
  await page.locator('#ww-auth-close').click();
  await page.locator('#ww-auth-overlay').waitFor({ state: 'hidden' });
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'ww-auth-launch', 'closing the account dialog should restore keyboard focus');


  // Exercise the twelve additional activity prototypes, including the now-visible gym mode.
  await page.locator('#ww-activities-launch').click();
  await page.locator('#ww-activities').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#wwa-menu [data-game]').count(), 12, 'activity hub should expose twelve additional activities including gym without duplicating cup mode');
  for (const id of ['battle','football','ropes','fashion','gym','plane','train','arrows','stocks','space','candy','party']) {
    await page.locator('#wwa-menu [data-game="' + id + '"]').click();
    await page.locator('#wwa-game').waitFor({ state: 'visible' });
    assert.notEqual((await page.locator('#wwa-title').innerText()).trim(), '', id + ' should open with a title');
    if (id === 'battle') {
      assert.match(await page.locator('#wwa-title').innerText(), /Battle|معركة|قتال/i);
      const battleCanvas = page.locator('#wwa-battle-canvas');
      const moveStick = page.locator('#wwa-battle-move-stick');
      await moveStick.scrollIntoViewIfNeeded();
      const moveBox = await moveStick.boundingBox();
      assert.ok(moveBox && moveBox.width >= 100, 'Battle Royale should show a large mobile movement stick');
      const playerXBeforeStick = Number(await battleCanvas.getAttribute('data-player-x'));
      const moveCX = moveBox.x + moveBox.width / 2, moveCY = moveBox.y + moveBox.height / 2;
      await page.mouse.move(moveCX, moveCY);
      await page.mouse.down();
      await page.mouse.move(moveCX + moveBox.width * 0.28, moveCY, { steps: 3 });
      await page.waitForTimeout(650);
      const playerXAfterStick = Number(await battleCanvas.getAttribute('data-player-x'));
      await page.mouse.up();
      assert.ok(playerXAfterStick > playerXBeforeStick + 5, 'left virtual stick should continuously move the player');
      const aimStick = page.locator('#wwa-battle-aim-stick');
      await aimStick.scrollIntoViewIfNeeded();
      const aimBox = await aimStick.boundingBox();
      assert.ok(aimBox && aimBox.width >= 100, 'Battle Royale should show a separate mobile aiming stick');
      const aimCX = aimBox.x + aimBox.width / 2, aimCY = aimBox.y + aimBox.height / 2;
      await page.mouse.move(aimCX, aimCY);
      await page.mouse.down();
      await page.mouse.move(aimCX + aimBox.width * 0.28, aimCY, { steps: 3 });
      const aimedX = Number(await battleCanvas.getAttribute('data-aim-x'));
      const playerXForAim = Number(await battleCanvas.getAttribute('data-player-x'));
      await page.mouse.up();
      assert.ok(aimedX > playerXForAim + 30, 'right virtual stick should independently move the aiming reticle');

      assert.equal(await page.locator('#wwa-bscore').innerText(), '0', 'battle royale should start with no eliminations');
      assert.equal(await page.locator('#wwa-zone').count(), 1, 'battle royale should show the shrinking safe-zone status');
      await page.locator('[data-act="fire"]').click();
      assert.equal(await page.locator('#wwa-ammo').innerText(), '29', 'battle royale should consume one round per shot');
      await page.locator('[data-act="reload"]').click();
      assert.equal(await page.locator('#wwa-ammo').innerText(), '30', 'battle royale should refill ammunition up to the magazine cap');
      await page.locator('[data-act="heal"]').click();
      assert.ok(Number(await page.locator('#wwa-hp').innerText()) <= 100, 'healing should never exceed maximum health');
    }
    if (id === 'football') { await page.locator('[data-f="pass"]').click(); await page.locator('[data-f="shoot"]').click(); }
    if (id === 'ropes') {
      assert.equal(await page.locator('#wwa-rope-endpoints [data-node]').count(), 4, 'rope puzzle should show four draggable rope ends');
      assert.equal(await page.locator('#wwa-rope-lines line').count(), 8, 'rope puzzle should render thick rope strands and highlights');
      const ropeNode = page.locator('#wwa-rope-endpoints [data-node="0"]');
      const ropeBox = await ropeNode.boundingBox();
      await page.mouse.move(ropeBox.x + ropeBox.width / 2, ropeBox.y + ropeBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(ropeBox.x + ropeBox.width / 2 + 65, ropeBox.y + ropeBox.height / 2 + 45, { steps: 5 });
      await page.mouse.up();
      assert.ok(Number(await page.locator('#wwa-rope-moves').innerText()) > 0, 'dragging a rope end should count real pointer movement');
    }
    if (id === 'fashion') { await page.locator('#wwa-looks button').first().click(); await page.locator('#wwa-runway-go').click(); }
    if (id === 'plane') { await page.locator('#wwa-thrust-up').click(); await page.locator('#wwa-thrust-up').click(); await page.locator('#wwa-thrust-up').click(); await page.locator('#wwa-takeoff').click(); await page.locator('#wwa-level').click(); await page.locator('#wwa-level').click(); await page.locator('#wwa-land').click(); }
    if (id === 'train') { await page.locator('#wwa-train-accelerate').click(); await page.locator('#wwa-train-accelerate').click(); await page.locator('#wwa-train-accelerate').click(); await page.locator('#wwa-train-brake').click(); await page.locator('#wwa-train-brake').click(); await page.locator('#wwa-train-open').click(); }
    if (id === 'arrows') await page.locator('#wwa-arrow-board button:enabled').first().click();
    if (id === 'stocks') await page.locator('#wwa-stock-list article button').first().click();
    if (id === 'space') await page.locator('[data-s="fire"]').click();
    if (id === 'candy') { await page.locator('#wwa-candy-board button').nth(0).click(); await page.locator('#wwa-candy-board button').nth(1).click(); }
    if (id === 'party') await page.locator('#wwa-party-answers button').first().click();
    await page.locator('#wwa-back').click();
  }
  await page.locator('#wwa-home').click();

  assert.deepEqual(pageErrors, [], 'browser should not raise uncaught JavaScript exceptions');
  process.stdout.write('PASS — mobile browser smoke tests: 3D canvas, touch controls, Egypt/Paris/Tokyo travel, home customization persistence, bounded guide, careers, Ludo board and persistent record, chess move/undo/reset, football keyboard controls and full five-shot scoring/persistence, Block Blast scoring and persistence, solvable Water Sort, undo, move and reset behavior, memory board, signed-out cloud-wallet guidance, account email/password validation, password visibility, recovery validation, keyboard submission/focus restoration, and no uncaught page errors.\n');
} finally {
  if (browser) await browser.close();
  await new Promise(resolveClose => server.close(resolveClose));
}