// lib/ms-format.js
//
// Milliy sertifikat (kimyo) sinovlari formati va baholash me'yorlarining
// YAGONA manbai (AGENTS.md 1-band). Server ham, brauzer sahifalari ham shu
// modulga tayanadi, shuning uchun bu yerda Node.js modullari import qilinmaydi.

export const MS_VARIANT_HARFLAR = ["A", "B", "C", "D", "E", "F"]

export const MS_SAVOL_TURLARI = ["variant", "moslashtirish", "ochiq"]

// Ochiq sonli savollar uchun standart aniqlik (±0.05)
export const MS_STANDART_TOLERANCE = 0.05

// Rasmiy daraja chegaralari (ball shkalasi). Nega yagona jadval: boshqa
// joylarda alohida yozilsa, ko'rsatilgan oraliq hisobdan uzilib qoladi.
export const MS_DARAJA_CHEGARALARI = [
  { daraja: "A+", minBall: 70 },
  { daraja: "A", minBall: 65 },
  { daraja: "B+", minBall: 60 },
  { daraja: "B", minBall: 55 },
  { daraja: "C+", minBall: 50 },
  { daraja: "C", minBall: 46 },
]

// Logit -> ball shkalasi ko'rsatkichlari. Hozircha kalibrlashdan oldingi
// taxminiy shkala; haqiqiy javoblar bazasi to'lgach rasmiy shkalaga ulanadi.
export const MS_SHKALA_STANDART = {
  markaz: 45,
  qadam: 10,
  maks: 100,
  rasmiyMaksTavsiya: 75,
  ishonchZ: 1.96,
  outfitChegara: 2,
  kalibrlashHolati: "taxminiy",
}

// UzBMB kimyo Milliy sertifikati tuzilmasi:
// - 1-qism (CBT, 1–40): 100 daqiqa — hozir platformada to'liq qo'llanadi
// - 2-qism (yozma ish, 41–43): 80 daqiqa — rasmiy spetsifikatsiya tasdiqlangach qo'shiladi
export const RASMIY_KIMYO_MS_TUZILMASI = {
  qism1: {
    yopiq: {
      turi: "variant",
      diapazon: "1–32",
      soni: 32,
      harflarSoni: 4,
      bolimlar: {
        umumiy: 13,
        anorganik: 6,
        organik: 10,
        tahlil: 3,
      },
    },
    moslashtirish: {
      turi: "moslashtirish",
      diapazon: "33–35",
      soni: 3,
      harflarSoni: 6,
    },
    ochiq: {
      turi: "ochiq",
      diapazon: "36–40",
      soni: 5,
      standartAniqlik: MS_STANDART_TOLERANCE,
    },
    savollarSoni: 40,
    vaqtMin: 100,
  },
  qism2Yozma: {
    diapazon: "41–43",
    soni: 3,
    vaqtMin: 80,
    maksXomBallHarBiri: 25,
    holat: "tasdiqlanishi_kutilmoqda",
  },
  jamiRasmiy: {
    savollarSoni: 43,
    vaqtMin: 180,
  },
}

/**
 * Tarkib ob'ektidan UI va katalog uchun bir xil ko'rinish matnini chiqaradi.
 *
 * @param {{ variant?: number, moslashtirish?: number, ochiq?: number }} tarkib
 * @returns {{ yopiq: string, moslashtirish: string, ochiq: string }}
 */
export function tuzilmaMatni(tarkib = {}) {
  const yopiqSoni = Number(tarkib.variant) || 0
  const mosSoni = Number(tarkib.moslashtirish) || 0
  const ochiqSoni = Number(tarkib.ochiq) || 0

  return {
    yopiq: yopiqSoni > 0 ? `${yopiqSoni} ta (A–D)` : "Yo'q",
    moslashtirish: mosSoni > 0 ? `${mosSoni} ta (A–F)` : "Yo'q",
    ochiq: ochiqSoni > 0 ? `${ochiqSoni} ta (Sonli)` : "Yo'q",
  }
}

/**
 * Katalog variantlari uchun savol tarkibidan jami sonni hisoblaydi.
 *
 * @param {{ variant?: number, moslashtirish?: number, ochiq?: number }} tarkib
 * @returns {number}
 */
export function tarkibJami(tarkib = {}) {
  return (Number(tarkib.variant) || 0) + (Number(tarkib.moslashtirish) || 0) + (Number(tarkib.ochiq) || 0)
}

const SON_QOLIPI = /^[+-]?(?:\d+\.?\d*|\.\d+)$/

/**
 * Ochiq sonli javob matnini qat'iy raqamga aylantiradi ("12abc" rad etiladi).
 *
 * @param {string|number|null|undefined} qiymat
 * @returns {number|null}
 */
export function sonSifatidaOqi(qiymat) {
  if (qiymat === undefined || qiymat === null || typeof qiymat === "boolean") return null
  const toza = String(qiymat).trim().replace(",", ".")
  if (!SON_QOLIPI.test(toza)) return null
  const son = Number(toza)
  return Number.isFinite(son) ? son : null
}

/**
 * Savolning tolerance sozlamasi to'g'ri tuzilganini tekshiradi.
 *
 * @param {unknown} tolerance
 * @returns {boolean}
 */
export function toleranceYaroqlimi(tolerance) {
  if (tolerance === undefined) return true
  if (typeof tolerance === "number") return Number.isFinite(tolerance) && tolerance >= 0
  if (!tolerance || typeof tolerance !== "object" || Array.isArray(tolerance)) return false

  const { mutlaq, nisbiy } = tolerance
  if (mutlaq === undefined && nisbiy === undefined) return false
  if (mutlaq !== undefined && (typeof mutlaq !== "number" || !Number.isFinite(mutlaq) || mutlaq < 0)) {
    return false
  }
  if (nisbiy !== undefined && (typeof nisbiy !== "number" || !Number.isFinite(nisbiy) || nisbiy < 0)) {
    return false
  }
  return true
}

