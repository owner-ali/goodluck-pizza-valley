import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseSizes, formatSizes, parseAddons, parseLines, formatLines } from '../src/lib/adminParse.ts'
test('sizes round trip', () => {
  const s = parseSizes('Small | 900\nLarge | 2000')
  assert.deepEqual(s, [{ label: 'Small', price: 900 }, { label: 'Large', price: 2000 }])
  assert.equal(formatSizes(s), 'Small | 900\nLarge | 2000')
})
test('bad lines throw readable errors', () => {
  assert.throws(() => parseSizes('Small'), /look like/); assert.throws(() => parseSizes('Small | abc'), /numbers/); assert.throws(() => parseSizes('Small | -5'), /numbers/)
})
test('addons and free text', () => {
  assert.deepEqual(parseAddons('Toppings | Olives | 80'), [{ group: 'Toppings', label: 'Olives', price: 80 }])
  const r = parseLines('Is it halal? | Yes | really', ['q', 'a']); assert.equal(r[0].a, 'Yes|really')
  assert.equal(formatLines([{ q: 'A', a: 'B' }], ['q', 'a']), 'A | B')
})
