// app/laboratoriya/3d/lib/mashgulot-kuzatuvi.js
//
// Amaliy mashg'ulot qadamlarini HAQIQIY AMALDAN belgilaydi.
//
// MUAMMO. `AmaliyMashgulotModal` da qadamlar qo'lda bosib
// belgilanardi: o'quvchi hech narsa qilmasdan hammasini "bajarildi"
// deb ura olardi va modal yopilganda hammasi yo'qolardi. Ya'ni
// ro'yxat tekshiruv emas, bezak edi.
//
// Endi qadam faqat mos AMAL sodir bo'lganda belgilanadi.
//
// BU XAVFSIZLIK EMAS, ANIQLIK. Ball, XP va tanga baribir SERVERDA
// hisoblanadi (`lib/tajriba.js`, AGENTS.md 2-band). Bu modul faqat
// "o'quvchi qayerda turibdi" degan savolga javob beradi.

/**
 * Amal yozuvi ikki turda bo'ladi:
 *
 *   { turi: "quyish", kalit: "NaOH", ml: 12 }   — reagent quyildi
 *   { turi: "amal",   kalit: "isitish" }        — harakat bajarildi
 *
 * `kalit` mashg'ulot qadamidagi `kalit` bilan solishtiriladi.
 * Mashg'ulotlarda u uch xil ma'noda ishlatilgan (reagent, jihoz,
 * harakat) — shuning uchun moslashtirish ham uch yo'l bilan boradi.
 */

const ENG_KOP_AMAL = 200;

/** Yangi amalni ro'yxatga qo'shadi (eski ro'yxat o'zgarmaydi). */
export function amalQoshi(amallar, amal) {
  if (!amal || !amal.kalit) return amallar;
  const yangi = [...amallar, { ...amal, vaqt: Date.now() }];
  // Ro'yxat cheksiz o'smasin: uzoq sessiyada u faqat xotira yeydi.
  return yangi.length > ENG_KOP_AMAL ? yangi.slice(-ENG_KOP_AMAL) : yangi;
}

/**
 * Bitta qadam bajarilganmi.
 *
 * Quyish qadamida `minMl` bo'lsa, JAMI quyilgan miqdor hisoblanadi —
 * o'quvchi 10 ml ni ikki marta 5 ml qilib quysa ham qadam bajariladi.
 * Bir marta 10 ml quyishni talab qilish sun'iy qattiqlik bo'lardi.
 */
export function qadamBajarildimi(qadam, amallar = []) {
  if (!qadam?.kalit) return false;

  const jamiQuyilgan = amallar
    .filter((a) => a.turi === "quyish" && a.kalit === qadam.kalit)
    .reduce((y, a) => y + (Number(a.ml) || 0), 0);

  if (jamiQuyilgan > 0) {
    const kerak = Number(qadam.minMl) || 0;
    return jamiQuyilgan >= kerak;
  }

  return amallar.some((a) => a.turi === "amal" && a.kalit === qadam.kalit);
}

/** Butun mashg'ulot uchun `{ qadamId: true }` xaritasi. */
export function bajarilganlar(mashgulot, amallar = []) {
  const natija = {};
  for (const q of mashgulot?.qadamlar || []) {
    if (qadamBajarildimi(q, amallar)) natija[q.id] = true;
  }
  return natija;
}

/**
 * Hali bajarilmagan BIRINCHI qadam — "endi nima qilay" javobi.
 *
 * G5 (hamroh robot) kelganda aynan shu funksiya uning gapini
 * belgilaydi: robot navbatdagi qadamning `matn` va `kutilganNatija`
 * sini aytadi. Shuning uchun u alohida eksport qilinadi.
 */
export function keyingiQadam(mashgulot, amallar = []) {
  return (mashgulot?.qadamlar || []).find((q) => !qadamBajarildimi(q, amallar)) || null;
}

// ---- SUN'IY SINOV ----
//
// Moslashtirish mantig'i brauzersiz sinaladi. Dinamik rezolyutsiyada
// bu yondashuv ikkita nuqsonni GPU ga yetmasdan topgan edi.

