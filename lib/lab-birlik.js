// MIQDOR VA O'LCHOV BIRLIGI — laboratoriyaning yagona manbai.
//
// NEGA BU FAYL KERAK BO'LDI. Bugungacha inventar DONA bilan ishlagan:
// `LabItem.soni` — butun son, reaksiya esa `decrement: koef` bilan
// sarflaydi. Ya'ni "2NaOH" degani "2 dona NaOH". 3D laboratoriyadagi
// millilitr esa butunlay o'ylab topilgan edi — `sozlama.js` dagi
// `standartKonsentratsiya: 0.5` konstantasi, izohida ochiq "o'yin sharti"
// deb yozilgan. Foydalanuvchi 5 ml quysa ham, 50 ml quysa ham serverga
// bir xil kalitlar ro'yxati ketardi va stexiometriya bahosi natijaga
// hech qanday ta'sir qilmasdi.
//
// Bu yerda o'sha bo'shliq to'ldiriladi: har bir moddaning o'z birligi bor
// va miqdor haqiqiy son bo'ladi.
//
// ─────────────────────────────────────────────────────────────
// BIRLIK QAYERDAN OLINADI
// ─────────────────────────────────────────────────────────────
//
// Alohida "qaysi modda qanday o'lchanadi" jadvali YOZILMAYDI. Bu ma'lumot
// allaqachon bor: `lib/lab-modda.js` da har bir moddaning agregat holati
// (suyuq / qattiq / gaz) yozilgan. Ikkinchi jadval yaratilsa, u vaqt
// o'tishi bilan birinchisidan uzilib qoladi — masalan modda "qattiq" dan
// "suyuq" ga tuzatilsa, birligi eski holida qolardi.
//
// Shuning uchun qoida bitta va hosilaviy:
//   suyuq → ml   (eritma va suyuqlik idishga quyiladi)
//   gaz   → ml   (gaz ham hajm bilan o'lchanadi)
//   qattiq → gr  (kukun va metall tarozida tortiladi)

import { jadvaldanOl } from "./lab-modda.js";

export const BIRLIKLAR = {
  ml: { nom: "ml", toliq: "millilitr", kasr: 1 },
  gr: { nom: "g", toliq: "gramm", kasr: 2 },
  // Jihoz va sarflanadigan buyum (filtr qog'ozi) donalab sanaladi —
  // ularni ml yoki gramm bilan o'lchash ma'nosiz.
  dona: { nom: "dona", toliq: "dona", kasr: 0 },
};

export const SUKUT_BIRLIK = "dona";

// ─────────────────────────────────────────────────────────────
// ULUSH — bitta "dona" nechaga teng
// ─────────────────────────────────────────────────────────────
//
// Bu son ikki joyda ishlaydi:
//   1. Migratsiya: mavjud inventardagi `soni` shu koeffitsient bilan
//      `miqdor` ga aylanadi. Hech kim boyib yoki kambag'allashib qolmaydi.
//   2. Savdo: do'kondan "1 dona" olingani aslida shuncha ml yoki gr beradi.
//
// 25 ml — bitta probirkani to'ldirgulik (jihoz-modellari.js da probirka
// sig'imi aynan 25). 5 g — tarozida qulay o'lchanadigan eng kichik
// amaliy ulush. Sonlar o'quv nuqtai nazaridan atay yaxlit.
export const ULUSH = {
  ml: 25,
  gr: 5,
  dona: 1,
};

// ─────────────────────────────────────────────────────────────
// O'QISH
// ─────────────────────────────────────────────────────────────

const HOLAT_BIRLIGI = {
  suyuq: "ml",
  gaz: "ml",
  qattiq: "gr",
};

/**
 * Modda kalitidan o'lchov birligini aniqlaydi.
 *
 * Jadvalda yo'q kalit uchun "ml" qaytaradi, `dona` emas: jadvalda
 * yo'qligining eng ehtimolli sababi — bazaga yangi reaksiya qo'shilib,
 * `reagentlar.js` hali qayta yasalmagani. Bunday modda reagent bo'ladi,
 * jihoz emas.
 *
 * @param {string} kalit — "CuSO₄", "Fe", "CO₂↑"
 * @returns {'ml'|'gr'|'dona'}
 */
export function reagentBirligi(kalit) {
  const toza = String(kalit || "")
    .replace("↑", "")
    .replace("↓", "")
    .trim();
  const modda = jadvaldanOl(toza);
  if (!modda) return "ml";
  return HOLAT_BIRLIGI[modda.holat] || "ml";
}

