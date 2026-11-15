// test/milliy-sertifikat-poydevor.test.js
import test from "node:test"
import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { sessiyaSavollari, variantTartibi } from "../lib/milliy-sertifikat-aralashtirish.js"
import { yakunlaSinov as haqiqiyYakunlash } from "../lib/milliy-sertifikat-yakunlash.js"
import { boshlaSessiya, hisoblaYakuniyNatija, ommaviySavol } from "../lib/milliy-sertifikat-boshqaruvchi.js"
import { tekshirBank } from "../lib/milliy-sertifikat-bank.js"
import { javoblarCsv } from "../lib/milliy-sertifikat-eksport.js"
import { MILLIY_SERTIFIKAT_VARIANTLARI } from "../lib/milliy-sertifikat-data.js"
import { sinovKatalogi } from "../lib/milliy-sertifikat-katalog.js"
import { bankSavoli, getSavollarBySlug } from "../data/milliy-sertifikat/savollar-ombromi.js"

const SIR = "sinov-siri"
const DIAG = "rasch-diagnostika"

// Nega soxta savollar: haqiqiy bank bo'sh bo'lishi mumkin, mantiq esa bankka bog'liq emas.
// To'g'ri javob ataylab hamma savolda birinchi: aralashtirish shuni yopishi kerak.
const SAVOLLAR = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  mavzu: `Mavzu ${i + 1}`,
  soha: "Umumiy kimyo",
  qiyinlik: (i - 15) / 5,
  question: `Savol ${i + 1}`,
  options: [`to'g'ri ${i}`, `xato-a ${i}`, `xato-b ${i}`, `xato-c ${i}`],
  correct: 0,
  explanation: "Izoh",
}))

const yakunlaSinov = (p) => haqiqiyYakunlash({ savollarOl: () => SAVOLLAR, ...p })

function sessiya(ortiqcha = {}) {
  return { sid: "sid-1", slug: DIAG, uid: "u1", bosh: 1000, tugash: 1000 + 3600e3, ...ortiqcha }
}

// Prisma o'rnini bosadi: nima yozilganini eslab qoladi va unique indeksni takrorlaydi
function soxtaBaza({ urinishYiqilsin = false } = {}) {
  const baza = { natijalar: [], sertifikatlar: [], urinishlar: [] }
  const tx = {
    quizResult: {
      create: async ({ data }) => {
        if (baza.natijalar.some((n) => n.attemptId === data.attemptId)) {
          throw Object.assign(new Error("unique"), { code: "P2002" })
        }
        baza.natijalar.push(data)
      },
    },
    certificate: { create: async ({ data }) => baza.sertifikatlar.push(data) },
  }
  return {
    ...baza,
    baza,
    $transaction: async (fn) => fn(tx),
    msUrinish: {
      count: async ({ where }) =>
        baza.urinishlar.filter((u) => u.userId === where.userId && u.slug === where.slug).length,
      create: async ({ data }) => {
        if (urinishYiqilsin) throw new Error("jadval yo'q")
        if (baza.urinishlar.some((u) => u.sessiyaId === data.sessiyaId)) {
          throw Object.assign(new Error("unique"), { code: "P2002" })
        }
        baza.urinishlar.push(data)
      },
    },
  }
}

function togriJavoblar(s) {
  const savollar = sessiyaSavollari(SAVOLLAR, s.sid, SIR)
  return Object.fromEntries(savollar.map((q) => [q.id, q.correct]))
}

test("Aralashtirish — tartib to'liq va takrorlanadi, sirga bog'liq", () => {
  const t = variantTartibi(4, "k", SIR)
  assert.deepEqual([...t].sort(), [0, 1, 2, 3])
  assert.deepEqual(variantTartibi(4, "k", SIR), t)

  const farq = Array.from({ length: 50 }, (_, i) =>
    variantTartibi(4, `k${i}`, SIR).join() !== variantTartibi(4, `k${i}`, "boshqa-sir").join()
  )
  assert.equal(farq.filter(Boolean).length > 30, true, "Sirsiz tartibni topib bo'lmasligi kerak")
  assert.throws(() => variantTartibi(4, "k", ""))
})

