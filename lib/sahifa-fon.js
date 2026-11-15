// lib/sahifa-fon.js
//
// SAHIFA FONI — v3.0.0 dan boshlab yoziladigan sahifalar uchun.
//
// NEGA BU KERAK EDI. `lib/interfeys.js` da ochiq aytilgan: saytda ranglar
// 585 faylda to'g'ridan-to'g'ri Tailwind sinflari bilan yozilgani uchun
// mavzu almashtirib bo'lmaydi. Bu to'g'ri tashxis, lekin u ESKI sahifalarga
// tegishli. Yangi sahifalar boshqacha yoziladi: rang qiymati sinf ichida
// emas, CSS o'zgaruvchisida turadi. Shunda fonni almashtirish — bitta
// `data-fon` atributini o'zgartirish demak.
//
// QOIDA (v3 dan keyin yoziladigan har bir sahifa uchun): rang faqat shu
// yerdagi o'zgaruvchilar orqali beriladi. `bg-purple-900` yozilgan zahoti
// sahifa yorug' fonda buziladi va uni keyin tuzatib bo'lmaydi.
//
// YAGONA V4 FON: butun platforma yagona to'q safir-ko'k (Safir V4) ko'rinishga
// o'tkazilgan. Eski localStorage qiymatlari ham `tun` ga tekislanadi.

export const FONLAR = [
  {
    id: 'tun',
    nom: 'Safir (V4)',
    tavsif: "To'q safir-ko'k — yagona V4 dizayni",
    // Namuna ranglari
    namuna: { fon: '#081845', urgu: '#facc15' },
  },
]

export const ODDIY_FON = 'tun'

/** Brauzerda saqlash kaliti */
export const FON_KALITI = 'jda-fon-v3'

export function fonToza() {
  return ODDIY_FON
}

/**
 * Yagona V4 fonini qaytaradi (serverda `null`, brauzerda `'tun'`).
 * Eski ko'p-mavzuli localStorage qiymati qolgan bo'lsa tozalaydi.
 */
export function fonOqi() {
  if (typeof window === 'undefined') return null
  try {
    const eski = localStorage.getItem(FON_KALITI)
    if (eski && eski !== ODDIY_FON) {
      localStorage.setItem(FON_KALITI, ODDIY_FON)
    }
  } catch {
    // Maxfiy rejimda localStorage yopiq bo'lishi mumkin
  }
  return ODDIY_FON
}

export function fonYoz() {
  try {
    localStorage.setItem(FON_KALITI, ODDIY_FON)
  } catch {
    // Saqlanmadi — tanlov baribir ODDIY_FON da qoladi
  }
  return ODDIY_FON
}

/**
 * RANG QIYMATLARI QAYERDA. Har bir fonning CSS o'zgaruvchilari
 * `app/globals.css` dagi "v3.0.0" bo'limida, `[data-fon='...']` bloklarida
 * turadi.
 *
 * Nega bu yerda emas: uslub ikkita sahifada (bosh sahifa va fan sahifasi)
 * ishlatiladi. Uni JS satri sifatida saqlab, har sahifada `<style jsx>`
 * ichiga qo'yish — bir xil CSS ni ikki marta yuborish va vaqt o'tishi bilan
 * ular bir-biridan uzoqlashishi demak.
 *
 * Bu yerdagi `namuna` ranglari esa faqat TANLASH TUGMASIDAGI kichik
 * kvadratcha uchun: ular CSS o'zgaruvchisi orqali o'qib bo'lmaydigan
 * yagona joy, chunki tugma boshqa fon amal qilib turganda chiziladi.
 */
