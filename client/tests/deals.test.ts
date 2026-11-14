import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { expandMenu } from '../src/lib/expandMenu.ts'
import { savePct, minPrice } from '../src/lib/pricing.ts'
const menu = expandMenu(JSON.parse(readFileSync(new URL('../src/data/menu.sample.json', import.meta.url), 'utf8')))
test('Hot Deals come first and every deal really is cheaper than its original price', () => {
  assert.equal(menu.categories[0].id, 'deals')
  const deals = menu.items.filter((i: any) => i.categoryId === 'deals')
  assert.ok(deals.length >= 3)
  for (const d of deals) { assert.ok(d.compareAt > minPrice(d), d.id); const p = savePct(d); assert.ok(p > 0 && p < 100, d.id) }
})
test('savePct handles missing, null and bad values', () => {
  const base: any = { sizes: [{ id: 'a', label: 'A', price: 800 }] }
  assert.equal(savePct({ ...base }), 0); assert.equal(savePct({ ...base, compareAt: null }), 0)
  assert.equal(savePct({ ...base, compareAt: 800 }), 0); assert.equal(savePct({ ...base, compareAt: 1000 }), 20)
})
