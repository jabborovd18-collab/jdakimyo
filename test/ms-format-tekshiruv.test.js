// test/ms-format-tekshiruv.test.js
import test from "node:test"
import assert from "node:assert/strict"
import {
  MS_DARAJA_CHEGARALARI,
  MS_STANDART_TOLERANCE,
  MS_VARIANT_HARFLAR,
  RASMIY_KIMYO_MS_TUZILMASI,
  sonSifatidaOqi,
  tarkibJami,
  toleranceYaroqlimi,
  tuzilmaMatni,
} from "../lib/ms-format.js"
import { DARAJA_CHEGARALARI } from "../lib/rasch-model.js"
import { MILLIY_SERTIFIKAT_VARIANTLARI } from "../lib/milliy-sertifikat-data.js"
import { ommaviySavol } from "../lib/milliy-sertifikat-boshqaruvchi.js"
import { tekshirBank } from "../lib/milliy-sertifikat-bank.js"
import { tekshirJavob } from "../data/milliy-sertifikat/savollar-ombromi.js"

test("MS formati — yagona manba va katalog izchilligi", () => {
  assert.deepEqual(DARAJA_CHEGARALARI, MS_DARAJA_CHEGARALARI)
  const { yopiq, moslashtirish, ochiq, savollarSoni, vaqtMin } = RASMIY_KIMYO_MS_TUZILMASI.qism1
  assert.equal(yopiq.soni + moslashtirish.soni + ochiq.soni, savollarSoni)
  assert.equal(savollarSoni, 40)
  assert.equal(vaqtMin, 100)
  assert.equal(ochiq.standartAniqlik, MS_STANDART_TOLERANCE)
  assert.equal(RASMIY_KIMYO_MS_TUZILMASI.qism2Yozma.holat, "tasdiqlanishi_kutilmoqda")

  for (const variant of MILLIY_SERTIFIKAT_VARIANTLARI) {
    assert.equal(variant.savollarSoni, tarkibJami(variant.tarkib), variant.slug)
    assert.deepEqual(variant.tuzilma, tuzilmaMatni(variant.tarkib), variant.slug)
  }
})

test("sonSifatidaOqi va toleranceYaroqlimi — qat'iy tekshiruv", () => {
  assert.equal(sonSifatidaOqi("22,3"), 22.3)
  assert.equal(sonSifatidaOqi(" +0.025 "), 0.025)
  assert.equal(sonSifatidaOqi("-4"), -4)
  assert.equal(sonSifatidaOqi("12abc"), null)
  assert.equal(sonSifatidaOqi("2..3"), null)
  assert.equal(sonSifatidaOqi(""), null)

  assert.equal(toleranceYaroqlimi(undefined), true)
  assert.equal(toleranceYaroqlimi(0), true)
  assert.equal(toleranceYaroqlimi({ mutlaq: 0.01, nisbiy: 0.02 }), true)
  assert.equal(toleranceYaroqlimi(-0.1), false)
  assert.equal(toleranceYaroqlimi({}), false)
})

test("tekshirJavob — ochiq savol aniqligi (tolerance), altCorrect va A-F moslashtirish", () => {
  const standart = { id: 36, turi: "ochiq", correct: "22.3" }
  assert.equal(tekshirJavob(standart, "22,35"), true)
  assert.equal(tekshirJavob(standart, "22.36"), false)
  assert.equal(tekshirJavob(standart, "22.3abc"), false)

  const aniq = { id: 37, turi: "ochiq", correct: "0.025", tolerance: 0.001 }
  assert.equal(tekshirJavob(aniq, "0.026"), true)
  assert.equal(tekshirJavob(aniq, "0.029"), false)

  const butun = { id: 38, turi: "ochiq", correct: 2, tolerance: 0 }
  assert.equal(tekshirJavob(butun, "2.0"), true)
  assert.equal(tekshirJavob(butun, "2.03"), false)

  const nisbiy = { id: 39, turi: "ochiq", correct: 1200, tolerance: { nisbiy: 0.01 } }
  assert.equal(tekshirJavob(nisbiy, "1210"), true)
  assert.equal(tekshirJavob(nisbiy, "1225"), false)

  const kopJavobli = { id: 40, turi: "ochiq", correct: "0.5", altCorrect: ["0.50", "0.55"] }
  assert.equal(tekshirJavob(kopJavobli, "0,55"), true)

  const moslashIndex = {
    id: 33,
    turi: "moslashtirish",
    options: MS_VARIANT_HARFLAR,
    correct: 4, // E
  }
  assert.equal(tekshirJavob(moslashIndex, "E"), true)
  assert.equal(tekshirJavob(moslashIndex, 4), true)
  assert.equal(tekshirJavob(moslashIndex, "F"), false)

  const kopBandli = { id: 34, turi: "moslashtirish", correct: { 1: "A", 2: "C", 3: "F" } }
  assert.equal(tekshirJavob(kopBandli, { 1: "a", 2: "C", 3: "F" }), true)
  assert.equal(tekshirJavob(kopBandli, { 1: "A", 2: "B", 3: "F" }), false)
})

