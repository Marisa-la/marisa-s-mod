import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseArgs, serverEnv } from '../scripts/launch.mjs';
import { classifyAddresses } from '../tools/doctor.mjs';
import { startServer } from '../server/index.js';
import { TestClient } from './helpers/wsClient.js';

function marisaArgs() {
  const source = fs.readFileSync(new URL('../scripts/start-marisa.cmd', import.meta.url), 'utf8');
  const command = source.split(/\r?\n/).find(line => /^node scripts[/\\]launch\.mjs /.test(line));
  assert.ok(command, 'test must use the actual Marisa launcher arguments');
  return command.trim().split(/\s+/).slice(2).filter(arg => arg !== '%*');
}

test('Marisa launcher keeps the vanilla bind default and allows an explicit local-only override', () => {
  const saved = process.env.HOST;
  delete process.env.HOST;
  try {
    assert.equal(parseArgs(marisaArgs()).host, parseArgs([]).host);
    const override = parseArgs([...marisaArgs(), '--host', '127.0.0.1']);
    assert.equal(override.host, '127.0.0.1');
    assert.equal(serverEnv(override, {}).SP_PLUGIN_SCRIPTS, 'sandbox');
  } finally {
    if (saved === undefined) delete process.env.HOST; else process.env.HOST = saved;
  }
});

test('Marisa launcher serves LAN/VPN guests and joins them to a sandbox plugin room', {
  skip: process.env.SP_LAN_E2E !== '1', timeout: 45000,
}, async t => {
  const addresses = [];
  for (const kind of ['lan', 'vpn']) {
    const address = classifyAddresses().find(a => a.kind === kind && !a.address.includes(':'));
    if (address) addresses.push(address);
  }
  if (!addresses.length) { t.skip('no LAN or VPN IPv4 interface on this host'); return; }
  const saved = { host: process.env.HOST, scripts: process.env.SP_PLUGIN_SCRIPTS };
  delete process.env.HOST;
  const opts = parseArgs(marisaArgs()), clients = [];
  process.env.SP_PLUGIN_SCRIPTS = serverEnv(opts, {}).SP_PLUGIN_SCRIPTS;
  let srv;
  t.after(async () => {
    await Promise.all(clients.map(c => c.terminate()));
    await srv?.close();
    if (saved.host === undefined) delete process.env.HOST; else process.env.HOST = saved.host;
    if (saved.scripts === undefined) delete process.env.SP_PLUGIN_SCRIPTS; else process.env.SP_PLUGIN_SCRIPTS = saved.scripts;
  });
  srv = await startServer({ port: 0, host: opts.host, quiet: true, assetIndex: false, studio: false });
  const host = await TestClient.connect(`ws://127.0.0.1:${srv.port}/ws`); clients.push(host);
  await host.hello('Host');
  assert.equal((await host.request({ t: 'room.create', mode: 'coop', difficulty: 'NORMAL' })).t, 'ok');
  const created = await host.waitFor('room.state', s => !!s.code);
  for (const { kind, address } of addresses) {
    const base = `http://${address}:${srv.port}`;
    const health = await fetch(base + '/healthz', { signal: AbortSignal.timeout(5000) });
    assert.equal(health.status, 200, `${kind} HTTP must be reachable`);
    assert.equal((await health.json()).ok, true);
    const guest = await TestClient.connect(`ws://${address}:${srv.port}/ws`); clients.push(guest);
    const welcome = await guest.hello('Guest-' + kind);
    assert.equal((await guest.request({ t: 'room.join', code: created.code })).t, 'ok');
    await guest.waitFor('room.state', s => s.seats.some(p => p?.playerId === welcome.playerId));
    t.diagnostic(`${kind} HTTP, WebSocket and room join passed`);
  }
  const applied = await host.request({ t: 'room.setPlugins', plugins: [{ id: 'marisa' }] }, 15000);
  assert.equal(applied.t, 'ok', JSON.stringify(applied));
  for (const guest of clients.slice(1)) {
    const state = await guest.waitFor('room.state', s => s.content?.execution === 'sandbox', 15000);
    assert.ok(state.content.plugins.some(p => p.id === 'marisa'));
  }
});
