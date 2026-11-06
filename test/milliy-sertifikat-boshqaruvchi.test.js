// test/milliy-sertifikat-boshqaruvchi.test.js
import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import {
  boshlaSessiya,
  hisoblaYakuniyNatija,
  generatsiyaSertifikatId,
  ommaviySavol,
} from "../lib/milliy-sertifikat-boshqaruvchi.js"
import { imzolaSessiya, ochSessiya } from "../lib/milliy-sertifikat-sessiya.js"
import { getSavollarBySlug } from "../data/milliy-sertifikat/savollar-ombromi.js"
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
  assert.equal(boshlaSessiya("bunday-test-yoq"), null)
})

test("Sessiya tokeni — soxtalashtirilsa ochilmaydi", () => {
  const malumot = { sid: "a", slug: "rasch-diagnostika", uid: "u1", bosh: 1, tugash: 2 }
  const token = imzolaSessiya(malumot, "sir")

  assert.deepEqual(ochSessiya(token, "sir"), malumot)
  assert.equal(ochSessiya(token, "boshqa-sir"), null)
  assert.equal(ochSessiya(token + "x", "sir"), null)
  assert.equal(ochSessiya("yaroqsiz", "sir"), null)
  assert.equal(ochSessiya(undefined, "sir"), null)

  // Vaqtni cho'zish: ma'lumot o'zgarsa, eski imzo unga mos kelmaydi
  const soxta = Buffer.from(JSON.stringify({ ...malumot, tugash: 9e15 })).toString("base64url")
  assert.equal(ochSessiya(`${soxta}.${token.split(".")[1]}`, "sir"), null)
})

test("Brauzerga yuboriladigan savollarda javob yo'q", () => {
  for (const slug of [
    "rasch-diagnostika",
    "milliy-sertifikat-simulyator",
    "milliy-sertifikat-simulyator-2",
    "attestatsiya-sinov",
  ]) {
    for (const savol of getSavollarBySlug(slug).map(ommaviySavol)) {
      assert.equal("correct" in savol, false)
      assert.equal("altCorrect" in savol, false)
      assert.equal("explanation" in savol, false)
    }
  }
})

test("Imtihon sahifasi javoblar moduliga bog'lanmagan", () => {
  const manba = readFileSync("app/milliy-sertifikat/[slug]/page.js", "utf8")
  assert.equal(manba.includes("savollar-ombromi"), false)
  assert.equal(manba.includes("milliy-sertifikat-boshqaruvchi"), false)
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
  assert.equal(natijaAlochi.shkalaBalli >= 60, true, "Yuqori ball olishi kerak")
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

test("Sertifikat PDF generatori — vektorli A4 fayl", async () => {
  const baytlar = await generatsiyaMilliySertifikatPDFBaytlar({
    certId: "JDA-MS-2026-TEST1",
    fullName: "Diyorbek Jabborov",
    daraja: "A+",
    shkalaBalli: "68.5",
    theta: "+1.85",
    se: "0.32",
    issuedAt: new Date().toISOString(),
  })

  assert.equal(baytlar instanceof Uint8Array, true)
  assert.equal(baytlar.length > 5000, true, "Haqiqiy vektorli PDF baytlari bo'lishi kerak")
})
