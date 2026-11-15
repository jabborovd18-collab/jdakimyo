// data/milliy-sertifikat/savollar-ombromi.js
//
// Tayyorgarlik sinovlarining savol banki. FAQAT serverda import qilinadi.
// Savollar `savollar/` papkasida yoziladi, bu fayl ularni yig'adi.
// Qo'llanma: docs/milliy-sertifikat/SAVOL-QOSHISH.md

import { KALIBRLASH } from "./kalibrlash.js"
import { MS_STANDART_TOLERANCE, MS_VARIANT_HARFLAR, sonSifatidaOqi } from "../../lib/ms-format.js"
import diagnostika from "./savollar/rasch-diagnostika.js"
import tayyorgarlik1 from "./savollar/milliy-sertifikat-simulyator.js"
import tayyorgarlik2 from "./savollar/milliy-sertifikat-simulyator-2.js"
import attestatsiya from "./savollar/attestatsiya-sinov.js"
import ms202602222 from "./savollar/ms-2026-02-22-2.js"
import ms202602212 from "./savollar/ms-2026-02-21-2.js"
import ms202602211 from "./savollar/ms-2026-02-21-1.js"
import ms202505041 from "./savollar/ms-2025-05-04-1.js"
import ms202505032 from "./savollar/ms-2025-05-03-2.js"
import ms202505031 from "./savollar/ms-2025-05-03-1.js"
import ms202503152 from "./savollar/ms-2025-03-15-2.js"
import ms202503151 from "./savollar/ms-2025-03-15-1.js"
import ms202501251 from "./savollar/ms-2025-01-25-1.js"
import ms20240922 from "./savollar/ms-2024-09-22.js"

// Nega bu qiymatlar: ular boshlang'ich taxmin, kalibrlash ularni almashtiradi.
// Daraja savol yozuvchi uchun logitdan tushunarliroq.
const TAXMINIY_QIYINLIK = { oson: -1.5, orta: 0, qiyin: 1.5 }

/**
 * Qiyinlik manbalari ustuvorligi: kalibrlangan, yozilgan logit, daraja.
 * Haqiqiy javoblardan chiqqan son har doim taxmindan ustun.
 */
export function bankSavoli(savol, kalibrlangan = {}) {
  return {
    ...savol,
    qiyinlik: kalibrlangan[savol.id] ?? savol.qiyinlik ?? TAXMINIY_QIYINLIK[savol.daraja],
  }
}

function bank(slug, savollar) {
  return savollar.map((savol) => bankSavoli(savol, KALIBRLASH[slug]))
}

const SAVOLLAR_BANKI = {
  "rasch-diagnostika": bank("rasch-diagnostika", diagnostika),
  "milliy-sertifikat-simulyator": bank("milliy-sertifikat-simulyator", tayyorgarlik1),
  "milliy-sertifikat-simulyator-2": bank("milliy-sertifikat-simulyator-2", tayyorgarlik2),
  "attestatsiya-sinov": bank("attestatsiya-sinov", attestatsiya),
  "ms-2026-02-22-2": bank("ms-2026-02-22-2", ms202602222),
  "ms-2026-02-21-2": bank("ms-2026-02-21-2", ms202602212),
  "ms-2026-02-21-1": bank("ms-2026-02-21-1", ms202602211),
  "ms-2025-05-04-1": bank("ms-2025-05-04-1", ms202505041),
  "ms-2025-05-03-2": bank("ms-2025-05-03-2", ms202505032),
  "ms-2025-05-03-1": bank("ms-2025-05-03-1", ms202505031),
  "ms-2025-03-15-2": bank("ms-2025-03-15-2", ms202503152),
  "ms-2025-03-15-1": bank("ms-2025-03-15-1", ms202503151),
  "ms-2025-01-25-1": bank("ms-2025-01-25-1", ms202501251),
  "ms-2024-09-22": bank("ms-2024-09-22", ms20240922),
}

