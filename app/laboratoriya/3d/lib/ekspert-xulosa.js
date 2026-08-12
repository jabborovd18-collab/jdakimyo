// app/laboratoriya/3d/lib/ekspert-xulosa.js
//
// 5-BOSQICH: Ilmiy Ekspert Xulosasi (Post-Factum tahlil).
//
// Reaksiya tugagach yoki idish bo'shatilganda talabaga nima uchun reaksiya
// shunday borgani, nima kam/ortiqcha bo'lgani, cheklovchi reagent va
// kinetika bo'yicha chuqur ilmiy xulosa chiqaradi.
//

/**
 * Reaksiya natijasi bo'yicha to'liq post-factum ekspert xulosasini shakllantiradi.
 *
 * @param {object} p
 * @param {object} p.reaksiya     - Reaksiya obyekti
 * @param {object} p.nisbat       - Stexiometriya bahosi
 * @param {object} p.kinetika     - Harorat va unum tahlili
 * @param {Array}  p.jurnal       - Jurnal yozuvlari
 */
export function ekspertXulosasiniTuz({
  reaksiya,
  nisbat,
  kinetika,
  jurnal = [],
}) {
  const tenglama = reaksiya?.equation || "Noma'lum tenglama";
  const nomi = reaksiya?.name || "Kimyoviy jarayon";
  const kuzatuv = reaksiya?.observations || "Vizual o'zgarishlar qayd etildi.";

  const unum = kinetika?.unumFoizi || 90.0;
  const T = kinetika?.harorat || 25;
  const holat = nisbat?.holat || "togri";

  // 1. Cheklovchi reagent tahlili
  let cheklovchiReagentIzohi = "Reagentlar stexiometrik me'yorga juda yaqin mutanosiblikda qo'shildi.";
  if (holat === "chala") {
    cheklovchiReagentIzohi = "Reagentlardan biri yetishmadi (cheklovchi reagent). Reaksiya to'liq hajmda ketmadi va hosil bo'lgan mahsulot miqdori kamaydi.";
  } else if (holat === "ortiqcha" || holat === "keskin-ortiqcha") {
    cheklovchiReagentIzohi = "Reagentlardan biri haddan tashqari ko'p quyildi (ortiqcha reagent). Natijada u reaksiyaga kirmay eritmada erigan holda qoldi yoki cho'kmaning qayta erishiga sabab bo'ldi.";
  }

  // 2. Harorat va Kinetik ta'sir
  let haroratIzohi = `Reaksiya xona haroratida (${T}°C) amalga oshirildi. Tezlik standart kinetika doirasida.`;
  if (T >= 65) {
    haroratIzohi = `Spirtovkada qizdirish (${T}°C) tufayli faollashuv energiyasi to'sig'i tez yengildi. Vant-Goff qoidasiga ko'ra reaksiya ${kinetika?.haroratTezligiKoef || 4.0} barobar tezroq kechdi.`;
  } else if (T < 20) {
    haroratIzohi = `Past harorat (${T}°C) sababli zarrachalarning kinetik energiyasi sekinlashdi.`;
  }

  // 3. Pedagogik tavsiyalar
  const tavsiyalar = [];
  if (unum < 80) {
    tavsiyalar.push("Reaksiya unumini oshirish uchun reagentlarni tarozida yoki o'lchov kolbasida aniqroq hajmda tayyorlang.");
  }
  if (holat !== "togri") {
    tavsiyalar.push(nisbat?.izoh || "Stexiometriya qoidalariga rioya qiling.");
  }
  if (reaksiya?.hazards?.length > 0) {
    tavsiyalar.push("Xavfsizlik qoidalariga rioya qiling: " + reaksiya.hazards.join(", "));
  }
  if (tavsiyalar.length === 0) {
    tavsiyalar.push("A'lo natija! Reagentlar nisbati va harorat sharoiti mukammal tanlangan.");
  }

  return {
    nomi,
    tenglama,
    kuzatuv,
    unumFoizi: unum,
    harorat: T,
    cheklovchiReagentIzohi,
    haroratIzohi,
    tavsiyalar,
    jurnalQadamlari: (jurnal || []).map((j, i) => ({
      qadam: i + 1,
      amal: j.amal || "amaliyot",
      reagent: j.reagent || "Modda",
      ml: j.ml || 0,
    })),
  };
}