test("Aralashtirish — javob matni o'zgarmaydi, to'g'ri variant ko'chadi", () => {
  const asl = SAVOLLAR
  const yangi = sessiyaSavollari(asl, "sid-1", SIR)
  yangi.forEach((s, i) => {
    assert.equal(s.options[s.correct], asl[i].options[asl[i].correct])
    assert.deepEqual([...s.options].sort(), [...asl[i].options].sort())
  })
  assert.equal(asl[0].correct, 0, "Asl bank o'zgarmasligi kerak")
})

test("Aralashtirish — to'g'ri javob o'rni teng taqsimlanadi", () => {
  const sanoq = [0, 0, 0, 0]
  for (let i = 0; i < 200; i++) {
    sessiyaSavollari(SAVOLLAR, `s${i}`, SIR).forEach((s) => sanoq[s.correct]++)
  }
  const jami = 200 * 30
  for (const n of sanoq) {
    assert.equal(Math.abs(n / jami - 0.25) < 0.02, true, `taqsimot ${sanoq}`)
  }
})

test("Aralashtirish — hamma savolda A bosish endi ishlamaydi", () => {
  const savollar = sessiyaSavollari(SAVOLLAR, "sid-1", SIR)
  const hammasiA = Object.fromEntries(savollar.map((s) => [s.id, 0]))
  const natija = hisoblaYakuniyNatija(savollar, hammasiA, 100)
  assert.equal(natija.rawScore < 15, true, `${natija.rawScore}/30`)
  assert.equal(natija.sertifikat, null)
})

test("Aralashtirish — rasmli savollar joyida qoladi", () => {
  const asl = [{ id: 1, rasm: "/x.jpg", options: ["A", "B", "C", "D"], correct: "B", qiyinlik: 0 }]
  assert.deepEqual(sessiyaSavollari(asl, "sid-1", SIR), asl)
})

test("Yakunlash — egasi sertifikat oladi, hamma narsa bir marta yoziladi", async () => {
  const db = soxtaBaza()
  const s = sessiya()
  const javob = await yakunlaSinov({
    db, sessiya: s, javoblar: togriJavoblar(s), userId: "u1", toliqIsm: "Ali", sir: SIR, hozir: 5000,
  })

  assert.equal(javob.status, 200)
  assert.equal(javob.body.natija.rawScore, 30)
  assert.equal(db.baza.natijalar.length, 1)
  assert.equal(db.baza.natijalar[0].attemptId, "ms-sid-1")
  assert.equal(db.baza.sertifikatlar.length, 1)
  assert.equal(db.baza.sertifikatlar[0].userId, "u1")
  assert.equal(db.baza.sertifikatlar[0].certId, javob.body.natija.sertifikat.certId)
  assert.match(db.baza.sertifikatlar[0].reason, /davlat sertifikati emas/)

  const urinish = db.baza.urinishlar[0]
  assert.equal(urinish.urinishTartibi, 1)
  assert.equal(urinish.javoblar.create.length, 30)
  assert.equal(urinish.javoblar.create[0].savolKalit, `${DIAG}#1`)
  assert.equal(urinish.javoblar.create.every((j) => j.togri && j.javobBerildi), true)
})

test("Yakunlash — o'sha sessiyani qayta yuborib bo'lmaydi", async () => {
  const db = soxtaBaza()
  const s = sessiya()
  const p = { db, sessiya: s, userId: "u1", toliqIsm: "Ali", sir: SIR, hozir: 5000 }

  await yakunlaSinov({ ...p, javoblar: {} })
  const ikkinchi = await yakunlaSinov({ ...p, javoblar: togriJavoblar(s) })

  assert.equal(ikkinchi.status, 409)
  assert.equal(ikkinchi.body.takroriy, true)
  assert.equal(db.baza.sertifikatlar.length, 0)
  assert.equal(db.baza.urinishlar.length, 1)
})

