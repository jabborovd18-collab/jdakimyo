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

// ATOM TARTIB RAQAMLARI (Protonlar soni Z)
const PROTONLAR_SONI = {
  H: 1, He: 2, Li: 3, Be: 4, B: 5, C: 6, N: 7, O: 8, F: 9, Ne: 10,
  Na: 11, Mg: 12, Al: 13, Si: 14, P: 15, S: 16, Cl: 17, Ar: 18, K: 19, Ca: 20,
  Cr: 24, Mn: 25, Fe: 26, Cu: 29, Zn: 30, Br: 35, Ag: 47, I: 53, Ba: 56, Au: 79, Pb: 82
};

// Pastki indekslarni oddiy songa aylantirish
function pastkiIndeksNormalize(str = "") {
  const map = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };
  return str.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => map[m] || m);
}

// Kimyoviy formula molyar massasini hisoblash
export function molyarMassaHisobla(formula = "") {
  const toza = pastkiIndeksNormalize(formula.trim());
  if (!toza) return 0;

  // Kristallogidratlar uchun (masalan CuSO4*5H2O)
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

  // Formulalarni ajratish
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

  // Miqdorlarni (son + birlik) ajratish
  const miqdorRegex = /(\d+(?:\.\d+)?)\s*(g|gramm|kg|mol|ml|l|litr|%|kj|kdj|gradus|c|molar|m)\b/gi;
  while ((match = miqdorRegex.exec(matn)) !== null) {
    miqdorlar.push({
      qiymat: parseFloat(match[1]),
      birlik: match[2].toLowerCase(),
    });
  }

  return { formulalar, miqdorlar };
}

// Masala turini aniqlash (Eritma, Stexiometriya, Gaz, Termokimyo, pH, Atom)
export function masalaTuriniAniqla(matn = "") {
  const m = matn.toLowerCase();
  if (m.includes("eritma") || m.includes("massaviy ulush") || m.includes("%") || m.includes("suyultir")) return "eritmalar";
  if (m.includes("gaz") || m.includes("litr") || m.includes("normal sharoit") || m.includes("n.sh") || m.includes("zichlik")) return "gazlar";
  if (m.includes("issiqlik") || m.includes("kj") || m.includes("kdj") || m.includes("entalpiya") || m.includes("termokimyo")) return "termokimyo";
  if (m.includes("ph") || m.includes("poh") || m.includes("vodorod ko'rsatkich") || m.includes("ion")) return "ph";
  if (m.includes("proton") || m.includes("neytron") || m.includes("elektron") || m.includes("molekula massasi") || m.includes("avogadro")) return "atom";
  return "stexiometriya";
}

// ─────────────────────────────────────────────────────────────
// 1. ERITMALAR VA MASSAVIY ULUSH HISOBI (Solutions Engine)
// ─────────────────────────────────────────────────────────────
export function yechEritmalar(matn, tahlil) {
  const { formulalar, miqdorlar } = tahlil;
  const modda = formulalar[0] || "CuSO₄";

  // Case A: Massaviy ulush va suv qo'shish (m1, w1%, mSuv)
  const grammlar = miqdorlar.filter((m) => ["g", "gramm"].includes(m.birlik));
  const foizlar = miqdorlar.filter((m) => m.birlik === "%");

  const mEritma1 = grammlar[0]?.qiymat || 200;
  const w1 = foizlar[0]?.qiymat || 15;
  const mSuv = grammlar[1]?.qiymat || 50;

  const mErigan = (mEritma1 * w1) / 100;
  const mEritma2 = mEritma1 + mSuv;
  const w2 = Math.round((mErigan / mEritma2) * 10000) / 100;

  const bosqichlar = [
    {
      sarlavha: "1-Bosqich: Dastlabki eritmadagi sof erigan modda massasi",
      matn: `m(erigan ${modda}) = m(eritma₁) × ω₁ / 100% = ${mEritma1} g × ${w1}% / 100% = ${mErigan} gramm.`,
    },
    {
      sarlavha: "2-Bosqich: Suv qo'shilgandan keyingi yangi eritma massasi",
      matn: `m(eritma₂) = m(eritma₁) + m(H₂O) = ${mEritma1} g + ${mSuv} g = ${mEritma2} gramm.`,
    },
    {
      sarlavha: "3-Bosqich: Yangi eritmaning foiz konsentratsiyasi (ω₂)",
      matn: `ω₂ = (m(erigan) / m(eritma₂)) × 100% = (${mErigan} g / ${mEritma2} g) × 100% = ${w2}%.`,
    },
  ];

  const ovozMatni = `Eritmaga suv qo'shilganda erigan modda massasi o'zgarmaydi: ${mErigan} gramm bo'lib qoladi. Yangi eritma massasi ${mEritma2} grammga yetadi. Natijada eritmaning yangi massaviy ulushi ${w2} foizni tashkil etadi.`;

  return {
    tenglama: `${mEritma1}g (${w1}%) + ${mSuv}g H₂O → ${mEritma2}g (${w2}%)`,
    bosqichlar,
    yakuniyJavob: `Yangi eritmaning massaviy ulushi: ${w2}%`,
    ovozMatni,
  };
}

// ─────────────────────────────────────────────────────────────
// 2. GAZ QONUNLARI VA N.SH. HISOBI (Gas Laws Engine)
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

// ─────────────────────────────────────────────────────────────
// 3. TERMOKIMYO HISOBI (Thermochemistry Engine)
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// 4. ATOM VA MOLEKULA TUZILISHI (Atomic & Molecular Engine)
// ─────────────────────────────────────────────────────────────
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
