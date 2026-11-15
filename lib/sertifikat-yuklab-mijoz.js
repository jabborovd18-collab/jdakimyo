// lib/sertifikat-yuklab-mijoz.js
"use client"

import {
  ajratSertifikatTavsifi,
  milliySertifikatPdfMalumoti,
} from './sertifikat-tahlil'

/**
 * Har qanday sertifikat (MS yoki Admin/Hamkorlik) uchun to'g'ri PDF shablonini
 * tanlab, yuklab olishni ishga tushiradi. Katta kutubxonalar faqat bosilganda yuklanadi.
 */
export async function sertifikatYuklabOlishUniversal(sertifikat, customRank = null) {
  const { isMs } = ajratSertifikatTavsifi(sertifikat)

  if (isMs) {
    const { yuklabOlishMilliySertifikatPDF } = await import('@/lib/milliy-sertifikat-pdf')
    await yuklabOlishMilliySertifikatPDF(milliySertifikatPdfMalumoti(sertifikat))
    return
  }

  const { sertifikatPDFYuklab } = await import('@/lib/sertifikat-pdf')
  await sertifikatPDFYuklab(sertifikat, customRank)
}
