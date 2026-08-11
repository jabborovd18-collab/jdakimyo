// Portlovchi reaksiyalarni aniqlash — SERVER JAVOBIGA qarab.
//
// NEGA QAYTA YOZILDI. Ilgari bu modul kimyoni QO'LDA takrorlardi: o'z
// moddalar ro'yxati, o'z tenglamasi, o'z xavfsizlik matni. Va eng
// yomoni — `korinish.js` da u serverni CHETLAB O'TARDI:
//
//     if (res.portladi) { modalni ko'rsat; idishni tozala }
//     else              { otkaz(...) }   // ← server faqat bu yerda
//
// Ya'ni portlash aniqlansa `/api/laboratoriya/tajriba` umuman
// chaqirilmasdi: reagent sarflanmas, XP berilmas, daftarga yozilmasdi.
// Natijada `2Na + 2H₂O → 2NaOH + H₂↑` — bazadagi HAQIQIY reaksiya, to'liq
// GHS xavf kodlari bilan — o'yindan butunlay chiqib ketgan edi.
//
// Endi tartib teskari: reaksiyani har doim server hal qiladi, portlash
// esa uning natijasini BEZAYDI. Kimyoning o'zi ham shu yerdan emas,
// bazadagi `hazards` maydonidan o'qiladi — ular allaqachon rasmiy GHS
// kodlari bilan yozilgan (H220, H280, H314...).

/**
 * Portlash belgisini bildiruvchi GHS kodlari va so'zlari.
 *
 * H220 — juda tez alangalanuvchi gaz
 * H280 — bosim ostidagi gaz, qizdirilsa portlaydi
 * H241/H242 — qizdirilsa yonadi yoki portlaydi
 */
const PORTLASH_BELGILARI = [
  "h220",
  "h280",
  "h241",
  "h242",
  "portla",
  "shiddatli",
  "tarsilla",
];

/** Portlash uchun kerakli eng past harorat (°C) — undan pastda faqat shovqin */
const HARORAT_CHEGARASI = 80;

function matnniTozala(x) {
  return String(x ?? "")
    .toLowerCase()
    .replace(/['‘’`´]/g, "'");
}

/**
 * Server qaytargan reaksiya portlash bilan boradimi.
 *
 * @param {object|null} reaksiya — serverdan kelgan `natija.reaksiya`
 *        (equation, hazards, name)
 * @param {number} harorat — idishning joriy harorati (spirtovka bilan)
 * @returns {{portladi: boolean, sabab?: string, tenglama?: string,
 *            xavfsizlik?: string[]}}
 */
export function portlashniAniqla(reaksiya, harorat = 25) {
  if (!reaksiya) return { portladi: false };

  const xavflar = Array.isArray(reaksiya.hazards) ? reaksiya.hazards : [];
  if (xavflar.length === 0) return { portladi: false };

  const matn = matnniTozala(xavflar.join(" "));
  const belgilar = PORTLASH_BELGILARI.filter((b) => matn.includes(b));
  if (belgilar.length === 0) return { portladi: false };

  // Bosim ostidagi gaz (H280) va "qizdirilsa portlaydi" turkumi faqat
  // ISITILGANDA portlaydi — xona haroratida ular shunchaki xavfli gaz.
  const faqatIssiqda = belgilar.every((b) => b === "h280" || b === "h241" || b === "h242");
  if (faqatIssiqda && harorat < HARORAT_CHEGARASI) return { portladi: false };

  return {
    portladi: true,
    sabab:
      `${reaksiya.name || "Reaksiya"} shiddatli kechdi — ajralgan gaz ` +
      "va issiqlik idishni ko'tara olmadi.",
    // Tenglama BAZADAN, bu yerda qo'lda yozilmaydi.
    tenglama: reaksiya.equation || null,
    // Xavfsizlik qoidalari ham bazadan: ular rasmiy GHS kodlari bilan.
    xavfsizlik: xavflar,
  };
}
