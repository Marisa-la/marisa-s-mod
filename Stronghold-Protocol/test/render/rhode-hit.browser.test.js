// Real renderer event dispatch without official art: the bond origin reaches wiring, and its hit cannot steal melee.
// RENDER_E2E=1 node --test test/render/rhode-hit.browser.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

const CHROME = process.env.CHROME_PATH || (process.platform === 'win32'
  ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');

test('Chrome renderer keeps Rhodes healing damage separate from the next real melee hit', {
  skip: process.env.RENDER_E2E !== '1' || !existsSync(CHROME), timeout: 45000,
}, async t => {
  const puppeteer = (await import('puppeteer-core')).default;
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--no-first-run'] });
  let srv;
  t.after(async () => { await browser.close(); await srv?.close(); });
  const { startServer } = await import('../../server/index.js');
  srv = await startServer({ port: 0, host: '127.0.0.1', quiet: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.setViewport({ width: 960, height: 640 });
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (new URL(request.url()).pathname === '/rhodes-render-test') return request.respond({
      status: 200, contentType: 'text/html', body: '<!doctype html><div id="host" style="width:960px;height:640px"></div>',
    });
    return request.continue();
  });
  await page.goto(`http://127.0.0.1:${srv.port}/rhodes-render-test?board=2d`);
  await page.evaluate(async () => {
    const { assets } = await import('/js/assets.js');
    assets.seed({ version: 1, chars: {}, enemies: {}, tokens: {}, items: {} });
    assets.seedLocal({ version: 1, files: {} });
    const { data } = await import('/js/data.js');
    await data.load('stages');
    const { createFieldView } = await import('/js/render/app.js');
    const v = await createFieldView(document.getElementById('host'), { board: '2d', settings: { quality: 'low', officialFx: 'off' } });
    window.__rhode = { view: v, calls: [] };
    v.setStage(data.list('stages')[0]);
    const units = [
      { id: 1, side: 'ally', kind: 'op', ownerId: 'p1', defId: 'test_healer', name: 'Healer', x: 5, y: 10, maxHp: 100, facing: 1, dir: 'RIGHT' },
      { id: 2, side: 'enemy', kind: 'enemy', defId: 'enemy_test_target', name: 'Target', x: 6, y: 10, maxHp: 100, facing: -1 },
    ];
    v.enterBattle({ fieldId: 'n:p1', kind: 'normal', units });
    // Observe the app -> wiring boundary; the headless suite separately tests real skill/target-buff inference.
    v.debug.wiring.damage = (target, type, source, time, origin) => {
      window.__rhode.calls.push({ target: target.id, type, source: source?.id ?? null, origin: origin ?? null });
      return false;
    };
    v.pushSnapshot({ t: 0, units: units.map(u => [u.id, u.x, u.y, 100, 100, 0, 10, 0, 0]) });
    v.pushEvents({ gt: 0, ev: [
      ['atk', 1, 2, 'none'], ['dmg', 2, 7, 'arts', null, 'bond:rhodeShip'], ['dmg', 2, 11, 'phys'],
    ] });
  });
  await page.waitForFunction(() => window.__rhode.calls.length === 2, { timeout: 10000 });
  const calls = await page.evaluate(() => { const s = window.__rhode; s.view.destroy(); return s.calls; });
  assert.deepEqual(calls, [
    { target: 2, type: 'arts', source: null, origin: 'bond:rhodeShip' },
    { target: 2, type: 'phys', source: 1, origin: null },
  ]);
  assert.deepEqual(errors, []);
});