test("Yakunlash — mehmon va begona sessiya 401 bilan rad etiladi, kechikish esa sertifikat olmaydi", async () => {
  const radHolatlar = [
    { nom: "mehmon", s: sessiya({ uid: null }), userId: null },
    { nom: "begona", s: sessiya({ uid: "boshqa" }), userId: "u1" },
    { nom: "chiqib ketgan", s: sessiya(), userId: null },
  ]
  for (const h of radHolatlar) {
    const db = soxtaBaza()
    const javob = await yakunlaSinov({
      db, sessiya: h.s, javoblar: togriJavoblar(h.s), userId: h.userId,
      toliqIsm: "Ali", sir: SIR, hozir: 5000,
    })
    assert.equal(javob.status, 401, h.nom)
    assert.equal(javob.body.loginKerak, true, h.nom)
    assert.equal(db.baza.sertifikatlar.length, 0, h.nom)
    assert.equal(db.baza.natijalar.length, 0, h.nom)
    assert.equal(db.baza.urinishlar.length, 0, h.nom)
  }

  const kechikishDb = soxtaBaza()
  const kechikish = await yakunlaSinov({
    db: kechikishDb,
    sessiya: sessiya(),
    javoblar: togriJavoblar(sessiya()),
    userId: "u1",
    toliqIsm: "Ali",
    sir: SIR,
    hozir: 1000 + 3700e3,
  })
  assert.equal(kechikish.status, 200)
  assert.equal(kechikish.body.natija.sertifikat, null)
  assert.match(kechikish.body.natija.sertifikatIzoh, /Vaqt tugaganidan/)
  assert.equal(kechikishDb.baza.sertifikatlar.length, 0)
  assert.equal(kechikishDb.baza.urinishlar.length, 1)
  assert.equal(kechikishDb.baza.urinishlar[0].userId, "u1")
})

test("Yakunlash — urinish jadvali yiqilsa ham o'quvchi natijasini oladi", async () => {
  const xatolar = console.error
  console.error = () => {}
  try {
    const db = soxtaBaza({ urinishYiqilsin: true })
    const s = sessiya()
    const javob = await yakunlaSinov({
      db, sessiya: s, javoblar: togriJavoblar(s), userId: "u1", toliqIsm: "Ali", sir: SIR, hozir: 5000,
    })
    assert.equal(javob.status, 200)
    assert.equal(db.baza.sertifikatlar.length, 1)
  } finally {
    console.error = xatolar
  }
})

test("Yakunlash — ikkinchi urinish tartibi oshadi", async () => {
  const db = soxtaBaza()
  for (const sid of ["a", "b"]) {
    await yakunlaSinov({
      db, sessiya: sessiya({ sid }), javoblar: {}, userId: "u1", toliqIsm: "Ali", sir: SIR, hozir: 5000,
    })
  }
  assert.deepEqual(db.baza.urinishlar.map((u) => u.urinishTartibi), [1, 2])
})

test("Savol banki — savol qo'shilgan sinovlarda xato yo'q", () => {
  const rasmBormi = (rasm) => existsSync(join("public", rasm))
  for (const variant of MILLIY_SERTIFIKAT_VARIANTLARI.filter((v) => getSavollarBySlug(v.slug).length > 0)) {
    const { xatolar } = tekshirBank(variant, getSavollarBySlug(variant.slug), rasmBormi)
    assert.deepEqual(xatolar, [], variant.slug)
  }
})

test("Savol banki — darvoza nuqsonlarni tutadi", () => {
  const hammasiA = Array.from({ length: 10 }, (_, id) => ({
    id, qiyinlik: 0, rasm: "/x.jpg", options: ["A", "B", "C", "D"], correct: "A",
  }))
  const v = { slug: "x", savollarSoni: 12 }
  const { xatolar, ogohlantirishlar } = tekshirBank(v, hammasiA, () => false)

  assert.equal(xatolar.some((x) => x.includes("Katalogda 12")), true)
  assert.equal(xatolar.some((x) => x.includes("rasm topilmadi")), true)
  assert.equal(xatolar.some((x) => x.includes("taxmin bilan")), true)
  assert.equal(ogohlantirishlar.some((x) => x.includes("izoh yo'q")), true)
})

test("Bo'sh bank — sinovlar yopiq, eski savollar qaytib kelmagan", () => {
  for (const variant of sinovKatalogi()) {
    if (getSavollarBySlug(variant.slug).length === 0) {
      assert.equal(variant.holat === "ochiq", false, variant.slug)
      assert.equal(boshlaSessiya(variant.slug), null, variant.slug)
    }
  }
})

test("Bo'sh bank — ochiq qolgan sessiya yiqilmaydi va hech narsa yozilmaydi", async () => {
  const db = soxtaBaza()
  const javob = await haqiqiyYakunlash({
    db, sessiya: sessiya(), javoblar: {}, userId: "u1", toliqIsm: "Ali", sir: SIR,
    hozir: 5000, savollarOl: () => [],
  })
  assert.equal(javob.status, 410)
  assert.equal(db.baza.natijalar.length, 0)
  assert.equal(db.baza.urinishlar.length, 0)
})

