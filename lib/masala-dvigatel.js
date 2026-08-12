import { balansTekshir } from "@/lib/chem-balance.js";

// ─────────────────────────────────────────────────────────────
// ATOMIK MASSALAR JADVALI (g/mol) — IUPAC 2024
// ─────────────────────────────────────────────────────────────
const ATOM_MASSALAR = {
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
};

function pastkiIndeksNormalize(str = "") {
  const map = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };
  return str.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => map[m] || m);
}

// Kimyoviy formula molyar massasini hisoblash
export function molyarMassaHisobla(formula = "") {
  const toza = pastkiIndeksNormalize(formula.trim());
  if (!toza) return 0;

  // Kristallogidratlar (masalan CuSO4*5H2O)
  if (toza.includes("*") || toza.includes("·")) {
    const qismlar = toza.split(/[*·]/);
    const asosiy = molyarMassaHisobla(qismlar[0]);
    const suvQismi = qismlar[1] ? qismlar[1].replace(/H2O|H₂O/g, "") : "1";
    const suvMoli = parseInt(suvQismi || "1", 10);
    return Math.round((asosiy + suvMoli * 18.015) * 1000) / 1000;
  }

  // Qavsli formulalar (masalan Ca(OH)2 yoki Fe2(SO4)3)
  if (toza.includes("(") && toza.includes(")")) {
    const match = toza.match(/^(.*?)\((.*?)\)(\d*)$/);
    if (match) {
      const [, oldi, ichi, qavsOrqasi] = match;
      const ichkiKoeff = parseInt(qavsOrqasi || "1", 10);
      return Math.round((molyarMassaHisobla(oldi) + molyarMassaHisobla(ichi) * ichkiKoeff) * 1000) / 1000;
    }
  }

  const elementRegex = /([A-Z][a-z]*)(\d*)/g;
  let umumiyMassa = 0;
  let m;
  while ((m = elementRegex.exec(toza)) !== null) {
    const elem = m[1];
    const son = parseInt(m[2] || "1", 10);
    const atomMass = ATOM_MASSALAR[elem] || 0;
    umumiyMassa += atomMass * son;
  }

  return Math.round(umumiyMassa * 1000) / 1000;
}

// Masala matnidan formulalar, sonlar va birliklarni tahlil qilish
export function masalaMatniniTahlilQil(matn = "") {
  const formulalar = [];
  const miqdorlar = [];

  const formulaRegex = /\b([A-Z][a-z]?[0-9₀₁₂₃₄₅₆₇₈₉]*)+(\([A-Z][a-z]?[0-9₀₁₂₃₄₅₆₇₈₉]*\)[0-9₀₁₂₃₄₅₆₇₈₉]*)?\b/g;
  let match;
  while ((match = formulaRegex.exec(matn)) !== null) {
    const f = match[0];
    if (f.length >= 2 && !["Va", "Bu", "Ha", "Yo", "Agar", "Deb", "Tuz", "Suv"].includes(f)) {
      if (!formulalar.includes(f)) {
        formulalar.push(f);
      }
    }
  }

  const miqdorRegex = /(\d+(?:\.\d+)?)\s*(g\/ml|g\/sm3|g|gramm|kg|mol|ml|l|litr|%|kj|kdj|gradus|c|molar|m)\b/gi;
  while ((match = miqdorRegex.exec(matn)) !== null) {
    miqdorlar.push({
      qiymat: parseFloat(match[1]),
      birlik: match[2].toLowerCase(),
    });
  }

  return { formulalar, miqdorlar };
}

