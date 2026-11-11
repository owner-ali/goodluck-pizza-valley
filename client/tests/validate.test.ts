import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isPhone } from '../src/lib/validate.ts'
test('client phone validation matches server', () => {
  assert.ok(isPhone('03001234567')); assert.ok(isPhone('+92 300 1234567')); assert.ok(!isPhone('0300')); assert.ok(!isPhone('hello'))
})