test("Katalog — sinov bank to'lganda o'zi ochiladi, chala bo'lsa yopiq", () => {
  const holat = (savollar) =>
    sinovKatalogi((slug) => (slug === DIAG ? savollar : [])).find((v) => v.slug === DIAG).holat

  assert.equal(holat(SAVOLLAR), "ochiq")
  assert.equal(holat(SAVOLLAR.slice(0, 12)), "tayyorlanmoqda")
  assert.equal(holat([]), "tayyorlanmoqda")
  assert.equal(holat(SAVOLLAR.map((s) => ({ ...s, qiyinlik: undefined }))), "tayyorlanmoqda")
})

test("Katalog — ochilgan sinovni boshlash mumkin", () => {
  const katalog = sinovKatalogi((slug) => (slug === DIAG ? SAVOLLAR : []))
  assert.equal(boshlaSessiya(DIAG, {}, katalog).savollarSoni, 30)
  assert.equal(boshlaSessiya("attestatsiya-sinov", {}, katalog), null)
})

test("Qiyinlik — kalibrlangan qiymat taxmindan ustun", () => {
  assert.equal(bankSavoli({ id: 1, daraja: "oson" }).qiyinlik, -1.5)
  assert.equal(bankSavoli({ id: 1, daraja: "qiyin" }).qiyinlik, 1.5)
  assert.equal(bankSavoli({ id: 1, daraja: "oson", qiyinlik: 0.4 }).qiyinlik, 0.4)
  assert.equal(bankSavoli({ id: 1, daraja: "oson", qiyinlik: 0.4 }, { 1: -0.9 }).qiyinlik, -0.9)
  assert.equal(bankSavoli({ id: 1 }).qiyinlik, undefined)
})

test("Natija — ball oralig'i va ishonchsiz belgisi", () => {
  const savollar = sessiyaSavollari(SAVOLLAR, "sid-1", SIR)
  const togri = Object.fromEntries(savollar.map((s, i) => [s.id, i >= 15 ? s.correct : (s.correct + 1) % 4]))
  const teskari = hisoblaYakuniyNatija(savollar, togri, 100)
  assert.equal(teskari.ishonchsiz, true, "Oson xato, qiyin to'g'ri bo'lsa belgilanadi")

  const tartibli = Object.fromEntries(savollar.map((s, i) => [s.id, i < 15 ? s.correct : (s.correct + 1) % 4]))
  const oddiy = hisoblaYakuniyNatija(savollar, tartibli, 100)
  assert.equal(oddiy.ishonchsiz, false)
  assert.equal(oddiy.ballPast < oddiy.shkalaBalli && oddiy.shkalaBalli < oddiy.ballYuqori, true)
})

test("Sessiya savollari — brauzerga javob ketmaydi, indeks belgisi qoladi", () => {
  const ommaviy = sessiyaSavollari(SAVOLLAR, "s", SIR).map(ommaviySavol)
  assert.equal(ommaviy.every((s) => s.javobIndeks === true && !("correct" in s)), true)
})

test("Eksport — faqat yaroqli birinchi urinishlar, anonim", () => {
  const j = (kalit, togri, javobBerildi = true) => ({ savolKalit: kalit, togri, javobBerildi })
  const { matn, qatorlar, ustunlar, tashlangan } = javoblarCsv([
    { urinishTartibi: 1, kechikkan: false, userId: "maxfiy", javoblar: [j("a#1", true), j("a#2", false)] },
    { urinishTartibi: 2, kechikkan: false, javoblar: [j("a#1", true), j("a#2", true)] },
    { urinishTartibi: null, kechikkan: false, javoblar: [j("a#1", true), j("a#2", true)] },
    { urinishTartibi: 1, kechikkan: true, javoblar: [j("a#1", true), j("a#2", true)] },
    { urinishTartibi: 1, kechikkan: false, javoblar: [j("a#1", false, false), j("a#2", false, false)] },
    { urinishTartibi: 1, kechikkan: false, javoblar: [j("a#1", false), j("a#3", true)] },
  ])

  assert.equal(qatorlar, 2)
  assert.equal(ustunlar, 3)
  assert.equal(tashlangan, 4)
  assert.equal(matn, "qator,a#1,a#2,a#3\n1,1,0,\n2,0,,1\n")
  assert.equal(matn.includes("maxfiy"), false)
})
