import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { SEPARATORS, slugify } from './slug.js';

// Read once at start-up: the running build reports the version it shipped as.
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const VERSION = { name: pkg.name, version: pkg.version };

const MAX_TEXT_LENGTH = 200;

// A caller's id is echoed only when it is short and plain, so it is safe to
// log and to put back in a header; anything else gets a fresh one.
const REQUEST_ID = /^[A-Za-z0-9._-]{1,64}$/;

function requestId(req) {
  const given = req.headers['x-request-id'];
  return typeof given === 'string' && REQUEST_ID.test(given) ? given : randomUUID();
}

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

function handle(req, res) {
  res.setHeader('x-request-id', requestId(req));
  const url = new URL(req.url, 'http://localhost');

  if (req.method !== 'GET') {
    res.setHeader('allow', 'GET');
    return send(res, 405, { error: 'method not allowed' });
  }

  if (url.pathname === '/health') {
    return send(res, 200, { ok: true });
  }

  if (url.pathname === '/version') {
    return send(res, 200, VERSION);
  }

  if (url.pathname === '/slug') {
    const text = url.searchParams.get('text');
    if (text === null || text.trim() === '') {
      return send(res, 400, { error: 'text is required' });
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return send(res, 400, { error: `text must be at most ${MAX_TEXT_LENGTH} characters` });
    }
    const separator = url.searchParams.get('separator') ?? '-';
    if (!SEPARATORS.includes(separator)) {
      return send(res, 400, { error: `separator must be one of: ${SEPARATORS.join(', ')}` });
    }
    return send(res, 200, { text, slug: slugify(text, separator) });
  }

  return send(res, 404, { error: 'not found' });
}

export function createApp() {
  return createServer(handle);
}
