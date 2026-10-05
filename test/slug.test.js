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

test('joins words with the separator it is given', () => {
  assert.equal(slugify('Hello World, Again', '_'), 'hello_world_again');
});

test('trims a leading or trailing underscore separator', () => {
  assert.equal(slugify('--Hello__World--', '_'), 'hello_world');
});

test('trims a leading or trailing hyphen separator', () => {
  assert.equal(slugify('__Hello--World__', '-'), 'hello-world');
});

test('refuses a separator other than - or _', () => {
  assert.throws(() => slugify(' a b ', '.'), RangeError);
  assert.throws(() => slugify('a b', '$&'), RangeError);
});
