// Kuzatuv matnini (observations) vizual 3D effektlar massiviga aylantirish funksiyalari.
// Nega: server faqat o'zbek tilidagi matn ("och ko'k cho'kma tushadi") qaytaradi,
// biz uni tahlil qilib, 3D sahnada qanday zarra va ranglar o'ynashini belgilaymiz.
//
// Rang lug'ati bu yerda emas, `rang-jadvali.js` da: ilgari bu faylda o'z
// ro'yxati bor edi va u modda jadvalidan mustaqil edi — matndan chiqqan
// "sariq" bilan K₂CrO₄ ning sarig'i har xil qiymat olardi.

import { KUZATUV_RANGLARI, PALITRA, EFFEKT_RANGLARI } from "./rang-jadvali.js";
import { chokmaRangi } from "./modda-korinishi.js";

// O'zbek tilidagi apostroflar har xil yozilishi mumkin (' ‘ ’ `). Barchasini bitta ' ga
// keltirib, kichik harfga o'tkazish orqali qidiruv barqarorligini ta'minlaymiz.
function matnniTozala(matn = "") {
  return String(matn)
    .toLowerCase()
    .replace(/['‘’`´]/g, "'");
}

// Stexiometriya holatiga qarab effekt kuchini hisoblash: chala yoki keskin ortiqcha bo'lsa
// cho'kma va pufakchalar kamroq yoki yupqaroq ko'rinadi.
function hisoblaKuch(nisbatBahosi) {
  const holat = nisbatBahosi?.holat || "togri";
  switch (holat) {
    case "chala":
      return 0.3;
    case "togri":
      return 1.0;
    case "ortiqcha":
      return 0.7;
    case "keskin-ortiqcha":
      return 0.4;
    default:
      return 1.0;
  }
}

// Matn ichidan rang so'zini aniqlash: eng birinchi topilgan mos rangni qaytaradi.
// KUZATUV_RANGLARI aniqroq iboradan umumiyga qarab tartiblangan, shuning uchun
// "to'q sariq" "sariq" dan oldin topiladi.
function rangniTop(matn, standartRang = PALITRA.oq) {
  for (const [sozi, rang] of KUZATUV_RANGLARI) {
    if (matn.includes(sozi)) return rang;
  }
  return standartRang;
}

// Matnda umuman rang so'zi bor-yo'qligi. Cho'kma rangini tanlashda kerak:
// matn rang aytmasa, mahsulotning haqiqiy rangi ishonchliroq.
function matndaRangBormi(matn) {
  return KUZATUV_RANGLARI.some(([sozi]) => matn.includes(sozi));
}

/**
 * @param {string} observations — serverdan kelgan kuzatuv matni
 * @param {object|null} nisbatBahosi — stexiometriya bahosi (effekt kuchi)
 * @param {Array<{kalit: string}>} mahsulotlar — serverdan kelgan `olindi`
 */
export function effektlarniAniqla(observations = "", nisbatBahosi = null, mahsulotlar = []) {
  const matn = matnniTozala(observations);
  const kuch = hisoblaKuch(nisbatBahosi);
  const topilganRang = rangniTop(matn, PALITRA.oq);
  const effektlar = [];

  // Cho'kma effekti
  if (
    matn.includes("cho'kma") ||
    matn.includes("cho'kadi") ||
    matn.includes("jelesimon")
  ) {
    // Matnda rang aytilgan bo'lsa o'shanisi ustun: kuzatuv aynan shu
    // reaksiyaniki. Aytilmagan bo'lsa ("cho'kma hosil bo'ladi") mahsulotning
    // o'z rangi olinadi — aks holda Cu(OH)₂ ham, Fe(OH)₃ ham oppoq tushardi.
    const chokmaRang = matndaRangBormi(matn)
      ? topilganRang
      : chokmaRangi(mahsulotlar) ?? PALITRA.oq;

    effektlar.push({
      turi: "chokma",
      rang: chokmaRang,
      kuch,
      kechikish: 0.4,
    });
  }

  // Gaz pufakchalari effekti
  if (
    matn.includes("gaz") ||
    matn.includes("pufakcha") ||
    matn.includes("ajraladi") ||
    matn.includes("ko'pik")
  ) {
    effektlar.push({
      turi: "pufak",
      rang: EFFEKT_RANGLARI.pufak,
      kuch,
      kechikish: 0.1,
    });
  }

  // Bug' yoki hovur
  if (matn.includes("bug'") || matn.includes("hovur")) {
    effektlar.push({
      turi: "bug",
      rang: EFFEKT_RANGLARI.bug,
      kuch,
      kechikish: 0.2,
    });
  }

  // Hid to'lqini
  if (matn.includes("hid")) {
    effektlar.push({
      turi: "hid",
      rang: EFFEKT_RANGLARI.hid,
      kuch: Math.min(1, kuch * 0.8),
      kechikish: 0.5,
    });
  }

  // Qizish / issiqlik ajralishi
  if (
    matn.includes("issiqlik") ||
    matn.includes("qiziydi") ||
    matn.includes("isiydi")
  ) {
    effektlar.push({
      turi: "qizish",
      rang: EFFEKT_RANGLARI.qizish,
      kuch,
      kechikish: 0.3,
    });
  }

  // Alanga
  if (
    matn.includes("alanga") ||
    matn.includes("yonadi") ||
    matn.includes("shiddatli")
  ) {
    effektlar.push({
      turi: "alanga",
      rang: EFFEKT_RANGLARI.alanga,
      kuch,
      kechikish: 0.0,
    });
  }

  // Loyqalanish
  if (matn.includes("loyqa") || matn.includes("xiralashadi")) {
    effektlar.push({
      turi: "loyqa",
      rang: topilganRang,
      kuch,
      kechikish: 0.2,
    });
  }

  // Tiniqlashish
  if (matn.includes("tiniqlashadi") || matn.includes("rangsizlanadi")) {
    effektlar.push({
      turi: "tiniq",
      rang: EFFEKT_RANGLARI.tiniq,
      kuch,
      kechikish: 0.3,
    });
  }

  // Holat o'zgarishi
  if (matn.includes("eriydi") || matn.includes("qattiqlashadi")) {
    effektlar.push({
      turi: "holat",
      rang: topilganRang,
      kuch,
      kechikish: 0.4,
    });
  }

  // Indikator o'zgarishi
  if (
    matn.includes("lakmus") ||
    matn.includes("fenolftalein") ||
    matn.includes("ph")
  ) {
    effektlar.push({
      turi: "indikator",
      rang: topilganRang,
      kuch,
      kechikish: 0.1,
    });
  }

  // Agar matnda rang o'zgarishi aytilgan bo'lsa — eritmaning o'zi shu rangga o'tadi
  if (matndaRangBormi(matn) && !effektlar.some((e) => e.turi === "rang")) {
    effektlar.push({
      turi: "rang",
      rang: topilganRang,
      kuch,
      kechikish: 0.0,
    });
  }

  // Hech narsa topilmasa bo'sh massiv EMAS: foydalanuvchi tugma bosilganda
  // vizual harakat ko'rishi kerak, aks holda u "tizim ishlamadi" deb o'ylaydi.
  if (effektlar.length === 0) {
    return [
      {
        turi: "aralashish",
        rang: PALITRA.oq,
        kuch: 1.0,
        kechikish: 0.0,
      },
    ];
  }

  // Maksimal 4 ta effekt bilan cheklaymiz: ortiqcha zarrachalar render tezligini tushiradi.
  return effektlar.slice(0, 4);
}