// STEXIOMETRIK NISBAT — server hakamligi.
//
// NEGA SERVERGA KO'CHDI. Bu baho ilgari faqat client tomonda edi
// (`app/laboratoriya/3d/lib/stexiometriya.js`) va natijaga hech qanday
// ta'sir qilmasdi: ekranda "ortiqcha quyildingiz" deb yozilardi, lekin
// mahsulot ham, tajriba ochkosi ham o'zgarmasdi. Ya'ni "xato eritma
// tajribani buzadi" degan qoida aslida ishlamasdi.
//
// Endi hakam shu yerda. Client baribir shu modulni o'qiydi — lekin faqat
// OLDINDAN KO'RSATISH uchun; hisob-kitobning haqiqiysi serverda.
//
// ─────────────────────────────────────────────────────────────
// IKKITA MUSTAQIL SAVOL
// ─────────────────────────────────────────────────────────────
//
// Eski client mantig'i ikkalasini bitta songa qorishtirib yuborgan edi va
// natijada `chala` shoxobchasi amalda o'lik qolgandi: u `togrilikFoizi <
// 0.6` shartida tekshirilardi, `togrilikFoizi` esa `1 / nisbat` ga teng,
// ya'ni bu shart `nisbat > 1.67` degani — undan oldin turgan `ortiqcha`
// (1.5) uni har doim ushlab qolardi.
//
// Shuning uchun bu yerda ikki savol ajratilgan:
//
//   1. MUTANOSIBLIKMI — reagentlar bir-biriga to'g'ri nisbatdami?
//      `nisbat = eng katta ulush / eng kichik ulush`. 1.0 — mukammal.
//
//   2. YETARLIMI — umuman sezilarli miqdor quyildimi?
//      `unum = eng kichik ulush`. Bir tomchi quysang reaksiya bormaydi,
//      nisbat esa mukammal bo'lishi mumkin.

export const NISBAT_CHEGARALARI = {
  // Bir reaksiya ulushining shundan kamrog'i quyilsa — sezilarli natija yo'q
  chala: 0.2,
  // Nisbat shundan oshsa reagentlardan biri behuda ketyapti
  ortiqcha: 1.5,
  keskin: 3.0,
};

// Noto'g'ri nisbat tajriba ochkosini kamaytiradi. Nega jazo yumshoq: talaba
// xato qilganda o'rganayotgandek his qilishi kerak, jazolanayotgandek emas —
// shu sababdan eng past koeffitsient ham nol emas.
export const XP_KOEFFITSIYENTI = {
  togri: 1.0,
  ortiqcha: 0.7,
  "keskin-ortiqcha": 0.4,
  chala: 0.3,
};

/**
 * Reagentlar nisbatini baholaydi.
 *
 * @param {Record<string, number>} quyilgan — kalit → haqiqiy quyilgan miqdor
 * @param {Array<{kalit: string, miqdor: number}>} kerak — bitta reaksiya
 *        ulushi uchun kerakli miqdor (koeffitsientdan hisoblangan)
 * @returns {{
 *   holat: 'togri'|'ortiqcha'|'keskin-ortiqcha'|'chala',
 *   unum: number, nisbat: number, togrilikFoizi: number,
 *   cheklovchi: string|null, ortiqchaKalit: string|null,
 *   qoldiq: Record<string, number>, izoh: string
 * }}
 */
export function nisbatniBaho(quyilgan = {}, kerak = []) {
  if (!Array.isArray(kerak) || kerak.length === 0) {
    return {
      holat: "togri",
      unum: 1,
      nisbat: 1,
      togrilikFoizi: 1,
      cheklovchi: null,
      ortiqchaKalit: null,
      qoldiq: {},
      izoh: "Reaksiya uchun maxsus nisbat talab etilmaydi.",
    };
  }

  // Har bir reagent uchun "necha ulushga yetadi" hisoblanadi.
  let engKichik = Infinity;
  let engKatta = 0;
  let cheklovchi = null;
  let ortiqchaKalit = null;
  const ulushlar = {};

  for (const talab of kerak) {
    const kerakli = Number(talab.miqdor) || 0;
    const bor = Number(quyilgan[talab.kalit]) || 0;
    // Nol talab bo'lishi mumkin emas, lekin bo'lsa ham nolga bo'linmaydi
    const ulush = kerakli > 0 ? bor / kerakli : 0;

    ulushlar[talab.kalit] = ulush;
    if (ulush < engKichik) {
      engKichik = ulush;
      cheklovchi = talab.kalit;
    }
    if (ulush > engKatta) {
      engKatta = ulush;
      ortiqchaKalit = talab.kalit;
    }
  }

  if (!Number.isFinite(engKichik)) engKichik = 0;

  const unum = engKichik;
  const nisbat = engKichik > 0 ? engKatta / engKichik : Infinity;
  const togrilikFoizi = engKatta > 0 ? Number((engKichik / engKatta).toFixed(3)) : 0;

  // Ortiqcha qolgan miqdor: cheklovchi sarflagan ulushdan ortig'i.
  // Bu modda BEHUDA KETADI — u idishga quyilgan, ya'ni shishaga qaytmaydi.
  const qoldiq = {};
  for (const talab of kerak) {
    const bor = Number(quyilgan[talab.kalit]) || 0;
    const sarflanadi = unum * (Number(talab.miqdor) || 0);
    const ortiq = bor - sarflanadi;
    if (ortiq > 0.001) qoldiq[talab.kalit] = Number(ortiq.toFixed(3));
  }

  // Tartib muhim: avval "umuman yetarlimi", keyin "mutanosibmi".
  // Teskari qilinsa, bir tomchi mukammal nisbatda quyilgani "to'g'ri"
  // deb baholanardi.
  let holat;
  let izoh;

  if (unum <= 0) {
    holat = "chala";
    izoh = `${cheklovchi || "Reagent"} umuman quyilmadi — reaksiya bormadi.`;
  } else if (unum < NISBAT_CHEGARALARI.chala) {
    holat = "chala";
    izoh = `Juda oz quyildi (kerakligining ${Math.round(unum * 100)}% i) — reaksiya zo'rg'a sezildi.`;
  } else if (nisbat >= NISBAT_CHEGARALARI.keskin) {
    holat = "keskin-ortiqcha";
    izoh = `${ortiqchaKalit} kerakligidan ${nisbat.toFixed(1)} barobar ko'p quyildi — ortig'i behuda ketdi.`;
  } else if (nisbat >= NISBAT_CHEGARALARI.ortiqcha) {
    holat = "ortiqcha";
    izoh = `${ortiqchaKalit} biroz ortiqcha (${nisbat.toFixed(1)} barobar) — mahsulot ${cheklovchi} bilan cheklandi.`;
  } else {
    holat = "togri";
    izoh = "Reagentlar stexiometrik to'g'ri nisbatda quyildi.";
  }

  return {
    holat,
    unum: Number(unum.toFixed(4)),
    nisbat: Number.isFinite(nisbat) ? Number(nisbat.toFixed(3)) : 0,
    togrilikFoizi,
    cheklovchi,
    ortiqchaKalit,
    qoldiq,
    izoh,
  };
}

/** Baho holatiga mos XP koeffitsienti. */
export function xpKoeffitsiyenti(holat) {
  return XP_KOEFFITSIYENTI[holat] ?? 1.0;
}
