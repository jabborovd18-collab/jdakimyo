// lib/masala-dvigatel.js
//
// JDA KIMYO — Stexiometrik va Kimyoviy Masalalar Dvigateli (v3.0.0).
// IUPAC 2024 standart atom massalari, qavsli birikmalar tahlili,
// 3 xil yondashuv rejimi ('tuzoq', 'yonalish', 'toliq') va dinamik vizual diagrammalar.

import { azoniOqi, BalansXatosi } from "./chem-balance.js";

// ATOMIK MASSALAR JADVALI (g/mol) — IUPAC 2024
export const ATOM_MASSALAR = {
  H: 1.008,
  He: 4.0026,
  Li: 6.94,
  Be: 9.0122,
  B: 10.81,
  C: 12.011,
  N: 14.007,
  O: 15.999,
  F: 18.998,
  Ne: 20.18,
  Na: 22.99,
  Mg: 24.305,
  Al: 26.982,
  Si: 28.085,
  P: 30.974,
  S: 32.06,
  Cl: 35.45,
  Ar: 39.948,
  K: 39.098,
  Ca: 40.078,
  Sc: 44.956,
  Ti: 47.867,
  V: 50.942,
  Cr: 51.996,
  Mn: 54.938,
  Fe: 55.845,
  Co: 58.933,
  Ni: 58.693,
  Cu: 63.546,
  Zn: 65.38,
  Ga: 69.723,
  Ge: 72.63,
  As: 74.922,
  Se: 78.971,
  Br: 79.904,
  Kr: 83.798,
  Rb: 85.468,
  Sr: 87.62,
  Ag: 107.87,
  Cd: 112.41,
  In: 114.82,
  Sn: 118.71,
  Sb: 121.76,
  I: 126.9,
  Ba: 137.33,
  Au: 196.97,
  Hg: 200.59,
  Pb: 207.2,
  Ru: 101.07,
  Pt: 195.084,
};

/**
 * Murakkab qavsli, indeksli va kristallogidrat birikmalarining molyar massasini hisoblash.
 */
export function molyarMassaHisobla(formula = "") {
  if (!formula || !formula.trim()) return 0;
  try {
    const parsed = azoniOqi(formula.trim());
    let umumiyMassa = 0;
    for (const [elem, count] of Object.entries(parsed.atomlar || {})) {
      const atomMass = ATOM_MASSALAR[elem] || 0;
      umumiyMassa += atomMass * count;
    }
    return Math.round(umumiyMassa * 1000) / 1000;
  } catch (err) {
    return 0;
  }
}

/**
 * Masala matnidan kimyoviy formulalar, fizik kattaliklar va sonli parametrlarni ajratib olish.
 */
export function masalaMatniniTahlilQil(matn = "") {
  const formulalar = [];
  const miqdorlar = [];

  // Kimyoviy formulalarni topish regexi
  const formulaRegex = /\b([A-Z][a-z]?[0-9₀₁₂₃₄₅₆₇₈₉]*)+(\([A-Z][a-z]?[0-9₀₁₂₃₄₅₆₇₈₉]*\)[0-9₀₁₂₃₄₅₆₇₈₉]*)?(\*[0-9]*H[0-9]*O|·[0-9]*H[0-9]*O)?\b/g;
  let match;
  while ((match = formulaRegex.exec(matn)) !== null) {
    const f = match[0];
    const bekorSozlar = ["Va", "Bu", "Ha", "Yo", "Agar", "Deb", "Tuz", "Suv", "Toping", "Necha", "Hosil", "Qancha"];
    if (f.length >= 2 && !bekorSozlar.includes(f)) {
      if (!formulalar.includes(f)) {
        formulalar.push(f);
      }
    }
  }

  // Sonli qiymatlar va birliklarni ajratish
  const miqdorRegex = /(\d+(?:\.\d+)?)\s*(g\/ml|g\/sm3|g|gramm|kg|mol|ml|l|litr|%|kj|kdj|gradus|c|molar|m)\b/gi;
  while ((match = miqdorRegex.exec(matn)) !== null) {
    miqdorlar.push({
      qiymat: parseFloat(match[1]),
      birlik: match[2].toLowerCase(),
    });
  }

  return { formulalar, miqdorlar };
}

/**
 * Masalaning kimyoviy yo'nalishini aniqlash.
 */
