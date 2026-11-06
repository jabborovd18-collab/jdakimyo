// test/rasch-model.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  raschEhtimollik,
  hisoblaRaschTheta,
  aniqlaDaraja,
  tuzWrightMap,
} from '../lib/rasch-model.js'

test('Rasch modeli — ehtimollik formulasi', () => {
  // Agar theta == b bo'lsa, to'g'ri topish ehtimolligi roppa-rosa 0.5 (50%)
  const p1 = raschEhtimollik(0, 0)
  assert.equal(Math.abs(p1 - 0.5) < 0.0001, true)

  const p2 = raschEhtimollik(1.5, 1.5)
  assert.equal(Math.abs(p2 - 0.5) < 0.0001, true)

  // Agar qobiliyat yuqori bo'lsa (theta = 2, b = 0), ehtimollik > 0.85
  const p3 = raschEhtimollik(2.0, 0.0)
  assert.equal(p3 > 0.85, true)

  // Agar savol ancha qiyin bo'lsa (theta = -1, b = 2), ehtimollik < 0.1
  const p4 = raschEhtimollik(-1.0, 2.0)
  assert.equal(p4 < 0.1, true)
})

test('Rasch modeli — Newton-Raphson konvergentsiyasi va baholash', () => {
  // 10 ta turli qiyinchilikdagi savollar (-2 dan +2 gacha logit)
  const savollar = [
    { id: 1, qiyinlik: -2.0 },
    { id: 2, qiyinlik: -1.5 },
    { id: 3, qiyinlik: -1.0 },
    { id: 4, qiyinlik: -0.5 },
    { id: 5, qiyinlik: 0.0 },
    { id: 6, qiyinlik: 0.5 },
    { id: 7, qiyinlik: 1.0 },
    { id: 8, qiyinlik: 1.5 },
    { id: 9, qiyinlik: 2.0 },
    { id: 10, qiyinlik: 2.5 },
  ]

  // Kuchli o'quvchi: birinchi 8 tasini to'g'ri, oxirgi 2 ta eng qiyinini xato qildi
  const javoblarKuchli = [1, 1, 1, 1, 1, 1, 1, 1, 0, 0]
  const natijaKuchli = hisoblaRaschTheta(savollar, javoblarKuchli)

  assert.equal(natijaKuchli.rawScore, 8)
  assert.equal(natijaKuchli.foiz, 80)
  assert.equal(natijaKuchli.theta > 1.0, true, "Kuchli o'quvchi thetasi musbat va yuqori bo'lishi kerak")
  assert.equal(['A+', 'A'].includes(natijaKuchli.daraja), true)
  assert.equal(natijaKuchli.se > 0 && natijaKuchli.se < 1.5, true)

  // O'rta o'quvchi: 5 ta osonini to'g'ri, 5 ta qiyinini xato
  const javoblarOrta = [1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
  const natijaOrta = hisoblaRaschTheta(savollar, javoblarOrta)

  assert.equal(natijaOrta.rawScore, 5)
  assert.equal(Math.abs(natijaOrta.theta) < 0.6, true, "O'rta o'quvchi thetasi 0 atrofida bo'lishi kerak")
  assert.equal(['B+', 'B', 'C+'].includes(natijaOrta.daraja), true)

  // Chekka holat: barchasi to'g'ri (10/10)
  const javoblarMaks = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  const natijaMaks = hisoblaRaschTheta(savollar, javoblarMaks)
  assert.equal(natijaMaks.daraja, 'A+')
  assert.equal(natijaMaks.theta > 2.5, true)

  // Chekka holat: barchasi xato (0/10)
  const javoblarNol = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const natijaNol = hisoblaRaschTheta(savollar, javoblarNol)
  assert.equal(natijaNol.daraja, 'Qoniqarsiz')
  assert.equal(natijaNol.theta < -2.5, true)
})

test('Rasch modeli — Wright Map tuzilishi', () => {
  const savollar = [
    { id: 1, mavzu: "Atom tuzilishi", qiyinlik: -1.0 },
    { id: 2, mavzu: "Eritmalar", qiyinlik: 0.2 },
    { id: 3, mavzu: "Elektroliz", qiyinlik: 1.8 },
  ]
  const theta = 0.5 // O'quvchi qobiliyati
  const javoblar = [1, 1, 0]

  const xarita = tuzWrightMap(theta, savollar, javoblar)
  assert.equal(xarita.length, 3)

  // 1-savol theta dan ancha oson (0.5 - (-1.0) = 1.5 > 0.4) -> ozlashtirilgan
  assert.equal(xarita[0].holat, 'ozlashtirilgan')
  assert.equal(xarita[0].togri, true)

  // 2-savol theta ga juda yaqin (|0.5 - 0.2| = 0.3 <= 0.4) -> chegara
  assert.equal(xarita[1].holat, 'chegara')

  // 3-savol theta dan ancha qiyin (1.8 - 0.5 = 1.3 > 0.4) -> murakkab
  assert.equal(xarita[2].holat, 'murakkab')
  assert.equal(xarita[2].togri, false)
})

test('Rasch va BMBA savollar ombori — tekshirJavob va getSavollarBySlug', async () => {
  const { tekshirJavob, getSavollarBySlug } = await import('../data/milliy-sertifikat/savollar-ombromi.js')

  // Ochiq sonli savollar (tolerans va vergul/nuqta normalizatsiyasi)
  const ochiq1 = { turi: 'ochiq', correct: '22.3', altCorrect: '22,3' }
  assert.equal(tekshirJavob(ochiq1, '22.3'), true)
  assert.equal(tekshirJavob(ochiq1, '22,3'), true)
  assert.equal(tekshirJavob(ochiq1, '22.32'), true, '±0.05 tolerans ichida to\'g\'ri')
  assert.equal(tekshirJavob(ochiq1, '22.35'), true, 'chegara toleransida to\'g\'ri')
  assert.equal(tekshirJavob(ochiq1, '22.5'), false, 'toleransdan tashqarida xato')
  assert.equal(tekshirJavob(ochiq1, ''), false)

  const ochiq2 = { turi: 'ochiq', correct: '64' }
  assert.equal(tekshirJavob(ochiq2, '64'), true)
  assert.equal(tekshirJavob(ochiq2, ' 64 '), true)
  assert.equal(tekshirJavob(ochiq2, '65'), false)

  // Variantli savollar (harf va indeks)
  const variantHarf = { turi: 'variant', correct: 'C' }
  assert.equal(tekshirJavob(variantHarf, 'C'), true)
  assert.equal(tekshirJavob(variantHarf, 'c'), true)
  assert.equal(tekshirJavob(variantHarf, 2), true, '2-indeks C ga mos keladi')
  assert.equal(tekshirJavob(variantHarf, 'A'), false)

  const variantIndeks = { turi: 'variant', correct: 0, options: ['A javob', 'B javob', 'C javob', 'D javob'] }
  assert.equal(tekshirJavob(variantIndeks, 0), true)
  assert.equal(tekshirJavob(variantIndeks, 'A'), true)
  assert.equal(tekshirJavob(variantIndeks, 'a'), true)
  assert.equal(tekshirJavob(variantIndeks, 'B'), false)

  // getSavollarBySlug tekshiruvi
  const diag = getSavollarBySlug('rasch-diagnostika')
  assert.equal(diag.length, 30)

  const ms1 = getSavollarBySlug('milliy-sertifikat-simulyator')
  assert.equal(ms1.length, 40)
  assert.equal(ms1[0].turi, 'variant')
  assert.equal(ms1[35].turi, 'ochiq') // 36-savol ochiq

  const ms2 = getSavollarBySlug('milliy-sertifikat-simulyator-2')
  assert.equal(ms2.length, 40)
})