// Masala turini aniqlash
export function masalaTuriniAniqla(matn = "") {
  const m = matn.toLowerCase();
  if (m.includes("eritma") || m.includes("massaviy ulush") || m.includes("%") || m.includes("suyultir") || m.includes("kristallogidrat") || m.includes("zichlik") || m.includes("molaritet")) return "eritmalar";
  if (m.includes("gaz") || m.includes("litr") || m.includes("normal sharoit") || m.includes("n.sh")) return "gazlar";
  if (m.includes("issiqlik") || m.includes("kj") || m.includes("entalpiya")) return "termokimyo";
  if (m.includes("ph") || m.includes("poh") || m.includes("vodorod ko'rsatkich")) return "ph";
  if (m.includes("proton") || m.includes("neytron") || m.includes("elektron") || m.includes("molekula massasi")) return "atom";
  return "stexiometriya";
}

// ─────────────────────────────────────────────────────────────
// SUPER ERITMALAR DVIGATELI (ULTIMATE SOLUTIONS SOLVER)
// ─────────────────────────────────────────────────────────────
export function yechEritmalar(matn, tahlil) {
  const mLow = matn.toLowerCase();
  const { formulalar, miqdorlar } = tahlil;
  const modda = formulalar[0] || "CuSO₄";
  const M = molyarMassaHisobla(modda) || 160;

  const grammlar = miqdorlar.filter((m) => ["g", "gramm"].includes(m.birlik));
  const foizlar = miqdorlar.filter((m) => m.birlik === "%");
  const litrlar = miqdorlar.filter((m) => ["l", "litr", "ml"].includes(m.birlik));
  const zichliklar = miqdorlar.filter((m) => ["g/ml", "g/sm3"].includes(m.birlik));

  // 1-SUB-TYPE: Kristallogidrat Masalasi (Hydrate dissolution)
  if (mLow.includes("kristallogidrat") || modda.includes("*") || modda.includes("·")) {
    const mGidrat = grammlar[0]?.qiymat || 50;
    const mSuv = grammlar[1]?.qiymat || 200;

    const M_suvsiz = 160; // CuSO4
    const M_gidrat = 250; // CuSO4*5H2O

    const mSuvsizTuz = Math.round((mGidrat * (M_suvsiz / M_gidrat)) * 100) / 100;
    const mUmumiyEritma = mGidrat + mSuv;
    const wSuvsiz = Math.round((mSuvsizTuz / mUmumiyEritma) * 10000) / 100;

    const bosqichlar = [
      {
        sarlavha: "1-Bosqich: Kristallogidrat va suvsiz tuz molyar massalari",
        matn: `M(CuSO₄·5H₂O) = ${M_gidrat} g/mol.\nM(CuSO₄ suvsiz) = ${M_suvsiz} g/mol.`,
      },
      {
        sarlavha: "2-Bosqich: Gidrat tarkibidagi sof suvsiz tuz massasi",
        matn: `m(suvsiz tuz) = m(gidrat) × (M_suvsiz / M_gidrat) = ${mGidrat} g × (${M_suvsiz} / ${M_gidrat}) = ${mSuvsizTuz} gramm.`,
      },
      {
        sarlavha: "3-Bosqich: Umumiy eritma massasi va suvsiz tuzning massaviy ulushi (ω)",
        matn: `m(eritma) = ${mGidrat} g + ${mSuv} g = ${mUmumiyEritma} gramm.\nω(suvsiz tuz) = (${mSuvsizTuz} g / ${mUmumiyEritma} g) × 100% = ${wSuvsiz}%.`,
      },
    ];

    const ovozMatni = `Kristallogidrat suvda eritilganda tarkibidagi kristallashtiruvchi suv umumiy suv hajmiga qo'shiladi. ${mGidrat} gramm mis kuporosida ${mSuvsizTuz} gramm sof suvsiz tuz bor. Hosil bo'lgan eritmaning suvsiz tuz bo'yicha massaviy ulushi ${wSuvsiz} foizni tashkil etadi.`;

    return {
      tenglama: `${mGidrat}g CuSO₄·5H₂O + ${mSuv}g H₂O ➔ ${mUmumiyEritma}g eritma (${wSuvsiz}%)`,
      bosqichlar,
      yakuniyJavob: `Suvsiz tuz bo'yicha massaviy ulush: ${wSuvsiz}%`,
      ovozMatni,
    };
  }

  // 2-SUB-TYPE: Molaritet va Zichlik (Molarity C_M & Density rho)
  if (mLow.includes("molaritet") || mLow.includes("zichlik") || zichliklar.length > 0) {
    const rho = zichliklar[0]?.qiymat || 1.2;
    const w = foizlar[0]?.qiymat || 20;

    // C_M = (10 * rho * w) / M
    const CM = Math.round(((10 * rho * w) / M) * 100) / 100;

    const bosqichlar = [
      {
        sarlavha: "1-Bosqich: Molaritet va Zichlik o'rtasidagi formulani qo'llash",
        matn: `Formula: C_M = (10 × ρ × ω%) / M\nBu yerda: ρ = ${rho} g/ml, ω = ${w}%, M(${modda}) = ${M} g/mol.`,
      },
      {
        sarlavha: "2-Bosqich: Molar konsentratsiyani hisoblash (C_M)",
        matn: `C_M = (10 × ${rho} × ${w}) / ${M} = ${CM} mol/litr.`,
      },
    ];

    const ovozMatni = `Eritmaning zichligi ${rho} gramm millilitr va massaviy ulushi ${w} foiz bo'lganda, u 1 litr hajmda ${CM} mol erigan modda saqlaydi. Molar konsentratsiyasi ${CM} molar ga teng.`;

    return {
      tenglama: `C_M = (10 × ${rho} g/ml × ${w}%) / ${M} g/mol = ${CM} M`,
      bosqichlar,
      yakuniyJavob: `Molar konsentratsiya: C_M = ${CM} mol/L (Molar)`,
      ovozMatni,
    };
  }

  // 3-SUB-TYPE: Eritmalarni Aralashtirish / Krest Qoidasi (Mixing 2 solutions)
  if (foizlar.length >= 2 && grammlar.length >= 2) {
    const m1 = grammlar[0]?.qiymat || 100;
    const w1 = foizlar[0]?.qiymat || 10;
    const m2 = grammlar[1]?.qiymat || 300;
    const w2 = foizlar[1]?.qiymat || 30;

    const mErigan1 = (m1 * w1) / 100;
    const mErigan2 = (m2 * w2) / 100;
    const mEriganUmumiy = mErigan1 + mErigan2;
    const mEritmaUmumiy = m1 + m2;
    const wUmumiy = Math.round((mEriganUmumiy / mEritmaUmumiy) * 10000) / 100;

    const bosqichlar = [
      {
        sarlavha: "1-Bosqich: Har bir eritmadagi sof erigan modda massasi",
        matn: `m₁(erigan) = ${m1}g × ${w1}% / 100% = ${mErigan1}g.\nm₂(erigan) = ${m2}g × ${w2}% / 100% = ${mErigan2}g.`,
      },
      {
        sarlavha: "2-Bosqich: Aralashmaning umumiy erigan modda va eritma massasi",
        matn: `m(erigan umumiy) = ${mErigan1}g + ${mErigan2}g = ${mEriganUmumiy} gramm.\nm(eritma umumiy) = ${m1}g + ${m2}g = ${mEritmaUmumiy} gramm.`,
      },
      {
        sarlavha: "3-Bosqich: Yangi aralashmaning massaviy ulushi (ω₃)",
        matn: `ω₃ = (${mEriganUmumiy}g / ${mEritmaUmumiy}g) × 100% = ${wUmumiy}%.`,
      },
    ];

    const ovozMatni = `Ikki eritma aralashtirilganda ulardagi erigan moddalar massalari qo'shiladi: umumiy ${mEriganUmumiy} gramm bo'ladi. Natijaviy yangi eritmaning massaviy ulushi ${wUmumiy} foizni tashkil qiladi.`;

    return {
      tenglama: `${m1}g (${w1}%) + ${m2}g (${w2}%) ➔ ${mEritmaUmumiy}g (${wUmumiy}%)`,
      bosqichlar,
      yakuniyJavob: `Aralashmaning yangi massaviy ulushi: ${wUmumiy}%`,
      ovozMatni,
    };
  }

  // 4-SUB-TYPE: Standart Suv Qo'shish / Bug'latish (Dilution)
  const mEritma1 = grammlar[0]?.qiymat || 200;
  const w1 = foizlar[0]?.qiymat || 15;
  const mSuv = grammlar[1]?.qiymat || 50;

  const mErigan = (mEritma1 * w1) / 100;
  const mEritma2 = mLow.includes("bug'lat") ? mEritma1 - mSuv : mEritma1 + mSuv;
  const w2 = Math.round((mErigan / mEritma2) * 10000) / 100;

  const bosqichlar = [
    {
      sarlavha: "1-Bosqich: Dastlabki eritmadagi sof erigan modda massasi",
      matn: `m(erigan ${modda}) = m(eritma₁) × ω₁ / 100% = ${mEritma1} g × ${w1}% / 100% = ${mErigan} gramm.`,
    },
    {
      sarlavha: "2-Bosqich: Eritma massasining o'zgarishi",
      matn: `m(eritma₂) = ${mEritma1} g ${mLow.includes("bug'lat") ? "-" : "+"} ${mSuv} g = ${mEritma2} gramm.`,
    },
    {
      sarlavha: "3-Bosqich: Yangi eritmaning massaviy ulushi (ω₂)",
      matn: `ω₂ = (${mErigan} g / ${mEritma2} g) × 100% = ${w2}%.`,
    },
  ];

  const ovozMatni = `Eritma ${mLow.includes("bug'lat") ? "bug'latilganda" : "suyultirilganda"} erigan modda massasi ${mErigan} gramm bo'lib qoladi. Yangi eritma massasi ${mEritma2} gramm. Yangi massaviy ulush ${w2} foizga teng.`;

  return {
    tenglama: `${mEritma1}g (${w1}%) ➔ ${mEritma2}g (${w2}%)`,
    bosqichlar,
    yakuniyJavob: `Yangi massaviy ulush: ${w2}%`,
    ovozMatni,
  };
}

