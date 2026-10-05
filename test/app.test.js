import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createApp } from '../src/app.js';

let server;
let base;

before(async () => {
  server = createApp();
  await new Promise((resolve) => server.listen(0, resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

test('GET /health reports ok', async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
});

test('GET /version reports the name and version in package.json', async () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const res = await fetch(`${base}/version`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'application/json');
  assert.deepEqual(await res.json(), { name: pkg.name, version: pkg.version });
});

test('POST /version is a 405', async () => {
  const res = await fetch(`${base}/version`, { method: 'POST' });
  assert.equal(res.status, 405);
});

test('GET /slug returns the slug of text', async () => {
  const res = await fetch(`${base}/slug?text=${encodeURIComponent('Night Gate, Demo!')}`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { text: 'Night Gate, Demo!', slug: 'night-gate-demo' });
});

test('GET /slug without text is a 400', async () => {
  const res = await fetch(`${base}/slug`);
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { error: 'text is required' });
});

test('GET /slug with overlong text is a 400', async () => {
  const res = await fetch(`${base}/slug?text=${'a'.repeat(201)}`);
  assert.equal(res.status, 400);
});

test('unknown paths are a 404', async () => {
  const res = await fetch(`${base}/nope`);
  assert.equal(res.status, 404);
});

test('non-GET methods are a 405', async () => {
  const res = await fetch(`${base}/health`, { method: 'POST' });
  assert.equal(res.status, 405);
  assert.equal(res.headers.get('allow'), 'GET');
});