/**
 * Nega noma'lum slug bo'sh qaytadi: avval boshqa sinovga jim o'tib ketardi va
 * foydalanuvchi so'ramagan savollarni ishlardi.
 */
export function getSavollarBySlug(slug) {
  return SAVOLLAR_BANKI[slug] || []
}

function ruxsatEtilganXato(kutilganSon, tolerance) {
  if (tolerance === undefined || tolerance === null) {
    return MS_STANDART_TOLERANCE + 1e-5
  }
  if (typeof tolerance === "number") {
    return tolerance + 1e-9
  }
  if (typeof tolerance === "object") {
    const mutlaq = typeof tolerance.mutlaq === "number" ? tolerance.mutlaq + 1e-9 : 0
    const nisbiy = typeof tolerance.nisbiy === "number" ? Math.abs(kutilganSon) * tolerance.nisbiy + 1e-9 : 0
    return Math.max(mutlaq, nisbiy)
  }
  return MS_STANDART_TOLERANCE + 1e-5
}

/**
 * Javobning to'g'ri yoki noto'g'ri ekanini tekshiruvchi universal funksiya.
 * Harflar (A-D, A-F), indekslar (0-5), moslashtirish juftliklari va
 * savolga xos aniqlik (tolerance) bilan ishlaydi.
 */
export function tekshirJavob(savol, berilganJavob) {
  if (!savol || berilganJavob === undefined || berilganJavob === null || berilganJavob === "") {
    return false
  }

  // OCHIQ SONLI SAVOLLAR
  if (savol.turi === "ochiq") {
    const bSon = sonSifatidaOqi(berilganJavob)
    const nomzodlar = [
      savol.correct,
      ...(Array.isArray(savol.altCorrect)
        ? savol.altCorrect
        : savol.altCorrect !== undefined && savol.altCorrect !== null && savol.altCorrect !== ""
          ? [savol.altCorrect]
          : []),
    ]

    for (const nomzod of nomzodlar) {
      const kSon = sonSifatidaOqi(nomzod)
      if (bSon !== null && kSon !== null) {
        if (Math.abs(bSon - kSon) <= ruxsatEtilganXato(kSon, savol.tolerance)) {
          return true
        }
      } else if (String(berilganJavob).trim() === String(nomzod).trim()) {
        return true
      }
    }
    return false
  }

  // VARIANTLI VA MOSLASHTIRISH SAVOLLARI
  const kutilgan = savol.correct

  // Ko'p bandli moslashtirish (masalan: { 1: "A", 2: "C", 3: "E" })
  if (kutilgan && typeof kutilgan === "object" && !Array.isArray(kutilgan)) {
    if (!berilganJavob || typeof berilganJavob !== "object" || Array.isArray(berilganJavob)) {
      return false
    }
    const kalitlar = Object.keys(kutilgan)
    if (kalitlar.length === 0) return false
    return kalitlar.every(
      (k) => String(berilganJavob[k] ?? "").trim().toUpperCase() === String(kutilgan[k]).trim().toUpperCase()
    )
  }

  // Agar kutilgan raqam (0..5) bo'lsa
  if (typeof kutilgan === "number") {
    if (typeof berilganJavob === "number") {
      return kutilgan === berilganJavob
    }
    const harf = String(berilganJavob).trim().toUpperCase()
    const harfIndeks = MS_VARIANT_HARFLAR.indexOf(harf)
    if (harfIndeks !== -1) {
      return kutilgan === harfIndeks
    }
    if (savol.options && savol.options[kutilgan]) {
      return String(savol.options[kutilgan]).trim().toLowerCase() === String(berilganJavob).trim().toLowerCase()
    }
  }

  // Agar kutilgan harf ('A', 'B', 'C', 'D', 'E', 'F') bo'lsa
  const kutilganHarf = String(kutilgan).trim().toUpperCase()
  if (typeof berilganJavob === "number") {
    return MS_VARIANT_HARFLAR[berilganJavob] === kutilganHarf
  }

  return String(berilganJavob).trim().toUpperCase() === kutilganHarf
}
