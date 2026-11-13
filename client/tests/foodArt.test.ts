import { test } from 'node:test'
import assert from 'node:assert/strict'
import { artSvg, ART_CATEGORIES } from '../src/lib/foodArt.ts'
test('every category renders valid-looking svg with unique ids', () => {
  assert.equal(ART_CATEGORIES.length, 10)
  for (const c of ART_CATEGORIES) {
    const a = artSvg(c, 'ua'), b = artSvg(c, 'ub')
    assert.ok(a.includes('<g') && !a.includes('undefined') && !a.includes('NaN'), c)
    assert.ok(!a.includes('"ub') && b.includes('ub'), c)
    assert.equal((a.match(/<g/g) ?? []).length, (a.match(/<\/g>/g) ?? []).length, c + ' balanced <g>')
  }
})
test('unknown category falls back and colours are sanitised', () => {
  assert.equal(artSvg('nope', 'u'), artSvg('pizza', 'u'))
  assert.ok(artSvg('mocktails', 'u', '#ff0000').includes('#ff0000'))
  assert.ok(!artSvg('mocktails', 'u', 'red;"><script>').includes('script'))
})
