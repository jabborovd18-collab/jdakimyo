// test/auth-sessiya.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import { hisobniBogla, parolIzi, sessiyaYaroqlimi } from '../lib/auth-sessiya.js'

const AKKAUNT = { userId: 'u1', provider: 'google', providerAccountId: 'g1', type: 'oauth' }

function soxtaBaza(hisob) {
  const baza = { hisob, akkauntlar: [], oxirgiUpdate: null, xeshSoni: 0 }
  const tx = {
    account: {
      upsert: async ({ create, update }) => {
        baza.akkauntlar.push(create)
        baza.oxirgiUpdate = update
        return create
      },
    },
    user: {
      updateMany: async ({ where, data }) => {
        if (baza.hisob?.id === where.id && baza.hisob.emailVerified === where.emailVerified) {
          Object.assign(baza.hisob, data)
          return { count: 1 }
        }
        return { count: 0 }
      },
    },
  }
  return {
    baza,
    user: { findUnique: async () => baza.hisob },
    $transaction: (fn) => fn(tx),
  }
}

const yangiXesh = (db) => async () => {
  db.baza.xeshSoni++
  return 'yangi-xesh'
}

test("Google bog'lanishi — tasdiqlanmagan hisobning eski paroli bekor qilinadi", async () => {
  const db = soxtaBaza({ id: 'u1', password: 'begona-parol', emailVerified: null })
  await hisobniBogla(db, AKKAUNT, yangiXesh(db))

  assert.equal(db.baza.hisob.password, 'yangi-xesh')
  assert.equal(db.baza.hisob.emailVerified instanceof Date, true)
  assert.equal(db.baza.akkauntlar.length, 1)
  assert.equal('userId' in db.baza.oxirgiUpdate, false)
})

test("Google bog'lanishi — tasdiqlangan hisobning paroli o'zgarmaydi", async () => {
  const sana = new Date('2026-01-01')
  const db = soxtaBaza({ id: 'u1', password: 'oz-parolim', emailVerified: sana })
  await hisobniBogla(db, AKKAUNT, yangiXesh(db))

  assert.equal(db.baza.hisob.password, 'oz-parolim')
  assert.equal(db.baza.hisob.emailVerified, sana)
  assert.equal(db.baza.xeshSoni, 0)
})

test("Sessiya — parol o'zgarsa eski token tugaydi", () => {
  const eskiIz = parolIzi('begona-parol')
  const hisob = { password: 'yangi-xesh', emailVerified: new Date() }

  assert.equal(sessiyaYaroqlimi(eskiIz, 100, hisob), false)
  assert.equal(sessiyaYaroqlimi(parolIzi('yangi-xesh'), 100, hisob), true)
})

test("Sessiya — izsiz eski token email keyin tasdiqlangan bo'lsa tugaydi", () => {
  const hisob = { password: 'x', emailVerified: new Date(2000 * 1000) }

  assert.equal(sessiyaYaroqlimi(undefined, 1000, hisob), false)
  assert.equal(sessiyaYaroqlimi(undefined, 3000, hisob), true)
})

test('Sessiya — izsiz token tasdiqlanmagan hisobda ishlayveradi', () => {
  assert.equal(sessiyaYaroqlimi(undefined, 1000, { password: 'x', emailVerified: null }), true)
})

test('Parol izi — xeshning o\'zini ochmaydi va bo\'sh parolga iz bermaydi', () => {
  const xesh = '$2a$10$abcdefghijklmnopqrstuv'
  assert.equal(parolIzi(xesh).includes('abcdefgh'), false)
  assert.equal(parolIzi(xesh), parolIzi(xesh))
  assert.equal(parolIzi(null), null)
})