test("ommaviySavol — maxfiy maydonlarni yashiradi, kontekst va birlikni saqlaydi", () => {
  const savol = ommaviySavol({
    id: 36,
    turi: "ochiq",
    question: "Reaksiya natijasida necha mol gaz ajraladi?",
    kontekstMatn: "Normal sharoit berilgan.",
    birlik: "mol",
    correct: 2.5,
    altCorrect: ["2,5"],
    tolerance: 0.01,
    explanation: "Tenglama bo'yicha 2.5 mol chiqadi.",
  })

  assert.equal("correct" in savol, false)
  assert.equal("altCorrect" in savol, false)
  assert.equal("explanation" in savol, false)
  assert.equal("tolerance" in savol, false)
  assert.equal(savol.kontekstMatn, "Normal sharoit berilgan.")
  assert.equal(savol.birlik, "mol")
})

test("tekshirBank — A-F moslashtirish, tarkib va tolerance tekshiruvi", () => {
  const izoh =
    "Reaksiya tenglamasi stexiometrik koeffitsiyentlar asosida muvozanatlashtirilib hisoblanadi."
  const variant = {
    slug: "test-ms",
    savollarSoni: 5,
    tarkib: { variant: 1, moslashtirish: 3, ochiq: 1 },
  }

  const yaroqli = tekshirBank(variant, [
    { id: 1, turi: "variant", question: "S1", options: ["a", "b", "c", "d"], correct: 0, qiyinlik: -1, explanation: izoh },
    { id: 2, turi: "moslashtirish", question: "S2", options: MS_VARIANT_HARFLAR, correct: 5, qiyinlik: 0, explanation: izoh },
    { id: 3, turi: "moslashtirish", question: "S3", correct: "F", qiyinlik: 0.2, explanation: izoh },
    { id: 4, turi: "moslashtirish", question: "S4", correct: "E", qiyinlik: 0.4, explanation: izoh },
    { id: 5, turi: "ochiq", question: "S5", correct: "12.5", tolerance: 0.1, qiyinlik: 1, explanation: izoh },
  ])
  assert.deepEqual(yaroqli.xatolar, [])

  const xatoli = tekshirBank(variant, [
    { id: 1, turi: "noma'lum", question: "S1", options: ["a", "b", "c", "d"], correct: 0, qiyinlik: -1, explanation: izoh },
    { id: 2, turi: "variant", question: "S2", options: ["a", "b", "c", "d"], correct: 1, qiyinlik: 0, explanation: izoh },
    { id: 3, turi: "ochiq", question: "S3", correct: "12abc", tolerance: -1, altCorrect: ["x"], qiyinlik: 1, explanation: izoh },
  ])
  assert.equal(xatoli.xatolar.some((x) => x.includes("noma'lum savol turi")), true)
  assert.equal(xatoli.xatolar.some((x) => x.includes("tolerance qiymati")), true)
  assert.equal(xatoli.xatolar.some((x) => x.includes("ochiq savol javobi son emas")), true)
  assert.equal(xatoli.xatolar.some((x) => x.includes("altCorrect qiymati son emas")), true)
  assert.equal(xatoli.xatolar.some((x) => x.includes("Moslashtirish (A–F)")), true)
})
