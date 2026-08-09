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
// TO'RTTA FON. Uchtasi qorong'u (bir xil sahifa, har xil kayfiyat), bittasi
// yorug'. Yorug'i shunchaki "teskari qilingan" emas: urg'u rangi ham
// quyuqlashtirilgan, aks holda oq fonda sariq matn o'qilmaydi.

export const FONLAR = [
  {
    id: 'tun',
    nom: 'Tun',
    tavsif: "Chuqur siyoh — asosiy ko'rinish",
    // Tanlash tugmasidagi namuna
    namuna: { fon: '#070a12', urgu: '#f5b301' },
  },
  {
    id: 'siyoh',
    nom: 'Siyohrang',
    tavsif: "Saytning eski ko'k-siyoh ohangi",
    namuna: { fon: '#140b28', urgu: '#fbbf24' },
  },
  {
    id: 'grafit',
    nom: 'Grafit',
    tavsif: 'Neytral kulrang, kam chalg\'itadi',
    namuna: { fon: '#101114', urgu: '#e8b339' },
  },
  {
    id: 'kunduz',
    nom: 'Kunduz',
    tavsif: "Yorug' fon — kunduzgi o'qish uchun",
    namuna: { fon: '#f6f7fb', urgu: '#a35a06' },
  },
]

export const ODDIY_FON = 'tun'

/** Brauzerda saqlash kaliti */
export const FON_KALITI = 'jda-fon-v3'

export function fonToza(id) {
  return FONLAR.some((f) => f.id === id) ? id : ODDIY_FON
}

/**
 * Saqlangan fonni o'qiydi.
 *
 * Server tomonda `null` qaytaradi — chaqiruvchi shunda ODDIY_FON bilan
 * chizadi va effektda haqiqiy tanlovga o'tadi. Serverda localStorage yo'q,
 * shuning uchun boshqa yo'l yo'q.
 */
export function fonOqi() {
  if (typeof window === 'undefined') return null
  try {
    return fonToza(localStorage.getItem(FON_KALITI))
  } catch {
    // Maxfiy rejimda localStorage yopiq bo'lishi mumkin
    return null
  }
}

export function fonYoz(id) {
  const toza = fonToza(id)
  try {
    localStorage.setItem(FON_KALITI, toza)
  } catch {
    // Saqlanmadi — tanlov shu sessiya uchun baribir qo'llanadi
  }
  return toza
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
