// Reagent kalitidan uning ko'rinishini — rangi, agregat holati va
// shaffofligini — aniqlaydi.
//
// Ranglarning o'zi bu yerda EMAS, `lib/lab-modda.js` da: o'sha fayl kuzatuv
// matnidagi rang so'zlari bilan ham bo'lishiladigan yagona manba. Bu yerda
// faqat "kalitni qanday o'qish" mantig'i qoladi.
//
// Ilgari jadval shu faylning ichida edi va bazadagi 242 moddadan 48 tasini
// qamrardi; qolgani bitta och-havorang qiymatga tushardi. Endi jadval
// hammasini biladi, quyidagi taxmin shoxobchasi esa faqat kutilmagan kalit
// uchun — masalan bazaga yangi reaksiya qo'shilib, `reagentlar.js` hali
// qayta yasalmagan bo'lsa.

import { PALITRA, jadvaldanOl } from "@/lib/lab-modda.js";

// Formulada metall belgisi bo'lsa shu rang olinadi. Tartib muhim: ikki
// harfli belgilar ("Cu") bir harfli ("C") dan oldin tekshiriladi, aks holda
// CuSO₄ uglerod deb qabul qilinardi.
const METALL_RANGLARI = [
  ["Cu", PALITRA.misKok],
  ["Fe", PALITRA.qahrabo],
  ["Mn", PALITRA.binafsha],
  ["Cr", PALITRA.yashil],
  ["Ni", PALITRA.yashil],
  ["Co", PALITRA.pushti],
];

// Formulada uchraydigan, gaz yoki cho'kma ekanini ko'rsatuvchi belgilar
const GAZ_BELGISI = "↑";
const CHOKMA_BELGISI = "↓";

// Metall bilan boshlanadigan, lekin kislorod/vodorod/oltingugurt tutmaydigan
// birikmalar odatda qattiq tuz yoki sof metall bo'ladi.
const METALL_BOSHLARI = new Set([
  "Li", "Na", "K", "Rb", "Cs", "Be", "Mg", "Ca", "Sr", "Ba",
  "Al", "Zn", "Fe", "Cu", "Ag", "Au", "Pb", "Sn", "Ni", "Co",
  "Mn", "Cr", "Ti", "Pt", "Hg", "Cd", "W", "V",
]);

// Kalitning boshidagi element belgisini oladi: "CaCO₃" → "Ca", "S" → "S".
function boshElement(kalit) {
  const moslik = kalit.match(/^[A-Z][a-z]?/);
  return moslik ? moslik[0] : "";
}

// Jadvalda yo'q kalit uchun formuladan taxmin qilish.
function taxminQil(toza, xom) {
  let rang = PALITRA.rangsiz;
  let shaffoflik = 0.18;

  for (const [belgi, qiymat] of METALL_RANGLARI) {
    if (toza.includes(belgi)) {
      rang = qiymat;
      shaffoflik = 0.65;
      break;
    }
  }

  let holat = "suyuq";
  if (xom.includes(GAZ_BELGISI)) {
    holat = "gaz";
    shaffoflik = 0.12;
  } else if (xom.includes(CHOKMA_BELGISI)) {
    holat = "qattiq";
    shaffoflik = 0.9;
  } else {
    const bosh = boshElement(toza);
    const kislorodsiz = !/[OHS]/.test(toza.slice(bosh.length));
    if (METALL_BOSHLARI.has(bosh) && kislorodsiz) {
      holat = "qattiq";
      shaffoflik = 0.95;
    }
  }

  return { rang, holat, shaffoflik };
}

/**
 * Modda ko'rinishini qaytaradi.
 *
 * Har doim to'liq obyekt qaytariladi, hech qachon undefined emas: chaqiruvchi
 * (rang-aralashtirish.js va korinish.js) natijaning `.rang` maydonini
 * to'g'ridan o'qiydi, oraliq tekshiruvsiz.
 *
 * @param {string} kalit — reagent kaliti, masalan "CuSO₄" yoki "CO₂↑"
 * @returns {{ rang: number, holat: 'suyuq'|'qattiq'|'gaz', shaffoflik: number }}
 */
export function moddaKorinishi(kalit) {
  const xom = String(kalit || "").trim();
  if (!xom) return { rang: PALITRA.rangsiz, holat: "suyuq", shaffoflik: 0.12 };

  // Tenglamadagi ↑ va ↓ belgilari kalitning bir qismi emas, lekin holatni
  // aytib turadi — shuning uchun olib tashlanadi, ammo taxminga uzatiladi.
  const toza = xom.replace(GAZ_BELGISI, "").replace(CHOKMA_BELGISI, "").trim();

  const jadvaldan = jadvaldanOl(toza);
  if (jadvaldan) return jadvaldan;

  return taxminQil(toza, xom);
}

/**
 * Moddalar ro'yxatidan cho'kma bo'lib tushadiganining rangini topadi.
 *
 * Nega kerak: cho'kma rangi ilgari faqat kuzatuv matnidan olinardi va matnda
 * rang aytilmagan bo'lsa ("cho'kma hosil bo'ladi") oppoq chiqardi — Cu(OH)₂
 * ham, Fe(OH)₃ ham bir xil oq. Reaksiya mahsulotlari ma'lum bo'lgani uchun
 * cho'kmaning haqiqiy rangini shundan olish aniqroq.
 *
 * @param {Array<{kalit: string}>} mahsulotlar — serverdan kelgan `olindi`
 * @returns {number|null} — qattiq mahsulot rangi yoki topilmasa null
 */
export function chokmaRangi(mahsulotlar = []) {
  for (const mahsulot of mahsulotlar) {
    const kalit = mahsulot?.kalit;
    if (!kalit) continue;
    const korinish = moddaKorinishi(kalit);
    if (korinish.holat === "qattiq") return korinish.rang;
  }
  return null;
}
