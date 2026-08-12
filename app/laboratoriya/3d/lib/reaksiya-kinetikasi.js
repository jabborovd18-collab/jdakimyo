// app/laboratoriya/3d/lib/reaksiya-kinetikasi.js
//
// 3-BOSQICH: Kimyoviy kinetika, harorat ta'siri, unum foizi (Yield %) va kutilmagan holatlar dvigateli.
//
// Kimyoviy qoidalar:
//   1. Vant-Goff qoidasi: v2 = v1 * gamma^((T2 - T1) / 10), gamma = 2..4
//   2. Eruvchanlik ko'paytmasi (K_sp): konsentratsiya K_sp dan past bo'lsa cho'kma tushmaydi
//   3. Cheklovchi reagent (Limiting reagent) va unum foizi (Yield %): eta = (m_amaliy / m_nazariy) * 100%
//
import { molyarMassaHisobla } from "@/lib/masala-dvigatel.js";

/** Haroratga sezgir reaksiyalar chegaralari (°C) */
export const HARORAT_SHAROITLARI = {
  xona: 25,
  iliq: 45,
  qizdirish: 65,
  qaynash: 95,
};

/**
 * Reaksiya kinetikasi, tezligi, unum foizi va kutilmagan holatlarni hisoblaydi.
 *
 * @param {object} p
 * @param {object} p.reaksiya      - Reaksiya obyekti (equation, name, hazards, etc.)
 * @param {object} p.moddalar      - Idishdagi moddalar holati ({ [kalit]: { ml, mol } })
 * @param {number} p.harorat       - Joriy idish harorati (°C)
 * @param {object} p.nisbatBahosi  - Stexiometrik nisbat bahosi ({ holat, farq, koef })
 */
export function kinetikaniBaho({
  reaksiya,
  moddalar = {},
  harorat = 25,
  nisbatBahosi = null,
}) {
  const T = Math.max(10, Math.min(120, Number(harorat) || 25));
  const holatNisbat = nisbatBahosi?.holat || "togri";

  // 1. Vant-Goff qoidasi bo'yicha harorat koeffitsiyenti (gamma = 2.5)
  const deltaT = T - 20;
  const haroratTezligiKoef = Math.max(0.5, Math.min(16.0, Math.pow(2.5, deltaT / 10)));

  // 2. Moddalar konsentratsiyasini tahlil qilish
  let jamiMol = 0;
  let jamiMl = 0;
  const moddaRoyxati = Object.entries(moddalar);

  moddaRoyxati.forEach(([, m]) => {
    jamiMol += m?.mol || 0;
    jamiMl += m?.ml || 0;
  });

  const ortachaKonsentratsiya = jamiMl > 0 ? (jamiMol / (jamiMl / 1000)) : 0.5;

  // 3. Eruvchanlik va konsentratsiya chegarasi (K_sp)
  let chokmaHosilBoladimi = true;
  let chokmaIzohi = null;

  if (ortachaKonsentratsiya < 0.008) {
    chokmaHosilBoladimi = false;
    chokmaIzohi = "Eritma juda suyultirilgan (C_M < 0.01 M). Ionlar ko'paytmasi eruvchanlik ko'paytmasi (K_sp) dan kichik bo'lgani uchun cho'kma hosil bo'lmadi.";
  }

  // 4. Kutilmagan holatlarni aniqlash
  const kutilmaganHolatlar = [];

  // Qaynash va toshish
  if (T >= HARORAT_SHAROITLARI.qaynash) {
    kutilmaganHolatlar.push({
      turi: "qaynash_toshish",
      nom: "Shiddatli qaynash va bug'lanish",
      matn: `Harorat ${T}°C ga yetdi. Eritma qaynadi va shiddatli bug' ajraldi.`,
    });
  }

  // Termik parchalanish (masalan qizdirilganda)
  if (T >= HARORAT_SHAROITLARI.qizdirish && reaksiya?.name?.toLowerCase().includes("parchalanish")) {
    kutilmaganHolatlar.push({
      turi: "termik_faollashuv",
      nom: "Termik parchalanish faollashdi",
      matn: `Qizdirish (${T}°C) natijasida moddaning termik parchalanishi to'liq amalga oshdi.`,
    });
  }

  // Kislotaga tez suv quyilishi / shiddatli qizish
  if (holatNisbat === "keskin-ortiqcha") {
    kutilmaganHolatlar.push({
      turi: "stexiometrik_nomutanosiblik",
      nom: "Reagentlarning haddan tashqari ortiqchaligi",
      matn: "Reagentlardan biri stexiometrik me'yordan ancha ko'p quyildi. Natijada qo'shimcha yon reaksiyalar yoki cho'kmaning erishi kuzatiladi.",
    });
  }

  // 5. Reaksiya unumi (Yield %) hisoblash
  // Asosiy omillar: stexiometriya aniqligi (0.5..1.0) va optimal harorat (0.8..1.0)
  let unumKoef = 0.95; // Ideal unum 95%

  if (holatNisbat === "togri") {
    unumKoef = 0.94 + Math.random() * 0.05; // 94% - 99%
  } else if (holatNisbat === "ortiqcha") {
    unumKoef = 0.78 + Math.random() * 0.08; // 78% - 86%
  } else if (holatNisbat === "chala") {
    unumKoef = 0.52 + Math.random() * 0.12; // 52% - 64%
  } else {
    unumKoef = 0.35 + Math.random() * 0.15; // 35% - 50%
  }

  // Harorat juda past bo'lsa unum kamayadi
  if (T < 20) {
    unumKoef *= 0.8;
  }

  const unumFoizi = Math.min(99.5, Math.max(15.0, Number((unumKoef * 100).toFixed(1))));

  // Nazariy va amaliy massa hisobi
  const nazariyMassa = Number((jamiMol * 85.0).toFixed(2));
  const amaliyMassa = Number(((nazariyMassa * unumFoizi) / 100).toFixed(2));

  return {
    harorat: T,
    haroratTezligiKoef: Number(haroratTezligiKoef.toFixed(2)),
    ortachaKonsentratsiya: Number(ortachaKonsentratsiya.toFixed(4)),
    chokmaHosilBoladimi,
    chokmaIzohi,
    kutilmaganHolatlar,
    unumFoizi,
    nazariyMassa,
    amaliyMassa,
  };
}
