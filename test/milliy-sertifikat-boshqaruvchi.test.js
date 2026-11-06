// test/milliy-sertifikat-boshqaruvchi.test.js
import test from "node:test"
import assert from "node:assert/strict"
import {
  boshlaSessiya,
  hisoblaYakuniyNatija,
  generatsiyaSertifikatId,
} from "../lib/milliy-sertifikat-boshqaruvchi.js"
import { generatsiyaMilliySertifikatPDFBaytlar } from "../lib/milliy-sertifikat-pdf.js"

test("Milliy sertifikat boshqaruvchisi — boshlaSessiya", () => {
  const sessiya = boshlaSessiya("milliy-sertifikat-simulyator", {
    ism: "Alisher",
    familiya: "Navoiy",
  })

  assert.equal(sessiya.slug, "milliy-sertifikat-simulyator")
  assert.equal(sessiya.savollarSoni, 40)
  assert.equal(sessiya.vaqtSoniya, 6000) // 100 daqiqa
  assert.equal(sessiya.holat, "jarayonda")
  assert.equal(sessiya.foydalanuvchi.ism, "Alisher")
  assert.equal(typeof sessiya.sessiyaId, "string")
})

test("Milliy sertifikat boshqaruvchisi — hisoblaYakuniyNatija va Rasch IRT", () => {
  const savollar = [
    { id: 1, turi: "variant", correct: "C", qiyinlik: -1.5, soha: "Umumiy kimyo" },
    { id: 2, turi: "variant", correct: "D", qiyinlik: -1.0, soha: "Umumiy kimyo" },
    { id: 3, turi: "variant", correct: "A", qiyinlik: -0.5, soha: "Anorganik kimyo" },
    { id: 4, turi: "variant", correct: "B", qiyinlik: 0.0, soha: "Anorganik kimyo" },
    { id: 5, turi: "variant", correct: "C", qiyinlik: 0.5, soha: "Organik kimyo" },
    { id: 6, turi: "variant", correct: "D", qiyinlik: 1.0, soha: "Organik kimyo" },
    { id: 7, turi: "variant", correct: "A", qiyinlik: 1.5, soha: "Kimyoviy hisoblashlar" },
    { id: 8, turi: "ochiq", correct: "22.3", altCorrect: "22,3", qiyinlik: 2.0, soha: "Kimyoviy hisoblashlar" },
  ]

  // A'lochi o'quvchi: 8 tasidan 7 tasini to'g'ri ishladi
  const javoblarAlochi = {
    1: "C",
    2: "D",
    3: "A",
    4: "B",
    5: "C",
    6: "D",
    7: "A",
    8: "25", // bitta xato
  }

  const natijaAlochi = hisoblaYakuniyNatija(savollar, javoblarAlochi, 3600, {
    toliqIsm: "Aziz Rahimov",
  })

  assert.equal(natijaAlochi.rawScore, 7)
  assert.equal(natijaAlochi.jamiSavollar, 8)
  assert.equal(natijaAlochi.shkalaBalli >= 52.5, true, "BMBA shkalasida yuqori ball olishi kerak")
  assert.equal(["A+", "A"].includes(natijaAlochi.daraja), true)
  assert.equal(Boolean(natijaAlochi.sertifikat), true, "Sertifikat berilishi shart")
  assert.equal(natijaAlochi.sertifikat.fullName, "Aziz Rahimov")
  assert.equal(natijaAlochi.sertifikat.certId.startsWith("JDA-MS-"), true)

  // Qoniqarsiz o'quvchi: 8 tasidan faqat 1 tasini to'g'ri ishladi
  const javoblarQuyi = {
    1: "C",
    2: "A",
    3: "B",
    4: "C",
    5: "A",
    6: "B",
    7: "C",
    8: "100",
  }

  const natijaQuyi = hisoblaYakuniyNatija(savollar, javoblarQuyi, 3600, {
    toliqIsm: "Sinovchi",
  })

  assert.equal(natijaQuyi.rawScore, 1)
  assert.equal(natijaQuyi.daraja, "Qoniqarsiz")
  assert.equal(natijaQuyi.sertifikat, null, "Qoniqarsiz natijaga sertifikat berilmaydi")
})

test("Milliy sertifikat seriya generatori — JDA-MS-YYYY-XXXXX formati", () => {
  const id1 = generatsiyaSertifikatId()
  const id2 = generatsiyaSertifikatId()

  const joriyYil = new Date().getFullYear()
  assert.equal(id1.startsWith(`JDA-MS-${joriyYil}-`), true)
  assert.equal(id2.startsWith(`JDA-MS-${joriyYil}-`), true)
  assert.notEqual(id1, id2, "Har bir seriya raqami unikal bo'lishi kerak")
})

test("Milliy sertifikat rasmiy PDF generatori — vektorli A4 fayl", async () => {
  const baytlar = await generatsiyaMilliySertifikatPDFBaytlar({
    certId: "JDA-MS-2026-TEST1",
    fullName: "Diyorbek Jabborov",
    daraja: "A+",
    shkalaBalli: "68.5",
    theta: "+1.85",
    se: "0.32",
    imtiyoz: "Davlat OTMlariga kirish imtihonlarida maksimal ball imtiyozi beriladi.",
    issuedAt: new Date().toISOString(),
  })

  assert.equal(baytlar instanceof Uint8Array, true)
  assert.equal(baytlar.length > 5000, true, "Haqiqiy vektorli PDF baytlari bo'lishi kerak")
})
