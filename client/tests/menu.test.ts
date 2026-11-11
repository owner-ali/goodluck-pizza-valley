import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { expandMenu } from '../src/lib/expandMenu.ts'
import { lineTotal, applyFilters, formatPKR, minPrice, clampQty } from '../src/lib/pricing.ts'

const raw = JSON.parse(readFileSync(new URL('../src/data/menu.sample.json', import.meta.url), 'utf8'))
const menu = expandMenu(raw)
const f = { categoryId: 'all', query: '', vegOnly: false, maxPrice: null, sort: 'name' } as const

test('every item has a valid category, size and unique id', () => {
  const cats = new Set(menu.categories.map((c: any) => c.id))
  const ids = new Set()
  for (const i of menu.items) {
    assert.ok(cats.has(i.categoryId), i.id); assert.ok(i.sizes.length > 0, i.id)
    assert.ok(!ids.has(i.id), 'dup ' + i.id); ids.add(i.id)
    assert.equal(new Set(i.sizes.map((s: any) => s.id)).size, i.sizes.length)
  }
})
test('all ten required categories have items', () => {
  assert.equal(menu.categories.length, 10)
  for (const c of menu.categories) assert.ok(menu.items.some((i: any) => i.categoryId === c.id), c.id)
})
test('lineTotal adds size, add-ons and quantity', () => {
  const p = menu.items.find((i: any) => i.id === 'p1')
  assert.equal(lineTotal(p, 'medium', [], 1), 1500)
  assert.equal(lineTotal(p, 'medium', ['extra-cheese', 'stuffed-crust'], 2), (1500 + 150 + 200) * 2)
  assert.throws(() => lineTotal(p, 'nope', [], 1))
})
test('quantity is clamped 1..20', () => { assert.equal(clampQty(0), 1); assert.equal(clampQty(99), 20); assert.equal(clampQty(NaN), 1) })
test('filters: category, search, veg, price, sort', () => {
  assert.ok(applyFilters(menu.items, { ...f, categoryId: 'pizza' }).every((i) => i.categoryId === 'pizza'))
  assert.deepEqual(applyFilters(menu.items, { ...f, query: 'LAGOON' }).map((i) => i.id), ['m1'])
  assert.ok(applyFilters(menu.items, { ...f, vegOnly: true }).every((i) => i.veg))
  assert.ok(applyFilters(menu.items, { ...f, maxPrice: 500 }).every((i) => minPrice(i) <= 500))
  const asc = applyFilters(menu.items, { ...f, sort: 'price-asc' }).map(minPrice)
  assert.deepEqual(asc, [...asc].sort((a, b) => a - b))
  assert.equal(applyFilters(menu.items, { ...f, query: 'zzzz' }).length, 0)
})
test('formatPKR', () => assert.equal(formatPKR(1500), 'Rs 1,500'))