export function kuzatuvSinovi() {
  const mashgulot = {
    qadamlar: [
      { id: 1, matn: "Ko'zoynak", kalit: "kozoynak" },
      { id: 2, matn: "CuSO₄ quy", kalit: "CuSO₄", minMl: 15 },
      { id: 3, matn: "NaOH quy", kalit: "NaOH", minMl: 10 },
      { id: 4, matn: "Isit", kalit: "isitish" },
    ],
  };
  const sinovlar = [];
  const q = (n) => mashgulot.qadamlar[n - 1];

  // 1. Bo'sh ro'yxatda hech narsa bajarilmagan.
  sinovlar.push({
    nom: "bosh",
    izoh: "amal yo'q => hech qaysi qadam bajarilmagan",
    kutilgan: 0,
    olingan: Object.keys(bajarilganlar(mashgulot, [])).length,
    otdi: Object.keys(bajarilganlar(mashgulot, [])).length === 0,
  });

  // 2. Yetarsiz hajm qadamni bajarmaydi.
  {
    const a = [{ turi: "quyish", kalit: "CuSO₄", ml: 5 }];
    sinovlar.push({
      nom: "hajm_yetarsiz",
      izoh: "15 ml kerak, 5 ml quyildi => bajarilmagan",
      kutilgan: false,
      olingan: qadamBajarildimi(q(2), a),
      otdi: qadamBajarildimi(q(2), a) === false,
    });
  }

  // 3. Bir necha marta quyish JAMLANADI.
  {
    const a = [
      { turi: "quyish", kalit: "CuSO₄", ml: 8 },
      { turi: "quyish", kalit: "CuSO₄", ml: 9 },
    ];
    sinovlar.push({
      nom: "hajm_jamlanadi",
      izoh: "8 + 9 = 17 >= 15 => bajarildi",
      kutilgan: true,
      olingan: qadamBajarildimi(q(2), a),
      otdi: qadamBajarildimi(q(2), a) === true,
    });
  }

  // 4. Boshqa reagent qadamni bajarmaydi.
  {
    const a = [{ turi: "quyish", kalit: "NaOH", ml: 50 }];
    sinovlar.push({
      nom: "boshqa_reagent",
      izoh: "NaOH quyildi, CuSO₄ qadami bajarilmasin",
      kutilgan: false,
      olingan: qadamBajarildimi(q(2), a),
      otdi: qadamBajarildimi(q(2), a) === false,
    });
  }

  // 5. Harakat turidagi qadam.
  {
    const a = [{ turi: "amal", kalit: "isitish" }];
    sinovlar.push({
      nom: "harakat",
      izoh: "isitish amali => qadam bajarildi",
      kutilgan: true,
      olingan: qadamBajarildimi(q(4), a),
      otdi: qadamBajarildimi(q(4), a) === true,
    });
  }

  // 6. Tartib MUHIM EMAS — o'quvchi erkin ishlaydi.
  {
    const a = [
      { turi: "amal", kalit: "isitish" },
      { turi: "amal", kalit: "kozoynak" },
    ];
    const b = bajarilganlar(mashgulot, a);
    sinovlar.push({
      nom: "tartib_erkin",
      izoh: "teskari tartibda bajarilgan ikki qadam ham hisoblanadi",
      kutilgan: 2,
      olingan: Object.keys(b).length,
      otdi: Object.keys(b).length === 2,
    });
  }

  // 7. Keyingi qadam to'g'ri topiladi.
  {
    const a = [{ turi: "amal", kalit: "kozoynak" }];
    const k = keyingiQadam(mashgulot, a);
    sinovlar.push({
      nom: "keyingi_qadam",
      izoh: "1-qadam bajarilgan => keyingisi 2-qadam",
      kutilgan: 2,
      olingan: k?.id ?? null,
      otdi: k?.id === 2,
    });
  }

  // 8. Ro'yxat cheksiz o'smaydi.
  {
    let a = [];
    for (let i = 0; i < ENG_KOP_AMAL + 50; i += 1) {
      a = amalQoshi(a, { turi: "amal", kalit: `x${i}` });
    }
    sinovlar.push({
      nom: "royxat_cheklangan",
      izoh: `${ENG_KOP_AMAL + 50} amal qo'shildi => ${ENG_KOP_AMAL} saqlanadi`,
      kutilgan: ENG_KOP_AMAL,
      olingan: a.length,
      otdi: a.length === ENG_KOP_AMAL,
    });
  }

  return {
    jami: sinovlar.length,
    yiqilgan: sinovlar.filter((s) => !s.otdi).length,
    sinovlar,
  };
}
