import { balansTekshir } from "@/lib/chem-balance.js";

// Atomik massalar jadvali (g/mol)
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

// Pastki indekslarni oddiy songa aylantirish
function pastkiIndeksNormalize(str = "") {
  const map = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };
  return str.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => map[m] || m);
}

// Kimyoviy formula molyar massasini hisoblash (masalan: "H₂SO₄" -> 98.079 g/mol)
export function molyarMassaHisobla(formula = "") {
  const toza = pastkiIndeksNormalize(formula.trim());
  if (!toza) return 0;

  // Qavslarni va elementlarni ajratish regexi (masalan, Ca(OH)2 yoki CuSO4)
  const elementRegex = /([A-Z][a-z]*)(\d*)/g;

  // Agar qavsli formula bo'lsa (masalan Ca(OH)2 yoki Fe2(SO4)3)
  if (toza.includes("(") && toza.includes(")")) {
    const match = toza.match(/^(.*?)\((.*?)\)(\d*)$/);
    if (match) {
      const [, oldi, ichi, qavsOrqasi] = match;
      const ichkiKoeff = parseInt(qavsOrqasi || "1", 10);
      return molyarMassaHisobla(oldi) + molyarMassaHisobla(ichi) * ichkiKoeff;
    }
  }

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

// Qaydlarni va masaladagi reagentlarni avtomatik ajratish
export function masalaMatniniTahlilQil(matn = "") {
  const formulalar = [];
  const miqdorlar = [];

  // 1. Formulalar qidirish (NaOH, H2SO4, Na2SO4, HCl, KMnO4, vs.)
  const formulaRegex = /\b([A-Z][a-z]?[0-9₀₁₂₃₄₅₆₇₈₉]*)+(\([A-Z][a-z]?[0-9₀₁₂₃₄₅₆₇₈₉]*\)[0-9₀₁₂₃₄₅₆₇₈₉]*)?\b/g;
  let match;
  while ((match = formulaRegex.exec(matn)) !== null) {
    const f = match[0];
    if (f.length >= 2 && !["Va", "Bu", "Ha", "Yo", "Agar"].includes(f)) {
      if (!formulalar.includes(f)) {
        formulalar.push(f);
      }
    }
  }

  // 2. Miqdorlar (masalan: 10 g, 9.8 g, 0.5 mol, 200 ml, 5 %)
  const miqdorRegex = /(\d+(?:\.\d+)?)\s*(g|gramm|kg|mol|ml|l|litr|%)\b/gi;
  while ((match = miqdorRegex.exec(matn)) !== null) {
    miqdorlar.push({
      qiymat: parseFloat(match[1]),
      birlik: match[2].toLowerCase(),
    });
  }

  return { formulalar, miqdorlar };
}

// Stexiometrik reaksiya va cheklovchi reagentni hisoblash
export function stexiometriyaHisobla({ tenglama, reagent1, reagent2, massa1, massa2 }) {
  const M1 = molyarMassaHisobla(reagent1.formula);
  const M2 = molyarMassaHisobla(reagent2.formula);

  const n1 = massa1 / M1; // mol
  const n2 = massa2 / M2; // mol

  // Reaksiyadagi nisbatlar (masalan 2 : 1)
  const k1 = reagent1.koeff || 1;
  const k2 = reagent2.koeff || 1;

  const nisbat1 = n1 / k1;
  const nisbat2 = n2 / k2;

  let cheklovchi = null;
  let ortiqcha = null;
  let ortiqchaMassa = 0;
  let sarflanganMol = 0;

  if (nisbat1 < nisbat2) {
    cheklovchi = reagent1;
    ortiqcha = reagent2;
    sarflanganMol = nisbat1 * k2;
    ortiqchaMassa = (n2 - sarflanganMol) * M2;
  } else {
    cheklovchi = reagent2;
    ortiqcha = reagent1;
    sarflanganMol = nisbat2 * k1;
    ortiqchaMassa = (n1 - sarflanganMol) * M1;
  }

  return {
    M1,
    M2,
    n1: Math.round(n1 * 10000) / 10000,
    n2: Math.round(n2 * 10000) / 10000,
    cheklovchiFormula: cheklovchi.formula,
    ortiqchaFormula: ortiqcha.formula,
    ortiqchaMassa: Math.round(ortiqchaMassa * 100) / 100,
  };
}
