// test/qr-skaner.test.js
import test, { describe } from 'node:test'
import assert from 'node:assert/strict'
import { qrMatniniTahlilQil, qurilmaQisqaNomi } from '../lib/qr-skaner.js'

describe('QR skaner tahlilchisi', () => {
  test('production va lokal doska auth havolalarini taniydi', () => {
    const res1 = qrMatniniTahlilQil(
      'https://www.jdakimyo.uz/doska/auth/abcDEF_1234567890-xyz'
    )
    assert.equal(res1.ok, true)
    assert.equal(res1.tur, 'doska-auth')
    assert.equal(res1.token, 'abcDEF_1234567890-xyz')
    assert.equal(res1.manzil, '/doska/auth/abcDEF_1234567890-xyz')

    const res2 = qrMatniniTahlilQil(
      'http://localhost:3012/doska/auth/tok_12345678',
      'http://localhost:3012'
    )
    assert.equal(res2.ok, true)
    assert.equal(res2.manzil, '/doska/auth/tok_12345678')

    const preview = qrMatniniTahlilQil(
      'https://jda-preview-123.vercel.app/doska/auth/tok_12345678',
      'https://jda-preview-123.vercel.app'
    )
    assert.equal(preview.ok, true)
    assert.equal(preview.manzil, '/doska/auth/tok_12345678')
  })

  test('tokensiz umumiy /doska/auth va /doska havolasini rad etadi', () => {
    const bare = qrMatniniTahlilQil('https://www.jdakimyo.uz/doska/auth')
    assert.equal(bare.ok, false)
    assert.match(bare.xato, /umumiy doska/i)
  })

  test('tashqi saytlar va xavfli sxemalarni open-redirectdan himoya qiladi', () => {
    const evil = qrMatniniTahlilQil(
      'https://evil.example/doska/auth/tok_12345678',
      'https://www.jdakimyo.uz'
    )
    assert.equal(evil.ok, false)
    assert.equal(evil.tashqi, true)

    const protoRel = qrMatniniTahlilQil('//evil.com/doska/auth/tok_12345678')
    assert.equal(protoRel.ok, false)

    const jsUrl = qrMatniniTahlilQil('javascript:alert(1)')
    assert.equal(jsUrl.ok, false)
  })

  test('Smart Jang QR va PIN kodlarini hamda sertifikatlarni taniydi', () => {
    const jangUrl = qrMatniniTahlilQil(
      'https://www.jdakimyo.uz/doska/jang/482910?jamoa=alfa'
    )
    assert.equal(jangUrl.ok, true)
    assert.equal(jangUrl.tur, 'doska-jang')
    assert.equal(jangUrl.manzil, '/doska/jang/482910?jamoa=alfa')

    const pin = qrMatniniTahlilQil('482910')
    assert.equal(pin.ok, true)
    assert.equal(pin.manzil, '/doska/jang/482910')

    const cert = qrMatniniTahlilQil('/milliy-sertifikat/tekshir/MS-2026-001')
    assert.equal(cert.ok, true)
    assert.equal(cert.tur, 'sertifikat')
    assert.equal(cert.manzil, '/milliy-sertifikat/tekshir/MS-2026-001')
  })

  test("qolda kiritilgan 32+ belgili doska tokenini taniydi", () => {
    const rawToken = '7Rg6b-x41D9RjBpfT7aJ7WMhA95xn9evVBK7LdKYKMk'
    const res = qrMatniniTahlilQil(rawToken)
    assert.equal(res.ok, true)
    assert.equal(res.tur, 'doska-auth')
    assert.equal(res.manzil, `/doska/auth/${rawToken}`)
  })

  test('qurilmaQisqaNomi User-Agent dan qisqa nom chiqaradi', () => {
    assert.equal(
      qurilmaQisqaNomi('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36'),
      'Chrome · Windows'
    )
    assert.equal(qurilmaQisqaNomi(''), 'Elektron doska')
  })
})