export function masalaTuriniAniqla(matn = "") {
  const m = matn.toLowerCase();
  if (m.includes("kristallogidrat") || m.includes("·") || m.includes("*h2o") || m.includes("kristall")) return "kristallogidrat";
  if (m.includes("eritma") || m.includes("massaviy ulush") || m.includes("%") || m.includes("suyultir") || m.includes("molar")) return "eritmalar";
  if (m.includes("gaz") || m.includes("litr") || m.includes("normal sharoit") || m.includes("n.sh") || m.includes("zichlik")) return "gazlar";
  if (m.includes("elektroliz") || m.includes("katod") || m.includes("anod") || m.includes("tok")) return "elektroliz";
  if (m.includes("issiqlik") || m.includes("kj") || m.includes("entalpiya") || m.includes("termokimyo")) return "termokimyo";
  if (m.includes("ph") || m.includes("poh") || m.includes("vodorod ko'rsatkich")) return "ph";
  if (m.includes("proton") || m.includes("neytron") || m.includes("elektron") || m.includes("molekula massasi") || m.includes("avogadro")) return "atom";
  return "stexiometriya";
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. ERITMALAR VA MASSAVIY ULUSH HISOBI
// ─────────────────────────────────────────────────────────────────────────────
export function yechEritmalar(matn, tahlil, rejim = "toliq") {
  const { formulalar, miqdorlar } = tahlil;
  const modda = formulalar[0] || "CuSO₄";

  const grammlar = miqdorlar.filter((m) => ["g", "gramm"].includes(m.birlik));
  const foizlar = miqdorlar.filter((m) => m.birlik === "%");

  const m1 = grammlar[0]?.qiymat || 200;
  const w1 = foizlar[0]?.qiymat || 15;
  const m2 = grammlar[1]?.qiymat || 50; // qo'shilgan suv yoki 2-eritma
  const w2 = foizlar[1]?.qiymat || 0;

  // Ikki eritma aralashtirilishi yoki suv qo'shilishi
  const mErigan1 = (m1 * w1) / 100;
  const mErigan2 = (m2 * w2) / 100;
  const jamiErigan = mErigan1 + mErigan2;
  const jamiEritma = m1 + m2;
  const wYangi = jamiEritma > 0 ? Number(((jamiErigan / jamiEritma) * 100).toFixed(2)) : w1;

  // Krest qoidasi vizualizatsiyasi uchun ma'lumot
  const vizualSxema = {
    turi: "krest",
    nomi: "Pearson Diagonal Kresti (Eritmalar aralashmasi)",
    w1,
    w2,
    w_maqsad: wYangi,
    m1,
    m2,
    jamiMassa: jamiEritma,
  };

  // 1-REJIM: TUZOQ VA KESKIN BURILISH
  if (rejim === "tuzoq") {
    return {
      rejim: "tuzoq",
      tenglama: `m₁(eritma) = ${m1}g (${w1}%) + m₂(suv) = ${m2}g ➔ Yangi eritma`,
      tuzoqTahlili: {
        kalitNuqta: "Eritmaga sof suv qo'shilganda erigan modda massasi o'zgarmaydi, faqat eritmaning umumiy massasi ortadi.",
        nimaUchunMuhim: "Ko'pchilik o'quvchilar xatolik bilan qo'shilgan suvni erigan moddaga ham qo'shib yuborishadi yoki foizlarni oddiy arifmetik qo'shib (15% + 0% = ?) adashishadi.",
        kengTarqalganXato: "Erigan modda massasini yangi umumiy massaga nisbatlash o'rniga, dastlabki massaga bo'lish.",
      },
      bosqichlar: [
        {
          sarlavha: "⚡ Keskin Burilish Nuqtasi:",
          matn: `Dastlabki erigan ${modda} massasi: m(modda) = ${m1} × ${w1}% = ${mErigan1} g.\nSuv qo'shilgach eritma massasi m(jami) = ${m1} + ${m2} = ${jamiEritma} g ga aylanadi. Modda massasi esa aynan ${mErigan1} g ligicha qoladi!`,
        },
      ],
      yakuniyJavob: "Masalani yechishda sof erigan modda miqdori o'zgarmasligini e'tiborga oling.",
      vizualSxema,
      ovozMatni: "Diqqat! Eritmaga suv qo'shilganda sof modda massasi o'zgarmaydi. Yangi massaviy ulushni topish uchun o'zgarmas modda massasini yangi umumiy eritmaga bo'lish kerak.",
    };
  }

  // 2-REJIM: BOSQICHMA-BOSQICH YO'NALTIRISH VA FORMULALAR (JAVOBSIZ)
  if (rejim === "yonalish") {
    return {
      rejim: "yonalish",
      tenglama: `ω = (m_erigan / m_eritma) × 100%`,
      yonalish: {
        formulalar: [
          "m(erigan modda) = m₁(eritma) × ω₁ / 100%",
          "m(yangi eritma) = m₁(eritma) + m(suv)",
          "ω₂ = [m(erigan modda) / m(yangi eritma)] × 100%",
        ],
        qadamlarRejasi: [
          `1-Qadam: ${m1} g ${w1}% li eritmadagi sof ${modda} massasini hisoblang.`,
          `2-Qadam: Qo'shilgan ${m2} g suv bilan yangi eritmaning jami massasini toping.`,
          `3-Qadam: 1-qadamda chiqqan modda massasini 2-qadamdagi jami massaga bo'lib, 100% ga ko'paytiring.`,
        ],
        maslahat: "Matematik hisob-kitobni o'zingiz bajaring va chiqqan foizni tekshiring.",
      },
      bosqichlar: [
        {
          sarlavha: "1-Yo'nalish: Kerakli fizik-kimyoviy formulalar",
          matn: "Eritmalarni suyultirish formulasidan foydalaning: m₁·ω₁ = m₂·ω₂",
        },
        {
          sarlavha: "2-Yo'nalish: Yechish algoritmi",
          matn: "Avval modda massasini ajratib oling, so'ngra umumiy massaga bo'ling.",
        },
      ],
      yakuniyJavob: "Formulalar bo'yicha hisoblab, yakuniy foizni mustaqil toping.",
      vizualSxema,
      ovozMatni: "Masalani yechish uchun avval dastlabki eritmadagi modda massasini hisoblang, so'ng yangi umumiy massaga bo'ling.",
    };
  }

  // 3-REJIM: TO'LIQ MASTER YECHIM
  return {
    rejim: "toliq",
    tenglama: `${m1}g (${w1}%) + ${m2}g H₂O ➔ ${jamiEritma}g (${wYangi}%)`,
    bosqichlar: [
      {
        sarlavha: "1-Bosqich: Dastlabki erigan modda massasini aniqlash",
        matn: `m(erigan ${modda}) = ${m1} g × ${w1}% / 100% = ${mErigan1} gramm.`,
      },
      {
        sarlavha: "2-Bosqich: Yangi eritmaning umumiy massasi",
        matn: `m(yangi eritma) = m₁(eritma) + m(suv) = ${m1} g + ${m2} g = ${jamiEritma} gramm.`,
      },
      {
        sarlavha: "3-Bosqich: Yangi massaviy ulushni hisoblash",
        matn: `ω₂ = [m(erigan modda) / m(yangi eritma)] × 100%\nω₂ = (${mErigan1} g / ${jamiEritma} g) × 100% = ${wYangi}%.`,
      },
    ],
    yakuniyJavob: `Yangi eritmaning massaviy ulushi: ${wYangi}%`,
    vizualSxema,
    ovozMatni: `Eritmaga ${m2} gramm suv qo'shilganda erigan ${modda} massasi ${mErigan1} grammligicha qoladi. Yangi eritmaning massaviy ulushi ${wYangi} foizni tashkil etadi.`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. KRISTALLOGIDRATLAR VA SUKSIZ TUZ ULUSHI
// ─────────────────────────────────────────────────────────────────────────────
export function yechKristallogidrat(matn, tahlil, rejim = "toliq") {
  const { formulalar, miqdorlar } = tahlil;
  const formula = formulalar[0] || "CuSO₄*5H₂O";

  const M_suvsiz = 160; // CuSO4
  const M_suv = 18;
  const n_suv = 5;
  const M_kristall = M_suvsiz + n_suv * M_suv; // 250

  const grammlar = miqdorlar.filter((m) => ["g", "gramm"].includes(m.birlik));
  const mKristall = grammlar[0]?.qiymat || 50;
  const mSuv = grammlar[1]?.qiymat || 200;

  const w_suvsizTuz = Number(((M_suvsiz / M_kristall) * 100).toFixed(2)); // 64%
  const mSofTuz = Number(((mKristall * w_suvsizTuz) / 100).toFixed(2)); // 32g
  const jamiEritma = mKristall + mSuv; // 250g
  const wYakuniy = Number(((mSofTuz / jamiEritma) * 100).toFixed(2)); // 12.8%

  const vizualSxema = {
    turi: "kristallogidrat",
    nomi: `${formula} Kristallogidrati Tuzilishi`,
    formula,
    suvsizTuzNomi: "CuSO₄ (Suvsiz tuz)",
    suvsizTuzFoiz: w_suvsizTuz,
    suvFoiz: Number((100 - w_suvsizTuz).toFixed(2)),
    mSofTuz,
    jamiEritma,
  };

  if (rejim === "tuzoq") {
    return {
      rejim: "tuzoq",
      tenglama: `${formula} + H₂O ➔ CuSO₄ eritmasi`,
      tuzoqTahlili: {
        kalitNuqta: "Kristallogidrat tarkibidagi 5 ta H₂O molekulasi eriganda erituvchi suv massasiga aylanadi, tuz massasiga emas!",
        nimaUchunMuhim: "O'quvchilar ko'pincha 50g kristallogidratni to'liq tuz deb olib, 50 / 250 = 20% deb xato chiqarishadi. Aslida esa 50 grammning faqat 32 grammi tuzdir.",
        kengTarqalganXato: "Kristallizatsiya suvining massasini hisobga olmaslik.",
      },
      bosqichlar: [
        {
          sarlavha: "⚡ Kristallogidrat Tuzog'i:",
          matn: `M(${formula}) = ${M_kristall} g/mol.\nUning ichidagi suvsiz tuz ulushi: ${M_suvsiz} / ${M_kristall} = ${w_suvsizTuz}%. Demak ${mKristall}g ning faqat ${mSofTuz} grammigina haqiqiy tuz!`,
        },
      ],
      yakuniyJavob: "Kristallizatsiya suvini erigan tuz massasidan ayirib hisoblashni unutmang.",
      vizualSxema,
      ovozMatni: "Muhim qoida: Kristallogidrat eriganda uning tarkibidagi kristallizatsiya suvi erituvchi suvga qo'shiladi va tuz massasini kamaytiradi.",
    };
  }

  if (rejim === "yonalish") {
    return {
      rejim: "yonalish",
      tenglama: `M(kristallogidrat) = M(tuz) + n·M(H₂O)`,
      yonalish: {
        formulalar: [
          `M(${formula}) = ${M_suvsiz} + (${n_suv} × 18) = ${M_kristall} g/mol`,
          `m(sof tuz) = m(kristall) × [M(tuz) / M(kristall)]`,
          `m(jami eritma) = m(kristall) + m(suv)`,
          `ω = [m(sof tuz) / m(jami eritma)] × 100%`,
        ],
        qadamlarRejasi: [
          `1-Qadam: ${formula} ning molyar massasini va undagi suvsiz tuzning massaviy ulushini toping.`,
          `2-Qadam: ${mKristall} g kristallogidratdagi sof tuz massasini ajrating.`,
          `3-Qadam: Tuz massasini jami eritma massasiga (${mKristall} + ${mSuv} g) bo'ling.`,
        ],
        maslahat: "Formulalardan foydalanib o'zingiz hisoblang.",
      },
      bosqichlar: [
        {
          sarlavha: "1-Yo'nalish: Molyar massalar munosabati",
          matn: "Kristallogidratning 1 molida necha gramm suvsiz tuz borligini aniqlang.",
        },
      ],
      yakuniyJavob: "Mustaqil proporsiya tuzib hisoblang.",
      vizualSxema,
      ovozMatni: "Kristallogidrat masalasini yechish uchun avval suvsiz tuzning ulushini toping, so'ng umumiy eritmaga nisbatlang.",
    };
  }

  return {
    rejim: "toliq",
    tenglama: `${mKristall}g ${formula} + ${mSuv}g H₂O ➔ ${wYakuniy}% li eritma`,
    bosqichlar: [
      {
        sarlavha: "1-Bosqich: Molyar massalarni hisoblash",
        matn: `M(${formula}) = ${M_suvsiz} + (5 × 18) = ${M_kristall} g/mol.\nM(CuSO₄) = ${M_suvsiz} g/mol.`,
      },
      {
        sarlavha: "2-Bosqich: Kristallogidratdagi sof tuz massasi",
        matn: `${M_kristall} g kristallogidratda ─── ${M_suvsiz} g CuSO₄ bo'lsa,\n${mKristall} g kristallogidratda ──── X g CuSO₄ bo'ladi.\nX = (${mKristall} × ${M_suvsiz}) / ${M_kristall} = ${mSofTuz} gramm sof CuSO₄.`,
      },
      {
        sarlavha: "3-Bosqich: Yangi eritmaning massaviy ulushi",
        matn: `m(eritma) = ${mKristall} g + ${mSuv} g = ${jamiEritma} gramm.\nω(CuSO₄) = (${mSofTuz} g / ${jamiEritma} g) × 100% = ${wYakuniy}%.`,
      },
    ],
    yakuniyJavob: `Hosil bo'lgan eritmaning massaviy ulushi: ${wYakuniy}%`,
    vizualSxema,
    ovozMatni: `Ellik gramm mis kuporosida o'ttiz ikki gramm sof tuz mavjud. Ikki yuz gramm suvda eritilganda o'n ikki butun o'ndan sakkiz foizli eritma hosil bo'ladi.`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. GAZLAR VA NORMAL SHAROIT HISOBI
// ─────────────────────────────────────────────────────────────────────────────
export function yechGazlar(matn, tahlil, rejim = "toliq") {
  const { formulalar, miqdorlar } = tahlil;
  const gaz = formulalar[0] || "CO₂";
  const M = molyarMassaHisobla(gaz) || 44.01;

  const litrlar = miqdorlar.filter((m) => ["l", "litr", "ml"].includes(m.birlik));
  const hajmLitr = litrlar[0]?.qiymat || 5.6;

  const n = hajmLitr / 22.4;
  const massa = Number((n * M).toFixed(2));
  const dHavo = Number((M / 28.98).toFixed(2));
  const dH2 = Number((M / 2.016).toFixed(2));

  const vizualSxema = {
    turi: "gaz",
    nomi: `${gaz} Gazining Normal Sharoitdagi Parametrlari`,
    gaz,
    hajmLitr,
    mol: Number(n.toFixed(3)),
    massa,
    dHavo,
    dH2,
    M,
  };

  if (rejim === "tuzoq") {
    return {
      rejim: "tuzoq",
      tenglama: `V(${gaz}) = ${hajmLitr} L (N.SH.) ➔ D(havo) va D(H₂)`,
      tuzoqTahlili: {
        kalitNuqta: "Normal sharoitda (0°C va 101.3 kPa) har qanday gazning 1 moli 22.4 litr bo'ladi. Havoning o'rtacha molyar massasi esa 28.98 g/mol (taxminan 29 g/mol).",
        nimaUchunMuhim: "Zichlik nisbatini topishda gaz massasini emas, aynan gazlarning molyar massalari nisbatini olish shart: D = M₁ / M₂.",
        kengTarqalganXato: "Havoning molyar massasini 28 (N₂) yoki 32 (O₂) deb olish.",
      },
      bosqichlar: [
        {
          sarlavha: "⚡ Gazlar Qonuniyati:",
          matn: `V = ${hajmLitr} litr ➔ n = ${hajmLitr} / 22.4 = ${Number(n.toFixed(3))} mol.\nD(havo) = M(${gaz}) / 28.98 = ${M} / 28.98 = ${dHavo}.`,
        },
      ],
      yakuniyJavob: "Havoga nisbatan zichlik topishda M(havo)=28.98 g/mol dan foydalaning.",
      vizualSxema,
      ovozMatni: "Gaz masalalarida havoga nisbatan zichlik gazning molyar massasini yigirma to'qqizga bo'lish orqali topiladi.",
    };
  }

  if (rejim === "yonalish") {
    return {
      rejim: "yonalish",
      tenglama: `n = V / V_m | m = n × M | D = M₁ / M₂`,
      yonalish: {
        formulalar: [
          `n(${gaz}) = V / 22.4 litr/mol`,
          `m(${gaz}) = n × M(${gaz})`,
          `D(havo) = M(${gaz}) / 28.98`,
          `D(H₂) = M(${gaz}) / 2.016`,
        ],
        qadamlarRejasi: [
          `1-Qadam: ${hajmLitr} litr hajmni 22.4 ga bo'lib mol miqdorini toping.`,
          `2-Qadam: Mol miqdorini ${gaz} ning molyar massasiga (${M} g/mol) ko'paytirib massani hisoblang.`,
          `3-Qadam: Molyar massani 28.98 ga bo'lib havoga ko'ra zichlikni aniqlang.`,
        ],
        maslahat: "Formulalar bo'yicha matematik hisobni bajaring.",
      },
      bosqichlar: [
        {
          sarlavha: "1-Yo'nalish: Avogadro qonuni formulalari",
          matn: "Normal sharoitdagi molyar hajm V_m = 22.4 L/mol.",
        },
      ],
      yakuniyJavob: "Mol va massani hisoblab chiqing.",
      vizualSxema,
      ovozMatni: "Avogadro qonunidan foydalanib gaz hajmini molga, so'ngra molyar massa orqali massaga o'tkazing.",
    };
  }

  return {
    rejim: "toliq",
    tenglama: `V(${gaz}) = ${hajmLitr} L (N.SH.) ➔ n = ${Number(n.toFixed(3))} mol ➔ m = ${massa}g`,
    bosqichlar: [
      {
        sarlavha: "1-Bosqich: Gazning mol miqdorini topish",
        matn: `n(${gaz}) = V / V_m = ${hajmLitr} L / (22.4 L/mol) = ${Number(n.toFixed(3))} mol.`,
      },
      {
        sarlavha: "2-Bosqich: Gazning massasini hisoblash",
        matn: `M(${gaz}) = ${M} g/mol.\nm(${gaz}) = n × M = ${Number(n.toFixed(3))} mol × ${M} g/mol = ${massa} gramm.`,
      },
      {
        sarlavha: "3-Bosqich: Havoga va Vodorodga ko'ra zichlik",
        matn: `D(havo) = M(${gaz}) / M(havo) = ${M} / 28.98 = ${dHavo}.\nD(H₂) = M(${gaz}) / M(H₂) = ${M} / 2.016 = ${dH2}.`,
      },
    ],
    yakuniyJavob: `Massasi: ${massa} g | D(havo) = ${dHavo} | D(H₂) = ${dH2}`,
    vizualSxema,
    ovozMatni: `${hajmLitr} litr ${gaz} gazi ${massa} gramm massaga ega bo'lib, uning havoga nisbatan zichligi ${dHavo} ga teng.`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. STEXIOMETRIYA VA CHEKLOVCHI REAGENT
// ─────────────────────────────────────────────────────────────────────────────
export function yechStexiometriya(matn, tahlil, rejim = "toliq") {
  const { formulalar, miqdorlar } = tahlil;
  const moddaA = formulalar[0] || "NaOH";
  const moddaB = formulalar[1] || "H₂SO₄";

  const MA = molyarMassaHisobla(moddaA) || 40;
  const MB = molyarMassaHisobla(moddaB) || 98;

  const grammlar = miqdorlar.filter((m) => ["g", "gramm"].includes(m.birlik));
  const mA = grammlar[0]?.qiymat || 10;
  const mB = grammlar[1]?.qiymat || 9.8;

  const nA = mA / MA; // 0.25 mol NaOH
  const nB = mB / MB; // 0.1 mol H2SO4

  // 2 NaOH + H2SO4 -> Na2SO4 + 2 H2O
  // 0.1 mol H2SO4 ga 0.2 mol NaOH kerak. NaOH = 0.25 mol (ortiqcha 0.05 mol)
  const nA_kerak = nB * 2;
  const ortganA = Math.max(0, Number((nA - nA_kerak).toFixed(3)));
  const hosilTuzMol = nB;
  const M_tuz = 142.04; // Na2SO4
  const mTuz = Number((hosilTuzMol * M_tuz).toFixed(2));

  const vizualSxema = {
    turi: "stexiometriya",
    nomi: "Reagentlar Sarfi va Cheklovchi Modda Balansi",
    moddalar: [
      { nom: moddaA, berilganMol: Number(nA.toFixed(3)), sarflandiMol: Number(nA_kerak.toFixed(3)), ortdiMol: ortganA, status: ortganA > 0 ? "ortiqcha" : "to'liq" },
      { nom: moddaB, berilganMol: Number(nB.toFixed(3)), sarflandiMol: Number(nB.toFixed(3)), ortdiMol: 0, status: "cheklovchi (to'liq sarflandi)" },
    ],
    hosilBolganTuz: `Na₂SO₄ (${mTuz} g)`,
  };

  if (rejim === "tuzoq") {
    return {
      rejim: "tuzoq",
      tenglama: `2 ${moddaA} + ${moddaB} ➔ Na₂SO₄ + 2 H₂O`,
      tuzoqTahlili: {
        kalitNuqta: "Ikkala boshlang'ich modda massasi berilganda, avval ularni molga o'tkazib stexiometrik koeffitsiyentlar bo'yicha QAYSI MODDA CHEKLOVCHI ekanligini aniqlash shart.",
        nimaUchunMuhim: "Mahsulot massasi doimo kam (cheklovchi) modda bo'yicha hisoblanadi. Ortiqcha modda bo'yicha hisoblansa xato natija chiqadi.",
        kengTarqalganXato: "Massalarni to'g'ridan-to'g'ri qo'shish yoki ortiqcha moddani to'liq sarflandi deb hisoblash.",
      },
      bosqichlar: [
        {
          sarlavha: "⚡ Cheklovchi Reagent Tuzog'i:",
          matn: `n(${moddaA}) = ${mA}g / ${MA} = ${Number(nA.toFixed(3))} mol.\nn(${moddaB}) = ${mB}g / ${MB} = ${Number(nB.toFixed(3))} mol.\n1 mol ${moddaB} ga 2 mol ${moddaA} kerak. Demak ${moddaA} ortiqcha qoladi, mahsulot esa ${moddaB} bo'yicha hisoblanadi!`,
        },
      ],
      yakuniyJavob: "Mahsulot miqdorini cheklovchi reagent bo'yicha hisoblang.",
      vizualSxema,
      ovozMatni: "Diqqat! Ikkala modda massasi berilganda mahsulot faqat to'liq sarflangan cheklovchi modda bo'yicha hisoblanadi.",
    };
  }

  if (rejim === "yonalish") {
    return {
      rejim: "yonalish",
      tenglama: `2 NaOH + H₂SO₄ ➔ Na₂SO₄ + 2 H₂O`,
      yonalish: {
        formulalar: [
          `n = m / M`,
          `2 mol NaOH ── 1 mol H₂SO₄ ── 1 mol Na₂SO₄`,
          `m(tuz) = n(cheklovchi) × M(Na₂SO₄)`,
        ],
        qadamlarRejasi: [
          `1-Qadam: ${moddaA} (${mA}g) va ${moddaB} (${mB}g) ning mollarini toping.`,
          `2-Qadam: Tenglama koeffitsiyentiga qarab qaysi modda kam (cheklovchi) ekanini aniqlang.`,
          `3-Qadam: Cheklovchi modda moli bo'yicha hosil bo'lgan Na₂SO₄ massasini va ortgan moddani hisoblang.`,
        ],
        maslahat: "Formulalar bo'yicha oraliq mollarni hisoblang.",
      },
      bosqichlar: [
        {
          sarlavha: "1-Yo'nalish: Mollar nisbati",
          matn: "Reaksiya tenglamasidagi stexiometrik koeffitsiyentlar 2 : 1 nisbatda.",
        },
      ],
      yakuniyJavob: "Ortiqcha va cheklovchi moddani mustaqil hisoblang.",
      vizualSxema,
      ovozMatni: "Avval moddalarning mollarini toping va reaksiya tenglamasidagi koeffitsiyentlar bo'yicha cheklovchi reagentni aniqlang.",
    };
  }

  return {
    rejim: "toliq",
    tenglama: `2 NaOH + H₂SO₄ ➔ Na₂SO₄ + 2 H₂O`,
    bosqichlar: [
      {
        sarlavha: "1-Bosqich: Moddalarning mol miqdorlarini hisoblash",
        matn: `n(${moddaA}) = ${mA} g / (${MA} g/mol) = ${Number(nA.toFixed(3))} mol.\nn(${moddaB}) = ${mB} g / (${MB} g/mol) = ${Number(nB.toFixed(3))} mol.`,
      },
      {
        sarlavha: "2-Bosqich: Cheklovchi reagentni aniqlash",
        matn: `Tenglamaga ko'ra 1 mol H₂SO₄ uchun 2 mol NaOH kerak.\n${Number(nB.toFixed(3))} mol H₂SO₄ uchun: ${Number(nB.toFixed(3))} × 2 = ${Number(nA_kerak.toFixed(3))} mol NaOH sarflanadi.\nBerilgan NaOH: ${Number(nA.toFixed(3))} mol ➔ Ortib qolgan NaOH: ${Number(nA.toFixed(3))} - ${Number(nA_kerak.toFixed(3))} = ${ortganA} mol (${Number((ortganA * MA).toFixed(2))} g).`,
      },
      {
        sarlavha: "3-Bosqich: Hosil bo'lgan tuz massasini hisoblash",
        matn: `Hosil bo'lgan n(Na₂SO₄) = n(H₂SO₄) = ${hosilTuzMol} mol.\nm(Na₂SO₄) = ${hosilTuzMol} mol × ${M_tuz} g/mol = ${mTuz} gramm.`,
      },
    ],
    yakuniyJavob: `Hosil bo'lgan Na₂SO₄: ${mTuz} g | Ortib qolgan NaOH: ${Number((ortganA * MA).toFixed(2))} g (${ortganA} mol)`,
    vizualSxema,
    ovozMatni: `Reaksiya natijasida ${mTuz} gramm natriy sulfat tuzi hosil bo'ladi va ${Number((ortganA * MA).toFixed(2))} gramm ishqor ortib qoladi.`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TERMOKIMYO VA ATOM TUZILISHI
// ─────────────────────────────────────────────────────────────────────────────
export function yechTermokimyo(matn, tahlil, rejim = "toliq") {
  const { formulalar, miqdorlar } = tahlil;
  const modda = formulalar[0] || "C";
  const M = molyarMassaHisobla(modda) || 12.011;

  const kjLari = miqdorlar.filter((m) => ["kj", "kdj"].includes(m.birlik));
  const Q_berilgan = kjLari[0]?.qiymat || 787;
  const grammlar = miqdorlar.filter((m) => ["g", "gramm"].includes(m.birlik));
  const massa = grammlar[0]?.qiymat || 24;

  const n = massa / M;
  const Q_1mol = Number(((Q_berilgan / n)).toFixed(1));

  if (rejim === "tuzoq") {
    return {
      rejim: "tuzoq",
      tenglama: `${modda} + O₂ ➔ CO₂ + Q (kJ/mol)`,
      tuzoqTahlili: {
        kalitNuqta: "Termokimyoviy tenglamalardagi issiqlik effekti (Q) har doim aynan 1 MOL moddaga nisbatan belgilanadi.",
        nimaUchunMuhim: "Berilgan grammni to'g'ridan-to'g'ri issiqlikka tenglab qo'ymasdan, avval uni molga o'tkazish shart.",
        kengTarqalganXato: "Issiqlik effekti va entalpiya (ΔH = -Q) ishoralarini chalkashtirish.",
      },
      bosqichlar: [
        {
          sarlavha: "⚡ Termokimyo Qonuni:",
          matn: `${massa} g ${modda} = ${Number(n.toFixed(2))} mol.\n1 mol uchun issiqlik: Q₀ = Q / n = ${Q_berilgan} / ${Number(n.toFixed(2))} kJ/mol.`,
        },
      ],
      yakuniyJavob: "Issiqlik effektini 1 mol moddaga keltirib hisoblang.",
      ovozMatni: "Termokimyoviy hisoblarda issiqlik effekti har doim bir mol moddaning yonishiga nisbatan aniqlanadi.",
    };
  }

  if (rejim === "yonalish") {
    return {
      rejim: "yonalish",
      tenglama: `Q = n × Q_molar`,
      yonalish: {
        formulalar: [
          `n = m / M`,
          `Q_molar = Q / n`,
          `ΔH = -Q_molar (Eksotermik reaksiya)`,
        ],
        qadamlarRejasi: [
          `1-Qadam: ${massa} gramm ${modda} necha mol ekanini toping.`,
          `2-Qadam: Ajralgan ${Q_berilgan} kJ issiqlikni chiqqan molga bo'ling.`,
        ],
        maslahat: "Formuladan foydalanib 1 mol uchun hisoblang.",
      },
      bosqichlar: [
        {
          sarlavha: "1-Yo'nalish: Proporsiya",
          matn: `${massa} g ── ${Q_berilgan} kJ\n${M} g (1 mol) ── X kJ`,
        },
      ],
      yakuniyJavob: "1 mol uchun issiqlikni toping.",
      ovozMatni: "Modda massasini molga o'tkazib, bir mol uchun issiqlik effektini hisoblang.",
    };
  }

  return {
    rejim: "toliq",
    tenglama: `${modda} + O₂ ➔ CO₂ + ${Q_1mol} kJ/mol`,
    bosqichlar: [
      {
        sarlavha: "1-Bosqich: Yoqilgan moddaning mol miqdori",
        matn: `n(${modda}) = m / M = ${massa} g / (${M} g/mol) = ${Number(n.toFixed(2))} mol.`,
      },
      {
        sarlavha: "2-Bosqich: 1 mol modda uchun issiqlik effekti (Q)",
        matn: `${Number(n.toFixed(2))} mol ${modda} yonganda ── ${Q_berilgan} kJ ajralsa,\n1 mol ${modda} yonganda ────── Q kJ ajraladi.\nQ = ${Q_berilgan} / ${Number(n.toFixed(2))} = ${Q_1mol} kJ/mol.`,
      },
    ],
    yakuniyJavob: `Yonish issiqlik effekti: Q = ${Q_1mol} kJ/mol (ΔH = -${Q_1mol} kJ/mol)`,
    ovozMatni: `Bir mol ${modda} to'liq yonganda ${Q_1mol} kilojoul issiqlik energiyasi ajralib chiqadi.`,
  };
}

export function yechAtom(matn, tahlil, rejim = "toliq") {
  const { formulalar } = tahlil;
  const modda = formulalar[0] || "H₂O";
  const M = molyarMassaHisobla(modda) || 18.015;

  const N_A = 6.022e23;
  const m1Molekula = (M / N_A).toExponential(4);

  if (rejim === "tuzoq") {
    return {
      rejim: "tuzoq",
      tenglama: `M(${modda}) = ${M} g/mol | N_A = 6.022×10²³`,
      tuzoqTahlili: {
        kalitNuqta: "Molyar massa (M) — bu 1 ta molekula massasi emas, balki 6.022 × 10²³ ta molekula massasidir.",
        nimaUchunMuhim: "1 dona molekulaning haqiqiy massasi o'ta kichik (~10⁻²³ gramm) bo'ladi.",
        kengTarqalganXato: "Molyar massani to'g'ridan-to'g'ri 1 molekula deb qabul qilish.",
      },
      bosqichlar: [
        {
          sarlavha: "⚡ Avogadro Qonuni:",
          matn: `m₀ = M / N_A = ${M} / 6.022×10²³ gramm.`,
        },
      ],
      yakuniyJavob: "Molyar massani Avogadro soniga bo'lishni unutmang.",
      ovozMatni: "Bitta molekula massasini topish uchun moddaning molyar massasini Avogadro soniga bo'lish kerak.",
    };
  }

  if (rejim === "yonalish") {
    return {
      rejim: "yonalish",
      tenglama: `m₀ = M / N_A`,
      yonalish: {
        formulalar: [
          `m₀ = M / N_A`,
          `N_A = 6.022 × 10²³ ta/mol`,
        ],
        qadamlarRejasi: [
          `1-Qadam: ${modda} ning molyar massasini hisoblang (${M} g/mol).`,
          `2-Qadam: Chiqqan massani 6.022 × 10²³ ga bo'ling.`,
        ],
        maslahat: "Eksponentsial sonlar bilan hisoblang.",
      },
      bosqichlar: [
        {
          sarlavha: "1-Yo'nalish: Formula",
          matn: "1 ta molekula massasi m₀ = M / N_A",
        },
      ],
      yakuniyJavob: "m₀ ni mustaqil hisoblang.",
      ovozMatni: "Molyar massani Avogadro doimiysiga bo'lib bitta zarracha massasini hisoblang.",
    };
  }

  return {
    rejim: "toliq",
    tenglama: `m₀(${modda}) = ${M} g/mol / (6.022 × 10²³ mol⁻¹) = ${m1Molekula} g`,
    bosqichlar: [
      {
        sarlavha: "1-Bosqich: Molyar massa va Avogadro soni",
        matn: `M(${modda}) = ${M} g/mol.\nN_A = 6.022 × 10²³ ta/mol.`,
      },
      {
        sarlavha: "2-Bosqich: 1 ta yakka molekulaning haqiqiy massasi",
        matn: `m₀ = M / N_A = ${M} / (6.022 × 10²³) = ${m1Molekula} gramm.`,
      },
    ],
    yakuniyJavob: `1 dona ${modda} molekulasining haqiqiy massasi: ${m1Molekula} g`,
    ovozMatni: `Bir dona ${modda} molekulasining haqiqiy massasi ${m1Molekula} grammni tashkil qiladi.`,
  };
}
