import { NISBAT_CHEGARALARI } from "./sozlama.js";

// Stexiometrik nisbatni baholash: API dan kelgan reaksiya koeffitsientlari (koeflar)
// va idishdagi reagentlarning mol miqdori asosida reaksiyaning to'g'rilik holatini aniqlaydi.
// Nega: talaba moddani ortiqcha yoki kam quyganida reaksiyaning vizual va mantiqiy o'zgarishini
// hisoblab beramiz, shunda u xatodan o'rganadi.
export function nisbatniBaho(holat, koeflar = [], sozlama = NISBAT_CHEGARALARI) {
  if (!koeflar || koeflar.length === 0) {
    return {
      holat: "togri",
      cheklovchi: null,
      qoldiq: {},
      togrilikFoizi: 1.0,
      izoh: "Reaksiya uchun maxsus nisbat talab etilmaydi.",
    };
  }

  // Har bir reagent uchun normalizatsiya qilingan miqdor (mol / koef) hisoblanadi.
  // Nega: 1 mol CuSO4 va 2 mol NaOH kerak bo'lganda, mol/koef nisbati eng kichigi reaksiyani
  // cheklovchi modda (limiting reagent) bo'ladi.
  const normlar = {};
  let engKichikNorm = Infinity;
  let engKattaNorm = -1;
  let cheklovchiKaliti = null;
  let ortiqchaKaliti = null;

  koeflar.forEach((item) => {
    const kalit = item.kalit;
    const koef = item.koef || 1;
    const mol = holat?.moddalar?.[kalit]?.mol || 0;
    const norm = mol / koef;

    normlar[kalit] = norm;

    if (norm < engKichikNorm) {
      engKichikNorm = norm;
      cheklovchiKaliti = kalit;
    }
    if (norm > engKattaNorm) {
      engKattaNorm = norm;
      ortiqchaKaliti = kalit;
    }
  });

  if (engKichikNorm === Infinity || engKattaNorm <= 0) {
    return {
      holat: "chala",
      cheklovchi: koeflar[0]?.kalit || null,
      qoldiq: {},
      togrilikFoizi: 0,
      izoh: "Reaksiya uchun reagentlar quyilmadi yoki juda kam.",
    };
  }

  // Qoldiq (ortiqcha qolgan mol miqdori) hisoblanadi: har bir reagentning molidan
  // cheklovchi modda sarf qiladigan qismi ayriladi.
  const qoldiq = {};
  koeflar.forEach((item) => {
    const kalit = item.kalit;
    const koef = item.koef || 1;
    const mol = holat?.moddalar?.[kalit]?.mol || 0;
    const sarflanganMol = engKichikNorm * koef;
    const qoldiqMol = Math.max(0, mol - sarflanganMol);
    if (qoldiqMol > 0.000001) {
      qoldiq[kalit] = Number(qoldiqMol.toFixed(6));
    }
  });

  const maxBarobar = engKichikNorm > 0 ? engKattaNorm / engKichikNorm : Infinity;
  const togrilikFoizi = engKattaNorm > 0 ? Number((engKichikNorm / engKattaNorm).toFixed(2)) : 0;

  let holatNomi = "togri";
  let izoh = "Reagentlar stexiometrik to'g'ri nisbatda quyildi.";

  // Holatni chegara qiymatlari bo'yicha aniqlash:
  // Keskin ortiqcha va ortiqcha holatlar o'quvchi ko'proq modda quyganida hisobotda
  // sababni ochiq ko'rsatadi.
  if (maxBarobar >= sozlama.keskin) {
    holatNomi = "keskin-ortiqcha";
    izoh = `${ortiqchaKaliti || "Reagent"} kerakli nisbatdan ${maxBarobar.toFixed(1)} barobar ko'p quyildi, mahsulot o'zgarishi mumkin.`;
  } else if (maxBarobar >= sozlama.ortiqcha) {
    holatNomi = "ortiqcha";
    izoh = `${ortiqchaKaliti || "Reagent"} ${maxBarobar.toFixed(1)} barobar ortiqcha quyildi.`;
  } else if (engKichikNorm === 0 || togrilikFoizi < sozlama.chala) {
    holatNomi = "chala";
    izoh = `${cheklovchiKaliti || "Reagent"} yetarli miqdorda quyilmadi, reaksiya chala qoldi.`;
  } else {
    holatNomi = "togri";
    izoh = "Reagentlar stexiometrik to'g'ri nisbatda quyildi.";
  }

  return {
    holat: holatNomi,
    cheklovchi: cheklovchiKaliti,
    qoldiq,
    togrilikFoizi,
    izoh,
  };
}