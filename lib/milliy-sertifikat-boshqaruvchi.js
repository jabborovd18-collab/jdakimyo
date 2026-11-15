// lib/milliy-sertifikat-boshqaruvchi.js
//
// JDA KIMYO — TAYYORGARLIK SINOVI BOSHQARUVCHISI
//
// FAQAT SERVERDA ishlatiladi: bu modul to'g'ri javoblarni o'qiydi. Client
// sahifasiga import qilinsa, javoblar brauzer bo'lagiga tushadi (AGENTS.md 2-band).

import { randomBytes, randomUUID } from "node:crypto"
import { hisoblaRaschTheta, tuzWrightMap } from "./rasch-model.js"
import { tekshirJavob } from "../data/milliy-sertifikat/savollar-ombromi.js"
import { sinovKatalogi } from "./milliy-sertifikat-katalog.js"
import { oddiyBahoHisobla, taqqoslashTahlili } from "./milliy-sertifikat-kohort.js"

/**
 * Bazada saqlash uchun foydalanuvchi javobini tartibdan mustaqil matnga aylantiradi.
 * Nega kerak: aralashtirilgan sessiyada 0/1/2/3 indeksi keyinchalik noto'g'ri harfga
 * mos kelmasligi uchun asl variant matnini saqlaymiz.
 */
export function berilganJavobSatri(savol, berilgan) {
  if (berilgan === undefined || berilgan === null || berilgan === "") return null
  if (
    typeof savol?.correct === "number" &&
    Array.isArray(savol.options) &&
    typeof berilgan === "number"
  ) {
    return savol.options[berilgan] !== undefined ? String(savol.options[berilgan]) : String(berilgan)
  }
  if (typeof berilgan === "object") {
    try {
      return JSON.stringify(berilgan)
    } catch {
      return null
    }
  }
  return String(berilgan)
}

/**
 * Sertifikat seriya raqamini yaratish. Masalan: JDA-MS-2026-7F3A91C2D4
 *
 * Nega kriptografik tasodif: raqam ochiq tekshiruv manzilida ishlatiladi, 5 xonali
 * Math.random raqamini birma-bir sinab, boshqalarning sertifikatini topish mumkin edi.
 */
export function generatsiyaSertifikatId() {
  const yil = new Date().getFullYear()
  return `JDA-MS-${yil}-${randomBytes(5).toString("hex").toUpperCase()}`
}

/**
 * Brauzerga yuboriladigan savol: javob va izoh olib tashlanadi.
 * javobIndeks interfeysga javob raqam yoki harf bilan yuborilishini bildiradi.
 */
export function ommaviySavol(savol) {
  const { correct, altCorrect, explanation, tolerance, ...ochiq } = savol
  return { ...ochiq, javobIndeks: typeof correct === "number" }
}

/**
 * Yangi imtihon sessiyasini boshlash.
 *
 * @param {string} slug Test turi (masalan, 'milliy-sertifikat-simulyator')
 * @param {object} foydalanuvchi { id, ism, familiya }
 * @param {object[]} [variantlar] Sinovlar katalogi
 * @returns {object|null} Test bo'lmasa yoki hali ochilmagan bo'lsa null
 */
export function boshlaSessiya(slug, foydalanuvchi = {}, variantlar = sinovKatalogi()) {
  const testInfo = variantlar.find((v) => v.slug === slug)
  if (!testInfo || testInfo.holat !== "ochiq") return null

  const vaqtSoniya = (testInfo.vaqtMin || 100) * 60
  const boshlanganVaqt = Date.now()
  const sessiyaId = randomUUID()

  return {
    sessiyaId,
    slug,
    testNomi: testInfo.nom,
    savollarSoni: testInfo.savollarSoni,
    vaqtSoniya,
    boshlanganVaqt,
    foydalanuvchi: {
      id: foydalanuvchi.id || "mehmon",
      ism: foydalanuvchi.ism || "Ishtirokchi",
      familiya: foydalanuvchi.familiya || "",
    },
    holat: "jarayonda", // "jarayonda" | "yakunlandi"
  }
}

/**
 * Yakuniy natijani hisoblash.
 *
 * 1. Barcha savollarni tekshirish (1/0).
 * 2. Newton-Raphson MLE orqali theta logitini aniqlash.
 * 3. SE, Infit va Outfit MNSQ ko'rsatkichlarini hisoblash.
 * 4. Taxminiy ball va darajani belgilash (A+, A, B+, B, C+, C yoki Qoniqarsiz).
 * 5. Wright Map tahlili va sertifikat ma'lumotlarini shakllantirish.
 *
 * @param {Array} savollar
 * @param {Record<string|number, any>} javoblar
 * @param {number} sarflanganVaqt Soniya
 * @param {object} foydalanuvchi
 */
