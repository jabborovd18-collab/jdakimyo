// test/auth-adapter.test.js
//
// Google OAuth uchun moslashtirilgan NextAuth adapterini tekshirish.
// Baza ma'lumotlar sxemasi (User: userId, username, password NOT NULL)
// va NextAuth (name, image) o'rtasidagi ko'prik to'g'ri ishlashini kafolatlaydi.

import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { createCustomAuthAdapter } from '../lib/auth-adapter.js'

describe('createCustomAuthAdapter', () => {
  test('adapter kerakli barcha NextAuth usullariga ega', () => {
    const adapter = createCustomAuthAdapter()
    assert.equal(typeof adapter.createUser, 'function')
    assert.equal(typeof adapter.getUser, 'function')
    assert.equal(typeof adapter.getUserByEmail, 'function')
    assert.equal(typeof adapter.getUserByAccount, 'function')
    assert.equal(typeof adapter.updateUser, 'function')
    assert.equal(typeof adapter.linkAccount, 'function')
    assert.equal(typeof adapter.unlinkAccount, 'function')
    assert.equal(typeof adapter.getAccount, 'function')
  })

  test('parametrlar bo\'sh yoki null bo\'lganda xavfsiz null qaytaradi', async () => {
    const adapter = createCustomAuthAdapter()
    assert.equal(await adapter.getUser(null), null)
    assert.equal(await adapter.getUser(undefined), null)
    assert.equal(await adapter.getUserByEmail(null), null)
    assert.equal(await adapter.getUserByEmail(''), null)
    assert.equal(await adapter.getUserByAccount({}), null)
    assert.equal(await adapter.getUserByAccount({ provider: 'google' }), null)
    assert.equal(await adapter.updateUser(null), null)
    assert.equal(await adapter.updateUser({}), null)
    assert.equal(await adapter.unlinkAccount(null), null)
    assert.equal(await adapter.unlinkAccount({}), null)
    assert.equal(await adapter.getAccount(null, null), null)
  })

  test('linkAccount to\'liq bo\'lmagan ma\'lumot berilsa xatolik tashlaydi', async () => {
    const adapter = createCustomAuthAdapter()
    await assert.rejects(async () => {
      await adapter.linkAccount({})
    }, /Akkaunt ma'lumotlari to'liq emas/)
  })

  test('createUser email berilmasa xatolik tashlaydi', async () => {
    const adapter = createCustomAuthAdapter()
    await assert.rejects(async () => {
      await adapter.createUser({})
    }, /Email manzil topilmadi/)
  })
})
