// Laboratoriya daftari (jurnal) funksiyalari.
// Nega: talabaning o'tkazgan har bir qadami yozib boriladi va tajriba yakunida
// unga ball emas, balki tushuntiruvchi hisobot beriladi. Nega ball qo'yilmaydi:
// ball serverda tekshirilishi kerak, server esa client'dagi millilitrlarni bilmaydi.

export function jurnalYarat() {
  return {
    yozuvlar: [],
    boshlanganVaqt: Date.now(),
  };
}

// Jurnalga yozuv qo'shish: har safar reagent quyilganda yoki amal bajarilganda
// xronologik tartibda saqlaymiz.
export function yoz(jurnal, yozuv = {}) {
  if (!jurnal) return { yozuvlar: [yozuv] };

  const yangiYozuv = {
    vaqt: yozuv.vaqt ?? Number(((Date.now() - (jurnal.boshlanganVaqt || Date.now())) / 1000).toFixed(1)),
    amal: yozuv.amal || "quyish",
    reagent: yozuv.reagent || "",
    ml: Number((yozuv.ml || 0).toFixed(1)),
    ...yozuv,
  };

  jurnal.yozuvlar.push(yangiYozuv);
  return jurnal;
}

// Jurnal yozuvlari va stexiometriya bahosiga tayangan holda talabaga yakuniy
// o'zbekcha hisobot tayyorlash.
export function hisobot(jurnal, natija = null, nisbatBahosi = null) {
  const yozuvlar = jurnal?.yozuvlar || [];
  const qadamlar = [];
  const ogohlantirishlar = [];

  // Server qaytargan xavfsizlik va ogohlantirishlarni qo'shamiz
  if (natija?.hazards && Array.isArray(natija.hazards)) {
    ogohlantirishlar.push(...natija.hazards);
  }

  // Stexiometriya holatiga ko'ra o'quv tavsiyasini shakllantirish
  const holat = nisbatBahosi?.holat || "togri";
  const togrilikFoizi = nisbatBahosi?.togrilikFoizi || 1.0;

  yozuvlar.forEach((yozuv, index) => {
    const qadamRaqami = index + 1;
    const ml = yozuv.ml || 0;
    const reagent = yozuv.reagent || "Modda";

    if (yozuv.amal === "quyish") {
      let tushuntirish = `${qadamRaqami}-qadam. Siz ${ml} ml ${reagent} quydingiz.`;

      // Agar shu reagent nisbatni buzgan bo'lsa, sababni tushuntiramiz
      if (holat === "ortiqcha" || holat === "keskin-ortiqcha") {
        tushuntirish += ` ${nisbatBahosi?.izoh || ""}`;
      } else if (holat === "chala" && index === yozuvlar.length - 1) {
        tushuntirish += ` Ushbu miqdor to'liq reaksiya uchun kamlik qildi (${Math.round(togrilikFoizi * 100)}%).`;
      }

      qadamlar.push({
        raqam: qadamRaqami,
        matn: tushuntirish,
        xato: holat !== "togri" && index === yozuvlar.length - 1,
      });
    } else {
      qadamlar.push({
        raqam: qadamRaqami,
        matn: `${qadamRaqami}-qadam. ${yozuv.amal} amali bajarildi.`,
        xato: false,
      });
    }
  });

  // Agar jurnalda hechnarsa yozilmagan bo'lsa
  if (qadamlar.length === 0) {
    qadamlar.push({
      raqam: 1,
      matn: "1-qadam. Reagentlar qo'shilmadi.",
      xato: true,
    });
  }

  // Umumiy xulosa shakllantirish
  let xulosa = "";
  if (natija?.name) {
    xulosa = `${natija.name} tajribasi o'tkazildi. `;
  } else {
    xulosa = "Tajriba amalga oshirildi. ";
  }

  if (natija?.observations) {
    xulosa += `Kuzatuv: ${natija.observations} `;
  }

  xulosa += `Nisbat xulosasi: ${nisbatBahosi?.izoh || "To'g'ri nisbat."}`;

  if (holat === "chala") {
    ogohlantirishlar.push("Reaksiya to'liq ketishi uchun cheklovchi reagentdan ko'proq quying.");
  }

  return {
    qadamlar,
    xulosa,
    ogohlantirishlar,
  };
}