export function hisoblaYakuniyNatija(
  savollar = [],
  javoblar = {},
  sarflanganVaqt = 0,
  foydalanuvchi = {}
) {
  // 1. Javoblarni deterministik tekshiruvdan o'tkazish
  let rawScore = 0
  const savolNatijalari = savollar.map((s, index) => {
    const berilgan = javoblar[s.id]
    const togri = tekshirJavob(s, berilgan)
    if (togri) rawScore += 1

    return {
      id: s.id,
      index: index + 1,
      mavzu: s.mavzu || `${index + 1}-savol`,
      soha: s.soha || "Umumiy kimyo",
      qiyinlik: Number(s.qiyinlik) || 0,
      turi: s.turi || "variant",
      berilganJavob: berilgan !== undefined ? berilgan : null,
      berilganJavobSatri: berilganJavobSatri(s, berilgan),
      togriJavob: s.correct,
      togri,
      explanation: s.explanation || null,
    }
  })

  // 2. Raqamli massiv (0 va 1)
  const raqamliJavoblar = savolNatijalari.map((item) => (item.togri ? 1 : 0))

  // 3. Georg Rasch IRT hisobi va Rasch modelisiz oddiy ball tizimi
  const raschHisob = hisoblaRaschTheta(savollar, raqamliJavoblar)
  const oddiyNatija = oddiyBahoHisobla(rawScore, savollar.length)
  const taqqoslash = taqqoslashTahlili(raschHisob, oddiyNatija, savolNatijalari)

  // 4. Wright Map tahlili
  const wrightMapData = tuzWrightMap(raschHisob.theta, savollar, raqamliJavoblar)

  // 5. Kimyo sohalari bo'yicha foizlar
  const sohalarMap = {}
  savolNatijalari.forEach((s) => {
    if (!sohalarMap[s.soha]) {
      sohalarMap[s.soha] = { jami: 0, togri: 0 }
    }
    sohalarMap[s.soha].jami += 1
    if (s.togri) sohalarMap[s.soha].togri += 1
  })

  const sohalarStatistikasi = Object.entries(sohalarMap).map(([soha, d]) => ({
    soha,
    jami: d.jami,
    togri: d.togri,
    foiz: Math.round((d.togri / d.jami) * 100),
  }))

  // 6. Sertifikat huquqi: C yoki undan yuqori daraja
  const sertifikatBeriladi = raschHisob.daraja !== "Qoniqarsiz"
  const sertifikatId = sertifikatBeriladi ? generatsiyaSertifikatId() : null

  const hozir = new Date()
  const berilganSana = hozir.toISOString()
  const amalQilishMuddati = new Date(
    hozir.getFullYear() + 3,
    hozir.getMonth(),
    hozir.getDate()
  ).toISOString()

  const toliqIsm = foydalanuvchi.toliqIsm ||
    `${foydalanuvchi.ism || "Ishtirokchi"} ${foydalanuvchi.familiya || ""}`.trim()

  return {
    // Asosiy ko'rsatkichlar
    rawScore,
    jamiSavollar: savollar.length,
    foiz: raschHisob.foiz,
    shkalaBalli: raschHisob.shkalaBalli, // taxminiy yoki kalibrlangan Rasch balli
    theta: raschHisob.theta, // logit
    se: raschHisob.se, // standart xatolik
    infitMNSQ: raschHisob.infitMNSQ,
    outfitMNSQ: raschHisob.outfitMNSQ,
    ballPast: raschHisob.ballPast,
    ballYuqori: raschHisob.ballYuqori,
    ishonchsiz: raschHisob.ishonchsiz,
    daraja: raschHisob.daraja, // A+, A, B+, B, C+, C, Qoniqarsiz
    darajaNomi: raschHisob.darajaNomi,
    imtiyoz: raschHisob.imtiyoz,
    tavsif: raschHisob.tavsif,

    // Rasch modelisiz oddiy ball tizimi va solishtirma tahlil
    oddiyNatija,
    taqqoslash,

    // Tahlillar
    wrightMapData,
    sohalarStatistikasi,
    savolNatijalari,
    sarflanganVaqt,

    // Sertifikat ma'lumotlari
    sertifikat: sertifikatBeriladi
      ? {
          certId: sertifikatId,
          fullName: toliqIsm,
          fan: "Kimyo",
          daraja: raschHisob.daraja,
          shkalaBalli: raschHisob.shkalaBalli,
          theta: raschHisob.theta,
          se: raschHisob.se,
          oddiyBall: oddiyNatija.oddiyBall,
          oddiyFoiz: oddiyNatija.oddiyFoiz,
          rawScore: oddiyNatija.rawScore,
          jamiSavollar: oddiyNatija.jamiSavollar,
          issuedAt: berilganSana,
          expiresAt: amalQilishMuddati,
          status: "valid",
          fullNameLocked: false,
          imtiyoz: raschHisob.imtiyoz,
        }
      : null,
  }
}
