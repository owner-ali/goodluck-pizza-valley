import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeUrl } from '../src/utils/netlifyPath.js'
test('function paths map to the same Express paths', () => {
  assert.equal(normalizeUrl('/api/menu'), '/api/menu')
  assert.equal(normalizeUrl('/.netlify/functions/api/menu'), '/api/menu')
  assert.equal(normalizeUrl('/.netlify/functions/api/orders/track?x=1'), '/api/orders/track?x=1')
  assert.equal(normalizeUrl('/.netlify/functions/api/uploads/ab12.png'), '/uploads/ab12.png')
  assert.equal(normalizeUrl('/uploads/ab12.png'), '/uploads/ab12.png')
  assert.equal(normalizeUrl('/.netlify/functions/api'), '/api/')
})
