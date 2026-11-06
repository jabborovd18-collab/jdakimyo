// lib/milliy-sertifikat-sessiya.js
//
// Imtihon sessiyasining imzolangan tokeni.
//
// Nega bazada emas: sessiya boshlanishi uchun yangi jadval kerak bo'lardi.
// Imzo boshlanish vaqti va egasini o'zgartirib bo'lmaydigan qiladi, bir martalik
// ishlatishni esa yakunlashdagi QuizResult.attemptId unique indeksi ta'minlaydi.
import { createHmac, timingSafeEqual } from "node:crypto"

function imzo(matn, sir) {
  return createHmac("sha256", sir).update(matn).digest("base64url")
}

/**
 * @param {{ sid: string, slug: string, uid: string|null, bosh: number, tugash: number }} malumot
 * @param {string} sir
 * @returns {string}
 */
export function imzolaSessiya(malumot, sir) {
  if (!sir) throw new Error("Sessiya siri topilmadi")
  const matn = Buffer.from(JSON.stringify(malumot)).toString("base64url")
  return `${matn}.${imzo(matn, sir)}`
}

/**
 * Imzo to'g'ri bo'lsa sessiya ma'lumotini, aks holda null qaytaradi.
 *
 * @param {unknown} token
 * @param {string} sir
 */
export function ochSessiya(token, sir) {
  if (!sir || typeof token !== "string") return null
  const [matn, berilgan, ortiqcha] = token.split(".")
  if (!matn || !berilgan || ortiqcha !== undefined) return null

  const kutilgan = Buffer.from(imzo(matn, sir))
  const keldi = Buffer.from(berilgan)
  // timingSafeEqual uzunliklar farq qilsa xato otadi
  if (kutilgan.length !== keldi.length || !timingSafeEqual(kutilgan, keldi)) return null

  try {
    return JSON.parse(Buffer.from(matn, "base64url").toString("utf8"))
  } catch {
    return null
  }
}
