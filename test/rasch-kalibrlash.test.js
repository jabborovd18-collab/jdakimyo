// test/rasch-kalibrlash.test.js
//
// Kalibrlash to'g'riligining isboti: qiyinligi ma'lum simulyatsiyadan o'sha
// qiyinliklar qayta tiklanishi kerak.
import test from 'node:test'
import assert from 'node:assert/strict'
import { kalibrla } from '../lib/rasch-kalibrlash.js'
import { raschEhtimollik } from '../lib/rasch-model.js'

// Nega o'z generatorimiz: Math.random bilan test har safar boshqa natija beradi
function tasodifiy(boshlangich) {
  let s = boshlangich >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

function normal(r) {
  return Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r())
}

function simulyatsiya(qiyinliklar, odamlar, urug = 7, tartibsizSavol = null) {
  const r = tasodifiy(urug)
  return Array.from({ length: odamlar }, () => {
    const theta = normal(r)
    return qiyinliklar.map((b, i) => {
      if (i === tartibsizSavol) return r() < 0.5 ? 1 : 0
      return r() < raschEhtimollik(theta, b) ? 1 : 0
    })
  })
}

const kalitlar = (n) => Array.from({ length: n }, (_, i) => `s#${i + 1}`)
const HAQIQIY = Array.from({ length: 30 }, (_, i) => -2 + (4 * i) / 29)

test('Kalibrlash — haqiqiy qiyinliklar qayta tiklanadi', () => {
  const natija = kalibrla(simulyatsiya(HAQIQIY, 3000), kalitlar(30))

  assert.equal(natija.yaqinlashdi, true)
  assert.equal(natija.savollar.length, 30)
  const xatolar = natija.savollar.map((s, i) => Math.abs(s.qiyinlik - HAQIQIY[i]))
  assert.equal(Math.max(...xatolar) < 0.2, true, `eng katta xato ${Math.max(...xatolar)}`)
  const orta = xatolar.reduce((a, b) => a + b, 0) / 30
  assert.equal(orta < 0.08, true, `o'rtacha xato ${orta}`)
})

test('Kalibrlash — qiyinliklar markazlangan va SE o\'z xatosiga mos', () => {
  const natija = kalibrla(simulyatsiya(HAQIQIY, 3000), kalitlar(30))
  const yigindi = natija.savollar.reduce((s, x) => s + x.qiyinlik, 0)
  assert.equal(Math.abs(yigindi) < 0.05, true)

  const ichida = natija.savollar.filter((s, i) => Math.abs(s.qiyinlik - HAQIQIY[i]) < 2 * s.se)
  assert.equal(ichida.length >= 26, true, `${ichida.length}/30 savol 2 SE ichida`)
})

test("Kalibrlash — modelga mos ma'lumotda savollar toza, ishonchlilik yuqori", () => {
  const natija = kalibrla(simulyatsiya(HAQIQIY, 3000), kalitlar(30))
  const fitMuammo = natija.savollar.filter((s) => s.muammo.includes('infit'))
  assert.equal(fitMuammo.length, 0)
  assert.equal(natija.ishonchlilik > 0.8, true, `ishonchlilik ${natija.ishonchlilik}`)
})

test('Kalibrlash — bilimni ajratmaydigan savol topiladi', () => {
  const natija = kalibrla(simulyatsiya(HAQIQIY, 3000, 11, 15), kalitlar(30))
  const yomon = natija.savollar.find((s) => s.kalit === 's#16')
  assert.equal(yomon.muammo.length > 0, true)
  assert.equal(yomon.infit > 1.3, true, `infit ${yomon.infit}`)
  assert.equal(yomon.korrelyatsiya < 0.15, true, `bog'lanish ${yomon.korrelyatsiya}`)
})

test("Kalibrlash — chekka o'quvchi va savollar chetga olinadi", () => {
  const matritsa = simulyatsiya([-1, -0.5, 0, 0.5, 1], 500).map((q) => [...q, 1])
  matritsa.push([0, 0, 0, 0, 0, 0])
  const natija = kalibrla(matritsa, kalitlar(6))

  // 0 balli o'quvchi ketgach, oxirgi savolni hamma to'g'ri ishlagan bo'lib qoladi
  assert.equal(natija.chetda.includes('s#6'), true)
  assert.equal(natija.tashlangan > 0, true)
})

test("Kalibrlash — hamma to'g'ri ishlagan savol chetga olinadi", () => {
  const matritsa = simulyatsiya([-1, -0.5, 0, 0.5, 1], 500).map((q) => [...q, 1])
  const natija = kalibrla(matritsa, kalitlar(6))
  assert.deepEqual(natija.chetda, ['s#6'])
  assert.equal(natija.savollar.length, 5)
})

test("Kalibrlash — ma'lumot yetarli bo'lmasa xato beradi", () => {
  assert.throws(() => kalibrla([[1, 1], [0, 0]], kalitlar(2)))
})
