import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cleanProduct } from '../src/utils/adminClean.js'
const base = { name: 'Deal', categoryId: 'deals', sizes: [{ label: 'Deal', price: 800 }] }
test('compareAt is kept as a whole number, and cleared with null', () => {
  assert.equal(cleanProduct({ ...base, compareAt: '1000.4' }).compareAt, 1000)
  assert.equal(cleanProduct({ ...base, compareAt: '' }).compareAt, null)
  assert.equal(cleanProduct({ ...base, compareAt: -5 }).compareAt, null)
  assert.equal(cleanProduct({ ...base }).compareAt, null)
})
