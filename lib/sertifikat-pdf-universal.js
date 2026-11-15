// lib/sertifikat-pdf-universal.js
//
// Barcha turdagi sertifikatlar (Milliy Sertifikat sinovi, Hamkorlik, Admin maxsus)
// uchun Node.js server va brauzerda ishlaydigan yagona PDF bayt generatori.

import {
  ajratSertifikatTavsifi,
  milliySertifikatPdfMalumoti,
} from './sertifikat-tahlil.js'
import { generatsiyaMilliySertifikatPDFBaytlar } from './milliy-sertifikat-pdf.js'
import { generatsiyaUmumiySertifikatPDFBaytlar } from './sertifikat-pdf.js'

/**
 * HTTP Content-Disposition va Telegram sendDocument uchun xavfsiz fayl nomi.
 */
export function sertifikatFaylNomi(certId) {
  const toza = String(certId || 'JDA-SERTIFIKAT')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '')
  return `JDA-Sertifikat-${toza || 'HUJJAT'}.pdf`
}

/**
 * Sertifikat obyektini avtomatik tanib, tegishli vektorli PDF baytlarini qaytaradi.
 * @param {object} sertifikat
 * @param {number|null} customRank
 * @returns {Promise<Uint8Array>}
 */
export async function generatsiyaSertifikatPDFBaytlar(sertifikat, customRank = null) {
  if (!sertifikat || typeof sertifikat !== 'object') {
    throw new Error("Sertifikat ma'lumoti topilmadi")
  }

  const { isMs } = ajratSertifikatTavsifi(sertifikat)
  if (isMs) {
    return generatsiyaMilliySertifikatPDFBaytlar(milliySertifikatPdfMalumoti(sertifikat))
  }

  return generatsiyaUmumiySertifikatPDFBaytlar(sertifikat, customRank)
}
