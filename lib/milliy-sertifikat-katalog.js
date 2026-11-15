// lib/milliy-sertifikat-katalog.js
//
// Sinovning holati qo'lda yozilmaydi: bank to'liq va sifat darvozasidan o'tgan
// bo'lsa, sinov o'zi ochiladi.
//
// Nega avtomatik: holat bilan bank alohida yozilsa ular ajralib qoladi. Bo'sh
// sinov ochiq turishi yoki tayyor sinov yopiq qolishi mumkin edi.
//
// FAQAT SERVERDA: bu modul savol bankini o'qiydi. Brauzer holatni
// /api/milliy-sertifikat/katalog dan oladi.
import { tekshirBank } from './milliy-sertifikat-bank.js'
import { MILLIY_SERTIFIKAT_VARIANTLARI } from './milliy-sertifikat-data.js'
import { getSavollarBySlug } from '../data/milliy-sertifikat/savollar-ombromi.js'

export function sinovKatalogi(savollarOl = getSavollarBySlug) {
  return MILLIY_SERTIFIKAT_VARIANTLARI.map((variant) => {
    const bank = savollarOl(variant.slug)
    const tayyor = bank.length > 0 && tekshirBank(variant, bank).xatolar.length === 0
    return { ...variant, holat: tayyor ? 'ochiq' : 'tayyorlanmoqda' }
  })
}