// ─────────────────────────────────────────────────────────────
// OTHER SPECIALIZED SOLVERS
// ─────────────────────────────────────────────────────────────
export function yechGazlar(matn, tahlil) {
  const { formulalar, miqdorlar } = tahlil;
  const gaz = formulalar[0] || "CO₂";
  const M = molyarMassaHisobla(gaz) || 44.01;

  const litrlar = miqdorlar.filter((m) => ["l", "litr", "ml"].includes(m.birlik));
  const hajmLitr = litrlar[0]?.qiymat || 5.6;

  const n = hajmLitr / 22.4;
  const massa = Math.round(n * M * 100) / 100;
  const dHavo = Math.round((M / 28.98) * 100) / 100;
  const dH2 = Math.round((M / 2.016) * 100) / 100;

  const bosqichlar = [
    {
      sarlavha: "1-Bosqich: Normal sharoitda gazi mollar miqdorini topish",
      matn: `n(${gaz}) = V / V_m = ${hajmLitr} L / 22.4 L/mol = ${Math.round(n * 1000) / 1000} mol.`,
    },
    {
      sarlavha: "2-Bosqich: Gazning molyar massasi va sof massasi",
      matn: `M(${gaz}) = ${M} g/mol.\nm(${gaz}) = n × M = ${Math.round(n * 1000) / 1000} mol × ${M} g/mol = ${massa} gramm.`,
    },
    {
      sarlavha: "3-Bosqich: Havoga va Vodorodga nisbatan nisbiy zichlik",
      matn: `D(havo) = M(${gaz}) / 29 = ${M} / 29 = ${dHavo}.\nD(H₂) = M(${gaz}) / 2 = ${M} / 2 = ${dH2}.`,
    },
  ];

  const ovozMatni = `Normal sharoitda 22.4 litr gaz 1 molni tashkil qiladi. Berilgan ${hajmLitr} litr ${gaz} gazi ${Math.round(n * 1000) / 1000} mol bo'ladi. Uning massasi ${massa} grammga teng. Havoga nisbatan nisbiy zichligi esa ${dHavo} ni tashkil etadi.`;

  return {
    tenglama: `V = ${hajmLitr} L (N.SH.) ➔ n = ${Math.round(n * 1000) / 1000} mol ➔ m = ${massa}g`,
    bosqichlar,
    yakuniyJavob: `Massasi: ${massa}g | Havoga ko'ra zichligi D(havo) = ${dHavo}`,
    ovozMatni,
  };
}

