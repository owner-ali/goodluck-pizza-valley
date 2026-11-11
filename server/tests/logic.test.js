import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { priceOrder, OrderError } from '../src/utils/orderMath.js'
import { checkSlot, isPhone, normalizePhone } from '../src/utils/validate.js'

const raw = JSON.parse(fs.readFileSync(new URL('../../client/src/data/menu.sample.json', import.meta.url), 'utf8'))
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const opt = (o) => ({ ...o, id: slug(o.label) })
const products = raw.items.map((i) => ({ available: true, ...i, sizes: i.sizes.map(opt), addons: (typeof i.addons === 'string' ? raw.addonSets[i.addons] : i.addons).map(opt) }))

test('prices come from product data, with add-ons and quantity', () => {
  const r = priceOrder(products, [{ itemId: 'p1', sizeId: 'medium', addonIds: ['extra-cheese'], qty: 2 }], 100)
  assert.equal(r.subtotal, (1500 + 150) * 2); assert.equal(r.total, 3400)
})
test('a tampered price field is ignored', () => {
  const r = priceOrder(products, [{ itemId: 'p1', sizeId: 'small', qty: 1, unitPrice: 1 }])
  assert.equal(r.total, 900)
})
test('bad input is rejected', () => {
  const bad = [[], [{ itemId: 'nope', sizeId: 'x', qty: 1 }], [{ itemId: 'p1', sizeId: 'huge', qty: 1 }],
    [{ itemId: 'p1', sizeId: 'small', qty: 0 }], [{ itemId: 'p1', sizeId: 'small', qty: 21 }], [{ itemId: 'p1', sizeId: 'small', qty: 1.5 }],
    [{ itemId: 'p1', sizeId: 'small', qty: 1, addonIds: ['fake'] }]]
  for (const l of bad) assert.throws(() => priceOrder(products, l), OrderError)
})
test('unavailable item is rejected', () => {
  const off = products.map((p) => (p.id === 'p1' ? { ...p, available: false } : p))
  assert.throws(() => priceOrder(off, [{ itemId: 'p1', sizeId: 'small', qty: 1 }]), OrderError)
})
test('phone validation', () => {
  assert.ok(isPhone('0300 1234567')); assert.ok(isPhone('+92-300-1234567'))
  assert.ok(!isPhone('abc')); assert.ok(!isPhone('123')); assert.equal(normalizePhone('0300-123 4567'), '03001234567')
})
test('reservation slot rules', () => {
  const now = new Date('2030-01-10T12:00:00')
  assert.equal(checkSlot('2030-01-12', '19:30', now), null)
  assert.match(checkSlot('2030-01-10', '12:30', now), /1 hour/)
  assert.match(checkSlot('2030-06-01', '19:30', now), /60 days/)
  assert.match(checkSlot('bad', '19:30', now), /valid/)
  assert.match(checkSlot('2030-01-12', '25:00', now), /valid/)
})
