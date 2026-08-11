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

// ─────────────────────────────────────────────────────────────
// ERITUVCHI REAKSIYAGA QANDAY TA'SIR QILADI
// ─────────────────────────────────────────────────────────────
//
// Ikki tomonga ham qaraydi va aynan shunisi muhim. "Distillangan suv
// har doim yaxshiroq" degan soddalashtirish noto'g'ri: elektroliz uchun
// aynan o'tkazuvchanlik kerak va toza suvda u yo'q.
//
// Qaysi reaksiya nimaga sezgirligi TAXMIN QILINMAYDI — bazadagi haqiqiy
// maydonlardan o'qiladi (`category`, `reactionType`, `techniques`).
// Sanoq: cho'ktirish va sifat tahlili 37 ta reaksiya, elektroliz 3 ta.

/** Jo'mrak suvining ionlari buzadigan reaksiyalar */
const SEZGIR_TOIFA = ["cho'ktirish", "sifat", "precipitatsiya"];
const SEZGIR_USUL = ["cho'ktirish", "sifat tahlili", "sifat reaksiyasi"];

/** O'tkazuvchanlik SHART bo'lgan reaksiyalar */
const OTKAZUVCHANLIK_KERAK = ["elektroliz"];

/**
 * Shundan past o'tkazuvchanlikda elektroliz bormaydi (µS/sm).
 * Distillangan suv ~1, jo'mrak suvi ~400 — chegara ikkalasining
 * o'rtasida, aniq songa bog'lanib qolmaslik uchun.
 */
const ELEKTROLIZ_CHEGARASI = 50;

function matnniTozala(x) {
  return String(x ?? "")
    .toLowerCase()
    .replace(/['‘’`´]/g, "'");
}

function reaksiyaBelgilari(reaksiya) {
  const usullar = Array.isArray(reaksiya?.techniques) ? reaksiya.techniques : [];
  return [
    matnniTozala(reaksiya?.category),
    matnniTozala(reaksiya?.reactionType),
    ...usullar.map(matnniTozala),
  ];
}

/**
 * Erituvchi shu reaksiyaga mos keladimi.
 *
 * @param {object} reaksiya — keshdagi reaksiya (category, reactionType, techniques)
 * @param {object|null} xossa — `eritmaErituvchisi(...).xossa`, suv umuman
 *        quyilmagan bo'lsa null
 * @returns {{
 *   holat: 'mos'|'ifloslandi'|'otkazmaydi',
 *   izoh: string|null, unumKoef: number, xpKoef: number,
 *   kuzatuv: string|null, toxtatadimi: boolean
 * }}
 */
export function erituvchiBahosi(reaksiya, xossa) {
  const yaxshi = {
    holat: "mos",
    izoh: null,
    unumKoef: 1,
    xpKoef: 1,
    kuzatuv: null,
    toxtatadimi: false,
  };

  // Suv umuman ishlatilmagan — erituvchining gapi yo'q.
  if (!xossa) return yaxshi;

  const belgilar = reaksiyaBelgilari(reaksiya);
  const bormi = (royxat) => belgilar.some((b) => royxat.some((k) => b.includes(k)));

  // 1. O'tkazuvchanlik shart bo'lgan reaksiya toza suvda BORMAYDI.
  //
  // Bu jazo emas, kimyoning o'zi: distillangan suvda erkin ion yo'q, tok
  // o'tmaydi. Bazadagi elektroliz reaksiyasining muhiti ham aynan shuni
  // aytadi — "ishqor yoki kislota qo'shilgan suv".
  if (bormi(OTKAZUVCHANLIK_KERAK) && xossa.otkazuvchanlik < ELEKTROLIZ_CHEGARASI) {
    return {
      holat: "otkazmaydi",
      izoh:
        "Distillangan suv tokni o'tkazmaydi — unda erkin ion yo'q, " +
        "shuning uchun elektroliz boshlanmadi. Jo'mrak suvi yoki " +
        "ishqor qo'shilgan suv kerak.",
      unumKoef: 0,
      xpKoef: 0,
      kuzatuv: null,
      toxtatadimi: true,
    };
  }

  // 2. Cho'ktirish va sifat tahlilini jo'mrak suvi buzadi.
  //
  // Suvdagi xlorid kumush tuzi bilan darrov AgCl beradi, karbonat esa
  // bariy va kalsiy bilan xiralashadi — natijada cho'kma sizniki emas,
  // suvniki bo'lib chiqadi va tahlil ma'nosini yo'qotadi.
  if (!xossa.toza && bormi(SEZGIR_TOIFA.concat(SEZGIR_USUL))) {
    const ionlar = (xossa.aralashmalar || []).join(", ");
    return {
      holat: "ifloslandi",
      izoh:
        `Jo'mrak suvidagi ionlar (${ionlar}) o'z cho'kmasini berdi — ` +
        "natija sizning reaksiyangizniki emas. Bunday tahlil uchun " +
        "distillangan suv kerak.",
      unumKoef: 0.6,
      xpKoef: 0.5,
      kuzatuv: "Eritma xiraroq — suvdagi tuzlar ham cho'kmaga tushdi.",
      toxtatadimi: false,
    };
  }

  return yaxshi;
}

/** Katalogga yoziladigan variantlar — seed skripti shu ro'yxatni oladi. */
export function variantRoyxati() {
  return Object.entries(ERITUVCHILAR)
    .filter(([, x]) => x.asos)
    .map(([kalit, x]) => ({ kalit, ...x }));
}