/**
 * Katalog yozuvining birligi. Jihoz va texnika har doim donalab sanaladi,
 * reagent esa o'z agregat holatiga qarab.
 *
 * @param {{kalit: string, turi: string}} def — LabItemDef yoki shunga o'xshash
 */
export function buyumBirligi(def) {
  if (!def) return SUKUT_BIRLIK;
  if (def.turi !== "reagent") return "dona";
  return reagentBirligi(def.kalit);
}

/** Bitta "dona" shu birlikda nechaga teng. */
export function ulush(birlik) {
  return ULUSH[birlik] ?? 1;
}

/**
 * Eski `soni` (dona) dan yangi `miqdor` ga o'tkazish.
 * Migratsiya ham, do'kondagi xarid ham shuni ishlatadi.
 */
export function donadanMiqdor(soni, birlik) {
  return Number(soni || 0) * ulush(birlik);
}

/**
 * 3D laboratoriyada quyilgan hajmni moddaning o'z birligiga o'tkazadi.
 *
 * Nega kerak: sahnada hamma narsa idishga QUYILADI, ya'ni client ml
 * hisoblaydi. Qattiq modda esa grammda o'lchanadi — kukunni qoshiqda
 * solish ham xuddi shu harakat, lekin natijasi massa.
 *
 * O'tkazish ulush nisbati bo'yicha: bir ulush = 25 ml = 5 g, ya'ni
 * to'liq bir ulush quyilsa ikkala birlikda ham to'liq bir ulush chiqadi
 * va stexiometrik nisbat buzilmaydi.
 */
export function hajmniBirlikka(ml, birlik) {
  const son = Number(ml) || 0;
  if (birlik === "ml") return son;
  return (son / ULUSH.ml) * ulush(birlik);
}

/**
 * Teskarisi: moddaning o'z birligidagi miqdorni HAJMGA o'tkazadi.
 *
 * Idishga nima sig'ishini hisoblashda kerak — sig'im millilitrda
 * o'lchanadi, kukun esa grammda. 5 g kukun idishda 25 ml joy egallaydi
 * (bir ulush), ya'ni o'tkazish ulush nisbati bo'yicha.
 */
export function birlikdanHajmga(miqdor, birlik) {
  const son = Number(miqdor) || 0;
  if (birlik === "ml") return son;
  const u = ulush(birlik);
  return u > 0 ? (son / u) * ULUSH.ml : son;
}

/**
 * Reaksiya koeffitsientidan kerakli miqdor.
 *
 * "2NaOH" → 2 × 25 ml = 50 ml. Bu kimyoviy mol emas, o'quv sharti:
 * bazada aniq molyar massalar yo'q, lekin NISBAT to'g'ri qoladi —
 * 1:2 reaksiyada ikkinchisidan haqiqatan ikki barobar ko'p ketadi.
 */
export function koefdanMiqdor(koef, birlik) {
  return Number(koef || 1) * ulush(birlik);
}

/**
 * Ekranga chiqarish uchun: 50 → "50 ml", 12.5 → "12.5 ml", 2.5 → "2.5 g".
 *
 * `kasr` — ENG KO'P nechta kasr xona, majburiy emas. Grammda 0.25 g ma'noli,
 * millilitrda esa 0.25 ml o'lchab bo'lmaydigan aniqlik. Lekin butun son
 * "50.0 ml" bo'lib chiqmasligi kerak — ortiqcha nol o'qishni sekinlashtiradi
 * va aniqlik yo'q joyda aniqlik bordek ko'rsatadi.
 */
export function miqdorniFormatla(miqdor, birlik) {
  const b = BIRLIKLAR[birlik] || BIRLIKLAR[SUKUT_BIRLIK];
  const son = Number(miqdor || 0);
  const yaxlit = son.toFixed(b.kasr).replace(/\.?0+$/, "");
  return `${yaxlit} ${b.nom}`;
}

/**
 * Yetarli miqdor bormi.
 *
 * Kichik bag'rikenglik (epsilon) ataylab: suzuvchi nuqta arifmetikasida
 * 3 × 16.6 = 49.99999999999999 chiqadi va "50 ml kerak, 49.99 bor" degan
 * xato foydalanuvchi uchun tushunarsiz bo'lardi.
 */
export const EPSILON = 0.001;

export function yetadimi(bor, kerak) {
  return Number(bor || 0) + EPSILON >= Number(kerak || 0);
}
