import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cleanProduct, cleanSettings, sniffImage, slug } from '../src/utils/adminClean.js'

test('cleanProduct normalizes and builds ids', () => {
  const p = cleanProduct({ name: ' Test Pizza ', categoryId: 'pizza', sizes: [{ label: 'Small', price: '900.4' }], addons: [{ group: 'Toppings', label: 'Extra cheese', price: 150 }], image: '/uploads/abc123.png', color: '#fff' })
  assert.equal(p.name, 'Test Pizza'); assert.equal(p.sizes[0].id, 'small'); assert.equal(p.sizes[0].price, 900)
  assert.equal(p.addons[0].id, 'extra-cheese'); assert.equal(p.image, '/uploads/abc123.png'); assert.equal(p.color, undefined)
})
test('cleanProduct rejects bad input', () => {
  assert.throws(() => cleanProduct({ name: 'x', sizes: [{ label: 'S', price: 1 }] }), /name/)
  assert.throws(() => cleanProduct({ name: 'Okay', sizes: [] }), /size/)
  assert.throws(() => cleanProduct({ name: 'Okay', sizes: [{ label: 'A', price: 1 }, { label: 'a', price: 2 }] }), /Duplicate/)
  assert.equal(cleanProduct({ name: 'Okay', sizes: [{ label: 'A', price: -5 }], image: 'http://evil/x.png' }).sizes[0].price, 0)
  assert.equal(cleanProduct({ name: 'Okay', sizes: [{ label: 'A', price: 1 }], image: 'http://evil/x.png' }).image, '')
})
test('cleanSettings blocks non-http links and caps values', () => {
  const s = cleanSettings({ social: { facebook: 'javascript:alert(1)', instagram: 'https://instagram.com/x' }, deliveryFee: 'abc', faqs: [{ q: 'Q', a: '' }, { q: 'Q2', a: 'A2' }] })
  assert.equal(s.social.facebook, ''); assert.equal(s.social.instagram, 'https://instagram.com/x')
  assert.equal(s.deliveryFee, 0); assert.equal(s.faqs.length, 1)
})
test('sniffImage checks real bytes', () => {
  assert.equal(sniffImage(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0])), 'jpg')
  assert.equal(sniffImage(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0, 0, 0, 0, 0])), 'png')
  assert.equal(sniffImage(Buffer.from('RIFF1234WEBP')), 'webp')
  assert.equal(sniffImage(Buffer.from('<?php echo 1; ?> not an image')), null)
})
test('slug', () => assert.equal(slug('Extra  Cheese!'), 'extra-cheese'))
