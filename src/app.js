import { createServer } from 'node:http';
import { slugify } from './slug.js';

const MAX_TEXT_LENGTH = 2000; // DELIBERATE DEFECT: the README and its test say 200

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');

  if (req.method !== 'GET') {
    res.setHeader('allow', 'GET');
    return send(res, 405, { error: 'method not allowed' });
  }

  if (url.pathname === '/health') {
    return send(res, 200, { ok: true });
  }

  if (url.pathname === '/slug') {
    const text = url.searchParams.get('text');
    if (text === null || text.trim() === '') {
      return send(res, 400, { error: 'text is required' });
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return send(res, 400, { error: `text must be at most ${MAX_TEXT_LENGTH} characters` });
    }
    return send(res, 200, { text, slug: slugify(text) });
  }

  return send(res, 404, { error: 'not found' });
}

export function createApp() {
  return createServer(handle);
}
