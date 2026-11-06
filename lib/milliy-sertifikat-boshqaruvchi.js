// lib/milliy-sertifikat-boshqaruvchi.js
//
// JDA KIMYO — MILLIY SERTIFIKAT IMTIHON BOSHQARUVCHISI VA NATIJALAR DVIGATELI
// Imtihon sessiyalarini boshqarish, anti-tamper vaqt nazorati, Georg Rasch IRT
// hisob-kitobi va rasmiy sertifikat berish mexanizmi.

import { hisoblaRaschTheta, tuzWrightMap, aniqlaDaraja } from "./rasch-model.js"
import { getSavollarBySlug, tekshirJavob } from "../data/milliy-sertifikat/savollar-ombromi.js"
import { MILLIY_SERTIFIKAT_VARIANTLARI } from "./milliy-sertifikat-data.js"

/**
 * Tasodifiy rasmiy sertifikat seriya raqamini yaratish.
 * Masalan: JDA-MS-2026-84921
 */
export function generatsiyaSertifikatId() {
  const yil = new Date().getFullYear()
  const tasodif = Math.floor(10000 + Math.random() * 90000)
  return `JDA-MS-${yil}-${tasodif}`
}

/**
 * Yangi imtihon sessiyasini boshlash.
 *
 * @param {string} slug Test turi (masalan, 'milliy-sertifikat-simulyator')
 * @param {object} foydalanuvchi { id, ism, familiya }
 */
export function boshlaSessiya(slug, foydalanuvchi = {}) {
  const testInfo =
    MILLIY_SERTIFIKAT_VARIANTLARI.find((v) => v.slug === slug) ||
    MILLIY_SERTIFIKAT_VARIANTLARI[0]

  const savollar = getSavollarBySlug(slug)
  const vaqtSoniya = (testInfo.vaqtMin || 100) * 60
  const boshlanganVaqt = Date.now()
  const sessiyaId = `MS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`

  return {
    sessiyaId,
    slug,
    testNomi: testInfo.nom,
    savollarSoni: savollar.length,
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
 * YAKUNIY NATIJALARNI ILMIY HISOBLASH DVIGATELI
 *
 * 1. Barcha savollarni tekshirish (1/0).
 * 2. Georg Rasch Newton-Raphson MLE orqali theta logitini aniqlash.
 * 3. SE (standart xatolik), Infit va Outfit MNSQ ko'rsatkichlarini hisoblash.
 * 4. BMBA 0..70 shkalasiga o'tkazish.
 * 5. Milliy Sertifikat darajasini belgilash (A+, A, B+, B, C+, C yoki Qoniqarsiz).
 * 6. Wright Map tahlili va sertifikat ma'lumotlarini to'liq shakllantirish.
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
      togriJavob: s.correct,
      togri,
      explanation: s.explanation || null,
    }
  })

  // 2. Raqamli massiv (0 va 1)
  const raqamliJavoblar = savolNatijalari.map((item) => (item.togri ? 1 : 0))

  // 3. Georg Rasch IRT hisobi
  const raschHisob = hisoblaRaschTheta(savollar, raqamliJavoblar)

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

  // 6. Sertifikat huquqini aniqlash (C yoki undan yuqori: ball >= 32.2)
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
    shkalaBalli: raschHisob.shkalaBalli, // 0..70 ball
    theta: raschHisob.theta, // logit
    se: raschHisob.se, // standart xatolik
    infitMNSQ: raschHisob.infitMNSQ,
    outfitMNSQ: raschHisob.outfitMNSQ,
    daraja: raschHisob.daraja, // A+, A, B+, B, C+, C, Qoniqarsiz
    darajaNomi: raschHisob.darajaNomi,
    imtiyoz: raschHisob.imtiyoz,
    tavsif: raschHisob.tavsif,

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
          issuedAt: berilganSana,
          expiresAt: amalQilishMuddati,
          status: "valid",
          imtiyoz: raschHisob.imtiyoz,
        }
      : null,
  }
}
