import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from '../src/slug.js';

test('lowercases and joins words with hyphens', () => {
  assert.equal(slugify('Hello World'), 'hello-world');
});

test('collapses runs of punctuation and whitespace', () => {
  assert.equal(slugify('  ship it -- now!! '), 'ship-it-now');
});

test('strips accents', () => {
  assert.equal(slugify('Crème Brûlée'), 'creme-brulee');
});

test('returns an empty string when nothing is left', () => {
  assert.equal(slugify('!!!'), '');
});