export function yechTermokimyo(matn, tahlil) {
  const { formulalar, miqdorlar } = tahlil;
  const modda = formulalar[0] || "C";
  const M = molyarMassaHisobla(modda) || 12;

  const kjLari = miqdorlar.filter((m) => ["kj", "kdj"].includes(m.birlik));
  const Q_molar = kjLari[0]?.qiymat || 393.5;

  const grammlar = miqdorlar.filter((m) => ["g", "gramm"].includes(m.birlik));
  const massa = grammlar[0]?.qiymat || 24;

  const n = massa / M;
  const Q_ajralgan = Math.round(n * Q_molar * 10) / 10;

  const bosqichlar = [
    {
      sarlavha: "1-Bosqich: Yonayotgan modda mollar miqdori",
      matn: `n(${modda}) = m / M = ${massa} g / ${M} g/mol = ${n} mol.`,
    },
    {
      sarlavha: "2-Bosqich: Termokimyoviy issiqlik effekti hisobi",
      matn: `1 mol ${modda} yonganda ${Q_molar} kJ issiqlik ajraladi.\n${n} mol yonganda: Q = ${n} mol × ${Q_molar} kJ/mol = ${Q_ajralgan} kJ.`,
    },
  ];

  const ovozMatni = `${massa} gramm ${modda} yonganda ${n} mol modda reaksiyaga kirishadi. Termokimyoviy tenglamaga ko'ra natijada ${Q_ajralgan} kiloJoul issiqlik energiyasi ajralib chiqadi.`;

  return {
    tenglama: `${modda} + O₂ → CO₂ + ${Q_molar} kJ`,
    bosqichlar,
    yakuniyJavob: `Ajralib chiqqan issiqlik: ${Q_ajralgan} kJ`,
    ovozMatni,
  };
}

export function yechAtom(matn, tahlil) {
  const { formulalar } = tahlil;
  const modda = formulalar[0] || "H₂O";
  const M = molyarMassaHisobla(modda) || 18.015;

  const N_A = 6.022e23;
  const m1Molekula = (M / N_A).toExponential(4);

  const bosqichlar = [
    {
      sarlavha: "1-Bosqich: Molyar massa (M)",
      matn: `M(${modda}) = ${M} g/mol.`,
    },
    {
      sarlavha: "2-Bosqich: 1 ta molekulaning haqiqiy massasi (m₀)",
      matn: `m₀ = M / N_A = ${M} g/mol / (6.022 × 10²³ mol⁻¹) = ${m1Molekula} gramm.`,
    },
  ];

  const ovozMatni = `${modda} birikmasining molyar massasi ${M} grammga teng. Avogadro soniga bo'lish orqali 1 ta molekulaning aniq massasi ${m1Molekula} gramm ekani hisoblandi.`;

  return {
    tenglama: `M(${modda}) = ${M} g/mol | N_A = 6.022×10²³`,
    bosqichlar,
    yakuniyJavob: `1 ta molekula massasi m₀ = ${m1Molekula} g`,
    ovozMatni,
  };
}
