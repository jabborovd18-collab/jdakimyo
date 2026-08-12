import { balansTekshir } from "@/lib/chem-balance.js";

// ATOMIK MASSALAR JADVALI (g/mol) — IUPAC 2024
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

export function molyarMassaHisobla(formula = "") {
  const toza = pastkiIndeksNormalize(formula.trim());
  if (!toza) return 0;

  if (toza.includes("*") || toza.includes("·")) {
    const qismlar = toza.split(/[*·]/);
    const asosiy = molyarMassaHisobla(qismlar[0]);
    const suvQismi = qismlar[1] ? qismlar[1].replace(/H2O|H₂O/g, "") : "1";
    const suvMoli = parseInt(suvQismi || "1", 10);
    return Math.round((asosiy + suvMoli * 18.015) * 1000) / 1000;
  }

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

export function masalaTuriniAniqla(matn = "") {
  const m = matn.toLowerCase();
  if (m.includes("eritma") || m.includes("massaviy ulush") || m.includes("%") || m.includes("suyultir") || m.includes("kristallogidrat")) return "eritmalar";
  if (m.includes("gaz") || m.includes("litr") || m.includes("normal sharoit") || m.includes("n.sh")) return "gazlar";
  if (m.includes("issiqlik") || m.includes("kj") || m.includes("entalpiya")) return "termokimyo";
  if (m.includes("ph") || m.includes("poh") || m.includes("vodorod ko'rsatkich")) return "ph";
  if (m.includes("proton") || m.includes("neytron") || m.includes("elektron") || m.includes("molekula massasi")) return "atom";
  return "stexiometriya";
}

export function yechEritmalar(matn, tahlil) {
  const { formulalar, miqdorlar } = tahlil;
  const modda = formulalar[0] || "CuSO₄";
  const M = molyarMassaHisobla(modda) || 160;

  const grammlar = miqdorlar.filter((m) => ["g", "gramm"].includes(m.birlik));
  const foizlar = miqdorlar.filter((m) => m.birlik === "%");

  const m1 = grammlar[0]?.qiymat || 0;
  const w1 = foizlar[0]?.qiymat || 0;
  const m2 = grammlar[1]?.qiymat || 0;

  const mErigan = (m1 * w1) / 100;
  const mEritma2 = m1 + m2;
  const w2 = mEritma2 > 0 ? Math.round((mErigan / mEritma2) * 10000) / 100 : w1;

  return {
    tenglama: `${m1}g (${w1}%) + ${m2}g H₂O ➔ ${mEritma2}g (${w2}%)`,
    bosqichlar: [
      {
        sarlavha: "1-Bosqich: Sof erigan modda massasi",
        matn: `m(erigan ${modda}) = ${m1}g × ${w1}% / 100% = ${mErigan} gramm.`,
      },
      {
        sarlavha: "2-Bosqich: Yangi massaviy ulush",
        matn: `ω₂ = (${mErigan}g / ${mEritma2}g) × 100% = ${w2}%.`,
      },
    ],
    yakuniyJavob: `Yangi massaviy ulush: ${w2}%`,
    ovozMatni: `Eritmaga suv qo'shilganda erigan modda massasi ${mErigan} gramm bo'lib qoladi. Yangi eritmaning massaviy ulushi ${w2} foizni tashkil qiladi.`,
  };
}

export function yechGazlar(matn, tahlil) {
  const { formulalar, miqdorlar } = tahlil;
  const gaz = formulalar[0] || "O₂";
  const M = molyarMassaHisobla(gaz) || 32;

  const litrlar = miqdorlar.filter((m) => ["l", "litr", "ml"].includes(m.birlik));
  const hajmLitr = litrlar[0]?.qiymat || 22.4;

  const n = hajmLitr / 22.4;
  const massa = Math.round(n * M * 100) / 100;
  const dHavo = Math.round((M / 28.98) * 100) / 100;

  return {
    tenglama: `V(${gaz}) = ${hajmLitr} L (N.SH.) ➔ n = ${Math.round(n * 1000) / 1000} mol ➔ m = ${massa}g`,
    bosqichlar: [
      {
        sarlavha: "1-Bosqich: Normal sharoitda mol miqdori",
        matn: `n(${gaz}) = V / 22.4 L/mol = ${hajmLitr} L / 22.4 L/mol = ${Math.round(n * 1000) / 1000} mol.`,
      },
      {
        sarlavha: "2-Bosqich: Gaz massasi va zichligi",
        matn: `m(${gaz}) = n × M = ${massa} g.\nD(havo) = ${M} / 28.98 = ${dHavo}.`,
      },
    ],
    yakuniyJavob: `Massasi: ${massa}g | Havoga ko'ra zichligi: D(havo) = ${dHavo}`,
    ovozMatni: `${hajmLitr} litr ${gaz} gazi normal sharoitda ${massa} gramm massaga ega. Uning havoga nisbatan zichligi ${dHavo} ga teng.`,
  };
}

export function yechTermokimyo(matn, tahlil) {
  const { formulalar, miqdorlar } = tahlil;
  const modda = formulalar[0] || "C";
  const M = molyarMassaHisobla(modda) || 12;

  const kjLari = miqdorlar.filter((m) => ["kj", "kdj"].includes(m.birlik));
  const Q_molar = kjLari[0]?.qiymat || 393.5;
  const grammlar = miqdorlar.filter((m) => ["g", "gramm"].includes(m.birlik));
  const massa = grammlar[0]?.qiymat || 12;

  const n = massa / M;
  const Q_ajralgan = Math.round(n * Q_molar * 10) / 10;

  return {
    tenglama: `${modda} + O₂ → CO₂ + ${Q_molar} kJ`,
    bosqichlar: [
      {
        sarlavha: "1-Bosqich: Termokimyoviy issiqlik effekti",
        matn: `${massa} gramm (${n} mol) ${modda} yonganda: Q = ${n} mol × ${Q_molar} kJ/mol = ${Q_ajralgan} kJ.`,
      },
    ],
    yakuniyJavob: `Ajralib chiqqan issiqlik: ${Q_ajralgan} kJ`,
    ovozMatni: `${massa} gramm ${modda} yonganda ${Q_ajralgan} kiloJoul issiqlik energiyasi ajralib chiqadi.`,
  };
}

export function yechAtom(matn, tahlil) {
  const { formulalar } = tahlil;
  const modda = formulalar[0] || "H₂O";
  const M = molyarMassaHisobla(modda) || 18.015;

  const N_A = 6.022e23;
  const m1Molekula = (M / N_A).toExponential(4);

  return {
    tenglama: `M(${modda}) = ${M} g/mol | N_A = 6.022×10²³`,
    bosqichlar: [
      {
        sarlavha: "1-Bosqich: 1 ta molekula massasi (m₀)",
        matn: `m₀ = M / N_A = ${M} g/mol / (6.022 × 10²³ mol⁻¹) = ${m1Molekula} gramm.`,
      },
    ],
    yakuniyJavob: `1 ta molekula massasi m₀ = ${m1Molekula} g`,
    ovozMatni: `${modda} molekulasining molyar massasi ${M} grammga teng. 1 ta molekula massasi ${m1Molekula} grammni tashkil qiladi.`,
  };
}
