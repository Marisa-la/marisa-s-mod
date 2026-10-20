import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasChrome, CHROME } from '../e2e/client.mjs';
import { startServer } from '../../server/index.js';
import { UF } from '../../shared/constants.js';

test('all airborne operators show the persistent liftoff mark and landing removes it', {
  skip: process.env.SP_E2E !== '1' || !hasChrome(), timeout: 90000,
}, async t => {
  const srv = await startServer({ port: 0, host: '127.0.0.1', quiet: true, assetIndex: false });
  t.after(() => srv.close());
  const puppeteer = (await import('puppeteer-core')).default;
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true,
    args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  t.after(() => browser.close());
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto(`${srv.url}/dev/render-demo.html?scene=prep&board=2d&paused=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__demo?.ready, { timeout: 40000 });
  await page.evaluate(() => window.__demo.pause());
  const results = await page.evaluate(async flags => {
    const view = window.__view;
    const out = [];
    // No band information is supplied: these marks must depend only on the common flight state.
    for (const board of ['2d', '3d']) {
      const boardEnabled = await view.setBoardMode(board);
      if (board === '3d' && !boardEnabled) { out.push({ board, unavailable: true }); continue; }
      view.enterBattle({ fieldId: 'liftoff', kind: 'normal', stageId: 'act1autochess_m01', units: [
        { id: 1, kind: 'op', side: 'ally', defId: 'chess_char_2_13_a', name: '蒂比', x: 4, y: 10, maxHp: 100 },
        { id: 2, kind: 'op', side: 'ally', defId: 'chess_char_1_04_a', name: '深巡', x: 5, y: 10, maxHp: 100 },
      ] });
      for (const airborne of [true, false]) {
        const mask = airborne ? flags.LIFTOFF | flags.STUNNED | flags.SHIELD | flags.COLD | flags.STEALTH : 0;
        // Flags step from the older interpolation frame, as in the live 10 Hz snapshot stream.
        for (const t of airborne ? [1, 1.1] : [1.2, 1.3]) view.pushSnapshot({ fieldId: 'liftoff', t,
          units: [[1, 4, 10, 100, 100, 0, 10, mask, 0], [2, 5, 10, 100, 100, 0, 10, 0, 0]] });
        await new Promise(resolve => setTimeout(resolve, 350));
        const flying = view.debug.views.get(1), ground = view.debug.views.get(2);
        out.push({ board, airborne, visible: flying?.liftoffIcon.visible, groundVisible: ground?.liftoffIcon.visible });
      }
    }
    return out;
  }, UF);
  for (const board of ['2d', '3d']) await t.test(board, {
    skip: results.some(r => r.board === board && r.unavailable) && 'optional 3D board assets or WebGL2 unavailable',
  }, () => {
    const cases = results.filter(r => r.board === board);
    assert.equal(cases.length, 2);
    for (const result of cases) {
      assert.equal(result.visible, result.airborne, JSON.stringify(result));
      assert.equal(result.groundVisible, false, JSON.stringify(result));
    }
  });
});
