// lib/milliy-sertifikat-aralashtirish.js
//
// Matnli savollarda javob variantlarini har sessiya uchun aralashtiradi.
//
// Nega kerak: bir paytlar bankda to'g'ri javob hamma savolda birinchi variant
// bo'lgan va har savolda A bosgan odam 100% olardi. Savol yozuvchi uchun
// to'g'ri variantni birinchi yozish tabiiy, shuning uchun bu takrorlanishi mumkin.
//
// Nega server siri bilan: sessiya ID si tokenda ochiq turadi va repo ochiq.
// Tartib faqat ID dan chiqsa, brauzerda qayta hisoblab to'g'ri javobni topish
// mumkin bo'lardi.
//
// Nega tartib saqlanmaydi: u sessiya ID sidan har safar bir xil chiqadi, shuning
// uchun sahifa yangilanganda ham, yakunlashda ham variantlar joyida qoladi.
import { createHmac } from "node:crypto"

function tasodif(kalit, qadam, sir) {
  const hash = createHmac("sha256", sir).update(`${kalit}:${qadam}`).digest()
  return hash.readUInt32BE(0) / 2 ** 32
}

/**
 * Fisher-Yates: [0..n-1] ning aralashgan tartibi.
 *
 * @param {number} n
 * @param {string} kalit
 * @param {string} sir
 * @returns {number[]}
 */
export function variantTartibi(n, kalit, sir) {
  if (!sir) throw new Error("Aralashtirish siri topilmadi")
  const tartib = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(tasodif(kalit, i, sir) * (i + 1))
    ;[tartib[i], tartib[j]] = [tartib[j], tartib[i]]
  }
  return tartib
}

/**
 * Sessiyaga xos savollar. Javob ham shu tartibga o'tkaziladi, shuning uchun
 * tekshirish va tahlil oddiy savol bilan bir xil ishlaydi.
 *
 * Rasmli savollar aralashtirilmaydi: ularning variantlari rasm ichida bosilgan,
 * options esa faqat harflar.
 */
export function sessiyaSavollari(savollar, sessiyaId, sir) {
  return savollar.map((savol) => {
    if (typeof savol.correct !== "number" || !Array.isArray(savol.options)) return savol
    const tartib = variantTartibi(savol.options.length, `${sessiyaId}:${savol.id}`, sir)
    return {
      ...savol,
      options: tartib.map((i) => savol.options[i]),
      correct: tartib.indexOf(savol.correct),
    }
  })
}
