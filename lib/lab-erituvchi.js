// ERITUVCHILAR — suvning turlari va ularning xossalari.
//
// NEGA KERAK. Bugungacha laboratoriyada erituvchi tushunchasi umuman
// yo'q edi: `H₂O` boshqa har qanday reagent kabi bitta yozuv bo'lib
// turardi. Lekin suv reaksiyada ikki xil rol o'ynaydi — u ba'zan
// reagent, ba'zan esa muhit. Va eng muhimi: laboratoriyada ikki xil suv
// bor va ular bir xil emas.
//
//   Jo'mrak suvi  — bepul va cheksiz, lekin tarkibida mineral tuzlar bor.
//                   Shuning uchun u TOKNI O'TKAZADI va cho'ktirish
//                   tajribalarini buzadi (AgNO₃ jo'mrak suvida darrov
//                   xiralashadi — suvdagi xlorid bilan AgCl beradi).
//   Distillangan  — toza, tokni deyarli o'tkazmaydi. Pullik yoki
//                   sandiqdan, kelajakda distillagichdan.
//
// Bu "distillangani har doim yaxshiroq" degani EMAS: elektroliz uchun
// aynan o'tkazuvchanlik kerak va distillangan suvda u bormaydi. Ikkala
// tomonga ham qarab turadigan tanlov — o'quv nuqtai nazaridan eng qimmatlisi.
//
// ─────────────────────────────────────────────────────────────
// VARIANT MEXANIZMI
// ─────────────────────────────────────────────────────────────
//
// Reaksiya REAGENTLAR TO'PLAMI bo'yicha topiladi (lib/lab-tenglama.js
// dagi `toplamKaliti`). Jo'mrak suvining kaliti `H₂O` dan farq qilsa,
// u bilan birorta ham reaksiya mos kelmasdi.
//
// Shuning uchun variantning `asos` kaliti bor: inventarda u alohida
// yozuv, reaksiya qidirishda esa asosiga aylantiriladi. Mexanizm
// suvga xos emas — keyinchalik suyultirilgan va konsentrlangan kislota
// ham shu yo'l bilan qo'shiladi.

/** Tenglamalarda ishlatiladigan asos kalit */
export const SUV = "H₂O";

/** Jo'mrak suvi — bepul, cheksiz, lekin toza emas */
export const JOMRAK_SUVI = "H₂O-oddiy";

export const ERITUVCHILAR = {
  // Katalogdagi mavjud `H₂O` — sotib olinadigan, toza suv. Ataylab
  // o'zgartirilmadi: foydalanuvchilarning inventarida u allaqachon bor
  // va uni ko'chirish ularning mulkiga tegish degani bo'lardi.
  [SUV]: {
    nom: "Distillangan suv",
    asos: null,
    toza: true,
    // Solishtirma o'tkazuvchanlik, µS/sm. Distillangan suvda ~1,
    // jo'mrak suvida 200–800 (mintaqaga qarab).
    otkazuvchanlik: 1,
    aralashmalar: [],
    cheksiz: false,
    izoh: "Toza suv — cho'ktirish va sifat tahlili uchun.",
  },

  [JOMRAK_SUVI]: {
    nom: "Jo'mrak suvi",
    asos: SUV,
    toza: false,
    otkazuvchanlik: 400,
    // Aynan shu ionlar cho'ktirish tajribasini buzadi: AgNO₃ ular bilan
    // AgCl beradi, Ba(OH)₂ esa karbonat bilan xiralashadi.
    aralashmalar: ["Ca²⁺", "Mg²⁺", "Cl⁻", "HCO₃⁻"],
    cheksiz: true,
    izoh: "Bepul va cheksiz, lekin mineral tuzlar bor — tokni o'tkazadi.",
  },
};

/** Shu kalit erituvchimi. */
export function erituvchimi(kalit) {
  return Object.prototype.hasOwnProperty.call(ERITUVCHILAR, kalit);
}

/** Erituvchi xossalari, topilmasa null. */
export function erituvchiOl(kalit) {
  return ERITUVCHILAR[kalit] ?? null;
}

/**
 * Variantni asosiga aylantiradi: "H₂O-oddiy" → "H₂O".
 *
 * Variant bo'lmasa kalitning o'zi qaytadi, ya'ni bu funksiyani har qanday
 * kalitga xavfsiz qo'llash mumkin. Ish vaqtida asos katalogdan
 * (`LabItemDef.asos`) ham o'qiladi — bu yerdagi jadval seed skripti va
 * client uchun.
 */
export function asosKaliti(kalit) {
  return ERITUVCHILAR[kalit]?.asos ?? kalit;
}

/**
 * Idishdagi eng "iflos" erituvchini topadi.
 *
 * Nega eng iflosi: bir tomchi jo'mrak suvi ham eritmani ifloslantiradi.
 * Toza suv qo'shish uni orqaga tozalamaydi — laboratoriyada ham shunday.
 *
 * @param {string[]} kalitlar — idishga quyilgan moddalar
 * @returns {{kalit: string, xossa: object}|null}
 */
export function eritmaErituvchisi(kalitlar = []) {
  let eng = null;
  for (const kalit of kalitlar) {
    const xossa = erituvchiOl(kalit);
    if (!xossa) continue;
    if (!eng || xossa.otkazuvchanlik > eng.xossa.otkazuvchanlik) {
      eng = { kalit, xossa };
    }
  }
  return eng;
}

/** Katalogga yoziladigan variantlar — seed skripti shu ro'yxatni oladi. */
export function variantRoyxati() {
  return Object.entries(ERITUVCHILAR)
    .filter(([, x]) => x.asos)
    .map(([kalit, x]) => ({ kalit, ...x }));
}
